# TuKan Designs — SEO: what's done + what only you can do

Live site: https://seedtheword.github.io/tucan-designs/

## Already done in the code (pushed)
- Rebranded display text Tucan → TuKan (repo/URL still `tucan-designs`).
- `<title>`, meta description, keywords, author, `robots: index,follow`.
- Canonical tag, full Open Graph + Twitter card, 1200×630 `og-image.jpg`.
- JSON-LD structured data (LocalBusiness/HomeGoodsStore + WebSite).
- `sitemap.xml` and `robots.txt` at the site root.
- One H1, ordered headings, image alt text, valid internal links.
- Compressed hero background; sized images for Core Web Vitals.

## What only you can do (off-code) — in priority order

### 1. Google Search Console (biggest lever — do this first)
A brand-new GitHub Pages site usually just hasn't been crawled yet. This is
how you tell Google it exists.
1. Go to https://search.google.com/search-console and add a property.
2. Choose **URL prefix** and enter: `https://seedtheword.github.io/tucan-designs/`
3. Verify with the **HTML tag** method. Google gives you a tag like:
   `<meta name="google-site-verification" content="XXXXXXXX">`
   Send me that content string and I'll paste it into `<head>`, OR paste it
   yourself right under the `<meta name="viewport">` line in `index.html`.
   (Note: the "HTML file upload" method also works and needs no code change.)
4. After verifying: **Sitemaps → add** `sitemap.xml` and submit.
5. **URL Inspection → enter the homepage → Request Indexing.**
Indexing can take days to a couple of weeks. That's normal.

### 2. Enforce HTTPS
GitHub Pages already serves HTTPS. Just confirm the toggle:
- Repo → **Settings → Pages → check "Enforce HTTPS."**

### 3. Backlinks / off-page (can't be done in code — this is outreach)
Google ranks sites partly on who links to them. Free, legitimate starting
points for a local furniture maker:
- **Google Business Profile** (google.com/business) — huge for "near me"
  searches; also gets you on Google Maps. Free.
- Free business directories: Bing Places, Yelp, Nextdoor, Houzz (great for
  furniture/interiors), Etsy or a Facebook/Instagram shop that links back.
- Local angle: chamber of commerce, local maker/craft directories, any
  supplier or lumber yard that lists partners.
- Ask happy customers to review on Google (reviews + links both help).
- Avoid paid "buy backlinks" services — Google penalizes those.

### 4. (Optional) Rename the repo/URL to `tukan-designs`
Only if you want the address to match the new spelling. Trade-offs: it
changes the site URL and you'd re-point Search Console + any existing links.
Doing this right as you start indexing can set you back, so I'd wait.
If you decide to: on github.com → repo **Settings → rename** to
`tukan-designs`, then update every `seedtheword.github.io/tucan-designs/`
reference in the code (canonical, OG, sitemap, robots) — tell me and I'll do
the code side.

## Things I could NOT verify from here (be aware)
- Real Core Web Vitals / PageSpeed scores — run the live URL through
  https://pagespeed.web.dev after Pages updates.
- Whether the custom email/domain (`hello@tukandesigns.com`) is real/active.
- Real business phone — the site still has a placeholder `tel:+10000000000`
  in the "Call for Service"/footer/pay links. Give me the real number and I'll
  drop it in; until then those call buttons don't dial a real line.
