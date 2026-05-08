/* Global vanilla-JS effects shared across every page.
   Loaded with `defer`. Each block feature-detects so it's safe on every layout. */

(function () {
  "use strict";

  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer =
    window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---- 1. Scroll reveal --------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- 2. Cursor-following spotlight on cards ----------------------- */
  function initSpotlight() {
    if (!finePointer || reduced) return;
    var els = document.querySelectorAll(".spotlight");
    if (!els.length) return;
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width) * 100;
        var my = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty("--mx", mx.toFixed(2) + "%");
        el.style.setProperty("--my", my.toFixed(2) + "%");
      });
    });
  }

  /* ---- 3. 3D tilt --------------------------------------------------- */
  function initTilt() {
    if (!finePointer || reduced) return;
    var els = document.querySelectorAll(".tilt-card");
    if (!els.length) return;
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        var ry = px * 12;   // up to ±6deg
        var rx = -py * 12;
        el.style.transform =
          "perspective(800px) rotateX(" + rx.toFixed(2) +
          "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---- 4. Magnetic buttons ----------------------------------------- */
  function initMagnetic() {
    if (!finePointer || reduced) return;
    var els = document.querySelectorAll(".magnetic");
    if (!els.length) return;
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = ((e.clientX - r.left) - r.width / 2) / (r.width / 2);
        var dy = ((e.clientY - r.top) - r.height / 2) / (r.height / 2);
        el.style.transform =
          "translate(" + (dx * 8).toFixed(1) + "px," + (dy * 8).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---- 5. Scroll progress bar (auto-removes on short pages) -------- */
  function initScrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;
    var doc = document.documentElement;
    if (doc.scrollHeight <= window.innerHeight * 1.5) {
      bar.parentNode && bar.parentNode.removeChild(bar);
      return;
    }
    function update() {
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.setProperty("--scroll", pct.toFixed(2) + "%");
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---- 6. Animated counter (waits for counters.js to write a value) */
  function animateCounter(el, to) {
    if (reduced) {
      el.textContent = to;
      return;
    }
    el.classList.add("is-counting");
    var start = performance.now();
    var dur = 1200;
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    requestAnimationFrame(function step(now) {
      var t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else el.classList.remove("is-counting");
    });
  }

  function initCounters() {
    if (!("IntersectionObserver" in window) || !("MutationObserver" in window)) return;
    ["experience-counter", "repo-count"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;

      var armed = false;
      function arm(value) {
        if (armed) return;
        armed = true;
        if (!isFinite(value) || value <= 0) {
          el.textContent = value;
          return;
        }
        el.textContent = "0";
        var io = new IntersectionObserver(function (entries, obs) {
          if (entries[0].isIntersecting) {
            animateCounter(el, value);
            obs.disconnect();
          }
        });
        io.observe(el);
      }

      // If counters.js has already written by the time we run, animate now.
      var initial = parseInt(el.textContent, 10);
      if (isFinite(initial) && initial > 0) {
        arm(initial);
        return;
      }

      // Otherwise wait for the first textContent change.
      var mo = new MutationObserver(function () {
        var v = parseInt(el.textContent, 10);
        if (isFinite(v) && v > 0) {
          mo.disconnect();
          arm(v);
        }
      });
      mo.observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ---- 7. Hero subtitle typewriter (home only) --------------------- */
  function initHeroTypewriter() {
    if (reduced) return;
    if (document.body.dataset.page !== "home") return;
    var p = document.querySelector(".main-header > p");
    if (!p) return;
    var full = p.textContent.trim();
    if (!full) return;
    p.textContent = "";
    p.style.minHeight = "1em";
    var caret = document.createElement("span");
    caret.textContent = "▍";
    caret.style.cssText =
      "color:var(--accent-cyan);margin-left:2px;animation:tw-blink 1s steps(1) infinite;";
    p.appendChild(caret);

    var i = 0;
    var step = 18; // ms per char
    function tick() {
      if (i >= full.length) {
        setTimeout(function () { caret.remove(); }, 1200);
        return;
      }
      caret.insertAdjacentText("beforebegin", full.charAt(i));
      i++;
      setTimeout(tick, step);
    }
    // Inject keyframes once.
    if (!document.getElementById("tw-blink-style")) {
      var s = document.createElement("style");
      s.id = "tw-blink-style";
      s.textContent =
        "@keyframes tw-blink{50%{opacity:0;}}";
      document.head.appendChild(s);
    }
    setTimeout(tick, 350);
  }

  ready(function () {
    initReveals();
    initSpotlight();
    initTilt();
    initMagnetic();
    initScrollProgress();
    initCounters();
    initHeroTypewriter();
  });
})();
