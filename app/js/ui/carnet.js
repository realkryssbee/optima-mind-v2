import { getRoutineTemplate } from '../data.js?v=7';
import { formatDate, todayISO } from '../utils.js?v=7';
import { icon } from './icons.js?v=7';

export function visibilityPill(visibility) {
  const shared = visibility === 'shared';
  return `<span class="vis ${shared ? 'vis--shared' : 'vis--private'}">
    ${icon(shared ? 'users' : 'lock', { size: 12 })}
    ${shared ? 'Partagé avec Aga' : 'Privé'}
  </span>`;
}

export function formatDuration(minutes) {
  if (minutes == null) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${String(rest).padStart(2, '0')}` : `${hours} h`;
}

export function entryDateLabel(date) {
  if (!date) return '';
  if (date === todayISO()) return 'Aujourd’hui';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date === yesterday.toISOString().slice(0, 10)) return 'Hier';
  return formatDate(date, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function routineItems(athlete) {
  const assignments = (athlete.routineAssignments ?? []).map((assignment) => ({
    kind: 'assignment',
    id: assignment.id,
    title: assignment.title,
    moment: assignment.context,
    steps: assignment.steps,
    origin: assignment.origin,
    source: assignment.source,
    instruction: assignment.instruction,
    status: assignment.status,
    feedback: assignment.feedback,
    collectiveName: assignment.collectiveName,
    assignedAt: assignment.assignedAt,
  }));
  const custom = (athlete.customRoutines ?? []).map((routine) => ({
    kind: 'custom',
    id: routine.id,
    title: routine.title,
    moment: routine.moment === 'competition' ? 'Compétition' : 'Entraînement',
    steps: routine.steps,
    origin: 'self',
    instruction: '',
    status: routine.lastFeedback ? 'tried' : 'new',
    feedback: routine.lastFeedback,
    assignedAt: routine.createdAt,
  }));
  return [...assignments, ...custom];
}

export function latestRoutine(athlete) {
  const items = routineItems(athlete).sort((a, b) =>
    (b.assignedAt ?? '').localeCompare(a.assignedAt ?? ''),
  );
  const untried = items.find((item) => item.status === 'new');
  return untried ?? items[0] ?? null;
}

export function routineOrigin(item) {
  if (item.kind === 'assignment') {
    return item.collectiveName ? `Aga · ${item.collectiveName}` : 'Aga · suivi individuel';
  }
  return 'Créée par toi';
}

export function routineKindLabel(item) {
  if (item.kind === 'assignment') return 'Assignée par Aga';
  return 'Ma routine';
}

export function routineMomentLabel(moment) {
  if (moment === 'competition' || moment === 'Compétition') return 'Compétition';
  return 'Entraînement';
}

export function feedbackLabel(key) {
  if (key === 'helped') return 'Ça m’a aidé';
  if (key === 'somewhat') return 'Un peu';
  if (key === 'not') return 'Pas cette fois';
  return '';
}

export function feedbackTone(key) {
  if (key === 'helped') return 'success';
  if (key === 'somewhat') return 'info';
  return 'muted';
}

export function contextualQuestion(athlete, type = 'session', routineIds = []) {
  const routine = routineIds
    .map((id) => {
      const assigned = (athlete.routineAssignments ?? []).find(
        (item) => item.id === id || item.routineId === id,
      );
      if (assigned) return assigned.title;
      const custom = (athlete.customRoutines ?? []).find((item) => item.id === id);
      if (custom) return custom.title;
      const template = getRoutineTemplate(id);
      return template?.title;
    })
    .filter(Boolean)[0];

  if (routine) {
    return `Qu’est-ce que « ${routine} » a changé pendant cette séance ?`;
  }
  if (type === 'competition') {
    return 'Qu’est-ce que tu veux retenir de cette compétition ?';
  }
  const goal = athlete.carnet?.goal?.text ?? '';
  const sport = (athlete.sport ?? '').toLowerCase();
  const mistake = sport.includes('tennis')
    ? 'manqué le point'
    : sport.includes('hockey')
      ? 'perdu le palet'
      : 'perdu le ballon';
  if (/erreur|repartir|ballon|palet|point|rate|raté|loup/i.test(goal)) {
    return `Quand tu as ${mistake}, qu’est-ce qui t’a aidé à repartir ?`;
  }
  if (goal) {
    return 'En lien avec ton objectif, qu’est-ce qui t’a aidé aujourd’hui ?';
  }
  return 'Qu’est-ce qui t’a aidé à repartir après cette séance ?';
}

export function unansweredQuestion(athlete) {
  const sessions = [...(athlete.carnet?.entries ?? [])]
    .filter((entry) => entry.type === 'session' && entry.question && !entry.answer)
    .sort((a, b) => b.date.localeCompare(a.date));
  return sessions[0] ?? null;
}

export function carnetInsights(athlete) {
  const items = routineItems(athlete);
  const entries = athlete.carnet?.entries ?? [];
  const insights = [];

  const helpedRoutines = items.filter(
    (item) => item.feedback?.helpfulness === 'helped' || item.feedback?.helpfulness === 'somewhat',
  );
  if (helpedRoutines.length) {
    const routine = helpedRoutines[0];
    insights.push({
      icon: 'target',
      label: 'Ta routine',
      text: `« ${routine.title} » t’a aidé${helpedRoutines.length > 1 ? ` (${helpedRoutines.length} routines)` : ''}.`,
    });
  }

  const latestHelped = [...entries]
    .filter((entry) => entry.helped)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (latestHelped) {
    insights.push({
      icon: 'sparkle',
      label: 'Ce que tu as noté',
      text: `« ${latestHelped.helped.slice(0, 140)}${latestHelped.helped.length > 140 ? '…' : ''} »`,
    });
  }

  const latestAnswer = [...entries]
    .filter((entry) => entry.answer)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (latestAnswer) {
    insights.push({
      icon: 'quote',
      label: 'Ta réponse',
      text: `« ${latestAnswer.answer.slice(0, 140)}${latestAnswer.answer.length > 140 ? '…' : ''} »`,
    });
  }

  return insights;
}
