// Block 4 live Claude — Haiku 4.5 with and without the terminology MCP.
// Talks to the local server at mcp-chat/server.py. The API key never leaves that server.

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

  var busy = false;
  var serverUp = false;
  var healthTimer = null;

  function $(id) {
    return document.getElementById(id);
  }

  function apiRoot() {
    try {
      var q = new URLSearchParams(window.location.search).get("chat");
      if (q) {
        return q.replace(/\/$/, "");
      }
    } catch (err) {
      // keep the laptop default
    }
    if (window.location.port === "8765") {
      return "";
    }
    return "http://127.0.0.1:8765";
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

  function readSSE(response, onEvent) {
    return new Promise(function (resolve, reject) {
      if (!response.body || !response.body.getReader) {
        reject(new Error("This browser cannot stream the reply."));
        return;
      }
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = "";

      function pump() {
        reader
          .read()
          .then(function (result) {
            if (result.done) {
              resolve();
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            var chunks = buffer.split("\n\n");
            buffer = chunks.pop() || "";
            var i;
            var line;
            var payload;
            for (i = 0; i < chunks.length; i += 1) {
              line = chunks[i].trim();
              if (line.indexOf("data:") !== 0) {
                continue;
              }
              try {
                payload = JSON.parse(line.replace(/^data:\s*/, ""));
              } catch (err) {
                reject(
                  new Error(
                    "The chat failed while reading a server line: " + err.message
                  )
                );
                return;
              }
              onEvent(payload);
            }
            pump();
          })
          .catch(reject);
      }

      pump();
    });
  }

  function askPane(mode, prompt) {
    var thread = $("claude-thread-" + mode);
    var useMcp = mode === "mcp";
    addUser(thread, prompt);
    var bubble = addBotShell(thread);
    var collected = "";

    return fetch(apiRoot() + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        use_mcp: useMcp,
        messages: history[mode]
      })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error(
            "The chat server answered HTTP " + res.status + " in the " + mode + " pane."
          );
        }
        return readSSE(res, function (ev) {
          if (!ev || !ev.type) {
            return;
          }
          if (ev.type === "tool" || ev.type === "tool_result") {
            addTool(bubble, ev);
            return;
          }
          if (ev.type === "text") {
            collected += ev.text || "";
            return;
          }
          if (ev.type === "error") {
            throw new Error(ev.message || "The model returned an error.");
          }
        });
      })
      .then(function () {
        if (!collected) {
          collected = "No text came back. Try the question once more.";
        }
        finishBot(bubble, collected, false);
        history[mode].push({ role: "user", content: prompt });
        history[mode].push({ role: "assistant", content: collected });
      })
      .catch(function (err) {
        finishBot(bubble, friendlyError(err, mode), true);
        checkHealth();
      });
  }

  function mixedContentBlock() {
    return (
      window.location.protocol === "https:" &&
      apiRoot().indexOf("http://") === 0
    );
  }

  function friendlyError(err, mode) {
    var raw = (err && err.message) || "";
    if (mixedContentBlock()) {
      return (
        "This live chat cannot run on the public https site. Open http://127.0.0.1:8765 after ./mcp-chat/start.sh."
      );
    }
    if (!raw || raw === "Failed to fetch" || raw === "Load failed" || raw === "NetworkError when attempting to fetch resource.") {
      return (
        "Cannot reach the chat server for the " +
        mode +
        " pane. In a project terminal run ./mcp-chat/start.sh, then try again."
      );
    }
    return raw;
  }

  function setBusy(on) {
    busy = on;
    syncComposer();
  }

  function syncComposer() {
    var send = $("claude-send");
    var input = $("claude-input");
    var locked = busy || !serverUp;
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
    if (!serverUp) {
      checkHealth();
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

  function checkHealth() {
    var el = $("claude-health");
    if (mixedContentBlock()) {
      serverUp = false;
      if (el) {
        el.className = "claude-health is-down";
        el.textContent =
          "Open http://127.0.0.1:8765 for the live chat (https pages cannot reach the laptop server).";
      }
      syncComposer();
      return;
    }
    fetch(apiRoot() + "/health")
      .then(function (res) {
        return res.json();
      })
      .then(function (info) {
        if (info && info.ok) {
          serverUp = true;
          if (el) {
            el.className = "claude-health is-up";
            el.textContent = "Haiku 4.5 ready · terms plug on the right";
          }
        } else {
          serverUp = false;
          if (el) {
            el.className = "claude-health is-down";
            el.textContent =
              "Chat server is up, but ANTHROPIC_API is missing from .env.";
          }
        }
        syncComposer();
      })
      .catch(function () {
        serverUp = false;
        if (el) {
          el.className = "claude-health is-down";
          el.textContent =
            "Chat server is off. Run ./mcp-chat/start.sh — this line turns green when it is back.";
        }
        syncComposer();
      });
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

    checkHealth();
    if (healthTimer) {
      window.clearInterval(healthTimer);
    }
    healthTimer = window.setInterval(checkHealth, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
