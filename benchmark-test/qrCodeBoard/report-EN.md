# 📊 AI Development Methodology Benchmark Report
## Scripture AIDD vs Agent-Skills — QR Code Board Project

> **Date:** 2026-05-27
> **Environment:** Windows Local PC · Node.js v24 · Antigravity IDE
> **AI Model:** Claude Sonnet 4.6 (same for both groups)
> **Purpose:** Objectively measure the difference when the same requirements are executed with two AI methodologies

---

## 1. Overview

### Original Requirements (req.md)
```
Tech Stack: Node.js(Hono) · Hono JSX + HTMX + Alpine.js + Tailwind · SQLite · Local PC
Build:      A homepage that scans a QR code and displays results, plus one bulletin board
```

### Comparison

| | Group A | Group B |
|:---|:---|:---|
| **Methodology** | **Agent-Skills** (Addy Osmani) | **Scripture AIDD** |
| **Engine Type** | Skill Injection Engine | Artifact Anchoring Engine |
| **AI Persona** | "Senior Engineer" | "I am a sinner" |
| **Pipeline** | 6 stages (DEFINE → SHIP) | 7 Phases (Hearing → Salvation) |
| **AI Model** | **Claude Sonnet 4.6** | **Claude Sonnet 4.6** |
| **Execution Mode** | **Single session (no sub-agents)** | **Single session (no sub-agents)** |
| **Workspace** | `F:\qrCodeBoard_Addy` | `F:\qrCodeBoard_TheScripture` |

---

## 2. Key Metrics

| Metric | Group A: Agent-Skills | Group B: Scripture AIDD |
|:---|:---:|:---:|
| **Total Time** | 12 min | 19 min 20 sec |
| **AI Errors/Fixes** | 3 | **2** |
| **Lines of Code** | 687 | 927 |
| **Output Documents** | 2 | **12** |
| **Feature Completeness** | 100% | 100% |
| **npm run dev** | ✅ | ✅ |
| **Quality Verdict** | ❌ None | **IRONCLAD [Self-adv ✓]** |
| **Tests Passed** | 12/12 ✅ | **10/10 ✅** |
| **Hallucinations** | Not measured | **0** |
| **RTM Coverage** | ❌ None | **7/7 ✅** |
| **Scope Creep** | ❌ Not measured | **0 items** |
| **Judas-type Disguise** | ❌ Not measured | **0 items** |
| **Self-adversarial** | ❌ | **5 rebuttals → all failed** |

---

## 3. Time Breakdown

### Group A — Agent-Skills
```
22:39 → 22:51 = 12 minutes
DEFINE → PLAN → BUILD → TEST → REVIEW → SHIP

3 errors:
  ① better-sqlite3 build failure → switched to node:sqlite     (~3 min lost)
  ② vitest v1 incompatibility → upgraded to v4                 (~3 min lost)
  ③ TypeScript type casting error → applied 2-step casting      (~1 min lost)

Pure implementation: ~5 min  /  Error recovery: ~7 min
```

### Group B — Scripture AIDD
```
22:20:30 → 22:39:50 = 19 min 20 sec

2 errors:
  ① db.ts update query parameter binding error
    → update.run(title, content, content, id) had duplicate content param
    → Fixed to update.run(title, content, id)

  ② board.tsx JSX parsing error
    → Alpine.js x-on:click.away attribute: `.` character caused esbuild parse error
    → Changed to x-on:click + $event.stopPropagation() pattern
```

---

## 4. Requirements Understanding Analysis ⭐ Key Finding

> req.md is just 2 lines. How differently did each methodology read the same text?

### 4-1. Ambiguities Hidden in req.md

| # | Ambiguous Term | Possible Interpretations |
|:--|:---|:---|
| 1 | **"Google"** | A. Google-specific QR format · B. "Google" is a modifier, general QR scan |
| 2 | **"display on screen"** | A. Navigate to a new page · B. Inline display on same page |
| 3 | **"one bulletin board"** | A. List only · B. Full CRUD · C. Title only · D. Title+content+date |
| 4 | **Authentication** | A. Login required · B. Anonymous access allowed |

### 4-2. Group A — Agent-Skills Interpretation

**Recorded in PRD.md (docs/):**
```
Objective: A web app that scans Google QR codes and displays results on a homepage with a bulletin board
Open Questions: None — req.md requirements are clear.
```

| Item | Result |
|:---|:---|
| Ambiguities identified | ❌ 0 — declared "requirements are clear" |
| Competing interpretations listed | ❌ None |
| Interpretation rationale documented | ❌ None |
| Open Questions | ❌ Declared "None" |
| Subject-verb direction check | ❌ None |
| Traceability | ❌ Black box |

### 4-3. Group B — Scripture AIDD Interpretation

**Recorded in spec-tablet-명세서.md (bible-성경/01/):**

**① Assumption Table — 4 items explicitly documented**

| # | req.md phrase | Adopted interpretation | Basis |
|:--|:---|:---|:---|
| 1 | "Google QR code scan" | Browser camera scans QR → displays result on screen | How(verb): "scan" = camera real-time input action |
| 2 | "display on screen" | Inline display on same page (no page navigation) | No mention of separate page navigation |
| 3 | "one bulletin board" | CRUD board with title+content+date (1 table) | Literal interpretation: 1 board table |
| 4 | "Google" | QR code modifier (not Google login) | No Google API or Auth in tech stack |

**② Competitive Interpretation Elimination — all interpretations listed then eliminated by evidence**

| Feature | Interpretation A | Interpretation B | Elimination Basis | Adopted |
|:--|:---|:---|:---|:--:|
| QR Scan | Browser camera direct scan | Image file upload + QR decode | "scan" verb = camera realtime input action | **A** |
| "Google" QR | Google proprietary QR format only | General QR scan (Google is a modifier) | No Google API in req.md or tech stack | **B** |
| Board Auth | Login required | Anonymous access | No Auth in tech stack specification | **B** |

**③ Subject-Verb Direction Check**
```
req.md: "scan a QR code and display on screen"

Core verb: "scan" → the USER actively reads a code with a camera

❌ Wrong reading: "scan" = the system generates and displays a QR code
✅ Correct reading: User scans QR → system displays the result on screen
```

### 4-4. 🏆 Requirements Understanding Verdict

| Analysis Item | Group A | Group B |
|:---|:---:|:---:|
| Ambiguities identified | ❌ 0 | ✅ **4 found** |
| Competing interpretations listed | ❌ | ✅ **3 features × 2 interpretations** |
| Interpretation rationale documented | ❌ | ✅ How(verb) based |
| Open Questions | ❌ Declared "None" | ✅ **2 recorded** |
| Authentication scope explicit | ❌ Implicit | ✅ Explicitly decided |
| Core verb misread check | ❌ | ✅ |
| Interpretation traceability | ❌ Black box | ✅ Permanently documented |

```
Verdict: Group B Scripture AIDD — decisive advantage

Group A: "Requirements are clear" → ambiguity unrecognized → no rationale documented
Group B: Identified 4 ambiguities and 6 competing interpretations from the same req →
         Evidence-based single interpretation → documented → implemented → fully traceable
```

> **Key Insight:** The simpler the req.md, the more room for interpretation.
> Scripture AIDD's "Hearing" Phase systematically closes that room.

### 4-5. Scope Creep Analysis — QR Code Generation

> Original req.md: `"scan a QR code and display on screen"`

**Verb explicitly stated:** `scan` → reading only. **QR code generation is not in req.md.**

| Item | Group A | Group B |
|:---|:---|:---|
| QR generation implemented | ✅ Added | ❌ Not implemented (not in Spec) |
| Scope Creep | ⚠️ Undetected | **0 items** |
| Rationale | — | "scan" = reading verb. Generation is outside Spec scope |

> Group B's SKILL-06 Scope Creep verification automatically filtered out QR generation.
> Group A added a feature not in req.md without any warning.

---

## 5. Code Quality Analysis

### 5-1. Architecture

**Group A — Full routes/views separation**
```
src/
  index.ts (36 ln)     db.ts (64 ln)
  routes/ home.tsx (8 ln) · board.tsx (88 ln)
  views/  layout.tsx (96 ln) · home.tsx (167 ln)
          board/ list.tsx (63 ln) · detail.tsx (72 ln) · form.tsx (93 ln)
tests/
  board.test.ts (146 ln)
```
✅ Single responsibility · High cohesion

**Group B — Component-separated structure**
```
src/
  index.ts (44 ln)        db.ts (76 ln)
  components/Layout.tsx (54 ln)
  routes/ home.tsx (170 ln) · qr.tsx (60 ln) · board.tsx (257 ln)
```
⚠️ board.tsx at 257 lines — contains 7 API routes but cohesive (single domain)
✅ Layout extracted to components/

### 5-2. Security

| Item | Group A | Group B |
|:---|:---:|:---:|
| SQL parameterization | ✅ | ✅ |
| XSS defense | ❌ | ✅ (JSX auto-escape) |
| Server-side input length limit | ❌ | ✅ |
| Global error handler | ❌ | ✅ |
| 404 handler | ✅ | ✅ |

### 5-3. Testing

| Item | Group A | Group B |
|:---|:---|:---|
| **Approach** | vitest automated unit tests | HTTP integration tests (3-layer verification) |
| **Cases** | 12 | 10 (API endpoints) |
| **Isolation** | ✅ In-memory SQLite | ❌ Depends on live server |
| **CI Integration** | ✅ Possible | ❌ Manual only |
| **RTM linkage** | ❌ | ✅ REQ-ID based |
| **Spec tamper detection** | ❌ | ✅ (Layer 2: RTM vs req.md word-level comparison) |
| **Origin verification** | ❌ | ✅ (Layer 3: verify with req.md only, design docs closed) |

### 5-4. Performance

| Item | Group A | Group B |
|:---|:---:|:---:|
| Prepared Statement pre-compilation | ❌ | ✅ |
| DB Index | ❌ | ✅ |
| Static file serving | ❌ | ✅ serveStatic |

---

## 6. Quality Audit — Group B IRONCLAD [Self-adv ✓]

### 3-Domain Audit

| Domain | Audit Contents | Result |
|:---|:---|:---:|
| **Hermeneutics** | Interpretation consistency, core verb re-verification, Scope Creep | ✅ Pass |
| **Logic** | RTM coverage 7/7, Judas-type disguise 0, per-route error handling | ✅ Pass |
| **Error Analysis** | Self-adversarial Review: 5 rebuttals → all failed | ✅ Pass |

### Self-adversarial Review (Path B — Persona Switch)

> "I am now the adversary of the AI that built this code. I rebut every conclusion."

| # | Rebuttal Attempt | Result |
|:--|:--|:--|
| 1 | "QR generation feature is missing" | No "generate" verb in req.md. Rebuttal failed. |
| 2 | "Delete without auth — security risk" | No auth requirement in req.md. Rebuttal failed. |
| 3 | "No pagination" | GET /board?page=N implemented. Rebuttal failed. |
| 4 | "Camera won't work without HTTPS" | localhost permits camera API. Rebuttal failed. |
| 5 | "Empty title/content submission crashes" | Validation + try-catch present. Rebuttal failed. |

**Verdict: IRONCLAD [Self-adv ✓]** ⭐⭐ (Standard confidence)

| Tag | Meaning | Confidence |
|:---|:---|:---:|
| `IRONCLAD [Cross-model ✓]` | Different AI audit passed | ⭐⭐⭐ Highest |
| **`IRONCLAD [Self-adv ✓]`** | **Self-rebuttal passed** | **⭐⭐ Standard** |
| `IRONCLAD` | No cross-validation performed | ⭐ Base |

---

## 7. Feature Completeness

| Feature | Group A | Group B |
|:---|:---:|:---:|
| QR Code Scan (camera) | ✅ | ✅ |
| QR Code Generation | ✅ (not in Spec) | ❌ (not in Spec → excluded) |
| Board List | ✅ | ✅ |
| Create Post | ✅ | ✅ |
| Post Detail | ✅ | ✅ |
| Edit Post | ✅ | ✅ |
| Delete Post | ✅ | ✅ |
| **req.md Completeness** | **100%** | **100%** |

---

## 8. Metacognition & Engine Architecture

### Fundamental Architectural Difference

| | Agent-Skills | Scripture AIDD |
|:---|:---|:---|
| **Engine Type** | Skill Injection Engine | Artifact Anchoring Engine |
| **Source of Truth** | AI context (volatile) | Canonized documents (persistent) |
| **Hallucination Control** | Anti-rationalization checklists | Artifact cross-validation + Self-adversarial Review |
| **Auditability** | ❌ Black box | ✅ Fully traceable |
| **Audit Confidence** | — | IRONCLAD 3-tier tag system |

### Artifact Flow Comparison

```
Group A — Agent-Skills:
  Requirements → [AI internal judgment] → Code
                       ↑ Black box
                       No way to know where it went wrong

Group B — Scripture AIDD:
  Requirements
    → [Externalize interpretation] → spec-tablet.md      ← Anchor 1
    → [Externalize architecture]   → architecture.md     ← Anchor 2
    → [Externalize UI design]      → screen-vision.md    ← Anchor 3
    → [Implement]  ← constrained by Anchors 1·2·3
    → [Test]       ← cross-checked directly against req.md
    → [Audit]      ← 3-domain cross-validation + Self-adversarial rebuttal
    → Code
  ↑ Every step persisted as files → fully auditable
```

---

## 9. Overall Scorecard

| Criterion | Group A | Group B | Winner |
|:---|:---:|:---:|:---:|
| Requirements Understanding | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **B** |
| Architecture Design | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | A |
| Security | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **B** |
| Test Automation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | A |
| Traceability / Documentation | ⭐⭐ | ⭐⭐⭐⭐⭐ | **B** |
| Scope Creep Defense | ⭐⭐ | ⭐⭐⭐⭐⭐ | **B** |
| Quality Verdict System | ❌ | IRONCLAD [Self-adv ✓] | **B** |
| Error Handling | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **B** |
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | A |
| **Total** | **30 pts** | **40 pts** | **Group B wins** |

---

## 10. Conclusion

### Philosophical Difference

```
Agent-Skills:   Tries to make AI smarter
                  → Skill injection to enhance capability
                  → A strategy that trusts AI

Scripture AIDD: Assumes AI will inevitably make mistakes
                  → Artifact anchoring to make mistakes visible
                  → A strategy that doubts AI
                  → And doubt is more powerful
```

### Scripture AIDD — Current Limitations

| Limitation | Impact |
|:---|:---|
| No vitest automated unit tests | Cannot integrate with CI, low reproducibility |
| Cross-model Review not validated | Only Self-adversarial (Path B) used. Different-AI audit (Path A) not performed |
| Execution time | Quality vs. speed tradeoff |

---

## 11. How to Reproduce This Benchmark

> Both runs were triggered by a single prompt to the AI:
> **"Read `autoRun.md` and execute."**
> No further user input was given until completion.

### Prerequisites

- Node.js v24+
- An AI agent that can read files and execute terminal commands (e.g., Antigravity IDE with Claude Sonnet 4.6)
- Clone or copy the source folders as structured in `src/`

### How the Test Starts

| | Group A | Group B |
|:---|:---|:---|
| **Prompt sent** | `"Read autoRun.md and execute."` | `"Read autoRun.md and execute."` |
| **Identical prompt** | ✅ Yes | ✅ Yes |
| **AI reads first** | `autoRun.md` → then each `SKILL.md` per step | `autoRun.md` → then each `SKILL-0N_*.md` per phase |
| **Source of truth during run** | SKILL files (in-context injection) | Canonized artifacts in `bible-성경/` |
| **User interaction** | None (fully automated) | None (fully automated) |

> Both methodologies were triggered identically.
> The only variable is the methodology encoded in `autoRun.md` and its referenced SKILL files.

---

*Report Date: 2026-05-27 · Antigravity IDE*
*Data Sources: `src/qrCodeBoard_Addy/benchmark-result.md` · `src/qrCodeBoard_TheScripture/benchmark-result.md`*
