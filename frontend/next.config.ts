const nextConfig = {
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
        hostname: 's3-godatify-assets-dev.s3.amazonaws.com', // Cover non-region specific too just in case
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
};

export default nextConfig;
