import { ACTIVITY_SOURCES, DEVICE_PROVIDER } from '../data.js';
import { escapeHTML, formatDate, relativeTime, todayISO } from '../utils.js';
import { icon } from '../ui/icons.js';
import {
  entryDateLabel,
  formatDuration,
  visibilityPill,
} from '../ui/carnet.js';

export function activitySourceLabel(source) {
  return ACTIVITY_SOURCES[source]?.label ?? 'Ajout manuel';
}

export function activityCard(activity, { compact = false } = {}) {
  const meta = [
    entryDateLabel(activity.date),
    activity.duration != null ? formatDuration(activity.duration) : null,
    activity.distance != null ? `${String(activity.distance).replace('.', ',')} km` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return `<article class="activity-card ${compact ? 'activity-card--compact' : ''}">
    <div class="activity-card__top">
      <span class="source-badge source-badge--${activity.source}">${activitySourceLabel(activity.source)}</span>
      ${visibilityPill(activity.shared ? 'shared' : 'private')}
    </div>
    <h3>${escapeHTML(activity.activity)}</h3>
    <p class="activity-meta">${meta}</p>
    ${activity.comment ? `<p class="activity-comment">« ${escapeHTML(activity.comment)} »</p>` : ''}
    <div class="activity-card__actions">
      <button class="text-link text-link--small" data-action="edit-activity" data-activity="${activity.id}" type="button">${activity.comment ? 'Modifier mon commentaire' : 'Ajouter un commentaire'}</button>
      <button class="text-link text-link--small" data-action="toggle-activity-share" data-activity="${activity.id}" data-shared="${activity.shared}" type="button">${activity.shared ? 'Rendre privée' : 'Partager avec Aga'}</button>
    </div>
  </article>`;
}

function connectionSummary(athlete) {
  const device = athlete.device;
  const connected = device.status === 'connected';
  return `<section class="connection-card">
    <div class="connection-card__top">
      <span class="provider-mark">STRAVA</span>
      <span class="pill pill--outline">${DEVICE_PROVIDER.label}</span>
    </div>
    <h2>${connected ? 'Appareil connecté' : 'Aucun appareil connecté'}</h2>
    <p>${connected
      ? `Dernière synchronisation : ${device.lastSyncAt ? relativeTime(device.lastSyncAt) : 'jamais'}.`
      : 'Connecte une application pour importer une activité, ou ajoute-la à la main.'}</p>
    ${device.error ? `<p class="inline-error">${icon('info', { size: 15 })} ${escapeHTML(device.error)}</p>` : ''}
    <a class="text-link text-link--small" href="#/carnet/connexion">${connected ? 'Gérer la connexion' : 'Connecter un appareil'} ${icon('arrowRight', { size: 14 })}</a>
  </section>`;
}

export function activitiesView({ athlete }) {
  const activities = [...athlete.activities].sort((a, b) => b.date.localeCompare(a.date));
  const shared = activities.filter((activity) => activity.shared).length;

  return `<div class="carnet-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/carnet" aria-label="Retour au carnet">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">Mes activités</span>
      <span class="flowbar__right">${activities.length} activité${activities.length > 1 ? 's' : ''}</span>
    </header>
    <main class="carnet-body">
      <section class="activities-intro">
        <p class="eyebrow">Ce que tu fais</p>
        <h1 class="display display--page" id="view-title">Mes activités</h1>
        <p class="section-lede">Séances, footings, matchs. Une activité garde sa source et sa date. Elle reste privée jusqu’à ce que tu la partages.</p>
        <div class="activity-actions activity-actions--stack">
          <a class="btn btn--primary" href="#/carnet/activites/nouvelle">${icon('plus', { size: 16 })} Ajouter une activité</a>
          <a class="btn btn--outline" href="#/carnet/connexion">${icon('link', { size: 16 })} Connecter un appareil</a>
        </div>
      </section>

      ${connectionSummary(athlete)}

      <section class="carnet-section" aria-labelledby="activity-list-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Mon carnet</p>
            <h2 class="display display--sm" id="activity-list-title">Toutes mes activités</h2>
          </div>
          <span class="pill pill--outline">${shared} partagée${shared > 1 ? 's' : ''}</span>
        </div>
        ${activities.length
          ? `<div class="activity-list">${activities.map((activity) => activityCard(activity)).join('')}</div>`
          : `<div class="empty empty--light">
              <span class="empty__icon">${icon('trend', { size: 22 })}</span>
              <p class="empty__title">Aucune activité</p>
              <p class="empty__text">Ajoute une séance à la main, ou connecte un appareil en mode démo.</p>
              <a class="btn btn--outline btn--small" href="#/carnet/activites/nouvelle">Ajouter une activité</a>
            </div>`}
        <p class="fineprint">${icon('info', { size: 13 })} Aucun état mental n’est déduit des mesures d’un appareil. Seuls l’activité, sa durée, sa date et ton commentaire sont affichés.</p>
      </section>
    </main>
  </div>`;
}

export function activityComposerView({ athlete, source = 'manual' }) {
  const isGpx = source === 'gpx';
  return `<div class="carnet-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/carnet/activites" aria-label="Retour aux activités">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">Ajouter une activité</span>
      <span class="flowbar__right">${isGpx ? 'Fichier GPX' : 'Manuel'}</span>
    </header>
    <main class="carnet-body">
      <section class="composer-intro">
        <p class="eyebrow">Une activité</p>
        <h1 class="display display--xl" id="view-title">${isGpx ? 'Importer un fichier GPX' : 'Ajouter à la main'}</h1>
        <p class="section-lede">L’ajout manuel fonctionne toujours. Tu pourras compléter avec ton propre commentaire.</p>
      </section>

      <div class="source-tabs" role="group" aria-label="Source de l’activité">
        <a class="source-tab ${!isGpx ? 'is-active' : ''}" href="#/carnet/activites/nouvelle?source=manual">${icon('plus', { size: 15 })} Manuel</a>
        <a class="source-tab ${isGpx ? 'is-active' : ''}" href="#/carnet/activites/nouvelle?source=gpx">${icon('external', { size: 15 })} Fichier GPX</a>
      </div>

      ${isGpx
        ? `<form class="activity-form" data-activity-form data-source="gpx">
            <label class="upload-zone upload-zone--compact" for="gpx-file">
              ${icon('external', { size: 24 })}
              <strong>Choisir un fichier GPX</strong>
              <span>Enregistré depuis ta montre ou une application. Analyse locale, aucun envoi.</span>
              <input id="gpx-file" name="gpx" type="file" accept=".gpx,.xml,application/gpx+xml" data-gpx-input>
            </label>
            <div class="gpx-preview" data-gpx-preview hidden>
              <p class="eyebrow">Fichier analysé</p>
              <div class="gpx-preview__grid">
                <span><small>Activité</small><strong data-gpx-activity>—</strong></span>
                <span><small>Date</small><strong data-gpx-date>—</strong></span>
                <span><small>Durée</small><strong data-gpx-duration>—</strong></span>
                <span><small>Distance</small><strong data-gpx-distance>—</strong></span>
              </div>
              <p class="fineprint" data-gpx-note>Vérifie les données avant de les ajouter.</p>
            </div>
            <fieldset class="data-choice" data-gpx-fields hidden>
              <legend>Données à importer</legend>
              <label><input type="checkbox" name="field-duration" checked> Durée</label>
              <label><input type="checkbox" name="field-distance" checked> Distance</label>
              <p class="fineprint">L’activité et la date sont toujours importées.</p>
            </fieldset>
            <input type="hidden" name="activity" data-gpx-hidden-activity>
            <input type="hidden" name="date" data-gpx-hidden-date>
            <input type="hidden" name="duration" data-gpx-hidden-duration>
            <input type="hidden" name="distance" data-gpx-hidden-distance>
            <label class="field" for="gpx-comment">
              <span class="field__label">Mon commentaire <em>facultatif</em></span>
              <textarea class="field__input field__input--area" id="gpx-comment" name="comment" rows="3" maxlength="400" placeholder="Ce que tu retiens de cette activité…"></textarea>
            </label>
            <fieldset class="visibility-choice">
              <legend>Qui peut voir cette activité ?</legend>
              <label class="visibility-option is-selected">
                <input type="radio" name="visibility" value="private" checked>
                <span class="visibility-option__icon">${icon('lock', { size: 17 })}</span>
                <span><strong>Privé</strong><small>Toi uniquement</small></span>
              </label>
              <label class="visibility-option">
                <input type="radio" name="visibility" value="shared">
                <span class="visibility-option__icon">${icon('users', { size: 17 })}</span>
                <span><strong>Partager avec Aga</strong><small>Visible dans ta fiche</small></span>
              </label>
            </fieldset>
            <button class="btn btn--primary btn--block btn--lg" type="submit">${icon('check', { size: 18 })} Ajouter à mon carnet</button>
            <p class="fineprint">Le fichier est analysé dans ton navigateur. Aucun envoi, aucun état mental déduit.</p>
          </form>`
        : `<form class="activity-form" data-activity-form data-source="manual">
            <label class="field" for="manual-activity">
              <span class="field__label">Activité</span>
              <input class="field__input" id="manual-activity" name="activity" type="text" maxlength="90" required placeholder="Ex. Footing de récupération">
            </label>
            <div class="form-grid">
              <label class="field" for="manual-date">
                <span class="field__label">Date</span>
                <input class="field__input" id="manual-date" name="date" type="date" value="${todayISO()}" required>
              </label>
              <label class="field" for="manual-duration">
                <span class="field__label">Durée <em>minutes</em></span>
                <input class="field__input" id="manual-duration" name="duration" type="number" inputmode="numeric" min="1" max="600" placeholder="Ex. 45">
              </label>
            </div>
            <label class="field" for="manual-distance">
              <span class="field__label">Distance <em>km, facultatif</em></span>
              <input class="field__input" id="manual-distance" name="distance" type="number" inputmode="decimal" min="0" step="0.1" placeholder="Ex. 6,2">
            </label>
            <label class="field" for="manual-comment">
              <span class="field__label">Mon commentaire <em>facultatif</em></span>
              <textarea class="field__input field__input--area" id="manual-comment" name="comment" rows="3" maxlength="400" placeholder="Ce que tu retiens de cette activité…"></textarea>
            </label>
            <fieldset class="visibility-choice">
              <legend>Qui peut voir cette activité ?</legend>
              <label class="visibility-option is-selected">
                <input type="radio" name="visibility" value="private" checked>
                <span class="visibility-option__icon">${icon('lock', { size: 17 })}</span>
                <span><strong>Privé</strong><small>Toi uniquement</small></span>
              </label>
              <label class="visibility-option">
                <input type="radio" name="visibility" value="shared">
                <span class="visibility-option__icon">${icon('users', { size: 17 })}</span>
                <span><strong>Partager avec Aga</strong><small>Visible dans ta fiche</small></span>
              </label>
            </fieldset>
            <button class="btn btn--primary btn--block btn--lg" type="submit">${icon('check', { size: 18 })} Ajouter à mon carnet</button>
            <p class="fineprint">Une activité ajoutée à la main n’est jamais perdue : elle reste dans ton carnet jusqu’à ce que tu la retires.</p>
          </form>`}
    </main>
  </div>`;
}

export function deviceView({ athlete }) {
  const device = athlete.device;
  const connected = device.status === 'connected';
  const imported = athlete.activities.filter((activity) => activity.source === 'strava');

  return `<div class="carnet-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/carnet/activites" aria-label="Retour aux activités">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">Appareil connecté</span>
      <span class="flowbar__right">Mode démo</span>
    </header>
    <main class="carnet-body">
      <section class="composer-intro">
        <p class="eyebrow">Connexion</p>
        <h1 class="display display--page" id="view-title">Connecter un appareil</h1>
        <p class="section-lede">Strava est la première source compatible avec une application web. La connexion ci-dessous est une démonstration : aucune donnée réelle n’est lue.</p>
      </section>

      <section class="device-card">
        <div class="device-card__top">
          <span class="provider-mark provider-mark--lg">STRAVA</span>
          <span class="pill pill--demo">Mode démo</span>
        </div>
        <h2>Strava</h2>
        <p class="device-card__text">Application d’entraînement. Données demandées : <strong>activités, durée, date, distance</strong>.</p>
        ${device.error ? `<p class="inline-error">${icon('info', { size: 15 })} ${escapeHTML(device.error)}</p>` : ''}

        ${connected
          ? `<div class="device-status">
              <span class="status status--success"><span class="status__dot"></span>Connecté</span>
              <span>Dernière synchronisation : ${device.lastSyncAt ? relativeTime(device.lastSyncAt) : 'jamais'}</span>
            </div>
            <fieldset class="data-choice">
              <legend>Données à importer</legend>
              <label><input type="checkbox" data-device-selection="duration" ${device.selection.duration ? 'checked' : ''}> Durée</label>
              <label><input type="checkbox" data-device-selection="distance" ${device.selection.distance ? 'checked' : ''}> Distance</label>
              <p class="fineprint">L’activité et la date sont toujours importées. L’activité reste privée jusqu’à partage.</p>
            </fieldset>
            <div class="device-actions">
              <button class="btn btn--primary" data-action="sync-device" type="button">${icon('trend', { size: 16 })} Synchroniser maintenant</button>
              <button class="btn btn--outline btn--small" data-action="fail-next-device" type="button">Simuler un échec</button>
              <button class="btn btn--ghost btn--small" data-action="disconnect-device" type="button">Déconnecter</button>
            </div>`
          : `<p class="device-card__text">Aucune connexion active. Tu peux tout de même ajouter une activité à la main.</p>
            <button class="btn btn--primary btn--block" data-action="connect-device" type="button">${icon('link', { size: 16 })} ${device.connectionAttempted ? 'Reconnecter Strava' : 'Connecter Strava (démo)'}</button>
            <p class="fineprint">Aucune fenêtre d’autorisation réelle ne s’ouvre. Le parcours simule la connexion, la synchronisation et les erreurs.</p>`}
      </section>

      <section class="carnet-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Importées</p>
            <h2 class="display display--sm">Activités de Strava</h2>
          </div>
          <span class="pill pill--outline">${imported.length}</span>
        </div>
        ${imported.length
          ? `<div class="activity-list">${imported.map((activity) => activityCard(activity, { compact: true })).join('')}</div>`
          : `<p class="section-lede">Aucune activité importée pour l’instant. Connecte l’appareil puis synchronise.</p>`}
        <p class="fineprint">Les doublons sont détectés par identifiant d’activité. Une déconnexion ne supprime pas les activités déjà importées.</p>
      </section>

      <details class="integration-notes">
        <summary>Ce qu’il faut pour brancher Strava pour de vrai</summary>
        <ol>
          ${DEVICE_PROVIDER.docs.map((doc) => `<li>${doc}</li>`).join('')}
        </ol>
        <p>L’échange de token et le stockage doivent se faire côté serveur. Aucune mesure ne doit être transformée en état mental.</p>
      </details>

      <a class="text-link" href="#/carnet/activites">${icon('back', { size: 14 })} Retour aux activités</a>
    </main>
  </div>`;
}
