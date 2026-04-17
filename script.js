/* ============================================================
   GAMHUB JOBS — APP CONFIGURATION
   ============================================================ */
const APP_CONFIG = {
  SUPABASE_URL:      'https://whrlhlssojgpbcwregmf.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocmxobHNzb2pncGJjd3JlZ21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTg4NjUsImV4cCI6MjA4OTIzNDg2NX0.4T2hePXxyJ8KdKjbVpGax7wh2ruPCkd2BxHUlcuedno',
  MODEMPAY_PUBLIC_KEY: 'pk_live_51ebe3d202c7d2dfd9b31befc1536124a934c826ea02ba062aae2914bf5c2a39',
  EDGE_FN_URL: 'https://whrlhlssojgpbcwregmf.supabase.co/functions/v1/modempay-charge',
};

(function validateConfig() {
  const required = [
    ['SUPABASE_URL',      APP_CONFIG.SUPABASE_URL],
    ['SUPABASE_ANON_KEY', APP_CONFIG.SUPABASE_ANON_KEY],
    ['MODEMPAY_PUBLIC_KEY', APP_CONFIG.MODEMPAY_PUBLIC_KEY],
  ];
  const missing = required.filter(([, val]) =>
    !val || val.includes('REPLACE') || val.trim() === ''
  );
  if (missing.length > 0) {
    window.addEventListener('DOMContentLoaded', () => {
      missing.forEach(([key]) =>
        toast('Configuration error — ' + key + ' is missing. Please contact support.', 'error', 8000)
      );
    });
  }
})();

/* ============================================================
   UTILITIES
   ============================================================ */
function h(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function sanitizeText(val, maxLen) {
  if (val === null || val === undefined) return '';
  return String(val).trim().slice(0, maxLen || 2000);
}

function sanitizeUrl(val) {
  const s = String(val || '').trim();
  return /^https?:\/\//i.test(s) ? s.slice(0, 500) : '';
}

function sanitizeEmail(val) {
  const s = String(val || '').trim().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : '';
}

function sanitizeNumber(val, min, max) {
  const n = parseInt(val, 10);
  if (isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function sanitizeJobPayload(payload) {
  return {
    title:        sanitizeText(payload.title,        120),
    company:      sanitizeText(payload.company,      100),
    email:        sanitizeEmail(payload.email)  || '',
    location:     sanitizeText(payload.location,     100),
    deadline:     sanitizeText(payload.deadline,      50),
    description:  sanitizeText(payload.description, 5000),
    requirements: sanitizeText(payload.requirements,2000),
    type:         sanitizeText(payload.type,          50),
    salary:       sanitizeText(payload.salary,        80),
    experience:   sanitizeText(payload.experience,    80),
    industry:     sanitizeText(payload.industry,      80),
    website:      sanitizeUrl(payload.website),
    apply_url:    sanitizeUrl(payload.apply_url),
    logo_url:     sanitizeUrl(payload.logo_url),
    perks:        sanitizeText(payload.perks,        500),
    plan:         ['free','featured','premium'].includes(payload.plan) ? payload.plan : 'free',
    approved:     false,
    submitted_at: payload.submitted_at || new Date().toISOString(),
  };
}

function toast(msg, type='default', duration=3500) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success:'✅', error:'❌', gold:'✦', default:'ℹ️' };
  el.innerHTML = `<span>${icons[type]||'ℹ️'}</span> ${h(msg)}`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

function slug(s) {
  return (s||'unnamed').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

/* ============================================================
   VIEW ROUTING
   ============================================================ */
const VIEWS = ['landing','wizard','builder','preview','job-search','job-details','employer','coverletter','privacy','terms'];
let currentView = 'landing';

function showView(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (!el) return;
    el.classList.remove('active');
  });
  const target = document.getElementById(`view-${id}`);
  if (!target) return;
  target.classList.add('active');
  currentView = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.body.className = document.body.className
    .replace(/\bview-\S+/g, '').trim();
  document.body.classList.add('view-' + id);

  if (id === 'builder')     setupBuilderContext();
  if (id === 'preview')     renderCV();
  if (id === 'employer')    initEmployerPortal();
  if (id === 'coverletter') initCoverLetter();
  if (id === 'job-search')  initJobSearchView();

  /* ── fire tour hints for every view ── */
  if (typeof GHJTour !== 'undefined') GHJTour.triggerView(id);
}

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

function toggleMobileNav() {
  const drawer = document.getElementById('mobile-drawer');
  const burger = document.getElementById('hamburger');
  drawer.classList.toggle('open');
  burger.classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobile-drawer').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}
function scrollToFeatures() { showView('landing'); setTimeout(()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'}),100); }
function scrollToHow()      { showView('landing'); setTimeout(()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'}),100); }
function scrollToTemplates(){ showView('landing'); setTimeout(()=>document.getElementById('templates')?.scrollIntoView({behavior:'smooth'}),100); }

/* ============================================================
   DATA STORES
   ============================================================ */
const rateLimiter = (() => {
  const BUCKETS = {
    supabase_write:   { maxCalls: 5,  windowMs: 60000  },
    supabase_read:    { maxCalls: 20, windowMs: 60000  },
    supabase_profile: { maxCalls: 10, windowMs: 60000  },
    scraper:          { maxCalls: 2,  windowMs: 120000 },
    payment:          { maxCalls: 3,  windowMs: 600000 },
    auth:             { maxCalls: 5,  windowMs: 60000  },
  };
  const log = {};

  function check(key) {
    const bucket = BUCKETS[key];
    if (!bucket) return true;
    const now = Date.now();
    if (!log[key]) log[key] = [];
    log[key] = log[key].filter(ts => now - ts < bucket.windowMs);
    if (log[key].length >= bucket.maxCalls) {
      const wait = Math.ceil((bucket.windowMs - (now - log[key][0])) / 1000);
      console.warn('[RateLimit] ' + key + ' blocked — retry in ' + wait + 's');
      return false;
    }
    log[key].push(now);
    return true;
  }

  function waitSeconds(key) {
    const bucket = BUCKETS[key];
    if (!bucket || !log[key] || !log[key].length) return 0;
    const now = Date.now();
    const active = log[key].filter(ts => now - ts < bucket.windowMs);
    if (!active.length || active.length < bucket.maxCalls) return 0;
    return Math.ceil((bucket.windowMs - (now - active[0])) / 1000);
  }

  return { check, waitSeconds };
})();

const STORAGE_KEYS = {
  wizard: 'gamhubjobs_cv_wizard',
  cvData: 'gamhubjobs_cv_data',
  theme:  'gamhubjobs_cv_theme',
  saved:  'folio_saved_jobs',
};

function loadData(key) {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS[key])) || null; } catch { return null; }
}
function saveData(key, val) {
  try { localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(val)); } catch(e) { console.warn('Storage error', e); }
}

/* ============================================================
   PROFESSION DATA
   ============================================================ */
const PROFESSIONS = [
  { id:'marketing', icon:'📣', label:'Marketing Specialist',      desc:'Experts in brand, digital, and campaign strategy.',  tips:['Highlight campaigns & metrics','Show platforms you use','Include certifications like Google/HubSpot'] },
  { id:'business',  icon:'💼', label:'Business Consultant',       desc:'Advisors who transform organisations and processes.',  tips:['List consulting engagements','Show measurable impact','Include frameworks used'] },
  { id:'teacher',   icon:'📚', label:'Teacher / Academic',        desc:'Educators shaping the minds of tomorrow.',            tips:['List subjects & levels taught','Include curriculum experience','Add publications if any'] },
  { id:'software',  icon:'💻', label:'Software Developer',        desc:'Builders of digital products and systems.',           tips:['Link to GitHub / portfolio','List programming languages','Include notable projects'] },
  { id:'engineer',  icon:'⚙️',  label:'Engineer',                  desc:'Problem-solvers across mechanical, civil, and more.', tips:['List engineering tools','Include project outcomes','Add professional registration'] },
  { id:'data',      icon:'📊', label:'Data Analyst',              desc:'Turning raw data into actionable insights.',          tips:['List tools: Excel, SQL, Python','Include data projects','Quantify insights delivered'] },
  { id:'product',   icon:'🧩', label:'Product Manager',           desc:'Leaders who build products users love.',              tips:['Show product launches','List methodologies: Agile/Scrum','Quantify user growth'] },
  { id:'uxui',      icon:'🎨', label:'UI/UX Designer',            desc:'Crafters of intuitive user experiences.',             tips:['Link to Figma/Behance portfolio','List design tools','Include case studies'] },
  { id:'graphic',   icon:'🖼', label:'Graphic Designer',          desc:'Visual storytellers for brands and media.',           tips:['Portfolio link is essential','List design software','Include client projects'] },
  { id:'writer',    icon:'✍️',  label:'Writer / Journalist',       desc:'Wordsmiths who inform, persuade and entertain.',      tips:['Add published work links','List publications/outlets','Include writing niches'] },
  { id:'photo',     icon:'📷', label:'Photographer / Videographer',desc:'Visual artists capturing moments and stories.',       tips:['Portfolio/Instagram link key','List equipment & software','Include commercial work'] },
  { id:'architect', icon:'🏛', label:'Architect / Interior Designer',desc:'Designers of spaces and experiences.',             tips:['Link to project portfolio','List CAD tools','Include notable builds'] },
  { id:'finance',   icon:'💰', label:'Finance / Accounting',      desc:'Stewards of financial health and compliance.',        tips:['List accounting software','Include certifications (ACCA, CPA)','Show cost-saving impact'] },
  { id:'scientist', icon:'🔬', label:'Scientist / Researcher',    desc:'Inquirers who advance knowledge.',                    tips:['List research publications','Include lab/field skills','Link to ResearchGate/ORCID'] },
  { id:'health',    icon:'🏥', label:'Healthcare / Medical',      desc:'Practitioners dedicated to health and wellbeing.',    tips:['Include professional registration','List clinical skills','Show specialisations'] },
  { id:'legal',     icon:'⚖️',  label:'Legal Professional',        desc:'Advisors, advocates, and legal experts.',            tips:['List bar admission/qualifications','Include practice areas','Add notable cases if possible'] },
  { id:'hr',        icon:'🤝', label:'HR Specialist',             desc:'People champions building great workplaces.',         tips:['Quantify people managed','Include HR software (Workday, BambooHR)','Show culture initiatives'] },
  { id:'sales',     icon:'🎯', label:'Sales / Customer Success',  desc:'Revenue drivers and relationship builders.',          tips:['Show revenue targets met','Include CRM tools (Salesforce)','List top deals closed'] },
  { id:'pm',        icon:'📋', label:'Project Manager',           desc:'Orchestrators who deliver on time and budget.',       tips:['Include PM certifications (PMP, PRINCE2)','Show project budgets managed','List methodologies'] },
  { id:'student',   icon:'🎓', label:'Student / Graduate',        desc:'Fresh talent entering the professional world.',       tips:['Lead with education section','Include internships & extra-curriculars','Highlight GPA if strong'] },
  { id:'freelance', icon:'🚀', label:'Freelancer / Self-Employed',desc:'Independent professionals across every field.',       tips:['List major clients','Show range of services','Include testimonials / reviews'] },
];

/* ============================================================
   COLOR PALETTES
   ============================================================ */
const PALETTES = [
  { id:'gold-obsidian', name:'Gold Obsidian',   desc:'Luxury meets power',    colors:['#d4a853','#f0c97a','#1a1a2e','#080810'], primary:'#d4a853', accent:'#f0c97a', grad:'linear-gradient(90deg,#d4a853,#f0c97a)' },
  { id:'ocean-depth',   name:'Ocean Depth',     desc:'Deep & trustworthy',    colors:['#0a4f6e','#1a8fa8','#e0f4f8','#ffffff'], primary:'#0a4f6e', accent:'#1a8fa8', grad:'linear-gradient(90deg,#0a4f6e,#1a8fa8)' },
  { id:'ember',         name:'Ember',           desc:'Warm & energetic',      colors:['#c0392b','#e74c3c','#fff5f5','#ffffff'], primary:'#c0392b', accent:'#e74c3c', grad:'linear-gradient(90deg,#c0392b,#e74c3c)' },
  { id:'arctic',        name:'Arctic',          desc:'Clean & precise',       colors:['#2c3e50','#3498db','#ecf0f1','#ffffff'], primary:'#2c3e50', accent:'#3498db', grad:'linear-gradient(90deg,#2c3e50,#3498db)' },
  { id:'violet-noir',   name:'Violet Noir',     desc:'Creative & bold',       colors:['#6b21a8','#a855f7','#1a0a2e','#0a0010'], primary:'#6b21a8', accent:'#a855f7', grad:'linear-gradient(90deg,#6b21a8,#a855f7)' },
  { id:'sage-garden',   name:'Sage Garden',     desc:'Natural & calm',        colors:['#2d6a4f','#52b788','#f0f7f4','#ffffff'], primary:'#2d6a4f', accent:'#52b788', grad:'linear-gradient(90deg,#2d6a4f,#52b788)' },
  { id:'rose-gold',     name:'Rose Gold',       desc:'Elegant & refined',     colors:['#9b4d6d','#d4698c','#fff0f5','#ffffff'], primary:'#9b4d6d', accent:'#d4698c', grad:'linear-gradient(90deg,#9b4d6d,#d4698c)' },
  { id:'midnight-mono', name:'Midnight Mono',   desc:'Minimal & professional',colors:['#111111','#444444','#f0f0f0','#ffffff'], primary:'#111111', accent:'#555555', grad:'linear-gradient(90deg,#111,#555)' },
  { id:'citrus-punch',  name:'Citrus Punch',    desc:'Vibrant & youthful',    colors:['#d4660a','#f59e0b','#fffbeb','#ffffff'], primary:'#d4660a', accent:'#f59e0b', grad:'linear-gradient(90deg,#d4660a,#f59e0b)' },
  { id:'teal-coral',    name:'Teal & Coral',    desc:'Balanced & modern',     colors:['#0d6e6e','#2db5b5','#e84855','#fff'], primary:'#0d6e6e', accent:'#2db5b5', grad:'linear-gradient(90deg,#0d6e6e,#e84855)' },
  { id:'slate-pro',     name:'Slate Pro',       desc:'Corporate & dependable',colors:['#334155','#64748b','#f1f5f9','#ffffff'], primary:'#334155', accent:'#64748b', grad:'linear-gradient(90deg,#334155,#64748b)' },
  { id:'lavender-mist', name:'Lavender Mist',   desc:'Soft & approachable',   colors:['#5b4d9e','#8b7ec8','#f5f3ff','#ffffff'], primary:'#5b4d9e', accent:'#8b7ec8', grad:'linear-gradient(90deg,#5b4d9e,#8b7ec8)' },
];

/* ============================================================
   FONT STYLES
   ============================================================ */
const FONTS = [
  { id:'modern',      label:'Modern',      style:'Poppins',            display:'Poppins, sans-serif',                body:'Poppins, sans-serif',           sample:'Modern & Clean' },
  { id:'elegant',     label:'Elegant',     style:'Cormorant Garamond', display:'"Cormorant Garamond", serif',        body:'"Outfit", sans-serif',           sample:'Elegant & Refined' },
  { id:'slab',        label:'Slab Serif',  style:'Roboto Slab',        display:'"Roboto Slab", serif',              body:'"Outfit", sans-serif',           sample:'Strong & Structured' },
  { id:'handwritten', label:'Handwritten', style:'Pacifico',           display:'Pacifico, cursive',                  body:'"Outfit", sans-serif',           sample:'Creative & Personal' },
  { id:'playful',     label:'Playful',     style:'Baloo 2',            display:'"Baloo 2", cursive',                 body:'"Baloo 2", sans-serif',          sample:'Friendly & Approachable' },
  { id:'futuristic',  label:'Futuristic',  style:'Orbitron',           display:'Orbitron, sans-serif',               body:'"Outfit", sans-serif',           sample:'Bold & Futuristic' },
];

/* ============================================================
   WIZARD
   ============================================================ */
let wizardStep = 1;
let wizardData = loadData('wizard') || { profession: null, palette: null, font: null };

function initWizard() {
  renderProfessionGrid();
  renderPaletteGrid();
  renderFontGrid();
  if (wizardData.profession) {
    document.querySelectorAll('.profession-card').forEach(c => {
      if (c.dataset.id === wizardData.profession) c.classList.add('selected');
    });
    showProfessionHint(wizardData.profession);
  }
  if (wizardData.palette) {
    document.querySelectorAll('.palette-card').forEach(c => {
      if (c.dataset.id === wizardData.palette) c.classList.add('selected');
    });
  }
  if (wizardData.font) {
    document.querySelectorAll('.font-card').forEach(c => {
      if (c.dataset.id === wizardData.font) c.classList.add('selected');
    });
  }
  goToWizardStep(1);
}

function renderProfessionGrid() {
  const grid = document.getElementById('profession-grid');
  grid.innerHTML = PROFESSIONS.map(p => `
    <div class="profession-card" data-id="${p.id}" onclick="selectProfession('${p.id}')">
      <div class="p-icon">${p.icon}</div>
      <div class="p-label">${h(p.label)}</div>
    </div>
  `).join('');
}

function selectProfession(id) {
  document.querySelectorAll('.profession-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.profession-card[data-id="${id}"]`).classList.add('selected');
  wizardData.profession = id;
  saveData('wizard', wizardData);
  showProfessionHint(id);
}

function showProfessionHint(id) {
  const p = PROFESSIONS.find(x => x.id === id);
  const hint = document.getElementById('profession-hint');
  if (!p) { hint.classList.remove('visible'); return; }
  hint.innerHTML = `
    <h4>${h(p.icon)} ${h(p.label)}</h4>
    <p>${h(p.desc)}</p>
    <ul>${p.tips.map(t => `<li>${h(t)}</li>`).join('')}</ul>
  `;
  hint.classList.add('visible');
}

function renderPaletteGrid() {
  const grid = document.getElementById('palette-grid');
  grid.innerHTML = PALETTES.map(p => `
    <div class="palette-card" data-id="${p.id}" onclick="selectPalette('${p.id}')">
      <div class="palette-swatches">
        ${p.colors.map(c => `<div class="palette-swatch" style="background:${c}"></div>`).join('')}
      </div>
      <div class="palette-gradient" style="background:${p.grad}"></div>
      <div class="palette-name">${h(p.name)}</div>
      <div class="palette-desc">${h(p.desc)}</div>
    </div>
  `).join('');
}

function selectPalette(id) {
  document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.palette-card[data-id="${id}"]`).classList.add('selected');
  wizardData.palette = id;
  saveData('wizard', wizardData);
  const p = PALETTES.find(x => x.id === id);
  if (p) {
    document.documentElement.style.setProperty('--dw-primary', p.primary);
    document.documentElement.style.setProperty('--dw-accent', p.accent);
  }
}

function renderFontGrid() {
  const grid = document.getElementById('font-grid');
  grid.innerHTML = FONTS.map(f => `
    <div class="font-card" data-id="${f.id}" onclick="selectFont('${f.id}')">
      <div class="font-sample" style="font-family:${f.display}">${h(f.sample)}</div>
      <div class="font-meta-name">${h(f.label)}</div>
      <div class="font-meta-style" style="font-family:${f.display};font-size:11px">${h(f.style)}</div>
    </div>
  `).join('');
}

function selectFont(id) {
  document.querySelectorAll('.font-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.font-card[data-id="${id}"]`).classList.add('selected');
  wizardData.font = id;
  saveData('wizard', wizardData);
  const f = FONTS.find(x => x.id === id);
  if (f) {
    document.documentElement.style.setProperty('--dw-font-display', f.display);
    document.documentElement.style.setProperty('--dw-font-body', f.body);
  }
}

function goToWizardStep(step) {
  wizardStep = step;
  document.querySelectorAll('.wizard-step-content').forEach((el,i) => {
    el.classList.toggle('active', i+1 === step);
  });
  document.querySelectorAll('.wsi-step').forEach((el,i) => {
    el.classList.toggle('active', i+1 === step);
    el.classList.toggle('done', i+1 < step);
  });
  document.getElementById('wizard-progress-fill').style.width = `${(step/3)*100}%`;
  document.getElementById('wizard-step-label').textContent = step;
  document.getElementById('wizard-prev-btn').style.visibility = step === 1 ? 'hidden' : 'visible';
  document.getElementById('wizard-next-btn').textContent = step === 3 ? 'Start Building →' : 'Continue →';
}

function wizardNext() {
  if (wizardStep === 1 && !wizardData.profession) { toast('Please select your profession first', 'error'); return; }
  if (wizardStep === 2 && !wizardData.palette)    { toast('Please choose a color palette', 'error'); return; }
  if (wizardStep === 3 && !wizardData.font)       { toast('Please select a font style', 'error'); return; }
  if (wizardStep < 3) { goToWizardStep(wizardStep + 1); return; }
  showView('builder');
  toast('Design saved! Now fill in your details.', 'gold');
}

function wizardPrev() {
  if (wizardStep > 1) goToWizardStep(wizardStep - 1);
}

/* ============================================================
   BUILDER
   ============================================================ */
let builderStep = 1;
let autoSaveTimer = null;
let photoDataURL = null;

const BUILDER_TIPS = {
  personal: {
    default: 'Write a concise 2-3 sentence summary focusing on your most relevant experience and top skills.',
    marketing: 'Mention your key specialisations (digital, brand, content) and a notable achievement in your summary.',
    teacher: 'State the subjects, age groups, and curriculum systems you are experienced with.',
    sales: 'Lead with your track record — revenue targets hit, conversion rates, or deals closed.',
  },
  skills: {
    default: 'List 6-10 skills. Focus on what\'s most relevant to the roles you\'re applying for.',
    software: 'Include programming languages, frameworks, and tools. Be specific (React, not just "JavaScript").',
    data: 'List tools like Excel, SQL, Python, Tableau. Include statistical methods if relevant.',
    uxui: 'Include design tools (Figma, Sketch), prototyping methods, and research techniques.',
  },
  edu: {
    default: 'List your most recent qualification first. Include professional certifications too.',
    student: 'Your education is your strongest asset. Include your GPA, relevant coursework, and any honours.',
    finance: 'Professional qualifications (ACCA, CIMA, CFA) are as important as your degree here.',
  },
};

function getTip(section) {
  const wiz = loadData('wizard') || {};
  const prof = wiz.profession || 'default';
  const tips = BUILDER_TIPS[section] || {};
  return tips[prof] || tips.default || '';
}

function setupBuilderContext() {
  const wiz = loadData('wizard') || {};
  const prof = PROFESSIONS.find(p => p.id === wiz.profession) || { icon:'💼', label:'Professional' };
  const pal  = PALETTES.find(p => p.id === wiz.palette) || { name:'Default' };
  const fnt  = FONTS.find(f => f.id === wiz.font) || { label:'Default' };

  document.getElementById('builder-badges').innerHTML = `
    <div class="context-badge"><span class="cb-icon">${prof.icon}</span>${h(prof.label)}</div>
    <div class="context-badge"><span class="cb-icon">🎨</span>${h(pal.name)}</div>
    <div class="context-badge"><span class="cb-icon">Aa</span>${h(fnt.label)}</div>
  `;

  const achievLabels = { uxui:'Case Studies', graphic:'Case Studies', writer:'Published Work', photo:'Portfolio', scientist:'Research & Publications' };
  const achLabel = achievLabels[wiz.profession] || 'Achievements & Work Samples';
  document.getElementById('achievements-title').textContent = achLabel;

  document.getElementById('tip-personal').innerHTML = `<strong>💡 Tip:</strong> ${h(getTip('personal'))}`;
  document.getElementById('tip-skills').innerHTML   = `<strong>💡 Tip:</strong> ${h(getTip('skills'))}`;
  document.getElementById('tip-edu').innerHTML      = `<strong>💡 Tip:</strong> ${h(getTip('edu'))}`;

  const steps = ['Personal','Skills','Experience','Education','Achievements','Contact'];
  document.getElementById('builder-progress').innerHTML = steps.map((s,i) => `
    <div class="bp-step ${i===0?'active':''}" data-step="${i+1}" onclick="goToBuilderStep(${i+1})">${i+1}. ${s}</div>
  `).join('');

  loadBuilderData();

  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(autoSave, 8000);

  goToBuilderStep(builderStep);
}

function loadBuilderData() {
  const d = loadData('cvData') || {};
  if (d.fullname)  document.getElementById('b-fullname').value  = d.fullname;
  if (d.title)     document.getElementById('b-title').value     = d.title;
  if (d.location)  document.getElementById('b-location').value  = d.location;
  if (d.summary)   document.getElementById('b-summary').value   = d.summary;
  if (d.email)     document.getElementById('b-email').value     = d.email;
  if (d.phone)     document.getElementById('b-phone').value     = d.phone;
  if (d.linkedin)  document.getElementById('b-linkedin').value  = d.linkedin;
  if (d.photo)     { photoDataURL = d.photo; updatePhotoPreview(d.photo); }

  const langList = document.getElementById('languages-list');
  langList.innerHTML = '';
  if (d.languages && d.languages.length) {
    d.languages.forEach(l => addLanguage(l));
  } else {
    addLanguage();
  }

  const certList = document.getElementById('certs-list');
  certList.innerHTML = '';
  if (d.certifications && d.certifications.length) {
    d.certifications.forEach(c => addCertification(c));
  } else {
    addCertification();
  }

  const refList = document.getElementById('refs-list');
  refList.innerHTML = '';
  if (d.references && d.references.length) {
    d.references.forEach(r => addReference(r));
  } else {
    addReference();
  }

  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = '';
  if (d.skills && d.skills.length) d.skills.forEach(s => addSkill(s.name, s.level));
  else { addSkill(); addSkill(); }

  const expList = document.getElementById('experience-list');
  expList.innerHTML = '';
  if (d.experience && d.experience.length) d.experience.forEach(e => addExperience(e));
  else addExperience();

  const eduList = document.getElementById('education-list');
  eduList.innerHTML = '';
  if (d.education && d.education.length) d.education.forEach(e => addEducation(e));
  else addEducation();

  const achList = document.getElementById('achievements-list');
  achList.innerHTML = '';
  if (d.achievements && d.achievements.length) d.achievements.forEach(a => addAchievement(a));
  else addAchievement();
}

function collectBuilderData() {
  const skills = [];
  document.querySelectorAll('.skill-entry').forEach(el => {
    const name = el.querySelector('.skill-name-input')?.value || '';
    if (name.trim()) skills.push({ name });
  });

  const experience = [];
  document.querySelectorAll('.exp-entry').forEach(el => {
    experience.push({
      title:    el.querySelector('.exp-title')?.value || '',
      org:      el.querySelector('.exp-org')?.value   || '',
      duration: el.querySelector('.exp-dur')?.value   || '',
      desc:     el.querySelector('.exp-desc')?.value  || '',
    });
  });

  const education = [];
  document.querySelectorAll('.edu-entry').forEach(el => {
    education.push({
      institution:   el.querySelector('.edu-inst')?.value  || '',
      qualification: el.querySelector('.edu-qual')?.value  || '',
      year:          el.querySelector('.edu-year')?.value  || '',
    });
  });

  const achievements = [];
  document.querySelectorAll('.ach-entry').forEach(el => {
    achievements.push({
      title: el.querySelector('.ach-title')?.value  || '',
      tools: el.querySelector('.ach-tools')?.value  || '',
      desc:  el.querySelector('.ach-desc')?.value   || '',
      link:  el.querySelector('.ach-link')?.value   || '',
      link2: el.querySelector('.ach-link2')?.value  || '',
    });
  });

  const languages = [];
  document.querySelectorAll('.lang-entry').forEach(el => {
    const lang  = el.querySelector('.lang-name')?.value  || '';
    const level = el.querySelector('.lang-level')?.value || '';
    if (lang.trim()) languages.push({ lang, level });
  });

  const certifications = [];
  document.querySelectorAll('.cert-entry').forEach(el => {
    const name  = el.querySelector('.cert-name')?.value  || '';
    const org   = el.querySelector('.cert-org')?.value   || '';
    const year  = el.querySelector('.cert-year')?.value  || '';
    if (name.trim()) certifications.push({ name, org, year });
  });

  const references = [];
  document.querySelectorAll('.ref-entry').forEach(el => {
    const name    = el.querySelector('.ref-name')?.value    || '';
    const pos     = el.querySelector('.ref-pos')?.value     || '';
    const company = el.querySelector('.ref-company')?.value || '';
    const contact = el.querySelector('.ref-contact')?.value || '';
    if (name.trim()) references.push({ name, pos, company, contact });
  });

  return {
    _filled: true,
    fullname:  document.getElementById('b-fullname')?.value  || '',
    title:     document.getElementById('b-title')?.value     || '',
    location:  document.getElementById('b-location')?.value  || '',
    summary:   document.getElementById('b-summary')?.value   || '',
    photo:     photoDataURL,
    email:     document.getElementById('b-email')?.value     || '',
    phone:     document.getElementById('b-phone')?.value     || '',
    linkedin:  document.getElementById('b-linkedin')?.value  || '',
    languages,
    certifications,
    references,
    skills, experience, education, achievements,
  };
}

function autoSave() {
  const dot   = document.getElementById('autosave-dot');
  const label = document.getElementById('autosave-label');
  const data  = sanitizeCVData(collectBuilderData());
  saveData('cvData', data);
  dot.classList.add('saved');
  label.textContent = 'Draft saved ✓';
  setTimeout(() => { dot.classList.remove('saved'); label.textContent = 'Auto saving...'; }, 2500);
}

function sanitizeCVData(d) {
  if (!d) return d;
  return {
    ...d,
    fullname:  sanitizeText(d.fullname,   100),
    title:     sanitizeText(d.title,      100),
    email:     sanitizeEmail(d.email)   || '',
    phone:     sanitizeText(d.phone,       30),
    location:  sanitizeText(d.location,   100),
    linkedin:  sanitizeUrl(d.linkedin),
    summary:   sanitizeText(d.summary,   1000),
    languages: (d.languages || []).map(l => ({
      lang:  sanitizeText(l.lang,  80),
      level: sanitizeText(l.level, 40),
    })),
    certifications: (d.certifications || []).map(c => ({
      name: sanitizeText(c.name, 120),
      org:  sanitizeText(c.org,  100),
      year: sanitizeText(c.year,  20),
    })),
    references: (d.references || []).map(r => ({
      name:    sanitizeText(r.name,    100),
      pos:     sanitizeText(r.pos,     100),
      company: sanitizeText(r.company, 100),
      contact: sanitizeText(r.contact, 100),
    })),
    skills: (d.skills || []).map(s => ({
      name: sanitizeText(s.name, 60),
    })),
    experience: (d.experience || []).map(e => ({
      title:    sanitizeText(e.title,    100),
      org:      sanitizeText(e.org,      100),
      duration: sanitizeText(e.duration,  60),
      desc:     sanitizeText(e.desc,    1000),
    })),
    education: (d.education || []).map(e => ({
      institution:   sanitizeText(e.institution,   100),
      qualification: sanitizeText(e.qualification, 100),
      year:          sanitizeText(e.year,            20),
    })),
    achievements: (d.achievements || []).map(a => ({
      title: sanitizeText(a.title, 100),
      tools: sanitizeText(a.tools, 200),
      desc:  sanitizeText(a.desc, 1000),
      link:  sanitizeUrl(a.link),
    })),
  };
}

function goToBuilderStep(step) {
  builderStep = step;
  document.querySelectorAll('.builder-step').forEach((el,i) => {
    el.classList.toggle('active', i+1 === step);
  });
  document.querySelectorAll('.bp-step').forEach((el,i) => {
    el.classList.toggle('active', i+1 === step);
    el.classList.toggle('done', i+1 < step);
  });
  document.getElementById('builder-step-label').textContent = step;
  document.getElementById('builder-prev-btn').style.display = step === 1 ? 'none' : '';
  document.getElementById('builder-next-btn').style.display = step === 6 ? 'none' : '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function builderNext() {
  if (builderStep < 6) { autoSave(); goToBuilderStep(builderStep + 1); }
}
function builderPrev() {
  if (builderStep > 1) goToBuilderStep(builderStep - 1);
}

function addSkill(name='') {
  const list = document.getElementById('skills-list');
  const div  = document.createElement('div');
  div.className = 'dynamic-item skill-entry';
  div.innerHTML = `
    <div class="skill-row">
      <input type="text" class="form-control skill-name-input" value="${h(name)}"
        placeholder="e.g. Microsoft Excel, Photoshop, Public Speaking">
      <button class="btn-remove" onclick="this.closest('.skill-entry').remove()">✕</button>
    </div>
  `;
  list.appendChild(div);
}

function addExperience(d={}) {
  const list = document.getElementById('experience-list');
  const div  = document.createElement('div');
  div.className = 'dynamic-item exp-entry';
  div.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">Work Experience</span>
      <button class="btn-remove" onclick="this.closest('.exp-entry').remove()">✕ Remove</button>
    </div>
    <div class="form-group"><label>Job Title</label><input type="text" class="form-control exp-title" value="${h(d.title||'')}" placeholder="e.g. Marketing Manager"></div>
    <div class="form-group"><label>Organisation</label><input type="text" class="form-control exp-org" value="${h(d.org||'')}" placeholder="e.g. Trust Bank Gambia"></div>
    <div class="form-group"><label>Duration</label><input type="text" class="form-control exp-dur" value="${h(d.duration||'')}" placeholder="e.g. 2021 – Present"></div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="form-control exp-desc" rows="3"
        placeholder="Describe your role, responsibilities, and key achievements...">${h(d.desc||'')}</textarea>
      <button class="btn btn-outline btn-sm" style="margin-top:10px;width:100%;text-align:left"
        onclick="openDescHelper(this)">✦Tap to Answer questions to generate description</button>
    </div>
  `;
  list.appendChild(div);
}

function addEducation(d={}) {
  const list = document.getElementById('education-list');
  const div  = document.createElement('div');
  div.className = 'dynamic-item edu-entry';
  div.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">Education</span>
      <button class="btn-remove" onclick="this.closest('.edu-entry').remove()">✕ Remove</button>
    </div>
    <div class="form-group"><label>Institution</label><input type="text" class="form-control edu-inst" value="${h(d.institution||'')}" placeholder="e.g. University of The Gambia"></div>
    <div class="form-group"><label>Qualification</label><input type="text" class="form-control edu-qual" value="${h(d.qualification||'')}" placeholder="e.g. BSc Business Administration"></div>
    <div class="form-group"><label>Year</label><input type="text" class="form-control edu-year" value="${h(d.year||'')}" placeholder="e.g. 2019"></div>
  `;
  list.appendChild(div);
}

function addAchievement(d={}) {
  const list = document.getElementById('achievements-list');
  const wiz  = loadData('wizard') || {};
  const labelMap = { uxui:'Case Study', graphic:'Case Study', writer:'Published Work', photo:'Portfolio Item', scientist:'Publication', default:'Achievement' };
  const label = labelMap[wiz.profession] || labelMap.default;
  const div   = document.createElement('div');
  div.className = 'dynamic-item ach-entry';
  div.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">${h(label)}</span>
      <button class="btn-remove" onclick="this.closest('.ach-entry').remove()">✕ Remove</button>
    </div>
    <div class="form-group"><label>Title</label><input type="text" class="form-control ach-title" value="${h(d.title||'')}" placeholder="e.g. Brand Refresh Campaign 2024"></div>
    <div class="form-group"><label>Tools / Methods</label><input type="text" class="form-control ach-tools" value="${h(d.tools||'')}" placeholder="e.g. Adobe Creative Suite, Canva"></div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="form-control ach-desc" rows="3"
        placeholder="Describe the work and its impact...">${h(d.desc||'')}</textarea>
      <button class="btn btn-outline btn-sm" style="margin-top:10px;width:100%;text-align:left"
        onclick="openAchHelper(this)">✦Tap to Answer questions to generate description</button>
    </div>
    <div class="form-group"><label>Link (optional)</label><input type="text" class="form-control ach-link" value="${h(d.link||'')}" placeholder="https://"></div>
    <div class="form-group"><label>Secondary Link (optional)</label><input type="text" class="form-control ach-link2" value="${h(d.link2||'')}" placeholder="https://"></div>
  `;
  list.appendChild(div);
}

/* ============================================================
   LANGUAGE BLOCKS
   ============================================================ */
function addLanguage(d={}) {
  const list = document.getElementById('languages-list');
  const div  = document.createElement('div');
  div.className = 'dynamic-item lang-entry';
  div.innerHTML = `
    <div class="skill-row">
      <input type="text" class="form-control lang-name" value="${h(d.lang||'')}"
        placeholder="e.g. English, Wolof, French, Mandinka">
      <button class="btn-remove" onclick="this.closest('.lang-entry').remove()">✕</button>
    </div>
  `;
  list.appendChild(div);
}

/* ============================================================
   CERTIFICATION BLOCKS
   ============================================================ */
function addCertification(d={}) {
  const list = document.getElementById('certs-list');
  const div  = document.createElement('div');
  div.className = 'dynamic-item cert-entry';
  div.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">Certification</span>
      <button class="btn-remove" onclick="this.closest('.cert-entry').remove()">✕ Remove</button>
    </div>
    <div class="form-group"><label>Certification Name</label><input type="text" class="form-control cert-name" value="${h(d.name||'')}" placeholder="e.g. Google Analytics Individual Qualification"></div>
    <div class="form-group"><label>Issuing Organisation</label><input type="text" class="form-control cert-org" value="${h(d.org||'')}" placeholder="e.g. Google, HubSpot, Coursera"></div>
    <div class="form-group"><label>Year</label><input type="text" class="form-control cert-year" value="${h(d.year||'')}" placeholder="e.g. 2023"></div>
  `;
  list.appendChild(div);
}

/* ============================================================
   REFERENCE BLOCKS
   ============================================================ */
function addReference(d={}) {
  const list = document.getElementById('refs-list');
  const div  = document.createElement('div');
  div.className = 'dynamic-item ref-entry';
  div.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">Reference</span>
      <button class="btn-remove" onclick="this.closest('.ref-entry').remove()">✕ Remove</button>
    </div>
    <div class="form-group"><label>Full Name</label><input type="text" class="form-control ref-name" value="${h(d.name||'')}" placeholder="e.g. Omar Touray"></div>
    <div class="form-group"><label>Position / Title</label><input type="text" class="form-control ref-pos" value="${h(d.pos||'')}" placeholder="e.g. Head of Marketing"></div>
    <div class="form-group"><label>Organisation</label><input type="text" class="form-control ref-company" value="${h(d.company||'')}" placeholder="e.g. Gambia National Brewery"></div>
    <div class="form-group"><label>Contact Info</label><input type="text" class="form-control ref-contact" value="${h(d.contact||'')}" placeholder="e.g. omar@gnb.gm or +220 XXX XXXX"></div>
  `;
  list.appendChild(div);
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { toast('Photo too large (max 2MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    photoDataURL = e.target.result;
    updatePhotoPreview(photoDataURL);
  };
  reader.readAsDataURL(file);
}

function updatePhotoPreview(src) {
  const el = document.getElementById('photo-preview');
  el.innerHTML = `<img src="${src}" alt="Photo preview">`;
}

function generateCV() {
  if (!currentUser) {
    showAuthModal(function() { generateCV(); });
    return;
  }
  autoSave();
  const data = loadData('cvData');
  if (!data || !data.fullname.trim()) { toast('Please enter your full name before generating', 'error'); return; }
  toast('CV generated! ✦', 'gold');
  showView('preview');
}

/* ============================================================
   CV RENDERER
   ============================================================ */
let currentTheme = loadData('theme') || 'classic';

function setTheme(theme) {
  currentTheme = theme;
  saveData('theme', theme);
  const paper = document.getElementById('cv-paper');
  paper.className = `cv-paper theme-${theme}`;
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tbtn-${theme}`)?.classList.add('active');
}

function renderCV() {
  const data = loadData('cvData') || {};
  const paper = document.getElementById('cv-paper');
  paper.className = `cv-paper theme-${currentTheme}`;
  paper.innerHTML = buildCVHTML(data);
  setTheme(currentTheme);
}

function buildCVHTML(d) {
  const safePhoto = d.photo && /^data:image\/(jpeg|png|webp|gif);base64,/.test(d.photo)
    ? d.photo : null;
  const photoHTML = safePhoto
    ? '<img src="' + safePhoto + '" class="cv-photo" alt="Profile photo" crossorigin="anonymous">'
    : '<div class="cv-photo">👤</div>';

  const langs = (d.languages || []).filter(l => l.lang && l.lang.trim());
  const certs = (d.certifications || []).filter(c => c.name && c.name.trim());
  const refs = (d.references || []).filter(r => r.name && r.name.trim());

  const contactItems = [
    d.email    && `<span class="cv-contact-item">✉ ${h(d.email)}</span>`,
    d.phone    && `<span class="cv-contact-item">📱 ${h(d.phone)}</span>`,
    d.location && `<span class="cv-contact-item">📍 ${h(d.location)}</span>`,
    d.linkedin && `<span class="cv-contact-item">🔗 ${h(d.linkedin)}</span>`,
  ].filter(Boolean).join('');

  const skillsHTML = (d.skills||[]).map(s => `
    <div class="cv-skill-bar">
      <div class="cv-skill-name">${h(s.name)}</div>
    </div>
  `).join('');

  const expHTML = (d.experience||[]).map(e => `
    <div class="cv-exp-item">
      <div class="cv-exp-title">${h(e.title)}</div>
      <div class="cv-exp-org">${h(e.org)}</div>
      <div class="cv-exp-duration">${h(e.duration)}</div>
      <div class="cv-exp-desc">${h(e.desc)}</div>
    </div>
  `).join('');

  const eduHTML = (d.education||[]).map(e => `
    <div class="cv-edu-item">
      <div class="cv-edu-inst">${h(e.institution)}</div>
      <div class="cv-edu-qual">${h(e.qualification)}</div>
      <div class="cv-edu-year">${h(e.year)}</div>
    </div>
  `).join('');

  const wiz = loadData('wizard') || {};
  const achLabelMap = { uxui:'Case Studies', graphic:'Case Studies', writer:'Published Work', photo:'Portfolio', scientist:'Research & Publications' };
  const achLabel = achLabelMap[wiz.profession] || 'Achievements';
  const achHTML = (d.achievements||[]).map(a => `
    <div class="cv-exp-item">
      <div class="cv-exp-title">${h(a.title)}</div>
      ${a.tools ? `<div class="cv-exp-org">${h(a.tools)}</div>` : ''}
      <div class="cv-exp-desc">${h(a.desc)}</div>
      ${a.link && /^https?:\/\//i.test(a.link) ? `<div style="font-size:11px;margin-top:4px"><a href="${h(a.link)}" rel="noopener noreferrer" style="color:var(--cv-accent2)">${h(a.link)}</a></div>` : ''}
    </div>
  `).join('');

  const langsHTML = langs.length ? langs.map(l => `
    <div class="cv-tag" style="margin-bottom:5px">
      <span>${h(l.lang)}</span>
    </div>
  `).join('') : '';

  const certsHTML = certs.length ? certs.map(c => `
    <div class="cv-edu-item">
      <div class="cv-edu-inst">${h(c.name)}</div>
      ${c.org  ? `<div class="cv-edu-qual">${h(c.org)}</div>`  : ''}
      ${c.year ? `<div class="cv-edu-year">${h(c.year)}</div>` : ''}
    </div>
  `).join('') : '';

  const refHTML = refs.map(r => `
    <div class="cv-ref">
      <div class="cv-ref-name">${h(r.name)}</div>
      <div>${[r.pos, r.company].filter(Boolean).map(v=>h(v)).join(' · ')}</div>
      ${r.contact ? `<div style="font-size:11px;opacity:0.7">${h(r.contact)}</div>` : ''}
    </div>
  `).join('');

  return `
    <div class="cv-header">
      <div class="cv-header-inner">
        ${photoHTML}
        <div>
          <div class="cv-name">${h(d.fullname||'Your Name')}</div>
          <div class="cv-jobtitle">${h(d.title||'Professional Title')}</div>
        </div>
      </div>
      ${contactItems ? `<div class="cv-contact-row">${contactItems}</div>` : ''}
    </div>
    <div class="cv-body">
      <div class="cv-main">
        ${d.summary ? `<div class="cv-section"><div class="cv-section-title">Professional Summary</div><div class="cv-summary">${h(d.summary)}</div></div>` : ''}
        ${expHTML    ? `<div class="cv-section"><div class="cv-section-title">Work Experience</div>${expHTML}</div>` : ''}
        ${achHTML    ? `<div class="cv-section"><div class="cv-section-title">${h(achLabel)}</div>${achHTML}</div>` : ''}
      </div>
      <div class="cv-side">
        ${skillsHTML  ? `<div class="cv-section"><div class="cv-section-title">Skills</div>${skillsHTML}</div>` : ''}
        ${eduHTML     ? `<div class="cv-section"><div class="cv-section-title">Education</div>${eduHTML}</div>` : ''}
        ${langsHTML   ? `<div class="cv-section"><div class="cv-section-title">Languages</div>${langsHTML}</div>` : ''}
        ${certsHTML   ? `<div class="cv-section"><div class="cv-section-title">Certifications</div>${certsHTML}</div>` : ''}
        ${refHTML     ? `<div class="cv-section"><div class="cv-section-title">References</div>${refHTML}</div>` : ''}
      </div>
    </div>
  `;
}

/* ============================================================
   PDF DOWNLOAD GATEWAY
   ============================================================ */
async function getFreeDownloadsLeft() {
  if (!currentUser) return 0;
  if (!rateLimiter.check('supabase_profile')) {
    console.warn('[RateLimit] Profile read blocked');
    return 0;
  }
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('free_downloads_used')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return 1;
      throw error;
    }

    const used = data?.free_downloads_used || 0;
    const FREE_DOWNLOADS = 1;
    return Math.max(0, FREE_DOWNLOADS - used);

  } catch (err) {
    console.warn('[Downloads] Could not read counter:', err.message);
    return 0;
  }
}

async function useFreeDownload() {
  if (!currentUser) return false;
  if (!rateLimiter.check('supabase_profile')) {
    console.warn('[RateLimit] Profile write blocked');
    return false;
  }
  try {
    const { data, error } = await supabaseClient
      .rpc('increment_downloads', { user_id: currentUser.id });

    if (error) {
      if (error.message.includes('limit reached')) {
        console.log('[Downloads] Free limit already reached');
        return false;
      }
      throw error;
    }
    console.log('[Downloads] Counter incremented to', data);
    return true;

  } catch (err) {
    console.warn('[Downloads] Counter error:', err.message);
    return false;
  }
}

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

  toast('Checking your download allowance…', 'default', 2000);
  const freeLeft = await getFreeDownloadsLeft();

  if (freeLeft > 0) {
    await useFreeDownload();
    if (freeLeft - 1 === 0) {
      toast('Free download used ✦ Next download costs GMD ' + MODEMPAY_CONFIG.DOWNLOAD_PRICES.cv + '.', 'gold', 5000);
    } else {
      toast('Free download — ' + (freeLeft - 1) + ' remaining.', 'default', 2500);
    }
    // ── GA: track CV download ──
    trackCVDownload();
    executePDFDownload('cv');
    return;
  }

  showDownloadPaymentModal('cv');
}

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

function showDownloadPaymentModal(type) {
  var prices    = MODEMPAY_CONFIG.DOWNLOAD_PRICES;
  var typeLabel = { cv:'CV', coverletter:'Cover Letter', bundle:'CV + Cover Letter Bundle' };

  var overlay = document.createElement('div');
  overlay.id = 'download-payment-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px;';

  var box = document.createElement('div');
  box.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-xl);padding:40px;max-width:440px;width:100%;animation:fadeUp 0.3s var(--ease);';

  box.innerHTML = '<div style="font-size:44px;margin-bottom:16px;text-align:center">📄</div>' +
    '<h3 style="font-size:22px;margin-bottom:8px;text-align:center">Download Your ' + h(typeLabel[type]||'Document') + '</h3>' +
    '<p style="font-size:14px;color:var(--text2);text-align:center;line-height:1.7;margin-bottom:24px">Your free download has been used.<br>Pay securely via ModemPay — mobile money accepted.</p>' +
    '<p style="font-size:11px;color:var(--muted);text-align:center;margin-top:12px">🔒 Secured by ModemPay · GMD transactions</p>';

  var opts = document.createElement('div');
  opts.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-bottom:20px;';

  if (type !== 'bundle') {
    var card1 = document.createElement('div');
    card1.style.cssText = 'background:var(--surface);border:2px solid var(--gold);border-radius:var(--radius-lg);padding:16px;cursor:pointer;';
    card1.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:700;margin-bottom:3px">' + h(typeLabel[type]) + ' PDF</div><div style="font-size:12px;color:var(--text2)">A4 PDF · your chosen theme</div></div><div style="font-family:var(--font-mono);font-size:16px;color:var(--gold);font-weight:700">GMD ' + prices[type] + '</div></div>';
    card1.addEventListener('click', function() {
      document.getElementById('download-payment-overlay').remove();
      submitModemPayForm(type);
    });
    opts.appendChild(card1);
  }

  var card2 = document.createElement('div');
  card2.style.cssText = 'background:var(--surface);border:2px solid rgba(212,168,83,0.4);border-radius:var(--radius-lg);padding:16px;cursor:pointer;';
  card2.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:700;margin-bottom:3px">✦ CV + Cover Letter Bundle</div><div style="font-size:12px;color:var(--text2)">Best value — both documents</div></div><div style="font-family:var(--font-mono);font-size:16px;color:var(--gold);font-weight:700">GMD ' + prices.bundle + '</div></div>';
  card2.addEventListener('click', function() {
    document.getElementById('download-payment-overlay').remove();
    submitModemPayForm('bundle');
  });
  opts.appendChild(card2);

  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-ghost btn-full btn-sm';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', function() {
    document.getElementById('download-payment-overlay').remove();
  });

  box.insertBefore(opts, box.lastElementChild);
  box.insertBefore(cancelBtn, box.lastElementChild);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function mp(val, max) {
  return String(val || '').trim().slice(0, max || 255);
}

function mpBaseUrl() {
  return window.location.origin + window.location.pathname;
}

function submitModemPayForm(type) {
  if (!rateLimiter.check('payment')) {
    const wait = rateLimiter.waitSeconds('payment');
    toast('Too many payment attempts — please wait ' + wait + ' seconds.', 'error', 5000);
    return;
  }
  const prices    = MODEMPAY_CONFIG.DOWNLOAD_PRICES;
  const amount    = prices[type];
  const cvData    = loadData('cvData') || {};
  const dlToken   = 'dl-' + type + '-' + Date.now();
  const typeLabel = { cv:'CV PDF', coverletter:'Cover Letter PDF', bundle:'Bundle' };

  saveData_raw('folio_pending_download', { type: type, token: dlToken, amount: amount });

  const base      = mpBaseUrl();
  const returnUrl = base + '?payment_status=success&dl_token=' + dlToken;
  const cancelUrl = base + '?payment_status=cancelled';

  const customerName  = mp(cvData.fullname || 'GamHub Jobs User', 100);
  const customerEmail = mp(cvData.email    || 'user@gamhubjobs.gm', 100);
  const customerPhone = mp((cvData.phone || '7000000').replace(/[^0-9]/g, '').slice(-7) || '7000000', 20);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://checkout.modempay.com/api/pay';
  form.style.display = 'none';

  const fields = {
    public_key:     mp(MODEMPAY_PUBLIC_KEY, 255),
    amount:         mp(String(amount), 20),
    currency:       'GMD',
    customer_name:  customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    return_url:     mp(returnUrl, 255),
    cancel_url:     mp(cancelUrl, 255),
    'metadata[source]':   'gamhubjobs',
    'metadata[type]':     mp(typeLabel[type] || type, 50),
    'metadata[dl_token]': mp(dlToken, 60),
  };

  Object.entries(fields).forEach(function(entry) {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = entry[0];
    input.value = entry[1];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  toast('Redirecting to ModemPay… GMD ' + amount, 'gold', 2000);
  setTimeout(function() { form.submit(); }, 600);
}

async function submitJobPaymentForm(jobPayload, plan, amount) {
  if (!rateLimiter.check('payment')) {
    const wait = rateLimiter.waitSeconds('payment');
    toast('Too many payment attempts — please wait ' + wait + ' seconds.', 'error', 5000);
    return;
  }

  toast('Saving your listing…', 'default', 2000);
  let realJobId = null;

  try {
    if (SB_CONNECTED) {
      const saved = await sbInsertJob({ ...jobPayload, paid: false });
      const row = Array.isArray(saved) ? saved[0] : saved;
      realJobId = row?.id || null;
      console.log('[Job] Pre-saved to Supabase with id:', realJobId);
    }
  } catch(err) {
    console.warn('[Job] Pre-save failed:', err.message);
  }

  const jobId = realJobId || ('local-' + Date.now());

  saveData_raw('folio_pending_job', Object.assign({}, jobPayload, { _pendingId: jobId, id: jobId }));

  const base      = mpBaseUrl();
  const returnUrl = base + '?payment_status=success&job_id=' + mp(jobId, 80);
  const cancelUrl = base + '?payment_status=cancelled';

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://checkout.modempay.com/api/pay';
  form.style.display = 'none';

  const fields = {
    public_key:     mp(MODEMPAY_PUBLIC_KEY, 255),
    amount:         mp(String(amount), 20),
    currency:       'GMD',
    customer_name:  mp(jobPayload.company || 'Employer', 100),
    customer_email: mp(jobPayload.email   || 'employer@gamhubjobs.gm', 100),
    customer_phone: '7000000',
    return_url:     mp(returnUrl, 255),
    cancel_url:     mp(cancelUrl, 255),
    'metadata[source]':     'gamhubjobs-employer',
    'metadata[plan]':       mp(plan, 20),
    'metadata[job_title]':  mp(jobPayload.title || '', 100),
    'metadata[job_id]':     mp(jobId, 80),
  };

  Object.entries(fields).forEach(function(entry) {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = entry[0];
    input.value = entry[1];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  toast('Redirecting to ModemPay payment… GMD ' + amount, 'gold', 2000);
  setTimeout(function() { form.submit(); }, 800);
}

function executePDFDownload(type) {
  if (type === 'bundle') {
    executePDFDownload('cv');
    setTimeout(() => executePDFDownload('coverletter'), 3500);
    return;
  }

  const isCL = type === 'coverletter';

  if (isCL && currentView !== 'coverletter') {
    showView('coverletter');
    setTimeout(() => executePDFDownload(type), 900);
    return;
  }
  if (!isCL && currentView !== 'preview') {
    showView('preview');
    setTimeout(() => executePDFDownload(type), 900);
    return;
  }

  if (typeof html2pdf === 'undefined') {
    toast('PDF library not loaded. Using print instead.', 'default');
    window.print();
    return;
  }

  const cvData  = loadData('cvData') || {};
  const clData  = (() => { try { return JSON.parse(localStorage.getItem('folio_cover_letter')) || {}; } catch { return {}; } })();
  const rawName = (isCL ? (clData.fullname || 'cover-letter') : (cvData.fullname || 'cv'));
  const name    = rawName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const filename = isCL ? (name + '-cover-letter.pdf') : (name + '-cv.pdf');

  toast('Preparing ' + (isCL ? 'cover letter' : 'CV') + ' PDF…', 'default', 6000);

  const EXPORT_W = 794;
  const shell = document.createElement('div');
  shell.id = 'ghj-pdf-export-shell';
  shell.setAttribute('aria-hidden', 'true');
  shell.style.cssText =
    'position:fixed;left:0;top:0;width:' + EXPORT_W + 'px;margin:0;padding:0;' +
    'transform:translate3d(-12000px,0,0);pointer-events:none;overflow:visible;';

  const styleEl = document.createElement('style');
  styleEl.textContent =
    '#ghj-pdf-export-shell .cv-paper,#ghj-pdf-export-shell .cl-paper{' +
    'width:794px!important;max-width:794px!important;min-width:794px!important;' +
    'overflow:visible!important;background:#fff!important;box-shadow:none!important;' +
    'border-radius:0!important;-webkit-print-color-adjust:exact!important;' +
    'print-color-adjust:exact!important;box-sizing:border-box!important;}' +
    '#ghj-pdf-export-shell .cv-paper *,#ghj-pdf-export-shell .cl-paper *{' +
    'max-width:100%!important;word-wrap:break-word!important;overflow-wrap:break-word!important;' +
    'word-break:break-word!important;}' +
    '#ghj-pdf-export-shell .cv-body{' +
    'display:grid!important;grid-template-columns:1fr 260px!important;' +
    'grid-auto-rows:auto!important;align-items:start!important;' +
    'min-height:0!important;overflow:visible!important;}' +
    '#ghj-pdf-export-shell .cv-header,' +
    '#ghj-pdf-export-shell .cv-main,' +
    '#ghj-pdf-export-shell .cv-side{' +
    'overflow:visible!important;min-height:0!important;}' +
    '#ghj-pdf-export-shell .cv-header{width:100%!important;display:block!important;box-sizing:border-box!important;}' +
    '#ghj-pdf-export-shell .cv-section,' +
    '#ghj-pdf-export-shell .cl-letter-para,' +
    '#ghj-pdf-export-shell p{page-break-inside:avoid!important;break-inside:avoid!important;}' +
    '#ghj-pdf-export-shell p,#ghj-pdf-export-shell .cl-letter-para{line-height:1.6!important;orphans:3!important;widows:3!important;}' +
    '#ghj-pdf-export-shell .cl-letter-sig{font-family:"Cormorant Garamond",Georgia,serif!important;font-style:italic!important;text-decoration:none!important;}' +
    '#ghj-pdf-export-shell .cv-name{font-family:"Cormorant Garamond",Georgia,serif!important;text-decoration:none!important;}';

  let exportRoot;
  if (isCL) {
    renderCoverLetter();
    const src = document.getElementById('cl-paper');
    if (!src) {
      toast('Could not find document to export. Please try again.', 'error');
      return;
    }
    exportRoot = src.cloneNode(true);
    exportRoot.removeAttribute('id');
  } else {
    if (!document.getElementById('cv-paper')) {
      toast('Could not find document to export. Please try again.', 'error');
      return;
    }
    renderCV();
    exportRoot = document.createElement('div');
    exportRoot.className = 'cv-paper theme-' + currentTheme;
    exportRoot.innerHTML = buildCVHTML(loadData('cvData') || {});
  }

  shell.appendChild(styleEl);
  shell.appendChild(exportRoot);
  document.body.appendChild(shell);

  const fontWait = document.fonts ? document.fonts.ready : Promise.resolve();

  fontWait.then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const exportH = Math.max(exportRoot.scrollHeight, 1123);
        exportRoot.style.minHeight = exportH + 'px';
        exportRoot.style.height = 'auto';

        html2pdf()
          .set({
            margin:   0,
            filename: filename,
            image:    { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale:           2,
              useCORS:         true,
              allowTaint:      true,
              logging:         false,
              windowWidth:     EXPORT_W,
              scrollX:         0,
              scrollY:         0,
              backgroundColor: '#ffffff',
            },
            jsPDF: {
              unit:        'px',
              format:      [794, 1123],
              orientation: 'portrait',
              compress:    true,
            },
            pagebreak: { mode: ['css', 'legacy'], avoid: ['.cv-section', '.cl-letter-para', 'p'] },
          })
          .from(exportRoot)
          .save()
          .then(() => {
            shell.remove();
            toast(filename + ' downloaded ✦', 'gold', 4000);
          })
          .catch((err) => {
            shell.remove();
            console.error('[PDF]', err);
            toast('PDF export failed — using print fallback', 'error');
            window.print();
          });
      });
    });
  });
}

/* ============================================================
   CUSTOMIZER
   ============================================================ */
function toggleCustomizer() {
  document.getElementById('customizer-panel').classList.toggle('open');
  document.getElementById('customizer-overlay').classList.toggle('open');
  document.querySelectorAll('.cust-gear-btn').forEach(btn => {
    btn.classList.toggle('open',
      document.getElementById('customizer-panel').classList.contains('open')
    );
  });
}

function shareToTwitter() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=Check+out+my+professional+CV+built+with+Folio+CV!&url=${url}`, '_blank');
}

function shareToLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

/* ============================================================
   EMPLOYER PORTAL
   ============================================================ */
const EMPLOYER_STORAGE = {
  config:    'folio_sb_config',
  draftPost: 'folio_employer_draft',
  myJobs:    'folio_employer_jobs',
};

let SB_URL = APP_CONFIG.SUPABASE_URL;
let SB_KEY  = APP_CONFIG.SUPABASE_ANON_KEY;
let SB_CONNECTED = false;

function sbLoad() {
  const cfg = loadData_raw(EMPLOYER_STORAGE.config);
  if (cfg && cfg.url && cfg.key) {
    SB_URL = cfg.url.replace(/\/+$/, '');
    SB_KEY = cfg.key;
  } else {
    saveData_raw(EMPLOYER_STORAGE.config, { url: APP_CONFIG.SUPABASE_URL, key: APP_CONFIG.SUPABASE_ANON_KEY });
  }
  sbTestConnection();
}

function loadData_raw(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function saveData_raw(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

async function sbTestConnection() {
  try {
    const res = await fetch(SB_URL + '/rest/v1/jobs?limit=1', {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok || res.status === 406) {
      SB_CONNECTED = true;
      console.log('[Supabase] Connected ✓');
    } else {
      throw new Error('Status ' + res.status);
    }
  } catch(e) {
    SB_CONNECTED = false;
    console.warn('[Supabase] Could not connect:', e.message);
  }
}

async function sbInsertJob(job) {
  if (!rateLimiter.check('supabase_write')) {
    const wait = rateLimiter.waitSeconds('supabase_write');
    throw new Error('Too many requests — please wait ' + wait + ' seconds before submitting again.');
  }
  const res = await fetch(`${SB_URL}/rest/v1/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(job),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return await res.json();
}

async function sbFetchJobs(adminMode = false) {
  if (!rateLimiter.check('supabase_read')) {
    throw new Error('Too many read requests — please wait ' + rateLimiter.waitSeconds('supabase_read') + 's.');
  }
  const filter = adminMode ? '' : '?approved=eq.false&order=created_at.desc';
  const url = `${SB_URL}/rest/v1/jobs${filter || '?order=created_at.desc'}`;
  const res = await fetch(url, {
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function sbUpdateJob(id, patch) {
  if (!rateLimiter.check('supabase_write')) {
    throw new Error('Too many updates — please wait ' + rateLimiter.waitSeconds('supabase_write') + 's.');
  }
  const res = await fetch(`${SB_URL}/rest/v1/jobs?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
    },
    body: JSON.stringify(patch),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

function initEmployerPortal() {
  sbLoad();
  setDeadlineDefault();
  renderManageJobs();
  updatePortalStats();
}

function setDeadlineDefault() {
  const input = document.getElementById('pj-deadline');
  if (!input.value) {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    input.value = d.toISOString().split('T')[0];
  }
}

function switchPortalTab(tab, btn) {
  document.querySelectorAll('.portal-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.portal-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${tab}`)?.classList.add('active');
  if (tab === 'manage') renderManageJobs();
  if (tab === 'admin')  renderAdminPanel();
}

function updateJobPreview() {
  const title   = document.getElementById('pj-title')?.value       || '';
  const company = document.getElementById('pj-company')?.value     || '';
  const loc     = document.getElementById('pj-location')?.value    || '';
  const salary  = document.getElementById('pj-salary')?.value      || '';
  const desc    = document.getElementById('pj-description')?.value || '';
  const type    = document.querySelector('input[name="jobtype"]:checked')?.value || 'Full Time';

  document.getElementById('prev-title').textContent   = title   || 'Job Title';
  document.getElementById('prev-company').textContent = company || 'Company Name';

  const logoUrl  = document.getElementById('pj-logo-url')?.value.trim() || '';
  const logoWrap = document.getElementById('prev-logo-wrap');
  if (logoWrap) {
    logoWrap.innerHTML = logoUrl
      ? (/^https?:\/\//i.test(logoUrl) ? '<img src="' + h(logoUrl) + '" class="job-card-logo" style="width:32px;height:32px">' : '<div class="job-card-logo-placeholder" style="width:32px;height:32px;font-size:13px">🏢</div>')
      : '<div class="job-card-logo-placeholder" style="width:32px;height:32px;font-size:13px">🏢</div>';
  }

  const plan     = getSelectedPlan ? getSelectedPlan() : 'free';
  const badgeEl  = document.getElementById('prev-plan-badge');
  if (badgeEl) {
    badgeEl.innerHTML = plan === 'premium'
      ? '<span class="job-plan-badge premium">🏆 Premium</span>'
      : plan === 'featured'
      ? '<span class="job-plan-badge featured">⭐ Featured</span>'
      : '';
  }
  document.getElementById('prev-location').textContent = `📍 ${loc || 'Location'}`;
  document.getElementById('prev-type').textContent     = `💼 ${type}`;
  document.getElementById('prev-desc').textContent     = desc.slice(0, 160) || 'Your job description will appear here…';

  const salaryEl = document.getElementById('prev-salary');
  if (salary) {
    salaryEl.textContent = `💵 ${salary}`;
    salaryEl.style.display = '';
  } else {
    salaryEl.style.display = 'none';
  }
}

function updateCharCount(inputId, countId, max) {
  const val = document.getElementById(inputId)?.value || '';
  document.getElementById(countId).textContent = `${val.length} / ${max}`;
  document.getElementById(countId).style.color = val.length > max * 0.9 ? '#f87171' : 'var(--muted)';
}

function selectPill(radio) {
  document.querySelectorAll('.type-pill').forEach(p => p.classList.remove('selected'));
  radio.closest('.type-pill').classList.add('selected');
  updateJobPreview();
}

function togglePerk(chip) {
  chip.classList.toggle('selected');
}

function selectPlan(card, plan) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  card.dataset.plan = plan;

  const labels = {
    free:     '✦ Submit Free Listing',
    featured: '💳 Pay GMD 10 & Submit Featured Listing',
    premium:  '💳 Pay GMD 10 & Submit Premium Listing',
  };
  const notes = {
    free:     'Free listings are reviewed manually within 24 hours. No payment required.',
    featured: 'You will be redirected to ModemPay to complete payment securely in GMD.',
    premium:  'You will be redirected to ModemPay to complete payment securely in GMD.',
  };
  const labelEl = document.getElementById('submit-btn-label');
  const noteEl  = document.getElementById('submit-btn-note');
  if (labelEl) labelEl.textContent = labels[plan] || labels.free;
  if (noteEl)  noteEl.textContent  = notes[plan]  || notes.free;

  const badgeEl = document.getElementById('prev-plan-badge');
  if (badgeEl) {
    badgeEl.innerHTML = plan === 'premium'
      ? '<span class="job-plan-badge premium">🏆 Premium</span>'
      : plan === 'featured'
      ? '<span class="job-plan-badge featured">⭐ Featured</span>'
      : '';
  }
}

function getSelectedPlan() {
  const sel = document.querySelector('.plan-card.selected');
  return sel ? (sel.dataset.plan || 'free') : 'free';
}

function getSelectedPerks() {
  return Array.from(document.querySelectorAll('.perk-chip.selected'))
    .map(c => c.textContent.trim());
}

/* ============================================================
   MODEMPAY CONFIG
   ============================================================ */
const MODEMPAY_PUBLIC_KEY = APP_CONFIG.MODEMPAY_PUBLIC_KEY;

const MODEMPAY_CONFIG = {
  API_URL: 'https://api.modem-pay.com/v1/payment-intents',
  PRICES: {
    free:     0,
    featured: 10,
    premium:  10,
  },
  DOWNLOAD_PRICES: {
    cv:          25,
    coverletter: 15,
    bundle:      35,
  },
  FREE_DOWNLOADS: 1,
  RETURN_URL: window.location.href.split('?')[0] + '?payment_status=success',
  CANCEL_URL: window.location.href.split('?')[0] + '?payment_status=cancelled',
};

/* ============================================================
   PAYMENT RETURN HANDLER
   ============================================================ */
(function checkPaymentReturn() {
  const params  = new URLSearchParams(window.location.search);
  const status  = params.get('payment_status');
  const jobId   = params.get('job_id');
  const dlToken = params.get('dl_token');

  const clean = () => window.history.replaceState({}, '', window.location.pathname);

  if (status === 'success' && jobId) {
    window.addEventListener('DOMContentLoaded', () => {
      finalisePaidJob(jobId);
      clean();
    });
  } else if (status === 'success' && dlToken) {
    window.addEventListener('DOMContentLoaded', () => {
      finaliseDownload(dlToken);
      clean();
    });
  } else if (status === 'cancelled') {
    window.addEventListener('DOMContentLoaded', () => {
      const pending = loadData_raw('folio_pending_download');
      if (pending) {
        showView('preview');
        toast('Payment cancelled — your CV was not downloaded.', 'error', 5000);
      } else {
        showView('employer');
        toast('Payment cancelled — your job was not posted.', 'error', 5000);
      }
      clean();
    });
  }
})();

async function finaliseDownload(token) {
  try {
    const { data, error } = await supabaseClient
      .from('payments')
      .select('verified, payment_type')
      .eq('dl_token', token)
      .eq('verified', true)
      .single();

    if (error || !data) {
      await new Promise(r => setTimeout(r, 3000));

      const { data: retry } = await supabaseClient
        .from('payments')
        .select('verified, payment_type')
        .eq('dl_token', token)
        .eq('verified', true)
        .single();

      if (!retry) {
        toast('Payment is being verified — please wait a moment and try downloading again.', 'gold', 6000);
        showView('preview');
        return;
      }

      const type = retry.payment_type || 'cv';
      toast('Payment confirmed! ✦ Starting download…', 'success', 3000);
      // ── GA: track paid CV download ──
      trackCVDownload();
      executePDFDownload(type);
      return;
    }

    const type = data.payment_type || 'cv';
    toast('Payment confirmed! ✦ Starting download…', 'success', 3000);
    showView(type === 'coverletter' ? 'coverletter' : 'preview');
    // ── GA: track paid CV download ──
    trackCVDownload();
    setTimeout(() => executePDFDownload(type), 800);

  } catch (err) {
    console.error('[Payment] Verification error:', err.message);
    toast('Could not verify payment — please contact support.', 'error', 6000);
  }
}

/* ============================================================
   WHATSAPP JOB NOTIFICATION
   ============================================================ */
function sendJobNotificationWhatsApp(jobPayload, plan) {
  try {
    const perks = (() => {
      try { return JSON.parse(jobPayload.perks || '[]').join(', '); }
      catch { return ''; }
    })();

    const submittedAt = new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const paymentStatus = plan === 'free'
      ? 'FREE LISTING — No payment required'
      : 'PAID — GMD ' + (MODEMPAY_CONFIG.PRICES[plan] || 0) + ' via ModemPay';

    const msg =
      '🆕 *NEW JOB SUBMISSION — GamHub Jobs*\n' +
      '━━━━━━━━━━━━━━━━━━━━\n\n' +
      '🏢 *COMPANY DETAILS*\n' +
      '• Company: ' + (jobPayload.company || '—') + '\n' +
      '• Industry: ' + (jobPayload.industry || '—') + '\n' +
      '• Contact Email: ' + (jobPayload.email || '—') + '\n' +
      '• Website: ' + (jobPayload.website || '—') + '\n\n' +
      '📋 *JOB DETAILS*\n' +
      '• Title: ' + (jobPayload.title || '—') + '\n' +
      '• Location: ' + (jobPayload.location || '—') + '\n' +
      '• Type: ' + (jobPayload.type || '—') + '\n' +
      '• Salary: ' + (jobPayload.salary || 'Not specified') + '\n' +
      '• Experience: ' + (jobPayload.experience || '—') + '\n' +
      '• Deadline: ' + (jobPayload.deadline || '—') + '\n' +
      '• Plan: ' + (plan || 'free').toUpperCase() + '\n' +
      '• Payment: ' + paymentStatus + '\n\n' +
      '📝 *DESCRIPTION*\n' +
      (jobPayload.description || '—') + '\n\n' +
      '✅ *REQUIREMENTS*\n' +
      (jobPayload.requirements || '—') + '\n\n' +
      '🎁 *PERKS*\n' +
      (perks || '—') + '\n\n' +
      '🔗 *APPLY URL*\n' +
      (jobPayload.apply_url || '—') + '\n\n' +
      '🕐 Submitted: ' + submittedAt;

    const encoded = encodeURIComponent(msg);
    const waUrl = 'https://wa.me/2206371941?text=' + encoded;

    window.location.href = waUrl;

  } catch(err) {
    console.error('[WhatsApp notify] Failed:', err);
  }
}

/* ============================================================
   SAVE JOB DIRECTLY (free listings)
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

  await sendJobNotificationWhatsApp(jobPayload, jobPayload.plan || 'free');

  toast(
    savedRemotely ? 'Job submitted! Saved to database ✓' : 'Job saved locally (connect Supabase to go live)',
    savedRemotely ? 'success' : 'gold', 5000
  );
  updatePortalStats();
}

/* ============================================================
   FINALISE PAID JOB
   ============================================================ */
async function finalisePaidJob(jobId) {
  showView('employer');

  try {
    if (SB_CONNECTED) {
      await sbUpdateJob(jobId, { paid: true, payment_confirmed: true });
    }
  } catch(err) {
    console.warn('[Payment] Could not mark job paid in DB:', err.message);
  }

  const formEl    = document.getElementById('post-job-form');
  const successEl = document.getElementById('submission-success');
  if (formEl)    formEl.style.display = 'none';
  if (successEl) successEl.classList.add('show');
  toast('Payment confirmed! ✦ Your job listing has been submitted for review.', 'success', 6000);

  const pending = loadData_raw('folio_pending_job');
  if (pending) {
    const localJobs = loadData_raw(EMPLOYER_STORAGE.myJobs) || [];
    localJobs.unshift({ ...pending, id: jobId, paid: true, _pendingId: undefined });
    saveData_raw(EMPLOYER_STORAGE.myJobs, localJobs);

    await sendJobNotificationWhatsApp(pending, pending.plan || 'free');

    localStorage.removeItem('folio_pending_job');
  }

  updatePortalStats();
}

/* ============================================================
   SUBMIT JOB POST
   ============================================================ */
async function submitJobPost() {
  const title       = document.getElementById('pj-title')?.value.trim()        || '';
  const company     = document.getElementById('pj-company')?.value.trim()      || '';
  const email       = document.getElementById('pj-email')?.value.trim()        || '';
  const location    = document.getElementById('pj-location')?.value            || '';
  const deadline    = document.getElementById('pj-deadline')?.value            || '';
  const description = document.getElementById('pj-description')?.value.trim()  || '';

  if (!title)                   { toast('Please enter a job title', 'error');              return; }
  if (!company)                 { toast('Please enter your company name', 'error');        return; }
  if (!email || !email.includes('@')) { toast('Please enter a valid contact email', 'error'); return; }
  if (!location)                { toast('Please select a location', 'error');              return; }
  if (!deadline)                { toast('Please set an application deadline', 'error');    return; }
  if (description.length < 100) { toast('Description must be at least 100 characters', 'error'); return; }

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
    type: jobType,
    salary, experience, industry,
    website, apply_url: applyUrl,
    logo_url: logoUrl,
    perks: JSON.stringify(perks),
    plan,
    approved: false,
    submitted_at: new Date().toISOString(),
  };
  const jobPayload = sanitizeJobPayload(rawPayload);

  const btn = document.getElementById('submit-job-btn');
  btn.classList.add('btn-submitting');
  btn.disabled = true;

  const amount = MODEMPAY_CONFIG.PRICES[plan] || 0;

  if (amount === 0) {
    await saveJobDirectly(jobPayload);
    btn.classList.remove('btn-submitting');
    btn.disabled = false;
  } else {
    btn.classList.remove('btn-submitting');
    btn.disabled = false;
    submitJobPaymentForm(jobPayload, plan, amount);
  }
}

function resetPostForm() {
  document.getElementById('pj-title').value       = '';
  document.getElementById('pj-company').value     = '';
  document.getElementById('pj-email').value       = '';
  document.getElementById('pj-location').value    = '';
  document.getElementById('pj-salary').value      = '';
  document.getElementById('pj-description').value = '';
  document.getElementById('pj-requirements').value = '';
  document.getElementById('pj-apply-url').value   = '';
  document.querySelectorAll('.perk-chip').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.plan-card').forEach((c,i) => c.classList.toggle('selected', i===0));
  document.querySelector('input[name="jobtype"][value="Full Time"]').checked = true;
  document.querySelectorAll('.type-pill').forEach((p,i) => p.classList.toggle('selected', i===0));
  setDeadlineDefault();
  updateJobPreview();
  document.getElementById('post-job-form').style.display = '';
  document.getElementById('submission-success').classList.remove('show');
}

function renderManageJobs() {
  const container = document.getElementById('manage-jobs-list');
  const jobs = loadData_raw(EMPLOYER_STORAGE.myJobs) || [];

  if (!jobs.length) {
    container.innerHTML = `
      <div class="manage-empty">
        <div style="font-size:48px;margin-bottom:16px">📋</div>
        <h3>No listings yet</h3>
        <p style="margin-bottom:20px">Your submitted job posts will appear here.</p>
        <button class="btn btn-gold" onclick="switchPortalTab('post', document.querySelector('.portal-tab'))">Post Your First Job</button>
      </div>`;
    return;
  }

  container.innerHTML = jobs.map(job => {
    const statusClass = job.approved ? 'status-approved' : (job.rejected ? 'status-rejected' : 'status-pending');
    const statusLabel = job.approved ? '✓ Live' : (job.rejected ? '✗ Rejected' : '⏳ Pending Review');
    const perks = (() => { try { return JSON.parse(job.perks || '[]'); } catch { return []; } })();

    return `
      <div class="manage-job-card">
        <div>
          <div class="manage-job-title">${h(job.title)}</div>
          <div style="font-size:13px;color:var(--text2);margin-bottom:8px">${h(job.company)} · ${h(job.industry||'')}</div>
          <div class="manage-job-meta">
            <span>📍 ${h(job.location)}</span>
            <span>💼 ${h(job.type)}</span>
            ${job.salary ? `<span>💵 ${h(job.salary)}</span>` : ''}
            <span>⏰ Closes ${h(job.deadline)}</span>
            <span>📋 ${h(job.plan||'free')} plan</span>
          </div>
          ${perks.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${perks.map(p=>`<span style="font-size:11px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:100px;padding:2px 8px;color:var(--text2)">${h(p)}</span>`).join('')}</div>` : ''}
          <div style="font-size:11px;color:var(--muted);margin-top:10px">
            Submitted: ${new Date(job.submitted_at||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
            ${job._local ? ' · <span style="color:var(--gold)">Stored locally</span>' : ' · <span style="color:#4ade80">In database</span>'}
          </div>
        </div>
        <div class="manage-job-actions">
          <span class="status-badge ${statusClass}">${statusLabel}</span>
          <button class="btn btn-ghost btn-sm" onclick="deleteMyJob('${job.id}')">✕ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteMyJob(id) {
  if (!confirm('Delete this job listing?')) return;
  const jobs = (loadData_raw(EMPLOYER_STORAGE.myJobs) || []).filter(j => j.id !== id);
  saveData_raw(EMPLOYER_STORAGE.myJobs, jobs);
  renderManageJobs();
  updatePortalStats();
  toast('Listing deleted', 'default');
}

function updatePortalStats() {
  const jobs    = loadData_raw(EMPLOYER_STORAGE.myJobs) || [];
  const total   = jobs.length;
  const active  = jobs.filter(j => j.approved).length;
  const pending = jobs.filter(j => !j.approved && !j.rejected).length;
  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-active').textContent  = active;
  document.getElementById('stat-pending').textContent = pending;
}

let adminLoggedIn = false;

async function checkAdminAccess() {
  const statusEl = document.getElementById('admin-access-status');
  const btn      = document.getElementById('admin-check-btn');

  if (!currentUser) {
    if (statusEl) statusEl.innerHTML =
      '<span style="color:#f87171">You must be logged in to access admin.</span>' +
      ' <button class="btn btn-gold btn-sm" style="margin-top:10px" onclick="showAuthModal(checkAdminAccess)">Log In →</button>';
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Checking…'; }
  if (statusEl) statusEl.textContent = 'Verifying your role in Supabase…';

  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (error) throw new Error(error.message);

    if (data && data.role === 'admin') {
      adminLoggedIn = true;
      document.getElementById('admin-login').style.display = 'none';
      document.getElementById('admin-panel').classList.add('active');
      renderAdminPanel();
      toast('Admin access granted ✦', 'gold');
    } else {
      const role = (data && data.role) ? data.role : 'user';
      if (statusEl) statusEl.innerHTML =
        '<span style="color:#f87171">Access denied.</span> Your role is <code style="color:var(--gold)">' +
        h(role) + '</code>. ' +
        'To become an admin, set <code style="color:var(--gold)">role = admin</code> ' +
        'in the Supabase profiles table for your user ID: ' +
        '<code style="color:var(--text2);font-size:11px">' + h(currentUser.id) + '</code>';
      toast('Access denied — you are not an admin', 'error');
    }
  } catch(err) {
    const msg = err.message || 'Could not verify role';
    if (statusEl) statusEl.innerHTML =
      '<span style="color:#f87171">Error: ' + h(msg) + '</span><br>' +
      '<span style="font-size:12px;color:var(--muted)">Make sure the <code>profiles</code> table exists ' +
      'in your Supabase project with a <code>role</code> column.</span>';
    toast('Configuration error — please contact support', 'error', 6000);
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Check Admin Access →'; }
}

function adminLogin() { checkAdminAccess(); }

function adminLogout() {
  adminLoggedIn = false;
  document.getElementById('admin-login').style.display = '';
  document.getElementById('admin-panel').classList.remove('active');
  const statusEl = document.getElementById('admin-access-status');
  if (statusEl) statusEl.textContent = 'Checking your access level…';
}

async function renderAdminPanel() {
  if (!adminLoggedIn || !currentUser) return;

  const container = document.getElementById('admin-jobs-list');
  if (!container) return;
  container.innerHTML = `
    <div style="text-align:center;padding:40px;color:var(--muted)">
      Loading pending jobs…
    </div>`;

  let jobs = [];

  try {
    const { data, error } = await supabaseClient.rpc('get_all_jobs_admin');

    if (error) {
      if (error.message.includes('Access denied')) {
        container.innerHTML = `
          <div style="text-align:center;padding:40px;color:#f87171">
            ⛔ Access denied — your account does not have admin role in the database.
          </div>`;
        adminLoggedIn = false;
        return;
      }
      throw error;
    }

    jobs = data || [];

  } catch (err) {
    console.warn('[Admin] RPC failed, trying local fallback:', err.message);
    jobs = loadData_raw(EMPLOYER_STORAGE.myJobs) || [];
    toast('Could not reach database — showing local jobs only', 'error', 5000);
  }

  const pending = jobs.filter(j => !j.approved && !j.rejected);

  const countEl = document.getElementById('admin-pending-count');
  if (countEl) countEl.textContent = `(${pending.length} pending)`;

  if (!pending.length) {
    container.innerHTML = `
      <div class="manage-empty">
        <div style="font-size:40px;margin-bottom:12px">✅</div>
        <h3>All clear!</h3>
        <p>No jobs pending review right now.</p>
      </div>`;
    return;
  }

  container.innerHTML = pending.map(job => `
    <div class="admin-job-row" id="admin-row-${job.id}">
      <div>
        <h4>${h(job.title)}<span style="font-weight:400;color:var(--muted)">— ${h(job.company)}</span></h4>
        <p>📍 ${h(job.location)} · 💼 ${h(job.type)} · ⏰ ${h(job.deadline)} · 📋 ${h(job.plan || 'free')}</p>
        <p style="margin-top:6px;color:var(--text2);font-size:12px;max-width:600px;line-height:1.5">
          ${h((job.description || '').slice(0, 200))}…
        </p>
        <p style="margin-top:6px;font-size:11px;color:var(--muted)">
          Contact: ${h(job.email)}
          ${job._local ? '· <span style="color:var(--gold)">Local only</span>' : '· <span style="color:#4ade80">In database</span>'}
        </p>
      </div>
      <div class="admin-approve-btns">
        <button class="btn-approve" onclick="adminApprove('${h(job.id)}', ${!!job._local})">✓ Approve</button>
        <button class="btn-reject"  onclick="adminReject('${h(job.id)}', ${!!job._local})">✗ Reject</button>
      </div>
    </div>
  `).join('');
}

async function adminApprove(id, isLocal) {
  const row = document.getElementById(`admin-row-${id}`);
  if (row) { row.style.opacity = '0.4'; row.style.pointerEvents = 'none'; }

  if (!isLocal && SB_CONNECTED) {
    try {
      await sbUpdateJob(id, { approved: true });
      toast('Job approved and live!', 'success');
    } catch(e) {
      toast('Supabase update failed — approving locally', 'error');
      isLocal = true;
    }
  }

  const jobs = loadData_raw(EMPLOYER_STORAGE.myJobs) || [];
  const idx  = jobs.findIndex(j => String(j.id) === String(id));
  if (idx !== -1) { jobs[idx].approved = true; saveData_raw(EMPLOYER_STORAGE.myJobs, jobs); }

  if (isLocal) toast('Approved locally ✓ (connect Supabase to make it live)', 'gold');

  setTimeout(() => { row?.remove(); updatePortalStats(); }, 600);
}

async function adminReject(id, isLocal) {
  const row = document.getElementById(`admin-row-${id}`);
  if (row) { row.style.opacity = '0.4'; row.style.pointerEvents = 'none'; }

  if (!isLocal && SB_CONNECTED) {
    try {
      await sbUpdateJob(id, { approved: false, rejected: true });
    } catch(e) { isLocal = true; }
  }

  const jobs = loadData_raw(EMPLOYER_STORAGE.myJobs) || [];
  const idx  = jobs.findIndex(j => String(j.id) === String(id));
  if (idx !== -1) { jobs[idx].rejected = true; saveData_raw(EMPLOYER_STORAGE.myJobs, jobs); }

  toast('Job rejected', 'default');
  setTimeout(() => { row?.remove(); updatePortalStats(); }, 600);
}

function adminRefresh() { renderAdminPanel(); }

document.addEventListener('DOMContentLoaded', () => { sbLoad(); });

/* ============================================================
   JOB SEARCH
   ============================================================ */
const JOB_LISTINGS = [
  {
    id: 'frontend-developer-gamtech',
    title: 'Frontend Developer',
    company: 'GamTech Solutions',
    industry: 'IT & Tech',
    email: 'careers@gamtech.gm',
    website: 'https://gamtech.gm',
    location: 'Banjul, Gambia',
    category: 'IT & Tech',
    type: 'Full-Time',
    deadline: '30 May 2025',
    salary: 'GMD 25,000 – 35,000 / month',
    experience: '2+ years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Send your CV and portfolio to careers@gamtech.gm with subject line "Frontend Developer Application". Shortlisted candidates will be contacted within 5 working days.',
    description: 'We are looking for a skilled Frontend Developer to join our growing team. You will build responsive web interfaces using HTML, CSS, and JavaScript frameworks. Strong understanding of UX principles and cross-browser compatibility required. Experience with React or Vue.js is a plus.',
    requirements: '• Bachelor\'s degree in Computer Science, IT, or related field\n• 2+ years of hands-on frontend development experience\n• Proficiency in HTML5, CSS3, and modern JavaScript (ES6+)\n• Experience with at least one JS framework (React, Vue, or Angular)\n• Understanding of responsive design and mobile-first development\n• Familiarity with Git version control\n• Good communication skills in English',
    perks: '• Competitive monthly salary\n• Health insurance coverage\n• Flexible working hours\n• Annual performance bonus\n• Professional development budget\n• Friendly, collaborative team culture',
  },
  {
    id: 'digital-marketing-atlantic',
    title: 'Digital Marketing Specialist',
    company: 'Atlantic Media Group',
    industry: 'Marketing',
    email: 'hr@atlanticmedia.gm',
    website: 'https://atlanticmedia.gm',
    location: 'Serekunda, Gambia',
    category: 'Marketing',
    type: 'Full-Time',
    deadline: '15 May 2025',
    salary: 'GMD 20,000 – 28,000 / month',
    experience: '1–3 years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Apply via our website at atlanticmedia.gm/careers or email hr@atlanticmedia.gm with your CV, cover letter, and a portfolio of past campaigns.',
    description: 'We need a creative Digital Marketing Specialist to drive our online presence across multiple brands. Responsibilities include managing social media channels, creating content calendars, running paid ad campaigns on Google and Meta, analysing performance metrics, and producing monthly reports.',
    requirements: '• Degree in Marketing, Communications, or related field\n• 1–3 years of digital marketing experience\n• Hands-on experience with Google Ads and Meta Ads Manager\n• Proficiency in social media management tools\n• Strong copywriting and content creation skills\n• Analytical mindset — comfortable working with data and KPIs',
    perks: '• Creative and energetic work environment\n• Monthly airtime and data allowance\n• Opportunity to manage high-profile campaigns\n• Team outings and company events\n• Clear career progression path',
  },
  {
    id: 'accountant-trust-bank',
    title: 'Accountant',
    company: 'Trust Bank Gambia',
    industry: 'Finance',
    email: 'recruitment@trustbank.gm',
    website: 'https://trustbank.gm',
    location: 'Banjul, Gambia',
    category: 'Finance',
    type: 'Full-Time',
    deadline: '20 May 2025',
    salary: 'GMD 30,000 – 42,000 / month',
    experience: '3+ years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Submit applications to recruitment@trustbank.gm. Include your CV, certified copies of qualifications, and a cover letter.',
    description: 'We are seeking a meticulous Accountant to manage financial records, prepare monthly and quarterly reports, and ensure full compliance with Gambian tax regulations and banking standards.',
    requirements: '• Degree in Accounting, Finance, or equivalent professional qualification (ACCA, CPA)\n• Minimum 3 years of accounting experience, preferably in a banking environment\n• Proficiency in accounting software (Sage, QuickBooks, or similar)\n• Strong knowledge of IFRS and local tax regulations\n• High level of accuracy and attention to detail',
    perks: '• Competitive salary with annual increments\n• Comprehensive medical benefits\n• Pension and retirement scheme\n• Staff banking benefits\n• Structured training and career development programme',
  },
  {
    id: 'graphic-designer-saul',
    title: 'Graphic Designer',
    company: 'Saul Creative Studio',
    industry: 'Design',
    email: 'hello@saulcreative.gm',
    website: 'https://saulcreative.gm',
    location: 'Bakau, Gambia',
    category: 'Design',
    type: 'Part-Time',
    deadline: '10 May 2025',
    salary: 'GMD 8,000 – 12,000 / month (part-time)',
    experience: '1+ year',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Email hello@saulcreative.gm with the subject "Graphic Designer Application". Attach your portfolio (PDF or link), CV, and brief cover note.',
    description: 'Looking for a talented Graphic Designer to support our boutique studio on a part-time basis (20 hours/week). You will produce brand identities, social media visuals, print materials, and web graphics for our diverse client base.',
    requirements: '• Portfolio demonstrating strong visual design skills\n• Proficiency in Adobe Creative Suite (Illustrator, Photoshop, InDesign)\n• Understanding of brand consistency and typography\n• Ability to work independently and meet deadlines\n• Knowledge of basic print production standards',
    perks: '• Flexible part-time schedule\n• Creative, inspiring studio environment\n• Exposure to diverse client briefs\n• Mentorship from senior designers\n• Potential to transition to full-time role',
  },
  {
    id: 'programme-officer-actionaid',
    title: 'Programme Officer',
    company: 'ActionAid Gambia',
    industry: 'NGO',
    email: 'gambia@actionaid.org',
    website: 'https://actionaid.org/gambia',
    location: 'Banjul, Gambia',
    category: 'NGO',
    type: 'Full-Time',
    deadline: '25 May 2025',
    salary: 'Competitive (based on ActionAid salary scale)',
    experience: '3–5 years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Applications must be submitted through ActionAid\'s online recruitment portal at actionaid.org/gambia/careers.',
    description: 'ActionAid Gambia is recruiting a Programme Officer to coordinate and implement community development projects focusing on gender equality, food security, and youth empowerment.',
    requirements: '• Bachelor\'s degree in Development Studies, Social Sciences, or related field\n• Minimum 3 years of programme management experience in the development sector\n• Proven experience in project monitoring, evaluation, and reporting\n• Strong budget management and financial literacy\n• Excellent report writing skills in English',
    perks: '• Salary aligned with international NGO standards\n• Health and life insurance\n• Annual leave and generous parental leave\n• Pension contribution\n• Training and capacity building opportunities',
  },
  {
    id: 'it-support-gamcel',
    title: 'IT Support Technician',
    company: 'Gamcel Telecommunications',
    industry: 'IT & Tech',
    email: 'jobs@gamcel.gm',
    website: 'https://gamcel.gm',
    location: 'Brikama, Gambia',
    category: 'IT & Tech',
    type: 'Full-Time',
    deadline: '18 May 2025',
    salary: 'GMD 18,000 – 24,000 / month',
    experience: '1–2 years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Send your CV and copies of relevant certifications to jobs@gamcel.gm.',
    description: 'We are hiring an IT Support Technician to maintain hardware, software, and network systems across our Brikama operations.',
    requirements: '• HND or degree in IT, Computer Science, or Networking\n• CompTIA A+, Network+, or equivalent certification preferred\n• 1–2 years of IT helpdesk or support experience\n• Knowledge of Windows and Linux operating systems\n• Familiarity with network equipment',
    perks: '• Monthly salary plus annual bonus\n• Staff phone and data plan\n• Transport allowance\n• Medical insurance\n• Internal promotion opportunities',
  },
  {
    id: 'social-media-kairaba',
    title: 'Social Media Manager',
    company: 'Kairaba Beach Hotel',
    industry: 'Hospitality',
    email: 'marketing@kairababeach.gm',
    website: 'https://kairababeach.gm',
    location: 'Kololi, Gambia',
    category: 'Marketing',
    type: 'Remote',
    deadline: '12 May 2025',
    salary: 'GMD 15,000 – 20,000 / month',
    experience: '2+ years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Email marketing@kairababeach.gm with your CV and links to social media accounts or campaigns you have managed.',
    description: 'Kairaba Beach Hotel is looking for a skilled Social Media Manager to grow our digital footprint and showcase the best of Gambian hospitality online.',
    requirements: '• 2+ years of social media management experience\n• Proven track record of growing audiences and engagement\n• Strong photography, videography, or content creation skills\n• Experience with social scheduling tools\n• Excellent written English and storytelling ability',
    perks: '• Fully remote position\n• Complimentary stays at the hotel\n• Performance-based bonus\n• Exposure to international tourism market\n• Creative freedom to build the brand\'s digital identity',
  },
  {
    id: 'software-intern-qcell',
    title: 'Software Engineer Intern',
    company: 'QCell Gambia',
    industry: 'IT & Tech',
    email: 'internships@qcell.gm',
    website: 'https://qcell.gm',
    location: 'Banjul, Gambia',
    category: 'IT & Tech',
    type: 'Internship',
    deadline: '8 May 2025',
    salary: 'GMD 5,000 / month (stipend)',
    experience: 'Student / Graduate',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Apply by emailing internships@qcell.gm with your CV, a brief motivation letter, and your GitHub profile or code samples if available.',
    description: 'QCell is offering a 3-month paid software engineering internship for final-year university students or recent graduates.',
    requirements: '• Currently enrolled in final year of Computer Science, IT, or Software Engineering — OR recent graduate (within 12 months)\n• Knowledge of at least one programming language: Python, JavaScript, or Java\n• Understanding of basic data structures and algorithms\n• Familiarity with Git and version control',
    perks: '• Monthly stipend of GMD 5,000\n• Mentorship from senior QCell engineers\n• Real project experience for your portfolio\n• Certificate of completion\n• High-performing interns considered for full-time roles',
  },
  {
    id: 'hr-officer-gra',
    title: 'HR Officer',
    company: 'Gambia Revenue Authority',
    industry: 'Government',
    email: 'hr@gra.gm',
    website: 'https://gra.gm',
    location: 'Banjul, Gambia',
    category: 'HR',
    type: 'Full-Time',
    deadline: '22 May 2025',
    salary: 'Government pay scale (Grade 8–10)',
    experience: '3+ years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Submit a completed application form (available at gra.gm/careers), certified copies of your certificates, and a cover letter to hr@gra.gm.',
    description: 'The Gambia Revenue Authority is recruiting an HR Officer to support all aspects of human resource management including talent acquisition, onboarding, staff training coordination, performance management, and policy compliance.',
    requirements: '• Degree in Human Resource Management, Business Administration, or related field\n• Minimum 3 years of HR generalist experience\n• Thorough knowledge of the Gambia Labour Act\n• Experience with recruitment, performance appraisal systems, and payroll coordination\n• High level of confidentiality and professional integrity',
    perks: '• Government pension and benefits scheme\n• Paid annual and sick leave\n• Professional training sponsorship\n• Stable public sector employment',
  },
  {
    id: 'clinical-nurse-rvth',
    title: 'Clinical Nurse',
    company: 'RVTH Royal Victoria Hospital',
    industry: 'Healthcare',
    email: 'nursing@rvth.gov.gm',
    website: 'https://rvth.gov.gm',
    location: 'Banjul, Gambia',
    category: 'Healthcare',
    type: 'Full-Time',
    deadline: '28 May 2025',
    salary: 'Government health sector pay scale',
    experience: '2+ years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Applications must be submitted in person to the Nursing Administration Office at RVTH, Banjul.',
    description: 'RVTH is seeking experienced Clinical Nurses to join various wards including Medical, Surgical, Paediatrics, and Maternity.',
    requirements: '• Diploma or Bachelor\'s degree in Nursing\n• Valid nursing licence registered with the Gambia Nurses and Midwives Council\n• Minimum 2 years of clinical nursing experience\n• Strong patient assessment and care planning skills\n• BLS/CPR certification preferred',
    perks: '• Government salary and allowances\n• Medical and pension benefits\n• Opportunities for specialist training\n• Supportive multidisciplinary team environment',
  },
  {
    id: 'teacher-nusrat',
    title: 'Secondary School Teacher',
    company: 'Nusrat Senior Secondary School',
    industry: 'Education',
    email: 'principal@nusratschool.gm',
    website: 'https://nusratschool.gm',
    location: 'Banjul, Gambia',
    category: 'Education',
    type: 'Full-Time',
    deadline: '5 June 2025',
    salary: 'GMD 12,000 – 16,000 / month',
    experience: '1+ year',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Submit your application letter, CV, certified copies of certificates, and two references to the Principal\'s Office.',
    description: 'We are hiring qualified, passionate teachers for Mathematics and English Language at senior secondary level (Grades 10–12).',
    requirements: '• Bachelor\'s degree in Education (Mathematics or English)\n• Registration with the Teaching Service Commission (TSC) or eligibility to register\n• Minimum 1 year of classroom teaching experience at secondary level\n• Strong classroom management skills',
    perks: '• Competitive salary\n• Long vacation benefits (school calendar)\n• Professional development and training\n• Supportive school leadership',
  },
  {
    id: 'uiux-designer-africell',
    title: 'UI/UX Designer',
    company: 'Africell Gambia',
    industry: 'IT & Tech',
    email: 'talent@africell.gm',
    website: 'https://africell.gm',
    location: 'Banjul, Gambia',
    category: 'Design',
    type: 'Contract',
    deadline: '16 May 2025',
    salary: 'GMD 35,000 – 50,000 / month (6-month contract)',
    experience: '3+ years',
    logo: '',
    applyLink: 'https://gamhubjobs.com',
    applyInfo: 'Email talent@africell.gm with the subject "UI/UX Designer – Contract". Include your CV, Figma portfolio link or case studies, and your earliest available start date.',
    description: 'Africell Gambia seeks a UI/UX Designer on a 6-month contract to lead the redesign of key customer-facing digital products including our mobile app and self-care portal.',
    requirements: '• 3+ years of professional UI/UX design experience\n• Strong Figma skills — prototyping, components, auto-layout\n• Portfolio demonstrating mobile app and web design projects\n• Experience conducting user research and usability testing\n• Understanding of accessibility standards (WCAG)',
    perks: '• Highly competitive contract rate\n• Work on products used by millions of Gambians\n• Modern office with great facilities\n• Potential for contract renewal or permanent offer',
  },
];

function initJobSearchView() {
  renderJobs(JOB_LISTINGS);
}

function filterJobs() {
  const kw  = (document.getElementById('js-keyword')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('js-cat')?.value  || '';
  const typ = document.getElementById('js-type')?.value || '';

  const filtered = JOB_LISTINGS.filter(job => {
    const inText = !kw ||
      job.title.toLowerCase().includes(kw) ||
      job.description.toLowerCase().includes(kw) ||
      job.company.toLowerCase().includes(kw);
    const inCat  = !cat || job.category === cat;
    const inType = !typ || job.type === typ;
    return inText && inCat && inType;
  });

  renderJobs(filtered);
}

function renderJobs(list) {
  const grid  = document.getElementById('js-job-grid');
  const empty = document.getElementById('js-empty');
  const meta  = document.getElementById('js-result-meta');
  if (!grid) return;

  grid.innerHTML = '';

  if (!list.length) {
    grid.style.display = 'none';
    empty.style.display = '';
    if (meta) meta.innerHTML = 'Showing <strong>0</strong> jobs';
    return;
  }

  grid.style.display = '';
  empty.style.display = 'none';
  if (meta) meta.innerHTML = 'Showing <strong>' + list.length + '</strong> of <strong>' + JOB_LISTINGS.length + '</strong> jobs';

  list.forEach((job, idx) => {
    grid.appendChild(createJobCard(job, idx));
  });

  /* Stamp the first Apply Now button so GHJTour can observe it */
  requestAnimationFrame(() => {
    const firstApply = grid.querySelector('.js-btn-apply');
    if (firstApply && !firstApply.id) firstApply.id = 'ghj-first-apply-btn';
  });
}

function getJobUrl(job) {
  const id = job.id || (job.title || 'job')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return window.location.origin + window.location.pathname + '?job=' + id;
}

function extractApplyEmail(job) {
  const sources = [job.applyInfo || '', job.applyLink || '', job.email || ''];
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  for (const src of sources) {
    const match = src.match(emailRegex);
    if (match) return match[0];
  }
  return null;
}

function applyNowEmail(jobId) {
  const job = JOB_LISTINGS.find(j => j.id === jobId);
  if (!job) return;

  // ── GA: track apply click ──
  trackApply(job.title || jobId);

  const email = extractApplyEmail(job);

  if (!email) {
    toast('No valid application email found for this job. Please check the job details for instructions.', 'error', 6000);
    return;
  }

  toast('📎 Make sure you have downloaded your CV and attach it before sending.', 'gold', 6000);

  const subject = encodeURIComponent('Job Application for ' + job.title);
  const body = encodeURIComponent(
    'Hello,\n\nI am applying for the position of ' + job.title + '.\n\nPlease find my CV attached.\n\nThank you.'
  );

  setTimeout(() => {
    window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
  }, 800);
}

function createJobCard(job, idx) {
  const card = document.createElement('div');
  card.className = 'js-card';
  card.dataset.idx = String(idx);

  const initials = job.company.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const logoHTML = job.logo
    ? `<img class="js-logo" src="${escHtml(job.logo)}" alt="${escHtml(job.company)} logo" loading="lazy">`
    : `<div class="js-logo-fallback" aria-hidden="true">${initials}</div>`;

  const typeClass = {
    'Remote':     'remote',
    'Part-Time':  'part',
    'Internship': 'intern',
    'Contract':   'contract',
  }[job.type] || '';

  const descId     = `js-desc-${idx}`;
  const vmBtnId    = `js-vmbtn-${idx}`;
  const shareBtnId = `js-sharebtn-${idx}`;
  const dropId     = `js-drop-${idx}`;

  card.innerHTML = `
    <div class="js-card-head">
      ${logoHTML}
      <div class="js-card-title-wrap">
        <h3 class="js-card-title">${escHtml(job.title)}</h3>
        <p class="js-card-company">${escHtml(job.company)}</p>
      </div>
    </div>
    <div class="js-card-badges">
      <span class="js-badge js-badge-type ${typeClass}">${escHtml(job.type)}</span>
      <span class="js-badge js-badge-cat">${escHtml(job.category)}</span>
      <span class="js-badge js-badge-loc">${escHtml(job.location)}</span>
    </div>
    <p class="js-card-desc" id="${descId}" aria-expanded="false">${escHtml(job.description)}</p>
    <div class="js-card-actions">
      <button class="js-btn-view" id="${vmBtnId}" aria-controls="${descId}" aria-expanded="false">View Details →</button>
      <button class="js-btn-apply" aria-label="Apply for ${escHtml(job.title)} at ${escHtml(job.company)}">Apply Now →</button>
      <div class="js-share-wrap">
        <button class="js-btn-share" id="${shareBtnId}" aria-haspopup="true" aria-expanded="false" aria-controls="${dropId}">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="13" cy="2.5" r="1.75" stroke="currentColor" stroke-width="1.4"/>
            <circle cx="13" cy="13.5" r="1.75" stroke="currentColor" stroke-width="1.4"/>
            <circle cx="3"  cy="8"   r="1.75" stroke="currentColor" stroke-width="1.4"/>
            <line x1="4.7" y1="7.1" x2="11.3" y2="3.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <line x1="4.7" y1="8.9" x2="11.3" y2="12.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          Share
        </button>
        <div class="js-share-dropdown" id="${dropId}" role="menu" aria-labelledby="${shareBtnId}">
          <div class="js-share-dropdown-title">Share this job</div>
          <button class="js-share-item priority" role="menuitem" data-action="whatsapp">
            <span class="js-share-item-icon">💬</span>
            <span class="js-share-item-label">WhatsApp</span>
          </button>
          <button class="js-share-item" role="menuitem" data-action="copy">
            <span class="js-share-item-icon">🔗</span>
            <span class="js-share-item-label">Copy Link</span>
          </button>
          <button class="js-share-item" role="menuitem" data-action="email">
            <span class="js-share-item-icon">✉️</span>
            <span class="js-share-item-label">Email a Friend</span>
          </button>
          <div class="js-share-divider"></div>
          <button class="js-share-item" role="menuitem" data-action="linkedin">
            <span class="js-share-item-icon">🔵</span>
            <span class="js-share-item-label">LinkedIn</span>
          </button>
          <button class="js-share-item" role="menuitem" data-action="twitter">
            <span class="js-share-item-icon">🐦</span>
            <span class="js-share-item-label">X / Twitter</span>
          </button>
        </div>
      </div>
    </div>
  `;

  card.style.cursor = 'pointer';
  card.addEventListener('click', () => openJobPage(job));

  const vmBtn = card.querySelector(`#${vmBtnId}`);
  vmBtn.addEventListener('click', e => { e.stopPropagation(); openJobPage(job); });

  const applyBtn = card.querySelector('.js-btn-apply');
  applyBtn.addEventListener('click', e => { e.stopPropagation(); applyNowEmail(job.id); });

  const shareBtn = card.querySelector(`#${shareBtnId}`);
  const drop     = card.querySelector(`#${dropId}`);
  shareBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = drop.classList.contains('open');
    closeAllShareDropdowns();
    if (!isOpen) {
      drop.classList.add('open');
      shareBtn.setAttribute('aria-expanded', 'true');
      drop.querySelector('.js-share-item')?.focus();
    }
  });

  drop.querySelectorAll('.js-share-item').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      const action  = item.dataset.action;
      const jobUrl  = getJobUrl(job);
      const jobText = job.title + ' at ' + job.company;

      if (action === 'whatsapp') shareWhatsApp(job, jobUrl, jobText);
      if (action === 'copy')     copyJobLink(job, jobUrl, item);
      if (action === 'email')    shareEmail(job, jobUrl, jobText);
      if (action === 'linkedin') shareLinkedIn(job, jobUrl);
      if (action === 'twitter')  shareTwitter(job, jobUrl, jobText);

      if (action !== 'copy') {
        drop.classList.remove('open');
        shareBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  drop.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      drop.classList.remove('open');
      shareBtn.setAttribute('aria-expanded', 'false');
      shareBtn.focus();
    }
  });

  return card;
}

function closeAllShareDropdowns() {
  document.querySelectorAll('.js-share-dropdown.open').forEach(d => {
    d.classList.remove('open');
    const btn = document.querySelector(`[aria-controls="${d.id}"]`);
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

document.addEventListener('click', () => closeAllShareDropdowns());

function renderListText(str) {
  if (!str) return '';
  return str.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const text = line.replace(/^[•\-\*]\s*/, '');
      return `<div class="jd-list-item">
        <span class="jd-list-bullet">✦</span>
        <span>${escHtml(text)}</span>
      </div>`;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('jd-close');
  const backdrop = document.getElementById('jd-backdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeJobModal);
  if (backdrop) backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeJobModal();
  });
  document.addEventListener('keydown', e => {
    const b = document.getElementById('jd-backdrop');
    if (e.key === 'Escape' && b && b.classList.contains('jd-open')) closeJobModal();
  });
});

/* ============================================================
   JOB DETAIL MODAL
   ============================================================ */
function openJobModal(job) {
  // ── GA: track job view ──
  trackJobView(job.title || 'Unknown Job');

  const backdrop = document.getElementById('jd-backdrop');
  if (!backdrop) return;

  const initials = job.company.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  document.getElementById('jd-logo-wrap').innerHTML = job.logo
    ? `<img class="js-logo" src="${escHtml(job.logo)}" alt="${escHtml(job.company)} logo" loading="lazy">`
    : `<div class="js-logo-fallback" aria-hidden="true">${initials}</div>`;
  document.getElementById('jd-title').textContent   = job.title;
  document.getElementById('jd-company').textContent = job.company + (job.industry ? ' · ' + job.industry : '');

  const typeClass = { 'Remote':'remote','Part-Time':'part','Internship':'intern','Contract':'contract' }[job.type] || '';
  let chips = '';
  if (job.type)     chips += `<span class="jd-chip jd-chip-type ${typeClass}">💼 ${escHtml(job.type)}</span>`;
  if (job.deadline) chips += `<span class="jd-chip jd-chip-deadline">⏰ Deadline: ${escHtml(job.deadline)}</span>`;
  if (job.salary)   chips += `<span class="jd-chip jd-chip-salary">💰 ${escHtml(job.salary)}</span>`;
  document.getElementById('jd-chips-row').innerHTML = chips;

  const companyItems = [
    { label: 'Company',  value: job.company  },
    { label: 'Industry', value: job.industry },
    { label: 'Email',    value: job.email, link: job.email ? 'mailto:' + job.email : null },
    { label: 'Website',  value: job.website, link: job.website },
  ].filter(i => i.value);

  document.getElementById('jd-company-grid').innerHTML = companyItems.map(i => `
    <div class="jd-detail-item">
      <div class="jd-detail-label">${escHtml(i.label)}</div>
      <div class="jd-detail-value">${i.link
        ? `<a href="${escHtml(i.link)}" target="_blank" rel="noopener noreferrer">${escHtml(i.value)}</a>`
        : escHtml(i.value)
      }</div>
    </div>
  `).join('');

  const jobItems = [
    { label: 'Job Title',  value: job.title      },
    { label: 'Location',   value: job.location   },
    { label: 'Job Type',   value: job.type       },
    { label: 'Experience', value: job.experience },
    { label: 'Salary',     value: job.salary     },
    { label: 'Deadline',   value: job.deadline   },
  ].filter(i => i.value);

  document.getElementById('jd-details-grid').innerHTML = jobItems.map(i => `
    <div class="jd-detail-item">
      <div class="jd-detail-label">${escHtml(i.label)}</div>
      <div class="jd-detail-value">${escHtml(i.value)}</div>
    </div>
  `).join('');

  document.getElementById('jd-description').textContent = job.description || '';
  document.getElementById('jd-sec-desc').style.display = job.description ? '' : 'none';
  document.getElementById('jd-requirements').innerHTML = renderListText(job.requirements);
  document.getElementById('jd-sec-req').style.display = job.requirements ? '' : 'none';
  document.getElementById('jd-perks').innerHTML = renderListText(job.perks);
  document.getElementById('jd-sec-perks').style.display = job.perks ? '' : 'none';
  document.getElementById('jd-apply-info').textContent = job.applyInfo || '';
  document.getElementById('jd-sec-apply').style.display = (job.applyInfo || job.applyLink) ? '' : 'none';

  const applyActionsEl = document.getElementById('jd-apply-actions');
  applyActionsEl.innerHTML = '';

  const applyBtnEl = document.createElement('button');
  applyBtnEl.className = 'jd-apply-btn jd-apply-btn-primary';
  applyBtnEl.textContent = 'Apply Now →';
  applyBtnEl.addEventListener('click', () => applyNowEmail(job.id));
  applyActionsEl.appendChild(applyBtnEl);

  const backBtn = document.createElement('button');
  backBtn.className = 'jd-apply-btn jd-apply-btn-ghost';
  backBtn.textContent = '← Back to Jobs';
  backBtn.addEventListener('click', closeJobModal);
  applyActionsEl.appendChild(backBtn);

  backdrop.style.display = 'flex';

  document.body.dataset.scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + window.scrollY + 'px';
  document.body.style.width = '100%';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdrop.classList.add('jd-open');
      const closeBtn = document.getElementById('jd-close');
      if (closeBtn) closeBtn.focus();
    });
  });

  const modalBody = document.getElementById('jd-modal-body');
  if (modalBody) modalBody.scrollTop = 0;
}

let _jdCloseTimer = null;
function closeJobModal() {
  const backdrop = document.getElementById('jd-backdrop');
  if (!backdrop || !backdrop.classList.contains('jd-open')) return;

  backdrop.classList.remove('jd-open');

  const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);

  clearTimeout(_jdCloseTimer);
  _jdCloseTimer = setTimeout(() => { backdrop.style.display = 'none'; }, 320);
  backdrop.addEventListener('transitionend', function handler() {
    clearTimeout(_jdCloseTimer);
    backdrop.style.display = 'none';
    backdrop.removeEventListener('transitionend', handler);
  }, { once: true });
}

/* ============================================================
   JOB DETAILS — FULL PAGE VIEW
   ============================================================ */
let _selectedJobId = null;

function openJobPage(job) {
  // ── GA: track job view ──
  trackJobView(job.title || 'Unknown Job');

  _selectedJobId = job.id;
  const initials = job.company.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  document.getElementById('jd-page-logo').innerHTML = job.logo
    ? '<img class="js-logo" src="'+escHtml(job.logo)+'" alt="'+escHtml(job.company)+' logo" loading="lazy">'
    : '<div class="js-logo-fallback" aria-hidden="true">'+initials+'</div>';
  document.getElementById('jd-page-title').textContent   = job.title;
  document.getElementById('jd-page-company').textContent = job.company+(job.industry?' · '+job.industry:'');
  const typeClass={'Remote':'remote','Part-Time':'part','Internship':'intern','Contract':'contract'}[job.type]||'';
  let chips='';
  if(job.type)     chips+='<span class="jd-chip jd-chip-type '+typeClass+'">'+escHtml(job.type)+'</span>';
  if(job.deadline) chips+='<span class="jd-chip jd-chip-deadline">Deadline: '+escHtml(job.deadline)+'</span>';
  if(job.salary)   chips+='<span class="jd-chip jd-chip-salary">'+escHtml(job.salary)+'</span>';
  document.getElementById('jd-page-chips').innerHTML=chips;
  const ci=[
    {label:'Company',value:job.company},
    {label:'Industry',value:job.industry},
    {label:'Email',value:job.email,link:job.email?'mailto:'+job.email:null},
    {label:'Website',value:job.website,link:job.website},
  ].filter(i=>i.value);
  document.getElementById('jd-page-company-grid').innerHTML=ci.map(i=>'<div class="jd-detail-item"><div class="jd-detail-label">'+escHtml(i.label)+'</div><div class="jd-detail-value">'+(i.link?'<a href="'+escHtml(i.link)+'" target="_blank" rel="noopener noreferrer">'+escHtml(i.value)+'</a>':escHtml(i.value))+'</div></div>').join('');
  document.getElementById('jd-page-sec-company').style.display=ci.length?'':'none';
  const ji=[
    {label:'Job Title',value:job.title},{label:'Location',value:job.location},
    {label:'Job Type',value:job.type},{label:'Experience',value:job.experience},
    {label:'Salary',value:job.salary},{label:'Deadline',value:job.deadline},
  ].filter(i=>i.value);
  document.getElementById('jd-page-details-grid').innerHTML=ji.map(i=>'<div class="jd-detail-item"><div class="jd-detail-label">'+escHtml(i.label)+'</div><div class="jd-detail-value">'+escHtml(i.value)+'</div></div>').join('');
  document.getElementById('jd-page-sec-details').style.display=ji.length?'':'none';
  document.getElementById('jd-page-description').textContent=job.description||'';
  document.getElementById('jd-page-sec-desc').style.display=job.description?'':'none';
  document.getElementById('jd-page-requirements').innerHTML=renderListText(job.requirements);
  document.getElementById('jd-page-sec-req').style.display=job.requirements?'':'none';
  document.getElementById('jd-page-perks').innerHTML=renderListText(job.perks);
  document.getElementById('jd-page-sec-perks').style.display=job.perks?'':'none';
  document.getElementById('jd-page-apply-info').textContent=job.applyInfo||'';
  document.getElementById('jd-page-sec-apply').style.display=(job.applyInfo||job.applyLink)?'':'none';

  const ae=document.getElementById('jd-page-actions');
  ae.innerHTML='';

  const applyBtn=document.createElement('button');
  applyBtn.className='jd-apply-btn jd-apply-btn-primary';
  applyBtn.textContent='Apply Now →';
  applyBtn.addEventListener('click',()=>applyNowEmail(job.id));
  ae.appendChild(applyBtn);

  const sb=document.createElement('button');
  sb.className='jd-apply-btn jd-apply-btn-ghost';
  sb.textContent='Share Job';
  sb.addEventListener('click',()=>shareWhatsApp(job, window.location.origin + window.location.pathname + '?job=' + job.id, job.title+' at '+job.company));
  ae.appendChild(sb);

  showView('job-details');
}

function closeJobPage(){ showView('job-search'); }
document.addEventListener('DOMContentLoaded',()=>{
  const b=document.getElementById('jd-back-btn');
  if(b) b.addEventListener('click',closeJobPage);
});

/* ============================================================
   SHARE FUNCTIONS
   ============================================================ */
function shareWhatsApp(job, jobUrl, jobText) {
  const msg = encodeURIComponent(
    '🎯 *Job Opportunity*\n\n' +
    '*' + jobText + '*\n' +
    '📍 ' + job.location + '  |  ' + job.type + '\n\n' +
    job.description.slice(0, 200) + (job.description.length > 200 ? '…' : '') + '\n\n' +
    '👉 ' + jobUrl
  );
  window.open('https://wa.me/?text=' + msg, '_blank', 'noopener,noreferrer');
}

function copyJobLink(job, jobUrl, itemEl) {
  const label = itemEl?.querySelector('.js-share-item-label');

  const doFeedback = () => {
    if (label) {
      const orig = label.textContent;
      label.textContent = 'Copied! ✓';
      itemEl.classList.add('copied');
      setTimeout(() => {
        label.textContent = orig;
        itemEl.classList.remove('copied');
        const drop = itemEl.closest('.js-share-dropdown');
        const btn  = drop ? document.querySelector(`[aria-controls="${drop.id}"]`) : null;
        if (drop) drop.classList.remove('open');
        if (btn)  btn.setAttribute('aria-expanded', 'false');
      }, 1500);
    }
    toast('Link copied ✓', 'success', 3000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(jobUrl).then(doFeedback).catch(() => legacyCopy(jobUrl, doFeedback));
  } else {
    legacyCopy(jobUrl, doFeedback);
  }
}

function legacyCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
  if (cb) cb();
}

function shareEmail(job, jobUrl, jobText) {
  const subject = encodeURIComponent('Job Opportunity: ' + jobText);
  const body    = encodeURIComponent(
    'Hi,\n\nI thought you might be interested in this job:\n\n' +
    job.title + ' at ' + job.company + '\n' +
    '📍 ' + job.location + '  |  ' + job.type + '\n\n' +
    job.description + '\n\nApply here: ' + jobUrl
  );
  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}

function shareLinkedIn(job, jobUrl) {
  const url = encodeURIComponent(jobUrl);
  window.open(
    'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
    '_blank', 'noopener,noreferrer,width=600,height=500'
  );
}

function shareTwitter(job, jobUrl, jobText) {
  const text = encodeURIComponent('🎯 ' + jobText + ' — check out this job!');
  const url  = encodeURIComponent(jobUrl);
  window.open(
    'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
    '_blank', 'noopener,noreferrer,width=600,height=400'
  );
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   SCROLL REVEALS
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function setupScrollReveals() {
  document.querySelectorAll('.bento-card, .how-step, .template-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* ============================================================
   COVER LETTER GENERATOR
   ============================================================ */
const CL_STORAGE_KEY = 'folio_cover_letter';
let clTheme = 'clt-classic';
let clAutoSaveTimer = null;
let clMobileShowPreview = false;

const CL_TONES = {
  professional: { opener:'I am writing to express my interest in', fit:'With a proven track record in', energy:'measured and results-focused' },
  confident:    { opener:'I am excited to apply for', fit:'I bring a strong background in', energy:'assertive and achievement-driven' },
  warm:         { opener:'It is with great enthusiasm that I apply for', fit:'Throughout my career, I have developed a passion for', energy:'personable and relationship-focused' },
  concise:      { opener:'I am applying for', fit:'My key qualifications include', energy:'direct and impact-focused' },
  creative:     { opener:'Storytelling, strategy, and results — these are the things I live for. I am applying for', fit:'My unique blend of skills in', energy:'imaginative and bold' },
  formal:       { opener:'I respectfully wish to apply for the position of', fit:'My professional background encompasses', energy:'formal and thorough' },
};

const CL_PLACEHOLDERS = {
  opening:     'I am writing to express my strong interest in this position at your organisation.',
  skills:      'With over [X] years of experience in [field], I have developed expertise in [skill 1], [skill 2], and [skill 3].',
  achievement: 'In my most recent position at [Company], I led a project that resulted in [outcome].',
  company:     'I am particularly drawn to [Company] because of [specific reason].',
  closing:     'Thank you sincerely for your time and consideration. I would welcome the opportunity to discuss how my background can contribute to your team.',
};

function generateParagraph(type, data) {
  const tone = CL_TONES[data.tone] || CL_TONES.professional;
  const jobTitle  = data.jobTitle  || 'this position';
  const company   = data.company   || 'your organisation';
  const myTitle   = data.myTitle   || 'professional';
  const source    = data.jobSource ? `which I discovered through ${data.jobSource}` : 'advertised on GamHubJobs.com';
  const topSkills = data.skills?.slice(0,3).map(s=>s.name).join(', ') || 'communication, organisation, and leadership';
  const topExp    = data.experience?.[0] || null;
  const topAch    = data.achievements?.[0] || null;
  const summary   = data.summary || '';

  switch(type) {
    case 'opening':
      return `${tone.opener} the role of ${jobTitle} at ${company}, ${source}. As an experienced ${myTitle}, I am confident that my skills and background make me a strong candidate for this opportunity. ${summary ? summary.split('.')[0] + '.' : `I am ${tone.energy} and eager to bring genuine value to your team.`}`;
    case 'skills':
      return `${tone.fit} ${topSkills}. ${topExp ? `In my role as ${topExp.title} at ${topExp.org}, I was responsible for ${topExp.desc?.split('.')[0]?.toLowerCase() || 'delivering key outcomes and building strong stakeholder relationships'}.` : 'My professional journey has given me a hands-on understanding of what drives results in fast-paced environments.'} I am adept at working both independently and within teams, and I consistently prioritise quality, accuracy, and timely delivery.`;
    case 'achievement':
      if (topAch) {
        return `One achievement I am particularly proud of is ${topAch.title?.toLowerCase()}. ${topAch.desc ? topAch.desc.split('.')[0] + '.' : ''} This experience reinforced my ability to take initiative, manage complexity, and deliver outcomes that matter — skills I am eager to apply at ${company}.`;
      }
      return `Throughout my career, I have consistently delivered results that exceed expectations. I am recognised for my ability to identify opportunities, mobilise resources, and execute with precision — an approach I will bring with me to ${company}.`;
    case 'company':
      return `I am especially drawn to ${company} because of the meaningful impact your work has in The Gambia and the wider region. I admire your commitment to excellence and believe that joining your team would allow me to grow while contributing to goals I genuinely care about.`;
    case 'closing':
      return `Thank you sincerely for taking the time to consider my application. I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to ${company}'s continued success. I am available for an interview at your earliest convenience and can be reached at ${data.email || 'the contact details above'}. I look forward to the possibility of joining your team.`;
    default: return '';
  }
}

function initCoverLetter() {
  loadCoverLetterData();
  setDefaultDate();
  updateImportBadge();
  renderCoverLetter();

  const toggleBtn = document.getElementById('cl-toggle-btn');
  const isMobile  = window.innerWidth <= 1000;
  if (toggleBtn) {
    toggleBtn.style.display = isMobile ? '' : 'none';
    toggleBtn.textContent   = 'Preview Letter 👁';
  }
  window.addEventListener('resize', () => {
    const tb = document.getElementById('cl-toggle-btn');
    if (tb) tb.style.display = window.innerWidth <= 1000 ? '' : 'none';
  }, { passive: true });

  if (clAutoSaveTimer) clearInterval(clAutoSaveTimer);
  clAutoSaveTimer = setInterval(saveCoverLetterData, 8000);
}

function setDefaultDate() {
  const el = document.getElementById('cl-date');
  if (el && !el.value) {
    el.value = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  }
}

function updateImportBadge() {
  const cvData = loadData('cvData');
  const el     = document.getElementById('cl-cv-name');
  if (cvData?.fullname) {
    el.textContent = cvData.fullname;
    el.style.color = 'var(--gold)';
  } else {
    el.textContent = 'No CV found — build one first';
  }
}

function importFromCV() {
  const cv = loadData('cvData');
  if (!cv) { toast('No CV found. Build your CV first.', 'error'); return; }

  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  set('cl-fullname', cv.fullname);
  set('cl-title',    cv.title);
  set('cl-email',    cv.email);
  set('cl-phone',    cv.phone);
  set('cl-location', cv.location);

  renderCoverLetter();
  toast('CV details imported! ✦ Fill in the job details to personalise.', 'gold');
}

function selectTone(card) {
  document.querySelectorAll('.tone-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  renderCoverLetter();
}

function getSelectedTone() {
  return document.querySelector('.tone-card.selected')?.dataset?.tone || 'professional';
}

function collectCLData() {
  const cv = loadData('cvData') || {};
  return {
    fullname: document.getElementById('cl-fullname')?.value || '',
    myTitle:  document.getElementById('cl-title')?.value    || '',
    email:    document.getElementById('cl-email')?.value    || '',
    phone:    document.getElementById('cl-phone')?.value    || '',
    location: document.getElementById('cl-location')?.value || '',
    jobTitle:    document.getElementById('cl-job-title')?.value      || '',
    company:     document.getElementById('cl-company')?.value        || '',
    hiringMgr:   document.getElementById('cl-hiring-manager')?.value || '',
    companyAddr: document.getElementById('cl-company-address')?.value|| '',
    jobSource:   document.getElementById('cl-job-source')?.value     || '',
    tone:         getSelectedTone(),
    paraOpening:  document.getElementById('cl-para-opening')?.value     || '',
    paraSkills:   document.getElementById('cl-para-skills')?.value      || '',
    paraAchieve:  document.getElementById('cl-para-achievement')?.value || '',
    paraCompany:  document.getElementById('cl-para-company')?.value     || '',
    paraClosing:  document.getElementById('cl-para-closing')?.value     || '',
    closingPhrase:document.getElementById('cl-closing-phrase')?.value   || 'Yours sincerely,',
    date:         document.getElementById('cl-date')?.value             || '',
    skills:       cv.skills       || [],
    experience:   cv.experience   || [],
    achievements: cv.achievements || [],
    summary:      cv.summary      || '',
    theme:        clTheme,
  };
}

function renderCoverLetter() {
  const d = collectCLData();
  const paper = document.getElementById('cl-paper');
  if (!paper) return;

  const contacts = [
    d.email    && `<span>✉ ${h(d.email)}</span>`,
    d.phone    && `<span>📱 ${h(d.phone)}</span>`,
    d.location && `<span>📍 ${h(d.location)}</span>`,
  ].filter(Boolean).join('');

  const subject = d.jobTitle && d.company
    ? `Re: Application for ${h(d.jobTitle)} — ${h(d.company)}`
    : (d.jobTitle ? `Re: Application for ${h(d.jobTitle)}` : 'Cover Letter');

  const salutation = d.hiringMgr
    ? `Dear ${h(d.hiringMgr)},`
    : 'Dear Hiring Manager,';

  const paras = [
    d.paraOpening  || CL_PLACEHOLDERS.opening,
    d.paraSkills   || CL_PLACEHOLDERS.skills,
    d.paraAchieve  || CL_PLACEHOLDERS.achievement,
    d.paraCompany  || CL_PLACEHOLDERS.company,
    d.paraClosing  || CL_PLACEHOLDERS.closing,
  ];

  const parasHTML = paras
    .filter(p => p.trim())
    .map(p => `<div class="cl-letter-para">${h(p)}</div>`)
    .join('');

  paper.className = `cl-paper ${clTheme}`;
  paper.innerHTML = `
    <div class="cl-letter-header">
      <div class="cl-letter-name">${h(d.fullname || 'Your Name')}</div>
      <div class="cl-letter-jobtitle">${h(d.myTitle || 'Professional Title')}</div>
      ${contacts ? `<div class="cl-letter-contacts">${contacts}</div>` : ''}
    </div>
    <div class="cl-letter-body">
      <div class="cl-letter-date">${h(d.date || new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}))}</div>
      ${(d.hiringMgr || d.company || d.companyAddr) ? `
      <div class="cl-letter-recipient">
        ${d.hiringMgr   ? `<div class="cl-letter-recipient-name">${h(d.hiringMgr)}</div>` : ''}
        ${d.company     ? `<div class="cl-letter-recipient-sub">${h(d.company)}</div>` : ''}
        ${d.companyAddr ? `<div class="cl-letter-recipient-sub">${h(d.companyAddr)}</div>` : ''}
      </div>` : ''}
      <div class="cl-letter-subject">${subject}</div>
      <div class="cl-letter-salutation">${salutation}</div>
      <div class="cl-letter-paragraphs">${parasHTML}</div>
      <div class="cl-letter-closing">
        <div class="cl-letter-closing-line">${h(d.closingPhrase || 'Yours sincerely,')}</div>
        <div class="cl-letter-sig">${h(d.fullname || 'Your Name')}</div>
        <div class="cl-letter-sig-sub">${h(d.myTitle || '')}</div>
      </div>
    </div>
  `;
}

async function aiWriteParagraph(type) {
  const idMap = {
    opening: 'cl-para-opening',
    skills: 'cl-para-skills',
    achievement: 'cl-para-achievement',
    company: 'cl-para-company',
    closing: 'cl-para-closing',
  };

  const btnId    = `ai-btn-${type}`;
  const btn      = document.getElementById(btnId);
  const textarea = document.getElementById(idMap[type]);
  if (!btn || !textarea) return;

  btn.classList.add('loading');
  btn.textContent = '⏳';
  textarea.value = '';
  textarea.placeholder = 'Writing…';
  textarea.style.background = 'rgba(212,168,83,0.04)';

  await new Promise(r => setTimeout(r, 700 + Math.random() * 400));

  const data = collectCLData();
  const generated = generateParagraph(type, data);

  textarea.value = '';
  textarea.style.background = '';
  textarea.placeholder = '';
  btn.classList.remove('loading');
  btn.innerHTML = '✦ AI Write';

  await typewriterFill(textarea, generated);
  renderCoverLetter();
  saveCoverLetterData();
  toast(`${type.charAt(0).toUpperCase() + type.slice(1)} paragraph written ✦`, 'gold', 2000);
}

async function aiWriteAll() {
  const btn = document.getElementById('ai-write-all-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Writing…';

  const data = collectCLData();
  const types = ['opening','skills','achievement','company','closing'];
  const idMap = {
    opening:'cl-para-opening', skills:'cl-para-skills',
    achievement:'cl-para-achievement', company:'cl-para-company', closing:'cl-para-closing',
  };

  for (const type of types) {
    const ta = document.getElementById(idMap[type]);
    if (!ta) continue;
    await new Promise(r => setTimeout(r, 200));
    const text = generateParagraph(type, data);
    await typewriterFill(ta, text, 8);
    renderCoverLetter();
  }

  btn.disabled = false;
  btn.innerHTML = '✦ AI Write Entire Letter';
  saveCoverLetterData();
  toast('Cover letter written! Review and personalise each paragraph. ✦', 'gold', 4000);
}

async function typewriterFill(textarea, text, speed = 12) {
  textarea.value = '';
  const chars = text.split('');
  for (let i = 0; i < chars.length; i++) {
    textarea.value += chars[i];
    if (i % 3 === 0) {
      textarea.scrollTop = textarea.scrollHeight;
      await new Promise(r => setTimeout(r, speed));
    }
  }
  textarea.value = text;
}

function setCLTheme(theme, btn) {
  clTheme = theme;
  document.querySelectorAll('.cl-tbtn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCoverLetter();
}

function toggleCLView() {
  clMobileShowPreview = !clMobileShowPreview;
  const layout    = document.getElementById('cl-layout');
  const toggleBtn = document.getElementById('cl-toggle-btn');
  layout.classList.toggle('show-preview', clMobileShowPreview);
  if (toggleBtn) {
    toggleBtn.textContent = clMobileShowPreview ? '✏ Edit Letter' : '👁 Preview Letter';
    toggleBtn.className   = clMobileShowPreview
      ? 'btn btn-outline btn-sm'
      : 'btn btn-ghost btn-sm';
  }
}

function saveCoverLetterData() {
  const dot   = document.getElementById('cl-autosave-dot');
  const label = document.getElementById('cl-autosave-label');
  const raw   = collectCLData();
  const data  = {
    fullname:     sanitizeText(raw.fullname,     100),
    myTitle:      sanitizeText(raw.myTitle,      100),
    email:        sanitizeEmail(raw.email)     || '',
    phone:        sanitizeText(raw.phone,         30),
    location:     sanitizeText(raw.location,     100),
    jobTitle:     sanitizeText(raw.jobTitle,     120),
    company:      sanitizeText(raw.company,      100),
    hiringMgr:    sanitizeText(raw.hiringMgr,    100),
    companyAddr:  sanitizeText(raw.companyAddr,  200),
    jobSource:    sanitizeText(raw.jobSource,    100),
    tone:         sanitizeText(raw.tone,          30),
    closingPhrase:sanitizeText(raw.closingPhrase, 60),
    date:         sanitizeText(raw.date,          40),
    paraOpening:  sanitizeText(raw.paraOpening, 2000),
    paraSkills:   sanitizeText(raw.paraSkills,  2000),
    paraAchieve:  sanitizeText(raw.paraAchieve, 2000),
    paraCompany:  sanitizeText(raw.paraCompany, 2000),
    paraClosing:  sanitizeText(raw.paraClosing, 2000),
  };
  try { localStorage.setItem(CL_STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  if (dot) { dot.classList.add('saved'); }
  if (label) label.textContent = 'Draft saved ✓';
  setTimeout(() => {
    if (dot) dot.classList.remove('saved');
    if (label) label.textContent = 'Auto saving…';
  }, 2500);
}

function loadCoverLetterData() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(CL_STORAGE_KEY)); } catch(e) {}
  if (!saved) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  set('cl-fullname',          saved.fullname);
  set('cl-title',             saved.myTitle);
  set('cl-email',             saved.email);
  set('cl-phone',             saved.phone);
  set('cl-location',          saved.location);
  set('cl-job-title',         saved.jobTitle);
  set('cl-company',           saved.company);
  set('cl-hiring-manager',    saved.hiringMgr);
  set('cl-company-address',   saved.companyAddr);
  set('cl-job-source',        saved.jobSource);
  set('cl-para-opening',      saved.paraOpening);
  set('cl-para-skills',       saved.paraSkills);
  set('cl-para-achievement',  saved.paraAchieve);
  set('cl-para-company',      saved.paraCompany);
  set('cl-para-closing',      saved.paraClosing);
  set('cl-closing-phrase',    saved.closingPhrase);
  set('cl-date',              saved.date);

  if (saved.tone) {
    document.querySelectorAll('.tone-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.tone === saved.tone);
    });
  }
  if (saved.theme) {
    clTheme = saved.theme;
    document.querySelectorAll('.cl-tbtn').forEach((b,i) => {
      const themes = ['clt-classic','clt-minimal','clt-warm','clt-bold','clt-sage','clt-navy-gold'];
      b.classList.toggle('active', themes[i] === saved.theme);
    });
  }
}

function printCoverLetter() {
  window.print();
}

/* ============================================================
   SUPABASE AUTH
   ============================================================ */
const supabaseClient = window.supabase.createClient(
  APP_CONFIG.SUPABASE_URL,
  APP_CONFIG.SUPABASE_ANON_KEY
);

let currentUser = null;
let pendingAuthAction = null;

function initAuth() {
  supabaseClient.auth.onAuthStateChange(function(event, session) {
    currentUser = session ? session.user : null;
    updateAuthUI();

    if (event === 'SIGNED_IN') {
      toast('Signed in as ' + (currentUser.email || 'user') + ' ✦', 'success', 4000);
      closeAuthModal();
      if (pendingAuthAction) {
        var action = pendingAuthAction;
        pendingAuthAction = null;
        setTimeout(action, 400);
      }
    }

    if (event === 'SIGNED_OUT') {
      toast('Signed out successfully', 'default');
    }
  });

  supabaseClient.auth.getSession().then(function(result) {
    var session = result.data.session;
    if (session) {
      currentUser = session.user;
      updateAuthUI();
    } else {
      updateAuthUI();
    }
  });
}

function updateAuthUI() {
  var pill         = document.getElementById('nav-user-pill');
  var loginBtn     = document.getElementById('nav-login-btn');
  var avatar       = document.getElementById('nav-user-avatar');
  var emailEl      = document.getElementById('nav-user-email');
  var drawerRow    = document.getElementById('drawer-auth-row');
  var drawerEmail  = document.getElementById('drawer-auth-email');
  var drawerLogin  = document.getElementById('drawer-login-btn');
  var drawerDl     = document.getElementById('drawer-download-btn');

  if (currentUser) {
    if (pill)     { pill.style.display = 'flex'; }
    if (loginBtn) { loginBtn.style.display = 'none'; }
    if (emailEl)  { emailEl.textContent = currentUser.email || 'Signed in'; }
    if (avatar)   { avatar.textContent  = (currentUser.email || 'U')[0].toUpperCase(); }
    if (drawerRow)   { drawerRow.style.display = 'flex'; }
    if (drawerEmail) { drawerEmail.textContent = currentUser.email || 'Signed in'; }
    if (drawerLogin) { drawerLogin.style.display = 'none'; }
    if (drawerDl)    { drawerDl.style.display = ''; }
  } else {
    if (pill)     { pill.style.display = 'none'; }
    if (loginBtn) { loginBtn.style.display = ''; }
    if (drawerRow)   { drawerRow.style.display = 'none'; }
    if (drawerLogin) { drawerLogin.style.display = ''; }
    if (drawerDl)    { drawerDl.style.display = 'none'; }
  }
}

function showAuthModal(afterLoginAction) {
  if (typeof afterLoginAction === 'function') {
    pendingAuthAction = afterLoginAction;
  }

  var overlay   = document.getElementById('auth-overlay');
  var stepEmail = document.getElementById('auth-step-email');
  var stepSent  = document.getElementById('auth-step-sent');
  var input     = document.getElementById('auth-email-input');
  var errEl     = document.getElementById('auth-error-msg');

  if (stepEmail) stepEmail.style.display = '';
  if (stepSent)  stepSent.style.display  = 'none';
  if (errEl)     { errEl.style.display = 'none'; errEl.textContent = ''; }
  if (input)     { input.value = ''; }

  if (overlay) overlay.style.display = 'flex';
  setTimeout(function() { if (input) input.focus(); }, 100);
}

function closeAuthModal() {
  var overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.style.display = 'none';
}

function handleAuthOverlayClick(event) {
  if (event.target === document.getElementById('auth-overlay')) {
    closeAuthModal();
  }
}

async function sendMagicLink() {
  if (!rateLimiter.check('auth')) {
    const wait = rateLimiter.waitSeconds('auth');
    const errEl = document.getElementById('auth-error-msg');
    if (errEl) { errEl.textContent = 'Too many attempts — wait ' + wait + ' seconds before trying again.'; errEl.style.display = 'block'; }
    return;
  }
  var input   = document.getElementById('auth-email-input');
  var sendBtn = document.getElementById('auth-send-btn');
  var label   = document.getElementById('auth-send-label');
  var errEl   = document.getElementById('auth-error-msg');
  var email   = (input ? input.value : '').trim();

  if (!email || !email.includes('@') || !email.includes('.')) {
    if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; }
    if (input) input.focus();
    return;
  }

  if (errEl) errEl.style.display = 'none';
  if (sendBtn) sendBtn.disabled = true;
  if (label)   label.textContent = '⏳ Sending…';

  try {
    var redirectTo = window.location.href.split('?')[0].split('#')[0];

    var result = await supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      }
    });

    if (result.error) throw new Error(result.error.message);

    var stepEmail = document.getElementById('auth-step-email');
    var stepSent  = document.getElementById('auth-step-sent');
    var sentEmail = document.getElementById('auth-sent-email');
    if (stepEmail) stepEmail.style.display = 'none';
    if (stepSent)  stepSent.style.display  = 'block';
    if (sentEmail) sentEmail.textContent   = email;

  } catch(err) {
    var msg = err.message || 'Something went wrong. Please try again.';
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    if (sendBtn) sendBtn.disabled = false;
    if (label)   label.textContent = '✉ Send Magic Link';
  }
}

async function authSignOut() {
  await supabaseClient.auth.signOut();
  currentUser = null;
  updateAuthUI();
}

function requireAuth(action) {
  if (currentUser) {
    action();
  } else {
    showAuthModal(action);
  }
}

/* ============================================================
   COOKIE CONSENT
   ============================================================ */
const COOKIE_CONSENT_KEY = 'folio_cookie_consent';

function initCookieBanner() {
  const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!accepted) {
    setTimeout(() => {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.style.display = 'flex';
      document.body.classList.add('cookie-visible');
    }, 1200);
  }
}

function acceptCookies() {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted-' + Date.now());
  document.body.classList.remove('cookie-visible');
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    banner.style.transform  = 'translateY(100%)';
    banner.style.opacity    = '0';
    setTimeout(() => { banner.style.display = 'none'; }, 400);
  }
}

/* ============================================================
   WHATSAPP CHANNEL OVERLAY
   ============================================================ */
const WAC_SESSION_KEY = 'gamhubjobs_wac_shown';
const WAC_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb7G5Zp8vd1XBVtBlt13';
let _wacTimer = null;

function initWACOverlay() {
  if (sessionStorage.getItem(WAC_SESSION_KEY)) return;
  _wacTimer = setTimeout(function() {
    var overlay = document.getElementById('wa-channel-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { overlay.classList.add('visible'); });
    });
  }, 60000);
}

function wacJoin() {
  wacDismiss();
  window.open(WAC_CHANNEL_URL, '_blank', 'noopener,noreferrer');
}

function wacDismiss() {
  sessionStorage.setItem(WAC_SESSION_KEY, '1');
  if (_wacTimer) { clearTimeout(_wacTimer); _wacTimer = null; }
  var overlay = document.getElementById('wa-channel-overlay');
  if (!overlay) return;
  overlay.classList.remove('visible');
  setTimeout(function() { overlay.style.display = 'none'; }, 600);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') wacDismiss();
});

/* ============================================================
   Q&A TEXT GENERATOR — zero API cost, template-based
   ============================================================ */
let _qaDescTarget    = null;
let _qaAchTarget     = null;

const QA_TONES = {
  confident: ['accomplished', 'results-driven', 'confident'],
  warm:      ['collaborative', 'people-focused', 'approachable'],
  precise:   ['detail-oriented', 'methodical', 'analytical'],
  dynamic:   ['dynamic', 'high-impact', 'proactive'],
  seasoned:  ['experienced', 'trusted', 'dependable'],
};

function qaAddBlock(listId, placeholder) {
  const list = document.getElementById(listId);
  if (!list) return;
  const div = document.createElement('div');
  div.className = 'dynamic-item skill-entry';
  div.innerHTML = `
    <div class="skill-row">
      <input type="text" class="form-control skill-name-input"
        placeholder="${h(placeholder)}">
      <button class="btn-remove"
        onclick="this.closest('.skill-entry').remove()">✕</button>
    </div>
  `;
  list.appendChild(div);
}

function qaGetBlocks(listId) {
  return Array.from(
    document.querySelectorAll(`#${listId} .skill-name-input`)
  ).map(i => i.value.trim()).filter(Boolean);
}

function qaVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function qaGoTo(step) {
  [1, 2, 3, 4].forEach(n => {
    const el = document.getElementById('qa-step' + n);
    if (el) el.style.display = n === step ? '' : 'none';
  });

  const progressWrap = document.getElementById('qa-progress-wrap');
  if (progressWrap) {
    progressWrap.style.display = (step === 3 || step === 4) ? 'none' : '';
  }

  ['qa-d1', 'qa-d2', 'qa-d3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.background = (i + 1) <= step
      ? 'var(--gold)'
      : 'rgba(255,255,255,0.1)';
  });

  const labels = [
    'Step 1 of 3 — About you',
    'Step 2 of 3 — Your strengths',
    'Step 3 of 3 — Your recent role',
    'Your achievement',
  ];
  const labelEl = document.getElementById('qa-step-label');
  if (labelEl) labelEl.textContent = labels[step - 1] || '';
}

function openSummaryHelper() {
  document.getElementById('qa-skills-list').innerHTML = '';
  qaAddBlock('qa-skills-list', 'e.g. Project Management');

  document.getElementById('qa-orgs-list').innerHTML = '';
  qaAddBlock('qa-orgs-list', 'e.g. International NGOs');

  qaGoTo(1);
  document.getElementById('qa-overlay').style.display = 'flex';
}

function openDescHelper(btn) {
  _qaDescTarget = btn.closest('.exp-entry').querySelector('.exp-desc');

  document.getElementById('qa-resp-list').innerHTML = '';
  qaAddBlock('qa-resp-list', 'e.g. Managing the company social media accounts');

  qaGoTo(3);
  document.getElementById('qa-overlay').style.display = 'flex';
}

function openAchHelper(btn) {
  _qaAchTarget = btn.closest('.ach-entry').querySelector('.ach-desc');

  document.getElementById('qa-ach-actions-list').innerHTML = '';
  qaAddBlock('qa-ach-actions-list', 'e.g. Designed and executed the content strategy');

  qaGoTo(4);
  document.getElementById('qa-overlay').style.display = 'flex';
}

function closeQAModal() {
  document.getElementById('qa-overlay').style.display = 'none';
}

async function qaTypewriter(textarea, text) {
  textarea.value = '';
  for (let i = 0; i < text.length; i++) {
    textarea.value += text[i];
    if (i % 4 === 0) await new Promise(r => setTimeout(r, 14));
  }
  textarea.value = text;
}

function qaBuildSummary() {
  const title    = qaVal('qa-title')    || 'professional';
  const years    = qaVal('qa-years')    || 'several years';
  const industry = qaVal('qa-industry') || 'my field';
  const skills   = qaGetBlocks('qa-skills-list');
  const orgs     = qaGetBlocks('qa-orgs-list');
  const strength = qaVal('qa-strength') || 'commitment to excellence';
  const tone     = qaVal('qa-tone');
  const achieve  = qaVal('qa-achieve');
  const adj      = QA_TONES[tone] || QA_TONES.confident;

  const skillStr = skills.length >= 2
    ? skills.slice(0, 2).join(' and ')
    : (skills[0] || 'strong interpersonal skills');

  const orgStr = orgs.length >= 2
    ? orgs.slice(0, 2).join(' and ')
    : (orgs[0] || 'a range of organisations');

  const achieveSentence = achieve
    ? ` Most recently, ${achieve.toLowerCase().replace(/\.$/, '')}.`
    : '';

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  const openers = [
    `A ${adj[0]} ${title} with ${years} of experience in the ${industry} sector.`,
    `An ${adj[1]} ${title} bringing ${years} of hands-on experience across ${industry}.`,
    `${cap(years)} ${industry} professional with a strong background as a ${title}.`,
  ];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  return `${opener} Specialising in ${skillStr}, with a proven track record of delivering results at ${orgStr}.${achieveSentence} Recognised for ${strength.toLowerCase().replace(/\.$/, '')} and a commitment to continuous professional growth.`;
}

function qaBuildDesc() {
  const roleTitle = qaVal('qa-roletitle') || 'this position';
  const respItems = qaGetBlocks('qa-resp-list');
  const impact    = qaVal('qa-impact').toLowerCase().replace(/\.$/, '')
                    || 'contributing to measurable improvements';

  const resp = respItems.length
    ? respItems.join(', ').toLowerCase().replace(/\.$/, '')
    : 'supporting key operational functions';

  return `As ${roleTitle}, I was responsible for ${resp}. I worked closely with cross-functional teams to ensure timely and high-quality delivery of all assigned tasks, maintaining clear communication with stakeholders throughout. A key achievement in this role was to ${impact}, demonstrating my ability to take initiative and deliver results under pressure.`;
}

function qaBuildAchievement() {
  const title   = qaVal('qa-ach-title')  || 'this project';
  const goal    = qaVal('qa-ach-goal').toLowerCase().replace(/\.$/, '')
                  || 'address a key challenge';
  const actions = qaGetBlocks('qa-ach-actions-list');
  const result  = qaVal('qa-ach-result').toLowerCase().replace(/\.$/, '')
                  || 'delivering a measurable improvement';
  const proof   = qaVal('qa-ach-proof').toLowerCase().replace(/\.$/, '')
                  || 'the ability to deliver under pressure';

  const actionStr = actions.length
    ? actions.join(', ').toLowerCase().replace(/\.$/, '')
    : 'leading the initiative from planning through to delivery';

  return `${title} was initiated to ${goal}. In this project, I was responsible for ${actionStr}, coordinating with key stakeholders to ensure alignment at every stage. As a direct result of this work, I was able to ${result}, creating tangible value for the organisation. This achievement reflects my ${proof}.`;
}

async function qaGenerate() {
  const text = qaBuildSummary();
  closeQAModal();
  const ta = document.getElementById('b-summary');
  if (!ta) return;
  await qaTypewriter(ta, text);
  autoSave();
  toast('Summary generated ✦ Edit it to make it your own.', 'gold', 4000);
}

async function qaGenDesc() {
  const text = qaBuildDesc();
  closeQAModal();
  if (!_qaDescTarget) return;
  await qaTypewriter(_qaDescTarget, text);
  autoSave();
  toast('Description generated ✦ Personalise the details.', 'gold', 4000);
}

async function qaGenAchievement() {
  const text = qaBuildAchievement();
  closeQAModal();
  if (!_qaAchTarget) return;
  await qaTypewriter(_qaAchTarget, text);
  autoSave();
  toast('Achievement description generated ✦ Personalise the details.', 'gold', 4000);
}

/* ============================================================
   GOOGLE ANALYTICS TRACKING
   ============================================================ */

/**
 * Track when a job detail page or modal is opened.
 * Called inside openJobPage() and openJobModal().
 */
function trackJobView(jobTitle) {
  if (typeof gtag === 'function') {
    gtag('event', 'job_view', {
      job_title: jobTitle,
    });
  }
}

/**
 * Track when the Apply Now button is clicked.
 * Called inside applyNowEmail() before the mailto redirect.
 */
function trackApply(jobTitle) {
  if (typeof gtag === 'function') {
    gtag('event', 'apply_click', {
      job_title: jobTitle,
    });
  }
}

/**
 * Track when a CV PDF download is initiated (free or paid).
 * Called inside downloadPDF() after the free-download check,
 * and inside finaliseDownload() after payment confirmation.
 */
function trackCVDownload() {
  if (typeof gtag === 'function') {
    gtag('event', 'cv_download');
  }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initCookieBanner();
  initWACOverlay();
  initWizard();
  setupScrollReveals();

  /* ── fire landing tour on first load ── */
  if (typeof GHJTour !== 'undefined') GHJTour.triggerView('landing');

  /* ── Deep link handler ─────────────────────────────────────────
     Handles two URL formats:
       1. ?job=frontend-developer-gamtech   (shared via WhatsApp / social)
       2. /job/frontend-developer-gamtech   (direct path, legacy)
     Both open the matching job detail page immediately instead of
     showing the landing page.
  ─────────────────────────────────────────────────────────────── */
  const _urlParams    = new URLSearchParams(window.location.search);
  const _sharedJobId  = _urlParams.get('job');
  const _pathMatch    = window.location.pathname.match(/^\/job\/(.+)/);
  const _pathJobId    = _pathMatch ? _pathMatch[1].replace(/\/$/, '') : null;
  const _deepLinkId   = _sharedJobId || _pathJobId;

  if (_deepLinkId) {
    const _linkedJob = JOB_LISTINGS.find(j => j.id === _deepLinkId);
    if (_linkedJob) {
      showView('job-search');
      setTimeout(() => openJobPage(_linkedJob), 200);
    } else {
      showView('job-search');
      toast('Job not found — showing all available jobs.', 'default', 4000);
    }
    window.history.replaceState({}, '', window.location.pathname);
  }

  const savedTheme = loadData('theme');
  if (savedTheme) currentTheme = savedTheme;

  const wiz = loadData('wizard');
  if (wiz) {
    if (wiz.palette) {
      const p = PALETTES.find(x => x.id === wiz.palette);
      if (p) {
        document.documentElement.style.setProperty('--dw-primary', p.primary);
        document.documentElement.style.setProperty('--dw-accent', p.accent);
      }
    }
    if (wiz.font) {
      const f = FONTS.find(x => x.id === wiz.font);
      if (f) {
        document.documentElement.style.setProperty('--dw-font-display', f.display);
        document.documentElement.style.setProperty('--dw-font-body', f.body);
      }
    }
  }

  console.log('%c✦ GamHub Jobs — Gambia\'s Professional Job Platform', 'color:#d4a853;font-size:14px;font-weight:bold');
});
