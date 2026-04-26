export default ({ env }) => [
  {
    name: 'strapi::logger',
    config: {
      level: env('LOG_LEVEL', 'info'),
    },
  },
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            's3.amazonaws.com',
            '*.s3.amazonaws.com', // Covers region-specific subdomains
            env('AWS_BUCKET') && env('AWS_REGION') ? `${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com` : '',
            env('AWS_BUCKET') ? `${env('AWS_BUCKET')}.s3.amazonaws.com` : '',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            's3.amazonaws.com',
            '*.s3.amazonaws.com',
            env('AWS_BUCKET') && env('AWS_REGION') ? `${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com` : '',
            env('AWS_BUCKET') ? `${env('AWS_BUCKET')}.s3.amazonaws.com` : '',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', [
        'http://localhost:3000',
        'https://godatify.com',
        'https://www.godatify.com',
        'https://godatify-landing.vercel.app',
      ]),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
