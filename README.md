# LEONIDA GETAWAY — GTA VI · PS5 trophy guide

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/zoelicious/gta6-trophy-guide-01-agent3/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/zoelicious/gta6-trophy-guide-01-agent3/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An unofficial, offline trophy guide + tracker for all **55 PS5 trophies** of Grand Theft Auto VI — built for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/c/gta6-trophy-guide-01).

## The concept

The platinum run is **one long getaway across Leonida**. The hero is a hand-drawn night map of the state — navy sea, dark teal land, a gold dashed getaway route — with a numbered pin for every trophy that has a place. The 8 roadmap phases are the **8 stops** along that route, from Vice City to the platinum.

## What is inside

- **Night map with 55 pins** — every trophy with a place, per region (Vice City, Leonida Keys, Port Gellhorn, Mount Kalaga, Grassrivers, Ambrosia, Hamlet, Yorktown, Statewide). Click a pin to open its guide.
- **Positive Mental Attitude open on the cover** — the one possibly-missable trophy (18 meditation spots, stepper − 6/18 +), with its official description quoted verbatim, numbered steps each cited [n], and a **SOURCES DISAGREE** box showing both versions of the dispute (18 vs 15 spots; Jason's house vs Lucia's balcony).
- **Audit strip** — 55 official · 1P 2G 6S 46B · 28 hidden · 55/55 guides cite a source · 165/165 steps cited · 13 sources read 19–20 Nov 2026 · 1 possibly missable · 2 time-sensitive watch · 5 unconfirmed · 1 dispute shown both ways.
- **Source rail [1]–[13] + source matrix** — every source named with title, URL, read date and “cited by N of 55 guides”.
- **Serious tracker** — checklist saved in the browser (localStorage), export/import as JSON, filters by kind/grade/category, “not yet earned”, search, Roadmap/Region/Category ordering, PSN target counters, spoiler setting that masks the 28 hidden trophies until earned, PSN points toward the platinum (135 / 1,230 pts).
- **Roadmap** — 8 stops, ~200 h, one playthrough, all offline, no mission replay, no New Game+, cheats disable trophies.
- **Missables tab** — 3 cards with a point of no return (Positive Mental Attitude, Strangers &amp; Freaks, A Long Road) + 2 warning boxes + hidden trophies per chapter as masked bars.
- **Honesty first** — 5 trophies are labelled “trigger not yet confirmed” (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin). Their guides say only what the official description gives; no unlock method is invented.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network: static files under `app/` (`index.html`, `style.css`, `app.js`, `data/trophies.json`).

## Build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` + `screenshots/` to the output directory and writes `dossier.json` via `buildDossier` from `vendor/makefun-frontend.ts` (kit-vendored, unmodified).

## Referral

https://make.fun/r/nmy46sr8

## License

MIT — see [LICENSE](LICENSE). Unofficial fan guide; not affiliated with Rockstar Games. No official artwork or logos are used. Trophy names, descriptions and grades are the official list (2026-11-18).
