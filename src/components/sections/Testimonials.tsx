'use client';

import { useState, useEffect } from 'react';
import testimonialsData from '@/lib/data/testimonials.json';

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsPerView = 3;
    const maxIndex = Math.max(0, testimonialsData.length - cardsPerView);

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + cardsPerView, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - cardsPerView, 0));
    };

    const goToPage = (pageIndex: number) => {
        setCurrentIndex(pageIndex * cardsPerView);
    };

    const totalPages = Math.ceil(testimonialsData.length / cardsPerView);
    const currentPage = Math.floor(currentIndex / cardsPerView);

    // Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex >= maxIndex) {
                setCurrentIndex(0);
            } else {
                nextSlide();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, maxIndex]);

    return (
        <>
            <section
                className="section py-20 testimonials-section"
                id="testimonios"
            >
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white reveal">
                        Testimonios
                    </h2>

                    {/* Carousel Container */}
                    <div className="testimonials-container">
                        <div className="testimonials-wrapper">
                            <div
                                className="testimonials-track"
                                style={{
                                    transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
                                }}
                            >
                                {testimonialsData.map((testimonial) => (
                                    <div key={testimonial.id} className="testimonial-card">
                                        {/* Quote Icon */}
                                        <div className="quote-icon">"</div>

                                        {/* Content */}
                                        <div className="testimonial-content">
                                            <p className="testimonial-text">
                                                {testimonial.text}
                                            </p>
                                        </div>

                                        {/* Author */}
                                        <div className="testimonial-author">
                                            <h4 className="author-name">
                                                {testimonial.author}
                                            </h4>
                                            <p className="author-role">{testimonial.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="carousel-controls">
                        <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className="carousel-btn"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        {/* Dots */}
                        <div className="carousel-dots">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index)}
                                    className={`carousel-dot ${index === currentPage ? 'active' : ''}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            disabled={currentIndex >= maxIndex}
                            className="carousel-btn"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            <style jsx global>{`
        .testimonials-section {
          background: linear-gradient(135deg, #135c51 0%, #1C7C54 50%, #26a86f 100%);
          position: relative;
          overflow: hidden;
        }

        .testimonials-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .testimonials-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .testimonials-wrapper {
          overflow: hidden;
          padding: 0 1rem;
        }

        .testimonials-track {
          display: flex;
          gap: 1.5rem;
          transition: transform 0.5s ease;
        }

        .testimonial-card {
          flex: 0 0 calc(33.333% - 1rem);
          max-width: 340px;
          background: white;
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
        }

        .quote-icon {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          font-size: 5rem;
          font-family: Georgia, serif;
          color: #f3f4f6;
          line-height: 1;
          z-index: 0;
        }

        .testimonial-content {
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
        }

        .testimonial-text {
          color: #374151;
          line-height: 1.6;
          font-style: italic;
          text-align: center;
          font-size: 0.95rem;
        }

        .testimonial-author {
          text-align: center;
        }

        .author-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .author-role {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .carousel-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .carousel-btn {
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          background: white;
          color: #1C7C54;
          border: 2px solid #1C7C54;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.125rem;
        }

        .carousel-btn:hover:not(:disabled) {
          background: #1C7C54;
          color: white;
          transform: scale(1.1);
        }

        .carousel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .carousel-dots {
          display: flex;
          gap: 0.75rem;
        }

        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .carousel-dot.active {
          background: white;
          width: 32px;
        }

        .carousel-dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 1024px) {
          .testimonial-card {
            flex: 0 0 calc(50% - 0.75rem);
          }
        }

        @media (max-width: 768px) {
          .testimonial-card {
            flex: 0 0 100%;
            max-width: 100%;
          }

          .testimonials-wrapper {
            padding: 0;
          }

          .testimonials-track {
            gap: 1rem;
          }
        }
      `}</style>
        </>
    );
}
