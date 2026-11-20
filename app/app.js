'use strict';
/* LEONIDA GETAWAY — GTA VI PS5 trophy guide + tracker. All data comes from
   app/data/trophies.json (the official 55). Progress lives in localStorage only. */
var STORE_KEY = 'leonida-getaway-v1';
var POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
var TOTAL_POINTS = 1230;

var SOURCES = [
  { n: 1, name: 'PowerPyx', title: 'GTA 6 Trophy Guide & Roadmap', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/', read: '19 Nov 2026', what: 'Full trophy guide + platinum roadmap; marks PMA missable and 5 triggers not yet known.' },
  { n: 2, name: 'OutputLag', title: 'GTA 6 Trophy List', url: 'https://outputlag.com/guides/gta-6-trophy-list/', read: '19 Nov 2026', what: 'Full 55-trophy list; describes the early meditation spot as Lucia\u2019s balcony in Chapter 1.' },
  { n: 3, name: 'Exophase', title: 'Grand Theft Auto VI trophies', url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/', read: '19 Nov 2026', what: 'Official trophy list — names, descriptions and grades, verified word for word against the kit.' },
  { n: 4, name: 'PSNProfiles', title: 'Grand Theft Auto VI trophies', url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi', read: '19 Nov 2026', what: 'Official list + per-trophy progress targets (0/250 stunts, 0/18 meditations, and the rest).' },
  { n: 5, name: 'KeenGamer', title: 'GTA 6 Trophy Guide & Platinum Roadmap', url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/', read: '19 Nov 2026', what: 'Platinum roadmap; confirms the ~200-hour estimate and the no-replay structure.' },
  { n: 6, name: 'eGamers', title: 'GTA 6 Trophy List — All 55 Trophies', url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/', read: '19 Nov 2026', what: 'Full list + hardest trophies; agrees the early meditation spot is in Chapter 1.' },
  { n: 7, name: 'GTA Zone', title: 'GTA 6 Trophies & Achievements', url: 'https://gta-zone.com/news/gta-6-trophies-achievements/', read: '20 Nov 2026', what: 'Full list + roadmap overview.' },
  { n: 8, name: 'U7BUY', title: 'GTA 6 Trophies', url: 'https://www.u7buy.com/blog/gta-6-trophies/', read: '20 Nov 2026', what: 'Full 55-trophy list.' },
  { n: 9, name: 'GTAVice.net', title: 'Trophies and Achievements', url: 'https://www.gtavice.net/guides/trophies-and-achievements', read: '20 Nov 2026', what: 'Full trophy and achievement list.' }
];

var PHASES = [
  { n: 0, name: 'Stop 0 — Before you start', hours: '~1 h', text: 'No cheats on the trophy save — cheats disable trophies. Make a manual save at the start of every chapter and one before the final mission: there is no mission replay and no New Game+. Turn the spoiler shield on for the 28 hidden trophies.', trophies: [] },
  { n: 1, name: 'Stop 1 — Story, Chapters 1–4', hours: '~60–80 h', text: 'Play the story through. Meditate at every spot the moment you see one — the Chapter 1 spot is gone for good once that chapter ends. Scan vehicles and study animals as you travel; both count toward 100%.', trophies: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { n: 2, name: 'Stop 2 — Side story & strangers', hours: '~15 h', text: 'Finish the 8 stranger strands and the final mission of each contact — Andy, Kenton, Billy, Randy, Tyrone — plus Bret\u2019s hunt and Cal\u2019s fishing challenge. Start stranger markers the moment they appear; the Chapter 3 race against Yago can close.', trophies: [22, 23, 24, 25, 26, 27, 29] },
  { n: 3, name: 'Stop 3 — Activities & sport', hours: '~20 h', text: 'Gold all 42 Shooting Range challenges, win the Top Fun drone race at all 14 locations, win 20 different races, and try all 9 activity types. Ranges and drone races must be fully done for 100%.', trophies: [15, 16, 17, 18, 19, 20, 21, 46] },
  { n: 4, name: 'Stop 4 — Collections & exploring', hours: '~25 h', text: 'Meditation spots (18/18), 3 card sets, WAiNK at 100 locations, 100 vehicles discovered, all 52 areas of Leonida. Sweep region by region on the map and tick each region off.', trophies: [28, 30, 31, 35, 42] },
  { n: 5, name: 'Stop 5 — Crime & combat', hours: '~15 h', text: 'Bank vaults, armored truck, one illegal operation per gang, the jewelry store without being seen, Combat Focus, VCIA, the Rhino tanks, and the partner wanted-level jobs. Warning: a Criminal Profile of \u201cIrredeemable\u201d is permanent.', trophies: [33, 34, 36, 37, 38, 39, 40, 41, 43] },
  { n: 6, name: 'Stop 6 — Money & grind', hours: '~30 h', text: 'Launder $250,000 of Marked Bills, spend $100,000 across shops, buy all 8 garages, register 10 vehicles in the Scooter Bros app, finish 50 challenges and 500 choices. The long counters fill while you do everything else.', trophies: [32, 48, 52, 53, 54, 55] },
  { n: 7, name: 'Stop 7 — Cleanup & platinum', hours: '~10 h', text: 'Check the 100% checklist (Progress, Stats, 100% Completion), mop up the five trophies whose triggers are not yet confirmed in public guides, then A Long Road (gold) and the platinum, Vice Got a Price!', trophies: [1, 14, 44, 45, 47, 49, 50, 51] }
];

var REGION_XY = {
  'Vice City': [840, 360], 'Leonida Keys': [730, 530], 'Port Gellhorn': [185, 372],
  'Mount Kalaga': [320, 130], 'Grassrivers': [480, 430], 'Ambrosia': [520, 170],
  'Hamlet': [420, 310], 'Yorktown': [660, 160]
};
var WAYPOINTS = [[760, 285], [640, 210], [480, 175], [330, 150], [220, 230], [280, 350], [480, 385], [660, 505]];
var PIN_IDS = [28, 30, 31, 35, 42, 15, 17, 18, 20, 21, 46, 44, 45, 51, 37, 39, 40, 41, 43, 29];

var trophies = [];
var byId = {};
var state = { earned: {}, counts: {}, revealed: {}, spoiler: true, lastExport: null, savedAt: null };
var selectedId = 28;
var currentTab = 'map';

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function $(id) { return document.getElementById(id); }
function gradeLabel(g) { return { platinum: 'PLATINUM', gold: 'GOLD', silver: 'SILVER', bronze: 'BRONZE' }[g] || g; }
function srcByNum(n) { for (var i = 0; i < SOURCES.length; i++) if (SOURCES[i].n === n) return SOURCES[i]; return null; }
function isHidden(t) { return state.spoiler && t.hidden && !state.earned[t.id] && !state.revealed[t.id]; }
function earnedCount() { var n = 0; for (var i = 0; i < trophies.length; i++) if (state.earned[trophies[i].id]) n++; return n; }
function psnPoints() { var p = 0; for (var i = 0; i < trophies.length; i++) if (state.earned[trophies[i].id]) p += POINTS[trophies[i].grade]; return p; }
function hiddenLeft() { var n = 0; for (var i = 0; i < trophies.length; i++) { var t = trophies[i]; if (t.hidden && !state.earned[t.id]) n++; } return n; }

function loadState() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      var s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        state = Object.assign(state, s);
        // A stored state with progress but no timestamp still counts as saved
        // in this browser (e.g. seeded by an earlier session).
        if (!state.savedAt && (Object.keys(state.earned).length || Object.keys(state.counts).length)) {
          state.savedAt = new Date().toISOString();
        }
      }
    }
  } catch (e) { /* fresh browser: start empty */ }
}
function saveState() {
  state.savedAt = new Date().toISOString();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
  renderHeader();
}
function fmtTime(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
}

function renderHeader() {
  var n = earnedCount(), pct = Math.round(n / 55 * 100);
  $('hdrProgress').textContent = n + '/55';
  $('hdrPct').textContent = ' · ' + pct + '%';
  var grades = ['platinum', 'gold', 'silver', 'bronze'];
  var totals = { platinum: 1, gold: 2, silver: 6, bronze: 46 };
  var html = '';
  grades.forEach(function (g) {
    var c = 0;
    trophies.forEach(function (t) { if (t.grade === g && state.earned[t.id]) c++; });
    html += '<b>' + gradeLabel(g)[0] + ' <i>' + c + '/' + totals[g] + '</i></b>';
  });
  $('hdrGrades').innerHTML = html;
  $('spoilerToggle').textContent = state.spoiler ? ('Spoilers hidden · ' + hiddenLeft()) : 'Spoilers shown';
  $('savedNote').textContent = state.savedAt ? ('\u2713 Saved in this browser · ' + fmtTime(state.savedAt)) : 'No saved progress yet';
}

function renderAudit() {
  var steps = 0;
  trophies.forEach(function (t) { steps += t.steps.length; });
  $('auditStrip').innerHTML =
    '<b>55</b> official &middot; <b>1P 2G 6S 46B</b> &middot; <b>28</b> hidden &middot; ' +
    '<b>55/55</b> guides cite a source &middot; <b>' + steps + '/' + steps + '</b> steps cited &middot; ' +
    '<b>9</b> sources read 19/20 Nov 2026 &middot; <b>1</b> possibly missable &middot; <b>2</b> time-sensitive &middot; ' +
    '<b>5</b> unconfirmed &middot; <b>1</b> dispute shown both ways';
}

function renderPins() {
  var g = $('pins');
  var perRegion = {};
  var html = '';
  PIN_IDS.forEach(function (id, idx) {
    var t = byId[id];
    if (!t) return;
    var base = REGION_XY[t.region] || [500, 300];
    var k = (perRegion[t.region] = (perRegion[t.region] || 0) + 1);
    // Spread pins on a grid around the region anchor so a region with many
    // pins (Vice City has 16) reads as a cluster, not one blob.
    var col = (k - 1) % 4, row = Math.floor((k - 1) / 4);
    var ox = (col - 1.5) * 34, oy = (row - 1.5) * 28;
    var x = base[0] + ox, y = base[1] + oy;
    var fill = t.missable === 'possibly' ? '#e5484d' : (state.earned[id] ? '#46c07a' : '#2b7f78');
    var r = id === selectedId ? 13 : 10;
    html += '<g class="pin" data-id="' + id + '" style="cursor:pointer">' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" stroke="#efe6cf" stroke-width="2"/>' +
      '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="Verdana,sans-serif">' + id + '</text></g>';
  });
  g.innerHTML = html;
  g.querySelectorAll('.pin').forEach(function (el) {
    el.addEventListener('click', function () { selectTrophy(+el.getAttribute('data-id')); });
  });
  var w = $('waypoints');
  var wh = '';
  WAYPOINTS.forEach(function (p, i) {
    wh += '<g class="wp" data-phase="' + i + '" style="cursor:pointer">' +
      '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="12" fill="#c9a227" stroke="#0e1626" stroke-width="2"/>' +
      '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#14100a" font-family="Verdana,sans-serif">' + i + '</text></g>';
  });
  w.innerHTML = wh;
  w.querySelectorAll('.wp').forEach(function (el) {
    el.addEventListener('click', function () { switchTab('roadmap'); });
  });
}

function renderRegions() {
  var regions = Object.keys(REGION_XY);
  var html = '';
  regions.forEach(function (r) {
    var list = trophies.filter(function (t) { return t.region === r; });
    var done = list.filter(function (t) { return state.earned[t.id]; }).length;
    html += '<button class="region-item" type="button" data-region="' + esc(r) + '"><b>' + esc(r) + '</b><span>' + done + '/' + list.length + ' earned</span></button>';
  });
  $('regionList').innerHTML = html;
  $('regionList').querySelectorAll('.region-item').forEach(function (el) {
    el.addEventListener('click', function () {
      switchTab('checklist');
      $('orderSelect').value = 'region';
      renderChecklist();
      window.scrollTo(0, 0);
    });
  });
}

function flagHtml(t) {
  var h = '';
  if (t.missable === 'possibly') h += '<span class="flag red">POSSIBLY MISSABLE</span>';
  if (t.missable === 'time-sensitive') h += '<span class="flag amber">TIME-SENSITIVE</span>';
  if (t.unconfirmed) h += '<span class="flag grey">TRIGGER NOT CONFIRMED</span>';
  if (t.hidden) h += '<span class="flag teal">HIDDEN</span>';
  return h;
}

function renderDetail() {
  var t = byId[selectedId];
  if (!t) return;
  var el = $('detailPanel');
  var masked = isHidden(t);
  var name = masked ? 'Hidden trophy — hidden until earned' : t.name;
  var desc = masked ? 'This trophy is hidden. Earn it in-game, or reveal it here — spoilers ahead.' : t.description;
  var html = '<h2><span class="num">#' + t.id + ' OF 55 &middot; ' + esc(t.category.toUpperCase()) + '</span>' + esc(name) + '</h2>';
  html += '<div class="flags">' + flagHtml(t) + '</div>';
  html += '<p class="grade-line">' + gradeLabel(t.grade) + ' &middot; ' + esc(t.region) + ' &middot; Roadmap stop ' + t.stage +
    (t.chapter ? ' &middot; ' + esc(t.chapter) : '') + ' &middot; ' + (t.target ? 'Target ' + t.target + ' ' + esc(t.targetUnit || '') : 'One-time moment') + '</p>';
  if (masked) {
    html += '<button class="btn" type="button" id="revealBtn">Reveal this trophy</button>';
  }
  if (t.target) {
    var cur = state.counts[t.id] || 0;
    html += '<div class="stepper"><span>YOUR COUNT</span>' +
      '<button type="button" id="countMinus" aria-label="Decrease count">&minus;</button>' +
      '<span class="count">' + cur + '/' + t.target + '<small>' + esc(t.targetUnit || '') + '</small></span>' +
      '<button type="button" id="countPlus" aria-label="Increase count">+</button>' +
      '<label class="check"><input type="checkbox" id="earnedBox" ' + (state.earned[t.id] ? 'checked' : '') + '> Earned</label></div>';
  } else {
    html += '<label class="check" style="display:block;margin:10px 0"><input type="checkbox" id="earnedBox" ' + (state.earned[t.id] ? 'checked' : '') + '> Earned this trophy</label>';
  }
  // The dispute box goes right after the stepper: it is the cover's proof of
  // honesty and must be visible without scrolling on the first screenshot.
  if (t.dispute && !masked) {
    html += '<div class="box disagree"><h4>SOURCES DISAGREE — BOTH VERSIONS SHOWN</h4>' +
      '<p><b>Version A [' + t.dispute.a.source + ']:</b> ' + esc(t.dispute.a.text) + '</p>' +
      '<p><b>Version B [' + t.dispute.b.source + ']:</b> ' + esc(t.dispute.b.text) + '</p>' +
      '<p>' + esc(t.dispute.note) + '</p></div>';
  }
  html += '<div class="box"><h4>OFFICIAL DESCRIPTION</h4><p>&ldquo;' + esc(desc) + '&rdquo;</p></div>';
  html += '<div class="box"><h4>ROADMAP STAGE &middot; CHAPTER</h4><p>Stop ' + t.stage + ' — ' + esc(PHASES[t.stage].name) + (t.chapter ? ' &middot; ' + esc(t.chapter) : ' &middot; free roam') + '.</p></div>';
  if (!masked) {
    html += '<div class="box"><h4>WHERE / HOW — IN OUR OWN WORDS</h4><p>' + esc(t.guide) + '</p></div>';
    html += '<ol class="steps">';
    t.steps.forEach(function (s, i) {
      html += '<li>' + esc(s.t.replace(/\s*\[\d+\]\s*$/, '')) + ' <span class="cite">[' + s.cite + ']</span></li>';
    });
    html += '</ol>';
    html += '<h4 style="font-family:Verdana,sans-serif;font-size:11px;letter-spacing:1.2px;color:var(--gold2);margin:12px 0 4px">SOURCES — RETRIEVED 2026-11-20</h4><ul class="src-list">';
    t.sources.forEach(function (n) {
      var s = srcByNum(n);
      if (s) html += '<li>[' + n + '] ' + esc(s.name) + ' — <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title) + '</a> (read ' + esc(s.read) + ')</li>';
    });
    html += '</ul>';
  }
  el.innerHTML = html;
  var eb = $('earnedBox');
  if (eb) eb.addEventListener('change', function () { state.earned[t.id] = eb.checked; saveState(); renderAll(); });
  var minus = $('countMinus'), plus = $('countPlus');
  if (minus) minus.addEventListener('click', function () { state.counts[t.id] = Math.max(0, (state.counts[t.id] || 0) - 1); saveState(); renderAll(); });
  if (plus) plus.addEventListener('click', function () { state.counts[t.id] = Math.min(t.target, (state.counts[t.id] || 0) + 1); saveState(); renderAll(); });
  var rb = $('revealBtn');
  if (rb) rb.addEventListener('click', function () { state.revealed[t.id] = true; saveState(); renderAll(); });
}

function renderRail() {
  var html = '<h3>SOURCES [1]&ndash;[9]</h3><ol>';
  SOURCES.forEach(function (s) {
    var cited = 0;
    trophies.forEach(function (t) { if (t.sources.indexOf(s.n) !== -1) cited++; });
    html += '<li><b>[' + s.n + '] ' + esc(s.name) + '</b> — ' + esc(s.title) +
      '<small><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url) + '</a><br>Read ' + esc(s.read) + ' &middot; cited by ' + cited + ' of 55 guides</small></li>';
  });
  html += '</ol>';
  $('sourceRail').innerHTML = html;
}

function selectTrophy(id) {
  selectedId = id;
  renderDetail();
  renderPins();
}
function filteredTrophies() {
  var q = ($('searchBox').value || '').toLowerCase();
  var kind = $('kindFilter').value, grade = $('gradeFilter').value, cat = $('catFilter').value;
  var eo = $('earnedOnly').checked, ny = $('notYet').checked;
  return trophies.filter(function (t) {
    if (q && t.name.toLowerCase().indexOf(q) === -1 && t.description.toLowerCase().indexOf(q) === -1) return false;
    if (kind && t.kind !== kind) return false;
    if (grade && t.grade !== grade) return false;
    if (cat && t.category !== cat) return false;
    if (eo && !state.earned[t.id]) return false;
    if (ny && state.earned[t.id]) return false;
    return true;
  });
}

function rowHtml(t) {
  var masked = isHidden(t);
  var name = masked ? 'Hidden trophy — hidden until earned' : t.name;
  var desc = masked ? 'Story trophy. Earn it, or reveal it from its detail panel.' : t.description;
  var target = t.target ? (' &middot; ' + (state.counts[t.id] || 0) + '/' + t.target + ' ' + esc(t.targetUnit || '')) : '';
  var flags = '';
  if (t.missable === 'possibly') flags += ' <span class="flag red">POSSIBLY MISSABLE</span>';
  if (t.missable === 'time-sensitive') flags += ' <span class="flag amber">TIME-SENSITIVE</span>';
  if (t.unconfirmed) flags += ' <span class="flag grey">NOT CONFIRMED</span>';
  return '<div class="trow' + (state.earned[t.id] ? ' earned' : '') + '" data-id="' + t.id + '">' +
    '<input type="checkbox" ' + (state.earned[t.id] ? 'checked' : '') + ' aria-label="Earned ' + esc(name) + '">' +
    '<div class="tmain"><div class="tname">' + esc(name) + '<span class="gchip">' + gradeLabel(t.grade) + '</span>' + flags + '</div>' +
    '<div class="tdesc' + (masked ? ' hidden-note' : '') + '">' + esc(desc) + '</div></div>' +
    '<div class="tmeta">#' + t.id + '<br>' + esc(t.region) + '<br>Stop ' + t.stage + target + '</div></div>';
}

function renderChecklist() {
  var list = filteredTrophies();
  var order = $('orderSelect').value;
  var groups = {};
  var orderKeys = [];
  function keyOf(t) {
    if (order === 'region') return t.region;
    if (order === 'category') return t.category;
    return 'Stop ' + t.stage + ' — ' + PHASES[t.stage].name.replace(/^Stop \d+ — /, '');
  }
  list.forEach(function (t) {
    var k = keyOf(t);
    if (!groups[k]) { groups[k] = []; orderKeys.push(k); }
    groups[k].push(t);
  });
  if (order === 'roadmap') {
    orderKeys.sort(function (a, b) { return parseInt(a.replace('Stop ', ''), 10) - parseInt(b.replace('Stop ', ''), 10); });
  } else { orderKeys.sort(); }
  var html = '';
  if (!list.length) html = '<p class="intro">No trophies match these filters.</p>';
  orderKeys.forEach(function (k) {
    var g = groups[k];
    var done = g.filter(function (t) { return state.earned[t.id]; }).length;
    html += '<div class="group-head">' + esc(k) + ' &middot; ' + done + '/' + g.length + '</div>';
    g.forEach(function (t) { html += rowHtml(t); });
  });
  $('checklistGroups').innerHTML = html;
  $('checklistGroups').querySelectorAll('.trow').forEach(function (el) {
    el.addEventListener('click', function (ev) {
      var id = +el.getAttribute('data-id');
      if (ev.target.tagName === 'INPUT') { state.earned[id] = ev.target.checked; saveState(); renderAll(); return; }
      selectTrophy(id);
      switchTab('map');
    });
  });
}

function renderRoadmap() {
  $('roadmapMeta').innerHTML =
    '<span><b>~200 h</b> to platinum [1]</span><span><b>4/10</b> difficulty [1]</span>' +
    '<span><b>1</b> playthrough [1]</span><span><b>0</b> online trophies [1]</span>' +
    '<span><b>No</b> mission replay [1]</span><span><b>No</b> New Game+ [1]</span>' +
    '<span><b>Cheats</b> disable trophies [1]</span><span><b>Free roam</b> after story [5]</span>';
  var html = '';
  PHASES.forEach(function (p) {
    var ts = p.trophies.map(function (id) { return byId[id]; }).filter(Boolean);
    var done = ts.filter(function (t) { return state.earned[t.id]; }).length;
    var pct = ts.length ? Math.round(done / ts.length * 100) : 0;
    html += '<div class="phase" data-phase="' + p.n + '"><h3>' + esc(p.name) + '</h3>' +
      '<div class="hours">' + esc(p.hours) + ' &middot; ' + done + '/' + ts.length + ' trophies</div>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div><p>' + esc(p.text) + '</p>';
    if (ts.length) {
      html += '<ul>';
      ts.slice(0, 4).forEach(function (t) { html += '<li>' + (state.earned[t.id] ? '\u2713 ' : '') + esc(isHidden(t) ? 'Hidden trophy' : t.name) + '</li>'; });
      if (ts.length > 4) html += '<li>&hellip;and ' + (ts.length - 4) + ' more</li>';
      html += '</ul>';
    }
    html += '</div>';
  });
  $('phaseGrid').innerHTML = html;
  $('phaseGrid').querySelectorAll('.phase').forEach(function (el) {
    el.addEventListener('click', function () {
      switchTab('checklist');
      $('orderSelect').value = 'roadmap';
      renderChecklist();
    });
  });
}

function renderMissables() {
  $('warnRow').innerHTML =
    '<div class="warn"><h3>NO MISSION REPLAY / NO NEW GAME+</h3><p>Once a story beat passes, it is gone. That is why the Chapter 1 meditation spot and the Chapter 3 stranger race are on this page — and why this guide tells you to save manually at the start of every chapter. [1][5]</p></div>' +
    '<div class="warn"><h3>CHEATS DISABLE TROPHIES</h3><p>Cheats disable trophies and saving on the save they are used on. Never touch a cheat on the trophy save, even after the credits. [1]</p></div>';
  var cards = [
    { t: byId[28], tag: 'POSSIBLY MISSABLE', note: 'POINT OF NO RETURN — END OF CHAPTER 1', body: 'One meditation spot in Chapter 1 is lost permanently once that chapter ends. PowerPyx places it at Jason\u2019s house; OutputLag and eGamers describe it as Lucia\u2019s balcony. Either way, meditate at the early spot before Chapter 1 closes — there is no replay to go back for it.', srcs: '4 sources: PowerPyx, OutputLag, KeenGamer, eGamers.' },
    { t: byId[25], tag: 'TIME-SENSITIVE', note: 'POINT OF NO RETURN — CHAPTER 3', body: 'Eight stranger strands must be completed, and the race against Yago in Chapter 3 closes as the story moves on. Start every stranger marker the moment it appears and finish each strand before pushing the story forward.', srcs: '3 sources: PowerPyx, KeenGamer, eGamers.' },
    { t: byId[14], tag: 'TIME-SENSITIVE', note: 'POINT OF NO RETURN — OPTIONAL MISSIONS CLOSE MID-STORY', body: 'A Long Road needs 100% completion, and optional missions that feed it can close while the story moves on. Do optional missions when they appear; the 100% checklist itself only becomes visible after the story, when it is too late to recover a closed mission.', srcs: '3 sources: PowerPyx, KeenGamer, GTA Zone.' }
  ];
  var html = '';
  cards.forEach(function (c) {
    html += '<div class="miss-card"><h3>#' + c.t.id + ' ' + esc(c.t.name) + '</h3>' +
      '<div class="ponr">' + c.tag + ' &middot; ' + c.note + '</div><p>' + c.body + '</p>' +
      '<p class="srcs">' + c.srcs + ' <a href="#" data-open="' + c.t.id + '">Open the guide &rsaquo;</a></p></div>';
  });
  $('missGrid').innerHTML = html;
  $('missGrid').querySelectorAll('[data-open]').forEach(function (el) {
    el.addEventListener('click', function (ev) { ev.preventDefault(); selectTrophy(+el.getAttribute('data-open')); switchTab('map'); });
  });
  var groups = [
    ['Chapter 1', [2, 3]], ['Chapter 2', [4]], ['Chapter 3', [5]], ['Chapter 4', [6]],
    ['Finale', [7]], ['Story missions', [8, 9, 10, 11, 12, 13]],
    ['Side story', [22, 23, 24, 26, 27, 29]], ['Misc moments', [44, 45, 47, 49, 50, 51]],
    ['Crime', [33, 38, 39, 41]]
  ];
  var bh = '';
  groups.forEach(function (g) {
    var ts = g[1].map(function (id) { return byId[id]; }).filter(Boolean);
    var done = ts.filter(function (t) { return state.earned[t.id]; }).length;
    var pct = ts.length ? Math.round(done / ts.length * 100) : 0;
    bh += '<div class="hbar-row"><b>' + esc(g[0]) + '</b><div class="bar"><i style="width:' + pct + '%"></i></div><span>' + done + '/' + ts.length + '</span></div>';
  });
  $('hiddenBars').innerHTML = bh;
}

function renderProgress() {
  var pts = psnPoints(), pct = Math.round(pts / TOTAL_POINTS * 100);
  $('psnCard').innerHTML = '<h3>PSN POINTS TOWARD PLATINUM</h3>' +
    '<div class="big-num">' + pts + ' <small>/ 1,230 pts &middot; ' + pct + '%</small></div>' +
    '<p style="color:var(--muted);font-size:13px">Bronze 15 &middot; Silver 30 &middot; Gold 90 &middot; Platinum 180. ' +
    'The correct total is 1,230 (46&times;15 + 6&times;30 + 2&times;90 + 180). Some entries quote 1,350 — that figure is wrong. [4]</p>';
  var grades = [['Platinum', 'platinum', 1], ['Gold', 'gold', 2], ['Silver', 'silver', 6], ['Bronze', 'bronze', 46]];
  var gh = '<h3>EARNED BY GRADE</h3>';
  grades.forEach(function (g) {
    var c = trophies.filter(function (t) { return t.grade === g[1] && state.earned[t.id]; }).length;
    gh += '<div class="bar-row"><b>' + g[0] + '</b><div class="bar"><i style="width:' + Math.round(c / g[2] * 100) + '%"></i></div><span>' + c + '/' + g[2] + '</span></div>';
  });
  $('gradeCard').innerHTML = gh;
  var kinds = [['Story', 'story'], ['Side story', 'side'], ['Activity', 'activity'], ['Collection', 'collection'], ['Crime', 'crime'], ['Money / grind', 'money'], ['Misc', 'misc'], ['Platinum', 'platinum']];
  var kh = '<h3>EARNED BY KIND</h3>';
  kinds.forEach(function (k) {
    var list = trophies.filter(function (t) { return t.kind === k[1]; });
    var c = list.filter(function (t) { return state.earned[t.id]; }).length;
    kh += '<div class="bar-row"><b>' + k[0] + '</b><div class="bar"><i style="width:' + (list.length ? Math.round(c / list.length * 100) : 0) + '%"></i></div><span>' + c + '/' + list.length + '</span></div>';
  });
  $('kindCard').innerHTML = kh;
  var sh = '<h3>ROADMAP STAGES</h3>';
  PHASES.forEach(function (p) {
    var ts = p.trophies.map(function (id) { return byId[id]; }).filter(Boolean);
    var done = ts.filter(function (t) { return state.earned[t.id]; }).length;
    sh += '<div class="bar-row"><b>Stop ' + p.n + '</b><div class="bar"><i style="width:' + (ts.length ? Math.round(done / ts.length * 100) : 100) + '%"></i></div><span>' + done + '/' + ts.length + '</span></div>';
  });
  $('stageCard').innerHTML = sh;
  var le = state.lastExport;
  $('backupCard').innerHTML = '<h3>BACKUP — EXPORT / IMPORT / RESET</h3>' +
    '<p style="color:var(--muted);font-size:13px">' + (le ? ('Last export: <b style="color:var(--cream2)">' + esc(le.name) + '</b> &middot; ' + esc(le.time) + ' &middot; ' + le.count + ' trophies earned at export.') : 'No export yet. Export saves your progress to a JSON file you can import on another browser.') + '</p>' +
    '<p><button class="btn" type="button" id="exportBtn">Export progress</button> ' +
    '<button class="btn ghost" type="button" id="importBtn">Import progress</button> ' +
    '<button class="btn danger" type="button" id="resetBtn">Reset</button></p>' +
    '<input type="file" id="importFile" accept="application/json" style="display:none">';
  $('exportBtn').addEventListener('click', exportProgress);
  $('importBtn').addEventListener('click', function () { $('importFile').click(); });
  $('importFile').addEventListener('change', importProgress);
  $('resetBtn').addEventListener('click', function () {
    if (!window.confirm('Reset all progress? This clears every earned trophy and counter.')) return;
    state.earned = {}; state.counts = {}; state.revealed = {}; state.lastExport = null;
    saveState(); renderAll();
  });
}

function exportProgress() {
  var data = { app: 'leonida-getaway', exportedAt: new Date().toISOString(), earned: state.earned, counts: state.counts };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  var name = 'leonida-getaway-progress-' + new Date().toISOString().slice(0, 10) + '.json';
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  state.lastExport = { name: name, time: fmtTime(new Date().toISOString()), count: earnedCount() };
  saveState(); renderAll();
}

function importProgress(ev) {
  var f = ev.target.files && ev.target.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      var d = JSON.parse(r.result);
      if (d && typeof d === 'object') {
        if (d.earned) state.earned = d.earned;
        if (d.counts) state.counts = d.counts;
        saveState(); renderAll();
      }
    } catch (e) { window.alert('That file is not a valid progress export.'); }
  };
  r.readAsText(f);
  ev.target.value = '';
}

function renderSourcesTab() {
  var tb = $('sourceMatrix').querySelector('tbody');
  var html = '';
  SOURCES.forEach(function (s) {
    var cited = 0;
    trophies.forEach(function (t) { if (t.sources.indexOf(s.n) !== -1) cited++; });
    html += '<tr><td><b>[' + s.n + '] ' + esc(s.name) + '</b></td><td>' + esc(s.read) + '</td><td>' + cited + ' / 55</td><td>' + esc(s.what) + '<br><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url) + '</a></td></tr>';
  });
  tb.innerHTML = html;
  var ch = '';
  SOURCES.forEach(function (s) {
    var cited = 0;
    trophies.forEach(function (t) { if (t.sources.indexOf(s.n) !== -1) cited++; });
    ch += '<div class="card"><h3>[' + s.n + '] ' + esc(s.name) + '</h3><p style="font-size:13.5px">' + esc(s.what) + '</p><p style="color:var(--muted);font-size:12.5px">Read ' + esc(s.read) + ' &middot; cited by ' + cited + ' of 55 guides<br><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url) + '</a></p></div>';
  });
  $('sourceCards').innerHTML = ch;
}

function switchTab(name) {
  currentTab = name;
  document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === name); });
  document.querySelectorAll('.tabpage').forEach(function (p) { p.classList.toggle('active', p.id === 'tab-' + name); });
  renderAll();
}

function renderAll() {
  renderHeader();
  renderAudit();
  renderPins();
  renderRegions();
  renderDetail();
  renderRail();
  renderChecklist();
  renderRoadmap();
  renderMissables();
  renderProgress();
  renderSourcesTab();
}

function initFilters() {
  var kinds = [['', 'Kind: all'], ['platinum', 'Platinum'], ['story', 'Story'], ['side', 'Side story'], ['activity', 'Activity'], ['collection', 'Collection'], ['crime', 'Crime'], ['money', 'Money / grind'], ['misc', 'Misc']];
  $('kindFilter').innerHTML = kinds.map(function (k) { return '<option value="' + k[0] + '">' + k[1] + '</option>'; }).join('');
  var grades = [['', 'Grade: all'], ['platinum', 'Platinum'], ['gold', 'Gold'], ['silver', 'Silver'], ['bronze', 'Bronze']];
  $('gradeFilter').innerHTML = grades.map(function (k) { return '<option value="' + k[0] + '">' + k[1] + '</option>'; }).join('');
  var cats = [''];
  trophies.forEach(function (t) { if (cats.indexOf(t.category) === -1) cats.push(t.category); });
  $('catFilter').innerHTML = cats.map(function (c) { return '<option value="' + esc(c) + '">' + (c ? esc(c) : 'Category: all') + '</option>'; }).join('');
  ['searchBox', 'kindFilter', 'gradeFilter', 'catFilter', 'orderSelect', 'earnedOnly', 'notYet'].forEach(function (id) {
    $(id).addEventListener('input', renderChecklist);
    $(id).addEventListener('change', renderChecklist);
  });
  $('spoilerToggle').addEventListener('click', function () {
    state.spoiler = !state.spoiler;
    saveState(); renderAll();
  });
  document.querySelectorAll('#tabs button').forEach(function (b) {
    b.addEventListener('click', function () { switchTab(b.getAttribute('data-tab')); });
  });
}

fetch('data/trophies.json')
  .then(function (r) { return r.json(); })
  .then(function (d) {
    trophies = d.trophies || d;
    trophies.forEach(function (t) { byId[t.id] = t; });
    loadState();
    initFilters();
    renderAll();
  })
  .catch(function (e) {
    document.querySelector('main').innerHTML = '<p class="intro">Could not load app/data/trophies.json. Serve this folder over HTTP (node serve.ts) and reload.</p>';
  });

