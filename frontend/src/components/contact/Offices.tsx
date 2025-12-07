import Link from 'next/link';
import Image from 'next/image';
import { Office } from '@/types';
import styles from './Offices.module.css';

interface OfficesProps {
    title: string;
    subtitle: string;
    offices: Office[];
}

export default function Offices({ title, subtitle, offices }: OfficesProps) {
    return (
        <div className={styles.wrapper}>
            <div className="mb-8">
                <h2 className={styles.sidebarTitle}>{title}</h2>
                <p className={styles.sidebarSubtitle}>{subtitle}</p>
            </div>
            <div className={styles.list}>
                {offices.map((office) => (
                    <div key={office.country} className={styles.card}>
                        <div className={styles.details}>
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
    );
}

