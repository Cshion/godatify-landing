/**
 * Strapi Application Entry Point
 * 
 * This file defines the register and bootstrap hooks for the application.
 * All complex logic has been moved to the bootstrap/ module for maintainability.
 */
import type { Core } from '@strapi/strapi';
import { registerLifecycleHooks, runBootstrap } from './bootstrap';

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     * 
     * Registers lifecycle hooks for:
     * - Media URL synchronization
     * - Relation field denormalization
     * - Reverse sync (propagating updates to related entities)
     */
    register({ strapi }: { strapi: Core.Strapi }) {
        registerLifecycleHooks(strapi);
    },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     * 
     * Executes:
     * 1. Backfill sync (ALWAYS) - Media URLs and relation fields
     * 2. Master data seeding (NON-PRODUCTION) - Foundational content
     * 3. Mock data seeding (DEVELOPMENT ONLY) - Test content
     * 4. Permissions (ALWAYS) - Public API access
     * 5. Database indexes (ALWAYS) - Performance optimization
     * 6. Emergency repairs (ALWAYS) - Data corruption fixes
     */
    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        await runBootstrap(strapi);
    },
};
