// Play / pause on every lecture skill box (.demo-skill-file).
// Uses Kokoro-82M (natural in-browser voice). If that fails, uses the
// browser's built-in speech. A failure never throws — the page keeps working.

(function () {
  "use strict";

  var KOKORO_LIB = "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js";
  var KOKORO_HUB = "onnx-community/Kokoro-82M-v1.0-ONNX";
  var VOICES = [
    { id: "af_heart", label: "Heart · US woman" },
    { id: "af_bella", label: "Bella · US woman" },
    { id: "af_nicole", label: "Nicole · US woman" },
    { id: "am_michael", label: "Michael · US man" },
    { id: "am_fenrir", label: "Fenrir · US man" },
    { id: "bf_emma", label: "Emma · UK woman" },
    { id: "bm_george", label: "George · UK man" }
  ];

  var currentVoice = "af_heart";
  var enginePromise = null;
  var active = {
    wrap: null,
    kind: "",
    paused: false,
    cancelled: false,
    audioCtx: null,
    source: null,
    buffer: null,
    startedAt: 0,
    pausedAt: 0,
    utterance: null,
    engine: null
  };

  function baseurl() {
    var raw = (window.AIBEDSIDE && window.AIBEDSIDE.baseurl) || "";
    return String(raw).replace(/\/$/, "");
  }

  function safe(fn) {
    try {
      return fn();
    } catch (err) {
      console.warn("[read-aloud]", err);
      return null;
    }
  }

  function boxes() {
    return document.querySelectorAll("pre.demo-skill-file");
  }

  function setStatus(wrap, text) {
    var el = wrap && wrap.querySelector(".read-aloud-status");
    if (el) {
      el.textContent = text || "";
    }
  }

  function setPlaying(wrap, playing) {
    if (!wrap) {
      return;
    }
    wrap.classList.toggle("is-playing", !!playing);
    wrap.classList.toggle("is-paused", !playing && wrap.classList.contains("is-armed"));
    var playBtn = wrap.querySelector('[data-read="play"]');
    if (playBtn) {
      playBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    }
  }

  function selectedVoice(wrap) {
    var sel = wrap && wrap.querySelector(".read-aloud-voice");
    return (sel && sel.value) || currentVoice;
  }

  function syncVoiceSelects(value) {
    currentVoice = value;
    var list = document.querySelectorAll(".read-aloud-voice");
    var i;
    for (i = 0; i < list.length; i += 1) {
      list[i].value = value;
    }
  }

  function stopAudioSource() {
    if (active.source) {
      try {
        active.source.onended = null;
        active.source.stop();
      } catch (err) {
        // already stopped
      }
      active.source = null;
    }
  }

  function stopSpeech() {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (err) {
      // ignore
    }
    active.utterance = null;
  }

  function resetActive() {
    stopAudioSource();
    stopSpeech();
    if (active.wrap) {
      active.wrap.classList.remove("is-playing", "is-paused", "is-armed");
      setPlaying(active.wrap, false);
      setStatus(active.wrap, "");
    }
    active.wrap = null;
    active.kind = "";
    active.paused = false;
    active.cancelled = true;
    active.buffer = null;
    active.startedAt = 0;
    active.pausedAt = 0;
  }

  function playBufferFrom(offset) {
    var ctx = active.audioCtx;
    var buffer = active.buffer;
    if (!ctx || !buffer) {
      return;
    }
    stopAudioSource();
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    // A little treble lift — q8 Kokoro can sound like it is speaking
    // through a blanket, which people hear as "another language".
    var bright = ctx.createBiquadFilter();
    bright.type = "highshelf";
    bright.frequency.value = 2200;
    bright.gain.value = 5;
    var gain = ctx.createGain();
    gain.gain.value = 1.12;
    source.connect(bright);
    bright.connect(gain);
    gain.connect(ctx.destination);
    active.source = source;
    active.startedAt = ctx.currentTime - offset;
    active.paused = false;
    source.onended = function () {
      if (active.paused || active.cancelled) {
        return;
      }
      var wrap = active.wrap;
      resetActive();
      if (wrap) {
        setStatus(wrap, "");
      }
    };
    source.start(0, offset);
  }

  function floatToBuffer(ctx, data, sampleRate) {
    var buffer = ctx.createBuffer(1, data.length, sampleRate);
    buffer.copyToChannel(data, 0);
    return buffer;
  }

  // Turn a skill box into spoken English. Hashes and dashes are not words —
  // if we leave them in, the voice gets muddy and can sound "foreign".
  function toSpokenEnglish(raw) {
    var text = String(raw || "").replace(/\r\n/g, "\n");
    text = text.replace(/^---[\s\S]*?\n---\s*/m, " ");
    text = text.replace(/^#{1,6}\s+/gm, "");
    text = text.replace(/^\s*[-*+]\s+/gm, "");
    text = text.replace(/^\s*\d+\.\s+/gm, "");
    text = text.replace(/`+/g, "");
    text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
    text = text.replace(/[_*]/g, "");
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    text = text.replace(/https?:\/\/\S+/g, "");
    text = text.replace(/[|#]/g, " ");
    text = text.replace(/\s+/g, " ").trim();
    return text;
  }

  function pickEnglishVoiceId(voice) {
    var id = voice || currentVoice || "af_heart";
    var first = id.charAt(0);
    if (first === "a" || first === "b") {
      return id;
    }
    return "af_heart";
  }

  function samplesFrom(audio) {
    if (!audio) {
      return null;
    }
    return audio.audio || audio.data || null;
  }

  // Make quiet / muffled speech louder without blowing the speakers.
  function normalizeSamples(src) {
    var data = src instanceof Float32Array ? src : new Float32Array(src);
    var peak = 0;
    var i;
    for (i = 0; i < data.length; i += 1) {
      var abs = Math.abs(data[i]);
      if (abs > peak) {
        peak = abs;
      }
    }
    if (peak < 0.04 || peak > 0.86) {
      return data;
    }
    var gain = 0.88 / peak;
    if (gain > 3.5) {
      gain = 3.5;
    }
    var out = new Float32Array(data.length);
    for (i = 0; i < data.length; i += 1) {
      out[i] = data[i] * gain;
    }
    return out;
  }

  function pickEnglishBrowserVoice() {
    try {
      var list = window.speechSynthesis.getVoices() || [];
      var i;
      var fallback = null;
      for (i = 0; i < list.length; i += 1) {
        if (!/^en(-|$)/i.test(list[i].lang)) {
          continue;
        }
        if (/en-US/i.test(list[i].lang)) {
          return list[i];
        }
        if (!fallback) {
          fallback = list[i];
        }
      }
      return fallback;
    } catch (err) {
      return null;
    }
  }

  async function loadKokoro(KokoroTTS, modelId, device) {
    return KokoroTTS.from_pretrained(modelId, {
      dtype: "q8",
      device: device,
      progress_callback: function (info) {
        if (!active.wrap || !info) {
          return;
        }
        if (info.status === "progress" && typeof info.progress === "number") {
          setStatus(active.wrap, "Loading Kokoro… " + Math.round(info.progress) + "%");
        } else if (info.status === "ready") {
          setStatus(active.wrap, "Preparing speech…");
        }
      }
    });
  }

  async function createModelEngine() {
    var mod = await import(KOKORO_LIB);
    var KokoroTTS = mod.KokoroTTS;
    if (!KokoroTTS) {
      throw new Error("kokoro-js did not export KokoroTTS");
    }

    var device = navigator.gpu ? "webgpu" : "wasm";
    // Skip the local folder — kokoro-js treats that path as a model id and
    // fails. The public copy caches in the browser after the first play.
    var tts = await loadKokoro(KokoroTTS, KOKORO_HUB, device);

    return {
      kind: "model",
      label: "Kokoro",
      async speak(text, voice) {
        var spoken = toSpokenEnglish(text);
        var chosen = pickEnglishVoiceId(voice);
        var parts = [];
        var rate = 24000;
        var i;

        // One sentence at a time. Feeding the whole box in one go is what
        // made the voice muffled and hard to follow.
        if (typeof tts.stream === "function") {
          for await (var part of tts.stream(spoken, { voice: chosen, speed: 0.92 })) {
            if (active.cancelled) {
              return;
            }
            var chunk = samplesFrom(part.audio || part);
            if (chunk && chunk.length) {
              parts.push(chunk);
              if (part.audio && part.audio.sampling_rate) {
                rate = part.audio.sampling_rate;
              }
            }
            if (active.wrap) {
              setStatus(active.wrap, "Reading with Kokoro…");
            }
          }
        } else {
          var one = await tts.generate(spoken, { voice: chosen, speed: 0.92 });
          var only = samplesFrom(one);
          if (only) {
            parts.push(only);
          }
          rate = one.sampling_rate || rate;
        }

        if (!parts.length) {
          throw new Error("Kokoro returned no audio samples");
        }

        var total = 0;
        for (i = 0; i < parts.length; i += 1) {
          total += parts[i].length;
        }
        var merged = new Float32Array(total);
        var offset = 0;
        for (i = 0; i < parts.length; i += 1) {
          merged.set(parts[i], offset);
          offset += parts[i].length;
        }

        var ctx = active.audioCtx || new AudioContext();
        active.audioCtx = ctx;
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        active.buffer = floatToBuffer(ctx, normalizeSamples(merged), rate);
        active.pausedAt = 0;
        playBufferFrom(0);
      },
      pause: function () {
        if (!active.audioCtx || !active.source) {
          return;
        }
        active.pausedAt = Math.max(0, active.audioCtx.currentTime - active.startedAt);
        active.paused = true;
        stopAudioSource();
      },
      resume: function () {
        if (!active.buffer) {
          return;
        }
        playBufferFrom(active.pausedAt || 0);
      }
    };
  }

  function createSpeechEngine() {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      throw new Error("This browser has no built-in speech");
    }
    return {
      kind: "speech",
      label: "browser voice",
      speak: function (text) {
        stopSpeech();
        var utter = new SpeechSynthesisUtterance(toSpokenEnglish(text));
        utter.lang = "en-US";
        utter.rate = 0.95;
        utter.pitch = 1;
        var enVoice = pickEnglishBrowserVoice();
        if (enVoice) {
          utter.voice = enVoice;
        }
        utter.onend = function () {
          if (active.paused || active.cancelled) {
            return;
          }
          var wrap = active.wrap;
          resetActive();
          if (wrap) {
            setStatus(wrap, "");
          }
        };
        utter.onerror = function () {
          var wrap = active.wrap;
          resetActive();
          if (wrap) {
            setStatus(wrap, "The voice stopped. Press Play to try again.");
          }
        };
        active.utterance = utter;
        window.speechSynthesis.speak(utter);
      },
      pause: function () {
        try {
          window.speechSynthesis.pause();
        } catch (err) {
          // some browsers do not pause — ignore
        }
      },
      resume: function () {
        try {
          window.speechSynthesis.resume();
        } catch (err) {
          // ignore
        }
      }
    };
  }

  function getEngine() {
    if (enginePromise) {
      return enginePromise;
    }
    enginePromise = (async function () {
      try {
        return await createModelEngine();
      } catch (modelErr) {
        console.warn("[read-aloud] Kokoro unavailable", modelErr);
        enginePromise = null;
        try {
          return createSpeechEngine();
        } catch (speechErr) {
          console.warn("[read-aloud] browser speech unavailable", speechErr);
          return null;
        }
      }
    })();
    return enginePromise;
  }

  async function onPlay(wrap, pre) {
    try {
      var text = (pre.textContent || "").replace(/^\s+|\s+$/g, "");
      if (!text) {
        setStatus(wrap, "This box is empty.");
        return;
      }

      if (active.wrap === wrap && active.paused) {
        active.cancelled = false;
        wrap.classList.add("is-armed", "is-playing");
        wrap.classList.remove("is-paused");
        setPlaying(wrap, true);
        setStatus(wrap, "Reading…");
        if (active.engine) {
          active.engine.resume();
        }
        return;
      }

      resetActive();
      active.cancelled = false;
      active.wrap = wrap;
      wrap.classList.add("is-armed", "is-playing");
      setPlaying(wrap, true);
      setStatus(wrap, "Loading Kokoro… first play can take a minute");

      var engine = await getEngine();
      if (active.wrap !== wrap || active.cancelled) {
        return;
      }
      if (!engine) {
        setStatus(wrap, "No voice in this browser. The page is otherwise fine.");
        wrap.classList.remove("is-playing", "is-armed");
        setPlaying(wrap, false);
        return;
      }

      active.engine = engine;
      active.kind = engine.kind;
      setStatus(wrap, engine.kind === "model" ? "Reading with Kokoro…" : "Reading…");
      await engine.speak(text, selectedVoice(wrap));
    } catch (err) {
      console.warn("[read-aloud] play failed", err);
      setStatus(wrap, "Could not read this box. The rest of the page still works.");
      wrap.classList.remove("is-playing", "is-armed");
      setPlaying(wrap, false);
    }
  }

  function onPause(wrap) {
    try {
      if (active.wrap !== wrap || !active.engine) {
        return;
      }
      active.paused = true;
      active.engine.pause();
      wrap.classList.remove("is-playing");
      wrap.classList.add("is-paused", "is-armed");
      setPlaying(wrap, false);
      setStatus(wrap, "Paused");
    } catch (err) {
      console.warn("[read-aloud] pause failed", err);
      setStatus(wrap, "Pause failed. Press Play to start again.");
    }
  }

  function makeVoiceSelect() {
    var sel = document.createElement("select");
    sel.className = "read-aloud-voice";
    sel.setAttribute("aria-label", "Voice");
    var i;
    for (i = 0; i < VOICES.length; i += 1) {
      var opt = document.createElement("option");
      opt.value = VOICES[i].id;
      opt.textContent = VOICES[i].label;
      if (VOICES[i].id === currentVoice) {
        opt.selected = true;
      }
      sel.appendChild(opt);
    }
    sel.addEventListener("change", function () {
      syncVoiceSelects(sel.value);
    });
    return sel;
  }

  function decorate(pre) {
    if (pre.closest(".read-aloud")) {
      return;
    }
    var parent = pre.parentNode;
    if (!parent) {
      return;
    }

    var wrap = document.createElement("div");
    wrap.className = "read-aloud";

    var bar = document.createElement("div");
    bar.className = "read-aloud-bar";

    var play = document.createElement("button");
    play.type = "button";
    play.className = "read-aloud-btn";
    play.setAttribute("data-read", "play");
    play.setAttribute("aria-label", "Play this box out loud");
    play.textContent = "Play";

    var pause = document.createElement("button");
    pause.type = "button";
    pause.className = "read-aloud-btn";
    pause.setAttribute("data-read", "pause");
    pause.setAttribute("aria-label", "Pause reading");
    pause.textContent = "Pause";

    var status = document.createElement("span");
    status.className = "read-aloud-status";
    status.setAttribute("aria-live", "polite");

    bar.appendChild(play);
    bar.appendChild(pause);
    bar.appendChild(makeVoiceSelect());
    bar.appendChild(status);

    parent.insertBefore(wrap, pre);
    wrap.appendChild(bar);
    wrap.appendChild(pre);

    play.addEventListener("click", function () {
      onPlay(wrap, pre);
    });
    pause.addEventListener("click", function () {
      onPause(wrap);
    });
  }

  function start() {
    safe(function () {
      var list = boxes();
      var i;
      for (i = 0; i < list.length; i += 1) {
        safe(function () {
          decorate(list[i]);
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
