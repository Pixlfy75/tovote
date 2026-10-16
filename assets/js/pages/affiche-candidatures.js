/* TO VOTE · Envol — script de la page affiche-candidatures.html */
/* Personnages figés pour l'impression : variante imposée, sans animation ni changement automatique */
document.querySelectorAll('[data-char]').forEach(function (el) {
  el.innerHTML = charSVG(el.dataset.char, el.dataset.g).replace('class="char"', 'class="still"');
});

/* Plan de cabine : fuselage vu de dessus, 15 rangées de 2 sièges, colorés par collège */
(function () {
  var cols = [['pnc', 15], ['pnt', 10], ['cadre', 3], ['etam', 2]], seats = [];
  cols.forEach(function (c) { for (var i = 0; i < c[1]; i++) seats.push(c[0]); });
  var C = { pnc: '#05CE78', pnt: '#0053FF', cadre: '#F385FF', etam: '#FF8867' };
  var x0 = 34, step = 11.2, s = '';
  for (var i = 0; i < 30; i++) {
    var col = Math.floor(i / 2), top = i % 2 === 0, x = x0 + col * step, y = top ? 15 : 33;
    s += '<rect x="' + x + '" y="' + y + '" width="8.4" height="8" rx="2.2" fill="' + C[seats[i]] + '"/>' +
         '<rect x="' + (x + 6.6) + '" y="' + (y + .6) + '" width="1.8" height="6.8" rx=".9" fill="#000" opacity=".14"/>';
  }
  document.getElementById('cabin').innerHTML =
    '<svg viewBox="0 0 230 56" aria-hidden="true">' +
      /* ailes */
      '<path d="M98 6 120 -14h14L124 6z" fill="#fff" stroke="#140D8A" stroke-width="1.4" stroke-linejoin="round" opacity=".9"/>' +
      '<path d="M98 50 120 70h14L124 50z" fill="#fff" stroke="#140D8A" stroke-width="1.4" stroke-linejoin="round" opacity=".9"/>' +
      /* empennage */
      '<path d="M14 10 4 0h8l12 10zM14 46 4 56h8l12-10z" fill="#fff" stroke="#140D8A" stroke-width="1.4" stroke-linejoin="round"/>' +
      /* fuselage */
      '<path d="M16 28c0-12 6-20 20-20h160c18 0 30 10 32 20-2 10-14 20-32 20H36c-14 0-20-8-20-20z" fill="#fff" stroke="#140D8A" stroke-width="1.6"/>' +
      '<path d="M206 16c8 2 14 7 16 12-2 5-8 10-16 12z" fill="#D6E5FF"/>' +
      '<line x1="34" y1="28" x2="200" y2="28" stroke="#140D8A" stroke-opacity=".18" stroke-width="1" stroke-dasharray="2 2"/>' +
      s +
    '</svg>';
})();

/* Écran : la feuille s'ajuste à la largeur disponible (aucun effet à l'impression) */
(function () {
  var f = document.getElementById('fit');
  function fit() {
    var mm = 96 / 25.4, w = 210 * mm, h = 297 * mm, avail = Math.min(innerWidth - 32, 900);
    var k = Math.min(1, avail / w);
    f.style.width = w * k + 'px'; f.style.height = h * k + 'px';
    f.firstElementChild.style.transform = k < 1 ? 'scale(' + k + ')' : '';
  }
  addEventListener('resize', fit); fit();
})();
