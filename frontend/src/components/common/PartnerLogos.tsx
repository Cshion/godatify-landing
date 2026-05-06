'use client';

import styles from './PartnerLogos.module.css';

const partners = [
    { name: 'AWS', logo: '/images/partners/aws.svg' },
    { name: 'Microsoft Azure', logo: '/images/partners/azure.svg' },
    { name: 'Google Cloud', logo: '/images/partners/google-cloud.svg' },
    { name: 'Power BI', logo: '/images/partners/power-bi.svg' },
    { name: 'Databricks', logo: '/images/partners/databricks.svg' },
];

export default function PartnerLogos() {
    // Duplicate the list to ensure seamless scrolling
    const marqueePartners = [...partners, ...partners];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <p className={styles.label}>Tecnologías con las que trabajamos</p>
            </div>
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
                    {marqueePartners.map((partner, idx) => (
                        <div key={idx} className={styles.logoCard}>
                            {/* Using img for external SVGs — Next Image doesn't support external SVGs well */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={partner.logo} 
                                alt={partner.name}
                                className={styles.logo}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
