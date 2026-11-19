import { escapeHTML } from '../utils.js';
import { averageScore, formatScore } from '../scoring.js';
import { icon } from './icons.js';
import { avatar } from './components.js';

export function athleteSwitcher({ state, currentId, tab = 'overview', variant = 'rail' }) {
  const athletes = Object.values(state.athletes);
  const recentIds = (state.coachRecent ?? []).filter((id) => state.athletes[id]).slice(0, 3);
  const recent = recentIds.map((id) => state.athletes[id]);
  const collectives = state.collectives ?? [];
  const searchId = `athlete-search-${variant}`;

  const row = (athlete) => {
    const memberships = collectives
      .filter((collective) => collective.memberIds.includes(athlete.id))
      .map((collective) => collective.id)
      .join(' ');
    const profile = athlete.profile;
    const active = athlete.id === currentId;
    return `<li data-switch-row data-name="${escapeHTML(athlete.name.toLowerCase())}" data-collectives="${memberships}">
      <a class="athlete-switch ${active ? 'is-active' : ''}" href="#/coach/sportifs/${athlete.id}?tab=${tab}" data-athlete-switch="${athlete.id}" ${active ? 'aria-current="page"' : ''}>
        ${avatar(athlete, { size: 'sm' })}
        <span class="athlete-switch__copy">
          <strong>${escapeHTML(athlete.name)}</strong>
          <small>${escapeHTML(athlete.sport)}${profile ? ` · ${formatScore(averageScore(profile))}/5` : ''}</small>
        </span>
        <span class="athlete-switch__chev">${icon('chevronRight', { size: 15 })}</span>
      </a>
    </li>`;
  };

  return `<div class="athlete-switcher" data-athlete-switcher>
    <div class="athlete-switcher__search">
      <label class="sr-only" for="${searchId}">Rechercher un sportif</label>
      <span class="athlete-switcher__icon">${icon('search', { size: 16 })}</span>
      <input id="${searchId}" type="search" placeholder="Rechercher un nom" autocomplete="off" data-athlete-search>
    </div>
    <div class="athlete-switcher__filters" role="group" aria-label="Filtrer par collectif">
      <button class="filter-chip is-active" type="button" data-switch-collective="all">Tous</button>
      ${collectives
        .map(
          (collective) => `<button class="filter-chip" type="button" data-switch-collective="${collective.id}" title="${collective.type === 'team' ? 'Équipe' : 'Groupe'}">${escapeHTML(collective.name)}</button>`,
        )
        .join('')}
    </div>
    ${recent.length
      ? `<p class="athlete-switcher__label">Récents</p>
        <ul class="athlete-switch-list athlete-switch-list--recent" data-switch-list>${recent.map(row).join('')}</ul>`
      : ''}
    <p class="athlete-switcher__label">Tous les sportifs <span>${athletes.length}</span></p>
    <ul class="athlete-switch-list" data-switch-list>${athletes.map(row).join('')}</ul>
    <p class="athlete-switcher__empty" data-switch-empty hidden>Aucun sportif pour cette recherche.</p>
    <p class="athlete-switcher__hint">${icon('info', { size: 13 })} Changer de fiche conserve l’onglet en cours.</p>
  </div>`;
}
