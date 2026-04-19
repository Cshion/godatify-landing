/**
 * Database Index Optimization
 * 
 * Ensures critical database indexes exist for performance.
 * 
 * RUNS IN ALL ENVIRONMENTS.
 */
import type { Core } from '@strapi/strapi';

/**
 * Applies performance indexes to database tables.
 */
export async function applyIndexes(strapi: Core.Strapi): Promise<void> {
    try {
        const knex = strapi.db.connection;

        // Index for Case Study Sorting (published_at)
        await tryCreateIndex(knex, 'case_studies', 'published_at', 'case_studies_published_at_idx');

        // Index for Service Lookup (slug)
        await tryCreateIndex(knex, 'services', 'slug', 'services_slug_idx');

    } catch (error) {
        console.error('[OPTIMIZATION] Failed to apply indexes:', error);
    }
}

/**
 * Attempts to create an index, silently ignoring if it already exists.
 */
async function tryCreateIndex(
    knex: any,
    table: string,
    column: string,
    indexName: string
): Promise<void> {
    const hasColumn = await knex.schema.hasColumn(table, column);
    if (!hasColumn) return;

    try {
        await knex.schema.alterTable(table, (tableBuilder: any) => {
            tableBuilder.index([column], indexName);
        });
        console.log(`[OPTIMIZATION] Added index: ${indexName}`);
    } catch (e: any) {
        // Ignore if index already exists
    }
}
