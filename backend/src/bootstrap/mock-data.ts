/**
 * Mock Data Seeding
 * 
 * Seeds sample/demo data from seed-data/mock/.
 * 
 * ============================================================================
 * DEVELOPMENT ONLY — DO NOT RUN IN PRODUCTION
 * ============================================================================
 * 
 * This data represents relationships that MUST be created manually in production:
 * - Real clients are added via Strapi admin as contracts are signed
 * - Real authors are employees added via Strapi admin
 * - Real testimonials are customer feedback added via Strapi admin
 * - Real blog posts are written by real authors
 * - Real case studies feature real clients
 * 
 * Run via: make seed-mock
 * 
 * ============================================================================
 * WHAT IS SEEDED HERE
 * ============================================================================
 * 
 * RELATIONSHIP DATA (sample/demo content):
 * - clients          → Sample client logos for carousel
 * - authors          → Sample blog authors
 * - testimonials     → Sample customer testimonials
 * 
 * CONTENT DATA (depends on above relationships):
 * - blog-posts       → Sample blog posts (requires authors)
 * - case-studies     → Sample case studies (requires clients, industries, services)
 * 
 * ============================================================================
 * SEEDING ORDER
 * ============================================================================
 * 
 * 1. Clients     → No dependencies
 * 2. Authors     → No dependencies
 * 3. Testimonials → No dependencies
 * 4. Blog Posts  → Depends on Authors
 * 5. Case Studies → Depends on Clients, Industries, Services
 * 
 * NOTE: Industries and Services come from master data (make seed).
 * Run `make seed` before `make seed-mock` if you need those relationships.
 * 
 * ============================================================================
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
        // ════════════════════════════════════════════════════════════════════
        // RELATIONSHIP DATA — Sample entities for development
        // These must be seeded BEFORE content that depends on them
        // ════════════════════════════════════════════════════════════════════
        
        // Clients — Sample client logos (needed for case studies & home page)
        const allClients = await seedClients(strapi);

        // Authors — Sample blog authors (needed for blog posts)
        await seedAuthors(strapi);

        // Testimonials — Sample customer testimonials
        await seedTestimonials(strapi);

        // ════════════════════════════════════════════════════════════════════
        // CONTENT DATA — Sample content that depends on relationships above
        // ════════════════════════════════════════════════════════════════════
        
        // Blog Posts (depend on Authors)
        await seedBlogPosts(strapi);

        // Case Studies (depend on Clients, Industries, Services)
        await seedCaseStudies(strapi);

        // Update Home Page with clients relation
        await updateHomePageClients(strapi, allClients);

        console.log('[SEED] ✓ Mock data seeding complete.');
    } catch (error: any) {
        console.error('[SEED] Error seeding Mock Data:', error);
        // Show validation details
        if (error?.details?.errors) {
            console.error('[SEED] Validation errors:');
            error.details.errors.forEach((e: any, i: number) => {
                console.error(`  Error ${i + 1}:`, JSON.stringify(e, null, 2));
            });
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONSHIP DATA SEEDERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Seeds sample client data.
 * In production, real clients are created manually via Strapi admin.
 */
async function seedClients(strapi: Core.Strapi): Promise<any[]> {
    const filePath = path.join(MOCK_DATA_PATH, 'clients.json');
    if (!fs.existsSync(filePath)) {
        console.log('[SEED] No clients.json found, skipping clients.');
        return [];
    }

    const clientsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`[SEED] Processing ${clientsData.length} clients...`);
    await seedCollection(strapi, 'api::client.client', clientsData, 'name');
    return await strapi.documents('api::client.client' as any).findMany({ limit: 100 });
}

/**
 * Seeds sample author data.
 * In production, real authors (employees) are created manually via Strapi admin.
 */
async function seedAuthors(strapi: Core.Strapi): Promise<any[]> {
    const filePath = path.join(MOCK_DATA_PATH, 'authors.json');
    if (!fs.existsSync(filePath)) {
        console.log('[SEED] No authors.json found, skipping authors.');
        return [];
    }

    const authorsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`[SEED] Processing ${authorsData.length} authors...`);
    await seedCollection(strapi, 'api::author.author', authorsData, 'name');
    return await strapi.documents('api::author.author' as any).findMany({ limit: 100 });
}

/**
 * Seeds sample testimonial data.
 * In production, real testimonials are created manually via Strapi admin.
 */
async function seedTestimonials(strapi: Core.Strapi): Promise<any[]> {
    const filePath = path.join(MOCK_DATA_PATH, 'testimonials.json');
    if (!fs.existsSync(filePath)) {
        console.log('[SEED] No testimonials.json found, skipping testimonials.');
        return [];
    }

    const testimonialsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`[SEED] Processing ${testimonialsData.length} testimonials...`);
    await seedCollection(strapi, 'api::testimonial.testimonial', testimonialsData);
    return await strapi.documents('api::testimonial.testimonial' as any).findMany({ limit: 100 });
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA SEEDERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitize rich text content blocks for Strapi Blocks validation.
 * Removes nested lists from list-item children (not supported in inline context).
 */
function sanitizeBlocksContent(content: any[]): any[] {
    if (!Array.isArray(content)) return content;
    
    return content.map(block => {
        if (block.type === 'list' && Array.isArray(block.children)) {
            // For each list-item, keep only text and link nodes as children
            block.children = block.children.map((listItem: any) => {
                if (listItem.type === 'list-item' && Array.isArray(listItem.children)) {
                    // Filter out any non-inline children (like nested lists)
                    listItem.children = listItem.children.filter((child: any) => 
                        child.type === 'text' || child.type === 'link'
                    );
                }
                return listItem;
            });
        }
        return block;
    });
}

/**
 * Seeds blog posts with author relations and rich text image processing.
 */
async function seedBlogPosts(strapi: Core.Strapi): Promise<void> {
    const filePath = path.join(MOCK_DATA_PATH, 'blog-posts.json');
    if (!fs.existsSync(filePath)) {
        console.log('[SEED] No blog-posts.json found, skipping blog posts.');
        return;
    }

    const allAuthors = await strapi.documents('api::author.author' as any).findMany({ limit: 100 });
    const blogPosts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`[SEED] Processing ${blogPosts.length} blog posts...`);

    const preparedBlogPosts = await Promise.all(blogPosts.map(async (p: any) => {
        const authorName = p.author?.name;
        const relatedAuthor = allAuthors.find((a: any) => a.name === authorName);

        // Process Rich Text Images - ensure all required fields are present
        if (p.content && Array.isArray(p.content)) {
            for (let i = 0; i < p.content.length; i++) {
                const block = p.content[i];
                if (block.type === 'image' && block.image) {
                    const now = new Date().toISOString();
                    // Add required fields for Strapi Blocks validation
                    Object.assign(block.image, {
                        name: block.image.name || 'seeded-image.jpg',
                        hash: block.image.hash || 'seeded_image_' + Date.now() + '_' + i,
                        ext: block.image.ext || '.jpg',
                        mime: block.image.mime || 'image/jpeg',
                        size: block.image.size || 100,
                        provider: block.image.provider || 'local',
                        formats: block.image.formats || {},
                        width: block.image.width || 1200,
                        height: block.image.height || 800,
                        createdAt: block.image.createdAt || now,
                        updatedAt: block.image.updatedAt || now,
                    });
                    // Image blocks also need children array (empty)
                    if (!block.children) {
                        block.children = [];
                    }
                }
            }
        }

        // Map 'image' to 'coverImageUrl' (schema uses coverImageUrl)
        const { image, ...restProps } = p;
        
        // Sanitize content blocks (fix nested lists, etc.)
        const sanitizedContent = p.content ? sanitizeBlocksContent(p.content) : p.content;
        
        return {
            ...restProps,
            id: undefined,
            content: sanitizedContent,
            coverImageUrl: image || p.coverImageUrl,
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
    if (!fs.existsSync(filePath)) {
        console.log('[SEED] No cases.json found, skipping case studies.');
        return;
    }

    // Fetch all related entities
    const allClients = await strapi.documents('api::client.client' as any).findMany({ limit: 100 });
    const allIndustries = await strapi.documents('api::industry.industry' as any).findMany({ limit: 100 });
    const allServices = await strapi.documents('api::service.service' as any).findMany({ status: 'draft', limit: 100 });

    const cases = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`[SEED] Processing ${cases.length} case studies...`);

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
            console.log(`[SEED] Creating case: ${caseData.slug}`);
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

/**
 * Updates the Home Page to include the clients relation.
 * This is done after seeding clients so they can be linked.
 */
async function updateHomePageClients(strapi: Core.Strapi, allClients: any[]): Promise<void> {
    if (allClients.length === 0) return;

    try {
        // Find the existing home page
        const homePage = await strapi.documents('api::home-page.home-page' as any).findFirst({});
        
        if (homePage) {
            console.log('[SEED] Updating home page with clients relation...');
            await strapi.documents('api::home-page.home-page' as any).update({
                documentId: homePage.documentId,
                data: {
                    clients: allClients.map((c: any) => c.documentId)
                } as any,
                status: homePage.publishedAt ? 'published' : 'draft'
            });
        }
    } catch (error) {
        console.error('[SEED] Failed to update home page clients:', error);
    }
}
