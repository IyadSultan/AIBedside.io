// Block 0 demo — two canned answers for one synthetic case.
// Nothing is sent to a real model. That keeps the talk working offline.

(function () {
  "use strict";

  var CASE_FACTS = ["anc", "80", "38.8", "38.8°", "central line", "penicillin", "b-all", "day 10"];
  var ROLE_WORDS = ["you are", "pediatric oncolog", "registrar", "role:", "persona"];
  var FORMAT_WORDS = ["format", "do not invent", "don't invent", "immediate action", "teaching case"];

  var PRESETS = {
    lazy: "what to do for a kid with fever after chemo",
    briefing:
      "You are a pediatric oncologist briefing a registrar on a childhood-cancer unit.\n\n" +
      "Synthetic case (not a real patient):\n" +
      "- 6-year-old, B-ALL, day 10 after intensification\n" +
      "- Tunneled central line\n" +
      "- Fever 38.8°C at home for 2 hours\n" +
      "- ANC this morning 80 /µL\n" +
      "- Penicillin allergy (rash)\n" +
      "- Parents ask if they can wait for the morning clinic\n\n" +
      "Task: what should happen in the next 60 minutes.\n\n" +
      "Rules:\n" +
      "- Do not invent citations\n" +
      "- Say what you are unsure about\n" +
      "- This is teaching, not an order\n\n" +
      "Format:\n" +
      "1) Immediate actions\n" +
      "2) What not to miss\n" +
      "3) One sentence for the parent"
  };

  var ANSWERS = {
    lazy: {
      tone: "lazy",
      html:
        "<p>Fever after chemotherapy is common. Give paracetamol, encourage fluids, and review in the morning clinic if she is otherwise well. A 2019 Smith review found most of these episodes settle at home.</p>" +
        "<p>If she looks unwell, consider antibiotics.</p>"
    },
    middle: {
      tone: "middle",
      html:
        "<p>Fever in a child on chemotherapy can be serious. She should be assessed the same day, and the team will usually check a blood count and consider antibiotics.</p>" +
        "<p>I do not have enough detail here (counts, lines, allergies, timing) to be more specific.</p>"
    },
    briefing: {
      tone: "briefing",
      html:
        "<p><strong>This is a teaching case, not an order.</strong></p>" +
        "<ol>" +
        "<li><strong>Next 60 minutes.</strong> Do not wait for morning clinic. A neutropenic child with a central line and fever is treated as an emergency: come in now, culture, and start the unit’s first-line fever-and-neutropenia antibiotics after the first set of cultures.</li>" +
        "<li><strong>Do not miss.</strong> ANC 80; tunneled line; penicillin rash — pick an agent the local protocol allows in penicillin allergy. Recheck blood pressure, perfusion, and whether the line site looks infected.</li>" +
        "<li><strong>One sentence for the parent.</strong> “Fever with a low count and a central line is treated as urgent; we need her here tonight, not in the morning clinic.”</li>" +
        "</ol>" +
        "<p>I am not inventing a paper. Use your unit protocol and the current SIOP / local febrile-neutropenia guideline.</p>"
    }
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

  // Decide which canned answer to show from what is in the box.
  function classify(prompt) {
    var text = (prompt || "").toLowerCase();
    var hasFacts = containsAny(text, CASE_FACTS);
    var hasRole = containsAny(text, ROLE_WORDS);
    var hasFormat = containsAny(text, FORMAT_WORDS);

    if ((hasRole && hasFacts) || (hasFacts && hasFormat)) {
      return "briefing";
    }
    if (hasFacts || hasRole || hasFormat) {
      return "middle";
    }
    return "lazy";
  }

  function showStatus(message) {
    var status = $("demo-status");
    if (!status) {
      return;
    }
    status.textContent = message;
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
        showStatus("Type a prompt, or load one of the two examples first.");
        return;
      }

      if (askBtn) {
        askBtn.disabled = true;
      }
      showStatus("Asking the model…");

      // Short pause so the click feels like a question, not a page jump.
      window.setTimeout(function () {
        var key = classify(prompt);
        renderAnswer(key);
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

  function loadPreset(name) {
    var promptBox = $("demo-prompt");
    if (!promptBox || !PRESETS[name]) {
      return;
    }
    promptBox.value = PRESETS[name];
    promptBox.focus();
    showStatus("");
  }

  function ready() {
    var askBtn = $("demo-ask");
    var lazyBtn = $("load-lazy");
    var briefingBtn = $("load-briefing");

    if (askBtn) {
      askBtn.addEventListener("click", ask);
    }
    if (lazyBtn) {
      lazyBtn.addEventListener("click", function () {
        loadPreset("lazy");
      });
    }
    if (briefingBtn) {
      briefingBtn.addEventListener("click", function () {
        loadPreset("briefing");
      });
    }

    // Start with the lazy prompt so the first click is one step.
    loadPreset("lazy");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
