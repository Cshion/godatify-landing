import styles from './ServiceMethodology.module.css';

interface MethodologyStep {
    title: string;
    description: string;
}

interface ServiceMethodologyProps {
    steps: readonly MethodologyStep[];
}

export default function ServiceMethodology({ steps }: ServiceMethodologyProps) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Nuestra Metodología</h2>
                    <p className={styles.subtitle}>Un proceso probado para garantizar resultados</p>
                </div>

                <div className={styles.stepsGrid}>
                    {steps.map((step, idx) => (
                        <div key={idx} className={styles.stepCard}>
                            <div className={styles.stepNumber}>0{idx + 1}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.description}</p>
                            {idx < steps.length - 1 && <div className={styles.connector} />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
