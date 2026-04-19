/* ============================================================
   GAMHUB JOBS — WHATSAPP "UNLOCK BY SHARING" FEATURE
   ============================================================
   HOW TO ADD THIS TO YOUR PROJECT:
   1. Paste the CSS block (unlock-share.css) into styles.css
   2. Paste this entire JS block at the bottom of script.js,
      just before the closing DOMContentLoaded comment.
   3. Replace the existing downloadPDF() and downloadCoverLetter()
      functions in script.js with the patched versions below.
   4. Call showUnlockModal('cv') / showUnlockModal('coverletter') /
      showUnlockModal('job') from the respective trigger points.
   ============================================================ */

/* ============================================================
   SHARE UNLOCK — CONSTANTS & STATE
   ============================================================ */
const SHARE_UNLOCK_KEY   = 'ghj_share_unlock_count';
const SHARE_UNLOCK_GOAL  = 5;

// The WhatsApp share message promoting GamHub Jobs
const GHJ_SHARE_MESSAGE =
  '🇬🇲 *GamHub Jobs* — Gambia\'s #1 Career Platform!\n\n' +
  '✦ Build a professional CV in 3 minutes\n' +
  '✉ Generate tailored cover letters with AI\n' +
  '🔍 Search verified jobs across The Gambia\n' +
  '🏢 Employers can post jobs free\n\n' +
  'It\'s 100% free to start 👇\n' +
  'https://gamhubjobs.com';

function getShareCount() {
  return parseInt(localStorage.getItem(SHARE_UNLOCK_KEY) || '0', 10);
}

function incrementShareCount() {
  const current = getShareCount();
  const next = Math.min(current + 1, SHARE_UNLOCK_GOAL);
  localStorage.setItem(SHARE_UNLOCK_KEY, String(next));
  return next;
}

function isShareUnlocked() {
  return getShareCount() >= SHARE_UNLOCK_GOAL;
}

/* ============================================================
   SHARE UNLOCK MODAL — RENDERER
   ============================================================
   type: 'cv' | 'coverletter' | 'job'
   onUnlock: callback fired when shares reach goal
   ============================================================ */
function showUnlockModal(type, onUnlock) {
  // If already unlocked, run callback immediately
  if (isShareUnlocked()) {
    if (typeof onUnlock === 'function') onUnlock();
    return;
  }

  // Remove any existing modal
  document.getElementById('ghj-unlock-overlay')?.remove();

  const typeConfig = {
    cv: {
      icon: '📄',
      title: 'Unlock Your Free CV Download',
      subtitle: 'Share GamHub Jobs with friends on WhatsApp to unlock your free CV PDF download.',
      benefit: 'Your CV PDF — Free',
      benefitSub: 'Unlocks after 5 WhatsApp shares',
    },
    coverletter: {
      icon: '✉️',
      title: 'Unlock Your Free Cover Letter',
      subtitle: 'Share GamHub Jobs with your network to unlock your free Cover Letter PDF.',
      benefit: 'Your Cover Letter PDF — Free',
      benefitSub: 'Unlocks after 5 WhatsApp shares',
    },
    job: {
      icon: '🚀',
      title: 'Boost Your Job Listing',
      subtitle: 'Share GamHub Jobs to help more Gambians find your listing and unlock priority review.',
      benefit: 'Priority 12hr Review',
      benefitSub: 'Unlocks after 5 WhatsApp shares',
    },
  };

  const cfg = typeConfig[type] || typeConfig.cv;
  const currentCount = getShareCount();

  const overlay = document.createElement('div');
  overlay.id = 'ghj-unlock-overlay';
  overlay.innerHTML = `
    <div class="ghj-unlock-backdrop" id="ghj-unlock-backdrop"></div>
    <div class="ghj-unlock-modal" id="ghj-unlock-modal" role="dialog" aria-modal="true" aria-labelledby="ghj-unlock-title">

      <!-- Close -->
      <button class="ghj-unlock-close" id="ghj-unlock-close" aria-label="Close">✕</button>

      <!-- Header -->
      <div class="ghj-unlock-icon-wrap">
        <div class="ghj-unlock-icon">${cfg.icon}</div>
        <div class="ghj-unlock-icon-ring"></div>
      </div>

      <h2 class="ghj-unlock-title" id="ghj-unlock-title">${cfg.title}</h2>
      <p class="ghj-unlock-sub">${cfg.subtitle}</p>

      <!-- Benefit pill -->
      <div class="ghj-unlock-benefit">
        <span class="ghj-unlock-benefit-label">🎁 ${cfg.benefit}</span>
        <span class="ghj-unlock-benefit-sub">${cfg.benefitSub}</span>
      </div>

      <!-- Progress section -->
      <div class="ghj-unlock-progress-wrap">
        <div class="ghj-unlock-progress-header">
          <span class="ghj-unlock-progress-label">Share Progress</span>
          <span class="ghj-unlock-progress-count" id="ghj-unlock-count">${currentCount}/${SHARE_UNLOCK_GOAL} shares</span>
        </div>
        <div class="ghj-unlock-track" role="progressbar" aria-valuemin="0" aria-valuemax="${SHARE_UNLOCK_GOAL}" aria-valuenow="${currentCount}" id="ghj-unlock-track">
          <div class="ghj-unlock-fill" id="ghj-unlock-fill" style="width:${(currentCount / SHARE_UNLOCK_GOAL) * 100}%"></div>
          ${Array.from({length: SHARE_UNLOCK_GOAL}, (_,i) => `
            <div class="ghj-unlock-pip ${i < currentCount ? 'done' : ''}" style="left:${((i + 1) / SHARE_UNLOCK_GOAL) * 100}%"></div>
          `).join('')}
        </div>
        <div class="ghj-unlock-steps">
          ${Array.from({length: SHARE_UNLOCK_GOAL}, (_,i) => `
            <div class="ghj-unlock-step ${i < currentCount ? 'done' : ''}">
              ${i < currentCount ? '✓' : i + 1}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Share button -->
      <button class="ghj-unlock-share-btn" id="ghj-unlock-share-btn">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.77 1.8 6.77L2 30l7.43-1.75A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.3 1.01 1.04-4.2-.28-.44A11.5 11.5 0 1 1 16 27.5zm6.35-8.6c-.35-.17-2.06-1.02-2.38-1.13-.32-.12-.55-.17-.78.17-.23.35-.9 1.13-1.1 1.36-.2.23-.4.26-.75.09-.35-.17-1.48-.55-2.82-1.74-1.04-.93-1.75-2.08-1.95-2.43-.2-.35-.02-.54.15-.71.16-.16.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.57-.58-.78-.59h-.67c-.23 0-.6.09-.91.43-.32.35-1.2 1.17-1.2 2.85s1.23 3.3 1.4 3.53c.17.23 2.42 3.7 5.86 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.06-.84 2.35-1.66.29-.81.29-1.51.2-1.66-.08-.14-.31-.23-.66-.4z"/>
        </svg>
        Share on WhatsApp
        <span class="ghj-unlock-share-hint" id="ghj-unlock-share-hint">${SHARE_UNLOCK_GOAL - currentCount} more share${SHARE_UNLOCK_GOAL - currentCount === 1 ? '' : 's'} to unlock</span>
      </button>

      <!-- Already unlocked state (hidden initially) -->
      <div class="ghj-unlock-complete" id="ghj-unlock-complete" style="display:none">
        <div class="ghj-unlock-complete-icon">🎉</div>
        <h3>Unlocked! You're amazing.</h3>
        <p>Thank you for sharing GamHub Jobs with the Gambia! Your content is ready.</p>
        <button class="ghj-unlock-proceed-btn" id="ghj-unlock-proceed-btn">
          ✦ Get My ${type === 'job' ? 'Priority Review' : 'Free PDF'} →
        </button>
      </div>

      <p class="ghj-unlock-note">Each click opens WhatsApp with a pre-written message. Your progress saves automatically.</p>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });
  });

  // Lock body scroll
  document.body.style.overflow = 'hidden';

  // Wire up close button
  document.getElementById('ghj-unlock-close').addEventListener('click', () => closeUnlockModal());
  document.getElementById('ghj-unlock-backdrop').addEventListener('click', () => closeUnlockModal());

  // Wire up share button
  document.getElementById('ghj-unlock-share-btn').addEventListener('click', () => {
    handleUnlockShare(type, onUnlock);
  });

  // Wire up proceed button (shown after unlock)
  document.getElementById('ghj-unlock-proceed-btn')?.addEventListener('click', () => {
    closeUnlockModal();
    if (typeof onUnlock === 'function') onUnlock();
  });
}

/* ============================================================
   HANDLE SHARE CLICK
   ============================================================ */
function handleUnlockShare(type, onUnlock) {
  // Open WhatsApp share
  const encoded = encodeURIComponent(GHJ_SHARE_MESSAGE);
  window.open('https://wa.me/?text=' + encoded, '_blank', 'noopener,noreferrer');

  // Increment count
  const newCount = incrementShareCount();

  // Update UI
  updateUnlockUI(newCount);

  // Check if unlocked
  if (newCount >= SHARE_UNLOCK_GOAL) {
    setTimeout(() => triggerUnlockSuccess(type, onUnlock), 600);
  } else {
    const remaining = SHARE_UNLOCK_GOAL - newCount;
    toast(`${newCount}/${SHARE_UNLOCK_GOAL} shares done! ${remaining} more to unlock ✦`, 'gold', 3000);
  }
}

/* ============================================================
   UPDATE PROGRESS BAR UI
   ============================================================ */
function updateUnlockUI(count) {
  const fill       = document.getElementById('ghj-unlock-fill');
  const countEl    = document.getElementById('ghj-unlock-count');
  const hintEl     = document.getElementById('ghj-unlock-share-hint');
  const track      = document.getElementById('ghj-unlock-track');
  const stepsEl    = document.querySelector('.ghj-unlock-steps');

  if (!fill) return;

  const pct = Math.min((count / SHARE_UNLOCK_GOAL) * 100, 100);
  fill.style.width = pct + '%';

  if (countEl) countEl.textContent = `${count}/${SHARE_UNLOCK_GOAL} shares`;
  if (track)   track.setAttribute('aria-valuenow', count);

  if (hintEl) {
    const remaining = SHARE_UNLOCK_GOAL - count;
    hintEl.textContent = remaining > 0
      ? `${remaining} more share${remaining === 1 ? '' : 's'} to unlock`
      : '🔓 Unlocked!';
  }

  // Update pips
  document.querySelectorAll('.ghj-unlock-pip').forEach((pip, i) => {
    pip.classList.toggle('done', i < count);
  });

  // Update step badges
  if (stepsEl) {
    stepsEl.querySelectorAll('.ghj-unlock-step').forEach((step, i) => {
      if (i < count) {
        step.classList.add('done');
        step.textContent = '✓';
      }
    });
  }

  // Add celebration shimmer to fill bar
  if (count >= SHARE_UNLOCK_GOAL) {
    fill.classList.add('complete');
  }
}

/* ============================================================
   TRIGGER UNLOCK COMPLETE STATE
   ============================================================ */
function triggerUnlockSuccess(type, onUnlock) {
  const shareBtn  = document.getElementById('ghj-unlock-share-btn');
  const completeEl = document.getElementById('ghj-unlock-complete');
  const modal     = document.getElementById('ghj-unlock-modal');

  if (shareBtn)   shareBtn.style.display = 'none';
  if (completeEl) completeEl.style.display = '';
  if (modal)      modal.classList.add('unlocked');

  toast('🎉 Unlocked! Thank you for sharing GamHub Jobs with Gambia!', 'success', 5000);

  // Re-wire proceed button in case it was replaced
  document.getElementById('ghj-unlock-proceed-btn')?.addEventListener('click', () => {
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
   PATCHED downloadPDF()
   Replace the existing downloadPDF() in script.js with this.
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

  // Check share unlock first
  if (!isShareUnlocked()) {
    showUnlockModal('cv', async () => {
      // After unlock, run the original download logic
      toast('Checking your download allowance…', 'default', 2000);
      const freeLeft = await getFreeDownloadsLeft();
      if (freeLeft > 0) {
        await useFreeDownload();
        trackCVDownload();
        executePDFDownload('cv');
      } else {
        showDownloadPaymentModal('cv');
      }
    });
    return;
  }

  toast('Checking your download allowance…', 'default', 2000);
  const freeLeft = await getFreeDownloadsLeft();

  if (freeLeft > 0) {
    await useFreeDownload();
    if (freeLeft - 1 === 0) {
      toast('Free download used ✦ Next download costs GMD ' + MODEMPAY_CONFIG.DOWNLOAD_PRICES.cv + '.', 'gold', 5000);
    } else {
      toast('Free download — ' + (freeLeft - 1) + ' remaining.', 'default', 2500);
    }
    trackCVDownload();
    executePDFDownload('cv');
    return;
  }

  showDownloadPaymentModal('cv');
}

/* ============================================================
   PATCHED downloadCoverLetter()
   Replace the existing downloadCoverLetter() in script.js with this.
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

  // Check share unlock first
  if (!isShareUnlocked()) {
    showUnlockModal('coverletter', async () => {
      toast('Checking your download allowance…', 'default', 2000);
      const freeLeft = await getFreeDownloadsLeft();
      if (freeLeft > 0) {
        await useFreeDownload();
        executePDFDownload('coverletter');
      } else {
        showDownloadPaymentModal('coverletter');
      }
    });
    return;
  }

  toast('Checking your download allowance…', 'default', 2000);
  const freeLeft = await getFreeDownloadsLeft();

  if (freeLeft > 0) {
    await useFreeDownload();
    if (freeLeft - 1 === 0) {
      toast('Free download used ✦ Next download costs GMD ' + MODEMPAY_CONFIG.DOWNLOAD_PRICES.coverletter + '.', 'gold', 5000);
    } else {
      toast('Free download — ' + (freeLeft - 1) + ' remaining.', 'default', 2500);
    }
    executePDFDownload('coverletter');
    return;
  }

  showDownloadPaymentModal('coverletter');
}

/* ============================================================
   PATCHED saveJobDirectly()
   Replace the existing saveJobDirectly() in script.js with this.
   After a free job is saved, show the share unlock modal.
   ============================================================ */
async function saveJobDirectly(jobPayload) {
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
    savedRemotely ? 'Job submitted! Saved to database ✓' : 'Job saved locally (connect Supabase to go live)',
    savedRemotely ? 'success' : 'gold', 4000
  );
  updatePortalStats();

  // Show WhatsApp notification + Share Unlock modal
  setTimeout(() => {
    // First send the admin notification
    sendJobNotificationWhatsApp(jobPayload, jobPayload.plan || 'free');

    // Then after a beat, show the share unlock for the employer
    setTimeout(() => {
      showUnlockModal('job', () => {
        toast('🎉 Your listing has been boosted! It will go live within 12 hours.', 'success', 6000);
      });
    }, 2500);
  }, 800);
}
