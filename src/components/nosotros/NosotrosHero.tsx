import { NOSOTROS_CONTENT } from '@/lib/constants';
import styles from './NosotrosHero.module.css';

export default function NosotrosHero() {
    const { hero } = NOSOTROS_CONTENT;

    return (
        <section className={styles.heroSection}>
            {/* Animated Particles */}
            <div className={styles.particles}>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
            </div>

            <div className="container mx-auto px-6">
                <div className={styles.content}>
                    <div className={styles.titleWrapper}>
                        <h1 className={`${styles.title} reveal`} data-text={hero.title}>
                            {hero.title}
                        </h1>
                    </div>
                    <h2 className={`${styles.subtitle} reveal`}>{hero.subtitle}</h2>
                </div>
            </div>
        </section>
    );
}
