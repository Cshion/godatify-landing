'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Stat, VideoConfig } from '@/types';
import Icon from '@/components/ui/Icon';
import styles from './Nosotros.module.css';

interface NosotrosProps {
  stats: Stat[];
  videoConfig: VideoConfig | null;
  sectionImageUrl?: string;
  title: string;
  buttonText: string;
}

export default function Nosotros({ stats, videoConfig, sectionImageUrl, title, buttonText }: NosotrosProps) {
  // Determine which media to show: image takes priority over video
  const hasImage = Boolean(sectionImageUrl);
  const hasVideo = Boolean(videoConfig?.url);
  
  // Check media type for proper rendering
  const isAnimatedFormat = /\.(gif|webp)$/i.test(sectionImageUrl || '');
  const isVideoFile = /\.(mp4|webm|mov)$/i.test(sectionImageUrl || '');

  return (
    <section className={styles.nosotrosSection} id="nosotros">
      <div className="container mx-auto px-6">
        <div className={styles.splitLayout}>
          {/* Media Section - Left side (image or video) */}
          {(hasImage || hasVideo) && (
            <div className={styles.videoSide}>
              <div className={styles.videoWrapper}>
                {hasImage ? (
                  isVideoFile ? (
                    // Local video file (MP4, WebM, MOV) - renders as looping video
                    <video
                      src={sectionImageUrl!}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={styles.sectionImage}
                    />
                  ) : (
                    // Image (including animated GIF/WebP)
                    <Image
                      src={sectionImageUrl!}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className={styles.sectionImage}
                      priority
                      unoptimized={isAnimatedFormat}
                    />
                  )
                ) : videoConfig && (
                  // YouTube/Vimeo embed
                  <iframe
                    src={videoConfig.url}
                    title={videoConfig.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
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
