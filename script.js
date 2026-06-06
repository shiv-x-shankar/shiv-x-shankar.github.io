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
  'build AI-native systems.',
  'scale distributed infrastructure.',
  'bridge deep tech and capital.',
  'ship products at enterprise scale.',
  'solve hard engineering problems.',
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
