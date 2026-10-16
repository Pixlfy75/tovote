/* TO VOTE · Envol — script de la page calendrier.html */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)};
let ci=0;$$('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});

/* ---------- Plan de vol (dates du calendrier électoral, heure de Paris) ----------
   s / e : début et fin (une date seule couvre toute la journée). Passage à l'heure d'été le 28 mars 2027. */
const D=(iso)=>new Date(iso);
const PHASES=[
 {id:'preparation',n:'01',name:'Préparation',c:'var(--pink)',items:[
  {t:'Lancement officiel des élections',s:'2026-12-21T00:00:00+01:00',e:'2026-12-21T23:59:59+01:00',p:'Le top départ : le personnel est informé de l\'organisation des élections.'},
  {t:'Publication des listes électorales provisoires',s:'2027-02-22T00:00:00+01:00',e:'2027-02-22T23:59:59+01:00',p:'La liste des électeur·rices est publiée. Vérifie que tu y figures, dans le bon collège.',link:['faq.html#liste-electorale','Comment vérifier ?']},
  {t:'Vérification des listes par les électeur·rices',s:'2027-02-22T00:00:00+01:00',e:'2027-02-25T23:59:59+01:00',range:true,p:'Une erreur sur ton nom, ton collège ou ton inscription ? Signale-la aux RH au plus tard le 25 février à minuit.',ref:'PAP, art. 7.3'},
  {t:'Publication des listes électorales définitives',s:'2027-02-26T00:00:00+01:00',e:'2027-02-26T23:59:59+01:00',p:'La liste est arrêtée. Une contestation sur l\'électorat se fait devant le tribunal judiciaire, dans les 3 jours suivant la publication.',ref:'Art. R.2314-24 C. trav.'},
  {t:'Date limite de dépôt des candidatures et des professions de foi',s:'2027-03-01T12:00:00+01:00',e:'2027-03-01T12:00:00+01:00',time:'12h00',p:'Les listes de candidat·es et leurs professions de foi doivent être déposées avant midi.',link:['candidatures.html#se-presenter','Se présenter']},
  {t:'Date limite de dépôt des délégué·es de liste',s:'2027-03-01T12:00:00+01:00',e:'2027-03-01T12:00:00+01:00',time:'12h00',p:'Chaque liste désigne, au plus tard avec son dépôt, la personne qui la représentera pendant les opérations électorales.',ref:'PAP, art. 8.3.1 et annexe 1'},
 ]},
 {id:'campagne',n:'02',name:'Campagne',c:'var(--peach)',items:[
  {t:'Affichage des listes de candidat·es',s:'2027-03-05T00:00:00+01:00',e:'2027-03-05T23:59:59+01:00',p:'Les listes sont publiées ici et affichées, toutes au même format, par ordre alphabétique des organisations syndicales.',link:['candidatures.html','Voir les listes']},
  {t:'Ouverture de la campagne électorale',s:'2027-03-05T00:00:00+01:00',e:'2027-03-05T23:59:59+01:00',p:'Les listes présentent leurs programmes. Lis les professions de foi de ton collège.'},
  {t:'Envoi postal des identifiants',s:'2027-03-10T00:00:00+01:00',e:'2027-03-17T23:59:59+01:00',from:true,p:'Ton identifiant arrive par courrier chez toi, avec la notice de vote. Ton mot de passe, lui, arrive sur ta messagerie pro au moment de te connecter. Vérifie dès maintenant que ton adresse est à jour dans ton espace RH.',link:['faq.html#codes','Pas reçu tes codes ?']},
  {t:'Fin de la campagne électorale',s:'2027-03-17T00:00:00+01:00',e:'2027-03-17T23:59:59+01:00',p:'Dernier jour de campagne, la veille de l\'ouverture du vote.'},
 ]},
 {id:'scrutin',n:'03',name:'Scrutin',c:'var(--green)',items:[
  {t:'Ouverture du 1er tour',s:'2027-03-18T09:00:00+01:00',e:'2027-03-18T09:00:00+01:00',time:'9h00',p:'Le vote en ligne est ouvert 24h/24, depuis ton téléphone ou ton ordinateur, jusqu\'au 31 mars.',link:['faq.html#comment','Comment voter ?']},
  {t:'Fermeture du 1er tour',s:'2027-03-31T16:00:00+02:00',e:'2027-03-31T16:00:00+02:00',time:'16h00',p:'Dernière minute pour voter : le scrutin ferme à 16h00 précises.'},
  {t:'Proclamation des résultats',s:'2027-03-31T16:00:00+02:00',e:'2027-03-31T23:59:59+02:00',p:'Les résultats sont proclamés et publiés ici. Si le quorum n\'est pas atteint, ou si des sièges restent à pourvoir, un 2nd tour est organisé.',ref:'Art. L.2314-29 C. trav.'},
 ]},
];
const MOIS=['jan','fév','mars','avr','mai','juin','juil','août','sept','oct','nov','déc'];
const paris=d=>new Date(d.toLocaleString('en-US',{timeZone:'Europe/Paris'}));
const fmtDay=d=>{const p=paris(d);return {d:p.getDate(),m:MOIS[p.getMonth()],y:p.getFullYear()}};

/* ---------- Rendu des phases ---------- */
let uid=0;
PHASES.forEach(ph=>ph.items.forEach(it=>{it.id='e'+(uid++);it.ph=ph}));
const all=PHASES.flatMap(p=>p.items);
$('#phases').innerHTML=PHASES.map(ph=>{
  const a=fmtDay(D(ph.items[0].s)),b=fmtDay(D(ph.items[ph.items.length-1].e));
  return `<section class="phase" id="${ph.id}" style="--c:${ph.c}">
  <aside class="ph-head glass rv"><div class="ph-code"><b>${ph.n}</b><span>Phase ${+ph.n} sur 3</span></div><h2 class="h">${ph.name}</h2>
    <span class="range">${a.d} ${a.m}${a.y!==b.y?' '+a.y:''} → ${b.d} ${b.m} ${b.y}</span><span class="ph-state" data-state="${ph.id}"></span></aside>
  <ol class="items">${ph.items.map(it=>{const s=fmtDay(D(it.s)),e=fmtDay(D(it.e));
    const dateHtml=it.range?`<b class="rng mono">${s.d}→${e.d}</b><span>${s.m} ${s.y}</span>`:`${it.from?'<span>dès le</span>':''}<b class="mono">${s.d}</b><span>${s.m} ${s.y}</span>${it.time?`<small class="mono">${it.time}</small>`:''}`;
    return `<li class="item glass" id="${it.id}"><div class="date">${dateHtml}</div>
      <div class="it-body"><h3>${it.t}</h3><p>${it.p}</p>${it.ref?`<p class="ref" style="margin-top:6px">${it.ref}</p>`:''}
      <div class="it-meta"><span class="st" data-st></span>${it.link?`<a class="lk" href="${it.link[0]}">${it.link[1]} →</a>`:''}</div></div></li>`}).join('')}
    ${ph.id==='scrutin'?`<li class="item glass ghost" data-ghost><div class="date"><b class="rng mono">9→16</b><span>avr 2027</span></div><div class="it-body"><h3>2nd tour, si nécessaire</h3><p>Seulement dans les collèges où le quorum n'est pas atteint ou où des sièges restent à pourvoir. Appel à candidatures le 1er avril, dépôt jusqu'au 5 avril à 12h00, listes affichées le 7 avril. Vote du 9 avril 9h00 au 16 avril 16h00, résultats le 16 avril.</p><p class="ref" style="margin-top:6px">PAP, art. 1 et annexe 1</p></div></li>`:''}
  </ol></section>`}).join('');

/* ---------- Statuts selon la date (réelle ou simulée) ---------- */
let NOW=new Date(),filter='all';
function render(){
  const t=NOW;
  all.forEach(it=>{const el=$('#'+it.id),s=D(it.s),e=D(it.e);
    const st=t>e?'done':t>=s?'now':'future';el.classList.remove('done','now');if(st!=='future')el.classList.add(st);
    const b=$('[data-st]',el);b.className='st '+(st==='future'?'':st);
    b.textContent=st==='done'?'✓ Fait':st==='now'?'● En cours':'À venir';
    if(st==='now'&&it.e===it.s)b.textContent='● Maintenant';
    el.hidden=filter==='next'&&st==='done'});
  $$('[data-ghost]').forEach(g=>g.hidden=false);
  if(typeof fit==='function')requestAnimationFrame(fit);
  PHASES.forEach(ph=>{const d=ph.items.filter(it=>t>D(it.e)).length,n=ph.items.length;
    $(`[data-state="${ph.id}"]`).textContent=d===n?'Phase terminée ✓':d||ph.items.some(it=>t>=D(it.s))?`${d} étape${d>1?'s':''} sur ${n} terminée${d>1?'s':''}`:'Phase à venir'});
}
$$('.seg button').forEach(b=>b.onclick=()=>{filter=b.dataset.f;$$('.seg button').forEach(x=>x.setAttribute('aria-pressed',x===b));render()});

/* Démo : date simulée, du 1er décembre 2026 au 20 avril 2027 */
const SIM0=D('2026-12-01T10:00:00+01:00');
const simLabel=()=>$('#simLab').textContent=NOW.toLocaleDateString('fr-FR',{timeZone:'Europe/Paris',day:'numeric',month:'short',year:'numeric'});
$('#sim').oninput=e=>{NOW=new Date(SIM0.getTime()+e.target.value*864e5);simLabel();render()};
$('#simReset').onclick=()=>{NOW=new Date();const v=Math.round((NOW-SIM0)/864e5);$('#sim').value=Math.max(0,Math.min(140,v));simLabel();render()};
simLabel();render();

/* ---------- Timeline : pastilles alignées sur le bloc de date, ligne de la première à la dernière pastille ---------- */
function fit(){
  $$('.items').forEach(ol=>{const its=[...ol.children].filter(li=>!li.hidden&&li.offsetHeight);if(!its.length)return;
    its.forEach(li=>{const d=$('.date',li);li.style.setProperty('--dot',(d.offsetTop+d.offsetHeight/2)+'px')});
    const c=li=>li.offsetTop+parseFloat(li.style.getPropertyValue('--dot')),a=its[0],z=its[its.length-1];
    ol.style.setProperty('--l0',c(a)+'px');ol.style.setProperty('--l1',(ol.clientHeight-c(z))+'px')})}
fit();addEventListener('resize',fit);document.fonts&&document.fonts.ready.then(fit);addEventListener('load',fit);

/* Apparitions + ciel */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
$$('.rv').forEach(el=>io.observe(el));
const root=document.documentElement;
addEventListener('scroll',()=>root.style.setProperty('--p',Math.min(1,scrollY/(root.scrollHeight-innerHeight||1)).toFixed(4)),{passive:true});
