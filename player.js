/* player.js
   Minimal timestamp -> audio controller for multiple episodes
   - Requires: <ul class="timestamps" data-audio="AUDIO_ID"> ... <button data-seconds="MM:SS" />
   - Include with: <script src="player.js" defer></script>
*/
(function () {
  'use strict';

  /* Parse "123" or "1:23" or "01:02:03" into seconds (number) */
  function parseTime(input) {
    if (input == null) return 0;
    input = String(input).trim();
    if (input === '') return 0;
    if (!input.includes(':')) {
      var n = Number(input);
      return isNaN(n) ? 0 : Math.max(0, Math.floor(n));
    }
    var parts = input.split(':').map(function (s) { return Number(s); }).reverse();
    var seconds = 0;
    for (var i = 0; i < parts.length; i++) {
      var v = parts[i];
      if (isNaN(v)) v = 0;
      seconds += v * Math.pow(60, i);
    }
    return Math.max(0, Math.floor(seconds));
  }

  /* Pause all other <audio> elements except the one passed in */
  function pauseOtherAudios(currentAudio) {
    document.querySelectorAll('audio').forEach(function (a) {
      if (a !== currentAudio && !a.paused) {
        try { a.pause(); } catch (e) { /* ignore */ }
      }
    });
  }

  /* Mark active button (optional visual state) */
  function setActiveButton(btn) {
    try {
      document.querySelectorAll('.timestamps button.active').forEach(function (b) {
        if (b !== btn) b.classList.remove('active');
      });
      if (btn) btn.classList.add('active');
    } catch (e) { /* ignore */ }
  }

  /* Initialize binding for all .timestamps lists under `root` (defaults to document) */
  function initTimestamps(root) {
    root = root || document;
    var lists = root.querySelectorAll('.timestamps');
    lists.forEach(function (list) {
      // Use event delegation on the list
      list.addEventListener('click', function (ev) {
        var btn = ev.target.closest('button');
        if (!btn || !list.contains(btn)) return;

        // ensure button doesn't submit forms
        try { btn.type = btn.type || 'button'; } catch (e) {}

        var audioId = list.getAttribute('data-audio');
        if (!audioId) {
          console.warn('timestamps list missing data-audio attribute', list);
          return;
        }
        var audio = document.getElementById(audioId);
        if (!audio) {
          console.warn('no audio element with id:', audioId);
          return;
        }

        // determine seconds: data-seconds preferred, then data attribute, then button text
        var secondsRaw = btn.getAttribute('data-seconds') || btn.dataset.seconds || btn.textContent || '';
        var seconds = parseTime(secondsRaw);

        // pause other audios
        pauseOtherAudios(audio);

        function setAndPlay() {
          try {
            // protect against setting time beyond duration
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
              audio.currentTime = Math.min(seconds, audio.duration);
            } else {
              audio.currentTime = seconds;
            }
          } catch (err) {
            // Some browsers may throw if currentTime is set too early; we'll try anyway after metadata.
            console.warn('set currentTime failed (will retry after loadedmetadata):', err);
          }
          // play and ignore promise rejection to avoid console noise
          var p;
          try { p = audio.play(); } catch (e) { p = null; }
          if (p && typeof p.catch === 'function') p.catch(function () { /* ignore */ });
          setActiveButton(btn);
        }

        // If metadata not loaded, wait for it
        if (isNaN(audio.duration) || audio.readyState < 1) {
          var onMeta = function () {
            audio.removeEventListener('loadedmetadata', onMeta);
            setAndPlay();
          };
          audio.addEventListener('loadedmetadata', onMeta);
          // try to trigger load if not already
          try { audio.load(); } catch (e) { /* ignore */ }
        } else {
          setAndPlay();
        }
      });
    });
  }

  // Auto-init: if script loaded after DOM ready, init immediately; otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initTimestamps(document); });
  } else {
    initTimestamps(document);
  }

  // expose for manual re-init or testing
  window.JojoTimestampPlayer = {
    init: initTimestamps,
    parseTime: parseTime,
    pauseOthers: pauseOtherAudios
  };
})();
