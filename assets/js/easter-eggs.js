/* Home-only easter eggs. Reuses existing equality-terminal-* styles. */

(function () {
  "use strict";

  /* ---- Console signature ------------------------------------------ */
  try {
    console.log(
      "%c👋 Found me. Let's build something. — gabriele.matini@gmail.com",
      "font:14px ui-monospace,SF Mono,monospace;color:#5ac8fa;padding:6px 0;"
    );
    console.log(
      "%cTip: try the Konami code on this page. ↑↑↓↓←→←→BA",
      "color:#7dd3c0;font:12px ui-monospace,monospace;"
    );
  } catch (_) {}

  /* ---- Konami terminal egg ---------------------------------------- */
  var KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  var buffer = [];
  var open = false;

  document.addEventListener("keydown", function (e) {
    if (open) return;
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    buffer.push(key);
    if (buffer.length > KONAMI.length) buffer.shift();
    var matched = buffer.length === KONAMI.length &&
      buffer.every(function (k, i) { return k === KONAMI[i]; });
    if (matched) {
      buffer = [];
      openKonamiTerminal();
    }
  });

  function appendLine(container, text, cls) {
    var line = document.createElement("div");
    line.className = "equality-terminal-line" + (cls ? " " + cls : "");
    line.textContent = text;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
    return line;
  }

  function openKonamiTerminal() {
    if (open) return;
    open = true;

    var backdrop = document.createElement("div");
    backdrop.className = "equality-terminal-overlay";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "Easter egg console");

    var panel = document.createElement("div");
    panel.className = "equality-terminal-panel";

    var titleBar = document.createElement("div");
    titleBar.className = "equality-terminal-titlebar";
    titleBar.innerHTML =
      '<div class="equality-terminal-dots">' +
        '<span class="equality-terminal-dot equality-terminal-dot-red"></span>' +
        '<span class="equality-terminal-dot equality-terminal-dot-yellow"></span>' +
        '<span class="equality-terminal-dot equality-terminal-dot-green"></span>' +
      '</div>' +
      '<span class="equality-terminal-title">konami — bash</span>';

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "equality-terminal-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";
    titleBar.appendChild(closeBtn);

    var body = document.createElement("div");
    body.className = "equality-terminal-body";

    var hint = document.createElement("div");
    hint.className = "equality-terminal-hint";
    hint.textContent = "$ unlock-flair";

    var logEl = document.createElement("div");
    logEl.className = "equality-terminal-log";

    body.appendChild(hint);
    body.appendChild(logEl);
    panel.appendChild(titleBar);
    panel.appendChild(body);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    var matrixActive = false;
    var matrixCanvas = null;
    var matrixRAF = 0;
    var inputLine = null;
    var typedSoFar = "";

    function close() {
      stopMatrix();
      backdrop.remove();
      document.removeEventListener("keydown", onKey, true);
      open = false;
    }

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (!inputLine) return;
      if (e.key === "Backspace") {
        e.preventDefault();
        typedSoFar = typedSoFar.slice(0, -1);
        renderInput();
      } else if (e.key === "Enter") {
        e.preventDefault();
        var cmd = typedSoFar.trim().toLowerCase();
        runCommand(cmd);
        typedSoFar = "";
        renderInput();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        typedSoFar += e.key;
        renderInput();
      }
    }

    function renderInput() {
      if (!inputLine) return;
      inputLine.textContent = "> " + typedSoFar + "▍";
    }

    function runCommand(cmd) {
      if (cmd === "matrix") {
        appendLine(logEl, "> matrix", "equality-terminal-prompt");
        startMatrix();
      } else if (cmd === "help") {
        appendLine(logEl, "> help", "equality-terminal-prompt");
        appendLine(logEl, "available: matrix, whoami, hire, clear, exit");
      } else if (cmd === "whoami") {
        appendLine(logEl, "> whoami", "equality-terminal-prompt");
        appendLine(logEl, "gabriele — software & ML engineer", "equality-terminal-bool");
      } else if (cmd === "hire") {
        appendLine(logEl, "> hire", "equality-terminal-prompt");
        appendLine(logEl, "✓ gabriele.matini@gmail.com", "equality-terminal-success");
      } else if (cmd === "clear") {
        logEl.innerHTML = "";
        startBoot();
        return;
      } else if (cmd === "exit") {
        appendLine(logEl, "> exit", "equality-terminal-prompt");
        setTimeout(close, 200);
        return;
      } else if (cmd === "") {
        // ignore
      } else {
        appendLine(logEl, "> " + cmd, "equality-terminal-prompt");
        appendLine(logEl, "command not found: " + cmd);
      }
      ensureInputLine();
    }

    function ensureInputLine() {
      if (inputLine && inputLine.parentNode === logEl) {
        logEl.appendChild(inputLine); // move to bottom
      } else {
        inputLine = document.createElement("div");
        inputLine.className = "equality-terminal-line equality-terminal-prompt";
        logEl.appendChild(inputLine);
      }
      renderInput();
      logEl.scrollTop = logEl.scrollHeight;
    }

    function startBoot() {
      var steps = [
        { d: 80,  t: "> sudo unlock-flair",                cls: "equality-terminal-prompt" },
        { d: 240, t: "Permission granted ✓",               cls: "equality-terminal-success" },
        { d: 220, t: "tip: type 'matrix' to enter the void" },
        { d: 180, t: "tip: type 'help' for more commands" }
      ];
      var i = 0;
      function next() {
        if (i >= steps.length) { ensureInputLine(); return; }
        var s = steps[i++];
        setTimeout(function () {
          appendLine(logEl, s.t, s.cls);
          next();
        }, s.d);
      }
      next();
    }

    /* ---- Mini matrix rain inside the panel ----------------------- */
    function startMatrix() {
      if (matrixActive) return;
      matrixActive = true;
      var rect = body.getBoundingClientRect();
      matrixCanvas = document.createElement("canvas");
      matrixCanvas.width = rect.width;
      matrixCanvas.height = rect.height;
      matrixCanvas.style.cssText =
        "position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;opacity:0.85;";
      body.style.position = "relative";
      body.appendChild(matrixCanvas);

      var ctx = matrixCanvas.getContext("2d");
      var fontSize = 14;
      var cols = Math.floor(matrixCanvas.width / fontSize);
      var drops = new Array(cols).fill(0).map(function () {
        return Math.random() * matrixCanvas.height / fontSize;
      });
      var glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01ABCDEF<>{}/=".split("");

      function draw() {
        ctx.fillStyle = "rgba(13,17,23,0.18)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.font = fontSize + "px ui-monospace, monospace";
        for (var i = 0; i < drops.length; i++) {
          var ch = glyphs[Math.floor(Math.random() * glyphs.length)];
          var x = i * fontSize;
          var y = drops[i] * fontSize;
          ctx.fillStyle = Math.random() > 0.96 ? "#ffffff" : "#5ac8fa";
          ctx.fillText(ch, x, y);
          if (y > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 1;
        }
        matrixRAF = requestAnimationFrame(draw);
      }
      draw();

      appendLine(logEl, "wake up… 🐇", "equality-terminal-success");
      appendLine(logEl, "(esc to exit)");
      ensureInputLine();
    }

    function stopMatrix() {
      if (!matrixActive) return;
      cancelAnimationFrame(matrixRAF);
      if (matrixCanvas && matrixCanvas.parentNode) {
        matrixCanvas.parentNode.removeChild(matrixCanvas);
      }
      matrixCanvas = null;
      matrixActive = false;
    }

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) close();
    });
    panel.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("keydown", onKey, true);

    requestAnimationFrame(startBoot);
  }

  /* ---- Passions click counter ------------------------------------ */
  function initPassionsCounter() {
    var heading = document.querySelector(".passions h3");
    if (!heading) return;
    heading.style.cursor = "pointer";
    heading.title = "Click me";
    var clicks = [];
    heading.addEventListener("click", function () {
      var now = Date.now();
      clicks = clicks.filter(function (t) { return now - t < 5000; });
      clicks.push(now);
      if (clicks.length >= 7) {
        clicks = [];
        document.documentElement.style.setProperty("--accent-blue", "#5ac8fa");
        heading.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.1) rotate(-3deg)" },
            { transform: "scale(1)" }
          ],
          { duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
        flashConfetti(heading);
      }
    });
  }

  function flashConfetti(anchor) {
    var rect = anchor.getBoundingClientRect();
    var colors = ["#007aff", "#5ac8fa", "#7dd3c0", "#34c759", "#febc2e"];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement("span");
      var size = 6 + Math.random() * 6;
      var dx = (Math.random() - 0.5) * 280;
      var dy = -120 - Math.random() * 160;
      var rot = (Math.random() - 0.5) * 720;
      p.style.cssText =
        "position:fixed;left:" + (rect.left + rect.width / 2) +
        "px;top:" + (rect.top + rect.height / 2) +
        "px;width:" + size + "px;height:" + size +
        "px;background:" + colors[i % colors.length] +
        ";border-radius:2px;pointer-events:none;z-index:99999;will-change:transform,opacity;";
      document.body.appendChild(p);
      p.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + dx + "px," + dy + "px) rotate(" + rot + "deg)", opacity: 0 }
        ],
        { duration: 1100 + Math.random() * 400, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      ).onfinish = function () { this.effect.target.remove(); };
    }
  }

  if (document.readyState !== "loading") initPassionsCounter();
  else document.addEventListener("DOMContentLoaded", initPassionsCounter);
})();
