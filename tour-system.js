/* ============================================================
   GAMHUB JOBS — REUSABLE TOUR / HINT SYSTEM  v3
   Scroll-triggered: hints fire when their target element
   enters the viewport, not on a fixed timer.
   Fixed/sticky elements (navbar, topbar) still use a short
   entry delay since they are always visible.
   ============================================================ */

const GHJTour = (() => {

  /* ── Storage ───────────────────────────────────────────── */
  const STORAGE_KEY = 'ghj_tour_v3';

  /* ── Tour definitions ──────────────────────────────────── */
  /*
    trigger: 'scroll'  → fires when the target enters the viewport
             'timer'   → fires after `delay` ms (for always-visible elements)
    noOverlay:true     → skip the dim overlay (less intrusive for scroll hints)
  */
  const TOURS = [

    /* ── Landing page — sticky navbar elements ────────────── */
    {
      id: 'landing-hamburger',
      targetId: 'hamburger',
      text: 'Tap here to <em>Log in</em> and access the full menu',
      side: 'left',
      view: 'landing',
      trigger: 'timer',
      delay: 1600,
      group: 'landing',
      groupIndex: 1,
      groupTotal: 2,
    },

    /* ── Landing page — scroll-triggered sections ─────────── */
    {
      id: 'landing-features',
      targetId: 'features',
      text: 'Everything you need is <em>built in</em> — CV, cover letter, jobs, and employer tools',
      side: 'top',
      view: 'landing',
      trigger: 'scroll',
      threshold: 0.25,
      noOverlay: true,
      group: 'landing-sections',
      groupIndex: 1,
      groupTotal: 2,
    },
    {
      id: 'landing-templates',
      targetId: 'templates',
      text: 'Pick a template to <em>preview your CV</em> before you even start building',
      side: 'top',
      view: 'landing',
      trigger: 'scroll',
      threshold: 0.2,
      noOverlay: true,
      group: 'landing-sections',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── Design Wizard ────────────────────────────────────── */
    {
      id: 'wizard-profession',
      targetId: 'profession-grid',
      text: 'Pick your profession first — we <em>tailor every tip</em> to your field',
      side: 'top',
      view: 'wizard',
      trigger: 'scroll',
      threshold: 0.3,
      noOverlay: true,
      group: 'wizard',
      groupIndex: 1,
      groupTotal: 1,
    },

    /* ── CV Builder ───────────────────────────────────────── */
    {
      id: 'builder-progress-bar',
      targetId: 'builder-progress',
      text: 'Use these tabs to <em>jump between sections</em> — your work is auto-saved',
      side: 'bottom',
      view: 'builder',
      trigger: 'scroll',
      threshold: 0.8,
      noOverlay: true,
      group: 'builder',
      groupIndex: 1,
      groupTotal: 3,
    },
    {
      id: 'builder-summary-helper',
      targetId: 'b-summary',
      text: 'Stuck on your summary? Hit <em>✦ Click Here</em> below to answer questions and auto-generate it',
      side: 'bottom',
      view: 'builder',
      trigger: 'scroll',
      threshold: 0.5,
      noOverlay: true,
      group: 'builder',
      groupIndex: 2,
      groupTotal: 3,
    },

    /* ── CV Preview ───────────────────────────────────────── */
    {
      id: 'preview-download',
      targetId: 'preview-download-btn',
      text: 'Your <em>first download is free</em> — tap here to save your CV as a PDF',
      side: 'bottom',
      view: 'preview',
      trigger: 'timer',
      delay: 900,
      group: 'preview',
      groupIndex: 1,
      groupTotal: 2,
    },
    {
      id: 'preview-customise',
      targetId: 'cust-gear-btn-target',
      text: 'Tap <em>⚙ Customise</em> to switch themes, share, or download the bundle',
      side: 'bottom',
      view: 'preview',
      trigger: 'timer',
      delay: 2800,
      group: 'preview',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── Job Search ───────────────────────────────────────── */
    {
      id: 'jobsearch-filters',
      targetId: 'js-keyword',
      text: 'Search by <em>title, keyword, category</em> or job type to find your next role',
      side: 'bottom',
      view: 'job-search',
      trigger: 'scroll',
      threshold: 0.8,
      noOverlay: true,
      group: 'jobsearch',
      groupIndex: 1,
      groupTotal: 2,
    },
    {
      id: 'jobsearch-apply-btn',
      targetId: 'ghj-first-apply-btn',
      text: 'Ready to apply? <em>Build your CV first</em> — it takes 3 minutes and employers see it instantly',
      side: 'top',
      view: 'job-search',
      trigger: 'scroll',
      threshold: 0.5,
      noOverlay: true,
      group: 'jobsearch',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── Cover Letter ─────────────────────────────────────── */
    {
      id: 'coverletter-import',
      targetId: 'cl-import-bar',
      text: 'Built a CV already? Hit <em>Import CV ↓</em> to auto-fill your details',
      side: 'bottom',
      view: 'coverletter',
      trigger: 'scroll',
      threshold: 0.8,
      noOverlay: true,
      group: 'coverletter',
      groupIndex: 1,
      groupTotal: 2,
    },
    {
      id: 'coverletter-aiwrite',
      targetId: 'ai-write-all-btn',
      text: 'Hit <em>✦ AI Write Entire Letter</em> to generate all 5 paragraphs in one go',
      side: 'top',
      view: 'coverletter',
      trigger: 'scroll',
      threshold: 0.4,
      noOverlay: true,
      group: 'coverletter',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── Employer Portal ──────────────────────────────────── */
    {
      id: 'employer-plan',
      targetId: 'submit-job-btn',
      text: 'Free listing is reviewed within 24 hours — <em>Featured gets 3× more views</em>',
      side: 'top',
      view: 'employer',
      trigger: 'scroll',
      threshold: 0.6,
      noOverlay: true,
      group: 'employer',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── Talent Board ─────────────────────────────────────── */
    {
      id: 'talentboard-post-btn',
      targetId: 'tb-post-btn',
      text: 'Job seekers — tap <em>+ Post My Profile</em> to get discovered by Gambian employers for free',
      side: 'bottom',
      view: 'talent-board',
      trigger: 'timer',
      delay: 1000,
      group: 'talentboard',
      groupIndex: 1,
      groupTotal: 3,
    },
    {
      id: 'talentboard-search',
      targetId: 'tb-keyword',
      text: 'Employers — search by <em>name, skill, or profession</em> to find the right candidate',
      side: 'bottom',
      view: 'talent-board',
      trigger: 'scroll',
      threshold: 0.8,
      noOverlay: true,
      group: 'talentboard',
      groupIndex: 2,
      groupTotal: 3,
    },
    {
      id: 'talentboard-contact-btn',
      /* Stamped onto the first Contact button by tbRenderProfiles() */
      targetId: 'tb-first-contact-btn',
      text: 'Tap <em>Contact →</em> on any profile to send a direct email to the candidate instantly',
      side: 'top',
      view: 'talent-board',
      trigger: 'scroll',
      threshold: 0.5,
      noOverlay: true,
      group: 'talentboard',
      groupIndex: 3,
      groupTotal: 3,
    },

  ];

  /* ── State ─────────────────────────────────────────────── */
  let _dismissed       = {};
  let _activeTimers    = [];
  let _activePopovers  = [];
  let _scrollObserver  = null;
  let _pendingScroll   = [];
  let _currentView     = null;

  /* ── Persistence ───────────────────────────────────────── */
  function _loadState() {
    try { _dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { _dismissed = {}; }
  }
  function _saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_dismissed)); }
    catch {}
  }
  function _isDismissed(id) { return !!_dismissed[id]; }
  function _dismiss(id) { _dismissed[id] = true; _saveState(); }

  /* ── DOM helpers ───────────────────────────────────────── */
  function _getOverlay() { return document.getElementById('tour-overlay'); }

  function _ensureTargetIds() {
    const map = {
      'nav-build-cv-btn':     () => document.querySelector('.nav-actions .btn-gold'),
      'preview-download-btn': () => document.querySelector('.preview-topbar-group .btn-gold'),
      'cl-import-bar':        () => document.querySelector('.import-cv-bar'),
      'ghj-first-apply-btn':  () => document.querySelector('#js-job-grid .js-btn-apply'),
      'tb-first-contact-btn': () => document.querySelector('#tb-profile-grid .tb-btn-contact'),
    };
    Object.entries(map).forEach(([id, finder]) => {
      if (!document.getElementById(id)) {
        const el = finder();
        if (el) el.id = id;
      }
    });
  }

  /* ── Position helpers ──────────────────────────────────── */
  function _bestSide(tr, pw, ph) {
    const vw = window.innerWidth, vh = window.innerHeight;
    if (tr.top > ph + 60)         return 'top';
    if (vh - tr.bottom > ph + 60) return 'bottom';
    if (tr.left > pw + 60)        return 'left';
    return 'right';
  }

  function _positionPopover(el, targetEl, side) {
    const tr  = targetEl.getBoundingClientRect();
    const pw  = el.offsetWidth  || 230;
    const ph  = el.offsetHeight || 100;
    const GAP = 16;
    const M   = 14;
    const vw  = window.innerWidth;
    const vh  = window.innerHeight;

    const s = (side === 'auto') ? _bestSide(tr, pw, ph) : side;
    let top, left, arrowDir;

    switch (s) {
      case 'top':
        top      = tr.top  - ph - GAP;
        left     = tr.left + tr.width  / 2 - pw / 2;
        arrowDir = 'bottom'; break;
      case 'bottom':
        top      = tr.bottom + GAP;
        left     = tr.left + tr.width  / 2 - pw / 2;
        arrowDir = 'top';    break;
      case 'left':
        top      = tr.top  + tr.height / 2 - ph / 2;
        left     = tr.left - pw - GAP;
        arrowDir = 'right';  break;
      default:
        top      = tr.top  + tr.height / 2 - ph / 2;
        left     = tr.right + GAP;
        arrowDir = 'left';
    }

    top  = Math.max(M, Math.min(top,  vh - ph - M));
    left = Math.max(M, Math.min(left, vw - pw - M));

    el.style.top  = top  + 'px';
    el.style.left = left + 'px';
    el.setAttribute('data-arrow', arrowDir);
  }

  function _positionRing(ringEl, targetEl) {
    const tr  = targetEl.getBoundingClientRect();
    const PAD = 5;
    ringEl.style.top    = (tr.top    - PAD) + 'px';
    ringEl.style.left   = (tr.left   - PAD) + 'px';
    ringEl.style.width  = (tr.width  + PAD * 2) + 'px';
    ringEl.style.height = (tr.height + PAD * 2) + 'px';
  }

  /* ── Build & show a single popover ─────────────────────── */
  function _showStep(step) {
    if (_isDismissed(step.id)) return;
    if (step.view !== '*' && step.view !== _currentView) return;

    _ensureTargetIds();
    const targetEl = document.getElementById(step.targetId);
    if (!targetEl) return;
    if (document.getElementById('ghj-pop-' + step.id)) return;

    /* Ring */
    const ring = document.createElement('div');
    ring.className = 'ghj-tour-ring';
    ring.id = 'ghj-ring-' + step.id;
    document.body.appendChild(ring);

    /* Popover */
    const pop = document.createElement('div');
    pop.className = 'ghj-tour-popover';
    pop.id = 'ghj-pop-' + step.id;
    pop.setAttribute('role', 'tooltip');
    pop.setAttribute('aria-live', 'polite');

    const pillHTML = step.groupTotal > 1
      ? `<div class="ghj-tour-step-pill">
           ${Array.from({ length: step.groupTotal }, (_, i) =>
             `<div class="ghj-tour-dot ${i + 1 === step.groupIndex ? 'active' : ''}"></div>`
           ).join('')}
           <span>${step.groupIndex} of ${step.groupTotal}</span>
         </div>`
      : '';

    pop.innerHTML = `
      <button class="ghj-tour-dismiss" aria-label="Dismiss hint"
        onclick="GHJTour.dismiss('${step.id}')">✕</button>
      <div class="ghj-tour-text">${step.text}</div>
      ${pillHTML}
      <svg class="ghj-tour-arrow" viewBox="0 0 28 28" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14 L22 14 M22 14 L14 6 M22 14 L14 22"
          stroke="white" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(pop);

    requestAnimationFrame(() => {
      _positionPopover(pop, targetEl, step.side || 'auto');
      _positionRing(ring, targetEl);
      requestAnimationFrame(() => {
        pop.classList.add('visible');
        ring.classList.add('visible');
      });
    });

    _activePopovers.push({ step, pop, ring });

    if (!step.noOverlay && step.groupIndex === 1) {
      _getOverlay()?.classList.add('active');
    }
  }

  /* ── Scroll observer ────────────────────────────────────── */
  function _buildObserver() {
    if (_scrollObserver) _scrollObserver.disconnect();

    _scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const triggered = _pendingScroll.filter(
          s => document.getElementById(s.targetId) === entry.target
        );

        triggered.forEach(step => {
          _pendingScroll = _pendingScroll.filter(s => s.id !== step.id);
          _scrollObserver.unobserve(entry.target);

          const settleDelay = step.scrollDelay || 300;
          const t = setTimeout(() => _showStep(step), settleDelay);
          _activeTimers.push(t);
        });
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold:  0,
    });
  }

  /* ── Watch an element for scroll-based steps ────────────── */
  function _watchForScroll(step) {
    _ensureTargetIds();
    const targetEl = document.getElementById(step.targetId);
    if (!targetEl) {
      let tries = 0;
      const retry = setInterval(() => {
        tries++;
        _ensureTargetIds();
        const el = document.getElementById(step.targetId);
        if (el) {
          clearInterval(retry);
          _pendingScroll.push(step);
          _scrollObserver.observe(el);
        } else if (tries > 13) {
          clearInterval(retry);
        }
      }, 600);
      return;
    }

    const rect           = targetEl.getBoundingClientRect();
    const alreadyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (alreadyVisible) {
      const t = setTimeout(() => _showStep(step), step.scrollDelay || 600);
      _activeTimers.push(t);
    } else {
      _pendingScroll.push(step);
      _scrollObserver.observe(targetEl);
    }
  }

  /* ── Dismiss a single popover ───────────────────────────── */
  function dismiss(id) {
    _dismiss(id);

    const idx = _activePopovers.findIndex(p => p.step.id === id);
    if (idx === -1) return;

    const { pop, ring } = _activePopovers[idx];
    pop.classList.remove('visible');
    ring.classList.remove('visible');

    setTimeout(() => { pop.remove(); ring.remove(); }, 320);
    _activePopovers.splice(idx, 1);

    if (_activePopovers.length === 0) {
      _getOverlay()?.classList.remove('active');
    }
  }

  /* ── Dismiss all visible popovers ───────────────────────── */
  function dismissAll() {
    [..._activePopovers].forEach(p => dismiss(p.step.id));
  }

  /* ── Trigger all steps for a given view ─────────────────── */
  function triggerView(viewId) {
    _currentView = viewId;

    _activeTimers.forEach(t => clearTimeout(t));
    _activeTimers = [];

    if (_scrollObserver) _scrollObserver.disconnect();
    _pendingScroll = [];

    dismissAll();
    _buildObserver();

    const steps = TOURS.filter(s =>
      (s.view === viewId || s.view === '*') && !_isDismissed(s.id)
    );

    steps.forEach(step => {
      if (step.trigger === 'scroll') {
        _watchForScroll(step);
      } else {
        const t = setTimeout(() => _showStep(step), step.delay || 800);
        _activeTimers.push(t);
      }
    });
  }

  /* ── Reposition on resize ───────────────────────────────── */
  window.addEventListener('resize', () => {
    _ensureTargetIds();
    _activePopovers.forEach(({ step, pop, ring }) => {
      const targetEl = document.getElementById(step.targetId);
      if (!targetEl) return;
      _positionPopover(pop, targetEl, step.side || 'auto');
      _positionRing(ring, targetEl);
    });
  }, { passive: true });

  /* ── Reposition active popovers on scroll ───────────────── */
  let _scrollRaf = null;
  window.addEventListener('scroll', () => {
    if (_activePopovers.length === 0) return;
    if (_scrollRaf) return;
    _scrollRaf = requestAnimationFrame(() => {
      _scrollRaf = null;
      _activePopovers.forEach(({ step, pop, ring }) => {
        const targetEl = document.getElementById(step.targetId);
        if (!targetEl) return;
        _positionPopover(pop, targetEl, step.side || 'auto');
        _positionRing(ring, targetEl);
      });
    });
  }, { passive: true });

  /* ── Reset all hints ────────────────────────────────────── */
  function reset() {
    _dismissed = {};
    _saveState();
    console.log('[GHJTour] All hints reset — reload the page to see them again.');
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    _loadState();
    _buildObserver();
  }

  return { init, triggerView, dismiss, dismissAll, reset };
})();

document.addEventListener('DOMContentLoaded', () => GHJTour.init());
