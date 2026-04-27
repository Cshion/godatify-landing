'use client';

import { useState, useEffect, ReactNode, Children, useCallback, useRef } from 'react';import Icon from '@/components/ui/Icon';import styles from './Carousel.module.css';

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
    const [isInViewport, setIsInViewport] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const items = Children.toArray(children);
    const totalItems = items.length;

    // Default config values
    const autoPlay = config.autoPlay ?? true;
    const intervalTime = config.autoPlayInterval || 5000;
    const viewConfig = config.itemsPerView || { mobile: 1, tablet: 2, desktop: 3 };

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Track viewport visibility with IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInViewport(entry.isIntersecting);
                });
            },
            { threshold: 0.3 } // Trigger when 30% visible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

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
    const totalPages = Math.ceil(totalItems / itemsPerView);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            if (prev >= maxIndex) return 0;
            return Math.min(prev + itemsPerView, maxIndex);
        });
    }, [itemsPerView, maxIndex]);

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - itemsPerView, 0));
    };

    const goToIndex = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-play only when:
    // 1. autoPlay is enabled
    // 2. User doesn't prefer reduced motion
    // 3. Carousel is in viewport
    // 4. Not paused (hover or focus)
    useEffect(() => {
        if (!autoPlay || prefersReducedMotion || !isInViewport || isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, intervalTime);

        return () => clearInterval(interval);
    }, [autoPlay, intervalTime, nextSlide, prefersReducedMotion, isInViewport, isPaused]);

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
        <div
            ref={containerRef}
            className={`${styles.carouselContainer} ${className}`}
            tabIndex={0}
            role="region"
            aria-label="Carrusel de contenido"
            aria-roledescription="carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    e.preventDefault();
                }
                if (e.key === 'ArrowRight') {
                    nextSlide();
                    e.preventDefault();
                }
            }}
        >
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
                    aria-label="Diapositiva anterior"
                >
                    <Icon name="chevron-left" />
                </button>

                <div className={styles.dots}>
                    {/* 
                       Dots representation. If we slide by block, we have ceil(total / perView) dots.
                       If we slide by 1, we have more dots.
                       Current nextSlide logic jumps by itemsPerView (block).
                       So dots should correspond to blocks.
                    */}
                    {Array.from({ length: totalPages }).map((_, idx) => {
                        // Improved active state logic
                        // If we are at the very end (maxIndex), highlight the last dot
                        // Otherwise, use standard floor division
                        const isLastDot = idx === totalPages - 1;
                        const isAtEnd = currentIndex >= maxIndex;

                        let isActive = false;
                        if (isAtEnd) {
                            isActive = isLastDot;
                        } else {
                            isActive = Math.floor(currentIndex / itemsPerView) === idx;
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => goToIndex(Math.min(idx * itemsPerView, maxIndex))}
                                className={`${styles.dot} ${isActive ? styles.active : ''}`}
                                aria-label={`Ir al grupo de diapositivas ${idx + 1}`}
                            />
                        );
                    })}
                </div>

                <button
                    onClick={nextSlide}
                    className={styles.controlBtn}
                    aria-label="Siguiente diapositiva"
                >
                    <Icon name="chevron-right" />
                </button>
            </div>
        </div>
    );
}
