// ─── CANVAS PARTICLES ───
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], lines = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Particles
for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * 2000,
    y: Math.random() * 1500,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.6 + 0.1,
    color: Math.random() > 0.7 ? '#ff00aa' : '#00f5ff'
  });
}

// Floating geometric shapes
const shapes = [];
for (let i = 0; i < 8; i++) {
  shapes.push({
    x: Math.random() * 2000,
    y: Math.random() * 1500,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 60 + 20,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.005,
    alpha: Math.random() * 0.05 + 0.02,
    sides: Math.random() > 0.5 ? 6 : 4,
    color: Math.random() > 0.5 ? '#00f5ff' : '#ff00aa'
  });
}

function drawPolygon(cx, cy, sides, size, rotation, alpha, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const x = Math.cos(angle) * size;
    const y = Math.sin(angle) * size;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

let frame = 0;
function animate() {
  ctx.clearRect(0, 0, W, H);

  // Nebula glow
  const grd = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.5);
  grd.addColorStop(0, 'rgba(0,245,255,0.025)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  const grd2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, W * 0.4);
  grd2.addColorStop(0, 'rgba(255,0,170,0.02)');
  grd2.addColorStop(1, 'transparent');
  ctx.fillStyle = grd2;
  ctx.fillRect(0, 0, W, H);

  // Shapes
  shapes.forEach(s => {
    s.x += s.vx; s.y += s.vy; s.rotation += s.rotSpeed;
    if (s.x < -100) s.x = W + 100;
    if (s.x > W + 100) s.x = -100;
    if (s.y < -100) s.y = H + 100;
    if (s.y > H + 100) s.y = -100;
    drawPolygon(s.x, s.y, s.sides, s.size, s.rotation, s.alpha, s.color);
  });

  // Particles
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });

  // Data stream lines
  frame++;
  if (frame % 3 === 0 && lines.length < 6) {
    lines.push({
      x: Math.random() * W,
      y: -20,
      speed: Math.random() * 2 + 1,
      len: Math.random() * 100 + 50,
      alpha: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.5 ? '#00f5ff' : '#ff00aa'
    });
  }
  lines = lines.filter(l => l.y < H + 150);
  lines.forEach(l => {
    l.y += l.speed;
    const grad = ctx.createLinearGradient(l.x, l.y - l.len, l.x, l.y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, l.color);
    ctx.globalAlpha = l.alpha;
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(l.x, l.y - l.len);
    ctx.lineTo(l.x, l.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}
animate();

// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

// ─── SKILL BARS ───
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.skill-bar');
      if (bar) {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => bar.style.width = w, 200);
      }
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => barObserver.observe(c));

// ─── HAMBURGER ───
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.classList.remove('menu-open');
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 700) closeMenu();
});

hamburger.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleMenu();
  }
});

// ─── SMOOTH ACTIVE NAV ───
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
  });
});