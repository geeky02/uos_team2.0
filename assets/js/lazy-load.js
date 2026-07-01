/**
 * Lazy Loading Implementation with Loading State
 * Uses Intersection Observer API for optimal performance
 */

(function() {
    'use strict';

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: just load all images immediately
        loadAllImages();
        return;
    }

    // Configuration
    const config = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };

    // Create the Intersection Observer
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, config);

    // Load all lazy images on page load
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(function(img) {
            // Add loading state class
            img.classList.add('lazy-loading');
            // If already in viewport, load immediately to avoid waiting for intersection
            const rect = img.getBoundingClientRect();
            const inViewport = (
                rect.top < (window.innerHeight || document.documentElement.clientHeight) + 50 &&
                rect.bottom > -50
            );
            if (inViewport) {
                loadImage(img);
            } else {
                // Observe the image
                imageObserver.observe(img);
            }
        });
    }

    // Load individual image
    function loadImage(img) {
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');

        if (src) {
            img.src = src;
        }
        if (srcset) {
            img.srcset = srcset;
        }

        img.onload = function() {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        };

        img.onerror = function() {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-error');
        };
    }

    // Fallback function if Intersection Observer not supported
    function loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(function(img) {
            loadImage(img);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyLoading);
    } else {
        initLazyLoading();
    }

    // safety: after window load, ensure any remaining data-src images get observed/loaded
    window.addEventListener('load', function() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(function(img) {
            if (!img.classList.contains('lazy-loaded') && !img.classList.contains('lazy-error')) {
                imageObserver.observe(img);
            }
        });
    });

    // Also make images with loading="lazy" use our observer for consistent styling
    document.addEventListener('DOMContentLoaded', function() {
        const lazyNativeImages = document.querySelectorAll('img[loading="lazy"]');
        lazyNativeImages.forEach(function(img) {
            img.classList.add('lazy-loading');
            img.addEventListener('load', function() {
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
            });
            img.addEventListener('error', function() {
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-error');
            });
        });
    });

})();
