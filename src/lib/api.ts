import {
    Service,
    CaseStudy,
    Industry,
    Testimonial,
    CompanyInfo,
    HeroContent,
    Stat,
    VideoConfig,
    Client,
    CarouselConfig,
    NosotrosContent,
    SocialLink,
    NavLink,
    FooterLinks,
    CasesPageContent
} from '@/types';

import { SERVICES_CONTENT, SERVICES_NAV } from '@/data/services';
import { CASES_CONTENT, CASES_PAGE_CONTENT } from '@/data/cases';
import { INDUSTRIES_CONTENT } from '@/data/industries';
import { TESTIMONIALS_CONTENT } from '@/data/testimonials';
import { COMPANY_INFO, SOCIAL_LINKS, NAV_LINKS, FOOTER_LINKS } from '@/data/company';
import { HERO_CONTENT, STATS, VIDEO_CONFIG, CLIENTS_CONTENT, CAROUSEL_CONFIG, SECTION_LABELS } from '@/data/home';
import { NOSOTROS_CONTENT } from '@/data/about';
import { CONTACT_CONTENT } from '@/data/contact'; // Added import for CONTACT_CONTENT

// Simulate API delay to ensure components handle async data correctly (optional, can be removed for production build)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    company: {
        getInfo: async (): Promise<CompanyInfo> => {
            return COMPANY_INFO;
        },
        getSocialLinks: async (): Promise<SocialLink[]> => {
            return SOCIAL_LINKS;
        },
        getNavLinks: async (): Promise<NavLink[]> => {
            return NAV_LINKS;
        },
        getFooterLinks: async (): Promise<FooterLinks> => {
            return FOOTER_LINKS;
        }
    },
    home: {
        getHeroContent: async (): Promise<HeroContent> => {
            return HERO_CONTENT;
        },
        getStats: async (): Promise<Stat[]> => {
            return STATS;
        },
        getVideoConfig: async (): Promise<VideoConfig> => {
            return VIDEO_CONFIG;
        },
        getClients: async (): Promise<Client[]> => {
            return CLIENTS_CONTENT;
        },
        getCarouselConfig: async (): Promise<CarouselConfig> => {
            return CAROUSEL_CONFIG;
        },
        getSectionLabels: async () => {
            return SECTION_LABELS;
        },
    },
    services: {
        getAll: async (): Promise<Service[]> => {
            const order = [
                'business-intelligence',
                'data-engineering',
                'digital-platform',
                'business-analytics',
                'big-data-management'
            ];
            return order.map(id => SERVICES_CONTENT[id]);
        },
        getById: async (id: string): Promise<Service | undefined> => {
            return SERVICES_CONTENT[id];
        },
        getNav: async (): Promise<typeof SERVICES_NAV> => {
            return SERVICES_NAV;
        }
    },
    cases: {
        getAll: async (): Promise<CaseStudy[]> => {
            return CASES_CONTENT;
        },
        getBySlug: async (slug: string): Promise<CaseStudy | undefined> => {
            return CASES_CONTENT.find(c => c.slug === slug);
        },
        getByIndustry: async (industryId: string): Promise<CaseStudy[]> => {
            return CASES_CONTENT.filter(c => c.relatedIndustryId === industryId);
        },
        getPageContent: async (): Promise<CasesPageContent> => {
            return CASES_PAGE_CONTENT;
        }
    },
    industries: {
        getHero: async () => {
            return INDUSTRIES_CONTENT.hero;
        },
        getAll: async (): Promise<Industry[]> => {
            return INDUSTRIES_CONTENT.sectors;
        }
    },
    about: {
        getContent: async (): Promise<NosotrosContent> => {
            return NOSOTROS_CONTENT;
        }
    },
    testimonials: {
        getAll: async (): Promise<Testimonial[]> => {
            // Mapping text to quote to match Testimonial interface
            return TESTIMONIALS_CONTENT.map(t => ({
                ...t,
                quote: t.text
            }));
        }
    },
    contact: {
        getPageContent: async () => CONTACT_CONTENT,
    },
};
