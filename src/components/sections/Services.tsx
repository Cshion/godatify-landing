'use client';

import servicesData from '@/lib/data/services.json';
import { Service } from '@/lib/types';
import styles from './Services.module.css';

export default function Services() {
  const services: Service[] = servicesData;

  return (
    <section className={`section py-20 ${styles.servicesSection}`} id="servicios">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
          Nuestros Servicios
        </h2>

        <div className={styles.servicesContainer}>
          <div className={styles.servicesGrid}>
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
                <a href="#" className={styles.btnOutline}>Leer Más</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
