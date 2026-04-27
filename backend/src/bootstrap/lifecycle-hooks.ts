/**
 * Lifecycle Hooks
 * 
 * Database lifecycle subscribers for automatic field synchronization.
 * - Media URL sync: Copies media file URLs to denormalized URL fields
 * - Relation field sync: Copies related entity fields to parent on create/update
 * - Reverse sync: Propagates updates from source entities to related targets
 */
import type { Core } from '@strapi/strapi';
import { MEDIA_FIELDS_MAP, RELATION_FIELDS_MAP, REVERSE_SYNC_MAP } from './config';

/**
 * Registers all lifecycle hooks for the application.
 * Called during the Strapi `register` phase.
 */
export function registerLifecycleHooks(strapi: Core.Strapi): void {
    strapi.db.lifecycles.subscribe(async (event) => {
        const { model, action, params, result } = event;

        // 1. Media URL Sync
        await handleMediaUrlSync(strapi, model, action, params);

        // 2. Relation Field Sync (Forward Denormalization)
        await handleRelationFieldSync(strapi, model, action, params);

        // 3. Reverse Sync (Propagate updates to related entities)
        await handleReverseSync(strapi, model, action, result);
    });
}

/**
 * Syncs media file URLs to denormalized URL fields.
 */
async function handleMediaUrlSync(
    strapi: Core.Strapi,
    model: any,
    action: string,
    params: any
): Promise<void> {
    const mediaConfig = MEDIA_FIELDS_MAP[model.uid as keyof typeof MEDIA_FIELDS_MAP];
    
    if (!mediaConfig || !['beforeCreate', 'beforeUpdate'].includes(action)) {
        return;
    }

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

/**
 * Syncs related entity fields to parent entity (forward denormalization).
 */
async function handleRelationFieldSync(
    strapi: Core.Strapi,
    model: any,
    action: string,
    params: any
): Promise<void> {
    const relationConfig = RELATION_FIELDS_MAP[model.uid as keyof typeof RELATION_FIELDS_MAP];
    
    if (!relationConfig || !['beforeCreate', 'beforeUpdate'].includes(action)) {
        return;
    }

    for (const config of relationConfig) {
        const relationInput = params.data[config.relation];
        if (!relationInput) continue;

        const schema = strapi.contentTypes[model.uid as any];
        const attribute = schema.attributes[config.relation] as { type: string; target?: string };
        const targetUid = attribute.target;

        if (!targetUid) continue;

        try {
            let idToFetch = typeof relationInput === 'object'
                ? (relationInput.id || relationInput.connect?.[0]?.id || relationInput.connect?.[0])
                : relationInput;

            if (idToFetch) {
                const relatedEntity = await strapi.documents(targetUid as any).findOne({ documentId: idToFetch } as any);
                if (relatedEntity && relatedEntity[config.sourceField]) {
                    params.data[config.targetField] = relatedEntity[config.sourceField];
                }
            }
        } catch (error) {
            // Silently handle relation sync errors
        }
    }
}

/**
 * Propagates updates from source entities to all related target entities.
 * Triggered after update of Client, Industry, or Testimonial.
 */
async function handleReverseSync(
    strapi: Core.Strapi,
    model: any,
    action: string,
    result: any
): Promise<void> {
    const reverseConfig = REVERSE_SYNC_MAP[model.uid as keyof typeof REVERSE_SYNC_MAP];
    
    if (!reverseConfig || action !== 'afterUpdate' || !result) {
        return;
    }

    try {
        const targetUid = reverseConfig.targetModel as any;

        // Find all items in the target model that link to this entity
        const affectedEntries = await strapi.documents(targetUid).findMany({
            filters: {
                [reverseConfig.relationField]: {
                    documentId: result.documentId
                }
            }
        });

        if (affectedEntries.length === 0) return;

        // Construct the update payload based on the new data in result
        const updateData: any = {};
        for (const fieldMap of reverseConfig.fields) {
            if (result[fieldMap.source] !== undefined) {
                updateData[fieldMap.target] = result[fieldMap.source];
            }
        }

        console.log(`[REV-SYNC] Updating ${affectedEntries.length} ${targetUid} entries linked to ${model.uid} ${result.documentId}`);

        // Update each affected entry
        for (const entry of affectedEntries) {
            await strapi.documents(targetUid).update({
                documentId: entry.documentId,
                data: updateData,
                status: entry.publishedAt ? 'published' : 'draft'
            });
        }
    } catch (error) {
        console.error(`[LIFECYCLE] Error in Reverse Sync for ${model.uid}:`, error);
    }
}
