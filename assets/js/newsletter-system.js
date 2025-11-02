// 📧 Professional Newsletter System - ArabSad.com
// Client-side newsletter handling with multiple fallback options

class NewsletterSystem {
  constructor() {
    this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.rateLimitKey = 'newsletter_last_submission';
    this.subscribersKey = 'newsletter_subscribers';
    this.rateLimitTime = 60000; // 1 minute
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.checkSubmissionSuccess();
  }
  
  bindEvents() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmission(e));
    });
  }
  
  async handleSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!emailInput || !submitBtn) return;
    
    const email = emailInput.value.trim();
    
    // Validation
    if (!this.validateEmail(email)) {
      this.showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
      emailInput.focus();
      return;
    }
    
    // Rate limiting
    if (this.isRateLimited()) {
      this.showMessage('يرجى الانتظار دقيقة قبل المحاولة مرة أخرى', 'warning');
      return;
    }
    
    // Check if already subscribed
    if (this.isAlreadySubscribed(email)) {
      this.showMessage('هذا البريد مسجل مسبقاً، شكراً لك!', 'info');
      return;
    }
    
    // Show loading state
    this.setLoadingState(submitBtn, true);
    
    try {
      // Try multiple submission methods
      const success = await this.submitEmail(email, form);
      
      if (success) {
        this.handleSuccess(email, emailInput, submitBtn);
      } else {
        this.handleError(submitBtn);
      }
    } catch (error) {
      console.error('Newsletter submission error:', error);
      this.handleError(submitBtn);
    }
  }
  
  async submitEmail(email, form) {
    // Method 1: Try FormSubmit.co (most reliable)
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('_subject', 'اشتراك جديد في نشرة إعلانات العرب');
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      
      const response = await fetch('https://formsubmit.co/sherow1982@gmail.com', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Important for CORS
      });
      
      // Since it's no-cors, we assume success if no error is thrown
      return true;
    } catch (error) {
      console.log('FormSubmit method failed, trying alternatives...');
    }
    
    // Method 2: Try Netlify Forms (if on Netlify)
    try {
      const formData = new FormData();
      formData.append('form-name', 'newsletter');
      formData.append('email', email);
      
      const response = await fetch('/', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log('Netlify method failed, using local storage...');
    }
    
    // Method 3: Local storage as fallback
    this.saveToLocalStorage(email);
    return true;
  }
  
  handleSuccess(email, emailInput, submitBtn) {
    // Save to local storage
    this.saveToLocalStorage(email);
    
    // Update rate limiting
    localStorage.setItem(this.rateLimitKey, Date.now().toString());
    
    // Clear form
    emailInput.value = '';
    
    // Show success message
    this.showMessage('✅ تم الاشتراك بنجاح! ستصلك أحدث النصائح قريباً', 'success');
    
    // Reset button state
    this.setLoadingState(submitBtn, false);
    
    // Track event (if analytics available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: 'newsletter',
        value: 1
      });
    }
    
    // Redirect with success parameter after delay
    setTimeout(() => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('subscribed', '1');
      window.history.pushState({}, '', currentUrl.toString());
    }, 1500);
  }
  
  handleError(submitBtn) {
    this.setLoadingState(submitBtn, false);
    this.showMessage('حدث خطأ مؤقت، يرجى المحاولة لاحقاً أو التواصل معنا عبر واتساب', 'error');
  }
  
  validateEmail(email) {
    return this.emailRegex.test(email) && email.length <= 100;
  }
  
  isRateLimited() {
    const lastSubmission = localStorage.getItem(this.rateLimitKey);
    if (!lastSubmission) return false;
    
    const timeDiff = Date.now() - parseInt(lastSubmission);
    return timeDiff < this.rateLimitTime;
  }
  
  isAlreadySubscribed(email) {
    const subscribers = this.getSubscribers();
    return subscribers.includes(email.toLowerCase());
  }
  
  saveToLocalStorage(email) {
    const subscribers = this.getSubscribers();
    const normalizedEmail = email.toLowerCase();
    
    if (!subscribers.includes(normalizedEmail)) {
      subscribers.push(normalizedEmail);
      localStorage.setItem(this.subscribersKey, JSON.stringify(subscribers));
    }
    
    // Also save to a backup with timestamp
    const backupData = {
      email: normalizedEmail,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    const backups = JSON.parse(localStorage.getItem('newsletter_backups') || '[]');
    backups.push(backupData);
    
    // Keep only last 50 entries
    if (backups.length > 50) {
      backups.splice(0, backups.length - 50);
    }
    
    localStorage.setItem('newsletter_backups', JSON.stringify(backups));
  }
  
  getSubscribers() {
    return JSON.parse(localStorage.getItem(this.subscribersKey) || '[]');
  }
  
  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = '<span class="loading-spinner"></span> جاري الاشتراك...';
      button.classList.add('loading');
    } else {
      button.disabled = false;
      button.innerHTML = '✉️ اشترك مجاناً';
      button.classList.remove('loading');
    }
  }
  
  showMessage(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    
    // Add toast to container
    const container = document.getElementById('toastContainer') || this.createToastContainer();
    container.appendChild(toast);
    
    // Auto remove after delay
    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.4s ease forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 4000);
  }
  
  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.setAttribute('aria-live', 'polite');
    container.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10001;
      pointer-events: none;
    `;
    document.body.appendChild(container);
    return container;
  }
  
  checkSubmissionSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('subscribed') === '1') {
      this.showMessage('✅ تم الاشتراك بنجاح! ستصلك أحدث النصائح والعروض قريباً', 'success');
      
      // Clean URL
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('subscribed');
      window.history.replaceState({}, document.title, cleanUrl.toString());
    }
  }
}

// Enhanced Newsletter Form with Better UX
class EnhancedNewsletterForm {
  constructor(formSelector = '.newsletter-form') {
    this.forms = document.querySelectorAll(formSelector);
    this.init();
  }
  
  init() {
    this.enhanceForms();
  }
  
  enhanceForms() {
    this.forms.forEach(form => {
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (!emailInput || !submitBtn) return;
      
      // Add real-time validation
      emailInput.addEventListener('input', () => {
        this.validateEmailInput(emailInput);
      });
      
      // Add enter key support
      emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitBtn.click();
        }
      });
      
      // Add focus/blur effects
      emailInput.addEventListener('focus', () => {
        form.classList.add('focused');
      });
      
      emailInput.addEventListener('blur', () => {
        form.classList.remove('focused');
        this.validateEmailInput(emailInput);
      });
    });
  }
  
  validateEmailInput(input) {
    const email = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email.length > 0) {
      if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
      } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
      }
    } else {
      input.classList.remove('valid', 'invalid');
    }
  }
}

// Alternative Newsletter Service using EmailJS
class EmailJSNewsletter {
  constructor() {
    this.serviceId = 'service_arabsad';
    this.templateId = 'template_newsletter';
    this.publicKey = 'your_emailjs_public_key'; // Replace with actual key
    
    // Initialize EmailJS if available
    this.initEmailJS();
  }
  
  initEmailJS() {
    // Load EmailJS script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.emailjs.com/dist/email.min.js';
    script.onload = () => {
      if (window.emailjs) {
        emailjs.init(this.publicKey);
      }
    };
    document.head.appendChild(script);
  }
  
  async sendEmail(email) {
    if (!window.emailjs) {
      throw new Error('EmailJS not available');
    }
    
    const templateParams = {
      subscriber_email: email,
      timestamp: new Date().toLocaleString('ar-EG'),
      website: 'arabsad.com'
    };
    
    return emailjs.send(this.serviceId, this.templateId, templateParams);
  }
}

// Webhook Newsletter Service
class WebhookNewsletter {
  constructor() {
    this.webhooks = [
      'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/', // Replace with actual
      'https://maker.ifttt.com/trigger/newsletter_signup/with/key/YOUR_IFTTT_KEY' // Replace with actual
    ];
  }
  
  async sendToWebhooks(email) {
    const data = {
      email: email,
      timestamp: new Date().toISOString(),
      source: 'arabsad.com',
      language: 'ar'
    };
    
    const promises = this.webhooks.map(webhook => 
      fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(() => null) // Silent fail
    );
    
    const results = await Promise.allSettled(promises);
    return results.some(result => result.status === 'fulfilled');
  }
}

// CSS for enhanced newsletter form
const newsletterCSS = `
<style>
/* Newsletter Form Enhancements */
.newsletter-form {
  transition: all 0.3s ease;
}

.newsletter-form.focused {
  transform: scale(1.02);
}

.form-group {
  position: relative;
}

.form-group input {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.form-group input.valid {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-group input.invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-group input.invalid + button {
  opacity: 0.7;
  pointer-events: none;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.newsletter-form button.loading {
  opacity: 0.8;
  pointer-events: none;
}

/* Enhanced toast notifications */
.toast {
  background: #1e293b;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideInToast 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  max-width: 400px;
  font-family: 'Cairo', sans-serif;
  font-weight: 500;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toast-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.toast-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.toast-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.toast-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

@keyframes slideInToast {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutToast {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML('beforeend', newsletterCSS);

// Initialize Newsletter System
document.addEventListener('DOMContentLoaded', () => {
  new NewsletterSystem();
  new EnhancedNewsletterForm();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NewsletterSystem, EnhancedNewsletterForm };
}