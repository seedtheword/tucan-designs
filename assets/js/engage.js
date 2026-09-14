/* ============================================================
   Tucan Designs — Newsletter + Consultation booking
   - Newsletter: POSTs { action:'newsletter', email } to the site's
     order handler (cfg.orderHandlerUrl). Falls back to a mailto if
     no backend is configured.
   - Consultation: if a Google Calendar Appointment Scheduling URL is
     set (cfg.consultUrl OR data-appt on #consult-embed), swap the
     placeholder for the live booking iframe.
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

  // ── Consultation embed ───────────────────────────────────────
  async function initConsult() {
    var host = document.getElementById('consult-embed');
    if (!host) return;
    var cfg = await loadConfig();
    var url = (host.getAttribute('data-appt') || '').trim() || (cfg && cfg.consultUrl) || '';
    if (!url) return; // keep placeholder (call/email)
    host.innerHTML = '<iframe src="' + url + '" title="Book a consultation with Tucan Designs" ' +
      'loading="lazy" style="width:100%;height:620px;border:0;"></iframe>';
  }

  // ── Newsletter ───────────────────────────────────────────────
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

      btn.disabled = true; btn.textContent = '…';
      setStatus('');

      var cfg = await loadConfig();
      var url = cfg && cfg.orderHandlerUrl;
      if (!url) {
        // No backend — open an email to subscribe manually.
        window.location.href = 'mailto:hello@tucandesigns.com?subject=' +
          encodeURIComponent('Newsletter signup') + '&body=' +
          encodeURIComponent('Please add me to the Tucan Designs list: ' + email);
        setStatus('Opening your email app to confirm…', 'ok');
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
