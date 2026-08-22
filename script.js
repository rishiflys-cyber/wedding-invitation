document.addEventListener('DOMContentLoaded',()=>{
  const loader=document.getElementById('loader');
  const wax=document.getElementById('waxButton');
  const envelope=document.getElementById('weddingCard');
  const cover=document.getElementById('cover');
  const intro=document.getElementById('intro');
  const music=document.getElementById('bgMusic');
  const musicButton=document.getElementById('musicButton');
  const musicState=document.getElementById('musicState');
  const glitter=document.getElementById('glitterContainer');
  const firstPage=document.getElementById('mehendi');
  const closing=document.getElementById('closing');
  const collageReveal=document.getElementById('collageReveal');
  let started=false,raf=0,userPaused=false,songDuration=0,envelopeOpened=false;
  const INTRO_HOLD=4.0;

  buildAmbientEffects();
  setTimeout(()=>{loader.style.opacity='0';setTimeout(()=>loader.remove(),500)},450);

  function tapFeedback(){ try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){} }

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
    const rect=wax.getBoundingClientRect();
    const originX=rect.left+rect.width/2;
    const originY=rect.top+rect.height/2;
    for(let i=0;i<120;i++){
      const p=document.createElement('span');
      p.className='glitter';
      const angle=Math.random()*Math.PI*2;
      const distance=70+Math.random()*260;
      p.style.left=`${originX}px`;
      p.style.top=`${originY}px`;
      p.style.setProperty('--x',`${Math.cos(angle)*distance}px`);
      p.style.setProperty('--y',`${Math.sin(angle)*distance}px`);
      p.style.setProperty('--d',`${Math.random()*.22}s`);
      p.style.setProperty('--size',`${2+Math.random()*4}px`);
      p.style.setProperty('--rot',`${Math.random()*360}deg`);
      glitter.appendChild(p);
    }
    setTimeout(()=>{glitter.innerHTML=''},2400);
  }

  function getDuration(){
    if(Number.isFinite(songDuration)&&songDuration>5)return songDuration;
    if(Number.isFinite(music.duration)&&music.duration>5){songDuration=music.duration;return songDuration;}
    return 212;
  }

  function range(){
    const start=Math.max(0,intro.offsetTop);
    const end=Math.max(start,closing.offsetTop+closing.offsetHeight-window.innerHeight);
    return {start,end};
  }

  function positionForTime(t){
    const d=getDuration();
    const {start,end}=range();
    const travel=Math.max(0,d);
    const p=travel>0?Math.min(1,Math.max(0,t/travel)):1;
    return start+(end-start)*p;
  }

  function tick(){
    if(userPaused||music.paused||music.ended)return;
    const t=music.currentTime||0,d=getDuration();
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

  // Tapping RA opens the envelope, launches the glitter burst, starts music,
  // and immediately begins the timed mobile journey — no second tap required.
  async function openEnvelope(){
    if(envelopeOpened)return;
    envelopeOpened=true;
    tapFeedback();
    wax.classList.add('opened');
    envelope.classList.add('opened');
    cover.classList.add('opened');
    burst();
    try{
      music.loop=false;
      await music.play();
      musicState.textContent='Now playing ♪';
    }catch(e){
      musicState.textContent='Now playing ♪';
    }
    await waitForMetadata();
    started=true;
    userPaused=false;
    window.scrollTo({top:intro.offsetTop,behavior:'smooth'});
    setTimeout(beginScroll,180);
  }

  wax.addEventListener('click',openEnvelope);
  wax.addEventListener('touchend',e=>{e.preventDefault();openEnvelope()},{passive:false});

  musicButton.addEventListener('click',async()=>{
    tapFeedback();
    if(music.paused){
      try{await music.play();musicState.textContent='Now playing ♪';if(started)beginScroll()}catch(e){}
    }else{
      music.pause();musicState.textContent='Music paused';userPaused=true;cancelAnimationFrame(raf);raf=0;
    }
  });

  music.addEventListener('loadedmetadata',()=>{if(Number.isFinite(music.duration))songDuration=music.duration});
  music.addEventListener('timeupdate',()=>{if(started&&!userPaused&&!music.paused&&!music.ended&&!raf)raf=requestAnimationFrame(tick)});
  music.addEventListener('ended',()=>{
    cancelAnimationFrame(raf);raf=0;userPaused=true;
    const {end}=range();window.scrollTo(0,end);
    collageReveal.classList.add('revealed');
    musicState.textContent='Thank you for celebrating with us';
  });
  music.addEventListener('play',()=>musicState.textContent='Now playing ♪');
  music.addEventListener('pause',()=>{if(!music.ended)musicState.textContent='Music paused'});
  window.addEventListener('resize',()=>{if(started&&!userPaused&&!music.paused&&!music.ended){cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}});
});
