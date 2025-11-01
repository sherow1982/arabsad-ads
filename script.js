// التنقل المتجاوب
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // تبديل القائمة
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // تحريك أيقونة البرجر
        navToggle.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // التنقل السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // إضافة فئة active للتنقل عند التمرير
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset;

        // إضافة shadow للهيدر عند التمرير
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        }

        // تحديد القسم النشط
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // نموذج الاتصال
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = new FormData(this);
            const formValues = {};
            
            // تحويل FormData إلى كائن
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // التحقق من صحة البيانات
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const phone = this.querySelector('input[type="tel"]').value.trim();
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value.trim();
            
            if (!name || !email || !phone || !service || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showNotification('يرجى إدخال رقم هاتف صحيح', 'error');
                return;
            }
            
            // محاكاة إرسال النموذج
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;
            
            // محاكاة تأخير الإرسال
            setTimeout(() => {
                showNotification('تم إرسال طلبك بنجاح! سنتواصل معك قريباً', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // أنيميشن الأرقام في قسم البطل
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = target.textContent.replace(/[^0-9]/g, '');
                    const suffix = target.textContent.replace(/[0-9]/g, '');
                    
                    animateNumber(target, 0, parseInt(finalNumber), suffix, 2000);
                    observer.unobserve(target);
                }
            });
        });
        
        stats.forEach(stat => observer.observe(stat));
    }
    
    function animateNumber(element, start, end, suffix, duration) {
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * easeOutCubic(progress));
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    animateNumbers();

    // أنيميشن الظهور للعناصر
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .pricing-card, .blog-card, .feature');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    animateOnScroll();

    // تحسين الأداء - تأخير تحميل الصور
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
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
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    lazyLoadImages();

    // تتبع الأحداث (Analytics)
    function trackEvent(category, action, label) {
        // يمكن دمج Google Analytics أو أي أداة تتبع أخرى هنا
        console.log('Event tracked:', { category, action, label });
    }

    // تتبع النقرات على الأزرار
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.trim();
            trackEvent('Button', 'Click', text);
        });
    });

    // تتبع النقرات على الخدمات
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            trackEvent('Service', 'View', serviceName);
        });
    });

    // تحسين إمكانية الوصول
    function improveAccessibility() {
        // إضافة skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'تخطي إلى المحتوى الرئيسي';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 9999;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // إضافة aria-labels للعناصر التفاعلية
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-label', 'فتح القائمة الرئيسية');
            navToggle.setAttribute('aria-expanded', 'false');
            
            navToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                this.setAttribute('aria-label', isExpanded ? 'فتح القائمة الرئيسية' : 'إغلاق القائمة الرئيسية');
            });
        }
    }
    
    improveAccessibility();
});

// دوال مساعدة
function isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\\+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\\s\\-\\(\\)]/g, ''));
}

function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Cairo', sans-serif;
        direction: rtl;
    `;
    
    // إضافة أنماط المحتوى
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-right: auto;
    `;
    
    // إضافة إلى الصفحة
    document.body.appendChild(notification);
    
    // تحريك للظهور
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // إزالة الإشعار
    function removeNotification() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // إزالة تلقائية بعد 5 ثوان
    setTimeout(removeNotification, 5000);
    
    // إزالة عند النقر على زر الإغلاق
    closeBtn.addEventListener('click', removeNotification);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// تحسين الأداء - تحميل البيانات المؤجل
function loadDeferredContent() {
    // يمكن تحميل محتوى إضافي هنا مثل testimonials أو portfolio
    console.log('تحميل المحتوى المؤجل...');
}

// تحميل المحتوى المؤجل بعد تحميل الصفحة
window.addEventListener('load', () => {
    setTimeout(loadDeferredContent, 1000);
});

// تحسين SEO - إضافة structured data
function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "إعلانات العرب",
        "url": "https://arabsad.com",
        "logo": "https://arabsad.com/logo.png",
        "description": "منصة شاملة للإعلانات والتسويق الرقمي في العالم العربي ودول الخليج",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "الرياض",
            "addressCountry": "SA"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+966505914774",
            "contactType": "customer service"
        },
        "sameAs": [
            "https://www.facebook.com/arabsad",
            "https://www.twitter.com/arabsad",
            "https://www.instagram.com/arabsad"
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// إضافة البيانات المنظمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', addStructuredData);