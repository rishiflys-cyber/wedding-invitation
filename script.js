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
  const FINAL_HOLD=4.2;

  buildAmbientEffects();
  setTimeout(()=>{loader.style.opacity='0';setTimeout(()=>loader.remove(),500)},450);

  function tapFeedback(){try{if(navigator.vibrate)navigator.vibrate(12)}catch(e){}}

  function buildAmbientEffects(){
    document.querySelectorAll('.ambient').forEach(box=>{
      if(box.dataset.ready==='1')return;
      box.dataset.ready='1';
      const glow=document.createElement('span');glow.className='frameGlow';box.appendChild(glow);
      for(let i=0;i<18;i++){
        const el=document.createElement('span');el.className='spark';
        el.style.left=`${4+Math.random()*92}%`;
        el.style.top=`${10+Math.random()*82}%`;
        el.style.setProperty('--dur',`${2.8+Math.random()*3.8}s`);
        el.style.setProperty('--delay',`${-Math.random()*6}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*70}px`);
        box.appendChild(el);
      }
      for(let i=0;i<4;i++){
        const el=document.createElement('span');el.className='orb';
        el.style.left=`${5+Math.random()*80}%`;
        el.style.top=`${10+Math.random()*70}%`;
        el.style.setProperty('--dur',`${5+Math.random()*4}s`);
        el.style.setProperty('--delay',`${-Math.random()*7}s`);
        box.appendChild(el);
      }
      for(let i=0;i<6;i++){
        const el=document.createElement('span');el.className='petal';
        el.style.left=`${5+Math.random()*88}%`;
        el.style.top=`${-10-Math.random()*25}%`;
        el.style.setProperty('--dur',`${5+Math.random()*4}s`);
        el.style.setProperty('--delay',`${-Math.random()*8}s`);
        el.style.setProperty('--drift',`${(Math.random()-.5)*80}px`);
        box.appendChild(el);
      }
    });
  }

  function burst(){
    if(!glitter)return;
    glitter.innerHTML='';
    glitter.classList.remove('bursting');
    void glitter.offsetWidth;
    glitter.classList.add('bursting');
    for(let i=0;i<120;i++){
      const p=document.createElement('span');p.className='glitter';
      p.style.setProperty('--x',`${(Math.random()-.5)*Math.min(520,window.innerWidth*1.15)}px`);
      p.style.setProperty('--y',`${(Math.random()-.35)*Math.min(720,window.innerHeight*1.2)}px`);
      p.style.setProperty('--d',`${Math.random()*.35}s`);
      p.style.setProperty('--s',`${1+Math.random()*1.8}`);
      glitter.appendChild(p);
    }
    setTimeout(()=>{glitter.innerHTML='';glitter.classList.remove('bursting')},2300);
  }

  function getDuration(){
    if(Number.isFinite(songDuration)&&songDuration>5)return songDuration;
    if(Number.isFinite(music.duration)&&music.duration>5){songDuration=music.duration;return songDuration}
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
    const hold=Math.min(FINAL_HOLD,Math.max(3.5,d*.10));
    const travel=Math.max(0,d-hold);
    const p=travel>0?Math.min(1,Math.max(0,t/travel)):1;
    return start+(end-start)*p;
  }

  function tick(){
    if(userPaused||music.paused||music.ended)return;
    const t=music.currentTime||0,d=getDuration();
    window.scrollTo(0,positionForTime(t));
    if(t>=d-.03){cancelAnimationFrame(raf);raf=0;return}
    raf=requestAnimationFrame(tick);
  }

  function beginScroll(){cancelAnimationFrame(raf);userPaused=false;raf=requestAnimationFrame(tick)}

  async function waitForMetadata(){
    if(Number.isFinite(music.duration)&&music.duration>5){songDuration=music.duration;return}
    await new Promise(resolve=>{
      const done=()=>{songDuration=music.duration;resolve()};
      music.addEventListener('loadedmetadata',done,{once:true});
      setTimeout(()=>{if(!songDuration)songDuration=Number.isFinite(music.duration)?music.duration:212;resolve()},1800)
    });
  }

  async function startExperience(){
    if(started)return;
    started=true;
    try{music.loop=false;await music.play();musicState.textContent='Now playing ♪'}catch(e){musicState.textContent='Tap ♫ to play'}
    intro.classList.add('active');
    await waitForMetadata();
    beginScroll();
  }

  function openEnvelope(){
    if(envelopeOpened)return;
    envelopeOpened=true;
    tapFeedback();
    wax.classList.add('opened');envelope.classList.add('opened');cover.classList.add('opened');
    burst();
    startExperience();
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
    collageReveal.classList.add('revealed');
    const {end}=range();window.scrollTo(0,end);
    musicState.textContent='Thank you for celebrating with us';
  });
  music.addEventListener('play',()=>musicState.textContent='Now playing ♪');
  music.addEventListener('pause',()=>{if(!music.ended)musicState.textContent='Music paused'});
  window.addEventListener('resize',()=>{if(started&&!userPaused&&!music.paused&&!music.ended){cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}});
});
