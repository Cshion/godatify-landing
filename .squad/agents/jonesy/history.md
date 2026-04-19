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

- **Backend:** EC2 instance with PM2 or Docker
- **Frontend:** EC2 or Vercel
- **Database:** RDS PostgreSQL or EC2-hosted PostgreSQL

## Learnings

### 2026-04-18: Production Deployment Setup

**Created deployment infrastructure:**
- `backend/Dockerfile` — Multi-stage build (deps → builder → production)
- `backend/.dockerignore` — Excludes dev files from Docker context
- `docker-compose.yml` — Local testing with PostgreSQL
- `docker-compose.prod.yml` — Production overrides
- `DEPLOYMENT.md` — Comprehensive deployment guide
- `.github/workflows/deploy.yml` — CI/CD pipeline

**Key decisions:**
- Node 20 Alpine base image (smaller, faster)
- Non-root user in container for security
- Health check endpoint at `/_health`
- PM2 recommended for non-Docker setups
- Let's Encrypt for SSL with Certbot

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
