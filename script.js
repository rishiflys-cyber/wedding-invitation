document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let animationFrame;

    // -----------------------------
    // Hide loader
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

        if (userInteracting) {
            animationFrame = requestAnimationFrame(autoScroll);
            return;
        }

        const currentPosition = window.scrollY;
        const maxPosition =
            document.documentElement.scrollHeight - window.innerHeight;

        if (currentPosition >= maxPosition - 2) {

            autoScrolling = false;
            return;

        }

        window.scrollBy(0, 0.7);

        animationFrame = requestAnimationFrame(autoScroll);

    }


    // -----------------------------
    // START INVITATION
    // -----------------------------

    if (waxButton) {

        waxButton.addEventListener("click", () => {

            if (started) return;

            started = true;

            // Visual feedback
            waxButton.classList.add("opened");

            // Start automatic scrolling
            autoScrolling = true;

            cancelAnimationFrame(animationFrame);

            animationFrame = requestAnimationFrame(autoScroll);

        });

    }


    // -----------------------------
    // USER TOUCH / MANUAL CONTROL
    // -----------------------------

    let interactionTimer;

    function pauseForUser() {

        if (!started) return;

        userInteracting = true;

        clearTimeout(interactionTimer);

        interactionTimer = setTimeout(() => {

            userInteracting = false;

        }, 1200);

    }

    window.addEventListener("touchstart", pauseForUser, { passive: true });

    window.addEventListener("touchmove", pauseForUser, { passive: true });

    window.addEventListener("wheel", pauseForUser, { passive: true });

    window.addEventListener("scroll", () => {

        if (!started) return;

        pauseForUser();

    }, { passive: true });

});
