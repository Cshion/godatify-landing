import { HeroContent } from '@/types';
import styles from './Hero.module.css';

interface HeroProps {
  heroContent: HeroContent;
}

export default function Hero({ heroContent }: HeroProps) {
  return (
    <section
      className={`${styles.heroSection} relative min-h-screen flex items-center justify-center overflow-hidden`}
      id="inicio"
      style={{
        backgroundImage: `url(${heroContent.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: heroContent.gradient,
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
