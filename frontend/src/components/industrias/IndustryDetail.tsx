'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import styles from './IndustryDetail.module.css';

interface IndustryStats {
    label: string;
    value: string;
}

interface IndustryDetailProps {
    industry: {
        title: string;
        description: string;
        image: string;
        sector?: { title: string; slug: string };
        stats?: IndustryStats[];
        challenges?: string[];
        solutions?: string[];
        projects?: string[];
    };
}

export default function IndustryDetail({ industry }: IndustryDetailProps) {
    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <Image
                        src={industry.image || '/images/hero-industries.webp'}
                        alt={industry.title}
                        fill
                        className={styles.heroImage}
                        priority
                    />
                    <div className={styles.heroOverlay} />
                </div>

                <div className={styles.heroContent}>
                    {industry.sector && (
                        <Link 
                            href={`/industrias#${industry.sector.slug}`}
                            className={styles.sectorBadge}
                        >
                            {industry.sector.title}
                        </Link>
                    )}
                    <h1 className={styles.heroTitle}>{industry.title}</h1>
                    <p className={styles.heroDescription}>{industry.description}</p>
                    
                    {/* Stats Row */}
                    {industry.stats && industry.stats.length > 0 && (
                        <div className={styles.heroStats}>
                            {industry.stats.map((stat, idx) => (
                                <div key={idx} className={styles.heroStat}>
                                    <span className={styles.heroStatValue}>{stat.value}</span>
                                    <span className={styles.heroStatLabel}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Challenges & Solutions Section */}
            {(industry.challenges || industry.solutions) && (
                <section className={styles.challengesSection}>
                    <div className={styles.challengesContainer}>
                        {/* Challenges */}
                        {industry.challenges && industry.challenges.length > 0 && (
                            <div className={styles.challengesCard}>
                                <div className={styles.cardHeaderIcon}>
                                    <Icon name="exclamation-triangle" />
                                </div>
                                <h2 className={styles.cardTitle}>Desafíos del Sector</h2>
                                <ul className={styles.cardList}>
                                    {industry.challenges.map((challenge, idx) => (
                                        <li key={idx} className={styles.cardListItem}>
                                            <Icon name="times-circle" className={styles.challengeIcon} />
                                            <span>{challenge}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Solutions */}
                        {industry.solutions && industry.solutions.length > 0 && (
                            <div className={styles.solutionsCard}>
                                <div className={styles.cardHeaderIcon}>
                                    <Icon name="lightbulb" />
                                </div>
                                <h2 className={styles.cardTitle}>Nuestras Soluciones</h2>
                                <ul className={styles.cardList}>
                                    {industry.solutions.map((solution, idx) => (
                                        <li key={idx} className={styles.cardListItem}>
                                            <Icon name="check-circle" className={styles.solutionIcon} />
                                            <span>{solution}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Value Proposition Section */}
            <section className={styles.valueSection}>
                <div className={styles.valueContainer}>
                    <div className={styles.valueContent}>
                        <span className={styles.valueLabel}>¿Por qué Datify?</span>
                        <h2 className={styles.valueTitle}>
                            Experiencia sectorial que marca la diferencia
                        </h2>
                        <p className={styles.valueText}>
                            Conocemos los desafíos específicos de {industry.title}. 
                            No aplicamos soluciones genéricas — diseñamos arquitecturas 
                            de datos adaptadas a tu operación, tu cadena de valor y tus KPIs.
                        </p>
                        <ul className={styles.valueList}>
                            <li>
                                <Icon name="check-circle" className={styles.checkIcon} />
                                Equipos con experiencia directa en tu industria
                            </li>
                            <li>
                                <Icon name="check-circle" className={styles.checkIcon} />
                                Metodología probada en empresas líderes
                            </li>
                            <li>
                                <Icon name="check-circle" className={styles.checkIcon} />
                                Resultados medibles desde el primer mes
                            </li>
                        </ul>
                    </div>
                    <div className={styles.valueImage}>
                        <Image
                            src={industry.image || '/images/hero-industries.webp'}
                            alt={`Soluciones para ${industry.title}`}
                            fill
                            className={styles.valueImg}
                        />
                        <div className={styles.valueImageOverlay} />
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            {industry.projects && industry.projects.length > 0 && (
                <section className={styles.projectsSection}>
                    <div className={styles.projectsContainer}>
                        <span className={styles.projectsLabel}>Proyectos Realizados</span>
                        <h2 className={styles.projectsTitle}>Lo que hemos logrado en {industry.title}</h2>
                        <div className={styles.projectsGrid}>
                            {industry.projects.map((project, idx) => (
                                <div key={idx} className={styles.projectCard}>
                                    <div className={styles.projectNumber}>{String(idx + 1).padStart(2, '0')}</div>
                                    <p className={styles.projectText}>{project}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
