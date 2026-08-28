# Guide de contenu — Optima Mind

_Écrit pour Agnieszka. Aucune connaissance technique n'est nécessaire :
ce guide vous montre comment modifier le site en quelques clics._

---

## 1. Comment ça marche ?

Le site se modifie dans un **espace d'édition en français** (accessible à
l'adresse `https://www.optima-mind.com/admin`).

1. **Connectez-vous** (avec votre compte GitHub — voir « Première connexion »).
2. **Modifiez** un texte, ajoutez un témoignage, changez une photo…
3. **Publiez** : le site se met à jour automatiquement quelques minutes plus
   tard, après une vérification automatique de qualité.

> Une modification n'est **jamais perdue** : chaque publication est enregistrée,
> et vous pouvez revenir en arrière à tout moment.

## 2. Première connexion

- L'éditeur demande une autorisation GitHub la première fois (créée une seule
  fois par la personne qui installe le site — voir le README technique).
- Après connexion, vous arrivez sur l'écran d'accueil de l'éditeur avec la
  liste des contenus : **Pages, Témoignages, FAQ, Réglages**.

## 3. Modifier un texte d'une page

1. Menu **Pages** → choisissez la page (Accueil, Sportifs, Entreprises…).
2. Modifiez les champs en clair : titre, accroche, paragraphes…
   _(L'éditeur n'affiche que les champs utiles pour chaque page.)_
3. Cliquez sur **Enregistrer**, puis **Publier**.

Le texte apparaît sur le site après la mise à jour automatique (quelques
minutes).

## 4. Ajouter un témoignage

1. Menu **Témoignages** → **Nouveau témoignage**.
2. Remplissez :
   - **Auteur** (nom ou description, ex. « Joueur de hockey sur gazon »),
   - **Rôle / club / entreprise** (optionnel),
   - **Témoignage** (le texte, entre guillemets),
   - **Catégorie** : Sport ou Entreprise,
   - **Photo** (optionnelle — pas besoin de redimensionner),
   - **Mis en avant (accueil)** : cocher pour l'afficher sur la page d'accueil,
   - **Accord écrit de publication** : **obligatoire** — ne publiez un
     témoignage qu'avec l'accord écrit de la personne.
3. **Enregistrer** puis **Publier**.

Le témoignage apparaît automatiquement sur les pages Sportifs (et sur
l'accueil s'il est « mis en avant »).

## 5. Changer une photo

- Dans n'importe quel champ photo, cliquez sur **Choisir une image**.
- Téléversez votre fichier (JPEG, PNG, WebP…) : **aucun redimensionnement
  manuel** — le site génère automatiquement les formats optimisés (AVIF/WebP)
  et les tailles adaptées à chaque écran.
- Pensez à remplir le champ **texte alternatif** : c'est la description lue
  par les personnes malvoyantes et utilisée par Google.

**Où vont les images ?** (si vous travaillez avec la personne qui gère le site)

- **Photos du site** (pages, témoignages, blog) : dossier
  `src/assets/uploads/` — c'est le dossier média du CMS : les images y
  arrivent automatiquement lors d'un upload dans l'éditeur, et vous pouvez
  aussi y déposer des fichiers directement.
- **Logo et éléments de marque** : dossier `src/assets/brand/` (le logo
  actuel y est déjà importé).

## 6. Publier une traduction polonaise

- Dans l'éditeur d'une page, **en haut, choisissez la langue** (Français ou
  Polski) puis traduisez les champs.
- Enregistrez et publiez.
- **Tant qu'une page n'est pas traduite** : les visiteurs polonais voient la
  version française avec une petite mention l'indiquant — jamais une page
  d'erreur.

## 7. Réglages généraux

Menu **Réglages** (une seule page) :

- **Coordonnées** : adresse, téléphone, email, horaires,
- **Réseaux sociaux** : Facebook, LinkedIn, Instagram,
- **Réservation** : le lien de votre agenda en ligne (Cal.com),
- **Valeurs SEO par défaut** : titre et description affichés dans Google.

## 8. FAQ

Menu **FAQ** → **Nouvelle question** : question, réponse, catégorie
(Sportifs / Entreprises / Général). Les questions « Sportifs » apparaissent
sur la page Sportifs ; elles sont aussi reconnues par Google (encadré
« Questions fréquentes » dans les résultats).

## 9. Articles de blog (à venir)

Le modèle est prêt : menu **Articles**. Un article = titre, extrait, image de
couverture, contenu, date. Même principe de publication.

## 10. Annuler / contrôler une modification

- **Enregistrer** = sauvegarder un brouillon (rien ne change en ligne).
- **Publier** = mettre en ligne.
- Chaque publication passe par une **vérification automatique** (qualité,
  accessibilité, performances) ; si quelque chose ne va pas, la publication
  est bloquée et un message vous l'explique.

## 11. En cas de question

Contactez la personne qui gère le site : elle peut modifier les contenus
avancés (formulaires, réservation, SEO) et vous assister à chaque étape.

---

## Contenus en attente (⟨À FOURNIR⟩)

Au moment de la livraison, ces éléments doivent encore être fournis pour
compléter le site :

| Élément                                                   | Où le renseigner                      |
| --------------------------------------------------------- | ------------------------------------- |
| **Horaires de consultation**                              | Réglages → Horaires                   |
| **Lien de réservation Cal.com**                           | Réglages → Réservation                |
| **Portrait d'Agnieszka** (page À propos, photo d'accueil) | Pages → À propos                      |
| **Clés Brevo / Upstash** (envoi des formulaires)          | Variables d'environnement (technique) |
| **Accord de publication des témoignages**                 | Témoignages → case « Accord »         |
| **Traductions polonaises des pages**                      | Éditeur → langue Polski               |
| **FAQ** (questions/réponses)                              | Menu FAQ                              |
