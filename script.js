// Enhanced JavaScript for ArabSad.com - Performance Optimized
// مؤسسة إعلانات العرب - البرمجة المحسنة
(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    PLACEHOLDER_IMAGE: 'assets/images/placeholder.webp',
    SCROLL_THRESHOLD: 400,
    ANIMATION_DURATION: 300,
    SLIDER_INTERVAL: 5500,
    LAZY_LOAD_MARGIN: '100px 0px',
    PERFORMANCE_MARK: 'arabsad-init'
  };
  
  // Cache DOM elements
  const DOM = {
    topBtn: null,
    navToggle: null,
    navMenu: null,
    revSlider: null,
    progress: null
  };
  
  // Performance utilities
  const Performance = {
    mark: (name) => {
      if ('performance' in window && performance.mark) {
        performance.mark(name);
      }
    },
    
    measure: (name, start, end) => {
      if ('performance' in window && performance.measure) {
        try {
          performance.measure(name, start, end);
        } catch (e) {
          console.debug('Performance measurement failed:', e);
        }
      }
    },
    
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    throttle: (func, delay) => {
      let timeoutId;
      let lastExecTime = 0;
      return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
          func.apply(this, args);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
            lastExecTime = Date.now();
          }, delay - (currentTime - lastExecTime));
        }
      };
    }
  };
  
  // Advanced Slider with touch support and improved accessibility
  const RevSlider = {
    init() {
      DOM.revSlider = document.getElementById('revSlider');
      if (!DOM.revSlider) return;
      
      this.slides = Array.from(DOM.revSlider.querySelectorAll('.rev-slide'));
      this.dotsContainer = DOM.revSlider.querySelector('.slide-dots');
      this.currentIndex = 0;
      this.timer = null;
      this.isAnimating = false;
      this.touchStartX = 0;
      this.touchEndX = 0;
      
      this.createDots();
      this.bindEvents();
      this.startAutoplay();
      
      // Initialize first slide
      this.slides[0].classList.add('active');
      this.updateDots();
    },
    
    createDots() {
      if (!this.dotsContainer || this.slides.length <= 1) return;
      
      this.dotsContainer.innerHTML = this.slides.map((_, index) => 
        `<button type="button" class="slide-dot ${index === 0 ? 'active' : ''}" 
                aria-label="إظهار الشريحة ${index + 1} من ${this.slides.length}" 
                data-slide="${index}"></button>`
      ).join('');
    },
    
    updateDots() {
      if (!this.dotsContainer) return;
      
      this.dotsContainer.querySelectorAll('.slide-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
        dot.setAttribute('aria-pressed', index === this.currentIndex ? 'true' : 'false');
      });
    },
    
    goToSlide(targetIndex, direction = 'forward') {
      if (this.isAnimating || targetIndex === this.currentIndex) return;
      
      this.isAnimating = true;
      const previousIndex = this.currentIndex;
      
      // Calculate target index with wrapping
      this.currentIndex = ((targetIndex % this.slides.length) + this.slides.length) % this.slides.length;
      
      // Add transition classes
      this.slides[previousIndex].classList.add(direction === 'forward' ? 'slide-out-left' : 'slide-out-right');
      this.slides[this.currentIndex].classList.add('active', direction === 'forward' ? 'slide-in-right' : 'slide-in-left');
      
      // Clean up after animation
      setTimeout(() => {
        this.slides[previousIndex].classList.remove('active', 'slide-out-left', 'slide-out-right');
        this.slides[this.currentIndex].classList.remove('slide-in-left', 'slide-in-right');
        this.updateDots();
        this.isAnimating = false;
      }, CONFIG.ANIMATION_DURATION);
      
      this.resetTimer();
    },
    
    nextSlide() {
      this.goToSlide(this.currentIndex + 1, 'forward');
    },
    
    prevSlide() {
      this.goToSlide(this.currentIndex - 1, 'backward');
    },
    
    resetTimer() {
      clearTimeout(this.timer);
      const interval = Number(this.slides[this.currentIndex]?.dataset.interval || CONFIG.SLIDER_INTERVAL);
      this.timer = setTimeout(() => this.nextSlide(), interval);
    },
    
    startAutoplay() {
      this.resetTimer();
    },
    
    stopAutoplay() {
      clearTimeout(this.timer);
    },
    
    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX;
    },
    
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    },
    
    handleSwipe() {
      const swipeDistance = this.touchEndX - this.touchStartX;
      const minSwipeDistance = 50;
      
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    },
    
    bindEvents() {
      // Dot navigation
      if (this.dotsContainer) {
        this.dotsContainer.addEventListener('click', (e) => {
          const slideIndex = Number(e.target.dataset.slide);
          if (!isNaN(slideIndex)) {
            this.goToSlide(slideIndex);
          }
        });
      }
      
      // Keyboard navigation
      DOM.revSlider.addEventListener('keydown', (e) => {
        switch(e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            this.prevSlide();
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            this.nextSlide();
            break;
          case 'Home':
            e.preventDefault();
            this.goToSlide(0);
            break;
          case 'End':
            e.preventDefault();
            this.goToSlide(this.slides.length - 1);
            break;
        }
      });
      
      // Touch events for mobile
      DOM.revSlider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      DOM.revSlider.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
      
      // Pause/resume on hover and focus
      DOM.revSlider.addEventListener('mouseenter', () => this.stopAutoplay());
      DOM.revSlider.addEventListener('mouseleave', () => this.startAutoplay());
      DOM.revSlider.addEventListener('focusin', () => this.stopAutoplay());
      DOM.revSlider.addEventListener('focusout', () => this.startAutoplay());
      
      // Pause when tab is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAutoplay();
        } else {
          this.startAutoplay();
        }
      });
    }
  };
  
  // Enhanced scroll progress indicator
  const ScrollProgress = {
    init() {
      DOM.progress = document.getElementById('progress');
      if (!DOM.progress) return;
      
      this.updateProgress = Performance.throttle(() => {
        const h = document.documentElement;
        const scrollPercent = Math.min(
          (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100,
          100
        );
        DOM.progress.style.width = scrollPercent + '%';
        DOM.progress.setAttribute('aria-valuenow', Math.round(scrollPercent));
      }, 16); // 60fps
      
      // Set initial ARIA attributes
      DOM.progress.setAttribute('role', 'progressbar');
      DOM.progress.setAttribute('aria-valuemin', '0');
      DOM.progress.setAttribute('aria-valuemax', '100');
      DOM.progress.setAttribute('aria-label', 'تقدم قراءة الصفحة');
      
      window.addEventListener('scroll', this.updateProgress, { passive: true });
      this.updateProgress();
    }
  };
  
  // Enhanced mobile navigation with better UX
  const Navigation = {
    init() {
      DOM.navToggle = document.getElementById('navToggle');
      DOM.navMenu = document.getElementById('navMenu');
      
      if (!DOM.navToggle || !DOM.navMenu) return;
      
      DOM.navToggle.addEventListener('click', this.toggle.bind(this));
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (DOM.navMenu.classList.contains('active') && 
            !DOM.navMenu.contains(e.target) && 
            !DOM.navToggle.contains(e.target)) {
          this.close();
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
          this.close();
          DOM.navToggle.focus();
        }
      });
      
      // Close menu when navigating to anchor links
      DOM.navMenu.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
          setTimeout(() => this.close(), 100);
        }
      });
    },
    
    toggle() {
      const isOpen = DOM.navMenu.classList.contains('active');
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    
    open() {
      DOM.navMenu.classList.add('active');
      DOM.navToggle.classList.add('active');
      DOM.navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      
      // Focus first menu item
      const firstMenuItem = DOM.navMenu.querySelector('a');
      if (firstMenuItem) {
        setTimeout(() => firstMenuItem.focus(), 100);
      }
    },
    
    close() {
      DOM.navMenu.classList.remove('active');
      DOM.navToggle.classList.remove('active');
      DOM.navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };
  
  // Back to top with enhanced UX
  const BackToTop = {
    init() {
      DOM.topBtn = document.getElementById('backToTop');
      if (!DOM.topBtn) {
        this.createButton();
      }
      
      this.updateVisibility = Performance.throttle(() => {
        const visible = window.pageYOffset > CONFIG.SCROLL_THRESHOLD;
        if (DOM.topBtn) {
          DOM.topBtn.style.display = visible ? 'flex' : 'none';
          DOM.topBtn.classList.toggle('show', visible);
        }
      }, 100);
      
      window.addEventListener('scroll', this.updateVisibility, { passive: true });
      
      if (DOM.topBtn) {
        DOM.topBtn.addEventListener('click', this.scrollToTop.bind(this));
      }
      
      this.updateVisibility();
    },
    
    createButton() {
      DOM.topBtn = document.createElement('button');
      DOM.topBtn.id = 'backToTop';
      DOM.topBtn.className = 'back-to-top';
      DOM.topBtn.innerHTML = '↑';
      DOM.topBtn.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');
      DOM.topBtn.setAttribute('title', 'العودة إلى الأعلى');
      document.body.appendChild(DOM.topBtn);
    },
    
    scrollToTop() {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // Focus management for accessibility
      setTimeout(() => {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
          skipLink.focus();
        }
      }, 300);
    }
  };
  
  // Enhanced lazy loading with intersection observer
  const LazyLoading = {
    init() {
      if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported, loading all images');
        this.loadAllImages();
        return;
      }
      
      this.imageObserver = new IntersectionObserver(
        this.handleImageIntersection.bind(this),
        {
          rootMargin: CONFIG.LAZY_LOAD_MARGIN,
          threshold: 0.1
        }
      );
      
      // Observe all images
      document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
        this.imageObserver.observe(img);
      });
      
      // Preload critical images
      this.preloadCriticalImages();
    },
    
    handleImageIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.imageObserver.unobserve(img);
        }
      });
    },
    
    loadImage(img) {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      
      img.addEventListener('load', () => {
        img.style.filter = 'blur(0)';
        img.classList.add('loaded');
      }, { once: true });
      
      img.addEventListener('error', () => {
        this.handleImageError(img);
      }, { once: true });
    },
    
    loadAllImages() {
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadImage(img);
      });
    },
    
    preloadCriticalImages() {
      const criticalImages = [
        'assets/images/logo.svg',
        'assets/images/hero-bg.jpg',
        'assets/images/services-bg.webp'
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    },
    
    handleImageError(img) {
      if (!img.dataset.retried && img.src !== CONFIG.PLACEHOLDER_IMAGE) {
        img.dataset.retried = 'true';
        img.src = CONFIG.PLACEHOLDER_IMAGE;
        img.alt = 'صورة من موقع مؤسسة إعلانات العرب للتسويق الرقمي';
      }
    }
  };
  
  // SEO and Accessibility enhancements
  const SEOEnhancements = {
    init() {
      this.enhanceImages();
      this.enhanceLinks();
      this.addStructuredData();
      this.optimizeHeadings();
    },
    
    enhanceImages() {
      document.querySelectorAll('img:not([alt])').forEach(img => {
        img.alt = 'صورة من موقع مؤسسة إعلانات العرب';
      });
      
      // Add image optimization attributes
      document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading') && !img.closest('.hero')) {
          img.setAttribute('loading', 'lazy');
        }
        
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
    },
    
    enhanceLinks() {
      // External links
      document.querySelectorAll('a[href^="http"]:not([rel])').forEach(link => {
        const url = new URL(link.href);
        if (url.hostname !== location.hostname) {
          if (link.href.includes('wa.me') || link.href.includes('whatsapp')) {
            link.rel = 'nofollow noopener';
            link.setAttribute('aria-label', link.textContent + ' - يفتح في تطبيق واتساب');
          } else {
            link.rel = 'noopener';
            link.setAttribute('aria-label', link.textContent + ' - يفتح في نافذة جديدة');
          }
        }
      });
      
      // Phone links
      document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.setAttribute('aria-label', 'اتصال برقم ' + link.textContent);
      });
    },
    
    addStructuredData() {
      // Add breadcrumb structured data if not exists
      if (!document.querySelector('script[type="application/ld+json"]')) {
        const breadcrumbData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "الرئيسية",
              "item": "https://arabsad.com/"
            }
          ]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
      }
    },
    
    optimizeHeadings() {
      // Ensure proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentLevel = 0;
      
      headings.forEach(heading => {
        const level = Number(heading.tagName.charAt(1));
        
        // Add ID for anchor links if missing
        if (!heading.id && heading.textContent) {
          const id = heading.textContent
            .replace(/[^\w\s\u0600-\u06FF]/g, '')
            .trim()
            .split(/\s+/)
            .slice(0, 3)
            .join('-')
            .toLowerCase();
          
          if (id) {
            heading.id = id;
          }
        }
      });
    }
  };
  
  // Performance monitoring and optimization
  const PerformanceOptimizer = {
    init() {
      this.measureInitialLoad();
      this.optimizeButtons();
      this.prefetchImportantPages();
      this.setupErrorReporting();
    },
    
    measureInitialLoad() {
      Performance.mark('arabsad-init-start');
      
      window.addEventListener('load', () => {
        Performance.mark('arabsad-init-end');
        Performance.measure('arabsad-init', 'arabsad-init-start', 'arabsad-init-end');
        
        // Log Core Web Vitals if available
        if ('web-vitals' in window) {
          try {
            getCLS(console.log);
            getFID(console.log);
            getLCP(console.log);
          } catch (e) {
            console.debug('Web Vitals not available');
          }
        }
      });
    },
    
    optimizeButtons() {
      // Add loading states to buttons
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          if (this.href && !this.target && !this.href.includes('#')) {
            this.classList.add('loading');
            this.style.pointerEvents = 'none';
            
            // Remove loading state after timeout
            setTimeout(() => {
              this.classList.remove('loading');
              this.style.pointerEvents = '';
            }, 3000);
          }
        });
      });
    },
    
    prefetchImportantPages() {
      const importantPages = [
        '/services-page.html',
        '/google-ads-service.html',
        '/social-media-service.html'
      ];
      
      // Prefetch on user interaction
      let prefetched = false;
      const prefetchPages = () => {
        if (prefetched) return;
        prefetched = true;
        
        importantPages.forEach(page => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });
      };
      
      ['mouseenter', 'touchstart', 'scroll'].forEach(event => {
        document.addEventListener(event, prefetchPages, { once: true, passive: true });
      });
    },
    
    setupErrorReporting() {
      window.addEventListener('error', (e) => {
        // Log errors for debugging (could be sent to analytics)
        console.error('Script Error:', {
          message: e.message,
          source: e.filename,
          line: e.lineno,
          column: e.colno,
          error: e.error
        });
      });
      
      window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
      });
    }
  };
  
  // Skip link functionality
  const SkipLink = {
    init() {
      const skipLink = document.querySelector('.skip-link');
      const mainContent = document.getElementById('main-content');
      
      if (!skipLink || !mainContent) return;
      
      skipLink.addEventListener('click', (e) => {
        if (skipLink.getAttribute('href') === '#main-content') {
          e.preventDefault();
          mainContent.setAttribute('tabindex', '-1');
          mainContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          
          setTimeout(() => {
            mainContent.focus({ preventScroll: true });
          }, 300);
        }
      });
    }
  };
  
  // Enhanced form handling (if forms exist)
  const FormEnhancer = {
    init() {
      document.querySelectorAll('form').forEach(form => {
        this.enhanceForm(form);
      });
    },
    
    enhanceForm(form) {
      // Add loading states
      form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
        }
      });
      
      // Real-time validation
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => {
          this.validateField(field);
        });
      });
    },
    
    validateField(field) {
      const isValid = field.checkValidity();
      field.classList.toggle('error', !isValid);
      field.classList.toggle('success', isValid && field.value);
    }
  };
  
  // Main initialization
  function initialize() {
    Performance.mark('arabsad-init-start');
    
    try {
      // Core features
      ScrollProgress.init();
      Navigation.init();
      BackToTop.init();
      SkipLink.init();
      RevSlider.init();
      
      // Enhancement features
      LazyLoading.init();
      SEOEnhancements.init();
      PerformanceOptimizer.init();
      FormEnhancer.init();
      
      console.log('✅ ArabSad.com initialized successfully');
      
    } catch (error) {
      console.error('❌ Initialization error:', error);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Global utilities
  window.ArabSad = {
    scrollToSection: (sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        section.focus();
      }
    },
    
    openWhatsApp: (message = 'أريد استشارة تسويقية الآن') => {
      const url = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
    },
    
    trackEvent: (eventName, properties = {}) => {
      // Placeholder for analytics tracking
      console.log('Event tracked:', eventName, properties);
      
      // Could integrate with Google Analytics, Facebook Pixel, etc.
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
      }
    }
  };
  
})();