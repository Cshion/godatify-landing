/**
 * Permissions Seeding
 * 
 * Configures public API permissions for all content types.
 * RUNS IN ALL ENVIRONMENTS (production + development).
 */
import type { Core } from '@strapi/strapi';

/**
 * Seeds public role permissions for all API endpoints.
 * Ensures the public can access read-only endpoints for the landing page.
 */
export async function seedPermissions(strapi: Core.Strapi): Promise<void> {
    try {
        const publicRole = await strapi.documents('plugin::users-permissions.role').findFirst({
            filters: { type: 'public' },
            populate: ['permissions']
        }) as any;

        if (!publicRole) {
            console.warn('[SEED] Public role not found, skipping permissions setup.');
            return;
        }

        console.log('[SEED] Configuring Public Role permissions...');
        const roleService = strapi.plugin('users-permissions').service('role');

        const permissions = {
            ...publicRole.permissions,
            'api::company-info': { controllers: { 'company-info': { find: { enabled: true } } } },
            'api::service': { controllers: { service: { find: { enabled: true }, findOne: { enabled: true } } } },
            'api::case-study': { controllers: { 'case-study': { find: { enabled: true }, findOne: { enabled: true } } } },
            'api::industry': { controllers: { industry: { find: { enabled: true }, findOne: { enabled: true } } } },
            'api::testimonial': { controllers: { testimonial: { find: { enabled: true } } } },
            'api::client': { controllers: { client: { find: { enabled: true } } } },
            'api::social-link': { controllers: { 'social-link': { find: { enabled: true } } } },
            'api::blog-post': { controllers: { 'blog-post': { find: { enabled: true }, findOne: { enabled: true } } } },
            'api::author': { controllers: { author: { find: { enabled: true }, findOne: { enabled: true } } } },
            'api::home-page': { controllers: { 'home-page': { find: { enabled: true } } } },
            'api::about-page': { controllers: { 'about-page': { find: { enabled: true } } } },
            'api::contact-page': { controllers: { 'contact-page': { find: { enabled: true } } } },
            'api::industries-page': { controllers: { 'industries-page': { find: { enabled: true } } } },
            'api::cases-page': { controllers: { 'cases-page': { find: { enabled: true } } } },
            'api::blog-page': { controllers: { 'blog-page': { find: { enabled: true } } } },
            'api::sector': { controllers: { sector: { find: { enabled: true }, findOne: { enabled: true } } } },
        };

        await roleService.updateRole(publicRole.id, { permissions });
        console.log('[SEED] Public Role permissions configured successfully.');
    } catch (error) {
        console.error('[SEED] Error configuring permissions:', error);
    }
}
