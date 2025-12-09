import {
    Service,
    CaseStudy,
    Industry,
    Sector,
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
    CasesPageContent,
    ContactPageContent
} from '@/types';
import qs from 'qs';

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



const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Helper for images
const getStrapiMedia = (url: string | null | undefined) => {
    if (!url) return '/images/placeholder.png';
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${STRAPI_URL}${url}`;
};

export const api = {
    company: {
        getGlobalData: async (): Promise<{
            companyInfo: CompanyInfo;
            servicesNav: ServiceNav[];
            sectorsNav: Sector[];
            navLinks: NavLink[];
            socialLinks: SocialLink[];
            footerLinks: FooterLinks;
            sectionLabels: any;
        }> => {
            try {
                // Parallel fetch for Company Info and Services Nav
                const [infoRes, servicesRes] = await Promise.all([
                    fetch(`${STRAPI_URL}/api/company-info`, {
                        headers: { 'Content-Type': 'application/json' },
                        cache: 'no-store'
                    }),
                    fetch(`${STRAPI_URL}/api/services?fields[0]=title&fields[1]=slug&fields[2]=description&pagination[limit]=20`, {
                        headers: { 'Content-Type': 'application/json' },
                        cache: 'no-store'
                    })
                ]);

                // Strapi v5 return check
                const infoJson = await infoRes.json();
                const servicesJson = await servicesRes.json();

                const info = infoJson.data; // Single type
                const servicesData = servicesJson.data || [];

                // Process Company Info
                const companyInfo = info ? {
                    name: info.name,
                    description: info.description,
                    email: info.email,
                    website: info.website,
                    logo: {
                        url: info.logoUrl || '/images/logo.png',
                        alt: 'Datify Logo',
                        width: 180,
                        height: 60
                    }
                } : COMPANY_INFO;

                // Process Services Nav
                const servicesNav = servicesData.map((s: any) => ({
                    title: s.title,
                    slug: s.slug,
                    description: s.description || ''
                }));

                // Fetch Sectors for Header
                const sectors = await api.industries.getSectors();

                return {
                    companyInfo,
                    servicesNav,
                    sectorsNav: sectors,
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
                    sectionLabels: SECTION_LABELS,
                    sectorsNav: []
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
                // Parallel fetch for Home Page components
                const [testimonialsRes, servicesRes, casesRes, clientsRes] = await Promise.all([
                    fetch(`${STRAPI_URL}/api/testimonials?pagination[limit]=6&populate=*`, { cache: 'no-store' }),
                    fetch(`${STRAPI_URL}/api/services?fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=icon&fields[4]=imageUrl&pagination[limit]=10`, { cache: 'no-store' }),
                    fetch(`${STRAPI_URL}/api/case-studies?sort[0]=publishedAt:desc&sort[1]=slug:asc&pagination[limit]=6&fields[0]=slug&fields[1]=title&fields[2]=description&fields[3]=mainImageUrl`, { cache: 'no-store' }),
                    fetch(`${STRAPI_URL}/api/clients?fields[0]=name&fields[1]=logoUrl&pagination[limit]=20`, { cache: 'no-store' })
                ]);

                const [testimonialsJson, servicesJson, casesJson, clientsJson] = await Promise.all([
                    testimonialsRes.json(),
                    servicesRes.json(),
                    casesRes.json(),
                    clientsRes.json()
                ]);

                // Process Testimonials
                const testimonials = (testimonialsJson.data || []).map((item: any) => ({
                    quote: item.testimonialQuote || item.quote, // Handle diverse naming if needed, schema has 'quote'
                    author: item.author,
                    role: item.role,
                    linkedIn: item.linkedIn,
                    image: item.authorImageUrl || '/images/placeholder.png'
                }));

                // Process Services
                const services = (servicesJson.data || []).map((item: any) => ({
                    id: item.documentId,
                    slug: item.slug,
                    title: item.title,
                    description: item.description,
                    icon: item.icon,
                    image: item.imageUrl || '/images/placeholder.png'
                }));

                // Process Cases
                const cases = (casesJson.data || []).map((item: any) => ({
                    slug: item.slug,
                    title: item.title,
                    industry: 'Caso de Éxito',
                    description: item.description,
                    image: item.mainImageUrl || '/images/placeholder.png',
                }));

                // Process Clients
                const clients = (clientsJson.data || []).map((item: any) => ({
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

                // Optimized REST Implementation (~60ms vs ~400ms)
                const queryParams = qs.stringify({
                    filters: {
                        slug: {
                            $eq: slug,
                        },
                    },
                    populate: {
                        case_studies: {
                            sort: ['publishedAt:desc'],
                            fields: ['slug', 'title', 'description', 'mainImageUrl', 'industryName', 'results'],
                        },
                    },
                }, {
                    encodeValuesOnly: true,
                });

                const res = await fetch(`${STRAPI_URL}/api/services?${queryParams}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store' // Ensure fresh data
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch service: ${res.statusText}`);
                }

                const json = await res.json();
                const item = json.data && json.data.length > 0 ? json.data[0] : null;

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

                // Map the case studies directly from the explicit relationship
                const relatedCases = (item.case_studies || []).slice(0, 3).map((c: any) => ({
                    slug: c.slug,
                    title: c.title,
                    description: c.description,
                    image: c.mainImageUrl || '/images/placeholder.png',
                    industry: c.industryName || 'General',
                    results: c.results || []
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
                // REST: Get all services for sitemap
                const queryParams = qs.stringify({
                    fields: ['title', 'slug', 'description', 'updatedAt'],
                    pagination: { limit: 100 }
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/services?${queryParams}`, {
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store'
                });
                const json = await res.json();
                const services = json.data || [];

                return services.map((s: any) => ({
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
                // REST: Get all cases sorted by date
                const queryParams = qs.stringify({
                    sort: ['publishedAt:desc'],
                    pagination: { limit: 50 },
                    populate: '*', // Fetch all fields for card display
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/case-studies?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();
                const items = json.data || [];

                const cases = items.length === 0 ? CASES_CONTENT : items.map((item: any) => ({
                    slug: item.slug,
                    title: item.title,
                    industry: item.industryName || 'General',
                    description: item.description,
                    image: item.mainImageUrl || '/images/placeholder.png',
                    results: item.results || [],
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
            try {
                // Parallel fetch: Specific Case (by slug) AND Recent Cases (for related)
                const caseQuery = qs.stringify({
                    filters: { slug: { $eq: slug } },
                    populate: '*' // Fetch all details
                }, { encodeValuesOnly: true });

                const recentQuery = qs.stringify({
                    sort: ['publishedAt:desc'],
                    pagination: { limit: 4 },
                    fields: ['slug', 'title', 'description', 'mainImageUrl', 'industryName', 'results']
                }, { encodeValuesOnly: true });

                const [caseRes, recentRes] = await Promise.all([
                    fetch(`${STRAPI_URL}/api/case-studies?${caseQuery}`, { cache: 'no-store' }),
                    fetch(`${STRAPI_URL}/api/case-studies?${recentQuery}`, { cache: 'no-store' })
                ]);

                const [caseJson, recentJson] = await Promise.all([
                    caseRes.json(),
                    recentRes.json()
                ]);

                const items = caseJson.data || [];
                const recentAll = recentJson.data || [];

                if (items.length === 0) return { caseStudy: undefined, relatedCases: [] };

                const item = items[0];
                const caseStudy = {
                    slug: item.slug,
                    title: item.title,
                    industry: item.industryName || 'General',
                    description: item.description,
                    challenge: item.challenge,
                    solution: item.solution,
                    results: item.results || [],
                    techStack: item.techStack || [],
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
                const recent = recentAll.filter((r: any) => r.slug !== slug).slice(0, 3);

                const relatedCases = recent.map((r: any) => ({
                    slug: r.slug,
                    title: r.title,
                    description: r.description,
                    image: r.mainImageUrl || '/images/placeholder.png',
                    industry: r.industryName || 'General',
                    results: r.results || []
                }));

                return { caseStudy, relatedCases };

            } catch (error) {
                console.error(`Failed to fetch case detail ${slug}:`, error);
                return { caseStudy: undefined, relatedCases: [] };
            }
        },
        getCases: async ({ start, limit }: { start: number; limit: number }): Promise<{ cases: CaseStudy[]; total: number }> => {
            try {
                const queryParams = qs.stringify({
                    sort: ['publishedAt:desc', 'slug:asc'], // Secondary sort for stability
                    pagination: {
                        start,
                        limit
                    },
                    populate: '*', // Fetch all fields for card display
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/case-studies?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();
                const items = json.data || [];
                const total = json.meta?.pagination?.total || 0;

                const cases = items.map((item: any) => ({
                    slug: item.slug,
                    title: item.title,
                    industry: item.industryName || 'General',
                    description: item.description,
                    image: item.mainImageUrl || '/images/placeholder.png',
                    results: item.results || [],
                    client: {
                        name: item.clientName || 'Anonymous',
                        logo: item.clientLogoUrl || '/images/placeholder.png',
                        anonymous: !item.clientName
                    }
                }));

                return { cases, total };
            } catch (error) {
                console.error('Failed to fetch paginated cases:', error);
                return { cases: [], total: 0 };
            }
        },
        getAll: async (): Promise<CaseStudy[]> => {
            try {
                const queryParams = qs.stringify({
                    fields: ['slug', 'updatedAt'],
                    pagination: { limit: 100 }
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/case-studies?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();

                return (json.data || []).map((c: any) => ({
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
        getPageData: async (): Promise<{ hero: any, sectors: Sector[], cases: CaseStudy[] }> => {
            try {
                // Parallel fetch Sectors, Page Content, and Cases
                const [sectorsRes, pageRes, casesRes] = await Promise.all([
                    // Reuse getSectors logic or call valid endpoint
                    api.industries.getSectors(),
                    fetch(`${STRAPI_URL}/api/industries-page`, { cache: 'no-store' }),
                    fetch(`${STRAPI_URL}/api/case-studies?pagination[limit]=20&populate=*`, { cache: 'no-store' })
                ]);

                // We await the fetch calls that return Response
                const pageJson = await pageRes.json();
                const casesJson = await casesRes.json();

                // sectorsRes is already parsed data from api.industries.getSectors()
                const sectors = sectorsRes;

                const pageData = pageJson.data || {};
                const casesData = casesJson.data || [];

                const hero = {
                    title: pageData.heroTitle || 'Potencia tu Sector',
                    subtitle: pageData.heroSubtitle || 'Soluciones especializadas.',
                    description: pageData.heroDescription || '',
                    phrases: pageData.heroPhrases || [],
                    backgroundImage: pageData.heroBackgroundImageUrl || '/images/hero-industries.png'
                };

                const cases = (!casesData.length) ? [] : casesData.map((item: any) => ({
                    slug: item.slug,
                    title: item.title,
                    industry: item.industryName || 'General',
                    description: item.description,
                    image: item.mainImageUrl || '/images/placeholder.png',
                }));

                return {
                    hero,
                    sectors,
                    cases
                };
            } catch (error) {
                console.error('Failed to fetch industries page data:', error);
                return {
                    hero: { title: 'Industries', description: 'Error loading data' },
                    sectors: [],
                    cases: []
                };
            }
        },
        getSectors: async (): Promise<Sector[]> => {
            try {
                const queryParams = qs.stringify({
                    populate: {
                        industries: {
                            fields: ['title', 'slug', 'description']
                        }
                    },
                    sort: ['title:asc']
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/sectors?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();
                const items = json.data || [];

                return items.map((item: any) => ({
                    id: item.documentId,
                    slug: item.slug,
                    title: item.title,
                    description: item.description,
                    industries: (item.industries || []).map((ind: any) => ({
                        id: ind.documentId,
                        slug: ind.slug,
                        title: ind.title,
                        description: ind.description
                    }))
                }));
            } catch (error) {
                console.error('Failed to fetch sectors:', error);
                return [];
            }
        },
        getIndustryBySlug: async (slug: string): Promise<{ industry: Industry | undefined, relatedCases: CaseStudy[] }> => {
            try {
                const queryParams = qs.stringify({
                    filters: { slug: { $eq: slug } },
                    populate: {
                        sector: { fields: ['title', 'slug'] },
                        image: true
                    }
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/industries?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();
                const items = json.data || [];

                if (items.length === 0) return { industry: undefined, relatedCases: [] };

                const item = items[0];
                const industry: Industry = {
                    id: item.documentId,
                    slug: item.slug,
                    title: item.title,
                    description: item.description,
                    image: getStrapiMedia(item.image?.url || item.imageUrl),
                    stats: item.stats || [],
                    projects: item.projects || [],
                    sector: item.sector ? {
                        title: item.sector.title,
                        slug: item.sector.slug
                    } : undefined
                };

                // Fetch Related Cases
                const casesQuery = qs.stringify({
                    filters: { industryName: { $eq: industry.title } },
                    populate: '*',
                    pagination: { limit: 3 }
                }, { encodeValuesOnly: true });

                let casesRes = await fetch(`${STRAPI_URL}/api/case-studies?${casesQuery}`, { cache: 'no-store' });
                let casesJson = await casesRes.json();

                // Fallback: If no specific cases found, fetch recent cases generic
                if (!casesJson.data || casesJson.data.length === 0) {
                    const fallbackQuery = qs.stringify({
                        sort: ['publishedAt:desc'],
                        populate: '*',
                        pagination: { limit: 3 }
                    }, { encodeValuesOnly: true });
                    casesRes = await fetch(`${STRAPI_URL}/api/case-studies?${fallbackQuery}`, { cache: 'no-store' });
                    casesJson = await casesRes.json();
                }

                const relatedCases = (casesJson.data || []).map((c: any) => ({
                    slug: c.slug,
                    title: c.title,
                    description: c.description,
                    image: c.mainImageUrl || '/images/placeholder.png',
                    industry: c.industryName || 'General',
                    results: c.results || []
                }));

                return { industry, relatedCases };

            } catch (error) {
                console.error(`Failed to fetch industry ${slug}:`, error);
                return { industry: undefined, relatedCases: [] };
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
                // Parallel fetch About Page Data and Clients
                const clientsQuery = qs.stringify({
                    fields: ['name', 'logoUrl'],
                    pagination: { limit: 50 }
                }, { encodeValuesOnly: true });

                const [aboutRes, clientsRes] = await Promise.all([
                    fetch(`${STRAPI_URL}/api/about-page`, { cache: 'no-store' }),
                    fetch(`${STRAPI_URL}/api/clients?${clientsQuery}`, { cache: 'no-store' })
                ]);

                const [aboutJson, clientsJson] = await Promise.all([
                    aboutRes.json(),
                    clientsRes.json()
                ]);

                const aboutData = aboutJson.data;
                const clientItems = clientsJson.data || [];

                const clients = clientItems.map((item: any) => ({
                    name: item.name,
                    logo: item.logoUrl || '/images/placeholder.png',
                    anonymous: false
                }));

                // Map Strapi Data to NosotrosContent
                const content: NosotrosContent = aboutData ? {
                    hero: {
                        title: aboutData.heroTitle,
                        subtitle: aboutData.heroSubtitle,
                        description: aboutData.heroDescription,
                        phrases: aboutData.heroPhrases || [],
                        backgroundImage: aboutData.heroBackgroundImageUrl
                    },
                    mission: {
                        title: aboutData.missionTitle,
                        text: aboutData.missionText,
                        image: aboutData.missionImageUrl || '/images/placeholder.png'
                    },
                    vision: {
                        title: aboutData.visionTitle,
                        text: aboutData.visionText,
                        image: aboutData.visionImageUrl || '/images/placeholder.png'
                    },
                    values: aboutData.values || [], // JSON List
                    culture: {
                        title: aboutData.cultureTitle,
                        description: aboutData.cultureDescription,
                        stats: aboutData.cultureStats || [],
                        image: aboutData.cultureImageUrl || '/images/placeholder.png'
                    },
                    tabs: aboutData.tabs || [] // JSON List
                } : NOSOTROS_CONTENT;

                return {
                    ...content,
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
        getPageContent: async (): Promise<ContactPageContent> => {
            try {
                // Fetch Contact Page Data
                const res = await fetch(`${STRAPI_URL}/api/contact-page`, { cache: 'no-store' });
                const json = await res.json();
                const data = json.data;

                if (!data) return CONTACT_CONTENT;

                // Map Strapi Single Type to ContactPageContent
                return {
                    hero: {
                        title: data.heroTitle,
                        subtitle: data.heroSubtitle
                    },
                    officesSection: {
                        title: data.officesTitle,
                        subtitle: data.officesSubtitle,
                        offices: data.offices || [] // JSON field
                    },
                    form: {
                        title: data.formTitle,
                        subtitle: data.formSubtitle,
                        labels: data.formLabels || CONTACT_CONTENT.form.labels // JSON field or fallback
                    }
                };
            } catch (error) {
                console.error('Failed to fetch Contact page data:', error);
                return CONTACT_CONTENT;
            }
        },
    },

    blog: {
        getPosts: async ({ start, limit }: { start: number; limit: number }): Promise<{ posts: BlogPost[]; total: number }> => {
            try {
                const queryParams = qs.stringify({
                    sort: ['date:desc', 'slug:asc'], // Secondary sort for stability
                    populate: ['author.avatar', 'coverImage'],
                    fields: ['title', 'slug', 'excerpt', 'date', 'readingTime', 'tags', 'featured', 'coverImageUrl'],
                    pagination: {
                        start,
                        limit
                    }
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/blog-posts?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();
                const items = json.data || [];
                const total = json.meta?.pagination?.total || 0;

                const posts = items.map((item: any) => ({
                    id: item.documentId,
                    title: item.title,
                    slug: item.slug,
                    excerpt: item.excerpt,
                    content: '',
                    date: item.date,
                    readingTime: item.readingTime,
                    tags: item.tags || [],
                    featured: item.featured,
                    image: getStrapiMedia(item.coverImage?.url || item.coverImageUrl),
                    author: {
                        name: item.author?.name || 'Datify Team',
                        role: item.author?.role || 'Contributor',
                        image: getStrapiMedia(item.author?.avatar?.url || item.author?.avatarUrl)
                    }
                }));

                return { posts, total };
            } catch (error) {
                console.error('Failed to fetch paginated blog posts:', error);
                return { posts: [], total: 0 };
            }
        },
        getAll: async (): Promise<BlogPost[]> => {
            try {
                const queryParams = qs.stringify({
                    sort: ['date:desc'],
                    populate: ['author.avatar', 'coverImage'], // detailed populate
                    fields: ['title', 'slug', 'excerpt', 'date', 'readingTime', 'tags', 'featured', 'coverImageUrl']
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/blog-posts?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();
                const items = json.data || [];

                return items.map((item: any) => ({
                    id: item.documentId,
                    title: item.title,
                    slug: item.slug,
                    excerpt: item.excerpt,
                    content: '', // Not needed for list
                    date: item.date,
                    readingTime: item.readingTime,
                    tags: item.tags || [],
                    featured: item.featured,
                    image: getStrapiMedia(item.coverImage?.url || item.coverImageUrl),
                    author: {
                        name: item.author?.name || 'Datify Team',
                        role: item.author?.role || 'Contributor',
                        image: getStrapiMedia(item.author?.avatar?.url || item.author?.avatarUrl)
                    }
                }));

            } catch (error) {
                console.error('Failed to fetch blog posts:', error);
                return BLOG_POSTS;
            }
        },
        getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
            try {
                const queryParams = qs.stringify({
                    filters: { slug: { $eq: slug } },
                    populate: ['author.avatar', 'coverImage'],
                    fields: ['title', 'slug', 'excerpt', 'date', 'readingTime', 'tags', 'featured', 'content', 'coverImageUrl']
                }, { encodeValuesOnly: true });

                const res = await fetch(`${STRAPI_URL}/api/blog-posts?${queryParams}`, { cache: 'no-store' });
                const json = await res.json();
                const items = json.data || [];

                if (items.length === 0) return undefined;

                const item = items[0];
                return {
                    id: item.documentId,
                    title: item.title,
                    slug: item.slug,
                    excerpt: item.excerpt,
                    content: item.content, // Blocks JSON or text
                    date: item.date,
                    readingTime: item.readingTime,
                    tags: item.tags || [],
                    featured: item.featured,
                    image: getStrapiMedia(item.coverImage?.url || item.coverImageUrl),
                    author: {
                        name: item.author?.name || 'Datify Team',
                        role: item.author?.role || 'Contributor',
                        image: getStrapiMedia(item.author?.avatar?.url || item.author?.avatarUrl)
                    }
                };
            } catch (error) {
                console.error(`Failed to fetch blog post ${slug}:`, error);
                return BLOG_POSTS.find(p => p.slug === slug);
            }
        }
    }
};
