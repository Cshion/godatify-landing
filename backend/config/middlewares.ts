export default ({ env }) => [
  'strapi::logger',
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
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
