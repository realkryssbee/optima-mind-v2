import { COACH, DIMENSIONS, STATUS, getResource } from '../data.js';
import { averageScore, formatScore } from '../scoring.js';
import { escapeHTML, formatDate, relativeTime, dateTimeNowLabel } from '../utils.js';
import { icon } from '../ui/icons.js';
import {
  avatar,
  coachTabs,
  scoreRows,
  statusChip,
  trackingChart,
} from '../ui/components.js';

const NAV = [
  { key: 'dashboard', href: '#/coach', label: 'Accueil', icon: 'home' },
  { key: 'athletes', href: '#/coach/sportifs', label: 'Sportifs', icon: 'users' },
  { key: 'questionnaires', href: '#/coach/questionnaires', label: 'Questionnaires', icon: 'clipboard' },
  { key: 'resources', href: '#/coach/ressources', label: 'Ressources', icon: 'layers' },
];

function navItems(active) {
  return NAV.map(
    (item) => `<a class="coach__nav-item ${active === item.key ? 'is-active' : ''}" href="${item.href}" ${active === item.key ? 'aria-current="page"' : ''}>
      ${icon(item.icon, { size: 19 })}<span>${item.label}</span>
    </a>`,
  ).join('');
}

export function shell({ active, content, title = 'Espace Aga' }) {
  const config = window.OMIND_CONFIG ?? {};
  const siteUrl = config.siteUrl ?? 'https://www.optima-mind.com';

  return `<div class="coach">
    <header class="coach__top">
      <div class="coach__title">
        <span class="wordmark wordmark--coach">O’MIND</span>
        <span class="coach__dash">—</span>
        <span class="coach__space">${title}</span>
        <span class="pill pill--demo coach__demo-pill">Démo</span>
      </div>
      <div class="coach__top-right">
        <span class="coach__byline">O’MIND by Optima Mind · Démo</span>
        <button class="coach__reset-mobile" data-action="reset-demo" type="button" aria-label="Réinitialiser la démo">
          ${icon('reset', { size: 16 })}
        </button>
        <a class="btn btn--ghost btn--small coach__switch" href="#/aujourdhui">
          ${icon('user', { size: 16 })} Espace sportif
        </a>
      </div>
    </header>

    <aside class="coach__nav" aria-label="Navigation de l’espace Aga">
      <div class="coach__nav-brand">
        <span class="wordmark wordmark--coachnav">O’MIND</span>
        <p>Espace Aga</p>
      </div>
      <nav class="coach__nav-list">${navItems(active)}</nav>
      <div class="coach__nav-foot">
        <div class="coach__demo">
          <span class="pill pill--demo">Démo</span>
          <p>Comptes et données simulés.</p>
        </div>
        <a class="coach__nav-link" href="#/aujourdhui">${icon('user', { size: 16 })} Voir l’espace sportif</a>
        <button class="coach__nav-link" data-action="reset-demo" type="button">${icon('reset', { size: 16 })} Réinitialiser la démo</button>
        <a class="coach__nav-link" href="${siteUrl}" target="_blank" rel="noopener noreferrer">${icon('external', { size: 16 })} optima-mind.com</a>
        <p class="coach__version">Prototype v0.1 · démonstration</p>
      </div>
    </aside>

    <div class="coach__main" id="coach-main">${content}</div>
  </div>`;
}

export function pageHead({ eyebrow, title, subtitle, action = '', breadcrumb = '' }) {
  return `<header class="coach-page-head">
    ${breadcrumb ? `<p class="breadcrumb">${breadcrumb}</p>` : ''}
    <div class="coach-page-head__row">
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h1 class="display display--page" id="view-title">${title}</h1>
        <p class="coach-page-head__sub">${subtitle}</p>
      </div>
      ${action}
    </div>
  </header>`;
}

function lastCheckin(athlete) {
  if (!athlete.checkins.length) return null;
  return [...athlete.checkins].sort((a, b) => b.date.localeCompare(a.date))[0];
}

function assignmentAction(athlete, { compact = false } = {}) {
  const status = athlete.assignment?.status ?? null;
  if (!status) {
    return `<button class="btn btn--primary ${compact ? 'btn--small' : ''}" data-action="assign-questionnaire" data-athlete="${athlete.id}" type="button" aria-label="Attribuer le questionnaire 4C à ${escapeHTML(athlete.firstName)}">Attribuer le questionnaire${compact ? '' : ' 4C'}</button>`;
  }
  if (status === 'todo') {
    return `<button class="btn btn--primary ${compact ? 'btn--small' : ''}" data-action="send-questionnaire" data-athlete="${athlete.id}" type="button" aria-label="Marquer le questionnaire comme envoyé à ${escapeHTML(athlete.firstName)}">Marquer comme envoyé</button>`;
  }
  if (status === 'in_progress') {
    return `<button class="btn btn--primary ${compact ? 'btn--small' : ''}" data-action="simulate-questionnaire" data-athlete="${athlete.id}" type="button" aria-label="Simuler la réponse de ${escapeHTML(athlete.firstName)} au questionnaire">Simuler la réponse</button>`;
  }
  return `<button class="btn btn--outline ${compact ? 'btn--small' : ''}" data-action="assign-questionnaire" data-athlete="${athlete.id}" type="button" aria-label="Relancer le questionnaire de ${escapeHTML(athlete.firstName)}">Relancer le questionnaire</button>`;
}

export function coachDashboardView({ state }) {
  const athletes = Object.values(state.athletes);
  const pending = athletes.filter(
    (athlete) => athlete.assignment && athlete.assignment.status !== 'completed',
  );
  const withoutAssignment = athletes.filter((athlete) => !athlete.assignment);
  const sharedCount = athletes.reduce((total, athlete) => total + athlete.shared.length, 0);
  const latestCheckins = athletes
    .map((athlete) => ({ athlete, checkin: lastCheckin(athlete) }))
    .filter((row) => row.checkin)
    .sort((a, b) => b.checkin.date.localeCompare(a.checkin.date));

  const todayLabel = new Intl.DateTimeFormat('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const tasks = [];
  pending.forEach((athlete) => {
    tasks.push({
      title: `Questionnaire 4C · ${athlete.name}`,
      meta: STATUS[athlete.assignment.status].label,
      href: `#/coach/sportifs/${athlete.id}`,
      athlete,
      tone: athlete.assignment.status === 'todo' ? 'warn' : 'info',
    });
  });
  withoutAssignment.forEach((athlete) => {
    tasks.push({
      title: `Attribuer un questionnaire · ${athlete.name}`,
      meta: 'Aucun questionnaire',
      href: `#/coach/sportifs/${athlete.id}`,
      athlete,
      tone: 'neutral',
    });
  });

  const content = `
    ${pageHead({
      eyebrow: `Tableau de bord · ${todayLabel}`,
      title: 'Bonjour Aga',
      subtitle: COACH.role,
      action: `<button class="btn btn--primary" data-action="go" data-href="#/coach/questionnaires" type="button">${icon('clipboard', { size: 17 })} Suivre les questionnaires</button>`,
    })}

    <div class="stats">
      <article class="stat">
        <span class="stat__label">Sportifs suivis</span>
        <strong>${athletes.length}</strong>
        <small>${athletes.map((athlete) => athlete.firstName).join(' · ')}</small>
      </article>
      <article class="stat">
        <span class="stat__label">À traiter</span>
        <strong>${pending.length + withoutAssignment.length}</strong>
        <small>questionnaire${pending.length + withoutAssignment.length > 1 ? 's' : ''} en attente</small>
      </article>
      <article class="stat">
        <span class="stat__label">Ressources partagées</span>
        <strong>${sharedCount}</strong>
        <small>dans les espaces sportifs</small>
      </article>
    </div>

    <div class="coach-grid">
      <section class="card">
        <header class="card__head">
          <h2>À traiter</h2>
          <a class="text-link text-link--small" href="#/coach/questionnaires">Tout voir ${icon('arrowRight', { size: 13 })}</a>
        </header>
        ${tasks.length
          ? `<ul class="task-list">
              ${tasks
                .map(
                  (task) => `<li>
                    <a class="task" href="${task.href}">
                      ${avatar(task.athlete, { size: 'sm' })}
                      <span class="task__copy">
                        <strong>${task.title}</strong>
                        <small>${task.meta}</small>
                      </span>
                      <span class="task__dot task__dot--${task.tone}"></span>
                      ${icon('chevronRight', { size: 17 })}
                    </a>
                  </li>`,
                )
                .join('')}
            </ul>`
          : `<div class="empty empty--light empty--inline"><span class="empty__icon">${icon('check', { size: 20 })}</span><p class="empty__title">Tout est à jour</p></div>`}
      </section>

      <section class="card">
        <header class="card__head">
          <h2>Derniers bilans</h2>
          <span class="pill pill--outline">Fictifs</span>
        </header>
        ${latestCheckins.length
          ? `<ul class="checkin-list">
              ${latestCheckins
                .map(
                  ({ athlete, checkin }) => `<li>
                    <a class="checkin-row" href="#/coach/sportifs/${athlete.id}?tab=bilans">
                      <span class="checkin-row__who">
                        <strong>${athlete.firstName}</strong>
                        <small>${relativeTime(`${checkin.date}T12:00:00`)}</small>
                      </span>
                      <span class="checkin-row__values">
                        <span><em>H</em>${checkin.mood}</span>
                        <span><em>É</em>${checkin.energy}</span>
                        <span><em>S</em>${checkin.sleep}</span>
                      </span>
                    </a>
                  </li>`,
                )
                .join('')}
            </ul>`
          : `<div class="empty empty--light empty--inline"><p class="empty__title">Aucun bilan</p></div>`}
      </section>
    </div>

    <section class="card card--library">
      <header class="card__head">
        <div>
          <p class="eyebrow">Bibliothèque</p>
          <h2>Ressources récentes</h2>
        </div>
        <a class="text-link text-link--small" href="#/coach/ressources">Partager une ressource ${icon('arrowRight', { size: 13 })}</a>
      </header>
      <div class="resource-mini-grid">
        ${['respiration', 'recentrage', 'video']
          .map((id) => {
            const resource = getResource(id);
            return `<button class="resource-mini" data-action="open-share" data-athlete="lea" data-resource="${id}" type="button">
              <span class="resource-mini__icon">${icon(id === 'respiration' ? 'wind' : id === 'video' ? 'video' : 'target', { size: 20 })}</span>
              <span class="resource-mini__copy">
                <strong>${resource.title}</strong>
                <small>${resource.kind} · ${resource.duration}</small>
              </span>
              <span class="resource-mini__send">${icon('send', { size: 15 })}</span>
            </button>`;
          })
          .join('')}
      </div>
    </section>
  `;

  return shell({ active: 'dashboard', content });
}

export function coachAthletesView({ state }) {
  const athletes = Object.values(state.athletes);
  const content = `
    ${pageHead({
      eyebrow: 'Suivi',
      title: 'Sportifs',
      subtitle: `${athletes.length} sportifs suivis · comptes de démonstration`,
      action: `<span class="pill pill--outline">${icon('users', { size: 14 })} ${athletes.length} fiches</span>`,
    })}

    <section class="card card--flush">
      <div class="athlete-table">
        <div class="athlete-table__head" aria-hidden="true">
          <span>Sportif</span>
          <span>Dernier bilan</span>
          <span>Profil 4C</span>
          <span>Questionnaire</span>
          <span class="sr-only">Ouvrir</span>
        </div>
        ${athletes
          .map((athlete) => {
            const checkin = lastCheckin(athlete);
            const profile = athlete.profile;
            const rowLabel = [
              athlete.name,
              athlete.sport,
              checkin
                ? `dernier bilan ${relativeTime(`${checkin.date}T12:00:00`)}, humeur ${checkin.mood}, énergie ${checkin.energy}, sommeil ${checkin.sleep}`
                : 'aucun bilan',
              profile
                ? `profil 4C ${formatScore(averageScore(profile))} sur 5`
                : 'profil 4C en attente',
              athlete.assignment
                ? `questionnaire ${STATUS[athlete.assignment.status].label.toLowerCase()}`
                : 'questionnaire non attribué',
              'ouvrir la fiche',
            ].join(', ');
            return `<a class="athlete-row" href="#/coach/sportifs/${athlete.id}" aria-label="${escapeHTML(rowLabel)}">
              <span class="athlete-row__who">
                ${avatar(athlete, { size: 'md' })}
                <span>
                  <strong>${athlete.name}${athlete.demoAccount ? ' <em class="chip chip--demo">Démo</em>' : ''}</strong>
                  <small>${athlete.sport} · ${athlete.club}</small>
                </span>
              </span>
              <span class="athlete-row__checkin">
                ${checkin
                  ? `<strong>${relativeTime(`${checkin.date}T12:00:00`)}</strong><small>H ${checkin.mood} · É ${checkin.energy} · S ${checkin.sleep}</small>`
                  : '<small>—</small>'}
              </span>
              <span class="athlete-row__score">
                ${profile ? `<strong>${formatScore(averageScore(profile))}<small>/5</small></strong>` : '<small>En attente</small>'}
              </span>
              <span class="athlete-row__status">
                ${athlete.assignment ? statusChip(athlete.assignment.status) : '<span class="status status--muted">Non attribué</span>'}
              </span>
              <span class="athlete-row__chev">${icon('chevronRight', { size: 18 })}</span>
            </a>`;
          })
          .join('')}
      </div>
    </section>

    <p class="coach-note">${icon('info', { size: 15 })}<span>Les fiches, bilans et questionnaires sont fictifs. Les actions d’attribution et de partage sont simulées et persistées localement.</span></p>
  `;
  return shell({ active: 'athletes', content });
}

function shareList(athlete) {
  if (!athlete.shared.length) {
    return `<div class="empty empty--light empty--inline">
      <span class="empty__icon">${icon('layers', { size: 20 })}</span>
      <p class="empty__title">Aucune ressource partagée</p>
      <button class="btn btn--outline btn--small" data-action="open-share" data-athlete="${athlete.id}" type="button">Partager une ressource</button>
    </div>`;
  }
  return `<ul class="shared-list">
    ${athlete.shared
      .map((share) => {
        const resource = getResource(share.resourceId);
        return `<li class="shared-list__row">
          <span class="shared-list__icon">${icon(resource?.category === 'Vidéo' ? 'video' : resource?.category === 'Respiration' ? 'wind' : 'target', { size: 18 })}</span>
          <span class="shared-list__copy">
            <strong>${resource?.title ?? 'Ressource'}</strong>
            <small>${resource?.kind ?? ''} · partagée ${relativeTime(share.sharedAt)}</small>
            ${share.message ? `<em>« ${escapeHTML(share.message)} »</em>` : ''}
          </span>
          <button class="icon-btn" data-action="open-share" data-athlete="${athlete.id}" data-resource="${share.resourceId}" aria-label="Renvoyer ${resource?.title ?? 'cette ressource'}" type="button">${icon('send', { size: 16 })}</button>
        </li>`;
      })
      .join('')}
  </ul>`;
}

function questionnaireCard(athlete) {
  const assignment = athlete.assignment;
  return `<section class="card">
    <header class="card__head">
      <h2>Questionnaire 4C</h2>
      ${assignment ? statusChip(assignment.status) : '<span class="status status--muted">Non attribué</span>'}
    </header>
    <div class="questionnaire-card">
      <span class="questionnaire-card__icon">${icon('clipboard', { size: 20 })}</span>
      <div class="questionnaire-card__copy">
        <strong>Profil 4C · 20 affirmations</strong>
        <small>${assignment
          ? assignment.completedAt
            ? `Complété le ${formatDate(assignment.completedAt, { year: 'numeric' })}`
            : assignment.status === 'in_progress'
              ? `Envoyé le ${formatDate(assignment.sentAt, { year: 'numeric' })} · en attente de réponse`
              : `Attribué le ${formatDate(assignment.assignedAt, { year: 'numeric' })} · pas encore envoyé`
          : 'Aucun questionnaire attribué pour le moment.'}</small>
      </div>
    </div>
    <p class="questionnaire-card__note">${assignment?.status === 'completed'
      ? 'La réponse a été simulée dans cette démo. Le profil 4C est visible ci-contre.'
      : 'Attribution et réponse simulées : aucun email n’est envoyé. Le statut évolue avec le bouton en haut de la fiche.'}</p>
  </section>`;
}

export function coachQuestionnairesView({ state }) {
  const athletes = Object.values(state.athletes);
  const pending = athletes.filter(
    (athlete) => athlete.assignment && athlete.assignment.status !== 'completed',
  ).length;
  const completed = athletes.filter((athlete) => athlete.assignment?.status === 'completed').length;

  const content = `
    ${pageHead({
      eyebrow: 'Suivi',
      title: 'Questionnaires',
      subtitle: `${pending} en attente · ${completed} complété${completed > 1 ? 's' : ''} · données simulées`,
      action: `<span class="pill pill--outline">${icon('clipboard', { size: 14 })} 4C · 20 affirmations</span>`,
    })}

    <section class="card card--flush">
      <div class="athlete-table athlete-table--quest">
        <div class="athlete-table__head" aria-hidden="true">
          <span>Sportif</span>
          <span>Statut</span>
          <span>Attribué</span>
          <span>Action</span>
        </div>
        ${athletes
          .map(
            (athlete) => `<div class="athlete-row athlete-row--static">
              <span class="athlete-row__who">
                ${avatar(athlete, { size: 'md' })}
                <span><strong>${athlete.name}</strong><small>${athlete.sport}</small></span>
              </span>
              <span>${athlete.assignment ? statusChip(athlete.assignment.status) : '<span class="status status--muted">Non attribué</span>'}</span>
              <span class="muted-cell">${athlete.assignment ? formatDate(athlete.assignment.assignedAt, { year: 'numeric' }) : '—'}</span>
              <span>${assignmentAction(athlete, { compact: true })}</span>
            </div>`,
          )
          .join('')}
      </div>
    </section>

    <p class="coach-note">${icon('info', { size: 15 })}<span>Le statut évolue à chaque action : <strong>à faire</strong> → <strong>envoyé</strong> → <strong>complété</strong>. La réponse du sportif est simulée pour la démonstration.</span></p>
  `;
  return shell({ active: 'questionnaires', content });
}

export function coachResourcesView({ state }) {
  const content = `
    ${pageHead({
      eyebrow: 'Bibliothèque',
      title: 'Ressources',
      subtitle: 'Ce que tu peux partager après une séance · 3 contenus de démonstration',
      action: `<button class="btn btn--primary" data-action="open-share" data-athlete="lea" type="button">${icon('send', { size: 16 })} Partager à Léa</button>`,
    })}

    <div class="library-grid">
      ${['respiration', 'recentrage', 'video']
        .map((id) => {
          const resource = getResource(id);
          const shares = Object.values(state.athletes).flatMap((athlete) =>
            athlete.shared
              .filter((share) => share.resourceId === id)
              .map((share) => ({ athlete, share })),
          );
          return `<article class="library-card">
            <span class="library-card__icon">${icon(id === 'respiration' ? 'wind' : id === 'video' ? 'video' : 'target', { size: 22 })}</span>
            <p class="eyebrow">${resource.kind} · ${resource.duration}</p>
            <h2>${resource.title}</h2>
            <p>${resource.pitch}</p>
            <div class="library-card__foot">
              <span class="library-card__count">${shares.length ? `Partagée à ${shares.map((row) => row.athlete.firstName).join(', ')}` : 'Pas encore partagée'}</span>
              <button class="btn btn--outline btn--small" data-action="open-share" data-athlete="lea" data-resource="${id}" type="button">Partager</button>
            </div>
          </article>`;
        })
        .join('')}
    </div>

    <section class="card">
      <header class="card__head"><h2>Derniers partages</h2></header>
      ${Object.values(state.athletes).some((athlete) => athlete.shared.length)
        ? `<ul class="shared-list">
            ${Object.values(state.athletes)
              .flatMap((athlete) => athlete.shared.map((share) => ({ athlete, share })))
              .sort((a, b) => b.share.sharedAt.localeCompare(a.share.sharedAt))
              .map(({ athlete, share }) => {
                const resource = getResource(share.resourceId);
                return `<li class="shared-list__row">
                  <span class="shared-list__icon">${icon(resource?.category === 'Vidéo' ? 'video' : 'target', { size: 18 })}</span>
                  <span class="shared-list__copy">
                    <strong>${resource?.title}</strong>
                    <small>à ${athlete.name} · ${relativeTime(share.sharedAt)}</small>
                  </span>
                  <a class="icon-btn" href="#/coach/sportifs/${athlete.id}?tab=ressources" aria-label="Ouvrir la fiche de ${athlete.name}">${icon('chevronRight', { size: 17 })}</a>
                </li>`;
              })
              .join('')}
          </ul>`
        : `<div class="empty empty--light empty--inline"><span class="empty__icon">${icon('layers', { size: 20 })}</span><p class="empty__title">Aucun partage pour l’instant</p></div>`}
      <p class="fineprint">Les ressources sont des exemples. La vidéo n’est pas hébergée dans ce prototype.</p>
    </section>
  `;
  return shell({ active: 'resources', content });
}


