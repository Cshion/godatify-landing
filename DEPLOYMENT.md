# Deployment Guide — godatify-landing

Production deployment guide using PM2 and Node.js directly (no Docker).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Quick Start](#quick-start)
4. [EC2 Instance Setup](#ec2-instance-setup)
5. [PostgreSQL Setup](#postgresql-setup)
6. [Environment Variables](#environment-variables)
7. [Backend Deployment](#backend-deployment)
8. [Nginx Configuration](#nginx-configuration)
9. [SSL Setup](#ssl-setup)
10. [PM2 Process Management](#pm2-process-management)
11. [GitHub Actions CI/CD](#github-actions-cicd)
12. [Monitoring & Logging](#monitoring--logging)
13. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### EC2 Instance Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Instance Type | t3.small | t3.medium |
| vCPUs | 2 | 2+ |
| RAM | 2 GB | 4+ GB |
| Storage | 20 GB SSD | 50+ GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### AWS Security Groups

| Type | Port | Source | Description |
|------|------|--------|-------------|
| SSH | 22 | Your IP | SSH access |
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure traffic |

**Note:** Ports 1337 (Strapi) and 5432 (PostgreSQL) should NOT be exposed to the internet.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS EC2 Instance                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Nginx (443/80)                     │  │
│  │              SSL Termination + Reverse Proxy          │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                  │
│                          ▼                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   PM2 Process Manager                 │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │  │
│  │  │  Strapi #1  │ │  Strapi #2  │ │  Strapi #N  │     │  │
│  │  │  (Cluster)  │ │  (Cluster)  │ │  (Cluster)  │     │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘     │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                  │
│                          ▼                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                PostgreSQL (Port 5432)                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Automated Setup (Recommended)

```bash
# 1. SSH into your EC2 instance
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>

# 2. Clone repository
git clone <your-repo-url> /var/www/godatify
cd /var/www/godatify

# 3. Run setup script
bash scripts/setup-ec2.sh

# 4. Create database
sudo -u postgres psql -c "CREATE USER strapi WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "CREATE DATABASE strapi OWNER strapi;"

# 5. Configure environment
cp backend/.env.example backend/.env
nano backend/.env  # Edit with your values

# 6. Deploy
bash scripts/deploy.sh
```

---

## EC2 Instance Setup

### Manual Setup (Alternative)

If you prefer manual setup over the automated script:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl git build-essential

# Install Node.js 20 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# Verify Node.js installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install PM2 globally
npm install -g pm2

# Setup PM2 startup script
pm2 startup systemd -u $USER --hp $HOME
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## PostgreSQL Setup

```bash
# Install PostgreSQL 16
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16 postgresql-contrib-16

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE USER strapi WITH PASSWORD 'your_secure_password';
CREATE DATABASE strapi OWNER strapi;
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;
\q
EOF

# Test connection
psql -h localhost -U strapi -d strapi -c "SELECT version();"
```

---

## Environment Variables

Create `/var/www/godatify/backend/.env`:

```bash
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_secure_db_password
DATABASE_SSL=false

# Strapi Secrets (generate with commands below)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=generate_random_string
ADMIN_JWT_SECRET=generate_random_string
TRANSFER_TOKEN_SALT=generate_random_string
JWT_SECRET=generate_random_string
ENCRYPTION_KEY=generate_random_string

# AWS S3 (optional - for media uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_ACCESS_SECRET=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET=godatify-uploads
```

### Generate Secure Secrets

```bash
# Generate all secrets at once
echo "APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)"
```

---

## Backend Deployment

### Using the Deploy Script

```bash
cd /var/www/godatify
bash scripts/deploy.sh
```

The script will:
1. Pull latest code from git
2. Install production dependencies
3. Build Strapi
4. Start/restart PM2 processes
5. Run health checks

### Manual Deployment

```bash
cd /var/www/godatify/backend

# Install dependencies (production only)
npm ci --only=production

# Build Strapi
NODE_ENV=production npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save
```

---

## Nginx Configuration

### Create Site Configuration

```bash
sudo nano /etc/nginx/sites-available/godatify
```

```nginx
# Main API Server
server {
    listen 80;
    server_name api.godatify.com;  # Change to your domain

    # Proxy to Strapi
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

    # Health check
    location /_health {
        proxy_pass http://127.0.0.1:1337/_health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### Enable Site

```bash
# Create symlink
sudo ln -sf /etc/nginx/sites-available/godatify /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## SSL Setup

### Using Let's Encrypt (Certbot)

```bash
# Request certificate
sudo certbot --nginx -d api.godatify.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot will automatically:
- Obtain SSL certificate
- Modify Nginx configuration for HTTPS
- Set up auto-renewal via cron/systemd timer

---

## PM2 Process Management

### Essential Commands

```bash
# Status
pm2 status               # List all processes
pm2 list                 # Same as above
pm2 show strapi         # Detailed info for strapi

# Logs
pm2 logs                 # All logs (tail)
pm2 logs strapi         # Strapi logs only
pm2 logs --lines 100    # Last 100 lines

# Control
pm2 start ecosystem.config.js   # Start from config
pm2 restart strapi              # Restart process
pm2 reload strapi               # Zero-downtime reload
pm2 stop strapi                 # Stop process
pm2 delete strapi               # Remove from PM2

# Monitoring
pm2 monit                # Real-time monitor
pm2 plus                 # PM2.io dashboard (optional)

# Maintenance
pm2 save                 # Save current process list
pm2 resurrect           # Restore saved processes
pm2 flush               # Clear all logs
pm2 update              # Update PM2
```

### Ecosystem Configuration

The PM2 configuration is in `backend/ecosystem.config.js`:

```javascript
{
  name: 'strapi',
  instances: 'max',      // Use all CPU cores
  exec_mode: 'cluster',  // Enable cluster mode
  max_memory_restart: '1G',  // Restart if >1GB RAM
  // ... see full config in file
}
```

### Enable Auto-Start on Boot

```bash
# Generate startup script (run once)
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save current processes
pm2 save
```

---

## GitHub Actions CI/CD

The deployment is automated via `.github/workflows/deploy.yml`.

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | EC2 public IP or domain |
| `EC2_USER` | SSH username (usually `ubuntu`) |
| `EC2_SSH_KEY` | Private SSH key for EC2 access |
| `ENV_FILE` | Base64 encoded .env file |

### Encode .env File

```bash
# On your local machine
base64 -i backend/.env | tr -d '\n'
```

Copy the output to `ENV_FILE` secret.

### Trigger Deployment

- **Automatic:** Push to `main` branch with changes in `backend/`
- **Manual:** Go to Actions → Deploy Backend → Run workflow

---

## Monitoring & Logging

### PM2 Logs

```bash
# Live logs
pm2 logs strapi

# Log files location
/var/log/pm2/strapi-out.log   # Standard output
/var/log/pm2/strapi-error.log # Errors
```

### System Monitoring

```bash
# PM2 built-in monitor
pm2 monit

# System resources
htop

# Disk usage
df -h

# Memory
free -m
```

### Health Check

```bash
# Check Strapi health
curl http://localhost:1337/_health

# Check Nginx status
sudo systemctl status nginx

# Check PostgreSQL status
sudo systemctl status postgresql
```

---

## Troubleshooting

### Strapi Won't Start

```bash
# Check PM2 logs
pm2 logs strapi --lines 50

# Check environment variables
cat backend/.env

# Verify Node version
node --version  # Should be v20.x

# Check port availability
sudo lsof -i :1337
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U strapi -d strapi

# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Reload configuration
sudo systemctl reload nginx
```

### PM2 Memory Issues

```bash
# Check memory usage
pm2 monit

# If processes keep restarting due to memory:
# Increase max_memory_restart in ecosystem.config.js
# Or reduce instances from 'max' to a specific number
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check Nginx SSL configuration
sudo nginx -t
```

---

## Useful Commands Reference

```bash
# === PM2 ===
pm2 status                    # Process status
pm2 logs strapi              # View logs
pm2 restart strapi           # Restart
pm2 reload strapi            # Zero-downtime reload
pm2 monit                    # Monitor

# === Nginx ===
sudo systemctl status nginx   # Status
sudo systemctl reload nginx   # Reload config
sudo nginx -t                 # Test config

# === PostgreSQL ===
sudo systemctl status postgresql
sudo -u postgres psql         # Connect as postgres
psql -h localhost -U strapi   # Connect as strapi

# === System ===
htop                         # Process monitor
df -h                        # Disk space
free -m                      # Memory usage

# === Deployment ===
cd /var/www/godatify
bash scripts/deploy.sh       # Deploy latest changes
```

---

## Security Checklist

- [ ] SSH uses key-based authentication only
- [ ] UFW firewall enabled (only 22, 80, 443 open)
- [ ] PostgreSQL only accessible from localhost
- [ ] Strapi only accessible via Nginx proxy
- [ ] SSL/HTTPS enabled with valid certificate
- [ ] Strong database password
- [ ] Unique Strapi secrets generated
- [ ] Regular system updates scheduled
