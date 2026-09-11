---
layout: default
title: "Block 7 — AI for research"
permalink: /block-07-research/
---

<div class="block-page block-page-demo block-page-wide">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#558B2F;">00:48</span>
    <span class="block-kicker">Block 7</span>
  </div>
  <h1>AI for research</h1>

  <p class="demo-lead">Your Zotero library is the one reading list you already trust. Block 4 gave you the plug. This is the plug going into Zotero, on your own laptop, in about ten minutes &mdash; so the chat can search <em>your</em> papers, not the internet&rsquo;s.</p>

  <div class="demo-preset-row" id="demo-steps">
    <button type="button" class="demo-chip is-on" data-step="0">Path</button>
    <button type="button" class="demo-chip" data-step="1">Zotero</button>
    <button type="button" class="demo-chip" data-step="2">Install</button>
    <button type="button" class="demo-chip" data-step="3">Connect</button>
    <button type="button" class="demo-chip" data-step="4">Check</button>
    <button type="button" class="demo-chip" data-step="5">Ask</button>
    <button type="button" class="demo-chip" data-step="6">Govern</button>
  </div>

  <!-- Step 0: the path -->
  <div class="demo-stage" id="stage-0">
    <p class="demo-stage-kicker">Five steps. Ten minutes. Nothing leaves your laptop.</p>
    <p class="demo-stage-copy">We use <a href="https://github.com/54yyyu/zotero-mcp" target="_blank" rel="noopener">zotero-mcp</a>, a free community connector. It talks to the Zotero app already running on your machine. No account, no upload, no key needed for reading. Works in <strong>Claude Desktop</strong> on Mac or Windows &mdash; not in the browser tab.</p>
    <div class="b7-path" role="list">
      <article class="b7-beat" role="listitem">
        <p class="n">1 &middot; Zotero</p>
        <p>Zotero 7 open, with one tick-box turned on.</p>
      </article>
      <article class="b7-beat" role="listitem">
        <p class="n">2 &middot; Install</p>
        <p>Two lines in a terminal. One installs the tool runner, one installs the plug.</p>
      </article>
      <article class="b7-beat" role="listitem">
        <p class="n">3 &middot; Connect</p>
        <p>One command writes the Claude Desktop config for you. Restart Claude.</p>
      </article>
      <article class="b7-beat" role="listitem">
        <p class="n">4 &middot; Check</p>
        <p>Ask Claude for your five most recent items. If it lists them, you are done.</p>
      </article>
      <article class="b7-beat" role="listitem">
        <p class="n">5 &middot; Ask</p>
        <p>The real question: find, summarise, cite &mdash; from your own library.</p>
      </article>
    </div>
    <p class="demo-stage-copy">The terminal is the only unfamiliar part. It is three pasted lines. Everything else is clicking.</p>
  </div>

  <!-- Step 1: Zotero prerequisite -->
  <div class="demo-stage" id="stage-1" hidden>
    <p class="demo-stage-kicker">Step 1 &middot; Let Zotero answer the door</p>
    <p class="demo-stage-copy">The plug reads your library through Zotero&rsquo;s own local door. Zotero keeps that door shut by default. Open it once.</p>

    <div class="mcp-chain">
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">1</div>
        <div>
          <h3>Install or update to Zotero 7</h3>
          <p>Download from <a href="https://www.zotero.org/download/" target="_blank" rel="noopener">zotero.org/download</a>. Zotero 6 does not have the local door. Check the version under <strong>Help &rarr; About Zotero</strong>.</p>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">2</div>
        <div>
          <h3>Open Settings</h3>
          <p>Mac: <strong>Zotero &rarr; Settings</strong>. Windows: <strong>Edit &rarr; Settings</strong>.</p>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">3</div>
        <div>
          <h3>Advanced &rarr; tick one box</h3>
          <p><strong>&ldquo;Allow other applications on this computer to communicate with Zotero.&rdquo;</strong> That is the whole setting. Close Settings.</p>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">4</div>
        <div>
          <h3>Leave Zotero running</h3>
          <p>The plug only works while Zotero is open. If Claude later says it cannot reach Zotero, this is the first thing to check.</p>
        </div>
      </div>
    </div>

    <div class="callout callout-note">
      &ldquo;Other applications on this computer&rdquo; means exactly that. Nothing on the internet can use this door. It is the chat app on your laptop talking to the Zotero app on your laptop.
    </div>
  </div>

  <!-- Step 2: install -->
  <div class="demo-stage" id="stage-2" hidden>
    <p class="demo-stage-kicker">Step 2 &middot; Two lines in a terminal</p>
    <p class="demo-stage-copy">Open <strong>Terminal</strong> (Mac: Spotlight, type <em>Terminal</em>) or <strong>PowerShell</strong> (Windows: Start, type <em>PowerShell</em>). Paste line one. Close and reopen the terminal. Paste line two.</p>

    <div class="b7-os-grid">
      <div class="b7-os">
        <p class="k">Mac</p>
        <p class="lab">Line 1 &mdash; install <code>uv</code>, the tool runner</p>
        <pre class="mcp-code" id="b7-uv-mac" tabindex="0">curl -LsSf https://astral.sh/uv/install.sh | sh</pre>
        <p class="lab">Close the terminal, reopen it. Line 2 &mdash; install the plug</p>
        <pre class="mcp-code" id="b7-install-mac" tabindex="0">uv tool install zotero-mcp-server</pre>
        <p class="demo-open-row">
          <button type="button" class="demo-ask b7-copy" data-target="b7-uv-mac">Copy line 1</button>
          <button type="button" class="demo-ask b7-copy" data-target="b7-install-mac">Copy line 2</button>
        </p>
      </div>
      <div class="b7-os">
        <p class="k">Windows</p>
        <p class="lab">Line 1 &mdash; install <code>uv</code>, the tool runner</p>
        <pre class="mcp-code" id="b7-uv-win" tabindex="0">powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"</pre>
        <p class="lab">Close PowerShell, reopen it. Line 2 &mdash; install the plug</p>
        <pre class="mcp-code" id="b7-install-win" tabindex="0">uv tool install zotero-mcp-server</pre>
        <p class="demo-open-row">
          <button type="button" class="demo-ask b7-copy" data-target="b7-uv-win">Copy line 1</button>
          <button type="button" class="demo-ask b7-copy" data-target="b7-install-win">Copy line 2</button>
        </p>
      </div>
    </div>

    <p class="demo-stage-copy">Then confirm it landed. This should print a version number, nothing else.</p>
    <pre class="mcp-code" id="b7-version" tabindex="0">zotero-mcp version</pre>
    <p class="demo-open-row">
      <button type="button" class="demo-ask b7-copy" data-target="b7-version">Copy</button>
    </p>

    <div class="demo-share-grid">
      <div class="demo-share">
        <p class="k">What uv is</p>
        <p>A small program that installs and runs Python tools without you touching Python. Think of it as the App Store for command-line plugs. You install it once and forget it.</p>
      </div>
      <div class="demo-share demo-share-avoid">
        <p class="k">&ldquo;command not found&rdquo;</p>
        <p>You did not reopen the terminal after line 1. Close it fully, open a new one, try again. On Mac, <code>uv tool update-shell</code> then reopen also fixes it.</p>
      </div>
    </div>
  </div>

  <!-- Step 3: connect to Claude Desktop -->
  <div class="demo-stage" id="stage-3" hidden>
    <p class="demo-stage-kicker">Step 3 &middot; One command writes the config</p>
    <p class="demo-stage-copy">Claude Desktop keeps a small file listing its plugs. You could edit it by hand. You do not have to.</p>

    <pre class="mcp-code" id="b7-setup" tabindex="0">zotero-mcp setup</pre>
    <p class="demo-open-row">
      <button type="button" class="demo-ask b7-copy" data-target="b7-setup">Copy</button>
    </p>

    <div class="mcp-chain">
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">1</div>
        <div>
          <h3>&ldquo;Use local Zotero API?&rdquo; &rarr; press Enter</h3>
          <p>Yes is the default. Local means the door you opened in Step 1. No key, no account.</p>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">2</div>
        <div>
          <h3>&ldquo;Configure semantic search?&rdquo; &rarr; skip for today</h3>
          <p>It offers to build an AI index of your PDFs. Useful later, slow now. Say no. Keyword search works without it.</p>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">3</div>
        <div>
          <h3>It writes the Claude Desktop file</h3>
          <p>You will see a path ending in <code>claude_desktop_config.json</code>. The entry it added looks like this:</p>
          <pre class="mcp-code b7-json" tabindex="0">{
  "mcpServers": {
    "zotero": {
      "command": "zotero-mcp",
      "env": { "ZOTERO_LOCAL": "true" }
    }
  }
}</pre>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n b7-n">4</div>
        <div>
          <h3>Quit Claude Desktop fully, then reopen</h3>
          <p>Mac: <strong>&#8984;Q</strong>, not the red dot. Windows: right-click the tray icon &rarr; Quit. Claude reads the plug list only on launch.</p>
        </div>
      </div>
    </div>

    <div class="callout callout-note">
      Reading only, by design. Adding an API key from zotero.org lets the plug write to your library too (add items, notes, tags). Do that on a day you have time to check what it wrote.
    </div>
  </div>

  <!-- Step 4: verify -->
  <div class="demo-stage" id="stage-4" hidden>
    <p class="demo-stage-kicker">Step 4 &middot; Prove it</p>
    <p class="demo-stage-copy">In Claude Desktop, open a new chat. Click the <strong>tools</strong> icon under the message box (the small slider or plug icon). <strong>zotero</strong> should be in the list with a few dozen tools under it. Then ask:</p>

    <div class="mcp-bubble mcp-ask">
      <span class="who">You</span>
      List the five most recent items in my Zotero library. Title, first author, year.
    </div>

    <div class="mcp-tool">
      <span class="who">Tool &mdash; zotero</span>
      zotero_get_recent &middot; limit 5 &nbsp;&rarr;&nbsp; <span class="mcp-continue">Allow</span>
    </div>

    <div class="mcp-bubble mcp-reply-ok">
      <span class="who">Claude &mdash; connected</span>
      Five items, newest first: the 2023 JCO fever and neutropenia guideline (Lehrnbecher), the 2024 Lancet Oncology paper on&hellip;
    </div>

    <p class="demo-stage-copy">If those are your papers, you are done. Same habit as Block 4: the model asks, you press Allow, then it answers from your rows.</p>

    <div class="b7-trouble">
      <p class="k">If it does not work</p>
      <div class="mcp-chain">
        <div class="mcp-step">
          <div class="mcp-step-n b7-n b7-n-warn">?</div>
          <div>
            <h3>No zotero in the tools list</h3>
            <p>Claude was not fully quit. &#8984;Q or tray-icon Quit, reopen. Still missing: run <code>zotero-mcp setup-info</code> in the terminal and check the path it prints exists.</p>
          </div>
        </div>
        <div class="mcp-step">
          <div class="mcp-step-n b7-n b7-n-warn">?</div>
          <div>
            <h3>&ldquo;Cannot connect to Zotero&rdquo; or &ldquo;connection refused&rdquo;</h3>
            <p>Zotero is not open, or the Step 1 tick-box is off. Open Zotero, check Settings &rarr; Advanced, ask again.</p>
          </div>
        </div>
        <div class="mcp-step">
          <div class="mcp-step-n b7-n b7-n-warn">?</div>
          <div>
            <h3>Claude lists papers you do not own</h3>
            <p>It is guessing, not reading. The tool call never happened. Look for the Allow prompt. If there was none, the plug is not loaded &mdash; back to the first fix.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 5: the real question -->
  <div class="demo-stage" id="stage-5" hidden>
    <p class="demo-stage-kicker">Step 5 &middot; Now the question you came for</p>
    <p class="demo-stage-copy">A general chat reads the internet. This one reads the folder you curated over ten years. Ask it what you would ask a good fellow the night before tumour board.</p>

    <pre class="demo-skill-file" id="b7-ask" tabindex="0">Search my Zotero library for guidelines on fever and neutropenia in children.

For each hit, give me the title, first author, year, and the one recommendation on time-to-antibiotics.

Quote the recommendation from the PDF; do not paraphrase. If a paper has no PDF attached, say so instead of guessing.</pre>
    <p class="demo-open-row">
      <button type="button" class="demo-ask b7-copy" data-target="b7-ask">Copy the prompt</button>
    </p>

    <p class="demo-stage-copy">The last two sentences are the Block 1 habit. The plug can read the attached PDF; make it quote, not summarise. Where a citation is thin, add <a href="https://consensus.app/" target="_blank" rel="noopener">Consensus</a> in the same chat for what the wider literature says &mdash; then put the paper you like into Zotero, and it is in the next search.</p>

    <div class="demo-share-grid">
      <div class="demo-share">
        <p class="k">Fine on Monday</p>
        <p>Your own library on your own laptop. Guidelines, reviews, your published work. Nothing patient-level is in Zotero, so nothing patient-level leaves.</p>
      </div>
      <div class="demo-share demo-share-avoid">
        <p class="k">Not this week</p>
        <p>Turning on write access and letting it retag or merge your library unattended. Read first. Add write when you have an afternoon to check it.</p>
      </div>
    </div>
  </div>

  <!-- Step 6: house rules, then the governance brief -->
  <div class="demo-stage" id="stage-6" hidden>
    <p class="demo-stage-kicker">Before Monday &middot; The rules around the plug</p>
    <p class="demo-stage-copy">A plug into your library is research use of AI. These are the house rules that keep it honest. The brief under the table is the evidence behind them.</p>

    <!-- Do / don't: the line between legitimate research and plagiarism -->
    <div class="b7-rules-wrap">
    <table class="b7-rules">
      <caption class="visually-hidden">Do and do not when you use AI for research</caption>
      <thead>
        <tr>
          <th scope="col">Do</th>
          <th scope="col">Don&rsquo;t</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Do">Brainstorm with it. Questions, outlines, angles you had not named yet.</td>
          <td data-label="Don&rsquo;t">Fabricate data. Not a number, not a patient, not a <em>p</em>-value.</td>
        </tr>
        <tr>
          <td data-label="Do">Review the manuscript with it before you submit.</td>
          <td data-label="Don&rsquo;t">Let the model rewrite or &ldquo;tidy&rdquo; your results.</td>
        </tr>
        <tr>
          <td data-label="Do">Write analysis code with it &mdash; only if you understand the statistic it is running.</td>
          <td data-label="Don&rsquo;t">Generate statistics you cannot explain, or cannot change later when a reviewer asks.</td>
        </tr>
        <tr>
          <td data-label="Do">Let it teach you a new tool until you can run it yourself. Kaplan&ndash;Meier. A model. A plot.</td>
          <td data-label="Don&rsquo;t">Trust a reference it fetched until you have read it and know why it was cited.</td>
        </tr>
        <tr>
          <td data-label="Do">Draft a strict blueprint of the paper. Then augment or review the references you already chose.</td>
          <td data-label="Don&rsquo;t">Hide that you used AI. Journals will ask. Your IRB already does.</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">That is the line. One side is transparent, reproducible, honest, legitimate research. Cross it and the work is uninformed, unethical, dangerous &mdash; and it is plagiarism.</td>
        </tr>
      </tfoot>
    </table>
    </div>

    <p class="demo-stage-copy">Your hospital, your ethics board, and your journal each have a view on this. The brief is why a model that passed its studies can still fail on your patients, what the reporting rules ask of you, and what a health system should actually do. Six tabs. Start with <strong>Action plan</strong> if you have two minutes.</p>
    <p class="demo-open-row">
      <a class="demo-ask" href="{{ site.baseurl }}/assets/block-07/ai_governance.html" target="_blank" rel="noopener">Open the brief</a>
    </p>
    <iframe class="demo-frame b7-gov-frame" id="b7-gov-frame" title="Governance of AI in Healthcare — interactive evidence brief" src="{{ site.baseurl }}/assets/block-07/ai_governance.html" scrolling="no"></iframe>
    <p class="demo-stage-copy">Built the same way as the Block 2 guideline explainer: a paper-to-artifact prompt, then a person checking every number. The footnote on the recall figure is the honest part &mdash; keep it.</p>
  </div>

  <div class="demo-controls">
    <button type="button" class="demo-ask" id="demo-next">Next</button>
    <p class="demo-status" id="demo-status" role="status"></p>
  </div>

  <div class="block-section">
    <h2>On screen</h2>
    <div class="callout callout-onscreen">
      Zotero open, tick-box on. Terminal: two lines, then <code>zotero-mcp setup</code>. Restart Claude. Ask for the five most recent items. Then the fever-and-neutropenia prompt, quoting from the PDF. Land on <strong>Govern</strong> &mdash; the do / don&rsquo;t table, then the AI-governance brief, Action plan tab. If time: a synthetic cohort &rarr; plain-language brief &rarr; code written, corrected, and a Kaplan&ndash;Meier curve on screen.
    </div>
  </div>

  <div class="block-section">
    <h2>Take-home</h2>
    <div class="callout callout-takehome">
      The model writes the code; you remain the author. Plug it into the library you already trust before you plug it into anything else.
    </div>
  </div>

  <div class="block-section">
    <h2>If you run long</h2>
    <div class="callout callout-note">
      At 00:48, show the install as five chips and skip the live terminal &mdash; the page walks them through it at home. Keep the Zotero question, the do / don&rsquo;t table, and the Action plan tab of the brief. Drop the second analysis and keep the survival curve. Never sacrifice the closing three minutes &mdash; the Monday tasks are what make the hour actionable.
    </div>
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-06-small-app/">&larr; 6 &middot; A small app in five minutes</a>
    <a href="{{ site.baseurl }}/block-08-learned/">8 &middot; What we learned at KHCC &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-07.js"></script>
