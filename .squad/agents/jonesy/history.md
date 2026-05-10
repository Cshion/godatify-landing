# Jonesy — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Target:** AWS EC2 deployment
- **Stack:** Next.js 16 (frontend) + Strapi 5 (backend) + PostgreSQL

## Core Context

- Frontend: Next.js 16, currently can deploy to Vercel or EC2
- Backend: Strapi 5 with PostgreSQL and AWS S3 for uploads
- Database: PostgreSQL (production), SQLite (development)
- Media: AWS S3 for file uploads

## Deployment Targets

- **Backend:** EC2 instance with PM2 (no Docker)
- **Frontend:** Vercel (recommended) or EC2
- **Database:** EC2-hosted PostgreSQL

## Learnings

### 2026-04-18: Migration from Docker to PM2

**Aaron's request:** Remove Docker overhead for better server performance.

**Deleted Docker files:**
- `backend/Dockerfile`
- `backend/.dockerignore`
- `docker-compose.yml`
- `docker-compose.prod.yml`

**Created PM2-based deployment:**
- `backend/ecosystem.config.js` — PM2 cluster mode config
- `scripts/setup-ec2.sh` — Server setup automation (Node, PM2, Nginx, PostgreSQL, Certbot, UFW)
- `scripts/deploy.sh` — Zero-downtime deployment script
- Updated `DEPLOYMENT.md` — Full PM2 deployment guide
- Updated `.github/workflows/deploy.yml` — Removed Docker job

**Key decisions:**
- PM2 cluster mode for multi-core CPU utilization
- Nginx reverse proxy with SSL termination
- Let's Encrypt via Certbot for free SSL
- UFW firewall (only ports 22, 80, 443 exposed)
- Node 20 via nvm for version management
- Health check at `/_health` endpoint

### 2026-05-10: Added ZRAM Configuration

**Context:** t4g.small instances have only 2GB RAM. Memory pressure during Strapi admin operations or content imports could cause OOM kills.

**Added `step_configure_zram()` to setup-ec2.sh:**
- Config file: `/etc/systemd/zram-generator.conf`
- Size: RAM / 2 (~1GB, effective ~2-4GB after compression)
- Algorithm: `zstd` (best ratio for text/JSON workloads)
- Idempotent: checks for existing config before creating

**Why ZRAM over EBS swap:**
- CPU decompression faster than 3ms EBS latency
- No IOPS consumption (shared with PostgreSQL)
- Graceful degradation vs OOM kills

**Memory budget with ZRAM:**
- OS + caches: ~300MB
- PostgreSQL: ~100MB
- PM2 daemon: ~50-100MB
- Strapi: ~300-500MB
- Available with ZRAM: ~2-4GB effective for bursts

### 2026-04-19: Cloudflare Proxy + EC2 Integration

**Aaron's request:** Update deployment scripts to integrate Cloudflare proxy mode with EC2 backend.

**Updated `scripts/setup-ec2.sh`:**
- Added Cloudflare Origin Certificate directory setup (`/etc/ssl/cloudflare/`)
- Created `/opt/scripts/` directory for Cloudflare maintenance scripts
- Rewrote Nginx config template for Cloudflare proxy mode:
  - Includes `cloudflare-ips.conf` for real IP restoration
  - Uses `CF-Connecting-IP` header for visitor IPs
  - SSL configured for Cloudflare Origin Certificate
  - HTTP → HTTPS redirect
  - Security headers added
- Embedded Cloudflare IP update script at `/opt/scripts/cloudflare-ips.sh`
- Updated UFW to basic mode (full Cloudflare restriction done via `make update-cf-ips`)
- Updated summary with Cloudflare setup steps

**Updated `scripts/deploy.sh`:**
- Added `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` environment variables
- Added `--purge-cache` flag for optional Cloudflare cache purge after deploy
- Added `purge_cloudflare_cache()` function using Cloudflare API
- Updated help output with Cloudflare commands

**Created `scripts/cloudflare-ips.sh`:**
- Standalone script for managing Cloudflare IP ranges
- Commands: `list`, `ufw`, `iptables`, `nginx`, `all`, `check`, `help`
- Supports `DRY_RUN=1` for previewing changes
- Updates UFW firewall with Cloudflare-only rules
- Updates iptables with CLOUDFLARE chain
- Updates Nginx real_ip configuration
- Includes cron job example for weekly auto-updates

**Updated `backend/Makefile`:**
- Added `setup-cloudflare` target - guides Origin Certificate installation
- Added `update-cf-ips` target - runs cloudflare-ips.sh script
- Added `check-cf-ips` target - verifies CF IPs are current
- Updated help section with Cloudflare commands

**Key configurations:**
- Cloudflare Origin Certificate (15-year, trusted by CF only)
- SSL mode: Full (Strict) for end-to-end encryption
- Nginx uses `CF-Connecting-IP` header for real visitor IPs
- UFW restricted to Cloudflare IP ranges only
- Weekly cron job recommended for IP range updates

**PM2 configuration highlights:**
- `instances: 'max'` — Use all CPU cores
- `exec_mode: 'cluster'` — Cluster mode for load distribution
- `max_memory_restart: '1G'` — Auto-restart on memory limit
- Logs at `/var/log/pm2/strapi-*.log`

### 2026-04-18: Production Deployment Setup (Initial)

**Created initial deployment infrastructure (now superseded by PM2).**

**Strapi 5 specifics:**
- Build output goes to `dist/` and `build/`
- Requires vips for image processing (sharp)
- Health endpoint at `/_health` (built-in)
- Database config supports both SQLite (dev) and PostgreSQL (prod)

**AWS S3 integration:**
- Already configured via `@strapi/provider-upload-aws-s3`
- Needs env vars: `AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET`, `AWS_REGION`, `AWS_BUCKET`

**Security notes:**
- Never expose ports 1337 or 5432 externally
- Use Nginx as reverse proxy with SSL termination
- Generate all secrets with `openssl rand -base64 32`

### 2026-04-19: Migration to Cloudflare + Vercel Stack

**Aaron's request:** Update deployment for Cloudflare + Vercel architecture (not EC2 for frontend).

**Stack changes:**
- Frontend: Next.js on **Vercel** (was EC2)
- CDN/DNS: **Cloudflare** (DDoS, caching, WAF)
- Backend: Remains on **EC2 with PM2** (Strapi + PostgreSQL)

**Files updated:**
- `DEPLOYMENT.md` — Complete rewrite for Vercel + Cloudflare + EC2 architecture
- `frontend/vercel.json` — Added security headers, caching, rewrites, regions
- `.github/workflows/deploy.yml` — Dual deployment to Vercel (frontend) + EC2 (backend)
- `docs/cloudflare-setup.md` — New comprehensive Cloudflare configuration guide

**Architecture decisions:**
1. **Why Vercel for frontend:**
   - Zero-config Next.js deployment
   - Automatic preview deployments on PRs
   - Global edge network for fast TTFB
   - Built-in analytics and logs

2. **Why Cloudflare in front of both:**
   - DDoS protection (free tier sufficient)
   - Edge caching reduces Vercel/EC2 load
   - WAF for security
   - SSL/TLS termination with Full (Strict) mode
   - Analytics and traffic insights

3. **Why EC2 for backend:**
   - Strapi needs persistent database
   - Full control over PostgreSQL
   - Cost-effective for CMS backend
   - PM2 cluster mode for performance

**Cloudflare configuration highlights:**
- DNS: CNAME to `cname.vercel-dns.com` for frontend, A record for API
- SSL mode: Full (Strict) — requires valid certs on both origins
- Cache rules: Static assets (1 year), API GETs (4 hours), Admin bypass
- Security: Bot Fight Mode, HSTS, TLS 1.2 minimum

**vercel.json key settings:**
- Regions: `iad1` (US East), `sfo1` (US West) for latency
- Security headers: X-Frame-Options, X-Content-Type-Options, XSS protection
- Cache: Static assets 1 year, images 1 day with stale-while-revalidate
- Rewrites: `/api/cms/*` proxies to Strapi backend

**GitHub Actions workflow:**
- Frontend job: Uses Vercel CLI, posts preview URLs on PRs
- Backend job: SSH deployment to EC2, PM2 reload
- Conditional triggers: Only deploys changed components
- Optional Cloudflare cache purge after backend deploy

**Key learnings:**
- Cloudflare proxied DNS works well with Vercel's CNAME flattening
- Vercel CLI deployment is more reliable than GitHub integration for complex setups
- Cache invalidation: Use prefixes for surgical purges, not full cache purge
- CORS: Must include `*.vercel.app` for preview deployments

### 2026-04-19: Cloudflare Proxy Mode with EC2 Documentation

**Aaron's request:** Document how to use Cloudflare's full proxy mode (orange cloud) with EC2 backend, not DNS-only mode.

**Why proxy mode matters:**
- DDoS protection at Cloudflare edge
- WAF protection for SQL injection, XSS, etc.
- Edge caching reduces EC2 load
- Hides real server IP from attackers
- Free SSL termination at edge

**Key configurations documented:**

1. **SSL: Cloudflare Origin Certificates**
   - Free 15-year certs trusted only by Cloudflare
   - Simpler than Let's Encrypt renewal
   - Perfect since all traffic goes through CF anyway

2. **Nginx Real IP Restoration**
   - Must use `real_ip_header CF-Connecting-IP` (not X-Forwarded-For)
   - Must whitelist all Cloudflare IP ranges
   - Script provided to auto-update CF IPs weekly

3. **AWS Security Groups — Critical**
   - Restrict 80/443 to ONLY Cloudflare IPv4/IPv6 ranges
   - This is the key to forcing all traffic through CF
   - Script provided to auto-update security group rules

4. **Strapi Proxy Trust**
   - Set `proxy.enabled: true` in server.ts
   - Strapi 5 auto-trusts X-Forwarded-* headers when enabled
   - CORS must include production domains + Vercel preview patterns

5. **Authenticated Origin Pulls (Advanced)**
   - Extra layer: Nginx verifies Cloudflare client cert
   - Even if someone finds EC2 IP, they can't connect

**Key learnings:**
- CF-Connecting-IP header is more reliable than X-Forwarded-For (which can be spoofed)
- Security groups are the real enforcement — UFW/iptables alone isn't enough
- Cloudflare Origin Certificates eliminate Let's Encrypt renewal complexity
- Authenticated Origin Pulls provides defense-in-depth even if IP leaks
