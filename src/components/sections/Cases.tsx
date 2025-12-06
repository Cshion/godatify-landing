'use client';

import { useState, useEffect } from 'react';

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


  return (
    <section className="section py-20 bg-white" id="casos">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
          {title}
        </h2>

        <div className={styles.casesContainer}>
          <div className={styles.casesGrid}>
            {cases.slice(0, 3).map((caseStudy) => (
              <div key={caseStudy.slug} className={`${styles.caseCard} group reveal`}>
                {/* Image */}
                <div className={styles.caseImageWrapper}>
                  <Image
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    width={400}
                    height={300}
                    className={styles.caseImage}
                  />

                  {/* Overlay */}
                  <div className={styles.caseOverlay}>
                    <Link href={`/casos/${caseStudy.slug}`} className={styles.caseLink}>
                      {buttonText}
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className={styles.caseContent}>
                  <span className={styles.caseCategory}>
                    {caseStudy.industry}
                  </span>
                  <h3 className={styles.caseTitle}>{caseStudy.title}</h3>
                  <p className={styles.caseDescription}>{caseStudy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
