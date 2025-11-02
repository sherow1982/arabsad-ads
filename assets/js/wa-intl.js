// Country/timezone-based WhatsApp message tweak - Non-invasive
(function(){
  'use strict';
  try{
    if(window.__WA_INTL_LOADED__) return; window.__WA_INTL_LOADED__=true;
    const byTZ=[
      {re:/Riyadh|Arab/i, code:'SA', msg:'أحتاج استشارة لحملة في السعودية'},
      {re:/Dubai|Abu|Gulf|Muscat/i, code:'AE', msg:'أريد خطة إعلانات في الإمارات'}
    ];
    function getTZ(){ try{ return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }catch(e){ return '' } }
    const tz=getTZ();
    const match=byTZ.find(x=>x.re.test(tz));
    if(!match) return;
    function apply(){
      const links=document.querySelectorAll('a[href^="https://wa.me/201110760081"]');
      links.forEach(function(a){ try{ const u=new URL(a.href); if(!u.searchParams.get('text')){ u.searchParams.set('text', match.msg); a.href=u.toString(); } }catch(e){} });
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', apply, {once:true}); else apply();
  }catch(e){}
})();