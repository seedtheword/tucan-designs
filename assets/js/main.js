/* Tucan Designs — site interactions */
(function () {
  'use strict';

  // Shrink nav padding on scroll for a subtle settle effect
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.style.padding = '0.9rem 2.5rem';
      } else {
        nav.style.padding = '';
      }
    }, { passive: true });
  }

  // Mobile menu toggle (simple show/hide of a cloned link list)
  var toggle = document.getElementById('nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var links = document.querySelector('.nav__links');
      if (!links) return;
      var open = links.style.display === 'flex';
      links.style.display = open ? '' : 'flex';
      links.style.cssText = open ? '' :
        'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:#141210;padding:1.5rem;gap:1.25rem;border-bottom:1px solid rgba(201,165,77,0.16);';
    });
  }

  // Smooth-scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();
