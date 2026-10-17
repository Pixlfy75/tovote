/* TO VOTE · Envol — l'équipage illustré, commun à toutes les pages.
   charSVG(k[, g]) renvoie le SVG d'un personnage (pnc | pnt | cadre | etam, ou sol = Cadres ou ETAM au hasard), en variante femme ou homme
   tirée au hasard à chaque ouverture de page (g = 'f' | 'h' pour la forcer), puis qui change toute seule de temps en temps
   (sauf à l'intérieur d'un élément [data-fixed]) ;
   wave(svg) lui fait faire coucou.
   Classes à poser sur le SVG : .happy (saut de joie), .sad (non de la tête), .wave (coucou), .boop (petit rebond).
   Le SVG reste lisible sans CSS (export en image de la carte d'embarquement). */
(function () {
  var INK = '#140D8A', GOLD = '#F9C74F', GREEN = '#05CE78', PEACH = '#FF8867';
  /* Chaque métier existe en variante femme (f) et homme (h), tirée au hasard à chaque ouverture de page */
  var CHARS = {
    pnc: { outfit: INK, f: { skin: '#8D5524', hair: '#1d1350' }, h: { skin: '#E0AC69', hair: '#3b2314' } },
    pnt: { outfit: INK, f: { skin: '#C68642', hair: '#2b1a0e' }, h: { skin: '#F1C27D', hair: '#7a5a2a' } },
    cadre: { outfit: '#0053FF', f: { skin: '#F1C27D', hair: '#9a4a24' }, h: { skin: '#E0AC69', hair: '#2b1a0e' } },
    etam: { outfit: INK, f: { skin: '#8D5524', hair: '#24160c' }, h: { skin: '#C68642', hair: '#3b2314' } }
  };
  var ROLES = ['pnc', 'pnt', 'cadre', 'etam'], GENDER = {};
  function draw() { ROLES.forEach(function (k) { GENDER[k] = Math.random() < .5 ? 'f' : 'h'; }); }
  function key() { return ROLES.map(function (k) { return GENDER[k]; }).join(''); }
  /* Tirage à l'ouverture, jamais identique à celui de la visite précédente */
  draw();
  try {
    var last = localStorage.getItem('tv_crew');
    if (key() === last) { var r = ROLES[Math.random() * 4 | 0]; GENDER[r] = GENDER[r] === 'f' ? 'h' : 'f'; }
    localStorage.setItem('tv_crew', key());
  } catch (e) {}
  /* « Sol » regroupe Cadres et ETAM : son personnage est tiré au hasard parmi les deux métiers et les deux variantes */
  var SOL = { k: Math.random() < .5 ? 'cadre' : 'etam' }; SOL.g = GENDER[SOL.k];
  var other = function (g) { return g === 'f' ? 'h' : 'f'; };

  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    function f(v) { return Math.round(v * (1 - k)).toString(16).padStart(2, '0'); }
    return '#' + f(r) + f(g) + f(b);
  }

  /* Détails par métier et variante : derrière la tête, coiffure, col et tenue, accessoires du visage, galons */
  function parts(k, g, c) {
    var F = g === 'f', hl = function (d) { return '<path d="' + d + '" stroke="#fff" stroke-opacity=".22" stroke-width="3" fill="none" stroke-linecap="round"/>'; };
    var wings = '<path d="M58 174q9-7 22-3q-10 3-14 7z" fill="' + GOLD + '"/>';
    var shortHair = '<path d="M63 82c-3-28 14-46 37-46 23 0 39 16 37 42-5-9-12-15-21-17-14 5-34 9-53 21z" fill="' + c.hair + '"/>' + hl('M84 44c10-4 22-3 32 3');
    if (k === 'pnc') return {
      back: F ? '<circle cx="137" cy="54" r="15" fill="' + c.hair + '"/><rect x="124" y="60" width="12" height="6" rx="3" fill="' + GREEN + '" transform="rotate(-35 130 63)"/>' : '',
      top: F ? '<path d="M62 86c-2-30 15-48 38-48s40 17 38 46c-6-14-18-23-34-25-12 8-26 14-42 27z" fill="' + c.hair + '"/>' + hl('M80 47c10-5 24-5 34 1') : shortHair,
      outfit: (F
        ? '<path d="M83 138l17 24 17-24z" fill="#fff"/><path d="M81 140c11 10 27 10 38 0l-5 13c-8 7-20 7-28 0z" fill="' + GREEN + '"/><path d="M100 151l-11 19 8-2 3 8 3-8 8 2z" fill="' + GREEN + '"/>'
        : '<path d="M83 138l17 26 17-26z" fill="#fff"/><path d="M96 141h8l3 31-7 8-7-8z" fill="' + GREEN + '"/>') +
        wings + '<rect x="120" y="170" width="16" height="7" rx="2" fill="#fff"/>',
      face: '', cuff: false, earrings: F
    };
    if (k === 'pnt') return {
      back: F ? '<path d="M57 72c-7 24-5 42 4 52h18c-9-13-12-31-10-52zM143 72c7 24 5 42-4 52h-18c9-13 12-31 10-52z" fill="' + c.hair + '"/>' : '',
      top: '<path d="M64 66c0 12 2 20 5 25V66zM136 66c0 12-2 20-5 25V66z" fill="' + c.hair + '"/><g transform="translate(0 -6)"><path d="M60 66c2-22 20-33 40-33s38 11 40 33z" fill="' + INK + '"/>' + hl('M70 44c8-6 18-8 28-8') + '<rect x="58" y="60" width="84" height="10" rx="5" fill="#0b0657"/><path d="M62 69q38 14 76 0l-1 6q-37 13-74 0z" fill="#0b0657"/><path d="M86 49q14-6 28 0l-3 5q-11-4-22 0z" fill="' + GOLD + '"/><circle cx="100" cy="46" r="4.5" fill="' + GOLD + '"/></g>',
      outfit: '<path d="M82 138l18 28 18-28z" fill="#fff"/><path d="M96 141h8l3 31-7 8-7-8z" fill="#0b0657"/>' + wings + '<path d="M52 154l20-6M128 148l20 6" stroke="' + GOLD + '" stroke-width="4" stroke-linecap="round"/>',
      face: '', cuff: true, earrings: F
    };
    if (k === 'cadre') return {
      back: F ? '<path d="M58 86c0-32 18-52 42-52s42 20 42 52v30c0 6-5 9-11 9H69c-6 0-11-3-11-9z" fill="' + c.hair + '"/>' : '',
      top: F ? '<path d="M62 86c-2-31 16-50 38-50s40 19 38 48c-12-3-23-9-31-19-9 11-27 19-45 21z" fill="' + c.hair + '"/>' + hl('M82 44c10-5 24-4 34 2')
        : '<path d="M63 82c-4-28 13-46 37-46 23 0 39 15 38 40-6-10-14-17-25-19-10 7-30 12-50 25z" fill="' + c.hair + '"/>' + hl('M84 44c10-4 22-3 32 3'),
      outfit: (F
        ? '<path d="M82 138l18 28 18-28z" fill="#fff"/><path d="M90 146q10 10 20 0" stroke="' + PEACH + '" stroke-width="2" fill="none"/><circle cx="100" cy="152" r="3.5" fill="' + PEACH + '"/>'
        : '<path d="M80 138l20 34 20-34z" fill="#fff"/><path d="M97 143h6l3 25-6 8-6-8z" fill="' + PEACH + '"/>') +
        '<path d="M80 138l20 34-12-2-14-26zM120 138l-20 34 12-2 14-26z" fill="#0b3fbf"/><path d="M84 141l-14 31" stroke="' + GREEN + '" stroke-width="2.5"/><rect x="62" y="171" width="17" height="22" rx="3" fill="#fff"/><rect x="65" y="175" width="11" height="5" rx="1.5" fill="' + GREEN + '"/>',
      face: '<g fill="#fff" fill-opacity=".18" stroke="' + INK + '" stroke-width="3"><rect x="76" y="77" width="22" height="18" rx="7"/><rect x="102" y="77" width="22" height="18" rx="7"/></g><path d="M98 85h4" stroke="' + INK + '" stroke-width="3"/>',
      cuff: false, earrings: F
    };
    return { /* etam / sol : tresses pour la variante femme, cheveux courts bouclés sinon */
      back: F ? '<path d="M59 84c-7 20-7 40 0 54h13c-6-15-6-34-2-52zM141 84c7 20 7 40 0 54h-13c6-15 6-34 2-52z" fill="' + c.hair + '"/><circle cx="65" cy="138" r="4" fill="' + GREEN + '"/><circle cx="135" cy="138" r="4" fill="' + GREEN + '"/>' : '',
      top: '<g fill="' + c.hair + '"><circle cx="70" cy="68" r="12"/><circle cx="82" cy="54" r="14"/><circle cx="100" cy="48" r="15"/><circle cx="118" cy="54" r="14"/><circle cx="130" cy="68" r="12"/><path d="M62 80c4-14 18-22 38-22s34 8 38 22c-10-6-22-9-38-9s-28 3-38 9z"/></g><circle cx="94" cy="44" r="4" fill="#fff" fill-opacity=".18"/>',
      outfit: '<path d="M64 152c8-8 18-12 28-13l8 20 8-20c10 1 20 5 28 13v62H64z" fill="' + GREEN + '"/><rect x="64" y="176" width="72" height="6" fill="#fff" opacity=".92"/><rect x="64" y="194" width="72" height="6" fill="#fff" opacity=".92"/><rect x="112" y="160" width="16" height="7" rx="2" fill="#fff"/>',
      face: '<path d="M60 84a40 40 0 0 1 80 0" stroke="' + INK + '" stroke-width="6" fill="none"/><rect x="53" y="75" width="13" height="23" rx="6" fill="' + INK + '"/><rect x="134" y="75" width="13" height="23" rx="6" fill="' + INK + '"/><path d="M60 96c3 8 9 12 17 12" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="79" cy="107" r="4.5" fill="' + INK + '"/>',
      cuff: false, earrings: false
    };
  }

  /* g : 'f' ou 'h' pour forcer une variante ; sinon celle tirée pour ce métier à l'ouverture de la page */
  function charSVG(kind, g) {
    var isSol = kind === 'sol', k = isSol ? SOL.k : (CHARS[kind] ? kind : 'pnc');
    var v = g === 'f' || g === 'h' ? g : (isSol ? SOL.g : GENDER[k]);
    var c = { outfit: CHARS[k].outfit, skin: CHARS[k][v].skin, hair: CHARS[k][v].hair }, p = parts(k, v, c), dk = shade(c.skin, .28);
    var lashL = v === 'f' ? '<path d="M82.6 82.4l-3.4-2.6" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' : '';
    var lashR = v === 'f' ? '<path d="M117.4 82.4l3.4-2.6" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' : '';
    var blink = (3.4 + Math.random() * 2.6).toFixed(2), delay = (-Math.random() * 8).toFixed(2);
    var cuffR = p.cuff ? '<path d="M143 189h16M143 194h16" stroke="' + GOLD + '" stroke-width="3"/>' : '';
    var cuffL = p.cuff ? '<path d="M41 189h16M41 194h16" stroke="' + GOLD + '" stroke-width="3"/>' : '';
    /* bras articulé : épaule (pivot du bras), coude (pivot de l'avant-bras), main ; R = bras droit à l'écran */
    var arm = function (R, cuff) {
      var x = function (v) { return R ? v : 200 - v; }, st = '" stroke="' + c.outfit + '" stroke-width="17" stroke-linecap="round" fill="none"/>';
      return '<g class="' + (R ? 'cr-arm' : 'cr-arm-l') + '"><path d="M' + x(140) + ' 151L' + x(148) + ' 177' + st +
        '<g class="' + (R ? 'cr-fore' : 'cr-fore-l') + '"><path d="M' + x(148) + ' 177L' + x(150) + ' 199' + st + cuff +
        '<circle cx="' + x(150) + '" cy="203" r="9.5" fill="' + c.skin + '"/><circle cx="' + x(144) + '" cy="199" r="4" fill="' + c.skin + '"/></g></g>';
    };
    return '<svg class="char" data-k="' + (isSol ? 'sol' : k) + '" data-g="' + v + '" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="--blink:' + blink + 's;--d:' + delay + 's">' +
      '<ellipse class="cr-shadow" cx="100" cy="213" rx="58" ry="7" fill="' + INK + '" opacity=".13"/>' +
      '<g class="cr-rig">' +
        arm(false, cuffL) +
        '<path d="M46 214c0-42 16-72 54-76 38 4 54 34 54 76z" fill="' + c.outfit + '"/>' +
        '<path d="M124 142c18 8 30 32 30 72h-20c0-34-3-56-10-72z" fill="#000" opacity=".1"/>' +
        '<path d="M89 110h22v25c0 7-22 7-22 0z" fill="' + c.skin + '"/><path d="M89 116c6 7 16 7 22 0v-6H89z" fill="#000" opacity=".13"/>' +
        p.outfit +
        arm(true, cuffR) +
        '<g class="cr-head">' + p.back +
          '<circle cx="63" cy="89" r="8" fill="' + c.skin + '"/><circle cx="137" cy="89" r="8" fill="' + c.skin + '"/>' +
          '<path d="M61 86q4 3 0 7M139 86q-4 3 0 7" stroke="' + dk + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          (p.earrings ? '<circle cx="63" cy="99" r="3" fill="' + GOLD + '"/><circle cx="137" cy="99" r="3" fill="' + GOLD + '"/>' : '') +
          '<circle cx="100" cy="84" r="37" fill="' + c.skin + '"/>' +
          '<path d="M100 121a37 37 0 0 0 33-20c-8 12-20 17-33 17s-25-5-33-17a37 37 0 0 0 33 20z" fill="#000" opacity=".07"/>' +
          p.top +
          '<g class="cr-brows" stroke="' + c.hair + '" stroke-width="3.5" fill="none" stroke-linecap="round"><path class="cr-brow-l" d="M80 73q7-4 14-1"/><path class="cr-brow-r" d="M106 72q7-3 14 1"/></g>' +
          '<g class="cr-look"><g class="cr-eyes-open">' +
            '<g class="cr-eye"><ellipse cx="87" cy="87" rx="5" ry="6" fill="' + INK + '"/><circle cx="88.8" cy="84.6" r="1.9" fill="#fff"/>' + lashL + '</g>' +
            '<g class="cr-eye"><ellipse cx="113" cy="87" rx="5" ry="6" fill="' + INK + '"/><circle cx="114.8" cy="84.6" r="1.9" fill="#fff"/>' + lashR + '</g>' +
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
    '.char .cr-arm{transform-origin:140px 151px;animation:cr-sway-r 4s ease-in-out infinite;animation-delay:var(--d,0s);transition:transform .5s cubic-bezier(.3,1.25,.5,1)}',
    '.char .cr-arm-l{transform-origin:60px 151px;animation:cr-sway-l 4s ease-in-out infinite;animation-delay:var(--d,0s);transition:transform .5s cubic-bezier(.3,1.25,.5,1)}',
    '.char .cr-fore{transform-origin:148px 177px;animation:cr-elbow-r 4s ease-in-out infinite;animation-delay:var(--d,0s);transition:transform .5s cubic-bezier(.3,1.25,.5,1)}',
    '.char .cr-fore-l{transform-origin:52px 177px;animation:cr-elbow-l 4s ease-in-out infinite;animation-delay:var(--d,0s);transition:transform .5s cubic-bezier(.3,1.25,.5,1)}',
    '@keyframes cr-sway-r{50%{transform:rotate(-3deg)}}@keyframes cr-sway-l{50%{transform:rotate(3deg)}}',
    '@keyframes cr-elbow-r{50%{transform:rotate(-6deg)}}@keyframes cr-elbow-l{50%{transform:rotate(6deg)}}',
    /* Coucou */
    /* coucou : le bras se lève par l'épaule, la main s'agite par le coude, puis tout redescend en douceur */
    '.char.wave .cr-arm{animation:cr-wave 1.6s cubic-bezier(.45,0,.3,1)}',
    '@keyframes cr-wave{0%,100%{transform:none}20%,78%{transform:rotate(-125deg)}}',
    '.char.wave .cr-fore{animation:cr-hand 1.6s ease-in-out}',
    '@keyframes cr-hand{0%,16%{transform:none}28%{transform:rotate(-30deg)}40%{transform:rotate(14deg)}52%{transform:rotate(-30deg)}64%{transform:rotate(14deg)}76%{transform:rotate(-8deg)}90%,100%{transform:none}}',
    '.char.wave .cr-head{animation:cr-hi 1.6s ease-in-out}',
    '@keyframes cr-hi{20%,80%{transform:rotate(-6deg)}}',
    '.char.wave .cr-brows{transform:translateY(-3px)}',
    '.char.wave .m-smile{display:none}.char.wave .m-happy{display:inline}',
    /* Joie */
    '.char.happy .cr-rig{animation:cr-jump .62s cubic-bezier(.3,1.4,.5,1) 2}',
    '@keyframes cr-jump{0%{transform:scale(1.08,.9)}30%{transform:translateY(-26px) scale(.94,1.07)}60%{transform:scale(1.06,.93)}80%{transform:scale(.98,1.02)}100%{transform:none}}',
    '.char.happy .cr-shadow{animation:cr-shadow .62s cubic-bezier(.3,1.4,.5,1) 2}',
    '@keyframes cr-shadow{30%{transform:scale(.62);opacity:.05}}',
    '.char.happy .cr-arm{animation:none;transform:rotate(-145deg)}.char.happy .cr-arm-l{animation:none;transform:rotate(145deg)}',
    '.char.happy .cr-fore{animation:none;transform:rotate(-18deg)}.char.happy .cr-fore-l{animation:none;transform:rotate(18deg)}',
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
    /* Changement de variante : volte-face */
    '.char.cr-out{animation:cr-out .22s ease-in forwards}@keyframes cr-out{to{transform:scaleX(0) translateY(4px)}}',
    '.char.cr-in{animation:cr-in .5s cubic-bezier(.3,1.5,.5,1)}@keyframes cr-in{from{transform:scaleX(0) translateY(4px)}}',
    '@media (prefers-reduced-motion:reduce){.char *{animation:none!important;transition:none!important}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function wave(svg) {
    if (!svg || reduce) return;
    svg.classList.remove('wave'); void svg.getBoundingClientRect(); svg.classList.add('wave');
    clearTimeout(svg._w); svg._w = setTimeout(function () { svg.classList.remove('wave'); }, 1650);
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

  /* Le personnage d'un métier change de variante (femme / homme), partout sur la page */
  var BUSY = ['happy', 'sad', 'wave', 'boop', 'cr-out', 'cr-in'];
  function swap(k) {
    var html;
    if (k === 'sol') { /* une autre combinaison métier × variante que l'actuelle */
      var combos = [['cadre', 'f'], ['cadre', 'h'], ['etam', 'f'], ['etam', 'h']].filter(function (c) { return c[0] !== SOL.k || c[1] !== SOL.g; });
      var c = combos[Math.random() * combos.length | 0]; SOL.k = c[0]; SOL.g = c[1]; html = charSVG('sol');
    } else { var g = other(GENDER[k]); GENDER[k] = g; html = charSVG(k, g); }
    [].forEach.call(document.querySelectorAll('.char[data-k="' + k + '"]'), function (s) {
      if (s.closest('[data-fixed]')) return;
      var t = document.createElement('template'); t.innerHTML = html;
      var n = t.content.firstElementChild, r = s.getBoundingClientRect();
      if (reduce || !r.width || r.bottom < 0 || r.top > innerHeight) { s.replaceWith(n); return; }
      s.classList.add('cr-out');
      setTimeout(function () { n.classList.add('cr-in'); s.replaceWith(n); setTimeout(function () { n.classList.remove('cr-in'); }, 520); }, 220);
    });
  }
  /* Toutes les 6 secondes, un métier visible à l'écran change de variante */
  setInterval(function () {
    if (document.hidden) return;
    var v = visible().filter(function (s) { return s.dataset.k && !s.closest('[data-fixed]') && !BUSY.some(function (c) { return s.classList.contains(c); }); });
    if (v.length) swap(v[Math.random() * v.length | 0].dataset.k);
  }, 6000);

  window.charSVG = charSVG;
  window.crewSwap = swap;
  window.crewGender = GENDER;
  window.crewSol = SOL;
  window.wave = wave;
  window.crewBusy = BUSY; /* classes pendant lesquelles un personnage ne change pas de variante (complétée par crew-gestes.js) */
})();
