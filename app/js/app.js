import { store } from './store.js';
import { DIMENSIONS, ENTRY_TYPES, getEntryType } from './data.js';
import { formatScore } from './scoring.js';
import { clamp, escapeHTML, todayISO } from './utils.js';
import { icon } from './ui/icons.js';
import { contextualQuestion } from './ui/carnet.js';
import { landingView } from './views/landing.js';
import { quizIntroView, quizQuestionView } from './views/quiz.js';
import { resultView } from './views/result.js';
import { todayView } from './views/today.js';
import { profileView } from './views/profile.js';
import { resourcesView } from './views/resources.js';
import { carnetView, entryComposerView, goalView } from './views/carnet.js';
import { routinesView } from './views/routines.js';
import {
  activitiesView,
  activityComposerView,
  deviceView,
} from './views/activities.js';
import {
  coachAthletesView,
  coachDashboardView,
  coachQuestionnairesView,
  coachResourcesView,
} from './views/coach.js';
import { coachAthleteLiteView as coachAthleteView } from './views/coachAthleteLite.js';
import { setChartPeriod } from './ui/charts.js';
import { sessionSheet, testCatalogSheet } from './ui/sessionSheets.js';
import { TEST_CATALOG } from './fourc-content.js';
import { collectiveView, collectivesView } from './views/collectives.js';
import * as documents from './documents.js';
import {
  activityCommentSheet,
  assignRoutineSheet,
  coachSwitchSheet,
  collectiveFormSheet,
  createRoutineSheet,
  deleteEntrySheet,
  documentSheet,
  exchangeSheet,
  questionSheet,
  resetSheet,
  resourceSheet,
  routineSheet,
  shareSheet,
  unsavedSwitchSheet,
} from './ui/sheets.js';

const config = window.OMIND_CONFIG ?? {};
const stage = document.getElementById('stage');
const app = document.getElementById('app');
const sheetRoot = document.getElementById('sheet-root');
const toastRegion = document.getElementById('toast-region');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let activeSheet = null;
let lastFocused = null;
let blockedBackground = [];
let sheetCleanup = [];
let toastTimer = null;
let breathState = null;
let videoTimer = null;
let pendingSwitchHref = null;
let pendingSwitchAthlete = null;

/* ------------------------------------------------------------------ */
/* Routing                                                             */
/* ------------------------------------------------------------------ */

function currentRoute() {
  const raw = location.hash.replace(/^#/, '') || '/accueil';
  const [pathPart, queryPart = ''] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const params = new URLSearchParams(queryPart);
  const isCoach = segments[0] === 'coach';
  let name = 'landing';

  if (segments[0] === 'test') name = 'quiz';
  else if (segments[0] === 'resultat') name = 'result';
  else if (segments[0] === 'aujourdhui') name = 'today';
  else if (segments[0] === 'espace' && segments[1] === 'profil') name = 'profile';
  else if (segments[0] === 'espace' && segments[1] === 'ressources') name = 'resources';
  else if (isCoach) {
    if (segments.length === 1) name = 'coach-dashboard';
    else if (segments[1] === 'sportifs' && segments[2]) name = 'coach-athlete';
    else if (segments[1] === 'sportifs') name = 'coach-athletes';
    else if (segments[1] === 'questionnaires') name = 'coach-questionnaires';
    else if (segments[1] === 'ressources') name = 'coach-resources';
    else name = 'coach-dashboard';
  }

  return {
    name,
    segments,
    params,
    isCoach,
    athleteId: segments[0] === 'coach' && segments[1] === 'sportifs' ? segments[2] : null,
    collectiveId: segments[0] === 'coach' && segments[1] === 'collectifs' ? segments[2] : null,
    entryId: segments[0] === 'carnet' && segments[1] === 'entree' ? segments[2] : null,
    tab: params.get('tab') ?? 'overview',
  };
}

function navigate(hash, { replace = false } = {}) {
  const target = hash.startsWith('#') ? hash : `#${hash}`;
  if (location.hash === target) {
    render({ focus: true });
    return;
  }
  if (replace) {
    history.replaceState(null, '', target);
    render({ focus: true });
  } else {
    location.hash = target;
  }
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function render({ preserveScroll = false, focus = true } = {}) {
  const route = currentRoute();
  const scroller = route.isCoach ? document.querySelector('.coach__main') : app;
  const scrollTop = preserveScroll ? (scroller?.scrollTop ?? 0) : 0;

  let html = '';

  if (route.name === 'landing') {
    html = landingView({ state: store.state });
  } else if (route.name === 'quiz') {
    const test = store.activeTest();
    if (test?.status === 'in_progress') {
      html = quizQuestionView({ test, index: test.index });
    } else {
      html = quizIntroView({ state: store.state });
    }
  } else if (route.name === 'result') {
    const profile = store.sportif().profile;
    if (!profile) {
      history.replaceState(null, '', '#/test');
      render({ focus });
      return;
    }
    html = resultView({ profile });
  } else if (route.name === 'today') {
    const athlete = store.sportif();
    const latestShare = [...athlete.shared].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt))[0] ?? null;
    html = todayView({
      athlete,
      checkin: store.todayCheckin(),
      latestShare,
    });
  } else if (route.name === 'profile') {
    html = profileView({ athlete: store.sportif(), state: store.state });
  } else if (route.name === 'resources') {
    html = resourcesView({ athlete: store.sportif() });
  } else if (route.name.startsWith('coach')) {
    if (route.name === 'coach-athlete') {
      const athlete = store.athlete(route.athleteId);
      if (!athlete) {
        history.replaceState(null, '', '#/coach/sportifs');
        render({ focus });
        return;
      }
      store.markRecent(athlete.id);
      html = coachAthleteView({
        state: store.state,
        athlete,
        tab: route.tab,
        focus: route.params.get('focus'),
      });
    } else if (route.name === 'coach-athletes') {
      html = coachAthletesView({ state: store.state });
    } else if (route.name === 'coach-questionnaires') {
      html = coachQuestionnairesView({ state: store.state });
    } else if (route.name === 'coach-resources') {
      html = coachResourcesView({ state: store.state });
    } else {
      html = coachDashboardView({ state: store.state });
    }
  }

  stage.dataset.mode = route.isCoach ? 'coach' : 'sportif';
  document.body.dataset.view = route.isCoach ? 'coach' : 'sportif';
  app.innerHTML = html;

  const newScroller = route.isCoach ? document.querySelector('.coach__main') : app;
  if (newScroller) newScroller.scrollTop = scrollTop;

  updateChrome(route);
  updateTitle(route);
  mountView(route);

  if (focus) {
    if (route.name === 'quiz' && store.activeTest()?.status === 'in_progress') {
      const question = document.getElementById('question-title');
      question?.focus({ preventScroll: true });
    } else {
      const title = document.getElementById('view-title');
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus({ preventScroll: true });
      }
    }
  }
}

function updateChrome(route) {
  const role = route.isCoach ? 'coach' : store.sportif().id;
  document.querySelectorAll('[data-role-link]').forEach((link) => {
    const active = link.dataset.roleLink === role;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-site-link]').forEach((link) => {
    link.href = config.siteUrl ?? 'https://www.optima-mind.com';
  });
}

function updateTitle(route) {
  const titles = {
    landing: 'O’MIND — Le mental fait la différence',
    quiz: 'O’MIND — Questionnaire 4C',
    result: 'O’MIND — Ton profil 4C',
    today: 'O’MIND — Ton bilan du jour',
    profile: 'O’MIND — Profil',
    resources: 'O’MIND — Ressources',
    carnet: 'O’MIND — Mon carnet',
    'carnet-goal': 'O’MIND — Mon objectif',
    'carnet-entry': 'O’MIND — Mon carnet',
    'carnet-routines': 'O’MIND — Mes routines',
    'carnet-activities': 'O’MIND — Mes activités',
    'carnet-activity-new': 'O’MIND — Ajouter une activité',
    'carnet-device': 'O’MIND — Connecter un appareil',
    'coach-dashboard': 'O’MIND — Espace Aga',
    'coach-athletes': 'O’MIND — Sportifs',
    'coach-athlete': 'O’MIND — Fiche sportive',
    'coach-collectives': 'O’MIND — Collectifs',
    'coach-collective': 'O’MIND — Collectif',
    'coach-questionnaires': 'O’MIND — Questionnaires',
    'coach-resources': 'O’MIND — Bibliothèque',
  };
  document.title = titles[route.name] ?? 'O’MIND';
}

function mountView(route) {
  if (route.name === 'quiz') mountQuizKeyboard();
  if (route.name === 'today') mountSliders();
  if (route.name === 'carnet-entry') mountEntryComposer();
  if (route.name === 'carnet-activity-new') mountGpxInput();
  if (route.name === 'carnet-device') mountDeviceSelection();
  if (route.name === 'coach-athlete') {
    mountAthleteSwitcher();
    if (route.tab === 'documents') mountDocuments();
  }
}

/* ------------------------------------------------------------------ */
/* Interactions                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('click', (event) => {
  const roleLink = event.target.closest('[data-role-link]');
  if (roleLink) {
    event.preventDefault();
    const role = roleLink.dataset.roleLink;
    if (role === 'coach') {
      navigate('#/coach');
    } else {
      store.setActiveAthlete(role);
      navigate('#/aujourdhui');
    }
    return;
  }

  const athleteSwitch = event.target.closest('[data-athlete-switch]');
  if (athleteSwitch) {
    const currentId = currentRoute().athleteId;
    const note = document.getElementById('coach-note');
    const changed =
      note && currentId && note.value !== (store.state.coachNotes[currentId] ?? '');
    if (athleteSwitch.dataset.athleteSwitch === currentId) {
      event.preventDefault();
      closeSheet({ restoreFocus: false });
      return;
    }
    if (changed) {
      event.preventDefault();
      pendingSwitchHref = athleteSwitch.getAttribute('href');
      pendingSwitchAthlete = currentId;
      openSheet('coach-unsaved', { athlete: currentId });
      return;
    }
  }

  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;
  const action = trigger.dataset.action;

  switch (action) {
    case 'go':
      navigate(trigger.dataset.href);
      break;
    case 'start-test':
      navigate('#/test');
      break;
    case 'view-result':
      navigate('#/resultat');
      break;
    case 'explore-demo':
      navigate('#/aujourdhui');
      showToast(`Profil d’exemple de ${store.sportif().firstName} chargé`);
      break;
    case 'quiz-start':
      if (store.activeTest()?.status !== 'in_progress') store.startTest();
      navigate('#/test');
      break;
    case 'quiz-answer':
      selectAnswer(Number(trigger.dataset.value));
      break;
    case 'quiz-next':
      goNextQuestion();
      break;
    case 'quiz-prev':
      goPreviousQuestion();
      break;
    case 'retake-test':
      store.startTest();
      navigate('#/test');
      break;
    case 'save-checkin':
      saveCheckin();
      break;
    case 'chart-period':
      setChartPeriod(trigger.dataset.period);
      render({ preserveScroll: true, focus: false });
      break;
    case 'open-resource':
      openSheet('resource', { resource: trigger.dataset.resource });
      break;
    case 'open-exchange':
      openSheet('exchange');
      break;
    case 'mark-resource':
      markResourceDone(trigger.dataset.resource);
      break;
    case 'breath-toggle':
      toggleBreathing();
      break;
    case 'video-toggle':
      toggleVideo();
      break;
    case 'copy-summary':
      copySummary();
      break;
    case 'open-share':
      openSheet('share', {
        athlete: trigger.dataset.athlete,
        resource: trigger.dataset.resource ?? null,
      });
      break;
    case 'assign-questionnaire':
      assignQuestionnaire(trigger.dataset.athlete);
      break;
    case 'send-questionnaire':
      sendQuestionnaire(trigger.dataset.athlete);
      break;
    case 'simulate-questionnaire':
      simulateQuestionnaire(trigger.dataset.athlete);
      break;
    case 'mark-alert-seen':
      store.markAlertSeen(trigger.dataset.athlete);
      render({ preserveScroll: true, focus: false });
      showToast('Alerte marquée comme vue');
      break;
    case 'open-session':
      openSheet('session', { athlete: trigger.dataset.athlete });
      break;
    case 'open-test-catalog':
      openSheet('test-catalog', { athlete: trigger.dataset.athlete });
      break;
    case 'reset-demo':
      openSheet('reset');
      break;
    case 'reset-confirm':
      resetDemo();
      break;
    case 'close-sheet':
      closeSheet();
      break;
    case 'open-result':
      navigate('#/resultat');
      break;
    case 'goal-example': {
      const textarea = document.getElementById('goal-text');
      if (textarea) {
        textarea.value = trigger.dataset.text ?? '';
        textarea.focus();
      }
      break;
    }
    case 'save-draft-now': {
      const form = document.querySelector('[data-entry-form]');
      if (form) saveEntryDraft(form, { silent: false });
      break;
    }
    case 'clear-draft':
      store.clearDraft();
      render({ preserveScroll: true, focus: false });
      showToast('Brouillon supprimé');
      break;
    case 'toggle-entry-share': {
      const entryId = trigger.dataset.entry;
      const current = trigger.dataset.visibility;
      store.setEntryVisibility(entryId, current === 'shared' ? 'private' : 'shared');
      render({ preserveScroll: true, focus: false });
      showToast(current === 'shared' ? 'Entrée redevenue privée' : 'Entrée partagée avec Aga');
      break;
    }
    case 'open-question':
      openSheet('question', { entry: trigger.dataset.entry });
      break;
    case 'delete-entry':
      openSheet('delete-entry', { entry: trigger.dataset.entry });
      break;
    case 'confirm-delete-entry':
      store.deleteEntry(trigger.dataset.entry);
      closeSheet({ restoreFocus: false });
      navigate('#/carnet');
      showToast('Entrée supprimée');
      break;
    case 'open-routine':
      openSheet('routine', { kind: trigger.dataset.kind, id: trigger.dataset.id });
      break;
    case 'routine-try': {
      const form = sheetRoot.querySelector('[data-feedback-form]');
      const summary = sheetRoot.querySelector('[data-feedback-summary]');
      const opener = sheetRoot.querySelector('[data-feedback-open]');
      if (form) form.hidden = false;
      if (summary) summary.hidden = true;
      if (opener) opener.hidden = true;
      form?.querySelector('input[name="helpfulness"]')?.focus();
      break;
    }
    case 'open-create-routine':
      openSheet('create-routine');
      break;
    case 'connect-device': {
      store.connectDevice();
      render({ preserveScroll: true, focus: false });
      showToast('Strava connecté en mode démo');
      break;
    }
    case 'sync-device': {
      const result = store.syncDevice();
      render({ preserveScroll: true, focus: false });
      if (!result.ok) {
        showToast(result.error ?? 'La synchronisation a échoué');
      } else if (result.imported > 0) {
        showToast(`${result.imported} activité${result.imported > 1 ? 's' : ''} importée${result.imported > 1 ? 's' : ''}`);
      } else {
        showToast('Aucune nouvelle activité — les doublons sont ignorés');
      }
      break;
    }
    case 'disconnect-device':
      store.disconnectDevice();
      render({ preserveScroll: true, focus: false });
      showToast('Appareil déconnecté — les activités restent dans le carnet');
      break;
    case 'fail-next-device':
      store.toggleDeviceFailure();
      render({ preserveScroll: true, focus: false });
      showToast('Le prochain essai de synchronisation échouera (démo)');
      break;
    case 'edit-activity':
      openSheet('activity-comment', { activity: trigger.dataset.activity });
      break;
    case 'open-athlete-switch':
      openSheet('coach-switch', {
        athlete: trigger.dataset.athlete ?? currentRoute().athleteId,
        tab: trigger.dataset.tab ?? currentRoute().tab ?? 'overview',
      });
      break;
    case 'save-coach-note': {
      const noteField = document.getElementById('coach-note');
      store.saveCoachNote(trigger.dataset.athlete, noteField?.value ?? '');
      showToast('Note de suivi enregistrée');
      break;
    }
    case 'save-note-and-switch': {
      const noteField = document.getElementById('coach-note');
      if (pendingSwitchAthlete) {
        store.saveCoachNote(pendingSwitchAthlete, noteField?.value ?? '');
      }
      const href = pendingSwitchHref;
      pendingSwitchHref = null;
      pendingSwitchAthlete = null;
      closeSheet({ restoreFocus: false });
      if (href) navigate(href);
      showToast('Note enregistrée');
      break;
    }
    case 'discard-and-switch': {
      const href = pendingSwitchHref;
      pendingSwitchHref = null;
      pendingSwitchAthlete = null;
      closeSheet({ restoreFocus: false });
      if (href) navigate(href);
      break;
    }
    case 'open-collective-form':
      openSheet('collective-form', {
        collective: trigger.dataset.collective ?? null,
      });
      break;
    case 'open-assign-routine':
      openSheet('assign-routine', {
        athlete: trigger.dataset.athlete ?? null,
        collective: trigger.dataset.collective ?? null,
      });
      break;
    case 'edit-document':
      openSheet('document', { doc: trigger.dataset.doc, as: trigger.dataset.as ?? 'coach' });
      break;
    case 'open-document':
      documents
        .openInTab(trigger.dataset.doc, Number(trigger.dataset.version), trigger.dataset.as ?? 'coach')
        .catch((error) => showToast(error.message ?? 'Ouverture impossible'));
      break;
    case 'download-document':
      documents
        .download(trigger.dataset.doc, Number(trigger.dataset.version), trigger.dataset.as ?? 'coach')
        .catch((error) => showToast(error.message ?? 'Téléchargement impossible'));
      break;
    case 'toggle-document-share': {
      const wasShared = trigger.dataset.shared === 'true';
      const target = store.athlete(trigger.dataset.athlete);
      documents.setShared(trigger.dataset.doc, !wasShared);
      closeSheet({ restoreFocus: false });
      render({ preserveScroll: true, focus: false });
      showToast(
        wasShared
          ? 'Document redevenu privé'
          : `Document partagé avec ${target.firstName}`,
      );
      break;
    }
    case 'share-document-version': {
      documents.setShared(trigger.dataset.doc, true, Number(trigger.dataset.version));
      closeSheet({ restoreFocus: false });
      render({ preserveScroll: true, focus: false });
      showToast(`Version ${trigger.dataset.version} partagée avec ${store.athlete(trigger.dataset.athlete).firstName}`);
      break;
    }
    case 'sample-document': {
      const target = store.athlete(trigger.dataset.athlete);
      const blob = documents.createSamplePdf(target.name, target.sport);
      const file = new File([blob], `profil-${target.id}.pdf`, { type: 'application/pdf' });
      handleDocumentFile(file, target.id);
      break;
    }
    case 'toggle-activity-share': {
      const activityId = trigger.dataset.activity;
      const shared = trigger.dataset.shared === 'true';
      store.setActivityShared(activityId, !shared);
      render({ preserveScroll: true, focus: false });
      showToast(shared ? 'Activité redevenue privée' : 'Activité partagée avec Aga');
      break;
    }
    default:
      break;
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.matches('[data-share-form]')) {
    event.preventDefault();
    const resourceId = form.querySelector('input[name="resource"]:checked')?.value;
    const athleteId = form.dataset.athlete;
    if (!resourceId) {
      showToast('Choisis une ressource à partager');
      return;
    }
    const athlete = store.athlete(athleteId);
    store.shareResource(athleteId, resourceId, new FormData(form).get('message') ?? '');
    closeSheet({ restoreFocus: false });
    render({ preserveScroll: true, focus: true });
    showToast(`Ressource partagée à ${athlete.firstName}`);
    return;
  }
  if (form.matches('[data-goal-form]')) {
    event.preventDefault();
    handleGoalSubmit(form);
    return;
  }
  if (form.matches('[data-entry-form]')) {
    event.preventDefault();
    handleEntrySubmit(form);
    return;
  }
  if (form.matches('[data-routine-form]')) {
    event.preventDefault();
    handleRoutineSubmit(form);
    return;
  }
  if (form.matches('[data-routine-feedback-form]')) {
    event.preventDefault();
    handleFeedbackSubmit(form);
    return;
  }
  if (form.matches('[data-question-form]')) {
    event.preventDefault();
    handleQuestionSubmit(form);
    return;
  }
  if (form.matches('[data-activity-form]')) {
    event.preventDefault();
    handleActivitySubmit(form);
    return;
  }
  if (form.matches('[data-activity-comment-form]')) {
    event.preventDefault();
    handleActivityCommentSubmit(form);
    return;
  }
  if (form.matches('[data-document-form]')) {
    event.preventDefault();
    const data = new FormData(form);
    documents.update(form.dataset.doc, {
      name: data.get('name') ?? '',
      date: data.get('date') ?? '',
    });
    closeSheet({ restoreFocus: false });
    render({ preserveScroll: true, focus: true });
    showToast('Document mis à jour');
    return;
  }
  if (form.matches('[data-collective-form]')) {
    event.preventDefault();
    handleCollectiveSubmit(form);
    return;
  }
  if (form.matches('[data-assign-routine-form]')) {
    event.preventDefault();
    handleAssignRoutineSubmit(form);
    return;
  }
  if (form.matches('[data-session-form]')) {
    event.preventDefault();
    const data = new FormData(form);
    const athleteId = form.dataset.athlete;
    const athlete = store.athlete(athleteId);
    const nextSteps = String(data.get('nextSteps') ?? '').trim();
    if (!nextSteps) {
      showToast('Écris les prochaines étapes pour le sportif');
      form.querySelector('[name="nextSteps"]')?.focus();
      return;
    }
    store.createSession(athleteId, {
      date: String(data.get('date') ?? ''),
      privateNote: String(data.get('privateNote') ?? ''),
      nextSteps,
      resourceIds: data.getAll('resources').map(String),
    });
    closeSheet({ restoreFocus: false });
    render({ preserveScroll: true, focus: true });
    showToast(`Séance clôturée pour ${athlete.firstName}`);
    return;
  }
  if (form.matches('[data-test-form]')) {
    event.preventDefault();
    const data = new FormData(form);
    const athleteId = String(data.get('athlete') ?? '');
    const testId = String(data.get('test') ?? '');
    const test = TEST_CATALOG.find((item) => item.id === testId);
    const athlete = store.athlete(athleteId);
    if (!athlete || !test) return;
    if (!test.available) {
      showToast('Ce test arrivera bientôt');
      return;
    }
    store.assignQuestionnaire(athleteId, {
      testId: test.id,
      testName: test.name,
      message: String(data.get('message') ?? ''),
    });
    closeSheet({ restoreFocus: false });
    render({ preserveScroll: true, focus: true });
    showToast(`Test attribué à ${athlete.firstName}`);
  }
});


/* ------------------------------------------------------------------ */
/* Carnet                                                              */
/* ------------------------------------------------------------------ */

function collectEntryForm(form) {
  const data = new FormData(form);
  const type = getEntryType(data.get('type'));
  const questionCard = form.querySelector('[data-question-card]');
  const question =
    questionCard && !questionCard.hidden
      ? form.querySelector('[data-question-text]')?.textContent.trim() ?? ''
      : '';
  return {
    id: form.dataset.entryId || undefined,
    type: type.key,
    date: data.get('date') || todayISO(),
    title: data.get('title') ?? '',
    context: data.get('context') ?? '',
    note: data.get('note') ?? '',
    helped: data.get('helped') ?? '',
    question,
    answer: type.needsRoutine ? data.get('answer') ?? '' : '',
    routineIds: data.getAll('routineIds'),
    visibility: data.get('visibility') ?? 'private',
  };
}

function saveEntryDraft(form, { silent = true } = {}) {
  const payload = collectEntryForm(form);
  const hasContent = payload.title || payload.note || payload.helped || payload.answer;
  if (!hasContent) return;
  store.saveDraft(payload);
  const time = new Intl.DateTimeFormat('fr-BE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
  const status = document.querySelector('[data-draft-status]');
  const note = document.querySelector('[data-draft-note]');
  if (status) status.textContent = 'Brouillon';
  if (note) note.textContent = `Brouillon enregistré à ${time}.`;
  if (!silent) showToast('Brouillon enregistré');
}

function handleEntrySubmit(form) {
  const payload = collectEntryForm(form);
  if (!payload.title.trim() && !payload.note.trim()) {
    showToast('Ajoute quelques mots avant d’enregistrer');
    form.querySelector('[name="note"]')?.focus();
    return;
  }
  store.saveEntry(payload);
  navigate('#/carnet');
  showToast(form.dataset.entryId ? 'Entrée mise à jour' : 'Entrée ajoutée à ton carnet');
}

function handleGoalSubmit(form) {
  const data = new FormData(form);
  const goal = (data.get('goal') ?? '').trim();
  if (!goal) {
    showToast('Écris ton objectif en quelques mots');
    form.querySelector('[name="goal"]')?.focus();
    return;
  }
  store.setGoal(goal);
  navigate('#/carnet');
  showToast('Objectif enregistré');
}

function handleRoutineSubmit(form) {
  const data = new FormData(form);
  const title = (data.get('title') ?? '').trim();
  const steps = [1, 2, 3]
    .map((index) => ({
      title: (data.get(`step-title-${index}`) ?? '').trim(),
      text: (data.get(`step-text-${index}`) ?? '').trim(),
    }))
    .filter((step) => step.title);
  if (!title) {
    showToast('Donne un nom à ta routine');
    return;
  }
  if (!steps.length) {
    showToast('Ajoute au moins une étape');
    return;
  }
  store.createCustomRoutine({
    title,
    moment: data.get('moment') === 'competition' ? 'competition' : 'training',
    steps,
  });
  closeSheet({ restoreFocus: false });
  render({ preserveScroll: true, focus: true });
  showToast('Routine créée');
}

function handleFeedbackSubmit(form) {
  const data = new FormData(form);
  const helpfulness = data.get('helpfulness');
  if (!helpfulness) {
    showToast('Choisis ce que ça a donné');
    return;
  }
  const shared = data.get('shared') === 'on';
  store.recordRoutineFeedback({
    kind: form.dataset.kind,
    id: form.dataset.id,
    helpfulness,
    comment: data.get('comment') ?? '',
    shared,
  });
  closeSheet({ restoreFocus: false });
  render({ preserveScroll: true, focus: true });
  showToast(shared ? 'Retour partagé avec Aga' : 'Retour enregistré en privé');
}

function handleQuestionSubmit(form) {
  const data = new FormData(form);
  const answer = (data.get('answer') ?? '').trim();
  if (!answer) {
    showToast('Une phrase suffit');
    return;
  }
  store.answerEntryQuestion(form.dataset.entry, answer);
  closeSheet({ restoreFocus: false });
  render({ preserveScroll: true, focus: true });
  showToast('Réponse ajoutée à ton carnet');
}

function parseGpx(text) {
  const documentGpx = new DOMParser().parseFromString(text, 'application/xml');
  if (documentGpx.querySelector('parsererror')) throw new Error('Fichier GPX illisible');
  const points = [...documentGpx.querySelectorAll('trkpt')];
  if (!points.length) throw new Error('Aucun point d’activité trouvé');
  const name =
    documentGpx.querySelector('trk > name')?.textContent?.trim() ||
    documentGpx.querySelector('metadata > name')?.textContent?.trim() ||
    'Activité importée';
  const times = points
    .map((point) => new Date(point.querySelector('time')?.textContent ?? ''))
    .filter((date) => !Number.isNaN(date.getTime()));
  let distance = 0;
  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const next = points[index];
    const lat1 = Number(prev.getAttribute('lat'));
    const lon1 = Number(prev.getAttribute('lon'));
    const lat2 = Number(next.getAttribute('lat'));
    const lon2 = Number(next.getAttribute('lon'));
    if ([lat1, lon1, lat2, lon2].some((value) => Number.isNaN(value))) continue;
    const radius = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    distance += radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  const duration =
    times.length > 1
      ? Math.max(1, Math.round((times[times.length - 1] - times[0]) / 60000))
      : null;
  const start = times[0] ?? new Date();
  const date = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  return {
    activity: name,
    date,
    duration,
    distance: distance ? Math.round(distance * 10) / 10 : null,
  };
}

function handleActivitySubmit(form) {
  const data = new FormData(form);
  const source = form.dataset.source === 'gpx' ? 'gpx' : 'manual';
  const shared = data.get('visibility') === 'shared';
  if (source === 'gpx') {
    const activity = (data.get('activity') ?? '').trim();
    const date = data.get('date') ?? '';
    if (!activity || !date) {
      showToast('Choisis un fichier GPX valide');
      return;
    }
    const includeDuration = data.get('field-duration') === 'on';
    const includeDistance = data.get('field-distance') === 'on';
    const result = store.addActivity({
      activity,
      date,
      duration: includeDuration ? Number(data.get('duration')) || null : null,
      distance: includeDistance ? Number(data.get('distance')) || null : null,
      comment: data.get('comment') ?? '',
      source: 'gpx',
      shared,
      fields: [
        'activity',
        'date',
        ...(includeDuration ? ['duration'] : []),
        ...(includeDistance ? ['distance'] : []),
      ],
    });
    if (!result.ok) {
      showToast('Cette activité est déjà dans ton carnet');
      return;
    }
    navigate('#/carnet/activites');
    showToast('Activité importée dans ton carnet');
    return;
  }

  const activity = (data.get('activity') ?? '').trim();
  if (!activity) {
    showToast('Indique le nom de l’activité');
    return;
  }
  const duration = data.get('duration') ? Number(data.get('duration')) : null;
  const distance = data.get('distance') ? Number(data.get('distance')) : null;
  const result = store.addActivity({
    activity,
    date: data.get('date') || todayISO(),
    duration,
    distance,
    comment: data.get('comment') ?? '',
    source: 'manual',
    shared,
    fields: [
      'activity',
      'date',
      ...(duration ? ['duration'] : []),
      ...(distance ? ['distance'] : []),
    ],
  });
  if (!result.ok) {
    showToast('Cette activité est déjà dans ton carnet');
    return;
  }
  navigate('#/carnet/activites');
  showToast('Activité ajoutée à ton carnet');
}

function handleActivityCommentSubmit(form) {
  store.updateActivity(form.dataset.activity, {
    comment: new FormData(form).get('comment') ?? '',
  });
  closeSheet({ restoreFocus: false });
  render({ preserveScroll: true, focus: true });
  showToast('Commentaire enregistré');
}

function mountEntryComposer() {
  const form = document.querySelector('[data-entry-form]');
  if (!form) return;
  const athlete = store.sportif();
  const typeInput = form.querySelector('input[name="type"]');
  const heading = document.querySelector('[data-entry-heading]');
  const noteLabel = document.querySelector('[data-entry-note-label]');
  const note = form.querySelector('[name="note"]');
  const routineField = form.querySelector('[data-routine-field]');
  const questionCard = form.querySelector('[data-question-card]');
  const questionText = form.querySelector('[data-question-text]');

  const updateQuestion = () => {
    const type = getEntryType(typeInput.value);
    if (!type.needsRoutine) return;
    const routineIds = [...form.querySelectorAll('input[name="routineIds"]:checked')].map(
      (input) => input.value,
    );
    if (questionText) questionText.textContent = contextualQuestion(athlete, type.key, routineIds);
  };

  form.querySelectorAll('[data-entry-type]').forEach((button) => {
    button.addEventListener('click', () => {
      const type = getEntryType(button.dataset.entryType);
      typeInput.value = type.key;
      form.querySelectorAll('[data-entry-type]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      if (heading) heading.textContent = form.dataset.entryId ? 'Modifier' : type.heading;
      if (noteLabel) noteLabel.textContent = type.noteLabel;
      if (note) note.placeholder = type.notePlaceholder;
      if (routineField) routineField.hidden = !type.needsRoutine;
      if (questionCard) questionCard.hidden = !type.needsRoutine;
      updateQuestion();
    });
  });

  form.querySelectorAll('input[name="routineIds"]').forEach((input) => {
    input.addEventListener('change', updateQuestion);
  });

  form.querySelectorAll('input[name="visibility"]').forEach((input) => {
    input.addEventListener('change', () => {
      form.querySelectorAll('.visibility-option').forEach((label) => {
        label.classList.toggle('is-selected', label.querySelector('input')?.checked);
      });
    });
  });

  let timer = null;
  const autosave = () => {
    clearTimeout(timer);
    timer = setTimeout(() => saveEntryDraft(form), 700);
  };
  form.addEventListener('input', autosave);
  form.addEventListener('change', autosave);
}

function mountGpxInput() {
  const input = document.querySelector('[data-gpx-input]');
  if (!input) return;
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const parsed = parseGpx(await file.text());
      const preview = document.querySelector('[data-gpx-preview]');
      const fields = document.querySelector('[data-gpx-fields]');
      if (preview) preview.hidden = false;
      if (fields) fields.hidden = false;
      const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value ?? '—';
      };
      setText('[data-gpx-activity]', parsed.activity);
      setText('[data-gpx-date]', parsed.date);
      setText('[data-gpx-duration]', parsed.duration ? `${parsed.duration} min` : 'Non disponible');
      setText('[data-gpx-distance]', parsed.distance ? `${parsed.distance} km` : 'Non disponible');
      const setValue = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.value = value ?? '';
      };
      setValue('[data-gpx-hidden-activity]', parsed.activity);
      setValue('[data-gpx-hidden-date]', parsed.date);
      setValue('[data-gpx-hidden-duration]', parsed.duration ?? '');
      setValue('[data-gpx-hidden-distance]', parsed.distance ?? '');
      showToast('Fichier GPX analysé');
    } catch (error) {
      showToast(error.message ?? 'Fichier GPX illisible');
    }
  });
}

function mountDeviceSelection() {
  document.querySelectorAll('[data-device-selection]').forEach((input) => {
    input.addEventListener('change', () => {
      store.setDeviceSelection({ [input.dataset.deviceSelection]: input.checked });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

function selectAnswer(value) {
  const test = store.activeTest();
  if (!test) return;
  store.answer(value);
  const group = document.querySelector('[data-answers]');
  if (!group) return;
  group.querySelectorAll('.answer').forEach((button) => {
    const selected = Number(button.dataset.value) === value;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-checked', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  const next = document.querySelector('[data-action="quiz-next"]');
  if (next) next.disabled = false;
  const hint = document.querySelector('.quiz__hint');
  if (hint) hint.textContent = 'Réponse enregistrée. Tu peux la modifier.';
}

function goNextQuestion() {
  const test = store.activeTest();
  if (!test) return;
  const questionId = test.order[test.index];
  if (!test.answers[questionId]) {
    showToast('Choisis une réponse pour continuer');
    return;
  }
  if (test.index === test.order.length - 1) {
    const missing = test.order.findIndex((id) => !test.answers[id]);
    if (missing >= 0) {
      store.goToQuestion(missing);
      renderQuizStep();
      showToast('Une réponse manque encore');
      return;
    }
    store.finishTest();
    navigate('#/resultat');
    return;
  }
  store.goToQuestion(test.index + 1);
  renderQuizStep();
}

function goPreviousQuestion() {
  const test = store.activeTest();
  if (!test) return;
  if (test.index === 0) {
    navigate('#/accueil');
    return;
  }
  store.goToQuestion(test.index - 1);
  renderQuizStep();
}

function renderQuizStep() {
  const test = store.activeTest();
  if (!test) return;
  app.innerHTML = quizQuestionView({ test, index: test.index });
  app.scrollTop = 0;
  mountQuizKeyboard();
  document.getElementById('question-title')?.focus({ preventScroll: true });
}

function mountQuizKeyboard() {
  const group = document.querySelector('[data-answers]');
  if (!group) return;
  group.addEventListener('keydown', (event) => {
    const buttons = [...group.querySelectorAll('.answer')];
    const index = buttons.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      const next = buttons[(index + 1 + buttons.length) % buttons.length];
      focusAnswer(buttons, next);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const previous = buttons[(index - 1 + buttons.length) % buttons.length];
      focusAnswer(buttons, previous);
    } else if (/^[1-5]$/.test(event.key)) {
      event.preventDefault();
      const target = buttons[Number(event.key) - 1];
      focusAnswer(buttons, target);
      target.click();
    }
  });
}

function focusAnswer(buttons, target) {
  buttons.forEach((button) => {
    button.tabIndex = button === target ? 0 : -1;
  });
  target.focus();
}

/* ------------------------------------------------------------------ */
/* Check-in                                                            */
/* ------------------------------------------------------------------ */

function mountSliders() {
  document.querySelectorAll('.range').forEach((input) => {
    const output = document.getElementById(`value-${input.dataset.slider}`);
    const update = () => {
      const value = Number(input.value);
      input.style.setProperty('--value', `${((value - 1) / 9) * 100}%`);
      input.setAttribute('aria-valuetext', `${value} sur 10`);
      if (output) output.innerHTML = `${value} <small>/ 10</small>`;
    };
    input.addEventListener('input', update);
    update();
  });
}

function saveCheckin() {
  const mood = Number(document.getElementById('slider-mood')?.value ?? 7);
  const energy = Number(document.getElementById('slider-energy')?.value ?? 6);
  const sleep = Number(document.getElementById('slider-sleep')?.value ?? 8);
  const word = document.getElementById('day-word')?.value ?? '';
  store.saveCheckin({
    mood: clamp(mood, 1, 10),
    energy: clamp(energy, 1, 10),
    sleep: clamp(sleep, 1, 10),
    word,
  });
  render({ preserveScroll: true, focus: false });
  showToast('Bilan enregistré');
  const banner = document.querySelector('.saved-banner');
  if (banner) {
    banner.setAttribute('tabindex', '-1');
    banner.focus({ preventScroll: true });
  }
}

/* ------------------------------------------------------------------ */
/* Coach actions                                                       */
/* ------------------------------------------------------------------ */

function assignQuestionnaire(athleteId) {
  const athlete = store.athlete(athleteId);
  store.assignQuestionnaire(athleteId);
  render({ preserveScroll: true, focus: false });
  showToast(`Questionnaire 4C attribué à ${athlete.firstName}`);
}

function sendQuestionnaire(athleteId) {
  const athlete = store.athlete(athleteId);
  store.markQuestionnaireSent(athleteId);
  render({ preserveScroll: true, focus: false });
  showToast(`Questionnaire marqué comme envoyé à ${athlete.firstName}`);
}

function simulateQuestionnaire(athleteId) {
  const athlete = store.athlete(athleteId);
  store.simulateQuestionnaireResponse(athleteId);
  render({ preserveScroll: true, focus: false });
  showToast(`Réponse simulée — profil 4C de ${athlete.firstName} mis à jour`);
}

function resetDemo() {
  store.reset();
  closeSheet({ restoreFocus: false });
  navigate('#/accueil');
  showToast('Démo réinitialisée');
}

/* ------------------------------------------------------------------ */
/* Sheets                                                              */
/* ------------------------------------------------------------------ */

function buildSheet(name, context = {}) {
  const athlete = store.sportif();
  if (name === 'resource') {
    const resourceId = context.resource;
    const done = Boolean(athlete.resourcesDone[resourceId]);
    return resourceSheet(resourceId, { done });
  }
  if (name === 'exchange') return exchangeSheet(athlete.profile);
  if (name === 'share') {
    const target = store.athlete(context.athlete ?? store.state.activeAthlete);
    return target ? shareSheet(target, context.resource ?? null) : null;
  }
  if (name === 'reset') return resetSheet();
  if (name === 'session') {
    const athlete = store.athlete(context.athlete ?? store.state.activeAthlete);
    return athlete ? sessionSheet(athlete) : null;
  }
  if (name === 'test-catalog') {
    return testCatalogSheet({
      state: store.state,
      athleteId: context.athlete ?? store.state.activeAthlete,
    });
  }
  if (name === 'routine') {
    return routineSheet({ athlete, kind: context.kind, id: context.id });
  }
  if (name === 'create-routine') return createRoutineSheet();
  if (name === 'question') return questionSheet({ athlete, entryId: context.entry });
  if (name === 'activity-comment') {
    return activityCommentSheet({ athlete, activityId: context.activity });
  }
  if (name === 'delete-entry') return deleteEntrySheet({ athlete, entryId: context.entry });
  if (name === 'coach-switch') {
    return coachSwitchSheet({
      state: store.state,
      currentId: context.athlete ?? store.state.activeAthlete,
      tab: context.tab ?? 'overview',
    });
  }
  if (name === 'coach-unsaved') {
    return unsavedSwitchSheet({ athlete: store.athlete(context.athlete) });
  }
  if (name === 'collective-form') {
    const collective = context.collective
      ? store.state.collectives.find((item) => item.id === context.collective)
      : null;
    return collectiveFormSheet({ state: store.state, collective });
  }
  if (name === 'assign-routine') {
    const collective = context.collective
      ? store.state.collectives.find((item) => item.id === context.collective)
      : null;
    const target = context.athlete ? store.athlete(context.athlete) : null;
    if (!collective && !target) return null;
    return assignRoutineSheet({ state: store.state, athlete: target, collective });
  }
  if (name === 'document') {
    const doc = documents.get(context.doc);
    if (!doc) return null;
    return documentSheet({
      doc,
      athlete: store.athlete(doc.athleteId),
      as: context.as ?? 'coach',
    });
  }
  return null;
}

function openSheet(name, context = {}) {
  const data = buildSheet(name, context);
  if (!data) return;
  closeSheet({ restoreFocus: false });
  lastFocused = document.activeElement;
  activeSheet = { name, context };
  sheetCleanup = [];

  sheetRoot.innerHTML = `<div class="sheet-scrim" data-action="close-sheet"></div>
    <section class="sheet sheet--${data.variant}" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="sheet__grab" aria-hidden="true"></div>
      <header class="sheet__head">
        <button class="sheet__close" data-action="close-sheet" type="button" aria-label="Fermer">
          ${icon(data.variant === 'panel' ? 'back' : 'close', { size: 20 })}
        </button>
        <div class="sheet__headings">
          <p class="eyebrow">${data.eyebrow}</p>
          <h2 class="display display--sheet" id="sheet-title">${data.title}</h2>
        </div>
      </header>
      <div class="sheet__body">${data.body}</div>
    </section>`;

  stage.inert = false;
  document.body.classList.add('has-sheet');
  blockedBackground = [
    app,
    document.querySelector('.brandrail'),
    document.querySelector('.demobar'),
    document.querySelector('.skip-link'),
  ].filter(Boolean);
  blockedBackground.forEach((element) => {
    element.inert = true;
  });
  mountSheet(name);
  if (name === 'coach-switch') mountAthleteSwitcher();
  if (name === 'assign-routine') mountAssignRoutine();
  if (name === 'collective-form') mountCollectiveFormTypes();
  if (name === 'document') mountDocuments();
  requestAnimationFrame(() => sheetRoot.querySelector('.sheet__close')?.focus());
}

function closeSheet({ restoreFocus = true } = {}) {
  if (!sheetRoot.firstElementChild) return;
  sheetCleanup.forEach((fn) => fn());
  sheetCleanup = [];
  stopBreathing();
  if (videoTimer) {
    clearTimeout(videoTimer);
    videoTimer = null;
  }
  sheetRoot.innerHTML = '';
  stage.inert = false;
  document.body.classList.remove('has-sheet');
  blockedBackground.forEach((element) => {
    element.inert = false;
  });
  blockedBackground = [];
  activeSheet = null;
  if (restoreFocus && lastFocused?.isConnected) {
    lastFocused.focus();
  }
  lastFocused = null;
}

function mountSheet(name) {
  if (name === 'resource') {
    if (document.querySelector('[data-breath]')) mountBreathing();
    if (document.querySelector('.video-preview')) {
      sheetCleanup.push(() => {
        if (videoTimer) clearTimeout(videoTimer);
      });
    }
  }
  wireRoutineSteps();
}

function wireRoutineSteps() {
  document.querySelectorAll('.routine-step__check').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      checkbox.closest('.routine-step')?.classList.toggle('is-done', checkbox.checked);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Breathing exercise                                                  */
/* ------------------------------------------------------------------ */

function mountBreathing() {
  breathState = {
    phaseIndex: 0,
    remaining: 4,
    cycle: 0,
    running: false,
    started: false,
    complete: false,
    timer: null,
    phases: [
      { label: 'Inspire', seconds: 4, hint: 'Par le nez, sans forcer.' },
      { label: 'Retiens', seconds: 2, hint: 'Sans crispation.' },
      { label: 'Expire', seconds: 6, hint: 'Plus long que l’inspiration.' },
    ],
  };
  paintBreathing();
}

function paintBreathing() {
  if (!breathState) return;
  const phase = breathState.phases[breathState.phaseIndex];
  const circle = document.querySelector('[data-breath-circle]');
  const label = document.querySelector('[data-breath-phase]');
  const count = document.querySelector('[data-breath-count]');
  const hint = document.querySelector('[data-breath-hint]');
  const cycles = document.querySelector('[data-breath-cycles]');
  const buttonLabel = document.querySelector('[data-breath-label]');
  if (!circle) return;

  const elapsed = phase.seconds - breathState.remaining;
  circle.style.setProperty('--progress', String((elapsed / phase.seconds) * 100));
  circle.dataset.phase = phase.label.toLowerCase();
  if (label) {
    label.textContent = breathState.complete ? 'Terminé' : breathState.started ? phase.label : 'Prêt ?';
  }
  if (count) {
    count.textContent = breathState.complete
      ? '4 cycles'
      : breathState.started
        ? `${Math.max(breathState.remaining, 1)} s`
        : '4 · 2 · 6';
  }
  if (hint) {
    hint.textContent = breathState.complete
      ? 'Quatre cycles. Tu peux reprendre quand tu veux.'
      : breathState.started
        ? phase.hint
        : 'Inspire 4 s, retiens 2 s, expire 6 s.';
  }
  if (cycles) {
    const current = breathState.complete
      ? 4
      : breathState.started
        ? Math.min(breathState.cycle + 1, 4)
        : 0;
    cycles.textContent = `${current} / 4 cycles`;
  }
  if (buttonLabel) {
    buttonLabel.textContent = breathState.running
      ? 'Pause'
      : breathState.complete
        ? 'Recommencer'
        : breathState.started
          ? 'Reprendre'
          : 'Commencer';
  }
}

function toggleBreathing() {
  if (!breathState) return;
  if (breathState.running) {
    clearInterval(breathState.timer);
    breathState.running = false;
    paintBreathing();
    return;
  }
  if (breathState.complete) {
    breathState.phaseIndex = 0;
    breathState.remaining = 4;
    breathState.cycle = 0;
    breathState.complete = false;
  }
  breathState.started = true;
  breathState.running = true;
  const live = document.querySelector('[data-breath-live]');
  const phase = breathState.phases[breathState.phaseIndex];
  if (live) live.textContent = `${phase.label}, ${breathState.remaining} secondes`;
  paintBreathing();

  breathState.timer = setInterval(() => {
    if (!breathState) return;
    breathState.remaining -= 1;
    if (breathState.remaining <= 0) {
      breathState.phaseIndex += 1;
      if (breathState.phaseIndex >= breathState.phases.length) {
        breathState.phaseIndex = 0;
        breathState.cycle += 1;
        if (breathState.cycle >= 4) {
          clearInterval(breathState.timer);
          breathState.running = false;
          breathState.complete = true;
          paintBreathing();
          const live = document.querySelector('[data-breath-live]');
          if (live) live.textContent = 'Exercice terminé, quatre cycles.';
          return;
        }
      }
      breathState.remaining = breathState.phases[breathState.phaseIndex].seconds;
      const live = document.querySelector('[data-breath-live]');
      if (live) {
        live.textContent = `${breathState.phases[breathState.phaseIndex].label}, ${breathState.remaining} secondes`;
      }
    }
    paintBreathing();
  }, 1000);
}

function stopBreathing() {
  if (breathState?.timer) clearInterval(breathState.timer);
  breathState = null;
}

/* ------------------------------------------------------------------ */
/* Video preview                                                       */
/* ------------------------------------------------------------------ */

function toggleVideo() {
  const preview = document.querySelector('.video-preview');
  if (!preview) return;
  const playing = preview.classList.toggle('is-playing');
  const button = preview.querySelector('[data-action="video-toggle"]');
  if (playing) {
    if (button) {
      button.innerHTML = icon('pause', { size: 22 });
      button.setAttribute('aria-label', 'Arrêter l’aperçu');
    }
    if (reducedMotion.matches) {
      preview.classList.add('is-finished');
    } else {
      videoTimer = setTimeout(() => {
        preview.classList.remove('is-playing');
        preview.classList.add('is-finished');
        if (button) {
          button.innerHTML = icon('play', { size: 22 });
          button.setAttribute('aria-label', 'Revoir l’aperçu');
        }
      }, 8000);
    }
  } else {
    if (videoTimer) clearTimeout(videoTimer);
    if (button) button.innerHTML = icon('play', { size: 22 });
  }
}

/* ------------------------------------------------------------------ */
/* Resources & contact                                                 */
/* ------------------------------------------------------------------ */

function markResourceDone(resourceId) {
  const athlete = store.sportif();
  if (athlete.resourcesDone[resourceId]) {
    showToast('Cette ressource est déjà marquée');
    return;
  }
  store.markResourceDone(resourceId);
  closeSheet({ restoreFocus: false });
  render({ preserveScroll: true, focus: true });
  showToast('Ressource marquée comme faite');
}

async function copySummary() {
  const profile = store.sportif().profile;
  const scores = profile
    ? DIMENSIONS.map((dimension) => `${dimension.name} ${formatScore(profile.scores[dimension.key])}/5`).join(' · ')
    : 'Profil 4C non complété';
  const text = `Mon profil 4C O’MIND — ${scores}\nAutoévaluation exploratoire, non validée psychométriquement.`;

  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard indisponible');
    await navigator.clipboard.writeText(text);
    showToast('Résumé du profil copié');
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    area.remove();
    showToast(copied ? 'Résumé du profil copié' : 'Copie impossible sur ce navigateur');
  }
}

/* ------------------------------------------------------------------ */
/* Coach : collectifs, assignation, documents                          */
/* ------------------------------------------------------------------ */

function handleCollectiveSubmit(form) {
  const data = new FormData(form);
  const name = (data.get('name') ?? '').trim();
  const memberIds = data.getAll('members');
  if (!name) {
    showToast('Donne un nom au collectif');
    return;
  }
  if (!memberIds.length) {
    showToast('Choisis au moins un membre');
    return;
  }
  const payload = {
    name,
    type: data.get('type') === 'team' ? 'team' : 'group',
    description: data.get('description') ?? '',
    memberIds,
  };
  const id = form.dataset.collective;
  let collective;
  if (id) {
    store.updateCollective(id, payload);
    collective = store.state.collectives.find((item) => item.id === id);
  } else {
    collective = store.createCollective(payload);
  }
  closeSheet({ restoreFocus: false });
  if (id) {
    render({ preserveScroll: true, focus: true });
    showToast('Collectif mis à jour');
  } else {
    navigate(`#/coach/collectifs/${collective.id}`);
    showToast('Collectif créé');
  }
}

function handleAssignRoutineSubmit(form) {
  const data = new FormData(form);
  const routineId = data.get('routine');
  const collectiveId = form.dataset.collective;
  const athleteId = form.dataset.athlete;
  const recipients = collectiveId ? data.getAll('recipients') : athleteId ? [athleteId] : [];
  if (!routineId) {
    showToast('Choisis une routine');
    return;
  }
  if (!recipients.length) {
    showToast('Choisis au moins un destinataire');
    return;
  }
  const collective = collectiveId
    ? store.state.collectives.find((item) => item.id === collectiveId) ?? null
    : null;
  const count = store.assignRoutines({
    athleteIds: recipients,
    templateId: routineId,
    instruction: data.get('instruction') ?? '',
    context: data.get('context') ?? '',
    collective,
  });
  closeSheet({ restoreFocus: false });
  render({ preserveScroll: true, focus: true });
  const names = recipients.map((id) => store.athlete(id)?.firstName).filter(Boolean);
  showToast(`Routine assignée à ${count} sportif${count > 1 ? 's' : ''} · ${names.join(', ')}`);
}

async function handleDocumentFile(file, athleteId, docId = null) {
  try {
    let doc;
    if (docId) doc = await documents.addVersion(docId, file);
    else doc = await documents.create(athleteId, file);
    render({ preserveScroll: true, focus: false });
    openSheet('document', { doc: doc.id, as: 'coach' });
    showToast(docId ? 'Nouvelle version ajoutée' : 'Document déposé en brouillon');
  } catch (error) {
    showToast(error.message ?? 'Dépôt impossible');
  }
}

function mountAthleteSwitcher() {
  document.querySelectorAll('[data-athlete-switcher]').forEach((root) => {
    if (root.dataset.mounted === '1') return;
    root.dataset.mounted = '1';
    const search = root.querySelector('[data-athlete-search]');
    const buttons = [...root.querySelectorAll('[data-switch-collective]')];
    const rows = [...root.querySelectorAll('[data-switch-row]')];
    const empty = root.querySelector('[data-switch-empty]');
    let group = 'all';

    const apply = () => {
      const query = (search?.value ?? '').trim().toLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const matchName = !query || (row.dataset.name ?? '').includes(query);
        const matchGroup =
          group === 'all' || (row.dataset.collectives ?? '').split(' ').includes(group);
        const show = matchName && matchGroup;
        row.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible > 0;
    };

    search?.addEventListener('input', apply);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        group = button.dataset.switchCollective;
        buttons.forEach((item) => item.classList.toggle('is-active', item === button));
        apply();
      });
    });
  });
}

function mountAssignRoutine() {
  const form = document.querySelector('[data-assign-routine-form]');
  if (!form) return;
  const recipients = [...form.querySelectorAll('input[name="recipients"]')];
  const summary = form.querySelector('[data-recipient-summary]');
  const label = form.querySelector('[data-assign-label]');
  const submit = form.querySelector('button[type="submit"]');

  const update = () => {
    const checked = recipients.filter((input) => input.checked);
    if (summary) {
      const strong = summary.querySelector('strong');
      const names = summary.querySelector('p');
      if (strong) strong.textContent = `Destinataires : ${checked.length}`;
      if (names) {
        names.textContent = checked
          .map((input) => store.athlete(input.value)?.firstName)
          .filter(Boolean)
          .join(', ');
      }
    }
    if (label) {
      label.textContent = `Assigner à ${checked.length} sportif${checked.length > 1 ? 's' : ''}`;
    }
    if (submit) submit.disabled = checked.length === 0;
  };

  recipients.forEach((input) => input.addEventListener('change', update));
  form.querySelectorAll('input[name="routine"]').forEach((input) => {
    input.addEventListener('change', () => {
      form.querySelectorAll('.routine-option').forEach((option) => {
        option.classList.toggle('is-selected', option.querySelector('input')?.checked);
      });
    });
  });
  update();
}

function mountCollectiveFormTypes() {
  const form = document.querySelector('[data-collective-form]');
  if (!form) return;
  form.querySelectorAll('input[name="type"]').forEach((input) => {
    input.addEventListener('change', () => {
      form.querySelectorAll('.type-option').forEach((option) => {
        option.classList.toggle('is-selected', option.querySelector('input')?.checked);
      });
    });
  });
}

function mountDocuments() {
  document.querySelectorAll('[data-document-input]').forEach((input) => {
    if (input.dataset.mounted === '1') return;
    input.dataset.mounted = '1';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      const athleteId = input.dataset.athlete;
      input.value = '';
      handleDocumentFile(file, athleteId);
    });
  });

  document.querySelectorAll('[data-document-version]').forEach((input) => {
    if (input.dataset.mounted === '1') return;
    input.dataset.mounted = '1';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      const docId = input.dataset.documentVersion;
      const athleteId = input.dataset.athlete;
      input.value = '';
      handleDocumentFile(file, athleteId, docId);
    });
  });

  document.querySelectorAll('[data-document-drop]').forEach((zone) => {
    if (zone.dataset.mounted === '1') return;
    zone.dataset.mounted = '1';
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('is-dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('is-dragover'));
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('is-dragover');
      const file = event.dataTransfer?.files?.[0];
      if (file) handleDocumentFile(file, zone.dataset.athlete);
    });
  });
}


/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

function showToast(message) {
  if (!toastRegion) return;
  toastRegion.innerHTML = `<div class="toast"><span class="toast__icon">${icon('check', { size: 15 })}</span><span>${escapeHTML(message)}</span></div>`;
  toastRegion.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastRegion.classList.remove('is-visible');
  }, 3200);
}

/* ------------------------------------------------------------------ */
/* Keyboard & global listeners                                         */
/* ------------------------------------------------------------------ */

document.addEventListener('keydown', (event) => {
  if (!activeSheet) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeSheet();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusables = [
    ...sheetRoot.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((element) => element.offsetParent !== null);
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener('hashchange', () => {
  if (activeSheet) closeSheet({ restoreFocus: false });
  render({ focus: true });
});

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function applyEntryParams() {
  const params = new URLSearchParams(location.search);
  let targetHash = location.hash || '#/accueil';

  if (params.get('reset') === '1') {
    store.reset();
    targetHash = '#/accueil';
  }
  if (params.get('role') === 'coach') targetHash = '#/coach';
  else if (params.get('start') === 'quiz') targetHash = '#/test';

  if (params.has('reset') || params.has('role') || params.has('start')) {
    params.delete('reset');
    params.delete('role');
    params.delete('start');
    const query = params.toString();
    history.replaceState(
      null,
      '',
      `${location.pathname}${query ? `?${query}` : ''}${targetHash}`,
    );
  } else if (!location.hash) {
    history.replaceState(null, '', `${location.pathname}${location.search}#/accueil`);
  }
}

applyEntryParams();
render({ focus: false });

