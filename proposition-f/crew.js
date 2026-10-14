/* TO VOTE · Envol — l'équipage illustré, commun à toutes les pages.
   charSVG(k) renvoie le SVG d'un personnage (pnc | pnt | cadre | etam | sol) ; wave(svg) lui fait faire coucou.
   Classes à poser sur le SVG : .happy (saut de joie), .sad (non de la tête), .wave (coucou), .boop (petit rebond).
   Le SVG reste lisible sans CSS (export en image de la carte d'embarquement). */
(function () {
  var INK = '#140D8A', GOLD = '#F9C74F', GREEN = '#05CE78', PEACH = '#FF8867';
  var CHARS = {
    pnc: { skin: '#8D5524', hair: '#1d1350', outfit: INK },
    pnt: { skin: '#F1C27D', hair: '#7a5a2a', outfit: INK },
    cadre: { skin: '#E0AC69', hair: '#2b1a0e', outfit: '#0053FF' },
    etam: { skin: '#C68642', hair: '#3b2314', outfit: INK }
  };
  CHARS.sol = CHARS.etam;

  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    function f(v) { return Math.round(v * (1 - k)).toString(16).padStart(2, '0'); }
    return '#' + f(r) + f(g) + f(b);
  }

  /* Détails par métier : derrière la tête, coiffure, col et tenue, accessoires du visage, bras */
  function parts(k, c) {
    if (k === 'pnc') return {
      back: '<circle cx="137" cy="54" r="15" fill="' + c.hair + '"/><rect x="124" y="60" width="12" height="6" rx="3" fill="' + GREEN + '" transform="rotate(-35 130 63)"/>',
      top: '<path d="M62 86c-2-30 15-48 38-48s40 17 38 46c-6-14-18-23-34-25-12 8-26 14-42 27z" fill="' + c.hair + '"/><path d="M80 47c10-5 24-5 34 1" stroke="#fff" stroke-opacity=".22" stroke-width="3" fill="none" stroke-linecap="round"/>',
      outfit: '<path d="M83 138l17 24 17-24z" fill="#fff"/><path d="M81 140c11 10 27 10 38 0l-5 13c-8 7-20 7-28 0z" fill="' + GREEN + '"/><path d="M100 151l-11 19 8-2 3 8 3-8 8 2z" fill="' + GREEN + '"/><path d="M58 174q9-7 22-3q-10 3-14 7z" fill="' + GOLD + '"/><rect x="120" y="170" width="16" height="7" rx="2" fill="#fff"/>',
      face: '', cuff: ''
    };
    if (k === 'pnt') return {
      back: '',
      top: '<path d="M64 66c0 12 2 20 5 25V66zM136 66c0 12-2 20-5 25V66z" fill="' + c.hair + '"/><g transform="translate(0 -6)"><path d="M60 66c2-22 20-33 40-33s38 11 40 33z" fill="' + INK + '"/><path d="M70 44c8-6 18-8 28-8" stroke="#fff" stroke-opacity=".18" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="58" y="60" width="84" height="10" rx="5" fill="#0b0657"/><path d="M62 69q38 14 76 0l-1 6q-37 13-74 0z" fill="#0b0657"/><path d="M86 49q14-6 28 0l-3 5q-11-4-22 0z" fill="' + GOLD + '"/><circle cx="100" cy="46" r="4.5" fill="' + GOLD + '"/></g>',
      outfit: '<path d="M82 138l18 28 18-28z" fill="#fff"/><path d="M96 141h8l3 31-7 8-7-8z" fill="#0b0657"/><path d="M58 174q9-7 22-3q-10 3-14 7z" fill="' + GOLD + '"/><path d="M52 154l20-6M128 148l20 6" stroke="' + GOLD + '" stroke-width="4" stroke-linecap="round"/>',
      face: '', cuff: true
    };
    if (k === 'cadre') return {
      back: '',
      top: '<path d="M63 82c-4-28 13-46 37-46 23 0 39 15 38 40-6-10-14-17-25-19-10 7-30 12-50 25z" fill="' + c.hair + '"/><path d="M84 44c10-4 22-3 32 3" stroke="#fff" stroke-opacity=".2" stroke-width="3" fill="none" stroke-linecap="round"/>',
      outfit: '<path d="M80 138l20 34 20-34z" fill="#fff"/><path d="M97 143h6l3 25-6 8-6-8z" fill="' + PEACH + '"/><path d="M80 138l20 34-12-2-14-26zM120 138l-20 34 12-2 14-26z" fill="#0b3fbf"/><path d="M84 141l-14 31" stroke="' + GREEN + '" stroke-width="2.5"/><rect x="62" y="171" width="17" height="22" rx="3" fill="#fff"/><rect x="65" y="175" width="11" height="5" rx="1.5" fill="' + GREEN + '"/>',
      face: '<g fill="#fff" fill-opacity=".18" stroke="' + INK + '" stroke-width="3"><rect x="76" y="77" width="22" height="18" rx="7"/><rect x="102" y="77" width="22" height="18" rx="7"/></g><path d="M98 85h4" stroke="' + INK + '" stroke-width="3"/>',
      cuff: ''
    };
    return { /* etam / sol */
      back: '',
      top: '<g fill="' + c.hair + '"><circle cx="70" cy="68" r="12"/><circle cx="82" cy="54" r="14"/><circle cx="100" cy="48" r="15"/><circle cx="118" cy="54" r="14"/><circle cx="130" cy="68" r="12"/><path d="M62 80c4-14 18-22 38-22s34 8 38 22c-10-6-22-9-38-9s-28 3-38 9z"/></g><circle cx="94" cy="44" r="4" fill="#fff" fill-opacity=".18"/>',
      outfit: '<path d="M64 152c8-8 18-12 28-13l8 20 8-20c10 1 20 5 28 13v62H64z" fill="' + GREEN + '"/><rect x="64" y="176" width="72" height="6" fill="#fff" opacity=".92"/><rect x="64" y="194" width="72" height="6" fill="#fff" opacity=".92"/><rect x="112" y="160" width="16" height="7" rx="2" fill="#fff"/>',
      face: '<path d="M60 84a40 40 0 0 1 80 0" stroke="' + INK + '" stroke-width="6" fill="none"/><rect x="53" y="75" width="13" height="23" rx="6" fill="' + INK + '"/><rect x="134" y="75" width="13" height="23" rx="6" fill="' + INK + '"/><path d="M60 96c3 8 9 12 17 12" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="79" cy="107" r="4.5" fill="' + INK + '"/>',
      cuff: ''
    };
  }

  function charSVG(kind) {
    var k = CHARS[kind] ? kind : 'pnc', c = CHARS[k], p = parts(k, c), dk = shade(c.skin, .28);
    var blink = (3.4 + Math.random() * 2.6).toFixed(2), delay = (-Math.random() * 8).toFixed(2);
    var cuffR = p.cuff ? '<path d="M143 189h16M143 194h16" stroke="' + GOLD + '" stroke-width="3"/>' : '';
    var cuffL = p.cuff ? '<path d="M41 189h16M41 194h16" stroke="' + GOLD + '" stroke-width="3"/>' : '';
    var arm = function (cls, d, hx, cuff) {
      return '<g class="' + cls + '"><path d="' + d + '" stroke="' + c.outfit + '" stroke-width="17" stroke-linecap="round" fill="none"/>' + cuff +
        '<circle cx="' + hx + '" cy="203" r="9.5" fill="' + c.skin + '"/><circle cx="' + (hx + (cls === 'cr-arm' ? -6 : 6)) + '" cy="199" r="4" fill="' + c.skin + '"/></g>';
    };
    return '<svg class="char" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="--blink:' + blink + 's;--d:' + delay + 's">' +
      '<ellipse class="cr-shadow" cx="100" cy="213" rx="58" ry="7" fill="' + INK + '" opacity=".13"/>' +
      '<g class="cr-rig">' +
        arm('cr-arm-l', 'M60 151q-14 25-10 51', 50, cuffL) +
        '<path d="M46 214c0-42 16-72 54-76 38 4 54 34 54 76z" fill="' + c.outfit + '"/>' +
        '<path d="M124 142c18 8 30 32 30 72h-20c0-34-3-56-10-72z" fill="#000" opacity=".1"/>' +
        '<path d="M89 110h22v25c0 7-22 7-22 0z" fill="' + c.skin + '"/><path d="M89 116c6 7 16 7 22 0v-6H89z" fill="#000" opacity=".13"/>' +
        p.outfit +
        arm('cr-arm', 'M140 151q14 25 10 51', 150, cuffR) +
        '<g class="cr-head">' + p.back +
          '<circle cx="63" cy="89" r="8" fill="' + c.skin + '"/><circle cx="137" cy="89" r="8" fill="' + c.skin + '"/>' +
          '<path d="M61 86q4 3 0 7M139 86q-4 3 0 7" stroke="' + dk + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          '<circle cx="100" cy="84" r="37" fill="' + c.skin + '"/>' +
          '<path d="M100 121a37 37 0 0 0 33-20c-8 12-20 17-33 17s-25-5-33-17a37 37 0 0 0 33 20z" fill="#000" opacity=".07"/>' +
          p.top +
          '<g class="cr-brows" stroke="' + c.hair + '" stroke-width="3.5" fill="none" stroke-linecap="round"><path class="cr-brow-l" d="M80 73q7-4 14-1"/><path class="cr-brow-r" d="M106 72q7-3 14 1"/></g>' +
          '<g class="cr-look"><g class="cr-eyes-open">' +
            '<g class="cr-eye"><ellipse cx="87" cy="87" rx="5" ry="6" fill="' + INK + '"/><circle cx="88.8" cy="84.6" r="1.9" fill="#fff"/></g>' +
            '<g class="cr-eye"><ellipse cx="113" cy="87" rx="5" ry="6" fill="' + INK + '"/><circle cx="114.8" cy="84.6" r="1.9" fill="#fff"/></g>' +
          '</g><path class="cr-eh" display="none" d="M81 89q6-7 12 0M107 89q6-7 12 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>' +
          '<path d="M100 90q4 5-1 8" stroke="' + dk + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
          '<g class="cr-blush" fill="' + PEACH + '" opacity=".45"><ellipse cx="76" cy="99" rx="6" ry="4"/><ellipse cx="124" cy="99" rx="6" ry="4"/></g>' +
          '<path class="m-smile" d="M89 104c7 6 15 6 22 0" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          '<g class="m-happy" display="none"><path d="M86 102h28c0 10-6 16-14 16s-14-6-14-16z" fill="' + INK + '"/><path d="M93 113c4-4 10-4 14 0-4 3-10 3-14 0z" fill="' + PEACH + '"/></g>' +
          '<path class="m-sad" display="none" d="M90 111c7-6 13-6 20 0" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          p.face +
        '</g>' +
      '</g></svg>';
  }

  var css = [
    '.char{overflow:visible;-webkit-tap-highlight-color:transparent}',
    '.char .cr-rig{transform-origin:100px 214px;animation:cr-breathe 4s ease-in-out infinite;animation-delay:var(--d,0s);transition:transform .3s}',
    '@keyframes cr-breathe{0%,100%{transform:none}50%{transform:scale(1.012,1.024)}}',
    '.char .cr-shadow{transform-origin:100px 213px}',
    '.char .cr-head{transform-origin:100px 126px;animation:cr-idle 8s ease-in-out infinite;animation-delay:var(--d,0s)}',
    '@keyframes cr-idle{0%,100%{transform:none}25%{transform:rotate(-3deg)}55%{transform:rotate(2.5deg) translateY(-1px)}}',
    '.char .cr-look{transform:translate(var(--lx,0px),var(--ly,0px));transition:transform .35s cubic-bezier(.2,.8,.2,1)}',
    '.char .cr-eye{transform-box:fill-box;transform-origin:center;animation:cr-blink var(--blink,4.6s) infinite}',
    '@keyframes cr-blink{0%,93%,100%{transform:none}95.5%{transform:scaleY(.08)}}',
    '.char .cr-brows{transition:transform .3s cubic-bezier(.2,.9,.3,1.3)}',
    '.char .cr-brow-l,.char .cr-brow-r{transform-box:fill-box;transform-origin:center;transition:transform .3s}',
    '.char .cr-blush{transition:opacity .3s}',
    '.char .cr-arm{transform-origin:140px 151px;animation:cr-sway-r 4s ease-in-out infinite;animation-delay:var(--d,0s);transition:transform .45s cubic-bezier(.2,.9,.3,1.3)}',
    '.char .cr-arm-l{transform-origin:60px 151px;animation:cr-sway-l 4s ease-in-out infinite;animation-delay:var(--d,0s);transition:transform .45s cubic-bezier(.2,.9,.3,1.3)}',
    '@keyframes cr-sway-r{50%{transform:rotate(-4deg)}}@keyframes cr-sway-l{50%{transform:rotate(4deg)}}',
    /* Coucou */
    '.char.wave .cr-arm{animation:cr-wave 1.4s ease-in-out}',
    '@keyframes cr-wave{0%,100%{transform:none}16%{transform:rotate(-158deg)}31%,61%{transform:rotate(-126deg)}46%,76%{transform:rotate(-158deg)}90%{transform:rotate(-150deg)}}',
    '.char.wave .cr-head{animation:cr-hi 1.4s ease-in-out}',
    '@keyframes cr-hi{20%,80%{transform:rotate(-6deg)}}',
    '.char.wave .cr-brows{transform:translateY(-3px)}',
    '.char.wave .m-smile{display:none}.char.wave .m-happy{display:inline}',
    /* Joie */
    '.char.happy .cr-rig{animation:cr-jump .62s cubic-bezier(.3,1.4,.5,1) 2}',
    '@keyframes cr-jump{0%{transform:scale(1.08,.9)}30%{transform:translateY(-26px) scale(.94,1.07)}60%{transform:scale(1.06,.93)}80%{transform:scale(.98,1.02)}100%{transform:none}}',
    '.char.happy .cr-shadow{animation:cr-shadow .62s cubic-bezier(.3,1.4,.5,1) 2}',
    '@keyframes cr-shadow{30%{transform:scale(.62);opacity:.05}}',
    '.char.happy .cr-arm{animation:none;transform:rotate(-155deg)}.char.happy .cr-arm-l{animation:none;transform:rotate(155deg)}',
    '.char.happy .cr-eyes-open{display:none}.char.happy .cr-eh{display:inline}',
    '.char.happy .cr-brows{transform:translateY(-4px)}.char.happy .cr-blush{opacity:.85}',
    '.char.happy .m-smile{display:none}.char.happy .m-happy{display:inline}',
    /* Déception */
    '.char.sad .cr-rig{animation:none;transform:translateY(3px) scale(1,.97)}',
    '.char.sad .cr-head{animation:cr-no .7s ease-in-out}',
    '@keyframes cr-no{20%,60%{transform:rotate(-8deg)}40%,80%{transform:rotate(8deg)}}',
    '.char.sad .cr-look{transform:translate(0,2.5px)}',
    '.char.sad .cr-brow-l{transform:rotate(-14deg) translateY(-1px)}.char.sad .cr-brow-r{transform:rotate(14deg) translateY(-1px)}',
    '.char.sad .m-smile{display:none}.char.sad .m-sad{display:inline}',
    /* Petit rebond au toucher */
    '.char.boop .cr-rig{animation:cr-boop .45s cubic-bezier(.3,1.5,.5,1)}',
    '@keyframes cr-boop{0%{transform:scale(1.1,.88)}45%{transform:scale(.95,1.06)}100%{transform:none}}',
    '@media (prefers-reduced-motion:reduce){.char *{animation:none!important;transition:none!important}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function wave(svg) {
    if (!svg || reduce) return;
    svg.classList.remove('wave'); void svg.getBoundingClientRect(); svg.classList.add('wave');
    clearTimeout(svg._w); svg._w = setTimeout(function () { svg.classList.remove('wave'); }, 1450);
  }
  function visible() {
    return [].filter.call(document.querySelectorAll('.char'), function (s) {
      var r = s.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight;
    });
  }

  if (!reduce) {
    /* Les yeux suivent la souris */
    var px = 0, py = 0, lastMove = 0, raf = 0;
    function look() {
      raf = 0;
      visible().forEach(function (s) {
        var r = s.getBoundingClientRect(), dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height * .4);
        var d = Math.hypot(dx, dy) || 1, f = Math.min(1, d / 260);
        s.style.setProperty('--lx', (dx / d * 3 * f).toFixed(2) + 'px');
        s.style.setProperty('--ly', (dy / d * 2.4 * f).toFixed(2) + 'px');
      });
    }
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX; py = e.clientY; lastMove = Date.now();
      if (!raf) raf = requestAnimationFrame(look);
    }, { passive: true });
    /* Sans souris : regards de côté de temps en temps */
    setInterval(function () {
      if (Date.now() - lastMove < 4000) return;
      var v = visible(); if (!v.length) return;
      var s = v[Math.random() * v.length | 0], a = Math.random() * Math.PI * 2;
      s.style.setProperty('--lx', (Math.cos(a) * 2.6).toFixed(2) + 'px');
      s.style.setProperty('--ly', (Math.sin(a) * 1.8).toFixed(2) + 'px');
      setTimeout(function () { s.style.setProperty('--lx', '0px'); s.style.setProperty('--ly', '0px'); }, 1400);
    }, 2200);
    /* Petit rebond au toucher */
    addEventListener('pointerdown', function (e) {
      var s = e.target.closest && e.target.closest('.char');
      if (!s || s.classList.contains('happy') || s.classList.contains('sad')) return;
      s.classList.remove('boop'); void s.getBoundingClientRect(); s.classList.add('boop');
      setTimeout(function () { s.classList.remove('boop'); }, 460);
    });
  }

  window.charSVG = charSVG;
  window.wave = wave;
})();
