import styles from './ServiceFeatures.module.css';

interface Feature {
    title: string;
    description: string;
}

interface ServiceFeaturesProps {
    features: readonly Feature[];
}

export default function ServiceFeatures({ features }: ServiceFeaturesProps) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {features.map((feature, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                <span className={styles.number}>0{idx + 1}</span>
                            </div>
                            <h3 className={styles.title}>{feature.title}</h3>
                            <p className={styles.description}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
