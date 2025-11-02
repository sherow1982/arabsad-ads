// Apply Aurora extend CSS by injecting link dynamically (keeps load order simple)
(function(){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='assets/css/aurora-extend.css';
  document.head.appendChild(link);
})();
