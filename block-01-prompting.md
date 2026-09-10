---
layout: default
title: "Block 1 — Prompting like a guru"
permalink: /block-01-prompting/
---

<div class="block-page block-page-demo">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#3F51B5;">00:04</span>
    <span class="block-kicker">Block 1</span>
  </div>
  <h1>Prompting like a guru</h1>

  <div class="demo-case">
    <div class="demo-case-top">
      <span class="demo-pill">Synthetic case</span>
      <span class="demo-pill demo-pill-warn">Not a real patient</span>
    </div>
    <h2>6-year-old &mdash; fever on day 10</h2>
    <ul>
      <li>B-ALL, day 10 after intensification. Tunneled central line.</li>
      <li>Temperature 38.8°C at home for 2 hours. ANC this morning: 80 /µL.</li>
      <li>Penicillin allergy (rash). Parents ask: can we wait for the morning clinic?</li>
    </ul>
  </div>

  <div class="demo-controls">
    <div class="demo-preset-row">
      <button type="button" class="demo-chip" id="piece-role" data-piece="role">Role</button>
      <button type="button" class="demo-chip" id="piece-context" data-piece="context">Context</button>
      <button type="button" class="demo-chip" id="piece-constraints" data-piece="constraints">Constraints</button>
      <button type="button" class="demo-chip" id="piece-format" data-piece="format">Format</button>
    </div>

    <label class="demo-label" for="demo-prompt">Your prompt</label>
    <textarea id="demo-prompt" class="demo-prompt" rows="10" spellcheck="false"></textarea>

    <button type="button" class="demo-ask" id="demo-ask">Ask the model</button>
    <p class="demo-status" id="demo-status" role="status"></p>
  </div>

  <div id="demo-response-wrap" class="demo-response-wrap" hidden>
    <div class="demo-response-head">
      <span class="demo-label">Model reply</span>
    </div>
    <div id="demo-response" class="demo-response" data-tone=""></div>
  </div>

  <div class="phi-line">
    Never paste a real patient into a consumer AI tool.
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-00-open/">&larr; Open</a>
    <a href="{{ site.baseurl }}/block-02-literature/">2 &middot; Reading the literature &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-01.js"></script>
