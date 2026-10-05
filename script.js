document.addEventListener('DOMContentLoaded',()=>{
  const loader       = document.getElementById('loader');
  const wax          = document.getElementById('waxButton');
  const envelope     = document.getElementById('weddingCard');
  const cover        = document.getElementById('cover');
  const intro        = document.getElementById('intro');
  const introContinue= document.getElementById('introContinue');
  const families     = document.getElementById('families');
  const music        = document.getElementById('bgMusic');
  const musicButton  = document.getElementById('musicButton');
  const musicState   = document.getElementById('musicState');
  const glitter      = document.getElementById('glitterContainer');
  const firstPage    = document.getElementById('mehendi');
  const closing      = document.getElementById('closing');
  const collageReveal= document.getElementById('collageReveal');

  let started=false, raf=0, userPaused=false, songDuration=0, envelopeOpened=false;
  const FINAL_HOLD = 5.0;

  buildAmbientEffects();
  setTimeout(()=>{ loader.style.opacity='0'; setTimeout(()=>loader.remove(),500); },600);

  function tapFeedback(){ try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){} }

  /* ── Build ambient particle effects on every .ambient box ── */
  function buildAmbientEffects(){
    document.querySelectorAll('.ambient').forEach(box=>{
      if(box.dataset.ready==='1') return;
      box.dataset.ready='1';
      const glow=document.createElement('span'); glow.className='frameGlow'; box.appendChild(glow);
      for(let i=0;i<14;i++){
        const el=document.createElement('span'); el.className='spark';
        el.style.left=`${5+Math.random()*90}%`;
        el.style.top=`${25+Math.random()*70}%`;
        el.style.setProperty('--dur',`${3.8+Math.random()*3.2}s`);
        el.style.setProperty('--delay',`${-Math.random()*6}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*55}px`);
        box.appendChild(el);
      }
      for(let i=0;i<3;i++){
        const el=document.createElement('span'); el.className='orb';
        el.style.left=`${5+Math.random()*80}%`;
        el.style.top=`${18+Math.random()*65}%`;
        el.style.setProperty('--dur',`${7+Math.random()*4}s`);
        el.style.setProperty('--delay',`${-Math.random()*8}s`);
        box.appendChild(el);
      }
      for(let i=0;i<5;i++){
        const el=document.createElement('span'); el.className='petal';
        el.style.left=`${5+Math.random()*88}%`;
        el.style.top=`${-10-Math.random()*25}%`;
        el.style.setProperty('--dur',`${6+Math.random()*4}s`);
        el.style.setProperty('--delay',`${-Math.random()*8}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*65}px`);
        box.appendChild(el);
      }
    });
  }

  /* ── Glitter burst: spawned OUTSIDE the envelope so iOS/Android never clips ── */
  function burst(){
    glitter.innerHTML='';
    const colours=['#f0d170','#faeab0','#ffffff','#ffc2d4','#ffb347','#c9953a','#e8d5a3'];
    const stars=['✦','✧','★','✿','❋'];
    for(let i=0;i<130;i++){
      const p=document.createElement('span');
      const isStar = Math.random()<0.28;
      const colour = colours[Math.floor(Math.random()*colours.length)];
      const angle  = Math.random()*2*Math.PI;
      const dist   = 90+Math.random()*260;
      const vx     = Math.cos(angle)*dist;
      const vy     = Math.sin(angle)*dist - Math.random()*90;
      p.className  = 'glitter';
      p.style.setProperty('--x',`${vx}px`);
      p.style.setProperty('--y',`${vy}px`);
      p.style.setProperty('--d',`${Math.random()*0.32}s`);
      p.style.setProperty('--gc', colour);
      if(isStar){
        p.textContent=stars[Math.floor(Math.random()*stars.length)];
        p.style.background='none';
        p.style.boxShadow='none';
        p.style.fontSize=`${8+Math.random()*8}px`;
        p.style.color=colour;
        p.style.textShadow=`0 0 6px ${colour}`;
      }
      glitter.appendChild(p);
    }
    setTimeout(()=>{ glitter.innerHTML=''; }, 2400);
  }

  /* ── Scroll sync ── */
  function getDuration(){
    if(Number.isFinite(songDuration)&&songDuration>5) return songDuration;
    if(Number.isFinite(music.duration)&&music.duration>5){ songDuration=music.duration; return songDuration; }
    return 212;
  }
  function range(){
    const start = Math.max(0, firstPage.offsetTop);
    const end   = Math.max(start, closing.offsetTop+closing.offsetHeight-window.innerHeight);
    return {start, end};
  }
  function positionForTime(t){
    const d=getDuration(); const {start,end}=range();
    const hold=Math.min(FINAL_HOLD,Math.max(4.5,d*0.08));
    const travel=Math.max(0,d-hold);
    const p=travel>0?Math.min(1,Math.max(0,t/travel)):1;
    return start+(end-start)*p;
  }
  function tick(){
    if(userPaused||music.paused||music.ended) return;
    const t=music.currentTime||0, d=getDuration();
    if(t>=d-FINAL_HOLD) collageReveal.classList.add('revealed');
    window.scrollTo(0, positionForTime(t));
    if(t>=d-0.03){ cancelAnimationFrame(raf); raf=0; return; }
    raf=requestAnimationFrame(tick);
  }
  function beginScroll(){ cancelAnimationFrame(raf); userPaused=false; raf=requestAnimationFrame(tick); }

  async function waitForMetadata(){
    if(Number.isFinite(music.duration)&&music.duration>5){ songDuration=music.duration; return; }
    await new Promise(resolve=>{
      music.addEventListener('loadedmetadata',()=>{ songDuration=music.duration; resolve(); },{once:true});
      setTimeout(()=>{ if(!songDuration) songDuration=Number.isFinite(music.duration)?music.duration:212; resolve(); },1800);
    });
  }

  /* ── Step 1: Tap RA — burst, music, scroll to intro ── */
  async function openEnvelope(){
    if(envelopeOpened) return;
    envelopeOpened=true;
    tapFeedback();
    wax.classList.add('opened');
    envelope.classList.add('opened');
    cover.classList.add('opened');
    burst();

    // Start music immediately — inside user-gesture for iOS/Android autoplay
    music.loop=false;
    try{
      await music.play();
      musicState.textContent='Now playing ♪';
    }catch(e){
      musicState.textContent='Tap ♫ to play';
    }

    await waitForMetadata();
    started=true;

    // Scroll to intro note
    setTimeout(()=>{
      window.scrollTo({top: intro.offsetTop, behavior:'smooth'});
      intro.classList.add('active');
    }, 680);

    // After ~5s on intro, auto-scroll begins (guests can also tap "Begin" sooner)
    setTimeout(()=>{ if(!userPaused && !music.paused) beginScroll(); }, 6200);
  }

  /* ── Step 2: "Begin the Celebrations" — skips intro hold ── */
  function beginCelebrations(){
    if(!envelopeOpened) return;
    tapFeedback();
    intro.classList.add('leaving');
    setTimeout(()=>{
      window.scrollTo(0, firstPage.offsetTop);
      beginScroll();
    }, 420);
  }

  wax.addEventListener('click', openEnvelope);
  wax.addEventListener('touchend', e=>{ e.preventDefault(); openEnvelope(); },{passive:false});
  introContinue.addEventListener('click', beginCelebrations);
  introContinue.addEventListener('touchend', e=>{ e.preventDefault(); beginCelebrations(); },{passive:false});

  /* ── Music toggle ── */
  musicButton.addEventListener('click', async()=>{
    tapFeedback();
    if(music.paused){
      try{ await music.play(); musicState.textContent='Now playing ♪'; if(started) beginScroll(); }catch(e){}
    }else{
      music.pause(); musicState.textContent='Music paused'; userPaused=true; cancelAnimationFrame(raf); raf=0;
    }
  });

  music.addEventListener('loadedmetadata', ()=>{ if(Number.isFinite(music.duration)) songDuration=music.duration; });
  music.addEventListener('timeupdate', ()=>{ if(started&&!userPaused&&!music.paused&&!music.ended&&!raf) raf=requestAnimationFrame(tick); });
  music.addEventListener('ended', ()=>{
    cancelAnimationFrame(raf); raf=0; userPaused=true;
    collageReveal.classList.add('revealed');
    const {end}=range(); window.scrollTo(0,end);
    musicState.textContent='Thank you for celebrating with us ♥';
  });
  music.addEventListener('play',  ()=>musicState.textContent='Now playing ♪');
  music.addEventListener('pause', ()=>{ if(!music.ended) musicState.textContent='Music paused'; });
  window.addEventListener('resize', ()=>{ if(started&&!userPaused&&!music.paused&&!music.ended){ cancelAnimationFrame(raf); raf=requestAnimationFrame(tick); }});
});
