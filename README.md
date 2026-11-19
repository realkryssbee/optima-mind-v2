# O’MIND — démo allégée

Version simple et lisible pour une démonstration rapide : le **profil 4C**, le **bilan du jour**,
les **ressources** et l’**espace d’Aga**, avec deux sportifs fictifs — **Léa** et **Malik**.

- **Démo en ligne** : <https://dev.kryssbee.com/omind/>
- **En local** : <http://localhost:3000/>
- **Réseau local** : l’URL est affichée au démarrage du serveur.

La version complète (carnet, routines à deux, activités connectées, collectifs, documents PDF,
Chris / Elise / Coco) est conservée sur la branche Git **`sportifs`**. La démo allégée est sur la
branche **`demo`**, qui est la version courante et déployée.

## Comptes de démonstration

| Compte | Profil fictif | Sport |
| --- | --- | --- |
| **Léa** | Léa Dubois, 21 ans | 400 m haies · Wavre Athlétisme |
| **Malik** | Malik Benali, 24 ans | Basket-ball · meneur · BC Wavre |
| **Aga** | Agnieszka « Aga » Orchowska | Espace coach |

Le sélecteur de compte est visible sur l’accueil et dans la barre « Démo ». Les deux sportifs ont
un profil 4C d’exemple et un historique de bilans fictif.

## Lancer

Prérequis : Node.js 20 ou plus. Aucune dépendance à installer.

```bash
npm start
# ou
node server.mjs
```

## Parcours de la démo

1. **Accueil** : « Découvrir mon profil 4C » pour le questionnaire, ou « Explorer la démo » pour
   ouvrir directement le profil d’exemple de Léa.
2. **Questionnaire 4C** : 20 affirmations du référentiel, mélangées, une par écran, retour
   possible avec conservation de la réponse. Le calcul est déterministe (moyenne des cinq
   réponses, `6 − réponse` pour l’affirmation inversée).
3. **Résultat** : Calme, Combativité, Concentration, Confiance sur 5, piste à explorer construite
   à partir des réponses, détail par dimension, « Échanger avec Aga ».
4. **Aujourd’hui** : check-in humeur / énergie / sommeil, mot facultatif, confirmation et suivi
   sur 7 jours. Le programme rappelle le questionnaire 4C et la dernière ressource partagée.
5. **Profil** : identité, profil 4C, derniers bilans, statut du questionnaire, changement de
   compte Léa / Malik, ouverture de l’espace Aga et réinitialisation.
6. **Ressources** : ressource partagée par Aga, bibliothèque de trois exemples, aperçus
   (respiration interactive, routine, vidéo de démonstration).
7. **Espace Aga** : tableau de bord, liste des deux sportifs, fiche avec profil 4C, dernier
   bilan, questionnaire et ressources partagées. Attribution du questionnaire et partage d’une
   ressource sont simulés mais réactifs : le statut et la ressource se retrouvent côté sportif.

## Ce qui est simulé

- Comptes, profils, bilans, réponses et partages : **fictifs**, stockés dans le navigateur
  (`localStorage`).
- Aucun email, aucune notification, aucun rendez-vous n’est réellement envoyé.
- La ressource vidéo est un aperçu de démonstration ; l’agenda Cal.com n’est pas connecté.
- Le questionnaire 4C est une première version du référentiel, **non validée
  psychométriquement**. Un score plus bas n’est pas un problème, mais une ressource à explorer.
- Pas de backend ni d’authentification réelle. Aga et les sportifs doivent utiliser le même
  navigateur pour voir les mêmes données ; deux onglets peuvent être connectés à deux comptes.
- Palette bleu nuit / cobalt / glacier et lettrage O’MIND à valider ; le seul fichier officiel
  fourni est le symbole « OM ».

## Version complète (branche `sportifs`)

La branche `sportifs` contient la version étendue : Mon carnet, routines à deux, activités
manuelles / GPX / Strava démo, collectifs Équipe et Groupe, documents PDF avec versions, espace
Aga multi-sportifs avec sélecteur de fiche. Elle n’est **pas** déployée sur l’URL publique
actuelle.

```powershell
git switch sportifs
npm start   # aperçu local de la version complète
```

Pour la déployer à la place de la démo allégée, reprendre les commandes SSH ci-dessous depuis
cette branche (le dossier `app/` est autonome).

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

```powershell
tar -czf "$env:TEMP\omind-demo.tar.gz" -C app .
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nas" kryss@192.168.0.118 "cd /volume1/web/omind && find . -mindepth 1 -maxdepth 1 -exec rm -rf {} +"
scp -i "$env:USERPROFILE\.ssh\id_rsa_nas" "$env:TEMP\omind-demo.tar.gz" kryss@192.168.0.118:/web/omind/
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nas" kryss@192.168.0.118 "cd /volume1/web/omind && tar -xzf omind-demo.tar.gz && rm omind-demo.tar.gz"
```

Le chemin SFTP est `/web/omind` ; le chemin shell est `/volume1/web/omind`.

## Vérifications

- Questionnaire complet, retour arrière, quatre scores ; accès direct au profil d’exemple.
- Check-in enregistré, confirmation et suivi mis à jour.
- Changement Léa / Malik et espace Aga.
- Partage d’une ressource depuis la fiche d’Aga, retrouvée dans les ressources du sportif.
- Attribution / relance du questionnaire et statut mis à jour.
- 360 px, 390 px et ordinateur : pas de débordement horizontal.
- Navigation clavier, focus, fermeture Échap des panneaux, mouvement réduit.
- Audit axe-core WCAG 2.1/2.2 AA : 0 violation sur les écrans testés. Le bouton
  « Enregistrer mon bilan » est à 54 px mais se trouve partiellement sous la barre d’onglets
  collante au premier écran ; le laisser visible en entier reste à arbitrer.

## Structure

```text
app/
├── index.html
├── config.js
├── assets/           # polices, photos, symbole officiel
├── styles/           # tokens.css + app.css
└── js/
    ├── data.js       # 4C, Léa, Malik, ressources, 35 jours de bilans
    ├── fourc-content.js # textes exacts de lecture, pistes, catalogue
    ├── scoring.js    # ordre fixe, recodage, scores, lecture détaillée
    ├── alerts.js     # seuil et calcul de l’alerte coach
    ├── store.js      # comptes, 4C, bilans, séances, ressources
    ├── app.js        # routeur et interactions
    ├── ui/           # composants, graphiques, lecture 4C, feuilles
    └── views/        # accueil, test, résultat, aujourd’hui, profil,
                      # ressources, coach
server.mjs            # serveur statique local (port 3000)
```

## Ajouts de la démonstration (novembre 2026)

- **Suivi 7 / 14 / 30 jours** : trois courbes SVG (Sommeil, Énergie, Humeur), moyennes sur 10,
  sélecteur de période (14 j par défaut), ajout immédiat du check-in du jour. 35 jours sont
  générés pour permettre la comparaison de l’alerte avec les 28 jours précédents ; 30 jours
  maximum sont affichés.
- **Point à regarder côté coach** : Malik présente une baisse d’énergie sur ses 5 derniers
  check-ins par rapport à ses 28 jours précédents. Le seuil est la constante
  `ALERT_DROP_THRESHOLD` dans `app/js/alerts.js`. L’alerte est cliquable, met les 5 derniers
  jours en évidence sur le graphique et peut être marquée comme vue ; elle reste dans
  l’historique de la fiche. Léa n’a pas d’alerte. Le sportif ne voit ni alerte ni seuil.
- **Lecture 4C détaillée** : radar à 4 axes, une carte par dimension, points d’appui,
  situations à explorer, pistes dépliables, question de réflexion, invitation et limites.
  Les 20 réponses et les valeurs recodées sont disponibles dans l’onglet coach **Profil 4C**.
  L’ordre des 20 affirmations est celui fourni dans le brief (fixe).
- **Clôture de séance** : date, note privée, prochaines étapes visibles par le sportif et
  ressources jointes. Le sportif voit « Après ta séance du … » dans Aujourd’hui et les
  ressources dans son espace. L’onglet coach **Séances** garde l’historique avec la note
  privée. « Ajouter un fichier » est marqué **Bientôt** et désactivé.
- **Catalogue de tests** : Profil 4C disponible ; « Gestion de la pression en compétition » et
  « Routine et préparation » marqués **Bientôt**, désactivés avec explication. Attribution avec
  un mot facultatif d’Aga, visible tel quel côté sportif. Statut : à faire → envoyé → complété.

### Tests manuels

1. `#/aujourdhui` avec Léa : changer 7 j / 14 j / 30 j, vérifier les moyennes et le nombre de
   points, enregistrer le check-in et vérifier que le jour apparaît sans rechargement.
2. `#/coach` avec Aga : la carte **À regarder** affiche « 1 sportif à regarder » et la ligne
   Malik ; cliquer ouvre `?tab=bilans&focus=alert`, marquer comme vu, vérifier la disparition
   du tableau de bord et la présence dans l’historique de la fiche.
3. `#/resultat` ou fin du questionnaire : radar, 4 cartes, 4 limites ; ouvrir une piste, puis
   « Échanger sur mon profil ». Dans la fiche coach, onglet **Profil 4C**, ouvrir les 20
   réponses et vérifier les valeurs recodées.
4. Fiche coach de Léa : clôturer une séance avec une note privée, des prochaines étapes et une
   ressource. Vérifier la carte côté Léa, l’absence de la note privée, les ressources partagées
   et l’onglet **Séances**.
5. `#/coach/questionnaires` : attribuer le Profil 4C à Malik avec un mot, vérifier le statut
   dans la fiche et le mot dans « Ce qu’Aga te propose », puis envoyer et simuler la réponse.
6. Réinitialiser la démo : l’alerte de Malik réapparaît et les séances disparaissent.

### Écarts et points ouverts

- Le libellé demandé « À traiter » contient le mot interdit « traiter » ; il est remplacé par
  **À regarder**. Le reste du texte de l’alerte est conservé.
- Le seuil de 2 points est global ; il pourra devenir un réglage par sportif avec Aga.
- Seule l’énergie franchit le seuil de 2 points dans les données de Malik ; le sommeil et
  l’humeur baissent aussi visuellement mais ne sont pas cités dans la phrase d’alerte.
- Les noms des deux autres tests, la définition définitive du Switch et la structure de la note
  de séance (texte libre ou modèle) restent à valider avec Aga.

## Crédits

O’MIND by Optima Mind — Agnieszka « Aga » Orchowska, Wavre, Belgique.
Photos : Unsplash (licence Unsplash) · Nay Nyo / Pexels · séance Optima Mind.
Profils, scores et données sont fictifs.
