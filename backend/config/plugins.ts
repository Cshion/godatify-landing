export default ({ env }) => {
    const isDev = env('NODE_ENV') === 'development';
    const disableS3 = env.bool('DISABLE_S3', isDev); // Default to true in dev
    console.log('[CONFIG] Loading plugins config. DISABLE_S3:', disableS3);
    if (disableS3) {
        return {};
    }
    return {
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
        graphql: {
            config: {
                defaultLimit: 100,
                maxLimit: 200,
                depthLimit: 1,
                apolloServer: {
                    tracing: false,
                },
            },
        },
    };
};
