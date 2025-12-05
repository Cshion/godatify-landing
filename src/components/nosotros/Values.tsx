import { NOSOTROS_CONTENT } from '@/lib/constants';
import styles from './Values.module.css';

export default function Values() {
    const { values } = NOSOTROS_CONTENT;

    return (
        <section className={styles.section}>
            <div className="container mx-auto px-6">
                <div className={styles.header}>
                    <h2 className={`${styles.mainTitle} reveal`}>Nuestros Valores</h2>
                    <p className={`${styles.subtitle} reveal`}>
                        Los pilares que guían cada una de nuestras decisiones y proyectos
                    </p>
                </div>

                <div className={styles.grid}>
                    {values.map((value, index) => (
                        <div
                            key={value.id}
                            className={`${styles.card} reveal`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={styles.iconWrapper}>
                                <i className={`fas fa-${value.icon}`}></i>
                            </div>
                            <h3 className={styles.cardTitle}>{value.title}</h3>
                            <p className={styles.cardDescription}>{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
