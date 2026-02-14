document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".story-section");
    const heartsContainer = document.querySelector(".hearts-container");
    const audio = document.getElementById("background-sound");
    const valentineBtnContainer = document.querySelector(".valentine-container");
    const starsBackground = document.querySelector(".stars-background");
    let currentSectionIndex = 0;

    // Play music & fullscreen on first click
    document.addEventListener("click", () => {
        audio.play().catch(() => {});
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    }, { once: true });

    // Floating hearts
    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.textContent = "💖";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = Math.random() * 20 + 15 + "px";
        heart.style.animationDuration = Math.random() * 3 + 5 + "s";
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
    }
    setInterval(createHeart, 500);

    // Typewriter function
    function typeWriter(element, callback) {
        if (!element || element.dataset.typed === "true") return;
        const text = element.getAttribute("data-text");
        if (!text) return;

        element.dataset.typed = "true";
        element.innerHTML = "";

        let index = 0;
        function type() {
            if (index < text.length) {
                element.innerHTML += text[index];
                index++;
                setTimeout(type, 40);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Heart explosion
    function heartExplosion(count = 50) {
        const container = document.createElement("div");
        container.classList.add("explosion-container");
        document.body.appendChild(container);

        for (let i = 0; i < count; i++) {
            const heart = document.createElement("div");
            heart.classList.add("explosion-heart");
            heart.textContent = "💖";

            const x = (Math.random() - 0.5) * 800 + "px";
            const y = (Math.random() - 0.5) * 800 + "px";

            heart.style.setProperty("--x", x);
            heart.style.setProperty("--y", y);

            container.appendChild(heart);
        }

        setTimeout(() => container.remove(), 2500);
    }

    // Music volume crescendo
    function increaseMusicVolume(audio, targetVolume = 1, duration = 3000) {
        const step = 0.02;
        const interval = duration / (targetVolume / step);
        let volume = audio.volume;
        const fade = setInterval(() => {
            volume += step;
            if (volume >= targetVolume) {
                volume = targetVolume;
                clearInterval(fade);
            }
            audio.volume = volume;
        }, interval);
    }

    // Fade in stars
    function fadeInStars() {
        if (starsBackground) starsBackground.style.opacity = 1;
    }

    // Controlled story flow
    function startStory() {
        if (currentSectionIndex >= sections.length) return;

        const section = sections[currentSectionIndex];
        section.classList.add("revealed");
        const textElement = section.querySelector(".typewriter");

        typeWriter(textElement, () => {
            if (currentSectionIndex > 0) {
                sections[currentSectionIndex - 1].classList.add("faded");
            }

            currentSectionIndex++;

            if (currentSectionIndex < sections.length) {
                sections[currentSectionIndex].scrollIntoView({ behavior: "smooth" });
                setTimeout(startStory, 500);
            } else {
                //last section fades
                section.classList.add("faded")
                // Grand finale after fade
                setTimeout(() =>{
                    valentineBtnContainer.style.opacity = 1;
                    document.getElementById("valentine-btn").classList.add("pulse-sparkle");
                    fadeInStars
                    increaseMusicVolume(audio, 1, 3000);
                    setTimeout(() => heartExplosion(80), 1000);
                }, 1800);
                
            }
        });
    }

    startStory();
});

// WhatsApp button click
const valentineBtn = document.getElementById("valentine-btn");
valentineBtn.addEventListener("click", () => {
    const phoneNumber = "1234567890"; // Replace with creator's WhatsApp number (country code + number)
    const message = encodeURIComponent("Hello! I just saw your Valentine's page 💖 and loved it!");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank");
});
