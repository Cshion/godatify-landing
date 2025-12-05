import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Datify – Datificando las organizaciones",
  description: "En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden.",
  keywords: ["data analytics", "business intelligence", "big data", "data engineering", "digital platform", "datify"],
  authors: [{ name: "Datify" }],
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
        {children}
      </body>
    </html>
  );
}
