# TO VOTE 2027

Site d'information sur les élections professionnelles (CSE) de Transavia, direction artistique **Envol** : ciel en dégradés doux, verre dépoli, titres XXL, équipage illustré.

- `index.html` : accueil (compte à rebours, équipage, Vrai/Faux, plan de vol, check-in et carte d'embarquement, hublots des listes par collège, vidéos façon écran de divertissement en vol, consignes de sécurité, contact). Pour publier une vidéo YouTube : renseigner son identifiant dans le tableau `VIDEOS` du script
- `cse.html` : Le CSE (composition, missions, moyens, qui fait quoi, lexique)
- `calendrier.html` : Calendrier en plan de vol (préparation, campagne, scrutin)
- `candidatures.html` : Candidatures par collège (PNC, PNT, Cadres, ETAM) et listes déposées
- `faq.html` : FAQ avec recherche
- `documents.html` : Documents officiels (PAP, listes, guide du vote, résultats), publiés à leur date
- `checklist.html`, `checklist.js` : la checklist avant vol, guidée point par point avec de petites actions (trouver son collège par son métier, identifiant reçu ou non, messages selon le calendrier…) et les procédures anormales du PAP (identifiant ou mot de passe non reçu, autre difficulté). Le module se place n'importe où avec `<div data-checklist></div>` et `checklist.js` ; la page est hors menu pour l'instant
- `quiz.html` : Grand quiz d'auto-évaluation (18 questions sur le vote, le CSE et les candidatures), licence de vol, correction détaillée et liens vers TO Learn et la page CSE
- `crew.js` : l'équipage illustré, commun à toutes les pages (une variante femme ou homme par métier, tirée au hasard à chaque ouverture, puis qui change toute seule toutes les 6 secondes)
- `assets/vendor/pdfjs/` : PDF.js 3.11.174 (Mozilla, licence Apache 2.0), pour afficher les documents dans la visionneuse de la page Documents
- `vote.html` : la page « Je vote » (boutons « Je vote » de tout le site). Pendant un tour de scrutin : « Le vote est ouvert », le site GEDIVOTE (prestataire), compte à rebours de 10 s puis redirection vers www.transavia.webvote.fr (adresse fixée par le PAP, art. 8.6.1), avec possibilité de rester sur TO VOTE. Avant : « pas encore ouvert » ; après : « vote clos ». Pour un 2nd tour, passer `actif: true` dans `TOURS`. Aperçu : `vote.html?demo=avant`, `?demo=ouvert`, `?demo=clos`
- `index-temp.html` : l'accueil en version restreinte, à diffuser du 1er au 17 décembre 2026 (avant le lancement officiel) : aucune date du calendrier électoral (ni compte à rebours, plan de vol, hublots, agenda, dates de la safety card), Calendrier, Candidatures et « Je vote » verrouillés, sans l'assistant. Page générée : après toute modification de `index.html`, lancer `python3 outils/index-temp.py` (le script refuse de produire la page s'il reste une date)
- `affiche-candidatures.html` : affiche A4 de l'appel à candidatures (30 sièges, panneau des départs, plan de cabine, plan de vol), à imprimer ou enregistrer en PDF depuis le navigateur. Page hors menu, pour la communication interne
- `chat.js` : l'assistant de bord, sur toutes les pages (bouton rond en bas à droite). Il reconnaît le thème de la question par mots-clés (`CONCEPTS`), tient compte de la question précédente pour les relances (« et pour les cadres ? ») et ne répond directement que si une réponse se détache nettement ; sinon il propose les questions possibles (« Je ne suis pas sûr d'avoir bien compris… »). Il répond à partir du contenu du site : la FAQ (27 questions) et une cinquantaine de fiches. Tout se passe dans le navigateur, rien n'est envoyé. Pour ajouter une réponse : une entrée dans `CARDS` (question type, réponse, référence, lien, mots-clés) et ses thèmes dans `TAGS` (le premier est le thème principal)
- `faq-data.js` : le contenu de la FAQ, partagé par la page FAQ et l'assistant
- `menu.js` : le menu des petits écrans (moins de 1000 px) : un bouton au nom de la page en cours ouvre la liste des pages, reprise automatiquement du menu
- `night.css`, `theme.js` : mode nuit (bouton lune / soleil dans le menu, choix mémorisé, sinon réglage de l'appareil)
- `plane.js` : l'avion en papier en 3D, commun à tout le site (accueil, plan de vol, quiz, affiche, assistant). Un petit modèle 3D projeté en SVG sous l'angle voulu (`planeSVG({ yaw, pitch, roll, elev })`), avec des vues prêtes (`data-plane="route"`). Le grand avion de l'accueil pivote au fil du défilement
- `pictos.js` : les pictogrammes « carte de sécurité », communs à l'accueil, la FAQ et les documents
- `assets/audio/chime-pnc.mp3` : carillon d'appel PNC (A320), extrait de 2 s du son « A320 tritone chime » (freesound_community, Pixabay), joué à l'appui sur le bouton de l'assistant
- `assets/` : logos Transavia et TO VOTE, polices Söhne (Buch, Halbfett)

Pour voir le site : `python3 -m http.server` à la racine, puis ouvrir http://localhost:8000.

À noter : dates, collèges, sièges et proportions femmes/hommes suivent le protocole d'accord préélectoral du 13 octobre 2026 (`assets/docs/`) ; les listes et noms de candidat·es sont fictifs. Les références juridiques sont à faire valider. La police de titre Söhne Breit Fett n'a pas été fournie ; Archivo Expanded (Google Fonts) la remplace provisoirement.
