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
let TB_PROFILES        = [...TB_SAMPLE_PROFILES];
let _tbSelectedProfile = null;   // currently open profile page

const TB_STORAGE_KEY  = 'ghj_talent_profiles';
const TB_ADMIN_WA_NUM = '2206371941';

const TB_PLAN_PRICES = {
  free:     0,
  featured: 10,   /* GMD */
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
}

/* ============================================================
   CREATE PROFILE CARD
   Entire card is clickable — matches job search card pattern.
   ============================================================ */
function tbCreateCard(profile) {
  const card = document.createElement('div');
  card.className = 'tb-card' + (profile.featured ? ' tb-card-featured' : '');

  /* Whole card is a button — matches openJobPage() pattern */
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => tbOpenProfilePage(profile));

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
  const extraCount = (profile.skills || '').split(',').filter(s => s.trim()).length - 4;
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
        ${extraCount > 0 ? `<span class="tb-skill-more">+${extraCount} more</span>` : ''}
      </div>` : ''}
    <div class="tb-card-footer">
      <span class="tb-posted-ago">${postedAgo}</span>
      <div class="tb-card-actions">
        <button class="tb-btn-view"
          onclick="event.stopPropagation();tbOpenProfilePage(TB_PROFILES.find(p=>p.id==='${tbEsc(profile.id)}'))">
          View Profile →
        </button>
        <button class="tb-btn-contact"
          onclick="event.stopPropagation();tbContactCandidate('${tbEsc(profile.id)}')">
          Contact →
        </button>
      </div>
    </div>
  `;

  return card;
}

/* ============================================================
   OPEN PROFILE PAGE — full page view, mirrors openJobPage()
   ============================================================ */
function tbOpenProfilePage(profile) {
  if (!profile) return;
  _tbSelectedProfile = profile;

  const initials = (profile.name || 'XX').split(' ')
    .slice(0, 2).map(w => w[0]).join('').toUpperCase();

  /* Avatar */
  const avatarEl = document.getElementById('tp-profile-avatar');
  if (avatarEl) avatarEl.textContent = initials;

  /* Name & role */
  const nameEl = document.getElementById('tp-profile-name');
  const roleEl = document.getElementById('tp-profile-role');
  if (nameEl) nameEl.textContent = profile.name  || '';
  if (roleEl) roleEl.textContent = (profile.title || '') +
    (profile.category ? ' · ' + profile.category : '');

  /* Chips row */
  const availClass = {
    'Immediately':    'avail-now',
    '2 Weeks':        'avail-soon',
    '1 Month':        'avail-month',
    'Open to Offers': 'avail-open',
  }[profile.availability] || 'avail-open';

  const chipsEl = document.getElementById('tp-profile-chips');
  if (chipsEl) chipsEl.innerHTML = [
    profile.featured     && `<span class="jd-chip" style="background:rgba(212,168,83,0.12);border:1px solid rgba(212,168,83,0.35);color:var(--gold2)">⭐ Featured</span>`,
    profile.availability && `<span class="jd-chip jd-chip-type ${availClass}">⚡ ${tbEsc(profile.availability)}</span>`,
    profile.job_type     && `<span class="jd-chip jd-chip-type">💼 ${tbEsc(profile.job_type)}</span>`,
    profile.salary       && `<span class="jd-chip jd-chip-salary">💰 ${tbEsc(profile.salary)}</span>`,
  ].filter(Boolean).join('');

  /* Details grid */
  const detailItems = [
    { label: 'Experience', value: profile.experience },
    { label: 'Location',   value: profile.location   },
    { label: 'Education',  value: profile.education  },
    { label: 'Salary Expectation', value: profile.salary },
  ].filter(i => i.value);

  const detailsGrid = document.getElementById('tp-profile-details-grid');
  if (detailsGrid) {
    detailsGrid.innerHTML = detailItems.map(i => `
      <div class="jd-detail-item">
        <div class="jd-detail-label">${tbEsc(i.label)}</div>
        <div class="jd-detail-value">${tbEsc(i.value)}</div>
      </div>
    `).join('');
  }
  const secDetails = document.getElementById('tp-profile-sec-details');
  if (secDetails) secDetails.style.display = detailItems.length ? '' : 'none';

  /* About / Summary */
  const summaryEl    = document.getElementById('tp-profile-summary');
  const secAbout     = document.getElementById('tp-profile-sec-about');
  if (summaryEl) summaryEl.textContent = profile.summary || '';
  if (secAbout)  secAbout.style.display = profile.summary ? '' : 'none';

  /* Skills */
  const skills    = (profile.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  const skillsEl  = document.getElementById('tp-profile-skills');
  const secSkills = document.getElementById('tp-profile-sec-skills');
  if (skillsEl)  skillsEl.innerHTML  = skills.map(s =>
    `<span class="tb-skill-tag">${tbEsc(s)}</span>`).join('');
  if (secSkills) secSkills.style.display = skills.length ? '' : 'none';

  /* Links */
  const linksEl  = document.getElementById('tp-profile-links');
  const secLinks = document.getElementById('tp-profile-sec-links');
  if (linksEl) {
    linksEl.innerHTML = [
      profile.link    && `<a href="${tbEsc(profile.link)}" target="_blank" rel="noopener noreferrer" class="tb-link-btn">LinkedIn / Portfolio ↗</a>`,
      profile.cv_link && `<a href="${tbEsc(profile.cv_link)}" target="_blank" rel="noopener noreferrer" class="tb-link-btn">View CV ↗</a>`,
    ].filter(Boolean).join('');
  }
  if (secLinks) secLinks.style.display = (profile.link || profile.cv_link) ? '' : 'none';

  /* Contact actions */
  const actionsEl = document.getElementById('tp-profile-actions');
  if (actionsEl) {
    actionsEl.innerHTML = '';

    const contactBtn = document.createElement('button');
    contactBtn.className   = 'jd-apply-btn jd-apply-btn-primary';
    contactBtn.textContent = '✉ Send Email →';
    contactBtn.addEventListener('click', () => tbContactCandidate(profile.id));
    actionsEl.appendChild(contactBtn);

    const backBtn = document.createElement('button');
    backBtn.className   = 'jd-apply-btn jd-apply-btn-ghost';
    backBtn.textContent = '← Back to Talent Board';
    backBtn.addEventListener('click', tbCloseProfilePage);
    actionsEl.appendChild(backBtn);
  }

  /* Navigate */
  if (typeof showView === 'function') showView('talent-profile');
}

/* ============================================================
   CLOSE PROFILE PAGE — back to talent board
   ============================================================ */
function tbCloseProfilePage() {
  _tbSelectedProfile = null;
  if (typeof showView === 'function') showView('talent-board');
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
   SUBMIT PROFILE
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

  // Generate a stable token from name + timestamp truncated
const _stableToken = 'tb-' + (name.toLowerCase().replace(/\s+/g,'-').slice(0,12)) + '-' + Math.floor(Date.now()/1000);

const payload = {
  id:           _stableToken,
  name:         tbSanitize(name, 100),
  // ... rest of fields unchanged
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

  try { localStorage.setItem('tb_pending_profile', JSON.stringify(payload)); } catch(e) {}

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
   ============================================================ */
function tbOpenSummaryHelper() {
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
    el.style.background = (i + 1) <= step ? 'var(--gold)' : 'rgba(255,255,255,0.1)';
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
  const jobTitle    = document.getElementById('tb-qa-jobtitle')?.value.trim()    || 'professional';
  const years       = document.getElementById('tb-qa-years')?.value.trim()       || 'several years';
  const industry    = document.getElementById('tb-qa-industry')?.value.trim()    || 'my field';
  const roleLooking = document.getElementById('tb-qa-rolelooking')?.value.trim() || '';
  const skillsRaw   = document.getElementById('tb-qa-skills')?.value.trim()      || '';
  const orgTypes    = document.getElementById('tb-qa-orgtypes')?.value.trim()    || 'a range of organisations';
  const strength    = document.getElementById('tb-qa-strength')?.value.trim()    || 'commitment to excellence';
  const achievement = document.getElementById('tb-qa-achievement')?.value.trim() || '';
  const toneKey     = document.getElementById('tb-qa-tone')?.value               || 'confident';
  const certs       = document.getElementById('tb-qa-certs')?.value.trim()       || '';

  const adj        = TB_QA_TONES[toneKey] || TB_QA_TONES.confident;
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

  return (
    `${opener} Specialising in ${skillStr}, with a proven track record of delivering results at ${orgTypes}.` +
    (achievement ? ` Most recently, ${achievement.toLowerCase().replace(/\.$/, '')}.` : '') +
    (certs       ? ` Holds ${certs}.` : '') +
    ` Recognised for ${strength.toLowerCase().replace(/\.$/, '')} and a commitment to continuous professional growth.` +
    (roleLooking ? ` Currently seeking ${roleLooking.toLowerCase().replace(/\.$/, '')}.` : '')
  ).trim();
}

async function tbQaGenerate() {
  const text = tbQaBuildSummary();
  tbCloseQA();

  const ta = document.getElementById('tpp-summary');
  if (!ta) return;

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
   FEATURED PROFILE — WhatsApp admin notification
   Mirrors tbSendAdminNotification but marks plan as FEATURED PAID
   ============================================================ */
function tbSendAdminNotificationFeatured(profile) {
  try {
    const submittedAt = new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const msg =
      '🌟 *NEW FEATURED TALENT PROFILE — GamHub Jobs*\n' +
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
      '• Plan: FEATURED (GMD 10 — PAID ✅)\n\n' +
      '📧 *CONTACT*\n' +
      '• Email: '        + (profile.email        || '—') + '\n' +
      '• Phone: '        + (profile.phone        || '—') + '\n' +
      '• Link: '         + (profile.link         || '—') + '\n\n' +
      '📝 *SUMMARY*\n'  + (profile.summary       || '—') + '\n\n' +
      '🛠 *SKILLS*\n'   + (profile.skills        || '—') + '\n\n' +
      '🎓 *EDUCATION*\n'+ (profile.education     || '—') + '\n\n' +
      '🕐 Submitted: '  + submittedAt;

    const encoded = encodeURIComponent(msg);
    window.open('https://wa.me/2206371941?text=' + encoded, '_blank', 'noopener,noreferrer');
  } catch(e) {
    console.warn('[TalentBoard] Featured notification failed:', e);
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

    if (status === 'success') {
      try {
        const pending = JSON.parse(localStorage.getItem('tb_pending_profile') || 'null');

        if (!pending) {
          if (typeof showView === 'function') showView('talent-board');
          // Send generic WhatsApp notification
          const genericMsg = encodeURIComponent(
            '🌟 *NEW FEATURED TALENT PROFILE — GamHub Jobs*\n' +
            '━━━━━━━━━━━━━━━━━━━━\n\n' +
            'Payment received for a Featured Profile.\n' +
            'Profile data could not be loaded automatically.\n' +
            'Please contact the candidate to re-submit.\n\n' +
            '🕐 ' + new Date().toLocaleString('en-GB')
          );
          window.open('https://wa.me/2206371941?text=' + genericMsg, '_blank', 'noopener,noreferrer');
          return;
        }

        pending.featured = true;
        pending.plan     = 'featured';
        pending.approved = true;
        localStorage.removeItem('tb_pending_profile');

        tbLoadLocalProfiles();
        tbSaveLocalProfile(pending);
        TB_PROFILES.unshift(pending);
        TB_PROFILES.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

        // Send WhatsApp notification — same as free but marked FEATURED + PAID
        tbSendAdminNotificationFeatured(pending);

        if (typeof showView === 'function') showView('talent-board');
        if (typeof tbRenderProfiles === 'function') tbRenderProfiles(TB_PROFILES);

      } catch(e) {
        console.error('[TalentBoard] Payment return error:', e);
        if (typeof showView === 'function') showView('talent-board');
      }

    } else if (status === 'cancelled') {
      if (typeof showView === 'function') showView('talent-post');
      if (typeof toast === 'function') {
        toast('Payment cancelled — your profile was not posted.', 'error', 5000);
      }
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
  /* Wire up back button on profile page */
  const backBtn = document.getElementById('tp-profile-back-btn');
  if (backBtn) backBtn.addEventListener('click', tbCloseProfilePage);

  const _originalShowView = window.showView;

  window.showView = function(id) {
    tbForceUnlockScroll();

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
