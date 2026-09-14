---
layout: default
title: "Block 4 — MCP — connect your own work"
permalink: /block-04-mcp/
---

<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/claude-desk.css">

<div class="block-page block-page-demo block-page-wide">
  <div class="block-eyebrow">
    <span class="block-time" style="background:#E65100;">00:29</span>
    <span class="block-kicker">Block 4</span>
  </div>
  <h1>MCP — connect your own work</h1>

  <p class="demo-lead">MCP is a USB port for AI. We follow the same path as this <a href="https://www.youtube.com/watch?v=Xs9AwE2lyHg" target="_blank" rel="noopener">plain-language MCP explainer</a> &mdash; show it first, then name the parts &mdash; on a childhood-cancer unit, not a sales database. The <strong>Live</strong> chip is the same idea in your hands: Claude Haiku 4.5 with and without a medical-terms plug.</p>

  <div class="demo-preset-row" id="demo-steps">
    <button type="button" class="demo-chip is-on" data-step="0">What</button>
    <button type="button" class="demo-chip" data-step="1">Without</button>
    <button type="button" class="demo-chip" data-step="2">With</button>
    <button type="button" class="demo-chip" data-step="3">How</button>
    <button type="button" class="demo-chip" data-step="4">Pieces</button>
    <button type="button" class="demo-chip" data-step="5">PubMed</button>
    <button type="button" class="demo-chip" data-step="6">Chain</button>
    <button type="button" class="demo-chip" data-step="7">Risk</button>
    <button type="button" class="demo-chip" data-step="8">Live</button>
  </div>

  <!-- Step 0: one-sentence definition, USB metaphor -->
  <div class="demo-stage" id="stage-0">
    <p class="demo-stage-kicker">One sentence, then stop</p>
    <p class="demo-stage-copy">MCP (Model Context Protocol) is a <strong>shared plug</strong>. It lets the chat model reach a file, a mailbox, or a spreadsheet &mdash; and do something, not just talk about it.</p>

    <div class="mcp-usb">
      <div class="mcp-usb-you">
        <span>You, in the chat</span>
        Claude, ChatGPT, Gemini
      </div>
      <div class="mcp-usb-plug">MCP</div>
      <div class="mcp-usb-ports">
        <div class="mcp-port">Drive &mdash; protocols</div>
        <div class="mcp-port">Gmail &mdash; drafts</div>
        <div class="mcp-port">Calendar &mdash; tumour board</div>
        <div class="mcp-port">Unit log &mdash; FN list</div>
      </div>
    </div>

    <p class="demo-stage-copy">Before USB-C, every camera had its own cable. Before MCP, every hospital tool needed its own custom hook-up. One plug shape now works across brands. Anthropic published it. OpenAI put it in ChatGPT. Google is doing the same with Gemini. You do not pick a vendor to use the idea.</p>
  </div>

  <!-- Step 1: the video's ChatGPT-without-a-database moment -->
  <div class="demo-stage" id="stage-1" hidden>
    <p class="demo-stage-kicker">Same question, no plug</p>
    <p class="demo-stage-copy">You open ordinary ChatGPT &mdash; nothing connected &mdash; and ask about <em>your</em> ward.</p>

    <div class="mcp-chat">
      <div class="mcp-bubble mcp-ask">
        <span class="who">You</span>
        How many febrile neutropenia admissions did our unit have in August, and how many were high-risk?
      </div>
      <div class="mcp-bubble mcp-reply">
        <span class="who">ChatGPT &mdash; not connected</span>
        I don&rsquo;t have access to your hospital records. If you paste the table or describe the columns, I can tally it. In general, fever during neutropenia is an emergency: high-risk children should get antibiotics quickly, and&hellip;
      </div>
    </div>

    <p class="demo-stage-copy">That answer is not wrong. It is a textbook. It has never seen your list. In the video this is the sales table ChatGPT cannot read. Here it is the FN log it cannot read.</p>
  </div>

  <!-- Step 2: same prompt, connector on, synthetic unit log -->
  <div class="demo-stage" id="stage-2" hidden>
    <p class="demo-stage-kicker">Same question, unit log connected</p>
    <p class="demo-stage-copy">Now the chat has a read-only connector to a <strong>synthetic</strong> FN log &mdash; a spreadsheet the unit keeps, not a live EMR. The model asks to run a lookup. You click Continue. Then it answers from the rows.</p>

    <div class="mcp-tool">
      <span class="who">Tool &mdash; unit-log connector</span>
      Read-only query: count August episodes, split by high-risk vs low-risk.
    </div>

    <div class="mcp-chat">
      <div class="mcp-bubble mcp-reply-ok">
        <span class="who">Claude &mdash; connected</span>
        Six episodes in August. Four high-risk, all admitted. Two low-risk, both outpatient. The 6-year-old with B-ALL on day 10 is in this list &mdash; penicillin rash, house alternative used. Median door-to-antibiotic in the extract: 41 minutes.
      </div>
    </div>

    <p class="demo-stage-copy">You can check the table. That is the whole point, same as looking back at the database in the video.</p>

    <div class="demo-case">
      <div class="demo-case-top">
        <span class="demo-pill">Synthetic unit log</span>
        <span class="demo-pill demo-pill-warn">Not KHCC data &middot; not a real patient</span>
      </div>
      <h2>August 2026 &mdash; febrile neutropenia</h2>
    </div>
    <div class="mcp-log-wrap">
      <table class="mcp-log">
        <thead>
          <tr>
            <th>Date</th>
            <th>Age</th>
            <th>Diagnosis</th>
            <th>ANC</th>
            <th>Line</th>
            <th>Risk</th>
            <th>Door-to-abx</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3 Aug</td>
            <td>6</td>
            <td>B-ALL, day 10</td>
            <td>80</td>
            <td>Yes</td>
            <td class="hi">High &mdash; admitted</td>
            <td>38 min</td>
          </tr>
          <tr>
            <td>7 Aug</td>
            <td>14</td>
            <td>Osteosarcoma, cycle 3</td>
            <td>420</td>
            <td>No</td>
            <td>Low &mdash; outpatient</td>
            <td>55 min</td>
          </tr>
          <tr>
            <td>12 Aug</td>
            <td>4</td>
            <td>AML</td>
            <td>40</td>
            <td>Yes</td>
            <td class="hi">High &mdash; admitted</td>
            <td>29 min</td>
          </tr>
          <tr>
            <td>18 Aug</td>
            <td>9</td>
            <td>Burkitt</td>
            <td>210</td>
            <td>Yes</td>
            <td class="hi">High &mdash; admitted</td>
            <td>44 min</td>
          </tr>
          <tr>
            <td>22 Aug</td>
            <td>11</td>
            <td>Hodgkin</td>
            <td>580</td>
            <td>No</td>
            <td>Low &mdash; outpatient</td>
            <td>62 min</td>
          </tr>
          <tr>
            <td>28 Aug</td>
            <td>3</td>
            <td>Neuroblastoma</td>
            <td>90</td>
            <td>Yes</td>
            <td class="hi">High &mdash; admitted</td>
            <td>41 min</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Step 3: client, server, protocol — hospital names -->
  <div class="demo-stage" id="stage-3" hidden>
    <p class="demo-stage-kicker">Three names, then stop</p>
    <p class="demo-stage-copy">The video calls these the client, the server, and the protocol. On the ward they are just:</p>

    <div class="demo-flow">
      <div class="demo-flow-node">You type in the chat &mdash; Claude, ChatGPT, Gemini</div>
      <p class="demo-flow-arrow">MCP plug</p>
      <div class="demo-flow-row">
        <div class="demo-flow-node">Drive connector</div>
        <div class="demo-flow-node">Gmail connector</div>
      </div>
      <div class="demo-flow-row">
        <div class="demo-flow-node">Calendar connector</div>
        <div class="demo-flow-node demo-flow-new">Unit-log connector</div>
      </div>
      <p class="demo-flow-arrow">each connector talks to one place</p>
      <div class="demo-flow-node">Protocol PDF &middot; inbox &middot; Friday slot &middot; FN spreadsheet</div>
    </div>

    <p class="demo-stage-copy">The chat is not &ldquo;inside&rdquo; Drive. The connector is. That is why you can add Gmail tomorrow without rewriting the model. In the video the catalogue is GitHub, Slack, Grafana. Below this walkthrough is a list of medical plugs &mdash; PubMed, NICE, trials, imaging, even FHIR. Same idea. Different sockets.</p>
  </div>

  <!-- Step 4: tools, resources, prompts with medical examples -->
  <div class="demo-stage" id="stage-4" hidden>
    <p class="demo-stage-kicker">What a connector is allowed to do</p>
    <p class="demo-stage-copy">Every connector advertises three kinds of thing. The model can only use what that connector listed. A read-only FN log cannot discharge a child.</p>

    <div class="mcp-pieces">
      <div class="mcp-piece">
        <p class="k">Tools</p>
        <h3>Actions</h3>
        <p>Look up the FN log. Search Drive for the protocol. Draft a Gmail. Book Room 4. Same idea as &ldquo;run a SQL query&rdquo; or &ldquo;create a GitHub repo&rdquo; in the video &mdash; except the jobs are ours.</p>
      </div>
      <div class="mcp-piece">
        <p class="k">Resources</p>
        <h3>Things to read</h3>
        <p>Last month&rsquo;s census. The 2023 fever-and-neutropenia PDF. A de-identified extract. Read-only. Context, not a change.</p>
      </div>
      <div class="mcp-piece">
        <p class="k">Prompts</p>
        <h3>Starter questions</h3>
        <p>Saved briefs the connector offers: &ldquo;Prep Friday tumour board from this week&rsquo;s FN list.&rdquo; You still send it. You still read the draft.</p>
      </div>
    </div>

    <p class="demo-stage-copy">If the Calendar connector cannot delete events, the model cannot cancel clinic. The list of tools is the list of verbs.</p>
  </div>

  <!-- Step 5: same PubMed engine — API vs MCP -->
  <div class="demo-stage" id="stage-5" hidden>
    <p class="demo-stage-kicker">Same question, two plugs</p>
    <p class="demo-stage-copy">PubMed already has an API. MCP does not replace it. A PubMed MCP connector <strong>is</strong> that API, wrapped so a person can ask in English and a model can call a named tool instead of inventing a URL.</p>

    <div class="mcp-bubble mcp-ask">
      <span class="who">Same job</span>
      Find the 2023 JCO fever and neutropenia guideline.
    </div>

    <div class="mcp-vs">
      <div class="mcp-vs-col is-api">
        <p class="k">PubMed API</p>
        <h3>Built for a program</h3>
        <p class="who-line">Friendly to a script. A clinician uses <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener">pubmed.gov</a> instead. A model can only use this if someone taught it the URL, the parameters, and how to parse the reply.</p>
        <pre class="mcp-code" tabindex="0">GET eutils.ncbi.nlm.nih.gov
  /entrez/eutils/esearch.fcgi
    ?db=pubmed
    &amp;term=fever+neutropenia
         +pediatric+2023
         +Lehrnbecher
    &amp;retmode=json

then efetch with the PMIDs
  → XML / JSON</pre>
        <ul>
          <li>You write code, or click the website.</li>
          <li>The machine speaks HTTP.</li>
          <li>Errors are status codes.</li>
        </ul>
      </div>
      <div class="mcp-vs-col is-mcp">
        <p class="k">PubMed MCP</p>
        <h3>Built for you and the model</h3>
        <p class="who-line">Friendly to a person in the chat, and to the LLM. The connector still calls Entrez. It just advertises tools with names and descriptions the model can read, and a Continue button you can refuse.</p>
        <pre class="mcp-code" tabindex="0">You: Find the 2023 JCO
     fever and neutropenia
     guideline.

Tool: search_pubmed
  query: fever neutropenia
         pediatric JCO 2023
         Lehrnbecher

Continue → PMID 36626595
  Lehrnbecher et al.
  J Clin Oncol. 2023
  (same paper as pubmed.gov)</pre>
        <ul>
          <li>You speak. You approve.</li>
          <li>The model fills in the tool.</li>
          <li>Errors come back as a sentence.</li>
        </ul>
      </div>
    </div>

    <div class="mcp-vs-core">
      <span class="k">Same core</span>
      NCBI Entrez &mdash; the plumbing under pubmed.gov, under every script, and under <a href="https://github.com/andybrandt/mcp-simple-pubmed" target="_blank" rel="noopener">mcp-simple-pubmed</a>. MCP is not a new PubMed. It is a plug that both a human and an LLM can hold.
    </div>
  </div>

  <!-- Step 6: the live Drive → Gmail → Calendar chain from the run of show -->
  <div class="demo-stage" id="stage-6" hidden>
    <p class="demo-stage-kicker">One sentence, three connectors</p>
    <p class="demo-stage-copy">The video ends by creating software on a cluster from a sentence. We end by running one sentence across three connectors you already have.</p>

    <div class="mcp-bubble mcp-ask">
      <span class="who">You</span>
      Find the tumour-board template on Drive, draft Friday&rsquo;s note from this week&rsquo;s FN list, and put the meeting on my calendar Friday 08:00, Room 4.
    </div>

    <div class="mcp-chain">
      <div class="mcp-step">
        <div class="mcp-step-n">1</div>
        <div>
          <h3>Drive</h3>
          <p>Found <code>Tumour-board-note-template.docx</code> in the shared protocols folder.</p>
          <span class="mcp-continue">Continue</span>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n">2</div>
        <div>
          <h3>Unit log</h3>
          <p>Three high-risk FN this week, including the day-10 B-ALL with the penicillin rash.</p>
          <span class="mcp-continue">Continue</span>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n">3</div>
        <div>
          <h3>Gmail</h3>
          <p>Draft to the team &mdash; not sent. You read it the way you read a letter before you sign it.</p>
          <span class="mcp-continue">Continue</span>
        </div>
      </div>
      <div class="mcp-step">
        <div class="mcp-step-n">4</div>
        <div>
          <h3>Calendar</h3>
          <p>Friday 08:00, Room 4, title: Paediatric tumour board.</p>
          <span class="mcp-continue">Continue</span>
        </div>
      </div>
    </div>

    <p class="demo-stage-copy"><strong>Continue</strong> is the same habit as signing the order. The model proposes. You release it.</p>
  </div>

  <!-- Step 7: inherits your access -->
  <div class="demo-stage" id="stage-7" hidden>
    <p class="demo-stage-kicker">The point, and the risk</p>
    <p class="demo-stage-copy">A connector works because it uses <em>your</em> login. If you can open the shared Drive, so can the model once the plug is in. If you can send mail as the unit, so can a Gmail connector &mdash; if you click Continue on send.</p>

    <div class="demo-share-grid">
      <div class="demo-share">
        <p class="k">Fine on Monday</p>
        <p>Claude or ChatGPT connected to a folder of public guidelines, or a synthetic / de-identified spreadsheet on your laptop.</p>
      </div>
      <div class="demo-share demo-share-avoid">
        <p class="k">Not this week</p>
        <p>A live EMR, a pharmacy system, or anyone&rsquo;s real inbox, plugged into a consumer chat. That is an IT project, not a conference demo.</p>
      </div>
    </div>

    <div class="callout callout-takehome">
      A connector inherits your access &mdash; that is the point and the risk.
    </div>
  </div>

  <!-- Step 8: live Haiku, with and without the terminology MCP -->
  <div class="demo-stage" id="stage-8" hidden>
    <p class="demo-stage-kicker">Same question, two Claudes</p>
    <p class="demo-stage-copy">Both panes are <strong>Claude Haiku 4.5</strong>. The left pane has no plug &mdash; it can only recall. The right pane is connected to the <a href="https://github.com/SidneyBissoli/medical-terminologies-mcp" target="_blank" rel="noopener">medical-terminologies MCP</a> (ICD-11, RxNorm, LOINC, MeSH, ATC). One question goes to both. Watch which side looks a code up.</p>

    {% include claude-desk.html %}
  </div>

  <div class="demo-controls">
    <button type="button" class="demo-ask" id="demo-next">Next</button>
    <p class="demo-status" id="demo-status" role="status"></p>
  </div>

  <div class="mcp-catalog">
    <h2>Medical MCP examples</h2>
    <p class="demo-stage-copy">These are community connectors, not a KHCC install list. Public literature plugs are the ones you can try on a laptop. Anything that touches an EMR, PACS, or real identifiers stays with IT. Source catalogue: <a href="https://github.com/sunanhe/awesome-medical-mcp-servers" target="_blank" rel="noopener">awesome-medical-mcp-servers</a>.</p>

    <details class="mcp-cat-group" open>
      <summary>Literature and evidence <span class="count">&middot; 5</span></summary>
      <p class="demo-stage-copy" style="margin-bottom:0.55rem;">Each of these still talks to NCBI. The MCP layer is what makes the same API usable in a sentence, not only in a script. See the PubMed step above.</p>
      <ul class="mcp-cat-list">
        <li>
          <a href="https://github.com/andybrandt/mcp-simple-pubmed" target="_blank" rel="noopener">andybrandt/mcp-simple-pubmed</a>
          <span class="why">Search PubMed and pull abstracts, the way you already search MEDLINE, from the chat.</span>
        </li>
        <li>
          <a href="https://github.com/grll/pubmedmcp" target="_blank" rel="noopener">grll/pubmedmcp</a>
          <span class="why">Another PubMed search-and-fetch plug if you want a second option.</span>
        </li>
        <li>
          <a href="https://github.com/rikachu225/mcp-pubmed-server" target="_blank" rel="noopener">rikachu225/mcp-pubmed-server</a>
          <span class="why">PubMed with a bias toward open-access full text.</span>
        </li>
        <li>
          <a href="https://github.com/jackkuo666/medrxiv-mcp-server" target="_blank" rel="noopener">jackkuo666/medrxiv-mcp-server</a>
          <span class="why">medRxiv preprints &mdash; protocols and papers that are not in PubMed yet.</span>
        </li>
        <li>
          <a href="https://github.com/ryoureddy/medadapt-content-server" target="_blank" rel="noopener">ryoureddy/medadapt-content-server</a>
          <span class="why">Teaching content from PubMed, NCBI Bookshelf, and documents you add yourself.</span>
        </li>
      </ul>
    </details>

    <details class="mcp-cat-group">
      <summary>Guidelines and decision support <span class="count">&middot; 4</span></summary>
      <ul class="mcp-cat-list">
        <li>
          <a href="https://github.com/SidneyBissoli/medical-terminologies-mcp" target="_blank" rel="noopener">SidneyBissoli/medical-terminologies-mcp</a>
          <span class="why">The plug in the live chat above: ICD-11, SNOMED (opt-in), LOINC, RxNorm, MeSH, ATC, CID-10. Hosted at <a href="https://medical.sidneybissoli.com/mcp" target="_blank" rel="noopener">medical.sidneybissoli.com/mcp</a>.</span>
        </li>
        <li>
          <a href="https://github.com/chris-lovejoy/medical-mcp" target="_blank" rel="noopener">chris-lovejoy/medical-mcp</a>
          <span class="why">NICE guidance, so the model can quote a UK recommendation instead of inventing one.</span>
        </li>
        <li>
          <a href="https://github.com/johnyquest7/Medical_calculator_MCP" target="_blank" rel="noopener">johnyquest7/Medical_calculator_MCP</a>
          <span class="why">Common calculators &mdash; risk scores, dosing &mdash; as tools the chat can run.</span>
        </li>
        <li>
          <a href="https://github.com/JamesANZ/medical-mcp" target="_blank" rel="noopener">JamesANZ/medical-mcp</a>
          <span class="why">One plug across FDA, WHO, PubMed, Google Scholar, and RxNorm for drugs, papers, and names.</span>
        </li>
      </ul>
    </details>

    <details class="mcp-cat-group">
      <summary>Records (FHIR, EMR) &mdash; IT, not a conference laptop <span class="count">&middot; 4</span></summary>
      <ul class="mcp-cat-list">
        <li>
          <a href="https://github.com/Kartha-AI/agentcare-mcp" target="_blank" rel="noopener">Kartha-AI/agentcare-mcp</a>
          <span class="why">FHIR tools aimed at Epic/Cerner-style workflows. New home: <a href="https://github.com/langcare/langcare-mcp-fhir" target="_blank" rel="noopener">langcare-mcp-fhir</a>.</span>
        </li>
        <li>
          <a href="https://github.com/wso2/fhir-mcp-server" target="_blank" rel="noopener">wso2/fhir-mcp-server</a>
          <span class="why">A general FHIR plug: point it at a FHIR API and the chat can search and read records.</span>
        </li>
        <li>
          <a href="https://github.com/deak-ai/openehr-mcp-server" target="_blank" rel="noopener">deak-ai/openehr-mcp-server</a>
          <span class="why">openEHR / EHRbase &mdash; templates, compositions, queries against that record style.</span>
        </li>
        <li>
          <a href="https://mcp.aibase.com/tag/Medical%20Data" target="_blank" rel="noopener">FHIR Careplan listings</a>
          <span class="why">Care-planning FHIR toolkits collected under medical-data MCP directories.</span>
        </li>
      </ul>
    </details>

    <details class="mcp-cat-group">
      <summary>Imaging and radiology <span class="count">&middot; 3</span></summary>
      <ul class="mcp-cat-list">
        <li>
          <a href="https://github.com/ChristianHinge/dicom-mcp" target="_blank" rel="noopener">ChristianHinge/dicom-mcp</a>
          <span class="why">Ask a PACS for studies, series, and report PDFs in DICOM.</span>
        </li>
        <li>
          <a href="https://github.com/fluxinc/dicom-mcp-server" target="_blank" rel="noopener">fluxinc/dicom-mcp-server</a>
          <span class="why">Test whether the chat can actually reach a DICOM node.</span>
        </li>
        <li>
          <a href="https://github.com/zhaoyouj/mcp-slicer" target="_blank" rel="noopener">zhaoyouj/mcp-slicer</a>
          <span class="why">Drive 3D Slicer in plain language &mdash; load a scene, process an image.</span>
        </li>
      </ul>
    </details>

    <details class="mcp-cat-group">
      <summary>Biomedical databases, trials, terms <span class="count">&middot; 6</span></summary>
      <p class="demo-stage-copy" style="margin-bottom:0.55rem;">One connector, seven code systems. You ask in English. The model looks up ICD-11, LOINC, RxNorm, MeSH, ATC, CID-10, and (if you host it) SNOMED CT.</p>
      <a href="https://github.com/SidneyBissoli/medical-terminologies-mcp" target="_blank" rel="noopener">
        <img class="demo-shot" src="{{ site.baseurl }}/assets/block-04/medical-terminologies-mcp.png" alt="GitHub README for Medical Terminologies MCP Server: ICD-11, SNOMED CT, LOINC, RxNorm, MeSH, ATC, and CID-10" />
      </a>
      <ul class="mcp-cat-list">
        <li>
          <a href="https://github.com/pascalwhoop/medical-mcps" target="_blank" rel="noopener">pascalwhoop/medical-mcps</a>
          <span class="why">One server, 100+ tools: pathways (Reactome, KEGG), genes (UniProt), variants, OMIM, ChEMBL, OpenFDA, PubMed, ClinicalTrials.gov, NCI trials.</span>
        </li>
        <li>
          <a href="https://github.com/acashmoney/bio-mcp" target="_blank" rel="noopener">acashmoney/bio-mcp</a>
          <span class="why">Protein structure analysis for a model that otherwise only sees text.</span>
        </li>
        <li>
          <a href="https://github.com/cyanheads/clinicaltrialsgov-mcp-server" target="_blank" rel="noopener">cyanheads/clinicaltrialsgov-mcp-server</a>
          <span class="why">Search ClinicalTrials.gov, read a study, and match eligibility &mdash; useful on a paediatric oncology ward for &ldquo;is there a trial?&rdquo;</span>
        </li>
        <li>
          <a href="https://github.com/SidneyBissoli/medical-terminologies-mcp" target="_blank" rel="noopener">SidneyBissoli/medical-terminologies-mcp</a>
          <span class="why">The example above. ICD-11, LOINC, RxNorm, MeSH, ATC, CID-10 in one plug. SNOMED CT is opt-in and needs your own Snowstorm.</span>
        </li>
        <li>
          <a href="https://github.com/pcmedsinge/fhir-mcp-suite" target="_blank" rel="noopener">pcmedsinge/fhir-mcp-suite</a>
          <span class="why">Another codes plug: SNOMED CT, ICD, LOINC, RxNorm, plus a FHIR reader.</span>
        </li>
        <li>
          <a href="https://www.keragon.com/blog/best-mcp-servers" target="_blank" rel="noopener">Keragon Healthcare MCP</a>
          <span class="why">A commercial, HIPAA-minded connector from an AI agent into existing healthcare systems.</span>
        </li>
      </ul>
    </details>
  </div>

  <div class="phi-line">
    Never paste a real patient list &mdash; names, MRNs, dates of birth &mdash; into a consumer AI tool, even through a connector.
  </div>

  <div class="block-nav">
    <a href="{{ site.baseurl }}/block-03-skills/">&larr; 3 &middot; Skills — your house style</a>
    <a href="{{ site.baseurl }}/block-05-5-claude-md/">5 &middot; CLAUDE.md — the kitchen contract &rarr;</a>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/block-04.js"></script>
<script src="{{ site.baseurl }}/assets/js/block-04-chat.js"></script>
