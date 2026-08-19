document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;

    // Hide the loader
    function hideLoader() {

        if (!loader) return;

        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 800);

    }

    // Start the invitation
    if (waxButton) {

        waxButton.addEventListener("click", () => {

            if (started) return;

            started = true;

            hideLoader();

            waxButton.classList.add("opened");

        });

    }

});
