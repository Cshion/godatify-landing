
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
        { relation: 'industry', sourceField: 'title', targetField: 'industryName' }
    ]
};

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     */
    register({ strapi }: { strapi: Core.Strapi }) {
        // Subscribe to lifecycle events for automatic URL updates
        strapi.db.lifecycles.subscribe(async (event) => {
            const { model, action, params } = event;

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

            // 2. Relation Field Sync (Denormalization)
            const relationConfig = RELATION_FIELDS_MAP[model.uid as keyof typeof RELATION_FIELDS_MAP];
            if (relationConfig && ['beforeCreate', 'beforeUpdate'].includes(action)) {
                for (const config of relationConfig) {
                    // Strapi params.data[relation] might be an ID or an object depending on context.
                    // In `beforeCreate/Update`, it's usually the ID connects.
                    // However, we need to fetch the related entity to get the sourceField (name/logoUrl).
                    // This is expensive in a lifecycle loop but necessary for consistency.
                    // We only do it if the relation is being updated.

                    const relationInput = params.data[config.relation];
                    // If relationInput is null/undefined, we might want to clear the target field?
                    // Strategy: Only update if relation is present. Backfill handles the rest.

                    if (relationInput) {
                        // relationInput could be: 5, { id: 5 }, { connect: [5] }, etc.
                        // Simplify: We assume standard ID or simple object.
                        // Ideally we use strapi.documents to fetch the related item.
                        // We need to know the UID of the related item. 
                        // We can get it from the model attributes.
                        const schema = strapi.contentTypes[model.uid as any];
                        const attribute = schema.attributes[config.relation];
                        const targetUid = attribute.target;

                        if (targetUid) {
                            try {
                                // Extract ID (simplified assumption: input is ID or { id: ID })
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
            const entries = await strapi.documents(uid as any).findMany({ populate: fieldsToPopulate, status: 'draft' });
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
            const entries = await strapi.documents(uid as any).findMany({ populate: relationsToPopulate, status: 'draft' });

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

        const seedCollection = async (uid: string, data: any[]) => {
            const count = await strapi.documents(uid as any).count({});
            console.log(`[SEED] Checking ${uid}: count = ${count}, data.length = ${data.length} `);

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
                console.log(`[SEED] ${uid} seeded ${hasDraftAndPublish ? 'and published ' : ''} successfully.`);
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
                const services = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'services.json'), 'utf-8'));
                // Map fields if necessary, but no image upload
                const publishedServices = services.map((s: any) => ({
                    ...s,
                    imageUrl: s.image,
                    bgImageUrl: s.backgroundImage || s.bgImage,
                }));
                await seedCollection('api::service.service', publishedServices);

                // Social Links
                const socialLinks = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'social-links.json'), 'utf-8'));
                await seedCollection('api::social-link.social-link', socialLinks); // No images usually

                // Company Info
                const companyInfo = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'company.json'), 'utf-8'));
                await seedSingle('api::company-info.company-info', companyInfo); // Maybe logo?

                // Clients
                const clientsData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'clients.json'), 'utf-8'));
                await seedCollection('api::client.client', clientsData);
                const allClients = await strapi.documents('api::client.client' as any).findMany();

                // Authors
                const authorsData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'authors.json'), 'utf-8'));
                await seedCollection('api::author.author', authorsData);
                const allAuthors = await strapi.documents('api::author.author' as any).findMany();

                // Industries
                const industriesData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'industries.json'), 'utf-8'));
                if (industriesData.page) {
                    await seedSingle('api::industries-page.industries-page', industriesData.page);
                }
                if (industriesData.industries) {
                    await seedCollection('api::industry.industry', industriesData.industries);
                }
                const allIndustries = await strapi.documents('api::industry.industry' as any).findMany();

                // Testimonials
                const testimonialsData = JSON.parse(fs.readFileSync(path.join(MASTER_DATA_PATH, 'testimonials.json'), 'utf-8'));
                await seedCollection('api::testimonial.testimonial', testimonialsData);
                const allTestimonials = await strapi.documents('api::testimonial.testimonial' as any).findMany();

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
                    const allAuthors = await strapi.documents('api::author.author' as any).findMany();
                    const blogPosts = JSON.parse(fs.readFileSync(path.join(MOCK_DATA_PATH, 'blog-posts.json'), 'utf-8'));

                    // Pre-process for relations
                    const preparedBlogPosts = blogPosts.map((p: any) => {
                        const authorName = p.author?.name;
                        const relatedAuthor = allAuthors.find((a: any) => a.name === authorName);
                        return {
                            ...p,
                            id: undefined,
                            author: relatedAuthor ? relatedAuthor.documentId : undefined,
                        };
                    });
                    await seedCollection('api::blog-post.blog-post', preparedBlogPosts);

                    // Cases
                    const allClients = await strapi.documents('api::client.client' as any).findMany();
                    const allIndustries = await strapi.documents('api::industry.industry' as any).findMany();

                    const cases = JSON.parse(fs.readFileSync(path.join(MOCK_DATA_PATH, 'cases.json'), 'utf-8'));
                    const preparedCases = cases.map((c: any) => {
                        const relatedClient = allClients.find((cl: any) => cl.name === (c.client?.name || c.client));
                        const relatedIndustry = allIndustries.find((ind: any) => ind.title.includes(c.industry) || ind.slug === c.industry.toLowerCase());

                        return {
                            ...c,
                            client: relatedClient ? relatedClient.documentId : undefined,
                            industry: relatedIndustry ? relatedIndustry.documentId : undefined,
                            testimonial: undefined, // simplify logic for now
                        };
                    });
                    await seedCollection('api::case-study.case-study', preparedCases);
                }
            } catch (error) {
                console.error('[SEED] Error seeding Mock Data:', error);
            }
        }

        // 3. Seed Permissions (Always, to ensure Public access)
        await seedPermissions();
    },
};
