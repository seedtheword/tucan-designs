/* ============================================================
   TuKan Designs â€” Newsletter + Consultation request
   - Consultation: a request form. POSTs { action:'consultation', ... }
     to the order handler (cfg.orderHandlerUrl), which emails Brandon.
     The visitor sees a "we'll get back to you" confirmation. Falls back
     to a mailto draft if no backend is configured.
   - Newsletter: POSTs { action:'newsletter', email } to the same
     handler. Falls back to a mailto if no backend is configured.
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = null;
  async function loadConfig() {
    if (CONFIG) return CONFIG;
    try {
      CONFIG = await fetch('assets/data/site-config.json?t=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.json(); });
    } catch (_) { CONFIG = {}; }
    return CONFIG;
  }

  // â”€â”€ Consultation request form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function initConsult() {
    var form = document.getElementById('consult-form');
    if (!form) return;
    var btn = document.getElementById('cs-submit');
    var statusEl = document.getElementById('cs-status');

    function setStatus(msg, kind) {
      statusEl.textContent = msg || '';
      statusEl.className = 'consult-form__status' + (kind ? ' consult-form__status--' + kind : '');
    }
    function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var name = val('cs-name');
      var email = val('cs-email');
      if (!name || !email || email.indexOf('@') === -1) {
        setStatus('Please enter your name and a valid email.', 'err');
        return;
      }

      var payload = {
        action: 'consultation',
        name: name,
        email: email,
        phone: val('cs-phone'),
        method: val('cs-method'),
        availability: val('cs-availability'),
        notes: val('cs-notes'),
        submittedAt: new Date().toISOString()
      };

      btn.disabled = true; btn.textContent = 'Sendingâ€¦';
      setStatus('');

      var cfg = await loadConfig();
      var url = cfg && cfg.orderHandlerUrl;
      if (!url) {
        // No backend â€” open an email draft to Brandon so nothing is lost.
        var body = encodeURIComponent(
          'Consultation request from the website:\n\n' +
          'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + payload.phone +
          '\nPreferred contact: ' + payload.method +
          '\nAvailability: ' + payload.availability +
          '\n\n' + (payload.notes || '(no notes)')
        );
        window.location.href = 'mailto:hello@tucandesigns.com?subject=' +
          encodeURIComponent('Consultation Request â€” ' + name) + '&body=' + body;
        setStatus('Opening your email app to send your requestâ€¦', 'ok');
        btn.disabled = false; btn.textContent = 'Request My Consultation â†’';
        return;
      }
      try {
        var res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        }).then(function (r) { return r.json(); });
        if (res && res.ok) {
          setStatus('Thanks, ' + name.split(' ')[0] + '! Your request is in â€” we\'ll get back to you by email to set up a time.', 'ok');
          form.reset();
        } else { throw new Error((res && res.error) || 'failed'); }
      } catch (err) {
        setStatus('Something went wrong. Please try again, or call/email us directly.', 'err');
      } finally {
        btn.disabled = false; btn.textContent = 'Request My Consultation â†’';
      }
    });
  }

  // â”€â”€ Newsletter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function initNewsletter() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;
    var emailInput = document.getElementById('nl-email');
    var btn = document.getElementById('nl-submit');
    var statusEl = document.getElementById('nl-status');

    function setStatus(msg, kind) {
      statusEl.textContent = msg || '';
      statusEl.className = 'newsletter__status' + (kind ? ' newsletter__status--' + kind : '');
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      if (!email || email.indexOf('@') === -1) { setStatus('Please enter a valid email.', 'err'); return; }

      btn.disabled = true; btn.textContent = 'â€¦';
      setStatus('');

      var cfg = await loadConfig();
      var url = cfg && cfg.orderHandlerUrl;
      if (!url) {
        // No backend â€” open an email to subscribe manually.
        window.location.href = 'mailto:hello@tucandesigns.com?subject=' +
          encodeURIComponent('Newsletter signup') + '&body=' +
          encodeURIComponent('Please add me to the TuKan Designs list: ' + email);
        setStatus('Opening your email app to confirmâ€¦', 'ok');
        btn.disabled = false; btn.textContent = 'Subscribe';
        return;
      }
      try {
        var res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'newsletter', email: email, source: 'tucan-website' })
        }).then(function (r) { return r.json(); });
        if (res && res.ok) {
          setStatus('You\'re in! Watch your inbox for new pieces and sales.', 'ok');
          form.reset();
        } else { throw new Error((res && res.error) || 'failed'); }
      } catch (err) {
        setStatus('Something went wrong. Please try again or email us.', 'err');
      } finally {
        btn.disabled = false; btn.textContent = 'Subscribe';
      }
    });
  }

  function init() { initConsult(); initNewsletter(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
