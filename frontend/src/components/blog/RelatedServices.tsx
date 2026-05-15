import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import styles from './RelatedServices.module.css';
import { Service } from '@/types';

interface RelatedServicesProps {
  services: Service[];
}

export default function RelatedServices({ services }: RelatedServicesProps) {
  // Filter out services without slugs
  const validServices = services.filter((s) => s.slug);
  if (validServices.length === 0) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Servicios Relacionados</h3>
      <div className={styles.grid}>
        {validServices.map((service) => (
          <Link
            key={service.slug}
            href={`/servicios/${service.slug}`}
            className={styles.card}
          >
            <Icon name={service.icon} className={styles.icon} />
            <div>
              <h4 className={styles.cardTitle}>{service.title}</h4>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
