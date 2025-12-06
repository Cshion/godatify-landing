import { ContactPageContent } from '@/types';
import styles from './ContactHero.module.css';

interface ContactHeroProps {
    hero: ContactPageContent['hero'];
}

export default function ContactHero({ hero }: ContactHeroProps) {
    return (
        <section className={styles.heroSection}>
            <div className="container mx-auto px-6">
                <div className={styles.content}>
                    <h1 className={styles.title}>{hero.title}</h1>
                    <p className={styles.subtitle}>{hero.subtitle}</p>
                </div>
            </div>
            {/* Background elements if needed */}
            <div className={styles.backgroundOverlay}></div>
        </section>
    );
}
