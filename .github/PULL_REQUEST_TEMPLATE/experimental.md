<!-- 
🧪 EXPERIMENTAL PR TEMPLATE

This PR tracks an experimental branch for rapid API exploration and feedback.

⚠️ IMPORTANT: This PR will NEVER merge to main.
Successful experiments are reimplemented with full quality bar on a fresh PR.

Time-box: 1 month maximum
See docs/EXPERIMENTAL_RELEASE.md for full workflow details.
-->

## 🧪 Experiment Overview

**Feature Name:** `<feature-name>` (from `experimental/<feature-name>` branch)

**Goal:** 
<!-- What API or pattern are you exploring? What problem does this solve? -->

**Success Criteria:**
<!-- How will you know if this experiment succeeded? What feedback are you looking for? -->

**Affected Packages:**
<!-- List 1-3 packages this experiment touches (keep it focused) -->
- [ ] `@accelint/<package-name>`

---

## 📋 Experiment Plan

**Week 1:**
<!-- Implement minimal API sketch, publish first snapshot -->

**Week 2:**
<!-- Gather feedback, iterate on design -->

**Week 3:**
<!-- Decision checkpoint: trending toward success or abandon? -->

**Week 4:**
<!-- Final decision: promote (reimplement) or abandon (document) -->

---

## 🔍 Findings & Feedback

<!-- Update this section as you gather feedback -->

### What's Working
<!-- API patterns, approaches, or designs that are promising -->

### What's Not Working
<!-- Problems discovered, limitations, or concerns -->

### Open Questions
<!-- Unresolved questions that need input -->

---

## 📦 Installation

Once published, stakeholders can install with:

```bash
npm install @accelint/<package>@<feature-name>
```

Publish experimental snapshots via **Actions → Publish Experimental Snapshot → Run workflow**.

---

## ⚠️ Experimental Status

- **Quality Bar:** Minimal (build + types + lint only)
- **Tests:** Not required for experimental
- **Docs:** Not required for experimental  
- **Time-Box:** 1 month maximum
- **Never Merges:** This PR will not merge to main

**Age Tracking:** Automated workflow runs daily with escalating warnings at 2, 3, and 4 weeks.

---

## 🎯 Final Decision

<!-- Complete before closing this PR -->

### Decision: [Promote / Abandon]

**If Promoting:**
- [ ] Close this experimental PR
- [ ] Delete experimental branch
- [ ] Open fresh PR to main with full implementation (tests + docs + review)
- [ ] Reference this PR in new PR for context

**If Abandoning:**
- [ ] Document lessons learned below
- [ ] Close this experimental PR
- [ ] Delete experimental branch

**Lessons Learned:**
<!-- What did we learn from this experiment? What should we do differently? -->

---

📚 **Documentation:** [Experimental Release Workflow](../docs/EXPERIMENTAL_RELEASE.md)
