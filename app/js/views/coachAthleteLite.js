import { STATUS, getResource } from '../data.js';
import { buildAlert } from '../alerts.js';
import { escapeHTML, formatDate, relativeTime } from '../utils.js';
import { icon } from '../ui/icons.js';
import { coachTabs, scoreRows, statusChip } from '../ui/components.js';
import { alertSparkline, checkinChart } from '../ui/charts.js';
import { fourCReading } from '../ui/fourcReading.js';
import { pageHead, shell } from './coach.js';

function lastCheckin(athlete) {
  return [...athlete.checkins].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

function questionnaireAction(athlete) {
  const status = athlete.assignment?.status ?? null;
  if (!status || status === 'completed') {
    return `<button class="btn btn--primary btn--small" data-action="open-test-catalog" data-athlete="${athlete.id}" type="button">Attribuer un test</button>`;
  }
  if (status === 'todo') {
    return `<button class="btn btn--primary btn--small" data-action="send-questionnaire" data-athlete="${athlete.id}" type="button">Marquer comme envoyé</button>`;
  }
  return `<button class="btn btn--primary btn--small" data-action="simulate-questionnaire" data-athlete="${athlete.id}" type="button">Simuler la réponse</button>`;
}

function questionnaireCard(athlete) {
  const assignment = athlete.assignment;
  const status = assignment?.status ?? null;
  const action = ['todo', 'in_progress'].includes(status) ? questionnaireAction(athlete) : '';
  return `<section class="card">
    <header class="card__head">
      <h2>Questionnaire 4C</h2>
      ${status ? statusChip(status) : '<span class="status status--muted">Non attribué</span>'}
    </header>
    <div class="questionnaire-card">
      <span class="questionnaire-card__icon">${icon('clipboard', { size: 20 })}</span>
      <div class="questionnaire-card__copy">
        <strong>${assignment?.testName ?? 'Profil 4C'} · 20 affirmations</strong>
        <small>${assignment?.completedAt ? `Complété le ${formatDate(assignment.completedAt, { year: 'numeric' })}` : status === 'in_progress' ? 'Envoyé, en attente de réponse' : status === 'todo' ? 'Attribué, pas encore envoyé' : 'Aucun questionnaire attribué.'}</small>
        ${assignment?.message ? `<em class="questionnaire-card__message">« ${escapeHTML(assignment.message)} »</em>` : ''}
      </div>
      ${action}
    </div>
    <p class="questionnaire-card__note">Attribution et réponse simulées : aucun email n’est envoyé.</p>
  </section>`;
}

function alertCard(athlete, state) {
  const alert = buildAlert(athlete);
  if (!alert) return '';
  const seenAt = state.alertsSeen?.[athlete.id]?.seenAt;
  return `<section class="alert-card ${seenAt ? 'is-seen' : ''}" aria-labelledby="alert-title-${athlete.id}">
    <div class="alert-card__head">
      <p class="eyebrow">Point à regarder</p>
      ${seenAt ? `<span class="status status--muted">Vu le ${formatDate(seenAt, { day: 'numeric', month: 'long' })}</span>` : '<span class="status status--warn">À regarder</span>'}
    </div>
    <h2 id="alert-title-${athlete.id}">${escapeHTML(alert.text)}</h2>
    <p>Comparé à ses 4 semaines précédentes, sur ses propres repères.</p>
    <div class="alert-card__viz">
      ${alertSparkline(athlete.checkins, alert.measures[0].key)}
      <span>${alert.measures.map((measure) => measure.label).join(' · ')} · 14 jours</span>
    </div>
    ${seenAt
      ? `<p class="alert-card__seen">Alerte conservée dans l’historique de la fiche.</p>`
      : `<button class="btn btn--outline btn--small" data-action="mark-alert-seen" data-athlete="${athlete.id}" type="button">Marquer comme vu</button>`}
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
          ? `<a class="navy-card__link" href="#/coach/sportifs/${athlete.id}?tab=profil">Lecture détaillée ${icon('arrowRight', { size: 14 })}</a>
             <p class="fineprint fineprint--onnavy">Autoévaluation du ${formatDate(profile.completedAt, { year: 'numeric' })} · lecture exploratoire.</p>`
          : `<p class="fineprint fineprint--onnavy">Profil en attente. Attribue un test ci-dessous.</p>`}
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

function bilans(athlete, state, focus = null) {
  const alert = buildAlert(athlete);
  return `<div class="coach-tabpanel" role="tabpanel">
    ${alert ? alertCard(athlete, state) : ''}
    <section class="card">
      <header class="card__head">
        <div><p class="eyebrow">Suivi quotidien</p><h2>Bilans de ${escapeHTML(athlete.firstName)}</h2></div>
        <span class="pill pill--outline">Fictif</span>
      </header>
      ${athlete.checkins.length ? checkinChart(athlete.checkins, { focus }) : `<div class="empty empty--light"><p class="empty__title">Aucun bilan</p></div>`}
    </section>
    <section class="card">
      <header class="card__head"><h2>Tous les bilans</h2></header>
      ${athlete.checkins.length
        ? `<ul class="checkin-history">${[...athlete.checkins]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 14)
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

function profil(athlete) {
  return `<div class="coach-tabpanel" role="tabpanel">
    ${
      athlete.profile
        ? fourCReading({ profile: athlete.profile, mode: 'coach' })
        : `<section class="card"><div class="empty empty--light"><p class="empty__title">Profil 4C en attente</p><p class="empty__text">Attribue le questionnaire pour obtenir la lecture détaillée.</p></div></section>`
    }
  </div>`;
}

function sessions(athlete) {
  const rows = [...(athlete.sessions ?? [])].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
  return `<div class="coach-tabpanel" role="tabpanel">
    <section class="card">
      <header class="card__head">
        <div><p class="eyebrow">Après une séance</p><h2>Séances de ${escapeHTML(athlete.firstName)}</h2></div>
        <button class="btn btn--primary btn--small" data-action="open-session" data-athlete="${athlete.id}" type="button">${icon('plus', { size: 15 })} Clôturer la séance</button>
      </header>
      <p class="fineprint">La note de séance reste visible uniquement par toi. Les prochaines étapes et les ressources sont visibles par le sportif.</p>
      ${rows.length
        ? `<div class="session-history">${rows
            .map(
              (session) => `<article class="session-card">
                <header class="session-card__head">
                  <h3>${formatDate(session.date, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                  <span class="pill pill--outline">Séance</span>
                </header>
                ${session.privateNote ? `<div class="session-private"><span class="session-label">Note privée · visible seulement par toi</span><p>${escapeHTML(session.privateNote)}</p></div>` : ''}
                ${session.nextSteps ? `<div class="session-next"><span class="session-label">Prochaines étapes · visibles par le sportif</span><p>${escapeHTML(session.nextSteps)}</p></div>` : ''}
                ${session.resourceIds.length ? `<div class="session-tags">${session.resourceIds
                  .map((id) => getResource(id))
                  .filter(Boolean)
                  .map((resource) => `<span class="tag tag--small">${escapeHTML(resource.title)}</span>`)
                  .join('')}</div>` : ''}
              </article>`,
            )
            .join('')}</div>`
        : `<div class="empty empty--light empty--inline"><span class="empty__icon">${icon('calendar', { size: 20 })}</span><p class="empty__title">Aucune séance clôturée</p><p class="empty__text">Clôture une séance pour garder une trace et transmettre les prochaines étapes.</p></div>`}
    </section>
  </div>`;
}

export function coachAthleteLiteView({ state, athlete, tab = 'overview', focus = null }) {
  const safeTab = ['overview', 'bilans', 'profil', 'seances', 'ressources'].includes(tab)
    ? tab
    : 'overview';
  const panel =
    safeTab === 'bilans'
      ? bilans(athlete, state, focus)
      : safeTab === 'profil'
        ? profil(athlete)
        : safeTab === 'seances'
          ? sessions(athlete)
          : safeTab === 'ressources'
            ? `<div class="coach-tabpanel" role="tabpanel">${sharedResources(athlete)}</div>`
            : overview(athlete, state);

  const content = `
    ${pageHead({
      eyebrow: 'Fiche sportive',
      title: athlete.name,
      subtitle: `${athlete.age} ans · ${athlete.sport} · ${athlete.club}`,
      breadcrumb: `<a href="#/coach">Tableau de bord</a> <span>/</span> <a href="#/coach/sportifs">Sportifs</a> <span>/</span> ${athlete.name}`,
      action: `<div class="head-actions">
        <button class="btn btn--outline btn--small" data-action="open-test-catalog" data-athlete="${athlete.id}" type="button">Attribuer un test</button>
        <button class="btn btn--primary btn--small" data-action="open-session" data-athlete="${athlete.id}" type="button">${icon('plus', { size: 15 })} Clôturer la séance</button>
      </div>`,
    })}
    ${coachTabs(safeTab, athlete.id)}
    <div class="coach-tabpanel-wrap">${panel}</div>
  `;
  return shell({ active: 'athletes', content });
}
