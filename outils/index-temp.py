#!/usr/bin/env python3
"""Génère index-temp.html : l'accueil en version restreinte, diffusée du 1er au 17 décembre 2026.

Avant le lancement officiel des élections, rien de ce qui touche au calendrier électoral ne doit être
communiqué. Cette version retire donc du code (et pas seulement de l'affichage) : compte à rebours,
date d'embarquement, bouton agenda, plan de vol, hublots des listes, dates de la safety card et de la
carte d'embarquement, assistant (ses réponses citent des dates). Calendrier, Candidatures et « Je vote »
sont verrouillés dans le menu.

Usage, depuis la racine du site :  python3 outils/index-temp.py
À relancer après chaque modification de index.html.
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
s = (ROOT / 'index.html').read_text(encoding='utf-8')

def cut(text, start, end, repl='', incl_end=True):
    a = text.index(start)
    b = text.index(end, a) + (len(end) if incl_end else 0)
    return text[:a] + repl + text[b:]

def sub(text, old, new):
    if old not in text:
        sys.exit('Motif introuvable dans index.html : ' + old[:70])
    return text.replace(old, new)

LOCK = '<span class="l locked" aria-disabled="true" title="Bientôt disponible">🔒 {}</span>'

# Menu : Calendrier, Candidatures et « Je vote » verrouillés
s = sub(s, '<a class="l" href="calendrier.html">Calendrier</a>', LOCK.format('Calendrier'))
s = sub(s, '<a class="l" href="candidatures.html">Candidatures</a>', LOCK.format('Candidatures'))
s = sub(s, '<a class="btn btn-ruby" href="vote.html">Je vote</a>',
        '<span class="btn btn-ruby locked" aria-disabled="true" title="Bientôt disponible">🔒 Je vote</span>')
s = sub(s, '</style>', '.nav .locked{opacity:.45;cursor:not-allowed;pointer-events:none}\n.nav span.l{font-weight:600;font-size:.9rem;padding:.6em 1em;border-radius:999px}\n.pass .soon{padding:16px;border-radius:16px;background:rgba(255,255,255,.75);text-align:center;font-weight:600}\n</style>')

# Haut de page : ni agenda, ni compte à rebours, ni date
s = sub(s, '        <button class="btn btn-glass" id="addCal">📅 Ajouter à mon agenda</button>\n', '')
s = re.sub(r'<div class="cd" id="cd">.*?</div></div>', '<div class="soon">Les dates du vote seront annoncées prochainement.</div>', s, count=1, flags=re.S)
s = sub(s, '<span>Embarquement le 18 mars 2027</span>', '<span>Embarquement : bientôt</span>')

# Sections retirées : plan de vol et hublots des listes
s = cut(s, '<!-- ================= ITINÉRAIRE ================= -->', '</section>')
s = cut(s, '<!-- ================= LISTES : HUBLOTS ================= -->', '</section>')

# Safety card : réponses sans date
s = sub(s, 'où que tu sois, 24h/24 du 18 au 31 mars.', 'où que tu sois, 24h/24 pendant toute la période de vote.')
s = sub(s, 'Ton identifiant arrive par courrier dès le 10 mars, ton mot de passe', 'Ton identifiant arrive par courrier avant l\'ouverture du vote, ton mot de passe')

# Pied de page : le PAP contient le calendrier
s = sub(s, '<a href="documents.html#pap">PAP</a>', '')

# Scripts : compte à rebours, plan de vol, hublots, agenda
s = sub(s, "cd();setInterval(cd,1000);", '')
s = re.sub(r"const TARGET=new Date\('[^']*'\);\nfunction cd\(\)\{[^\n]*\n", '', s)
s = cut(s, '/* ---------- Plan de vol piloté par le défilement', "new ResizeObserver(()=>buildRoute()).observe($('#routeWrap'));buildRoute();",
        "function route(){}\naddEventListener('load',()=>onScroll());")
s = cut(s, "const COLN={", "$$('.hub').forEach(h=>h.onclick=()=>{if(!h.disabled)location.href='candidatures.html#'+h.dataset.col});")
s = re.sub(r"\$\('#addCal'\)\.onclick=[^\n]*\n", '', s)
s = sub(s, "['EMBARQUEMENT','18.03→31.03']", "['EMBARQUEMENT','BIENTÔT']")

# Assistant retiré (ses réponses citent des dates)
s = sub(s, '<script src="chat.js"></script>\n', '')
s = sub(s, '<title>', '<meta name="robots" content="noindex">\n<title>')

# Contrôle : plus aucune date du calendrier électoral
left = re.findall(r'\b(?:\d{1,2}(?:er)? (?:déc|janv|févr|mars|avr)\w*|\d{2}\.0[2-4]|2027-0[2-4]-\d\d|calendrier\.html|candidatures\.html)', s)
if left:
    sys.exit('Dates ou liens restants : ' + ', '.join(sorted(set(left))))
(ROOT / 'index-temp.html').write_text(s, encoding='utf-8')
print('index-temp.html généré : aucune date du calendrier électoral.')
