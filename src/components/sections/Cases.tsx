'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CASES_CONTENT } from '@/data/cases';
import styles from './Cases.module.css';

export default function Cases() {
  const cases = CASES_CONTENT;

  return (
    <section className="section py-20 bg-white" id="casos">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
          Casos de Éxito
        </h2>

        <div className={styles.casesContainer}>
          <div className={styles.casesGrid}>
            {cases.map((caseItem) => (
              <div key={caseItem.slug} className={`${styles.caseCard} group reveal`}>
                {/* Image */}
                <div className={styles.caseImageWrapper}>
                  <Image
                    src={caseItem.image}
                    alt={caseItem.title}
                    width={400}
                    height={300}
                    className={styles.caseImage}
                  />

                  {/* Overlay */}
                  <div className={styles.caseOverlay}>
                    <Link href={`/casos/${caseItem.slug}`} className={styles.caseLink}>
                      Ver Proyecto
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className={styles.caseContent}>
                  <span className={styles.caseCategory}>
                    {caseItem.industry}
                  </span>
                  <h3 className={styles.caseTitle}>{caseItem.title}</h3>
                  <p className={styles.caseDescription}>{caseItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
