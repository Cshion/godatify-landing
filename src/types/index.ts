export interface SocialLink {
    id: string;
    icon: string;
    url: string;
    label: string;
}

export interface NavLink {
    href: string;
    label: string;
}

export interface ServiceFeature {
    title: string;
    description: string;
}

export interface ServiceMethodologyStep {
    title: string;
    description: string;
}

export interface ServiceTech {
    name: string;
    icon: string;
}

export interface ServiceNav {
    id: string;
    name: string;
}

// Service Type
export interface Service {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    image: string;
    features: ServiceFeature[];
    methodology: ServiceMethodologyStep[];
    techStack: ServiceTech[];
}

export interface CaseResult {
    label: string;
    value: string;
    suffix: string;
}

export interface Client {
    name: string;
    logo?: string;
    website?: string;
    anonymous?: boolean;
}

export interface Testimonial {
    quote: string;
    author: string;
    role: string;
    linkedIn?: string;
}

export interface CaseStudy {
    slug: string;
    title: string;
    industry: string;
    relatedIndustryId?: string;
    description: string;
    challenge: string;
    solution: string;
    results: CaseResult[];
    techStack: string[];
    image: string;
    videoUrl?: string;
    client: Client;
    testimonial?: Testimonial;
    content: string;
}

export interface IndustryStats {
    label: string;
    value: string;
}

export interface Industry {
    id: string;
    title: string;
    description: string;
    image: string;
    stats: IndustryStats[];
    projects: string[];
}

export interface CompanyInfo {
    name: string;
    description: string;
    email: string;
    website: string;
}

export interface HeroContent {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    scrollText: string;
}

export interface Stat {
    target: number;
    label: string;
}

export interface VideoConfig {
    url: string;
    title: string;
    caption: string;
}

export interface CarouselConfig {
    cardsPerView: number;
    autoPlayInterval: number;
}

export interface Value {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface CultureStat {
    value: string;
    label: string;
}

export interface NosotrosContent {
    hero: {
        title: string;
        subtitle: string;
        description: string;
    };
    mission: {
        title: string;
        text: string;
    };
    vision: {
        title: string;
        text: string;
    };
    values: Value[];
    culture: {
        title: string;
        description: string;
        stats: CultureStat[];
    };
}

export interface FooterLinks {
    quickLinks: NavLink[];
    services: NavLink[];
    contact: NavLink[];
}
