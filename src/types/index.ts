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
    logo: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
}

export interface HeroContent {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    scrollText: string;
    backgroundImage: string;
    gradient: string;
    image?: string; // Optional image for hero background or side image
}

export interface SectionLabels {
    services: {
        title: string;
        button: string;
    };
    cases: {
        title: string;
        button: string;
    };
    testimonials: {
        title: string;
    };
    clients: {
        title: string;
    };
    about: {
        title: string;
        button: string;
    };
    header: {
        servicesDropdown: string;
    };
    footer: {
        quickLinks: string;
        services: string;
        contact: string;
        rights: string;
    };
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

export interface TabLabel {
    id: string;
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
        image: string;
    };
    vision: {
        title: string;
        text: string;
        image: string;
    };
    values: Value[];
    culture: {
        title: string;
        description: string;
        stats: CultureStat[];
        image: string;
    };
    tabs: TabLabel[];
}

export interface Office {
    country: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    image?: string;
}

export interface ContactFormLabels {
    name: string;
    email: string;
    company: string;
    role: string;
    message: string;
    submit: string;
}

export interface ContactPageContent {
    hero: {
        title: string;
        subtitle: string;
    };
    officesSection: {
        title: string;
        subtitle: string;
        offices: Office[];
    };
    form: {
        title: string;
        subtitle: string;
        labels: ContactFormLabels;
    };
}

export interface FooterLinks {
    quickLinks: NavLink[];
    services: NavLink[];
    contact: NavLink[];
}
