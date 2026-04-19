'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
    useEffect(() => {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Use IntersectionObserver for better performance (no layout thrashing)
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // If reduced motion, skip animation and just show immediately
                        if (prefersReducedMotion) {
                            entry.target.classList.add('no-animation');
                        }
                        entry.target.classList.add('active');
                        // Stop watching once revealed (one-time animation)
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15, // Trigger when 15% of element is visible
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters view
            }
        );

        // Observe all reveal elements
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    return null;
}
