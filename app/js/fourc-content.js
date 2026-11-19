/** Textes exacts de la lecture 4C, des pistes et du catalogue de tests. */

export const FIXED_ORDER = [
  'CAL_01',
  'CON_01',
  'COM_01',
  'CONF_01',
  'CAL_05',
  'COM_02',
  'CON_02',
  'CONF_02',
  'CAL_02',
  'COM_05',
  'CONF_03',
  'CON_03',
  'CAL_03',
  'CONF_05',
  'COM_03',
  'CON_04',
  'CAL_04',
  'CON_05',
  'COM_04',
  'CONF_04',
];

export const PISTES = {
  respiration: {
    label: 'Respiration',
    description:
      'Ralentir et approfondir ta respiration pour ajuster ton niveau d’activation et revenir au moment présent.',
  },
  discours_interne: {
    label: 'Discours interne',
    description:
      'Choisir les mots que tu te dis : des phrases courtes, crédibles et tournées vers l’action, comme « Prochaine action » ou « Je suis prêt(e) ».',
  },
  switch: {
    label: 'Switch',
    description:
      'Un repère court pour couper avec ce qui vient de se passer et revenir à l’action suivante : « si ça arrive, alors je… ». (définition provisoire, à remplacer par celle d’Aga)',
  },
  imagerie_mentale: {
    label: 'Imagerie mentale',
    description:
      'Te représenter en détail des actions réussies ou des situations à venir, pour t’y préparer.',
  },
  routine_performance: {
    label: 'Routine de performance',
    description:
      'Une séquence répétée avant la compétition pour te mettre dans de bonnes conditions : respiration, mot-clé, repère personnel.',
  },
  routine_recentrage: {
    label: 'Routine de recentrage',
    description:
      'Quelques secondes, pendant la compétition, pour te remettre dans l’action après une erreur ou une distraction.',
  },
  meditation: {
    label: 'Méditation de pleine conscience',
    description:
      'Entraîner ta capacité à remarquer que ton attention est partie, puis à la ramener sur un point d’ancrage.',
  },
  objectifs_processus: {
    label: 'Objectifs de processus',
    description:
      'Te fixer des objectifs sur des actions concrètes et contrôlables, plutôt que sur le seul résultat.',
  },
  conscience_corporelle: {
    label: 'Conscience corporelle',
    description:
      'Écouter tes sensations pour ajuster ton effort et repérer ta montée en tension.',
  },
  acceptation_emotions: {
    label: 'Accueil des émotions',
    description:
      'Reconnaître et accepter une émotion plutôt que lutter contre elle, pour pouvoir continuer à agir.',
  },
  changement_focus: {
    label: 'Changement de focus',
    description:
      'T’exercer à passer d’une attention large à une attention précise, de l’extérieur à tes sensations, selon le moment.',
  },
  plans_alternatifs: {
    label: 'Plans B',
    description:
      'Préparer à l’avance d’autres façons d’agir quand ta stratégie de départ ne fonctionne plus.',
  },
  preparation_scenarios: {
    label: 'Préparation de scénarios',
    description:
      'Imaginer à l’avance des situations nouvelles ou imprévues, et la façon dont tu t’y adapterais.',
  },
  reperes_reussites: {
    label: 'Repères de réussite',
    description:
      'Lister tes compétences et tes réussites passées, pour appuyer ta confiance sur du concret.',
  },
};

export const DIMENSION_TEXT = {
  calme: {
    subtitle: 'Gérer la pression et les émotions',
    central:
      'Le calme ne consiste pas à supprimer les émotions, mais à apprendre à les réguler pour rester ou redevenir efficace sous pression.',
    emptyQuestion:
      'Qu’est-ce qui t’aide le plus à rester calme dans les moments importants, et comment pourrais-tu t’en servir encore plus ?',
  },
  combativite: {
    subtitle: 'Rester engagé malgré les difficultés',
    central:
      'Être combatif, c’est rester engagé face à l’adversité, mobiliser ses ressources et adapter ses actions pour continuer à avancer vers son objectif.',
    emptyQuestion:
      'Quelle situation difficile as-tu déjà surmontée, et qu’est-ce qu’elle t’a appris sur toi ?',
  },
  concentration: {
    subtitle: 'Savoir utiliser et retrouver son attention',
    central:
      'Être concentré, ce n’est pas être attentif à tout, tout le temps. C’est savoir où porter son attention, l’adapter à la situation et la retrouver lorsqu’on perd le fil.',
    emptyQuestion:
      'Qu’est-ce qui t’aide à rester concentré(e), et dans quelles situations aimerais-tu t’en servir davantage ?',
  },
  confiance: {
    subtitle: 'Croire en ses capacités et oser agir',
    central:
      'Avoir confiance, ce n’est pas être certain de réussir. C’est croire en ses compétences et en sa capacité à les mobiliser, même face à la pression, aux erreurs ou à l’inconnu.',
    emptyQuestion: 'Sur quelles expériences ta confiance s’appuie-t-elle aujourd’hui ?',
  },
};

export const READING_BY_ID = {
  CAL_01: {
    support: 'Tu arrives à garder ton calme quand la pression monte.',
    explore: 'Garder ton calme quand la pression augmente semble parfois plus difficile.',
    pistes: ['respiration', 'conscience_corporelle'],
    question:
      'Quand la pression monte, qu’est-ce que tu remarques en premier dans ton corps ou dans tes pensées ?',
  },
  CAL_02: {
    support: 'Tu sais gérer ta tension avant une compétition importante.',
    explore:
      'La période juste avant une compétition importante peut être particulièrement exigeante pour toi.',
    pistes: ['respiration', 'routine_performance', 'discours_interne'],
    question:
      'Qu’est-ce qui pourrait t’aider à vivre les minutes avant une compétition importante dans un état qui te convient ?',
  },
  CAL_03: {
    support: 'Même avec une émotion forte, tu restes capable d’agir efficacement.',
    explore:
      'Certaines émotions fortes semblent parfois gêner ta capacité à agir comme tu le voudrais.',
    pistes: ['acceptation_emotions', 'respiration'],
    question:
      'Quelle émotion te demande le plus d’énergie en compétition, et comment se manifeste-t-elle ?',
  },
  CAL_04: {
    support: 'Après une erreur, tu retrouves rapidement ton calme.',
    explore: 'Retrouver rapidement ton calme après une erreur semble parfois plus difficile.',
    pistes: ['switch', 'discours_interne', 'routine_recentrage'],
    question:
      'Que se passe-t-il pour toi après une erreur, et qu’est-ce qui pourrait t’aider à revenir plus vite dans le jeu ?',
  },
  CAL_05: {
    support:
      'Dans les moments importants, la pression ne t’empêche pas de jouer comme tu sais le faire.',
    explore:
      'Dans les moments importants, la pression peut limiter l’expression de tes capacités.',
    pistes: ['respiration', 'discours_interne', 'routine_recentrage'],
    question: 'Dans quels moments la pression pèse-t-elle le plus sur ton jeu ?',
  },
  COM_01: {
    support: 'Tu restes engagé(e) quand la situation devient difficile.',
    explore: 'Rester engagé(e) quand la situation devient difficile peut te demander beaucoup.',
    pistes: ['discours_interne', 'objectifs_processus'],
    question:
      'Quand la situation devient difficile, qu’est-ce qui t’aide à rester dans l’action ?',
  },
  COM_02: {
    support: 'Quand les choses tournent mal, tu continues à chercher des solutions.',
    explore:
      'Trouver d’autres possibilités quand les choses ne se passent pas comme prévu semble parfois plus difficile.',
    pistes: ['switch', 'plans_alternatifs', 'objectifs_processus'],
    question:
      'Lorsque ta première stratégie ne fonctionne pas, qu’est-ce qui t’aide à continuer à chercher une solution ?',
  },
  COM_03: {
    support: 'Même fatigué(e), tu trouves les ressources pour continuer à agir efficacement.',
    explore:
      'Mobiliser tes ressources quand la fatigue se fait sentir peut être plus exigeant.',
    pistes: ['conscience_corporelle', 'discours_interne', 'respiration'],
    question:
      'Quand la fatigue arrive, comment fais-tu la différence entre un signal à écouter et un effort que tu peux encore fournir ?',
  },
  COM_04: {
    support: 'Après une erreur ou un échec, tu as envie de repartir.',
    explore: 'Retrouver l’envie de repartir après un revers peut parfois prendre du temps.',
    pistes: ['switch', 'discours_interne', 'imagerie_mentale'],
    question:
      'Après un échec, qu’est-ce qui t’a déjà aidé à retrouver l’envie de repartir ?',
  },
  COM_05: {
    support: 'Même quand la situation t’échappe, tu ne baisses pas les bras.',
    explore:
      'Quand tu as l’impression de perdre le contrôle de la situation, tu peux avoir tendance à baisser les bras.',
    pistes: ['discours_interne', 'imagerie_mentale', 'switch'],
    question:
      'Quand tu sens que la situation t’échappe, sur quoi pourrais-tu encore garder la main ?',
  },
  CON_01: {
    support: 'Pendant la compétition, tu sais sur quoi te concentrer.',
    explore: 'Savoir sur quoi porter ton attention pendant la compétition n’est pas toujours évident.',
    pistes: ['discours_interne', 'objectifs_processus', 'routine_performance'],
    question:
      'Si tu devais choisir un seul repère sur lequel te concentrer en compétition, lequel serait-ce ?',
  },
  CON_02: {
    support: 'Tu sais adapter ton attention quand la situation change.',
    explore: 'Adapter ton attention quand la situation évolue semble parfois plus difficile.',
    pistes: ['changement_focus', 'imagerie_mentale'],
    question:
      'Dans ton sport, à quels moments dois-tu passer d’une vue d’ensemble à un détail précis ?',
  },
  CON_03: {
    support: 'Tu restes concentré(e) même avec des distractions autour de toi.',
    explore: 'Les distractions semblent parfois perturber ta concentration.',
    pistes: ['meditation', 'discours_interne', 'imagerie_mentale'],
    question:
      'Quelles distractions te font le plus souvent décrocher pendant une compétition ?',
  },
  CON_04: {
    support: 'Quand tu perds ta concentration, tu la retrouves rapidement.',
    explore: 'Retrouver rapidement ton attention après l’avoir perdue peut être difficile.',
    pistes: ['switch', 'discours_interne', 'respiration'],
    question:
      'Quand tu as décroché, qu’est-ce qui pourrait t’aider à revenir sur l’action suivante ?',
  },
  CON_05: {
    support: 'Tu remarques vite quand ton attention s’éloigne du jeu.',
    explore: 'Il t’arrive de perdre le fil du jeu sans t’en rendre compte tout de suite.',
    pistes: ['meditation', 'routine_recentrage'],
    question:
      'Quand tu perds le fil pendant une compétition, comment pourrais-tu reconnaître plus vite que ton attention s’est éloignée du jeu ?',
  },
  CONF_01: {
    support: 'Tu as confiance dans ta capacité à réaliser ce que tu sais faire.',
    explore: 'Tu sembles parfois moins sûr(e) de pouvoir mobiliser tes compétences.',
    pistes: ['imagerie_mentale', 'reperes_reussites'],
    question:
      'Quelles sont trois choses que tu sais faire, et que tu as déjà prouvées en compétition ?',
  },
  CONF_02: {
    support: 'Tu gardes ta confiance quand l’enjeu devient important.',
    explore: 'La pression semble parfois fragiliser ta confiance.',
    pistes: ['respiration', 'discours_interne', 'routine_performance'],
    question: 'Qu’est-ce qui change dans ta confiance quand l’enjeu augmente ?',
  },
  CONF_03: {
    support: 'Face à un adversaire plus fort, tu continues à croire en tes possibilités.',
    explore:
      'Un adversaire que tu perçois comme plus fort peut faire naître davantage de doutes.',
    pistes: ['imagerie_mentale', 'objectifs_processus', 'discours_interne'],
    question:
      'Face à un adversaire plus fort, sur quoi pourrais-tu concentrer ton énergie plutôt que sur le résultat ?',
  },
  CONF_04: {
    support: 'Après une erreur, tu continues à croire en tes capacités.',
    explore: 'Une erreur peut diminuer ta confiance pendant un moment.',
    pistes: ['discours_interne', 'routine_recentrage'],
    question:
      'Après une erreur, que pourrais-tu te dire pour continuer à croire en tes capacités ?',
  },
  CONF_05: {
    support: 'Face à une situation nouvelle, tu gardes confiance en tes capacités.',
    explore:
      'Une situation que tu ne connais pas peut faire naître davantage de doutes sur tes capacités.',
    pistes: ['imagerie_mentale', 'preparation_scenarios', 'routine_performance'],
    question:
      'Qu’est-ce qui pourrait t’aider à croire davantage en tes capacités lorsque tu rencontres une situation que tu ne connais pas ?',
  },
};

export const TEST_CATALOG = [
  {
    id: '4c',
    name: 'Profil 4C',
    description: '20 affirmations · environ 2 minutes',
    duration: '2 min',
    available: true,
  },
  {
    id: 'pressure',
    name: 'Gestion de la pression en compétition',
    description: 'Intitulé provisoire · en préparation avec Aga',
    duration: 'Bientôt',
    available: false,
  },
  {
    id: 'routine',
    name: 'Routine et préparation',
    description: 'Intitulé provisoire · en préparation avec Aga',
    duration: 'Bientôt',
    available: false,
  },
];
