import Image from 'next/image';
import styles from './ServiceHero.module.css';

interface ServiceHeroProps {
    title: string;
    subtitle: string;
    description: string;
    image?: string;
}

export default function ServiceHero({ title, subtitle, description, image }: ServiceHeroProps) {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                {image && (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className={styles.backgroundImage}
                        priority
                    />
                )}
                <div className={styles.overlay}></div>
                <div className={styles.grid}></div>
                <div className={styles.glow}></div>
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.subtitle}>{subtitle}</span>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.description}>{description}</p>
                </div>
            </div>
        </section>
    );
}
