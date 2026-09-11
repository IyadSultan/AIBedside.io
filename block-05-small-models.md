---
layout: default
title: "Block 5 — Small models, the edge, and keeping AI in the hospital"
permalink: /block-05-small-models/
---

<div class="block-page block-page-demo block-page-wide">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#C62828;">00:37</span>
    <span class="block-kicker">Block 5</span>
  </div>
  <h1>Small models, the edge, and keeping AI in the hospital</h1>

  <p class="demo-lead">A language model is just a computer program that writes and reads. The question that matters on a ward is <strong>where that program sits</strong> when you send it a note. Four places. Far to near.</p>

  <!-- Four places a model can live. Read left-to-right, top-to-bottom: farther from the ward → closer. -->
  <div class="where-grid" role="list">

    <article class="where-card where-cloud" role="listitem">
      <p class="where-kicker">1 &middot; Public cloud</p>
      <div class="where-diagram" aria-hidden="true">
        <svg viewBox="0 0 280 118" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="42" width="70" height="48" rx="8" fill="#E8F1FB" stroke="#034EA2" stroke-width="2"/>
          <rect x="20" y="52" width="46" height="24" rx="3" fill="#fff" stroke="#034EA2" stroke-width="1.5"/>
          <rect x="32" y="90" width="22" height="5" rx="1.5" fill="#034EA2"/>
          <text x="43" y="68" text-anchor="middle" font-size="9" font-weight="700" fill="#034EA2" font-family="ui-sans-serif, system-ui, sans-serif">You</text>
          <path d="M82 66 H118" stroke="#034EA2" stroke-width="2" stroke-dasharray="5 4" fill="none"/>
          <polygon points="118,62 128,66 118,70" fill="#034EA2"/>
          <rect x="96" y="48" width="28" height="14" rx="3" fill="#034EA2"/>
          <text x="110" y="58" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="ui-sans-serif, system-ui, sans-serif">API</text>
          <ellipse cx="208" cy="58" rx="52" ry="26" fill="#E8F1FB" stroke="#034EA2" stroke-width="2"/>
          <ellipse cx="188" cy="50" rx="18" ry="14" fill="#E8F1FB" stroke="#034EA2" stroke-width="2"/>
          <ellipse cx="228" cy="50" rx="16" ry="12" fill="#E8F1FB" stroke="#034EA2" stroke-width="2"/>
          <text x="208" y="64" text-anchor="middle" font-size="10" font-weight="800" fill="#034EA2" font-family="ui-sans-serif, system-ui, sans-serif">LLM</text>
          <text x="140" y="108" text-anchor="middle" font-size="10" font-weight="700" fill="#C62828" font-family="ui-sans-serif, system-ui, sans-serif">Notes leave the hospital</text>
        </svg>
      </div>
      <h2>Large model on the cloud, via a connector API</h2>
      <p class="where-one">ChatGPT, Claude, Gemini in the browser. The model lives on the company&rsquo;s computers. A connector &mdash; the MCP plug from Block 4 &mdash; can send a file or a mailbox to it. There is usually no hospital contract.</p>
      <div class="where-pn">
        <div class="where-pro">
          <p class="k">Pros</p>
          <ul>
            <li>Strongest models, ready this afternoon</li>
            <li>Nothing to install; connectors to Drive, mail, PubMed</li>
            <li>Cheap to try</li>
          </ul>
        </div>
        <div class="where-con">
          <p class="k">Cons</p>
          <ul>
            <li>Patient notes leave the hospital</li>
            <li>Consumer terms &mdash; no BAA</li>
            <li>Needs the internet</li>
          </ul>
        </div>
      </div>
    </article>

    <article class="where-card where-baa" role="listitem">
      <p class="where-kicker">2 &middot; Contracted cloud</p>
      <div class="where-diagram" aria-hidden="true">
        <svg viewBox="0 0 280 118" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="42" width="70" height="48" rx="8" fill="#E0F2F1" stroke="#00695C" stroke-width="2"/>
          <rect x="20" y="52" width="46" height="24" rx="3" fill="#fff" stroke="#00695C" stroke-width="1.5"/>
          <rect x="32" y="90" width="22" height="5" rx="1.5" fill="#00695C"/>
          <text x="43" y="68" text-anchor="middle" font-size="9" font-weight="700" fill="#00695C" font-family="ui-sans-serif, system-ui, sans-serif">You</text>
          <path d="M82 66 H150" stroke="#00695C" stroke-width="3" fill="none"/>
          <polygon points="150,61 162,66 150,71" fill="#00695C"/>
          <circle cx="116" cy="66" r="11" fill="#fff" stroke="#00695C" stroke-width="2"/>
          <path d="M111 66 v-4 a5 5 0 0 1 10 0 v4" fill="none" stroke="#00695C" stroke-width="1.8"/>
          <rect x="109" y="66" width="14" height="10" rx="2" fill="#00695C"/>
          <ellipse cx="214" cy="58" rx="50" ry="26" fill="#E0F2F1" stroke="#00695C" stroke-width="2"/>
          <ellipse cx="196" cy="50" rx="16" ry="13" fill="#E0F2F1" stroke="#00695C" stroke-width="2"/>
          <ellipse cx="232" cy="50" rx="14" ry="11" fill="#E0F2F1" stroke="#00695C" stroke-width="2"/>
          <text x="214" y="62" text-anchor="middle" font-size="10" font-weight="800" fill="#00695C" font-family="ui-sans-serif, system-ui, sans-serif">LLM</text>
          <rect x="198" y="72" width="32" height="12" rx="3" fill="#00695C"/>
          <text x="214" y="81" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="ui-sans-serif, system-ui, sans-serif">BAA</text>
          <text x="140" y="108" text-anchor="middle" font-size="10" font-weight="700" fill="#00695C" font-family="ui-sans-serif, system-ui, sans-serif">Notes leave &mdash; under contract</text>
        </svg>
      </div>
      <h2>Large model on the cloud, HIPAA path with a BAA</h2>
      <p class="where-one">Same class of large model, but the hospital signs a Business Associate Agreement and the traffic goes through a private, encrypted link. Azure OpenAI, AWS Bedrock, and Google Vertex are the usual doors. HIPAA is the US name for that duty.</p>
      <div class="where-pn">
        <div class="where-pro">
          <p class="k">Pros</p>
          <ul>
            <li>Large-model quality with a legal contract</li>
            <li>Encrypted, logged, access-controlled</li>
            <li>IT can switch it off for a whole unit</li>
          </ul>
        </div>
        <div class="where-con">
          <p class="k">Cons</p>
          <ul>
            <li>Notes still leave the building, to a named vendor</li>
            <li>Needs IT, money, and months</li>
            <li>Not a conference-laptop demo</li>
          </ul>
        </div>
      </div>
    </article>

    <article class="where-card where-onprem" role="listitem">
      <p class="where-kicker">3 &middot; Hospital servers</p>
      <div class="where-diagram" aria-hidden="true">
        <svg viewBox="0 0 280 118" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="18" width="208" height="78" rx="10" fill="#FFF8F8" stroke="#C62828" stroke-width="2"/>
          <text x="140" y="34" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="0.08em" fill="#C62828" font-family="ui-sans-serif, system-ui, sans-serif">HOSPITAL</text>
          <rect x="52" y="44" width="64" height="40" rx="7" fill="#fff" stroke="#C62828" stroke-width="1.8"/>
          <rect x="64" y="52" width="40" height="20" rx="3" fill="#FFF5F5" stroke="#C62828" stroke-width="1.4"/>
          <rect x="74" y="84" width="20" height="4" rx="1.2" fill="#C62828"/>
          <text x="84" y="66" text-anchor="middle" font-size="8" font-weight="700" fill="#C62828" font-family="ui-sans-serif, system-ui, sans-serif">You</text>
          <path d="M120 64 H148" stroke="#C62828" stroke-width="2" fill="none"/>
          <polygon points="148,60 156,64 148,68" fill="#C62828"/>
          <rect x="162" y="42" width="62" height="44" rx="6" fill="#C62828"/>
          <rect x="170" y="50" width="46" height="6" rx="1.5" fill="#FFCDD2"/>
          <rect x="170" y="60" width="46" height="6" rx="1.5" fill="#FFCDD2"/>
          <rect x="170" y="70" width="46" height="6" rx="1.5" fill="#FFCDD2"/>
          <text x="193" y="38" text-anchor="middle" font-size="8" font-weight="800" fill="#C62828" font-family="ui-sans-serif, system-ui, sans-serif">LLM</text>
          <text x="140" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#C62828" font-family="ui-sans-serif, system-ui, sans-serif">Notes stay inside the walls</text>
        </svg>
      </div>
      <h2>Large model on-premise</h2>
      <p class="where-one">The hospital buys or rents computers that sit in its own data centre and runs a large model there. Notes never go to a public website. You own the box, so you own the rules.</p>
      <div class="where-pn">
        <div class="where-pro">
          <p class="k">Pros</p>
          <ul>
            <li>Data never leaves the hospital</li>
            <li>You set who can use it</li>
            <li>Can keep working if the public internet is down</li>
          </ul>
        </div>
        <div class="where-con">
          <p class="k">Cons</p>
          <ul>
            <li>GPUs and staff cost real money</li>
            <li>The model is usually a step behind ChatGPT</li>
            <li>Hard for a small unit to own alone</li>
          </ul>
        </div>
      </div>
    </article>

    <article class="where-card where-edge" role="listitem">
      <p class="where-kicker">4 &middot; On this device</p>
      <div class="where-diagram" aria-hidden="true">
        <svg viewBox="0 0 280 118" xmlns="http://www.w3.org/2000/svg">
          <rect x="78" y="18" width="124" height="78" rx="10" fill="#FFF8F5" stroke="#E65100" stroke-width="2"/>
          <rect x="92" y="30" width="96" height="48" rx="4" fill="#fff" stroke="#E65100" stroke-width="1.8"/>
          <rect x="108" y="40" width="64" height="28" rx="4" fill="#E65100"/>
          <text x="140" y="53" text-anchor="middle" font-size="9" font-weight="800" fill="#fff" font-family="ui-sans-serif, system-ui, sans-serif">SLM</text>
          <text x="140" y="64" text-anchor="middle" font-size="7" font-weight="700" fill="#FFCCBC" font-family="ui-sans-serif, system-ui, sans-serif">1&ndash;8B</text>
          <rect x="118" y="96" width="44" height="5" rx="1.5" fill="#E65100"/>
          <circle cx="214" cy="36" r="11" fill="#fff" stroke="#E65100" stroke-width="2"/>
          <path d="M207 29 l14 14 M221 29 l-14 14" stroke="#E65100" stroke-width="2" stroke-linecap="round"/>
          <text x="226" y="58" font-size="8" font-weight="700" fill="#E65100" font-family="ui-sans-serif, system-ui, sans-serif">Wi-Fi off</text>
          <text x="140" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#E65100" font-family="ui-sans-serif, system-ui, sans-serif">Notes stay on this laptop</text>
        </svg>
      </div>
      <h2>Small model on the edge</h2>
      <p class="where-one">A small language model &mdash; about 1 to 8 billion parameters, small enough for a laptop, a phone, or a browser tab. &ldquo;The edge&rdquo; means the computer that already has the data. Compute stays where the notes already are.</p>
      <div class="where-pn">
        <div class="where-pro">
          <p class="k">Pros</p>
          <ul>
            <li>Notes never leave this device</li>
            <li>Works with the wi-fi off</li>
            <li>No per-token bill; answers the sovereignty question</li>
          </ul>
        </div>
        <div class="where-con">
          <p class="k">Cons</p>
          <ul>
            <li>Weaker at hard, open-ended questions</li>
            <li>Best at narrow jobs, not a second opinion</li>
            <li>First download is large &mdash; cache it before you demo</li>
          </ul>
        </div>
      </div>
    </article>

  </div>

  <p class="where-footnote">A <strong>BAA</strong> (Business Associate Agreement) is a contract that says the vendor must protect patient information the way the hospital must. HIPAA is the US name. If you are not in the US, you still want the same kind of contract under your own law.</p>

  <!-- Live edge demo: Prism ML Bonsai 1.7B (1-bit) runs in this tab via Transformers.js. -->
  <section class="bonsai-desk" id="bonsai-desk" aria-label="Bonsai 1.7B local chatbot">
    <div class="bonsai-top">
      <div>
        <p class="where-kicker" style="color:#E65100;">Square 4, live</p>
        <h2>Bonsai 1.7B in this tab</h2>
        <p>This is the small model from the fourth square. It is Prism ML&rsquo;s 1-bit Bonsai 1.7B (~290 MB). After the first download it stays in the browser. Then you can switch the wi-fi off. Ask it to fix English. It is not a second opinion.</p>
      </div>
      <p class="bonsai-health" id="bonsai-health" role="status">Not loaded yet. Chrome or Edge works best.</p>
    </div>

    <div class="bonsai-load">
      <button type="button" class="demo-ask" id="bonsai-load">Load Bonsai 1.7B</button>
      <div class="bonsai-meter" id="bonsai-meter" hidden>
        <div class="bonsai-meter-fill" id="bonsai-meter-fill"></div>
      </div>
    </div>

    <div class="bonsai-thread" id="bonsai-thread">
      <div class="bonsai-empty">Load the model, then paste a sentence with language errors and ask it to fix the English. Nothing is sent to a cloud.</div>
    </div>

    <div class="bonsai-hints" id="bonsai-hints">
      <button type="button" data-q="Fix the English. Keep medical terms and numbers. Return only the corrected text: The child have fever since yesterday and we start antibiotic.">Fix &middot; fever sentence</button>
      <button type="button" data-q="Fix the English. Keep medical terms and numbers. Return only the corrected text: Parents is worry because ANC is 80 and they want wait until clinic.">Fix &middot; ANC sentence</button>
      <button type="button" data-q="Fix the English. Keep medical terms and numbers. Return only the corrected text: Please come to ER tonight we need cultures then antibiotic the same evening.">Fix &middot; ER sentence</button>
    </div>

    <form class="bonsai-composer" id="bonsai-form">
      <label class="visually-hidden" for="bonsai-input">Ask Bonsai</label>
      <textarea id="bonsai-input" rows="2" placeholder="Paste a sentence, then ask: fix the English." autocomplete="off" disabled></textarea>
      <button type="submit" class="bonsai-send" id="bonsai-send" disabled aria-label="Send">Send</button>
    </form>
    <p class="bonsai-foot">
      <a href="https://aithinkerlab.com/run-ai-model-locally-in-browser-bonsai-1bit/" target="_blank" rel="noopener">How this 1-bit model runs in a browser</a>
      &middot; weights from
      <a href="https://huggingface.co/onnx-community/Bonsai-1.7B-ONNX" target="_blank" rel="noopener">onnx-community/Bonsai-1.7B-ONNX</a>.
      Never paste a real patient.
    </p>
  </section>

  <div class="block-section">
    <h2>On screen</h2>
    <div class="callout callout-onscreen">
      Walk the four squares far to near. Load Bonsai 1.7B in this tab, ask it to fix a broken sentence, then switch the wi-fi off and keep talking.
    </div>
  </div>

  <div class="block-section">
    <h2>Take-home</h2>
    <div class="callout callout-takehome">
      Small and local for the routine and the sensitive; large and remote for the difficult. Public cloud for public knowledge. A contracted cloud or the hospital&rsquo;s own servers for patient notes.
    </div>
  </div>

  <div class="phi-line">
    Never paste a real patient list &mdash; names, MRNs, dates of birth &mdash; into a consumer cloud tool, even through a connector.
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-05-5-claude-md/">&larr; 5.5 &middot; CLAUDE.md — the kitchen contract</a>
    <a href="{{ site.baseurl }}/block-06-small-app/">6 &middot; A small app in five minutes &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-05-chat.js"></script>
