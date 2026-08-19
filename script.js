document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");
    const bgMusic = document.getElementById("bgMusic");

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

                        entry.target.classList.add(
                            "reveal-visible"
                        );

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


        // Current wedding music
        bgMusic.src = "Ranjha.mp3";

        bgMusic.loop = true;
        bgMusic.preload = "auto";
        bgMusic.volume = 1.0;


        const playPromise = bgMusic.play();


        if (playPromise !== undefined) {

            playPromise
                .then(function () {

                    console.log(
                        "Wedding music started"
                    );

                })
                .catch(function (error) {

                    console.log(
                        "Music could not start:",
                        error
                    );

                });

        }

    }


    // ==========================================
    // AUTO SCROLL
    // iPHONE / SAFARI SAFE
    // ==========================================

    function autoScroll() {

        if (!autoScrolling) {

            return;

        }


        if (!userInteracting) {

            const currentPosition = window.scrollY;

            const maxPosition =
                document.documentElement.scrollHeight -
                window.innerHeight;


            // Stop at bottom

            if (currentPosition >= maxPosition - 2) {

                autoScrolling = false;

                return;

            }


            // Whole pixel movement.
            // Preserves iPhone Safari behaviour.

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

        if (started) {

            return;

        }

        started = true;


        // Disable CSS smooth scrolling
        // for reliable iPhone scrolling.

        document.documentElement.style.scrollBehavior =
            "auto";


        // Open wax seal

        if (waxButton) {

            waxButton.classList.add("opened");

        }


        // Start music

        startMusic();


        // Start auto-scroll

        setTimeout(function () {

            autoScrolling = true;

            cancelAnimationFrame(animationFrame);

            animationFrame =
                requestAnimationFrame(autoScroll);

        }, 300);

    }


    // ==========================================
    // WAX SEAL — CLICK
    // ==========================================

    if (waxButton) {

        waxButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                startInvitation();

            }
        );


        // iPhone / Safari

        waxButton.addEventListener(
            "touchend",
            function (event) {

                event.preventDefault();

                startInvitation();

            },
            {
                passive: false
            }
        );

    }


    // ==========================================
    // USER TOUCH START
    // ==========================================

    window.addEventListener(
        "touchstart",
        function () {

            if (!started) {

                return;

            }

            userInteracting = true;

            clearTimeout(resumeTimer);

        },
        {
            passive: true
        }
    );


    // ==========================================
    // USER TOUCH MOVE
    // ==========================================

    window.addEventListener(
        "touchmove",
        function () {

            if (!started) {

                return;

            }

            userInteracting = true;

            clearTimeout(resumeTimer);

        },
        {
            passive: true
        }
    );


    // ==========================================
    // USER LETS GO
    // ==========================================

    window.addEventListener(
        "touchend",
        function () {

            if (!started) {

                return;

            }

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
                100
            );

        },
        {
            passive: true
        }
    );


    // ==========================================
    // DESKTOP MOUSE / TRACKPAD
    // ==========================================

    window.addEventListener(
        "wheel",
        function () {

            if (!started) {

                return;

            }

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
                100
            );

        },
        {
            passive: true
        }
    );


    // ==========================================
    // MOUSE DOWN
    // ==========================================

    window.addEventListener(
        "mousedown",
        function () {

            if (!started) {

                return;

            }

            userInteracting = true;

            clearTimeout(resumeTimer);

        }
    );


    // ==========================================
    // MOUSE UP
    // ==========================================

    window.addEventListener(
        "mouseup",
        function () {

            if (!started) {

                return;

            }

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
                100
            );

        }
    );


});
