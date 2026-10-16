# TO VOTE 2027

Site d'information sur les élections professionnelles (CSE) de Transavia, direction artistique **Envol** : ciel en dégradés doux, verre dépoli, titres XXL, équipage illustré.

## Organisation des fichiers

Site statique, sans étape de construction : chaque page HTML ne contient que son contenu, ses styles et ses scripts sont dans `assets/`.

```
*.html                     les pages (contenu seul ; menu et pied de page répétés dans chaque page)
assets/css/base.css        styles communs : polices, réinitialisation, verre dépoli, menu, pied de page
assets/css/night.css       mode nuit et bouton d'ambiance
assets/css/pages/<page>.css   styles propres à chaque page
assets/js/<module>.js      modules communs (équipage, avion, menu, assistant, checklist…)
assets/js/pages/<page>.js     script propre à chaque page
assets/docs/               documents officiels (PAP…)
assets/img/, fonts/, audio/, vendor/   logos, polices Söhne, carillon, PDF.js
outils/index-temp.py       génère la version restreinte de l'accueil
```

`assets/js/theme.js` est chargé dans l'en-tête de chaque page (et, sur l'accueil, le petit script de l'ouverture en nuages y reste en ligne) : l'ambiance doit être posée avant l'affichage pour éviter un éclair de couleur.

Pour voir le site : `python3 -m http.server` à la racine, puis ouvrir http://localhost:8000.

## Pages

- `index.html` : accueil (compte à rebours, équipage, Vrai/Faux, plan de vol, check-in et carte d'embarquement, hublots des listes par collège, vidéos façon écran de divertissement en vol, consignes de sécurité, contact). Pour publier une vidéo YouTube : renseigner son identifiant dans le tableau `VIDEOS` de `assets/js/pages/index.js`
- `cse.html` : Le CSE (composition, missions, moyens, qui fait quoi, lexique)
- `calendrier.html` : Calendrier en plan de vol (préparation, campagne, scrutin)
- `candidatures.html` : Candidatures par collège (PNC, PNT, Cadres, ETAM) et listes déposées
- `faq.html` : FAQ avec recherche
- `documents.html` : Documents officiels (PAP, listes, guide du vote, résultats), publiés à leur date
- `checklist.html` : la checklist avant vol, guidée point par point avec de petites actions (trouver son collège par son métier, identifiant reçu ou non, messages selon le calendrier…) et les procédures anormales du PAP (identifiant ou mot de passe non reçu, autre difficulté). La page est hors menu pour l'instant
- `quiz.html` : Grand quiz d'auto-évaluation (18 questions sur le vote, le CSE et les candidatures), licence de vol, correction détaillée et liens vers TO Learn et la page CSE
- `vote.html` : la page « Je vote » (boutons « Je vote » de tout le site). Pendant un tour de scrutin : « Le vote est ouvert », le site GEDIVOTE (prestataire), compte à rebours de 10 s puis redirection vers www.transavia.webvote.fr (adresse fixée par le PAP, art. 8.6.1), avec possibilité de rester sur TO VOTE. Avant : « pas encore ouvert » ; après : « vote clos ». Pour un 2nd tour, passer `actif: true` dans `TOURS` (`assets/js/pages/vote.js`). Aperçu : `vote.html?demo=avant`, `?demo=ouvert`, `?demo=clos`
- `index-temp.html` : l'accueil en version restreinte, à diffuser du 1er au 17 décembre 2026 (avant le lancement officiel) : aucune date du calendrier électoral (ni compte à rebours, plan de vol, hublots, agenda, dates de la safety card), Calendrier, Candidatures et « Je vote » verrouillés, sans l'assistant. Page générée avec `assets/js/pages/index-temp.js` et `assets/css/pages/index-temp.css` : après toute modification de l'accueil, lancer `python3 outils/index-temp.py` (le script refuse de produire la page s'il reste une date)
- `affiche-candidatures.html` : affiche A4 de l'appel à candidatures (30 sièges, panneau des départs, plan de cabine, plan de vol), à imprimer ou enregistrer en PDF depuis le navigateur. Page hors menu, pour la communication interne

## Modules communs (`assets/js/`)

- `crew.js` : l'équipage illustré (une variante femme ou homme par métier, tirée au hasard à chaque ouverture, puis qui change toute seule toutes les 6 secondes)
- `plane.js` : l'avion en papier en 3D (accueil, plan de vol, quiz, affiche, assistant). Un petit modèle 3D projeté en SVG sous l'angle voulu (`planeSVG({ yaw, pitch, roll, elev })`), avec des vues prêtes (`data-plane="route"`). Le grand avion de l'accueil pivote au fil du défilement
- `pictos.js` : les pictogrammes « carte de sécurité » (accueil, FAQ, documents)
- `menu.js` : le menu des petits écrans (moins de 1000 px) : un bouton au nom de la page en cours ouvre la liste des pages, reprise automatiquement du menu
- `theme.js` (avec `assets/css/night.css` et la fin de `base.css`) : l'ambiance du ciel suit le soleil là où se trouve l'appareil. Jour, puis aube ou crépuscule (seul le fond se réchauffe, soleil bas à l'horizon), puis nuit (mode nuit complet). La position est estimée d'après le fuseau horaire de l'appareil, ou exacte si le site a déjà l'autorisation de localisation (jamais demandée). La page ouverte se met à jour toute seule, en fondu. Bouton dans le menu : Auto → Jour → Nuit, choix mémorisé sur l'appareil (`tv_ambiance`)
- `chat.js` : l'assistant de bord, sur toutes les pages (bouton d'appel PNC en bas à droite). Il reconnaît le thème de la question par mots-clés (`CONCEPTS`), tient compte de la question précédente pour les relances (« et pour les cadres ? ») et ne répond directement que si une réponse se détache nettement ; sinon il propose les questions possibles (« Je ne suis pas sûr d'avoir bien compris… »). Il répond à partir du contenu du site : la FAQ (27 questions) et une cinquantaine de fiches. Tout se passe dans le navigateur, rien n'est envoyé. Pour ajouter une réponse : une entrée dans `CARDS` (question type, réponse, référence, lien, mots-clés) et ses thèmes dans `TAGS` (le premier est le thème principal)
- `faq-data.js` : le contenu de la FAQ, partagé par la page FAQ et l'assistant
- `checklist.js` : la checklist avant vol, à placer n'importe où avec `<div data-checklist></div>` et `<script src="assets/js/checklist.js"></script>`

## Ressources

- `assets/audio/chime-pnc.mp3` : carillon d'appel PNC (A320), extrait de 2 s du son « A320 tritone chime » (freesound_community, Pixabay), joué à l'appui sur le bouton de l'assistant
- `assets/vendor/pdfjs/` : PDF.js 3.11.174 (Mozilla, licence Apache 2.0), pour afficher les documents dans la visionneuse de la page Documents
- `assets/img/`, `assets/fonts/` : logos Transavia, TO VOTE et TO Learn, polices Söhne (Buch, Halbfett)

À noter : dates, collèges, sièges et proportions femmes/hommes suivent le protocole d'accord préélectoral du 13 octobre 2026 (`assets/docs/`) ; les listes et noms de candidat·es sont fictifs. Les références juridiques sont à faire valider. La police de titre Söhne Breit Fett n'a pas été fournie ; Archivo Expanded (Google Fonts) la remplace provisoirement.
