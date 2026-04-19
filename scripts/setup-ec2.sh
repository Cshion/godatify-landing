#!/bin/bash
# ==============================================================================
# EC2 Server Setup Script
# ==============================================================================
# This script sets up a fresh Ubuntu 22.04 EC2 instance for godatify-landing
#
# Usage: curl -sSL https://raw.githubusercontent.com/YOUR_REPO/scripts/setup-ec2.sh | bash
#    or: bash setup-ec2.sh
#
# What this script installs:
#   - Node.js 20 via nvm
#   - PM2 for process management
#   - Nginx for reverse proxy
#   - PostgreSQL 16 for database
#   - Certbot for SSL certificates
#   - UFW firewall
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ==============================================================================
# System Update
# ==============================================================================
log_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ==============================================================================
# Essential Packages
# ==============================================================================
log_info "Installing essential packages..."
sudo apt install -y curl git build-essential

# ==============================================================================
# Node.js 20 via nvm
# ==============================================================================
log_info "Installing nvm and Node.js 20..."

# Install nvm
export NVM_DIR="$HOME/.nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
log_info "Node.js version: $(node --version)"
log_info "npm version: $(npm --version)"

# ==============================================================================
# PM2 Process Manager
# ==============================================================================
log_info "Installing PM2 globally..."
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd -u $USER --hp $HOME

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

log_info "PM2 version: $(pm2 --version)"

# ==============================================================================
# Nginx Reverse Proxy
# ==============================================================================
log_info "Installing Nginx..."
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

log_info "Nginx installed and running"

# ==============================================================================
# PostgreSQL 16
# ==============================================================================
log_info "Installing PostgreSQL 16..."

# Add PostgreSQL APT repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install PostgreSQL 16
sudo apt install -y postgresql-16 postgresql-contrib-16

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

log_info "PostgreSQL 16 installed and running"

# ==============================================================================
# Certbot for SSL
# ==============================================================================
log_info "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

log_info "Certbot installed"

# ==============================================================================
# UFW Firewall (Basic Setup)
# ==============================================================================
log_info "Configuring UFW firewall (basic mode)..."

# Reset UFW to default
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: Don't lock yourself out!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS (will be restricted to Cloudflare IPs later)
sudo ufw allow 'Nginx Full'

# Enable UFW
sudo ufw --force enable

# Show status
sudo ufw status verbose

log_info "UFW firewall configured (basic mode)"
log_info "Run 'make setup-cloudflare' to restrict to Cloudflare IPs only"

# ==============================================================================
# Create Application Directory
# ==============================================================================
log_info "Creating application directory..."
sudo mkdir -p /var/www/godatify
sudo chown -R $USER:$USER /var/www/godatify

# ==============================================================================
# Cloudflare Scripts Directory
# ==============================================================================
log_info "Creating Cloudflare scripts directory..."
sudo mkdir -p /opt/scripts
sudo chown -R $USER:$USER /opt/scripts

# ==============================================================================
# Cloudflare Origin Certificate Directory
# ==============================================================================
log_info "Creating Cloudflare SSL directory..."
sudo mkdir -p /etc/ssl/cloudflare
sudo chmod 700 /etc/ssl/cloudflare

log_info "Cloudflare directories created"
log_info "After generating Origin Certificate in Cloudflare dashboard:"
log_info "  - Save certificate to: /etc/ssl/cloudflare/origin.pem"
log_info "  - Save private key to: /etc/ssl/cloudflare/origin-key.pem"

# ==============================================================================
# Nginx Configuration Template (Cloudflare-aware)
# ==============================================================================
log_info "Creating Nginx configuration template..."

# Create Cloudflare IPs include file
sudo tee /etc/nginx/cloudflare-ips.conf > /dev/null << 'CLOUDFLARE_IPS'
# Cloudflare IP ranges - Auto-updated by /opt/scripts/cloudflare-ips.sh
# Last updated: Initial setup
# https://www.cloudflare.com/ips-v4
# https://www.cloudflare.com/ips-v6

# IPv4
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;

# IPv6
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;

# Use CF-Connecting-IP header for real client IP
real_ip_header CF-Connecting-IP;
CLOUDFLARE_IPS

sudo tee /etc/nginx/sites-available/godatify > /dev/null << 'NGINX_CONF'
# ==============================================================================
# Datify Backend - Nginx Configuration (Cloudflare Proxy Mode)
# ==============================================================================
# This configuration is designed to work with Cloudflare's proxied (orange cloud)
# mode, providing DDoS protection, WAF, and edge caching.
# ==============================================================================

# Include Cloudflare IP ranges for real_ip restoration
include /etc/nginx/cloudflare-ips.conf;

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name api.godatify.com;  # Change to your domain
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server block
server {
    listen 443 ssl http2;
    server_name api.godatify.com;  # Change to your domain

    # ===========================================================================
    # SSL Configuration (Cloudflare Origin Certificate)
    # ===========================================================================
    # Option 1: Cloudflare Origin Certificate (recommended for CF proxy mode)
    ssl_certificate /etc/ssl/cloudflare/origin.pem;
    ssl_certificate_key /etc/ssl/cloudflare/origin-key.pem;
    
    # Option 2: Let's Encrypt (uncomment if not using CF Origin Cert)
    # ssl_certificate /etc/letsencrypt/live/api.godatify.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/api.godatify.com/privkey.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # ===========================================================================
    # Security Headers
    # ===========================================================================
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # ===========================================================================
    # Strapi Backend Proxy
    # ===========================================================================
    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        
        # Forward real visitor IP (restored from Cloudflare headers)
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # Preserve host header
        proxy_set_header Host $host;
        
        # WebSocket support (for Strapi admin live reload)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;

        # Timeouts (important for file uploads)
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 16k;
        proxy_busy_buffers_size 24k;
        
        # Max upload size (match Strapi config)
        client_max_body_size 50M;
    }

    # Health check endpoint (bypass rate limits)
    location = /_health {
        proxy_pass http://127.0.0.1:1337/_health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        access_log off;
    }

    # Strapi admin panel - stricter security
    location /admin {
        proxy_pass http://127.0.0.1:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Larger timeouts for admin operations
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Strapi file uploads
    location /uploads {
        proxy_pass http://127.0.0.1:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        # Cache uploaded files
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF

# Enable the site (don't activate yet - SSL cert needs to be configured)
# sudo ln -sf /etc/nginx/sites-available/godatify /etc/nginx/sites-enabled/
# sudo nginx -t && sudo systemctl reload nginx

log_info "Nginx configuration template created at /etc/nginx/sites-available/godatify"
log_info "Cloudflare IPs file created at /etc/nginx/cloudflare-ips.conf"

# ==============================================================================
# Cloudflare IP Update Script
# ==============================================================================
log_info "Creating Cloudflare IP update script..."

sudo tee /opt/scripts/cloudflare-ips.sh > /dev/null << 'CLOUDFLARE_SCRIPT'
#!/bin/bash
# ==============================================================================
# Cloudflare IP Update Script
# ==============================================================================
# Updates Nginx with latest Cloudflare IPs and optionally UFW firewall rules.
#
# Usage:
#   /opt/scripts/cloudflare-ips.sh [--nginx-only|--ufw-only|--all]
#
# Options:
#   --nginx-only  Update only Nginx real_ip configuration
#   --ufw-only    Update only UFW firewall rules
#   --all         Update both Nginx and UFW (default)
#
# Cron example (run weekly on Sunday at 4am):
#   0 4 * * 0 /opt/scripts/cloudflare-ips.sh --all >> /var/log/cloudflare-update.log 2>&1
# ==============================================================================

set -e

# Configuration
CF_IPS_FILE="/etc/nginx/cloudflare-ips.conf"
LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"

# Parse arguments
MODE="${1:---all}"

log_info() { echo "$LOG_PREFIX [INFO] $1"; }
log_error() { echo "$LOG_PREFIX [ERROR] $1" >&2; }

update_nginx() {
    log_info "Updating Nginx Cloudflare IPs..."
    
    # Backup existing file
    if [ -f "$CF_IPS_FILE" ]; then
        cp "$CF_IPS_FILE" "${CF_IPS_FILE}.bak"
    fi
    
    # Create new config
    cat > "$CF_IPS_FILE" << EOF
# Cloudflare IP ranges - Auto-updated by /opt/scripts/cloudflare-ips.sh
# Last updated: $(date '+%Y-%m-%d %H:%M:%S')
# https://www.cloudflare.com/ips-v4
# https://www.cloudflare.com/ips-v6

# IPv4
EOF
    
    for ip in $(curl -sf https://www.cloudflare.com/ips-v4); do
        echo "set_real_ip_from $ip;" >> "$CF_IPS_FILE"
    done
    
    cat >> "$CF_IPS_FILE" << EOF

# IPv6
EOF
    
    for ip in $(curl -sf https://www.cloudflare.com/ips-v6); do
        echo "set_real_ip_from $ip;" >> "$CF_IPS_FILE"
    done
    
    cat >> "$CF_IPS_FILE" << EOF

# Use CF-Connecting-IP header for real client IP
real_ip_header CF-Connecting-IP;
EOF
    
    # Test and reload nginx
    if nginx -t 2>/dev/null; then
        systemctl reload nginx
        log_info "Nginx configuration updated and reloaded"
    else
        log_error "Nginx config test failed, restoring backup"
        mv "${CF_IPS_FILE}.bak" "$CF_IPS_FILE"
        exit 1
    fi
}

update_ufw() {
    log_info "Updating UFW firewall rules..."
    
    # Remove existing Cloudflare rules
    log_info "Removing old Cloudflare HTTP/HTTPS rules..."
    ufw status numbered | grep -E "80|443" | grep -v "22" | awk -F'[][]' '{print $2}' | sort -rn | while read num; do
        [ -n "$num" ] && ufw --force delete $num 2>/dev/null || true
    done
    
    # Add Cloudflare IPv4 rules
    log_info "Adding Cloudflare IPv4 rules..."
    for ip in $(curl -sf https://www.cloudflare.com/ips-v4); do
        ufw allow from "$ip" to any port 80 proto tcp comment "Cloudflare IPv4" 2>/dev/null || true
        ufw allow from "$ip" to any port 443 proto tcp comment "Cloudflare IPv4" 2>/dev/null || true
    done
    
    # Add Cloudflare IPv6 rules
    log_info "Adding Cloudflare IPv6 rules..."
    for ip in $(curl -sf https://www.cloudflare.com/ips-v6); do
        ufw allow from "$ip" to any port 80 proto tcp comment "Cloudflare IPv6" 2>/dev/null || true
        ufw allow from "$ip" to any port 443 proto tcp comment "Cloudflare IPv6" 2>/dev/null || true
    done
    
    log_info "UFW rules updated"
    ufw status | head -30
}

# Main
case "$MODE" in
    --nginx-only)
        update_nginx
        ;;
    --ufw-only)
        update_ufw
        ;;
    --all)
        update_nginx
        update_ufw
        ;;
    *)
        echo "Usage: $0 [--nginx-only|--ufw-only|--all]"
        exit 1
        ;;
esac

log_info "Cloudflare IP update complete!"
CLOUDFLARE_SCRIPT

sudo chmod +x /opt/scripts/cloudflare-ips.sh
log_info "Cloudflare IP update script created at /opt/scripts/cloudflare-ips.sh"

# ==============================================================================
# Summary
# ==============================================================================
echo ""
echo "=============================================================================="
echo -e "${GREEN}Server Setup Complete!${NC}"
echo "=============================================================================="
echo ""
echo "Installed:"
echo "  ✅ Node.js $(node --version)"
echo "  ✅ npm $(npm --version)"
echo "  ✅ PM2 $(pm2 --version)"
echo "  ✅ Nginx $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "  ✅ PostgreSQL 16"
echo "  ✅ Certbot"
echo "  ✅ UFW Firewall (SSH, HTTP, HTTPS allowed)"
echo "  ✅ Cloudflare IP update script"
echo ""
echo "Cloudflare Configuration:"
echo "  📁 Nginx config: /etc/nginx/sites-available/godatify"
echo "  📁 CF IPs file:  /etc/nginx/cloudflare-ips.conf"
echo "  📁 Update script: /opt/scripts/cloudflare-ips.sh"
echo "  📁 SSL cert dir:  /etc/ssl/cloudflare/"
echo ""
echo "Next steps:"
echo "  1. Create PostgreSQL database:"
echo "     sudo -u postgres psql -c \"CREATE USER strapi WITH PASSWORD 'your_password';\""
echo "     sudo -u postgres psql -c \"CREATE DATABASE strapi OWNER strapi;\""
echo ""
echo "  2. Clone your repository:"
echo "     cd /var/www/godatify"
echo "     git clone <your-repo-url> ."
echo ""
echo "  3. Configure environment:"
echo "     cp backend/.env.example backend/.env"
echo "     nano backend/.env"
echo ""
echo "  4. Generate Cloudflare Origin Certificate:"
echo "     - Go to Cloudflare Dashboard → SSL/TLS → Origin Server"
echo "     - Create Certificate (RSA, 15 years)"
echo "     - Save certificate to: /etc/ssl/cloudflare/origin.pem"
echo "     - Save private key to: /etc/ssl/cloudflare/origin-key.pem"
echo "     - chmod 600 /etc/ssl/cloudflare/origin-key.pem"
echo ""
echo "  5. Enable Nginx site:"
echo "     sudo ln -sf /etc/nginx/sites-available/godatify /etc/nginx/sites-enabled/"
echo "     sudo rm -f /etc/nginx/sites-enabled/default"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  6. Restrict firewall to Cloudflare IPs only:"
echo "     sudo /opt/scripts/cloudflare-ips.sh --ufw-only"
echo ""
echo "  7. Setup cron for auto-updating Cloudflare IPs:"
echo "     sudo crontab -e"
echo "     # Add: 0 4 * * 0 /opt/scripts/cloudflare-ips.sh --all >> /var/log/cloudflare-update.log 2>&1"
echo ""
echo "  8. Deploy with:"
echo "     bash scripts/deploy.sh"
echo ""
echo "=============================================================================="
