/* TO VOTE · Envol — l'assistant de bord.
   Un chat qui répond à partir du contenu du site : la FAQ (faq-data.js) et les fiches ci-dessous (CSE, calendrier,
   candidatures, documents). Il tourne entièrement dans le navigateur : rien n'est envoyé, la conversation reste
   dans l'onglet (sessionStorage) et suit la navigation d'une page à l'autre. */
(function () {
  if (window.__tvChat) return; window.__tvChat = 1;
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAIL = '<a href="mailto:to-vote@fr.transavia.com">to-vote@fr.transavia.com</a>';
  var VOTE_URL = 'https://www.transavia.webvote.fr/';

  /* ---------- Fiches (en plus de la FAQ) ----------
     q : la question type · a : réponse (HTML) ou fn : réponse calculée · r : référence · l : [lien, libellé] · k : mots-clés */
  var CARDS = [
    /* Voter */
    { id: 'quand-vote', q: 'Quand est-ce qu\'on vote ?', fn: voteWhen, r: 'PAP, annexe 1', l: ['calendrier.html#scrutin', 'Voir le calendrier'], k: 'quand vote ouverture ouvre debut commence scrutin jour date combien jours reste compte rebours premier tour periode' },
    { id: 'fin-vote', q: 'Jusqu\'à quand je peux voter ?', a: '<b>Jusqu\'au 31 mars 2027 à 16h00 précises</b> (heure de Paris). Après, le scrutin est fermé : n\'attends pas la dernière minute.', l: ['calendrier.html#scrutin', 'Voir le calendrier'], k: 'jusqu quand fin ferme fermeture cloture dernier jour limite derniere minute heure 16h tard' },
    { id: 'site-vote', q: 'Où est-ce que je vote ?', a: '<b>Sur le site de vote en ligne, depuis n\'importe quel appareil connecté.</b> Il est ouvert du 18 mars 9h00 au 31 mars 16h00. Le bouton « Je vote », en haut de chaque page, y mène directement.', l: [VOTE_URL, 'Aller sur le site de vote'], k: 'lieu voter site lien adresse url plateforme webvote bouton bureau acceder' },
    { id: 'duree', q: 'Voter, ça prend combien de temps ?', a: '<b>Environ 3 minutes.</b> Tu votes deux fois à la suite : d\'abord pour les titulaires, puis pour les suppléant·es de ton collège.', l: ['index.html#itineraire', 'Voir le plan de vol'], k: 'combien temps duree long minutes rapide prend' },
    { id: 'deux-votes', q: 'Pourquoi je vote deux fois ?', a: '<b>Parce qu\'on élit à la fois les titulaires et les suppléant·es.</b> Les titulaires siègent et votent au CSE ; les suppléant·es les remplacent en cas d\'absence. Les deux votes se font à la suite, sur le site de vote.', l: ['cse.html#lexique', 'Voir le lexique'], k: 'deux fois votes double titulaires suppleants pourquoi difference' },
    { id: 'iban', q: 'Pourquoi on me demande mon IBAN ?', a: '<b>Pour vérifier que c\'est bien toi.</b> À la connexion, tu saisis ton identifiant, puis les 5 derniers caractères de l\'IBAN que tu as communiqué à l\'entreprise. Tu reçois alors un mot de passe à usage unique sur ta messagerie pro, valable 1 heure.', r: 'PAP, art. 8.7.2.2', l: ['faq.html#comment', 'Le vote, étape par étape'], k: 'iban rib banque bancaire caracteres securite verifier authentification' },
    { id: 'mdp', q: 'Je n\'ai pas reçu mon mot de passe.', a: '<b>Il arrive sur ta messagerie pro, au moment où tu te connectes.</b> Il est valable 1 heure : passé ce délai, refais la même procédure pour en obtenir un nouveau. Pendant le vote, une assistance téléphonique répond 24h/24 ; son numéro figure sur la notice et sur le site de vote.', r: 'PAP, art. 8.7', l: ['faq.html#codes', 'Codes perdus ou pas reçus'], k: 'mot passe mdp password messagerie mail email expire recu pas arrive valable heure' },
    { id: 'adresse', q: 'J\'ai déménagé : je vais recevoir mon identifiant ?', a: '<b>Ton identifiant est envoyé par courrier à ton domicile, dès le 10 mars 2027.</b> Vérifie dès maintenant que ton adresse est à jour dans ton espace RH. Sinon, tu pourras le redemander sur le site de vote et le recevoir par SMS.', r: 'PAP, art. 8.7.2', l: ['faq.html#codes', 'Codes perdus ou pas reçus'], k: 'adresse demenage demenagement domicile courrier postal poste lettre espace rh jour' },
    { id: 'conseil', q: 'Pour quelle liste je devrais voter ?', a: '<b>Ce choix t\'appartient : ni ce site ni l\'entreprise ne peuvent te conseiller.</b> L\'employeur est tenu à une stricte neutralité. Lis les professions de foi de ton collège pour te faire ton avis.', r: 'PAP, art. 7.4.2', l: ['candidatures.html', 'Voir les listes'], k: 'quelle liste choisir meilleur meilleure syndicat recommande recommandes conseille conseil conseiller voter pour qui avis preference vaut' },

    { id: 'obligatoire', q: 'Le vote est-il obligatoire ?', a: '<b>Non, mais chaque voix compte.</b> Si moins de la moitié des inscrit·es vote au 1er tour, un 2nd tour doit être organisé. Voter, c\'est aussi choisir qui te représentera pendant 4 ans.', r: 'Art. L.2314-29 C. trav.', l: ['faq.html#second-tour-pourquoi', 'Pourquoi un 2nd tour ?'], k: 'obligatoire oblige forcer force devoir obligation participer participation' },

    { id: 'papier', q: 'Je peux voter sur papier ?', a: '<b>Non : l\'élection a lieu exclusivement par voie électronique.</b> Tu votes en ligne, depuis n\'importe quel ordinateur, tablette ou smartphone, sans rien installer.', r: 'PAP, art. 8.6.1', l: ['faq.html#comment', 'Le vote, étape par étape'], k: 'papier urne bulletin physique correspondance bureau isoloir enveloppe' },
    { id: 'connexion', q: 'Je n\'arrive pas à me connecter.', a: '<b>Vérifie les trois étapes :</b><ul><li>ton identifiant, reçu par courrier</li><li>les 5 derniers caractères de ton IBAN</li><li>le mot de passe reçu sur ta messagerie pro, valable 1 heure</li></ul>Toujours bloqué·e ? Pendant le vote, l\'assistance téléphonique répond 24h/24 ; son numéro figure sur la notice et sur le site de vote.', r: 'PAP, art. 8.7', l: ['faq.html#codes', 'Codes perdus ou pas reçus'], k: 'connecter connexion connecte bloque bloquee probleme marche fonctionne erreur bug' },
    { id: 'organisation', q: 'Qui organise les élections ?', a: '<b>L\'entreprise, selon les règles du PAP</b> négocié avec les organisations syndicales. Le vote en ligne est confié à un prestataire extérieur, et un bureau de vote composé de salarié·es électeur·rices veille au bon déroulement du scrutin.', r: 'PAP, art. 8.2 et 8.6.1', l: ['documents.html#pap', 'Lire le PAP'], k: 'organise organisation organisateur gere prestataire bureau vote deroulement' },

    { id: 'pourquoi-voter', q: 'Pourquoi voter ?', a: '<b>Parce que tu choisis qui te représentera pendant 4 ans.</b> Tes élu·es seront consulté·es sur l\'organisation du travail, porteront tes réclamations et géreront les activités sociales. Et la participation compte : si moins de la moitié des inscrit·es vote au 1er tour, un 2nd tour doit être organisé.', r: 'Art. L.2312-8 et L.2314-29 C. trav.', l: ['cse.html#missions', 'Ce que fait le CSE'], k: 'pourquoi voter utile interet importance' },

    /* Collèges */
    { id: 'colleges', q: 'Quels sont les collèges ?', a: '<b>Il y a 4 collèges :</b><ul><li>1er collège, ETAM : 2 sièges</li><li>2e collège, Cadres : 3 sièges</li><li>3e collège, PNT : 10 sièges</li><li>4e collège, PNC : 15 sièges</li></ul>Tu votes uniquement pour les listes de ton collège.', r: 'PAP du 13 octobre 2026', l: ['candidatures.html#colleges', 'Voir les collèges'], k: 'college colleges quels combien nombre quatre categorie categories groupe repartition sieges' },
    { id: 'col-pnc', q: 'Je suis PNC : quel est mon collège ?', a: '<b>Tu votes dans le 4e collège, PNC</b> (hôtesses, stewards, chef·fes de cabine) : 15 sièges titulaires et 15 suppléant·es. En cas de doute, vérifie la liste électorale publiée le 22 février.', l: ['candidatures.html#pnc', 'Voir le collège PNC'], k: 'pnc hotesse steward chef cabine navigant commercial mon college' },
    { id: 'col-pnt', q: 'Je suis PNT : quel est mon collège ?', a: '<b>Tu votes dans le 3e collège, PNT</b> (commandant·es de bord, officier·es pilotes) : 10 sièges titulaires et 10 suppléant·es. En cas de doute, vérifie la liste électorale publiée le 22 février.', l: ['candidatures.html#pnt', 'Voir le collège PNT'], k: 'pnt pilote commandant bord officier navigant technique mon college' },
    { id: 'col-cadre', q: 'Je suis cadre : quel est mon collège ?', a: '<b>Tu votes dans le 2e collège, Cadres</b> (cadres des services au sol) : 3 sièges titulaires et 3 suppléant·es. En cas de doute, vérifie la liste électorale publiée le 22 février.', l: ['candidatures.html#cadre', 'Voir le collège Cadres'], k: 'cadre cadres manager services sol mon college' },
    { id: 'col-sol', q: 'Je travaille au sol : quel est mon collège ?', a: '<b>Ça dépend de ton statut :</b><ul><li>cadre : 2e collège, Cadres (3 sièges)</li><li>agent d\'escale, technicien·ne, employé·e ou agent de maîtrise : 1er collège, ETAM (2 sièges)</li></ul>En cas de doute, vérifie la liste électorale publiée le 22 février.', l: ['candidatures.html#colleges', 'Voir les collèges'], k: 'sol travaille personnel services siege bureau mon college' },
    { id: 'col-etam', q: 'Je suis ETAM : quel est mon collège ?', a: '<b>Tu votes dans le 1er collège, ETAM</b> (agents d\'escale, technicien·nes, employé·es, agents de maîtrise) : 2 sièges titulaires et 2 suppléant·es. En cas de doute, vérifie la liste électorale publiée le 22 février.', l: ['candidatures.html#etam', 'Voir le collège ETAM'], k: 'etam agent escale technicien employe maitrise ouvrier sol mon college' },

    /* Le CSE */
    { id: 'compo', q: 'Qui siège au CSE ?', a: '<b>Autour de la table :</b><ul><li>la présidence, assurée par la direction, et ses collaborateur·rices</li><li>les élu·es titulaires, qui votent</li><li>les élu·es suppléant·es, qui remplacent les titulaires absent·es</li><li>les représentant·es syndicaux</li></ul>Chez nous : 30 titulaires et 30 suppléant·es.', r: 'PAP, art. 5', l: ['cse.html#bord', 'Voir le plan de cabine'], k: 'qui siege composition compose membres president presidence direction representant syndical plan cabine table' },
    { id: 'missions', q: 'Quelles sont les missions du CSE ?', a: '<b>Quatre grandes missions :</b><ul><li>être consulté avant les décisions importantes</li><li>porter tes réclamations individuelles et collectives</li><li>veiller à ta santé, ta sécurité et tes conditions de travail</li><li>gérer les activités sociales et culturelles</li></ul>', r: 'Art. L.2312-8 C. trav.', l: ['cse.html#missions', 'Les missions en détail'], k: 'missions mission role attributions fait quoi sert competences utilite' },
    { id: 'decide', q: 'Le CSE décide à la place de la direction ?', a: '<b>Non : consulter, ce n\'est pas décider.</b> Pour la plupart des projets, la direction doit consulter le CSE et recueillir son avis avant de décider. L\'avis ne l\'oblige pas, mais elle doit y répondre de manière motivée.', r: 'Art. L.2312-8 C. trav.', l: ['cse.html#missions', 'Voir les missions'], k: 'decide decider decision pouvoir avis consultatif consultation consulte oblige veto direction' },
    { id: 'reclam', q: 'Le CSE peut m\'aider sur ma paie ou une prime ?', a: '<b>Oui, c\'est l\'une de ses missions.</b> Les élu·es présentent à la direction les réclamations individuelles et collectives : une question sur ta paie, une prime, l\'application d\'un accord… tu peux passer par un·e élu·e.', l: ['cse.html#missions', 'Voir les missions'], k: 'reclamation reclamations paie salaire prime probleme aider accord individuelle collective elu' },
    { id: 'sante', q: 'Le CSE s\'occupe de la santé et de la sécurité ?', a: '<b>Oui.</b> Il agit pour la santé, la sécurité et les conditions de travail, avec une commission dédiée : la CSSCT. Fatigue, temps de repos, équipements, risques en escale : le CSE analyse, inspecte et propose.', l: ['cse.html#missions', 'Voir les missions'], k: 'sante securite conditions travail fatigue repos risque risques accident equipement' },
    { id: 'pour-moi', q: 'Le CSE, ça change quoi pour moi ?', a: '<b>Ça dépend de ton métier.</b> Plannings et rotations, fatigue et repos, outils de travail, activités sociales… La page CSE te montre des exemples concrets pour chaque collège.', l: ['cse.html#pour-toi', 'Voir pour mon collège'], k: 'change pour moi concret exemple exemples quotidien interet impact' },
    { id: 'moyens', q: 'Quels sont les moyens du CSE ?', a: '<b>Du temps, des budgets et des appuis :</b><ul><li>budget de fonctionnement : 0,22 % de la masse salariale brute</li><li>budget des activités sociales et culturelles, fixé par accord d\'entreprise</li><li>heures de délégation pour les élu·es</li><li>recours à des expert·es</li><li>au moins une réunion par mois</li></ul>', r: 'Art. L.2315-61 et L.2312-81 C. trav.', l: ['cse.html#moyens', 'Voir ses moyens'], k: 'moyens budget budgets argent financement fonctionnement masse salariale ressources' },
    { id: 'heures', q: 'C\'est quoi les heures de délégation ?', a: '<b>Le temps rémunéré dont disposent les élu·es pour exercer leur mandat.</b> Chaque titulaire a un crédit d\'heures par mois, payé comme du temps de travail. Son volume dépend de l\'effectif de l\'entreprise.', r: 'Art. L.2315-7 et R.2314-1 C. trav.', l: ['cse.html#moyens', 'Voir ses moyens'], k: 'heures delegation credit temps mandat elu paye remunere' },
    { id: 'reunions', q: 'Le CSE se réunit souvent ?', a: '<b>Au moins une fois par mois</b> dans les entreprises d\'au moins 300 salarié·es, comme la nôtre.', r: 'Art. L.2315-28 C. trav.', l: ['cse.html#moyens', 'Voir ses moyens'], k: 'reunion reunions reunit frequence souvent mois mensuelle' },
    { id: 'expert', q: 'Le CSE peut faire appel à des expert·es ?', a: '<b>Oui.</b> Il peut se faire assister par des expert·es, par exemple sur la situation économique de l\'entreprise ou sur un projet important.', r: 'Art. L.2315-78 C. trav.', l: ['cse.html#moyens', 'Voir ses moyens'], k: 'expert experts expertise cabinet assister economique' },
    { id: 'qfq', q: 'CSE, syndicats, direction : qui fait quoi ?', a: '<ul><li><b>Le CSE</b>, élu par les salarié·es : il donne des avis, porte les réclamations et gère les activités sociales</li><li><b>Les organisations syndicales</b> : elles négocient les accords d\'entreprise et présentent les listes au 1er tour</li><li><b>La direction</b> : elle décide, après consultation du CSE</li></ul>', l: ['cse.html#qui-fait-quoi', 'Voir le tableau'], k: 'difference syndicat syndicats direction qui fait quoi negocie negociation accords delegue syndical confondre' },

    { id: 'elu-role', q: 'Que fait un·e élu·e du CSE ?', a: '<b>Il ou elle porte ta voix auprès de la direction.</b> Les élu·es siègent aux réunions du CSE, donnent un avis sur les projets de l\'entreprise, présentent les réclamations des salarié·es, suivent la santé et la sécurité, et gèrent les activités sociales. Pour cela, les titulaires disposent d\'heures de délégation.', r: 'Art. L.2312-8 C. trav.', l: ['cse.html#missions', 'Les missions en détail'], k: 'elu elus fait role mission' },

    /* Lexique */
    { id: 'lx-titulaire', q: 'C\'est quoi un·e titulaire ?', a: '<b>Un·e élu·e qui siège au CSE et y vote.</b> Tu en élis dans ton collège.', l: ['cse.html#lexique', 'Voir le lexique'], k: 'titulaire titulaires definition' },
    { id: 'lx-suppleant', q: 'C\'est quoi un·e suppléant·e ?', a: '<b>Un·e élu·e qui remplace un·e titulaire absent·e.</b> Tu votes aussi pour les suppléant·es.', l: ['cse.html#lexique', 'Voir le lexique'], k: 'suppleant suppleants suppleante remplace remplacant definition' },
    { id: 'lx-college', q: 'C\'est quoi un collège électoral ?', a: '<b>Un groupe d\'électeur·rices selon la catégorie professionnelle.</b> Chez nous : PNC, PNT, Cadres et ETAM, selon le PAP.', l: ['cse.html#lexique', 'Voir le lexique'], k: 'college electoral definition' },
    { id: 'lx-pap', q: 'C\'est quoi le PAP ?', a: '<b>Le protocole d\'accord préélectoral.</b> Il fixe les règles de l\'élection : collèges, sièges, calendrier, vote électronique. Le nôtre a été signé le 13 octobre 2026.', r: 'Art. L.2314-5 et L.2314-6 C. trav.', l: ['documents.html#pap', 'Lire le PAP'], k: 'pap protocole accord preelectoral regles definition lieu trouver lire consulter' },
    { id: 'lx-cssct', q: 'C\'est quoi la CSSCT ?', a: '<b>La commission santé, sécurité et conditions de travail</b>, créée au sein du CSE.', l: ['cse.html#lexique', 'Voir le lexique'], k: 'cssct commission sante securite conditions definition' },
    { id: 'lx-bdese', q: 'C\'est quoi la BDESE ?', a: '<b>La base de données économiques, sociales et environnementales</b> : les informations que la direction met à disposition du CSE.', l: ['cse.html#lexique', 'Voir le lexique'], k: 'bdese bdes base donnees economiques sociales environnementales' },
    { id: 'lx-quorum', q: 'C\'est quoi le quorum ?', a: '<b>Le seuil de participation à atteindre au 1er tour</b> : au moins la moitié des inscrit·es doit voter. Sinon, ou si des sièges restent à pourvoir, un 2nd tour est organisé.', r: 'Art. L.2314-29 C. trav.', l: ['faq.html#second-tour-pourquoi', 'Pourquoi un 2nd tour ?'], k: 'quorum seuil participation moitie inscrits definition' },
    { id: 'lx-pv', q: 'C\'est quoi un PV ?', a: '<b>Le procès-verbal</b> : le document officiel qui consigne les résultats de chaque collège, signé par le bureau de vote. Il est publié le 31 mars sur la page Documents.', r: 'PAP, art. 8.8', l: ['documents.html#pv', 'Voir les documents'], k: 'pv proces verbal verbaux definition resultats officiels' },
    { id: 'lx-alerte', q: 'C\'est quoi le droit d\'alerte ?', a: '<b>La possibilité pour les élu·es d\'alerter la direction</b>, par exemple en cas de danger grave et imminent.', l: ['cse.html#lexique', 'Voir le lexique'], k: 'droit alerte alerter danger grave imminent' },

    /* Candidatures */
    { id: 'listes-cand', q: 'Où voir les listes de candidat·es ?', a: '<b>Sur la page Candidatures, dès le 5 mars 2027.</b> Toutes les listes y sont présentées au même format, par ordre alphabétique des organisations syndicales, avec leurs professions de foi.', l: ['candidatures.html', 'Voir les listes'], k: 'lieu listes candidats candidates voir qui se presente presentent noms syndicats lesquels quels affichage' },
    { id: 'nb-listes', q: 'Combien y a-t-il de listes ?', a: '<b>On le saura le 5 mars 2027</b>, date d\'affichage des listes de candidat·es. Elles seront présentées collège par collège, au même format, par ordre alphabétique des organisations syndicales.', l: ['candidatures.html', 'Voir la page Candidatures'], k: 'combien listes nombre syndicats' },
    { id: 'pdf-foi', q: 'C\'est quoi une profession de foi ?', a: '<b>Le programme d\'une liste.</b> Elle est déposée avec la liste au plus tard le 1er mars 2027 à 12h00, puis publiée le 5 mars. Pour une question sur son contenu, adresse-toi directement à la liste concernée.', l: ['candidatures.html', 'Voir les listes'], k: 'profession foi programme programmes propositions tract' },
    { id: 'delegue-liste', q: 'C\'est quoi un·e délégué·e de liste ?', a: '<b>La personne qui représente une liste pendant les opérations électorales.</b> Chaque liste la désigne au plus tard avec son dépôt, le 1er mars 2027 à 12h00.', r: 'PAP, art. 8.3.1 et annexe 1', l: ['calendrier.html#preparation', 'Voir le calendrier'], k: 'delegue liste representant operations electorales' },
    { id: 'depot', q: 'Quelle est la date limite pour déposer une liste ?', a: '<b>Le 1er mars 2027 à 12h00</b> pour le 1er tour, avec les professions de foi. En cas de 2nd tour : le 5 avril 2027 à 12h00.', r: 'PAP, annexe 1', l: ['calendrier.html#preparation', 'Voir le calendrier'], k: 'date limite depot deposer liste listes candidature delai quand candidater' },

    /* Calendrier */
    { id: 'lancement', q: 'Quand les élections sont-elles lancées ?', a: '<b>Le 21 décembre 2026</b> : tout le personnel est informé de l\'organisation des élections.', r: 'Art. L.2314-4 C. trav.', l: ['calendrier.html#preparation', 'Voir le calendrier'], k: 'lancement lance lancees officiel debut annonce information note' },
    { id: 'campagne', q: 'Quand a lieu la campagne électorale ?', a: '<b>Du 5 au 17 mars 2027.</b> Les listes sont affichées le 5 mars et présentent leurs programmes jusqu\'à la veille de l\'ouverture du vote.', l: ['calendrier.html#campagne', 'Voir la campagne'], k: 'campagne electorale propagande quand' },
    { id: 'tour2-dates', q: 'Quelles sont les dates du 2nd tour ?', a: '<b>Si un 2nd tour est nécessaire :</b><ul><li>1er avril : appel à candidatures</li><li>5 avril, 12h00 : dépôt des candidatures</li><li>7 avril : affichage des listes</li><li>9 avril 9h00 → 16 avril 16h00 : vote</li><li>16 avril : résultats</li></ul>', r: 'PAP, art. 1 et annexe 1', l: ['calendrier.html#scrutin', 'Voir le calendrier'], k: 'second tour dates date quand avril calendrier' },

    /* Documents et site */
    { id: 'docs', q: 'Où trouver les documents officiels ?', a: '<b>Sur la page Documents.</b> Le PAP y est déjà ; les autres documents (note de lancement, listes électorales, notice de vote, procès-verbaux…) y apparaissent le jour de leur publication.', l: ['documents.html', 'Voir les documents'], k: 'documents document officiels pdf telecharger lieu trouver accord vote electronique' },
    { id: 'notice', q: 'Où trouver la notice de vote ?', a: '<b>Elle t\'est envoyée par courrier avec ton identifiant, dès le 10 mars 2027.</b> Elle sera aussi en ligne sur la page Documents.', r: 'PAP, art. 8.7', l: ['documents.html#notice', 'Voir la notice'], k: 'lieu notice mode emploi guide explication' },
    { id: 'quiz', q: 'Je veux tester mes connaissances.', a: '<b>Fais le grand quiz !</b> 18 questions sur le vote, le CSE et les candidatures, environ 4 minutes, avec une explication après chaque réponse.', l: ['quiz.html', 'Lancer le quiz'], k: 'quiz test tester connaissances jeu evaluer evaluation niveau' },
    { id: 'formation', q: 'Il existe une formation sur le CSE ?', a: '<b>Oui, sur TO Learn.</b> Un module sur le CSE et les élections professionnelles, à suivre à ton rythme. Tu le retrouves à la fin du quiz.', l: ['quiz.html', 'Faire le quiz'], k: 'formation former apprendre to learn tolearn module learning cours' },
    { id: 'checkin', q: 'Est-ce que moi, je peux voter ou me présenter ?', a: '<b>Fais ton check-in sur l\'accueil :</b> trois infos, et tu sais si tu peux voter ou te présenter. Ta carte d\'embarquement t\'attend.', l: ['index.html#checkin', 'Faire mon check-in'], k: 'moi eligible check verifier droit mon cas situation carte embarquement' },
    { id: 'contact', q: 'Je veux parler à quelqu\'un de l\'équipe RH.', a: '<b>Écris à ' + MAIL + '</b>, ou pose ta question depuis la FAQ : l\'équipe RH te répond sous 48 h. Pendant le vote, une assistance téléphonique répond 24h/24.', l: ['faq.html#ask', 'Poser ma question'], k: 'contact contacter parler humain quelqu rh question perso personnel personnelle cas mail email joindre telephone assistance hotline numero conseiller' },
    { id: 'theme', q: 'Comment passer en mode nuit ?', a: 'Touche la lune 🌙 dans le menu, en haut de la page. Le soleil ☀️ te ramène au mode jour.', k: 'mode nuit sombre dark theme clair jour lune' }
  ];

  /* Mots-clés ajoutés à certaines questions de la FAQ */
  var FAQ_K = {
    'pour-qui': 'bulletin choix',
    'blanc': 'blanc nul',
    'codes': 'identifiant identifiants perdu perdus oublie',
    'dates': 'dates calendrier planning etapes',
    'publication': 'resultats quand resultat',
    'sieges': 'sieges places elus',
    'role': 'cse definition comite',
    'asc': 'definition',
    'materiel': 'telephone',
    'anonymat': 'saura saurait connaitre voir direction securise securisee securite fiable pirate piratage fraude',
    'second-tour-pourquoi': 'quorum personne participation abstention votent peu passe',
    'liste-electorale': 'lieu trouver'
  };

  /* Questions proposées à l'ouverture */
  var STARTERS = ['Comment voter en ligne ?', 'Je n\'ai pas reçu mes codes', 'Quand est-ce qu\'on vote ?', 'Mon vote est-il anonyme ?', 'Qui peut se présenter ?', 'À quoi sert le CSE ?'];

  /* ---------- Compréhension des questions ---------- */
  var STOP = {};
  ('a ai as au aux avec ce ces cet cette ca de des du elle elles en et est es etre ete eu il ils je la le les leur leurs lui ma mais me mes moi mon ne ni nos notre nous on ou par pas pour que quel quelle quels quelles sa se ses si son sur ta te tes toi ton tu un une vos votre vous y suis sont sera serai seront etait fait faire faut peux peut peuvent puis pourrais pourrait doit dois dois veux voudrais aimerais savoir sais dire dis ya il-y bien tres plus aussi deja encore tout tous toute toutes chez dans entre sans sous vers lors avoir avez ont alors donc comme cela ceci celui celle quoi stp svp please merci bonjour salut hello coucou hey bonsoir svp ok oui non est-ce estce ai-je dit exactement vraiment fais fait pars part vais va aller passe arrive arrivent possible')
    .split(' ').forEach(function (w) { STOP[w] = 1; });
  /* Familles de mots : chaque mot renvoie aussi au premier de sa famille */
  var SYN = {};
  ['codes code identifiant identifiants login acces',
   'mdp mot passe password',
   'pnt pilote pilotes commandant commandants cdb copilote opl officier officiers',
   'pnc hotesse hotesses steward stewards',
   'etam escale technicien techniciens employe employes maitrise ouvrier',
   'cadre cadres manager managers',
   'dates date calendrier planning quand',
   'anonyme anonymat secret confidentiel confidentialite trace tracer',
   'candidat candidats candidate candidater candidature candidatures presenter eligible eligibilite',
   'syndicat syndicats syndical syndicale syndicales os cfdt cgt fo unsa sud snpl snpnc unac spaf',
   'materiel telephone smartphone portable mobile ordinateur ordi tablette pc',
   'rotation arret maladie conge conges absent absence etranger',
   'parite femme femmes homme hommes egalite alternance',
   'pv proces verbal verbaux',
   'iban rib banque bancaire',
   'paie salaire prime primes remuneration',
   'second 2nd 2e 2eme deuxieme',
   'premier 1er',
   'resultats resultat gagnant gagne',
   'asc billetterie cheques activites sociales culturelles avantages',
   'procuration mandataire deleguer',
   'recu recois recevoir recoit',
   'perdu perdus perdre oublie oublier',
   'cse comite instance representants'
  ].forEach(function (line) { var w = line.split(' '); w.forEach(function (x) { SYN[x] = w[0]; }); });

  function norm(t) {
    return String(t).replace(/(^|[^a-zà-ÿ])où(?![a-zà-ÿ])/gi, '$1 lieu ') /* « où » ne doit pas devenir « ou » */
      .replace(/qu['’ ]?est[- ]ce (que|qu['’])( ?c['’]est)?/gi, ' definition ')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/[’`]/g, "'").replace(/·/g, '')
      .replace(/\b(l|d|j|qu|n|s|c|m|t)'/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  /* Tournures qui changent le sens de la question */
  var PHRASES = [
    [/ (est quoi|est ce que est|ca veut dire|veut dire|signifie|definition)( |$)/g, ' definition '],
    [/ (pour qui (voter|dois|devrais|faut)|qui choisir|quelle liste choisir|meilleure? (liste|syndicat)|est (le|la) meilleure?|vaut mieux)( |$)/g, ' conseil '],
    [/ (pas|plus) (sur|dans) (la |les )?listes?( |$)/g, ' inscrit erreur '],
    [/ combien (d |de )?(elus|elu|elues|sieges|personnes|places|membres)( |$)/g, ' nombre ']
  ];
  var END = ['ements', 'ement', 'ations', 'ation', 'ments', 'ment', 'euses', 'euse', 'eurs', 'eur', 'rices', 'rice', 'ions', 'ent', 'ees', 'ee', 'es', 'ez', 'er', 'e', 's', 'x'];
  function stem(w) {
    if (/^\d/.test(w)) return w;
    for (var i = 0; i < END.length; i++) { var e = END[i]; if (w.length - e.length >= 3 && w.slice(-e.length) === e) { w = w.slice(0, -e.length); break; } }
    return w.slice(0, 6);
  }
  /* Un mot de la question → ses formes possibles [racine, poids] (le mot lui-même, puis sa famille) */
  function terms(text) {
    var out = [], n = ' ' + norm(text) + ' ';
    PHRASES.forEach(function (p) { n = n.replace(p[0], function (m) { return m + p[1]; }); });
    n.trim().split(' ').forEach(function (w) {
      if (!w || STOP[w] || (w.length < 2 && !/\d/.test(w))) return;
      var alt = [[stem(w), 1]];
      if (SYN[w] && SYN[w] !== w) alt.push([stem(SYN[w]), .85]);
      out.push(alt);
    });
    return out;
  }
  function lev1(a, b) { /* distance d'édition ≤ 1 ? */
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, diff = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++diff > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return diff + (a.length - i) + (b.length - j) <= 1;
  }
  function sim(a, b, known) {
    if (a === b) return 1;
    var m = Math.min(a.length, b.length);
    if (m >= 4 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)) return .85;
    if (!known && m >= 5 && lev1(a, b)) return .7;
    return 0;
  }

  var KB = null, IDF = {};
  function build() {
    if (KB) return;
    KB = [];
    (window.TV_FAQ || []).forEach(function (g) {
      g.items.forEach(function (it) {
        KB.push({ id: it.id, q: it.q, a: '<b>' + it.s + '</b>' + (it.l ? ' ' + it.l : ''), r: it.r, l: ['faq.html#' + it.id, 'Voir dans la FAQ'],
          k: it.k + ' ' + (FAQ_K[it.id] || ''), s: it.s });
      });
    });
    CARDS.forEach(function (c) { KB.push(c); });
    KB.forEach(function (e) {
      var main = {}, side = {}, qs = {};
      terms(e.q).forEach(function (alt) { qs[alt[0][0]] = 1; alt.forEach(function (x) { main[x[0]] = 1; }); });
      terms(e.k).forEach(function (alt) { alt.forEach(function (x) { if (!main[x[0]]) main[x[0]] = .85; }); });
      terms(e.a || e.s || '').forEach(function (alt) { alt.forEach(function (x) { if (!main[x[0]]) side[x[0]] = 1; }); });
      e.T = main; e.S = side; e.Q = Object.keys(qs);
      Object.keys(main).concat(Object.keys(side)).forEach(function (t) { IDF[t] = (IDF[t] || 0) + 1; });
    });
    var N = KB.length;
    Object.keys(IDF).forEach(function (t) { IDF[t] = Math.log(1 + N / IDF[t]); });
  }
  function idf(t) { return IDF[t] || Math.log(1 + KB.length); }

  /* Score d'une fiche : pour chaque mot de la question, la meilleure correspondance
     (question type > mots-clés > texte de la réponse). Un mot connu du site n'est comparé qu'à l'identique ou par
     son début ; un mot inconnu (faute de frappe) peut aussi s'écarter d'une lettre. */
  function rank(text) {
    build();
    var q = terms(text);
    if (!q.length) return { q: q, list: [] };
    var flat = {};
    q.forEach(function (alt) { alt.forEach(function (x) { flat[x[0]] = 1; }); });
    var rows = KB.map(function (e) {
      var bests = q.map(function (alt) {
        var best = 0;
        alt.forEach(function (x) {
          var t = x[0], w = x[1], known = !!IDF[t];
          if (e.T[t]) best = Math.max(best, w * e.T[t] * idf(t));
          else if (e.S[t]) best = Math.max(best, w * .45 * idf(t));
          else {
            for (var k in e.T) { var s = sim(t, k, known); if (s) best = Math.max(best, w * s * e.T[k] * idf(k)); }
            for (var k2 in e.S) { var s2 = sim(t, k2, known); if (s2) best = Math.max(best, w * .45 * s2 * idf(k2)); }
          }
        });
        return best;
      });
      return { e: e, bests: bests };
    });
    /* mots utiles : ceux que le site connaît (« je pars », « je fais »… ne comptent pas) */
    var useful = q.map(function (_, i) { return rows.some(function (r) { return r.bests[i] > 0; }); });
    var nu = useful.filter(Boolean).length || 1;
    var list = rows.map(function (r) {
      var e = r.e, score = 0, hit = 0;
      r.bests.forEach(function (b) { if (b > 0) hit++; score += b; });
      /* part de la question type retrouvée dans le message : départage les fiches voisines */
      var qcov = e.Q.length ? e.Q.filter(function (t) { if (flat[t]) return true; for (var f in flat) if (sim(f, t, true)) return true; return false; }).length / e.Q.length : 0;
      var cover = hit / nu;
      return { e: e, score: score * (.55 + .45 * cover) * (1 + .35 * qcov), cover: cover };
    }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    list.n = nu;
    return { q: q, list: list };
  }

  /* Petites phrases du quotidien. « solo » : seulement si le message ne contient rien d'autre */
  var TALKW = {};
  'bonjour salut hello coucou hey bonsoir yo hi merci beaucoup super top parfait genial cool ok accord daccord nickel au revoir bye plus ciao bonne bon journee soiree bientot ca va comment vas forme la toi'
    .split(' ').forEach(function (w) { TALKW[w] = 1; });
  var TALK = [
    { re: /^(bonjour|salut|hello|coucou|hey|bonsoir|yo|hi)\b/, solo: true, a: function () { return 'Salut ! 👋 Pose-moi ta question sur le vote, le CSE ou les candidatures : je cherche la réponse pour toi.'; } },
    { re: /^(merci|super|top|parfait|genial|cool|ok|accord|daccord|nickel)\b/, solo: true, a: function () { return 'Avec plaisir ! ✈️ Autre chose avant le décollage ?'; } },
    { re: /^(au revoir|bye|a plus|ciao|bonne journee|bonne soiree|a bientot)\b/, solo: true, a: function () { return 'Bon vol ! 🛫 Et n\'oublie pas : vote du 18 au 31 mars 2027.'; } },
    { re: /^(ca va|comment ca va|comment vas tu|la forme)\b/, solo: true, a: function () { return 'Toujours en altitude de croisière, merci ! ☁️ Et toi, une question sur les élections ?'; } },
    { re: /(qui es tu|tu es qui|t es qui|es tu un robot|tu es un robot|t es un robot|\brobot\b|chatgpt|intelligence artificielle|\bia\b|\bbot\b)/, a: function () { return 'Je suis l\'<b>assistant de bord</b> de TO VOTE : un programme qui cherche la réponse dans le contenu du site (FAQ, CSE, calendrier, candidatures, documents). Je ne suis pas une personne, et je ne garde rien de ce que tu écris. Pour un cas personnel, écris à ' + MAIL + '.'; } },
    { re: /^(aide|help|aide moi|que sais tu faire|tu sais faire quoi|que peux tu faire|tu peux faire quoi|comment ca marche|comment tu marches|tu sers a quoi)$/, a: function () { return 'Pose-moi une question avec tes mots, par exemple « je suis en rotation, je peux voter ? » ou « c\'est quoi un suppléant ? ». Je te réponds avec le contenu du site et je te montre où en lire plus.'; } }
  ];
  function talk(text) {
    var n = norm(text);
    var rest = n.split(' ').filter(function (w) { return w && !STOP[w] && !TALKW[w]; }).length;
    for (var i = 0; i < TALK.length; i++) {
      var t = TALK[i];
      if (t.re.test(n) && (!t.solo || !rest)) return t.a();
    }
    return null;
  }

  /* Réponse calculée : quand vote-t-on ? */
  function voteWhen() {
    var now = Date.now(), open = Date.parse('2027-03-18T09:00:00+01:00'), close = Date.parse('2027-03-31T16:00:00+02:00');
    var days = function (ms) { var n = Math.ceil(ms / 864e5); return n + ' jour' + (n > 1 ? 's' : ''); };
    if (now < open) return '<b>Du 18 mars 2027 à 9h00 au 31 mars 2027 à 16h00</b>, en ligne, 24h/24. Le vote ouvre dans <b>' + days(open - now) + '</b> ; ton identifiant arrive par courrier dès le 10 mars.';
    if (now < close) return '<b>C\'est maintenant !</b> Le vote est ouvert jusqu\'au 31 mars 2027 à 16h00, encore ' + days(close - now) + '. <a href="' + VOTE_URL + '" target="_blank" rel="noopener">Aller voter</a>';
    return '<b>Le 1er tour s\'est tenu du 18 au 31 mars 2027.</b> Si un 2nd tour est nécessaire, il a lieu du 9 avril 9h00 au 16 avril 16h00.';
  }

  /* ---------- Interface ---------- */
  var PLANE = '<svg viewBox="0 0 64 50" aria-hidden="true"><path d="M62 20 3 3l21 22z" fill="#fff"/><path d="M62 20 24 25 6 42z" fill="#D6E5FF"/><path d="M62 20 24 25l6 22z" fill="#9DBBF7"/></svg>';
  var css = '' +
    '.tvc-fab{position:fixed;right:22px;bottom:22px;z-index:80;width:64px;height:64px;padding:0;border:0;border-radius:50%;background:#05CE78;cursor:pointer;box-shadow:0 16px 30px -10px rgba(20,13,138,.55),0 0 0 4px rgba(255,255,255,.75);transition:transform .35s cubic-bezier(.2,.9,.3,1.3),background .25s,opacity .25s;-webkit-tap-highlight-color:transparent}' +
    '.tvc-fab:hover{transform:scale(1.07) rotate(-6deg)}' +
    '.tvc-fab:focus-visible{outline:3px solid #140D8A;outline-offset:4px}' +
    '.tvc-fab img{width:100%;height:100%;border-radius:50%;display:block;transition:transform .4s,opacity .25s}' +
    '.tvc-fab .tvc-x{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transform:rotate(-90deg) scale(.6);transition:transform .4s,opacity .25s}' +
    '.tvc-fab .tvc-x svg{width:24px;height:24px}' +
    '.tvc-fab::after{content:"";position:absolute;inset:0;border-radius:50%;border:3px solid #05CE78;opacity:0;pointer-events:none}' +
    '.tvc-ping .tvc-fab::after{animation:tvc-ping 1.8s ease-out 3}' +
    '@keyframes tvc-ping{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.7);opacity:0}}' +
    '.tvc-open .tvc-fab{background:#140D8A}' +
    '.tvc-open .tvc-fab img{opacity:0;transform:rotate(90deg) scale(.6)}' +
    '.tvc-open .tvc-fab .tvc-x{opacity:1;transform:none}' +
    '.tvc-tease{position:fixed;right:98px;bottom:36px;z-index:80;max-width:min(240px,calc(100vw - 130px));padding:10px 16px;border:0;border-radius:18px 18px 6px 18px;background:#fff;color:#140D8A;font:600 .88rem/1.35 var(--f-body,Arial,sans-serif);text-align:left;cursor:pointer;box-shadow:0 14px 30px -12px rgba(20,13,138,.45);opacity:0;visibility:hidden;transform:translateX(10px) scale(.95);transform-origin:right bottom;transition:opacity .35s,transform .45s cubic-bezier(.2,.9,.3,1.3),visibility .35s}' +
    '.tvc-tease.on{opacity:1;visibility:visible;transform:none}' +
    '.tvc-open .tvc-tease{opacity:0;visibility:hidden}' +
    '.tvc-panel{position:fixed;right:22px;bottom:100px;z-index:81;width:min(392px,calc(100vw - 24px));height:min(610px,calc(100vh - 130px));display:flex;flex-direction:column;border-radius:28px;overflow:hidden;color:#140D8A;font-family:var(--f-body,Arial,sans-serif);background:rgba(255,255,255,.88);-webkit-backdrop-filter:blur(22px) saturate(1.4);backdrop-filter:blur(22px) saturate(1.4);box-shadow:0 40px 80px -30px rgba(20,13,138,.6),inset 0 0 0 1.5px rgba(255,255,255,.85);transform-origin:right bottom;transform:translateY(18px) scale(.9);opacity:0;visibility:hidden;transition:transform .45s cubic-bezier(.2,.9,.3,1.2),opacity .3s,visibility .3s}' +
    '.tvc-open .tvc-panel{transform:none;opacity:1;visibility:visible}' +
    '.tvc-head{position:relative;display:flex;align-items:center;gap:12px;padding:16px 14px 16px 18px;background:linear-gradient(120deg,#140D8A,#2E22C9 70%,#4B3BE6);color:#fff;overflow:hidden}' +
    '.tvc-head::before{content:"";position:absolute;right:-40px;top:-50px;width:170px;height:120px;border-radius:50%;background:rgba(255,255,255,.12);filter:blur(16px)}' +
    '.tvc-av{position:relative;flex:none;width:44px;height:44px}' +
    '.tvc-av img{width:100%;height:100%;border-radius:50%;display:block;box-shadow:0 0 0 3px rgba(255,255,255,.25)}' +
    '.tvc-av i{position:absolute;right:0;bottom:1px;width:11px;height:11px;border-radius:50%;background:#05CE78;box-shadow:0 0 0 2.5px #1F15A6}' +
    '.tvc-ttl{flex:1;min-width:0;position:relative}' +
    '.tvc-ttl b{display:block;font-family:var(--f-head,Arial Black,sans-serif);font-weight:900;font-stretch:115%;font-size:1.05rem;letter-spacing:.01em;line-height:1.15}' +
    '.tvc-ttl small{display:block;font-size:.76rem;opacity:.8;margin-top:2px}' +
    '.tvc-hb{position:relative;flex:none;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;display:grid;place-items:center}' +
    '.tvc-hb svg{width:17px;height:17px}' +
    '.tvc-hb:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.tvc-log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:18px 16px 10px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}' +
    '.tvc-m{max-width:88%;padding:11px 14px;border-radius:20px;font-size:.92rem;line-height:1.45;overflow-wrap:break-word;animation:tvc-in .35s cubic-bezier(.2,.9,.3,1.2) both}' +
    '@keyframes tvc-in{from{opacity:0;transform:translateY(8px) scale(.97)}}' +
    '.tvc-bot{align-self:flex-start;background:#fff;color:#140D8A;border-bottom-left-radius:6px;box-shadow:0 8px 18px -12px rgba(20,13,138,.45)}' +
    '.tvc-me{align-self:flex-end;background:#140D8A;color:#fff;border-bottom-right-radius:6px}' +
    '.tvc-m b{font-weight:700}' +
    '.tvc-m ul{margin:6px 0 2px;padding-left:18px}.tvc-m li{margin:2px 0}' +
    '.tvc-m a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
    '.tvc-m .tvc-ref{display:block;margin-top:7px;font-size:.74rem;opacity:.65}' +
    '.tvc-m .tvc-go{display:flex;width:max-content;max-width:100%;align-items:center;gap:6px;margin-top:9px;padding:.5em .95em;border-radius:999px;background:#EAF4FF;color:#140D8A;font-weight:700;font-size:.82rem;text-decoration:none}' +
    '.tvc-m .tvc-go::after{content:"→"}' +
    '.tvc-m .tvc-go[target]::after{content:"↗"}' +
    '.tvc-chips{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start;max-width:100%;animation:tvc-in .35s .1s both}' +
    '.tvc-chips small{width:100%;font-size:.74rem;font-weight:600;opacity:.6;margin:2px 0 -2px 4px}' +
    '.tvc-chip{border:1.5px solid rgba(20,13,138,.18);background:rgba(255,255,255,.7);color:#140D8A;font:600 .82rem/1.25 var(--f-body,Arial,sans-serif);padding:.55em .95em;border-radius:999px;cursor:pointer;text-align:left}' +
    '.tvc-chip:focus-visible{outline:2px solid #140D8A;outline-offset:2px}' +
    '.tvc-typing{display:flex;gap:5px;align-items:center;padding:14px 16px}' +
    '.tvc-typing i{width:7px;height:7px;border-radius:50%;background:#140D8A;opacity:.35;animation:tvc-dot 1s infinite}' +
    '.tvc-typing i:nth-child(2){animation-delay:.15s}.tvc-typing i:nth-child(3){animation-delay:.3s}' +
    '@keyframes tvc-dot{0%,60%,100%{transform:none;opacity:.35}30%{transform:translateY(-5px);opacity:.9}}' +
    '.tvc-form{display:flex;gap:8px;padding:10px 12px 6px;border-top:1px solid rgba(20,13,138,.08)}' +
    '.tvc-in{flex:1;min-width:0;border:1.5px solid rgba(20,13,138,.16);background:#fff;color:#140D8A;border-radius:999px;padding:.72em 1.1em;font:500 1rem var(--f-body,Arial,sans-serif);outline:none}' +
    '.tvc-in::placeholder{color:rgba(20,13,138,.45)}' +
    '.tvc-in:focus{border-color:#140D8A}' +
    '.tvc-send{flex:none;width:46px;height:46px;border:0;border-radius:50%;background:#140D8A;cursor:pointer;display:grid;place-items:center;transition:transform .3s cubic-bezier(.2,.9,.3,1.3)}' +
    '.tvc-send svg{width:25px;height:auto;margin-left:2px}' +
    '.tvc-send:active{transform:translateX(4px) rotate(-8deg)}' +
    '.tvc-send:focus-visible{outline:2px solid #140D8A;outline-offset:2px}' +
    '.tvc-note{margin:0;padding:0 16px 12px;font-size:.7rem;text-align:center;opacity:.6}' +
    '.tvc-note a{color:inherit}' +
    '@media (max-width:560px){.tvc-fab{right:16px;bottom:16px;width:58px;height:58px}.tvc-tease{right:84px;bottom:26px}' +
      '.tvc-panel{left:8px;right:8px;bottom:8px;width:auto;height:min(82dvh,660px);border-radius:24px}' +
      '.tvc-open .tvc-fab{opacity:0;pointer-events:none}}' +
    '[data-theme="dark"] .tvc-fab{box-shadow:0 16px 30px -10px rgba(0,0,0,.7),0 0 0 4px rgba(255,255,255,.14)}' +
    '[data-theme="dark"] .tvc-open .tvc-fab{background:#2E22C9}' +
    '[data-theme="dark"] .tvc-tease{background:#2A2177;color:#fff}' +
    '[data-theme="dark"] .tvc-panel{background:rgba(22,16,78,.92);color:#fff;box-shadow:0 40px 80px -30px rgba(0,0,0,.8),inset 0 0 0 1.5px rgba(255,255,255,.12)}' +
    '[data-theme="dark"] .tvc-bot{background:rgba(255,255,255,.1);color:#fff;box-shadow:none}' +
    '[data-theme="dark"] .tvc-me{background:#05CE78;color:#0B0830}' +
    '[data-theme="dark"] .tvc-m .tvc-go{background:rgba(255,255,255,.14);color:#fff}' +
    '[data-theme="dark"] .tvc-chip{background:transparent;color:#fff;border-color:rgba(255,255,255,.28)}' +
    '[data-theme="dark"] .tvc-typing i{background:#fff}' +
    '[data-theme="dark"] .tvc-form{border-top-color:rgba(255,255,255,.1)}' +
    '[data-theme="dark"] .tvc-in{background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.2)}' +
    '[data-theme="dark"] .tvc-in::placeholder{color:rgba(255,255,255,.5)}' +
    '[data-theme="dark"] .tvc-in:focus{border-color:#05CE78}' +
    '[data-theme="dark"] .tvc-send{background:#05CE78}' +
    '@media (prefers-reduced-motion:reduce){.tvc-fab,.tvc-panel,.tvc-tease,.tvc-m,.tvc-chips,.tvc-send{transition:none!important;animation:none!important}.tvc-log{scroll-behavior:auto}}';

  var st = d.createElement('style'); st.textContent = css; d.head.appendChild(st);
  var box = d.createElement('div'); box.className = 'tvc';
  box.innerHTML =
    '<button type="button" class="tvc-tease" tabindex="-1" aria-hidden="true">Une question sur les élections ? Demande-moi ✈️</button>' +
    '<section class="tvc-panel" id="tvcPanel" role="dialog" aria-label="Assistant de bord TO VOTE" aria-hidden="true">' +
      '<header class="tvc-head"><div class="tvc-av"><img src="assets/img/tovote-icon.png" alt=""><i></i></div>' +
        '<div class="tvc-ttl"><b>Assistant de bord</b><small>Réponses tirées du site TO VOTE</small></div>' +
        '<button type="button" class="tvc-hb tvc-reset" aria-label="Nouvelle conversation" title="Nouvelle conversation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/></svg></button>' +
        '<button type="button" class="tvc-hb tvc-close" aria-label="Fermer l\'assistant" title="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '</header>' +
      '<div class="tvc-log" role="log" aria-live="polite"></div>' +
      '<form class="tvc-form" autocomplete="off"><input class="tvc-in" type="text" maxlength="200" placeholder="Pose ta question…" aria-label="Ta question"><button class="tvc-send" type="submit" aria-label="Envoyer">' + PLANE + '</button></form>' +
      '<p class="tvc-note">Réponses automatiques · cas personnel : ' + MAIL + '</p>' +
    '</section>' +
    '<button type="button" class="tvc-fab" aria-label="Ouvrir l\'assistant TO VOTE" aria-expanded="false" aria-controls="tvcPanel"><img src="assets/img/tovote-icon.png" alt=""><span class="tvc-x"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></span></button>';
  d.body.appendChild(box);
  var $ = function (s) { return box.querySelector(s); };
  var fab = $('.tvc-fab'), panel = $('.tvc-panel'), log = $('.tvc-log'), form = $('.tvc-form'), input = $('.tvc-in'), tease = $('.tvc-tease');

  /* Mémoire de l'onglet : la conversation suit la navigation */
  var KEY = 'tv_chat', state = { open: false, log: [], ctx: null };
  try { var sv = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (sv && sv.log) state = sv; } catch (e) {}
  function save() { try { state.log = state.log.slice(-40); sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function add(kind, html, keep) {
    var el = d.createElement('div');
    el.className = kind === 'chips' ? 'tvc-chips' : 'tvc-m ' + (kind === 'me' ? 'tvc-me' : 'tvc-bot');
    el.innerHTML = html;
    log.appendChild(el);
    if (keep !== false) { state.log.push([kind, html]); save(); }
    log.scrollTop = log.scrollHeight;
    return el;
  }
  function chips(list, title) {
    if (!list.length) return;
    add('chips', (title ? '<small>' + title + '</small>' : '') + list.map(function (q) { return '<button type="button" class="tvc-chip">' + esc(q) + '</button>'; }).join(''));
  }
  function card(e) {
    var body = e.fn ? e.fn() : e.a, out = body;
    if (e.r) out += '<span class="tvc-ref">📘 ' + e.r + '</span>';
    if (e.l) {
      var ext = /^https?:/.test(e.l[0]);
      out += '<a class="tvc-go" href="' + e.l[0] + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + e.l[1] + '</a>';
    }
    return out;
  }
  function welcome() {
    add('bot', 'Salut ! 👋 Je suis l\'<b>assistant de bord</b> de TO VOTE. Pose-moi ta question sur le vote, le CSE ou les candidatures, avec tes mots.');
    chips(STARTERS, 'Les plus demandées');
  }

  var busy = false;
  function ask(text) {
    text = String(text || '').trim().slice(0, 200);
    if (!text || busy) return;
    busy = true;
    $$('.tvc-chips').forEach(function (c) { c.remove(); });
    state.log = state.log.filter(function (m) { return m[0] !== 'chips'; });
    add('me', esc(text));
    var typing = add('bot', '<span class="tvc-typing" aria-label="L\'assistant écrit"><i></i><i></i><i></i></span>', false);
    typing.style.padding = '0';
    var reply = answer(text);
    setTimeout(function () {
      typing.remove();
      add('bot', reply.html);
      if (reply.more) chips(reply.more, reply.moreTitle);
      busy = false;
    }, reduce ? 120 : 450 + Math.min(650, text.length * 6));
  }
  function $$(s) { return Array.prototype.slice.call(box.querySelectorAll(s)); }

  /* ---------- Compréhension par thèmes ----------
     Chaque thème est reconnu par des mots-clés (texte sans accents ni majuscules). Chaque réponse est rattachée à
     un thème principal (le premier de sa liste) et à des thèmes secondaires. L'assistant ne répond directement que
     si une réponse se détache nettement ; sinon il propose les questions possibles. */
  var CONCEPTS = {
    /* thèmes génériques : ils départagent mais ne suffisent jamais à répondre */
    vote: 'vot\\w*|scrutin|elections?|elire|bulletins?',
    cse: 'cse|comite|instance',
    elu: 'elus?|elue|elues|representants?|representantes?',
    liste: 'listes?',
    lieu: 'lieu',
    online: 'electronique|en ligne|internet|numerique',
    comment_gen: 'comment|demarches?|procedure|faire pour|devenir',
    definition: 'est quoi|definition|ca veut dire|veut dire|signifie|definir',

    /* voter */
    droit_vote: 'droit de vote|droit de voter|peux voter|puis voter|peut voter|pouvoir voter|ai le droit|electeurs?|electrices?|qui vote|nouveau|nouvelle|arrive dans|viens d arriver|embauche\\w*|anciennete|age|16 ans|3 mois|trois mois',
    contrat: 'cdd|cdi|alternan\\w*|apprenti\\w*|stagiaires?|stage|temps partiel|mi temps|contrat\\w*|saisonnier\\w*',
    interim: 'interim\\w*|mis a disposition|mise a disposition|prestataires? exterieur\\w*|sous traitan\\w*',
    liste_elec: 'listes? electorales?|inscrit\\w*|inscription|pas sur la liste|pas dans la liste|emargement',
    pour_qui: 'pour qui (je|on) vote|vote pour qui|vote pour quoi|pour quoi (je|on) vote|on elit qui|elire qui|qu on elit',
    choix: 'pour qui voter|pour qui dois|pour qui devrais|qui choisir|quelle liste choisir|choisir une liste|meilleure?s?|conseil\\w*|recommand\\w*|vaut mieux|preferable',
    rature: 'ratur\\w*|ray\\w*|barr\\w*|panach\\w*|melang\\w*',
    blanc: 'blanc|nul|abstention|abstenir',
    comment_voter: 'comment (je |on )?vot\\w*|comment ca marche|comment se passe|comment ca se passe|etapes? du vote|deroul\\w*|procedure de vote|fonctionne le vote|marche le vote',
    anonymat: 'anonym\\w*|secret\\w*|confidenti\\w*|trac\\w*|savoir pour qui|voir (mon|ma|pour qui|ce que)|saura|saurait|connaitre mon vote',
    securite_vote: 'fiab\\w*|securis\\w*|pirat\\w*|hack\\w*|fraud\\w*|truqu\\w*|trich\\w*',
    codes: 'codes?|identifiants?|login|acces|sms|courriers?|lettre|par la poste|pas recu|recu|recois|perdu\\w*|oubli\\w*|egare\\w*',
    mdp: 'mots? de passe|mdp|password|messagerie|valable|expir\\w*',
    connexion: 'connect\\w*|connexion|bloqu\\w*|marche pas|fonctionne pas|erreurs?|bugs?|impossible|arrive pas|plante',
    iban: 'iban|rib|bancaire|banque|5 derniers|cinq derniers|caracteres',
    adresse: 'adresse|demenag\\w*|domicile',
    materiel: 'ordinateurs?|ordi|pc|telephone|smartphone|portable|mobile|tablette|appareil|materiel|appli\\w*',
    absence: 'rotations?|en vol|en escale|conges?|vacances|maladie|arret|maternite|paternite|parental|absent\\w*|absence|etranger|deplacement|decalage horaire',
    procuration: 'procuration\\w*|a ma place|a sa place|pour (un|une|mon|ma) collegue|voter pour quelqu un|faire voter|deleguer mon vote|mandataire',
    papier: 'papier|urne|isoloir|enveloppe|physique|correspondance',
    obligatoire: 'obligatoire\\w*|oblige\\w*|forc\\w*|dois voter|obligation|sanction\\w* si',
    pourquoi_voter: 'pourquoi voter|pourquoi je (dois|devrais) voter|a quoi sert (mon|de) vot\\w*|utile de voter|sert a rien|interet de voter|importance du vote|ca change quoi de voter',
    site_vote: 'site de vote|site du vote|lien|url|webvote|lieu (je |on |est ce que je |dois je )?vot\\w*|bouton je vote',
    duree_vote: 'combien de temps|prend combien|duree du vote|minutes|rapide|long',
    deux_votes: 'deux fois|deux votes|2 votes|2 fois|double',

    /* dates */
    dates: 'quand|dates?|calendrier|jours?|periode|planning|etapes cles|delais?',
    ouverture: 'ouvr\\w*|commenc\\w*|debut\\w*|demarr\\w*',
    fin: 'ferm\\w*|fin|finit|termin\\w*|clotur\\w*|jusqu|jusqu a quand|derniere minute|dernier jour|trop tard|heure limite|combien de temps (j ai|reste|il reste)',
    lancement: 'lancement|lance\\w*|annonce\\w*|top depart',
    campagne: 'campagne\\w*|propagande',
    resultats: 'resultats?|gagn\\w*|vainqueurs?|proclam\\w*|scores?|qui est elu',
    contester: 'contest\\w*|recours|tribunal|annul\\w*|irregul\\w*|litige',
    second_tour: 'second tour|2nd tour|2e tour|2eme tour|deuxieme tour|2nd|second',
    premier_tour: 'premier tour|1er tour',
    pourquoi: 'pourquoi|raisons?|dans quel cas|si personne|pas assez',
    quorum: 'quorum|participation|moitie des inscrits|taux',

    /* candidater */
    candidater: 'candidat\\w*|presenter|presente|eligib\\w*|devenir elu\\w*|etre elu\\w*|me lancer|postuler|m engager',
    conditions: 'conditions?|qui peut|criteres?|age|anciennete|18 ans|faut il',
    syndicat: 'syndica\\w*|organisations? syndicales?|cfdt|cgt|fo|unsa|sud|snpl|snpnc|unac|cfe|spaf',
    parite: 'parit\\w*|femmes?|hommes?|egalite|alternance|proportion',
    protection: 'proteg\\w*|protection|licenci\\w*|represailles|discrimin\\w*|virer|vire',
    listes_cand: 'affichage|affichage des listes|listes? (de |des )?candidat\\w*|qui se present\\w*|qui sont les candidat\\w*|voir les listes|noms des candidats|quelles listes|listes en lice',
    nb_listes: 'combien de listes|nombre de listes|combien de syndicats|combien d organisations',
    profession_foi: 'professions? de foi|programmes?|tracts?|propositions',
    delegue_liste: 'delegue\\w* de liste',
    depot: 'depos\\w*|depot|date limite',

    /* le CSE */
    role: 'a quoi sert|sert a quoi|role|utilite|utile|fait quoi|que fait|ca sert',
    missions: 'missions?|attributions?|competences?',
    mandat: 'mandat\\w*|duree du mandat|4 ans|quatre ans|elus? pour combien|combien de temps (dure|durent|sont)',
    sieges: 'sieges?|combien d elus?|nombre d elus?|combien de places|combien de personnes|combien de membres',
    asc: 'asc|activites sociales|billetterie|cheques? vacances|cheques?|sport|loisirs?|avantages?|reductions?|voyages?|cadeaux?|noel',
    colleges: 'colleges?|categories?|mon college|quel college',
    pnc: 'pnc|hotesses?|stewards?|chef\\w* de cabine|navigants? commerciaux|navigant commercial',
    pnt: 'pnt|pilotes?|commandants?|cdb|copilotes?|opl|officiers?|navigants? techniques?',
    cadre: 'cadres?',
    etam: 'etam|agents? d escale|agent escale|techniciens?|technicienne|employes?|employee|maitrise|ouvriers?',
    sol: 'au sol|sol|siege social',
    compo: 'qui siege|composition|compose\\w*|membres?|president\\w*|presidence|qui fait partie|autour de la table',
    hierarchie: 'employeur|entreprise|direction|manager\\w*|chef|cheffe|hierarchi\\w*|patron|superieur\\w*',
    neutralite: 'neutr\\w*|impartial\\w*|influenc\\w*|pression\\w*',
    decide: 'decid\\w*|decision\\w*|pouvoir|veto|avis|consult\\w*',
    reclam: 'reclamations?|paie|salaires?|primes?|remuneration|aider|defendre|probleme avec',
    sante: 'sante|securite|conditions de travail|fatigue|repos|risques?|accidents?|dangers?|stress|harcelement',
    cssct: 'cssct',
    pour_moi: 'pour moi|change quoi|concret\\w*|quotidien|me concerne|interet pour moi',
    moyens: 'moyens?|budgets?|argent|financ\\w*|masse salariale|ressources',
    heures: 'heures de delegation|delegation|credit d heures|elus? (sont )?payes?|remunere\\w*|temps pour (leur|le) mandat',
    reunions: 'reunions?|reunit|frequence|souvent|par mois',
    expert: 'experts?|expertes?|expertises?|cabinet',
    qfq: 'difference|differences|confond\\w*|qui fait quoi|versus|vs',
    titulaire: 'titulaires?',
    suppleant: 'suppleant\\w*',
    pap: 'pap|protocole\\w*|preelectoral',
    pv: 'pv|proces verbal|proces verbaux',
    bdese: 'bdese|bdes|base de donnees',
    alerte: 'alerte\\w*|danger grave',
    organisation: 'organis\\w*|gedivote|bureau de vote|qui gere',

    /* site */
    documents: 'documents?|pdf|telecharg\\w*|fichiers?',
    notice: 'notice|mode d emploi|guide|tuto\\w*',
    quiz: 'quiz|test\\w*|jeu|evaluer|connaissances',
    formation: 'formations?|former|apprendre|to learn|tolearn|module|cours|e learning',
    checkin: 'check in|checkin|carte d embarquement|mon cas|ma situation',
    contact: 'contact\\w*|humain|quelqu un|rh|ressources humaines|mail|email|joindre|parler a|numero|hotline|assistance|perso|personnelle',
    theme: 'mode nuit|mode sombre|dark|theme|mode jour'
  };
  var GENERIC = { vote: 1, cse: 1, elu: 1, liste: 1, lieu: 1, online: 1, comment_gen: 1, definition: 1 };
  var CRE = {};
  Object.keys(CONCEPTS).forEach(function (k) { CRE[k] = new RegExp('(?:^| )(?:' + CONCEPTS[k] + ')(?= |$)'); });
  function concepts(text) {
    var n = ' ' + norm(text) + ' ', out = {};
    Object.keys(CRE).forEach(function (k) { if (CRE[k].test(n)) out[k] = 1; });
    return out;
  }

  /* Thèmes de chaque réponse : le premier est le thème principal (« a|b » : l'un ou l'autre) */
  var TAGS = {
    /* FAQ */
    'qui-vote': 'droit_vote conditions vote', 'cdd': 'contrat droit_vote', 'interim': 'interim droit_vote',
    'liste-electorale': 'liste_elec liste', 'pour-qui': 'pour_qui titulaire suppleant vote', 'ratures': 'rature liste',
    'blanc': 'blanc vote', 'comment': 'comment_voter vote online', 'rotation': 'absence droit_vote vote',
    'anonymat': 'anonymat|securite_vote hierarchie vote online', 'codes': 'codes', 'procuration': 'procuration droit_vote vote',
    'materiel': 'materiel vote online', 'qui-candidat': 'candidater conditions', 'premier-tour': 'candidater syndicat premier_tour comment_gen liste',
    'second-tour': 'second_tour candidater', 'parite': 'parite liste candidater', 'protection': 'protection candidater',
    'role': 'cse role definition', 'mandat': 'mandat elu duree_vote', 'sieges': 'sieges elu cse', 'asc': 'asc cse definition',
    'dates': 'dates', 'second-tour-pourquoi': 'second_tour pourquoi quorum', 'publication': 'resultats dates',
    'contester': 'contester', 'neutralite': 'neutralite choix hierarchie',
    /* fiches */
    'quand-vote': 'vote+dates|ouverture vote dates online', 'fin-vote': 'fin vote dates duree_vote', 'site-vote': 'site_vote vote lieu online',
    'duree': 'duree_vote vote', 'deux-votes': 'deux_votes titulaire suppleant vote', 'iban': 'iban codes',
    'mdp': 'mdp codes connexion', 'adresse': 'adresse codes', 'conseil': 'choix liste vote', 'obligatoire': 'obligatoire vote',
    'papier': 'papier vote', 'connexion': 'connexion codes online', 'organisation': 'organisation vote',
    'colleges': 'colleges', 'col-pnc': 'pnc colleges', 'col-pnt': 'pnt colleges', 'col-cadre': 'cadre colleges',
    'col-sol': 'sol colleges', 'col-etam': 'etam colleges', 'compo': 'compo cse', 'missions': 'missions cse role',
    'decide': 'decide cse hierarchie', 'reclam': 'reclam cse elu', 'sante': 'sante cssct cse', 'pour-moi': 'pour_moi cse',
    'moyens': 'moyens cse', 'heures': 'heures elu', 'reunions': 'reunions cse', 'expert': 'expert cse',
    'qfq': 'qfq syndicat cse hierarchie', 'lx-titulaire': 'titulaire definition elu', 'lx-suppleant': 'suppleant definition elu',
    'lx-college': 'definition+colleges colleges', 'lx-pap': 'pap definition documents', 'lx-quorum': 'quorum definition',
    'lx-pv': 'pv resultats definition documents', 'lx-cssct': 'cssct sante definition', 'lx-bdese': 'bdese definition',
    'lx-alerte': 'alerte definition', 'listes-cand': 'listes_cand candidater liste', 'pdf-foi': 'profession_foi liste',
    'delegue-liste': 'delegue_liste liste', 'depot': 'depot candidater dates liste', 'lancement': 'lancement dates',
    'campagne': 'campagne dates', 'tour2-dates': 'second_tour dates', 'docs': 'documents', 'notice': 'notice documents vote',
    'quiz': 'quiz', 'formation': 'formation cse', 'checkin': 'checkin droit_vote candidater', 'contact': 'contact',
    'theme': 'theme', 'elu-role': 'elu role missions', 'pourquoi-voter': 'pourquoi_voter vote', 'nb-listes': 'nb_listes liste syndicat'
  };

  var TOPICS = ['Comment voter en ligne ?', 'Qui peut voter ?', 'Qui peut se présenter ?', 'À quoi sert le CSE ?', 'Quelles sont les dates clés ?'];
  /* intitulés des propositions quand la question de la FAQ ne se comprend pas seule */
  var CHIP = { 'second-tour': 'Comment se présenter au 2nd tour ?', 'codes': 'Je n\'ai pas reçu mes codes', 'dates': 'Quelles sont les dates clés ?' };
  function label(e) { return CHIP[e.id] || e.q; }
  function byQ(q) { build(); var n = norm(q); for (var i = 0; i < KB.length; i++) if (norm(KB[i].q) === n || norm(label(KB[i])) === n) return KB[i]; return null; }

  /* Classement par thèmes, avec le contexte de la réponse précédente pour les relances (« et pour les cadres ? ») */
  function intents(text) {
    build();
    var C = concepts(text), strong = Object.keys(C).filter(function (k) { return !GENERIC[k]; });
    var ctx = {}, prev = state.ctx && KB.filter(function (e) { return e.id === state.ctx; })[0];
    var follow = prev && (/^\s*(et|aussi|mais|sinon|du coup|ok et|d accord et)\b/.test(norm(text)) || strong.length <= 1 && norm(text).split(' ').length <= 5);
    if (follow) (TAGS[prev.id] || '').split(' ').forEach(function (t) { t.split('|').forEach(function (x) { if (!C[x]) ctx[x] = 1; }); });
    var tok = {}; rank(text).list.forEach(function (x) { tok[x.e.id] = x.score; });
    var list = KB.map(function (e) {
      var tags = (TAGS[e.id] || '').split(' ').filter(Boolean);
      if (!tags.length) return null;
      /* thème principal : « a|b » l'un ou l'autre, « a+b » les deux ensemble */
      var prim = tags[0].split('|'), own = {};
      var primHit = prim.some(function (p) { return p.split('+').every(function (x) { return C[x]; }); });
      prim.forEach(function (p) { p.split('+').forEach(function (x) { own[x] = 1; }); });
      var score = primHit ? 3 : 0, other = 0;
      tags.slice(1).forEach(function (t) { own[t] = 1; if (C[t]) { score += GENERIC[t] ? .6 : 1.5; if (!GENERIC[t]) other++; } else if (ctx[t]) score += .7; });
      strong.forEach(function (k) { if (!own[k]) score -= .8; }); /* le message parle d'autre chose */
      /* relance : le sujet principal peut venir de la question précédente (« et les dates ? » après le 2nd tour) */
      if (!primHit && other && follow && prim.some(function (p) { return p.split('+').every(function (x) { return C[x] || ctx[x]; }); })) { score += 2.5; primHit = true; }
      if (!primHit && !other) return null;
      return { e: e, score: score + Math.min(.5, (tok[e.id] || 0) * .04), prim: primHit };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });
    return { list: list, strong: strong, follow: !!follow };
  }

  function answer(text) {
    var small = talk(text);
    if (small) return { html: small };
    if (norm(text) === norm(NONE_Q)) return { html: 'D\'accord ! Reformule ta question avec d\'autres mots, ou pose-la directement à l\'équipe RH : ' + MAIL + '.<a class="tvc-go" href="faq.html#ask">Poser ma question aux RH</a>', more: TOPICS, moreTitle: 'Ou choisis un thème' };
    var exact = byQ(text);
    if (exact) { state.ctx = exact.id; return { html: card(exact), more: related(exact), moreTitle: 'Tu cherchais peut-être' }; }
    var r = intents(text), L = r.list, top = L[0], second = L[1];
    var gap = top ? top.score - (second ? second.score : 0) : 0;
    if (top && top.prim && top.score >= 2.2 && gap >= (r.follow ? .5 : 1.4)) {
      state.ctx = top.e.id;
      var more = L.slice(1, 4).filter(function (x) { return x.prim && x.score >= 2; }).slice(0, 2).map(function (x) { return label(x.e); });
      return { html: card(top.e), more: more, moreTitle: 'Tu cherchais peut-être' };
    }
    var props = L.filter(function (x) { return x.score >= 1.4; }).slice(0, 4).map(function (x) { return label(x.e); });
    if (!props.length) { /* aucun thème reconnu : on regarde quand même les mots du message */
      var t = rank(text).list, n = t.n || 1;
      props = t.filter(function (x) { return x.score >= 2.6 && x.cover >= (n > 1 ? .5 : 1); }).slice(0, 3).map(function (x) { return label(x.e); });
    }
    if (props.length) return {
      html: 'Je ne suis pas sûr d\'avoir bien compris ta question. 🤔 Est-ce que cela concerne l\'une de celles-ci ?',
      more: props.concat(NONE_Q), moreTitle: 'Choisis une question'
    };
    return {
      html: 'Je n\'ai pas compris ta question. 😕 Essaie avec d\'autres mots, ou choisis un thème ci-dessous. Tu peux aussi écrire à l\'équipe RH : ' + MAIL + '.',
      more: TOPICS, moreTitle: 'Les thèmes'
    };
  }
  var NONE_Q = 'Aucune de ces questions';
  function related(e) {
    var r = intents(e.q).list.filter(function (x) { return x.e !== e && x.prim && x.score >= 2; });
    return r.slice(0, 2).map(function (x) { return label(x.e); });
  }

  /* Ouvrir / fermer */
  function setOpen(on, focus) {
    box.classList.toggle('tvc-open', on);
    fab.setAttribute('aria-expanded', on); fab.setAttribute('aria-label', on ? 'Fermer l\'assistant' : 'Ouvrir l\'assistant TO VOTE');
    panel.setAttribute('aria-hidden', !on);
    state.open = on; save();
    if (on) { hideTease(); if (!log.children.length) welcome(); log.scrollTop = log.scrollHeight; if (focus !== false && matchMedia('(pointer:fine)').matches) setTimeout(function () { input.focus(); }, 60); }
  }
  fab.onclick = function () { var on = !box.classList.contains('tvc-open'); setOpen(on); if (!on) fab.focus(); };
  $('.tvc-close').onclick = function () { setOpen(false); fab.focus(); };
  $('.tvc-reset').onclick = function () { log.innerHTML = ''; state.log = []; state.ctx = null; save(); welcome(); input.focus(); };
  form.onsubmit = function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); };
  log.addEventListener('click', function (e) {
    var c = e.target.closest('.tvc-chip'); if (c) { ask(c.textContent); return; }
    /* lien vers la page courante sur mobile : on referme pour laisser voir la page */
    var a = e.target.closest('a[href]');
    if (a && !a.target && innerWidth <= 560) { state.open = false; save(); box.classList.remove('tvc-open'); }
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('tvc-open')) { setOpen(false); fab.focus(); } });

  /* Restaure la conversation de l'onglet */
  state.log.forEach(function (m) { add(m[0], m[1], false); });
  if (state.open) { panel.style.transition = 'none'; setOpen(true, false); panel.offsetWidth; panel.style.transition = ''; }

  /* Petite bulle d'invitation, une fois par session, quand rien d'autre n'occupe l'écran */
  var teaseT;
  function hideTease() { clearTimeout(teaseT); tease.classList.remove('on'); }
  tease.onclick = function () { setOpen(true); };
  function seen() { try { return sessionStorage.getItem('tv_chat_hi'); } catch (e) { return 1; } }
  function tryTease(n) {
    if (state.open || seen() || n > 20) return;
    var intro = d.getElementById('cintro');
    if (intro && intro.offsetParent !== null && getComputedStyle(intro).display !== 'none' && getComputedStyle(intro).visibility !== 'hidden') { setTimeout(function () { tryTease(n + 1); }, 1500); return; }
    try { sessionStorage.setItem('tv_chat_hi', '1'); } catch (e) {}
    box.classList.add('tvc-ping'); tease.classList.add('on');
    teaseT = setTimeout(hideTease, 7000);
  }
  setTimeout(function () { tryTease(0); }, 3500);

  /* La FAQ n'est chargée que sur sa page : on la récupère ailleurs, sans bloquer l'affichage */
  if (!window.TV_FAQ) { var s = d.createElement('script'); s.src = 'faq-data.js'; s.onload = function () { KB = null; }; d.head.appendChild(s); }

  /* Pour les tests */
  window.tvChat = { ask: ask, intents: function (t) { return intents(t).list.slice(0, 4).map(function (x) { return [x.e.id, +x.score.toFixed(2)]; }); }, state: state, rank: function (t) { return rank(t).list.slice(0, 3).map(function (x) { return [x.e.id, +x.score.toFixed(2), +x.cover.toFixed(2)]; }); }, answer: answer };
})();
