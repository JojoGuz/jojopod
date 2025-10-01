/* player.js — optimized, no MutationObserver
   Usage:
   - Ensure: <audio id="episode3-audio" preload="metadata">...
   - Ensure: <ul class="timestamps" data-audio="episode3-audio"> ... <button data-seconds="1:23"> ...
   - Include with: <script src="player.js" defer></script>
*/
(function(){
  'use strict';

  function parseTime(input){
    if (input == null) return 0;
    input = String(input).trim();
    if (input === '') return 0;
    if (!input.includes(':')) {
      var n = Number(input);
      return isNaN(n) ? 0 : Math.max(0, Math.floor(n));
    }
    var parts = input.split(':').map(function(s){ return Number(s); }).reverse();
    var seconds = 0;
    for (var i=0;i<parts.length;i++){
      var v = parts[i];
      if (isNaN(v)) v = 0;
      seconds += v * Math.pow(60, i);
    }
    return Math.max(0, Math.floor(seconds));
  }

  function pauseOthers(currentAudio, audios){
    if (!audios || !audios.length) return;
    audios.forEach(function(a){
      if (a !== currentAudio && !a.paused) {
        try { a.pause(); } catch(e){}
      }
    });
  }

  function setActiveButton(btn){
    try {
      document.querySelectorAll('.timestamps button.active').forEach(function(b){
        if (b !== btn) b.classList.remove('active');
      });
      if (btn) btn.classList.add('active');
    } catch(e){}
  }

  function init(root){
    root = root || document;
    // cache audios once
    var audios = Array.prototype.slice.call(root.querySelectorAll('audio'));

    var lists = Array.prototype.slice.call(root.querySelectorAll('.timestamps'));
    lists.forEach(function(list){
      // delegation on each list
      if (list._jojo_bound) return;
      list._jojo_bound = true;

      list.addEventListener('click', function(ev){
        var btn = ev.target.closest('button');
        if (!btn || !list.contains(btn)) return;
        try { btn.type = btn.type || 'button'; } catch(e){}

        var audioId = list.getAttribute('data-audio');
        if (!audioId) return;
        var audio = document.getElementById(audioId);
        if (!audio) return;

        var raw = btn.getAttribute('data-seconds') || btn.dataset.seconds || btn.textContent || '';
        var seconds = parseTime(raw);

        // pause other cached audios (fast)
        pauseOthers(audio, audios);

        function setAndPlay(){
          try {
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
              audio.currentTime = Math.min(seconds, audio.duration);
            } else {
              audio.currentTime = seconds;
            }
          } catch (err) {
            /* ignored; will retry after metadata if needed */
          }
          try {
            var p = audio.play();
            if (p && typeof p.catch === 'function') p.catch(function(){});
          } catch(e){}
          setActiveButton(btn);
        }

        if (isNaN(audio.duration) || audio.readyState < 1) {
          var once = function(){ audio.removeEventListener('loadedmetadata', once); setAndPlay(); };
          audio.addEventListener('loadedmetadata', once);
          // try to nudge load if not yet
          try { audio.load(); } catch(e){}
        } else {
          setAndPlay();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ init(document); });
  } else {
    init(document);
  }

  // expose for manual init (if you dynamically inject new lists)
  window.JojoTimestampPlayer = {
    init: init,
    parseTime: parseTime
  };
})();
