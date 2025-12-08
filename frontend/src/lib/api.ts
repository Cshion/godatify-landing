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
    ServiceNav,
    FooterLinks,
    CasesPageContent
} from '@/types';
import { gql } from 'graphql-request';
import { graphQLClient } from './graphql';

import { SERVICES_CONTENT, SERVICES_NAV } from '@/data/services';
import { CASES_CONTENT, CASES_PAGE_CONTENT } from '@/data/cases';
import { INDUSTRIES_CONTENT } from '@/data/industries';
import { TESTIMONIALS_CONTENT } from '@/data/testimonials';
import { COMPANY_INFO, SOCIAL_LINKS, NAV_LINKS, FOOTER_LINKS } from '@/data/company';
import { HERO_CONTENT, STATS, VIDEO_CONFIG, CLIENTS_CONTENT, CAROUSEL_CONFIG, SECTION_LABELS } from '@/data/home';
import { NOSOTROS_CONTENT } from '@/data/about';
import { CONTACT_CONTENT } from '@/data/contact';
import { BLOG_POSTS } from '@/data/blog';
import { BlogPost } from '@/types';



export const api = {
    company: {
        getGlobalData: async (): Promise<{
            companyInfo: CompanyInfo;
            servicesNav: ServiceNav[];
            navLinks: NavLink[];
            socialLinks: SocialLink[];
            footerLinks: FooterLinks;
            sectionLabels: any; // Type as needed based on SECTION_LABELS
        }> => {
            try {
                const query = gql`
                    query GetGlobalData {
                        companyInfo {
                            name
                            description
                            email
                            website
                            logoUrl
                        }
                        services(pagination: { limit: 20 }) {
                            documentId
                            title
                            slug
                            description
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query);

                // Process Company Info
                const info = data?.companyInfo;
                const companyInfo = info ? {
                    name: info.name,
                    description: info.description,
                    email: info.email,
                    website: info.website,
                    logo: {
                        url: info.logoUrl || '/images/logo.png',
                        alt: 'Datify Logo', // Alt text not available with just URL string, use default
                        width: 180, // Default width
                        height: 60  // Default height
                    }
                } : COMPANY_INFO;

                // Process Services Nav
                const servicesNav = (data?.services || []).map((s: any) => ({
                    title: s.title,
                    slug: s.slug,
                    description: s.description || ''
                }));

                return {
                    companyInfo,
                    servicesNav,
                    navLinks: NAV_LINKS,
                    socialLinks: SOCIAL_LINKS,
                    footerLinks: FOOTER_LINKS,
                    sectionLabels: SECTION_LABELS
                };

            } catch (error) {
                console.error('Failed to fetch global data:', error);
                return {
                    companyInfo: COMPANY_INFO,
                    servicesNav: Object.values(SERVICES_NAV).map(s => ({
                        title: s.name,
                        id: s.id,
                        slug: s.id,
                        description: ''
                    })),
                    navLinks: NAV_LINKS,
                    socialLinks: SOCIAL_LINKS,
                    footerLinks: FOOTER_LINKS,
                    sectionLabels: SECTION_LABELS
                };
            }
        },
        getSocialLinks: async (): Promise<SocialLink[]> => {
            return SOCIAL_LINKS;
        }
    },
    home: {
        getData: async (): Promise<{
            hero: HeroContent;
            stats: Stat[];
            videoConfig: VideoConfig;
            carouselConfig: CarouselConfig;
            sectionLabels: any;
            clients: Client[];
            services: Service[];
            cases: CaseStudy[];
            testimonials: Testimonial[];
        }> => {
            try {
                // Consolidated Query - Testimonials, Services, and Recent Cases
                const query = gql`
                    query GetHomePageData {
                        testimonials(pagination: { limit: 6 }) {
                            quote
                            author
                            role
                            linkedIn
                            authorImageUrl
                        }
                        services(pagination: { limit: 10 }) {
                            documentId
                            title
                            slug
                            description
                            icon
                            imageUrl
                        }
                        caseStudies(pagination: { limit: 3 }, sort: "publishedAt:desc") {
                            documentId
                            slug
                            title
                            description
                            mainImageUrl
                        }
                        clients(pagination: { limit: 20 }) {
                            documentId
                            name
                            logoUrl
                        }
                    }
                `;

                const data: any = await graphQLClient.request(query);

                // Process Testimonials
                const testimonials = (data?.testimonials || []).map((item: any) => ({
                    quote: item.quote,
                    author: item.author,
                    role: item.role,
                    linkedIn: item.linkedIn,
                    image: item.authorImageUrl || '/images/placeholder.png'
                }));

                // Process Services
                const services = (data?.services || []).map((item: any) => ({
                    id: item.documentId,
                    slug: item.slug,
                    title: item.title,
                    description: item.description,
                    icon: item.icon,
                    image: item.imageUrl || '/images/placeholder.png'
                }));

                // Process Cases
                const cases = (data?.caseStudies || []).map((item: any) => ({
                    slug: item.slug,
                    title: item.title,
                    industry: 'Caso de Éxito', // Optimized: Hardcoded to avoid N+1 query
                    description: item.description,
                    image: item.mainImageUrl || '/images/placeholder.png',
                    // Client data not needed for Home Cases card
                }));

                // Process Clients
                const clients = (data?.clients || []).map((item: any) => ({
                    name: item.name,
                    logo: item.logoUrl || '/images/placeholder.png',
                    anonymous: false
                }));



                return {
                    hero: HERO_CONTENT,
                    stats: STATS,
                    videoConfig: VIDEO_CONFIG,
                    carouselConfig: CAROUSEL_CONFIG,
                    sectionLabels: SECTION_LABELS,
                    clients: clients.length > 0 ? clients : CLIENTS_CONTENT,
                    services: services.length > 0 ? services : Object.values(SERVICES_CONTENT),
                    cases: cases.length > 0 ? cases : CASES_CONTENT,
                    testimonials: testimonials.length > 0 ? testimonials : TESTIMONIALS_CONTENT
                };
            } catch (error) {
                console.error('Failed to fetch Home Page Data from API, falling back to static data:', error);

                return {
                    hero: HERO_CONTENT,
                    stats: STATS,
                    videoConfig: VIDEO_CONFIG,
                    carouselConfig: CAROUSEL_CONFIG,
                    sectionLabels: SECTION_LABELS,
                    clients: CLIENTS_CONTENT,
                    services: Object.values(SERVICES_CONTENT),
                    cases: CASES_CONTENT,
                    testimonials: TESTIMONIALS_CONTENT
                };
            }
        },
    },
    services: {

        getDetailPageData: async (slug: string): Promise<{ service: Service | undefined, relatedCases: CaseStudy[] }> => {
            try {
                // First fetch the service to get its Title (for filtering cases)
                // We can't easily join cross-types unless there is a relation.
                // Assuming no direct relation in Strapi schema between Service and CaseStudy yet.
                // So we actually might need two ops, OR we rely on exact string match if possible.
                // Strapi GraphQL allows filtering deeply.
                // But we don't know the Title yet.
                // We can fetch Service first, then Cases. 
                // However, the User wants "one query".
                // If we can't do it in one query due to schema, we do it in one FUNCTION.
                // BFF pattern is fine. The network to Strapi might be 2 calls but the Frontend makes 1 call to api.ts.
                // That satisfies the abstraction.

                const query = gql`
                    query GetServiceBySlug($slug: String!) {
                         services(filters: { slug: { eq: $slug } }) {
                            documentId
                            title
                            slug
                            subtitle
                            description
                            icon
                            phrases
                            features
                            methodology
                            techStack
                            bgImageUrl
                            imageUrl
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query, { slug });
                const items = data?.services;
                const item = items && items.length > 0 ? items[0] : null;

                if (!item) {
                    // Fallback logic
                    const staticService = SERVICES_CONTENT[slug] || Object.values(SERVICES_CONTENT).find((s: any) => s.slug === slug);
                    if (!staticService) return { service: undefined, relatedCases: [] };
                    return { service: staticService, relatedCases: [] };
                }

                const service = {
                    id: item.documentId,
                    slug: item.slug,
                    title: item.title,
                    subtitle: item.subtitle,
                    description: item.description,
                    icon: item.icon,
                    image: item.imageUrl || '/images/placeholder.png',
                    backgroundImage: item.bgImageUrl,
                    phrases: item.phrases || [],
                    features: item.features || [],
                    methodology: item.methodology || [],
                    techStack: item.techStack || []
                };

                // Now fetch related cases based on Service Title
                // We could optimize this by ensuring Service Title == Association Industry Title exactly.
                const casesQuery = gql`
                    query GetCasesByIndustry($industryTitle: String!) {
                        caseStudies(filters: { industry: { title: { eq: $industryTitle } } }, pagination: { limit: 3 }) {
                             documentId
                             slug
                             title
                             description
                             mainImageUrl
                             industry {
                                 title
                             }
                             results
                        }
                    }
                `;
                const casesData: any = await graphQLClient.request(casesQuery, { industryTitle: service.title });
                const relatedCases = (casesData?.caseStudies || []).map((c: any) => ({
                    slug: c.slug,
                    title: c.title,
                    industry: c.industry?.title || 'General',
                    description: c.description,
                    image: c.mainImageUrl || '/images/placeholder.png',
                    results: c.results || [] // Ensure array
                }));



                return { service, relatedCases };

            } catch (error) {
                console.error(`Failed to fetch service ${slug} from API, falling back to static data:`, error);
                // Return static fallback
                const staticService = SERVICES_CONTENT[slug];
                return { service: staticService, relatedCases: [] };
            }
        },
        getAll: async (): Promise<Service[]> => {
            try {
                const query = gql`
                    query GetAllServicesSitemap {
                        services(pagination: { limit: 100 }) {
                            documentId
                            title
                            slug
                            description
                            updatedAt
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query);
                return (data?.services || []).map((s: any) => ({
                    id: s.documentId,
                    slug: s.slug,
                    title: s.title,
                    description: s.description,
                    updatedAt: s.updatedAt
                }));
            } catch (error) {
                console.error('Failed to getAll services:', error);
                return Object.values(SERVICES_CONTENT);
            }
        }
    },
    cases: {
        getPageData: async (): Promise<{ hero: any, cases: CaseStudy[] }> => {
            try {
                const query = gql`
                    query GetCasesPageData {
                        caseStudies(sort: "publishedAt:desc", pagination: { limit: 50 }) {
                            documentId
                            slug
                            title
                            description
                            mainImageUrl
                            industryName
                            clientName
                            clientLogoUrl
                            results
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query);
                const items = data?.caseStudies;



                const cases = (!items || items.length === 0) ? CASES_CONTENT : items.map((item: any) => ({
                    slug: item.slug,
                    title: item.title,
                    industry: item.industryName || 'General',
                    description: item.description,
                    image: item.mainImageUrl || '/images/placeholder.png',
                    results: item.results || [], // Ensure results is an array
                    client: {
                        name: item.clientName || 'Anonymous',
                        logo: item.clientLogoUrl || '/images/placeholder.png',
                        anonymous: !item.clientName
                    }
                }));

                return {
                    hero: CASES_PAGE_CONTENT.hero,
                    cases
                };

            } catch (error) {
                console.error('Failed to fetch cases page data:', error);
                return {
                    hero: CASES_PAGE_CONTENT.hero,
                    cases: CASES_CONTENT
                };
            }
        },
        getDetailPageData: async (slug: string): Promise<{ caseStudy: CaseStudy | undefined, relatedCases: CaseStudy[] }> => {
            // Fetch the specific case AND potentially related cases in one go? 
            // For now, let's just fetch the case and we can assume related might be a separate requirement or filtered on client.
            // Actually, best practice is to fetch "Recommended" or "Latest" 2 others here.

            try {
                const query = gql`
                    query GetCaseDetail($slug: String!) {
                        caseStudies(filters: { slug: { eq: $slug } }) {
                            documentId
                            slug
                            title
                            description
                            challenge
                            solution
                            results
                            techStack
                            mainImageUrl
                            videoUrl
                            industryName
                            clientName
                            clientLogoUrl
                            clientWebsite
                            testimonialQuote
                            testimonialAuthor
                            testimonialRole
                            testimonialAuthorImageUrl
                            testimonialLinkedIn
                        }
                        # Fetch 4 recent cases for "Related" section
                        recentCases: caseStudies(pagination: { limit: 4 }, sort: "publishedAt:desc") {
                            documentId
                            slug
                            title
                            description
                            mainImageUrl
                            industryName
                            results
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query, { slug });
                const items = data?.caseStudies;
                const recentAll = data?.recentCases;

                if (!items || items.length === 0) return { caseStudy: undefined, relatedCases: [] };

                const item = items[0];
                const caseStudy = {
                    slug: item.slug,
                    title: item.title,
                    industry: item.industryName || 'General',
                    description: item.description,
                    challenge: item.challenge,
                    solution: item.solution,
                    results: item.results || [], // Ensure array
                    techStack: item.techStack || [], // Ensure array
                    image: item.mainImageUrl || '/images/placeholder.png',
                    videoUrl: item.videoUrl,
                    client: {
                        name: item.clientName || 'Anonymous',
                        logo: item.clientLogoUrl || '/images/placeholder.png',
                        website: item.clientWebsite,
                        anonymous: !item.clientName
                    },
                    testimonial: item.testimonialQuote ? {
                        quote: item.testimonialQuote,
                        author: item.testimonialAuthor,
                        role: item.testimonialRole,
                        linkedIn: item.testimonialLinkedIn,
                        image: item.testimonialAuthorImageUrl
                    } : undefined,
                    content: ''
                };

                // Filter out current case and limit to 3
                const recent = (!recentAll) ? [] : recentAll.filter((r: any) => r.slug !== slug).slice(0, 3);

                const relatedCases = recent.map((r: any) => ({
                    slug: r.slug,
                    title: r.title,
                    description: r.description,
                    image: r.mainImageUrl || '/images/placeholder.png',
                    industry: r.industryName || 'General',
                    results: r.results || []
                    // Minimal fields for cards
                }));

                return { caseStudy, relatedCases };

            } catch (error) {
                console.error(`Failed to fetch case detail ${slug}:`, error);
                return { caseStudy: undefined, relatedCases: [] };
            }
        },
        getAll: async (): Promise<CaseStudy[]> => {
            try {
                const query = gql`
                    query GetAllCasesSitemap {
                        caseStudies(pagination: { limit: 100 }) {
                            slug
                            updatedAt
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query);
                return (data?.caseStudies || []).map((c: any) => ({
                    slug: c.slug,
                    updatedAt: c.updatedAt,
                    title: 'Sitemap Placeholder',
                    industry: 'General',
                    description: '',
                    challenge: '',
                    solution: '',
                    results: [],
                    techStack: [],
                    image: '',
                    client: { name: '', anonymous: false },
                    content: ''
                } as CaseStudy));
            } catch (error) {
                console.error('Failed to getAll cases:', error);
                return CASES_CONTENT;
            }
        }
    },
    industries: {
        getPageData: async (): Promise<{ hero: any, sectors: Industry[], cases: CaseStudy[] }> => {
            try {
                const query = gql`
                    query GetIndustriesPageData {
                        industries {
                            documentId
                            title
                            description
                            stats
                            projects
                            imageUrl
                        }
                        caseStudies(pagination: { limit: 50 }) {
                             documentId
                             slug
                             title
                             description
                             mainImageUrl
                             industryName
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query);

                const sectors = (!data?.industries) ? INDUSTRIES_CONTENT.sectors : data.industries.map((item: any) => ({
                    id: item.documentId,
                    title: item.title,
                    description: item.description,
                    stats: item.stats,
                    projects: item.projects,
                    image: item.imageUrl || '/images/placeholder.png'
                }));

                const cases = (!data?.caseStudies) ? [] : data.caseStudies.map((item: any) => ({
                    slug: item.slug,
                    title: item.title,
                    industry: item.industryName || 'General',
                    description: item.description,
                    image: item.mainImageUrl || '/images/placeholder.png',
                }));

                return {
                    hero: INDUSTRIES_CONTENT.hero,
                    sectors,
                    cases
                };
            } catch (error) {
                console.error('Failed to fetch industries page data:', error);
                return {
                    hero: INDUSTRIES_CONTENT.hero,
                    sectors: INDUSTRIES_CONTENT.sectors,
                    cases: []
                };
            }
        }
    },
    about: {
        getContent: async (): Promise<NosotrosContent & {
            clients: Client[];
            videoConfig: VideoConfig;
            sectionLabels: any;
        }> => {
            try {
                // Fetch Clients for the logo wall in About Us
                const query = gql`
                    query GetAboutPageData {
                        clients(pagination: { limit: 50 }) {
                            documentId
                            name
                            logoUrl
                        }
                    }
                `;
                const data: any = await graphQLClient.request(query);

                const clients = (data?.clients || []).map((item: any) => ({
                    name: item.name,
                    logo: item.logoUrl || '/images/placeholder.png',
                    anonymous: false
                }));

                return {
                    ...NOSOTROS_CONTENT,
                    clients: clients.length > 0 ? clients : CLIENTS_CONTENT,
                    videoConfig: VIDEO_CONFIG,
                    sectionLabels: SECTION_LABELS
                };

            } catch (error) {
                console.error('Failed to fetch About Page data:', error);
                return {
                    ...NOSOTROS_CONTENT,
                    clients: CLIENTS_CONTENT,
                    videoConfig: VIDEO_CONFIG,
                    sectionLabels: SECTION_LABELS
                };
            }
        }
    },
    contact: {
        getPageContent: async () => CONTACT_CONTENT,
    },
    blog: {
        getAll: async (): Promise<BlogPost[]> => {
            return BLOG_POSTS;
        },
        getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
            return BLOG_POSTS.find(p => p.slug === slug);
        }
    }
};
