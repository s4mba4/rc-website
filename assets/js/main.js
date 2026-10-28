/* RainCatcher Technologies — site scripts (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LANG = (document.documentElement.lang || "en").slice(0, 2);
  var TX = (window.RC_I18N && (window.RC_I18N[LANG] || window.RC_I18N.en)) || {};
  var EN = (window.RC_I18N && window.RC_I18N.en) || {};
  var tx = function (k) { return TX[k] !== undefined ? TX[k] : EN[k]; };
  var LOCALE = tx("locale") || "en-GB";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- header: shadow on scroll + mobile nav ---------- */
  var header = $(".site-header");
  var toTop = $(".to-top");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-shown", y > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  /* collapse the nav into the burger menu when it does not fit (depends on the language's label lengths) */
  var hInner = $(".header-inner");
  function fitNav() {
    if (!hInner) return;
    var r = document.documentElement.classList;
    r.remove("nav-mobile"); r.remove("nav-compact");
    var over = function () { return hInner.scrollWidth > hInner.clientWidth + 1; };
    if (window.innerWidth <= 1260) { r.add("nav-mobile"); return; }
    if (over()) { r.add("nav-compact"); if (over()) { r.remove("nav-compact"); r.add("nav-mobile"); } }
  }
  fitNav();
  window.addEventListener("resize", fitNav);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);

  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? tx("menuClose") : tx("menuOpen"));
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
    window.addEventListener("resize", function () { if (!document.documentElement.classList.contains("nav-mobile")) setNav(false); });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- animated counters ---------- */
  function fmt(n, dec) { return n.toLocaleString(LOCALE, { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function runCounter(el) {
    var to = parseFloat(el.getAttribute("data-to"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    if (reduceMotion || isNaN(to)) { el.textContent = fmt(to, dec); return; }
    var dur = 1600, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(to, dec);
    }
    requestAnimationFrame(step);
  }
  var counters = $$(".count");
  if (counters.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      counters.forEach(function (c) { c.textContent = "0"; });
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { co.observe(c); });
    }
  }

  /* ---------- hero drops ---------- */
  var drops = $(".hero-drops");
  if (drops && !reduceMotion) {
    for (var i = 0; i < 16; i++) {
      var d = document.createElement("i");
      d.style.left = (Math.random() * 100).toFixed(1) + "%";
      d.style.animationDelay = (-Math.random() * 9).toFixed(1) + "s";
      d.style.animationDuration = (7 + Math.random() * 7).toFixed(1) + "s";
      d.style.transform = "scale(" + (0.6 + Math.random() * 0.9).toFixed(2) + ")";
      drops.appendChild(d);
    }
  }

  /* ---------- soil cross-section diagram ---------- */
  $$("[data-soil]").forEach(function (root) {
    var svg = $(".soil-svg", root);
    var caption = $(".soil-caption", root);
    var btns = $$("[data-state-btn]", root);
    var captions = {
      without: root.getAttribute("data-cap-without"),
      "with": root.getAttribute("data-cap-with")
    };
    var auto = root.hasAttribute("data-auto");
    var timer = null;
    function set(state) {
      svg.setAttribute("data-state", state);
      if (caption) caption.textContent = captions[state] || "";
      btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-state-btn") === state)); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      if (!auto || reduceMotion || timer) return;
      timer = setInterval(function () { set(svg.getAttribute("data-state") === "with" ? "without" : "with"); }, 7000);
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { stop(); auto = false; set(b.getAttribute("data-state-btn")); });
    });
    set(svg.getAttribute("data-state") || "with");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }, { threshold: 0.2 }).observe(root);
    } else { start(); }
  });

  /* ---------- "more hectares, same water" calculator ---------- */
  var calc = $("#calculator");
  if (calc) {
    var inRes = $("#calc-reservoir"), inCons = $("#calc-cons"), inRed = $("#calc-red"), outRed = $("#calc-red-out");
    var oNow = $("#calc-now"), oNew = $("#calc-new"), oDelta = $("#calc-delta"), mBase = $("#calc-meter-base");
    var nf = function (n, d) { return n.toLocaleString(LOCALE, { maximumFractionDigits: d || 0 }); };
    var update = function () {
      var res = parseFloat(inRes.value), cons = parseFloat(inCons.value), red = parseFloat(inRed.value);
      outRed.textContent = red + "%";
      inRed.setAttribute("aria-valuetext", red + " percent");
      if (!(res > 0) || !(cons > 0)) { oNew.textContent = "—"; oNow.textContent = "—"; oDelta.textContent = tx("calcEmpty"); return; }
      var now = res / cons, next = res / (cons * (1 - red / 100));
      oNow.textContent = nf(now);
      oNew.textContent = nf(next);
      var gain = (next / now - 1) * 100;
      oDelta.textContent = red === 0 ? tx("calcNone") : tx("calcGain").replace("{d}", nf(next - now)).replace("{p}", nf(gain));
      mBase.style.width = Math.min(100, (now / next) * 100) + "%";
    };
    [inRes, inCons, inRed].forEach(function (i) { i.addEventListener("input", update); });
    update();
  }

  /* ---------- results explorer ---------- */
  var exList = $("#ex-list");
  if (exList && window.RC_TRIALS) {
    var data = window.RC_TRIALS;
    var q = $("#ex-q"), fc = $("#ex-country"), ft = $("#ex-type"), fr = $("#ex-regime"), cnt = $("#ex-count"), reset = $("#ex-reset");
    var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };
    var disc = '<p class="disclaimer">' + tx("disc") + '</p>';
    Array.from(new Set(data.map(function (t) { return t.country; }))).sort().forEach(function (c) {
      var o = document.createElement("option"); o.value = c; o.textContent = c; fc.appendChild(o);
    });
    var render = function () {
      var term = q.value.trim().toLowerCase();
      var res = data.filter(function (t) {
        if (fc.value && t.country !== fc.value) return false;
        if (ft.value && t.type !== ft.value) return false;
        if (fr.value && t.regime !== fr.value) return false;
        if (term && (t.title + " " + t.crop + " " + t.country + " " + t.region + " " + t.summary).toLowerCase().indexOf(term) === -1) return false;
        return true;
      });
      cnt.textContent = res.length + " " + (res.length === 1 ? tx("trial1") : tx("trialN"));
      if (!res.length) { exList.innerHTML = '<div class="empty">' + tx("noTrial") + '</div>'; return; }
      exList.innerHTML = res.map(function (t) {
        var rows = t.details.map(function (d) { return "<dt>" + esc(d[0]) + "</dt><dd>" + esc(d[1]) + "</dd>"; }).join("");
        var tags = [t.crop, t.typeLabel, t.regimeLabel, t.country].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
        var link = t.link ? '<p><a class="link-arrow" href="' + esc(t.link) + '">' + tx("readCase") + '</a></p>' : "";
        return '<article class="trial"><div><h3>' + esc(t.title) + "</h3><p>" + esc(t.summary) + '</p><ul class="tags">' + tags + "</ul>" + link + "</div><dl>" + rows + "</dl>" + disc + "</article>";
      }).join("");
    };
    [q, fc, ft, fr].forEach(function (el) { el.addEventListener("input", render); });
    reset.addEventListener("click", function () { q.value = ""; fc.value = ""; ft.value = ""; fr.value = ""; render(); });
    render();
  }

  /* ---------- contact form ---------- */
  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");
    var endpoint = form.getAttribute("data-endpoint") || "";
    var recipients = form.getAttribute("data-mailto") || "";
    var setStatus = function (cls, html) { status.className = "form-status " + cls; status.innerHTML = html; status.focus(); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, first = null;
      $$("[required]", form).forEach(function (f) {
        var bad = f.type === "checkbox" ? !f.checked : !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.setAttribute("aria-invalid", String(bad));
        var wrap = f.closest(".field"); if (wrap) wrap.classList.toggle("has-error", bad);
        if (bad) { ok = false; if (!first) first = f; }
      });
      if (!ok) { first.focus(); setStatus("is-err", tx("formIncomplete")); return; }
      if ($("[name=website]", form).value) return; // honeypot
      var fd = new FormData(form); fd.delete("website");
      var obj = {}; fd.forEach(function (v, k) { obj[k] = v; });
      if (endpoint) {
        fetch(endpoint, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(obj) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); setStatus("is-ok", form.getAttribute("data-confirm")); })
          .catch(function () { setStatus("is-err", tx("formFail").replace(/\{m\}/g, recipients.split(",")[0])); });
      } else {
        // No form endpoint configured yet: open the visitor's mail app with a pre-filled message.
        var lines = [
          "Name: " + obj.name, "Organisation: " + (obj.organisation || "-"), "Email: " + obj.email, "Phone / WhatsApp: " + (obj.phone || "-"),
          "Country: " + (obj.country || "-"), "I am: " + (obj.role || "-"), "Crops: " + (obj.crops || "-"),
          "Area (ha) or number of trees: " + (obj.area || "-"), "Water regime: " + (obj.regime || "-"), "", obj.message || ""
        ];
        window.location.href = "mailto:" + recipients + "?subject=" + encodeURIComponent("Website enquiry from " + obj.name) + "&body=" + encodeURIComponent(lines.join("\n"));
        setStatus("is-ok", tx("formMailto").replace(/\{m\}/g, recipients.split(",")[0]));
      }
    });
  }
  /* ---------- language switcher: close on outside click / Escape ---------- */
  $$(".lang-switch").forEach(function (d) {
    document.addEventListener("click", function (e) { if (!d.contains(e.target)) d.removeAttribute("open"); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") { d.removeAttribute("open"); $("summary", d).focus(); } });
  });
})();
