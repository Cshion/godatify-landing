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
# UFW Firewall
# ==============================================================================
log_info "Configuring UFW firewall..."

# Reset UFW to default
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: Don't lock yourself out!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable UFW
sudo ufw --force enable

# Show status
sudo ufw status verbose

log_info "UFW firewall configured"

# ==============================================================================
# Create Application Directory
# ==============================================================================
log_info "Creating application directory..."
sudo mkdir -p /var/www/godatify
sudo chown -R $USER:$USER /var/www/godatify

# ==============================================================================
# Nginx Configuration Template
# ==============================================================================
log_info "Creating Nginx configuration template..."

sudo tee /etc/nginx/sites-available/godatify > /dev/null << 'NGINX_CONF'
# Strapi Backend API
server {
    listen 80;
    server_name api.godatify.com;  # Change to your domain

    # Redirect HTTP to HTTPS (uncomment after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffer settings
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Health check endpoint
    location /_health {
        proxy_pass http://127.0.0.1:1337/_health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Strapi admin panel
    location /admin {
        proxy_pass http://127.0.0.1:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Strapi file uploads
    location /uploads {
        proxy_pass http://127.0.0.1:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
NGINX_CONF

# Enable the site (don't activate yet - domain needs to be configured)
# sudo ln -sf /etc/nginx/sites-available/godatify /etc/nginx/sites-enabled/
# sudo nginx -t && sudo systemctl reload nginx

log_info "Nginx configuration template created at /etc/nginx/sites-available/godatify"

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
echo "  4. Deploy with:"
echo "     bash scripts/deploy.sh"
echo ""
echo "  5. Setup SSL (after configuring domain):"
echo "     sudo ln -sf /etc/nginx/sites-available/godatify /etc/nginx/sites-enabled/"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo "     sudo certbot --nginx -d api.godatify.com"
echo ""
echo "=============================================================================="
