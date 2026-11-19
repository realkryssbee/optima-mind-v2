import { escapeHTML } from '../utils.js';
import { icon } from '../ui/icons.js';
import {
  feedbackLabel,
  feedbackTone,
  routineItems,
  routineMomentLabel,
  routineOrigin,
} from '../ui/carnet.js';

function routineCard(routine) {
  return `<article class="routine-card routine-card--full">
    <div class="routine-card__top">
      <span class="routine-origin">${routineOrigin(routine)}</span>
      <span class="status ${routine.status === 'tried' ? 'status--success' : 'status--info'}">${routine.status === 'tried' ? 'Essayée' : 'Nouvelle'}</span>
    </div>
    <h2>${escapeHTML(routine.title)}</h2>
    ${routine.instruction ? `<p class="routine-instruction">« ${escapeHTML(routine.instruction)} »</p>` : ''}
    <p class="routine-meta">${routine.steps.length} étapes · ${routineMomentLabel(routine.moment)}</p>
    <div class="routine-card__actions">
      <button class="btn btn--primary btn--small" data-action="open-routine" data-kind="${routine.kind}" data-id="${routine.id}" type="button">
        Reprendre ${icon('play', { size: 14 })}
      </button>
      ${routine.feedback
        ? `<span class="feedback-chip feedback-chip--${feedbackTone(routine.feedback.helpfulness)}">${feedbackLabel(routine.feedback.helpfulness)}${routine.feedback.shared ? ' · partagé' : ''}</span>`
        : `<span class="fineprint">Pas encore essayée</span>`}
    </div>
  </article>`;
}

export function routinesView({ athlete }) {
  const items = routineItems(athlete);
  const fromAga = items.filter((item) => item.kind === 'assignment');
  const mine = items.filter((item) => item.kind === 'custom');

  return `<div class="carnet-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/carnet" aria-label="Retour au carnet">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">Mes routines</span>
      <span class="flowbar__right">${items.length} routine${items.length > 1 ? 's' : ''}</span>
    </header>
    <main class="carnet-body">
      <section class="routines-intro">
        <p class="eyebrow">Ce que tu essaies</p>
        <h1 class="display display--page" id="view-title">Mes routines</h1>
        <p class="section-lede">Des routines courtes, à reprendre avant un entraînement ou une compétition. Tu peux dire ce que ça a changé, ou que ça n’a pas marché cette fois.</p>
        <button class="btn btn--primary btn--block" data-action="open-create-routine" data-athlete="${athlete.id}" type="button">
          ${icon('plus', { size: 17 })} Créer ma routine
        </button>
      </section>

      <section class="carnet-section" aria-labelledby="from-aga-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Proposées par Aga</p>
            <h2 class="display display--sm" id="from-aga-title">Ce qu’elle te confie</h2>
          </div>
        </div>
        ${fromAga.length
          ? `<div class="routine-list">${fromAga.map(routineCard).join('')}</div>`
          : `<div class="empty empty--light">
              <span class="empty__icon">${icon('users', { size: 22 })}</span>
              <p class="empty__title">Aucune routine d’Aga pour l’instant</p>
              <p class="empty__text">Elle peut t’en proposer une depuis ta fiche, avec une consigne personnalisée.</p>
            </div>`}
      </section>

      <section class="carnet-section" aria-labelledby="mine-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Créées par toi</p>
            <h2 class="display display--sm" id="mine-title">Mes routines</h2>
          </div>
        </div>
        ${mine.length
          ? `<div class="routine-list">${mine.map(routineCard).join('')}</div>`
          : `<div class="empty empty--light">
              <span class="empty__icon">${icon('target', { size: 22 })}</span>
              <p class="empty__title">Crée ta première routine</p>
              <p class="empty__text">Trois étapes suffisent. Elle t’appartiendra et ne sera pas visible par Aga.</p>
              <button class="btn btn--outline btn--small" data-action="open-create-routine" data-athlete="${athlete.id}" type="button">Créer ma routine</button>
            </div>`}
      </section>

      <p class="privacy-note privacy-note--compact">${icon('lock', { size: 16 })} <span>Les routines que tu crées restent privées. Aga voit seulement celles qu’elle t’a assignées et, si tu partages ton retour, ce que tu en dis.</span></p>
    </main>
  </div>`;
}
