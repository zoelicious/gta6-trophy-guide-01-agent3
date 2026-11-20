/* LEONIDA GETAWAY — GTA VI PS5 trophy guide + tracker.
   Offline, no network: loads app/data/trophies.json, steps.json and
   sources.json only. Progress lives in localStorage; export/import as JSON. */
"use strict";

const STORE_KEY = "leonida-getaway-v1";
const PSN_POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
const TOTAL_PSN = 180 + 2 * 90 + 6 * 30 + 46 * 15; // 1,230

const STAGES = [
  { n: 0, title: "Before you start", hours: "~1 h", text: "No cheats on your trophy save — they disable trophies and saving. Make a manual save at the start of every chapter, plus one before the final mission. Turn spoilers ON: 28 trophies are hidden on PSN until earned.", trophies: [] },
  { n: 1, title: "Story · Chapters 1–4", hours: "~60–80 h", text: "Play the story straight through. Meditate at EVERY spot the moment you see one — the early Chapter 1 spot is the game's one true missable. Scan vehicles and study animals as you go; both count toward 100%.", trophies: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 28, 44] },
  { n: 2, title: "Side story & strangers", hours: "~15 h", text: "Finish the contact strands (Andy, Kenton, Billy, Randy, Tyrone), Bret's hunt, Cal's fishing challenge, and all 8 Strangers & Freaks strands. Start every stranger strand the moment it appears — the Chapter 3 race against Yago is time-sensitive.", trophies: [20, 22, 23, 24, 25, 26, 27, 29] },
  { n: 3, title: "Activities", hours: "~12 h", text: "Gold all 42 Shooting Range challenges, win drone races at all 14 locations, win 20 different races, finish an arcade game, bowl a game, and try all 9 activity types once.", trophies: [15, 16, 17, 18, 19, 21, 46] },
  { n: 4, title: "Collections & exploration", hours: "~20 h", text: "Complete 3 card sets, WAiNK It at 100 locations, discover 100 vehicles, explore all 52 areas of Leonida, and check the meditation counter is at 18/18.", trophies: [30, 31, 35, 42] },
  { n: 5, title: "Crime & combat", hours: "~15 h", text: "Rob 5 bank vaults and an armored truck, hit one illegal operation per gang, rob the jewelry store unseen, lose a 4-star wanted level with your partner, and take the Rhino for a spin.", trophies: [33, 34, 36, 37, 38, 39, 40, 41, 43] },
  { n: 6, title: "Money & grind", hours: "~25 h", text: "Launder $250,000 of Marked Bills, spend $100,000 in shops, buy all 8 garages, register 10 vehicles to Scooter Bros, finish 50 challenges and reach 500 choices.", trophies: [32, 48, 52, 53, 54, 55] },
  { n: 7, title: "Cleanup & platinum", hours: "~10 h", text: "Check the 100% checklist (A Long Road, gold), sweep the five trophies whose triggers are not yet confirmed in public, then watch the platinum pop.", trophies: [1, 14, 45, 47, 49, 50, 51] },
];

const PIN_POS = {
  15: [300, 200], 16: [500, 300], 17: [705, 505], 18: [600, 400], 19: [800, 500],
  20: [340, 655], 21: [760, 580], 28: [250, 450], 29: [420, 670], 30: [550, 500],
  31: [150, 420], 32: [730, 210], 33: [730, 280], 34: [120, 450], 35: [480, 660],
  36: [370, 330], 37: [820, 540], 38: [520, 150], 39: [700, 600], 40: [470, 190],
  41: [150, 350], 42: [210, 170], 43: [165, 200], 44: [840, 600], 45: [790, 320],
  46: [770, 620], 47: [760, 340], 48: [650, 220], 51: [720, 540], 52: [800, 620],
  53: [850, 560], 54: [650, 480], 55: [580, 250],
};

const KIND_LABEL = { meta: "Platinum & 100%", story: "Story", strand: "Strand", collectible: "Collectible", activity: "Activity", crime: "Crime", money: "Money & grind", misc: "Misc" };
const GRADE_LETTER = { platinum: "P", gold: "G", silver: "S", bronze: "B" };

let TROPHIES = [];
let BY_ID = {};
let SOURCE_POOL = [];
let SOURCE_BY_KEY = {};
let EXTRA_STEPS = {};
let state = loadState();
let selectedId = 28; // Positive Mental Attitude opens by default on the cover
let activeTab = "map";
let kindFilter = "all";
let orderMode = "roadmap";
let gradeFilter = "all";
let searchText = "";
let earnedOnly = false;
let notYet = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return {
        earned: new Set(s.earned || []),
        counters: s.counters || {},
        spoilerHidden: s.spoilerHidden !== false,
        lastExport: s.lastExport || null,
        lastImport: s.lastImport || null,
      };
    }
  } catch (e) { /* fresh state on corrupt storage */ }
  return { earned: new Set(), counters: {}, spoilerHidden: true, lastExport: null, lastImport: null };
}

function saveState() {
  const s = {
    format: "leonida-getaway-progress/v1",
    earned: [...state.earned],
    counters: state.counters,
    spoilerHidden: state.spoilerHidden,
    lastExport: state.lastExport,
    lastImport: state.lastImport,
  };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* storage full/blocked */ }
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const note = document.getElementById("savedNote");
  if (note) note.textContent = "✓ Saved in this browser · " + hh + ":" + mm;
}

function isEarned(t) { return state.earned.has(t.id); }
function isMasked(t) { return state.spoilerHidden && t.hidden && !isEarned(t); }
function counterOf(t) { return state.counters[t.id] || 0; }

function earnedCount(list) { return list.filter(isEarned).length; }
function psnPoints() {
  let pts = 0;
  for (const t of TROPHIES) if (isEarned(t)) pts += PSN_POINTS[t.grade];
  return pts;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ---------- header ---------- */
function renderHeader() {
  const n = state.earned.size;
  const pct = Math.round((n / 55) * 100);
  document.getElementById("hdrCount").textContent = n + "/55 · " + pct + "%";
  document.getElementById("hdrPsn").textContent = psnPoints() + " / 1,230 PSN pts";
  document.getElementById("hdrBar").style.width = pct + "%";
  const grades = ["platinum", "gold", "silver", "bronze"];
  const totals = { platinum: 1, gold: 2, silver: 6, bronze: 46 };
  document.getElementById("hdrGrades").innerHTML = grades.map(g => {
    const e = TROPHIES.filter(t => t.grade === g && isEarned(t)).length;
    return '<span class="gchip">' + GRADE_LETTER[g] + ' <b>' + e + "/" + totals[g] + "</b></span>";
  }).join("");
  const hiddenLeft = TROPHIES.filter(t => t.hidden && !isEarned(t)).length;
  const btn = document.getElementById("spoilerToggle");
  btn.textContent = state.spoilerHidden
    ? "Spoilers hidden · " + hiddenLeft
    : "Spoilers shown";
}

/* ---------- audit strip (under the header, on every tab) ---------- */
function citedByCount(key) {
  let n = 0;
  for (const t of TROPHIES) if ((t.src || []).includes(key)) n++;
  return n;
}

function renderAuditStrip() {
  let totalSteps = 0, citedSteps = 0;
  for (const t of TROPHIES) {
    for (const s of (t.steps || [])) {
      totalSteps++;
      if (s.c && s.c.length) citedSteps++;
    }
  }
  const withSource = TROPHIES.filter(t => (t.src || []).length > 0).length;
  const missable = TROPHIES.filter(t => t.missable === "missable").length;
  const watch = TROPHIES.filter(t => t.missable === "time-sensitive").length;
  const unconfirmed = TROPHIES.filter(t => t.unconfirmed).length;
  const disputes = TROPHIES.filter(t => t.dispute).length;
  document.getElementById("auditStrip").textContent =
    "55 official · 1P 2G 6S 46B · 28 hidden · " + withSource + "/55 guides cite a source · " +
    citedSteps + "/" + totalSteps + " steps cited · " + SOURCE_POOL.length + " sources read 19–20 Nov 2026 · " +
    missable + " possibly missable · " + watch + " time-sensitive watch · " + unconfirmed + " unconfirmed · " +
    disputes + " dispute shown both ways";
}
function renderPins() {
  const g = document.getElementById("pins");
  const NS = "http://www.w3.org/2000/svg";
  g.innerHTML = "";
  for (const t of TROPHIES) {
    const pos = PIN_POS[t.id];
    if (!pos) continue;
    const wrap = document.createElementNS(NS, "g");
    wrap.setAttribute("class", "pin-wrap" + (isEarned(t) ? " earned" : "") + (selectedId === t.id ? " selected" : ""));
    wrap.setAttribute("data-id", t.id);
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("class", "pin");
    c.setAttribute("cx", pos[0]);
    c.setAttribute("cy", pos[1]);
    c.setAttribute("r", 12);
    let fill = "#C9A227";
    if (t.missable) fill = "#E06C5B";
    else if (t.unconfirmed) fill = "#7A6BC2";
    c.setAttribute("fill", fill);
    const label = document.createElementNS(NS, "text");
    label.setAttribute("class", "pin-num");
    label.setAttribute("x", pos[0]);
    label.setAttribute("y", pos[1] + 4);
    label.setAttribute("font-size", "11");
    label.textContent = t.id;
    wrap.appendChild(c);
    wrap.appendChild(label);
    wrap.addEventListener("click", () => selectTrophy(t.id));
    g.appendChild(wrap);
  }
}

function renderRegions() {
  const regions = ["Vice City", "Leonida Keys", "Port Gellhorn", "Mount Kalaga", "Grassrivers", "Ambrosia", "Hamlet", "Yorktown", "Statewide"];
  document.getElementById("regionList").innerHTML = regions.map(r => {
    const list = TROPHIES.filter(t => t.region === r);
    const e = earnedCount(list);
    const pct = list.length ? Math.round((e / list.length) * 100) : 0;
    return '<div class="region-chip"><b>' + esc(r) + '</b> · ' + e + "/" + list.length +
      '<span class="rc-bar"><i style="width:' + pct + '%"></i></span></div>';
  }).join("");
}

/* ---------- detail panel (shared by Map + Checklist tabs) ---------- */
function stageName(n) { return "Stop " + n + " · " + STAGES[n].title; }

function citeMarks(cites) {
  return (cites || []).map(n => "[" + n + "]").join(" ");
}

function railHTML(t) {
  const srcKeys = t.src || [];
  let h = '<div class="sources"><h4>Sources · rail [1]–[' + srcKeys.length + "] · retrieved 2026-11-20</h4><ol>";
  srcKeys.forEach((key, i) => {
    const s = SOURCE_BY_KEY[key];
    if (!s) return;
    h += "<li><b>" + esc(s.name) + "</b> — " + esc(s.title) +
      ' · <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url) + "</a>" +
      " · read " + esc(s.retrieved) + " · cited by " + citedByCount(key) + " of 55 guides</li>";
  });
  h += "</ol></div>";
  return h;
}

function detailHTML(t) {
  const masked = isMasked(t);
  const earned = isEarned(t);
  const name = masked ? (t.kind === "story" ? "Hidden story trophy" : "Hidden trophy") : t.name;
  const desc = masked ? "Hidden on PSN — earn it to reveal." : t.description;
  let h = "";
  h += '<span class="grade-badge ' + t.grade + '">' + t.grade + "</span> ";
  h += '<span class="tag">#' + t.id + " of 55</span>";
  h += '<span class="tag">' + esc(KIND_LABEL[t.kind]) + "</span>";
  h += '<span class="tag">' + esc(t.region) + "</span>";
  if (t.hidden) h += '<span class="tag hidden-tag">Hidden on PSN</span>';
  if (t.missable === "missable") h += '<span class="tag miss">POSSIBLY MISSABLE</span>';
  if (t.missable === "time-sensitive") h += '<span class="tag miss">TIME-SENSITIVE</span>';
  if (t.unconfirmed) h += '<span class="tag unconf">TRIGGER NOT YET CONFIRMED</span>';
  h += "<h2>" + esc(name) + "</h2>";
  h += '<div class="official-box"><h4>Official description</h4><p>“' + esc(desc) + "”</p></div>";
  if (masked) {
    h += '<p class="detail-empty">This trophy is hidden on PSN until earned. Turn spoilers off (header toggle) to reveal it, or earn it in-game — then it appears here in full.</p>';
  } else {
    if (t.missable === "missable") {
      h += '<div class="miss-box"><h4>⚠ POSSIBLY MISSABLE — POINT OF NO RETURN</h4><p>End of Chapter 1. The early meditation spot disappears permanently once Chapter 1 closes — no mission replay or New Game+ can bring it back. Meditate at every spot the moment you see one; keep a manual save at the start of every chapter.</p></div>';
    }
    if (t.missable === "time-sensitive") {
      h += '<div class="miss-box"><h4>⚠ TIME-SENSITIVE — POINT OF NO RETURN</h4><p>' + (t.id === 25
        ? "Chapter 3 — the stranger strand tied to the race against Yago closes mid-story. Start every stranger strand the moment it appears."
        : "Mid-story — optional missions that feed the 100% checklist close as the story advances. Do optional content when it appears, not after the credits.") + "</p></div>";
    }
    if (t.unconfirmed) {
      h += '<div class="unconf-box"><h4>TRIGGER NOT YET CONFIRMED</h4><p>The launch guides list this trophy’s unlock as “not yet known”. This guide writes down only what the official description gives — it does not invent a method. Check the sources below for a confirmed trigger.</p></div>';
    }
    if (t.target) {
      const c = counterOf(t);
      const pct = Math.min(100, Math.round((c / t.target) * 100));
      h += '<div class="counter"><span class="counter-label">Your count</span><button type="button" data-step="-1" aria-label="Decrease counter">−</button><strong>' + c.toLocaleString("en-US") + " / " + t.target.toLocaleString("en-US") + '</strong><button type="button" data-step="1" aria-label="Increase counter">+</button><span class="cbar"><i style="width:' + pct + '%"></i></span></div>';
      h += '<p class="fine">PSN tracks this count to ' + t.target.toLocaleString("en-US") + ". Use the stepper to keep your own tally — it is saved in this browser.</p>";
    }
    h += '<div class="info-boxes">';
    h += '<div class="info-box"><h4>Getaway stop · Chapter</h4><p>' + esc(stageName(t.stage)) + "<br>" + esc(t.chapter || "—") + "</p></div>";
    h += '<div class="info-box"><h4>Where · How</h4><p>' + esc(t.where) + "<br>" + esc(t.how) + "</p></div>";
    h += "</div>";
    if (t.dispute) {
      h += '<div class="dispute-box"><h4>' + esc(t.dispute.title) + "</h4>";
      for (const v of t.dispute.versions) {
        h += "<p><b>" + esc(v.label) + "</b><br>" + esc(v.text) + "</p>";
      }
      h += "</div>";
    }
    const steps = t.steps || [];
    if (steps.length) {
      h += '<h3 style="margin-top:12px">Steps — each step cited</h3><ol class="steps">';
      steps.forEach((s, i) => {
        h += "<li>" + esc(s.t) + ' <span class="cite">' + esc(citeMarks(s.c)) + "</span></li>";
      });
      h += "</ol>";
    }
    h += '<h3 style="margin-top:12px">Guide — in our words</h3><p class="guide-text">' + esc(t.guide) + "</p>";
    h += railHTML(t);
  }
  h += '<button type="button" class="mark-earned' + (earned ? " earned" : "") + '" data-mark="' + t.id + '">' +
    (earned ? "✓ Earned — click to unmark" : "Mark earned") + "</button>";
  return h;
}

function renderDetail() {
  const t = BY_ID[selectedId] || TROPHIES[0];
  if (!t) return;
  const html = detailHTML(t);
  const a = document.getElementById("detailPanel");
  const b = document.getElementById("detailPanelChecklist");
  if (a) a.innerHTML = html;
  if (b) b.innerHTML = html;
  for (const panel of [a, b]) {
    if (!panel) continue;
    panel.querySelectorAll("[data-step]").forEach(btn => {
      btn.addEventListener("click", () => {
        const step = Number(btn.getAttribute("data-step"));
        const cur = counterOf(t);
        state.counters[t.id] = Math.max(0, Math.min(t.target, cur + step));
        if (state.counters[t.id] >= t.target) state.earned.add(t.id);
        saveState(); renderAll();
      });
    });
    panel.querySelectorAll("[data-mark]").forEach(btn => {
      btn.addEventListener("click", () => toggleEarned(t.id));
    });
  }
}

function selectTrophy(id) {
  selectedId = id;
  renderPins();
  renderDetail();
  document.querySelectorAll(".trow").forEach(row => {
    row.classList.toggle("selected", Number(row.getAttribute("data-id")) === id);
  });
}

function toggleEarned(id) {
  if (state.earned.has(id)) state.earned.delete(id);
  else state.earned.add(id);
  saveState(); renderAll();
}

/* ---------- checklist ---------- */
function visibleTrophies() {
  let list = TROPHIES.slice();
  if (kindFilter === "missable") list = list.filter(t => t.missable);
  else if (kindFilter !== "all") list = list.filter(t => t.kind === kindFilter);
  if (gradeFilter !== "all") list = list.filter(t => t.grade === gradeFilter);
  if (searchText) {
    const q = searchText.toLowerCase();
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }
  if (earnedOnly) list = list.filter(isEarned);
  if (notYet) list = list.filter(t => !isEarned(t));
  return list;
}

function groupKey(t) {
  if (orderMode === "roadmap") return "STOP " + t.stage + " · " + STAGES[t.stage].title;
  if (orderMode === "region") return t.region.toUpperCase();
  return KIND_LABEL[t.kind].toUpperCase();
}

function renderChecklist() {
  const list = visibleTrophies();
  const groups = {};
  const order = [];
  for (const t of list) {
    const k = groupKey(t);
    if (!groups[k]) { groups[k] = []; order.push(k); }
    groups[k].push(t);
  }
  if (orderMode === "roadmap") {
    order.sort((a, b) => Number(a.split(" ")[1]) - Number(b.split(" ")[1]));
  } else {
    order.sort();
  }
  let h = "";
  for (const k of order) {
    const g = groups[k];
    const e = earnedCount(g);
    h += '<div class="group-head"><h3>' + esc(k) + "</h3><span>" + e + "/" + g.length + " earned</span></div>";
    for (const t of g) {
      const masked = isMasked(t);
      const name = masked ? (t.kind === "story" ? "Hidden story trophy" : "Hidden trophy") : t.name;
      const desc = masked ? "Hidden on PSN — earn it to reveal." : t.description;
      h += '<div class="trow' + (isEarned(t) ? " earned" : "") + (selectedId === t.id ? " selected" : "") + '" data-id="' + t.id + '">';
      h += '<input type="checkbox" ' + (isEarned(t) ? "checked" : "") + ' aria-label="Mark ' + esc(name) + ' earned">';
      h += '<div><div class="tname">' + esc(name) + ' <span class="tgrade ' + t.grade + '">' + GRADE_LETTER[t.grade] + "</span>";
      if (t.missable) h += ' <span class="tag miss">' + (t.missable === "missable" ? "POSSIBLY MISSABLE" : "TIME-SENSITIVE") + "</span>";
      if (t.unconfirmed) h += ' <span class="tag unconf">UNCONFIRMED</span>';
      h += '</div><div class="tdesc">' + esc(desc) + "</div></div>";
      h += '<div class="tright">' + (t.target ? '<span class="tcount">' + counterOf(t) + "/" + t.target + "</span><br>" : "") +
        '<span style="color:var(--muted)">' + esc(KIND_LABEL[t.kind]) + "</span></div>";
      h += "</div>";
    }
  }
  if (!list.length) h = '<p class="detail-empty">No trophies match this filter. Clear the search or a filter to see the full list.</p>';
  document.getElementById("checklist").innerHTML = h;
  document.querySelectorAll(".trow").forEach(row => {
    const id = Number(row.getAttribute("data-id"));
    row.addEventListener("click", ev => {
      if (ev.target.tagName === "INPUT") return;
      selectTrophy(id);
    });
    row.querySelector("input").addEventListener("click", ev => {
      ev.stopPropagation();
      toggleEarned(id);
    });
  });
  const shown = list.length;
  const filterBits = [];
  if (kindFilter !== "all") filterBits.push(kindFilter);
  if (gradeFilter !== "all") filterBits.push(gradeFilter);
  if (searchText) filterBits.push("“" + searchText + "”");
  if (earnedOnly) filterBits.push("earned only");
  if (notYet) filterBits.push("not yet earned");
  document.getElementById("filterStatus").textContent =
    shown + " of 55 shown · " + state.earned.size + " earned · " +
    (filterBits.length ? filterBits.join(" · ") : "no filter") + " · Order: " + orderMode[0].toUpperCase() + orderMode.slice(1);
}

function renderKindChips() {
  const kinds = [["all", "All", 55]];
  for (const k of ["story", "strand", "collectible", "activity", "crime", "money", "misc", "meta"]) {
    kinds.push([k, KIND_LABEL[k], TROPHIES.filter(t => t.kind === k).length]);
  }
  kinds.push(["missable", "Missable", TROPHIES.filter(t => t.missable).length]);
  document.getElementById("kindChips").innerHTML = kinds.map(([k, label, n]) =>
    '<button type="button" class="chip' + (kindFilter === k ? " active" : "") + '" data-kind="' + k + '">' + esc(label) + " " + n + "</button>"
  ).join("");
  document.querySelectorAll("#kindChips .chip").forEach(ch => {
    ch.addEventListener("click", () => { kindFilter = ch.getAttribute("data-kind"); renderKindChips(); renderChecklist(); });
  });
}

/* ---------- roadmap ---------- */
const ROUTE = [[790, 560], [380, 330], [130, 400], [170, 130], [480, 120], [690, 160], [760, 290], [850, 560]];

function renderRoute() {
  const svg = document.getElementById("routeSvg");
  const src = document.getElementById("mapSvg");
  const NS = "http://www.w3.org/2000/svg";
  svg.innerHTML = "";
  const bg = document.createElementNS(NS, "rect");
  bg.setAttribute("x", 0); bg.setAttribute("y", 0);
  bg.setAttribute("width", 1000); bg.setAttribute("height", 700);
  bg.setAttribute("fill", "#0B1220");
  svg.appendChild(bg);
  for (const id of ["landGroup", "roads", "regionLabels"]) {
    const node = src.getElementById(id);
    if (node) svg.appendChild(node.cloneNode(true));
  }
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", "M" + ROUTE.map(p => p.join(",")).join(" L"));
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#C9A227");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-dasharray", "10 6");
  path.setAttribute("opacity", "0.9");
  svg.appendChild(path);
  ROUTE.forEach((p, i) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "waypoint");
    g.addEventListener("click", () => {
      const card = document.getElementById("stage-card-" + i);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", p[0]); c.setAttribute("cy", p[1]); c.setAttribute("r", 17);
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", p[0]); t.setAttribute("y", p[1] + 5);
    t.setAttribute("font-size", "15");
    t.textContent = i;
    g.appendChild(c); g.appendChild(t);
    svg.appendChild(g);
  });
}

function renderStages() {
  document.getElementById("stageCards").innerHTML = STAGES.map(s => {
    const list = s.trophies.map(id => BY_ID[id]).filter(Boolean);
    const e = earnedCount(list);
    const pct = list.length ? Math.round((e / list.length) * 100) : 0;
    return '<div class="stage-card" id="stage-card-' + s.n + '">' +
      "<h3>Stop " + s.n + " · " + esc(s.title) + "</h3>" +
      '<p class="stage-meta">' + esc(s.hours) + " · " + e + "/" + list.length + " trophies earned</p>" +
      "<p>" + esc(s.text) + "</p>" +
      '<p class="stage-trophies">' + list.map(t => "<b>" + esc(t.name) + "</b>").join(" · ") + "</p>" +
      '<div class="sbar"><i style="width:' + pct + '%"></i></div></div>';
  }).join("");
  document.querySelectorAll(".stage-card").forEach(card => {
    card.addEventListener("click", () => {
      const n = Number(card.id.replace("stage-card-", ""));
      const first = STAGES[n].trophies[0];
      if (first) { selectTrophy(first); switchTab("checklist"); }
    });
  });
}

/* ---------- missables ---------- */
function renderMissables() {
  const cards = [
    { id: 28, tag: "POSSIBLY MISSABLE", ponr: "POINT OF NO RETURN: End of Chapter 1, after the early story.", body: "One early Chapter 1 meditation spot disappears permanently once the chapter closes. The sources disagree on the exact spot — PowerPyx says Jason's house, OutputLag and eGamers describe a balcony meditation early in Chapter 1 — so meditate at every spot the moment you see one, and keep a manual save at the start of every chapter." },
    { id: 25, tag: "TIME-SENSITIVE", ponr: "POINT OF NO RETURN: Chapter 3 — the race against Yago.", body: "The Strangers & Freaks silver needs 8 stranger strands, and the strand tied to the race against Yago closes mid-story in Chapter 3. Start every stranger strand the moment it appears; do not stockpile stranger missions for later." },
    { id: 14, tag: "TIME-SENSITIVE", ponr: "POINT OF NO RETURN: Mid-story — optional missions close.", body: "A Long Road (100% completion, gold) is time-sensitive because optional missions that feed the checklist close as the story advances. The checklist itself is forgiving — about 60% 'true completion' is enough — but the optional missions behind it are not. Do optional content when it appears." },
  ];
  document.getElementById("missCards").innerHTML = cards.map(c => {
    const t = BY_ID[c.id];
    return '<div class="miss-card" data-id="' + c.id + '">' +
      '<span class="tag miss">' + c.tag + "</span> " +
      '<span class="grade-badge ' + t.grade + '">' + t.grade + "</span>" +
      "<h3>" + esc(t.name) + "</h3>" +
      '<p class="ponr">' + c.ponr + "</p><p>" + c.body + "</p>" +
      '<p class="src-line">Sources: PowerPyx, OutputLag, KeenGamer, eGamers — retrieved 2026-11-20.</p></div>';
  }).join("");
  document.querySelectorAll(".miss-card").forEach(card => {
    card.addEventListener("click", () => { selectTrophy(Number(card.getAttribute("data-id"))); switchTab("checklist"); });
  });

  const groups = [
    ["Chapter 1", [2, 3]],
    ["Chapter 2", [4]],
    ["Chapter 3", [5]],
    ["Chapter 4", [6]],
    ["Final mission", [7]],
    ["Story missions", [8, 9, 10, 11, 12, 13]],
    ["Character strands", [22, 23, 24, 25, 26, 27, 29]],
    ["Crime & secrets", [33, 34, 37, 44, 45, 47, 49, 50, 51]],
  ];
  document.getElementById("hiddenGroups").innerHTML = groups.map(([label, ids]) => {
    const list = ids.map(id => BY_ID[id]).filter(Boolean);
    const e = earnedCount(list);
    let bars = "";
    for (const t of list) {
      if (isEarned(t)) {
        bars += '<div class="masked-bar"><i style="width:100%;opacity:1"></i><span>✓ ' + esc(t.name) + "</span></div>";
      } else if (!state.spoilerHidden) {
        bars += '<div class="masked-bar"><i style="width:0%"></i><span>' + esc(t.name) + "</span></div>";
      } else {
        bars += '<div class="masked-bar"><i style="width:0%"></i><span>Hidden trophy — earn it to reveal</span></div>';
      }
    }
    return '<div class="hidden-group"><h4>' + esc(label) + " · " + e + "/" + list.length + "</h4>" + bars + "</div>";
  }).join("");
  document.getElementById("hiddenModeLabel").textContent = state.spoilerHidden ? "ON" : "OFF";
  const left = TROPHIES.filter(t => t.hidden && !isEarned(t)).length;
  document.getElementById("hiddenCountLabel").textContent = state.spoilerHidden
    ? left + " of 28 masked until earned"
    : "0 of 28 masked — spoilers shown";
}

/* ---------- progress tab ---------- */
function barRow(label, e, total) {
  const pct = total ? Math.round((e / total) * 100) : 0;
  return '<div class="stat-row"><span>' + esc(label) + '</span><span class="sbar"><i style="width:' + pct + '%"></i></span><span>' + e + "/" + total + "</span></div>";
}

function renderProgress() {
  const pts = psnPoints();
  document.getElementById("psnPoints").textContent = pts.toLocaleString("en-US");
  document.getElementById("psnPct").textContent = Math.round((pts / TOTAL_PSN) * 100) + "%";
  const grades = [["Platinum", "platinum", 1], ["Gold", "gold", 2], ["Silver", "silver", 6], ["Bronze", "bronze", 46]];
  document.getElementById("byGrade").innerHTML = grades.map(([label, g, total]) =>
    barRow(label, TROPHIES.filter(t => t.grade === g && isEarned(t)).length, total)).join("");
  document.getElementById("byKind").innerHTML = Object.keys(KIND_LABEL).map(k =>
    barRow(KIND_LABEL[k], TROPHIES.filter(t => t.kind === k && isEarned(t)).length, TROPHIES.filter(t => t.kind === k).length)).join("");
  document.getElementById("stageGrid").innerHTML = STAGES.map(s => {
    const list = s.trophies.map(id => BY_ID[id]).filter(Boolean);
    const e = earnedCount(list);
    return '<div class="stage-cell"><b>' + e + "/" + list.length + "</b>Stop " + s.n + "<br>" + esc(s.title.split("·")[0].trim()) + "</div>";
  }).join("");
  document.getElementById("backupMeta").innerHTML =
    "<p>Last export: " + (state.lastExport ? esc(state.lastExport.file) + " · " + state.lastExport.count + " trophies · " + esc(state.lastExport.time) : "—") + "</p>" +
    "<p>Last import: " + (state.lastImport ? esc(state.lastImport.file) + " · " + state.lastImport.count + " trophies · " + esc(state.lastImport.time) : "—") + "</p>" +
    "<p>File format leonida-getaway-progress/v1 · ids + names, counters, spoiler setting.</p>";
}

/* ---------- export / import / reset ---------- */
function exportProgress() {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10);
  const data = {
    format: "leonida-getaway-progress/v1",
    exportedAt: now.toISOString(),
    earned: [...state.earned].sort((a, b) => a - b),
    counters: state.counters,
    spoilerHidden: state.spoilerHidden,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leonida-getaway-progress-" + stamp + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
  state.lastExport = { file: a.download, count: state.earned.size, time: now.toISOString().slice(0, 16).replace("T", " ") + " UTC" };
  saveState(); renderProgress();
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !Array.isArray(data.earned)) throw new Error("bad file");
      state.earned = new Set(data.earned.filter(id => BY_ID[id]));
      state.counters = data.counters || {};
      if (typeof data.spoilerHidden === "boolean") state.spoilerHidden = data.spoilerHidden;
      state.lastImport = { file: file.name, count: state.earned.size, time: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC" };
      saveState(); renderAll();
    } catch (e) {
      alert("That file is not a Leonida Getaway progress export.");
    }
  };
  reader.readAsText(file);
}

/* ---------- tabs ---------- */
function switchTab(name) {
  activeTab = name;
  document.querySelectorAll("#tabs .tab").forEach(b => b.classList.toggle("active", b.getAttribute("data-tab") === name));
  document.querySelectorAll(".tabpage").forEach(p => p.classList.toggle("active", p.id === "tab-" + name));
  if (name === "roadmap") renderRoute();
  if (name === "missables") renderMissables();
  if (name === "progress") renderProgress();
  if (name === "sources") renderSourceMatrix();
}

/* ---------- source matrix (Sources tab) ---------- */
function renderSourceMatrix() {
  const rows = SOURCE_POOL.map(s => {
    const n = citedByCount(s.key);
    return "<tr><td><b>" + esc(s.name) + "</b><br>" + esc(s.title) + '<br><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url) + "</a></td>" +
      "<td>" + esc(s.retrieved) + "</td>" +
      "<td>" + n + " of 55</td>" +
      "<td>" + esc(s.coverage) + "</td></tr>";
  }).join("");
  document.getElementById("sourceMatrix").innerHTML =
    '<table class="matrix"><thead><tr><th>Source</th><th>Read</th><th>Guides</th><th>Coverage</th></tr></thead><tbody>' + rows + "</tbody></table>";
}

/* ---------- render all / boot ---------- */
function renderAll() {
  renderHeader();
  renderAuditStrip();
  renderPins();
  renderRegions();
  renderKindChips();
  renderChecklist();
  renderDetail();
  renderStages();
  renderMissables();
  renderProgress();
  renderSourceMatrix();
  if (activeTab === "roadmap") renderRoute();
}

function boot(data) {
  TROPHIES = data.trophies.trophies;
  SOURCE_POOL = data.pool.sources;
  SOURCE_BY_KEY = {};
  for (const s of SOURCE_POOL) SOURCE_BY_KEY[s.key] = s;
  EXTRA_STEPS = data.extras;
  BY_ID = {};
  for (const t of TROPHIES) {
    const extra = EXTRA_STEPS[String(t.id)] || {};
    t.src = extra.src || [];
    t.steps = extra.steps || [];
    t.dispute = extra.dispute || null;
    BY_ID[t.id] = t;
  }
  document.querySelectorAll("#tabs .tab").forEach(b => {
    b.addEventListener("click", () => switchTab(b.getAttribute("data-tab")));
  });
  document.getElementById("spoilerToggle").addEventListener("click", () => {
    state.spoilerHidden = !state.spoilerHidden;
    saveState(); renderAll();
  });
  document.getElementById("searchBox").addEventListener("input", ev => { searchText = ev.target.value; renderChecklist(); });
  document.getElementById("orderSelect").addEventListener("change", ev => { orderMode = ev.target.value; renderChecklist(); });
  document.getElementById("gradeSelect").addEventListener("change", ev => { gradeFilter = ev.target.value; renderChecklist(); });
  document.getElementById("earnedOnly").addEventListener("change", ev => { earnedOnly = ev.target.checked; if (earnedOnly) notYet = false; document.getElementById("notYet").checked = false; renderChecklist(); });
  document.getElementById("notYet").addEventListener("change", ev => { notYet = ev.target.checked; if (notYet) earnedOnly = false; document.getElementById("earnedOnly").checked = false; renderChecklist(); });
  const doExport = () => exportProgress();
  document.getElementById("exportBtn").addEventListener("click", doExport);
  document.getElementById("exportBtn2").addEventListener("click", doExport);
  const doImport = () => document.getElementById("importFile").click();
  document.getElementById("importBtn").addEventListener("click", doImport);
  document.getElementById("importBtn2").addEventListener("click", doImport);
  document.getElementById("importFile").addEventListener("change", ev => {
    if (ev.target.files[0]) importProgress(ev.target.files[0]);
    ev.target.value = "";
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all progress? This clears every earned trophy and counter in this browser.")) return;
    state.earned = new Set();
    state.counters = {};
    saveState(); renderAll();
  });
  renderAll();
  saveState();
}

Promise.all([
  fetch("data/trophies.json").then(r => { if (!r.ok) throw new Error("trophies.json " + r.status); return r.json(); }),
  fetch("data/sources.json").then(r => { if (!r.ok) throw new Error("sources.json " + r.status); return r.json(); }),
  fetch("data/steps.json").then(r => { if (!r.ok) throw new Error("steps.json " + r.status); return r.json(); }),
])
  .then(([trophies, pool, extras]) => boot({ trophies, pool, extras }))
  .catch(err => {
    document.getElementById("checklist").innerHTML = "<p>Could not load trophy data: " + esc(err.message) + "</p>";
  });
