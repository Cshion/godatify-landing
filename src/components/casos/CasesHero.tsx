import styles from './CasesHero.module.css';

export default function CasesHero() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.content}>
                <h1 className={styles.title}>Impacto Real</h1>
                <p className={styles.subtitle}>
                    No solo entregamos tecnología, entregamos resultados de negocio medibles.
                    Descubre cómo transformamos datos en rentabilidad.
                </p>

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>+50</span>
                        <span className={styles.statLabel}>Proyectos Exitosos</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>$10M+</span>
                        <span className={styles.statLabel}>Valor Generado</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>100%</span>
                        <span className={styles.statLabel}>Retención de Clientes</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
