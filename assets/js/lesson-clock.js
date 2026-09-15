// Live local-time clock under the lesson QR chip.
// Uses this computer's clock (the projector laptop during the talk).
// A failure never throws — the rest of the page keeps working.

(function () {
  "use strict";

  if (window.__aibLessonClock) {
    return;
  }
  window.__aibLessonClock = true;

  function tick() {
    var el = document.getElementById("lesson-qr-clock");
    if (!el) {
      return;
    }
    try {
      el.textContent = new Date().toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch (err) {
      console.error("Failed while updating the lesson clock:", err);
    }
  }

  tick();
  setInterval(tick, 1000);
})();
