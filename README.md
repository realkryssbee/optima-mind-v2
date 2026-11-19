# O’MIND — démo interactive

Prototype cliquable de l’application de préparation mentale d’Optima Mind, pensé d’abord pour le
téléphone. Le profil 4C reste le socle ; le sportif est désormais acteur de son accompagnement
avec **Mon carnet**, ses **routines**, ses **activités** et ses **documents**. Aga dispose d’un
espace de travail multi-sportifs avec sélecteur de fiche, collectifs et partages.

- **Démo en ligne** : <https://dev.kryssbee.com/omind/>
- **En local** : <http://localhost:3000/>
- **Réseau local** : l’URL est affichée au démarrage (`http://<IP-du-PC>:3000/`)

## Comptes de démonstration

| Compte | Profil fictif | Sport |
| --- | --- | --- |
| **Chris** | Chris Bee, 16 ans | Football · U16 |
| **Elise** | Elise Blst, 16 ans | Hockey · U16 |
| **Coco** | Coco Ela, 16 ans | Tennis · U16 |
| **Aga** | Agnieszka « Aga » Orchowska | Espace coach |

Le sélecteur de compte est visible sur l’accueil et dans la barre « Démo ». Chaque onglet du
navigateur peut être connecté à un compte différent ; l’état de démonstration est partagé sur
l’appareil.

## Lancer

Prérequis : Node.js 20 ou plus. Aucune dépendance à installer.

```bash
npm start
# ou
node server.mjs
```

## Scénario de validation

1. **Chris** ouvre **Mon carnet** depuis Aujourd’hui, formule son objectif, ajoute une séance
   (ou importe un GPX / synchronise Strava en mode démo), puis ajoute son ressenti.
2. **Aga** crée le collectif **« Préparation compétition »**, y ajoute Chris, Elise et Coco,
   puis leur assigne une routine avec une consigne. Le sélecteur de fiche permet de passer de
   Chris à Elise puis Coco en restant dans l’onglet **Routines**.
3. Aga dépose un PDF dans chaque fiche. Elle partage celui de **Chris** et de **Coco**, garde
   celui d’**Elise** en brouillon privé. Chaque dépôt est nommé, daté et rattaché au bon
   sportif.
4. Chris ouvre son PDF, essaie la routine et partage son retour avec Aga. Elise voit sa routine
   et son carnet ; elle ne voit pas le document privé. Coco ouvre son propre PDF. Chaque
   sportif ne voit que les documents partagés avec lui.
5. Après rechargement, les profils, carnets, routines, activités, retours et documents restent
   associés au bon compte. Deux onglets connectés à deux sportifs différents montrent deux
   espaces distincts.

## Ce qui est fonctionnel

### Mon carnet (sportif)

- Première ouverture : invitation à formuler un **objectif dans ses propres mots**, avec des
  exemples. Objectif modifiable.
- Entrées de quatre types : **Séance, Compétition, Ressenti, Ce qui m’a aidé**.
- Brouillon **enregistré automatiquement**, repris depuis le carnet, entrée modifiable et
  supprimable.
- **Question contextuelle** proposée après une séance, liée à l’objectif ou à la routine
  essayée ; réponse courte et facultative (200 caractères). Si elle n’est pas remplie, un rappel
  apparaît dans le carnet et sur Aujourd’hui.
- **Privé / partagé** : chaque entrée est privée par défaut ; le sportif choisit de la partager
  avec Aga, et peut revenir en arrière à tout moment.
- **Mes appuis** : rapproche l’objectif, les routines essayées, les notes « ce qui m’a aidé » et
  les réponses. Aucune interprétation automatique, uniquement ce que le sportif a écrit.
- Activités et routines accessibles depuis le carnet et depuis Aujourd’hui.

### Routines utilisables à deux

- Le sportif crée sa **routine courte** (jusqu’à 3 étapes), l’associe à l’entraînement ou à la
  compétition.
- Aga assigne une routine de sa **bibliothèque** avec une **consigne personnalisée**, à un
  sportif ou à un collectif.
- **Origine affichée** : « Créée par toi » ou « Aga · [collectif / suivi individuel] ».
- « Je l’ai essayée » puis **Ça m’a aidé / Un peu / Pas cette fois**, commentaire facultatif.
  Le retour est **privé par défaut** ; Aga voit que la routine a été essayée, le contenu
  seulement si le sportif le partage.
- La routine du moment est accessible depuis **Aujourd’hui**, sans repasser par le carnet.

### Activités et connexion

- **Ajouter une activité à la main** : activité, date, durée, distance, commentaire, partage.
  Ce chemin fonctionne toujours.
- **Importer un fichier GPX** réellement : analyse locale du fichier (activité, date, durée,
  distance), sélection des données à importer, commentaire, partage.
- **Connecter un appareil** : parcours **Strava en mode démo** clairement identifié
  (connexion, dernière synchronisation, sélection des données, synchronisation, échec simulé,
  déconnexion, reconnexion). Les doublons sont détectés par identifiant d’activité. Une
  déconnexion ne supprime pas les activités déjà importées.
- Une activité importée reste dans le carnet et **privée jusqu’à partage**.
- Aucun état mental n’est déduit des mesures d’un appareil ; seuls l’activité, la durée, la date,
  la distance et le commentaire du sportif sont affichés.

### Espace Aga

- **Changer de sportif** depuis toutes les fiches : recherche par nom, profils récents, filtre
  par collectif. Le changement **conserve l’onglet en cours**.
- Sur ordinateur : liste à gauche, fiche à droite. Sur mobile : même sélecteur dans un panneau
  de recherche.
- Si la **note de suivi** est modifiée, un dialogue propose d’enregistrer, continuer sans
  enregistrer, ou revenir.
- Le nom du sportif figure dans le titre et dans les confirmations de partage.
- **Collectifs** : deux types visibles, **Équipe** (collectif qui joue ensemble) et **Groupe**
  (atelier ou objectif de travail). Un sportif peut appartenir à plusieurs collectifs.
  Création, modification des membres, assignation d’une routine à tout le collectif ou à
  certains membres.
- Avant validation d’une assignation, le **nombre et la liste des destinataires** sont affichés.
  Chaque sportif reçoit sa propre assignation et répond en privé.
- La vue collective montre **qui a essayé**, les **retours partagés** et permet d’ouvrir la fiche
  individuelle. Les retours privés restent signalés comme tels.
- **Documents PDF** : dépôt par glisser-déposer ou bouton clavier/mobile, aperçu, nom, date,
  vérification du sportif rattaché, **privé par défaut**, partage explicite « Partager avec
  [prénom] », versions et historique. Le sportif retrouve le PDF partagé dans **Mon profil →
  Rédigé par Aga**, peut l’ouvrir et le télécharger.
- Le **profil 4C**, les bilans, le questionnaire et les ressources partagées restent disponibles.

### Profil 4C

Les 20 affirmations du référentiel, mélangées à chaque passation, calcul déterministe avec
`6 − réponse` pour l’affirmation inversée, quatre scores sur 5, piste construite à partir des
réponses, détail par dimension. Le calcul est inchangé depuis la première version de la démo.

## Confidentialité et sessions

- Le compte sportif actif est stocké dans `sessionStorage` : **chaque onglet peut être un
  sportif différent**. Les données de démonstration sont dans `localStorage`, les PDF dans
  `IndexedDB` du navigateur.
- Les entrées, activités et retours de routine sont **privés par défaut**. La vue coach filtre
  strictement sur ce que le sportif a partagé.
- **Limite importante sur les PDF** : dans cette démo statique, le contrôle d’accès est appliqué
  côté interface et par la fonction `canOpen` du module documents. **Ce n’est pas une garantie
  serveur.** Avant tout usage réel, les fichiers doivent être servis par une API authentifiée
  qui vérifie à chaque requête l’identité et le partage, y compris lorsqu’un lien direct est
  utilisé (réponse 401/403), avec stockage privé et URLs non devinables. La démo publique ne
  contient pas cette API.

## Source connectée

L’intégration choisie pour la suite est **Strava via OAuth web**, compatible avec une
application web, avec un échange de token côté serveur. La démo simule le parcours et documente
les étapes dans l’écran « Connecter un appareil ». L’import **GPX** est, lui, réellement
utilisable sans partenaire.

Pour brancher Strava réellement : créer une application API Strava, configurer l’URL de
redirection, échanger le code OAuth côté serveur, stocker le refresh token par sportif, importer
les activités avec le scope `activity:read_all`, dédupliquer par identifiant Strava et prévoir
les erreurs de token/rate limit. Aucune donnée de mesure ne doit être transformée en état mental.

## Intégration au site

L’adresse de l’application est configurable dans `app/config.js` (`appBaseUrl`, `siteUrl`,
`contactEmail`, `bookingUrl`). Le futur bouton « Découvrir mon profil 4C » d’optima-mind.com
pourra pointer vers :

```text
https://dev.kryssbee.com/omind/?start=quiz
```

`?start=quiz` ouvre le questionnaire ; `?role=coach` ouvre l’espace Aga ; `?reset=1`
réinitialise la démo.

## Déploiement sur le NAS (SSH)

Le dossier `app/` est statique. Il est publié sur le NAS Synology dans
`/volume1/web/omind` et servi sur <https://dev.kryssbee.com/omind/>.

```powershell
tar -czf "$env:TEMP\omind-demo.tar.gz" -C app .
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nas" kryss@192.168.0.118 "cd /volume1/web/omind && find . -mindepth 1 -maxdepth 1 -exec rm -rf {} +"
scp -i "$env:USERPROFILE\.ssh\id_rsa_nas" "$env:TEMP\omind-demo.tar.gz" kryss@192.168.0.118:/web/omind/
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nas" kryss@192.168.0.118 "cd /volume1/web/omind && tar -xzf omind-demo.tar.gz && rm omind-demo.tar.gz"
```

Le chemin SFTP est `/web/omind` (racine SFTP), le chemin shell est `/volume1/web/omind`.

## Vérifications effectuées

- Création d’objectif, séance manuelle, ressenti, brouillon repris, entrée corrigée.
- Test 4C complet, retour arrière avec réponse conservée, quatre scores.
- Import GPX analysé et ajouté ; activité manuelle ; Strava démo : connexion, synchronisation,
  échec, déconnexion, doublons.
- Création de routine, « Je l’ai essayée », retour partagé ou privé, retour visible côté Aga
  uniquement s’il est partagé.
- Collectif « Préparation compétition » créé avec Chris, Elise et Coco, routine assignée aux
  trois, changement de fiche en conservant l’onglet Routines, garde-fou de note non enregistrée.
- Trois PDF déposés/nommés ; partage de Chris et Coco, brouillon d’Elise ; Chris et Coco voient
  leur document, Elise aucun ; version 2 déposée sans remplacer la version partagée.
- Rechargement et comptes séparés : données associées au bon sportif.
- 360 px, 390 px et ordinateur : aucun débordement horizontal.
- Navigation clavier, focus des panneaux, fermeture Échap, mouvement réduit.
- Audit axe-core WCAG 2.1/2.2 AA : **0 violation** sur les écrans et feuilles testés.

## Structure

```text
app/
├── index.html
├── config.js
├── assets/                 # polices, photos, symbole officiel
├── styles/                 # tokens.css + app.css
└── js/
    ├── data.js             # 4C, routines, sportifs fictifs, sources
    ├── scoring.js          # mélange, recodage, scores, lecture
    ├── store.js            # état multi-sportifs, carnet, routines, collectifs
    ├── documents.js        # PDF, versions, IndexedDB, contrôle d’accès local
    ├── app.js              # routeur, interactions, feuilles
    ├── ui/                 # composants, switcher, aperçus, feuilles
    └── views/              # accueil, test, résultat, carnet, routines,
                            # activités, profil, ressources, coach, collectifs,
                            # documents
server.mjs                  # serveur statique local (port 3000)
```

## Ce qui reste à brancher

- Authentification réelle et API de documents avec contrôle d’accès serveur (voir limite PDF).
- OAuth Strava réel (client ID/secret, backend, webhooks/rate limits) et éventuellement HealthKit /
  Google Fit via une app native.
- Emails, notifications et consentement marketing (aucun email demandé dans la démo).
- Validation du questionnaire 4C et de ses interprétations par Aga / psychométrie.
- Validation de la palette bleu nuit/cobalt/glacier et du logotype définitif O’MIND ; le seul
  fichier officiel fourni est le symbole « OM ».
- Backend multi-comptes, chiffrement, rétention et suppression des données.

## Crédits

O’MIND by Optima Mind — Agnieszka « Aga » Orchowska, Wavre, Belgique.
Photos : Unsplash (licence Unsplash) · Nay Nyo / Pexels · séance Optima Mind.
Prototype de démonstration : profils, scores, activités et documents sont fictifs.
