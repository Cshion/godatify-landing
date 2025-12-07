'use client';

import Link from 'next/link';
import { Service } from '@/types';
import Carousel from '@/components/ui/Carousel';
import styles from './Services.module.css';

interface ServicesProps {
  services: Service[];
  title: string;
  buttonText: string;
}

export default function Services({ services, title, buttonText }: ServicesProps) {
  return (
    <section className={`section py-20 ${styles.servicesSection}`} id="servicios">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
          {title}
        </h2>

        <div className={styles.servicesContainer}>
          <Carousel
            config={{
              autoPlay: true,
              autoPlayInterval: 5000,
              itemsPerView: { mobile: 1, tablet: 2, desktop: 3 }
            }}
          >
            {services.map((service) => (
              <div key={service.id} className={`${styles.serviceCard} group`} id={service.id}>
                <div className={styles.serviceIconWrapper}>
                  <div className={styles.serviceIcon}>
                    <i className={`fas fa-${service.icon}`}></i>
                  </div>
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
                <Link href={`/servicios/${service.id}`} className={styles.btnOutline} aria-label={`Leer más sobre ${service.title}`}>{buttonText}</Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
