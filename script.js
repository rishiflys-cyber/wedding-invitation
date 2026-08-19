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

    // Hide loader after 1.8 seconds
    setTimeout(hideLoader, 1800);


    // ==========================================
    // AUTO SCROLL
    // ==========================================

    function autoScroll() {

        if (!autoScrolling) {
            return;
        }

        // If the guest is manually touching/scrolling,
        // temporarily pause the automatic movement.
        if (!userInteracting) {

            const currentPosition = window.scrollY;

            const pageHeight = document.documentElement.scrollHeight;

            const screenHeight = window.innerHeight;

            const bottomPosition = pageHeight - screenHeight;


            // Stop when we reach the bottom
            if (currentPosition >= bottomPosition - 2) {

                autoScrolling = false;

                return;
            }


            // Slow cinematic movement
            window.scrollTo(
                0,
                currentPosition + 0.7
            );

        }


        animationFrame = requestAnimationFrame(autoScroll);

    }


    // ==========================================
    // START THE INVITATION
    // ==========================================

    function startInvitation() {

        // Prevent double activation
        if (started) {
            return;
        }

        started = true;

        // Visual feedback on the wax seal
        if (waxButton) {

            waxButton.classList.add("opened");

        }

        // Start automatic scrolling
        autoScrolling = true;

        cancelAnimationFrame(animationFrame);

        animationFrame = requestAnimationFrame(autoScroll);

    }


    // ==========================================
    // WAX SEAL — CLICK
    // ==========================================

    if (waxButton) {

        waxButton.addEventListener("click", function (event) {

            event.preventDefault();

            startInvitation();

        });

    }


    // ==========================================
    // WAX SEAL — iPHONE / TOUCH
    // ==========================================

    if (waxButton) {

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
    // USER INTERACTION
    // ==========================================

    function pauseForUser() {

        if (!started) {
            return;
        }

        userInteracting = true;

        clearTimeout(resumeTimer);


        // Resume automatically after the guest
        // stops touching/scrolling.
        resumeTimer = setTimeout(function () {

            userInteracting = false;

        }, 1000);

    }


    // ==========================================
    // TOUCH START
    // ==========================================

    window.addEventListener(
        "touchstart",
        function () {

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

            if (!started) {
                return;
            }

            clearTimeout(resumeTimer);

            resumeTimer = setTimeout(function () {

                userInteracting = false;

            }, 700);

        },
        { passive: true }
    );


    // ==========================================
    // DESKTOP MOUSE / TRACKPAD
    // ==========================================

    window.addEventListener(
        "wheel",
        function () {

            pauseForUser();

        },
        { passive: true }
    );


});
