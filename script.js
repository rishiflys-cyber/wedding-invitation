document.addEventListener('DOMContentLoaded',()=>{
  const loader=document.getElementById('loader');
  const wax=document.getElementById('waxButton');
  const envelope=document.getElementById('weddingCard');
  const cover=document.getElementById('cover');
  const music=document.getElementById('bgMusic');
  const musicButton=document.getElementById('musicButton');
  const musicState=document.getElementById('musicState');
  const glitter=document.getElementById('glitterContainer');
  const firstPage=document.getElementById('mehendi');
  const closing=document.getElementById('closing');
  const nazarOverlay=document.getElementById('nazarOverlay');
  const collageReveal=document.getElementById('collageReveal');
  let started=false,raf=0,userPaused=false,songDuration=0,nazarShown=false,revealTimer=0;
  const FINAL_HOLD=5.8; // reserve the last seconds for Nazar -> collage -> final frame
  const NAZAR_DURATION=3.1;

  buildAmbientEffects();
  setTimeout(()=>{loader.style.opacity='0';setTimeout(()=>loader.remove(),500)},450);

  function buildAmbientEffects(){
    document.querySelectorAll('.ambient').forEach(box=>{
      if(box.dataset.ready==='1')return;
      box.dataset.ready='1';
      const glow=document.createElement('span');glow.className='frameGlow';box.appendChild(glow);
      for(let i=0;i<14;i++){
        const el=document.createElement('span');el.className='spark';
        el.style.left=`${5+Math.random()*90}%`;
        el.style.top=`${25+Math.random()*70}%`;
        el.style.setProperty('--dur',`${3.8+Math.random()*3.2}s`);
        el.style.setProperty('--delay',`${-Math.random()*6}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*55}px`);
        box.appendChild(el);
      }
      for(let i=0;i<3;i++){
        const el=document.createElement('span');el.className='orb';
        el.style.left=`${5+Math.random()*80}%`;
        el.style.top=`${18+Math.random()*65}%`;
        el.style.setProperty('--dur',`${7+Math.random()*4}s`);
        el.style.setProperty('--delay',`${-Math.random()*8}s`);
        box.appendChild(el);
      }
      for(let i=0;i<4;i++){
        const el=document.createElement('span');el.className='petal';
        el.style.left=`${5+Math.random()*88}%`;
        el.style.top=`${-10-Math.random()*25}%`;
        el.style.setProperty('--dur',`${6+Math.random()*4}s`);
        el.style.setProperty('--delay',`${-Math.random()*8}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*65}px`);
        box.appendChild(el);
      }
    });
  }

  function burst(){
    glitter.innerHTML='';
    for(let i=0;i<100;i++){
      const p=document.createElement('span');p.className='glitter';
      p.style.setProperty('--x',`${(Math.random()-.5)*360}px`);
      p.style.setProperty('--y',`${(Math.random()-.35)*520}px`);
      p.style.setProperty('--d',`${Math.random()*.5}s`);
      glitter.appendChild(p);
    }
    setTimeout(()=>glitter.innerHTML='',2600);
  }

  function getDuration(){
    if(Number.isFinite(songDuration)&&songDuration>5)return songDuration;
    if(Number.isFinite(music.duration)&&music.duration>5){songDuration=music.duration;return songDuration;}
    return 212;
  }

  function range(){
    const start=Math.max(0,firstPage.offsetTop);
    const end=Math.max(start,closing.offsetTop+closing.offsetHeight-window.innerHeight);
    return {start,end};
  }

  function positionForTime(t){
    const d=getDuration();
    const {start,end}=range();
    const hold=Math.min(FINAL_HOLD,Math.max(4.5,d*0.12));
    const travel=Math.max(0,d-hold);
    const p=travel>0?Math.min(1,Math.max(0,t/travel)):1;
    return start+(end-start)*p;
  }

  function closingStartTime(){
    const d=getDuration();
    return Math.max(0,d-Math.min(FINAL_HOLD,Math.max(4.5,d*0.12)));
  }

  function startNazar(){
    if(nazarShown)return;
    nazarShown=true;
    collageReveal.classList.remove('revealed');
    nazarOverlay.classList.remove('done','active');
    void nazarOverlay.offsetWidth;
    nazarOverlay.classList.add('active');
    clearTimeout(revealTimer);
    revealTimer=setTimeout(()=>{
      nazarOverlay.classList.add('done');
      collageReveal.classList.add('revealed');
    },NAZAR_DURATION+250);
  }

  function resetNazar(){
    nazarShown=false;
    clearTimeout(revealTimer);
    nazarOverlay.classList.remove('active','done');
    collageReveal.classList.remove('revealed');
  }

  function tick(){
    if(userPaused||music.paused||music.ended)return;
    const t=music.currentTime||0,d=getDuration();
    if(t>=closingStartTime())startNazar();
    window.scrollTo(0,positionForTime(t));
    if(t>=d-0.03){cancelAnimationFrame(raf);raf=0;return;}
    raf=requestAnimationFrame(tick);
  }

  function beginScroll(){cancelAnimationFrame(raf);userPaused=false;raf=requestAnimationFrame(tick)}

  async function waitForMetadata(){
    if(Number.isFinite(music.duration)&&music.duration>5){songDuration=music.duration;return;}
    await new Promise(resolve=>{
      const done=()=>{songDuration=music.duration;resolve()};
      music.addEventListener('loadedmetadata',done,{once:true});
      setTimeout(()=>{if(!songDuration)songDuration=Number.isFinite(music.duration)?music.duration:212;resolve()},1800);
    });
  }

  async function openInvitation(){
    if(started)return;
    started=true;
    wax.classList.add('opened');envelope.classList.add('opened');cover.classList.add('opened');burst();
    await waitForMetadata();
    resetNazar();
    try{music.loop=false;await music.play();musicState.textContent='Ranjha.mp3 · playing'}catch(e){musicState.textContent='Tap ♫ to play'}
    window.scrollTo(0,firstPage.offsetTop);
    setTimeout(beginScroll,250);
  }

  wax.addEventListener('click',openInvitation);
  wax.addEventListener('touchend',e=>{e.preventDefault();openInvitation()},{passive:false});

  musicButton.addEventListener('click',async()=>{
    if(music.paused){
      try{await music.play();musicState.textContent='Ranjha.mp3 · playing';if(started)beginScroll()}catch(e){}
    }else{
      music.pause();musicState.textContent='Ranjha.mp3 · paused';userPaused=true;cancelAnimationFrame(raf);raf=0;
    }
  });

  music.addEventListener('loadedmetadata',()=>{if(Number.isFinite(music.duration))songDuration=music.duration});
  music.addEventListener('timeupdate',()=>{if(started&&!userPaused&&!music.paused&&!music.ended&&!raf)raf=requestAnimationFrame(tick)});
  music.addEventListener('ended',()=>{
    cancelAnimationFrame(raf);raf=0;userPaused=true;
    startNazar();
    const {end}=range();window.scrollTo(0,end);
    musicState.textContent='Ranjha.mp3 · finished';
  });
  music.addEventListener('play',()=>musicState.textContent='Ranjha.mp3 · playing');
  music.addEventListener('pause',()=>{if(!music.ended)musicState.textContent='Ranjha.mp3 · paused'});
  window.addEventListener('resize',()=>{if(started&&!userPaused&&!music.paused&&!music.ended){cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}});
});
