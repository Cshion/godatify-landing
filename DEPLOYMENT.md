# Deployment Guide — godatify-landing

Production deployment guide for AWS EC2.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [EC2 Instance Setup](#ec2-instance-setup)
4. [Security Groups](#security-groups)
5. [Environment Variables](#environment-variables)
6. [Backend Deployment (Strapi)](#backend-deployment-strapi)
7. [Frontend Deployment](#frontend-deployment)
8. [SSL/HTTPS Setup](#sslhttps-setup)
9. [PM2 Process Management](#pm2-process-management)
10. [Database Backup Strategy](#database-backup-strategy)
11. [Monitoring & Logging](#monitoring--logging)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### AWS Requirements
- AWS Account with appropriate IAM permissions
- SSH key pair for EC2 access
- (Optional) Domain name pointed to your server

### EC2 Instance Recommendations

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Instance Type | t3.small | t3.medium or larger |
| vCPUs | 2 | 2+ |
| RAM | 2 GB | 4+ GB |
| Storage | 20 GB SSD | 50+ GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### Software Requirements
- Node.js 20.x
- npm 10.x
- PostgreSQL 16
- Docker & Docker Compose (if using containers)
- PM2 (if not using Docker)
- Nginx (reverse proxy)
- Certbot (SSL)

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
│  └───────────────┬───────────────────────┬───────────────┘  │
│                  │                       │                  │
│                  ▼                       ▼                  │
│  ┌─────────────────────┐   ┌─────────────────────────────┐  │
│  │   Strapi Backend    │   │     Frontend (Optional)     │  │
│  │   (Port 1337)       │   │     or Vercel               │  │
│  └──────────┬──────────┘   └─────────────────────────────┘  │
│             │                                               │
│             ▼                                               │
│  ┌─────────────────────┐                                    │
│  │   PostgreSQL        │                                    │
│  │   (Port 5432)       │                                    │
│  └─────────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## EC2 Instance Setup

### 1. Launch EC2 Instance

```bash
# Via AWS Console:
# 1. EC2 > Launch Instance
# 2. Select Ubuntu 22.04 LTS (64-bit x86)
# 3. Choose instance type (t3.medium recommended)
# 4. Configure storage (50 GB gp3)
# 5. Select/create security group (see next section)
# 6. Select/create key pair
# 7. Launch
```

### 2. Connect to Instance

```bash
# Update SSH key permissions
chmod 400 your-key.pem

# Connect
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### 3. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl git build-essential

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 4. Install PostgreSQL

```bash
# Install PostgreSQL 16
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE USER strapi WITH PASSWORD 'your_secure_password';
CREATE DATABASE strapi OWNER strapi;
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;
EOF
```

### 5. (Alternative) Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

---

## Security Groups

Configure the following inbound rules:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic (redirects to HTTPS) |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web traffic |
| Custom TCP | TCP | 1337 | 127.0.0.1 | Strapi (internal only) |
| PostgreSQL | TCP | 5432 | 127.0.0.1 | Database (internal only) |

**Important:** Never expose ports 1337 or 5432 to the public internet.

---

## Environment Variables

### Backend Environment Variables

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

# Strapi Secrets (generate with: openssl rand -base64 32)
APP_KEYS=key1_base64,key2_base64,key3_base64,key4_base64
API_TOKEN_SALT=generate_random_base64_string
ADMIN_JWT_SECRET=generate_random_base64_string
TRANSFER_TOKEN_SALT=generate_random_base64_string
JWT_SECRET=generate_random_base64_string
ENCRYPTION_KEY=generate_random_base64_string

# AWS S3 (for media uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_ACCESS_SECRET=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET=godatify-uploads
```

### Generate Secure Keys

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

## Backend Deployment (Strapi)

### Option A: Direct Deployment (with PM2)

```bash
# Create application directory
sudo mkdir -p /var/www/godatify
sudo chown -R ubuntu:ubuntu /var/www/godatify

# Clone repository
cd /var/www/godatify
git clone <your-repo-url> .

# Install backend dependencies
cd backend
npm ci

# Create .env file (see Environment Variables section)
nano .env

# Build Strapi
NODE_ENV=production npm run build

# Start with PM2
pm2 start npm --name "strapi" -- run start
pm2 save
pm2 startup
```

### Option B: Docker Deployment

```bash
# Clone repository
cd /var/www/godatify
git clone <your-repo-url> .

# Create .env file at project root
nano .env

# Build and start containers
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker compose ps
docker compose logs -f backend
```

### Nginx Configuration for Backend

Create `/etc/nginx/sites-available/api.godatify.com`:

```nginx
server {
    listen 80;
    server_name api.godatify.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for large uploads
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Increase body size for uploads
        client_max_body_size 100M;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/api.godatify.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Frontend Deployment

### Option A: Vercel (Recommended)

The frontend is already configured for Vercel deployment:

1. Connect your GitHub repo to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_STRAPI_URL=https://api.godatify.com`
3. Deploy

### Option B: EC2 (Same Instance)

```bash
# Install frontend dependencies
cd /var/www/godatify/frontend
npm ci

# Build Next.js
npm run build

# Start with PM2
pm2 start npm --name "frontend" -- run start
pm2 save
```

Nginx config for frontend (`/etc/nginx/sites-available/godatify.com`):

```nginx
server {
    listen 80;
    server_name godatify.com www.godatify.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Obtain SSL certificate
sudo certbot --nginx -d api.godatify.com -d godatify.com -d www.godatify.com

# Certbot will automatically:
# 1. Obtain certificates
# 2. Configure Nginx for HTTPS
# 3. Set up auto-renewal

# Verify auto-renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

### Force HTTPS Redirect

Certbot adds this automatically, but verify your Nginx config includes:

```nginx
server {
    listen 80;
    server_name api.godatify.com;
    return 301 https://$server_name$request_uri;
}
```

---

## PM2 Process Management

### Useful Commands

```bash
# List all processes
pm2 list

# View logs
pm2 logs strapi
pm2 logs --lines 100

# Restart application
pm2 restart strapi

# Reload without downtime
pm2 reload strapi

# Stop application
pm2 stop strapi

# Delete from PM2
pm2 delete strapi

# Monitor CPU/Memory
pm2 monit

# Save process list
pm2 save

# Set up startup script
pm2 startup
```

### PM2 Ecosystem File

Create `/var/www/godatify/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/var/www/godatify/backend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/godatify/strapi-error.log',
      out_file: '/var/log/godatify/strapi-out.log',
    },
    {
      name: 'frontend',
      cwd: '/var/www/godatify/frontend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/godatify/frontend-error.log',
      out_file: '/var/log/godatify/frontend-out.log',
    },
  ],
};
```

Start with ecosystem file:

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Database Backup Strategy

### Automated Daily Backups

Create backup script `/var/www/godatify/scripts/backup-db.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/godatify/postgres"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="strapi"
DB_USER="strapi"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
PGPASSWORD="${DATABASE_PASSWORD}" pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Remove backups older than retention period
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Optional: Upload to S3
# aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz" s3://your-bucket/backups/postgres/

echo "Backup completed: backup_$DATE.sql.gz"
```

Set up cron job:

```bash
# Make script executable
chmod +x /var/www/godatify/scripts/backup-db.sh

# Edit crontab
crontab -e

# Add daily backup at 3 AM
0 3 * * * /var/www/godatify/scripts/backup-db.sh >> /var/log/godatify/backup.log 2>&1
```

### Restore from Backup

```bash
# Restore from backup
gunzip -c /var/backups/godatify/postgres/backup_YYYYMMDD_HHMMSS.sql.gz | PGPASSWORD="${DATABASE_PASSWORD}" psql -U strapi -h localhost strapi
```

---

## Monitoring & Logging

### Log Locations

| Component | Log Location |
|-----------|--------------|
| Nginx Access | `/var/log/nginx/access.log` |
| Nginx Errors | `/var/log/nginx/error.log` |
| PM2 Logs | `pm2 logs` or `/var/log/godatify/` |
| PostgreSQL | `/var/log/postgresql/` |
| System | `journalctl -f` |

### Recommended Monitoring Tools

1. **CloudWatch** (AWS native)
   - Install CloudWatch agent
   - Monitor CPU, memory, disk

2. **Uptime Robot** (free tier available)
   - HTTP monitoring
   - SSL expiry alerts

3. **PM2 Plus** (optional)
   - Process monitoring dashboard

### Basic Health Check Script

Create `/var/www/godatify/scripts/health-check.sh`:

```bash
#!/bin/bash

# Check if Strapi is responding
if curl -s http://localhost:1337/_health | grep -q "ok"; then
    echo "✅ Strapi: OK"
else
    echo "❌ Strapi: FAILED"
    pm2 restart strapi
fi

# Check if PostgreSQL is running
if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL: OK"
else
    echo "❌ PostgreSQL: FAILED"
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
if [ $DISK_USAGE -gt 90 ]; then
    echo "⚠️  Disk usage: ${DISK_USAGE}% (WARNING)"
else
    echo "✅ Disk usage: ${DISK_USAGE}%"
fi
```

---

## Troubleshooting

### Common Issues

#### Strapi won't start

```bash
# Check logs
pm2 logs strapi --lines 50

# Common fixes:
# 1. Check .env file exists and has correct values
# 2. Verify database connection
# 3. Ensure build was successful: npm run build
```

#### Database connection errors

```bash
# Test PostgreSQL connection
psql -U strapi -h localhost -d strapi

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

#### Nginx 502 Bad Gateway

```bash
# Check if backend is running
pm2 status

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Verify proxy_pass port matches Strapi port
```

#### Permission errors

```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /var/www/godatify

# Fix upload directory permissions
chmod 755 /var/www/godatify/backend/public/uploads
```

### Useful Diagnostic Commands

```bash
# System resources
htop
free -h
df -h

# Network
netstat -tlpn
ss -tlpn

# Process status
pm2 status
docker compose ps

# Logs
journalctl -u nginx -f
pm2 logs --lines 100
```

---

## Quick Reference

### Deploy Update

```bash
cd /var/www/godatify
git pull origin main

# Backend
cd backend
npm ci
npm run build
pm2 restart strapi

# Frontend (if on EC2)
cd ../frontend
npm ci
npm run build
pm2 restart frontend
```

### Emergency Restart

```bash
# Restart everything
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

## Support

- **AWS Documentation:** https://docs.aws.amazon.com/ec2/
- **Strapi Documentation:** https://docs.strapi.io/
- **Next.js Documentation:** https://nextjs.org/docs
- **PM2 Documentation:** https://pm2.keymetrics.io/docs/

---

*Last updated: 2026-04-18 by Jonesy (DevOps)*
