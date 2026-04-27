'use client';

import Link from 'next/link';
import { Stat, VideoConfig } from '@/types';
import Icon from '@/components/ui/Icon';
import styles from './Nosotros.module.css';

interface NosotrosProps {
  stats: Stat[];
  videoConfig: VideoConfig | null;
  title: string;
  buttonText: string;
}

export default function Nosotros({ stats, videoConfig, title, buttonText }: NosotrosProps) {
  return (
    <section className={styles.nosotrosSection} id="nosotros">
      <div className="container mx-auto px-6">
        <div className={styles.splitLayout}>
          {/* Video Section - Left side */}
          {videoConfig && (
            <div className={styles.videoSide}>
              <div className={styles.videoWrapper}>
                <iframe
                  src={videoConfig.url}
                  title={videoConfig.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Content - Right side */}
          <div className={styles.contentSide}>
            <h2 className={styles.sectionTitle}>
              {title}
            </h2>
            
            {videoConfig?.caption && (
              <p className={styles.description}>{videoConfig.caption}</p>
            )}

            {/* Stats as vertical list with prominent numbers */}
            {stats.length > 0 && (
              <div className={styles.statsList}>
                {stats.map((stat, index) => (
                  <div key={index} className={styles.statItem}>
                    <span className={styles.statNumber}>{stat.target}+</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            <Link href="/nosotros" className={styles.ctaButton}>
              {buttonText}
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
