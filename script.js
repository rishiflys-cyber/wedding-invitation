document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");

    let started = false;

    // Let the page finish loading first
    setTimeout(() => {

        if (loader) {
            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);
        }

    }, 1800);


    // Touch to Begin
    if (waxButton) {

        waxButton.addEventListener("click", () => {

            if (started) return;

            started = true;

            waxButton.classList.add("opened");

        });

    }

});
