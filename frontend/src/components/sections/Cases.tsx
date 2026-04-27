'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CaseStudy } from '@/types';
import styles from './Cases.module.css';

interface CasesProps {
  cases: CaseStudy[];
  title: string;
  buttonText: string;
}

export default function Cases({ cases, title, buttonText }: CasesProps) {
  // Featured case is the first one, supporting cases are the rest
  const [featured, ...supporting] = cases;
  const displayedSupporting = supporting.slice(0, 3);

  if (!featured) return null;

  return (
    <section className={styles.casesSection} id="casos">
      <div className="container mx-auto px-6">
        <h2 className={styles.sectionTitle}>
          {title}
        </h2>

        <div className={styles.casesLayout}>
          {/* Featured Case - Large spotlight */}
          <Link href={`/casos/${featured.slug}`} className={styles.featuredCase}>
            <div className={styles.featuredImageWrapper}>
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className={styles.featuredImage}
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className={styles.featuredOverlay} />
            </div>
            <div className={styles.featuredContent}>
              <span className={styles.featuredIndustry}>{featured.industry}</span>
              <h3 className={styles.featuredTitle}>{featured.title}</h3>
              <p className={styles.featuredDescription}>{featured.description}</p>
              <span className={styles.featuredLink}>
                {buttonText} →
              </span>
            </div>
          </Link>

          {/* Supporting Cases - Compact list */}
          <div className={styles.supportingCases}>
            {displayedSupporting.map((caseStudy) => (
              <Link 
                key={caseStudy.slug} 
                href={`/casos/${caseStudy.slug}`}
                className={styles.supportingCase}
              >
                <div className={styles.supportingImageWrapper}>
                  <Image
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    fill
                    className={styles.supportingImage}
                    sizes="120px"
                  />
                </div>
                <div className={styles.supportingContent}>
                  <span className={styles.supportingIndustry}>{caseStudy.industry}</span>
                  <h4 className={styles.supportingTitle}>{caseStudy.title}</h4>
                </div>
              </Link>
            ))}
            
            {/* View all link */}
            <Link href="/casos" className={styles.viewAllLink}>
              Ver todos los casos →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
