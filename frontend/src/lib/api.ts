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
    ContactPageContent,
    BlogPost
} from '@/types';
import qs from 'qs';

// Static navigation links - these rarely change and are intentionally not from CMS
export const NAV_LINKS: NavLink[] = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/industrias', label: 'Industrias' },
    { href: '/casos', label: 'Casos de éxito' },
    { href: '/blog', label: 'Blog' },
];

export const FOOTER_LINKS: FooterLinks = {
    quickLinks: [
        { href: '/', label: 'Inicio' },
        { href: '/nosotros', label: 'Nosotros' },
        { href: '/industrias', label: 'Industrias' },
        { href: '/casos', label: 'Casos de éxito' },
    ],
    services: [
        { href: '/servicios/digital-platform', label: 'Digital Platform' },
        { href: '/servicios/data-engineering', label: 'Data Engineering' },
        { href: '/servicios/big-data-management', label: 'Big Data Management' },
        { href: '/servicios/business-intelligence', label: 'Business Intelligence' },
        { href: '/servicios/business-analytics', label: 'Business Analytics' },
    ],
    contact: [
        { href: '/contacto', label: 'Contacto' },
        { href: 'https://www.linkedin.com/company/godatify/', label: 'LinkedIn' },
        { href: '#', label: 'Términos y Políticas' },
    ],
};



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
            // Parallel fetch for Company Info and Services Nav
            const [infoRes, servicesRes, socialRes] = await Promise.all([
                fetch(`${STRAPI_URL}/api/company-info`, {
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store'
                }),
                fetch(`${STRAPI_URL}/api/services?fields[0]=title&fields[1]=slug&fields[2]=description&pagination[limit]=20`, {
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store'
                }),
                fetch(`${STRAPI_URL}/api/social-links`, {
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store'
                })
            ]);

            if (!infoRes.ok) throw new Error(`Failed to fetch company info: ${infoRes.status}`);
            if (!servicesRes.ok) throw new Error(`Failed to fetch services: ${servicesRes.status}`);

            const [infoJson, servicesJson, socialJson] = await Promise.all([
                infoRes.json(),
                servicesRes.json(),
                socialRes.ok ? socialRes.json() : { data: [] }
            ]);

            const info = infoJson.data;
            const servicesData = servicesJson.data || [];

            if (!info) throw new Error('Company info not found in Strapi');

            // Process Company Info
            const companyInfo: CompanyInfo = {
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
            };

            // Process Services Nav
            const servicesNav: ServiceNav[] = servicesData.map((s: any) => ({
                title: s.title,
                slug: s.slug,
                description: s.description || ''
            }));

            // Process Social Links
            const socialLinks: SocialLink[] = (socialJson.data || []).map((item: any) => ({
                id: item.slug || item.id,
                icon: item.icon,
                url: item.url,
                label: item.label,
            }));

            // Fetch Sectors for Header
            const sectors = await api.industries.getSectors();

            // Section labels from home page
            const homeRes = await fetch(`${STRAPI_URL}/api/home-page`, { cache: 'no-store' });
            const homeJson = homeRes.ok ? await homeRes.json() : { data: null };
            const sectionLabels = homeJson.data?.sectionLabels || {};

            return {
                companyInfo,
                servicesNav,
                sectorsNav: sectors,
                navLinks: NAV_LINKS,
                socialLinks,
                footerLinks: FOOTER_LINKS,
                sectionLabels
            };
        },
        getSocialLinks: async (): Promise<SocialLink[]> => {
            const res = await fetch(`${STRAPI_URL}/api/social-links`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed to fetch social links: ${res.status}`);
            const json = await res.json();
            return (json.data || []).map((item: any) => ({
                id: item.slug || item.id,
                icon: item.icon,
                url: item.url,
                label: item.label,
            }));
        }
    },
    home: {
        getData: async (): Promise<{
            hero: HeroContent;
            stats: Stat[];
            videoConfig: VideoConfig;
            sectionImageUrl: string | null;
            carouselConfig: CarouselConfig;
            sectionLabels: any;
            clients: Client[];
            services: Service[];
            cases: CaseStudy[];
            testimonials: Testimonial[];
        }> => {
            // Parallel fetch for Home Page components
            const [homePageRes, testimonialsRes, servicesRes, casesRes, clientsRes] = await Promise.all([
                fetch(`${STRAPI_URL}/api/home-page`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/testimonials?pagination[limit]=6&populate=*`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/services?fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=icon&pagination[limit]=10`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/case-studies?sort[0]=publishedAt:desc&sort[1]=slug:asc&pagination[limit]=6&fields[0]=slug&fields[1]=title&fields[2]=description&fields[3]=mainImageUrl`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/clients?fields[0]=name&fields[1]=logoUrl&pagination[limit]=20`, { cache: 'no-store' })
            ]);

            if (!homePageRes.ok) throw new Error(`Failed to fetch home page: ${homePageRes.status}`);

            const [homePageJson, testimonialsJson, servicesJson, casesJson, clientsJson] = await Promise.all([
                homePageRes.json(),
                testimonialsRes.json(),
                servicesRes.json(),
                casesRes.json(),
                clientsRes.json()
            ]);

            const homeData = homePageJson.data;
            if (!homeData) throw new Error('Home page data not found in Strapi');

            const hero: HeroContent = {
                title: homeData.heroTitle,
                subtitle: homeData.heroSubtitle,
                ctaText: homeData.heroCtaText,
                ctaHref: homeData.heroCtaHref,
                scrollText: homeData.heroScrollText ?? '',
                backgroundImage: homeData.heroBackgroundImageUrl || '/images/hero-bg.jpg',
                gradient: homeData.heroGradient || 'linear-gradient(90deg, rgba(19, 92, 81, 0.85) 0%, rgba(19, 92, 81, 0.6) 50%, rgba(19, 92, 81, 0.4) 100%)',
            };

            const stats: Stat[] = homeData.stats || [];
            const videoConfig: VideoConfig = homeData.videoConfig || { url: '', title: '', caption: '' };
            const sectionImageUrl: string | null = homeData.sectionImageUrl || null;
            const carouselConfig: CarouselConfig = homeData.carouselConfig || { cardsPerView: 3, autoPlayInterval: 5000 };
            const sectionLabels = homeData.sectionLabels || {};

            // Process Testimonials
            const testimonials: Testimonial[] = (testimonialsJson.data || []).map((item: any) => ({
                quote: item.testimonialQuote || item.quote,
                author: item.author,
                role: item.role,
                linkedIn: item.linkedIn,
                image: item.authorImageUrl || '/images/placeholder.png'
            }));

            // Process Services
            const services: Service[] = (servicesJson.data || []).map((item: any) => ({
                id: item.documentId,
                slug: item.slug,
                title: item.title,
                description: item.description,
                icon: item.icon
            }));

            // Process Cases
            const cases: CaseStudy[] = (casesJson.data || []).map((item: any) => ({
                slug: item.slug,
                title: item.title,
                industry: 'Caso de Éxito',
                description: item.description,
                image: item.mainImageUrl || '/images/placeholder.png',
            }));

            // Process Clients
            const clients: Client[] = (clientsJson.data || []).map((item: any) => ({
                name: item.name,
                logo: item.logoUrl || '/images/placeholder.png',
                anonymous: false
            }));

            return {
                hero,
                stats,
                videoConfig,
                sectionImageUrl,
                carouselConfig,
                sectionLabels,
                clients,
                services,
                cases,
                testimonials
            };
        },
    },
    services: {

        getDetailPageData: async (slug: string): Promise<{ service: Service | undefined, relatedCases: CaseStudy[] }> => {
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
                cache: 'no-store'
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch service: ${res.status}`);
            }

            const json = await res.json();
            const item = json.data && json.data.length > 0 ? json.data[0] : null;

            if (!item) {
                return { service: undefined, relatedCases: [] };
            }

            const service: Service = {
                id: item.documentId,
                slug: item.slug,
                title: item.title,
                subtitle: item.subtitle,
                description: item.description,
                icon: item.icon,
                backgroundImage: item.bgImageUrl,
                phrases: item.phrases || [],
                features: item.features || [],
                methodology: item.methodology || [],
                techStack: item.techStack || []
            };

            const relatedCases: CaseStudy[] = (item.case_studies || []).slice(0, 3).map((c: any) => ({
                slug: c.slug,
                title: c.title,
                description: c.description,
                image: c.mainImageUrl || '/images/placeholder.png',
                industry: c.industryName || 'General',
                results: c.results || []
            }));

            return { service, relatedCases };
        },
        getAll: async (): Promise<Service[]> => {
            const queryParams = qs.stringify({
                fields: ['title', 'slug', 'description', 'updatedAt'],
                pagination: { limit: 100 }
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/services?${queryParams}`, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            });
            
            if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
            
            const json = await res.json();
            const services = json.data || [];

            return services.map((s: any) => ({
                id: s.documentId,
                slug: s.slug,
                title: s.title,
                description: s.description,
                updatedAt: s.updatedAt
            }));
        }
    },
    cases: {
        getPageData: async (): Promise<{ hero: any, cases: CaseStudy[] }> => {
            const [pageRes, casesRes] = await Promise.all([
                fetch(`${STRAPI_URL}/api/cases-page`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/case-studies?${qs.stringify({
                    sort: ['publishedAt:desc'],
                    pagination: { limit: 50 },
                    populate: '*',
                }, { encodeValuesOnly: true })}`, { cache: 'no-store' })
            ]);

            if (!pageRes.ok) throw new Error(`Failed to fetch cases page: ${pageRes.status}`);
            
            const [pageJson, casesJson] = await Promise.all([
                pageRes.json(),
                casesRes.json()
            ]);
            
            const pageData = pageJson.data;
            const items = casesJson.data || [];

            if (!pageData) throw new Error('Cases page data not found in Strapi');

            const hero = {
                title: pageData.heroTitle,
                subtitle: pageData.heroSubtitle,
                backgroundImage: pageData.heroBackgroundImageUrl || '/images/hero-cases.png',
                phrases: pageData.heroPhrases || []
            };

            const cases: CaseStudy[] = items.map((item: any) => ({
                slug: item.slug,
                title: item.title,
                industry: item.industry?.title || item.industryName || 'General',
                description: item.description,
                image: item.mainImageUrl || '/images/placeholder.png',
                results: item.results || [],
                client: {
                    name: item.clientName || 'Anonymous',
                    logo: item.clientLogoUrl || '/images/placeholder.png',
                    anonymous: !item.clientName
                }
            }));

            return { hero, cases };
        },
        getDetailPageData: async (slug: string): Promise<{ caseStudy: CaseStudy | undefined, relatedCases: CaseStudy[] }> => {
            const caseQuery = qs.stringify({
                filters: { slug: { $eq: slug } },
                populate: '*'
            }, { encodeValuesOnly: true });

            const recentQuery = qs.stringify({
                sort: ['publishedAt:desc'],
                pagination: { limit: 4 },
                fields: ['slug', 'title', 'description', 'mainImageUrl', 'industryName', 'results'],
                populate: ['industry']
            }, { encodeValuesOnly: true });

            const [caseRes, recentRes] = await Promise.all([
                fetch(`${STRAPI_URL}/api/case-studies?${caseQuery}`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/case-studies?${recentQuery}`, { cache: 'no-store' })
            ]);

            if (!caseRes.ok) throw new Error(`Failed to fetch case study: ${caseRes.status}`);

            const [caseJson, recentJson] = await Promise.all([
                caseRes.json(),
                recentRes.json()
            ]);

            const items = caseJson.data || [];
            const recentAll = recentJson.data || [];

            if (items.length === 0) return { caseStudy: undefined, relatedCases: [] };

            const item = items[0];
            const caseStudy: CaseStudy = {
                slug: item.slug,
                title: item.title,
                industry: item.industry?.title || item.industryName || 'General',
                description: item.description,
                results: item.results || [],
                techStack: item.techStack || [],
                image: item.mainImageUrl || '/images/placeholder.png',
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
                content: item.content || null
            };

            const recent = recentAll.filter((r: any) => r.slug !== slug).slice(0, 3);

            const relatedCases: CaseStudy[] = recent.map((r: any) => ({
                slug: r.slug,
                title: r.title,
                description: r.description,
                image: r.mainImageUrl || '/images/placeholder.png',
                industry: r.industry?.title || r.industryName || 'General',
                results: r.results || []
            }));

            return { caseStudy, relatedCases };
        },
        getCases: async ({ start, limit }: { start: number; limit: number }): Promise<{ cases: CaseStudy[]; total: number }> => {
            const queryParams = qs.stringify({
                sort: ['publishedAt:desc', 'slug:asc'],
                pagination: { start, limit },
                populate: '*',
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/case-studies?${queryParams}`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch cases: ${res.status}`);
            
            const json = await res.json();
            const items = json.data || [];
            const total = json.meta?.pagination?.total || 0;

            const cases: CaseStudy[] = items.map((item: any) => ({
                slug: item.slug,
                title: item.title,
                industry: item.industry?.title || item.industryName || 'General',
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
        },
        getAll: async (): Promise<CaseStudy[]> => {
            const queryParams = qs.stringify({
                fields: ['slug', 'updatedAt'],
                pagination: { limit: 100 }
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/case-studies?${queryParams}`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch all cases: ${res.status}`);
            
            const json = await res.json();

            return (json.data || []).map((c: any) => ({
                slug: c.slug,
                updatedAt: c.updatedAt,
                title: 'Sitemap Placeholder',
                industry: 'General',
                description: '',
                results: [],
                techStack: [],
                image: '',
                client: { name: '', anonymous: false },
                content: []
            } as CaseStudy));
        }
    },
    industries: {
        getPageData: async (): Promise<{ hero: any, sectors: Sector[], cases: CaseStudy[] }> => {
            const [sectorsRes, pageRes, casesRes] = await Promise.all([
                api.industries.getSectors(),
                fetch(`${STRAPI_URL}/api/industries-page`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/case-studies?pagination[limit]=20&populate=*`, { cache: 'no-store' })
            ]);

            if (!pageRes.ok) throw new Error(`Failed to fetch industries page: ${pageRes.status}`);

            const pageJson = await pageRes.json();
            const casesJson = await casesRes.json();

            const sectors = sectorsRes;
            const pageData = pageJson.data;
            const casesData = casesJson.data || [];

            if (!pageData) throw new Error('Industries page data not found in Strapi');

            const hero = {
                title: pageData.heroTitle,
                subtitle: pageData.heroSubtitle,
                description: pageData.heroDescription || '',
                phrases: pageData.heroPhrases || [],
                backgroundImage: pageData.heroBackgroundImageUrl || '/images/hero-industries.png'
            };

            const cases: CaseStudy[] = casesData.map((item: any) => ({
                slug: item.slug,
                title: item.title,
                industry: item.industryName || 'General',
                description: item.description,
                image: item.mainImageUrl || '/images/placeholder.png',
            }));

            return { hero, sectors, cases };
        },
        getSectors: async (): Promise<Sector[]> => {
            const queryParams = qs.stringify({
                populate: {
                    industries: {
                        fields: ['title', 'slug', 'description']
                    }
                },
                sort: ['title:asc']
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/sectors?${queryParams}`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch sectors: ${res.status}`);
            
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
        },
        getIndustryBySlug: async (slug: string): Promise<{ industry: Industry | undefined, relatedCases: CaseStudy[] }> => {
            const queryParams = qs.stringify({
                filters: { slug: { $eq: slug } },
                populate: {
                    sector: { fields: ['title', 'slug'] },
                    image: true
                }
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/industries?${queryParams}`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch industry: ${res.status}`);
            
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

            // Fetch Related Cases for this specific industry
            const casesQuery = qs.stringify({
                filters: { industryName: { $eq: industry.title } },
                populate: '*',
                pagination: { limit: 3 }
            }, { encodeValuesOnly: true });

            const casesRes = await fetch(`${STRAPI_URL}/api/case-studies?${casesQuery}`, { cache: 'no-store' });
            const casesJson = await casesRes.json();

            const relatedCases: CaseStudy[] = (casesJson.data || []).map((c: any) => ({
                slug: c.slug,
                title: c.title,
                description: c.description,
                image: c.mainImageUrl || '/images/placeholder.png',
                industry: c.industryName || 'General',
                results: c.results || []
            }));

            return { industry, relatedCases };
        }
    },
    about: {
        getContent: async (): Promise<NosotrosContent & {
            clients: Client[];
            sectionLabels: any;
        }> => {
            const clientsQuery = qs.stringify({
                fields: ['name', 'logoUrl'],
                pagination: { limit: 50 }
            }, { encodeValuesOnly: true });

            const [aboutRes, clientsRes, homeRes] = await Promise.all([
                fetch(`${STRAPI_URL}/api/about-page`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/clients?${clientsQuery}`, { cache: 'no-store' }),
                fetch(`${STRAPI_URL}/api/home-page`, { cache: 'no-store' })
            ]);

            if (!aboutRes.ok) throw new Error(`Failed to fetch about page: ${aboutRes.status}`);

            const [aboutJson, clientsJson, homeJson] = await Promise.all([
                aboutRes.json(),
                clientsRes.json(),
                homeRes.ok ? homeRes.json() : { data: null }
            ]);

            const aboutData = aboutJson.data;
            if (!aboutData) throw new Error('About page data not found in Strapi');

            const clientItems = clientsJson.data || [];
            const homeData = homeJson.data;

            const clients: Client[] = clientItems.map((item: any) => ({
                name: item.name,
                logo: item.logoUrl || '/images/placeholder.png',
                anonymous: false
            }));

            const content: NosotrosContent = {
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
                values: aboutData.values || [],
                culture: {
                    title: aboutData.cultureTitle,
                    description: aboutData.cultureDescription,
                    stats: aboutData.cultureStats || [],
                    image: aboutData.cultureImageUrl || '/images/placeholder.png'
                },
                tabs: aboutData.tabs || [],
                sectionImageUrl: aboutData.sectionImageUrl || '/images/nosotros-quienes.webp'
            };

            return {
                ...content,
                clients,
                sectionLabels: homeData?.sectionLabels || {}
            };
        }
    },
    contact: {
        getPageContent: async (): Promise<ContactPageContent> => {
            const res = await fetch(`${STRAPI_URL}/api/contact-page`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch contact page: ${res.status}`);
            
            const json = await res.json();
            const data = json.data;

            if (!data) throw new Error('Contact page data not found in Strapi');

            return {
                hero: {
                    title: data.heroTitle,
                    subtitle: data.heroSubtitle
                },
                officesSection: {
                    title: data.officesTitle,
                    subtitle: data.officesSubtitle,
                    offices: data.offices || []
                },
                form: {
                    title: data.formTitle,
                    subtitle: data.formSubtitle,
                    labels: data.formLabels || {
                        name: 'Nombre',
                        email: 'Correo electrónico',
                        phone: 'Teléfono',
                        company: 'Empresa',
                        message: 'Mensaje',
                        submit: 'Enviar mensaje',
                        sending: 'Enviando...'
                    }
                }
            };
        },
    },

    blog: {
        getPageData: async (): Promise<{ hero: { title: string; subtitle: string; description: string } }> => {
            const res = await fetch(`${STRAPI_URL}/api/blog-page`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch blog page: ${res.status}`);
            
            const json = await res.json();
            const pageData = json.data;
            
            if (!pageData) throw new Error('Blog page data not found in Strapi');
            
            return {
                hero: {
                    title: pageData.heroTitle,
                    subtitle: pageData.heroSubtitle,
                    description: pageData.heroDescription
                }
            };
        },
        getPosts: async ({ start, limit }: { start: number; limit: number }): Promise<{ posts: BlogPost[]; total: number }> => {
            const queryParams = qs.stringify({
                sort: ['date:desc', 'slug:asc'],
                populate: ['author.avatar', 'coverImage'],
                fields: ['title', 'slug', 'excerpt', 'date', 'readingTime', 'tags', 'featured', 'coverImageUrl'],
                pagination: { start, limit }
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/blog-posts?${queryParams}`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch blog posts: ${res.status}`);
            
            const json = await res.json();
            const items = json.data || [];
            const total = json.meta?.pagination?.total || 0;

            const posts: BlogPost[] = items.map((item: any) => ({
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
        },
        getAll: async (): Promise<BlogPost[]> => {
            const queryParams = qs.stringify({
                sort: ['date:desc'],
                populate: ['author.avatar', 'coverImage'],
                fields: ['title', 'slug', 'excerpt', 'date', 'readingTime', 'tags', 'featured', 'coverImageUrl']
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/blog-posts?${queryParams}`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch all blog posts: ${res.status}`);
            
            const json = await res.json();
            const items = json.data || [];

            return items.map((item: any) => ({
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
        },
        getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
            const queryParams = qs.stringify({
                filters: { slug: { $eq: slug } },
                populate: ['author.avatar', 'coverImage'],
                fields: ['title', 'slug', 'excerpt', 'date', 'readingTime', 'tags', 'featured', 'content', 'coverImageUrl']
            }, { encodeValuesOnly: true });

            const res = await fetch(`${STRAPI_URL}/api/blog-posts?${queryParams}`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Failed to fetch blog post: ${res.status}`);
            
            const json = await res.json();
            const items = json.data || [];

            if (items.length === 0) return undefined;

            const item = items[0];
            return {
                id: item.documentId,
                title: item.title,
                slug: item.slug,
                excerpt: item.excerpt,
                content: item.content,
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
        }
    }
};
