// Ensure micro-interactions script loads after DOM
(function(){
  function loadScript(src){ const s=document.createElement('script'); s.src=src; s.defer=true; document.body.appendChild(s); }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>loadScript('assets/js/micro-interactions.js'));}
  else{ loadScript('assets/js/micro-interactions.js'); }
})();
