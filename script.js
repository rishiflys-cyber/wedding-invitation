/* ===========================================================
   RISHABH ❤️ ANANYA
   SCRIPT.JS
   PART 1
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =======================================================
       ELEMENTS
    ======================================================= */

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");
    const music = document.getElementById("bgMusic");
    const musicButton = document.getElementById("musicButton");

    /* =======================================================
       STATE
    ======================================================= */

    let invitationStarted = false;
    let autoScrolling = false;
    let paused = false;
    let animationFrame = null;

    /* =======================================================
       LOADER
    ======================================================= */

    function hideLoader(){

        if(!loader) return;

        loader.style.opacity="0";

        setTimeout(()=>{

            loader.style.display="none";

        },800);

    }

    /* =======================================================
       MUSIC
    ======================================================= */

    function startMusic(){

        if(!music) return;

        music.play().catch(()=>{});

        if(musicButton){

            musicButton.classList.add("show");
            musicButton.textContent="❚❚";

        }

    }

    function toggleMusic(){

        if(!music) return;

        if(music.paused){

            music.play();

            musicButton.textContent="❚❚";

        }else{

            music.pause();

            musicButton.textContent="♫";

        }

    }

    if(musicButton){

        musicButton.addEventListener("click",toggleMusic);

    }

    /* =======================================================
       AUTO SCROLL
    ======================================================= */

    function autoScrollLoop(){

        if(!autoScrolling) return;

        if(!paused){

            window.scrollBy({

                top:1,

                behavior:"auto"

            });

        }

        const bottomReached=

            window.innerHeight+window.scrollY>=
            document.body.offsetHeight-2;

        if(bottomReached){

            stopAutoScroll();
            return;

        }

        animationFrame=requestAnimationFrame(autoScrollLoop);

    }

    function startAutoScroll(){

        if(autoScrolling) return;

        autoScrolling=true;

        autoScrollLoop();

    }

    function stopAutoScroll(){

        autoScrolling=false;

        if(animationFrame){

            cancelAnimationFrame(animationFrame);

        }

    }

    /* =======================================================
       PAUSE / RESUME
    ======================================================= */

    function pauseScrolling(){

        paused=true;

    }

    function resumeScrolling(){

        paused=false;

    }

    window.addEventListener("touchstart",pauseScrolling);

    window.addEventListener("mousedown",pauseScrolling);

    window.addEventListener("touchend",resumeScrolling);

    window.addEventListener("mouseup",resumeScrolling);

    window.addEventListener("wheel",()=>{

        paused=true;

        clearTimeout(window.scrollTimer);

        window.scrollTimer=setTimeout(()=>{

            paused=false;

        },1200);

    });

    /* =======================================================
       WAX SEAL
    ======================================================= */

    if(waxButton){

        waxButton.addEventListener("click",()=>{

            if(invitationStarted) return;

            invitationStarted=true;

            hideLoader();

            startMusic();

            startAutoScroll();

        });

    }
    /* =======================================================
       SCROLL REVEAL ANIMATIONS
    ======================================================= */

    const revealElements = document.querySelectorAll(

        ".section-title, .detail-card, .timeline-item, .venue-card, .gallery-item, .parent-box, .paper, .footer-card"

    );

    const revealObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    revealObserver.unobserve(entry.target);

                }

            });

        },

        {

            threshold: 0.15

        }

    );

    revealElements.forEach((element) => {

        element.style.opacity = "0";
        element.style.transform = "translateY(40px)";
        element.style.transition =

            "opacity .9s ease, transform .9s ease";

        revealObserver.observe(element);

    });

    /* =======================================================
       AUTO GALLERY LOADER
    ======================================================= */

    const galleryGrid = document.getElementById("galleryGrid");

    if (galleryGrid) {

        const images = [

            "photo1.jpg",
            "photo2.jpg",
            "photo3.jpg",
            "photo4.jpg",
            "photo5.jpg",
            "photo6.jpg"

        ];

        images.forEach((image) => {

            const card = document.createElement("div");

            card.className = "gallery-item";

            card.innerHTML =

                `<img src="assets/images/gallery/${image}" alt="">`;

            galleryGrid.appendChild(card);

        });

    }

    /* =======================================================
       IMAGE PRELOAD
    ======================================================= */

    document.querySelectorAll("img").forEach((img) => {

        img.loading = "lazy";

        img.decoding = "async";

    });

    /* =======================================================
       HERO PARALLAX
    ======================================================= */

    const hero = document.getElementById("hero");

    window.addEventListener("scroll", () => {

        const y = window.scrollY;

        if (hero) {

            hero.style.backgroundPositionY =

                `${y * 0.25}px`;

        }

    });

    /* =======================================================
       ACTIVE SECTION
    ======================================================= */

    const sections = document.querySelectorAll("section");

    const activeObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    document.body.setAttribute(

                        "data-section",

                        entry.target.id

                    );

                }

            });

        },

        {

            threshold: 0.45

        }

    );

    sections.forEach((section) => {

        activeObserver.observe(section);

    });

    /* =======================================================
       PREVENT DOUBLE TAP
    ======================================================= */

    document.addEventListener(

        "dblclick",

        (e) => {

            e.preventDefault();

        },

        {

            passive: false

        }

    );

    /* =======================================================
       END
    ======================================================= */

});
