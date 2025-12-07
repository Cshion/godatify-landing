
import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     */
    register({ strapi }: { strapi: Core.Strapi }) { },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     */
    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        console.log('[BOOTSTRAP] Starting bootstrap...');
        const isDev = process.env.NODE_ENV === 'development';
        console.log(`[BOOTSTRAP] Environment: ${process.env.NODE_ENV}, isDev: ${isDev}`);

        // Seed paths
        const MOCK_DATA_PATH = path.join(process.cwd(), 'seed-data', 'mock');
        const MASTER_DATA_PATH = path.join(process.cwd(), 'seed-data', 'master');
        console.log(`[BOOTSTRAP] Master Data Path: ${MASTER_DATA_PATH}`);
        console.log(`[BOOTSTRAP] Mock Data Path: ${MOCK_DATA_PATH}`);
        console.log(`[BOOTSTRAP] Master Exists: ${fs.existsSync(MASTER_DATA_PATH)}`);
        console.log(`[BOOTSTRAP] Mock Exists: ${fs.existsSync(MOCK_DATA_PATH)}`);

        const seedCollection = async (uid: string, data: any[]) => {
            const count = await strapi.documents(uid as any).count({});
            console.log(`[SEED] Checking ${uid}: count = ${count}, data.length = ${data.length}`);
            if (count > 0) {
                const first = await strapi.documents(uid as any).findFirst({});
                console.log(`[SEED] Existing item sample for ${uid}:`, JSON.stringify(first, null, 2));
            }
            if (count === 0 && data.length > 0) {
                console.log(`[SEED] Seeding ${uid}...`);
                const contentType = strapi.contentTypes[uid as any];
                const hasDraftAndPublish = contentType.options?.draftAndPublish;

                for (const item of data) {
                    const entry = await strapi.documents(uid as any).create({
                        data: item,
                        status: 'draft',
                    });
                    if (hasDraftAndPublish && entry && entry.documentId) {
                        await strapi.documents(uid as any).publish({ documentId: entry.documentId });
                    }
                }
                console.log(`[SEED] ${uid} seeded ${hasDraftAndPublish ? 'and published ' : ''}successfully.`);
            }
        };

        const seedSingle = async (uid: string, data: any) => {
            const existing = await strapi.documents(uid as any).findMany();
            if ((!existing || existing.length === 0) && data) {
                console.log(`[SEED] Seeding ${uid} (Single Type)...`);
                const contentType = strapi.contentTypes[uid as any];
                const hasDraftAndPublish = contentType.options?.draftAndPublish;

                const entry = await strapi.documents(uid as any).create({
                    data,
                    status: 'draft',
                });
                if (hasDraftAndPublish && entry && entry.documentId) {
                    await strapi.documents(uid as any).publish({ documentId: entry.documentId });
                }
                console.log(`[SEED] ${uid} seeded ${hasDraftAndPublish ? 'and published ' : ''}successfully.`);
            }
        };

        // 1. Seed Master Data (Always)
        try {
            if (fs.existsSync(MASTER_DATA_PATH)) {
                // Services
                const services = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'services.json'), 'utf-8'));
                const publishedServices = services.map((s: any) => ({
                    ...s,
                    imageUrl: s.image,
                    bgImageUrl: s.backgroundImage || s.bgImage,
                }));
                await seedCollection('api::service.service', publishedServices);

                // Social Links
                const socialLinks = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'social-links.json'), 'utf-8'));
                await seedCollection('api::social-link.social-link', socialLinks);

                // Company Info
                const companyInfo = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'company.json'), 'utf-8'));
                await seedSingle('api::company-info.company-info', companyInfo);
            }
        } catch (error) {
            console.error('[SEED] Error seeding Master Data:', error);
        }

        // 2. Seed Mock Data (Only in Dev)
        if (isDev) {
            try {
                if (fs.existsSync(MOCK_DATA_PATH)) {
                    // Blog Posts
                    const blogPosts = JSON.parse(fs.readFileSync(path.join(MOCK_DATA_PATH, 'blog-posts.json'), 'utf-8'));
                    const publishedBlogPosts = blogPosts.map((p: any) => ({
                        ...p,
                        id: undefined,
                        authorName: p.author?.name,
                        authorRole: p.author?.role,
                        coverImageUrl: p.image
                    }));
                    await seedCollection('api::blog-post.blog-post', publishedBlogPosts);

                    // Cases
                    const cases = JSON.parse(fs.readFileSync(path.join(MOCK_DATA_PATH, 'cases.json'), 'utf-8'));
                    const publishedCases = cases.map((c: any) => ({
                        ...c,
                        clientName: c.client?.name || c.client,
                        mainImageUrl: c.image
                    }));
                    await seedCollection('api::case-study.case-study', publishedCases);
                }
            } catch (error) {
                console.error('[SEED] Error seeding Mock Data:', error);
            }
        }
    },
};
