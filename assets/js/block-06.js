// Block 6 demo — click through prompt → skill → PRD → Replit app → what you still owe.
// The prompt is copied locally. Nothing is sent to Claude from this page.

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

  function tellStatus(message) {
    var statusEl = $("demo-status") || $("b6-prd-status");
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  function bindCopy() {
    var btn = $("b6-copy");
    var pre = $("b6-prompt");
    if (!btn || !pre) {
      return;
    }

    btn.addEventListener("click", function () {
      var text = (pre.textContent || "").replace(/^\s+|\s+$/g, "");
      if (!text) {
        tellStatus("The prompt box was empty.");
        return;
      }

      function ok() {
        tellStatus("Copied. Paste it into Claude with prd-builder on.");
      }

      function fail(err) {
        tellStatus("Copy failed: " + (err && err.message ? err.message : "select the prompt and copy it yourself."));
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
    });
  }

  function ready() {
    if ($("demo-steps")) {
      bindDemo({
        prefix: "stage-",
        chipsId: "demo-steps",
        nextId: "demo-next",
        statusId: "demo-status",
        last: 5,
        resetLabel: "Back to the path"
      });
    }
    bindCopy();
    bindCopyPrd();
  }

  function bindCopyPrd() {
    var btn = $("b6-copy-prd");
    if (!btn) {
      return;
    }

    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-prd");
      if (!url) {
        tellStatus("The PRD link was missing.");
        return;
      }

      function ok() {
        tellStatus("Copied. Paste it into Replit.");
      }

      function fail(err) {
        tellStatus("Copy failed: " + (err && err.message ? err.message : "download the PRD and paste it yourself."));
      }

      try {
        fetch(url)
          .then(function (res) {
            if (!res.ok) {
              throw new Error("could not load the PRD file");
            }
            return res.text();
          })
          .then(function (text) {
            var clean = (text || "").replace(/^\s+|\s+$/g, "");
            if (!clean) {
              throw new Error("the PRD file was empty");
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
              return navigator.clipboard.writeText(clean).then(ok);
            }
            throw new Error("this browser has no clipboard API");
          })
          .catch(fail);
      } catch (err) {
        fail(err);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
