---
layout: default
title: "Block 5 — CLAUDE.md — the kitchen contract"
permalink: /block-05-5-claude-md/
---

<div class="block-page block-page-demo block-page-wide">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#6D4C41;">00:34</span>
    <span class="block-kicker">Block 5</span>
  </div>
  <h1>CLAUDE.md &mdash; the kitchen contract</h1>

  <p class="demo-lead">Skills are the recipes. MCP is the appliances. <code>CLAUDE.md</code> is the book the chef has to follow every shift &mdash; standing orders for a folder, not a new product. Drop five messy policies in. The model turns them into a wiki, then writes the quality review you can open on Monday.</p>

  <div class="demo-preset-row" id="demo-steps">
    <button type="button" class="demo-chip is-on" data-step="0">Kitchen</button>
    <button type="button" class="demo-chip" data-step="1">Contract</button>
    <button type="button" class="demo-chip" data-step="2">Drop</button>
    <button type="button" class="demo-chip" data-step="3">Wiki</button>
    <button type="button" class="demo-chip" data-step="4">Review</button>
  </div>

  <div class="demo-stage" id="stage-0">
    <p class="demo-stage-kicker">One picture, then the names</p>
    <p class="demo-stage-copy">The robot is not the point. The book on the left is. A kitchen only works if the recipes, the tools, and the standing orders agree. <code>CLAUDE.md</code> is those standing orders. It is read at the start of every session. You do not re-explain the job.</p>
    <figure class="b55-kitchen">
      <img class="demo-shot" src="{{ site.baseurl }}/assets/block-05.5/kitchen.jpg" alt="A robot chef at a stove. On the left, an open book labelled CLAUDE.MD CONTRACT. On the right, appliances labelled MCP. Skills sit with the utensils." />
      <figcaption>The book is the contract. Skills are the recipes. MCP is the plug into the appliances. The raw ingredients are whatever you drop in the folder.</figcaption>
    </figure>
  </div>

  <div class="demo-stage" id="stage-1" hidden>
    <p class="demo-stage-kicker">A short file, left in the project</p>
    <p class="demo-stage-copy">This is the whole brief. Read the folder. Make a wiki. Write a summary the quality committee can use. Do not invent a rule that is not in the files.</p>
    <pre class="demo-skill-file" tabindex="0"># Cedar Ward — standing orders

You are the unit's second brain for written policy.
This folder is a teaching copy. It is not KHCC policy.

## When files land in policies/
1. Read every document, including appendices.
2. Convert each into one wiki note in wiki/.
3. Link notes wherever they share a topic.
4. Write summary.html for the quality committee.

## The summary must include
- Inventory of the documents
- Contradictions, with the quoted sentences
- Errors, duplications, and suggestions
- Who should own each fix

## Hard rules
- Do not invent a rule that is not in the files.
- If you are unsure, say so.
- Never paste a real patient name or MRN.</pre>
    <p class="demo-open-row">
      <a class="demo-ask" href="{{ site.baseurl }}/assets/block-05.5/CLAUDE.md">Open the full CLAUDE.md</a>
    </p>
  </div>

  <div class="demo-stage" id="stage-2" hidden>
    <p class="demo-stage-kicker">Five policies, dropped in a folder</p>
    <p class="demo-stage-copy">Cedar Ward, Riverside Children&rsquo;s Cancer Centre. Made up on purpose. Five files that a real unit would recognise &mdash; and that do not agree with each other. That is the point of the exercise.</p>
    <div class="b55-files" role="list">
      <a class="b55-file" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/policies/POL-CW-01-febrile-neutropenia.md">
        <p class="code">POL-CW-01</p>
        <p class="name">Febrile neutropenia</p>
        <p class="meta">ID · Mar 2024 · ages 0–18</p>
      </a>
      <a class="b55-file" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/policies/POL-CW-02-central-line.md">
        <p class="code">POL-CW-02</p>
        <p class="name">Central lines</p>
        <p class="meta">Vascular access · Jan 2026 · under 16</p>
      </a>
      <a class="b55-file" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/policies/POL-CW-03-visitor-isolation.md">
        <p class="code">POL-CW-03</p>
        <p class="name">Visitors &amp; isolation</p>
        <p class="meta">IPC · Jun 2023 · review overdue</p>
      </a>
      <a class="b55-file" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/policies/POL-CW-04-chemo-safety.md">
        <p class="code">POL-CW-04</p>
        <p class="name">Chemo safety</p>
        <p class="meta">Pharmacy · Nov 2025 · ages 0–21</p>
      </a>
      <a class="b55-file" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/policies/POL-CW-05-discharge-fever.md">
        <p class="code">POL-CW-05</p>
        <p class="name">Discharge fever leaflet</p>
        <p class="meta">Nursing education · ID has not signed</p>
      </a>
    </div>
    <p class="demo-stage-copy">Three age bands. Two ANC cut-offs. Two first-line antibiotics. The family leaflet tells parents to wait until morning.</p>
  </div>

  <div class="demo-stage" id="stage-3" hidden>
    <p class="demo-stage-kicker">Second brain &mdash; one note per file</p>
    <p class="demo-stage-copy">A wiki note is not a rewrite. It is the rules, the links, and the open questions. Click a card for the readable hub, or open the Markdown the way Obsidian would.</p>
    <div class="b55-files" role="list">
      <a class="b55-file b55-file-wiki" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/wiki/febrile-neutropenia.md">
        <p class="code">Note</p>
        <p class="name">Febrile neutropenia</p>
        <p class="meta">Links to the leaflet that undoes it</p>
      </a>
      <a class="b55-file b55-file-wiki" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/wiki/central-line.md">
        <p class="code">Note</p>
        <p class="name">Central lines</p>
        <p class="meta">Heparin rule disagrees with itself</p>
      </a>
      <a class="b55-file b55-file-wiki" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/wiki/visitor-isolation.md">
        <p class="code">Note</p>
        <p class="name">Visitors</p>
        <p class="meta">Review overdue · unlimited adults</p>
      </a>
      <a class="b55-file b55-file-wiki" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/wiki/chemo-safety.md">
        <p class="code">Note</p>
        <p class="name">Chemo safety</p>
        <p class="meta">Warm pack on doxorubicin</p>
      </a>
      <a class="b55-file b55-file-wiki" role="listitem" href="{{ site.baseurl }}/assets/block-05.5/wiki/discharge-fever.md">
        <p class="code">Note</p>
        <p class="name">Discharge leaflet</p>
        <p class="meta">What parents take home</p>
      </a>
    </div>
    <p class="demo-open-row">
      <a class="demo-ask" href="{{ site.baseurl }}/assets/block-05.5/wiki.html">Open the wiki hub</a>
    </p>
  </div>

  <div class="demo-stage" id="stage-4" hidden>
    <p class="demo-stage-kicker">The file the committee actually opens</p>
    <p class="demo-stage-copy"><code>summary.html</code> is not a chat reply. It is a briefing: inventory, quoted contradictions, errors, duplications, and who should fix what. The first screen is the sentence families take home next to the sentence Infectious Diseases wrote.</p>
    <p class="demo-open-row">
      <a class="demo-ask" href="{{ site.baseurl }}/assets/block-05.5/summary.html" target="_blank" rel="noopener">Open summary.html</a>
    </p>
    <iframe class="demo-frame b55-summary-frame" title="Cedar Ward policy review — five documents" src="{{ site.baseurl }}/assets/block-05.5/summary.html"></iframe>
  </div>

  <div class="demo-controls">
    <button type="button" class="demo-ask" id="demo-next">Next</button>
    <p class="demo-status" id="demo-status" role="status"></p>
  </div>

  <div class="block-section">
    <h2>On screen</h2>
    <div class="callout callout-onscreen">
      Show the kitchen. Read the short <code>CLAUDE.md</code>. Name the five files. Open <a href="{{ site.baseurl }}/assets/block-05.5/summary.html">summary.html</a> on the fever disagreement &mdash; come tonight versus wait until morning.
    </div>
  </div>

  <div class="block-section">
    <h2>Take-home</h2>
    <div class="callout callout-takehome">
      A skill is a recipe. MCP is a plug. <code>CLAUDE.md</code> is the standing orders for the folder. That is how a drop of policies becomes a wiki and a quality review, instead of another chat you cannot find next week.
    </div>
  </div>

  <div class="phi-line">
    Never drop a real policy folder with patient names, staff mobile numbers, or unreleased incident detail into a consumer AI tool.
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-04-mcp/">&larr; 4 &middot; MCP — connect your own work</a>
    <a href="{{ site.baseurl }}/block-05-small-models/">6 &middot; Small models &amp; the edge &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-05-5.js"></script>
