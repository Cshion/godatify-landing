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
  // Display all 5 services as timeline phases (OPP 1)
  const phases = services.slice(0, 5);

  if (!phases.length) return null;

  return (
    <section className={styles.servicesSection} id="servicios">
      <div className="container mx-auto px-6">
        <h2 className={styles.sectionTitle}>
          {title}
        </h2>

        {/* Timeline Layout - 5 Phases */}
        <div 
          className={styles.servicesLayout}
          role="tablist"
          aria-label="Fases de transformación de datos"
        >
          {phases.map((service, index) => (
            <Link
              key={service.id}
              href={`/servicios/${service.slug || service.id}`}
              className={styles.timelinePhase}
              role="tab"
              tabIndex={index === 0 ? 0 : -1}
              aria-label={`Fase ${index + 1}: ${service.title}`}
              aria-selected={index === 0}
            >
              <div className={styles.timelineIcon}>
                <Icon name={service.icon} />
              </div>
              <h3 className={styles.timelineTitle}>{service.title}</h3>
              <p className={styles.timelineDescription}>
                {service.description}
              </p>
            </Link>
          ))}
        </div>

        {/* View All Services */}
        <div className={styles.viewAllWrapper}>
          <Link href="/servicios" className={styles.viewAllLink}>
            Ver todos los servicios →
          </Link>
        </div>
      </div>
    </section>
  );
}
