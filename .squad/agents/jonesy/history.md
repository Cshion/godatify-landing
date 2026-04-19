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
