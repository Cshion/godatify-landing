/**
 * JSON-LD Schema helpers for SEO
 * These schemas help search engines understand site structure and content
 */

import { BlogPost, Service } from '@/types';

const SITE_URL = 'https://godatify.com';
const SITE_NAME = 'Datify';
const LOGO_URL = `${SITE_URL}/images/logo.png`;

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

/**
 * WebSite schema with SearchAction for sitelinks search box
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: 'Consultoría especializada en Data Analytics, Business Intelligence y Transformación Digital para empresas en LATAM.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Enhanced Organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 200,
      height: 60,
    },
    description: 'Consultoría especializada en Data Analytics, Business Intelligence y Transformación Digital para empresas en LATAM.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lima',
      addressCountry: 'PE',
    },
    sameAs: [
      'https://www.linkedin.com/company/godatify/',
      'https://www.facebook.com/godatify',
      'https://www.instagram.com/godatify/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+51-999-999-999',
      contactType: 'customer service',
      areaServed: ['PE', 'LATAM'],
      availableLanguage: ['Spanish', 'English'],
    },
  };
}

/**
 * BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Article/BlogPosting schema for blog posts
 */
export function generateArticleSchema(post: BlogPost, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${slug}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      ...(post.author.image && { image: post.author.image }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    keywords: post.tags.join(', '),
    articleSection: 'Data & AI',
    inLanguage: 'es',
  };
}

/**
 * Service schema for service pages
 */
export function generateServiceSchema(service: Service, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/servicios/${slug}#service`,
    name: service.title,
    description: service.description,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -12.0464,
        longitude: -77.0428,
      },
      geoRadius: '5000',
    },
    serviceType: 'Data Consulting',
    url: `${SITE_URL}/servicios/${slug}`,
  };
}

/**
 * ContactPage schema
 */
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contacto#contactpage`,
    name: 'Contacto - Datify',
    description: 'Contacta con Datify para consultoría de datos y transformación digital.',
    url: `${SITE_URL}/contacto`,
    mainEntity: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

/**
 * LocalBusiness schema for contact page
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    image: LOGO_URL,
    url: SITE_URL,
    telephone: '+51-999-999-999',
    email: 'hola@godatify.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lima',
      addressCountry: 'PE',
    },
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.linkedin.com/company/godatify/',
      'https://www.facebook.com/godatify',
      'https://www.instagram.com/godatify/',
    ],
  };
}

/**
 * CollectionPage schema for listing pages (blog, cases, etc.)
 */
export function generateCollectionPageSchema(
  path: string,
  name: string,
  description: string
) {
  const url = `${SITE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collectionpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'es',
  };
}
