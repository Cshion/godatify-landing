#!/bin/bash
# ==============================================================================
# Deployment Script for godatify-landing
# ==============================================================================
# This script deploys the latest code to the EC2 server
#
# Usage: bash scripts/deploy.sh [--frontend] [--backend] [--full]
#   --backend  : Deploy backend only (default)
#   --frontend : Deploy frontend only
#   --full     : Deploy both frontend and backend
#
# Requirements:
#   - PM2 installed globally
#   - Application at /var/www/godatify
#   - Environment file at backend/.env
# ==============================================================================

set -e

# Configuration
DEPLOY_PATH="/var/www/godatify"
BACKEND_PATH="$DEPLOY_PATH/backend"
FRONTEND_PATH="$DEPLOY_PATH/frontend"
PM2_APP_NAME="strapi"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# Parse arguments
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=false

for arg in "$@"; do
    case $arg in
        --frontend)
            DEPLOY_BACKEND=false
            DEPLOY_FRONTEND=true
            ;;
        --backend)
            DEPLOY_BACKEND=true
            DEPLOY_FRONTEND=false
            ;;
        --full)
            DEPLOY_BACKEND=true
            DEPLOY_FRONTEND=true
            ;;
        *)
            log_error "Unknown argument: $arg"
            exit 1
            ;;
    esac
done

# ==============================================================================
# Start Deployment
# ==============================================================================
echo ""
echo "=============================================================================="
echo -e "${GREEN}Starting Deployment${NC}"
echo "=============================================================================="
echo "  Backend:  $DEPLOY_BACKEND"
echo "  Frontend: $DEPLOY_FRONTEND"
echo "=============================================================================="
echo ""

START_TIME=$(date +%s)

# ==============================================================================
# Pull Latest Code
# ==============================================================================
log_step "Pulling latest code from git..."
cd "$DEPLOY_PATH"
git fetch origin main
git reset --hard origin/main

log_info "Code updated to: $(git rev-parse --short HEAD)"

# ==============================================================================
# Backend Deployment
# ==============================================================================
if [ "$DEPLOY_BACKEND" = true ]; then
    log_step "Deploying backend..."
    cd "$BACKEND_PATH"

    # Check for .env file
    if [ ! -f ".env" ]; then
        log_error "Missing .env file in backend directory!"
        log_error "Create it with: cp .env.example .env && nano .env"
        exit 1
    fi

    # Install dependencies (production only)
    log_info "Installing dependencies..."
    npm ci --only=production

    # Build Strapi
    log_info "Building Strapi..."
    NODE_ENV=production npm run build

    # Restart PM2
    log_info "Restarting PM2..."
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        # App exists, reload it (zero-downtime)
        pm2 reload ecosystem.config.js --env production
    else
        # App doesn't exist, start it
        pm2 start ecosystem.config.js --env production
    fi

    # Save PM2 process list
    pm2 save

    log_info "Backend deployment complete!"
fi

# ==============================================================================
# Frontend Deployment (Optional - if not using Vercel)
# ==============================================================================
if [ "$DEPLOY_FRONTEND" = true ]; then
    log_step "Deploying frontend..."
    cd "$FRONTEND_PATH"

    # Install dependencies
    log_info "Installing dependencies..."
    npm ci --only=production

    # Build Next.js
    log_info "Building Next.js..."
    npm run build

    # Restart frontend PM2 process (if running)
    if pm2 describe "nextjs" > /dev/null 2>&1; then
        pm2 reload nextjs --env production
    else
        # Start frontend (adjust port as needed)
        pm2 start npm --name "nextjs" -- start
    fi

    pm2 save

    log_info "Frontend deployment complete!"
fi

# ==============================================================================
# Health Check
# ==============================================================================
log_step "Running health check..."
sleep 5

HEALTH_URL="http://127.0.0.1:1337/_health"
MAX_ATTEMPTS=12
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "204" ]; then
        log_info "Health check passed (HTTP $RESPONSE)"
        break
    else
        log_warn "Health check attempt $ATTEMPT/$MAX_ATTEMPTS (HTTP $RESPONSE)"
        if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
            log_error "Health check failed after $MAX_ATTEMPTS attempts"
            log_error "Check logs with: pm2 logs $PM2_APP_NAME"
            exit 1
        fi
        sleep 5
        ((ATTEMPT++))
    fi
done

# ==============================================================================
# Summary
# ==============================================================================
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "=============================================================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=============================================================================="
echo ""
echo "  Duration:    ${DURATION}s"
echo "  Commit:      $(git rev-parse --short HEAD)"
echo "  Branch:      $(git rev-parse --abbrev-ref HEAD)"
echo "  Time:        $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "PM2 Status:"
pm2 list
echo ""
echo "Useful commands:"
echo "  pm2 logs $PM2_APP_NAME     - View logs"
echo "  pm2 monit                   - Monitor processes"
echo "  pm2 restart $PM2_APP_NAME  - Restart app"
echo ""
echo "=============================================================================="
