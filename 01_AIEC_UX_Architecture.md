# AIEC — UX ARCHITECTURE
### Derived from Platform Operating Manual v3.0 · Pune, Maharashtra
### Covers: Part 1 (Principles) · Part 2 (Role UX) · Part 3 (Global Interaction System)

---

## PART 0 — THE READ

Nine things in the manual that decide the interface. These are not opinions about design. They are consequences of what the business already committed to.

---

### 1. This is not a workflow app with payments attached. It is a keyring.

Count the locks the manual defines:

```
5 payment gates      token → QC clearance → 90% → evidence → final 10%
1 physical lock      triple-key container (customer OTP + technician biometric + system)
8 material pouches   KIT-A…KIT-H, each unlocking at a named SOP step
24 evidence gates    every SOP step gated on AI photo verification
1 sequence lock      Step 8 evidence cannot exist before Step 7 verifies
1 margin floor       20%, uncodeable below, Owner override only
1 rotation lock      same QC cannot audit same technician within 90 days
```

Every one of those is a lock with exactly one key, and the key is always either **a rupee or a photograph**. Nothing else opens anything in this system.

That gives the whole product a single organising object. Not "job," not "task," not "order" — **gate**. And it gives every screen in the app one universal question to answer before anything else:

> **Which lock am I standing at, and what key opens it?**

If a screen cannot answer that in under two seconds, it is the wrong screen. This is the spine of everything below.

---

### 2. Law 2 already spent your colour budget.

The map legend assigns fixed meaning to eight hues: grey, blue, purple, orange, yellow, green, red, black. Those hues are now **semantic**. They cannot also be brand or action colours, because a blue button next to a blue pin teaches the user that blue means two different things — and the user will resolve that ambiguity by trusting neither.

Two collisions exist already in the manual as written:

- **Sunlight** (Rider) is specified white/orange. Orange in the legend means *container in transit*.
- **Command** (Admin) is a dark console over a map full of blue and red pins.

Resolution, applied globally and without exception:

> **Pins own the lifecycle hues. Controls own the role accent. Neither borrows.**

No control anywhere is filled with a legend hue. No pin anywhere is filled with a role accent. On map surfaces, primary actions render as maximum-contrast ink or inverse-ink — zero hue — so that every coloured pixel on a map means *state*, never *affordance*. Full ramps in the design system doc.

---

### 3. Latency here is measured in days. So the waiting state is the product.

Shaft readiness: 14 days. Installation: 14 days. Container transit: hours. Payment window: 48 hours. Appeal: 4 hours. Payout: every Friday.

A customer's screen spends roughly **90% of its lifetime in a waiting state.** So does a supplier's. Most product teams design the happy path and treat waiting as the gap between screens. Here, waiting *is* the screen — and the manual has already told us what makes it bearable:

> *"Every delay has an owner in the data. The deadline is enforceable because the blame is attributable."*

That sentence is a UI specification. If the system knows who is holding the ball at every moment, the interface must always say so. Which produces the single most reused primitive in this app — the **Custody Line** (Part 3):

```
Waiting on you
Shaft photos, 6 of 10 done
Due 25 Aug · 4 days left
If it slips: your material slot releases to the next site
```

Four facts: who, what, by when, and what happens otherwise. That block replaces the word "Pending" everywhere in this product. There is no screen in AIEC where "Pending" is an acceptable string.

---

### 4. The largest UX risk in the business has no component in your list.

Risk register, item 6:

> *"If the vision model wrongly rejects a legitimate photo, an honest technician goes unpaid. This is the fastest possible way to destroy trust in the platform. Human appeal path within 4 hours, on every rejection. Pay the worker while the appeal is pending."*

The workflow component library (§36 of the brief) has `VerificationResult`. It has no appeal. An AI verdict with no visible, one-tap, pay-while-pending appeal is not a UI gap — it is the mechanism by which a technician network learns to distrust the app, and that story travels faster than any recruitment campaign.

`AppealPath` is added as a **required child of every negative machine verdict in the system.** It is specified in Part 3. It is not optional, not a settings-menu item, and not a support ticket. It sits inside the rejection card, above the retake button.

---

### 5. Two of your three languages have no capitals and no italics.

Devanagari — Marathi and Hindi — is unicameral. There is no uppercase. It also has no true italic, and letter-spacing breaks its conjunct forms.

So every hierarchy device that Latin UI reaches for by default silently fails for the majority of your field workforce:

| Device | English | मराठी / हिंदी |
|---|---|---|
| ALL-CAPS labels | works | does not exist |
| *Italic* emphasis | works | does not exist |
| Letter-spaced eyebrows | works | breaks conjuncts |
| Small-caps | works | does not exist |

If the design system builds hierarchy on caps and tracking, the Marathi build of this app will look flat and unstructured next to the English one — and Marathi is the *default* language for Riders and Technicians, the two roles that touch the app most.

Consequence: **hierarchy is built from weight, size, colour and space only.** Caps are permitted in exactly two places (gate names and priority codes P0–P4), and both are treated as glyphs rather than words. Devanagari text also runs 15–30% longer than English, which is why the type system below uses a variable-width family rather than a fixed one.

---

### 6. Offline is the technician's normal posture, not an error condition.

*"Concrete shafts and basements have no signal. If the app requires connectivity, it fails at the exact moment it matters most."*

Standard offline UX is an apology: a red bar, a warning triangle, a retry. Show that to a technician forty times a day and the app reads as broken.

Invert the polarity in Slate:

- Offline is **quiet and expected** — a small queue counter, no colour, no alarm.
- **Reconnection** is the event worth animating — the sync sweep, the count going to zero, the "3 of 3 synced, ₹4,200 cleared."
- The word "error" never appears for a shaft with no signal. The user sees a **queue depth**, not a failure.

The Slate theme is designed offline-first and treats connectivity as a bonus. Sunlight and Premium are designed online-first with graceful degradation. That is a genuine architectural fork between themes, not a preference.

---

### 7. Role boundaries are load-bearing, so they belong in the component contract.

The manual is explicit and correct:

> *"The customer sees progress and evidence, not the technician's payment or penalty data. Exposing a worker's earnings and penalties to the client destroys the worker's dignity and invites interference."*

The same event — *Step 7 verified at 11:42* — must render as three different objects:

| Role | What they see |
|---|---|
| Technician | ₹2,800 credited to Pending · Step 8 unlocked · streak intact |
| Customer | Guide rails aligned, verified 11:42, 2 photos · on schedule |
| Admin | SOPX-0089-07 verified, AI confidence 0.94, first-attempt pass |

If that filtering happens at screen-assembly time, it will leak the first time someone builds a new screen in a hurry. It has to happen at the **event contract** level: every event carries a `visibility` map, and no component can render a field its current role is not granted. Specified in Part 3 as the Event Spine.

---

### 8. Demo mode is a sales surface, not a developer convenience.

Law 10 plus the seven-minute demo script in Part 13 mean the demo path is how investors, city partners and job candidates form their first opinion of the company. It gets designed with the same care as the customer's progress ring.

Which means three things the brief did not ask for:

- A **role switcher** that exists only in demo, is fast, and is beautiful — the script switches roles six times in seven minutes.
- A **seeded state that is visually alive on second one**. 40 leads, containers actually moving, a leaderboard with names. An empty demo kills conversion.
- The **"DEMO MODE" ribbon** designed as a deliberate brand element rather than a warning banner, since it will be on screen throughout every pitch this company ever gives.

---

### 9. The manual already wrote your acceptance criteria.

Eleven hard time budgets are scattered through the document. Collected, they are the definition of "done" for this UI — more useful than any subjective quality bar:

| Interaction | Budget | Source |
|---|---|---|
| Install → inside the app | 90 sec | Part 1 |
| Rider lead capture, 3 photos + confirm | **11 sec target, 15 sec failure** | Part 2 |
| Camera cold start (derived, from the above) | ≤ 800 ms | — |
| Lead → first WhatsApp | 60 sec | Part 3 |
| Lead → quotation | 9 min | Part 3 |
| Admin alert → decision | **90 sec median** | Part 9 |
| Owner screen → comprehension | 10 sec | Part 10 |
| Candidate → first job accepted | 48 hr | Part 8 |
| Evidence rejection → human appeal resolved | 4 hr | Part 14 |
| P0 unacknowledged → Owner's phone | 15 min | Part 14 |
| Triple-key: all three keys | same 5-min window | Part 4 |

Every one of these is measurable in a test. Part 5 of the deliverable set will attach the relevant budget to each screen as its pass condition.

---
---

## PART 1 — THE TEN INTERFACE LAWS

The manual has 12 business laws. These are the 10 interface laws that carry them. Each one names what it forbids, because a principle that forbids nothing changes nothing.

---

### LAW I — The interface is a keyring

**Every screen states which lock the user is at and which key opens it.**

Carries business Laws 1, 3 and 12. There are 40+ locks in this system and exactly two kinds of key: money and proof. The user should never have to work out which one they need.

**Forbids:** a disabled button with no explanation · the word "Pending" · a greyed control whose requirement is not stated adjacent to it · a locked state that does not name the person who can unlock it.

**Produces:** `KeyringGate`, `CustodyLine`, `NextAction`.

**Test:** cover the screen's title. Can a stranger still say what is blocked and what would unblock it? If not, redesign.

---

### LAW II — Every wait has an owner

**No status is displayed without custody, requirement, clock and consequence.**

The manual's own reasoning: the two-week deadline is enforceable *because blame is attributable*. Attribution the system holds but does not display is attribution that does not exist for the user.

**Forbids:** "Processing" · "In progress" · "Awaiting approval" · any status string that does not name a party.

**Produces:** the `CustodyLine` primitive, used in the customer's progress screen, the supplier's order board, the admin's queue, the technician's blocked step, and every timeline node.

**Test:** every status on screen must survive the question "who is holding this right now?" Answered by the pixels, not by a support call.

---

### LAW III — The system speaks first

**Screens open with what the system has decided, then what the user may do about it.**

Business Law 3 makes the AI the supervisor, not an assistant. That inverts the normal grammar of an app. This is not a toolbox the user picks from; it is a shift the user is being run through, and the manual's own daily schedules make that explicit — *"the user does not decide what to do next; the app tells them."*

Screen grammar, everywhere:

```
1  DIRECTIVE      what the system has decided / what is due now
2  CONTEXT        the minimum needed to act on it
3  RESPONSE       one dominant action
4  ALTERNATIVES   visually subordinate, never absent
```

**Forbids:** a home screen that is a menu · three equal-weight buttons · a landing state with no directive · "What would you like to do?"

**Exception, deliberate:** the QC checklist. See Law VII.

---

### LAW IV — Verification protects the worker; it never accuses them

**Anti-fraud machinery is surfaced as protection of the user's money, not as detection of the user's dishonesty.**

The technician's app runs geofencing, server timestamps, perceptual hashing, screen-of-a-screen detection and periodic face matching. Every one of those is necessary. Every one of them, phrased carelessly, tells an honest worker that they are suspected.

Same data, two framings:

| Accusatory (forbidden) | Protective (required) |
|---|---|
| Location verified | Proof locked to this site |
| Duplicate check passed | This photo is now yours alone |
| Identity confirmed | Your ₹2,800 is protected |
| Photo rejected: reused image | This photo already earned on another step |

**Forbids:** the words *verified*, *validated*, *detected*, *flagged* in any worker-facing string · displaying a confidence score to a worker · surveillance language in welfare features.

The manual makes this distinction itself when it calls the 90-minute stationary ping *"safety, not surveillance."* That is the tone for the entire field-facing product.

---

### LAW V — Every machine verdict carries an appeal, and the appeal pays

**No automated negative decision is rendered without a visible human path, and payment is not withheld while that path is open.**

Risk register item 6, made structural. The appeal is inside the rejection card, one tap, resolved in four hours, with the credit sitting in Pending and visible throughout.

**Forbids:** an AI rejection whose only actions are *Retake* and *Dismiss* · an appeal buried in support · a frozen credit with no timer showing when a human will look at it.

**Produces:** `AppealPath`, `VerificationResult`, and the four-hour countdown chip.

---

### LAW VI — Money is never a bare number

**Every money element states amount, state, cause and consequence, and lands within three seconds of the act that earned it.**

Business Law 4 sets the three-second budget. The four-part structure is what turns a credit into an incentive:

```
₹2,800                        amount
added to Pending              state
Step 6 verified · 11:04       cause
Clears Friday · Step 7 open   consequence
```

**Forbids:** a rupee figure without its state (Pending / Cleared / Held / Deducted) · a credit with no tap-through to the evidence that earned it · a penalty applied without its reason and its appeal · exposing any worker's money to a customer.

---

### LAW VII — One dominant action, with two named exceptions

**Each screen has one primary job and one dominant control — except where a dominant control would corrupt the decision.**

Two exceptions, both deliberate:

**Exception 1 — the QC checklist.** PASS and FAIL must be *equally* easy to reach, equally sized, equally weighted. The manual builds an entire anti-rubber-stamp economy (₹150 for catching a real defect, −₹1,000 for missing one, Level 5 revocation on repeat). A UI that makes PASS the fat green primary button quietly fights that economy on every tap. Symmetry here is the ethical choice and the correct one.

**Exception 2 — SOS.** On every technician and QC screen the emergency control is permanently present in the reachable thumb zone. It does not compete with the primary action; it outranks it. The manual is explicit: *"Safety must visually dominate speed."*

**Forbids:** anywhere else, two controls of equal visual weight.

---

### LAW VIII — Offline is a posture, not a failure

**In field themes, absence of network is quiet and expected; restoration is the event worth showing.**

**Forbids:** red error styling for a known-offline environment · blocking any capture on connectivity · the word "failed" for a queued item · losing a photo, ever, under any circumstance.

**Produces:** `OfflineQueue` with queue-depth semantics, and the reconnection sweep — the one animation in Slate that is allowed to be expressive.

---

### LAW IX — Role boundaries are enforced by the component, not the screen

**Every event carries a visibility map. No component renders a field its role is not granted.**

**Forbids:** worker earnings or penalties on any customer surface · customer deal value on any technician surface · another rider's lead detail beyond the fact of its existence · one technician's rank data inside another's job view.

---

### LAW X — Every screen ships with a time budget

**A screen is not done when it looks right. It is done when it hits its number.**

The eleven budgets in Part 0.9 are attached to screens as pass conditions and re-measured on a ₹8,000 Android at 360px with a throttled connection — the manual's stated target device, not a developer's phone.

---

### The falsification test

Before any screen is approved, it has to survive all six. One failure is a redesign, not a backlog ticket.

1. **Cover the header.** Is the current lock and its key still obvious?
2. **Read every status aloud.** Does each one name a party and a clock?
3. **Translate to Marathi.** Does the hierarchy survive with no caps, no italics, and 25% more text?
4. **Kill the network.** Does anything turn red that shouldn't?
5. **Scale text to 200% on a 360px screen.** Does the primary action stay reachable and whole?
6. **Hand it to someone wearing work gloves in a dark room.** Can they complete the primary job?

---
---

## PART 2 — ROLE UX

Nine roles. Each with a design thesis, because a role without a thesis becomes a settings screen.

---

### 2.1 — RIDER · *Sunlight*

> **Thesis: this is a camera with a map behind it.**

**Mindset.** Ravi is paid ₹40 a capture and ₹1,500 when one converts. He is not browsing. He is hunting, and he is doing arithmetic about lunch and rent while he rides. His relationship with the app is transactional and rhythmic: see shaft, stop bike, three photos, hear the coin, ride on.

**Environment.** Direct Pune sun. Helmet on. One hand. Bike engine noise. Dust on the lens. Battery anxiety by 3pm. A phone that cost ₹8,000.

**Primary job.** Capture a valid lead in 11 seconds without removing the helmet.

**The loop.**
```
Push at 07:45 (voice, Marathi)
   → Schedule screen, one button
   → Map, capture-ready, no menu between him and the shutter
   → 3 taps, camera never closes
   → Confirm screen, everything pre-filled by OCR, nothing mandatory
   → Coin · +₹40 · top strip updates
   → back on the map, already capture-ready
```

**Information hierarchy.**
1. The capture button. Nothing on this screen outranks it.
2. Today's count, today's rupees, distance — one thin strip, glanceable at arm's length.
3. Heat blobs (where to go next) and his own pins.
4. Everything else lives behind the nav.

**Interaction style.** Thumb-only, bottom-third. Voice as a first-class input on every correction field, not a novelty. OCR fills, the rider only corrects. Zero mandatory typing anywhere in the capture path — the moment a keyboard opens with a helmet on, the flow is dead.

**Navigation.** Four items: Map · Leads · Earnings · More. The map is home and is never more than one tap away from any screen.

**Visual.** Maximum luminance contrast, because sunlight destroys hue contrast before it destroys lightness contrast. 72dp primary controls. 22pt minimum body. Photography-forward: his own captured photos are the texture of the app, not stock imagery.

**Motion.** Two moments only. The **coin** (700ms, sound, haptic, interruptible, never blocks the next capture) and the **pin drop** onto the map, which spatially explains that his photo became a location. Everything else is instant. A rider on a bike has no patience for a transition.

**Error handling.**
- No GPS: the capture button states its own condition — *"Step outside. GPS is what makes this lead yours."* Protective framing, Law IV.
- Duplicate within 50m: shows *whose* pin and *when*, with a tap-through. Not a bare rejection.
- Low quality: the ₹10-instead-of-₹40 case is offered as a **choice with a visible price**, not a punishment — *"Photo unclear. Retake for the full ₹40, or submit for ₹10."*
- Offline: capture never blocks. Wallet shows the amount with a sync marker, and it is never styled as an error.

**Time budget.** 11 seconds, shutter-ready in 800ms. **Breaks if:** the confirm screen ever gains a required field.

---

### 2.2 — SALES DESK · *Command, light*

> **Thesis: the human only ever sees what the machine could not close.**

**Mindset.** Ninety percent of this role is a bot. The human operator exists for two situations: a customer below the 30% discount line, and a customer who asked for a person. Both are already tense by the time they arrive.

**Environment.** Desktop, indoors, headset on, several deals open at once.

**Primary job.** Close an escalated deal without dropping below 20% margin.

**The loop.** Escalation lands fully assembled — full bot transcript, every quote version, the stated objection, the exact margin position, and the AI's recommended counter with a predicted win probability. The operator reads for 30 seconds, calls, moves one slider, sends.

**Information hierarchy.** The **margin position** is the largest object on the screen — a single bar showing list price, current offer, the bot's floor, and the hard 20% wall. Everything else is supporting evidence. This screen exists to protect one number.

**Interaction style.** Keyboard-first. Every escalated deal is reachable by shortcut. The price control is a constrained slider that **physically cannot travel below 20%** — the wall is rendered, not validated after the fact. A form that lets you type an illegal number and then scolds you is a worse design than one where the number does not exist.

**Navigation.** Pipeline map is home. The lasso tool filters the funnel geographically, which matters because zone conversion history is 15% of the lead score.

**Visual.** Dense, light, two-panel. Deal on the left, evidence on the right. This is the only role where information density beats whitespace and there is no shame in it.

**Motion.** Almost none. A margin slider that snaps at the bot floor and stops dead at the 20% wall, with a haptic on desktop trackpads. That resistance *is* the design.

**Error handling.** Below-20% requests do not fail — they route to an Owner approval with a mandatory written reason, and the operator sees where the request is sitting.

**Time budget.** 30 seconds from opening an escalation to being ready to speak. **Breaks if:** the operator has to open a second screen to find the objection.

---

### 2.3 — CUSTOMER · *Premium*

> **Thesis: one ring, one sentence, one button. Anxiety reduction is the product.**

**Mindset.** A builder or society secretary who has paid ₹10,000 against ₹6,15,000 and is now quietly worried they have been foolish. They will check this app at 11pm. They are comparing it, without realising, to their banking app — not to a service tracker.

**Environment.** Phone in the evening, tablet on site, desktop in the office. Good network. No urgency, plenty of anxiety.

**Primary job.** Know where their lift is, what happens next, and whether they need to do anything.

**The loop.** Open → ring → one sentence → one button. That is the entire design. Ninety percent of visits should end within eight seconds with the customer reassured and gone.

**Information hierarchy.**
1. The **progress ring**, gold, with the stage name inside it.
2. One sentence of custody — who holds the ball right now.
3. One primary action, or explicitly none: *"Nothing needed from you today."*
4. Below the fold: evidence, drawings, payments, container, AMC.

**Interaction style.** Slow, generous, unhurried. Large photography — the technician's own evidence photos are the best trust asset this company has, and they are free. Every payment is preceded by a plain statement of what it unlocks and what happens if it is not made. No dark patterns, no urgency banners, no countdown badges on money.

**Navigation.** Three items: My Lift · Payments · Support. Nothing else earns a permanent slot.

**Visual.** White and warm gold, serif display for Latin and a matched Devanagari serif for Marathi and Hindi (see design system — this pairing is the difference between a premium brand and a premium *English* brand). Generous whitespace. The most expensive-feeling surface in the product, because it carries the entire perceived value of an ₹8-lakh purchase.

**Motion.** Restrained and ceremonial. Three moments only:
- The **ring advancing** on each milestone, 420ms, once.
- The **container arriving** — the map pin settling at their address.
- The **NOC release** — the single longest animation in the entire product, roughly 1.4s, a seal forming. It happens once per customer, at the emotional peak of the relationship, and it should be the thing they screenshot.

**Error handling.** Failures are always paired with what is already safe. *"Payment didn't go through. Your material is still locked and waiting at your gate — nothing has been lost. The window closes in 41 hours."* Never a bare failure on a screen carrying five lakh rupees.

**Time budget.** 8 seconds to comprehension. **Breaks if:** the ring ever shows two primary actions at once.

---

### 2.4 — QC INSPECTOR · *Slate, judicial variant*

> **Thesis: a judge's bench, not a worker's toolbox. It must be as easy to fail something as to pass it.**

**Mindset.** A promoted Level 5 technician who now judges work instead of doing it. They earn ₹150 for catching a real defect and lose ₹1,000 for missing one. The economics tell them to be sceptical; the interface must not talk them out of it.

**Environment.** Same shafts as the technician, but arriving cold, sometimes unannounced, with a torque wrench and a laser in hand.

**Primary job.** Reach an honest verdict on 18–30 items and produce evidence that survives a dispute.

**The loop.** Task card (site, distance, type, duration, fee) → accept → geofenced check-in → grouped checklist → per-item verdict + mandatory photo → AI cross-check against GA drawing tolerance → signature → instant credit.

**Information hierarchy.** The **current checklist item** and its reference photograph. The Help button on any item shows the correct/incorrect reference pair for that specific check — which is the single highest-value help surface in the product, because it is the difference between a judgement and a guess.

**Interaction style.** **PASS · CONDITIONAL · FAIL rendered as three equal segments.** No default selection. No colour advantage for PASS. This is the deliberate exception to Law VII and the reason is economic: a green primary button biases toward approval, and approval bias is exactly what the anti-rubber-stamp mechanism exists to prevent. Design the affordance to be neutral and let the inspector be the judgement.

**Navigation.** Inspection map is home, sorted by real driving distance rather than straight-line — the manual is specific about this, and it is correct, because straight-line distance in Pune is a lie.

**Visual.** Slate, camera-dominant, but with more text room than the technician's build. Inspectors read and write; technicians shoot and move.

**Motion.** Minimal and procedural. A verdict commits with a small definite snap. Nothing celebratory — a QC pass is not the inspector's win.

**Error handling.** A FAIL is never a dead end. It generates the annotated rework list, books the re-inspection, and notifies the customer in their language, all from one screen. The inspector's job ends when they submit; the system carries the consequence.

**Time budget.** 45 minutes for an 18-item shaft clearance. **Breaks if:** PASS is ever one tap cheaper than FAIL.

---

### 2.5 — SUPPLIER · *Command, warehouse variant*

> **Thesis: a packing line, not an order portal.**

**Mindset.** An independent fabricator who has been trained by this industry to expect 90-day credit and is being offered same-day payment. The entire relationship rests on that promise being visible and kept.

**Environment.** Warehouse floor with a tablet, office desktop, a driver's phone. Gloves, dust, barcode scanner, noise.

**Primary job.** Pack eight phase-sealed kits correctly, load, seal, dispatch.

**The loop.** Order board → accept within the 4-hour window → kit packing, one pouch at a time, scan-driven → container load, scan each kit in → digital seal → IoT array arms → live fleet map → arrival → payment lands same day.

**Information hierarchy.** The **payment date on every order card**, always. That is the differentiator this company is selling to suppliers, and it should never be more than one glance away. Then the deadline and the penalty band, then the contents.

**Interaction style.** Barcode-first. The scan target is the largest interactive element on the packing screen. Kit packing is a strict, satisfying sequence: scan the pouch, scan each item, seal, next. A packing screen that requires typing on a warehouse floor will be worked around within a week, and the workaround is what creates the shortfalls the kit system exists to prevent.

**Navigation.** Order Board is home, not the map. This is the one field-adjacent role where a board beats a map, because the supplier's work is a queue, not a territory. The fleet map is a separate view they open when a customer calls.

**Visual.** Light, dense, high-contrast for warehouse lighting. Kit labels bilingual, as the manual specifies.

**Motion.** The seal. When the container seals and the IoT array arms, that is a real moment of transferred responsibility and deserves 900ms of confirmation.

**Error handling.** A BOM mismatch at packing is caught at the pouch, not at the site. Cheapest possible place to find it.

**Time budget.** 4-hour acceptance window, surfaced as a live countdown on the card. **Breaks if:** packing requires a keyboard.

---

### 2.6 — TECHNICIAN · *Slate*

> **Thesis: the shaft is dark, the hands are dirty, the money is real. This is the highest-risk surface in the product.**

**Mindset.** Paid entirely on verified output — ₹1,200 to ₹3,500 a step, 24 steps, roughly ₹42,000 a job, with ₹5,000 riding on finishing inside fourteen days. Marathi or Hindi speaking. Every interaction with this app is either earning money or threatening it.

**Environment.** Inside a concrete shaft. Poor light. No signal. Gloves or dirty hands. Height. Noise. A harness. Time pressure. A cheap phone, possibly with a cracked screen.

**Primary job.** Complete one SOP step with four pieces of proof and get paid for it.

**The loop.**
```
08:00 geofenced check-in
   → today's step, one screen, one job
   → instructions in Marathi + 90-second video + safety line
   → KIT scan (pouch opens only because the prior step verified)
   → guided capture, 4 photos, camera at 60% of screen
   → AI check
      pass → ₹2,800 to Pending · Step 8 unlocks
      one fail → precise retake instruction, 2 retries
      two fails → frozen, admin queue, appeal open, timer visible
   → next step
```

**Information hierarchy.**
1. The current step and its evidence requirement. One step. Never a list.
2. The safety line for that step, always above the primary action, never collapsible.
3. The step's rupee value.
4. The 14-day clock — thin, persistent, silent when on track.
5. The full SOP tree is a separate screen, not clutter on this one.

**Interaction style.** Everything sized for gloves: 64dp minimum on any control in the evidence path, 72dp on the shutter. Vertical thumb reach only — nothing critical in the top third, because a phone held at chest height in a shaft is operated with one hand from below. Haptics carry as much information as sound, because a shaft is loud and a phone is often in a pocket between steps.

**Navigation.** Today · Jobs · SOP · Money · More. "Today" is the default and answers the only question that matters at 08:00.

**Visual.** Dark, low-glare, cyan accent. Camera occupies 60% of the evidence screen. Text large enough to read at arm's length in bad light. Safety content is the one element permitted to break the calm — it uses the reserved safety red and nothing else in the app is allowed to use that value.

**Motion.**
- **Money** — the credit lands within three seconds, with haptic, and does not block the next action.
- **Unlock** — the next step opening is a real state change and gets a distinct 420ms reveal. This is the pull-forward mechanism the whole SOP engine depends on.
- **Sync sweep** — on reconnection, the queue draining to zero.
- Nothing else moves. A technician on a ladder does not want a decorative interface.

**Error handling.** This is where the product is won or lost.

- **Rejection is specific.** Never *"evidence failed."* Always *"photo 2 — the torque reading isn't legible. Move closer and avoid the glare."* Plus the reference image for that exact shot.
- **Appeal is on the rejection card.** One tap, four-hour promise, credit visibly held in Pending, not deleted.
- **The frozen state is explained, and it has a clock.** A frozen step with no visible timeline is how you lose a technician permanently.
- **A locked kit explains which step is pending**, not that access is denied.
- **Site not ready** is a first-class flow, not an error: photograph it, the clock pauses, the delay is attributed to the customer, ₹500 wasted-trip fee is paid. The technician's screen should say *"Not your delay. ₹500 credited."* in the same breath.
- **SOS** is permanently present on every screen in this role.

**Time budget.** Shutter-ready in 800ms. Evidence verdict rendered as soon as it returns, never blocking. **Breaks if:** a rejection is ever generic, or an appeal is ever more than one tap away.

---

### 2.7 — CANDIDATE / ONBOARDING · *Sunlight, aspirational*

> **Thesis: a calculator, not a form. This page is the throughput valve of the company.**

**Mindset.** A job-seeker on a cheap phone, possibly low-literacy, quite likely being recruited by three other gig platforms this week. They will decide in about 40 seconds whether this is real.

**Primary job.** Get from curiosity to first rupee earned, fast.

**The loop.** Earnings calculator (before any signup) → real technician videos, unpolished, in Marathi → live earnings ticker → picture-based aptitude test with no reading required → safety screen → eKYC → training modules at ₹50 each → **money in the wallet before the first job** → supervised first job with a paid mentor.

**Information hierarchy.** The number they could earn. Then proof that the number is real (faces, names, today's ticker). Then how long it takes. The form is last and is never the first thing on screen.

**Interaction style.** Tap, don't type. Icons, not labels. Video, not paragraphs. The aptitude test is picture-based by design and the interface should never accidentally reintroduce a reading requirement through its own chrome.

**Visual.** Bright, video-first, aspirational. The progress spine — *eligibility → skills → safety → KYC → training → first job* — is visible from the first screen so the candidate always knows how far they are from money.

**Motion.** The ₹50 module credit uses the same coin animation as a real job. That equivalence is the point: the money is real from day one, and the animation says so before any words do.

**Error handling.** A safety-screen failure is a hard, honest stop delivered with respect — no reapply-tomorrow loophole, no ambiguity. The manual is right that this is non-negotiable; the interface should be clear rather than apologetic.

**Time budget.** 48 hours, start to first job accepted, with the remaining time visible to the candidate throughout. **Breaks if:** the earnings calculator shows a top-performer number instead of an honest median.

---

### 2.8 — ADMIN · *Command*

> **Thesis: an empty screen is a win.**

**Mindset.** One person monitoring a city. Their job is not to watch work happen — it is to clear a queue and get back to zero. Every healthy job on their screen is noise that hides an unhealthy one.

**Environment.** Desktop, two or three monitors, keyboard. Sometimes a phone, for P0 and P1 only.

**Primary job.** Take the top alert to a decision in under 90 seconds, and repeat until the queue is empty.

**The loop.** Live map with red pins pulsing and everything else calm → alert queue, strictly prioritised → each card carries what happened, what the AI already did, the evidence, and two or three one-tap decisions → decision with a mandatory written reason → next.

**Information hierarchy.** The alert card is the product. Its internal order is fixed and never varies:

```
🔴 P1   Evidence rejected twice
        MH-PUN-KOT-LIFT-0089-K · Kothrud

WHAT HAPPENED     Photo 3 matched an image from job 0074
WHAT AI DID       Step frozen · technician notified · credit held in Pending
                  Appeal opened · 3h 12m remaining
EVIDENCE          [ photo 3 ]  [ matched original ]  side by side
YOUR DECISION     [ Uphold ]  [ Overturn & pay ]  [ Call technician ]
```

Four blocks, same order, every alert, every priority. An admin who has to re-learn the layout per alert type cannot hit 90 seconds.

**Interaction style.** Keyboard-driven. `J`/`K` through the queue, number keys for decisions, `/` for global search, `Esc` back to the map. The map lasso filters everything inside a drawn shape. Bulk actions where the alert type genuinely permits it — and nowhere else, because bulk-approving evidence disputes is how the evidence system dies.

**Navigation.** Persistent left rail. The map is always available, always live, never the working surface. The queue is the working surface.

**Visual.** Dark, dense, multi-panel. Density is the feature here and should not be apologised for with whitespace. Red pins pulse; nothing else does. A calm map with six pulsing pins is a legible city.

**Motion.** One thing only: **new alert arrival**, 160ms, two pulses, then still. An alert that keeps blinking becomes wallpaper within an hour and stops being an alert.

**Error handling.** Every admin decision is itself audited with an ID, a timestamp and a written reason. The interface should make that feel like protection for the admin rather than surveillance of them — the audit log is what defends their judgement later.

**Time budget.** 90-second median, measured and displayed to the admin as their own running number. **Breaks if:** healthy jobs ever appear in the queue.

---

### 2.9 — OWNER · *Executive*

> **Thesis: four numbers, ten seconds, standing up. If it can be acted on today, it does not belong here.**

**Mindset.** Mr. Wable is not running the business day-to-day; that is the entire premise. He wants to know whether the machine is still a machine.

**Primary job.** Answer four questions: are we making money, where do we grow, is the system running itself, what is about to break.

**Information hierarchy.** Four panels, in this order, and the order is an argument:

1. **Cash** — today's inflow, outflow, net margin, month-to-date.
2. **Growth heatmap** — where to open next, drillable to ward level.
3. **System Efficiency Index** — the largest single number on the screen.
4. **Strategic alerts** — weekly, never daily.

The SEI is rendered **larger than revenue.** That is a deliberate and slightly uncomfortable design decision, and the manual argues for it directly: *"Revenue can be bought with spending. Efficiency cannot. Watch this number before watching revenue."* An executive dashboard that puts revenue first will train the owner to optimise the wrong thing. Typography here is strategy.

**Interaction style.** Read-only by default. Drill-down on demand — national number down to a single site, one ID chain. No configuration, no filters on the surface. The one thing the Owner can *do* from this screen is approve a sub-20% margin override, and that appears as a discrete card, not a permanent control.

**Visual.** Dark, very large type, charts over tables, almost no chrome. This screen should be legible on a phone at arm's length in a car park.

**Motion.** None on load. Numbers do not count up on this screen — a counting animation on a cash figure makes it feel like a game, and this is the one surface where the numbers must feel like facts.

**Error handling.** Every metric has a "how is this calculated" affordance. An owner who does not trust a number will stop opening the screen, and an unexplained SEI is an untrusted SEI.

**Time budget.** 10 seconds to comprehension. **Breaks if:** anything operational appears here.

---

### Role UX at a glance

| Role | Theme | Home | Nav | Primary object | The one thing that breaks it |
|---|---|---|---|---|---|
| Rider | Sunlight | Map | 4 | Capture button | A required field in confirm |
| Sales Desk | Command light | Pipeline map | rail | Margin bar | Objection not on first screen |
| Customer | Premium | Progress ring | 3 | The ring | Two primary actions |
| QC | Slate judicial | Inspection map | 4 | Checklist item | PASS easier than FAIL |
| Supplier | Command warehouse | Order board | 4 | Order card + pay date | Packing needs a keyboard |
| Technician | Slate | Today | 5 | The current step | A generic rejection |
| Candidate | Sunlight aspirational | Calculator | none | The number | Dishonest earnings figure |
| Admin | Command | Alert queue | rail | Alert card | Healthy jobs in the queue |
| Owner | Executive | Four panels | none | SEI | Anything operational |

---
---

## PART 3 — THE GLOBAL INTERACTION SYSTEM

Twenty-five components. Nine of them are not in the original brief's list; they are marked **[+]** and each exists because the manual requires it.

---

### 3.0 — The Event Spine

Every component in this system reads from one canonical object. This is what makes six role-specific interfaces stay honest about the same reality, and it is what enforces Law IX at the contract level rather than at assembly time.

```ts
Event {
  id            // MH-PUN-KOT-SOPX-0089-07-Q
  entity        // parent chain: LIFT-0089 → JOB → STEP
  at            // server timestamp, always. Device time is never trusted.
  actor         { type: 'human' | 'machine', id, role }
  verb          // 'verified' | 'rejected' | 'paid' | 'unlocked' | 'blocked' | ...
  gate?         { name, key: 'money' | 'proof', requirement, satisfied }
  proof[]       { evid_id, kind, geo, server_time, ai_result, thumb }
  money?        { delta, state: 'pending'|'cleared'|'held'|'deducted', reason }
  unlocked[]    // what this event opened
  custody?      { owner_role, owner_id, requirement, due_at, consequence }
  sla?          { target, elapsed, status }
  appeal?       { open, opened_at, resolve_by, paid_while_pending }
  visibility    { [role]: FieldMask }     // ← Law IX lives here
}
```

Two rules that never bend:

1. **A component may not render a field outside its role's mask.** Not hidden by CSS. Not present in the payload.
2. **Server time only.** The manual makes this a fraud control; it is also a UI rule, because a device clock skew that shifts a technician's evidence out of a window costs him ₹2,800.

---

### 3.1 — Status grammar

Five slots. Every status object in the app is built from them.

```
STATE        one word, from the workflow state machine
REASON       why, in the user's language, concrete
CUSTODY      who holds it
CLOCK        by when
CONSEQUENCE  what happens if it doesn't move
```

**Two renderings, not one.**

*Stacked* — all field themes, all customer surfaces. This is the default:

```
Blocked
QC failed item 8 — pit waterproofing
Waiting on you · re-inspection booked 26 Aug
Material stays with the supplier until it clears
```

*Inline* — Command and Executive only, where density is the feature:

```
Blocked · QC item 8 · customer · 26 Aug
```

The stacked form is the default for a specific reason: dot-joined strings collapse badly at 200% text scale, run long in Devanagari, and read as one unbroken run to a screen reader. Density is a desktop privilege.

**Forbidden as a complete status, anywhere in this product:** Pending · Processing · In progress · Awaiting approval · Failed · Error · Something went wrong · No data.

---

### 3.2 — `NextAction`

The most-used component in the app. One per role, one per screen, above everything.

**Anatomy:** directive line → context (2–3 facts, no more) → one primary control → one subordinate escape.

**States:** `available` · `blocked` (renders `KeyringGate` instead) · `waiting` (renders `CustodyLine`, no button) · `none`.

The `none` state matters more than it looks. *"Nothing needed from you today. Your technician is on Step 9 of 24."* is a complete and valuable answer, especially on the customer's screen — and it is the answer that prevents a support call.

**Forbidden:** two primary actions · a directive that does not name what happens after · an empty state with no reassurance.

---

### 3.3 — `CustodyLine` **[+]**

The Law II primitive. Four lines, no button, no colour.

```
Waiting on Apex Residency
Shaft photos — 6 of 10 done
Due 25 Aug · 4 days left
If it slips: material slot releases to the next site
```

Used inside timelines, entity cards, alert cards, order cards, blocked steps and every customer waiting state. It is deliberately quiet: it is information, not alarm. It turns amber at 75% of the SLA window and red only at breach — and even then it stays four lines.

---

### 3.4 — `KeyringGate`

Generalises the brief's `WorkflowGate` to cover all forty-odd locks in the system with one contract.

```
🔒 Container locked

90% payment required before the lock opens
Received   ₹2,75,000 of ₹5,53,500
Remaining  ₹2,78,500

After payment: triple-key unlock begins, both cameras record,
material becomes yours.
Window closes in 41 hours. After that the truck returns to Chakan.

[ Pay ₹2,78,500 ]
```

**Contract:** `lock_name` · `key: money|proof` · `requirement` · `progress` · `unlocks` · `deadline` · `on_expiry` · `who_can_open`.

**Rule:** a disabled button is never a complete gate. If the user cannot act, the gate names who can and when.

**Variants:** payment gate · evidence gate · kit pouch (*"KIT-C opens when Step 9 verifies"*) · sequence lock · margin floor · triple-key.

---

### 3.5 — `TripleKeyPanel` **[+]**

The container unlock is the most dramatic moment in the whole product and the strongest liability artefact the company owns. It deserves a bespoke component, not a checklist.

Three key slots, filling in real time, both camera feeds live, a shared five-minute countdown across all three parties, and — critically — the same panel visible simultaneously to customer, technician and admin, each seeing which keys are still missing. Three people in a courtyard looking at three phones showing the same truth is what makes this work socially, not just technically.

The unlock sequence is 1.4 seconds and is the only three-act animation in the product. Two of three keys produces no partial state, no progress bar toward opening, and no override affordance at any level. The manual is unambiguous: *"No override exists at any level."* The UI must not imply one exists.

---

### 3.6 — `EvidenceCapture`

The single highest-craft surface in the product. Everything the technician earns passes through it.

**Layout:** camera at 60% of the screen. Above: requirement number, the guide sentence, and the reference thumbnail for this exact shot. Below: a 72dp shutter, a retake, and the binding chips.

**Binding chips** — the proof that the photo is worth money. Framed per Law IV:

```
📍 On site   ⏱ Live   📷 In-app   ✓ Yours alone
```

Not "GPS verified / timestamp valid / camera confirmed / hash checked." Same four checks. Opposite feeling.

**Behaviour:** camera never closes between shots in a multi-shot sequence — the rider's 11 seconds and the technician's flow both depend on this. Gallery upload does not exist as a control anywhere in the product; there is no disabled button, no menu item, nothing to discover. Capture succeeds offline, always, with the queue marker.

**Haptics** (a shaft is loud and dark): light tick on shutter · double tick on pass · long buzz on reject.

**States:** `ready` · `guiding` · `captured` · `checking` · `pass` · `retake` · `frozen` · `queued-offline`.

---

### 3.7 — `VerificationResult`

The AI's verdict, and the most emotionally consequential card in the app.

**On pass:** the credit, the unlock, the next step. Three seconds, done, forward.

**On fail — four mandatory blocks, in this order:**

```
Retake photo 2

The torque reading isn't legible — too much glare on the display.
[ reference image ]  [ your photo ]

2 retries left. Your ₹2,800 is still held, not lost.

[ Retake photo 2 ]
[ This is correct — ask a person ]     ← AppealPath, always present
```

**Forbidden:** a confidence score shown to a worker · the word "rejected" · a fail with no reference image · a fail whose only action is retake.

---

### 3.8 — `AppealPath` **[+]**

Required child of every negative machine verdict, in every role.

One tap. No form. It captures the context automatically — job, step, evidence, AI reason — and opens a four-hour clock the worker can see. The credit stays in Pending and is visibly labelled *held, under review*, never removed from the wallet. If the appeal succeeds, the credit clears and the worker gets a message that names the person who reviewed it.

The false-positive rate is tracked as a first-class metric on the Owner's dashboard, per the risk register. That is the loop that keeps this component honest.

---

### 3.9 — `MoneyFeedback` and `MoneyMeter`

**`MoneyFeedback`** — the event. Four lines, per Law VI: amount, state, cause, consequence. Lands within 3 seconds of the verified act. Coin motion 700ms with sound and haptic. Interruptible and non-blocking — a technician must be able to start the next step mid-animation.

**`MoneyMeter`** **[+]** — the persistent strip. Business Law 4 requires it on every field screen, so it is chrome, not a page. Shows today, week, pending vs cleared, and the distance to the next threshold: *"₹340 more this week for the ₹800 streak bonus."*

Every line in the wallet ledger carries its `WLET` ID and taps through to the evidence that earned it. A worker who can trace every rupee back to a photograph is a worker who trusts the ledger.

**Penalties** get the same four-part structure and an appeal. A silent deduction is the fastest way to lose a technician.

**Role projections:** Rider — today's earnings and pending conversions. Technician — pending/cleared/Friday countdown. QC — inspection fees and accuracy bonus. Customer — *savings*, never costs: early-shaft discount, referral credit, on-time reward. Supplier — payment date. Owner — margin.

---

### 3.10 — `EntityCard`

One card structure for LEAD, LIFT, CONT, TECH, JOB, CUST. Fixed internal order so that recognition is instant regardless of type:

```
photo strip
ID  ·  type  ·  lifecycle state (with its legend colour + shape)
progress
money position
CustodyLine  (what is blocking, who holds it)
NextAction
[ Open workflow ]
```

**Surfaces:** map bottom sheet (mobile) · side panel (desktop) · search result · notification expansion. Same component, four containers. The manual's Law 2 promise — *"tap any pin, the Entity Card slides up, same card structure everywhere"* — is only true if this is genuinely one component.

**Test:** five seconds to answer where it is, what is blocking it, and what happens next.

---

### 3.11 — `EntityTimeline`

Six node states, each distinguishable **without colour** (Law 34 / accessibility):

| State | Mark | Behaviour |
|---|---|---|
| Complete | filled dot | timestamp, tap for evidence |
| Current | ring with pulse | expanded by default, carries CustodyLine |
| Upcoming | hollow dot | dimmed, shows its entry gate |
| Blocked | filled square | expanded, CustodyLine + gate |
| Failed | square with slash | reason + recovery action |
| Escalated | double ring | who it went to, and when |

The current node is always expanded. Everything above it collapses to one line. Everything below shows only its name and gate. This is progressive disclosure applied to time rather than to forms, and it is what lets a 24-step installation fit on a 360px screen without scrolling into despair.

---

### 3.12 — `WorkflowStep`

One step, one screen. Fixed order: lock state → instructions in the active language → video → **safety line** → materials/kit → evidence requirements → value → primary action.

The safety line sits **above** the primary action and cannot be collapsed. Risk register item 8 is explicit that time pressure on safety-critical work is a real hazard, and that safety steps are exempt from time bonuses. The interface backs that up by never letting the safety content be scrolled past on the way to the shutter.

---

### 3.13 — `WorkflowProgress`

Two forms of the same data. **Ring** for the customer — one number, one stage name, emotionally legible. **Burn-down** for the technician and admin — actual against ideal, with the 14-day clock. Silent when on track. The manual's instruction is exactly right and worth repeating in the component spec: *"On track: silent. No noise when things are fine."*

---

### 3.14 — `MapEntity` and `MapFilter`

Pins carry lifecycle hue **and** a distinct shape, so state survives colour-blindness and direct sunlight:

| State | Hue | Shape |
|---|---|---|
| New lead | grey | hollow circle |
| In sales | blue | half-filled circle |
| Won, awaiting shaft | purple | circle with centre dot |
| Container in transit | amber | chevron |
| Installing | yellow | segmented ring showing % |
| Complete | green | check |
| Blocked | red | **square** with bang |
| Lost | black | slashed square |

Red is the only square-with-bang. Shape difference, not hue difference, is what protects a deuteranopic admin scanning a city map.

Only red pins animate. Filters are multi-select and apply instantly, no apply button. The lasso filters everything inside a drawn shape and is available to Admin, Sales and Owner.

---

### 3.15 — `ContextSheet`

The anti-navigation component. Three detents: **peek** (48px — ID and state), **half** (entity card), **full** (workflow). Dragging between them never loses the map behind, and never pushes a new route.

Desktop equivalent is a persistent right panel with the same three densities. The manual's rule holds: from a map pin to a primary action, zero screen transitions.

---

### 3.16 — `OfflineQueue`

Per Law VIII. Neutral, never red:

```
3 actions saved on this phone
Evidence, GPS and your credits are safe here.
They'll send themselves when you're back in signal.
```

On reconnection, the one expressive animation Slate allows: a sweep, a count to zero, then the money settling. *"3 of 3 sent · ₹4,200 moved to Pending."*

---

### 3.17 — `AlertCard` and `DecisionCard`

The Admin's working unit. Fixed four-block order — what happened, what the AI already did, the evidence, the decision — because a 90-second median is impossible if the layout moves between alert types.

Two to three one-tap decisions maximum. Every decision requires a written reason before it commits. Evidence is side-by-side inline, never behind a modal — the modal is what costs the 90 seconds.

Priority is encoded three ways at once: position in the queue, a code (P0–P4), and colour. Never colour alone.

---

### 3.18 — `SLAIndicator`

Thin, quiet, three bands: on track (no colour), at risk (75% of window, amber), breached (red). Always paired with a `CustodyLine`, because an SLA without an owner is a complaint rather than a signal.

---

### 3.19 — `StatusIndicator`

The atom that renders the five-slot grammar. Two renderings per 3.1. Never colour alone — every state carries a glyph. Never a bare word.

---

### 3.20 — `ScreenHelp` **[+]**

Business Law 8's floating `?`. Draggable, never covering a primary control, on every screen.

Four tabs: what this screen is (three lines) · show me (20–40s recording of this exact screen) · ask AI (already knows role, screen, job ID and current blocker; answers with a tappable action, not a paragraph) · call admin (attaches screen, job ID and last error to the call).

**The part that matters most:** every open is logged with a `screen_id`, and 15+ opens on one screen in a week raises a P4 "confusing screen" alert. The help button is the product's own UX defect detector, and that telemetry should be treated as a first-class design input rather than a support metric.

---

### 3.21 — `NotificationCenter`

Three sections, never one stream: **needs you** · **for information** · **done**. Sorted by required action, not by time. Time sorting is how a notification list becomes a place people stop looking.

Push follows the escalation ladder — nudge at 15 min, warning at 30, penalty at 60, reassign at 90 — and every push in a field role carries a voice option in the user's language, because a rider with a helmet on cannot read.

---

### 3.22 — `GlobalSearch`

Type any fragment of any ID and land on the entity. `0089` returns the lift, its customer, its job, its container, its technician — each as a compact `EntityCard`, each with state and next action already visible. Also accepts phone numbers, names, site names and QR scans.

Scanning a QR sticker is search. Container plates, kit pouches, the machine-room plate, the technician's badge and the customer's welcome card all resolve to their record.

---

### 3.23 — `LanguageSwitch` **[+]**

Globe icon, top bar, every screen. Business Law 6 requires the switch to be **instant, non-destructive and total** — including form data in progress, SOP text, safety warnings, voice prompts, notifications and generated PDFs.

Two design consequences that are easy to miss and expensive to retrofit:
- No layout may depend on string length. Devanagari runs 15–30% longer. This is why the type system uses a variable-width family.
- Numbers reformat to Indian grouping (₹1,50,000) in all three languages, not only in Marathi and Hindi.

---

### 3.24 — `SafetyOverride` (SOS) **[+]**

Permanent on every technician and QC screen, in the reachable thumb zone, and exempt from the one-dominant-action law.

Two-stage to prevent pocket-fires, but the second stage is a 500ms hold, not a confirmation dialog — a person on a ladder cannot read a modal. On fire: admin call opens, location transmits, nearest hospital and emergency contact surface, incident record opens, insurance claim starts.

Reserved safety red. No other element in the product may use that value.

---

### 3.25 — `DemoRibbon` and `RoleSwitcher` **[+]**

Per Part 0.8. The ribbon is persistent, orange, unmissable and designed rather than tolerated. The role switcher is demo-only, fast, and built for the seven-minute script — six role changes in seven minutes with no loading state visible to the room.

The conversion bar (*"Liked it? Create your real account"*) sits at the bottom of every demo screen and is a designed component, because this is the actual top of the recruitment and investment funnel.

---

### Component → role matrix

| Component | Rider | Sales | Cust | QC | Supp | Tech | Cand | Admin | Owner |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| NextAction | ● | ● | ● | ● | ● | ● | ● | ● | ○ |
| CustodyLine | ○ | ● | ● | ● | ● | ● | ○ | ● | ○ |
| KeyringGate | ● | ● | ● | ● | ● | ● | ● | ● | ○ |
| TripleKeyPanel | | | ● | | ○ | ● | | ● | |
| EvidenceCapture | ● | | ● | ● | ● | ● | ● | | |
| VerificationResult | ● | | ● | ● | ● | ● | ● | ● | |
| AppealPath | ● | | | ● | ● | ● | | ● | ○ |
| MoneyFeedback | ● | ● | ● | ● | ● | ● | ● | ● | |
| MoneyMeter | ● | | ○ | ● | ● | ● | ● | ● | ● |
| EntityCard | ● | ● | ● | ● | ● | ● | | ● | ● |
| EntityTimeline | ● | ● | ● | ● | ● | ● | ○ | ● | ○ |
| WorkflowStep | | | ● | ● | ● | ● | ● | ● | |
| MapEntity | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| ContextSheet | ● | ● | ● | ● | ○ | ● | | ● | ● |
| OfflineQueue | ● | | | ● | ○ | ● | ○ | | |
| AlertCard | | ○ | | | ○ | | | ● | ○ |
| ScreenHelp | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| GlobalSearch | ○ | ● | | ○ | ● | ○ | | ● | ● |
| LanguageSwitch | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| SafetyOverride | ○ | | | ● | | ● | | | |

● primary · ○ secondary

---

## APPENDIX — WHAT THIS ARCHITECTURE COMMITS YOU TO

Six decisions made here that are expensive to reverse later. Worth disagreeing with now rather than in Stage 9.

1. **Pins own the lifecycle hues; controls own the role accent.** Constrains every theme.
2. **Hierarchy is built from weight, size, colour and space — never caps, italics or tracking.** Required by Devanagari, and it means the design system cannot use the standard Latin UI toolkit.
3. **`AppealPath` is mandatory on every negative machine verdict.** Adds a real support obligation: four-hour human response, pay-while-pending.
4. **PASS and FAIL are visually symmetrical in QC.** A deliberate break from one-dominant-action.
5. **Slate is architected offline-first; Sunlight and Premium are online-first.** A genuine fork, not a preference.
6. **The Owner's SEI is rendered larger than revenue.** Typography as strategy.

---

**Next in the set:** Part 4 (16 workflow journeys, entry → action → response → UI change → success/recovery) · Part 5 (screen-by-screen specification with time budgets attached) · Part 7 (Claude Code prompts, Stages 1–16, each with build/test/review/stop gates).

Part 6, the design system, is the companion document to this one.
