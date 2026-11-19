import { STATUS, getResource } from '../data.js';
import { escapeHTML, formatDate, relativeTime } from '../utils.js';
import { icon } from '../ui/icons.js';
import { coachTabs, scoreRows, statusChip, trackingChart } from '../ui/components.js';
import { pageHead, shell } from './coach.js';

function lastCheckin(athlete) {
  return [...athlete.checkins].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

function questionnaireAction(athlete) {
  const status = athlete.assignment?.status ?? null;
  if (!status) {
    return `<button class="btn btn--primary btn--small" data-action="assign-questionnaire" data-athlete="${athlete.id}" type="button">Attribuer le questionnaire</button>`;
  }
  if (status === 'todo') {
    return `<button class="btn btn--primary btn--small" data-action="send-questionnaire" data-athlete="${athlete.id}" type="button">Marquer comme envoyé</button>`;
  }
  if (status === 'in_progress') {
    return `<button class="btn btn--primary btn--small" data-action="simulate-questionnaire" data-athlete="${athlete.id}" type="button">Simuler la réponse</button>`;
  }
  return `<button class="btn btn--outline btn--small" data-action="assign-questionnaire" data-athlete="${athlete.id}" type="button">Relancer</button>`;
}

function questionnaireCard(athlete) {
  const assignment = athlete.assignment;
  const status = assignment?.status ?? null;
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
    </div>
    <p class="questionnaire-card__note">Attribution et réponse simulées : aucun email n’est envoyé.</p>
  </section>`;
}

function sharedResources(athlete) {
  const shares = [...athlete.shared].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
  return `<section class="card">
    <header class="card__head">
      <h2>Ressources partagées</h2>
      <button class="btn btn--outline btn--small" data-action="open-share" data-athlete="${athlete.id}" type="button">${icon('share', { size: 15 })} Partager une ressource</button>
    </header>
    ${shares.length
      ? `<ul class="shared-list">${shares
          .map((share) => {
            const resource = getResource(share.resourceId);
            return `<li class="shared-list__row">
              <span class="shared-list__icon">${icon(resource?.category === 'Vidéo' ? 'video' : resource?.category === 'Respiration' ? 'wind' : 'target', { size: 18 })}</span>
              <span class="shared-list__copy"><strong>${escapeHTML(resource?.title ?? 'Ressource')}</strong><small>${resource?.kind ?? ''} · partagée ${relativeTime(share.sharedAt)}</small>${share.message ? `<em>« ${escapeHTML(share.message)} »</em>` : ''}</span>
            </li>`;
          })
          .join('')}</ul>`
      : `<div class="empty empty--light empty--inline"><span class="empty__icon">${icon('layers', { size: 20 })}</span><p class="empty__title">Aucune ressource partagée</p><p class="empty__text">Choisis un exercice, une routine ou une vidéo dans la bibliothèque.</p></div>`}
  </section>`;
}

function overview(athlete, state) {
  const profile = athlete.profile;
  const checkin = lastCheckin(athlete);
  return `<div class="coach-tabpanel" role="tabpanel">
    <div class="athlete-grid">
      <section class="card card--navy">
        <header class="card__head card__head--onnavy">
          <h2>Profil 4C</h2>
          ${profile ? `<span class="pill pill--glass">${profile.sample ? 'Exemple' : 'À jour'}</span>` : ''}
        </header>
        ${scoreRows(profile)}
        ${profile
          ? `<p class="fineprint fineprint--onnavy">Autoévaluation du ${formatDate(profile.completedAt, { year: 'numeric' })} · lecture exploratoire.</p>`
          : `<p class="fineprint fineprint--onnavy">Profil en attente. Attribue le questionnaire ci-dessous.</p>`}
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

    ${questionnaireCard(athlete)}
    ${sharedResources(athlete)}

    <section class="card">
      <header class="card__head"><h2>Contexte de suivi</h2></header>
      <dl class="context-list">
        <div><dt>Objectif</dt><dd>${escapeHTML(athlete.coachGoal)}</dd></div>
        <div><dt>Suivi depuis</dt><dd>${escapeHTML(athlete.since)}</dd></div>
        <div><dt>Note d’Aga</dt><dd>${escapeHTML(state.coachNotes?.[athlete.id] ?? '')}</dd></div>
      </dl>
    </section>
  </div>`;
}

function bilans(athlete) {
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

export function coachAthleteLiteView({ state, athlete, tab = 'overview' }) {
  const safeTab = ['overview', 'bilans', 'ressources'].includes(tab) ? tab : 'overview';
  const panel =
    safeTab === 'bilans'
      ? bilans(athlete)
      : safeTab === 'ressources'
        ? `<div class="coach-tabpanel" role="tabpanel">${sharedResources(athlete)}</div>`
        : overview(athlete, state);

  const content = `
    ${pageHead({
      eyebrow: 'Fiche sportive',
      title: athlete.name,
      subtitle: `${athlete.age} ans · ${athlete.sport} · ${athlete.club}`,
      breadcrumb: `<a href="#/coach">Tableau de bord</a> <span>/</span> <a href="#/coach/sportifs">Sportifs</a> <span>/</span> ${athlete.name}`,
      action: questionnaireAction(athlete),
    })}
    ${coachTabs(safeTab, athlete.id)}
    <div class="coach-tabpanel-wrap">${panel}</div>
  `;
  return shell({ active: 'athletes', content });
}
