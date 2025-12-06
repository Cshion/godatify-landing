'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Client } from '@/types';
import styles from './Clients.module.css';

export default function Clients() {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const fetchClients = async () => {
            const data = await api.home.getClients();
            setClients(data);
        };
        fetchClients();
    }, []);

    // Duplicate the list to ensure seamless scrolling
    const marqueeClients = [...clients, ...clients];

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
                                        src={client.logo || ''}
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
