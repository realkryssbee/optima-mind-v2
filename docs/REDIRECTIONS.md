# Plan de redirections — WordPress → nouveau site

Inventaire réalisé depuis les sitemaps Yoast du site actuel (audit 2025-08).
Appliqué via `vercel.json` (301) et le middleware Astro (410) ; aucune URL
indexée ne doit retomber en 404.

## 1. Pages réelles migrées (301 — contenu préservé 1:1)

| Ancienne URL (WordPress) | Nouvelle URL                                        |
| ------------------------ | --------------------------------------------------- |
| `/`                      | `/fr/` (redirection par langue)                     |
| `/sportifs/`             | `/fr/sportifs/`                                     |
| `/entreprises/`          | `/fr/entreprises/`                                  |
| `/a-propos/`             | `/fr/a-propos/`                                     |
| `/contact/`              | `/fr/contact/`                                      |
| `/mentions-legales/`     | `/fr/mentions-legales/`                             |
| `/prise-de-rendez-vous/` | `/fr/prise-de-rendez-vous/`                         |
| `/reservation-recue/`    | `/fr/prise-de-rendez-vous/`                         |
| _(inexistante)_          | `/fr/politique-de-confidentialite/` (nouvelle page) |

## 2. Contenu de démo / thème / plugin (410 Gone)

Les URLs suivantes proviennent du thème WordPress (thegem) ou de plugins de
démo : elles ne doivent plus être indexées. Un 410 indique à Google un retrait
définitif (mieux qu'une 404). **Implémentation : middleware Astro
(`src/middleware.ts`, exécuté en périphérie Vercel)** — `vercel.json` ne peut
pas garantir le statut 410 (et exige `destination` sur chaque redirect).

- Blog : `/news/`, `/our-news/`, les 17 articles de démo (`/2018/…`,
  `/2019/…`, `/2025/10/02/bonjour-tout-le-monde/`), `/category/…`, `/tag/…`
- CPT « class » (démo yoga) : `/class/…`, `/class-category/…`
- Auteur : `/author/kryss/`
- Plugin WP Booking Calendar : pages démo `/wp-booking-calendar*`
- WordPress : `/wp-content/…`, `/wp-includes/…`, `/wp-json/…`, `/feed`,
  `/comments/feed`, `/xmlrpc.php` (aussi bloqué côté sécurité)

## 3. Motifs génériques (301)

- `/?p=N` et `/?page_id=N` → `/fr/` (anciens permaliens WordPress)
- `/index.php` → `/fr/`

## 4. À configurer au déploiement (hors dépôt)

- **Domaine** : le canonical est `https://www.optima-mind.com` ; configurer chez
  Vercel la redirection `optima-mind.com` → `www.optima-mind.com` (domaine par
  défaut + règles), et la migration DNS depuis l'hébergeur actuel (OVH).
- **HTTP → HTTPS** : géré par Vercel (TLS par défaut).
- **Google Search Console** : soumettre le nouveau `sitemap.xml`, surveiller
  « Changements d'adresse » / « Pages » après la bascule DNS, confirmer qu'aucune
  URL ne répond 404 (outil « Inspection d'URL »).

## 5. Vérification post-déploiement

```bash
# Exemple de vérification (une fois en ligne) :
curl -sI https://www.optima-mind.com/sportifs/ | grep -i location   # → /fr/sportifs/ (301)
curl -sI https://www.optima-mind.com/news/ | head -1                # → HTTP/1.1 410
```
