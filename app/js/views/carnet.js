import { ENTRY_TYPES, ROUTINE_FEEDBACK, getEntryType } from '../data.js';
import { escapeHTML, formatDate, todayISO } from '../utils.js';
import { icon } from '../ui/icons.js';
import { emptyState, trackCurves } from '../ui/components.js';
import {
  carnetInsights,
  contextualQuestion,
  entryDateLabel,
  feedbackLabel,
  feedbackTone,
  formatDuration,
  latestRoutine,
  routineItems,
  routineMomentLabel,
  routineOrigin,
  unansweredQuestion,
  visibilityPill,
} from '../ui/carnet.js';

const GOAL_EXAMPLES = [
  'Revenir vite dans le jeu après une erreur.',
  'Rester concentré jusqu’au dernier ballon.',
  'Oser prendre ma place dans l’équipe.',
];

function carnetHeader(athlete) {
  return `<header class="carnet-head">
    <div class="carnet-head__bar">
      <a href="#/aujourdhui" class="flowbar__back" aria-label="Retour à aujourd’hui">${icon('back', { size: 22 })}</a>
      <span class="widget-wordmark widget-wordmark--navy">O’MIND</span>
      <a href="#/espace/profil" class="carnet-avatar" aria-label="Ouvrir mon profil">${athlete.initials}</a>
    </div>
    <p class="eyebrow">Mon espace · ${escapeHTML(athlete.sport)}</p>
    <h1 class="display display--page" id="view-title">Mon carnet</h1>
    <p class="carnet-sub">Le fil de ce que tu vis, essaies et observes.</p>
  </header>`;
}

function goalForm(athlete, { edit = false } = {}) {
  const goal = athlete.carnet.goal?.text ?? '';
  return `<form class="goal-form" data-goal-form data-goal-mode="${edit ? 'edit' : 'create'}">
    <label class="field" for="goal-text">
      <span class="field__label">Ton objectif, dans tes mots <em>180 caractères</em></span>
      <textarea class="field__input field__input--area" id="goal-text" name="goal" maxlength="180" rows="3" placeholder="Ex. Revenir vite dans le jeu après une erreur.">${escapeHTML(goal)}</textarea>
    </label>
    <div class="goal-examples" aria-label="Exemples d’objectifs">
      ${GOAL_EXAMPLES.map(
        (example) => `<button class="goal-example" type="button" data-action="goal-example" data-text="${escapeHTML(example)}">« ${example} »</button>`,
      ).join('')}
    </div>
    <button class="btn btn--primary btn--block btn--lg" type="submit">
      ${edit ? 'Enregistrer mon objectif' : 'Commencer avec cet objectif'}
      ${icon('arrowRight', { size: 18 })}
    </button>
    <p class="fineprint">Modifiable à tout moment. Ton objectif sert de fil rouge : Aga le voit dans ta fiche pour t’accompagner. Tes entrées, elles, restent privées par défaut.</p>
  </form>`;
}

export function goalView({ athlete, edit = false }) {
  return `<div class="carnet-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/carnet" aria-label="Retour au carnet">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">Mon objectif</span>
      <span class="flowbar__right">${edit ? 'Modifier' : 'Bienvenue'}</span>
    </header>
    <main class="carnet-body">
      <section class="goal-onboarding">
        ${trackCurves('goal-onboarding__curves')}
        <p class="eyebrow">${edit ? 'Mon cap' : 'Première ouverture'}</p>
        <h1 class="display display--xl" id="view-title">${edit ? 'Où veux-tu aller ?' : 'Et si on commençait par ton objectif ?'}</h1>
        <p class="goal-onboarding__lede">Pas besoin d’une grande phrase. Ce que tu veux changer, apprendre ou retrouver dans ton sport. C’est ton fil rouge pour le carnet.</p>
        ${goalForm(athlete, { edit })}
      </section>
    </main>
  </div>`;
}

function draftBanner(draft) {
  const type = getEntryType(draft.type);
  const time = draft.updatedAt
    ? new Intl.DateTimeFormat('fr-BE', { hour: '2-digit', minute: '2-digit' }).format(new Date(draft.updatedAt))
    : '';
  return `<div class="draft-banner">
    <div class="draft-banner__copy">
      <span class="pill pill--soft">Brouillon</span>
      <p><strong>${type.label}</strong> · enregistré ${time ? `à ${time}` : 'automatiquement'}</p>
    </div>
    <div class="draft-banner__actions">
      <a class="btn btn--outline btn--small" href="#/carnet/nouveau?resume=1">Reprendre</a>
      <button class="text-link text-link--muted" data-action="clear-draft" type="button">Supprimer</button>
    </div>
  </div>`;
}

function questionPrompt(entry) {
  return `<section class="question-prompt" aria-labelledby="prompt-question">
    <p class="eyebrow">Après ta séance</p>
    <h2 id="prompt-question">${escapeHTML(entry.question)}</h2>
    <p class="question-prompt__meta">${entryDateLabel(entry.date)} · une phrase suffit</p>
    <button class="btn btn--primary" data-action="open-question" data-entry="${entry.id}" type="button">
      Répondre ${icon('arrowRight', { size: 16 })}
    </button>
    <p class="fineprint">Facultatif. Ta réponse reste privée tant que tu ne la partages pas.</p>
  </section>`;
}

function insightCard(athlete) {
  const insights = carnetInsights(athlete);
  return `<section class="carnet-section" aria-labelledby="insights-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Ce qui t’a aidé</p>
        <h2 class="display display--sm" id="insights-title">Mes appuis</h2>
      </div>
    </div>
    ${insights.length
      ? `<p class="section-lede">D’après ce que tu as noté, sans interprétation.</p>
        <ul class="insight-list">
          ${insights
            .map(
              (insight) => `<li class="insight-item">
                <span class="insight-item__icon">${icon(insight.icon, { size: 17 })}</span>
                <div><span class="insight-item__label">${insight.label}</span><p>${escapeHTML(insight.text)}</p></div>
              </li>`,
            )
            .join('')}
        </ul>`
      : `<p class="section-lede">Tes routines essayées, tes notes et tes réponses apparaîtront ici. Rien n’est interprété à ta place.</p>
        <a class="text-link" href="#/carnet/nouveau?type=helper&new=1">Noter ce qui m’a aidé ${icon('arrowRight', { size: 14 })}</a>`}
  </section>`;
}

function quickActions() {
  return `<section class="quick-actions" aria-label="Ajouter au carnet">
    ${ENTRY_TYPES.map(
      (type) => `<a class="quick-action" href="#/carnet/nouveau?type=${type.key}&new=1">
        <span class="quick-action__icon">${icon(type.icon, { size: 19 })}</span>
        <span><strong>${type.label}</strong><small>${type.prompt}</small></span>
        ${icon('chevronRight', { size: 16 })}
      </a>`,
    ).join('')}
  </section>`;
}

function routineSection(athlete) {
  const routine = latestRoutine(athlete);
  return `<section class="carnet-section" aria-labelledby="routine-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Mes routines</p>
        <h2 class="display display--sm" id="routine-title">Ma routine du moment</h2>
      </div>
      <a class="text-link text-link--small" href="#/carnet/routines">Tout voir</a>
    </div>
    ${routine
      ? `<article class="routine-card">
          <div class="routine-card__top">
            <span class="routine-origin">${routineOrigin(routine)}</span>
            <span class="status ${routine.status === 'tried' ? 'status--success' : 'status--info'}">${routine.status === 'tried' ? 'Essayée' : 'Nouvelle'}</span>
          </div>
          <h3>${escapeHTML(routine.title)}</h3>
          ${routine.instruction ? `<p class="routine-instruction">« ${escapeHTML(routine.instruction)} »</p>` : ''}
          <p class="routine-meta">${routine.steps.length} étapes · ${routineMomentLabel(routine.moment)}</p>
          <div class="routine-card__actions">
            <button class="btn btn--primary btn--small" data-action="open-routine" data-kind="${routine.kind}" data-id="${routine.id}" type="button">Reprendre</button>
            ${routine.feedback ? `<span class="feedback-chip feedback-chip--${feedbackTone(routine.feedback.helpfulness)}">${feedbackLabel(routine.feedback.helpfulness)}</span>` : `<span class="fineprint">Pas encore essayée</span>`}
          </div>
        </article>`
      : `<div class="empty empty--light">
          <span class="empty__icon">${icon('target', { size: 22 })}</span>
          <p class="empty__title">Pas encore de routine</p>
          <p class="empty__text">Crée une routine courte, ou attends une proposition d’Aga.</p>
          <div class="inline-actions">
            <button class="btn btn--outline btn--small" data-action="open-create-routine" data-athlete="${athlete.id}" type="button">Créer ma routine</button>
            <a class="text-link" href="#/carnet/routines">Voir les routines</a>
          </div>
        </div>`}
  </section>`;
}

function activityCard(activity) {
  return `<article class="activity-card">
    <div class="activity-card__top">
      <span class="source-badge source-badge--${activity.source}">${activity.source === 'strava' ? 'Strava · démo' : activity.source === 'gpx' ? 'Fichier GPX' : 'Manuel'}</span>
      ${visibilityPill(activity.shared ? 'shared' : 'private')}
    </div>
    <h3>${escapeHTML(activity.activity)}</h3>
    <p class="activity-meta">${entryDateLabel(activity.date)}${activity.duration ? ` · ${formatDuration(activity.duration)}` : ''}</p>
    ${activity.comment ? `<p class="activity-comment">« ${escapeHTML(activity.comment)} »</p>` : ''}
    <div class="activity-card__actions">
      <button class="text-link text-link--small" data-action="edit-activity" data-activity="${activity.id}" type="button">Ajouter un commentaire</button>
      <button class="text-link text-link--small" data-action="toggle-activity-share" data-activity="${activity.id}" data-shared="${activity.shared}" type="button">${activity.shared ? 'Rendre privée' : 'Partager avec Aga'}</button>
    </div>
  </article>`;
}

function activitiesSection(athlete) {
  const activities = [...athlete.activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
  return `<section class="carnet-section" aria-labelledby="activities-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Activités</p>
        <h2 class="display display--sm" id="activities-title">Mes activités</h2>
      </div>
      <a class="text-link text-link--small" href="#/carnet/activites">Tout voir</a>
    </div>
    <div class="activity-actions">
      <a class="btn btn--primary btn--small" href="#/carnet/activites/nouvelle">${icon('plus', { size: 15 })} Ajouter une activité</a>
      <a class="btn btn--outline btn--small" href="#/carnet/connexion">${icon('link', { size: 15 })} Connecter un appareil</a>
    </div>
    ${activities.length
      ? `<div class="activity-list">${activities.map(activityCard).join('')}</div>`
      : `<p class="section-lede">Une séance, un footing, un match : ajoute-le à la main. Tu peux aussi connecter un appareil.</p>`}
    <p class="fineprint">Une activité importée reste dans ton carnet et reste privée jusqu’à ce que tu la partages.</p>
  </section>`;
}

function entriesSection(athlete, filter, entries) {
  const filters = [
    { key: 'all', label: 'Tout' },
    { key: 'private', label: 'Privé' },
    { key: 'shared', label: 'Partagé' },
  ];
  return `<section class="carnet-section" aria-labelledby="entries-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Le fil</p>
        <h2 class="display display--sm" id="entries-title">Mes entrées</h2>
      </div>
      <a class="text-link text-link--small" href="#/carnet/nouveau?type=session&new=1">Ajouter</a>
    </div>
    <div class="filter-chips" role="group" aria-label="Filtrer les entrées">
      ${filters
        .map(
          (item) => `<a class="filter-chip ${filter === item.key ? 'is-active' : ''}" href="#/carnet?f=${item.key}" ${filter === item.key ? 'aria-current="page"' : ''}>${item.label}</a>`,
        )
        .join('')}
    </div>
    ${entries.length
      ? `<div class="entry-list">
          ${entries
            .map((entry) => {
              const type = getEntryType(entry.type);
              return `<article class="entry-card">
                <div class="entry-card__top">
                  <span class="entry-type">${icon(type.icon, { size: 14 })} ${type.label}</span>
                  ${visibilityPill(entry.visibility)}
                </div>
                <h3>${escapeHTML(entry.title || type.label)}</h3>
                <p class="entry-date">${entryDateLabel(entry.date)}${entry.context ? ` · ${escapeHTML(entry.context)}` : ''}</p>
                ${entry.note ? `<p class="entry-note">${escapeHTML(entry.note)}</p>` : ''}
                ${entry.answer ? `<div class="entry-answer"><span>Ma réponse</span><p>« ${escapeHTML(entry.answer)} »</p></div>` : ''}
                ${entry.helped ? `<p class="entry-helped">A aidé : ${escapeHTML(entry.helped)}</p>` : ''}
                <div class="entry-card__actions">
                  <a class="text-link text-link--small" href="#/carnet/entree/${entry.id}">Modifier</a>
                  <button class="text-link text-link--small" data-action="toggle-entry-share" data-entry="${entry.id}" data-visibility="${entry.visibility}" type="button">${entry.visibility === 'shared' ? 'Rendre privé' : 'Partager avec Aga'}</button>
                  ${entry.question && !entry.answer ? `<button class="text-link text-link--small" data-action="open-question" data-entry="${entry.id}" type="button">Répondre</button>` : ''}
                </div>
              </article>`;
            })
            .join('')}
        </div>`
      : `<div class="empty empty--light">
          <span class="empty__icon">${icon('clipboard', { size: 22 })}</span>
          <p class="empty__title">Ton carnet est encore vide</p>
          <p class="empty__text">Commence par une séance, un ressenti ou ce qui t’a aidé.</p>
          <a class="btn btn--outline btn--small" href="#/carnet/nouveau?type=session&new=1">Ajouter une séance</a>
        </div>`}
  </section>`;
}

function privacyNote() {
  return `<section class="privacy-note">
    <span class="privacy-note__icon">${icon('lock', { size: 18 })}</span>
    <div>
      <strong>Tu choisis ce qu’Aga voit.</strong>
      <p><b>Privé</b> : toi uniquement. <b>Partagé</b> : Aga peut le lire dans ta fiche. Pour les routines, elle voit que tu l’as essayée ; le contenu de ton retour n’apparaît que si tu le partages.</p>
      <p>Chaque entrée peut changer de visibilité à tout moment.</p>
    </div>
  </section>`;
}

export function carnetView({ athlete, filter = 'all' }) {
  if (!athlete.carnet.goal) {
    return `<div class="carnet-page">
      ${carnetHeader(athlete)}
      <main class="carnet-body">
        <section class="goal-onboarding">
          ${trackCurves('goal-onboarding__curves')}
          <p class="eyebrow">Première ouverture</p>
          <h2 class="display display--xl">Et si on commençait par ton objectif ?</h2>
          <p class="goal-onboarding__lede">Pas besoin d’une grande phrase. Ce que tu veux changer, apprendre ou retrouver dans ton sport. C’est ton fil rouge pour le carnet.</p>
          ${goalForm(athlete)}
        </section>
      </main>
    </div>`;
  }

  const entries = [...athlete.carnet.entries]
    .filter((entry) => filter === 'all' || entry.visibility === filter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const prompt = unansweredQuestion(athlete);
  const draft = athlete.carnet.draft;

  return `<div class="carnet-page">
    ${carnetHeader(athlete)}
    <main class="carnet-body">
      <section class="goal-card">
        <div class="goal-card__head">
          <p class="eyebrow">Mon objectif</p>
          <a class="text-link text-link--small" href="#/carnet/objectif">Modifier</a>
        </div>
        <p class="goal-card__text">« ${escapeHTML(athlete.carnet.goal.text)} »</p>
        <p class="goal-card__meta">Depuis le ${formatDate(athlete.carnet.goal.createdAt, { day: 'numeric', month: 'long' })}</p>
      </section>

      ${draft ? draftBanner(draft) : ''}
      ${prompt ? questionPrompt(prompt) : ''}
      ${insightCard(athlete)}
      ${quickActions()}
      ${routineSection(athlete)}
      ${entriesSection(athlete, filter, entries)}
      ${activitiesSection(athlete)}
      ${privacyNote()}

      <p class="carnet-foot"><a class="text-link" href="#/aujourdhui">${icon('back', { size: 14 })} Retour à aujourd’hui</a></p>
    </main>
  </div>`;
}

export function entryComposerView({ athlete, entry = null, draft = null, requestedType = 'session' }) {
  const source = entry ?? draft ?? {};
  const type = getEntryType(source.type ?? requestedType);
  const routines = routineItems(athlete);
  const selectedRoutines = new Set(source.routineIds ?? []);
  const question =
    source.question || (type.needsRoutine ? contextualQuestion(athlete, type.key, [...selectedRoutines]) : '');
  const isEdit = Boolean(entry);

  return `<div class="composer-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/carnet" aria-label="Retour au carnet">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">${isEdit ? 'Modifier mon entrée' : 'Nouvelle entrée'}</span>
      <span class="flowbar__right" data-draft-status>${draft ? 'Brouillon' : ''}</span>
    </header>
    <main class="composer-body">
      <p class="eyebrow">Mon carnet</p>
      <h1 class="display display--xl" id="view-title" data-entry-heading>${isEdit ? 'Modifier' : type.heading}</h1>
      <form class="entry-form" data-entry-form data-entry-id="${entry?.id ?? ''}" data-athlete="${athlete.id}">
        <input type="hidden" name="type" value="${type.key}">
        <div class="entry-types" role="group" aria-label="Type d’entrée">
          ${ENTRY_TYPES.map(
            (item) => `<button class="type-chip ${item.key === type.key ? 'is-active' : ''}" type="button" data-entry-type="${item.key}" aria-pressed="${item.key === type.key}">
              ${icon(item.icon, { size: 17 })}<span>${item.label}</span>
            </button>`,
          ).join('')}
        </div>

        <div class="form-grid">
          <label class="field" for="entry-date">
            <span class="field__label">Date</span>
            <input class="field__input" id="entry-date" name="date" type="date" value="${source.date ?? todayISO()}">
          </label>
          <label class="field" for="entry-title">
            <span class="field__label">Titre <em>facultatif</em></span>
            <input class="field__input" id="entry-title" name="title" type="text" maxlength="80" value="${escapeHTML(source.title ?? '')}" placeholder="Ex. Séance du mardi">
          </label>
        </div>

        <label class="field" for="entry-context">
          <span class="field__label">Contexte <em>facultatif</em></span>
          <input class="field__input" id="entry-context" name="context" type="text" maxlength="80" value="${escapeHTML(source.context ?? '')}" placeholder="Ex. U16 · jeu réduit">
        </label>

        <label class="field" for="entry-note">
          <span class="field__label" data-entry-note-label>${type.noteLabel}</span>
          <textarea class="field__input field__input--area" id="entry-note" name="note" rows="5" maxlength="900" placeholder="${type.notePlaceholder}">${escapeHTML(source.note ?? '')}</textarea>
        </label>

        <fieldset class="routine-picker" data-routine-field ${type.needsRoutine ? '' : 'hidden'}>
          <legend>Une routine essayée ? <em>facultatif</em></legend>
          ${routines.length
            ? routines
                .map(
                  (routine) => `<label class="routine-choice">
                    <input type="checkbox" name="routineIds" value="${routine.id}" ${selectedRoutines.has(routine.id) ? 'checked' : ''}>
                    <span><strong>${escapeHTML(routine.title)}</strong><small>${routineOrigin(routine)} · ${routine.steps.length} étapes</small></span>
                  </label>`,
                )
                .join('')
            : `<p class="fineprint">Aucune routine pour l’instant. Tu peux en créer une depuis le carnet.</p>`}
        </fieldset>

        <div class="context-question" data-question-card ${type.needsRoutine ? '' : 'hidden'}>
          <p class="eyebrow">Une question pour aller plus loin</p>
          <p class="context-question__text" data-question-text>${escapeHTML(question)}</p>
          <label class="field" for="entry-answer">
            <span class="field__label">Ta réponse <em>facultatif</em></span>
            <textarea class="field__input field__input--area" id="entry-answer" name="answer" rows="3" maxlength="200" placeholder="Une phrase suffit.">${escapeHTML(source.answer ?? '')}</textarea>
          </label>
          <p class="fineprint">200 caractères maximum. Tu pourras aussi répondre plus tard depuis le carnet.</p>
        </div>

        <label class="field" for="entry-helped">
          <span class="field__label">Ce qui m’a aidé <em>facultatif</em></span>
          <textarea class="field__input field__input--area" id="entry-helped" name="helped" rows="2" maxlength="400" placeholder="Un geste, une phrase, une personne…">${escapeHTML(source.helped ?? '')}</textarea>
        </label>

        <fieldset class="visibility-choice">
          <legend>Qui peut voir cette entrée ?</legend>
          <label class="visibility-option ${source.visibility !== 'shared' ? 'is-selected' : ''}">
            <input type="radio" name="visibility" value="private" ${source.visibility !== 'shared' ? 'checked' : ''}>
            <span class="visibility-option__icon">${icon('lock', { size: 17 })}</span>
            <span><strong>Privé</strong><small>Toi uniquement</small></span>
          </label>
          <label class="visibility-option ${source.visibility === 'shared' ? 'is-selected' : ''}">
            <input type="radio" name="visibility" value="shared" ${source.visibility === 'shared' ? 'checked' : ''}>
            <span class="visibility-option__icon">${icon('users', { size: 17 })}</span>
            <span><strong>Partagé avec Aga</strong><small>Visible dans ta fiche</small></span>
          </label>
        </fieldset>

        <div class="composer-actions">
          <button class="btn btn--primary btn--block btn--lg" data-action="save-entry" type="submit">
            ${isEdit ? 'Enregistrer les modifications' : 'Enregistrer dans mon carnet'}
            ${icon('check', { size: 18 })}
          </button>
          <button class="btn btn--outline btn--block" data-action="save-draft-now" type="button">Garder en brouillon</button>
          ${isEdit ? `<button class="text-link text-link--danger" data-action="delete-entry" data-entry="${entry.id}" type="button">Supprimer cette entrée</button>` : ''}
        </div>
        <p class="fineprint" data-draft-note>${draft ? 'Brouillon repris. Les modifications sont enregistrées automatiquement.' : 'Brouillon enregistré automatiquement pendant la saisie.'}</p>
      </form>
    </main>
  </div>`;
}
