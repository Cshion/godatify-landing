import styles from './ServiceTechStack.module.css';

interface TechItem {
    name: string;
    icon: string;
}

interface ServiceTechStackProps {
    techStack: readonly TechItem[];
}

export default function ServiceTechStack({ techStack }: ServiceTechStackProps) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Tecnologías que Dominamos</h2>
                </div>

                <div className={styles.grid}>
                    {techStack.map((tech, idx) => (
                        <div key={idx} className={styles.techCard}>
                            <div className={styles.iconWrapper}>
                                <i className={`fas fa-${tech.icon} ${styles.icon}`}></i>
                                {/* Fallback for custom icons if FontAwesome doesn't have them all, 
                                    in real app we'd use SVGs or specific library */}
                            </div>
                            <span className={styles.techName}>{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
