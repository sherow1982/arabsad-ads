// Service Worker for ArabSad.com PWA
const CACHE_NAME = 'arabsad-v1.0.0';
const CACHE_VERSION = '2025-11-02';

// قائمة الملفات المهمة للتخزين المؤقت
const CORE_CACHE = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/slider.css',
  '/assets/css/ux-enhancements.css',
  '/enhanced-arabic-fonts.css',
  '/script.js',
  '/assets/js/boot.js',
  '/assets/images/logo.svg',
  '/favicon.ico',
  '/favicon.svg',
  '/manifest.json'
];

// ملفات الصفحات المهمة
const PAGES_CACHE = [
  '/services-page.html',
  '/google-ads-service.html',
  '/social-media-service.html',
  '/seo-service.html',
  '/ecommerce-service.html',
  '/sa.html',
  '/ae.html',
  '/kw.html',
  '/qa.html',
  '/bh.html',
  '/om.html',
  '/privacy-policy.html',
  '/terms-of-service.html'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الأساسية
      caches.open(CACHE_NAME).then(cache => {
        console.log('Service Worker: Caching core files');
        return cache.addAll(CORE_CACHE);
      }),
      
      // تخزين الصفحات المهمة
      caches.open(CACHE_NAME + '-pages').then(cache => {
        console.log('Service Worker: Caching pages');
        return cache.addAll(PAGES_CACHE.map(url => new Request(url, { credentials: 'omit' })));
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  
  event.waitUntil(
    // حذف الكاشات القديمة
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== CACHE_NAME + '-pages') {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// التعامل مع طلبات الشبكة
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // تجاهل الطلبات الخارجية والامتدادات غير المدعومة
  if (
    !url.origin.includes(location.origin) ||
    request.method !== 'GET' ||
    url.pathname.includes('wp-admin') ||
    url.pathname.includes('api') ||
    url.pathname.includes('.php')
  ) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // إرجاع النسخة المخزنة إذا وجدت
      if (cachedResponse) {
        console.log('Service Worker: Serving from cache:', request.url);
        
        // تحديث الكاش في الخلفية (stale-while-revalidate)
        fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }
      
      // جلب من الشبكة وتخزين
      return fetch(request).then(response => {
        // التأكد من صحة الاستجابة
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        console.log('Service Worker: Fetching and caching:', request.url);
        
        // تخزين النسخة الجديدة
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseClone);
        });
        
        return response;
      }).catch(() => {
        // في حالة عدم وجود اتصال، إرجاع صفحة غير متصل
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
        
        // للموارد الأخرى، إرجاع استجابة فارغة
        return new Response('', {
          status: 408,
          statusText: 'Offline'
        });
      });
    })
  );
});

// التعامل مع رسائل من الصفحة الرئيسية
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      cacheName: CACHE_NAME
    });
  }
});

// تنظيف دوري للكاش
self.addEventListener('sync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        const oldCaches = cacheNames.filter(name => 
          name.startsWith('arabsad-') && name !== CACHE_NAME && name !== CACHE_NAME + '-pages'
        );
        
        return Promise.all(
          oldCaches.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// إشعارات الدفع (في المستقبل)
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'لديك إشعار جديد من مؤسسة إعلانات العرب',
    icon: '/assets/images/logo.svg',
    badge: '/assets/images/badge.svg',
    tag: 'arabsad-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'فتح الموقع',
        icon: '/assets/images/open-icon.svg'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/assets/images/close-icon.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'مؤسسة إعلانات العرب', options)
  );
});

// التعامل مع نقرات الإشعارات
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/') || clients.openWindow('https://arabsad.com')
    );
  }
});