# TO VOTE 2027

Site d'information sur les élections professionnelles (CSE) de Transavia, direction artistique **Envol** : ciel en dégradés doux, verre dépoli, titres XXL, équipage illustré.

- `index.html` : accueil (compte à rebours, équipage, Vrai/Faux, plan de vol, check-in et carte d'embarquement, hublots des listes par collège, vidéos façon écran de divertissement en vol, consignes de sécurité, contact). Pour publier une vidéo YouTube : renseigner son identifiant dans le tableau `VIDEOS` du script
- `cse.html` : Le CSE (composition, missions, moyens, qui fait quoi, lexique)
- `calendrier.html` : Calendrier en plan de vol (préparation, campagne, scrutin)
- `candidatures.html` : Candidatures par collège (PNC, PNT, Cadres, ETAM) et listes déposées
- `faq.html` : FAQ avec recherche
- `documents.html` : Documents officiels (PAP, listes, guide du vote, résultats), publiés à leur date
- `quiz.html` : Grand quiz d'auto-évaluation (18 questions sur le vote, le CSE et les candidatures), licence de vol, correction détaillée et liens vers TO Learn et la page CSE
- `crew.js` : l'équipage illustré, commun à toutes les pages (une variante femme ou homme par métier, tirée au hasard à chaque ouverture, puis qui change toute seule toutes les 6 secondes)
- `assets/vendor/pdfjs/` : PDF.js 3.11.174 (Mozilla, licence Apache 2.0), pour afficher les documents dans la visionneuse de la page Documents
- `affiche-candidatures.html` : affiche A4 de l'appel à candidatures (30 sièges, panneau des départs, plan de cabine, plan de vol), à imprimer ou enregistrer en PDF depuis le navigateur. Page hors menu, pour la communication interne
- `chat.js` : l'assistant de bord, sur toutes les pages (bouton rond en bas à droite). Il reconnaît le thème de la question par mots-clés (`CONCEPTS`), tient compte de la question précédente pour les relances (« et pour les cadres ? ») et ne répond directement que si une réponse se détache nettement ; sinon il propose les questions possibles (« Je ne suis pas sûr d'avoir bien compris… »). Il répond à partir du contenu du site : la FAQ (27 questions) et une cinquantaine de fiches. Tout se passe dans le navigateur, rien n'est envoyé. Pour ajouter une réponse : une entrée dans `CARDS` (question type, réponse, référence, lien, mots-clés) et ses thèmes dans `TAGS` (le premier est le thème principal)
- `faq-data.js` : le contenu de la FAQ, partagé par la page FAQ et l'assistant
- `menu.js` : le menu des petits écrans (moins de 1000 px) : un bouton au nom de la page en cours ouvre un panneau façon tableau d'embarquement, une « porte » par page, repris automatiquement du menu
- `night.css`, `theme.js` : mode nuit (bouton lune / soleil dans le menu, choix mémorisé, sinon réglage de l'appareil)
- `plane.js` : l'avion en papier en 3D, commun à tout le site (accueil, plan de vol, quiz, affiche, assistant). Un petit modèle 3D projeté en SVG sous l'angle voulu (`planeSVG({ yaw, pitch, roll, elev })`), avec des vues prêtes (`data-plane="route"`). Le grand avion de l'accueil pivote au fil du défilement
- `pictos.js` : les pictogrammes « carte de sécurité », communs à l'accueil, la FAQ et les documents
- `assets/` : logos Transavia et TO VOTE, polices Söhne (Buch, Halbfett)

Pour voir le site : `python3 -m http.server` à la racine, puis ouvrir http://localhost:8000.

À noter : dates, collèges, sièges et proportions femmes/hommes suivent le protocole d'accord préélectoral du 13 octobre 2026 (`assets/docs/`) ; les listes et noms de candidat·es sont fictifs. Les références juridiques sont à faire valider. La police de titre Söhne Breit Fett n'a pas été fournie ; Archivo Expanded (Google Fonts) la remplace provisoirement.
