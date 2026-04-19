/**
 * Bootstrap Utilities
 * 
 * Shared helper functions for seeding data.
 */
import type { Core } from '@strapi/strapi';

/**
 * Seeds a collection type with upsert strategy.
 * Creates new entries or updates existing ones based on unique field matching.
 */
export async function seedCollection(
    strapi: Core.Strapi,
    uid: string,
    data: any[],
    uniqueField: string = 'id'
): Promise<void> {
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
            // Update existing entry
            await strapi.documents(uid as any).update({
                documentId: existing[0].documentId,
                data: item,
                status: hasDraftAndPublish ? 'published' : undefined
            });
        } else {
            // Create new entry
            console.log(`[SEED] Creating ${uid} - ${filters[Object.keys(filters)[0]]}`);
            
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
}

/**
 * Seeds a single type (only if it doesn't exist).
 */
export async function seedSingle(
    strapi: Core.Strapi,
    uid: string,
    data: any
): Promise<void> {
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
}
