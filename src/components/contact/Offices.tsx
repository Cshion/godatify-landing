import Link from 'next/link';
import Image from 'next/image';
import { Office } from '@/types';
import styles from './Offices.module.css';

interface OfficesProps {
    offices: Office[];
}

export default function Offices({ offices }: OfficesProps) {
    return (
        <section className={styles.section}>
            <div className="container mx-auto px-6">
                <div className={styles.grid}>
                    {offices.map((office) => (
                        <div key={office.country} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {office.image && (
                                    <Image
                                        src={office.image}
                                        alt={`Oficina ${office.country}`}
                                        fill
                                        className={styles.image}
                                    />
                                )}
                                <div className={styles.overlay}>
                                    <h3 className={styles.country}>{office.country}</h3>
                                </div>
                            </div>
                            <div className={styles.details}>
                                <h4 className={styles.city}>{office.city}</h4>
                                <div className={styles.infoRow}>
                                    <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                                    <p>{office.address}</p>
                                </div>
                                <div className={styles.infoRow}>
                                    <i className="fas fa-phone text-primary mt-1"></i>
                                    <p>{office.phone}</p>
                                </div>
                                <div className={styles.infoRow}>
                                    <i className="fas fa-envelope text-primary mt-1"></i>
                                    <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">
                                        {office.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
