import styles from './ServiceTechStack.module.css';

interface TechItem {
    name: string;
    icon: string;
}

interface ServiceTechStackProps {
    techStack: readonly TechItem[];
}

const BRAND_ICONS = [
    'react', 'node-js', 'python', 'r-project', 'aws', 'microsoft',
    'docker', 'github', 'gitlab', 'bitbucket', 'android', 'apple',
    'linux', 'windows', 'google', 'facebook', 'twitter', 'linkedin',
    'instagram', 'youtube', 'whatsapp', 'slack', 'figma'
];

export default function ServiceTechStack({ techStack }: ServiceTechStackProps) {
    const getIconClass = (iconName: string) => {
        // Special cases or manual overrides if needed
        if (BRAND_ICONS.includes(iconName)) return 'fab';
        // Default to solid for others (like snowflake, server, database, etc.)
        return 'fas';
    };

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
                                <i className={`${getIconClass(tech.icon)} fa-${tech.icon} ${styles.icon}`}></i>
                            </div>
                            <span className={styles.techName}>{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
