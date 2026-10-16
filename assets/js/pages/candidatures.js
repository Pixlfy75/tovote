/* TO VOTE · Envol — script de la page candidatures.html */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)};
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
let ci=0;$$('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(el=>io.observe(el));


/* ---------- Données du PAP du 13 octobre 2026 (art. 3 à 6) ; listes et noms des candidat·es fictifs ---------- */
const COL={
  pnc:{name:'PNC',no:'4e collège',full:'Personnels navigants commerciaux',jobs:'Hôtesses, stewards, chef·fes de cabine',tit:15,sup:15,eff:1906,f:66.32,lists:['A','B','C']},
  pnt:{name:'PNT',no:'3e collège',full:'Personnels navigants techniques',jobs:'Commandant·es de bord, officier·es pilotes',tit:10,sup:10,eff:1182.72,f:6.95,lists:['A','B']},
  cadre:{name:'Cadres',no:'2e collège',full:'Cadres',jobs:'Cadres des services au sol',tit:3,sup:3,eff:445.95,f:37.30,lists:['A','C']},
  etam:{name:'ETAM',no:'1er collège',full:'Ouvriers, employés, techniciens et agents de maîtrise',jobs:'Agents d\'escale, techniciens, employé·es, agents de maîtrise',tit:2,sup:2,eff:228.95,f:55.51,lists:['A','B','C']},
};
const pct=x=>x.toFixed(2).replace('.',',')+' %';
const FIRST={f:['Camille','Inès','Léa','Sarah','Manon','Chloé','Nora','Julie','Emma','Lina','Zoé','Anne-Sophie'],m:['Thomas','Karim','Lucas','Hugo','Yanis','Nathan','Mehdi','Jean-Baptiste','Paul','Théo','Adam','Louis']};
const LAST=['MARTIN','BERNARD','DUBOIS','N\'DIAYE','PETIT','DURAND','LEROY','MOREAU','DA SILVA','LAURENT','LEFEBVRE','GARCIA','BEN AMAR','FOURNIER','GIRARD','NGUYEN','MERCIER','DE LA FONTAINE-MOREAU','BONNET','FRANÇOIS','ROUSSEAU','BLANC','GUÉRIN','MULLER'];
/* Ordre alterné conforme à la parité, utilisé aussi pour générer des listes d'exemple cohérentes */
function parity(n,fPct){
  const fx=n*fPct/100,mx=n-fx,round=x=>{const d=x-Math.floor(x);return d>=.5-1e-9?Math.ceil(x):Math.floor(x)};
  let F=round(fx),M=round(mx),either=false;
  if(F+M>n){either=true;M=n-F}            /* deux décimales à ,5 : l'un ou l'autre */
  if(F+M<n){F=n-M}
  const zero=(F===0&&fPct>0)||(M===0&&fPct<100);
  return {F,M,either,zero,fx,mx};
}
function sequence(F,M,startF){const s=[];let f=F,m=M,turnF=startF;while(f||m){if((turnF&&f)||!m){s.push('f');f--}else{s.push('m');m--}turnF=!turnF}return s}
function makeList(colKey,L,n){
  let seed=[...colKey+L+n].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,11);const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
  const p=parity(n,COL[colKey].f),seq=sequence(p.F,p.M,rnd()>.5);
  return seq.map((sx,i)=>({n:i+1,last:LAST[rnd()*LAST.length|0],first:FIRST[sx==='f'?'f':'m'][rnd()*12|0]}));
}

/* ---------- Collèges ---------- */
let cur=(location.hash.slice(1) in COL)?location.hash.slice(1):store.get('tv_col','pnc');
let published=store.get('tv_pub',false);
$('#colleges-grid').innerHTML=Object.entries(COL).map(([k,c])=>`<button class="col glass" data-k="${k}" aria-pressed="false"><div class="bob">${charSVG(k)}</div><b>${c.name}</b><small>${c.full}</small><span class="seats">${c.tit} sièges titulaires</span></button>`).join('');
/* au clic, on montre tout de suite le panneau du collège (il est plus bas dans la page) */
$$('#colleges-grid .col').forEach(b=>b.onclick=()=>{select(b.dataset.k);$('#panel').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})});

function select(k){
  cur=k;store.set('tv_col',k);try{history.replaceState(null,'','#'+k)}catch(e){}
  $$('#colleges-grid .col').forEach(b=>{const on=b.dataset.k===k;b.setAttribute('aria-pressed',on);if(on)wave($('.char',b))});
  renderPanel();
}
const cand=x=>`<li><i>${x.n}</i><span class="who"><b>${x.last}</b> ${x.first}</span></li>`;
function renderPanel(){
  const c=COL[cur],order=[...c.lists].sort();  /* ordre alphabétique des organisations syndicales (PAP, art. 7.4.2) */
  const kpis=`<div class="kpis">
    <div class="kpi"><b>${c.tit}</b><span>sièges titulaires</span></div>
    <div class="kpi"><b>${c.sup}</b><span>sièges suppléant·es</span></div>
    <div class="kpi"><b>${Math.round(c.eff).toLocaleString('fr-FR')}</b><span>salarié·es (effectif)</span></div>
    <div class="kpi"><b>${pct(c.f)}</b><span>de femmes · ${pct(100-c.f)} d'hommes</span><div class="bar"><i style="width:${c.f}%"></i><i style="width:${100-c.f}%"></i></div></div></div>`;
  const lists=published?`<div class="lists">${order.map(L=>{const tit=makeList(cur,L,c.tit),sup=makeList(cur,L+'s',c.sup);
      return `<article class="lst"><div class="lst-top"><span class="lst-logo">logo<br>liste</span><div><b>Organisation syndicale ${L}</b><small>Liste d'exemple · ${c.name}</small></div></div>
      <div class="row"><button class="btn btn-ink btn-sm" data-pdf="${L}">📄 Profession de foi</button><span class="chip">${c.tit} + ${c.sup} candidat·es</span></div>
      <details><summary>Voir les candidat·es</summary><div class="cands"><div><h5>Titulaires</h5><ol>${tit.map(cand).join('')}</ol></div><div><h5>Suppléant·es</h5><ol>${sup.map(cand).join('')}</ol></div></div></details></article>`}).join('')}</div>`
    :`<div class="locked"><div class="win"><span></span></div><div><b>Les listes du collège ${c.name} seront affichées le 5 mars.</b><p style="margin-top:6px;font-size:.95rem">Elles apparaîtront ici, toutes au même format, par ordre alphabétique des organisations syndicales.</p><div style="margin-top:12px"><button class="btn btn-glass btn-sm" id="notify">🔔 Préviens-moi à la publication</button></div></div></div>`;
  $('#panel').innerHTML=`<div class="swap"><div class="panel-head"><div><span class="chip"><i></i>Collège · PAP du 13 octobre 2026</span><h3 class="h" style="margin-top:10px">${c.name}</h3><p class="no">${c.no}</p><p class="full">${c.full}</p><p>${c.jobs}.</p></div></div>${kpis}
    <div class="lists-head"><h4 class="h">${published?`${c.lists.length} listes en lice`:'Listes en lice'}</h4><span class="neutral">⚖️ Même format pour toutes · ordre alphabétique des organisations · noms fictifs</span></div>${lists}
    <div class="demo"><button class="btn btn-glass btn-sm" id="demo">${published?'↺ Revenir avant le 5 mars':'🧪 Démo : simuler la publication du 5 mars'}</button></div></div>`;
  $('#notify')?.addEventListener('click',e=>{e.currentTarget.textContent='✅ C\'est noté';toast('🔔 Tu seras prévenu·e à la publication')});
  $('#demo').onclick=()=>{published=!published;store.set('tv_pub',published);renderPanel();setPhase()};
  $$('[data-pdf]').forEach(b=>b.onclick=()=>toast(`📄 Profession de foi de la liste ${b.dataset.pdf} (PDF à venir)`));
}
function setPhase(){const li=$$('#phase li');li.forEach((l,i)=>{l.className=i<(published?2:1)?'done':i===(published?2:1)?'now':''});$('#phase ol').style.setProperty('--done',published?.5:.25)}

/* ---------- Démarrage ---------- */
select(cur);setPhase();
if(!reduce)setInterval(()=>{const v=$$('.col .char').filter(s=>{const r=s.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0});if(v.length)wave(v[Math.random()*v.length|0])},3600);
const root=document.documentElement;
addEventListener('scroll',()=>root.style.setProperty('--p',Math.min(1,scrollY/(root.scrollHeight-innerHeight||1)).toFixed(4)),{passive:true});
