/**
 * JSON-LD Schema helpers for SEO
 * These schemas help search engines understand site structure and content
 */

import { BlogPost, CaseStudy, CompanyInfo, Industry, Service, SocialLink } from '@/types';
import { SITE_URL } from '@/lib/seo';

const SITE_NAME = 'Datify';
const LOGO_URL = `${SITE_URL}/images/logo.png`;

// Default contact info (fallback if not provided from CMS)
const DEFAULT_CONTACT = {
  phone: '+51-1-7621-8900',
  email: 'contacto@godatify.com',
};

// Default social links (fallback if not provided from CMS)
const DEFAULT_SOCIAL_LINKS = [
  'https://www.linkedin.com/company/godatify/',
  'https://www.facebook.com/godatify',
  'https://www.instagram.com/godatify/',
];

// Helper to extract URLs from social links
const getSocialUrls = (socialLinks?: SocialLink[]): string[] =>
  socialLinks?.map((link) => link.url) || DEFAULT_SOCIAL_LINKS;

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
 * @param companyInfo - Optional company info from CMS (falls back to defaults)
 * @param socialLinks - Optional social links from CMS
 */
export function generateOrganizationSchema(companyInfo?: CompanyInfo, socialLinks?: SocialLink[]) {
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
    description: companyInfo?.description || 'Consultoría especializada en Data Analytics, Business Intelligence y Transformación Digital para empresas en LATAM.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lima',
      addressCountry: 'PE',
    },
    sameAs: getSocialUrls(socialLinks),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: companyInfo?.phone || DEFAULT_CONTACT.phone,
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
 * @param companyInfo - Optional company info from CMS (falls back to defaults)
 * @param socialLinks - Optional social links from CMS
 */
export function generateLocalBusinessSchema(companyInfo?: CompanyInfo, socialLinks?: SocialLink[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    image: LOGO_URL,
    url: SITE_URL,
    telephone: companyInfo?.phone || DEFAULT_CONTACT.phone,
    email: companyInfo?.email || DEFAULT_CONTACT.email,
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
    sameAs: getSocialUrls(socialLinks),
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

/**
 * CaseStudy/Article schema for case study pages
 * Provides rich snippets for case studies in search results
 */
export function generateCaseStudySchema(caseStudy: CaseStudy, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/casos/${slug}#casestudy`,
    headline: caseStudy.title,
    description: caseStudy.description,
    image: caseStudy.image?.startsWith('http')
      ? caseStudy.image
      : `${SITE_URL}${caseStudy.image}`,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/casos/${slug}`,
    },
    articleSection: caseStudy.industry,
    keywords: caseStudy.techStack?.join(', '),
    inLanguage: 'es',
  };
}

/**
 * FAQ schema for pages with Q&A content
 * Enables "People Also Ask" rich snippets in search results
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Industry/ProfessionalService schema for industry pages
 * Provides rich snippets for industry-specific service offerings
 */
export function generateIndustrySchema(industry: Industry, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/industrias/${slug}#industry`,
    name: `Soluciones Data Analytics para ${industry.title}`,
    description: industry.description,
    image: industry.image?.startsWith('http')
      ? industry.image
      : `${SITE_URL}${industry.image}`,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -12.0464,
        longitude: -77.0428,
      },
      geoRadius: '5000',
    },
    serviceType: `Data Analytics - ${industry.title}`,
    url: `${SITE_URL}/industrias/${slug}`,
  };
}
