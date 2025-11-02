// UTM tracking for WhatsApp links - Non-invasive implementation
(function(){
  'use strict';
  try{
    if(window.__WA_UTM_LOADED__) return;
    window.__WA_UTM_LOADED__ = true;
    function getPageCampaign(){
      const path = (location.pathname || '').replace(/^\/+/, '').replace(/\.html$/,'');
      if(!path || path === 'index') return 'homepage';
      return path.replace(/\//g, '-').replace(/[^a-zA-Z0-9\-]/g, '-').toLowerCase();
    }
    function enhanceWhatsAppLinks(){
      const links = document.querySelectorAll('a[href^="https://wa.me/201110760081"]');
      const campaign = getPageCampaign();
      links.forEach(function(link, index){
        try{
          const url = new URL(link.href);
          url.searchParams.set('utm_source', 'arabsad_site');
          url.searchParams.set('utm_medium', 'whatsapp_button');
          url.searchParams.set('utm_campaign', campaign);
          if(links.length > 1) url.searchParams.set('utm_content', 'btn_' + (index + 1));
          link.href = url.toString();
        }catch(e){}
      });
    }
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', enhanceWhatsAppLinks, {once: true});
    } else {
      enhanceWhatsAppLinks();
    }
  }catch(e){}
})();