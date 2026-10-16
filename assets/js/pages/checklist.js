/* TO VOTE · Envol — script de la page checklist.html */
let ci=0;document.querySelectorAll('[data-split]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${ci++}">${c}</span>`).join('')}</span>`).join(' ');el.setAttribute('aria-hidden','true')});
