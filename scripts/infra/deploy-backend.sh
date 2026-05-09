#!/bin/bash
# ==============================================================================
# Backend Deployment Script — godatify-landing
# ==============================================================================
# Deploys the Strapi backend to EC2
#
# Usage:
#   ./deploy-backend.sh [OPTIONS]
#
# Options:
#   --branch BRANCH     Git branch to deploy (default: main)
#   --env ENV           Environment (default: production)
#   --skip-build        Skip npm run build step
#   --help              Show this help message
#
# This script should be run on the EC2 instance after setup-ec2.sh
# ==============================================================================

set -euo pipefail

# ==============================================================================
# Shared Configuration — godatify-landing
# ==============================================================================
# These variables MUST be consistent across all infra scripts

# Application
readonly APP_NAME="godatify"
readonly APP_DIR="/var/www/godatify"
readonly BACKEND_DIR="${APP_DIR}/backend"

# Users
readonly STRAPI_USER="strapi"
readonly STRAPI_HOME="/home/strapi"

# Paths
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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

# Default options
BRANCH="main"
ENVIRONMENT="production"
SKIP_BUILD=false

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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

show_help() {
    cat << EOF
Backend Deployment Script — godatify-landing

Usage:
    ./deploy-backend.sh [OPTIONS]

Options:
    --branch BRANCH     Git branch to deploy (default: main)
    --env ENV           Environment name (default: production)
    --skip-build        Skip the npm run build step
    --help              Show this help message

Examples:
    ./deploy-backend.sh
    ./deploy-backend.sh --branch develop
    ./deploy-backend.sh --branch main --skip-build

What this script does:
    1. Checks prerequisites (Node.js, PM2, PostgreSQL)
    2. Pulls latest code from git
    3. Installs npm dependencies
    4. Runs Strapi build (unless --skip-build)
    5. Copies PM2 ecosystem config
    6. Restarts PM2
    7. Performs health check

Requirements:
    - Run setup-ec2.sh first
    - Environment file at /etc/strapi/env
    - Git repository cloned to /var/www/godatify

EOF
    exit 0
}

check_prerequisites() {
    log_step "Checking prerequisites..."
    
    local has_error=false
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js not installed. Run setup-ec2.sh first."
        has_error=true
    else
        log_info "Node.js $(node --version) ✓"
    fi
    
    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 not installed. Run setup-ec2.sh first."
        has_error=true
    else
        log_info "PM2 $(pm2 --version) ✓"
    fi
    
    # Check PostgreSQL using pg_isready with correct native AL2023 socket path
    if ! pg_isready -h "${PG_SOCKET_DIR}" -q 2>/dev/null; then
        log_error "PostgreSQL not accepting connections."
        log_error "Check status: sudo systemctl status ${PG_SERVICE}"
        log_error "Start if needed: sudo systemctl start ${PG_SERVICE}"
        has_error=true
    else
        log_info "PostgreSQL accepting connections ✓"
    fi
    
    # Check environment file
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file not found: ${ENV_FILE}"
        log_error "Create it with database credentials and Strapi secrets."
        has_error=true
    else
        log_info "Environment file exists ✓"
    fi
    
    # Check strapi user
    if ! id "$STRAPI_USER" &> /dev/null; then
        log_error "User ${STRAPI_USER} not found. Run setup-ec2.sh first."
        has_error=true
    else
        log_info "User ${STRAPI_USER} exists ✓"
    fi
    
    if [[ "$has_error" == true ]]; then
        exit 1
    fi
}

pull_latest_code() {
    log_step "Pulling latest code (branch: ${BRANCH})..."
    
    if [[ ! -d "${APP_DIR}/.git" ]]; then
        log_error "Git repository not found at ${APP_DIR}"
        log_error "Clone the repository first:"
        log_error "  git clone <repo-url> ${APP_DIR}"
        exit 1
    fi
    
    cd "$APP_DIR"
    
    # Fetch and checkout
    sudo -u "$STRAPI_USER" git fetch origin
    sudo -u "$STRAPI_USER" git checkout "$BRANCH"
    sudo -u "$STRAPI_USER" git pull origin "$BRANCH"
    
    local commit_hash
    commit_hash=$(git rev-parse --short HEAD)
    log_info "Checked out ${BRANCH} at ${commit_hash}"
}

install_dependencies() {
    log_step "Installing npm dependencies..."
    
    cd "$BACKEND_DIR"
    
    # Clean install for production
    sudo -u "$STRAPI_USER" npm ci --omit=dev
    
    log_info "Dependencies installed"
}

build_strapi() {
    if [[ "$SKIP_BUILD" == true ]]; then
        log_warn "Skipping build (--skip-build flag set)"
        return
    fi
    
    log_step "Building Strapi..."
    
    cd "$BACKEND_DIR"
    
    # Load environment variables for build
    # The env file is owned by root:strapi with 640 permissions
    # If running as root, we can source directly; otherwise use sudo cat
    if [[ -r "$ENV_FILE" ]]; then
        set -a
        source "$ENV_FILE"
        set +a
    elif [[ -f "$ENV_FILE" ]]; then
        log_info "Loading environment via sudo (file not directly readable)"
        while IFS='=' read -r key value; do
            [[ -z "$key" || "$key" =~ ^# ]] && continue
            export "$key=$value"
        done < <(sudo cat "$ENV_FILE")
    fi
    
    # Run build as strapi user
    sudo -u "$STRAPI_USER" -E npm run build
    
    log_info "Strapi build complete"
}

copy_pm2_config() {
    log_step "Copying PM2 ecosystem config..."
    
    local source_config="${SCRIPT_DIR}/ecosystem.config.js"
    
    if [[ ! -f "$source_config" ]]; then
        log_warn "Ecosystem config not found at ${source_config}"
        log_warn "Using existing config at ${PM2_CONFIG}"
        return
    fi
    
    # Ensure directory exists
    mkdir -p "$(dirname "$PM2_CONFIG")"
    
    # Copy config
    cp "$source_config" "$PM2_CONFIG"
    chown "root:${STRAPI_USER}" "$PM2_CONFIG"
    chmod 644 "$PM2_CONFIG"
    
    log_info "PM2 config copied to ${PM2_CONFIG}"
}

restart_pm2() {
    log_step "Restarting Strapi via PM2..."
    
    # Switch to strapi user for PM2 operations
    cd "$BACKEND_DIR"
    
    # Issue 4: PM2 does NOT support env_file - must source env vars before PM2 commands
    # Load environment variables so PM2 picks them up
    # The env file is owned by root:strapi with 640 permissions
    if [[ -r "$ENV_FILE" ]]; then
        log_info "Loading environment from ${ENV_FILE}"
        set -a
        source "$ENV_FILE"
        set +a
    elif [[ -f "$ENV_FILE" ]]; then
        log_info "Loading environment via sudo (file not directly readable)"
        while IFS='=' read -r key value; do
            [[ -z "$key" || "$key" =~ ^# ]] && continue
            export "$key=$value"
        done < <(sudo cat "$ENV_FILE")
    else
        log_warn "Environment file not found: ${ENV_FILE}"
    fi
    
    # Check if strapi is already running in PM2
    if sudo -u "$STRAPI_USER" pm2 describe "${PM2_APP_NAME}" &> /dev/null; then
        # Graceful reload with updated environment
        sudo -u "$STRAPI_USER" -E pm2 reload "${PM2_APP_NAME}" --update-env
        log_info "Strapi reloaded (zero-downtime)"
    else
        # First start - pass environment to pm2 start
        sudo -u "$STRAPI_USER" -E pm2 start "$PM2_CONFIG" --env production
        sudo -u "$STRAPI_USER" pm2 save
        log_info "Strapi started"
    fi
    
    # Show status
    sudo -u "$STRAPI_USER" pm2 status
}

health_check() {
    log_step "Running health check..."
    
    local max_attempts=30
    local attempt=1
    
    echo -n "Waiting for Strapi to be healthy"
    
    while [[ $attempt -le $max_attempts ]]; do
        # Strapi's /_health endpoint returns HTTP 204 No Content when healthy
        local http_code
        http_code=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_ENDPOINT}" 2>/dev/null || echo "000")
        if [[ "$http_code" == "204" ]]; then
            echo ""
            log_info "Health check passed (HTTP 204) ✓"
            return 0
        fi
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    echo ""
    log_error "Health check failed after ${max_attempts} attempts"
    log_error "Check logs: pm2 logs ${PM2_APP_NAME}"
    return 1
}

# ==============================================================================
# Main
# ==============================================================================
main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --branch)
                BRANCH="$2"
                shift 2
                ;;
            --env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --help)
                show_help
                ;;
            *)
                log_error "Unknown argument: $1"
                show_help
                ;;
        esac
    done
    
    echo ""
    echo "=========================================="
    echo "godatify-landing Backend Deployment"
    echo "=========================================="
    echo "Branch: ${BRANCH}"
    echo "Environment: ${ENVIRONMENT}"
    echo "Skip Build: ${SKIP_BUILD}"
    echo "Timestamp: $(date -Iseconds)"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    pull_latest_code
    install_dependencies
    build_strapi
    copy_pm2_config
    restart_pm2
    health_check
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}Deployment Complete!${NC}"
    echo "=========================================="
    echo ""
    echo "Strapi is running at http://localhost:1337"
    echo ""
    echo "Useful commands:"
    echo "  pm2 logs strapi        # View logs"
    echo "  pm2 monit              # Real-time monitoring"
    echo "  pm2 reload strapi      # Zero-downtime restart"
    echo ""
}

main "$@"
