// Google Analytics 4 — AI 不止语
// Loaded for every page in /book/ via mdbook additional-js
(function() {
  // Async-load gtag.js
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-4QDL6QMBNS';
  document.head.appendChild(s);

  // Initialize dataLayer + gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-4QDL6QMBNS', {
    // Tag the book pages so reports can split landing vs book traffic
    page_path: window.location.pathname,
    custom_map: { dimension1: 'book_chapter' },
    book_chapter: document.title || 'unknown'
  });
})();
