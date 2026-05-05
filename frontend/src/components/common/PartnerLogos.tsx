import Image from 'next/image';
import styles from './PartnerLogos.module.css';

// TODO: Before production, download these logos to /public/images/partners/ to avoid external dependencies
const partners = [
    { name: 'AWS', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { name: 'Microsoft Azure', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg' },
    { name: 'Google Cloud', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg' },
    { name: 'Snowflake', logo: 'https://www.vectorlogo.zone/logos/snowflake/snowflake-ar21.svg' },
    { name: 'Power BI', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg' },
    { name: 'Databricks', logo: 'https://www.vectorlogo.zone/logos/databricks/databricks-ar21.svg' },
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
