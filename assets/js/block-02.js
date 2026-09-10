// Block 2 demo — click through the paper, NotebookLM, then artifact / mermaid.
// Screenshots only. Nothing is uploaded from this page.

(function () {
  "use strict";

  var LAST = 6;
  var step = 0;

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
