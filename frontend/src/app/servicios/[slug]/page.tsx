import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import ServiceHero from '@/components/servicios/ServiceHero';
import ServiceFeatures from '@/components/servicios/ServiceFeatures';
import ServiceMethodology from '@/components/servicios/ServiceMethodology';
import ServiceTechStack from '@/components/servicios/ServiceTechStack';
import CasesGrid from '@/components/casos/CasesGrid';
import { Metadata } from 'next';

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
    };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { service, relatedCases } = await api.services.getDetailPageData(slug);

    if (!service) {
        notFound();
    }

    return (
        <main>
            <ServiceHero
                title={service.title}
                description={service.description}
                phrases={service.phrases}
                backgroundImage={service.backgroundImage}
            />
            <div className="container mx-auto px-6 py-16">

                <ServiceFeatures features={service.features} />

                <ServiceMethodology steps={service.methodology} />

                <ServiceTechStack techStack={service.techStack} />
            </div>

            {relatedCases.length > 0 && (
                <div className="bg-gray-50 py-20 border-t border-gray-200">
                    <div className="container mx-auto px-6 mb-12 text-center">
                        <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">
                            Resultados Reales
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Casos de Éxito Relacionados
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubre cómo hemos aplicado estas soluciones en empresas reales para generar valor tangible.
                        </p>
                    </div>
                    <CasesGrid cases={relatedCases} />
                </div>
            )}
        </main>
    );
}
