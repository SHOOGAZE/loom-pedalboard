
(function () {
  function pct(v) { return Math.round(v * 100) + "%"; }
  function sgn(v) { return (v > 0 ? "+" : "") + v; }
  var SHIM = [-12, 7, 12, 19, 24];
  function shimIdx(v) { return Math.min(4, Math.floor(v * 5)); }
  var VOWELS = ["A", "E", "I", "O", "U"];

  var K1 = [
    { id: "echo", label: "Echo", min: 60, max: 900, step: 1, def: 340, pow: 1.6, fmt: function (v) { return Math.round(v) + " ms"; }, hint: "Delay time" },
    { id: "fb", label: "Repeats", min: 0, max: 0.9, step: 0.01, def: 0.3, fmt: pct, hint: "How much echo returns" },
    { id: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.7, fmt: pct, hint: "Dry vs wet" }
  ];
  var KMASTER = { id: "level", label: "Volume", min: 0, max: 1, step: 0.01, def: 0.8, fmt: pct, hint: "Master level" };
  var KLOOP = { id: "looplevel", label: "Level", min: 0, max: 1.2, step: 0.01, def: 0.9, fmt: pct, hint: "Looper level" };
  var K2 = [
    { id: "decay", label: "Decay", min: 0.3, max: 10, step: 0.1, def: 2.2, pow: 2, fmt: function (v) { return v.toFixed(1) + " s"; }, hint: "Tail length" },
    { id: "predelay", label: "Pre-delay", min: 0, max: 250, step: 1, def: 20, pow: 1.8, fmt: function (v) { return Math.round(v) + " ms"; }, hint: "Pause before the reverb" },
    { id: "space", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.4, fmt: pct, hint: "How much signal goes to reverb" },
    { id: "tone", label: "Tone", min: -1, max: 1, step: 0.01, def: 0.1, fmt: function (v) { return v < -0.05 ? "darker" : v > 0.05 ? "brighter" : "flat"; }, hint: "Tilt of the tail spectrum" },
    { id: "p1", label: "Param 1", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Depends on type" },
    { id: "p2", label: "Param 2", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Depends on type" },
    { id: "mod", label: "Mod", min: 0, max: 1, step: 0.01, def: 0.25, fmt: pct, hint: "Depth of tail drift" },
    { id: "modrate", label: "Speed", min: 0, max: 1, step: 0.01, def: 0.3, fmt: function (v) { return (0.1 + v * 3).toFixed(1) + " Hz"; }, hint: "Modulation speed" }
  ];
  var K3 = [
    { id: "room", label: "Room", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Room size" },
    { id: "diff", label: "Diffusion", min: 0, max: 1, step: 0.01, def: 0.8, fmt: pct, hint: "Reflection density" },
    { id: "lowdamp", label: "Low Damp", min: 0, max: 1, step: 0.01, def: 0.25, fmt: pct, hint: "Cuts the lows of the tail" },
    { id: "hidamp", label: "Hi Damp", min: 0, max: 1, step: 0.01, def: 0.3, fmt: pct, hint: "Damps the highs of the tail" },
    { id: "width", label: "Width", min: 0, max: 1, step: 0.01, def: 1, fmt: pct, hint: "From mono to full stereo" },
    { id: "rout", label: "Output", min: 0, max: 1.5, step: 0.01, def: 1, fmt: pct, hint: "Tail level" }
  ];
  var TYPES = [
    { k: "bloom", n: "Bloom", ang: -15, d: 4, p1: ["Bloom", 0.5, function (v) { return (0.15 + v * 1.6).toFixed(1) + " s"; }], p2: ["Softness", 0.5, pct] },
    { k: "cloud", n: "Cloud", ang: 15, d: 6, p1: ["Shade", 0.5, pct], p2: ["Cloudiness", 0.5, pct] },
    { k: "chorale", n: "Choral", ang: 45, d: 3.5, p1: ["Vowel", 0.3, function (v) { return VOWELS[Math.min(4, Math.round(v * 4))]; }], p2: ["Q", 0.5, pct] },
    { k: "shimmer", n: "Shimmer", ang: 75, d: 4.5, p1: ["Amount", 0.5, pct], p2: ["Interval", 0.5, function (v) { return sgn(SHIM[shimIdx(v)]) + " st"; }] },
    { k: "magneto", n: "Magneto", ang: 105, d: 2.2, p1: ["Heads", 0.4, function (v) { return Math.round(60 + v * 400) + " ms"; }], p2: ["Repeats", 0.5, pct] },
    { k: "nonlinear", n: "Gate", ang: 135, d: 1, p1: ["Shape", 0.1, function (v) { return v < 0.34 ? "Gate" : v < 0.67 ? "Reverse" : "Fall"; }], p2: ["Length", 0.4, function (v) { return (0.1 + v * 1.4).toFixed(2) + " s"; }] },
    { k: "reflections", n: "Reflections", ang: 165, d: 1.5, p1: ["Pattern", 0.5, function (v) { return (6 + Math.round(v * 18)) + " refl."; }], p2: ["Spread", 0.5, pct] },
    { k: "room", n: "Room", ang: -165, d: 1.2, p1: ["Early", 0.5, pct], p2: ["Warmth", 0.5, pct] },
    { k: "hall", n: "Hall", ang: -135, d: 3.2, p1: ["Early", 0.4, pct], p2: ["Rise", 0.3, pct] },
    { k: "plate", n: "Plate", ang: -105, d: 2.2, p1: ["Bright", 0.6, pct], p2: ["Ring", 0.2, pct] },
    { k: "spring", n: "Spring", ang: -75, d: 2.4, p1: ["Tension", 0.5, pct], p2: ["Rattle", 0.5, pct] },
    { k: "swell", n: "Swell", ang: -45, d: 3.5, p1: ["Rise", 0.4, function (v) { return (0.1 + v * 2.4).toFixed(1) + " s"; }], p2: ["Slope", 0.4, pct] }
  ];
  var TMAP = {};
  TYPES.forEach(function (t) { TMAP[t.k] = t; });

  var P = { rtype: "plate", revOn: true, freeze: false };
  [].concat(K1, [KMASTER, KLOOP], K2, K3).forEach(function (c) { P[c.id] = c.def; });
  var knobs = {};

  function polar(r, ang) { var a = ang * Math.PI / 180; return [40 + r * Math.sin(a), 40 - r * Math.cos(a)]; }
  function arcPath(n) {
    if (n < 0.004) return "";
    var a0 = -135, a1 = -135 + 270 * n, p0 = polar(33, a0), p1 = polar(33, a1);
    return "M" + p0[0].toFixed(2) + " " + p0[1].toFixed(2) + " A33 33 0 " + ((a1 - a0) > 180 ? 1 : 0) + " 1 " + p1[0].toFixed(2) + " " + p1[1].toFixed(2);
  }
  function toN(c, v) { var n = (v - c.min) / (c.max - c.min); return Math.pow(Math.min(1, Math.max(0, n)), 1 / (c.pow || 1)); }
  function fromN(c, n) {
    n = Math.min(1, Math.max(0, n));
    var v = c.min + (c.max - c.min) * Math.pow(n, c.pow || 1);
    v = Math.round((v - c.min) / c.step) * c.step + c.min;
    return Math.min(c.max, Math.max(c.min, parseFloat(v.toFixed(4))));
  }
  function knobHTML(dark, arc) {
    var s = '<div class="knob ' + (dark ? "dark" : "light") + '" tabindex="0" role="slider"><svg class="kscale" viewBox="0 0 80 80" aria-hidden="true">';
    for (var i = 0; i < 21; i++) {
      var a = -135 + 13.5 * i, p = polar(i % 5 === 0 ? 35 : 36.5, a), q = polar(39, a);
      s += '<line class="tick" x1="' + p[0].toFixed(2) + '" y1="' + p[1].toFixed(2) + '" x2="' + q[0].toFixed(2) + '" y2="' + q[1].toFixed(2) + '"/>';
    }
    if (arc) s += '<path class="arc" d=""/>';
    return s + '</svg><div class="kbody"><div class="kskirt"></div><div class="kcap"></div></div><div class="kind"></div></div>';
  }
  function makeKnob(c, host, opts) {
    opts = opts || {};
    var wrap = document.createElement("div");
    wrap.className = "kw" + (opts.small ? " small" : "") + ((opts.big || opts.main) ? " big" : "");
    wrap.innerHTML = knobHTML(!!opts.dark, true) + '<span class="name"></span><span class="sub"></span>';
    host.appendChild(wrap);
    var el = wrap.querySelector(".knob"); if (opts.main) el.classList.add("main");
    var  kind = wrap.querySelector(".kind"), arc = wrap.querySelector(".arc"),
        nm = wrap.querySelector(".name"), sub = wrap.querySelector(".sub");
    function paint(v) {
      var n = toN(c, v);
      kind.style.transform = "rotate(" + (-135 + 270 * n).toFixed(1) + "deg)";
      if (arc) arc.setAttribute("d", arcPath(n));
      el.setAttribute("aria-valuenow", v); el.setAttribute("aria-valuetext", c.fmt(v));
      sub.textContent = c.fmt(v);
    }
    function relabel() {
      nm.textContent = c.label; wrap.title = c.hint || ""; el.setAttribute("aria-label", c.label);
      el.setAttribute("aria-valuemin", c.min); el.setAttribute("aria-valuemax", c.max);
      paint(P[c.id]);
    }
    function user(n) {
      var v = fromN(c, n);
      setParam(c.id, v);
      if (opts.onUser) opts.onUser(c, v);
      clearPreset();
    }
    var startY = 0, startN = 0, drag = false;
    el.addEventListener("pointerdown", function (e) { drag = true; startY = e.clientY; startN = toN(c, P[c.id]); el.setPointerCapture(e.pointerId); el.focus({ preventScroll: true }); e.preventDefault(); });
    el.addEventListener("pointermove", function (e) { if (drag) user(startN + (startY - e.clientY) / (e.shiftKey ? 700 : 200)); });
    el.addEventListener("pointerup", function () { drag = false; });
    el.addEventListener("pointercancel", function () { drag = false; });
    el.addEventListener("dblclick", function () { user(toN(c, c.def)); });
    el.addEventListener("keydown", function (e) {
      var n = toN(c, P[c.id]), d = e.shiftKey ? 0.05 : 0.01, k = e.key;
      if (k === "ArrowUp" || k === "ArrowRight") n += d;
      else if (k === "ArrowDown" || k === "ArrowLeft") n -= d;
      else if (k === "PageUp") n += 0.1;
      else if (k === "PageDown") n -= 0.1;
      else if (k === "Home") n = 0;
      else if (k === "End") n = 1;
      else return;
      e.preventDefault(); user(n);
    });
    knobs[c.id] = { cfg: c, paint: paint, relabel: relabel };
    relabel();
  }

  var disp = { cap: document.getElementById("dispCap"), val: document.getElementById("dispVal") };
  function showDisplay(cap, val) { disp.cap.textContent = cap; disp.val.textContent = val; }
  function onRev(c, v) { showDisplay(c.label, c.fmt(v)); }
  makeKnob(KMASTER, document.getElementById("masterHost"), { big: true });
  makeKnob(KLOOP, document.getElementById("loopKnob"), { small: true });
  K2.forEach(function (c, i) { makeKnob(c, document.getElementById(i < 4 ? "knobs2a" : "knobs2b"), { dark: true, main: c.id === "decay", onUser: onRev }); });
  K3.forEach(function (c) { makeKnob(c, document.getElementById("knobs3"), { dark: true, small: true, onUser: onRev }); });

  var IRIDS = { decay: 1, p1: 1, p2: 1, room: 1, diff: 1 };
  function setParam(id, v) {
    P[id] = v;
    if (knobs[id]) knobs[id].paint(v);
    if (IRIDS[id]) refreshIR(false);
    applyFx();
  }

  var typeBtns = {}, sel = document.getElementById("sel"), selKnob = document.getElementById("selKnob");
  var ORDER = ["room", "hall", "plate", "spring", "swell", "bloom", "cloud", "chorale", "shimmer", "magneto", "nonlinear", "reflections"];
  var SCX = 180, SCY = 146, SR = 104;
  ORDER.forEach(function (k, i) {
    var t = TMAP[k]; t.ang = -165 + 30 * i;
    var bt = document.createElement("button"), a = t.ang * Math.PI / 180;
    bt.type = "button"; bt.className = "tp " + (t.ang < 0 ? "l" : "r"); bt.setAttribute("role", "radio"); bt.setAttribute("aria-checked", "false");
    bt.style.left = (SCX + SR * Math.sin(a)) + "px"; bt.style.top = (SCY - SR * Math.cos(a)) + "px";
    bt.innerHTML = t.ang < 0 ? '<span>' + t.n + '</span><span class="led"></span>' : '<span class="led"></span><span>' + t.n + '</span>';
    bt.addEventListener("click", function () { selectType(t.k, true); });
    sel.appendChild(bt); typeBtns[t.k] = bt;
  });
  selKnob.innerHTML = knobHTML(true, false);
  selKnob.querySelectorAll(".tick").forEach(function (x) { x.remove(); });
  var selInd = selKnob.querySelector(".kind");
  selKnob.addEventListener("click", function () { selectType(ORDER[(ORDER.indexOf(P.rtype) + 1) % ORDER.length], true); });
  selKnob.addEventListener("keydown", function (e) {
    var i = ORDER.indexOf(P.rtype), n = ORDER.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); selectType(ORDER[(i + n - 1) % n], true); }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); selectType(ORDER[(i + 1) % n], true); }
  });

  function selectType(key, user) {
    var T = TMAP[key];
    P.rtype = key;
    P.decay = T.d; P.p1 = T.p1[1]; P.p2 = T.p2[1];
    knobs.decay.cfg.def = T.d;
    knobs.p1.cfg.label = T.p1[0]; knobs.p1.cfg.fmt = T.p1[2]; knobs.p1.cfg.def = T.p1[1];
    knobs.p2.cfg.label = T.p2[0]; knobs.p2.cfg.fmt = T.p2[2]; knobs.p2.cfg.def = T.p2[1];
    knobs.decay.relabel(); knobs.p1.relabel(); knobs.p2.relabel();
    TYPES.forEach(function (t) { typeBtns[t.k].setAttribute("aria-checked", t.k === key ? "true" : "false"); });
    selInd.style.transform = "rotate(" + T.ang + "deg)";
    refreshIR(true);
    applyFx();
    if (user) { showDisplay("Type", T.n); clearPreset(); }
  }

  function clearPreset() {}
  function resetReverb() {
    K2.concat(K3).forEach(function (c) { if (c.id !== "decay" && c.id !== "p1" && c.id !== "p2") setParam(c.id, c.def); });
    selectType(P.rtype, false);
    clearPreset();
    showDisplay("Reverb", "Reset");
  }

  function buildIR(S) {
    var sr = ctx.sampleRate, T = S.type, dec = S.decay, p1 = S.p1, p2 = S.p2, sz = 0.5 + S.size, dif = S.diff;
    var att = 0.004, curve = 1, floor = 0, a0 = 0.7, a1 = 0.25, densMin = 0, expAfter = false, secs = dec * 1.2 + 0.3, gateT = 0, i, k;
    switch (T) {
      case "room": att = 0.006 * sz; a0 = 0.8 - 0.3 * p2; a1 = 0.5 - 0.4 * p2; break;
      case "hall": att = 0.02 + 0.3 * p2; curve = 1.2; a0 = 0.75; a1 = 0.25; break;
      case "plate": a0 = 0.55 + 0.4 * p1; a1 = 0.18 + 0.3 * p1; break;
      case "spring": a0 = 0.5; a1 = 0.3; break;
      case "swell": att = 0.1 + 2.4 * p1; curve = 1 + 2 * p2; a0 = 0.7; a1 = 0.3; expAfter = true; secs = att + dec + 0.3; break;
      case "bloom": att = 0.15 + 1.6 * p1; curve = 1.4; floor = 0.1 + 0.5 * p2; a0 = 0.65; a1 = 0.28; expAfter = true; secs = att + dec + 0.3; break;
      case "cloud": att = 0.1 + 0.5 * p2; curve = 1.5; a0 = 0.45; a1 = 0.3 - 0.24 * p1; densMin = 0.6; break;
      case "chorale": a0 = 0.8; a1 = 0.5; break;
      case "shimmer": att = 0.01; a0 = 0.9; a1 = 0.55; break;
      case "magneto": a0 = 0.5; a1 = 0.25; secs = 4 * (0.06 + 0.4 * p1) + dec * 0.6 + 0.3; break;
      case "nonlinear": gateT = 0.1 + 1.4 * p2; dec = 90; a0 = 0.8; a1 = 0.5; secs = gateT + 0.05; break;
      case "reflections": secs = (8 + Math.round(p1 * 18)) * (0.004 + 0.012 * p2) * sz + 0.1; break;
    }
    secs = Math.min(9.5, Math.max(0.12, secs));
    var len = Math.floor(sr * secs), ir = ctx.createBuffer(2, len, sr);
    var dens = Math.max(densMin, 0.04 + 0.96 * Math.pow(dif, 1.4)), nrm = 1 / Math.sqrt(dens);
    for (var ch = 0; ch < 2; ch++) {
      var d = ir.getChannelData(ch), y = 0, slow = 0, bq = null;
      if (T === "reflections") {
        var N = 6 + Math.round(p1 * 18);
        for (k = 0; k < N; k++) {
          var tk = 0.003 + (k + Math.random()) * (0.004 + 0.012 * p2) * sz;
          var pos = Math.floor(tk * sr);
          if (pos < len) d[pos] += (Math.random() < 0.5 ? -1 : 1) * Math.exp(-6.9 * tk / dec) * (0.5 + Math.random() * 0.5) * 1.5;
        }
        var lp = 0;
        for (i = 0; i < len; i++) { lp += 0.5 * (d[i] - lp); d[i] = lp; }
        continue;
      }
      if (T === "chorale") bq = makeFormants(p1, p2, sr);
      for (i = 0; i < len; i++) {
        var t = i / sr;
        var n = Math.random() < dens ? (Math.random() * 2 - 1) * nrm : 0;
        var a = a0 + (a1 - a0) * Math.min(1, t / dec), s;
        if (bq) s = bq(n); else { y += a * (n - y); s = y; }
        if (T === "spring") { slow += 0.04 * (y - slow); s = (y - slow) * 0.6; }
        var td = expAfter ? Math.max(0, t - att) : t;
        var env = Math.exp(-6.9078 * td / dec);
        if (t < att) env *= floor + (1 - floor) * Math.pow(t / att, curve);
        d[i] = s * env;
      }
      if (T === "room" || T === "hall") {
        var maxP = (T === "room" ? 0.035 : 0.12) * sz, amp = p1 * 0.9;
        for (k = 0; k < 9; k++) {
          var q = Math.floor((0.003 + Math.random() * maxP) * sr);
          if (q < len) d[q] += (Math.random() < 0.5 ? -1 : 1) * amp * (1 - 0.5 * q / (maxP * sr)) * 3;
        }
      }
      if (T === "plate" && p2 > 0.02) {
        var fr = [], ph = [];
        for (k = 0; k < 5; k++) { fr.push(1400 + Math.random() * 5000); ph.push(Math.random() * 6.28); }
        for (i = 0; i < len; i++) {
          var tt = i / sr, e2 = Math.exp(-6.9 * tt / dec), ss = 0;
          for (k = 0; k < 5; k++) ss += Math.sin(6.2832 * fr[k] * tt + ph[k]);
          d[i] += ss * p2 * 0.12 * e2;
        }
      }
      if (T === "spring") {
        var period = (ch === 0 ? 0.046 : 0.052) - 0.024 * p1, burst = Math.floor(0.013 * sr), f0 = 2200 + 2400 * p1, ampS = 0.6 + 1.6 * p2;
        for (var e = 0; e * period < secs - 0.02; e++) {
          var st = Math.floor(e * period * sr), am = Math.exp(-6.9 * e * period / dec) * ampS;
          for (var j = 0; j < burst && st + j < len; j++) {
            var u = j / burst;
            d[st + j] += Math.sin(6.2832 * (f0 - 0.7 * f0 * u) * (j / sr)) * am * Math.sin(Math.PI * u) * 0.8;
          }
        }
      }
      if (T === "magneto") {
        var spacing = 0.06 + 0.4 * p1, gk = 0.35 + 0.55 * p2;
        for (i = 0; i < len; i++) d[i] *= 0.25;
        for (k = 1; k <= 4; k++) {
          var tp = Math.floor(k * spacing * sr), gg = Math.pow(gk, k), bl = Math.floor((0.014 + 0.008 * k) * sr), l2 = 0, aa = 0.65 / (1 + 0.4 * k);
          for (var m = 0; m < bl && tp + m < len; m++) {
            l2 += aa * ((Math.random() * 2 - 1) - l2);
            d[tp + m] += l2 * gg * 2.6 * Math.sin(Math.PI * m / bl);
          }
        }
      }
      if (T === "nonlinear") {
        var fade = Math.floor(0.008 * sr);
        for (i = 0; i < len; i++) {
          var tg = i / sr, sh = p1 < 0.34 ? 1 : p1 < 0.67 ? tg / gateT : 1 - tg / gateT;
          var ed = len - i; if (ed < fade) sh *= ed / fade;
          d[i] *= Math.max(0, sh);
        }
      }
    }
    return ir;
  }
  function makeFormants(p1, p2, sr) {
    var F = [[800, 1150, 2900], [400, 1600, 2700], [350, 1700, 2700], [450, 800, 2830], [325, 700, 2530]];
    var x = Math.min(3.999, p1 * 4), i0 = Math.floor(x), fr = x - i0, Q = 4 + p2 * 20, bands = [];
    for (var b = 0; b < 3; b++) {
      var f = F[i0][b] * (1 - fr) + F[i0 + 1][b] * fr, w0 = 2 * Math.PI * f / sr, al = Math.sin(w0) / (2 * Q), a0c = 1 + al;
      bands.push({ b0: al / a0c, b2: -al / a0c, a1: -2 * Math.cos(w0) / a0c, a2: (1 - al) / a0c, x1: 0, x2: 0, y1: 0, y2: 0, g: b === 0 ? 1 : b === 1 ? 0.7 : 0.4 });
    }
    return function (xn) {
      var out = 0;
      for (var q = 0; q < 3; q++) {
        var B = bands[q], yy = B.b0 * xn + B.b2 * B.x2 - B.a1 * B.y1 - B.a2 * B.y2;
        B.x2 = B.x1; B.x1 = xn; B.y2 = B.y1; B.y1 = yy; out += yy * B.g;
      }
      return out;
    };
  }

  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = new AC();
  var buf = null, peaks = null, recDest = null;
  var running = false;
  var guardGain, guardAn, guardTimer, rbIn, rbOut, chainOut, bus, dryGain, wetGain, master, delay, lp, fbGain, delayIn, revSend, revIn, preDelay, convs = [], cgain = [], curConv = 0;
  var revOut, fbFreeze, shSend, shFb, shOut, sat, revBus, revHp, revLp, revTone, revLow, modDelay, lfo, lfoGain, wLL, wLR, wRL, wRR, outGain;
  var shifter = null, srcLoop = null, irTimer = null, irBuf = null;

  function makeShifter() {
    var sr = ctx.sampleRate, per = 0.12, N = Math.floor(sr * per), I = [ctx.createBuffer(1, N, sr), ctx.createBuffer(1, N, sr), ctx.createBuffer(1, N, sr), ctx.createBuffer(1, N, sr)];
    var sa = I[0].getChannelData(0), sb = I[1].getChannelData(0), wa = I[2].getChannelData(0), wb = I[3].getChannelData(0);
    for (var i = 0; i < N; i++) {
      var ph = i / N, ph2 = (ph + 0.5) % 1;
      sa[i] = ph; sb[i] = ph2;
      wa[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * ph); wb[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * ph2);
    }
    var inp = ctx.createGain(), out = ctx.createGain(), dA = ctx.createDelay(1), dB = ctx.createDelay(1), gA = ctx.createGain(), gB = ctx.createGain(), mA = ctx.createGain(), mB = ctx.createGain();
    gA.gain.value = 0; gB.gain.value = 0; mA.gain.value = 0; mB.gain.value = 0;
    inp.connect(dA); inp.connect(dB); dA.connect(gA); dB.connect(gB); gA.connect(out); gB.connect(out);
    mA.connect(dA.delayTime); mB.connect(dB.delayTime);
    var t0 = ctx.currentTime + 0.05;
    [[I[0], mA], [I[1], mB], [I[2], gA.gain], [I[3], gB.gain]].forEach(function (pr) {
      var s = ctx.createBufferSource(); s.buffer = pr[0]; s.loop = true; s.connect(pr[1]); s.start(t0);
    });
    return {
      inp: inp, out: out,
      set: function (semi) {
        var r = Math.pow(2, semi / 12), base = Math.max(0, (r - 1) * per), g = (1 - r) * per, t = ctx.currentTime;
        dA.delayTime.setTargetAtTime(base, t, 0.05); dB.delayTime.setTargetAtTime(base, t, 0.05);
        mA.gain.setTargetAtTime(g, t, 0.05); mB.gain.setTargetAtTime(g, t, 0.05);
      }
    };
  }


  var clipEl = null, hot = 0, clipT = 0;
  var lvlS = 0;
  function root_lvl(v) { lvlS += (v - lvlS) * 0.5; document.documentElement.style.setProperty("--lvl", lvlS.toFixed(2)); }
  function startGuard() {
    if (guardTimer) return;
    if (!clipEl) { clipEl = document.createElement("div"); clipEl.id = "clipLed"; clipEl.textContent = "CLIP"; clipEl.setAttribute("aria-hidden", "true"); document.body.appendChild(clipEl); }
    var buf = new Float32Array(guardAn.fftSize);
    guardTimer = setInterval(function () {
      if (!guardAn || document.hidden) return;
      guardAn.getFloatTimeDomainData(buf);
      var i, pk = 0, sq = 0, v; for (i = 0; i < buf.length; i++) { v = buf[i]; if (v < 0) v = -v; if (v > pk) pk = v; sq += v * v; }
      var rms = Math.sqrt(sq / buf.length), now = ctx.currentTime;
      if (!document.body.classList.contains("lite")) root_lvl(Math.min(1, rms * 3.2));
      if (pk > 0.97) { clipEl.classList.add("on"); clearTimeout(clipT); clipT = setTimeout(function () { clipEl.classList.remove("on"); }, 400); }
      hot = rms > 0.5 ? hot + 1 : 0;
      if (hot >= 10) {
        hot = 0; guardGain.gain.cancelScheduledValues(now); guardGain.gain.setTargetAtTime(0.1, now, 0.04); guardGain.gain.setTargetAtTime(1, now + 2.5, 0.6);
        setStatus("Feedback protection: output muted for a moment. Lower Mix or Repeats, or use headphones.");
      }
    }, 100);
  }

  function buildGraph() {
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.knee.value = 12;
    master = ctx.createGain(); chainOut = ctx.createGain(); recDest = ctx.createMediaStreamDestination();
    // output stage: guard gain -> compressor -> brick-wall limiter -> soft clipper -> speakers / recorder
    guardGain = ctx.createGain(); chainOut.connect(guardGain); guardGain.connect(comp);
    var lim = ctx.createDynamicsCompressor(); lim.threshold.value = -2; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.003; lim.release.value = 0.1; comp.connect(lim);
    var sat = ctx.createWaveShaper(), cv = new Float32Array(2049), ci, cx, ca; for (ci = 0; ci < cv.length; ci++) { cx = ci / 1024 - 1; ca = Math.abs(cx); cv[ci] = ca < 0.8 ? cx : (cx < 0 ? -1 : 1) * (0.8 + 0.2 * Math.tanh((ca - 0.8) / 0.2)); } sat.curve = cv; sat.oversample = "2x";
    lim.connect(sat); sat.connect(ctx.destination); sat.connect(recDest);
    guardAn = ctx.createAnalyser(); guardAn.fftSize = 1024; sat.connect(guardAn); startGuard();
    dryGain = ctx.createGain(); dryGain.connect(master);
    wetGain = ctx.createGain(); wetGain.connect(master);
    bus = ctx.createGain(); bus.connect(wetGain);
    delayIn = ctx.createGain(); delayIn.gain.value = 0.6;
    delay = ctx.createDelay(1.5);
    lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3600;
    fbGain = ctx.createGain();
    bus.connect(delayIn); delayIn.connect(delay); delay.connect(lp); lp.connect(wetGain);
    lp.connect(fbGain); fbGain.connect(delay);

    revSend = ctx.createGain(); revIn = ctx.createGain(); preDelay = ctx.createDelay(0.5); revOut = ctx.createGain();
    rbIn = ctx.createGain(); rbOut = ctx.createGain(); rbIn.connect(rbOut); rbIn.connect(revSend); revSend.connect(revIn); revIn.connect(preDelay);
    for (var c = 0; c < 2; c++) {
      var cv = ctx.createConvolver(), cg = ctx.createGain();
      cg.gain.value = c === 0 ? 1 : 0;
      preDelay.connect(cv); cv.connect(cg); cg.connect(revOut);
      convs.push(cv); cgain.push(cg);
    }
    convs[0].buffer = irBuf || (irBuf = buildIR(irState()));
    sat = ctx.createWaveShaper();
    var cur = new Float32Array(1024);
    for (var i = 0; i < 1024; i++) { var x = (i / 511.5 - 1) * 2; cur[i] = Math.tanh(x); }
    sat.curve = cur;
    sat.connect(revIn);
    fbFreeze = ctx.createGain(); fbFreeze.gain.value = 0;
    var fhp = ctx.createBiquadFilter(); fhp.type = "highpass"; fhp.frequency.value = 110;
    var flp = ctx.createBiquadFilter(); flp.type = "lowpass"; flp.frequency.value = 7000;
    var fcomp = ctx.createDynamicsCompressor();
    fcomp.threshold.value = -30; fcomp.knee.value = 8; fcomp.ratio.value = 20; fcomp.attack.value = 0.005; fcomp.release.value = 0.3;
    revOut.connect(fbFreeze); fbFreeze.connect(fhp); fhp.connect(flp); flp.connect(fcomp); var fatt = ctx.createGain(); fatt.gain.value = 0.2; fcomp.connect(fatt); fatt.connect(sat);
    shifter = makeShifter();
    shSend = ctx.createGain(); shFb = ctx.createGain(); shOut = ctx.createGain();
    shSend.gain.value = 0; shFb.gain.value = 0; shOut.gain.value = 0;
    revOut.connect(shSend); shSend.connect(shifter.inp); shifter.out.connect(shFb); shFb.connect(sat); shifter.out.connect(shOut);
    revBus = ctx.createGain(); revOut.connect(revBus); shOut.connect(revBus);
    revHp = ctx.createBiquadFilter(); revHp.type = "highpass";
    revLp = ctx.createBiquadFilter(); revLp.type = "lowpass";
    revTone = ctx.createBiquadFilter(); revTone.type = "highshelf"; revTone.frequency.value = 2800;
    revLow = ctx.createBiquadFilter(); revLow.type = "lowshelf"; revLow.frequency.value = 300;
    modDelay = ctx.createDelay(0.05); modDelay.delayTime.value = 0.012;
    lfo = ctx.createOscillator(); lfoGain = ctx.createGain(); lfo.connect(lfoGain); lfoGain.connect(modDelay.delayTime); lfo.start();
    revBus.connect(revHp); revHp.connect(revLp); revLp.connect(revTone); revTone.connect(revLow); revLow.connect(modDelay);
    var split = ctx.createChannelSplitter(2), merge = ctx.createChannelMerger(2);
    wLL = ctx.createGain(); wLR = ctx.createGain(); wRL = ctx.createGain(); wRR = ctx.createGain();
    modDelay.connect(split);
    split.connect(wLL, 0); split.connect(wLR, 0); split.connect(wRL, 1); split.connect(wRR, 1);
    wLL.connect(merge, 0, 0); wRL.connect(merge, 0, 0); wLR.connect(merge, 0, 1); wRR.connect(merge, 0, 1);
    outGain = ctx.createGain(); merge.connect(outGain); outGain.connect(rbOut);
    buildBoard();
    buildLooper(comp);
    applyFx(true);
  }

  function irState() { return { type: P.rtype, decay: P.decay, p1: P.p1, p2: P.p2, size: P.room, diff: P.diff }; }
  function refreshIR(now) {
    clearTimeout(irTimer);
    var go = function () {
      irBuf = buildIR(irState());
      drawIR(irBuf);
      if (convs.length) {
        var nx = 1 - curConv, t = ctx.currentTime;
        convs[nx].buffer = irBuf;
        cgain[curConv].gain.setTargetAtTime(0, t, 0.04); cgain[nx].gain.setTargetAtTime(1, t, 0.04);
        curConv = nx;
      }
    };
    if (now) go(); else irTimer = setTimeout(go, 140);
  }

  function applyFx(imm) {
    if (!master) return;
    var t = ctx.currentTime, k = imm ? 0.001 : 0.03, a = P.mix * Math.PI / 2;
    dryGain.gain.setTargetAtTime(Math.cos(a), t, k);
    wetGain.gain.setTargetAtTime(Math.sin(a), t, k);
    master.gain.setTargetAtTime(P.level, t, k);
    delay.delayTime.setTargetAtTime(P.echo / 1000, t, 0.05);
    fbGain.gain.setTargetAtTime(P.fb, t, k);
    var on = P.revOn, sh = P.rtype === "shimmer";
    revSend.gain.setTargetAtTime(on && !P.freeze ? P.space : 0, t, 0.03);
    fbFreeze.gain.setTargetAtTime(on && P.freeze ? 0.9 : 0, t, 0.05);
    shSend.gain.setTargetAtTime(sh ? 1 : 0, t, 0.05);
    shFb.gain.setTargetAtTime(sh ? 0.12 + 0.7 * P.p1 : 0, t, 0.05);
    shOut.gain.setTargetAtTime(sh ? 0.35 + 0.65 * P.p1 : 0, t, 0.05);
    if (sh) shifter.set(SHIM[shimIdx(P.p2)]);
    preDelay.delayTime.setTargetAtTime(P.predelay / 1000, t, 0.03);
    revHp.frequency.setTargetAtTime(20 + P.lowdamp * P.lowdamp * 600, t, 0.03);
    revLp.frequency.setTargetAtTime(16000 - P.hidamp * 14500, t, 0.03);
    revTone.gain.setTargetAtTime(P.tone * 10, t, 0.03);
    revLow.gain.setTargetAtTime(-P.tone * 6, t, 0.03);
    lfo.frequency.setTargetAtTime(0.1 + P.modrate * 3, t, 0.05);
    lfoGain.gain.setTargetAtTime(P.mod * 0.006, t, 0.05);
    var wa = (1 + P.width) / 2, wb = (1 - P.width) / 2;
    wLL.gain.setTargetAtTime(wa, t, 0.03); wRR.gain.setTargetAtTime(wa, t, 0.03);
    wLR.gain.setTargetAtTime(wb, t, 0.03); wRL.gain.setTargetAtTime(wb, t, 0.03);
    outGain.gain.setTargetAtTime(P.rout, t, 0.03);
    if (loopOut) loopOut.gain.setTargetAtTime(P.looplevel, t, 0.03);
    applyMods(imm);
  }

  function setBuffer(b, name) {
    buf = b; window.__loopSrc = /demo/i.test(name);
    var ch0 = b.getChannelData(0), bins = 700, step = Math.max(1, Math.floor(ch0.length / bins));
    peaks = new Float32Array(bins);
    for (var j = 0; j < bins; j++) {
      var m = 0;
      for (var k2 = j * step; k2 < Math.min(ch0.length, (j + 1) * step); k2 += 8) { var v = Math.abs(ch0[k2]); if (v > m) m = v; }
      peaks[j] = m;
    }
    var mx = 0.0001;
    for (var q = 0; q < bins; q++) if (peaks[q] > mx) mx = peaks[q];
    for (var r = 0; r < bins; r++) peaks[r] /= mx;
    document.getElementById("srcName").textContent = name + ", " + b.duration.toFixed(1) + " s";
    if (running) { stop(); play(); }
  }
  function makeDemo() {
    var sr = ctx.sampleRate, secs = 8, n = Math.floor(sr * secs), b = ctx.createBuffer(2, n, sr), L = b.getChannelData(0), R = b.getChannelData(1), seed = 12345;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647 * 2 - 1; }
    function pluck(f, start, amp, pan, dur) {
      var N = Math.max(2, Math.round(sr / f)), d = new Float32Array(N), i, p = 0, len = Math.floor(dur * sr), gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
      for (i = 0; i < N; i++) d[i] = rnd();
      for (i = 0; i < len; i++) {
        var x = d[p], y = 0.5 * (x + d[(p + 1) % N]);
        d[p] = y * 0.9965; p = (p + 1) % N;
        var idx = (start + i) % n, v = x * amp * Math.min(1, i / 160) * Math.min(1, (len - i) / 2000);
        L[idx] += v * gl; R[idx] += v * gr;
      }
    }
    var chords = [[110, 164.81, 220, 261.63, 329.63], [87.31, 130.81, 174.61, 220, 261.63], [130.81, 196, 261.63, 329.63, 392], [98, 146.83, 196, 246.94, 293.66]];
    var pat = [0, 1, 2, 3, 4, 3, 2, 1], acc = [1, 0.7, 0.8, 0.75, 0.9, 0.7, 0.8, 0.7], c, k;
    for (c = 0; c < 4; c++) for (k = 0; k < 8; k++) {
      var t0 = Math.floor((c * 2 + k * 0.25) * sr), f = chords[c][pat[k]];
      pluck(f, t0, 0.5 * acc[k], (pat[k] - 2) * 0.18, 1.5);
    }
    var mx = 0.0001, q; for (q = 0; q < n; q++) { var a1 = Math.abs(L[q]), a2 = Math.abs(R[q]); if (a1 > mx) mx = a1; if (a2 > mx) mx = a2; }
    for (q = 0; q < n; q++) { L[q] *= 0.6 / mx; R[q] *= 0.6 / mx; }
    return b;
  }
  function makeDemoPiano() {
    var sr = ctx.sampleRate, secs = 8, n = Math.floor(sr * secs), b = ctx.createBuffer(2, n, sr), L = b.getChannelData(0), R = b.getChannelData(1), seed = 777;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647 * 2 - 1; }
    function key(f, start, amp, pan, dur) {
      var len = Math.floor(dur * sr), gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4), P = 7, k, i, B = 0.0003;
      for (k = 1; k <= P; k++) {
        var fk = f * k * Math.sqrt(1 + B * k * k); if (fk > sr * 0.45) break;
        var w = 2 * Math.PI * fk / sr, c = Math.cos(w), sn = Math.sin(w), x = 0, y = 1, a = amp / Math.pow(k, 1.15), dec = Math.exp(-(1.1 + 0.9 * k + f / 400) / sr * 1.0), e = 1;
        for (i = 0; i < len; i++) {
          var v = a * e * y * Math.min(1, i / 120) * Math.min(1, (len - i) / 3000), idx = (start + i) % n;
          L[idx] += v * gl; R[idx] += v * gr;
          var nx = x * c - y * sn; y = x * sn + y * c; x = nx; e *= dec;
        }
      }
      for (i = 0; i < 400; i++) { var h = rnd() * amp * 0.12 * (1 - i / 400), j = (start + i) % n; L[j] += h * gl; R[j] += h * gr; }
    }
    var ch = [[220, 261.63, 329.63, 440], [174.61, 261.63, 349.23, 440], [196, 261.63, 329.63, 392], [196, 246.94, 293.66, 392]], bass = [55, 43.65, 65.41, 49], c, k;
    for (c = 0; c < 4; c++) {
      key(bass[c], Math.floor(c * 2 * sr), 0.5, -0.2, 2.4);
      for (k = 0; k < 4; k++) key(ch[c][k], Math.floor((c * 2 + 0.25 + k * 0.4) * sr), 0.38, (k - 1.5) * 0.15, 2.4);
      key(ch[c][3] * 2, Math.floor((c * 2 + 1.6) * sr), 0.22, 0.2, 2);
    }
    var mx = 0.0001, q; for (q = 0; q < n; q++) { var a1 = Math.abs(L[q]), a2 = Math.abs(R[q]); if (a1 > mx) mx = a1; if (a2 > mx) mx = a2; }
    for (q = 0; q < n; q++) { L[q] *= 0.6 / mx; R[q] *= 0.6 / mx; }
    return b;
  }
  function loadFile(file) {
    setStatus("Loading " + file.name + "…");
    var fr = new FileReader();
    fr.onload = function () {
      ctx.decodeAudioData(fr.result, function (decoded) { setBuffer(decoded, file.name); setStatus("Track loaded. Press Play and it runs through the pedals."); },
        function () { setStatus("Could not read this file. Try mp3, wav or m4a."); });
    };
    fr.onerror = function () { setStatus("The file did not open."); };
    fr.readAsArrayBuffer(file);
  }
  function stopLoop() { if (srcLoop) { try { srcLoop.stop(); } catch (e) {} srcLoop.disconnect(); srcLoop = null; } }

  var demoPiano = false;
  var playBtn = document.getElementById("play"), playLed = document.getElementById("playLed"), playSub = document.getElementById("playSub");
  function play() {
    if (!buf) return;
    ctx.resume();
    if (!master) buildGraph();
    running = true;
    startDirect();
    playBtn.setAttribute("aria-pressed", "true"); playLed.classList.add("on"); playSub.textContent = "playing";
  }
  function stop() {
    running = false; stopLoop();
    playBtn.setAttribute("aria-pressed", "false"); playLed.classList.remove("on"); playSub.textContent = "start / stop";
  }

  function setStatus(s) { document.getElementById("status").textContent = s; }
  playBtn.addEventListener("click", function () { running ? stop() : play(); });
  document.getElementById("file").addEventListener("change", function (e) { if (e.target.files[0]) loadFile(e.target.files[0]); });
  document.getElementById("demo").addEventListener("click", function () { demoPiano = !demoPiano; var dn = demoPiano ? "Piano demo" : "Guitar demo"; setBuffer(demoPiano ? makeDemoPiano() : makeDemo(), dn); setStatus(dn + " loaded. Tap Demo again to switch."); });
  var revSw = document.getElementById("revSw"), revLed = document.getElementById("revLed"), revSub = document.getElementById("revSub");
  revSw.addEventListener("click", function () {
    P.revOn = !P.revOn;
    revSw.setAttribute("aria-pressed", String(P.revOn)); revLed.classList.toggle("on", P.revOn);
    revSub.textContent = P.revOn ? "on" : "off";
    showDisplay("Reverb", P.revOn ? "On" : "Off"); applyFx();
  });
  var frzSw = document.getElementById("frzSw"), frzLed = document.getElementById("frzLed"), frzSub = document.getElementById("frzSub");
  frzSw.addEventListener("click", function () {
    P.freeze = !P.freeze;
    frzSw.setAttribute("aria-pressed", String(P.freeze)); frzLed.classList.toggle("on", P.freeze);
    frzSub.textContent = P.freeze ? "on" : "off";
    showDisplay("Freeze", P.freeze ? "On" : "Off"); applyFx();
  });
  document.getElementById("rstSw").addEventListener("click", resetReverb);

  var cv = document.getElementById("wave"), g2 = cv.getContext("2d");
  var irCv = document.getElementById("irCv"), g3 = irCv.getContext("2d");
  function css(n, el) { return getComputedStyle(el || document.documentElement).getPropertyValue(n).trim(); }
  var PXS = 3;
  function resize() { var r = cv.getBoundingClientRect(); cv.width = Math.max(8, Math.round(r.width / PXS)); cv.height = Math.max(8, Math.round(r.height / PXS)); }
  window.addEventListener("resize", resize); resize(); if (window.ResizeObserver) new ResizeObserver(function () { resize(); }).observe(cv); setTimeout(resize, 400);

  function drawIR(ir) {
    var W = irCv.width, H = irCv.height, d = ir.getChannelData(0), bins = Math.max(4, Math.floor(W / 2)), step = Math.floor(d.length / bins), pk = [], mx = 0.0001, i, j;
    for (i = 0; i < bins; i++) { var m = 0; for (j = i * step; j < (i + 1) * step; j += 3) { var v = Math.abs(d[j]); if (v > m) m = v; } pk.push(m); if (m > mx) mx = m; }
    g3.clearRect(0, 0, W, H);
    g3.fillStyle = "#fff";
    for (i = 0; i < bins; i++) { var h = Math.max(1, Math.round(Math.pow(pk[i] / mx, 0.6) * (H - 1))); g3.fillRect(i * 2, H - h, 1, h); }
  }
  drawIR(irBuf = buildIR(irState()));

  function draw(ts) {
    requestAnimationFrame(draw);
    if (document.hidden) return;
    var cpd = document.querySelector(".pedal.cur");
    loopTick();
  }
  var loop = { st: "idle", L: null, R: null, len: 0, pos: 0, cl: [], cr: [], total: 0, rev: false, over: false };
  var loopProc = null, loopOut = null, LOOP_MAX = 0;
  function buildLooper(src) {
    LOOP_MAX = Math.floor(ctx.sampleRate * 90);
    loopProc = ctx.createScriptProcessor(1024, 2, 2);
    loopOut = ctx.createGain(); loopOut.gain.value = P.looplevel;
    src.connect(loopProc); loopProc.connect(loopOut); loopOut.connect(ctx.destination); if (recDest) loopOut.connect(recDest);
    loopProc.onaudioprocess = function (e) {
      var inb = e.inputBuffer, outb = e.outputBuffer, iL = inb.getChannelData(0), iR = inb.numberOfChannels > 1 ? inb.getChannelData(1) : iL;
      var oL = outb.getChannelData(0), oR = outb.getChannelData(1), n = iL.length, i, st = loop.st;
      if (st === "rec") {
        loop.cl.push(new Float32Array(iL)); loop.cr.push(new Float32Array(iR)); loop.total += n;
        if (loop.total >= LOOP_MAX) loop.over = true;
        for (i = 0; i < n; i++) { oL[i] = 0; oR[i] = 0; }
        return;
      }
      if ((st === "play" || st === "dub") && loop.len) {
        var L = loop.L, R = loop.R, len = loop.len, pos = loop.pos, rv = loop.rev;
        for (i = 0; i < n; i++) {
          var j = rv ? len - 1 - pos : pos;
          oL[i] = L[j]; oR[i] = R[j];
          if (st === "dub") {
            var a = L[j] * 0.97 + iL[i], b = R[j] * 0.97 + iR[i];
            L[j] = a > 1 ? 1 : a < -1 ? -1 : a; R[j] = b > 1 ? 1 : b < -1 ? -1 : b;
          }
          if (++pos >= len) pos = 0;
        }
        loop.pos = pos;
        return;
      }
      for (i = 0; i < n; i++) { oL[i] = 0; oR[i] = 0; }
    };
  }
  function finishRec() {
    var tot = loop.total;
    if (tot < ctx.sampleRate * 0.25) { loop.cl = []; loop.cr = []; loop.total = 0; return false; }
    var L = new Float32Array(tot), R = new Float32Array(tot), o = 0, k;
    for (k = 0; k < loop.cl.length; k++) { L.set(loop.cl[k], o); R.set(loop.cr[k], o); o += loop.cl[k].length; }
    var f = Math.min(240, tot >> 2);
    for (k = 0; k < f; k++) { var g = k / f; L[k] *= g; R[k] *= g; L[tot - 1 - k] *= g; R[tot - 1 - k] *= g; }
    loop.L = L; loop.R = R; loop.len = tot; loop.pos = 0; loop.cl = []; loop.cr = []; loop.over = false;
    return true;
  }
  var lm = document.getElementById("loopMain"), lLed = document.getElementById("loopLed"), lTxt = document.getElementById("loopTxt"),
      lInfo = document.getElementById("loopInfo"), lBar = document.getElementById("loopBar");
  function loopUI() {
    var st = loop.st;
    lLed.className = "led" + (st === "rec" ? " on red" : st === "play" ? " on green" : st === "dub" ? " on" : "");
    lTxt.textContent = st === "idle" ? "Record" : st === "rec" ? "Play" : st === "play" ? "Overdub" : st === "dub" ? "Play" : "Play";
    if (st === "idle") { lInfo.textContent = "empty"; lBar.style.width = "0"; }
    else if (st === "stopped") lInfo.textContent = "stop · " + (loop.len / ctx.sampleRate).toFixed(1) + " s";
  }
  function loopTick() {
    var st = loop.st;
    if (loop.over && st === "rec") { loopMainClick(); }
    if (st === "rec") { lInfo.textContent = "record " + (loop.total / ctx.sampleRate).toFixed(1) + " s"; lBar.style.width = Math.min(100, loop.total / LOOP_MAX * 100 * 3) + "%"; }
    else if (st === "play" || st === "dub") {
      lBar.style.width = (loop.pos / loop.len * 100).toFixed(1) + "%";
      lInfo.textContent = (st === "dub" ? "overdub · " : "loop · ") + (loop.len / ctx.sampleRate).toFixed(1) + " s";
    }
  }
  function loopMainClick() {
    if (!master) { if (!buf) return; play(); }
    var st = loop.st;
    if (st === "idle") { loop.cl = []; loop.cr = []; loop.total = 0; loop.over = false; loop.st = "rec"; setStatus("Recording loop. Press again to close the circle."); }
    else if (st === "rec") { if (finishRec()) { loop.st = "play"; setStatus("Loop is playing. Press Overdub to layer sound."); } else { loop.st = "idle"; setStatus("Too short. Record at least a quarter of a second."); } }
    else if (st === "play") { loop.st = "dub"; setStatus("Overdub: whatever plays now is layered over the loop."); }
    else if (st === "dub") { loop.st = "play"; }
    else if (st === "stopped") { loop.pos = 0; loop.st = "play"; }
    loopUI();
  }
  lm.addEventListener("click", loopMainClick);
  document.getElementById("loopStop").addEventListener("click", function () {
    if (loop.st === "rec") { if (finishRec()) { loop.st = "stopped"; } else loop.st = "idle"; }
    else if (loop.st === "play" || loop.st === "dub") { loop.st = "stopped"; loop.pos = 0; }
    loopUI();
  });
  document.getElementById("loopClear").addEventListener("click", function () {
    loop.st = "idle"; loop.L = loop.R = null; loop.len = 0; loop.pos = 0; loop.cl = []; loop.cr = []; loop.total = 0;
    loopUI(); setStatus("Loop erased.");
  });
  var lRev = document.getElementById("loopRev");
  lRev.addEventListener("click", function () { loop.rev = !loop.rev; lRev.setAttribute("aria-pressed", String(loop.rev)); });

  var SUBD = [{ n: "1/4", f: 1 }, { n: "1/8", f: 0.5 }, { n: "1/8·", f: 0.75 }, { n: "1/16", f: 0.25 }], subd = 1, taps = [], bpm = 0;
  var sdBtns = [], bpmEl = document.getElementById("bpmVal"), tapLed = document.getElementById("tapLed");
  SUBD.forEach(function (sd, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "key"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", i === subd ? "true" : "false"); b.innerHTML = '<span class="led"></span>' + sd.n;
    b.addEventListener("click", function () { subd = i; sdBtns.forEach(function (x, k) { x.setAttribute("aria-checked", k === i ? "true" : "false"); }); if (bpm) applyTempo(); });
    document.getElementById("subdivs").appendChild(b); sdBtns.push(b);
  });
  function applyTempo() {
    var ms = Math.round(Math.min(900, Math.max(60, 60000 / bpm * SUBD[subd].f)));
    setParam("echo", ms); clearPreset();
    setStatus("Tempo " + bpm + " BPM, division " + SUBD[subd].n + ", echo " + ms + " ms.");
  }
  function tapTempo() {
    var now = performance.now(), k;
    if (taps.length && now - taps[taps.length - 1] > 2000) taps = [];
    taps.push(now); if (taps.length > 6) taps.shift();
    tapLed.classList.add("on"); setTimeout(function () { tapLed.classList.remove("on"); }, 90);
    if (taps.length >= 2) {
      var sum = 0; for (k = 1; k < taps.length; k++) sum += taps[k] - taps[k - 1];
      bpm = Math.round(Math.min(240, Math.max(40, 60000 / (sum / (taps.length - 1)))));
      bpmEl.textContent = bpm; applyTempo();
    } else setStatus("Tap again.");
  }
  document.getElementById("tapBtn").addEventListener("click", tapTempo);
  document.addEventListener("keydown", function (e) {
    if ((e.key === "t" || e.key === "T" || e.key === "е" || e.key === "Е") && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ""))) { tapTempo(); }
  });

  var BOARD_KEY = "grainpedal.board.v1";
  function ms(v) { return Math.round(v) + " ms"; }
  function hz(v) { return v.toFixed(v < 1 ? 2 : 1) + " Hz"; }
  var KT = [
    { id: "t_time", label: "Time", min: 60, max: 900, step: 1, def: 380, pow: 1.6, fmt: ms, hint: "Time between repeats" },
    { id: "t_rep", label: "Repeats", min: 0, max: 0.95, step: 0.01, def: 0.45, fmt: pct, hint: "How much echo returns" },
    { id: "t_tone", label: "Tone", min: 0, max: 1, step: 0.01, def: 0.55, fmt: pct, hint: "Repeat brightness" },
    { id: "t_age", label: "Wear", min: 0, max: 1, step: 0.01, def: 0.35, fmt: pct, hint: "Tape wobble and loss of highs" },
    { id: "t_sat", label: "Tape", min: 0, max: 1, step: 0.01, def: 0.4, fmt: pct, hint: "Tape saturation" },
    { id: "t_mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.35, fmt: pct, hint: "Repeat level" }
  ];
  var KS = [
    { id: "c_rate", label: "Speed", min: 0.05, max: 8, step: 0.01, def: 0.6, pow: 2.2, fmt: hz, hint: "Modulation speed" },
    { id: "c_depth", label: "Depth", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Modulation range" },
    { id: "c_fb", label: "Resonance", min: 0, max: 0.85, step: 0.01, def: 0.35, fmt: pct, hint: "Feedback, audible in the flanger" },
    { id: "c_tone", label: "Tone", min: 0, max: 1, step: 0.01, def: 0.7, fmt: pct, hint: "Brightness of the processed signal" },
    { id: "c_width", label: "Stereo", min: 0, max: 1, step: 0.01, def: 0.8, fmt: pct, hint: "Difference between left and right" },
    { id: "c_mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Balance; inactive in vibrato" }
  ];
  var KD = [
    { id: "d_gain", label: "Drive", min: 0, max: 1, step: 0.01, def: 0.45, fmt: pct, hint: "How much overload" },
    { id: "d_tone", label: "Tone", min: 0, max: 1, step: 0.01, def: 0.55, fmt: pct, hint: "Brightness after overdrive" },
    { id: "d_body", label: "Low cut", min: 0, max: 1, step: 0.01, def: 0.25, fmt: pct, hint: "Removes mud before overdrive" },
    { id: "d_blend", label: "Blend", min: 0, max: 1, step: 0.01, def: 1, fmt: pct, hint: "Clean signal vs overdriven" },
    { id: "d_level", label: "Level", min: 0, max: 1.5, step: 0.01, def: 0.4, fmt: pct, hint: "Level after the pedal" }
  ];
  var KM = [
    { id: "m_rate", label: "Speed", min: 0.05, max: 12, step: 0.01, def: 0.8, pow: 2.2, fmt: hz, hint: "Phaser and tremolo speed" },
    { id: "m_depth", label: "Depth", min: 0, max: 1, step: 0.01, def: 0.7, fmt: pct, hint: "Modulation range" },
    { id: "m_reson", label: "Resonance", min: 0, max: 0.8, step: 0.01, def: 0.3, fmt: pct, hint: "Phaser sharpness" },
    { id: "m_freq", label: "Carrier", min: 40, max: 3000, step: 1, def: 300, pow: 2.2, fmt: function (v) { return Math.round(v) + " Hz"; }, hint: "Ring modulator frequency" },
    { id: "m_mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.6, fmt: pct, hint: "Balance for phaser and ring" }
  ];
  var KW = [
    { id: "w_freq", label: "Freq", min: 60, max: 5000, step: 1, def: 900, pow: 2.2, fmt: function (v) { return Math.round(v) + " Hz"; }, hint: "Wah pedal position, cutoff frequency" },
    { id: "w_res", label: "Resonance", min: 0.5, max: 15, step: 0.1, def: 5, pow: 1.5, fmt: function (v) { return "Q " + v.toFixed(1); }, hint: "Peak sharpness" },
    { id: "w_lfo", label: "Auto-sweep", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Depth of automatic sweep" },
    { id: "w_rate", label: "Speed", min: 0.1, max: 8, step: 0.01, def: 1.2, pow: 2, fmt: hz, hint: "Auto-sweep speed" },
    { id: "w_mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.9, fmt: pct, hint: "Clean vs filtered balance" }
  ];
  var KG = [
    { id: "g_thr", label: "Thresh", min: 0, max: 1, step: 0.01, def: 0.35, fmt: function (v) { return Math.round(-70 + v * 55) + " dB"; }, hint: "Below this level the sound is shut" },
    { id: "g_rel", label: "Fall", min: 0, max: 1, step: 0.01, def: 0.4, fmt: function (v) { return Math.round(30 + v * 770) + " ms"; }, hint: "How fast the gate closes" },
    { id: "g_depth", label: "Depth", min: 0, max: 1, step: 0.01, def: 0.8, fmt: pct, hint: "How much the signal is cut below the threshold" }
  ];
  var KC = [
    { id: "p_sus", label: "Sustain", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "How hard the sound is squeezed" },
    { id: "p_att", label: "Attack", min: 0, max: 1, step: 0.01, def: 0.3, fmt: function (v) { return (2 + v * 78).toFixed(0) + " ms"; }, hint: "How fast the compressor reacts" },
    { id: "p_lvl", label: "Level", min: 0, max: 1, step: 0.01, def: 0.5, fmt: function (v) { return (v * 24 - 6).toFixed(0) + " dB"; }, hint: "Level boost after compression" },
    { id: "p_tone", label: "Tone", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "High-end brightness" },
    { id: "p_blend", label: "Blend", min: 0, max: 1, step: 0.01, def: 1, fmt: pct, hint: "Clean signal vs compressed" }
  ];
  var EQF = [["100", 100], ["200", 200], ["400", 400], ["800", 800], ["1.6k", 1600], ["3.2k", 3200]];
  function gdb(v) { return (v > 0 ? "+" : "") + v.toFixed(1) + " dB"; }
  var KE = EQF.map(function (f, i) { return { id: "e_b" + (i + 1), label: f[0], min: -12, max: 12, step: 0.5, def: 0, fmt: gdb, hint: "Band " + f[1] + " Hz" }; })
    .concat([{ id: "e_lvl", label: "Output", min: -12, max: 12, step: 0.5, def: 0, fmt: gdb, hint: "Overall level after EQ" }]);
  var KCB = [
    { id: "k_mic", label: "Mic", min: 0, max: 1, step: 0.01, def: 0.4, fmt: function (v) { return v < 0.2 ? "center" : v > 0.75 ? "edge" : "cone"; }, hint: "Mic position: center is bright, edge is dark" },
    { id: "k_body", label: "Body", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Low-end thump of the cabinet" },
    { id: "k_room", label: "Room", min: 0, max: 1, step: 0.01, def: 0.2, fmt: pct, hint: "Ambience of a small room" },
    { id: "k_cut", label: "Hi Cut", min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct, hint: "Top-end roll-off of the speaker" },
    { id: "k_lvl", label: "Level", min: 0, max: 1, step: 0.01, def: 0.6, fmt: function (v) { return Math.round(v * 18 - 12) + " dB"; }, hint: "Output level after the cabinet" }
  ];
  function cabP(m, mic, body, cut) {
    var T = [[95, 125, 3, 3000, 1500, 1.5, 5200], [85, 110, 3.5, 2800, 1700, 2, 5000], [75, 95, 4, 2300, 1200, 3, 4400]][m] || [95, 125, 3, 3000, 1500, 1.5, 5200];
    var lp = Math.max(1500, Math.min(9000, T[6] * (1.2 - 0.55 * mic) * (0.6 + 0.9 * cut)));
    return { hp: T[0], rf: T[1], rg: T[2] + body * 6, pf: T[3], pg: (1 - mic) * 6 - 1, kf: T[4], kg: T[5], lp: lp };
  }
  window.__cabP = cabP;
  var VU_HTML = '<div class="vu"><svg viewBox="0 0 300 140" role="img" aria-label="Needle compression meter"><defs><linearGradient id="vuf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f5f6"/><stop offset="1" stop-color="#d9dce0"/></linearGradient></defs><rect width="300" height="140" fill="url(#vuf)"/><polyline points="201.5,38.8 203.4,39.9 205.3,41.1 207.2,42.4 209.1,43.6 210.9,44.9 212.7,46.3 214.5,47.7 216.2,49.1 217.9,50.6 219.6,52.1 221.2,53.6 222.8,55.2 224.4,56.8 225.9,58.4 227.4,60.1 228.9,61.8" fill="none" stroke="#e8321e" stroke-width="5" stroke-linecap="butt"/><polyline points="71.1,61.8 72.6,60.1 74.1,58.4 75.6,56.8 77.2,55.2 78.8,53.6 80.4,52.1 82.1,50.6 83.8,49.1 85.5,47.7 87.3,46.3 89.1,44.9 90.9,43.6 92.8,42.4 94.7,41.1 96.6,39.9 98.5,38.8 100.5,37.7 102.4,36.6 104.4,35.6 106.5,34.7 108.5,33.7 110.6,32.8 112.7,32.0 114.8,31.2 116.9,30.5 119.0,29.8 121.2,29.1 123.3,28.5 125.5,28.0 127.7,27.4 129.9,27.0 132.1,26.6 134.3,26.2 136.6,25.9 138.8,25.6 141.0,25.4 143.3,25.2 145.5,25.1 147.8,25.0 150.0,25.0 152.2,25.0 154.5,25.1 156.7,25.2 159.0,25.4 161.2,25.6 163.4,25.9 165.7,26.2 167.9,26.6 170.1,27.0 172.3,27.4 174.5,28.0 176.7,28.5 178.8,29.1 181.0,29.8 183.1,30.5 185.2,31.2 187.3,32.0 189.4,32.8 191.5,33.7 193.5,34.7 195.6,35.6 197.6,36.6 199.5,37.7 201.5,38.8 203.4,39.9 205.3,41.1 207.2,42.4 209.1,43.6 210.9,44.9 212.7,46.3 214.5,47.7 216.2,49.1 217.9,50.6 219.6,52.1 221.2,53.6 222.8,55.2 224.4,56.8 225.9,58.4 227.4,60.1 228.9,61.8" fill="none" stroke="#15161a" stroke-width="1.2"/><line x1="71.1" y1="61.8" x2="83.4" y2="72.1" stroke="#15161a" stroke-width="1.8"/><text x="93.3" y="84.4" font-size="11" text-anchor="middle" fill="#15161a" style="font-family:var(--font-mono)">0</text><line x1="77.2" y1="55.2" x2="84.2" y2="62.2" stroke="#15161a" stroke-width="1"/><line x1="83.8" y1="49.1" x2="90.2" y2="56.8" stroke="#15161a" stroke-width="1"/><line x1="90.9" y1="43.6" x2="96.7" y2="51.8" stroke="#15161a" stroke-width="1"/><line x1="98.5" y1="38.8" x2="106.5" y2="52.7" stroke="#15161a" stroke-width="1.8"/><text x="113.0" y="67.9" font-size="11" text-anchor="middle" fill="#15161a" style="font-family:var(--font-mono)">4</text><line x1="106.5" y1="34.7" x2="110.7" y2="43.7" stroke="#15161a" stroke-width="1"/><line x1="114.8" y1="31.2" x2="118.2" y2="40.6" stroke="#15161a" stroke-width="1"/><line x1="123.3" y1="28.5" x2="125.9" y2="38.2" stroke="#15161a" stroke-width="1"/><line x1="132.1" y1="26.6" x2="134.9" y2="42.3" stroke="#15161a" stroke-width="1.8"/><text x="137.2" y="59.1" font-size="11" text-anchor="middle" fill="#15161a" style="font-family:var(--font-mono)">8</text><line x1="141.0" y1="25.4" x2="141.9" y2="35.4" stroke="#15161a" stroke-width="1"/><line x1="150.0" y1="25.0" x2="150.0" y2="35.0" stroke="#15161a" stroke-width="1"/><line x1="159.0" y1="25.4" x2="158.1" y2="35.4" stroke="#15161a" stroke-width="1"/><line x1="167.9" y1="26.6" x2="165.1" y2="42.3" stroke="#15161a" stroke-width="1.8"/><text x="162.8" y="59.1" font-size="11" text-anchor="middle" fill="#15161a" style="font-family:var(--font-mono)">12</text><line x1="176.7" y1="28.5" x2="174.1" y2="38.2" stroke="#15161a" stroke-width="1"/><line x1="185.2" y1="31.2" x2="181.8" y2="40.6" stroke="#15161a" stroke-width="1"/><line x1="193.5" y1="34.7" x2="189.3" y2="43.7" stroke="#15161a" stroke-width="1"/><line x1="201.5" y1="38.8" x2="193.5" y2="52.7" stroke="#e8321e" stroke-width="1.8"/><text x="187.0" y="67.9" font-size="11" text-anchor="middle" fill="#e8321e" style="font-family:var(--font-mono)">16</text><line x1="209.1" y1="43.6" x2="203.3" y2="51.8" stroke="#e8321e" stroke-width="1"/><line x1="216.2" y1="49.1" x2="209.8" y2="56.8" stroke="#e8321e" stroke-width="1"/><line x1="222.8" y1="55.2" x2="215.8" y2="62.2" stroke="#e8321e" stroke-width="1"/><line x1="228.9" y1="61.8" x2="216.6" y2="72.1" stroke="#e8321e" stroke-width="1.8"/><text x="206.7" y="84.4" font-size="11" text-anchor="middle" fill="#e8321e" style="font-family:var(--font-mono)">20</text><text x="150" y="112" font-size="8.5" text-anchor="middle" fill="#15161a" fill-opacity=".75" letter-spacing="1.8" style="font-family:var(--font-mono)">GAIN REDUCTION dB</text><rect y="128" width="300" height="12" fill="#15161a"/><line id="vuN" x1="150" y1="128" x2="150" y2="40" stroke="#15161a" stroke-width="2" stroke-linecap="round" style="transform-origin:150px 128px;transform:rotate(-50deg);transition:transform .09s linear"/><circle cx="150" cy="128" r="8" fill="#15161a"/><circle cx="148" cy="125" r="2.6" fill="#fff" fill-opacity=".5"/><path d="M0 0H190L60 140H0Z" fill="#fff" fill-opacity=".14"/></svg></div>';
  var EQ_HTML = '<div class="eqc"><svg viewBox="0 0 300 110" role="img" aria-label="EQ curve"><rect width="300" height="110" fill="#060607"/><line x1="48.2" y1="6" x2="48.2" y2="104" stroke="#ffffff" stroke-opacity=".14"/><text x="48.2" y="104" font-size="8" fill="#ffffff" fill-opacity=".6" text-anchor="middle" style="font-family:var(--font-mono)">100</text><line x1="84.7" y1="6" x2="84.7" y2="104" stroke="#ffffff" stroke-opacity=".14"/><line x1="121.1" y1="6" x2="121.1" y2="104" stroke="#ffffff" stroke-opacity=".14"/><line x1="157.6" y1="6" x2="157.6" y2="104" stroke="#ffffff" stroke-opacity=".14"/><line x1="194.0" y1="6" x2="194.0" y2="104" stroke="#ffffff" stroke-opacity=".14"/><text x="194.0" y="104" font-size="8" fill="#ffffff" fill-opacity=".6" text-anchor="middle" style="font-family:var(--font-mono)">1.6k</text><line x1="230.5" y1="6" x2="230.5" y2="104" stroke="#ffffff" stroke-opacity=".14"/><line x1="266.9" y1="6" x2="266.9" y2="104" stroke="#ffffff" stroke-opacity=".14"/><text x="266.9" y="104" font-size="8" fill="#ffffff" fill-opacity=".6" text-anchor="middle" style="font-family:var(--font-mono)">6.4k</text><line x1="0" y1="93.6" x2="300" y2="93.6" stroke="#ffffff" stroke-opacity=".12" stroke-dasharray="2 4"/><line x1="0" y1="74.3" x2="300" y2="74.3" stroke="#ffffff" stroke-opacity=".12" stroke-dasharray="2 4"/><line x1="0" y1="55.0" x2="300" y2="55.0" stroke="#ffffff" stroke-opacity=".4"/><line x1="0" y1="35.7" x2="300" y2="35.7" stroke="#ffffff" stroke-opacity=".12" stroke-dasharray="2 4"/><line x1="0" y1="16.4" x2="300" y2="16.4" stroke="#ffffff" stroke-opacity=".12" stroke-dasharray="2 4"/><path id="eqPath" d="" fill="none" stroke="var(--arc)" stroke-width="2" stroke-linejoin="round"/><path d="M0 0H170L60 110H0Z" fill="#fff" fill-opacity=".07"/></svg></div>';
  var KB_MODES = [
    { id: "c_mode", min: 0, max: 2, def: 0 }, { id: "d_mode", min: 0, max: 2, def: 0 }, { id: "m_mode", min: 0, max: 2, def: 0 }, { id: "w_mode", min: 0, max: 2, def: 2 }, { id: "k_mode", min: 0, max: 2, def: 1 }
  ];
  var KB_ALL = [].concat(KT, KS, KD, KM, KW, KG, KC, KE, KCB, KB_MODES);
  KB_ALL.forEach(function (c) { P[c.id] = c.def; });

  var DEFS = [
    { id: "tape", name: "Tape", theme: "theme-tape", sub: "Tape echo with wear", knobs: KT, dark: true, main: "t_time", stage: true,
      sizes: { t_time: 92, t_rep: 64, t_tone: 64, t_age: 64, t_sat: 64, t_mix: 64 } },
    { id: "swirl", name: "Swirl", theme: "theme-swirl", sub: "Chorus, flanger, vibrato", knobs: KS, dark: false, hero: ["c_rate", "c_depth"], main: "c_rate",
      sizes: { c_rate: 106, c_depth: 88, c_fb: 56, c_tone: 56, c_width: 56, c_mix: 56 }, mode: { id: "c_mode", cap: "Mode", items: ["Cho", "Fla", "Vib"], full: ["Chorus", "Flanger", "Vibrato"] } },
    { id: "drive", name: "Drive", theme: "theme-graphite", sub: "Overdrive, distortion, fuzz", knobs: KD, dark: true, main: "d_gain", order: ["d_level", "d_gain", "d_tone", "d_body", "d_blend"],
      sizes: { d_gain: 112, d_level: 78, d_tone: 78, d_body: 58, d_blend: 58 }, mode: { id: "d_mode", cap: "Type", items: ["Over", "Dist", "Fuzz"], full: ["Overdrive", "Distortion", "Fuzz"] } },
    { id: "cab", name: "Cab", theme: "theme-cab", sub: "Speaker cabinet", knobs: KCB, dark: true, main: "k_mic", order: ["k_body", "k_mic", "k_room", "k_cut", "k_lvl"],
      sizes: { k_mic: 88, k_body: 62, k_room: 62, k_cut: 58, k_lvl: 58 }, mode: { id: "k_mode", cap: "Cab", items: ["1x12", "2x12", "4x12"], full: ["1x12 combo", "2x12 cabinet", "4x12 stack"] } },
    { id: "morph", name: "Morph", theme: "theme-mint", sub: "Phaser, tremolo, ring", knobs: KM, dark: false, orbit: true, main: "m_rate", order: ["m_depth", "m_reson", "m_rate", "m_freq", "m_mix"],
      sizes: { m_rate: 112, m_depth: 72, m_reson: 72, m_freq: 58, m_mix: 58 }, mode: { id: "m_mode", cap: "Mode", items: ["Phase", "Trem", "Ring"], full: ["Phaser", "Tremolo", "Ring modulator"] } },
    { id: "wah", name: "Wah", theme: "theme-silver", sub: "Filter, wah, auto-sweep", knobs: KW, dark: true, main: "w_freq", order: ["w_res", "w_freq", "w_lfo", "w_rate", "w_mix"],
      sizes: { w_freq: 104, w_res: 68, w_lfo: 68, w_rate: 58, w_mix: 58 }, mode: { id: "w_mode", cap: "Mode", items: ["LPF", "HPF", "Wah"], full: ["Low-pass filter", "High-pass filter", "Wah"] } },
    { id: "comp", name: "Comp", theme: "theme-comp", sub: "Compressor, sustain", knobs: KC, dark: false, main: "p_sus", stage: true, stageHTML: VU_HTML, order: ["p_att", "p_sus", "p_lvl", "p_tone", "p_blend"],
      sizes: { p_sus: 96, p_att: 66, p_lvl: 66, p_tone: 60, p_blend: 60 } },
    { id: "eq", name: "EQ", theme: "theme-eq", sub: "Six bands", knobs: [], faders: KE, dark: true, stage: true, stageHTML: EQ_HTML },
    { id: "gate", name: "Gate", theme: "theme-gate", sub: "Noise gate", knobs: KG, dark: true, main: "g_thr", order: ["g_rel", "g_thr", "g_depth"],
      sizes: { g_thr: 104, g_rel: 68, g_depth: 68 } }
  ];

  var SLOTS = [
    { id: "grain", name: "Source", theme: "theme-cream", sec: "ped-grain", fixed: true },
    { id: "reverb", name: "Tail", theme: "theme-cosmic", sec: "ped-reverb" }
  ].concat(DEFS.map(function (d) { return { id: d.id, name: d.name, theme: d.theme, sec: "ped-" + d.id }; })).concat([{ id: "scope", name: "Scope", theme: "theme-graphite", sec: "ped-scope", fixed: true, util: true }]);
  var SLOT = {}; SLOTS.forEach(function (x) { SLOT[x.id] = x; });
  var B = { order: ["comp", "drive", "cab", "gate", "wah", "morph", "swirl", "eq", "tape", "reverb"], on: { cab: false, tape: false, swirl: false, drive: false, morph: false, wah: false, gate: false, comp: false, eq: false } };
  var boardOnLoad = false;
  try {
    var braw = localStorage.getItem(BOARD_KEY);
    if (braw) {
      var bo = JSON.parse(braw);
      if (bo && Array.isArray(bo.order)) {
        // generic migration: drop unknown/duplicate ids, insert missing ones after their default predecessor
        var def = B.order.slice(), seen = {}, mo = [];
        bo.order.forEach(function (id) { if (def.indexOf(id) >= 0 && !seen[id]) { seen[id] = 1; mo.push(id); } });
        def.forEach(function (id, i) {
          if (seen[id]) return;
          var at = 0;
          for (var j = i - 1; j >= 0; j--) { var k = mo.indexOf(def[j]); if (k >= 0) { at = k + 1; break; } }
          mo.splice(at, 0, id); seen[id] = 1;
        });
        B.order = mo;
      }
      if (bo && bo.on) Object.keys(B.on).forEach(function (id) { if (typeof bo.on[id] === "boolean") B.on[id] = bo.on[id]; });
      if (bo && bo.p) KB_ALL.forEach(function (c) { var v = bo.p[c.id]; if (typeof v === "number" && isFinite(v)) P[c.id] = Math.min(c.max, Math.max(c.min, v)); });
      boardOnLoad = true;
    }
  } catch (e) {}
  var saveT = 0;
  function saveBoard() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      try { var p = {}; KB_ALL.forEach(function (c) { p[c.id] = P[c.id]; }); localStorage.setItem(BOARD_KEY, JSON.stringify({ v: 2, order: B.order, on: B.on, p: p })); } catch (e) {}
    }, 400);
  }
  function isOn(id) { return id === "reverb" ? P.revOn : id === "grain" ? running : !!B.on[id]; }

  var mods = null, rewireT = 0;
  function mkCurve(fn) { var c = new Float32Array(2048); for (var i = 0; i < 2048; i++) c[i] = fn(i / 1023.5 - 1); return c; }
  var CURVES = [
    mkCurve(function (x) { return Math.tanh(x + 0.12) - Math.tanh(0.12); }),
    mkCurve(function (x) { return x * (1.5 - 0.5 * x * x); }),
    mkCurve(function (x) { return (Math.tanh(4 * x + 0.7) - Math.tanh(0.7)) * 0.8; })
  ];
  var TAPE_CURVE = mkCurve(function (x) { return Math.tanh(x); });
  function biq(type, f, q) { var n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; if (q) n.Q.value = q; return n; }
  function shell(spill) {
    var o = { in: ctx.createGain(), out: ctx.createGain(), fi: ctx.createGain(), fo: ctx.createGain(), bd: ctx.createGain() };
    o.in.connect(o.fi); o.in.connect(o.bd); o.bd.connect(o.out); o.fo.connect(o.out);
    o.setOn = function (on, imm) {
      var t = ctx.currentTime, k = imm ? 0.001 : 0.012;
      if (spill) { o.bd.gain.setTargetAtTime(1, t, k); o.fo.gain.setTargetAtTime(1, t, k); o.fi.gain.setTargetAtTime(on ? 1 : 0, t, k); }
      else { o.bd.gain.setTargetAtTime(on ? 0 : 1, t, k); o.fo.gain.setTargetAtTime(on ? 1 : 0, t, k); }
    };
    return o;
  }
  function mkTape() {
    var o = shell(true), dly = ctx.createDelay(1.5), fb = ctx.createGain(), hp = biq("highpass", 80, 0.7), lp = biq("lowpass", 4000, 0.7);
    var pre = ctx.createGain(), sat = ctx.createWaveShaper(), post = ctx.createGain(), wet = ctx.createGain();
    sat.curve = TAPE_CURVE; sat.oversample = "2x";
    o.fi.connect(dly); dly.connect(hp); hp.connect(lp); lp.connect(pre); pre.connect(sat); sat.connect(post); post.connect(wet); wet.connect(o.fo);
    post.connect(fb); fb.connect(dly);
    var wow = ctx.createOscillator(), wowG = ctx.createGain(), fl = ctx.createOscillator(), flG = ctx.createGain();
    wow.frequency.value = 0.7; fl.frequency.value = 6.3; wow.connect(wowG); fl.connect(flG); wowG.connect(dly.delayTime); flG.connect(dly.delayTime); wow.start(); fl.start();
    o.apply = function () {
      var t = ctx.currentTime, a = P.t_age, sv = P.t_sat;
      dly.delayTime.setTargetAtTime(P.t_time / 1000, t, 0.12);
      fb.gain.setTargetAtTime(P.t_rep, t, 0.03);
      lp.frequency.setTargetAtTime((900 + 9000 * P.t_tone * P.t_tone) * (1 - a * 0.55), t, 0.03);
      hp.frequency.setTargetAtTime(70 + a * 160, t, 0.03);
      pre.gain.setTargetAtTime(0.9 + sv * 5, t, 0.03); post.gain.setTargetAtTime(1 / (0.9 + sv * 2.6), t, 0.03);
      wowG.gain.setTargetAtTime(0.0003 + a * 0.0032, t, 0.05); flG.gain.setTargetAtTime(0.00005 + a * 0.0007, t, 0.05);
      wet.gain.setTargetAtTime(P.t_mix * 1.4, t, 0.03);
    };
    return o;
  }
  function mkSwirl() {
    var o = shell(false), dL = ctx.createDelay(0.05), dR = ctx.createDelay(0.05), fL = ctx.createGain(), fR = ctx.createGain();
    var lfo = ctx.createOscillator(), gL = ctx.createGain(), gR = ctx.createGain(), mg = ctx.createChannelMerger(2);
    var lp = biq("lowpass", 8000, 0.7), wet = ctx.createGain(), dry = ctx.createGain();
    o.fi.connect(dL); o.fi.connect(dR); o.fi.connect(dry); dry.connect(o.fo);
    dL.connect(fL); fL.connect(dL); dR.connect(fR); fR.connect(dR);
    dL.connect(mg, 0, 0); dR.connect(mg, 0, 1); mg.connect(lp); lp.connect(wet); wet.connect(o.fo);
    lfo.connect(gL); lfo.connect(gR); gL.connect(dL.delayTime); gR.connect(dR.delayTime); lfo.start();
    o.apply = function () {
      var t = ctx.currentTime, m = P.c_mode, base = [0.018, 0.0045, 0.007][m], dep = [0.0055, 0.0032, 0.0035][m] * P.c_depth;
      dL.delayTime.setTargetAtTime(base, t, 0.03); dR.delayTime.setTargetAtTime(base + (m === 0 ? 0.0013 : 0), t, 0.03);
      lfo.frequency.setTargetAtTime(P.c_rate, t, 0.05);
      gL.gain.setTargetAtTime(dep, t, 0.05); gR.gain.setTargetAtTime(dep * (1 - 2 * P.c_width), t, 0.05);
      var fb = m === 1 ? P.c_fb * 0.92 : m === 0 ? P.c_fb * 0.15 : 0;
      fL.gain.setTargetAtTime(fb, t, 0.03); fR.gain.setTargetAtTime(fb, t, 0.03);
      lp.frequency.setTargetAtTime(1800 + 12000 * P.c_tone * P.c_tone, t, 0.03);
      dry.gain.setTargetAtTime(m === 2 ? 0 : 1 - P.c_mix * 0.5, t, 0.03);
      wet.gain.setTargetAtTime(m === 2 ? 1 : P.c_mix * (m === 1 ? 1 : 0.9), t, 0.03);
    };
    return o;
  }
  function mkDrive() {
    var o = shell(false), hp = biq("highpass", 80, 0.7), pre = ctx.createGain(), ws = ctx.createWaveShaper(), dc = biq("highpass", 22, 0.7);
    var lp = biq("lowpass", 4000, 0.7), wet = ctx.createGain(), dry = ctx.createGain(), lev = ctx.createGain();
    ws.oversample = "4x"; ws.curve = CURVES[0];
    o.fi.connect(hp); hp.connect(pre); pre.connect(ws); ws.connect(dc); dc.connect(lp); lp.connect(wet); wet.connect(lev); hp.connect(dry); dry.connect(lev); lev.connect(o.fo);
    var lastMode = -1;
    o.apply = function () {
      var t = ctx.currentTime, m = P.d_mode;
      if (m !== lastMode) { ws.curve = CURVES[m]; lastMode = m; }
      hp.frequency.setTargetAtTime(25 * Math.pow(16, P.d_body), t, 0.03);
      pre.gain.setTargetAtTime(1 + P.d_gain * P.d_gain * [45, 90, 70][m], t, 0.03);
      lp.frequency.setTargetAtTime(700 * Math.pow(14, P.d_tone), t, 0.03);
      wet.gain.setTargetAtTime(P.d_blend * [0.95, 0.55, 0.6][m], t, 0.03);
      dry.gain.setTargetAtTime((1 - P.d_blend) * 0.9, t, 0.03);
      lev.gain.setTargetAtTime(P.d_level, t, 0.03);
    };
    return o;
  }
  function mkMorph() {
    var o = shell(false), dry = ctx.createGain(), lfo = ctx.createOscillator(), car = ctx.createOscillator();
    var mix = ctx.createGain();
    lfo.start(); car.start();
    var F = [1, 1.7, 2.9, 4.6], aps = [], lgs = [], prev = o.fi, phW = ctx.createGain(), fbD = ctx.createDelay(0.02), fbG = ctx.createGain();
    for (var i = 0; i < 4; i++) {
      var ap = biq("allpass", 600 * F[i], 0.6), lg = ctx.createGain();
      lfo.connect(lg); lg.connect(ap.frequency); prev.connect(ap); prev = ap; aps.push(ap); lgs.push(lg);
    }
    prev.connect(phW); prev.connect(fbD); fbD.connect(fbG); fbG.connect(aps[0]); fbD.delayTime.value = 0.003;
    var tr = ctx.createGain(), trL = ctx.createGain(), trW = ctx.createGain();
    o.fi.connect(tr); lfo.connect(trL); trL.connect(tr.gain); tr.connect(trW);
    var rg = ctx.createGain(), rW = ctx.createGain(); rg.gain.value = 0;
    o.fi.connect(rg); car.connect(rg.gain); rg.connect(rW);
    o.fi.connect(dry);
    [dry, phW, trW, rW].forEach(function (n) { n.connect(o.fo); });
    o.apply = function () {
      var t = ctx.currentTime, m = P.m_mode, d = P.m_depth;
      lfo.frequency.setTargetAtTime(P.m_rate, t, 0.05); car.frequency.setTargetAtTime(P.m_freq, t, 0.03);
      for (var i = 0; i < 4; i++) lgs[i].gain.setTargetAtTime(m === 0 ? d * 480 * F[i] : 0, t, 0.05);
      fbG.gain.setTargetAtTime(m === 0 ? P.m_reson * 0.9 : 0, t, 0.03);
      trL.gain.setTargetAtTime(m === 1 ? d * 0.5 : 0, t, 0.03); tr.gain.setTargetAtTime(m === 1 ? 1 - d * 0.5 : 0, t, 0.03);
      dry.gain.setTargetAtTime(m === 0 ? 1 : m === 2 ? 1 - P.m_mix : 0, t, 0.03);
      phW.gain.setTargetAtTime(m === 0 ? 0.4 + P.m_mix * 0.6 : 0, t, 0.03);
      trW.gain.setTargetAtTime(m === 1 ? 1 : 0, t, 0.03);
      rW.gain.setTargetAtTime(m === 2 ? P.m_mix * 1.1 : 0, t, 0.03);
    };
    return o;
  }
  function mkWah() {
    var o = shell(false), f = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain(), wet = ctx.createGain(), dry = ctx.createGain();
    o.fi.connect(f); f.connect(wet); wet.connect(o.fo); o.fi.connect(dry); dry.connect(o.fo);
    lfo.connect(lg); lg.connect(f.detune); lfo.start();
    o.apply = function () {
      var t = ctx.currentTime, m = P.w_mode;
      f.type = ["lowpass", "highpass", "bandpass"][m];
      f.frequency.setTargetAtTime(P.w_freq, t, 0.03); f.Q.setTargetAtTime(P.w_res, t, 0.03);
      lfo.frequency.setTargetAtTime(P.w_rate, t, 0.05); lg.gain.setTargetAtTime(P.w_lfo * 2400, t, 0.05);
      wet.gain.setTargetAtTime(P.w_mix * (m === 2 ? 2.5 : 1), t, 0.03); dry.gain.setTargetAtTime(1 - P.w_mix, t, 0.03);
    };
    return o;
  }
  function mkGate() {
    var o = shell(false), an = ctx.createAnalyser(), g = ctx.createGain(), d = new Float32Array(512), open = true, hold = 0;
    an.fftSize = 512; o.fi.connect(an); o.fi.connect(g); g.connect(o.fo);
    o.apply = function () {};
    setInterval(function () {
      if (!B.on.gate || !mods) { o.open = null; return; }
      an.getFloatTimeDomainData(d);
      var sum = 0, i, now = ctx.currentTime;
      for (i = 0; i < 512; i++) sum += d[i] * d[i];
      var db = 20 * Math.log10(Math.sqrt(sum / 512) + 1e-9), th = -70 + P.g_thr * 55;
      if (db > th) { open = true; hold = now + 0.06 + P.g_rel * 0.2; } else if (now > hold) open = false;
      g.gain.setTargetAtTime(open ? 1 : Math.pow(10, -3 * P.g_depth), now, open ? 0.005 : 0.02 + P.g_rel * 0.25); o.open = open;
    }, 20);
    return o;
  }
  var MODIDS = ["cab", "tape", "swirl", "drive", "morph", "wah", "gate", "comp", "eq"];
  function mkComp() {
    var o = shell(false), c = ctx.createDynamicsCompressor(), mk = ctx.createGain(), sh = ctx.createBiquadFilter(), wet = ctx.createGain(), dry = ctx.createGain();
    sh.type = "highshelf"; sh.frequency.value = 3000; c.knee.value = 8;
    o.fi.connect(c); c.connect(sh); sh.connect(mk); mk.connect(wet); wet.connect(o.fo); o.fi.connect(dry); dry.connect(o.fo);
    o.comp = c;
    o.apply = function () {
      var t = ctx.currentTime, s2 = P.p_sus;
      c.threshold.setTargetAtTime(-8 - s2 * 38, t, 0.03); c.ratio.setTargetAtTime(2 + s2 * 16, t, 0.03);
      c.attack.setTargetAtTime((2 + P.p_att * 78) / 1000, t, 0.03); c.release.setTargetAtTime(0.18, t, 0.03);
      sh.gain.setTargetAtTime((P.p_tone - 0.5) * 18, t, 0.03);
      mk.gain.setTargetAtTime(Math.pow(10, ((P.p_lvl * 24 - 15) + s2 * 6) / 20), t, 0.03);
      wet.gain.setTargetAtTime(P.p_blend, t, 0.03); dry.gain.setTargetAtTime((1 - P.p_blend) * 0.9, t, 0.03);
    };
    return o;
  }
  function mkEQ() {
    var o = shell(false), prev = o.fi, fl = [], lv = ctx.createGain();
    EQF.forEach(function (f) { var b = ctx.createBiquadFilter(); b.type = "peaking"; b.frequency.value = f[1]; b.Q.value = 1.1; prev.connect(b); prev = b; fl.push(b); });
    prev.connect(lv); lv.connect(o.fo);
    o.apply = function () {
      var t = ctx.currentTime;
      fl.forEach(function (b, i) { b.gain.setTargetAtTime(P["e_b" + (i + 1)], t, 0.03); });
      lv.gain.setTargetAtTime(Math.pow(10, P.e_lvl / 20), t, 0.03);
    };
    return o;
  }
  function mkCab() {
    var o = shell(false), hp = biq("highpass", 90, 0.7), rs = biq("peaking", 120, 1.2), pr = biq("peaking", 3000, 1.0), kn = biq("peaking", 1500, 0.9);
    var l1 = biq("lowpass", 5000, 0.54), l2 = biq("lowpass", 5000, 1.31), lv = ctx.createGain(), cv = ctx.createConvolver(), rg = ctx.createGain();
    var n = Math.floor(ctx.sampleRate * 0.28), ir = ctx.createBuffer(2, n, ctx.sampleRate), c, i, d, z;
    for (c = 0; c < 2; c++) { d = ir.getChannelData(c); z = 0; for (i = 0; i < n; i++) { z += ((Math.random() * 2 - 1) - z) * 0.35; d[i] = z * Math.exp(-i / ctx.sampleRate * 16) * (i < 40 ? i / 40 : 1); } }
    cv.buffer = ir; cv.normalize = true;
    o.fi.connect(hp); hp.connect(rs); rs.connect(pr); pr.connect(kn); kn.connect(l1); l1.connect(l2); l2.connect(lv); lv.connect(o.fo);
    l2.connect(cv); cv.connect(rg); rg.connect(o.fo);
    o.apply = function () {
      var t = ctx.currentTime, p = cabP(P.k_mode, P.k_mic, P.k_body, P.k_cut);
      hp.frequency.setTargetAtTime(p.hp, t, 0.03); rs.frequency.setTargetAtTime(p.rf, t, 0.03); rs.gain.setTargetAtTime(p.rg, t, 0.03);
      pr.frequency.setTargetAtTime(p.pf, t, 0.03); pr.gain.setTargetAtTime(p.pg, t, 0.03); kn.frequency.setTargetAtTime(p.kf, t, 0.03); kn.gain.setTargetAtTime(p.kg, t, 0.03);
      l1.frequency.setTargetAtTime(p.lp, t, 0.03); l2.frequency.setTargetAtTime(p.lp, t, 0.03);
      lv.gain.setTargetAtTime(Math.pow(10, (P.k_lvl * 18 - 12 + 4) / 20), t, 0.03);
      rg.gain.setTargetAtTime(P.k_room * 1.4, t, 0.03);
    };
    return o;
  }
  function buildBoard() {
    mods = { cab: mkCab(), tape: mkTape(), swirl: mkSwirl(), drive: mkDrive(), morph: mkMorph(), wah: mkWah(), gate: mkGate(), comp: mkComp(), eq: mkEQ() };
    mods.reverb = { in: rbIn, out: rbOut };
    MODIDS.forEach(function (id) { mods[id].setOn(B.on[id], true); });
    scopeAn = ctx.createAnalyser(); scopeAn.fftSize = 4096; scopeAn.smoothingTimeConstant = 0.6; chainOut.connect(scopeAn);
    Object.keys(mods).forEach(function (id) { if (id === "reverb") return; var ai = ctx.createAnalyser(), ao = ctx.createAnalyser(); ai.fftSize = 512; ao.fftSize = 512; mods[id].in.connect(ai); meters[id] = { i: ai, o: ao }; });
    doWire();
    chainOut.gain.value = 1;
    applyMods(true);
  }
  var meters = {}, scopeAn = null;
  function applyMods() {
    if (!mods) return;
    MODIDS.forEach(function (id) { mods[id].apply(); });
  }
  function doWire() {
    master.disconnect();
    B.order.forEach(function (id) { mods[id].out.disconnect(); });
    var prev = master;
    B.order.forEach(function (id) { prev.connect(mods[id].in); prev = mods[id].out; });
    prev.connect(chainOut);
    Object.keys(meters).forEach(function (id) { mods[id].out.connect(meters[id].o); });
  }
  function rewire() {
    if (!mods) return;
    var t = ctx.currentTime;
    chainOut.gain.cancelScheduledValues(t); chainOut.gain.setTargetAtTime(0, t, 0.008);
    clearTimeout(rewireT);
    rewireT = setTimeout(function () { doWire(); chainOut.gain.setTargetAtTime(1, ctx.currentTime, 0.025); }, 50);
  }

  var wrapEl = document.querySelector(".wrap"), uiSw = {};
  function stateText(id) { return id === "scope" ? "utility" : id === "grain" ? (running ? "playing" : "stop") : isOn(id) ? "in chain" : "bypass"; }
  DEFS.forEach(function (d) {
    var sec = document.createElement("section");
    sec.className = "pedal bp " + d.theme; sec.id = "ped-" + d.id; sec.setAttribute("aria-label", d.name + ": " + d.sub);
    sec.innerHTML =
      '<div class="jacks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
      '<div class="bp-head"><h2 class="bp-title">' + d.name + '</h2><p class="bp-sub">' + d.sub + '</p></div>' +
      '<div class="plate" aria-hidden="true"></div><div class="bp-grid lay-' + d.id + '">' +
      (d.hero ? '<div class="hero"></div>' : '') + (d.stage ? '<div class="stage"></div>' : '') +
      (d.mode ? '<fieldset class="grp modes"><legend>' + d.mode.cap + '</legend><div class="tgl" data-m="0" role="radiogroup" aria-label="' + d.mode.cap + ' ' + d.name + '"><button class="tgl-sw" type="button" aria-label="' + d.mode.cap + ' ' + d.name + ': toggle"><i class="lev"></i></button><div class="tgl-labels"></div></div></fieldset>' : '') +
      '<div class="knobs' + (d.orbit ? ' orbit' : '') + '"></div></div>' +
      '<div class="fsrow"><div class="fswrap"><div><span class="name">Bypass</span><span class="sub"></span></div>' +
      '<div class="hexw"><div class="hex"><button class="fs" type="button" aria-pressed="false" aria-label="Turn on or off ' + d.name + '"></button></div></div>' +
      '<span class="led"></span></div></div>';
    wrapEl.appendChild(sec);
    sec.classList.add("bp-" + d.id); ["a","b","c"].forEach(function (k) { var j = document.createElement("i"); j.className = "jk " + k; sec.appendChild(j); });
    if (d.stageHTML) sec.querySelector(".stage").innerHTML = d.stageHTML;
    var kh = sec.querySelector(".knobs"), hh = sec.querySelector(".hero"), byId = {};
    d.knobs.forEach(function (c) { byId[c.id] = c; });
    (d.order || d.knobs.map(function (c) { return c.id; })).forEach(function (id) {
      var inHero = !!d.hero && d.hero.indexOf(id) >= 0, host = inHero ? hh : kh;
      makeKnob(byId[id], host, { dark: d.dark, main: d.main === id, onUser: function () { saveBoard(); } });
      var px = d.sizes && d.sizes[id];
      if (px) host.lastElementChild.querySelector(".knob").style.setProperty("--ks", "min(" + px + "px, " + (px / 3.9).toFixed(1) + "vw)");
    });
    if (d.faders) { kh.classList.add("faders"); d.faders.forEach(function (c) { makeFader(c, kh); }); }
    uiSw[d.id] = { fs: sec.querySelector(".fs"), led: sec.querySelector(".fswrap .led"), sub: sec.querySelector(".fswrap .sub") };
    uiSw[d.id].fs.addEventListener("click", function () { setOn(d.id, !isOn(d.id)); });
    if (d.mode) {
      var row = sec.querySelector(".tgl-labels"); d.modeBtns = []; d.tgl = sec.querySelector(".tgl");
      var setM = function (i) { P[d.mode.id] = (i + 3) % 3; applyMods(); paintModes(); saveBoard(); };
      d.mode.items.forEach(function (label, i) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("role", "radio"); b.textContent = label; b.title = d.mode.full[i];
        b.addEventListener("click", function () { setM(i); });
        row.appendChild(b); d.modeBtns.push(b);
      });
      var sw = sec.querySelector(".tgl-sw");
      sw.addEventListener("click", function () { setM(P[d.mode.id] + 1); });
      sw.addEventListener("keydown", function (e) { if (e.key === "ArrowUp") { e.preventDefault(); setM(P[d.mode.id] - 1); } else if (e.key === "ArrowDown") { e.preventDefault(); setM(P[d.mode.id] + 1); } });
    }
  });
  function paintModes() {
    DEFS.forEach(function (d) { if (d.modeBtns) { d.tgl.dataset.m = P[d.mode.id]; d.modeBtns.forEach(function (b, i) { b.setAttribute("aria-checked", String(P[d.mode.id] === i)); }); } });
  }
  var origApplyMods = applyMods;
  applyMods = function (imm) { origApplyMods(imm); paintModes(); paintInd(); saveBoard(); };

  var rail = document.getElementById("rail"), chainNote = document.getElementById("chainNote"), slotEls = {};
  function mkSlot(x) {
    var el = document.createElement("div");
    el.className = "cslot " + x.theme + (x.fixed ? " fixed" : ""); el.setAttribute("role", "listitem"); el.dataset.id = x.id;
    el.innerHTML = '<' + (x.fixed ? 'div' : 'button type="button"') + ' class="cgrip"' + (x.fixed ? '' : ' aria-label="' + x.name + ': drag or move with the left and right arrows"') + '><span class="cnum"></span></' + (x.fixed ? 'div' : 'button') + '>' +
      '<span class="cname">' + x.name + '</span><button class="cfs" type="button" aria-pressed="false" aria-label="' + (x.id === "grain" ? "Play or stop" : "Bypass " + x.name) + '"></button><span class="led"></span><span class="csub"></span>';
    rail.appendChild(el); slotEls[x.id] = el;
    el.querySelector(".cfs").addEventListener("click", function () { if (x.util) return; x.id === "grain" ? document.getElementById("play").click() : setOn(x.id, !isOn(x.id)); });
    return el;
  }
  SLOTS.forEach(mkSlot);
  var endCap = document.createElement("div"); endCap.className = "cend"; endCap.textContent = "Output"; rail.appendChild(endCap); rail.appendChild(slotEls.scope);
  function placeSlots() { B.order.forEach(function (id) { rail.insertBefore(slotEls[id], endCap); }); }
  function commitOrder(announce) {
    B.order = [].slice.call(rail.querySelectorAll(".cslot:not(.fixed)")).map(function (e) { return e.dataset.id; });
    document.getElementById("ped-grain").style.order = 0;
    B.order.forEach(function (id, i) { document.getElementById("ped-" + id).style.order = i + 1; slotEls[id].querySelector(".cnum").textContent = i + 2; });
    slotEls.grain.querySelector(".cnum").textContent = 1;
    rewire(); saveBoard();
    if (announce) chainNote.textContent = "Order: " + ["Source"].concat(B.order.map(function (id) { return SLOT[id].name; })).join(" → ") + " → output.";
  }
  function boardSync() {
    SLOTS.forEach(function (x) {
      var on = isOn(x.id), el = slotEls[x.id];
      el.querySelector(".cfs").setAttribute("aria-pressed", String(on)); el.querySelector(".led").classList.toggle("on", on);
      el.querySelector(".csub").textContent = stateText(x.id);
    });
    DEFS.forEach(function (d) {
      var on = isOn(d.id), u = uiSw[d.id];
      u.fs.setAttribute("aria-pressed", String(on)); u.led.classList.toggle("on", on); u.sub.textContent = stateText(d.id);
    });
    if (typeof paintInd === "function") paintInd();
  }
  function setOn(id, on) {
    if (id === "reverb") { if (P.revOn !== on) document.getElementById("revSw").click(); return; }
    B.on[id] = on; if (mods) mods[id].setOn(on);
    boardSync(); saveBoard();
    chainNote.textContent = SLOT[id].name + (on ? ": in chain." : ": bypassed, the signal goes around.");
  }
  document.getElementById("revSw").addEventListener("click", boardSync);
  new MutationObserver(boardSync).observe(document.getElementById("playLed"), { attributes: true, attributeFilter: ["class"] });
  (function () {
    var drag = null;
    rail.addEventListener("pointerdown", function (e) {
      var g = e.target.closest(".cgrip"); if (!g || g.tagName !== "BUTTON") return;
      drag = g.closest(".cslot"); drag.classList.add("dragging"); g.setPointerCapture(e.pointerId); e.preventDefault();
    });
    rail.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var list = document.elementsFromPoint(e.clientX, e.clientY), t = null;
      for (var i = 0; i < list.length; i++) { var c = list[i].closest && list[i].closest(".cslot"); if (c && c !== drag && !c.classList.contains("fixed")) { t = c; break; } }
      if (!t) return;
      var r = t.getBoundingClientRect(), after = !!(drag.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING);
      var mid = r.left + r.width / 2, sameRow = Math.abs(e.clientY - (r.top + r.height / 2)) < r.height;
      if (!sameRow) { rail.insertBefore(drag, after ? t : t.nextSibling); commitOrder(false); return; }
      if (after && e.clientX < mid) { rail.insertBefore(drag, t); commitOrder(false); }
      else if (!after && e.clientX > mid) { rail.insertBefore(drag, t.nextSibling); commitOrder(false); }
    });
    function end() { if (!drag) return; drag.classList.remove("dragging"); drag = null; commitOrder(true); }
    rail.addEventListener("pointerup", end); rail.addEventListener("pointercancel", end);
    rail.addEventListener("keydown", function (e) {
      var g = e.target.closest(".cgrip"); if (!g || g.tagName !== "BUTTON") return;
      var el = g.closest(".cslot"), k = e.key;
      if (k === "ArrowLeft" || k === "ArrowRight") {
        e.preventDefault();
        var i = B.order.indexOf(el.dataset.id), j = i + (k === "ArrowLeft" ? -1 : 1);
        if (j < 0 || j >= B.order.length) return;
        var other = slotEls[B.order[j]]; rail.insertBefore(el, k === "ArrowLeft" ? other : other.nextSibling);
        commitOrder(true); g.focus();
      }
    });
  })();

  function f1(v) { return v.toFixed(1); }
  function pol(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function rnd(seed) { var q = seed; return function () { q = (q * 16807) % 2147483647; return (q - 1) / 2147483646; }; }
  function rel(sec, el) { var a = sec.getBoundingClientRect(), b = el.getBoundingClientRect(), S = window.__fitS || 1; return { x: (b.left - a.left) / S, y: (b.top - a.top) / S, w: b.width / S, h: b.height / S, cx: (b.left - a.left + b.width / 2) / S, cy: (b.top - a.top + b.height / 2) / S }; }
  function line(x1, y1, x2, y2, w, op, ex) { return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="currentColor" stroke-width="' + w + '" stroke-opacity="' + op + '" stroke-linecap="round"' + (ex || "") + '/>'; }
  function circ(x, y, r, w, op, fill, fop, ex) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="' + (fill || "none") + '" fill-opacity="' + (fop == null ? 1 : fop) + '" stroke="currentColor" stroke-width="' + w + '" stroke-opacity="' + op + '"' + (ex || "") + '/>'; }
  function dot(x, y, r, fill, op) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="' + (fill || "currentColor") + '" fill-opacity="' + (op == null ? 1 : op) + '"/>'; }
  function screw(x, y, r, rot) { var a = rot * Math.PI / 180, p = pol(x, y, r * 0.7, a), q = pol(x, y, r * 0.7, a + Math.PI); return circ(x, y, r, 1.4, 0.7, "currentColor", 0.18) + line(p[0], p[1], q[0], q[1], 1.6, 0.7); }
  function txt(x, y, t, size, op, anchor, ex) { return '<text x="' + f1(x) + '" y="' + f1(y) + '" font-size="' + size + '" fill="currentColor" fill-opacity="' + op + '" text-anchor="' + (anchor || "start") + '" style="font-family:var(--font-mono)"' + (ex || "") + '>' + t + '</text>'; }
  function poly(pts, fill, fop, stroke, sop, sw) { return '<path d="M' + pts.map(function (p) { return f1(p[0]) + " " + f1(p[1]); }).join("L") + 'Z" fill="' + fill + '" fill-opacity="' + fop + '" stroke="' + (stroke || "none") + '" stroke-opacity="' + (sop || 0) + '" stroke-width="' + (sw || 0) + '" stroke-linejoin="round"/>'; }

  var IND = {
    gate: [{ t: "lad", k: "in", l: "IN", thr: 1 }, { t: "led", k: "open", l: "OPEN", c: "green" }, { t: "led", k: "shut", l: "SHUT", c: "red" }, { t: "lad", k: "out", l: "OUT" }],
    drive: [{ t: "lad", k: "in", l: "IN" }, { t: "led", k: "clip", l: "CLIP", c: "red" }, { t: "lad", k: "out", l: "OUT" }],
    tape: [{ t: "pulse", l: "TEMPO" }, { t: "lad", k: "out", l: "OUT" }],
    swirl: [{ t: "pulse", l: "RATE" }, { t: "lad", k: "out", l: "OUT" }],
    morph: [{ t: "pulse", l: "RATE" }, { t: "lad", k: "out", l: "OUT" }],
    wah: [{ t: "pulse", l: "SWEEP" }, { t: "lad", k: "out", l: "OUT" }],
    comp: [{ t: "lad", k: "gr", l: "GR" }, { t: "lad", k: "out", l: "OUT" }],
    eq: [{ t: "lad", k: "out", l: "OUT" }],
    cab: [{ t: "lad", k: "in", l: "IN" }, { t: "lad", k: "out", l: "OUT" }]
  };
  DEFS.forEach(function (d) {
    var sec = document.getElementById("ped-" + d.id), ind = document.createElement("div"), h = "";
    ind.className = "ind"; ind.setAttribute("aria-hidden", "true");
    IND[d.id].forEach(function (x) {
      if (x.t === "lad") h += '<span class="im"><span class="lad" data-k="' + x.k + '"' + (x.thr ? ' data-thr="1"' : "") + '><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><b>' + x.l + "</b></span>";
      else if (x.t === "led") h += '<span class="im"><i class="led ' + x.c + '" data-k="' + x.k + '"></i><b>' + x.l + "</b></span>";
      else h += '<span class="im"><i class="led pl" data-k="pulse"></i><b>' + x.l + "</b></span>";
    });
    ind.innerHTML = h; sec.insertBefore(ind, sec.querySelector(".plate"));
  });
  function paintInd() {
    DEFS.forEach(function (d) {
      var sec = document.getElementById("ped-" + d.id), on = isOn(d.id), pl = sec.querySelector(".pl"), per = 0;
      if (d.id === "tape") per = P.t_time / 1000; else if (d.id === "swirl") per = 1 / P.c_rate; else if (d.id === "morph") per = P.m_mode === 2 ? 0 : 1 / P.m_rate; else if (d.id === "wah") per = P.w_lfo > 0.02 ? 1 / P.w_rate : 0;
      if (pl) { pl.classList.toggle("on", on); pl.classList.toggle("blink", on && per > 0); pl.style.setProperty("--per", Math.max(0.12, per).toFixed(3) + "s"); }
      if (d.id === "gate") {
        var lad = sec.querySelector('.lad[data-thr]'), at = Math.round((-70 + P.g_thr * 55 + 54) / 6.5);
        [].forEach.call(lad.children, function (c, i) { c.classList.toggle("thr", i === Math.max(0, Math.min(7, at))); });
      }
    });
  }
  var bufI = new Float32Array(512), held = {}, clipUntil = 0;
  function levelOf(an) { an.getFloatTimeDomainData(bufI); var sum = 0, pk = 0, i, v; for (i = 0; i < 512; i++) { v = bufI[i]; sum += v * v; if (Math.abs(v) > pk) pk = Math.abs(v); } return [20 * Math.log10(Math.sqrt(sum / 512) + 1e-9), pk]; }
  var tk = 0;
  function tickInd() {
    requestAnimationFrame(tickInd);
    if ((tk++ & 1) || !mods || document.hidden) return;
    [].forEach.call(document.querySelectorAll(".pedal.cur, .pedal.vis"), tickOne);
  }
  function tickOne(sec) {
    if (!sec || sec.id.indexOf("ped-") !== 0) return;
    var id = sec.id.slice(4), m = meters[id];
    if (!m || !IND[id]) return;
    var on = isOn(id), now = performance.now();
    [].forEach.call(sec.querySelectorAll(".lad"), function (lad) {
      if (lad.dataset.k === "gr") {
        var gr = on ? -(mods.comp.comp.reduction || 0) : 0, nd = document.getElementById("vuN");
        [].forEach.call(lad.children, function (c, i) { c.classList.toggle("on", gr > i * 1.8); });
        if (nd) nd.style.transform = "rotate(" + (-50 + Math.min(gr, 20) * 5).toFixed(1) + "deg)";
        return;
      }
      var k = lad.dataset.k, lv = levelOf(k === "in" ? m.i : m.o), key = id + k, prev = held[key] == null ? -90 : held[key], v = Math.max(lv[0], prev - 1.4);
      held[key] = v;
      if (k === "out" && id === "drive" && lv[1] > 0.92) clipUntil = now + 220;
      [].forEach.call(lad.children, function (c, i) { c.classList.toggle("on", v > -54 + i * 6.5); });
    });
    var g = mods.gate.open, q;
    if (id === "gate") { q = sec.querySelector('[data-k="open"]'); q.classList.toggle("on", on && g === true); q = sec.querySelector('[data-k="shut"]'); q.classList.toggle("on", on && g === false); }
    if (id === "drive") sec.querySelector('[data-k="clip"]').classList.toggle("on", on && now < clipUntil);
  }
  DEFS.concat([{ id: "grain" }, { id: "reverb" }]).forEach(function (d) {
    var sec = document.getElementById("ped-" + d.id); if (!sec) return;
    var sh = document.createElement("i"); sh.className = "sheen"; sh.setAttribute("aria-hidden", "true"); sec.appendChild(sh);
  });
  paintInd(); requestAnimationFrame(tickInd);

  function makeFader(c, host) {
    var w = document.createElement("div"); w.className = "fd";
    w.innerHTML = '<i class="fled"></i><div class="ftrack"><i class="fcap" role="slider" tabindex="0"></i></div><span class="name"></span><span class="sub"></span>';
    host.appendChild(w);
    var tr = w.querySelector(".ftrack"), cap = w.querySelector(".fcap"), nm = w.querySelector(".name"), sub = w.querySelector(".sub");
    function paint(v) { var n = toN(c, v); tr.style.setProperty("--n", n.toFixed(3)); cap.setAttribute("aria-valuenow", v); cap.setAttribute("aria-valuetext", c.fmt(v)); sub.textContent = c.fmt(v); w.querySelector(".fled").style.setProperty("--b", Math.min(1, Math.abs(v) / 6).toFixed(2)); if (typeof paintEq === "function") paintEq(); }
    function user(n) { setParam(c.id, fromN(c, n)); saveBoard(); clearPreset(); }
    function at(e) { var r = tr.getBoundingClientRect(); var S = window.__fitS || 1; user(1 - (e.clientY - r.top - 11 * S) / (r.height - 22 * S)); }
    var drag = false;
    tr.addEventListener("pointerdown", function (e) { drag = true; tr.setPointerCapture(e.pointerId); cap.focus({ preventScroll: true }); at(e); e.preventDefault(); });
    tr.addEventListener("pointermove", function (e) { if (drag) at(e); });
    tr.addEventListener("pointerup", function () { drag = false; }); tr.addEventListener("pointercancel", function () { drag = false; });
    tr.addEventListener("dblclick", function () { user(toN(c, c.def)); });
    cap.addEventListener("keydown", function (e) {
      var n = toN(c, P[c.id]), d = e.shiftKey ? 0.1 : 0.02, k = e.key;
      if (k === "ArrowUp" || k === "ArrowRight") n += d; else if (k === "ArrowDown" || k === "ArrowLeft") n -= d; else if (k === "Home") n = 1; else if (k === "End") n = 0; else if (k === "0") n = 0.5; else return;
      e.preventDefault(); user(n);
    });
    nm.textContent = c.label; w.title = c.hint || ""; cap.setAttribute("aria-label", c.label + " " + (c.hint || "")); cap.setAttribute("aria-orientation", "vertical");
    cap.setAttribute("aria-valuemin", c.min); cap.setAttribute("aria-valuemax", c.max);
    knobs[c.id] = { cfg: c, paint: paint, relabel: function () { paint(P[c.id]); } };
    paint(P[c.id]);
  }
  function paintEq() {
    var el = document.getElementById("eqPath"); if (!el) return;
    var d = "", i, f, g, k;
    for (i = 0; i <= 90; i++) {
      f = 40 * Math.pow(12000 / 40, i / 90); g = 0;
      for (k = 0; k < 6; k++) { var o = Math.log(f / EQF[k][1]) / Math.LN2; g += P["e_b" + (k + 1)] * Math.exp(-(o * o) / (2 * 0.62 * 0.62)); }
      d += (i ? "L" : "M") + (300 * i / 90).toFixed(1) + " " + (55 - g * (45 / 14)).toFixed(1);
    }
    el.setAttribute("d", d);
  }
  var prevApply2 = applyMods; applyMods = function (imm) { prevApply2(imm); paintEq(); };
  paintEq();

  (function () {
    var sc = document.createElement("section");
    sc.className = "pedal bp bp-scope theme-graphite"; sc.id = "ped-scope"; sc.setAttribute("aria-label", "Scope: spectrum and tuner");
    sc.innerHTML = '<div class="bp-head"><h2 class="bp-title">Scope</h2><p class="bp-sub">Output spectrum and tuner</p></div>' +
      '<div class="scr"><canvas id="spec" aria-label="Output spectrum"></canvas><i class="glass"></i></div>' +
      '<div class="tuner"><div class="tn"><b id="tnNote">—</b><span id="tnOct"></span></div><div class="tnr"><span id="tnHz">— Hz</span><span id="tnCents"></span></div>' +
      '<div class="tled" id="tled" aria-hidden="true"></div><div class="tlab" aria-hidden="true"><span>♭</span><span>0</span><span>♯</span></div>' +
      '<p class="tnhint">The tuner listens to the chain output. To tune an instrument turn on Input on the bottom bar and play one note.</p></div>';
    document.querySelector(".wrap").appendChild(sc);
    var tl = document.getElementById("tled"), i; for (i = 0; i < 11; i++) tl.appendChild(document.createElement("i"));
    var cv = document.getElementById("spec"), g2 = cv.getContext("2d"), NB = 56, peak = new Float32Array(NB), fb = null, tb = null, pk2 = 0, last = 0;
    var NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"], hold = { note: -1, t: 0 };
    var tick2 = 0, lastF = -1;
    function pitch(buf, sr) {
      var N = 2048, i, lag, rms = 0, P2 = new Float32Array(buf.length + 1);
      for (i = 0; i < buf.length; i++) P2[i + 1] = P2[i] + buf[i] * buf[i];
      rms = Math.sqrt(P2[N] / N); if (rms < 0.006) return -1;
      var lo = Math.floor(sr / 1000), hi = Math.min(Math.floor(sr / 60), buf.length - N - 1), cs = new Float32Array(hi + 2), cmax = 0, e0 = P2[N];
      for (lag = lo; lag <= hi; lag++) {
        var s2 = 0; for (i = 0; i < N; i++) s2 += buf[i] * buf[i + lag];
        var den = Math.sqrt(e0 * (P2[N + lag] - P2[lag])) + 1e-12, cc = s2 / den; cs[lag] = cc; if (cc > cmax) cmax = cc;
      }
      if (cmax < 0.6) return -1;
      for (lag = lo + 1; lag < hi; lag++) if (cs[lag] >= cmax * 0.92 && cs[lag] >= cs[lag - 1] && cs[lag] >= cs[lag + 1]) {
        var a = cs[lag - 1], b = cs[lag], c2 = cs[lag + 1], sh = (a - c2) / (2 * (a - 2 * b + c2) || 1);
        return sr / (lag + sh);
      }
      return -1;
    }
    function frame(now) {
      requestAnimationFrame(frame);
      var cur = document.querySelector(".pedal.cur");
      if (!cur || cur.id !== "ped-scope" || document.hidden || now - last < 66) return;
      last = now;
      var dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
      if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      g2.setTransform(dpr, 0, 0, dpr, 0, 0); g2.clearRect(0, 0, W, H);
      var dots = !window.__solid;
      if (dots) { g2.fillStyle = "rgba(255,255,255,.07)"; var gx, gy; for (gy = 0; gy < H; gy += 3) for (gx = 0; gx < W; gx += 3) g2.fillRect(gx, gy, 2, 2); }
      if (!scopeAn) { var ib = 0, ix, iy; for (ib = 0; ib < NB; ib++) { ix = ib * (W / NB) + 1; for (iy = 0; iy < 2; iy++) { g2.fillStyle = "rgba(255,255,255,.16)"; g2.fillRect(ix, H - (iy + 1) * 5, W / NB - 2, 3.5); } } g2.fillStyle = "#fff"; g2.font = "24px FxPixel, monospace"; g2.textAlign = "center"; g2.fillText("NO SIGNAL", W / 2, H / 2 - 2); g2.fillStyle = "rgba(255,255,255,.7)"; g2.fillText("PRESS PLAY", W / 2, H / 2 + 28); g2.fillStyle = "#c2493b"; g2.fillRect(W / 2 - 3, H / 2 - 34, 6, 6); return; }
      if (!fb) { fb = new Uint8Array(scopeAn.frequencyBinCount); tb = new Float32Array(scopeAn.fftSize); }
      scopeAn.getByteFrequencyData(fb); scopeAn.getFloatTimeDomainData(tb);
      var sr = ctx.sampleRate, bw = W / NB, seg = 5, b, k;
      if (dots) {
        var cols = Math.floor(W / 3), rows = Math.floor(H / 3), nb = Math.min(NB, Math.floor(cols / 3)), top = rows - 5, r, x0 = Math.floor((cols - nb * 3) / 2);
        for (b = 0; b < nb; b++) {
          var q0 = 40 * Math.pow(400, b / nb), q1 = 40 * Math.pow(400, (b + 1) / nb), j0 = Math.floor(q0 / sr * scopeAn.fftSize), j1 = Math.max(j0 + 1, Math.ceil(q1 / sr * scopeAn.fftSize)), mm = 0;
          for (k = j0; k < j1 && k < fb.length; k++) if (fb[k] > mm) mm = fb[k];
          var vv = Math.max(0, (mm - 70) / 185); peak[b] = Math.max(vv, peak[b] - 0.012);
          var nr = Math.round(Math.min(1.15, vv) * top), px = (x0 + b * 3) * 3, pr = Math.min(top + 2, Math.round(peak[b] * top));
          for (r = 0; r < nr; r++) { g2.fillStyle = r >= Math.round(top * 0.85) ? "#c2493b" : "#fff"; g2.fillRect(px, (rows - 1 - r) * 3, 2, 2); g2.fillRect(px + 3, (rows - 1 - r) * 3, 2, 2); }
          if (pr > nr) { g2.fillStyle = "rgba(255,255,255,.55)"; g2.fillRect(px, (rows - 1 - pr) * 3, 2, 2); g2.fillRect(px + 3, (rows - 1 - pr) * 3, 2, 2); }
        }
      } else {
      for (b = 0; b < NB; b++) {
        var f0 = 40 * Math.pow(400, b / NB), f1 = 40 * Math.pow(400, (b + 1) / NB), i0 = Math.floor(f0 / sr * scopeAn.fftSize), i1 = Math.max(i0 + 1, Math.ceil(f1 / sr * scopeAn.fftSize)), m = 0;
        for (k = i0; k < i1 && k < fb.length; k++) if (fb[k] > m) m = fb[k];
        var v = Math.max(0, (m - 70) / 185); peak[b] = Math.max(v, peak[b] - 0.012);
        var n = Math.round(v * (H / seg)), x = b * bw + 1;
        if (n > 0) { var hh2 = n * seg, wk = Math.ceil(0.82 * H / seg) * seg, wH = Math.min(hh2, wk); g2.fillStyle = "#f4f5f6"; g2.fillRect(x, H - wH, bw - 2, wH); if (hh2 > wH) { g2.fillStyle = "#e8321e"; g2.fillRect(x, H - hh2, bw - 2, hh2 - wH); } }
        var py = H - Math.round(peak[b] * (H / seg)) * seg; g2.fillStyle = "rgba(255,255,255,0.8)"; g2.fillRect(x, py - seg, bw - 2, 1.5);
      }
      }
      g2.fillStyle = "rgba(255,255,255,.75)"; g2.font = "12px FxPixel, monospace"; g2.textAlign = "center";
      [[100, "100"], [1000, "1k"], [10000, "10k"]].forEach(function (q) { g2.fillText(q[1], Math.log(q[0] / 40) / Math.log(400) * W, 10); });
      var f = (tick2++ % 6 === 0) ? (lastF = pitch(tb, sr)) : lastF, note = document.getElementById("tnNote"), oct = document.getElementById("tnOct"), hz = document.getElementById("tnHz"), ce = document.getElementById("tnCents"), leds = tl.children;
      if (f > 0) {
        var nn = 69 + 12 * Math.log(f / 440) / Math.LN2, r = Math.round(nn), cents = Math.round((nn - r) * 100);
        if (hold.note !== r) { hold.note = r; hold.t = now; }
        note.textContent = NAMES[((r % 12) + 12) % 12]; oct.textContent = Math.floor(r / 12) - 1; hz.textContent = f.toFixed(1) + " Hz"; ce.textContent = (cents > 0 ? "+" : "") + cents + "¢";
        var li = Math.max(0, Math.min(10, Math.round(cents / 10) + 5));
        for (k = 0; k < 11; k++) { leds[k].className = k === li ? (Math.abs(cents) <= 5 ? "on ok" : "on") : ""; }
        pk2 = now;
      } else if (now - pk2 > 600) { note.textContent = "—"; oct.textContent = ""; hz.textContent = "— Hz"; ce.textContent = ""; for (k = 0; k < 11; k++) leds[k].className = ""; }
    }
    requestAnimationFrame(frame);
  })();

  (function () {
    var nav = document.querySelector(".chain"), row = document.createElement("div");
    row.className = "scenes"; row.innerHTML = '<span>Scenes</span>'; nav.appendChild(row);
    window.__scenesRow = row;
  })();

  (function () {
    var IDS = ["grain", "reverb", "tape", "swirl", "drive", "morph", "wah", "comp", "eq", "gate", "cab", "scope"];
    var RED = "#c2493b";
    var NAME = { grain: "SOURCE", reverb: "TAIL", tape: "TAPE", swirl: "SWIRL", drive: "DRIVE", morph: "MORPH", wah: "WAH", comp: "COMP", eq: "EQ6", gate: "GATE", cab: "CAB", scope: "SCOPE" };
    var PXF = "FxPixel,ui-monospace,Menlo,Consolas,monospace";
    var UID = "";
    function u(n) { return "z" + n + UID; }
    function ref(n) { return "url(#" + u(n) + ")"; }
    function hid(id) { var h = 7, i; for (i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 2147483000; return h + 3; }

    var TITLE = { grain: "AUDIO SOURCE", reverb: "DECAY ENVELOPE", tape: "TAPE ECHO", swirl: "MOD LFO", drive: "TRANSFER CURVE", morph: "RING MOD", wah: "FILTER RESPONSE", comp: "COMP CURVE", eq: "EQ RESPONSE", gate: "THRESHOLD", cab: "SPEAKER RESPONSE" };
    function nv(sec, label, def) {
      var k = sec.querySelector('.knob[aria-label="' + label + '"]'); if (!k) return def === undefined ? 0.5 : def;
      var v = +k.getAttribute("aria-valuenow"), lo = +k.getAttribute("aria-valuemin"), hi = +k.getAttribute("aria-valuemax");
      return hi > lo ? Math.max(0, Math.min(1, (v - lo) / (hi - lo))) : 0.5;
    }
    function curve(fn, B, n, close) {
      var d = "", i;
      for (i = 0; i <= n; i++) { var t = i / n, p = fn(t); d += (i ? "L" : "M") + f1(B.x + t * B.w) + " " + f1(B.y + B.h * (1 - (p + 1) / 2)); }
      return d;
    }
    var SIG = {
      drive: function (sec, B) {
        var k = 1 + nv(sec, "Drive") * 14, bl = nv(sec, "Blend", 1);
        return { ghost: curve(function (t) { return t * 2 - 1; }, B, 2), main: curve(function (t) { var x = t * 2 - 1; return (1 - bl) * x + bl * Math.tanh(k * x) / Math.tanh(k); }, B, 80) };
      },
      comp: function (sec, B) {
        var ra = 1 + nv(sec, "Sustain") * 9, th = 0.2 + 0.35 * (1 - nv(sec, "Attack"));
        return { ghost: curve(function (t) { return t * 2 - 1; }, B, 2), main: curve(function (t) { var x = t; return (x < th ? x : th + (x - th) / ra) * 2 - 1; }, B, 60) };
      },
      wah: function (sec, B) {
        var c = (nv(sec, "Freq") - 0.5) * 7, q = 1 + nv(sec, "Resonance") * 14;
        return { ghost: curve(function () { return -0.9; }, B, 2), main: curve(function (t) { var f = (t - 0.5) * 8 - c, g = 1 / Math.sqrt(1 + q * q * Math.pow(Math.pow(2, f) - Math.pow(2, -f), 2) / 4); return g * 1.8 - 0.9; }, B, 120) };
      },
      swirl: function (sec, B, ph) {
        var cy = 1 + nv(sec, "Speed") * 7, am = 0.15 + 0.8 * nv(sec, "Depth"), st = nv(sec, "Stereo", 0.8) * 1.2;
        return { ghost: curve(function (t) { return am * Math.sin(6.283 * cy * t + st + ph * 6.283); }, B, 140), main: curve(function (t) { return am * Math.sin(6.283 * cy * t + ph * 6.283); }, B, 140) };
      },
      morph: function (sec, B, ph) {
        var c = 3 + nv(sec, "Carrier") * 12, rr = 1 + nv(sec, "Speed") * 4, am = 0.25 + 0.7 * nv(sec, "Depth"), mx = nv(sec, "Mix", 0.6);
        return { ghost: curve(function (t) { return 0.7 * Math.sin(6.283 * c * t); }, B, 160), main: curve(function (t) { return am * ((1 - mx) * Math.sin(6.283 * c * t) + mx * Math.sin(6.283 * c * t) * Math.sin(6.283 * (rr * t + ph))); }, B, 200) };
      },
      reverb: function (sec, B) {
        var de = 0.4 + nv(sec, "Decay", 0.3) * 4, pd = nv(sec, "Pre-delay", 0.2) * 0.25, mx = 0.3 + 0.7 * nv(sec, "Mix", 0.4), r2 = rnd(77);
        var nz = []; for (var i = 0; i <= 120; i++) nz.push(r2() * 2 - 1);
        return { ghost: curve(function (t) { return t < pd ? -1 : -1 + 1.9 * Math.exp(-(t - pd) * 5 / de * 3); }, B, 80), main: curve(function (t) { var a = t < pd ? 0 : Math.exp(-(t - pd) * 5 / de * 3); return 0.9 * mx * a * nz[Math.round(t * 120)]; }, B, 120) };
      },
      cab: function (sec, B) {
        var p = window.__cabP(P.k_mode, nv(sec, "Mic", 0.4), nv(sec, "Body"), nv(sec, "Hi Cut"));
        function g(x, f0, gn, w) { var q = Math.log(x / f0) / Math.LN2 / w; return gn * Math.exp(-q * q); }
        return { ghost: curve(function () { return 0; }, B, 2), main: curve(function (t) {
          var f = 50 * Math.pow(160, t), db = g(f, p.rf, p.rg, 0.45) + g(f, p.pf, p.pg, 0.6) + g(f, p.kf, p.kg, 0.7);
          db -= 12 * Math.log(1 + Math.pow(p.hp / f, 4)) / Math.LN2 * 0.5; db -= 12 * Math.log(1 + Math.pow(f / p.lp, 4)) / Math.LN2 * 0.5;
          return Math.max(-0.95, Math.min(0.95, db / 14 - 0.1));
        }, B, 120) };
      },
      gate: function (sec, B) {
        var th = 0.12 + 0.7 * nv(sec, "Thresh"), r2 = rnd(5), amp = [], i;
        for (i = 0; i < 28; i++) amp.push(0.12 + 0.88 * r2());
        return { thr: th, bars: amp, ghost: curve(function () { return th * 2 - 1; }, B, 2), main: "" };
      },
      eq: function (sec, B) {
        var v = [].map.call(sec.querySelectorAll(".fcap"), function (e) { return (+e.getAttribute("aria-valuenow") || 0) / 12; }).slice(0, 6);
        return { ghost: curve(function () { return 0; }, B, 2), main: curve(function (t) { var p = t * 5, i0 = Math.min(4, Math.floor(p)), f = p - i0, a = v[i0] || 0, b2 = v[i0 + 1] || 0, e = f * f * (3 - 2 * f); return (a + (b2 - a) * e) * 0.9; }, B, 100) };
      },
      tape: function (sec, B) {
        var T = 0.08 + nv(sec, "Time") * 0.3, de = 0.3 + 0.62 * nv(sec, "Repeats"), wo = nv(sec, "Wear") * 0.02, k, d = "";
        for (k = 0; k < 9; k++) { var a = Math.pow(de, k), x = B.x + (k * T + Math.sin(k * 2.1) * wo) * B.w + 4; if (x > B.x + B.w) break; d += "M" + f1(x) + " " + f1(B.y + B.h) + "V" + f1(B.y + B.h * (1 - a * 0.92)); }
        return { ghost: "", main: "", bars: d, dots: true };
      },
      grain: function (sec, B) {
        var nm = document.getElementById("srcName"), t = sec.querySelector(".oled .t"), l = sec.querySelector(".oled .l");
        if (nm && t) { var s0 = nm.textContent.toUpperCase(); if (t.textContent !== s0) t.textContent = s0; }
        if (l) { var s1 = running ? "PLAYING" : "READY"; if (l.textContent !== s1) l.textContent = s1; }
        if (!peaks || !peaks.length) return { ghost: "", main: "" };
        var N = Math.max(20, Math.floor(B.w / 4)), mid = B.y + B.h / 2, top = [], bot = [], i;
        for (i = 0; i <= N; i++) { var x = B.x + B.w * i / N, a = peaks[Math.min(peaks.length - 1, Math.floor(i / N * (peaks.length - 1)))] || 0, h = Math.max(1.5, a * B.h * 0.5); top.push(f1(x) + " " + f1(mid - h)); bot.push(f1(x) + " " + f1(mid + h)); }
        var d = "M" + top.join("L") + "L" + bot.reverse().join("L") + "Z";
        var px = (running && buf && window.__srcT0 != null) ? B.x + B.w * (window.__loopSrc ? ((ctx.currentTime - window.__srcT0) / buf.duration) % 1 : Math.min(1, (ctx.currentTime - window.__srcT0) / buf.duration)) : B.x;
        return { ghost: "M" + f1(px) + " " + f1(B.y) + "L" + f1(px) + " " + f1(B.y + B.h), main: d };
      }
    };
    var OLED = ["grain", "reverb", "drive", "swirl", "morph", "wah", "comp", "tape", "gate", "cab"];
    function mountOled(id) {
      var sec = document.getElementById("ped-" + id); if (!sec || sec.querySelector(".oled")) return;
      var ind = sec.querySelector(":scope > .ind"), at = ind || sec.querySelector(".bp-head"); if (!at) return;
      var d = document.createElement("div"); d.className = "oled";
      d.innerHTML = '<div class="gw" aria-hidden="true"><span class="t">' + TITLE[id] + '</span><span class="l">LIVE</span><canvas></canvas><div class="rdw"><span class="rn"></span><span class="rv"></span></div></div>';
      at.parentNode.insertBefore(d, at.nextSibling);
      if (ind) d.insertBefore(ind, d.firstChild);
    }
    var LAST = 0, LASTID = "", LT = 0, DPR = Math.min(2, window.devicePixelRatio || 1);
    ["pointerdown", "pointermove", "keydown", "touchstart"].forEach(function (e) { window.addEventListener(e, function () { LT = performance.now(); }, { passive: true }); });
    function pathOf(str) { var m = str.match(/d="([^"]*)"/g) || []; return m.map(function (x) { return new Path2D(x.slice(3, -1)); }); }
    function poly(d) { var n = d.match(/-?\d+\.?\d*/g) || [], o = [], i; for (i = 0; i + 1 < n.length; i += 2) o.push([+n[i], +n[i + 1]]); return o; }
    var CELL = 3, RD = { el: null, t: 0, down: false }, OC = {};
    function oc(k) { return OC[k] || (OC[k] = document.createElement("canvas")); }
    function dotMask(W, H) {
      var key = W + "x" + H + "@" + DPR, m = oc("mask"), gd = oc("grid");
      if (m._k === key) return;
      m._k = key; var w = Math.round(W * DPR), h = Math.round(H * DPR), cx, cy, g, q, s = CELL * DPR, d = Math.max(1, Math.round(2 * DPR));
      m.width = gd.width = w; m.height = gd.height = h;
      g = m.getContext("2d"); q = gd.getContext("2d"); g.clearRect(0, 0, w, h); q.clearRect(0, 0, w, h);
      g.fillStyle = "#000"; q.fillStyle = "rgba(255,255,255,.07)";
      for (cy = 0; cy * s < h; cy++) for (cx = 0; cx * s < w; cx++) { g.fillRect(Math.round(cx * s), Math.round(cy * s), d, d); q.fillRect(Math.round(cx * s), Math.round(cy * s), d, d); }
    }
    function rdText() {
      var el = RD.el; if (!el || !el.isConnected) return null;
      var nm, val;
      if (el.classList.contains("fd")) { nm = (el.querySelector(".name") || {}).textContent || ""; val = (el.querySelector(".sub") || {}).textContent || ""; nm = nm + " HZ"; }
      else { var k = el.querySelector(".knob"); if (!k) return null; nm = k.getAttribute("aria-label") || ""; val = k.getAttribute("aria-valuetext") || k.getAttribute("aria-valuenow") || ""; }
      return { n: nm.toUpperCase(), v: String(val).toUpperCase() };
    }
    function pickCtl(e) { var t = e.target; return t && t.closest ? t.closest(".kw, .fd") : null; }
    window.addEventListener("pointerdown", function (e) { var c = pickCtl(e); if (c) { RD.el = c; RD.t = performance.now(); RD.down = true; } }, { passive: true, capture: true });
    window.addEventListener("pointermove", function (e) { if (RD.down) RD.t = performance.now(); }, { passive: true, capture: true });
    ["pointerup", "pointercancel"].forEach(function (n) { window.addEventListener(n, function () { if (RD.down) { RD.down = false; RD.t = performance.now(); } }, { passive: true, capture: true }); });
    window.addEventListener("keydown", function (e) { var c = pickCtl(e); if (c && /Arrow|Page|Home|End/.test(e.key)) { RD.el = c; RD.t = performance.now(); } }, { passive: true, capture: true });
    window.addEventListener("wheel", function (e) { var c = pickCtl(e); if (c) { RD.el = c; RD.t = performance.now(); } }, { passive: true, capture: true });
    function readoutOn(ts) { return false; }
    function setRd(gw, on) {
      if (!gw) return; if (gw.classList.contains("rd") !== !!on) gw.classList.toggle("rd", !!on);
      if (!on) return; var r = rdText(); if (!r) return;
      var n = gw.querySelector(".rn"), v = gw.querySelector(".rv"); if (!n || !v) return;
      if (n.textContent !== r.n) n.textContent = r.n; if (v.textContent !== r.v) { v.textContent = r.v; v.style.fontSize = r.v.length > 7 ? "24px" : "36px"; }
    }
    function drawReadout(g, W, H, ts) {
      var r = rdText(); if (!r) return;
      var sizes = [36, 24], z = 24, i;
      g.font = "24px " + PXF;
      for (i = 0; i < sizes.length; i++) { g.font = sizes[i] + "px " + PXF; if (g.measureText(r.v).width <= W - 24) { z = sizes[i]; break; } z = sizes[i]; }
      g.fillStyle = "#fff"; g.font = "12px " + PXF; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText(r.n, 14, 24);
      g.fillStyle = "#fff"; g.font = z + "px " + PXF; g.textAlign = "center"; g.fillText(r.v, W / 2, Math.round(H - 14));
      g.fillStyle = RED; g.fillRect(W - 22, 12, 6, 6);
    }
    function drawOled(c, id, sec, W, H, ts, ph) {
      var g = c.getContext("2d"), B = { x: 12, y: 24, w: W - 24 - (id === "comp" ? 62 : 0), h: H - 34 }, i, j, P, rd = readoutOn(ts);
      g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
      if (id === "tape" || id === "gate") {
        P = pathOf(id === "tape" ? tapeFill({ w: W, h: H }, ph) : gateFill(W, H, ph));
        g.save(); g.globalAlpha = rd ? 0.22 : 1; g.translate(6, 6); g.fillStyle = "#fff"; if (P[0]) g.fill(P[0]); g.fillStyle = RED; if (P[1]) g.fill(P[1]); g.restore();
        if (id === "gate" && !rd) { g.fillStyle = "#fff"; g.font = "12px " + PXF; g.textAlign = "left"; g.fillText("HISS", 16, H - 9); g.textAlign = "right"; g.fillText("SHUT", W - 14, H - 9); }
        setRd(c.parentNode, rd);
        return;
      }
      dotMask(W, H);
      var f = SIG[id](sec, B, ph), D = SOLID ? 2.2 : 2;
      if (!SOLID) { g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(oc("grid"), 0, 0); g.setTransform(DPR, 0, 0, DPR, 0, 0); }
      g.globalAlpha = rd ? 0.2 : 1;
      function dot(x, y, col) { g.fillStyle = col; g.fillRect(Math.floor(x / CELL) * CELL, Math.floor(y / CELL) * CELL, D, D); }
      function plot(pts, col, dash) {
        var k, n = 0, lx = -1, ly = -1;
        if (SOLID) {
          g.save(); g.strokeStyle = col; g.lineWidth = 2; g.lineJoin = "round"; g.setLineDash(dash ? [4, 4] : []); g.beginPath();
          for (k = 0; k < pts.length; k++) { if (k) g.lineTo(pts[k][0], pts[k][1]); else g.moveTo(pts[k][0], pts[k][1]); }
          g.stroke(); g.restore(); return;
        }
        for (k = 1; k < pts.length; k++) {
          var x0 = pts[k - 1][0], y0 = pts[k - 1][1], x1 = pts[k][0], y1 = pts[k][1], st = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / 2)), q;
          for (q = 0; q <= st; q++) {
            var cx = Math.floor((x0 + (x1 - x0) * q / st) / CELL), cy = Math.floor((y0 + (y1 - y0) * q / st) / CELL);
            if (cx === lx && cy === ly) continue; lx = cx; ly = cy; n++;
            if (dash && (n % 4) > 1) continue;
            g.fillStyle = col; g.fillRect(cx * CELL, cy * CELL, D, D);
          }
        }
      }
      if (f.ghost) plot(poly(f.ghost), "rgba(255,255,255,.4)", true);
      if (ctx && ctx.state === "running") {
        try {
          var m = meters[id]; if (m && m.i) {
            var buf = new Float32Array(m.i.fftSize), n2 = 90, mid = B.y + B.h / 2, ap = []; m.i.getFloatTimeDomainData(buf);
            for (i = 0; i < n2; i++) { var v = Math.max(-1, Math.min(1, buf[Math.floor(i * buf.length / n2)] * 2.2)); ap.push([B.x + B.w * i / (n2 - 1), mid - v * B.h * 0.42]); }
            plot(ap, "rgba(255,255,255,.35)", false);
          }
        } catch (e) {}
      }
      if (f.main) {
        var pts = poly(f.main), tot = 0, seg = [], k;
        plot(pts, "#fff", false);
        for (k = 1; k < pts.length; k++) { var l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); seg.push(l); tot += l; }
        if (tot > 0) {
          var want = ((ts / 3500) % 1) * tot, acc = 0, qx = pts[0][0], qy = pts[0][1];
          for (k = 0; k < seg.length; k++) { if (acc + seg[k] >= want) { var u = seg[k] ? (want - acc) / seg[k] : 0; qx = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u; qy = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u; break; } acc += seg[k]; }
          var cx0 = Math.floor(qx / CELL) * CELL, cy0 = Math.floor(qy / CELL) * CELL;
          g.fillStyle = RED; g.fillRect(cx0 - CELL, cy0 - CELL, CELL * 2 + D, CELL * 2 + D);
        }
      }
      if (id === "comp") {
        var gr = 0, x0 = W - 40, nn = 14, ch = B.h / nn;
        try { gr = Math.max(0, Math.min(20, -(mods.comp.comp.reduction || 0))); } catch (e) {}
        for (i = 0; i < nn; i++) { var on = (i + 1) / nn * 20 <= gr + 0.01 || (i === 0 && gr > 0.05); g.fillStyle = on ? (i > 9 ? RED : "#fff") : "rgba(255,255,255,.14)"; g.fillRect(x0, Math.round(B.y + i * ch) + 1, 15, Math.max(2, Math.round(ch) - 3)); }
        g.fillStyle = "#fff"; g.font = "12px " + PXF; g.textAlign = "center"; g.fillText("GR", x0 + 7, B.y - 6); g.fillText(gr.toFixed(1), x0 + 7, H - 4);
      }
      g.globalAlpha = 1; var lw = Math.round(W * DPR), lh = Math.round(H * DPR);
      setRd(c.parentNode, rd);
    }
    var SOLID = false, DIGITS = false; window.__setSolid = function (v) { SOLID = !!v; window.__solid = !!v; LAST = 0; }; window.__setDigits = function (v) { DIGITS = !!v; };
    function oledLoop(ts) {
      requestAnimationFrame(oledLoop);
      if (document.hidden) return;
      var live = ctx && ctx.state === "running", busy = ts - LT < 1500, gap = document.body.classList.contains("lite") ? ((live || busy) ? 80 : 180) : ((live || busy) ? 50 : 120);
      if (ts - LAST < gap) return; LAST = ts;
      [].forEach.call(document.querySelectorAll(".pedal.cur, .pedal.vis"), function (sc) { oledOne(sc, ts); });
    }
    function oledOne(sec, ts) {
      if (DIGITS && sec.id !== "ped-grain") return;
      var id = sec.id.slice(4), ph = (ts / 5000) % 1;
      if (sec.classList.contains("cur") && id !== LASTID) { LASTID = id; var bd = sec.querySelector(".oled") || sec.querySelector(".plate"); if (bd) { bd.classList.remove("boot"); void bd.offsetWidth; bd.classList.add("boot"); } }
      var d = sec.querySelector(".oled .gw"); if (!d || !(SIG[id] || id === "tape" || id === "gate")) return;
      var W = d.clientWidth, H = d.clientHeight, c = d.querySelector("canvas"); if (!W || !c) return;
      if (c.width !== Math.round(W * DPR) || c.height !== Math.round(H * DPR)) { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); }
      if (id === "reverb") { var tt = d.querySelector(".t"), dv = document.getElementById("dispVal"), nm = "REVERB / " + (dv ? dv.textContent.toUpperCase() : ""); if (tt && tt.textContent !== nm) tt.textContent = nm; }
      drawOled(c, id, sec, W, H, ts, ph);
    }

    (function () {
      var dk = document.querySelector(".dock"), t = 0; if (!dk) return;
      function busy() { return !!dk.querySelector("button.on"); }
      function wake() { dk.classList.remove("sleep"); clearTimeout(t); t = setTimeout(function () { if (!busy()) dk.classList.add("sleep"); }, 3500); }
      ["pointerdown", "touchstart", "keydown", "scroll"].forEach(function (ev) { window.addEventListener(ev, wake, { passive: true, capture: true }); });
      wake();
    })();

    function foldKey(id, name) { return "fxter.fold." + id + "." + name; }
    function makeFold(id, head, body, open) {
      var nm = (head.textContent || "").trim().toLowerCase(), st = null;
      try { st = localStorage.getItem(foldKey(id, nm)); } catch (e) {}
      if (st === "1") open = true; else if (st === "0") open = false;
      var ord = getComputedStyle(body[0]).order, w = document.createElement("div"); w.className = "fold-b";
      body[0].parentNode.insertBefore(w, body[0]); w.style.order = ord; head.style.order = ord; body.forEach(function (b) { w.appendChild(b); });
      head.classList.add("fold-h"); head.setAttribute("role", "button"); head.tabIndex = 0;
      function set(o, save) {
        w.classList.toggle("closed", !o); head.setAttribute("aria-expanded", o ? "true" : "false");
        if (save) { try { localStorage.setItem(foldKey(id, nm), o ? "1" : "0"); } catch (e) {} }
      }
      head.addEventListener("click", function () { set(w.classList.contains("closed"), true); });
      head.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); head.click(); } });
      set(open, false);
    }
    function labelFor(text) { var p = document.createElement("p"); p.className = "rowcap"; p.textContent = text; return p; }
    (function () {
      var g = document.getElementById("ped-grain");
      if (g) {
        [].forEach.call(g.querySelectorAll(".rowbox"), function (rb) { var h = rb.querySelector(":scope > .rowcap"), k = rb.querySelector(":scope > .knobs"); if (h && k) makeFold("grain", h, [k], true); });
        
        var tl = g.querySelector(".tools"); if (tl) { var h2 = labelFor("Looper, tempo, my presets"); tl.parentNode.insertBefore(h2, tl); makeFold("grain", h2, [tl], false); }
      }
      var r = document.getElementById("ped-reverb");
      if (r) {
        var ad = r.querySelectorAll(".advlab");
        [].forEach.call(ad, function (h) { var k = h.nextElementSibling; if (k && k.classList.contains("knobs")) makeFold("reverb", h, [k], h.textContent.trim().toLowerCase() !== "advanced"); });
      }
    })();
    var TAGS = {"grain":{"d":"M8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM8.7 24.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM24.7 24.7h6.6v6.6h-6.6zM32.7 32.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM0.7 48.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM56.7 48.7h6.6v6.6h-6.6zM64.7 48.7h6.6v6.6h-6.6zM72.7 48.7h6.6v6.6h-6.6zM96.7 0.7h6.6v6.6h-6.6zM128.7 0.7h6.6v6.6h-6.6zM96.7 8.7h6.6v6.6h-6.6zM128.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM128.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM128.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM128.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM128.7 40.7h6.6v6.6h-6.6zM104.7 48.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM120.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM152.7 0.7h6.6v6.6h-6.6zM160.7 0.7h6.6v6.6h-6.6zM168.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM176.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM176.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM152.7 24.7h6.6v6.6h-6.6zM160.7 24.7h6.6v6.6h-6.6zM168.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM160.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM168.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6zM176.7 48.7h6.6v6.6h-6.6zM200.7 0.7h6.6v6.6h-6.6zM208.7 0.7h6.6v6.6h-6.6zM216.7 0.7h6.6v6.6h-6.6zM192.7 8.7h6.6v6.6h-6.6zM224.7 8.7h6.6v6.6h-6.6zM192.7 16.7h6.6v6.6h-6.6zM192.7 24.7h6.6v6.6h-6.6zM192.7 32.7h6.6v6.6h-6.6zM192.7 40.7h6.6v6.6h-6.6zM224.7 40.7h6.6v6.6h-6.6zM200.7 48.7h6.6v6.6h-6.6zM208.7 48.7h6.6v6.6h-6.6zM216.7 48.7h6.6v6.6h-6.6zM240.7 0.7h6.6v6.6h-6.6zM248.7 0.7h6.6v6.6h-6.6zM256.7 0.7h6.6v6.6h-6.6zM264.7 0.7h6.6v6.6h-6.6zM272.7 0.7h6.6v6.6h-6.6zM240.7 8.7h6.6v6.6h-6.6zM240.7 16.7h6.6v6.6h-6.6zM240.7 24.7h6.6v6.6h-6.6zM248.7 24.7h6.6v6.6h-6.6zM256.7 24.7h6.6v6.6h-6.6zM264.7 24.7h6.6v6.6h-6.6zM240.7 32.7h6.6v6.6h-6.6zM240.7 40.7h6.6v6.6h-6.6zM240.7 48.7h6.6v6.6h-6.6zM248.7 48.7h6.6v6.6h-6.6zM256.7 48.7h6.6v6.6h-6.6zM264.7 48.7h6.6v6.6h-6.6zM272.7 48.7h6.6v6.6h-6.6z","vb":[0,0,280,56]},"reverb":{"d":"M0.7 0.7h6.6v6.6h-6.6zM8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM16.7 8.7h6.6v6.6h-6.6zM16.7 16.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM16.7 32.7h6.6v6.6h-6.6zM16.7 40.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM56.7 24.7h6.6v6.6h-6.6zM64.7 24.7h6.6v6.6h-6.6zM72.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM48.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM112.7 8.7h6.6v6.6h-6.6zM112.7 16.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM112.7 32.7h6.6v6.6h-6.6zM112.7 40.7h6.6v6.6h-6.6zM104.7 48.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM120.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6zM152.7 48.7h6.6v6.6h-6.6zM160.7 48.7h6.6v6.6h-6.6zM168.7 48.7h6.6v6.6h-6.6zM176.7 48.7h6.6v6.6h-6.6z","vb":[0,0,184,56]},"tape":{"d":"M0.7 0.7h6.6v6.6h-6.6zM8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM16.7 8.7h6.6v6.6h-6.6zM16.7 16.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM16.7 32.7h6.6v6.6h-6.6zM16.7 40.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM56.7 24.7h6.6v6.6h-6.6zM64.7 24.7h6.6v6.6h-6.6zM72.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM48.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM96.7 0.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM96.7 8.7h6.6v6.6h-6.6zM128.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM128.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM104.7 24.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM120.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM96.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM152.7 0.7h6.6v6.6h-6.6zM160.7 0.7h6.6v6.6h-6.6zM168.7 0.7h6.6v6.6h-6.6zM176.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM152.7 24.7h6.6v6.6h-6.6zM160.7 24.7h6.6v6.6h-6.6zM168.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6zM152.7 48.7h6.6v6.6h-6.6zM160.7 48.7h6.6v6.6h-6.6zM168.7 48.7h6.6v6.6h-6.6zM176.7 48.7h6.6v6.6h-6.6z","vb":[0,0,184,56]},"swirl":{"d":"M8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM8.7 24.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM24.7 24.7h6.6v6.6h-6.6zM32.7 32.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM0.7 48.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM48.7 0.7h6.6v6.6h-6.6zM80.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM64.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM64.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM56.7 40.7h6.6v6.6h-6.6zM72.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM48.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM112.7 8.7h6.6v6.6h-6.6zM112.7 16.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM112.7 32.7h6.6v6.6h-6.6zM112.7 40.7h6.6v6.6h-6.6zM104.7 48.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM120.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM152.7 0.7h6.6v6.6h-6.6zM160.7 0.7h6.6v6.6h-6.6zM168.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM176.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM176.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM152.7 24.7h6.6v6.6h-6.6zM160.7 24.7h6.6v6.6h-6.6zM168.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM160.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM168.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6zM176.7 48.7h6.6v6.6h-6.6zM192.7 0.7h6.6v6.6h-6.6zM192.7 8.7h6.6v6.6h-6.6zM192.7 16.7h6.6v6.6h-6.6zM192.7 24.7h6.6v6.6h-6.6zM192.7 32.7h6.6v6.6h-6.6zM192.7 40.7h6.6v6.6h-6.6zM192.7 48.7h6.6v6.6h-6.6zM200.7 48.7h6.6v6.6h-6.6zM208.7 48.7h6.6v6.6h-6.6zM216.7 48.7h6.6v6.6h-6.6zM224.7 48.7h6.6v6.6h-6.6z","vb":[0,0,232,56]},"drive":{"d":"M0.7 0.7h6.6v6.6h-6.6zM8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM32.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM32.7 16.7h6.6v6.6h-6.6zM0.7 24.7h6.6v6.6h-6.6zM32.7 24.7h6.6v6.6h-6.6zM0.7 32.7h6.6v6.6h-6.6zM32.7 32.7h6.6v6.6h-6.6zM0.7 40.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM0.7 48.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM48.7 0.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM56.7 24.7h6.6v6.6h-6.6zM64.7 24.7h6.6v6.6h-6.6zM72.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM64.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM72.7 40.7h6.6v6.6h-6.6zM48.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM112.7 8.7h6.6v6.6h-6.6zM112.7 16.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM112.7 32.7h6.6v6.6h-6.6zM112.7 40.7h6.6v6.6h-6.6zM104.7 48.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM120.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM176.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM176.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM176.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM176.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM176.7 32.7h6.6v6.6h-6.6zM152.7 40.7h6.6v6.6h-6.6zM168.7 40.7h6.6v6.6h-6.6zM160.7 48.7h6.6v6.6h-6.6zM192.7 0.7h6.6v6.6h-6.6zM200.7 0.7h6.6v6.6h-6.6zM208.7 0.7h6.6v6.6h-6.6zM216.7 0.7h6.6v6.6h-6.6zM224.7 0.7h6.6v6.6h-6.6zM192.7 8.7h6.6v6.6h-6.6zM192.7 16.7h6.6v6.6h-6.6zM192.7 24.7h6.6v6.6h-6.6zM200.7 24.7h6.6v6.6h-6.6zM208.7 24.7h6.6v6.6h-6.6zM216.7 24.7h6.6v6.6h-6.6zM192.7 32.7h6.6v6.6h-6.6zM192.7 40.7h6.6v6.6h-6.6zM192.7 48.7h6.6v6.6h-6.6zM200.7 48.7h6.6v6.6h-6.6zM208.7 48.7h6.6v6.6h-6.6zM216.7 48.7h6.6v6.6h-6.6zM224.7 48.7h6.6v6.6h-6.6z","vb":[0,0,232,56]},"morph":{"d":"M0.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM8.7 8.7h6.6v6.6h-6.6zM24.7 8.7h6.6v6.6h-6.6zM32.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM16.7 16.7h6.6v6.6h-6.6zM32.7 16.7h6.6v6.6h-6.6zM0.7 24.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM32.7 24.7h6.6v6.6h-6.6zM0.7 32.7h6.6v6.6h-6.6zM32.7 32.7h6.6v6.6h-6.6zM0.7 40.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM0.7 48.7h6.6v6.6h-6.6zM32.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM56.7 48.7h6.6v6.6h-6.6zM64.7 48.7h6.6v6.6h-6.6zM72.7 48.7h6.6v6.6h-6.6zM96.7 0.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM96.7 8.7h6.6v6.6h-6.6zM128.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM128.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM104.7 24.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM120.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM112.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM120.7 40.7h6.6v6.6h-6.6zM96.7 48.7h6.6v6.6h-6.6zM128.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM152.7 0.7h6.6v6.6h-6.6zM160.7 0.7h6.6v6.6h-6.6zM168.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM176.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM176.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM152.7 24.7h6.6v6.6h-6.6zM160.7 24.7h6.6v6.6h-6.6zM168.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6zM192.7 0.7h6.6v6.6h-6.6zM224.7 0.7h6.6v6.6h-6.6zM192.7 8.7h6.6v6.6h-6.6zM224.7 8.7h6.6v6.6h-6.6zM192.7 16.7h6.6v6.6h-6.6zM224.7 16.7h6.6v6.6h-6.6zM192.7 24.7h6.6v6.6h-6.6zM200.7 24.7h6.6v6.6h-6.6zM208.7 24.7h6.6v6.6h-6.6zM216.7 24.7h6.6v6.6h-6.6zM224.7 24.7h6.6v6.6h-6.6zM192.7 32.7h6.6v6.6h-6.6zM224.7 32.7h6.6v6.6h-6.6zM192.7 40.7h6.6v6.6h-6.6zM224.7 40.7h6.6v6.6h-6.6zM192.7 48.7h6.6v6.6h-6.6zM224.7 48.7h6.6v6.6h-6.6z","vb":[0,0,232,56]},"wah":{"d":"M0.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM32.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM32.7 16.7h6.6v6.6h-6.6zM0.7 24.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM32.7 24.7h6.6v6.6h-6.6zM0.7 32.7h6.6v6.6h-6.6zM16.7 32.7h6.6v6.6h-6.6zM32.7 32.7h6.6v6.6h-6.6zM0.7 40.7h6.6v6.6h-6.6zM8.7 40.7h6.6v6.6h-6.6zM24.7 40.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM0.7 48.7h6.6v6.6h-6.6zM32.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM56.7 24.7h6.6v6.6h-6.6zM64.7 24.7h6.6v6.6h-6.6zM72.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM48.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM96.7 0.7h6.6v6.6h-6.6zM128.7 0.7h6.6v6.6h-6.6zM96.7 8.7h6.6v6.6h-6.6zM128.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM128.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM104.7 24.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM120.7 24.7h6.6v6.6h-6.6zM128.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM128.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM128.7 40.7h6.6v6.6h-6.6zM96.7 48.7h6.6v6.6h-6.6zM128.7 48.7h6.6v6.6h-6.6z","vb":[0,0,136,56]},"comp":{"d":"M8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM32.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM0.7 24.7h6.6v6.6h-6.6zM0.7 32.7h6.6v6.6h-6.6zM0.7 40.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM56.7 48.7h6.6v6.6h-6.6zM64.7 48.7h6.6v6.6h-6.6zM72.7 48.7h6.6v6.6h-6.6zM96.7 0.7h6.6v6.6h-6.6zM128.7 0.7h6.6v6.6h-6.6zM96.7 8.7h6.6v6.6h-6.6zM104.7 8.7h6.6v6.6h-6.6zM120.7 8.7h6.6v6.6h-6.6zM128.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM112.7 16.7h6.6v6.6h-6.6zM128.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM128.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM128.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM128.7 40.7h6.6v6.6h-6.6zM96.7 48.7h6.6v6.6h-6.6zM128.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM152.7 0.7h6.6v6.6h-6.6zM160.7 0.7h6.6v6.6h-6.6zM168.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM176.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM176.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM152.7 24.7h6.6v6.6h-6.6zM160.7 24.7h6.6v6.6h-6.6zM168.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6z","vb":[0,0,184,56]},"eq":{"d":"M0.7 0.7h6.6v6.6h-6.6zM8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM0.7 24.7h6.6v6.6h-6.6zM8.7 24.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM24.7 24.7h6.6v6.6h-6.6zM0.7 32.7h6.6v6.6h-6.6zM0.7 40.7h6.6v6.6h-6.6zM0.7 48.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM32.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM64.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM72.7 40.7h6.6v6.6h-6.6zM56.7 48.7h6.6v6.6h-6.6zM64.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM104.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM104.7 24.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM120.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM128.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM128.7 40.7h6.6v6.6h-6.6zM104.7 48.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM120.7 48.7h6.6v6.6h-6.6z","vb":[0,0,136,56]},"gate":{"d":"M8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM32.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM0.7 24.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM24.7 24.7h6.6v6.6h-6.6zM32.7 24.7h6.6v6.6h-6.6zM0.7 32.7h6.6v6.6h-6.6zM32.7 32.7h6.6v6.6h-6.6zM0.7 40.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM32.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM56.7 24.7h6.6v6.6h-6.6zM64.7 24.7h6.6v6.6h-6.6zM72.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM48.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM96.7 0.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM128.7 0.7h6.6v6.6h-6.6zM112.7 8.7h6.6v6.6h-6.6zM112.7 16.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM112.7 32.7h6.6v6.6h-6.6zM112.7 40.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM152.7 0.7h6.6v6.6h-6.6zM160.7 0.7h6.6v6.6h-6.6zM168.7 0.7h6.6v6.6h-6.6zM176.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM152.7 24.7h6.6v6.6h-6.6zM160.7 24.7h6.6v6.6h-6.6zM168.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6zM152.7 48.7h6.6v6.6h-6.6zM160.7 48.7h6.6v6.6h-6.6zM168.7 48.7h6.6v6.6h-6.6zM176.7 48.7h6.6v6.6h-6.6z","vb":[0,0,184,56]},"scope":{"d":"M8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM32.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM8.7 24.7h6.6v6.6h-6.6zM16.7 24.7h6.6v6.6h-6.6zM24.7 24.7h6.6v6.6h-6.6zM32.7 32.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM0.7 48.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM56.7 48.7h6.6v6.6h-6.6zM64.7 48.7h6.6v6.6h-6.6zM72.7 48.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM96.7 8.7h6.6v6.6h-6.6zM128.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM128.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM128.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM128.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM128.7 40.7h6.6v6.6h-6.6zM104.7 48.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM120.7 48.7h6.6v6.6h-6.6zM144.7 0.7h6.6v6.6h-6.6zM152.7 0.7h6.6v6.6h-6.6zM160.7 0.7h6.6v6.6h-6.6zM168.7 0.7h6.6v6.6h-6.6zM144.7 8.7h6.6v6.6h-6.6zM176.7 8.7h6.6v6.6h-6.6zM144.7 16.7h6.6v6.6h-6.6zM176.7 16.7h6.6v6.6h-6.6zM144.7 24.7h6.6v6.6h-6.6zM152.7 24.7h6.6v6.6h-6.6zM160.7 24.7h6.6v6.6h-6.6zM168.7 24.7h6.6v6.6h-6.6zM144.7 32.7h6.6v6.6h-6.6zM144.7 40.7h6.6v6.6h-6.6zM144.7 48.7h6.6v6.6h-6.6zM192.7 0.7h6.6v6.6h-6.6zM200.7 0.7h6.6v6.6h-6.6zM208.7 0.7h6.6v6.6h-6.6zM216.7 0.7h6.6v6.6h-6.6zM224.7 0.7h6.6v6.6h-6.6zM192.7 8.7h6.6v6.6h-6.6zM192.7 16.7h6.6v6.6h-6.6zM192.7 24.7h6.6v6.6h-6.6zM200.7 24.7h6.6v6.6h-6.6zM208.7 24.7h6.6v6.6h-6.6zM216.7 24.7h6.6v6.6h-6.6zM192.7 32.7h6.6v6.6h-6.6zM192.7 40.7h6.6v6.6h-6.6zM192.7 48.7h6.6v6.6h-6.6zM200.7 48.7h6.6v6.6h-6.6zM208.7 48.7h6.6v6.6h-6.6zM216.7 48.7h6.6v6.6h-6.6zM224.7 48.7h6.6v6.6h-6.6z","vb":[0,0,232,56]}};
    TAGS.cab = { d: "M8.7 0.7h6.6v6.6h-6.6zM16.7 0.7h6.6v6.6h-6.6zM24.7 0.7h6.6v6.6h-6.6zM0.7 8.7h6.6v6.6h-6.6zM32.7 8.7h6.6v6.6h-6.6zM0.7 16.7h6.6v6.6h-6.6zM0.7 24.7h6.6v6.6h-6.6zM0.7 32.7h6.6v6.6h-6.6zM0.7 40.7h6.6v6.6h-6.6zM32.7 40.7h6.6v6.6h-6.6zM8.7 48.7h6.6v6.6h-6.6zM16.7 48.7h6.6v6.6h-6.6zM24.7 48.7h6.6v6.6h-6.6zM56.7 0.7h6.6v6.6h-6.6zM64.7 0.7h6.6v6.6h-6.6zM72.7 0.7h6.6v6.6h-6.6zM48.7 8.7h6.6v6.6h-6.6zM80.7 8.7h6.6v6.6h-6.6zM48.7 16.7h6.6v6.6h-6.6zM80.7 16.7h6.6v6.6h-6.6zM48.7 24.7h6.6v6.6h-6.6zM56.7 24.7h6.6v6.6h-6.6zM64.7 24.7h6.6v6.6h-6.6zM72.7 24.7h6.6v6.6h-6.6zM80.7 24.7h6.6v6.6h-6.6zM48.7 32.7h6.6v6.6h-6.6zM80.7 32.7h6.6v6.6h-6.6zM48.7 40.7h6.6v6.6h-6.6zM80.7 40.7h6.6v6.6h-6.6zM48.7 48.7h6.6v6.6h-6.6zM80.7 48.7h6.6v6.6h-6.6zM96.7 0.7h6.6v6.6h-6.6zM104.7 0.7h6.6v6.6h-6.6zM112.7 0.7h6.6v6.6h-6.6zM120.7 0.7h6.6v6.6h-6.6zM96.7 8.7h6.6v6.6h-6.6zM128.7 8.7h6.6v6.6h-6.6zM96.7 16.7h6.6v6.6h-6.6zM128.7 16.7h6.6v6.6h-6.6zM96.7 24.7h6.6v6.6h-6.6zM104.7 24.7h6.6v6.6h-6.6zM112.7 24.7h6.6v6.6h-6.6zM120.7 24.7h6.6v6.6h-6.6zM96.7 32.7h6.6v6.6h-6.6zM128.7 32.7h6.6v6.6h-6.6zM96.7 40.7h6.6v6.6h-6.6zM128.7 40.7h6.6v6.6h-6.6zM96.7 48.7h6.6v6.6h-6.6zM104.7 48.7h6.6v6.6h-6.6zM112.7 48.7h6.6v6.6h-6.6zM120.7 48.7h6.6v6.6h-6.6z", vb: [0, 0, 136, 56] };
    function mountTags() {
      var defs = document.createElement("div");
      defs.setAttribute("aria-hidden", "true"); defs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
      defs.innerHTML = '<svg width="0" height="0"><defs><pattern id="fxscan" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="4.6" fill="#fff"/></pattern><mask id="fxscanm" maskUnits="userSpaceOnUse" x="-1000" y="-1000" width="3000" height="3000"><rect x="-1000" y="-1000" width="3000" height="3000" fill="url(#fxscan)"/></mask></defs></svg>';
      document.body.appendChild(defs);
      IDS.forEach(function (id) {
        var sec = document.getElementById("ped-" + id), T = TAGS[id]; if (!sec || !T) return;
        var head = sec.querySelector(".bp-head"), h2 = head && head.querySelector(".bp-title"); if (!h2 || head.querySelector(".tag")) return;
        var vb = T.vb, cid = "tg" + id, p = '<path d="' + T.d + '"/>';
        var el = document.createElement("div"); el.className = "tag"; el.setAttribute("aria-hidden", "true");
        el.innerHTML = '<svg viewBox="' + vb.join(" ") + '" style="aspect-ratio:' + f1(vb[2] / vb[3]) + '" shape-rendering="crispEdges"><path d="' + T.d + '" fill="#101114"/><rect x="' + f1(vb[2] + 8) + '" y="' + f1(vb[3] - 6.6) + '" width="6.6" height="6.6" fill="' + RED + '"/></svg>';
        head.insertBefore(el, head.firstChild); h2.classList.add("sr");
      });
    }
    mountTags();
    (function () {
      var sec = document.getElementById("ped-eq"); if (!sec) return;
      var ind = sec.querySelector(":scope > .ind"), eqc = sec.querySelector(".eqc"); if (!ind || !eqc) return;
      var d = document.createElement("div"); d.className = "oled"; ind.parentNode.insertBefore(d, ind); d.appendChild(ind); d.appendChild(eqc);
    })();
    OLED.forEach(mountOled); requestAnimationFrame(oledLoop);

    (function () {
      var lab = document.createElement("label"), inp = document.createElement("input"), last = 0, down = false;
      inp.type = "checkbox"; inp.setAttribute("switch", ""); lab.appendChild(inp);
      lab.setAttribute("aria-hidden", "true"); lab.style.cssText = "position:fixed;left:-99px;top:-99px;width:1px;height:1px;opacity:0;pointer-events:none";
      document.body.appendChild(lab);
      function tick() {
        var n = Date.now(); if (n - last < 45) return; last = n;
        try { if (navigator.vibrate) navigator.vibrate(8); else lab.click(); } catch (e) {}
      }
      document.addEventListener("pointerdown", function (e) { down = true; if (e.target.closest && e.target.closest("button,.fs,.tgl-labels,[role=switch]")) tick(); }, true);
      document.addEventListener("pointerup", function () { down = false; }, true);
      document.addEventListener("pointercancel", function () { down = false; }, true);
      var wrap = document.querySelector(".wrap") || document.body, seen = new WeakMap();
      new MutationObserver(function (ms) {
        if (!down) return;
        ms.forEach(function (m) { var el = m.target, v = parseFloat(el.getAttribute("aria-valuenow")), mn = parseFloat(el.getAttribute("aria-valuemin")), mx = parseFloat(el.getAttribute("aria-valuemax")); if (isNaN(v) || isNaN(mx) || mx === mn) return; var q = Math.round((v - mn) / (mx - mn) * 20), p = seen.get(el); seen.set(el, q); if (p !== undefined && p !== q) tick(); });
      }).observe(wrap, { subtree: true, attributes: true, attributeFilter: ["aria-valuenow"] });
    })();

    function collect(sec) {
      var sr = sec.getBoundingClientRect(), avoid = [], text = [], haze = [], i;
      function box(b) { var S = window.__fitS || 1; return { x: (b.left - sr.left) / S, y: (b.top - sr.top) / S, w: b.width / S, h: b.height / S }; }
      function vis(q) { return q.w > 1 && q.h > 1 && q.y < sr.height + 2000; }
      function R(el) { return box(el.getBoundingClientRect()); }
      function T(el) { var rg = document.createRange(); rg.selectNodeContents(el); return box(rg.getBoundingClientRect()); }
      function addText(q, pad) { if (vis(q)) { avoid.push([q.x, q.y, q.w, q.h, pad]); text.push(q); haze.push(q); } }
      [].forEach.call(sec.querySelectorAll(".knob"), function (k) {
        var q = R(k); if (!vis(q)) return;
        avoid.push([q.x, q.y, q.w, q.h, 3]); haze.push({ x: q.x - 3, y: q.y - 3, w: q.w + 6, h: q.h + 6, round: 1 }); text.push(q);
      });
      [].forEach.call(sec.querySelectorAll(".name,.sub,.bp-title,.bp-sub,.rowcap,.advlab,legend,.padlab,.tp span,.screen-foot span,.tilescap,.tiles-cap,.tgl-labels button,.key,.radio,.status,.fd .name,.fd .sub"), function (el) {
        if (el.closest(".window,.vu,.eqc,.scr,.ind")) return;
        if (!el.textContent.trim() && !el.matches(".key,.radio")) return;
        addText(el.matches(".key,.radio,.tgl-labels button,.status") ? R(el) : T(el), 7);
      });
      [].forEach.call(sec.querySelectorAll(".window,.vu,.eqc,.scr,.ind,.oled,.hex,.tgl-sw,.selknob,.bpm,.fd .ftrack,.fled,.tuner,.tools,.bar,.tiles,.stage,.fswrap .led,.jacks"), function (el) {
        var q = R(el); if (vis(q)) avoid.push([q.x, q.y, q.w, q.h, 5]);
      });
      [].forEach.call(sec.querySelectorAll(".tuner"), function (el) {
        var q = R(el); if (vis(q)) { haze.push({ x: q.x - 6, y: q.y - 6, w: q.w + 12, h: q.h + 12 }); haze.push({ x: q.x - 6, y: q.y - 6, w: q.w + 12, h: q.h + 12 }); }
      });
      [].forEach.call(sec.querySelectorAll(".bp-head .tag, .bp-head p, .bp-head .sub, .bp-head .bp-sub"), function (el) { var q = R(el); if (q.w > 2) avoid.push([q.x, q.y, q.w, q.h, 8]); });
      return { avoid: avoid, text: text, haze: haze, w: sr.width, h: sr.height };
    }

    function pcb(W, H, r, id, AV) {
      AV = AV || [];
      function clear(x, y, w, h, m) { for (var k = 0; k < AV.length; k++) { var a = AV[k], p = (a[4] || 0) + (m || 0); if (x < a[0] + a[2] + p && x + w > a[0] - p && y < a[1] + a[3] + p && y + h > a[1] - p) return false; } return true; }
      var TR = "#9aa2ad", PD = "#939ba6", g = "", i, area = W * H / 200000;
      function ri(a, b) { return a + Math.floor(r() * (b - a + 1)); }
      function P(pts) { return "M" + pts.map(function (p) { return f1(p[0]) + " " + f1(p[1]); }).join("L"); }
      function off(pts, d) { return pts.map(function (p, k) { var a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dy / l * d, p[1] + dx / l * d]; }); }
      function bus(x, y, n, steps, dir) {
        var c = [[x, y]], i2;
        for (i2 = 0; i2 < steps; i2++) {
          var len = i2 % 2 === 0 ? ri(60, 170) : ri(16, 40), vx = i2 % 2 === 0 ? dir[0] : dir[0] + (dir[0] === 0 ? (r() < 0.5 ? 1 : -1) : 0), vy = i2 % 2 === 0 ? dir[1] : dir[1] + (dir[1] === 0 ? (r() < 0.5 ? 1 : -1) : 0), last = c[c.length - 1], k = i2 % 2 === 0 ? 1 : 0.7071;
          c.push([last[0] + vx * len * k, last[1] + vy * len * k]);
        }
        for (var j = 0; j < n; j++) {
          var o = off(c, (j - (n - 1) / 2) * 4.6);
          g += '<path d="' + P(o) + '" fill="none" stroke="' + TR + '" stroke-width="1.7" stroke-linejoin="round"/>';
          var e = o[o.length - 1], s0 = o[0];
          g += '<circle cx="' + f1(e[0]) + '" cy="' + f1(e[1]) + '" r="2.3" fill="none" stroke="' + PD + '" stroke-width="1.2"/>';
          if (r() < 0.5) g += '<circle cx="' + f1(s0[0]) + '" cy="' + f1(s0[1]) + '" r="1.7" fill="' + PD + '"/>';
        }
      }
      var nT = Math.max(3, Math.round(W / 105)), nS = Math.max(4, Math.round(H / 120));
      for (i = 0; i < nT; i++) { bus(ri(20, W - 20), 0, ri(3, 7), 5, [0, 1]); bus(ri(20, W - 20), H, ri(3, 7), 5, [0, -1]); }
      for (i = 0; i < nS; i++) { bus(0, ri(20, H - 20), ri(3, 7), 5, [1, 0]); bus(W, ri(20, H - 20), ri(3, 7), 5, [-1, 0]); }
      for (i = 0; i < Math.round(area * 60); i++) g += '<circle cx="' + ri(8, W - 8) + '" cy="' + ri(8, H - 8) + '" r="' + (r() < 0.3 ? 2.2 : 1.5) + '" fill="none" stroke="' + PD + '" stroke-width="1"/>';
      var chips = [], tries = 0, nC = Math.min(9, 3 + Math.round(area * 1.6));
      while (chips.length < nC && tries++ < 80) {
        var cw = ri(30, 54), ch = ri(r() < 0.3 ? 12 : 30, 54), cx = ri(10, W - cw - 10), cy = ri(10, H - ch - 10), ok = true;
        if (!clear(cx - 4, cy - 4, cw + 8, ch + 8, 6)) ok = false;
        chips.forEach(function (q) { if (cx < q[0] + q[2] + 16 && cx + cw + 16 > q[0] && cy < q[1] + q[3] + 16 && cy + ch + 16 > q[1]) ok = false; });
        if (!ok) continue;
        chips.push([cx, cy, cw, ch]);
        g += '<rect x="' + cx + '" y="' + cy + '" width="' + cw + '" height="' + ch + '" rx="2.5" fill="#eef0f3" stroke="' + TR + '" stroke-width="1.3"/>';
        for (var p = 5; p < cw - 3; p += 6.5) g += '<path d="M' + (cx + p) + " " + (cy - 3.5) + "v3.5M" + (cx + p) + " " + (cy + ch) + 'v3.5" stroke="' + TR + '" stroke-width="1.3"/>';
        if (ch > 20) for (p = 5; p < ch - 3; p += 6.5) g += '<path d="M' + (cx - 3.5) + " " + (cy + p) + "h3.5M" + (cx + cw) + " " + (cy + p) + 'h3.5" stroke="' + TR + '" stroke-width="1.3"/>';
        g += '<circle cx="' + (cx + 5) + '" cy="' + (cy + 5) + '" r="1.6" fill="' + TR + '"/><text x="' + (cx + cw / 2) + '" y="' + (cy + ch / 2 + 2.2) + '" text-anchor="middle" font-size="6.5" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#8d949e">' + ["ZN-", "DSP-", "MX-", "OP-"][ri(0, 3)] + ri(1, 9) + ri(0, 9) + "</text>";
      }
      for (i = 0; i < Math.round(area * 16); i++) { var vv = r() < 0.5, rx = ri(10, W - 20), ry = ri(10, H - 20); if (!clear(rx - 2, ry - 2, 15, 15, 4)) continue; g += '<rect x="' + rx + '" y="' + ry + '" width="' + (vv ? 5 : 11) + '" height="' + (vv ? 11 : 5) + '" rx="1" fill="#dfe2e6" stroke="' + TR + '" stroke-width="1"/>'; }
      function tx(x, y, t, rot) { if (rot ? !clear(x - 6, y - t.length * 4, 12, t.length * 4.2, 4) : !clear(x - 2, y - 8, t.length * 4.2, 11, 4)) return; g += '<text x="' + x + '" y="' + y + '" font-size="6.4" font-family="ui-monospace,Menlo,Consolas,monospace" letter-spacing=".6" fill="#4f5762"' + (rot ? ' transform="rotate(' + rot + " " + x + " " + y + ')"' : "") + ">" + t + "</text>"; }
      tx(13, H - 22, "LOOM " + NAME[id] + "  REV C", -90);
      var L = ["R101  R102  C21  C22  L3", "U7 / U8   PWR-IN   GND", "TP1  TP2  TP3", "J4  CN-FFC 16P", "+ - + -  GND  +9V"];
      for (i = 0; i < Math.round(3 + area * 3); i++) tx(ri(8, Math.max(9, W - 110)), ri(14, H - 8), L[ri(0, L.length - 1)], r() < 0.25 ? -90 : 0);
      return g;
    }

    function Rast(c, rw) { c = Math.max(1, c | 0); rw = Math.max(1, rw | 0); this.c = c; this.r = rw; this.a = new Uint8Array(c * rw); }
    Rast.prototype.set = function (x, y, v) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.c && y < this.r) this.a[y * this.c + x] = v || 1; };
    Rast.prototype.line = function (x0, y0, x1, y1, v) { var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1), i; for (i = 0; i <= n; i++) this.set(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, v); };
    Rast.prototype.ring = function (cx, cy, R, th, v) { var x, y; for (y = Math.floor(cy - R - th); y <= cy + R + th; y++) for (x = Math.floor(cx - R - th); x <= cx + R + th; x++) { if (Math.abs(Math.hypot(x - cx, y - cy) - R) <= th / 2) this.set(x, y, v); } };
    Rast.prototype.disc = function (cx, cy, R, v) { var x, y; for (y = Math.floor(cy - R); y <= cy + R; y++) for (x = Math.floor(cx - R); x <= cx + R; x++) if (Math.hypot(x - cx, y - cy) <= R) this.set(x, y, v); };
    Rast.prototype.path = function (cell, ox, oy, val) {
      var d = "", y, x;
      for (y = 0; y < this.r; y++) for (x = 0; x < this.c; x++) {
        if (this.a[y * this.c + x] !== val) continue;
        var x2 = x; while (x2 + 1 < this.c && this.a[y * this.c + x2 + 1] === val) x2++;
        d += "M" + f1(ox + x * cell) + " " + f1(oy + y * cell) + "h" + (x2 - x + 1) * cell + "v" + cell + "h" + -(x2 - x + 1) * cell + "z"; x = x2;
      }
      return d;
    };
    function pixDisplay(x, y, w, h, fill) {
      var g = '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" rx="10" fill="#070708" stroke="#c3c7cd" stroke-width="2"/><rect x="' + f1(x - 2) + '" y="' + f1(y - 2) + '" width="' + f1(w + 4) + '" height="' + f1(h + 4) + '" rx="12" fill="none" stroke="#7e848d" stroke-width="1"/>';
      g += '<rect x="' + f1(x + 6) + '" y="' + f1(y + 6) + '" width="' + f1(w - 12) + '" height="' + f1(h - 12) + '" fill="' + ref("u") + '"/>';
      g += fill;
      g += '<rect x="' + f1(x + 6) + '" y="' + f1(y + 6) + '" width="' + f1(w - 12) + '" height="' + f1(h - 12) + '" fill="' + ref("m") + '"/>';
      return g;
    }
    function gateFill(DW, DH, ph) {
      var cols = Math.floor((DW - 12) / 3), rows = Math.floor((DH - 12) / 3), mid = Math.floor(rows / 2), ra = new Rast(cols, rows), rr = rnd(77), px = 0, py = mid, x, sh = Math.floor(ph * cols);
      for (x = 0; x < cols; x += 4) { ra.set(x, mid, 1); }
      for (x = 0; x < cols; x++) { if (x % 5 < 3) { ra.set(x, mid - 8, 1); ra.set(x, mid + 8, 1); } }
      var noise = []; for (x = 0; x < cols; x++) noise.push(rr() * 2 - 1);
      for (x = 0; x < cols; x++) {
        var xx = (x + sh) % cols, t = xx / cols, hiss = t < 0.28 ? 2 : t < 0.34 ? 2 * (0.34 - t) / 0.06 : t > 0.72 ? 1 : 0.5, env = t > 0.3 && t < 0.7 ? Math.sin(Math.PI * (t - 0.3) / 0.4) : 0;
        var vy = Math.round(mid + env * 13 * Math.sin(t * 150) + noise[xx] * hiss);
        if (x) ra.line(px, py, x, vy, 1); px = x; py = vy;
      }
      ra.line(2, mid - 8, 2, mid + 8, 2);
      return '<path d="' + ra.path(3, 0, 0, 1) + '" fill="#fff"/><path d="' + ra.path(3, 0, 0, 2) + '" fill="' + RED + '"/>';
    }
    function tapeFill(S, ph) {
      var cols = Math.floor((S.w - 12) / 3), rows = Math.floor((S.h - 12) / 3), ra = new Rast(cols, rows), R = rows * 0.3, ly = rows * 0.46, lx = cols * 0.27, rx = cols * 0.73, hy = rows * 0.84, i;
      function reel(cx, cy, pack, rot) {
        ra.ring(cx, cy, pack, 1.3, 1); ra.ring(cx, cy, R, 1.3, 1); ra.disc(cx, cy, R * 0.28, 1);
        for (var k = 0; k < 3; k++) { var a = rot + k * 2.094; ra.line(cx + Math.cos(a) * R * 0.3, cy + Math.sin(a) * R * 0.3, cx + Math.cos(a) * R * 0.95, cy + Math.sin(a) * R * 0.95, 1); }
      }
      reel(lx, ly, R * 0.98, 0.3 - ph * 6.283 * 2); reel(rx, ly, R * 0.62, 1.1 - ph * 6.283 * 3);
      ra.line(lx - R * 0.98, ly, lx - R * 0.98, hy, 1); ra.line(lx - R * 0.98, hy, cols * 0.42, hy, 1); ra.line(cols * 0.58, hy, rx + R * 0.62, hy, 1); ra.line(rx + R * 0.62, hy, rx + R * 0.62, ly, 1);
      for (i = 0; i < 4; i++) for (var j = 0; j < 4; j++) ra.set(cols * 0.5 - 2 + i, hy - 5 + j, 2);
      ra.disc(cols * 0.42, hy - 1, 1.6, 2); ra.disc(cols * 0.58, hy - 1, 1.6, 2);
      for (i = 0; i < 14; i++) { var tx2 = 6 + i * (cols - 12) / 13 - ((ph * 6 * (cols - 12) / 13) % ((cols - 12) / 13)); if (tx2 < 4) tx2 += (cols - 12); ra.line(tx2, rows - 2, tx2, rows - (i % 5 === 0 ? 5 : 3), 1); }
      return '<path d="' + ra.path(3, 0, 0, 1) + '" fill="#fff"/><path d="' + ra.path(3, 0, 0, 2) + '" fill="' + RED + '"/>';
    }
    var BOARD = "";
    function boardUrl() {
      if (BOARD) return BOARD;
      var W = 430, H = 1500, saved = UID; UID = "-sb";
      var g = pcb(W, H, rnd(20260), "drive", []); UID = saved;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + g + "</svg>";
      BOARD = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
      return BOARD;
    }
    function renderOne(id) {
      var sec = document.getElementById("ped-" + id); if (!sec) return;
      var w = sec.offsetWidth, h = sec.offsetHeight; if (!w || !h) return;
      var pl = sec.querySelector(":scope > .plate");
      if (!pl) { pl = document.createElement("div"); pl.className = "plate"; pl.setAttribute("aria-hidden", "true"); sec.insertBefore(pl, sec.firstChild); }
      var key = w + "x" + h + "@" + (window.__fitS || 1); if (pl.dataset.k === key) return; pl.dataset.k = key;
      UID = "-" + id;
      var r = rnd(hid(id)), defs = "", svg = "", i;
      defs += '<filter id="' + u("pb") + '" x="0" y="0" width="100%" height="100%"><feGaussianBlur stdDeviation=".75"/></filter><filter id="' + u("n") + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .30  0 0 0 0 .33  0 0 0 0 .38  1.1 0 0 0 -.46"/></filter>';
      defs += '<linearGradient id="' + u("f") + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".40"/><stop offset=".55" stop-color="#fbfcfd" stop-opacity=".34"/><stop offset="1" stop-color="#f3f5f7" stop-opacity=".40"/></linearGradient>';
      defs += '<linearGradient id="' + u("g") + '" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".22" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".16"/><stop offset=".84" stop-color="#fff" stop-opacity="0"/></linearGradient>';
      defs += '<filter id="' + u("b") + '" filterUnits="userSpaceOnUse" x="-20" y="-20" width="' + (w + 40) + '" height="' + (h + 40) + '"><feGaussianBlur stdDeviation="4"/></filter>';
      defs += '<pattern id="' + u("u") + '" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#070708"/><circle cx="1.5" cy="1.5" r="1.05" fill="#1b1c20"/></pattern>';
      defs += '<pattern id="' + u("m") + '" width="3" height="3" patternUnits="userSpaceOnUse"><path fill-rule="evenodd" d="M0 0h3v3h-3zM1.5 .65a.85 .85 0 1 0 0 1.7a.85 .85 0 1 0 0 -1.7z" fill="#050506"/></pattern>';
      pl.style.backgroundImage = boardUrl();
      svg += '<rect width="' + w + '" height="' + h + '" fill="#fff" fill-opacity=".22"/>';
      svg += '<rect width="' + w + '" height="' + h + '" fill="' + ref("f") + '"/><rect width="' + w + '" height="' + h + '" fill="' + ref("g") + '"/>';
      [[13, 13], [w - 13, 13], [13, h - 13], [w - 13, h - 13]].forEach(function (p, k) {
        var a = (r() * 180).toFixed(0);
        svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#b7bcc3" stroke="#6d737d" stroke-width="1"/><circle cx="' + (p[0] - 1) + '" cy="' + (p[1] - 1.2) + '" r="4.6" fill="#e9ecef"/><rect x="' + (p[0] - 4) + '" y="' + (p[1] - 1) + '" width="8" height="2" rx="1" fill="#3d3f46" transform="rotate(' + a + " " + p[0] + " " + p[1] + ')"/>';
      });
      pl.innerHTML = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + "</defs>" + svg + "</svg>";
    }

    var T0 = 0;
    function renderAll() { cancelAnimationFrame(T0); T0 = requestAnimationFrame(function () { IDS.forEach(renderOne); }); }
    function redraw() { IDS.forEach(function (id) { var pl = document.querySelector("#ped-" + id + " > .plate"); if (pl) pl.dataset.k = ""; }); renderAll(); }
    IDS.forEach(function (id) {
      var sec = document.getElementById("ped-" + id); if (!sec) return;
      ["a", "b", "c"].forEach(function (k2) { if (id === "grain" || id === "reverb") { var j = document.createElement("i"); j.className = "jk " + k2; sec.appendChild(j); } });
    });
    if (window.ResizeObserver) { var ro = new ResizeObserver(renderAll); IDS.forEach(function (id) { var sec = document.getElementById("ped-" + id); if (sec) ro.observe(sec); }); }
    window.addEventListener("resize", renderAll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
    renderAll();
  })();

  (function () {
    var b = document.getElementById("bodyMode"); if (!b) return;
    function set(on, save) { document.body.classList.toggle("tint", on); b.textContent = "Body: " + (on ? "tint" : "white"); b.setAttribute("aria-pressed", String(on)); if (save) { try { localStorage.setItem("loom.tint", on ? "1" : "0"); } catch (e) {} } }
    var st = null; try { st = localStorage.getItem("loom.tint"); } catch (e) {}
    set(st === "1", false);
    b.addEventListener("click", function () { set(!document.body.classList.contains("tint"), true); });
  })();

  (function () {
    var b = document.getElementById("viewMode"); if (!b) return;
    var MODES = ["full", "simple"];
    function set(m, save) {
      var on = m === "simple"; document.body.classList.toggle("lite", on); if (window.__setSolid) window.__setSolid(on);
      b.textContent = "Screens: " + m; b.setAttribute("aria-pressed", String(m === "simple")); b.dataset.m = m;
      if (save) { try { localStorage.setItem("loom.view", m); } catch (e) {} }
      if (m === "simple") fill();
    }
    function cells(sec) {
      var out = [], i, ks = sec.querySelectorAll(".kw .knob");
      for (i = 0; i < ks.length && out.length < 3; i++) out.push({ n: (ks[i].getAttribute("aria-label") || "").toUpperCase(), v: String(ks[i].getAttribute("aria-valuetext") || ks[i].getAttribute("aria-valuenow") || "").toUpperCase() });
      if (!out.length) { var fs = sec.querySelectorAll(".fd"); for (i = 0; i < fs.length && out.length < 3; i++) out.push({ n: ((fs[i].querySelector(".name") || {}).textContent || "").toUpperCase(), v: ((fs[i].querySelector(".sub") || {}).textContent || "").toUpperCase() }); }
      return out;
    }
    function fill() {
      var sec = document.querySelector(".pedal.cur"); if (!sec) return; var id = sec.id.slice(4); if (id === "grain" || id === "scope") return;
      var gw = sec.querySelector(".oled .gw"); if (!gw) return; var dg = gw.querySelector(".dg");
      if (!dg) { dg = document.createElement("div"); dg.className = "dg"; gw.appendChild(dg); }
      var cs = cells(sec), key = cs.map(function (c) { return c.n + "|" + c.v; }).join(";");
      if (dg.__k === key) return; dg.__k = key;
      dg.innerHTML = cs.map(function (c) { return '<div class="dc"><span class="dv">' + c.v + '</span><span class="dn">' + c.n + '</span></div>'; }).join("");
    }
    setInterval(function () { if (document.body.classList.contains("digits") && !document.hidden) fill(); }, 200);
    var st = null; try { st = localStorage.getItem("loom.view"); if (!st) { var o = localStorage.getItem("fxter.view"); st = (o === "clean" || o === "digits") ? "simple" : null; } } catch (e) {}
    set(MODES.indexOf(st) >= 0 ? st : "full", false);
    b.addEventListener("click", function () { set(MODES[(MODES.indexOf(b.dataset.m) + 1) % 2], true); });
  })();
  placeSlots(); commitOrder(false); boardSync(); paintModes();

  var SLOT_KEY = "grainpedal.slots.v1", slots = [null, null, null, null], saveMode = false, SAVE_IDS = [], CFG = {};
  [].concat(K1, [KMASTER, KLOOP], K2, K3, KB_ALL).forEach(function (c) { SAVE_IDS.push(c.id); CFG[c.id] = c; });
  try { var raw = localStorage.getItem(SLOT_KEY); if (raw) { var arr = JSON.parse(raw); if (Array.isArray(arr)) for (var q = 0; q < 4; q++) slots[q] = arr[q] || null; } } catch (e) {}
  function persist() { try { localStorage.setItem(SLOT_KEY, JSON.stringify(slots)); } catch (e) {} }
  function snapshot() { var o = { rtype: P.rtype, revOn: P.revOn, __chain: { order: B.order.slice(), on: JSON.parse(JSON.stringify(B.on)), rev: !!P.revOn } }; SAVE_IDS.forEach(function (id) { o[id] = P[id]; }); return o; }
  function restore(o) {
    if (!TMAP[o.rtype]) return;
    selectType(o.rtype, false);
    SAVE_IDS.forEach(function (id) { var c = CFG[id]; if (typeof o[id] === "number" && isFinite(o[id])) setParam(id, Math.min(c.max, Math.max(c.min, o[id]))); });
    var ch = o.__chain;
    if (ch && Array.isArray(ch.order) && ch.order.length === B.order.length && B.order.every(function (id) { return ch.order.indexOf(id) >= 0; })) {
      B.order = ch.order.slice(); placeSlots(); commitOrder(false);
      Object.keys(B.on).forEach(function (id) { if (ch.on && typeof ch.on[id] === "boolean" && B.on[id] !== ch.on[id]) setOn(id, ch.on[id]); });
      if (typeof ch.rev === "boolean") setOn("reverb", ch.rev);
    }
  }
  var slotBtns = [], saveBtn = document.getElementById("saveMode"), slotInfo = document.getElementById("slotInfo");
  function slotUI() {
    slotBtns.forEach(function (b, i) { b.classList.toggle("saved", !!slots[i]); });
    sceneBtns.forEach(function (b, i) { b.classList.toggle("saved", !!slots[i]); });
    if (sceneSave) sceneSave.setAttribute("aria-pressed", String(saveMode));
    saveBtn.setAttribute("aria-pressed", String(saveMode));
    slotInfo.textContent = saveMode ? "pick a slot to save" : "press a slot";
  }
  var sceneBtns = [], sceneSave = null;
  function slotAct(i, shift) {
    if (saveMode || shift) { slots[i] = snapshot(); persist(); saveMode = false; slotUI(); setStatus("Saved to slot " + (i + 1) + "."); showDisplay("Slot " + (i + 1), "Saved"); chainNote.textContent = "Scene " + (i + 1) + " saved: order, bypasses and knobs."; }
    else if (slots[i]) { restore(slots[i]); clearPreset(); slotUI(); setStatus("Loaded slot " + (i + 1) + "."); showDisplay("Slot " + (i + 1), "Loaded"); chainNote.textContent = "Scene " + (i + 1) + " loaded."; }
    else { setStatus("Slot " + (i + 1) + " is empty. Press Save and pick a slot."); chainNote.textContent = "Scene " + (i + 1) + " is empty. Press Save, then a number."; }
  }
  for (var si = 0; si < 4; si++) (function (i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "key slotk"; b.innerHTML = '<span class="led"></span>' + (i + 1);
    b.setAttribute("aria-label", "Slot " + (i + 1));
    b.addEventListener("click", function (e) { slotAct(i, e.shiftKey); });
    document.getElementById("slots").appendChild(b); slotBtns.push(b);
    var sb = document.createElement("button"); sb.type = "button"; sb.textContent = i + 1; sb.setAttribute("aria-label", "Scene " + (i + 1));
    sb.addEventListener("click", function (e) { slotAct(i, e.shiftKey); }); window.__scenesRow.appendChild(sb); sceneBtns.push(sb);
  })(si);
  sceneSave = document.createElement("button"); sceneSave.type = "button"; sceneSave.className = "rec"; sceneSave.textContent = "Save"; sceneSave.setAttribute("aria-pressed", "false");
  sceneSave.addEventListener("click", function () { saveMode = !saveMode; slotUI(); }); window.__scenesRow.appendChild(sceneSave);
  saveBtn.addEventListener("click", function () { saveMode = !saveMode; slotUI(); });
  slotUI(); loopUI();

  var dkPlay = document.getElementById("dkPlay"), dkLive = document.getElementById("dkLive"), dkRec = document.getElementById("dkRec"), dkInfo = document.getElementById("dkInfo");
  var liveSrc = null, liveStream = null, mr = null, chunks = [], recStart = 0, recTick = 0;
  var dirGain = null;
  function startDirect() {
    if (!dirGain) { dirGain = ctx.createGain(); dirGain.connect(master); }
    window.__srcT0 = ctx.currentTime; var sn = srcLoop = ctx.createBufferSource(); sn.buffer = buf; sn.loop = !!window.__loopSrc; sn.connect(dirGain); sn.start();
    sn.onended = function () { if (srcLoop === sn && running) stop(); };
  }
  function ensureGraph() { ctx.resume(); if (!master) buildGraph(); }
  function paintPlay() { var on = playLed.classList.contains("on"); dkPlay.classList.toggle("on", on); dkPlay.setAttribute("aria-pressed", String(on)); dkPlay.textContent = on ? "■ Stop" : "▶ Play"; }
  dkPlay.addEventListener("click", function () { playBtn.click(); });
  document.getElementById("dkLoad").addEventListener("click", function () { document.getElementById("file").click(); });
  new MutationObserver(paintPlay).observe(playLed, { attributes: true, attributeFilter: ["class"] }); paintPlay();
  function liveOff() {
    if (liveSrc) { liveSrc.disconnect(); liveSrc = null; }
    if (liveStream) { liveStream.getTracks().forEach(function (t) { t.stop(); }); liveStream = null; }
    dkLive.classList.remove("on"); dkLive.setAttribute("aria-pressed", "false");
  }
  dkLive.addEventListener("click", function () {
    if (liveStream) { liveOff(); setStatus("Live input off."); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setStatus("Microphone unavailable: needs https (GitHub Pages works) and browser permission."); return; }
    ensureGraph();
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (st) {
      liveStream = st; liveSrc = ctx.createMediaStreamSource(st); liveSrc.connect(master);
      dkLive.classList.add("on"); dkLive.setAttribute("aria-pressed", "true");
      setStatus("Live input is on and runs through the active pedals. Use headphones or it will squeal.");
    }).catch(function () { setStatus("No microphone access. Allow it in browser settings."); });
  });
  dkRec.addEventListener("click", function () {
    if (mr && mr.state === "recording") { mr.stop(); return; }
    if (!window.MediaRecorder) { setStatus("This browser cannot record audio."); return; }
    ensureGraph();
    var types = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"], mt = types.filter(function (t) { return MediaRecorder.isTypeSupported(t); })[0] || "";
    chunks = []; mr = new MediaRecorder(recDest.stream, mt ? { mimeType: mt } : undefined);
    mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = function () {
      clearInterval(recTick); dkRec.classList.remove("on"); dkRec.setAttribute("aria-pressed", "false"); dkRec.textContent = "● Record";
      var type = mr.mimeType || mt || "audio/webm", ext = /mp4/.test(type) ? "m4a" : /ogg/.test(type) ? "ogg" : "webm";
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(chunks, { type: type })); a.download = "grain-pedal." + ext; a.textContent = "Download " + ext;
      dkInfo.textContent = ""; dkInfo.appendChild(a); a.click(); setStatus("Recording ready. If the file did not download, press Download on the right of the bar.");
    };
    mr.start(); recStart = Date.now(); dkInfo.textContent = ""; dkRec.classList.add("on"); dkRec.setAttribute("aria-pressed", "true");
    recTick = setInterval(function () { var sec = Math.floor((Date.now() - recStart) / 1000); dkRec.textContent = "■ " + Math.floor(sec / 60) + ":" + ("0" + sec % 60).slice(-2); }, 250);
    dkRec.textContent = "■ 0:00"; setStatus("Recording everything you hear. Press again to stop and save.");
  });

  var cur = "grain", pagerEl = document.getElementById("pager"), chainEl = document.querySelector(".chain"), dkPed = document.getElementById("dkPedals");
  function orderList() { return ["grain"].concat(B.order, ["scope"]); }
  function paintPager() {
    pagerEl.textContent = "";
    orderList().forEach(function (id) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", SLOT[id].name); b.title = SLOT[id].name;
      b.setAttribute("aria-selected", String(id === cur)); b.addEventListener("click", function () { var l = orderList(); showPedal(id, l.indexOf(id) > l.indexOf(cur) ? 1 : -1); });
      pagerEl.appendChild(b);
    });
  }
  function showPedal(id, dir) {
    cur = id;
    SLOTS.forEach(function (x) { document.getElementById(x.sec).classList.toggle("cur", x.id === id); });
    var el = document.getElementById(SLOT[id].sec); el.classList.remove("inl", "inr");
    if (dir) { void el.offsetWidth; el.classList.add(dir > 0 ? "inr" : "inl"); }
    paintPager(); window.scrollTo(0, 0);
    document.querySelector(".dock").className = "dock " + SLOT[id].theme; dkPed.className = "dkped " + SLOT[id].theme;
  }
  function stepPedal(d) { var l = orderList(), n = l.length; showPedal(l[(l.indexOf(cur) + d + n) % n], d); }
  var tx = 0, ty = 0, tt = 0, tok = false;
  document.addEventListener("touchstart", function (e) { var t = e.touches[0]; tok = e.touches.length === 1 && !e.target.closest(".knob, button, .tgl, .sel, .selknob, .cslot, .chain, .dock, .hex, .ftrack, .fcap, .tgl-sw, .tuner"); tx = t.clientX; ty = t.clientY; tt = Date.now(); }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (!tok) return; tok = false;
    var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy) && Date.now() - tt < 800) stepPedal(dx < 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener("keydown", function (e) { if (document.activeElement === document.body && !e.metaKey && !e.ctrlKey) { if (e.key === "ArrowRight") stepPedal(1); else if (e.key === "ArrowLeft") stepPedal(-1); } });
  function sheet(on) { if (!on) paintPager(); chainEl.classList.toggle("open", on); dkPed.setAttribute("aria-expanded", String(on)); }
  dkPed.addEventListener("click", function () { sheet(!chainEl.classList.contains("open")); });
  document.addEventListener("click", function (e) { if (e.isTrusted && chainEl.classList.contains("open") && !e.target.closest(".chain, #dkPedals")) sheet(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") sheet(false); });
  var gdx = 0, gdy = 0, gmv = false; rail.addEventListener("pointerdown", function (e) { gdx = e.clientX; gdy = e.clientY; gmv = false; }, true); rail.addEventListener("pointermove", function (e) { if (Math.abs(e.clientX - gdx) + Math.abs(e.clientY - gdy) > 8) gmv = true; }, true);
  rail.addEventListener("click", function (e) { if (e.target.closest(".cfs") || (e.target.closest(".cgrip") && gmv)) return; var c = e.target.closest(".cslot"); if (c) { showPedal(c.dataset.id, 0); sheet(false); } });
  showPedal("grain", 0);

  (function () {
    var root = document.documentElement, wrap = document.querySelector(".wrap");
    var BOARD_ON = true, winStart = -1, gap = 28;
    try { BOARD_ON = localStorage.getItem("loom.board") !== "0"; } catch (e) {}
    function setCls(el, c, on) { if (el.classList.contains(c) !== on) el.classList.toggle(c, on); }
    function fit() {
      var vw = window.innerWidth, vh = window.innerHeight, list = document.querySelectorAll(".wrap .pedal"), i, cur = document.querySelector(".wrap .pedal.cur");
      for (i = 0; i < list.length; i++) { list[i].style.marginBottom = ""; list[i].style.marginLeft = ""; list[i].style.marginRight = ""; }
      var old = window.__fitS || 1, bd = document.body;
      var bb = document.getElementById("boardMode"); if (bb) { bb.textContent = "Board: " + (BOARD_ON ? "multi" : "single"); bb.setAttribute("aria-pressed", String(BOARD_ON)); }
      function single() { for (i = 0; i < list.length; i++) setCls(list[i], "vis", false); setCls(bd, "board", false); }
      if (vw < 700) { single(); root.style.removeProperty("--fit"); root.style.removeProperty("--boardw"); window.__fitS = 1; if (old !== 1) window.dispatchEvent(new Event("resize")); return; }
      if (!cur) return;
      var cid = cur.id.slice(4), multi = BOARD_ON && vw >= 1000 && B.order.indexOf(cid) >= 0, w = 410, h, s, n = 1;
      if (!multi) {
        single();
        h = cur.offsetHeight; if (!h) return;
        w = Math.max(410, cur.offsetWidth || 410);
        s = Math.min((vh - 215) / h, (vw - 40) / (w + 40), 1.8);
        s = Math.max(0.7, Math.round(s * 100) / 100);
        root.style.setProperty("--fit", String(s));
        root.style.setProperty("--boardw", Math.min(vw - 16, Math.max(480, Math.round(w * s + 150 * Math.min(s, 1.3)))) + "px");
        cur.style.marginBottom = Math.round((s - 1) * h) + "px";
      } else {
        h = cur.offsetHeight; if (!h) return;
        s = Math.max(0.7, Math.round(Math.min((vh - 215) / h, 1.15) * 100) / 100);
        var ord = B.order, len = ord.length, ix = ord.indexOf(cid);
        n = Math.max(1, Math.min(len, Math.floor((vw - 60 + gap) / (w * s + gap))));
        var st = winStart;
        if (st < 0 || ix < st || ix >= st + n || st + n > len) st = Math.max(0, Math.min(len - n, ix - Math.floor((n - 1) / 2)));
        winStart = st;
        var vis = ord.slice(st, st + n);
        setCls(bd, "board", true);
        for (i = 0; i < list.length; i++) setCls(list[i], "vis", vis.indexOf(list[i].id.slice(4)) >= 0);
        root.style.setProperty("--fit", String(s));
        root.style.setProperty("--boardw", Math.min(vw - 8, Math.round(n * w * s + (n - 1) * gap + 90)) + "px");
        for (i = 0; i < list.length; i++) if (list[i].classList.contains("vis")) {
          list[i].style.marginBottom = Math.round((s - 1) * list[i].offsetHeight) + "px";
          list[i].style.marginLeft = list[i].style.marginRight = Math.round((s - 1) * w / 2) + "px";
        }
      }
      window.__fitS = s;
      if (Math.abs(old - s) > 0.001) window.dispatchEvent(new Event("resize"));
    }
    window.__fit = function () { clearTimeout(T); T = setTimeout(fit, 0); };
    wrap.addEventListener("pointerdown", function (e) {
      if (!document.body.classList.contains("board") || !e.isTrusted) return;
      var p = e.target.closest(".pedal"); if (p && !p.classList.contains("cur") && p.classList.contains("vis")) showPedal(p.id.slice(4), 0);
    }, true);
    (function () {
      var bb = document.getElementById("boardMode"); if (!bb) return;
      bb.addEventListener("click", function (e) { if (!e.isTrusted) return; BOARD_ON = !BOARD_ON; winStart = -1; try { localStorage.setItem("loom.board", BOARD_ON ? "1" : "0"); } catch (x) {} fit(); });
    })();
    var T; function later() { clearTimeout(T); T = setTimeout(fit, 30); }
    window.addEventListener("resize", later);
    if (window.ResizeObserver) new ResizeObserver(later).observe(wrap);
    if (window.MutationObserver) new MutationObserver(later).observe(wrap, { subtree: true, attributes: true, attributeFilter: ["class"] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    fit();
    // keyboard on a computer: space = play/stop, B = bypass the pedal on screen, 1-9/0 = jump to a pedal
    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
      if (e.key === " " && (tag === "BODY" || !tag)) { var pl = document.getElementById("play"); if (pl) { e.preventDefault(); pl.click(); } }
      else if ((e.key === "b" || e.key === "B") && document.activeElement === document.body) { var sl = document.querySelector(".chain .cslot[data-id=\"" + (document.querySelector(".wrap .pedal.cur") || {}).id.replace("ped-", "") + "\"] .cfs"); if (sl) sl.click(); }
      else if (/^[0-9]$/.test(e.key) && document.activeElement === document.body) { var pg = document.querySelectorAll("#pager button"), n = e.key === "0" ? 9 : +e.key - 1; if (pg[n]) pg[n].click(); }
    });
  })();

  selectType("plate", false);
  setBuffer(makeDemo(), "Guitar demo");
  setStatus("Press Play, load your own sound with the right pedal, then shape it with the pedals.");
  requestAnimationFrame(draw);
  document.addEventListener("visibilitychange", function () { if (document.hidden && running) stop(); });
})();
