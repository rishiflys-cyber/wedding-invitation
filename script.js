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
let autoScrolling = false;
let pauseScrolling = false;

function startAutoScroll() {

    if (autoScrolling) return;

    autoScrolling = true;

    const speed = 0.7;

    function animate() {

        if (!autoScrolling) return;

        if (!pauseScrolling) {

            window.scrollBy(0, speed);

        }

        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {

            autoScrolling = false;
            return;

        }

        requestAnimationFrame(animate);

    }

    animate();

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
