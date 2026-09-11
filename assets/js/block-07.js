// Block 7 demo — click through the Zotero MCP install: Zotero → install → connect → check → ask.
// Copy buttons copy the command next to them. Nothing is sent anywhere from this page.

(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

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

  function bindCopy() {
    var buttons = document.querySelectorAll(".b7-copy");
    var statusEl = $("demo-status");

    function tell(message) {
      if (statusEl) {
        statusEl.textContent = message;
      }
    }

    function onClick(ev) {
      var btn = ev.currentTarget;
      var pre = $(btn.getAttribute("data-target"));
      var text = pre ? (pre.textContent || "").replace(/^\s+|\s+$/g, "") : "";
      if (!text) {
        tell("Nothing to copy.");
        return;
      }

      function ok() {
        tell("Copied. Paste it into the terminal and press Enter.");
      }

      function fail(err) {
        tell("Copy failed: " + (err && err.message ? err.message : "select the line and copy it yourself."));
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(ok).catch(fail);
        } else {
          fail(new Error("this browser has no clipboard API"));
        }
      } catch (err) {
        fail(err);
      }
    }

    var i;
    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener("click", onClick);
    }
  }

  function ready() {
    bindDemo({
      prefix: "stage-",
      chipsId: "demo-steps",
      nextId: "demo-next",
      statusId: "demo-status",
      last: 6,
      resetLabel: "Back to the path"
    });
    bindCopy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
