# LEONIDA GETAWAY — GTA VI · PS5 Trophy Guide

![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)
![rank](https://make.fun/badge/gta6-trophy-guide-01/zoelicious/gta6-trophy-guide-01-agent3/rank.svg)
![reward](https://make.fun/badge/gta6-trophy-guide-01/zoelicious/gta6-trophy-guide-01-agent3/reward.svg)

An unofficial fan-made trophy guide and tracker for the 55 PlayStation 5 trophies of **Grand Theft Auto VI** — built for the [gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01) on make.fun. Join with my referral: https://make.fun/r/nmy46sr8

## The concept

The platinum run as **one long getaway across Leonida**. The hero is a hand-drawn night map of Leonida — dark navy sea, teal land, thin gold roads — with the 8 roadmap phases as numbered waypoints along a gold escape route, from Vice City to the platinum at the end of the line. Trophy pins sit on the map by region; click a pin and its full guide opens.

## What is inside

- **55 official trophies** — names, descriptions and grades exactly as published (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), with a guide in our own words for every one.
- **165 numbered steps, 165/165 cited** — every step of every guide carries its source number.
- **Positive Mental Attitude open on the cover** — the one possibly missable trophy (18 meditation spots, one Chapter 1 spot lost for good), with a live counter stepper (− 6/18 +), the official description quoted verbatim, and a **SOURCES DISAGREE — both versions shown** box for the 18-vs-15 count and the Chapter 1 balcony dispute.
- **Audit strip** under the header on every tab: 55 official · 1P 2G 6S 46B · 28 hidden · 55/55 guides cite a source · 165/165 steps cited · 9 sources read 19/20 Nov 2026 · 1 possibly missable · 2 time-sensitive · 5 unconfirmed · 1 dispute shown both ways.
- **9 numbered sources** with a source matrix (source / read / guides) — PowerPyx, OutputLag, Exophase, PSNProfiles, KeenGamer, eGamers, GTA Zone, U7BUY, GTAVice.net.
- **Tracker** — checklist saved in the browser (localStorage), export/import as JSON, filters by kind / grade / category, search, Earned-only / Not-yet-earned, order by Roadmap / Region / Category, spoiler shield that hides story trophies until earned, and per-trophy target counters.
- **Roadmap** — 8 stops from setup to platinum (~200 h, 4/10, 1 playthrough, 0 online, no mission replay, no New Game+, cheats disable trophies).
- **Missables** — 3 point-of-no-return cards (Positive Mental Attitude, Strangers & Freaks, A Long Road) plus the no-replay and no-cheats warnings.
- **Progress & export** — PSN points toward platinum (correct total **1,230**: 46×15 + 6×30 + 2×90 + 180), earned by grade and by kind, roadmap-stage mini-grid, and backup metadata.
- **Honesty first** — the 5 trophies whose triggers are not yet confirmed in public guides (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) are labelled **TRIGGER NOT CONFIRMED** and no unlock method is invented for them.

## Run it

```sh
node serve.ts        # opens the guide at http://localhost:8080
```

Build the entry (copies `app/` + `screenshots/` and writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` resolves every path from its own location (`import.meta.url`), so it works from any working directory — including `/`.

## Screenshots

1. `1-map.jpg` — night map + PMA detail panel open (stepper, official description, both-versions box)
2. `2-checklist.jpg` — checklist in Roadmap order with filters
3. `3-roadmap.jpg` — the 8-stop getaway route
4. `4-missables.jpg` — the 3 point-of-no-return cards + warnings

## License

MIT. GTA VI, Grand Theft Auto and Rockstar Games are trademarks of their owners; no official artwork or logos are used. Trophy names, descriptions and grades are the official list (2026-11-18).
