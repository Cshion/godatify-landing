import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import { generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/schemas';

export const metadata: Metadata = {
    title: 'Servicios de Data Analytics & BI | Datify',
    description: 'Consultoría especializada en Data Analytics, Business Intelligence, Data Engineering e IA para empresas líderes de LATAM. Transforma tus datos en decisiones.',
    alternates: {
        canonical: '/servicios',
    },
    openGraph: {
        type: 'website',
        url: '/servicios',
        title: 'Servicios de Data Analytics & BI | Datify',
        description: 'Consultoría especializada en Data Analytics, Business Intelligence, Data Engineering e IA para empresas líderes de LATAM. Transforma tus datos en decisiones.',
        images: ['/images/og-image.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Servicios de Data Analytics & BI | Datify',
        description: 'Consultoría especializada en Data Analytics, Business Intelligence, Data Engineering e IA para empresas líderes de LATAM. Transforma tus datos en decisiones.',
        images: ['/images/og-image.png'],
    },
};

export const revalidate = 3600;

export default async function ServiciosPage() {
    const services = await api.services.getAll();

    return (
        <main id="main-content">
            {/* CollectionPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateCollectionPageSchema(
                        '/servicios',
                        'Servicios de Data Analytics & BI | Datify',
                        'Consultoría especializada en Data Analytics, Business Intelligence e IA para empresas en LATAM.'
                    ))
                }}
            />

            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBreadcrumbSchema([
                        { name: 'Inicio', url: 'https://godatify.com/' },
                        { name: 'Servicios' }
                    ]))
                }}
            />

            {/* Hero */}
            <section
                style={{
                    backgroundImage: "url('/images/hero-services.webp')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                className="relative min-h-[480px] flex items-center justify-center text-white"
            >
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'rgba(19, 92, 81, 0.82)' }}
                    aria-hidden="true"
                />
                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80">
                        Nuestras Capacidades
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        Servicios expertos para la transformación de datos
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                        Desde la ingeniería de datos hasta la inteligencia artificial, acompañamos a las empresas líderes de LATAM en cada etapa de su madurez analítica.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#135c51] mb-3">
                            Lo que hacemos
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Soluciones de datos a medida
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                href={`/servicios/${service.slug}`}
                                className="group block rounded-xl border border-gray-100 p-8 hover:border-[#135c51]/30 hover:shadow-lg transition-all duration-200"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#135c51] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                    {service.description}
                                </p>
                                <span className="mt-5 inline-flex items-center text-sm font-medium text-[#135c51] gap-1">
                                    Ver servicio
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-[#135c51]">
                <div className="max-w-3xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5">
                        ¿Listo para transformar tus datos?
                    </h2>
                    <p className="text-lg opacity-90 mb-8">
                        Conversemos sobre los desafíos de tu organización. Nuestro equipo está preparado para diseñar una solución a tu medida.
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 bg-white text-[#135c51] font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Agendar una consulta
                    </Link>
                </div>
            </section>
        </main>
    );
}
