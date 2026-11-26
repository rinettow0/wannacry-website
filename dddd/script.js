'use strict';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- LOADER ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');

  if (!loader) return;

  const bar = loader.querySelector('.loader-bar span');
  const pct = loader.querySelector('.loader-pct');

  let p = 0;

  const t = setInterval(() => {
    p += Math.random() * 18 + 6;

    if (p >= 100) {
      p = 100;
      clearInterval(t);

      setTimeout(() => {
        loader.classList.add('hide');
      }, 350);
    }

    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = Math.floor(p) + '%';

  }, 130);

  // Защита от бесконечной загрузки
  setTimeout(() => {
    clearInterval(t);
    loader.classList.add('hide');
  }, 5000);
});

/* ---------- MATRIX RAIN ---------- */
(function matrix() {
  if (reduceMotion) return;
  const c = document.getElementById('matrix'), ctx = c.getContext('2d');
  let cols, drops;
  const chars = 'アカサタナ01ABCDEF$#@WANNACRY<>/*';
  function resize() {
    c.width = innerWidth; c.height = innerHeight;
    cols = Math.floor(c.width / 16);
    drops = Array(cols).fill(1);
  }
  resize(); addEventListener('resize', resize);
  function draw() {
    ctx.fillStyle = 'rgba(8,13,22,0.08)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#00FF9C';
    ctx.font = '15px JetBrains Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- HERO PARTICLES ---------- */
(function particles() {
  if (reduceMotion) return;
  const box = document.getElementById('particles');
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.bottom = '-10px';
    const dur = 6 + Math.random() * 10;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = -Math.random() * dur + 's';
    const sz = 2 + Math.random() * 4;
    s.style.width = s.style.height = sz + 'px';
    if (Math.random() > 0.5) { s.style.background = '#00BFFF'; s.style.boxShadow = '0 0 10px #00BFFF'; }
    box.appendChild(s);
  }
})();

/* ---------- HEADER / NAV ---------- */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const navLinks = [...document.querySelectorAll('.nav-link')];

addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40));

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});
navLinks.forEach(l => l.addEventListener('click', () => {
  burger.classList.remove('open'); nav.classList.remove('open');
}));

/* ---------- ACTIVE NAV + SCROLL PROGRESS ---------- */
const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const scrollBar = document.getElementById('scrollBar');
const toTop = document.getElementById('toTop');

addEventListener('scroll', () => {
  const h = document.documentElement;
  const sp = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  scrollBar.style.width = sp + '%';
  toTop.classList.toggle('show', scrollY > 600);

  let current = sections[0]?.id;
  sections.forEach(s => { if (scrollY >= s.offsetTop - 160) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
});

toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- REVEAL ON SCROLL ---------- */
const revealEls = document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.reveal-right');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const sibs = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal-up'));
      const idx = sibs.indexOf(e.target);
      e.target.style.transitionDelay = (idx > -1 ? idx * 80 : 0) + 'ms';
      e.target.classList.add('in-view');
      io.unobserve(e.target);
}
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ---------- COUNTERS ---------- */
const counters = document.querySelectorAll('.counter');
const cObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1800, start = performance.now();
    function fmt(n) {
      if (target >= 1000) return Math.floor(n).toLocaleString();
      return Math.floor(n);
    }
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + fmt(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + fmt(target) + suffix;
    }
    requestAnimationFrame(step);
    cObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cObs.observe(c));

/* ---------- TIMELINE FILL ---------- */
const tl = document.querySelector('.timeline');
const tlFill = document.getElementById('tlFill');
if (tl && tlFill) {
  addEventListener('scroll', () => {
    const r = tl.getBoundingClientRect();
    const vh = innerHeight;
    let prog = (vh * 0.6 - r.top) / r.height;
    prog = Math.max(0, Math.min(1, prog));
    tlFill.style.height = prog * 100 + '%';
  });
}

/* ---------- 3D TILT ---------- */
if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
  const tiltCards = document.querySelectorAll('.tilt');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();

      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      card.style.transform =
        `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- CHECKLIST ---------- */
(function checklist() {
  const list = document.getElementById('checkList');
  if (!list) return;
  const boxes = list.querySelectorAll('input[type=checkbox]');
  const bar = document.getElementById('checkBar');
  const pct = document.getElementById('checkPct');
  const status = document.getElementById('checkStatus');
  const arc = document.getElementById('gaugeArc');
  const reset = document.getElementById('checkReset');
  const CIRC = 327;

  function update() {
    const checked = [...boxes].filter(b => b.checked).length;
    const p = Math.round(checked / boxes.length * 100);
    bar.style.width = p + '%';
    pct.textContent = p + '%';
    arc.style.strokeDashoffset = CIRC - (CIRC * p / 100);
    let label, color;
    if (p === 100) { label = 'FULLY SECURED'; color = '#00FF9C'; }
    else if (p >= 67) { label = 'GOOD POSTURE'; color = '#00BFFF'; }
    else if (p >= 34) { label = 'NEEDS WORK'; color = '#ffbd2e'; }
    else { label = 'AT RISK'; color = '#ff6b6b'; }
    status.textContent = label;
    pct.style.color = color;
    arc.style.stroke = color;
  }
  boxes.forEach(b => b.addEventListener('change', update));
  reset.addEventListener('click', () => { boxes.forEach(b => b.checked = false); update(); });
  update();
})();

/* ---------- CUSTOM CURSOR ---------- */
(function cursor() {
  if (!matchMedia('(hover:hover)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll('a,button,.tilt,.check-item,.g-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.
addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
})();

/* ---------- SMOOTH ANCHOR (fallback for older browsers) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  });
});