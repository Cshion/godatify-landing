'use client';

import { useState } from 'react';
import Image from 'next/image';
import { INDUSTRIES_CONTENT } from '@/lib/constants';
import styles from './IndustryShowcase.module.css';

type Sector = typeof INDUSTRIES_CONTENT.sectors[number];

export default function IndustryShowcase() {
    const [activeSector, setActiveSector] = useState<Sector>(INDUSTRIES_CONTENT.sectors[0]);

    return (
        <section className={styles.section} id="showcase">
            <div className={styles.container}>
                <div className={styles.layout}>

                    {/* Left Column: List */}
                    <div className={styles.industryList}>
                        {INDUSTRIES_CONTENT.sectors.map((sector) => (
                            <button
                                key={sector.id}
                                className={`${styles.industryButton} ${activeSector.id === sector.id ? styles.activeButton : ''}`}
                                onMouseEnter={() => setActiveSector(sector)}
                                onClick={() => setActiveSector(sector)}
                            >
                                <span className={styles.buttonTitle}>{sector.title}</span>
                                <span className={styles.buttonDesc}>{sector.description}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Preview */}
                    <div className={styles.previewArea} key={activeSector.id}>
                        <div className={styles.imageContainer}>
                            <Image
                                src={activeSector.image}
                                alt={activeSector.title}
                                fill
                                className={styles.previewImage}
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-3xl font-bold">{activeSector.title}</h3>
                            </div>
                        </div>

                        <div className={styles.previewContent}>
                            {/* Stats */}
                            <div className={styles.statsGrid}>
                                {activeSector.stats.map((stat, idx) => (
                                    <div key={idx}>
                                        <span className={styles.statValue}>{stat.value}</span>
                                        <span className={styles.statLabel}>{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Projects */}
                            <div className={styles.projectsList}>
                                <h4>Proyectos Destacados</h4>
                                <ul>
                                    {activeSector.projects.map((project, idx) => (
                                        <li key={idx}>{project}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
