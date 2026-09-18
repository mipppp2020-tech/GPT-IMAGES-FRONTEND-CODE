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

---

## Known gaps (not deviations — unfinished work)

- **9 of 16 reference screens are not built.** The tranche delivered is the
  seven Rider-role screens. The remaining nine belong to a second role flow
  (bottom nav `माझी नोंद`, screens numbered `स्क्रीन 7/10` … `14/10`): record
  list, record detail, construction progress, document upload, fee payment,
  payment success, notifications, profile, feedback.
- `/earnings`, `/profile` and `/notifications` are honest placeholders.
- `OfflineQueue` renders only when `online` is false; there is no service
  worker or real queue persistence behind it yet.
- No unit or E2E test suite. The automated gates that do exist are
  `tools/qa.mjs` (overflow, touch floor, 200% text scale).

---

## Visual QA scores (§17)

Scored against the rendered-vs-reference composites in `.artifacts/compare/`.
These are honest self-assessments, not targets.

| Screen | Layout /20 | Type /15 | Space /15 | Comp /15 | Color /10 | Nav /10 | Content /5 | Resp /5 | A11y /5 | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|
| S-R-01 home | 18 | 13 | 13 | 13 | 9 | 10 | 4 | 5 | 5 | **90** |
| S-R-02 leads | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |
| S-R-03 capture | 18 | 13 | 13 | 14 | 9 | 10 | 4 | 5 | 5 | **91** |
| S-R-04 sitephotos | 19 | 13 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **94** |
| S-R-05 payout | 19 | 14 | 13 | 14 | 10 | 10 | 5 | 5 | 5 | **95** |
| S-R-06 success | 18 | 13 | 13 | 14 | 10 | 10 | 4 | 5 | 5 | **92** |
| S-R-07 leaddetail | 18 | 13 | 13 | 13 | 9 | 10 | 4 | 5 | 5 | **90** |

**Two screens reach the 95 target; five do not.**

### The 95 target conflicts with the touch-target requirement

Spacing scores 13/15 on *every* screen for one shared reason: deviation #1.
The references were drawn with 33–44px controls; §9 mandates a 48px floor and
72dp primary controls. Honouring §9 makes every screen measurably taller than
its reference, and those spacing points cannot be recovered without breaking a
source requirement that outranks the reference.

So on the spacing axis the ceiling is structural, not a matter of more
iteration. The remaining recoverable points are:

- **Colour/content on S-R-01 and S-R-07 (map):** the drawn basemap is sparser
  than the reference tile. Denser road geometry and more locality labels would
  recover ~2 points each.
- **Content on S-R-03 and S-R-06:** viewfinder framing and confetti scatter.
- **Typography across the board:** the reference's exact type ramp is still
  inferred. The real Design System would settle this and is the single
  highest-value input remaining.

**Recommendation:** either supply the source documents so the type ramp and
spacing scale can be read rather than inferred, or confirm that §9's touch
minimums should yield to reference geometry — those are the two levers that
move the remaining screens to 95.
