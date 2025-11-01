// Enhanced JavaScript for improved performance, SEO, and user experience
(function() {
  'use strict';
  
  const PLACEHOLDER = 'assets/images/placeholder.webp';
  const SCROLL_THRESHOLD = 400;
  const topBtn = document.getElementById('backToTop');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Advanced slider with smooth transitions
  function initRevSlider() {
    const root = document.getElementById('revSlider');
    if (!root) return;
    
    const slides = Array.from(root.querySelectorAll('.rev-slide'));
    const dotsWrap = root.querySelector('.slide-dots');
    let currentIndex = 0;
    let timer;
    let isAnimating = false;
    
    function goToSlide(targetIndex) {
      if (isAnimating || targetIndex === currentIndex) return;
      isAnimating = true;
      
      // Hide current slide
      slides[currentIndex].classList.remove('active');
      
      // Show target slide
      currentIndex = (targetIndex + slides.length) % slides.length;
      slides[currentIndex].classList.add('active');
      
      // Update dots
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach((btn, index) => {
          btn.classList.toggle('active', index === currentIndex);
        });
      }
      
      resetTimer();
      setTimeout(() => { isAnimating = false; }, 800);
    }
    
    function resetTimer() {
      clearTimeout(timer);
      const interval = Number(slides[currentIndex].dataset.interval || 5500);
      timer = setTimeout(() => goToSlide(currentIndex + 1), interval);
    }
    
    // Initialize slides
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === 0);
    });
    
    // Create dots
    if (dotsWrap) {
      dotsWrap.innerHTML = slides.map((_, index) => 
        `<button aria-label="إظهار الشريحة ${index + 1}" ${index === 0 ? 'class="active"' : ''}></button>`
      ).join('');
      
      dotsWrap.querySelectorAll('button').forEach((btn, index) => {
        btn.addEventListener('click', () => goToSlide(index));
      });
    }
    
    // Keyboard navigation
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
      else if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });
    
    // Pause on hover/focus
    root.addEventListener('mouseenter', () => clearTimeout(timer));
    root.addEventListener('mouseleave', resetTimer);
    
    // Start timer
    resetTimer();
  }

  // Fix skip-link focus and smooth scroll to main content
  function initSkipLink() {
    const skip = document.querySelector('a.skip-link');
    const main = document.getElementById('main-content');
    if (!skip || !main) return;
    
    skip.addEventListener('click', function(e) {
      if (skip.getAttribute('href') === '#main-content') {
        e.preventDefault();
        main.setAttribute('tabindex', '-1');
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        main.focus({ preventScroll: true });
      }
    });
  }

  // Back to top visibility with enhanced UX
  function toggleBackToTop() {
    if (!topBtn) return;
    const visible = window.pageYOffset > SCROLL_THRESHOLD;
    topBtn.style.display = visible ? 'flex' : 'none';
    topBtn.classList.toggle('show', visible);
  }

  function scrollToTop() { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  // Enhanced mobile navigation
  function toggleMobileNav() {
    if (!navMenu || !navToggle) return;
    const isOpen = navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    
    // Prevent body scroll when menu is open on mobile
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  // Enhanced image error handling
  function handleImageError(img) {
    if (img.src !== PLACEHOLDER && !img.dataset.retried) {
      img.dataset.retried = 'true';
      img.src = PLACEHOLDER;
      img.alt = 'صورة من موقع مؤسسة إعلانات العرب';
    }
  }

  // Advanced lazy loading with intersection observer
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.loading = 'lazy';
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px'
    });
    
    document.querySelectorAll('img').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Enhanced SEO and accessibility
  function enhanceSEO() {
    // Add alt text to images without it
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.alt = 'صورة من موقع مؤسسة إعلانات العرب';
    });
    
    // Enhance external links
    document.querySelectorAll('a[target="_blank"]:not([rel])').forEach(link => {
      if (link.href.includes('wa.me') || link.href.includes('mailto')) {
        link.rel = 'nofollow noopener';
      } else {
        link.rel = 'noopener';
      }
    });
  }

  // Performance monitoring
  function initPerformanceOptimizations() {
    // Preload critical resources
    const criticalImages = ['assets/images/logo.svg', 'assets/images/logo-hero.jpg'];
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (this.href && this.target !== '_blank') {
          this.classList.add('loading');
        }
      });
    });
  }

  // Initialize everything
  function init() {
    // Core functionality
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    topBtn && topBtn.addEventListener('click', scrollToTop);
    navToggle && navToggle.addEventListener('click', toggleMobileNav);
    
    // Image error handling
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') handleImageError(e.target);
    }, true);
    
    // Enhanced features
    initSkipLink();
    initRevSlider();
    initLazyLoading();
    enhanceSEO();
    initPerformanceOptimizations();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMobileNav();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();