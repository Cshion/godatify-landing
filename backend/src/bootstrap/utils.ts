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

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const item of data) {
        try {
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
            } else if (item['author']) {
                filters['author'] = item['author'];
            } else if (item['quote']) {
                filters['quote'] = item['quote'];
            } else {
                // Fallback: Skip if no discernible unique field
                skipCount++;
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
                successCount++;
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
                successCount++;
            }
        } catch (err: any) {
            errorCount++;
            const identifier = item.slug || item.name || item.title || item.id || 'unknown';
            console.error(`[SEED] Error seeding ${uid} - ${identifier}:`, err?.message || err);
        }
    }
    
    if (errorCount > 0) {
        console.log(`[SEED] ${uid} sync complete. Success: ${successCount}, Errors: ${errorCount}, Skipped: ${skipCount}`);
    } else {
        console.log(`[SEED] ${uid} sync complete.`);
    }
}

/**
 * Seeds a single type.
 * 
 * DEVELOPMENT: Upsert — always updates from JSON (idempotent, start clean)
 * PRODUCTION: Skip if exists — never overwrites client edits
 */
export async function seedSingle(
    strapi: Core.Strapi,
    uid: string,
    data: any
): Promise<void> {
    console.log(`[SEED] Checking single type ${uid}...`);
    
    const isDev = process.env.NODE_ENV === 'development';
    const contentType = strapi.contentTypes[uid as any];
    const hasDraftAndPublish = contentType.options?.draftAndPublish;
    
    // Check for existing entry
    const existing = await strapi.documents(uid as any).findFirst({ status: 'published' });
    const existingDraft = await strapi.documents(uid as any).findFirst({ status: 'draft' });
    
    if (existing) {
        if (isDev) {
            // DEV: Update existing with seed data (upsert)
            console.log(`[SEED] Updating ${uid} with seed data (dev mode)...`);
            await strapi.documents(uid as any).update({
                documentId: existing.documentId,
                data,
                status: 'published'
            });
            console.log(`[SEED] ${uid} updated successfully.`);
        } else {
            // PROD: Never overwrite
            console.log(`[SEED] ${uid} already published, skipping (prod mode).`);
        }
        return;
    }
    
    if (existingDraft && existingDraft.documentId) {
        if (isDev) {
            // DEV: Update draft and publish
            console.log(`[SEED] Updating and publishing draft ${uid} (dev mode)...`);
            await strapi.documents(uid as any).update({
                documentId: existingDraft.documentId,
                data,
                status: 'draft'
            });
            await strapi.documents(uid as any).publish({ documentId: existingDraft.documentId });
            console.log(`[SEED] ${uid} updated and published.`);
        } else {
            // PROD: Just publish existing draft
            console.log(`[SEED] Publishing existing draft for ${uid}...`);
            await strapi.documents(uid as any).publish({ documentId: existingDraft.documentId });
            console.log(`[SEED] ${uid} published successfully.`);
        }
        return;
    }
    
    // No entry exists — create new
    if (data) {
        console.log(`[SEED] Seeding ${uid} (Single Type)...`);

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
