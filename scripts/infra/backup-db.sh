#!/bin/bash
# ==============================================================================
# PostgreSQL Backup Script — godatify-landing
# ==============================================================================
# Creates compressed pg_dump backups and uploads to S3 Glacier Instant Retrieval
#
# Schedule via cron:
#   0 4 * * * /opt/godatify/scripts/backup-db.sh >> /var/log/godatify-backup.log 2>&1
#
# Or via systemd timer (recommended):
#   sudo cp backup-db.service /etc/systemd/system/
#   sudo cp backup-db.timer /etc/systemd/system/
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now backup-db.timer
#   systemctl list-timers backup-db.timer
#
# CloudWatch Alarm Setup (Issue 2):
#   Create an alarm on the godatify/Backups namespace to alert on failed backups:
#   - Metric: BackupSuccess
#   - Statistic: Maximum
#   - Period: 1 day
#   - Condition: BackupSuccess < 1
#   - Actions: SNS topic → email/Slack notification
#
#   AWS CLI example:
#   aws cloudwatch put-metric-alarm \
#     --alarm-name "godatify-backup-failed" \
#     --metric-name BackupSuccess \
#     --namespace "godatify/Backups" \
#     --statistic Maximum \
#     --period 86400 \
#     --evaluation-periods 1 \
#     --threshold 1 \
#     --comparison-operator LessThanThreshold \
#     --alarm-actions arn:aws:sns:us-east-1:ACCOUNT:alerts \
#     --dimensions Name=Database,Value=strapi
#
# Requirements:
#   - AWS CLI configured with S3 write access
#   - PostgreSQL client tools (pg_dump)
#   - Sufficient disk space in staging directory
#
# Environment variables (optional):
#   BACKUP_BUCKET    - S3 bucket name (default: godatify-backups)
#   BACKUP_PREFIX    - S3 prefix (default: postgres/)
#   BACKUP_STAGING   - Local staging dir (default: /var/lib/pgsql/backups)
#   BACKUP_RETENTION - Days to keep local backups (default: 7)
#   DB_NAME          - Database name (default: strapi)
#   DB_HOST          - Database host (default: /var/run/postgresql)
# ==============================================================================

set -euo pipefail

# ==============================================================================
# Shared Configuration — godatify-landing
# ==============================================================================
# These variables MUST be consistent across all infra scripts

# Application
readonly APP_NAME="godatify"
readonly APP_DIR="/var/www/godatify"

# Users
readonly STRAPI_USER="strapi"
readonly STRAPI_HOME="/home/strapi"

# Paths
readonly CONFIG_DIR="/etc/strapi"
readonly ENV_FILE="${CONFIG_DIR}/env"
readonly LOG_DIR="/var/log/strapi"
readonly OPT_DIR="/opt/godatify"
readonly SCRIPTS_DIR="${OPT_DIR}/scripts"

# PostgreSQL (Native Amazon Linux 2023)
# PostgreSQL 15 is available in native AL2023 repos — officially supported by AWS.
# Paths follow AL2023 native conventions: /var/lib/pgsql/data (no version in path)
readonly PG_VERSION="15"
readonly PG_DATA_DIR="/var/lib/pgsql/data"
readonly PG_SOCKET_DIR="/var/run/postgresql"
readonly PG_BIN_DIR="/usr/bin"
readonly PG_SERVICE="postgresql"
readonly PG_HBA="${PG_DATA_DIR}/pg_hba.conf"
readonly PG_BACKUP_DIR="/var/lib/pgsql/backups"

# ==============================================================================
# Backup Configuration
# ==============================================================================
readonly SCRIPT_NAME="$(basename "$0")"
readonly TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
readonly DATE_PATH="$(date +%Y/%m)"

# Defaults (can be overridden by environment)
: "${BACKUP_BUCKET:=godatify-backups}"
: "${BACKUP_PREFIX:=postgres}"
: "${BACKUP_STAGING:=${PG_BACKUP_DIR}}"
: "${BACKUP_RETENTION:=7}"
: "${DB_NAME:=strapi}"
: "${DB_HOST:=${PG_SOCKET_DIR}}"

# Derived paths
readonly BACKUP_FILE="${DB_NAME}_${TIMESTAMP}.dump"
readonly BACKUP_PATH="${BACKUP_STAGING}/${BACKUP_FILE}"
readonly S3_PATH="s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${DATE_PATH}/${BACKUP_FILE}.gz"

# Logging
log() {
    echo "[$(date -Iseconds)] [$1] $2"
}

log_info() { log "INFO" "$1"; }
log_warn() { log "WARN" "$1"; }
log_error() { log "ERROR" "$1" >&2; }

# ==============================================================================
# Pre-flight Checks
# ==============================================================================
preflight() {
    log_info "Starting backup: $SCRIPT_NAME"
    log_info "Database: $DB_NAME"
    log_info "Destination: $S3_PATH"

    # Check pg_dump is available (native AL2023 installs to /usr/bin/)
    if ! command -v pg_dump &> /dev/null; then
        # Try native AL2023 path (fallback if not in PATH)
        if [[ -x "${PG_BIN_DIR}/pg_dump" ]]; then
            export PATH="${PG_BIN_DIR}:$PATH"
            log_info "Added ${PG_BIN_DIR} to PATH"
        else
            log_error "pg_dump not found in PATH or ${PG_BIN_DIR}"
            exit 1
        fi
    fi

    # Check aws cli is available
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found in PATH"
        exit 1
    fi

    # Check staging directory exists and is writable
    if [ ! -d "$BACKUP_STAGING" ]; then
        log_info "Creating staging directory: $BACKUP_STAGING"
        mkdir -p "$BACKUP_STAGING"
        chown postgres:postgres "$BACKUP_STAGING"
    fi

    if [ ! -w "$BACKUP_STAGING" ]; then
        log_error "Staging directory not writable: $BACKUP_STAGING"
        exit 1
    fi

    # Check disk space (need at least 1GB free)
    local free_space
    free_space=$(df -BG "$BACKUP_STAGING" | awk 'NR==2 {print $4}' | tr -d 'G')
    if [ "$free_space" -lt 1 ]; then
        log_error "Insufficient disk space: ${free_space}GB free (need 1GB)"
        exit 1
    fi
    log_info "Disk space OK: ${free_space}GB free"

    # Verify PostgreSQL is running using native AL2023 socket path
    if ! sudo -u postgres pg_isready -h "$DB_HOST" -q; then
        log_error "PostgreSQL is not running or not accepting connections"
        log_error "Check status: sudo systemctl status ${PG_SERVICE}"
        exit 1
    fi
    log_info "PostgreSQL connection OK"
}

# ==============================================================================
# Create Backup
# ==============================================================================
create_backup() {
    log_info "Creating backup..."
    
    local start_time
    start_time=$(date +%s)

    # Use pg_dump with custom format (supports compression and parallel restore)
    # -Fc = custom format (compressed)
    # -Z 6 = compression level (6 is good balance of speed/size)
    # -j 2 = parallel jobs (match vCPU count)
    if ! sudo -u postgres pg_dump \
        --host="$DB_HOST" \
        --dbname="$DB_NAME" \
        --format=custom \
        --compress=6 \
        --verbose \
        --file="$BACKUP_PATH" 2>&1; then
        log_error "pg_dump failed"
        exit 1
    fi

    local end_time duration size
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    size=$(du -h "$BACKUP_PATH" | cut -f1)

    log_info "Backup created: $BACKUP_PATH"
    log_info "Size: $size, Duration: ${duration}s"
    
    # Issue 2: Verify backup integrity
    verify_backup

    # Create a symlink to latest backup
    ln -sf "$BACKUP_PATH" "${BACKUP_STAGING}/latest.dump"
}

# ==============================================================================
# Verify Backup (Issue 2)
# ==============================================================================
verify_backup() {
    log_info "Verifying backup integrity..."
    
    # Check 1: File exists and has content
    if [[ ! -f "$BACKUP_PATH" ]]; then
        log_error "Backup file not found: $BACKUP_PATH"
        exit 1
    fi
    
    local file_size
    file_size=$(stat -c %s "$BACKUP_PATH" 2>/dev/null || stat -f %z "$BACKUP_PATH" 2>/dev/null)
    
    if [[ "$file_size" -eq 0 ]]; then
        log_error "Backup file is empty (0 bytes)"
        exit 1
    fi
    log_info "Backup file size: ${file_size} bytes ✓"
    
    # Check 2: Use pg_restore --list to verify backup is readable
    # This validates the backup format without actually restoring
    if ! pg_restore --list "$BACKUP_PATH" > /dev/null 2>&1; then
        log_error "Backup verification failed: pg_restore --list could not read the backup"
        log_error "The backup file may be corrupted"
        exit 1
    fi
    log_info "Backup format verified (pg_restore --list) ✓"
    
    # Check 3: Count objects in backup for sanity check
    local object_count
    object_count=$(pg_restore --list "$BACKUP_PATH" 2>/dev/null | wc -l)
    log_info "Backup contains ${object_count} objects ✓"
    
    if [[ "$object_count" -lt 10 ]]; then
        log_warn "Warning: Backup contains fewer than 10 objects - verify this is expected"
    fi
    
    log_info "Backup verification complete ✓"
}

# ==============================================================================
# Upload to S3
# ==============================================================================
upload_to_s3() {
    log_info "Uploading to S3..."
    
    local start_time
    start_time=$(date +%s)

    # Compress with gzip before upload (additional compression)
    # pg_dump -Fc already compresses, but gzip adds ~10-20% more
    if ! gzip -c "$BACKUP_PATH" | aws s3 cp - "$S3_PATH" \
        --storage-class GLACIER_IR \
        --expected-size $(stat -c %s "$BACKUP_PATH") \
        --only-show-errors; then
        log_error "S3 upload failed"
        exit 1
    fi

    local end_time duration
    end_time=$(date +%s)
    duration=$((end_time - start_time))

    log_info "Upload complete: $S3_PATH"
    log_info "Upload duration: ${duration}s"

    # Verify upload
    if ! aws s3 ls "$S3_PATH" &> /dev/null; then
        log_error "Upload verification failed"
        exit 1
    fi
    log_info "Upload verified"
}

# ==============================================================================
# Cleanup Old Backups
# ==============================================================================
cleanup_local() {
    log_info "Cleaning up local backups older than ${BACKUP_RETENTION} days..."
    
    local count
    count=$(find "$BACKUP_STAGING" -name "${DB_NAME}_*.dump" -type f -mtime +${BACKUP_RETENTION} | wc -l)
    
    if [ "$count" -gt 0 ]; then
        find "$BACKUP_STAGING" -name "${DB_NAME}_*.dump" -type f -mtime +${BACKUP_RETENTION} -delete
        log_info "Deleted $count old backup(s)"
    else
        log_info "No old backups to delete"
    fi

    # Show current backup count
    local current_count
    current_count=$(find "$BACKUP_STAGING" -name "${DB_NAME}_*.dump" -type f | wc -l)
    log_info "Current local backups: $current_count"
}

# ==============================================================================
# Record Metrics (Optional)
# ==============================================================================
record_metrics() {
    # If CloudWatch agent is installed, publish custom metrics
    if command -v aws &> /dev/null; then
        local backup_size
        backup_size=$(stat -c %s "$BACKUP_PATH")
        
        aws cloudwatch put-metric-data \
            --namespace "godatify/Backups" \
            --metric-name "BackupSize" \
            --value "$backup_size" \
            --unit "Bytes" \
            --dimensions "Database=$DB_NAME" \
            2>/dev/null || true

        aws cloudwatch put-metric-data \
            --namespace "godatify/Backups" \
            --metric-name "BackupSuccess" \
            --value "1" \
            --unit "Count" \
            --dimensions "Database=$DB_NAME" \
            2>/dev/null || true
    fi
}

# ==============================================================================
# Error Handler
# ==============================================================================
on_error() {
    local line_no=$1
    log_error "Backup failed at line $line_no"
    
    # Clean up partial backup file
    [ -f "$BACKUP_PATH" ] && rm -f "$BACKUP_PATH"
    
    # Record failure metric
    if command -v aws &> /dev/null; then
        aws cloudwatch put-metric-data \
            --namespace "godatify/Backups" \
            --metric-name "BackupSuccess" \
            --value "0" \
            --unit "Count" \
            --dimensions "Database=$DB_NAME" \
            2>/dev/null || true
    fi
    
    exit 1
}

trap 'on_error $LINENO' ERR

# ==============================================================================
# Main
# ==============================================================================
main() {
    local total_start total_end total_duration
    total_start=$(date +%s)

    log_info "=========================================="
    log_info "Starting godatify database backup"
    log_info "=========================================="

    preflight
    create_backup
    upload_to_s3
    cleanup_local
    record_metrics

    total_end=$(date +%s)
    total_duration=$((total_end - total_start))

    log_info "=========================================="
    log_info "Backup completed successfully"
    log_info "Total duration: ${total_duration}s"
    log_info "=========================================="
}

# Run main function
main "$@"
