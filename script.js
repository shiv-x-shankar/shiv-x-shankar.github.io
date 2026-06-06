/* ─── NAV SCROLL EFFECT ─── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ─── TYPING ANIMATION ─── */
const phrases = [
  'build AI systems.',
  'scale distributed infrastructure.',
  'bridge tech and capital.',
  'ship products at enterprise scale.',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const el = document.getElementById('dynamicText');

function type() {
  const phrase = phrases[phraseIdx];

  if (!deleting) {
    charIdx++;
    el.textContent = phrase.slice(0, charIdx);

    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(type, 2400);
      return;
    }
    setTimeout(type, 52);
  } else {
    charIdx--;
    el.textContent = phrase.slice(0, charIdx);

    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 320);
      return;
    }
    setTimeout(type, 28);
  }
}

type();

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
});

revealEls.forEach(el => revealObserver.observe(el));

/* ─── SMOOTH ANCHOR SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ─── ACTIVE NAV LINK HIGHLIGHT ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── STAT NUMBER COUNT-UP ─── */
function countUp(el, target, suffix, duration = 1400) {
  const isFloat = target % 1 !== 0;
  const start = performance.now();

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const statCards = document.querySelectorAll('.stat-card');
const statData  = [
  { value: 300, suffix: 'M+' },
  { value: 5,   suffix: '+' },
  { value: 3,   suffix: '' },
  { value: 3.8, suffix: '' },
];

let statsAnimated = false;

const statObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statCards.forEach((card, i) => {
      const numEl = card.querySelector('.stat-num');
      const { value, suffix } = statData[i];
      countUp(numEl, value, suffix);
    });
    statObserver.disconnect();
  }
}, { threshold: 0.5 });

if (statCards.length) statObserver.observe(statCards[0].parentElement);

/* ─── NEURAL NET BACKGROUND ─── */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas || window.innerWidth < 769) return;

  const ctx = canvas.getContext('2d');
  const LAYERS = [3, 5, 8, 8, 5, 3];
  const IND = '129,140,248'; // indigo
  const CYN = '34,211,238';  // cyan

  let nodes = [], edges = [], pulses = [], raf = null;
  let mx = -9999, my = -9999;

  /* ── Node ── */
  class Node {
    constructor(x, y, li, isOut) {
      this.x = x; this.y = y; this.li = li; this.isOut = isOut;
      this.act = Math.random() * 0.08;
      this.cd = 0;
      this.out = [];
    }

    fire(s) {
      s = s === undefined ? 1 : s;
      this.act = Math.min(1, this.act + s * 0.55);
      if (this.cd > 0) return;
      this.cd = 20;
      this.out.forEach(function (e) {
        if (Math.random() < 0.72) pulses.push(new Pulse(e, s * 0.9));
      });
    }

    tick() {
      if (this.cd > 0) this.cd--;
      const dx = this.x - mx, dy = this.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 200 && Math.random() < (1 - d / 200) * 0.038) this.fire(0.75);
      if (Math.random() < 0.00022) this.fire(0.4);
      this.act = Math.max(0, this.act - 0.012);
    }

    draw() {
      const a = this.act;
      const col = this.isOut ? CYN : IND;
      const alpha = (0.18 + a * 0.82).toFixed(3);

      if (a > 0.07) {
        const gr = 4 + a * 16;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, gr);
        g.addColorStop(0, 'rgba(' + col + ',' + (a * 0.42).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, gr, 0, 6.2832);
        ctx.fillStyle = g;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, 3 + a, 0, 6.2832);
      ctx.fillStyle = 'rgba(' + col + ',' + alpha + ')';
      ctx.fill();
    }
  }

  /* ── Edge ── */
  class Edge {
    constructor(a, b) { this.a = a; this.b = b; }

    draw() {
      const alpha = (0.048 + this.a.act * 0.065 + this.b.act * 0.04).toFixed(3);
      ctx.beginPath();
      ctx.moveTo(this.a.x, this.a.y);
      ctx.lineTo(this.b.x, this.b.y);
      ctx.strokeStyle = 'rgba(' + IND + ',' + alpha + ')';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
  }

  /* ── Pulse ── */
  class Pulse {
    constructor(edge, s) {
      this.e = edge; this.s = s; this.t = 0;
      this.spd = 0.007 + Math.random() * 0.005;
      this.done = false;
    }

    tick() {
      this.t += this.spd;
      if (this.t >= 1) {
        this.done = true;
        this.e.b.act = Math.min(1, this.e.b.act + this.s * 0.42);
      }
    }

    draw() {
      const t = this.t, s = this.s, e = this.e;
      const x = e.a.x + (e.b.x - e.a.x) * t;
      const y = e.a.y + (e.b.y - e.a.y) * t;
      const fade = Math.sin(t * Math.PI);
      const a = s * fade;

      const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0,   'rgba(255,255,255,' + (a * 0.92).toFixed(3) + ')');
      g.addColorStop(0.4, 'rgba(' + IND + ',' + (a * 0.65).toFixed(3) + ')');
      g.addColorStop(1,   'rgba(' + IND + ',0)');
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, 6.2832);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  /* ── Build network ── */
  function build() {
    nodes = []; edges = []; pulses = [];
    const W = canvas.width, H = canvas.height;
    const px = W * 0.06, py = H * 0.1;
    const nW = W - px * 2, nH = H - py * 2;
    const nL = LAYERS.length;

    const cols = LAYERS.map(function (cnt, li) {
      const x = px + (li / (nL - 1)) * nW;
      return Array.from({ length: cnt }, function (_, ni) {
        const yBase = py + ((ni + 0.5) / cnt) * nH;
        const jitter = (Math.random() - 0.5) * (nH / cnt) * 0.28;
        const n = new Node(x, yBase + jitter, li, li === nL - 1);
        nodes.push(n);
        return n;
      });
    });

    for (let li = 0; li < cols.length - 1; li++) {
      cols[li].forEach(function (a) {
        cols[li + 1].forEach(function (b) {
          const e = new Edge(a, b);
          a.out.push(e);
          edges.push(e);
        });
      });
    }

    // Seed initial propagation through the first layer
    const firstLayer = cols[0];
    [0, 350, 700].forEach(function (delay, i) {
      setTimeout(function () {
        const n = firstLayer[i % firstLayer.length];
        if (n) n.fire(0.65);
      }, delay);
    });
  }

  /* ── Animation loop ── */
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    edges.forEach(function (e) { e.draw(); });
    pulses.forEach(function (p) { p.tick(); p.draw(); });
    pulses = pulses.filter(function (p) { return !p.done; });
    if (pulses.length > 100) pulses = pulses.slice(-100);
    nodes.forEach(function (n) { n.tick(); n.draw(); });
    raf = requestAnimationFrame(loop);
  }

  /* ── Mouse ── */
  window.addEventListener('mousemove', function (ev) {
    const r = canvas.getBoundingClientRect();
    mx = ev.clientX - r.left;
    my = ev.clientY - r.top;
  });
  document.addEventListener('mouseleave', function () { mx = my = -9999; });

  /* ── Pause when hidden ── */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(loop);
  });

  /* ── Resize ── */
  let resizeT;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      cancelAnimationFrame(raf);
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      build();
      raf = requestAnimationFrame(loop);
    }, 200);
  });

  /* ── Init ── */
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  build();
  raf = requestAnimationFrame(loop);
})();
