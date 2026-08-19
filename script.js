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
    // CINEMATIC SCROLL REVEALS
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

        if (!bgMusic) return;

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
    // LUXURY GLITTER
    // ==========================================

    function createParticle(isStar, originX, originY) {

        if (!glitterContainer) return;

        const particle = document.createElement("span");

        particle.className = isStar
            ? "glitter star"
            : "glitter";

        particle.setAttribute("aria-hidden", "true");

        const x =
            (Math.random() - 0.5) * 82;

        const y =
            22 + Math.random() * 82;

        const delay =
            Math.random() * 0.18;

        const duration =
            1.65 + Math.random() * 1.45;

        const scale =
            0.55 + Math.random() * 1.35;

        const rotate =
            180 + Math.random() * 420;

        particle.style.left = originX + "%";
        particle.style.top = originY + "%";

        particle.style.setProperty(
            "--x",
            `calc(${x}vw + ${(Math.random() - 0.5) * 30}px)`
        );

        particle.style.setProperty(
            "--y",
            `${y}vh`
        );

        particle.style.setProperty(
            "--delay",
            `${delay}s`
        );

        particle.style.setProperty(
            "--duration",
            `${duration}s`
        );

        particle.style.setProperty(
            "--scale",
            scale
        );

        particle.style.setProperty(
            "--rotate",
            `${rotate}deg`
        );

        if (isStar) {

            particle.style.setProperty(
                "--star-size",
                `${9 + Math.random() * 10}px`
            );

        } else {

            const size =
                2.2 + Math.random() * 3.8;

            particle.style.width = size + "px";
            particle.style.height = size + "px";

        }

        glitterContainer.appendChild(particle);
    }


    function createGlitter() {

        if (!glitterContainer) return;

        glitterContainer.innerHTML = "";

        /*
           First wave:
           A dense, bright burst from the RA seal position.
           It starts after the flap has visibly cleared the seal,
           so the glitter cannot be hidden underneath the flap.
        */
        for (let i = 0; i < 105; i++) {

            createParticle(
                Math.random() < 0.22,
                50 + (Math.random() - 0.5) * 8,
                57 + (Math.random() - 0.5) * 5
            );
        }

        /*
           Second wave:
           Wider, softer particles continue the reveal.
        */
        setTimeout(function () {

            for (let i = 0; i < 55; i++) {

                createParticle(
                    Math.random() < 0.30,
                    50 + (Math.random() - 0.5) * 20,
                    47 + Math.random() * 9
                );
            }

        }, 260);

        /*
           Keep the DOM light. All particles are temporary.
        */
        setTimeout(function () {

            if (glitterContainer) {
                glitterContainer.innerHTML = "";
            }

        }, 4300);
    }


    // ==========================================
    // AUTO SCROLL
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

            window.scrollTo(
                0,
                currentPosition + 1
            );
        }

        animationFrame =
            requestAnimationFrame(autoScroll);
    }


    // ==========================================
    // START INVITATION
    // ==========================================

    function startInvitation() {

        if (started) return;

        started = true;

        document.documentElement.style.scrollBehavior = "auto";

        /*
           The RA press is the direct user gesture.
           Start music immediately so iPhone/Safari permits playback.
        */
        startMusic();

        /*
           0ms — seal releases.
        */
        if (waxButton) {
            waxButton.classList.add("opened");
        }

        /*
           90ms — the envelope begins its physical flap fold.
        */
        setTimeout(function () {

            if (weddingCard) {
                weddingCard.classList.add("opening");
            }

        }, 90);

        /*
           760ms — flap is already high enough for the glitter
           to be completely visible above it.
        */
        setTimeout(function () {
            createGlitter();
        }, 760);

        /*
           1450ms — invitation fades through naturally.
        */
        setTimeout(function () {

            if (hero) {
                hero.classList.add("card-revealed");
            }

        }, 1450);

        /*
           1950ms — remove the envelope layer.
           The hero underneath is already visible.
        */
        setTimeout(function () {

            if (weddingCard) {
                weddingCard.classList.add("opened");
            }

        }, 1950);

        /*
           2250ms — resume the existing gentle auto-scroll.
        */
        setTimeout(function () {

            autoScrolling = true;

            cancelAnimationFrame(animationFrame);

            animationFrame =
                requestAnimationFrame(autoScroll);

        }, 2250);
    }


    // ==========================================
    // RA SEAL — CLICK
    // ==========================================

    if (waxButton) {

        waxButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                startInvitation();

            }
        );

        /*
           Pointer events are used in addition to click so touch
           devices receive a single clean activation.
        */
        waxButton.addEventListener(
            "pointerup",
            function (event) {

                if (event.pointerType === "touch") {
                    event.preventDefault();
                    startInvitation();
                }

            }
        );
    }


    // ==========================================
    // USER TOUCH
    // ==========================================

    window.addEventListener(
        "touchstart",
        function () {

            if (!started) return;

            userInteracting = true;
            clearTimeout(resumeTimer);

        },
        { passive: true }
    );


    window.addEventListener(
        "touchmove",
        function () {

            if (!started) return;

            userInteracting = true;
            clearTimeout(resumeTimer);

        },
        { passive: true }
    );


    window.addEventListener(
        "touchend",
        function () {

            if (!started) return;

            clearTimeout(resumeTimer);

            resumeTimer = setTimeout(
                function () {

                    userInteracting = false;

                    cancelAnimationFrame(
                        animationFrame
                    );

                    animationFrame =
                        requestAnimationFrame(
                            autoScroll
                        );

                },
                180
            );

        },
        { passive: true }
    );


    // ==========================================
    // DESKTOP WHEEL / TRACKPAD
    // ==========================================

    window.addEventListener(
        "wheel",
        function () {

            if (!started) return;

            userInteracting = true;
            clearTimeout(resumeTimer);

            resumeTimer = setTimeout(
                function () {

                    userInteracting = false;

                    cancelAnimationFrame(
                        animationFrame
                    );

                    animationFrame =
                        requestAnimationFrame(
                            autoScroll
                        );

                },
                180
            );

        },
        { passive: true }
    );


    // ==========================================
    // DESKTOP MOUSE
    // ==========================================

    window.addEventListener(
        "mousedown",
        function () {

            if (!started) return;

            userInteracting = true;
            clearTimeout(resumeTimer);

        }
    );


    window.addEventListener(
        "mouseup",
        function () {

            if (!started) return;

            clearTimeout(resumeTimer);

            resumeTimer = setTimeout(
                function () {

                    userInteracting = false;

                    cancelAnimationFrame(
                        animationFrame
                    );

                    animationFrame =
                        requestAnimationFrame(
                            autoScroll
                        );

                },
                180
            );

        }
    );

});
