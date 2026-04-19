import { Metadata } from 'next';
import IndustriesHero from '@/components/industrias/IndustriesHero';
import IndustryShowcase from '@/components/industrias/IndustryShowcase';
import { api } from '@/lib/api';
import { generateBreadcrumbSchema } from '@/lib/schemas';

export async function generateMetadata(): Promise<Metadata> {
    const { hero } = await api.industries.getPageData();
    return {
        title: 'Soluciones por Industria | Datify',
        description: 'Soluciones de Data Analytics personalizadas para tu industria. Retail, Banca, Salud, Manufactura y más. Conoce nuestros casos de éxito. →',
        alternates: {
            canonical: '/industrias',
        },
    };
}

export default async function IndustriasPage() {
    const { hero, sectors, cases } = await api.industries.getPageData();

    return (
        <main>
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBreadcrumbSchema([
                        { name: 'Inicio', url: 'https://godatify.com/' },
                        { name: 'Industrias' }
                    ]))
                }}
            />
            
            <IndustriesHero hero={hero} />
            <IndustryShowcase sectors={sectors} cases={cases} />
        </main>
    );
}
