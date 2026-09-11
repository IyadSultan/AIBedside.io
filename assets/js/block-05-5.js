// Block 5.5 — click through the CLAUDE.md kitchen: picture, contract, drop, wiki, review.
// Nothing is sent to Claude from this page.

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

        // The wiki map lives on step 3. Start it only once that pane is visible,
        // because a hidden SVG has no width to measure.
        if (opts.onStep) {
          opts.onStep(step);
        }
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

  // Cedar Ward wiki as a map. Dark dots = notes. Pale dots = the files they
  // came from. Edges follow the real [[wikilinks]] in assets/block-05.5/wiki/.
  // Positions are fixed (like the Obsidian screenshot) so labels do not pile up.
  function bindWikiGraph() {
    var wrap = $("b55-graph");
    var svg = $("b55-graph-svg");
    var hint = $("b55-graph-hint");
    if (!wrap || !svg) {
      return {
        show: function () {}
      };
    }

    var base = wrap.getAttribute("data-base") || "";
    var wiki = base + "/assets/block-05.5/";
    var hintHome = hint ? hint.textContent : "";
    var started = false;
    var hoverId = "";
    var VW = 1000;
    var VH = 420;

    var nodes = [
      { id: "pol3", label: "POL-CW-03", kind: "file", href: wiki + "policies/POL-CW-03-visitor-isolation.md", x: 500, y: 28, anchor: "middle", dy: "-1.15em", links: 1 },
      { id: "pol2", label: "POL-CW-02", kind: "file", href: wiki + "policies/POL-CW-02-central-line.md", x: 70, y: 95, anchor: "start", dy: "-1.15em", links: 1 },
      { id: "claude", label: "CLAUDE", kind: "file", href: wiki + "CLAUDE.md", x: 70, y: 175, anchor: "start", dy: "1.65em", links: 1 },
      { id: "index", label: "index", kind: "note", href: wiki + "wiki/index.md", x: 360, y: 128, anchor: "end", dy: "-1.2em", links: 8 },
      { id: "leaf", label: "discharge-fever", kind: "note", href: wiki + "wiki/discharge-fever.md", x: 530, y: 118, anchor: "middle", dy: "-1.2em", links: 5 },
      { id: "vis", label: "visitor-isolation", kind: "note", href: wiki + "wiki/visitor-isolation.md", x: 800, y: 95, anchor: "start", dy: "-1.15em", links: 5 },
      { id: "chemo", label: "chemo-safety", kind: "note", href: wiki + "wiki/chemo-safety.md", x: 910, y: 175, anchor: "start", dy: "1.65em", links: 5 },
      { id: "line", label: "central-line", kind: "note", href: wiki + "wiki/central-line.md", x: 300, y: 190, anchor: "end", dy: "1.65em", links: 5 },
      { id: "hub", label: "wiki.html", kind: "file", href: wiki + "wiki.html", x: 575, y: 200, anchor: "start", dy: "1.65em", links: 1 },
      { id: "pol5", label: "POL-CW-05", kind: "file", href: wiki + "policies/POL-CW-05-discharge-fever.md", x: 740, y: 225, anchor: "start", dy: "1.65em", links: 1 },
      { id: "sum", label: "summary.html", kind: "file", href: wiki + "summary.html", x: 210, y: 245, anchor: "end", dy: "1.65em", links: 1 },
      { id: "pol1", label: "POL-CW-01", kind: "file", href: wiki + "policies/POL-CW-01-febrile-neutropenia.md", x: 70, y: 275, anchor: "start", dy: "1.65em", links: 1 },
      { id: "fn", label: "febrile-neutropenia", kind: "note", href: wiki + "wiki/febrile-neutropenia.md", x: 500, y: 280, anchor: "middle", dy: "1.7em", links: 6 },
      { id: "pol4", label: "POL-CW-04", kind: "file", href: wiki + "policies/POL-CW-04-chemo-safety.md", x: 800, y: 385, anchor: "middle", dy: "1.65em", links: 1 }
    ];

    var edges = [
      ["index", "fn"], ["index", "line"], ["index", "vis"], ["index", "chemo"], ["index", "leaf"],
      ["index", "claude"], ["index", "hub"], ["index", "sum"],
      ["fn", "pol1"], ["line", "pol2"], ["vis", "pol3"], ["chemo", "pol4"], ["leaf", "pol5"],
      ["fn", "line"], ["fn", "vis"], ["fn", "chemo"], ["fn", "leaf"],
      ["line", "leaf"], ["line", "vis"],
      ["vis", "chemo"],
      ["chemo", "leaf"]
    ];

    var byId = {};
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      byId[nodes[i].id] = nodes[i];
    }

    var edgeEls = [];
    var nodeEls = {};

    function neighbourSet(id) {
      var out = {};
      out[id] = true;
      var e;
      for (e = 0; e < edges.length; e += 1) {
        if (edges[e][0] === id) {
          out[edges[e][1]] = true;
        }
        if (edges[e][1] === id) {
          out[edges[e][0]] = true;
        }
      }
      return out;
    }

    function onHover(ev) {
      hoverId = ev.currentTarget.getAttribute("data-id") || "";
      var n = byId[hoverId];
      if (hint && n) {
        if (n.kind === "note") {
          hint.textContent = n.label + " — a wiki note, linked to " + n.links + " other files. Click to open it.";
        } else {
          hint.textContent = n.label + " — a source file the notes were built from. Click to open it.";
        }
      }
      paint();
    }

    function onLeave() {
      hoverId = "";
      if (hint) {
        hint.textContent = hintHome;
      }
      paint();
    }

    function paint() {
      var hot = hoverId ? neighbourSet(hoverId) : null;
      var e;
      for (e = 0; e < edgeEls.length; e += 1) {
        var ed = edgeEls[e];
        if (hot && hot[ed.a] && hot[ed.b] && (ed.a === hoverId || ed.b === hoverId)) {
          ed.el.setAttribute("class", "b55-graph-edge is-on");
        } else {
          ed.el.setAttribute("class", "b55-graph-edge");
        }
      }
      for (i = 0; i < nodes.length; i += 1) {
        var els = nodeEls[nodes[i].id];
        if (hot && hot[nodes[i].id]) {
          els.classList.add("is-on");
        } else {
          els.classList.remove("is-on");
        }
      }
    }

    function drawOnce() {
      try {
        svg.innerHTML = "";
        svg.setAttribute("viewBox", "0 0 " + VW + " " + VH);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        var ns = "http://www.w3.org/2000/svg";
        var edgeLayer = document.createElementNS(ns, "g");
        var nodeLayer = document.createElementNS(ns, "g");
        svg.appendChild(edgeLayer);
        svg.appendChild(nodeLayer);
        edgeEls = [];
        nodeEls = {};

        var e;
        for (e = 0; e < edges.length; e += 1) {
          var a = byId[edges[e][0]];
          var b = byId[edges[e][1]];
          var line = document.createElementNS(ns, "line");
          line.setAttribute("class", "b55-graph-edge");
          line.setAttribute("x1", a.x);
          line.setAttribute("y1", a.y);
          line.setAttribute("x2", b.x);
          line.setAttribute("y2", b.y);
          edgeLayer.appendChild(line);
          edgeEls.push({ el: line, a: a.id, b: b.id });
        }

        for (i = 0; i < nodes.length; i += 1) {
          var node = nodes[i];
          var link = document.createElementNS(ns, "a");
          link.setAttribute("href", node.href);
          link.setAttribute("class", "b55-graph-node b55-graph-" + node.kind);
          link.setAttribute("data-id", node.id);
          link.setAttribute("aria-label", "Open " + node.label);

          var circle = document.createElementNS(ns, "circle");
          circle.setAttribute("cx", node.x);
          circle.setAttribute("cy", node.y);
          circle.setAttribute("r", node.kind === "note" ? (node.id === "fn" ? 10 : 8) : 6);

          var label = document.createElementNS(ns, "text");
          label.setAttribute("class", "b55-graph-label");
          label.setAttribute("x", node.x);
          label.setAttribute("y", node.y);
          label.setAttribute("text-anchor", node.anchor);
          label.setAttribute("dy", node.dy);
          label.textContent = node.label;

          link.appendChild(circle);
          link.appendChild(label);
          nodeLayer.appendChild(link);
          nodeEls[node.id] = link;

          link.addEventListener("mouseenter", onHover);
          link.addEventListener("mouseleave", onLeave);
          link.addEventListener("focus", onHover);
          link.addEventListener("blur", onLeave);
        }
      } catch (err) {
        svg.textContent = "The wiki map failed to draw: " + err.message;
      }
    }

    function start() {
      if (started) {
        return;
      }
      started = true;
      drawOnce();
    }

    return { show: start };
  }

  function ready() {
    var graph = bindWikiGraph();
    bindDemo({
      prefix: "stage-",
      chipsId: "demo-steps",
      nextId: "demo-next",
      statusId: "demo-status",
      last: 4,
      resetLabel: "Back to the kitchen",
      onStep: function (step) {
        if (step === 3) {
          graph.show();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
