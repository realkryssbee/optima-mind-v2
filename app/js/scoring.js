import { DIMENSIONS, QUESTIONS, getDimension, getQuestion } from './data.js';

/** PRNG déterministe (mulberry32) : l’ordre du test est stable pour une passation. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mélange des 20 affirmations, dimensions masquées, même ordre pendant tout le test. */
export function shuffleQuestions(seed) {
  const ids = QUESTIONS.map((q) => q.id);
  const random = mulberry32(seed);
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

/**
 * Calcul déterministe : moyenne des 5 réponses par dimension,
 * avec recodage 6 − réponse pour l’affirmation inversée.
 */
export function computeProfile(responses, meta = {}) {
  if (!responses || typeof responses !== 'object') {
    throw new Error('Réponses manquantes');
  }
  const scores = {};
  const items = {};

  for (const dimension of DIMENSIONS) {
    const questions = QUESTIONS.filter((q) => q.dimension === dimension.key);
    const recoded = questions.map((question) => {
      const raw = responses[question.id];
      if (!Number.isInteger(raw) || raw < 1 || raw > 5) {
        throw new Error(`Réponse invalide pour ${question.id}`);
      }
      return question.reversed ? 6 - raw : raw;
    });
    const mean = recoded.reduce((sum, value) => sum + value, 0) / recoded.length;
    scores[dimension.key] = Math.round(mean * 10) / 10;
    items[dimension.key] = questions.map((question, index) => ({
      id: question.id,
      raw: responses[question.id],
      recoded: recoded[index],
    }));
  }

  return {
    scores,
    items,
    responses: { ...responses },
    completedAt: meta.completedAt ?? new Date().toISOString(),
    sample: Boolean(meta.sample),
  };
}

function orderedDimensions(profile) {
  return [...DIMENSIONS]
    .map((dimension) => ({ dimension, score: profile.scores[dimension.key] }))
    .sort((a, b) => a.score - b.score || DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension));
}

/** Lecture d’une dimension à partir des réponses individuelles (pas du seul score moyen). */
export function readDimension(profile, dimensionKey) {
  const dimension = getDimension(dimensionKey);
  const rows = (profile.items[dimensionKey] ?? [])
    .map((item) => ({ ...item, question: getQuestion(item.id) }))
    .sort((a, b) => a.recoded - b.recoded || a.raw - b.raw);
  const weakest = rows[0] ?? null;
  const strongest = rows[rows.length - 1] ?? null;
  const favorable = rows.length > 0 && rows[0].recoded >= 4;
  const flat = rows.every((row) => row.recoded === rows[0]?.recoded);

  let summary;
  if (flat && strongest) {
    summary = `Toutes tes réponses sont au même niveau sur cette dimension : ${strongest.question.high}.`;
  } else if (favorable && strongest) {
    summary = `Tes réponses sont globalement favorables : ${strongest.question.high}. La marge la plus utile concerne le fait que ${weakest.question.low}.`;
  } else if (strongest && weakest) {
    summary = `Tu identifies un appui : ${strongest.question.high}. En parallèle, ${weakest.question.low}.`;
  } else {
    summary = dimension.definition;
  }

  return {
    dimension,
    score: profile.scores[dimensionKey],
    summary,
    favorable,
    appui: strongest ? strongest.question.high : null,
    explore: weakest ? weakest.question.low : null,
    focus: weakest ? weakest.question.piste : null,
    focusQuestion: weakest ? weakest.question : null,
    strongest,
    weakest,
  };
}

/**
 * Piste à explorer : dimension la plus basse, puis affirmation la moins favorable
 * de cette dimension. Tout est dérivé des réponses, sans texte inventé sur les causes.
 */
export function buildInsight(profile) {
  const ordered = orderedDimensions(profile);
  const lowest = ordered[0];
  const highest = ordered[ordered.length - 1];
  const read = readDimension(profile, lowest.dimension.key);
  const strongestRead = readDimension(profile, highest.dimension.key);

  let intro;
  if (read.favorable) {
    intro = `Tes réponses dessinent une base solide sur les quatre dimensions. La dimension la moins élevée reste le ${lowest.dimension.name.toLowerCase()}, avec ${formatScore(lowest.score)} sur 5. ${read.summary}`;
  } else {
    intro = `Tes réponses suggèrent que ${read.strongest?.question.high ?? strongestRead.appui}. En revanche, ${read.weakest?.question.low ?? read.explore}. ${lowest.dimension.closing}`;
  }

  return {
    dimension: lowest.dimension,
    score: lowest.score,
    highestDimension: highest.dimension,
    highestScore: highest.score,
    title: read.focus ?? lowest.dimension.subtitle,
    intro,
    read,
    pistes: lowest.dimension.pistes,
    question: lowest.dimension.question,
    detail: read.summary,
  };
}

export function formatScore(value) {
  return Number(value).toFixed(1).replace('.', ',');
}

/** Moyenne générale, utilisée uniquement pour les repères visuels de la démo. */
export function averageScore(profile) {
  const values = DIMENSIONS.map((d) => profile.scores[d.key]);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
