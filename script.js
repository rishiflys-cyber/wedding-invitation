document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let animationFrame = null;
    let resumeTimer = null;
    let startingGesture = false;

    // -----------------------------
    // HIDE LOADER
    // -----------------------------

    setTimeout(() => {

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);

        }

    }, 1800);


    // -----------------------------
    // AUTO SCROLL
    // -----------------------------

    function autoScroll() {

        if (!autoScrolling) return;

        if (!userInteracting) {

            const currentPosition = window.scrollY;

            const maximumPosition =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (currentPosition >= maximumPosition) {

                autoScrolling = false;
                return;

            }

            // Slow cinematic movement
            window.scrollTo(
                0,
                currentPosition + 0.8
            );

        }

        animationFrame = requestAnimationFrame(autoScroll);

    }


    // -----------------------------
    // START JOURNEY
    // -----------------------------

    function startJourney(event) {

        if (event) {
            event.preventDefault();
        }

        if (started) return;

        started = true;

        // Ignore the touch that opened the invitation
        startingGesture = true;
        userInteracting = false;

        if (waxButton) {
            waxButton.classList.add("opened");
        }

        autoScrolling = true;

        cancelAnimationFrame(animationFrame);

        animationFrame = requestAnimationFrame(autoScroll);

        // After the opening gesture is finished,
        // normal touch interaction becomes active again.
        setTimeout(() => {
            startingGesture = false;
        }, 700);

    }


    // -----------------------------
    // WAX SEAL
    // -----------------------------

    if (waxButton) {

        waxButton.addEventListener(
            "click",
            startJourney
        );

        waxButton.addEventListener(
            "touchend",
            startJourney,
            { passive: false }
        );

    }


    // -----------------------------
    // PHONE TOUCH CONTROL
    // -----------------------------

    window.addEventListener(
        "touchstart",
        () => {

            if (!started || startingGesture) return;

            userInteracting = true;

            clearTimeout(resumeTimer);

        },
        { passive: true }
    );


    window.addEventListener(
        "touchend",
        () => {

            if (!started || startingGesture) return;

            clearTimeout(resumeTimer);

            // Resume one second after
            // the guest releases the screen.
            resumeTimer = setTimeout(() => {

                userInteracting = false;

            }, 1000);

        },
        { passive: true }
    );


    // -----------------------------
    // LAPTOP / MOUSE CONTROL
    // -----------------------------

    window.addEventListener(
        "wheel",
        () => {

            if (!started) return;

            userInteracting = true;

            clearTimeout(resumeTimer);

            resumeTimer = setTimeout(() => {

                userInteracting = false;

            }, 1000);

        },
        { passive: true }
    );

});
