/* TO VOTE · Envol — script de la page quiz.html */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)};
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let ci=0;$$('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});

/* Lien vers la formation TO Learn : à renseigner (URL du module CSE / élections professionnelles) */
const TO_LEARN_URL='';

/* ---------- Questions (dates, sièges et modalités : PAP du 13 octobre 2026) ----------
   t : thème · q : question · o : réponses (la première est la bonne, l'ordre est mélangé à l'affichage) · vf : vrai/faux · e : explication · r : référence */
const THEMES={voter:'🗳️ Voter',cse:'🏛️ Le CSE',cand:'✋ Candidater'};
const Q=[
 {t:'voter',q:'Qui peut voter aux élections du CSE ?',o:['Toute personne salariée d\'au moins 16 ans, avec 3 mois d\'ancienneté','Uniquement les salarié·es de plus de 18 ans en CDI','Uniquement les adhérent·es d\'un syndicat','Toute personne salariée, dès son premier jour'],e:'16 ans et 3 mois d\'ancienneté suffisent, quel que soit ton contrat. Syndiqué·e ou non, peu importe.',r:'Art. L.2314-18 C. trav. · PAP, art. 7.1'},
 {t:'voter',vf:false,q:'Je peux donner procuration à un·e collègue pour voter à ma place.',e:'Le vote est strictement personnel : la procuration est interdite. Ne communique jamais tes codes.',r:'PAP, art. 8.6.2'},
 {t:'voter',q:'Comment reçois-tu ton identifiant de vote ?',o:['Par courrier, à ton domicile','Par SMS, sur ton téléphone pro','Par ton manager, en main propre','Sur l\'intranet, dans ton espace RH'],e:'Ton identifiant arrive par courrier dès le 10 mars, avec la notice de vote. Ton mot de passe, lui, arrive sur ta messagerie pro au moment de te connecter.',r:'PAP, art. 8.7.2'},
 {t:'voter',q:'Pour te connecter au site de vote, on te demande ton identifiant et…',o:['Les 5 derniers caractères de ton IBAN','Ton numéro de matricule','Ton numéro de badge','Le nom de ton manager'],e:'C\'est la « question défi » : avec ton identifiant, elle déclenche l\'envoi d\'un mot de passe valable une heure sur ta messagerie pro.',r:'PAP, art. 8.7.2.2'},
 {t:'voter',q:'Combien de fois votes-tu au 1er tour ?',o:['Deux fois : pour les titulaires, puis pour les suppléant·es','Une seule fois, pour une liste','Une fois par collège','Autant de fois que de listes en lice'],e:'Tu fais deux votes séparés dans ton collège : un pour les titulaires, un pour les suppléant·es.',r:'PAP, art. 8.6.2'},
 {t:'voter',vf:false,q:'Je peux choisir des candidat·es sur plusieurs listes différentes.',e:'Le panachage est interdit : tu choisis une seule liste. Tu peux en revanche rayer des noms sur la liste choisie.',r:'PAP, art. 8.6.2'},
 {t:'voter',q:'Quand peux-tu voter au 1er tour ?',o:['Du 18 mars 9h00 au 31 mars 16h00','Du 16 au 19 mars','Du 1er au 5 mars','Du 9 au 16 avril'],e:'Le vote est ouvert 24h/24 et 7j/7 pendant toute cette période, en heure de Paris. Du 9 au 16 avril, c\'est le 2nd tour éventuel.',r:'PAP, art. 1'},
 {t:'voter',vf:true,q:'En rotation à l\'étranger, je peux voter depuis mon téléphone.',e:'Oui : le vote se fait en ligne, depuis n\'importe quel appareil connecté, où que tu sois. Attention, les horaires sont ceux de Paris.',r:'PAP, art. 8.6.1 et annexe 4'},
 {t:'cse',q:'Combien de titulaires siégeront au CSE de Transavia France ?',o:['30','26','20','15'],e:'26 sièges sont prévus par la loi pour notre effectif, et le protocole d\'accord préélectoral en ajoute 4 : 30 titulaires et 30 suppléant·es.',r:'PAP, art. 5 · Art. R.2314-1 C. trav.'},
 {t:'cse',q:'Combien de collèges électoraux compte l\'élection ?',o:['4 : ETAM, Cadres, PNT et PNC','2 : navigants et sol','3 : employés, cadres, navigants','1 seul pour tout le monde'],e:'Tu votes uniquement dans ton collège : ETAM, Cadres, PNT ou PNC.',r:'PAP, art. 3'},
 {t:'cse',q:'Pour combien de temps les élu·es sont-ils élu·es ?',o:['4 ans','1 an','2 ans','6 ans'],e:'Le mandat dure 4 ans, sauf accord fixant une durée comprise entre 2 et 4 ans.',r:'Art. L.2314-33 C. trav.'},
 {t:'cse',vf:false,q:'Le CSE prend les décisions à la place de la direction.',e:'La direction consulte le CSE et recueille son avis avant de décider. L\'avis ne l\'oblige pas, mais elle doit y répondre.',r:'Art. L.2312-8 C. trav.'},
 {t:'cse',q:'Qui gère les activités sociales et culturelles (billetterie, vacances, sport…) ?',o:['Le CSE','La direction','Les organisations syndicales','La mutuelle'],e:'C\'est le CSE qui gère les ASC, avec un budget dédié, au bénéfice des salarié·es et de leur famille.',r:'Art. L.2312-78 C. trav.'},
 {t:'cse',q:'À quoi servent les élu·es suppléant·es ?',o:['À remplacer un·e titulaire absent·e','À contrôler le vote des titulaires','À représenter la direction','À gérer seulement le budget'],e:'Tu les élis aussi : ils et elles siègent à la place d\'un·e titulaire absent·e.',r:'Art. L.2314-1 et L.2314-37 C. trav.'},
 {t:'cand',q:'Qui peut présenter des listes au 1er tour ?',o:['Les organisations syndicales','Toute personne éligible','La direction','Les élu·es sortant·es'],e:'Au 1er tour, seules les organisations syndicales déposent des listes. Les candidatures libres sont possibles au 2nd tour.',r:'Art. L.2314-29 C. trav. · PAP, art. 7.4'},
 {t:'cand',q:'Quelle règle de parité s\'applique aux listes ?',o:['Refléter la part de femmes et d\'hommes du collège, en alternance','Toujours 50 % de femmes et 50 % d\'hommes','Toujours commencer par une femme','Aucune règle particulière'],e:'Chaque liste reflète la proportion de femmes et d\'hommes inscrits dans le collège, avec une alternance jusqu\'à épuisement d\'un des sexes. Elle peut commencer par l\'un ou l\'autre.',r:'Art. L.2314-30 C. trav. · PAP, art. 6 et 7.4.1'},
 {t:'cand',vf:true,q:'Si moins de la moitié des inscrit·es vote au 1er tour, un 2nd tour est organisé.',e:'C\'est le quorum. S\'il n\'est pas atteint dans un collège, ou si des sièges restent à pourvoir, un 2nd tour a lieu du 9 au 16 avril.',r:'Art. L.2314-29 C. trav. · PAP, art. 8.8'},
 {t:'cand',q:'Jusqu\'à quand les listes du 1er tour peuvent-elles être déposées ?',o:['Le 1er mars 2027 à 12h00','Le 26 février 2027','Le 5 mars 2027','Le 18 mars 2027'],e:'Les listes et professions de foi sont déposées au plus tard le 1er mars à midi, puis affichées le 5 mars.',r:'PAP, art. 1 et annexe 1'},
];
const RANKS=[[17,'As du CSE','Sans faute ou presque : tu pourrais présenter l\'élection à toute la cabine.'],[13,'Commandant·e de bord','Tu maîtrises l\'essentiel. Un petit tour sur les points manqués et c\'est parfait.'],[8,'Copilote','Tu as de bonnes bases. Revois tes réponses, et la formation TO Learn fera le reste.'],[0,'En salle d\'embarquement','Pas de panique : quelques minutes de lecture et de formation suffisent pour décoller.']];

/* ---------- Déroulé ---------- */
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let order=[],i=0,answers=[],locked=false;
const mascot=$('#mascot');
function start(){
  order=shuffle(Q).map(q=>({...q,opts:q.vf===undefined?shuffle(q.o):null}));i=0;answers=[];
  $('#intro').hidden=true;$('#results').hidden=true;$('#play').hidden=false;
  mascot.innerHTML=charSVG(['pnc','pnt','sol'][Math.random()*3|0]);
  show();$('#play').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
}
function progress(){const n=order.length,p=i/n*100;$('#trackDone').style.width=p+'%';$('#trackPlane').style.left=`calc(${p}% + ${p<3?30:0}px)`;}
function show(){
  const q=order[i];locked=false;$('#fb').hidden=true;$('#next').hidden=true;
  $('#qCount').textContent=`${i+1} / ${order.length}`;$('#qThemeChip').textContent=THEMES[q.t]+(q.vf!==undefined?' · Vrai ou faux':'');
  $('#qText').textContent=q.q;
  const o=$('#opts');
  if(q.vf!==undefined){o.className='opts vf';o.innerHTML='<button class="opt" data-v="true">Vrai</button><button class="opt" data-v="false">Faux</button>'}
  else{o.className='opts';o.innerHTML=q.opts.map((t,k)=>`<button class="opt" data-k="${k}"><span class="k">${'ABCD'[k]}</span><span>${t}</span></button>`).join('')}
  $$('.opt',o).forEach(b=>b.onclick=()=>pick(b));progress();
}
function pick(b){
  if(locked)return;locked=true;const q=order[i];let ok;
  if(q.vf!==undefined){ok=(b.dataset.v==='true')===q.vf;$$('#opts .opt').forEach(x=>{const good=(x.dataset.v==='true')===q.vf;x.classList.add(good?'right':x===b?'wrong':'dim')})}
  else{ok=q.opts[+b.dataset.k]===q.o[0];$$('#opts .opt').forEach(x=>{const good=q.opts[+x.dataset.k]===q.o[0];x.classList.add(good?'right':x===b?'wrong':'dim')})}
  $$('#opts .opt').forEach(x=>x.disabled=true);
  answers.push({q,ok,given:q.vf!==undefined?(b.dataset.v==='true'?'Vrai':'Faux'):q.opts[+b.dataset.k]});
  const fb=$('#fb');fb.className='feedback '+(ok?'ok':'ko');fb.hidden=false;
  $('#fbTitle').textContent=ok?['Bien vu !','Exactement.','Parfait.'][answers.length%3]:'Pas tout à fait…';
  $('#fbText').textContent=(q.vf!==undefined&&!ok?`C'était ${q.vf?'vrai':'faux'}. `:'')+q.e;$('#fbRef').textContent=q.r||'';
  const s=$('.char',mascot);if(s){s.classList.add(ok?'happy':'sad');setTimeout(()=>s.classList.remove('happy','sad'),1300)}
  $('#next').textContent=i<order.length-1?'Question suivante →':'Voir mon résultat →';$('#next').hidden=false;$('#next').focus({preventScroll:true});
  progress();
}
function next(){if(i<order.length-1){i++;show()}else finish()}
function finish(){
  i=order.length;progress();const n=answers.filter(a=>a.ok).length,tot=order.length;
  const [,rank,txt]=RANKS.find(r=>n>=r[0]);
  $('#play').hidden=true;$('#results').hidden=false;
  $('#resScore').innerHTML=`${n}<small> / ${tot}</small>`;$('#resRank').textContent=rank;
  $('#resChar').innerHTML=charSVG(['pnc','pnt','sol'][Math.random()*3|0]);
  $('#resDate').textContent='Délivrée le '+new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
  $('#resTitle').innerHTML=n===tot?'Sans faute, <span class="g">bravo !</span>':n>=13?'Très beau <span class="g">vol !</span>':n>=8?'Bon <span class="g">décollage.</span>':'Prochain vol, <span class="g">tu&nbsp;y&nbsp;es.</span>';
  $('#resText').textContent=txt;
  $('#reviewList').innerHTML=answers.map(a=>`<li class="${a.ok?'ok':'ko'}"><span class="m">${a.ok?'✓':'✕'}</span><div><b>${a.q.q}</b><p>${a.ok?'Ta réponse : ':`Ta réponse : ${a.given}. Bonne réponse : `}${a.ok?a.given:(a.q.vf!==undefined?(a.q.vf?'Vrai':'Faux'):a.q.o[0])}.</p><p>${a.q.e}</p>${a.q.r?`<span class="ref">${a.q.r}</span>`:''}</div></li>`).join('');
  const best=store.get('tv_quiz_best',0);if(n>best)store.set('tv_quiz_best',n);
  setTimeout(()=>{const s=$('#resChar .char');if(s){s.classList.add(n>=tot/2?'happy':'sad');setTimeout(()=>s.classList.remove('happy','sad'),1300)}},500);
  $('#results').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
}
$('#start').onclick=start;$('#next').onclick=next;$('#again').onclick=start;
$('#toLearn').href=TO_LEARN_URL||'#';
$('#toLearn').onclick=e=>{if(!TO_LEARN_URL){e.preventDefault();toast('🎓 Lien TO Learn bientôt disponible')}};
addEventListener('keydown',e=>{if($('#play').hidden||e.target.matches('input,textarea'))return;
  const opts=$$('#opts .opt');if(!locked&&/^[1-4]$/.test(e.key)&&opts[+e.key-1]){opts[+e.key-1].click()}
  else if(locked&&e.key==='Enter'&&document.activeElement!==$('#next')){e.preventDefault();next()}});
{const best=store.get('tv_quiz_best',0);if(best){$('#best').hidden=false;$('#best').textContent=`Ton meilleur score : ${best} / ${Q.length}`}}
$$('[data-char]').forEach(el=>el.innerHTML=charSVG(el.dataset.char));

/* Ciel */
const root=document.documentElement;
addEventListener('scroll',()=>root.style.setProperty('--p',Math.min(1,scrollY/(root.scrollHeight-innerHeight||1)).toFixed(4)),{passive:true});
