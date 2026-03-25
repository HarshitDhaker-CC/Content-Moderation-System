/* ===================================================
   ToxiGuard AI – app.js
   =================================================== */

'use strict';

// ========== PRELOADER ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 2400);
});

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('toxiguard-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

const savedTheme = localStorage.getItem('toxiguard-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
  showToast('info', current === 'dark' ? '☀️ Light mode enabled' : '🌙 Dark mode enabled');
});

// ========== NAVBAR ==========
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
  toggleBackToTop();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

// ========== BACK TO TOP ==========
const backToTop = document.getElementById('backToTop');
function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========== COUNTER ANIMATION ==========
function animateCounter(el, target, suffix) {
  const duration = 1500;
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const decimals  = isDecimal ? String(target).split('.')[1].length : 0;

  function update(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - elapsed, 3);
    const val  = target * ease;
    el.textContent = isDecimal ? val.toFixed(decimals) : Math.floor(val);
    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(decimals) : target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseFloat(el.dataset.target));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ========== PARTICLES CONFIG ==========
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 900 } },
      color: { value: ['#6366f1', '#22d3ee', '#8b5cf6'] },
      shape: { type: 'circle' },
      opacity: { value: 0.35, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1 } },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 140, color: '#6366f1', opacity: 0.12, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.4 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
}

// ========== TOAST SYSTEM ==========
function showToast(type, message, duration = 3000) {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// ========== LIVE DETECTION ENGINE ==========
const commentInput  = document.getElementById('commentInput');
const charCount     = document.getElementById('charCount');
const analyzeBtn    = document.getElementById('analyzeBtn');
const clearBtn      = document.getElementById('clearBtn');
const sampleBtn     = document.getElementById('sampleBtn');
const resultsArea   = document.getElementById('resultsArea');
const addToHistory  = document.getElementById('addToHistoryBtn');

const sampleComments = [
  "You are a wonderful person and I really appreciate your help!",
  "You idiot! You can't do anything right, just go away!",
  "I love this community — everyone is so supportive and kind.",
  "Go kill yourself, nobody wants you here!!",
  "Great tutorial! Very clear explanation, thanks for sharing.",
  "People like you should be banned from the internet. Disgusting!",
  "This is spam! Buy cheap products now at www.spam.com!!!",
  "What a lovely day! Hope everyone has a great time.",
];

let sampleIndex = 0;
sampleBtn.addEventListener('click', () => {
  commentInput.value = sampleComments[sampleIndex % sampleComments.length];
  sampleIndex++;
  charCount.textContent = commentInput.value.length;
  commentInput.focus();
  showToast('info', '📝 Sample comment loaded');
});

clearBtn.addEventListener('click', () => {
  commentInput.value = '';
  charCount.textContent = '0';
  resultsArea.classList.add('hidden');
  commentInput.focus();
});

commentInput.addEventListener('input', () => {
  charCount.textContent = commentInput.value.length;
});

// ========== MOCK AI CLASSIFIER ==========
function classifyComment(text) {
  const lower = text.toLowerCase();

  const toxicPatterns = {
    toxic:       ['idiot', 'stupid', 'hate', 'loser', 'dumb', 'moron', 'fool', 'destroy', 'blame', 'jerk', 'awful'],
    severe_toxic:['kill', 'die', 'murder', 'suicide', '!!', 'want you dead', 'nobody wants you'],
    obscene:     ['damn', 'crap', 'hell', 'ass', 'shut up'],
    threat:      ['kill yourself', 'hurt you', 'you will pay', 'threat', 'gonna get you'],
    insult:      ['ugly', 'fat', 'worthless', 'failure', 'pathetic', 'useless', 'disgusting', 'fake'],
    identity_hate:['people like you', 'your kind', 'banned', 'shouldn\'t exist'],
    spam:        ['spam', 'buy now', 'click here', 'www.', 'http', 'cheap products', 'win money', 'subscribe'],
  };

  const scores = {};
  let maxScore = 0;

  for (const [cat, patterns] of Object.entries(toxicPatterns)) {
    let score = 0;
    for (const pat of patterns) {
      if (lower.includes(pat)) score += 0.25 + Math.random() * 0.25;
    }
    scores[cat] = Math.min(score + Math.random() * 0.05, 1);
    maxScore = Math.max(maxScore, scores[cat]);
  }

  const isToxic    = maxScore > 0.2;
  const confidence = isToxic
    ? Math.min(0.6 + maxScore * 0.38 + Math.random() * 0.04, 0.99)
    : Math.max(0.05, 0.92 - maxScore * 2 + (Math.random() * 0.06 - 0.03));

  // Normalize scores for display
  const normScores = {};
  for (const [cat, s] of Object.entries(scores)) {
    normScores[cat] = isToxic ? Math.max(s, 0) : s * 0.15;
  }

  return { isToxic, confidence: parseFloat(confidence.toFixed(4)), scores: normScores };
}

function getCategories(scores, isToxic) {
  const labels = {
    toxic: 'Toxic',
    severe_toxic: 'Severe Toxic',
    obscene: 'Obscene',
    threat: 'Threat',
    insult: 'Insult',
    identity_hate: 'Identity Hate',
    spam: 'Spam',
  };
  const tags = [];
  if (!isToxic) return [{ label: 'Safe', type: 'safe' }];
  for (const [key, val] of Object.entries(scores)) {
    if (val > 0.15) tags.push({ label: labels[key], score: val, type: val > 0.5 ? 'toxic' : 'warn' });
  }
  return tags.length ? tags : [{ label: 'Mild Toxic', type: 'warn' }];
}

// Simulate API delay
function fakeApiCall(text) {
  return new Promise(resolve => setTimeout(() => resolve(classifyComment(text)), 1400 + Math.random() * 600));
}

// Gauge animation
function animateGauge(pct) {
  const fill = document.getElementById('gaugeFill');
  const total = 125.6;
  const offset = total - (total * pct);
  fill.style.strokeDashoffset = total;
  setTimeout(() => {
    fill.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)';
    fill.style.strokeDashoffset = offset;
  }, 100);
}

analyzeBtn.addEventListener('click', async () => {
  const text = commentInput.value.trim();
  if (!text) {
    showToast('warning', '⚠️ Please enter a comment to analyze.');
    commentInput.focus();
    return;
  }
  if (text.length < 3) {
    showToast('warning', '⚠️ Comment too short. Please enter at least 3 characters.');
    return;
  }

  // Loading state
  analyzeBtn.classList.add('loading');
  analyzeBtn.disabled = true;
  resultsArea.classList.add('hidden');

  try {
    const result = await fakeApiCall(text);
    renderResults(result, text);
    showToast('success', '✅ Analysis complete!');
  } catch (e) {
    showToast('error', '❌ Analysis failed. Please try again.');
  } finally {
    analyzeBtn.classList.remove('loading');
    analyzeBtn.disabled = false;
  }
});

function renderResults(result, text) {
  const { isToxic, confidence, scores } = result;
  const pct = Math.round(confidence * 100);

  // Verdict
  const verdictCard   = document.getElementById('verdictCard');
  const verdictText   = document.getElementById('verdictText');
  const verdictIcon   = document.getElementById('verdictIcon');
  const verdictSymbol = document.getElementById('verdictIconSymbol');
  const confValue     = document.getElementById('confidenceValue');
  const catTags       = document.getElementById('categoryTags');
  const catBars       = document.getElementById('categoryBars');

  verdictText.textContent = isToxic ? 'TOXIC' : 'SAFE';
  verdictText.className   = `verdict-text ${isToxic ? 'toxic' : 'safe'}`;
  verdictIcon.className   = `verdict-icon ${isToxic ? 'toxic' : 'safe'}`;
  verdictSymbol.className = isToxic ? 'fas fa-circle-exclamation' : 'fas fa-circle-check';
  verdictCard.style.borderColor = isToxic ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)';

  // Confidence
  confValue.textContent = `${pct}%`;
  confValue.style.color = isToxic ? 'var(--red)' : 'var(--green)';
  animateGauge(confidence);

  // Category Tags
  const cats = getCategories(scores, isToxic);
  catTags.innerHTML = cats.map(c =>
    `<span class="cat-tag ${c.type}-tag">${c.label}</span>`
  ).join('');

  // Category Bars
  const barColors = {
    toxic: '#ef4444', severe_toxic: '#dc2626', obscene: '#f59e0b',
    threat: '#ec4899', insult: '#8b5cf6', identity_hate: '#ef4444', spam: '#22d3ee'
  };
  const labels = {
    toxic: 'Toxic', severe_toxic: 'Severe', obscene: 'Obscene',
    threat: 'Threat', insult: 'Insult', identity_hate: 'ID Hate', spam: 'Spam'
  };
  catBars.innerHTML = Object.entries(scores).map(([k, v]) => {
    const p = Math.round(v * 100);
    return `
      <div class="cat-bar-row">
        <span class="cat-bar-label">${labels[k]}</span>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width:0%;background:${barColors[k]}" data-pct="${p}%"></div>
        </div>
        <span class="cat-bar-pct">${p}%</span>
      </div>`;
  }).join('');

  // Animate bars
  setTimeout(() => {
    catBars.querySelectorAll('.cat-bar-fill').forEach(bar => {
      bar.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1)';
      bar.style.width = bar.dataset.pct;
    });
  }, 100);

  resultsArea.classList.remove('hidden');

  // Store for add-to-history
  analyzeBtn._lastResult = { isToxic, confidence, text };
}

// ========== HISTORY ==========
const historyData = JSON.parse(localStorage.getItem('toxiguard-history') || '[]');

function saveHistory() {
  localStorage.setItem('toxiguard-history', JSON.stringify(historyData.slice(-50)));
}

function renderHistory(filter = 'all') {
  const list = document.getElementById('historyList');
  const filtered = filter === 'all' ? historyData :
    historyData.filter(h => (filter === 'toxic' ? h.isToxic : !h.isToxic));

  if (!filtered.length) {
    list.innerHTML = `<div class="history-empty"><i class="fas fa-inbox"></i><p>No ${filter === 'all' ? '' : filter + ' '}comments yet.</p></div>`;
    return;
  }

  list.innerHTML = [...filtered].reverse().map(h => `
    <div class="history-item" data-filter="${h.isToxic ? 'toxic' : 'safe'}">
      <div class="history-dot ${h.isToxic ? 'toxic' : 'safe'}"></div>
      <span class="history-comment">${escapeHtml(h.text)}</span>
      <span class="history-badge ${h.isToxic ? 'toxic' : 'safe'}">${h.isToxic ? 'Toxic' : 'Safe'} ${Math.round(h.confidence * 100)}%</span>
    </div>
  `).join('');

  updateDashboardStats();
  updateChart();
}

function updateDashboardStats() {
  const total   = historyData.length;
  const toxic   = historyData.filter(h => h.isToxic).length;
  const safe    = total - toxic;
  const avgConf = total ? (historyData.reduce((s, h) => s + h.confidence, 0) / total * 100).toFixed(1) : 0;

  document.getElementById('safeCount').textContent  = safe;
  document.getElementById('toxicCount').textContent = toxic;
  document.getElementById('totalCount').textContent  = total;
  document.getElementById('avgConfidence').textContent = total ? `${avgConf}%` : '–%';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

addToHistory.addEventListener('click', () => {
  const r = analyzeBtn._lastResult;
  if (!r) return;
  historyData.push(r);
  saveHistory();
  renderHistory();
  showToast('success', '📋 Saved to history!');
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderHistory(btn.dataset.filter);
  });
});

// ========== CHART ==========
let toxicityChart;

function initChart() {
  const ctx = document.getElementById('toxicityChart');
  if (!ctx) return;

  toxicityChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Safe', 'Toxic'],
      datasets: [{
        data: [1, 0],
        backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(239,68,68,0.8)'],
        borderColor:      ['rgba(16,185,129,1)',   'rgba(239,68,68,1)'],
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      cutout: '72%',
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#8888aa',
            font: { family: 'Inter', size: 12 },
            padding: 20,
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw} comment${ctx.raw !== 1 ? 's' : ''}`
          }
        }
      },
      animation: { animateRotate: true, duration: 900, easing: 'easeInOutQuart' }
    }
  });
}

function updateChart() {
  if (!toxicityChart) return;
  const toxic = historyData.filter(h => h.isToxic).length;
  const safe  = historyData.length - toxic;
  toxicityChart.data.datasets[0].data = [safe || 1, toxic];
  toxicityChart.update();
}

// ========== TESTIMONIAL SLIDER ==========
let currentSlide = 0;
const track = document.getElementById('testimonialsTrack');
const dots  = document.querySelectorAll('.dot');

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide))));

let autoSlide = setInterval(() => goToSlide((currentSlide + 1) % dots.length), 5000);
track?.addEventListener('mouseenter', () => clearInterval(autoSlide));
track?.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goToSlide((currentSlide + 1) % dots.length), 5000);
});

// ========== CONTACT FORM ==========
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('success', '✉️ Message sent! We\'ll get back to you soon.');
  e.target.reset();
});

// ========== TYPING PLACEHOLDER ANIMATION ==========
const placeholders = [
  'Type or paste a comment here to analyze its toxicity…',
  'e.g. "You are amazing! Keep up the great work."',
  'e.g. "You idiot, nobody likes you!"',
  'e.g. "Buy cheapest products at www.spam.com now!"',
  'e.g. "This community is so helpful and kind."',
];
let pIndex = 0, pCharIndex = 0, pDeleting = false;

function typePlaceholder() {
  const target = placeholders[pIndex];
  if (!pDeleting) {
    commentInput.setAttribute('placeholder', target.substring(0, pCharIndex + 1));
    pCharIndex++;
    if (pCharIndex === target.length) {
      pDeleting = true;
      setTimeout(typePlaceholder, 2400);
      return;
    }
  } else {
    commentInput.setAttribute('placeholder', target.substring(0, pCharIndex - 1));
    pCharIndex--;
    if (pCharIndex === 0) {
      pDeleting = false;
      pIndex = (pIndex + 1) % placeholders.length;
    }
  }
  setTimeout(typePlaceholder, pDeleting ? 28 : 46);
}

typePlaceholder();

// ========== KEYBOARD SHORTCUT ==========
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    if (document.activeElement === commentInput) {
      analyzeBtn.click();
    }
  }
});

// ========== INIT ==========
updateDashboardStats();
initChart();
renderHistory();
