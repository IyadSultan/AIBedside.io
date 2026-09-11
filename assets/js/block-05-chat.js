// Block 5 live chat — Prism ML Bonsai 1.7B (1-bit) in this browser tab.
// Weights download from Hugging Face once, then the Cache API keeps them.
// After that, inference does not need the network. No server, no API key.

(function () {
  "use strict";

  var LIB_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";
  var MODEL_ID = "onnx-community/Bonsai-1.7B-ONNX";
  var TASK = "text-generation";
  var DTYPE = "q1";

  // Short briefing. /no_think tells Qwen3-style models not to open a thinking block.
  var SYSTEM =
    "You are a copy editor on a childhood-cancer ward. When asked to fix English, spelling, or grammar, return only the corrected text. Keep medical terms and numbers exactly. Do not add clinical advice or new facts. If the user is not asking for a language fix, answer in two short sentences. Do not use a thinking block. /no_think";

  // One worked example so this small model copies the job, not a lecture.
  var FEWSHOT_USER =
    "Fix the English. Keep medical terms and numbers. Return only the corrected text: The child have fever since yesterday.";
  var FEWSHOT_ASSISTANT = "The child has had a fever since yesterday.";

  var tf = null;
  var generator = null;
  var deviceUsed = "";
  var busy = false;
  var turns = [];

  function $(id) {
    return document.getElementById(id);
  }

  function setHealth(text, kind) {
    var el = $("bonsai-health");
    if (!el) {
      return;
    }
    el.textContent = text;
    el.className = "bonsai-health" + (kind ? " is-" + kind : "");
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatText(text) {
    var escaped = escapeHtml(text);
    escaped = escaped.replace(/\n/g, "<br>");
    return "<p>" + escaped + "</p>";
  }

  // Bonsai / Qwen3 sometimes wraps a private scratch pad in think tags.
  function stripThink(text) {
    var cleaned = String(text || "");
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");
    cleaned = cleaned.replace(/<think>[\s\S]*$/gi, "");
    cleaned = cleaned.replace(/<\/?think>/gi, "");
    return cleaned.replace(/^\s+/, "").replace(/\s+$/, "");
  }

  function clearEmpty(thread) {
    var empty = thread.querySelector(".bonsai-empty");
    if (empty) {
      empty.remove();
    }
  }

  function addUser(thread, text) {
    clearEmpty(thread);
    var row = document.createElement("div");
    row.className = "bonsai-row is-user";
    row.innerHTML = '<div class="bonsai-bubble">' + formatText(text) + "</div>";
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
  }

  function addBotShell(thread) {
    clearEmpty(thread);
    var row = document.createElement("div");
    row.className = "bonsai-row is-bot";
    row.innerHTML =
      '<div class="bonsai-bubble"><span class="bonsai-wait" aria-label="Bonsai is writing"><i></i><i></i><i></i></span></div>';
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
    return row.querySelector(".bonsai-bubble");
  }

  function setComposerEnabled(on) {
    var input = $("bonsai-input");
    var send = $("bonsai-send");
    if (input) {
      input.disabled = !on;
    }
    if (send) {
      send.disabled = !on;
    }
  }

  function setProgress(pct) {
    var meter = $("bonsai-meter");
    var fill = $("bonsai-meter-fill");
    if (!meter || !fill) {
      return;
    }
    meter.hidden = false;
    var n = Math.max(0, Math.min(100, Math.round(pct)));
    fill.style.width = n + "%";
  }

  function hideProgress() {
    var meter = $("bonsai-meter");
    if (meter) {
      meter.hidden = true;
    }
  }

  function webgpuOk() {
    return Boolean(navigator.gpu);
  }

  async function loadLib() {
    if (tf) {
      return tf;
    }
    tf = await import(LIB_URL);
    return tf;
  }

  async function isCached(device) {
    try {
      var lib = await loadLib();
      if (!lib.ModelRegistry || !lib.ModelRegistry.is_pipeline_cached) {
        return false;
      }
      return await lib.ModelRegistry.is_pipeline_cached(TASK, MODEL_ID, {
        device: device,
        dtype: DTYPE,
      });
    } catch (err) {
      return false;
    }
  }

  function onProgress(info) {
    try {
      if (!info) {
        return;
      }
      if (info.status === "progress_total" && typeof info.progress === "number") {
        setProgress(info.progress);
        setHealth("Downloading Bonsai 1.7B… " + Math.round(info.progress) + "%");
        return;
      }
      if (info.status === "progress" && typeof info.progress === "number") {
        setProgress(info.progress);
      }
    } catch (err) {
      setHealth("Progress display failed: " + err.message, "down");
    }
  }

  async function makePipeline(device) {
    var lib = await loadLib();
    return lib.pipeline(TASK, MODEL_ID, {
      device: device,
      dtype: DTYPE,
      progress_callback: onProgress,
    });
  }

  async function loadModel() {
    var btn = $("bonsai-load");
    if (busy) {
      return;
    }
    busy = true;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Loading…";
    }

    try {
      setHealth("Opening the in-browser library…");
      await loadLib();

      var preferGpu = webgpuOk();
      var firstDevice = preferGpu ? "webgpu" : "wasm";
      var cached = await isCached(firstDevice);
      if (cached) {
        setHealth("Found on this laptop. Opening from the browser cache…");
      } else {
        setHealth(
          "First load is about 290 MB. After that it stays in this browser."
        );
        setProgress(1);
      }

      try {
        generator = await makePipeline(firstDevice);
        deviceUsed = firstDevice;
      } catch (gpuErr) {
        if (firstDevice !== "webgpu") {
          throw gpuErr;
        }
        setHealth(
          "WebGPU failed (" +
            gpuErr.message +
            "). Trying the slower CPU path…"
        );
        generator = await makePipeline("wasm");
        deviceUsed = "wasm";
      }

      hideProgress();
      var where =
        deviceUsed === "webgpu"
          ? "on this computer's GPU"
          : "on this computer's CPU (slower)";
      setHealth("Ready " + where + ". You can switch the wi-fi off now.", "up");
      if (btn) {
        btn.textContent = "Loaded";
      }
      setComposerEnabled(true);
      var input = $("bonsai-input");
      if (input) {
        input.focus();
      }
    } catch (err) {
      hideProgress();
      setHealth(
        "Load failed in the model-download step: " + err.message,
        "down"
      );
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Retry load";
      }
    } finally {
      busy = false;
    }
  }

  function buildMessages(userText) {
    var messages = [
      { role: "system", content: SYSTEM },
      { role: "user", content: FEWSHOT_USER },
      { role: "assistant", content: FEWSHOT_ASSISTANT },
    ];
    var recent = turns.slice(-4);
    var i;
    for (i = 0; i < recent.length; i += 1) {
      messages.push(recent[i]);
    }
    messages.push({ role: "user", content: userText });
    return messages;
  }

  async function ask(userText) {
    var thread = $("bonsai-thread");
    var text = String(userText || "").replace(/^\s+|\s+$/g, "");
    if (!text) {
      return;
    }
    if (!generator || !tf) {
      setHealth("Load the model first.", "down");
      return;
    }
    if (busy) {
      return;
    }

    busy = true;
    setComposerEnabled(false);
    addUser(thread, text);
    var bubble = addBotShell(thread);
    var streamed = "";

    try {
      var streamer = new tf.TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: function (chunk) {
          streamed += chunk;
          var shown = stripThink(streamed);
          if (shown) {
            bubble.innerHTML = formatText(shown);
            thread.scrollTop = thread.scrollHeight;
          }
        },
      });

      var output = await generator(buildMessages(text), {
        max_new_tokens: 140,
        do_sample: false,
        streamer: streamer,
      });

      var reply = "";
      try {
        var last = output[0].generated_text;
        if (Array.isArray(last)) {
          reply = last[last.length - 1].content || "";
        } else {
          reply = String(last || "");
        }
      } catch (parseErr) {
        reply = streamed;
      }

      reply = stripThink(reply) || stripThink(streamed);
      if (!reply) {
        reply = "I could not finish a correction. Try a shorter sentence.";
      }

      bubble.innerHTML = formatText(reply);
      turns.push({ role: "user", content: text });
      turns.push({ role: "assistant", content: reply });
      thread.scrollTop = thread.scrollHeight;
    } catch (err) {
      bubble.innerHTML =
        '<p class="bonsai-error">The reply failed in the generate step: ' +
        escapeHtml(err.message) +
        "</p>";
    } finally {
      busy = false;
      setComposerEnabled(true);
      var input = $("bonsai-input");
      if (input) {
        input.focus();
      }
    }
  }

  async function ready() {
    try {
      var loadBtn = $("bonsai-load");
      var form = $("bonsai-form");
      var hints = document.querySelectorAll("#bonsai-hints button");
      var i;

      if (loadBtn) {
        loadBtn.addEventListener("click", function () {
          loadModel();
        });
      }

      if (form) {
        form.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var input = $("bonsai-input");
          var q = input ? input.value : "";
          if (input) {
            input.value = "";
          }
          ask(q);
        });
      }

      var box = $("bonsai-input");
      if (box) {
        box.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            if (form) {
              form.requestSubmit();
            }
          }
        });
      }

      for (i = 0; i < hints.length; i += 1) {
        hints[i].addEventListener("click", function (ev) {
          var q = ev.currentTarget.getAttribute("data-q") || "";
          var input = $("bonsai-input");
          if (input && !generator) {
            input.value = q;
          }
          if (generator) {
            ask(q);
          } else {
            setHealth("Load the model, then tap the same chip again.");
          }
        });
      }

      if (!webgpuOk()) {
        setHealth(
          "This browser has no WebGPU. You can still load on CPU — it will be slow. Chrome or Edge is better."
        );
      }
    } catch (err) {
      setHealth("The chat setup failed: " + err.message, "down");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
