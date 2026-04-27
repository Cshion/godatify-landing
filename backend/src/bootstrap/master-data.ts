/**
 * Master Data Seeding
 * 
 * Seeds foundational/structural data from seed-data/master/.
 * 
 * ============================================================================
 * SAFE FOR PRODUCTION
 * ============================================================================
 * 
 * This data can be seeded in production because it represents:
 * - Business structure (services, sectors, industries)
 * - Company metadata (company info, social links)
 * - CMS page content (home, about, contact, services, industries pages)
 * 
 * Run via: make seed
 * 
 * ============================================================================
 * WHAT IS SEEDED HERE
 * ============================================================================
 * 
 * STRUCTURAL DATA:
 * - services         → Service offerings (data analytics, BI, etc.)
 * - social-links     → Company social media accounts
 * - company-info     → Company metadata (name, logo, contact info)
 * - sectors          → High-level sector taxonomy
 * - industries       → Industry taxonomy within sectors
 * 
 * PAGE CONTENT:
 * - home-page        → Homepage CMS content
 * - about-page       → About page CMS content
 * - contact-page     → Contact page CMS content
 * 
 * ============================================================================
 * WHAT IS NOT SEEDED HERE (see mock-data.ts instead)
 * ============================================================================
 * 
 * The following are in MOCK DATA because they represent relationships
 * that must be created manually in production:
 * - clients          → Real clients are added via Strapi admin
 * - authors          → Real employees are added via Strapi admin
 * - testimonials     → Real customer feedback added via Strapi admin
 * - blog-posts       → Real blog content created by authors
 * - case-studies     → Real case studies with real clients
 * 
 * ============================================================================
 */
import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import { seedCollection, seedSingle } from './utils';

const MASTER_DATA_PATH = path.join(process.cwd(), 'seed-data', 'master');

/**
 * Seeds all master data from JSON files.
 * 
 * @param strapi - The Strapi instance
 */
export async function seedMasterData(strapi: Core.Strapi): Promise<void> {
    console.log(`[SEED] Master Data Path: ${MASTER_DATA_PATH}`);

    if (!fs.existsSync(MASTER_DATA_PATH)) {
        console.warn('[SEED] Master data path does not exist, skipping.');
        return;
    }

    try {
        // ════════════════════════════════════════════════════════════════════
        // STRUCTURAL DATA — Business taxonomy and service definitions
        // ════════════════════════════════════════════════════════════════════
        
        // Services — Business service offerings (data analytics, BI, etc.)
        await seedServices(strapi);

        // Social Links — Company social media accounts
        await seedSocialLinks(strapi);

        // Company Info — Company metadata (name, logo, contact)
        await seedCompanyInfo(strapi);

        // ════════════════════════════════════════════════════════════════════
        // TAXONOMY DATA — Industry/sector structure
        // ════════════════════════════════════════════════════════════════════

        // Sectors — High-level groupings (needed before industries)
        const allSectors = await seedSectors(strapi);

        // Industries — Industry taxonomy within sectors
        await seedIndustries(strapi, allSectors);

        // ════════════════════════════════════════════════════════════════════
        // PAGE CONTENT — CMS page content for single-type pages
        // ════════════════════════════════════════════════════════════════════
        await seedPages(strapi);

        console.log('[SEED] ✓ Master data seeding complete.');
    } catch (error) {
        console.error('[SEED] Error seeding Master Data:', error);
    }
}

async function seedServices(strapi: Core.Strapi): Promise<void> {
    const filePath = path.join(MASTER_DATA_PATH, 'services.json');
    if (!fs.existsSync(filePath)) return;

    const services = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const publishedServices = services.map((s: any) => ({
        ...s,
        imageUrl: s.image || s.imageUrl,
        bgImageUrl: s.backgroundImage || s.bgImage || s.bgImageUrl,
    }));
    await seedCollection(strapi, 'api::service.service', publishedServices, 'slug');
}

async function seedSocialLinks(strapi: Core.Strapi): Promise<void> {
    const filePath = path.join(MASTER_DATA_PATH, 'social-links.json');
    if (!fs.existsSync(filePath)) return;

    const socialLinks = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await seedCollection(strapi, 'api::social-link.social-link', socialLinks, 'platform');
}

async function seedCompanyInfo(strapi: Core.Strapi): Promise<void> {
    const filePath = path.join(MASTER_DATA_PATH, 'company.json');
    if (!fs.existsSync(filePath)) return;

    const companyInfo = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await seedSingle(strapi, 'api::company-info.company-info', companyInfo);
}

async function seedSectors(strapi: Core.Strapi): Promise<any[]> {
    const filePath = path.join(MASTER_DATA_PATH, 'sectors.json');
    if (!fs.existsSync(filePath)) return [];

    const sectorsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await seedCollection(strapi, 'api::sector.sector', sectorsData, 'slug');
    return await strapi.documents('api::sector.sector' as any).findMany({ limit: 100 });
}

async function seedIndustries(strapi: Core.Strapi, allSectors: any[]): Promise<any[]> {
    const filePath = path.join(MASTER_DATA_PATH, 'industries.json');
    if (!fs.existsSync(filePath)) return [];

    const industriesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Seed industries page if present
    if (industriesData.page) {
        await seedSingle(strapi, 'api::industries-page.industries-page', industriesData.page);
    }

    // Seed industries with sector relationships
    if (industriesData.industries) {
        const enrichedIndustries = industriesData.industries.map((ind: any) => {
            if (ind.sector) {
                const sector = allSectors.find((s: any) => s.slug === ind.sector);
                return {
                    ...ind,
                    sector: sector ? sector.documentId : undefined
                };
            }
            return ind;
        });
        await seedCollection(strapi, 'api::industry.industry', enrichedIndustries, 'slug');
    }

    return await strapi.documents('api::industry.industry' as any).findMany({ limit: 100 });
}

/**
 * Seeds page content for single-type pages.
 * 
 * NOTE: Home page no longer includes clients relation since clients
 * are now part of mock data and must be added manually in production.
 */
async function seedPages(strapi: Core.Strapi): Promise<void> {
    // Home Page
    const homePath = path.join(MASTER_DATA_PATH, 'home.json');
    if (fs.existsSync(homePath)) {
        const homeData = JSON.parse(fs.readFileSync(homePath, 'utf-8'));
        // Don't include clients relation - they're mock data
        delete homeData.clients;
        await seedSingle(strapi, 'api::home-page.home-page', homeData);
    }

    // About Page
    const aboutPath = path.join(MASTER_DATA_PATH, 'about.json');
    if (fs.existsSync(aboutPath)) {
        const aboutData = JSON.parse(fs.readFileSync(aboutPath, 'utf-8'));
        await seedSingle(strapi, 'api::about-page.about-page', aboutData);
    }

    // Contact Page
    const contactPath = path.join(MASTER_DATA_PATH, 'contact.json');
    if (fs.existsSync(contactPath)) {
        const contactData = JSON.parse(fs.readFileSync(contactPath, 'utf-8'));
        await seedSingle(strapi, 'api::contact-page.contact-page', contactData);
    }

    // Cases Page
    const casesPath = path.join(MASTER_DATA_PATH, 'cases-page.json');
    if (fs.existsSync(casesPath)) {
        const casesData = JSON.parse(fs.readFileSync(casesPath, 'utf-8'));
        await seedSingle(strapi, 'api::cases-page.cases-page', casesData);
    }

    // Blog Page
    const blogPath = path.join(MASTER_DATA_PATH, 'blog-page.json');
    if (fs.existsSync(blogPath)) {
        const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf-8'));
        await seedSingle(strapi, 'api::blog-page.blog-page', blogData);
    }
}
