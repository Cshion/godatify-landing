import Image from 'next/image';
import { CASES_CONTENT } from '@/lib/constants';
import CasesGrid from './CasesGrid';
import styles from './CaseDetail.module.css';

type CaseStudy = typeof CASES_CONTENT[number];

interface CaseDetailProps {
    caseStudy: CaseStudy;
}

export default function CaseDetail({ caseStudy }: CaseDetailProps) {
    // Get 3 related cases (excluding current one)
    const relatedCases = CASES_CONTENT
        .filter(c => c.slug !== caseStudy.slug)
        .slice(0, 3);

    return (
        <>
            <article className={styles.detailSection}>
                <div className={styles.container}>
                    {/* Header */}
                    <header className={styles.header}>
                        <span className={styles.industryTag}>{caseStudy.industry}</span>
                        <h1 className={styles.title}>{caseStudy.title}</h1>
                        <p className={styles.description}>{caseStudy.description}</p>
                    </header>

                    {/* Main Image */}
                    <div className={styles.mainImageWrapper}>
                        <Image
                            src={caseStudy.image}
                            alt={caseStudy.title}
                            fill
                            className={styles.mainImage}
                            priority
                        />
                    </div>

                    {/* Results (Impact Visualizer) */}
                    <div className={styles.resultsGrid}>
                        {caseStudy.results.map((result, idx) => (
                            <div key={idx} className={styles.resultItem}>
                                <span className={styles.resultValue}>{result.value}</span>
                                <span className={styles.resultLabel}>{result.label}</span>
                                <span className={styles.resultSuffix}>{result.suffix}</span>
                            </div>
                        ))}
                    </div>

                    {/* Content Body */}
                    <div
                        className={styles.contentBody}
                        dangerouslySetInnerHTML={{ __html: caseStudy.content }}
                    />

                    {/* Tech Stack */}
                    <div className={styles.techStack}>
                        <span className={styles.techTitle}>Tecnologías Utilizadas</span>
                        <div className={styles.techTags}>
                            {caseStudy.techStack.map((tech, idx) => (
                                <span key={idx} className={styles.techTag}>{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Cases Section */}
            <div className="bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 pt-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Otros Casos de Éxito
                    </h2>
                </div>
                <CasesGrid cases={relatedCases} />
            </div>
        </>
    );
}
