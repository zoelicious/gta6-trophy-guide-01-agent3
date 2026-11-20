// LEONIDA GETAWAY — GTA VI PS5 trophy guide + tracker.
// Offline static app: reads app/data/trophies.json, keeps progress in localStorage,
// exports / imports progress as JSON. No network requests besides the local data file.
const KEY = 'leonida-getaway-v1';
const POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };

const STAGES = [
  { n: 0, title: 'Before you start', hours: '~1 h', text: 'No cheats on the trophy save — cheats disable trophies. Make a manual save at the start of every chapter and one before the final mission: there is no mission replay and no New Game+. Turn the spoiler shield on for the 28 hidden trophies.' },
  { n: 1, title: 'Story, Chapters 1–4', hours: '~60–80 h', text: 'Play the story through. Meditate at every spot the moment you see one — the Chapter 1 spot is gone for good once that chapter ends. Scan vehicles and study animals while you travel; both count toward 100%.' },
  { n: 2, title: 'Side story & strangers', hours: '~15 h', text: 'Finish the 8 stranger strands and the final mission of each contact — Andy, Kenton, Billy, Randy, Tyrone — plus Bret’s hunt and Cal’s fishing challenge. Start stranger markers the moment they appear; the Chapter 3 race against Yago can close.' },
  { n: 3, title: 'Activities & sport', hours: '~20 h', text: 'Gold all 42 Shooting Range challenges, win the Top Fun drone race at all 14 locations, win 20 different races, and try all 9 activity types. Ranges and drone races must be fully done for 100%.' },
  { n: 4, title: 'Collections & exploring', hours: '~25 h', text: 'Meditation spots (18/18), 3 card sets, WAiNK at 100 locations, 100 vehicles discovered, all 52 areas of Leonida. Sweep region by region on the map and tick each region off.' },
  { n: 5, title: 'Crime & combat', hours: '~15 h', text: 'Bank vaults, armored truck, one illegal operation per gang, the jewelry store without being seen, Combat Focus (5 enemies in one use), VCIA, the Rhino tanks, and the partner wanted-level jobs. Warning: a Criminal Profile of “Irredeemable” is permanent.' },
  { n: 6, title: 'Money & grind', hours: '~30 h', text: 'Launder $250,000 of Marked Bills, spend $100,000 across shops, buy all 8 garages, register 10 vehicles in the Scooter Bros app, finish 50 challenges and 500 choices. The long counters fill while you do everything else.' },
  { n: 7, title: 'Cleanup & platinum', hours: '~10 h', text: 'Check the 100% checklist (Progress, Stats, 100% Completion), mop up the five trophies whose triggers are not yet confirmed in public guides, then A Long Road (gold) and the platinum, Vice Got a Price!' },
];

const REGIONS = {
  'Vice City': { x: 700, y: 320, rx: 150, ry: 105 },
  'Leonida Keys': { x: 700, y: 555, rx: 80, ry: 30 },
  'Port Gellhorn': { x: 185, y: 330, rx: 75, ry: 55 },
  'Mount Kalaga': { x: 360, y: 150, rx: 75, ry: 45 },
  'Grassrivers': { x: 450, y: 480, rx: 80, ry: 45 },
  'Ambrosia': { x: 560, y: 170, rx: 60, ry: 40 },
  'Hamlet': { x: 330, y: 330, rx: 55, ry: 45 },
  'Yorktown': { x: 700, y: 150, rx: 60, ry: 40 },
};

const HIDDEN_GROUPS = [
  ['Chapter 1', [2, 3]], ['Chapter 2', [4]], ['Chapter 3', [5]], ['Chapter 4', [6]],
  ['Finale', [7]], ['Story missions', [8, 9, 10, 11, 12, 13]],
  ['Side story', [22, 23, 24, 25, 26, 27, 29]],
  ['Misc moments', [44, 45, 47, 49, 50, 51]], ['Crime', [33, 34, 37]],
];

const META_CHIPS = [
  ['~200 h to platinum', 1], ['4/10 difficulty', 1], ['1 playthrough', 1],
  ['0 online trophies', 1], ['No mission replay', 1], ['No New Game+', 1],
  ['Cheats disable trophies', 1], ['Free roam after story', 2],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $ = (id) => document.getElementById(id);

let doc = null;
let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return {
        earned: Array.isArray(s.earned) ? s.earned : [],
        counts: s.counts || {},
        spoilers: s.spoilers !== false,
        revealed: s.revealed || {},
        selected: typeof s.selected === 'number' ? s.selected : 28,
        lastExport: s.lastExport || null,
        savedAt: s.savedAt || null,
      };
    }
  } catch { /* corrupted state: start fresh */ }
  return { earned: [], counts: {}, spoilers: true, revealed: {}, selected: 28, lastExport: null, savedAt: null };
}

function save() {
  state.savedAt = new Date().toISOString();
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
  const t = new Date(state.savedAt);
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  $('saved-note').textContent = `✓ Saved in this browser · ${hh}:${mm}`;
}

const byId = (id) => doc.trophies.find((t) => t.id === id);
const isEarned = (t) => state.earned.includes(t.id);
const isMasked = (t) => t.hidden && state.spoilers && !isEarned(t) && !state.revealed[t.id];
const countOf = (t) => (t.target ? (state.counts[t.id] || 0) : 0);
const srcById = (id) => doc.sources.find((s) => s.id === id);

function toggleEarned(id, on) {
  const i = state.earned.indexOf(id);
  if (on && i === -1) state.earned.push(id);
  if (!on && i !== -1) state.earned.splice(i, 1);
  save(); renderAll();
}

function setCount(id, n) {
  const t = byId(id);
  state.counts[id] = Math.max(0, Math.min(t.target, n));
  if (state.counts[id] >= t.target && !state.earned.includes(id)) state.earned.push(id);
  if (state.counts[id] < t.target && state.earned.includes(id) && t.target) {
    // keep the tick if the player earned it some other way: do not auto-untick
  }
  save(); renderAll();
}

function selectTrophy(id, switchTab) {
  state.selected = id;
  save();
  renderDetail();
  renderMapSelection();
  if (switchTab) showTab('map');
  const d = $('detail');
  if (d) d.scrollIntoView({ block: 'nearest' });
}

function showTab(name) {
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tabpage').forEach((s) => s.classList.toggle('active', s.id === 'tab-' + name));
  if (name === 'checklist') renderChecklist();
  if (name === 'roadmap') renderRoadmap();
  if (name === 'missables') renderMissables();
  if (name === 'progress') renderProgress();
  if (name === 'sources') renderSources();
}

function renderAll() {
  renderHeader();
  renderAudit();
  renderRegions();
  renderDetail();
  renderMapSelection();
  renderChecklist();
  renderRoadmap();
  renderMissables();
  renderProgress();
  renderSources();
}

function renderHeader() {
  const n = state.earned.length;
  const pct = Math.round((n / 55) * 100);
  $('head-progress').innerHTML = `${n}/55 · <span class="pct">${pct}%</span>`;
  const g = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const tot = { platinum: 1, gold: 2, silver: 6, bronze: 46 };
  for (const t of doc.trophies) if (isEarned(t)) g[t.grade]++;
  $('head-grades').innerHTML =
    `<span class="chip">P ${g.platinum}/${tot.platinum}</span>` +
    `<span class="chip">G ${g.gold}/${tot.gold}</span>` +
    `<span class="chip">S ${g.silver}/${tot.silver}</span>` +
    `<span class="chip">B ${g.bronze}/${tot.bronze}</span>`;
  const hiddenLeft = doc.trophies.filter((t) => t.hidden && !isEarned(t) && !state.revealed[t.id]).length;
  $('spoiler-toggle').textContent = state.spoilers ? `Spoilers hidden · ${hiddenLeft}` : 'Spoilers shown';
  if (state.savedAt) {
    const t = new Date(state.savedAt);
    $('saved-note').textContent = `✓ Saved in this browser · ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
  } else {
    $('saved-note').textContent = 'No progress saved yet';
  }
}

function renderAudit() {
  const steps = doc.trophies.reduce((a, t) => a + t.steps.length, 0);
  const cited = doc.trophies.reduce((a, t) => a + t.steps.filter((s) => s.c && s.c.length).length, 0);
  const guided = doc.trophies.filter((t) => t.sources && t.sources.length).length;
  const poss = doc.trophies.filter((t) => t.missable === 'possibly').length;
  const ts = doc.trophies.filter((t) => t.missable === 'time-sensitive').length;
  const unc = doc.trophies.filter((t) => t.unconfirmed).length;
  const dis = doc.trophies.filter((t) => t.dispute).length;
  $('audit-strip').innerHTML =
    `<b>55</b> official · <b>1P 2G 6S 46B</b> · <b>28</b> hidden · ` +
    `<b>${guided}/55</b> guides cite a source · <b>${cited}/${steps}</b> steps cited · ` +
    `<b>${doc.sources.length}</b> sources read 19/20 Nov 2026 · <b>${poss}</b> possibly missable · ` +
    `<b>${ts}</b> time-sensitive · <b>${unc}</b> unconfirmed · <b>${dis}</b> dispute shown both ways`;
}

function pinXY(t) {
  const r = REGIONS[t.region] || REGIONS['Vice City'];
  const dx = (((t.id * 67) % (r.rx * 2)) - r.rx) * 0.85;
  const dy = (((t.id * 41) % (r.ry * 2)) - r.ry) * 0.85;
  return [Math.round(r.x + dx), Math.round(r.y + dy)];
}

function renderMap() {
  const pinTrophies = doc.trophies.filter((t) => t.category !== 'Story' && t.category !== 'Platinum & meta');
  const gradeFill = { bronze: '#b08d57', silver: '#c8ccd2', gold: '#c9a227', platinum: '#e8ecff' };
  let pins = '';
  for (const t of pinTrophies) {
    const [x, y] = pinXY(t);
    const miss = t.missable === 'possibly' || t.missable === 'time-sensitive';
    pins += `<g class="pin" data-id="${t.id}" style="cursor:pointer">` +
      `<circle cx="${x}" cy="${y}" r="9" fill="${gradeFill[t.grade]}" stroke="${miss ? '#e05252' : '#0e1626'}" stroke-width="${miss ? 3 : 1.5}"/>` +
      `<text x="${x}" y="${y + 2.5}" text-anchor="middle" font-size="8" font-weight="700" fill="#0e1626">${t.id}</text>` +
      `<title>${esc(t.name)}</title></g>`;
  }
  const waypoints = [[700, 320], [520, 300], [360, 330], [280, 190], [430, 140], [600, 160], [700, 240], [760, 560]];
  let stops = '';
  waypoints.forEach(([x, y], i) => {
    stops += `<g style="cursor:pointer"><circle cx="${x}" cy="${y}" r="13" fill="#0e1626" stroke="#c9a227" stroke-width="2.5"/>` +
      `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#e3c25a">${i}</text></g>`;
  });
  $('mapbox').innerHTML =
    `<svg viewBox="0 0 1000 640" role="img" aria-label="Stylized map of Leonida with the getaway route">` +
    `<rect width="1000" height="640" fill="#0a1424"/>` +
    `<path d="M120,300 C140,180 260,110 420,100 C560,90 720,120 830,200 C900,250 920,330 880,420 C840,510 740,560 620,570 C480,580 300,560 210,480 C140,420 100,380 120,300 Z" fill="#174f4a" stroke="#2a8a82" stroke-width="2"/>` +
    `<ellipse cx="690" cy="600" rx="90" ry="16" fill="#174f4a" stroke="#2a8a82" stroke-width="1.5"/>` +
    `<ellipse cx="800" cy="585" rx="55" ry="12" fill="#174f4a" stroke="#2a8a82" stroke-width="1.5"/>` +
    `<path d="M700,320 L520,300 L360,330 L280,190 L430,140 L600,160 L700,240 L640,420 L760,560" fill="none" stroke="#c9a227" stroke-width="3" stroke-dasharray="9 7"/>` +
    `<g font-size="13" font-weight="700" letter-spacing="2" fill="#f2ead8">` +
    `<text x="330" y="115" text-anchor="middle">MOUNT KALAGA</text>` +
    `<text x="640" y="120" text-anchor="middle">AMBROSIA</text>` +
    `<text x="800" y="140" text-anchor="middle">YORKTOWN</text>` +
    `<text x="170" y="420" text-anchor="middle">PORT GELLHORN</text>` +
    `<text x="300" y="410" text-anchor="middle">HAMLET</text>` +
    `<text x="815" y="205" text-anchor="middle">VICE CITY</text>` +
    `<text x="450" y="545" text-anchor="middle">GRASSRIVERS</text>` +
    `<text x="575" y="605" text-anchor="middle">LEONIDA KEYS</text></g>` +
    pins + stops +
    `<g><circle cx="800" cy="585" r="10" fill="#c9a227"/><text x="800" y="589" text-anchor="middle" font-size="11" font-weight="800" fill="#0e1626">★</text></g>` +
    `</svg>`;
  document.querySelectorAll('#mapbox .pin').forEach((el) => {
    el.addEventListener('click', () => selectTrophy(Number(el.dataset.id), false));
  });
}

function renderMapSelection() {
  document.querySelectorAll('#mapbox .pin').forEach((g) => {
    const t = byId(Number(g.dataset.id));
    const on = t.id === state.selected;
    const miss = t.missable === 'possibly' || t.missable === 'time-sensitive';
    const c = g.querySelector('circle');
    c.setAttribute('stroke', on ? '#e3c25a' : (miss ? '#e05252' : '#0e1626'));
    c.setAttribute('stroke-width', on ? 4 : (miss ? 3 : 1.5));
  });
}

function renderRegions() {
  $('region-cards').innerHTML = Object.keys(REGIONS).map((name) => {
    const list = doc.trophies.filter((t) => t.region === name);
    const got = list.filter(isEarned).length;
    return `<button class="region" type="button" data-region="${esc(name)}"><b>${esc(name)}</b><span>${got}/${list.length} earned</span></button>`;
  }).join('');
  document.querySelectorAll('.region').forEach((el) => {
    el.addEventListener('click', () => {
      $('f-order').value = 'region';
      showTab('checklist');
      renderChecklist();
    });
  });
}

function flagHtml(t) {
  let out = '';
  if (t.missable === 'possibly') out += '<span class="flag">POSSIBLY MISSABLE</span> ';
  if (t.missable === 'time-sensitive') out += '<span class="flag time">TIME-SENSITIVE</span> ';
  if (t.missable === 'watch') out += '<span class="flag watch">WATCH — DO IT EARLY</span> ';
  if (t.unconfirmed) out += '<span class="flag unconf">TRIGGER NOT YET CONFIRMED</span>';
  return out;
}

function renderDetail() {
  const t = byId(state.selected) || byId(28);
  const el = $('detail');
  if (isMasked(t)) {
    el.innerHTML =
      `<div class="kicker">#${t.id} OF 55 · ${esc(t.category.toUpperCase())}</div>` +
      `<h2>Hidden trophy — hidden until earned</h2>` +
      `<p class="meta">${esc(t.grade.toUpperCase())} · ${esc(t.region)} · Roadmap stop ${t.stage}</p>` +
      `<div class="box"><h4>SPOILER SHIELD</h4><p>This is a hidden story trophy. Its name and guide stay hidden until you earn it — or until you reveal it here.</p></div>` +
      `<div class="btnrow"><button id="btn-reveal" type="button">Reveal this trophy</button></div>`;
    $('btn-reveal').addEventListener('click', () => { state.revealed[t.id] = true; save(); renderAll(); });
    return;
  }
  const srcs = (t.sources || []).map(srcById).filter(Boolean);
  const stage = STAGES[t.stage];
  let html =
    `<div class="kicker">#${t.id} OF 55 · ${esc(t.category.toUpperCase())}</div>` +
    `<h2>${esc(t.name)}</h2>` + flagHtml(t) +
    `<p class="meta">${esc(t.grade.toUpperCase())} · ${esc(t.region)} · Roadmap stop ${t.stage}${t.target ? ` · Target ${t.target} ${esc(t.targetLabel)}` : ''}</p>`;
  if (t.target) {
    html += `<div class="stepper"><span class="lbl">YOUR COUNT</span>` +
      `<button id="cnt-minus" type="button" aria-label="Decrease count">−</button>` +
      `<span class="count">${countOf(t)}/${t.target}</span>` +
      `<button id="cnt-plus" type="button" aria-label="Increase count">+</button>` +
      `<span class="lbl">${esc(t.targetLabel)}</span>` +
      `<label class="earned"><input id="chk-earned" type="checkbox" ${isEarned(t) ? 'checked' : ''}> Earned</label></div>`;
  } else {
    html += `<div class="stepper"><span class="lbl">TRACKER</span><label class="earned"><input id="chk-earned" type="checkbox" ${isEarned(t) ? 'checked' : ''}> Earned</label></div>`;
  }
  if (t.dispute) {
    html += `<div class="box dispute"><h4>${esc(t.dispute.title)}</h4><p><b>Version A [1]:</b> ${esc(t.dispute.a.replace(/^Version A \[1\]: /, ''))}</p><p><b>Version B [2][5]:</b> ${esc(t.dispute.b.replace(/^Version B \[2\]\[5\]: /, ''))}</p><p>${esc(t.dispute.call)}</p></div>`;
  }
  html += `<div class="box"><h4>OFFICIAL DESCRIPTION</h4><p>“${esc(t.description)}”</p></div>`;
  html += `<div class="box"><h4>ROADMAP STAGE · CHAPTER</h4><p>Stop ${t.stage} — ${esc(stage.title)} · ${t.chapter ? esc(t.chapter) : 'Free roam'}.</p></div>`;
  html += `<div class="box"><h4>WHERE / HOW — IN OUR OWN WORDS</h4><p>${esc(t.guide)}</p></div>`;
  html += `<h4 style="color:var(--gold2);font-size:12px;letter-spacing:1px;margin:0 0 6px">STEPS</h4><ol class="steps">` +
    t.steps.map((s) => `<li>${esc(s.t)} <span class="cite">[${s.c.join('][')}]</span></li>`).join('') + `</ol>`;
  html += `<div class="box"><h4>SOURCES</h4><ul class="srclist">` +
    srcs.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">[${s.id}] ${esc(s.name)}</a> — ${esc(s.title)} <span class="ret">retrieved ${esc(s.read)}</span></li>`).join('') +
    `</ul></div>`;
  el.innerHTML = html;
  const chk = $('chk-earned');
  if (chk) chk.addEventListener('change', () => toggleEarned(t.id, chk.checked));
  const minus = $('cnt-minus');
  if (minus) minus.addEventListener('click', () => setCount(t.id, countOf(t) - 1));
  const plus = $('cnt-plus');
  if (plus) plus.addEventListener('click', () => setCount(t.id, countOf(t) + 1));
}

function groupLabel(t, order) {
  if (order === 'roadmap') return `Stop ${t.stage} — ${STAGES[t.stage].title}`;
  if (order === 'region') return t.region;
  return t.category;
}

function groupOrder(order) {
  if (order === 'roadmap') return [0, 1, 2, 3, 4, 5, 6, 7].map((n) => `Stop ${n} — ${STAGES[n].title}`);
  if (order === 'region') return Object.keys(REGIONS);
  return ['Platinum & meta', 'Story', 'Side story', 'Activities', 'Collections', 'Crime', 'Money & grind', 'Misc'];
}

function renderChecklist() {
  const q = ($('q').value || '').toLowerCase();
  const kind = $('f-kind').value;
  const grade = $('f-grade').value;
  const cat = $('f-cat').value;
  const order = $('f-order').value;
  const onlyEarned = $('f-earned').checked;
  const onlyNot = $('f-notyet').checked;
  let list = doc.trophies.filter((t) => {
    if (q && !t.name.toLowerCase().includes(q)) return false;
    if (kind !== 'all' && t.kind !== kind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (cat !== 'all' && t.category !== cat) return false;
    if (onlyEarned && !isEarned(t)) return false;
    if (onlyNot && isEarned(t)) return false;
    return true;
  });
  const groups = {};
  for (const t of list) {
    const g = groupLabel(t, order);
    (groups[g] = groups[g] || []).push(t);
  }
  let html = '';
  for (const g of groupOrder(order)) {
    const items = groups[g];
    if (!items || !items.length) continue;
    const got = items.filter(isEarned).length;
    html += `<div class="grouphead">${esc(g)} — ${got}/${items.length}</div>`;
    for (const t of items) {
      const masked = isMasked(t);
      const right = `#${t.id}<br>${esc(t.region)}<br>Stop ${t.stage}`;
      html += `<div class="trow" data-id="${t.id}"><input type="checkbox" ${isEarned(t) ? 'checked' : ''} aria-label="Earned">` +
        `<div><span class="nm">${masked ? 'Hidden trophy — hidden until earned' : esc(t.name)}</span><span class="grade ${t.grade}">${t.grade.toUpperCase()}</span>` +
        `<div class="ds">${masked ? 'Story trophy. Earn it, or reveal it from its detail panel.' : esc(t.description)}</div></div>` +
        `<div class="rt">${right}</div></div>`;
    }
  }
  if (!html) html = '<p class="lede">No trophies match those filters.</p>';
  $('checklist').innerHTML = html;
  document.querySelectorAll('#checklist .trow').forEach((row) => {
    const id = Number(row.dataset.id);
    row.querySelector('input').addEventListener('change', (e) => { e.stopPropagation(); toggleEarned(id, e.target.checked); });
    row.addEventListener('click', (e) => { if (e.target.tagName !== 'INPUT') selectTrophy(id, true); });
  });
}

function renderRoadmap() {
  $('meta-chips').innerHTML = META_CHIPS.map(([label, c]) => `<span class="chip">${esc(label)} <span class="cite">[${c}]</span></span>`).join('');
  $('stage-cards').innerHTML = STAGES.map((s) => {
    const list = doc.trophies.filter((t) => t.stage === s.n);
    const got = list.filter(isEarned).length;
    const pct = list.length ? Math.round((got / list.length) * 100) : 0;
    const names = list.slice(0, 4).map((t) => `<li>${isMasked(t) ? 'Hidden trophy' : esc(t.name)}${isEarned(t) ? ' ✓' : ''}</li>`).join('');
    const more = list.length > 4 ? `<li>…and ${list.length - 4} more</li>` : '';
    return `<div class="stage" data-stage="${s.n}"><h3>Stop ${s.n} — ${esc(s.title)}</h3><div class="hrs">${esc(s.hours)} · ${got}/${list.length} trophies</div>` +
      `<div class="bar teal"><i style="width:${pct}%"></i></div><p>${esc(s.text)}</p><ul>${names}${more}</ul></div>`;
  }).join('');
  document.querySelectorAll('.stage').forEach((el) => {
    el.addEventListener('click', () => { $('f-order').value = 'roadmap'; showTab('checklist'); });
  });
}

function renderMissables() {
  const card = (t, ponr, text) => {
    const srcNames = (t.sources || []).map(srcById).filter(Boolean).map((s) => s.name).join(', ');
    return `<div class="ponrcard" data-id="${t.id}"><h3>#${t.id} ${esc(t.name)}</h3><div class="ponrline">${esc(ponr)}</div><p>${esc(text)}</p>` +
      `<div class="srcs">${t.sources.length} sources: ${esc(srcNames)}. <a href="#" class="open-guide">Open the guide ›</a></div></div>`;
  };
  $('ponr-cards').innerHTML =
    card(byId(28), 'POSSIBLY MISSABLE · POINT OF NO RETURN — END OF CHAPTER 1',
      'One meditation spot in Chapter 1 is lost permanently once that chapter ends. PowerPyx places it at Jason’s house; OutputLag and eGamers describe it as Lucia’s balcony. Either way, meditate at the early spot before Chapter 1 closes — there is no replay to go back for it.') +
    card(byId(25), 'TIME-SENSITIVE · POINT OF NO RETURN — CHAPTER 3',
      'Eight stranger strands must be completed, and the race against Yago in Chapter 3 closes as the story moves on. Start every stranger marker the moment it appears and finish each strand before pushing the story forward.') +
    card(byId(14), 'TIME-SENSITIVE · POINT OF NO RETURN — OPTIONAL MISSIONS CLOSE MID-STORY',
      'A Long Road needs 100% completion, and optional missions that feed it can close while the story moves on. Do optional missions when they appear; after the story, when the 100% checklist itself only becomes visible, it is too late to recover a closed mission.');
  document.querySelectorAll('.ponrcard').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); selectTrophy(Number(el.dataset.id), true); });
  });
  $('hidden-bars').innerHTML = HIDDEN_GROUPS.map(([label, ids]) => {
    const got = ids.filter((id) => isEarned(byId(id))).length;
    const pct = Math.round((got / ids.length) * 100);
    return `<div class="hbar"><span>${esc(label)}</span><div class="bar teal"><i style="width:${pct}%"></i></div><span>${got}/${ids.length}</span></div>`;
  }).join('');
}

function renderProgress() {
  let pts = 0;
  for (const t of doc.trophies) if (isEarned(t)) pts += POINTS[t.grade];
  const pct = Math.round((pts / 1230) * 100);
  $('psn-points').textContent = `${pts.toLocaleString('en-US')} / 1,230 pts · ${pct}%`;
  const barRow = (label, got, tot) => {
    const p = tot ? Math.round((got / tot) * 100) : 0;
    return `<div class="barrow"><span>${esc(label)}</span><div class="bar"><i style="width:${p}%"></i></div><span>${got}/${tot}</span></div>`;
  };
  const g = { platinum: [0, 1], gold: [0, 2], silver: [0, 6], bronze: [0, 46] };
  for (const t of doc.trophies) if (isEarned(t)) g[t.grade][0]++;
  $('by-grade').innerHTML =
    barRow('Platinum', g.platinum[0], 1) + barRow('Gold', g.gold[0], 2) +
    barRow('Silver', g.silver[0], 6) + barRow('Bronze', g.bronze[0], 46);
  const k = { meta: [0, 1], chapter: [0, 4], mission: [0, 14], counter: [0, 20], moment: [0, 16] };
  for (const t of doc.trophies) if (isEarned(t)) k[t.kind][0]++;
  $('by-kind').innerHTML =
    barRow('Meta', k.meta[0], 1) + barRow('Chapter', k.chapter[0], 4) + barRow('Mission', k.mission[0], 14) +
    barRow('Counter', k.counter[0], 20) + barRow('Moment', k.moment[0], 16);
  $('mini-stages').innerHTML = STAGES.map((s) => {
    const list = doc.trophies.filter((t) => t.stage === s.n);
    const got = list.filter(isEarned).length;
    return `<div>Stop ${s.n} — ${esc(s.title)}: ${got}/${list.length}</div>`;
  }).join('');
  $('backup-meta').textContent = state.lastExport
    ? `Last export: ${state.lastExport.name} · ${state.lastExport.time} · ${state.lastExport.count} trophies earned.`
    : 'No export yet in this browser.';
}

function renderSources() {
  const citedBy = {};
  for (const t of doc.trophies) for (const s of t.sources || []) citedBy[s] = (citedBy[s] || 0) + 1;
  document.querySelector('#source-matrix tbody').innerHTML = doc.sources.map((s) => {
    const n = citedBy[s.id] || 0;
    const role = n > 0 ? esc(s.reliability) : 'List cross-check — names & descriptions verified against the official 55';
    return `<tr><td><a href="${esc(s.url)}" target="_blank" rel="noopener">[${s.id}] ${esc(s.name)}</a> — ${esc(s.title)}<span class="ret">${esc(s.reliability)}</span></td>` +
      `<td>${esc(s.read)}</td><td>${n} of 55 guides</td><td>${role}</td></tr>`;
  }).join('');
}

function exportProgress() {
  const now = new Date();
  const pad = (v) => String(v).padStart(2, '0');
  const name = `leonida-getaway-progress-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.json`;
  const payload = { app: 'LEONIDA GETAWAY', exportedAt: now.toISOString(), earned: state.earned, counts: state.counts };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = name;
  a.click();
  state.lastExport = { name, time: `${pad(now.getHours())}:${pad(now.getMinutes())}`, count: state.earned.length };
  save(); renderProgress();
}

async function importProgress(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = (Array.isArray(data) ? data : data.earned || []).filter((id) => typeof id === 'number' && byId(id));
    state.earned = [...new Set(ids)];
    if (data.counts && typeof data.counts === 'object') {
      for (const [k, v] of Object.entries(data.counts)) {
        const t = byId(Number(k));
        if (t && t.target) state.counts[t.id] = Math.max(0, Math.min(t.target, Number(v) || 0));
      }
    }
    save(); renderAll();
  } catch { alert('That file is not a LEONIDA GETAWAY progress export.'); }
}

async function init() {
  const res = await fetch('data/trophies.json');
  doc = await res.json();
  const cats = [...new Set(doc.trophies.map((t) => t.category))];
  $('f-cat').innerHTML = '<option value="all">all</option>' + cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  document.querySelectorAll('#tabs button').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
  $('spoiler-toggle').addEventListener('click', () => { state.spoilers = !state.spoilers; save(); renderAll(); });
  for (const id of ['q', 'f-kind', 'f-grade', 'f-cat', 'f-order', 'f-earned', 'f-notyet']) {
    $(id).addEventListener('input', renderChecklist);
    $(id).addEventListener('change', renderChecklist);
  }
  $('btn-export').addEventListener('click', exportProgress);
  $('file-import').addEventListener('change', (e) => importProgress(e.target.files[0]));
  $('btn-reset').addEventListener('click', () => {
    if (confirm('Reset all progress in this browser?')) {
      state = { earned: [], counts: {}, spoilers: true, revealed: {}, selected: 28, lastExport: null, savedAt: null };
      save(); renderAll();
    }
  });
  renderMap();
  renderAll();
}

init();
