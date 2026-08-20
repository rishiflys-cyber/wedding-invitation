document.addEventListener('DOMContentLoaded',()=>{
  const loader=document.getElementById('loader');
  const wax=document.getElementById('waxButton');
  const envelope=document.getElementById('weddingCard');
  const cover=document.getElementById('cover');
  const music=document.getElementById('bgMusic');
  const musicButton=document.getElementById('musicButton');
  const musicState=document.getElementById('musicState');
  const glitter=document.getElementById('glitterContainer');
  const firstPage=document.getElementById('haldi');
  const lastPage=document.getElementById('closing');
  let started=false, raf=0, userPaused=false, songDuration=0;

  setTimeout(()=>{loader.style.opacity='0';setTimeout(()=>loader.remove(),500)},450);

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

  function scrollRange(){
    const start=Math.max(0,firstPage.offsetTop);
    const end=Math.max(start,lastPage.offsetTop+lastPage.offsetHeight-window.innerHeight);
    return {start,end};
  }

  function tick(){
    if(userPaused||music.paused||music.ended)return;
    const d=getDuration();
    const progress=Math.min(1,Math.max(0,(music.currentTime||0)/d));
    const {start,end}=scrollRange();
    window.scrollTo(0,start+(end-start)*progress);
    if(progress>=1){cancelAnimationFrame(raf);raf=0;return;}
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
    firstPage.scrollIntoView({block:'start'});
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
    const {end}=scrollRange();window.scrollTo(0,end);
    musicState.textContent='Ranjha.mp3 · finished';
  });
  music.addEventListener('play',()=>musicState.textContent='Ranjha.mp3 · playing');
  music.addEventListener('pause',()=>{if(!music.ended)musicState.textContent='Ranjha.mp3 · paused'});
  window.addEventListener('resize',()=>{if(started&&!userPaused&&!music.paused&&!music.ended){cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}});
});
