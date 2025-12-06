'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Stat, VideoConfig } from '@/types';
import styles from './Nosotros.module.css';

interface AnimatedStat extends Stat {
  current: number;
}

interface NosotrosProps {
  stats: Stat[];
  videoConfig: VideoConfig | null;
  title: string;
  buttonText: string;
}

export default function Nosotros({ stats: initialStats, videoConfig, title, buttonText }: NosotrosProps) {
  const [stats, setStats] = useState<AnimatedStat[]>(initialStats.map(s => ({ ...s, current: 0 })));
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Reset stats if initialStats changes (optional, but good for HMR)
    setStats(initialStats.map(s => ({ ...s, current: 0 })));
  }, [initialStats]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(timer);
        }

        setStats((prev) => {
          const newStats = [...prev];
          newStats[index] = { ...newStats[index], current: Math.floor(current) };
          return newStats;
        });
      }, duration / steps);
    });
  };

  return (
    <section className="section py-20 bg-white" id="nosotros" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
          {title}
        </h2>

        {/* Stats Grid */}
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={`${styles.statCard} reveal`}>
                <div className={styles.statNumber}>
                  {stat.current}+
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        {videoConfig && (
          <div className={styles.videoContainer}>
            <div className={styles.videoWrapper}>
              <iframe
                width="100%"
                height="500"
                src={videoConfig.url}
                title={videoConfig.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className={styles.videoCaption}>{videoConfig.caption}</p>
          </div>
        )}

        {/* CTA Button */}
        <div className={`${styles.ctaContainer} reveal`}>
          <Link href="/nosotros" className={styles.ctaButton}>
            {buttonText}
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
