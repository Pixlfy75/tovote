#!/usr/bin/env python3
"""Génère la version restreinte de l'accueil, diffusée du 1er au 17 décembre 2026.

Avant le lancement officiel des élections, rien de ce qui touche au calendrier électoral ne doit être
communiqué. Cette version retire donc du code (et pas seulement de l'affichage) : compte à rebours,
date d'embarquement, bouton agenda, plan de vol, hublots des listes, dates de la safety card et de la
carte d'embarquement, assistant (ses réponses citent des dates). Calendrier, Candidatures et « Je vote »
sont verrouillés dans le menu.

Fichiers produits : index-temp.html, assets/js/pages/index-temp.js, assets/css/pages/index-temp.css
Usage, depuis la racine du site :  python3 outils/index-temp.py   (à relancer après chaque modification de l'accueil)
Le script refuse de produire les fichiers s'il y reste une date du calendrier électoral.
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
js = (ROOT / 'assets/js/pages/index.js').read_text(encoding='utf-8')


def cut(text, start, end, repl=''):
    a = text.index(start)
    b = text.index(end, a) + len(end)
    return text[:a] + repl + text[b:]


def sub(text, old, new):
    if old not in text:
        sys.exit('Motif introuvable dans l\'accueil : ' + old[:70])
    return text.replace(old, new)


LOCK = '<span class="l locked" aria-disabled="true" title="Bientôt disponible">🔒 {}</span>'

# ---------- Page ----------
h = html
h = sub(h, '<a class="l" href="calendrier.html">Calendrier</a>', LOCK.format('Calendrier'))
h = sub(h, '<a class="l" href="candidatures.html">Candidatures</a>', LOCK.format('Candidatures'))
h = sub(h, '<a class="btn btn-ruby" href="vote.html">Je vote</a>',
        '<span class="btn btn-ruby locked" aria-disabled="true" title="Bientôt disponible">🔒 Je vote</span>')
h = sub(h, '<link rel="stylesheet" href="assets/css/pages/index.css">',
        '<link rel="stylesheet" href="assets/css/pages/index.css">\n<link rel="stylesheet" href="assets/css/pages/index-temp.css">')
h = sub(h, '        <button class="btn btn-glass" id="addCal">📅 Ajouter à mon agenda</button>\n', '')
h = re.sub(r'<div class="cd" id="cd">.*?</div></div>', '<div class="soon">Les dates du vote seront annoncées prochainement.</div>', h, count=1, flags=re.S)
h = sub(h, '<span>Embarquement le 18 mars 2027</span>', '<span>Embarquement : bientôt</span>')
h = cut(h, '<!-- ================= ITINÉRAIRE ================= -->', '</section>')
h = cut(h, '<!-- ================= LISTES : HUBLOTS ================= -->', '</section>')
h = sub(h, 'où que tu sois, 24h/24 du 18 au 31 mars.', 'où que tu sois, 24h/24 pendant toute la période de vote.')
h = sub(h, 'Ton identifiant arrive par courrier dès le 10 mars, ton mot de passe', 'Ton identifiant arrive par courrier avant l\'ouverture du vote, ton mot de passe')
h = sub(h, '<a href="documents.html#pap">PAP</a>', '')                       # le PAP contient le calendrier
h = sub(h, '<script src="assets/js/pages/index.js"></script>', '<script src="assets/js/pages/index-temp.js"></script>')
h = sub(h, '<script src="assets/js/chat.js"></script>\n', '')               # l'assistant cite des dates
h = sub(h, '<title>', '<meta name="robots" content="noindex">\n<title>')

# ---------- Script ----------
j = js
j = sub(j, '/* TO VOTE · Envol — script de la page index.html */', '/* TO VOTE · Envol — script de la version restreinte de l\'accueil (index-temp.html), généré par outils/index-temp.py */')
j = sub(j, "cd();setInterval(cd,1000);", '')
j = re.sub(r"const TARGET=new Date\('[^']*'\);\nfunction cd\(\)\{[^\n]*\n", '', j)
j = cut(j, '/* ---------- Plan de vol piloté par le défilement', "new ResizeObserver(()=>buildRoute()).observe($('#routeWrap'));buildRoute();",
        "function route(){}\naddEventListener('load',()=>onScroll());")
j = cut(j, "const COLN={", "$$('.hub').forEach(h=>h.onclick=()=>{if(!h.disabled)location.href='candidatures.html#'+h.dataset.col});")
j = re.sub(r"\$\('#addCal'\)\.onclick=[^\n]*\n", '', j)
j = sub(j, "['EMBARQUEMENT','18.03→31.03']", "['EMBARQUEMENT','BIENTÔT']")

css = """/* TO VOTE · Envol — compléments de la version restreinte de l'accueil (index-temp.html), générés par outils/index-temp.py */
.nav .locked{opacity:.45;cursor:not-allowed;pointer-events:none}
.nav span.l{font-weight:600;font-size:.9rem;padding:.6em 1em;border-radius:999px}
.pass .soon{padding:16px;border-radius:16px;background:rgba(255,255,255,.75);text-align:center;font-weight:600}
"""

# ---------- Contrôle : plus aucune date du calendrier électoral ----------
DATE = r'\b(?:\d{1,2}(?:er)? (?:déc|janv|févr|mars|avr)\w*|\d{2}\.0[2-4]|2027-0[2-4]-\d\d|2027\d{4}T|calendrier\.html|candidatures\.html|vote\.html)'
left = re.findall(DATE, h) + re.findall(DATE, j)
if left:
    sys.exit('Dates ou liens restants : ' + ', '.join(sorted(set(left))))
(ROOT / 'index-temp.html').write_text(h, encoding='utf-8')
(ROOT / 'assets/js/pages/index-temp.js').write_text(j, encoding='utf-8')
(ROOT / 'assets/css/pages/index-temp.css').write_text(css, encoding='utf-8')
print('Version restreinte générée : aucune date du calendrier électoral.')
