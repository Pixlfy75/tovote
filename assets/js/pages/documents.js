/* TO VOTE · Envol — script de la page documents.html */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)};
let ci=0;$$('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});

/* ---------- Documents (dates du PAP du 13 octobre 2026 ; fichiers à déposer à la publication ; références à valider par la DRH) ----------
   pub : date de publication (null = date encore inconnue). file : PDF disponible sur le site. page : lien vers une page du site au lieu d'un PDF. */
const CATS=[['all','Tous'],['orga','Organisation'],['listes','Listes'],['vote','Vote en ligne'],['resultats','Résultats']];
const DOCS=[
 {id:'pap',cat:'orga',picto:'pap',t:'Protocole d\'accord préélectoral (PAP)',p:'Signé le 13 octobre 2026. Les règles de l\'élection : 4 collèges, 30 titulaires et 30 suppléant·es, calendrier des deux tours, vote électronique.',pub:'2026-10-13',file:'assets/docs/protocole-accord-preelectoral-2027.pdf',size:'PDF · 50 pages · 1,2 Mo',ref:'Art. L.2314-5 et L.2314-6 C. trav.'},
 {id:'lancement',cat:'orga',picto:'info',t:'Note de lancement des élections',p:'L\'information officielle de l\'ensemble du personnel sur l\'organisation des élections.',pub:'2026-12-21',ref:'Art. L.2314-4 C. trav.'},
 {id:'vote-electronique',cat:'orga',picto:'accord',t:'Accord sur le vote électronique',p:'L\'accord d\'entreprise du 6 juin 2017 et ses avenants : il autorise le vote en ligne et en fixe le cadre.',pub:null,ref:'Art. L.2314-26 C. trav. · PAP, art. 8.6'},
 {id:'calendrier',cat:'orga',picto:'calendrier',t:'Calendrier électoral',p:'Toutes les étapes, du lancement à la proclamation des résultats, 2nd tour compris.',pub:'2026-10-13',page:'calendrier.html'},
 {id:'listes-provisoires',cat:'listes',picto:'listes',t:'Listes électorales',p:'Vérifie que tu y figures, dans le bon collège. Une erreur ? Signale-la aux RH avant le 25 février 2027 à minuit.',pub:'2027-02-22',ref:'PAP, art. 7.3'},
 {id:'listes-definitives',cat:'listes',picto:'listes',t:'Listes électorales définitives',p:'La liste arrêtée des électeur·rices, valable pour les deux tours.',pub:'2027-02-26',ref:'Art. R.2314-24 C. trav.'},
 {id:'candidats',cat:'listes',picto:'candidats',t:'Listes de candidat·es et professions de foi',p:'Toutes les listes, au même format, par ordre alphabétique des organisations syndicales.',pub:'2027-03-05',page:'candidatures.html'},
 {id:'notice',cat:'vote',picto:'guide',t:'Notice d\'information du vote',p:'Envoyée par courrier avec ton identifiant : te connecter, voter pour les titulaires puis les suppléant·es, obtenir de l\'aide.',pub:'2027-03-10',ref:'PAP, art. 8.7'},
 {id:'expertise',cat:'vote',picto:'expertise',t:'Synthèse de l\'expertise du système de vote',p:'Le contrôle indépendant de la plateforme de vote : sécurité et anonymat du vote.',pub:null,ref:'PAP, art. 8.6.1 et annexe 4'},
 {id:'pv',cat:'resultats',picto:'pv',t:'Procès-verbaux des résultats',p:'Les résultats officiels du 1er tour, collège par collège, signés par le bureau de vote.',pub:'2027-03-31',ref:'PAP, art. 8.8'},
 {id:'appel-2nd-tour',cat:'resultats',picto:'info',t:'Appel à candidatures du 2nd tour',p:'Seulement si un 2nd tour est nécessaire : les collèges et sièges restant à pourvoir.',pub:'2027-04-01',ref:'PAP, annexe 1'},
];
const MOIS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const day=iso=>{const [y,m,d]=iso.split('-').map(Number);return `${d===1?'1er':d} ${MOIS[m-1]} ${y}`};
const at=iso=>new Date(iso+'T00:00:00+01:00');
let cat='all',demo=false;
const isOut=d=>demo||(d.pub&&new Date()>=at(d.pub));

$('#filters').innerHTML=CATS.map(([k,n])=>`<button data-cat="${k}" aria-pressed="${k==='all'}">${n}<small>${k==='all'?DOCS.length:DOCS.filter(d=>d.cat===k).length}</small></button>`).join('');
function render(){
  $('#docs').innerHTML=DOCS.map((d,i)=>{const out=isOut(d),rot=[-1.2,.8,-.4,1,-.8,.5][i%6];
    const when=out?(d.size||(d.pub?`Publié le ${day(d.pub)}`:'Publié')):(d.pub?`🔒 Le ${day(d.pub)}`:'🔒 Bientôt en ligne');
    const act=out?(d.page?`<a class="btn btn-ink btn-sm" href="${d.page}">Voir →</a>`:`<button class="btn btn-ink btn-sm" data-open="${d.id}">📄 Consulter</button>`)
                 :'';
    return `<article class="doc${out?'':' locked'}" id="${d.id}" data-cat="${d.cat}" style="--rot:${rot}deg"${cat!=='all'&&d.cat!==cat?' hidden':''}>
      <div class="pic">${picto(d.picto)}</div>
      <div class="kind"><span class="tag ${d.page?'page':'pdf'}">${d.page?'Page':'PDF'}</span><span class="tag">${CATS.find(c=>c[0]===d.cat)[1]}</span></div>
      <h3>${d.t}</h3><p>${d.p}</p>${d.ref?`<span class="ref">${d.ref}</span>`:''}
      <div class="foot"><span class="when">${when}</span>${act}</div></article>`}).join('');
  const next=DOCS.filter(d=>d.pub&&!isOut(d)).sort((a,b)=>a.pub<b.pub?-1:1)[0];
  $('#next').innerHTML=next?`<span>Prochaine publication : ${next.t}</span><b>${day(next.pub)}</b>`:'<span>✅ Tous les documents datés sont publiés.</span>';
  if(location.hash){const el=$(location.hash);el&&el.classList.add('fresh')}
}
$('#filters').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;cat=b.dataset.cat;$$('#filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));render()};
$('#demo').onchange=e=>{demo=e.target.checked;render()};
$('#docs').onclick=e=>{
  const o=e.target.closest('[data-open]');if(o){const d=DOCS.find(x=>x.id===o.dataset.open);d.file?openDoc(d):toast('📄 Le fichier sera déposé ici à sa publication');return}};
/* ---------- Visionneuse : le PDF s'ouvre dans une modale, téléchargeable depuis l'en-tête ----------
   PDF.js (assets/vendor/pdfjs, Mozilla, licence Apache 2.0) n'est chargé que si le navigateur n'a pas de lecteur intégré. */
const viewer=$('#viewer');let pdfjsP=null,task=null,obs=null,slowT=0;
/* Sur ordinateur, le lecteur PDF intégré au navigateur est le plus fiable : on l'utilise quand il est disponible.
   Sinon (téléphones surtout), PDF.js dessine les pages, sans « web worker » pour éviter les blocages. */
const nativePdf=!!navigator.pdfViewerEnabled&&matchMedia('(pointer:fine)').matches&&innerWidth>700;
const addScript=src=>new Promise((ok,ko)=>{const sc=document.createElement('script');sc.src=src;sc.onload=ok;sc.onerror=ko;document.head.appendChild(sc)});
const loadPdfjs=()=>pdfjsP||(pdfjsP=addScript('assets/vendor/pdfjs/pdf.worker.min.js').then(()=>addScript('assets/vendor/pdfjs/pdf.min.js')).then(()=>{
  if(!window.pdfjsLib)throw new Error('PDF.js absent');pdfjsLib.GlobalWorkerOptions.workerSrc='assets/vendor/pdfjs/pdf.worker.min.js';return pdfjsLib}).catch(e=>{pdfjsP=null;throw e}));
async function drawPage(pdf,el,W){try{const page=await pdf.getPage(+el.dataset.n),vp=page.getViewport({scale:1}),dpr=Math.min(devicePixelRatio||1,2);
  const v=page.getViewport({scale:W/vp.width*dpr}),c=document.createElement('canvas');c.width=Math.floor(v.width);c.height=Math.floor(v.height);
  el.style.aspectRatio=`${vp.width}/${vp.height}`;await page.render({canvasContext:c.getContext('2d'),viewport:v}).promise;el.appendChild(c)}catch(e){}}
function fail(){if(!viewer.open)return;try{task&&task.destroy()}catch(e){}$('#vLoad').hidden=true;$('#vErr').hidden=false}
async function renderPdf(d){
  const box=$('#vPages'),body=$('#vBody');box.innerHTML='';$$('.v-native',body).forEach(f=>f.remove());
  $('#vLoad').hidden=false;$('#vErr').hidden=true;$('#vPct').textContent='';$('#vSlow').hidden=true;
  clearTimeout(slowT);slowT=setTimeout(()=>{$('#vSlow').hidden=false},4000);
  if(nativePdf){ /* lecteur du navigateur */
    const f=document.createElement('iframe');f.className='v-native';f.title='Aperçu : '+d.t;f.src=d.file+'#view=FitH';
    f.onload=()=>{$('#vLoad').hidden=true};setTimeout(()=>{$('#vLoad').hidden=true},2500);body.appendChild(f);return}
  /* PDF.js : tout le chargement est borné dans le temps, il ne peut pas tourner à l'infini */
  let last=Date.now();
  const guard=new Promise((_,ko)=>{const t=setInterval(()=>{if(!viewer.open||$('#vLoad').hidden)return clearInterval(t);if(Date.now()-last>10000){clearInterval(t);ko(new Error('bloqué'))}},500)});
  const run=(async()=>{const lib=await loadPdfjs();last=Date.now();task=lib.getDocument({url:d.file,isEvalSupported:false});
    task.onProgress=p=>{last=Date.now();if(p.total)$('#vPct').textContent=` ${Math.round(p.loaded/p.total*100)} %`};
    const pdf=await task.promise;last=Date.now();const vp=(await pdf.getPage(1)).getViewport({scale:1});return {pdf,vp}})();
  try{const {pdf,vp}=await Promise.race([run,guard]),W=Math.min(body.clientWidth-32,900);
    obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){obs.unobserve(e.target);drawPage(pdf,e.target,W)}}),{root:body,rootMargin:'800px 0px'});
    for(let n=1;n<=pdf.numPages;n++){const el=document.createElement('div');el.className='v-page';el.dataset.n=n;el.setAttribute('aria-label',`Page ${n} sur ${pdf.numPages}`);
      el.style.width=W+'px';el.style.aspectRatio=`${vp.width}/${vp.height}`;box.appendChild(el);obs.observe(el)}
    $('#vLoad').hidden=true;
  }catch(err){fail()}
}
function openDoc(d){
  $('#vPic').innerHTML=picto(d.picto);$('#vTitle').textContent=d.t;$('#vMeta').textContent=[d.size,d.pub&&`Publié le ${day(d.pub)}`].filter(Boolean).join(' · ');
  [$('#vDl'),$('#vDl2')].forEach(a=>{a.href=d.file;a.setAttribute('download',d.file.split('/').pop())});[$('#vOpen'),$('#vTab'),$('#vSlow')].forEach(a=>a.href=d.file);
  viewer.showModal();$('#vBody').scrollTop=0;try{history.replaceState(null,'','#'+d.id)}catch(e){}renderPdf(d);
}
function closeDoc(){viewer.close()}
viewer.addEventListener('close',()=>{clearTimeout(slowT);$$('.v-native').forEach(f=>f.remove());obs&&obs.disconnect();task&&task.destroy();task=obs=null;$('#vPages').innerHTML='';try{history.replaceState(null,'',location.pathname)}catch(e){}});
$('#vX').onclick=closeDoc;
viewer.addEventListener('click',e=>{if(e.target===viewer)closeDoc()});
render();
/* Lien direct vers un document (ex. documents.html#pap) : il s'ouvre dans la visionneuse s'il est publié */
{const d=DOCS.find(x=>'#'+x.id===location.hash);if(d&&d.file&&isOut(d))openDoc(d)}

/* Apparitions + ciel */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
$$('.rv').forEach(el=>io.observe(el));
const root=document.documentElement;
addEventListener('scroll',()=>root.style.setProperty('--p',Math.min(1,scrollY/(root.scrollHeight-innerHeight||1)).toFixed(4)),{passive:true});
