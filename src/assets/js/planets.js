/*
 * planets.js — interactive heliocentric planet-position diagram.
 *
 * Zero dependencies. Replaces the Python/skyfield original with JPL approximate
 * Keplerian elements (planets, ~1800-2050) and a compact lunar series. Versus
 * the astronomy-engine ephemeris, planet right ascensions agree to <0.15° and
 * the Moon to <0.7° — visually exact for this stylized ring diagram.
 *
 * Proportions (ring spacing, dot size, ring weight, tight framing) mirror the
 * matplotlib original. No Sun is drawn. Planet names are optional. Users can
 * download the current diagram as an SVG, with or without a white background.
 *
 * Usage: put <div id="planets-applet"></div> on a page, then load this file
 * with <script src="/assets/js/planets.js" defer></script>. It builds the UI,
 * injects its own styles (using the site's CSS variables, so it auto-themes),
 * and renders. Only the page that includes the markup runs it.
 */
(function () {
  "use strict";

  var D2R = Math.PI / 180, EPS = 23.43928 * D2R;
  var NAMES = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

  // a, e, I, L, ϖ, Ω and their per-century rates (JPL, J2000 ecliptic).
  var EL = {
    Mercury: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593, 0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
    Venus:   [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255, 0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
    Earth:   [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0, 0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
    Mars:    [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891, 0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
    Jupiter: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909, -0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    Saturn:  [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448, -0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
    Uranus:  [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503, -0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
    Neptune: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574, 0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
    Pluto:   [39.48211675, 0.24882730, 17.14001206, 238.92903833, 224.06891629, 110.30393684, -0.00031596, 0.00005170, 0.00004818, 145.20780515, -0.04062942, -0.01183482]
  };

  function n360(x) { x %= 360; return x < 0 ? x + 360 : x; }
  function raFromEcl(xe, ye, ze) {
    var yq = Math.cos(EPS) * ye - Math.sin(EPS) * ze;
    var r = Math.atan2(yq, xe);
    return r < 0 ? r + 2 * Math.PI : r;
  }
  function planetRA(name, JD) {
    var T = (JD - 2451545) / 36525, e = EL[name];
    var a = e[0] + e[6] * T, ec = e[1] + e[7] * T, I = (e[2] + e[8] * T) * D2R,
        L = e[3] + e[9] * T, wb = e[4] + e[10] * T, Om = (e[5] + e[11] * T) * D2R;
    var omega = wb * D2R - Om;
    var M = n360(L - wb); if (M > 180) M -= 360; M *= D2R;
    var E = M + ec * Math.sin(M);
    for (var k = 0; k < 8; k++) { var dM = M - (E - ec * Math.sin(E)); E += dM / (1 - ec * Math.cos(E)); }
    var xp = a * (Math.cos(E) - ec), yp = a * Math.sqrt(1 - ec * ec) * Math.sin(E);
    var cO = Math.cos(Om), sO = Math.sin(Om), ci = Math.cos(I), si = Math.sin(I), cw = Math.cos(omega), sw = Math.sin(omega);
    var xe = (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp;
    var ye = (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp;
    var ze = (sw * si) * xp + (cw * si) * yp;
    return raFromEcl(xe, ye, ze);
  }
  function moonRA(JD) {
    var T = (JD - 2451545) / 36525;
    var Lp = 218.316 + 481267.881 * T, M = 357.529 + 35999.050 * T, Mp = 134.963 + 477198.867 * T,
        Dd = 297.850 + 445267.115 * T, F = 93.272 + 483202.018 * T;
    var s = function (x) { return Math.sin(x * D2R); };
    var lon = (Lp + 6.289 * s(Mp) + 1.274 * s(2 * Dd - Mp) + 0.658 * s(2 * Dd) + 0.214 * s(2 * Mp) - 0.186 * s(M) - 0.114 * s(2 * F)) * D2R;
    var lat = (5.128 * s(F) + 0.281 * s(Mp + F) + 0.278 * s(F - Mp) + 0.173 * s(2 * Dd - F)) * D2R;
    return raFromEcl(Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat));
  }
  function jd(y, mo, d, h, mi) {
    if (mo <= 2) { y--; mo += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (mo + 1)) + d + B - 1524.5 + (h + mi / 60) / 24;
  }

  // --- geometry (data units; ring spacing = 1, matched to the matplotlib plot)
  function shapes(y, mo, d, h, mi, moon, labels) {
    var JD = jd(y, mo, d, h, mi);
    var E = labels ? 10.6 : 9.42; // tight to Pluto's ring (+dot) when unlabelled
    var rings = [], dots = [], labs = [], mn = null, ex, ey;
    for (var i = 1; i <= 9; i++) rings.push(i);
    NAMES.forEach(function (nm, idx) {
      var r = idx + 1, a = planetRA(nm, JD), X = r * Math.cos(a), Y = -r * Math.sin(a);
      if (nm === "Earth") { ex = X; ey = Y; }
      dots.push({ x: X, y: Y });
      if (labels) { var rt = Math.cos(a) >= 0; labs.push({ x: X + (rt ? 0.5 : -0.5), y: Y - 0.5, a: rt ? "start" : "end", n: nm }); }
    });
    if (moon) { var ma = moonRA(JD); mn = { rx: ex, ry: ey, dx: ex + Math.cos(ma), dy: ey - Math.sin(ma) }; }
    return { E: E, rings: rings, dots: dots, labs: labs, mn: mn };
  }
  function f(v) { return v.toFixed(3); }

  function displaySVG(sh) {
    var E = sh.E, s = '<svg class="pl-plot" viewBox="' + (-E) + ' ' + (-E) + ' ' + (2 * E) + ' ' + (2 * E) + '" xmlns="http://www.w3.org/2000/svg">';
    sh.rings.forEach(function (r) { s += '<circle class="pl-ring" cx="0" cy="0" r="' + r + '"/>'; });
    sh.dots.forEach(function (d) { s += '<circle class="pl-dot" cx="' + f(d.x) + '" cy="' + f(d.y) + '" r="0.33"/>'; });
    if (sh.mn) {
      s += '<circle class="pl-mring" cx="' + f(sh.mn.rx) + '" cy="' + f(sh.mn.ry) + '" r="1"/>';
      s += '<circle class="pl-moon" cx="' + f(sh.mn.dx) + '" cy="' + f(sh.mn.dy) + '" r="0.26"/>';
    }
    sh.labs.forEach(function (l) { s += '<text class="pl-lab" x="' + f(l.x) + '" y="' + f(l.y) + '" text-anchor="' + l.a + '" font-size="0.5">' + l.n + '</text>'; });
    return s + '</svg>';
  }

  function exportSVG(sh, c, white) {
    var E = sh.E, s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-E) + ' ' + (-E) + ' ' + (2 * E) + ' ' + (2 * E) + '" width="600" height="600">';
    if (white) s += '<rect x="' + (-E) + '" y="' + (-E) + '" width="' + (2 * E) + '" height="' + (2 * E) + '" fill="#ffffff"/>';
    sh.rings.forEach(function (r) { s += '<circle cx="0" cy="0" r="' + r + '" fill="none" stroke="' + c.ring + '" stroke-width="0.11" stroke-opacity="0.7"/>'; });
    sh.dots.forEach(function (d) { s += '<circle cx="' + f(d.x) + '" cy="' + f(d.y) + '" r="0.33" fill="' + c.accent + '"/>'; });
    if (sh.mn) {
      s += '<circle cx="' + f(sh.mn.rx) + '" cy="' + f(sh.mn.ry) + '" r="1" fill="none" stroke="' + c.ring + '" stroke-width="0.055" stroke-opacity="0.8"/>';
      s += '<circle cx="' + f(sh.mn.dx) + '" cy="' + f(sh.mn.dy) + '" r="0.26" fill="' + c.accent + '"/>';
    }
    sh.labs.forEach(function (l) { s += '<text x="' + f(l.x) + '" y="' + f(l.y) + '" text-anchor="' + l.a + '" font-size="0.5" font-family="monospace" fill="' + c.muted + '">' + l.n + '</text>'; });
    return s + '</svg>';
  }

  var CSS =
    '.planets-applet{font-family:var(--font-body,Georgia,serif)}' +
    '.planets-applet .pl-controls{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;margin:0 0 6px}' +
    '.planets-applet .pl-field{display:flex;flex-direction:column;gap:4px}' +
    '.planets-applet label{font-family:var(--font-mono,monospace);text-transform:uppercase;letter-spacing:.1em;font-size:9px;color:var(--muted,#6f6557)}' +
    '.planets-applet input[type=date],.planets-applet input[type=time],.planets-applet input[type=text]{font-family:var(--font-mono,monospace);font-size:12px;color:var(--text,#221e1b);background:var(--card,#fbf8f1);border:1px solid var(--border-strong,#b9ab93);border-radius:0;padding:6px 8px}' +
    '.planets-applet input[type=text]{width:120px}' +
    '.planets-applet .pl-chk{display:inline-flex;align-items:center;gap:7px;font-family:var(--font-mono,monospace);font-size:11px;color:var(--text,#221e1b);cursor:pointer;padding-bottom:6px}' +
    '.planets-applet .pl-chk input{accent-color:var(--accent,#4a2545)}' +
    '.planets-applet .pl-now{font-family:var(--font-mono,monospace);text-transform:uppercase;letter-spacing:.08em;font-size:9.5px;color:var(--accent,#4a2545);background:transparent;border:1px solid var(--border-strong,#b9ab93);border-radius:0;padding:6px 9px;cursor:pointer}' +
    '.planets-applet .pl-cap{text-align:center;font-family:var(--font-mono,monospace);text-transform:uppercase;letter-spacing:.1em;font-size:10px;color:var(--accent,#4a2545);margin:6px 0 0;min-height:13px}' +
    '.planets-applet .pl-plot{display:block;width:100%;max-width:420px;height:auto;margin:2px auto 0}' +
    '.planets-applet .pl-ring{fill:none;stroke:var(--border-strong,#b9ab93);stroke-width:0.11;opacity:.7}' +
    '.planets-applet .pl-mring{fill:none;stroke:var(--border-strong,#b9ab93);stroke-width:0.055;opacity:.8}' +
    '.planets-applet .pl-dot,.planets-applet .pl-moon{fill:var(--accent,#4a2545)}' +
    '.planets-applet .pl-lab{fill:var(--muted,#6f6557);font-family:var(--font-mono,monospace)}' +
    '.planets-applet .pl-dl{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:12px}' +
    '.planets-applet .pl-dl button{font-family:var(--font-mono,monospace);text-transform:uppercase;letter-spacing:.08em;font-size:9.5px;color:var(--text,#221e1b);background:transparent;border:1px solid var(--border-strong,#b9ab93);border-radius:0;padding:7px 12px;cursor:pointer}' +
    '.planets-applet .pl-dl button:hover{border-color:var(--accent,#4a2545);color:var(--accent,#4a2545)}';

  var UI =
    '<div class="pl-controls">' +
    '<div class="pl-field"><label>Name (optional)</label><input type="text" data-name placeholder="RICKY"></div>' +
    '<div class="pl-field"><label>Date (UTC)</label><input type="text" data-date placeholder="dd/mm/yyyy" inputmode="numeric" style="width:104px"></div>' +
    '<div class="pl-field"><label>Time (UTC)</label><input type="time" data-time></div>' +
    '<label class="pl-chk"><input type="checkbox" data-moon checked> Moon</label>' +
    '<label class="pl-chk"><input type="checkbox" data-names> Names</label>' +
    '<button class="pl-now" type="button" data-now>Now</button>' +
    '</div><p class="pl-cap" data-cap></p><div data-plot></div>' +
    '<div class="pl-dl"><button type="button" data-dl="0">Download SVG</button>' +
    '<button type="button" data-dl="1">Download SVG (white bg)</button></div>';

  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function fmtDMY(dt) {
    return ("0" + dt.getUTCDate()).slice(-2) + "/" + ("0" + (dt.getUTCMonth() + 1)).slice(-2) + "/" + dt.getUTCFullYear();
  }
  function parseDMY(str) {
    var m = /^\s*(\d{1,2})\D(\d{1,2})\D(\d{2,4})\s*$/.exec(str || "");
    if (!m) return null;
    var y = +m[3]; if (y < 100) y += 2000;
    return { y: y, mo: +m[2], d: +m[1] };
  }

  function init() {
    var host = document.getElementById("planets-applet");
    if (!host) return;
    host.classList.add("planets-applet");
    if (!document.getElementById("planets-applet-style")) {
      var st = document.createElement("style");
      st.id = "planets-applet-style"; st.textContent = CSS;
      document.head.appendChild(st);
    }
    host.innerHTML = UI;
    var di = host.querySelector("[data-date]"), ti = host.querySelector("[data-time]"),
        mo = host.querySelector("[data-moon]"), na = host.querySelector("[data-names]"),
        ni = host.querySelector("[data-name]"), cap = host.querySelector("[data-cap]"),
        plot = host.querySelector("[data-plot]");
    var now = new Date();
    di.value = fmtDMY(now);
    ti.value = now.toISOString().slice(11, 16);

    function parts() {
      var p = parseDMY(di.value) || { y: 2000, mo: 1, d: 1 };
      return { dp: [p.y, p.mo, p.d], tp: (ti.value || "12:00").split(":").map(Number) };
    }
    function curShapes() { var p = parts(); return shapes(p.dp[0], p.dp[1], p.dp[2], p.tp[0], p.tp[1], mo.checked, na.checked); }
    function render() {
      var p = parts();
      plot.innerHTML = displaySVG(curShapes());
      var nm = (ni.value || "").trim();
      cap.textContent = (nm ? nm + " · " : "") + p.dp[2] + " " + MON[p.dp[1] - 1] + " " + p.dp[0] +
        ", " + ("0" + p.tp[0]).slice(-2) + ":" + ("0" + p.tp[1]).slice(-2) + " UTC";
    }
    function colors() {
      var cs = getComputedStyle(host);
      return {
        accent: cs.getPropertyValue("--accent").trim() || "#4a2545",
        ring: cs.getPropertyValue("--border-strong").trim() || "#b9ab93",
        muted: cs.getPropertyValue("--muted").trim() || "#6f6557"
      };
    }
    function download(white) {
      var svg = exportSVG(curShapes(), colors(), white);
      var p = parts(), iso = p.dp[0] + "-" + ("0" + p.dp[1]).slice(-2) + "-" + ("0" + p.dp[2]).slice(-2);
      var nm = (ni.value || "plot").trim().replace(/[^A-Za-z0-9_-]+/g, "_") || "plot";
      var blob = new Blob([svg], { type: "image/svg+xml" }), url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = "planets_" + nm + "_" + iso + (white ? "_white" : "") + ".svg";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    }

    host.querySelector("[data-now]").addEventListener("click", function () {
      var n = new Date(); di.value = fmtDMY(n); ti.value = n.toISOString().slice(11, 16); render();
    });
    host.querySelector('[data-dl="0"]').addEventListener("click", function () { download(false); });
    host.querySelector('[data-dl="1"]').addEventListener("click", function () { download(true); });
    [di, ti, ni].forEach(function (el) { el.addEventListener("input", render); });
    mo.addEventListener("change", render);
    na.addEventListener("change", render);
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
