import Image from 'next/image';
import { CaseStudy } from '@/types';
import { CASES_CONTENT } from '@/data/cases';
import CasesGrid from './CasesGrid';
import styles from './CaseDetail.module.css';

interface CaseDetailProps {
    caseStudy: CaseStudy;
}

export default function CaseDetail({ caseStudy }: CaseDetailProps) {
    // Get 3 related cases (excluding current one)
    const relatedCases = CASES_CONTENT
        .filter(c => c.slug !== caseStudy.slug)
        .slice(0, 3);

    return (
        <>
            <article className={styles.detailSection}>
                <div className={styles.container}>
                    {/* Header */}
                    <header className={styles.header}>
                        <span className={styles.industryTag}>{caseStudy.industry}</span>
                        <h1 className={styles.title}>{caseStudy.title}</h1>
                        <p className={styles.description}>{caseStudy.description}</p>
                    </header>

                    <div className={styles.contentGrid}>
                        {/* Left Column: Main Media & Content */}
                        <div className={styles.mainContent}>
                            {/* Main Media (Video or Image) */}
                            <div className={styles.mainImageWrapper}>
                                {caseStudy.videoUrl ? (
                                    <div className="relative w-full h-full aspect-video">
                                        <iframe
                                            src={caseStudy.videoUrl}
                                            title={`Video del caso: ${caseStudy.title}`}
                                            className="absolute top-0 left-0 w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <Image
                                        src={caseStudy.image}
                                        alt={caseStudy.title}
                                        fill
                                        className={styles.mainImage}
                                        priority
                                    />
                                )}
                            </div>

                            {/* Content Body */}
                            <div
                                className={styles.contentBody}
                                dangerouslySetInnerHTML={{ __html: caseStudy.content }}
                            />

                            {/* Tech Stack (Moved here) */}
                            <div className={styles.techStack}>
                                <span className={styles.techTitle}>Tecnologías Utilizadas</span>
                                <div className={styles.techTags}>
                                    {caseStudy.techStack.map((tech, idx) => (
                                        <span key={idx} className={styles.techTag}>{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sidebar (Client, Results, Testimonial) */}
                        <aside className={styles.sidebar}>
                            {/* Client Info */}
                            {caseStudy.client && (
                                <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cliente</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            {caseStudy.client.anonymous ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <i className="fas fa-user-secret"></i>
                                                    </div>
                                                    <span className="font-bold text-gray-900 block">Confidencial</span>
                                                </div>
                                            ) : caseStudy.client.logo ? (
                                                <div className="relative w-32 h-12">
                                                    <Image
                                                        src={caseStudy.client.logo}
                                                        alt={caseStudy.client.name}
                                                        fill
                                                        className="object-contain object-left"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <i className="fas fa-building"></i>
                                                    </div>
                                                    <span className="font-bold text-gray-900 block">{caseStudy.client.name}</span>
                                                </div>
                                            )}

                                            {!caseStudy.client.anonymous && caseStudy.client.website && (
                                                <a
                                                    href={caseStudy.client.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-gray-500 hover:text-brand-green transition-colors flex items-center gap-1 mt-1"
                                                >
                                                    Visitar sitio web
                                                    <i className="fas fa-external-link-alt text-[10px]"></i>
                                                </a>
                                            )}
                                            <span className="text-xs text-gray-400 block mt-1">
                                                {caseStudy.client.anonymous ? 'Sector Privado' : 'Cliente Partner'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Results (Impact Visualizer) */}
                            <div className={styles.resultsCard}>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Impacto Generado</h3>
                                <div className={styles.resultsList}>
                                    {caseStudy.results.map((result, idx) => (
                                        <div key={idx} className={styles.resultItem}>
                                            <span className={styles.resultValue}>{result.value}</span>
                                            <div className="flex flex-col text-left">
                                                <span className={styles.resultLabel}>{result.label}</span>
                                                <span className={styles.resultSuffix}>{result.suffix}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Testimonial (Sidebar - Enhanced) */}
                            {caseStudy.testimonial && (
                                <div className="bg-gradient-to-br from-brand-green/5 to-transparent p-8 rounded-2xl border border-brand-green/10 mt-8 relative overflow-hidden group hover:border-brand-green/20 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 text-brand-green transform translate-x-1/4 -translate-y-1/4">
                                        <i className="fas fa-quote-right text-8xl"></i>
                                    </div>

                                    <div className="relative z-10">
                                        <blockquote className="text-gray-800 font-medium text-lg leading-relaxed mb-6">
                                            "{caseStudy.testimonial.quote}"
                                        </blockquote>

                                        <div className="flex items-center justify-between border-t border-brand-green/10 pt-6">
                                            <div className="flex flex-col">
                                                <cite className="not-italic font-bold text-gray-900">
                                                    {caseStudy.testimonial.author}
                                                </cite>
                                                <span className="text-brand-green text-xs font-semibold mt-1">
                                                    {caseStudy.testimonial.role}
                                                </span>
                                            </div>

                                            {caseStudy.testimonial.linkedIn && (
                                                <a
                                                    href={caseStudy.testimonial.linkedIn}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#0077b5] shadow-sm hover:shadow-md hover:scale-110 transition-all"
                                                    aria-label={`Ver perfil de LinkedIn de ${caseStudy.testimonial.author}`}
                                                >
                                                    <i className="fab fa-linkedin-in"></i>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </article>

            {/* Related Cases Section */}
            <div className="bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 pt-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Otros Casos de Éxito
                    </h2>
                </div>
                <CasesGrid cases={relatedCases} />
            </div>
        </>
    );
}
