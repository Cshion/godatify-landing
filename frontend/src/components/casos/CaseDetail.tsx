import Image from 'next/image';
import { CaseStudy } from '@/types';
import CasesGrid from './CasesGrid';
import Icon from '@/components/ui/Icon';
import styles from './CaseDetail.module.css';

interface CaseDetailProps {
    caseStudy: CaseStudy;
    relatedCases: CaseStudy[];
}

export default function CaseDetail({ caseStudy, relatedCases }: CaseDetailProps) {

    return (
        <>
            <article className={styles.detailSection}>
                <div className={styles.container}>
                    {/* Header */}
                    <header className={styles.header}>
                        {caseStudy.industry && (
                            <span className={styles.industryTag}>{caseStudy.industry}</span>
                        )}
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

                            {/* Challenge & Solution Sections */}
                            <div className={styles.challengeSolutionWrapper}>
                                {/* Challenge */}
                                {caseStudy.challenge && (
                                    <div className={styles.challengeCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={`${styles.cardIconWrapper} ${styles.cardIconWrapperChallenge}`}>
                                                <Icon name="exclamation-triangle" />
                                            </div>
                                            <h2 className={styles.cardTitle}>El Desafío</h2>
                                        </div>
                                        <p className={styles.cardContent}>
                                            {caseStudy.challenge}
                                        </p>
                                    </div>
                                )}

                                {/* Solution */}
                                {caseStudy.solution && (
                                    <div className={styles.solutionCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={`${styles.cardIconWrapper} ${styles.cardIconWrapperSolution}`}>
                                                <Icon name="lightbulb" />
                                            </div>
                                            <h2 className={styles.cardTitle}>La Solución</h2>
                                        </div>
                                        <p className={styles.cardContent}>
                                            {caseStudy.solution}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Content Body */}
                            {caseStudy.content && (
                                <div
                                    className={styles.contentBody}
                                    dangerouslySetInnerHTML={{ __html: caseStudy.content }}
                                />
                            )}

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
                                <div className={styles.sidebarCard}>
                                    <h3 className={styles.sidebarCardTitle}>Cliente</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            {caseStudy.client.anonymous ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <Icon name="user-secret" />
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
                                                        <Icon name="building" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 block">{caseStudy.client.name}</span>
                                                </div>
                                            )}

                                            {!caseStudy.client.anonymous && caseStudy.client.website && (
                                                <a
                                                    href={caseStudy.client.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-gray-500 hover:text-brand-green transition-colors flex items-center gap-1 mt-2"
                                                >
                                                    Visitar sitio web
                                                    <Icon name="external-link-alt" className="text-[10px]" />
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
                                <h3 className={styles.sidebarCardTitle}>Impacto Generado</h3>
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
                                <div className={styles.testimonialCard}>
                                    <div className={styles.testimonialQuoteIcon}>
                                        <Icon name="quote-right" />
                                    </div>

                                    <div className="relative z-10">
                                        <blockquote className={styles.testimonialQuote}>
                                            &ldquo;{caseStudy.testimonial.quote}&rdquo;
                                        </blockquote>

                                        <div className={styles.testimonialFooter}>
                                            <div className="flex flex-col">
                                                <cite className={styles.testimonialAuthor}>
                                                    {caseStudy.testimonial.author}
                                                </cite>
                                                <span className={styles.testimonialRole}>
                                                    {caseStudy.testimonial.role}
                                                </span>
                                            </div>

                                            {caseStudy.testimonial.linkedIn && (
                                                <a
                                                    href={caseStudy.testimonial.linkedIn}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.linkedInButton}
                                                    aria-label={`Ver perfil de LinkedIn de ${caseStudy.testimonial.author}`}
                                                >
                                                <Icon name="linkedin-in" prefix="fab" />
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
            <div className={styles.relatedCasesSection}>
                <div className={styles.relatedCasesHeader}>
                    <h2 className={styles.relatedCasesTitle}>
                        Otros Casos de Éxito
                    </h2>
                </div>
                <CasesGrid cases={relatedCases} initialTotal={relatedCases.length} standalone={false} />
            </div>
        </>
    );
}
