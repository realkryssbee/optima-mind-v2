import { icon } from '../ui/icons.js?v=7';
import { trackCurves } from '../ui/components.js?v=7';
import { escapeHTML } from '../utils.js?v=7';

export function landingView({ state }) {
  const config = window.OMIND_CONFIG ?? {};
  const siteUrl = config.siteUrl ?? 'https://www.optima-mind.com';
  const active = state.athletes[state.activeAthlete] ?? state.athletes.lea;
  const test = active.test;
  const profile = active.profile;
  const hasOwnResult = Boolean(profile && !profile.sample);

  let primary;
  if (test?.status === 'in_progress') {
    primary = {
      action: 'start-test',
      label: 'Reprendre le test 4C',
      meta: `Question ${test.index + 1} sur 20 · ${Object.keys(test.answers).length} réponse${Object.keys(test.answers).length > 1 ? 's' : ''}`,
    };
  } else if (hasOwnResult) {
    primary = {
      action: 'view-result',
      label: 'Revoir mon profil 4C',
      meta: 'Ton résultat · 20 affirmations',
    };
  } else {
    primary = {
      action: 'start-test',
      label: 'Découvrir mon profil 4C',
      meta: '20 affirmations · 2 min',
    };
  }

  return `<div class="landing">
    <header class="landing__top">
      <div class="brandmark">
        <span class="wordmark wordmark--navy">O’MIND</span>
        <span class="brandmark__sub">Optima Mind</span>
      </div>
      <a class="site-link" href="${siteUrl}" target="_blank" rel="noopener noreferrer">
        optima-mind.com ${icon('arrowUpRight', { size: 14 })}
      </a>
    </header>

    <section class="landing__hero" aria-labelledby="landing-title">
      <img class="landing__img" src="assets/img/hero-start.webp" alt="Sprinteur concentré dans les starting-blocks, juste avant le départ." width="1400" height="933">
      <div class="landing__veil"></div>
      ${trackCurves('landing__curves')}
      <div class="landing__hero-copy">
        <p class="eyebrow eyebrow--ice">Préparation mentale · Sportifs</p>
        <h1 class="landing__title" id="landing-title">La tête<br>aussi<br><em>s’entraîne.</em></h1>
        <p class="landing__baseline">Le mental fait la différence.</p>
      </div>
    </section>

    <section class="landing__panel">
      <p class="landing__lede">Découvre tes quatre ressources mentales en compétition. Un premier regard sur ta façon de gérer la pression, de rester engagé, de te concentrer et de croire en toi.</p>

      <div class="landing__actions">
        <button class="btn btn--primary btn--xl" data-action="${primary.action}" type="button">
          <span class="btn__copy">
            <span class="btn__label">${primary.label}</span>
            <span class="btn__meta">${primary.meta}</span>
          </span>
          <span class="btn__icon">${icon('arrowRight', { size: 20 })}</span>
        </button>
        <button class="btn btn--outline btn--xl" data-action="explore-demo" type="button">
          <span class="btn__copy">
            <span class="btn__label">Explorer la démo</span>
            <span class="btn__meta">Profil d’exemple de ${active.firstName}</span>
          </span>
          <span class="btn__icon">${icon('chevronRight', { size: 20 })}</span>
        </button>
      </div>

      <div class="fourc-strip" aria-label="Les quatre dimensions du profil 4C">
        ${[
          ['01', 'Calme'],
          ['02', 'Combativité'],
          ['03', 'Concentration'],
          ['04', 'Confiance'],
        ]
          .map(
            ([index, label]) => `<span class="fourc-strip__item"><b>${index}</b>${label}</span>`,
          )
          .join('')}
      </div>

      <div class="landing__demo">
        <div class="landing__demo-copy">
          <span class="pill pill--demo">Démo</span>
          <p>Comptes, scores et historiques <strong>simulés</strong>. Aucune donnée réelle, aucun email demandé.</p>
        </div>
        <div class="landing__demo-links">
          <a class="text-link" href="#/coach">Ouvrir l’espace Aga ${icon('arrowRight', { size: 14 })}</a>
          <button class="text-link text-link--muted" data-action="reset-demo" type="button">Réinitialiser</button>
        </div>
      </div>

      <footer class="landing__footer">
        <p class="landing__signature">
          <img src="assets/img/om-mark.webp" alt="" width="22" height="22">
          <span>Un produit <strong>Optima Mind</strong> · Wavre, Belgique</span>
        </p>
        <a class="site-link site-link--footer" href="${siteUrl}" target="_blank" rel="noopener noreferrer">
          Retour à optima-mind.com ${icon('external', { size: 13 })}
        </a>
        <p class="fineprint">Photos : Unsplash (licence Unsplash) · Nay Nyo / Pexels · séance Optima Mind. Logotype O’MIND provisoire, en attente du fichier final.${config.paletteNote ? ` ${escapeHTML(config.paletteNote)}` : ''}</p>
      </footer>
    </section>
  </div>`;
}
