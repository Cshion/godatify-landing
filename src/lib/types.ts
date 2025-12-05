// Service Type
export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

// Case Study Type
export interface CaseStudy {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
}

// Testimonial Type
export interface Testimonial {
    id: number;
    text: string;
    author: string;
    role: string;
}

// Social Link Type
export interface SocialLink {
    id: string;
    icon: string;
    url: string;
    label: string;
}

// Navigation Link Type
export interface NavLink {
    href: string;
    label: string;
}

// Stat Type
export interface Stat {
    target: number;
    current: number;
    label: string;
}
