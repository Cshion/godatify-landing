#!/bin/bash
# ==============================================================================
# Local Deploy Script — godatify-landing
# ==============================================================================
# Run this from your Mac to deploy the backend to EC2.
# Builds locally, syncs to server, installs deps, and reloads PM2.
#
# Usage:
#   ./deploy-local.sh [OPTIONS]
#
# Options:
#   --dry-run           Show what would be deployed without doing it
#   --skip-build        Skip local build (use existing dist/)
#   --help              Show this help message
#
# Environment variables (or edit defaults below):
#   EC2_HOST            Server IP/hostname
#   EC2_KEY             Path to SSH key
#   EC2_USER            SSH user (default: ec2-user)
#   EC2_PORT            SSH port (default: 22)
# ==============================================================================

set -euo pipefail

# ==============================================================================
# Configuration — Edit these for your environment
# ==============================================================================

# Server connection (defaults - override via env vars or edit here)
EC2_HOST="${EC2_HOST:-3.231.69.176}"
EC2_KEY="${EC2_KEY:-$HOME/Cshion/Datify/datify-landing-key.pem}"
EC2_USER="${EC2_USER:-ec2-user}"
EC2_PORT="${EC2_PORT:-22}"

# Remote paths
REMOTE_PATH="/var/www/godatify/backend"
STRAPI_USER="strapi"

# Script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/../../backend" && pwd)"

# Options
DRY_RUN=false
SKIP_BUILD=false

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

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
Local Deploy Script — godatify-landing

Deploys the Strapi backend from your Mac to EC2.
Builds locally (ARM64 → ARM64 compatible), syncs, and reloads.

Usage:
    ./deploy-local.sh [OPTIONS]

Options:
    --dry-run           Show what would be synced (rsync dry-run)
    --skip-build        Skip npm run build (use existing dist/)
    --help              Show this help message

Environment variables:
    EC2_HOST            Server IP (default: ${EC2_HOST})
    EC2_KEY             SSH key path (default: ${EC2_KEY})
    EC2_USER            SSH user (default: ${EC2_USER})
    EC2_PORT            SSH port (default: ${EC2_PORT})

Examples:
    ./deploy-local.sh                         # Full deploy
    ./deploy-local.sh --dry-run               # Preview changes
    ./deploy-local.sh --skip-build            # Deploy without rebuilding
    EC2_HOST=1.2.3.4 ./deploy-local.sh        # Custom host

EOF
    exit 0
}

check_prerequisites() {
    # Check SSH key exists
    if [[ ! -f "$EC2_KEY" ]]; then
        log_error "SSH key not found: ${EC2_KEY}"
        log_error "Set EC2_KEY environment variable or edit this script."
        exit 1
    fi

    # Check backend directory
    if [[ ! -d "$BACKEND_DIR" ]]; then
        log_error "Backend directory not found: ${BACKEND_DIR}"
        exit 1
    fi

    # Check we can connect
    log_info "Testing SSH connection to ${EC2_HOST}..."
    if ! ssh -i "$EC2_KEY" -p "$EC2_PORT" -o ConnectTimeout=5 -o BatchMode=yes "$EC2_USER@$EC2_HOST" "echo ok" &>/dev/null; then
        log_error "Cannot connect to ${EC2_USER}@${EC2_HOST}:${EC2_PORT}"
        log_error "Check your EC2_HOST, EC2_KEY, and security group settings."
        exit 1
    fi
    log_info "SSH connection OK"
}

build_locally() {
    if [[ "$SKIP_BUILD" == "true" ]]; then
        log_warn "Skipping build (--skip-build)"
        return
    fi

    log_step "Building Strapi locally..."
    cd "$BACKEND_DIR"
    
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies first..."
        npm install
    fi
    
    npm run build
    log_info "Build complete"
}

sync_to_server() {
    log_step "Syncing to server..."
    cd "$BACKEND_DIR"

    local rsync_opts="-avz --delete"
    if [[ "$DRY_RUN" == "true" ]]; then
        rsync_opts="-avzn --delete"
        log_warn "DRY RUN - showing what would be synced:"
    fi

    # Use sudo rsync with --chown to write files directly as strapi user
    # This is cleaner than rsync + separate chown step
    rsync $rsync_opts \
        --exclude 'node_modules' \
        --exclude '.cache' \
        --exclude '.tmp' \
        --exclude '.env' \
        --exclude '*.log' \
        --exclude '.git' \
        --rsync-path="sudo rsync" \
        --chown="${STRAPI_USER}:${STRAPI_USER}" \
        -e "ssh -i ${EC2_KEY} -p ${EC2_PORT}" \
        ./ "${EC2_USER}@${EC2_HOST}:${REMOTE_PATH}/"

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Dry run complete. No changes made."
        exit 0
    fi

    log_info "Sync complete"
}

install_remote_deps() {
    log_step "Installing production dependencies on server..."
    
    ssh -i "$EC2_KEY" -p "$EC2_PORT" "$EC2_USER@$EC2_HOST" "
        sudo -u ${STRAPI_USER} bash -c '
            source ~/.nvm/nvm.sh
            cd ${REMOTE_PATH}
            npm ci --omit=dev
        '
    "
    
    log_info "Dependencies installed"
}

reload_pm2() {
    log_step "Reloading Strapi via PM2..."
    
    ssh -i "$EC2_KEY" -p "$EC2_PORT" "$EC2_USER@$EC2_HOST" "
        sudo -u ${STRAPI_USER} bash -c '
            source ~/.nvm/nvm.sh
            cd ${REMOTE_PATH}
            pm2 reload strapi || pm2 start /opt/godatify/scripts/ecosystem.config.js
        '
    "
    
    log_info "PM2 reload complete"
}

health_check() {
    log_step "Running health check..."
    
    local health_url="http://localhost:1337/_health"
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if ssh -i "$EC2_KEY" -p "$EC2_PORT" "$EC2_USER@$EC2_HOST" "curl -sf ${health_url}" &>/dev/null; then
            log_info "Health check passed!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    log_warn "Health check timed out after ${max_attempts} attempts"
    log_warn "Check logs: ssh -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} 'sudo -u strapi pm2 logs'"
    return 1
}

# ==============================================================================
# Main
# ==============================================================================

main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
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
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║           godatify Backend Deploy (Local → EC2)                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "  Server:     ${EC2_USER}@${EC2_HOST}:${EC2_PORT}"
    echo "  Key:        ${EC2_KEY}"
    echo "  Remote:     ${REMOTE_PATH}"
    echo "  Dry Run:    ${DRY_RUN}"
    echo "  Skip Build: ${SKIP_BUILD}"
    echo ""

    check_prerequisites
    build_locally
    sync_to_server
    install_remote_deps
    reload_pm2
    health_check

    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ✅ Deploy complete!                                          ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "  View logs:    ssh -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} 'sudo -u strapi bash -c \"source ~/.nvm/nvm.sh && pm2 logs\"'"
    echo "  View status:  ssh -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} 'sudo -u strapi bash -c \"source ~/.nvm/nvm.sh && pm2 status\"'"
    echo ""
}

main "$@"
