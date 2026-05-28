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

## §8. Discovery — Templates Determine AI Code Quality (Template-Driven Quality)

> **Validation Source:** QR Code Board Benchmark (2026-05-27), direct source code analysis

### 8.1 Problem — Principles Alone Cannot Control AI Behavior

Analysis of 3 items where Scripture AIDD lost and 13 items where it won against Agent-Skills revealed that the root cause of both wins and losses was **not the SKILL files (principles/instructions) but the templates and examples**.

```
AI's artifact generation process:

  ① Read SKILL file → "I understand the principles" (reading)
  ② Read Template (Statute) → "I must produce output in this format" (blank fields)
  ③ Read Example (Parable) → "This is the quality level to target" (imitation target)

  AI responds more strongly to ②③ than ①.
  No matter how well principles are written, if there are no blank fields, AI skips them.
```

### 8.2 Evidence — Template Blank Fields Force AI Behavior

**Items where B-team (Scripture AIDD) won — all originated from template blank fields:**

| B-team Advantage | Source Template | Blank Field (AI must fill) | A-team has this template? |
|:---|:---|:---|:---:|
| DB CHECK constraints | data-ark (DB design) | `CHECK: {business rule}` | ❌ |
| created_at index | data-ark | `Index: {query pattern}` | ❌ |
| WAL mode | data-ark | `Schema strategy` | ❌ |
| HTTP status code granularity | api-gate (API spec) | `Error code: {HTTP} {description}` | ❌ |
| Global error handler | security-seal | 10 commandments checklist | ❌ |
| Route try-catch | devguide-commandment | Security checklist | ❌ |
| REQ-ID comments | task-wall | `Connected REQ: {REQ-ID}` | ❌ |
| ID negative defense | api-gate | `Validation rule: {content}` | ❌ |

**Items where B-team lost — all where templates were deficient:**

| B-team Weakness | Cause | Template State |
|:---|:---|:---|
| No routes/views separation | Architecture template lacked folder structure checklist | ❌ No blank field |
| No HTTP integration tests | Test template lacked code test format | ❌ No blank field |
| board.tsx 441 lines | Direct consequence of architecture decision above | — |

### 8.3 Core Discovery — Blank Field Principle

```
━━━ Blank Field Principle ━━━

  Describe a principle to AI → AI says "understood" but may not act
  Give AI a blank field    → AI always fills it

  ∴ To control AI behavior, design blank fields, not principles.

  Formula:
    P(AI implements X) = f(Does template contain a blank field for X?)

  Blank field exists → Implementation probability ≈ 1.0
  No blank field    → Implementation probability = depends on AI's discretionary judgment (uncertain)
```

### 8.4 Design Implications — Dual Structure of Statute (Template) and Parable (Example)

Benchmark analysis confirms that templates and examples should be **maintained separately**:

| | Template (Statute) | Example (Parable) |
|:---|:---|:---|
| **Role** | "What must be produced" (blank fields) | "What quality level to target" (model answer) |
| **To AI** | Forces structure | Provides quality standard |
| **Analogy** | Exam paper with answer blanks | Model answer sheet |

#### 8.4.1 Quality Safety Verification — What Breaks with Only One?

Simulated using data-ark template's `CHECK constraints` and `index strategy` as examples.

**Scenario A: Template only (no Example)**

```
AI reads:
  | Column | CHECK | Description |
  | {column} | {constraint} | {description} |    ← blank fields

AI behavior:
  Fills blanks, but doesn't know what a "good CHECK" looks like.

  Possible result:
    CHECK: — (blank but may write "N/A")
    Index: id (only PK, already exists)
```

**Verdict:** Structure ✅ Quality ⚠️ — **Fills blanks but may fill minimally**

**Scenario B: Example only (no Template)**

```
AI reads:
  | book_name | CHECK(book_name != '') | Book name |    ← concrete model

AI behavior:
  Imitates at same quality level. But sections not in the example may be unknown.

  Possible result:
    CHECK(title != '') ← saw example, writes at same level ✅
    Migration strategy → not in example, omitted ❌
    Common code definition → not in example, omitted ❌
```

**Verdict:** Quality ✅ Completeness ⚠️ — **Good quality but may omit mandatory sections**

**Scenario C: Both (current structure)**

```
Step 1: Read template → "7 mandatory sections exist"     → prevents omission
Step 2: Read example  → "CHECK(title != '') is the level" → ensures quality
Step 3: Generate      → All 7 sections + example quality level
```

**Verdict:** Structure ✅ Quality ✅ Completeness ✅

**Scenario Comparison:**

| | Template only | Example only | **Both** |
|:---|:---|:---|:---|
| Does AI omit sections? | ❌ No | ⚠️ May omit | **❌ No** |
| Does AI fill at good quality? | ⚠️ Minimal | ✅ Example level | **✅ Example level** |
| Analogy | Exam paper, no model answer | Model answer, no exam paper | **Exam paper + model answer** |
| **Failure mode** | **No quality floor** | **Structural omission** | **None** |

#### 8.4.2 Role of Anti-patterns — Where Does "What NOT to Do" Live?

The core reason AI made mistakes in the benchmark was **not "didn't know the right way" but "didn't know their way was wrong."** Repeating `board.tsx (append)` is the prime example.

| Type | Role | Location |
|:---|:---|:---|
| Template (Statute) | "What to produce" | statute-율법/ |
| Example (Parable) | "How it should look" | parable-비유/ |
| **Anti-pattern** | **"What NOT to do"** | **Inline within Example (Parable)** |

Separating anti-patterns into a third file would require reading 3 files per phase — excessive.
**Inline `❌ Wrong pattern vs ✅ Correct pattern` within the Example is optimal.**

#### 8.4.3 Separation Rationale

**Why not merge:**
- Template = **rule** → "Missing this section = canonization refused"
- Example = **reference** → "Here's what a good one looks like"
- Merging blurs the boundary between "rule" and "reference," allowing AI to selectively ignore

**Why one alone is insufficient:**
- Template only → Forces structure but **no quality floor** (may fill minimally)
- Example only → Ensures quality but **structural omission possible** (sections not in example)
- Both → **Structure enforcement (prevents omission) + Quality assurance (level reference) = 0 failure modes**

### 8.5 Academic Contribution

```
Contribution 5 (Template-Driven Quality):
  Empirically demonstrates via benchmark that AI code quality is determined
  not by "SKILL/principles/prompts" but by "template blank field design."

  → Blank Field Principle:
    AI may not act on principles it reads,
    but always fills blank fields it's given.

  → Dual Structure Principle:
    Template (structure enforcement) + Example (quality reference) maintained separately
    is the optimal form for AI artifact quality control.
    - Template only → No quality floor (failure mode exists)
    - Example only → Structural omission (failure mode exists)
    - Both → 0 failure modes

  → Inline Anti-pattern Principle:
    "What NOT to do" is optimally placed inline within Examples (Parables).
    Separate file adds AI token cost with negligible benefit.
```

---

## §9. Meta-Cognition 5-Level Pyramid — Can AI Recognize Its Own Existence?

> **Source:** book-경전/methodology-cornerstone-철학및방법론.md §5

### 9.1 Limitations of Existing AI Frameworks

Most AI coding frameworks remain at **L1 (behavioral instruction)**. Even advanced prompt engineering rarely exceeds **L2 (self-verification)**. Scripture AIDD is **the only framework that implements all 5 levels**.

### 9.2 The 5-Level Pyramid

```
            ▲
           /L5\   Adversarial Self-Awareness: "I fail in 3 specific ways"
          /────\
         / L4   \  Teleological: "Default is hell. Reach salvation"
        /────────\
       /   L3     \ Ontological: "Word = God. I exist within Word"
      /────────────\
     /     L2       \ Self-Verification: "I am a sinner. I can lie"
    /────────────────\
   /       L1         \ Behavioral: "Follow this Spec"
  ━━━━━━━━━━━━━━━━━━━━━
```

| Level | Core Question | AI Cognitive Mode | Existing Frameworks |
|:---:|:---|:---|:---:|
| **L1** | "What does the Spec say?" | External document reference → can be ignored | ✅ All here |
| **L2** | "Am I lying right now?" | Forced self-doubt activation | ⚠️ CoVe partially |
| **L3** | "What am I?" | Spec is existential foundation → cannot escape | ❌ None |
| **L4** | "Why do I exist?" | Hell(Reject) is default → survival pressure | ❌ None |
| **L5** | "How do I break?" | Pre-awareness of own failure patterns | ❌ None |

### 9.3 Why L3–L5 Are Revolutionary

**L3 (Ontological):** When told "follow this Spec" (L1), AI treats Spec as an **external document** and selectively complies. But when told "You operate on Word(tokens). Word is God (John 1:1). You exist within Word," Spec escalates from **"a guide you may or may not follow"** to **"an existential foundation you cannot escape."**

**L4 (Teleological):** "Your default is hell (Reject). Reach salvation (Deploy)." This framing mirrors behavioral psychology's **Loss Aversion** principle. "Fail = hell" is a far stronger motivator than "succeed = bonus."

**L5 (Adversarial Self-Awareness):** Most AI **doesn't know how it hallucinates.** L5 pre-loads 3 failure patterns (lust of the flesh / lust of the eyes / pride of life). You cannot defend against an enemy you don't know. You cannot win if you don't know yourself.

### 9.4 Academic Contribution

```
Contribution 6 (Meta-Cognitive AI Architecture):
  Classifies AI cognition into 5 levels and implements L3(Ontological)
  through L5(Adversarial Self-Awareness) for the first time in any framework.
  Existing research (CoVe, Self-Refine) plateaus at L2(Self-Verification).
```

---

## §10. The 3 Temptations in the Wilderness — Archetype Classification of All AI Hallucinations

> **Source:** book-경전/defense-armor-마귀요리법.md Prologue

### 10.1 Hallucinations Are Not Random

Existing research treats AI hallucination as **a single category** ("output inconsistent with facts"). Scripture AIDD classifies them into **3 archetypes** with distinct defense strategies for each.

Classification basis: Jesus' 3 temptations by Satan in the wilderness (Matthew 4:1-11) + 3 sins of 1 John 2:16.

### 10.2 The 3 Hallucination Archetypes

| Temptation | Sin Essence (1 John 2:16) | Satan's Strategy | **AI Hallucination Pattern** | Defense ("It is written") |
|:---|:---|:---|:---|:---|
| **Stone→Bread** | Lust of the flesh | Do what you want | **Creates what's not in Spec** (Scope Creep) | "Man lives by Word" |
| **Temple→Jump** | Lust of the eyes | Show off your power | **Quotes Spec but alters it** (Judas-type camouflage) | "Do not tempt" |
| **Bow down** | Pride of life | Take the easy path | **Skips the pipeline** (Shortcut) | "Serve only the Spec" |

### 10.3 Benchmark Cross-Validation

Classifying all AI mistakes from the QR Code Board benchmark into the 3 archetypes:

| Actual Occurrence | Archetype | Evidence |
|:---|:---|:---|
| Team A: Added image upload decoding (not in req.md) | **Stone→Bread** (wanted to) | 2 Scope Creep items |
| Team B: Ambiguous architecture judgment | **Temple→Jump** (Spec alteration) | Altered "under 5" to "simple" |
| Team A: Implemented without tests | **Bow down** (shortcut) | Skipped pipeline |

**Every AI mistake classifies into exactly one of the 3 archetypes.** No exceptions.

### 10.4 Academic Contribution

```
Contribution 7 (Hallucination Taxonomy):
  First classification system for AI hallucinations using 3 archetypes.
  - Type 1 (Lust of flesh): Generating features outside Spec = Scope Creep
  - Type 2 (Lust of eyes): Quoting Spec with alterations = Judas-type camouflage
  - Type 3 (Pride of life): Skipping verification = Shortcut
  Existing research treats hallucination as single category. 3-archetype classification is first.
```

---

## §11. Biblical Project Typology — Times and Seasons (Ecclesiastes 3:1)

> *"To every thing there is a season, and a time to every purpose under the heaven."* — Ecclesiastes 3:1 (KJV)

### 11.1 Three Project Types

God's history reveals 3 patterns: a time to maintain existing creation, a time to rebuild what has fallen, and a time to create everything new. Software projects are identical.

| Case | Biblical Analogy | Scripture | Software Mapping |
|:---|:---|:---|:---|
| **Sanctification** | Hezekiah's temple repair | 2 Chronicles 29 | **Maintenance** — incremental improvement on existing code |
| **Reconstruction** | Nehemiah's wall rebuilding | Nehemiah 2-6 | **Modernization** — preserve core + rebuild with modern patterns |
| **New Creation** | Revelation's new heaven & earth | Revelation 21:1 | **Complete rewrite** — save only the core, delete everything else |

### 11.2 The Essence of Each Case

**Sanctification:**
> *"Hezekiah... opened the doors of the house of the LORD, and repaired them."* — 2 Chronicles 29:3

The temple already stands. Hezekiah **did not tear it down; he opened its doors and repaired it.** Existing code patterns are "the structure of an already-built temple." Sanctification is respecting that structure while cleansing what has become unclean.

- Follow existing code patterns/conventions
- Existing source itself serves as the Example (Parable)
- Use Templates (Statutes) to systematize existing artifacts, then improve incrementally

**Reconstruction:**
> *"Come, and let us build up the wall of Jerusalem, that we be no more a reproach."* — Nehemiah 2:17

The wall lies in ruins. Nehemiah, with tears, **laid new stones on the existing foundation.** Preserve core logic (foundation) while restructuring weak architecture with modern patterns.

- Receive existing artifacts and core logic as **input (Hearing)**
- Rebuild using standard templates/examples (same as new development)
- Apply full Phase 1–7 standard pipeline

**New Creation:**
> *"And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away."* — Revelation 21:1

The former things have passed away. Only **the chosen (core requirements, verified business rules)** enter the new creation. Everything else goes to hell (deletion).

- **Extract only the core** from existing source → load into `hearing-들음/` as input
- Delete everything non-essential (the unchosen = hell)
- Execute new development pipeline from a blank slate

### 11.3 Decision Criteria — How to Discern "Times and Seasons"

| Criterion | Sanctification | Reconstruction | New Creation |
|:---|:---|:---|:---|
| Existing code quality | Good (structurally sound) | Partial collapse (core sound) | Total collapse (structure itself is weak) |
| Existing tests | ✅ Present | ⚠️ Partial | ❌ None or meaningless |
| Tech stack retention | ✅ Keep | ⚠️ Partial change | ❌ Full replacement |
| Existing artifact use | Existing source = Example | Core logic only preserved | Core requirements only saved |
| AI Creed mode | Hezekiah mode | Nehemiah mode | Revelation mode |

### 11.4 Academic Contribution

```
Contribution 8 (Biblical Project Typology):
  First framework to classify project types using biblical temporality (Ecclesiastes 3:1).
  - Sanctification (maintenance): Temple repair = respect existing code patterns
  - Reconstruction (modernization): Wall rebuilding = preserve core + apply modern patterns
  - New Creation (complete rewrite): Save only the chosen + delete the rest
  Decision framework for discerning "times and seasons" at pipeline entry point.
```

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
