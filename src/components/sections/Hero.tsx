import { api } from '@/lib/api';
import styles from './Hero.module.css';

export default async function Hero() {
  const heroContent = await api.home.getHeroContent();
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
            {heroContent.title}
          </h1>
          <p className={styles.heroSubtitle}>
            {heroContent.subtitle}
          </p>
          <a href={heroContent.ctaHref} className={`${styles.heroCta} reveal`}>
            {heroContent.ctaText}
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        {heroContent.scrollText}
      </div>
    </section>
  );
}
