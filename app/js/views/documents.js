import { listForAthlete, get } from '../documents.js';
import { escapeHTML, formatDate } from '../utils.js';
import { icon } from '../ui/icons.js';

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
}

function statusFor(doc) {
  if (doc.sharedVersion == null) return { label: 'Brouillon — non partagé', tone: 'draft' };
  return { label: `Partagé · v${doc.sharedVersion}`, tone: 'shared' };
}

export function documentCard({ doc, athlete, as = 'coach' }) {
  const status = statusFor(doc);
  const latest = doc.versions[doc.versions.length - 1];
  const shared = doc.sharedVersion;
  const versionToOpen = as === 'coach' ? shared ?? latest.version : shared ?? 1;
  return `<article class="document-card">
    <div class="document-card__top">
      <span class="document-icon" aria-hidden="true">PDF</span>
      <div class="document-card__copy">
        <h3>${escapeHTML(doc.name)}</h3>
        <p>${formatDate(doc.date, { day: 'numeric', month: 'long', year: 'numeric' })} · ${doc.versions.length} version${doc.versions.length > 1 ? 's' : ''} · ${formatSize(latest.size)}</p>
      </div>
      <span class="document-status document-status--${status.tone}">${status.label}</span>
    </div>
    <div class="document-card__actions">
      <button class="btn btn--primary btn--small" data-action="open-document" data-doc="${doc.id}" data-version="${versionToOpen}" data-as="${as}" type="button">${icon('external', { size: 14 })} Ouvrir</button>
      <button class="btn btn--outline btn--small" data-action="toggle-document-share" data-doc="${doc.id}" data-athlete="${athlete.id}" data-shared="${doc.sharedVersion != null}" data-as="${as}" type="button">${doc.sharedVersion != null ? 'Ne plus partager' : `Partager avec ${escapeHTML(athlete.firstName)}`}</button>
      <button class="btn btn--ghost btn--small" data-action="edit-document" data-doc="${doc.id}" data-athlete="${athlete.id}" data-as="${as}" type="button">Gérer</button>
    </div>
    ${as === 'coach' && shared != null && shared < latest.version ? `<p class="document-card__update">${icon('info', { size: 13 })} La v${latest.version} est disponible ; la v${shared} reste celle partagée.</p>` : ''}
    ${as === 'coach' && doc.versions.length
      ? `<details class="document-versions">
          <summary>Historique des versions</summary>
          <ul>${doc.versions
            .map(
              (version) => `<li class="${version.version === shared ? 'is-shared' : ''}">
                <span>Version ${version.version}${version.version === shared ? ' · partagée' : ''}</span>
                <small>${formatDate(version.uploadedAt, { day: 'numeric', month: 'short' })} · ${formatSize(version.size)}</small>
                <button class="text-link text-link--small" data-action="download-document" data-doc="${doc.id}" data-version="${version.version}" data-as="${as}" type="button">Télécharger</button>
              </li>`,
            )
            .join('')}</ul>
        </details>`
      : ''}
  </article>`;
}

export function documentsPanel({ athlete, state }) {
  const docs = listForAthlete(athlete.id, { as: 'coach' });
  return `<div class="coach-tabpanel" role="tabpanel">
    <section class="card">
      <header class="card__head">
        <div><p class="eyebrow">Rédigé par Aga</p><h2>Documents</h2></div>
        <span class="pill pill--outline">Privé par défaut</span>
      </header>
      <p class="section-lede">Dépose un profil PDF rédigé pour ${escapeHTML(athlete.firstName)}. Il reste en brouillon jusqu’à ce que tu le partages explicitement.</p>
      <label class="upload-zone document-drop" for="document-file-${athlete.id}" data-document-drop data-athlete="${athlete.id}">
        ${icon('plus', { size: 24 })}
        <strong>Déposer un PDF ou choisir un fichier</strong>
        <span>PDF uniquement · 10 Mo maximum · accessible au clavier et sur mobile</span>
        <input id="document-file-${athlete.id}" type="file" accept="application/pdf,.pdf" data-document-input data-athlete="${athlete.id}">
      </label>
      <div class="document-sample-row">
        <button class="text-link text-link--small" data-action="sample-document" data-athlete="${athlete.id}" type="button">Créer un profil PDF d’exemple</button>
        <span class="fineprint">Pour tester sans fichier.</span>
      </div>
      <div class="document-list">
        ${docs.length
          ? docs.map((doc) => documentCard({ doc, athlete, as: 'coach' })).join('')
          : `<div class="empty empty--light">
              <span class="empty__icon">${icon('clipboard', { size: 21 })}</span>
              <p class="empty__title">Aucun document</p>
              <p class="empty__text">Dépose le premier profil PDF pour ${escapeHTML(athlete.firstName)}.</p>
            </div>`}
      </div>
      <p class="fineprint">Démo : les fichiers sont stockés dans ce navigateur. Le contrôle d’accès par compte est simulé côté interface ; en production, l’ouverture du PDF doit passer par une API qui vérifie l’identité et le partage. Voir le README.</p>
    </section>
  </div>`;
}

export function profileDocumentsSection({ athlete }) {
  const docs = listForAthlete(athlete.id, { as: athlete.id });
  if (!docs.length) return '';
  return `<section class="profile-block" aria-labelledby="profile-docs-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Rédigé par Aga</p>
        <h2 class="display display--sm" id="profile-docs-title">Mes documents</h2>
      </div>
      <span class="pill pill--outline">${docs.length}</span>
    </div>
    <div class="profile-documents">
      ${docs
        .map(
          (doc) => `<article class="document-card document-card--athlete">
            <div class="document-card__top">
              <span class="document-icon" aria-hidden="true">PDF</span>
              <div class="document-card__copy">
                <h3>${escapeHTML(doc.name)}</h3>
                <p>${formatDate(doc.date, { day: 'numeric', month: 'long', year: 'numeric' })} · version ${doc.sharedVersion}</p>
              </div>
            </div>
            <div class="document-card__actions">
              <button class="btn btn--primary btn--small" data-action="open-document" data-doc="${doc.id}" data-version="${doc.sharedVersion}" data-as="${athlete.id}" type="button">Ouvrir</button>
              <button class="btn btn--outline btn--small" data-action="download-document" data-doc="${doc.id}" data-version="${doc.sharedVersion}" data-as="${athlete.id}" type="button">Télécharger</button>
            </div>
          </article>`,
        )
        .join('')}
    </div>
    <p class="fineprint">Document partagé par Aga. Tu ne vois que les versions qu’elle a choisi de partager.</p>
  </section>`;
}

export function openDocumentSheetData(docId, athleteId, as) {
  const doc = get(docId);
  if (!doc) return null;
  const athlete = doc.athleteId === athleteId;
  return { doc, as };
}
