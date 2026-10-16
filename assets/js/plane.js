/* TO VOTE · Envol — l'avion en papier en 3D.
   Un petit modèle 3D (une flèche pliée : deux ailes et une quille) projeté en SVG sous l'angle voulu,
   avec un ombrage par facette pour qu'on lise le pliage du papier quel que soit le point de vue.

   planeSVG({ yaw, pitch, roll, elev, heading, stroke, sw })  → chaîne <svg>
     yaw   : cap, en degrés (0 = nez vers la droite, + = le nez s'éloigne)
     pitch : assiette (+ = nez qui monte)
     roll  : inclinaison (+ = aile droite qui descend)
     elev  : hauteur du point de vue (+ = on voit le dessus des ailes), 34 par défaut
     heading : true pour que le nez pointe toujours vers la droite du dessin, quel que soit l'angle 3D
   Le centre de l'avion est toujours au centre du dessin (pratique pour le faire tourner ou suivre un trajet).
   Les éléments [data-plane] sont remplis automatiquement : data-plane="route" ou "side" (vues prêtes),
   ou data-plane vide avec data-yaw, data-pitch, data-roll, data-elev, data-heading.
   planeLive(el, angles) redessine un avion existant avec de nouveaux angles (animation). */
(function () {
  var INK = '#140D8A', D2R = Math.PI / 180;

  /* Modèle : x vers l'avant, y vers la gauche, z vers le haut */
  var V = {
    N: [.95, 0, 0],           // nez
    C: [-.75, 0, 0],          // pli central, à l'arrière
    TL: [-.62, .74, .2],      // bouts d'ailes, relevés (dièdre)
    TR: [-.62, -.74, .2],
    K: [-.75, 0, -.55]        // bas de la quille
  };
  /* facettes : [sommets, teinte de base (0 = papier clair, 1 = papier dans l'ombre)] */
  var F = [
    [['N', 'C', 'K'], .55],     // quille
    [['N', 'TL', 'C'], 0],      // aile gauche
    [['N', 'C', 'TR'], 0]       // aile droite
  ];

  function rot(p, a) {
    var x = p[0], y = p[1], z = p[2], c, s, t;
    c = Math.cos(a.roll); s = Math.sin(a.roll); t = y * c - z * s; z = y * s + z * c; y = t;        // roulis (axe x)
    c = Math.cos(a.pitch); s = Math.sin(a.pitch); t = x * c - z * s; z = x * s + z * c; x = t;      // tangage (axe y)
    c = Math.cos(a.yaw); s = Math.sin(a.yaw); t = x * c - y * s; y = x * s + y * c; x = t;          // lacet (axe z)
    c = Math.cos(a.elev); s = Math.sin(a.elev); t = y * c - z * s; z = y * s + z * c; y = t;        // point de vue (axe x écran)
    return [x, y, z]; /* écran : x à droite, z en haut, y = profondeur (loin) */
  }
  function mix(a, b, k) {
    var h = function (c, i) { return parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16); };
    var o = '#';
    for (var i = 0; i < 3; i++) { var v = Math.round(h(a, i) + (h(b, i) - h(a, i)) * k); o += (v < 16 ? '0' : '') + v.toString(16); }
    return o;
  }

  function planeSVG(o) {
    o = o || {};
    var a = { yaw: (o.yaw || 0) * D2R, pitch: (o.pitch || 0) * D2R, roll: (o.roll || 0) * D2R, elev: (o.elev == null ? 34 : o.elev) * D2R };
    var P = {}, D = 7;
    Object.keys(V).forEach(function (k) {
      var p = rot(V[k], a), f = D / (D + p[1]); /* légère perspective */
      P[k] = { x: p[0] * f, y: -p[2] * f, d: p[1], w: p };
    });
    /* option heading : on tourne le dessin pour que le nez pointe exactement vers la droite (utile le long d'un trajet) */
    if (o.heading) {
      var ang = Math.atan2(P.N.y - P.C.y, P.N.x - P.C.x), ca = Math.cos(-ang), sa = Math.sin(-ang);
      Object.keys(P).forEach(function (k) { var x = P[k].x, y = P[k].y; P[k].x = x * ca - y * sa; P[k].y = x * sa + y * ca; });
    }
    var L = [-.55, -.45, .7], ln = Math.hypot(L[0], L[1], L[2]); L = L.map(function (v) { return v / ln; }); // lumière : en haut à gauche, vers nous
    var light = o.light || '#FFFFFF', dark = o.dark || '#7393EE';
    var faces = F.map(function (f) {
      var A = P[f[0][0]].w, B = P[f[0][1]].w, C = P[f[0][2]].w;
      var u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
      var n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], nl = Math.hypot(n[0], n[1], n[2]) || 1;
      n = n.map(function (x) { return x / nl; });
      if (n[1] > 0) n = n.map(function (x) { return -x; }); /* papier : on voit toujours la face tournée vers nous */
      var lum = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
      var k = Math.min(1, Math.max(0, f[1] + (1 - lum) * .7));
      var depth = (P[f[0][0]].d + P[f[0][1]].d + P[f[0][2]].d) / 3;
      return { pts: f[0].map(function (id) { return P[id].x.toFixed(3) + ',' + P[id].y.toFixed(3); }).join(' '), fill: mix(light, dark, o.shade === false ? f[1] : k), depth: depth };
    }).sort(function (x, y) { return y.depth - x.depth; }); /* du plus loin au plus proche */
    var sw = o.sw == null ? .07 : o.sw, st = o.stroke === undefined ? INK : o.stroke;
    return '<svg class="pl3d" viewBox="-1.1 -1.1 2.2 2.2" aria-hidden="true" focusable="false">' + faces.map(function (f) {
      return '<polygon points="' + f.pts + '" fill="' + f.fill + '"' + (st ? ' stroke="' + st + '" stroke-width="' + sw + '" stroke-linejoin="round"' : '') + '/>';
    }).join('') + '</svg>';
  }
  function anglesOf(el) {
    var n = function (k) { var v = el.getAttribute('data-' + k); return v == null ? undefined : +v; };
    var view = planeSVG.VIEWS[el.getAttribute('data-plane')];
    if (view) return view;
    return { yaw: n('yaw'), pitch: n('pitch'), roll: n('roll'), elev: n('elev'), heading: el.hasAttribute('data-heading') };
  }
  function planeLive(el, o) { el.innerHTML = planeSVG(o); }
  function fill(root) {
    [].forEach.call((root || document).querySelectorAll('[data-plane]'), function (el) { el.innerHTML = planeSVG(anglesOf(el)); });
  }
  /* vues prêtes à l'emploi : « route » = de trois quarts, nez vers la droite (trajets, pistes) */
  planeSVG.VIEWS = {
    route: { yaw: -14, pitch: 8, roll: 22, elev: 12, heading: true },
    side: { yaw: 20, pitch: 8, roll: -38, elev: 10, heading: true }
  };
  window.planeSVG = planeSVG; window.planeLive = planeLive; window.planeFill = fill;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { fill(); }); else fill();
})();
