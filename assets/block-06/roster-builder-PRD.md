# Roster Builder — PRD

**Owner:** Iyad Sultan, MD
**Author:** Iyad Sultan, MD
**Status:** Draft
**Version:** 0.1
**Last updated:** 11 September 2026

---

## 1. TL;DR

Roster Builder is a small Django web app that turns a manually entered list of nurses — name, seniority, monthly shift cap, requested days off, approved leave — into a complete monthly duty roster for an inpatient unit. It generates ten candidate schedules, scores each on coverage, fairness and how many staff requests it honours, and lets the head nurse compare them side by side and export the chosen one to Excel or PDF. It replaces a spreadsheet that currently takes a head nurse a day or more to build by hand and that no one can check for fairness.

## 2. Background & problem

- **Problem:** Monthly duty rosters for the unit are built by hand in Excel. The head nurse has to hold roughly 440 shift assignments, a nurse-to-patient ratio floor, every leave request and every seniority requirement in their head at once. Errors surface after publication — a shift with no senior nurse, a nurse scheduled during approved leave, one nurse with six night shifts while another has one. Fixing one error cascades into others.
- **Affected users:** The unit head nurse who builds the roster; the nursing staff who live with the result; the nursing director who fields fairness complaints.
- **Why now:** No specific external trigger. The work is recurring, entirely rule-based, and currently consumes senior clinical time every month. `[assumed — confirm]`
- **Cost of doing nothing:** Estimated one to two days of head-nurse time per unit per month, plus rework after publication. Unquantified but real: staff dissatisfaction from uneven night and weekend distribution, and the clinical risk of a shift running without a senior nurse. Exact current time cost is `[TBD]`.

## 3. Goals

- **Primary goal:** A head nurse can produce a publishable, rule-compliant monthly roster for their unit in under 30 minutes, including data entry.
- **Secondary goals:**
  - Make workload distribution visible and defensible — every nurse can see their shift, night and weekend count against everyone else's.
  - Catch infeasible months *before* scheduling effort is spent, by comparing roster capacity against demand up front.
  - Honour as many day-off requests as the ratio allows, and show exactly which ones could not be met.

## 4. Non-goals

v1 will **not**:

- Integrate with any HR, payroll, or time-and-attendance system. The roster is typed in each month.
- Store or process any patient-identifiable data. Patient counts are entered as plain numbers.
- Handle shift swaps, sick-leave backfill, or any mid-month change. A published roster is edited outside the tool.
- Compute pay, overtime entitlement, or hours banking.
- Schedule physicians, residents, or any non-nursing staff.
- Support multiple units in one schedule run. One run covers one unit.
- Send notifications to individual nurses.
- Carry state between months — no history, no "last month you had three weekends" balancing across months. `[assumed — confirm]`

## 5. Users & personas

| Persona | Description | Key needs / jobs-to-be-done |
|---------|-------------|------------------------------|
| Primary — Head nurse / unit manager | Builds and owns the monthly roster. Moderate computer skill, works in Excel daily, no scripting. | Enter staff once and reuse; see immediately whether the month is coverable; get several valid options rather than one; justify the result to staff who complain |
| Secondary — Nursing director | Oversees several units, hears escalated fairness complaints. | See the distribution summary; confirm every shift had senior cover; compare units `[TBD — is cross-unit view in scope later?]` |
| Tertiary — Staff nurse | Subject of the roster. Does not log in in v1. | Receive a readable printed or emailed roster; know their requests were considered |

## 6. User stories / use cases

**Roster setup**
- As a head nurse, I want to add each nurse with their seniority level and monthly shift cap, so the generator knows who is available and how much.
- As a head nurse, I want to mark a nurse's approved leave on a calendar, so they are never scheduled during it.
- As a head nurse, I want to mark requested days off separately from approved leave, so the generator treats them as preferences rather than hard blocks.
- As a head nurse, I want to reuse last month's staff list as the starting point, so I only edit what changed.

**Generation**
- As a head nurse, I want to see whether my roster can cover the month before I generate anything, so I can escalate a staffing shortfall instead of discovering it in the output.
- As a head nurse, I want ten candidate schedules rather than one, so I can pick the trade-off I prefer.
- As a head nurse, I want each candidate scored on coverage, workload balance, night balance, weekend balance and requests honoured, so I can compare them without reading 93 shifts.

**Review and publish**
- As a head nurse, I want to view a schedule by day and by nurse, so I can check both coverage and individual fairness.
- As a head nurse, I want to see which requested days off were not honoured and for whom, so I can speak to those nurses before publishing.
- As a head nurse, I want to export to Excel so I can make final manual edits, and to PDF so I can post it on the unit.

## 7. User experience

**Happy path**

1. Head nurse logs in and opens their unit.
2. Selects the target month. The staff list from the previous month loads.
3. Updates the list — adds a new hire, removes a leaver, adjusts shift caps.
4. Opens each nurse's calendar and marks requested days off and approved leave.
5. Enters expected patient census: weekday and weekend. The app shows required nurses per shift and total nurse-shifts for the month.
6. A capacity indicator shows roster capacity against demand, and senior capacity against the number of shifts. If either is short, the app says so in plain terms and names the shortfall.
7. Head nurse clicks Generate. Ten schedules are produced and ranked by score.
8. Selects a candidate, reviews it by day and by nurse, checks the unmet requests list.
9. Exports to Excel or PDF.

**Key edge cases**

- **Infeasible month** — capacity below demand. The app must refuse to pretend: state the shortfall in nurse-shifts, and explain that either caps rise or staff are added. It should still allow generation so the head nurse can see *where* the gaps land.
- **Insufficient seniors** — fewer senior-nurse-shifts available than shifts in the month. Flag separately from general capacity; this fails even when headcount looks fine.
- **All candidates violate the same request** — surface it explicitly rather than burying it in a count. It usually means that date is structurally overcommitted.
- **Empty state** — a new unit with no staff. The screen should invite the first entry, not show an empty grid.
- **Nurse with leave covering most of the month** — should not be dropped silently from the roster; show them with zero or few shifts.
- **Partial month / mid-month start** `[TBD — is this needed?]`

**Wireframes / mockups:** A working single-page prototype exists (`nurse-roster-builder.jsx`, 11 Sep 2026) covering staff entry, the day/leave calendar, capacity indicator, ten-candidate generation and ranking, day and nurse views, and CSV export. Treat it as the interaction reference for v1.

**Interaction principles**

- Show the feasibility verdict before the work, not after.
- Never present a schedule that breaks a hard rule. If a rule cannot be met, say so.
- Every score is decomposed — a single number with no breakdown is not actionable.
- Manual override belongs in Excel. The app hands off cleanly rather than trying to be an editor.

## 8. Functional requirements

### 8.1 Staff roster

- FR-1.1 — Add, edit and remove nurses; each has name, seniority level, and monthly shift cap.
- FR-1.2 — Seniority levels are Senior, Intermediate, Junior. `[assumed — confirm these match KHCC nursing grades]`
- FR-1.3 — Per nurse, mark any date in the month as *requested off* (soft) or *approved leave* (hard).
- FR-1.4 — Persist the staff list per unit and offer it as the starting point for the next month.
- FR-1.5 — Validate on entry: shift cap between 0 and the number of days in the month; name required.

### 8.2 Demand model

- FR-2.1 — Accept weekday and weekend patient census as separate numbers.
- FR-2.2 — Accept the patient-to-nurse ratio as a configurable number, defaulting to 4.
- FR-2.3 — Compute nurses required per shift as census divided by ratio, rounded up.
- FR-2.4 — Define the week as three 8-hour shifts per day: Morning 07:00–15:00, Evening 15:00–23:00, Night 23:00–07:00.
- FR-2.5 — Treat Saturday and Sunday as weekend days.
- FR-2.6 — Display total shifts and total nurse-shifts for the selected month before generation.

### 8.3 Scheduling rules

Hard constraints — a schedule violating any of these is never shown:

- FR-3.1 — No nurse is assigned on a day of approved leave.
- FR-3.2 — No nurse works more than one shift in a calendar day.
- FR-3.3 — No nurse exceeds their monthly shift cap.
- FR-3.4 — Every shift includes at least one Senior nurse.
- FR-3.5 — A nurse who works a night shift is off the following calendar day.
- FR-3.6 — No nurse works an evening shift followed by the next morning shift.
- FR-3.7 — No nurse works more than 5 consecutive days. `[assumed — confirm against KHCC HR policy]`

Soft constraints — optimised, reported, never enforced:

- FR-3.8 — Honour requested days off.
- FR-3.9 — Equalise total shifts as a proportion of each nurse's cap.
- FR-3.10 — Equalise night shifts across staff.
- FR-3.11 — Equalise weekend shifts across staff.

### 8.4 Generation and scoring

- FR-4.1 — Produce 10 distinct candidate schedules per run.
- FR-4.2 — Score each on coverage, requests honoured, workload balance, night balance and weekend balance, and present the components, not just the total.
- FR-4.3 — Rank candidates by total score, highest first.
- FR-4.4 — Report unfilled shift slots per candidate and identify which shifts are short.
- FR-4.5 — Generation is deterministic given the same inputs and seed, so a result can be reproduced.
- FR-4.6 — Number of candidates is configurable. `[assumed — confirm 10 is right; a head nurse may only ever look at 3]`

### 8.5 Review and export

- FR-5.1 — Day view: every date, every shift, staff assigned, senior marked.
- FR-5.2 — Nurse view: per nurse, total shifts against cap, nights, weekend days, requests missed.
- FR-5.3 — List every unmet request with nurse and date.
- FR-5.4 — Export to Excel — one sheet of assignments, one sheet of the per-nurse summary.
- FR-5.5 — Export to PDF — a print-ready month grid suitable for posting on the unit.
- FR-5.6 — Exports carry the unit name, month, generation timestamp and candidate number.

### 8.6 Accounts

- FR-6.1 — Authenticated access. `[TBD — KHCC SSO, or app-local accounts?]`
- FR-6.2 — A user sees only their own unit(s). `[assumed — confirm]`

## 9. Non-functional requirements

- **Performance:** Ten candidates for a 30-nurse, 31-day month generated in under 15 seconds. Above that, run generation as a background job with a progress indicator rather than blocking the request.
- **Scalability:** Single-digit concurrent users. `[assumed — confirm; if this spreads to every KHCC inpatient unit, revisit]`
- **Reliability / uptime:** Best-effort. This is a monthly-cadence tool; an outage is an inconvenience, not an incident. No formal SLA in v1.
- **Security & privacy:** Staff names and leave dates are personnel data. No patient-identifiable data is stored at any point — census is a bare integer. Requires authentication, HTTPS, and no secrets in source. Confirm whether hosting staff leave data on Replit is acceptable to KHCC — this is the one privacy question that could invalidate the deployment choice. `[TBD — needs an answer before build starts]`
- **Accessibility:** WCAG 2.1 AA for the core flows — keyboard-navigable calendar, visible focus, no colour-only encoding of shift type or seniority.
- **Internationalization / localization:** Interface English in v1. Staff names must render correctly in Arabic script in the UI **and in the PDF export**, which requires an embedded Arabic-capable font. Full RTL interface is `[TBD]`.
- **Compliance:** Jordanian Labour Law limits on working hours, consecutive days and rest periods must be checked against FR-3.5 to FR-3.7. KHCC nursing HR policy on monthly hours and overtime likewise. `[TBD — both need review before the rules are locked]`

## 10. Technical considerations

- **Stack:** Django, developed and hosted on Replit. Relational store — Postgres if Replit provides it, otherwise SQLite. Server-rendered templates with light JavaScript for the calendar and comparison views. `openpyxl` for Excel export; PDF generation via WeasyPrint or ReportLab `[assumed — confirm]`.
- **Key integrations:** None in v1.
- **What's hard:**
  1. **The solver.** The prototype uses randomised greedy construction followed by local-search improvement, which produces feasible, reasonably balanced schedules and is easy to reason about. The stronger answer is a constraint solver — OR-Tools CP-SAT — which handles hard constraints natively and optimises soft ones properly, and would let rules be added without rewriting the search. The trade-off is a heavier dependency and memory footprint, which may not fit Replit's limits. Recommend prototyping CP-SAT early; if it does not fit, the existing heuristic is an acceptable v1.
  2. **Arabic text in the PDF export.** Font embedding plus correct shaping and bidirectional layout is the classic place this breaks. Test with real staff names in week one, not at the end.
- **Already-decided constraints:** Django; Replit as the development and hosting environment; manual data entry, no HR integration; Excel and PDF as the output formats.

## 11. Dependencies

- KHCC nursing administration — sign-off on the hard rule set (FR-3.1 to FR-3.7) and on the seniority levels.
- KHCC HR / legal — confirmation that the consecutive-day and rest rules match Jordanian Labour Law and internal policy.
- KHCC information security — a decision on whether staff personnel data may be hosted on Replit. This is a blocker, not a checklist item.
- One pilot unit and its head nurse, willing to run a real month in parallel with their manual process.

## 12. Success metrics

- **Adoption:** The pilot unit uses the tool to produce its published roster for 3 consecutive months.
- **Engagement:** Head nurse completes a full month — entry through export — in under 30 minutes by the second month of use.
- **Outcome:** Roster preparation time drops by at least 70% against the measured manual baseline. Requires baselining the current process before the pilot; without that number this metric is unverifiable.
- **Quality:**
  - Zero published rosters containing a hard-rule violation.
  - Share of requested days off honoured, reported per month, with a target of 85% once staffing capacity is adequate `[assumed — confirm the target]`.
  - Night and weekend shift counts fall within ±2 across staff of comparable caps.
- **Counter-metric:** Number of manual edits made in Excel after export. A high number means the schedules are not actually usable, regardless of what the score says.

## 13. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Unit does not have enough senior nurses to put one on every shift | High | High — the core rule becomes unachievable | Surface senior capacity separately in the pre-check; let FR-3.4 be relaxed per unit with an explicit, logged decision |
| Roster capacity below demand — a staffing problem, not a scheduling one | High | High | Pre-check states the shortfall in nurse-shifts before generation; escalate as a staffing finding |
| Security review rejects hosting personnel data on Replit | Medium | High — forces a hosting change mid-build | Ask before the build starts; keep deployment-agnostic (standard Django, no Replit-specific APIs) |
| Head nurse does not trust the output and keeps the manual roster | Medium | High — the tool is shelved | Run parallel for one month; make every score component inspectable; track the post-export edit count |
| Arabic names break in the PDF export | Medium | Medium | Test font embedding and shaping in week one with real names |
| Rules encoded here conflict with labour law or HR policy | Medium | High | Legal and HR review before the rule set is locked |
| Manual entry of 25+ nurses each month becomes the new burden | Medium | Medium | Carry the staff list forward month to month; only leave and requests are re-entered |
| Scope creep into swaps, sick cover and multi-unit scheduling | High | Medium | Non-goals in §4 are binding for v1 |

## 14. Rollout plan

- **Internal alpha:** Iyad plus one head nurse. One unit, one month, run alongside the existing manual roster. Success: the generated schedule is judged publishable with fewer than 10 manual edits.
- **Beta:** 2–3 units, real published rosters, feedback collected directly. `[TBD — which units?]` Success: each unit completes two consecutive months without reverting to manual.
- **GA:** Offered to any KHCC inpatient unit. Criteria to leave beta: three consecutive months with zero hard-rule violations in published rosters, and median preparation time under 30 minutes.
- **Rollback criteria:** Any published roster containing a hard-rule violation — a shift without senior cover, or a nurse scheduled during approved leave — pauses rollout until the cause is found. Decision sits with Iyad.

## 15. Timeline & milestones

| Milestone | Target date | Owner |
|-----------|-------------|-------|
| Spec sign-off | `[TBD]` | Iyad Sultan |
| Security decision on Replit hosting | Before kickoff — blocking | `[TBD]` |
| Nursing admin sign-off on rule set | Before kickoff — blocking | `[TBD]` |
| Engineering kickoff | `[TBD]` | `[TBD]` |
| Solver spike — CP-SAT vs heuristic on Replit | Kickoff + 1 week | `[TBD]` |
| Alpha — one unit, parallel run | `[TBD]` | Iyad Sultan |
| Beta | `[TBD]` | `[TBD]` |
| GA | `[TBD]` | `[TBD]` |

## 16. Open questions

Blocking:

- [ ] Will KHCC information security permit staff personnel data (names, leave dates) on Replit? If not, where does this deploy?
- [ ] Do FR-3.5 to FR-3.7 — rest day after nights, no evening-to-morning turn, 5 consecutive days maximum — match Jordanian Labour Law and KHCC HR policy? These were proposed, not sourced.
- [ ] Do Senior / Intermediate / Junior match the actual KHCC nursing grades, and is "senior on every shift" the right clinical rule, or should it be a charge-nurse competency instead of a grade?

Non-blocking:

- [ ] What is the current manual roster preparation time? Needed to baseline the §12 time-saving metric.
- [ ] Which unit pilots, and which units follow in beta?
- [ ] Is 10 candidates the right number, or is 3 enough in practice?
- [ ] Should the app carry fairness across months — remembering who worked more weekends last month — or is per-month balance sufficient?
- [ ] Is a cross-unit view for the nursing director in scope later?
- [ ] Do staff nurses ever get direct access, or is distribution always via the head nurse's export?
- [ ] Is a partial or mid-month roster ever needed?
- [ ] Authentication: KHCC SSO or app-local accounts?
- [ ] Is 85% the right target for requests honoured?
- [ ] PDF library: WeasyPrint or ReportLab?

## 17. Appendix

**Glossary**

- *Shift* — one of three 8-hour periods in a day: Morning, Evening, Night.
- *Nurse-shift* — one nurse assigned to one shift. The unit of scheduling demand.
- *Hard constraint* — a rule never violated in any presented schedule.
- *Soft constraint* — a preference optimised for and reported on, but not guaranteed.
- *Shift cap* — the maximum number of shifts a nurse may work in the month.
- *Requested day off* — a soft preference. *Approved leave* — a hard block.

**Worked example — October 2026**

With Saturday–Sunday weekends, October 2026 has 22 weekdays and 9 weekend days.

| | Weekday | Weekend |
|---|---|---|
| Patients | 20 | 15 |
| Nurses per shift at 1:4 | 5 | 4 |
| Days | 22 | 9 |
| Shifts | 66 | 27 |
| Nurse-shifts | 330 | 108 |

Total: 93 shifts, **438 nurse-shifts**. At a 21-shift cap, that needs 21 nurses at full capacity with no leave — realistically 24 or more. Separately, all 93 shifts need senior cover, so at least 5 seniors working near-full months, and more once their leave is counted. Senior cover, not headcount, is usually the binding constraint.

**Prior art**

Commercial nurse-rostering products exist (Kronos/UKG, RosterElf, Shiftboard). None were evaluated. The case for building is that the requirement is narrow, the ratio and seniority rules are local, and procurement for a single unit is disproportionate. If this spreads beyond a few units, revisit build-versus-buy. `[assumed — confirm no KHCC-wide scheduling system is already licensed]`

**Related artifacts**

- `nurse-roster-builder.jsx` — working prototype, 11 September 2026. Reference implementation for the interaction model and the heuristic solver.
