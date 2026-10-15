/* TO VOTE · Envol — menu des petits écrans.
   En dessous de 1000 px, les liens du menu laissent place à un bouton qui porte le nom de la page en cours ;
   il ouvre un panneau façon tableau d'embarquement, une « porte » par page. Les liens sont repris du menu
   de la page : il n'y a rien à mettre à jour ici quand une page est ajoutée au menu. */
(function () {
  var d = document, nav = d.querySelector('.nav');
  if (!nav) return;
  var links = [].slice.call(nav.querySelectorAll('a.l'));
  if (!links.length) return;
  var DESC = {
    'index.html': 'L\'essentiel du vote en un coup d\'œil',
    'cse.html': 'À quoi il sert, qui y siège',
    'calendrier.html': 'Toutes les dates, du lancement aux résultats',
    'candidatures.html': 'Les listes, collège par collège',
    'faq.html': 'Tes questions, nos réponses',
    'documents.html': 'Le PAP et les documents officiels',
    'quiz.html': 'Teste tes connaissances'
  };
  var cur = links.filter(function (a) { return a.getAttribute('aria-current') === 'page'; })[0];
  var vote = nav.querySelector('.btn-ruby');

  var css = '' +
    '.menu-btn{display:none;align-items:center;gap:8px;padding:.62em 1em .62em .9em;border:0;border-radius:999px;background:var(--ink,#140D8A);color:#fff;font:600 .9rem var(--f-body,Arial,sans-serif);cursor:pointer;white-space:nowrap}' +
    '.menu-btn svg{width:16px;height:16px;flex:none}' +
    '.menu-btn .ch{width:12px;height:12px;transition:transform .3s}' +
    '.menu-btn[aria-expanded="true"] .ch{transform:rotate(180deg)}' +
    '.menu-btn:focus-visible{outline:3px solid var(--blue,#0053FF);outline-offset:3px}' +
    '@media (max-width:1000px){.nav a.l{display:none!important}.menu-btn{display:inline-flex}}' +
    '.menu-scrim{position:fixed;inset:0;z-index:79;background:rgba(20,13,138,.18);opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}' +
    '.menu-scrim.on{opacity:1;visibility:visible}' +
    '.menu-on .nav{z-index:84}' + /* le menu et son panneau passent devant la bulle de l\'assistant */
    '.menu-panel{position:fixed;left:50%;top:var(--menu-top,78px);z-index:85;width:min(460px,calc(100vw - 24px));max-height:calc(100dvh - var(--menu-top,78px) - 12px);overflow-y:auto;padding:12px;border-radius:26px;color:var(--ink,#140D8A);background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(22px) saturate(1.4);backdrop-filter:blur(22px) saturate(1.4);box-shadow:0 30px 60px -24px rgba(20,13,138,.55),inset 0 0 0 1.5px rgba(255,255,255,.9);opacity:0;visibility:hidden;transform:translate(-50%,-10px) scale(.98);transform-origin:top center;transition:opacity .25s,transform .35s cubic-bezier(.2,.9,.3,1.2),visibility .25s}' +
    '.menu-panel.on{opacity:1;visibility:visible;transform:translate(-50%,0)}' +
    '.mp-head{display:flex;justify-content:space-between;align-items:center;padding:4px 8px 10px;font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}' +
    '.mp-head span{opacity:.55}' +
    '.mp-head b{display:inline-flex;align-items:center;gap:6px;letter-spacing:.06em;white-space:nowrap}' +
    '.mp-head b i{width:7px;height:7px;border-radius:50%;background:var(--green,#05CE78);box-shadow:0 0 0 3px rgba(5,206,120,.25)}' +
    '.mp-row{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:11px 12px;border-radius:16px;text-decoration:none;color:inherit}' +
    '.mp-row+.mp-row{margin-top:2px}' +
    '.mp-row:focus-visible{outline:3px solid var(--blue,#0053FF);outline-offset:-3px}' +
    '.mp-gate{font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:115%;font-size:.74rem;line-height:1;text-align:center;min-width:3.4em;padding:.5em .4em;border-radius:9px;background:#EAF4FF;font-variant-numeric:tabular-nums}' +
    '.mp-gate small{display:block;font-size:.55rem;font-weight:700;letter-spacing:.08em;opacity:.6;margin-bottom:2px}' +
    '.mp-t b{display:block;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:115%;font-size:1.02rem;line-height:1.1}' +
    '.mp-t small{display:block;font-size:.8rem;opacity:.7;margin-top:3px;line-height:1.3}' +
    '.mp-st{font-size:.72rem;font-weight:700;white-space:nowrap}' +
    '.mp-row.cur{background:var(--ink,#140D8A);color:#fff}' +
    '.mp-row.cur .mp-gate{background:rgba(255,255,255,.14)}' +
    '.mp-row.cur .mp-st{color:var(--green,#05CE78)}' +
    '.mp-foot{margin-top:10px;padding-top:12px;border-top:1.5px dashed rgba(20,13,138,.14)}' +
    '.mp-foot a{display:flex;justify-content:center;align-items:center;gap:8px;width:100%;padding:.9em 1.2em;border-radius:999px;background:var(--ruby,#E20076);color:#fff;font-weight:600;text-decoration:none}' +
    '[data-theme="dark"] .menu-panel{background:rgba(22,16,78,.95);color:#fff;box-shadow:0 30px 60px -24px rgba(0,0,0,.8),inset 0 0 0 1.5px rgba(255,255,255,.12)}' +
    '[data-theme="dark"] .mp-gate{background:rgba(255,255,255,.1)}' +
    '[data-theme="dark"] .mp-row.cur{background:#fff;color:#140D8A}' +
    '[data-theme="dark"] .mp-row.cur .mp-gate{background:#EAF4FF}' +
    '[data-theme="dark"] .mp-row.cur .mp-st{color:#01AB61}' +
    '[data-theme="dark"] .mp-foot{border-top-color:rgba(255,255,255,.14)}' +
    '[data-theme="dark"] .menu-scrim{background:rgba(0,0,0,.35)}' +
    '@media (prefers-reduced-motion:reduce){.menu-panel,.menu-scrim,.menu-btn .ch{transition:none}}';
  var st = d.createElement('style'); st.textContent = css; d.head.appendChild(st);

  var BURGER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>';
  var CHEVRON = '<svg class="ch" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg>';
  var btn = d.createElement('button');
  btn.type = 'button'; btn.className = 'menu-btn';
  btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'menuPanel');
  btn.setAttribute('aria-label', 'Menu' + (cur ? ' (page actuelle : ' + cur.textContent.trim() + ')' : ''));
  btn.innerHTML = BURGER + '<span>' + (cur ? cur.textContent.trim() : 'Menu') + '</span>' + CHEVRON;
  var logo = nav.firstElementChild;
  nav.insertBefore(btn, logo && logo.tagName === 'A' && !logo.classList.contains('l') ? logo.nextSibling : nav.firstChild);

  var scrim = d.createElement('div'); scrim.className = 'menu-scrim';
  var panel = d.createElement('nav'); panel.className = 'menu-panel'; panel.id = 'menuPanel';
  panel.setAttribute('aria-label', 'Toutes les pages'); panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = '<div class="mp-head"><span>Choisis ta destination</span><b><i></i>Vol TO 2027</b></div>' +
    links.map(function (a, i) {
      var href = a.getAttribute('href'), here = a === cur, name = a.textContent.trim();
      return '<a class="mp-row' + (here ? ' cur' : '') + '" href="' + href + '"' + (here ? ' aria-current="page"' : '') + '>' +
        '<span class="mp-gate"><small>PORTE</small>' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
        '<span class="mp-t"><b>' + name + '</b>' + (DESC[href] ? '<small>' + DESC[href] + '</small>' : '') + '</span>' +
        '<span class="mp-st">' + (here ? 'Tu es ici' : '→') + '</span></a>';
    }).join('') +
    (vote ? '<div class="mp-foot"><a href="' + vote.getAttribute('href') + '" target="_blank" rel="noopener">🗳️ Je vote</a></div>' : '');
  d.body.appendChild(scrim); d.body.appendChild(panel);
  [].forEach.call(panel.querySelectorAll('a'), function (a) { a.tabIndex = -1; });

  function setOpen(on) {
    if (on) panel.style.setProperty('--menu-top', Math.round(nav.getBoundingClientRect().bottom + 8) + 'px');
    panel.classList.toggle('on', on); scrim.classList.toggle('on', on); d.documentElement.classList.toggle('menu-on', on);
    btn.setAttribute('aria-expanded', on); panel.setAttribute('aria-hidden', !on);
    [].forEach.call(panel.querySelectorAll('a'), function (a) { a.tabIndex = on ? 0 : -1; });
    if (on) { var f = panel.querySelector('.mp-row'); f && f.focus({ preventScroll: true }); }
  }
  btn.onclick = function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); };
  scrim.onclick = function () { setOpen(false); };
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('on')) { setOpen(false); btn.focus(); } });
  addEventListener('resize', function () { if (innerWidth > 1000 && panel.classList.contains('on')) setOpen(false); });
})();
