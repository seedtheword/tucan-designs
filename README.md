# Tucan Designs LLC — Website

Marketing + commerce site for **Tucan Designs LLC**, a custom hardwood table
maker (owner: Brandon). Static front-end (HTML/CSS/vanilla JS) with an optional
Google Apps Script backend for custom orders, newsletter signups, and payment
logging. Dark black/gold theme with a minimalist editorial layout.

## Structure

```
index.html                     Single-page site
assets/
  css/style.css                Theme + all component styles
  js/
    promos.js                  Seasonal sales + promo slideshow (loads first)
    products.js                Product catalog (edit PRODUCTS here)
    custom-order.js            Custom order form + photo upload
    testimonials.js            Video testimonials (edit VIDEO_TESTIMONIALS)
    payment.js                 PayPal Smart Buttons + payment logging
    engage.js                  Newsletter + consultation request form
    main.js                    Nav, smooth scroll, animations (loads last)
  data/site-config.json        Runtime config (URLs, PayPal, phone) — edit this
  images/                      Founder photos, logo, product renders (add here)
docs/apps-script/
  order-handler.gs             Google Apps Script Web App (backend)
  SETUP.md                     How to deploy the backend + fill config
```

## Running locally

It's a static site — open `index.html`, or serve the folder:

```
python -m http.server 8000
```

then visit http://localhost:8000

## Going live

See [`docs/apps-script/SETUP.md`](docs/apps-script/SETUP.md) for the backend,
PayPal, consultation booking, and the checklist of assets still needed from
Brandon (phone, photos, bios, video IDs, logo).

## Images

The photos in `assets/images/` are **interim placeholders** sourced from
[Unsplash](https://unsplash.com) (free for commercial use). Swap them for
Brandon's own product/founder photography when available — the file names map
directly to their use:

- `hero-table.jpg` — hero product shot
- `product-*.jpg` — one per catalog item (see `image` field in `products.js`)
- `founder-craftsman.jpg`, `founder-workshop.jpg` — founders section

Photo credits (Unsplash): Ichsan Chairul, Stephan Coudassot, Lee Campbell,
Devin Berko, Pascal Meier, Sven Mieke, ASR Design Studio, Ali Mkumbwa,
Barn Images. Content was rephrased/curated for this project; no changes to the
photos themselves beyond resizing.

## Hosting

Designed for static hosting (GitHub Pages, Netlify, etc.). For GitHub Pages:
repo **Settings → Pages → Deploy from branch → `master` / root**.
