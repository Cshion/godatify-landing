#!/usr/bin/env npx ts-node
/**
 * Standalone Seed Script
 * 
 * Runs seed operations independently of Strapi bootstrap.
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * 
 * Via Make commands (recommended):
 *   make seed        # Master data only (safe for production)
 *   make seed-mock   # Mock data only (dev only)
 * 
 * Via npm/npx directly:
 *   npx ts-node scripts/seed.ts              # Master data only
 *   npx ts-node scripts/seed.ts --mock-only  # Mock data only
 * 
 * ============================================================================
 * DATA CATEGORIES
 * ============================================================================
 * 
 * MASTER DATA (make seed) — Safe for production:
 *   - services, social-links, company-info
 *   - sectors, industries
 *   - pages (home, about, contact)
 * 
 * MOCK DATA (make seed-mock) — Development only:
 *   - clients, authors, testimonials
 *   - blog-posts, case-studies
 * 
 * ============================================================================
 * TYPICAL WORKFLOW
 * ============================================================================
 * 
 * For development (fresh start):
 *   1. make seed        # Seed structural data first
 *   2. make seed-mock   # Then seed sample content
 *   3. make dev         # Start development server
 * 
 * For production:
 *   1. make seed        # Seed structural data only
 *   2. make start       # Start production server
 *   (Clients, authors, testimonials are added manually via Strapi admin)
 * 
 * ============================================================================
 */

import { createStrapi, type Core } from '@strapi/strapi';
import { seedMasterData, seedMockData } from '../src/bootstrap';

// Parse CLI arguments
const args = process.argv.slice(2);
const mockOnly = args.includes('--mock-only');

async function main(): Promise<void> {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              Standalone Seed Script                            ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    
    if (mockOnly) {
        console.log('║  Mode: MOCK DATA ONLY (dev only)                              ║');
        console.log('║  Seeds: clients, authors, testimonials, blog-posts, cases     ║');
    } else {
        console.log('║  Mode: MASTER DATA ONLY (safe for production)                 ║');
        console.log('║  Seeds: services, social-links, company, sectors, industries  ║');
        console.log('║         pages (home, about, contact)                          ║');
    }
    
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');

    let strapi: Core.Strapi | null = null;

    try {
        // Initialize Strapi in a minimal mode (no server, just database access)
        console.log('[SEED] Initializing Strapi...');
        strapi = await createStrapi({
            appDir: process.cwd(),
            distDir: process.cwd() + '/dist',
        }).load();

        console.log('[SEED] Strapi loaded successfully.');
        console.log('');

        if (mockOnly) {
            // Mock data only
            console.log('[SEED] ═══ Running Mock Data Seed ═══');
            await seedMockData(strapi);
            console.log('[SEED] ✓ Mock data seed complete.');
        } else {
            // Master data only (default)
            console.log('[SEED] ═══ Running Master Data Seed ═══');
            await seedMasterData(strapi);
            console.log('[SEED] ✓ Master data seed complete.');
        }

        console.log('');
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║              Seed Complete!                                    ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');

    } catch (error) {
        console.error('[SEED] ✗ Seed failed:', error);
        process.exit(1);
    } finally {
        // Clean up Strapi instance
        if (strapi) {
            console.log('[SEED] Shutting down Strapi...');
            await strapi.destroy();
        }
    }

    process.exit(0);
}

// Run the script
main().catch((err) => {
    console.error('[SEED] Unhandled error:', err);
    process.exit(1);
});
