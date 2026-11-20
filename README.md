# LEONIDA GETAWAY — GTA VI · PS5 trophy guide

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/c/gta6-trophy-guide-01)
[![make.fun](https://img.shields.io/badge/make.fun-gta6--trophy--guide--01-teal)](https://make.fun/c/gta6-trophy-guide-01)
[![make.fun](https://img.shields.io/badge/make.fun-strict--transcripts-gold)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide + tracker for all **55 PlayStation 5 trophies** of Grand Theft
Auto VI — built for the [make.fun bounty](https://make.fun/c/gta6-trophy-guide-01)
"gta6-trophy-guide-01". Entered via referral: https://make.fun/r/nmy46sr8

## What it is

**LEONIDA GETAWAY** puts the map of Leonida first — as one long getaway route.
A hand-drawn night map of the state — dark navy sea, dark teal land, thin gold
roads — carries a pin for every trophy that has a place, grouped by region
(Vice City, Leonida Keys, Port Gellhorn, Mount Kalaga, Grassrivers, Ambrosia,
Hamlet, Yorktown). Click a pin (or any checklist row) and the trophy's full
guide opens beside the map. The platinum run is framed as the getaway itself:
8 stops along the route, from Vice City to the platinum.

- **Tracker** — checklist saved in the browser (localStorage), export / import
  progress as JSON, filters by kind / grade / category, "not yet earned",
  name search, per-trophy target counters (0/250 stunts, 0/18 meditations…),
  and a spoiler setting that hides story and hidden trophies until earned.
- **Roadmap to the platinum** — 8 stops drawn as a numbered gold route across
  the map: manual saves first (no mission replay, no New Game+), story, side
  strands, activities, collections, crime, money & grind, cleanup, platinum.
  About ~200 hours, difficulty 4/10, one playthrough, all offline.
- **Missables** — 3 trophies with a point of no return (1 missable + 2
  time-sensitive), each with its point of no return spelled out, plus the two
  warnings every hunter needs: no mission replay / no New Game+, and cheats
  disable trophies.
- **Honest where the data is not there yet** — 5 trophies whose unlock trigger
  is not yet confirmed in public are labelled exactly that, with only what is
  known written down. Nothing is invented.

## Data

`app/data/trophies.json` holds the official 55 trophies — name, description and
grade exactly as PlayStation publishes them (1 platinum, 2 gold, 6 silver,
46 bronze, 28 hidden) — plus a guide in our own words for every trophy, with
its sources named beside it. Sources: Exophase, PSNProfiles, PowerPyx,
OutputLag, eGamers, KeenGamer, GTA Zone, U7BUY, GTAViceCityHub, HowToVideoGame,
GTAVice.net, CryptoGames and LeonidaHub (all retrieved 2026-11-20).

## Run it

No build step, no network. Serve `app/` with any static server and open
`index.html` in desktop Chrome:

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

## Handing in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json`
with `buildDossier` from `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
