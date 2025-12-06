import { HERO_CONTENT, STATS, VIDEO_CONFIG } from '@/data/home';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section
      className={`${styles.heroSection} relative min-h-screen flex items-center justify-center overflow-hidden`}
      id="inicio"
      style={{
        backgroundImage: 'url(/images/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(90deg, rgba(19, 92, 81, 0.85) 0%, rgba(19, 92, 81, 0.6) 50%, rgba(19, 92, 81, 0.4) 100%)',
        }}
      />

      <div className="container relative z-10">
        <div className={styles.heroContainer}>
          <h1 className={`${styles.heroTitle} reveal`}>
            {HERO_CONTENT.title}
          </h1>
          <p className={styles.heroSubtitle}>
            {HERO_CONTENT.subtitle}
          </p>
          <a href={HERO_CONTENT.ctaHref} className={`${styles.heroCta} reveal`}>
            {HERO_CONTENT.ctaText}
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        {HERO_CONTENT.scrollText}
      </div>
    </section>
  );
}
