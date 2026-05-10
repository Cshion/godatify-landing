# Operations Runbook — godatify-landing

Day-to-day operations guide for the Strapi backend on EC2.

> **New to this project?** Start with the [Quickstart Guide](./QUICKSTART.md) for initial setup.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Instance Setup](#instance-setup)
3. [Code Deployment](#code-deployment)
4. [Connecting to the Server](#connecting-to-the-server)
5. [Service Management](#service-management)
6. [Log Analysis](#log-analysis)
7. [Database Operations](#database-operations)
8. [Backup & Restore](#backup--restore)
9. [Cloudflare Tunnel](#cloudflare-tunnel)
10. [Troubleshooting](#troubleshooting)
11. [Emergency Procedures](#emergency-procedures)

---

## Quick Reference

### Key Paths

| Item | Path |
|------|------|
| Strapi Application | `/var/www/godatify/backend` |
| PM2 Config | `/opt/godatify/scripts/ecosystem.config.js` |
| Strapi Logs | `/var/log/strapi/` or `pm2 logs strapi` |
| Environment File | `/etc/strapi/env` |
| PostgreSQL Data | `/var/lib/pgsql/data` |
| PostgreSQL Logs | `/var/lib/pgsql/data/log` |
| PostgreSQL Binaries | `/usr/bin` |
| Cloudflared Config | `/etc/cloudflared/config.yml` |
| Backup Staging | `/var/lib/pgsql/backups` |

> **Note:** PostgreSQL 15 is installed from native AL2023 repos. Paths use `/var/lib/pgsql/` (RHEL/Amazon Linux convention), NOT `/var/lib/postgresql/` (Debian/Ubuntu convention).

### Key Commands

```bash
# Strapi (PM2)
pm2 status
pm2 restart strapi
pm2 logs strapi

# PostgreSQL (native AL2023 service name is postgresql)
sudo systemctl status postgresql
sudo -u postgres psql

# Cloudflare Tunnel
sudo systemctl status cloudflared
sudo cloudflared tunnel info
```

---

## Instance Setup

### Overview

Instance configuration is handled by an idempotent setup script that can be run multiple times safely.

**Script:** `scripts/infra/setup-ec2.sh`

### Running Setup

```bash
# SSH to instance first
ssh godatify-backend

# Download or sync the script
sudo curl -o /tmp/setup-ec2.sh https://raw.githubusercontent.com/your-repo/main/scripts/infra/setup-ec2.sh

# Or if repo is already cloned
cd /var/www/godatify
sudo ./scripts/infra/setup-ec2.sh
```

### What Setup Does

The script is idempotent — it checks before making changes:

| Step | Description | Idempotent Check |
|------|-------------|------------------|
| System Update | Updates dnf packages | Always runs (safe) |
| Node.js 22 | Installs Node.js | Checks `command -v node` |
| PM2 | Installs PM2 globally | Checks `command -v pm2` |
| PostgreSQL 15 | Installs and initializes | Checks rpm package |
| cloudflared | Installs tunnel agent | Checks `command -v cloudflared` |
| strapi user | Creates system user | Checks `id strapi` |
| Directories | Creates /var/www/godatify, /etc/strapi, /var/log/strapi | Checks `-d` |
| PostgreSQL DB | Creates strapi db/user | Checks `psql -lqt` for db |
| PM2 Startup | Configures PM2 boot service | Checks systemd unit |

### After Setup

1. Configure environment variables:
   ```bash
   sudo vim /etc/strapi/env
   ```

2. Set up Cloudflare Tunnel (see [Cloudflare Tunnel](#cloudflare-tunnel))

3. Deploy code:
   ```bash
   ./scripts/infra/deploy-backend.sh
   ```

---

## Code Deployment

### Overview

Code deployment uses a **local-build strategy**: build on your Mac, rsync to server. This is required because the t4g.small instance (2GB RAM) cannot handle Strapi builds (requires 4GB+).

### Primary Method: Local Deploy (Recommended)

Run from your Mac in the project root:

```bash
# Standard deployment (builds locally, syncs to server)
cd backend && make deploy

# Dry run — preview what would be synced
make deploy-dry

# Quick deploy — skip build, sync existing dist/
make deploy-fast
```

**What `make deploy` Does:**

1. **Builds locally** — `npm run build` on your Mac
2. **Syncs to server** — rsync transfers `dist/`, `package*.json`, `config/`, etc.
3. **Installs deps on server** — `npm ci --omit=dev` (fast, no compilation)
4. **Reloads PM2** — Zero-downtime reload
5. **Health check** — Polls `/_health` until healthy (HTTP 204)

### Deploy Options

| Command | Description | When to Use |
|---------|-------------|-------------|
| `make deploy` | Full build + sync + reload | Normal deploys |
| `make deploy-dry` | Preview rsync (no changes) | Verify what will sync |
| `make deploy-fast` | Sync existing dist/ | Config changes, quick fixes |

### Emergency Only: Server-Side Deploy

> ⚠️ **Use only when you cannot access your dev machine** — for git-pull hot-fixes.

```bash
# SSH to server
ssh godatify-backend

# Run emergency deploy (pulls from git, skips build)
sudo /opt/godatify/scripts/deploy-backend.sh --skip-build
```

**Why emergency only?**
- Server has 2GB RAM; Strapi build needs 4GB+
- Build will likely OOM or take 10+ minutes
- Use `--skip-build` and only pull code changes

### First-Time Setup

Before first deployment, the server needs the repo cloned:

```bash
# SSH to server
ssh godatify-backend

# Clone repo (one-time)
sudo -u strapi git clone https://github.com/your-org/godatify-landing.git /var/www/godatify
```

Then from your Mac:
```bash
cd backend && make deploy
```

### Rollback

To rollback to a previous version:

```bash
# On your Mac — checkout previous commit
cd backend
git log --oneline -10
git checkout <commit-hash>
make deploy

# Or for emergency rollback (server-side)
ssh godatify-backend
cd /var/www/godatify
git log --oneline -10
git checkout <commit-hash>
sudo /opt/godatify/scripts/deploy-backend.sh --skip-build
```

---

## Connecting to the Server

### Method 1: AWS CLI with EC2 Instance Connect (Recommended)

**Prerequisites:**
- AWS CLI v2 installed
- IAM permissions for `ec2-instance-connect:OpenTunnel`
- Session Manager plugin (optional but helpful)

```bash
# 1. Get instance ID
INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=godatify-backend" \
  --query "Reservations[*].Instances[*].InstanceId" \
  --output text)

# 2. Connect via EIC Endpoint
aws ec2-instance-connect ssh \
  --instance-id $INSTANCE_ID \
  --os-user ec2-user

# Or with specific EIC endpoint
aws ec2-instance-connect ssh \
  --instance-id i-0123456789abcdef0 \
  --connection-type eice \
  --os-user ec2-user
```

### Method 2: SSH with Proxy Command

Add to `~/.ssh/config`:

```ssh
Host godatify-backend
  HostName i-0123456789abcdef0
  User ec2-user
  ProxyCommand aws ec2-instance-connect open-tunnel \
    --instance-id %h \
    --local-port %p
```

Then connect:
```bash
ssh godatify-backend
```

### Method 3: AWS Console

1. Open EC2 Console → Instances
2. Select `godatify-backend`
3. Click **Connect**
4. Choose **EC2 Instance Connect Endpoint**
5. Click **Connect**

### Switching to Strapi User

```bash
# After connecting as ec2-user
sudo -u strapi -i

# Or run single command as strapi
sudo -u strapi /var/www/godatify/backend/node_modules/.bin/strapi console
```

---

## Service Management

### Strapi Service (PM2)

PM2 manages the Strapi process. Commands should be run as the `strapi` user.

```bash
# Switch to strapi user
sudo -u strapi -i

# Status
pm2 status
pm2 describe strapi

# Start (first time or after delete)
pm2 start /opt/godatify/scripts/ecosystem.config.js

# Restart
pm2 restart strapi

# Zero-downtime reload (graceful)
pm2 reload strapi

# Stop
pm2 stop strapi

# Delete from PM2 (use restart/reload instead)
pm2 delete strapi

# Save current PM2 state (persist across reboots)
pm2 save

# Monitoring dashboard
pm2 monit

# View logs
pm2 logs strapi
pm2 logs strapi --lines 100

# Flush logs
pm2 flush
```

**PM2 startup persistence:**
```bash
# Generate startup script (run once during setup)
pm2 startup systemd -u strapi --hp /home/strapi

# After starting apps, save state
pm2 save
```

### PostgreSQL Service

```bash
# Status (native AL2023 service name is postgresql)
sudo systemctl status postgresql

# Start/Stop/Restart
sudo systemctl start postgresql
sudo systemctl stop postgresql
sudo systemctl restart postgresql

# Reload configuration (no restart needed)
sudo systemctl reload postgresql
```

### Cloudflare Tunnel Service

```bash
# Status
sudo systemctl status cloudflared

# Restart (after config changes)
sudo systemctl restart cloudflared

# View tunnel info
sudo cloudflared tunnel info

# Test tunnel connectivity
sudo cloudflared tunnel run --url http://localhost:1337 --hello-world
```

### Service Dependencies

```
                    ┌─────────────┐
                    │ cloudflared │ (systemd)
                    └──────┬──────┘
                           │ depends on
                           ▼
                    ┌─────────────┐
                    │   strapi    │ (PM2)
                    └──────┬──────┘
                           │ depends on
                           ▼
                    ┌─────────────┐
                    │ postgresql  │ (systemd)
                    └─────────────┘
```

Restart order: postgresql → strapi (via PM2) → cloudflared

---

## Log Analysis

### Strapi Logs (PM2)

```bash
# Real-time logs
pm2 logs strapi

# Last 100 lines
pm2 logs strapi --lines 100

# Log files location
tail -f /var/log/strapi/out.log
tail -f /var/log/strapi/error.log

# JSON-formatted logs (for parsing)
pm2 logs strapi --json

# Clear/rotate logs
pm2 flush strapi
```

### PostgreSQL Logs

```bash
# Current log file (native AL2023 path)
sudo tail -f /var/lib/pgsql/data/log/postgresql-*.log

# Recent errors
sudo grep -i error /var/lib/pgsql/data/log/postgresql-*.log

# Slow queries (if log_min_duration_statement enabled)
sudo grep -i duration /var/lib/pgsql/data/log/postgresql-*.log
```

### Cloudflare Tunnel Logs

```bash
# Real-time tunnel logs
sudo journalctl -u cloudflared -f

# Connection issues
sudo journalctl -u cloudflared | grep -i "error\|failed\|connection"
```

### System Logs

```bash
# General system messages
sudo journalctl -f

# Kernel messages
sudo dmesg -T | tail -50

# Memory pressure events
sudo journalctl -k | grep -i "oom\|memory"
```

---

## Database Operations

### Connecting to PostgreSQL

```bash
# As postgres superuser
sudo -u postgres psql

# As strapi user to strapi database
sudo -u postgres psql -d strapi -U strapi

# Quick query
sudo -u postgres psql -c "SELECT version();"
```

### Common Queries

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('strapi'));

-- Table sizes
SELECT 
  schemaname || '.' || tablename AS table,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 10;

-- Active connections
SELECT 
  usename,
  application_name,
  client_addr,
  state,
  query_start
FROM pg_stat_activity
WHERE datname = 'strapi';

-- Running queries
SELECT 
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query
FROM pg_stat_activity
WHERE state != 'idle'
AND datname = 'strapi';

-- Kill a long-running query
SELECT pg_terminate_backend(pid);
```

### Database Maintenance

```bash
# Vacuum analyze (run weekly)
sudo -u postgres vacuumdb --analyze --verbose strapi

# Reindex (run monthly, after hours)
sudo -u postgres reindexdb strapi

# Check for bloat
sudo -u postgres psql -d strapi -c "
SELECT 
  relname AS table,
  n_dead_tup AS dead_tuples,
  n_live_tup AS live_tuples,
  round(n_dead_tup * 100.0 / nullif(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
"
```

---

## Backup & Restore

### Manual Backup

```bash
# Run backup script manually
sudo /opt/godatify/scripts/backup-db.sh

# Check backup status
ls -la /var/lib/pgsql/backups/

# Verify backup integrity
sudo -u postgres pg_restore --list /var/lib/pgsql/backups/latest.dump | head -20
```

### Restore from pg_dump

```bash
# 1. Stop Strapi (prevent writes)
pm2 stop strapi

# 2. Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE strapi;"
sudo -u postgres psql -c "CREATE DATABASE strapi OWNER strapi;"

# 3. Restore from backup
sudo -u postgres pg_restore \
  --dbname=strapi \
  --verbose \
  /var/lib/pgsql/backups/strapi_2024-01-15.dump

# 4. Restart Strapi
pm2 start strapi
```

### Restore from S3

```bash
# 1. List available backups
aws s3 ls s3://godatify-backups/postgres/ --recursive

# 2. Download specific backup
aws s3 cp s3://godatify-backups/postgres/2024/01/strapi_2024-01-15.dump.gz /tmp/

# 3. Decompress
gunzip /tmp/strapi_2024-01-15.dump.gz

# 4. Restore (follow steps above)
```

### Restore from EBS Snapshot

```bash
# 1. Stop services
pm2 stop strapi
sudo systemctl stop cloudflared postgresql

# 2. In AWS Console:
#    - Create volume from snapshot
#    - Detach old data volume
#    - Attach restored volume as /dev/xvdf

# 3. Remount
sudo mount /dev/xvdf /var/lib/pgsql

# 4. Start services
sudo systemctl start postgresql
pm2 start strapi
sudo systemctl start cloudflared
```

---

## Cloudflare Tunnel

### Setup Overview

The tunnel exposes Strapi (port 1337) to the internet via `api.godatify.com`.

```yaml
# /etc/cloudflared/config.yml
tunnel: <TUNNEL-UUID>
credentials-file: /etc/cloudflared/creds.json

ingress:
  - hostname: api.godatify.com
    service: http://localhost:1337
  - service: http_status:404
```

### Managing the Tunnel

```bash
# List tunnels
cloudflared tunnel list

# Get tunnel info
cloudflared tunnel info godatify-api

# Check tunnel health (/_health endpoint returns HTTP 204)
curl -s -o /dev/null -w "%{http_code}" https://api.godatify.com/_health
# Returns: 204
```

### Rotating Tunnel Credentials

```bash
# 1. Delete old tunnel
cloudflared tunnel delete godatify-api

# 2. Create new tunnel
cloudflared tunnel create godatify-api

# 3. Update DNS (if UUID changed)
cloudflared tunnel route dns godatify-api api.godatify.com

# 4. Copy new credentials
sudo cp ~/.cloudflared/<NEW-UUID>.json /etc/cloudflared/creds.json
sudo chown cloudflared:cloudflared /etc/cloudflared/creds.json

# 5. Update config.yml with new UUID

# 6. Restart service
sudo systemctl restart cloudflared
```

### Tunnel Not Connecting?

```bash
# 1. Check credentials exist
ls -la /etc/cloudflared/creds.json

# 2. Verify tunnel exists in Cloudflare
cloudflared tunnel list

# 3. Test manual run
sudo cloudflared tunnel --config /etc/cloudflared/config.yml run

# 4. Check DNS
dig api.godatify.com

# 5. Verify local service (use /api as liveness check)
curl -s http://localhost:1337/api
```

---

## Troubleshooting

### Strapi Won't Start

```bash
# 1. Check PM2 status and logs
pm2 status
pm2 logs strapi --lines 50

# 2. Verify environment file exists
sudo cat /etc/strapi/env

# 3. Test manually as strapi user
sudo -u strapi bash -c "
  cd /var/www/godatify/backend
  source /etc/strapi/env
  npm run start
"

# 4. Check PostgreSQL is running
sudo systemctl status postgresql

# 5. Verify database connection
sudo -u strapi psql -h /var/run/postgresql -d strapi -c 'SELECT 1;'
```

### Database Connection Issues

```bash
# 1. Check PostgreSQL status
sudo systemctl status postgresql

# 2. Verify socket exists
ls -la /var/run/postgresql/

# 3. Check pg_hba.conf allows local connections
sudo cat /var/lib/pgsql/data/pg_hba.conf | grep -v "^#"

# 4. Test connection
sudo -u postgres psql -c 'SELECT 1;'

# 5. Reset strapi password if needed
sudo -u postgres psql -c "ALTER USER strapi PASSWORD 'newpassword';"
```

### High Memory Usage

```bash
# 1. Check what's using memory
free -h
ps aux --sort=-%mem | head -10

# 2. Check swap usage
swapon --show

# 3. Check for memory pressure
sudo journalctl -k | grep -i oom

# 4. Restart Strapi if memory leak suspected
pm2 restart strapi
```

### Slow API Response

```bash
# 1. Check system load
uptime
vmstat 1 5

# 2. Check PostgreSQL slow queries
sudo grep -i duration /var/lib/pgsql/data/log/postgresql-*.log | tail -20

# 3. Check if vacuum needed
sudo -u postgres psql -d strapi -c "
SELECT relname, n_dead_tup, last_vacuum, last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000;
"

# 4. Check disk I/O
iostat -x 1 5
```

---

## Emergency Procedures

### Strapi Down in Production

**Priority: P1 | Time to Resolve: <15 minutes**

```bash
# 1. Quick health check
pm2 status
sudo systemctl status postgresql cloudflared

# 2. Attempt restart
pm2 restart strapi

# 3. If restart fails, check logs
pm2 logs strapi --lines 100

# 4. Common fixes:
#    - Out of memory: pm2 restart strapi
#    - DB connection: sudo systemctl restart postgresql && pm2 restart strapi
#    - Disk full: Check df -h, clean logs (pm2 flush)

# 5. If tunnel down
sudo systemctl restart cloudflared

# 6. Verify recovery (use /api as liveness check)
curl -s https://api.godatify.com/api
```

### Database Corruption

**Priority: P0 | Escalate immediately**

```bash
# 1. Stop writes
sudo systemctl stop strapi cloudflared

# 2. Check PostgreSQL logs
sudo tail -100 /var/lib/pgsql/data/log/postgresql-*.log

# 3. If minor corruption, try repair
sudo -u postgres pg_resetwal /var/lib/pgsql/data

# 4. If major corruption, restore from backup
#    (See "Restore from EBS Snapshot" above)

# 5. Verify data integrity after restore
sudo -u postgres psql -d strapi -c "
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public';
"
```

### Disk Full

**Priority: P1 | Time to Resolve: <30 minutes**

```bash
# 1. Identify what's full
df -h

# 2. Find large files
sudo du -sh /* | sort -hr | head -10
sudo du -sh /var/lib/pgsql/* | sort -hr | head -10

# 3. Clean old logs
sudo journalctl --vacuum-time=3d
sudo rm -f /var/lib/pgsql/data/log/postgresql-*.log

# 4. Clean old backups
ls -la /var/lib/pgsql/backups/
sudo rm -f /var/lib/pgsql/backups/*.dump.old

# 5. If data volume full, consider resize
aws ec2 modify-volume --volume-id vol-xxx --size 30
sudo growpart /dev/xvdf 1
sudo xfs_growfs /var/lib/pgsql
```

### Security Incident

**Priority: P0 | Escalate immediately**

```bash
# 1. Isolate: Remove tunnel access
sudo systemctl stop cloudflared

# 2. Preserve evidence
sudo tar -czvf /tmp/incident-$(date +%Y%m%d).tar.gz \
  /var/log \
  /var/lib/pgsql/data/log

# 3. Check for suspicious activity
sudo last -20
sudo journalctl -u sshd | tail -50
sudo cat /var/log/secure | tail -50

# 4. If compromise confirmed:
#    - Rotate all credentials
#    - Restore from known-good backup
#    - Rebuild instance from scratch

# 5. Restore service after all-clear
sudo systemctl start cloudflared
```

---

## Scheduled Maintenance

### Daily (Automated)

- 03:00 UTC — EBS Snapshot (DLM)
- 04:00 UTC — pg_dump to S3
- 05:00 UTC — Log rotation

### Weekly (Manual Recommended)

- Vacuum analyze database
- Review slow query logs
- Check disk usage trends
- Verify backups are completing

### Monthly

- Apply security patches: `sudo dnf update --security`
- Reindex database
- Review CloudWatch metrics
- Test backup restoration

### Quarterly

- Rotate database password
- Review and update IAM policies
- Performance baseline comparison
- Cost optimization review
