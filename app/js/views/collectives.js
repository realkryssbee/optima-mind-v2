import { escapeHTML, formatDate, relativeTime } from '../utils.js';
import { icon } from '../ui/icons.js';
import { avatar, statusChip } from '../ui/components.js';
import { pageHead, shell } from './coach.js';

function typeLabel(type) {
  return type === 'team' ? 'Équipe' : 'Groupe';
}

function collectiveCard(collective, state) {
  const members = collective.memberIds
    .map((id) => state.athletes[id])
    .filter(Boolean);
  const assignments = Object.values(state.athletes).flatMap((athlete) =>
    athlete.routineAssignments.filter((assignment) => assignment.collectiveId === collective.id),
  );
  const shared = assignments.filter((assignment) => assignment.feedback?.shared).length;
  return `<a class="collective-card" href="#/coach/collectifs/${collective.id}">
    <div class="collective-card__top">
      <span class="collective-type collective-type--${collective.type}">${typeLabel(collective.type)}</span>
      <span class="fineprint">${members.length} membre${members.length > 1 ? 's' : ''}</span>
    </div>
    <h2>${escapeHTML(collective.name)}</h2>
    ${collective.description ? `<p>${escapeHTML(collective.description)}</p>` : ''}
    <div class="collective-card__members">
      ${members.map((member) => avatar(member, { size: 'sm' })).join('')}
      <span>${members.map((member) => member.firstName).join(', ')}</span>
    </div>
    <div class="collective-card__foot">
      <span>${assignments.length ? `${assignments.length} assignation${assignments.length > 1 ? 's' : ''}` : 'Aucune routine assignée'}</span>
      <span>${shared ? `${shared} retour${shared > 1 ? 's' : ''} partagé${shared > 1 ? 's' : ''}` : ''}</span>
      ${icon('chevronRight', { size: 16 })}
    </div>
  </a>`;
}

export function collectivesView({ state }) {
  const collectives = state.collectives;
  return shell({
    active: 'collectives',
    content: `
      ${pageHead({
        eyebrow: 'Équipes & groupes',
        title: 'Collectifs',
        subtitle: `${collectives.length} collectif${collectives.length > 1 ? 's' : ''} · assignation de routines à plusieurs`,
        action: `<button class="btn btn--primary" data-action="open-collective-form" type="button">${icon('plus', { size: 16 })} Créer un collectif</button>`,
      })}
      ${collectives.length
        ? `<div class="collective-grid">${collectives.map((collective) => collectiveCard(collective, state)).join('')}</div>`
        : `<div class="card"><div class="empty empty--light">
            <span class="empty__icon">${icon('users', { size: 22 })}</span>
            <p class="empty__title">Aucun collectif pour l’instant</p>
            <p class="empty__text">Une <strong>Équipe</strong> rassemble un collectif qui joue ensemble. Un <strong>Groupe</strong> rassemble un atelier ou un objectif de travail. Un sportif peut appartenir à plusieurs collectifs.</p>
            <button class="btn btn--primary btn--small" data-action="open-collective-form" type="button">Créer le premier collectif</button>
          </div></div>`}
      <p class="coach-note">${icon('info', { size: 15 })}<span>Chaque sportif reçoit sa propre assignation et répond en privé. La vue collective montre qui a essayé et quels retours ont été partagés.</span></p>
    `,
  });
}

function groupAssignments(collective, state) {
  const byBatch = new Map();
  for (const athlete of Object.values(state.athletes)) {
    for (const assignment of athlete.routineAssignments) {
      if (assignment.collectiveId !== collective.id) continue;
      const key = assignment.batchId ?? assignment.id;
      if (!byBatch.has(key)) {
        byBatch.set(key, {
          batchId: key,
          title: assignment.title,
          instruction: assignment.instruction,
          context: assignment.context,
          assignedAt: assignment.assignedAt,
          recipients: [],
        });
      }
      byBatch.get(key).recipients.push({ athlete, assignment });
    }
  }
  return [...byBatch.values()].sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
}

export function collectiveView({ state, collective }) {
  const members = collective.memberIds.map((id) => state.athletes[id]).filter(Boolean);
  const batches = groupAssignments(collective, state);
  const allAssignments = batches.flatMap((batch) => batch.recipients.map((row) => row.assignment));
  const tried = allAssignments.filter((assignment) => assignment.status === 'tried').length;
  const shared = allAssignments.filter((assignment) => assignment.feedback?.shared).length;

  return shell({
    active: 'collectives',
    content: `
      ${pageHead({
        eyebrow: `${typeLabel(collective.type)} · collectif`,
        title: collective.name,
        subtitle: collective.description || `${members.length} sportif${members.length > 1 ? 's' : ''} · ${typeLabel(collective.type)}`,
        breadcrumb: `<a href="#/coach/collectifs">Collectifs</a> <span>/</span> ${escapeHTML(collective.name)}`,
        action: `<div class="head-actions">
          <button class="btn btn--outline btn--small" data-action="open-collective-form" data-collective="${collective.id}" type="button">Modifier</button>
          <button class="btn btn--primary btn--small" data-action="open-assign-routine" data-collective="${collective.id}" type="button">${icon('plus', { size: 15 })} Assigner une routine</button>
        </div>`,
      })}

      <div class="stats stats--compact">
        <article class="stat"><span class="stat__label">Membres</span><strong>${members.length}</strong></article>
        <article class="stat"><span class="stat__label">Ont essayé</span><strong>${tried}</strong></article>
        <article class="stat"><span class="stat__label">Retours partagés</span><strong>${shared}</strong></article>
      </div>

      <section class="card">
        <header class="card__head">
          <h2>Membres</h2>
          <button class="text-link text-link--small" data-action="open-collective-form" data-collective="${collective.id}" type="button">Modifier la liste</button>
        </header>
        <ul class="collective-members">
          ${members
            .map(
              (member) => `<li>
                <a href="#/coach/sportifs/${member.id}?tab=routines">
                  ${avatar(member, { size: 'sm' })}
                  <span><strong>${escapeHTML(member.name)}</strong><small>${escapeHTML(member.sport)}</small></span>
                  ${icon('chevronRight', { size: 15 })}
                </a>
              </li>`,
            )
            .join('')}
        </ul>
      </section>

      <section class="card">
        <header class="card__head">
          <div><p class="eyebrow">À deux</p><h2>Routines assignées</h2></div>
          <button class="btn btn--primary btn--small" data-action="open-assign-routine" data-collective="${collective.id}" type="button">${icon('plus', { size: 15 })} Assigner</button>
        </header>
        ${batches.length
          ? `<div class="collective-routines">${batches
              .map((batch) => {
                const batchTried = batch.recipients.filter(
                  (row) => row.assignment.status === 'tried',
                ).length;
                const batchShared = batch.recipients.filter(
                  (row) => row.assignment.feedback?.shared,
                ).length;
                return `<article class="collective-routine">
                  <div class="collective-routine__head">
                    <div>
                      <span class="routine-origin">Aga · ${typeLabel(collective.type).toLowerCase()}</span>
                      <h3>${escapeHTML(batch.title)}</h3>
                      ${batch.instruction ? `<p class="routine-instruction">« ${escapeHTML(batch.instruction)} »</p>` : ''}
                      <p class="fineprint">${formatDate(batch.assignedAt, { day: 'numeric', month: 'short' })}${batch.context ? ` · ${escapeHTML(batch.context)}` : ''}</p>
                    </div>
                    <span class="pill pill--outline">${batch.recipients.length} destinataire${batch.recipients.length > 1 ? 's' : ''}</span>
                  </div>
                  <div class="collective-routine__progress">
                    <span>${batchTried}/${batch.recipients.length} ont essayé</span>
                    <span>${batchShared} retour${batchShared > 1 ? 's' : ''} partagé${batchShared > 1 ? 's' : ''}</span>
                  </div>
                  <ul class="collective-routine__recipients">
                    ${batch.recipients
                      .map(
                        ({ athlete, assignment }) => `<li>
                          <a href="#/coach/sportifs/${athlete.id}?tab=routines">
                            ${avatar(athlete, { size: 'sm' })}
                            <span><strong>${escapeHTML(athlete.firstName)}</strong><small>${assignment.status === 'tried' ? (assignment.feedback?.shared ? 'A essayé · retour partagé' : 'A essayé · retour privé') : 'Pas encore essayée'}</small></span>
                            ${assignment.feedback?.shared ? `<span class="feedback-chip feedback-chip--${assignment.feedback.helpfulness === 'helped' ? 'success' : assignment.feedback.helpfulness === 'somewhat' ? 'info' : 'muted'}">${assignment.feedback.helpfulness === 'helped' ? 'Aidé' : assignment.feedback.helpfulness === 'somewhat' ? 'Un peu' : 'Pas cette fois'}</span>` : icon('chevronRight', { size: 15 })}
                          </a>
                        </li>`,
                      )
                      .join('')}
                  </ul>
                </article>`;
              })
              .join('')}</div>`
          : `<div class="empty empty--light"><span class="empty__icon">${icon('target', { size: 21 })}</span><p class="empty__title">Aucune routine assignée au collectif</p><p class="empty__text">Choisis une routine, une consigne, puis les membres destinataires.</p><button class="btn btn--outline btn--small" data-action="open-assign-routine" data-collective="${collective.id}" type="button">Assigner une routine</button></div>`}
      </section>
      <p class="coach-note">${icon('info', { size: 15 })}<span>Le détail d’un retour s’ouvre dans la fiche du sportif. Chaque réponse reste attachée à son compte, même après rechargement.</span></p>
    `,
  });
}
