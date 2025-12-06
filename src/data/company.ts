import { SocialLink, NavLink, FooterLinks, CompanyInfo } from '@/types';

// Social Media Links
export const SOCIAL_LINKS: SocialLink[] = [
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
];

// Navigation Links
export const NAV_LINKS: NavLink[] = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/industrias', label: 'Industrias' },
    { href: '/casos', label: 'Casos de éxito' },
];

// Footer Links
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

// Company Info
export const COMPANY_INFO: CompanyInfo = {
    name: 'DATIFY',
    description: 'En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden.',
    email: 'contacto@godatify.com',
    website: 'https://godatify.com',
    logo: {
        url: '/images/logo.png',
        alt: 'Datify Logo',
        width: 120,
        height: 40
    }
};
