'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sector, CaseStudy } from '@/types';
import Icon from '@/components/ui/Icon';
import styles from './IndustryShowcase.module.css';

interface IndustryShowcaseProps {
    sectors: Sector[];
    cases: CaseStudy[];
}

export default function IndustryShowcase({ sectors, cases }: IndustryShowcaseProps) {
    const [activeSector, setActiveSector] = useState<Sector | null>(sectors.length > 0 ? sectors[0] : null);

    if (!activeSector) return null;

    return (
        <section className={styles.section} id="showcase">
            <div className={styles.container}>

                {/* Sector Tabs - Desktop: Horizontal, Mobile: Scrollable */}
                <div className={styles.tabsContainer}>
                    {sectors.map((sector) => (
                        <button
                            key={sector.slug}
                            onClick={() => setActiveSector(sector)}
                            className={`${styles.tab} ${activeSector.slug === sector.slug ? styles.tabActive : ''}`}
                        >
                            {sector.title}
                            {/* Animated Underline */}
                            {activeSector.slug === sector.slug && (
                                <span className={styles.tabUnderline} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Active Sector Content */}
                <div className={styles.contentGrid}>

                    {/* Left: Sector Info */}
                    <div className={styles.leftColumn}>
                        <div>
                            <h2 className={styles.sectorTitle}>{activeSector.title}</h2>
                            <p className={styles.sectorDesc}>{activeSector.description}</p>
                        </div>

                        {/* Decorative or Info Card */}
                        <div className={styles.infoCard}>
                            <h3 className={styles.infoCardTitle}>
                                <Icon name="chart-line" className={styles.infoCardIcon} />
                                Impacto Transformador
                            </h3>
                            <p className={styles.infoCardText}>
                                Nuestras soluciones en {activeSector.title} están diseñadas para maximizar eficiencia y reducir costos operativos mediante analítica avanzada.
                            </p>
                        </div>
                    </div>

                    {/* Right: Industries Grid */}
                    <div className={styles.rightColumn}>
                        <div className={styles.industryGrid}>
                            {(activeSector.industries || []).map((industry) => (
                                <Link
                                    key={industry.slug}
                                    href={`/industrias/${industry.slug}`}
                                    className={styles.industryCard}
                                >
                                    <div className={styles.industryCardDecor} />

                                    <h3 className={styles.industryCardTitle}>
                                        {industry.title}
                                    </h3>
                                    <p className={styles.industryCardDesc}>
                                        {industry.description}
                                    </p>

                                    <div className={styles.industryCardLink}>
                                        Explorar Soluciones <Icon name="arrow-right" className={styles.industryCardLinkIcon} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
