/* Source artifact. The live iTRACK copy (Babel-compatible + mount) is
   tutorials/static/tutorials/ai_governance.jsx — edit that file for the site. */
/* Loaded via Babel in the Django template. Hooks come from the global React.
   Source drop: tutorials/AI_Governance_in_Healthcare_Interactive.html */

const { useState, useEffect } = React;

/* ------------------------------------------------------------------
   Governance of AI in Healthcare — Interactive Evidence Brief
   KHCC Office of AI & Data Intelligence, August 2026
------------------------------------------------------------------ */

const styleTag = document.createElement("style");
styleTag.textContent = `
  #gov-root {
    --blue: #2F7FA8;
    --deep: #1F5F82;
    --deeper: #17455E;
    --sky: #D9EEF7;
    --teal: #55B8C6;
    --gold: #C9A24A;
    --coral: #E2725B;
    --violet: #7C6BAF;
    --green: #4CAF8E;
    --bg: #F4F7F9;
    --ink: #24323A;
    --muted: #5B707C;
    color: var(--ink);
    background: var(--bg);
    line-height: 1.6;
    font-size: 16px;
    font-family: "Aptos", "Segoe UI", Calibri, Arial, Helvetica, sans-serif;
    border-radius: 1.1rem;
    overflow: hidden;
  }
  #gov-root, #gov-root * { box-sizing: border-box; }
  #gov-root button { font-family: inherit; }

  #gov-root header.mast {
    background: linear-gradient(135deg, var(--deeper) 0%, var(--deep) 50%, var(--blue) 100%);
    color: #fff;
    padding: 44px 32px 0;
    position: relative;
    overflow: hidden;
  }
  #gov-root header.mast::after {
    content: "";
    position: absolute;
    right: -140px;
    top: -140px;
    width: 440px;
    height: 440px;
    border-radius: 50%;
    border: 60px solid rgba(85, 184, 198, .14);
    pointer-events: none;
  }
  #gov-root .mast-inner { max-width: 1020px; margin: 0 auto; position: relative; z-index: 1; }
  #gov-root .kicker {
    font-size: 12px;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: var(--teal);
    font-weight: 700;
    margin-bottom: 10px;
  }
  #gov-root h1.title { font-size: 34px; line-height: 1.15; font-weight: 800; max-width: 760px; color: #fff; }
  #gov-root p.sub { margin-top: 10px; font-size: 16px; color: var(--sky); max-width: 680px; }

  #gov-root nav.tabs { display: flex; gap: 6px; margin-top: 30px; flex-wrap: wrap; position: relative; z-index: 1; }
  #gov-root .tab-btn {
    appearance: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    padding: 12px 18px;
    border-radius: 12px 12px 0 0;
    background: rgba(255, 255, 255, .13);
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background .18s, transform .18s;
  }
  #gov-root .tab-btn:hover { background: rgba(255, 255, 255, .24); transform: translateY(-2px); }
  #gov-root .tab-btn.active { background: var(--bg); color: var(--deeper); }
  #gov-root .tab-dot { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 auto; }

  #gov-root main { max-width: 1020px; margin: 0 auto; padding: 36px 32px 72px; animation: govFadein .35s ease; }
  @keyframes govFadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  @keyframes govGrowbar { from { width: 0; } }

  #gov-root .h2-kick { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
  #gov-root h2 { font-size: 26px; color: var(--deeper); font-weight: 800; margin-bottom: 6px; }
  #gov-root .rule { height: 4px; width: 56px; border-radius: 2px; margin: 10px 0 22px; }
  #gov-root h3 { font-size: 18px; color: var(--deeper); margin: 22px 0 8px; }
  #gov-root p { margin-bottom: 14px; max-width: 76ch; }
  #gov-root p.lede { font-size: 17.5px; color: var(--deeper); }
  #gov-root strong { color: var(--deeper); }

  #gov-root .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 22px 0; }
  #gov-root .stat {
    background: #fff;
    border-radius: 14px;
    padding: 22px 20px;
    box-shadow: 0 3px 14px rgba(23, 69, 94, .09);
    border-top: 5px solid var(--blue);
    transition: transform .18s, box-shadow .18s;
  }
  #gov-root .stat:hover { transform: translateY(-3px); box-shadow: 0 8px 22px rgba(23, 69, 94, .15); }
  #gov-root .stat .num { font-size: 32px; font-weight: 800; line-height: 1.1; }
  #gov-root .stat .lbl { font-size: 13.5px; color: var(--muted); margin-top: 6px; line-height: 1.45; }

  #gov-root .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
  #gov-root .card { background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 3px 14px rgba(23, 69, 94, .09); }
  #gov-root .card h4 { font-size: 16px; margin-bottom: 8px; }
  #gov-root .card p { font-size: 14.5px; margin-bottom: 0; max-width: none; }
  #gov-root .tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #fff;
    border-radius: 20px;
    padding: 3px 11px;
    margin-bottom: 10px;
  }

  #gov-root .callout { border-radius: 0 12px 12px 0; padding: 18px 22px; margin: 22px 0; border-left: 5px solid; }
  #gov-root .callout p { margin: 0; max-width: none; }

  #gov-root .acc-item { background: #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(23, 69, 94, .08); margin-bottom: 12px; overflow: hidden; }
  #gov-root .acc-head {
    width: 100%;
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
    text-align: left;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    font-weight: 700;
    color: var(--deeper);
    font-size: 15.5px;
  }
  #gov-root .acc-head:hover { background: #F8FBFC; }
  #gov-root .acc-num {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex: 0 0 auto;
  }
  #gov-root .acc-chev { margin-left: auto; transition: transform .2s; color: var(--muted); }
  #gov-root .acc-chev.open { transform: rotate(90deg); }
  #gov-root .acc-body { padding: 0 20px 18px 64px; font-size: 14.5px; color: var(--ink); animation: govFadein .25s ease; }

  #gov-root .barrow { margin: 14px 0; }
  #gov-root .barrow .bl { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; }
  #gov-root .barrow .bl b { color: var(--deeper); }
  #gov-root .track { height: 16px; background: #E4EDF2; border-radius: 8px; overflow: hidden; }
  #gov-root .fill { height: 100%; border-radius: 8px; animation: govGrowbar 1s ease; }

  #gov-root .donut-wrap {
    display: flex;
    gap: 36px;
    align-items: center;
    flex-wrap: wrap;
    background: #fff;
    border-radius: 14px;
    padding: 26px;
    box-shadow: 0 3px 14px rgba(23, 69, 94, .09);
    margin: 20px 0;
  }
  #gov-root .donut-legend { font-size: 14.5px; }
  #gov-root .donut-legend div { margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  #gov-root .sw { width: 14px; height: 14px; border-radius: 4px; flex: 0 0 auto; }

  #gov-root .steps { display: flex; gap: 10px; margin: 22px 0; flex-wrap: wrap; }
  #gov-root .step-btn {
    flex: 1;
    min-width: 180px;
    appearance: none;
    border: 2px solid transparent;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    padding: 14px 16px;
    border-radius: 12px;
    background: #fff;
    color: var(--muted);
    box-shadow: 0 2px 10px rgba(23, 69, 94, .08);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all .18s;
    font-size: 14.5px;
  }
  #gov-root .step-btn:hover { transform: translateY(-2px); }
  #gov-root .step-idx {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #E4EDF2;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
  }
  #gov-root .phase-panel { background: #fff; border-radius: 14px; padding: 26px; box-shadow: 0 3px 14px rgba(23, 69, 94, .09); animation: govFadein .25s ease; }
  #gov-root .phase-panel ul { list-style: none; margin-top: 6px; padding-left: 0; }
  #gov-root .phase-panel li { padding: 9px 0 9px 26px; position: relative; font-size: 15px; border-bottom: 1px solid #F0F5F8; }
  #gov-root .phase-panel li:last-child { border-bottom: none; }
  #gov-root .phase-panel li::before { content: ""; position: absolute; left: 2px; top: 17px; width: 9px; height: 9px; border-radius: 50%; }

  #gov-root table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 3px 14px rgba(23, 69, 94, .09); margin: 20px 0; font-size: 14.5px; }
  #gov-root th { color: #fff; text-align: left; padding: 12px 16px; font-weight: 600; }
  #gov-root td { padding: 12px 16px; border-top: 1px solid #E4EDF2; vertical-align: top; }
  #gov-root tr:nth-child(even) td { background: #F8FBFC; }
  #gov-root td.k { font-weight: 700; color: var(--deep); }

  #gov-root .check-item {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(23, 69, 94, .08);
    margin-bottom: 12px;
    padding: 16px 20px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    cursor: pointer;
    transition: all .15s;
    border-left: 5px solid transparent;
  }
  #gov-root .check-item:hover { transform: translateX(3px); }
  #gov-root .check-item.done { border-left-color: var(--green); background: #F2FAF7; }
  #gov-root .cbox {
    width: 24px;
    height: 24px;
    border-radius: 7px;
    border: 2px solid #B9C9D2;
    flex: 0 0 auto;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    transition: all .15s;
  }
  #gov-root .check-item.done .cbox { background: var(--green); border-color: var(--green); }
  #gov-root .check-item h4 { font-size: 15.5px; color: var(--deeper); margin-bottom: 3px; }
  #gov-root .check-item p { font-size: 14px; color: var(--muted); margin: 0; max-width: none; }
  #gov-root .check-item.done h4 { text-decoration: line-through; color: var(--muted); }
  #gov-root .progress-note { font-size: 14px; font-weight: 700; color: var(--deep); margin-bottom: 16px; }

  #gov-root .sources { font-size: 13.5px; color: var(--muted); }
  #gov-root .sources ol { padding-left: 20px; }
  #gov-root .sources li { margin-bottom: 9px; }
  #gov-root .src-note { font-size: 12.5px; font-style: italic; margin-top: 12px; }

  #gov-root footer { padding: 22px 32px; background: var(--deeper); color: rgba(255, 255, 255, .8); font-size: 13px; text-align: center; }

  @media (max-width: 760px) {
    #gov-root .cards { grid-template-columns: 1fr; }
    #gov-root h1.title { font-size: 26px; }
    #gov-root .tab-btn { padding: 10px 12px; font-size: 13px; }
  }
`;
if (!document.head.querySelector("[data-gov-style]")) {
  styleTag.setAttribute("data-gov-style", "1");
  document.head.appendChild(styleTag);
}

/* ---------- palette per tab ---------- */
const TABS = [
  { id: "why", label: "Why govern?", color: "#2F7FA8" },
  { id: "gap", label: "The gap", color: "#E2725B" },
  { id: "cycle", label: "Lifecycle", color: "#55B8C6" },
  { id: "case", label: "Case study", color: "#C9A24A" },
  { id: "trust", label: "Trust", color: "#7C6BAF" },
  { id: "action", label: "Action plan", color: "#4CAF8E" },
];

/* ---------- small building blocks ---------- */
function SectionHead(props) {
  return (
    <div>
      <div className="h2-kick" style={{ color: props.color }}>{props.kick}</div>
      <h2>{props.title}</h2>
      <div className="rule" style={{ background: props.color }}></div>
    </div>
  );
}

function CountUp(props) {
  var to = props.to;
  var prefix = props.prefix || "";
  var suffix = props.suffix || "";
  var decimals = props.decimals || 0;
  var dur = props.dur || 1100;
  var _state = useState(0);
  var v = _state[0];
  var setV = _state[1];
  useEffect(function () {
    var raf;
    var t0;
    var tick = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return function () { cancelAnimationFrame(raf); };
  }, [to]);
  return <span>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

function Stat(props) {
  return (
    <div className="stat" style={{ borderTopColor: props.color }}>
      <div className="num" style={{ color: props.color }}>{props.num}</div>
      <div className="lbl">{props.label}</div>
    </div>
  );
}

function Bar(props) {
  return (
    <div className="barrow">
      <div className="bl">
        <b>{props.label}</b>
        <span style={{ color: props.color, fontWeight: 800 }}>{props.display}</span>
      </div>
      <div className="track">
        <div className="fill" style={{ width: ((props.value / (props.max || 100)) * 100) + "%", background: props.color }}></div>
      </div>
    </div>
  );
}

function Donut(props) {
  var pct = props.pct;
  var color = props.color;
  var size = props.size || 170;
  var label = props.label;
  var r = 62;
  var c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} fill="none" stroke="#E4EDF2" strokeWidth="20" />
      <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="20"
        strokeDasharray={(c * pct / 100) + " " + c} strokeLinecap="round"
        transform="rotate(-90 80 80)"
        style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x="80" y="76" textAnchor="middle" fontSize="30" fontWeight="800" fill={color}>{pct}%</text>
      <text x="80" y="98" textAnchor="middle" fontSize="11" fill="#5B707C">{label}</text>
    </svg>
  );
}

function Accordion(props) {
  var _open = useState(0);
  var open = _open[0];
  var setOpen = _open[1];
  return (
    <div>
      {props.items.map(function (it, i) {
        return (
          <div className="acc-item" key={i}>
            <button className="acc-head" onClick={function () { setOpen(open === i ? -1 : i); }}>
              <span className="acc-num" style={{ background: props.color }}>{i + 1}</span>
              {it.title}
              <span className={"acc-chev" + (open === i ? " open" : "")}>▶</span>
            </button>
            {open === i && <div className="acc-body">{it.body}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Tab 1 · WHY ---------- */
function WhyTab() {
  var c = "#2F7FA8";
  return (
    <div>
      <SectionHead kick="The problem" title="Why governance, not just validation" color={c} />
      <p className="lede">Clinical AI fails differently from drugs and devices: it can pass its studies, get regulatory clearance, and then quietly degrade in place. Governance exists because a one-time approval cannot guarantee ongoing safety.</p>

      <div className="stats">
        <Stat color="#2F7FA8" num={<span>AUC <CountUp to={0.63} decimals={2} /></span>}
          label={<span>Real-world Epic Sepsis Model performance at Michigan Medicine, vs the vendor's claimed 0.76–0.83. It missed 67% of septic patients while alerting on 18% of all hospitalizations.<sup>1</sup></span>} />
        <Stat color="#E2725B" num={<CountUp to={182} suffix=" recalls" />}
          label={<span>Across 60 of 950 FDA-authorized AI devices through Nov 2024 — 43% within the first year of clearance. Devices lacking clinical validation were recalled far more often.<sup>2</sup>*</span>} />
        <Stat color="#C9A24A" num={<span><CountUp to={46.6} decimals={1} suffix="%" /></span>}
          label={<span>Error rate of a validated ophthalmology model on a different scanner type — up from 5.5% on the training scanner. The canonical illustration of data drift.<sup>3</sup></span>} />
      </div>

      <h3>Four recurring failure modes — click to expand</h3>
      <Accordion color={c} items={[
        { title: "The local-validity gap",
          body: <span>Models validated elsewhere underperform on local patients, workflows, and equipment. A review of nine FDA-cleared breast-screening AI products found all were cleared on retrospective data, seven used enriched datasets, four gave no external-validation detail, and <strong>none reported clinically meaningful outcomes</strong> such as stage at diagnosis or interval cancers.<sup>4</sup></span> },
        { title: "Silent drift after deployment",
          body: <span>Patient populations, assays, coding practices, and scanners change under a frozen model. FDA CDRH scientists describe drift as a major cause of performance deterioration; in Toronto, monitoring across 143,049 admissions detected harmful shifts from demographics, lab assays, and COVID-19 — <strong>without waiting for outcome labels</strong>.<sup>3,5</sup></span> },
        { title: "Fairness is not a one-time audit",
          body: <span>Across 1.7 million VA surgical cases tracked over 11 years, subgroup fairness gaps drifted over time — and routine retraining <strong>sometimes restored fairness and sometimes made it worse</strong>. Equity requires continuous monitoring, not a certificate at validation.<sup>6</sup></span> },
        { title: "Bias enters through the data",
          body: <span>A widely deployed commercial risk algorithm systematically understated the health needs of Black patients because it used cost as a proxy for illness. Dataset documentation standards (STANDING Together: 29 recommendations, 350+ contributors from 58 countries) exist precisely because unexamined data encodes inequity.<sup>7</sup></span> },
      ]} />
    </div>
  );
}

/* ---------- Tab 2 · GAP ---------- */
function GapTab() {
  var c = "#E2725B";
  return (
    <div>
      <SectionHead kick="The state of the field" title="Many frameworks, little governance" color={c} />
      <p>A 2026 scoping review in <em>npj Digital Medicine</em> examined every published AI-governance framework for healthcare organizations: <strong>77 frameworks</strong> — and principles vastly outnumber working oversight structures.<sup>8</sup></p>

      <div className="donut-wrap">
        <Donut pct={13} color="#E2725B" label="complete frameworks" />
        <Donut pct={19.5} color="#7C6BAF" label="with oversight body" />
        <div className="donut-legend">
          <div><span className="sw" style={{ background: "#E2725B" }}></span>Only <strong>&nbsp;10 of 77&nbsp;</strong> contained all four essential components</div>
          <div><span className="sw" style={{ background: "#7C6BAF" }}></span>Just <strong>&nbsp;15 of 77&nbsp;</strong> named an oversight mechanism — the biggest gap</div>
          <div><span className="sw" style={{ background: "#E4EDF2" }}></span>The rest: principles without machinery</div>
        </div>
      </div>

      <h3>The four components a complete framework needs</h3>
      <table>
        <thead><tr><th style={{ background: "#E2725B", width: 210 }}>Component</th><th style={{ background: "#E2725B" }}>What it means in practice</th></tr></thead>
        <tbody>
          <tr><td className="k">1 · Guiding principles</td><td>Explicit institutional commitments — e.g. interpretability, accuracy, fairness — that translate into deployment criteria, not posters.</td></tr>
          <tr><td className="k">2 · Assessment methods</td><td>Concrete instruments for evaluating a model before and after deployment: local validation protocols, bias audits, usability testing.</td></tr>
          <tr><td className="k">3 · Lifecycle coverage</td><td>Governance that follows the model from procurement through deployment, monitoring, updating, and retirement.</td></tr>
          <tr><td className="k">4 · Oversight mechanism</td><td>A named body with authority — a multi-disciplinary committee that can approve, monitor, pause, and retire applications.</td></tr>
        </tbody>
      </table>

      <div className="callout" style={{ background: "#fdf1ee", borderLeftColor: c }}>
        <p><strong>The field's conclusion:</strong> the bottleneck is no longer writing principles — it is implementing oversight mechanisms inside real institutions and evaluating whether they work.<sup>8</sup></p>
      </div>
    </div>
  );
}

/* ---------- Tab 3 · LIFECYCLE ---------- */
function CycleTab() {
  var c = "#55B8C6";
  var phases = [
    { name: "Before deployment", color: "#1F5F82", items: [
      <span><strong>TRIPOD+AI</strong> — 27-item standard for reporting prediction-model development and validation<sup>9</sup></span>,
      <span><strong>SPIRIT-AI / CONSORT-AI</strong> — trial protocols and reports; CONSORT-AI explicitly requires error-case analysis<sup>10</sup></span>,
      <span><strong>STANDING Together</strong> — dataset documentation and health-equity review<sup>7</sup></span>,
      <span><strong>Local validation</strong> on your own patients — external performance never transfers by assumption<sup>1,4</sup></span>,
    ] },
    { name: "At deployment", color: "#2F7FA8", items: [
      <span><strong>DECIDE-AI</strong> — the small-scale, live, human-factors evaluation stage between offline validation and full trials<sup>11</sup></span>,
      <span><strong>Workflow &amp; alert-burden assessment</strong> — the Epic sepsis lesson: number-needed-to-evaluate = 8<sup>1</sup></span>,
      <span><strong>Committee endorsement</strong> with defined success criteria and a pre-agreed retirement trigger<sup>12</sup></span>,
    ] },
    { name: "After deployment", color: "#55B8C6", items: [
      <span><strong>Label-agnostic drift detection</strong> — shifts caught before outcome labels arrive<sup>5</sup></span>,
      <span><strong>Drift-triggered retraining</strong> — ΔAUROC +0.44 during COVID in the Toronto pipeline<sup>5</sup></span>,
      <span><strong>Quarterly subgroup fairness monitoring</strong> — retraining can worsen equity gaps<sup>6</sup></span>,
      <span><strong>Scheduled re-endorsement</strong> — and retirement when the model no longer earns its place<sup>12</sup></span>,
    ] },
  ];
  var _sel = useState(0);
  var sel = _sel[0];
  var setSel = _sel[1];
  var ph = phases[sel];
  return (
    <div>
      <SectionHead kick="The machinery" title="Governing the full lifecycle" color={c} />
      <p>Mature governance maps specific instruments to each stage of a model's life. The reporting-standard ecosystem now covers the whole pipeline, and post-deployment monitoring is operational, not aspirational. <strong>Click a stage:</strong></p>

      <div className="steps">
        {phases.map(function (p, i) {
          return (
            <button key={i} className="step-btn"
              style={sel === i ? { borderColor: p.color, color: p.color, background: "#fff" } : {}}
              onClick={function () { setSel(i); }}>
              <span className="step-idx" style={sel === i ? { background: p.color, color: "#fff" } : {}}>{i + 1}</span>
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="phase-panel" key={sel}>
        <h3 style={{ color: ph.color, marginTop: 0 }}>{ph.name}</h3>
        <ul>
          {ph.items.map(function (it, i) {
            return (
              <li key={i}>
                <style>{"#gov-root .phase-panel li:nth-child(" + (i + 1) + ")::before{background:" + ph.color + "}"}</style>
                {it}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Tab 4 · CASE ---------- */
function CaseTab() {
  var c = "#C9A24A";
  return (
    <div>
      <SectionHead kick="A working example" title="What health-system governance looks like" color={c} />
      <p>University of Wisconsin Health published one of the few <strong>operating</strong> (rather than proposed) governance structures: a multi-disciplinary steering committee spanning informatics, data science, clinical operations, ethics, and equity, with project-specific sub-committees, three governing principles — <strong>interpretability, accuracy, fairness</strong> — and a value stream applying them at every implementation stage.<sup>12</sup></p>

      <div className="stats">
        <Stat color="#2F7FA8" num={<CountUp to={10} />} label="Successful deployments under the governance structure" />
        <Stat color="#55B8C6" num={<CountUp to={2} />} label={<span>Successful <strong>retirements</strong> — models withdrawn when no longer acceptable</span>} />
        <Stat color="#C9A24A" num={<CountUp to={1} />} label={<span>Successful <strong>non-deployment</strong> — a model stopped before reaching patients</span>} />
      </div>

      <div className="callout" style={{ background: "#faf5e8", borderLeftColor: c }}>
        <p><strong>The most important number is the 1.</strong> A committee that can say <span style={{ color: c, fontWeight: 800 }}>no</span> is what makes its <span style={{ color: c, fontWeight: 800 }}>yes</span> credible. Governance that has never blocked or retired anything is decoration.</p>
      </div>

      <h3>The wider regulatory ecosystem</h3>
      <div className="cards">
        <div className="card"><span className="tag" style={{ background: "#2F7FA8" }}>FDA reality</span>
          <h4 style={{ color: "#2F7FA8" }}>Clearance ≠ clinical validation</h4>
          <p>Most AI devices reach the US market through the 510(k) equivalence pathway on retrospective data. No cleared breast-screening product reported clinically meaningful outcomes<sup>4</sup>, and devices without peer-reviewed clinical validation were disproportionately recalled.<sup>2</sup>*</p></div>
        <div className="card"><span className="tag" style={{ background: "#55B8C6" }}>WHO 2024</span>
          <h4 style={{ color: "#2F7FA8" }}>Guidance on large multi-modal models</h4>
          <p>40+ recommendations across the value chain: assign a regulatory agency to assess health LMMs, mandate post-release independent audits, engage diverse stakeholders from the earliest design stage.<sup>13</sup></p></div>
        <div className="card"><span className="tag" style={{ background: "#C9A24A" }}>Ethics frame</span>
          <h4 style={{ color: "#2F7FA8" }}>Five determinants of trustworthiness</h4>
          <p>Data quality, algorithmic bias, opacity, safety &amp; security, and responsibility attribution — with humans, not systems, remaining the duty-bearers when harm occurs.<sup>14</sup></p></div>
        <div className="card"><span className="tag" style={{ background: "#7C6BAF" }}>Generative AI</span>
          <h4 style={{ color: "#2F7FA8" }}>The new governance frontier</h4>
          <p>LMMs were adopted faster than any consumer technology in history and enter clinics through five routes — diagnosis, patient-facing use, clerical work, education, research. Their general-purpose nature breaks one-indication approval, strengthening the case for institutional oversight of actual local use.<sup>13</sup></p></div>
      </div>
    </div>
  );
}

/* ---------- Tab 5 · TRUST ---------- */
function TrustTab() {
  var c = "#7C6BAF";
  return (
    <div>
      <SectionHead kick="The payoff" title="Governance is what patients reward" color={c} />
      <p>A 2026 preregistered conjoint experiment (<strong>3,000 US adults, 36,000 observations</strong>) tested what actually moves patient trust in AI-assisted care.<sup>15</sup> The answer: performance, a human in the loop, honest data disclosure — and governance itself.</p>

      <div className="phase-panel">
        <h3 style={{ marginTop: 0, color: c }}>Effect on probability of choosing an AI-assisted visit</h3>
        <Bar label="AI performs at specialist level" value={32.5} max={35} color="#7C6BAF" display="+32.5%" />
        <Bar label="AI performs above GP level" value={24.8} max={35} color="#9A8CC4" display="+24.8%" />
        <Bar label="Clinician present in the loop" value={18.4} max={35} color="#55B8C6" display="+18.4%" />
        <Bar label="Representative training data disclosed" value={10} max={35} color="#C9A24A" display="preferred ✓" />
        <Bar label="Any governance (FDA / external / local cert.)" value={10} max={35} color="#4CAF8E" display="preferred ✓" />
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 10, marginBottom: 0 }}>Top three bars: average marginal component effects. Bottom two: significant positive preference vs none (magnitude smaller than performance/clinician effects).</p>
      </div>

      <div className="callout" style={{ background: "#F1EEF8", borderLeftColor: c }}>
        <p><strong>Implication:</strong> governance is not friction on adoption — it is a precondition for it. Patients preferred every form of oversight over none, and transparency about training data independently increased trust.<sup>15</sup></p>
      </div>
    </div>
  );
}

/* ---------- Tab 6 · ACTION ---------- */
function ActionTab() {
  var c = "#4CAF8E";
  var items = [
    { t: "Stand up one accountable oversight body",
      d: "A multi-disciplinary AI governance committee (clinical, informatics, data science, ethics, equity, operations) with real authority to approve, pause, and retire. Missing from 80% of published frameworks. [8,12]" },
    { t: "Adopt the existing standards — don't write new principles",
      d: "TRIPOD+AI for model reports, DECIDE-AI for early live evaluation, CONSORT-AI/SPIRIT-AI for trials, STANDING Together for dataset equity review. [7,9,10,11]" },
    { t: "Require local validation before any deployment",
      d: "Vendor and regulatory claims are a floor for review, never a substitute for performance on your own patients. [1,4]" },
    { t: "Monitor continuously after go-live",
      d: "Label-agnostic drift detection, quarterly subgroup fairness metrics, and pre-agreed thresholds that trigger retraining, recalibration, or retirement. [3,5,6]" },
    { t: "Plan the exit at the entrance",
      d: "Every endorsement carries success criteria, a monitoring owner, and the conditions under which the model comes out. Count retirements and non-deployments as governance successes. [12]" },
  ];
  var _done = useState(Array(items.length).fill(false));
  var done = _done[0];
  var setDone = _done[1];
  var n = done.filter(Boolean).length;
  return (
    <div>
      <SectionHead kick="Recommendations" title="What a health system should do" color={c} />
      <p className="progress-note" style={{ color: c }}>{n} of {items.length} reviewed {n === items.length ? "— all five covered ✓" : "(click items as you discuss them)"}</p>
      {items.map(function (it, i) {
        return (
          <div key={i} className={"check-item" + (done[i] ? " done" : "")}
            onClick={function () {
              setDone(function (d) {
                return d.map(function (v, j) { return j === i ? !v : v; });
              });
            }}>
            <div className="cbox">{done[i] ? "✓" : ""}</div>
            <div><h4>{i + 1}. {it.t}</h4><p>{it.d}</p></div>
          </div>
        );
      })}

      <div className="sources" style={{ marginTop: 36 }}>
        <h3>Sources</h3>
        <ol>
          <li>Wong A, et al. External validation of the Epic Sepsis Model. <em>JAMA Intern Med.</em> 2021.</li>
          <li>Lee B, Ross JS, Sharfstein JM, Dai T, et al. Early recalls and clinical validation gaps in AI-enabled medical devices. <em>JAMA Health Forum.</em> 2025;6(8):e253172.</li>
          <li>Sahiner B, Chen W, Samala RK, Petrick N (FDA CDRH). Data drift in medical machine learning. <em>Br J Radiol.</em> 2023;96:20220878.</li>
          <li>Potnis KC, Ross JS, Aneja S, Gross CP, Richman IB. AI in breast cancer screening: evaluation of FDA device regulation. <em>JAMA Intern Med.</em> 2022;182(12):1306–1312.</li>
          <li>Subasri V, et al. Detecting and remediating harmful data shifts. <em>JAMA Netw Open.</em> 2025;8(6):e2513685.</li>
          <li>Davis SE, Dorn C, Park DJ, Matheny ME. Emerging algorithmic bias: fairness drift. <em>JAMIA.</em> 2025;32(5):845–854.</li>
          <li>Alderman JE, et al. STANDING Together consensus recommendations. <em>Lancet Digit Health.</em> 2025.</li>
          <li>Wang A, Freeman S, Magrabi F. Governance for safe and responsible AI in healthcare organisations: a scoping review. <em>npj Digit Med.</em> 2026;9:516.</li>
          <li>Collins GS, et al. TRIPOD+AI statement. <em>BMJ.</em> 2024.</li>
          <li>Liu X, Cruz Rivera S, et al. CONSORT-AI and SPIRIT-AI extensions. <em>Nat Med.</em> 2020.</li>
          <li>Vasey B, et al. DECIDE-AI reporting guideline. <em>Nat Med.</em> 2022.</li>
          <li>Liao F, Adelaine S, Afshar M, Patterson BW. Governance of clinical AI applications at UW Health. <em>Front Digit Health.</em> 2022;4:931439.</li>
          <li>World Health Organization. Ethics and governance of AI for health: guidance on large multi-modal models. Geneva: WHO; 2024.</li>
          <li>Zhang J, Zhang ZM. Ethics and governance of trustworthy medical AI. <em>BMC Med Inform Decis Mak.</em> 2023;23:7.</li>
          <li>Bracic A, Spector-Bagdady K, Price WN, et al. Factors for patient trust and acceptance of medical AI. <em>JAMA Netw Open.</em> 2026;9(3):e260815.</li>
        </ol>
        <p className="src-note">* Recall figures for source 2 are consistent across four independent secondary sources but were not verified against the primary article text — confirm before quoting in a slide or publication. The cost-proxy bias finding is from Obermeyer Z, et al. <em>Science.</em> 2019;366:447–453.</p>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function AiGovernanceBrief() {
  var _tab = useState("why");
  var tab = _tab[0];
  var setTab = _tab[1];
  var panels = {
    why: WhyTab,
    gap: GapTab,
    cycle: CycleTab,
    caseStudy: CaseTab,
    trust: TrustTab,
    action: ActionTab,
  };
  var panelKey = tab === "case" ? "caseStudy" : tab;
  var Panel = panels[panelKey];
  return (
    <div>
      <header className="mast">
        <div className="mast-inner">
          <div className="kicker">Interactive Evidence Brief · AI &amp; Data Intelligence</div>
          <h1 className="title">Governance of Artificial Intelligence in Healthcare</h1>
          <p className="sub">Why clinical AI needs institutional oversight across its whole lifecycle — what the evidence shows, what frameworks exist, and what a health system should actually do.</p>
          <nav className="tabs">
            {TABS.map(function (t) {
              return (
                <button key={t.id} className={"tab-btn" + (tab === t.id ? " active" : "")} onClick={function () { setTab(t.id); }}>
                  <span className="tab-dot" style={{ background: t.color }}></span>{t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
      <main key={tab}><Panel /></main>
      <footer>King Hussein Cancer Center · Office of AI &amp; Data Intelligence · August 2026</footer>
    </div>
  );
}

var mount = document.getElementById("gov-root");
if (mount && window.ReactDOM) {
  var root = ReactDOM.createRoot(mount);
  root.render(<AiGovernanceBrief />);
}

/* When this brief is inside the Block 7 iframe, tell the parent page
   how tall we are so the box can grow and hide its inner scrollbar. */
function startHeightBridge() {
  if (window.parent === window) {
    return;
  }
  try {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  } catch (err) {
    console.error("The overflow lock failed:", err.message);
  }

  function send() {
    try {
      var el = document.getElementById("gov-root");
      var h = 0;
      if (el) {
        h = Math.ceil(Math.max(el.scrollHeight, el.getBoundingClientRect().height));
      }
      if (!h) {
        h = Math.ceil(document.documentElement.scrollHeight);
      }
      window.parent.postMessage({ type: "b7-gov-height", height: h }, "*");
    } catch (err) {
      console.error("The height report failed:", err.message);
    }
  }

  send();
  if (window.ResizeObserver) {
    var el = document.getElementById("gov-root");
    if (el) {
      var ro = new ResizeObserver(function () { send(); });
      ro.observe(el);
    }
  }
  window.addEventListener("resize", send);
  window.addEventListener("message", function (ev) {
    if (ev.data && ev.data.type === "b7-gov-remeasure") {
      send();
    }
  });
}

try {
  startHeightBridge();
} catch (err) {
  console.error("The height bridge failed:", err.message);
}
