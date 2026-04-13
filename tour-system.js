/* ============================================================
   GAMHUB JOBS — REUSABLE TOUR / HINT SYSTEM
   tour-system.js  (add <script src="tour-system.js"></script>
   just before </body>, after script.js)
   ============================================================ */

const GHJTour = (() => {

  /* ── Storage key & version ─────────────────────────────── */
  const STORAGE_KEY = 'ghj_tour_v2';   // bump version to reset all hints

  /* ── Tour definitions ──────────────────────────────────── */
  /*
    Each tour step:
      id          – unique string; stored in localStorage when dismissed
      targetId    – DOM id of the element to highlight
      text        – HTML string shown in popover
      side        – preferred arrow side: 'top'|'bottom'|'left'|'right'|'auto'
      view        – only show when this view is active (matches currentView)
                    use '*' to show on any view
      delay       – ms after view becomes active before showing (default 800)
      group       – steps with the same group are shown sequentially as "N of M"
      groupIndex  – 1-based position within the group
  */
  const TOURS = [

    /* ── GROUP 1: Landing page ── */
    {
      id: 'landing-hamburger',
      targetId: 'hamburger',
      text: 'Tap here to <em>Log in</em> and access the full menu',
      side: 'left',
      view: 'landing',
      delay: 1600,
      group: 'landing',
      groupIndex: 1,
      groupTotal: 2,
    },
    {
      id: 'landing-build-cv',
      targetId: 'nav-build-cv-btn',          // we add this id below
      text: 'Click <em>Build CV</em> to get started — it takes under 3 minutes',
      side: 'bottom',
      view: 'landing',
      delay: 3200,
      group: 'landing',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── GROUP 2: Design Wizard ── */
    {
      id: 'wizard-profession',
      targetId: 'profession-grid',
      text: 'Pick your profession first — we <em>tailor every tip</em> to your field',
      side: 'top',
      view: 'wizard',
      delay: 800,
      group: 'wizard',
      groupIndex: 1,
      groupTotal: 1,
    },

    /* ── GROUP 3: CV Builder ── */
    {
      id: 'builder-summary-helper',
      targetId: 'b-summary',
      text: 'Stuck on your summary? Hit <em>✦ Click Here</em> just below to answer a few questions and auto-generate it',
      side: 'bottom',
      view: 'builder',
      delay: 1200,
      group: 'builder',
      groupIndex: 1,
      groupTotal: 3,
    },
    {
      id: 'builder-progress-bar',
      targetId: 'builder-progress',
      text: 'Use these tabs to <em>jump between sections</em> — your work is auto-saved',
      side: 'bottom',
      view: 'builder',
      delay: 2800,
      group: 'builder',
      groupIndex: 2,
      groupTotal: 3,
    },
    {
      id: 'builder-autosave',
      targetId: 'autosave-dot',
      text: 'Green dot = <em>saved ✓</em>. Your CV data lives in your browser — no account needed yet',
      side: 'bottom',
      view: 'builder',
      delay: 4400,
      group: 'builder',
      groupIndex: 3,
      groupTotal: 3,
    },

    /* ── GROUP 4: CV Preview ── */
    {
      id: 'preview-download',
      targetId: 'preview-download-btn',      // id added below
      text: 'Your <em>first download is free</em> — tap here to save your CV as a PDF',
      side: 'bottom',
      view: 'preview',
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
      delay: 2500,
      group: 'preview',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── GROUP 5: Job Search ── */
    {
      id: 'jobsearch-filters',
      targetId: 'js-keyword',
      text: 'Search by <em>title, keyword, category</em> or job type to find your next role',
      side: 'bottom',
      view: 'job-search',
      delay: 800,
      group: 'jobsearch',
      groupIndex: 1,
      groupTotal: 1,
    },

    /* ── GROUP 6: Cover Letter ── */
    {
      id: 'coverletter-import',
      targetId: 'cl-import-bar',             // id added below
      text: 'Built a CV already? Hit <em>Import CV ↓</em> to auto-fill your details',
      side: 'bottom',
      view: 'coverletter',
      delay: 900,
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
      delay: 2400,
      group: 'coverletter',
      groupIndex: 2,
      groupTotal: 2,
    },

    /* ── GROUP 7: Employer Portal ── */
    {
      id: 'employer-preview',
      targetId: 'post-job-sidebar',
      text: 'The <em>Live Preview</em> on the right updates as you type — see exactly how your listing will look',
      side: 'left',
      view: 'employer',
      delay: 1000,
      group: 'employer',
      groupIndex: 1,
      groupTotal: 1,
    },
  ];

  /* ── State ─────────────────────────────────────────────── */
  let _dismissed = {};
  let _activeTimers = [];
  let _activePopovers = [];

  function _loadState() {
    try { _dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { _dismissed = {}; }
  }

  function _saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_dismissed)); }
    catch {}
  }

  function _isDismissed(id) { return !!_dismissed[id]; }

  function _dismiss(id) {
    _dismissed[id] = true;
    _saveState();
  }

  /* ── DOM helpers ───────────────────────────────────────── */
  function _getOverlay() { return document.getElementById('tour-overlay'); }

  function _ensureTargetIds() {
    /* Add missing IDs to elements we reference but that don't have one yet */
    const map = {
      'nav-build-cv-btn':  () => document.querySelector('.nav-actions .btn-gold'),
      'preview-download-btn': () => document.querySelector('.preview-topbar-group .btn-gold'),
      'cl-import-bar':     () => document.querySelector('.import-cv-bar'),
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
    if (tr.top > ph + 60)          return 'top';
    if (vh - tr.bottom > ph + 60)  return 'bottom';
    if (tr.left > pw + 60)         return 'left';
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
        top  = tr.top  - ph - GAP;
        left = tr.left + tr.width / 2 - pw / 2;
        arrowDir = 'bottom';
        break;
      case 'bottom':
        top  = tr.bottom + GAP;
        left = tr.left + tr.width / 2 - pw / 2;
        arrowDir = 'top';
        break;
      case 'left':
        top  = tr.top  + tr.height / 2 - ph / 2;
        left = tr.left - pw - GAP;
        arrowDir = 'right';
        break;
      default: // right
        top  = tr.top  + tr.height / 2 - ph / 2;
        left = tr.right + GAP;
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

    _ensureTargetIds();
    const targetEl = document.getElementById(step.targetId);
    if (!targetEl) return;

    /* Create ring */
    const ring = document.createElement('div');
    ring.className = 'ghj-tour-ring';
    ring.id = 'ghj-ring-' + step.id;
    document.body.appendChild(ring);

    /* Create popover */
    const pop = document.createElement('div');
    pop.className = 'ghj-tour-popover';
    pop.id = 'ghj-pop-' + step.id;
    pop.setAttribute('role', 'tooltip');
    pop.setAttribute('aria-live', 'polite');

    const stepPillHTML = step.groupTotal > 1
      ? `<div class="ghj-tour-step-pill">
           ${Array.from({length: step.groupTotal}, (_, i) =>
             `<div class="ghj-tour-dot ${i + 1 === step.groupIndex ? 'active' : ''}"></div>`
           ).join('')}
           <span>${step.groupIndex} of ${step.groupTotal}</span>
         </div>`
      : '';

    pop.innerHTML = `
      <button class="ghj-tour-dismiss" aria-label="Dismiss hint" onclick="GHJTour.dismiss('${step.id}')">✕</button>
      <div class="ghj-tour-text">${step.text}</div>
      ${stepPillHTML}
      <svg class="ghj-tour-arrow" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14 L22 14 M22 14 L14 6 M22 14 L14 22"
          stroke="white" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(pop);

    /* Position */
    requestAnimationFrame(() => {
      _positionPopover(pop, targetEl, step.side || 'auto');
      _positionRing(ring, targetEl);
      requestAnimationFrame(() => {
        pop.classList.add('visible');
        ring.classList.add('visible');
      });
    });

    _activePopovers.push({ step, pop, ring });

    /* Show overlay dim only for first step in a group */
    if (step.groupIndex === 1) {
      _getOverlay()?.classList.add('active');
    }
  }

  /* ── Dismiss a single popover by id ─────────────────────── */
  function dismiss(id) {
    _dismiss(id);

    const idx = _activePopovers.findIndex(p => p.step.id === id);
    if (idx === -1) return;

    const { pop, ring } = _activePopovers[idx];
    pop.classList.remove('visible');
    ring.classList.remove('visible');

    setTimeout(() => {
      pop.remove();
      ring.remove();
    }, 320);

    _activePopovers.splice(idx, 1);

    /* Hide overlay if no more popovers */
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
    /* Cancel any pending timers from a previous view */
    _activeTimers.forEach(t => clearTimeout(t));
    _activeTimers = [];

    /* Dismiss any still-visible popovers from previous view */
    dismissAll();

    const steps = TOURS.filter(s =>
      (s.view === viewId || s.view === '*') && !_isDismissed(s.id)
    );

    steps.forEach(step => {
      const t = setTimeout(() => _showStep(step), step.delay || 800);
      _activeTimers.push(t);
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

  /* ── Reset all hints (dev / testing helper) ─────────────── */
  function reset() {
    _dismissed = {};
    _saveState();
    console.log('[GHJTour] All hints reset.');
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    _loadState();
  }

  return { init, triggerView, dismiss, dismissAll, reset };
})();

/* Auto-init on DOM ready */
document.addEventListener('DOMContentLoaded', () => GHJTour.init());
