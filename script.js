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
  const nazar=document.getElementById('nazar');
  const lastPage=document.getElementById('closing');
  let started=false,raf=0,userPaused=false,songDuration=0,nazarShown=false;
  const NAZAR_HOLD=3.15;

  buildAmbientEffects();
  activateVisibleAmbients();
  setTimeout(()=>{loader.style.opacity='0';setTimeout(()=>loader.remove(),500)},450);


  // Lightweight ambient effects designed for mobile Safari + Chrome.
  // They use ordinary DOM/CSS transforms rather than canvas/WebGL.
  function buildAmbientEffects(){
    const containers=document.querySelectorAll('.ambient');
    containers.forEach((box,boxIndex)=>{
      if(box.dataset.ready==='1')return;
      box.dataset.ready='1';
      const glow=document.createElement('span');glow.className='frameGlow';box.appendChild(glow);
      for(let i=0;i<10;i++){
        const el=document.createElement('span');el.className='spark';
        el.style.left=`${6+Math.random()*88}%`;
        el.style.top=`${38+Math.random()*58}%`;
        el.style.setProperty('--dur',`${4.5+Math.random()*3.5}s`);
        el.style.setProperty('--delay',`${-Math.random()*6}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*42}px`);
        box.appendChild(el);
      }
      for(let i=0;i<2;i++){
        const el=document.createElement('span');el.className='orb';
        el.style.left=`${8+Math.random()*76}%`;
        el.style.top=`${20+Math.random()*62}%`;
        el.style.setProperty('--dur',`${8+Math.random()*5}s`);
        el.style.setProperty('--delay',`${-Math.random()*8}s`);
        box.appendChild(el);
      }
      for(let i=0;i<3;i++){
        const el=document.createElement('span');el.className='petal';
        el.style.left=`${8+Math.random()*84}%`;
        el.style.top=`${-8-Math.random()*20}%`;
        el.style.setProperty('--dur',`${7+Math.random()*4}s`);
        el.style.setProperty('--delay',`${-Math.random()*8}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*55}px`);
        box.appendChild(el);
      }
    });
  }

  function activateVisibleAmbients(){
    const pages=document.querySelectorAll('.occasion-page,.dinner,.closing');
    if(!('IntersectionObserver' in window)){
      document.querySelectorAll('.ambient').forEach(x=>x.classList.add('active'));
      return;
    }
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const amb=entry.target.querySelector('.ambient');
        if(amb)amb.classList.toggle('active',entry.isIntersecting);
      });
    },{threshold:0.18});
    pages.forEach(page=>io.observe(page));
  }

  function burst(){
    glitter.innerHTML='';
    for(let i=0;i<90;i++){
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
    const nazarTop=Math.max(start,nazar.offsetTop);
    const end=Math.max(nazarTop,lastPage.offsetTop+lastPage.offsetHeight-window.innerHeight);
    return {start,nazarTop,end};
  }

  function positionForTime(t){
    const d=getDuration();
    const {start,nazarTop,end}=range();
    const hold=Math.min(NAZAR_HOLD,Math.max(0,d*0.08));
    const travel=d-hold;
    const pre=Math.max(0,Math.min(1,(travel*.72)>0?t/(travel*.72):1));
    const nazarStart=travel*.72;
    if(t<nazarStart){
      return start+(nazarTop-start)*pre;
    }
    if(t<nazarStart+hold){
      return nazarTop;
    }
    const p=Math.min(1,Math.max(0,(t-(nazarStart+hold))/(d-(nazarStart+hold))));
    return nazarTop+(end-nazarTop)*p;
  }

  function updateNazar(t){
    const d=getDuration();
    const hold=Math.min(NAZAR_HOLD,Math.max(0,d*0.08));
    const nazarStart=(d-hold)*.72;
    const inWindow=t>=nazarStart-0.15 && t<=nazarStart+hold+0.2;
    if(inWindow&&!nazarShown){
      nazarShown=true;
      nazar.classList.remove('active');
      void nazar.offsetWidth;
      nazar.classList.add('active');
    }
    if(!inWindow&&t<nazarStart-0.15)nazarShown=false;
  }

  function tick(){
    if(userPaused||music.paused||music.ended)return;
    const t=music.currentTime||0,d=getDuration();
    updateNazar(t);
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
    cancelAnimationFrame(raf);raf=0;userPaused=true;nazar.classList.remove('active');nazarShown=false;
    const {end}=range();window.scrollTo(0,end);
    musicState.textContent='Ranjha.mp3 · finished';
  });
  music.addEventListener('play',()=>musicState.textContent='Ranjha.mp3 · playing');
  music.addEventListener('pause',()=>{if(!music.ended)musicState.textContent='Ranjha.mp3 · paused'});
  window.addEventListener('resize',()=>{if(started&&!userPaused&&!music.paused&&!music.ended){cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}});
});
