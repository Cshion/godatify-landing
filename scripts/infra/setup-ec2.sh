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
    2. Installs Node.js ${NODE_VERSION}
    3. Installs PostgreSQL ${PG_VERSION}
    4. Installs PM2 globally
    5. Installs cloudflared (Cloudflare Tunnel)
    6. Creates strapi system user
    7. Creates required directories
    8. Configures PostgreSQL (db/user)
    9. Sets up PM2 startup

This script is idempotent — safe to run multiple times.

Requirements:
    - Amazon Linux 2023 (ARM64)
    - Root/sudo access
    - Internet connectivity

EOF
    exit 0
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# ==============================================================================
# Main Setup Steps
# ==============================================================================

step_system_update() {
    log_info "[1/8] Updating system packages..."
    dnf update -y
    
    # Install essential tools
    local packages=(git curl wget vim htop jq tar gzip unzip)
    for pkg in "${packages[@]}"; do
        if ! rpm -q "$pkg" &> /dev/null; then
            dnf install -y "$pkg"
        fi
    done
    log_info "System packages updated"
}

step_install_nodejs() {
    log_info "[2/8] Installing Node.js ${NODE_VERSION}..."
    
    if command -v node &> /dev/null; then
        local current_version
        current_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ "$current_version" -ge "$NODE_VERSION" ]]; then
            log_skip "Node.js $(node --version) already installed"
            return
        fi
        log_info "Node.js $(node --version) found, upgrading to v${NODE_VERSION}..."
    fi
    
    # NodeSource repo for Node.js 22 LTS
    # AL2023 native repos only have Node.js 18 — we need 22 for Strapi 5
    # NodeSource officially supports AL2023 ARM64: https://github.com/nodesource/distributions
    log_info "Setting up NodeSource repository for Node.js ${NODE_VERSION}..."
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x -o /tmp/nodesource_setup.sh
    bash /tmp/nodesource_setup.sh
    rm -f /tmp/nodesource_setup.sh
    
    # Install Node.js from NodeSource
    dnf install -y nodejs
    log_info "Node.js $(node --version) installed from NodeSource"
}

step_install_pm2() {
    log_info "[3/8] Installing PM2..."
    
    if command -v pm2 &> /dev/null; then
        log_skip "PM2 $(pm2 --version) already installed"
        return
    fi
    
    npm install -g pm2
    log_info "PM2 $(pm2 --version) installed"
}

step_install_postgresql() {
    log_info "[4/8] Installing PostgreSQL ${PG_VERSION}..."
    
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
    log_info "[5/8] Installing cloudflared..."
    
    if command -v cloudflared &> /dev/null; then
        log_skip "cloudflared $(cloudflared --version | head -1) already installed"
        return
    fi
    
    # Detect architecture
    local arch
    arch=$(uname -m)
    if [[ "$arch" == "aarch64" ]]; then
        arch="arm64"
    elif [[ "$arch" == "x86_64" ]]; then
        arch="amd64"
    fi
    
    local cloudflared_url="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${arch}"
    curl -L "$cloudflared_url" -o /usr/local/bin/cloudflared
    chmod +x /usr/local/bin/cloudflared
    
    log_info "cloudflared installed: $(/usr/local/bin/cloudflared --version | head -1)"
    
    # Create cloudflared user if not exists
    if ! id cloudflared &> /dev/null; then
        useradd --system \
            --no-create-home \
            --shell /usr/sbin/nologin \
            --comment "Cloudflare Tunnel Daemon" \
            cloudflared
        log_info "cloudflared user created"
    else
        log_skip "cloudflared user already exists"
    fi
    
    # Create configuration directory
    if [[ ! -d /etc/cloudflared ]]; then
        mkdir -p /etc/cloudflared
        chown cloudflared:cloudflared /etc/cloudflared
        chmod 750 /etc/cloudflared
        log_info "/etc/cloudflared directory created"
    fi
    
    # Issue 5: Post-setup instructions for credentials file
    echo ""
    log_warn "After copying creds.json, secure it with:"
    log_warn "  sudo chmod 600 /etc/cloudflared/creds.json"
    log_warn "  sudo chown cloudflared:cloudflared /etc/cloudflared/creds.json"
    log_warn ""
    log_warn "Copy the config template:"
    log_warn "  sudo cp /opt/godatify/scripts/cloudflared-config.yml.template /etc/cloudflared/config.yml"
    log_warn "  sudo vim /etc/cloudflared/config.yml  # Update tunnel ID and hostname"
}

step_create_strapi_user() {
    log_info "[6/8] Creating strapi system user..."
    
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
    log_info "[7/8] Creating directories..."
    
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
}

step_configure_postgresql() {
    log_info "[8/8] Configuring PostgreSQL..."
    
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
            echo "# Database configuration (auto-generated by setup-ec2.sh)"
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
    log_info "Setting up PM2 startup..."
    
    # Check if PM2 startup is already configured
    if systemctl list-unit-files | grep -q "pm2-${STRAPI_USER}"; then
        log_skip "PM2 startup already configured"
        return
    fi
    
    # Configure PM2 to start on boot
    env PATH=$PATH:/usr/bin pm2 startup systemd -u "$STRAPI_USER" --hp "$STRAPI_HOME" --service-name "pm2-${STRAPI_USER}"
    log_info "PM2 startup configured"
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
    step_install_nodejs
    step_install_pm2
    step_install_postgresql
    step_install_cloudflared
    step_create_strapi_user
    step_create_directories
    step_configure_postgresql
    step_setup_pm2_startup
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}Setup Complete!${NC}"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "  1. Create /etc/strapi/env with environment variables"
    echo "  2. Configure Cloudflare Tunnel (see docs/cloudflare-setup.md)"
    echo "  3. Deploy code with: ./scripts/infra/deploy-backend.sh"
    echo ""
}

main "$@"
