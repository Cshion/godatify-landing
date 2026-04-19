/**
 * Backfill Sync Operations
 * 
 * Runs on every bootstrap to ensure data consistency:
 * - Media URL sync: Updates denormalized URL fields from media relations
 * - Relation field sync: Updates denormalized fields from related entities
 * 
 * RUNS IN ALL ENVIRONMENTS.
 */
import type { Core } from '@strapi/strapi';
import { MEDIA_FIELDS_MAP, RELATION_FIELDS_MAP } from './config';

/**
 * Runs all backfill sync operations.
 */
export async function runBackfillSync(strapi: Core.Strapi): Promise<void> {
    await syncMediaUrls(strapi);
    await syncRelationFields(strapi);
    console.log('[SYNC] Backfill sync complete.');
}

/**
 * Backfills media URLs to denormalized fields.
 */
async function syncMediaUrls(strapi: Core.Strapi): Promise<void> {
    console.log('[SYNC] Running Media URL Sync...');

    for (const [uid, config] of Object.entries(MEDIA_FIELDS_MAP)) {
        const fieldsToPopulate = config.map(c => c.media);
        const entries = await strapi.documents(uid as any).findMany({
            populate: fieldsToPopulate,
            status: 'draft',
            limit: 100
        });

        let updatedCount = 0;

        for (const entry of entries) {
            let needsUpdate = false;
            const updateData: any = {};

            for (const field of config) {
                const media = entry[field.media];
                const currentUrl = entry[field.url];

                if (media && (media as any).url && currentUrl !== (media as any).url) {
                    updateData[field.url] = (media as any).url;
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await strapi.documents(uid as any).update({
                    documentId: (entry as any).documentId,
                    data: updateData,
                    status: (entry as any).publishedAt ? 'published' : 'draft'
                });
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            console.log(`[SYNC] Updated ${updatedCount} Media fields for ${uid}`);
        }
    }
}

/**
 * Backfills relation fields to denormalized fields.
 */
async function syncRelationFields(strapi: Core.Strapi): Promise<void> {
    console.log('[SYNC] Running Relation Field Sync (Denormalization)...');

    for (const [uid, config] of Object.entries(RELATION_FIELDS_MAP)) {
        const relationsToPopulate = [...new Set(config.map(c => c.relation))];
        const entries = await strapi.documents(uid as any).findMany({
            populate: relationsToPopulate,
            status: 'draft',
            limit: 100
        });

        let updatedCount = 0;

        for (const entry of entries) {
            let needsUpdate = false;
            const updateData: any = {};

            for (const fieldConfig of config) {
                const relatedEntity = (entry as any)[fieldConfig.relation];
                const currentVal = (entry as any)[fieldConfig.targetField];

                if (relatedEntity) {
                    const sourceVal = relatedEntity[fieldConfig.sourceField];
                    if (sourceVal && sourceVal !== currentVal) {
                        updateData[fieldConfig.targetField] = sourceVal;
                        needsUpdate = true;
                    }
                }
            }

            if (needsUpdate) {
                await strapi.documents(uid as any).update({
                    documentId: (entry as any).documentId,
                    data: updateData,
                    status: (entry as any).publishedAt ? 'published' : 'draft'
                });
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            console.log(`[SYNC] Updated ${updatedCount} Relation fields for ${uid}`);
        }
    }
}
