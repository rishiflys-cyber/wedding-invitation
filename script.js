document.addEventListener("DOMContentLoaded", () => {

    // Hide Loader
    const loader = document.getElementById("loader");

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

            }, 700);

        }, 1800);

    }

    // Music Button
    const music = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicButton");

    if (musicBtn && music) {

        let playing = false;

        musicBtn.addEventListener("click", () => {

            if (!playing) {

                music.play().catch(() => {});
                musicBtn.textContent = "❚❚";
                playing = true;

            } else {

                music.pause();
                musicBtn.textContent = "♫";
                playing = false;

            }

        });

    }

});
