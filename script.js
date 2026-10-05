document.addEventListener('DOMContentLoaded', () => {

  /* ── Elements ────────────────────────────────────────────────────────── */
  const loader     = document.getElementById('loader');
  const cover      = document.getElementById('cover');
  const envBody    = cover.querySelector('.env-body');
  const waxBtn     = document.getElementById('waxBtn');
  const glitterBox = document.getElementById('glitterBox');
  const introSc    = document.getElementById('introScreen');
  const introBtn   = document.getElementById('introBtn');
  const closing    = document.getElementById('closing');
  const closingRev = document.getElementById('closingReveal');
  const mehendi    = document.getElementById('mehendi');
  const music      = document.getElementById('bgMusic');
  const musicBtn   = document.getElementById('musicBtn');
  const musicLbl   = document.getElementById('musicLbl');

  let opened = false, started = false;
  let raf = 0, userPaused = false, songDur = 0;
  const HOLD = 5;

  /* ── Loader ─────────────────────────────────────────────────────────── */
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 600);
  }, 500);

  /* ── Intersection observer: closing collage reveal ───────────────────── */
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) closingRev.classList.add('revealed');
  }, { threshold: 0.25 }).observe(closingRev);

  /* ── Haptic ─────────────────────────────────────────────────────────── */
  function tap() { try { if (navigator.vibrate) navigator.vibrate(12); } catch(e) {} }

  /* ── Glitter burst ──────────────────────────────────────────────────── */
  function burst() {
    glitterBox.innerHTML = '';
    const cols = ['#f6dc94','#f0d797','#ffffff','#ffc2d4','#ffd700','#fff4bc','#ffb347'];
    const stars = ['✦','✧','★','·','✿'];
    for (let i = 0; i < 140; i++) {
      const el = document.createElement('span');
      const isStar = Math.random() < 0.3;
      const col = cols[Math.floor(Math.random() * cols.length)];
      const angle = Math.random() * 2 * Math.PI;
      const dist = 90 + Math.random() * 270;
      el.className = isStar ? 'glitter s' : 'glitter';
      el.style.setProperty('--gx', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--gy', `${Math.sin(angle) * dist - Math.random() * 100}px`);
      el.style.setProperty('--gd', `${Math.random() * 0.4}s`);
      el.style.setProperty('--gc', col);
      if (isStar) el.textContent = stars[Math.floor(Math.random() * stars.length)];
      glitterBox.appendChild(el);
    }
    setTimeout(() => { glitterBox.innerHTML = ''; }, 2400);
  }

  /* ── Scroll helpers ─────────────────────────────────────────────────── */
  function getDur() {
    if (Number.isFinite(songDur) && songDur > 5) return songDur;
    if (Number.isFinite(music.duration) && music.duration > 5) { songDur = music.duration; return songDur; }
    return 200;
  }
  function scrollRange() {
    const start = Math.max(0, mehendi.offsetTop);
    const end = Math.max(start, closing.offsetTop + closing.offsetHeight - window.innerHeight);
    return { start, end };
  }
  function posForTime(t) {
    const d = getDur();
    const { start, end } = scrollRange();
    const hold = Math.min(HOLD, Math.max(4, d * 0.08));
    const travel = Math.max(0, d - hold);
    const p = travel > 0 ? Math.min(1, Math.max(0, t / travel)) : 1;
    return start + (end - start) * p;
  }
  function tick() {
    if (userPaused || music.paused || music.ended) return;
    const t = music.currentTime || 0, d = getDur();
    if (t >= d - HOLD) closingRev.classList.add('revealed');
    window.scrollTo(0, posForTime(t));
    if (t >= d - 0.03) { cancelAnimationFrame(raf); raf = 0; return; }
    raf = requestAnimationFrame(tick);
  }
  function beginScroll() { cancelAnimationFrame(raf); userPaused = false; raf = requestAnimationFrame(tick); }
  async function waitMeta() {
    if (Number.isFinite(music.duration) && music.duration > 5) { songDur = music.duration; return; }
    await new Promise(res => {
      music.addEventListener('loadedmetadata', () => { songDur = music.duration; res(); }, { once: true });
      setTimeout(() => { songDur = Number.isFinite(music.duration) ? music.duration : 200; res(); }, 2000);
    });
  }

  /* ── WAX SEAL TAP → open envelope + play music ──────────────────────── */
  async function openEnvelope() {
    if (opened) return;
    opened = true;
    tap();
    burst();
    envBody.classList.add('open');
    cover.querySelector('.cover-hint').style.opacity = '0';

    /* Music starts here — inside user gesture, iOS/Android allow it */
    music.loop = false;
    try { await music.play(); musicLbl.textContent = 'Now playing ♪'; }
    catch(e) { musicLbl.textContent = 'Tap ♫ to play'; }

    await waitMeta();
    started = true;

    /* Scroll to intro after envelope animation */
    setTimeout(() => {
      window.scrollTo({ top: introSc.offsetTop, behavior: 'smooth' });
    }, 900);

    /* Auto-scroll begins after ~5s on intro */
    setTimeout(() => {
      if (!userPaused && !music.paused) beginScroll();
    }, 6000);
  }

  waxBtn.addEventListener('click', openEnvelope);
  waxBtn.addEventListener('touchend', e => { e.preventDefault(); openEnvelope(); }, { passive: false });

  /* ── INTRO BUTTON → jump to Mehendi ────────────────────────────────── */
  function goToStory() {
    if (!opened) return;
    tap();
    setTimeout(() => {
      window.scrollTo(0, mehendi.offsetTop);
      beginScroll();
    }, 300);
  }
  introBtn.addEventListener('click', goToStory);
  introBtn.addEventListener('touchend', e => { e.preventDefault(); goToStory(); }, { passive: false });

  /* ── MUSIC TOGGLE ───────────────────────────────────────────────────── */
  musicBtn.addEventListener('click', async () => {
    tap();
    if (music.paused) {
      try { await music.play(); musicLbl.textContent = 'Now playing ♪'; if (started) beginScroll(); } catch(e) {}
    } else {
      music.pause(); musicLbl.textContent = 'Music paused'; userPaused = true;
      cancelAnimationFrame(raf); raf = 0;
    }
  });

  /* ── Audio events ───────────────────────────────────────────────────── */
  music.addEventListener('loadedmetadata', () => { if (Number.isFinite(music.duration)) songDur = music.duration; });
  music.addEventListener('timeupdate', () => { if (started && !userPaused && !music.paused && !music.ended && !raf) raf = requestAnimationFrame(tick); });
  music.addEventListener('ended', () => {
    cancelAnimationFrame(raf); raf = 0; userPaused = true;
    closingRev.classList.add('revealed');
    const { end } = scrollRange(); window.scrollTo(0, end);
    musicLbl.textContent = 'Thank you ♥';
  });
  music.addEventListener('play', () => musicLbl.textContent = 'Now playing ♪');
  music.addEventListener('pause', () => { if (!music.ended) musicLbl.textContent = 'Music paused'; });
  window.addEventListener('resize', () => {
    if (started && !userPaused && !music.paused && !music.ended) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
  });
});
