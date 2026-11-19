import { STATUS, getResource } from '../data.js';
import { icon } from '../ui/icons.js';
import { sharedResourceCard, statusChip, tabbar } from '../ui/components.js';
import { checkinChart } from '../ui/charts.js';
import { capitalize, dateTimeNowLabel, escapeHTML, formatDate } from '../utils.js';

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
  const session = [...(athlete.sessions ?? [])].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  )[0] ?? null;
  const sessionResources = (session?.resourceIds ?? []).map(getResource).filter(Boolean);

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
      ${isSaved
        ? `<div class="saved-banner" role="status">
            <span class="saved-banner__check">${icon('check', { size: 16 })}</span>
            <div>
              <p>Bilan enregistré${checkin.savedAt ? ` à ${formatTime(checkin.savedAt)}` : ''}</p>
              <small>Ton suivi a été mis à jour ci-dessous.</small>
            </div>
          </div>`
        : ''}

      ${session
        ? `<section class="session-recap" aria-labelledby="session-recap-title">
            <div class="session-recap__head">
              <p class="eyebrow">Après ta séance</p>
              <span class="pill pill--soft">Partagé par Aga</span>
            </div>
            <h2 class="display display--sm" id="session-recap-title">Après ta séance du ${formatDate(session.date, { day: 'numeric', month: 'long' })}</h2>
            ${session.nextSteps ? `<p class="session-recap__steps">${escapeHTML(session.nextSteps)}</p>` : ''}
            ${sessionResources.length
              ? `<div class="session-recap__resources">
                  ${sessionResources
                    .map(
                      (resource) => `<button class="session-resource" type="button" data-action="open-resource" data-resource="${resource.id}">
                        <span class="session-resource__icon">${icon(resource.category === 'Vidéo' ? 'video' : resource.category === 'Respiration' ? 'wind' : 'target', { size: 17 })}</span>
                        <span><strong>${escapeHTML(resource.title)}</strong><small>${escapeHTML(resource.kind)}</small></span>
                        ${icon('chevronRight', { size: 15 })}
                      </button>`,
                    )
                    .join('')}
                </div>`
              : ''}
          </section>`
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
            <p class="eyebrow">Suivi quotidien</p>
            <h2 class="display display--sm" id="tracking-title">Ton suivi</h2>
          </div>
          <span class="pill pill--outline">Fictif</span>
        </div>
        ${checkinChart(athlete.checkins)}
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
            <span class="program-card__eyebrow">${assignment?.testName ?? 'Questionnaire 4C'}</span>
            <strong>${assignment ? STATUS[assignmentStatus]?.label ?? 'Attribué' : 'À découvrir'}</strong>
            <small>${assignment
              ? assignment.message
                ? `« ${escapeHTML(assignment.message)} »`
                : 'Attribué par Aga'
              : 'Aucun questionnaire attribué pour le moment'}</small>
            ${assignment?.message ? '<span class="program-card__from">Mot d’Aga</span>' : ''}
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

