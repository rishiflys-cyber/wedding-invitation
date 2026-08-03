document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("loader");

    setTimeout(function () {

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(function () {

                loader.style.display = "none";

            }, 700);

        }

    }, 2000);

});
