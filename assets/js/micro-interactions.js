// Attach ripple origin on click for buttons that use ::after ripple
(function(){
  function setRippleOrigin(e){
    const t=e.currentTarget, r=t.getBoundingClientRect();
    t.style.setProperty('--x', (e.clientX-r.left)+'px');
    t.style.setProperty('--y', (e.clientY-r.top)+'px');
  }
  const rippleSelectors=['.btn','.contact-btn','.action-btn'];
  rippleSelectors.forEach(sel=>{
    document.addEventListener('click',function(e){
      const target=e.target.closest(sel); if(target) setRippleOrigin.call(target,{currentTarget:target, clientX:e.clientX, clientY:e.clientY, ...e});
    }, {passive:true});
  });

  // Idle pulse after 8s
  let idleTimer, root=document.documentElement; function setIdle(){ root.classList.add('fab-idle'); }
  function clearIdle(){ root.classList.remove('fab-idle'); if(idleTimer) clearTimeout(idleTimer); idleTimer=setTimeout(setIdle,8000); }
  ['mousemove','scroll','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,clearIdle,{passive:true}));
  clearIdle();

  // Reveal on scroll
  const revealEls=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('show'); io.unobserve(en.target);} });
  },{threshold:0.12});
  revealEls.forEach(el=>io.observe(el));
})();
