document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("loader");
    const waxButton = document.getElementById("waxButton");
    const bgMusic = document.getElementById("bgMusic");
    const envelope = document.getElementById("weddingEnvelope");
    const glitterContainer = document.getElementById("glitterContainer");
    const hero = document.getElementById("hero");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let animationFrame = null;
    let resumeTimer = null;

    function hideLoader() {
        if (!loader) return;
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
        setTimeout(function () { loader.style.display = "none"; }, 800);
    }
    setTimeout(hideLoader, 1800);

    function setupRevealAnimations() {
        const revealElements = document.querySelectorAll(
            ".section-title, .collage-frame, .invitation-card, .detail-card, .timeline-item, .venue-card, .gallery-item, .blessing-text, .footer-card"
        );
        revealElements.forEach(function (element) { element.classList.add("reveal-element"); });
        if (!("IntersectionObserver" in window)) {
            revealElements.forEach(function (element) { element.classList.add("reveal-visible"); });
            return;
        }
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
        revealElements.forEach(function (element) { observer.observe(element); });
    }
    setupRevealAnimations();

    function startMusic() {
        if (!bgMusic) return;
        bgMusic.src = "Ranjha.mp3";
        bgMusic.loop = true;
        bgMusic.preload = "auto";
        bgMusic.volume = 1.0;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (error) {
                console.log("Music could not start:", error);
            });
        }
    }

    function createGlitter() {
        if (!glitterContainer) return;
        glitterContainer.innerHTML = "";
        glitterContainer.classList.add("active");

        const count = 95;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight * 0.48;

        for (let i = 0; i < count; i++) {
            const p = document.createElement("span");
            p.className = Math.random() < 0.2 ? "glitter-particle star" : "glitter-particle";

            const angle = Math.random() * Math.PI * 2;
            const distance = 120 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * 0.55;
            const driftX = Math.cos(angle) * distance;
            const driftY = Math.sin(angle) * distance + 80 + Math.random() * 180;

            p.style.left = centerX + (Math.random() - 0.5) * 28 + "px";
            p.style.top = centerY + (Math.random() - 0.5) * 24 + "px";
            p.style.setProperty("--dx", driftX + "px");
            p.style.setProperty("--dy", driftY + "px");
            p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
            p.style.setProperty("--delay", (Math.random() * 0.28) + "s");
            p.style.setProperty("--duration", (1.55 + Math.random() * 1.1) + "s");
            p.style.setProperty("--size", (2 + Math.random() * 5) + "px");

            if (p.classList.contains("star")) p.textContent = "✦";
            glitterContainer.appendChild(p);
        }

        setTimeout(function () {
            glitterContainer.classList.remove("active");
            glitterContainer.innerHTML = "";
        }, 3300);
    }

    function autoScroll() {
        if (!autoScrolling) return;
        if (!userInteracting) {
            const currentPosition = window.scrollY;
            const maxPosition = document.documentElement.scrollHeight - window.innerHeight;
            if (currentPosition >= maxPosition - 2) {
                autoScrolling = false;
                return;
            }
            window.scrollTo(0, currentPosition + 1);
        }
        animationFrame = requestAnimationFrame(autoScroll);
    }

    function startInvitation() {
        if (started) return;
        started = true;
        document.documentElement.style.scrollBehavior = "auto";

        if (waxButton) {
            waxButton.classList.add("pressed");
            waxButton.disabled = true;
        }

        startMusic();

        // Seal breaks, then envelope opens.
        setTimeout(function () {
            if (envelope) envelope.classList.add("opening");
        }, 220);

        // Glitter erupts exactly as the envelope begins to open.
        setTimeout(function () {
            createGlitter();
        }, 720);

        // Let the opened envelope clear the entire screen before revealing hero.
        setTimeout(function () {
            if (envelope) envelope.classList.add("opened");
            if (hero) hero.classList.add("card-revealed");
        }, 1900);

        // Start the existing invitation journey after the reveal is complete.
        setTimeout(function () {
            autoScrolling = true;
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(autoScroll);
        }, 2350);
    }

    if (waxButton) {
        waxButton.addEventListener("click", function (event) {
            event.preventDefault();
            startInvitation();
        });
        waxButton.addEventListener("touchend", function (event) {
            event.preventDefault();
            startInvitation();
        }, { passive: false });
    }

    function pauseUser() {
        if (!started) return;
        userInteracting = true;
        clearTimeout(resumeTimer);
    }
    function resumeUser() {
        if (!started) return;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () {
            userInteracting = false;
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(autoScroll);
        }, 100);
    }

    window.addEventListener("touchstart", pauseUser, { passive: true });
    window.addEventListener("touchmove", pauseUser, { passive: true });
    window.addEventListener("touchend", resumeUser, { passive: true });
    window.addEventListener("wheel", function () {
        pauseUser();
        resumeUser();
    }, { passive: true });
    window.addEventListener("mousedown", pauseUser);
    window.addEventListener("mouseup", resumeUser);
});
