'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
    useEffect(() => {
        const revealElements = () => {
            const reveals = document.querySelectorAll('.reveal');

            reveals.forEach((element) => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        };

        // Initial check
        revealElements();

        // Add scroll listener
        window.addEventListener('scroll', revealElements);

        return () => window.removeEventListener('scroll', revealElements);
    }, []);

    return null;
}
