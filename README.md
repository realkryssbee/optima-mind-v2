# Optima Mind — Site web

Refonte complète de [optima-mind.com](https://www.optima-mind.com) (anciennement WordPress) :
préparation mentale et performance durable — sportifs, équipes, entraîneurs, entreprises — Wavre, Belgique.

## Stack (étape 0 validée)

| Couche             | Choix                                                                                  | Justification                                                                               |
| ------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Framework          | **Astro 5** (SSG, `output: 'hybrid'`)                                                  | Statique par défaut, zéro JS sur les pages de contenu, i18n natif `/fr` `/pl` avec fallback |
| CMS                | **Decap CMS** (git-based, éditeur en français)                                         | Contenu en Markdown dans le dépôt, portabilité totale, publication par PR → preview Vercel  |
| Réservation        | **Cal.com** (incrément 5)                                                              | Hébergement UE, UI FR/PL, types d'événements par durée, emails automatiques                 |
| Email / newsletter | **Brevo** (incrément 5)                                                                | Données dans l'UE, double opt-in natif, envoi transactionnel                                |
| Analytics          | **Plausible** (hébergé UE, sans cookie)                                                | Aucun traceur avant consentement — pas de bandeau nécessaire                                |
| Déploiement        | **Vercel** (GitHub, preview par branche)                                               | En-têtes de sécurité, redirections 301, CDN                                                 |
| Qualité            | TypeScript strict · ESLint · Prettier · Vitest · Playwright + axe-core · Lighthouse CI | Un échec bloque la fusion                                                                   |

## Commandes

```bash
npm install          # installer les dépendances
npm run dev          # serveur de développement (http://localhost:4321)
npm run build        # build de production (dist/)
npm run preview      # prévisualiser le build (serveur statique local)
npm run typecheck    # astro check (types sur .astro et .ts)
npm run lint         # ESLint (zéro warning toléré)
npm run format       # Prettier (écriture)
npm run format:check # Prettier (vérification)
npm run test         # tests unitaires (Vitest)
npm run test:e2e     # tests end-to-end (Playwright, navigateur chromium)
npm run lhci:collect # audit Lighthouse (mobile) sur le build
npm run lhci:assert  # vérifie les budgets (>= 95 sur les 4 catégories)
```

## Variables d'environnement

Copier `.env.example` vers `.env` et renseigner. Les secrets ne sont jamais committés.

| Variable                                              | Usage                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| `PUBLIC_SITE_URL`                                     | URL canonique du site                                              |
| `BREVO_API_KEY`                                       | API Brevo — formulaires, accusés de réception, newsletter          |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME`            | Expéditeur des emails transactionnels                              |
| `BREVO_LIST_ID`                                       | Liste Brevo de la newsletter (double opt-in)                       |
| `CONTACT_RECIPIENT_EMAIL`                             | Destinataire du formulaire de contact                              |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limiting (région UE) — repli en mémoire sinon                 |
| `PUBLIC_ANALYTICS_DOMAIN`                             | Analytics Plausible (sans cookie) — optionnel, activé si renseigné |

La réservation Cal.com se configure dans le CMS (Réglages → Réservation → Lien Cal.com, ex. `agnieszka/individuel`).

## Architecture

```
src/
├── content/          # Contenus CMS (Markdown, édités via Decap) — incrément 3
├── assets/           # images : uploads/ (média CMS), brand/ (logo), references/
├── layouts/          # BaseLayout (head SEO complet) · PageLayout (header/nav/footer)
├── components/       # ui/ (Button, Card…) · sections/ · seo/ (LanguageSwitcher…)
├── pages/            # Routes /fr/*, /pl/*, /api/*, sitemap, robots, og, blog
├── styles/           # tokens.css (design system) · global.css
├── lib/              # i18n, locale, site (NAP), forms, rate-limit, seo
└── middleware.ts     # Redirection / → langue détectée (cookie mémorisé)
```

### Décisions clés (étapes 0 validée)

- **Bilingue** : routes préfixées `/fr/` et `/pl/` ; `/` redirige vers la langue détectée
  (cookie `optima_lang` puis `Accept-Language`, défaut fr). Une page non traduite affiche
  le français (fallback `rewrite`) avec une mention — jamais de 404.
- **Design system** : palette, typographies (Montserrat + Caveat, latin-ext), échelles en
  tokens CSS (`src/styles/tokens.css`). Contrastes WCAG 2.2 vérifiés par calcul.
- **Sécurité** : en-têtes (CSP stricte, HSTS, nosniff, Referrer-Policy, Permissions-Policy)
  via `vercel.json` ; secrets en variables d'environnement.
- **Performance** : aucune bibliothèque JS côté client sur les pages de contenu ; polices
  auto-hébergées ; images AVIF/WebP au build (sharp) ; budgets Lighthouse ≥ 95.

## Déploiement (Vercel + GitHub)

1. **Dépôt GitHub** : créer le dépôt, pousser `main` (voir `admin/config.yml` :
   renseigner `repo`).
2. **Projet Vercel** : importer le dépôt (framework Astro auto-détecté) ;
   variables d'environnement depuis `.env.example` (Brevo, Upstash) dans
   Réglages → Environment Variables.
3. **Éditeur Decap** : créer une **GitHub OAuth App** (Settings → Developer
   settings) et déployer le petit proxy OAuth (ex. `decap-cms-github-oauth`),
   puis renseigner `base_url`/`auth_endpoint` dans `admin/config.yml`.
4. **Domaine** : ajouter `www.optima-mind.com` + `optima-mind.com` chez Vercel,
   rediriger vers `www`, migrer le DNS depuis l'hébergeur actuel (OVH).
5. **Redirections** : déjà dans `vercel.json` — vérifier après la bascule avec
   les commandes de `docs/REDIRECTIONS.md` (§5).
6. **Search Console** : soumettre `https://www.optima-mind.com/sitemap.xml`.

## Documentation

- `GUIDE-CONTENU.md` — guide d'édition rédigé pour Agnieszka, en français simple.
- `docs/REDIRECTIONS.md` — plan de redirections WordPress → nouveau site (301/410).
- `docs/ETAPE-0.md` — proposition d'architecture validée (stack, modèle CMS, direction artistique).
- `docs/RAPPORTS.md` — preuves mesurées (Lighthouse mobile + axe-core WCAG 2.2 AA).

## Statut des incréments

| #   | Incrément                                   | Statut   |
| --- | ------------------------------------------- | -------- |
| 1   | Socle Astro 5 + design system + CI          | ✅ Livré |
| 2   | Pages statiques FR                          | ✅ Livré |
| 3   | CMS Decap + branchement du contenu          | ✅ Livré |
| 4   | Bilingue FR/PL                              | ✅ Livré |
| 5   | Formulaires (Brevo) + réservation (Cal.com) | ✅ Livré |
| 6   | SEO + données structurées + redirections    | ✅ Livré |
| 7   | Accessibilité + performance                 | ✅ Livré |
| 8   | CI/CD Vercel + guides + rapports            | ✅ Livré |
