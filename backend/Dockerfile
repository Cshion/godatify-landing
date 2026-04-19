# ==============================================================================
# Strapi Backend Dockerfile
# Multi-stage build for production deployment
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps

# Install build dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++ vips-dev

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev for build)
RUN npm ci

# ------------------------------------------------------------------------------
# Stage 2: Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat vips-dev

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments for build-time environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build Strapi admin panel
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Production
# ------------------------------------------------------------------------------
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache libc6-compat vips curl

# Create non-root user for security
RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 --ingroup strapi strapi

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Copy package files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database
COPY --from=builder /app/types ./types
COPY --from=builder /app/tsconfig.json ./

# Create directories for uploads and tmp data
RUN mkdir -p /app/public/uploads /app/.tmp && \
    chown -R strapi:strapi /app

# Switch to non-root user
USER strapi

# Expose Strapi port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:1337/_health || exit 1

# Start Strapi
CMD ["npm", "run", "start"]
