import Link from 'next/link';
import Image from 'next/image';
import { CaseStudy } from '@/types';
import styles from './CasesGrid.module.css';

interface CasesGridProps {
    cases: CaseStudy[];
}

export default function CasesGrid({ cases }: CasesGridProps) {
    return (
        <section className={styles.gridSection}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {cases.map((caseStudy) => (
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
                                                    <i className="fas fa-user-secret mr-1"></i>
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
            </div>
        </section>
    );
}
