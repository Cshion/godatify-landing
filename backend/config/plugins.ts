export default ({ env }) => {
    const isDev = env('NODE_ENV') === 'development';
    const disableS3 = env.bool('DISABLE_S3', isDev); // Default to true in dev
    console.log('[CONFIG] Loading plugins config. DISABLE_S3:', disableS3);
    
    // Base config with cache (always enabled)
    const baseConfig = {
        'strapi-cache': {
            enabled: true,
            config: {
                max: 500,                    // Max cached items
                ttl: 1000 * 60 * 30,         // 30 minutes TTL
                // Cache all GET requests except contact form
                cacheableRoutes: [
                    '/api/services',
                    '/api/case-studies',
                    '/api/testimonials',
                    '/api/clients',
                    '/api/industries',
                    '/api/sectors',
                    '/api/company-info',
                    '/api/home-page',
                    '/api/about-page',
                    '/api/industries-page',
                    '/api/contact-page',
                    '/api/blog-posts',
                    '/api/authors',
                    '/api/social-links',
                ],
            },
        },
    };
    
    if (disableS3) {
        return baseConfig;
    }
    
    return {
        ...baseConfig,
        upload: {
            config: {
                provider: 'aws-s3',
                providerOptions: {
                    rootPath: 'uploads',
                    s3Options: {
                        accessKeyId: env('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
                        region: env('AWS_REGION'),
                        params: {
                            Bucket: env('AWS_BUCKET'),
                            ACL: null, // Disable ACLs for Bucket Owner Enforced setting
                        },
                    },
                },
                actionOptions: {
                    upload: {
                        ACL: null,
                    },
                    uploadStream: {
                        ACL: null,
                    },
                    delete: {},
                },
            },
        },
    };
};
