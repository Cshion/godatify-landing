import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { defaultMetadata } from "@/lib/seo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${barlow.variable} antialiased`}>
        {/* Skip to main content link for accessibility (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-[#1C7C54] focus:font-semibold focus:shadow-lg"
        >
          Ir al contenido principal
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Datify",
              "url": "https://godatify.com",
              "logo": "https://godatify.com/images/logo.png",
              "sameAs": [
                "https://www.linkedin.com/company/godatify/",
                "https://www.facebook.com/godatify",
                "https://www.instagram.com/godatify/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+51999999999",
                "contactType": "customer service",
                "areaServed": ["PE", "LATAM"],
                "availableLanguage": ["Spanish", "English"]
              }
            })
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
      </body>
    </html>
  );
}
