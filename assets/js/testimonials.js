/* ============================================================
   TuKan Designs — Video testimonials
   Edit VIDEO_TESTIMONIALS to add real clips. Each entry:
     name    customer name
     role    short descriptor (e.g. "Dining Table · Seattle")
     type    'youtube' | 'mp4'
     src     YouTube video ID  OR  path to an .mp4 under assets/videos/
     poster  optional thumbnail image path (mp4 only)
   Leave the array empty [] to hide the video row entirely, or use the
   placeholder entries below (type:'placeholder') until real clips exist.
   ============================================================ */

var VIDEO_TESTIMONIALS = [
  { name: 'The Alvarez Family', role: 'Walnut Dining Table', type: 'placeholder', src: '', poster: '' },
  { name: 'Studio North', role: 'Conference Table', type: 'placeholder', src: '', poster: '' },
  { name: 'Dana & Reese', role: 'Live-Edge Coffee Table', type: 'placeholder', src: '', poster: '' }
];

(function () {
  'use strict';

  var mount = document.getElementById('video-testimonials');
  if (!mount) return;

  if (!VIDEO_TESTIMONIALS.length) { mount.style.display = 'none'; return; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var PLAY_ICON =
    '<span class="video-testimonial__play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>';

  function frameInner(t) {
    if (t.type === 'youtube' && t.src) {
      // Show thumbnail + play; swap to iframe on click
      return '<img src="https://img.youtube.com/vi/' + esc(t.src) + '/hqdefault.jpg" alt="' + esc(t.name) + '" loading="lazy">' + PLAY_ICON;
    }
    if (t.type === 'mp4' && t.src) {
      var poster = t.poster ? ' poster="' + esc(t.poster) + '"' : '';
      return '<video preload="metadata"' + poster + '><source src="' + esc(t.src) + '" type="video/mp4"></video>' + PLAY_ICON;
    }
    // Placeholder — no video yet
    return PLAY_ICON;
  }

  mount.innerHTML = VIDEO_TESTIMONIALS.map(function (t, i) {
    return '<div class="video-testimonial" data-i="' + i + '">' +
      '<div class="video-testimonial__frame">' + frameInner(t) + '</div>' +
      '<div class="video-testimonial__meta">' +
        '<div class="video-testimonial__name">' + esc(t.name) + '</div>' +
        '<div class="video-testimonial__role">' + esc(t.role) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Click to play
  mount.querySelectorAll('.video-testimonial').forEach(function (card) {
    var t = VIDEO_TESTIMONIALS[parseInt(card.getAttribute('data-i'), 10)];
    var frame = card.querySelector('.video-testimonial__frame');
    frame.addEventListener('click', function () {
      if (t.type === 'youtube' && t.src) {
        frame.innerHTML = '<iframe src="https://www.youtube.com/embed/' + esc(t.src) +
          '?autoplay=1&rel=0" title="' + esc(t.name) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
      } else if (t.type === 'mp4' && t.src) {
        var v = frame.querySelector('video');
        if (v) { v.controls = true; v.play(); var p = frame.querySelector('.video-testimonial__play'); if (p) p.style.display = 'none'; }
      } else {
        // Placeholder: nudge toward the consultation/contact
        window.location.hash = '#consultation';
      }
    });
  });
})();
