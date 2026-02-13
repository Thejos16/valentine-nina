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

let noClickCount = 0;
let noTextTimeout = null;
const originalMainText = 'He Nina Lekkerding';
const originalSubtitle = 'Wil je mijn valentijn zijn?';

const noTexts = [
    'Ik proef sfeer... 🤔',
    'Heb je de lenzen niet in? 🤓',
    'Dit is nog gemener dan ribben prikken 😤',
    'Hou je nog wel van me? 🥺',
    'Het is duidelijk.... 😢',
];

function setupButtons() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    yesBtn.addEventListener('click', handleYes);

    // Nee button escapes!
    noBtn.addEventListener('mouseover', () => handleNo(noBtn));
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleNo(noBtn);
    }, { passive: false });
}

function handleNo(btn) {
    noClickCount++;

    const yesBtn = document.getElementById('yes-btn');
    const yesRect = yesBtn.getBoundingClientRect();
    const textEl = document.getElementById('valentine-text');
    const textRect = textEl.getBoundingClientRect();
    const mainTextEl = textEl.querySelector('.main-text');
    const subtitleEl = textEl.querySelector('.subtitle');

    // Change the text for 3 seconds
    if (noClickCount <= noTexts.length) {
        clearTimeout(noTextTimeout);
        mainTextEl.textContent = noTexts[noClickCount - 1];
        subtitleEl.textContent = '';

        noTextTimeout = setTimeout(() => {
            mainTextEl.textContent = originalMainText;
            subtitleEl.textContent = originalSubtitle;
        }, 3000);
    }

    // Pin at current position on first escape
    if (!btn.classList.contains('escaped')) {
        const rect = btn.getBoundingClientRect();
        btn.style.left = rect.left + 'px';
        btn.style.top = rect.top + 'px';
        btn.classList.add('escaped');
        btn.offsetTop; // force reflow
    }

    const gap = 15;
    let newX, newY;

    switch (noClickCount) {
        case 1:
            // Links van de Ja knop
            newX = yesRect.left - btn.offsetWidth - gap;
            newY = yesRect.top + (yesRect.height - btn.offsetHeight) / 2;
            break;
        case 2:
            // Boven de Ja knop
            newX = yesRect.left + (yesRect.width - btn.offsetWidth) / 2;
            newY = yesRect.top - btn.offsetHeight - gap;
            break;
        case 3:
            // Onder de Ja knop
            newX = yesRect.left + (yesRect.width - btn.offsetWidth) / 2;
            newY = yesRect.bottom + gap;
            break;
        case 4:
            // Boven de tekst
            newX = textRect.left + (textRect.width - btn.offsetWidth) / 2;
            newY = textRect.top - btn.offsetHeight - gap;
            break;
        default:
            // Klik 5: verdwijnen
            btn.style.transition = 'opacity 0.4s ease';
            btn.style.opacity = '0';
            setTimeout(() => btn.style.display = 'none', 400);
            return;
    }

    // Houd binnen scherm
    newX = Math.max(10, Math.min(newX, window.innerWidth - btn.offsetWidth - 10));
    newY = Math.max(10, Math.min(newY, window.innerHeight - btn.offsetHeight - 10));

    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
}

function handleYes() {
    const valentineContent = document.getElementById('valentine-content');
    const kissOverlay = document.getElementById('kiss-overlay');

    // Fade out valentine content
    valentineContent.style.transition = 'opacity 0.6s ease';
    valentineContent.style.opacity = '0';

    setTimeout(() => {
        valentineContent.style.display = 'none';

        // Start kiss animation
        kissOverlay.classList.add('active');

        // After photos meet (2.5s) + kiss emoji (0.6s) + pause (1s) = ~4s -> show success
        setTimeout(() => {
            kissOverlay.style.transition = 'opacity 0.8s ease';
            kissOverlay.style.opacity = '0';

            setTimeout(() => {
                kissOverlay.style.display = 'none';
                document.getElementById('success-screen').classList.add('show');
                createConfetti();
            }, 800);
        }, 3800);
    }, 600);
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
