import { DIMENSIONS, STATUS, getResource, RESOURCES } from '../data.js';
import { formatScore } from '../scoring.js';
import { escapeHTML, lastSevenDays, dayNumber, formatDate, weekdayShort } from '../utils.js';
import { icon } from './icons.js';

/** Signature O’MIND : deux fines courbes de piste d’athlétisme. */
export function trackCurves(className = '') {
  return `<svg class="curves ${className}" viewBox="0 0 420 240" fill="none" aria-hidden="true" focusable="false">
    <path d="M-40 222C78 130 190 66 462 -14" stroke="currentColor" stroke-width="1.4"/>
    <path d="M18 258C140 166 252 102 500 24" stroke="currentColor" stroke-width="1.4"/>
  </svg>`;
}

export function avatar(athlete, { size = 'md', className = '' } = {}) {
  return `<span class="avatar avatar--${size} ${className}" aria-hidden="true">${escapeHTML(athlete.initials)}</span>`;
}

export function statusChip(status) {
  const meta = STATUS[status] ?? STATUS.todo;
  return `<span class="status status--${meta.tone}"><span class="status__dot"></span>${meta.label}</span>`;
}

export function scoreGrid(profile, { highlight = null, compact = false } = {}) {
  return `<div class="scoregrid ${compact ? 'scoregrid--compact' : ''}">
    ${DIMENSIONS.map((dimension) => {
      const value = profile?.scores?.[dimension.key];
      const isLow = highlight === dimension.key;
      return `<div class="scoregrid__cell ${isLow ? 'is-low' : ''}">
        <span class="scoregrid__label">${dimension.name}${isLow ? '<em class="scoregrid__flag">à explorer</em>' : ''}</span>
        <span class="scoregrid__value">${value == null ? '—' : formatScore(value)}<span class="scoregrid__max">/5</span></span>
      </div>`;
    }).join('')}
  </div>`;
}

export function scoreRows(profile) {
  if (!profile) {
    return `<div class="empty empty--dark">
      <span class="empty__icon">${icon('target', { size: 22 })}</span>
      <p>Profil 4C en attente.<br>Le questionnaire n’a pas encore été complété.</p>
    </div>`;
  }
  return `<ul class="score-rows">
    ${DIMENSIONS.map(
      (dimension) => `<li>
        <span>${dimension.name}</span>
        <strong>${formatScore(profile.scores[dimension.key])} <small>/ 5</small></strong>
      </li>`,
    ).join('')}
  </ul>`;
}

export function tabbar(active) {
  const items = [
    { key: 'today', href: '#/aujourdhui', label: 'Aujourd’hui', icon: 'calendar' },
    { key: 'profile', href: '#/espace/profil', label: 'Profil', icon: 'user' },
    { key: 'resources', href: '#/espace/ressources', label: 'Ressources', icon: 'layers' },
  ];
  return `<nav class="tabbar" aria-label="Navigation de l’espace sportif">
    ${items
      .map(
        (item) => `<a class="tabbar__item ${active === item.key ? 'is-active' : ''}" href="${item.href}" ${active === item.key ? 'aria-current="page"' : ''}>
          ${icon(item.icon, { size: 21 })}
          <span>${item.label}</span>
        </a>`,
      )
      .join('')}
  </nav>`;
}

export function flowHeader({ back = '#/accueil', title = 'Profil 4C', right = '' }) {
  return `<header class="flowbar">
    <a class="flowbar__back" href="${back}" aria-label="Revenir en arrière">${icon('back', { size: 22 })}</a>
    <span class="flowbar__title">${title}</span>
    <span class="flowbar__right">${right}</span>
  </header>`;
}

export function sectionHeading({ eyebrow = '', title, action = '' }) {
  return `<div class="section-heading">
    <div>
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
      <h2>${title}</h2>
    </div>
    ${action}
  </div>`;
}

export function emptyState({ iconName = 'info', title, text = '', action = '', tone = 'light' }) {
  return `<div class="empty empty--${tone}">
    <span class="empty__icon">${icon(iconName, { size: 22 })}</span>
    <p class="empty__title">${title}</p>
    ${text ? `<p class="empty__text">${text}</p>` : ''}
    ${action}
  </div>`;
}

function sparkline(values) {
  const points = values
    .map((value, index) => (value == null ? null : `${(index / 6) * 100},${30 - ((value - 1) / 9) * 26}`))
    .filter(Boolean);
  if (points.length < 2) return '';
  return `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <polyline points="${points.join(' ')}" fill="none" vector-effect="non-scaling-stroke" />
  </svg>`;
}

export function trackingChart(checkins) {
  const days = lastSevenDays();
  const byDate = new Map(checkins.map((checkin) => [checkin.date, checkin]));
  const metrics = [
    { key: 'mood', label: 'Humeur', className: 'mood' },
    { key: 'energy', label: 'Énergie', className: 'energy' },
    { key: 'sleep', label: 'Sommeil', className: 'sleep' },
  ];

  const summary = metrics
    .map((metric) => {
      const values = days.map((day) => byDate.get(day)?.[metric.key] ?? null);
      const last = [...values].reverse().find((value) => value != null);
      return `${metric.label} ${last == null ? 'non renseigné' : `${last} sur 10`}`;
    })
    .join(', ');

  return `<div class="chart" role="img" aria-label="Suivi des sept derniers jours : ${summary}">
    <div class="chart__rows">
      ${metrics
        .map((metric) => {
          const values = days.map((day) => byDate.get(day)?.[metric.key] ?? null);
          const last = [...values].reverse().find((value) => value != null);
          return `<div class="chart__row">
            <span class="chart__name"><i class="chart__dot chart__dot--${metric.className}"></i>${metric.label}</span>
            <div class="chart__track">${sparkline(values)}</div>
            <span class="chart__value">${last ?? '—'}<small>/10</small></span>
          </div>`;
        })
        .join('')}
    </div>
    <div class="chart__days" aria-hidden="true">
      ${days
        .map((day) => {
          const isToday = day === days[days.length - 1];
          return `<span class="${isToday ? 'is-today' : ''}" title="${formatDate(day)}">
            <em>${weekdayShort(day).slice(0, 1)}</em>${dayNumber(day)}
          </span>`;
        })
        .join('')}
    </div>
  </div>`;
}

export function resourceIcon(resourceId, { size = 22 } = {}) {
  const resource = getResource(resourceId);
  if (!resource) return icon('layers', { size });
  if (resource.category === 'Respiration') return icon('wind', { size });
  if (resource.category === 'Vidéo') return icon('video', { size });
  return icon('target', { size });
}

export function resourceMeta(resource) {
  return `${resource.kind} · ${resource.duration}`;
}

export function sharedResourceCard(share, { href = '#' } = {}) {
  const resource = getResource(share.resourceId);
  if (!resource) return '';
  return `<button class="shared-card" data-action="open-resource" data-resource="${resource.id}" type="button">
    <span class="shared-card__icon">${resourceIcon(resource.id, { size: 18 })}</span>
    <span class="shared-card__body">
      <span class="shared-card__eyebrow">Partagé par Aga</span>
      <span class="shared-card__title">${resource.title}</span>
      <span class="shared-card__meta">${resource.kind} · ${resource.duration}</span>
    </span>
    <span class="shared-card__play">${icon('play', { size: 16 })}</span>
  </button>`;
}

export function coachTabs(active, athleteId = null) {
  const base = athleteId ? `#/coach/sportifs/${athleteId}` : '#/coach/sportifs';
  const tabs = [
    { key: 'overview', label: 'Aperçu', href: `${base}?tab=overview` },
    { key: 'bilans', label: 'Bilans', href: `${base}?tab=bilans` },
    { key: 'routines', label: 'Routines', href: `${base}?tab=routines` },
    { key: 'carnet', label: 'Carnet', href: `${base}?tab=carnet` },
    { key: 'documents', label: 'Documents', href: `${base}?tab=documents` },
  ];
  return `<div class="coach-tabs" role="tablist" aria-label="Fiche sportive">
    ${tabs
      .map(
        (tab) => `<a role="tab" class="coach-tabs__tab ${active === tab.key ? 'is-active' : ''}" href="${tab.href}" ${active === tab.key ? 'aria-selected="true"' : 'aria-selected="false"'}>${tab.label}</a>`,
      )
      .join('')}
  </div>`;
}

export function resourceOptions(selectedId = null) {
  return RESOURCES.map(
    (resource) => `<label class="choice ${selectedId === resource.id ? 'is-selected' : ''}">
      <input type="radio" name="resource" value="${resource.id}" ${selectedId === resource.id ? 'checked' : ''}>
      <span class="choice__icon">${resourceIcon(resource.id, { size: 19 })}</span>
      <span class="choice__text">
        <strong>${resource.title}</strong>
        <small>${resource.kind}</small>
      </span>
      <span class="choice__check">${icon('check', { size: 15 })}</span>
    </label>`,
  ).join('');
}
