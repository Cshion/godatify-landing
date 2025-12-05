import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
    metadataBase: new URL('https://godatify.com'),
    robots: {
        index: false,
        follow: false,
    },
    title: {
        default: "Datify – Datificando las organizaciones",
        template: "%s | Datify"
    },
    description: "En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden.",
    keywords: ["data analytics", "business intelligence", "big data", "data engineering", "digital platform", "datify", "consultoría de datos", "transformación digital"],
    authors: [{ name: "Datify", url: "https://godatify.com" }],
    creator: "Datify",
    publisher: "Datify",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: '/',
        languages: {
            'es-ES': '/es',
        },
    },
    verification: {
        google: 'google-site-verification=YOUR_VERIFICATION_CODE',
    },
    category: 'technology',
    classification: 'Data Consultancy',
    icons: {
        icon: [
            { url: '/images/favicon.png', type: 'image/png' },
            { url: '/favicon.ico', sizes: 'any' },
        ],
        apple: '/images/favicon.png',
    },
    openGraph: {
        title: "Datify – Datificando las organizaciones",
        description: "Te acompañamos en cada paso para transformar tus datos en decisiones que impulsen el crecimiento de tu organización.",
        url: "https://godatify.com",
        siteName: "Datify",
        locale: "es_ES",
        type: "website",
        images: [
            {
                url: '/images/logo.png',
                width: 1200,
                height: 630,
                alt: 'Datify Logo',
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Datify – Datificando las organizaciones",
        description: "Te acompañamos en cada paso para transformar tus datos en decisiones que impulsen el crecimiento de tu organización.",
        images: ['/images/logo.png'],
    },
};
