import type { NextConfig } from 'next';

// Security headers for production
const securityHeaders = [
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Prevent clickjacking - only allow same origin framing
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    // Control referrer information sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Disable unnecessary browser features
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Force HTTPS (Cloudflare/Vercel handle this, but belt-and-suspenders)
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    // Content Security Policy - balanced for functionality and security
    key: 'Content-Security-Policy',
    value: [
      // Default: only same origin
      "default-src 'self'",
      // Scripts: self + Vercel analytics + inline for Next.js hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      // Styles: self + inline (required for Tailwind/styled-components)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self + all configured remote patterns + data URIs
      "img-src 'self' data: blob: https://api.godatify.com https://*.s3.amazonaws.com https://*.s3.us-east-1.amazonaws.com https://images.unsplash.com https://placehold.co https://ui-avatars.com",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // API connections: self + Strapi backend
      "connect-src 'self' https://api.godatify.com https://va.vercel-scripts.com",
      // Media (video/audio): self + Strapi
      "media-src 'self' https://api.godatify.com",
      // Frames: none (we don't embed iframes)
      "frame-src 'none'",
      // Form submissions: self + Strapi
      "form-action 'self' https://api.godatify.com",
      // Base URI: self only
      "base-uri 'self'",
      // Prevent clickjacking
      "frame-ancestors 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.godatify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 's3-godatify-assets-dev.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3-godatify-assets-dev.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3-godatify-assets-prod.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3-godatify-assets-prod.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
      },
    ],
  },

  // Apply security headers to all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
