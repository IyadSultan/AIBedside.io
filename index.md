---
layout: default
title: "AI at the Bedside — SIOP 2026"
permalink: /
---

<style>
  .page-content { padding-top: 0 !important; }

  .cci-hero {
    text-align: center;
    padding: 2.5rem 1rem 2.25rem;
    margin: 0 0 2rem;
    background: linear-gradient(180deg, #E8F1FB 0%, #ffffff 78%);
    border-bottom: 1px solid #D6E4F5;
  }

  .cci-hero .eyebrow {
    font-size: 0.78rem;
    color: #EC008C;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 0.6rem;
  }

  .cci-hero h1 {
    color: #21409A;
    font-size: 2.1rem;
    font-weight: 800;
    margin: 0 0 0.5rem;
    line-height: 1.15;
  }

  .cci-hero .tagline {
    color: #546E7A;
    font-size: 1rem;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .cci-logo {
    display: flex;
    width: fit-content;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    margin: 1.5rem auto 0;
    text-decoration: none;
  }

  .cci-logo:visited { color: inherit; }

  .cci-logo .siop-wordmark {
    display: block;
    width: min(220px, 70vw);
    height: auto;
  }

  .cci-logo .subtitle {
    font-size: 0.7rem;
    color: #607D8B;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .cci-qr-box {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 1.25rem;
    background: linear-gradient(135deg, #E8F1FB, #FDE8F4);
    border: 1px solid #B8D0EC;
    border-radius: 0.85rem;
    padding: 1rem 1.4rem;
    margin: 1.75rem auto 0;
  }

  .cci-qr-box img {
    width: 108px;
    height: 108px;
    border-radius: 0.5rem;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    image-rendering: pixelated;
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
    color: #607D8B;
    margin: 0.15rem 0 0;
    line-height: 1.4;
  }

  .cci-phone-hint {
    display: none;
    margin: 1.5rem auto 0;
    max-width: 320px;
    padding: 0.7rem 1rem;
    border: 1px solid #B8D0EC;
    border-radius: 0.65rem;
    background: #E8F1FB;
    color: #034EA2;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.45;
  }

  @media screen and (max-width: 600px) {
    .cci-qr-box { display: none; }
    .cci-phone-hint { display: block; }
    .cci-hero h1 { font-size: 1.75rem; }
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

  .cci-section-title.is-secondary {
    border-bottom-color: #B0BEC5;
    color: #455A64;
    font-size: 1rem;
  }

  .cci-grid {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 2.25rem;
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
    font-size: 0.78rem;
    color: #607D8B;
    margin: 0.15rem 0 0;
    line-height: 1.35;
  }

  .cci-time {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.75rem;
    font-weight: 600;
    color: #78909C;
    letter-spacing: 0.02em;
    flex-shrink: 0;
    min-width: 2.9rem;
    text-align: right;
  }

  .cci-card .arrow {
    color: #B0BEC5;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .cci-card:hover .arrow {
    color: #034EA2;
    transform: translateX(3px);
  }

  .cci-run-meta {
    font-size: 0.8rem;
    color: #607D8B;
    margin: -0.5rem 0 1rem;
  }

  @media screen and (max-width: 600px) {
    .cci-time { display: none; }
  }
</style>

<div class="cci-hero">
  <p class="eyebrow">SIOP 2026 &middot; Global Health Session</p>
  <h1>AI at the Bedside</h1>
  <p class="tagline">A practical introduction for the whole childhood-cancer team. One hour, ten short blocks, every demo runnable at home.</p>

  <a class="cci-logo" href="https://siop-congress.org/" target="_blank" rel="noopener">
    <img
      class="siop-wordmark"
      src="{{ site.baseurl }}/assets/img/logo-siop-2026.svg"
      alt="SIOP 2026 — San Antonio, Texas, 15–18 September"
    />
    <span class="subtitle">San Antonio &middot; 15&ndash;18 September 2026</span>
  </a>

  <div class="cci-qr-box">
    <img src="{{ site.baseurl }}/qr-code.png" alt="QR code to open this page" />
    <div class="cci-qr-info">
      <p class="label">Quick Access</p>
      <p class="hint">Open your phone camera and<br/>scan to bookmark this site.</p>
    </div>
  </div>

  <div class="cci-phone-hint">
    Keep this page: tap Share, then <strong>Add to Home Screen</strong>.
  </div>
</div>

<h2 class="cci-section-title">Run of show</h2>
<p class="cci-run-meta">Sixty minutes. Times are minutes from the start of the session.</p>

<div class="cci-grid">

  <a class="cci-card" href="{{ site.baseurl }}/block-00-open/">
    <div class="cci-num" style="background:#607D8B;">0</div>
    <div class="cci-card-body">
      <p class="title">Open &mdash; no conflicts, four similar tools</p>
      <p class="desc">Disclosures, then Claude / ChatGPT / Gemini / Perplexity, then Wachter, then Chat versus Cowork, then the real screen.</p>
    </div>
    <span class="cci-time">00:00</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-01-prompting/">
    <div class="cci-num" style="background:#3F51B5;">1</div>
    <div class="cci-card-body">
      <p class="title">Prompting like a guru</p>
      <p class="desc">Build the prompt: role, context, constraints, format.</p>
    </div>
    <span class="cci-time">00:04</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-02-literature/">
    <div class="cci-num" style="background:#00897B;">2</div>
    <div class="cci-card-body">
      <p class="title">Reading the literature</p>
      <p class="desc">One guideline: NotebookLM, infographic, video, artifact, mermaid.</p>
    </div>
    <span class="cci-time">00:12</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-03-skills/">
    <div class="cci-num" style="background:#7B1FA2;">3</div>
    <div class="cci-card-body">
      <p class="title">Skills &mdash; your house style</p>
      <p class="desc">Build one skill. Find a stats library. Open the sample-size calculator.</p>
    </div>
    <span class="cci-time">00:22</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-04-mcp/">
    <div class="cci-num" style="background:#E65100;">4</div>
    <div class="cci-card-body">
      <p class="title">MCP &mdash; connect your own work</p>
      <p class="desc">USB for AI. Live Haiku with and without a medical-terms plug.</p>
    </div>
    <span class="cci-time">00:29</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-05-5-claude-md/">
    <div class="cci-num" style="background:#6D4C41;">5</div>
    <div class="cci-card-body">
      <p class="title">CLAUDE.md &mdash; the kitchen contract</p>
      <p class="desc">Standing orders for a folder. Five policies in. A wiki and a quality review out.</p>
    </div>
    <span class="cci-time">00:34</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-05-small-models/">
    <div class="cci-num" style="background:#C62828;">6</div>
    <div class="cci-card-body">
      <p class="title">Small models &amp; the edge</p>
      <p class="desc">Four places a model can live. Fine-tune here. Federate across hospitals &mdash; scans never leave.</p>
    </div>
    <span class="cci-time">00:37</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-06-small-app/">
    <div class="cci-num" style="background:#0277BD;">7</div>
    <div class="cci-card-body">
      <p class="title">A small app in five minutes</p>
      <p class="desc">A prompt, a PRD, a roster app &mdash; then eight jobs a hospital still owes.</p>
    </div>
    <span class="cci-time">00:43</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-07-research/">
    <div class="cci-num" style="background:#558B2F;">8</div>
    <div class="cci-card-body">
      <p class="title">AI for research</p>
      <p class="desc">Plug the chat into your own Zotero library, step by step &mdash; then the model writes the code; you remain the author.</p>
    </div>
    <span class="cci-time">00:48</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/block-08-learned/">
    <div class="cci-num" style="background:#21409A;">9</div>
    <div class="cci-card-body">
      <p class="title">What we learned at KHCC</p>
      <p class="desc">People first. Then agents, with their own rules. Cybersecurity before everything else.</p>
    </div>
    <span class="cci-time">00:54</span>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/closing-tasks/">
    <div class="cci-num" style="background:#00695C;">10</div>
    <div class="cci-card-body">
      <p class="title">Close &mdash; what to try on Monday</p>
      <p class="desc">Crash cart, patient guide, six point-of-care tools. Then one task per role.</p>
    </div>
    <span class="cci-time">00:57</span>
    <span class="arrow">&#8250;</span>
  </a>

</div>

<h2 class="cci-section-title is-secondary">Also on this site</h2>

<div class="cci-grid">

  <a class="cci-card" href="{{ site.baseurl }}/companion-sessions/">
    <div class="cci-num" style="background:#F4511E;">+</div>
    <div class="cci-card-body">
      <p class="title">Companion sessions</p>
      <p class="desc">Precision medicine tool, then Q&amp;A with an AI avatar.</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

</div>
