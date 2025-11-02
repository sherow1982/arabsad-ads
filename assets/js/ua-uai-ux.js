/* Scope UA surfaces to selected sections only to avoid theme conflicts */
(function(){
  const scoped=['.services-section','.features-section','.countries-section'];
  scoped.forEach(sel=>{ document.querySelectorAll(sel).forEach(el=> el.classList.add('ua-surface','reveal')); });
  // Ensure newsletter/contact keep base theme only
  ['.newsletter-section','.contact-section'].forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=> el.classList.remove('ua-surface')); });
})();
