const { useState } = React;

/* ────────────────────────────────────────────────────────────
   Interactive explainer for:
   Lehrnbecher T, Robinson PD, Ammann RA, et al.
   "Guideline for the Management of Fever and Neutropenia in
   Pediatric Patients With Cancer and Hematopoietic Cell
   Transplantation Recipients: 2023 Update"
   J Clin Oncol 2023;41:1774-1785. DOI 10.1200/JCO.22.02224
   ──────────────────────────────────────────────────────────── */

const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  button { font-family: inherit; cursor: pointer; }
  .fade-in { animation: fadeIn 0.35s ease forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important; }
  @media (prefers-reduced-motion: reduce) {
    .fade-in { animation: none; }
    .hover-lift:hover { transform: none; }
  }
`;
if (!document.head.querySelector("[data-pfa-style]")) {
  styleTag.setAttribute("data-pfa-style", "1");
  document.head.appendChild(styleTag);
}

const serif = "'Lora', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";
const mono = "'DM Mono', monospace";

const T = {
  cream: "#faf8f4",
  white: "#ffffff",
  faint: "#f1f5f9",
  ink: "#1c1917",
  inkLight: "#44403c",
  muted: "#78716c",
  border: "#e7e4df",
  borderDk: "#d6d3ce",
  blue: "#2563eb", blueL: "#eff6ff", blueMid: "#bfdbfe",
  teal: "#0d9488", tealL: "#f0fdfa",
  orange: "#ea580c", orangeL: "#fff7ed",
  purple: "#7c3aed", purpleL: "#f5f3ff",
  green: "#16a34a", greenL: "#f0fdf4",
  red: "#dc2626", redL: "#fef2f2",
  yellow: "#ca8a04", yellowL: "#fefce8",
  indigo: "#4f46e5", indigoL: "#eef2ff",
};

/* ──────────────── shared primitives ──────────────── */

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.white, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "22px 24px", ...style,
    }}>
      {children}
    </div>
  );
}

function Callout({ icon, color = T.blue, bg, children, style = {} }) {
  return (
    <div style={{
      background: bg || T.blueL, border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`, borderRadius: "0 12px 12px 0",
      padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start", ...style,
    }}>
      {icon && <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <div style={{ fontSize: 13.5, color: T.inkLight, lineHeight: 1.75, fontFamily: sans }}>
        {children}
      </div>
    </div>
  );
}

function Analogy({ children }) {
  return (
    <div style={{
      background: T.yellowL, border: "1px solid #fde68a",
      borderRadius: 10, padding: "12px 16px",
      fontSize: 13.5, color: T.inkLight, lineHeight: 1.75, fontFamily: sans,
    }}>
      <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: T.yellow, marginRight: 8 }}>
        💡 ANALOGY
      </span>
      {children}
    </div>
  );
}

function SectionHeading({ label, color = T.blue }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 4, height: 24, background: color, borderRadius: 2 }} />
      <span style={{ fontFamily: serif, fontSize: 20, color: T.ink, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function SubHeading({ children, color = T.blue }) {
  return (
    <div style={{
      fontFamily: mono, fontSize: 10.5, letterSpacing: 1.5,
      textTransform: "uppercase", color, marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

function Prose({ children, style = {} }) {
  return (
    <p style={{ fontSize: 14, color: T.inkLight, lineHeight: 1.85, fontFamily: sans, ...style }}>
      {children}
    </p>
  );
}

function Stack({ children, gap = 16, style = {} }) {
  return <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>{children}</div>;
}

/* Small badge for recommendation strength / evidence quality */
function Badge({ children, color = T.muted, bg = T.faint }) {
  return (
    <span style={{
      fontFamily: mono, fontSize: 9.5, letterSpacing: 0.6, color,
      background: bg, border: `1px solid ${color}30`,
      borderRadius: 6, padding: "3px 7px", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* A single guideline recommendation, rendered consistently everywhere */
function RecCard({ rec, color = T.blue, compact = false }) {
  const strong = rec.strength === "strong";
  return (
    <div style={{
      background: T.white, border: `1px solid ${T.border}`,
      borderLeft: `4px solid ${strong ? color : `${color}55`}`,
      borderRadius: "0 10px 10px 0", padding: compact ? "10px 14px" : "13px 16px",
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ fontFamily: mono, fontSize: 11.5, color, fontWeight: 500 }}>{rec.id}</span>
        <Badge color={strong ? T.ink : T.muted} bg={strong ? T.faint : T.white}>
          {strong ? "STRONG" : "CONDITIONAL"}
        </Badge>
        <Badge color={QUALITY_COLOR[rec.quality]} bg={T.white}>
          {rec.quality.toUpperCase()} QUALITY
        </Badge>
      </div>
      <div style={{ fontSize: 13, color: T.inkLight, lineHeight: 1.7, fontFamily: sans }}>{rec.text}</div>
    </div>
  );
}

const QUALITY_COLOR = {
  high: T.green,
  moderate: T.teal,
  low: T.orange,
  "very low": T.red,
};

/* ──────────────── the 24 recommendations, verbatim in substance ──────────────── */

const RECS = [
  { id: "A1", sec: "A", strength: "strong", quality: "low",
    text: "Adopt a validated risk stratification strategy and incorporate it into routine clinical management." },
  { id: "A2", sec: "A", strength: "strong", quality: "low",
    text: "Obtain blood cultures at the onset of fever and neutropenia from all lumens of central venous catheters." },
  { id: "A3", sec: "A", strength: "conditional", quality: "moderate",
    text: "Consider obtaining peripheral blood cultures concurrent with central venous catheter cultures." },
  { id: "A4", sec: "A", strength: "conditional", quality: "low",
    text: "Consider urinalysis and urine culture in patients where a clean-catch, mid-stream specimen is readily available." },
  { id: "A5", sec: "A", strength: "strong", quality: "moderate",
    text: "Obtain chest radiography only in patients with respiratory signs or symptoms." },
  { id: "A6a", sec: "A", strength: "strong", quality: "high",
    text: "Use monotherapy with an antipseudomonal β-lactam, a fourth-generation cephalosporin or a carbapenem as empiric antibacterial therapy in pediatric high-risk FN." },
  { id: "A6b", sec: "A", strength: "strong", quality: "moderate",
    text: "Reserve addition of a second anti-Gram-negative agent or a glycopeptide for patients who are clinically unstable, when a resistant infection is suspected, or for centers with a high rate of resistant pathogens." },
  { id: "A7a", sec: "A", strength: "conditional", quality: "moderate",
    text: "Consider initial or step-down outpatient management if the infrastructure is in place to ensure careful monitoring and follow-up." },
  { id: "A7b", sec: "A", strength: "conditional", quality: "moderate",
    text: "Consider oral antibacterial therapy administration if the patient is able to tolerate this route of administration reliably." },
  { id: "B1", sec: "B", strength: "strong", quality: "moderate",
    text: "In patients responding to initial empiric antibacterial therapy, discontinue double Gram-negative coverage or empiric glycopeptide (if started) after 24–72 hours when there is no microbiologic indication to continue." },
  { id: "B2", sec: "B", strength: "strong", quality: "low",
    text: "Do not broaden the initial empiric antibacterial regimen based solely on persistent fever in patients who are clinically stable." },
  { id: "B3", sec: "B", strength: "strong", quality: "very low",
    text: "In patients with persistent fever who become clinically unstable, escalate to cover resistant Gram-negative, Gram-positive and anaerobic bacteria." },
  { id: "B4", sec: "B", strength: "strong", quality: "low",
    text: "In both high-risk and low-risk FN patients clinically well and afebrile for at least 24 hours, discontinue empiric antibacterial therapy if blood cultures remain negative at 48 hours and there is evidence of marrow recovery." },
  { id: "B5", sec: "B", strength: "conditional", quality: "moderate",
    text: "In low-risk FN patients clinically well and afebrile for at least 24 hours, consider discontinuing empiric antibacterial therapy if blood cultures remain negative at 48 hours despite no evidence of marrow recovery." },
  { id: "C1", sec: "C", strength: "strong", quality: "low",
    text: "Define invasive fungal disease (IFD) high-risk patients as those with AML, high-risk ALL or relapsed acute leukemia; prolonged neutropenia; high-dose steroids; or allogeneic HCT in the first year without T-cell reconstitution, or on steroids or multiple immunosuppressives for GVHD. All others are IFD low-risk." },
  { id: "C2a", sec: "C", strength: "conditional", quality: "moderate",
    text: "Consider not using serum galactomannan to guide empiric antifungal management in prolonged FN." },
  { id: "C2b", sec: "C", strength: "strong", quality: "low",
    text: "Do not use β-D-glucan." },
  { id: "C2c", sec: "C", strength: "strong", quality: "moderate",
    text: "Do not use fungal polymerase chain reaction testing in blood." },
  { id: "C3a", sec: "C", strength: "strong", quality: "low",
    text: "Perform computed tomography of the lungs." },
  { id: "C3b", sec: "C", strength: "conditional", quality: "low",
    text: "Consider imaging of the abdomen, such as ultrasound." },
  { id: "C3c", sec: "C", strength: "conditional", quality: "low",
    text: "Consider not routinely performing CT of the sinuses in patients without localizing signs or symptoms." },
  { id: "C4", sec: "C", strength: "strong", quality: "high",
    text: "In IFD high-risk patients with prolonged (≥96 hours) FN unresponsive to broad-spectrum antibacterial therapy, initiate caspofungin or liposomal amphotericin B — unless a pre-emptive approach is chosen." },
  { id: "C5", sec: "C", strength: "conditional", quality: "moderate",
    text: "In non-HCT IFD high-risk patients not receiving antimold prophylaxis, consider a pre-emptive approach: defer empiric antifungals and treat only if evaluation suggests or indicates IFD." },
  { id: "C6", sec: "C", strength: "conditional", quality: "low",
    text: "In IFD low-risk patients with prolonged (≥96 hours) FN, consider withholding empiric antifungal therapy." },
];

const byId = (id) => RECS.find((r) => r.id === id);

/* ──────────────── tab configuration ──────────────── */

const TABS = [
  {
    id: "overview", icon: "🌡️", label: "Why This Guideline", short: "the problem",
    color: T.blue,
    intro:
      "Fever with neutropenia is the most common reason a child on chemotherapy ends up in hospital urgently — and for decades, what happened next depended largely on which hospital they walked into. This guideline is the third edition of an international attempt to replace that variation with evidence. Here you can trace how the 2012, 2017 and 2023 versions differ, and see exactly what changed this time.",
  },
  {
    id: "grade", icon: "⚖️", label: "Reading a Recommendation", short: "the grade system",
    color: T.teal,
    intro:
      "Every line in this guideline carries two labels: how strongly the panel recommends it, and how good the underlying evidence is. Those two labels are independent, and confusing them is the single most common way guidelines get misread. On this tab you can sort all 24 recommendations into a strength-by-evidence grid and see where the certainty actually lies.",
  },
  {
    id: "initial", icon: "🚑", label: "The First Hours", short: "section a",
    color: T.orange,
    intro:
      "Section A covers everything from the moment fever is documented to the first dose of antibiotics: stratify risk, take the right cultures, skip the wrong tests, and start a single broad-spectrum drug. Build a patient below and watch the guideline's own logic assemble the workup and the initial regimen.",
  },
  {
    id: "evidence", icon: "📊", label: "What the Trials Showed", short: "the data",
    color: T.purple,
    intro:
      "The panel pooled 79 randomized trials into five head-to-head comparisons. Almost every confidence interval crosses the line of no difference — which is itself the finding that drives the recommendations toward the simpler, cheaper, less invasive option. Pick a comparison and read the pooled estimates as a forest plot.",
  },
  {
    id: "ongoing", icon: "⏱️", label: "Stopping Antibiotics", short: "section b",
    color: T.green,
    intro:
      "Section B governs days two through five: when not to escalate, when to escalate, and — the headline change of 2023 — when it is safe to stop. The threshold for stopping in low-risk patients without count recovery moved from 72 hours to 48. Work the stopping rules with the decision tool below.",
  },
  {
    id: "antifungal", icon: "🍄", label: "Prolonged Fever & Fungi", short: "section c",
    color: T.red,
    intro:
      "Once fever has persisted 96 hours on broad-spectrum antibacterials, the question becomes fungal. Section C decides who is at risk, which tests earn their place (most do not), and the new option of waiting for evidence rather than treating everyone. Check risk factors below and compare the empiric and pre-emptive strategies side by side.",
  },
  {
    id: "gaps", icon: "🧭", label: "Gaps & Implementation", short: "what's unresolved",
    color: T.indigo,
    intro:
      "The panel published its own list of what it does not know — nineteen open questions spanning presentation, ongoing care and antifungal management. That list is arguably more useful than the recommendations for anyone planning research or an institutional pathway. Browse the gaps by phase of care, and see what implementation actually requires.",
  },
];

/* ════════════════════════════════════════════════════════════
   TAB 1 — WHY THIS GUIDELINE
   ════════════════════════════════════════════════════════════ */

const EDITIONS = [
  {
    year: "2012",
    title: "First edition",
    emoji: "📜",
    summary: "The first international pediatric-specific FN guideline. Built mostly on non-randomized comparisons, because pediatric trials were scarce.",
    detail:
      "Before 2012 there was no pediatric-specific guidance. Centers adapted adult febrile neutropenia protocols, which assume a different disease mix, different drug tolerability and a different balance of risks. The panel's founding argument was blunt: children are not little adults. With few pediatric randomized trials available, this edition leaned on systematic reviews and meta-analyses of observational comparisons.",
  },
  {
    year: "2017",
    title: "First update",
    emoji: "🔁",
    summary: "Systematic reviews of both observational studies and randomized trials, reflecting a growing pediatric trial base. 69 randomized trials informed it.",
    detail:
      "By 2017 enough pediatric randomized trials existed that the panel could review them alongside observational data. This edition set most of the architecture still in use today: risk stratification, monotherapy for high-risk patients, outpatient and oral options for low-risk patients, and the 96-hour trigger for antifungal decisions.",
  },
  {
    year: "2023",
    title: "Second update",
    emoji: "🧪",
    summary: "Restricted to randomized trials only. Ten new trials joined the 69 already identified, for a total of 79 informing the current version.",
    detail:
      "The methodological hypothesis this time was explicit: only direct, high-quality data would justify changing an existing recommendation, so the search was restricted to randomized trials. Agreement between the two independent screeners was perfect (kappa = 1.0). Notably, the ten new trials were better conducted than the older ones — 70% had adequate sequence generation and allocation concealment, against 23% and 10% in the 2017 pool — though none blinded participants or personnel.",
  },
];

const CHANGES_2023 = [
  {
    tag: "CHANGE 1",
    color: T.green,
    bg: T.greenL,
    icon: "✂️",
    head: "Stop antibiotics at 48 hours, not 72",
    body:
      "In low-risk patients who are clinically well and afebrile for 24 hours with negative blood cultures, empiric antibacterial therapy can be considered for discontinuation at 48 hours even without evidence of marrow recovery. The previous threshold was 72 hours.",
    rec: "B5",
  },
  {
    tag: "CHANGE 2",
    color: T.red,
    bg: T.redL,
    icon: "🍄",
    head: "Wait for evidence before starting antifungals",
    body:
      "In non-transplant high-risk patients not on antimold prophylaxis, a pre-emptive strategy — investigate, then treat only if the workup suggests fungal disease — is now an accepted alternative to treating everyone empirically at 96 hours.",
    rec: "C5",
  },
  {
    tag: "CHANGE 3",
    color: T.orange,
    bg: T.orangeL,
    icon: "⏱️",
    head: "A good practice statement on speed",
    body:
      "For febrile patients who are clinically unstable, start guideline-consistent empiric antibacterial therapy as soon as possible — ideally much sooner than one hour after presentation, while resuscitation continues in parallel. No trial randomized this; no ethical trial could.",
    rec: "GPS1",
  },
];

function TabOverview() {
  const [open, setOpen] = useState(null);
  const C = T.blue;

  return (
    <Stack gap={26}>
      <div>
        <SectionHeading label="A common emergency, managed inconsistently" color={C} />
        <Stack gap={14}>
          <Prose>
            A child receiving chemotherapy develops a fever. Their neutrophil count is low, so the
            usual signs of infection — pus, redness, a visible focus — may never appear. That
            combination, <strong>fever and neutropenia (FN)</strong>, is treated as an emergency
            everywhere, because a proportion of these children are in the early hours of a
            bloodstream infection that can kill within a day.
          </Prose>
          <Prose>
            The problem this guideline addresses is not whether to act, but that centers act
            differently. Surveys from the United Kingdom, Canada, Australia and New Zealand all found
            substantial variation in admission thresholds, drug choice and duration — and variation
            between wards within the same hospital. Deviation from guideline-based therapy in febrile
            neutropenia has been linked to worse outcomes, which is the case for standardizing at
            all.
          </Prose>
          <Analogy>
            Think of an airline checklist. Any experienced captain could probably land the plane
            without one, and each would do it slightly differently. The checklist exists because the
            variation itself — not the skill of any individual — is what produces the rare
            catastrophe. A clinical practice guideline is the same instrument aimed at the same
            problem: it narrows the range of what happens to a child at 3 a.m. when the covering
            physician is not the oncologist who knows them.
          </Analogy>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 1 — TRACE THE THREE EDITIONS</SubHeading>
        <Prose style={{ marginBottom: 14 }}>
          This is the third version of the same document. Each edition changed not only its
          conclusions but its evidence standard. Click any edition to see what the panel was working
          with at the time.
        </Prose>
        <Stack gap={10}>
          {EDITIONS.map((e, i) => (
            <div
              key={e.year}
              className="hover-lift"
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                background: open === i ? T.blueL : T.white,
                border: `1.5px solid ${open === i ? C : T.border}`,
                borderRadius: 12, padding: "16px 20px", cursor: "pointer", transition: "all 0.22s",
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22 }}>{e.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontFamily: mono, fontSize: 13, color: C }}>{e.year}</span>
                    <span style={{ fontFamily: serif, fontSize: 15, color: T.ink, fontWeight: 600 }}>
                      {e.title}
                    </span>
                  </div>
                  <Prose style={{ fontSize: 13 }}>{e.summary}</Prose>
                  <div style={{ fontFamily: mono, fontSize: 10, color: C, marginTop: 8 }}>
                    {open === i ? "▲ less" : "▼ read more"}
                  </div>
                  {open === i && (
                    <div className="fade-in" style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C}30` }}>
                      <Prose style={{ fontSize: 13 }}>{e.detail}</Prose>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 2 — SEE WHAT ACTUALLY CHANGED IN 2023</SubHeading>
        <Prose style={{ marginBottom: 14 }}>
          Ten new trials produced exactly three changes. Everything else in the guideline was either
          confirmed by new evidence or left standing because no new trial addressed it. That ratio —
          three changes from a decade of research — is worth sitting with.
        </Prose>
        <Stack gap={12}>
          {CHANGES_2023.map((c) => (
            <div key={c.tag} style={{
              background: c.bg, border: `1px solid ${c.color}35`,
              borderLeft: `4px solid ${c.color}`, borderRadius: "0 12px 12px 0", padding: "16px 20px",
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: 1.2, color: c.color }}>
                      {c.tag}
                    </span>
                    <Badge color={c.color} bg={T.white}>{c.rec}</Badge>
                  </div>
                  <div style={{ fontFamily: serif, fontSize: 16, color: T.ink, fontWeight: 600, marginBottom: 6 }}>
                    {c.head}
                  </div>
                  <Prose style={{ fontSize: 13 }}>{c.body}</Prose>
                </div>
              </div>
            </div>
          ))}
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>THE EVIDENCE BASE IN NUMBERS</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 6 }}>
          {[
            ["79", "randomized trials informing the 2023 version", T.blue],
            ["10", "of those are new since 2017", T.teal],
            ["70%", "of trials studied unclear or mixed risk populations", T.orange],
            ["1", "trial studied transplant recipients only", T.red],
          ].map(([n, label, col]) => (
            <div key={label} style={{
              background: T.white, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontFamily: serif, fontSize: 28, color: col, fontWeight: 600, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 8, lineHeight: 1.5, fontFamily: sans }}>{label}</div>
            </div>
          ))}
        </div>
        <Prose style={{ fontSize: 12.5, marginTop: 12, color: T.muted }}>
          What you just saw: the last two numbers matter as much as the first two. Seven in ten trials
          did not clearly separate high-risk from low-risk patients, and exactly one trial studied
          transplant recipients exclusively — yet the guideline makes distinct recommendations for
          both groups.
        </Prose>
      </div>

      <Callout icon="🔑" color={C} bg={T.blueL}>
        <strong>Key insight.</strong> This guideline is not a summary of what fever and neutropenia
        research has established. It is a summary of the small number of questions that have been
        randomized in children — layered over a much larger set of decisions the panel had to make on
        indirect evidence and judgment. Knowing which is which is the entire skill of using it well,
        and that is what the next tab is for.
      </Callout>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 2 — READING A RECOMMENDATION (GRADE)
   ════════════════════════════════════════════════════════════ */

const QUALITIES = ["high", "moderate", "low", "very low"];
const STRENGTHS = ["strong", "conditional"];

const QUALITY_MEANING = {
  high: "Further research is very unlikely to change the estimate of effect.",
  moderate: "Further research is likely to have an important impact and may change the estimate.",
  low: "Further research is very likely to change the estimate.",
  "very low": "Any estimate of effect is very uncertain.",
};

function TabGrade() {
  const [cell, setCell] = useState(null);
  const C = T.teal;

  const matches = cell
    ? RECS.filter((r) => r.strength === cell[0] && r.quality === cell[1])
    : [];

  const countFor = (s, q) => RECS.filter((r) => r.strength === s && r.quality === q).length;

  return (
    <Stack gap={26}>
      <div>
        <SectionHeading label="Two labels, doing two different jobs" color={C} />
        <Stack gap={14}>
          <Prose>
            Every recommendation in this document ends with a parenthesis such as{" "}
            <em>(strong recommendation, low-quality evidence)</em>. Those are two separate
            judgments made under the <strong>GRADE</strong> framework, and they answer different
            questions.
          </Prose>
          <Prose>
            <strong>Strength</strong> answers: how confident is the panel that following this will do
            more good than harm? A <em>strong</em> recommendation means the panel believes almost
            every well-informed patient and clinician would choose this course. A{" "}
            <em>conditional</em> recommendation means the benefits and downsides are close enough
            that reasonable people, or different institutions, will legitimately decide differently.
          </Prose>
          <Prose>
            <strong>Evidence quality</strong> answers something narrower: how certain are we about
            the size of the effect itself? It is graded high, moderate, low or very low based on how
            directly the available trials speak to this population and this question.
          </Prose>
          <Analogy>
            Strength is the verdict; evidence quality is the strength of the case file. A jury can
            convict beyond reasonable doubt on strong circumstantial evidence, and can also acquit
            despite a thick file of weak documents. Reading only the verdict and ignoring the file
            tells you what was decided but not how much room you have to decide otherwise in your own
            hospital.
          </Analogy>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 1 — CLICK ANY CELL TO SEE WHAT LIVES THERE</SubHeading>
        <Prose style={{ marginBottom: 14 }}>
          All 24 recommendations, sorted by strength against evidence quality. Darker cells hold more
          recommendations. Click one to read them.
        </Prose>

        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 520 }}>
            <div style={{ display: "grid", gridTemplateColumns: "110px repeat(4, 1fr)", gap: 6, marginBottom: 6 }}>
              <div />
              {QUALITIES.map((q) => (
                <div key={q} style={{
                  fontFamily: mono, fontSize: 10, letterSpacing: 0.6, textAlign: "center",
                  color: QUALITY_COLOR[q], textTransform: "uppercase", paddingBottom: 4,
                }}>
                  {q}
                </div>
              ))}
            </div>
            {STRENGTHS.map((s) => (
              <div key={s} style={{ display: "grid", gridTemplateColumns: "110px repeat(4, 1fr)", gap: 6, marginBottom: 6 }}>
                <div style={{
                  fontFamily: mono, fontSize: 10.5, letterSpacing: 0.6, color: T.ink,
                  display: "flex", alignItems: "center", textTransform: "uppercase",
                }}>
                  {s}
                </div>
                {QUALITIES.map((q) => {
                  const n = countFor(s, q);
                  const on = cell && cell[0] === s && cell[1] === q;
                  const intensity = n === 0 ? 0 : Math.min(1, 0.18 + n * 0.11);
                  return (
                    <button
                      key={q}
                      onClick={() => setCell(on ? null : [s, q])}
                      disabled={n === 0}
                      style={{
                        background: n === 0 ? T.faint : `rgba(13,148,136,${intensity})`,
                        border: `2px solid ${on ? C : "transparent"}`,
                        borderRadius: 10, padding: "18px 8px", textAlign: "center",
                        cursor: n === 0 ? "default" : "pointer", transition: "all 0.2s",
                        opacity: n === 0 ? 0.5 : 1,
                      }}
                    >
                      <div style={{
                        fontFamily: serif, fontSize: 22, fontWeight: 600,
                        color: n === 0 ? T.muted : intensity > 0.5 ? "#fff" : T.ink,
                      }}>
                        {n}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          {cell ? (
            <div className="fade-in" key={cell.join("-")}>
              <div style={{
                background: T.tealL, border: `1px solid ${C}35`, borderRadius: 12,
                padding: "14px 18px", marginBottom: 12,
              }}>
                <div style={{ fontFamily: serif, fontSize: 16, color: T.ink, fontWeight: 600, marginBottom: 6 }}>
                  {matches.length} {cell[0]} recommendation{matches.length === 1 ? "" : "s"} resting on{" "}
                  {cell[1]}-quality evidence
                </div>
                <Prose style={{ fontSize: 13 }}>{QUALITY_MEANING[cell[1]]}</Prose>
              </div>
              <Stack gap={8}>
                {matches.map((r) => <RecCard key={r.id} rec={r} color={C} compact />)}
              </Stack>
            </div>
          ) : (
            <div style={{
              background: T.cream, border: `1.5px dashed ${T.border}`, borderRadius: 14,
              padding: 30, textAlign: "center",
            }}>
              <div style={{ fontSize: 34, marginBottom: 8 }}>👆</div>
              <Prose style={{ fontSize: 13 }}>Click any cell in the grid to read its recommendations</Prose>
            </div>
          )}
        </div>
      </div>

      <div>
        <SubHeading color={C}>WHAT THE GRID REVEALS</SubHeading>
        <Stack gap={14}>
          <Prose>
            Two things stand out once the recommendations are sorted this way. First, the largest
            single group — seven recommendations — is <strong>strong advice built on low-quality
            evidence</strong>, and one more rests on very-low-quality evidence. GRADE permits this,
            but only in specific circumstances: when the downside of the alternative is severe, when
            the evidence is indirect but consistent, or when the recommendation is essentially about
            avoiding harm.
          </Prose>
          <Prose>
            Take A2, taking blood cultures from every lumen of a central line. No trial has randomized
            this, and none ever will. But the alternative — treating a child for a bloodstream
            infection you never identified — is bad enough that the panel is comfortable being firm on
            thin data. The same logic explains A5, the strong recommendation <em>against</em> routine
            chest radiography: pneumonia without respiratory signs is rare enough that the radiation,
            cost and false positives lose on balance.
          </Prose>
          <Prose>
            Second, notice what is missing: the conditional/high-quality cell is empty. Where the
            evidence is strongest, the panel was decisive. Uncertainty in the data and hedging in the
            language track each other closely, which is a sign the framework was applied honestly.
          </Prose>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>THE THIRD CATEGORY — GOOD PRACTICE STATEMENTS</SubHeading>
        <Stack gap={12}>
          <Prose>
            The 2023 update introduces one statement that carries no evidence grade at all. GRADE
            reserves these for situations where formal evidence review would be a waste of effort
            because the answer is not genuinely in question. The test the panel applies is deliberately
            crude: <em>would the alternative action be absurd, or clearly fail to conform to ethical
            norms?</em>
          </Prose>
          <div style={{
            background: T.orangeL, border: `1px solid ${T.orange}35`,
            borderLeft: `4px solid ${T.orange}`, borderRadius: "0 12px 12px 0", padding: "16px 20px",
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <Badge color={T.orange} bg={T.white}>GPS 1</Badge>
              <span style={{ fontFamily: mono, fontSize: 10, color: T.orange, letterSpacing: 1 }}>
                NO EVIDENCE GRADE
              </span>
            </div>
            <Prose style={{ fontSize: 13.5 }}>
              For febrile patients who are clinically unstable, initiate guideline-consistent empiric
              antibacterial therapy as soon as possible. Antibiotics should be given while other
              stabilization measures proceed, and ideally much sooner than one hour after
              presentation.
            </Prose>
          </div>
          <Prose>
            The alternative here would be to randomize unstable, potentially septic children to delayed
            antibiotics. That is the absurdity test in action. It is also a reminder that the absence of
            a grade is not the absence of importance — this statement is probably the highest-stakes
            sentence in the document.
          </Prose>
        </Stack>
      </div>

      <Callout icon="🔑" color={C} bg={T.tealL}>
        <strong>Key insight.</strong> Strong plus low-quality is the guideline's most common
        combination, and it is not a contradiction — it is the panel saying "we are confident about
        what to do, and much less confident about how much it helps." Those recommendations are the
        ones most likely to change if someone runs the trial. Conditional recommendations, by
        contrast, are explicit invitations to adapt to your own setting: your resistance patterns,
        your ambulatory infrastructure, your laboratory turnaround.
      </Callout>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 3 — THE FIRST HOURS (SECTION A)
   ════════════════════════════════════════════════════════════ */

function Toggle({ label, options, value, onChange, color }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: sans }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1, background: value === o.value ? color : T.white,
              border: `1.5px solid ${value === o.value ? color : T.border}`,
              color: value === o.value ? "#fff" : T.inkLight,
              borderRadius: 9, padding: "8px 10px", fontSize: 12.5,
              fontWeight: value === o.value ? 600 : 400, transition: "all 0.18s",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function buildPlan(s) {
  const plan = [];

  if (!s.stable) {
    plan.push({
      tone: "urgent", rec: "GPS 1",
      title: "Give antibiotics now — do not wait for anything",
      body:
        "This patient is clinically unstable. Guideline-consistent empiric antibacterial therapy starts immediately, in parallel with resuscitation, and ideally well inside the first hour. Cultures should not delay the first dose.",
    });
  }

  plan.push({
    tone: "do", rec: "A1",
    title: `Apply a validated risk stratification rule — this patient is ${s.risk}-risk`,
    body:
      s.risk === "high"
        ? "High-risk classification drives everything downstream: intravenous monotherapy, inpatient management, and eligibility for the antifungal pathway if fever persists to 96 hours. Use a rule validated in children, not clinical impression alone."
        : "Low-risk classification opens the door to shorter therapy, oral administration and outpatient management — but only through a validated rule. The panel is strong on this point despite low-quality evidence, because the downside of misclassifying a high-risk child is severe.",
  });

  if (s.cvc) {
    plan.push({
      tone: "do", rec: "A2",
      title: "Blood cultures from every lumen of the central line",
      body:
        "All lumens, not just the one that draws easily. A lumen-specific infection can be missed entirely if only one is sampled.",
    });
    plan.push({
      tone: "consider", rec: "A3",
      title: "Consider a concurrent peripheral blood culture",
      body:
        "Peripheral cultures pick up roughly 12% of true bacteremias that central line cultures miss (95% CI, 8 to 17). This stays conditional because it is unclear how often that extra 12% changes what you actually do, and peripheral draws cost the child pain and add skin-contaminant false positives.",
    });
  } else {
    plan.push({
      tone: "do", rec: "A2",
      title: "Obtain peripheral blood cultures",
      body:
        "With no central catheter, peripheral cultures are the only blood sampling available. The guideline's culture recommendations are written around catheter lumens because most of these children have one.",
    });
  }

  plan.push({
    tone: s.urine ? "consider" : "dont", rec: "A4",
    title: s.urine
      ? "Consider urinalysis and urine culture"
      : "Do not delay antibiotics to obtain urine",
    body: s.urine
      ? "Urinary tract infection in these children is frequently asymptomatic, so a clean-catch mid-stream sample is worth sending when it is readily available. It remains conditional because empiric regimens usually cover the organism anyway."
      : "A clean-catch mid-stream specimen is not readily available here. Catheterizing or waiting for a sample is not worth the delay to first-dose antibiotics.",
  });

  plan.push({
    tone: s.resp ? "do" : "dont", rec: "A5",
    title: s.resp ? "Obtain a chest radiograph" : "Do not obtain a chest radiograph",
    body: s.resp
      ? "Respiratory signs or symptoms are present, which is the entire indication. Imaging here is targeted, not screening."
      : "This is a strong recommendation against routine imaging. Pulmonary infection without respiratory signs or symptoms is very rare, and omitting the film was not associated with missed pneumonia in the systematic review.",
  });

  if (s.risk === "high") {
    plan.push({
      tone: "do", rec: "A6a",
      title: "Start a single broad-spectrum agent",
      body:
        "One drug: an antipseudomonal β-lactam, a fourth-generation cephalosporin, or a carbapenem. This is the guideline's only strong recommendation backed by high-quality evidence. The choice among the three is yours, based on local susceptibility, cost and availability — with carbapenems reserved where possible for clinically unstable patients, to protect them from resistance pressure.",
    });
  } else {
    plan.push({
      tone: "do", rec: "A6a",
      title: "Start empiric antibacterial therapy",
      body:
        "The monotherapy evidence was generated in high-risk populations, but the principle of a single broad-spectrum agent carries across. Route and setting are the decisions that differ for low-risk patients — see below.",
    });
  }

  if (!s.stable || s.resistant) {
    plan.push({
      tone: "do", rec: "A6b",
      title: "Add a second agent — this is one of the exceptions",
      body: !s.stable
        ? "Clinical instability is an explicit trigger for adding a second anti-Gram-negative agent or a glycopeptide. Broaden now; you can narrow within 24 to 72 hours if nothing grows."
        : "A suspected or known resistant organism, or a center with a high rate of resistant pathogens, is an explicit trigger for a second agent. This is where local epidemiology overrides the default.",
    });
  } else {
    plan.push({
      tone: "dont", rec: "A6b",
      title: "Do not add a second agent",
      body:
        "No instability, no suspected resistance. Adding an aminoglycoside or a glycopeptide here buys toxicity and resistance without measurable benefit — the pooled trial data on this is on the next tab.",
    });
  }

  if (s.risk === "low") {
    plan.push({
      tone: "consider", rec: "A7a",
      title: s.ambulatory
        ? "Consider outpatient or step-down management"
        : "Keep this patient in hospital",
      body: s.ambulatory
        ? "With an established ambulatory program, careful monitoring and reliable follow-up, outpatient management saved 3.85 days of hospitalization in the pooled trials with no signal of worse outcomes. Social criteria matter as much as clinical ones: demonstrated adherence, a reliable way to contact the team, and the ability to return quickly if the child deteriorates."
        : "Without established ambulatory infrastructure — defined monitoring frequency, reachable clinical team, guaranteed rapid return — outpatient management is not what this recommendation endorses. The trials were done inside programs built for it.",
    });
    plan.push({
      tone: "consider", rec: "A7b",
      title: s.oralOK ? "Consider oral antibacterial therapy" : "Use intravenous therapy",
      body: s.oralOK
        ? "The child tolerates oral medication reliably. Confirm the family can actually obtain the drug from the pharmacy or health plan without delay — the guideline flags supply as a real failure point. If there is any doubt about adherence or access, use intravenous therapy."
        : "Reliable oral tolerance is the precondition. Without it, the readmission signal seen in oral-treated outpatients becomes a genuine risk rather than a theoretical one.",
    });
  }

  return plan;
}

const TONE_STYLE = {
  urgent: { color: T.red, bg: T.redL, mark: "!" },
  do: { color: T.green, bg: T.greenL, mark: "✓" },
  consider: { color: T.orange, bg: T.orangeL, mark: "?" },
  dont: { color: T.muted, bg: T.faint, mark: "✕" },
};

function TabInitial() {
  const C = T.orange;
  const [s, setS] = useState({
    risk: "high", stable: true, cvc: true, resp: false,
    urine: false, resistant: false, oralOK: true, ambulatory: true,
  });
  const set = (k) => (v) => setS((prev) => ({ ...prev, [k]: v }));
  const plan = buildPlan(s);

  return (
    <Stack gap={26}>
      <div>
        <SectionHeading label="Everything that happens before the first dose" color={C} />
        <Stack gap={14}>
          <Prose>
            Section A is organized as three questions asked in sequence. <strong>How sick is this
            child likely to get?</strong> — risk stratification. <strong>What should I actually
            send?</strong> — evaluation. <strong>What do I start?</strong> — treatment. The order
            matters, because the risk answer determines what counts as a reasonable answer to the
            other two.
          </Prose>
          <Prose>
            What is striking about the evaluation recommendations is how much of Section A is about
            <em> not</em> doing things. Do not routinely image the chest. Do not delay antibiotics
            for a urine sample. Do not add a second antibiotic. Each of those restraints is a
            recommendation in its own right, and each exists because the reflexive alternative — test
            everything, cover everything — was studied and found to cost more than it returned.
          </Prose>
          <Analogy>
            Consider what a good emergency triage nurse does versus what an anxious one does. The
            anxious one orders every test that might conceivably be relevant, which delays the
            treatment that actually matters and generates findings nobody knows how to act on. The
            good one knows that a test is only worth ordering if a plausible result would change
            what happens next. Section A is that discipline written down.
          </Analogy>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 1 — DESCRIBE THE PATIENT IN FRONT OF YOU</SubHeading>
        <Prose style={{ marginBottom: 14 }}>
          Set the eight characteristics below. The plan underneath rebuilds itself from the
          guideline's own recommendations, and tells you which recommendation each step comes from.
        </Prose>
        <Card style={{ background: T.cream }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Toggle
              label="Risk stratification result" color={C} value={s.risk} onChange={set("risk")}
              options={[{ label: "High-risk", value: "high" }, { label: "Low-risk", value: "low" }]}
            />
            <Toggle
              label="Clinical status" color={C} value={s.stable} onChange={set("stable")}
              options={[{ label: "Stable", value: true }, { label: "Unstable", value: false }]}
            />
            <Toggle
              label="Central venous catheter" color={C} value={s.cvc} onChange={set("cvc")}
              options={[{ label: "Present", value: true }, { label: "None", value: false }]}
            />
            <Toggle
              label="Respiratory signs or symptoms" color={C} value={s.resp} onChange={set("resp")}
              options={[{ label: "Present", value: true }, { label: "Absent", value: false }]}
            />
            <Toggle
              label="Clean-catch urine readily available" color={C} value={s.urine} onChange={set("urine")}
              options={[{ label: "Yes", value: true }, { label: "No", value: false }]}
            />
            <Toggle
              label="Resistant organism suspected, or high-resistance center" color={C}
              value={s.resistant} onChange={set("resistant")}
              options={[{ label: "Yes", value: true }, { label: "No", value: false }]}
            />
            <Toggle
              label="Established ambulatory FN program" color={C} value={s.ambulatory} onChange={set("ambulatory")}
              options={[{ label: "Yes", value: true }, { label: "No", value: false }]}
            />
            <Toggle
              label="Tolerates oral medication reliably" color={C} value={s.oralOK} onChange={set("oralOK")}
              options={[{ label: "Yes", value: true }, { label: "No", value: false }]}
            />
          </div>
        </Card>
      </div>

      <div>
        <SubHeading color={C}>STEP 2 — READ THE RESULTING PLAN</SubHeading>
        <Stack gap={8}>
          {plan.map((p, i) => {
            const st = TONE_STYLE[p.tone];
            return (
              <div key={`${p.rec}-${i}`} className="fade-in" style={{
                background: st.bg, border: `1px solid ${st.color}30`,
                borderRadius: 11, padding: "13px 16px", display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 7, background: st.color, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: mono, fontSize: 12, flexShrink: 0, marginTop: 2,
                }}>
                  {st.mark}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, fontFamily: sans }}>
                      {p.title}
                    </span>
                    <Badge color={st.color} bg={T.white}>{p.rec}</Badge>
                  </div>
                  <Prose style={{ fontSize: 12.5 }}>{p.body}</Prose>
                </div>
              </div>
            );
          })}
        </Stack>
        <Prose style={{ fontSize: 12.5, marginTop: 12, color: T.muted }}>
          What you just saw: toggling instability moves antibiotics to the top of the plan and adds a
          second agent; toggling risk group swaps the entire back half between an inpatient
          intravenous course and an outpatient oral one. Two variables carry most of the decision
          weight in Section A.
        </Prose>
      </div>

      <div>
        <SubHeading color={C}>WHY MONOTHERAPY WON</SubHeading>
        <Stack gap={12}>
          <Prose>
            The instinct to combine an aminoglycoside with a β-lactam has an appealing rationale:
            two mechanisms, broader Gram-negative coverage, possible synergy. Twelve randomized
            trials have now tested it in children, and none of the outcomes that matter moved.
            Treatment failure, infection-related mortality, overall mortality, days of fever, days of
            therapy — every pooled confidence interval crossed the line of no difference.
          </Prose>
          <Prose>
            What did not stay equal was harm. Aminoglycosides carry nephrotoxicity and ototoxicity in
            children who will receive many more nephrotoxic and ototoxic drugs over the course of
            treatment, and combination therapy applies broader selection pressure for resistance.
            When benefit is undetectable and harm is certain, the decision makes itself. That is why
            A6b is written as a list of exceptions rather than a general permission.
          </Prose>
          <Stack gap={8}>
            {["A6a", "A6b"].map((id) => <RecCard key={id} rec={byId(id)} color={C} />)}
          </Stack>
        </Stack>
      </div>

      <Callout icon="🔑" color={C} bg={T.orangeL}>
        <strong>Key insight.</strong> Section A's real content is a set of defaults with named
        exceptions: one antibiotic unless unstable or resistance is suspected; no chest film unless
        the chest is symptomatic; no delay for urine. The recommendations are strong precisely where
        the exceptions are clearly specified — which means the safety of the whole section depends on
        whether your risk stratification rule actually works in your population.
      </Callout>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 4 — WHAT THE TRIALS SHOWED (TABLE 3 AS A FOREST PLOT)
   ════════════════════════════════════════════════════════════ */

const RR_MIN = 0.2, RR_MAX = 15;
const MD_MIN = -2, MD_MAX = 5;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const rrX = (v) => clamp01((Math.log(v) - Math.log(RR_MIN)) / (Math.log(RR_MAX) - Math.log(RR_MIN)));
const mdX = (v) => clamp01((v - MD_MIN) / (MD_MAX - MD_MIN));

const COMPARISONS = [
  {
    id: "combo",
    label: "Combination vs monotherapy",
    full: "Aminoglycoside-containing combination therapy versus single-agent therapy",
    left: "Combination better", right: "Monotherapy better",
    rows: [
      { o: "Treatment failure (regimen change counted as failure)", k: 11, n: 836, type: "RR", est: 1.13, lo: 0.93, hi: 1.38, i2: 18, p: ".200", revised: true },
      { o: "Treatment failure (regimen change not counted)", k: 5, n: 453, type: "RR", est: 1.14, lo: 0.75, hi: 1.72, i2: 0, p: ".550", revised: true },
      { o: "Infection-related mortality", k: 9, n: 806, type: "RR", est: 2.06, lo: 0.65, hi: 6.53, i2: 0, p: ".220", revised: true },
      { o: "Overall mortality", k: 5, n: 551, type: "RR", est: 1.54, lo: 0.53, hi: 4.43, i2: 0, p: ".430", revised: true },
      { o: "Days of fever", k: 7, n: 592, type: "MD", est: -0.17, lo: -0.85, hi: 0.52, i2: 76, p: ".630", revised: true },
      { o: "Days of antibacterial therapy", k: 5, n: 339, type: "MD", est: 0.75, lo: -0.73, hi: 2.23, i2: 70, p: ".320", revised: true },
    ],
    verdict:
      "Three new trials brought this comparison to twelve. Nothing moved: every interval crosses no difference, including the two mortality outcomes. With no detectable benefit and well-documented aminoglycoside toxicity, the 2017 monotherapy recommendation was confirmed.",
  },
  {
    id: "penfgc",
    label: "Antipseudomonal penicillin vs cephalosporin",
    full: "Antipseudomonal penicillin monotherapy versus fourth-generation cephalosporin monotherapy",
    left: "Penicillin better", right: "Cephalosporin better",
    rows: [
      { o: "Treatment failure (regimen change counted as failure)", k: 4, n: 430, type: "RR", est: 0.95, lo: 0.75, hi: 1.21, i2: 0, p: ".700" },
      { o: "Infection-related mortality", k: 4, n: 509, type: "RR", est: 2.52, lo: 0.49, hi: 12.90, i2: 0, p: ".270" },
      { o: "Days of fever", k: 3, n: 296, type: "MD", est: -0.03, lo: -0.96, hi: 0.89, i2: 0, p: ".940" },
      { o: "Days of antibacterial therapy", k: 3, n: 382, type: "MD", est: 0.81, lo: 0.15, hi: 1.47, i2: 4, p: ".020" },
    ],
    verdict:
      "No new trials contributed here, so this synthesis is unchanged from 2017. It contains the only nominally significant treatment-comparison result in the entire table — 0.81 fewer days of antibacterial therapy — which the panel did not translate into a preference. That restraint is defensible: the difference is under a day, it sits among dozens of comparisons with no adjustment for multiplicity, and the mortality interval spanning 0.49 to 12.90 shows how little these trials can resolve.",
  },
  {
    id: "carbapen",
    label: "Carbapenem vs antipseudomonal penicillin",
    full: "Carbapenem monotherapy versus antipseudomonal penicillin monotherapy",
    left: "Carbapenem better", right: "Penicillin better",
    rows: [
      { o: "Treatment failure (regimen change counted as failure)", k: 3, n: 926, type: "RR", est: 1.12, lo: 0.84, hi: 1.50, i2: 49, p: ".440", revised: true },
      { o: "Days of antibacterial therapy", k: 3, n: 926, type: "MD", est: 0.00, lo: -0.37, hi: 0.37, i2: 0, p: "1.000", revised: true },
    ],
    verdict:
      "Two new trials made this synthesis possible for the first time at scale — 926 episodes. The mean difference in days of therapy is exactly zero. Because the three monotherapy options perform identically, the guideline hands the choice to local factors, with one stewardship caveat: reserve carbapenems for clinically unstable patients where possible.",
  },
  {
    id: "setting",
    label: "Inpatient vs outpatient",
    full: "Inpatient versus outpatient management of low-risk fever and neutropenia",
    left: "Inpatient better", right: "Outpatient better",
    rows: [
      { o: "Treatment failure (regimen change counted as failure)", k: 3, n: 327, type: "RR", est: 1.60, lo: 0.71, hi: 3.60, i2: 0, p: ".260", revised: true },
      { o: "Infection-related mortality", k: 5, n: 483, type: "RR", est: 1.60, lo: 0.37, hi: 6.88, i2: 0, p: ".530", revised: true },
      { o: "Overall mortality", k: 4, n: 456, type: "RR", est: 1.18, lo: 0.30, hi: 4.72, i2: 0, p: ".810", revised: true },
      { o: "Days of fever", k: 3, n: 228, type: "MD", est: -0.02, lo: -0.81, hi: 0.78, i2: 45, p: ".970" },
      { o: "Days of antibacterial therapy", k: 5, n: 494, type: "MD", est: 0.25, lo: -0.11, hi: 0.62, i2: 20, p: ".180", revised: true },
      { o: "Days of hospitalization", k: 3, n: 340, type: "MD", est: 3.85, lo: 3.01, hi: 4.69, i2: 63, p: "< .001" },
    ],
    verdict:
      "This is the shape you want when arguing for a service change: no difference in any clinical outcome, and a large, unambiguous difference in the burden the family carries — 3.85 fewer hospital days. The recommendation stayed conditional not because of the effect but because of its precondition: the trials were run inside established ambulatory programs with defined monitoring and rapid return pathways.",
  },
  {
    id: "route",
    label: "Intravenous vs oral",
    full: "Intravenous versus oral empiric antibacterial therapy",
    left: "Intravenous better", right: "Oral better",
    rows: [
      { o: "Treatment failure (regimen change counted as failure)", k: 4, n: 526, type: "RR", est: 0.95, lo: 0.72, hi: 1.24, i2: 0, p: ".700" },
      { o: "Treatment failure (regimen change not counted)", k: 5, n: 613, type: "RR", est: 0.65, lo: 0.28, hi: 1.52, i2: 0, p: ".320" },
      { o: "Infection-related mortality", k: 7, n: 932, type: "none" },
      { o: "Overall mortality", k: 6, n: 816, type: "none" },
      { o: "Intensive care unit admission", k: 4, n: 462, type: "none" },
      { o: "Readmission", k: 5, n: 578, type: "RR", est: 0.50, lo: 0.23, hi: 1.08, i2: 0, p: ".080" },
      { o: "Days of fever", k: 6, n: 758, type: "MD", est: 0.14, lo: -0.27, hi: 0.56, i2: 75, p: ".500", flag: "Printed in the source table as a risk ratio, but the negative lower bound identifies it as a mean difference." },
    ],
    verdict:
      "Across 932 episodes there were no infection-related deaths, no overall deaths and no intensive care admissions in either arm — a reminder of how carefully selected low-risk populations are. The readmission estimate is the reason this recommendation is conditional rather than strong, though at P = .080 it is a trend rather than a demonstrated harm; the guideline text describes it more firmly than the interval supports.",
  },
];

function ForestRow({ r, color }) {
  const isRR = r.type !== "MD";
  const x = isRR ? rrX : mdX;
  const nullV = isRR ? 1 : 0;
  const sig = r.type !== "none" && (isRR ? (r.lo > 1 || r.hi < 1) : (r.lo > 0 || r.hi < 0));

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "2fr 0.8fr 1.3fr 2.6fr",
      gap: 10, alignItems: "center", padding: "9px 0",
      borderTop: `1px solid ${T.border}`,
    }}>
      <div style={{ fontSize: 12, color: T.ink, fontFamily: sans, lineHeight: 1.4 }}>
        {r.o}
        {r.revised && (
          <span style={{ fontFamily: mono, fontSize: 8.5, color: color, marginLeft: 6, verticalAlign: "middle" }}>
            NEW DATA
          </span>
        )}
      </div>
      <div style={{ fontFamily: mono, fontSize: 10.5, color: T.muted }}>
        {r.k} trials<br />{r.n} episodes
      </div>
      <div style={{ fontFamily: mono, fontSize: 11, color: sig ? color : T.inkLight }}>
        {r.type === "none" ? (
          <span style={{ color: T.muted }}>no events</span>
        ) : (
          <>
            {r.type} {r.est.toFixed(2)}
            <div style={{ fontSize: 9.5, color: T.muted }}>
              {r.lo.toFixed(2)} to {r.hi.toFixed(2)} · P {r.p}
            </div>
          </>
        )}
      </div>
      <div style={{ position: "relative", height: 26 }}>
        {/* track */}
        <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 1, background: T.border }} />
        {/* null line */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: `${x(nullV) * 100}%`,
          width: 1, background: T.borderDk,
        }} />
        {r.type === "none" ? (
          <div style={{
            position: "absolute", top: 4, left: 0, fontFamily: mono, fontSize: 10, color: T.muted,
          }}>
            zero events in both arms — nothing to estimate
          </div>
        ) : (
          <>
            {/* CI bar */}
            <div style={{
              position: "absolute", top: 10.5,
              left: `${x(r.lo) * 100}%`,
              width: `${Math.max(0.5, (x(r.hi) - x(r.lo)) * 100)}%`,
              height: 4, borderRadius: 2,
              background: sig ? `${color}` : `${color}45`,
            }} />
            {/* point estimate */}
            <div style={{
              position: "absolute", top: 6.5,
              left: `calc(${x(r.est) * 100}% - 6px)`,
              width: 12, height: 12, borderRadius: 3,
              background: sig ? color : T.white,
              border: `2px solid ${color}`,
              transform: "rotate(45deg)",
            }} />
          </>
        )}
      </div>
    </div>
  );
}

function AxisRow({ type, color }) {
  const ticks = type === "RR" ? [0.25, 0.5, 1, 2, 5, 10] : [-2, -1, 0, 1, 2, 3, 4, 5];
  const x = type === "RR" ? rrX : mdX;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 0.8fr 1.3fr 2.6fr", gap: 10, marginTop: 4 }}>
      <div style={{ gridColumn: "1 / 4", fontFamily: mono, fontSize: 9.5, color, letterSpacing: 1 }}>
        {type === "RR" ? "RISK RATIO (LOG SCALE)" : "MEAN DIFFERENCE, DAYS"}
      </div>
      <div style={{ position: "relative", height: 18 }}>
        {ticks.map((t) => (
          <span key={t} style={{
            position: "absolute", left: `${x(t) * 100}%`, transform: "translateX(-50%)",
            fontFamily: mono, fontSize: 9, color: T.muted,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function TabEvidence() {
  const C = T.purple;
  const [sel, setSel] = useState(COMPARISONS[0].id);
  const cmp = COMPARISONS.find((c) => c.id === sel);
  const rrRows = cmp.rows.filter((r) => r.type === "RR" || r.type === "none");
  const mdRows = cmp.rows.filter((r) => r.type === "MD");

  return (
    <Stack gap={26}>
      <div>
        <SectionHeading label="Reading a table where almost nothing is significant" color={C} />
        <Stack gap={14}>
          <Prose>
            The panel's synthesis rule was strict: pool results only when at least three trials
            reported the same outcome, and when a trial had three or more arms, use only the arms
            that match guideline-consistent therapy. That produced five comparisons across 39
            interventions. Read quickly, the resulting table looks like a wall of null results.
          </Prose>
          <Prose>
            Read properly, it is the argument. When two strategies produce the same clinical outcomes,
            the tiebreaker becomes everything the trials did not randomize: toxicity, resistance
            pressure, cost, days away from home, and how much the family has to endure. A null result
            does not mean the choice does not matter. It means the choice should be made on grounds
            other than efficacy.
          </Prose>
          <Analogy>
            Two routes to the same destination take the same time in every trial you run. That does
            not make the routes equivalent — it makes the timing irrelevant to the decision, so you
            choose on fuel, tolls and how much you hate the traffic. Every recommendation on this tab
            was decided on the equivalent of fuel and tolls.
          </Analogy>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 1 — CHOOSE A COMPARISON</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8, marginBottom: 18 }}>
          {COMPARISONS.map((c) => (
            <button
              key={c.id} onClick={() => setSel(c.id)} className="hover-lift"
              style={{
                background: sel === c.id ? T.purpleL : T.white,
                border: `2px solid ${sel === c.id ? C : T.border}`,
                borderRadius: 11, padding: "11px 13px", textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                fontSize: 12.5, fontWeight: sel === c.id ? 600 : 400,
                color: sel === c.id ? C : T.inkLight, fontFamily: sans, lineHeight: 1.4,
              }}>
                {c.label}
              </div>
            </button>
          ))}
        </div>

        <SubHeading color={C}>STEP 2 — READ THE POOLED ESTIMATES</SubHeading>
        <Prose style={{ marginBottom: 12 }}>
          Each diamond is the pooled point estimate; the bar is its 95% confidence interval. The
          vertical grey line is "no difference". A bar that touches that line means the trials could
          not distinguish the two strategies. Filled diamonds mark intervals that exclude no
          difference.
        </Prose>

        <div className="fade-in" key={sel} style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 620 }}>
            <div style={{
              background: T.purpleL, border: `1px solid ${C}30`, borderRadius: 12,
              padding: "12px 16px", marginBottom: 6,
            }}>
              <div style={{ fontFamily: serif, fontSize: 15, color: T.ink, fontWeight: 600 }}>{cmp.full}</div>
            </div>

            {rrRows.length > 0 && (
              <>
                <AxisRow type="RR" color={C} />
                {rrRows.map((r) => <ForestRow key={r.o} r={r} color={C} />)}
              </>
            )}
            {mdRows.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <AxisRow type="MD" color={C} />
                {mdRows.map((r) => <ForestRow key={r.o} r={r} color={C} />)}
              </div>
            )}

            {/* Direction legend */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 0.8fr 1.3fr 2.6fr", gap: 10,
              marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`,
            }}>
              <div style={{ gridColumn: "1 / 4", fontFamily: mono, fontSize: 9.5, color: T.muted, letterSpacing: 1 }}>
                DIRECTION OF EFFECT
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9.5, color: T.muted }}>
                <span>← {cmp.left}</span>
                <span>{cmp.right} →</span>
              </div>
            </div>
          </div>
        </div>

        {cmp.rows.some((r) => r.flag) && (
          <div style={{ marginTop: 14 }}>
            <Callout icon="🔍" color={T.yellow} bg={T.yellowL}>
              <strong>Reading the source carefully.</strong>{" "}
              {cmp.rows.find((r) => r.flag).flag} Small inconsistencies like this are worth catching
              before quoting a guideline table in your own protocol.
            </Callout>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <Callout icon="📌" color={C} bg={T.purpleL}>
            <strong>What you just saw.</strong> {cmp.verdict}
          </Callout>
        </div>
      </div>

      <div>
        <SubHeading color={C}>THE HETEROGENEITY YOU SHOULD NOT IGNORE</SubHeading>
        <Stack gap={12}>
          <Prose>
            Beside several estimates sits an I² value — the share of variation between trials that
            comes from genuine differences rather than chance. Values above 50% mean the trials are
            measuring meaningfully different things, and a pooled average across them describes no
            real patient.
          </Prose>
          <Prose>
            Days of fever in the combination comparison carries I² of 76%. Days of therapy carries
            70%. Days of hospitalization in the outpatient comparison carries 63%. These are exactly
            the outcomes most sensitive to local practice — when your unit decides a child is afebrile
            and when it decides a child can go home are institutional habits, not biology. The
            binary outcomes, where definitions travel better, are consistently homogeneous.
          </Prose>
          <Callout icon="⚠️" color={T.red} bg={T.redL}>
            <strong>A limitation the panel names but the table cannot fix.</strong> Seven in ten of
            the 79 trials studied populations of unclear or mixed risk. So the evidence separating
            high-risk from low-risk management — the axis the entire guideline turns on — is largely
            indirect. Only ten of the trials blinded participants or personnel, which matters most for
            subjective endpoints such as when to change a regimen.
          </Callout>
        </Stack>
      </div>

      <Callout icon="🔑" color={C} bg={T.purpleL}>
        <strong>Key insight.</strong> Across five comparisons and thousands of episodes, the pooled
        data supports one consistent conclusion: simpler is not worse. One antibiotic rather than
        two, oral rather than intravenous, home rather than hospital, shorter rather than longer —
        none of these were shown to cost anything measurable. The guideline's recommendations are
        best understood as permission to de-escalate, granted by a decade of trials that failed to
        find a penalty for doing so.
      </Callout>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 5 — STOPPING ANTIBIOTICS (SECTION B)
   ════════════════════════════════════════════════════════════ */

const PHASES = [
  {
    from: 0, to: 23, key: "Hours 0–24",
    title: "Empiric therapy is running",
    body:
      "The regimen chosen at presentation stays as it is. If the child was started on double Gram-negative cover or a glycopeptide because they were unstable or resistance was suspected, that combination is still justified — for now. Cultures are incubating; nothing has been learned yet.",
    recs: [],
  },
  {
    from: 24, to: 47, key: "Hours 24–48",
    title: "Narrow what you can, and hold your nerve on the rest",
    body:
      "Two things become live. If the child is responding, any double Gram-negative cover or empiric glycopeptide comes off between 24 and 72 hours unless a culture justifies keeping it. And if fever persists in a child who is otherwise stable, the regimen does not get broadened — persistent fever alone is not evidence of inadequate coverage. Twenty-four hours afebrile and well is also the point at which the stopping clock can start.",
    recs: ["B1", "B2"],
  },
  {
    from: 48, to: 71, key: "Hours 48–72",
    title: "The decision point",
    body:
      "This is where the 2023 update lives. If blood cultures taken at presentation are still negative at 48 hours and the child has been well and afebrile for 24 hours, empiric antibacterial therapy can stop — definitively when there is marrow recovery, and as a considered option in low-risk patients even without it. The guideline is explicit that laboratory reality intrudes: a culture drawn overnight and reported only in daytime hours may not be readable until 72 hours or later.",
    recs: ["B4", "B5"],
  },
  {
    from: 72, to: 95, key: "Hours 72–96",
    title: "Where the old threshold used to sit",
    body:
      "Until 2023, 72 hours was the earliest the guideline endorsed stopping in low-risk patients without count recovery. Two new trials moved it to 48. If a child is still febrile at this point and remains stable, the answer is still not to broaden — but the fungal question is now approaching.",
    recs: ["B2"],
  },
  {
    from: 96, to: 96, key: "96 hours and beyond",
    title: "Prolonged fever and neutropenia",
    body:
      "Fever persisting to 96 hours despite broad-spectrum antibacterial therapy is the guideline's definition of prolonged FN, and it triggers Section C: invasive fungal disease risk stratification, targeted imaging, and a decision between empiric and pre-emptive antifungal therapy. That is the next tab.",
    recs: [],
  },
];

function stopDecision(s) {
  if (!s.well) {
    return {
      color: T.muted, bg: T.faint, headline: "Not yet — the stopping criteria have not been met",
      body: "Every stopping recommendation requires the child to be clinically well and afebrile for at least 24 hours. Until that is true, continue therapy. If fever persists while the child remains stable, do not broaden the regimen on the strength of fever alone (B2). If the child becomes unstable, escalate to cover resistant Gram-negative, Gram-positive and anaerobic organisms (B3).",
      recs: ["B2", "B3"],
    };
  }
  if (!s.cultures) {
    return {
      color: T.red, bg: T.redL, headline: "Do not stop — blood cultures are positive",
      body: "The 48-hour rule applies only to cultures that remain negative. A positive culture converts this from empiric therapy to directed therapy, and duration is then governed by the organism and source rather than by these recommendations. The panel lists the safety of narrowing to targeted therapy alone in this situation as an open question.",
      recs: [],
    };
  }
  if (s.recovery) {
    return {
      color: T.green, bg: T.greenL, headline: "Stop empiric antibacterial therapy",
      body: "Well and afebrile for at least 24 hours, blood cultures negative at 48 hours, and evidence of marrow recovery. This applies to high-risk and low-risk patients alike, and it is a strong recommendation. The systematic review behind it described a very low risk of recurrent fever with this approach.",
      recs: ["B4"],
    };
  }
  if (s.risk === "low") {
    return {
      color: T.teal, bg: T.tealL, headline: "Consider stopping — this is the 2023 change",
      body: "Low-risk, well and afebrile for 24 hours, cultures negative at 48 hours, but no evidence of marrow recovery. The threshold for considering discontinuation moved from 72 hours to 48 on the strength of two new trials. It remains conditional: the panel is endorsing an option, not mandating it, and the definition of marrow recovery itself remains, in the panel's own word, elusive.",
      recs: ["B5"],
    };
  }
  return {
    color: T.orange, bg: T.orangeL, headline: "The guideline deliberately does not answer this",
    body: "High-risk, no marrow recovery. One of the new trials did include high-risk patients with documented respiratory viral infection and found no difference in uneventful resolution when antibiotics were stopped at 48 hours — but the panel declined to generalize. Two reasons: such a recommendation would push clinicians toward respiratory virus testing in asymptomatic children, and a positive viral test can persist long after the acute illness has resolved. Two children in the continuation arm developed Klebsiella pneumoniae bacteremia, one with sepsis, which sharpened the caution. This sits on the published list of knowledge gaps.",
    recs: [],
  };
}

function TabOngoing() {
  const C = T.green;
  const [hour, setHour] = useState(48);
  const [s, setS] = useState({ risk: "low", well: true, cultures: true, recovery: false });
  const set = (k) => (v) => setS((p) => ({ ...p, [k]: v }));
  const phase = PHASES.find((p) => hour >= p.from && hour <= p.to) || PHASES[PHASES.length - 1];
  const d = stopDecision(s);

  return (
    <Stack gap={26}>
      <div>
        <SectionHeading label="The hardest question in the guideline is when to stop" color={C} />
        <Stack gap={14}>
          <Prose>
            Starting antibiotics in a febrile neutropenic child is easy — the reasoning is obvious and
            the downside of delay is death. Stopping is the opposite: the reasoning is statistical,
            the downside is a rare but catastrophic relapse of infection, and nobody thanks you for
            the ninety-nine children you spared unnecessary days of therapy. Section B is the
            guideline's attempt to make stopping a defined act rather than an act of courage.
          </Prose>
          <Prose>
            The organizing principle is that <strong>fever alone carries almost no information after
            the first day</strong>. A stable child who keeps spiking is not telling you the
            antibiotic is wrong. Neutropenic fever has many non-bacterial causes, and broadening the
            regimen in response to the thermometer generates resistance and toxicity without evidence
            of benefit. What carries information is clinical trajectory and culture results.
          </Prose>
          <Analogy>
            A smoke alarm that keeps sounding after you have checked every room does not mean you
            should call more fire engines. It means the alarm is responding to something other than
            fire — steam, dust, a fault. The instruction to escalate only when the child deteriorates,
            not when the fever persists, is the clinical version of checking the rooms rather than
            trusting the noise.
          </Analogy>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 1 — MOVE THROUGH THE ADMISSION HOUR BY HOUR</SubHeading>
        <Prose style={{ marginBottom: 16 }}>
          Drag the slider to any point in the first four days and see which recommendations are
          active at that moment.
        </Prose>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <div style={{ fontFamily: mono, fontSize: 13, color: C, minWidth: 74 }}>{hour} hours</div>
          <input
            type="range" min={0} max={96} step={2} value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            style={{ flex: 1, accentColor: C, height: 6 }}
          />
          <div style={{ fontFamily: mono, fontSize: 11, color: T.muted, minWidth: 42 }}>of 96</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          {[0, 24, 48, 72, 96].map((h) => (
            <button key={h} onClick={() => setHour(h)} style={{
              background: "transparent", border: "none", padding: 0,
              fontFamily: mono, fontSize: 9.5, color: hour === h ? C : T.muted,
            }}>
              {h}h
            </button>
          ))}
        </div>

        <div className="fade-in" key={phase.key} style={{
          background: T.greenL, border: `1.5px solid ${C}35`, borderRadius: 14, padding: "20px 24px",
        }}>
          <SubHeading color={C}>{phase.key}</SubHeading>
          <div style={{ fontFamily: serif, fontSize: 18, color: T.ink, fontWeight: 600, marginBottom: 10 }}>
            {phase.title}
          </div>
          <Prose style={{ fontSize: 13.5 }}>{phase.body}</Prose>
          {phase.recs.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {phase.recs.map((id) => <RecCard key={id} rec={byId(id)} color={C} compact />)}
            </div>
          )}
        </div>
      </div>

      <div>
        <SubHeading color={C}>STEP 2 — WORK THE STOPPING RULES</SubHeading>
        <Prose style={{ marginBottom: 14 }}>
          Four facts determine whether antibiotics can stop. Set them and read the verdict — including
          the one combination where the guideline explicitly declines to give an answer.
        </Prose>
        <Card style={{ background: T.cream, marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <Toggle
              label="Risk group" color={C} value={s.risk} onChange={set("risk")}
              options={[{ label: "Low-risk", value: "low" }, { label: "High-risk", value: "high" }]}
            />
            <Toggle
              label="Well and afebrile ≥ 24 hours" color={C} value={s.well} onChange={set("well")}
              options={[{ label: "Yes", value: true }, { label: "No", value: false }]}
            />
            <Toggle
              label="Blood cultures negative at 48 hours" color={C} value={s.cultures} onChange={set("cultures")}
              options={[{ label: "Negative", value: true }, { label: "Positive", value: false }]}
            />
            <Toggle
              label="Evidence of marrow recovery" color={C} value={s.recovery} onChange={set("recovery")}
              options={[{ label: "Present", value: true }, { label: "Absent", value: false }]}
            />
          </div>
        </Card>

        <div className="fade-in" key={d.headline} style={{
          background: d.bg, border: `1.5px solid ${d.color}40`, borderRadius: 14, padding: "20px 24px",
        }}>
          <div style={{ fontFamily: serif, fontSize: 18, color: T.ink, fontWeight: 600, marginBottom: 10 }}>
            {d.headline}
          </div>
          <Prose style={{ fontSize: 13.5 }}>{d.body}</Prose>
          {d.recs.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {d.recs.map((id) => <RecCard key={id} rec={byId(id)} color={d.color} compact />)}
            </div>
          )}
        </div>
        <Prose style={{ fontSize: 12.5, marginTop: 12, color: T.muted }}>
          What you just saw: marrow recovery converts a conditional recommendation into a strong one,
          and risk group decides whether an answer exists at all. High-risk patients without count
          recovery remain, in 2023, an open question.
        </Prose>
      </div>

      <div>
        <SubHeading color={C}>THE 48-HOUR CLOCK IS NOT THE CLOCK YOU THINK</SubHeading>
        <Stack gap={12}>
          <Prose>
            The guideline attaches a remark to B5 that is easy to skim past and easy to get wrong in
            practice. The 48-hour blood culture evaluation refers to <strong>the initial blood culture
            drawn at presentation</strong>, even if further cultures were taken afterwards. The clock
            starts when the first sample goes into the incubator, not when the most recent one did.
          </Prose>
          <Prose>
            The panel then concedes the operational reality: depending on institutional and laboratory
            procedures, a 48-hour result may not actually be available until 72 hours or later — for
            instance if the sample was drawn overnight and results are only reported during daytime
            hours. A written protocol that says "stop at 48 hours" without accounting for when your
            laboratory reports will quietly become a protocol that stops at 72.
          </Prose>
          <Callout icon="🏥" color={C} bg={T.greenL}>
            <strong>For anyone writing a local pathway.</strong> The rate-limiting step for adopting
            this change is usually microbiology reporting turnaround and its coverage overnight and at
            weekends, not clinician willingness. That is a measurable, fixable process — and worth
            measuring before rewriting the antibiotic rule.
          </Callout>
        </Stack>
      </div>

      <Callout icon="🔑" color={C} bg={T.greenL}>
        <strong>Key insight.</strong> Section B replaces a temperature-driven reflex with a
        trajectory-driven rule. Persistent fever in a stable child changes nothing; deterioration
        changes everything; and negative cultures plus 24 hours of wellness is the combination that
        licenses stopping. The 2023 update shaved one day off that process for low-risk children —
        which, multiplied across a service, is a substantial reduction in exposure for a population
        in which no trial has yet detected a penalty.
      </Callout>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 6 — PROLONGED FEVER AND FUNGAL DISEASE (SECTION C)
   ════════════════════════════════════════════════════════════ */

const IFD_FACTORS = [
  { id: "aml", label: "Acute myeloid leukemia" },
  { id: "hrall", label: "High-risk ALL or relapsed acute leukemia" },
  { id: "neut", label: "Prolonged neutropenia" },
  { id: "steroid", label: "Receiving high-dose steroids" },
  { id: "allo", label: "Allogeneic HCT within the first year, without T-cell reconstitution", hct: true },
  { id: "gvhd", label: "Steroids or multiple immunosuppressives to prevent or treat GVHD", hct: true },
];

const BIOMARKERS = [
  {
    id: "gm", name: "Serum galactomannan", rec: "C2a",
    verdict: "Consider not using", strength: "conditional",
    body:
      "Rejected for routine use at the onset of prolonged fever on the basis of poor positive predictive value, with a high negative predictive value that is not clinically useful enough to justify the test. The panel adds an important caveat: this applies before radiologic evaluation. In a child whose CT already shows dense well-circumscribed lesions, a halo sign, an air crescent sign or wedge-shaped consolidation, the pretest probability of invasive aspergillosis is high enough that galactomannan may genuinely help.",
    ppv: null, npv: null,
  },
  {
    id: "bdg", name: "β-D-glucan", rec: "C2b",
    verdict: "Do not use", strength: "strong",
    body:
      "About half of positive results are false positives, and a negative result still leaves a 4% chance of disease — not low enough to safely withhold treatment from a high-risk child. The test therefore changes management in neither direction.",
    ppv: 49, npv: 96,
  },
  {
    id: "pcr", name: "Fungal PCR in blood", rec: "C2c",
    verdict: "Do not use", strength: "strong",
    body:
      "Roughly five in six positive results are false. At that positive predictive value, acting on a positive result means treating five children unnecessarily for every one who benefits, with the toxicity and cost that follow.",
    ppv: 17, npv: 95,
  },
];

function PredictiveBar({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontFamily: mono, fontSize: 10, color: T.muted, minWidth: 34 }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: T.faint, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontFamily: mono, fontSize: 11, color: T.ink, minWidth: 34 }}>{value}%</span>
    </div>
  );
}

const STRATEGIES = {
  empiric: {
    label: "Empiric",
    color: T.red, bg: T.redL,
    rec: "C4",
    oneLine: "Treat everyone at 96 hours; investigate alongside.",
    detail:
      "Start caspofungin or liposomal amphotericin B once fever has persisted 96 hours despite broad-spectrum antibacterial therapy. This is a strong recommendation on high-quality evidence, built on three trials showing caspofungin and liposomal amphotericin B perform similarly and that liposomal amphotericin B is less nephrotoxic than the conventional formulation. Other echinocandins such as micafungin are likely appropriate even though caspofungin was the agent tested.",
    pros: ["Simple to protocolize", "No dependence on imaging or laboratory turnaround", "Backed by the strongest evidence in Section C"],
    cons: ["Most treated children do not have fungal disease", "Longer antifungal exposure — 11 days median in the trial", "Cost and toxicity in patients who will never benefit"],
  },
  preemptive: {
    label: "Pre-emptive",
    color: T.teal, bg: T.tealL,
    rec: "C5",
    oneLine: "Investigate at 96 hours; treat only if the workup points to fungal disease.",
    detail:
      "Defer antifungals and instead evaluate — then start therapy only if the evaluation suggests or indicates invasive fungal disease. New in 2023, and restricted: non-transplant, high-risk, not receiving antimold prophylaxis. The single trial behind it halved median antifungal duration from 11 days to 6 with no difference in the prevalence of fungal disease (9 of 76 versus 9 of 73). Repeated evaluation and a return to empiric therapy should be reconsidered if fever continues.",
    pros: ["Median antifungal duration nearly halved", "No detected increase in invasive fungal disease", "Aligns antifungal use with actual evidence of infection"],
    cons: ["One trial, which excluded transplant recipients and children on voriconazole or posaconazole", "Requires reliable, repeatable access to CT and ultrasound", "Conditional recommendation — safety in high-risk patients is on the knowledge-gap list"],
  },
};

function TabAntifungal() {
  const C = T.red;
  const [checked, setChecked] = useState({ aml: false, hrall: false, neut: false, steroid: false, allo: false, gvhd: false });
  const [prophylaxis, setProphylaxis] = useState(false);
  const [bio, setBio] = useState("gm");
  const [strat, setStrat] = useState("empiric");

  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const anyFactor = Object.values(checked).some(Boolean);
  const isHCT = checked.allo || checked.gvhd;
  const b = BIOMARKERS.find((x) => x.id === bio);
  const st = STRATEGIES[strat];

  let pathway;
  if (!anyFactor) {
    pathway = {
      color: T.green, bg: T.greenL, head: "IFD low-risk — consider withholding antifungal therapy",
      body: "None of the defining risk factors is present, so this child is classified as low-risk for invasive fungal disease. The trial behind this recommendation randomized children with persistent fever to empiric antifungal therapy or none and found no benefit in fever resolution or fungal disease. Withholding remains conditional and low-quality — it is a defensible option, not a mandate.",
      recs: ["C6"],
    };
  } else if (!isHCT && !prophylaxis) {
    pathway = {
      color: T.teal, bg: T.tealL, head: "IFD high-risk — both strategies are open to you",
      body: "High-risk by C1, not a transplant recipient, and not receiving antimold prophylaxis. This is the exact population in which the 2023 update permits a choice: start caspofungin or liposomal amphotericin B empirically at 96 hours, or defer and treat pre-emptively based on evaluation. Compare the two below.",
      recs: ["C4", "C5"],
    };
  } else if (prophylaxis) {
    pathway = {
      color: T.orange, bg: T.orangeL, head: "IFD high-risk on antimold prophylaxis — the guideline is candid that it does not know",
      body: "When a child already on antimold prophylaxis develops prolonged fever unresponsive to antibacterial therapy, it is uncertain whether antifungal coverage should change, or whether continuing the same agent counts as pre-emptive or empiric therapy at all. Many high-risk children now receive antimold prophylaxis, so this uncertainty covers a large share of real practice. The empiric recommendation stands as the default.",
      recs: ["C4"],
    };
  } else {
    pathway = {
      color: T.red, bg: T.redL, head: "IFD high-risk transplant recipient — empiric therapy",
      body: "The pre-emptive option does not extend here. The single randomized trial supporting it excluded transplant recipients, and the panel did not generalize beyond the trial population. Start caspofungin or liposomal amphotericin B at 96 hours of fever unresponsive to broad-spectrum antibacterial therapy.",
      recs: ["C4"],
    };
  }

  return (
    <Stack gap={26}>
      <div>
        <SectionHeading label="When fever outlasts the antibiotics" color={C} />
        <Stack gap={14}>
          <Prose>
            Ninety-six hours of fever on broad-spectrum antibacterial therapy shifts the question.
            Invasive fungal disease is uncommon, difficult to diagnose, and lethal when missed — a
            combination that historically produced a simple answer: give antifungals to everyone
            whose fever persisted. Section C is the attempt to do better than that, and it turns on
            two decisions.
          </Prose>
          <Prose>
            The first is <strong>who is actually at risk</strong>, because the risk is
            concentrated rather than spread evenly. The second is <strong>what a test result is
            worth</strong> — and the answer for most fungal blood tests is that it is worth less than
            the decision it would drive, which is why Section C recommends against three of them.
          </Prose>
          <Analogy>
            Imagine a metal detector that beeps on five out of six harmless objects and still misses
            the occasional weapon. You would not install it at the door, because acting on its output
            makes you worse off than acting on your existing judgment. Fungal PCR in blood, with a
            positive predictive value of 17%, is that detector. The recommendation against it is not
            skepticism about fungal disease — it is arithmetic.
          </Analogy>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 1 — CLASSIFY FUNGAL RISK</SubHeading>
        <Prose style={{ marginBottom: 14 }}>
          Tick any factor that applies. Any single one makes this child IFD high-risk; none makes them
          low-risk. The transplant question and antimold prophylaxis then decide which treatment
          strategies are available.
        </Prose>
        <Card style={{ background: T.cream }}>
          <Stack gap={8}>
            {IFD_FACTORS.map((f) => (
              <button
                key={f.id} onClick={() => toggle(f.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                  background: checked[f.id] ? T.redL : T.white,
                  border: `1.5px solid ${checked[f.id] ? C : T.border}`,
                  borderRadius: 10, padding: "11px 14px", transition: "all 0.18s", width: "100%",
                }}
              >
                <span style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  background: checked[f.id] ? C : T.white,
                  border: `1.5px solid ${checked[f.id] ? C : T.borderDk}`,
                  color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {checked[f.id] ? "✓" : ""}
                </span>
                <span style={{ fontSize: 13, color: T.inkLight, fontFamily: sans, lineHeight: 1.5 }}>
                  {f.label}
                  {f.hct && (
                    <span style={{ fontFamily: mono, fontSize: 9, color: T.muted, marginLeft: 8 }}>
                      HCT
                    </span>
                  )}
                </span>
              </button>
            ))}
            <div style={{ marginTop: 6 }}>
              <Toggle
                label="Receiving antimold prophylaxis" color={C}
                value={prophylaxis} onChange={setProphylaxis}
                options={[{ label: "No", value: false }, { label: "Yes", value: true }]}
              />
            </div>
          </Stack>
        </Card>

        <div className="fade-in" key={pathway.head} style={{
          marginTop: 14, background: pathway.bg,
          border: `1.5px solid ${pathway.color}40`, borderRadius: 14, padding: "20px 24px",
        }}>
          <div style={{ fontFamily: serif, fontSize: 17, color: T.ink, fontWeight: 600, marginBottom: 10 }}>
            {pathway.head}
          </div>
          <Prose style={{ fontSize: 13.5 }}>{pathway.body}</Prose>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {pathway.recs.map((id) => <RecCard key={id} rec={byId(id)} color={pathway.color} compact />)}
          </div>
        </div>
      </div>

      <div>
        <SubHeading color={C}>STEP 2 — SEE WHY THREE BLOOD TESTS WERE REJECTED</SubHeading>
        <Prose style={{ marginBottom: 14 }}>
          Click each test to see what its predictive values actually are, and why that arithmetic
          decides its fate.
        </Prose>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          {BIOMARKERS.map((x) => (
            <button
              key={x.id} onClick={() => setBio(x.id)} className="hover-lift"
              style={{
                background: bio === x.id ? T.redL : T.white,
                border: `2px solid ${bio === x.id ? C : T.border}`,
                borderRadius: 11, padding: "12px 10px", transition: "all 0.2s",
              }}
            >
              <div style={{
                fontSize: 12.5, color: bio === x.id ? C : T.inkLight,
                fontWeight: bio === x.id ? 600 : 400, fontFamily: sans, lineHeight: 1.35,
              }}>
                {x.name}
              </div>
            </button>
          ))}
        </div>
        <div className="fade-in" key={bio} style={{
          background: T.white, border: `1.5px solid ${C}30`, borderRadius: 14, padding: "20px 24px",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: serif, fontSize: 17, color: T.ink, fontWeight: 600 }}>{b.name}</span>
            <Badge color={C} bg={T.redL}>{b.rec}</Badge>
            <Badge color={b.strength === "strong" ? T.ink : T.muted}>
              {b.strength === "strong" ? "STRONG" : "CONDITIONAL"} — {b.verdict.toUpperCase()}
            </Badge>
          </div>
          {b.ppv !== null && (
            <div style={{ background: T.cream, borderRadius: 10, padding: "14px 16px", margin: "12px 0" }}>
              <SubHeading color={T.muted}>PREDICTIVE VALUES REPORTED BY THE PANEL</SubHeading>
              <Stack gap={9}>
                <PredictiveBar label="PPV" value={b.ppv} color={T.red} />
                <PredictiveBar label="NPV" value={b.npv} color={T.teal} />
              </Stack>
              <Prose style={{ fontSize: 11.5, marginTop: 10, color: T.muted }}>
                A positive result is right {b.ppv}% of the time. A negative result is right {b.npv}%
                of the time — which sounds excellent until you consider that missing invasive fungal
                disease in {100 - b.npv} of every 100 high-risk children is not an acceptable
                trade for skipping treatment.
              </Prose>
            </div>
          )}
          <Prose style={{ fontSize: 13.5 }}>{b.body}</Prose>
        </div>
      </div>

      <div>
        <SubHeading color={C}>WHAT DOES EARN ITS PLACE — IMAGING</SubHeading>
        <Stack gap={12}>
          <Prose>
            Where the blood tests fail, targeted imaging succeeds. Chest CT is a strong recommendation
            because the lungs are the most frequent site of invasive fungal disease and the radiologic
            signs are characteristic. Abdominal imaging is conditional, recommended because abdominal
            fungal disease can be entirely silent — and ultrasound is preferred over CT since it needs
            no sedation and no radiation, which matters in a child who will be imaged repeatedly.
          </Prose>
          <Prose>
            Sinus CT is the interesting exception. It is not recommended routinely in the absence of
            localizing signs, not because sinus disease is rare but because abnormal sinus imaging is
            so common in these children that it rarely distinguishes fungal from non-fungal sinusitis.
            A test that is usually abnormal and rarely discriminating is a test that generates
            management without information.
          </Prose>
          <Stack gap={8}>
            {["C3a", "C3b", "C3c"].map((id) => <RecCard key={id} rec={byId(id)} color={C} compact />)}
          </Stack>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 3 — COMPARE THE TWO TREATMENT STRATEGIES</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {Object.entries(STRATEGIES).map(([k, v]) => (
            <button
              key={k} onClick={() => setStrat(k)} className="hover-lift"
              style={{
                background: strat === k ? v.bg : T.white,
                border: `2px solid ${strat === k ? v.color : T.border}`,
                borderRadius: 12, padding: "14px 16px", textAlign: "left", transition: "all 0.2s",
              }}
            >
              <div style={{
                fontFamily: serif, fontSize: 16, fontWeight: 600,
                color: strat === k ? v.color : T.ink, marginBottom: 4,
              }}>
                {v.label}
              </div>
              <div style={{ fontSize: 11.5, color: T.muted, fontFamily: sans, lineHeight: 1.5 }}>{v.oneLine}</div>
            </button>
          ))}
        </div>
        <div className="fade-in" key={strat} style={{
          background: st.bg, border: `1.5px solid ${st.color}40`, borderRadius: 14, padding: "20px 24px",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: serif, fontSize: 18, color: T.ink, fontWeight: 600 }}>
              {st.label} antifungal therapy
            </span>
            <Badge color={st.color} bg={T.white}>{st.rec}</Badge>
          </div>
          <Prose style={{ fontSize: 13.5, marginBottom: 14 }}>{st.detail}</Prose>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["What it buys", st.pros, T.green], ["What it costs", st.cons, T.red]].map(([head, items, col]) => (
              <div key={head} style={{ background: T.white, borderRadius: 10, padding: "12px 14px" }}>
                <SubHeading color={col}>{head}</SubHeading>
                <Stack gap={7}>
                  {items.map((it) => (
                    <div key={it} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: col, fontFamily: mono, fontSize: 11, marginTop: 2 }}>—</span>
                      <span style={{ fontSize: 12, color: T.inkLight, fontFamily: sans, lineHeight: 1.6 }}>{it}</span>
                    </div>
                  ))}
                </Stack>
              </div>
            ))}
          </div>
        </div>
        <Prose style={{ fontSize: 12.5, marginTop: 12, color: T.muted }}>
          What you just saw: the pre-emptive strategy is not a claim that fewer children have fungal
          disease. It is a claim that you can find the ones who do without treating the ones who do
          not — and it stands on a single trial, which is why it is conditional.
        </Prose>
      </div>

      <Callout icon="🔍" color={T.yellow} bg={T.yellowL}>
        <strong>An internal tension worth noticing.</strong> The trial that established the
        pre-emptive strategy used an evaluation protocol including serum galactomannan and sinus CT —
        both of which this same guideline recommends against. The panel resolves this by instructing
        you to follow C2 and C3 for evaluation even when using the pre-emptive approach, because those
        recommendations rest on a larger and more systematically assessed evidence base. In practice
        that means adopting the strategy from the trial while declining to reproduce its diagnostic
        workup — a defensible position, but one that leaves the strategy standing on a foundation
        slightly different from the one that was tested.
      </Callout>

      <Callout icon="🔑" color={C} bg={T.redL}>
        <strong>Key insight.</strong> Section C's logic is that the value of a fungal test is set by
        what you would do with the result, not by how sophisticated the assay is. Blood biomarkers
        lose because their positive results are mostly wrong and their negative results are not
        reassuring enough to withhold treatment. Chest CT wins because a characteristic lesion is both
        specific and actionable. The pre-emptive strategy is that same principle applied to the whole
        pathway: look properly first, and treat what you find.
      </Callout>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 7 — GAPS AND IMPLEMENTATION
   ════════════════════════════════════════════════════════════ */

const GAP_GROUPS = [
  {
    id: "general", label: "General", icon: "🧬",
    gaps: [
      ["Randomized trials addressing the identified gaps", "The list below is circular by design: the panel's first gap is that the other gaps have not been studied."],
      ["Randomized trials in transplant recipients, to define risk groups and practices", "Exactly one of the 79 trials studied transplant recipients alone. Every transplant-specific recommendation is therefore an extrapolation."],
      ["Cost-effectiveness of different management approaches", "Outpatient and shortened-duration strategies are defended partly on resource grounds, but almost none of the trials measured cost directly."],
      ["Approaches to facilitate implementation and increase guideline-consistent care", "Adherence, not evidence, is the binding constraint in most hospitals. The panel treats this as a research question rather than an afterthought."],
      ["Sequence-based pathogen testing at onset and through the episode", "Metagenomic and other sequence-based approaches are the obvious next diagnostic frontier and have essentially no pediatric FN trial evidence."],
    ],
  },
  {
    id: "initial", label: "Initial presentation", icon: "🚑",
    gaps: [
      ["Benefits and downsides of peripheral blood cultures at onset", "This is why A3 is conditional. The extra 12% of bacteremias detected is established; whether detecting them changes outcomes is not."],
      ["Benefits and downsides of urine cultures at onset", "The same structure as above: asymptomatic urinary infection is common, but the empiric regimen may already treat it."],
      ["Clinical impact of novel serum biomarkers for diagnosis and monitoring", "Procalcitonin, presepsin and others sit outside the guideline entirely — not rejected, simply unevaluated in this population."],
      ["Whether to await neutrophil results before giving antibiotics in clinically well patients", "The panel debated a good practice statement on this and could not agree. Some members would treat pending the count; others would wait to avoid unnecessary exposure. The compromise was to urge laboratories to be faster."],
    ],
  },
  {
    id: "ongoing", label: "Ongoing management", icon: "⏱️",
    gaps: [
      ["Necessity and timing of repeated blood cultures for persistent fever", "Daily cultures are common practice and entirely unevidenced in this guideline."],
      ["Targeted therapy alone versus continued broad-spectrum cover when cultures are positive and counts have not recovered", "One of the commonest real-world decisions on the ward, and one the guideline does not address."],
      ["Stopping antibiotics when viral tests are positive, blood cultures negative and counts have not recovered", "A trial exists but the panel declined to generalize from it, partly to avoid incentivizing respiratory virus testing in asymptomatic children."],
      ["Stopping antibiotics in high-risk patients without marrow recovery, with or without antibacterial prophylaxis", "This is the gap you meet directly in the stopping tool on the previous tab — the combination where no recommendation exists."],
      ["Whether any evidence of marrow recovery is enough, or a specific neutrophil threshold is required", "The panel calls the definition of marrow recovery elusive. Every stopping recommendation depends on a term nobody has defined operationally."],
    ],
  },
  {
    id: "antifungal", label: "Antifungal management", icon: "🍄",
    gaps: [
      ["Role of combination biomarkers in fungal evaluation and monitoring", "Individual biomarkers were rejected on predictive value. Whether combinations perform better is untested here."],
      ["Role and timing of repeated fungal evaluation when fever does not resolve", "Both the empiric and pre-emptive strategies assume re-evaluation, without specifying when or how often."],
      ["Confirming the safety of the pre-emptive approach in high-risk patients", "The panel's own newest recommendation is on its own list of things that need confirming."],
      ["Whether to continue or modify antifungal coverage in patients already on antimold prophylaxis", "This describes a large share of contemporary high-risk patients, and the guideline says plainly that the answer is unknown."],
      ["Appropriate duration of empiric antifungal therapy", "The guideline tells you when to start antifungals and never tells you when to stop them."],
    ],
  },
];

function TabGaps() {
  const C = T.indigo;
  const [grp, setGrp] = useState("general");
  const [open, setOpen] = useState(null);
  const g = GAP_GROUPS.find((x) => x.id === grp);
  const total = GAP_GROUPS.reduce((a, x) => a + x.gaps.length, 0);

  return (
    <Stack gap={26}>
      <div>
        <SectionHeading label="The list of things this guideline does not know" color={C} />
        <Stack gap={14}>
          <Prose>
            Most guidelines end with recommendations. This one ends with a table of {total} open
            questions, published with the same prominence as the answers. That table is the most
            useful page in the document for anyone designing research, and the second most useful for
            anyone writing a local protocol — because it tells you exactly where your protocol will be
            making things up.
          </Prose>
          <Prose>
            Read together, the gaps have a pattern. The guideline is strongest on which drug to start
            and weakest on everything that follows: when to repeat a culture, when to narrow, what
            marrow recovery means, when to stop antifungals. The initial decision has been randomized
            many times because it is easy to randomize. The downstream decisions, which consume far
            more of a hospital's antibiotic days, have not.
          </Prose>
          <Analogy>
            It is the difference between a map of a coastline and a map of the interior. The coast has
            been surveyed repeatedly because ships arrive there. Inland, the map still reads "unknown"
            — not because the territory is less important, but because it is harder to get to and
            nobody funded the expedition.
          </Analogy>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>STEP 1 — BROWSE THE GAPS BY PHASE OF CARE</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 14 }}>
          {GAP_GROUPS.map((x) => (
            <button
              key={x.id} onClick={() => { setGrp(x.id); setOpen(null); }} className="hover-lift"
              style={{
                background: grp === x.id ? T.indigoL : T.white,
                border: `2px solid ${grp === x.id ? C : T.border}`,
                borderRadius: 11, padding: "12px 10px", textAlign: "center", transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{x.icon}</div>
              <div style={{
                fontSize: 12, fontFamily: sans, lineHeight: 1.35,
                color: grp === x.id ? C : T.inkLight, fontWeight: grp === x.id ? 600 : 400,
              }}>
                {x.label}
              </div>
              <div style={{ fontFamily: mono, fontSize: 9.5, color: T.muted, marginTop: 3 }}>
                {x.gaps.length} gaps
              </div>
            </button>
          ))}
        </div>

        <div className="fade-in" key={grp}>
          <Stack gap={8}>
            {g.gaps.map(([q, why], i) => (
              <div
                key={q} className="hover-lift" onClick={() => setOpen(open === i ? null : i)}
                style={{
                  background: open === i ? T.indigoL : T.white,
                  border: `1.5px solid ${open === i ? C : T.border}`,
                  borderRadius: 11, padding: "13px 16px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C, marginTop: 2 }}>?</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: T.ink, fontFamily: sans, lineHeight: 1.6 }}>{q}</div>
                    <div style={{ fontFamily: mono, fontSize: 9.5, color: C, marginTop: 7 }}>
                      {open === i ? "▲ less" : "▼ why it matters"}
                    </div>
                    {open === i && (
                      <div className="fade-in" style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C}30` }}>
                        <Prose style={{ fontSize: 12.5 }}>{why}</Prose>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Stack>
        </div>
      </div>

      <div>
        <SubHeading color={C}>FROM GUIDELINE TO PATHWAY</SubHeading>
        <Stack gap={12}>
          <Prose>
            The panel is direct about the limits of publication: implementation and uptake continue to
            be challenging, and the mechanism it recommends is not education or dissemination but the
            creation of <strong>institution-specific care pathways</strong> adapted from the
            guideline. A pathway differs from a guideline in that it names your drugs, your risk
            rule, your laboratory turnaround and your escalation contacts — turning conditional
            recommendations into local decisions that have actually been made.
          </Prose>
          <Prose>
            Three places in this document demand a local decision before it can be operationalized.
            Which validated risk stratification rule you adopt, since A1 requires one but names none.
            Which of the three monotherapy options is your default, since the trials found them
            equivalent and your susceptibility data will not. And whether your resistance rate crosses
            the threshold in A6b that justifies routine second-agent coverage — a judgment the
            guideline explicitly delegates to you.
          </Prose>
          <Callout icon="📐" color={C} bg={T.indigoL}>
            <strong>What to measure once the pathway exists.</strong> The panel's stated priority for
            future work is measuring the impact of guideline-consistent care, which means the
            interesting metric is not whether you wrote the pathway but the proportion of episodes
            managed consistently with it. Time from fever documentation to first antibiotic dose,
            proportion of low-risk episodes stopped by 48 hours, and proportion of episodes receiving
            unnecessary second-agent coverage are three that follow directly from the recommendations
            above.
          </Callout>
        </Stack>
      </div>

      <div>
        <SubHeading color={C}>READING THIS GUIDELINE CRITICALLY</SubHeading>
        <Stack gap={12}>
          <Prose>
            Three limitations deserve to travel with any use of this document. The evidence base is
            heavily weighted toward populations of unclear or mixed risk — seven in ten trials — even
            though risk stratification is the axis every recommendation turns on. Blinding was rare,
            which matters most for the subjective endpoint of deciding to change a regimen. And half
            of the declared panel conflicts involve antifungal manufacturers, in a document whose
            headline change concerns antifungal strategy.
          </Prose>
          <Prose>
            None of these invalidate the guideline. The pre-emptive recommendation, notably, reduces
            antifungal use rather than expanding it, which runs against the direction a commercial
            bias would push. But the appropriate posture toward a guideline is not deference — it is
            reading the grades, checking the intervals, and noticing which recommendations were made
            because the trials said so and which were made because the panel had to say something.
          </Prose>
          <Callout icon="📅" color={T.muted} bg={T.faint}>
            <strong>Currency.</strong> The panel committed to updating this guideline within five
            years of its January 2023 publication, or sooner if important new information emerges.
            Anyone using it now should check whether newer evidence has appeared on the questions
            above, particularly stopping rules in high-risk patients and the pre-emptive antifungal
            strategy.
          </Callout>
        </Stack>
      </div>

      <Callout icon="🔑" color={C} bg={T.indigoL}>
        <strong>Key insight.</strong> A guideline that publishes its own ignorance is doing something
        harder than making recommendations. The nineteen gaps mark the boundary between where this
        document should govern your practice and where your own judgment, your own data and your own
        institution's decisions legitimately take over. Knowing which side of that boundary you are
        standing on is the whole point of reading it carefully.
      </Callout>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════════
   APP SHELL
   ════════════════════════════════════════════════════════════ */

const TAB_COMPONENTS = {
  overview: TabOverview,
  grade: TabGrade,
  initial: TabInitial,
  evidence: TabEvidence,
  ongoing: TabOngoing,
  antifungal: TabAntifungal,
  gaps: TabGaps,
};

function App() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active);
  const activeIdx = TABS.findIndex((t) => t.id === active);
  const Body = TAB_COMPONENTS[active];

  const go = (id) => {
    setActive(id);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: T.cream, fontFamily: sans, display: "flex", flexDirection: "column" }}>

      {/* Sticky header */}
      <div style={{
        background: T.white, borderBottom: `1px solid ${T.border}`,
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "14px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 16 }}>
            <div>
              <div style={{ fontFamily: serif, fontSize: 17, color: T.ink, fontWeight: 600, lineHeight: 1.3 }}>
                Fever and Neutropenia in Pediatric Cancer and Transplant Patients
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: T.muted, marginTop: 3, letterSpacing: 0.4 }}>
                Lehrnbecher, Robinson, Ammann et al. · J Clin Oncol 2023;41:1774-1785 · 2023 update
              </div>
            </div>
            <div style={{
              background: T.blueL, border: `1px solid ${T.blueMid}`, borderRadius: 8,
              padding: "5px 12px", fontFamily: mono, fontSize: 10, color: T.blue, whiteSpace: "nowrap",
            }}>
              {activeIdx + 1} / {TABS.length}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => go(t.id)} style={{
                background: active === t.id ? t.color : "transparent",
                border: `1.5px solid ${active === t.id ? t.color : T.border}`,
                borderRadius: 8, padding: "7px 14px", whiteSpace: "nowrap",
                color: active === t.id ? "#fff" : T.muted,
                fontSize: 13, transition: "all 0.18s",
                fontWeight: active === t.id ? 600 : 400,
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 980, margin: "0 auto", width: "100%", padding: "28px 24px" }}>
        <div style={{
          background: T.white, border: `1.5px solid ${tab.color}30`,
          borderLeft: `5px solid ${tab.color}`,
          borderRadius: "0 14px 14px 0", padding: "18px 22px", marginBottom: 28,
          boxShadow: `0 2px 12px ${tab.color}12`,
        }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: tab.color, letterSpacing: 1.5, marginBottom: 6 }}>
            {tab.icon} {tab.short.toUpperCase()}
          </div>
          <div style={{ fontFamily: serif, fontSize: 20, color: T.ink, fontWeight: 600, marginBottom: 8 }}>
            {tab.label}
          </div>
          <Prose style={{ fontSize: 14 }}>{tab.intro}</Prose>
        </div>

        <div className="fade-in" key={active} style={{
          background: T.white, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: "28px 30px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        }}>
          <Body />
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
          {activeIdx > 0 ? (
            <button onClick={() => go(TABS[activeIdx - 1].id)} style={{
              background: T.white, border: `1.5px solid ${T.border}`,
              borderRadius: 10, padding: "10px 18px", fontSize: 13, color: T.inkLight, fontFamily: sans,
            }}>
              ← {TABS[activeIdx - 1].label}
            </button>
          ) : <div />}
          {activeIdx < TABS.length - 1 ? (
            <button onClick={() => go(TABS[activeIdx + 1].id)} style={{
              background: tab.color, border: "none", borderRadius: 10,
              padding: "10px 18px", fontSize: 13, color: "#fff", fontFamily: sans, fontWeight: 600,
            }}>
              {TABS[activeIdx + 1].label} →
            </button>
          ) : (
            <button onClick={() => go(TABS[0].id)} style={{
              background: tab.color, border: "none", borderRadius: 10,
              padding: "10px 18px", fontSize: 13, color: "#fff", fontFamily: sans, fontWeight: 600,
            }}>
              ↩ Back to start
            </button>
          )}
        </div>

        <div style={{ marginTop: 26, textAlign: "center" }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.muted, lineHeight: 1.8 }}>
            Educational explainer. Clinical decisions require the full guideline text.<br />
            Lehrnbecher T, Robinson PD, Ammann RA, et al. J Clin Oncol 2023;41:1774-1785. DOI 10.1200/JCO.22.02224
          </div>
        </div>
      </div>

      {/* Dot footer */}
      <div style={{
        background: T.white, borderTop: `1px solid ${T.border}`, padding: "14px 24px",
        display: "flex", justifyContent: "center", gap: 8, alignItems: "center",
      }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => go(t.id)} title={t.label} style={{
            width: active === t.id ? 32 : 8, height: 8, borderRadius: 4,
            background: active === t.id ? t.color : T.borderDk,
            border: "none", padding: 0, transition: "all 0.25s",
          }} />
        ))}
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<App />);
