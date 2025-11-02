// Performance Optimizer for ArabSad.com
// مؤسسة إعلانات العرب - محسن الأداء
(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    CRITICAL_FONTS: [
      'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap'
    ],
    PRELOAD_IMAGES: [
      '/assets/images/logo.svg',
      '/assets/images/hero-bg.webp'
    ],
    ANALYTICS_DELAY: 2000,
    PERFORMANCE_BUDGET: {
      LCP: 2500, // milliseconds
      FID: 100,  // milliseconds
      CLS: 0.1   // score
    }
  };
  
  // Performance Utilities
  const Performance = {
    mark(name) {
      if ('performance' in window && performance.mark) {
        performance.mark(name);
      }
    },
    
    measure(name, start, end) {
      if ('performance' in window && performance.measure) {
        try {
          performance.measure(name, start, end);
          const measure = performance.getEntriesByName(name)[0];
          console.log(`📊 ${name}: ${Math.round(measure.duration)}ms`);
          return measure.duration;
        } catch (e) {
          console.debug('Performance measurement failed:', e);
        }
      }
    },
    
    now() {
      return performance.now ? performance.now() : Date.now();
    }
  };
  
  // Critical Resource Preloader
  const CriticalLoader = {
    init() {
      Performance.mark('critical-load-start');
      this.preloadFonts();
      this.preloadImages();
      this.setupResourceHints();
      Performance.mark('critical-load-end');
      Performance.measure('critical-load-time', 'critical-load-start', 'critical-load-end');
    },
    
    preloadFonts() {
      CONFIG.CRITICAL_FONTS.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = fontUrl;
        link.crossOrigin = 'anonymous';
        link.onload = function() { 
          this.rel = 'stylesheet'; 
        };
        document.head.appendChild(link);
      });
    },
    
    preloadImages() {
      CONFIG.PRELOAD_IMAGES.forEach(imageSrc => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageSrc;
        document.head.appendChild(link);
      });
    },
    
    setupResourceHints() {
      const domains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'wa.me'
      ];
      
      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = `//${domain}`;
        document.head.appendChild(link);
      });
    }
  };
  
  // Core Web Vitals Monitor
  const WebVitalsMonitor = {
    init() {
      this.measureLCP();
      this.measureFID();
      this.measureCLS();
    },
    
    measureLCP() {
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const lcpValue = lastEntry.startTime;
          
          console.log(`📊 LCP: ${Math.round(lcpValue)}ms`);
          
          if (lcpValue > CONFIG.PERFORMANCE_BUDGET.LCP) {
            console.warn(`⚠️ LCP exceeds budget: ${Math.round(lcpValue)}ms > ${CONFIG.PERFORMANCE_BUDGET.LCP}ms`);
          }
          
          this.reportMetric('LCP', lcpValue);
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.debug('LCP observer not supported');
        }
      }
    },
    
    measureFID() {
      if ('PerformanceObserver' in window) {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          const fidValue = firstEntry.processingStart - firstEntry.startTime;
          
          console.log(`📊 FID: ${Math.round(fidValue)}ms`);
          
          if (fidValue > CONFIG.PERFORMANCE_BUDGET.FID) {
            console.warn(`⚠️ FID exceeds budget: ${Math.round(fidValue)}ms > ${CONFIG.PERFORMANCE_BUDGET.FID}ms`);
          }
          
          this.reportMetric('FID', fidValue);
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.debug('FID observer not supported');
        }
      }
    },
    
    measureCLS() {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          
          console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
          
          if (clsValue > CONFIG.PERFORMANCE_BUDGET.CLS) {
            console.warn(`⚠️ CLS exceeds budget: ${clsValue.toFixed(4)} > ${CONFIG.PERFORMANCE_BUDGET.CLS}`);
          }
          
          this.reportMetric('CLS', clsValue);
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.debug('CLS observer not supported');
        }
      }
    },
    
    reportMetric(name, value) {
      // Report to analytics (placeholder)
      if (window.gtag) {
        gtag('event', 'core_web_vital', {
          metric_name: name,
          metric_value: Math.round(value * 1000) / 1000,
          page_url: window.location.pathname
        });
      }
    }
  };
  
  // Progressive Enhancement
  const ProgressiveEnhancer = {
    init() {
      this.enhanceImages();
      this.enhanceLinks();
      this.addMicroInteractions();
      this.setupErrorBoundaries();
    },
    
    enhanceImages() {
      // Add missing alt attributes
      document.querySelectorAll('img:not([alt])').forEach(img => {
        img.alt = 'صورة من موقع مؤسسة إعلانات العرب';
      });
      
      // Add loading and error handling
      document.querySelectorAll('img').forEach(img => {
        if (!img.loading && !img.closest('.hero')) {
          img.loading = 'lazy';
        }
        
        img.addEventListener('error', () => {
          img.style.background = '#f3f4f6';
          img.style.color = '#6b7280';
          img.alt = 'تعذر تحميل الصورة';
        }, { once: true });
      });
    },
    
    enhanceLinks() {
      // WhatsApp links
      document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        if (!link.rel.includes('nofollow')) {
          link.rel = (link.rel + ' nofollow noopener').trim();
        }
        
        link.addEventListener('click', () => {
          this.trackEvent('whatsapp_click', {
            text: link.textContent.trim(),
            url: link.href
          });
        });
      });
      
      // Service links
      document.querySelectorAll('a[href*="service"]').forEach(link => {
        link.addEventListener('click', () => {
          this.trackEvent('service_page_click', {
            service: link.textContent.trim(),
            url: link.href
          });
        });
      });
    },
    
    addMicroInteractions() {
      // Smooth hover effects for cards
      document.querySelectorAll('.service-card, .country-card, .feature').forEach(card => {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = '';
        });
      });
      
      // Button click animations
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          // Ripple effect
          const ripple = document.createElement('span');
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
          `;
          
          this.style.position = 'relative';
          this.style.overflow = 'hidden';
          this.appendChild(ripple);
          
          setTimeout(() => ripple.remove(), 600);
        });
      });
    },
    
    setupErrorBoundaries() {
      window.addEventListener('error', (e) => {
        console.error('🚨 Runtime Error:', {
          message: e.message,
          filename: e.filename,
          line: e.lineno,
          column: e.colno
        });
      });
      
      window.addEventListener('unhandledrejection', (e) => {
        console.error('🚨 Promise Rejection:', e.reason);
        e.preventDefault(); // Prevent console spam
      });
    },
    
    trackEvent(eventName, properties = {}) {
      // Analytics placeholder
      console.log('📊 Event:', eventName, properties);
    }
  };
  
  // Lazy Loading Enhancer
  const LazyLoader = {
    init() {
      if ('IntersectionObserver' in window) {
        this.setupImageObserver();
        this.setupContentObserver();
      } else {
        // Fallback for older browsers
        this.loadAllImages();
      }
    },
    
    setupImageObserver() {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              imageObserver.unobserve(img);
            }
          });
        },
        { rootMargin: '50px 0px' }
      );
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    },
    
    setupContentObserver() {
      const contentObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              contentObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '20px 0px', threshold: 0.1 }
      );
      
      document.querySelectorAll('.service-card, .feature, .country-card').forEach(el => {
        contentObserver.observe(el);
      });
    },
    
    loadAllImages() {
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  };
  
  // SEO Enhancements
  const SEOOptimizer = {
    init() {
      this.addStructuredData();
      this.optimizeMetaTags();
      this.enhanceInternalLinks();
    },
    
    addStructuredData() {
      const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "مؤسسة إعلانات العرب",
        "alternateName": "ArabSad Digital Marketing",
        "url": "https://arabsad.com",
        "logo": "https://arabsad.com/assets/images/logo.svg",
        "description": "وكالة تسويق رقمي متخصصة في Google Ads وFacebook Ads وInstagram وSEO",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "EG",
          "addressRegion": "الجيزة",
          "addressLocality": "حدائق أكتوبر"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+201110760081",
          "contactType": "customer service",
          "availableLanguage": ["Arabic", "English"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "08:00",
            "closes": "23:00"
          }
        },
        "sameAs": [
          "https://wa.me/201110760081",
          "https://arabsad.com"
        ],
        "areaServed": [
          {
            "@type": "Country",
            "name": "المملكة العربية السعودية"
          },
          {
            "@type": "Country",
            "name": "دولة الإمارات العربية المتحدة"
          },
          {
            "@type": "Country",
            "name": "دولة الكويت"
          },
          {
            "@type": "Country",
            "name": "دولة قطر"
          },
          {
            "@type": "Country",
            "name": "مملكة البحرين"
          },
          {
            "@type": "Country",
            "name": "سلطنة عمان"
          }
        ],
        "makesOffer": [
          {
            "@type": "Offer",
            "name": "إدارة حملات Google Ads",
            "description": "حملات إعلانية احترافية على شبكة Google مع ضمان أفضل عائد على الاستثمار"
          },
          {
            "@type": "Offer",
            "name": "إعلانات وسائل التواصل الاجتماعي",
            "description": "حملات فيسبوك وإنستجرام وسناب شات وتيك توك لزيادة المبيعات والتفاعل"
          },
          {
            "@type": "Offer",
            "name": "تحسين محركات البحث SEO",
            "description": "تحسين ترتيب موقعك في نتائج بحث Google لزيادة الزيارات المجانية"
          },
          {
            "@type": "Offer",
            "name": "تصميم المتاجر الإلكترونية",
            "description": "تصميم وتطوير متاجر إلكترونية احترافية مع نظام دفع آمن"
          }
        ]
      };
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(organizationData);
      document.head.appendChild(script);
    },
    
    optimizeMetaTags() {
      // Add missing meta tags
      const metaTags = [
        { name: 'format-detection', content: 'telephone=yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'msapplication-TileColor', content: '#667eea' },
        { name: 'msapplication-config', content: '/browserconfig.xml' }
      ];
      
      metaTags.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      });
    },
    
    enhanceInternalLinks() {
      // Add smooth scroll to anchor links
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
          
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
            
            // Update URL without jumping
            history.pushState(null, null, `#${targetId}`);
            
            // Focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        });
      });
    },
    
    trackEvent(eventName, properties = {}) {
      console.log('📊 Enhanced Event:', eventName, properties);
    }
  };
  
  // Speed Optimizer
  const SpeedOptimizer = {
    init() {
      this.optimizeImages();
      this.preloadImportantPages();
      this.setupResourceOptimizations();
    },
    
    optimizeImages() {
      // Convert images to WebP if supported
      if (this.supportsWebP()) {
        document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]').forEach(img => {
          const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          
          // Test if WebP version exists
          const testImg = new Image();
          testImg.onload = () => {
            img.src = webpSrc;
          };
          testImg.src = webpSrc;
        });
      }
    },
    
    supportsWebP() {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },
    
    preloadImportantPages() {
      const importantPages = [
        '/services-page.html',
        '/google-ads-service.html',
        '/social-media-service.html'
      ];
      
      // Preload on user interaction
      const preloadPages = () => {
        importantPages.forEach(page => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });
      };
      
      ['mouseenter', 'touchstart'].forEach(event => {
        document.addEventListener(event, preloadPages, { once: true, passive: true });
      });
    },
    
    setupResourceOptimizations() {
      // Optimize font loading
      document.fonts.ready.then(() => {
        console.log('✅ All fonts loaded');
        document.body.classList.add('fonts-loaded');
      });
      
      // Optimize third-party scripts
      this.loadThirdPartyScripts();
    },
    
    loadThirdPartyScripts() {
      // Load non-critical third-party scripts after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          // Placeholder for third-party scripts
          console.log('💼 Loading third-party scripts...');
        }, 1000);
      });
    }
  };
  
  // Main Boot Sequence
  function bootSequence() {
    Performance.mark('boot-sequence-start');
    
    try {
      console.log('🚀 Starting ArabSad.com optimization sequence...');
      
      // Phase 1: Critical loading
      CriticalLoader.init();
      
      // Phase 2: Performance monitoring
      WebVitalsMonitor.init();
      
      // Phase 3: Progressive enhancements
      ProgressiveEnhancer.init();
      
      // Phase 4: Lazy loading
      setTimeout(() => {
        LazyLoader.init();
      }, 100);
      
      // Phase 5: SEO optimizations
      setTimeout(() => {
        SEOOptimizer.init();
      }, 200);
      
      // Phase 6: Speed optimizations
      setTimeout(() => {
        SpeedOptimizer.init();
      }, 300);
      
      Performance.mark('boot-sequence-end');
      Performance.measure('boot-sequence-time', 'boot-sequence-start', 'boot-sequence-end');
      
      console.log('✅ ArabSad.com optimization completed successfully');
      
    } catch (error) {
      console.error('❌ Boot sequence error:', error);
    }
  }
  
  // Start boot sequence
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSequence);
  } else {
    bootSequence();
  }
  
  // Global performance utilities
  window.ArabSadPerformance = {
    preloadPage: (url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    },
    
    reportError: (error, context = {}) => {
      console.error('🚨 Reported Error:', error, context);
      
      if (window.gtag) {
        gtag('event', 'custom_error', {
          error_message: String(error),
          error_context: JSON.stringify(context),
          page_url: window.location.href
        });
      }
    },
    
    measureFunction: (name, fn) => {
      Performance.mark(`${name}-start`);
      const result = fn();
      Performance.mark(`${name}-end`);
      Performance.measure(name, `${name}-start`, `${name}-end`);
      return result;
    }
  };
  
})();

// Add CSS animations for enhanced loading
const animationCSS = document.createElement('style');
animationCSS.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes animate-in {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-in {
    animation: animate-in 0.6s ease-out;
  }
  
  .fonts-loaded body {
    transition: font-family 0.3s ease;
  }
`;
document.head.appendChild(animationCSS);