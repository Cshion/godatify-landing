'use client';

import Link from 'next/link';
import { Service } from '@/types';
import Icon from '@/components/ui/Icon';
import styles from './Services.module.css';

interface ServicesProps {
  services: Service[];
  title: string;
  buttonText: string;
}

export default function Services({ services, title, buttonText }: ServicesProps) {
  // Source data order: [0]=BigData, [1]=Analytics, [2]=BI, [3]=DataEng, [4]=Platform
  // User journey order: Platform → BigData → DataEng → BI → Analytics
  const reorderedPhases = [
    services[4], // Phase 1: Digital Platform (data-entry applications)
    services[0], // Phase 2: Big Data Management (data lakes)
    services[3], // Phase 3: Data Engineering (ETL + governance)
    services[2], // Phase 4: Business Intelligence
    services[1], // Phase 5: Business Analytics
  ].filter(Boolean);

  if (!reorderedPhases.length) return null;

  return (
    <section className={styles.servicesSection} id="servicios">
      <div className="container mx-auto px-6">
        <h2 className={styles.sectionTitle}>{title}</h2>
        
        <p className={styles.sectionSubtitle}>
          Nuestra metodología de transformación de datos en 5 fases
        </p>

        {/* Methodology Cards */}
        <div className={styles.methodologyGrid}>
          {reorderedPhases.map((service, index) => (
            <Link
              key={service.id}
              href={`/servicios/${service.slug || service.id}`}
              className={styles.methodologyCard}
            >
              {/* Phase Number */}
              <span className={styles.phaseNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div className={styles.cardIcon}>
                <Icon name={service.icon} />
              </div>

              {/* Title */}
              <h3 className={styles.cardTitle}>{service.title}</h3>

              {/* Description */}
              <p className={styles.cardDescription}>{service.description}</p>

              {/* Arrow indicator */}
              <span className={styles.cardArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
