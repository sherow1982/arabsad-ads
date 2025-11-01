// Enhanced JavaScript for improved performance, SEO, and user experience
(function() {
  'use strict';
  
  // Constants
  const PLACEHOLDER = 'assets/images/placeholder.webp';
  const ANIMATION_DELAY = 100;
  const SCROLL_THRESHOLD = 400;
  
  // DOM elements
  const topBtn = document.getElementById('backToTop');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  // Performance optimization: Use passive listeners where possible
  const passiveSupported = checkPassiveSupport();
  
  function checkPassiveSupport() {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('testPassive', null, options);
      window.removeEventListener('testPassive', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }
  
  // Back to top functionality with improved performance
  function toggleBackToTop() {
    if (topBtn) {
      const shouldShow = window.pageYOffset > SCROLL_THRESHOLD;
      topBtn.style.display = shouldShow ? 'flex' : 'none';
      topBtn.classList.toggle('show', shouldShow);
    }
  }
  
  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Mobile navigation toggle
  function toggleMobileNav() {
    if (navMenu && navToggle) {
      const isOpen = navMenu.classList.contains('active');
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', !isOpen);
    }
  }
  
  // Close mobile nav when clicking on links
  function closeMobileNav() {
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', false);
      }
    }
  }
  
  // Enhanced image error handling with retry mechanism
  function handleImageError(img) {
    if (img.src !== PLACEHOLDER && !img.dataset.retried) {
      img.dataset.retried = 'true';
      img.src = PLACEHOLDER;
    }
  }
  
  // Lazy loading implementation with intersection observer
  function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
    
    // Observe all images
    document.querySelectorAll('img').forEach(img => {
      if (img.loading !== 'eager') {
        img.loading = 'lazy';
      }
      imageObserver.observe(img);
    });
  }
  
  // Animate statistics counters
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }
  
  function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const increment = target / 30; // Animation duration roughly 1 second
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }, 33); // ~30fps
  }
  
  // Fade in animation for elements
  function initFadeInAnimations() {
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe cards and sections
    document.querySelectorAll('.card, .section').forEach(el => {
      animateObserver.observe(el);
    });
  }
  
  // Preload critical resources
  function preloadResources() {
    const criticalImages = [
      'assets/images/logo-arabsad.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  // Enhanced form validation (if forms exist)
  function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
          e.preventDefault();
        }
      });
    });
  }
  
  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });
    
    return isValid;
  }
  
  // SEO enhancements
  function enhanceSEO() {
    // Add proper alt attributes to images without them
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.alt = 'صورة من موقع مؤسسة إعلانات العرب';
    });
    
    // Add loading="lazy" to non-critical images
    document.querySelectorAll('img').forEach((img, index) => {
      if (index > 2 && !img.loading) { // Keep first 3 images eager
        img.loading = 'lazy';
      }
    });
  }
  
  // Error handling for critical functions
  function safeExecute(fn, context = 'Unknown') {
    try {
      return fn();
    } catch (error) {
      console.warn(`Error in ${context}:`, error);
      return null;
    }
  }
  
  // Service Worker registration for caching
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
  
  // Initialize all functionality
  function init() {
    // Core functionality
    safeExecute(() => {
      // Scroll event listener
      window.addEventListener('scroll', 
        toggleBackToTop, 
        passiveSupported ? { passive: true } : false
      );
      
      // Back to top button
      if (topBtn) {
        topBtn.addEventListener('click', scrollToTop);
        toggleBackToTop(); // Initial check
      }
      
      // Mobile navigation
      if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
      }
      
      // Close mobile nav on link clicks
      if (navMenu) {
        navMenu.addEventListener('click', (e) => {
          if (e.target.tagName === 'A') {
            closeMobileNav();
          }
        });
      }
      
      // Image error handling
      document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
          handleImageError(e.target);
        }
      }, true);
      
    }, 'Core functionality');
    
    // Enhanced features
    safeExecute(initLazyLoading, 'Lazy loading');
    safeExecute(animateCounters, 'Counter animation');
    safeExecute(initFadeInAnimations, 'Fade animations');
    safeExecute(enhanceSEO, 'SEO enhancements');
    safeExecute(initFormValidation, 'Form validation');
    
    // Performance optimizations
    safeExecute(preloadResources, 'Resource preloading');
    // safeExecute(registerServiceWorker, 'Service Worker'); // Uncomment when SW is ready
  }
  
  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose some functions globally for debugging
  window.ArabsadSite = {
    scrollToTop,
    toggleMobileNav,
    version: '2.0.0'
  };
  
})();