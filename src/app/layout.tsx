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
  const [navLinks, socialLinks, servicesNav, companyInfo, footerLinks, sectionLabels] = await Promise.all([
    api.company.getNavLinks(),
    api.company.getSocialLinks(),
    api.services.getNav(),
    api.company.getInfo(),
    api.company.getFooterLinks(),
    api.home.getSectionLabels()
  ]);
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${barlow.variable} antialiased`}>
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
