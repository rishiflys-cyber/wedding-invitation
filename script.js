document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let animationFrame = null;
    let interactionTimer = null;


    // =============================
    // HIDE LOADER
    // =============================

    setTimeout(() => {

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);

        }

    }, 1800);


    // =============================
    // AUTO SCROLL
    // =============================

    function autoScroll() {

        if (!autoScrolling) return;

        if (userInteracting) {

            animationFrame = requestAnimationFrame(autoScroll);
            return;

        }

        const currentPosition = window.scrollY;

        const maxPosition =
            document.documentElement.scrollHeight - window.innerHeight;


        // Stop at bottom

        if (currentPosition >= maxPosition - 2) {

            autoScrolling = false;
            return;

        }


        // Slow cinematic scrolling

        window.scrollBy(0, 0.7);

        animationFrame = requestAnimationFrame(autoScroll);

    }


    // =============================
    // START INVITATION
    // =============================

    if (waxButton) {

        waxButton.addEventListener("click", () => {

            if (started) return;

            started = true;

            // Visual feedback

            waxButton.classList.add("opened");

            // Start scrolling

            autoScrolling = true;

            cancelAnimationFrame(animationFrame);

            animationFrame =
                requestAnimationFrame(autoScroll);

        });

    }


    // =============================
    // USER INTERACTION
    // =============================

    function pauseForUser() {

        if (!started) return;

        userInteracting = true;

        clearTimeout(interactionTimer);


        // Resume after user stops interacting

        interactionTimer = setTimeout(() => {

            userInteracting = false;

        }, 1200);

    }


    // Touch

    window.addEventListener(
        "touchstart",
        pauseForUser,
        { passive: true }
    );


    window.addEventListener(
        "touchmove",
        pauseForUser,
        { passive: true }
    );


    // Mouse / trackpad

    window.addEventListener(
        "wheel",
        pauseForUser,
        { passive: true }
    );


});
