# AIEC — Deviation Register

Every place the implementation departs from a canonical reference image, with
the source reason. Per the build rules, a deviation without a documented
reason is a defect; this file is the record.

---

## 0. Missing source artifacts (read this first)

The repository contained only `AIEC_Build_Screens_Till_Now.zip`. There is **no
AIEC PRD, UX Architecture document, or Design System file** in the repo or in
git history. Priority levels 1 and 2 of the implementation hierarchy therefore
had no artifact to read.

What was used instead, in order:

1. The requirements stated in the build brief (token grammar, primitive
   inventory, touch-target minimums, status grammar, gate rules, motion
   limits, breakpoints, role-boundary rules). These are treated as **source
   requirements** and outrank the reference images.
2. The 16 canonical reference images.
3. Values measured directly off those images.

Tokens are annotated in `src/styles/tokens.css` with their provenance:

| Marker | Meaning |
|---|---|
| `[M]` | Measured from a reference image; the measurement is in the comment |
| `[S]` | Mandated by a source requirement in the build brief |
| `[D]` | Derived — no source artifact; **reconcile when the real docs arrive** |

When the PRD / UX Architecture / Design System are supplied, the `[D]` and
`[M]` values are the ones to re-check. Nothing else should need to move.

---

## 1. Touch targets override reference geometry

**Reference:** the lead-card CTA measures **110.7 × 33.3 CSS px**
(measured: blob `x589-808 y571-637` at scale 1.979 on
`a_vertical_smartphone_screenshot_of_a_marathi_app.png`).

**Implemented:** 110 × **48** px.

**Reason:** source requirement §9 sets a universal 48dp floor, with 72dp for
sunlight primary controls, 64dp for slate evidence controls and a 72dp
shutter. Source requirements outrank reference geometry (hierarchy level 1
over level 3). A 33px control is not operable with gloves in the field.

**Consequence:** the lead card stands at **97px** against the reference's
**89px**, and the list is correspondingly ~8px/card taller. This is the single
largest remaining visual delta on S-R-02 and it is intentional.

Same reasoning applies to the header capture pill, the search/filter row and
the map controls, all of which the references draw between 33px and 44px.

## 2. Stat-tile labels wrap to two lines

**Reference:** `आजचे लीड्स (परिसरात)` renders on one line in a ~76px box,
which implies a font size of roughly **7.6px**.

**Implemented:** 9.5px, wrapping to two lines where needed.

**Reason:** 7.6px fails legibility for a field app used in sunlight, and would
not survive the 200% text-scale requirement in §9. Wrapping is the
non-clipping resolution §7 demands ("never solve overflow by clipping").

## 3. `overflow-wrap` is `break-word`, not `anywhere`

`anywhere` shredded Devanagari mid-syllable (`आज | ची | नेम | णू | क`) in the
stat tiles. `break-word` only breaks a word that cannot fit alone, which is
the behaviour the references show. Fixed once in `.aiec-no-clip`, which is why
it corrected every screen at once (rule 18).

## 4. Map basemap is drawn, not photographic

**Reference:** a photographic map tile with pins baked in.

**Implemented:** an inline SVG basemap with `MapEntity` pins rendered from
lifecycle data.

**Reason:** a baked tile cannot answer "which of these is blocked". Pins must
carry lifecycle state to satisfy §11 and the role-filtering in §10. The road
network, parks, river and locality labels approximate the reference's
composition; they are not a street-accurate map of Pune.

## 5. DemoRibbon defaults to off

The `DemoRibbon` primitive is required by §4 and is implemented, but defaults
to **off** so renders match the references, which show no ribbon. Enable with
`?demo=1`. A production session would drive it from session state.

## 6. Status chips carry reference wording over canonical state labels

The map legend defines eight canonical lifecycle labels. The list cards in the
references use narrower wording for the same states — e.g. a `selling` lead
reads `फॉलो-अप आवश्यक` or `चर्चा सुरू`, not `विक्री प्रक्रियेत`.

`StatusGrammar.chipLabel` carries that reference wording. The **state**, and
therefore the colour, stays canonical. §7 requires reference text be
preserved; inventing a parallel label taxonomy without source docs would be
worse than carrying both.

## 7. Status dots are opt-in

The references show dots in the map legend but plain tinted pills in list
cards. `StatusIndicator` takes `dot` (default `false`); the legend and the
five-slot disclosure set it. Colour is never the sole carrier — every chip
also carries its text label.

## 8. Viewfinder photo is a crop of the reference's own frame

`camera-frame.jpg` is cropped from the capture reference at
`x205-645 y780-1090`, a region clear of the framing brackets and overlay
pills. Content is faithful; the framing is tighter than the reference's full
viewfinder because the overlay chrome could not be removed from the source.

## 9. Success-screen "स्थिती" row shows the submission result

The reference reads `यशस्वी` in green. An earlier build rendered the lead's
lifecycle chip (`नवीन लीड`) there, which was wrong on the facts: the
submission succeeded; the lead's journey has not started. Corrected to match
the reference.

## 10. Payout screen drops the duplicate net-amount strip

`NextAction` can render a value strip above the button. On S-R-05 the net
amount already appears in the payment card directly above, and the reference
shows no such strip, so it is omitted there. It is used on S-R-07, where the
reference does show the earning beside the action.

## 11. The second tab is labelled inconsistently across the references

The bottom navigation's second tab reads **माझे लीड्स** on 7 references and
**माझी नोंद / माझी नोंदस** on 8 others — for the same destination. A shipping
app cannot relabel a tab per screen, so the app uses **माझे लीड्स** throughout
(it appears on the primary surfaces: home, leads, lead detail, submission
success, and on the records list itself).

This also settles a larger question: the "स्क्रीन N/10" screens are **not a
second role**. They carry the identical 4-tab bar including **कमाई**
(earnings), and the profile screen names the user *रायडर · लेव्हल 1*. They are
the same Rider in the record/compliance section of the app.

## 12. "स्क्रीन N/10" badges are not reproduced

Every record-flow reference carries an orange pill reading स्क्रीन 7/10,
8/10 … 14/10. This is design-deck annotation, not product chrome — the
numbering counts mockups and runs past its own denominator (14/10). It is
omitted.

## 13. Certificate download is gated (S-R-09)

**Reference:** "प्रमाणपत्र डाउनलोड करा" is drawn as an enabled primary button.

**Same screen's timeline:** *"पडताळणी झाल्यावर प्रमाणपत्र उपलब्ध होईल"* — the
certificate only exists after AIEC's final review, which the timeline shows as
still in progress.

**Implemented:** a `KeyringGate` naming why it is locked, who unlocks it (the
AIEC verification team), what is required (final review) and what happens next.

**Reason:** §12 — never fake an enabled action. Rendering a button that cannot
do what it says is exactly the failure that rule names.

## 14. Continue is gated on the document requirement (S-R-11)

**Reference:** "पुढे" is enabled while document 5 is still uploading (68%) and
document 6 has not been supplied — both marked required with a red asterisk on
that very screen.

**Implemented:** `KeyringGate` with an evidence requirement showing 4 of 6
complete, and a meter.

**Reason:** §12, as above. The screen already states the requirement; the
action must honour it.

## 15. Feedback submit is gated on the required rating (S-R-16)

The screen marks the rating question "* आवश्यक". Submit is therefore a lock
with a stated reason until a rating exists, rather than a button that rejects
silently.

## 16. Marathi quantity grammar in the evidence meter

The gate meter first read `{done} पैकी {total} पूर्ण`, which renders "4 पैकी 6"
— *6 out of 4*. In Marathi "X पैकी Y" means "Y out of X", so the total comes
first. Corrected to `{total} पैकी {done} पूर्ण`. Caught by reading the rendered
gate, not by the type system.

## 17. रद्द chips use the canonical closed colour

The records list draws the रद्द chip in **red**. The map legend — the
definitional artifact for lifecycle colour — assigns red to **अडचणीत**
(blocked) and near-black to **रद्द / बंद** (closed). The app follows the
legend, so a cancelled record reads muted rather than alarming, and red stays
reserved for states that need action.

## 18. Payment-method selection uses the primary accent

The rider payout screen (S-R-05) draws the selected option in orange; the fee
screen (S-R-12) draws it in blue. One app, one selection colour: orange, the
primary accent, in both. Rule 18 — converge on one visual system.

## 19. Progress meters rendered empty (fixed)

Both `.aiec-meter` (construction progress) and `.aiec-gate__meter` (the
KeyringGate evidence meter) are rendered as `<span>`. Inline boxes ignore
width and height, so every fill collapsed to 0x0 and each meter always read
empty — including the gate's "4 of 6 documents" bar, whose whole job is to
show how much is left. Fixed by making both `display: block`. Caught by the
render-compare pass, then confirmed by measuring the element rather than
trusting the screenshot.

## 20. Extracted assets are cropped clear of reference chrome

Content photography is cropped from the references themselves. Three crops had
to be redone because they carried baked-in UI: the viewfinder crop included the
framing brackets, and the five evidence tiles included the reference's own ×
remove badges, which rendered as phantom close buttons on the record-detail
thumbnail strip. All assets are now photography only.

---

## Known gaps (not deviations — unfinished work)

- **`/earnings` is a placeholder.** The tab bar routes to it, but the reference
  set contains no earnings screen to build against.
- The record-detail tabs beyond सविस्तर माहिती (प्रगती / फोटो / दस्तऐवज / नोंदी)
  render an honest "not built yet" rather than invented content. प्रगती exists
  as its own screen at `/records/:id/progress`.
- `OfflineQueue` renders only when `online` is false; there is no service
  worker or real queue persistence behind it.
- No unit or E2E suite. The automated gates are `tools/qa.mjs`
  (overflow, touch floor, 200% text scale) across 16 screens × 7 widths.

---

## Visual QA scores (§17)

Scored against the composites in `.artifacts/compare/`. Honest
self-assessments, not targets.

| Screen | Layout /20 | Type /15 | Space /15 | Comp /15 | Color /10 | Nav /10 | Content /5 | Resp /5 | A11y /5 | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|
| S-R-01 home | 18 | 13 | 13 | 13 | 9 | 10 | 4 | 5 | 5 | **90** |
| S-R-02 leads | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |
| S-R-03 capture | 18 | 13 | 13 | 14 | 9 | 10 | 5 | 5 | 5 | **92** |
| S-R-04 sitephotos | 19 | 13 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **94** |
| S-R-05 payout | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |
| S-R-06 success | 18 | 13 | 13 | 14 | 10 | 10 | 4 | 5 | 5 | **92** |
| S-R-07 leaddetail | 18 | 13 | 13 | 13 | 9 | 10 | 4 | 5 | 5 | **90** |
| S-R-08 records | 19 | 14 | 13 | 14 | 9 | 10 | 5 | 5 | 5 | **94** |
| S-R-09 recdetail | 18 | 13 | 12 | 13 | 10 | 10 | 4 | 5 | 5 | **90** |
| S-R-10 progress | 18 | 13 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **93** |
| S-R-11 documents | 19 | 13 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **94** |
| S-R-12 fees | 19 | 14 | 13 | 14 | 9 | 10 | 5 | 5 | 5 | **94** |
| S-R-13 feepaid | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |
| S-R-14 notifications | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |
| S-R-15 profile | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |
| S-R-16 feedback | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |

**Six screens reach the 95 target; ten sit at 90–94.**

### The 95 target conflicts with the touch-target requirement

Spacing scores 12–13/15 on *every* screen for one shared reason: deviation #1.
The references draw controls at 33–44px (lead-card CTA 33px, carousel arrows
36px, chrome pills ~40px); §9 mandates a 48px floor with 72dp primary and
shutter controls. Honouring §9 makes every screen measurably taller, and those
points cannot be recovered without breaking a source requirement that outranks
the reference.

The remaining recoverable points:

- **Map fidelity (S-R-01, S-R-07):** the drawn basemap is sparser than the
  reference tile — denser road geometry and more locality labels, ~2 points each.
- **S-R-09 record detail:** the densest screen in the set; the fact grid and
  carousel still run taller than the reference.
- **Typography across the board:** the exact type ramp is still inferred. The
  real Design System would settle it and remains the highest-value input.

**Recommendation unchanged:** supply the source documents so the type ramp and
spacing scale can be read rather than inferred, or confirm that §9's touch
minimums yield to reference geometry. Those are the two levers that move the
remaining screens to 95.
