import { RESOURCES } from '../data.js?v=7';
import { relativeTime } from '../utils.js?v=7';
import { icon } from '../ui/icons.js?v=7';
import { resourceIcon, resourceMeta, tabbar, trackCurves } from '../ui/components.js?v=7';

export function resourcesView({ athlete }) {
  const shared = [...athlete.shared].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
  const latest = shared[0] ?? null;
  const sharedIds = new Set(shared.map((share) => share.resourceId));

  return `<div class="resources-page">
    <header class="simple-header">
      <div>
        <p class="eyebrow">Bibliothèque d’Aga</p>
        <h1 class="display display--page" id="view-title">Mes ressources</h1>
      </div>
      <span class="simple-header__badge">${RESOURCES.length}</span>
    </header>

    <div class="resources__body">
      ${latest
        ? `<section class="shared-feature" aria-labelledby="shared-title">
            ${trackCurves('shared-feature__curves')}
            <p class="eyebrow">Partagé par Aga</p>
            <h2 class="display display--feature" id="shared-title">${titleOf(latest.resourceId)}</h2>
            ${latest.message ? `<p class="shared-feature__message">« ${latest.message} »</p>` : ''}
            <p class="shared-feature__meta">${metaOf(latest.resourceId)} · ${relativeTime(latest.sharedAt)}</p>
            <button class="shared-feature__cta" data-action="open-resource" data-resource="${latest.resourceId}" type="button">
              <span class="shared-feature__play">${icon('play', { size: 18 })}</span>
              Ouvrir l’aperçu
            </button>
          </section>`
        : `<section class="shared-feature shared-feature--empty">
            ${trackCurves('shared-feature__curves')}
            <p class="eyebrow">Partagé par Aga</p>
            <h2 class="display display--feature">Rien ne t’a encore été partagé</h2>
            <p class="shared-feature__meta">Aga peut t’envoyer un exercice, une routine ou une vidéo depuis son espace.</p>
            <a class="text-link" href="#/coach">Voir l’espace Aga ${icon('arrowRight', { size: 14 })}</a>
          </section>`}

      <section class="library" aria-labelledby="library-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">À explorer librement</p>
            <h2 class="display display--sm" id="library-title">La bibliothèque</h2>
          </div>
          <span class="pill pill--outline">Aperçus démo</span>
        </div>

        <ul class="resource-list">
          ${RESOURCES.map((resource) => {
            const isShared = sharedIds.has(resource.id);
            const isDone = Boolean(athlete.resourcesDone[resource.id]);
            return `<li>
              <button class="resource-row" data-action="open-resource" data-resource="${resource.id}" type="button">
                <span class="resource-row__icon">${resourceIcon(resource.id, { size: 21 })}</span>
                <span class="resource-row__copy">
                  <span class="resource-row__title">${resource.title}</span>
                  <span class="resource-row__meta">${resource.kind} · ${resource.duration}${isShared ? ' · Partagé' : ''}${isDone ? ' · Faite' : ''}</span>
                </span>
                ${isDone ? `<span class="resource-row__shared" title="Marquée comme faite">${icon('check', { size: 13 })}</span>` : isShared ? `<span class="resource-row__shared">${icon('check', { size: 13 })}</span>` : ''}
                <span class="resource-row__chev">${icon('chevronRight', { size: 18 })}</span>
              </button>
            </li>`;
          }).join('')}
        </ul>

        <p class="fineprint">Les contenus sont des exemples de démonstration. Les vidéos ne sont pas hébergées dans ce prototype ; l’exercice de respiration et la routine sont utilisables.</p>
      </section>
    </div>

    ${tabbar('resources')}
  </div>`;
}

function titleOf(resourceId) {
  return RESOURCES.find((resource) => resource.id === resourceId)?.title ?? '';
}

function metaOf(resourceId) {
  const resource = RESOURCES.find((item) => item.id === resourceId);
  return resource ? resourceMeta(resource) : '';
}

