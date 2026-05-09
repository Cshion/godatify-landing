// ==============================================================================
// PM2 Ecosystem Configuration — PRODUCTION
// ==============================================================================
// PM2 configuration for Strapi on EC2 (t4g.small, 2GB RAM)
//
// Requirements:
//   - Node.js 22 LTS (Active LTS as of 2024)
//   - PostgreSQL 15 (native Amazon Linux 2023 repos)
//
// PostgreSQL Paths (Native AL2023):
//   - Data directory: /var/lib/pgsql/data
//   - Socket directory: /var/run/postgresql
//   - Binaries: /usr/bin
//   - Service name: postgresql
//   NOTE: NOT /var/lib/postgresql/ — that's the Debian/Ubuntu path!
//
// Installation:
//   npm install -g pm2
//   pm2 startup systemd -u strapi --hp /home/strapi
//
// Usage:
//   pm2 start /opt/godatify/scripts/ecosystem.config.js
//   pm2 save
//
// See docs/deployment/RUNBOOK.md for full operations guide.
// ==============================================================================

module.exports = {
  apps: [{
    // ==========================================================================
    // Strapi Backend
    // ==========================================================================
    name: 'strapi',
    cwd: '/var/www/godatify/backend',
    script: 'node_modules/@strapi/strapi/bin/strapi.js',
    args: 'start',

    // --------------------------------------------------------------------------
    // Process Configuration
    // --------------------------------------------------------------------------
    // Single instance due to 2GB RAM constraint
    // PostgreSQL needs ~500MB, Node.js heap = 1GB, leaves ~500MB for OS/ZRAM
    instances: 1,
    exec_mode: 'fork',

    // --------------------------------------------------------------------------
    // Environment Variables
    // --------------------------------------------------------------------------
    // NOTE: PM2 does NOT support env_file natively - it's silently ignored!
    // Environment variables must be loaded before PM2 starts.
    // See deploy-backend.sh which sources /etc/strapi/env before PM2 commands.
    env: {
      NODE_ENV: 'production',
      // Limit V8 heap to 1GB (leave room for PostgreSQL and OS)
      NODE_OPTIONS: '--max-old-space-size=1024',
    },

    // --------------------------------------------------------------------------
    // Memory Management
    // --------------------------------------------------------------------------
    // Restart if memory exceeds 1.2GB (safety margin before OOM)
    max_memory_restart: '1200M',

    // --------------------------------------------------------------------------
    // Restart Configuration
    // --------------------------------------------------------------------------
    // Wait 5 seconds between restarts to avoid rapid restart loops
    restart_delay: 5000,
    // Maximum 10 restarts within time window
    max_restarts: 10,
    // Minimum uptime to consider app started
    min_uptime: '10s',

    // --------------------------------------------------------------------------
    // Watch (disabled in production)
    // --------------------------------------------------------------------------
    watch: false,

    // --------------------------------------------------------------------------
    // Logging
    // --------------------------------------------------------------------------
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: '/var/log/strapi/error.log',
    out_file: '/var/log/strapi/out.log',
    merge_logs: true,
    // JSON format for easier parsing with log aggregators
    log_type: 'json',

    // --------------------------------------------------------------------------
    // Graceful Shutdown
    // --------------------------------------------------------------------------
    // Wait 5 seconds for graceful shutdown before SIGKILL
    kill_timeout: 5000,
    // Wait 10 seconds for app to listen on port
    listen_timeout: 10000,

    // --------------------------------------------------------------------------
    // Health Monitoring
    // --------------------------------------------------------------------------
    // PM2 automatically monitors CPU/Memory
    // Health endpoint: http://localhost:1337/_health (built-in Strapi endpoint)
    // Returns HTTP 204 No Content when healthy
    // Header: strapi: You are so French!
  }],
};
