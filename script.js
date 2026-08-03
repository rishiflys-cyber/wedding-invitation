document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");
    const music = document.getElementById("bgMusic");

    let started = false;

    function hideLoader() {
        if (!loader) return;

        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 700);
    }

    if (waxButton) {

        waxButton.addEventListener("click", () => {

            if (started) return;

            started = true;

            music.play().catch(() => {});

            hideLoader();

            startAutoScroll();

        });

    }

});
