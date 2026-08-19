document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let animationFrame = null;
    let resumeTimer = null;


    // =====================================
    // HIDE LOADER
    // =====================================

    setTimeout(() => {

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);

        }

    }, 1800);


    // =====================================
    // AUTO SCROLL
    // =====================================

    function autoScroll() {

        if (!autoScrolling) return;

        if (!userInteracting) {

            const currentPosition = window.scrollY;

            const maxPosition =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (currentPosition >= maxPosition - 5) {

                autoScrolling = false;
                return;

            }

            window.scrollBy(0, 1.2);

        }

        animationFrame = requestAnimationFrame(autoScroll);

    }


    // =====================================
    // START THE INVITATION
    // =====================================

    function startInvitation() {

        if (started) return;

        started = true;

        // Make the seal react
        waxButton.classList.add("opened");

        // Start scrolling
        autoScrolling = true;

        cancelAnimationFrame(animationFrame);

        animationFrame =
            requestAnimationFrame(autoScroll);

    }


    // =====================================
    // WAX SEAL
    // =====================================

    if (waxButton) {

        waxButton.addEventListener(
            "click",
            startInvitation
        );

        waxButton.addEventListener(
            "touchend",
            (event) => {

                event.preventDefault();

                startInvitation();

            },
            { passive: false }
        );

    }


    // =====================================
    // USER MANUAL TOUCH
    // =====================================

    function userStartedTouch() {

        if (!started) return;

        userInteracting = true;

        clearTimeout(resumeTimer);

    }


    function userStoppedTouch() {

        if (!started) return;

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(() => {

            userInteracting = false;

        }, 800);

    }


    window.addEventListener(
        "touchstart",
        userStartedTouch,
        { passive: true }
    );


    window.addEventListener(
        "touchend",
        userStoppedTouch,
        { passive: true }
    );


    window.addEventListener(
        "wheel",
        userStartedTouch,
        { passive: true }
    );


    window.addEventListener(
        "wheel",
        userStoppedTouch,
        { passive: true }
    );

});
