import type { Metadata } from 'next';

import ScrollReveal from '@/components/ui/ScrollReveal';
import NosotrosHero from '@/components/nosotros/NosotrosHero';
import NosotrosTabs from '@/components/nosotros/NosotrosTabs';
import Clients from '@/components/sections/Clients';
import PartnerLogos from '@/components/common/PartnerLogos';
import Testimonials from '@/components/sections/Testimonials';
import { generateBreadcrumbSchema } from '@/lib/schemas';

import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
    const content = await api.about.getContent();
    return {
        title: 'Nosotros - Expertos en Data Analytics | Datify',
        description: 'Conoce al equipo de Datify, tu aliado estratégico en transformación de datos. Descubre nuestra misión, visión y valores. →',
        alternates: {
            canonical: '/nosotros',
        },
        openGraph: {
            title: 'Nosotros - Expertos en Data Analytics | Datify',
            description: 'Conoce al equipo de Datify, tu aliado estratégico en transformación de datos. Descubre nuestra misión, visión y valores.',
            url: 'https://godatify.com/nosotros',
            type: 'website',
            images: [{ url: 'https://godatify.com/images/og-image.png', width: 1200, height: 630 }],
        },
    };
}

export default async function NosotrosPage() {
    const content = await api.about.getContent();
    const homeData = await api.home.getData();
    const { videoConfig, sectionLabels } = content;

    return (
        <>
            <main id="main-content">
                {/* Breadcrumb Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(generateBreadcrumbSchema([
                            { name: 'Inicio', url: 'https://godatify.com/' },
                            { name: 'Nosotros' }
                        ]))
                    }}
                />
                
                <NosotrosHero hero={content.hero} />
                <NosotrosTabs content={content} videoConfig={videoConfig} />
                <Clients clients={content.clients} title={sectionLabels.clients.title} />
                <PartnerLogos />
                <Testimonials 
                    testimonials={homeData.testimonials}
                    carouselConfig={homeData.carouselConfig}
                    title={homeData.sectionLabels?.testimonials?.title ?? 'Testimonios'}
                    subtitle={homeData.sectionLabels?.testimonials?.subtitle ?? 'NUESTROS CLIENTES'}
                    description={homeData.sectionLabels?.testimonials?.description ?? ''}
                />
            </main>
            <ScrollReveal />

            {/* Font Awesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}
