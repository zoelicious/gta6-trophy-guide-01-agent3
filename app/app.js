// LEONIDA GETAWAY — GTA VI PS5 trophy guide + tracker.
// Single-page app: map pins, checklist, 8-stop roadmap, missables, progress,
// source matrix. All data lives in data/trophies.json; progress lives in
// localStorage and exports as JSON. No network at run time.

const SOURCES = [
  { n: 1, name: 'PowerPyx', title: 'GTA 6 trophy guide & roadmap', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/', read: '2026-11-19', note: 'Full guide + roadmap' },
  { n: 2, name: 'OutputLag', title: 'GTA 6 trophy list', url: 'https://outputlag.com/guides/gta-6-trophy-list/', read: '2026-11-19', note: 'Full list + notes' },
  { n: 3, name: 'Exophase', title: 'Grand Theft Auto VI trophies (PSN)', url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/', read: '2026-11-19', note: 'Official list' },
  { n: 4, name: 'PSNProfiles', title: 'Grand Theft Auto VI trophies', url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi', read: '2026-11-19', note: 'Official list + targets' },
  { n: 5, name: 'KeenGamer', title: 'GTA 6 trophy guide, platinum roadmap, all 55 trophies', url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/', read: '2026-11-19', note: 'Full guide + roadmap' },
  { n: 6, name: 'eGamers', title: 'GTA 6 trophy list — all 55 trophies and the hardest ones', url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/', read: '2026-11-19', note: 'List + hardest trophies' },
  { n: 7, name: 'GTA Zone', title: 'GTA 6 trophies & achievements', url: 'https://gta-zone.com/news/gta-6-trophies-achievements/', read: '2026-11-19', note: 'List + roadmap' },
  { n: 8, name: 'U7BUY', title: 'GTA 6 trophies', url: 'https://www.u7buy.com/blog/gta-6-trophies/', read: '2026-11-19', note: 'List' },
  { n: 9, name: 'GTAViceCityHub', title: 'GTA 6 achievements', url: 'https://www.gtavicecityhub.com/achievements', read: '2026-11-19', note: 'List' },
  { n: 10, name: 'HowToVideoGame', title: 'GTA 6 trophies', url: 'https://howtovideogame.com/gta-6-trophies/', read: '2026-11-19', note: 'List + hidden count' },
  { n: 11, name: 'CryptoGames', title: 'GTA 6 trophies & achievements, full list', url: 'https://cryptogames.gg/gta-6-trophies-achievements-full-list/', read: '2026-11-19', note: 'List + 100% checklist' },
];

const STAGES = [
  { n: 0, title: 'Before you start', hours: '~1 h', text: 'No cheats on your trophy save — they disable trophies and saving. Make a manual save at the start of every chapter, plus one before the final mission. Turn spoilers ON: 28 trophies are hidden on PSN until earned.' },
  { n: 1, title: 'Story · Chapters 1–4', hours: '~60–80 h', text: 'Play the story straight through. Meditate at EVERY spot the moment you see one — the early Chapter 1 spot is the game\u2019s one true missable. Scan vehicles and study animals as you go; both count toward 100%.' },
  { n: 2, title: 'Side story & strangers', hours: '~15 h', text: 'Finish the 8 Strangers & Freaks strands plus the final missions for Andy, Kenton, Billy, Randy and Tyrone, Bret\u2019s hunt and Cal\u2019s fishing challenge. Start every strand the moment it appears.' },
  { n: 3, title: 'Activities & sport', hours: '~20 h', text: 'Shooting Range gold (42), Top Fun drone races (14 locations), 20 different races, arcade, bowling, and all 9 activity types. Ranges and drone races are must-complete for the 100% checklist.' },
  { n: 4, title: 'Collections & exploration', hours: '~25 h', text: '3 card sets, WAiNK It at 100 locations, 100 vehicles discovered, all 52 areas of Leonida — and the remaining meditation spots. Check the counter: 18/18.' },
  { n: 5, title: 'Crime & combat', hours: '~20 h', text: '5 bank vaults, armored truck, 9 gangs\u2019 illegal operations, jewelry store undetected, Combat Focus (5 enemies in one use), VCIA, a Rhino tank, 4 stars with your partner, 3 shops back-to-back.' },
  { n: 6, title: 'Money & grind', hours: '~40 h', text: 'Launder $250,000 of Marked Bills, spend $100,000 in shops, buy all 8 garages, register 10 vehicles to Scooter Bros, 50 challenges, 500 choices, leftover stunts.' },
  { n: 7, title: 'Cleanup & platinum', hours: '~20 h', text: 'Check the 100% checklist (A Long Road, gold) and sweep the five trophies whose triggers were not yet confirmed — then the platinum, Vice Got a Price!, pops on the last one.' },
];

// Pin positions on the night map (viewBox 0 0 1000 620), one per trophy id.
const POS = { 1: [470, 430], 2: [150, 520], 3: [340, 540], 4: [500, 540], 5: [150, 430], 6: [230, 480], 7: [330, 380], 8: [730, 450], 9: [120, 470], 10: [200, 200], 11: [400, 260], 12: [250, 430], 13: [350, 140], 14: [660, 430], 15: [230, 320], 16: [640, 260], 17: [620, 200], 18: [830, 450], 19: [830, 560], 20: [430, 520], 21: [850, 510], 22: [360, 320], 23: [640, 500], 24: [290, 200], 25: [710, 190], 26: [190, 560], 27: [800, 320], 28: [700, 140], 29: [200, 380], 30: [580, 480], 31: [250, 520], 32: [740, 260], 33: [730, 560], 34: [750, 510], 35: [170, 260], 36: [590, 320], 37: [880, 480], 38: [450, 190], 39: [780, 540], 40: [670, 380], 41: [560, 430], 42: [400, 480], 43: [260, 260], 44: [880, 560], 45: [300, 560], 46: [790, 580], 47: [560, 380], 48: [520, 260], 49: [450, 380], 50: [470, 320], 51: [850, 590], 52: [600, 140], 53: [700, 320], 54: [780, 380], 55: [690, 590] };

// Roadmap waypoints 0-7 on the same map.
const WAY = [[780, 540], [480, 360], [150, 430], [300, 330], [560, 300], [660, 330], [620, 270], [560, 380]];

const POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
const STORE_KEY = 'leonida-getaway-v1';
const DEMO_EARNED = [2, 3, 4, 5, 15, 21, 28, 46];

let TROPHIES = [];
let state = { earned: {}, counts: {}, spoilers: true, savedAt: null, lastExport: null };
let selectedId = 28;
let activeTab = 'map';
let kindFilter = 'all';
let orderMode = 'roadmap';
let gradeFilter = 'all';
let searchText = '';
let earnedOnly = false;
let notEarned = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (e) { /* fresh state */ }
  const params = new URLSearchParams(location.search);
  if (params.get('demo') === '1') {
    state.earned = {};
    DEMO_EARNED.forEach((id) => { state.earned[id] = true; });
    state.counts = { 28: 6, 15: 0, 31: 0 };
    state.spoilers = true;
    state.savedAt = new Date().toISOString();
  }
}
function saveState() {
  state.savedAt = new Date().toISOString();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full */ }
  renderHeader();
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function byId(id) { return TROPHIES.find((t) => t.id === id); }
function isHidden(t) { return state.spoilers && t.hidden && !state.earned[t.id]; }
function displayName(t) { return isHidden(t) ? 'Hidden story trophy' : t.name; }
function displayDesc(t) { return isHidden(t) ? 'Hidden on PSN — earn it to reveal.' : t.description; }
function gradeLabel(g) { return { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' }[g]; }
function pts() {
  return TROPHIES.reduce((s, t) => s + (state.earned[t.id] ? POINTS[t.grade] : 0), 0);
}
function earnedCount() { return TROPHIES.filter((t) => state.earned[t.id]).length; }
function citeText(cites) { return cites.map((n) => '[' + n + ']').join(''); }
function fmt(n) { return n.toLocaleString('en-US'); }

function renderHeader() {
  const n = earnedCount();
  const pct = Math.round((n / 55) * 100);
  document.getElementById('headCount').textContent = n + '/55 · ' + pct + '%';
  document.getElementById('headPts').textContent = fmt(pts()) + ' / 1,230 PSN pts';
  const chips = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const total = TROPHIES.filter((t) => t.grade === g).length;
    const got = TROPHIES.filter((t) => t.grade === g && state.earned[t.id]).length;
    return '<span class="chip">' + gradeLabel(g) + ' <b>' + got + '/' + total + '</b></span>';
  }).join('');
  document.getElementById('gradeChips').innerHTML = chips;
  document.getElementById('headBarFill').style.width = pct + '%';
  const hiddenLeft = TROPHIES.filter((t) => t.hidden && !state.earned[t.id]).length;
  const btn = document.getElementById('spoilerBtn');
  btn.textContent = state.spoilers ? 'Spoilers hidden · ' + hiddenLeft : 'Spoilers shown · tap to hide';
  document.getElementById('savedLine').textContent = state.savedAt
    ? '✓ Saved in this browser · ' + new Date(state.savedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : 'No saved progress yet';
}

function renderAudit() {
  const steps = TROPHIES.reduce((s, t) => s + t.steps.length, 0);
  const cited = TROPHIES.reduce((s, t) => s + t.steps.filter((st) => st.cite && st.cite.length).length, 0);
  const guides = TROPHIES.filter((t) => t.sources && t.sources.length).length;
  const possibly = TROPHIES.filter((t) => t.missable === 'possibly').length;
  const watch = TROPHIES.filter((t) => t.missable === 'watch').length;
  const unconf = TROPHIES.filter((t) => t.unconfirmed).length;
  document.getElementById('auditStrip').innerHTML =
    '<b>55 official</b> · 1P 2G 6S 46B · <b>28 hidden</b> · ' + guides + '/55 guides cite a source · ' +
    cited + '/' + steps + ' steps cited · <b>11 sources</b> read 19 Nov 2026 · ' +
    possibly + ' possibly missable · ' + watch + ' time-sensitive watch · ' + unconf + ' unconfirmed · 2 disputes shown both ways';
}

function landPaths() {
  return '<rect x="0" y="0" width="1000" height="620" fill="#0a1a2e"/>' +
    '<polygon points="120,180 300,90 520,70 700,120 830,220 860,340 780,420 600,470 380,460 200,400 110,300" fill="#143d3a" stroke="#2a9d94" stroke-width="2"/>' +
    '<polygon points="700,430 800,400 880,450 900,540 820,600 720,570 680,500" fill="#17524e" stroke="#2a9d94" stroke-width="2"/>' +
    '<ellipse cx="180" cy="520" rx="90" ry="18" fill="#143d3a" stroke="#2a9d94" stroke-width="1.5"/>' +
    '<ellipse cx="300" cy="545" rx="100" ry="18" fill="#143d3a" stroke="#2a9d94" stroke-width="1.5"/>' +
    '<ellipse cx="430" cy="530" rx="90" ry="16" fill="#143d3a" stroke="#2a9d94" stroke-width="1.5"/>' +
    '<text x="300" y="105" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">AMBROSIA</text>' +
    '<text x="600" y="175" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">YORKTOWN</text>' +
    '<text x="120" y="165" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">MOUNT KALAGA</text>' +
    '<text x="110" y="300" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">GRASSRIVERS</text>' +
    '<text x="60" y="395" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">PORT GELLHORN</text>' +
    '<text x="150" y="600" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">LEONIDA KEYS</text>' +
    '<text x="700" y="395" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">HAMLET</text>' +
    '<text x="700" y="485" fill="#f2ead8" font-size="20" letter-spacing="4" font-family="Verdana">VICE CITY</text>' +
    '<g transform="translate(920,60)"><circle r="26" fill="none" stroke="#c9a227" stroke-width="2"/><polygon points="0,-18 6,8 0,2 -6,8" fill="#c9a227"/><text y="-32" text-anchor="middle" fill="#f2ead8" font-size="16" font-family="Verdana">N</text></g>';
}

function renderMap() {
  const route = WAY.map((p) => p.join(',')).join(' ');
  let pins = '';
  TROPHIES.forEach((t) => {
    const p = POS[t.id];
    if (!p) return;
    const earned = state.earned[t.id];
    const fill = t.unconfirmed ? '#b48cf2' : '#c9a227';
    const stroke = t.missable ? '#e5484d' : (earned ? '#f2ead8' : '#0e1626');
    const sw = t.missable || earned ? 3 : 1.5;
    pins += '<g data-pin="' + t.id + '" style="cursor:pointer"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="17" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"/>' +
      '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-size="14" font-weight="bold" fill="#0e1626" font-family="Verdana">' + t.id + '</text></g>';
  });
  document.getElementById('mapWrap').innerHTML =
    '<svg viewBox="0 0 1000 620" role="img" aria-label="Stylized map of Leonida with trophy pins">' + landPaths() +
    '<polyline points="' + route + '" fill="none" stroke="#c9a227" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.7"/>' +
    pins + '</svg>';
  document.querySelectorAll('#mapWrap [data-pin]').forEach((el) => {
    el.addEventListener('click', () => { selectTrophy(Number(el.getAttribute('data-pin'))); });
  });
  const regions = ['Vice City', 'Leonida Keys', 'Port Gellhorn', 'Mount Kalaga', 'Grassrivers', 'Ambrosia', 'Hamlet', 'Yorktown', 'Statewide'];
  document.getElementById('regionCards').innerHTML = regions.map((r) => {
    const list = TROPHIES.filter((t) => t.region === r);
    const got = list.filter((t) => state.earned[t.id]).length;
    return '<button type="button" class="region-card" data-region="' + esc(r) + '"><b>' + esc(r) + '</b><span>' + got + '/' + list.length + ' earned</span></button>';
  }).join('');
  document.querySelectorAll('#regionCards [data-region]').forEach((el) => {
    el.addEventListener('click', () => {
      kindFilter = 'all';
      orderMode = 'region';
      document.getElementById('orderSel').value = 'region';
      switchTab('checklist');
    });
  });
}

function renderRouteMap() {
  const route = WAY.map((p) => p.join(',')).join(' ');
  let wps = '';
  WAY.forEach((p, i) => {
    wps += '<g data-wp="' + i + '" style="cursor:pointer"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="18" fill="#c9a227" stroke="#0e1626" stroke-width="2"/>' +
      '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-size="15" font-weight="bold" fill="#0e1626" font-family="Verdana">' + i + '</text></g>';
  });
  document.getElementById('routeMapWrap').innerHTML =
    '<svg viewBox="0 0 1000 620" role="img" aria-label="Getaway route map with 8 waypoints">' + landPaths() +
    '<polyline points="' + route + '" fill="none" stroke="#c9a227" stroke-width="3" stroke-dasharray="8 6"/>' + wps + '</svg>';
  document.querySelectorAll('#routeMapWrap [data-wp]').forEach((el) => {
    el.addEventListener('click', () => {
      const n = Number(el.getAttribute('data-wp'));
      document.querySelectorAll('.stage-card').forEach((c) => c.classList.toggle('selected', Number(c.getAttribute('data-stage')) === n));
      document.querySelector('[data-stage="' + n + '"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function stepList(t) {
  return '<ol class="steps">' + t.steps.map((s) =>
    '<li>' + esc(s.text.replace(/\s*\[[0-9]\](\[[0-9]\])*\s*$/, '')) + ' <span class="cite">' + citeText(s.cite) + '</span></li>').join('') + '</ol>';
}

function detailHtml(t) {
  if (!t) return '<div class="detail"><p>Pick a trophy to open its guide.</p></div>';
  const flag = t.missable === 'possibly'
    ? '<span class="flag-red">POSSIBLY MISSABLE</span>'
    : t.missable === 'watch' ? '<span class="flag-grey">TIME-SENSITIVE</span>' : '';
  const unc = t.unconfirmed ? '<span class="flag-grey">TRIGGER NOT YET CONFIRMED</span>' : '';
  const stage = STAGES[t.stage];
  let stepper = '';
  if (t.target) {
    const cur = state.counts[t.id] || 0;
    const pct = Math.min(100, Math.round((cur / t.target) * 100));
    stepper = '<h3>Your count</h3><div class="stepper">' +
      '<button type="button" data-step="-1" data-id="' + t.id + '" aria-label="Decrease count">−</button>' +
      '<span class="count">' + cur + ' / ' + fmt(t.target) + '</span>' +
      '<button type="button" data-step="1" data-id="' + t.id + '" aria-label="Increase count">+</button>' +
      '<span class="bar"><span style="width:' + pct + '%"></span></span></div>' +
      '<p class="src-line">PSN tracks this count to ' + fmt(t.target) + ' — use the stepper; it is saved in this browser.</p>';
  }
  const disagree = t.id === 28
    ? '<div class="box red"><h3>Sources disagree — both versions shown</h3>' +
      '<p><b>How many spots?</b> PowerPyx counts 18 meditation spots; other lists count 15. This guide counts to 18 and tells you to keep meditating until the trophy pops. [1][6]</p>' +
      '<p><b>Where is the Chapter 1 spot?</b> PowerPyx puts it at Jason\u2019s house; OutputLag and eGamers describe a balcony meditation early in Chapter 1. Both versions are shown — meditate at every early spot you find. [1][2][6]</p></div>'
    : '';
  const srcItems = t.sources.map((n) => {
    const s = SOURCES.find((x) => x.n === n);
    return '<li>[' + n + '] <b>' + esc(s.name) + '</b> — ' + esc(s.title) + ' — <a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.url.replace(/^https:\/\//, '')) + '</a> (retrieved ' + s.read + ')</li>';
  }).join('');
  return '<div class="detail">' +
    '<div class="grade-row"><span class="gchip ' + t.grade + '">' + t.grade + '</span><span class="tag">#' + t.id + ' of 55</span><span class="tag">' + esc(t.kind) + '</span><span class="tag">' + esc(t.region) + '</span>' + flag + unc + '</div>' +
    '<h2>' + esc(displayName(t)) + '</h2>' +
    '<div class="box"><h3>Official description</h3><p><i>“' + esc(t.description) + '”</i></p></div>' +
    disagree + stepper +
    '<div style="display:flex;gap:10px"><div class="box" style="flex:1"><h3>Getaway stop · Chapter</h3><p>Stop ' + t.stage + ' · ' + esc(stage.title) + '<br>' + esc(t.chapter) + '</p></div>' +
    '<div class="box" style="flex:1"><h3>Where · How</h3><p>' + esc(t.where) + ' ' + esc(t.how) + '</p></div></div>' +
    '<h3>Guide — in our own words</h3><p class="guide-text">' + esc(t.guide) + '</p>' +
    '<h3>Steps — each step cited</h3>' + stepList(t) +
    '<h3>Sources</h3><ul class="src-list">' + srcItems + '</ul>' +
    '<div class="earn-row"><button type="button" class="btn" data-earn="' + t.id + '">' + (state.earned[t.id] ? '✓ Earned — tap to unmark' : 'Mark as earned') + '</button></div>' +
    '</div>';
}

function renderDetail() {
  const t = byId(selectedId);
  ['detailPanel', 'detailPanel2', 'detailPanel3'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = detailHtml(t);
  });
  document.querySelectorAll('[data-step]').forEach((b) => {
    b.addEventListener('click', () => {
      const id = Number(b.getAttribute('data-id'));
      const d = Number(b.getAttribute('data-step'));
      const tr = byId(id);
      const cur = state.counts[id] || 0;
      state.counts[id] = Math.max(0, Math.min(tr.target, cur + d));
      if (state.counts[id] >= tr.target && !state.earned[id]) state.earned[id] = true;
      saveState(); renderAll();
    });
  });
  document.querySelectorAll('[data-earn]').forEach((b) => {
    b.addEventListener('click', () => {
      const id = Number(b.getAttribute('data-earn'));
      state.earned[id] = !state.earned[id];
      if (state.earned[id]) {
        const tr = byId(id);
        if (tr.target) state.counts[id] = tr.target;
      }
      saveState(); renderAll();
    });
  });
}

function selectTrophy(id) {
  selectedId = id;
  renderDetail();
  const panel = document.getElementById(activeTab === 'checklist' ? 'detailPanel2' : activeTab === 'roadmap' ? 'detailPanel3' : 'detailPanel');
  if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function filteredTrophies() {
  let list = TROPHIES.slice();
  if (kindFilter !== 'all') {
    if (kindFilter === 'missable') list = list.filter((t) => t.missable);
    else list = list.filter((t) => t.kind === kindFilter);
  }
  if (gradeFilter !== 'all') list = list.filter((t) => t.grade === gradeFilter);
  if (searchText) {
    const q = searchText.toLowerCase();
    list = list.filter((t) => t.name.toLowerCase().includes(q));
  }
  if (earnedOnly) list = list.filter((t) => state.earned[t.id]);
  if (notEarned) list = list.filter((t) => !state.earned[t.id]);
  return list;
}

function renderChecklist() {
  const kinds = ['Story', 'Side story', 'Collectible', 'Activity', 'Crime', 'Money & grind', 'Misc', 'Platinum & 100%'];
  const chips = [{ k: 'all', label: 'All 55' }].concat(kinds.map((k) => ({
    k, label: k + ' ' + TROPHIES.filter((t) => t.kind === k).length,
  }))).concat([{ k: 'missable', label: 'Missable ' + TROPHIES.filter((t) => t.missable).length }]);
  document.getElementById('filterBar').innerHTML = chips.map((c) =>
    '<button type="button" class="fchip' + (kindFilter === c.k ? ' active' : '') + '" data-kind="' + esc(c.k) + '">' + esc(c.label) + '</button>').join('');
  document.querySelectorAll('#filterBar [data-kind]').forEach((b) => {
    b.addEventListener('click', () => { kindFilter = b.getAttribute('data-kind'); renderChecklist(); });
  });
  const list = filteredTrophies();
  const got = list.filter((t) => state.earned[t.id]).length;
  document.getElementById('listMeta').textContent = list.length + ' of 55 shown · ' + got + ' earned · ' +
    (kindFilter === 'all' ? 'no filter' : 'filter: ' + kindFilter) + ' · Order: ' + orderMode;
  const groups = new Map();
  const groupName = (t) => orderMode === 'roadmap'
    ? 'Stop ' + t.stage + ' · ' + STAGES[t.stage].title
    : orderMode === 'region' ? t.region : t.kind;
  list.forEach((t) => {
    const g = groupName(t);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(t);
  });
  const order = orderMode === 'roadmap'
    ? [...groups.keys()].sort((a, b) => Number(a.split(' ')[1]) - Number(b.split(' ')[1]))
    : [...groups.keys()].sort();
  let html = '';
  order.forEach((g) => {
    const items = groups.get(g);
    const gg = items.filter((t) => state.earned[t.id]).length;
    html += '<div class="group-head"><span>' + esc(g) + '</span><span>' + gg + '/' + items.length + ' earned</span></div>';
    items.forEach((t) => {
      html += '<button type="button" class="trow' + (selectedId === t.id ? ' selected' : '') + '" data-tid="' + t.id + '">' +
        '<input type="checkbox" ' + (state.earned[t.id] ? 'checked' : '') + ' data-check="' + t.id + '" aria-label="Earned">' +
        '<span><span class="tname' + (isHidden(t) ? ' hidden-name' : '') + '">' + esc(displayName(t)) + '</span> <span class="gchip ' + t.grade + '">' + gradeLabel(t.grade) + '</span><br>' +
        '<span class="tdesc">' + esc(displayDesc(t)) + '</span></span>' +
        '<span class="tmeta">' + esc(t.kind) + (t.target ? '<br>' + (state.counts[t.id] || 0) + '/' + fmt(t.target) : '') + '</span></button>';
    });
  });
  document.getElementById('trophyList').innerHTML = html || '<p class="hint">No trophies match these filters.</p>';
  document.querySelectorAll('#trophyList [data-tid]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (e.target.matches('input[type=checkbox]')) return;
      selectTrophy(Number(el.getAttribute('data-tid')));
    });
  });
  document.querySelectorAll('#trophyList [data-check]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-check'));
      state.earned[id] = cb.checked;
      const tr = byId(id);
      if (cb.checked && tr.target) state.counts[id] = tr.target;
      saveState(); renderAll();
    });
  });
}

function renderRoadmap() {
  renderRouteMap();
  document.getElementById('stageCards').innerHTML = STAGES.map((s) => {
    const items = TROPHIES.filter((t) => t.stage === s.n);
    const got = items.filter((t) => state.earned[t.id]).length;
    const pct = items.length ? Math.round((got / items.length) * 100) : 0;
    return '<div class="stage-card" data-stage="' + s.n + '"><h2>Stop ' + s.n + ' · ' + esc(s.title) + '</h2>' +
      '<div class="meta">' + esc(s.hours) + ' · ' + got + '/' + items.length + ' trophies earned</div>' +
      '<p>' + esc(s.text) + '</p>' +
      '<div class="bar"><span style="width:' + pct + '%"></span></div>' +
      '<p class="src-line">' + items.map((t) => esc(displayName(t))).join(' · ') + '</p></div>';
  }).join('');
  document.querySelectorAll('.stage-card').forEach((c) => {
    c.addEventListener('click', () => {
      document.querySelectorAll('.stage-card').forEach((x) => x.classList.remove('selected'));
      c.classList.add('selected');
    });
  });
}

function renderMissables() {
  const cards = [
    { id: 28, flag: 'POSSIBLY MISSABLE', ponr: 'End of Chapter 1, after the early story.', text: 'One early Chapter 1 meditation spot disappears permanently once the chapter closes. The sources disagree on the exact place — PowerPyx says Jason\u2019s house, OutputLag and eGamers describe a balcony meditation early in Chapter 1 — so meditate at every spot the moment you see one, and keep a manual save at the start of every chapter.' },
    { id: 25, flag: 'TIME-SENSITIVE', ponr: 'Chapter 3 — the race against Yago.', text: 'The Strangers & Freaks silver needs 8 stranger strands, and the strand tied to the race against Yago closes mid-story in Chapter 3. Start every stranger strand the moment it appears; do not stockpile stranger missions for later.' },
    { id: 14, flag: 'TIME-SENSITIVE', ponr: 'Mid-story — optional missions close.', text: 'A Long Road (100% completion, gold) is time-sensitive because optional missions that feed the checklist close as the story advances. The checklist itself is forgiving — about 60% true completion is enough — but the optional missions behind it are not. Do optional content when it appears.' },
  ];
  document.getElementById('missCards').innerHTML = cards.map((c) => {
    const t = byId(c.id);
    return '<div class="miss-card"><span class="flag-red">' + c.flag + '</span> <span class="gchip ' + t.grade + '">' + t.grade + '</span>' +
      '<h2>' + esc(t.name) + '</h2><div class="ponr">POINT OF NO RETURN: ' + esc(c.ponr) + '</div>' +
      '<p>' + esc(c.text) + '</p>' +
      '<p class="src-line">Sources: PowerPyx, OutputLag, KeenGamer, eGamers — retrieved 2026-11-19.</p>' +
      '<button type="button" class="btn" data-open="' + t.id + '">Open the full guide</button></div>';
  }).join('');
  document.querySelectorAll('#missCards [data-open]').forEach((b) => {
    b.addEventListener('click', () => { selectTrophy(Number(b.getAttribute('data-open'))); switchTab('map'); });
  });
  const chapters = [['Chapter 1', 2], ['Chapter 2', 1], ['Chapter 3', 1], ['Chapter 4', 1], ['Final mission', 1], ['Side story', 7], ['Free roam', 14]];
  document.getElementById('hiddenPanel').innerHTML = '<h2>Hidden trophies, by chapter</h2>' +
    '<p class="src-line">28 trophies are hidden on PSN until earned. The bars below show how many are still hidden in each part of the run — not a list of names, so nothing is spoiled.</p>' +
    chapters.map(([label, total]) => {
      const hiddenIn = TROPHIES.filter((t) => t.hidden && !state.earned[t.id] && chapterOf(t) === label).length;
      const pct = total ? Math.round(((total - hiddenIn) / total) * 100) : 0;
      return '<div class="hidden-bar"><span class="lbl">' + esc(label) + '</span><span class="track"><span style="width:' + pct + '%"></span></span><span>' + (total - hiddenIn) + '/' + total + ' revealed</span></div>';
    }).join('');
}
function chapterOf(t) {
  if (t.id >= 2 && t.id <= 3) return 'Chapter 1';
  if (t.id === 4) return 'Chapter 2';
  if (t.id === 5) return 'Chapter 3';
  if (t.id === 6) return 'Chapter 4';
  if (t.id === 7) return 'Final mission';
  if (t.kind === 'Side story') return 'Side story';
  return 'Free roam';
}

function renderProgress() {
  const n = earnedCount();
  const p = pts();
  const pct = Math.round((n / 55) * 100);
  const ptsPct = Math.round((p / 1230) * 100);
  const gradeRows = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const total = TROPHIES.filter((t) => t.grade === g).length;
    const got = TROPHIES.filter((t) => t.grade === g && state.earned[t.id]).length;
    const w = total ? Math.round((got / total) * 100) : 0;
    return '<div class="bar-row"><span class="lbl">' + g + ' (' + POINTS[g] + ' pts)</span><span class="track"><span style="width:' + w + '%"></span></span><span>' + got + '/' + total + '</span></div>';
  }).join('');
  const kindRows = ['Story', 'Side story', 'Collectible', 'Activity', 'Crime', 'Money & grind', 'Misc', 'Platinum & 100%'].map((k) => {
    const total = TROPHIES.filter((t) => t.kind === k).length;
    const got = TROPHIES.filter((t) => t.kind === k && state.earned[t.id]).length;
    const w = total ? Math.round((got / total) * 100) : 0;
    return '<div class="bar-row"><span class="lbl">' + esc(k) + '</span><span class="track"><span style="width:' + w + '%"></span></span><span>' + got + '/' + total + '</span></div>';
  }).join('');
  const stageCells = STAGES.map((s) => {
    const items = TROPHIES.filter((t) => t.stage === s.n);
    const got = items.filter((t) => state.earned[t.id]).length;
    return '<div class="cell"><b>Stop ' + s.n + '</b>' + esc(s.title) + '<br>' + got + '/' + items.length + ' earned</div>';
  }).join('');
  const backup = state.lastExport
    ? '<p>Last export: <b>' + esc(state.lastExport.name) + '</b> · ' + esc(state.lastExport.when) + ' · ' + state.lastExport.count + ' trophies earned at export.</p>'
    : '<p>No export yet. Export writes a JSON file with your earned trophies and counters; import reads it back on any machine.</p>';
  document.getElementById('progressBody').innerHTML =
    '<div class="prog-big">' + fmt(p) + ' / 1,230 PSN pts · ' + ptsPct + '%</div>' +
    '<p class="src-line">Bronze 15 · Silver 30 · Gold 90 · Platinum 180 — 1 × 180 + 2 × 90 + 6 × 30 + 46 × 15 = 1,230 points. ' + n + '/55 trophies earned (' + pct + '%).</p>' +
    '<div class="prog-grid"><div class="prog-card"><h2>Earned by grade</h2>' + gradeRows + '</div>' +
    '<div class="prog-card"><h2>Earned by kind</h2>' + kindRows + '</div>' +
    '<div class="prog-card"><h2>Roadmap stages</h2><div class="stage-mini">' + stageCells + '</div></div>' +
    '<div class="prog-card"><h2>Backup</h2>' + backup +
    '<div class="earn-row"><button type="button" class="btn" id="exportBtn2">Export progress</button>' +
    '<button type="button" class="btn" id="importBtn2">Import progress</button>' +
    '<button type="button" class="btn" id="resetBtn">Reset progress</button></div></div></div>';
  document.getElementById('exportBtn2').addEventListener('click', doExport);
  document.getElementById('importBtn2').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Reset all progress in this browser?')) {
      state.earned = {}; state.counts = {}; state.lastExport = null;
      saveState(); renderAll();
    }
  });
}

function renderSources() {
  const citedBy = (n) => TROPHIES.filter((t) => t.sources.includes(n)).length;
  document.getElementById('sourceMatrix').innerHTML =
    '<table class="matrix"><tr><th>Source</th><th>Read</th><th>Guides</th><th>What it is</th></tr>' +
    SOURCES.map((s) => '<tr><td><b>[' + s.n + '] ' + esc(s.name) + '</b><br><a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.url.replace(/^https:\/\//, '')) + '</a></td><td>' + s.read + '</td><td>' + citedBy(s.n) + ' of 55</td><td>' + esc(s.note) + '</td></tr>').join('') + '</table>';
  document.getElementById('sourceRail').innerHTML = SOURCES.map((s) =>
    '<div class="src-item"><b>[' + s.n + '] ' + esc(s.name) + '</b> — ' + esc(s.title) +
    '<br><a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.url) + '</a>' +
    '<br><span class="src-line">Read ' + s.read + ' · cited by ' + citedBy(s.n) + ' of 55 guides · ' + esc(s.note) + '</span></div>').join('');
}

function doExport() {
  const data = { app: 'leonida-getaway', exportedAt: new Date().toISOString(), earned: Object.keys(state.earned).filter((k) => state.earned[k]).map(Number), counts: state.counts };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  const name = 'leonida-getaway-progress-' + new Date().toISOString().slice(0, 10) + '.json';
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  state.lastExport = { name, when: new Date().toLocaleString('en-GB'), count: earnedCount() };
  saveState(); renderAll();
}

function doImport(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (Array.isArray(data.earned)) {
        state.earned = {};
        data.earned.forEach((id) => { state.earned[id] = true; });
      }
      if (data.counts) state.counts = data.counts;
      saveState(); renderAll();
      alert('Progress imported: ' + earnedCount() + '/55 earned.');
    } catch (e) { alert('That file is not a valid Leonida Getaway export.'); }
  };
  reader.readAsText(file);
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.getAttribute('data-tab') === tab));
  document.querySelectorAll('.tab-page').forEach((p) => p.classList.toggle('active', p.id === 'page-' + tab));
  renderDetail();
}

function renderAll() {
  renderHeader();
  renderAudit();
  renderMap();
  renderChecklist();
  renderRoadmap();
  renderMissables();
  renderProgress();
  renderSources();
  renderDetail();
}

async function init() {
  loadState();
  const res = await fetch('data/trophies.json');
  const data = await res.json();
  TROPHIES = data.trophies;
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.addEventListener('click', () => switchTab(b.getAttribute('data-tab')));
  });
  document.getElementById('spoilerBtn').addEventListener('click', () => {
    state.spoilers = !state.spoilers;
    saveState(); renderAll();
  });
  document.getElementById('exportBtn').addEventListener('click', doExport);
  document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', (e) => {
    if (e.target.files[0]) doImport(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('searchBox').addEventListener('input', (e) => { searchText = e.target.value; renderChecklist(); });
  document.getElementById('orderSel').addEventListener('change', (e) => { orderMode = e.target.value; renderChecklist(); });
  document.getElementById('gradeSel').addEventListener('change', (e) => { gradeFilter = e.target.value; renderChecklist(); });
  document.getElementById('earnedOnly').addEventListener('change', (e) => { earnedOnly = e.target.checked; renderChecklist(); });
  document.getElementById('notEarned').addEventListener('change', (e) => { notEarned = e.target.checked; renderChecklist(); });
  renderAll();
}

init();
