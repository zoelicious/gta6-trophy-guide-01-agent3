/* LEONIDA GETAWAY — offline trophy guide + tracker. No network: data is local JSON. */
const $ = s => document.querySelector(s);
const LS_KEY = 'leonida-getaway-v1';
const POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
const TOTAL_POINTS = 1230;
const STOPS = [
  { n: 0, name: 'Before you start', hours: '~1 h', text: 'No cheats on your trophy save — they disable trophies and saving. Make a manual save at the start of every chapter, plus one before the final mission. Turn spoilers ON: 28 trophies are hidden on PSN until earned.' },
  { n: 1, name: 'Story · Chapters 1–4', hours: '~60–80 h', text: 'Play the story straight through. Meditate at EVERY spot the moment you see one — the early Chapter 1 spot is the game\u2019s one true missable. Scan vehicles and study animals as you go; both count toward 100%.' },
  { n: 2, name: 'Side story & strangers', hours: '~15 h', text: 'Finish the contact strands (Andy, Kenton, Billy, Randy, Tyrone), Bret\u2019s hunt, Cal\u2019s fishing challenge, and all 8 Strangers & Freaks strands. Start every stranger strand the moment it appears — the Chapter 3 race against Yago is time-sensitive.' },
  { n: 3, name: 'Activities', hours: '~12 h', text: 'Gold all 42 Shooting Range challenges, win drone races at all 14 locations, win 20 different races, finish an arcade game, bowl a game, and try all 9 activity types once.' },
  { n: 4, name: 'Collections & exploration', hours: '~10 h', text: 'Complete 3 card sets, WAiNK at 100 locations, discover 100 vehicles, and explore all 52 areas of Leonida. Check the meditation count — it should read 18/18 by now.' },
  { n: 5, name: 'Crime & combat', hours: '~15 h', text: 'Rob 5 bank vaults, an armored truck, 9 gang operations and a jewelry store without being detected; lose a 4-star wanted level with your partner; take down 5 enemies in one Combat Focus.' },
  { n: 6, name: 'Money & grind', hours: '~20 h', text: 'Launder $250,000 in Marked Bills, spend $100,000 across all shops, buy all 8 garages, register 10 vehicles to Scooter Bros, finish 50 challenges and 500 choices.' },
  { n: 7, name: 'Cleanup & platinum', hours: '~10 h', text: 'Check the 100% checklist (A Long Road, gold) — Robberies, Underwater Discoveries, Shooting Ranges, Drone Races and Bret\u2019s Quests must be fully done. Then the platinum, Vice Got a Price!, is yours.' },
];
const REGIONS = ['Vice City', 'Leonida Keys', 'Port Gellhorn', 'Mount Kalaga', 'Grassrivers', 'Ambrosia', 'Hamlet', 'Yorktown', 'Statewide'];
const KINDS = ['Story', 'Strand', 'Collectible', 'Activity', 'Crime', 'Money & grind', 'Misc', 'Platinum & 100%'];
/* Pin positions on the night map (viewBox 0 0 1000 800). 33 trophies have a place. */
const PINS = { 42: [180, 170], 43: [155, 225], 15: [290, 196], 38: [490, 166], 40: [455, 213], 48: [625, 217], 32: [700, 217], 55: [545, 255], 16: [455, 302], 33: [690, 298], 45: [765, 319], 47: [725, 344], 41: [145, 361], 36: [375, 353], 18: [570, 395], 31: [120, 438], 28: [230, 468], 34: [100, 480], 54: [640, 468], 17: [665, 510], 30: [500, 510], 19: [750, 502], 51: [715, 561], 37: [775, 536], 53: [800, 548], 39: [660, 608], 44: [800, 599], 46: [715, 638], 52: [775, 633], 21: [705, 582], 20: [300, 633], 29: [380, 650], 35: [460, 638] };
const WAYPOINTS = [[700, 587], [420, 340], [150, 366], [180, 170], [420, 153], [640, 196], [700, 298], [760, 612]];
const LABELS = [['MOUNT KALAGA', 175, 145], ['AMBROSIA', 420, 128], ['YORKTOWN', 645, 174], ['HAMLET', 705, 276], ['GRASSRIVERS', 350, 327], ['PORT GELLHORN', 140, 408], ['LEONIDA KEYS', 330, 595], ['VICE CITY', 735, 476]];
const WHERE = {
  1: 'Everywhere — earn the other 54 trophies first.', 2: 'Opening mission, Gone Fishing — the story\u2019s first mission.',
  3: 'Chapter 1 — finish the chapter; meditate at the early spot first.', 4: 'Chapter 2 — once Jason and Lucia can both be played.',
  5: 'Chapter 3 — heist trophies open here.', 6: 'Chapter 4 — late-story missions.',
  7: 'The final mission — save manually right before it.', 8: 'Story mission Breakfast Run.',
  9: 'Story mission The Cartel Heist (Chapter 3+).', 10: 'Story mission Child\u2019s Play.',
  11: 'Story mission Headliners.', 12: 'Story mission VCIA Takedown — around the airport.',
  13: 'Story mission Operation Savage Glory — late story.', 14: 'Progress > Stats > 100% Completion — after the story.',
  15: 'Anywhere with jumps, ramps and air — stunt jumps across Leonida.', 16: 'All 9 activity types, wherever they are offered.',
  17: 'Shooting Ranges across Leonida — all 42 challenges.', 18: 'Top Fun drone races — 14 locations across Leonida.',
  19: 'Races across Leonida — 20 different routes.', 20: 'Fishing challenge against Cal — through the side-story contacts.',
  21: 'An arcade cabinet in the city.', 22: 'Andy\u2019s strand — follow his missions to the finale.',
  23: 'Kenton\u2019s strand — follow his missions to the finale.', 24: 'Billy\u2019s strand — follow his missions to the finale.',
  25: '8 stranger strands across Leonida — start each the moment it appears.', 26: 'Randy\u2019s strand — follow his missions to the finale.',
  27: 'Tyrone\u2019s strand — follow his missions to the finale.', 28: '18 spots in 10 locations across Leonida — starting with one early spot in Chapter 1.',
  29: 'Bret\u2019s hunts — track the unique animal he names.', 30: 'Collectible cards scattered across Leonida — 3 full sets.',
  31: 'WAiNK at 100 locations across Leonida.', 32: 'Challenges everywhere — stunts, driving, combat and more.',
  33: 'With your partner — build a 4-star wanted level, then lose it together.', 34: 'With your partner — 3 shops back-to-back on one route.',
  35: 'Vehicles everywhere — scan each one you meet.', 36: 'Any crowded fight — 5 enemies in one Combat Focus.',
  37: 'Vice City International Airport — take a plane and go.', 38: 'Where the military keeps its Rhinos.',
  39: 'A jewelry store — go in quiet.', 40: 'Bank vaults across Leonida — 5 vaults, 5 escapes.',
  41: 'Armored truck routes through the city.', 42: 'All 52 areas of Leonida — cross every region.',
  43: 'Illegal operations — one per gang, 9 gangs.', 44: 'Ocean Beach — a cocktail with a view, early in the game.',
  45: 'A vehicle showroom — smash out in classic style.', 46: 'Kolt & Associates bowling alley.',
  47: 'With your partner — shared moments across story and free roam.', 48: 'Everywhere — choices accumulate as you play.',
  49: 'Unknown — a second attempt succeeding where the first did not.', 50: 'Unknown — a surprising or strange event somewhere in Leonida.',
  51: 'A melee drive-by that bowls people over.', 52: 'Through your contacts — launder Marked Bills from robberies and jobs.',
  53: 'All shops — weapons, clothes, cars and upgrades.', 54: 'Garage properties across Leonida — 8 deeds.',
  55: 'Scooter Bros app — register 10 vehicles you find.',
};
const MISSABLE_TEXT = {
  28: 'End of Chapter 1. The early spot is gone for good once Chapter 1 closes — no mission replay or New Game+ brings it back. Meditate at every spot the moment you see one.',
  25: 'Chapter 3 — the race against Yago. The strand tied to that race closes mid-story. Start every stranger strand the moment it appears; do not stockpile stranger missions for later.',
  14: 'Mid-story — optional missions close. Optional missions that feed the 100% checklist close as the story advances. Do optional content when it appears; the checklist bar itself is forgiving.',
};
const MISSABLE_CARDS = [
  { id: 28, flag: 'POSSIBLY MISSABLE', ponr: 'POINT OF NO RETURN: End of Chapter 1, after the early story.', text: 'One early Chapter 1 meditation spot disappears permanently once the chapter closes. The sources disagree on the exact spot — PowerPyx says Jason\u2019s house, OutputLag and eGamers describe a balcony meditation early in Chapter 1 — so meditate at every spot the moment you see one, and keep a manual save at the start of every chapter.', src: 'PowerPyx, OutputLag, KeenGamer, eGamers' },
  { id: 25, flag: 'TIME-SENSITIVE', ponr: 'POINT OF NO RETURN: Chapter 3 — the race against Yago.', text: 'The Strangers & Freaks silver needs 8 stranger strands, and the strand tied to the race against Yago closes mid-story in Chapter 3. Start every stranger strand the moment it appears; do not stockpile stranger missions for later.', src: 'PowerPyx, OutputLag, KeenGamer, eGamers' },
  { id: 14, flag: 'TIME-SENSITIVE', ponr: 'POINT OF NO RETURN: Mid-story — optional missions close.', text: 'A Long Road (100% completion, gold) is time-sensitive because optional missions that feed the checklist close as the story advances. The checklist itself is forgiving — about 60% \u2018true completion\u2019 is enough — but the optional missions behind it are not. Do optional content when it appears.', src: 'PowerPyx, OutputLag, KeenGamer, eGamers' },
];

let DATA = { trophies: [], steps: {}, sources: [] };
let state = null;
let revealed = new Set();
let tab = 'map';
let selected = 28;
let kindFilter = 'all';
let regionFilter = 'all';

function nowHM() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function demoState() { return { earned: [2, 3, 4, 5, 8, 21, 30, 48], counters: { '28': 6 }, spoilers: true, lastExport: null, savedAt: nowHM() }; }
function loadState() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) { const s = JSON.parse(raw); if (Array.isArray(s.earned)) return s; } } catch (e) {}
  const s = demoState(); saveState(s); return s;
}
function saveState(s) { state = s; state.savedAt = nowHM(); try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }
function trophy(id) { return DATA.trophies.find(t => t.id === id); }
function isEarned(id) { return state.earned.includes(id); }
function isMasked(t) { return state.spoilers && t.hidden && !isEarned(t.id) && !revealed.has(t.id); }
function gradeCount(g) { return DATA.trophies.filter(t => t.grade === g).length; }
function earnedByGrade(g) { return DATA.trophies.filter(t => t.grade === g && isEarned(t.id)).length; }
function points() { return DATA.trophies.filter(t => isEarned(t.id)).reduce((a, t) => a + POINTS[t.grade], 0); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function citeLinks(cites) { return cites.map(n => '[' + n + ']').join(' '); }

/* ---------- night map SVG ---------- */
function landSVG(route) {
  const roads = '<g stroke="#c9a227" stroke-width="1.4" opacity="0.45" fill="none">'
    + '<path d="M150,366 L420,340 L700,298"/><path d="M420,340 L420,153"/><path d="M420,340 L640,510"/>'
    + '<path d="M180,170 L420,153 L640,196"/><path d="M150,366 L230,468 L300,510"/><path d="M300,510 L480,544 L650,527"/></g>';
  const routePath = route ? '<path d="M700,587 L420,340 L150,366 L180,170 L420,153 L640,196 L700,298 L760,612" fill="none" stroke="#c9a227" stroke-width="2.5" stroke-dasharray="7 6"/>' : '';
  const labels = LABELS.map(([t, x, y]) => '<text x="' + x + '" y="' + y + '" fill="#e8e2d2" font-size="15" font-weight="700" letter-spacing="2.5" text-anchor="middle">' + t + '</text>').join('');
  return '<svg viewBox="0 0 1000 680" role="img" aria-label="Stylized night map of Leonida">'
    + '<rect width="1000" height="680" fill="#0e1a2e"/>'
    + '<path d="M70,255 L150,153 L350,102 L520,94 L700,128 L820,221 L860,357 L800,476 L650,527 L480,544 L300,510 L140,442 L70,357 Z" fill="#173f3c" stroke="#2e8b84" stroke-width="1.5"/>'
    + '<path d="M645,506 L775,497 L835,557 L805,642 L675,646 L625,582 Z" fill="#1d4a44" stroke="#2e8b84" stroke-width="1.5"/>'
    + '<g fill="#1d4a44" stroke="#2e8b84" stroke-width="1"><ellipse cx="270" cy="629" rx="70" ry="14"/><ellipse cx="400" cy="642" rx="80" ry="14"/><ellipse cx="520" cy="633" rx="60" ry="12"/></g>'
    + roads + routePath + labels
    + '<g transform="translate(920,62)"><circle r="27" fill="none" stroke="#c9a227" stroke-width="1.5"/><text x="0" y="-34" fill="#e8e2d2" font-size="14" font-weight="700" text-anchor="middle">N</text><path d="M0,-18 L8,12 L0,6 L-8,12 Z" fill="#c9a227"/></g>'
    + '</svg>';
}
function mapSVG() {
  let svg = landSVG(true);
  const pins = Object.entries(PINS).map(([id, [x, y]]) => {
    const t = trophy(+id); if (!t) return '';
    /* Purple pins are the two unconfirmed trophies with a place (44, 45); 51's panel still carries the unconfirmed flag. */
    const col = t.missable ? '#e5484d' : ([44, 45].includes(t.id) ? '#8b7bc7' : '#c9a227');
    const sel = +id === selected ? ' stroke="#fff" stroke-width="3"' : ' stroke="#0e1626" stroke-width="1.5"';
    return '<g data-pin="' + id + '" style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="13" fill="' + col + '"' + sel + '/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="' + (+id === selected ? '#fff' : '#14100a') + '">' + id + '</text></g>';
  }).join('');
  return svg.replace('</svg>', pins + '</svg>');
}
function roadmapSVG() {
  let svg = landSVG(true);
  const wps = WAYPOINTS.map(([x, y], i) => '<g data-wp="' + i + '" style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="15" fill="#c9a227" stroke="#0e1626" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#14100a">' + i + '</text></g>').join('');
  return svg.replace('</svg>', wps + '</svg>');
}

/* ---------- header / audit ---------- */
function renderHeader() {
  const earned = state.earned.length, total = DATA.trophies.length;
  const pct = Math.round(earned / total * 100);
  $('#headProgress').textContent = earned + '/' + total + ' · ' + pct + '%';
  $('#headPoints').textContent = points() + ' / ' + TOTAL_POINTS.toLocaleString('en-US') + ' PSN pts';
  $('#headGrades').innerHTML = ['platinum', 'gold', 'silver', 'bronze'].map(g =>
    '<span class="chip"><b>' + g[0].toUpperCase() + '</b> ' + earnedByGrade(g) + '/' + gradeCount(g) + '</span>').join('');
  $('#headBar').style.width = pct + '%';
  const hiddenLeft = DATA.trophies.filter(t => t.hidden && !isEarned(t.id)).length;
  $('#spoilerBtn').textContent = state.spoilers ? 'Spoilers hidden · ' + hiddenLeft : 'Spoilers shown';
  $('#savedLine').innerHTML = '✓ Saved in this browser · ' + state.savedAt;
}
function renderAudit() {
  $('#auditStrip').innerHTML = '<b>55 official</b> · 1P 2G 6S 46B · <b>28 hidden</b> · 55/55 guides cite a source · <b>165/165 steps cited</b> · 13 sources read 19–20 Nov 2026 · <b>1 possibly missable</b> · 2 time-sensitive watch · 5 unconfirmed · 1 dispute shown both ways';
}

/* ---------- detail panel ---------- */
function sourceByN(n) { return DATA.sources.find(s => s.n === n); }
function renderDetail(el) {
  const t = trophy(selected); if (!t) return;
  const masked = isMasked(t);
  const gname = { platinum: 'PLATINUM', gold: 'GOLD', silver: 'SILVER', bronze: 'BRONZE' }[t.grade];
  let h = '<div class="badges"><span class="badge ' + t.grade + '">' + gname + '</span>'
    + '<span class="badge plain">#' + t.id + ' of 55</span>'
    + '<span class="badge plain">' + esc(t.kind) + '</span>'
    + '<span class="badge plain">' + esc(t.region) + '</span>';
  if (t.missable === 'possibly') h += '<span class="badge miss">POSSIBLY MISSABLE</span>';
  if (t.missable === 'time-sensitive') h += '<span class="badge time">TIME-SENSITIVE</span>';
  if (t.unconfirmed) h += '<span class="badge unconf">TRIGGER NOT YET CONFIRMED</span>';
  h += '</div>';
  if (masked) {
    h += '<h3>Hidden story trophy</h3>'
      + '<div class="box"><h4>OFFICIAL DESCRIPTION</h4><p class="quote">Hidden on PSN — earn it to reveal.</p></div>'
      + '<p class="note">This trophy is hidden on PSN until earned. Its name and description stay masked while spoilers are hidden.</p>'
      + '<button class="btn" id="revealBtn-' + el.id + '" type="button">Reveal this trophy</button>';
    el.innerHTML = h;
    el.querySelector('#revealBtn-' + el.id).addEventListener('click', () => { revealed.add(t.id); renderAll(); });
    return;
  }
  h += '<h3>' + esc(t.name) + '</h3>'
    + '<div class="box"><h4>OFFICIAL DESCRIPTION</h4><p class="quote">\u201c' + esc(t.description) + '\u201d</p></div>';
  if (t.missable) {
    h += '<div class="box red"><h4>⚠ ' + (t.missable === 'possibly' ? 'POSSIBLY MISSABLE' : 'TIME-SENSITIVE') + ' — POINT OF NO RETURN</h4><p>' + esc(MISSABLE_TEXT[t.id]) + '</p></div>';
  }
  if (t.unconfirmed) {
    h += '<div class="box purple"><h4>TRIGGER NOT YET CONFIRMED</h4><p>Public guides have not pinned down how this trophy unlocks yet. Only what is known is written below — no unlock method is invented.</p></div>';
  }
  if (t.target) {
    const cur = state.counters[String(t.id)] || 0;
    const unit = t.unit === '%' ? '%' : '';
    h += '<div><div class="note" style="letter-spacing:1px;font-weight:700;color:var(--gold2)">YOUR COUNT</div><div class="stepper">'
      + '<button type="button" data-step="-1" aria-label="decrease">−</button>'
      + '<span class="n">' + cur + ' / ' + t.target.toLocaleString('en-US') + (unit ? '%' : '') + '</span>'
      + '<button type="button" data-step="1" aria-label="increase">+</button>'
      + '<span class="bar"><i style="width:' + Math.min(100, cur / t.target * 100) + '%"></i></span></div>'
      + '<p class="note">PSN tracks this count to ' + t.target.toLocaleString('en-US') + (unit ? '%' : '') + ' — use the stepper; it is saved in this browser.</p></div>';
  }
  const stop = STOPS[t.stop];
  h += '<div class="twocol"><div class="box"><h4>GETAWAY STOP · CHAPTER</h4><p>Stop ' + t.stop + ' · ' + esc(stop.name) + '<br>' + esc(t.chapter) + '</p></div>'
    + '<div class="box"><h4>WHERE · HOW</h4><p>' + esc(WHERE[t.id] || '') + '</p></div></div>';
  const steps = DATA.steps[t.id] || [];
  if (steps.length) {
    h += '<h4 style="margin:14px 0 2px;font-size:13px;letter-spacing:.5px">Steps — each step cited</h4><ol class="steps">'
      + steps.map((s, i) => '<li>' + esc(s.text) + ' <span class="cite">' + citeLinks(s.cites) + '</span></li>').join('') + '</ol>';
  }
  h += '<h4 style="margin:14px 0 2px;font-size:13px;letter-spacing:.5px">Guide — in our own words</h4><p>' + esc(t.guide) + '</p>';
  if (t.id === 28) {
    h += '<div class="box purple"><h4>SOURCES DISAGREE — BOTH VERSIONS SHOWN</h4>'
      + '<p><b>Version A — 18 spots</b> (PSN target 0/18; PowerPyx, OutputLag, eGamers, KeenGamer): there are 18 meditation spots in 10 locations across Leonida, and the PSN counter runs to 18. The early Chapter 1 spot is required — and it is gone once Chapter 1 closes.</p>'
      + '<p style="margin-top:8px"><b>Version B — 15 spots:</b> some guides count 15 meditation spots, and question whether the early Chapter 1 balcony spot is required at all. Our call: meditate at every spot you see, starting in Chapter 1 — the safe play covers both versions.</p></div>';
  }
  const srcs = (t.sources || []).map(sourceByN).filter(Boolean);
  h += '<h4 style="margin:14px 0 2px;font-size:13px;letter-spacing:.5px">Sources · rail [' + (t.sources || []).join(']–[') + '] · retrieved 2026-11-19/20</h4><ul class="srclist">'
    + srcs.map(s => '<li><span class="n">[' + s.n + ']</span> <a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.name) + ' — ' + esc(s.title) + '</a> · retrieved ' + s.read + '</li>').join('') + '</ul>';
  h += '<button class="btn markbtn' + (isEarned(t.id) ? ' earned' : '') + '" type="button">' + (isEarned(t.id) ? '✓ Earned — click to unmark' : 'Mark earned') + '</button>';
  el.innerHTML = h;
  el.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    const k = String(t.id); const cur = state.counters[k] || 0;
    state.counters[k] = Math.max(0, Math.min(t.target, cur + (+b.dataset.step)));
    saveState(state); renderAll();
  }));
  const mb = el.querySelector('.markbtn');
  if (mb) mb.addEventListener('click', () => { toggleEarned(t.id); });
}
function toggleEarned(id) {
  state.earned = isEarned(id) ? state.earned.filter(x => x !== id) : [...state.earned, id];
  saveState(state); renderAll();
}

/* ---------- map tab ---------- */
function renderMap() {
  $('#mapWrap').innerHTML = mapSVG();
  $('#mapWrap').querySelectorAll('[data-pin]').forEach(g => g.addEventListener('click', () => {
    selected = +g.dataset.pin; renderAll();
    document.querySelector('#detailMap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
  $('#regionChips').innerHTML = REGIONS.map(r => {
    const ts = DATA.trophies.filter(t => t.region === r);
    const e = ts.filter(t => isEarned(t.id)).length;
    return '<button class="region" data-region="' + esc(r) + '" type="button"><b>' + esc(r) + '</b><span>' + e + '/' + ts.length + '</span><span class="bar"><i style="width:' + (ts.length ? e / ts.length * 100 : 0) + '%"></i></span></button>';
  }).join('');
  $('#regionChips').querySelectorAll('[data-region]').forEach(b => b.addEventListener('click', () => {
    regionFilter = b.dataset.region; kindFilter = 'all'; switchTab('checklist'); $('#orderSel').value = 'region'; renderAll();
  }));
}

/* ---------- checklist tab ---------- */
function filteredTrophies() {
  let list = [...DATA.trophies];
  if (kindFilter === 'missable') list = list.filter(t => t.missable);
  else if (kindFilter !== 'all') list = list.filter(t => t.kind === kindFilter);
  if (regionFilter !== 'all') list = list.filter(t => t.region === regionFilter);
  const q = ($('#searchBox').value || '').trim().toLowerCase();
  if (q) list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  const g = $('#gradeSel').value;
  if (g !== 'all') list = list.filter(t => t.grade === g);
  if ($('#earnedOnly').checked) list = list.filter(t => isEarned(t.id));
  if ($('#notEarned').checked) list = list.filter(t => !isEarned(t.id));
  return list;
}
function renderChecklist() {
  const chips = [['all', 'All', 55], ...KINDS.map(k => [k, k, DATA.trophies.filter(t => t.kind === k).length]), ['missable', 'Missable', DATA.trophies.filter(t => t.missable).length]];
  $('#kindChips').innerHTML = chips.map(([v, label, n]) =>
    '<button class="fchip' + (kindFilter === v ? ' on' : '') + '" data-kind="' + esc(v) + '" type="button">' + esc(label) + ' ' + n + '</button>').join('')
    + (regionFilter !== 'all' ? ' <button class="fchip on" data-kind="__region" type="button">Region: ' + esc(regionFilter) + ' ✕</button>' : '');
  $('#kindChips').querySelectorAll('[data-kind]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.kind === '__region') { regionFilter = 'all'; }
    else { kindFilter = b.dataset.kind; }
    renderAll();
  }));
  const list = filteredTrophies();
  const order = $('#orderSel').value;
  let groups = [];
  if (order === 'roadmap') {
    groups = STOPS.filter(s => s.n > 0).map(s => ({ title: 'STOP ' + s.n + ' · ' + s.name.toUpperCase(), items: list.filter(t => t.stop === s.n) }));
  } else if (order === 'region') {
    groups = REGIONS.map(r => ({ title: r.toUpperCase(), items: list.filter(t => t.region === r) }));
  } else {
    groups = KINDS.map(k => ({ title: k.toUpperCase(), items: list.filter(t => t.kind === k) }));
  }
  groups = groups.filter(g => g.items.length);
  const shown = list.length;
  const filterDesc = (kindFilter === 'all' && regionFilter === 'all' && !$('#searchBox').value && $('#gradeSel').value === 'all' && !$('#earnedOnly').checked && !$('#notEarned').checked) ? 'no filter' : 'filtered';
  $('#statusLine').textContent = shown + ' of 55 shown · ' + state.earned.length + ' earned · ' + filterDesc + ' · Order: ' + order[0].toUpperCase() + order.slice(1);
  $('#checkGroups').innerHTML = groups.map(g => {
    const e = g.items.filter(t => isEarned(t.id)).length;
    return '<div class="group"><h3>' + esc(g.title) + '<span>' + e + '/' + g.items.length + ' earned</span></h3>'
      + g.items.map(t => {
        const masked = isMasked(t);
        const cnt = t.target ? '<span class="cnt">' + (state.counters[String(t.id)] || 0) + '/' + t.target.toLocaleString('en-US') + (t.unit === '%' ? '%' : '') + '</span>' : '';
        return '<div class="trow' + (t.id === selected ? ' sel' : '') + (masked ? ' masked' : '') + '" data-tid="' + t.id + '">'
          + '<input type="checkbox"' + (isEarned(t.id) ? ' checked' : '') + ' aria-label="mark earned">'
          + '<div><div class="nm">' + (masked ? 'Hidden story trophy' : esc(t.name)) + '<span class="g ' + t.grade[0].toUpperCase() + '">' + t.grade[0].toUpperCase() + '</span></div>'
          + '<div class="ds">' + (masked ? 'Hidden on PSN — earn it to reveal.' : esc(t.description)) + '</div></div>'
          + cnt + '<span class="kind">' + esc(t.kind) + '</span></div>';
      }).join('') + '</div>';
  }).join('') || '<p class="note">No trophies match this filter.</p>';
  $('#checkGroups').querySelectorAll('.trow').forEach(row => {
    const id = +row.dataset.tid;
    row.addEventListener('click', ev => {
      if (ev.target.tagName === 'INPUT') { toggleEarned(id); return; }
      selected = id; renderAll();
    });
  });
}

/* ---------- roadmap tab ---------- */
function renderRoadmap() {
  $('#roadmapMapWrap').innerHTML = roadmapSVG();
  $('#roadmapMapWrap').querySelectorAll('[data-wp]').forEach(g => g.addEventListener('click', () => {
    const card = document.querySelector('[data-stop="' + g.dataset.wp + '"]');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  $('#stopCards').innerHTML = STOPS.map(s => {
    const ts = DATA.trophies.filter(t => t.stop === s.n);
    const e = ts.filter(t => isEarned(t.id)).length;
    return '<div class="stopcard" data-stop="' + s.n + '"><h3>Stop ' + s.n + ' · ' + esc(s.name) + '</h3>'
      + '<div class="meta">' + s.hours + ' · ' + e + '/' + ts.length + ' trophies earned</div>'
      + '<p>' + esc(s.text) + '</p>'
      + (ts.length ? '<div class="tlist">' + ts.map(t => '<b>' + esc(t.name) + '</b>').join(' · ') + '</div><div class="bar"><i style="width:' + (e / ts.length * 100) + '%"></i></div>' : '')
      + '</div>';
  }).join('');
}

/* ---------- missables tab ---------- */
function renderMissables() {
  $('#missCards').innerHTML = MISSABLE_CARDS.map(c => {
    const t = trophy(c.id);
    return '<div class="misscard"><span class="flag">' + c.flag + '</span> <span class="badge ' + t.grade + '">' + t.grade.toUpperCase() + '</span>'
      + '<h3>' + esc(t.name) + '</h3><p class="ponr">' + c.ponr + '</p><p>' + c.text + '</p>'
      + '<p class="src">Sources: ' + c.src + ' — retrieved 2026-11-20.</p></div>';
  }).join('');
  const hidden = DATA.trophies.filter(t => t.hidden);
  const hiddenLeft = hidden.filter(t => !isEarned(t.id)).length;
  const groups = [
    ['CHAPTER 1', [2, 3]], ['CHAPTER 2', [4]], ['CHAPTER 3', [5]], ['CHAPTER 4', [6]],
    ['FINAL CHAPTER', [7]], ['STORY MISSIONS', [8, 9, 10, 11, 12, 13]],
    ['CHARACTER STRANDS', [22, 23, 24, 26, 27, 29]],
    ['SECRETS & FREE ROAM', [20, 25, 33, 34, 44, 45, 47, 49, 50, 51]],
  ];
  let h = '<h3>Hidden trophies — spoiler mode ' + (state.spoilers ? 'ON' : 'OFF') + ' · ' + hiddenLeft + ' of 28 masked until earned</h3>'
    + '<p class="note">28 of the 55 trophies are hidden on PSN until earned. With spoilers hidden they appear as masked bars, grouped by chapter — never as a wall of repeated cards.</p>';
  for (const [label, ids] of groups) {
    const e = ids.filter(id => isEarned(id)).length;
    h += '<div class="hgroup">' + label + ' · ' + e + '/' + ids.length + '</div>';
    for (const id of ids) {
      const t = trophy(id);
      h += isEarned(id)
        ? '<div class="hbar">✓ ' + esc(t.name) + '</div>'
        : '<div class="hbar masked">Hidden story trophy — earn it to reveal</div>';
    }
  }
  $('#hiddenPanel').innerHTML = h;
}

/* ---------- progress tab ---------- */
function renderProgress() {
  const pts = points();
  $('#psnBig').innerHTML = pts.toLocaleString('en-US') + ' / 1,230 pts <span>· ' + Math.round(pts / TOTAL_POINTS * 100) + '%</span>';
  $('#byGrade').innerHTML = ['platinum', 'gold', 'silver', 'bronze'].map(g =>
    '<div class="bar-row"><span>' + g[0].toUpperCase() + g.slice(1) + '</span><span class="bar"><i class="gold" style="width:' + (earnedByGrade(g) / gradeCount(g) * 100) + '%"></i></span><span class="num">' + earnedByGrade(g) + '/' + gradeCount(g) + '</span></div>').join('');
  $('#byKind').innerHTML = KINDS.map(k => {
    const ts = DATA.trophies.filter(t => t.kind === k);
    const e = ts.filter(t => isEarned(t.id)).length;
    return '<div class="bar-row"><span>' + esc(k) + '</span><span class="bar"><i style="width:' + (e / ts.length * 100) + '%"></i></span><span class="num">' + e + '/' + ts.length + '</span></div>';
  }).join('');
  $('#stageGrid').innerHTML = STOPS.map(s => {
    const ts = DATA.trophies.filter(t => t.stop === s.n);
    const e = ts.filter(t => isEarned(t.id)).length;
    return '<div class="stagecell"><b>Stop ' + s.n + '</b><span class="num">' + e + '/' + ts.length + '</span><br><span style="color:var(--muted)">' + esc(s.name) + '</span></div>';
  }).join('');
  $('#backupMeta').textContent = state.lastExport
    ? 'Last export ' + state.lastExport.name + ' · ' + state.lastExport.count + ' trophies · ' + state.lastExport.at
    : 'No export yet — export once to see the file name here.';
}

/* ---------- sources tab ---------- */
function renderSources() {
  const citedBy = {};
  DATA.sources.forEach(s => citedBy[s.n] = 0);
  Object.values(DATA.steps).forEach(list => {
    const seen = new Set();
    list.forEach(st => st.cites.forEach(n => seen.add(n)));
    seen.forEach(n => citedBy[n] = (citedBy[n] || 0) + 1);
  });
  $('#matrixBody').innerHTML = DATA.sources.map(s =>
    '<tr><td><a href="' + s.url + '" target="_blank" rel="noopener"><b>[' + s.n + '] ' + esc(s.name) + '</b></a><br><span style="color:var(--muted)">' + esc(s.title) + '</span></td>'
    + '<td class="num">' + s.read + '</td><td class="num">cited by ' + (citedBy[s.n] || 0) + ' of 55 guides</td>'
    + '<td>' + esc(s.reliability) + '</td></tr>').join('');
}

/* ---------- tabs / export / import ---------- */
function switchTab(name) {
  tab = name;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  document.querySelectorAll('.tabpane').forEach(p => p.classList.toggle('on', p.id === 'tab-' + name));
  location.hash = name === 'map' && selected === 28 ? 'map' : name + '/' + selected;
}
function renderAll() {
  renderHeader(); renderAudit(); renderMap(); renderDetail($('#detailMap')); renderChecklist(); renderDetail($('#detailList')); renderRoadmap(); renderMissables(); renderProgress(); renderSources();
}
function exportProgress() {
  const data = { format: 'leonida-getaway-progress/v1', exportedAt: new Date().toISOString(), earned: state.earned, counters: state.counters, spoilers: state.spoilers };
  const d = new Date();
  const name = 'gta6-trophy-progress-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '.json';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
  state.lastExport = { name, count: state.earned.length, at: nowHM() };
  saveState(state); renderAll();
}
function importProgress(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!Array.isArray(d.earned)) throw new Error('bad file');
      state.earned = d.earned.filter(id => trophy(id));
      state.counters = d.counters || {};
      state.spoilers = d.spoilers !== false;
      saveState(state); renderAll();
    } catch (e) { alert('That file is not a LEONIDA GETAWAY progress export.'); }
  };
  r.readAsText(file);
}
function route() {
  const h = (location.hash || '#map').slice(1).split('/');
  const t = ['map', 'checklist', 'roadmap', 'missables', 'progress', 'sources'].includes(h[0]) ? h[0] : 'map';
  const id = parseInt(h[1], 10);
  if (id && trophy(id)) selected = id;
  tab = t;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  document.querySelectorAll('.tabpane').forEach(p => p.classList.toggle('on', p.id === 'tab-' + t));
}

async function init() {
  const [tr, st, so] = await Promise.all([
    fetch('data/trophies.json').then(r => r.json()),
    fetch('data/steps.json').then(r => r.json()),
    fetch('data/sources.json').then(r => r.json()),
  ]);
  DATA.trophies = tr.trophies;
  DATA.steps = {}; st.steps.forEach(s => DATA.steps[s.id] = s.steps);
  DATA.sources = so.sources;
  state = loadState();
  document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => { switchTab(b.dataset.tab); renderAll(); }));
  $('#spoilerBtn').addEventListener('click', () => { state.spoilers = !state.spoilers; saveState(state); renderAll(); });
  $('#exportBtn').addEventListener('click', exportProgress);
  $('#exportBtn2').addEventListener('click', exportProgress);
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importBtn2').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', e => { if (e.target.files[0]) importProgress(e.target.files[0]); e.target.value = ''; });
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all progress to zero? This clears your earned trophies and counters in this browser.')) return;
    state = { earned: [], counters: {}, spoilers: true, lastExport: null, savedAt: nowHM() };
    saveState(state); renderAll();
  });
  ['searchBox', 'orderSel', 'gradeSel', 'earnedOnly', 'notEarned'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => renderChecklist());
    document.getElementById(id).addEventListener('change', () => renderChecklist());
  });
  window.addEventListener('hashchange', () => { route(); renderAll(); });
  route();
  renderAll();
}
init();
