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
        <section
            id="testimonios"
            className="py-20 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #135c51 0%, #1C7C54 50%, #26a86f 100%)',
            }}
        >
            {/* Background Pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
                }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
                    Testimonios
                </h2>

                {/* Carousel Container */}
                <div className="max-w-7xl mx-auto overflow-hidden">
                    <div
                        className="flex gap-6 transition-transform duration-500 ease-out px-4"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / cardsPerView + 2)}%)`,
                        }}
                    >
                        {testimonialsData.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="flex-shrink-0 bg-white rounded-2xl p-8 shadow-xl relative"
                                style={{
                                    minWidth: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                                    maxWidth: '360px',
                                }}
                            >
                                {/* Quote Icon */}
                                <div className="absolute top-6 left-8 text-8xl text-gray-100 font-serif leading-none">
                                    "
                                </div>

                                {/* Content */}
                                <div className="relative z-10 mb-8">
                                    <p className="text-gray-700 leading-relaxed italic text-center">
                                        {testimonial.text}
                                    </p>
                                </div>

                                {/* Author */}
                                <div className="text-center">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                                        {testimonial.author}
                                    </h4>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="w-12 h-12 rounded-full bg-white text-[#1C7C54] border-2 border-[#1C7C54] flex items-center justify-center hover:bg-[#1C7C54] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="flex gap-3">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className={`h-3 rounded-full transition-all ${index === currentPage
                                        ? 'w-8 bg-white'
                                        : 'w-3 bg-white/40 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                        className="w-12 h-12 rounded-full bg-white text-[#1C7C54] border-2 border-[#1C7C54] flex items-center justify-center hover:bg-[#1C7C54] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Responsive Styles */}
            <style jsx>{`
        @media (max-width: 1024px) {
          .flex-shrink-0 {
            min-width: calc((100% - 1.5rem) / 2) !important;
          }
        }
        @media (max-width: 768px) {
          .flex-shrink-0 {
            min-width: 100% !important;
          }
        }
      `}</style>
        </section>
    );
}
