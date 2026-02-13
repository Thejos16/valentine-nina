/* ============================================
   VALENTINE WEBSITE - SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCaptcha();
});

/* ------- CAPTCHA ------- */

let selectedCount = 0;
const TOTAL_IMAGES = 9;

function initCaptcha() {
    const grid = document.getElementById('captcha-grid');

    for (let i = 1; i <= TOTAL_IMAGES; i++) {
        const cell = document.createElement('div');
        cell.className = 'captcha-cell';

        const img = document.createElement('img');
        img.src = `images/${i}.jpg`;
        img.alt = `Foto ${i}`;
        img.draggable = false;
        img.onerror = () => cell.classList.add('no-image');

        const overlay = document.createElement('div');
        overlay.className = 'select-overlay';
        overlay.innerHTML = '<div class="checkmark-icon">✓</div>';

        cell.appendChild(img);
        cell.appendChild(overlay);

        cell.addEventListener('click', () => toggleCell(cell));

        grid.appendChild(cell);
    }

    document.getElementById('verify-btn').addEventListener('click', handleVerify);
}

function toggleCell(cell) {
    cell.classList.toggle('selected');
    selectedCount = document.querySelectorAll('.captcha-cell.selected').length;
}

function handleVerify() {
    const errorEl = document.getElementById('captcha-error');

    if (selectedCount < TOTAL_IMAGES) {
        // Show error
        errorEl.classList.add('show');
        // Shake animation
        const card = document.querySelector('.captcha-card');
        card.style.animation = 'shake 0.4s ease';
        card.addEventListener('animationend', () => {
            card.style.animation = '';
        }, { once: true });

        setTimeout(() => errorEl.classList.remove('show'), 2500);
        return;
    }

    // All selected - start verification animation
    const overlay = document.getElementById('verify-overlay');
    const spinner = document.getElementById('verify-spinner');
    const success = document.getElementById('verify-success');

    overlay.classList.add('active');

    // Spinner for 1.5s, then checkmark
    setTimeout(() => {
        spinner.classList.add('hidden');
        success.classList.add('show');
    }, 1500);

    // Transition to valentine screen after 2.5s
    setTimeout(() => {
        transitionToValentine();
    }, 2800);
}

// Shake animation (injected dynamically)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

/* ------- TRANSITION ------- */

function transitionToValentine() {
    const captchaScreen = document.getElementById('captcha-screen');
    const valentineScreen = document.getElementById('valentine-screen');

    // Fade out captcha
    captchaScreen.style.transition = 'opacity 0.8s ease';
    captchaScreen.style.opacity = '0';

    setTimeout(() => {
        captchaScreen.classList.remove('active');
        captchaScreen.style.display = 'none';
        valentineScreen.classList.add('active');

        // Change page title and favicon
        document.title = '💕 Voor Nina 💕';
        document.querySelector('link[rel="icon"]').href =
            "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💕</text></svg>";

        // Start animations
        startValentineAnimations();
    }, 800);
}

/* ------- VALENTINE ------- */

function startValentineAnimations() {
    const content = document.getElementById('valentine-content');
    const bouquet = document.getElementById('bouquet');
    const text = document.getElementById('valentine-text');
    const buttons = document.getElementById('buttons');

    // Start floating hearts
    startFloatingHearts();

    // Show content container
    setTimeout(() => content.classList.add('show'), 100);

    // Show bouquet (roses animate in via CSS transition-delay)
    setTimeout(() => bouquet.classList.add('show'), 300);

    // Show text
    setTimeout(() => text.classList.add('show'), 800);

    // Show buttons
    setTimeout(() => buttons.classList.add('show'), 800);

    // Setup button interactions
    setupButtons();
}

function startFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '🩷', '♥️'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        const size = Math.random() * 20 + 12;
        const left = Math.random() * 100;
        const duration = Math.random() * 4 + 5;
        const delay = Math.random() * 2;
        const rotation = (Math.random() - 0.5) * 90;

        heart.style.setProperty('--size', size + 'px');
        heart.style.setProperty('--left', left + '%');
        heart.style.setProperty('--duration', duration + 's');
        heart.style.setProperty('--delay', delay + 's');
        heart.style.setProperty('--rotation', rotation + 'deg');

        container.appendChild(heart);

        // Clean up after animation
        setTimeout(() => heart.remove(), (duration + delay) * 1000 + 500);
    }

    // Create initial batch
    for (let i = 0; i < 12; i++) {
        createHeart();
    }

    // Keep creating hearts
    setInterval(() => {
        if (container.children.length < 20) {
            createHeart();
        }
    }, 800);
}

/* ------- BUTTONS ------- */

let noEscapeCount = 0;
const NEAR_JUMPS = 4; // How many times it stays near the text before flying away

function setupButtons() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    yesBtn.addEventListener('click', handleYes);

    // Nee button escapes!
    noBtn.addEventListener('mouseover', () => moveNoButton(noBtn));
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton(noBtn);
    }, { passive: false });
}

function moveNoButton(btn) {
    noEscapeCount++;

    // On first escape: pin the button at its current visual position as fixed,
    // so the next position change can be animated smoothly.
    if (!btn.classList.contains('escaped')) {
        const rect = btn.getBoundingClientRect();
        btn.style.left = rect.left + 'px';
        btn.style.top = rect.top + 'px';
        btn.classList.add('escaped');
        // Force a reflow so the browser registers the current position
        btn.offsetTop;
    }

    if (noEscapeCount <= NEAR_JUMPS) {
        // Jump near the text/buttons area (center of screen)
        moveNearText(btn);
    } else {
        // Fly to random spots across the whole screen
        moveRandom(btn);
    }
}

function moveNearText(btn) {
    const textEl = document.getElementById('valentine-text');
    const textRect = textEl.getBoundingClientRect();

    // Define a zone around the text area
    const centerX = textRect.left + textRect.width / 2;
    const centerY = textRect.top + textRect.height / 2;
    const spreadX = 140;
    const spreadY = 100;

    // Random position within that zone, but avoid landing exactly where it was
    const offsetX = (Math.random() - 0.5) * 2 * spreadX;
    const offsetY = (Math.random() - 0.5) * 2 * spreadY;

    let newX = centerX + offsetX - btn.offsetWidth / 2;
    let newY = centerY + offsetY - btn.offsetHeight / 2;

    // Keep within screen bounds
    newX = Math.max(10, Math.min(newX, window.innerWidth - btn.offsetWidth - 10));
    newY = Math.max(10, Math.min(newY, window.innerHeight - btn.offsetHeight - 10));

    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
}

function moveRandom(btn) {
    const padding = 20;
    const maxX = window.innerWidth - btn.offsetWidth - padding;
    const maxY = window.innerHeight - btn.offsetHeight - padding;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
}

function handleYes() {
    const successScreen = document.getElementById('success-screen');
    const valentineContent = document.getElementById('valentine-content');

    // Hide valentine content
    valentineContent.style.opacity = '0';

    setTimeout(() => {
        valentineContent.style.display = 'none';
        successScreen.classList.add('show');
        createConfetti();
    }, 400);
}

/* ------- CONFETTI ------- */

function createConfetti() {
    const container = document.getElementById('confetti-container');
    const items = ['❤️', '💕', '🎉', '✨', '💖', '🌹', '🩷', '💗', '🥳', '🎊'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = items[Math.floor(Math.random() * items.length)];

        const left = Math.random() * 100;
        const size = Math.random() * 1.5 + 0.8;
        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 1.5;
        const rotation = Math.random() * 1080;

        confetti.style.setProperty('--left', left + '%');
        confetti.style.setProperty('--size', size + 'rem');
        confetti.style.setProperty('--duration', duration + 's');
        confetti.style.setProperty('--delay', delay + 's');
        confetti.style.setProperty('--rotation', rotation + 'deg');

        container.appendChild(confetti);
    }
}
