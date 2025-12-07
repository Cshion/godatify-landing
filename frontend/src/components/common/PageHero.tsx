'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    phrases?: string[];
}

export default function PageHero({ title, subtitle, backgroundImage = '/images/hero-bg.jpg', phrases = [] }: PageHeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    // Start with the first phrase if available to avoid "Title -> Phrase -> Title" jump
    const [currentText, setCurrentText] = useState(phrases.length > 0 ? phrases[0] : title);
    const [isCycling, setIsCycling] = useState(phrases.length > 0);

    // Reveal Animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const reveals = sectionRef.current?.querySelectorAll('.reveal');
        reveals?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Text Cycling Logic
    useEffect(() => {
        if (!isCycling || phrases.length === 0) {
            // Ensure we show the final title when not cycling
            if (!isCycling) setCurrentText(title);
            return;
        }

        // Sequence: [Phrase 2, Phrase 3, ..., TITLE]
        // (Phrase 1 is already initial state)
        const cycleSequence = [...phrases, title];

        let index = phrases.length > 0 ? 1 : 0; // Start at next item since we init with phrases[0]

        const interval = setInterval(() => {
            setCurrentText(cycleSequence[index % cycleSequence.length]);
            index++;
        }, 3000); // Increased to 3s for better readability

        return () => clearInterval(interval);
    }, [isCycling, phrases, title]);

    // Force active class on text change if section is already visible
    const titleRef = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        if (titleRef.current && sectionRef.current?.classList.contains('active')) {
            titleRef.current.classList.add('active');
            // Small hack to restart CSS animation if needed, though key change does it
        }
    }, [currentText]);

    return (
        <section
            ref={sectionRef}
            className={styles.heroSection}
            style={{
                '--hero-bg-image': `url('${backgroundImage}')`
            } as React.CSSProperties}
        >
            {/* Animated Particles */}
            <div className={styles.particles}>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
            </div>

            {/* Background Effects */}
            <div className={styles.gridOverlay}></div>

            <div className="container mx-auto px-6">
                <div className={styles.content}>
                    <div className={styles.titleWrapper}>
                        <h1
                            ref={titleRef}
                            className={`${styles.title} ${styles.animate}`} // Always animate on mount (key change)
                            key={currentText} // Key forces reconstruction -> restarts animation
                        >
                            {currentText}
                        </h1>
                    </div>
                    {subtitle && <h2 className={`${styles.subtitle} reveal`}>{subtitle}</h2>}
                </div>
            </div>
        </section>
    );
}
