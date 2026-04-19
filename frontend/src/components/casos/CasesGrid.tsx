'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CaseStudy } from '@/types';
import Icon from '@/components/ui/Icon';
import styles from './CasesGrid.module.css';
import { getMoreCases } from '@/app/actions/cases';

interface CasesGridProps {
    cases: CaseStudy[];
    initialTotal: number;
}

const BATCH_SIZE = 6;

export default function CasesGrid({ cases: initialCases, initialTotal }: CasesGridProps) {
    const [items, setItems] = useState<CaseStudy[]>(initialCases);
    const [hasMore, setHasMore] = useState(initialCases.length < initialTotal);
    const loadingRef = useRef(false);
    const loader = useRef<HTMLDivElement>(null);

    const handleObserver = (entities: IntersectionObserverEntry[]) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore && !loadingRef.current) {
            loadMore();
        }
    };

    const loadMore = async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;

        try {
            const offset = items.length;
            const { cases: newCases, total } = await getMoreCases(offset, BATCH_SIZE);

            if (newCases.length === 0) {
                setHasMore(false);
            } else {
                setItems((prev) => {
                    const existingSlugs = new Set(prev.map(c => c.slug));
                    const uniqueNewCases = newCases.filter(c => !existingSlugs.has(c.slug));

                    if (uniqueNewCases.length === 0) {
                        setHasMore(false);
                        return prev;
                    }

                    if (prev.length + uniqueNewCases.length >= total) {
                        setHasMore(false);
                    }

                    return [...prev, ...uniqueNewCases];
                });
            }
        } catch (error) {
            console.error('Failed to load more cases:', error);
            setHasMore(false);
        } finally {
            loadingRef.current = false;
        }
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) observer.observe(loader.current);

        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [items, hasMore]);

    return (
        <section className={styles.gridSection}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {items.map((caseStudy) => (
                        <Link href={`/casos/${caseStudy.slug}`} key={caseStudy.slug} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={caseStudy.image}
                                    alt={caseStudy.title}
                                    fill
                                    className={styles.cardImage}
                                />
                                <div className={styles.overlay}>
                                    <span className={styles.viewButton}>Ver Caso Completo</span>
                                </div>
                            </div>

                            <div className={styles.content}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={styles.industryTag}>{caseStudy.industry}</span>
                                    {/* Client Logo or Name */}
                                    {'client' in caseStudy && (
                                        <div className="flex items-center">
                                            {caseStudy.client.anonymous ? (
                                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                                                    <Icon name="user-secret" className="mr-1" />
                                                    Confidencial
                                                </span>
                                            ) : caseStudy.client.logo ? (
                                                <div className="relative w-20 h-8">
                                                    <Image
                                                        src={caseStudy.client.logo}
                                                        alt={caseStudy.client.name}
                                                        fill
                                                        className="object-contain opacity-80"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-600 font-medium">
                                                    {caseStudy.client.name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <h3 className={styles.title}>{caseStudy.title}</h3>
                                <p className={styles.description}>{caseStudy.description}</p>

                                <div className={styles.resultsPreview}>
                                    {caseStudy.results.slice(0, 2).map((result, idx) => (
                                        <div key={idx} className={styles.resultItem}>
                                            <span className={styles.resultValue}>{result.value}</span>
                                            <span className={styles.resultLabel}>{result.suffix}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {hasMore && (
                    <div ref={loader} className="flex justify-center w-full py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                )}
            </div>
        </section>
    );
}
