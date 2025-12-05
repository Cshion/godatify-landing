// Social Media Links
export const SOCIAL_LINKS = [
    {
        id: 'linkedin',
        icon: 'linkedin-in',
        url: 'https://www.linkedin.com/company/godatify/',
        label: 'LinkedIn'
    },
    {
        id: 'facebook',
        icon: 'facebook-f',
        url: 'https://www.facebook.com/godatify',
        label: 'Facebook'
    },
    {
        id: 'instagram',
        icon: 'instagram',
        url: 'https://www.instagram.com/godatify/',
        label: 'Instagram'
    },
    {
        id: 'youtube',
        icon: 'youtube',
        url: 'https://godatify.com',
        label: 'YouTube'
    },
] as const;

// Navigation Links
export const NAV_LINKS = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#industrias', label: 'Industrias' },
    { href: '#casos', label: 'Casos de éxito' },
    { href: '#blog', label: 'Blog' },
    { href: '#contacto', label: 'Contacto' },
] as const;

// Services for Dropdown
export const SERVICES_NAV = [
    { id: 'bd', name: 'Big Data Management (BD)' },
    { id: 'ba', name: 'Business Analytics (BA)' },
    { id: 'bi', name: 'Business Intelligence (BI)' },
    { id: 'de', name: 'Data Engineering (DE)' },
    { id: 'dp', name: 'Digital Platform (DP)' },
] as const;

// Footer Links
export const FOOTER_LINKS = {
    quickLinks: [
        { href: '#inicio', label: 'Inicio' },
        { href: '#nosotros', label: 'Nosotros' },
        { href: '#servicios', label: 'Servicios' },
        { href: '#casos', label: 'Casos de éxito' },
    ],
    services: [
        { href: '#dp', label: 'Digital Platform' },
        { href: '#de', label: 'Data Engineering' },
        { href: '#bd', label: 'Big Data Management' },
        { href: '#bi', label: 'Business Intelligence' },
        { href: '#ba', label: 'Business Analytics' },
    ],
    contact: [
        { href: '#blog', label: 'Blog' },
        { href: '#contacto', label: 'Contacto' },
        { href: '#', label: 'Términos y Políticas' },
    ],
} as const;

// Company Info
export const COMPANY_INFO = {
    name: 'DATIFY',
    description: 'En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden.',
    email: 'contacto@godatify.com',
    website: 'https://godatify.com',
} as const;

// Hero Content
export const HERO_CONTENT = {
    title: 'Datificando las Organizaciones',
    subtitle: 'En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden. Nos convertimos en sus aliados estratégicos para lograr mayor eficiencia, agilidad y crecimiento sostenido a partir del valor de sus datos.',
    ctaText: 'Contáctanos',
    ctaHref: '#contacto',
    scrollText: 'Descubre más',
} as const;

// Stats
export const STATS = [
    { target: 150, label: 'Proyectos' },
    { target: 10, label: 'Años de Experiencia' },
    { target: 100, label: 'Clientes Satisfechos' },
] as const;

// Video
export const VIDEO_CONFIG = {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Video Introductorio Datify',
    caption: 'Descubre cómo transformamos datos en decisiones',
} as const;

// Carousel Settings
export const CAROUSEL_CONFIG = {
    cardsPerView: 3,
    autoPlayInterval: 5000,
} as const;
