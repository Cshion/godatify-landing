import { api } from '@/lib/api';
import styles from './IndustriesHero.module.css';

export default async function IndustriesHero() {
    const hero = await api.industries.getHero();

    return (
        <section className={styles.heroSection}>
            <div className={styles.content}>
                <h1 className={styles.title}>{hero.title}</h1>
                <p className={styles.subtitle}>{hero.description}</p>
            </div>
        </section>
    );
}
