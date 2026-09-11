---
layout: default
title: "Roster Builder — PRD"
permalink: /block-06-small-app/prd/
---

<div class="block-page prd-read">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#0277BD;">Block 7</span>
    <span class="block-kicker">Product requirements</span>
  </div>

  <p class="prd-back"><a href="{{ site.baseurl }}/block-06-small-app/">&larr; Back to the five-minute app</a></p>

  <p class="demo-lead">This is the brief the <code>prd-builder</code> skill wrote from the nurse-call prompt. It is a draft. The open questions at the end are still open.</p>

  <article class="prd-doc">
{% capture prd_src %}{% include_relative assets/block-06/roster-builder-PRD.md %}{% endcapture %}
{{ prd_src | markdownify }}
  </article>

  <p class="demo-stage-copy">Ready to try? Copy this brief, open <a href="https://replit.com/" target="_blank" rel="noopener">Replit</a>, and paste it into the prompt. Replit is easy and cheap enough for a first version &mdash; not HIPAA, not free, not the ward on Monday.</p>

  <p class="demo-open-row b6-open-row">
    <a class="demo-ask" href="https://replit.com/" target="_blank" rel="noopener">Open Replit &mdash; paste the PRD</a>
    <button type="button" class="demo-ask b6-ask-secondary" id="b6-copy-prd" data-prd="{{ site.baseurl }}/assets/block-06/roster-builder-PRD.md">Copy the PRD</button>
    <a class="demo-ask b6-ask-secondary" href="{{ site.baseurl }}/assets/block-06/roster-builder-PRD.md" download="roster-builder-PRD.md">Download the PRD as Markdown</a>
  </p>
  <p class="demo-status" id="b6-prd-status" role="status"></p>

  <script src="{{ site.baseurl }}/assets/js/block-06.js"></script>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-06-small-app/">&larr; 7 &middot; A small app in five minutes</a>
    <a href="{{ site.baseurl }}/block-07-research/">8 &middot; AI for research &rarr;</a>
  </div>
</div>
