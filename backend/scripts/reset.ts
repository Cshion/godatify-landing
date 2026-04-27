#!/usr/bin/env npx ts-node
/**
 * Database Reset Script
 * 
 * Truncates all tables, applies schema sync, and seeds data.
 * Development only — destroys all data!
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * 
 * Via Make command (recommended):
 *   make reset-db
 * 
 * Via npx directly:
 *   npx ts-node scripts/reset.ts
 *   npx ts-node scripts/reset.ts --skip-mock   # Skip mock data
 * 
 * ============================================================================
 * WHAT THIS DOES
 * ============================================================================
 * 
 * 1. Initializes Strapi (no HTTP server, just database access)
 * 2. Truncates all tables in public schema (via Knex, not psql)
 * 3. Schema syncs automatically through Strapi's ORM on load
 * 4. Seeds master data (services, industries, pages, etc.)
 * 5. Seeds mock data (clients, authors, blog posts, cases)
 * 6. Shuts down cleanly
 * 
 * ============================================================================
 * WHY THIS APPROACH
 * ============================================================================
 * 
 * - No external psql dependency (uses Knex through Strapi)
 * - No start/stop Strapi dance (single process)
 * - No timing-based waits (deterministic)
 * - Cross-platform (no hardcoded paths)
 * - Idempotent (can run repeatedly)
 * 
 */

import { createStrapi, type Core } from '@strapi/strapi';
import { seedMasterData, seedMockData } from '../src/bootstrap';

// Parse CLI arguments
const args = process.argv.slice(2);
const skipMock = args.includes('--skip-mock');

/**
 * Truncates all user tables in the public schema.
 * Preserves Strapi internal tables for proper re-initialization.
 */
async function truncateAllTables(strapi: Core.Strapi): Promise<void> {
    const knex = strapi.db?.connection;
    
    if (!knex) {
        throw new Error('Database connection not available');
    }
    
    console.log('[RESET] Getting list of tables...');
    
    // Tables to NEVER truncate (Strapi internals)
    const preserveTables = [
        'strapi_migrations',
        'strapi_migrations_internal', 
        'strapi_database_schema',
    ];
    
    // Get all tables in public schema (PostgreSQL)
    const result = await knex.raw(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    `);
    
    const allTables = result.rows.map((row: { tablename: string }) => row.tablename);
    const tablesToTruncate = allTables.filter((t: string) => !preserveTables.includes(t));
    
    if (tablesToTruncate.length === 0) {
        console.log('[RESET] No tables to truncate. Fresh database.');
        return;
    }
    
    console.log(`[RESET] Found ${allTables.length} tables, truncating ${tablesToTruncate.length} (preserving ${preserveTables.length} internal)...`);
    
    // Disable FK checks, truncate all user tables, re-enable
    await knex.raw('SET session_replication_role = replica;');
    
    for (const table of tablesToTruncate) {
        try {
            await knex.raw(`TRUNCATE TABLE "${table}" CASCADE`);
        } catch (err: any) {
            console.warn(`[RESET] Warning: Could not truncate ${table}: ${err.message}`);
        }
    }
    
    await knex.raw('SET session_replication_role = DEFAULT;');
    
    console.log('[RESET] ✓ All tables truncated');
}

async function main(): Promise<void> {
    // Safety check: only allow in development
    if (process.env.NODE_ENV === 'production') {
        console.error('[RESET] ✗ ERROR: Cannot run reset in production!');
        process.exit(1);
    }
    
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              Database Reset Script                             ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log('║  ⚠️  WARNING: This will DELETE ALL DATA in the database!        ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log(`║  Mode: ${skipMock ? 'MASTER DATA ONLY' : 'FULL RESET (master + mock)'}                         ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');

    let strapi: Core.Strapi | null = null;

    try {
        // Step 1: Initialize Strapi (triggers schema sync via ORM)
        console.log('[RESET] Step 1/4: Initializing Strapi (schema sync)...');
        strapi = await createStrapi({
            appDir: process.cwd(),
            distDir: process.cwd() + '/dist',
        }).load();
        console.log('[RESET] ✓ Strapi loaded, schema synced');
        console.log('');

        // Step 2: Truncate all tables
        console.log('[RESET] Step 2/4: Truncating all tables...');
        await truncateAllTables(strapi);
        console.log('');

        // Step 3: Seed master data
        console.log('[RESET] Step 3/4: Seeding master data...');
        await seedMasterData(strapi);
        console.log('[RESET] ✓ Master data seeded');
        console.log('');

        // Step 4: Seed mock data (unless skipped)
        if (!skipMock) {
            console.log('[RESET] Step 4/4: Seeding mock data...');
            await seedMockData(strapi);
            console.log('[RESET] ✓ Mock data seeded');
        } else {
            console.log('[RESET] Step 4/4: Skipping mock data (--skip-mock)');
        }

        console.log('');
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║              Reset Complete!                                   ║');
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log('║  Run "make dev" to start the development server               ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');

    } catch (error) {
        console.error('[RESET] ✗ Reset failed:', error);
        process.exit(1);
    } finally {
        // Clean up Strapi instance
        if (strapi) {
            console.log('[RESET] Shutting down Strapi...');
            await strapi.destroy();
        }
    }

    process.exit(0);
}

// Run the script
main().catch((err) => {
    console.error('[RESET] Unhandled error:', err);
    process.exit(1);
});
