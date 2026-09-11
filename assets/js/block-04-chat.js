// Block 4 live Claude — Haiku 4.5 with and without the terminology MCP.
// Calls the Anthropic API straight from the browser with a key the presenter
// pastes into the page. The key lives in sessionStorage for this tab only and
// is never written to the repo or sent anywhere except api.anthropic.com.

(function () {
  "use strict";

  var MARK =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1.2c.35 0 .62.22.74.56l1.72 4.86 5.08.58c.8.09 1.12 1.05.52 1.58l-3.82 3.38 1.06 5.02c.16.78-.68 1.36-1.34.94L12 16.4l-4.96 2.12c-.66.42-1.5-.16-1.34-.94l1.06-5.02-3.82-3.38c-.6-.53-.28-1.49.52-1.58l5.08-.58L11.26 1.76c.12-.34.39-.56.74-.56z"/></svg>';

  var SEND =
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 4.2 12 19.2M12 4.2 6.8 9.4M12 4.2 17.2 9.4" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

  var history = {
    plain: [],
    mcp: []
  };

  var API_URL = "https://api.anthropic.com/v1/messages";
  var MODEL = "claude-haiku-4-5";
  var MCP_URL = "https://medical.sidneybissoli.com/mcp";
  var MCP_NAME = "medical-terms";
  var KEY_STORE = "aibedside.anthropic_key";
  var MAX_HISTORY = 8;

  var SYSTEM_PLAIN =
    "You are Claude, in a teaching demo for a childhood-cancer conference.\n\n" +
    "You do NOT have a live terminology plug. You cannot look up ICD-11, RxNorm, LOINC, MeSH, or ATC from a database.\n\n" +
    "If the question is a code, mapping, or official display name:\n" +
    "- Answer from training memory if you can.\n" +
    "- Say clearly that this is recalled, not a live lookup.\n" +
    "- If you are unsure of the current code, say so. Do not invent a confident code.\n\n" +
    "Keep the answer short enough to read on a projector (about 120 words).\n" +
    "This is teaching, not clinical advice. Never ask for or use a real patient name, MRN, or date of birth.";

  var SYSTEM_MCP =
    "You are Claude, in a teaching demo for a childhood-cancer conference.\n\n" +
    "You HAVE a medical-terminologies MCP plug: ICD-11, LOINC, RxNorm, MeSH, ATC, CID-10, and ICD-10 to ICD-11 mapping.\n\n" +
    "When the question is a code, mapping, drug name, lab code, or official term, USE the tools. Do not guess a code if a tool can look it up.\n\n" +
    "After a tool returns:\n" +
    "- Lead with the official code and display name.\n" +
    "- Name the source (WHO ICD-11, RxNorm, LOINC, MeSH, ATC).\n" +
    "- Keep the answer short enough to read on a projector (about 120 words).\n\n" +
    "This is teaching, not clinical advice. Never ask for or use a real patient name, MRN, or date of birth.";

  var busy = false;

  function $(id) {
    return document.getElementById(id);
  }

  function getKey() {
    try {
      return (window.sessionStorage.getItem(KEY_STORE) || "").trim();
    } catch (err) {
      return "";
    }
  }

  function setKey(value) {
    try {
      if (value) {
        window.sessionStorage.setItem(KEY_STORE, value);
      } else {
        window.sessionStorage.removeItem(KEY_STORE);
      }
    } catch (err) {
      // private mode without storage: the key simply lasts one page view
    }
  }

  function formatText(text) {
    var escaped = String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    escaped = escaped
      .split(/\n{2,}/)
      .map(function (para) {
        return "<p>" + para.replace(/\n/g, "<br>") + "</p>";
      })
      .join("");
    return escaped;
  }

  function clearEmpty(thread) {
    var empty = thread.querySelector(".claude-empty");
    if (empty) {
      empty.remove();
    }
  }

  function addUser(thread, text) {
    clearEmpty(thread);
    var row = document.createElement("div");
    row.className = "claude-row is-user";
    row.innerHTML =
      '<div class="claude-bubble">' + formatText(text) + "</div>";
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
  }

  function addBotShell(thread) {
    clearEmpty(thread);
    var row = document.createElement("div");
    row.className = "claude-row is-bot";
    row.innerHTML =
      '<span class="claude-avatar">' +
      MARK +
      "</span>" +
      '<div class="claude-bubble">' +
      '<span class="claude-wait" aria-label="Claude is writing"><i></i><i></i><i></i></span>' +
      "</div>";
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
    return row.querySelector(".claude-bubble");
  }

  function addTool(bubble, ev) {
    var wait = bubble.querySelector(".claude-wait");
    if (wait) {
      wait.remove();
    }
    var card = document.createElement("div");
    card.className = "claude-tool";
    if (ev.type === "tool") {
      card.innerHTML =
        '<span class="k">Using ' +
        (ev.name || "tool") +
        "</span>" +
        formatText(ev.detail || "");
    } else {
      card.innerHTML =
        '<span class="k">' +
        (ev.ok === false ? "Tool error" : "Tool result") +
        "</span>" +
        formatText(ev.detail || "");
    }
    bubble.appendChild(card);
    bubble.parentNode.parentNode.scrollTop =
      bubble.parentNode.parentNode.scrollHeight;
  }

  function finishBot(bubble, text, isError) {
    var wait = bubble.querySelector(".claude-wait");
    if (wait) {
      wait.remove();
    }
    var block = document.createElement("div");
    if (isError) {
      block.className = "claude-error";
      block.textContent = text;
    } else {
      block.innerHTML = formatText(text);
    }
    bubble.appendChild(block);
    var thread = bubble.parentNode.parentNode;
    thread.scrollTop = thread.scrollHeight;
  }

  function trimSnippet(value, limit) {
    var text = String(value || "").trim().replace(/\n/g, " ");
    return text.length > limit ? text.slice(0, limit) + "…" : text;
  }

  function toolEvent(block) {
    if (block.type === "mcp_tool_use") {
      var shown = "";
      try {
        shown = JSON.stringify(block.input || {});
      } catch (err) {
        shown = String(block.input || "");
      }
      return { type: "tool", name: block.name || "tool", detail: trimSnippet(shown, 400) };
    }
    if (block.type === "mcp_tool_result") {
      var snippet = "";
      if (Array.isArray(block.content) && block.content.length) {
        snippet = block.content[0].text || "";
      } else if (typeof block.content === "string") {
        snippet = block.content;
      }
      return {
        type: "tool_result",
        ok: !block.is_error,
        detail: trimSnippet(snippet, 280) || (block.is_error ? "Tool error" : "Tool finished")
      };
    }
    return null;
  }

  function callClaude(useMcp, messages) {
    var headers = {
      "Content-Type": "application/json",
      "x-api-key": getKey(),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    };
    var body = {
      model: MODEL,
      max_tokens: 900,
      system: useMcp ? SYSTEM_MCP : SYSTEM_PLAIN,
      messages: messages
    };
    if (useMcp) {
      headers["anthropic-beta"] = "mcp-client-2025-11-20";
      body.mcp_servers = [{ type: "url", url: MCP_URL, name: MCP_NAME }];
      body.tools = [{ type: "mcp_toolset", mcp_server_name: MCP_NAME }];
    }
    return fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          var msg = (data && data.error && data.error.message) || ("HTTP " + res.status);
          if (res.status === 401) {
            msg = "The API key was rejected. Use “Forget key” and paste it again.";
          }
          throw new Error(msg);
        }
        return data;
      });
    });
  }

  function askPane(mode, prompt) {
    var thread = $("claude-thread-" + mode);
    var useMcp = mode === "mcp";
    addUser(thread, prompt);
    var bubble = addBotShell(thread);
    var messages = history[mode].slice(-MAX_HISTORY).concat([{ role: "user", content: prompt }]);

    return callClaude(useMcp, messages)
      .then(function (data) {
        var parts = [];
        (data.content || []).forEach(function (block) {
          var ev = toolEvent(block);
          if (ev) {
            addTool(bubble, ev);
          } else if (block.type === "text" && block.text) {
            parts.push(block.text);
          }
        });
        var collected = parts.join("\n\n").trim();
        if (!collected) {
          collected = useMcp
            ? "Haiku returned no text. The terms plug may have failed — try again."
            : "No text came back. Try the question once more.";
        }
        finishBot(bubble, collected, false);
        history[mode].push({ role: "user", content: prompt });
        history[mode].push({ role: "assistant", content: collected });
      })
      .catch(function (err) {
        var raw = (err && err.message) || "";
        if (!raw || raw === "Failed to fetch" || raw === "Load failed") {
          raw = "Could not reach api.anthropic.com. Check the network and try again.";
        }
        finishBot(bubble, raw, true);
      });
  }

  function setBusy(on) {
    busy = on;
    syncComposer();
  }

  function syncComposer() {
    var send = $("claude-send");
    var input = $("claude-input");
    var locked = busy || !getKey();
    if (send) {
      send.disabled = locked;
    }
    if (input) {
      input.disabled = locked;
    }
  }

  function sendPrompt(prompt) {
    prompt = (prompt || "").trim();
    if (!prompt || busy) {
      return;
    }
    if (!getKey()) {
      syncKeyRow();
      return;
    }
    var input = $("claude-input");
    if (input) {
      input.value = "";
      input.style.height = "auto";
    }
    setBusy(true);
    Promise.all([askPane("plain", prompt), askPane("mcp", prompt)]).then(
      function () {
        setBusy(false);
        if (input) {
          input.focus();
        }
      }
    );
  }

  function syncKeyRow() {
    var row = $("claude-key-form");
    var el = $("claude-health");
    var has = !!getKey();
    if (row) {
      row.className = "claude-keyrow" + (has ? " is-set" : "");
    }
    if (el) {
      el.className = "claude-health " + (has ? "is-up" : "is-down");
      el.textContent = has
        ? "Haiku 4.5 ready · terms plug on the right"
        : "Paste an Anthropic API key to start.";
    }
    syncComposer();
  }

  function ready() {
    var form = $("claude-form");
    var input = $("claude-input");
    var send = $("claude-send");
    var hints = $("claude-hints");

    if (send) {
      send.innerHTML = SEND;
    }

    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        sendPrompt(input ? input.value : "");
      });
    }

    if (input) {
      input.addEventListener("input", function () {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 120) + "px";
      });
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          sendPrompt(input.value);
        }
      });
    }

    if (hints) {
      hints.addEventListener("click", function (ev) {
        var btn = ev.target.closest("button");
        if (!btn) {
          return;
        }
        sendPrompt(btn.getAttribute("data-q") || btn.textContent);
      });
    }

    var keyForm = $("claude-key-form");
    var keyInput = $("claude-key");
    var keyClear = $("claude-key-clear");

    if (keyForm) {
      keyForm.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var value = keyInput ? keyInput.value.trim() : "";
        if (!value) {
          return;
        }
        setKey(value);
        keyInput.value = "";
        syncKeyRow();
        if (input) {
          input.focus();
        }
      });
    }

    if (keyClear) {
      keyClear.addEventListener("click", function () {
        setKey("");
        syncKeyRow();
        if (keyInput) {
          keyInput.focus();
        }
      });
    }

    syncKeyRow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
