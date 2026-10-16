/* TO VOTE · Envol — script de la page vote.html */
/* Page « Je vote ». Pendant un tour de scrutin : compte à rebours de 10 s puis redirection vers le site de vote
   GEDIVOTE (adresse fixée par le PAP, art. 8.6.1). Avant et après : information seulement, aucune redirection.
   Pour un 2nd tour, passer « actif » à true. Aperçu : ?demo=avant | ouvert | clos */
const VOTE_URL='https://www.transavia.webvote.fr/';
const TOURS=[
  {nom:'1er tour',ouv:'2027-03-18T09:00:00+01:00',clo:'2027-03-31T16:00:00+02:00',txtOuv:'le 18 mars 2027 à 9h00',txtClo:'31 mars 2027 à 16h00',actif:true},
  {nom:'2nd tour',ouv:'2027-04-09T09:00:00+02:00',clo:'2027-04-16T16:00:00+02:00',txtOuv:'le 9 avril 2027 à 9h00',txtClo:'16 avril 2027 à 16h00',actif:false}
];
const $=s=>document.querySelector(s);
const demo=(new URLSearchParams(location.search).get('demo')||'').toLowerCase();
const now=Date.now(),T=TOURS.filter(t=>t.actif);
let state='clos',tour=T[T.length-1];
if(demo==='avant'){state='avant';tour=T[0]}else if(demo==='ouvert'){state='ouvert';tour=T[0]}else if(demo==='clos'){state='clos'}
else{const open=T.find(t=>now>=Date.parse(t.ouv)&&now<Date.parse(t.clo)),next=T.find(t=>now<Date.parse(t.ouv));
  if(open){state='ouvert';tour=open}else if(next){state='avant';tour=next}}
const split=(el,a,b)=>{el.setAttribute('aria-label',a+' '+b);el.innerHTML=`<span>${a}</span><br><span class="g">${b}</span>`};
const R=2*Math.PI*44,arc=$('#gArc');arc.style.strokeDasharray=R;
function ring(frac){arc.style.strokeDashoffset=R*(1-frac)}
function planeAt(frac){$('#gPlane').style.left=`calc(${frac*100}% - ${frac*48}px)`}

if(state==='ouvert'){
  split($('#gTitle'),'Le vote','est ouvert.');
  $('#gLead').textContent=`Le ${tour.nom} se déroule en ligne jusqu'au ${tour.txtClo}, sur le site sécurisé de GEDIVOTE, notre prestataire de vote électronique.`;
  $('#gStatus').textContent='Embarquement';
  $('#gH2').textContent='Redirection vers le site de vote';
  $('#gP').textContent='Tu vas être redirigé·e automatiquement vers le site de vote GEDIVOTE. Garde ton identifiant à portée de main.';
  $('#gActs').innerHTML=`<a class="btn btn-ruby" id="gGo" href="${VOTE_URL}">Y aller maintenant →</a><button class="btn btn-glass" type="button" id="gStop">Rester sur TO VOTE</button>`;
  let n=10,timer;ring(1);planeAt(0);
  const step=()=>{n--;$('#gNum').textContent=Math.max(n,0);$('#gUnit').textContent=n>1?'secondes':'seconde';ring(n/10);planeAt(1-n/10);
    if(n<=0){clearInterval(timer);$('#gH2').textContent='Décollage…';location.assign(VOTE_URL)}};
  timer=setInterval(step,1000);
  $('#gStop').onclick=()=>{clearInterval(timer);$('#gH2').textContent='Redirection annulée';$('#gP').textContent='Tu restes sur TO VOTE. Quand tu es prêt·e, rejoins le site de vote avec le bouton ci-dessous.';
    $('#gStop').remove();$('#gNum').textContent='—';$('#gUnit').textContent='en attente'};
}else if(state==='avant'){
  split($('#gTitle'),'Le vote','n\'est pas encore ouvert.');
  $('#gLead').textContent=`Ouverture du ${tour.nom} ${tour.txtOuv}. Ce jour-là, cette page te conduira directement vers le site de vote GEDIVOTE.`;
  $('#gSt').classList.add('off');$('#gStatus').textContent='À l\'heure';
  const d=Math.max(0,Math.ceil((Date.parse(tour.ouv)-now)/864e5));
  $('#gNum').textContent=d;$('#gUnit').textContent=d>1?'jours':'jour';ring(0);planeAt(0);
  $('#gH2').textContent='Prépare ton embarquement';
  $('#gP').textContent='Vérifie dès maintenant que tu as tout ce qu\'il faut pour voter.';
  $('#gActs').innerHTML='<a class="btn btn-ink" href="checklist.html">Faire ma checklist →</a><a class="btn btn-glass" href="calendrier.html">Voir le calendrier</a>';
}else{
  split($('#gTitle'),'Le vote','est clos.');
  $('#gLead').textContent='Merci d\'avoir voté ! Les résultats sont proclamés et publiés sur TO VOTE.';
  $('#gSt').classList.add('closed');$('#gStatus').textContent='Porte fermée';
  $('#gNum').textContent='✓';$('#gUnit').textContent='atterri';ring(1);planeAt(1);
  $('#gH2').textContent='Atterrissage';
  $('#gP').textContent='Les procès-verbaux sont publiés sur la page Documents.';
  $('#gActs').innerHTML='<a class="btn btn-ink" href="documents.html#pv">Voir les résultats →</a>';
}
