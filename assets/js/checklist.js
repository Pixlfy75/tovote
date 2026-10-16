/* TO VOTE · Envol — la checklist avant vol (« J'ai tout ce qu'il faut pour voter ? »).
   Se place n'importe où : <div data-checklist></div> puis <script src="checklist.js"></script>.
   Chaque point s'ouvre sur une petite action (trouver son collège, dire si l'identifiant est arrivé…) ;
   une fois validé, le point suivant s'ouvre. Les messages suivent le calendrier électoral.
   Tout reste sur l'appareil (localStorage) : rien n'est transmis.
   Procédures de secours conformes au PAP du 13 octobre 2026 (art. 7.3, 8.7.1 à 8.7.2.4). */
(function () {
  var VOTE = 'https://www.transavia.webvote.fr/', KEY = 'tv_checklist', MAIL = 'to-vote@fr.transavia.com';
  /* dates du PAP (heure de Paris) */
  var D = {
    liste: '2027-02-22T00:00:00+01:00', reclam: '2027-02-25T23:59:59+01:00', listes: '2027-03-05T00:00:00+01:00',
    courrier: '2027-03-10T00:00:00+01:00', ouverture: '2027-03-18T09:00:00+01:00', cloture: '2027-03-31T16:00:00+02:00'
  };
  function t(k) { return Date.parse(D[k]); }
  function inDays(k) { var n = Math.ceil((t(k) - Date.now()) / 864e5); return n <= 1 ? (n === 1 ? 'demain' : 'aujourd\'hui') : 'dans ' + n + ' jours'; }
  var COL = {
    pnc: { n: 'PNC', no: '4e collège', seats: 15, jobs: ['Hôtesse', 'Steward', 'Chef·fe de cabine'] },
    pnt: { n: 'PNT', no: '3e collège', seats: 10, jobs: ['Commandant·e de bord', 'Officier·e pilote'] },
    cadre: { n: 'Cadres', no: '2e collège', seats: 3, jobs: ['Cadre des services au sol'] },
    etam: { n: 'ETAM', no: '1er collège', seats: 2, jobs: ['Agent d\'escale', 'Technicien·ne', 'Employé·e', 'Agent de maîtrise'] }
  };

  /* Les points : l libellé, s statut une fois validé, h aide, r référence, w petite action */
  var PHASES = [
    { t: 'Préparation', w: 'avant le 25 février 2027', items: [
      { id: 'liste', l: 'Inscription sur la liste électorale', s: 'Vérifiée', r: 'PAP, art. 7.3', w: wListe },
      { id: 'college', l: 'Mon collège', s: 'Vérifié', w: wCollege },
      { id: 'adresse', l: 'Mon adresse postale', s: 'À jour', r: 'PAP, art. 8.7.2.3', w: wAdresse }
    ] },
    { t: 'Campagne', w: 'du 5 au 17 mars 2027', items: [
      { id: 'listes', l: 'Listes et professions de foi de mon collège', s: 'Consultées', w: wListes },
      { id: 'identifiant', l: 'Mon identifiant, reçu par courrier', s: 'Reçu', r: 'PAP, art. 8.7.2.3 et annexe 1', w: wIdentifiant }
    ] },
    { t: 'Vote', w: 'du 18 mars 9h00 au 31 mars 16h00', items: [
      { id: 'iban', l: 'Les 5 derniers caractères de mon IBAN', s: 'Sous la main', r: 'PAP, art. 8.7.2.2', w: wIban },
      { id: 'connexion', l: 'Connexion au site de vote', s: 'Effectuée', r: 'PAP, art. 8.7.2.3', w: wConnexion },
      { id: 'vote', l: 'Votes titulaires puis suppléant·es', s: 'Effectués', w: wVote }
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
  var ALL = []; PHASES.forEach(function (p) { p.items.forEach(function (i) { ALL.push(i); }); });

  /* ---------- Petites actions de chaque point ----------
     Chaque fonction renvoie le contenu du panneau ; les boutons portent data-act (traité plus bas). */
  function ok(label) { return '<button type="button" class="ck-ok" data-act="done">' + (label || 'C\'est fait') + ' ✓</button>'; }
  function proc(id, label) { return '<button type="button" class="ck-b ck-pb" data-act="proc" data-p="' + id + '">' + label + '</button>'; }
  function wListe() {
    var now = Date.now(), when = now < t('liste') ? 'Elle est publiée sur l\'intranet le 22 février 2027, ' + inDays('liste') + '.'
      : now <= t('reclam') ? 'Elle est en ligne. Une erreur ? Tu as jusqu\'au 25 février 2027 à minuit pour la signaler aux RH.'
      : 'La liste définitive est publiée depuis le 26 février 2027 : plus de réclamation possible auprès des RH.';
    return '<p>' + when + ' Vérifie ton nom, ton collège, ton âge et ton ancienneté.</p><div class="ck-acts">' +
      '<a class="ck-b" href="documents.html#listes-provisoires">Consulter la liste</a>' +
      (now <= t('reclam') ? '<a class="ck-b" href="mailto:' + MAIL + '?subject=' + encodeURIComponent('Liste électorale : demande de rectification') + '">Signaler une erreur</a>' : '') +
      ok('Je suis bien inscrit·e') + '</div>';
  }
  function wCollege(st) {
    var cur = st.col && COL[st.col];
    return '<p>' + (cur ? 'Tu votes dans le ' + cur.no + ', <b>' + cur.n + '</b> : ' + cur.seats + ' sièges titulaires. Pas le bon ? Choisis-en un autre.' : 'Choisis ton collège : tu voteras uniquement pour ses listes.') + '</p>' +
      '<div class="ck-acts">' + Object.keys(COL).map(function (k) { return '<button type="button" class="ck-c' + (st.col === k ? ' on' : '') + '" data-act="col" data-col="' + k + '">' + COL[k].n + '</button>'; }).join('') +
      '<button type="button" class="ck-c ghost" data-act="jobs">Je ne sais pas</button></div>' +
      '<div class="ck-jobs" hidden><p>Quel est ton métier ?</p><div class="ck-acts">' +
      Object.keys(COL).map(function (k) { return COL[k].jobs.map(function (j) { return '<button type="button" class="ck-c" data-act="col" data-col="' + k + '">' + j + '</button>'; }).join(''); }).join('') +
      '</div><p class="ck-small">En cas de doute, ton collège figure sur la liste électorale.</p></div>';
  }
  function wAdresse() {
    var before = Date.now() < t('courrier');
    return '<p>Ton identifiant arrive par courrier, à l\'adresse connue de l\'entreprise à la date d\'arrêt des listes électorales. ' +
      (before ? 'Envoi dès le 10 mars, ' + inDays('courrier') + ' : vérifie-la dès maintenant dans ton espace RH.' : 'Le courrier est parti : si tu as déménagé, voir la procédure A.') + '</p>' +
      '<div class="ck-acts">' + (before ? '' : proc('A', 'Procédure A')) + ok('Mon adresse est à jour') + '</div>';
  }
  function wListes(st) {
    var c = st.col && COL[st.col], before = Date.now() < t('listes');
    return '<p>' + (before ? 'Les listes sont affichées le 5 mars, ' + inDays('listes') + ', au même format pour toutes, par ordre alphabétique des organisations syndicales.'
      : 'Elles sont en ligne, au même format pour toutes, par ordre alphabétique des organisations syndicales.') + '</p>' +
      '<div class="ck-acts"><a class="ck-b" href="candidatures.html' + (c ? '#' + st.col : '') + '">' + (c ? 'Voir les listes ' + c.n : 'Voir les listes') + '</a>' + ok('Je les ai lues') + '</div>';
  }
  function wIdentifiant(st) {
    var now = Date.now(), r = st.idAns;
    var ans = r === 'wait' ? (now < t('courrier') ? 'C\'est normal : l\'envoi commence le 10 mars, ' + inDays('courrier') + '.' : 'Le courrier est parti : laisse-lui quelques jours. Toujours rien ? Lance la procédure A.')
      : r === 'lost' ? 'Aucun problème : tu peux le redemander sur le site de vote et le recevoir par SMS.' : '';
    return '<p>Il arrive à ton domicile dès le 10 mars, avec la notice de vote. Il reste valable en cas de 2nd tour. Tu l\'as reçu ?</p>' +
      '<div class="ck-acts"><button type="button" class="ck-c" data-act="done">Oui ✓</button>' +
      '<button type="button" class="ck-c' + (r === 'wait' ? ' on' : '') + '" data-act="id" data-v="wait">Pas encore</button>' +
      '<button type="button" class="ck-c' + (r === 'lost' ? ' on' : '') + '" data-act="id" data-v="lost">Je l\'ai perdu</button></div>' +
      (ans ? '<p class="ck-warn">' + ans + (r === 'lost' || now >= t('courrier') ? ' ' + proc('A', 'Voir la procédure A') : '') + '</p>' : '');
  }
  function wIban() {
    return '<p>À la connexion, le site te demande les 5 derniers caractères de l\'IBAN que tu as communiqué à l\'entreprise. Ce sont ceux-là :</p>' +
      '<div class="ck-iban" aria-label="Exemple d\'IBAN : les 5 derniers caractères sont mis en évidence"><span>FR76</span><span>••••</span><span>••••</span><span>••••</span><span>••••</span><span>••<b>45</b></span><span><b>678</b></span></div>' +
      '<p class="ck-small">Tu les trouves sur ton RIB ou dans ton appli bancaire. Seul le site de vote te les demande : ne les communique jamais à personne.</p>' +
      '<div class="ck-acts">' + ok('Je les ai sous la main') + '</div>';
  }
  function wConnexion() {
    var now = Date.now(), open = now >= t('ouverture') && now < t('cloture');
    var when = now < t('ouverture') ? 'Le vote ouvre le 18 mars à 9h00, ' + inDays('ouverture') + '.' : open ? 'Le vote est ouvert jusqu\'au 31 mars à 16h00.' : 'Le 1er tour est clos.';
    return '<p>' + when + ' Saisis ton identifiant, puis les 5 derniers caractères de ton IBAN : ton mot de passe arrive sur ta messagerie pro, valable 1 heure.</p>' +
      '<div class="ck-acts">' + (open ? '<a class="ck-b ink" href="' + VOTE + '" target="_blank" rel="noopener">Aller sur le site de vote ↗</a>' : '') +
      proc('B', 'Mot de passe pas reçu ?') + proc('A', 'Identifiant perdu ?') + ok('Je suis connecté·e') + '</div>';
  }
  function wVote(st) {
    var v = st.votes || {};
    return '<p>Deux votes à la suite, environ 3 minutes. Coche au fur et à mesure : cela reste sur ton appareil, rien n\'est transmis.</p>' +
      '<div class="ck-acts"><button type="button" class="ck-c' + (v.t ? ' on' : '') + '" data-act="vote" data-v="t">' + (v.t ? '✓ ' : '') + 'Titulaires</button>' +
      '<button type="button" class="ck-c' + (v.s ? ' on' : '') + '" data-act="vote" data-v="s">' + (v.s ? '✓ ' : '') + 'Suppléant·es</button></div>';
  }

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
    '.ck-line{display:flex;align-items:center;gap:12px}' +
    '.ck-box{flex:none;width:24px;height:24px;padding:0;border-radius:7px;border:2.5px solid #140D8A;background:#fff;display:grid;place-items:center;cursor:pointer;transition:background .2s,border-color .2s}' +
    '.ck-box svg{width:14px;height:14px;opacity:0;transform:scale(.5);transition:opacity .2s,transform .3s cubic-bezier(.2,.9,.3,1.4)}' +
    '.ck-box:focus-visible,.ck-row:focus-visible{outline:3px solid #0053FF;outline-offset:2px;border-radius:10px}' +
    '.ck-row{display:flex;align-items:center;gap:12px;flex:1;min-width:0;padding:13px 2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}' +
    '.ck-l{font-weight:600;font-size:.98rem;line-height:1.3}' +
    '.ck-dots{flex:1;min-width:20px;border-bottom:2px dotted rgba(20,13,138,.25);transform:translateY(5px)}' +
    '.ck-s{flex:none;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:110%;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;opacity:.4;white-space:nowrap}' +
    '.ck-chev{flex:none;width:12px;height:12px;opacity:.5;transition:transform .3s}' +
    '.ck-it.open .ck-chev{transform:rotate(180deg)}' +
    '.ck-p{display:none;margin:0 0 14px 36px;padding:14px 16px;border-radius:16px;background:#F3F6FF;font-size:.9rem;line-height:1.45}' +
    '.ck-it.open .ck-p{display:block;animation:ck-in .35s cubic-bezier(.2,.9,.3,1.2)}' +
    '@keyframes ck-in{from{opacity:0;transform:translateY(-6px)}}' +
    '.ck-p p+p,.ck-p p+.ck-acts,.ck-p .ck-acts+p,.ck-p .ck-acts+.ck-jobs,.ck-p .ck-iban+p{margin-top:10px}' +
    '.ck-p .ref{display:block;margin-top:10px;font-size:.74rem;font-weight:600;opacity:.6}' +
    '.ck-small{font-size:.8rem;opacity:.75}' +
    '.ck-warn{padding:10px 12px;border-radius:12px;background:#FFF1E8;border-left:4px solid #FF8867}' +
    '.ck-acts{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
    '.ck-b,.ck-c,.ck-ok{display:inline-flex;align-items:center;gap:6px;padding:.55em 1em;border-radius:999px;font:600 .84rem var(--f-body,Arial,sans-serif);text-decoration:none;cursor:pointer;border:1.5px solid rgba(20,13,138,.18);background:#fff;color:#140D8A}' +
    '.ck-b.ink{background:#140D8A;border-color:#140D8A;color:#fff}' +
    '.ck-pb{border-color:rgba(226,0,118,.35);color:#B4005E}' +
    '.ck-c.on{background:#140D8A;border-color:#140D8A;color:#fff}' +
    '.ck-c.ghost{border-style:dashed}' +
    '.ck-ok{background:#05CE78;border-color:#05CE78;color:#140D8A}' +
    '.ck-b:focus-visible,.ck-c:focus-visible,.ck-ok:focus-visible{outline:3px solid #0053FF;outline-offset:2px}' +
    '.ck-jobs{margin-top:12px;padding-top:12px;border-top:1.5px dashed rgba(20,13,138,.14)}' +
    '.ck-jobs>p:first-child{font-weight:600;margin-bottom:8px}' +
    '.ck-iban{display:flex;flex-wrap:wrap;gap:6px;font:700 1.02rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.06em}' +
    '.ck-iban span{padding:.5em .55em;border-radius:8px;background:#fff;border:1.5px solid rgba(20,13,138,.12)}' +
    '.ck-iban b{color:#140D8A;background:#B8F5D8;border-radius:4px;padding:0 1px;animation:ck-glow 1.8s ease-in-out infinite}' +
    '@keyframes ck-glow{50%{background:#05CE78}}' +
    '.ck-it.done .ck-box{background:#05CE78;border-color:#05CE78}' +
    '.ck-it.done .ck-box svg{opacity:1;transform:none}' +
    '.ck-it.done .ck-s{opacity:1;color:#01AB61}' +
    '.ck-end{display:none;align-items:center;gap:14px;margin-top:18px;padding:14px 18px;border-radius:18px;background:#E6FBF1}' +
    '.ck-end.on{display:flex;animation:ck-in .5s cubic-bezier(.2,.9,.3,1.2)}' +
    '.ck-end .pl{width:54px;flex:none}' +
    '.ck-end b{display:block;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:115%;font-size:1.05rem}' +
    '.ck-end small{font-size:.86rem;opacity:.8}' +
    '.ck-qrh{margin-top:22px;padding-top:6px}' +
    '.ck-qrh>p{display:flex;align-items:center;gap:10px;margin:12px 0 10px;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}' +
    '.ck-qrh>p b{background:#E20076;color:#fff;border-radius:6px;padding:.35em .6em;letter-spacing:.1em}' +
    '.ck-qrh>p span{opacity:.55}' +
    '.ck-pr{border-radius:16px;border:1.5px solid rgba(226,0,118,.25);margin-top:8px;overflow:hidden;transition:box-shadow .4s}' +
    '.ck-pr.flash{box-shadow:0 0 0 4px rgba(226,0,118,.35)}' +
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
    '@media (max-width:560px){.ck{border-radius:22px}.ck-top{padding:16px 18px}.ck-body{padding:4px 16px 18px}.ck-dots{display:none}.ck-row{flex-wrap:wrap;gap:4px 10px}.ck-l{flex:1;min-width:0}.ck-s{order:5;width:100%}.ck-p{margin-left:0}.ck-pr ol{padding-left:50px}.ck-pr .ref{padding-left:50px}}' +
    '@media (prefers-reduced-motion:reduce){.ck *{transition:none!important;animation:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var TICK = '<svg viewBox="0 0 14 14" fill="none" stroke="#140D8A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 7.5 2.6 2.6L11 4.5"/></svg>';
  var CHEV = '<svg class="ck-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg>';
  /* état : { done: [...], col, idAns, votes: { t, s } } (ancienne version : simple liste) */
  function load() {
    var v; try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (Array.isArray(v)) v = { done: v };
    v = v || {}; v.done = v.done || []; return v;
  }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  function render(el) {
    var n = 0, open = null;
    el.innerHTML = '<div class="ck" role="group" aria-label="Checklist avant vol">' +
      '<div class="ck-top"><div><b>CHECKLIST AVANT VOL</b><small>J\'ai tout ce qu\'il faut pour voter ?</small></div><div class="ck-count" aria-live="polite"><em class="ck-n" style="font-style:normal">0</em><span> / ' + ALL.length + '</span></div></div>' +
      '<div class="ck-bar"><i></i></div><div class="ck-body">' +
      PHASES.map(function (p) {
        return '<div class="ck-ph"><b>' + p.t + '</b><span>' + p.w + '</span></div>' + p.items.map(function (i) {
          var pid = 'ckp-' + i.id + '-' + (n++);
          return '<div class="ck-it" data-id="' + i.id + '"><div class="ck-line">' +
            '<button type="button" class="ck-box" role="checkbox" aria-checked="false" aria-label="' + i.l + '">' + TICK + '</button>' +
            '<button type="button" class="ck-row" aria-expanded="false" aria-controls="' + pid + '"><span class="ck-l">' + i.l + '</span><span class="ck-dots" aria-hidden="true"></span><span class="ck-s">À vérifier</span>' + CHEV + '</button></div>' +
            '<div class="ck-p" id="' + pid + '"></div></div>';
        }).join('');
      }).join('') +
      '<div class="ck-end"><span class="pl" data-plane="route"></span><div><b>Checklist terminée. Prêt·e au décollage !</b><small>Merci d\'avoir fait entendre ta voix.</small></div></div>' +
      '<div class="ck-qrh"><p><b>QRH</b><span>Procédures anormales</span></p>' +
      PROCS.map(function (p) {
        return '<details class="ck-pr" data-p="' + p.id + '"><summary><span class="ck-tag">' + p.id + '</span>' + p.t + '</summary><ol>' +
          p.steps.map(function (s) { return '<li><b>' + s[0] + '</b>' + s[1] + '</li>'; }).join('') + '</ol><span class="ref">📘 ' + p.r + '</span></details>';
      }).join('') + '</div>' +
      '<div class="ck-foot"><span>Tout reste sur ton appareil : rien n\'est transmis.</span><button type="button" class="ck-reset">Tout recommencer</button></div>' +
      '</div></div>';
    if (window.planeFill) planeFill(el);
    var item = function (id) { return el.querySelector('.ck-it[data-id="' + id + '"]'); };
    var def = function (id) { return ALL.filter(function (i) { return i.id === id; })[0]; };

    function fillPanel(id) {
      var s = load(), i = def(id);
      item(id).querySelector('.ck-p').innerHTML = i.w(s) + (i.r ? '<span class="ref">📘 ' + i.r + '</span>' : '');
    }
    function update() {
      var s = load(), c = 0;
      ALL.forEach(function (i) {
        var it = item(i.id), on = s.done.indexOf(i.id) > -1;
        it.classList.toggle('done', on); if (on) c++;
        it.querySelector('.ck-box').setAttribute('aria-checked', on);
        it.querySelector('.ck-s').textContent = on ? (i.id === 'college' && s.col ? COL[s.col].n : i.s) : 'À vérifier';
      });
      el.querySelector('.ck-n').textContent = c;
      el.querySelector('.ck-bar i').style.width = (c / ALL.length * 100) + '%';
      el.querySelector('.ck-end').classList.toggle('on', c === ALL.length);
    }
    function setOpen(id) {
      if (open) { var o = item(open); o.classList.remove('open'); o.querySelector('.ck-row').setAttribute('aria-expanded', 'false'); }
      open = id && id !== open ? id : null;
      if (open) { fillPanel(open); var it = item(open); it.classList.add('open'); it.querySelector('.ck-row').setAttribute('aria-expanded', 'true'); }
    }
    function setDone(id, on, advance) {
      var s = load(), k = s.done.indexOf(id);
      if (on && k < 0) s.done.push(id); if (!on && k > -1) s.done.splice(k, 1);
      save(s); update();
      if (on && advance) { /* le point suivant non validé s'ouvre */
        var next = ALL.filter(function (i) { return s.done.indexOf(i.id) < 0; })[0];
        setOpen(next ? next.id : null);
        if (next) setTimeout(function () { var r = item(next.id).getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight - 40) item(next.id).scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      } else if (open) fillPanel(open);
    }
    function showProc(p) {
      var d = el.querySelector('.ck-pr[data-p="' + p + '"]'); d.open = true;
      d.scrollIntoView({ behavior: 'smooth', block: 'center' });
      d.classList.add('flash'); setTimeout(function () { d.classList.remove('flash'); }, 1600);
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('button, a'); if (!b || !el.contains(b)) return;
      var it = b.closest('.ck-it'), id = it && it.dataset.id, s = load();
      if (b.classList.contains('ck-reset')) { save({ done: [] }); update(); setOpen(null); return; }
      if (b.classList.contains('ck-box')) { setDone(id, s.done.indexOf(id) < 0, false); return; }
      if (b.classList.contains('ck-row')) { setOpen(id); return; }
      var act = b.dataset.act; if (!act) return;
      if (act === 'done') setDone(id, true, true);
      else if (act === 'proc') showProc(b.dataset.p);
      else if (act === 'jobs') { var j = it.querySelector('.ck-jobs'); j.hidden = !j.hidden; }
      else if (act === 'col') { s.col = b.dataset.col; save(s); setDone('college', true, true); }
      else if (act === 'id') { s.idAns = s.idAns === b.dataset.v ? null : b.dataset.v; save(s); fillPanel(id); }
      else if (act === 'vote') {
        s.votes = s.votes || {}; s.votes[b.dataset.v] = !s.votes[b.dataset.v]; save(s);
        if (s.votes.t && s.votes.s) setDone('vote', true, true); else { setDone('vote', false, false); fillPanel(id); }
      }
    });
    update();
    /* au départ, le premier point à faire est ouvert */
    var first = ALL.filter(function (i) { return load().done.indexOf(i.id) < 0; })[0];
    if (first) setOpen(first.id);
  }
  [].forEach.call(document.querySelectorAll('[data-checklist]'), render);
})();
