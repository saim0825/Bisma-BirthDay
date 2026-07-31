/* ==========================================================================
   1. ENVELOPE OPEN & INITIALIZATION
   ========================================================================== */
const envelopeOverlay = document.getElementById('envelopeOverlay');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelope = envelopeWrapper.querySelector('.envelope');
const bgMusic = document.getElementById('bgMusic');

envelopeWrapper.addEventListener('click', () => {
  envelope.classList.add('open');

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }

  setTimeout(() => {
    envelopeOverlay.classList.add('hide');
    typeWriter();
    triggerConfettiBurst(150);
  }, 1200);
});

/* ==========================================================================
   2. TYPING EFFECT
   ========================================================================== */
const messageText = "Wishing you a day filled with love, laughter, and endless happiness. May all your dreams come true this year! ✨🎂";
const typingSpeed = 45;
let charIndex = 0;

function typeWriter() {
  const typingContainer = document.getElementById("typingText");
  if (charIndex < messageText.length) {
    typingContainer.innerHTML += messageText.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, typingSpeed);
  }
}

/* ==========================================================================
   3. BACKGROUND CANVAS (Stars & Balloons)
   ========================================================================== */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');

let width = bgCanvas.width = window.innerWidth;
let height = bgCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = bgCanvas.width = window.innerWidth;
  height = bgCanvas.height = window.innerHeight;
});

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2;
    this.alpha = Math.random();
    this.speed = Math.random() * 0.02;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
  }
  draw() {
    bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.alpha)})`;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    bgCtx.fill();
  }
}

class Balloon {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.radius = 15 + Math.random() * 15;
    this.speed = 1 + Math.random() * 1.5;
    this.color = `hsl(${Math.random() * 360}, 70%, 75%)`;
    this.swing = Math.random() * 2;
    this.swingSpeed = 0.02;
  }
  update() {
    this.y -= this.speed;
    this.x += Math.sin(this.y * this.swingSpeed) * this.swing;
    if (this.y < -50) this.reset();
  }
  draw() {
    bgCtx.fillStyle = this.color;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    bgCtx.fill();

    bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    bgCtx.beginPath();
    bgCtx.moveTo(this.x, this.y + this.radius);
    bgCtx.lineTo(this.x, this.y + this.radius + 20);
    bgCtx.stroke();
  }
}

const stars = Array.from({ length: 80 }, () => new Star());
const balloons = Array.from({ length: 15 }, () => new Balloon());

function animateBG() {
  bgCtx.clearRect(0, 0, width, height);
  stars.forEach(star => { star.update(); star.draw(); });
  balloons.forEach(balloon => { balloon.update(); balloon.draw(); });
  requestAnimationFrame(animateBG);
}

/* ==========================================================================
   4. CONFETTI SYSTEM
   ========================================================================== */
const confettiCanvas = document.getElementById('confettiCanvas');
const cCtx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiParticles = [];

class Confetti {
  constructor(isBurst = false) {
    this.x = isBurst ? window.innerWidth / 2 : Math.random() * window.innerWidth;
    this.y = isBurst ? window.innerHeight / 2 : -20;
    this.size = Math.random() * 8 + 4;
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    this.vx = isBurst ? (Math.random() - 0.5) * 14 : (Math.random() - 0.5) * 2;
    this.vy = isBurst ? (Math.random() - 0.5) * 14 : Math.random() * 3 + 2;
    this.rotation = Math.random() * 360;
    this.rSpeed = Math.random() * 10 - 5;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rSpeed;
  }
  draw() {
    cCtx.save();
    cCtx.translate(this.x, this.y);
    cCtx.rotate((this.rotation * Math.PI) / 180);
    cCtx.fillStyle = this.color;
    cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    cCtx.restore();
  }
}

function triggerConfettiBurst(count = 100) {
  for (let i = 0; i < count; i++) {
    confettiParticles.push(new Confetti(true));
  }
}

function initContinuousConfetti() {
  for (let i = 0; i < 50; i++) {
    confettiParticles.push(new Confetti(false));
  }
}

function animateConfetti() {
  cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.y > window.innerHeight + 20) {
      confettiParticles[index] = new Confetti(false);
    }
  });
  requestAnimationFrame(animateConfetti);
}

/* ==========================================================================
   5. FIREWORKS SYSTEM
   ========================================================================== */
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fCtx = fireworksCanvas.getContext('2d');
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

let fireworks = [];

class FireworkParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 3 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 6 + 1;
    this.friction = 0.95;
    this.gravity = 0.1;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.015;
  }
  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
  }
  draw() {
    fCtx.save();
    fCtx.globalAlpha = this.alpha;
    fCtx.fillStyle = this.color;
    fCtx.beginPath();
    fCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    fCtx.fill();
    fCtx.restore();
  }
}

function createFirework(x, y) {
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  for (let i = 0; i < 40; i++) {
    fireworks.push(new FireworkParticle(x, y, color));
  }
}

function animateFireworks() {
  fCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworks.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) fireworks.splice(i, 1);
  });
  requestAnimationFrame(animateFireworks);
}

/* ==========================================================================
   6. LIGHTBOX & MODAL SURPRISE CONTROLS
   ========================================================================== */
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = src;
  lightbox.style.display = 'flex';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

// Audio Controls
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');

musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicIcon.textContent = '⏸️';
    musicText.textContent = 'Pause Music';
  } else {
    bgMusic.pause();
    musicIcon.textContent = '🎵';
    musicText.textContent = 'Play Music';
  }
});

// Final Surprise Trigger Pop-Up Modal
const surpriseModal = document.getElementById('surpriseModal');

document.getElementById('surpriseBtn').addEventListener('click', () => {
  triggerConfettiBurst(250);
  
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      createFirework(
        Math.random() * window.innerWidth,
        Math.random() * (window.innerHeight * 0.5)
      );
    }, i * 250);
  }

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = '⏸️';
    musicText.textContent = 'Pause Music';
  }

  surpriseModal.classList.add('active');
});

function closeSurpriseModal() {
  surpriseModal.classList.remove('active');
}

/* ==========================================================================
   7. SCROLL REVEAL & INITIALIZATION
   ========================================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

window.addEventListener('load', () => {
  animateBG();
  initContinuousConfetti();
  animateConfetti();
  animateFireworks();
});