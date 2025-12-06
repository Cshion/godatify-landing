'use client';

import { useState, useEffect } from 'react';
import { Testimonial, CarouselConfig } from '@/types';
import styles from './Testimonials.module.css';
import Image from 'next/image';

interface TestimonialsProps {
  testimonials: Testimonial[];
  carouselConfig: CarouselConfig;
  title: string;
}

export default function Testimonials({ testimonials, carouselConfig, title }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { cardsPerView, autoPlayInterval } = carouselConfig;
  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      // Loop back to 0 if at end
      if (prev >= maxIndex) return 0;
      return Math.min(prev + cardsPerView, maxIndex);
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      // Loop to end if at start
      if (prev === 0) return maxIndex; // Or align to last page? simple maxIndex works
      return Math.max(prev - cardsPerView, 0);
    });
  };

  const goToPage = (pageIndex: number) => {
    setCurrentIndex(pageIndex * cardsPerView);
  };

  const totalPages = Math.ceil(testimonials.length / cardsPerView);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentPage = Math.floor(currentIndex / cardsPerView);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide(); // functionality is now built-in to loop
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, maxIndex, autoPlayInterval]);

  return (
    <section className={styles.testimonialsSection} id="testimonios">
      {/* Background with Overlay */}
      <div className={styles.overlay} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className={styles.subtitle}>NUESTROS CLIENTES</h3>
          <h2 className={styles.title}>Testimonios</h2>
          <p className={styles.description}>
            Vestibulum lectus mauris ultrices eros in. Cursus sit amet dictum sit amet.
            Adipiscing tristique risus nec feugiat the aenean bcom here
          </p>
        </div>

        {/* Carousel Container */}
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialsWrapper}>
            <div
              className={styles.testimonialsTrack}
              style={{
                transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className={styles.testimonialCard}>
                  {/* Quote Icon */}
                  <div className={styles.quoteIcon}></div>

                  {/* Content */}
                  <div className={styles.testimonialContent}>
                    <p className={styles.testimonialText}>
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Author */}
                  <div className={styles.testimonialAuthor}>
                    {testimonial.image && (
                      <div className={styles.authorImageWrapper}>
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          width={50}
                          height={50}
                          className={styles.authorImage}
                        />
                      </div>
                    )}
                    <div className={styles.authorInfo}>
                      <h4 className={styles.authorName}>
                        {testimonial.author}
                      </h4>
                      <p className={styles.authorRole}>{testimonial.role}</p>
                    </div>
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
            className={styles.carouselBtn}
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left" />
          </button>

          <div className={styles.dots}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                className={`${styles.dot} ${currentPage === idx ? styles.active : ''
                  }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className={styles.carouselBtn}
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
}
