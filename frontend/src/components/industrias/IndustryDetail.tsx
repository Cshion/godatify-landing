'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import styles from './IndustryDetail.module.css';

interface IndustryDetailProps {
    industry: {
        title: string;
        description: string;
        image: string;
        sector?: { title: string; slug: string };
    };
}

export default function IndustryDetail({ industry }: IndustryDetailProps) {
    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <Image
                        src={industry.image || '/images/hero-industries.png'}
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
                </div>
            </section>

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
                            src={industry.image || '/images/hero-industries.png'}
                            alt={`Soluciones para ${industry.title}`}
                            fill
                            className={styles.valueImg}
                        />
                        <div className={styles.valueImageOverlay} />
                    </div>
                </div>
            </section>
        </>
    );
}
