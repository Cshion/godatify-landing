'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CaseStudy } from '@/types';
import CasesGrid from './CasesGrid';
import Icon from '@/components/ui/Icon';
import RichTextRenderer from '@/components/blog/RichTextRenderer';
import styles from './CaseDetail.module.css';

interface CaseDetailProps {
    caseStudy: CaseStudy;
    relatedCases: CaseStudy[];
}

export default function CaseDetail({ caseStudy, relatedCases }: CaseDetailProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(caseStudy.title);
    const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const shareTwitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`;

    const tags: string[] = [];
    if (caseStudy.industry) tags.push(caseStudy.industry);
    if (caseStudy.techStack && caseStudy.techStack.length > 0) tags.push(caseStudy.techStack[0]);

    return (
        <>
            <article className={styles.article}>
                <div className={styles.container}>
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link href="/casos" className={styles.breadcrumbLink}>Casos de Éxito</Link>
                        <span className={styles.breadcrumbSeparator}>→</span>
                        <span className={styles.breadcrumbCurrent}>{caseStudy.title}</span>
                    </nav>

                    {tags.length > 0 && <div className={styles.tags}>{tags.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}</div>}

                    <div className={styles.layout}>
                        <div className={styles.mainContent}>
                            <h1 className={styles.title}>{caseStudy.title}</h1>
                            <p className={styles.introText}>{caseStudy.description}</p>

                            {caseStudy.results.length > 0 && (
                                <section id="results" data-section>
                                    <h2 className={styles.sectionTitle}>Resultados</h2>
                                    <div className={styles.resultsGrid}>{caseStudy.results.map((r, i) => <div key={i} className={styles.resultCard}><div className={styles.resultValue}>{r.value}</div><div className={styles.resultLabel}>{r.label}</div>{r.suffix && <div className={styles.resultSuffix}>{r.suffix}</div>}</div>)}</div>
                                </section>
                            )}

                            {caseStudy.content && Array.isArray(caseStudy.content) && (
                                <div className={styles.contentBody}>
                                    <RichTextRenderer content={caseStudy.content} />
                                </div>
                            )}

                            <div className={styles.ctaSection}>
                                <div className={styles.ctaContent}><h3 className={styles.ctaTitle}>¿Enfrentando un desafío similar?</h3><p className={styles.ctaSubtitle}>Nuestros expertos te ayudarán.</p></div>
                                <div className={styles.ctaActions}>
                                    <Link href="/contacto" className={styles.ctaButton}>Contáctanos<Icon name="arrow-right" /></Link>
                                    <div className={styles.shareButtons}>
                                        <span className={styles.shareLabel}>Compartir:</span>
                                        <a href={shareLinkedIn} target="_blank" rel="noopener noreferrer" className={styles.shareButton} aria-label="LinkedIn"><Icon name="linkedin-in" prefix="fab" /></a>
                                        <a href={shareFacebook} target="_blank" rel="noopener noreferrer" className={styles.shareButton} aria-label="Facebook"><Icon name="facebook-f" prefix="fab" /></a>
                                        <a href={shareTwitter} target="_blank" rel="noopener noreferrer" className={styles.shareButton} aria-label="X"><Icon name="x-twitter" prefix="fab" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className={styles.sidebar}>
                            {caseStudy.client && (
                                <div className={styles.sidebarCard}>
                                    <div className={styles.sidebarLabel}>Cliente</div>
                                    {caseStudy.client.anonymous ? <div className={styles.clientName}>Confidencial</div> : (
                                        <>{caseStudy.client.logo && <div className={styles.clientLogoWrapper}><Image src={caseStudy.client.logo} alt={caseStudy.client.name} fill className={styles.clientLogo} /></div>}<div className={styles.clientName}>{caseStudy.client.name}</div>{caseStudy.client.website && <a href={caseStudy.client.website} target="_blank" rel="noopener noreferrer" className={styles.clientWebsite}>Visitar<Icon name="external-link-alt" className={styles.clientWebsiteIcon} /></a>}</>
                                    )}
                                    {caseStudy.industry && <><div className={styles.sidebarLabel} style={{ marginTop: '1.5rem' }}>Industria</div><div className={styles.sidebarValue}>{caseStudy.industry}</div></>}
                                </div>
                            )}
                            {caseStudy.techStack && caseStudy.techStack.length > 0 && <div className={styles.sidebarCard}><div className={styles.sidebarLabel}>Tecnologías</div><div className={styles.sidebarTechList}>{caseStudy.techStack.map((t, i) => <span key={i} className={styles.sidebarTechTag}>{t}</span>)}</div></div>}
                            {caseStudy.testimonial && (
                                <div className={styles.testimonialCard}>
                                    <span className={styles.testimonialQuoteIcon}>&ldquo;</span>
                                    <blockquote className={styles.testimonialQuote}>{caseStudy.testimonial.quote}</blockquote>
                                    <cite className={styles.testimonialAuthor}>{caseStudy.testimonial.author}</cite>
                                    <span className={styles.testimonialRole}>{caseStudy.testimonial.role}</span>
                                    {caseStudy.testimonial.linkedIn && <div className={styles.testimonialLinkedIn}><a href={caseStudy.testimonial.linkedIn} target="_blank" rel="noopener noreferrer" className={styles.testimonialLinkedInLink}><Icon name="linkedin-in" prefix="fab" />Ver perfil</a></div>}
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </article>
            {relatedCases.length > 0 && <section className={styles.relatedSection}><div className={styles.relatedContainer}><h2 className={styles.relatedTitle}>Casos Relacionados</h2></div><CasesGrid cases={relatedCases} initialTotal={relatedCases.length} standalone={false} /></section>}
        </>
    );
}
