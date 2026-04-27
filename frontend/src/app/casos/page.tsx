import { Metadata } from 'next';
import CasesHero from '@/components/casos/CasesHero';
import CasesGrid from '@/components/casos/CasesGrid';
import { api } from '@/lib/api';
import { generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/schemas';

export const metadata: Metadata = {
    title: 'Casos de Éxito | Datify',
    description: 'Descubre cómo hemos ayudado a empresas líderes a transformar sus datos en resultados tangibles. Ver casos de éxito en Data Analytics y BI. →',
    alternates: {
        canonical: '/casos',
    },
};

export const revalidate = 3600; // Revalidate every hour

export default async function CasosPage() {
    const { hero } = await api.cases.getPageData();
    const { cases, total } = await api.cases.getCases({ start: 0, limit: 6 });

    return (
        <main id="main-content">
            {/* CollectionPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateCollectionPageSchema(
                        '/casos',
                        'Casos de Éxito | Datify',
                        'Casos de éxito de transformación de datos y Business Intelligence en empresas líderes de LATAM.'
                    ))
                }}
            />
            
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBreadcrumbSchema([
                        { name: 'Inicio', url: 'https://godatify.com/' },
                        { name: 'Casos de Éxito' }
                    ]))
                }}
            />
            
            <CasesHero hero={hero} />
            <CasesGrid cases={cases} initialTotal={total} />
        </main>
    );
}
