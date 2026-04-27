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
  // First service is featured, rest are compact
  const [featured, ...rest] = services;
  const compactServices = rest.slice(0, 5); // Show up to 5 compact

  if (!featured) return null;

  return (
    <section className={styles.servicesSection} id="servicios">
      <div className="container mx-auto px-6">
        <h2 className={styles.sectionTitle}>
          {title}
        </h2>

        <div className={styles.servicesLayout}>
          {/* Featured Service - Large */}
          <div className={styles.featuredService}>
            <div className={styles.featuredIcon}>
              <Icon name={featured.icon} />
            </div>
            <h3 className={styles.featuredTitle}>{featured.title}</h3>
            <p className={styles.featuredDescription}>
              {featured.description}
            </p>
            <Link 
              href={`/servicios/${featured.slug || featured.id}`} 
              className={styles.featuredCta}
              aria-label={`Leer más sobre ${featured.title}`}
            >
              {buttonText}
              <Icon name="arrow-right" />
            </Link>
          </div>

          {/* Compact Services - List */}
          <div className={styles.compactServices}>
            {compactServices.map((service) => (
              <Link 
                key={service.id} 
                href={`/servicios/${service.slug || service.id}`}
                className={styles.compactService}
              >
                <div className={styles.compactIcon}>
                  <Icon name={service.icon} />
                </div>
                <div className={styles.compactContent}>
                  <h4 className={styles.compactTitle}>{service.title}</h4>
                  <p className={styles.compactDescription}>{service.description}</p>
                </div>
                <span className={styles.compactArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.viewAllWrapper}>
          <Link href="/servicios" className={styles.viewAllLink}>
            Ver todos los servicios →
          </Link>
        </div>
      </div>
    </section>
  );
}
