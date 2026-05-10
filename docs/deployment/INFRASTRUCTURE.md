# Infrastructure Architecture — godatify-landing

Production infrastructure for Strapi CMS backend on AWS EC2 with cost-optimized design.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Cost Breakdown](#cost-breakdown)
3. [Compute Configuration](#compute-configuration)
4. [Network Architecture](#network-architecture)
5. [Storage Design](#storage-design)
6. [Security Model](#security-model)
7. [Performance Tuning](#performance-tuning)
8. [Backup Strategy](#backup-strategy)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Internet                                           │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Cloudflare (Global Edge)                                │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │  • DDoS Protection      • WAF Rules           • Edge Caching              │  │
│  │  • SSL/TLS Termination  • Analytics           • Bot Management            │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┬────────────────────────┘
                  │                                       │
                  │ DNS: godatify.com                     │ Cloudflare Tunnel
                  │ CNAME → Vercel                        │ api.godatify.com
                  ▼                                       ▼
┌──────────────────────────────────┐     ┌────────────────────────────────────────┐
│       Vercel (Frontend)          │     │           AWS EC2 (Backend)            │
│  ┌────────────────────────────┐  │     │  ┌──────────────────────────────────┐  │
│  │    Next.js Application     │  │     │  │      Cloudflare Tunnel Agent     │  │
│  │  • Edge Functions          │  │     │  │      (cloudflared daemon)        │  │
│  │  • ISR/SSG                 │  │     │  └──────────────┬───────────────────┘  │
│  │  • Image Optimization      │  │     │                 │ localhost:1337       │
│  └────────────────────────────┘  │     │                 ▼                      │
└──────────────────────────────────┘     │  ┌──────────────────────────────────┐  │
                                         │  │      Strapi CMS (Node.js 22)     │  │
                                         │  │  • REST/GraphQL API              │  │
                                         │  │  • Media Library                 │  │
                                         │  │  • Admin Panel                   │  │
                                         │  └──────────────┬───────────────────┘  │
                                         │                 │ Unix Socket          │
                                         │                 ▼                      │
                                         │  ┌──────────────────────────────────┐  │
                                         │  │      PostgreSQL 15               │  │
                                         │  │  • /var/lib/pgsql (native/XFS)    │  │
                                         │  │  • Tuned for 2GB RAM             │  │
                                         │  └──────────────────────────────────┘  │
                                         │                                        │
                                         │  Region: us-east-1                     │
                                         │  Instance: t4g.small (ARM64)           │
                                         │  NO Public IPv4                        │
                                         └────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **No public IPv4** | Saves ~$3.60/month; Cloudflare Tunnel provides ingress |
| **ARM64 (Graviton3)** | 20% better price/performance vs x86 |
| **Amazon Linux 2023** | Optimized for EC2, 5-year support, SELinux-ready |
| **Cloudflare Tunnel** | Zero-trust ingress, no exposed ports, built-in DDoS |
| **Separate data volume** | Independent backups, easier resizing, better IOPS |
| **Unix Domain Sockets** | Lower latency for DB connections (~10% faster) |
| **Idempotent setup** | Safe to re-run setup scripts on existing instances |
| **PM2 for Strapi** | Familiar Node.js tooling, `pm2 monit`, easy zero-downtime reload |

---

## Cost Breakdown

### Monthly Estimate (us-east-1)

| Resource | Specification | Cost (USD) |
|----------|---------------|------------|
| EC2 Instance | t4g.small (730 hrs) | $6.12 |
| Root Volume | 10 GB gp3 | $0.80 |
| Data Volume | 20 GB gp3 | $1.60 |
| EBS Snapshots | ~30 GB (daily, 7 retained) | $1.50 |
| S3 Glacier IR | ~5 GB pg_dump backups | $0.40 |
| Data Transfer | 50 GB outbound (via CF Tunnel) | $0.00* |
| EC2 Instance Connect Endpoint | 1 endpoint | $0.00 |
| **Total** | | **~$10.42** |

*Cloudflare Tunnel egress is free; standard EC2 egress would add ~$4.50

### Reserved Instance Savings

| Term | Upfront | Monthly Effective | Savings |
|------|---------|-------------------|---------|
| 1-Year No Upfront | $0 | $3.87 | 37% |
| 1-Year Partial | $22 | $3.06 | 50% |
| 3-Year Partial | $42 | $1.94 | 68% |

---

## Compute Configuration

### Instance Specification

```yaml
Instance Type: t4g.small
Architecture: ARM64 (Graviton3)
vCPUs: 2
Memory: 2 GiB
Network: Up to 5 Gbps
EBS Bandwidth: Up to 2,085 Mbps
CPU Credits: T4g Unlimited (recommended)
```

### Operating System

```yaml
AMI: Amazon Linux 2023
Kernel: 6.1 LTS
Package Manager: dnf
Init System: systemd
SELinux: Enforcing (permissive for setup)
```

### Software Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 22.x LTS | Via dnf or nvm |
| npm | 10.x | Bundled with Node.js |
| PM2 | Latest | Process manager for Strapi |
| PostgreSQL | 15.x | Native AL2023 repos |
| cloudflared | Latest | Cloudflare Tunnel daemon |

### Why PostgreSQL 15 (Not 17)

We use PostgreSQL 15 from Amazon Linux 2023 native repositories instead of PostgreSQL 17 from PGDG because:

- **Official support:** AL2023 repos are maintained by AWS and guaranteed compatible
- **PGDG compatibility:** PostgreSQL PGDG repo officially supports RHEL 9, not Amazon Linux 2023. While it may work due to binary compatibility, it’s not officially supported.
- **Stability:** Native packages follow AL2023's deterministic update model
- **Strapi compatibility:** Strapi requires PostgreSQL 14+ minimum; 15 fully qualifies

PostgreSQL 15 includes all features needed for Strapi CMS and is a maintained LTS version.

### Setup Scripts

Instance configuration uses idempotent scripts that can be run multiple times safely.

```
scripts/infra/
├── setup-ec2.sh         # Instance configuration (idempotent)
├── deploy-local.sh      # LOCAL BUILD deploys from Mac (primary method)
├── deploy-backend.sh    # Server-side deploy (emergency hot-fixes only)
├── ecosystem.config.js  # PM2 configuration
├── backup-db.sh         # Database backup
├── cloudflared.service  # Tunnel systemd service
└── archive/
    └── user-data.sh.bak # Archived (replaced by setup-ec2.sh)
```

**setup-ec2.sh** — Configures a fresh or existing EC2 instance:
- Configures EBS data volume for PostgreSQL (if attached)
- Installs Node.js, PostgreSQL, PM2, cloudflared
- Creates strapi user and directories
- Configures PostgreSQL database
- Sets up PM2 startup

**deploy-local.sh** — Primary deployment method (LOCAL BUILD strategy):
- Builds Strapi locally on your Mac (ARM64 M1/M2/M3 compatible)
- Syncs built artifacts to EC2 via rsync over SSH
- Installs npm dependencies on server (npm ci --omit=dev)
- Reloads PM2 with zero downtime

> **Why local build?** The t4g.small instance (2GB RAM) is too small to build Strapi.
> Building locally leverages Mac's resources and avoids OOM issues on the server.

**deploy-backend.sh** — Emergency server-side deploys:
- For hot-fixes that only need `git pull` (no build changes)
- For emergencies without access to dev machine
- Skips build by default (server is too small)

See [RUNBOOK.md](./RUNBOOK.md) for detailed usage.

---

## Network Architecture

### Security Groups

**No inbound rules required** — all ingress via Cloudflare Tunnel.

```yaml
Inbound Rules: []  # Empty - no public ports

Outbound Rules:
  - Protocol: TCP
    Port: 443
    Destination: 0.0.0.0/0
    Description: HTTPS for package managers, Cloudflare Tunnel
  - Protocol: TCP
    Port: 80
    Destination: 0.0.0.0/0
    Description: HTTP redirects (package managers)
```

### SSH Access via EC2 Instance Connect Endpoint

```
┌────────────────┐      ┌─────────────────────┐      ┌─────────────┐
│  Your Machine  │ ───► │  EIC Endpoint (VPC) │ ───► │  EC2 (pvt)  │
│  (aws cli)     │      │  (AWS managed)      │      │  no pub IP  │
└────────────────┘      └─────────────────────┘      └─────────────┘
```

Benefits:
- No SSH key management
- IAM-based authentication
- CloudTrail audit logging
- No bastion host needed

### Cloudflare Tunnel Flow

```
┌──────────┐    ┌─────────────────┐    ┌──────────────┐    ┌─────────┐
│  Client  │───►│  Cloudflare     │◄───│  cloudflared │───►│  Strapi │
│  Browser │    │  Edge (global)  │    │  (EC2 daemon)│    │  :1337  │
└──────────┘    └─────────────────┘    └──────────────┘    └─────────┘
     HTTPS           Tunnel ID              localhost
```

---

## Storage Design

### Volume Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     Root Volume (/dev/xvda)                 │
│                     10 GB gp3 (3000 IOPS / 125 MB/s)        │
├─────────────────────────────────────────────────────────────┤
│  /                  Amazon Linux 2023 root filesystem       │
│  /usr               Node.js, npm, system packages           │
│  /var/www/godatify  Strapi application code                 │
│  /home/strapi       Strapi user home directory              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Data Volume (/dev/xvdf)                  │
│                    20 GB gp3 (3000 IOPS / 125 MB/s)         │
├─────────────────────────────────────────────────────────────┤
│  /var/lib/pgsql        PostgreSQL data directory (native)   │
│                        ├── data/                            │
│                        ├── backups/ (local staging)         │
│                        └── data/pg_wal/ (WAL logs)          │
└─────────────────────────────────────────────────────────────┘
```

### Filesystem Configuration

```bash
# Root volume - ext4 (Amazon Linux default)
# Data volume - XFS (better for databases)

# /etc/fstab entry for data volume
# NOTE: Native AL2023 uses /var/lib/pgsql, NOT /var/lib/postgresql (Debian/Ubuntu path)
UUID=<data-vol-uuid>  /var/lib/pgsql  xfs  defaults,noatime,nodiratime  0 2
```

**setup-ec2.sh handles this automatically:**
1. Detects if a data volume is attached (`/dev/nvme1n1` on Nitro or `/dev/xvdf`)
2. Formats as XFS if unformatted
3. Mounts to `/var/lib/pgsql`
4. Adds fstab entry for persistence

If no data volume is attached, PostgreSQL uses the root volume (not recommended for production).

### Why Separate Data Volume?

1. **Independent Snapshots** — Backup only data, not OS
2. **Easy Resizing** — Grow data volume without instance stop
3. **Better IOPS** — Dedicated throughput for database
4. **Migration Ready** — Attach to new instance if needed
5. **Cost Clarity** — Track data storage costs separately

---

## Security Model

### Defense in Depth

```
Layer 1: Cloudflare (Edge)
├── DDoS Protection (automatic)
├── WAF Rules (managed + custom)
├── Bot Management
├── Rate Limiting
└── Geographic restrictions

Layer 2: AWS Network
├── VPC isolation
├── No public IP (no direct attack surface)
├── Security Groups (empty inbound)
├── EIC Endpoint (IAM-authenticated SSH)
└── CloudTrail logging

Layer 3: OS Level
├── Amazon Linux 2023 hardening
├── SELinux (enforcing)
├── Automatic security updates
├── Dedicated service user (strapi)
└── Minimal installed packages

Layer 4: Application
├── Strapi admin authentication
├── API tokens with scopes
├── CORS restrictions
└── Rate limiting (Strapi middleware)
```

### IAM Policy for EIC Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2-instance-connect:OpenTunnel"
      ],
      "Resource": "arn:aws:ec2:us-east-1:ACCOUNT:instance/i-INSTANCE_ID",
      "Condition": {
        "NumericEquals": {
          "ec2-instance-connect:remotePort": "22"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "ec2:DescribeInstances",
      "Resource": "*"
    }
  ]
}
```

### Secrets Management

| Secret | Storage | Rotation |
|--------|---------|----------|
| Strapi APP_KEYS | /etc/strapi/env | Manual (on compromise) |
| DB Password | /etc/strapi/env | Quarterly |
| Cloudflare Tunnel Token | /etc/cloudflared/creds | Never (use service token) |
| AWS Credentials | EC2 Instance Role | Automatic |

---

## Performance Tuning

### PostgreSQL Tuning (2GB RAM)

```ini
# /var/lib/pgsql/data/postgresql.conf
# NOTE: PostgreSQL 15 installed from native AL2023 repos
# Data path: /var/lib/pgsql/data (NOT /var/lib/postgresql/)
# Service: postgresql (NOT postgresql-17)
# Binaries: /usr/bin

# Memory
shared_buffers = 512MB              # 25% of RAM
effective_cache_size = 1536MB       # 75% of RAM
work_mem = 16MB                     # Per-operation memory
maintenance_work_mem = 128MB        # For VACUUM, CREATE INDEX

# Connections
max_connections = 50                # Strapi pool max + buffer
unix_socket_directories = '/var/run/postgresql'

# WAL
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 1GB
min_wal_size = 80MB

# Query Planner
random_page_cost = 1.1              # SSD optimization
effective_io_concurrency = 200      # SSD concurrent reads

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_min_duration_statement = 1000   # Log queries > 1s
```

### Node.js Tuning

```bash
# /etc/strapi/env
NODE_ENV=production
NODE_OPTIONS="--max-old-space-size=1024"  # 1GB heap limit
```

### PM2 Process Management

PM2 is used for Strapi process management (PostgreSQL and cloudflared remain on systemd).

**Benefits:**
- Familiar Node.js tooling (`pm2 monit`, `pm2 logs`)
- Zero-downtime reloads (`pm2 reload`)
- Built-in log rotation and management
- Automatic restart on crash with configurable delays
- Memory limit enforcement (`max_memory_restart`)

**Memory overhead:** ~50-100MB for PM2 daemon.

**Configuration:** `/opt/godatify/scripts/ecosystem.config.js`

```bash
# Key commands
pm2 status          # Process list
pm2 monit           # Real-time dashboard
pm2 logs strapi     # View logs
pm2 reload strapi   # Zero-downtime restart
pm2 save            # Persist state for reboot
```

### Memory Budget (2GB Instance)

| Component | Allocation | Notes |
|-----------|------------|-------|
| OS + Kernel | ~200MB | Base Amazon Linux 2023 |
| PostgreSQL | ~600MB | shared_buffers + work_mem |
| Node.js (Strapi) | ~1024MB | V8 heap max |
| PM2 Daemon | ~100MB | Process manager overhead |
| Cloudflared | ~50MB | Tunnel agent |
| **Buffer** | ~100MB | Headroom for spikes |

Total committed: ~2GB. Monitor with `free -h` and `pm2 monit`.

> **Note:** No swap configured by default. If memory pressure occurs frequently,
> consider adding a small swap file or upgrading to a larger instance.

---

## Backup Strategy

### Tier 1: EBS Snapshots (via DLM)

```yaml
Policy: godatify-data-backup
Target: Data volume only (/dev/xvdf)
Schedule: Daily at 03:00 UTC
Retention: 7 daily snapshots
Cross-Region: Optional (us-west-2 for DR)
```

**Recovery Time:** ~5-15 minutes (attach snapshot to new volume)

### Tier 2: pg_dump to S3

```yaml
Schedule: Daily at 04:00 UTC (after snapshot)
Format: Custom format with compression (-Fc)
Destination: s3://godatify-backups/postgres/
Storage Class: Glacier Instant Retrieval
Retention: 30 daily, 12 weekly, 12 monthly
```

**Recovery Time:** ~2-5 minutes for SQL restore

### Tier 3: Application Backups

```yaml
What: Strapi uploads folder, .env configuration
Schedule: Weekly
Destination: s3://godatify-backups/app/
```

### Recovery Scenarios

| Scenario | RTO | RPO | Method |
|----------|-----|-----|--------|
| Accidental data deletion | 5 min | 24h | pg_dump restore |
| Volume corruption | 15 min | 24h | EBS snapshot restore |
| Instance failure | 30 min | 24h | Launch new, attach volume |
| Region outage | 2h | 24h | Cross-region snapshot |

---

## S3 Lifecycle Policy

Backup retention with cost-optimized storage transitions:

### Lifecycle Rules

| Age | Storage Class | Cost (per GB/month) |
|-----|---------------|---------------------|
| 0-30 days | S3 Standard | $0.023 |
| 30-90 days | S3 Standard-IA | $0.0125 |
| 90+ days | Glacier Deep Archive | $0.00099 |

### Estimated Monthly Costs

Assuming ~5GB of pg_dump backups retained:

| Tier | Data Volume | Monthly Cost |
|------|-------------|-------------|
| Standard (recent 30 days) | ~5 GB | $0.12 |
| Standard-IA (30-90 days) | ~10 GB | $0.13 |
| Glacier Deep Archive (90+ days) | ~50 GB | $0.05 |
| **Total** | ~65 GB | **~$0.30** |

### Lifecycle Configuration

```json
{
  "Rules": [
    {
      "ID": "godatify-backup-lifecycle",
      "Status": "Enabled",
      "Filter": { "Prefix": "postgres/" },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

### Notes

- Glacier Deep Archive has 12-hour retrieval time (use Standard for quick restores)
- Minimum storage duration: 90 days for Standard-IA, 180 days for Deep Archive
- Consider keeping last 7 daily backups in Standard for fast RTO

---

## Related Documentation

- [RUNBOOK.md](./RUNBOOK.md) — Day-to-day operations
- [../cloudflare-setup.md](../cloudflare-setup.md) — Cloudflare configuration
- [../../DEPLOYMENT.md](../../DEPLOYMENT.md) — Deployment procedures
