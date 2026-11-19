import { DIMENSIONS } from '../data.js';
import { buildInsight, formatScore, readDimension } from '../scoring.js';
import { formatDate } from '../utils.js';
import { icon } from '../ui/icons.js';
import { scoreGrid, trackCurves } from '../ui/components.js';

export function resultView({ profile }) {
  const insight = buildInsight(profile);
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
        <p class="eyebrow eyebrow--ice">Autoévaluation en compétition</p>
        <span class="pill pill--glass">${isSample ? 'Profil d’exemple' : 'Résultat de démo'}</span>
      </div>
      <h1 class="display display--result" id="view-title">Ton profil 4C</h1>
      <p class="result-hero__meta">20 affirmations · ${completedAt}</p>
      ${scoreGrid(profile, { highlight: insight.dimension.key })}
    </section>

    <section class="insight" aria-labelledby="insight-title">
      ${trackCurves('insight__curves')}
      <p class="eyebrow">Ta piste à explorer</p>
      <h2 class="display display--insight" id="insight-title">${insight.title}</h2>
      <p class="insight__text">${insight.intro}</p>
      <div class="piste-tags" aria-label="Pistes d’entraînement mental">
        ${insight.pistes.map((piste) => `<span class="tag">${piste}</span>`).join('')}
      </div>
      <div class="reflect">
        <p class="eyebrow">Une question pour aller plus loin</p>
        <blockquote>« ${insight.question} »</blockquote>
      </div>
    </section>

    <div class="result-actions">
      <button class="btn btn--primary btn--block btn--lg" data-action="open-exchange" type="button">
        Échanger avec Aga ${icon('message', { size: 19 })}
      </button>
      <a class="btn btn--outline btn--block" href="#/aujourdhui">
        Explorer mon espace ${icon('arrowRight', { size: 18 })}
      </a>
    </div>

    <section class="details" aria-labelledby="details-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Lecture détaillée</p>
          <h2 class="display" id="details-title">Détail par dimension</h2>
        </div>
      </div>
      <div class="acc-list">
        ${DIMENSIONS.map((dimension) => {
          const read = readDimension(profile, dimension.key);
          const value = profile.scores[dimension.key];
          const isFocus = dimension.key === insight.dimension.key;
          return `<details class="acc" ${isFocus ? 'open' : ''}>
            <summary>
              <span class="acc__head">
                <span class="acc__name">${dimension.name}</span>
                <span class="acc__sub">${dimension.subtitle}</span>
              </span>
              <span class="acc__score">${formatScore(value)}<small>/5</small></span>
              <span class="acc__chev">${icon('chevronDown', { size: 18 })}</span>
            </summary>
            <div class="acc__body">
              <div class="meter" aria-hidden="true"><i style="width:${(value / 5) * 100}%"></i></div>
              <p class="acc__def">${dimension.definition}</p>
              <p class="acc__read">${read.summary}</p>
              <div class="acc__pistes">
                <span class="acc__label">Pistes à explorer</span>
                <div class="piste-tags">${dimension.pistes.map((piste) => `<span class="tag tag--small">${piste}</span>`).join('')}</div>
              </div>
              <p class="acc__question"><span class="acc__label">Question</span> ${dimension.question}</p>
            </div>
          </details>`;
        }).join('')}
      </div>
    </section>

    <div class="notice">
      <span class="notice__icon">${icon('info', { size: 18 })}</span>
      <p>Ce résultat décrit ta perception en compétition. C’est une autoévaluation exploratoire, non validée psychométriquement : un score plus bas n’indique pas un problème, mais une ressource à explorer et à développer.</p>
    </div>

    <div class="result-foot">
      ${isSample
        ? `<button class="text-link" data-action="start-test" type="button">Faire le test pour découvrir mon propre profil ${icon('arrowRight', { size: 14 })}</button>`
        : `<button class="text-link" data-action="retake-test" type="button">Refaire le test ${icon('reset', { size: 14 })}</button>`}
      <span class="fineprint">Les quatre dimensions sont révélées ici uniquement. Pendant le test, l’ordre des affirmations est mélangé et leur dimension reste masquée.</span>
    </div>
  </div>`;
}
