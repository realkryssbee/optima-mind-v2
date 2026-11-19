import { STATUS, getEntryType, getResource } from '../data.js';
import { averageScore, formatScore } from '../scoring.js';
import { escapeHTML, formatDate, relativeTime } from '../utils.js';
import { icon } from '../ui/icons.js';
import {
  avatar,
  coachTabs,
  scoreRows,
  statusChip,
  trackingChart,
} from '../ui/components.js';
import { athleteSwitcher } from '../ui/coachSwitcher.js';
import { pageHead, shell } from './coach.js';
import { documentsPanel } from './documents.js';

function coachNoteCard(athlete, state) {
  const note = state.coachNotes?.[athlete.id] ?? '';
  return `<section class="card coach-note-card" aria-labelledby="coach-note-title">
    <header class="card__head">
      <div><p class="eyebrow">Espace de travail</p><h2 id="coach-note-title">Note de suivi</h2></div>
      <span class="pill pill--outline">Brouillon local</span>
    </header>
    <label class="sr-only" for="coach-note">Note de suivi pour ${escapeHTML(athlete.firstName)}</label>
    <textarea class="field__input field__input--area coach-note-field" id="coach-note" rows="3" maxlength="600" placeholder="Ce que tu observes, ce que tu veux travailler à la prochaine séance…">${escapeHTML(note)}</textarea>
    <div class="coach-note-card__foot">
      <p class="fineprint">Visible par toi uniquement. Une modification non enregistrée est protégée avant de changer de fiche.</p>
      <button class="btn btn--outline btn--small" data-action="save-coach-note" data-athlete="${athlete.id}" type="button">Enregistrer la note</button>
    </div>
  </section>`;
}

function questionnaireCard(athlete) {
  const assignment = athlete.assignment;
  const status = assignment?.status ?? null;
  let action = '';
  if (!status) {
    action = `<button class="btn btn--primary btn--small" data-action="assign-questionnaire" data-athlete="${athlete.id}" type="button">Attribuer</button>`;
  } else if (status === 'todo') {
    action = `<button class="btn btn--primary btn--small" data-action="send-questionnaire" data-athlete="${athlete.id}" type="button">Marquer envoyé</button>`;
  } else if (status === 'in_progress') {
    action = `<button class="btn btn--primary btn--small" data-action="simulate-questionnaire" data-athlete="${athlete.id}" type="button">Simuler la réponse</button>`;
  } else {
    action = `<button class="btn btn--outline btn--small" data-action="assign-questionnaire" data-athlete="${athlete.id}" type="button">Relancer</button>`;
  }
  return `<section class="card">
    <header class="card__head">
      <h2>Questionnaire 4C</h2>
      ${status ? statusChip(status) : '<span class="status status--muted">Non attribué</span>'}
    </header>
    <div class="questionnaire-card">
      <span class="questionnaire-card__icon">${icon('clipboard', { size: 20 })}</span>
      <div class="questionnaire-card__copy">
        <strong>Profil 4C · 20 affirmations</strong>
        <small>${assignment?.completedAt ? `Complété le ${formatDate(assignment.completedAt, { year: 'numeric' })}` : status === 'in_progress' ? 'Envoyé, en attente de réponse' : status === 'todo' ? 'Attribué, pas encore envoyé' : 'Aucun questionnaire attribué.'}</small>
      </div>
      ${action}
    </div>
  </section>`;
}

function collectivesCard(athlete, state) {
  const collectives = state.collectives.filter((collective) =>
    collective.memberIds.includes(athlete.id),
  );
  return `<section class="card">
    <header class="card__head">
      <h2>Collectifs</h2>
      <a class="text-link text-link--small" href="#/coach/collectifs">Gérer</a>
    </header>
    ${collectives.length
      ? `<div class="collective-chips">${collectives
          .map(
            (collective) => `<a class="collective-chip" href="#/coach/collectifs/${collective.id}">
              <span class="collective-chip__type">${collective.type === 'team' ? 'Équipe' : 'Groupe'}</span>
              ${escapeHTML(collective.name)}
            </a>`,
          )
          .join('')}</div>`
      : `<p class="fineprint">Aucun collectif. Crée une équipe ou un groupe pour assigner une routine à plusieurs sportifs.</p>`}
  </section>`;
}

function overviewTab(athlete, state) {
  const profile = athlete.profile;
  const checkin = [...athlete.checkins].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
  const sharedResources = [...athlete.shared].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
  return `<div class="coach-tabpanel" role="tabpanel">
    <div class="athlete-grid">
      <section class="card card--navy">
        <header class="card__head card__head--onnavy">
          <h2>Profil 4C</h2>
          ${profile ? `<span class="pill pill--glass">${profile.sample ? 'Exemple' : 'Simulé'}</span>` : ''}
        </header>
        ${scoreRows(profile)}
        ${profile
          ? `<p class="fineprint fineprint--onnavy">Autoévaluation du ${formatDate(profile.completedAt, { year: 'numeric' })} · lecture exploratoire.</p>`
          : `<p class="fineprint fineprint--onnavy">Profil en attente. Attribue le questionnaire depuis la carte ci-dessous.</p>`}
      </section>

      <section class="card">
        <header class="card__head">
          <h2>Dernier bilan</h2>
          ${checkin ? `<span class="pill pill--outline">${relativeTime(`${checkin.date}T12:00:00`)}</span>` : ''}
        </header>
        ${checkin
          ? `<dl class="checkin-detail">
              <div><dt>Humeur</dt><dd>${checkin.mood}<small>/10</small></dd></div>
              <div><dt>Énergie</dt><dd>${checkin.energy}<small>/10</small></dd></div>
              <div><dt>Sommeil</dt><dd>${checkin.sleep}<small>/10</small></dd></div>
            </dl>
            ${checkin.word ? `<p class="checkin-word">« ${escapeHTML(checkin.word)} »</p>` : ''}
            <p class="fineprint">Bilan fictif. Il se met à jour quand le sportif enregistre son check-in.</p>`
          : `<div class="empty empty--light empty--inline"><span class="empty__icon">${icon('calendar', { size: 20 })}</span><p class="empty__title">Pas encore de bilan</p></div>`}
      </section>
    </div>

    ${coachNoteCard(athlete, state)}
    ${questionnaireCard(athlete)}
    ${collectivesCard(athlete, state)}

    <section class="card">
      <header class="card__head">
        <h2>Ressources partagées</h2>
        <button class="btn btn--outline btn--small" data-action="open-share" data-athlete="${athlete.id}" type="button">${icon('share', { size: 15 })} Partager</button>
      </header>
      ${sharedResources.length
        ? `<ul class="shared-list">${sharedResources
            .map((share) => {
              const resource = getResource(share.resourceId);
              return `<li class="shared-list__row">
                <span class="shared-list__icon">${icon(resource?.category === 'Vidéo' ? 'video' : resource?.category === 'Respiration' ? 'wind' : 'target', { size: 18 })}</span>
                <span class="shared-list__copy"><strong>${escapeHTML(resource?.title ?? 'Ressource')}</strong><small>${resource?.kind ?? ''} · partagée ${relativeTime(share.sharedAt)}</small>${share.message ? `<em>« ${escapeHTML(share.message)} »</em>` : ''}</span>
              </li>`;
            })
            .join('')}</ul>`
        : `<div class="empty empty--light empty--inline"><span class="empty__icon">${icon('layers', { size: 20 })}</span><p class="empty__title">Aucune ressource partagée</p></div>`}
    </section>
  </div>`;
}

function bilansTab(athlete) {
  return `<div class="coach-tabpanel" role="tabpanel">
    <section class="card">
      <header class="card__head">
        <div><p class="eyebrow">Suivi quotidien</p><h2>Bilans de ${escapeHTML(athlete.firstName)}</h2></div>
        <span class="pill pill--outline">Historique fictif</span>
      </header>
      ${athlete.checkins.length ? trackingChart(athlete.checkins) : `<div class="empty empty--light"><p class="empty__title">Aucun bilan</p></div>`}
    </section>
    <section class="card">
      <header class="card__head"><h2>Tous les bilans</h2></header>
      ${athlete.checkins.length
        ? `<ul class="checkin-history">${[...athlete.checkins]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(
              (entry) => `<li>
                <span class="checkin-history__date"><strong>${formatDate(entry.date, { weekday: 'short', day: 'numeric', month: 'short' })}</strong></span>
                <span class="checkin-history__values"><span><em>H</em>${entry.mood}</span><span><em>É</em>${entry.energy}</span><span><em>S</em>${entry.sleep}</span></span>
                <span class="checkin-history__word">${entry.word ? `« ${escapeHTML(entry.word)} »` : '—'}</span>
              </li>`,
            )
            .join('')}</ul>`
        : `<div class="empty empty--light"><p class="empty__title">Aucun bilan enregistré</p></div>`}
    </section>
  </div>`;
}

function routinesTab(athlete) {
  const assignments = [...athlete.routineAssignments].sort((a, b) =>
    b.assignedAt.localeCompare(a.assignedAt),
  );
  const tried = assignments.filter((assignment) => assignment.status === 'tried').length;
  const shared = assignments.filter((assignment) => assignment.feedback?.shared).length;
  return `<div class="coach-tabpanel" role="tabpanel">
    <div class="stats stats--compact">
      <article class="stat"><span class="stat__label">Assignées</span><strong>${assignments.length}</strong></article>
      <article class="stat"><span class="stat__label">Essayées</span><strong>${tried}</strong></article>
      <article class="stat"><span class="stat__label">Retours partagés</span><strong>${shared}</strong></article>
    </div>

    <section class="card">
      <header class="card__head">
        <div><p class="eyebrow">À deux</p><h2>Routines assignées</h2></div>
        <button class="btn btn--primary btn--small" data-action="open-assign-routine" data-athlete="${athlete.id}" type="button">${icon('plus', { size: 15 })} Assigner</button>
      </header>
      ${assignments.length
        ? `<ul class="coach-routine-list">${assignments
            .map((assignment) => {
              const feedback = assignment.feedback;
              return `<li class="coach-routine">
                <div class="coach-routine__head">
                  <span class="routine-origin">Aga${assignment.collectiveName ? ` · ${escapeHTML(assignment.collectiveName)}` : ''}</span>
                  <span class="status ${assignment.status === 'tried' ? 'status--success' : 'status--info'}">${assignment.status === 'tried' ? 'Essayée' : 'Nouvelle'}</span>
                </div>
                <h3>${escapeHTML(assignment.title)}</h3>
                ${assignment.instruction ? `<p class="routine-instruction">« ${escapeHTML(assignment.instruction)} »</p>` : ''}
                <p class="fineprint">${formatDate(assignment.assignedAt, { day: 'numeric', month: 'short' })}${assignment.context ? ` · ${escapeHTML(assignment.context)}` : ''}</p>
                <div class="coach-routine__feedback ${feedback?.shared ? 'is-shared' : ''}">
                  ${feedback?.shared
                    ? `<span class="feedback-chip feedback-chip--${feedback.helpfulness === 'helped' ? 'success' : feedback.helpfulness === 'somewhat' ? 'info' : 'muted'}">${feedback.helpfulness === 'helped' ? 'Ça l’a aidé' : feedback.helpfulness === 'somewhat' ? 'Un peu' : 'Pas cette fois'}</span>
                       ${feedback.comment ? `<p>« ${escapeHTML(feedback.comment)} »</p>` : ''}`
                    : assignment.status === 'tried'
                      ? `<span class="privacy-inline">${icon('lock', { size: 12 })} A essayé · retour privé</span>`
                      : `<span class="privacy-inline">${icon('clock', { size: 12 })} En attente</span>`}
                </div>
              </li>`;
            })
            .join('')}</ul>`
        : `<div class="empty empty--light"><span class="empty__icon">${icon('target', { size: 21 })}</span><p class="empty__title">Aucune routine assignée</p><p class="empty__text">Choisis une routine de la bibliothèque et ajoute une consigne personnalisée.</p><button class="btn btn--outline btn--small" data-action="open-assign-routine" data-athlete="${athlete.id}" type="button">Assigner une routine</button></div>`}
    </section>
    <p class="coach-note">${icon('lock', { size: 15 })}<span>Les routines créées par ${escapeHTML(athlete.firstName)} restent privées. Tu vois les routines que tu as assignées, le statut « essayée » et le retour seulement s’il est partagé.</span></p>
  </div>`;
}

function carnetTab(athlete, state) {
  const goal = athlete.carnet.goal;
  const entries = athlete.carnet.entries.filter((entry) => entry.visibility === 'shared');
  const activities = athlete.activities.filter((activity) => activity.shared);
  return `<div class="coach-tabpanel" role="tabpanel">
    <section class="card">
      <header class="card__head">
        <h2>Objectif du sportif</h2>
        <span class="pill pill--outline">${entries.length} entrée${entries.length > 1 ? 's' : ''} partagée${entries.length > 1 ? 's' : ''}</span>
      </header>
      ${goal
        ? `<p class="coach-goal">« ${escapeHTML(goal.text)} »</p><p class="fineprint">Depuis le ${formatDate(goal.createdAt, { day: 'numeric', month: 'long' })}. Le sportif peut le modifier.</p>`
        : `<p class="fineprint">Aucun objectif formulé pour l’instant.</p>`}
    </section>

    <section class="card">
      <header class="card__head">
        <h2>Entrées partagées</h2>
        <span class="pill pill--outline">${icon('users', { size: 13 })} Choisies par ${escapeHTML(athlete.firstName)}</span>
      </header>
      ${entries.length
        ? `<div class="coach-carnet-list">${entries
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((entry) => {
              const type = getEntryType(entry.type);
              return `<article class="coach-entry">
                <div class="coach-entry__top">
                  <span class="entry-type">${icon(type.icon, { size: 14 })} ${type.label}</span>
                  <time>${formatDate(entry.date, { day: 'numeric', month: 'short' })}</time>
                </div>
                <h3>${escapeHTML(entry.title || type.label)}</h3>
                ${entry.note ? `<p>${escapeHTML(entry.note)}</p>` : ''}
                ${entry.answer ? `<p class="coach-entry__answer">« ${escapeHTML(entry.answer)} »</p>` : ''}
                ${entry.helped ? `<p class="fineprint">A aidé : ${escapeHTML(entry.helped)}</p>` : ''}
              </article>`;
            })
            .join('')}</div>`
        : `<div class="empty empty--light"><span class="empty__icon">${icon('lock', { size: 20 })}</span><p class="empty__title">Rien de partagé pour l’instant</p><p class="empty__text">Les entrées privées ne sont jamais affichées ici.</p></div>`}
    </section>

    <section class="card">
      <header class="card__head">
        <h2>Activités partagées</h2>
        <span class="pill pill--outline">${activities.length}</span>
      </header>
      ${activities.length
        ? `<ul class="shared-list">${activities
            .map(
              (activity) => `<li class="shared-list__row">
                <span class="shared-list__icon">${icon('trend', { size: 17 })}</span>
                <span class="shared-list__copy"><strong>${escapeHTML(activity.activity)}</strong><small>${formatDate(activity.date, { day: 'numeric', month: 'short' })}${activity.duration ? ` · ${activity.duration} min` : ''}${activity.comment ? ` · « ${escapeHTML(activity.comment)} »` : ''}</small></span>
              </li>`,
            )
            .join('')}</ul>`
        : `<p class="fineprint">Aucune activité partagée.</p>`}
    </section>
    <p class="coach-note">${icon('info', { size: 15 })}<span>Le carnet complet reste privé. Cette vue ne montre que les entrées et activités que ${escapeHTML(athlete.firstName)} a explicitement partagées.</span></p>
  </div>`;
}

export function coachAthleteView({ state, athlete, tab = 'overview' }) {
  const action = `<div class="head-actions">
    <button class="btn btn--outline btn--small athlete-switch-open" data-action="open-athlete-switch" data-athlete="${athlete.id}" data-tab="${tab}" type="button">${icon('users', { size: 15 })} Changer de sportif</button>
    <button class="btn btn--primary btn--small" data-action="open-assign-routine" data-athlete="${athlete.id}" type="button">${icon('plus', { size: 15 })} Assigner une routine</button>
  </div>`;

  let panel = overviewTab(athlete, state);
  if (tab === 'bilans') panel = bilansTab(athlete);
  else if (tab === 'routines') panel = routinesTab(athlete);
  else if (tab === 'carnet') panel = carnetTab(athlete, state);
  else if (tab === 'documents') panel = documentsPanel({ athlete, state });

  const content = `
    ${pageHead({
      eyebrow: 'Fiche sportive',
      title: athlete.name,
      subtitle: `${athlete.age} ans · ${athlete.sport} · ${athlete.club}`,
      breadcrumb: `<a href="#/coach">Tableau de bord</a> <span>/</span> <a href="#/coach/sportifs">Sportifs</a> <span>/</span> ${athlete.name}`,
      action,
    })}
    ${coachTabs(tab, athlete.id)}
    <div class="coach-workspace">
      <aside class="coach-switcher-rail" aria-label="Changer de sportif">${athleteSwitcher({ state, currentId: athlete.id, tab })}</aside>
      <div class="coach-fiche">${panel}</div>
    </div>
  `;
  return shell({ active: 'athletes', content });
}
