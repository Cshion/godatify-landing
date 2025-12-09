
import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

const MEDIA_FIELDS_MAP = {
    'api::case-study.case-study': [{ media: 'mainImage', url: 'mainImageUrl' }],
    'api::industry.industry': [{ media: 'image', url: 'imageUrl' }],
    'api::testimonial.testimonial': [{ media: 'authorImage', url: 'authorImageUrl' }],
    'api::client.client': [{ media: 'logo', url: 'logoUrl' }],
    'api::service.service': [{ media: 'bgImage', url: 'bgImageUrl' }],
    'api::company-info.company-info': [{ media: 'logo', url: 'logoUrl' }],
};

const RELATION_FIELDS_MAP = {
    'api::case-study.case-study': [
        { relation: 'client', sourceField: 'logoUrl', targetField: 'clientLogoUrl' },
        { relation: 'client', sourceField: 'name', targetField: 'clientName' },
        { relation: 'client', sourceField: 'website', targetField: 'clientWebsite' },
        { relation: 'industry', sourceField: 'title', targetField: 'industryName' },
        { relation: 'testimonial', sourceField: 'quote', targetField: 'testimonialQuote' },
        { relation: 'testimonial', sourceField: 'author', targetField: 'testimonialAuthor' },
        { relation: 'testimonial', sourceField: 'role', targetField: 'testimonialRole' },
        { relation: 'testimonial', sourceField: 'authorImageUrl', targetField: 'testimonialAuthorImageUrl' },
        { relation: 'testimonial', sourceField: 'linkedIn', targetField: 'testimonialLinkedIn' }
    ]
};

const REVERSE_SYNC_MAP = {
    'api::client.client': {
        targetModel: 'api::case-study.case-study',
        relationField: 'client',
        fields: [
            { source: 'name', target: 'clientName' },
            { source: 'logoUrl', target: 'clientLogoUrl' },
            { source: 'website', target: 'clientWebsite' }
        ]
    },
    'api::industry.industry': {
        targetModel: 'api::case-study.case-study',
        relationField: 'industry',
        fields: [
            { source: 'title', target: 'industryName' }
        ]
    },
    'api::testimonial.testimonial': {
        targetModel: 'api::case-study.case-study',
        relationField: 'testimonial',
        fields: [
            { source: 'quote', target: 'testimonialQuote' },
            { source: 'author', target: 'testimonialAuthor' },
            { source: 'role', target: 'testimonialRole' },
            { source: 'authorImageUrl', target: 'testimonialAuthorImageUrl' },
            { source: 'linkedIn', target: 'testimonialLinkedIn' }
        ]
    }
};

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     */
    register({ strapi }: { strapi: Core.Strapi }) {
        // Subscribe to lifecycle events for automatic URL updates
        strapi.db.lifecycles.subscribe(async (event) => {
            const { model, action, params, result } = event;

            // 1. Media URL Sync
            const mediaConfig = MEDIA_FIELDS_MAP[model.uid as keyof typeof MEDIA_FIELDS_MAP];
            if (mediaConfig && ['beforeCreate', 'beforeUpdate'].includes(action)) {
                for (const field of mediaConfig) {
                    const mediaId = params.data[field.media];
                    if (mediaId) {
                        try {
                            const file = await strapi.db.query('plugin::upload.file').findOne({ where: { id: mediaId } });
                            if (file && file.url) {
                                params.data[field.url] = file.url;
                            }
                        } catch (error) {
                            console.error(`[LIFECYCLE] Error syncing Media URL for ${model.uid}:`, error);
                        }
                    }
                }
            }

            // 2. Relation Field Sync (Denormalization - Forward)
            const relationConfig = RELATION_FIELDS_MAP[model.uid as keyof typeof RELATION_FIELDS_MAP];
            if (relationConfig && ['beforeCreate', 'beforeUpdate'].includes(action)) {
                for (const config of relationConfig) {
                    const relationInput = params.data[config.relation];
                    if (relationInput) {
                        const schema = strapi.contentTypes[model.uid as any];
                        const attribute = schema.attributes[config.relation];
                        const targetUid = attribute.target;

                        if (targetUid) {
                            try {
                                let idToFetch = typeof relationInput === 'object' ? (relationInput.id || relationInput.connect?.[0]?.id || relationInput.connect?.[0]) : relationInput;
                                if (idToFetch) {
                                    const relatedEntity = await strapi.documents(targetUid).findOne({ documentId: idToFetch } as any);
                                    if (relatedEntity && relatedEntity[config.sourceField]) {
                                        params.data[config.targetField] = relatedEntity[config.sourceField];
                                    }
                                }
                            } catch (error) {
                                // console.error(`[LIFECYCLE] Error syncing Relation for ${model.uid}:`, error);
                            }
                        }
                    }
                }
            }

            // 3. Reverse Sync (Propagate updates to related entities)
            // Triggered AFTER update of the source entity (Client, Industry, Testimonial)
            const reverseConfig = REVERSE_SYNC_MAP[model.uid as keyof typeof REVERSE_SYNC_MAP];
            if (reverseConfig && action === 'afterUpdate' && result) {
                try {
                    // Find all items in the target model that link to this entity
                    // e.g. Find all CaseStudies where client.documentId == result.documentId
                    const targetUid = reverseConfig.targetModel as any;

                    // We need to use findMany with filters on the relation
                    const affectedEntries = await strapi.documents(targetUid).findMany({
                        filters: {
                            [reverseConfig.relationField]: {
                                documentId: result.documentId
                            }
                        }
                    });

                    if (affectedEntries.length > 0) {
                        const updateData: any = {};
                        // Construct the update payload based on the new data in `result`
                        for (const fieldMap of reverseConfig.fields) {
                            if (result[fieldMap.source] !== undefined) {
                                updateData[fieldMap.target] = result[fieldMap.source];
                            }
                        }

                        console.log(`[REV-SYNC] Updating ${affectedEntries.length} ${targetUid} entries linked to ${model.uid} ${result.documentId}`);

                        // Update each affected entry separately to trigger its own lifecycles if needed
                        for (const entry of affectedEntries) {
                            await strapi.documents(targetUid).update({
                                documentId: entry.documentId,
                                data: updateData,
                                status: entry.publishedAt ? 'published' : 'draft'
                            });
                        }
                    }
                } catch (error) {
                    console.error(`[LIFECYCLE] Error in Reverse Sync for ${model.uid}:`, error);
                }
            }
        });
    },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     */
    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        console.log('[BOOTSTRAP] Starting bootstrap...');
        const isDev = process.env.NODE_ENV === 'development';
        console.log(`[BOOTSTRAP] Environment: ${process.env.NODE_ENV}, isDev: ${isDev} `);

        // --- BACKFILL SYNC (Media) ---
        console.log('[BOOTSTRAP] Running Media URL Sync...');
        for (const [uid, config] of Object.entries(MEDIA_FIELDS_MAP)) {
            const fieldsToPopulate = config.map(c => c.media);
            const entries = await strapi.documents(uid as any).findMany({ populate: fieldsToPopulate, status: 'draft', limit: 100 });
            let updatedCount = 0;
            for (const entry of entries) {
                let needsUpdate = false;
                const updateData: any = {};
                for (const field of config) {
                    const media = entry[field.media];
                    const currentUrl = entry[field.url];
                    if (media && media.url && currentUrl !== media.url) {
                        updateData[field.url] = media.url;
                        needsUpdate = true;
                    }
                }
                if (needsUpdate) {
                    await strapi.documents(uid as any).update({ documentId: entry.documentId, data: updateData, status: entry.publishedAt ? 'published' : 'draft' });
                    updatedCount++;
                }
            }
            if (updatedCount > 0) console.log(`[SYNC] Updated ${updatedCount} Media fields for ${uid}`);
        }

        // --- BACKFILL SYNC (Relations) ---
        console.log('[BOOTSTRAP] Running Relation Field Sync (Denormalization)...');
        for (const [uid, config] of Object.entries(RELATION_FIELDS_MAP)) {
            // Populate the relation to read the source field
            const relationsToPopulate = [...new Set(config.map(c => c.relation))];
            const entries = await strapi.documents(uid as any).findMany({ populate: relationsToPopulate, status: 'draft', limit: 100 });

            let updatedCount = 0;
            for (const entry of entries) {
                let needsUpdate = false;
                const updateData: any = {};

                for (const fieldConfig of config) {
                    const relatedEntity = entry[fieldConfig.relation];
                    const currentVal = entry[fieldConfig.targetField];

                    // Optimization: Only update if related entity exists AND value is different/missing
                    if (relatedEntity) {
                        const sourceVal = relatedEntity[fieldConfig.sourceField];
                        if (sourceVal && sourceVal !== currentVal) {
                            updateData[fieldConfig.targetField] = sourceVal;
                            needsUpdate = true;
                        }
                    }
                }

                if (needsUpdate) {
                    await strapi.documents(uid as any).update({ documentId: entry.documentId, data: updateData, status: entry.publishedAt ? 'published' : 'draft' });
                    updatedCount++;
                }
            }
            if (updatedCount > 0) console.log(`[SYNC] Updated ${updatedCount} Relation fields for ${uid}`);
        }
        console.log('[BOOTSTRAP] Sync complete.');


        // Seed paths
        const MOCK_DATA_PATH = path.join(process.cwd(), 'seed-data', 'mock');
        const MASTER_DATA_PATH = path.join(process.cwd(), 'seed-data', 'master');
        console.log(`[BOOTSTRAP] Master Data Path: ${MASTER_DATA_PATH} `);
        console.log(`[BOOTSTRAP] Mock Data Path: ${MOCK_DATA_PATH} `);

        const seedCollection = async (uid: string, data: any[], uniqueField: string = 'id') => {
            console.log(`[SEED] Seeding ${uid} with upsert strategy (uniqueField: ${uniqueField})...`);

            for (const item of data) {
                // Find existing entry
                const filters: any = {};
                // Handle different unique fields or default to check if property exists
                if (item[uniqueField]) {
                    filters[uniqueField] = item[uniqueField];
                } else if (item['slug']) {
                    filters['slug'] = item['slug'];
                } else if (item['name']) {
                    filters['name'] = item['name'];
                } else if (item['title']) {
                    filters['title'] = item['title'];
                } else {
                    // Fallback: Skip if no discernible unique field
                    continue;
                }

                const existing = await strapi.documents(uid as any).findMany({ filters });

                const contentType = strapi.contentTypes[uid as any];
                const hasDraftAndPublish = contentType.options?.draftAndPublish;

                if (existing && existing.length > 0) {
                    // Update
                    // We typically assume the JSON is source of truth.
                    // Ideally we should deep compare, but for now we just force update to ensure new fields (like features) are synced.
                    // console.log(`[SEED] Updating ${uid} - ${filters[Object.keys(filters)[0]]}`);
                    await strapi.documents(uid as any).update({
                        documentId: existing[0].documentId,
                        data: item,
                        status: hasDraftAndPublish ? 'published' : undefined
                    });
                } else {
                    // Create
                    console.log(`[SEED] Creating ${uid} - ${filters[Object.keys(filters)[0]]}`);
                    const contentType = strapi.contentTypes[uid as any];
                    const hasDraftAndPublish = contentType.options?.draftAndPublish;

                    const entry = await strapi.documents(uid as any).create({
                        data: item,
                        status: 'draft',
                    });
                    if (hasDraftAndPublish && entry && entry.documentId) {
                        await strapi.documents(uid as any).publish({ documentId: entry.documentId });
                    }
                }
            }
            console.log(`[SEED] ${uid} sync complete.`);
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
                console.log(`[SEED] ${uid} seeded successfully.`);
            }
        };

        const seedPermissions = async () => {
            try {
                // Use Document Service to find the role
                const publicRole = await strapi.documents('plugin::users-permissions.role').findFirst({
                    filters: { type: 'public' },
                    populate: ['permissions']
                }) as any;

                if (publicRole) {
                    console.log('[SEED] Configuring Public Role permissions...');
                    const roleService = strapi.plugin('users-permissions').service('role');

                    const permissions = {
                        ...publicRole.permissions,
                        'api::company-info': { controllers: { 'company-info': { find: { enabled: true } } } },
                        'api::service': { controllers: { service: { find: { enabled: true }, findOne: { enabled: true } } } },
                        'api::case-study': { controllers: { 'case-study': { find: { enabled: true }, findOne: { enabled: true } } } },
                        'api::industry': { controllers: { industry: { find: { enabled: true }, findOne: { enabled: true } } } },
                        'api::testimonial': { controllers: { testimonial: { find: { enabled: true } } } },
                        'api::client': { controllers: { client: { find: { enabled: true } } } },
                        'api::social-link': { controllers: { 'social-link': { find: { enabled: true } } } },
                        'api::blog-post': { controllers: { 'blog-post': { find: { enabled: true }, findOne: { enabled: true } } } },
                        'api::author': { controllers: { author: { find: { enabled: true }, findOne: { enabled: true } } } },
                        'api::home-page': { controllers: { 'home-page': { find: { enabled: true } } } },
                        'api::about-page': { controllers: { 'about-page': { find: { enabled: true } } } },
                        'api::contact-page': { controllers: { 'contact-page': { find: { enabled: true } } } },
                        'api::industries-page': { controllers: { 'industries-page': { find: { enabled: true } } } },
                        'api::sector': { controllers: { sector: { find: { enabled: true }, findOne: { enabled: true } } } },
                    };

                    await roleService.updateRole(publicRole.id, { permissions });
                    console.log('[SEED] Public Role permissions configured successfully.');
                }
            } catch (error) {
                console.error('[SEED] Error configuring permissions:', error);
            }
        };

        // 1. Seed Master Data (Always)
        try {
            if (fs.existsSync(MASTER_DATA_PATH)) {
                // Services
                // Services
                const services = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'services.json'), 'utf-8'));
                // Map fields if necessary, but no image upload
                const publishedServices = services.map((s: any) => ({
                    ...s,
                    imageUrl: s.image || s.imageUrl,
                    bgImageUrl: s.backgroundImage || s.bgImage || s.bgImageUrl,
                }));
                await seedCollection('api::service.service', publishedServices, 'slug');

                // Social Links
                const socialLinks = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'social-links.json'), 'utf-8'));
                // Social Links usually rely on 'platform' or 'url' as unique, but 'id' is default. They might not have slugs.
                // Assuming they are simple, we can leave default or check schema. Social Link has 'platform'.
                await seedCollection('api::social-link.social-link', socialLinks, 'platform');

                // Company Info
                const companyInfo = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'company.json'), 'utf-8'));
                await seedSingle('api::company-info.company-info', companyInfo); // Maybe logo?

                // Clients
                const clientsData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'clients.json'), 'utf-8'));
                await seedCollection('api::client.client', clientsData, 'name');
                const allClients = await strapi.documents('api::client.client' as any).findMany({ limit: 100 });

                // Authors
                const authorsData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'authors.json'), 'utf-8'));
                await seedCollection('api::author.author', authorsData, 'name');
                const allAuthors = await strapi.documents('api::author.author' as any).findMany({ limit: 100 });

                // Sectors
                const sectorsData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'sectors.json'), 'utf-8'));
                await seedCollection('api::sector.sector', sectorsData, 'slug');
                const allSectors = await strapi.documents('api::sector.sector' as any).findMany({ limit: 100 });

                // Industries
                const industriesData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'industries.json'), 'utf-8'));
                if (industriesData.page) {
                    await seedSingle('api::industries-page.industries-page', industriesData.page);
                }
                if (industriesData.industries) {
                    // Enrich industries with sector ID
                    const enrichedIndustries = industriesData.industries.map((ind: any) => {
                        if (ind.sector) {
                            const sector = allSectors.find((s: any) => s.slug === ind.sector);
                            return {
                                ...ind,
                                sector: sector ? sector.documentId : undefined
                            };
                        }
                        return ind;
                    });
                    await seedCollection('api::industry.industry', enrichedIndustries, 'slug');
                }
                const allIndustries = await strapi.documents('api::industry.industry' as any).findMany({ limit: 100 });

                // Testimonials
                const testimonialsData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'testimonials.json'), 'utf-8'));
                await seedCollection('api::testimonial.testimonial', testimonialsData);
                const allTestimonials = await strapi.documents('api::testimonial.testimonial' as any).findMany({ limit: 100 });

                // Home Page
                const homeData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'home.json'), 'utf-8'));
                homeData.clients = allClients.map((c: any) => c.documentId);
                await seedSingle('api::home-page.home-page', homeData); // Check for hero images

                // About Page
                const aboutData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'about.json'), 'utf-8'));
                await seedSingle('api::about-page.about-page', aboutData);

                // Contact Page
                const contactData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'contact.json'), 'utf-8'));
                await seedSingle('api::contact-page.contact-page', contactData);

            }
        } catch (error) {
            console.error('[SEED] Error seeding Master Data:', error);
        }

        // 2. Seed Mock Data (Only in Dev)
        if (isDev) {
            try {
                if (fs.existsSync(MOCK_DATA_PATH)) {
                    // Blog Posts
                    const allAuthors = await strapi.documents('api::author.author' as any).findMany({ limit: 100 });
                    const blogPosts = JSON.parse(fs.readFileSync(path.join(MOCK_DATA_PATH, 'blog-posts.json'), 'utf-8'));

                    // Pre-process for relations and Rich Text images
                    console.log(`[SEED] Processing ${blogPosts.length} blog posts...`);
                    const preparedBlogPosts = await Promise.all(blogPosts.map(async (p: any) => {
                        const authorName = p.author?.name;
                        const relatedAuthor = allAuthors.find((a: any) => a.name === authorName);

                        // Process Rich Text Images
                        if (p.content && Array.isArray(p.content)) {
                            for (const block of p.content) {
                                if (block.type === 'image' && block.image && block.image.url && !block.image.id) {
                                    try {
                                        console.log(`[SEED] Uploading inline image: ${block.image.url}`);
                                        // Simple file upload simulation or existing file lookup
                                        // For now, we will try to find if this file was already uploaded via Media Library (by name)
                                        // or upload it.

                                        // NOTE: Uploading files via seed script is complex because it requires handling streams/buffers.
                                        // To satisfy the user immediately without potentially breaking the build with new dependencies 
                                        // (like axios/mime-types), we will default to a PLACEHOLDER image if one exists, 
                                        // or mock the fields required by Yup if it doesn't validate 'provider'.

                                        // Strapi Blocks validation typically requires:
                                        // name, alternativeText, url, caption, width, height, formats, hash, ext, mime, size, provider

                                        Object.assign(block.image, {
                                            name: 'seeded-image.jpg',
                                            hash: 'seeded_image_' + Date.now(),
                                            ext: '.jpg',
                                            mime: 'image/jpeg',
                                            size: 100,
                                            provider: 'local',
                                            formats: {}, // Must be an object, not null
                                            width: block.image.width || 1200, // Ensure valid number
                                            height: block.image.height || 800, // Ensure valid number
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
                    await seedCollection('api::blog-post.blog-post', preparedBlogPosts);

                    // Cases
                    const allClients = await strapi.documents('api::client.client' as any).findMany({ limit: 100 });
                    const allIndustries = await strapi.documents('api::industry.industry' as any).findMany({ limit: 100 });

                    // REPAIR & SEED: Upsert all cases (ensure all exist and are up to date)
                    console.log('[BOOTSTRAP] Running Case Study Upsert...');
                    const cases = JSON.parse(fs.readFileSync(path.join(MOCK_DATA_PATH, 'cases.json'), 'utf-8'));

                    for (const caseData of cases) {
                        const existing = await strapi.documents('api::case-study.case-study' as any).findMany({
                            filters: { slug: caseData.slug }
                        });

                        // Prepare relation IDs
                        const relatedClient = allClients.find((cl: any) => cl.name === (caseData.client?.name || caseData.client));
                        const relatedIndustry = allIndustries.find((ind: any) => ind.title.includes(caseData.industry) || ind.slug === caseData.industry.toLowerCase());

                        // Resolve relatedServices (slugs) to service IDs
                        let serviceIds: string[] = [];
                        if (caseData.relatedServices && Array.isArray(caseData.relatedServices)) {
                            // Fetch drafts to ensure we find the seeded services
                            const allServices = await strapi.documents('api::service.service' as any).findMany({ status: 'draft', limit: 100 });
                            serviceIds = caseData.relatedServices.map((slug: string) => {
                                const svc = allServices.find((s: any) => s.slug === slug);
                                return svc ? svc.documentId : null;
                            }).filter(Boolean);
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
                            // Update
                            const dbCase = existing[0];
                            console.log(`[BOOTSTRAP] Updating case: ${caseData.slug}`);
                            await strapi.documents('api::case-study.case-study' as any).update({
                                documentId: dbCase.documentId,
                                data: payload, // Use the full payload to update services and other fields
                                status: dbCase.publishedAt ? 'published' : 'draft'
                            });
                        } else {
                            // Create
                            console.log(`[BOOTSTRAP] Creating missing case: ${caseData.slug}`);
                            const entry = await strapi.documents('api::case-study.case-study' as any).create({
                                data: payload,
                                status: 'draft'
                            });
                            if (entry && entry.documentId) {
                                await strapi.documents('api::case-study.case-study' as any).publish({ documentId: entry.documentId });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('[SEED] Error seeding Mock Data:', error);
            }
        }

        // 3. Seed Permissions (Always, to ensure Public access)
        await seedPermissions();

        // 4. Optimization: Ensure Critical Indexes
        try {
            const knex = strapi.db.connection;

            // Index for Case Study Sorting (published_at)
            const hasCasePublishedAtIndex = await knex.schema.hasColumn('case_studies', 'published_at');
            if (hasCasePublishedAtIndex) {
                // Check if index exists is dialect specific, so we just try/catch create
                try {
                    await knex.schema.alterTable('case_studies', table => {
                        table.index(['published_at'], 'case_studies_published_at_idx');
                    });
                    console.log('[OPTIMIZATION] Added index: case_studies_published_at_idx');
                } catch (e: any) {
                    // Ignore if index already exists
                }
            }

            // Index for Service Lookup (slug)
            const hasServiceSlugIndex = await knex.schema.hasColumn('services', 'slug');
            if (hasServiceSlugIndex) {
                try {
                    await knex.schema.alterTable('services', table => {
                        table.index(['slug'], 'services_slug_idx');
                    });
                    console.log('[OPTIMIZATION] Added index: services_slug_idx');
                } catch (e: any) {
                    // Ignore if exists
                }
            }

        } catch (error) {
            console.error('[OPTIMIZATION] Failed to apply indexes:', error);
        }

        // 5. EMERGENCY REPAIR: Fix corrupted image blocks (formats: null or NaN dims)
        try {
            console.log('[REPAIR] Checking for corrupted image blocks...');
            const posts = await strapi.documents('api::blog-post.blog-post').findMany({ status: 'draft' });
            const published = await strapi.documents('api::blog-post.blog-post').findMany({ status: 'published' });
            const allDocs = [...posts, ...published];
            const uniqueDocs = Array.from(new Map(allDocs.map(p => [(p as any).documentId, p])).values());

            for (const post of uniqueDocs) {
                if (!post.content || !Array.isArray(post.content)) continue;
                let updated = false;
                const newContent = post.content.map((block: any, idx) => {
                    if (block.type === 'image' || block.image) {
                        let fixedImage = block.image || {};
                        let changed = false;

                        if (!fixedImage.formats || typeof fixedImage.formats !== 'object') {
                            console.log(`[REPAIR] Fixing formats in ${post.slug} (Block ${idx})`);
                            fixedImage.formats = {};
                            changed = true;
                        }
                        if (isNaN(Number(fixedImage.width))) {
                            console.log(`[REPAIR] Fixing width in ${post.slug} (Block ${idx})`);
                            fixedImage.width = 1200;
                            changed = true;
                        }
                        if (isNaN(Number(fixedImage.height))) {
                            console.log(`[REPAIR] Fixing height in ${post.slug} (Block ${idx})`);
                            fixedImage.height = 800;
                            changed = true;
                        }
                        if (!fixedImage.provider) { fixedImage.provider = 'local'; changed = true; }
                        if (!fixedImage.hash) { fixedImage.hash = 'fixed_' + Date.now(); changed = true; }
                        if (!fixedImage.mime) { fixedImage.mime = 'image/jpeg'; changed = true; }
                        if (!fixedImage.name) { fixedImage.name = 'fixed.jpg'; changed = true; }

                        if (changed) {
                            updated = true;
                            return { ...block, image: fixedImage };
                        }
                    }
                    return block;
                });

                if (updated) {
                    console.log(`[REPAIR] Saving fixes for ${post.slug}`);
                    await strapi.documents('api::blog-post.blog-post').update({
                        documentId: (post as any).documentId,
                        data: { content: newContent },
                        status: post.publishedAt ? 'published' : 'draft'
                    });
                }
            }
            console.log('[REPAIR] Checks complete.');
        } catch (e) {
            console.error('[REPAIR] Error during fix:', e);
        }
    },
};
