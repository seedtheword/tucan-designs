/* Tucan Designs — site interactions */
(function () {
  'use strict';

  // ── Intro: a wrapped gift box — click splits it open to reveal the site ──
  (function initIntro() {
    var intro = document.getElementById('intro');
    if (!intro) return;

    // Show once per browser session (not on every page navigation)
    var SEEN_KEY = 'tucan-intro-seen';
    var alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (_) {}
    if (alreadySeen) { intro.classList.add('is-done'); return; }

    document.body.classList.add('intro-lock');

    var opening = false;
    function reveal() {
      if (opening) return;
      opening = true;
      try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (_) {}
      intro.classList.add('is-open');
      document.body.classList.remove('intro-lock');
      // Remove from the flow once the box has finished peeling apart
      window.setTimeout(function () { intro.classList.add('is-done'); }, 1100);
    }

    // Wait for the visitor: click / tap anywhere, or any relevant key
    intro.addEventListener('click', reveal);
    function onKey(e) {
      if (opening) { document.removeEventListener('keydown', onKey); return; }
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'Escape') {
        e.preventDefault(); reveal();
      }
    }
    document.addEventListener('keydown', onKey);

    // Safety net: never trap the visitor if something stalls
    window.setTimeout(reveal, 15000);
  })();

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

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero photo parallax — subtle drift + scale as you scroll past the hero
  var heroRender = document.getElementById('hero-render');
  if (heroRender && !reduceMotion) {
    var heroImg = heroRender.querySelector('.hero__render-frame img');
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        if (y < 900 && heroImg) {
          // move image up slightly and ease scale as user scrolls
          var shift = Math.min(y * 0.06, 46);
          var scale = 1.04 + Math.min(y * 0.00012, 0.05);
          heroImg.style.transform = 'translateY(-' + shift + 'px) scale(' + scale.toFixed(3) + ')';
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll-reveal: fade/rise elements marked with [data-reveal] as they enter
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }
})();
