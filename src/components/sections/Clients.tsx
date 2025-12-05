'use client';

import Image from 'next/image';
import { CLIENTS_CONTENT } from '@/lib/constants';
import styles from './Clients.module.css';

export default function Clients() {
    // Duplicate the list to ensure seamless scrolling
    const marqueeClients = [...CLIENTS_CONTENT, ...CLIENTS_CONTENT];

    return (
        <section className={styles.clientsSection}>
            <div className="container mx-auto px-6">
                <h2 className={styles.title}>Confían en Nosotros</h2>

                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {marqueeClients.map((client, idx) => (
                            <div key={idx} className={styles.clientCard}>
                                <div className={styles.logoWrapper}>
                                    <Image
                                        src={client.logo}
                                        alt={`Logo ${client.name}`}
                                        fill
                                        className={styles.logo}
                                        sizes="160px"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
