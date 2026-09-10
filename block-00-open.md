---
layout: default
title: "Open — the same question, asked twice"
permalink: /block-00-open/
---

<div class="block-page block-page-demo">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#607D8B;">00:00</span>
    <span class="block-kicker">Open</span>
  </div>
  <h1>The same question, asked twice</h1>

  <div class="demo-case">
    <div class="demo-case-top">
      <span class="demo-pill">Synthetic case</span>
      <span class="demo-pill demo-pill-warn">Not a real patient</span>
    </div>
    <h2>Lina K., 6 years &mdash; fever on day 10</h2>
    <ul>
      <li>B-ALL, day 10 after intensification. Tunneled central line.</li>
      <li>Temperature 38.8°C at home for 2 hours. ANC this morning: 80 /µL.</li>
      <li>Penicillin allergy (rash). Parents ask: can we wait for the morning clinic?</li>
    </ul>
  </div>

  <div class="demo-controls">
    <div class="demo-preset-row">
      <button type="button" class="demo-chip" id="load-lazy">1 &middot; Load lazy prompt</button>
      <button type="button" class="demo-chip demo-chip-good" id="load-briefing">2 &middot; Load a briefing</button>
    </div>

    <label class="demo-label" for="demo-prompt">Your prompt</label>
    <textarea id="demo-prompt" class="demo-prompt" rows="8" spellcheck="false"></textarea>

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
    <a href="{{ site.baseurl }}/">&larr; Run of show</a>
    <a href="{{ site.baseurl }}/block-01-prompting/">1 &middot; Prompting like a guru &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-00.js"></script>
