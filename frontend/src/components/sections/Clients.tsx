'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Client } from '@/types';
import styles from './Clients.module.css';

interface ClientsProps {
    clients: Client[];
    title: string;
}

export default function Clients({ clients, title }: ClientsProps) {

    // Duplicate the list to ensure seamless scrolling
    const marqueeClients = [...clients, ...clients];

    return (
        <section className={styles.clientsSection}>
            <div className="container mx-auto px-6">
                <h2 className={styles.title}>{title}</h2>

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
