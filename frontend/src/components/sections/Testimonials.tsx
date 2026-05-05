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
                <span className={styles.quoteIcon} aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </span>
                <p className={styles.quoteText}>{testimonial.quote}</p>
              </blockquote>
              
              <div className={styles.author}>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{testimonial.author}</span>
                  <span className={styles.authorRole}>{testimonial.role}</span>
                  {testimonial.linkedIn && (
                    <a 
                      href={testimonial.linkedIn} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.linkedinLink}
                    >
                      <svg className={styles.linkedinIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      Ver perfil
                    </a>
                  )}
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
