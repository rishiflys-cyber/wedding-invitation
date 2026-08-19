document.addEventListener("DOMContentLoaded", function () {

    const bgMusic = document.getElementById("bgMusic");
    const hero = document.getElementById("hero");

    let started = false;
    let autoScrolling = false;
    let userInteracting = false;
    let animationFrame = null;
    let resumeTimer = null;

    /* ----------------------------------------------------------
       HARD HIDE: nothing from the invitation is allowed to show
       before the envelope has completed its reveal.
    ---------------------------------------------------------- */
    document.body.classList.remove("opening-complete");
    document.documentElement.style.scrollBehavior = "auto";

    const oldCard = document.getElementById("weddingCard");
    if (oldCard) oldCard.style.display = "none";

    const oldLoader = document.getElementById("loader");
    if (oldLoader) oldLoader.style.display = "none";

    /* ----------------------------------------------------------
       BUILD A CLEAN ENVELOPE FROM ZERO.
       No dependency on the previous envelope markup/CSS.
    ---------------------------------------------------------- */
    const overlay = document.createElement("div");
    overlay.id = "envelopeV4";
    overlay.setAttribute("aria-label", "Wedding invitation envelope");
    overlay.innerHTML = `
        <div class="ev4-stage">
            <div class="ev4-paper-grain"></div>
            <div class="ev4-border"></div>

            <div class="ev4-envelope">
                <div class="ev4-letter" aria-hidden="true"><div class="ev4-letter-content"><span class="small">Together with our families</span><div class="names">Rishabh</div><div class="and">&amp;</div><div class="names">Ananya</div></div></div>
                <div class="ev4-left" aria-hidden="true"></div>
                <div class="ev4-right" aria-hidden="true"></div>
                <div class="ev4-bottom" aria-hidden="true"></div>
                <div class="ev4-top" aria-hidden="true"></div>
                <span class="ev4-crease one" aria-hidden="true"></span>
                <span class="ev4-crease two" aria-hidden="true"></span>
                <span class="ev4-crease three" aria-hidden="true"></span>
            </div>

            <div class="ev4-gold-haze" aria-hidden="true"></div>
            <div class="ev4-flash" aria-hidden="true"></div>
            <div class="ev4-particles" aria-hidden="true"></div>

            <button class="ev4-seal-button" type="button" aria-label="Open invitation">
                <span class="ev4-seal-shadow"></span>
                <span class="ev4-wax"><span class="ev4-ra">RA</span></span>
            </button>
        </div>
    `;
    document.body.appendChild(overlay);

    const seal = overlay.querySelector(".ev4-seal-button");
    const particles = overlay.querySelector(".ev4-particles");

    /* ----------------------------------------------------------
       GOLD PARTICLES — generated only once, at the opening.
    ---------------------------------------------------------- */
    function burstGold() {
        if (!particles) return;
        particles.innerHTML = "";

        const count = window.innerWidth < 769 ? 62 : 90;
        for (let i = 0; i < count; i++) {
            const p = document.createElement("i");
            const angle = Math.random() * Math.PI * 2;
            const distance = (window.innerWidth < 769 ? 120 : 180) + Math.random() * (window.innerWidth < 769 ? 170 : 260);
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance * .82;
            const size = 2 + Math.random() * 5;
            const star = Math.random() < .22;
            p.style.setProperty("--dx", dx + "px");
            p.style.setProperty("--dy", dy + "px");
            p.style.setProperty("--s", (0.7 + Math.random() * 1.8).toFixed(2));
            p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
            p.style.setProperty("--d", (Math.random() * .34) + "s");
            p.style.width = (star ? size * 2.2 : size) + "px";
            p.style.height = (star ? size * 2.2 : size) + "px";
            p.style.position = "absolute";
            p.style.left = "50%";
            p.style.top = "58%";
            p.style.borderRadius = star ? "0" : "50%";
            p.style.background = "#f2d797";
            p.style.boxShadow = "0 0 9px rgba(242,215,151,.9)";
            p.style.clipPath = star ? "polygon(50% 0%,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0% 50%,39% 39%)" : "none";
            particles.appendChild(p);
        }

        setTimeout(function () {
            particles.innerHTML = "";
        }, 2600);
    }

    /* ----------------------------------------------------------
       MUSIC — starts from the same user gesture as the seal.
    ---------------------------------------------------------- */
    function startMusic() {
        if (!bgMusic) return;
        bgMusic.src = "Ranjha.mp3";
        bgMusic.loop = true;
        bgMusic.preload = "auto";
        bgMusic.volume = 1;
        const promise = bgMusic.play();
        if (promise && promise.catch) promise.catch(function () {});
    }

    /* ----------------------------------------------------------
       OPEN SEQUENCE
    ---------------------------------------------------------- */
    function openInvitation() {
        if (started) return;
        started = true;

        startMusic();
        overlay.classList.add("is-opening");
        burstGold();

        /* Do NOT reveal names until the physical envelope has left. */
        setTimeout(function () {
            overlay.classList.add("is-done");
        }, 2050);

        setTimeout(function () {
            overlay.remove();
            document.body.classList.add("opening-complete");
            if (hero) hero.scrollIntoView({ block: "start", behavior: "auto" });
        }, 2900);

        setTimeout(function () {
            startAutoScroll();
        }, 3650);
    }

    /* Pointer events are the primary path on iPhone/Android/desktop. */
    seal.addEventListener("pointerup", function (e) {
        e.preventDefault();
        openInvitation();
    });

    seal.addEventListener("click", function (e) {
        e.preventDefault();
        openInvitation();
    });

    /* ----------------------------------------------------------
       REVEALS FOR THE REST OF THE INVITATION
    ---------------------------------------------------------- */
    function setupRevealAnimations() {
        const elements = document.querySelectorAll(
            ".section-title,.collage-frame,.invitation-card,.detail-card,.timeline-item,.venue-card,.gallery-item,.blessing-text,.footer-card"
        );
        elements.forEach(function (el) { el.classList.add("reveal-element"); });

        if (!("IntersectionObserver" in window)) {
            elements.forEach(function (el) { el.classList.add("reveal-visible"); });
            return;
        }
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold:.12, rootMargin:"0px 0px -8% 0px" });
        elements.forEach(function (el) { observer.observe(el); });
    }
    setupRevealAnimations();

    /* ----------------------------------------------------------
       AUTO SCROLL — starts only after the opening sequence.
    ---------------------------------------------------------- */
    function startAutoScroll() {
        if (!started) return;
        autoScrolling = true;
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(autoScroll);
    }

    function autoScroll() {
        if (!autoScrolling) return;
        if (!userInteracting) {
            const current = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (current >= max - 2) {
                autoScrolling = false;
                return;
            }
            window.scrollTo(0, current + 1);
        }
        animationFrame = requestAnimationFrame(autoScroll);
    }

    function pauseAndResume() {
        if (!started) return;
        userInteracting = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () {
            userInteracting = false;
            startAutoScroll();
        }, 450);
    }

    window.addEventListener("touchstart", pauseAndResume, { passive:true });
    window.addEventListener("touchmove", pauseAndResume, { passive:true });
    window.addEventListener("wheel", pauseAndResume, { passive:true });
    window.addEventListener("mousedown", pauseAndResume);
    window.addEventListener("mouseup", function () {
        if (!started) return;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () {
            userInteracting = false;
            startAutoScroll();
        }, 450);
    });

});
