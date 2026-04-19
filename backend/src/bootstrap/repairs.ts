/**
 * Emergency Repairs
 * 
 * Fixes data corruption issues on bootstrap.
 * - Corrupted image blocks (formats: null, NaN dimensions)
 * 
 * RUNS IN ALL ENVIRONMENTS.
 */
import type { Core } from '@strapi/strapi';

/**
 * Runs all repair operations.
 */
export async function runRepairs(strapi: Core.Strapi): Promise<void> {
    await repairCorruptedImageBlocks(strapi);
}

/**
 * Fixes corrupted image blocks in blog posts.
 * Repairs: formats: null, NaN dimensions, missing required fields.
 */
async function repairCorruptedImageBlocks(strapi: Core.Strapi): Promise<void> {
    try {
        console.log('[REPAIR] Checking for corrupted image blocks...');

        const drafts = await strapi.documents('api::blog-post.blog-post').findMany({ status: 'draft' });
        const published = await strapi.documents('api::blog-post.blog-post').findMany({ status: 'published' });
        const allDocs = [...drafts, ...published];

        // Deduplicate by documentId
        const uniqueDocs = Array.from(
            new Map(allDocs.map(p => [(p as any).documentId, p])).values()
        );

        for (const post of uniqueDocs) {
            if (!post.content || !Array.isArray(post.content)) continue;

            let updated = false;
            const newContent = (post.content as any[]).map((block: any, idx) => {
                if (block.type === 'image' || block.image) {
                    let fixedImage = block.image || {};
                    let changed = false;

                    // Fix formats
                    if (!fixedImage.formats || typeof fixedImage.formats !== 'object') {
                        console.log(`[REPAIR] Fixing formats in ${post.slug} (Block ${idx})`);
                        fixedImage.formats = {};
                        changed = true;
                    }

                    // Fix width
                    if (isNaN(Number(fixedImage.width))) {
                        console.log(`[REPAIR] Fixing width in ${post.slug} (Block ${idx})`);
                        fixedImage.width = 1200;
                        changed = true;
                    }

                    // Fix height
                    if (isNaN(Number(fixedImage.height))) {
                        console.log(`[REPAIR] Fixing height in ${post.slug} (Block ${idx})`);
                        fixedImage.height = 800;
                        changed = true;
                    }

                    // Fix missing required fields
                    if (!fixedImage.provider) {
                        fixedImage.provider = 'local';
                        changed = true;
                    }
                    if (!fixedImage.hash) {
                        fixedImage.hash = 'fixed_' + Date.now();
                        changed = true;
                    }
                    if (!fixedImage.mime) {
                        fixedImage.mime = 'image/jpeg';
                        changed = true;
                    }
                    if (!fixedImage.name) {
                        fixedImage.name = 'fixed.jpg';
                        changed = true;
                    }

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
}
