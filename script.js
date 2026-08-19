document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

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


            // IMPORTANT:
            // Use a whole pixel.
            // Safari can ignore fractional scrolling.

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

        // Turn OFF CSS smooth scrolling.
        // This is important for iPhone Safari.

        document.documentElement.style.scrollBehavior = "auto";

        if (waxButton) {

            waxButton.classList.add("opened");

        }

        // Give the tap a moment to finish,
        // then start the journey.

        setTimeout(function () {

            autoScrolling = true;

            cancelAnimationFrame(animationFrame);

            animationFrame =
                requestAnimationFrame(autoScroll);

        }, 300);

    }


    // ==========================================
    // WAX SEAL
    // ==========================================

    if (waxButton) {

        waxButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                startInvitation();

            }
        );


        // iPhone Safari

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
    // USER TOUCH
    // ==========================================

    function pauseForUser() {

        if (!started) {
            return;
        }

        userInteracting = true;

        clearTimeout(resumeTimer);

    }


    // ==========================================
    // TOUCH START
    // ==========================================

    window.addEventListener(
        "touchstart",
        function () {

            if (!started) return;

            pauseForUser();

        },
        { passive: true }
    );


    // ==========================================
    // TOUCH MOVE
    // ==========================================

    window.addEventListener(
        "touchmove",
        function () {

            if (!started) return;

            pauseForUser();

        },
        { passive: true }
    );


    // ==========================================
    // TOUCH END
    // ==========================================

    window.addEventListener(
        "touchend",
        function () {

            if (!started) return;

            clearTimeout(resumeTimer);

            resumeTimer = setTimeout(
                function () {

                    userInteracting = false;

                },
                500
            );

        },
        { passive: true }
    );


    // ==========================================
    // DESKTOP WHEEL
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

                },
                500
            );

        },
        { passive: true }
    );

});
