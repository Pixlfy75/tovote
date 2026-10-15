/* TO VOTE · Envol — menu des petits écrans.
   En dessous de 1000 px, les liens du menu laissent place à un bouton qui porte le nom de la page en cours ;
   il ouvre la liste des pages. Les liens sont repris du menu de la page : il n'y a rien à mettre à jour ici
   quand une page est ajoutée au menu. */
(function () {
  var d = document, nav = d.querySelector('.nav');
  if (!nav) return;
  var links = [].slice.call(nav.querySelectorAll('a.l'));
  if (!links.length) return;
  var cur = links.filter(function (a) { return a.getAttribute('aria-current') === 'page'; })[0];

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
    '.menu-panel{position:fixed;left:50%;top:var(--menu-top,78px);z-index:85;width:min(320px,calc(100vw - 24px));max-height:calc(100dvh - var(--menu-top,78px) - 12px);overflow-y:auto;padding:8px;border-radius:22px;color:var(--ink,#140D8A);background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(22px) saturate(1.4);backdrop-filter:blur(22px) saturate(1.4);box-shadow:0 30px 60px -24px rgba(20,13,138,.55),inset 0 0 0 1.5px rgba(255,255,255,.9);opacity:0;visibility:hidden;transform:translate(-50%,-10px) scale(.98);transform-origin:top center;transition:opacity .25s,transform .35s cubic-bezier(.2,.9,.3,1.2),visibility .25s}' +
    '.menu-panel.on{opacity:1;visibility:visible;transform:translate(-50%,0)}' +
    '.mp-row{display:block;padding:13px 16px;border-radius:14px;text-decoration:none;color:inherit;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:115%;font-size:1.05rem}' +
    '.mp-row:focus-visible{outline:3px solid var(--blue,#0053FF);outline-offset:-3px}' +
    '.mp-row.cur{background:var(--ink,#140D8A);color:#fff}' +
    '[data-theme="dark"] .menu-panel{background:rgba(22,16,78,.95);color:#fff;box-shadow:0 30px 60px -24px rgba(0,0,0,.8),inset 0 0 0 1.5px rgba(255,255,255,.12)}' +
    '[data-theme="dark"] .mp-row.cur{background:#fff;color:#140D8A}' +
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
  panel.innerHTML = links.map(function (a) {
    var here = a === cur;
    return '<a class="mp-row' + (here ? ' cur' : '') + '" href="' + a.getAttribute('href') + '"' + (here ? ' aria-current="page"' : '') + '>' + a.textContent.trim() + '</a>';
  }).join('');
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
