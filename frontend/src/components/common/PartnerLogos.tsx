import Image from 'next/image';
import styles from './PartnerLogos.module.css';

const partners = [
    { name: 'AWS', logo: '/images/partners/aws.svg' },
    { name: 'Microsoft Azure', logo: '/images/partners/azure.svg' },
    { name: 'Google Cloud', logo: '/images/partners/google-cloud.svg' },
    { name: 'Snowflake', logo: '/images/partners/snowflake.svg' },
    { name: 'Power BI', logo: '/images/partners/power-bi.svg' },
    { name: 'Databricks', logo: '/images/partners/databricks.svg' },
];

export default function PartnerLogos() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <p className={styles.label}>Tecnologías con las que trabajamos</p>
                <div className={styles.logoGrid}>
                    {partners.map((partner) => (
                        <div key={partner.name} className={styles.logoWrapper}>
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
