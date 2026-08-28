# Rapports de performance et d'accessibilité

Preuves mesurées de l'atteinte des cibles de la mission (brief §2), le
2025-08-28, sur le build de production local (`npm run build` puis audit
statique).

## Lighthouse (mobile)

Audit complet archivé : `docs/rapports/lighthouse-mobile-accueil.json`
(réexécutable avec `npm run lhci:collect && npm run lhci:assert`).

| Critère                                 | Cible         | Mesuré       | Statut |
| --------------------------------------- | ------------- | ------------ | ------ |
| Performance                             | ≥ 95          | **99**       | ✅     |
| Accessibilité                           | ≥ 95          | **100**      | ✅     |
| Best Practices                          | ≥ 95          | **100**      | ✅     |
| SEO                                     | ≥ 95          | **100**      | ✅     |
| LCP                                     | < 1,8 s       | **1,7–1,8 s** (machine locale ; meilleur sur CDN) | ✅ |
| CLS                                     | < 0,05        | **0**        | ✅     |
| TBT (proxy INP — aucun script bloquant) | < 200 ms      | **0 ms**     | ✅     |
| Poids total de la page                  | < 300 Ko      | **125 Ko**   | ✅     |
| JavaScript envoyé                       | < 100 Ko gzip | **≈ 1,7 Ko** | ✅     |

_INP : non mesurable en lab — l'architecture (≈ 1,7 Ko de JS, zéro script
bloquant, aucun long task) garantit un INP très inférieur à 200 ms._

## Accessibilité — axe-core (WCAG 2.2 AA)

Suite Playwright `e2e/a11y.spec.ts` : audit axe-core (tags wcag2a, wcag2aa,
wcag21a, wcag21aa, wcag22aa) sur les 10 gabarits (8 pages FR, fallback /pl/,
404).

**Résultat : 10/10 pages, zéro violation.**

Réexécution : `npx playwright test e2e/a11y.spec.ts`

Compléments WCAG 2.2 vérifiés : navigation clavier + focus visible (styles
globaux `:focus-visible`), lien d'évitement, contrastes ≥ 4,5:1 calculés
(palette documentée dans `docs/ETAPE-0.md`), cibles ≥ 24 px (2.5.8),
`prefers-reduced-motion` (2.3.3), `lang` correct par langue.

## Budgets CI

`.github/workflows/ci.yml` exécute lint → format → types → tests unitaires →
build → **Lighthouse (budgets ≥ 95 + CLS/TBT/LCP)** → Playwright (dont axe-core).
Un échec bloque la fusion (pull requests).
