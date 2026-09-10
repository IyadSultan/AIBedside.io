---
layout: default
title: "Block 2 — Reading the literature"
permalink: /block-02-literature/
---

<div class="block-page block-page-demo block-page-wide">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#00897B;">00:12</span>
    <span class="block-kicker">Block 2</span>
  </div>
  <h1>Reading the literature</h1>

  <a class="demo-paper" href="https://ascopubs.org/doi/pdf/10.1200/JCO.22.02224" target="_blank" rel="noopener">
    <span class="demo-pill">JCO 2023</span>
    <p class="title">Guideline for the Management of Fever and Neutropenia in Pediatric Patients With Cancer and HCT Recipients: 2023 Update</p>
    <p class="desc">Lehrnbecher et al. &middot; J Clin Oncol. 2023;41(9):1774-1785 &middot; 10.1200/JCO.22.02224</p>
  </a>

  <div class="demo-preset-row" id="demo-steps">
    <button type="button" class="demo-chip is-on" data-step="0">Paper</button>
    <button type="button" class="demo-chip" data-step="1">Upload</button>
    <button type="button" class="demo-chip" data-step="2">Notebook</button>
    <button type="button" class="demo-chip" data-step="3">Infographic</button>
    <button type="button" class="demo-chip" data-step="4">Video</button>
    <button type="button" class="demo-chip" data-step="5">Artifact</button>
    <button type="button" class="demo-chip" data-step="6">Mermaid</button>
  </div>

  <div class="demo-stage" id="stage-0"></div>

  <div class="demo-stage" id="stage-1" hidden>
    <p class="demo-stage-kicker">NotebookLM &mdash; new notebook</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-02/notebooklm-empty.png" alt="Empty NotebookLM notebook, ready to add a source" />
  </div>

  <div class="demo-stage" id="stage-2" hidden>
    <p class="demo-stage-kicker">After the PDF is in</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-02/notebooklm-loaded.png" alt="NotebookLM with the 2023 fever and neutropenia guideline loaded" />
  </div>

  <div class="demo-stage" id="stage-3" hidden>
    <p class="demo-stage-kicker">Studio &mdash; Infographic</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-02/infographic.jpg" alt="Infographic of the 2023 pediatric fever and neutropenia algorithm" />
  </div>

  <div class="demo-stage" id="stage-4" hidden>
    <p class="demo-stage-kicker">Studio &mdash; Video overview</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-02/notebooklm-loaded.png" alt="NotebookLM studio with Video overview generating" />
  </div>

  <div class="demo-stage" id="stage-5" hidden>
    <p class="demo-stage-kicker">Paper to artifact</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-02/artifact.png" alt="Claude prompt: convert this paper to an artifact using the paper-to-artifact skill" />
    <p class="demo-open-row">
      <a class="demo-ask" href="{{ site.baseurl }}/assets/artifact/fn-guideline.html" target="_blank" rel="noopener">Open the artifact</a>
    </p>
    <iframe class="demo-frame" title="Interactive 2023 fever and neutropenia guideline explainer" src="{{ site.baseurl }}/assets/artifact/fn-guideline.html"></iframe>
  </div>

  <div class="demo-stage" id="stage-6" hidden>
    <p class="demo-stage-kicker">Mermaid connector</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-02/mermaid-prompt.png" alt="Claude prompt: convert to a mermaid diagram using mermaid connector" />
    <div class="demo-mermaid" id="fn-mermaid"></div>
  </div>

  <div class="demo-controls">
    <button type="button" class="demo-ask" id="demo-next">Next</button>
    <p class="demo-status" id="demo-status" role="status"></p>
  </div>

  <div class="phi-line">
    Never paste a real patient into a consumer AI tool.
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-01-prompting/">&larr; 1 &middot; Prompting like a guru</a>
    <a href="{{ site.baseurl }}/block-03-skills/">3 &middot; Skills — your house style &rarr;</a>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script src="{{ site.baseurl }}/assets/js/block-02.js"></script>
