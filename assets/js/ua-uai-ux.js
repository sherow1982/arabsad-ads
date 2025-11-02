/* auto-apply UA/UAI/UX classes */
(function(){
  document.documentElement.classList.add('ua-light');
  // mark key blocks as elegant surfaces
  const selectors=['.services-section','.features-section','.countries-section','.newsletter-section','.contact-section'];
  selectors.forEach(sel=>{ document.querySelectorAll(sel).forEach(el=> el.classList.add('ua-surface','reveal')); });
})();
