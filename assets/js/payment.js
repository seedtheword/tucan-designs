/* ============================================================
   TuKan Designs — Online payments (PayPal)
   Adapts the Seed the Word pattern:
   - Reads assets/data/site-config.json for { paypalClientId, paypalMode }
   - Loads the PayPal JS SDK dynamically
   - Renders Smart Payment Buttons that create/capture an order for the
     amount entered (card + PayPal + Pay Later in one integration)
   - Applies any active seasonal discount from window.TuKanPromos
   Until a real paypalClientId is configured, the section shows the manual
   fallback methods and a friendly note.
   ============================================================ */
(function () {
  'use strict';

  var amountInput = document.getElementById('pay-amount');
  var nameInput = document.getElementById('pay-name');
  var discountEl = document.getElementById('pay-discount');
  var statusEl = document.getElementById('pay-status');
  var buttonsEl = document.getElementById('paypal-buttons');
  if (!amountInput || !buttonsEl) return;

  var CONFIG = null;
  var sdkLoaded = false;
  var buttonsRendered = false;

  function setStatus(msg, kind) {
    statusEl.textContent = msg || '';
    statusEl.className = 'pay__status' + (kind ? ' pay__status--' + kind : '');
  }

  // Active seasonal discount (0..1) from promos.js, if any
  function currentDiscount() {
    var sale = (window.TuKanPromos && window.TuKanPromos.activeSale) || null;
    return sale && sale.discount ? sale.discount : 0;
  }

  function baseAmount() {
    var v = parseFloat(amountInput.value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function finalAmount() {
    var base = baseAmount();
    var disc = currentDiscount();
    return disc ? Math.round(base * (1 - disc) * 100) / 100 : base;
  }

  function updateDiscountLine() {
    var disc = currentDiscount();
    var base = baseAmount();
    if (disc && base > 0) {
      var sale = window.TuKanPromos.activeSale;
      discountEl.textContent = sale.tag + ' discount applied: ' +
        (disc * 100) + '% off — you pay $' + finalAmount().toLocaleString('en-US');
    } else {
      discountEl.textContent = '';
    }
  }

  amountInput.addEventListener('input', updateDiscountLine);

  // Best-effort log of a completed payment to the order handler (Payments sheet).
  function logPayment(details, data) {
    var url = CONFIG && CONFIG.orderHandlerUrl;
    if (!url) return;
    var payerName = '';
    var payerEmail = '';
    try {
      if (details.payer && details.payer.name) {
        payerName = ((details.payer.name.given_name || '') + ' ' + (details.payer.name.surname || '')).trim();
      }
      payerEmail = (details.payer && details.payer.email_address) || '';
    } catch (_) {}
    try {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'paymentLog',
          payer: payerName || nameInput.value.trim(),
          email: payerEmail,
          invoiceRef: nameInput.value.trim(),
          amount: finalAmount().toFixed(2),
          currency: 'USD',
          orderId: (data && data.orderID) || (details && details.id) || '',
          status: (details && details.status) || 'COMPLETED'
        })
      });
    } catch (_) { /* non-fatal */ }
  }

  async function loadConfig() {
    if (CONFIG) return CONFIG;
    try {
      CONFIG = await fetch('assets/data/site-config.json?t=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.json(); });
    } catch (_) { CONFIG = {}; }
    return CONFIG;
  }

  function loadSdk(clientId, mode) {
    return new Promise(function (resolve, reject) {
      if (sdkLoaded) return resolve();
      var s = document.createElement('script');
      // intent=capture; enable card + venmo + paylater funding
      s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(clientId) +
        '&currency=USD&intent=capture&components=buttons';
      s.onload = function () { sdkLoaded = true; resolve(); };
      s.onerror = function () { reject(new Error('PayPal SDK failed to load')); };
      document.head.appendChild(s);
    });
  }

  function renderButtons() {
    if (buttonsRendered || !window.paypal) return;
    buttonsRendered = true;
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 46 },
      onClick: function (data, actions) {
        if (baseAmount() <= 0) {
          setStatus('Enter an amount first.', 'err');
          return actions.reject();
        }
        setStatus('');
        return actions.resolve();
      },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: { value: finalAmount().toFixed(2) },
            description: 'TuKan Designs — ' + (nameInput.value.trim() || 'Table payment')
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          var payer = (details.payer && details.payer.name && details.payer.name.given_name) || 'friend';
          setStatus('Thank you, ' + payer + '! Your payment went through. We\'ll be in touch shortly.', 'ok');
          logPayment(details, data);
          amountInput.value = '';
          updateDiscountLine();
        });
      },
      onError: function () {
        setStatus('Payment could not be completed. Please try again or contact us.', 'err');
      }
    }).render('#paypal-buttons');
  }

  async function init() {
    var cfg = await loadConfig();
    var clientId = cfg && cfg.paypalClientId;
    if (!clientId) {
      // No PayPal configured yet — show a note; manual fallback methods already visible.
      buttonsEl.innerHTML =
        '<div style="text-align:center;padding:1rem;border:1px dashed var(--border);border-radius:10px;color:var(--text-muted);font-size:0.84rem;">' +
        'Online card payment is being set up. For now, please call or email to pay — or start a custom order and we\'ll send an invoice.' +
        '</div>';
      updateDiscountLine();
      return;
    }
    try {
      await loadSdk(clientId, cfg.paypalMode || 'live');
      renderButtons();
      updateDiscountLine();
    } catch (err) {
      buttonsEl.innerHTML =
        '<div style="text-align:center;padding:1rem;color:var(--text-muted);font-size:0.84rem;">' +
        'Card checkout is temporarily unavailable. Please call or email us to pay.' +
        '</div>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
