# AIEC — Decisions the documents leave to you

Findings from wiring the frontend to the Master PRD, UX Architecture and
Design System. Each one changes behaviour or money, and none of them is a
developer's call to make silently.

---

## 1. ⚠ "Margin" means markup-on-cost, not margin-on-price — and it changes every quote

The PRD's worked example (§10) states:

```
base cost        5,00,000
list (+60%)      8,00,000
bot floor        6,15,000    "≈23% margin retained"
absolute floor   6,00,000    "the 20% floor"
```

Those percentages **only reconcile as markup on cost**:

| Price | Margin on price | Markup on cost |
|---|---|---|
| 6,15,000 | 18.7% | **23.0%** ✓ |
| 6,00,000 | 16.7% | **20.0%** ✓ |

A developer reading "20% margin" with the conventional meaning (gross margin
on selling price) puts the hard floor at **₹6,25,000**, not ₹6,00,000 —
**₹25,000 higher on this deal, on every deal.** That is a commercial policy
difference, not a rounding question, and §4.3 says this floor is "code, not
policy", so the code has to pick one.

**Implemented:** `MarginPolicy.basis`, defaulting to `markup-on-cost`, which
reproduces the manual's own numbers exactly. Both readings are tested.

**You decide:** is the 20% floor markup on cost (current, matches the manual)
or gross margin on price (higher floor, more conservative)?

## 2. The "30% discount" and the stated bot floor contradict each other

§10 says the bot may discount "up to 30% off list", but also gives the bot
floor as ₹6,15,000. 30% off ₹8,00,000 is ₹5,60,000 — well below it.

**Implemented:** both constraints are modelled and the tighter one binds.
In the worked example the 23% margin floor binds, not the 30% discount,
which reproduces ₹6,15,000 exactly. If the intent was really "30% off", the
bot would be authorised below the Owner-only floor — almost certainly not
intended.

## 3. Gate 2 has no documented override and the PRD flags it «TBD»

§4.2 asks directly: *"is there ANY override path for QC clearance, e.g.
Owner-forced release?"*

**Implemented:** treated as a hard gate with `override: 'none'`, per the
instruction to treat it as hard until a decision says otherwise. One line
changes it if you decide otherwise — but note that an override here is the
one that lets unverified-shaft drawings reach a supplier.

## 4. The mockups and the documents disagree, and the documents win

The 16 reference screens were drawn before (or beside) these documents. Where
they conflict, the hierarchy in the build brief puts source requirements above
reference images. The conflicts found:

| Mockup shows | Documents require | Resolution |
|---|---|---|
| "प्रलंबित" / "Pending" chips | Word banned product-wide (§7.2) | Replaced; enforced by a test |
| Greyed-out "पहा" button | `disabled` forbidden as a bare state (§5) | Renders what it is waiting for |
| Enabled certificate download | Gate must show the lock (§12) | KeyringGate |
| Enabled "पुढे" with 2 docs missing | Same | KeyringGate with evidence meter |
| Orange (`#FE5B01`) as Sunlight accent | Sunlight accent is `#E8451F` (§2.2) | **Not yet applied — see §6** |
| Orange controls in Slate | Slate accent is cyan `#22C7C7` (§2.2) | **Not yet applied** |
| 2 themes | 5 themes (§2.2) | **Not yet applied** |

## 5. The money screens have no mockups at all

Of the 16 reference screens, **none covers the five payment gates**: there is
no token screen, no 90%/container screen, no triple-key unlock, no SOP step
pay, no final-10%/NOC screen. The mockups cover lead capture (rider earns ₹40
a lead) and a municipal-fee flow (₹38).

The deal in the PRD's worked example is **₹6,15,000**.

So pixel-matching the mockups spends the effort on the cheapest link in the
chain. `/pipeline` is built from the documents instead, and is where the
₹6.15L actually moves.

## 6. Still outstanding — the Design System is only partly applied

Now that the real Design System exists, my derived token layer is wrong in
ways that matter. Not yet fixed:

- **Lifecycle ramp**: real values differ from the ones I measured off the map
  legend, and each state needs a **light + dark calibration and a mandatory
  shape** (hollow circle, chevron, square-with-bang…). Shape is what makes the
  map readable to a deuteranopic admin; colour alone is not compliant.
- **Type scale**: field themes require `body` at **20/30** and `caption` at
  **17/24**, with `micro` banned outright. My field text is ~14/21 — far too
  small for a dusty screen in direct sun.
- **Anek** variable font with a width axis (the structural answer to
  Devanagari running 15–30% longer), not Noto Sans.
- **Five themes**, not two. Slate's accent is cyan, and `#FF4D3D` is reserved
  for SOS and nothing else.
- **Safe band 16px** (24px at the bottom), not my 12px gutter.
- **Seven motion categories** with exact durations, each with a reduced-motion
  twin, plus the specified **haptic map**.
- **Hindi** — the third required language is absent.
- **Reserved Spectrum rule**: pins own lifecycle hues, controls own the role
  accent, neither borrows.

These are Stage 1 in the Design System's own build order, which says nothing
above Stage 3 should be skipped to reach a screen faster.
