#!/bin/bash
# ==============================================================================
# EC2 Instance Setup Script — godatify-landing
# ==============================================================================
# Idempotent setup for Amazon Linux 2023 (ARM64) with Strapi backend
#
# Usage:
#   sudo ./setup-ec2.sh [--help]
#
# This script can be run multiple times safely. It checks for existing
# configuration before making changes.
#
# Instance: t4g.small (2GB RAM)
# Architecture: ARM64 (Graviton3)
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

# Database
readonly DB_NAME="strapi"
readonly DB_USER="strapi"
readonly DB_HOST="${PG_SOCKET_DIR}"

# Node.js
readonly NODE_VERSION="22"

# Strapi
readonly STRAPI_PORT="1337"
readonly HEALTH_ENDPOINT="http://localhost:${STRAPI_PORT}/_health"

# PM2
readonly PM2_CONFIG="${SCRIPTS_DIR}/ecosystem.config.js"
readonly PM2_APP_NAME="strapi"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# ==============================================================================
# Helper Functions
# ==============================================================================
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_skip() {
    echo -e "${YELLOW}[SKIP]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

show_help() {
    cat << EOF
EC2 Instance Setup Script — godatify-landing

Usage:
    sudo ./setup-ec2.sh [OPTIONS]

Options:
    --help      Show this help message

What this script does:
    1. Updates system packages
    2. Configures kernel parameters (TCP tuning, swappiness)
    3. Configures security hardening (fail2ban, automatic updates)
    4. Configures ZRAM swap (compressed memory, critical for 2GB RAM)
    5. Creates strapi system user
    6. Installs Node.js ${NODE_VERSION} via NVM (for strapi user)
    7. Installs PM2 globally (via NVM for strapi user)
    8. Configures data volume (if attached) for PostgreSQL
    9. Installs PostgreSQL ${PG_VERSION}
    10. Installs cloudflared (via Cloudflare repo, token method)
    11. Creates required directories
    12. Configures log rotation (daily, 7-day retention)
    13. Configures PostgreSQL (db/user)
    14. Sets up PM2 startup (systemd service)
    15. Generates SSH deploy key for GitHub
    16. Generates Strapi secrets (APP_KEYS, JWT, etc.)
    17. Configures convenience aliases (strapi-logs, strapi-status, etc.)
    18. Clones the repository (asks for GitHub key if needed)

This script is idempotent — safe to run multiple times.

CLOUDFLARE TUNNEL (token method):
    After setup completes, configure the tunnel:
    1. Create tunnel in Cloudflare dashboard (Networks → Tunnels)
    2. Copy the install token
    3. Run: sudo cloudflared service install <TOKEN>
    4. Configure public hostnames in the dashboard
    See docs/cloudflare-setup.md for detailed instructions.

DEPLOYMENT STRATEGY:
    This instance uses LOCAL BUILD deploys (the server is too small to build).
    After setup, deploy from your Mac:
        cd backend && make deploy   # Builds locally, syncs to server
    
    The deploy-backend.sh script is for emergencies only (git-pull hot-fixes).

Requirements:
    - Amazon Linux 2023 (ARM64)
    - Root/sudo access
    - Internet connectivity
    - (Optional) Separate EBS data volume for PostgreSQL

EOF
    exit 0
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

configure_git_safe_directory() {
    # Git 2.35.2+ introduced CVE-2022-24765 fix: refuses to operate in directories
    # owned by different users. Since /var/www/godatify is owned by strapi but
    # ec2-user runs deploy operations, both users need safe.directory configured.
    
    local dir="$APP_DIR"
    
    # Configure for ec2-user (runs deploys via rsync + git commands)
    local ec2_gitconfig="/home/ec2-user/.gitconfig"
    if [[ -f "$ec2_gitconfig" ]] && grep -q "safe.*directory.*${dir}" "$ec2_gitconfig" 2>/dev/null; then
        log_skip "git safe.directory already configured for ec2-user"
    else
        sudo -u ec2-user git config --global --add safe.directory "$dir"
        log_info "Configured git safe.directory for ec2-user → ${dir}"
    fi
    
    # Configure for strapi user (runs the app, may need git for version checks)
    local strapi_gitconfig="${STRAPI_HOME}/.gitconfig"
    if [[ -f "$strapi_gitconfig" ]] && grep -q "safe.*directory.*${dir}" "$strapi_gitconfig" 2>/dev/null; then
        log_skip "git safe.directory already configured for ${STRAPI_USER}"
    else
        sudo -u "$STRAPI_USER" git config --global --add safe.directory "$dir"
        log_info "Configured git safe.directory for ${STRAPI_USER} → ${dir}"
    fi
}

# ==============================================================================
# Main Setup Steps
# ==============================================================================

step_system_update() {
    log_info "[1/18] Updating system packages..."
    dnf update -y
    
    # Install essential tools
    # Note: curl-minimal is preinstalled on AL2023 and conflicts with full curl
    # curl-minimal is sufficient for downloads (curl -fsSL works fine)
    local packages=(git wget vim htop jq tar gzip unzip)
    for pkg in "${packages[@]}"; do
        if ! rpm -q "$pkg" &> /dev/null; then
            dnf install -y "$pkg"
        fi
    done
    log_info "System packages updated"
    
    # Set timezone to Peru (LATAM target market)
    local target_tz="America/Lima"
    local current_tz
    current_tz=$(timedatectl show --property=Timezone --value 2>/dev/null || echo "UTC")
    if [[ "$current_tz" != "$target_tz" ]]; then
        timedatectl set-timezone "$target_tz"
        log_info "Timezone set to ${target_tz}"
    else
        log_skip "Timezone already set to ${target_tz}"
    fi
}

step_configure_zram() {
    log_info "[4/18] Configuring ZRAM swap..."
    
    # ZRAM provides compressed in-memory swap, critical for t4g.small (2GB RAM).
    # Benefits:
    #   - Faster than EBS swap (CPU decompression < 3ms disk latency)
    #   - No EBS IOPS consumption (important for PostgreSQL)
    #   - ~2-4x compression on text/JSON (Strapi's primary workload)
    #   - Graceful degradation under memory pressure (compress, don't OOM)
    
    local ZRAM_CONF="/etc/systemd/zram-generator.conf"
    
    # Check if already configured
    if [[ -f "$ZRAM_CONF" ]]; then
        log_skip "ZRAM already configured at ${ZRAM_CONF}"
        
        # Verify it's actually working
        if swapon --show | grep -q "zram"; then
            local zram_size
            zram_size=$(swapon --show=SIZE,NAME --noheadings | grep zram | awk '{print $1}')
            log_info "ZRAM swap active: ${zram_size}"
        else
            log_warn "ZRAM config exists but swap not active. Attempting to start..."
            systemctl daemon-reload
            systemctl restart systemd-zram-setup@zram0.service 2>/dev/null || true
        fi
        return
    fi
    
    # Install zram-generator if not present (available in AL2023 repos)
    if ! rpm -q zram-generator &> /dev/null; then
        log_info "Installing zram-generator..."
        dnf install -y zram-generator
    fi
    
    # Create ZRAM configuration
    # - zram-size = ram / 2 → ~1GB on 2GB instance (after compression, effective ~2-4GB)
    # - compression-algorithm = zstd → best ratio for text/JSON workloads
    log_info "Creating ZRAM configuration..."
    cat > "$ZRAM_CONF" << 'ZRAMCONF'
# ZRAM configuration for godatify-landing
# t4g.small (2GB RAM) - provides compressed swap to handle memory pressure
#
# Why ZRAM over EBS swap:
#   - CPU decompression is faster than EBS disk latency (~3ms)
#   - Doesn't consume EBS IOPS (shared with PostgreSQL)
#   - zstd achieves 2-4x compression on text/JSON (Strapi workload)

[zram0]
# Size = 50% of RAM → ~1GB uncompressed, ~2-4GB effective after compression
zram-size = ram / 2

# zstd: best compression ratio for text/JSON, good speed
compression-algorithm = zstd

# Swap priority (higher = preferred over disk swap if any)
swap-priority = 100

# Filesystem type (swap is most efficient for this use case)
fs-type = swap
ZRAMCONF
    
    log_info "ZRAM config created at ${ZRAM_CONF}"
    
    # Reload systemd to pick up the new generator config
    log_info "Reloading systemd and starting ZRAM..."
    systemctl daemon-reload
    
    # The zram-generator creates a systemd unit automatically
    # Trigger it by starting the swap target or the specific device
    systemctl start /dev/zram0 2>/dev/null || systemctl start systemd-zram-setup@zram0.service 2>/dev/null || true
    
    # Give it a moment to initialize
    sleep 1
    
    # Verify ZRAM is active
    if swapon --show | grep -q "zram"; then
        local zram_size
        zram_size=$(swapon --show=SIZE,NAME --noheadings | grep zram | awk '{print $1}')
        log_success "ZRAM swap configured and active: ${zram_size}"
        
        # Show compression stats if available
        if [[ -f /sys/block/zram0/mm_stat ]]; then
            log_info "ZRAM device created at /dev/zram0"
        fi
    else
        log_warn "ZRAM configuration created but swap not yet active."
        log_warn "It will activate on next boot, or run: systemctl start systemd-zram-setup@zram0.service"
    fi
}

step_install_nodejs() {
    log_info "[6/18] Installing Node.js ${NODE_VERSION} via NVM for user ${STRAPI_USER}..."
    
    # NVM is installed per-user. We install it for strapi user since PM2 runs as strapi.
    # This makes node available whenever strapi user runs anything (including PM2).
    
    local NVM_DIR="${STRAPI_HOME}/.nvm"
    
    # Check if node is already available for strapi user
    if sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh 2>/dev/null && command -v node" &>/dev/null; then
        local current_version
        current_version=$(sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && node --version")
        log_skip "Node.js ${current_version} already installed for ${STRAPI_USER}"
        return
    fi
    
    # Install NVM for strapi user
    log_info "Installing NVM for ${STRAPI_USER}..."
    sudo -u "$STRAPI_USER" bash -c '
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    '
    
    # Install Node.js and set as default
    log_info "Installing Node.js ${NODE_VERSION} via NVM..."
    sudo -u "$STRAPI_USER" bash -c "
        export NVM_DIR=\"${NVM_DIR}\"
        source \"\${NVM_DIR}/nvm.sh\"
        nvm install ${NODE_VERSION}
        nvm alias default ${NODE_VERSION}
        nvm use default
    "
    
    # Verify installation
    local node_version
    node_version=$(sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && node --version")
    local npm_version
    npm_version=$(sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && npm --version")
    
    log_info "Node.js ${node_version} installed via NVM"
    log_info "npm ${npm_version} installed"
    log_info "NVM configured with default alias → Node.js ${NODE_VERSION}"
}

step_install_pm2() {
    log_info "[7/18] Installing PM2 for user ${STRAPI_USER}..."
    
    local NVM_DIR="${STRAPI_HOME}/.nvm"
    
    # Check if PM2 is already installed for strapi user
    if sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && command -v pm2" &>/dev/null; then
        local pm2_version
        pm2_version=$(sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && pm2 --version")
        log_skip "PM2 ${pm2_version} already installed for ${STRAPI_USER}"
        return
    fi
    
    # Install PM2 globally for strapi user via NVM
    sudo -u "$STRAPI_USER" bash -c "
        source ${NVM_DIR}/nvm.sh
        npm install -g pm2
    "
    
    local pm2_version
    pm2_version=$(sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && pm2 --version")
    log_info "PM2 ${pm2_version} installed for ${STRAPI_USER}"
}

step_configure_data_volume() {
    log_info "[8/18] Configuring data volume for PostgreSQL..."
    
    local DATA_MOUNT="/var/lib/pgsql"
    local DATA_DEVICE=""
    
    # Detect attached data volume
    # On Nitro instances (t4g.small), secondary EBS appears as /dev/nvme1n1
    # On non-Nitro instances, it appears as /dev/xvdf
    if [[ -b /dev/nvme1n1 ]]; then
        DATA_DEVICE="/dev/nvme1n1"
        log_info "Detected Nitro instance data volume: ${DATA_DEVICE}"
    elif [[ -b /dev/xvdf ]]; then
        DATA_DEVICE="/dev/xvdf"
        log_info "Detected non-Nitro data volume: ${DATA_DEVICE}"
    else
        log_warn "No data volume detected (/dev/nvme1n1 or /dev/xvdf)"
        log_warn "PostgreSQL will use root volume (not recommended for production)"
        log_warn "To add a data volume:"
        log_warn "  1. Create a gp3 EBS volume (20GB recommended)"
        log_warn "  2. Attach to this instance as /dev/sdf (appears as /dev/nvme1n1 on Nitro)"
        log_warn "  3. Re-run setup-ec2.sh"
        return 0
    fi
    
    # Check if already mounted
    if mountpoint -q "$DATA_MOUNT"; then
        log_skip "${DATA_MOUNT} already mounted"
        return 0
    fi
    
    # Check if volume has a filesystem
    local fs_type
    fs_type=$(blkid -o value -s TYPE "$DATA_DEVICE" 2>/dev/null || echo "")
    
    if [[ -z "$fs_type" ]]; then
        # Unformatted volume — format as XFS
        log_info "Formatting ${DATA_DEVICE} as XFS..."
        mkfs.xfs -f "$DATA_DEVICE"
        log_info "Volume formatted successfully"
    elif [[ "$fs_type" != "xfs" ]]; then
        log_warn "Volume ${DATA_DEVICE} has filesystem type '${fs_type}' (expected xfs)"
        log_warn "Skipping data volume configuration — manual intervention required"
        return 0
    else
        log_skip "Volume ${DATA_DEVICE} already formatted as XFS"
    fi
    
    # Check if there's existing PostgreSQL data on root
    if [[ -d "$DATA_MOUNT" ]] && [[ -f "${DATA_MOUNT}/data/PG_VERSION" ]]; then
        log_warn "╔══════════════════════════════════════════════════════════════╗"
        log_warn "║  EXISTING POSTGRESQL DATA FOUND ON ROOT VOLUME               ║"
        log_warn "╚══════════════════════════════════════════════════════════════╝"
        log_warn "PostgreSQL data exists at ${DATA_MOUNT}/data"
        log_warn "This data needs to be migrated to the data volume manually."
        log_warn ""
        log_warn "Migration steps:"
        log_warn "  1. Stop PostgreSQL: sudo systemctl stop postgresql"
        log_warn "  2. Backup data: sudo mv ${DATA_MOUNT} ${DATA_MOUNT}.backup"
        log_warn "  3. Re-run setup-ec2.sh to mount data volume"
        log_warn "  4. Copy data: sudo cp -a ${DATA_MOUNT}.backup/* ${DATA_MOUNT}/"
        log_warn "  5. Fix ownership: sudo chown -R postgres:postgres ${DATA_MOUNT}"
        log_warn "  6. Start PostgreSQL: sudo systemctl start postgresql"
        log_warn ""
        log_warn "Skipping data volume mount to preserve existing data."
        return 0
    fi
    
    # Create mount point if needed
    if [[ ! -d "$DATA_MOUNT" ]]; then
        mkdir -p "$DATA_MOUNT"
        log_info "Created mount point ${DATA_MOUNT}"
    fi
    
    # Mount the volume
    log_info "Mounting ${DATA_DEVICE} to ${DATA_MOUNT}..."
    mount "$DATA_DEVICE" "$DATA_MOUNT"
    
    # Set ownership for postgres user
    # PostgreSQL install creates the postgres user, but we need to ensure it exists first
    # If postgres user doesn't exist yet, postgresql-setup --initdb will handle ownership
    if id postgres &>/dev/null; then
        chown postgres:postgres "$DATA_MOUNT"
        chmod 700 "$DATA_MOUNT"
        log_info "Set ownership to postgres:postgres"
    else
        # postgres user doesn't exist yet — set permissive and let postgresql install fix it
        chown root:root "$DATA_MOUNT"
        chmod 777 "$DATA_MOUNT"
        log_info "postgres user not yet created — will fix ownership after PostgreSQL install"
    fi
    
    # Add to fstab for persistence (if not already there)
    local vol_uuid
    vol_uuid=$(blkid -o value -s UUID "$DATA_DEVICE")
    
    if ! grep -q "$vol_uuid" /etc/fstab; then
        log_info "Adding data volume to /etc/fstab..."
        echo "UUID=${vol_uuid}  ${DATA_MOUNT}  xfs  defaults,noatime,nodiratime  0 2" >> /etc/fstab
        log_info "Data volume will persist across reboots"
    else
        log_skip "Data volume already in /etc/fstab"
    fi
    
    log_success "Data volume configured: ${DATA_DEVICE} → ${DATA_MOUNT}"
}

step_install_postgresql() {
    log_info "[9/18] Installing PostgreSQL ${PG_VERSION}..."
    
    # Check if already installed from native AL2023 repos
    if rpm -q postgresql${PG_VERSION}-server &> /dev/null; then
        log_skip "PostgreSQL ${PG_VERSION} already installed"
    else
        # Install from native Amazon Linux 2023 repos (100% officially supported)
        # No need for PGDG repo — AL2023 includes PostgreSQL 15
        log_info "Installing PostgreSQL ${PG_VERSION} from native AL2023 repos..."
        dnf install -y postgresql${PG_VERSION}-server postgresql${PG_VERSION}-contrib
        log_info "PostgreSQL ${PG_VERSION} installed from native AL2023 repos"
    fi
    
    # Ensure data directory has correct ownership BEFORE initdb
    # This is critical when using a separate data volume
    local DATA_MOUNT="/var/lib/pgsql"
    if [[ -d "$DATA_MOUNT" ]]; then
        chown postgres:postgres "$DATA_MOUNT"
        chmod 700 "$DATA_MOUNT"
        log_info "Set ${DATA_MOUNT} ownership to postgres:postgres"
    fi
    
    # Initialize database if not already done
    if [[ ! -f "${PG_DATA_DIR}/PG_VERSION" ]]; then
        log_info "Initializing PostgreSQL database..."
        # Native AL2023 uses postgresql-setup for initialization
        postgresql-setup --initdb
    else
        log_skip "PostgreSQL data directory already initialized"
    fi
    
    # Ensure socket directory exists with correct permissions
    if [[ ! -d "$PG_SOCKET_DIR" ]]; then
        mkdir -p "$PG_SOCKET_DIR"
    fi
    chown postgres:postgres "$PG_SOCKET_DIR"
    chmod 755 "$PG_SOCKET_DIR"
    
    # Configure socket location in postgresql.conf if not already set
    if ! grep -q "^unix_socket_directories" "${PG_DATA_DIR}/postgresql.conf" 2>/dev/null; then
        log_info "Configuring PostgreSQL socket directory..."
        echo "unix_socket_directories = '${PG_SOCKET_DIR}'" >> "${PG_DATA_DIR}/postgresql.conf"
    fi
    
    # Enable and start PostgreSQL (native AL2023 service name is postgresql)
    systemctl enable "${PG_SERVICE}"
    if ! systemctl is-active --quiet "${PG_SERVICE}"; then
        systemctl start "${PG_SERVICE}"
    fi
    log_info "PostgreSQL service ${PG_SERVICE} enabled and running"
}

step_install_cloudflared() {
    log_info "[10/18] Installing cloudflared..."
    
    # Check if already installed via rpm package
    if rpm -q cloudflared &> /dev/null; then
        log_skip "cloudflared $(cloudflared --version | head -1) already installed via rpm"
        return
    fi
    
    # Install via Cloudflare's official repo (recommended method)
    log_info "Adding Cloudflare repository..."
    curl -fsSl https://pkg.cloudflare.com/cloudflared-ascii.repo | tee /etc/yum.repos.d/cloudflared.repo > /dev/null
    
    log_info "Installing cloudflared via dnf..."
    dnf install -y cloudflared
    
    log_info "cloudflared installed: $(cloudflared --version | head -1)"
    
    # Print post-install instructions for token method
    echo ""
    echo -e "${YELLOW}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  CLOUDFLARE TUNNEL - Token Method Setup                      ║${NC}"
    echo -e "${YELLOW}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "The cloudflared package is installed. To configure the tunnel:"
    echo ""
    echo "  1. Create tunnel in Cloudflare Zero Trust dashboard:"
    echo "     https://one.dash.cloudflare.com/ → Networks → Tunnels → Create"
    echo ""
    echo "  2. Select 'Cloudflared' connector, name your tunnel (e.g., godatify-api)"
    echo ""
    echo "  3. Copy the install token from the dashboard"
    echo ""
    echo "  4. Run on this server:"
    echo "     sudo cloudflared service install <TOKEN>"
    echo ""
    echo "  5. Configure public hostnames in the Cloudflare dashboard:"
    echo "     - Hostname: api.godatify.com"
    echo "     - Service: http://localhost:1337"
    echo ""
    echo "  6. Verify the tunnel is running:"
    echo "     sudo systemctl status cloudflared"
    echo "     sudo journalctl -u cloudflared -f"
    echo ""
    echo "For detailed instructions, see: docs/cloudflare-setup.md"
    echo ""
}

step_create_strapi_user() {
    log_info "[5/18] Creating strapi system user..."
    
    if id "$STRAPI_USER" &> /dev/null; then
        log_skip "User ${STRAPI_USER} already exists"
    else
        useradd --system \
            --create-home \
            --home-dir "$STRAPI_HOME" \
            --shell /bin/bash \
            --comment "Strapi CMS Service Account" \
            "$STRAPI_USER"
        log_info "User ${STRAPI_USER} created"
    fi
}

step_create_directories() {
    log_info "[11/18] Creating directories..."
    
    # Application directory
    if [[ ! -d "$APP_DIR" ]]; then
        mkdir -p "$APP_DIR"
        chown "${STRAPI_USER}:${STRAPI_USER}" "$APP_DIR"
        log_info "Created ${APP_DIR}"
    else
        log_skip "${APP_DIR} already exists"
    fi
    
    # Config directory (for secrets)
    if [[ ! -d "$CONFIG_DIR" ]]; then
        mkdir -p "$CONFIG_DIR"
        chmod 750 "$CONFIG_DIR"
        chown "root:${STRAPI_USER}" "$CONFIG_DIR"
        log_info "Created ${CONFIG_DIR}"
    else
        log_skip "${CONFIG_DIR} already exists"
    fi
    
    # Log directory
    if [[ ! -d "$LOG_DIR" ]]; then
        mkdir -p "$LOG_DIR"
        chown "${STRAPI_USER}:${STRAPI_USER}" "$LOG_DIR"
        log_info "Created ${LOG_DIR}"
    else
        log_skip "${LOG_DIR} already exists"
    fi
    
    # Issue 3: Create env file with secure permissions if it doesn't exist
    if [[ ! -f "${CONFIG_DIR}/env" ]]; then
        touch "${CONFIG_DIR}/env"
        chmod 640 "${CONFIG_DIR}/env"
        chown "root:${STRAPI_USER}" "${CONFIG_DIR}/env"
        log_success "Created ${CONFIG_DIR}/env with secure permissions (640, root:${STRAPI_USER})"
    else
        # Ensure permissions are correct even if file exists
        chmod 640 "${CONFIG_DIR}/env"
        chown "root:${STRAPI_USER}" "${CONFIG_DIR}/env"
        log_skip "${CONFIG_DIR}/env already exists (permissions verified)"
    fi
    
    # Scripts directory
    if [[ ! -d "$OPT_DIR/scripts" ]]; then
        mkdir -p "$OPT_DIR/scripts"
        log_info "Created ${OPT_DIR}/scripts"
    else
        log_skip "${OPT_DIR}/scripts already exists"
    fi
    
    # Configure git safe.directory for multi-user access (CVE-2022-24765 fix)
    # Git 2.35.2+ refuses to operate in directories owned by different users.
    # /var/www/godatify is owned by strapi, but ec2-user runs deploy operations.
    configure_git_safe_directory
}

step_configure_postgresql() {
    log_info "[13/18] Configuring PostgreSQL..."
    
    # Check if strapi database exists
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw strapi; then
        log_skip "PostgreSQL database 'strapi' already exists"
    else
        log_info "Creating PostgreSQL database and user..."
        
        # Generate a random password
        local db_password
        db_password=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
        
        # Create user and database
        sudo -u postgres psql << EOSQL
-- Create strapi role
CREATE ROLE strapi WITH LOGIN PASSWORD '${db_password}';

-- Create production database
CREATE DATABASE strapi OWNER strapi;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;

-- PostgreSQL 15+ requires explicit schema grants
\c strapi
GRANT ALL ON SCHEMA public TO strapi;
EOSQL
        
        log_info "PostgreSQL configured"
        
        # Issue 1: Write password directly to env file instead of echoing to terminal
        # This prevents the password from appearing in terminal history
        {
            echo "# Environment configuration (auto-generated by setup-ec2.sh)"
            echo "NODE_ENV=production"
            echo ""
            echo "# Database configuration"
            echo "DATABASE_CLIENT=postgres"
            echo "DATABASE_HOST=${DB_HOST}"
            echo "DATABASE_NAME=${DB_NAME}"
            echo "DATABASE_USERNAME=${DB_USER}"
            echo "DATABASE_PASSWORD=${db_password}"
        } >> "${CONFIG_DIR}/env"
        
        # Ensure secure permissions on env file
        chmod 640 "${CONFIG_DIR}/env"
        chown "root:${STRAPI_USER}" "${CONFIG_DIR}/env"
        
        log_success "Database credentials saved to ${CONFIG_DIR}/env"
        echo ""
        echo "=========================================="
        echo -e "${GREEN}DATABASE CONFIGURED${NC}"
        echo "=========================================="
        echo "Database: ${DB_NAME}"
        echo "User: ${DB_USER}"
        echo "Password: (saved to ${CONFIG_DIR}/env)"
        echo ""
        echo "Remaining env vars to add manually:"
        echo "  APP_KEYS=<generate-random-keys>"
        echo "  API_TOKEN_SALT=<generate-random-salt>"
        echo "  ADMIN_JWT_SECRET=<generate-random-secret>"
        echo "  TRANSFER_TOKEN_SALT=<generate-random-salt>"
        echo "  JWT_SECRET=<generate-random-secret>"
        echo "=========================================="
        echo ""
    fi
    
    # Configure pg_hba.conf for Unix socket auth if not done
    if ! grep -q "strapi.*scram-sha-256" "$PG_HBA"; then
        log_info "Configuring PostgreSQL authentication..."
        
        # Backup original
        cp "$PG_HBA" "${PG_HBA}.backup"
        
        # Add strapi user authentication before other local rules
        sed -i '/^local.*all.*all/i local   all             strapi                                  scram-sha-256' "$PG_HBA"
        
        # Reload PostgreSQL (native AL2023 service)
        systemctl reload "${PG_SERVICE}"
        log_info "PostgreSQL authentication configured"
    else
        log_skip "PostgreSQL authentication already configured for strapi"
    fi
}

step_setup_pm2_startup() {
    log_info "[14/18] Setting up PM2 startup..."
    
    # Check if PM2 startup is already configured
    if systemctl list-unit-files | grep -q "pm2-${STRAPI_USER}"; then
        log_skip "PM2 startup already configured"
        return
    fi
    
    local NVM_DIR="${STRAPI_HOME}/.nvm"
    
    # Get the path to pm2 binary inside NVM
    local PM2_PATH
    PM2_PATH=$(sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && which pm2")
    
    # Get the path to node binary inside NVM  
    local NODE_PATH
    NODE_PATH=$(sudo -u "$STRAPI_USER" bash -c "source ${NVM_DIR}/nvm.sh && which node")
    local NODE_BIN_DIR
    NODE_BIN_DIR=$(dirname "$NODE_PATH")
    
    # Configure PM2 to start on boot
    # pm2 startup generates a systemd service that runs as strapi user
    env PATH="${NODE_BIN_DIR}:$PATH" "$PM2_PATH" startup systemd -u "$STRAPI_USER" --hp "$STRAPI_HOME" --service-name "pm2-${STRAPI_USER}"
    
    log_info "PM2 startup configured"
    log_info "PM2 will use node from: ${NODE_BIN_DIR}"
}

step_generate_ssh_key() {
    log_info "[15/18] Generating SSH deploy key for ${STRAPI_USER}..."
    
    local SSH_KEY="${STRAPI_HOME}/.ssh/id_ed25519"
    
    if [[ -f "$SSH_KEY" ]]; then
        log_skip "SSH key already exists at ${SSH_KEY}"
        return
    fi
    
    # Create .ssh directory with correct permissions
    sudo -u "$STRAPI_USER" mkdir -p "${STRAPI_HOME}/.ssh"
    chmod 700 "${STRAPI_HOME}/.ssh"
    
    # Generate ED25519 key (no passphrase for automated deploys)
    sudo -u "$STRAPI_USER" ssh-keygen -t ed25519 -C "godatify-deploy-$(hostname)" -f "$SSH_KEY" -N ""
    
    # Configure SSH to use this key for GitHub and skip host key checking
    sudo -u "$STRAPI_USER" bash -c "cat > ${STRAPI_HOME}/.ssh/config << 'SSHCONFIG'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    StrictHostKeyChecking no
SSHCONFIG"
    chmod 600 "${STRAPI_HOME}/.ssh/config"
    
    log_info "SSH deploy key generated"
}

step_generate_strapi_secrets() {
    log_info "[16/18] Generating Strapi secrets..."
    
    # Check if secrets already exist in env file
    if grep -q "^APP_KEYS=" "$ENV_FILE" 2>/dev/null; then
        log_skip "Strapi secrets already configured in ${ENV_FILE}"
        return
    fi
    
    # Generate and append secrets
    {
        echo ""
        echo "# Strapi secrets (auto-generated by setup-ec2.sh)"
        echo "APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32)"
        echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
        echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
        echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
        echo "JWT_SECRET=$(openssl rand -base64 32)"
        echo ""
        echo "# Public URL (MUST be set after configuring Cloudflare Tunnel)"
        echo "# This is used by Strapi for redirects and absolute URLs"
        echo "PUBLIC_URL=https://api.godatify.com"
    } >> "$ENV_FILE"
    
    log_info "Strapi secrets generated and saved to ${ENV_FILE}"
    log_warn "IMPORTANT: Update PUBLIC_URL in ${ENV_FILE} if using a different domain"
}

step_clone_repository() {
    log_info "[18/18] Cloning repository..."
    
    local REPO_URL="git@github.com:Cshion/godatify-landing.git"
    local SSH_PUB_KEY="${STRAPI_HOME}/.ssh/id_ed25519.pub"
    
    # Check if already cloned
    if [[ -d "${APP_DIR}/.git" ]]; then
        log_skip "Repository already cloned at ${APP_DIR}"
        return
    fi
    
    # Test GitHub SSH connection
    # Note: ssh -T git@github.com returns exit code 1 even on success (no shell access)
    # So we capture output and check the message, not the exit code
    log_info "Testing GitHub SSH connection..."
    local ssh_output
    ssh_output=$(sudo -u "$STRAPI_USER" ssh -T git@github.com 2>&1 || true)
    
    if echo "$ssh_output" | grep -q "successfully authenticated"; then
        log_info "GitHub SSH connection successful!"
    else
        # Connection failed - show the key and ask user to add it
        echo ""
        echo -e "${YELLOW}╔══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${YELLOW}║  DEPLOY KEY - Add this to GitHub                             ║${NC}"
        echo -e "${YELLOW}╚══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        cat "$SSH_PUB_KEY"
        echo ""
        echo -e "${BLUE}To add this key to GitHub:${NC}"
        echo "  1. Go to: https://github.com/Cshion/godatify-landing/settings/keys"
        echo "  2. Click 'Add deploy key'"
        echo "  3. Title: 'godatify-ec2-deploy'"
        echo "  4. Paste the key above"
        echo "  5. Click 'Add key'"
        echo ""
        
        # Wait for user confirmation
        while true; do
            echo -n -e "${GREEN}¿Ya agregaste la deploy key a GitHub? (s/n): ${NC}"
            read -r response
            case "$response" in
                [sS]|[yY]|[sS][iI]|[yY][eE][sS])
                    log_info "Verifying GitHub connection..."
                    local verify_output
                    verify_output=$(sudo -u "$STRAPI_USER" ssh -T git@github.com 2>&1 || true)
                    if echo "$verify_output" | grep -q "successfully authenticated"; then
                        log_info "GitHub connection verified!"
                        break
                    else
                        log_error "GitHub connection still fails. Please verify the key was added correctly."
                        echo "Debug output: $verify_output"
                        echo ""
                    fi
                    ;;
                [nN]|[nN][oO])
                    log_warn "Cannot clone without deploy key. Add the key and re-run the setup."
                    return 1
                    ;;
                *)
                    echo "Please answer 's' (sí) or 'n' (no)"
                    ;;
            esac
        done
    fi
    
    # Clone the repository
    log_info "Cloning repository to ${APP_DIR}..."
    sudo -u "$STRAPI_USER" git clone "$REPO_URL" "$APP_DIR"
    
    # Note: git safe.directory is configured in step_create_directories() via
    # configure_git_safe_directory() — runs before clone and handles both users.
    
    # Copy PM2 config to /opt/godatify/scripts/
    # NOTE: deploy-backend.sh is NOT copied — we use local deploys now.
    # The server is too small to build Strapi. Deploy from Mac: make deploy
    if [[ -f "${APP_DIR}/scripts/infra/ecosystem.config.js" ]]; then
        cp "${APP_DIR}/scripts/infra/ecosystem.config.js" "${OPT_DIR}/scripts/"
        log_info "Copied ecosystem.config.js to ${OPT_DIR}/scripts/"
    fi
    
    log_success "Repository cloned successfully!"
}

step_kernel_tuning() {
    log_info "[2/18] Configuring kernel parameters for Node.js/PostgreSQL..."
    
    local SYSCTL_CONF="/etc/sysctl.d/99-godatify.conf"
    
    if [[ -f "$SYSCTL_CONF" ]]; then
        log_skip "Kernel tuning already configured at ${SYSCTL_CONF}"
        return
    fi
    
    cat > "$SYSCTL_CONF" << 'SYSCTL'
# Kernel tuning for Node.js/PostgreSQL on t4g.small (2GB RAM)
# Applied by setup-ec2.sh for godatify-landing

# Increase TCP SYN backlog (default 128 is too low)
net.ipv4.tcp_max_syn_backlog = 1024

# Reduce swappiness - prefer keeping app in RAM, use ZRAM only under pressure
vm.swappiness = 10

# TCP keepalive tuning (faster dead connection detection for DB connections)
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 5

# Increase local port range (more outbound connections)
net.ipv4.ip_local_port_range = 1024 65535

# Allow reuse of TIME_WAIT sockets (more efficient connection handling)
net.ipv4.tcp_tw_reuse = 1
SYSCTL

    sysctl -p "$SYSCTL_CONF"
    log_success "Kernel parameters configured"
}

step_security_hardening() {
    log_info "[3/18] Configuring security hardening..."
    
    # fail2ban for SSH protection
    if ! rpm -q fail2ban &> /dev/null; then
        log_info "Installing fail2ban..."
        dnf install -y fail2ban
    else
        log_skip "fail2ban already installed"
    fi
    
    # Configure fail2ban jail for SSH
    local JAIL_CONF="/etc/fail2ban/jail.local"
    if [[ ! -f "$JAIL_CONF" ]]; then
        cat > "$JAIL_CONF" << 'JAILCONF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/secure
maxretry = 3
JAILCONF
        log_info "fail2ban SSH jail configured"
    else
        log_skip "fail2ban jail already configured"
    fi
    
    systemctl enable fail2ban
    systemctl start fail2ban
    log_success "fail2ban enabled and active"
    
    # Automatic security updates
    if ! rpm -q dnf-automatic &> /dev/null; then
        log_info "Installing dnf-automatic for security updates..."
        dnf install -y dnf-automatic
    else
        log_skip "dnf-automatic already installed"
    fi
    
    # Enable automatic updates
    sed -i 's/apply_updates = no/apply_updates = yes/' /etc/dnf/automatic.conf 2>/dev/null || true
    systemctl enable --now dnf-automatic.timer
    log_success "Automatic security updates enabled"
}

step_logrotate() {
    log_info "[12/18] Configuring log rotation for Strapi..."
    
    local LOGROTATE_CONF="/etc/logrotate.d/strapi"
    
    if [[ -f "$LOGROTATE_CONF" ]]; then
        log_skip "Logrotate already configured at ${LOGROTATE_CONF}"
        return
    fi
    
    # Ensure log directory exists (created by step_create_directories, but be safe)
    mkdir -p "${LOG_DIR}"
    chown "${STRAPI_USER}:${STRAPI_USER}" "${LOG_DIR}"
    
    cat > "$LOGROTATE_CONF" << LOGROTATE
/var/log/strapi/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 640 ${STRAPI_USER} ${STRAPI_USER}
    postrotate
        ${STRAPI_HOME}/.nvm/versions/node/v${NODE_VERSION}*/bin/pm2 reloadLogs > /dev/null 2>&1 || true
    endscript
    sharedscripts
    dateext
    dateformat -%Y%m%d
    maxage 30
}
LOGROTATE

    chmod 644 "$LOGROTATE_CONF"
    log_success "Strapi logrotate configured"
}

step_configure_aliases() {
    log_info "[17/18] Configuring convenience aliases..."
    
    local BASHRC="/home/ec2-user/.bashrc"
    local ALIAS_MARKER="# godatify aliases"
    
    # Check if aliases already exist
    if grep -q "$ALIAS_MARKER" "$BASHRC" 2>/dev/null; then
        log_skip "Aliases already configured in ${BASHRC}"
        return
    fi
    
    # Add aliases to ec2-user's .bashrc
    cat >> "$BASHRC" << 'ALIASES'

# godatify aliases
alias strapi-env='sudo cat /etc/strapi/env'
alias strapi-env-edit='sudo vim /etc/strapi/env'
alias strapi-logs='sudo -u strapi bash -c "source ~/.nvm/nvm.sh && pm2 logs strapi"'
alias strapi-status='sudo -u strapi bash -c "source ~/.nvm/nvm.sh && pm2 status"'
alias strapi-restart='sudo -u strapi bash -c "source ~/.nvm/nvm.sh && pm2 restart strapi"'
# NOTE: Standard deploys run from Mac via 'make deploy' (local build strategy)
# Server-side deploy-backend.sh is for emergencies only (git pull hot-fixes)
ALIASES

    log_info "Aliases configured. Available commands:"
    log_info "  strapi-env        - View environment variables"
    log_info "  strapi-env-edit   - Edit environment variables"
    log_info "  strapi-logs       - View Strapi logs"
    log_info "  strapi-status     - Check PM2 status"
    log_info "  strapi-restart    - Restart Strapi"
    log_info ""
    log_info "Deployment: Run 'make deploy' from your Mac (local build strategy)"
}

# ==============================================================================
# Main
# ==============================================================================
main() {
    # Parse arguments
    for arg in "$@"; do
        case $arg in
            --help)
                show_help
                ;;
            *)
                log_error "Unknown argument: $arg"
                show_help
                ;;
        esac
    done
    
    check_root
    
    echo ""
    echo "=========================================="
    echo "godatify-landing EC2 Instance Setup"
    echo "Timestamp: $(date -Iseconds)"
    echo "=========================================="
    echo ""
    
    step_system_update
    step_kernel_tuning            # Optimize kernel for Node.js/PostgreSQL
    step_security_hardening       # fail2ban, automatic updates
    step_configure_zram           # ZRAM swap before memory-hungry apps
    step_create_strapi_user       # Must be before Node.js (NVM is per-user)
    step_install_nodejs           # Installs NVM + Node.js for strapi user
    step_install_pm2              # Installs PM2 via NVM for strapi user
    step_configure_data_volume    # Configure EBS data volume BEFORE PostgreSQL
    step_install_postgresql
    step_install_cloudflared
    step_create_directories
    step_logrotate                # Log rotation (after directories exist)
    step_configure_postgresql
    step_setup_pm2_startup
    step_generate_ssh_key         # Generate SSH key for git clone
    step_generate_strapi_secrets  # Generate APP_KEYS, JWT_SECRET, etc.
    step_configure_aliases        # Add convenience aliases to ec2-user
    step_clone_repository         # Clone repo (asks for GitHub key if needed)
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}Setup Complete!${NC}"
    echo "=========================================="
    echo ""
    
    echo -e "${YELLOW}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  AVAILABLE COMMANDS (run 'source ~/.bashrc' first)           ║${NC}"
    echo -e "${YELLOW}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  strapi-env        - View environment variables (/etc/strapi/env)"
    echo "  strapi-env-edit   - Edit environment variables"
    echo "  strapi-logs       - View Strapi logs (real-time)"
    echo "  strapi-status     - Check PM2 process status"
    echo "  strapi-restart    - Restart Strapi"
    echo ""
    echo -e "${BLUE}Deployment (LOCAL BUILD STRATEGY):${NC}"
    echo "  From your Mac:  cd backend && make deploy"
    echo "  (Server is too small to build — deploys build locally, sync via rsync)"
    echo ""
    
    # Check if repo was cloned successfully
    if [[ -d "${APP_DIR}/.git" ]]; then
        echo -e "${BLUE}Next steps:${NC}"
        echo "  1. Configure Cloudflare Tunnel (see docs/cloudflare-setup.md)"
        echo "  2. From your Mac, run first deploy:"
        echo "     cd backend && make deploy"
        echo ""
    else
        echo -e "${BLUE}Next steps:${NC}"
        echo "  1. Add the deploy key to GitHub"
        echo "  2. Re-run this setup or clone manually:"
        echo "     sudo -u strapi git clone git@github.com:Cshion/godatify-landing.git ${APP_DIR}"
        echo "  3. Configure Cloudflare Tunnel (see docs/cloudflare-setup.md)"
        echo "  4. From your Mac, run first deploy:"
        echo "     cd backend && make deploy"
        echo ""
    fi
}

main "$@"
