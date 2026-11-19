import { DIMENSIONS, ROUTINE_FEEDBACK, ROUTINE_LIBRARY, getResource, RESOURCES, getEntryType } from '../data.js';
import { formatScore } from '../scoring.js';
import { escapeHTML, formatDate } from '../utils.js';
import { icon } from './icons.js';
import { avatar, resourceIcon, resourceOptions } from './components.js';
import { entryDateLabel, feedbackLabel, routineOrigin } from './carnet.js';
import { athleteSwitcher } from './coachSwitcher.js';

function meta(resource) {
  return `${resource.kind} · ${resource.duration} · avec Aga`;
}

function breathingBody(resource) {
  return `<div class="sheet-intro">
      <p class="sheet-meta">${meta(resource)}</p>
      <p>${resource.intro}</p>
    </div>
    <div class="breath" data-breath>
      <div class="breath__circle" data-breath-circle style="--progress:0">
        <div class="breath__inner">
          <span class="breath__phase" data-breath-phase>Prêt&nbsp;?</span>
          <span class="breath__count" data-breath-count>4 · 2 · 6</span>
        </div>
      </div>
      <p class="breath__hint" data-breath-hint>Inspire 4 s, retiens 2 s, expire 6 s.</p>
      <div class="breath__controls">
        <button class="btn btn--primary" data-action="breath-toggle" type="button">
          <span data-breath-label>Commencer</span>
        </button>
        <span class="breath__cycles" data-breath-cycles>0 / 4 cycles</span>
      </div>
      <p class="breath__live sr-only" aria-live="polite" data-breath-live></p>
    </div>
    <p class="sheet-note">${resource.after}</p>
    <div class="sheet-actions">
      <button class="btn btn--outline btn--block" data-action="mark-resource" data-resource="${resource.id}" type="button">
        ${icon('check', { size: 17 })} Marquer comme faite
      </button>
    </div>`;
}

function routineBody(resource, done) {
  return `<div class="sheet-intro">
      <p class="sheet-meta">${meta(resource)}</p>
      <p>${resource.intro}</p>
    </div>
    <ol class="routine-steps">
      ${resource.steps
        .map(
          (step, index) => `<li class="routine-step">
            <label>
              <input type="checkbox" class="routine-step__check">
              <span class="routine-step__bullet">${String(index + 1).padStart(2, '0')}</span>
              <span class="routine-step__copy">
                <strong>${step.title}</strong>
                <span>${step.text}</span>
              </span>
            </label>
          </li>`,
        )
        .join('')}
    </ol>
    <p class="sheet-note">${resource.after}</p>
    <div class="sheet-actions">
      <button class="btn ${done ? 'btn--soft' : 'btn--outline'} btn--block" data-action="mark-resource" data-resource="${resource.id}" type="button" ${done ? 'disabled' : ''}>
        ${done ? `${icon('check', { size: 17 })} Routine déjà marquée` : `${icon('check', { size: 17 })} Marquer comme faite`}
      </button>
    </div>`;
}

function videoBody(resource) {
  return `<div class="video-preview">
      <img src="assets/img/video-session.webp" alt="Séance de préparation mentale filmée avec un groupe de sportifs." width="960" height="720">
      <button class="video-preview__play" data-action="video-toggle" type="button" aria-label="Lire l’aperçu vidéo (simulation)">
        ${icon('play', { size: 22 })}
      </button>
      <span class="video-preview__badge">Aperçu de démonstration</span>
      <div class="video-preview__bar"><span data-video-progress></span></div>
    </div>
    <p class="sheet-meta sheet-meta--tight">${meta(resource)}</p>
    <p class="sheet-intro__text">${resource.intro}</p>
    <ul class="bullets">
      ${resource.bullets.map((bullet) => `<li>${icon('check', { size: 15 })}${bullet}</li>`).join('')}
    </ul>
    <p class="sheet-note">${resource.after}</p>
    <div class="sheet-actions">
      <button class="btn btn--outline btn--block" data-action="mark-resource" data-resource="${resource.id}" type="button">
        ${icon('check', { size: 17 })} Marquer comme vue
      </button>
    </div>`;
}

export function resourceSheet(resourceId, { done = false } = {}) {
  const resource = getResource(resourceId);
  if (!resource) return null;
  let body;
  if (resource.id === 'respiration') body = breathingBody(resource);
  else if (resource.id === 'recentrage') body = routineBody(resource, done);
  else body = videoBody(resource);

  return {
    variant: 'sheet',
    eyebrow: `Ressource · ${resource.kind}`,
    title: resource.title,
    body,
    resourceId,
  };
}

export function exchangeSheet(profile) {
  const config = window.OMIND_CONFIG ?? {};
  const email = config.contactEmail ?? 'aga@optima-mind.com';
  const bookingUrl = config.bookingUrl ?? '';
  const summary = profile
    ? DIMENSIONS.map(
        (dimension) => `${dimension.name} ${formatScore(profile.scores[dimension.key])}/5`,
      ).join(' · ')
    : 'Profil 4C non complété';

  return {
    variant: 'sheet',
    eyebrow: 'Ton profil, avec Aga',
    title: 'Échanger avec Aga',
    body: `<p class="sheet-intro__text">Un résultat se lit mieux à deux. Tu peux écrire à Aga pour revenir sur ce qui ressort de ton profil, sans engagement.</p>
      <div class="profile-summary">
        <p class="eyebrow">Ton profil 4C</p>
        <p class="profile-summary__scores">${summary}</p>
      </div>
      <div class="contact-list">
        <a class="contact-option" href="mailto:${email}?subject=${encodeURIComponent('Mon profil 4C O’MIND')}">
          <span class="contact-option__icon">${icon('mail', { size: 19 })}</span>
          <span class="contact-option__copy">
            <strong>Écrire à Aga</strong>
            <small>${email}</small>
          </span>
          ${icon('arrowUpRight', { size: 16 })}
        </a>
        ${bookingUrl
          ? `<a class="contact-option" href="${bookingUrl}" target="_blank" rel="noopener noreferrer">
              <span class="contact-option__icon">${icon('calendar', { size: 19 })}</span>
              <span class="contact-option__copy"><strong>Réserver un créneau</strong><small>Agenda Cal.com</small></span>
              ${icon('arrowUpRight', { size: 16 })}
            </a>`
          : `<div class="contact-option is-disabled">
              <span class="contact-option__icon">${icon('calendar', { size: 19 })}</span>
              <span class="contact-option__copy"><strong>Réserver un créneau</strong><small>Agenda bientôt disponible dans cette démo</small></span>
              <span class="pill pill--soon">Bientôt</span>
            </div>`}
      </div>
      <button class="btn btn--outline btn--block" data-action="copy-summary" type="button">
        ${icon('clipboard', { size: 16 })} Copier le résumé de mon profil
      </button>
      <p class="fineprint">Démo : ce bouton n’enregistre aucun rendez-vous et n’envoie aucun email automatiquement. L’adresse aga@optima-mind.com est celle publiée sur le site Optima Mind.</p>`,
  };
}

export function shareSheet(athlete, selectedId = null) {
  return {
    variant: 'panel',
    eyebrow: athlete.name,
    title: 'Partager une ressource',
    body: `<p class="sheet-intro__text">Choisis dans ta bibliothèque.</p>
      <form class="share-form" data-share-form data-athlete="${athlete.id}">
        <div class="choice-list" role="radiogroup" aria-label="Ressource à partager">
          ${resourceOptions(selectedId)}
        </div>
        <label class="field" for="share-message">
          <span class="field__label">Un mot pour ${escapeHTML(athlete.firstName)} <em>facultatif</em></span>
          <textarea class="field__input field__input--area" id="share-message" name="message" rows="3" maxlength="160" placeholder="Ex. À tester avant ta prochaine compétition."></textarea>
        </label>
        <button class="btn btn--primary btn--block btn--lg" type="submit">
          Partager avec ${escapeHTML(athlete.firstName)}
          ${icon('send', { size: 18 })}
        </button>
      </form>
      <p class="sheet-note">La ressource apparaîtra dans l’espace sportif de ${escapeHTML(athlete.firstName)}, onglet Ressources.</p>
      <p class="fineprint">Démo : aucun email ni notification n’est envoyé.</p>`,
  };
}

export function resetSheet() {
  return {
    variant: 'sheet',
    eyebrow: 'Mode démo',
    title: 'Réinitialiser la démo ?',
    body: `<p class="sheet-intro__text">Les profils d’exemple, les carnets, les routines, les documents et les bilans fictifs seront restaurés. Le test en cours sera effacé.</p>
      <div class="reset-actions">
        <button class="btn btn--danger btn--block btn--lg" data-action="reset-confirm" type="button">Réinitialiser la démo</button>
        <button class="btn btn--ghost btn--block" data-action="close-sheet" type="button">Annuler</button>
      </div>
      <p class="fineprint">Les données de démonstration sont stockées uniquement dans le navigateur (localStorage).</p>`,
  };
}

export function resourcesForCoach() {
  return RESOURCES;
}

/* ------------------------------------------------------------------ */
/* Carnet                                                              */
/* ------------------------------------------------------------------ */

function findRoutine(athlete, kind, id) {
  if (kind === 'assignment') {
    return (athlete.routineAssignments ?? []).find((item) => item.id === id) ?? null;
  }
  return (athlete.customRoutines ?? []).find((item) => item.id === id) ?? null;
}

export function routineSheet({ athlete, kind, id }) {
  const routine = findRoutine(athlete, kind, id);
  if (!routine) return null;
  const feedback = kind === 'assignment' ? routine.feedback : routine.lastFeedback;
  const tried = Boolean(feedback);
  const origin = routineOrigin({ kind, collectiveName: routine.collectiveName });

  return {
    variant: 'sheet',
    eyebrow: kind === 'assignment' ? 'Routine proposée par Aga' : 'Ma routine',
    title: routine.title,
    body: `<div class="routine-player">
      <p class="sheet-meta">${origin} · ${routine.steps.length} étapes</p>
      ${routine.instruction ? `<div class="coach-instruction">${icon('message', { size: 16 })}<p><strong>La consigne d’Aga</strong>« ${escapeHTML(routine.instruction)} »</p></div>` : ''}
      <ol class="routine-player__steps">
        ${routine.steps
          .map(
            (step, index) => `<li>
              <span class="routine-player__num">${String(index + 1).padStart(2, '0')}</span>
              <div><strong>${escapeHTML(step.title)}</strong><p>${escapeHTML(step.text)}</p></div>
            </li>`,
          )
          .join('')}
      </ol>
      <div class="routine-feedback">
        <div class="routine-feedback__summary" ${tried ? '' : 'hidden'} data-feedback-summary>
          <p class="eyebrow">Ton retour</p>
          <p class="routine-feedback__value"><strong>${feedback ? feedbackLabel(feedback.helpfulness) : ''}</strong> <span>${feedback?.shared ? '· partagé avec Aga' : '· privé'}</span></p>
          ${feedback?.comment ? `<p class="routine-feedback__comment">« ${escapeHTML(feedback.comment)} »</p>` : ''}
          <button class="text-link text-link--small" data-action="routine-try" type="button">Modifier mon retour</button>
        </div>
        <button class="btn btn--primary btn--block" data-action="routine-try" type="button" ${tried ? 'hidden' : ''} data-feedback-open>Je l’ai essayée ${icon('check', { size: 17 })}</button>
        <form class="feedback-form" data-routine-feedback-form data-kind="${kind}" data-id="${routine.id}" ${tried ? '' : 'hidden'} data-feedback-form>
          <p class="feedback-form__title">Qu’est-ce que ça a donné&nbsp;?</p>
          <div class="feedback-options" role="radiogroup" aria-label="Effet de la routine">
            ${ROUTINE_FEEDBACK.map(
              (option) => `<label class="feedback-option ${feedback?.helpfulness === option.key ? 'is-selected' : ''}">
                <input type="radio" name="helpfulness" value="${option.key}" ${feedback?.helpfulness === option.key ? 'checked' : ''} required>
                <span class="feedback-option__dot feedback-option__dot--${option.tone}"></span>
                <span>${option.label}</span>
              </label>`,
            ).join('')}
          </div>
          <label class="field" for="feedback-comment">
            <span class="field__label">Un commentaire <em>facultatif</em></span>
            <textarea class="field__input field__input--area" id="feedback-comment" name="comment" rows="3" maxlength="240" placeholder="Ce qui a changé, ou ce qui n’a pas marché…">${escapeHTML(feedback?.comment ?? '')}</textarea>
          </label>
          <label class="share-toggle">
            <input type="checkbox" name="shared" ${feedback?.shared ? 'checked' : ''}>
            <span class="share-toggle__ui" aria-hidden="true"></span>
            <span><strong>Partager mon retour avec Aga</strong><small>Sinon, elle voit seulement que tu l’as essayée.</small></span>
          </label>
          <button class="btn btn--primary btn--block" type="submit">Enregistrer mon retour</button>
          <p class="fineprint">Ton retour reste privé par défaut. Tu peux changer d’avis à tout moment.</p>
        </form>
      </div>
    </div>`,
  };
}

export function createRoutineSheet() {
  return {
    variant: 'sheet',
    eyebrow: 'Ma routine',
    title: 'Créer une routine courte',
    body: `<form class="routine-form" data-routine-form>
      <p class="sheet-intro__text">Trois étapes maximum pour t’aider à te préparer ou à revenir dans l’action. Elle reste privée.</p>
      <label class="field" for="routine-title">
        <span class="field__label">Nom de la routine</span>
        <input class="field__input" id="routine-title" name="title" type="text" maxlength="80" required placeholder="Ex. Mon ancrage avant match">
      </label>
      <fieldset class="moment-choice">
        <legend>Quand l’utiliser ?</legend>
        <label><input type="radio" name="moment" value="training" checked> Entraînement</label>
        <label><input type="radio" name="moment" value="competition"> Compétition</label>
      </fieldset>
      <div class="routine-form__steps">
        ${[1, 2, 3]
          .map(
            (index) => `<fieldset class="routine-form__step">
              <legend>Étape ${index} ${index > 1 ? '<em>facultatif</em>' : ''}</legend>
              <input class="field__input" name="step-title-${index}" type="text" maxlength="50" placeholder="Ex. Respire" ${index === 1 ? 'required' : ''}>
              <textarea class="field__input field__input--area" name="step-text-${index}" rows="2" maxlength="240" placeholder="Ce que tu fais, en une phrase."></textarea>
            </fieldset>`,
          )
          .join('')}
      </div>
      <button class="btn btn--primary btn--block btn--lg" type="submit">Créer ma routine ${icon('check', { size: 17 })}</button>
      <p class="fineprint">Tu pourras la reprendre depuis l’accueil, sans repasser par le carnet.</p>
    </form>`,
  };
}

export function questionSheet({ athlete, entryId }) {
  const entry = athlete.carnet.entries.find((item) => item.id === entryId);
  if (!entry) return null;
  return {
    variant: 'sheet',
    eyebrow: `Après ta séance · ${entryDateLabel(entry.date)}`,
    title: 'Une question pour aller plus loin',
    body: `<form class="question-form" data-question-form data-entry="${entry.id}">
      <p class="question-form__question">« ${escapeHTML(entry.question)} »</p>
      <label class="field" for="question-answer">
        <span class="field__label">Ta réponse <em>facultatif</em></span>
        <textarea class="field__input field__input--area" id="question-answer" name="answer" rows="4" maxlength="200" placeholder="Une phrase suffit.">${escapeHTML(entry.answer ?? '')}</textarea>
      </label>
      <button class="btn btn--primary btn--block btn--lg" type="submit">Enregistrer ma réponse ${icon('check', { size: 17 })}</button>
      <p class="fineprint">200 caractères. Cette réponse reste privée tant que tu ne partages pas l’entrée.</p>
    </form>`,
  };
}

export function activityCommentSheet({ athlete, activityId }) {
  const activity = athlete.activities.find((item) => item.id === activityId);
  if (!activity) return null;
  return {
    variant: 'sheet',
    eyebrow: `Activité · ${entryDateLabel(activity.date)}`,
    title: activity.activity,
    body: `<form class="activity-comment-form" data-activity-comment-form data-activity="${activity.id}">
      <p class="sheet-intro__text">Ton commentaire apparaît avec l’activité dans ton carnet. Il reste privé tant que tu ne partages pas l’activité.</p>
      <label class="field" for="activity-comment">
        <span class="field__label">Mon commentaire <em>facultatif</em></span>
        <textarea class="field__input field__input--area" id="activity-comment" name="comment" rows="4" maxlength="400" placeholder="Ce que tu retiens de cette activité…">${escapeHTML(activity.comment ?? '')}</textarea>
      </label>
      <button class="btn btn--primary btn--block btn--lg" type="submit">Enregistrer ${icon('check', { size: 17 })}</button>
    </form>`,
  };
}

export function deleteEntrySheet({ athlete, entryId }) {
  const entry = athlete.carnet.entries.find((item) => item.id === entryId);
  if (!entry) return null;
  return {
    variant: 'sheet',
    eyebrow: 'Mon carnet',
    title: 'Supprimer cette entrée ?',
    body: `<p class="sheet-intro__text">« ${escapeHTML(entry.title || getEntryType(entry.type).label)} » sera supprimée de ton carnet. Cette action est définitive dans la démo.</p>
      <div class="reset-actions">
        <button class="btn btn--danger btn--block" data-action="confirm-delete-entry" data-entry="${entry.id}" type="button">Supprimer l’entrée</button>
        <button class="btn btn--ghost btn--block" data-action="close-sheet" type="button">Annuler</button>
      </div>`,
  };
}

export function documentSheet({ doc, athlete, as = 'coach' }) {
  if (!doc) return null;
  const latest = doc.versions[doc.versions.length - 1];
  const shared = doc.sharedVersion;
  const version = as === 'coach' ? shared ?? latest.version : shared ?? 1;
  const size = latest.size ? `${(latest.size / 1024).toFixed(0)} Ko` : '';

  return {
    variant: 'sheet',
    eyebrow: `Document · ${athlete.name}`,
    title: doc.name,
    body: `<div class="document-preview">
      <span class="document-icon document-icon--lg" aria-hidden="true">PDF</span>
      <div>
        <p class="document-preview__title">${escapeHTML(doc.name)}</p>
        <p class="document-preview__meta">${formatDate(doc.date, { day: 'numeric', month: 'long', year: 'numeric' })}${size ? ` · ${size}` : ''}</p>
        <p class="document-preview__meta">Rattaché à ${escapeHTML(athlete.name)}</p>
      </div>
      <span class="document-status document-status--${shared != null ? 'shared' : 'draft'}">${shared != null ? `Partagé · v${shared}` : 'Brouillon'}</span>
    </div>
    <div class="document-preview__actions">
      <button class="btn btn--primary btn--small" data-action="open-document" data-doc="${doc.id}" data-version="${version}" data-as="${as}" type="button">${icon('external', { size: 14 })} Ouvrir l’aperçu</button>
      <button class="btn btn--outline btn--small" data-action="download-document" data-doc="${doc.id}" data-version="${version}" data-as="${as}" type="button">Télécharger</button>
    </div>
    ${as === 'coach'
      ? `<form class="document-form" data-document-form data-doc="${doc.id}">
          <label class="field" for="doc-name">
            <span class="field__label">Nom du document</span>
            <input class="field__input" id="doc-name" name="name" type="text" maxlength="90" value="${escapeHTML(doc.name)}">
          </label>
          <label class="field" for="doc-date">
            <span class="field__label">Date du document</span>
            <input class="field__input" id="doc-date" name="date" type="date" value="${doc.date}">
          </label>
          <button class="btn btn--outline btn--block btn--small" type="submit">Enregistrer les informations</button>
        </form>
        <div class="document-share-row">
          <div>
            <strong>Visibilité</strong>
            <p>${shared != null ? `Partagé avec ${escapeHTML(athlete.firstName)} · version ${shared}` : `Privé — ${escapeHTML(athlete.firstName)} ne le voit pas.`}</p>
          </div>
          <button class="btn ${shared != null ? 'btn--ghost' : 'btn--primary'} btn--small" data-action="toggle-document-share" data-doc="${doc.id}" data-athlete="${athlete.id}" data-shared="${shared != null}" data-as="${as}" type="button">${shared != null ? 'Ne plus partager' : `Partager avec ${escapeHTML(athlete.firstName)}`}</button>
        </div>
        <div class="document-history">
          <p class="eyebrow">Versions</p>
          <ul>${doc.versions
            .map(
              (item) => `<li>
                <div><strong>Version ${item.version}${item.version === shared ? ' · partagée' : ''}</strong><small>${formatDate(item.uploadedAt, { day: 'numeric', month: 'short' })}${item.size ? ` · ${(item.size / 1024).toFixed(0)} Ko` : ''}</small></div>
                <div>
                  <button class="text-link text-link--small" data-action="open-document" data-doc="${doc.id}" data-version="${item.version}" data-as="coach" type="button">Ouvrir</button>
                  ${shared !== item.version ? `<button class="text-link text-link--small" data-action="share-document-version" data-doc="${doc.id}" data-version="${item.version}" data-athlete="${athlete.id}" type="button">Partager cette version</button>` : ''}
                </div>
              </li>`,
            )
            .join('')}</ul>
        </div>
        <label class="upload-zone upload-zone--compact" for="document-version-${doc.id}">
          ${icon('plus', { size: 20 })}
          <strong>Déposer une nouvelle version</strong>
          <span>La version actuellement partagée reste inchangée tant que tu ne la remplaces pas.</span>
          <input id="document-version-${doc.id}" type="file" accept="application/pdf,.pdf" data-document-version="${doc.id}" data-athlete="${athlete.id}">
        </label>`
      : `<p class="sheet-note">Ce document t’a été partagé par Aga. Tu peux l’ouvrir et le télécharger ; il reste attaché à ton profil.</p>`}
    <p class="fineprint">Démo : stockage local. En production, l’API vérifie le compte avant de servir le PDF, y compris via un lien direct.</p>`,
  };
}

/* ------------------------------------------------------------------ */
/* Coach : switcher, collectifs, assignation                           */
/* ------------------------------------------------------------------ */

export function coachSwitchSheet({ state, currentId, tab = 'overview' }) {
  return {
    variant: 'sheet',
    eyebrow: 'Espace Aga',
    title: 'Changer de sportif',
    body: `<p class="sheet-intro__text">Recherche par nom, profils récents ou filtre par collectif. L’onglet en cours est conservé.</p>
      ${athleteSwitcher({ state, currentId, tab, variant: 'sheet' })}`,
  };
}

export function unsavedSwitchSheet({ athlete }) {
  return {
    variant: 'sheet',
    eyebrow: 'Modification en cours',
    title: 'Enregistrer avant de changer ?',
    body: `<p class="sheet-intro__text">La note de suivi de ${escapeHTML(athlete.firstName)} a été modifiée. Tu peux l’enregistrer, continuer sans la sauvegarder, ou revenir à la fiche.</p>
      <div class="reset-actions">
        <button class="btn btn--primary btn--block" data-action="save-note-and-switch" type="button">Enregistrer et changer de fiche</button>
        <button class="btn btn--outline btn--block" data-action="discard-and-switch" type="button">Continuer sans enregistrer</button>
        <button class="btn btn--ghost btn--block" data-action="close-sheet" type="button">Revenir à la fiche</button>
      </div>`,
  };
}

export function collectiveFormSheet({ state, collective = null }) {
  const isEdit = Boolean(collective);
  const selected = new Set(collective?.memberIds ?? []);
  return {
    variant: 'sheet',
    eyebrow: isEdit ? 'Modifier le collectif' : 'Nouveau collectif',
    title: isEdit ? collective.name : 'Créer un collectif',
    body: `<form class="collective-form" data-collective-form data-collective="${collective?.id ?? ''}">
      <label class="field" for="collective-name">
        <span class="field__label">Nom</span>
        <input class="field__input" id="collective-name" name="name" type="text" maxlength="60" required value="${escapeHTML(collective?.name ?? '')}" placeholder="Ex. Préparation compétition">
      </label>
      <fieldset class="collective-type-choice">
        <legend>Type de collectif</legend>
        <label class="type-option ${collective?.type !== 'team' ? 'is-selected' : ''}">
          <input type="radio" name="type" value="group" ${collective?.type !== 'team' ? 'checked' : ''}>
          <span class="type-option__icon">${icon('layers', { size: 18 })}</span>
          <span><strong>Groupe</strong><small>Atelier ou objectif de travail</small></span>
        </label>
        <label class="type-option ${collective?.type === 'team' ? 'is-selected' : ''}">
          <input type="radio" name="type" value="team" ${collective?.type === 'team' ? 'checked' : ''}>
          <span class="type-option__icon">${icon('users', { size: 18 })}</span>
          <span><strong>Équipe</strong><small>Collectif qui joue ensemble</small></span>
        </label>
      </fieldset>
      <label class="field" for="collective-description">
        <span class="field__label">Description <em>facultatif</em></span>
        <textarea class="field__input field__input--area" id="collective-description" name="description" rows="2" maxlength="200" placeholder="Ex. Trois sportifs qui préparent leur première compétition.">${escapeHTML(collective?.description ?? '')}</textarea>
      </label>
      <fieldset class="member-choice">
        <legend>Membres <span class="fineprint">${state.athletes ? Object.keys(state.athletes).length : 0} disponibles</span></legend>
        ${Object.values(state.athletes)
          .map(
            (athlete) => `<label class="member-option">
              <input type="checkbox" name="members" value="${athlete.id}" ${selected.has(athlete.id) ? 'checked' : ''}>
              ${avatar(athlete, { size: 'sm' })}
              <span><strong>${escapeHTML(athlete.name)}</strong><small>${escapeHTML(athlete.sport)}</small></span>
            </label>`,
          )
          .join('')}
      </fieldset>
      <button class="btn btn--primary btn--block btn--lg" type="submit">${isEdit ? 'Enregistrer le collectif' : 'Créer le collectif'} ${icon('check', { size: 17 })}</button>
      <p class="fineprint">Un sportif peut appartenir à plusieurs collectifs. Les routines assignées restent individuelles.</p>
    </form>`,
  };
}

export function assignRoutineSheet({ state, athlete = null, collective = null }) {
  const recipients = collective
    ? collective.memberIds.map((id) => state.athletes[id]).filter(Boolean)
    : athlete
      ? [athlete]
      : [];
  const routineOptions = ROUTINE_LIBRARY;
  const targetLabel = collective ? collective.name : athlete?.firstName ?? 'ce sportif';
  return {
    variant: 'sheet',
    eyebrow: collective ? `Collectif · ${collective.name}` : `Fiche · ${athlete?.name ?? ''}`,
    title: 'Assigner une routine',
    body: `<form class="assign-routine-form" data-assign-routine-form data-collective="${collective?.id ?? ''}" data-athlete="${athlete?.id ?? ''}">
      <fieldset class="routine-options">
        <legend>Choisir une routine</legend>
        ${routineOptions
          .map(
            (routine, index) => `<label class="routine-option ${index === 0 ? 'is-selected' : ''}">
              <input type="radio" name="routine" value="${routine.id}" ${index === 0 ? 'checked' : ''}>
              <span class="routine-option__icon">${icon('target', { size: 17 })}</span>
              <span><strong>${escapeHTML(routine.title)}</strong><small>${routine.kind} · ${routine.duration} · ${routine.context}</small></span>
            </label>`,
          )
          .join('')}
      </fieldset>
      <label class="field" for="assign-instruction">
        <span class="field__label">Consigne personnalisée <em>facultatif</em></span>
        <textarea class="field__input field__input--area" id="assign-instruction" name="instruction" rows="3" maxlength="240" placeholder="Ex. À tester avant ton prochain match, puis note ce qui a changé."></textarea>
      </label>
      <label class="field" for="assign-context">
        <span class="field__label">Contexte <em>facultatif</em></span>
        <input class="field__input" id="assign-context" name="context" type="text" maxlength="80" placeholder="Ex. Avant le match de samedi">
      </label>
      ${collective
        ? `<fieldset class="member-choice">
            <legend>Destinataires <span class="fineprint">${recipients.length}</span></legend>
            ${recipients
              .map(
                (member) => `<label class="member-option">
                  <input type="checkbox" name="recipients" value="${member.id}" checked>
                  ${avatar(member, { size: 'sm' })}
                  <span><strong>${escapeHTML(member.name)}</strong><small>${escapeHTML(member.sport)}</small></span>
                </label>`,
              )
              .join('')}
          </fieldset>
          <div class="recipient-summary" data-recipient-summary>
            <strong>Destinataires : ${recipients.length}</strong>
            <p>${recipients.map((member) => member.firstName).join(', ')}</p>
            <small>Chaque sportif reçoit sa propre assignation et répond en privé.</small>
          </div>`
        : `<div class="recipient-summary">
            <strong>Destinataire : ${escapeHTML(athlete?.name ?? '')}</strong>
            <p>Une assignation individuelle sera créée dans sa fiche.</p>
          </div>`}
      <button class="btn btn--primary btn--block btn--lg" type="submit">
        <span data-assign-label>Assigner à ${recipients.length} sportif${recipients.length > 1 ? 's' : ''}</span>
        ${icon('send', { size: 17 })}
      </button>
      <p class="fineprint">Vérifie la liste des destinataires avant de confirmer. L’assignation est immédiate dans la démo.</p>
    </form>`,
  };
}
