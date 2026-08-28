# Étape 0 — Architecture validée (mémoire du projet)

Validation obtenue le 2025-08 : la refonte est développée selon cette architecture.
Ce document est le résumé exécutif ; les justifications détaillées ont été livrées
et approuvées avant le développement.

## Stack

- **Astro 5** (`output: 'static'`, adapter `@astrojs/vercel`) — SSG, zéro JS par défaut.
- **Decap CMS** (incrément 3) — éditeur en français, contenu Markdown dans le dépôt.
- **Cal.com** (incrément 5) — réservation, hébergement UE, UI FR/PL.
- **Brevo** (incrément 5) — emails transactionnels + newsletter double opt-in (UE).
- **Plausible** (incrément 6) — analytics sans cookie, hébergé UE.
- **Vercel** — déploiement GitHub, preview par branche, en-têtes de sécurité.
- Qualité : TypeScript strict · ESLint · Prettier · Vitest · Playwright + axe-core · Lighthouse CI (≥ 95).

## Modèle de contenu (CMS)

Collections : `settings` (NAP, réseaux, SEO par défaut, réservation) · `page`
(titre, hero, sections en blocs typés, relations témoignages/FAQ, SEO) ·
`testimonial` (auteur, rôle, photo, texte, catégorie sport/entreprise, mise en
avant, consentement) · `faq` · `blogPost` (prêt pour l'incrément blog).
Traductions FR/PL gérées dans Decap (fichiers `_fr`/`_pl`). Schémas Zod dans
`src/content.config.ts` (incrément 3).

## Direction artistique (tokens dans `src/styles/tokens.css`)

Palette (contrastes WCAG 2.2 vérifiés par calcul) :

| Token                   | Valeur    | Usage                     | Contraste  |
| ----------------------- | --------- | ------------------------- | ---------- |
| `--color-brand`         | `#00B2E7` | identité graphique (logo) | décor seul |
| `--color-primary`       | `#0A5C73` | actions, liens, titres    | 7,5:1      |
| `--color-ink`           | `#2C2E3D` | texte principal           | 13,4:1     |
| `--color-ink-soft`      | `#55686F` | texte secondaire          | ≈4,8:1     |
| `--color-accent-strong` | `#8A5A00` | texte ambre               | 5,9:1      |
| `--color-focus`         | `#0B6E93` | focus visible             | 5,7:1      |

Typographies auto-hébergées : **Montserrat** (texte, latin-ext pour le polonais)
et **Caveat** (accent manuscrit, remplace Permanent Marker sans couverture polonaise).

## Bilingue

Routes `/fr/` et `/pl/` ; `/` redirige (cookie `optima_lang`, puis
`Accept-Language`, défaut fr). Page non traduite → contenu FR avec mention
(fallback `rewrite`), jamais de 404. hreflang réciproques + x-default.

## Données réelles (audit du site actuel)

Adresse : Clos du Relais 61, 1300 Wavre · Tél : +32 473 85 24 65 ·
info@optima-mind.com · BCE BE 1012.449.376 · Réseaux : Facebook, LinkedIn, Instagram.
À confirmer officiellement ; le reste est balisé ⟨À FOURNIR : …⟩.
