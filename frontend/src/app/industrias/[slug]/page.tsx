import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import IndustryDetail from '@/components/industrias/IndustryDetail';
import Cases from '@/components/sections/Cases';
import Clients from '@/components/sections/Clients';
import BlogCTA from '@/components/blog/BlogCTA';
import { generateBreadcrumbSchema } from '@/lib/schemas';
import styles from '@/components/industrias/IndustryDetail.module.css';

interface IndustryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const { industry } = await api.industries.getIndustryBySlug(slug);

    if (!industry) {
        return {
            title: 'Industria no encontrada | Datify',
        };
    }

    return {
        title: `${industry.title} - Data Analytics | Datify`,
        description: industry.description,
        alternates: {
            canonical: `/industrias/${slug}`,
        },
        openGraph: {
            title: `${industry.title} | Datify`,
            description: industry.description,
            images: [industry.image],
        },
    };
}

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
    const { slug } = await params;
    const { industry, relatedCases } = await api.industries.getIndustryBySlug(slug);
    const { clients } = await api.home.getData();

    if (!industry) {
        notFound();
    }

    return (
        <main id="main-content" className="bg-white min-h-screen">
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBreadcrumbSchema([
                        { name: 'Inicio', url: 'https://godatify.com/' },
                        { name: 'Industrias', url: 'https://godatify.com/industrias' },
                        { name: industry.title }
                    ]))
                }}
            />
            
            {/* Industry Detail Component */}
            <IndustryDetail industry={industry} />

            {/* Related Cases */}
            {relatedCases.length > 0 && (
                <div className={styles.casesWrapper}>
                    <Cases
                        cases={relatedCases}
                        title={`Impacto Real en ${industry.title}`}
                        buttonText="Ver Historia"
                    />
                </div>
            )}

            {/* Clients */}
            <div className={styles.clientsWrapper}>
                <Clients
                    clients={clients}
                    title="Líderes de la industria que confían en nosotros"
                />
            </div>

            {/* CTA */}
            <div className={styles.ctaWrapper}>
                <BlogCTA
                    title="¿Listo para revolucionar su sector?"
                    description="Converse con nuestros expertos y descubra cómo Datify puede potenciar el crecimiento de su organización hoy mismo."
                    buttonText="Hablemos Hoy"
                    link="/contacto"
                />
            </div>
        </main>
    );
}
