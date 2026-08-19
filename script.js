document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;
    let autoScrolling = false;
    let animationFrame = null;
    let resumeTimer = null;
    let userInteracting = false;

    // --------------------------------
    // HIDE LOADER
    // --------------------------------

    setTimeout(() => {

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);

        }

    }, 1800);


    // --------------------------------
    // AUTO SCROLL
    // --------------------------------

    function autoScroll() {

        if (!autoScrolling) {
            return;
        }

        if (!userInteracting) {

            const current = window.scrollY;

            const maximum =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (current >= maximum - 2) {

                autoScrolling = false;
                return;

            }

            window.scrollBy(0, 1);

        }

        animationFrame = requestAnimationFrame(autoScroll);

    }


    // --------------------------------
    // START THE JOURNEY
    // --------------------------------

    function startJourney() {

        if (started) return;

        started = true;

        waxButton.classList.add("opened");

        autoScrolling = true;

        cancelAnimationFrame(animationFrame);

        animationFrame = requestAnimationFrame(autoScroll);

    }


    // --------------------------------
    // WAX SEAL
    // --------------------------------

    if (waxButton) {

        waxButton.addEventListener("click", startJourney);

        waxButton.addEventListener("touchend", startJourney);

    }


    // --------------------------------
    // USER TOUCH / SWIPE
    // --------------------------------

    function userStartedInteracting() {

        if (!started) return;

        userInteracting = true;

        clearTimeout(resumeTimer);

    }


    function userStoppedInteracting() {

        if (!started) return;

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(() => {

            userInteracting = false;

        }, 1000);

    }


    // Touch
    window.addEventListener(
        "touchstart",
        userStartedInteracting,
        { passive: true }
    );

    window.addEventListener(
        "touchend",
        userStoppedInteracting,
        { passive: true }
    );

    // Mouse wheel / trackpad
    window.addEventListener(
        "wheel",
        userStartedInteracting,
        { passive: true }
    );

    window.addEventListener(
        "wheel",
        userStoppedInteracting,
        { passive: true }
    );

});
