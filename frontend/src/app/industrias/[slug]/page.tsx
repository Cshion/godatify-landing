import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import Cases from '@/components/sections/Cases';
import Clients from '@/components/sections/Clients';
import BlogCTA from '@/components/blog/BlogCTA';

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
        title: `${industry.title} | Datify`,
        description: industry.description,
    };
}

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
    const { slug } = await params;
    const { industry, relatedCases } = await api.industries.getIndustryBySlug(slug);

    // Fetch Global Data for Clients/CTA info if needed, or we just hardcode/fetch clients separately
    const { clients } = await api.home.getData(); // Reusing home data fetch for clients efficiently

    if (!industry) {
        notFound();
    }

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 z-0 select-none">
                    <Image
                        src={industry.image || '/images/hero-industries.png'}
                        alt={industry.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Strong Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
                </div>

                <div className="container relative z-10 px-6 pt-20">
                    <div className="max-w-4xl">
                        <span className="inline-block px-4 py-2 bg-brand-green/20 backdrop-blur-md border border-brand-green/30 text-brand-green font-semibold rounded-full mb-6 text-sm uppercase tracking-wider shadow-sm">
                            {(industry.sector?.title || 'Sector Especializado')}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                            {industry.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed drop-shadow-md">
                            {industry.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Stats Section */}
            <section className="relative z-20 -mt-20 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(industry.stats || []).map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-t-4 border-brand-green group">
                                <div className="text-5xl font-bold text-gray-900 mb-2 group-hover:text-brand-green transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 font-medium uppercase tracking-wide text-xs">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Challenges & Solutions (Using Projects Data) */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="text-brand-green font-bold tracking-wider uppercase mb-3 block">Soluciones Integrales</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Transformación para la industria {industry.title}
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Diseñamos estrategias tecnológicas que responden directamente a los puntos críticos de su operación, garantizando eficiencia y escalabilidad.
                        </p>
                    </div>

                    {/* Expanded Content: Cards Layout */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(industry.projects || []).map((project, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green text-2xl mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors">
                                    <i className={`fas ${idx % 2 === 0 ? 'fa-chart-line' : 'fa-cogs'}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{project}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Implementación especializada para optimizar recursos y maximizar el retorno de inversión en esta área crítica.
                                </p>
                            </div>
                        ))}
                        {/* Fallback padding if few projects */}
                        {(industry.projects || []).length < 3 && (
                            <div className="bg-gradient-to-br from-brand-green/5 to-transparent p-8 rounded-2xl border border-brand-green/10 flex items-center justify-center text-center">
                                <div>
                                    <h3 className="text-xl font-bold text-brand-green mb-2">¿Necesita algo más específico?</h3>
                                    <p className="text-gray-600 mb-4">Adaptamos nuestra tecnología a sus necesidades.</p>
                                    <Link href="/contacto" className="text-brand-green font-bold hover:underline">Contáctenos &rarr;</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Clients Section */}
            <div className="bg-white py-24 border-t border-gray-100">
                <Clients
                    clients={clients}
                    title="Empresas que confían en nosotros"
                />
            </div>

            {/* Related Cases (Carousel) */}
            {relatedCases.length > 0 && (
                <div className="py-12 bg-gray-50">
                    <Cases
                        cases={relatedCases}
                        title="Historias de Éxito Relacionadas"
                        buttonText="Ver Caso"
                    />
                </div>
            )}

            {/* Blog-Style CTA Section using the exact component */}
            <div className="container mx-auto px-6 py-24">
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
