/**
 * Master Data Seeding
 * 
 * Seeds foundational/production data from seed-data/master/.
 * This includes: services, social links, company info, clients,
 * authors, sectors, industries, testimonials, and page content.
 * 
 * RUNS IN NON-PRODUCTION ENVIRONMENTS ONLY.
 */
import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import { seedCollection, seedSingle } from './utils';

const MASTER_DATA_PATH = path.join(process.cwd(), 'seed-data', 'master');

/**
 * Seeds all master data from JSON files.
 */
export async function seedMasterData(strapi: Core.Strapi): Promise<void> {
    console.log(`[SEED] Master Data Path: ${MASTER_DATA_PATH}`);

    if (!fs.existsSync(MASTER_DATA_PATH)) {
        console.warn('[SEED] Master data path does not exist, skipping.');
        return;
    }

    try {
        // Services
        await seedServices(strapi);

        // Social Links
        await seedSocialLinks(strapi);

        // Company Info
        await seedCompanyInfo(strapi);

        // Clients (needed before pages that reference them)
        const allClients = await seedClients(strapi);

        // Authors
        await seedAuthors(strapi);

        // Sectors (needed before industries)
        const allSectors = await seedSectors(strapi);

        // Industries (depend on sectors)
        await seedIndustries(strapi, allSectors);

        // Testimonials
        await seedTestimonials(strapi);

        // Page Content
        await seedPages(strapi, allClients);

        console.log('[SEED] Master data seeding complete.');
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

async function seedClients(strapi: Core.Strapi): Promise<any[]> {
    const filePath = path.join(MASTER_DATA_PATH, 'clients.json');
    if (!fs.existsSync(filePath)) return [];

    const clientsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await seedCollection(strapi, 'api::client.client', clientsData, 'name');
    return await strapi.documents('api::client.client' as any).findMany({ limit: 100 });
}

async function seedAuthors(strapi: Core.Strapi): Promise<any[]> {
    const filePath = path.join(MASTER_DATA_PATH, 'authors.json');
    if (!fs.existsSync(filePath)) return [];

    const authorsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await seedCollection(strapi, 'api::author.author', authorsData, 'name');
    return await strapi.documents('api::author.author' as any).findMany({ limit: 100 });
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

async function seedTestimonials(strapi: Core.Strapi): Promise<any[]> {
    const filePath = path.join(MASTER_DATA_PATH, 'testimonials.json');
    if (!fs.existsSync(filePath)) return [];

    const testimonialsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await seedCollection(strapi, 'api::testimonial.testimonial', testimonialsData);
    return await strapi.documents('api::testimonial.testimonial' as any).findMany({ limit: 100 });
}

async function seedPages(strapi: Core.Strapi, allClients: any[]): Promise<void> {
    // Home Page
    const homePath = path.join(MASTER_DATA_PATH, 'home.json');
    if (fs.existsSync(homePath)) {
        const homeData = JSON.parse(fs.readFileSync(homePath, 'utf-8'));
        homeData.clients = allClients.map((c: any) => c.documentId);
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
}
