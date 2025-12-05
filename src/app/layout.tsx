import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

const barlow = Barlow({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
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
        {children}
      </body>
    </html>
  );
}
