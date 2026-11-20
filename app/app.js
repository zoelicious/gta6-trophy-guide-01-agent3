/* LEONIDA GETAWAY — GTA VI · PS5 trophy guide.
   Offline tracker + guide for the official 55 trophies.
   Data: app/data/trophies.json (official list, 2026-11-18).
   Progress: localStorage, export/import as JSON. */
'use strict';

const STORE_KEY = 'leonida-getaway-progress-v1';
const PSN_POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
const PSN_TOTAL = 1230;
const DEMO_EARNED = [2, 3, 4, 5, 8, 15, 29, 35];
const DEMO_COUNTERS = { 28: 6 };
const REGIONS = ['Vice City', 'Leonida Keys', 'Port Gellhorn', 'Mount Kalaga', 'Grassrivers', 'Ambrosia', 'Hamlet', 'Yorktown', 'Statewide'];
const KINDS = [
  { key: 'Platinum', label: 'Platinum & 100%' },
  { key: 'Story', label: 'Story' },
  { key: 'Strand', label: 'Strand' },
  { key: 'Collectible', label: 'Collectible' },
  { key: 'Activity', label: 'Activity' },
  { key: 'Crime', label: 'Crime' },
  { key: 'Money', label: 'Money & grind' },
  { key: 'Misc', label: 'Misc' }
];
const STOPS = [
  { n: 0, title: 'Before you start', hours: '~1 h', blurb: 'No cheats on your trophy save — they disable trophies and saving. Make a manual save at the start of every chapter, plus one before the final mission. Turn spoilers ON: 28 trophies are hidden on PSN until earned.' },
  { n: 1, title: 'Story · Chapters 1–4', hours: '~60–80 h', blurb: 'Play the story straight through. Meditate at EVERY spot the moment you see one — the early Chapter 1 spot is the game\'s one true missable. Scan vehicles and study animals as you go; both count toward 100%.' },
  { n: 2, title: 'Side story & strangers', hours: '~15 h', blurb: 'Finish the contact strands (Andy, Kenton, Billy, Randy, Tyrone), Bret\'s hunt, Cal\'s fishing challenge, and all 8 Strangers & Freaks strands. Start every stranger strand the moment it appears — the race against Yago closes in Chapter 3.' },
  { n: 3, title: 'Activities & sport', hours: '~20 h', blurb: 'Shooting Range gold (42), Top Fun drone races (14 locations), 20 different races, arcade, bowling, 9 activity types, 250 stunts.' },
  { n: 4, title: 'Collections & exploration', hours: '~25 h', blurb: '3 card sets, WAiNK at 100 locations, 100 vehicles, 52 areas of Leonida, the last meditation spots (check 18/18).' },
  { n: 5, title: 'Crime & combat', hours: '~20 h', blurb: '5 bank vaults, armored truck, 9 gangs\' illegal operations, jewelry store unseen, Combat Focus (5 enemies in one use), VCIA, Rhino tanks, 4-star wanted with your partner, 3 shops in a row.' },
  { n: 6, title: 'Money & grind', hours: '~25 h', blurb: 'Launder $250k Marked Bills, spend $100k, buy 8 garages, register 10 vehicles in Scooter Bros, 50 challenges, 500 choices, the last stunts.' },
  { n: 7, title: 'Cleanup & platinum', hours: '~10 h', blurb: 'Check the 100% list (A Long Road, gold) → platinum “Vice Got a Price!”. The five “trigger not yet confirmed” trophies sit here with their honest labels.' }
];
const HIDDEN_GROUPS = [
  { label: 'Chapter 1', ids: [2, 3] },
  { label: 'Chapter 2', ids: [4] },
  { label: 'Chapter 3', ids: [5] },
  { label: 'Chapter 4', ids: [6] },
  { label: 'Final mission', ids: [7] },
  { label: 'Story missions', ids: [8, 9, 10, 11, 12, 13] },
  { label: 'Character strands', ids: [22, 23, 24, 26, 27] },
  { label: 'Secrets & free roam', ids: [20, 37, 38, 40, 41, 44, 45, 47, 49, 50, 51] }
];
const LAND = '60,300 90,240 160,210 260,195 340,205 420,230 480,270 520,330 500,390 440,420 360,430 280,440 200,430 120,400 70,360';
const VC_HEX = '420,425 470,405 520,425 535,470 510,515 455,522 418,482';
const ROUTE = '480,475 280,340 115,380 130,265 300,250 425,285 455,325 500,500';
const WAYPOINTS = [[480, 475], [280, 340], [115, 380], [130, 265], [300, 250], [425, 285], [455, 325], [500, 500]];
const LABELS = [
  ['MOUNT KALAGA', 95, 232], ['AMBROSIA', 285, 222], ['YORKTOWN', 400, 240],
  ['HAMLET', 458, 372], ['GRASSRIVERS', 170, 330], ['PORT GELLHORN', 95, 355],
  ['VICE CITY', 475, 400], ['LEONIDA KEYS', 190, 448]
];

let DATA = null;          // {sources, trophies}
let byId = {};
let state = null;         // {earned:{}, counters:{}, spoiler, lastExport, lastImport, seeded}
let selectedId = 28;      // PMA open by default
let kindFilter = 'all';
let regionJump = null;

function defaultState() {
  return { earned: {}, counters: {}, spoiler: true, lastExport: null, lastImport: null, seeded: false };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { state = Object.assign(defaultState(), JSON.parse(raw)); return; }
  } catch (e) { /* corrupted storage: start clean */ }
  state = defaultState();
  DEMO_EARNED.forEach(id => { state.earned[id] = true; });
  state.counters = Object.assign({}, DEMO_COUNTERS);
  state.seeded = true;
  saveState();
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
  const el = document.getElementById('savedAt');
  if (el) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    el.textContent = '✓ Saved in this browser · ' + hh + ':' + mm;
  }
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function gradeLetter(g) { return { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' }[g] || '?'; }
function earnedCount() { return Object.keys(state.earned).filter(k => state.earned[k]).length; }
function earnedByGrade() {
  const out = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  DATA.trophies.forEach(t => { if (state.earned[t.id]) out[t.grade]++; });
  return out;
}
function psnPoints() {
  let pts = 0;
  DATA.trophies.forEach(t => { if (state.earned[t.id]) pts += PSN_POINTS[t.grade]; });
  return pts;
}
function hiddenMasked() {
  return DATA.trophies.filter(t => t.hidden && !state.earned[t.id]).length;
}
function isHiddenMasked(t) { return state.spoiler && t.hidden && !state.earned[t.id]; }
function displayName(t) {
  if (isHiddenMasked(t)) return t.kind === 'Story' ? 'Hidden story trophy' : 'Hidden trophy';
  return t.name;
}
function displayDesc(t) {
  if (isHiddenMasked(t)) return 'Hidden on PSN — earn it to reveal.';
  return t.description;
}

function renderHeader() {
  const n = earnedCount();
  const pct = Math.round(n / 55 * 100);
  document.getElementById('earnedCount').textContent = n + '/55 · ' + pct + '%';
  const pts = psnPoints();
  document.getElementById('psnPoints').textContent = pts.toLocaleString('en-US') + ' / 1,230 PSN pts';
  document.getElementById('progressFill').style.width = pct + '%';
  const bg = earnedByGrade();
  document.getElementById('chipP').textContent = bg.platinum + '/1';
  document.getElementById('chipG').textContent = bg.gold + '/2';
  document.getElementById('chipS').textContent = bg.silver + '/6';
  document.getElementById('chipB').textContent = bg.bronze + '/46';
  const tog = document.getElementById('spoilerToggle');
  tog.textContent = state.spoiler ? 'Spoilers hidden · ' + hiddenMasked() : 'Spoilers shown';
}

function renderAudit() {
  const guidesCited = DATA.trophies.filter(t => t.sources && t.sources.length).length;
  const steps = DATA.trophies.reduce((a, t) => a + t.steps.length, 0);
  const stepsCited = DATA.trophies.reduce((a, t) => a + t.steps.filter(s => s.c && s.c.length).length, 0);
  const miss = DATA.trophies.filter(t => t.missable === 'possibly').length;
  const watch = DATA.trophies.filter(t => t.missable === 'time').length;
  const unc = DATA.trophies.filter(t => t.unconfirmed).length;
  document.getElementById('auditStrip').innerHTML =
    '<b>55 official</b> · 1P 2G 6S 46B · <b>28 hidden</b> · ' + guidesCited + '/55 guides cite a source · ' +
    stepsCited + '/' + steps + ' steps cited · <b>13 sources</b> read 19–20 Nov 2026 · ' +
    miss + ' possibly missable · ' + watch + ' time-sensitive watch · ' + unc + ' unconfirmed · 1 dispute shown both ways';
}

function pinFill(t) {
  if (t.unconfirmed) return '#a78bfa';
  return '#c9a227';
}
function mapSvgInner(mode) {
  let s = '<svg viewBox="0 0 640 345" xmlns="http://www.w3.org/2000/svg">';
  s += '<rect x="0" y="0" width="640" height="345" fill="#0e1a2e"/>';
  s += '<g transform="translate(0,-180)">';
  s += '<polygon points="' + LAND + '" fill="#17443f" stroke="#2a8f88" stroke-width="1.5"/>';
  s += '<polygon points="' + VC_HEX + '" fill="#1d5a52" stroke="#2a8f88" stroke-width="1.5"/>';
  s += '<ellipse cx="110" cy="482" rx="55" ry="13" fill="#17443f" stroke="#2a8f88"/>';
  s += '<ellipse cx="190" cy="496" rx="60" ry="13" fill="#17443f" stroke="#2a8f88"/>';
  s += '<ellipse cx="270" cy="488" rx="55" ry="13" fill="#17443f" stroke="#2a8f88"/>';
  s += '<polyline points="' + ROUTE + '" fill="none" stroke="#c9a227" stroke-width="2" stroke-dasharray="7 5" opacity="0.85"/>';
  LABELS.forEach(l => {
    s += '<text x="' + l[1] + '" y="' + l[2] + '" fill="#cfe3d8" font-size="12" font-weight="700" letter-spacing="2" text-anchor="middle">' + l[0] + '</text>';
  });
  s += '<g><circle cx="585" cy="215" r="22" fill="none" stroke="#c9a227" stroke-width="1.5"/>';
  s += '<text x="585" y="198" fill="#e3c766" font-size="11" font-weight="700" text-anchor="middle">N</text>';
  s += '<polygon points="585,206 579,232 585,226 591,232" fill="#c9a227"/></g>';
  if (mode === 'pins') {
    DATA.trophies.forEach(t => {
      const ring = t.missable ? ' stroke="#e05252" stroke-width="3"' : (state.earned[t.id] ? ' stroke="#ffffff" stroke-width="2"' : ' stroke="#0e1626" stroke-width="1.5"');
      const sel = t.id === selectedId ? ' stroke="#ffffff" stroke-width="2.5"' : ring;
      s += '<g data-pin="' + t.id + '" style="cursor:pointer"><circle cx="' + t.pin.x + '" cy="' + t.pin.y + '" r="13" fill="' + pinFill(t) + '"' + sel + '/>';
      s += '<text x="' + t.pin.x + '" y="' + (t.pin.y + 4) + '" fill="#1a1405" font-size="11" font-weight="800" text-anchor="middle">' + t.id + '</text></g>';
    });
  } else {
    WAYPOINTS.forEach((w, i) => {
      s += '<g data-stop="' + i + '" style="cursor:pointer"><circle cx="' + w[0] + '" cy="' + w[1] + '" r="14" fill="#c9a227" stroke="#0e1626" stroke-width="2"/>';
      s += '<text x="' + w[0] + '" y="' + (w[1] + 4) + '" fill="#1a1405" font-size="12" font-weight="800" text-anchor="middle">' + i + '</text></g>';
    });
  }
  s += '</g>';
  s += '</svg>';
  return s;
}
function renderMaps() {
  document.getElementById('mapSvg').innerHTML = mapSvgInner('pins');
  document.getElementById('mapSvgMini').innerHTML = mapSvgInner('route');
  document.querySelectorAll('[data-pin]').forEach(g => {
    g.addEventListener('click', () => { selectTrophy(Number(g.getAttribute('data-pin'))); });
  });
  document.querySelectorAll('[data-stop]').forEach(g => {
    g.addEventListener('click', () => {
      const card = document.querySelector('.stop-card[data-stop="' + g.getAttribute('data-stop') + '"]');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  const chips = REGIONS.map(r => {
    const inRegion = DATA.trophies.filter(t => t.region === r);
    const got = inRegion.filter(t => state.earned[t.id]).length;
    return '<button class="region-chip" data-region="' + esc(r) + '" type="button"><b>' + esc(r) + '</b><span>' + got + '/' + inRegion.length + ' earned</span></button>';
  }).join('');
  document.getElementById('regionChips').innerHTML = chips;
  document.querySelectorAll('.region-chip').forEach(b => {
    b.addEventListener('click', () => {
      regionJump = b.getAttribute('data-region');
      document.getElementById('orderSelect').value = 'region';
      renderChecklist();
      switchTab('checklist');
      setTimeout(() => {
        const head = document.querySelector('.group-head[data-group="' + regionJump + '"]');
        if (head) head.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  });
}
function sourceById(id) { return DATA.sources.find(s => s.id === id); }
function citeHtml(cites) {
  return cites.map(c => '[' + c + ']').join(' ');
}
function renderDetail() {
  const t = byId[selectedId];
  if (!t) return;
  const counter = state.counters[t.id] || 0;
  const target = t.target || 0;
  let h = '';
  h += '<div class="grade-row">';
  h += '<span class="badge ' + t.grade + '">' + t.grade + '</span>';
  h += '<span class="tag">#' + t.id + ' of 55</span>';
  h += '<span class="tag">' + esc(t.kind) + '</span>';
  h += '<span class="tag">' + esc(t.region) + '</span>';
  if (t.missable === 'possibly') h += '<span class="badge missable">Possibly missable</span>';
  if (t.missable === 'time') h += '<span class="badge time">Time-sensitive</span>';
  if (t.unconfirmed) h += '<span class="badge unconf">Trigger not yet confirmed</span>';
  h += '</div>';
  h += '<h2>' + esc(displayName(t)) + '</h2>';
  h += '<div class="box"><h3>Official description</h3><p class="quote">“' + esc(displayDesc(t)) + '”</p></div>';
  if (t.missable === 'possibly') {
    h += '<div class="box danger"><h3>⚠ Possibly missable — point of no return</h3><p>End of Chapter 1. The early spot is gone for good once Chapter 1 closes — no mission replay or New Game+ brings it back. Meditate at every spot the moment you see one.</p></div>';
  }
  if (t.missable === 'time' && t.id === 25) {
    h += '<div class="box danger"><h3>⚠ Time-sensitive — point of no return</h3><p>Chapter 3 — the race against Yago. The strand tied to that race closes mid-story, so start every stranger strand the moment it appears.</p></div>';
  }
  if (t.missable === 'time' && t.id === 14) {
    h += '<div class="box danger"><h3>⚠ Time-sensitive — point of no return</h3><p>Mid-story — optional missions close. The optional missions that feed the 100% checklist close as the story advances; do optional content when it appears.</p></div>';
  }
  if (t.unconfirmed) {
    h += '<div class="box danger"><h3>Trigger not yet confirmed</h3><p>Public guides have not confirmed how this trophy unlocks. This guide says only what the official description gives — it does not invent a method.</p></div>';
  }
  if (target) {
    const pct = Math.min(100, Math.round(counter / target * 100));
    h += '<h3>Your count</h3><div class="stepper">';
    h += '<button type="button" data-step="-1" aria-label="Decrease count">−</button>';
    h += '<span class="count">' + counter + ' / ' + target.toLocaleString('en-US') + '</span>';
    h += '<button type="button" data-step="1" aria-label="Increase count">+</button>';
    h += '<span class="bar"><i style="width:' + pct + '%"></i></span></div>';
    h += '<p class="muted">PSN tracks this count to ' + target.toLocaleString('en-US') + ' — use the stepper; it is saved in this browser.</p>';
  }
  h += '<div class="box two"><div class="box"><h3>Getaway stop · Chapter</h3><p>' + esc(t.chapter) + '</p></div>';
  h += '<div class="box"><h3>Where · How</h3><p>' + esc(t.where) + ' ' + esc(t.how) + '</p></div></div>';
  h += '<h3>Steps — each step cited</h3><ol class="steps">';
  t.steps.forEach((s, i) => {
    h += '<li>' + esc(s.t) + ' <span class="cite">' + citeHtml(s.c) + '</span></li>';
  });
  h += '</ol>';
  h += '<h3>Guide — in our own words</h3><p>' + esc(t.guide) + '</p>';
  if (t.id === 28) {
    h += '<div class="box danger"><h3>Sources disagree — both versions shown</h3>';
    h += '<p><b>Version A — PowerPyx, KeenGamer:</b> 18 spots; the early Chapter 1 spot is at Jason\'s house.</p>';
    h += '<p><b>Version B — OutputLag, eGamers:</b> the early Chapter 1 spot is a balcony meditation with Lucia; some lists count 15 spots.</p>';
    h += '<p><b>Our call:</b> meditate at every spot the moment you see one and keep a Chapter 1 save. The count in this guide follows PSN\'s 18.</p></div>';
  }
  h += '<h3>Sources · rail [' + t.sources.map(n => n).join(']–[') + '] · retrieved 2026-11-19/20</h3><ol class="src-rail">';
  t.sources.forEach(id => {
    const s = sourceById(id);
    if (!s) return;
    const link = s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">[' + s.id + '] ' + esc(s.name) + ' — ' + esc(s.title) + '</a>' : '[' + s.id + '] ' + esc(s.name) + ' — ' + esc(s.title);
    h += '<li>' + link + ' · retrieved ' + esc(s.read) + '</li>';
  });
  h += '</ol>';
  h += '<button class="btn gold-btn mark-btn" type="button" data-mark="' + t.id + '">' + (state.earned[t.id] ? '✓ Earned — click to unmark' : 'Mark earned') + '</button>';
  document.querySelectorAll('.detail-panel').forEach(p => { p.innerHTML = h; });
  document.querySelectorAll('.detail-panel [data-step]').forEach(b => {
    b.addEventListener('click', () => {
      const d = Number(b.getAttribute('data-step'));
      const cur = state.counters[t.id] || 0;
      const next = Math.max(0, Math.min(t.target, cur + d));
      state.counters[t.id] = next;
      if (next >= t.target && t.target) state.earned[t.id] = true;
      saveState(); renderAll();
    });
  });
  document.querySelectorAll('.detail-panel [data-mark]').forEach(b => {
    b.addEventListener('click', () => {
      const id = Number(b.getAttribute('data-mark'));
      if (state.earned[id]) delete state.earned[id]; else state.earned[id] = true;
      saveState(); renderAll();
    });
  });
}
function selectTrophy(id) {
  selectedId = id;
  renderDetail();
  renderMaps();
}

function groupLabelFor(t, order) {
  if (order === 'roadmap') return 'STOP ' + t.stop + ' · ' + STOPS[t.stop].title.toUpperCase();
  if (order === 'region') return t.region.toUpperCase();
  return KINDS.find(k => k.key === t.kind).label.toUpperCase();
}
function renderChecklist() {
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  const order = document.getElementById('orderSelect').value;
  const grade = document.getElementById('gradeSelect').value;
  const earnedOnly = document.getElementById('earnedOnly').checked;
  const notYet = document.getElementById('notYet').checked;
  const chips = [
    { key: 'all', label: 'All 55', n: 55 },
    { key: 'Story', label: 'Story', n: 12 },
    { key: 'Strand', label: 'Strand', n: 7 },
    { key: 'Collectible', label: 'Collectible', n: 5 },
    { key: 'Activity', label: 'Activity', n: 8 },
    { key: 'Crime', label: 'Crime', n: 9 },
    { key: 'Money', label: 'Money & grind', n: 6 },
    { key: 'Misc', label: 'Misc', n: 6 },
    { key: 'Platinum', label: 'Platinum & 100%', n: 2 },
    { key: 'Missable', label: 'Missable', n: 3 }
  ];
  document.getElementById('filterChips').innerHTML = chips.map(c =>
    '<button class="filter-chip' + (kindFilter === c.key ? ' active' : '') + '" data-kind="' + c.key + '" type="button">' + c.label + ' ' + c.n + '</button>'
  ).join('');
  document.querySelectorAll('.filter-chip').forEach(b => {
    b.addEventListener('click', () => { kindFilter = b.getAttribute('data-kind'); renderChecklist(); });
  });
  let list = DATA.trophies.slice();
  if (kindFilter === 'Missable') list = list.filter(t => t.missable);
  else if (kindFilter !== 'all') list = list.filter(t => t.kind === kindFilter);
  if (grade !== 'all') list = list.filter(t => t.grade === grade);
  if (q) list = list.filter(t => displayName(t).toLowerCase().includes(q) || t.name.toLowerCase().includes(q));
  if (earnedOnly) list = list.filter(t => state.earned[t.id]);
  if (notYet) list = list.filter(t => !state.earned[t.id]);
  const shown = list.length;
  const filters = [];
  if (kindFilter !== 'all') filters.push(kindFilter === 'Missable' ? 'missable' : kindFilter);
  if (grade !== 'all') filters.push(grade);
  if (q) filters.push('“' + q + '”');
  if (earnedOnly) filters.push('earned only');
  if (notYet) filters.push('not yet earned');
  document.getElementById('listStatus').textContent =
    shown + ' of 55 shown · ' + earnedCount() + ' earned · ' + (filters.length ? filters.join(' · ') : 'no filter') + ' · Order: ' + order.charAt(0).toUpperCase() + order.slice(1);
  const groups = {};
  list.forEach(t => {
    const g = groupLabelFor(t, order);
    (groups[g] = groups[g] || []).push(t);
  });
  const orderKeys = order === 'roadmap'
    ? STOPS.map(s => 'STOP ' + s.n + ' · ' + s.title.toUpperCase()).filter(g => groups[g])
    : order === 'region'
      ? REGIONS.map(r => r.toUpperCase()).filter(g => groups[g])
      : KINDS.map(k => k.label.toUpperCase()).filter(g => groups[g]);
  let html = '';
  orderKeys.forEach(g => {
    const items = groups[g];
    const got = items.filter(t => state.earned[t.id]).length;
    html += '<div class="group-head" data-group="' + esc(g) + '"><span>' + esc(g) + '</span><span>' + got + '/' + items.length + ' earned</span></div>';
    items.forEach(t => {
      const masked = isHiddenMasked(t);
      html += '<label class="trow' + (masked ? ' hidden-t' : '') + (state.earned[t.id] ? ' earned' : '') + '" data-row="' + t.id + '">';
      html += '<input type="checkbox" data-earn="' + t.id + '"' + (state.earned[t.id] ? ' checked' : '') + '>';
      html += '<span class="tmain"><span class="tname">' + esc(displayName(t)) + '<span class="medal ' + t.grade + '">' + gradeLetter(t.grade) + '</span></span><br>';
      html += '<span class="tdesc">' + esc(displayDesc(t)) + '</span></span>';
      html += '<span class="tkind">' + esc(t.kind) + (t.target ? ' · ' + (state.counters[t.id] || 0) + '/' + t.target.toLocaleString('en-US') : '') + '</span></label>';
    });
  });
  if (!html) html = '<p class="muted">No trophies match the current filters.</p>';
  document.getElementById('checklistGroups').innerHTML = html;
  document.querySelectorAll('[data-earn]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-earn'));
      if (cb.checked) state.earned[id] = true; else delete state.earned[id];
      saveState(); renderAll();
    });
  });
  document.querySelectorAll('.trow').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return;
      selectTrophy(Number(row.getAttribute('data-row')));
    });
  });
}
function renderRoadmap() {
  const html = STOPS.map(s => {
    const ids = DATA.trophies.filter(t => t.stop === s.n);
    const got = ids.filter(t => state.earned[t.id]).length;
    const pct = ids.length ? Math.round(got / ids.length * 100) : 0;
    const names = ids.map(t => esc(t.name)).join(' · ');
    return '<div class="stop-card" data-stop="' + s.n + '"><h2>Stop ' + s.n + ' · ' + esc(s.title) + '</h2>' +
      '<div class="meta">' + esc(s.hours) + ' · ' + got + '/' + ids.length + ' trophies earned</div>' +
      '<p>' + esc(s.blurb) + '</p>' +
      '<p class="trophies">' + names + '</p>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div></div>';
  }).join('');
  document.getElementById('stopCards').innerHTML = html;
  document.querySelectorAll('.stop-card').forEach(c => {
    c.addEventListener('click', () => {
      const first = DATA.trophies.find(t => t.stop === Number(c.getAttribute('data-stop')));
      if (first) { selectTrophy(first.id); switchTab('map'); }
    });
  });
}

function renderMissables() {
  const cards = [
    { t: byId[28], flag: 'Possibly missable', ponr: 'End of Chapter 1, after the early story.', body: 'One early Chapter 1 meditation spot disappears permanently once the chapter closes. The sources disagree on the exact place — PowerPyx says Jason\'s house, OutputLag and eGamers describe a balcony meditation early in Chapter 1 — so meditate at every spot the moment you see one, and keep a manual save at the start of every chapter.' },
    { t: byId[25], flag: 'Time-sensitive', ponr: 'Chapter 3 — the race against Yago.', body: 'The Strangers & Freaks silver needs 8 stranger strands, and the strand tied to the race against Yago closes mid-story in Chapter 3. Start every stranger strand the moment it appears; do not stockpile stranger missions for later.' },
    { t: byId[14], flag: 'Time-sensitive', ponr: 'Mid-story — optional missions close.', body: 'A Long Road (100% completion, gold) is time-sensitive because optional missions that feed the checklist close as the story advances. The checklist itself is forgiving — about 60% true completion is enough — but the optional missions behind it are not. Do optional content when it appears.' }
  ];
  document.getElementById('missableCards').innerHTML = cards.map(c =>
    '<div class="missable-card"><div class="grade-row"><span class="badge ' + (c.flag === 'Possibly missable' ? 'missable' : 'time') + '">' + c.flag + '</span>' +
    '<span class="badge ' + c.t.grade + '">' + c.t.grade + '</span></div>' +
    '<h2>' + esc(c.t.name) + '</h2>' +
    '<p class="ponr">POINT OF NO RETURN: ' + esc(c.ponr) + '</p>' +
    '<p>' + esc(c.body) + '</p>' +
    '<p class="src-line">Sources: PowerPyx, OutputLag, KeenGamer, eGamers — retrieved 2026-11-20.</p></div>'
  ).join('');
  const masked = hiddenMasked();
  let h = '<h2>Hidden trophies — spoiler mode ' + (state.spoiler ? 'ON' : 'OFF') + ' · ' + masked + ' of 28 masked until earned</h2>';
  h += '<p class="muted">28 of the 55 trophies are hidden on PSN until earned. With spoilers hidden they appear as masked bars, grouped by chapter — never as a wall of repeated cards.</p>';
  HIDDEN_GROUPS.forEach(g => {
    const got = g.ids.filter(id => state.earned[id]).length;
    h += '<div class="hidden-group"><h3>' + esc(g.label) + ' · ' + got + '/' + g.ids.length + '</h3>';
    g.ids.forEach(id => {
      const t = byId[id];
      const isMasked = isHiddenMasked(t);
      h += '<div class="masked-bar' + (state.earned[id] ? ' earned' : '') + '">' + (state.earned[id] ? '✓ ' : '') + esc(isMasked ? 'Hidden trophy — hidden until earned' : t.name) + '</div>';
    });
    h += '</div>';
  });
  document.getElementById('hiddenPanel').innerHTML = h;
}

function barRow(label, got, total, gold) {
  const pct = total ? Math.round(got / total * 100) : 0;
  return '<div class="bar-row"><span>' + esc(label) + '</span><span class="bar"><i class="' + (gold ? 'gold' : '') + '" style="width:' + pct + '%"></i></span><span class="num">' + got + '/' + total + '</span></div>';
}
function renderProgress() {
  const pts = psnPoints();
  const pct = Math.round(pts / PSN_TOTAL * 100);
  document.getElementById('psnBig').textContent = pts.toLocaleString('en-US') + ' / 1,230 pts · ' + pct + '%';
  const bg = earnedByGrade();
  document.getElementById('gradeBars').innerHTML =
    barRow('Platinum', bg.platinum, 1, true) + barRow('Gold', bg.gold, 2, true) +
    barRow('Silver', bg.silver, 6) + barRow('Bronze', bg.bronze, 46);
  const kindCounts = {};
  KINDS.forEach(k => { kindCounts[k.key] = { got: 0, total: 0 }; });
  DATA.trophies.forEach(t => {
    kindCounts[t.kind].total++;
    if (state.earned[t.id]) kindCounts[t.kind].got++;
  });
  document.getElementById('kindBars').innerHTML = KINDS.map(k =>
    barRow(k.label, kindCounts[k.key].got, kindCounts[k.key].total)
  ).join('');
  document.getElementById('stageGrid').innerHTML = STOPS.map(s => {
    const ids = DATA.trophies.filter(t => t.stop === s.n);
    const got = ids.filter(t => state.earned[t.id]).length;
    return '<div class="stage-cell" data-stop="' + s.n + '"><b>Stop ' + s.n + '</b><span>' + got + '/' + ids.length + '</span></div>';
  }).join('');
  document.querySelectorAll('.stage-cell').forEach(c => {
    c.addEventListener('click', () => switchTab('roadmap'));
  });
  const meta = [];
  if (state.lastExport) meta.push('Last export ' + state.lastExport.name + ' · ' + state.lastExport.count + ' trophies · ' + state.lastExport.time);
  if (state.lastImport) meta.push('Last import ' + state.lastImport.name + ' · ' + state.lastImport.count + ' trophies · ' + state.lastImport.time);
  if (!meta.length) meta.push('No export or import yet this browser session.');
  document.getElementById('backupMeta').innerHTML = meta.map(m => '<div>' + esc(m) + '</div>').join('');
}

function renderSources() {
  const citedBy = {};
  DATA.sources.forEach(s => { citedBy[s.id] = 0; });
  DATA.trophies.forEach(t => t.sources.forEach(id => { citedBy[id] = (citedBy[id] || 0) + 1; }));
  document.getElementById('sourceMatrix').innerHTML = DATA.sources.map(s => {
    const title = s.url
      ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title) + '</a><div class="url">' + esc(s.url) + '</div>'
      : esc(s.title);
    return '<tr><td><b>' + esc(s.name) + '</b><br>' + title + '</td><td>' + esc(s.read) + '</td><td>cited by ' + (citedBy[s.id] || 0) + ' of 55 guides</td><td>' + esc(s.note) + '</td></tr>';
  }).join('');
}

function exportProgress() {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10);
  const name = 'leonida-getaway-progress-' + stamp + '.json';
  const payload = {
    format: 'leonida-getaway-progress/v1',
    exportedAt: now.toISOString(),
    earned: Object.keys(state.earned).filter(k => state.earned[k]).map(Number),
    counters: state.counters,
    spoiler: state.spoiler
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  state.lastExport = { name: name, count: payload.earned.length, time: hh + ':' + mm };
  saveState(); renderProgress();
}
function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !Array.isArray(data.earned)) throw new Error('bad file');
      state.earned = {};
      data.earned.forEach(id => { if (byId[id]) state.earned[id] = true; });
      state.counters = {};
      if (data.counters) Object.keys(data.counters).forEach(id => {
        const t = byId[id];
        if (t && t.target) state.counters[id] = Math.max(0, Math.min(t.target, Number(data.counters[id]) || 0));
      });
      if (typeof data.spoiler === 'boolean') state.spoiler = data.spoiler;
      const now = new Date();
      state.lastImport = { name: file.name, count: Object.keys(state.earned).length, time: String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') };
      saveState(); renderAll();
    } catch (e) { alert('That file is not a LEONIDA GETAWAY progress export.'); }
  };
  reader.readAsText(file);
}
function resetProgress() {
  if (!confirm('Reset all progress? Earned trophies and counters go back to zero.')) return;
  state.earned = {};
  state.counters = {};
  state.lastExport = null;
  state.lastImport = null;
  saveState(); renderAll();
}

function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
  if (name === 'roadmap') renderRoadmap();
  if (name === 'missables') renderMissables();
  if (name === 'progress') renderProgress();
  if (name === 'sources') renderSources();
}
function renderAll() {
  renderHeader();
  renderAudit();
  renderMaps();
  renderDetail();
  renderChecklist();
  renderRoadmap();
  renderMissables();
  renderProgress();
  renderSources();
}

function init() {
  loadState();
  fetch('data/trophies.json')
    .then(r => { if (!r.ok) throw new Error('trophies.json not found'); return r.json(); })
    .then(data => {
      DATA = data;
      data.trophies.forEach(t => { byId[t.id] = t; });
      renderAll();
      saveState();
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.addEventListener('click', () => switchTab(b.getAttribute('data-tab')));
      });
      document.getElementById('spoilerToggle').addEventListener('click', () => {
        state.spoiler = !state.spoiler;
        saveState(); renderAll();
      });
      document.getElementById('exportBtn').addEventListener('click', exportProgress);
      document.getElementById('exportBtn2').addEventListener('click', exportProgress);
      const imp = () => document.getElementById('importFile').click();
      document.getElementById('importBtn').addEventListener('click', imp);
      document.getElementById('importBtn2').addEventListener('click', imp);
      document.getElementById('importFile').addEventListener('change', e => {
        if (e.target.files[0]) importProgress(e.target.files[0]);
        e.target.value = '';
      });
      document.getElementById('resetBtn').addEventListener('click', resetProgress);
      ['searchInput', 'orderSelect', 'gradeSelect', 'earnedOnly', 'notYet'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderChecklist);
        document.getElementById(id).addEventListener('change', renderChecklist);
      });
    })
    .catch(err => {
      document.querySelector('main').innerHTML = '<p>Could not load app/data/trophies.json — ' + esc(err.message) + '</p>';
    });
}
document.addEventListener('DOMContentLoaded', init);

