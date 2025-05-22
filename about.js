// Enhanced About Page JavaScript with Improved Error Handling
'use strict';

/**
 * Main About Page Manager Class
 * Handles all functionality for the about page with comprehensive error handling
 */
class AboutPageManager {
    constructor() {
        this.swiper = null;
        this.counterAnimated = false;
        this.observers = new Map();
        this.eventListeners = new Map();
        this.isInitialized = false;
        this.liveRegion = null;
        this.config = {
            counterSpeed: 100,
            swiperAutoplayDelay: 5000,
            intersectionThreshold: 0.6,
            scrollDebounceDelay: 150,
            messageDisplayDuration: 5000
        };
        
        this.init();
    }

    /**
     * Initialize all components with comprehensive error handling
     */
    async init() {
        try {
            console.log('Initializing About Page Manager...');
            
            // Wait for DOM to be fully ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                });
            }

            // Initialize components in order
            await this.initializeComponents();
            
            this.isInitialized = true;
            console.log('About Page Manager initialized successfully');
            
        } catch (error) {
            this.handleError(error, 'Initialization', true);
        }
    }

    /**
     * Initialize all components sequentially
     */
    async initializeComponents() {
        const components = [
            { name: 'Swiper', fn: () => this.initSwiper() },
            { name: 'Counter Animation', fn: () => this.initCounterAnimation() },
            { name: 'Form Validation', fn: () => this.initFormValidation() },
            { name: 'Image Error Handling', fn: () => this.initImageErrorHandling() },
            { name: 'Accessibility Features', fn: () => this.initAccessibilityFeatures() },
            { name: 'Performance Optimizations', fn: () => this.initPerformanceOptimizations() }
        ];

        for (const component of components) {
            try {
                await component.fn();
                console.log(`✓ ${component.name} initialized`);
            } catch (error) {
                this.handleError(error, component.name, false);
                console.warn(`⚠ ${component.name} failed to initialize, continuing...`);
            }
        }
    }

    /**
     * Initialize Swiper carousel with comprehensive error handling
     */
    initSwiper() {
        return new Promise((resolve, reject) => {
            try {
                const swiperContainer = document.querySelector('.swiper');
                if (!swiperContainer) {
                    throw new Error('Swiper container not found');
                }

                // Check if Swiper library is loaded
                if (typeof Swiper === 'undefined') {
                    console.warn('Swiper library not loaded, using fallback');
                    this.fallbackCarousel();
                    resolve();
                    return;
                }

                // Validate swiper slides exist
                const slides = swiperContainer.querySelectorAll('.swiper-slide');
                if (slides.length === 0) {
                    throw new Error('No swiper slides found');
                }

                const config = {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: slides.length > 1,
                    autoplay: slides.length > 1 ? {
                        delay: this.config.swiperAutoplayDelay,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    } : false,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        renderBullet: (index, className) => {
                            return `<span class="${className}" role="tab" aria-label="Go to slide ${index + 1}" tabindex="0"></span>`;
                        },
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    keyboard: {
                        enabled: true,
                        onlyInViewport: true,
                    },
                    a11y: {
                        prevSlideMessage: 'Previous slide',
                        nextSlideMessage: 'Next slide',
                        firstSlideMessage: 'This is the first slide',
                        lastSlideMessage: 'This is the last slide'
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: Math.min(2, slides.length),
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: Math.min(3, slides.length),
                            spaceBetween: 30,
                        },
                    },
                    on: {
                        init: (swiper) => {
                            console.log('Swiper initialized with', swiper.slides.length, 'slides');
                            this.updateSwiperAria();
                            resolve();
                        },
                        slideChange: () => {
                            this.updateSwiperAria();
                        },
                        error: (error) => {
                            reject(new Error(`Swiper error: ${error.message || error}`));
                        }
                    }
                };

                this.swiper = new Swiper('.swiper', config);

            } catch (error) {
                console.warn('Swiper initialization failed:', error.message);
                this.fallbackCarousel();
                resolve(); // Don't reject, use fallback instead
            }
        });
    }

    /**
     * Update ARIA attributes for Swiper accessibility
     */
    updateSwiperAria() {
        try {
            if (!this.swiper) return;
            
            const activeSlide = document.querySelector('.swiper-slide-active');
            const allSlides = document.querySelectorAll('.swiper-slide');
            
            if (!activeSlide || allSlides.length === 0) return;
            
            allSlides.forEach((slide, index) => {
                const isActive = slide === activeSlide;
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
                slide.setAttribute('tabindex', isActive ? '0' : '-1');
                
                // Update focus management
                const focusableElements = slide.querySelectorAll('a, button, input, [tabindex]');
                focusableElements.forEach(el => {
                    el.setAttribute('tabindex', isActive ? '0' : '-1');
                });
            });

            // Announce slide change to screen readers
            const slideNumber = Array.from(allSlides).indexOf(activeSlide) + 1;
            this.announceToScreenReader(`Slide ${slideNumber} of ${allSlides.length}`);
            
        } catch (error) {
            this.handleError(error, 'Swiper ARIA Update', false);
        }
    }

    /**
     * Fallback carousel for when Swiper fails
     */
    fallbackCarousel() {
        try {
            const swiperContainer = document.querySelector('.swiper');
            if (!swiperContainer) return;

            const slides = Array.from(swiperContainer.querySelectorAll('.swiper-slide'));
            if (slides.length === 0) return;

            swiperContainer.innerHTML = `
                <div class="fallback-carousel" role="region" aria-label="Team members">
                    <div class="team-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; padding: 20px;">
                        ${slides.map(slide => slide.innerHTML).join('')}
                    </div>
                    <div class="fallback-message" style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
                        <p>Carousel functionality requires JavaScript</p>
                    </div>
                </div>
            `;

            console.log('Fallback carousel initialized');
        } catch (error) {
            this.handleError(error, 'Fallback Carousel', false);
        }
    }

    /**
     * Initialize counter animation with robust error handling
     */
    initCounterAnimation() {
        return new Promise((resolve) => {
            try {
                const counters = document.querySelectorAll('.counter');
                if (counters.length === 0) {
                    console.warn('No counter elements found');
                    resolve();
                    return;
                }

                // Validate counter data
                const validCounters = Array.from(counters).filter(counter => {
                    const target = parseFloat(counter.dataset.target);
                    if (isNaN(target)) {
                        console.warn('Invalid counter target:', counter.dataset.target, counter);
                        return false;
                    }
                    return true;
                });

                if (validCounters.length === 0) {
                    console.warn('No valid counter elements found');
                    resolve();
                    return;
                }

                const animateCounter = (counter) => {
                    try {
                        const target = parseFloat(counter.dataset.target);
                        const suffix = counter.dataset.suffix || '';
                        
                        let current = 0;
                        const increment = target / this.config.counterSpeed;
                        const duration = 2000;
                        const stepTime = duration / this.config.counterSpeed;

                        const updateCounter = () => {
                            try {
                                current += increment;
                                if (current < target) {
                                    const displayValue = this.formatCounterValue(current, suffix);
                                    counter.textContent = displayValue;
                                    counter.setAttribute('aria-label', `${displayValue} ${counter.parentElement.querySelector('.boxtext')?.textContent || ''}`);
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    const finalValue = this.formatCounterValue(target, suffix);
                                    counter.textContent = finalValue;
                                    counter.setAttribute('aria-label', `${finalValue} ${counter.parentElement.querySelector('.boxtext')?.textContent || ''}`);
                                }
                            } catch (error) {
                                // Fallback to final value
                                counter.textContent = target + suffix;
                                this.handleError(error, 'Counter Animation Step', false);
                            }
                        };

                        updateCounter();
                    } catch (error) {
                        // Fallback to static display
                        const target = parseFloat(counter.dataset.target);
                        const suffix = counter.dataset.suffix || '';
                        counter.textContent = target + suffix;
                        this.handleError(error, 'Counter Animation', false);
                    }
                };

                // Use Intersection Observer if available
                if ('IntersectionObserver' in window) {
                    const observerOptions = {
                        threshold: this.config.intersectionThreshold,
                        rootMargin: '0px 0px -50px 0px'
                    };

                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !this.counterAnimated) {
                                const counter = entry.target;
                                animateCounter(counter);
                                observer.unobserve(counter);
                            }
                        });
                    }, observerOptions);

                    validCounters.forEach(counter => {
                        observer.observe(counter);
                    });

                    this.observers.set('counter', observer);
                    this.counterAnimated = true;
                } else {
                    // Fallback: animate immediately
                    validCounters.forEach(animateCounter);
                }

                resolve();
            } catch (error) {
                this.handleError(error, 'Counter Animation Init', false);
                resolve();
            }
        });
    }

    /**
     * Format counter value for display
     */
    formatCounterValue(value, suffix) {
        if (suffix === 'k' && value >= 1000) {
            return (value / 1000).toFixed(1) + 'k';
        }
        return Math.ceil(value) + suffix;
    }

    /**
     * Initialize form validation with comprehensive error handling
     */
    initFormValidation() {
        return new Promise((resolve) => {
            try {
                const subscribeForm = document.getElementById('subscribeForm');
                const emailInput = document.getElementById('email');
                const messageDiv = document.getElementById('subscribe-message');

                if (!subscribeForm || !emailInput || !messageDiv) {
                    console.warn('Form elements not found, skipping form validation');
                    resolve();
                    return;
                }

                const validateEmail = (email) => {
                    try {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailRegex.test(email.trim());
                    } catch (error) {
                        this.handleError(error, 'Email Validation', false);
                        return false;
                    }
                };

                const showMessage = (message, type = 'info') => {
                    try {
                        messageDiv.textContent = message;
                        messageDiv.className = `subscribe-message ${type}`;
                        messageDiv.setAttribute('role', 'status');
                        messageDiv.setAttribute('aria-live', 'polite');
                        
                        // Auto-hide message
                        setTimeout(() => {
                            messageDiv.className = 'subscribe-message';
                            messageDiv.textContent = '';
                            messageDiv.removeAttribute('role');
                        }, this.config.messageDisplayDuration);
                    } catch (error) {
                        this.handleError(error, 'Show Message', false);
                    }
                };

                const simulateSubscription = async (email) => {
                    return new Promise((resolve, reject) => {
                        try {
                            // Simulate API call with timeout
                            const timeout = setTimeout(() => {
                                resolve(Math.random() > 0.1); // 90% success rate for demo
                            }, 1000);

                            // Simulate network error occasionally
                            if (Math.random() < 0.05) {
                                clearTimeout(timeout);
                                reject(new Error('Network error'));
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                };

                const submitHandler = async (e) => {
                    e.preventDefault();
                    
                    try {
                        const email = emailInput.value.trim();
                        const submitButton = subscribeForm.querySelector('button[type="submit"]');
                        
                        if (!email) {
                            showMessage('Please enter your email address', 'error');
                            emailInput.focus();
                            return;
                        }

                        if (!validateEmail(email)) {
                            showMessage('Please enter a valid email address', 'error');
                            emailInput.focus();
                            return;
                        }

                        // Show loading state
                        if (submitButton) {
                            submitButton.disabled = true;
                            submitButton.setAttribute('aria-busy', 'true');
                        }
                        subscribeForm.classList.add('loading');
                        showMessage('Subscribing...', 'info');

                        try {
                            const success = await simulateSubscription(email);
                            
                            if (success) {
                                showMessage('Successfully subscribed! Check your email for confirmation.', 'success');
                                emailInput.value = '';
                                this.announceToScreenReader('Successfully subscribed to newsletter');
                            } else {
                                showMessage('Subscription failed. Please try again later.', 'error');
                            }
                        } catch (subscriptionError) {
                            console.error('Subscription error:', subscriptionError);
                            showMessage('An error occurred. Please try again later.', 'error');
                        }
                    } catch (error) {
                        this.handleError(error, 'Form Submission', false);
                        showMessage('An unexpected error occurred. Please try again.', 'error');
                    } finally {
                        // Reset loading state
                        const submitButton = subscribeForm.querySelector('button[type="submit"]');
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.removeAttribute('aria-busy');
                        }
                        subscribeForm.classList.remove('loading');
                    }
                };

                const inputHandler = () => {
                    try {
                        const email = emailInput.value.trim();
                        if (email && !validateEmail(email)) {
                            emailInput.setAttribute('aria-invalid', 'true');
                            emailInput.setAttribute('aria-describedby', 'email-error');
                        } else {
                            emailInput.removeAttribute('aria-invalid');
                            emailInput.removeAttribute('aria-describedby');
                        }
                    } catch (error) {
                        this.handleError(error, 'Input Validation', false);
                    }
                };

                // Add event listeners
                this.addEventListener(subscribeForm, 'submit', submitHandler);
                this.addEventListener(emailInput, 'input', this.debounce(inputHandler, 300));

                resolve();
            } catch (error) {
                this.handleError(error, 'Form Validation Init', false);
                resolve();
            }
        });
    }

    /**
     * Handle image loading errors gracefully
     */
    initImageErrorHandling() {
        return new Promise((resolve) => {
            try {
                const images = document.querySelectorAll('img');
                
                if (images.length === 0) {
                    resolve();
                    return;
                }

                let processedImages = 0;
                const totalImages = images.length;

                images.forEach((img, index) => {
                    const errorHandler = (e) => {
                        try {
                            const target = e.target;
                            console.warn('Failed to load image:', target.src);
                            
                            const fallback = this.createImageFallback(target);
                            if (target.parentNode) {
                                target.parentNode.replaceChild(fallback, target);
                            }
                        } catch (error) {
                            this.handleError(error, 'Image Error Handler', false);
                        } finally {
                            processedImages++;
                            if (processedImages === totalImages) {
                                resolve();
                            }
                        }
                    };

                    const loadHandler = () => {
                        processedImages++;
                        if (processedImages === totalImages) {
                            resolve();
                        }
                    };

                    // Add event listeners
                    this.addEventListener(img, 'error', errorHandler);
                    this.addEventListener(img, 'load', loadHandler);

                    // Add loading attribute for performance
                    if (!img.hasAttribute('loading')) {
                        img.setAttribute('loading', 'lazy');
                    }

                    // Set timeout for images that might not trigger load/error events
                    setTimeout(() => {
                        if (processedImages < totalImages) {
                            processedImages++;
                            if (processedImages === totalImages) {
                                resolve();
                            }
                        }
                    }, 5000);
                });

                // Resolve immediately if no images
                if (totalImages === 0) {
                    resolve();
                }
            } catch (error) {
                this.handleError(error, 'Image Error Handling Init', false);
                resolve();
            }
        });
    }

    /**
     * Create appropriate fallback for failed images
     */
    createImageFallback(originalImg) {
        try {
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            
            const width = originalImg.offsetWidth || originalImg.getAttribute('width') || '100%';
            const height = originalImg.offsetHeight || originalImg.getAttribute('height') || '200px';
            
            fallback.style.cssText = `
                width: ${typeof width === 'number' ? width + 'px' : width};
                height: ${typeof height === 'number' ? height + 'px' : height};
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 14px;
                border: 1px solid #ddd;
                border-radius: 4px;
                position: relative;
            `;
            
            const altText = originalImg.alt || 'Image not available';
            fallback.innerHTML = `
                <div style="text-align: center; padding: 10px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
                    <div>${altText}</div>
                </div>
            `;
            
            fallback.setAttribute('role', 'img');
            fallback.setAttribute('aria-label', altText);
            
            return fallback;
        } catch (error) {
            this.handleError(error, 'Create Image Fallback', false);
            
            // Return simple text fallback
            const textFallback = document.createElement('span');
            textFallback.textContent = originalImg.alt || 'Image not available';
            return textFallback;
        }
    }

    /**
     * Initialize accessibility features
     */
    initAccessibilityFeatures() {
        return new Promise((resolve) => {
            try {
                // Initialize components in sequence
                this.addSkipLink();
                this.initFocusManagement();
                this.initKeyboardNavigation();
                this.initAriaLiveRegions();
                
                resolve();
            } catch (error) {
                this.handleError(error, 'Accessibility Features Init', false);
                resolve();
            }
        });
    }

    /**
     * Add skip link for accessibility
     */
    addSkipLink() {
        try {
            // Check if skip link already exists
            if (document.querySelector('.skip-link')) {
                return;
            }

            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: white;
                padding: 8px;
                text-decoration: none;
                z-index: 1000;
                border-radius: 0 0 4px 4px;
                transition: top 0.3s ease;
            `;
            
            const focusHandler = () => {
                skipLink.style.top = '0';
            };
            
            const blurHandler = () => {
                skipLink.style.top = '-40px';
            };
            
            this.addEventListener(skipLink, 'focus', focusHandler);
            this.addEventListener(skipLink, 'blur', blurHandler);
            
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Add ID to main element if it doesn't exist
            const main = document.querySelector('main');
            if (main && !main.id) {
                main.id = 'main';
            }
        } catch (error) {
            this.handleError(error, 'Add Skip Link', false);
        }
    }

    /**
     * Initialize focus management
     */
    initFocusManagement() {
        try {
            // Track input method for focus styling
            const mouseDownHandler = () => {
                document.body.classList.add('using-mouse');
            };
            
            const keyDownHandler = (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.remove('using-mouse');
                }
            };
            
            this.addEventListener(document, 'mousedown', mouseDownHandler);
            this.addEventListener(document, 'keydown', keyDownHandler);
            
            // Add focus styling
            if (!document.querySelector('#focus-styles')) {
                const style = document.createElement('style');
                style.id = 'focus-styles';
                style.textContent = `
                    .using-mouse *:focus {
                        outline: none;
                    }
                    :focus-visible {
                        outline: 2px solid #DB4444;
                        outline-offset: 2px;
                    }
                `;
                document.head.appendChild(style);
            }
        } catch (error) {
            this.handleError(error, 'Focus Management Init', false);
        }
    }

    /**
     * Initialize keyboard navigation
     */
    initKeyboardNavigation() {
        try {
            // Add keyboard support for statistics boxes
            const statBoxes = document.querySelectorAll('.box891');
            statBoxes.forEach(box => {
                if (!box.hasAttribute('tabindex')) {
                    box.setAttribute('tabindex', '0');
                    box.setAttribute('role', 'button');
                    box.setAttribute('aria-label', this.getStatBoxLabel(box));
                    
                    const keydownHandler = (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            box.click();
                        }
                    };
                    
                    this.addEventListener(box, 'keydown', keydownHandler);
                }
            });

            // Enhanced search functionality
            const searchInput = document.querySelector('.search-bar input');
            const searchButton = document.querySelector('.search-bar button');
            
            if (searchInput && searchButton) {
                const searchKeydownHandler = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        searchButton.click();
                    }
                };
                
                this.addEventListener(searchInput, 'keydown', searchKeydownHandler);
            }
        } catch (error) {
            this.handleError(error, 'Keyboard Navigation Init', false);
        }
    }

    /**
     * Get accessible label for stat box
     */
    getStatBoxLabel(box) {
        try {
            const counter = box.querySelector('.counter');
            const text = box.querySelector('.boxtext');
            const counterValue = counter ? counter.textContent : '';
            const description = text ? text.textContent : '';
            return `${counterValue} ${description}`.trim();
        } catch (error) {
            return 'Statistic';
        }
    }

    /**
     * Initialize ARIA live regions for dynamic updates
     */
    initAriaLiveRegions() {
        try {
            // Check if live region already exists
            if (document.getElementById('live-region')) {
                this.liveRegion = document.getElementById('live-region');
                return;
            }

            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'live-region';
            liveRegion.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            
            document.body.appendChild(liveRegion);
            this.liveRegion = liveRegion;
        } catch (error) {
            this.handleError(error, 'ARIA Live Regions Init', false);
        }
    }

    /**
     * Announce messages to screen readers
     */
    announceToScreenReader(message) {
        try {
            if (this.liveRegion && message) {
                this.liveRegion.textContent = message;
                setTimeout(() => {
                    if (this.liveRegion) {
                        this.liveRegion.textContent = '';
                    }
                }, 1000);
            }
        } catch (error) {
            this.handleError(error, 'Screen Reader Announcement', false);
        }
    }

    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        return new Promise((resolve) => {
            try {
                this.initLazyLoading();
                this.initScrollOptimizations();
                this.preloadCriticalResources();
                resolve();
            } catch (error) {
                this.handleError(error, 'Performance Optimizations Init', false);
                resolve();
            }
        });
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        try {
            if (!('IntersectionObserver' in window)) {
                console.warn('IntersectionObserver not supported, skipping lazy loading');
                return;
            }

            const lazyImages = document.querySelectorAll('img[data-src]');
            if (lazyImages.length === 0) return;

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });

            this.observers.set('lazyLoading', imageObserver);
        } catch (error) {
            this.handleError(error, 'Lazy Loading Init', false);
        }
    }

    /**
     * Optimize scroll event handling
     */
    initScrollOptimizations() {
        try {
            const scrollHandler = this.throttle(() => {
                this.handleScroll();
            }, this.config.scrollDebounceDelay);

            this.addEventListener(window, 'scroll', scrollHandler, { passive: true });
        } catch (error) {
            this.handleError(error, 'Scroll Optimizations Init', false);
        }
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        try {
            // Add scroll-based functionality here if needed
            // For example: header behavior, progress indicators, etc.
        } catch (error) {
            this.handleError(error, 'Scroll Handler', false);
        }
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        try {
            const resources = [
                {
                    href: 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&display=swap',
                    as: 'style',
                    type: 'font'
                },
                {
                    href: 'https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap',
                    as: 'style',
                    type: 'font'
                }
            ];

            resources.forEach(resource => {
                try {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = resource.href;
                    link.as = resource.as;
                    
                    if (resource.type === 'font') {
                        link.crossOrigin = 'anonymous';
                    }
                    
                    link.onload = function() {
                        this.onload = null;
                        this.rel = 'stylesheet';
                    };
                    
                    link.onerror = () => {
                        console.warn('Failed to preload resource:', resource.href);
                    };
                    
                    document.head.appendChild(link);
                } catch (resourceError) {
                    console.warn('Failed to create preload link for:', resource.href, resourceError);
                }
            });
        } catch (error) {
            this.handleError(error, 'Preload Critical Resources', false);
        }
    }

    /**
     * Enhanced error handling with context and recovery strategies
     */
    handleError(error, context = 'Unknown', isCritical = false) {
        const errorInfo = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace available',
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            isCritical: isCritical
        };

        // Log error with full context
        if (isCritical) {
            console.error(`🔴 CRITICAL ERROR in ${context}:`, errorInfo);
        } else {
            console.warn(`⚠️ WARNING in ${context}:`, errorInfo);
        }

        // Send error to analytics service (if implemented)
        this.sendErrorToAnalytics(errorInfo);

        // Handle critical errors
        if (isCritical) {
            this.handleCriticalError(errorInfo);
        }

        // Attempt recovery based on context
        this.attemptErrorRecovery(context, error);
    }

    /**
     * Send error information to analytics service
     */
    sendErrorToAnalytics(errorInfo) {
        try {
            // Example implementation - replace with your analytics service
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    description: `${errorInfo.context}: ${errorInfo.message}`,
                    fatal: errorInfo.isCritical
                });
            }

            // Store in local storage for debugging
            const errors = JSON.parse(localStorage.getItem('aboutPageErrors') || '[]');
            errors.push(errorInfo);
            
            // Keep only last 10 errors
            if (errors.length > 10) {
                errors.splice(0, errors.length - 10);
            }
            
            localStorage.setItem('aboutPageErrors', JSON.stringify(errors));
        } catch (analyticsError) {
            console.warn('Failed to send error to analytics:', analyticsError);
        }
    }

    /**
     * Handle critical errors that may break the page
     */
    handleCriticalError(errorInfo) {
        try {
            // Show user-friendly error message
            this.showUserErrorMessage(
                'We encountered a technical issue. The page may not work as expected. Please refresh to try again.',
                'error',
                10000 // Show for 10 seconds
            );

            // Disable non-essential features to prevent cascading failures
            this.enterSafeMode();
        } catch (criticalErrorHandlingError) {
            console.error('Failed to handle critical error:', criticalErrorHandlingError);
        }
    }

    /**
     * Attempt to recover from specific error contexts
     */
    attemptErrorRecovery(context, error) {
        try {
            switch (context) {
                case 'Swiper':
                    if (!document.querySelector('.fallback-carousel')) {
                        this.fallbackCarousel();
                    }
                    break;
                    
                case 'Counter Animation':
                    // Show static values
                    const counters = document.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = parseFloat(counter.dataset.target);
                        const suffix = counter.dataset.suffix || '';
                        if (!isNaN(target)) {
                            counter.textContent = target + suffix;
                        }
                    });
                    break;
                    
                case 'Form Validation':
                    // Enable basic HTML5 validation
                    const form = document.getElementById('subscribeForm');
                    const email = document.getElementById('email');
                    if (form && email) {
                        email.setAttribute('required', '');
                        email.setAttribute('type', 'email');
                    }
                    break;
                    
                default:
                    console.log(`No recovery strategy available for context: ${context}`);
            }
        } catch (recoveryError) {
            console.warn('Error recovery failed:', recoveryError);
        }
    }

    /**
     * Enter safe mode - disable non-essential features
     */
    enterSafeMode() {
        try {
            console.warn('Entering safe mode due to critical errors');
            
            // Disable autoplay features
            if (this.swiper && this.swiper.autoplay) {
                this.swiper.autoplay.stop();
            }
            
            // Disable complex animations
            document.body.classList.add('safe-mode');
            
            // Add safe mode styles
            if (!document.querySelector('#safe-mode-styles')) {
                const style = document.createElement('style');
                style.id = 'safe-mode-styles';
                style.textContent = `
                    .safe-mode * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.announceToScreenReader('Page is running in safe mode due to technical issues');
        } catch (safeModeError) {
            console.error('Failed to enter safe mode:', safeModeError);
        }
    }

    /**
     * Show user-friendly error message with improved UX
     */
    showUserErrorMessage(message, type = 'error', duration = 5000) {
        try {
            // Remove existing error messages
            const existingMessages = document.querySelectorAll('.user-error-message');
            existingMessages.forEach(msg => msg.remove());

            const errorDiv = document.createElement('div');
            errorDiv.className = `user-error-message ${type}`;
            errorDiv.setAttribute('role', 'alert');
            errorDiv.setAttribute('aria-live', 'assertive');
            
            const baseStyles = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 4px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 400px;
                font-family: 'Poppins', sans-serif;
                font-size: 14px;
                line-height: 1.4;
                animation: slideIn 0.3s ease-out;
            `;
            
            const typeStyles = {
                error: 'background: #dc3545; color: white;',
                warning: 'background: #ffc107; color: #212529;',
                info: 'background: #17a2b8; color: white;',
                success: 'background: #28a745; color: white;'
            };
            
            errorDiv.style.cssText = baseStyles + (typeStyles[type] || typeStyles.error);
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                position: absolute;
                top: 5px;
                right: 10px;
                cursor: pointer;
                opacity: 0.7;
            `;
            closeButton.setAttribute('aria-label', 'Close message');
            
            const closeHandler = () => {
                errorDiv.remove();
            };
            
            this.addEventListener(closeButton, 'click', closeHandler);
            
            errorDiv.innerHTML = `
                <div style="padding-right: 20px;">
                    ${message}
                </div>
            `;
            errorDiv.appendChild(closeButton);
            
            // Add animation styles
            if (!document.querySelector('#error-message-styles')) {
                const style = document.createElement('style');
                style.id = 'error-message-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    .user-error-message:hover {
                        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(errorDiv);
            
            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.style.animation = 'slideIn 0.3s ease-out reverse';
                        setTimeout(() => {
                            errorDiv.remove();
                        }, 300);
                    }
                }, duration);
            }
            
        } catch (showMessageError) {
            console.error('Failed to show user error message:', showMessageError);
            // Fallback to alert
            alert(message);
        }
    }

    /**
     * Enhanced event listener management with error handling
     */
    addEventListener(element, event, handler, options = {}) {
        try {
            if (!element || typeof handler !== 'function') {
                throw new Error('Invalid element or handler for event listener');
            }

            const wrappedHandler = (e) => {
                try {
                    handler(e);
                } catch (handlerError) {
                    this.handleError(handlerError, `Event Handler (${event})`, false);
                }
            };

            element.addEventListener(event, wrappedHandler, options);
            
            // Store reference for cleanup
            const key = `${element.tagName || 'window'}-${event}-${Date.now()}`;
            this.eventListeners.set(key, {
                element,
                event,
                handler: wrappedHandler,
                options
            });
            
        } catch (error) {
            this.handleError(error, 'Add Event Listener', false);
        }
    }

    /**
     * Utility: Debounce function calls
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return (...args) => {
            try {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            } catch (error) {
                this.handleError(error, 'Debounced Function', false);
            }
        };
    }

    /**
     * Utility: Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            try {
                if (!inThrottle) {
                    func(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            } catch (error) {
                this.handleError(error, 'Throttled Function', false);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        try {
            if (!element || !element.getBoundingClientRect) {
                return false;
            }
            
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= windowHeight &&
                rect.right <= windowWidth
            );
        } catch (error) {
            this.handleError(error, 'Viewport Check', false);
            return false;
        }
    }

    /**
     * Get comprehensive health status
     */
    getHealthStatus() {
        return {
            initialized: this.isInitialized,
            swiperWorking: !!this.swiper,
            counterAnimated: this.counterAnimated,
            observersCount: this.observers.size,
            eventListenersCount: this.eventListeners.size,
            hasErrors: localStorage.getItem('aboutPageErrors') !== null,
            safeMode: document.body.classList.contains('safe-mode')
        };
    }

    /**
     * Comprehensive cleanup method
     */
    destroy() {
        try {
            console.log('Destroying About Page Manager...');
            
            // Destroy Swiper
            if (this.swiper) {
                this.swiper.destroy(true, true);
                this.swiper = null;
            }
            
            // Disconnect all observers
            this.observers.forEach((observer, key) => {
                try {
                    observer.disconnect();
                } catch (error) {
                    console.warn(`Failed to disconnect observer ${key}:`, error);
                }
            });
            this.observers.clear();
            
            // Remove all event listeners
            this.eventListeners.forEach((listenerInfo, key) => {
                try {
                    listenerInfo.element.removeEventListener(
                        listenerInfo.event,
                        listenerInfo.handler,
                        listenerInfo.options
                    );
                } catch (error) {
                    console.warn(`Failed to remove event listener ${key}:`, error);
                }
            });
            this.eventListeners.clear();
            
            // Clean up DOM modifications
            const elementsToRemove = [
                '.skip-link',
                '#focus-styles',
                '#safe-mode-styles',
                '#error-message-styles',
                '#live-region',
                '.user-error-message'
            ];
            
            elementsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    try {
                        el.remove();
                    } catch (error) {
                        console.warn(`Failed to remove element ${selector}:`, error);
                    }
                });
            });
            
            // Reset state
            this.isInitialized = false;
            this.counterAnimated = false;
            this.liveRegion = null;
            
            console.log('About Page Manager destroyed successfully');
            
        } catch (error) {
            console.error('Error during destruction:', error);
        }
    }
}

/**
 * Enhanced utility functions with error handling
 */
const Utils = {
    /**
     * Safe debounce with error handling
     */
    debounce(func, wait, immediate = false) {
        if (typeof func !== 'function') {
            console.error('Debounce: First argument must be a function');
            return () => {};
        }
        
        let timeout;
        return function executedFunction(...args) {
            try {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            } catch (error) {
                console.error('Error in debounced function:', error);
            }
        };
    },

    /**
     * Safe throttle with error handling
     */
    throttle(func, limit) {
        if (typeof func !== 'function') {
            console.error('Throttle: First argument must be a function');
            return () => {};
        }
        
        let inThrottle;
        return function(...args) {
            try {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            } catch (error) {
                console.error('Error in throttled function:', error);
            }
        };
    },

    /**
     * Safe viewport check
     */
    isInViewport(element) {
        try {
            if (!element || typeof element.getBoundingClientRect !== 'function') {
                return false;
            }
            
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= windowHeight &&
                rect.right <= windowWidth
            );
        } catch (error) {
            console.error('Error checking viewport:', error);
            return false;
        }
    },

    /**
     * Safe element animation
     */
    animateElement(element, properties, duration = 300) {
        return new Promise((resolve, reject) => {
            try {
                if (!element || !element.style) {
                    throw new Error('Invalid element for animation');
                }
                
                element.style.transition = `all ${duration}ms ease`;
                Object.assign(element.style, properties);
                
                const cleanup = () => {
                    element.style.transition = '';
                    resolve();
                };
                
                setTimeout(cleanup, duration);
                
            } catch (error) {
                console.error('Animation error:', error);
                reject(error);
            }
        });
    },

    /**
     * Safe localStorage operations
     */
    localStorage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('LocalStorage get error:', error);
                return defaultValue;
            }
        },
        
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('LocalStorage set error:', error);
                return false;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('LocalStorage remove error:', error);
                return false;
            }
        }
    }
};

/**
 * Initialize when DOM is loaded with comprehensive error handling
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Starting About Page initialization...');
        
        // Initialize the About Page Manager
        window.aboutPageManager = new AboutPageManager();
        
        // Add global error handlers
        window.addEventListener('error', (e) => {
            if (window.aboutPageManager) {
                window.aboutPageManager.handleError(e.error || new Error(e.message), 'Global Error', false);
            }
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            if (window.aboutPageManager) {
                window.aboutPageManager.handleError(e.reason || new Error('Unhandled Promise Rejection'), 'Promise Rejection', false);
            }
        });
        
        // Add page visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && window.aboutPageManager && window.aboutPageManager.swiper) {
                // Pause autoplay when page is hidden
                if (window.aboutPageManager.swiper.autoplay) {
                    window.aboutPageManager.swiper.autoplay.stop();
                }
            } else if (!document.hidden && window.aboutPageManager && window.aboutPageManager.swiper) {
                // Resume autoplay when page is visible
                if (window.aboutPageManager.swiper.autoplay) {
                    window.aboutPageManager.swiper.autoplay.start();
                }
            }
        });
        
        // Add before unload cleanup
        window.addEventListener('beforeunload', () => {
            if (window.aboutPageManager) {
                window.aboutPageManager.destroy();
            }
        });
        
        console.log('✅ About page initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize about page:', error);
        
        // Initialize fallback functionality
        await initFallbackFunctionality();
    }
});

/**
 * Enhanced fallback functionality when main script fails
 */
async function initFallbackFunctionality() {
    try {
        console.log('🔧 Initializing fallback functionality...');
        
        // Basic counter display without animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            try {
                const target = parseFloat(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                if (!isNaN(target)) {
                    counter.textContent = target + suffix;
                    counter.setAttribute('aria-label', `${target}${suffix} ${counter.parentElement.querySelector('.boxtext')?.textContent || ''}`);
                }
            } catch (counterError) {
                console.warn('Fallback counter error:', counterError);
            }
        });
        
        // Basic form handling
        const subscribeForm = document.getElementById('subscribeForm');
        const emailInput = document.getElementById('email');
        
        if (subscribeForm && emailInput) {
            const fallbackSubmitHandler = (e) => {
                e.preventDefault();
                try {
                    const email = emailInput.value.trim();
                    if (!email) {
                        alert('Please enter your email address.');
                        emailInput.focus();
                        return;
                    }
                    
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        alert('Please enter a valid email address.');
                        emailInput.focus();
                        return;
                    }
                    
                    alert('Thank you for subscribing! (Basic mode - full functionality requires JavaScript)');
                    emailInput.value = '';
                } catch (error) {
                    alert('An error occurred. Please try again.');
                    console.error('Fallback form error:', error);
                }
            };
            
            subscribeForm.addEventListener('submit', fallbackSubmitHandler);
            
            // Enable HTML5 validation
            emailInput.setAttribute('required', '');
            emailInput.setAttribute('type', 'email');
        }
        
        // Basic image error handling
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', (e) => {
                const target = e.target;
                target.style.display = 'none';
                
                const fallback = document.createElement('div');
                fallback.textContent = target.alt || 'Image not available';
                fallback.style.cssText = `
                    padding: 20px;
                    background: #f0f0f0;
                    color: #666;
                    text-align: center;
                    border: 1px solid #ddd;
                `;
                
                if (target.parentNode) {
                    target.parentNode.insertBefore(fallback, target);
                }
            });
        });
        
        // Add basic accessibility
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = 'position: absolute; left: -9999px;';
        skipLink.addEventListener('focus', () => {
            skipLink.style.left = '0';
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.left = '-9999px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
        }
        
        console.log('✅ Fallback functionality initialized');
        
    } catch (fallbackError) {
        console.error('❌ Fallback initialization failed:', fallbackError);
        
        // Last resort: show message to user
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffc107;
            color: #212529;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        message.textContent = 'Some features may not work properly. Please refresh the page.';
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 10000);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AboutPageManager, Utils };
}

// Development helper: expose manager instance for debugging
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.AboutPageManagerClass = AboutPageManager;
    window.AboutPageUtils = Utils;
}