---
layout: default
title: "Block 6 — A small app in five minutes"
permalink: /block-06-small-app/
---

{% assign replit_url = "https://roster-builder-iyadsultan.replit.app/" %}

<div class="block-page block-page-demo block-page-wide">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#0277BD;">00:43</span>
    <span class="block-kicker">Block 6</span>
  </div>
  <h1>A small app in five minutes</h1>

  <p class="demo-lead">A saved skill writes the brief. The brief writes the app. You still own the rules. This is how a head nurse&rsquo;s monthly headache becomes something you can show IT on Monday.</p>

  <figure class="b6-hero">
    <a class="b6-app-shot" href="{{ replit_url }}" target="_blank" rel="noopener">
      <img class="demo-shot" src="{{ site.baseurl }}/assets/block-06/roster-builder.png" alt="Roster Builder overview for Cedar Ward: capacity looks workable, generate 10 candidates" />
    </a>
    <figcaption>Roster Builder, live &mdash; Cedar Ward, April 2026. Click the picture to open the app.</figcaption>
  </figure>

  <div class="demo-preset-row" id="demo-steps">
    <button type="button" class="demo-chip is-on" data-step="0">Path</button>
    <button type="button" class="demo-chip" data-step="1">Prompt</button>
    <button type="button" class="demo-chip" data-step="2">Skill</button>
    <button type="button" class="demo-chip" data-step="3">PRD</button>
    <button type="button" class="demo-chip" data-step="4">App</button>
    <button type="button" class="demo-chip" data-step="5">Still</button>
  </div>

  <div class="demo-stage" id="stage-0">
    <p class="demo-stage-kicker">Five beats. Do not skip the last one.</p>
    <p class="demo-stage-copy">Block 1 taught the prompt. Block 3 gave you <code>prd-builder</code>. Here they earn their keep: a nurse call roster, written as a product brief, then handed to a builder. Five minutes gets you a prototype. A hospital still owes the rest.</p>
    <div class="b6-beats" role="list">
      <article class="b6-beat" role="listitem">
        <p class="n">1 &middot; Prompt</p>
        <p>Name the job. Name the input. Name the constraint. Ask it not to guess.</p>
      </article>
      <article class="b6-beat" role="listitem">
        <p class="n">2 &middot; Skill</p>
        <p>The skill asks the missing pieces before it writes a word.</p>
      </article>
      <article class="b6-beat" role="listitem">
        <p class="n">3 &middot; PRD</p>
        <p>Who it is for. What it must do. What it must never do.</p>
      </article>
      <article class="b6-beat" role="listitem">
        <p class="n">4 &middot; App</p>
        <p>Ten candidate rosters, ranked, on Replit.</p>
      </article>
      <article class="b6-beat" role="listitem">
        <p class="n">5 &middot; Still</p>
        <p>Screens, server, locks, store, who may look. And no raw patient IDs.</p>
      </article>
    </div>
    <p class="demo-stage-copy">The app is the proof. The PRD is the thing you keep. The last beat is what IT will ask you on Monday.</p>
  </div>

  <div class="demo-stage" id="stage-1" hidden>
    <p class="demo-stage-kicker">On Claude.ai &mdash; prd-builder on</p>
    <p class="demo-stage-copy">Customize &rarr; Skills &rarr; turn on <strong>prd-builder</strong> (download it on the next step if you do not have it). Paste this. The last sentence is the Block 1 habit: do not let it invent the rest.</p>
    <pre class="demo-skill-file" id="b6-prompt" tabindex="0">Write a PRD for a nurse call-scheduling tool.

Input: a list of nurses with name, seniority level, the maximum number of call shifts each can take, and the October dates they've asked not to be on duty.

The tool should generate ten or more candidate call schedules and rank them on how evenly they distribute workload — total shifts, day versus night, and weekends — and on how many of the requested days off they satisfy.

Constraint: keep the patient-to-nurse ratio at 4 patients per nurse per shift. The unit holds 20 patients on weekdays and 15 on weekends.

Ask me if anything is unclear.</pre>
    <p class="demo-open-row">
      <button type="button" class="demo-ask" id="b6-copy">Copy the prompt</button>
    </p>
  </div>

  <div class="demo-stage" id="stage-2" hidden>
    <p class="demo-stage-kicker">The skill from Block 3</p>
    <p class="demo-stage-copy">A short prompt is not a spec. <code>prd-builder</code> stops and asks. These are the questions that turned &ldquo;day versus night&rdquo; into a real unit roster.</p>
    <div class="b6-ask-list">
      <article class="b6-ask">
        <p class="q">How many shifts in a day?</p>
        <p class="a">Three 8-hour shifts: Morning 07:00&ndash;15:00, Evening 15:00&ndash;23:00, Night 23:00&ndash;07:00. Not two.</p>
      </article>
      <article class="b6-ask">
        <p class="q">Are requested days off a hard block?</p>
        <p class="a">No. Requested off is a preference. Approved leave is a hard block &mdash; never schedule through it.</p>
      </article>
      <article class="b6-ask">
        <p class="q">Must every shift have a senior nurse?</p>
        <p class="a">Yes. A candidate that leaves a shift without a Senior is never shown.</p>
      </article>
    </div>
    <p class="demo-stage-copy" style="margin-top:0.85rem;">Download the same skill you met in Block 3. Upload it once. Then the prompt above is enough.</p>
    <div class="demo-skill-pack" style="grid-template-columns:1fr;">
      <a class="demo-skill-card" href="{{ site.baseurl }}/assets/SKILLS/prd-builder.skill" download="prd-builder.skill">
        <p class="name">prd-builder</p>
        <p class="brief">Turns a messy ask into a product requirements document. It asks before it guesses. Same file as Block 3.</p>
        <p class="get">Download .skill</p>
      </a>
    </div>
  </div>

  <div class="demo-stage" id="stage-3" hidden>
    <p class="demo-stage-kicker">What the skill wrote</p>
    <p class="demo-stage-copy"><strong>Roster Builder</strong> &mdash; a small Django app for one unit. The head nurse types the staff list, marks leave, and gets ten legal October schedules, ranked on coverage, fairness, and requests honoured. Export to Excel or PDF. No patient names anywhere. Census is just a number.</p>

    <div class="b6-demand" aria-label="October 2026 staffing demand">
      <div class="b6-demand-cell">
        <p class="k">Weekday</p>
        <p class="v">20 patients</p>
        <p class="s">5 nurses &times; 3 shifts &times; 22 days</p>
      </div>
      <div class="b6-demand-cell">
        <p class="k">Weekend</p>
        <p class="v">15 patients</p>
        <p class="s">4 nurses &times; 3 shifts &times; 9 days</p>
      </div>
      <div class="b6-demand-cell b6-demand-total">
        <p class="k">October 2026</p>
        <p class="v">438</p>
        <p class="s">nurse-shifts to fill</p>
      </div>
    </div>
    <p class="demo-stage-copy">At a 21-shift cap you need about 21 nurses with no leave &mdash; realistically 24 or more. Senior cover on all 93 shifts is usually the binding constraint, not headcount.</p>

    <div class="b6-rules">
      <div class="b6-rule b6-rule-hard">
        <p class="k">Never break</p>
        <ul>
          <li>No one works approved leave</li>
          <li>One shift per nurse per day</li>
          <li>Stay under the monthly cap</li>
          <li>A Senior on every shift</li>
          <li>Night &rarr; off the next calendar day</li>
          <li>No evening then next morning</li>
          <li>No more than 5 days in a row</li>
        </ul>
      </div>
      <div class="b6-rule b6-rule-soft">
        <p class="k">Rank on these</p>
        <ul>
          <li>Requested days off honoured</li>
          <li>Even share of total shifts</li>
          <li>Even nights</li>
          <li>Even weekends</li>
        </ul>
        <p class="note">A schedule that breaks a hard rule is not a candidate. Soft rules are scored, not guaranteed.</p>
      </div>
    </div>

    <p class="demo-open-row b6-open-row">
      <a class="demo-ask" href="{{ site.baseurl }}/block-06-small-app/prd/">Read the full PRD</a>
      <a class="demo-ask b6-ask-secondary" href="{{ site.baseurl }}/assets/block-06/roster-builder-PRD.md" download="roster-builder-PRD.md">Download .md</a>
    </p>
  </div>

  <div class="demo-stage" id="stage-4" hidden>
    <p class="demo-stage-kicker">Then hand the PRD to a builder</p>
    <p class="demo-stage-copy">Replit (or Claude, or Cursor) reads the brief and produces a clickable tool. Five minutes is the demo. The week of checking it against a real month is still yours.</p>

    <div class="b6-app">
      <p class="b6-app-pin">Live on Replit</p>
      <h2>Roster Builder</h2>
      <p class="b6-app-meta">Cedar Ward &middot; April 2026 &middot; 10 candidates &middot; no patient names</p>
      <ul class="b6-app-points">
        <li>Staff list, requested days off, and approved leave are already in.</li>
        <li>Capacity is green. Generate ten candidates. Compare. Export.</li>
        <li>Manual edits belong in Excel. The app is the first draft you can defend.</li>
      </ul>
      <p class="demo-open-row b6-open-row">
        <a class="demo-ask" href="{{ replit_url }}" target="_blank" rel="noopener">Open Roster Builder</a>
      </p>
    </div>
  </div>

  <div class="demo-stage" id="stage-5" hidden>
    <p class="demo-stage-kicker">What five minutes did not buy you</p>
    <p class="demo-stage-copy">A quick app still has five jobs. Skip one and you have a demo, not a hospital tool. Roster Builder is the conversation with IT. These five are the work after the conversation.</p>

    <div class="b6-stack" role="list">
      <article class="b6-stack-card" role="listitem">
        <p class="n">1</p>
        <h2>Front end</h2>
        <p>The screens people click. Buttons, the calendar, the list of ten rosters. If a head nurse cannot read it from a ward computer, it is not done.</p>
      </article>
      <article class="b6-stack-card" role="listitem">
        <p class="n">2</p>
        <h2>Back end</h2>
        <p>The hidden work. Saving the staff list. Running the generator. Building the Excel file. The browser is not enough.</p>
      </article>
      <article class="b6-stack-card" role="listitem">
        <p class="n">3</p>
        <h2>Security</h2>
        <p>Locks. Encrypted traffic. No passwords in the code. A log of who opened what. A clever tool that leaks a name is not a clever tool.</p>
      </article>
      <article class="b6-stack-card" role="listitem">
        <p class="n">4</p>
        <h2>Database</h2>
        <p>Where the lists live after you close the tab. Staff, leave, last month&rsquo;s roster. A file on someone&rsquo;s laptop is not a database.</p>
      </article>
      <article class="b6-stack-card" role="listitem">
        <p class="n">5</p>
        <h2>Who may look</h2>
        <p>An admin decides which people see which pages. The head nurse sees Cedar Ward. Not every ward. A staff nurse may see only their own row. This is authorization &mdash; permission, not just a login.</p>
      </article>
    </div>

    <p class="demo-stage-kicker" style="margin-top:1.35rem;">If the app holds patient data</p>
    <p class="demo-stage-copy">HIPAA in the US, GDPR in Europe, and your own national law all say the same first move: do not store the real identifier. Swap it for a token the hospital vault can map back, and the app cannot. Names, dates of birth, national IDs, and medical record numbers all count. This example is made up.</p>

    <div class="b6-deid" aria-label="De-identification example">
      <p class="k">De-identify before it lands in the app</p>
      <div class="b6-deid-row">
        <div class="b6-deid-id">
          <p class="lab">What you must not store</p>
          <p class="val">142-04-6697</p>
          <p class="hint">US Social Security number &mdash; or your local national ID</p>
        </div>
        <p class="b6-deid-arrow" aria-hidden="true">becomes</p>
        <div class="b6-deid-id b6-deid-token">
          <p class="lab">What the database holds</p>
          <p class="val">34321226754342423</p>
          <p class="hint">A token. Only the hospital vault knows the pairing.</p>
        </div>
      </div>
      <p class="note">Roster Builder sidesteps this on purpose: census is a number, not a patient list. Staff names and leave are still personal data. The moment you add an MRN, this swap is required.</p>
    </div>
  </div>

  <div class="demo-controls">
    <button type="button" class="demo-ask" id="demo-next">Next</button>
    <p class="demo-status" id="demo-status" role="status"></p>
  </div>

  <div class="block-section">
    <h2>On screen</h2>
    <div class="callout callout-onscreen">
      Paste the prompt with prd-builder on. Open the PRD. Open <a href="https://roster-builder-iyadsultan.replit.app/" target="_blank" rel="noopener">Roster Builder</a>. Then land on <strong>Still</strong>: five jobs a hospital app still owes, and the token that replaces a real ID.
    </div>
  </div>

  <div class="block-section">
    <h2>Take-home</h2>
    <div class="callout callout-takehome">
      Write the brief first. A prototype starts the conversation with IT; it does not replace a front end, a back end, a database, security, or an admin who decides who sees which page. Patient IDs go in as tokens, not as the real number.
    </div>
  </div>

  <div class="block-section">
    <h2>If you run long</h2>
    <div class="callout callout-note">
      At 00:43, skip the Replit click if you must, but keep <strong>Still</strong> &mdash; the five jobs and the de-identification swap. That is the part most of the room can use on Monday. Protect Block 7.
    </div>
  </div>

  <div class="phi-line">
    Never paste a real staff roster &mdash; names, leave dates, employee numbers &mdash; into a consumer cloud builder unless your hospital has already said that hosting is allowed.
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-05-small-models/">&larr; 5 &middot; Small models &amp; the edge</a>
    <a href="{{ site.baseurl }}/block-07-research/">7 &middot; AI for research &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-06.js"></script>
