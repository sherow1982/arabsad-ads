// Page-based WhatsApp message customization - Non-invasive
(function(){
  'use strict';
  try{
    if(window.__WA_PAGE_MSG_LOADED__) return;
    window.__WA_PAGE_MSG_LOADED__ = true;
    const pageMessages = {
      '/google-ads-service.html': 'أحتاج استشارة لحملة Google Ads مع خطة Performance Max',
      '/social-media-service.html': 'أريد بدء حملة سوشيال (Facebook/Instagram/TikTok/Snapchat)',
      '/seo-service.html': 'أريد خطة SEO تقنية ومحتوى وروابط',
      '/ecommerce-service.html': 'أحتاج متجر إلكتروني سريع ومحسّن للتحويل',
      '/blog/articles/google-search-ads.html': 'استشارة جوجل بحث وكلمات مفتاحية',
      '/blog/articles/google-display-ads.html': 'أريد حملة شبكة Google Display',
      '/blog/articles/youtube-ads.html': 'أريد حملة YouTube Ads مع إنتاج فيديو',
      '/blog/articles/google-shopping-ads.html': 'أريد حملة Google Shopping ومراجعة تغذية المنتجات',
      '/blog/articles/facebook-ads.html': 'أريد حملة Facebook Ads ومراجعة الحساب',
      '/blog/articles/instagram-ads.html': 'أريد حملة Instagram Reels/Stories',
      '/blog/articles/tiktok-ads.html': 'أريد حملة TikTok Ads وفيديوهات قصيرة',
      '/blog/articles/snapchat-ads.html': 'أريد حملة Snapchat Ads'
    };
    function customizePageMessage(){
      const path = location.pathname;
      const message = pageMessages[path];
      if(!message) return;
      const links = document.querySelectorAll('a[href^="https://wa.me/201110760081"]');
      links.forEach(function(link){
        try{ const url = new URL(link.href); url.searchParams.set('text', message); link.href = url.toString(); }catch(e){}
      });
    }
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', customizePageMessage, {once: true});
    } else { customizePageMessage(); }
  }catch(e){}
})();