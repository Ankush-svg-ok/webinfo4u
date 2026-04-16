/* ═══════════════════════════════════════════
   NexusFinance — Main JavaScript
   GSAP ScrollTrigger + 3D Tilt + Particles
   ═══════════════════════════════════════════ */

// ─── Loading Screen ───
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loading-screen')?.classList.add('hidden');
  }, 400);
});

// ─── Theme Toggle ───
const getTheme = () => localStorage.getItem('theme') || 'dark';
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};
setTheme(getTheme());
document.addEventListener('click', (e) => {
  if (e.target.closest('.theme-toggle')) setTheme(getTheme() === 'dark' ? 'light' : 'dark');
});

// ─── Navbar Scroll ───
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Scroll Progress Bar ───
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.style.width = '0%';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
  });
})();

// ─── Mobile Menu ───
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) { menu.classList.toggle('open'); toggle.classList.toggle('active'); }
  if (e.target.closest('.mobile-menu a') && menu) menu.classList.remove('open');
});

// ─── Page Transition ───
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
  e.preventDefault();
  const overlay = document.querySelector('.page-transition');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 300);
  } else {
    window.location.href = href;
  }
});

// ─── Animated Counters ───
function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    if (el.dataset.animated) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    el.dataset.animated = '1';
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ─── AOS Init ───
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }
});

// ─── Pricing Toggle ───
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.toggle-switch');
  if (!toggle) return;
  toggle.classList.toggle('active');
  const isYearly = toggle.classList.contains('active');
  const monthlyLabel = toggle.previousElementSibling;
  const yearlyLabel = toggle.nextElementSibling;
  if (monthlyLabel) monthlyLabel.classList.toggle('active', !isYearly);
  if (yearlyLabel) yearlyLabel.classList.toggle('active', isYearly);
  document.querySelectorAll('.pricing-price .amount').forEach(el => {
    el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
  });
  document.querySelectorAll('.pricing-price .period').forEach(el => {
    el.textContent = isYearly ? '/year' : '/month';
  });
});

// ─── Tool Detail Animation ───
function runToolAnimation() {
  const outputEl = document.querySelector('.output-content');
  const runBtn = document.querySelector('.run-tool-btn');
  if (!outputEl || !runBtn) return;
  runBtn.addEventListener('click', () => {
    const text = outputEl.dataset.output || 'Processing your request with AI... This is a simulated output demonstrating the tool capabilities.';
    outputEl.innerHTML = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    outputEl.appendChild(cursor);
    const type = () => {
      if (i < text.length) {
        outputEl.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(type, 18 + Math.random() * 25);
      } else {
        cursor.remove();
      }
    };
    type();
  });
}
document.addEventListener('DOMContentLoaded', runToolAnimation);

// ─── Auth Tabs ───
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.auth-tab');
  if (!tab) return;
  tab.parentElement.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const card = tab.closest('.auth-card');
  const isLogin = tab.dataset.tab === 'login';
  card.querySelectorAll('.name-field').forEach(f => f.style.display = isLogin ? 'none' : 'flex');
  const submitBtn = card.querySelector('.auth-submit');
  if (submitBtn) submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
});

// ─── Auth Submit ───
document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('auth-form');
  if (!authForm) return;
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('auth-submit');
    const isLogin = document.querySelector('.auth-tab.active')?.dataset.tab === 'login';
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> ' + (isLogin ? 'Signing in...' : 'Creating account...');
    setTimeout(() => {
      const toast = document.getElementById('auth-toast');
      const msg = document.getElementById('toast-msg');
      if (toast && msg) {
        msg.textContent = isLogin ? 'Welcome back! Redirecting...' : 'Account created! Redirecting...';
        toast.style.display = 'block';
        requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; });
      }
      localStorage.setItem('aiph_logged_in', 'true');
      localStorage.setItem('aiph_user', document.getElementById('email')?.value || 'user@example.com');
      setTimeout(() => { window.location.href = 'tools.html'; }, 1500);
    }, 1200);
  });
  ['google-btn', 'github-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      btn.disabled = true;
      const provider = id === 'google-btn' ? 'Google' : 'GitHub';
      btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Connecting...`;
      setTimeout(() => {
        const toast = document.getElementById('auth-toast');
        const msg = document.getElementById('toast-msg');
        if (toast && msg) {
          msg.textContent = `Signed in with ${provider}! Redirecting...`;
          toast.style.display = 'block';
          requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; });
        }
        localStorage.setItem('aiph_logged_in', 'true');
        setTimeout(() => { window.location.href = 'tools.html'; }, 1500);
      }, 1500);
    });
  });
});

// ─── Contact Form ───
document.addEventListener('submit', (e) => {
  if (e.target.closest('.contact-form')) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sent Successfully!';
      btn.style.background = 'var(--gradient-secondary)';
      btn.style.color = '#fff';
      setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.style.color = ''; }, 3000);
    }
  }
});

// ─── FAQ Toggle ───
document.addEventListener('click', (e) => {
  const faqCard = e.target.closest('.faq-card');
  if (faqCard) {
    faqCard.classList.toggle('faq-open');
    const answer = faqCard.querySelector('.faq-answer');
    if (answer) answer.style.display = faqCard.classList.contains('faq-open') ? 'block' : 'none';
  }
});

// ─── Smooth Scroll ───
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  if (id === '#') return;
  const target = document.querySelector(id);
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});

// ═══════════════════════════════════════════
// GSAP + ScrollTrigger Animations
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // Hero animations
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-text h1', { y: 60, opacity: 0, duration: 1 })
    .from('.hero-text p', { y: 40, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-buttons', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-visual-card', { scale: 0.85, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=0.7');

  // Section headers — scroll reveal
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Feature cards stagger
  gsap.utils.toArray('.features-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.feature-card'), {
      y: 50, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 80%' }
    });
  });

  // Tool cards stagger
  gsap.utils.toArray('.tools-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.tool-card'), {
      y: 50, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 80%' }
    });
  });

  // Stat items
  gsap.utils.toArray('.stats-row').forEach(row => {
    gsap.from(row.querySelectorAll('.stat-item'), {
      y: 30, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 85%' }
    });
  });

  // Pricing cards
  gsap.utils.toArray('.pricing-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.pricing-card'), {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 80%' }
    });
  });

  // Blog cards
  gsap.utils.toArray('.blog-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.blog-card'), {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 80%' }
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      x: i % 2 === 0 ? -40 : 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%' }
    });
  });

  // Glass cards generic
  gsap.utils.toArray('.glass-card').forEach(card => {
    if (card.closest('.pricing-grid') || card.closest('.features-grid') || card.closest('.blog-grid')) return;
    gsap.from(card, {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' }
    });
  });

  // CTA box
  gsap.utils.toArray('.cta-box').forEach(box => {
    gsap.from(box, {
      scale: 0.92, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: box, start: 'top 85%' }
    });
  });

  // Contact grid
  gsap.utils.toArray('.contact-grid').forEach(grid => {
    gsap.from(grid.querySelector('.contact-info'), {
      x: -40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 80%' }
    });
    gsap.from(grid.querySelector('.contact-form'), {
      x: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 80%' }
    });
  });

  // Parallax orbs on hero
  if (document.querySelector('.hero')) {
    gsap.to('.hero::before', {
      y: -100, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }
});

// ═══════════════════════════════════════════
// Interactive Glow Effect for Cards (mouse-follow)
// Uses a pseudo-element layer so it never conflicts
// with CSS :hover border/shadow/transform styles
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const glowCards = document.querySelectorAll('.feature-card, .tool-card, .pricing-card, .glass-card, .stat-item, .blog-card');

  // Inject a tiny stylesheet for the glow pseudo-layer
  const glowStyle = document.createElement('style');
  glowStyle.textContent = `
    .feature-card, .tool-card, .pricing-card, .glass-card, .stat-item, .blog-card {
      --glow-x: 50%; --glow-y: 50%; --glow-opacity: 0;
    }
    .card-glow-layer {
      position: absolute; inset: 0; border-radius: inherit;
      background: radial-gradient(500px circle at var(--glow-x) var(--glow-y), rgba(99,91,255,0.10), transparent 40%);
      opacity: var(--glow-opacity);
      transition: opacity 0.3s ease;
      pointer-events: none; z-index: 0;
    }
  `;
  document.head.appendChild(glowStyle);

  glowCards.forEach(card => {
    // Ensure relative positioning for the glow layer
    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    // Create glow pseudo-layer element
    const glowEl = document.createElement('div');
    glowEl.className = 'card-glow-layer';
    card.prepend(glowEl);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
      card.style.setProperty('--glow-opacity', '1');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--glow-opacity', '0');
    });
  });

  // Touch support — add active highlight class on touch
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    const touchCards = document.querySelectorAll('.feature-card, .tool-card, .pricing-card, .glass-card, .stat-item, .blog-card');
    touchCards.forEach(card => {
      card.addEventListener('touchstart', () => {
        card.classList.add('touch-active');
        card.style.borderColor = 'var(--glass-border-hover)';
        card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.16), 0 0 20px rgba(99,91,255,0.12)';
        card.style.transform = 'translateY(-3px)';
      }, { passive: true });
      card.addEventListener('touchend', () => {
        setTimeout(() => {
          card.classList.remove('touch-active');
          card.style.borderColor = '';
          card.style.boxShadow = '';
          card.style.transform = '';
        }, 200);
      }, { passive: true });
    });
  }
});

// ═══════════════════════════════════════════
// Particle Background
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const maxParticles = 50;
  const connectionDistance = 120;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1
    };
  }

  for (let i = 0; i < maxParticles; i++) particles.push(createParticle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '99, 91, 255' : '99, 91, 255';

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / connectionDistance)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
});

// ═══════════════════════════════════════════
// Magnetic Button Hover
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-cta, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});
