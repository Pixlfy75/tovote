/* TO VOTE · Envol — script de la page cse.html */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)};
let ci=0;$$('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));

/* ---------- Personnages ---------- */
$('#crewRow').innerHTML=['pnc','pnt','cadre','etam'].map(k=>`<div class="bob">${charSVG(k)}</div>`).join('');
if(!reduce)setInterval(()=>{const v=$$('.char').filter(s=>{const r=s.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0});if(v.length)wave(v[Math.random()*v.length|0])},3400);

/* ---------- Plan de cabine : 30 titulaires et 30 suppléant·es (PAP du 13 octobre 2026, art. 5) ----------
   Répartition par collège : PNC 15, PNT 10, Cadres 3, ETAM 2. Représentant·es syndicaux : nombre d'exemple. */
const COLS=[['pnc','PNC',15,'4e collège'],['pnt','PNT',10,'3e collège'],['cadre','Cadres',3,'2e collège'],['etam','ETAM',2,'1er collège']];
const byCol=[];COLS.forEach(([k,,n])=>{for(let j=0;j<n;j++)byCol.push(k)});
const ROLES={
  pres:{n:'Président·e',c:'r-pres',v:'Ne vote pas sur les avis',vd:false,t:'L\'employeur, ou son représentant, préside le CSE. Il fixe l\'ordre du jour avec le ou la secrétaire, informe et consulte les élu·es. Il ne participe pas au vote quand il consulte les élu·es.',r:'Art. L.2315-23 et L.2315-32 C. trav.'},
  collab:{n:'Collaborateur·rices',c:'r-collab',v:'Voix consultative',vd:false,t:'Le ou la président·e peut être assisté·e d\'au plus trois collaborateur·rices, qui participent aux échanges sans voter.',r:'Art. L.2315-23 C. trav.'},
  tit:{n:'Élu·es titulaires',c:'r-tit',v:'Voix délibérative',vd:true,t:'Ce sont les personnes que tu élis. Elles siègent, votent les avis et résolutions du CSE et disposent d\'heures de délégation.',r:'Art. L.2314-1 et L.2315-7 C. trav.'},
  sec:{n:'Secrétaire',c:'r-tit',v:'Voix délibérative',vd:true,t:'Élu·e titulaire désigné·e par le CSE. Il ou elle établit l\'ordre du jour avec le ou la président·e et rédige les procès-verbaux des réunions.',r:'Art. L.2315-23 C. trav.'},
  tre:{n:'Trésorier·e',c:'r-tit',v:'Voix délibérative',vd:true,t:'Élu·e titulaire désigné·e par le CSE. Il ou elle suit les budgets et les comptes du comité.',r:'Art. L.2315-23 C. trav.'},
  sup:{n:'Élu·es suppléant·es',c:'r-sup',v:'Siègent en remplacement',vd:false,t:'Tu les élis aussi. Ils et elles remplacent un·e titulaire absent·e et assistent alors aux réunions à sa place.',r:'Art. L.2314-1 C. trav.'},
  rs:{n:'Représentant·es syndicaux',c:'r-rs',v:'Voix consultative',vd:false,t:'Chaque organisation syndicale représentative peut désigner un·e représentant·e au CSE, qui assiste aux réunions sans voter.',r:'Art. L.2314-2 C. trav.'},
};
const LIST=[['pres'],['collab'],['collab'],['collab'],...byCol.map(c=>['tit',c]),['rs'],['rs'],['rs'],null,...byCol.map(c=>['sup',c])];
LIST[4]=['sec',byCol[0]];LIST[5]=['tre',byCol[1]];
let html='',i=0;
for(let col=0;i<LIST.length;col++){for(let r=0;r<5;r++){if(r===2){html+=`<div class="aisle" aria-hidden="true"><span></span></div>`;continue}
  const it=LIST[i++];if(!it){html+='<div></div>';continue}const k=it[0],R=ROLES[k];
  html+=`<button class="seat ${R.c}" data-r="${k}"${it[1]?` data-c="${it[1]}"`:''} ${k==='sec'?'data-badge="S"':k==='tre'?'data-badge="T"':''} aria-label="${R.n}"><span class="b">${k==='sec'?'S':'T'}</span></button>`}}
$('#seats').innerHTML=html;
const LEG=[['tit','r-tit'],['sup','r-sup'],['pres','r-pres'],['collab','r-collab'],['rs','r-rs']];
$('#legend').innerHTML=LEG.map(([k,c])=>`<button data-r="${k}" aria-pressed="false"><i class="${c}"></i>${ROLES[k].n}</button>`).join('');
function showRole(k){const R=ROLES[k],group=k==='sec'||k==='tre'?[k]:k==='tit'?['tit','sec','tre']:[k];
  $('#cabin').classList.add('focus');$('#cabin').classList.remove('bycol');$$('#colbar button').forEach(b=>b.setAttribute('aria-pressed',false));$$('.seat').forEach(s=>s.classList.toggle('hl',group.includes(s.dataset.r)));
  $$('#legend button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.r===k||(k!=='tit'&&group.includes(b.dataset.r))));
  const count=$$('.seat').filter(s=>group.includes(s.dataset.r)).length;
  $('#info').innerHTML=`<div class="swap"><span class="chip"><i></i>${count} siège${count>1?'s':''}</span><div class="role">${R.n}</div><span class="vote ${R.vd?'d':''}">${R.v}</span><p>${R.t}</p><p class="ref">${R.r}</p></div>`}
$$('.seat,#legend button').forEach(b=>b.onclick=()=>showRole(b.dataset.r));
$('#colbar').innerHTML+=COLS.map(([k,n,c])=>`<button data-col="${k}" aria-pressed="false">${n}<small>${c}</small></button>`).join('');
$$('#colbar button').forEach(b=>b.onclick=()=>{const [k,n,c,no]=COLS.find(x=>x[0]===b.dataset.col);
  $('#cabin').classList.add('focus','bycol');$$('.seat').forEach(s=>s.classList.toggle('hl',s.dataset.c===k));
  $$('#legend button').forEach(x=>x.setAttribute('aria-pressed',false));$$('#colbar button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  $('#info').innerHTML=`<div class="swap"><span class="chip"><i></i>${no}</span><div class="role">${n}</div><span class="vote d">${c} titulaires + ${c} suppléant·es</span><p>Les salarié·es du collège ${n} élisent ${c} titulaire${c>1?'s':''} et autant de suppléant·es. Le ou la secrétaire et le ou la trésorier·e sont désigné·es ensuite parmi les titulaires, quel que soit leur collège.</p><p class="ref">PAP du 13 octobre 2026, art. 5.2</p></div>`});
$('#info').innerHTML=`<span class="chip"><i></i>Plan de cabine</span><div class="role">Touche un siège</div><p>Chaque siège représente une personne qui participe au CSE. Les couleurs indiquent son rôle et si elle vote ou non.</p><p><strong>30 titulaires et 30 suppléant·es</strong> : 26 sièges légaux, plus 4 sièges supplémentaires accordés par le protocole d'accord préélectoral.</p><p class="ref">PAP du 13 octobre 2026, art. 5 · Art. R.2314-1 C. trav. · représentant·es syndicaux : nombre d'exemple</p>`;

/* ---------- Missions ---------- */
const S='stroke="#140D8A" stroke-width="3"';
const MISSIONS=[
  {t:'Être consulté',p:'La direction informe le CSE et recueille son avis avant de décider sur la marche de l\'entreprise.',ex:'Une nouvelle organisation des plannings ou un nouvel outil de travail : le CSE est consulté avant la mise en place.',m:['Organisation, gestion et marche générale de l\'entreprise','Introduction de nouvelles technologies','Trois consultations récurrentes : orientations stratégiques, situation économique et financière, politique sociale'],r:'Art. L.2312-8 et L.2312-17 C. trav.',
   ico:`<rect x="18" y="14" width="70" height="52" rx="8" fill="#fff" ${S}/><path d="M30 30h46M30 42h34" ${S} stroke-linecap="round"/><path d="M76 50h26l8 8-8 8H76z" fill="#05CE78" ${S} stroke-linejoin="round"/><path d="M84 58l4 4 8-8" stroke="#140D8A" stroke-width="3" fill="none" stroke-linecap="round"/>`},
  {t:'Porter tes réclamations',p:'Les élu·es présentent à la direction les réclamations individuelles et collectives des salarié·es.',ex:'Une question sur ta paie, une prime, l\'application d\'un accord : tu peux passer par un·e élu·e.',m:['Salaires et rémunération','Application du Code du travail et des accords','Les élu·es peuvent saisir l\'inspection du travail'],r:'Art. L.2312-5 C. trav.',
   ico:`<path d="M18 30h44l14-14v50L62 52H18z" fill="#F385FF" ${S} stroke-linejoin="round"/><path d="M84 28c8 4 8 20 0 24M92 20c14 8 14 32 0 40" ${S} fill="none" stroke-linecap="round"/><path d="M30 52l6 18h10l-4-18" fill="#fff" ${S} stroke-linejoin="round"/>`},
  {t:'Veiller à ta santé et ta sécurité',p:'Le CSE agit pour la santé, la sécurité et les conditions de travail, avec une commission dédiée (CSSCT).',ex:'Fatigue, temps de repos, équipements, risques en escale : le CSE analyse, inspecte et propose.',m:['Analyse des risques professionnels et inspections','Enquêtes après accident du travail','Droit d\'alerte en cas de danger grave et imminent','Commission santé, sécurité et conditions de travail (CSSCT) dans les entreprises d\'au moins 300 salarié·es'],r:'Art. L.2312-9, L.2312-60 et L.2315-36 C. trav.',
   ico:`<path d="M60 10l36 14v20c0 22-16 34-36 40-20-6-36-18-36-40V24z" fill="#fff" ${S} stroke-linejoin="round"/><path d="M60 30v30M45 45h30" stroke="#05CE78" stroke-width="9" stroke-linecap="round"/>`},
  {t:'Gérer les activités sociales',p:'Le CSE gère les activités sociales et culturelles au bénéfice des salarié·es et de leur famille.',ex:'Billetterie, chèques vacances, sport, culture, événements : ce sont tes élu·es qui décident de l\'offre.',m:['Budget ASC fixé par accord','Activités pour les salarié·es et leur famille','Choix et gestion par les élu·es'],r:'Art. L.2312-78 C. trav.',
   ico:`<rect x="14" y="24" width="76" height="40" rx="8" fill="#FF8867" ${S}/><path d="M66 24v40" ${S} stroke-dasharray="5 5"/><path d="M30 38h22M30 50h14" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="98" cy="22" r="12" fill="#05CE78" ${S}/><path d="M93 22l4 4 6-7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`},
];
$('#missionList').innerHTML=MISSIONS.map((m,i)=>`<button class="mission glass rv" aria-expanded="false"><svg viewBox="0 0 120 84" aria-hidden="true">${m.ico}</svg><div><h3>${m.t}</h3><p>${m.p}</p><div class="ex"><b>Chez nous, par exemple</b>${m.ex}</div><div class="more"><ul>${m.m.map(x=>`<li>${x}</li>`).join('')}</ul><p class="ref" style="margin-top:8px">${m.r}</p></div><div class="tog">En savoir plus ↓</div></div></button>`).join('');
$$('.mission').forEach(b=>{io.observe(b);b.onclick=()=>{const o=b.classList.toggle('open');b.setAttribute('aria-expanded',o);$('.tog',b).textContent=o?'Réduire ↑':'En savoir plus ↓'}});

/* ---------- Pour toi (exemples par collège, illustratifs) ---------- */
const PROF={
  pnc:{n:'PNC',items:[['🗓️','Organisation des rotations et des plannings : le CSE est consulté avant tout changement important.'],['😴','Fatigue, repos, conditions à bord : sujets suivis par la commission santé, sécurité et conditions de travail.'],['🎟️','Activités sociales : billetterie, vacances, sport, accessibles même avec des horaires décalés.']]},
  pnt:{n:'PNT',items:[['🧭','Organisation des bases et des programmes de vol : le CSE donne son avis sur les projets.'],['🎓','Formation et introduction de nouveaux outils : le CSE est consulté.'],['🛡️','Santé et sécurité au travail : analyse des risques, droit d\'alerte.']]},
  cadre:{n:'Cadres',items:[['💻','Télétravail, outils numériques, charge de travail : le CSE est consulté sur les conditions de travail.'],['🏗️','Réorganisation d\'un service : la direction doit consulter le CSE avant de décider.'],['💬','Une réclamation sur ta rémunération ou l\'application d\'un accord : un·e élu·e peut la porter.']]},
  etam:{n:'ETAM',items:[['⏰','Horaires et organisation en escale ou au sol : le CSE est consulté sur les changements importants.'],['🦺','Équipements de protection, risques physiques : la CSSCT inspecte et propose des mesures.'],['🎟️','Activités sociales et culturelles, pour toi et ta famille.']]},
};
$('#tabs').innerHTML=Object.entries(PROF).map(([k,p],i)=>`<button role="tab" aria-selected="${!i}" data-k="${k}">${p.n}</button>`).join('');
function prof(k){const p=PROF[k];$$('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.k===k));
  $('#prof').innerHTML=`<div class="who bob">${charSVG(k)}</div><div class="swap"><h3>Collège ${p.n}</h3><ul>${p.items.map(([e,t])=>`<li><span>${e}</span><p>${t}</p></li>`).join('')}</ul><p class="ref" style="margin-top:12px">Exemples illustratifs : le périmètre exact dépend des projets présentés au CSE.</p></div>`;
  wave($('#prof .char'))}
$$('#tabs button').forEach(b=>b.onclick=()=>prof(b.dataset.k));prof('pnc');

/* ---------- Lexique ---------- */
const LEX=[
  ['Titulaire','Élu·e qui siège au CSE et vote. Tu en élis dans ton collège.'],
  ['Suppléant·e','Élu·e qui remplace un·e titulaire absent·e. Tu votes aussi pour les suppléant·es.'],
  ['Collège','Groupe d\'électeur·rices selon la catégorie professionnelle. Chez nous : PNC, PNT, Cadres, ETAM (selon le PAP).'],
  ['PAP','Protocole d\'accord préélectoral : il fixe les règles de l\'élection (collèges, sièges, calendrier, vote).'],
  ['CSSCT','Commission santé, sécurité et conditions de travail, créée au sein du CSE.'],
  ['BDESE','Base de données économiques, sociales et environnementales : les informations que la direction met à disposition du CSE.'],
  ['ASC','Activités sociales et culturelles gérées par le CSE.'],
  ['Heures de délégation','Temps rémunéré dont disposent les élu·es pour exercer leur mandat.'],
  ['Droit d\'alerte','Possibilité pour les élu·es d\'alerter la direction, par exemple en cas de danger grave et imminent.'],
  ['Avis consultatif','Position du CSE sur un projet. La direction décide ensuite, en répondant de manière motivée.'],
];
$('#lex').innerHTML=LEX.map(([w,d])=>`<button class="word" aria-label="${w} : ${d}"><span class="in"><span class="f"><b>${w}</b><small>Touche pour retourner ↻</small></span><span class="bk">${d}</span></span></button>`).join('');
$$('.word').forEach(w=>w.onclick=()=>w.classList.toggle('on'));

/* Ciel */
const root=document.documentElement;
addEventListener('scroll',()=>root.style.setProperty('--p',Math.min(1,scrollY/(root.scrollHeight-innerHeight||1)).toFixed(4)),{passive:true});
