import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { defaultMetadata } from "@/lib/seo";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/schemas";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

// Initialize FontAwesome library
import "@/lib/fontawesome";

import "./globals.css";

const barlow = Barlow({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await api.company.getGlobalData();

  const { navLinks, socialLinks, companyInfo, servicesNav, sectorsNav, footerLinks, sectionLabels } = globalData;
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        {/* Preload hero background - mobile */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-bg-mobile.webp"
          media="(max-width: 768px)"
          fetchPriority="high"
        />
        {/* Preload hero background - desktop */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-bg.webp"
          media="(min-width: 769px)"
          fetchPriority="high"
        />
      </head>
      <body className={`${barlow.variable} antialiased`}>
        {/* Skip to main content link for accessibility (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-[#0D5C3B] focus:font-semibold focus:shadow-lg"
        >
          Ir al contenido principal
        </a>

        {/* WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteSchema())
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
        <Header
          navLinks={navLinks}
          socialLinks={socialLinks}
          servicesNav={servicesNav as any}
          sectorsNav={sectorsNav}
          servicesLabel={sectionLabels.header.servicesDropdown}
          logo={companyInfo.logo}
        />
        {children}
        <Footer
          companyInfo={companyInfo}
          footerLinks={footerLinks}
          socialLinks={socialLinks}
          labels={sectionLabels.footer}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
