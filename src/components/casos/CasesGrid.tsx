import Link from 'next/link';
import Image from 'next/image';
import { CASES_CONTENT } from '@/lib/constants';
import styles from './CasesGrid.module.css';

interface CasesGridProps {
    cases?: typeof CASES_CONTENT;
}

export default function CasesGrid({ cases = CASES_CONTENT }: CasesGridProps) {
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
                                <span className={styles.industryTag}>{caseStudy.industry}</span>
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
