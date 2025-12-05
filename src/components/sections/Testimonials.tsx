'use client';

import { useState, useEffect } from 'react';
import testimonialsData from '@/lib/data/testimonials.json';
import { Testimonial } from '@/lib/types';
import { CAROUSEL_CONFIG } from '@/lib/constants';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials: Testimonial[] = testimonialsData;
  const { cardsPerView, autoPlayInterval } = CAROUSEL_CONFIG;

  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + cardsPerView, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - cardsPerView, 0));
  };

  const goToPage = (pageIndex: number) => {
    setCurrentIndex(pageIndex * cardsPerView);
  };

  const totalPages = Math.ceil(testimonials.length / cardsPerView);
  const currentPage = Math.floor(currentIndex / cardsPerView);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex >= maxIndex) {
        setCurrentIndex(0);
      } else {
        nextSlide();
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, maxIndex, autoPlayInterval]);

  return (
    <section
      className={`section py-20 ${styles.testimonialsSection}`}
      id="testimonios"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white reveal">
          Testimonios
        </h2>

        {/* Carousel Container */}
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialsWrapper}>
            <div
              className={styles.testimonialsTrack}
              style={{
                transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.testimonialCard}>
                  {/* Quote Icon */}
                  <div className={styles.quoteIcon}>"</div>

                  {/* Content */}
                  <div className={styles.testimonialContent}>
                    <p className={styles.testimonialText}>
                      {testimonial.text}
                    </p>
                  </div>

                  {/* Author */}
                  <div className={styles.testimonialAuthor}>
                    <h4 className={styles.authorName}>
                      {testimonial.author}
                    </h4>
                    <p className={styles.authorRole}>{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.carouselControls}>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={styles.carouselBtn}
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Dots */}
          <div className={styles.carouselDots}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`${styles.carouselDot} ${index === currentPage ? styles.active : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={styles.carouselBtn}
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
