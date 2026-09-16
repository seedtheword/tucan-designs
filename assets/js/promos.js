/* ============================================================
   TuKan Designs â€” Promos & seasonal sales
   1. Top sale bar: auto-detects the active seasonal promo by date
      (Labor Day, Black Friday, Cyber Monday) and shows a dismissible
      banner. Dismissal is remembered per-promo via localStorage.
   2. Promo slideshow: rotates through evergreen + active-sale slides.

   Brandon can tweak dates/copy in the SALES array below each year.
   ============================================================ */
(function () {
  'use strict';

  var YEAR = new Date().getFullYear();

  // Helper: build a Date at local midnight
  function d(y, m, day) { return new Date(y, m, day, 0, 0, 0); }

  // â”€â”€ Seasonal sales windows (update yearly) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Labor Day = first Monday of September. Black Friday = day after
  // 4th Thursday of November. Cyber Monday = following Monday.
  function laborDay(y) {
    var dt = d(y, 8, 1);
    while (dt.getDay() !== 1) dt.setDate(dt.getDate() + 1); // Monday
    return dt;
  }
  function thanksgiving(y) {
    var count = 0, dt = d(y, 10, 1);
    while (true) {
      if (dt.getDay() === 4) { count++; if (count === 4) break; }
      dt.setDate(dt.getDate() + 1);
    }
    return dt;
  }

  var ld = laborDay(YEAR);
  var tg = thanksgiving(YEAR);
  var blackFriday = new Date(tg); blackFriday.setDate(tg.getDate() + 1);
  var cyberMonday = new Date(tg); cyberMonday.setDate(tg.getDate() + 4);

  var SALES = [
    {
      id: 'labor-day-' + YEAR,
      tag: 'Labor Day',
      msg: 'Labor Day Sale â€” 15% off all in-stock tables.',
      code: 'LABOR15',
      start: new Date(ld.getFullYear(), ld.getMonth(), ld.getDate() - 4), // Thu before
      end: new Date(ld.getFullYear(), ld.getMonth(), ld.getDate() + 1, 23, 59, 59),
      discount: 0.15,
      slide: {
        tag: 'Labor Day Sale',
        title: '15% off, <em>this weekend only.</em>',
        desc: 'Every in-stock table is 15% off through Labor Day. Take home a piece built to last.'
      }
    },
    {
      id: 'black-friday-' + YEAR,
      tag: 'Black Friday',
      msg: 'Black Friday â€” 20% off in-stock tables + free local delivery.',
      code: 'BLACK20',
      start: new Date(blackFriday.getFullYear(), blackFriday.getMonth(), blackFriday.getDate(), 0, 0, 0),
      end: new Date(blackFriday.getFullYear(), blackFriday.getMonth(), blackFriday.getDate(), 23, 59, 59),
      discount: 0.20,
      slide: {
        tag: 'Black Friday',
        title: '20% off + <em>free local delivery.</em>',
        desc: 'Our biggest discount of the year on in-stock tables. One day only.'
      }
    },
    {
      id: 'cyber-monday-' + YEAR,
      tag: 'Cyber Monday',
      msg: 'Cyber Monday â€” 20% off custom orders placed today.',
      code: 'CYBER20',
      start: new Date(cyberMonday.getFullYear(), cyberMonday.getMonth(), cyberMonday.getDate(), 0, 0, 0),
      end: new Date(cyberMonday.getFullYear(), cyberMonday.getMonth(), cyberMonday.getDate(), 23, 59, 59),
      discount: 0.20,
      slide: {
        tag: 'Cyber Monday',
        title: '20% off <em>custom builds.</em>',
        desc: 'Start a custom table today and take 20% off your deposit. Ends at midnight.'
      }
    }
  ];

  function activeSale() {
    var now = new Date();
    for (var i = 0; i < SALES.length; i++) {
      if (now >= SALES[i].start && now <= SALES[i].end) return SALES[i];
    }
    return null;
  }

  // â”€â”€ Sale bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var sale = activeSale();
  var bar = document.getElementById('sale-bar');
  if (bar && sale) {
    var dismissed = false;
    try { dismissed = localStorage.getItem('tukan-sale-dismissed') === sale.id; } catch (_) {}
    if (!dismissed) {
      document.getElementById('sale-bar-tag').textContent = sale.tag;
      document.getElementById('sale-bar-msg').textContent = sale.msg + ' Use code ' + sale.code + '.';
      bar.hidden = false;
      document.body.classList.add('has-sale-bar');
      document.getElementById('sale-bar-close').addEventListener('click', function () {
        bar.hidden = true;
        document.body.classList.remove('has-sale-bar');
        try { localStorage.setItem('tukan-sale-dismissed', sale.id); } catch (_) {}
      });
    }
  }

  // â”€â”€ Promo slideshow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Evergreen slides always show; the active sale slide is prepended.
  var slides = [
    {
      tag: 'Built to Order',
      title: 'A table is where <em>life happens.</em>',
      desc: 'Meals, homework, late-night talks. We build the piece that holds all of it â€” for generations.',
      cta: { label: 'Explore Tables', href: '#products' }
    },
    {
      tag: 'Solid Hardwood',
      title: 'No veneer. No shortcuts. <em>Just wood.</em>',
      desc: 'Every TuKan table is solid hardwood, joined by hand and finished to last a lifetime.',
      cta: { label: 'Start a Custom Order', href: '#custom' }
    },
    {
      tag: 'Free Consultation',
      title: 'Not sure what you need? <em>Let\'s talk.</em>',
      desc: 'Book a free 30-minute consultation and we\'ll help you design the perfect table for your space.',
      cta: { label: 'Book a Consult', href: '#consultation' }
    }
  ];
  if (sale) {
    slides.unshift({
      tag: sale.slide.tag,
      title: sale.slide.title,
      desc: sale.slide.desc + ' Use code ' + sale.code + '.',
      cta: { label: 'Shop the Sale', href: '#products' }
    });
  }

  var viewport = document.getElementById('promo-viewport');
  var dotsWrap = document.getElementById('promo-dots');
  if (viewport && dotsWrap) {
    viewport.innerHTML = slides.map(function (s, i) {
      return '<div class="promo__slide' + (i === 0 ? ' is-active' : '') + '">' +
        '<div class="promo__slide-tag">' + s.tag + '</div>' +
        '<h2 class="promo__slide-title">' + s.title + '</h2>' +
        '<p class="promo__slide-desc">' + s.desc + '</p>' +
        '<a class="btn btn--gold" href="' + s.cta.href + '">' + s.cta.label + '</a>' +
        '</div>';
    }).join('');
    dotsWrap.innerHTML = slides.map(function (_, i) {
      return '<button class="promo__dot' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
    }).join('');

    var slideEls = viewport.querySelectorAll('.promo__slide');
    var dotEls = dotsWrap.querySelectorAll('.promo__dot');
    var current = 0, timer = null;

    function goTo(i) {
      slideEls[current].classList.remove('is-active');
      dotEls[current].classList.remove('is-active');
      current = (i + slideEls.length) % slideEls.length;
      slideEls[current].classList.add('is-active');
      dotEls[current].classList.add('is-active');
    }
    function start() { stop(); timer = setInterval(function () { goTo(current + 1); }, 6000); }
    function stop() { if (timer) clearInterval(timer); }

    dotEls.forEach(function (dot) {
      dot.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-i'), 10)); start(); });
    });
    var promoEl = document.getElementById('promo');
    if (promoEl) {
      promoEl.addEventListener('mouseenter', stop);
      promoEl.addEventListener('mouseleave', start);
    }
    if (slideEls.length > 1) start();
  }

  // Expose active sale so the payment/product modules can apply discounts
  window.TuKanPromos = { activeSale: sale };
})();
