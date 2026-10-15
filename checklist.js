/* TO VOTE · Envol — la checklist avant vol (« J'ai tout ce qu'il faut pour voter ? »).
   Se place n'importe où : <div data-checklist></div> puis <script src="checklist.js"></script>.
   Les cases cochées restent sur l'appareil (localStorage) : rien n'est transmis.
   Procédures de secours conformes au PAP du 13 octobre 2026 (art. 7.3, 8.7.1 à 8.7.2.4). */
(function () {
  var VOTE = 'https://www.transavia.webvote.fr/', KEY = 'tv_checklist';
  var PHASES = [
    { t: 'Préparation', w: 'avant le 25 février 2027', items: [
      { id: 'liste', l: 'Inscription sur la liste électorale', s: 'Vérifiée', h: 'Publiée sur l\'intranet le 22 février 2027. Une erreur sur ton nom, ton collège, ton âge ou ton ancienneté ? Signale-la aux RH au plus tard le 25 février 2027 à minuit.', r: 'PAP, art. 7.3', a: ['faq.html#liste-electorale', 'En savoir plus'] },
      { id: 'college', l: 'Mon collège', s: 'Vérifié', h: 'PNC, PNT, Cadres ou ETAM : tu votes uniquement pour les listes de ton collège.', a: ['candidatures.html#colleges', 'Voir les collèges'] },
      { id: 'adresse', l: 'Mon adresse postale', s: 'À jour', h: 'Ton identifiant est envoyé par courrier à l\'adresse connue de l\'entreprise à la date d\'arrêt des listes électorales. Vérifie-la dans ton espace RH.', r: 'PAP, art. 8.7.2.3' },
      { id: 'mail', l: 'Accès à ma messagerie pro', s: 'OK', h: 'Ton mot de passe y arrive au moment de te connecter. Pas d\'accès pendant le vote (congé, absence…) ? Voir la procédure B.', r: 'PAP, art. 8.7.2.3' },
      { id: 'iban', l: 'Les 5 derniers caractères de mon IBAN', s: 'Sous la main', h: 'Ceux de l\'IBAN que tu as communiqué à l\'entreprise, tel qu\'enregistré à la date des listes électorales. Ils servent à vérifier ton identité à la connexion.', r: 'PAP, art. 8.7.2.2' }
    ] },
    { t: 'Campagne', w: 'du 5 au 17 mars 2027', items: [
      { id: 'listes', l: 'Listes et professions de foi de mon collège', s: 'Consultées', h: 'Affichées le 5 mars, au même format pour toutes, par ordre alphabétique des organisations syndicales.', a: ['candidatures.html', 'Voir les listes'] },
      { id: 'identifiant', l: 'Mon identifiant, reçu par courrier', s: 'Reçu', h: 'Envoyé à ton domicile dès le 10 mars, avec la notice de vote. Il reste valable en cas de 2nd tour. Pas reçu ou perdu ? Voir la procédure A.', r: 'PAP, art. 8.7.2.3 et annexe 1' }
    ] },
    { t: 'Vote', w: 'du 18 mars 9h00 au 31 mars 16h00', items: [
      { id: 'connexion', l: 'Connexion au site de vote', s: 'Effectuée', h: 'Ton identifiant, puis les 5 derniers caractères de ton IBAN : ton mot de passe arrive sur ta messagerie pro, valable 1 heure. Pas reçu ? Voir la procédure B.', a: [VOTE, 'Aller sur le site de vote'] },
      { id: 'vote', l: 'Votes titulaires puis suppléant·es', s: 'Effectués', h: 'Deux votes à la suite, environ 3 minutes. Cette case reste sur ton appareil : rien n\'est transmis.' }
    ] }
  ];
  var PROCS = [
    { id: 'A', t: 'Identifiant non reçu ou perdu', r: 'PAP, art. 8.7.2.4', steps: [
      ['Niveau 1 · En autonomie', 'Sur le site de vote, remplis le formulaire dédié : nom, prénom, date de naissance et identifiant GPNet, puis le numéro de mobile de ton choix. Ton identifiant t\'est renvoyé par SMS, et un mail d\'information arrive sur ta messagerie pro.'],
      ['Niveau 2 · Avec la cellule RH', 'Pas d\'identifiant GPNet, informations non reconnues ou SMS impossible ? Remplis le formulaire de contact du site de vote (nom, prénom, adresse mail, téléphone). La cellule RH te rappelle pour vérifier ton identité, puis ton identifiant t\'est renvoyé par SMS. Tu peux aussi passer directement par ce niveau.']
    ] },
    { id: 'B', t: 'Mot de passe non reçu', r: 'PAP, art. 8.7.2.3 et 8.7.2.4', steps: [
      ['Vérifie ta messagerie pro', 'Le mot de passe y est envoyé automatiquement dès que tu as saisi ton identifiant et les 5 derniers caractères de ton IBAN.'],
      ['Plus d\'une heure ?', 'Il n\'est valable qu\'une heure : refais la procédure, un nouveau mot de passe t\'est adressé.'],
      ['Pas d\'accès à ta messagerie pro', 'Passe par la cellule RH (niveau 2) : formulaire de contact du site de vote. Après vérification de ton identité, le mot de passe est envoyé à l\'adresse mail que tu as indiquée.']
    ] },
    { id: 'C', t: 'Autre difficulté pendant le vote', r: 'PAP, art. 8.7.1 et 8.7.2.4', steps: [
      ['Assistance téléphonique 24h/24', 'Pendant chaque tour, à un numéro non surtaxé indiqué sur la notice, sur l\'intranet et sur le site de vote. Les opérateurs n\'ont jamais accès à tes codes ni à ton vote.'],
      ['Codes strictement personnels', 'Ne les communique à personne, même à un·e collègue : le vote par procuration est interdit.']
    ] }
  ];
  var ALL = []; PHASES.forEach(function (p) { p.items.forEach(function (i) { ALL.push(i.id); }); });

  var css = '' +
    '.ck{max-width:780px;margin:0 auto;background:#fff;color:#140D8A;border-radius:28px;overflow:hidden;box-shadow:0 34px 60px -34px rgba(20,13,138,.55),0 0 0 1px rgba(20,13,138,.06);text-align:left}' +
    '.ck-top{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 24px;background:#140D8A;color:#fff}' +
    '.ck-top b{display:block;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:120%;font-size:1.15rem;letter-spacing:.06em}' +
    '.ck-top small{display:block;font-size:.76rem;opacity:.7;margin-top:2px}' +
    '.ck-count{font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:115%;font-size:1.3rem;font-variant-numeric:tabular-nums;white-space:nowrap}' +
    '.ck-count span{opacity:.5;font-size:.8em}' +
    '.ck-bar{height:6px;background:#EAF0FF}.ck-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#F385FF,#05CE78);transition:width .5s cubic-bezier(.2,.8,.2,1)}' +
    '.ck-body{padding:8px 24px 22px}' +
    '.ck-ph{display:flex;align-items:baseline;gap:10px;margin:18px 0 6px;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}' +
    '.ck-ph b{font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-size:.85rem;letter-spacing:.1em}' +
    '.ck-ph span{opacity:.55}' +
    '.ck-it{border-bottom:1.5px dashed rgba(20,13,138,.12)}' +
    '.ck-line{display:flex;align-items:center;gap:10px}' +
    '.ck-row{display:flex;align-items:center;gap:12px;flex:1;min-width:0;padding:12px 2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}' +
    '.ck-row:focus-visible{outline:3px solid #0053FF;outline-offset:2px;border-radius:10px}' +
    '.ck-box{flex:none;width:24px;height:24px;border-radius:7px;border:2.5px solid #140D8A;display:grid;place-items:center;transition:background .2s,border-color .2s}' +
    '.ck-box svg{width:14px;height:14px;opacity:0;transform:scale(.5);transition:opacity .2s,transform .3s cubic-bezier(.2,.9,.3,1.4)}' +
    '.ck-l{font-weight:600;font-size:.98rem;line-height:1.3}' +
    '.ck-dots{flex:1;min-width:20px;border-bottom:2px dotted rgba(20,13,138,.25);transform:translateY(5px)}' +
    '.ck-s{flex:none;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:110%;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;opacity:.4;white-space:nowrap}' +
    '.ck-i{flex:none;width:28px;height:28px;border-radius:50%;border:0;background:#EAF4FF;color:#140D8A;font:700 .85rem var(--f-body,Arial,sans-serif);cursor:pointer}' +
    '.ck-i[aria-expanded="true"]{background:#140D8A;color:#fff}' +
    '.ck-h{display:none;margin:-4px 0 12px 36px;font-size:.88rem;line-height:1.45;opacity:.85}' +
    '.ck-h.on{display:block}' +
    '.ck-h a{font-weight:600;color:inherit;margin-left:4px}' +
    '.ck-h .ref{display:block;margin-top:4px;font-size:.74rem;font-weight:600;opacity:.6}' +
    '.ck-it.done .ck-box{background:#05CE78;border-color:#05CE78}' +
    '.ck-it.done .ck-box svg{opacity:1;transform:none}' +
    '.ck-it.done .ck-s{opacity:1;color:#01AB61}' +
    '.ck-end{display:none;align-items:center;gap:14px;margin-top:18px;padding:14px 18px;border-radius:18px;background:#E6FBF1}' +
    '.ck-end.on{display:flex}' +
    '.ck-end .pl{width:54px;flex:none}' +
    '.ck-end b{display:block;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:115%;font-size:1.05rem}' +
    '.ck-end small{font-size:.86rem;opacity:.8}' +
    '.ck-qrh{margin-top:22px;padding-top:6px}' +
    '.ck-qrh>p{display:flex;align-items:center;gap:10px;margin:12px 0 10px;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}' +
    '.ck-qrh>p b{background:#E20076;color:#fff;border-radius:6px;padding:.35em .6em;letter-spacing:.1em}' +
    '.ck-qrh>p span{opacity:.55}' +
    '.ck-pr{border-radius:16px;border:1.5px solid rgba(226,0,118,.25);margin-top:8px;overflow:hidden}' +
    '.ck-pr summary{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer;list-style:none;font-weight:600}' +
    '.ck-pr summary::-webkit-details-marker{display:none}' +
    '.ck-pr summary::after{content:"+";margin-left:auto;font-size:1.3rem;line-height:1;transition:transform .3s}' +
    '.ck-pr[open] summary::after{transform:rotate(45deg)}' +
    '.ck-tag{flex:none;width:28px;height:28px;border-radius:8px;background:#FFE3EF;color:#E20076;display:grid;place-items:center;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900}' +
    '.ck-pr ol{list-style:none;counter-reset:s;padding:0 16px 6px 56px}' +
    '.ck-pr li{position:relative;counter-increment:s;padding:0 0 12px;font-size:.88rem;line-height:1.45}' +
    '.ck-pr li::before{content:counter(s);position:absolute;left:-30px;top:1px;width:20px;height:20px;border-radius:50%;background:#140D8A;color:#fff;font-size:.7rem;font-weight:700;display:grid;place-items:center}' +
    '.ck-pr li b{display:block;font-weight:700;margin-bottom:2px}' +
    '.ck-pr .ref{display:block;padding:0 16px 14px 56px;font-size:.74rem;font-weight:600;opacity:.6}' +
    '.ck-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:18px;font-size:.78rem;opacity:.65}' +
    '.ck-foot button{border:0;background:none;color:inherit;font:600 .78rem var(--f-body,Arial,sans-serif);text-decoration:underline;cursor:pointer}' +
    '@media (max-width:560px){.ck{border-radius:22px}.ck-top{padding:16px 18px}.ck-body{padding:4px 16px 18px}.ck-dots{display:none}.ck-row{flex-wrap:wrap;gap:6px 12px}.ck-l{flex:1;min-width:0}.ck-s{order:5;width:100%;padding-left:36px}.ck-h{margin-left:36px}.ck-pr ol{padding-left:50px}.ck-pr .ref{padding-left:50px}}' +
    '@media (prefers-reduced-motion:reduce){.ck *{transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var TICK = '<svg viewBox="0 0 14 14" fill="none" stroke="#140D8A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 7.5 2.6 2.6L11 4.5"/></svg>';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  function render(el) {
    var done = load(), n = 0;
    el.innerHTML = '<div class="ck" role="group" aria-label="Checklist avant vol">' +
      '<div class="ck-top"><div><b>CHECKLIST AVANT VOL</b><small>J\'ai tout ce qu\'il faut pour voter ?</small></div><div class="ck-count" aria-live="polite"><em class="ck-n" style="font-style:normal">0</em><span> / ' + ALL.length + '</span></div></div>' +
      '<div class="ck-bar"><i></i></div><div class="ck-body">' +
      PHASES.map(function (p) {
        return '<div class="ck-ph"><b>' + p.t + '</b><span>' + p.w + '</span></div>' + p.items.map(function (i) {
          var hid = 'ckh-' + i.id + '-' + (n++);
          return '<div class="ck-it" data-id="' + i.id + '"><div class="ck-line"><div class="ck-row" role="checkbox" tabindex="0" aria-checked="false">' +
            '<span class="ck-box">' + TICK + '</span><span class="ck-l">' + i.l + '</span><span class="ck-dots" aria-hidden="true"></span>' +
            '<span class="ck-s" data-s="' + i.s + '">À vérifier</span></div>' +
            '<button type="button" class="ck-i" aria-expanded="false" aria-controls="' + hid + '" aria-label="Comment faire : ' + i.l + '">?</button></div>' +
            '<p class="ck-h" id="' + hid + '">' + i.h + (i.a ? ' <a href="' + i.a[0] + '"' + (/^http/.test(i.a[0]) ? ' target="_blank" rel="noopener"' : '') + '>' + i.a[1] + ' →</a>' : '') + (i.r ? '<span class="ref">📘 ' + i.r + '</span>' : '') + '</p></div>';
        }).join('');
      }).join('') +
      '<div class="ck-end"><span class="pl" data-plane="route"></span><div><b>Checklist terminée. Prêt·e au décollage !</b><small>Merci d\'avoir fait entendre ta voix.</small></div></div>' +
      '<div class="ck-qrh"><p><b>QRH</b><span>Procédures anormales</span></p>' +
      PROCS.map(function (p) {
        return '<details class="ck-pr"><summary><span class="ck-tag">' + p.id + '</span>' + p.t + '</summary><ol>' +
          p.steps.map(function (s) { return '<li><b>' + s[0] + '</b>' + s[1] + '</li>'; }).join('') + '</ol><span class="ref">📘 ' + p.r + '</span></details>';
      }).join('') + '</div>' +
      '<div class="ck-foot"><span>Tes cases restent sur ton appareil : rien n\'est transmis.</span><button type="button" class="ck-reset">Tout décocher</button></div>' +
      '</div></div>';
    if (window.planeFill) planeFill(el);

    function update(anim) {
      var d = load(), c = 0;
      [].forEach.call(el.querySelectorAll('.ck-it'), function (it) {
        var on = d.indexOf(it.dataset.id) > -1, s = it.querySelector('.ck-s');
        it.classList.toggle('done', on); if (on) c++;
        it.querySelector('.ck-row').setAttribute('aria-checked', on);
        s.textContent = on ? s.dataset.s : 'À vérifier';
      });
      el.querySelector('.ck-n').textContent = c;
      el.querySelector('.ck-bar i').style.width = (c / ALL.length * 100) + '%';
      el.querySelector('.ck-end').classList.toggle('on', c === ALL.length);
    }
    function toggle(it) {
      var d = load(), id = it.dataset.id, k = d.indexOf(id);
      if (k > -1) d.splice(k, 1); else d.push(id);
      save(d); update(true);
    }
    el.addEventListener('click', function (e) {
      var info = e.target.closest('.ck-i');
      if (info) { var h = document.getElementById(info.getAttribute('aria-controls')), on = !h.classList.contains('on'); h.classList.toggle('on', on); info.setAttribute('aria-expanded', on); return; }
      if (e.target.closest('.ck-reset')) { save([]); update(); return; }
      var row = e.target.closest('.ck-row'); if (row) toggle(row.closest('.ck-it'));
    });
    el.addEventListener('keydown', function (e) {
      var row = e.target.closest && e.target.closest('.ck-row');
      if (row && e.target === row && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); toggle(row.closest('.ck-it')); }
    });
    update();
  }
  [].forEach.call(document.querySelectorAll('[data-checklist]'), render);
})();
