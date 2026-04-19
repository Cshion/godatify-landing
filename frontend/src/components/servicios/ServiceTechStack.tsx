import Icon from '@/components/ui/Icon';
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
                    {(techStack || []).map((tech, idx) => (
                        <div key={idx} className={styles.techCard}>
                            <div className={styles.iconWrapper}>
                                <Icon name={tech.icon} className={styles.icon} />
                            </div>
                            <span className={styles.techName}>{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
