/* ============================================================
   Tucan Designs — Custom order form
   - Photo upload with previews (up to 6), drag & drop
   - Prefill from a product "Order This" click
   - Submits to the backend handler (Google Apps Script or similar).
     Reads the endpoint from assets/data/site-config.json { orderHandlerUrl }.
     Photos are sent as base64 data URLs so the backend can save them to
     Drive (same pattern as the Seed the Word order system).
   ============================================================ */
(function () {
  'use strict';

  var MAX_PHOTOS = 6;
  var MAX_BYTES = 6 * 1024 * 1024; // 6MB per image guard

  var form = document.getElementById('custom-order-form');
  if (!form) return;

  var fileInput = document.getElementById('co-photos');
  var dropzone = document.getElementById('co-dropzone');
  var previews = document.getElementById('co-previews');
  var statusEl = document.getElementById('co-status');
  var submitBtn = document.getElementById('co-submit');

  var photos = []; // { name, dataUrl }

  function setStatus(msg, kind) {
    statusEl.textContent = msg || '';
    statusEl.className = 'custom-form__status' + (kind ? ' custom-form__status--' + kind : '');
  }

  function renderPreviews() {
    previews.innerHTML = photos.map(function (p, i) {
      return '<div class="custom-upload__thumb">' +
        '<img src="' + p.dataUrl + '" alt="' + p.name + '">' +
        '<button type="button" data-i="' + i + '" aria-label="Remove">&times;</button>' +
        '</div>';
    }).join('');
    previews.querySelectorAll('button[data-i]').forEach(function (b) {
      b.addEventListener('click', function () {
        photos.splice(parseInt(this.getAttribute('data-i'), 10), 1);
        renderPreviews();
      });
    });
  }

  function addFiles(fileList) {
    var files = Array.prototype.slice.call(fileList);
    files.forEach(function (file) {
      if (photos.length >= MAX_PHOTOS) { setStatus('Up to ' + MAX_PHOTOS + ' photos.', 'err'); return; }
      if (!/^image\//.test(file.type)) return;
      if (file.size > MAX_BYTES) { setStatus(file.name + ' is too large (max 6MB).', 'err'); return; }
      var reader = new FileReader();
      reader.onload = function (e) {
        photos.push({ name: file.name, dataUrl: e.target.result });
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  fileInput.addEventListener('change', function () { addFiles(this.files); this.value = ''; });

  // Drag & drop
  ['dragenter', 'dragover'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add('is-drag'); });
  });
  ['dragleave', 'drop'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.remove('is-drag'); });
  });
  dropzone.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });

  // Prefill hook — called by products.js when "Order This" is clicked
  window.TucanCustomOrder = {
    prefill: function (product) {
      if (!product) return;
      var notes = document.getElementById('co-notes');
      var typeSel = document.getElementById('co-type');
      var dims = document.getElementById('co-dims');
      if (notes) notes.value = 'Interested in a piece like your "' + product.name + '". ' + (notes.value || '');
      if (dims && product.dims) dims.value = product.dims;
      // Best-effort match of table type from the product name
      if (typeSel) {
        var name = (product.name || '').toLowerCase();
        var map = [['dining','Dining Table'],['coffee','Coffee Table'],['console','Console / Entry'],
                   ['conference','Conference Table'],['side','Side / End Table'],['desk','Desk']];
        for (var i = 0; i < map.length; i++) {
          if (name.indexOf(map[i][0]) !== -1) { typeSel.value = map[i][1]; break; }
        }
      }
    }
  };

  async function getHandlerUrl() {
    try {
      var cfg = await fetch('assets/data/site-config.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); });
      return cfg.orderHandlerUrl || '';
    } catch (_) { return ''; }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var name = document.getElementById('co-name').value.trim();
    var email = document.getElementById('co-email').value.trim();
    var type = document.getElementById('co-type').value;
    if (!name || !email || !type) {
      setStatus('Please fill in your name, email, and table type.', 'err');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setStatus('');

    var payload = {
      action: 'customOrder',
      name: name,
      email: email,
      phone: document.getElementById('co-phone').value.trim(),
      tableType: type,
      wood: document.getElementById('co-wood').value,
      finish: document.getElementById('co-finish').value,
      dimensions: document.getElementById('co-dims').value.trim(),
      budget: document.getElementById('co-budget').value,
      notes: document.getElementById('co-notes').value.trim(),
      photos: photos.map(function (p) { return { name: p.name, data: p.dataUrl }; }),
      submittedAt: new Date().toISOString()
    };

    var url = await getHandlerUrl();
    if (!url) {
      // No backend wired yet — fall back to an email draft so nothing is lost.
      var body = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + payload.phone +
        '\nType: ' + type + '\nWood: ' + payload.wood + '\nFinish: ' + payload.finish +
        '\nDimensions: ' + payload.dimensions + '\nBudget: ' + payload.budget +
        '\n\n' + payload.notes + '\n\n(' + photos.length + ' photo(s) — please attach manually)'
      );
      window.location.href = 'mailto:hello@tucandesigns.com?subject=' +
        encodeURIComponent('Custom Table Request — ' + name) + '&body=' + body;
      setStatus('Opening your email app… if nothing happens, email us at hello@tucandesigns.com', 'ok');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send My Custom Request →';
      return;
    }

    try {
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); });

      if (res && res.ok) {
        setStatus('Thank you! Your request is in — we\'ll reach out within one business day.', 'ok');
        form.reset();
        photos = [];
        renderPreviews();
      } else {
        throw new Error((res && res.error) || 'Submit failed');
      }
    } catch (err) {
      setStatus('Something went wrong. Please call or email us and we\'ll help right away.', 'err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send My Custom Request →';
    }
  });
})();
