---
layout: default
title: "Block 3 — Skills — your house style"
permalink: /block-03-skills/
---

<div class="block-page block-page-demo block-page-wide">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#7B1FA2;">00:22</span>
    <span class="block-kicker">Block 3</span>
  </div>
  <h1>Skills &mdash; your house style</h1>

  <p class="demo-lead">A skill is a prompt you save once and run with <code>/name</code>. We follow the same path as the <a href="https://www.youtube.com/watch?v=O_z9vDLgvoY" target="_blank" rel="noopener">Claude Skills tutorial</a> &mdash; build, run, share &mdash; on a childhood-cancer ward thread, not an office inbox.</p>

  <div class="demo-preset-row" id="demo-steps">
    <button type="button" class="demo-chip is-on" data-step="0">What</button>
    <button type="button" class="demo-chip" data-step="1">Ask</button>
    <button type="button" class="demo-chip" data-step="2">File</button>
    <button type="button" class="demo-chip" data-step="3">Test</button>
    <button type="button" class="demo-chip" data-step="4">Run</button>
    <button type="button" class="demo-chip" data-step="5">Everywhere</button>
    <button type="button" class="demo-chip" data-step="6">Share</button>
  </div>

  <div class="demo-stage" id="stage-0">
    <p class="demo-stage-kicker">On Claude.ai &mdash; no paid plan</p>
    <p class="demo-stage-copy">Sidebar &rarr; <strong>Customize</strong> &rarr; <strong>Skills</strong>. A skill is a Markdown file: a prompt, plus a short header that names it. Simple ones are only text. Fancier ones can carry a bit of code, the way an annual-report skill can run a table. Either way, it is a saved briefing, not a new product.</p>
  </div>

  <div class="demo-stage" id="stage-1" hidden>
    <p class="demo-stage-kicker">Create with Claude</p>
    <p class="demo-stage-copy">Plus &rarr; Create skill &rarr; Create with Claude. Paste this. The last sentence stops it guessing.</p>
    <pre class="demo-skill-file" tabindex="0">Given a long email or WhatsApp thread among our childhood-cancer team — consultant, registrar, CNC, pharmacist — summarize the main points, list action items by role, and draft a reply in our unit voice. Do not invent patients, labs, or decisions. What else should I clarify?</pre>
    <p class="demo-stage-copy">When it asks about triggers: pick the slash name. Auto-detect is getting better. Slash is what you can trust on stage.</p>
  </div>

  <div class="demo-stage" id="stage-2" hidden>
    <p class="demo-stage-kicker">Front matter, then the prompt</p>
    <p class="demo-stage-copy">The yellow block at the top is the label. The rest is the briefing. Claude only loads this file when the skill is on.</p>
    <pre class="demo-skill-file" tabindex="0">---
name: ward-thread
description: Summarize a team thread, list actions by role, draft a reply in unit voice.
---

You are helping a pediatric oncology clinician catch up on a long thread.

Rules:
- Use only what is in the thread. If a lab or decision is missing, say so.
- No real names, MRNs, or dates of birth in the output.
- Voice: short sentences, no "I hope this email finds you well."
- End with action items grouped as Consultant / Registrar / CNC / Pharmacy.

Output:
1. Five-line summary
2. Action items
3. Two draft replies — one to the team, one the CNC can send to the family</pre>
  </div>

  <div class="demo-stage" id="stage-3" hidden>
    <p class="demo-stage-kicker">Test on a synthetic thread</p>
    <div class="demo-case">
      <div class="demo-case-top">
        <span class="demo-pill">Synthetic thread</span>
        <span class="demo-pill demo-pill-warn">Not a real patient</span>
      </div>
      <h2>WhatsApp &mdash; night registrar, CNC, pharmacy</h2>
      <ul>
        <li>Registrar: 6 yo B-ALL, day 10, fever 38.8 at home 2 h, line in, ANC 80 this morning. Parents ask to wait until clinic.</li>
        <li>CNC: I can call them now. Do we bring them in tonight?</li>
        <li>Pharmacy: penicillin rash on file. Confirm if we still use our FN first-line.</li>
        <li>Consultant: do not wait. Cultures, then antibiotics. I will see them in ER.</li>
      </ul>
    </div>
    <div class="demo-skill-result">
      <p><strong>Summary.</strong> High-risk FN. Family wanted to wait. Team agrees: come in now, cultures, then first-line covering the rash.</p>
      <p><strong>Actions.</strong> Consultant &mdash; ER. Registrar &mdash; cultures, then antibiotics. CNC &mdash; call the family. Pharmacy &mdash; first-line that respects the rash.</p>
      <p><strong>Draft to family.</strong> Please come to ER tonight. We need cultures and antibiotics the same evening. This is the safe plan after a fever on treatment.</p>
    </div>
    <p class="demo-stage-copy">The real work is the feedback you type next. &ldquo;Do not sign off with Best&rdquo; is a skill update, not a new skill.</p>
  </div>

  <div class="demo-stage" id="stage-4" hidden>
    <p class="demo-stage-kicker">Save, then slash</p>
    <p class="demo-stage-copy">Save skill. Three dots &rarr; Try in chat. Type <code>/ward-thread</code>, paste the thread, send. If it keeps asking questions, say &ldquo;Create the skill.&rdquo;</p>
    <p class="demo-stage-copy">Long prompts are not sitting in every chat. They load only when you trigger them. That is why twenty skills do not drown one conversation.</p>
  </div>

  <div class="demo-stage" id="stage-5" hidden>
    <p class="demo-stage-kicker">Chat, Cowork, Claude Code</p>
    <p class="demo-stage-copy">Install Claude Desktop and the same skill is already there. You do not install it three times.</p>
    <ul class="demo-skill-list">
      <li><strong>Chat</strong> &mdash; slash, paste the thread, go.</li>
      <li><strong>Cowork</strong> &mdash; point it at a local folder (unit SOP, house voice, last month&rsquo;s report). The skill can use that folder as context.</li>
      <li><strong>Claude Code</strong> &mdash; skills live in <code>.claude/skills/ward-thread/</code>. Download from the web app as a zip, drop in that folder, start a new session.</li>
    </ul>
    <p class="demo-stage-copy">In Code, <code>/</code> will not list web skills until you copy the folder. Global skills are for every project on your laptop. Project skills stay with the folder you share.</p>
  </div>

  <div class="demo-stage" id="stage-6" hidden>
    <p class="demo-stage-kicker">Four ways to share &mdash; one to avoid</p>
    <div class="demo-share-grid">
      <div class="demo-share demo-share-avoid">
        <p class="k">Zip file</p>
        <p>Works once. Then you have two copies. The next edit splits the team.</p>
      </div>
      <div class="demo-share">
        <p class="k">Organization skills</p>
        <p>Claude Team or Enterprise. Admin uploads once. Everyone can run it. They cannot edit it.</p>
      </div>
      <div class="demo-share">
        <p class="k">Shared folder</p>
        <p>Cowork on a synced drive, plus a <code>CLAUDE.md</code> that points at the skills. Fiddly. Useful if you have no Team plan.</p>
      </div>
      <div class="demo-share">
        <p class="k">Git</p>
        <p>Skills are text. Version history means you can undo the edit that made it worse.</p>
      </div>
    </div>
    <div class="callout callout-takehome">
      A skill is your SOP written once, applied every time.
    </div>
  </div>

  <div class="demo-controls">
    <button type="button" class="demo-ask" id="demo-next">Next</button>
    <p class="demo-status" id="demo-status" role="status"></p>
  </div>

  <h2 class="demo-stage-kicker" style="margin-top:2rem;">Four skills you can take home</h2>
  <p class="demo-stage-copy">Download the <code>.skill</code> file. On Claude.ai: Customize &rarr; Skills &rarr; plus &rarr; Upload a skill. Same zip works in Claude Code if you drop the folder into <code>.claude/skills/</code>.</p>

  <div class="demo-skill-pack">
    <a class="demo-skill-card" href="{{ site.baseurl }}/assets/SKILLS/paper-to-artifact.skill" download="paper-to-artifact.skill">
      <p class="name">paper-to-artifact</p>
      <p class="brief">Turns a paper into a clickable explainer &mdash; the same move as the fever-and-neutropenia artifact in Block 2.</p>
      <p class="get">Download .skill</p>
    </a>
    <a class="demo-skill-card" href="{{ site.baseurl }}/assets/SKILLS/peer-review.skill" download="peer-review.skill">
      <p class="name">peer-review</p>
      <p class="brief">A structured review of a manuscript or grant: methods, statistics, and reporting checklists such as CONSORT or STROBE.</p>
      <p class="get">Download .skill</p>
    </a>
    <a class="demo-skill-card" href="{{ site.baseurl }}/assets/SKILLS/prd-builder.skill" download="prd-builder.skill">
      <p class="name">prd-builder</p>
      <p class="brief">Turns messy notes or a meeting transcript into a product requirements document &mdash; clinical or generic.</p>
      <p class="get">Download .skill</p>
    </a>
    <a class="demo-skill-card" href="{{ site.baseurl }}/assets/SKILLS/scientific-writing.skill" download="scientific-writing.skill">
      <p class="name">scientific-writing</p>
      <p class="brief">Drafts a paper, review, or grant with real citations, instead of a generic chat reply.</p>
      <p class="get">Download .skill</p>
    </a>
  </div>

  <h2 class="demo-stage-kicker" style="margin-top:2.25rem;">Find a skill the way you find a paper</h2>
  <p class="demo-lead">You do not have to write every skill. Search Google, open a library, ask Claude which statistics skills to install, then run one. That last step built the sample-size calculator below.</p>

  <div class="demo-preset-row" id="find-steps">
    <button type="button" class="demo-chip is-on" data-step="0">Search</button>
    <button type="button" class="demo-chip" data-step="1">Library</button>
    <button type="button" class="demo-chip" data-step="2">Ask</button>
    <button type="button" class="demo-chip" data-step="3">Findings</button>
    <button type="button" class="demo-chip" data-step="4">Artifact</button>
  </div>

  <div class="demo-stage" id="find-stage-0">
    <p class="demo-stage-kicker">Google &mdash; same habit as a literature search</p>
    <p class="demo-stage-copy">Type a plain search. Skills live in public GitHub folders. You are not looking for an app to buy.</p>
    <div class="demo-search" aria-hidden="true">
      <p class="demo-search-brand">Google</p>
      <div class="demo-search-bar">
        <span class="demo-search-icon" aria-hidden="true"></span>
        <span>scientific agent skills github</span>
      </div>
    </div>
    <a class="demo-search-result" href="https://github.com/k-dense-ai/scientific-agent-skills" target="_blank" rel="noopener">
      <p class="url">https://github.com/k-dense-ai/scientific-agent-skills</p>
      <p class="title">Scientific Agent Skills</p>
      <p class="blurb">164 ready-to-use scientific skills for Claude, Cursor, and other AI agents &mdash; statistics, survival analysis, genomics, writing, and more.</p>
    </a>
    <p class="demo-stage-copy">Other searches that work: <code>claude scientific skills</code>, <code>agent skills statistics</code>, <code>claude skills sample size</code>.</p>
  </div>

  <div class="demo-stage" id="find-stage-1" hidden>
    <p class="demo-stage-kicker">The library that search finds</p>
    <p class="demo-stage-copy">K-Dense&rsquo;s <a href="https://github.com/k-dense-ai/scientific-agent-skills" target="_blank" rel="noopener">Scientific Agent Skills</a> is a public collection: statistics, survival, papers, protocols. Same skill format you just built. Do not install all 164. Ask which three you need.</p>
    <a class="demo-repo" href="https://github.com/k-dense-ai/scientific-agent-skills" target="_blank" rel="noopener">
      <span class="demo-pill">GitHub</span>
      <p class="title">Scientific Agent Skills</p>
      <p class="desc">k-dense-ai/scientific-agent-skills &middot; 164 skills &middot; MIT &middot; works with Claude, Cursor, Codex</p>
    </a>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-03/scientific-skills-github.png" alt="GitHub page for Scientific Agent Skills, a public library of 164 scientific skills" />
  </div>

  <div class="demo-stage" id="find-stage-2" hidden>
    <p class="demo-stage-kicker">Ask Claude which statistics skills to install</p>
    <p class="demo-stage-copy">Paste the library link. Ask for a ranking, not a dump. Name the work you actually do.</p>
    <pre class="demo-skill-file" tabindex="0">I do pediatric oncology research. Look at https://github.com/k-dense-ai/scientific-agent-skills and tell me the best statistics skills to install first.

I need:
1. the right test for my data
2. a sample size before I start a study
3. survival analysis — EFS, OS, competing risks

Rank the top three and say why. Do not install everything.</pre>
  </div>

  <div class="demo-stage" id="find-stage-3" hidden>
    <p class="demo-stage-kicker">What Claude picked &mdash; install these three</p>
    <p class="demo-stage-copy">Not 164 skills. Three. Each one is a saved briefing plus a bit of code, the same shape as the ward-thread skill.</p>
    <ol class="demo-find-list">
      <li>
        <p class="name">statistical-analysis</p>
        <p>Picks the right test, checks assumptions first, reports effect size with the p-value. Stops you running a t-test on skewed data with n=14.</p>
      </li>
      <li>
        <p class="name">statistical-power</p>
        <p>Answers &ldquo;how many patients do I need?&rdquo; before you start. Also the reverse: with this n, what is the smallest effect you could actually detect.</p>
      </li>
      <li>
        <p class="name">scikit-survival</p>
        <p>Survival with censoring handled properly. For this audience: EFS, OS, relapse with death as a competing risk.</p>
      </li>
    </ol>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-03/stats-findings.png" alt="Claude ranking: statistical-analysis, statistical-power, and scikit-survival as the three statistics skills to install first" />
    <p class="demo-stage-copy" style="margin-top:0.85rem;">Then: &ldquo;proceed with installation in this folder.&rdquo; Twenty-six files land in <code>.claude/skills/</code>. They only load in that project unless you copy them to your global skills folder.</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-03/stats-installed.png" alt="Claude confirming the three statistics skills were installed in the project skills folder" />
  </div>

  <div class="demo-stage" id="find-stage-4" hidden>
    <p class="demo-stage-kicker">One skill, one artifact</p>
    <p class="demo-stage-copy">The skill is installed. You do not re-explain statistics. You ask for the thing you need.</p>
    <img class="demo-shot" src="{{ site.baseurl }}/assets/block-03/power-artifact-prompt.png" alt="Prompt: using the statistical-power skill, build an interactive sample-size calculator for different study designs, with beginner explanations" />
    <p class="demo-open-row">
      <a class="demo-ask" href="https://claude.ai/code/artifact/0ad6694b-6508-40dc-b621-4deb7d636748" target="_blank" rel="noopener">Open the sample-size artifact</a>
    </p>
    <p class="demo-stage-copy">It opens on Claude&rsquo;s site. Interactive calculator, several study designs, written for someone who is not a statistician. The skill did the formulas. You still own the protocol.</p>
    <div class="callout callout-takehome">
      Search &rarr; pick a library &rarr; ask which three &rarr; run one. That is how a skill becomes a tool.
    </div>
  </div>

  <div class="demo-controls">
    <button type="button" class="demo-ask" id="find-next">Next</button>
    <p class="demo-status" id="find-status" role="status"></p>
  </div>

  <div class="phi-line">
    Never paste a real patient thread &mdash; names, MRNs, photos &mdash; into a consumer AI tool.
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-02-literature/">&larr; 2 &middot; Reading the literature</a>
    <a href="{{ site.baseurl }}/block-04-mcp/">4 &middot; MCP — connect your own work &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-03.js"></script>
