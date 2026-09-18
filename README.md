# AIEC Frontend

Production frontend for AIEC — lift/elevator installation. Rider role,
Marathi-first: capture construction-site leads, then carry each registered
site through statutory documents, municipal fees and construction to handover.

Built to reproduce the canonical reference screens in
`AIEC_Build_Screens_Till_Now.zip` while obeying the AIEC system rules.

> **Read [`DEVIATIONS.md`](./DEVIATIONS.md) first.** The repo contained no PRD,
> UX Architecture or Design System document, so parts of the token layer are
> derived rather than read. Every derived value and every departure from a
> reference image is logged there.

## Stack

Vite · React 18 · TypeScript · CSS custom properties · react-router.
No UI framework: the token grammar `--aiec-{theme}-{category}-{role}-{state}`
is the design system, and a component library would fight it.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview    # http://localhost:4173 — required by the capture harness

node tools/capture.mjs   # render all screens at 430x932
python3 tools/compare.py # reference | render | full-scroll composites
node tools/qa.mjs        # overflow, touch-floor and 200%-text gates
node tools/measure.mjs   # print live geometry of the lead card
```

Artifacts land in `.artifacts/` (git-ignored):
`shots/` renders, `compare/` side-by-side composites.

`tools/capture.mjs` points at the preinstalled Chromium
(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`); override with
`AIEC_CHROME`. `tools/compare.py` reads references from `AIEC_REFS`.

## Screens

| ID | Route | Screen |
|---|---|---|
| S-R-01 | `/` | Rider home — dispatch map, KPIs, nearby opportunities |
| S-R-02 | `/leads` | My leads — the full lifecycle list |
| S-R-03 | `/capture` | Lead capture step 1 — evidence (slate theme) |
| S-R-04 | `/photos` | Site photos — gated on the evidence requirement |
| S-R-05 | `/payout` | Payout method — gross, TDS, net |
| S-R-06 | `/success` | Submission confirmation |
| S-R-07 | `/leads/:id` | Lead detail — full five-slot status |

**Record / compliance flow**

| ID | Route | Screen |
|---|---|---|
| S-R-08 | `/records` | My records — registered sites by state |
| S-R-09 | `/records/:id` | Record detail — statutory facts + next steps |
| S-R-10 | `/records/:id/progress` | Construction progress — six build stages |
| S-R-11 | `/records/:id/documents` | Document upload — gated on 6 documents |
| S-R-12 | `/records/:id/fees` | Municipal fee payment |
| S-R-13 | `/records/:id/fees/paid` | Fee receipt |
| S-R-14 | `/notifications` | Notifications |
| S-R-15 | `/profile` | Profile — identity, preferences, security |
| S-R-16 | `/feedback` | Feedback — gated on the required rating |

Each screen file opens with its **Screen Contract** as a doc comment: role,
theme, viewport, primary job, dominant action, visible components, workflow
state, gate, data, interactions, forbidden data, responsive behaviour and
important states.

## Architecture

### Tokens — `src/styles/tokens.css`

Grammar: `--aiec-{theme}-{category}-{role}-{state}`.

Two role themes: **sunlight** (daylight field operation) and **slate**
(evidence capture). Components consume theme-neutral aliases
(`--surface-raised`, `--text-primary`, …), never a themed token directly, so
one component renders correctly under both.

**Lifecycle tokens are theme-independent** and carry no theme segment. The
eight states are read from the map legend in the home reference:

`new` · `selling` · `won` · `material` · `installing` · `done` · `blocked` ·
`closed`

### Status grammar — `src/domain/lifecycle.ts`

A status is not a word. `StatusGrammar` requires five slots:

```
STATE · REASON · CUSTODY · CLOCK · CONSEQUENCE
```

`StatusIndicator` accepts only a `StatusGrammar`, so a bare "Pending" cannot
reach a screen — there is no field to put it in.

### Gates

`ActionState` is `open` or `gated`. A `Gate` requires all four answers: why
locked, who can unlock, what is required, what happens next. `NextAction`
renders `KeyringGate` for a gated action instead of a disabled button — see
`/photos`, which gates continue on five site photos.

### Role boundary

`RiderLead` has no field for project value, quoted price, margin, competitor
quotes or customer phone. The rider client cannot hold, render or cache them.
`RIDER_FORBIDDEN_FIELDS` in `src/domain/types.ts` states the boundary
explicitly for review.

### Primitives — `src/components/`

`StatusIndicator` · `CustodyLine` · `NextAction` · `KeyringGate` ·
`EntityCard` · `StatTile` · `AlertCard` · `WorkflowStep` · `WorkflowProgress` ·
`EntityTimeline` · `StageCard` · `DocumentRow` · `DecisionCard` ·
`RatingScale` · `MultiSelect` · `NotificationCenter` · `RoleSwitcher` ·
`Segments` · `Tabs` · `SettingGroup` · `SettingRow` · `MapView` ·
`MapEntity` · `MapFilter` · `ContextSheet` · `OfflineQueue` · `SLAIndicator` ·
`ScreenHelp` · `GlobalSearch` · `LanguageSwitch` · `SafetyOverride` ·
`DemoRibbon` · `AppBar` · `ContextBar` · `TabBar` · `Icon`

`WorkflowProgress` and `EntityTimeline` are deliberately distinct:
the first tracks a wizard the user is inside right now (horizontal, "you are
on step 3 of 5"); the second is an entity's history and forecast (vertical,
each stage carrying its own date and custody).

A visual defect is fixed in the primitive or the token, never on a screen.

### i18n — `src/i18n/strings.ts`

Marathi is the primary language, not a translation target. Strings marked
`[REF]` are transcribed verbatim from a reference image and must not be
reworded to make a layout fit — per §7, copy is geometry. English exists to
exercise the opposite expansion direction during layout QA; toggle with
`LanguageSwitch`.

Numerals render Latin (24, 320, 411045), matching the references.

## Responsive

Breakpoints `<360` · `360–480` · `481–834` · `835–1440` · `1440`.
These are transformations, not reflows: below 360 the entity-card rail moves
under the body and the photo grid drops a column; from 835 the device frame is
pinned to 932px inside a workspace rather than stretching, because a field UI
is not a small desktop.

## Verification status

`node tools/qa.mjs` passes on all 16 screens across all 7 widths:
no horizontal overflow, no action control under 48px, no clipped content at
200% text scale. The checks were verified to fail on deliberately broken
markup, so the pass is meaningful.

It has caught real defects rather than rubber-stamping: carousel controls at
36px, and (by eye, off the rendered gate) a Marathi quantity-grammar bug where
"{done} पैकी {total}" rendered "6 out of 4".

Visual fidelity was assessed by rendering each screen at 430×932 and comparing
against its reference. Six screens reach the 95 target; ten sit at 90–94,
bounded by the conflict between the mandated touch minimums and the
references' 33–44px controls. Per-screen scores, every documented deviation,
and the two levers that would move the rest are in `DEVIATIONS.md`.
