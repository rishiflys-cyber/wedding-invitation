document.addEventListener("DOMContentLoaded", function () {
    const bgMusic = document.getElementById("bgMusic");
    const hero = document.getElementById("hero");
    let started = false;
    let autoScrolling = false;
    let animationFrame = null;
    let userInteracting = false;
    let resumeTimer = null;

    document.body.classList.remove("opening-complete");
    document.documentElement.style.scrollBehavior = "auto";

    const oldCard = document.getElementById("weddingCard");
    if (oldCard) oldCard.style.display = "none";
    const oldLoader = document.getElementById("loader");
    if (oldLoader) oldLoader.style.display = "none";

    const overlay = document.createElement("div");
    overlay.id = "envelopeV4";
    overlay.innerHTML = `
      <div class="ev4-stage">
        <div class="ev4-paper-grain"></div>
        <div class="ev4-border"></div>
        <div class="ev4-envelope">
          <div class="ev4-letter" aria-hidden="true">
            <div class="ev4-letter-content">
              <div class="names">Rishabh</div>
              <div class="and">&amp;</div>
              <div class="names">Ananya</div>
              <div class="heart-line"><span>✦</span></div>
            </div>
          </div>
          <div class="ev4-left" aria-hidden="true"></div>
          <div class="ev4-right" aria-hidden="true"></div>
          <div class="ev4-bottom" aria-hidden="true"></div>
          <div class="ev4-top" aria-hidden="true"></div>
          <span class="ev4-crease one" aria-hidden="true"></span>
          <span class="ev4-crease two" aria-hidden="true"></span>
          <span class="ev4-crease three" aria-hidden="true"></span>
        </div>
        <div class="ev4-gold-haze" aria-hidden="true"></div>
        <div class="ev4-flash" aria-hidden="true"></div>
        <canvas class="ev4-canvas" aria-hidden="true"></canvas>
        <button class="ev4-seal-button" type="button" aria-label="Open invitation">
          <span class="ev4-seal-shadow"></span>
          <span class="ev4-wax"><span class="ev4-ra">RA</span></span>
        </button>
      </div>`;
    document.body.appendChild(overlay);

    const seal = overlay.querySelector(".ev4-seal-button");
    const canvas = overlay.querySelector(".ev4-canvas");
    const ctx = canvas.getContext("2d", { alpha: true });
    let particles = [];
    let canvasFrame = 0;

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    function makeParticle(delay, soft) {
        const w = window.innerWidth, h = window.innerHeight;
        const cx = w * .5, cy = h * .57;
        const a = Math.random() * Math.PI * 2;
        const distance = (soft ? 80 : 55) + Math.random() * (soft ? Math.min(w,h)*.52 : Math.min(w,h)*.72);
        const speed = .35 + Math.random() * .8;
        return {
            x: cx, y: cy,
            vx: Math.cos(a) * speed * (soft ? .9 : 1.25),
            vy: Math.sin(a) * speed * (soft ? .9 : 1.25) - .18,
            tx: Math.cos(a) * distance,
            ty: Math.sin(a) * distance,
            age: -delay,
            life: 1050 + Math.random() * (soft ? 1200 : 900),
            size: (soft ? 1.2 : 1.8) + Math.random() * (soft ? 2.6 : 4.4),
            rot: Math.random() * Math.PI,
            spin: (Math.random()-.5)*.16,
            star: Math.random() < (soft ? .12 : .22),
            alpha: .65 + Math.random()*.35,
            drift: (Math.random()-.5)*.22
        };
    }

    function drawStar(c, x, y, r, rotation) {
        c.save(); c.translate(x,y); c.rotate(rotation);
        c.beginPath();
        for (let i=0;i<8;i++) {
            const rr = i%2===0 ? r : r*.24;
            const a = i*Math.PI/4;
            c.lineTo(Math.cos(a)*rr, Math.sin(a)*rr);
        }
        c.closePath(); c.fill(); c.restore();
    }

    function startGoldBurst() {
        particles = [];
        const mobile = window.innerWidth <= 768;
        const count = mobile ? 170 : 230;
        for (let i=0;i<count;i++) particles.push(makeParticle(Math.random()*260, false));
        for (let i=0;i<(mobile?90:120);i++) particles.push(makeParticle(250+Math.random()*500, true));
        cancelAnimationFrame(canvasFrame);
        const startedAt = performance.now();
        function frame(now) {
            const elapsed = now - startedAt;
            const w = window.innerWidth, h = window.innerHeight;
            ctx.clearRect(0,0,w,h);
            let alive = false;
            for (const p of particles) {
                p.age += 16.67;
                if (p.age < 0) continue;
                if (p.age < p.life) alive = true;
                const t = Math.min(1, p.age / p.life);
                p.x += p.vx * 16.67;
                p.y += p.vy * 16.67;
                p.vy += .0038 * 16.67;
                p.x += Math.sin(p.age*.006 + p.drift*10) * .34;
                p.rot += p.spin;
                const fadeIn = Math.min(1, p.age/120);
                const fadeOut = Math.max(0, 1-(t*.92));
                ctx.globalAlpha = fadeIn * fadeOut * p.alpha;
                ctx.fillStyle = Math.random() < .12 ? "#fff3c7" : "#e6cf9a";
                if (p.star) drawStar(ctx,p.x,p.y,p.size*1.8,p.rot);
                else { ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); }
            }
            ctx.globalAlpha = 1;
            if (alive && elapsed < 3900) canvasFrame=requestAnimationFrame(frame);
            else ctx.clearRect(0,0,w,h);
        }
        canvasFrame=requestAnimationFrame(frame);
    }

    function startMusic() {
        if (!bgMusic) return;
        bgMusic.src = "Ranjha.mp3";
        bgMusic.loop = true;
        bgMusic.preload = "auto";
        bgMusic.volume = 1;
        const p = bgMusic.play();
        if (p && p.catch) p.catch(function(){});
    }

    function openInvitation() {
        if (started) return;
        started = true;
        startMusic();
        overlay.classList.add("is-opening");

        // The animation is intentionally staged: seal -> flap -> folds -> letter -> names.
        setTimeout(function(){ overlay.classList.add("seal-released"); }, 20);
        setTimeout(function(){ overlay.classList.add("flap-opening"); }, 170);
        setTimeout(function(){ startGoldBurst(); overlay.classList.add("gold-burst"); }, 360);
        setTimeout(function(){ overlay.classList.add("letter-rising"); }, 430);
        setTimeout(function(){ overlay.classList.add("letter-glow"); }, 780);
        setTimeout(function(){ overlay.classList.add("names-revealed"); }, 1420);
        setTimeout(function(){ overlay.classList.add("is-done"); }, 3500);
        setTimeout(function(){
            overlay.remove();
            document.body.classList.add("opening-complete");
            if (hero) hero.scrollIntoView({ block:"start", behavior:"auto" });
        }, 4300);
        setTimeout(startAutoScroll, 5000);
    }

    seal.addEventListener("pointerup", function(e){ e.preventDefault(); openInvitation(); }, {passive:false});
    seal.addEventListener("click", function(e){ e.preventDefault(); openInvitation(); });

    function setupRevealAnimations() {
        const elements=document.querySelectorAll(".section-title,.collage-frame,.invitation-card,.detail-card,.timeline-item,.venue-card,.gallery-item,.blessing-text,.footer-card");
        elements.forEach(el=>el.classList.add("reveal-element"));
        if (!("IntersectionObserver" in window)) { elements.forEach(el=>el.classList.add("reveal-visible")); return; }
        const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
            if(entry.isIntersecting){entry.target.classList.add("reveal-visible");observer.unobserve(entry.target);}
        }),{threshold:.12,rootMargin:"0px 0px -8% 0px"});
        elements.forEach(el=>observer.observe(el));
    }
    setupRevealAnimations();

    function startAutoScroll(){ if(!started)return; autoScrolling=true; cancelAnimationFrame(animationFrame); animationFrame=requestAnimationFrame(autoScroll); }
    function autoScroll(){
        if(!autoScrolling)return;
        if(!userInteracting){
            const current=window.scrollY, max=document.documentElement.scrollHeight-window.innerHeight;
            if(current>=max-2){autoScrolling=false;return;}
            window.scrollTo(0,current+1);
        }
        animationFrame=requestAnimationFrame(autoScroll);
    }
    function pauseAndResume(){
        if(!started)return;
        userInteracting=true; clearTimeout(resumeTimer);
        resumeTimer=setTimeout(function(){userInteracting=false;startAutoScroll();},450);
    }
    window.addEventListener("touchstart",pauseAndResume,{passive:true});
    window.addEventListener("touchmove",pauseAndResume,{passive:true});
    window.addEventListener("wheel",pauseAndResume,{passive:true});
    window.addEventListener("mousedown",pauseAndResume);
    window.addEventListener("mouseup",function(){if(!started)return;clearTimeout(resumeTimer);resumeTimer=setTimeout(function(){userInteracting=false;startAutoScroll();},450);});
});
