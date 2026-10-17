/* TO VOTE · Envol — script de la version restreinte de l'accueil (index-temp.html), généré par outils/index-temp.py */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)};

/* ---------- Grands titres : découpage en lettres pour l'animation d'entrée (une seule fois) ---------- */
let ci=0;
$$('[data-split]').forEach(el=>{const words=el.textContent.split(' ');el.innerHTML=words.map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});


/* ---------- Personnages (générés pour pouvoir les animer) ---------- */
$$('[data-char]').forEach(el=>el.innerHTML=charSVG(el.dataset.char));
if(!reduce)setInterval(()=>{const vis=$$('.char').filter(s=>{const r=s.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0&&!s.classList.contains('happy')&&!s.classList.contains('sad')});if(vis.length)wave(vis[Math.random()*vis.length|0])},3200);

/* ---------- Le grand avion en papier pivote en 3D au fil du défilement (plane.js) ---------- */
let heroKey=-1;
function heroPlane3d(){const q=reduce?0:Math.min(1,scrollY/innerHeight),k=Math.round(q*80);if(k===heroKey)return;heroKey=k;
  planeLive($('#heroPlane'),{yaw:-30+60*q,pitch:12-6*q,roll:24-56*q,elev:14,sw:.05})}
heroPlane3d();

/* ---------- Défilement : ciel, parallaxe, altimètre ---------- */
const root=document.documentElement,giants=$$('[data-speed]');
function onScroll(){const p=Math.min(1,scrollY/(root.scrollHeight-innerHeight||1));root.style.setProperty('--p',p.toFixed(4));
  $('#altiVal').textContent=Math.round(p*10000).toLocaleString('fr-FR')+' m';
  if(!reduce)giants.forEach(g=>{const s=+g.dataset.speed,rot=+(g.dataset.rot||0);g.style.transform=`translateY(${scrollY*s}px) rotate(${rot+p*(rot?40:0)}deg)`});
  heroPlane3d();
  route()}
addEventListener('scroll',onScroll,{passive:true});

/* Apparitions */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(el=>io.observe(el));

/* ---------- Compte à rebours : ouverture du 1er tour ---------- */


/* ---------- Équipage ---------- */
$$('.member').forEach(m=>m.onclick=()=>{m.classList.toggle('on');wave($('.char',m))});

/* ---------- Vrai / Faux ---------- */
const CARDS=[['Il faut être syndiqué·e pour voter.',false,'Faux : 16 ans et 3 mois d\'ancienneté suffisent.'],['Mon vote reste anonyme, même en ligne.',true,'Vrai : identité et bulletin sont séparés.'],['En rotation, je ne peux pas voter.',false,'Faux : tu votes depuis ton téléphone.'],['Les élu·es siègent 4 ans.',true,'Vrai : sauf accord qui réduit la durée.']];
const TINTS=['rgba(243,133,255,.45)','rgba(5,206,120,.4)','rgba(255,136,103,.45)','rgba(0,83,255,.3)'];
let k=0,good=0;
/* La mascotte : un personnage tiré au hasard pour la session, qui ne change plus */
const MASCOT=(()=>{const R=['pnc','pnt','cadre','etam'];let m;try{m=JSON.parse(sessionStorage.getItem('tv_mascot'))}catch(e){}
  if(!m||!R.includes(m.k)||!['f','h'].includes(m.g)){m={k:R[Math.random()*4|0],g:Math.random()<.5?'f':'h'};try{sessionStorage.setItem('tv_mascot',JSON.stringify(m))}catch(e){}}
  return m})();
$('#mascot').innerHTML=charSVG(MASCOT.k,MASCOT.g);
function say(t){const b=$('#mBubble');b.textContent=t;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
function react(ok){const s=$('#mascot .char');s.classList.add(ok?'happy':'sad');say(ok?['Bien vu ! 🎉','Exactement ✈️','Yes ! 🙌'][good%3]:'Raté… mais maintenant tu sais 😉');
  setTimeout(()=>{s.classList.remove('happy','sad');if(k<CARDS.length)say('Et celle-là ? 👉')},1300)}
function deck(){const d=$('#deck');d.innerHTML='';
  if(k>=CARDS.length){setTimeout(()=>{const s=$('#mascot .char');s&&s.classList.add('happy');setTimeout(()=>s&&s.classList.remove('happy'),1200)},1350);d.innerHTML=`<div class="done glass"><div><div class="h" style="font-size:3.4rem;color:var(--web-green)">${good}/${CARDS.length}</div><p class="sub" style="margin-top:8px">${good===CARDS.length?'Sans turbulence ✈️':'Bon vol quand même 😉'}</p><button class="btn btn-ink" style="margin-top:16px" id="again">Rejouer</button></div></div>`;$('#again').onclick=()=>{k=0;good=0;$('#verdict').textContent='';mascotFor(0);say('À toi de jouer ! 👉');deck()};return}
  CARDS.slice(k,k+3).reverse().forEach((c,i,arr)=>{const depth=arr.length-1-i,el=document.createElement('div');el.className='card glass';
    el.style.background=`linear-gradient(160deg,rgba(255,255,255,.8),${TINTS[(k+depth)%4]})`;el.style.transform=`translateY(${depth*14}px) scale(${1-depth*.05})`;el.style.zIndex=10-depth;
    el.innerHTML=`<span class="seal t">VRAI</span><span class="seal f">FAUX</span><span class="k">${k+depth+1} / ${CARDS.length}</span><div class="h">${c[0]}</div><span class="k">← faux · vrai →</span>`;d.append(el);if(!depth)drag(el)})}
function answer(v){const top=$('#deck .card:last-child');if(!top)return;const c=CARDS[k],ok=v===c[1];if(ok)good++;$('#verdict').textContent=(ok?'✅ ':'❌ ')+c[2];react(ok);
  top.style.transform=`translate(${v?600:-600}px,-40px) rotate(${v?25:-25}deg)`;top.style.opacity=0;k++;setTimeout(deck,320)}
function drag(el){let sx=0,dx=0;el.onpointerdown=e=>{sx=e.clientX;el.setPointerCapture(e.pointerId);el.classList.add('drag')};
  el.onpointermove=e=>{if(!el.hasPointerCapture(e.pointerId))return;dx=e.clientX-sx;el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;$('.seal.t',el).style.opacity=Math.max(0,dx/110);$('.seal.f',el).style.opacity=Math.max(0,-dx/110)};
  el.onpointerup=()=>{el.classList.remove('drag');if(Math.abs(dx)>110)answer(dx>0);else{el.style.transform='';$$('.seal',el).forEach(s=>s.style.opacity=0)}dx=0}}
$('#bT').onclick=()=>answer(true);$('#bF').onclick=()=>answer(false);
addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;const r=$('#deck').getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){if(e.key==='ArrowRight')answer(true);if(e.key==='ArrowLeft')answer(false)}});
deck();

function route(){}
addEventListener('load',()=>onScroll());


/* ---------- Check-in : carte d'embarquement (canvas, rien n'est envoyé) ---------- */
const ck={job:'pnc',age:18,anc:12};
const logoImg=new Image();logoImg.src='assets/img/tovote-logo.png';
let charImg=new Image();
function loadChar(){charImg=new Image();charImg.onload=drawPass;charImg.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(charSVG(ck.job).replace(/ style="[^"]*"/,''))}
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h)}
function drawPass(){
  const cv=$('#pass'),c=cv.getContext('2d'),W=cv.width,H=cv.height,S=880;
  const vote=ck.age>=16&&ck.anc>=3,cand=ck.age>=18&&ck.anc>=12;
  const name=($('#ciName').value.trim()||'Toi').toUpperCase();
  const head='"Archivo","Soehne",Arial Black,sans-serif',body='"Soehne",Arial,sans-serif';
  if('fontStretch' in c)c.fontStretch='expanded';
  c.clearRect(0,0,W,H);c.save();rr(c,0,0,W,H,40);c.clip();
  c.fillStyle='#fff';c.fillRect(0,0,W,H);
  c.fillStyle='#05CE78';c.fillRect(0,0,S,140);
  c.fillStyle='#140D8A';c.fillRect(S,0,W-S,H);
  if(logoImg.complete&&logoImg.naturalWidth){const h=104,w=h*logoImg.naturalWidth/logoImg.naturalHeight;c.drawImage(logoImg,36,18,w,h)}
  c.fillStyle='#140D8A';c.textAlign='right';c.font=`900 30px ${head}`;c.fillText("CARTE D'EMBARQUEMENT",S-36,64);
  c.font=`600 22px ${body}`;if('fontStretch' in c)c.fontStretch='normal';c.fillText('Élections CSE 2027 · Électeur·rice',S-36,100);
  c.textAlign='left';
  const lab=(t,x,y)=>{if('fontStretch' in c)c.fontStretch='normal';c.fillStyle='rgba(20,13,138,.6)';c.font=`600 18px ${body}`;c.fillText(t,x,y)};
  const val=(t,x,y,sz=34)=>{if('fontStretch' in c)c.fontStretch='expanded';c.fillStyle='#140D8A';c.font=`900 ${sz}px ${head}`;c.fillText(t,x,y)};
  lab('PASSAGER·ÈRE',40,190);let fs=66;if('fontStretch' in c)c.fontStretch='expanded';c.font=`900 ${fs}px ${head}`;while(c.measureText(name).width>S-80&&fs>34){fs-=4;c.font=`900 ${fs}px ${head}`}val(name,40,256,fs);
  const cols=[['VOL','TO 2027'],['EMBARQUEMENT','BIENTÔT'],['PORTE','EN LIGNE'],['MÉTIER',ck.job.toUpperCase()]];
  cols.forEach(([l,v],i)=>{const x=40+i*210;lab(l,x,320);val(v,x,360,28)});
  const pill=(x,ok,t)=>{rr(c,x,400,390,110,24);c.fillStyle=ok?'#05CE78':'#FFD6C9';c.fill();c.fillStyle='#140D8A';if('fontStretch' in c)c.fontStretch='normal';c.font=`600 18px ${body}`;c.fillText(t,x+22,440);if('fontStretch' in c)c.fontStretch='expanded';c.font=`900 32px ${head}`;c.fillText(ok?'AUTORISÉ ✓':'PAS ENCORE',x+22,486)};
  pill(40,vote,'VOTE');pill(450,cand,'CANDIDATURE');
  /* hublot clair derrière le personnage, sinon sa tenue se fond dans le talon bleu */
  c.save();c.beginPath();c.arc(S+160,148,100,0,Math.PI*2);const hg=c.createLinearGradient(0,48,0,248);hg.addColorStop(0,'#FFD9F9');hg.addColorStop(1,'#C9F5DF');c.fillStyle=hg;c.fill();c.clip();
  if(charImg.complete&&charImg.naturalWidth)c.drawImage(charImg,S+60,46,200,220);
  c.restore();
  c.fillStyle='#fff';c.textAlign='center';if('fontStretch' in c)c.fontStretch='expanded';c.font=`900 30px ${head}`;c.fillText('TO 2027',S+160,300);
  if('fontStretch' in c)c.fontStretch='normal';c.font=`600 20px ${body}`;c.fillText(name.slice(0,14),S+160,332);
  let seed=[...name+ck.job].reduce((a,ch)=>a*31+ch.charCodeAt(0)>>>0,7);const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
  let x=S+46;while(x<W-46){const w=rnd()>.6?6:3;c.fillRect(x,380,w,120);x+=w+(rnd()>.5?5:3)}
  c.restore();
  c.save();c.globalCompositeOperation='destination-out';[0,H].forEach(y=>{c.beginPath();c.arc(S,y,26,0,Math.PI*2);c.fill()});c.restore();
  c.setLineDash([10,10]);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=3;c.beginPath();c.moveTo(S,34);c.lineTo(S,H-34);c.stroke();c.setLineDash([]);
  $('#ciRes').innerHTML=`<span class="${vote?'ok':'no'}">${vote?'✅ Tu peux voter':'⏳ Pas encore électeur·rice'}</span><span class="${cand?'ok':'no'}">${cand?'✅ Tu peux te présenter':'⏳ Candidature : pas encore'}</span>`;
}
$$('.ci .pills').forEach(g=>$$('button',g).forEach(b=>b.onclick=()=>{$$('button',g).forEach(x=>x.setAttribute('aria-pressed',x===b));const key=g.dataset.k;ck[key]=key==='job'?b.dataset.v:+b.dataset.v;key==='job'?loadChar():drawPass()}));
$('#ciName').oninput=drawPass;logoImg.onload=drawPass;loadChar();document.fonts?.ready.then(drawPass);
$('#ciDl').onclick=()=>{const a=document.createElement('a');a.href=$('#pass').toDataURL('image/png');a.download='carte-embarquement-to-vote.png';a.click();toast('🎫 Carte téléchargée')};
$('#ciShare').onclick=async()=>{try{const blob=await new Promise(r=>$('#pass').toBlob(r)),file=new File([blob],'carte-to-vote.png',{type:'image/png'});
  if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'TO VOTE 2027',text:'Mon check-in est fait 🗳️'});else{await navigator.clipboard?.writeText(location.href).catch(()=>{});toast('🔗 Lien copié')}}catch{}};

/* ---------- Hublots ---------- */


/* ---------- Vidéos : écran de divertissement en vol ----------
   Pour publier une vidéo : renseigner son identifiant YouTube dans « yt » (la partie après « v= » dans l'adresse),
   et sa durée dans « d ». Sans identifiant, la vignette est illustrée et la vidéo s'affiche « Bientôt à l'affiche ». */
const VIDEOS=[
  {yt:'03u881w3PbQ',t:'Les élections CSE 2027 en vidéo',s:'',tag:'À la une',d:'',bg:'linear-gradient(135deg,#05CE78,#0053FF)',who:['pnc','pnt']},
  {yt:'',t:'Le CSE en 2 minutes',s:'Ce que fait le CSE au quotidien, et pourquoi ton vote compte.',tag:'Comprendre',d:'',bg:'linear-gradient(135deg,#F385FF,#7B6CFF)',who:['pnt','sol']},
  {yt:'',t:'Voter en ligne, pas à pas',s:'Identifiant, IBAN, mot de passe : le tuto pour voter en 3 minutes.',tag:'Tuto',d:'',bg:'linear-gradient(135deg,#05CE78,#0053FF)',who:['pnc','pnt']},
  {yt:'',t:'Et pourquoi pas toi ?',s:'Elles et ils sont élu·es : leur mandat raconté en vrai.',tag:'Témoignages',d:'',bg:'linear-gradient(135deg,#FF8867,#F385FF)',who:['sol','pnc']}
];
const PLAY='<svg viewBox="0 0 20 22" aria-hidden="true"><path d="M2 1.5v19L19 11z" fill="#140D8A"/></svg>';
$('#ifeGrid').innerHTML=VIDEOS.map((v,i)=>`<button class="vcard" data-v="${i}" aria-label="Lire la vidéo : ${v.t}"${i?'':` style="grid-row:span ${Math.max(1,VIDEOS.length-1)}"`}>
  <span class="thumb" style="--bg:${v.bg}">${v.yt?`<img src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">`:`<span class="poster">${v.who.map(k=>`<span class="who">${charSVG(k)}</span>`).join('')}</span>`}
  <span class="tag">${v.tag}</span><span class="play">${PLAY}</span>${v.d||!v.yt?`<span class="dur">${v.d||'Bientôt'}</span>`:''}</span>
  <span class="vt">${v.t}</span>${v.s?`<span class="vs">${v.s}</span>`:''}</button>`).join('');
$('#ifeGrid').onclick=e=>{const c=e.target.closest('.vcard');if(!c)return;const v=VIDEOS[+c.dataset.v];
  $('#vmTitle').textContent=v.t;
  $('#vmVideo').innerHTML=v.yt?`<iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0&modestbranding=1&cc_lang_pref=fr" title="${v.t}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
    :`<div class="vm-soon"><span style="font-size:2.4rem">🎬</span><b>Bientôt à l'affiche</b><span>Cette vidéo sera publiée ici pendant la campagne. Reviens vite !</span></div>`;
  $('#vmodal').showModal()};
const vmClose=()=>{$('#vmodal').close()};
$('#vmX').onclick=vmClose;$('#vmodal').onclick=e=>{if(e.target.id==='vmodal')vmClose()};
$('#vmodal').addEventListener('close',()=>{$('#vmVideo').innerHTML=''}); /* coupe le son à la fermeture */

/* ---------- Consignes de sécurité ---------- */
$$('.panel').forEach(p=>p.onclick=()=>p.classList.toggle('on'));

/* ---------- Ouverture dans les nuages ---------- */
(()=>{const it=$('#cintro'),ready=()=>document.body.classList.add('ready');
  if(reduce||document.documentElement.classList.contains('no-intro')){it.remove();ready();return}
  /* première visite de la session : on la note tout de suite (cookie sans date d'expiration = effacé à la fermeture du navigateur) */
  try{document.cookie='tv_intro=1; path=/; SameSite=Lax'}catch(e){}try{sessionStorage.setItem('tv_intro','1')}catch(e){}
  /* séquence automatique : logo dans les nuages, puis les nuages s'écartent, sans attendre le chargement complet */
  let done=false;const open=()=>{if(done)return;done=true;it.classList.add('open');setTimeout(ready,350);setTimeout(()=>it.remove(),1700)};
  it.onclick=open;setTimeout(open,1100)})();

/* ---------- Divers ---------- */
onScroll();
