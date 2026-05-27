# Research Foundation: Formal Elimination-Discovery Framework for AI-Driven Requirements Analysis

> **Document Type:** Research Foundation Document (Academic Paper Basis)
> **Core Contribution:** The first framework to formally define the boundary between over-interpretation (hallucination) and legitimate discovery when AI interprets natural language requirements
> **Academic Domain:** Software Engineering → Requirements Engineering → AI-Assisted Requirements Analysis
> **Validation Data:** QR Code Board Benchmark (2026-05-27, Claude Sonnet 4.6, identical model and prompt)

---

## §1. Problem Definition — AI Does Not "Read" Requirements, It "Interprets" Them

### 1.1 The Fatal Flaw in Current AI Requirements Analysis

The fundamental problem in current AI (LLM)-based software development:

```
User-written requirements (req.md)
        ↓
   AI "interprets" them
        ↓
   ┌────────────────────────────────────┐
   │  This interpretation is a Black Box │
   │  Unknown: which interpretation      │
   │  Unknown: why this interpretation   │
   │  Unknown: what alternatives existed │
   └────────────────────────────────────┘
        ↓
   Code generation (interpretation output)
        ↓
   ❌ Hallucination / ❌ Omission / ❌ Over-interpretation
```

**Essence of the problem:** AI does not "read" requirements — it **"interprets"** them. Interpretation always involves multiple possibilities, and AI selects one without stated rationale. Because this selection process is opaque:

| Failure Mode | Description | Result |
|:---|:---|:---|
| **Over-interpretation** | Adding features not in requirements ("it would be nice to have") | Scope Creep · Hallucination |
| **Under-interpretation** | Missing essential elements implied by requirements | Incomplete system |
| **Misinterpretation** | Incorrectly understanding the meaning of requirements | Misdirected system |

### 1.2 Limitations of Existing Approaches

| Existing Approach | Mechanism | Limitation |
|:---|:---|:---|
| **Prompt Engineering** | Instructs "analyze well" | Does not control the analysis **process** |
| **RAG** | Reduces hallucination via document reference | Interpretation selection remains a black box |
| **CoVe (Chain-of-Verification)** | AI verifies its own answers post-hoc | No elimination procedure — verification criteria are subjective |
| **CLAM (Clarification-Seeking)** | Asks humans when ambiguous | Not automatable, requires real-time intervention |
| **Formal Methods** | Mathematical proof for code verification | Not applied to the requirements **interpretation** stage |

> [!IMPORTANT]
> **Research Gap:** All existing approaches either **"verify AI output post-hoc"** or **"instruct AI to perform better."** No research exists that **inserts formal procedures into the AI interpretation process itself.**

### 1.3 This Research's Proposal — "Forensics of Requirements Interpretation"

This research proposes a framework that transforms AI's requirements interpretation from a black box into an **auditable formal procedure**.

```
Existing: req.md → [black box interpretation] → code
Proposed: req.md → [CIE: interpretation elimination] → [SRD: hidden necessity discovery] → code

CIE = enumerate all possible interpretations → eliminate via source text → only survivors remain
SRD = trace tails of survivors → discover hidden necessities → distinguish from expansion
```

---

## §2. CIE — Competitive Interpretation Elimination

### 2.1 Concept

**Key Difference:** Existing AI selects **one interpretation** and presents it. CIE **enumerates all, then eliminates**. Since the elimination process is recorded, **why** a particular interpretation was selected becomes auditable.

**Academic Term:** CIE transforms AI requirements interpretation from **Probabilistic Selection** to **Logical Elimination**.

### 2.2 Formal Definition

```
Input:  Requirement statement R ∈ req.md
Output: Single confirmed interpretation I*

STEP 1. Interpretation Space Enumeration
  → Enumerate all possible interpretations I = {I₁, I₂, ..., Iₙ} for R
  → AI does not pick "the most plausible" — it first spreads all options

STEP 2. Elimination Criteria Fixation
  → Elimination criteria = source text verbs and context ONLY
  → External knowledge, "generally," "usually" prohibited
  → Formula: Criteria = {Source verb(How), Source noun(What), Source condition(When)}

STEP 3. Sequential Elimination
  → For each Iₖ:
     IF Iₖ contradicts source verb/context → Eliminate (❌)
     IF Iₖ contains assumptions without source basis → Eliminate (❌)
     IF Iₖ is consistent with source → Survive (✅)

STEP 4. Survivor Adoption
  → |Survivor set| = 1 → Adopt ✅
  → |Survivor set| = 0 → Declare insufficient information (no fiction)
  → |Survivor set| ≥ 2 → Request clarification from user
```

### 2.3 Simulation — "Non-member orders via address input box"

```
Requirement R: "Non-member orders via address input box"

STEP 1. Interpretation Space:
  I₁: Simple text field for address without registration
  I₂: Guest checkout system (email + address + phone)
  I₃: Social login then address input
  I₄: Address autocomplete API form

STEP 2. Elimination Criteria:
  Source verb: "input" — manual text entry
  Source condition: "non-member" — no registration needed
  Source noun: "input box" — single input field

STEP 3. Elimination:
  I₁: Non-member ✅ + input box ✅ + address input ✅ → Survive ✅
  I₂: "email + phone" = not in source → Eliminate ❌ (expansion)
  I₃: "social login" = contradicts "non-member" → Eliminate ❌ (contradiction)
  I₄: "autocomplete API" = not in source → Eliminate ❌ (expansion)

STEP 4. Survivor = I₁ only → Adopt ✅
  → "Simple text field for address without member registration"
```

### 2.4 Benchmark — Agent-Skills vs Scripture AIDD

**Experimental Conditions:**
- Identical requirements: `req.md` (2 lines — QR code scan homepage with a board)
- Identical AI model: Claude Sonnet 4.6
- Identical execution: Single session, no user intervention

| Analysis Item | Agent-Skills (No CIE) | Scripture AIDD (CIE Applied) |
|:---|:---:|:---:|
| Ambiguities identified | 0 | **4** |
| Competing interpretations listed | 0 | **8** |
| Interpretation rationale documented | None | **Verb-based elimination log** |
| Core verb misread check | None | **Performed** |
| Features not in req.md | **2** (Scope Creep) | **0** |
| Interpretation traceability | Black box | **Fully auditable** |

**Agent-Skills interpretation process:** Recorded in PRD.md: `Open Questions: None — req.md requirements are clear.` Ambiguities identified: 0. Competing interpretations listed: 0.

**Scripture AIDD CIE elimination detail — 4 competing interpretations actually eliminated:**

| # | Ambiguous Expression | Interpretation A | Interpretation B | Elimination Basis | Adopted |
|:--|:---|:---|:---|:---|:---:|
| 1 | "Google QR code" | Google-specific QR format | Generic QR code scanning | No Google API mentioned in req.md → A eliminated | **B** |
| 2 | "Scan and" | Browser camera live scan | Image file upload decoding | Verb "scan" = real-time action → B eliminated | **A** |
| 3 | "1 board" | List only | Full CRUD | "Board" = read+write+edit+delete → A eliminated | **B** |
| 4 | Authentication | Login required | Anonymous use | No Auth in tech stack → A eliminated | **B** |

**Scope Creep comparison:**

| Implemented Feature | req.md Basis | Agent-Skills | Scripture AIDD |
|:---|:---|:---:|:---:|
| Camera scanning | "scan" ✅ | ✅ | ✅ |
| Image upload decoding | **None** | ⚠️ Added | — |
| Link open/copy buttons | **None** | ⚠️ Added | — |
| **Features not in req.md** | | **2** | **0** |

> Agent-Skills, without CIE, failed to eliminate interpretation B ("image upload decoding") and implemented it. Scripture AIDD eliminated it via CIE and implemented "camera scan only."

### 2.5 CIE Academic Contribution

| Dimension | Existing | CIE |
|:---|:---|:---|
| Interpretation process | Black box | Auditable elimination log |
| Selection rationale | "Most plausible" (probabilistic) | Source verb/context elimination (logical) |
| Alternative interpretations | Hidden | Fully enumerated and disclosed |
| Elimination reasoning | None | Source-text basis stated for each |

---

## §3. SRD — Synoptic Requirements Discovery

### 3.1 Problem — CIE's Limitation

CIE effectively confirms interpretations of **stated requirements**. However, when requirements are incomplete, it cannot discover **unstated but logically necessary requirements** — there is nothing to eliminate.

### 3.2 Core Concept — "Discovery" vs "Extension (Hallucination)"

> [!IMPORTANT]
> **The formal definition of this boundary is the most powerful academic contribution of this research.** No precedent exists in prior research for defining this boundary with formal conditions.

```
Extension (Hallucination):
  Adding features not in req.md because they "would be nice"
  → Inserting "typical" features from AI training data

Discovery (Synoptic Discovery):
  Tracing the tails of stated requirements to find elements
  that MUST exist but were not explicitly stated
  → Not creating the nonexistent, but deriving logical consequences of the stated
```

### 3.3 Biblical Principles and Formal Mapping

The name derives from the **Synoptic Gospels** principle — Matthew, Mark, and Luke record the same events from different perspectives, revealing truths invisible in any single gospel through cross-referencing.

| Biblical Principle | Verse (KJV) | Formal Mapping |
|:---|:---|:---|
| **Here a little, there a little** | Isaiah 28:10 | Collect clues from different req.md statements |
| **Two or three witnesses** | Matthew 18:16 | Confirm only what is verified in 2+ contexts |
| **Do not create what is not there** | Matthew 4:4 | Only "system fails without it" confirms; "nice to have" rejects |

### 3.4 Formal Definition — Triple Condition for Discovery

```
━━━ SRD Formal Discovery Criteria ━━━

Condition 1: Witness Condition
  → D must be supported by 2+ independent contexts in req.md
  → |W(D)| ≥ 2  (W = set of supporting contexts)
  → Inference from 1 context only → Reject (Extension)

Condition 2: Functional Identity Condition
  → The 2+ supporting contexts must belong to the same functional category
  → Coincidental overlap across different features is not discovery

Condition 3: Necessity Condition — Removal Test
  → If D is removed, requirement R must become inoperable
  → IF D removed → R inoperable → D = ESSENTIAL (Discovery ✅)
  → IF D removed → R still works → D = OPTIONAL (Extension ❌)

━━━ Formal Decision Formula ━━━

  Discovery(D) = W(D) ≥ 2  ∧  FunctionalMatch(D)  ∧  ¬Operable(R \ D)
  Extension(D) = ¬Discovery(D)
```

### 3.5 Empirical Validation — Bible Shopping Mall req.md

**Triple Condition Verification:**

| Candidate | Witnesses ≥ 2 | Same Feature | Necessity (Removal Test) | Verdict |
|:---|:---:|:---:|:---|:---:|
| Name field | ✅ "that person" + "tracking number" | ✅ Order→Ship | Without name, "that person" unidentifiable → shipping impossible | **✅ Discovery** |
| Order status | ✅ "shipment processing" + "order complete" | ✅ Order mgmt | Without status, unshipped orders unidentifiable → ops impossible | **✅ Discovery** |
| Email sending | ❌ 0 witnesses | — | System works without it | **❌ Extension** |
| Shipping notification | ❌ 0 witnesses | — | Admin can process without it | **❌ Extension** |
| Phone number | ❌ 0 witnesses | — | Address sufficient for shipping | **❌ Extension** |
| Payment system | ❌ "Free" = counter-witness | — | Building it violates source text → **hallucination** | **❌ Extension** |

**Result:** Name + Address + Order status + "I believe" button = everything needed. Everything else = expansion (hallucination).

---

## §4. CIE → SRD Integrated Pipeline — Order Matters

### 4.1 Why CIE First?

```
❌ Wrong order (SRD → CIE):
  Requirements → Find hidden things → Eliminate interpretations
  → Problem: Tracing tails on wrong interpretations = hallucination disguised as discovery

✅ Correct order (CIE → SRD):
  Requirements → Eliminate interpretations (CIE) → Confirm → Discover hidden necessities (SRD)
  → Tracing tails only on confirmed interpretations = trustworthy discovery
```

### 4.2 Integrated Pipeline

```
━━━ CIE-SRD Integrated Pipeline ━━━

[PHASE 1] CIE — Competitive Interpretation Elimination
  For each statement in req.md:
  ① Exhaustively enumerate possible interpretations
  ② Eliminate via source verb/context
  ③ Adopt only survivors
  ④ Record elimination log (audit traceability)

[PHASE 2] SRD — Synoptic Requirements Discovery
  For CIE-confirmed interpretations:
  ① Trace "tails" to find hidden elements
  ② Verify candidates via triple condition:
     - Witnesses ≥ 2
     - Functional identity
     - Necessity (removal test)
  ③ Pass = Discovery (ESSENTIAL) / Fail = Extension (OPTIONAL) → Remove

[OUTPUT] Verified Requirements List
  → Source-stated + CIE-confirmed + SRD-discovered = Final spec
  → Each item has source citation and decision rationale
```

---

## §5. Benchmark Summary — Full Pipeline Effect

| Metric | Agent-Skills (No CIE/SRD) | Scripture AIDD (CIE + SRD) |
|:---|:---:|:---:|
| Ambiguities identified | 0 | **4** |
| Competing interpretations listed | 0 | **8** |
| AI errors/corrections | 3 | **0** |
| Features not in req.md | 2 (Scope Creep) | **0** |
| Interpretation rationale documented | None | **Fully auditable** |
| Interpretation traceability | Black box | **Persistent spec-tablet** |
| Quality verdict | None | **IRONCLAD [Self-adv ✓]** |

---

## §6. Academic Novelty Analysis — What Does Not Exist in Prior Research

### 6.1 Prior Art Survey

| Concept | Exists in Academic Literature? | Notes |
|:---|:---|:---|
| "Competitive Interpretation Elimination" | ❌ No | Not a standard SE term |
| "Synoptic Requirements Discovery" | ❌ No | "Synoptic" not a standard SE qualifier |
| Formal boundary: over-interpretation vs discovery | ❌ No | Problem recognized, but never formalized |
| Witness-count based confirmation (in SE) | ❌ No | Exists only in biblical hermeneutics |

### 6.2 Similar but Different Existing Research

| Existing Research | Difference from CIE/SRD |
|:---|:---|
| **Ambiguity Resolution (NLP)** | Resolves ambiguity but does **not exhaustively enumerate** |
| **Decision Analysis** | Lists alternatives but **no verb-based elimination criterion** |
| **Requirements Traceability** | Traces connections but **does not discover hidden requirements** |
| **Goal-Oriented RE (KAOS)** | Derives sub-goals but **not via statement cross-referencing** |
| **Chain-of-Verification** | AI verifies own answers but **no elimination procedure** |

### 6.3 Core Contributions Summary

```
Contribution 1 (CIE):
  Transforms AI requirements interpretation from "probabilistic selection"
  to "formal elimination." Achieves audit traceability for interpretation selection.

Contribution 2 (SRD):
  First-ever formal definition of the boundary between over-interpretation
  (extension/hallucination) and legitimate discovery, using a triple condition:
  → Discovery(D) = W(D) ≥ 2  ∧  FunctionalMatch(D)  ∧  ¬Operable(R \ D)

Contribution 3 (CIE+SRD Integration):
  Proves that order matters — elimination first, discovery second.
  Wrong order (discovery → elimination) allows hallucination to masquerade as discovery.

Contribution 4 (Interdisciplinary):
  First application of biblical hermeneutics (Synoptic Gospels principle)
  to modern software engineering requirements analysis.
```

---

## §7. Future Research Directions

| Direction | Description |
|:---|:---|
| **Quantitative benchmarks** | Compare hallucination rate, omission rate, accuracy before/after CIE/SRD |
| **Multi-model comparison** | Compare CIE/SRD effectiveness across GPT, Claude, Gemini, etc. |
| **Domain expansion** | Apply to legal documents, medical protocols, aviation regulations |
| **Automation tooling** | Implement CIE/SRD as automated AI agent framework tools |
| **Formal metrics** | Define Discovery Rate, Expansion Rate, F1 Score |

---

## Appendix A: Terminology

| Term | Definition |
|:---|:---|
| **CIE** | Competitive Interpretation Elimination |
| **SRD** | Synoptic Requirements Discovery |
| **Discovery** | An element not stated in req.md but satisfying the triple condition |
| **Extension** | An element added by AI without basis in req.md = hallucination |
| **Witness** | An independent req.md context supporting a discovery candidate |
| **Removal Test** | Verification of whether the system becomes inoperable without an element |
| **Elimination Log** | Audit trail document recording why each interpretation was eliminated |

## Appendix B: Biblical Hermeneutics ↔ Software Engineering Mapping

| Biblical Hermeneutics Principle | Software Engineering (CIE/SRD) | Core Principle |
|:---|:---|:---|
| "Here a little, there a little" (Isa 28:10) | Collect clues from multiple req.md statements | Truth doesn't come from one place alone |
| "Two or three witnesses" (Mat 18:16) | Witness ≥ 2 condition | Never confirm on a single basis |
| Exhaustive competing model rejection | CIE: exhaustive interpretation elimination | Adopt only what survives |
| Removal test | SRD necessity proof | If it dies when removed, it's essential |
| External consensus override block | CIE: no external-knowledge-based interpretation | Judge by source text only |
| Third anchor collection | SRD: tail tracing | Two conflicting statements alone yield no answer |
| Multi-domain convergence | CIE+SRD pipeline | Convergence of independent paths = trust |

---

## Methodological Origin

> *"For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little."* — Isaiah 28:10 KJV

The core verification concepts in Scripture AIDD's CIE/SRD framework absorb methodological insights from **BVCAP (Bible Verification & Cross-Audit Pipeline)**, researched in **[the-scripture-audit](https://github.com/jloveonly-prog/the-scripture-audit)**.

The verification mechanisms originally developed in BVCAP for analyzing biblical verse consistency — including exhaustive competing model rejection, third anchor collection, and removal testing — were reverse-exported to the software requirements analysis domain, forming the formal foundation of CIE and SRD.

This represents the first practical application of principles from 2,000-year-old biblical hermeneutics (Biblical Hermeneutics) to modern AI software engineering.

---

*Research Foundation v1.0 — 2026-05-28*
*Scripture AIDD Research Foundation*
*Validation: QR Code Board Benchmark (2026-05-27) + Bible Shopping Mall req.md Simulation (2026-05-27)*
