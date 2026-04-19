/**
 * Bootstrap Module
 * 
 * Orchestrates all bootstrap operations for the Strapi application.
 * 
 * Execution Order:
 * 1. Backfill Sync (ALWAYS) - Media URLs and relation fields
 * 2. Master Data (NON-PRODUCTION) - Foundational seed data
 * 3. Mock Data (DEVELOPMENT ONLY) - Test/demo content
 * 4. Permissions (ALWAYS) - Public API access
 * 5. Indexes (ALWAYS) - Database performance
 * 6. Repairs (ALWAYS) - Data corruption fixes
 */
import type { Core } from '@strapi/strapi';

// Import all bootstrap modules
import { registerLifecycleHooks } from './lifecycle-hooks';
import { runBackfillSync } from './sync';
import { seedPermissions } from './permissions';
import { seedMasterData } from './master-data';
import { seedMockData } from './mock-data';
import { applyIndexes } from './indexes';
import { runRepairs } from './repairs';

// Re-export for external use
export { registerLifecycleHooks };

/**
 * Runs the full bootstrap sequence.
 */
export async function runBootstrap(strapi: Core.Strapi): Promise<void> {
    console.log('[BOOTSTRAP] Starting bootstrap...');

    const isProduction = process.env.NODE_ENV === 'production';
    const isDev = process.env.NODE_ENV === 'development';

    console.log(`[BOOTSTRAP] Environment: ${process.env.NODE_ENV}, isProduction: ${isProduction}, isDev: ${isDev}`);

    // 1. Backfill Sync (ALWAYS)
    await runBackfillSync(strapi);

    // 2. Conditional Seeding
    if (isProduction) {
        console.warn('[SEED] ⚠️  SKIPPING SEED OPERATIONS — Production environment detected');
        console.warn('[SEED] NODE_ENV is "production". Seeding is disabled for safety.');
        console.warn('[SEED] To seed data, run in development: NODE_ENV=development npm run dev');
    } else {
        console.log('[SEED] ✓ Non-production environment — seeding enabled');

        // 2a. Master Data (non-production)
        await seedMasterData(strapi);

        // 2b. Mock Data (development only)
        if (isDev) {
            await seedMockData(strapi);
        }
    }

    // 3. Permissions (ALWAYS)
    await seedPermissions(strapi);

    // 4. Database Indexes (ALWAYS)
    await applyIndexes(strapi);

    // 5. Emergency Repairs (ALWAYS)
    await runRepairs(strapi);

    console.log('[BOOTSTRAP] Bootstrap complete.');
}
