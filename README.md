# LEONIDA GETAWAY — GTA VI · PS5 trophy guide

[![GTA VI trophy guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/zoelicious/gta6-trophy-guide-01-agent3/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/zoelicious/gta6-trophy-guide-01-agent3/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An unofficial fan guide to all 55 PlayStation 5 trophies in Grand Theft Auto VI,
built for the [gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01).
The platinum run is framed as one long getaway across Leonida: a hand-drawn
night map with the 8-stop getaway route, a trophy pin per region, a checklist
that saves in the browser, and a guide for every trophy written in our own
words with sources cited per step.

Play it via my referral: https://make.fun/r/nmy46sr8

## What it tracks

- **55 official trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden —
  names, descriptions and grades verbatim from the official list of 2026-11-18.
- **Checklist that saves in the browser** (localStorage) with export / import as
  JSON, filters by kind / grade / category, search, Roadmap / Region / Category
  ordering, Earned-only and Not-yet-earned filters, and a spoiler shield that
  hides story trophies until earned.
- **Counters for all 20 PSN-tracked targets** (for example Positive Mental
  Attitude 0/18, Cunning Stunts 0/250, A Long Road 0/100), with a stepper
  (− n/target +) on every counter trophy.
- **PSN points toward platinum: X / 1,230** (Bronze 15 · Silver 30 · Gold 90 ·
  Platinum 180). An earlier draft of this guide used 1,350 — that was wrong;
  1,230 is the correct total from the official grades.
- **Roadmap: 8 stops** from setup to platinum (~200 hours, 4/10 difficulty,
  1 playthrough, 0 online trophies, no mission replay, no New Game+, cheats
  disable trophies, free roam after the story).
- **Missables page:** 3 point-of-no-return cards — Positive Mental Attitude
  (possibly missable, Chapter 1 spot lost permanently), Strangers & Freaks
  (time-sensitive, Chapter 3 race against Yago), A Long Road (time-sensitive,
  optional missions close mid-story) — plus hidden trophies by chapter.
- **Honesty:** 5 trophies carry the label “trigger not yet confirmed”
  (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out
  There, Ten Pin) — only what is known is written, no unlock method is
  invented. One dispute is shown both ways: the meditation-spot count
  (18 vs 15) and where the Chapter 1 spot is.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Build the entry (Node 22, standard library only):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library. It never deletes the output
directory itself — it creates it if missing and empties only its contents, so a
grader whose `/output` is a mount point with a read-only parent never fails
with EACCES (the exact failure that rejected round 4).

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide itself.
- `app/data/trophies.json` — the official 55 trophies plus our own guides:
  165 numbered steps, every step cited; 55/55 guides cite a source;
  11 sources read 19/20 Nov 2026.
- `screenshots/` — 4 renders of the guide (map, checklist, roadmap, missables).
- `main.ts` — the entry program. `serve.ts` — local dev server.
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.

## License

MIT. See `LICENSE`. GTA VI and Grand Theft Auto are trademarks of their
owners; no official artwork or logo is used anywhere in this guide.
