/* ============================================================
   GAMHUB JOBS — TALENT BOARD
   talent-board.js
   ============================================================ */

/* ============================================================
   SAMPLE PROFILES
   ============================================================ */
const TB_SAMPLE_PROFILES = [
  {
    id: 'sample-1',
    name: 'Fatou Jallow',
    title: 'Senior Marketing Manager',
    category: 'Marketing',
    experience: '5–10 years',
    location: 'Banjul',
    availability: 'Open to Offers',
    summary: 'Results-driven marketing professional with 7 years across banking and FMCG sectors in The Gambia. Specialising in digital campaigns, brand strategy, and team leadership. Led campaigns that grew social reach by 40% and drove measurable sales uplift.',
    skills: 'Digital Marketing, Brand Strategy, Google Ads, Meta Ads, Team Leadership, Analytics',
    education: 'BSc Business Administration — University of The Gambia, 2016',
    email: 'fatou.jallow@example.gm',
    phone: '+220 7XX XXXX',
    link: 'https://linkedin.com/in/fatoujallow',
    cv_link: '',
    job_type: 'Full-Time',
    salary: 'GMD 35,000+',
    plan: 'free',
    featured: false,
    approved: true,
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Omar Ceesay',
    title: 'Full-Stack Developer',
    category: 'IT & Tech',
    experience: '3–5 years',
    location: 'Serrekunda',
    availability: 'Immediately',
    summary: 'Full-stack developer with strong experience in React, Node.js, and Supabase. Built and deployed multiple production apps for Gambian businesses. Passionate about solving real-world problems with clean, maintainable code.',
    skills: 'React, Node.js, JavaScript, Supabase, PostgreSQL, REST APIs, Git',
    education: 'BSc Computer Science — University of The Gambia, 2020',
    email: 'omar.ceesay@example.gm',
    phone: '',
    link: 'https://github.com/omarceesay',
    cv_link: '',
    job_type: 'Full-Time',
    salary: 'GMD 30,000 – 45,000',
    plan: 'featured',
    featured: true,
    approved: true,
    submitted_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'sample-3',
    name: 'Mariama Sanneh',
    title: 'Finance Officer',
    category: 'Finance',
    experience: '3–5 years',
    location: 'Kairaba Avenue',
    availability: '2 Weeks',
    summary: 'Qualified accountant with ACCA Part 2 and 4 years of experience in financial reporting, budgeting, and compliance within the NGO and banking sectors. Highly detail-oriented with strong Excel and Sage proficiency.',
    skills: 'ACCA, Financial Reporting, Budgeting, Sage, Microsoft Excel, Tax Compliance',
    education: 'ACCA Part 2 · BSc Accounting — Gambia College, 2018',
    email: 'mariama.sanneh@example.gm',
    phone: '+220 6XX XXXX',
    link: '',
    cv_link: '',
    job_type: 'Full-Time',
    salary: 'GMD 28,000 – 38,000',
    plan: 'free',
    featured: false,
    approved: true,
    submitted_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-4',
    name: 'Lamin Touray',
    title: 'UI/UX Designer',
    category: 'Design',
    experience: '1–3 years',
    location: 'Fajara',
    availability: 'Immediately',
    summary: 'Creative UI/UX designer with a portfolio spanning mobile apps, dashboards, and brand identities for Gambian startups. Proficient in Figma and Adobe XD with a strong eye for detail and user-centred design principles.',
    skills: 'Figma, Adobe XD, Illustrator, Photoshop, Prototyping, User Research',
    education: 'HND Graphic Design — Management Development Institute, 2021',
    email: 'lamin.touray@example.gm',
    phone: '',
    link: 'https://behance.net/lamintouray',
    cv_link: '',
    job_type: 'Full-Time',
    salary: 'GMD 22,000 – 32,000',
    plan: 'free',
    featured: false,
    approved: true,
    submitted_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'sample-5',
    name: 'Isatou Baldeh',
    title: 'Programme Officer — NGO',
    category: 'NGO / Development',
    experience: '5–10 years',
    location: 'Banjul',
    availability: 'Open to Offers',
    summary: 'Experienced development professional with 6 years managing community projects in gender, health, and youth empowerment across The Gambia. Strong M&E background and excellent donor reporting skills. French speaker.',
    skills: 'Project Management, M&E, Donor Reporting, Community Engagement, French, English',
    education: 'MA Development Studies — University of London (Distance), 2019',
    email: 'isatou.baldeh@example.gm',
    phone: '+220 7XX XXXX',
    link: 'https://linkedin.com/in/isatou-baldeh',
    cv_link: '',
    job_type: 'Full-Time',
    salary: 'Negotiable',
    plan: 'free',
    featured: false,
    approved: true,
    submitted_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample-6',
    name: 'Yankuba Drammeh',
    title: 'IT Support Technician',
    category: 'IT & Tech',
    experience: '1–3 years',
    location: 'Brikama',
    availability: '1 Month',
    summary: 'CompTIA A+ certified technician with hands-on experience in hardware maintenance, network troubleshooting, and helpdesk support. Eager to grow into a systems administration role.',
    skills: 'CompTIA A+, Windows, Linux, Networking, Hardware, Helpdesk',
    education: 'HND Information Technology — MDI Gambia, 2022',
    email: 'yankuba.drammeh@example.gm',
    phone: '',
    link: '',
    cv_link: '',
    job_type: 'Full-Time',
    salary: 'GMD 15,000 – 20,000',
    plan: 'free',
    featured: false,
    approved: true,
    submitted_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

/* ============================================================
   STATE & CONSTANTS
   ============================================================ */
let TB_PROFILES = [...TB_SAMPLE_PROFILES];

const TB_STORAGE_KEY  = 'ghj_talent_profiles';
const TB_ADMIN_WA_NUM = '2206371941';

const TB_PLAN_PRICES = {
  free:     0,
  featured: 50,   /* GMD */
};

/* ============================================================
   PLAN HELPERS
   ============================================================ */
function tbGetSelectedPlan() {
  return document.querySelector('.tb-plan-card.selected')?.dataset?.plan || 'free';
}

function tbSelectPlan(card, plan) {
  document.querySelectorAll('.tb-plan-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  card.dataset.plan = plan;

  const btn    = document.getElementById('tp-submit-btn');
  const noteEl = document.getElementById('tp-submit-note');

  const labels = {
    free:     '✦ Post My Profile Free',
    featured: '💳 Pay GMD ' + TB_PLAN_PRICES.featured + ' & Post Featured Profile',
  };
  const notes = {
    free:     'Free · Unlocked by sharing with 5 contacts on WhatsApp',
    featured: 'You will be redirected to ModemPay to complete payment securely in GMD.',
  };

  if (btn)    btn.textContent    = labels[plan] || labels.free;
  if (noteEl) noteEl.textContent = notes[plan]  || notes.free;
}

/* ============================================================
   SKILL BLOCKS — dynamic list identical to CV builder
   ============================================================ */
function tbAddSkill(name) {
  const list = document.getElementById('tpp-skills-list');
  if (!list) return;
  const div  = document.createElement('div');
  div.className = 'dynamic-item skill-entry';
  div.innerHTML = `
    <div class="skill-row">
      <input type="text" class="form-control skill-name-input"
        value="${tbEsc(name || '')}"
        placeholder="e.g. Microsoft Excel, Photoshop, Public Speaking">
      <button class="btn-remove"
        onclick="this.closest('.skill-entry').remove()">✕</button>
    </div>
  `;
  list.appendChild(div);
}

function tbInitSkillBlocks() {
  const list = document.getElementById('tpp-skills-list');
  if (!list) return;
  if (list.children.length === 0) {
    tbAddSkill();
    tbAddSkill();
  }
}

function tbCollectSkills() {
  return Array.from(
    document.querySelectorAll('#tpp-skills-list .skill-name-input')
  ).map(i => i.value.trim()).filter(Boolean).join(', ');
}

/* ============================================================
   BODY SCROLL LOCK HELPERS
   ============================================================ */
let _tbScrollLockCount = 0;
let _tbSavedScrollY    = 0;

function tbLockScroll() {
  if (_tbScrollLockCount === 0) {
    _tbSavedScrollY              = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = '-' + _tbSavedScrollY + 'px';
    document.body.style.width    = '100%';
    document.body.style.overflow = 'hidden';
  }
  _tbScrollLockCount++;
}

function tbUnlockScroll() {
  if (_tbScrollLockCount <= 0) return;
  _tbScrollLockCount--;
  if (_tbScrollLockCount === 0) {
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    document.body.style.overflow = '';
    window.scrollTo(0, _tbSavedScrollY);
  }
}

function tbForceUnlockScroll() {
  _tbScrollLockCount           = 0;
  document.body.style.position = '';
  document.body.style.top      = '';
  document.body.style.width    = '';
  document.body.style.overflow = '';
}

/* ============================================================
   INIT
   ============================================================ */
function initTalentBoard() {
  tbForceUnlockScroll();
  tbLoadLocalProfiles();
  tbRenderProfiles(TB_PROFILES);
  tbInitModal();
}

/* ============================================================
   LOAD LOCALLY SUBMITTED PROFILES
   ============================================================ */
function tbLoadLocalProfiles() {
  try {
    const local    = JSON.parse(localStorage.getItem(TB_STORAGE_KEY) || '[]');
    const approved = local.filter(p => p.approved !== false);
    const featured = approved.filter(p => p.featured);
    const standard = approved.filter(p => !p.featured);
    TB_PROFILES    = [...featured, ...standard, ...TB_SAMPLE_PROFILES];
  } catch(e) {
    TB_PROFILES = [...TB_SAMPLE_PROFILES];
  }
}

function tbSaveLocalProfile(profile) {
  try {
    const existing = JSON.parse(localStorage.getItem(TB_STORAGE_KEY) || '[]');
    existing.unshift(profile);
    localStorage.setItem(TB_STORAGE_KEY, JSON.stringify(existing));
  } catch(e) {}
}

/* ============================================================
   FILTER
   ============================================================ */
function tbFilterProfiles() {
  const kw    = (document.getElementById('tb-keyword')?.value || '').toLowerCase().trim();
  const cat   = document.getElementById('tb-cat')?.value   || '';
  const avail = document.getElementById('tb-avail')?.value || '';

  const filtered = TB_PROFILES.filter(p => {
    const inText = !kw ||
      (p.name   || '').toLowerCase().includes(kw) ||
      (p.title  || '').toLowerCase().includes(kw) ||
      (p.skills || '').toLowerCase().includes(kw) ||
      (p.summary|| '').toLowerCase().includes(kw);
    const inCat   = !cat   || p.category     === cat;
    const inAvail = !avail || p.availability === avail;
    return inText && inCat && inAvail;
  });

  tbRenderProfiles(filtered);
}

/* ============================================================
   RENDER PROFILE GRID — featured profiles always first
   ============================================================ */
function tbRenderProfiles(list) {
  const grid  = document.getElementById('tb-profile-grid');
  const empty = document.getElementById('tb-empty');
  const meta  = document.getElementById('tb-result-meta');
  if (!grid) return;

  grid.innerHTML = '';

  if (!list.length) {
    grid.style.display = 'none';
    if (empty) empty.style.display = '';
    if (meta)  meta.innerHTML = 'Showing <strong>0</strong> profiles';
    return;
  }

  const sorted = [
    ...list.filter(p => p.featured),
    ...list.filter(p => !p.featured),
  ];

  grid.style.display = '';
  if (empty) empty.style.display = 'none';
  if (meta)  meta.innerHTML =
    `Showing <strong>${sorted.length}</strong> of <strong>${TB_PROFILES.length}</strong> professionals`;

  sorted.forEach(profile => grid.appendChild(tbCreateCard(profile)));

  requestAnimationFrame(() => {
    const firstContact = grid.querySelector('.tb-btn-contact');
    if (firstContact && !firstContact.id) firstContact.id = 'tb-first-contact-btn';
  });
}

/* ============================================================
   CREATE PROFILE CARD
   ============================================================ */
function tbCreateCard(profile) {
  const card = document.createElement('div');
  card.className = 'tb-card' + (profile.featured ? ' tb-card-featured' : '');

  const initials = (profile.name || 'XX').split(' ')
    .slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const availClass = {
    'Immediately':    'avail-now',
    '2 Weeks':        'avail-soon',
    '1 Month':        'avail-month',
    'Open to Offers': 'avail-open',
  }[profile.availability] || 'avail-open';

  const skills    = (profile.skills || '')
    .split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
  const postedAgo = tbTimeAgo(profile.submitted_at);

  card.innerHTML = `
    ${profile.featured
      ? '<div class="tb-plan-badge-featured" style="margin-bottom:10px">⭐ Featured</div>'
      : ''}
    <div class="tb-card-head">
      <div class="tb-avatar" aria-hidden="true">${initials}</div>
      <div class="tb-card-info">
        <h3 class="tb-card-name">${tbEsc(profile.name)}</h3>
        <p class="tb-card-title">${tbEsc(profile.title)}</p>
      </div>
      <div class="tb-avail-badge ${availClass}">${tbEsc(profile.availability || 'Open')}</div>
    </div>
    <div class="tb-card-meta">
      ${profile.category   ? `<span class="tb-meta-item">🎯 ${tbEsc(profile.category)}</span>` : ''}
      ${profile.experience ? `<span class="tb-meta-item">⏱ ${tbEsc(profile.experience)}</span>` : ''}
      ${profile.location   ? `<span class="tb-meta-item">📍 ${tbEsc(profile.location)}</span>`  : ''}
      ${profile.job_type   ? `<span class="tb-meta-item">💼 ${tbEsc(profile.job_type)}</span>`  : ''}
    </div>
    <p class="tb-card-summary">${tbEsc(profile.summary || '')}</p>
    ${skills.length ? `
      <div class="tb-card-skills">
        ${skills.map(s => `<span class="tb-skill-tag">${tbEsc(s)}</span>`).join('')}
        ${(profile.skills || '').split(',').length > 4
          ? `<span class="tb-skill-more">+${(profile.skills || '').split(',').length - 4} more</span>`
          : ''}
      </div>` : ''}
    <div class="tb-card-footer">
      <span class="tb-posted-ago">${postedAgo}</span>
      <div class="tb-card-actions">
        <button class="tb-btn-view" onclick="tbOpenProfile('${tbEsc(profile.id)}')">
          View Profile →
        </button>
        <button class="tb-btn-contact" onclick="tbContactCandidate('${tbEsc(profile.id)}')">
          Contact →
        </button>
      </div>
    </div>
  `;

  return card;
}

/* ============================================================
   PROFILE DETAIL MODAL
   ============================================================ */
function tbInitModal() {
  const backdrop = document.getElementById('tb-modal-backdrop');
  const closeBtn = document.getElementById('tb-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', tbCloseModal);
  if (backdrop) backdrop.addEventListener('click', e => {
    if (e.target === backdrop) tbCloseModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') tbCloseModal();
  });
}

function tbOpenProfile(id) {
  const profile = TB_PROFILES.find(p => String(p.id) === String(id));
  if (!profile) return;

  const initials = (profile.name || 'XX').split(' ')
    .slice(0, 2).map(w => w[0]).join('').toUpperCase();

  document.getElementById('tb-modal-avatar').textContent = initials;
  document.getElementById('tb-modal-name').textContent   = profile.name  || '';
  document.getElementById('tb-modal-role').textContent   = profile.title || '';

  const availClass = {
    'Immediately':    'avail-now',
    '2 Weeks':        'avail-soon',
    '1 Month':        'avail-month',
    'Open to Offers': 'avail-open',
  }[profile.availability] || 'avail-open';

  document.getElementById('tb-modal-chips').innerHTML = `
    ${profile.featured     ? `<span class="tb-chip tb-chip-featured">⭐ Featured</span>` : ''}
    ${profile.availability ? `<span class="tb-chip ${availClass}">⚡ ${tbEsc(profile.availability)}</span>` : ''}
    ${profile.category     ? `<span class="tb-chip tb-chip-cat">🎯 ${tbEsc(profile.category)}</span>` : ''}
    ${profile.job_type     ? `<span class="tb-chip tb-chip-type">💼 ${tbEsc(profile.job_type)}</span>` : ''}
    ${profile.salary       ? `<span class="tb-chip tb-chip-salary">💰 ${tbEsc(profile.salary)}</span>` : ''}
  `;

  const skills = (profile.skills || '').split(',').map(s => s.trim()).filter(Boolean);

  document.getElementById('tb-modal-body').innerHTML = `
    <div class="tb-modal-section">
      <div class="tb-modal-section-title">📋 Details</div>
      <div class="tb-detail-grid">
        ${profile.experience ? `<div class="tb-detail-item"><div class="tb-detail-label">Experience</div><div class="tb-detail-val">${tbEsc(profile.experience)}</div></div>` : ''}
        ${profile.location   ? `<div class="tb-detail-item"><div class="tb-detail-label">Location</div><div class="tb-detail-val">${tbEsc(profile.location)}</div></div>` : ''}
        ${profile.education  ? `<div class="tb-detail-item"><div class="tb-detail-label">Education</div><div class="tb-detail-val">${tbEsc(profile.education)}</div></div>` : ''}
        ${profile.salary     ? `<div class="tb-detail-item"><div class="tb-detail-label">Salary Expectation</div><div class="tb-detail-val">${tbEsc(profile.salary)}</div></div>` : ''}
      </div>
    </div>
    ${profile.summary ? `
    <div class="tb-modal-section">
      <div class="tb-modal-section-title">👤 About</div>
      <p class="tb-modal-body-text">${tbEsc(profile.summary)}</p>
    </div>` : ''}
    ${skills.length ? `
    <div class="tb-modal-section">
      <div class="tb-modal-section-title">🛠 Skills</div>
      <div class="tb-skills-wrap">
        ${skills.map(s => `<span class="tb-skill-tag">${tbEsc(s)}</span>`).join('')}
      </div>
    </div>` : ''}
    ${(profile.link || profile.cv_link) ? `
    <div class="tb-modal-section">
      <div class="tb-modal-section-title">🔗 Links</div>
      <div class="tb-links-wrap">
        ${profile.link    ? `<a href="${tbEsc(profile.link)}" target="_blank" rel="noopener noreferrer" class="tb-link-btn">LinkedIn / Portfolio ↗</a>` : ''}
        ${profile.cv_link ? `<a href="${tbEsc(profile.cv_link)}" target="_blank" rel="noopener noreferrer" class="tb-link-btn">View CV ↗</a>` : ''}
      </div>
    </div>` : ''}
    <div class="tb-modal-section tb-modal-contact-section">
      <div class="tb-modal-section-title">🚀 Contact This Candidate</div>
      <p style="font-size:13px;color:var(--text2);margin-bottom:14px;line-height:1.7">
        Reach out directly via email to start a conversation.
      </p>
      <div class="tb-contact-actions">
        <button class="tb-apply-btn tb-apply-primary"
          onclick="tbContactCandidate('${tbEsc(profile.id)}')">
          ✉ Send Email →
        </button>
        <button class="tb-apply-btn tb-apply-ghost"
          onclick="tbCloseModal()">← Back</button>
      </div>
    </div>
  `;

  const backdrop = document.getElementById('tb-modal-backdrop');
  if (!backdrop) return;
  backdrop.style.display = 'flex';
  tbLockScroll();
  requestAnimationFrame(() => requestAnimationFrame(() => backdrop.classList.add('tb-open')));
}

function tbCloseModal() {
  const backdrop = document.getElementById('tb-modal-backdrop');
  if (!backdrop || !backdrop.classList.contains('tb-open')) return;
  backdrop.classList.remove('tb-open');
  tbUnlockScroll();
  setTimeout(() => { backdrop.style.display = 'none'; }, 320);
}

/* ============================================================
   CONTACT CANDIDATE
   ============================================================ */
function tbContactCandidate(id) {
  const profile = TB_PROFILES.find(p => String(p.id) === String(id));
  if (!profile || !profile.email) {
    tbToast('No contact email available for this profile.', 'error');
    return;
  }
  const subject = encodeURIComponent('Employer Enquiry via GamHub Jobs — ' + profile.title);
  const body    = encodeURIComponent(
    'Hello ' + (profile.name || 'there') + ',\n\n' +
    'I found your profile on the GamHub Jobs Talent Board and I am interested in discussing a potential opportunity with you.\n\n' +
    'Please let me know if you are available for a conversation.\n\n' +
    'Kind regards'
  );
  window.location.href = 'mailto:' + profile.email + '?subject=' + subject + '&body=' + body;
}

/* ============================================================
   SHOW POST FORM — navigates to dedicated page
   ============================================================ */
function tbShowPostForm() {
  if (typeof currentUser !== 'undefined' && !currentUser) {
    if (typeof showAuthModal === 'function') {
      showAuthModal(() => tbShowPostForm());
      return;
    }
  }

  const formEl    = document.getElementById('tp-page-form');
  const successEl = document.getElementById('tp-page-success');
  if (formEl)    formEl.style.display    = '';
  if (successEl) successEl.style.display = 'none';

  /* Reset plan to free */
  document.querySelectorAll('.tb-plan-card').forEach((c, i) => {
    c.classList.toggle('selected', i === 0);
  });
  const btn    = document.getElementById('tp-submit-btn');
  const noteEl = document.getElementById('tp-submit-note');
  if (btn)    btn.textContent    = '✦ Post My Profile Free';
  if (noteEl) noteEl.textContent = 'Free · Unlocked by sharing with 5 contacts on WhatsApp';

  if (typeof showView === 'function') showView('talent-post');

  requestAnimationFrame(() => {
    tbInitSkillBlocks();
    tbAutoFillFromCV();
  });
}

/* ============================================================
   CLOSE POST FORM — no-op, kept so stale calls don't throw
   ============================================================ */
function tbClosePostForm() {}

/* ============================================================
   AUTO-FILL FROM CV BUILDER
   ============================================================ */
function tbAutoFillFromCV() {
  try {
    const cv = JSON.parse(localStorage.getItem('gamhubjobs_cv_data') || 'null');
    if (!cv) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val && !el.value) el.value = val;
    };

    setVal('tpp-name',    cv.fullname);
    setVal('tpp-title',   cv.title);
    setVal('tpp-email',   cv.email);
    setVal('tpp-phone',   cv.phone);
    setVal('tpp-summary', cv.summary);

    /* Populate skill blocks from CV */
    if (cv.skills && cv.skills.length) {
      const list = document.getElementById('tpp-skills-list');
      if (list && list.children.length <= 2) {
        list.innerHTML = '';
        cv.skills.forEach(s => { if (s.name) tbAddSkill(s.name); });
        if (list.children.length === 0) tbAddSkill();
      }
    }

    if (cv.education && cv.education.length) {
      const eduEl    = document.getElementById('tpp-education');
      const firstEdu = cv.education[0];
      if (eduEl && !eduEl.value && firstEdu)
        eduEl.value = [firstEdu.qualification, firstEdu.institution, firstEdu.year]
          .filter(Boolean).join(' — ');
    }
  } catch(e) {}
}

function tbSelectPill(radio) {
  const group = radio.closest('.type-pills');
  if (!group) return;
  group.querySelectorAll('.type-pill').forEach(p => p.classList.remove('selected'));
  radio.closest('.type-pill').classList.add('selected');
}

function tbCharCount(inputId, countId, max) {
  const val = document.getElementById(inputId)?.value || '';
  const el  = document.getElementById(countId);
  if (el) {
    el.textContent = `${val.length} / ${max}`;
    el.style.color = val.length > max * 0.9 ? '#f87171' : 'var(--muted)';
  }
}

/* ============================================================
   SUBMIT PROFILE — reads from tpp- prefixed IDs (no duplicates)
   ============================================================ */
function tbSubmitProfile() {
  const name     = document.getElementById('tpp-name')?.value.trim()    || '';
  const title    = document.getElementById('tpp-title')?.value.trim()   || '';
  const category = document.getElementById('tpp-category')?.value       || '';
  const email    = document.getElementById('tpp-email')?.value.trim()   || '';
  const summary  = document.getElementById('tpp-summary')?.value.trim() || '';

  if (!name)                          { tbToast('Please enter your full name', 'error');            return; }
  if (!title)                         { tbToast('Please enter your professional title', 'error');   return; }
  if (!category)                      { tbToast('Please select a profession category', 'error');    return; }
  if (!email || !email.includes('@')) { tbToast('Please enter a valid email', 'error');             return; }
  if (summary.length < 80)            { tbToast('Summary must be at least 80 characters', 'error'); return; }

  const plan = tbGetSelectedPlan();

  const payload = {
    id:           'local-' + Date.now(),
    name:         tbSanitize(name, 100),
    title:        tbSanitize(title, 120),
    category:     tbSanitize(category, 80),
    experience:   tbSanitize(document.getElementById('tpp-experience')?.value || '', 50),
    location:     tbSanitize(document.getElementById('tpp-location')?.value   || '', 100),
    availability: document.querySelector('input[name="tpp-avail"]:checked')?.value || 'Open to Offers',
    summary:      tbSanitize(summary, 1000),
    skills:       tbSanitize(tbCollectSkills(), 300),
    education:    tbSanitize(document.getElementById('tpp-education')?.value.trim() || '', 200),
    email:        tbSanitize(email, 254),
    phone:        tbSanitize(document.getElementById('tpp-phone')?.value.trim()     || '', 30),
    link:         tbSanitizeUrl(document.getElementById('tpp-link')?.value.trim()   || ''),
    cv_link:      tbSanitizeUrl(document.getElementById('tpp-cv-link')?.value.trim()|| ''),
    job_type:     document.querySelector('input[name="tpp-jobtype"]:checked')?.value || 'Full-Time',
    salary:       tbSanitize(document.getElementById('tpp-salary')?.value.trim()    || '', 80),
    plan:         plan,
    featured:     plan === 'featured',
    approved:     true,
    submitted_at: new Date().toISOString(),
  };

  const amount = TB_PLAN_PRICES[plan] || 0;

  if (amount > 0) {
    tbSubmitFeaturedPayment(payload, amount);
  } else {
    if (typeof showUnlockModal === 'function') {
      showUnlockModal('talent', () => tbFinaliseProfileSubmit(payload));
    } else {
      tbFinaliseProfileSubmit(payload);
    }
  }
}

/* ============================================================
   FEATURED PAYMENT — redirect to ModemPay
   ============================================================ */
function tbSubmitFeaturedPayment(payload, amount) {
  if (typeof rateLimiter !== 'undefined' && !rateLimiter.check('payment')) {
    const wait = rateLimiter.waitSeconds('payment');
    tbToast('Too many payment attempts — please wait ' + wait + ' seconds.', 'error', 5000);
    return;
  }

  try {
    localStorage.setItem('tb_pending_profile', JSON.stringify(payload));
  } catch(e) {}

  const base      = window.location.origin + window.location.pathname;
  const returnUrl = base + '?tb_payment=success&tb_token=' + encodeURIComponent(payload.id);
  const cancelUrl = base + '?tb_payment=cancelled';
  const mpTrim    = (val, max) => String(val || '').trim().slice(0, max || 255);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://checkout.modempay.com/api/pay';
  form.style.display = 'none';

  const fields = {
    public_key:     mpTrim(typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.MODEMPAY_PUBLIC_KEY : '', 255),
    amount:         mpTrim(String(amount), 20),
    currency:       'GMD',
    customer_name:  mpTrim(payload.name  || 'GamHub Jobs User', 100),
    customer_email: mpTrim(payload.email || 'user@gamhubjobs.gm', 100),
    customer_phone: '7000000',
    return_url:     mpTrim(returnUrl, 255),
    cancel_url:     mpTrim(cancelUrl, 255),
    'metadata[source]':   'gamhubjobs-talent',
    'metadata[plan]':     'featured',
    'metadata[tb_token]': mpTrim(payload.id, 80),
  };

  Object.entries(fields).forEach(([key, val]) => {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = key;
    input.value = val;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  tbToast('Redirecting to ModemPay… GMD ' + amount, 'gold', 2000);
  setTimeout(() => form.submit(), 600);
}

/* ============================================================
   FINALISE PROFILE SUBMIT
   ============================================================ */
function tbFinaliseProfileSubmit(payload) {
  tbSaveLocalProfile(payload);
  TB_PROFILES.unshift(payload);
  TB_PROFILES.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const formEl    = document.getElementById('tp-page-form');
  const successEl = document.getElementById('tp-page-success');
  if (formEl)    formEl.style.display    = 'none';
  if (successEl) successEl.style.display = '';

  tbSendAdminNotification(payload);
  tbRenderProfiles(TB_PROFILES);
  tbToast('Profile posted! Employers can now find you ✦', 'success', 5000);
}

/* ============================================================
   ADMIN WHATSAPP NOTIFICATION
   ============================================================ */
function tbSendAdminNotification(profile) {
  try {
    const submittedAt = new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const planLabel = profile.featured
      ? 'FEATURED (GMD ' + TB_PLAN_PRICES.featured + ' — paid)'
      : 'FREE (share-to-unlock)';

    const msg =
      '🌟 *NEW TALENT PROFILE — GamHub Jobs*\n' +
      '━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 *CANDIDATE DETAILS*\n' +
      '• Name: '         + (profile.name         || '—') + '\n' +
      '• Title: '        + (profile.title        || '—') + '\n' +
      '• Category: '     + (profile.category     || '—') + '\n' +
      '• Experience: '   + (profile.experience   || '—') + '\n' +
      '• Location: '     + (profile.location     || '—') + '\n' +
      '• Availability: ' + (profile.availability || '—') + '\n' +
      '• Job Type: '     + (profile.job_type     || '—') + '\n' +
      '• Salary Exp: '   + (profile.salary       || '—') + '\n' +
      '• Plan: '         + planLabel                      + '\n\n' +
      '📧 *CONTACT*\n' +
      '• Email: '        + (profile.email        || '—') + '\n' +
      '• Phone: '        + (profile.phone        || '—') + '\n' +
      '• Link: '         + (profile.link         || '—') + '\n\n' +
      '📝 *SUMMARY*\n'  + (profile.summary       || '—') + '\n\n' +
      '🛠 *SKILLS*\n'   + (profile.skills        || '—') + '\n\n' +
      '🎓 *EDUCATION*\n'+ (profile.education     || '—') + '\n\n' +
      '🕐 Submitted: '  + submittedAt;

    const encoded = encodeURIComponent(msg);
    window.open('https://wa.me/' + TB_ADMIN_WA_NUM + '?text=' + encoded, '_blank', 'noopener,noreferrer');
  } catch(e) {
    console.warn('[TalentBoard] Admin notification failed:', e);
  }
}

/* ============================================================
   TB SUMMARY QA HELPER
   3-step modal with Talent Board-specific questions.
   Same UX pattern as CV builder QA, different questions.
   ============================================================ */
function tbOpenSummaryHelper() {
  /* Reset all fields */
  ['tb-qa-jobtitle','tb-qa-years','tb-qa-industry','tb-qa-rolelooking',
   'tb-qa-skills','tb-qa-orgtypes','tb-qa-strength',
   'tb-qa-achievement','tb-qa-certs'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const toneEl = document.getElementById('tb-qa-tone');
  if (toneEl) toneEl.selectedIndex = 0;

  tbQaGoTo(1);
  const overlay = document.getElementById('tb-qa-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function tbCloseQA() {
  const overlay = document.getElementById('tb-qa-overlay');
  if (overlay) overlay.style.display = 'none';
}

function tbQaGoTo(step) {
  [1, 2, 3].forEach(n => {
    const el = document.getElementById('tb-qa-step' + n);
    if (el) el.style.display = n === step ? '' : 'none';
  });

  ['tb-qa-d1','tb-qa-d2','tb-qa-d3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.background = (i + 1) <= step
      ? 'var(--gold)'
      : 'rgba(255,255,255,0.1)';
  });

  const labels = [
    'Step 1 of 3 — Who you are',
    'Step 2 of 3 — Your strengths',
    'Step 3 of 3 — What you bring',
  ];
  const labelEl = document.getElementById('tb-qa-step-label');
  if (labelEl) labelEl.textContent = labels[step - 1] || '';
}

const TB_QA_TONES = {
  confident: ['accomplished', 'results-driven', 'confident'],
  warm:      ['collaborative', 'people-focused', 'approachable'],
  precise:   ['detail-oriented', 'methodical', 'analytical'],
  dynamic:   ['dynamic', 'high-impact', 'proactive'],
  seasoned:  ['experienced', 'trusted', 'dependable'],
};

function tbQaBuildSummary() {
  const jobTitle    = (document.getElementById('tb-qa-jobtitle')?.value.trim()    || 'professional');
  const years       = (document.getElementById('tb-qa-years')?.value.trim()       || 'several years');
  const industry    = (document.getElementById('tb-qa-industry')?.value.trim()    || 'my field');
  const roleLooking = (document.getElementById('tb-qa-rolelooking')?.value.trim() || '');
  const skillsRaw   = (document.getElementById('tb-qa-skills')?.value.trim()      || '');
  const orgTypes    = (document.getElementById('tb-qa-orgtypes')?.value.trim()    || 'a range of organisations');
  const strength    = (document.getElementById('tb-qa-strength')?.value.trim()    || 'commitment to excellence');
  const achievement = (document.getElementById('tb-qa-achievement')?.value.trim() || '');
  const toneKey     = (document.getElementById('tb-qa-tone')?.value               || 'confident');
  const certs       = (document.getElementById('tb-qa-certs')?.value.trim()       || '');

  const adj = TB_QA_TONES[toneKey] || TB_QA_TONES.confident;

  const skillsList = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
  const skillStr   = skillsList.length >= 2
    ? skillsList.slice(0, 2).join(' and ')
    : (skillsList[0] || 'strong professional skills');

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  const openers = [
    `A ${adj[0]} ${jobTitle} with ${years} of experience in the ${industry} sector.`,
    `An ${adj[1]} ${jobTitle} bringing ${years} of hands-on experience across ${industry}.`,
    `${cap(years)} ${industry} professional specialising as a ${jobTitle}.`,
  ];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  const achieveSentence = achievement
    ? ` Most recently, ${achievement.toLowerCase().replace(/\.$/, '')}.`
    : '';

  const certSentence = certs
    ? ` Holds ${certs}.`
    : '';

  const roleSentence = roleLooking
    ? ` Currently seeking ${roleLooking.toLowerCase().replace(/\.$/, '')}.`
    : '';

  return (
    `${opener} Specialising in ${skillStr}, with a proven track record of delivering results at ${orgTypes}.` +
    `${achieveSentence}${certSentence}` +
    ` Recognised for ${strength.toLowerCase().replace(/\.$/, '')} and a commitment to continuous professional growth.` +
    `${roleSentence}`
  ).trim();
}

async function tbQaGenerate() {
  const text = tbQaBuildSummary();
  tbCloseQA();

  const ta = document.getElementById('tpp-summary');
  if (!ta) return;

  /* Typewriter fill — identical feel to CV builder */
  ta.value = '';
  for (let i = 0; i < text.length; i++) {
    ta.value += text[i];
    if (i % 3 === 0) await new Promise(r => setTimeout(r, 12));
  }
  ta.value = text;
  tbCharCount('tpp-summary', 'tpp-sum-count', 600);

  if (typeof toast === 'function') {
    toast('Summary generated ✦ Edit it to make it your own.', 'gold', 4000);
  }
}

/* ============================================================
   PAYMENT RETURN HANDLER
   ============================================================ */
(function tbCheckPaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('tb_payment');
  const token  = params.get('tb_token');

  if (!status) return;

  window.addEventListener('DOMContentLoaded', () => {
    window.history.replaceState({}, '', window.location.pathname);

    if (status === 'success' && token) {
      try {
        const pending = JSON.parse(localStorage.getItem('tb_pending_profile') || 'null');
        if (pending && pending.id === token) {
          pending.featured = true;
          pending.plan     = 'featured';
          localStorage.removeItem('tb_pending_profile');
          tbLoadLocalProfiles();
          tbFinaliseProfileSubmit(pending);
          if (typeof showView === 'function') showView('talent-post');
          tbToast('Payment confirmed! ✦ Your featured profile is now live.', 'success', 6000);
        } else {
          tbToast('Payment received but profile data was not found. Please contact support.', 'error', 8000);
          if (typeof showView === 'function') showView('talent-board');
        }
      } catch(e) {
        console.error('[TalentBoard] Payment return error:', e);
        tbToast('Payment return error — please contact support.', 'error', 6000);
      }
    } else if (status === 'cancelled') {
      if (typeof showView === 'function') showView('talent-post');
      tbToast('Payment cancelled — your profile was not posted.', 'error', 5000);
    }
  });
})();

/* ============================================================
   UTILITIES
   ============================================================ */
function tbEsc(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function tbSanitize(val, max) {
  return String(val || '').trim().slice(0, max || 500);
}
function tbSanitizeUrl(val) {
  const s = String(val || '').trim();
  return /^https?:\/\//i.test(s) ? s.slice(0, 500) : '';
}
function tbToast(msg, type, duration) {
  if (typeof toast === 'function') toast(msg, type || 'default', duration || 3500);
  else console.log('[TalentBoard]', msg);
}
function tbTimeAgo(iso) {
  if (!iso) return '';
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days  > 0) return days  + 'd ago';
  if (hours > 0) return hours + 'h ago';
  if (mins  > 0) return mins  + 'm ago';
  return 'Just now';
}

/* ============================================================
   HOOK INTO showView() — universal safety net
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const _originalShowView = window.showView;

  window.showView = function(id) {
    tbForceUnlockScroll();

    /* Collapse profile detail modal */
    const viewBackdrop = document.getElementById('tb-modal-backdrop');
    if (viewBackdrop) {
      viewBackdrop.classList.remove('tb-open');
      setTimeout(() => { viewBackdrop.style.display = 'none'; }, 320);
    }

    if (typeof _originalShowView === 'function') _originalShowView(id);

    if (id === 'talent-board') {
      requestAnimationFrame(() => initTalentBoard());
    }

    if (id === 'talent-post') {
      requestAnimationFrame(() => {
        tbInitSkillBlocks();
        tbAutoFillFromCV();
      });
    }
  };
});
