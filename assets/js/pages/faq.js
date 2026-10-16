/* TO VOTE · Envol — script de la page faq.html */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)};

/* ---------- Titre : lettres qui montent une fois ---------- */
let ci=0;$$('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});

/* ---------- Pictogrammes : pictos.js (communs à l'accueil, la FAQ et les documents) ---------- */
const svg=k=>picto(k);

/* ---------- Contenu de la FAQ : faq-data.js (partagé avec l'assistant de bord) ---------- */
const FAQ=window.TV_FAQ;
const POPULAR=['rotation','anonymat','codes','procuration','qui-candidat'];

/* ---------- Rendu ---------- */
const all=FAQ.flatMap(g=>g.items.map(it=>({...it,g})));
$('#cats').innerHTML=FAQ.map(g=>`<a class="cat glass" href="#${g.id}">${svg(g.id)}<b>${g.name}</b><small>${g.items.length} questions</small></a>`).join('');
$('#side').innerHTML=FAQ.map(g=>`<a href="#${g.id}" data-g="${g.id}">${g.name}<small>${g.items.length}</small></a>`).join('')+`<a class="ask-link" href="#ask">Poser ma question</a>`;
$('#askCat').innerHTML+=FAQ.map(g=>`<option>${g.name}</option>`).join('');
$('#groups').innerHTML=FAQ.map(g=>`<section class="group" id="${g.id}"><div class="g-head">${svg(g.id)}<h2 class="h">${g.name}</h2></div>${
  all.filter(it=>it.g===g).map(it=>`<details class="qa glass" id="${it.id}"><summary><span class="qt">${it.q}</span></summary>
  <div class="ans"><p class="short">${it.s}</p><div class="long">${it.l}</div>
  <div class="meta">${it.r?`<span class="ref">📘 ${it.r}</span>`:'<span></span>'}<span class="tools"><button data-link aria-label="Copier le lien de la question">🔗 Copier le lien</button></span></div></div></details>`).join('')}</section>`).join('');
$('#popular').innerHTML+=POPULAR.map(id=>{const it=all.find(x=>x.id===id);return `<button data-open="${id}">${it.q.replace(/ \?$/,' ?')}</button>`}).join('');

/* ---------- Recherche (insensible aux accents) ---------- */
const norm=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function hl(text,words){if(!words.length)return esc(text);const n=norm(text),marks=[];
  words.forEach(w=>{let i=0;while((i=n.indexOf(w,i))>-1){marks.push([i,i+w.length]);i+=w.length}});
  if(!marks.length)return esc(text);marks.sort((a,b)=>a[0]-b[0]);let out='',pos=0;
  for(const [a,b] of marks){if(a<pos)continue;out+=esc(text.slice(pos,a))+'<mark>'+esc(text.slice(a,b))+'</mark>';pos=b}return out+esc(text.slice(pos))}
function search(){
  const raw=$('#q').value.trim(),words=norm(raw).split(/\s+/).filter(w=>w.length>1);
  $('#searchBox').classList.toggle('has',!!raw);let n=0;
  all.forEach(it=>{const el=$('#'+it.id),hay=norm([it.q,it.s,it.l.replace(/<[^>]+>/g,' '),it.k,it.r].join(' '));
    const ok=words.every(w=>hay.includes(w));el.hidden=!ok;if(ok)n++;
    $('.qt',el).innerHTML=hl(it.q,words);$('.short',el).innerHTML=hl(it.s,words);
    if(words.length&&ok&&n<=3)el.open=true;if(!words.length)el.open=false});
  FAQ.forEach(g=>{const vis=g.items.some(it=>!$('#'+it.id).hidden);$('#'+g.id).hidden=!vis;$(`.side a[data-g="${g.id}"]`).classList.toggle('off',!vis)});
  $('#count').textContent=raw?(n?`${n} réponse${n>1?'s':''} pour « ${raw} »`:''):`${all.length} réponses dans 6 catégories`;
  $('#empty').classList.toggle('show',!!raw&&!n);
  if(raw&&!n){$('#emptyTxt').textContent=`Rien pour « ${raw} ». Essaie d'autres mots, ou pose-nous directement ta question.`;const c=$('#emptyChar .char');c&&c.classList.add('sad')}
}
let t;$('#q').addEventListener('input',()=>{clearTimeout(t);t=setTimeout(search,120)});
$('#clear').onclick=()=>{$('#q').value='';search();$('#q').focus()};
addEventListener('keydown',e=>{if(e.key==='/'&&!e.target.matches('input,textarea,select')){e.preventDefault();$('#q').focus()}});

/* Ouvrir une question (populaires, lien direct) */
function openQ(id){const el=$('#'+id);if(!el)return;$('#q').value='';search();el.open=true;el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}
$$('[data-open]').forEach(b=>b.onclick=()=>openQ(b.dataset.open));
const fromHash=()=>{if(location.hash&&all.some(it=>'#'+it.id===location.hash))setTimeout(()=>openQ(location.hash.slice(1)),300)};
fromHash();addEventListener('hashchange',fromHash);

/* Retours et liens */
document.addEventListener('click',e=>{
  const lk=e.target.closest('[data-link]');
  if(lk){const id=lk.closest('details').id;navigator.clipboard?.writeText(location.href.split('#')[0]+'#'+id).catch(()=>{});try{history.replaceState(null,'','#'+id)}catch(e){}toast('🔗 Lien de la question copié')}
});

/* Sommaire qui suit la lecture */
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.side a[data-g]').forEach(a=>a.classList.toggle('on',a.dataset.g===e.target.id))}),{rootMargin:'-30% 0px -60% 0px'});
$$('.group').forEach(g=>so.observe(g));

/* ---------- Personnages ---------- */
$$('[data-char]').forEach(el=>el.innerHTML=charSVG(el.dataset.char));
if(!reduce)setInterval(()=>wave($('#askChar .char')),4200);

/* Formulaire (maquette : rien n'est envoyé) */
/* Pas de serveur : la question part par la messagerie de la personne, pré-remplie vers l'adresse des élections */
$('#askForm').onsubmit=e=>{e.preventDefault();const cat=$('#askCat').value,q=$('#askTxt').value.trim();if(!q)return;
  const subject='Question élections CSE 2027'+(cat?' : '+cat:'');
  location.href='mailto:to-vote@fr.transavia.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(q+'\n\n');
  const c=$('#askChar .char');c&&c.classList.add('happy');setTimeout(()=>c&&c.classList.remove('happy'),1200);toast('✉️ Ta messagerie s\'ouvre : il ne reste qu\'à envoyer')};

/* Ciel qui évolue au défilement */
const root=document.documentElement;
addEventListener('scroll',()=>root.style.setProperty('--p',Math.min(1,scrollY/(root.scrollHeight-innerHeight||1)).toFixed(4)),{passive:true});
search();
