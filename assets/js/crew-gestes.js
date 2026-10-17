/* TO VOTE · Envol — gestes et expressions de l'équipage (complète crew.js, à charger juste après lui).
   Module indépendant : retirer sa balise <script> des pages suffit à revenir aux personnages de base.

   Gestes du métier : de temps en temps (toutes les 9 à 14 s), un personnage visible fait un geste typique
   - PNC : les consignes de sécurité (issues de chaque côté, puis balisage lumineux au sol)
   - PNT : pouce levé et clin d'œil
   - Cadres : un coup d'œil au téléphone (le vote en ligne), puis un sourire
   - ETAM : le guidage au sol avec deux bâtons orange
   Expressions :
   - le sourire s'élargit quand la souris reste sur un personnage
   - surprise (sourcils levés, yeux ronds) au survol du bouton « Je vote »
   - la mascotte du Vrai ou faux applaudit après un sans-faute
   Tout est coupé si l'appareil demande de réduire les animations. */
(function () {
  if (!window.charSVG || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var GESTES = { pnc: 2900, pnt: 2400, cadre: 2800, etam: 3000 };
  var css = [
    /* PNC : bras vers les issues, de chaque côté, puis vers le balisage au sol */
    '.char.g-pnc .cr-arm{animation:g-pnc-r 2.9s cubic-bezier(.45,0,.3,1)}',
    '.char.g-pnc .cr-arm-l{animation:g-pnc-l 2.9s cubic-bezier(.45,0,.3,1)}',
    '.char.g-pnc .cr-fore,.char.g-pnc .cr-fore-l{animation:none}',
    '@keyframes g-pnc-r{0%,100%{transform:none}14%,40%{transform:rotate(-92deg)}54%,80%{transform:rotate(-42deg)}}',
    '@keyframes g-pnc-l{0%,100%{transform:none}14%,40%{transform:rotate(92deg)}54%,80%{transform:rotate(42deg)}}',
    '.char.g-pnc .cr-head{animation:g-pnc-h 2.9s ease-in-out}',
    '@keyframes g-pnc-h{0%,100%{transform:none}20%{transform:rotate(-5deg)}34%{transform:rotate(5deg)}60%,76%{transform:rotate(0) translateY(2px)}}',
    '.char.g-pnc .cr-brows{transform:translateY(-2px)}',
    /* PNT : pouce levé, clin d'œil */
    '.char.g-pnt .cr-arm{animation:g-up-arm 2.4s cubic-bezier(.3,1.2,.5,1)}',
    '.char.g-pnt .cr-fore{animation:g-up-fore 2.4s cubic-bezier(.3,1.2,.5,1)}',
    '@keyframes g-up-arm{0%,100%{transform:none}18%,82%{transform:rotate(-50deg)}}',
    '@keyframes g-up-fore{0%,100%{transform:none}18%,82%{transform:rotate(-120deg)}}',
    '.char.g-pnt .cr-eyes-open .cr-eye:last-child{animation:g-wink 2.4s}',
    '@keyframes g-wink{0%,30%,62%,100%{transform:none}36%,56%{transform:scaleY(.1)}}',
    '.char.g-pnt .cr-head{animation:g-tilt 2.4s ease-in-out}',
    '@keyframes g-tilt{0%,100%{transform:none}25%,78%{transform:rotate(5deg)}}',
    '.char.g-pnt .cr-blush{opacity:.8}',
    /* Cadres : regarde son téléphone devant lui, puis sourit */
    '.char.g-cadre .cr-arm{animation:g-ph-arm 2.8s cubic-bezier(.4,0,.3,1)}',
    '.char.g-cadre .cr-fore{animation:g-ph-fore 2.8s cubic-bezier(.4,0,.3,1)}',
    '@keyframes g-ph-arm{0%,100%{transform:none}18%,84%{transform:rotate(25deg)}}',
    '@keyframes g-ph-fore{0%,100%{transform:none}18%,84%{transform:rotate(101deg)}}',
    '.char.g-cadre .cr-look{transform:translate(-2px,4px)}',
    '.char.g-cadre .cr-head{animation:g-read 2.8s ease-in-out}',
    '@keyframes g-read{0%,100%{transform:none}22%,58%{transform:rotate(4deg) translateY(2px)}70%,86%{transform:rotate(-2deg)}}',
    '.char.g-cadre.g-done .cr-look{transform:none}.char.g-cadre.g-done .m-smile{display:none}.char.g-cadre.g-done .m-happy{display:inline}',
    '.g-phone-screen{animation:g-glow .5s ease-in-out 3 alternate}@keyframes g-glow{to{fill:#fff}}',
    /* ETAM : bras levés, bâtons de guidage, avant-bras qui battent « avancez » */
    '.char.g-etam .cr-arm{animation:g-mar-arm 3s cubic-bezier(.4,0,.3,1)}',
    '.char.g-etam .cr-arm-l{animation:g-mar-arm-l 3s cubic-bezier(.4,0,.3,1)}',
    '.char.g-etam .cr-fore{animation:g-mar-fore 3s ease-in-out}',
    '.char.g-etam .cr-fore-l{animation:g-mar-fore-l 3s ease-in-out}',
    '@keyframes g-mar-arm{0%,100%{transform:none}14%,86%{transform:rotate(-128deg)}}',
    '@keyframes g-mar-arm-l{0%,100%{transform:none}14%,86%{transform:rotate(128deg)}}',
    '@keyframes g-mar-fore{0%,14%,86%,100%{transform:none}26%,50%,74%{transform:rotate(-38deg)}38%,62%{transform:rotate(8deg)}}',
    '@keyframes g-mar-fore-l{0%,14%,86%,100%{transform:none}26%,50%,74%{transform:rotate(38deg)}38%,62%{transform:rotate(-8deg)}}',
    '.char.g-etam .cr-brows{transform:translateY(-2px)}',
    /* Applaudissements */
    '.char.g-clap .cr-arm{animation:g-clap-a .32s ease-in-out 6 alternate}',
    '.char.g-clap .cr-arm-l{animation:g-clap-al .32s ease-in-out 6 alternate}',
    '.char.g-clap .cr-fore{animation:g-clap-f .32s ease-in-out 6 alternate}',
    '.char.g-clap .cr-fore-l{animation:g-clap-fl .32s ease-in-out 6 alternate}',
    '@keyframes g-clap-a{from{transform:rotate(15deg)}to{transform:rotate(40deg)}}',
    '@keyframes g-clap-al{from{transform:rotate(-15deg)}to{transform:rotate(-40deg)}}',
    '@keyframes g-clap-f{from{transform:rotate(60deg)}to{transform:rotate(95deg)}}',
    '@keyframes g-clap-fl{from{transform:rotate(-60deg)}to{transform:rotate(-95deg)}}',
    '.char.g-clap .cr-eyes-open{display:none}.char.g-clap .cr-eh{display:inline}',
    '.char.g-clap .m-smile{display:none}.char.g-clap .m-happy{display:inline}.char.g-clap .cr-blush{opacity:.85}',
    /* Sourire qui s'élargit sous la souris */
    '.char .m-smile{transform-box:fill-box;transform-origin:center;transition:transform .35s cubic-bezier(.3,1.4,.5,1)}',
    '.char.x-grin .m-smile{transform:scale(1.35,1.6)}',
    '.char.x-grin .cr-blush{opacity:.8}.char.x-grin .cr-brows{transform:translateY(-2px)}',
    /* Surprise au survol de « Je vote » */
    '.char .cr-eyes-open{transform-box:fill-box;transform-origin:center;transition:transform .3s cubic-bezier(.3,1.5,.5,1)}',
    '.char.x-wow .cr-brows{transform:translateY(-6px)}',
    '.char.x-wow .cr-eyes-open{transform:scale(1.18)}',
    '.char.x-wow .m-smile{transform:scale(.45,.9)}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  if (window.crewBusy) window.crewBusy.push('g-pnc', 'g-pnt', 'g-cadre', 'g-etam', 'g-clap');
  var NS = 'http://www.w3.org/2000/svg';
  function add(parent, tag, attrs, before) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    el.setAttribute('class', (attrs['class'] ? attrs['class'] + ' ' : '') + 'g-prop');
    parent.insertBefore(el, before || null); return el;
  }
  /* accessoires glissés dans la main le temps du geste (repère de l'avant-bras : main en 150,203, bras vers le bas) */
  var PROPS = {
    pnt: function (s) { /* pouce dressé au-dessus du poing */
      add(s.querySelector('.cr-fore'), 'rect', { x: 146, y: 203, width: 8, height: 15, rx: 4, fill: s.querySelector('.cr-fore circle').getAttribute('fill') });
    },
    cadre: function (s) { /* téléphone tenu droit devant soi, la main par-dessus le bas de l'appareil */
      var g = s.querySelector('.cr-fore');
      var ph = add(g, 'g', { transform: 'rotate(-126 150 203)' }, g.querySelector('circle'));
      add(ph, 'rect', { x: 139, y: 166, width: 22, height: 38, rx: 4, fill: '#140D8A' });
      add(ph, 'rect', { x: 142, y: 170, width: 16, height: 26, rx: 2, fill: '#05CE78', 'class': 'g-phone-screen' });
      add(ph, 'path', { d: 'M146 182l3 3 6-6', stroke: '#140D8A', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    },
    etam: function (s) { /* deux bâtons de guidage orange */
      ['.cr-fore', '.cr-fore-l'].forEach(function (sel) {
        var g = s.querySelector(sel), x = sel === '.cr-fore' ? 150 : 50;
        add(g, 'rect', { x: x - 4, y: 205, width: 8, height: 30, rx: 4, fill: '#FF8A1F' });
        add(g, 'rect', { x: x - 4, y: 224, width: 8, height: 11, rx: 4, fill: '#FFD34D' });
      });
    }
  };
  function kind(s) { var k = s.dataset.k; return k === 'sol' ? (window.crewSol && window.crewSol.k) : k; }
  var BUSY = ['happy', 'sad', 'wave', 'boop', 'cr-out', 'cr-in', 'g-pnc', 'g-pnt', 'g-cadre', 'g-etam', 'g-clap'];
  function busy(s) { return BUSY.some(function (c) { return s.classList.contains(c); }); }
  function stop(s) {
    clearTimeout(s._g); s.classList.remove('g-pnc', 'g-pnt', 'g-cadre', 'g-etam', 'g-clap', 'g-done');
    [].forEach.call(s.querySelectorAll('.g-prop'), function (n) { if (!n.parentNode.closest('.g-prop')) n.remove(); });
  }
  function play(s, cls, ms, props) {
    stop(s);
    if (props) props(s);
    s.classList.add(cls);
    s._g = setTimeout(function () { stop(s); }, ms);
  }
  function gesture(s) {
    var k = kind(s); if (!GESTES[k]) return;
    play(s, 'g-' + k, GESTES[k], PROPS[k]);
    if (k === 'cadre') setTimeout(function () { if (s.classList.contains('g-cadre')) s.classList.add('g-done'); }, GESTES[k] * .62);
  }
  window.crewGesture = gesture;

  /* Toutes les 9 à 14 s, un personnage visible (et assez grand pour qu'on voie le geste) fait le sien */
  function candidates() {
    return [].filter.call(document.querySelectorAll('.char'), function (s) {
      var r = s.getBoundingClientRect();
      /* la mascotte du Vrai ou faux n'en fait pas : elle réagit déjà à chaque réponse */
      return r.width >= 70 && r.bottom > 40 && r.top < innerHeight - 40 && !busy(s) && GESTES[kind(s)] && !s.closest('#mascot');
    });
  }
  (function loop() {
    setTimeout(function () {
      if (!document.hidden) { var c = candidates(); if (c.length) gesture(c[Math.random() * c.length | 0]); }
      loop();
    }, 9000 + Math.random() * 5000);
  })();

  /* Sourire qui s'élargit quand la souris reste sur un personnage */
  var grinT;
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse') return;
    var s = e.target.closest && e.target.closest('.char'); if (!s || s.classList.contains('x-grin')) return;
    clearTimeout(grinT); grinT = setTimeout(function () { s.classList.add('x-grin'); }, 450);
  });
  document.addEventListener('pointerout', function (e) {
    var s = e.target.closest && e.target.closest('.char'); if (!s || (e.relatedTarget && s.contains(e.relatedTarget))) return;
    clearTimeout(grinT); s.classList.remove('x-grin');
  });

  /* Surprise au survol (ou au focus clavier) du bouton « Je vote » */
  function wow(on) { [].forEach.call(document.querySelectorAll('.char'), function (s) { s.classList.toggle('x-wow', on); }); }
  function isVote(t) { return t && t.closest && t.closest('a[href^="vote.html"]'); }
  document.addEventListener('pointerover', function (e) { if (isVote(e.target)) wow(true); });
  document.addEventListener('pointerout', function (e) { if (isVote(e.target) && !isVote(e.relatedTarget)) wow(false); });
  document.addEventListener('focusin', function (e) { if (isVote(e.target)) wow(true); });
  document.addEventListener('focusout', function (e) { if (isVote(e.target)) wow(false); });

  /* Vrai ou faux : sans-faute → la mascotte applaudit, après son saut de joie */
  var deck = document.getElementById('deck');
  if (deck) new MutationObserver(function () {
    var d = deck.querySelector('.done'); if (!d || d._clap) return; d._clap = true;
    var m = /(\d+)\s*\/\s*(\d+)/.exec(d.textContent);
    if (m && m[1] === m[2]) setTimeout(function () {
      var s = document.querySelector('#mascot .char'); if (!s) return;
      s.classList.remove('happy'); play(s, 'g-clap', 2000);
    }, 2700);
  }).observe(deck, { childList: true });
})();
