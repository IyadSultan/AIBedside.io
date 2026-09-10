// Block 2 demo — click through the paper, NotebookLM, then artifact / mermaid.
// Screenshots only. Nothing is uploaded from this page.

(function () {
  "use strict";

  var LAST = 6;
  var step = 0;
  var mermaidDone = false;

  var FN_GRAPH =
    "flowchart TD\n" +
    "  FN[Fever and neutropenia] --> Cul[Blood cultures from every CVC lumen]\n" +
    "  Cul --> Unst{Clinically unstable?}\n" +
    "  Unst -->|Yes| Now[Antibiotics now — do not wait]\n" +
    "  Unst -->|No| Emp[Empiric antibiotics after cultures]\n" +
    "  Now --> Risk[Validated risk rule]\n" +
    "  Emp --> Risk\n" +
    "  Risk --> HR{High-risk?}\n" +
    "  HR -->|Yes| Mono[Antipseudomonal monotherapy]\n" +
    "  HR -->|No| Low[Consider outpatient or oral]\n" +
    "  Mono --> H48{48 hours}\n" +
    "  Low --> H48\n" +
    "  H48 --> Stop{Well, afebrile 24h, cultures negative?}\n" +
    "  Stop -->|Marrow recovery| Off[Stop antibacterials]\n" +
    "  Stop -->|Low-risk, no recovery| Consider[Consider stop]\n" +
    "  Stop -->|High-risk, no recovery| Gap[No recommendation]\n" +
    "  Stop -->|Fever persists to 96h| IFD[IFD pathway]";

  function renderMermaid() {
    var el = $("fn-mermaid");
    if (!el || mermaidDone || !window.mermaid) {
      return;
    }
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        flowchart: { curve: "basis", padding: 12 }
      });
      window.mermaid
        .render("fn-mermaid-svg", FN_GRAPH)
        .then(function (out) {
          el.innerHTML = out.svg;
          mermaidDone = true;
        })
        .catch(function (err) {
          el.textContent = "The mermaid diagram failed to draw: " + err.message;
        });
    } catch (err) {
      el.textContent = "The mermaid diagram failed to start: " + err.message;
    }
  }

  function $(id) {
    return document.getElementById(id);
  }

  function showStatus(message) {
    var status = $("demo-status");
    if (status) {
      status.textContent = message;
    }
  }

  function go(next) {
    try {
      if (next < 0) {
        next = 0;
      }
      if (next > LAST) {
        next = LAST;
      }
      step = next;

      var i;
      var stage;
      var chips = document.querySelectorAll("#demo-steps .demo-chip");
      for (i = 0; i <= LAST; i += 1) {
        stage = $("stage-" + i);
        if (stage) {
          stage.hidden = i !== step;
        }
      }
      for (i = 0; i < chips.length; i += 1) {
        if (String(i) === String(step)) {
          chips[i].classList.add("is-on");
        } else {
          chips[i].classList.remove("is-on");
        }
      }

      var nextBtn = $("demo-next");
      if (nextBtn) {
        nextBtn.textContent = step === LAST ? "Back to paper" : "Next";
      }
      if (step === LAST) {
        window.setTimeout(renderMermaid, 50);
      }
      showStatus("");
    } catch (err) {
      showStatus("The demo failed in the step change: " + err.message);
    }
  }

  function ready() {
    var nextBtn = $("demo-next");
    var chips = document.querySelectorAll("#demo-steps .demo-chip");
    var i;

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (step === LAST) {
          go(0);
        } else {
          go(step + 1);
        }
      });
    }

    for (i = 0; i < chips.length; i += 1) {
      chips[i].addEventListener("click", function (ev) {
        go(Number(ev.currentTarget.getAttribute("data-step")));
      });
    }

    go(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
