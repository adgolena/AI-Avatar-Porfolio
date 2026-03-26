// ── AUDIO PLAYER ENGINE ──
const audioIds = {
  'player-en-real':  'audio-en-real',
  'player-en-clone': 'audio-en-clone',
  'player-de-real':  'audio-de-real',
  'player-de-clone': 'audio-de-clone',
};

function fmtTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
/*
function stopAll(except) {
  Object.keys(audioIds).forEach(pid => {
    if (pid === except) return;
    const el = document.getElementById(audioIds[pid]);
    if (el && !el.paused) {
      el.pause();
      el.currentTime = 0;
      updatePlayerUI(pid, false);

      const id = pid.replace('player-', '');
      const fill = document.getElementById('progress-' + id);
      const time = document.getElementById('time-' + id);

      if (fill) fill.style.width = '0%';
      if (time) time.textContent = `0:00 / 0:00`;
    }
  });
}*/

function stopAll(except) {
  Object.keys(audioIds).forEach(pid => {
    if (pid === except) return;

    const el = document.getElementById(audioIds[pid]);
    if (el && !el.paused) {
      el.pause();
      el.currentTime = 0; // ✅ ONLY for other tracks

      updatePlayerUI(pid, false);

      const id = pid.replace('player-', '');
      const fill = document.getElementById('progress-' + id);
      const time = document.getElementById('time-' + id);

      if (fill) fill.style.width = '0%';
      if (time) time.textContent = `0:00 / 0:00`;
    }
  });
}

function updatePlayerUI(playerId, playing) {
  const card = document.getElementById(playerId);
  if (!card) return;
  const btn = card.querySelector('.play-btn svg');

  if (playing) {
    card.classList.add('playing');
    btn.innerHTML = '<path d="M6 19h4V5H6zm8-14v14h4V5z"/>'; // pause icon
  } else {
    card.classList.remove('playing');
    btn.innerHTML = '<path d="M8 5v14l11-7z"/>'; // play icon
  }
}
/*
function togglePlay(playerId, src) {
  const audioId = audioIds[playerId];
  const audio = document.getElementById(audioId);

  // set source only if different
  if (!audio.src || !audio.src.includes(src.split('/').pop())) {
    audio.src = src;
  }

  if (!audio.paused) {
    audio.pause();
    updatePlayerUI(playerId, false);
    return;
  }

  stopAll(playerId);

  audio.play().catch(() => {});
  updatePlayerUI(playerId, true);

  audio.ontimeupdate = () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    const id = playerId.replace('player-', '');

    const fill = document.getElementById('progress-' + id);
    const time = document.getElementById('time-' + id);

    if (fill) fill.style.width = pct + '%';
    if (time) time.textContent = `${fmtTime(audio.currentTime)} / ${fmtTime(audio.duration)}`;
  };

  audio.onended = () => {
    updatePlayerUI(playerId, false);

    const id = playerId.replace('player-', '');
    const fill = document.getElementById('progress-' + id);
    const time = document.getElementById('time-' + id);

    if (fill) fill.style.width = '0%';
    if (time) time.textContent = `0:00 / ${fmtTime(audio.duration)}`;
  };
}*/

function togglePlay(playerId, src) {
  const audioId = audioIds[playerId];
  const audio = document.getElementById(audioId);

  // ✅ ONLY set src if it's a different file
  const fileName = src.split('/').pop();
  if (!audio.src || !audio.src.includes(fileName)) {
    audio.src = src;
    audio.load(); // ensure proper load
  }

  // ✅ TRUE PAUSE (no reset)
  if (!audio.paused) {
    audio.pause();
    updatePlayerUI(playerId, false);
    return;
  }

  // stop other players ONLY
  stopAll(playerId);

  audio.play().catch(() => {});
  updatePlayerUI(playerId, true);

  audio.ontimeupdate = () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    const id = playerId.replace('player-', '');

    const fill = document.getElementById('progress-' + id);
    const time = document.getElementById('time-' + id);

    if (fill) fill.style.width = pct + '%';
    if (time) time.textContent = `${fmtTime(audio.currentTime)} / ${fmtTime(audio.duration)}`;
  };

  audio.onended = () => {
    updatePlayerUI(playerId, false);

    const id = playerId.replace('player-', '');
    const fill = document.getElementById('progress-' + id);
    const time = document.getElementById('time-' + id);

    if (fill) fill.style.width = '0%';
    if (time) time.textContent = `0:00 / ${fmtTime(audio.duration)}`;
  };
}

function seekAudio(playerId, e) {
  const audioId = audioIds[playerId];
  const audio = document.getElementById(audioId);
  if (!audio.duration) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}

// ── VIDEO PLAYER ──
function playVideo() {
  const video = document.getElementById('avatar-video');
  const overlay = document.getElementById('video-overlay');
  video.play();
  overlay.classList.add('hidden');
  video.onended = () => overlay.classList.remove('hidden');
}

const video = document.getElementById('avatar-video');
const overlay = document.getElementById('video-overlay');

// Hide controls initially
video.removeAttribute('controls');

// Show controls on hover
video.parentElement.addEventListener('mouseenter', () => {
  video.setAttribute('controls', true);
});

// Hide controls when mouse leaves (only if paused)
video.parentElement.addEventListener('mouseleave', () => {
  if (video.paused) {
    video.removeAttribute('controls');
  }
});

// ── SCROLL FADE IN ──
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));
