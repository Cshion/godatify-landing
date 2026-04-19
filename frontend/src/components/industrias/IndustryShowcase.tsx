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
            <div className="container mx-auto px-6">

                {/* Sector Tabs - Desktop: Horizontal, Mobile: Scrollable */}
                <div className="flex overflow-x-auto pb-4 gap-4 mb-12 border-b border-gray-200 hide-scrollbar">
                    {sectors.map((sector) => (
                        <button
                            key={sector.slug}
                            onClick={() => setActiveSector(sector)}
                            className={`whitespace-nowrap px-6 py-3 rounded-t-lg font-semibold transition-all duration-300 relative ${activeSector.slug === sector.slug
                                    ? 'text-primary bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-b-2 border-brand-green'
                                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                                }`}
                        >
                            {sector.title}
                            {/* Animated Underline */}
                            {activeSector.slug === sector.slug && (
                                <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-green" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Active Sector Content */}
                <div className="grid lg:grid-cols-12 gap-12 animate-fadeIn">

                    {/* Left: Sector Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-primary mb-4">{activeSector.title}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">{activeSector.description}</p>
                        </div>

                        {/* Decorative or Info Card */}
                        <div className="bg-brand-green/5 p-8 rounded-2xl border border-brand-green/10">
                            <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                                <Icon name="chart-line" className="text-brand-green" />
                                Impacto Transformador
                            </h3>
                            <p className="text-sm text-gray-600">
                                Nuestras soluciones en {activeSector.title} están diseñadas para maximizar eficiencia y reducir costos operativos mediante analítica avanzada.
                            </p>
                        </div>
                    </div>

                    {/* Right: Industries Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {(activeSector.industries || []).map((industry) => (
                                <Link
                                    key={industry.slug}
                                    href={`/industrias/${industry.slug}`}
                                    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                    <h3 className="text-xl font-bold text-primary mb-3 relative z-10 group-hover:text-brand-green transition-colors">
                                        {industry.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6 relative z-10 line-clamp-2">
                                        {industry.description}
                                    </p>

                                    <div className="flex items-center text-brand-green font-semibold text-sm group-hover:translate-x-2 transition-transform">
                                        Explorar Soluciones <Icon name="arrow-right" className="ml-2" />
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
