'use client';

import { useState, useEffect, useCallback } from 'react';
import { Testimonial, CarouselConfig } from '@/types';
import styles from './Testimonials.module.css';
import Image from 'next/image';

interface TestimonialsProps {
  testimonials: Testimonial[];
  carouselConfig: CarouselConfig;
  title: string;
  subtitle: string;
  description: string;
}

export default function Testimonials({ testimonials, carouselConfig, title, subtitle, description }: TestimonialsProps) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const { autoPlayInterval } = carouselConfig;

  // Calculate total groups (3 testimonials per group)
  const itemsPerGroup = 3;
  const totalGroups = Math.ceil(testimonials.length / itemsPerGroup);

  const goToNextGroup = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setGroupIndex((prev) => (prev + 1) % totalGroups);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, totalGroups]);

  const goToPrevGroup = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setGroupIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, totalGroups]);

  const goToGroupIndex = (index: number) => {
    if (isAnimating || index === groupIndex) return;
    setIsAnimating(true);
    setGroupIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Auto-play with pause on hover/focus
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goToNextGroup, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, goToNextGroup, isPaused]);

  // Get current group of testimonials (up to 3)
  const startIndex = groupIndex * itemsPerGroup;
  const currentGroup = testimonials.slice(startIndex, startIndex + itemsPerGroup);

  if (currentGroup.length === 0) return null;

  return (
    <section 
      className={styles.testimonialsSection} 
      id="testimonios"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-6">
        {/* Header - Left aligned */}
        <div className={styles.header}>
          <span className={styles.subtitle}>{subtitle}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        {/* Three Quotes Grid */}
        <div className={styles.quotesGrid} key={groupIndex}>
          {currentGroup.map((testimonial, idx) => (
            <div key={idx} className={styles.quoteCard}>
              <blockquote className={styles.quote}>
                <p className={styles.quoteText}>"{testimonial.quote}"</p>
              </blockquote>
              
              <div className={styles.author}>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{testimonial.author}</span>
                  <span className={styles.authorRole}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation - only show if more than one group */}
        {totalGroups > 1 && (
          <div className={styles.navigation}>
            <button 
              onClick={goToPrevGroup}
              className={styles.navButton}
              aria-label="Grupo de testimonios anterior"
            >
              ←
            </button>
            
            <div className={styles.dots}>
              {Array.from({ length: totalGroups }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToGroupIndex(idx)}
                  className={`${styles.dot} ${idx === groupIndex ? styles.dotActive : ''}`}
                  aria-label={`Ir a grupo de testimonios ${idx + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={goToNextGroup}
              className={styles.navButton}
              aria-label="Siguiente grupo de testimonios"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
