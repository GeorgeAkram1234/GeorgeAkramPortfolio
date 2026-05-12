/* ===================== LOADER ===================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

/* ===================== CURSOR ===================== */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ===================== PARTICLES ===================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const COLORS = ['#4f46e5','#ec4899','#06b6d4','#f59e0b','#818cf8'];
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function initParticles() {
  particles = [];
  const count = Math.floor((W * H) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
  }
}
initParticles();

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
  });
  // connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = particles[i].color;
        ctx.globalAlpha = (1 - dist / 120) * 0.2;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ===================== SCROLL REVEAL ===================== */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

/* ===================== SKILL BARS ===================== */
const fills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = e.target;
      const w = target.dataset.width;
      target.style.width = w + '%';
      target.classList.add('animate');
      skillObs.unobserve(target);
    }
  });
}, { threshold: 0.4 });
fills.forEach(f => skillObs.observe(f));

/* ===================== MOBILE NAV ===================== */
const navToggle = document.getElementById('navToggle');
const navbar = document.getElementById('navbar');
const navLinksAnchors = document.querySelectorAll('.nav-links a');

function toggleNav() {
  navbar.classList.toggle('open');
  navToggle.classList.toggle('active');

  document.body.classList.toggle(
    'menu-open',
    navbar.classList.contains('open')
  );
}

if (navToggle) {
  navToggle.addEventListener('click', toggleNav);
}

navLinksAnchors.forEach(link => {
  link.addEventListener('click', () => {
    if (navbar.classList.contains('open')) toggleNav();
  });
});

/* ===================== GSAP ANIMATIONS ===================== */
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Hero card image entrance
  const avatarImg = document.querySelector('.card-avatar-img');
  if (avatarImg) {
    gsap.from(avatarImg, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.4,
      ease: 'power3.out',
      delay: 2.5
    });
  }

  // Parallax on hero card wrapper
  const heroWrapper = document.querySelector('.hero-card-wrapper');
  if (heroWrapper) {
    gsap.to(heroWrapper, {
      y: -30,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

}