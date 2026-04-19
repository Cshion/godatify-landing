import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import Icon from '@/components/ui/Icon';
import Cases from '@/components/sections/Cases';
import Clients from '@/components/sections/Clients';
import BlogCTA from '@/components/blog/BlogCTA';
import { generateBreadcrumbSchema } from '@/lib/schemas';

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

    // Fetch Global Data for Clients/CTA info if needed, or we just hardcode/fetch clients separately
    const { clients } = await api.home.getData(); // Reusing home data fetch for clients efficiently

    if (!industry) {
        notFound();
    }

    return (
        <main className="bg-white min-h-screen">
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
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
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

                <div className="container relative z-10 px-6 pt-20 text-center flex flex-col items-center justify-center">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium rounded-full mb-8 text-xs uppercase tracking-[0.2em] shadow-sm">
                            {(industry.sector?.title || 'Sector Especializado')}
                        </span>
                        <h1
                            className="text-6xl md:text-8xl font-bold mb-8 leading-tight drop-shadow-2xl text-white !text-white !text-center tracking-tighter"
                            style={{ color: '#ffffff', textAlign: 'center' }}
                        >
                            {industry.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light !text-center opacity-90">
                            {industry.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Stats Section - Accenture Style (Centered & Spaced) */}
            <section className="relative z-20 px-6 mb-40 mt-12 bg-white">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {(industry.stats || []).map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center border-t-2 border-gray-900 pt-8 text-center px-4">
                                <div className="text-8xl font-black text-gray-900 mb-6 tracking-tighter leading-none">
                                    {stat.value}
                                </div>
                                <div className="text-gray-900 font-bold text-sm uppercase tracking-widest max-w-[200px] leading-relaxed">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Split Screen: Context & Solutions Ecosystem */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-40 items-start">

                        {/* LEFT: Context / Vision */}
                        <div className="lg:w-1/3 sticky top-40">
                            <span className="text-brand-green font-bold tracking-[0.2em] uppercase text-xs mb-8 block ml-1">
                                El Desafío
                            </span>
                            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-10 leading-[1.05] tracking-tighter">
                                Redefiniendo los estándares de la industria {industry.title}.
                            </h2>
                            <p className="text-xl text-gray-500 leading-normal font-light border-l-2 border-gray-200 pl-8">
                                En un entorno donde la eficiencia y la adaptabilidad dictan el liderazgo, Datify ofrece una arquitectura tecnológica diseñada para escalar. No solo resolvemos problemas; construimos ventajas competitivas duraderas.
                            </p>
                        </div>

                        {/* RIGHT: Solutions Ecosystem */}
                        <div className="lg:w-2/3 w-full space-y-24">

                            {/* 1. Servicios Específicos (Formerly Projects List) */}
                            <div>
                                <div className="mb-10 pb-4 border-b border-gray-900 flex justify-between items-end">
                                    <span className="text-gray-900 font-bold uppercase tracking-widest text-sm">Servicios Específicos</span>
                                    <span className="text-gray-400 text-xs font-mono">ENFOQUE TÉCNICO</span>
                                </div>

                                <div className="space-y-4">
                                    {(industry.projects || []).map((project, idx) => (
                                        <div key={idx} className="group relative bg-white transition-all duration-300 border-b border-gray-100 hover:border-brand-green pb-8 mb-4 cursor-default">
                                            <div className="flex items-start justify-between">
                                                <div className="pr-12">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-brand-green transition-colors tracking-tight">
                                                        {project}
                                                    </h3>
                                                    <p className="text-gray-500 leading-relaxed font-light text-base max-w-xl">
                                                        Implementación estratégica enfocada en resultados medibles y optimización de recursos.
                                                    </p>
                                                </div>
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-green text-2xl transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                    <Icon name="arrow-right" />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </section>

            {/* Related Cases Section (Restored Carousel - Above Clients) */}
            {relatedCases.length > 0 && (
                <div className="relative z-10 bg-white">
                    <Cases
                        cases={relatedCases}
                        title={`Impacto Real en ${industry.title}`}
                        buttonText="Ver Historia"
                    />
                </div>
            )}

            {/* Clients Section */}
            <div className="bg-white py-24 border-t border-gray-100">
                <Clients
                    clients={clients}
                    title={`Líderes de la industria que confían en nosotros`}
                />
            </div>

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
