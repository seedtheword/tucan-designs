# Tucan Designs — Backend & Config Setup

This guide wires up the website's live features. The site works **without** any
of this (custom orders and the newsletter fall back to opening an email draft;
payments show a "being set up" note). Do these steps when you're ready to go
fully live.

All settings live in **`assets/data/site-config.json`**. Leave any value as an
empty string `""` to keep that feature in its safe fallback mode.

---

## 1. Order handler (custom orders + newsletter + payment log)

This is a free Google Apps Script "Web App" that receives form submissions,
saves uploaded photos to Google Drive, and records everything in a Google Sheet.

1. **Create a Google Sheet** (sheets.new). Name it e.g. "Tucan Designs — Orders".
   From its URL copy the ID (the long string between `/d/` and `/edit`).
2. **Create a Drive folder** for order photos (drive.google.com → New → Folder).
   Open it and copy the ID from the URL (after `/folders/`).
3. In the Sheet: **Extensions → Apps Script**. Delete the sample code and paste
   the entire contents of [`order-handler.gs`](./order-handler.gs).
4. At the top of the script, fill in:
   - `SHEET_ID` → the Sheet ID from step 1
   - `DRIVE_FOLDER_ID` → the folder ID from step 2
   - `NOTIFY_EMAIL` → where new-order emails should go (or `''` for none)
5. **Deploy → New deployment**. Click the gear, choose **Web app**.
   - Description: `Tucan order handler`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, authorize when prompted (choose your Google account,
     "Advanced" → allow).
6. Copy the **Web app URL** (ends in `/exec`).
7. Paste it into `assets/data/site-config.json` as `orderHandlerUrl`.

Test it: open the `/exec` URL in a browser — you should see
`{"ok":true,"service":"Tucan Designs order handler",...}`.

The script auto-creates three tabs on first use: **Orders**, **Newsletter**,
**Payments**.

> Re-deploying after edits: use **Deploy → Manage deployments → (edit) → New
> version** so the URL stays the same.

---

## 2. Online payments (PayPal)

1. Go to [developer.paypal.com](https://developer.paypal.com) and log in with
   Brandon's **PayPal Business** account.
2. **Apps & Credentials** → make sure you're on **Live** (toggle top-right) →
   **Create App**. Name it "Tucan Designs Website".
3. Copy the **Client ID**.
4. In `assets/data/site-config.json`:
   - `paypalClientId` → the Client ID
   - `paypalMode` → `live` (or `sandbox` for testing)

Once set, the Pay section shows PayPal buttons. Seasonal discounts are applied
automatically. Until set, the manual "call/email to pay" fallback stays visible.

---

## 3. 30-minute consultation booking

1. In [Google Calendar](https://calendar.google.com), click **Create →
   Appointment schedule**.
2. Set the duration to **30 minutes**, set your availability, and save.
3. Click **Share → Open booking page**, copy that page's URL.
4. Paste it into `assets/data/site-config.json` as `consultUrl`.

The consultation section swaps its call/email placeholder for the live booking
calendar. (You can also paste the URL directly into the `data-appt` attribute on
`#consult-embed` in `index.html`.)

---

## 4. Contact details

- `businessPhone` → in `tel:` format, e.g. `+12065551234`.
- Then update the phone links in `index.html` (search for `tel:+10000000000`)
  and the display text in the footer / "Call for Service" button.
- `businessEmail` defaults to `hello@tucandesigns.com` — change if needed.

---

## 5. Still to provide from Brandon

- [ ] Real business **phone number** (replaces `tel:+10000000000` placeholders)
- [ ] **PayPal** business Client ID (see §2)
- [ ] Google Calendar **consultation booking URL** (see §3)
- [ ] **Founder photos** → drop into `assets/images/` and replace the initials
      placeholders in the Founders section of `index.html`
- [ ] **Founder bios** (currently placeholder copy)
- [ ] **Product photos** → set the `image` field for each item in
      `assets/js/products.js`
- [ ] **Video testimonial** YouTube IDs or MP4 files → edit
      `VIDEO_TESTIMONIALS` in `assets/js/testimonials.js`
- [ ] **Logo** → replace the monogram placeholder in the hero + nav
- [ ] **Product render** graphic → replace the SVG placeholder in the hero
