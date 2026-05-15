import { MetadataRoute } from 'next';
import { api } from '@/lib/api';
import { SITE_URL } from '@/lib/seo';

// Build date is evaluated once at build/deploy time (not per-request)
// This gives Google a stable date that updates with each deploy
const BUILD_DATE = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;

    const posts = await api.blog.getAll();
    const services = await api.services.getAll();
    const cases = await api.cases.getAll();
    const sectors = await api.industries.getSectors();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: BUILD_DATE,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/nosotros`,
            lastModified: BUILD_DATE,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/servicios`,
            lastModified: BUILD_DATE,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/casos`,
            lastModified: BUILD_DATE,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: BUILD_DATE,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/industrias`,
            lastModified: BUILD_DATE,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: BUILD_DATE,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
        url: `${baseUrl}/servicios/${service.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    const caseRoutes: MetadataRoute.Sitemap = cases.map((c) => ({
        url: `${baseUrl}/casos/${c.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // Flatten industries from all sectors
    const industries = sectors.flatMap((sector) => sector.industries || []);
    const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
        url: `${baseUrl}/industrias/${industry.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes, ...serviceRoutes, ...caseRoutes, ...industryRoutes];
}
