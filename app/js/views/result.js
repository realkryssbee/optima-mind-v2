import { formatDate } from '../utils.js?v=7';
import { icon } from '../ui/icons.js?v=7';
import { scoreGrid, trackCurves } from '../ui/components.js?v=7';
import { fourCReading } from '../ui/fourcReading.js?v=7';

export function resultView({ profile }) {
  const completedAt = profile.completedAt ? formatDate(profile.completedAt, { year: 'numeric' }) : '';
  const isSample = Boolean(profile.sample);

  return `<div class="result-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/accueil" aria-label="Revenir à l’accueil">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">Profil 4C</span>
      <span class="flowbar__right">${isSample ? 'Exemple' : 'Résultat'}</span>
    </header>

    <section class="result-hero" aria-labelledby="view-title">
      ${trackCurves('result-hero__curves')}
      <div class="result-hero__top">
        <p class="eyebrow eyebrow--ice">Auto-évaluation en compétition</p>
        <span class="pill pill--glass">${isSample ? 'Profil d’exemple' : 'Résultat de démo'}</span>
      </div>
      <h1 class="display display--result" id="view-title">Ton profil 4C</h1>
      <p class="result-hero__meta">20 affirmations · ${completedAt}</p>
      ${scoreGrid(profile)}
    </section>

    ${fourCReading({ profile, mode: 'sportif' })}

    <div class="result-actions result-actions--after-reading">
      <a class="btn btn--outline btn--block" href="#/aujourdhui">
        Explorer mon espace ${icon('arrowRight', { size: 18 })}
      </a>
    </div>

    <div class="result-foot">
      ${isSample
        ? `<button class="text-link" data-action="start-test" type="button">Faire le test pour découvrir mon propre profil ${icon('arrowRight', { size: 14 })}</button>`
        : `<button class="text-link" data-action="retake-test" type="button">Refaire le test ${icon('reset', { size: 14 })}</button>`}
      <span class="fineprint">Les quatre dimensions sont révélées ici uniquement. Pendant le test, l’ordre des affirmations reste fixe et leur dimension reste masquée.</span>
    </div>
  </div>`;
}
