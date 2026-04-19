(function () {
  var OVERLAY_CLASS = "equality-terminal-overlay";

  function appendLine(container, text, className) {
    var line = document.createElement("div");
    line.className = "equality-terminal-line" + (className ? " " + className : "");
    line.textContent = text;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }

  function runVerification(logEl) {
    var steps = [
      { delay: 60, text: "> Verifying equality…", cls: "equality-terminal-prompt", devLog: "Verifying equality…" },
      { delay: 400, text: "true", cls: "equality-terminal-bool", devLog: true },
      { delay: 420, text: "✓ TypeScript verified!", cls: "equality-terminal-success", devLog: "TypeScript verified!" },
    ];

    function logToDevTools(msg) {
      if (typeof console !== "undefined" && console.log) {
        console.log(msg);
      }
    }

    var i = 0;
    function next() {
      if (i >= steps.length) return;
      var step = steps[i];
      i += 1;
      setTimeout(function () {
        appendLine(logEl, step.text, step.cls);
        logToDevTools(step.devLog);
        next();
      }, step.delay);
    }
    next();
  }

  function openTerminal() {
    var existing = document.querySelector("." + OVERLAY_CLASS);
    if (existing) {
      existing.remove();
    }

    var backdrop = document.createElement("div");
    backdrop.className = OVERLAY_CLASS;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "Equality verification console");

    var panel = document.createElement("div");
    panel.className = "equality-terminal-panel";

    var titleBar = document.createElement("div");
    titleBar.className = "equality-terminal-titlebar";

    var dots = document.createElement("div");
    dots.className = "equality-terminal-dots";
    dots.innerHTML =
      '<span class="equality-terminal-dot equality-terminal-dot-red"></span>' +
      '<span class="equality-terminal-dot equality-terminal-dot-yellow"></span>' +
      '<span class="equality-terminal-dot equality-terminal-dot-green"></span>';

    var title = document.createElement("span");
    title.className = "equality-terminal-title";
    title.textContent = "strict-equality — bash";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "equality-terminal-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";

    titleBar.appendChild(dots);
    titleBar.appendChild(title);
    titleBar.appendChild(closeBtn);

    var body = document.createElement("div");
    body.className = "equality-terminal-body";

    var logEl = document.createElement("div");
    logEl.className = "equality-terminal-log";

    var hint = document.createElement("div");
    hint.className = "equality-terminal-hint";
    hint.textContent = "$ verify --strict";

    body.appendChild(hint);
    body.appendChild(logEl);

    panel.appendChild(titleBar);
    panel.appendChild(body);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    function close() {
      backdrop.remove();
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e) {
      if (e.key === "Escape") close();
    }

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) close();
    });
    panel.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(function () {
      runVerification(logEl);
    });
  }

  function theTruestEquality(id) {
    var element = document.getElementById(id);
    if (!element) return;

    element.style.cursor = "pointer";
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", "Run strict equality check");

    function activate() {
      element.style.color = "#34c759";
      openTerminal();
    }

    element.addEventListener("click", activate);
    element.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    theTruestEquality("the-truest-equality");
  });
})();
