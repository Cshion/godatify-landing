// Main JavaScript - Initialize all components
document.addEventListener('DOMContentLoaded', function () {
    console.log('Datify website loaded successfully!');

    // Add loading animation
    document.body.classList.add('loaded');

    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add smooth scroll behavior for browsers that don't support it natively
    if (!('scrollBehavior' in document.documentElement.style)) {
        const smoothScrollPolyfill = () => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        };
        smoothScrollPolyfill();
    }

    // Add resize handler with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Handle responsive adjustments if needed
            console.log('Window resized');
        }, 250);
    });

    // Add page visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations/videos when page is hidden
            console.log('Page hidden');
        } else {
            // Resume animations/videos when page is visible
            console.log('Page visible');
        }
    });

    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            console.warn('Failed to load image:', this.src);
            // You could set a fallback image here
            // this.src = 'path/to/fallback-image.jpg';
        });
    });

    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });
});
