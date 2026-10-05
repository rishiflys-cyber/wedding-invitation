document.addEventListener('DOMContentLoaded', () => {
  /* ── Elements ─────────────────────────────────────────────────────────── */
  const loader        = document.getElementById('loader');
  const ganeshScreen  = document.getElementById('ganesh');
  const ganeshNext    = document.getElementById('ganeshNext');
  const cover         = document.getElementById('cover');
  const wax           = document.getElementById('waxButton');
  const envelope      = document.getElementById('weddingCard');
  const glitter       = document.getElementById('glitterContainer');
  const intro         = document.getElementById('intro');
  const introContinue = document.getElementById('introContinue');
  const story         = document.getElementById('story');
  const closing       = document.getElementById('closing');
  const collageReveal = document.getElementById('collageReveal');
  const music         = document.getElementById('bgMusic');
  const musicButton   = document.getElementById('musicButton');
  const musicState    = document.getElementById('musicState');

  /* Screens that use intersection-observer to animate in */
  const familyScreen  = document.getElementById('familyScreen');
  const savedate      = document.getElementById('savedate');
  const venueScreen   = document.getElementById('venueScreen');
  const mehendi       = document.getElementById('mehendi');

  let envelopeOpened = false, started = false;
  let raf = 0, userPaused = false, songDuration = 0;
  const FINAL_HOLD = 5.0;

  /* ── Init ────────────────────────────────────────────────────────────── */
  buildAmbientEffects();
  setupIntersectionObservers();
  setTimeout(() => { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 500); }, 500);

  /* ── Haptic ──────────────────────────────────────────────────────────── */
  function tapFeedback() { try { if (navigator.vibrate) navigator.vibrate(12); } catch(e) {} }

  /* ── Intersection observers — animate cream screens when scrolled into view */
  function setupIntersectionObservers() {
    const opts = { threshold: 0.35 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // stagger fam-lines
          e.target.querySelectorAll('.fam-line, .sd-line, .venue-line').forEach((el, i) => {
            el.style.transitionDelay = `${0.1 + i * 0.15}s`;
          });
        }
      });
    }, opts);
    [familyScreen, savedate, venueScreen].forEach(el => { if (el) io.observe(el); });

    // collage reveal
    const cr = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) collageReveal.classList.add('revealed'); });
    }, { threshold: 0.3 });
    if (collageReveal) cr.observe(collageReveal);
  }

  /* ── Ambient particles ──────────────────────────────────────────────── */
  function buildAmbientEffects() {
    document.querySelectorAll('.ambient').forEach(box => {
      if (box.dataset.ready === '1') return;
      box.dataset.ready = '1';
      const glow = document.createElement('span'); glow.className = 'frameGlow'; box.appendChild(glow);
      for (let i = 0; i < 14; i++) {
        const el = document.createElement('span'); el.className = 'spark';
        el.style.left = `${5 + Math.random() * 90}%`;
        el.style.top = `${25 + Math.random() * 70}%`;
        el.style.setProperty('--dur', `${3.8 + Math.random() * 3.2}s`);
        el.style.setProperty('--delay', `${-Math.random() * 6}s`);
        el.style.setProperty('--drift', `${(Math.random() - .5) * 55}px`);
        box.appendChild(el);
      }
      for (let i = 0; i < 3; i++) {
        const el = document.createElement('span'); el.className = 'orb';
        el.style.left = `${5 + Math.random() * 80}%`;
        el.style.top = `${18 + Math.random() * 65}%`;
        el.style.setProperty('--dur', `${7 + Math.random() * 4}s`);
        el.style.setProperty('--delay', `${-Math.random() * 8}s`);
        box.appendChild(el);
      }
      for (let i = 0; i < 4; i++) {
        const el = document.createElement('span'); el.className = 'petal';
        el.style.left = `${5 + Math.random() * 88}%`;
        el.style.top = `${-10 - Math.random() * 25}%`;
        el.style.setProperty('--dur', `${6 + Math.random() * 4}s`);
        el.style.setProperty('--delay', `${-Math.random() * 8}s`);
        el.style.setProperty('--drift', `${(Math.random() - .5) * 65}px`);
        box.appendChild(el);
      }
    });
  }

  /* ── Glitter burst ─────────────────────────────────────────────────── */
  function burst() {
    glitter.innerHTML = '';
    const colours = ['#f6dc94','#f0d797','#ffffff','#ffc2d4','#ffd700','#fff4bc','#ffb347'];
    const stars   = ['✦','✧','★','·'];
    for (let i = 0; i < 130; i++) {
      const p = document.createElement('span');
      const isStar  = Math.random() < 0.28;
      const colour  = colours[Math.floor(Math.random() * colours.length)];
      const angle   = Math.random() * 2 * Math.PI;
      const dist    = 80 + Math.random() * 260;
      const vx = Math.cos(angle) * dist;
      const vy = Math.sin(angle) * dist - Math.random() * 90;
      p.className = isStar ? 'glitter star' : 'glitter';
      p.style.setProperty('--x', `${vx}px`);
      p.style.setProperty('--y', `${vy}px`);
      p.style.setProperty('--d', `${Math.random() * 0.35}s`);
      p.style.setProperty('--gc', colour);
      if (isStar) p.textContent = stars[Math.floor(Math.random() * stars.length)];
      glitter.appendChild(p);
    }
    setTimeout(() => { glitter.innerHTML = ''; }, 2200);
  }

  /* ── Scroll sync helpers ─────────────────────────────────────────────── */
  function getDuration() {
    if (Number.isFinite(songDuration) && songDuration > 5) return songDuration;
    if (Number.isFinite(music.duration) && music.duration > 5) { songDuration = music.duration; return songDuration; }
    return 212;
  }
  function scrollRange() {
    const start = Math.max(0, mehendi.offsetTop);
    const end   = Math.max(start, closing.offsetTop + closing.offsetHeight - window.innerHeight);
    return { start, end };
  }
  function positionForTime(t) {
    const d = getDuration();
    const { start, end } = scrollRange();
    const hold   = Math.min(FINAL_HOLD, Math.max(4.5, d * 0.08));
    const travel = Math.max(0, d - hold);
    const p = travel > 0 ? Math.min(1, Math.max(0, t / travel)) : 1;
    return start + (end - start) * p;
  }
  function tick() {
    if (userPaused || music.paused || music.ended) return;
    const t = music.currentTime || 0, d = getDuration();
    if (t >= d - FINAL_HOLD) collageReveal.classList.add('revealed');
    window.scrollTo(0, positionForTime(t));
    if (t >= d - 0.03) { cancelAnimationFrame(raf); raf = 0; return; }
    raf = requestAnimationFrame(tick);
  }
  function beginScroll() { cancelAnimationFrame(raf); userPaused = false; raf = requestAnimationFrame(tick); }
  async function waitForMetadata() {
    if (Number.isFinite(music.duration) && music.duration > 5) { songDuration = music.duration; return; }
    await new Promise(resolve => {
      music.addEventListener('loadedmetadata', () => { songDuration = music.duration; resolve(); }, { once: true });
      setTimeout(() => { if (!songDuration) songDuration = Number.isFinite(music.duration) ? music.duration : 212; resolve(); }, 1800);
    });
  }

  /* ── STEP 0: Ganesh → Envelope ──────────────────────────────────────── */
  function goToEnvelope() {
    tapFeedback();
    ganeshScreen.style.transition = 'opacity .7s ease, transform .7s ease';
    ganeshScreen.style.opacity = '0';
    ganeshScreen.style.transform = 'scale(1.04)';
    setTimeout(() => {
      ganeshScreen.style.display = 'none';
      window.scrollTo(0, cover.offsetTop);
    }, 700);
  }
  ganeshNext.addEventListener('click', goToEnvelope);
  ganeshNext.addEventListener('touchend', e => { e.preventDefault(); goToEnvelope(); }, { passive: false });

  /* ── STEP 1: RA seal → play music + show intro ──────────────────────── */
  async function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    tapFeedback();
    wax.classList.add('opened');
    envelope.classList.add('opened');
    cover.classList.add('opened');
    burst();

    /* Start music NOW — inside user-gesture, iOS/Android will allow it */
    music.loop = false;
    try { await music.play(); musicState.textContent = 'Now playing ♪'; }
    catch(e) { musicState.textContent = 'Tap ♫ to play'; }

    await waitForMetadata();
    started = true;

    setTimeout(() => {
      window.scrollTo({ top: intro.offsetTop, behavior: 'smooth' });
      intro.classList.add('active');
    }, 600);

    /* Auto-scroll kicks in after ~4s so guests can read the intro */
    setTimeout(() => { if (!userPaused && !music.paused) beginScroll(); }, 5500);
  }
  wax.addEventListener('click', openEnvelope);
  wax.addEventListener('touchend', e => { e.preventDefault(); openEnvelope(); }, { passive: false });

  /* ── STEP 2: "Begin" button skips intro ─────────────────────────────── */
  function beginCelebrations() {
    if (!envelopeOpened) return;
    tapFeedback();
    intro.classList.add('leaving');
    setTimeout(() => {
      window.scrollTo(0, familyScreen.offsetTop);
      beginScroll();
    }, 420);
  }
  introContinue.addEventListener('click', beginCelebrations);
  introContinue.addEventListener('touchend', e => { e.preventDefault(); beginCelebrations(); }, { passive: false });

  /* ── Music toggle ────────────────────────────────────────────────────── */
  musicButton.addEventListener('click', async () => {
    tapFeedback();
    if (music.paused) {
      try { await music.play(); musicState.textContent = 'Now playing ♪'; if (started) beginScroll(); } catch(e) {}
    } else {
      music.pause(); musicState.textContent = 'Music paused'; userPaused = true;
      cancelAnimationFrame(raf); raf = 0;
    }
  });

  /* ── Audio events ────────────────────────────────────────────────────── */
  music.addEventListener('loadedmetadata', () => { if (Number.isFinite(music.duration)) songDuration = music.duration; });
  music.addEventListener('timeupdate', () => { if (started && !userPaused && !music.paused && !music.ended && !raf) raf = requestAnimationFrame(tick); });
  music.addEventListener('ended', () => {
    cancelAnimationFrame(raf); raf = 0; userPaused = true;
    collageReveal.classList.add('revealed');
    const { end } = scrollRange(); window.scrollTo(0, end);
    musicState.textContent = 'Thank you for celebrating with us ♥';
  });
  music.addEventListener('play',  () => musicState.textContent = 'Now playing ♪');
  music.addEventListener('pause', () => { if (!music.ended) musicState.textContent = 'Music paused'; });
  window.addEventListener('resize', () => {
    if (started && !userPaused && !music.paused && !music.ended) {
      cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    }
  });
});
