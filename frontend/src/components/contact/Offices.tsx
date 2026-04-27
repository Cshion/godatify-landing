import Link from 'next/link';
import Image from 'next/image';
import { Office } from '@/types';
import Icon from '@/components/ui/Icon';
import styles from './Offices.module.css';

interface OfficesProps {
    title: string;
    subtitle: string;
    offices: Office[];
}

export default function Offices({ title, subtitle, offices }: OfficesProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.sidebarTitle}>{title}</h2>
                <p className={styles.sidebarSubtitle}>{subtitle}</p>
            </div>
            <div className={styles.list}>
                {offices.map((office) => (
                    <div key={office.country} className={styles.card}>
                        <div className={styles.details}>
                            <div className={styles.infoRow}>
                                <Icon name="map-marker-alt" className={styles.infoIcon} />
                                <p>{office.address}</p>
                            </div>
                            <div className={styles.infoRow}>
                                <Icon name="phone" className={styles.infoIcon} />
                                <p>{office.phone}</p>
                            </div>
                            <div className={styles.infoRow}>
                                <Icon name="envelope" className={styles.infoIcon} />
                                <a href={`mailto:${office.email}`} className={styles.emailLink}>
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

