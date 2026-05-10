# Quickstart: Backend Deployment

A consolidated, linear guide to deploying the Strapi backend from zero to production.

> **Start here** if you're setting up the backend for the first time.

---

## Overview

### What You'll Set Up

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Local Machine                       │
│  • AWS CLI configured                                           │
│  • SSH via EC2 Instance Connect                                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ aws ec2-instance-connect ssh
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AWS EC2 (us-east-1)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ PostgreSQL  │──│   Strapi    │──│  Cloudflare Tunnel      │  │
│  │  (v15)      │  │   (PM2)     │  │  (cloudflared daemon)   │  │
│  └─────────────┘  └─────────────┘  └───────────┬─────────────┘  │
│  t4g.small (ARM64) • No public IP • 2GB RAM    │                │
└─────────────────────────────────────────────────┼────────────────┘
                                                  │ Tunnel
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge (Global)                     │
│  api.godatify.com → tunnel → localhost:1337                     │
└─────────────────────────────────────────────────────────────────┘
```

### Time Estimates

| Phase | Time | Description |
|-------|------|-------------|
| Phase 1 | 30-45 min | AWS Infrastructure setup |
| Phase 2 | 15-20 min | Server configuration |
| Phase 3 | 10 min | Secrets configuration |
| Phase 4 | 15-20 min | Cloudflare Tunnel |
| Phase 5 | 10 min | First deploy |
| Phase 6 | 10 min | Backups & monitoring |
| **Total** | **~2-3 hours** | First-time setup |

### Prerequisites

- [ ] AWS account with billing enabled
- [ ] AWS CLI v2 installed: `aws --version`
- [ ] AWS credentials configured: `aws sts get-caller-identity`
- [ ] Cloudflare account with domain configured
- [ ] Git repository access (GitHub)

---

## Phase 1: AWS Infrastructure

> **Time:** 30-45 minutes | **Guide:** [AWS_SETUP.md](./AWS_SETUP.md)

Set up the AWS resources needed to run the backend.

### Steps

1. **Verify prerequisites** (AWS CLI, credentials)
2. **VPC**: Use default VPC (recommended)
3. **Security Group**: Create `godatify-backend-sg` with:
   - No inbound rules
   - HTTPS (443) + HTTP (80) outbound
4. **EC2 Instance Connect Endpoint**: Create endpoint for SSH access
5. **EC2 Instance**: Launch `t4g.small` (ARM64) with:
   - Amazon Linux 2023
   - No public IP
   - Attached security group
6. **(Optional) Data Volume**: Create 20GB gp3 for PostgreSQL

### ✅ Checklist After Phase 1

```bash
# Run these commands to verify
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=godatify-backend" \
  --query "Reservations[0].Instances[0].{State:State.Name,IP:PrivateIpAddress}" \
  --region us-east-1
```

- [ ] EC2 instance is `running`
- [ ] Instance has **no public IP**
- [ ] Security group has **no inbound rules**
- [ ] EIC endpoint is `create-complete`
- [ ] Can SSH via: `aws ec2-instance-connect ssh --instance-id i-xxx --os-user ec2-user`

---

## Phase 2: Server Configuration

> **Time:** 15-20 minutes

Run the setup script to install all dependencies on the EC2 instance.

### Step 1: Connect to the Instance

```bash
# Get instance ID
INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=godatify-backend" \
  --query "Reservations[0].Instances[0].InstanceId" \
  --output text \
  --region us-east-1)

# SSH via EC2 Instance Connect
aws ec2-instance-connect ssh \
  --instance-id $INSTANCE_ID \
  --os-user ec2-user \
  --region us-east-1
```

### Step 2: (Optional) Format Data Volume

If you created a separate data volume for PostgreSQL:

```bash
# Check if volume is attached
lsblk

# Format with XFS
sudo mkfs.xfs /dev/xvdf

# Mount (native AL2023 uses /var/lib/pgsql, NOT /var/lib/postgresql)
sudo mkdir -p /var/lib/pgsql
sudo mount /dev/xvdf /var/lib/pgsql

# Add to fstab for persistence
echo "UUID=$(sudo blkid -s UUID -o value /dev/xvdf) /var/lib/pgsql xfs defaults,noatime,nodiratime 0 2" | sudo tee -a /etc/fstab
```

### Step 3: Download and Run Setup Script

```bash
# Download the setup script
sudo curl -o /tmp/setup-ec2.sh \
  https://raw.githubusercontent.com/YOUR_ORG/godatify-landing/main/scripts/infra/setup-ec2.sh

# Make executable
sudo chmod +x /tmp/setup-ec2.sh

# Run setup (takes ~5-10 minutes)
sudo /tmp/setup-ec2.sh
```

**What the script does:**
- Updates system packages
- Installs Node.js 22, PM2, PostgreSQL 15, cloudflared
- Creates `strapi` user and directories
- Configures PostgreSQL database (auto-generates password)
- Sets up PM2 startup service

### Step 4: Verify Installation

```bash
# Check installed versions
node --version    # v22.x.x
pm2 --version     # 5.x.x
psql --version    # 15.x (native AL2023)
cloudflared --version

# Check PostgreSQL is running (native AL2023 service name)
sudo systemctl status postgresql

# Check directories exist
ls -la /var/www/godatify
ls -la /etc/strapi/
ls -la /var/log/strapi/
ls -la /var/lib/pgsql/data/   # Native AL2023 data directory
```

### ✅ Checklist After Phase 2

- [ ] Node.js 22 installed
- [ ] PM2 installed globally
- [ ] PostgreSQL 15 running
- [ ] cloudflared installed
- [ ] `/etc/strapi/env` exists with database credentials
- [ ] `strapi` user exists

---

## Phase 3: Secrets Configuration

> **Time:** 10 minutes

Generate Strapi secrets and complete the environment file.

### Step 1: Generate Strapi Secrets

Run on your local machine or on the EC2 instance:

```bash
# Generate all required secrets
echo "APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
```

### Step 2: Edit Environment File

```bash
# On the EC2 instance
sudo vim /etc/strapi/env
```

Add the generated secrets. The file should look like:

```bash
# Database (already filled by setup script)
DATABASE_HOST=/var/run/postgresql
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=<auto-generated>

# Strapi Core (add these)
APP_KEYS=<key1>,<key2>,<key3>,<key4>
API_TOKEN_SALT=<generated-salt>
ADMIN_JWT_SECRET=<generated-secret>
TRANSFER_TOKEN_SALT=<generated-salt>
JWT_SECRET=<generated-secret>

# Application
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
```

### Step 3: Verify Permissions

```bash
# Ensure proper permissions
sudo chmod 640 /etc/strapi/env
sudo chown root:strapi /etc/strapi/env

# Verify
ls -la /etc/strapi/env
# Should show: -rw-r----- root strapi
```

### ✅ Checklist After Phase 3

- [ ] `/etc/strapi/env` contains all required secrets
- [ ] File permissions are `640` with owner `root:strapi`
- [ ] `APP_KEYS` has 4 comma-separated base64 values

---

## Phase 4: Cloudflare Tunnel

> **Time:** 10-15 minutes

Set up Cloudflare Tunnel using the **token method** (recommended by Cloudflare).

### Step 1: Create Tunnel in Cloudflare Dashboard

1. Log in to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
2. Navigate to **Networks** → **Tunnels**
3. Click **Create a tunnel**
4. Select **Cloudflared** connector
5. Name it: `godatify-api`
6. **Copy the install token** shown on the "Install connector" page

### Step 2: Install Tunnel on Server

```bash
# SSH to server
ssh godatify-backend

# Install the tunnel with the token
sudo cloudflared service install <TOKEN>

# Verify service is running
sudo systemctl status cloudflared
```

This single command creates the configuration, sets up systemd, and starts the service.

### Step 3: Configure Public Hostname

Back in the Cloudflare dashboard (same tunnel configuration page):

1. Click **Next** after the connector shows as connected
2. Add a **Public Hostname**:
   - **Subdomain:** `api`
   - **Domain:** `godatify.com`
   - **Service Type:** `HTTP`
   - **URL:** `localhost:1337`
3. Click **Save tunnel**

### Step 4: Verify Tunnel

```bash
# Check service status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f

# Test external access (from your Mac)
curl -sf https://api.godatify.com/_health
# Expected: {"status":"ok"}
```

### ✅ Checklist After Phase 4

- [ ] `cloudflared` service is running (`systemctl status cloudflared`)
- [ ] Public hostname configured in Cloudflare dashboard
- [ ] `https://api.godatify.com/_health` returns success

---

## Phase 5: First Deploy

> **Time:** 10 minutes

Clone the repository on server, then deploy from your local Mac.

> ⚠️ **Important:** The t4g.small instance (2GB RAM) cannot build Strapi locally. We use a **local-build strategy**: build on your Mac, rsync to server.

### Step 1: Clone Repository (on server)

```bash
# SSH to server
ssh godatify-backend

# Clone repo as strapi user
sudo -u strapi git clone https://github.com/YOUR_ORG/godatify-landing.git /var/www/godatify
```

### Step 2: Copy PM2 Config (on server)

```bash
# Copy ecosystem config to scripts location
sudo mkdir -p /opt/godatify/scripts
sudo cp /var/www/godatify/scripts/infra/ecosystem.config.js /opt/godatify/scripts/

# Also copy deploy script for emergency use only
sudo cp /var/www/godatify/scripts/infra/deploy-backend.sh /opt/godatify/scripts/
sudo chmod +x /opt/godatify/scripts/deploy-backend.sh
```

### Step 3: Deploy from Your Mac

```bash
# On your local Mac
cd backend
make deploy
```

The deploy script will:
1. Build Strapi locally (on your Mac)
2. Rsync dist/, config/, and packages to server
3. Run `npm ci --omit=dev` on server (fast, no compilation)
4. Start/restart PM2
5. Run health check

### Step 4: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check Strapi logs
pm2 logs strapi --lines 50

# Test health check locally
curl -s http://localhost:1337/_health
# Should return HTTP 204 (no content)

# Test via public URL
curl -s -o /dev/null -w "%{http_code}" https://api.godatify.com/_health
# Should return: 204
```

### Step 5: Access Admin Panel

1. Open `https://api.godatify.com/admin` in your browser
2. Create the first admin user
3. Complete the setup wizard

### ✅ Checklist After Phase 5

- [ ] PM2 shows `strapi` process as `online`
- [ ] `curl localhost:1337/_health` returns 204
- [ ] `https://api.godatify.com/_health` returns 204
- [ ] Admin panel accessible at `/admin`
- [ ] First admin user created

---

## Phase 6: Backups & Monitoring

> **Time:** 10 minutes

Set up automated backups and log rotation.

### Step 1: Copy Backup Scripts

```bash
# Copy backup script and systemd files
sudo cp /var/www/godatify/scripts/infra/backup-db.sh /opt/godatify/scripts/
sudo cp /var/www/godatify/scripts/infra/backup-db.service /etc/systemd/system/
sudo cp /var/www/godatify/scripts/infra/backup-db.timer /etc/systemd/system/

# Make backup script executable
sudo chmod +x /opt/godatify/scripts/backup-db.sh
```

### Step 2: Create S3 Backup Bucket (if not exists)

```bash
# On your local machine
aws s3 mb s3://godatify-backups --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket godatify-backups \
  --versioning-configuration Status=Enabled
```

### Step 3: Enable Backup Timer

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable and start backup timer
sudo systemctl enable --now backup-db.timer

# Verify timer is scheduled
systemctl list-timers backup-db.timer
```

### Step 4: Test Backup Manually

```bash
# Run backup manually to verify
sudo /opt/godatify/scripts/backup-db.sh

# Check backup was created
ls -la /var/lib/pgsql/backups/

# Verify upload to S3 (from local machine)
aws s3 ls s3://godatify-backups/postgres/ --recursive
```

### Step 5: Configure Log Rotation

```bash
# Copy logrotate config
sudo cp /var/www/godatify/scripts/infra/logrotate-strapi.conf /etc/logrotate.d/strapi

# Test logrotate (dry run)
sudo logrotate -d /etc/logrotate.d/strapi
```

### ✅ Checklist After Phase 6

- [ ] Backup timer is enabled: `systemctl is-enabled backup-db.timer`
- [ ] Manual backup test succeeded
- [ ] Backups appear in S3 bucket
- [ ] Log rotation configured

---

## Verification Checklist

Run through this final checklist to confirm everything is working:

### Infrastructure
- [ ] EC2 instance running (no public IP)
- [ ] Security group has no inbound rules
- [ ] SSH works via EC2 Instance Connect

### Services
- [ ] PostgreSQL running: `systemctl is-active postgresql`
- [ ] PM2 running Strapi: `pm2 status` shows `online`
- [ ] Cloudflared running: `systemctl is-active cloudflared`

### Connectivity
- [ ] Health check (local): `curl localhost:1337/_health` → 204
- [ ] Health check (public): `curl https://api.godatify.com/_health` → 204
- [ ] Admin panel: `https://api.godatify.com/admin` loads

### Persistence
- [ ] PM2 startup configured: `pm2 save` + `pm2 startup`
- [ ] PostgreSQL enabled: `systemctl is-enabled postgresql`
- [ ] Cloudflared enabled: `systemctl is-enabled cloudflared`

### Backups
- [ ] Backup timer enabled: `systemctl is-enabled backup-db.timer`
- [ ] S3 bucket exists with backups
- [ ] Log rotation configured

---

## Troubleshooting Quick Reference

### Strapi Won't Start

```bash
# Check logs
pm2 logs strapi --lines 100

# Verify env file
sudo cat /etc/strapi/env

# Check PostgreSQL
pg_isready -h /var/run/postgresql

# Try manual start
sudo -u strapi bash -c "cd /var/www/godatify/backend && source /etc/strapi/env && npm run start"
```

### Tunnel Not Working

```bash
# Check cloudflared status
sudo systemctl status cloudflared

# Check cloudflared logs
sudo journalctl -u cloudflared -f

# Restart the tunnel service
sudo systemctl restart cloudflared

# If tunnel configuration is corrupted, reinstall with fresh token:
# 1. Get new token from Cloudflare dashboard (Networks → Tunnels)
# 2. Uninstall current service
sudo cloudflared service uninstall
# 3. Reinstall with new token
sudo cloudflared service install <TOKEN>
```

### Database Connection Failed

```bash
# Check PostgreSQL is running (native AL2023 service name)
sudo systemctl status postgresql

# Verify socket exists
ls -la /var/run/postgresql/

# Test connection
sudo -u strapi psql -h /var/run/postgresql -d strapi -c 'SELECT 1;'
```

### SSH Connection Failed

```bash
# Verify EIC endpoint status
aws ec2 describe-instance-connect-endpoints \
  --query "InstanceConnectEndpoints[0].State" \
  --region us-east-1

# Check if instance is running
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=godatify-backend" \
  --query "Reservations[0].Instances[0].State.Name" \
  --region us-east-1

# Verify IAM permissions
aws ec2-instance-connect open-tunnel --help
```

### Out of Memory

```bash
# Check memory usage
free -h
pm2 monit

# Restart Strapi (clears memory)
pm2 restart strapi
```

---

## Next Steps

After completing this quickstart:

1. **Configure S3 for media uploads** — Add AWS credentials to `/etc/strapi/env`
2. **Set up CloudWatch alarms** — Monitor backup failures and instance health
3. **Configure EBS snapshots** — Use AWS Data Lifecycle Manager for automated snapshots
4. **Review security** — Consider enabling SELinux enforcing mode

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| [AWS_SETUP.md](./AWS_SETUP.md) | Detailed AWS resource setup |
| [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) | Architecture and design decisions |
| [RUNBOOK.md](./RUNBOOK.md) | Day-to-day operations |
| [../cloudflare-setup.md](../cloudflare-setup.md) | Cloudflare configuration |
