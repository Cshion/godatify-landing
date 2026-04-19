import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/actions/'],
      },
    ],
    sitemap: 'https://godatify.com/sitemap.xml',
  };
}
