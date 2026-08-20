document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const wax = document.getElementById('waxButton');
  const envelope = document.getElementById('weddingCard');
  const cover = document.getElementById('cover');
  const music = document.getElementById('bgMusic');
  const musicButton = document.getElementById('musicButton');
  const musicState = document.getElementById('musicState');
  const glitter = document.getElementById('glitterContainer');
  let started = false;
  let raf = 0;
  let userPaused = false;
  let resumeTimer = 0;
  let scrollStart = 0;
  let scrollFrom = 0;
  let songDuration = 0;

  setTimeout(() => { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 500); }, 450);

  function burst(){
    glitter.innerHTML='';
    for(let i=0;i<90;i++){
      const p=document.createElement('span'); p.className='glitter';
      p.style.setProperty('--x', `${(Math.random()-.5)*360}px`);
      p.style.setProperty('--y', `${(Math.random()-.35)*520}px`);
      p.style.setProperty('--d', `${Math.random()*.5}s`);
      glitter.appendChild(p);
    }
    setTimeout(()=>glitter.innerHTML='',2600);
  }

  function duration(){
    return Number.isFinite(music.duration) && music.duration>5 ? music.duration : 212;
  }

  function beginScroll(){
    cancelAnimationFrame(raf);
    userPaused = false;
    raf = requestAnimationFrame(tick);
  }

  function tick(){
    if(userPaused || music.paused || music.ended) return;
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const d = duration();
    const progress = Math.min(1, Math.max(0, (music.currentTime || 0) / d));
    window.scrollTo(0, maxY * progress);
    if(progress >= 1){
      cancelAnimationFrame(raf);
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function pauseAuto(){
    if(!started) return;
    userPaused=true;
    cancelAnimationFrame(raf);
  }

  async function openInvitation(){
    if(started) return;
    started=true;
    wax.classList.add('opened');
    envelope.classList.add('opened');
    cover.classList.add('opened');
    burst();
    try { music.loop=false; await music.play(); musicState.textContent='Ranjha.mp3 · playing'; } catch(e) { musicState.textContent='Tap ♫ to play'; }
    if(!Number.isFinite(music.duration) || music.duration<=5){
      await new Promise(resolve=>{
        const done=()=>{music.removeEventListener('loadedmetadata',done);resolve();};
        music.addEventListener('loadedmetadata',done,{once:true});
        setTimeout(resolve,1200);
      });
    }
    setTimeout(()=>{
      document.getElementById('haldi').scrollIntoView({block:'start'});
      beginScroll();
    },650);
  }

  wax.addEventListener('click',openInvitation);
  wax.addEventListener('touchend',e=>{e.preventDefault();openInvitation();},{passive:false});

  musicButton.addEventListener('click', async()=>{
    if(music.paused){
      try{await music.play(); musicState.textContent='Ranjha.mp3 · playing'; if(started) beginScroll();}catch(e){}
    } else {
      music.pause(); musicState.textContent='Ranjha.mp3 · paused'; pauseAuto();
    }
  });

  music.addEventListener('timeupdate',()=>{ if(started && !userPaused && !music.paused && !music.ended) { if(!raf) raf=requestAnimationFrame(tick); }});
  music.addEventListener('ended',()=>{
    cancelAnimationFrame(raf);
    userPaused=true;
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, maxY);
    musicState.textContent='Ranjha.mp3 · finished';
  });
  music.addEventListener('play',()=>{musicState.textContent='Ranjha.mp3 · playing';});
  music.addEventListener('pause',()=>{if(!music.ended) musicState.textContent='Ranjha.mp3 · paused';});

});
