---
layout: default
title: AIBedside.io
permalink: /
---

<style>
  .site-nav { display: none !important; }
  .site-header {
    background: #21409A !important;
    border-top: 0 !important;
    border-bottom: 4px solid #EC008C !important;
    min-height: 72px !important;
  }
  .site-title, .site-title:visited {
    display: inline-flex !important;
    align-items: center;
    gap: 0.75rem;
    color: #ffffff !important;
    font-weight: 800 !important;
  }
  .siop-bar-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
    background: #ffffff;
    border-radius: 10px;
  }
  .siop-bar-copy { display: flex; flex-direction: column; line-height: 1.15; }
  .siop-bar-name { font-size: 1.05rem; }
  .siop-bar-meta { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; color: #FFC20E; }
  .cci-logo:visited { color: inherit; }
  .cci-logo-text { text-align: center; }
  .page-content { padding-top: 0 !important; }

  .cci-hero {
    text-align: center;
    padding: 2.25rem 1rem 2.25rem;
    margin: 0 0 2rem;
    background: linear-gradient(180deg, #E8F1FB 0%, #ffffff 78%);
    border-bottom: 1px solid #D6E4F5;
  }

  .cci-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 1.35rem;
    text-decoration: none;
  }

  .cci-logo .siop-wordmark {
    display: block;
    width: min(340px, 88vw);
    height: auto;
  }

  .cci-logo-text .subtitle {
    font-size: 0.78rem;
    color: #EC008C;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .cci-hero h1 {
    color: #21409A;
    font-size: 1.85rem;
    font-weight: 800;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .cci-hero .tagline {
    color: #607D8B;
    font-size: 1rem;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .cci-qr-box {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    background: linear-gradient(135deg, #E8F1FB, #FDE8F4);
    border: 1px solid #B8D0EC;
    border-radius: 0.85rem;
    padding: 0.85rem 1.25rem;
    margin: 1.75rem auto 0;
  }

  .cci-qr-box img {
    width: 72px;
    height: 72px;
    border-radius: 0.5rem;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .cci-qr-info { text-align: left; }

  .cci-qr-info .label {
    font-weight: 700;
    color: #034EA2;
    font-size: 0.82rem;
    margin: 0;
  }

  .cci-qr-info .hint {
    font-size: 0.75rem;
    color: #78909C;
    margin: 0.15rem 0 0;
    line-height: 1.4;
  }

  .cci-section-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1B2A4A;
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #034EA2;
    display: inline-block;
  }

  .cci-grid {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 2rem;
  }

  .cci-card {
    display: flex;
    align-items: center;
    padding: 0.9rem 1.1rem;
    border-radius: 0.65rem;
    border: 1px solid #E0E0E0;
    background: #fff;
    text-decoration: none !important;
    transition: all 0.2s ease;
    gap: 0.85rem;
    color: inherit !important;
  }

  .cci-card:hover {
    border-color: #034EA2;
    box-shadow: 0 4px 14px rgba(3,78,162,0.12);
    transform: translateY(-1px);
  }

  .cci-card-active {
    border-left: 4px solid #034EA2;
    padding-left: calc(1.1rem - 3px);
  }

  .cci-card:visited { color: inherit !important; }

  .cci-num {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.85rem;
    color: #fff;
    flex-shrink: 0;
  }

  .cci-card-body { flex: 1; min-width: 0; }

  .cci-card-body .title {
    font-weight: 600;
    color: #263238;
    font-size: 0.9rem;
    line-height: 1.3;
    margin: 0;
  }

  .cci-card-body .desc {
    font-size: 0.75rem;
    color: #90A4AE;
    margin: 0.15rem 0 0;
    line-height: 1.3;
  }

  .cci-card .arrow {
    color: #CFD8DC;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .cci-card:hover .arrow {
    color: #034EA2;
    transform: translateX(3px);
  }

  .cci-active-badge {
    font-size: 0.6rem;
    font-weight: 700;
    color: #fff;
    background: #034EA2;
    padding: 0.15rem 0.45rem;
    border-radius: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-left: 0.4rem;
    vertical-align: middle;
  }

  .cci-footer-note {
    text-align: center;
    padding: 1.5rem 0 0.5rem;
    font-size: 0.72rem;
    color: #B0BEC5;
    border-top: 1px solid #ECEFF1;
    margin-top: 1rem;
  }

  .cci-footer-note a {
    color: #034EA2;
    text-decoration: none;
  }
</style>

<div class="cci-hero">
  <a class="cci-logo" href="https://siop-congress.org/" target="_blank" rel="noopener">
    <img
      class="siop-wordmark"
      src="{{ site.baseurl }}/assets/img/logo-siop-2026.svg"
      alt="SIOP 2026 — San Antonio, Texas, 15–18 September"
    />
    <div class="cci-logo-text">
      <div class="subtitle">Global Health Session</div>
    </div>
  </a>

  <h1>AI at the Bedside</h1>
  <p class="tagline">A practical introduction for the whole childhood-cancer team. Companion site for the SIOP 2026 Global Health Session.</p>

  <div class="cci-qr-box">
    <img src="{{ site.baseurl }}/qr-code.png" alt="QR code to open this page" />
    <div class="cci-qr-info">
      <p class="label">Quick Access</p>
      <p class="hint">Open your phone camera and<br/>scan to bookmark this site.</p>
    </div>
  </div>
</div>

<h2 class="cci-section-title">Run of show</h2>

<div class="cci-grid">

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-00-open/">
    <div class="cci-num" style="background:#607D8B;">0</div>
    <div class="cci-card-body">
      <p class="title">Open &mdash; no conflicts, four similar tools <span class="cci-active-badge">00:00</span></p>
      <p class="desc">Disclosures, then Claude / ChatGPT / Gemini / Perplexity, then Wachter.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-01-prompting/">
    <div class="cci-num" style="background:#3F51B5;">1</div>
    <div class="cci-card-body">
      <p class="title">Prompting like a guru <span class="cci-active-badge">00:04</span></p>
      <p class="desc">Build the prompt: role, context, constraints, format.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-02-literature/">
    <div class="cci-num" style="background:#00897B;">2</div>
    <div class="cci-card-body">
      <p class="title">Reading the literature <span class="cci-active-badge">00:12</span></p>
      <p class="desc">One guideline: NotebookLM, infographic, video, artifact, mermaid.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-03-skills/">
    <div class="cci-num" style="background:#7B1FA2;">3</div>
    <div class="cci-card-body">
      <p class="title">Skills &mdash; your house style <span class="cci-active-badge">00:22</span></p>
      <p class="desc">Build one skill. Find a stats library. Open the sample-size calculator.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-04-mcp/">
    <div class="cci-num" style="background:#E65100;">4</div>
    <div class="cci-card-body">
      <p class="title">MCP &mdash; connect your own work <span class="cci-active-badge">00:29</span></p>
      <p class="desc">USB for AI. Live Haiku with and without a medical-terms plug.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-05-small-models/">
    <div class="cci-num" style="background:#C62828;">5</div>
    <div class="cci-card-body">
      <p class="title">Small models &amp; the edge <span class="cci-active-badge">00:37</span></p>
      <p class="desc">Four places a model can live. Then switch the wi-fi off and keep talking.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-06-small-app/">
    <div class="cci-num" style="background:#0277BD;">6</div>
    <div class="cci-card-body">
      <p class="title">A small app in five minutes <span class="cci-active-badge">00:43</span></p>
      <p class="desc">A prompt, a PRD, a roster app — then the stack a hospital still owes.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-07-research/">
    <div class="cci-num" style="background:#558B2F;">7</div>
    <div class="cci-card-body">
      <p class="title">AI for research <span class="cci-active-badge">00:48</span></p>
      <p class="desc">The model writes the code; you remain the author.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/block-08-learned/">
    <div class="cci-num" style="background:#21409A;">8</div>
    <div class="cci-card-body">
      <p class="title">What we learned at KHCC <span class="cci-active-badge">00:54</span></p>
      <p class="desc">People first. Then agents, with their own rules. Cybersecurity before everything else.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/closing-tasks/">
    <div class="cci-num" style="background:#00695C;">9</div>
    <div class="cci-card-body">
      <p class="title">Close &mdash; what to try on Monday <span class="cci-active-badge">00:57</span></p>
      <p class="desc">One task per role. This is the actual handout.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/companion-sessions/">
    <div class="cci-num" style="background:#F4511E;">10</div>
    <div class="cci-card-body">
      <p class="title">Companion sessions</p>
      <p class="desc">Precision medicine tool, then Q&amp;A with an AI avatar.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/preparation/">
    <div class="cci-num" style="background:#1565C0;">11</div>
    <div class="cci-card-body">
      <p class="title">Speaker preparation</p>
      <p class="desc">Pre-build checklist and the run-long fallback plan.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

</div>

<div class="cci-footer-note">
  SIOP 2026 San Antonio &middot; AI at the Bedside &middot; Global Health Session<br/>
  <a href="https://siop-congress.org/" target="_blank" rel="noopener">siop-congress.org</a>
  &nbsp;&middot;&nbsp;
  <a href="https://www.khcc.jo" target="_blank" rel="noopener">King Hussein Cancer Center</a>
</div>
