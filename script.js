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
    // MUSIC
    // ==========================================

    function startMusic() {

        if (!bgMusic) {
            console.log("Music element not found");
            return;
        }

        // Make absolutely sure the correct MP3 is being used
        bgMusic.src = "sahilmadan-wedding-invitation-421393.mp3";

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


            // One whole pixel at a time
            // Works better on iPhone Safari

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
        // for reliable iPhone scrolling

        document.documentElement.style.scrollBehavior = "auto";


        // Open wax seal

        if (waxButton) {

            waxButton.classList.add("opened");

        }


        // ======================================
        // START MUSIC IMMEDIATELY
        // ======================================

        startMusic();


        // ======================================
        // START AUTO SCROLL
        // ======================================

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


        // ======================================
        // iPHONE / SAFARI TOUCH
        // ======================================

        waxButton.addEventListener(
            "touchend",
            function (event) {

                event.preventDefault();

                startInvitation();

            },
            { passive: false }
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
        { passive: true }
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
        { passive: true }
    );


    // ==========================================
    // USER LETS GO
    // RESUME AUTO SCROLL
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

                    cancelAnimationFrame(animationFrame);

                    animationFrame =
                        requestAnimationFrame(autoScroll);

                },
                100
            );

        },
        { passive: true }
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

                    cancelAnimationFrame(animationFrame);

                    animationFrame =
                        requestAnimationFrame(autoScroll);

                },
                100
            );

        },
        { passive: true }
    );


    // ==========================================
    // MOUSE DRAG / CLICK INTERACTION
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

                    cancelAnimationFrame(animationFrame);

                    animationFrame =
                        requestAnimationFrame(autoScroll);

                },
                100
            );

        }
    );

});
