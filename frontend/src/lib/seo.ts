import type { Metadata } from "next";

const siteConfig = {
    name: "Datify",
    url: "https://godatify.com",
    description: "Transformamos datos en decisiones de negocio. Consultoría especializada en Data Analytics, BI y AI para empresas en LATAM. →",
    locale: "es_PE",
};

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    title: {
        default: `${siteConfig.name} – Datificando las Organizaciones`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        "consultoría de datos",
        "data analytics",
        "business intelligence",
        "big data",
        "data engineering",
        "inteligencia artificial",
        "machine learning",
        "transformación digital",
        "análisis de datos Perú",
        "consultora de datos LATAM",
        "BI empresarial",
        "datify",
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: '/',
        languages: {
            'es-PE': '/',
            'es-ES': '/',
        },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
    category: 'technology',
    classification: 'Data Consultancy',
    icons: {
        icon: [
            { url: '/images/favicon.png', type: 'image/png', sizes: '32x32' },
            { url: '/favicon.ico', sizes: 'any' },
        ],
        apple: { url: '/images/favicon.png', sizes: '180x180' },
    },
    openGraph: {
        type: "website",
        locale: siteConfig.locale,
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: `${siteConfig.name} – Datificando las Organizaciones`,
        description: siteConfig.description,
        // TODO: Replace with branded 1200x630 og-image.png when ready
        images: [
            {
                url: `${siteConfig.url}/images/logo-brand-harmonized.png`,
                width: 400,
                height: 400,
                alt: `${siteConfig.name} - Consultoría de Datos`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@godatify",
        creator: "@godatify",
        title: `${siteConfig.name} – Datificando las Organizaciones`,
        description: siteConfig.description,
        // TODO: Replace with branded 1200x630 og-image.png when ready
        images: [`${siteConfig.url}/images/logo-brand-harmonized.png`],
    },
};

/**
 * Helper for generating page-specific metadata with canonical URL
 */
export function generatePageMetadata(
    title: string,
    description: string,
    path: string,
    image?: string
): Metadata {
    const url = `${siteConfig.url}${path}`;
    const ogImage = image || `${siteConfig.url}/images/og-image.png`;

    return {
        title,
        description,
        alternates: {
            canonical: path,
        },
        openGraph: {
            title: `${title} | ${siteConfig.name}`,
            description,
            url,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            title: `${title} | ${siteConfig.name}`,
            description,
            images: [ogImage],
        },
    };
}
