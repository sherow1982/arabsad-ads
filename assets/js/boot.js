// Safe loader for WhatsApp enhancement scripts
(function(){
  'use strict';
  try{
    if(window.__WA_BOOT_LOADED__) return; window.__WA_BOOT_LOADED__=true;
    function load(src){ const s=document.createElement('script'); s.src=src; s.defer=true; s.async=false; document.head.appendChild(s); }
    setTimeout(function(){
      load('assets/js/wa-intl.js');
      load('assets/js/wa-page-msg.js');
      load('assets/js/wa-utm.js');
    },100);
  }catch(e){}
})();