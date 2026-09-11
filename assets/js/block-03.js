// Block 3 demo — two click-throughs on this page:
// 1) build / run / share a ward-thread skill
// 2) find a statistics skill on the web, then open the sample-size artifact
// Nothing is sent to Claude from this page.

(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  // One stepper can drive any row of chips + stages.
  // prefix: id stem for stages ("stage-" or "find-stage-")
  // chipsId: the row of buttons
  // nextId / statusId: the Next button and the live status line
  // last: highest step number
  // resetLabel: what the Next button says on the last step
  function bindDemo(opts) {
    var step = 0;
    var last = opts.last;
    var chips = document.querySelectorAll("#" + opts.chipsId + " .demo-chip");
    var nextBtn = $(opts.nextId);
    var statusEl = $(opts.statusId);

    function showStatus(message) {
      if (statusEl) {
        statusEl.textContent = message;
      }
    }

    function go(next) {
      try {
        if (next < 0) {
          next = 0;
        }
        if (next > last) {
          next = last;
        }
        step = next;

        var i;
        var stage;
        for (i = 0; i <= last; i += 1) {
          stage = $(opts.prefix + i);
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

        if (nextBtn) {
          nextBtn.textContent = step === last ? opts.resetLabel : "Next";
        }
        showStatus("");
      } catch (err) {
        showStatus("The demo failed in the step change: " + err.message);
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (step === last) {
          go(0);
        } else {
          go(step + 1);
        }
      });
    }

    var i;
    for (i = 0; i < chips.length; i += 1) {
      chips[i].addEventListener("click", function (ev) {
        go(Number(ev.currentTarget.getAttribute("data-step")));
      });
    }

    go(0);
  }

  function ready() {
    bindDemo({
      prefix: "stage-",
      chipsId: "demo-steps",
      nextId: "demo-next",
      statusId: "demo-status",
      last: 6,
      resetLabel: "Back to what a skill is"
    });

    bindDemo({
      prefix: "find-stage-",
      chipsId: "find-steps",
      nextId: "find-next",
      statusId: "find-status",
      last: 4,
      resetLabel: "Back to the Google search"
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
