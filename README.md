# TO VOTE 2027

Site d'information sur les élections professionnelles (CSE) de Transavia, direction artistique **Envol** : ciel en dégradés doux, verre dépoli, titres XXL, équipage illustré.

- `index.html` : accueil (compte à rebours, équipage, Vrai/Faux, itinéraire, check-in et carte d'embarquement, listes derrière les hublots, consignes de sécurité)
- `cse.html` : Le CSE (composition, missions, moyens, qui fait quoi, lexique)
- `calendrier.html` : Calendrier en plan de vol (préparation, campagne, scrutin)
- `candidatures.html` : Candidatures par collège (PNC, PNT, Cadres, ETAM) et listes déposées
- `faq.html` : FAQ avec recherche
- `documents.html` : Documents officiels (PAP, listes, guide du vote, résultats), publiés à leur date
- `quiz.html` : Grand quiz d'auto-évaluation (18 questions sur le vote, le CSE et les candidatures), licence de vol, correction détaillée et liens vers TO Learn et la page CSE
- `crew.js` : l'équipage illustré, commun à toutes les pages (une variante femme ou homme par métier, tirée au hasard à chaque ouverture, puis qui change toute seule toutes les 6 secondes)
- `assets/vendor/pdfjs/` : PDF.js 3.11.174 (Mozilla, licence Apache 2.0), pour afficher les documents dans la visionneuse de la page Documents
- `chat.js` : l'assistant de bord, sur toutes les pages (bouton rond en bas à droite). Il reconnaît les questions posées avec ses propres mots et répond à partir du contenu du site : la FAQ (27 questions) et une cinquantaine de fiches (CSE, collèges, calendrier, candidatures, documents). Tout se passe dans le navigateur, rien n'est envoyé ; la conversation suit la navigation dans l'onglet. Pour ajouter une réponse : une entrée dans `CARDS` (question type, réponse, référence, lien, mots-clés)
- `faq-data.js` : le contenu de la FAQ, partagé par la page FAQ et l'assistant
- `night.css`, `theme.js` : mode nuit (bouton lune / soleil dans le menu, choix mémorisé, sinon réglage de l'appareil)
- `pictos.js` : les pictogrammes « carte de sécurité », communs à l'accueil, la FAQ et les documents
- `assets/` : logos Transavia et TO VOTE, polices Söhne (Buch, Halbfett)

Pour voir le site : `python3 -m http.server` à la racine, puis ouvrir http://localhost:8000.

À noter : dates, collèges, sièges et proportions femmes/hommes suivent le protocole d'accord préélectoral du 13 octobre 2026 (`assets/docs/`) ; les listes et noms de candidat·es sont fictifs. Les références juridiques sont à faire valider. La police de titre Söhne Breit Fett n'a pas été fournie ; Archivo Expanded (Google Fonts) la remplace provisoirement.
