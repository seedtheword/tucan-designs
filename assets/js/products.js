/* ============================================================
   Tucan Designs — Product catalog
   Edit the PRODUCTS array below to add / change tables.
   Each product:
     id         unique slug
     name       display name
     desc       short description
     price      current price (number)
     wasPrice   optional strikethrough original price (for sales)
     dims       dimensions string
     image      path under assets/images/ (leave '' for placeholder)
     status     'in-stock' | 'made-to-order' | 'sold'
   ============================================================ */

var PRODUCTS = [
  {
    id: 'live-edge-walnut',
    name: 'Live-Edge Walnut Dining',
    desc: 'A single-slab black walnut top with a natural live edge on a blackened steel base. Seats six comfortably.',
    price: 2400,
    wasPrice: null,
    dims: '84" × 40" × 30"',
    image: '',
    status: 'in-stock'
  },
  {
    id: 'farmhouse-oak',
    name: 'Farmhouse White Oak',
    desc: 'Classic trestle farmhouse table in solid white oak with a hand-rubbed matte finish. Built to gather around for decades.',
    price: 1850,
    wasPrice: null,
    dims: '72" × 38" × 30"',
    image: '',
    status: 'in-stock'
  },
  {
    id: 'maple-coffee',
    name: 'Figured Maple Coffee Table',
    desc: 'Curly maple top with tapered walnut legs. A quiet centerpiece for the living room.',
    price: 720,
    wasPrice: null,
    dims: '48" × 24" × 18"',
    image: '',
    status: 'made-to-order'
  },
  {
    id: 'cherry-console',
    name: 'Cherry Entry Console',
    desc: 'A slim solid-cherry console for entryways and hallways, with a single dovetailed drawer.',
    price: 980,
    wasPrice: null,
    dims: '54" × 16" × 32"',
    image: '',
    status: 'made-to-order'
  },
  {
    id: 'epoxy-river',
    name: 'River Epoxy Conference',
    desc: 'Book-matched slabs joined by a translucent gold-tinted resin river. A statement piece for offices and boardrooms.',
    price: 4200,
    wasPrice: null,
    dims: '96" × 44" × 30"',
    image: '',
    status: 'made-to-order'
  },
  {
    id: 'ash-side',
    name: 'Ash Side Table',
    desc: 'A compact solid-ash side table with a subtle chamfered edge. The perfect first Tucan piece.',
    price: 340,
    wasPrice: null,
    dims: '20" × 20" × 24"',
    image: '',
    status: 'in-stock'
  }
];

(function () {
  'use strict';

  var TABLE_GLYPH =
    '<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M14 26 L106 26 L114 34 L6 34 Z" stroke="#C9A54D" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M6 34 L114 34 L114 40 L6 40 Z" stroke="#9A7E38" stroke-width="1"/>' +
    '<line x1="18" y1="40" x2="18" y2="72" stroke="#C9A54D" stroke-width="1.3"/>' +
    '<line x1="102" y1="40" x2="102" y2="72" stroke="#C9A54D" stroke-width="1.3"/>' +
    '<ellipse cx="60" cy="74" rx="52" ry="3" fill="rgba(201,165,77,0.10)"/>' +
    '</svg>';

  var STATUS = {
    'in-stock':      { label: 'In Stock', cls: 'product-card__badge--in' },
    'made-to-order': { label: 'Made to Order', cls: 'product-card__badge--made' },
    'sold':          { label: 'Sold Out', cls: 'product-card__badge--sold' }
  };

  function money(n) {
    return '$' + Number(n).toLocaleString('en-US');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardHtml(p) {
    var st = STATUS[p.status] || STATUS['made-to-order'];
    var media = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<span class="product-card__placeholder">' + TABLE_GLYPH + '</span>';

    var priceHtml = p.wasPrice
      ? '<s>' + money(p.wasPrice) + '</s>' + money(p.price)
      : money(p.price);

    var soldOut = p.status === 'sold';
    var primaryBtn = soldOut
      ? '<a class="btn btn--ghost" href="#consultation">Notify Me</a>'
      : '<a class="btn btn--gold" href="#custom" data-product="' + esc(p.id) + '">Order This</a>';

    return '' +
      '<article class="product-card">' +
        '<div class="product-card__media">' +
          media +
          '<span class="product-card__badge ' + st.cls + '">' + st.label + '</span>' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h3 class="product-card__name">' + esc(p.name) + '</h3>' +
          '<p class="product-card__desc">' + esc(p.desc) + '</p>' +
          '<div class="product-card__meta">' +
            '<span class="product-card__price">' + priceHtml + '</span>' +
            '<span class="product-card__dims">' + esc(p.dims) + '</span>' +
          '</div>' +
          '<div class="product-card__actions">' +
            primaryBtn +
            '<a class="btn btn--ghost" href="#consultation">Ask</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function render() {
    var grid = document.getElementById('products-grid');
    if (!grid) return;
    if (!PRODUCTS.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">New pieces coming soon.</p>';
      return;
    }
    grid.innerHTML = PRODUCTS.map(cardHtml).join('');

    // If an "Order This" button carries a product id, prefill the custom form later.
    grid.querySelectorAll('[data-product]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-product');
        var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
        if (p && window.TucanCustomOrder && typeof window.TucanCustomOrder.prefill === 'function') {
          window.TucanCustomOrder.prefill(p);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  // Expose for other modules (sales promo can rewrite prices, etc.)
  window.TucanProducts = { list: PRODUCTS, render: render };
})();
