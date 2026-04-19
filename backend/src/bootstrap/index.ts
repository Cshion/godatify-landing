/**
 * Bootstrap Module
 * 
 * Orchestrates all bootstrap operations for the Strapi application.
 * 
 * ============================================================================
 * IMPORTANT: SEEDING IS NOT DONE HERE
 * ============================================================================
 * 
 * Seeding is ONLY done via make commands:
 *   - make seed       → Master data (safe for production)
 *   - make seed-mock  → Mock data (dev only)
 * 
 * This bootstrap does NOT seed any data to prevent issues with:
 *   - Double seeding (bootstrap + manual)
 *   - Production data being overwritten unexpectedly
 *   - Unpredictable startup behavior
 * 
 * ============================================================================
 * EXECUTION ORDER (on every Strapi start)
 * ============================================================================
 * 
 * 1. Backfill Sync (ALWAYS) - Media URLs and relation fields
 * 2. Permissions (ALWAYS)   - Public API access
 * 3. Indexes (ALWAYS)       - Database performance
 * 4. Repairs (ALWAYS)       - Data corruption fixes
 * 
 * ============================================================================
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

// Re-export for external use (allows standalone seed script to use these)
export { registerLifecycleHooks, seedMasterData, seedMockData };

/**
 * Runs the full bootstrap sequence.
 * 
 * NOTE: This does NOT run any seeding. Use `make seed` or `make seed-mock` instead.
 */
export async function runBootstrap(strapi: Core.Strapi): Promise<void> {
    console.log('[BOOTSTRAP] Starting bootstrap...');
    console.log(`[BOOTSTRAP] Environment: ${process.env.NODE_ENV}`);

    // 1. Backfill Sync (ALWAYS)
    await runBackfillSync(strapi);

    // 2. Permissions (ALWAYS)
    await seedPermissions(strapi);

    // 3. Database Indexes (ALWAYS)
    await applyIndexes(strapi);

    // 4. Emergency Repairs (ALWAYS)
    await runRepairs(strapi);

    console.log('[BOOTSTRAP] Bootstrap complete.');
    console.log('[BOOTSTRAP] Note: Seeding is done via `make seed` or `make seed-mock`, not during bootstrap.');
}
