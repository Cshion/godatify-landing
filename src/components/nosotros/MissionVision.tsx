import { NOSOTROS_CONTENT } from '@/lib/constants';
import styles from './MissionVision.module.css';

export default function MissionVision() {
    const { mission, vision } = NOSOTROS_CONTENT;

    return (
        <section className={styles.section}>
            <div className="container mx-auto px-6">
                <div className={styles.grid}>
                    {/* Mission */}
                    <div className={`${styles.card} reveal`}>
                        <h2 className={styles.title}>{mission.title}</h2>
                        <p className={styles.text}>{mission.text}</p>
                    </div>

                    {/* Vision */}
                    <div className={`${styles.card} reveal`}>
                        <h2 className={styles.title}>{vision.title}</h2>
                        <p className={styles.text}>{vision.text}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
