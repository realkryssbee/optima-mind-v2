import {
  ATHLETES,
  DEMO_DEVICE_ACTIVITIES,
  ROUTINE_LIBRARY,
  getRoutineTemplate,
  getResource,
} from './data.js';
import { computeProfile, fixedQuestionOrder } from './scoring.js';
import { isoDaysAgo, todayISO } from './utils.js';

const STORAGE_KEY = 'omind-demo-lite-v2';
const ACTOR_KEY = 'omind-actor';

function isoAt(daysAgo) {
  return new Date(`${isoDaysAgo(daysAgo)}T12:00:00`).toISOString();
}

function nowISO() {
  return new Date().toISOString();
}

function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function readSessionActor() {
  try {
    return sessionStorage.getItem(ACTOR_KEY);
  } catch {
    return null;
  }
}

function writeSessionActor(id) {
  try {
    sessionStorage.setItem(ACTOR_KEY, id);
  } catch {
    /* sessionStorage indisponible */
  }
}

function materializeEntry(entry) {
  const { daysAgo, ...rest } = entry;
  return {
    ...rest,
    date: daysAgo != null ? isoDaysAgo(daysAgo) : rest.date,
    createdAt: daysAgo != null ? isoAt(daysAgo) : rest.createdAt ?? nowISO(),
    updatedAt: daysAgo != null ? isoAt(daysAgo) : rest.updatedAt ?? nowISO(),
  };
}

function materializeRoutine(routine) {
  const { daysAgo, ...rest } = routine;
  return {
    ...rest,
    origin: routine.origin ?? 'self',
    createdAt: daysAgo != null ? isoAt(daysAgo) : routine.createdAt ?? nowISO(),
    steps: (routine.steps ?? []).map((step) => ({ ...step })),
  };
}

function materializeDevice(device = {}) {
  return {
    provider: 'strava',
    status: 'disconnected',
    lastSyncAt: null,
    error: null,
    failNext: false,
    selection: { activity: true, duration: true, date: true, distance: false },
    ...device,
  };
}

export function seedState() {
  const athletes = {};

  for (const seed of ATHLETES) {
    const profile = seed.responses
      ? computeProfile(seed.responses, {
          sample: true,
          completedAt: isoAt(seed.profileDaysAgo ?? 0),
        })
      : null;

    athletes[seed.id] = {
      id: seed.id,
      firstName: seed.firstName,
      name: seed.name,
      initials: seed.initials,
      age: seed.age,
      sport: seed.sport,
      club: seed.club,
      coachGoal: seed.coachGoal,
      since: seed.since,
      demoAccount: seed.demoAccount,
      pendingResponses: seed.pendingResponses ?? null,
      profile,
      assignment: seed.assignment
        ? {
            status: seed.assignment.status,
            testId: seed.assignment.testId ?? '4c',
            testName: seed.assignment.testName ?? 'Profil 4C',
            assignedAt: isoAt((seed.assignment.daysAgo ?? 0) + 1),
            sentAt: isoAt(seed.assignment.daysAgo ?? 0),
            completedAt:
              seed.assignment.status === 'completed' ? isoAt(seed.assignment.daysAgo ?? 0) : null,
            message: seed.assignment.message ?? null,
          }
        : null,
      test: null,
      sessions: (seed.sessions ?? []).map((session) => ({ ...session })),
      checkins: seed.checkins
        .map(({ daysAgo, ...checkin }) => ({ ...checkin, date: isoDaysAgo(daysAgo) }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      shared: (seed.shared ?? []).map(({ daysAgo, ...share }) => ({
        ...share,
        sharedAt: isoAt(daysAgo),
      })),
      resourcesDone: {},
      carnet: {
        goal: seed.carnet?.goal
          ? {
              text: seed.carnet.goal.text,
              createdAt: isoAt(seed.carnet.goal.daysAgo ?? 0),
              updatedAt: isoAt(seed.carnet.goal.daysAgo ?? 0),
            }
          : null,
        entries: (seed.carnet?.entries ?? []).map(materializeEntry),
        draft: seed.carnet?.draft ?? null,
      },
      customRoutines: (seed.customRoutines ?? []).map(materializeRoutine),
      routineAssignments: (seed.routineAssignments ?? []).map((assignment) => ({
        ...assignment,
        status: assignment.status ?? 'new',
        feedback: assignment.feedback ?? null,
        steps: (assignment.steps ?? []).map((step) => ({ ...step })),
      })),
      activities: (seed.activities ?? []).map((activity) => ({
        ...activity,
        importedAt: activity.importedAt ?? nowISO(),
      })),
      device: materializeDevice(seed.device),
    };
  }

  const collectiveSeed = [];

  const coachNotes = {};
  for (const seed of ATHLETES) coachNotes[seed.id] = seed.note ?? '';

  return {
    version: 2,
    activeAthlete: readSessionActor() && athletes[readSessionActor()] ? readSessionActor() : 'lea',
    athletes,
    collectives: collectiveSeed.map(({ daysAgo, ...collective }) => ({
      ...collective,
      createdAt: isoAt(daysAgo),
    })),
    coachNotes,
    coachRecent: ['lea', 'malik'],
    alertsSeen: {},
    documents: [],
    createdAt: nowISO(),
  };
}

function isValid(state) {
  return (
    state &&
    state.version === 2 &&
    state.athletes &&
    state.athletes.lea &&
    state.athletes.malik &&
    Array.isArray(state.collectives)
  );
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!isValid(parsed)) return seedState();
    const sessionActor = readSessionActor();
    if (sessionActor && parsed.athletes[sessionActor]) parsed.activeAthlete = sessionActor;
    parsed.documents = parsed.documents ?? [];
    return parsed;
  } catch {
    return seedState();
  }
}

export const store = {
  state: loadState(),

  persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      /* stockage indisponible : la démo reste en mémoire */
    }
    return this.state;
  },

  sportif() {
    return this.state.athletes[this.state.activeAthlete];
  },

  athlete(id) {
    return this.state.athletes[id] ?? null;
  },

  athletes() {
    return Object.values(this.state.athletes);
  },

  setActiveAthlete(id) {
    if (!this.state.athletes[id]) return this.state;
    this.state.activeAthlete = id;
    writeSessionActor(id);
    this.markRecent(id);
    return this.persist();
  },

  markRecent(id) {
    if (!this.state.athletes[id]) return;
    const recent = this.state.coachRecent.filter((athleteId) => athleteId !== id);
    this.state.coachRecent = [id, ...recent].slice(0, 4);
    this.persist();
  },

  todayCheckin(athleteId = this.state.activeAthlete) {
    const athlete = this.athlete(athleteId);
    return athlete?.checkins.find((checkin) => checkin.date === todayISO()) ?? null;
  },

  latestCheckin(athleteId = this.state.activeAthlete) {
    const athlete = this.athlete(athleteId);
    if (!athlete || athlete.checkins.length === 0) return null;
    return [...athlete.checkins].sort((a, b) => b.date.localeCompare(a.date))[0];
  },

  /* ----------------------------- 4C ----------------------------- */

  activeTest() {
    return this.sportif().test;
  },

  startTest(seed = Math.floor(Math.random() * 2 ** 31)) {
    this.sportif().test = {
      seed,
      order: fixedQuestionOrder(),
      answers: {},
      index: 0,
      startedAt: nowISO(),
      status: 'in_progress',
    };
    return this.persist();
  },

  answer(value) {
    const test = this.activeTest();
    if (!test) return this.state;
    test.answers[test.order[test.index]] = value;
    return this.persist();
  },

  goToQuestion(index) {
    const test = this.activeTest();
    if (!test) return this.state;
    test.index = Math.max(0, Math.min(index, test.order.length - 1));
    return this.persist();
  },

  finishTest() {
    const test = this.activeTest();
    if (!test) return this.state;
    const profile = computeProfile(test.answers, { sample: false });
    const athlete = this.sportif();
    const now = nowISO();
    athlete.profile = profile;
    athlete.assignment = {
      ...(athlete.assignment ?? { assignedAt: now, sentAt: now }),
      status: 'completed',
      completedAt: now,
      message: athlete.assignment?.message ?? null,
    };
    test.status = 'completed';
    test.completedAt = now;
    return this.persist();
  },

  saveCheckin({ mood, energy, sleep, word }) {
    const athlete = this.sportif();
    const date = todayISO();
    const existing = athlete.checkins.find((checkin) => checkin.date === date);
    const payload = {
      mood,
      energy,
      sleep,
      word: word?.trim() ? word.trim().slice(0, 28) : null,
      sample: false,
      savedAt: nowISO(),
    };
    if (existing) Object.assign(existing, payload);
    else athlete.checkins.push({ date, ...payload });
    athlete.checkins.sort((a, b) => a.date.localeCompare(b.date));
    return this.persist();
  },

  /* ---------------------------- Séances ------------------------- */

  latestSession(athleteId = this.state.activeAthlete) {
    const athlete = this.athlete(athleteId);
    if (!athlete?.sessions?.length) return null;
    return [...athlete.sessions].sort(
      (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
    )[0];
  },

  createSession(athleteId, { date, privateNote = '', nextSteps = '', resourceIds = [] }) {
    const athlete = this.athlete(athleteId);
    if (!athlete) return this.state;
    const sessionDate = date || todayISO();
    const session = {
      id: uid('session'),
      date: sessionDate,
      privateNote: privateNote.trim(),
      nextSteps: nextSteps.trim(),
      resourceIds: [...new Set(resourceIds)],
      createdAt: nowISO(),
    };
    athlete.sessions = [session, ...(athlete.sessions ?? [])];
    const dateLabel = new Intl.DateTimeFormat('fr-BE', {
      day: 'numeric',
      month: 'long',
    }).format(new Date(`${sessionDate}T12:00:00`));
    for (const resourceId of session.resourceIds) {
      if (!getResource(resourceId)) continue;
      athlete.shared = athlete.shared.filter((share) => share.resourceId !== resourceId);
      athlete.shared.unshift({
        resourceId,
        sharedAt: nowISO(),
        message: `Après ta séance du ${dateLabel}`,
        source: 'session',
        sessionId: session.id,
      });
    }
    return this.persist();
  },

  markAlertSeen(athleteId) {
    if (!this.athlete(athleteId)) return this.state;
    this.state.alertsSeen = {
      ...(this.state.alertsSeen ?? {}),
      [athleteId]: { seenAt: nowISO() },
    };
    return this.persist();
  },

  /* ------------------------- Questionnaire ---------------------- */

  assignQuestionnaire(athleteId, options = {}) {
    const athlete = this.athlete(athleteId);
    if (!athlete) return this.state;
    athlete.assignment = {
      status: 'todo',
      testId: options.testId ?? '4c',
      testName: options.testName ?? 'Profil 4C',
      assignedAt: nowISO(),
      sentAt: null,
      completedAt: null,
      message: options.message?.trim() ? options.message.trim().slice(0, 220) : null,
    };
    return this.persist();
  },

  markQuestionnaireSent(athleteId) {
    const athlete = this.athlete(athleteId);
    if (!athlete?.assignment) return this.state;
    athlete.assignment.status = 'in_progress';
    athlete.assignment.sentAt = nowISO();
    return this.persist();
  },

  simulateQuestionnaireResponse(athleteId) {
    const athlete = this.athlete(athleteId);
    if (!athlete?.assignment) return this.state;
    const responses =
      athlete.profile?.responses ?? athlete.pendingResponses ?? ATHLETES[0].responses;
    const now = nowISO();
    athlete.profile = computeProfile(responses, { sample: false, completedAt: now });
    athlete.assignment.status = 'completed';
    athlete.assignment.completedAt = now;
    return this.persist();
  },

  /* ---------------------------- Ressources --------------------- */

  shareResource(athleteId, resourceId, message = '') {
    const athlete = this.athlete(athleteId);
    if (!athlete) return this.state;
    athlete.shared = athlete.shared.filter((share) => share.resourceId !== resourceId);
    athlete.shared.unshift({
      resourceId,
      sharedAt: nowISO(),
      message: message.trim().slice(0, 160) || null,
    });
    return this.persist();
  },

  markResourceDone(resourceId) {
    this.sportif().resourcesDone[resourceId] = nowISO();
    return this.persist();
  },

  latestShare(athleteId = this.state.activeAthlete) {
    const athlete = this.athlete(athleteId);
    if (!athlete) return null;
    return [...athlete.shared].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt))[0] ?? null;
  },

  getResource,

  /* ---------------------------- Carnet ------------------------- */

  setGoal(text) {
    const cleaned = text.trim().slice(0, 180);
    if (!cleaned) return this.state;
    const athlete = this.sportif();
    const now = nowISO();
    athlete.carnet.goal = {
      text: cleaned,
      createdAt: athlete.carnet.goal?.createdAt ?? now,
      updatedAt: now,
    };
    return this.persist();
  },

  saveDraft(draft) {
    const athlete = this.sportif();
    athlete.carnet.draft = {
      ...draft,
      updatedAt: nowISO(),
    };
    return this.persist();
  },

  clearDraft() {
    this.sportif().carnet.draft = null;
    return this.persist();
  },

  saveEntry(input) {
    const athlete = this.sportif();
    const now = nowISO();
    const existing = input.id
      ? athlete.carnet.entries.find((entry) => entry.id === input.id)
      : null;
    const entry = {
      id: existing?.id ?? uid('entry'),
      type: input.type,
      date: input.date || todayISO(),
      title: input.title?.trim().slice(0, 80) || '',
      context: input.context?.trim().slice(0, 80) || '',
      note: input.note?.trim().slice(0, 900) || '',
      helped: input.helped?.trim().slice(0, 400) || '',
      question: input.question?.trim().slice(0, 180) || '',
      answer: input.answer?.trim().slice(0, 200) || '',
      routineIds: [...new Set(input.routineIds ?? [])],
      visibility: input.visibility === 'shared' ? 'shared' : 'private',
      source: input.source ?? 'manual',
      activityId: input.activityId ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    if (existing) Object.assign(existing, entry);
    else athlete.carnet.entries.unshift(entry);
    athlete.carnet.draft = null;
    return this.persist();
  },

  deleteEntry(entryId) {
    const athlete = this.sportif();
    athlete.carnet.entries = athlete.carnet.entries.filter((entry) => entry.id !== entryId);
    return this.persist();
  },

  setEntryVisibility(entryId, visibility) {
    const entry = this.sportif().carnet.entries.find((item) => item.id === entryId);
    if (!entry) return this.state;
    entry.visibility = visibility === 'shared' ? 'shared' : 'private';
    entry.updatedAt = nowISO();
    return this.persist();
  },

  answerEntryQuestion(entryId, answer) {
    const entry = this.sportif().carnet.entries.find((item) => item.id === entryId);
    if (!entry) return this.state;
    entry.answer = answer.trim().slice(0, 200);
    entry.updatedAt = nowISO();
    return this.persist();
  },

  /* ---------------------------- Routines ----------------------- */

  createCustomRoutine({ title, moment, steps }) {
    const athlete = this.sportif();
    const routine = {
      id: uid('routine'),
      title: title.trim().slice(0, 80),
      moment: moment === 'competition' ? 'competition' : 'training',
      origin: 'self',
      steps: steps
        .filter((step) => step.title?.trim())
        .slice(0, 5)
        .map((step) => ({
          title: step.title.trim().slice(0, 50),
          text: step.text?.trim().slice(0, 240) ?? '',
        })),
      createdAt: nowISO(),
      lastFeedback: null,
    };
    athlete.customRoutines.unshift(routine);
    this.persist();
    return routine;
  },

  updateCustomRoutine(routineId, patch) {
    const routine = this.sportif().customRoutines.find((item) => item.id === routineId);
    if (!routine) return this.state;
    Object.assign(routine, patch, { updatedAt: nowISO() });
    return this.persist();
  },

  removeCustomRoutine(routineId) {
    const athlete = this.sportif();
    athlete.customRoutines = athlete.customRoutines.filter((routine) => routine.id !== routineId);
    return this.persist();
  },

  recordRoutineFeedback({ kind, id, helpfulness, comment = '', shared = false }) {
    const now = nowISO();
    const athlete = this.sportif();
    if (kind === 'assignment') {
      const assignment = athlete.routineAssignments.find((item) => item.id === id);
      if (!assignment) return this.state;
      assignment.status = 'tried';
      assignment.triedAt = now;
      assignment.feedback = {
        helpfulness,
        comment: comment.trim().slice(0, 240),
        shared: Boolean(shared),
        sharedAt: shared ? now : null,
        updatedAt: now,
      };
    } else {
      const routine = athlete.customRoutines.find((item) => item.id === id);
      if (!routine) return this.state;
      routine.lastFeedback = {
        helpfulness,
        comment: comment.trim().slice(0, 240),
        shared: Boolean(shared),
        sharedAt: shared ? now : null,
        updatedAt: now,
      };
      routine.triedAt = now;
    }
    return this.persist();
  },

  assignRoutines({ athleteIds, templateId, instruction = '', context = '', collective = null }) {
    const template = getRoutineTemplate(templateId);
    if (!template) return 0;
    const batchId = uid('batch');
    const now = nowISO();
    let count = 0;
    for (const athleteId of athleteIds) {
      const athlete = this.athlete(athleteId);
      if (!athlete) continue;
      athlete.routineAssignments.unshift({
        id: uid('assign'),
        batchId,
        routineId: template.id,
        title: template.title,
        kind: template.kind,
        duration: template.duration,
        steps: template.steps.map((step) => ({ ...step })),
        instruction: instruction.trim().slice(0, 240),
        context: context.trim().slice(0, 80),
        origin: 'Aga',
        source: 'library',
        assignedBy: 'Aga',
        assignedAt: now,
        collectiveId: collective?.id ?? null,
        collectiveName: collective?.name ?? null,
        status: 'new',
        feedback: null,
      });
      count += 1;
    }
    return this.persist() && count;
  },

  getAssignment(athleteId, assignmentId) {
    return this.athlete(athleteId)?.routineAssignments.find((item) => item.id === assignmentId) ?? null;
  },

  allRoutineItems(athlete = this.sportif()) {
    const assignments = athlete.routineAssignments.map((assignment) => ({
      kind: 'assignment',
      id: assignment.id,
      title: assignment.title,
      moment: assignment.context,
      steps: assignment.steps,
      origin: assignment.origin,
      instruction: assignment.instruction,
      status: assignment.status,
      feedback: assignment.feedback,
      collectiveName: assignment.collectiveName,
      assignedAt: assignment.assignedAt,
    }));
    const custom = athlete.customRoutines.map((routine) => ({
      kind: 'custom',
      id: routine.id,
      title: routine.title,
      moment: routine.moment,
      steps: routine.steps,
      origin: 'self',
      instruction: '',
      status: routine.lastFeedback ? 'tried' : 'new',
      feedback: routine.lastFeedback,
      assignedAt: routine.createdAt,
    }));
    return [...assignments, ...custom];
  },

  latestRoutine(athlete = this.sportif()) {
    const items = this.allRoutineItems(athlete).sort((a, b) =>
      (b.assignedAt ?? '').localeCompare(a.assignedAt ?? ''),
    );
    return items[0] ?? null;
  },

  /* --------------------------- Activités ----------------------- */

  addActivity(input) {
    const athlete = this.sportif();
    const externalId = input.externalId ?? null;
    const fingerprint = `${input.source ?? 'manual'}:${externalId ?? input.activity}:${input.date}:${input.duration ?? ''}`;
    const duplicate = athlete.activities.find(
      (activity) =>
        (externalId && activity.externalId === externalId) ||
        activity.fingerprint === fingerprint,
    );
    if (duplicate) return { ok: false, duplicate };

    const activity = {
      id: uid('activity'),
      activity: input.activity.trim().slice(0, 90),
      date: input.date || todayISO(),
      duration: input.duration == null ? null : Number(input.duration),
      distance: input.distance == null ? null : Number(input.distance),
      comment: input.comment?.trim().slice(0, 400) || '',
      source: input.source ?? 'manual',
      externalId,
      fingerprint,
      fields: input.fields ?? ['activity', 'duration', 'date'],
      shared: Boolean(input.shared),
      importedAt: nowISO(),
      syncStatus: input.syncStatus ?? 'ok',
    };
    athlete.activities.unshift(activity);
    this.persist();
    return { ok: true, activity };
  },

  updateActivity(activityId, patch) {
    const activity = this.sportif().activities.find((item) => item.id === activityId);
    if (!activity) return this.state;
    Object.assign(activity, patch, { updatedAt: nowISO() });
    return this.persist();
  },

  setActivityShared(activityId, shared) {
    return this.updateActivity(activityId, { shared: Boolean(shared) });
  },

  removeActivity(activityId) {
    const athlete = this.sportif();
    athlete.activities = athlete.activities.filter((activity) => activity.id !== activityId);
    return this.persist();
  },

  setDeviceSelection(patch) {
    const device = this.sportif().device;
    device.selection = { ...device.selection, ...patch };
    return this.persist();
  },

  connectDevice() {
    const device = this.sportif().device;
    device.status = 'connected';
    device.error = null;
    device.connectedAt = nowISO();
    device.connectionAttempted = true;
    device.lastSyncAt = null;
    return this.persist();
  },

  disconnectDevice() {
    const device = this.sportif().device;
    device.status = 'disconnected';
    device.error = null;
    device.lastSyncAt = null;
    return this.persist();
  },

  toggleDeviceFailure() {
    const device = this.sportif().device;
    device.failNext = !device.failNext;
    return this.persist();
  },

  syncDevice() {
    const athlete = this.sportif();
    const device = athlete.device;
    if (device.status !== 'connected') {
      device.error = 'Connecte d’abord un appareil pour synchroniser.';
      this.persist();
      return { ok: false, imported: 0, error: device.error };
    }
    if (device.failNext) {
      device.failNext = false;
      device.error = 'La synchronisation a échoué. Vérifie la connexion, puis réessaie.';
      this.persist();
      return { ok: false, imported: 0, error: device.error };
    }

    let imported = 0;
    let duplicates = 0;
    for (const demo of DEMO_DEVICE_ACTIVITIES) {
      const exists = athlete.activities.some((activity) => activity.externalId === demo.externalId);
      if (exists) {
        duplicates += 1;
        continue;
      }
      const result = this.addActivity({
        activity: demo.activity,
        date: isoDaysAgo(demo.daysAgo),
        duration: device.selection.duration ? demo.duration : null,
        distance: device.selection.distance ? demo.distance : null,
        source: 'strava',
        externalId: demo.externalId,
        fields: [
          'activity',
          'date',
          ...(device.selection.duration ? ['duration'] : []),
          ...(device.selection.distance ? ['distance'] : []),
        ],
        syncStatus: 'ok',
      });
      if (result.ok) imported += 1;
      else duplicates += 1;
    }
    device.lastSyncAt = nowISO();
    device.error = null;
    this.persist();
    return { ok: true, imported, duplicates };
  },

  /* ---------------------------- Coach -------------------------- */

  saveCoachNote(athleteId, text) {
    if (!this.state.athletes[athleteId]) return this.state;
    this.state.coachNotes[athleteId] = text.trim().slice(0, 600);
    return this.persist();
  },

  createCollective({ name, type, description = '', memberIds = [] }) {
    const collective = {
      id: uid('collective'),
      name: name.trim().slice(0, 60),
      type: type === 'team' ? 'team' : 'group',
      description: description.trim().slice(0, 200),
      memberIds: [...new Set(memberIds)],
      createdAt: nowISO(),
    };
    this.state.collectives.unshift(collective);
    this.persist();
    return collective;
  },

  updateCollective(collectiveId, patch) {
    const collective = this.state.collectives.find((item) => item.id === collectiveId);
    if (!collective) return this.state;
    Object.assign(collective, patch, { updatedAt: nowISO() });
    return this.persist();
  },

  deleteCollective(collectiveId) {
    this.state.collectives = this.state.collectives.filter((item) => item.id !== collectiveId);
    return this.persist();
  },

  collectiveForAthlete(athleteId) {
    return this.state.collectives.filter((collective) =>
      collective.memberIds.includes(athleteId),
    );
  },

  /* --------------------------- Divers -------------------------- */

  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(ACTOR_KEY);
    } catch {
      /* ignore */
    }
    this.state = seedState();
    return this.state;
  },
};

export { ROUTINE_LIBRARY };
