'use client';

import { useState } from 'react';
import Image from 'next/image';
import { NosotrosContent } from '@/types';
import Icon from '@/components/ui/Icon';
import styles from './NosotrosTabs.module.css';

type Tab = 'quienes' | 'mision' | 'valores' | 'cultura';

interface NosotrosTabsProps {
    content: NosotrosContent;
}

export default function NosotrosTabs({ content }: NosotrosTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>('quienes');
    const { hero, mission, vision, values, culture, tabs, sectionImageUrl } = content;

    return (
        <section className={styles.tabsSection}>
            <div className={styles.container}>
                {/* Navigation */}
                <div className={styles.tabsNav} role="tablist" aria-label="Secciones sobre nosotros">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`tabpanel-${tab.id}`}
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id as Tab)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content - key forces re-render and animation on tab change */}
                <div 
                    className={styles.tabContent} 
                    key={activeTab}
                    role="tabpanel"
                    id={`tabpanel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                >

                    {/* Quiénes Somos */}
                    {activeTab === 'quienes' && (
                        <div className={styles.splitLayout}>
                            {/* Image Section (Left) */}
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={sectionImageUrl || '/images/nosotros-quienes.webp'}
                                    alt="Quiénes Somos - Datify"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className={styles.image}
                                    priority
                                />
                            </div>

                            {/* Text Content (Right) */}
                            <div className={styles.whoWeAre}>
                                <p className={styles.bigText}>{hero.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Misión y Visión */}
                    {activeTab === 'mision' && (
                        <div className={styles.splitLayout}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={mission.image}
                                    alt="Misión y Visión"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContent}>
                                <div className="mb-12">
                                    <h3>{mission.title}</h3>
                                    <p>{mission.text}</p>
                                </div>
                                <div>
                                    <h3>{vision.title}</h3>
                                    <p>{vision.text}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Valores */}
                    {activeTab === 'valores' && (
                        <div className={styles.valuesGrid}>
                            {values.map((value) => (
                                <div key={value.id} className={styles.valueCard}>
                                    <div className={styles.valueIcon}>
                                        <Icon name={value.icon} />
                                    </div>
                                    <h4 className={styles.valueTitle}>{value.title}</h4>
                                    <p className="text-gray-600 text-sm">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Cultura */}
                    {activeTab === 'cultura' && (
                        <div className={styles.splitLayout}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={culture.image}
                                    alt="Cultura Datify"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContent}>
                                <h3>{culture.title}</h3>
                                <p>{culture.description}</p>
                                <div className={styles.statsRow}>
                                    {culture.stats.map((stat, idx) => (
                                        <div key={idx} className={styles.statItem}>
                                            <span className={styles.statValue}>{stat.value}</span>
                                            <span className={styles.statLabel}>{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
