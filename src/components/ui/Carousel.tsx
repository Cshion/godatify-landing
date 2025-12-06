'use client';

import { useState, useEffect, ReactNode, Children, useCallback } from 'react';
import styles from './Carousel.module.css';

interface CarouselConfig {
    autoPlay?: boolean;
    autoPlayInterval?: number;
    itemsPerView?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}

interface CarouselProps {
    children: ReactNode;
    config?: CarouselConfig;
    className?: string;
}

export default function Carousel({ children, config = {}, className = '' }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const items = Children.toArray(children);
    const totalItems = items.length;

    // Default config values
    const autoPlay = config.autoPlay ?? true;
    const intervalTime = config.autoPlayInterval || 5000;
    const viewConfig = config.itemsPerView || { mobile: 1, tablet: 2, desktop: 3 };

    // Responsive items per view
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setItemsPerView(viewConfig.mobile);
            } else if (width < 1024) {
                setItemsPerView(viewConfig.tablet);
            } else {
                setItemsPerView(viewConfig.desktop);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [viewConfig]);

    const maxIndex = Math.max(0, totalItems - itemsPerView);
    const totalPages = Math.ceil(totalItems / itemsPerView); // For dots we might want pages, but here we slide by 1 or view? Let's slide by view for simplicity like Testimonials

    // Slide logic - slide by "itemsPerView" to match Testimonials "page" like behavior, 
    // OR slide by 1 for smoother carousel? 
    // Testimonials `nextSlide` did `prev + cardsPerView`. Let's stick to that for block pagination, 
    // but often sliding by 1 is smoother. Let's do sliding by itemsPerView for major sections to avoid "lost" items in partial views.

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            // If we are already at the end, loop back to 0
            if (prev >= maxIndex) return 0;
            // Otherwise, move forward, but don't overshoot maxIndex
            return Math.min(prev + itemsPerView, maxIndex);
        });
    }, [itemsPerView, maxIndex]);

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - itemsPerView, 0));
    };

    const goToIndex = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-play
    useEffect(() => {
        if (!autoPlay) return;

        const interval = setInterval(() => {
            nextSlide();
        }, intervalTime);

        return () => clearInterval(interval);
    }, [autoPlay, intervalTime, nextSlide]);

    // Touch handlers for swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
            // Reset auto-play timer ideally, but effect handles cleanup
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    return (
        <div className={`${styles.carouselContainer} ${className}`}>
            <div
                className={styles.carouselTrackWrapper}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className={styles.carouselTrack}
                    style={{
                        transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                        width: `${(totalItems / itemsPerView) * 100}%` // This logic might be tricky if not flex-basis based.
                        // Better approach: track width is 100% of wrapper. items have flex-basis: 100/itemsPerView %.
                    }}
                >
                    {/* 
                       Wait, straightforward flex approach:
                       Track is wide? No, usually Track is flex container.
                       If we translate by %, the % is relative to the Track width usually? 
                       No, translate % is relative to the element itself. 
                       Testimonials used: transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`
                       And card width: flex: 0 0 calc(33.333% - 1rem);
                       Let's mirror that.
                    */}
                </div>
                <div
                    className={styles.carouselTrack}
                    style={{
                        // If we want accurate sliding, we translate - (currentIndex * (100 / itemsPerView)) %
                        transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={styles.carouselSlide}
                            style={{
                                flex: `0 0 ${100 / itemsPerView}%`,
                                maxWidth: `${100 / itemsPerView}%`
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.controls}>
                <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className={styles.controlBtn}
                    aria-label="Previous slide"
                >
                    <i className="fas fa-chevron-left" />
                </button>

                <div className={styles.dots}>
                    {/* 
                       Dots representation. If we slide by block, we have ceil(total / perView) dots.
                       If we slide by 1, we have more dots.
                       Current nextSlide logic jumps by itemsPerView (block).
                       So dots should correspond to blocks.
                    */}
                    {Array.from({ length: Math.ceil(totalItems / itemsPerView) }).map((_, idx) => {
                        // Determine active state is a bit tricky if currentIndex is item index.
                        // Block 0: index 0. Block 1: index itemsPerView.
                        const isActive = Math.floor(currentIndex / itemsPerView) === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => goToIndex(idx * itemsPerView)}
                                className={`${styles.dot} ${isActive ? styles.active : ''}`}
                                aria-label={`Go to slide group ${idx + 1}`}
                            />
                        );
                    })}
                </div>

                <button
                    onClick={nextSlide}
                    className={styles.controlBtn}
                    aria-label="Next slide"
                >
                    <i className="fas fa-chevron-right" />
                </button>
            </div>
        </div>
    );
}
