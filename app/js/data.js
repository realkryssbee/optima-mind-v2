/**
 * O’MIND — contenu de démonstration
 * Source des 20 affirmations, du calcul et des pistes : cahier des charges
 * « O’Mind.docx » (référentiel 4C). Les textes d’interface sont en français.
 */

import { DIMENSION_TEXT } from './fourc-content.js';

export const SCALE = [
  { value: 1, label: 'Pas du tout' },
  { value: 2, label: 'Plutôt non' },
  { value: 3, label: 'Moyennement' },
  { value: 4, label: 'Plutôt oui' },
  { value: 5, label: 'Tout à fait' },
];

export const DIMENSIONS = [
  {
    key: 'calme',
    code: 'CAL',
    name: 'Calme',
    subtitle: 'Gérer la pression et les émotions',
    short: 'Rester ou redevenir fonctionnel sous pression.',
    definition:
      'La capacité perçue à réguler son stress et ses émotions pour rester disponible et agir efficacement, même sous pression.',
    question:
      'Que se passe-t-il pour toi après une erreur, et qu’est-ce qui pourrait t’aider à revenir plus rapidement dans le jeu ?',
    closing:
      'Le calme ne consiste pas à supprimer les émotions : il s’apprend en régulant son activation pour rester ou redevenir disponible pour l’action.',
    pistes: ['Respiration', 'Discours interne', 'Switch'],
  },
  {
    key: 'combativite',
    code: 'COM',
    name: 'Combativité',
    subtitle: 'Rester engagé malgré les difficultés',
    short: 'Maintenir son engagement et chercher des solutions.',
    definition:
      'La capacité perçue à maintenir son engagement, persévérer et continuer à agir malgré les difficultés, les erreurs ou les échecs.',
    question:
      'Lorsque ta première stratégie ne fonctionne pas, qu’est-ce qui t’aide à continuer à chercher une solution ?',
    closing:
      'La combativité ne se résume pas à en faire plus : elle consiste aussi à mobiliser ses ressources et à adapter ses actions.',
    pistes: ['Discours interne', 'Objectifs de processus', 'Switch'],
  },
  {
    key: 'concentration',
    code: 'CON',
    name: 'Concentration',
    subtitle: 'Savoir utiliser et retrouver son attention',
    short: 'Choisir, adapter et retrouver son attention.',
    definition:
      'La capacité perçue à diriger et maintenir son attention sur ce qui est pertinent, et à se recentrer rapidement après une distraction ou une erreur.',
    question:
      'Quand tu perds le fil pendant une compétition, comment pourrais-tu reconnaître plus rapidement que ton attention s’est éloignée du jeu ?',
    closing:
      'La concentration n’est pas une attention constante : c’est savoir choisir son focus, l’adapter à la situation et le retrouver.',
    pistes: ['Méditation', 'Discours interne', 'Routine de recentrage'],
  },
  {
    key: 'confiance',
    code: 'CONF',
    name: 'Confiance',
    subtitle: 'Croire en ses capacités et oser agir',
    short: 'Croire en ses ressources et oser agir.',
    definition:
      'La capacité perçue à croire en ses ressources et à oser agir, même face à l’incertitude, à la pression ou après une erreur.',
    question:
      'Qu’est-ce qui pourrait t’aider à croire davantage en tes capacités lorsque tu rencontres une situation que tu ne connais pas ?',
    closing:
      'La confiance n’est pas être certain de réussir : c’est croire en sa capacité à mobiliser ses ressources, même quand l’issue est incertaine.',
    pistes: ['Imagerie mentale', 'Discours interne', 'Routine de performance'],
  },
].map((dimension) => ({ ...dimension, ...DIMENSION_TEXT[dimension.key] }));

/** Les 20 affirmations du référentiel, avec leur lecture favorable / à explorer. */
export const QUESTIONS = [
  {
    id: 'CAL_01',
    dimension: 'calme',
    text: 'Je parviens à rester calme lorsque la pression augmente.',
    reversed: false,
    high: 'tu gardes ton calme quand la pression monte',
    low: 'la montée de pression peut encore te déstabiliser',
    piste: 'Respiration et conscience de soi',
  },
  {
    id: 'CAL_02',
    dimension: 'calme',
    text: 'Avant une compétition importante, je parviens à gérer ma tension.',
    reversed: false,
    high: 'tu parviens à gérer la tension avant une compétition importante',
    low: 'la période qui précède une compétition importante peut être plus exigeante à gérer',
    piste: 'Routine précompétitive',
  },
  {
    id: 'CAL_03',
    dimension: 'calme',
    text: 'Lorsque je ressens une émotion forte, je garde suffisamment de calme pour continuer à agir efficacement.',
    reversed: false,
    high: 'une émotion forte ne t’empêche pas de continuer à agir efficacement',
    low: 'une émotion forte peut encore perturber ta capacité à agir efficacement',
    piste: 'Reconnaître et réguler l’émotion',
  },
  {
    id: 'CAL_04',
    dimension: 'calme',
    text: 'Après une erreur, je retrouve rapidement mon calme.',
    reversed: false,
    high: 'tu retrouves rapidement ton calme après une erreur',
    low: 'revenir au calme après une erreur peut prendre plus de temps',
    piste: 'Revenir à l’action après une erreur',
  },
  {
    id: 'CAL_05',
    dimension: 'calme',
    text: 'Dans les moments importants, la pression peut m’empêcher de jouer comme je sais le faire.',
    reversed: true,
    high: 'la pression ne t’empêche pas de jouer comme tu sais le faire',
    low: 'la pression peut encore limiter l’expression de ce que tu sais faire',
    piste: 'Jouer libéré sous pression',
  },
  {
    id: 'COM_01',
    dimension: 'combativite',
    text: 'Je reste engagé(e), même lorsque la situation devient difficile.',
    reversed: false,
    high: 'tu restes engagé·e quand la situation devient difficile',
    low: 'maintenir ton engagement peut devenir plus exigeant quand la situation se complique',
    piste: 'Objectifs de processus',
  },
  {
    id: 'COM_02',
    dimension: 'combativite',
    text: 'Quand les choses tournent mal, je continue à chercher des solutions.',
    reversed: false,
    high: 'tu continues à chercher des solutions quand les choses tournent mal',
    low: 'trouver d’autres solutions peut être plus difficile quand les choses ne vont pas comme prévu',
    piste: 'Switch et plans d’action',
  },
  {
    id: 'COM_03',
    dimension: 'combativite',
    text: 'Même lorsque je ressens de la fatigue, je trouve les ressources nécessaires pour continuer à agir efficacement.',
    reversed: false,
    high: 'tu trouves les ressources pour continuer malgré la fatigue',
    low: 'mobiliser tes ressources quand la fatigue arrive peut demander plus d’appuis',
    piste: 'Gérer l’effort et la fatigue',
  },
  {
    id: 'COM_04',
    dimension: 'combativite',
    text: 'Après une erreur ou un échec, j’ai envie de repartir et d’essayer à nouveau.',
    reversed: false,
    high: 'après une erreur, l’envie de repartir est là',
    low: 'retrouver l’envie de repartir après un revers peut prendre plus de temps',
    piste: 'Rebondir après un échec',
  },
  {
    id: 'COM_05',
    dimension: 'combativite',
    text: 'Quand je sens que la situation m’échappe, j’ai tendance à baisser les bras.',
    reversed: true,
    high: 'quand la situation t’échappe, tu ne baisses pas les bras',
    low: 'quand la situation t’échappe, tu peux avoir tendance à lâcher prise',
    piste: 'Rester en action quand tout échappe',
  },
  {
    id: 'CON_01',
    dimension: 'concentration',
    text: 'Pendant la compétition, je sais sur quoi me concentrer.',
    reversed: false,
    high: 'tu sais sur quoi porter ton attention en compétition',
    low: 'identifier le bon point de focus en compétition peut être moins évident',
    piste: 'Choisir son focus',
  },
  {
    id: 'CON_02',
    dimension: 'concentration',
    text: 'Quand la situation change, je sais adapter mon attention à ce qui se passe.',
    reversed: false,
    high: 'tu adaptes ton attention quand la situation change',
    low: 'adapter ton attention quand le jeu change peut demander plus d’effort',
    piste: 'Changer de focus',
  },
  {
    id: 'CON_03',
    dimension: 'concentration',
    text: 'Je parviens à rester concentré(e) même lorsqu’il y a des distractions autour de moi.',
    reversed: false,
    high: 'les distractions autour de toi ne t’empêchent pas de rester concentré·e',
    low: 'les distractions peuvent encore interrompre ta concentration',
    piste: 'Gérer les distractions',
  },
  {
    id: 'CON_04',
    dimension: 'concentration',
    text: 'Quand je perds ma concentration, je parviens à me reconcentrer rapidement.',
    reversed: false,
    high: 'tu sais te reconcentrer rapidement après une perte d’attention',
    low: 'te reconcentrer rapidement après avoir perdu le fil peut être plus difficile',
    piste: 'Routine de recentrage',
  },
  {
    id: 'CON_05',
    dimension: 'concentration',
    text: 'Pendant la compétition, il m’arrive de perdre le fil du jeu sans m’en rendre compte tout de suite.',
    reversed: true,
    high: 'tu remarques vite quand ton attention s’éloigne du jeu',
    low: 'il peut t’arriver de perdre le fil sans t’en rendre compte tout de suite',
    piste: 'Repérer la perte d’attention',
  },
  {
    id: 'CONF_01',
    dimension: 'confiance',
    text: 'J’ai confiance dans ma capacité à réaliser ce que je sais faire.',
    reversed: false,
    high: 'tu crois en ta capacité à réaliser ce que tu sais faire',
    low: 'la confiance dans ce que tu sais faire peut encore varier',
    piste: 'Reconnaître ses compétences',
  },
  {
    id: 'CONF_02',
    dimension: 'confiance',
    text: 'Je conserve ma confiance lorsque l’enjeu devient important.',
    reversed: false,
    high: 'tu conserves ta confiance quand l’enjeu monte',
    low: 'l’enjeu peut encore fragiliser ta confiance',
    piste: 'Routine de performance',
  },
  {
    id: 'CONF_03',
    dimension: 'confiance',
    text: 'Face à un adversaire plus fort, je continue à croire en mes possibilités.',
    reversed: false,
    high: 'face à un adversaire plus fort, tu continues à croire en tes possibilités',
    low: 'un adversaire perçu comme plus fort peut susciter davantage de doutes',
    piste: 'Jouer sans se comparer',
  },
  {
    id: 'CONF_04',
    dimension: 'confiance',
    text: 'Après une erreur, je continue à croire en mes capacités.',
    reversed: false,
    high: 'après une erreur, tu continues à croire en tes capacités',
    low: 'une erreur peut temporairement réduire ta confiance',
    piste: 'Se remettre d’une erreur',
  },
  {
    id: 'CONF_05',
    dimension: 'confiance',
    text: 'Face à une situation que je ne connais pas, je commence facilement à douter de mes capacités.',
    reversed: true,
    high: 'l’inconnu ne t’amène pas facilement à douter de toi',
    low: 'une situation inconnue peut facilement faire naître des doutes',
    piste: 'Apprivoiser l’inconnu',
  },
];

/** Réponses du profil d’exemple (Calme 3,2 · Combativité 3,8 · Concentration 3,4 · Confiance 4,0). */
export const SAMPLE_RESPONSES = {
  CAL_01: 5,
  CAL_02: 4,
  CAL_03: 3,
  CAL_04: 2,
  CAL_05: 4,
  COM_01: 5,
  COM_02: 5,
  COM_03: 4,
  COM_04: 3,
  COM_05: 4,
  CON_01: 4,
  CON_02: 4,
  CON_03: 3,
  CON_04: 3,
  CON_05: 3,
  CONF_01: 4,
  CONF_02: 4,
  CONF_03: 4,
  CONF_04: 5,
  CONF_05: 3,
};

/** Réponses simulées pour les autres sportifs de la démo. */
export const NOA_RESPONSES = {
  CAL_01: 4,
  CAL_02: 4,
  CAL_03: 4,
  CAL_04: 4,
  CAL_05: 3,
  COM_01: 4,
  COM_02: 4,
  COM_03: 3,
  COM_04: 4,
  COM_05: 3,
  CON_01: 3,
  CON_02: 3,
  CON_03: 3,
  CON_04: 3,
  CON_05: 3,
  CONF_01: 3,
  CONF_02: 3,
  CONF_03: 4,
  CONF_04: 4,
  CONF_05: 3,
};

export const MALIK_RESPONSES = {
  CAL_01: 3,
  CAL_02: 3,
  CAL_03: 3,
  CAL_04: 2,
  CAL_05: 3,
  COM_01: 4,
  COM_02: 3,
  COM_03: 3,
  COM_04: 4,
  COM_05: 3,
  CON_01: 3,
  CON_02: 3,
  CON_03: 2,
  CON_04: 3,
  CON_05: 2,
  CONF_01: 3,
  CONF_02: 3,
  CONF_03: 3,
  CONF_04: 3,
  CONF_05: 4,
};

export const RESOURCES = [
  {
    id: 'respiration',
    kind: 'Exercice',
    category: 'Respiration',
    title: 'Respiration 4-2-6',
    duration: '3 min',
    pitch: 'Ralentir la respiration pour faire redescendre la tension avant de revenir à l’action.',
    intro:
      'Un cycle simple : 4 secondes pour inspirer, 2 pour retenir, 6 pour expirer. Quatre cycles suffisent pour retrouver un niveau d’activation plus favorable.',
    steps: [
      { label: 'Inspire', seconds: 4 },
      { label: 'Retiens', seconds: 2 },
      { label: 'Expire', seconds: 6 },
    ],
    after: 'À utiliser avant une compétition, ou entre deux actions quand la situation le permet. Si la respiration devient une distraction, reviens simplement à ta tâche.',
  },
  {
    id: 'recentrage',
    kind: 'Routine',
    category: 'Routine',
    title: 'Recentrage en 3 ancrages',
    duration: '2 min',
    pitch: 'Une routine courte pour revenir dans le jeu après une erreur ou une distraction.',
    intro:
      'Trois repères à enchaîner, dans l’ordre, pour couper la spirale et relancer l’action suivante. La routine se répète jusqu’à devenir automatique.',
    steps: [
      {
        title: 'Respire',
        text: 'Une expiration plus longue que l’inspiration. Les épaules descendent, la mâchoire se relâche.',
      },
      {
        title: 'Repère',
        text: 'Un repère corporel ou visuel : les appuis au sol, la ligne, le ballon. Tu reviens ici et maintenant.',
      },
      {
        title: 'Relance',
        text: 'Un mot d’action simple : « prochaine action », « placement », « je repars ». Puis tu agis.',
      },
    ],
    after: 'Cette routine appartient à Aga et à toi : adapte les mots et le repère à ta discipline. Elle ne remplace pas un travail de fond sur les émotions.',
  },
  {
    id: 'video',
    kind: 'Vidéo',
    category: 'Vidéo',
    title: 'Revenir dans l’action après une erreur',
    duration: '2 min 40',
    pitch: 'Aga décrypte le moment où l’erreur prend toute la place, et comment raccourcir le retour au jeu.',
    intro:
      'Extrait de séance filmée avec un groupe de sportifs. La vidéo complète est hébergée sur la plateforme d’Optima Mind ; cet aperçu est une démonstration.',
    bullets: [
      'Nommer ce qui se passe, sans se juger.',
      'Choisir un repère extérieur pour couper la rumination.',
      'Donner une intention à l’action suivante, pas au résultat.',
    ],
    after: 'Aperçu de démonstration — la vidéo n’est pas hébergée dans ce prototype. La ressource complète sera disponible dans l’espace Optima Mind.',
  },
];

export const CHRIS_RESPONSES = {
  CAL_01: 5,
  CAL_02: 4,
  CAL_03: 3,
  CAL_04: 2,
  CAL_05: 4,
  COM_01: 5,
  COM_02: 5,
  COM_03: 4,
  COM_04: 3,
  COM_05: 4,
  CON_01: 4,
  CON_02: 4,
  CON_03: 3,
  CON_04: 3,
  CON_05: 3,
  CONF_01: 4,
  CONF_02: 4,
  CONF_03: 4,
  CONF_04: 5,
  CONF_05: 3,
};

export const ELISE_RESPONSES = {
  CAL_01: 4,
  CAL_02: 4,
  CAL_03: 4,
  CAL_04: 4,
  CAL_05: 3,
  COM_01: 4,
  COM_02: 3,
  COM_03: 3,
  COM_04: 3,
  COM_05: 3,
  CON_01: 4,
  CON_02: 4,
  CON_03: 4,
  CON_04: 3,
  CON_05: 3,
  CONF_01: 4,
  CONF_02: 3,
  CONF_03: 4,
  CONF_04: 3,
  CONF_05: 3,
};

export const COCO_RESPONSES = {
  CAL_01: 3,
  CAL_02: 3,
  CAL_03: 3,
  CAL_04: 3,
  CAL_05: 3,
  COM_01: 5,
  COM_02: 5,
  COM_03: 4,
  COM_04: 4,
  COM_05: 4,
  CON_01: 4,
  CON_02: 3,
  CON_03: 3,
  CON_04: 3,
  CON_05: 3,
  CONF_01: 4,
  CONF_02: 4,
  CONF_03: 3,
  CONF_04: 4,
  CONF_05: 3,
};


/** 35 jours d'historique simulé : 30 jours affichables + 5 jours pour la comparaison. */
function leaCheckins() {
  const pattern = [
    [7, 6, 8], [7, 7, 7], [6, 7, 7], [8, 7, 8], [7, 6, 7], [7, 8, 8], [6, 6, 7],
    [7, 7, 8], [7, 6, 7], [8, 7, 7], [7, 7, 8], [6, 7, 6], [7, 8, 8], [7, 7, 7],
    [6, 6, 7], [8, 7, 8], [7, 7, 7], [7, 6, 8], [6, 7, 7], [8, 8, 8], [7, 7, 7],
    [6, 6, 7], [7, 7, 8], [8, 7, 7], [7, 8, 8], [7, 7, 7], [6, 7, 7], [8, 7, 8],
    [7, 6, 7], [7, 7, 8], [6, 6, 7], [7, 8, 7], [8, 7, 8], [7, 7, 7], [7, 8, 8],
  ];
  return pattern.map(([mood, energy, sleep], index) => ({
    daysAgo: 35 - index,
    mood,
    energy,
    sleep,
    word: index === 34 ? 'Sereine' : null,
    sample: true,
  }));
}

function malikCheckins() {
  const recent = {
    5: { mood: 7, energy: 7, sleep: 7 },
    4: { mood: 7, energy: 6, sleep: 6 },
    3: { mood: 6, energy: 5, sleep: 6 },
    2: { mood: 5, energy: 4, sleep: 5 },
    1: { mood: 5, energy: 4, sleep: 5, word: 'fatigué' },
  };
  return Array.from({ length: 35 }, (_, index) => {
    const daysAgo = 35 - index;
    if (recent[daysAgo]) {
      return { daysAgo, ...recent[daysAgo], sample: true };
    }
    const variation = daysAgo % 3 === 0 ? 1 : 0;
    return {
      daysAgo,
      mood: 7,
      energy: 7 + variation,
      sleep: 7,
      word: null,
      sample: true,
    };
  });
}

export const ATHLETES = [
  {
    id: 'lea',
    firstName: 'Léa',
    name: 'Léa Dubois',
    initials: 'LD',
    age: 21,
    sport: '400 m haies',
    club: 'Wavre Athlétisme',
    coachGoal: 'Championnats de Belgique indoor',
    since: 'sept. 2026',
    note: 'Travail du retour au calme après erreur et de la confiance en fin de course.',
    demoAccount: true,
    responses: SAMPLE_RESPONSES,
    profileDaysAgo: 8,
    assignment: { status: 'completed', daysAgo: 8 },
    shared: [
      {
        resourceId: 'recentrage',
        daysAgo: 4,
        message: 'À tester avant ta prochaine compétition.',
      },
    ],
    checkins: leaCheckins(),
    carnet: { goal: null, entries: [], draft: null },
    customRoutines: [],
    routineAssignments: [],
    activities: [],
    device: {
      provider: 'strava',
      status: 'disconnected',
      lastSyncAt: null,
      error: null,
      selection: { activity: true, duration: true, date: true, distance: false },
    },
  },
  {
    id: 'malik',
    firstName: 'Malik',
    name: 'Malik Benali',
    initials: 'MB',
    age: 24,
    sport: 'Basket-ball · meneur',
    club: 'BC Wavre',
    coachGoal: 'Reprendre confiance après blessure',
    since: 'oct. 2026',
    note: 'Suivi de reprise, gestion de la pression en fin de match.',
    demoAccount: true,
    responses: MALIK_RESPONSES,
    profileDaysAgo: 3,
    assignment: { status: 'completed', daysAgo: 3 },
    shared: [],
    checkins: malikCheckins(),
    carnet: { goal: null, entries: [], draft: null },
    customRoutines: [],
    routineAssignments: [],
    activities: [],
    device: {
      provider: 'strava',
      status: 'disconnected',
      lastSyncAt: null,
      error: null,
      selection: { activity: true, duration: true, date: true, distance: false },
    },
  },
];

export const ROUTINE_LIBRARY = [
  {
    id: 'recentrage',
    title: 'Recentrage en 3 ancrages',
    kind: 'Routine',
    duration: '2 min',
    context: 'Après une erreur',
    origin: 'Optima Mind',
    steps: [
      { title: 'Respire', text: 'Une expiration plus longue que l’inspiration. Les épaules descendent.' },
      { title: 'Repère', text: 'Les appuis au sol, la ligne, le ballon. Tu reviens ici et maintenant.' },
      { title: 'Relance', text: 'Un mot d’action simple : « prochaine action », « je repars ». Puis tu agis.' },
    ],
  },
  {
    id: 'respiration',
    title: 'Respiration 4-2-6',
    kind: 'Exercice',
    duration: '3 min',
    context: 'Avant un moment clé',
    origin: 'Optima Mind',
    steps: [
      { title: 'Inspire', text: '4 secondes, par le nez, sans forcer.' },
      { title: 'Retiens', text: '2 secondes, sans crispation.' },
      { title: 'Expire', text: '6 secondes, plus long que l’inspiration.' },
    ],
  },
  {
    id: 'performance',
    title: 'Routine avant compétition',
    kind: 'Routine',
    duration: '4 min',
    context: 'Avant match',
    origin: 'Optima Mind',
    steps: [
      { title: 'Ancrer', text: 'Un repère corporel stable : les appuis, la respiration, la nuque relâchée.' },
      { title: 'Visualiser', text: 'Une action que tu maîtrises, puis la première action du match.' },
      { title: 'Déclencher', text: 'Un mot ou un geste personnel qui lance ton match.' },
    ],
  },
];

export const ENTRY_TYPES = [
  {
    key: 'session',
    label: 'Séance',
    icon: 'calendar',
    heading: 'Ajouter une séance',
    prompt: 'Comment s’est passée ta séance ?',
    noteLabel: 'Ce que j’ai vécu',
    notePlaceholder: 'Ce qui s’est bien passé, ce qui a été plus difficile…',
    needsRoutine: true,
  },
  {
    key: 'competition',
    label: 'Compétition',
    icon: 'target',
    heading: 'Préparer une compétition',
    prompt: 'Quelle intention pour cette compétition ?',
    noteLabel: 'Mon intention',
    notePlaceholder: 'Sur quoi je veux mettre mon attention…',
    needsRoutine: true,
  },
  {
    key: 'feeling',
    label: 'Ressenti',
    icon: 'mood',
    heading: 'Noter un ressenti',
    prompt: 'Qu’est-ce que tu ressens ?',
    noteLabel: 'Mon ressenti',
    notePlaceholder: 'Sans filtre, ce que tu ressens maintenant…',
    needsRoutine: false,
  },
  {
    key: 'helper',
    label: 'Ce qui m’a aidé',
    icon: 'sparkle',
    heading: 'Noter ce qui t’a aidé',
    prompt: 'Qu’est-ce qui t’a aidé ?',
    noteLabel: 'Ce qui m’a aidé',
    notePlaceholder: 'Une phrase, un geste, une personne, une routine…',
    needsRoutine: false,
  },
];

export const ROUTINE_FEEDBACK = [
  { key: 'helped', label: 'Ça m’a aidé', tone: 'success' },
  { key: 'somewhat', label: 'Un peu', tone: 'info' },
  { key: 'not', label: 'Pas cette fois', tone: 'muted' },
];

export const ACTIVITY_SOURCES = {
  manual: { label: 'Ajout manuel', short: 'Manuel', icon: 'plus' },
  strava: { label: 'Strava · démo', short: 'Strava', icon: 'trend' },
  gpx: { label: 'Fichier GPX', short: 'GPX', icon: 'external' },
};

export const DEVICE_PROVIDER = {
  id: 'strava',
  name: 'Strava',
  mode: 'demo',
  label: 'Mode démo — aucune connexion réelle',
  scopes: 'Activités, durée, date, distance',
  docs: [
    'Créer une application API sur strava.com/settings/api.',
    'Renseigner le Client ID, le Client Secret et l’URL de redirection côté serveur.',
    'Échanger le code OAuth contre un token, stocker le refresh token par sportif.',
    'Importer les activités via l’API (scope activity:read_all) et dédupliquer par identifiant Strava.',
  ],
};

export const DEMO_DEVICE_ACTIVITIES = [
  {
    externalId: 'strava-demo-1',
    activity: 'Footing de récupération',
    duration: 28,
    distance: 4.7,
    daysAgo: 2,
  },
  {
    externalId: 'strava-demo-2',
    activity: 'Séance U16 — jeu réduit',
    duration: 65,
    distance: null,
    daysAgo: 1,
  },
];

export const COLLECTIVE_TYPES = [
  { key: 'team', label: 'Équipe', description: 'Un collectif qui joue ensemble.' },
  { key: 'group', label: 'Groupe', description: 'Un atelier ou un objectif de travail.' },
];

export const COACH = {
  name: 'Aga',
  fullName: 'Agnieszka « Aga » Orchowska',
  role: 'Préparatrice mentale · fondatrice d’Optima Mind',
  initials: 'AO',
};

export const STATUS = {
  todo: { label: 'À faire', tone: 'warn' },
  in_progress: { label: 'Envoyé', tone: 'info' },
  completed: { label: 'Complété', tone: 'success' },
};

export function getDimension(key) {
  return DIMENSIONS.find((d) => d.key === key);
}

export function getQuestion(id) {
  return QUESTIONS.find((q) => q.id === id);
}

export function getResource(id) {
  return RESOURCES.find((r) => r.id === id);
}

export function getRoutineTemplate(id) {
  return ROUTINE_LIBRARY.find((routine) => routine.id === id);
}

export function getEntryType(key) {
  return ENTRY_TYPES.find((type) => type.key === key) ?? ENTRY_TYPES[0];
}

