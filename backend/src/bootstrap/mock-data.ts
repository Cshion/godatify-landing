/**
 * Mock Data Seeding
 * 
 * Seeds test/mock data from seed-data/mock/.
 * This includes: blog posts, case studies (with full relation resolution).
 * 
 * RUNS IN DEVELOPMENT ENVIRONMENT ONLY.
 */
import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import { seedCollection } from './utils';

const MOCK_DATA_PATH = path.join(process.cwd(), 'seed-data', 'mock');

/**
 * Seeds all mock/test data from JSON files.
 */
export async function seedMockData(strapi: Core.Strapi): Promise<void> {
    console.log(`[SEED] Mock Data Path: ${MOCK_DATA_PATH}`);

    if (!fs.existsSync(MOCK_DATA_PATH)) {
        console.warn('[SEED] Mock data path does not exist, skipping.');
        return;
    }

    try {
        // Blog Posts (depend on Authors)
        await seedBlogPosts(strapi);

        // Case Studies (depend on Clients, Industries, Services)
        await seedCaseStudies(strapi);

        console.log('[SEED] Mock data seeding complete.');
    } catch (error) {
        console.error('[SEED] Error seeding Mock Data:', error);
    }
}

/**
 * Seeds blog posts with author relations and rich text image processing.
 */
async function seedBlogPosts(strapi: Core.Strapi): Promise<void> {
    const filePath = path.join(MOCK_DATA_PATH, 'blog-posts.json');
    if (!fs.existsSync(filePath)) return;

    const allAuthors = await strapi.documents('api::author.author' as any).findMany({ limit: 100 });
    const blogPosts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`[SEED] Processing ${blogPosts.length} blog posts...`);

    const preparedBlogPosts = await Promise.all(blogPosts.map(async (p: any) => {
        const authorName = p.author?.name;
        const relatedAuthor = allAuthors.find((a: any) => a.name === authorName);

        // Process Rich Text Images - ensure all required fields are present
        if (p.content && Array.isArray(p.content)) {
            for (const block of p.content) {
                if (block.type === 'image' && block.image && block.image.url && !block.image.id) {
                    try {
                        // Add required fields for Strapi Blocks validation
                        Object.assign(block.image, {
                            name: 'seeded-image.jpg',
                            hash: 'seeded_image_' + Date.now(),
                            ext: '.jpg',
                            mime: 'image/jpeg',
                            size: 100,
                            provider: 'local',
                            formats: {},
                            width: block.image.width || 1200,
                            height: block.image.height || 800,
                        });
                    } catch (err) {
                        console.error('[SEED] Failed to process inline image:', err);
                    }
                }
            }
        }

        return {
            ...p,
            id: undefined,
            author: relatedAuthor ? relatedAuthor.documentId : undefined,
        };
    }));

    await seedCollection(strapi, 'api::blog-post.blog-post', preparedBlogPosts);
}

/**
 * Seeds case studies with full relation resolution (clients, industries, services).
 */
async function seedCaseStudies(strapi: Core.Strapi): Promise<void> {
    const filePath = path.join(MOCK_DATA_PATH, 'cases.json');
    if (!fs.existsSync(filePath)) return;

    // Fetch all related entities
    const allClients = await strapi.documents('api::client.client' as any).findMany({ limit: 100 });
    const allIndustries = await strapi.documents('api::industry.industry' as any).findMany({ limit: 100 });
    const allServices = await strapi.documents('api::service.service' as any).findMany({ status: 'draft', limit: 100 });

    const cases = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log('[SEED] Running Case Study Upsert...');

    for (const caseData of cases) {
        const existing = await strapi.documents('api::case-study.case-study' as any).findMany({
            filters: { slug: caseData.slug }
        });

        // Resolve relations
        const relatedClient = allClients.find((cl: any) =>
            cl.name === (caseData.client?.name || caseData.client)
        );
        const relatedIndustry = allIndustries.find((ind: any) =>
            ind.title.includes(caseData.industry) || ind.slug === caseData.industry?.toLowerCase()
        );

        // Resolve service relations
        let serviceIds: string[] = [];
        if (caseData.relatedServices && Array.isArray(caseData.relatedServices)) {
            serviceIds = caseData.relatedServices
                .map((slug: string) => {
                    const svc = allServices.find((s: any) => s.slug === slug);
                    return svc ? svc.documentId : null;
                })
                .filter(Boolean);
        }

        const payload = {
            ...caseData,
            client: relatedClient ? relatedClient.documentId : undefined,
            industry: relatedIndustry ? relatedIndustry.documentId : undefined,
            services: serviceIds,
            testimonial: undefined
        };

        if (existing && existing.length > 0) {
            // Update
            const dbCase = existing[0];
            console.log(`[SEED] Updating case: ${caseData.slug}`);
            await strapi.documents('api::case-study.case-study' as any).update({
                documentId: dbCase.documentId,
                data: payload,
                status: dbCase.publishedAt ? 'published' : 'draft'
            });
        } else {
            // Create
            console.log(`[SEED] Creating missing case: ${caseData.slug}`);
            const entry = await strapi.documents('api::case-study.case-study' as any).create({
                data: payload,
                status: 'draft'
            });
            if (entry && entry.documentId) {
                await strapi.documents('api::case-study.case-study' as any).publish({
                    documentId: entry.documentId
                });
            }
        }
    }
}
