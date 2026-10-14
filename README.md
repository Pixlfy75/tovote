# TO VOTE 2027

Site d'information sur les élections professionnelles (CSE) de Transavia, direction artistique **Envol** : ciel en dégradés doux, verre dépoli, titres XXL, équipage illustré.

- `index.html` : accueil (compte à rebours, équipage, Vrai/Faux, itinéraire, check-in et carte d'embarquement, listes derrière les hublots, consignes de sécurité)
- `cse.html` : Le CSE (composition, missions, moyens, qui fait quoi, lexique)
- `calendrier.html` : Calendrier en plan de vol (préparation, campagne, scrutin)
- `candidatures.html` : Candidatures par collège (PNC, PNT, Cadres, ETAM) et calculateur de parité
- `faq.html` : FAQ avec recherche
- `crew.js` : l'équipage illustré, commun à toutes les pages (une variante femme ou homme par métier, tirée au hasard à chaque ouverture, puis qui change toute seule toutes les 6 secondes)
- `assets/` : logos Transavia et TO VOTE, polices Söhne (Buch, Halbfett)

Pour voir le site : `python3 -m http.server` à la racine, puis ouvrir http://localhost:8000.

À noter : les dates suivent le calendrier électoral communiqué ; sièges, effectifs, listes et noms sont fictifs. Les références juridiques sont à faire valider. La police de titre Söhne Breit Fett n'a pas été fournie ; Archivo Expanded (Google Fonts) la remplace provisoirement.
