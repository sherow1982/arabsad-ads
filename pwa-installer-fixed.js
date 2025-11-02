/*
 * PWA Installer (Fixed Version) - Simplified & Working
 * مثبت PWA مُصحح ومبسط - يعمل بكفاءة
 * مؤسسة إعلانات العرب
 */

(function() {
  'use strict';
  
  let deferredPrompt = null;
  let installBannerCreated = false;
  
  // فحص حالة التثبيت
  function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
  }
  
  // إنشاء بنر التثبيت
  function createInstallBanner() {
    if (installBannerCreated || isAppInstalled()) return;
    
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      font-family: 'Cairo', sans-serif;
    `;
    
    banner.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <div style="font-size: 2rem;">📱</div>
        <div style="flex: 1; min-width: 200px;">
          <h4 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; font-weight: 600;">تثبيت تطبيق ArabSad</h4>
          <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">وصول سريع، عمل بدون انترنت، وإشعارات مفيدة!</p>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button id="pwa-install-btn" style="
            background: rgba(255,255,255,0.9); 
            color: #1f2937; 
            border: none; 
            padding: 0.5rem 1rem; 
            font-size: 0.85rem; 
            border-radius: 20px; 
            font-weight: 500; 
            cursor: pointer;
            transition: all 0.3s ease;
          ">📦 تثبيت الآن</button>
          <button id="pwa-dismiss-btn" style="
            background: transparent; 
            color: white; 
            border: 2px solid rgba(255,255,255,0.6); 
            padding: 0.5rem 1rem; 
            font-size: 0.85rem; 
            border-radius: 20px; 
            font-weight: 500; 
            cursor: pointer;
            transition: all 0.3s ease;
          ">لاحقاً</button>
        </div>
        <button id="pwa-close-btn" style="
          background: rgba(255,255,255,0.2); 
          border: none; 
          color: white; 
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          cursor: pointer; 
          font-size: 1.2rem;
        ">&times;</button>
      </div>
    `;
    
    document.body.appendChild(banner);
    installBannerCreated = true;
    
    // ربط الأحداث
    document.getElementById('pwa-install-btn').addEventListener('click', installApp);
    document.getElementById('pwa-dismiss-btn').addEventListener('click', dismissInstall);
    document.getElementById('pwa-close-btn').addEventListener('click', hideBanner);
    
    console.log('✅ تم إنشاء بنر التثبيت');
  }
  
  // إظهار بنر التثبيت
  function showBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner && !isAppInstalled()) {
      banner.style.transform = 'translateY(0)';
      console.log('👀 إظهار بنر التثبيت');
    }
  }
  
  // إخفاء بنر التثبيت
  function hideBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.transform = 'translateY(-100%)';
      console.log('🙈 إخفاء بنر التثبيت');
    }
  }
  
  // تثبيت التطبيق
  async function installApp() {
    console.log('🚀 محاولة تثبيت PWA...');
    
    const installBtn = document.getElementById('pwa-install-btn');
    
    if (!deferredPrompt) {
      console.log('⚠️ لا يوجد deferredPrompt - عرض تعليمات يدوية');
      showManualInstructions();
      return;
    }
    
    if (installBtn) {
      installBtn.innerHTML = '⏳ جاري التثبيت...';
      installBtn.disabled = true;
    }
    
    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      
      console.log('📊 نتيجة اختيار المستخدم:', result.outcome);
      
      if (result.outcome === 'accepted') {
        hideBanner();
        showSuccessMessage();
      } else {
        if (installBtn) {
          installBtn.innerHTML = '📦 تثبيت الآن';
          installBtn.disabled = false;
        }
        localStorage.setItem('pwa-dismissed', Date.now().toString());
      }
    } catch (error) {
      console.error('❌ خطأ في التثبيت:', error);
      if (installBtn) {
        installBtn.innerHTML = '📦 تثبيت الآن';
        installBtn.disabled = false;
      }
      showManualInstructions();
    }
    
    deferredPrompt = null;
  }
  
  // رفض التثبيت
  function dismissInstall() {
    hideBanner();
    localStorage.setItem('pwa-dismissed', Date.now().toString());
    console.log('🚫 تم رفض التثبيت');
  }
  
  // عرض تعليمات التثبيت اليدوي
  function showManualInstructions() {
    const userAgent = navigator.userAgent.toLowerCase();
    let instruction = '';
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      instruction = '🍎 لتثبيت التطبيق على iPhone/iPad:\n\n1. افتح Safari\n2. انقر زر المشاركة 🔗\n3. اختر "إضافة إلى الشاشة الرئيسية"\n4. انقر "إضافة"';
    } else if (userAgent.includes('android')) {
      instruction = '🤖 لتثبيت التطبيق على Android:\n\n1. افتح Chrome\n2. انقر القائمة ⋮\n3. اختر "تثبيت التطبيق"\n4. انقر "تثبيت"';
    } else {
      instruction = '💻 لتثبيت التطبيق على سطح المكتب:\n\n1. ابحث عن أيقونة 📦 في شريط العنوان\n2. انقر عليها واختر "تثبيت"\n3. أو استخدم Ctrl+Shift+A في Chrome';
    }
    
    if (window.confirm(instruction + '\n\nهل تريد متابعة التثبيت؟')) {
      console.log('✅ المستخدم يريد التثبيت اليدوي');
    }
  }
  
  // عرض رسالة النجاح
  function showSuccessMessage() {
    const success = document.createElement('div');
    success.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10002;
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      text-align: center;
      min-width: 300px;
      animation: scaleIn 0.3s ease;
    `;
    
    success.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
      <h4 style="color: #10b981; margin: 0 0 0.5rem 0; font-size: 1.25rem;">تم التثبيت بنجاح!</h4>
      <p style="color: #6b7280; margin: 0; font-size: 0.9rem;">يمكنك الآن الوصول لـ ArabSad من شاشتك الرئيسية</p>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 20px;
        cursor: pointer;
      ">رائع!</button>
    `;
    
    document.body.appendChild(success);
    
    // إزالة تلقائية بعد 5 ثواني
    setTimeout(() => {
      if (success.parentElement) {
        success.remove();
      }
    }, 5000);
  }
  
  // الاستماع لأحداث PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🎯 تم التقاط beforeinstallprompt - PWA قابل للتثبيت!');
    e.preventDefault();
    deferredPrompt = e;
    
    // إنشاء البنر وإظهاره بعد 8 ثواني
    createInstallBanner();
    
    if (!localStorage.getItem('pwa-dismissed')) {
      setTimeout(showBanner, 8000);
    }
  });
  
  window.addEventListener('appinstalled', (e) => {
    console.log('🎉 تم تثبيت PWA بنجاح!');
    hideBanner();
    showSuccessMessage();
    
    // تتبع التثبيت
    if (window.gtag) {
      gtag('event', 'pwa_install', {
        'event_category': 'PWA',
        'event_label': 'Installation Success'
      });
    }
  });
  
  // تسجيل Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('✅ Service Worker مسجل بنجاح');
      })
      .catch(error => {
        console.warn('⚠️ Service Worker غير متاح:', error.message);
      });
  }
  
  // إضافة CSS للانيميشنز
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scaleIn {
      from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @media (max-width: 768px) {
      #pwa-install-banner .banner-content {
        justify-content: center !important;
        text-align: center !important;
      }
      
      #pwa-install-banner .banner-actions {
        width: 100% !important;
        justify-content: center !important;
        margin-top: 0.75rem !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // إتاحة عامة
  window.ArabSadPWA = {
    install: installApp,
    isInstalled: isAppInstalled,
    show: showBanner,
    hide: hideBanner
  };
  
  console.log('🚀 PWA Installer محسن وجاهز!');
  
})();