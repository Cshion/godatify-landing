'use client';

import { useState } from 'react';
import Image from 'next/image';
import { NOSOTROS_CONTENT, VIDEO_CONFIG } from '@/lib/constants';
import styles from './NosotrosTabs.module.css';

type Tab = 'quienes' | 'mision' | 'valores' | 'cultura';

export default function NosotrosTabs() {
    const [activeTab, setActiveTab] = useState<Tab>('quienes');
    const { hero, mission, vision, values, culture } = NOSOTROS_CONTENT;

    const tabs = [
        { id: 'quienes', label: 'Quiénes Somos' },
        { id: 'mision', label: 'Misión y Visión' },
        { id: 'valores', label: 'Valores' },
        { id: 'cultura', label: 'Cultura' },
    ];

    return (
        <section className={styles.tabsSection}>
            <div className={styles.container}>
                {/* Navigation */}
                <div className={styles.tabsNav}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id as Tab)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={styles.tabContent}>

                    {/* Quiénes Somos */}
                    {activeTab === 'quienes' && (
                        <div className={styles.splitLayout}>
                            {/* Video Section (Left) */}
                            <div className={styles.videoContainer}>
                                <div className={styles.videoWrapper}>
                                    <iframe
                                        src={VIDEO_CONFIG.url}
                                        title={VIDEO_CONFIG.title}
                                        className={styles.videoFrame}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
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
                                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
                                    alt="Misión y Visión"
                                    fill
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
                                        <i className={`fas fa-${value.icon}`}></i>
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
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                    alt="Cultura Datify"
                                    fill
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
