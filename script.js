document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");
    const bgMusic = document.getElementById("bgMusic");
    const weddingCard = document.getElementById("weddingCard");
    const glitterContainer = document.getElementById("glitterContainer");
    const hero = document.getElementById("hero");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let animationFrame = null;
    let resumeTimer = null;


    // ==========================================
    // HIDE LOADER
    // ==========================================

    function hideLoader() {

        if (!loader) return;

        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";

        setTimeout(function () {
            loader.style.display = "none";
        }, 800);
    }

    setTimeout(hideLoader, 1800);




    // ==========================================
    // CINEMATIC ATMOSPHERE
    // ==========================================

    function createAmbientDust() {
        const layer = document.getElementById("ambientDust");
        if (!layer) return;

        const count = window.innerWidth < 769 ? 18 : 28;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const mote = document.createElement("span");
            mote.className = "ambient-mote";
            mote.style.setProperty("--left", `${Math.random() * 100}%`);
            mote.style.setProperty("--top", `${12 + Math.random() * 78}%`);
            mote.style.setProperty("--size", `${1 + Math.random() * 2.8}px`);
            mote.style.setProperty("--drift", `${-18 + Math.random() * 36}px`);
            mote.style.setProperty("--duration", `${5 + Math.random() * 7}s`);
            mote.style.setProperty("--delay", `${Math.random() * 6}s`);
            fragment.appendChild(mote);
        }

        layer.appendChild(fragment);
    }

    createAmbientDust();


    // ==========================================
    // CINEMATIC SCROLL PARALLAX
    // Lightweight: one RAF for the entire page.
    // ==========================================

    let parallaxFrame = null;

    function updateParallax() {
        parallaxFrame = null;

        const y = window.scrollY || window.pageYOffset || 0;
        document.documentElement.style.setProperty("--page-scroll", `${y}px`);

        const heroBackground = document.querySelector(".hero-background");
        if (heroBackground && y < window.innerHeight * 1.2) {
            heroBackground.style.transform = `translate3d(0, ${Math.min(y * 0.08, 35)}px, 0) scale(1.025)`;
        }

        document.querySelectorAll(".section-title, .collage-frame, .invitation-card, .venue-card").forEach(function (el) {
            const rect = el.getBoundingClientRect();
            if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
            const distance = (rect.top + rect.height / 2 - window.innerHeight / 2);
            const shift = Math.max(-10, Math.min(10, -distance * 0.018));
            el.style.setProperty("--micro-shift", `${shift}px`);
        });
    }

    function requestParallax() {
        if (parallaxFrame === null) {
            parallaxFrame = requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
    requestParallax();

    // ==========================================
    // CINEMATIC REVEAL SYSTEM
    // ==========================================

    function setupRevealAnimations() {

        const revealElements = document.querySelectorAll(
            ".section-title, " +
            ".collage-frame, " +
            ".invitation-card, " +
            ".detail-card, " +
            ".timeline-item, " +
            ".venue-card, " +
            ".gallery-item, " +
            ".blessing-text, " +
            ".footer-card"
        );

        revealElements.forEach(function (element) {
            element.classList.add("reveal-element");
        });

        if (!("IntersectionObserver" in window)) {
            revealElements.forEach(function (element) {
                element.classList.add("reveal-visible");
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const siblings = entry.target.parentElement ?
                            Array.from(entry.target.parentElement.children) : [];
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.setProperty("--reveal-delay", `${Math.max(0, Math.min(index, 6)) * 70}ms`);
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        revealElements.forEach(function (element) {
            observer.observe(element);
        });
    }

    setupRevealAnimations();


    // ==========================================
    // MUSIC
    // ==========================================

    function startMusic() {

        if (!bgMusic) {
            console.log("Music element not found");
            return;
        }

        bgMusic.src = "Ranjha.mp3";
        bgMusic.loop = true;
        bgMusic.preload = "auto";
        bgMusic.volume = 1.0;

        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(function () {
                    console.log("Wedding music started");
                })
                .catch(function (error) {
                    console.log("Music could not start:", error);
                });
        }
    }


    // ==========================================
    // LUXURY GOLD GLITTER SHOWER
    // ==========================================

    function createGlitter() {

        if (!glitterContainer) return;

        glitterContainer.innerHTML = "";

        const particleCount = 210;

        for (let i = 0; i < particleCount; i++) {

            const particle = document.createElement("span");
            const isStar = Math.random() < 0.16;

            particle.className = isStar ? "glitter star" : "glitter";

            if (isStar) {
                particle.setAttribute("aria-hidden", "true");
            }

            const spread = 62 + Math.random() * 34;
            const x = (Math.random() - 0.5) * spread;
            const y = 20 + Math.random() * 92;
            const drift = (Math.random() - 0.5) * 20;

            particle.style.setProperty("--x", `calc(${x}vw + ${drift}px)`);
            particle.style.setProperty("--y", `${y}vh`);
            particle.style.setProperty("--delay", `${Math.random() * 0.42}s`);
            particle.style.setProperty("--duration", `${1.9 + Math.random() * 1.65}s`);
            particle.style.setProperty("--scale", `${0.45 + Math.random() * 1.25}`);
            particle.style.setProperty("--rotate", `${180 + Math.random() * 420}deg`);

            if (isStar) {
                particle.style.setProperty("--star-size", `${9 + Math.random() * 12}px`);
            } else {
                const size = 2 + Math.random() * 4.5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
            }

            glitterContainer.appendChild(particle);
        }

        // A second, smaller wave gives the reveal a lingering magical shower.
        setTimeout(function () {

            if (!glitterContainer) return;

            for (let i = 0; i < 45; i++) {

                const particle = document.createElement("span");
                const isStar = Math.random() < 0.28;

                particle.className = isStar ? "glitter star" : "glitter";

                particle.style.setProperty("--x", `${(Math.random() - 0.5) * 75}vw`);
                particle.style.setProperty("--y", `${35 + Math.random() * 75}vh`);
                particle.style.setProperty("--delay", `${Math.random() * 0.25}s`);
                particle.style.setProperty("--duration", `${2 + Math.random() * 1.3}s`);
                particle.style.setProperty("--scale", `${0.4 + Math.random() * .9}`);

                if (isStar) {
                    particle.style.setProperty("--star-size", `${8 + Math.random() * 9}px`);
                } else {
                    const size = 1.5 + Math.random() * 3.5;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                }

                glitterContainer.appendChild(particle);
            }

        }, 420);

        setTimeout(function () {
            if (glitterContainer) glitterContainer.innerHTML = "";
        }, 5000);
    }


    // ==========================================
    // OPEN THE ROYAL WEDDING CARD
    // ==========================================

    function startInvitation() {

        if (started) return;

        started = true;
        document.documentElement.style.scrollBehavior = "auto";

        // The seal press is the user gesture, so music can start reliably on iPhone/Safari.
        startMusic();

        // 1. Tiny seal reaction.
        if (waxButton) {
            waxButton.classList.add("opened");
        }

        // 2. Envelope begins opening immediately.
        setTimeout(function () {
            if (weddingCard) {
                weddingCard.classList.add("opening");
            }
        }, 90);

        // 3. Glitter erupts as the flap clears the seal.
        setTimeout(function () {
            createGlitter();
        }, 620);

        // Tiny second flash right as the invitation becomes visible.
        setTimeout(function () {
            createGlitter();
        }, 1080);

        // 4. Let the invitation emerge underneath the opening envelope.
        setTimeout(function () {
            if (hero) {
                hero.classList.add("card-revealed");
            }
        }, 1240);

        // 5. Remove the envelope only after the physical opening has finished.
        setTimeout(function () {
            if (weddingCard) {
                weddingCard.classList.add("opened");
            }
        }, 2050);

        // 6. Existing iPhone/Safari-safe auto-scroll continues after reveal.
        setTimeout(function () {
            autoScrolling = true;
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(autoScroll);
        }, 2450);
    }


    // ==========================================
    // WAX SEAL — CLICK
    // ==========================================

    if (waxButton) {

        waxButton.addEventListener("click", function (event) {
            event.preventDefault();
            startInvitation();
        });

        waxButton.addEventListener("touchend", function (event) {
            event.preventDefault();
            startInvitation();
        }, { passive: false });
    }


    // ==========================================
    // AUTO SCROLL
    // iPHONE / SAFARI SAFE
    // ==========================================

    function autoScroll() {

        if (!autoScrolling) return;

        if (!userInteracting) {

            const currentPosition = window.scrollY;

            const maxPosition =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (currentPosition >= maxPosition - 2) {
                autoScrolling = false;
                return;
            }

            window.scrollTo(0, currentPosition + 1);
        }

        animationFrame = requestAnimationFrame(autoScroll);
    }


    // ==========================================
    // TOUCH START
    // ==========================================

    window.addEventListener("touchstart", function () {

        if (!started) return;

        userInteracting = true;
        clearTimeout(resumeTimer);

    }, { passive: true });


    // ==========================================
    // TOUCH MOVE
    // ==========================================

    window.addEventListener("touchmove", function () {

        if (!started) return;

        userInteracting = true;
        clearTimeout(resumeTimer);

    }, { passive: true });


    // ==========================================
    // TOUCH END — RESUME
    // ==========================================

    window.addEventListener("touchend", function () {

        if (!started) return;

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(function () {

            userInteracting = false;

            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(autoScroll);

        }, 100);

    }, { passive: true });


    // ==========================================
    // DESKTOP WHEEL / TRACKPAD
    // ==========================================

    window.addEventListener("wheel", function () {

        if (!started) return;

        userInteracting = true;
        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(function () {

            userInteracting = false;

            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(autoScroll);

        }, 100);

    }, { passive: true });


    // ==========================================
    // MOUSE DOWN
    // ==========================================

    window.addEventListener("mousedown", function () {

        if (!started) return;

        userInteracting = true;
        clearTimeout(resumeTimer);

    });


    // ==========================================
    // MOUSE UP
    // ==========================================

    window.addEventListener("mouseup", function () {

        if (!started) return;

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(function () {

            userInteracting = false;

            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(autoScroll);

        }, 100);

    });

});
