'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INDUSTRIES_CONTENT } from '@/data/industries';
import { CASES_CONTENT } from '@/data/cases';
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

                            {/* Projects / Cases */}
                            <div className={styles.projectsList}>
                                <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                                    <i className="fas fa-trophy text-brand-green"></i>
                                    Casos de Éxito
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {CASES_CONTENT.filter(c => 'relatedIndustryId' in c && c.relatedIndustryId === activeSector.id).map((caseStudy) => (
                                        <Link
                                            key={caseStudy.slug}
                                            href={`/casos/${caseStudy.slug}`}
                                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-green/50 transition-all group"
                                        >
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                                <Image
                                                    src={caseStudy.image}
                                                    alt={caseStudy.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-white font-medium text-sm leading-tight mb-1 truncate group-hover:text-brand-green transition-colors">
                                                    {caseStudy.title}
                                                </h5>
                                                <p className="text-white/50 text-xs line-clamp-1 mb-1">
                                                    {caseStudy.description}
                                                </p>
                                                <span className="text-brand-green text-xs font-semibold flex items-center gap-1 opacity-80 group-hover:opacity-100">
                                                    Ver caso
                                                    <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                                                </span>
                                            </div>
                                        </Link>
                                    ))}

                                    {/* Fallback if no cases found */}
                                    {CASES_CONTENT.filter(c => 'relatedIndustryId' in c && c.relatedIndustryId === activeSector.id).length === 0 && (
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <ul className="space-y-2">
                                                {activeSector.projects.map((project, idx) => (
                                                    <li key={idx} className="text-white/70 text-sm flex items-start">
                                                        <i className="fas fa-check text-brand-green mt-1 mr-2 text-xs"></i>
                                                        {project}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
