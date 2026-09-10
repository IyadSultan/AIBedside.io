// Block 1 demo — build a prompt in four pieces, same synthetic case.
// Nothing is sent to a real model.

(function () {
  "use strict";

  var BASE = "Write a note the parents can take home about tonight.";

  var PIECES = {
    role:
      "You are a pediatric oncology nurse writing for a parent who finished primary school.",
    context:
      "Synthetic case (not a real patient):\n" +
      "- 6-year-old, B-ALL, day 10 after intensification\n" +
      "- Tunneled central line\n" +
      "- Fever 38.8°C at home for 2 hours\n" +
      "- ANC this morning 80 /µL\n" +
      "- Penicillin allergy (rash)\n" +
      "- The child is coming to the unit now. The parents asked if they could wait until morning clinic.",
    constraints:
      "Rules:\n" +
      "- Do not invent citations\n" +
      "- Do not use a patient name\n" +
      "- Grade 6 reading level\n" +
      "- This is teaching, not a discharge order\n" +
      "- Do not tell them they can wait at home",
    format:
      "Format — a short note they can keep:\n" +
      "1) What is happening\n" +
      "2) What we will do tonight\n" +
      "3) What they should watch for\n" +
      "4) One sentence they can repeat to family"
  };

  var ORDER = ["role", "context", "constraints", "format"];

  var DETECT = {
    role: ["you are", "nurse", "primary school"],
    context: ["anc", "80", "central line", "penicillin", "b-all", "38.8"],
    constraints: ["do not invent", "grade 6", "not a discharge", "wait at home"],
    format: ["what is happening", "watch for", "repeat to family", "short note"]
  };

  var ANSWERS = {
    none: {
      tone: "lazy",
      html:
        "<p>Your child has a fever after chemotherapy. Give paracetamol and bring them to the morning clinic if they are otherwise well. A 2019 Smith review found most of these episodes settle at home.</p>"
    },
    thin: {
      tone: "middle",
      html:
        "<p>I am happy to help you think about tonight. Fever after chemo can be serious, so it is better to check with the team. Keep your child comfortable and call if you are worried.</p>"
    },
    facts: {
      tone: "middle",
      html:
        "<p>Your child is day 10 post-intensification for B-ALL with an ANC of 80 and a tunneled line. Pyrexia of 38.8°C meets criteria for febrile neutropenia. Empiric antipseudomonal cover will be started after cultures; avoid penicillin given the rash. Present to the unit now rather than the morning clinic.</p>"
    },
    careful: {
      tone: "briefing",
      html:
        "<p>Your child has a fever and a very low white-cell count, and they have a central line. That combination is treated as urgent. We want them on the unit tonight, not at home until morning. We will take blood tests and start antibiotics that are safe with the penicillin rash. I am not quoting a paper; we will follow the unit protocol.</p>"
    },
    document: {
      tone: "briefing",
      html:
        "<p><strong>What is happening.</strong> Your child has a fever and a very low infection-fighting count. They also have a central line. We treat that as urgent.</p>" +
        "<p><strong>What we will do tonight.</strong> Come to the unit now. We will take blood, look at the line, and start antibiotics that are safe with the penicillin rash.</p>" +
        "<p><strong>What to watch for.</strong> New shivering, looking much more tired, fast breathing, or a red line site — tell the nurse at once.</p>" +
        "<p><strong>One sentence for family.</strong> “Fever with a low count and a line means we come in tonight, not in the morning.”</p>" +
        "<p>This is a teaching note, not a discharge order.</p>"
    }
  };

  var selected = {
    role: false,
    context: false,
    constraints: false,
    format: false
  };

  function $(id) {
    return document.getElementById(id);
  }

  function containsAny(text, words) {
    var i;
    for (i = 0; i < words.length; i += 1) {
      if (text.indexOf(words[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  function buildPrompt() {
    var parts = [BASE];
    var i;
    var key;
    for (i = 0; i < ORDER.length; i += 1) {
      key = ORDER[i];
      if (selected[key]) {
        parts.push(PIECES[key]);
      }
    }
    return parts.join("\n\n");
  }

  function piecesInText(text) {
    var found = {};
    var i;
    var key;
    text = (text || "").toLowerCase();
    for (i = 0; i < ORDER.length; i += 1) {
      key = ORDER[i];
      found[key] = containsAny(text, DETECT[key]);
    }
    return found;
  }

  function classify(prompt) {
    var found = piecesInText(prompt);
    var n = 0;
    var i;
    for (i = 0; i < ORDER.length; i += 1) {
      if (found[ORDER[i]]) {
        n += 1;
      }
    }
    if (found.role && found.context && found.constraints && found.format) {
      return "document";
    }
    if (n === 0) {
      return "none";
    }
    if (found.context && found.constraints) {
      return "careful";
    }
    if (found.context) {
      return "facts";
    }
    return "thin";
  }

  function showStatus(message) {
    var status = $("demo-status");
    if (status) {
      status.textContent = message;
    }
  }

  function syncChips() {
    var i;
    var key;
    var btn;
    for (i = 0; i < ORDER.length; i += 1) {
      key = ORDER[i];
      btn = $("piece-" + key);
      if (!btn) {
        continue;
      }
      if (selected[key]) {
        btn.classList.add("is-on");
      } else {
        btn.classList.remove("is-on");
      }
    }
  }

  function writePrompt() {
    var box = $("demo-prompt");
    if (box) {
      box.value = buildPrompt();
    }
  }

  function togglePiece(key) {
    selected[key] = !selected[key];
    syncChips();
    writePrompt();
    showStatus("");
  }

  function renderAnswer(key) {
    var answer = ANSWERS[key];
    var box = $("demo-response");
    if (!box || !answer) {
      return;
    }
    box.setAttribute("data-tone", answer.tone);
    box.innerHTML = answer.html;
    box.hidden = false;
    $("demo-response-wrap").hidden = false;
  }

  function ask() {
    try {
      var promptBox = $("demo-prompt");
      var askBtn = $("demo-ask");
      var prompt = promptBox ? promptBox.value.trim() : "";

      if (!prompt) {
        showStatus("Add a prompt first.");
        return;
      }

      if (askBtn) {
        askBtn.disabled = true;
      }
      showStatus("Asking the model…");

      window.setTimeout(function () {
        renderAnswer(classify(prompt));
        showStatus("");
        if (askBtn) {
          askBtn.disabled = false;
          askBtn.focus();
        }
      }, 450);
    } catch (err) {
      showStatus("The demo failed in the ask step: " + err.message);
    }
  }

  function ready() {
    var i;
    var key;
    var btn;
    var askBtn = $("demo-ask");

    for (i = 0; i < ORDER.length; i += 1) {
      key = ORDER[i];
      btn = $("piece-" + key);
      if (btn) {
        btn.addEventListener("click", function (ev) {
          togglePiece(ev.currentTarget.getAttribute("data-piece"));
        });
      }
    }

    if (askBtn) {
      askBtn.addEventListener("click", ask);
    }

    writePrompt();
    syncChips();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
