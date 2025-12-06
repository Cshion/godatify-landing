'use client';

import { useEffect, useRef } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage = '/images/hero-bg.jpg' }: PageHeroProps) {
    const sectionRef = useRef<HTMLElement>(null);

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
                        <h1 className={`${styles.title} reveal`} data-text={title}>
                            {title}
                        </h1>
                    </div>
                    {subtitle && <h2 className={`${styles.subtitle} reveal`}>{subtitle}</h2>}
                </div>
            </div>
        </section>
    );
}
