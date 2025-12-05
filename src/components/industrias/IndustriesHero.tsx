import { INDUSTRIES_CONTENT } from '@/lib/constants';
import styles from './IndustriesHero.module.css';

export default function IndustriesHero() {
    const { hero } = INDUSTRIES_CONTENT;

    return (
        <section className={styles.heroSection}>
            <div className={styles.content}>
                <h1 className={styles.title}>{hero.title}</h1>
                <p className={styles.subtitle}>{hero.description}</p>
            </div>
        </section>
    );
}
