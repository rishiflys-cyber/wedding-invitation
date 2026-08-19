document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let resumeTimer = null;

    // =========================
    // HIDE LOADER AUTOMATICALLY
    // =========================

    setTimeout(() => {

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);

        }

    }, 1800);


    // =========================
    // AUTO SCROLL
    // =========================

    function autoScroll() {

        if (!autoScrolling) return;

        if (!userInteracting) {

            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;

            if (window.scrollY >= maxScroll - 2) {

                autoScrolling = false;
                return;

            }

            window.scrollBy(0, 0.7);

        }

        requestAnimationFrame(autoScroll);

    }


    // =========================
    // TOUCH TO BEGIN
    // =========================

    if (waxButton) {

        waxButton.addEventListener("click", () => {

            if (started) return;

            started = true;

            waxButton.classList.add("opened");

            autoScrolling = true;

            requestAnimationFrame(autoScroll);

        });

    }


    // =========================
    // USER TOUCH = PAUSE
    // =========================

    function userTouch() {

        if (!started) return;

        userInteracting = true;

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(() => {

            userInteracting = false;

        }, 1000);

    }


    window.addEventListener(
        "touchstart",
        userTouch,
        { passive: true }
    );

    window.addEventListener(
        "touchmove",
        userTouch,
        { passive: true }
    );

    window.addEventListener(
        "wheel",
        userTouch,
        { passive: true }
    );

});
