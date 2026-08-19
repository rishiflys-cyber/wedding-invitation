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
    // GOLD GLITTER BURST
    // ==========================================

    function createGlitter() {

        if (!glitterContainer) return;

        glitterContainer.innerHTML = "";

        const particleCount = 64;

        for (let i = 0; i < particleCount; i++) {

            const particle = document.createElement("span");
            const isStar = Math.random() < 0.18;

            particle.className = isStar ? "glitter star" : "glitter";

            if (isStar) {
                particle.textContent = "✦";
            }

            const startX = 50 + (Math.random() - 0.5) * 7;
            const startY = 50 + (Math.random() - 0.5) * 9;

            particle.style.left = startX + "%";
            particle.style.top = startY + "%";

            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 300;

            particle.style.setProperty("--x", Math.cos(angle) * distance + "px");
            particle.style.setProperty("--y", Math.sin(angle) * distance + "px");

            if (!isStar) {
                const size = 2 + Math.random() * 4.5;
                particle.style.width = size + "px";
                particle.style.height = size + "px";
            }

            particle.style.animationDelay = (Math.random() * 0.22) + "s";
            glitterContainer.appendChild(particle);
        }

        setTimeout(function () {
            if (glitterContainer) {
                glitterContainer.innerHTML = "";
            }
        }, 2300);
    }


    // ==========================================
    // OPEN THE ROYAL WEDDING CARD
    // ==========================================

    function startInvitation() {

        if (started) return;

        started = true;

        document.documentElement.style.scrollBehavior = "auto";

        // The tap is the user gesture: start music here.
        startMusic();

        // Press/break the seal.
        if (waxButton) {
            waxButton.classList.add("opened");
        }

        // Begin the physical card opening.
        setTimeout(function () {
            if (weddingCard) {
                weddingCard.classList.add("opening");
            }
        }, 160);

        // Glitter fires immediately after the leaves begin opening.
        setTimeout(function () {
            createGlitter();
        }, 520);

        // Reveal the invitation underneath.
        setTimeout(function () {
            if (hero) {
                hero.classList.add("card-revealed");
            }
        }, 1050);

        // Remove the cover only after the opening has visually completed.
        setTimeout(function () {
            if (weddingCard) {
                weddingCard.classList.add("opened");
            }
        }, 1650);

        // Preserve the proven iPhone/Safari-safe auto-scroll.
        setTimeout(function () {
            autoScrolling = true;
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(autoScroll);
        }, 2050);
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
