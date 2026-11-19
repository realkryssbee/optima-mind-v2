import { STATUS, getResource } from '../data.js';
import { icon } from '../ui/icons.js';
import {
  sharedResourceCard,
  statusChip,
  tabbar,
  trackingChart,
} from '../ui/components.js';
import {
  latestRoutine,
  routineOrigin,
  unansweredQuestion,
} from '../ui/carnet.js';
import { capitalize, dateTimeNowLabel } from '../utils.js';

const SLIDERS = [
  { key: 'mood', label: 'Humeur', hint: 'Ton état émotionnel général' },
  { key: 'energy', label: 'Énergie', hint: 'Ta forme physique du moment' },
  { key: 'sleep', label: 'Sommeil', hint: 'La qualité de ta nuit' },
];

function formatTime(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('fr-BE', { hour: '2-digit', minute: '2-digit' }).format(
    new Date(iso),
  );
}

function homeCarnet(athlete) {
  const goal = athlete.carnet.goal;
  const question = unansweredQuestion(athlete);
  return `<section class="home-carnet" aria-labelledby="home-carnet-title">
    <div class="home-carnet__head">
      <div>
        <p class="eyebrow">Mon carnet</p>
        <h2 class="display display--sm" id="home-carnet-title">${goal ? 'Ton fil rouge' : 'Ton espace à toi'}</h2>
      </div>
      <a class="text-link text-link--small" href="#/carnet">Ouvrir ${icon('arrowRight', { size: 14 })}</a>
    </div>
    ${goal
      ? `<p class="home-carnet__goal">« ${goal.text} »</p>
        <div class="home-carnet__actions">
          <a class="btn btn--primary btn--small" href="#/carnet/nouveau?type=session&new=1">${icon('plus', { size: 15 })} Ajouter une séance</a>
          <a class="btn btn--outline btn--small" href="#/carnet">Voir mes entrées</a>
        </div>`
      : `<p class="home-carnet__goal home-carnet__goal--empty">Et si on commençait par ton objectif ? Une phrase suffit, et tu pourras la changer.</p>
        <a class="btn btn--primary btn--block" href="#/carnet">Formuler mon objectif ${icon('arrowRight', { size: 16 })}</a>`}
    ${question
      ? `<button class="home-question" data-action="open-question" data-entry="${question.id}" type="button">
          <span class="home-question__icon">${icon('quote', { size: 16 })}</span>
          <span><small>Après ta séance</small><strong>${question.question}</strong></span>
          ${icon('chevronRight', { size: 16 })}
        </button>`
      : ''}
  </section>`;
}

function homeRoutine(athlete) {
  const routine = latestRoutine(athlete);
  if (!routine) {
    return `<section class="home-routine home-routine--empty">
      <div><p class="eyebrow">Ta routine</p><h2 class="display display--sm">Aucune routine pour l’instant</h2></div>
      <a class="text-link text-link--small" href="#/carnet/routines">Créer ${icon('plus', { size: 14 })}</a>
    </section>`;
  }
  return `<section class="home-routine" aria-labelledby="home-routine-title">
    <div class="home-routine__top">
      <span class="routine-origin">${routineOrigin(routine)}</span>
      <span class="fineprint">${routine.steps.length} étapes</span>
    </div>
    <h2 class="display display--sm" id="home-routine-title">${routine.title}</h2>
    <div class="home-routine__actions">
      <button class="btn btn--primary btn--small" data-action="open-routine" data-kind="${routine.kind}" data-id="${routine.id}" type="button">${icon('play', { size: 14 })} Reprendre</button>
      <a class="text-link text-link--small" href="#/carnet/routines">Mes routines</a>
    </div>
  </section>`;
}

export function todayView({ athlete, checkin, latestShare }) {
  const assignment = athlete.assignment;
  const profile = athlete.profile;
  const values = {
    mood: checkin?.mood ?? 7,
    energy: checkin?.energy ?? 6,
    sleep: checkin?.sleep ?? 8,
  };
  const word = checkin?.word ?? '';
  const isSaved = Boolean(checkin);
  const assignmentStatus = assignment?.status ?? null;
  const shared = latestShare ? getResource(latestShare.resourceId) : null;

  return `<div class="today">
    <section class="today-hero" aria-labelledby="view-title">
      <img class="today-hero__img" src="assets/img/today-focus.webp" alt="Sportive concentrée avant l’entraînement, sur une piste d’athlétisme bleue." width="1200" height="1598">
      <div class="today-hero__veil"></div>
      <div class="today-hero__top">
        <span class="widget-wordmark">O’MIND</span>
        <a class="today-hero__avatar" href="#/espace/profil" aria-label="Ouvrir mon profil">${athlete.initials}</a>
      </div>
      <div class="today-hero__copy">
        <p class="eyebrow eyebrow--ice">Aujourd’hui · ${capitalize(dateTimeNowLabel())}</p>
        <h1 class="display display--today" id="view-title">Ton bilan<br>du jour</h1>
        <p class="today-hero__name">${athlete.firstName} · ${athlete.sport}</p>
      </div>
    </section>

    <div class="today__body">
      ${homeCarnet(athlete)}
      ${homeRoutine(athlete)}

      ${isSaved
        ? `<div class="saved-banner" role="status">
            <span class="saved-banner__check">${icon('check', { size: 16 })}</span>
            <div>
              <p>Bilan enregistré${checkin.savedAt ? ` à ${formatTime(checkin.savedAt)}` : ''}</p>
              <small>Ton suivi a été mis à jour ci-dessous.</small>
            </div>
          </div>`
        : ''}

      <section class="checkin" aria-labelledby="checkin-title">
        <div class="checkin__head">
          <div>
            <p class="eyebrow">Check-in du jour</p>
            <h2 class="display display--sm" id="checkin-title">Comment tu te sens&nbsp;?</h2>
          </div>
          <span class="pill pill--soft">${isSaved ? 'Modifiable' : '1 → 10'}</span>
        </div>

        <div class="sliders">
          ${SLIDERS.map((slider) => {
            const value = values[slider.key];
            return `<div class="slider-row">
              <div class="slider-row__head">
                <label for="slider-${slider.key}">${slider.label}</label>
                <output class="slider-row__value" id="value-${slider.key}" for="slider-${slider.key}">${value} <small>/ 10</small></output>
              </div>
              <input class="range" type="range" id="slider-${slider.key}" min="1" max="10" step="1" value="${value}" data-slider="${slider.key}" style="--value:${((value - 1) / 9) * 100}%" aria-describedby="hint-${slider.key}" aria-valuetext="${value} sur 10">
              <span class="slider-row__hint" id="hint-${slider.key}">${slider.hint}</span>
            </div>`;
          }).join('')}
        </div>

        <label class="field" for="day-word">
          <span class="field__label">Un mot sur ta journée <em>facultatif</em></span>
          <input class="field__input" id="day-word" name="day-word" type="text" maxlength="28" placeholder="Ex. concentrée" value="${word}" autocomplete="off">
        </label>

        <button class="btn btn--primary btn--block btn--lg" data-action="save-checkin" type="button">
          ${isSaved ? 'Mettre à jour mon bilan' : 'Enregistrer mon bilan'}
          ${icon('check', { size: 19 })}
        </button>
        <p class="fineprint fineprint--center">Enregistré localement dans cette démo. Aucune donnée n’est envoyée.</p>
      </section>

      <section class="tracking" aria-labelledby="tracking-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">7 derniers jours</p>
            <h2 class="display display--sm" id="tracking-title">Ton suivi</h2>
          </div>
          <span class="pill pill--outline">Historique fictif</span>
        </div>
        ${trackingChart(athlete.checkins)}
        <p class="fineprint">Les six jours précédents sont simulés. Ton bilan du jour est ajouté localement dès l’enregistrement.</p>
      </section>

      <section class="program" aria-labelledby="program-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Ton programme</p>
            <h2 class="display display--sm" id="program-title">Ce qu’Aga te propose</h2>
          </div>
        </div>

        <div class="program-card">
          <span class="program-card__icon">${icon('clipboard', { size: 20 })}</span>
          <div class="program-card__copy">
            <span class="program-card__eyebrow">Questionnaire 4C</span>
            <strong>${assignment ? STATUS[assignmentStatus]?.label ?? 'Attribué' : 'À découvrir'}</strong>
            <small>${assignment ? 'Attribué par Aga' : 'Aucun questionnaire attribué pour le moment'}</small>
          </div>
          ${assignmentStatus === 'completed' && profile
            ? `<a class="program-card__action" href="#/resultat">Voir mon profil</a>`
            : `<button class="program-card__action" data-action="start-test" type="button">${assignmentStatus === 'in_progress' ? 'Reprendre' : 'Commencer'}</button>`}
        </div>

        ${shared
          ? sharedResourceCard({ resourceId: shared.id }, {})
          : `<div class="program-empty">
              <span>${icon('layers', { size: 20 })}</span>
              <p>Aucune ressource partagée pour l’instant. Explore la bibliothèque d’Aga.</p>
              <a class="text-link" href="#/espace/ressources">Voir les ressources ${icon('arrowRight', { size: 14 })}</a>
            </div>`}
      </section>
    </div>

    ${tabbar('today')}
  </div>`;
}

