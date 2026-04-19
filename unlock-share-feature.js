/* ============================================================
   GAMHUB JOBS — WHATSAPP "UNLOCK BY SHARING" FEATURE
   v2 — All three bugs fixed:
     1. Job posting now gates BEFORE saving (not after)
     2. Free download counter now works correctly after sharing
     3. PDF export waits for view to fully render before capturing
   ============================================================
   INSTALL (no changes to script.js or styles.css needed):
     index.html <head>  → <link rel="stylesheet" href="unlock-share.css">
     index.html <body>  → <script src="unlock-share-feature.js" defer></script>
                          (after script.js and tour-system.js)
   ============================================================ */

/* ============================================================
   SHARE UNLOCK — CONSTANTS & STATE
   ============================================================ */
const SHARE_UNLOCK_KEY  = 'ghj_share_unlock_count';
const SHARE_UNLOCK_GOAL = 5;

const GHJ_SHARE_MESSAGE =
  '🇬🇲 *GamHub Jobs* — Gambia\'s #1 Career Platform!\n\n' +
  '✦ Build a professional CV in 3 minutes\n' +
  '✉ Generate tailored cover letters with AI\n' +
  '🔍 Search verified jobs across The Gambia\n' +
  '🏢 Employers can post jobs FREE\n\n' +
  'It\'s 100% free to start 👇\n' +
  'https://gamhubjobs.com';

function getShareCount() {
  return parseInt(localStorage.getItem(SHARE_UNLOCK_KEY) || '0', 10);
}

function incrementShareCount() {
  const next = getShareCount() + 1;
  localStorage.setItem(SHARE_UNLOCK_KEY, String(next));
  return next;
}

/* ============================================================
   BUG FIX #2 — isShareUnlocked
   The previous version used: count % 5 === 0
   This evaluates to TRUE when count = 0 (because 0 % 5 === 0).
   So on every first attempt, the gate was silently bypassed,
   the free download ran, but useFreeDownload() was never called
   properly inside the callback — so the counter never decremented.
   Fix: only unlock when count is a POSITIVE multiple of 5,
   then reset to 0 so the next action needs 5 fresh shares.
   ============================================================ */
function isShareUnlocked() {
  const count = getShareCount();
  if (count > 0 && count % SHARE_UNLOCK_GOAL === 0) {
    localStorage.setItem(SHARE_UNLOCK_KEY, '0');
    return true;
  }
  return false;
}

/* ============================================================
   SHARE UNLOCK MODAL
   ============================================================ */
function showUnlockModal(type, onUnlock) {
  if (isShareUnlocked()) {
    if (typeof onUnlock === 'function') onUnlock();
    return;
  }

  document.getElementById('ghj-unlock-overlay')?.remove();

  const typeConfig = {
    cv: {
      icon: '📄',
      title: 'Unlock Your Free CV Download',
      subtitle: 'Share GamHub Jobs with friends on WhatsApp to unlock your free CV PDF.',
      benefit: 'Your CV PDF — Free',
      benefitSub: 'Unlocks after 5 WhatsApp shares',
      proceedLabel: 'Download My CV PDF →',
    },
    coverletter: {
      icon: '✉️',
      title: 'Unlock Your Free Cover Letter',
      subtitle: 'Share GamHub Jobs with your network to unlock your free Cover Letter PDF.',
      benefit: 'Your Cover Letter PDF — Free',
      benefitSub: 'Unlocks after 5 WhatsApp shares',
      proceedLabel: 'Download My Cover Letter →',
    },
    job: {
      icon: '🚀',
      title: 'Submit Your Free Job Listing',
      subtitle: 'Share GamHub Jobs with 5 contacts on WhatsApp to publish your free job listing.',
      benefit: 'Free Job Listing — Live within 24hrs',
      benefitSub: 'Submits after 5 WhatsApp shares',
      proceedLabel: 'Submit My Job Listing →',
    },
  };

  const cfg = typeConfig[type] || typeConfig.cv;
  const currentCount = getShareCount();

  const overlay = document.createElement('div');
  overlay.id = 'ghj-unlock-overlay';
  overlay.innerHTML = `
    <div class="ghj-unlock-backdrop" id="ghj-unlock-backdrop"></div>
    <div class="ghj-unlock-modal" id="ghj-unlock-modal" role="dialog" aria-modal="true" aria-labelledby="ghj-unlock-title">

      <button class="ghj-unlock-close" id="ghj-unlock-close" aria-label="Close">✕</button>

      <div class="ghj-unlock-icon-wrap">
        <div class="ghj-unlock-icon">${cfg.icon}</div>
        <div class="ghj-unlock-icon-ring"></div>
      </div>

      <h2 class="ghj-unlock-title" id="ghj-unlock-title">${cfg.title}</h2>
      <p class="ghj-unlock-sub">${cfg.subtitle}</p>

      <div class="ghj-unlock-benefit">
        <span class="ghj-unlock-benefit-label">🎁 ${cfg.benefit}</span>
        <span class="ghj-unlock-benefit-sub">${cfg.benefitSub}</span>
      </div>

      <div class="ghj-unlock-progress-wrap">
        <div class="ghj-unlock-progress-header">
          <span class="ghj-unlock-progress-label">Share Progress</span>
          <span class="ghj-unlock-progress-count" id="ghj-unlock-count">${currentCount}/${SHARE_UNLOCK_GOAL} shares</span>
        </div>
        <div class="ghj-unlock-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="${SHARE_UNLOCK_GOAL}"
          aria-valuenow="${currentCount}"
          id="ghj-unlock-track">
          <div class="ghj-unlock-fill" id="ghj-unlock-fill"
            style="width:${(currentCount / SHARE_UNLOCK_GOAL) * 100}%"></div>
          ${Array.from({length: SHARE_UNLOCK_GOAL}, (_, i) => `
            <div class="ghj-unlock-pip ${i < currentCount ? 'done' : ''}"
              style="left:${((i + 1) / SHARE_UNLOCK_GOAL) * 100}%"></div>
          `).join('')}
        </div>
        <div class="ghj-unlock-steps">
          ${Array.from({length: SHARE_UNLOCK_GOAL}, (_, i) => `
            <div class="ghj-unlock-step ${i < currentCount ? 'done' : ''}">
              ${i < currentCount ? '✓' : i + 1}
            </div>
          `).join('')}
        </div>
      </div>

      <button class="ghj-unlock-share-btn" id="ghj-unlock-share-btn">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.77 1.8 6.77L2 30l7.43-1.75A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.3 1.01 1.04-4.2-.28-.44A11.5 11.5 0 1 1 16 27.5zm6.35-8.6c-.35-.17-2.06-1.02-2.38-1.13-.32-.12-.55-.17-.78.17-.23.35-.9 1.13-1.1 1.36-.2.23-.4.26-.75.09-.35-.17-1.48-.55-2.82-1.74-1.04-.93-1.75-2.08-1.95-2.43-.2-.35-.02-.54.15-.71.16-.16.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.67-.58-.78-.59h-.67c-.23 0-.6.09-.91.43-.32.35-1.2 1.17-1.2 2.85s1.23 3.3 1.4 3.53c.17.23 2.42 3.7 5.86 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.06-.84 2.35-1.66.29-.81.29-1.51.2-1.66-.08-.14-.31-.23-.66-.4z"/>
        </svg>
        Share on WhatsApp
        <span class="ghj-unlock-share-hint" id="ghj-unlock-share-hint">
          ${SHARE_UNLOCK_GOAL - currentCount} more share${(SHARE_UNLOCK_GOAL - currentCount) === 1 ? '' : 's'} to unlock
        </span>
      </button>

      <div class="ghj-unlock-complete" id="ghj-unlock-complete" style="display:none">
        <div class="ghj-unlock-complete-icon">🎉</div>
        <h3>Unlocked! You're amazing.</h3>
        <p>Thank you for sharing GamHub Jobs with The Gambia!</p>
        <button class="ghj-unlock-proceed-btn" id="ghj-unlock-proceed-btn">
          ✦ ${cfg.proceedLabel}
        </button>
      </div>

      <p class="ghj-unlock-note">Each click opens WhatsApp with a ready-made message. Progress saves automatically.</p>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));
  document.body.style.overflow = 'hidden';

  document.getElementById('ghj-unlock-close')
    .addEventListener('click', () => closeUnlockModal());
  document.getElementById('ghj-unlock-backdrop')
    .addEventListener('click', () => closeUnlockModal());
  document.getElementById('ghj-unlock-share-btn')
    .addEventListener('click', () => handleUnlockShare(type, onUnlock));
  document.getElementById('ghj-unlock-proceed-btn')
    ?.addEventListener('click', () => {
      closeUnlockModal();
      if (typeof onUnlock === 'function') onUnlock();
    });
}

/* ============================================================
   HANDLE SHARE CLICK
   ============================================================ */
function handleUnlockShare(type, onUnlock) {
  const encoded = encodeURIComponent(GHJ_SHARE_MESSAGE);
  window.open('https://wa.me/?text=' + encoded, '_blank', 'noopener,noreferrer');

  const newCount = incrementShareCount();
  updateUnlockUI(newCount);

  if (newCount >= SHARE_UNLOCK_GOAL) {
    setTimeout(() => triggerUnlockSuccess(type, onUnlock), 600);
  } else {
    const remaining = SHARE_UNLOCK_GOAL - newCount;
    toast(`${newCount}/${SHARE_UNLOCK_GOAL} shares done — ${remaining} more to unlock ✦`, 'gold', 3000);
  }
}

/* ============================================================
   UPDATE PROGRESS BAR UI
   ============================================================ */
function updateUnlockUI(count) {
  const fill    = document.getElementById('ghj-unlock-fill');
  const countEl = document.getElementById('ghj-unlock-count');
  const hintEl  = document.getElementById('ghj-unlock-share-hint');
  const track   = document.getElementById('ghj-unlock-track');
  const stepsEl = document.querySelector('.ghj-unlock-steps');

  if (!fill) return;

  fill.style.width = Math.min((count / SHARE_UNLOCK_GOAL) * 100, 100) + '%';
  if (countEl) countEl.textContent = `${count}/${SHARE_UNLOCK_GOAL} shares`;
  if (track)   track.setAttribute('aria-valuenow', String(count));

  if (hintEl) {
    const remaining = SHARE_UNLOCK_GOAL - count;
    hintEl.textContent = remaining > 0
      ? `${remaining} more share${remaining === 1 ? '' : 's'} to unlock`
      : '🔓 Unlocked!';
  }

  document.querySelectorAll('.ghj-unlock-pip').forEach((pip, i) => {
    pip.classList.toggle('done', i < count);
  });

  if (stepsEl) {
    stepsEl.querySelectorAll('.ghj-unlock-step').forEach((step, i) => {
      if (i < count) { step.classList.add('done'); step.textContent = '✓'; }
    });
  }

  if (count >= SHARE_UNLOCK_GOAL) fill.classList.add('complete');
}

/* ============================================================
   TRIGGER UNLOCK COMPLETE STATE
   ============================================================ */
function triggerUnlockSuccess(type, onUnlock) {
  const shareBtn   = document.getElementById('ghj-unlock-share-btn');
  const completeEl = document.getElementById('ghj-unlock-complete');
  const modal      = document.getElementById('ghj-unlock-modal');

  if (shareBtn)   shareBtn.style.display = 'none';
  if (completeEl) completeEl.style.display = '';
  if (modal)      modal.classList.add('unlocked');

  toast('🎉 Unlocked! Thank you for sharing GamHub Jobs!', 'success', 5000);

  document.getElementById('ghj-unlock-proceed-btn')
    ?.addEventListener('click', () => {
      closeUnlockModal();
      if (typeof onUnlock === 'function') onUnlock();
    });
}

/* ============================================================
   CLOSE MODAL
   ============================================================ */
function closeUnlockModal() {
  const overlay = document.getElementById('ghj-unlock-overlay');
  if (!overlay) return;
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
  setTimeout(() => overlay.remove(), 400);
}

/* ============================================================
   BUG FIX #3 — safePDFDownload
   Problem: executePDFDownload() was called immediately after
   closeUnlockModal(). The modal removal takes 400ms, body
   overflow was still 'hidden', and the CV paper element
   hadn't been repainted by the browser yet. html2canvas
   captured a blank/broken layout as a result.
   Fix: wait 900ms (modal gone + overflow restored + repaint),
   then explicitly re-render the document before exporting.
   ============================================================ */
function safePDFDownload(type) {
  setTimeout(() => {
    if (type === 'cv') {
      showView('preview');
      renderCV();
      const ready = document.fonts ? document.fonts.ready : Promise.resolve();
      ready.then(() => setTimeout(() => executePDFDownload('cv'), 700));

    } else if (type === 'coverletter') {
      showView('coverletter');
      renderCoverLetter();
      const ready = document.fonts ? document.fonts.ready : Promise.resolve();
      ready.then(() => setTimeout(() => executePDFDownload('coverletter'), 700));

    } else if (type === 'bundle') {
      showView('preview');
      renderCV();
      const ready = document.fonts ? document.fonts.ready : Promise.resolve();
      ready.then(() => setTimeout(() => executePDFDownload('bundle'), 700));
    }
  }, 900);
}

/* ============================================================
   PATCHED downloadPDF()
   Overrides the version in script.js (last definition wins).

   Every download — free or paid — now requires 5 shares first.
   After sharing:
     • free quota left  → consume it, toast confirmation, safe export
     • no free quota    → payment modal
   ============================================================ */
async function downloadPDF() {
  if (!currentUser) {
    showAuthModal(function() { downloadPDF(); });
    return;
  }
  if (currentView !== 'preview') {
    showView('preview');
    setTimeout(() => downloadPDF(), 600);
    return;
  }

  showUnlockModal('cv', async () => {
    toast('Checking your download allowance…', 'default', 2000);
    const freeLeft = await getFreeDownloadsLeft();

    if (freeLeft > 0) {
      await useFreeDownload();
      toast(
        'Free download used ✦ Next download costs GMD ' +
        MODEMPAY_CONFIG.DOWNLOAD_PRICES.cv + '.',
        'gold', 6000
      );
      trackCVDownload();
      safePDFDownload('cv');
    } else {
      showDownloadPaymentModal('cv');
    }
  });
}

/* ============================================================
   PATCHED downloadCoverLetter()
   ============================================================ */
async function downloadCoverLetter() {
  if (!currentUser) {
    showAuthModal(function() { downloadCoverLetter(); });
    return;
  }
  if (currentView !== 'coverletter') {
    showView('coverletter');
    setTimeout(() => downloadCoverLetter(), 600);
    return;
  }

  showUnlockModal('coverletter', async () => {
    toast('Checking your download allowance…', 'default', 2000);
    const freeLeft = await getFreeDownloadsLeft();

    if (freeLeft > 0) {
      await useFreeDownload();
      toast(
        'Free download used ✦ Next download costs GMD ' +
        MODEMPAY_CONFIG.DOWNLOAD_PRICES.coverletter + '.',
        'gold', 6000
      );
      safePDFDownload('coverletter');
    } else {
      showDownloadPaymentModal('coverletter');
    }
  });
}

/* ============================================================
   BUG FIX #1 — PATCHED submitJobPost()
   Old: saved job to DB first, showed share modal as optional boost.
   New: share modal is shown BEFORE any saving. The actual
        sbInsertJob() call only happens inside the onUnlock callback.
   Paid plans (Featured / Premium) skip the share gate entirely
   and go straight to ModemPay as before.
   ============================================================ */
async function submitJobPost() {
  const title       = document.getElementById('pj-title')?.value.trim()        || '';
  const company     = document.getElementById('pj-company')?.value.trim()      || '';
  const email       = document.getElementById('pj-email')?.value.trim()        || '';
  const location    = document.getElementById('pj-location')?.value            || '';
  const deadline    = document.getElementById('pj-deadline')?.value            || '';
  const description = document.getElementById('pj-description')?.value.trim()  || '';

  if (!title)                    { toast('Please enter a job title', 'error');              return; }
  if (!company)                  { toast('Please enter your company name', 'error');        return; }
  if (!email || !email.includes('@')) { toast('Please enter a valid contact email', 'error'); return; }
  if (!location)                 { toast('Please select a location', 'error');              return; }
  if (!deadline)                 { toast('Please set an application deadline', 'error');    return; }
  if (description.length < 100)  { toast('Description must be at least 100 characters', 'error'); return; }

  const jobType      = document.querySelector('input[name="jobtype"]:checked')?.value || 'Full Time';
  const salary       = document.getElementById('pj-salary')?.value.trim()       || '';
  const experience   = document.getElementById('pj-experience')?.value          || '';
  const industry     = document.getElementById('pj-industry')?.value            || '';
  const website      = document.getElementById('pj-website')?.value.trim()      || '';
  const applyUrl     = document.getElementById('pj-apply-url')?.value.trim()    || '';
  const requirements = document.getElementById('pj-requirements')?.value.trim() || '';
  const perks        = getSelectedPerks();
  const plan         = getSelectedPlan();
  const logoUrl      = document.getElementById('pj-logo-url')?.value.trim()     || '';

  const rawPayload = {
    title, company, email, location, deadline,
    description, requirements,
    type:     jobType,
    salary, experience, industry,
    website,  apply_url: applyUrl,
    logo_url: logoUrl,
    perks:    JSON.stringify(perks),
    plan,
    approved:     false,
    submitted_at: new Date().toISOString(),
  };
  const jobPayload = sanitizeJobPayload(rawPayload);
  const amount     = MODEMPAY_CONFIG.PRICES[plan] || 0;

  // Paid plan → skip share gate, go to payment
  if (amount > 0) {
    submitJobPaymentForm(jobPayload, plan, amount);
    return;
  }

  // Free plan → share gate BEFORE saving
  showUnlockModal('job', async () => {
    const btn = document.getElementById('submit-job-btn');
    if (btn) { btn.classList.add('btn-submitting'); btn.disabled = true; }
    await _saveJobAndNotify(jobPayload);
    if (btn) { btn.classList.remove('btn-submitting'); btn.disabled = false; }
  });
}

/* ============================================================
   INTERNAL: save job + send admin WhatsApp notification
   Only called after the share gate passes.
   ============================================================ */
async function _saveJobAndNotify(jobPayload) {
  let savedRemotely = false;
  try {
    if (SB_CONNECTED) {
      await sbInsertJob(jobPayload);
      savedRemotely = true;
    }
  } catch(err) {
    console.warn('[Employer] Supabase insert failed:', err.message);
  }

  const localId  = `local-${Date.now()}`;
  const localJob = { ...jobPayload, id: localId, _local: !savedRemotely };
  const myJobs   = loadData_raw(EMPLOYER_STORAGE.myJobs) || [];
  myJobs.unshift(localJob);
  saveData_raw(EMPLOYER_STORAGE.myJobs, myJobs);

  document.getElementById('post-job-form').style.display = 'none';
  document.getElementById('submission-success').classList.add('show');

  toast(
    savedRemotely
      ? 'Job submitted! Saved to database ✓'
      : 'Job saved locally (connect Supabase to go live)',
    savedRemotely ? 'success' : 'gold', 4000
  );
  updatePortalStats();

  setTimeout(() => sendJobNotificationWhatsApp(jobPayload, jobPayload.plan || 'free'), 600);
}

/* ============================================================
   Stub out saveJobDirectly so the original in script.js
   cannot fire for free listings — submitJobPost() now owns
   the full free-listing flow via _saveJobAndNotify().
   ============================================================ */
async function saveJobDirectly(jobPayload) {
  console.log('[GHJ] saveJobDirectly() suppressed — share gate is active');
}
