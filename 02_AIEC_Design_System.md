# AIEC — DESIGN SYSTEM
### Part 6 of the UX set · companion to `01_AIEC_UX_Architecture.md`

---

## 0. THE CONSTRAINTS THAT SHAPED THIS

Five things decided this system before any aesthetic choice was available.

**1. Two of three languages have no case, no italic, and break under tracking.** Marathi and Hindi are the defaults for Riders and Technicians. Every Latin-UI hierarchy trick — caps labels, small-caps eyebrows, letter-spaced overlines, italic emphasis — fails silently in Devanagari. Hierarchy here is built from **weight, size, colour and space only**.

**2. Devanagari runs 15–30% longer than English.** A button labelled *Capture Lead* becomes *लीड कॅप्चर करा*. Fixed-width buttons will wrap, truncate or reflow on every language switch, and Law 6 requires the switch to be instant and non-destructive. This is why the system family has a **width axis**, not just a weight axis — the type narrows to hold the label rather than the layout breaking to accommodate it.

**3. The map legend already owns eight hues.** Grey, blue, purple, orange, yellow, green, red, black are semantic. Pins own them; controls never do.

**4. The target device is a ₹8,000 Android at 360px, possibly with a cracked screen, at 200% text scale, in direct sun or a dark shaft.** Not a design reference device. The system is built at that floor and allowed to expand upward.

**5. There are five themes, not one theme with a colour variable.** The manual is right that a rider in glare and an owner in a car park need different products. What is shared is the *grammar* — spacing rhythm, motion timing, state semantics, component contracts. What differs is contrast, density, control size and accent.

---

## 1. TYPOGRAPHY

### 1.1 The families

**System family — Anek (Anek Latin + Anek Devanagari), Ek Type, Mumbai.**

Chosen for three specific reasons, not as a default:

- It is a **variable superfamily with both weight and width axes**, and the width axis is the structural answer to the Devanagari expansion problem. Buttons hold their labels in three languages by narrowing the type, not by reflowing the layout.
- Latin and Devanagari are drawn as one system with matched x-height, stroke contrast and colour, so an English screen and a Marathi screen have the same visual density. Most pairings do not, and the Marathi build ends up looking like the poor relation.
- It was drawn in India for Indian screens, and it holds up at 12–14px on a low-DPI panel, which is where most of this product lives.

**Customer display — Tiro Devanagari Marathi / Tiro Devanagari Hindi (John Hudson).**

The Premium theme calls for serif headings. A Latin-only serif would give the English customer a private-bank experience and the Marathi customer a fallback. Tiro is a genuine serif across Devanagari and Latin, with correct Marathi forms — the eyelash-ra ऱ and the Marathi ल — which most Devanagari faces get wrong or ignore. Latin display sets from the same family's Latin.

Fallback stack: `Anek Latin, Anek Devanagari, Noto Sans Devanagari, system-ui`.

### 1.2 Type scale

Modular, 1.25 ratio, expressed in rem so 200% scaling works natively. Field themes shift the whole scale up.

| Token | Command / Executive / Premium | Sunlight / Slate (field) |
|---|---|---|
| `display` | 40 / 44 | 40 / 44 |
| `title-l` | 28 / 34 | 32 / 40 |
| `title` | 22 / 28 | 26 / 34 |
| `body-l` | 17 / 26 | **22 / 32** |
| `body` | 15 / 22 | **20 / 30** |
| `caption` | 13 / 18 | **17 / 24** |
| `micro` | 11 / 16 | not used in field themes |

Field minimum is 22pt equivalent per Law 7, and `micro` is banned there entirely — an 11px label is unreadable through a dusty screen in the sun and has no business on a Rider's phone.

Devanagari line-height is set **+2px above the Latin value at every step**. Devanagari's ascenders and the shirorekha need the room; using the Latin metric makes Marathi text feel cramped and slightly cheap.

### 1.3 Weights and hierarchy

Four weights only: 400 · 500 · 600 · 800.

Hierarchy is expressed as: **weight, then size, then colour, then space.** No caps. No italics. No tracking. Two permitted exceptions, both treated as glyphs rather than text: gate names (`CONTAINER LOCKED`) and priority codes (`P0`–`P4`).

### 1.4 Numerals

Money and IDs always use **tabular lining figures**. A wallet where the digits shift as the balance changes reads as unreliable, which is the last thing this ledger can afford.

Indian grouping in all three languages: **₹1,50,000**, never ₹150,000. Lakh and crore in Owner and Admin summaries.

`line-height` for money strings is locked so a credit animation does not shift the row it sits in.

---

## 2. COLOUR

> **The Reserved Spectrum rule.** Pins own the lifecycle hues. Controls own the role accent. Neither borrows. On any map surface, primary controls render as maximum-contrast ink or inverse-ink, with zero hue — so every coloured pixel on a map means *state*, never *affordance*.

### 2.1 Lifecycle ramp (semantic, global, Law 2)

Two calibrations of the same meanings — light surfaces and dark surfaces — plus a mandatory shape, so state survives colour-blindness, glare and a 200-nit screen.

| State | Light | Dark | Shape |
|---|---|---|---|
| New lead | `#8A9099` | `#767E88` | hollow circle |
| In sales | `#1F6FEB` | `#5296F5` | half-filled circle |
| Won, awaiting shaft | `#7847D4` | `#A481EF` | circle, centre dot |
| Container in transit | `#D97B00` | `#F0A32B` | chevron |
| Installing | `#A88300` | `#D9B93C` | segmented ring, % filled |
| Complete | `#12805A` | `#2FA36B` | check |
| Blocked | `#C42B1C` | `#F2564A` | **square** with bang |
| Lost / cancelled | `#1C1F23` | `#0B0D0F` + 1px outline | slashed square |

Blocked is the only square-with-bang in the system. Shape difference, not hue difference, is what lets a deuteranopic admin scan a city map at speed.

### 2.2 Role themes

Accent values are chosen to sit **outside** the lifecycle ramp in hue, saturation or both.

**Sunlight — Rider, Candidate**
```
surface      #FFFFFF
surface-2    #F4F5F7
ink          #14181C
ink-2        #565E68
accent       #E8451F   saffron-red — controls only, never a pin
accent-ink   #FFFFFF
```
The accent is deliberately red-leaning so it cannot be confused with the amber transit pin at a glance in bright light. In sunlight, **lightness contrast survives and hue contrast does not** — so this theme drives everything from luminance and treats colour as secondary.

**Slate — Technician, QC**
```
surface      #0E1416
surface-2    #182024
surface-3    #212C31
ink          #E9EFF1
ink-2        #9AA8AE
accent       #22C7C7   cyan
safety       #FF4D3D   SOS only — no other element may use this value
```
Low-glare in an enclosed shaft. Cyan reads clearly under a head torch and is absent from the lifecycle ramp.

**Premium — Customer**
```
surface      #FCFAF6
surface-2    #F4F0E8
ink          #1A1712
ink-2        #6B6355
accent       #8C6A21   deep brass
accent-2     #C9A227   gold, progress ring only
```
The manual specifies white and gold. The gold is pushed toward brass so it reads as material rather than as a yellow highlight, and the brighter gold is reserved exclusively for the progress ring — the one element that carries the whole relationship.

**Command — Admin, Sales Desk, Supplier**
```
surface      #0A0E12
panel        #121820
panel-2      #1A222C
ink          #DCE4EC
ink-2        #8494A4
accent       none — primary controls are ink-inverse
focus        #4C8DF6   focus rings only
```
Command sits over a map full of blue and red pins, so it has no accent fill at all. Primary actions are white-on-dark solids. Every hue on an Admin screen means state.

Light variant for Sales and Supplier inverts surface and ink, keeping the same rule.

**Executive — Owner**
```
surface      #08090B
ink          #F2F5F8
ink-2        #7E8894
positive     #2FA36B
negative     #F2564A
```
Almost no colour. Two semantic values for direction of travel. Nothing else.

### 2.3 Contrast requirements

Every token pair ships with a measured ratio before build. Targets, not aspirations:

| Context | Minimum |
|---|---|
| Body text | 4.5:1 |
| Large text (≥ body-l bold) | 3:1 |
| UI controls, focus rings, icons | 3:1 |
| **Sunlight theme, all text** | **7:1** |
| **Safety and P0 elements** | **7:1** |

Sunlight is held to AAA because direct Pune sun costs roughly a stop of effective contrast, and a control the rider cannot find is a lead not captured.

Each theme also ships a high-contrast variant and a night variant, per Law 7.

---

## 3. SPACE, GRID, TARGETS

### 3.1 Base unit

4px. All spacing is a multiple: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.

### 3.2 Safe band

The manual specifies no critical control within 8px of any edge, for cracked screens with dead zones. **The system sets 16px**, and 24px at the bottom edge where gesture bars live.

### 3.3 Touch targets

| Context | Minimum |
|---|---|
| Universal floor | 48dp |
| Sunlight primary | **72dp** |
| Slate, any control in the evidence path | **64dp** |
| Slate shutter | **72dp** |
| SOS | 64dp, permanent, thumb zone |
| Command desktop | 32dp with keyboard equivalent |

Spacing between adjacent targets in field themes: 12dp minimum. Gloved fingers land wide.

### 3.4 Thumb zones (field themes)

A phone held at chest height in a shaft, or one-handed on a bike, is operated from below.

```
top third      status, context, never a control
middle third   content, camera, evidence
bottom third   every control that matters
```

Nothing destructive in the bottom third. Nothing critical in the top third.

### 3.5 Radius and elevation

Radius: `4` inputs and chips · `8` cards · `16` sheets · `full` pills and the shutter.

Elevation, three levels only: `flat` (0) · `raised` (cards, y2 blur8 at 8% ink) · `float` (sheets and dialogs, y8 blur24 at 16% ink). Slate and Command use a 1px lighter border instead of shadow, because shadows are invisible on near-black and only cost render time.

---

## 4. MOTION

Seven categories. Every animation in the product belongs to one of them or does not ship.

| Category | Duration | Easing | Where |
|---|---|---|---|
| **Micro** | 90ms | `cubic-bezier(.2,0,0,1)` | press, toggle, chip |
| **Transition** | 240ms | `cubic-bezier(.2,.8,.2,1)` | sheets, panels, screens |
| **Progress** | 420ms | `cubic-bezier(.2,0,0,1)` | ring advance, step unlock, burn-down |
| **Reward** | 700ms | custom, 380 travel + 320 count | money credited |
| **Alert** | 160ms in, 2 pulses @1200ms, then still | `cubic-bezier(0,0,0,1)` | P0/P1 arrival, red pins |
| **Spatial** | 600ms | `cubic-bezier(.4,0,.2,1)` | map fly-to, container movement |
| **Confirmation** | 900–1400ms | orchestrated | triple-key unlock, NOC seal, container seal |

### 4.1 Rules

- **Confirmation motion fires once per event, ever.** It is reserved for the three moments where something irreversible and consequential happens. Used a fourth time it stops meaning anything.
- **Reward motion never blocks.** The technician can start the next step mid-coin. The rider can capture again mid-coin.
- **Alert motion stops.** Two pulses, then still. A permanently blinking alert becomes wallpaper inside an hour.
- **No entrance animations on load.** No staggered card reveals, no fade-and-slide sections. The Owner's numbers in particular never count up — a counting animation on a cash figure makes it read as a game rather than a fact.
- **One signature moment per theme, everything else quiet.** Sunlight: the coin and the pin drop. Slate: the step unlock. Premium: the NOC seal. Command: the red pin pulse on a calm map. Executive: nothing at all.

### 4.2 Reduced motion

Not a degraded experience — a parallel one. Every category has a defined static equivalent:

| Category | Reduced-motion equivalent |
|---|---|
| Micro | instant state change |
| Transition | 120ms opacity, no translation |
| Progress | value snaps, `aria-live` announces the change |
| Reward | static `+₹2,800` chip fades in over 120ms, haptic still fires |
| Alert | static, plus one haptic |
| Spatial | map cuts to position |
| Confirmation | sequential text state changes with haptics |

### 4.3 Haptics

A shaft is loud, a bike is louder, and a phone is often in a pocket. Haptics carry real information here and are specified, not incidental.

| Pattern | Meaning |
|---|---|
| Light tick | shutter fired |
| Double tick | evidence passed, credit landed |
| Long buzz (400ms) | evidence rejected, action needed |
| Rising triple | step unlocked |
| Escalating pulse, 3s | SOS acknowledged by admin |

---

## 5. COMPONENT STATE MATRIX

Thirteen states. Every interactive component defines all thirteen or is not complete. Blank cells mean the state does not apply, which must be stated explicitly rather than left undesigned.

| State | Rule |
|---|---|
| `default` | resting |
| `hover` | desktop only; never the only affordance signal |
| `pressed` | 90ms, scale 0.97, immediate — no perceptible delay, ever |
| `focus` | 2px ring, 2px offset, 3:1 against both adjacent surfaces; visible on every focusable element |
| `loading` | skeletons for known shapes, spinner only for unknown duration; **never blocks an already-captured photo** |
| `success` | states what changed and what is now possible, not just that it worked |
| `warning` | amber, plus a glyph, plus a reason |
| `error` | red, plus a glyph, plus cause, plus recovery — never the word "error" |
| `disabled` | **forbidden as a bare state.** A control the user cannot use renders as a `KeyringGate` explaining the requirement and naming who can satisfy it |
| `offline` | neutral, never red; queue depth, not failure |
| `syncing` | quiet progress; item stays fully readable and interactive |
| `blocked` | `CustodyLine` mandatory — owner, requirement, clock, consequence |
| `empty` | states why it is empty, whether that is good, and what happens next |

The `disabled` rule is the one that changes the most code. It is also the single highest-leverage decision in this system: forty-plus locks exist in this product, and a greyed-out button is a lock with no key printed on it.

---

## 6. WORKFLOW STATE MATRIX

Twelve states. Each defines its pin, its timeline node, its card treatment, and who is permitted to move it.

| State | Pin | Timeline | Who advances it |
|---|---|---|---|
| `not_started` | lifecycle hue, 40% | hollow dot | system, on gate satisfaction |
| `available` | full hue | hollow dot, ring | the assigned user |
| `in_progress` | full hue, % ring | pulsing ring, expanded | the assigned user |
| `waiting` | full hue, dimmed | ring + `CustodyLine` | **the named custodian only** |
| `blocked` | red square | filled square, expanded | whoever satisfies the gate |
| `verifying` | full hue, shimmer | ring, indeterminate | the machine |
| `failed` | red square | slashed square + reason | retry, or appeal |
| `retry` | amber | square, retry count visible | the assigned user |
| `approved` | green | filled dot | system |
| `completed` | green check | filled dot, timestamp | terminal |
| `cancelled` | black slashed | slashed, dimmed | terminal, reason mandatory |
| `escalated` | red, double ring | double ring, names the recipient | admin or owner |

`waiting` and `blocked` are separate states and must never be collapsed into one. *Waiting* means the system is correctly holding for a named party — it is healthy. *Blocked* means something is wrong. Merging them is how a customer's normal 14-day shaft window ends up looking like a failure.

---

## 7. VOICE AND MICROCOPY

Copy is where "smart status," "smart empty," and "smart error" actually live. Everything below is a system, not a set of examples.

### 7.1 Voice per role

| Role | Voice |
|---|---|
| Rider | Short, warm, money-forward. Second person. Marathi first. |
| Customer | Calm, precise, reassuring. Never salesy, never urgent. |
| Technician | Direct, respectful, specific. Never accusatory. Safety lines always imperative. |
| QC | Neutral and procedural. No praise for passing. |
| Supplier | Commercial and exact. Dates and amounts up front. |
| Admin | Terse and factual. No pleasantries. |
| Owner | Declarative. Numbers with their meaning attached. |

### 7.2 Forbidden lexicon

**Never appears anywhere in the product:**
Pending · Processing · In progress · Awaiting approval · Something went wrong · Error occurred · Invalid · Failed · No data · N/A · Oops · Please try again later · Contact support

**Never appears in worker-facing strings** (Law IV — verification protects, it never accuses):
verified · validated · detected · flagged · suspicious · confirmed your identity · location check passed

**Never appears in customer-facing strings:**
any worker's earnings, penalties, rating or level.

### 7.3 Templates

**Status** — five slots, stacked (field/customer) or inline (Command/Executive):
```
Blocked
QC failed item 8 — pit waterproofing
Waiting on you · re-inspection 26 Aug
Material stays with the supplier until it clears
```

**Gate:**
```
🔒 {lock}
{requirement}
{progress}
After this: {consequence}
{deadline} · if not: {expiry outcome}
[ {action} ]
```

**Money:**
```
{amount}
{state}
{cause} · {time}
{consequence}
```

**Rejection** (four blocks, always in this order):
```
{specific instruction}
{plain reason}
[reference image] [your image]
{retries left} · your {amount} is held, not lost
[ Retake {n} ]  [ This is correct — ask a person ]
```

**Empty:**
```
{what is empty}
{whether that is good}
{what will change it}
[ optional action ]
```
> No inspections nearby.
> You're clear for now.
> New ones appear here as soon as they're assigned — usually within the hour.

**Offline:**
```
{n} actions saved on this phone
Your evidence, location and credits are safe here.
They'll send themselves when you're back in signal.
```

**Failure, customer-facing** — always paired with what is still safe:
```
Payment didn't go through.
Your material is still locked and waiting at your gate. Nothing is lost.
The window closes in 41 hours.
[ Try again ]  [ Use a different method ]
```

### 7.4 Verb consistency

An action keeps its name from control to confirmation. *Capture Lead* produces *Lead captured*. *Pay ₹2,78,500* produces *₹2,78,500 received*. The vocabulary is the signposting; changing the verb mid-flow is how a user loses confidence that the thing they pressed is the thing that happened.

---

## 8. ACCESSIBILITY

Not a compliance appendix. Several of these are the difference between the product working and not working in its actual environment.

| Requirement | Specification |
|---|---|
| Touch targets | 48dp floor, 72dp field primary |
| Text scaling | 200% without truncation or loss of function, verified at 360px |
| Contrast | §2.3; AAA for Sunlight and safety |
| Colour independence | every state carries a glyph or shape; the map legend is shape-coded |
| Focus | visible on every focusable element, 3:1 against both surfaces |
| Keyboard | full operation in Command and Executive; documented shortcut map |
| Screen reader | labels in all three languages; `aria-live` on money, verification results and queue depth |
| Reduced motion | §4.2 — parallel, not degraded |
| Voice input | first-class on every Rider correction field; not a fallback |
| Audio | never the sole channel; every sound has a haptic and a visual twin |
| Language | switch is instant, total and non-destructive of in-progress form data |
| Safety content | never English-only, in any build, under any circumstance |

Two that matter more here than in most products: **200% scaling at 360px** is the real test, because the manual's own device target is a cheap Android and older users routinely run large text. And **glove operation** — which no accessibility standard covers, but which determines whether a technician can earn money.

---

## 9. RESPONSIVE

Five breakpoints, per Law 9. These are transformations, not reflows.

| Width | Device | Behaviour |
|---|---|---|
| `< 360` | old budget Android | single column, essential controls only, images degraded — **never the capture flow** |
| `360–480` | standard phone | single column, bottom nav, full-bleed map |
| `481–834` | tablet | map + side panel |
| `835–1440` | laptop | map + two panels + persistent filters |
| `> 1440` | admin desktop / wall | 3–4 panels, live alert ticker |

**Transformations:**

```
map | list | detail        →   map → ContextSheet → full-screen workflow
side panel                 →   bottom sheet, same three detents
data table                 →   EntityCard stack, sorted by urgency
multi-column dashboard     →   priority-first single column
keyboard shortcuts         →   gesture equivalents, documented
persistent filters         →   filter sheet, state preserved
```

Portrait and landscape both supported everywhere. Landscape matters specifically for the technician: a phone propped on a shaft ledge is usually sideways.

---

## 10. TOKEN NAMING

```
--aiec-{theme}-{category}-{role}-{state}

--aiec-slate-surface-2
--aiec-slate-ink-primary
--aiec-sunlight-accent-pressed
--aiec-lifecycle-blocked-dark
--aiec-space-16
--aiec-motion-progress-duration
--aiec-target-field-primary
```

Lifecycle tokens are **theme-independent** — `--aiec-lifecycle-*` resolves against surface polarity, not against role. That is what keeps a blocked job the same thing to a rider, a technician and an admin, which is the entire point of Law 2.

---

## 11. WHAT TO BUILD FIRST

Stage 1 of implementation, in dependency order:

1. Tokens: colour, type, space, motion, targets — all five themes
2. Theme provider with theme, language and reduced-motion switching
3. `StatusIndicator` + the five-slot status grammar (everything else depends on it)
4. `CustodyLine`
5. `KeyringGate` — including the disabled-state ban
6. Button, input, chip, card across all thirteen states
7. `ContextSheet` with three detents
8. Motion primitives, all seven categories, with reduced-motion twins
9. Haptic map
10. Trilingual string infrastructure with Indian numeral formatting

Nothing above Stage 3 in that list should be skipped to reach a screen faster. The status grammar and the gate are the two components that every workflow in this product is assembled from.

---

**Companion document:** `01_AIEC_UX_Architecture.md` — Parts 1, 2 and 3.
**Still to come:** Part 4 (16 workflow journeys) · Part 5 (screen specifications) · Part 7 (Claude Code implementation prompts, Stages 1–16).
