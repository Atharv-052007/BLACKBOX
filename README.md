# BLACKBOX — Case 001

A cinematic detective investigation product: evidence room, suspect dossiers, timeline of the
silent-frequency blackout, a live investigation board, verdict scoring and the **Reconstruction
Room** — an 8-beat drag-and-drop chronological puzzle backed by a separate accuracy score.

- **Local dev server:** `http://localhost:5173/`
- **Production build:** `npm run build` (TypeScript + Vite) — passes
- **Lint:** `npm run lint`
- **Framework:** Vite + React 19 + TypeScript, React Flow (`@xyflow/react`) on the board, Zustand
  persist (`blackbox-case-001`), Lucide icons, JetBrains Mono + Instrument Serif + Inter
- **No paid APIs / external AI.** Everything works offline after `npm install`.

## Getting started

```bash
npm install
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # production build
npm run lint     # Oxlint
```

## Routes (App shell)

| Route | Page |
| --- | --- |
| `/` | Cinematic landing |
| `/app` | Case 001 · Overview |
| `/app/cases` | Case Files |
| `/app/evidence` | Evidence Room |
| `/app/evidence/:id` | Evidence Examination |
| `/app/suspects` | Suspects |
| `/app/suspects/:id` | Suspect Dossier |
| `/app/board` | Investigation Board |
| `/app/timeline` | Timeline of the blackout |
| `/app/reconstruction` | **Reconstruction Room** |
| `/app/verdict` | Final Verdict |
| `/app/reports` | My Reports (export) |

## Features

- **New visitor onboarding (landing)** — the landing page now includes "YOUR FIRST INVESTIGATION
  STARTS HERE." with a beginner-friendly six-step walkthrough (Open a case → explore evidence →
  investigate suspects → connect the dots → reconstruct the events → submit verdict) and a
  "HOW TO PLAY" button that scrolls to it.
- **Case-opening transition** — first session (or deep link from the landing CTA) decrypts the case
  file; auto-dismissable via button or Skip.
- **Evidence Room** — filters by category/status, bookmarks, notes, unreview marks, provenance.
- **Suspects** — risk bars, alibi statuses, interview transcripts, contradiction indicators
  (`contradictions` on each suspect).
- **Investigation Board** — drag/drop evidence & suspects, labeled relationships, zoom/pan,
  auto-arrange, fit-on-load, connections with suggested starters, undo-able reset.
- **Reconstruction Room** — place the 8 beats in chronological order, drag/drop or click-to-place,
  validate to get a 75%/100% accuracy score with per-slot feedback and a discrepancy report for
  wrong slots; persisted in the case store; cross-linked from verdict and reports.
- **Verdict** — 4 contributors (culprit 40 / method 20 / motive 15 / evidence 15 / explanation 10),
  hints −2 each; SOLVED requires culprit correct + total ≥ 85.
- **Reports & achievements** — exports, progress, file completion, reconstructions
  (`Reconstructionist`, `True Sequence`).

## Testing

Puppeteer + Chrome is available at `C:/Users/ATHARV/AppData/Local/Temp/opencode/bb-test`
(`npm install puppeteer-core` there, Chrome installed at
`C:/Program Files/Google/Chrome/Application/chrome.exe`). Scripts like
`test-reconstruction.mjs` and `tmp-audit.mjs` automate visual/interaction checks.

## Misc notes

- Store key: `blackbox-case-001` (persisted; repairable via console).
- Run `npm run build` after changes and confirm zero errors.
