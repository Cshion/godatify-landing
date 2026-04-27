import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import ServiceHero from '@/components/servicios/ServiceHero';
import ServiceFeatures from '@/components/servicios/ServiceFeatures';
import ServiceMethodology from '@/components/servicios/ServiceMethodology';
import ServiceTechStack from '@/components/servicios/ServiceTechStack';
import CasesGrid from '@/components/casos/CasesGrid';
import { Metadata } from 'next';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import styles from './page.module.css';

// Generate static params for all services
export async function generateStaticParams() {
    const { servicesNav } = await api.company.getGlobalData();
    return servicesNav.map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { service } = await api.services.getDetailPageData(slug);

    if (!service) {
        return {
            title: 'Servicio no encontrado',
        };
    }

    return {
        title: `${service.title} | Datify`,
        description: service.description,
        alternates: {
            canonical: `/servicios/${slug}`,
        },
        openGraph: {
            title: `${service.title} | Datify`,
            description: service.description,
            url: `https://godatify.com/servicios/${slug}`,
        },
    };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { service, relatedCases } = await api.services.getDetailPageData(slug);

    if (!service) {
        notFound();
    }

    return (
        <main id="main-content">
            {/* Service Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateServiceSchema(service, slug))
                }}
            />
            
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBreadcrumbSchema([
                        { name: 'Inicio', url: 'https://godatify.com/' },
                        { name: 'Servicios', url: 'https://godatify.com/servicios' },
                        { name: service.title }
                    ]))
                }}
            />
            
            <ServiceHero
                title={service.title}
                description={service.description}
                phrases={service.phrases}
                backgroundImage={service.backgroundImage}
            />
            <div className={styles.container}>

                <ServiceFeatures features={service.features} />

                <ServiceMethodology steps={service.methodology} />

                <ServiceTechStack techStack={service.techStack} />
            </div>

            {relatedCases.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className={styles.relatedHeader}>
                        <span className={styles.relatedLabel}>
                            Resultados Reales
                        </span>
                        <h2 className={styles.relatedTitle}>
                            Casos de Éxito Relacionados
                        </h2>
                        <p className={styles.relatedDescription}>
                            Descubre cómo hemos aplicado estas soluciones en empresas reales para generar valor tangible.
                        </p>
                    </div>
                    <CasesGrid cases={relatedCases} initialTotal={relatedCases.length} standalone={false} />
                </section>
            )}
        </main>
    );
}
