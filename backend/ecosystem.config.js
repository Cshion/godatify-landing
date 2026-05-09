// ==============================================================================
// PM2 Ecosystem Configuration — LOCAL DEVELOPMENT
// ==============================================================================
// This file is for LOCAL DEVELOPMENT convenience.
// 
// Production uses a separate config at: scripts/infra/ecosystem.config.js
// (deployed to /opt/godatify/scripts/ecosystem.config.js on EC2)
//
// Usage (development):
//   Start:    pm2 start ecosystem.config.js
//   Stop:     pm2 stop strapi
//   Restart:  pm2 restart strapi
//   Logs:     pm2 logs strapi
//   Monitor:  pm2 monit
//
// See docs/deployment/RUNBOOK.md for production operations.
// ==============================================================================

module.exports = {
  apps: [
    {
      // ==========================================================================
      // Strapi Backend
      // ==========================================================================
      name: 'strapi',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,  // Use this directory for local dev

      // --------------------------------------------------------------------------
      // Cluster Mode - Utilize multiple CPU cores (dev machines usually have more)
      // --------------------------------------------------------------------------
      instances: 1, // Single instance for development
      exec_mode: 'fork',

      // --------------------------------------------------------------------------
      // Environment Variables
      // --------------------------------------------------------------------------
      env: {
        NODE_ENV: 'development',
        PORT: 1337,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 1337,
      },

      // --------------------------------------------------------------------------
      // Auto-Restart Configuration
      // --------------------------------------------------------------------------
      watch: false, // Don't watch files in production
      max_memory_restart: '1G', // Restart if memory exceeds 1GB
      min_uptime: '10s', // Minimum uptime to consider app started
      max_restarts: 10, // Max restarts within time window
      restart_delay: 4000, // Wait 4s between restarts

      // --------------------------------------------------------------------------
      // Log Management
      // --------------------------------------------------------------------------
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/pm2/strapi-error.log',
      out_file: '/var/log/pm2/strapi-out.log',
      merge_logs: true,
      log_type: 'json', // JSON format for easier parsing

      // --------------------------------------------------------------------------
      // Graceful Shutdown
      // --------------------------------------------------------------------------
      kill_timeout: 5000, // Wait 5s for graceful shutdown
      listen_timeout: 10000, // Wait 10s for app to listen

      // --------------------------------------------------------------------------
      // Health Monitoring
      // --------------------------------------------------------------------------
      // PM2 will automatically monitor CPU/Memory
      // Health check at http://localhost:1337/_health
    },
  ],

  // ============================================================================
  // Deployment Configuration (for pm2 deploy)
  // ============================================================================
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'YOUR_EC2_IP', // Replace with your EC2 IP
      ref: 'origin/main',
      repo: 'git@github.com:YOUR_USERNAME/godatify-landing.git',
      path: '/var/www/godatify',
      'pre-deploy-local': '',
      'post-deploy':
        'cd backend && npm ci --only=production && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
