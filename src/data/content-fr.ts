/**
 * Contenu FR du site (incrément 2 : pages statiques).
 * Textes repris du site actuel (audit 2025-08) et retravaillés.
 * À l'incrément 3, ce module est remplacé par les content collections
 * (Decap CMS) — les interfaces ci-dessous deviennent les schémas Zod.
 */
import type { ImageMetadata } from 'astro';
import ffaLogo from '../assets/references/FFA_logo_baseline-1-300x127.png';
import kampusLogo from '../assets/references/Kampus-Wavre-Centre-de-kinesitherapie.jpg';
import rosLogo from '../assets/references/ROS-300x300.jpeg';

export interface Cta {
  label: string;
  href: string;
}

export interface Card {
  title: string;
  eyebrow?: string;
  text: string;
  link?: Cta;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  category: 'sport' | 'entreprise';
  featured?: boolean;
}

export interface Reference {
  name: string;
  alt: string;
  src: ImageMetadata;
}

export interface Offer {
  title: string;
  intro: string;
  items: string[];
}

/* ------------------------------------------------------------------ */
/* Références et témoignages (contenu réel du site actuel)            */
/* ------------------------------------------------------------------ */

export const references: Reference[] = [
  { name: 'ROS', alt: 'Logo ROS', src: rosLogo },
  {
    name: 'Kampus Wavre',
    alt: 'Logo Kampus Wavre — Centre de kinésithérapie',
    src: kampusLogo,
  },
  { name: 'FFA', alt: 'Logo FFA — formation des entraîneurs de football', src: ffaLogo },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Grâce à ton accompagnement mental, j'ai abordé la Coupe d'Europe avec beaucoup plus de confiance et de sérénité. L'appréhension face à l'adversaire s'est transformée en envie de me dépasser, grâce à des outils concrets comme le switch et la fixation d'objectifs réalistes, qui m'ont permis de mieux gérer la pression.",
    author: 'Joueur de hockey sur gazon',
    role: 'Sportif accompagné',
    category: 'sport',
    featured: true,
  },
  {
    quote:
      "Ma rencontre avec Aga a constitué un véritable déclic. À son contact, j'ai pu prendre la pleine mesure de l'impact de la gestion de la dimension psychologique dans la performance sportive. Aga est une vraie professionnelle qui sait comment (re)booster un groupe et le transcender !",
    author: 'Jérôme Lepers',
    role: 'Entraîneur',
    category: 'sport',
    featured: true,
  },
  {
    quote:
      "Avant, toute ma performance se résumait au résultat et à la médaille d'or. Aujourd'hui, j'aborde la compétition différemment : je me concentre sur le processus, l'instant présent et le plaisir de combattre, avec beaucoup plus de sérénité et d'efficacité.",
    author: 'Sportif de jiujitsu et grappling',
    role: 'Sportif accompagné',
    category: 'sport',
  },
  {
    quote:
      "J'ai eu le plaisir de collaborer avec Aga cette saison. Elle m'a accompagné auprès de l'équipe première féminine du RRC Boitsfort avec professionnalisme et des outils concrets de préparation mentale. Son travail a contribué à renforcer la cohésion du groupe et la gestion de la pression dans un championnat exigeant.",
    author: 'Alexandre GEREZ',
    role: 'RRC Boitsfort — T1 de la P1D',
    category: 'sport',
    featured: true,
  },
];

/* ------------------------------------------------------------------ */
/* Accueil                                                            */
/* ------------------------------------------------------------------ */

export const home = {
  hero: {
    eyebrow: 'Optima Mind — Wavre, Belgique',
    title: 'Le coaching qui transforme votre potentiel en résultats concrets',
    lead: 'Un accompagnement sur-mesure pour révéler votre potentiel, en transformant stress et doutes en levier de performance.',
    ctas: [
      { label: 'Prendre RDV', href: '/fr/prise-de-rendez-vous/' },
      { label: 'En savoir plus', href: '/fr/sportifs/' },
    ] satisfies Cta[],
  },
  valueProp: {
    title: 'La performance durable ne s’improvise pas, elle se construit.',
  },
  univers: [
    {
      title: 'Sport',
      eyebrow: 'Mental & Performance',
      text: 'Renforce ton mental pour performer avec confiance et régularité. Gère la pression, reste concentré quand ça compte vraiment et exprime pleinement ton potentiel, seul ou en équipe.',
      link: { label: 'En savoir plus', href: '/fr/sportifs/' },
    },
    {
      title: 'Entreprises',
      eyebrow: 'Performance & Mindset',
      text: 'Développez un mindset de performance pour gagner en clarté, en impact et en efficacité. Renforcez la capacité de vos équipes à décider, gérer la pression et atteindre leurs objectifs avec stabilité et intention.',
      link: { label: 'En savoir plus', href: '/fr/entreprises/' },
    },
  ] satisfies Card[],
  aboutTeaser: {
    eyebrow: 'Libérez votre potentiel !',
    title: 'Une approche entre exigence et humanité',
    paragraphs: [
      "La performance durable naît de l'équilibre entre exigence et humanité. Que vous soyez sportif, entraîneur ou manager, je vous accompagne avec passion, authenticité et bienveillance pour trouver vos propres leviers de progression, atteindre vos objectifs tout en respectant votre rythme et votre équilibre.",
      "Forte de mon expérience en entreprise et dans le sport, j'allie rigueur, observation et écoute pour faire émerger les solutions les plus justes pour vous et vos équipes.",
    ],
    ctas: [
      { label: 'Découvrir mon parcours', href: '/fr/a-propos/' },
      { label: 'Contactez-nous', href: '/fr/contact/' },
    ] satisfies Cta[],
  },
  finalCta: {
    title: 'La performance durable ne s’improvise pas, elle se construit.',
    lead: "Profitez d'un premier échange de 30 minutes offert pour faire connaissance et définir vos besoins.",
    ctas: [{ label: 'Prendre RDV', href: '/fr/prise-de-rendez-vous/' }] satisfies Cta[],
  },
};

/* ------------------------------------------------------------------ */
/* Sportifs                                                           */
/* ------------------------------------------------------------------ */

export const sportifs = {
  hero: {
    eyebrow: 'Sportifs',
    title: 'Et si votre mental devenait votre plus grand atout ?',
    lead: 'La performance ne repose pas uniquement sur les capacités physiques ou techniques. Elle dépend aussi de votre mental, de votre gestion émotionnelle, de votre confiance et de votre équilibre intérieur.',
  },
  quote: {
    text: 'Ce n’est pas la montagne que nous conquérons, mais nous-mêmes — pour performer avec justesse, équilibre et confiance.',
    source: 'Inspiré de Sir Edmund Hillary',
  },
  enjeux: {
    title: 'Vous vous reconnaissez dans ces situations ?',
    items: [
      'Vous avez du mal à trouver le bon équilibre entre sport, vie personnelle et professionnelle ?',
      'Vous doutez parfois de vos capacités avant ou pendant la compétition ?',
      'Vous avez du mal à rester concentré(e) et calme sous pression ?',
      'Vous aimeriez mieux gérer vos émotions et transformer vos erreurs en apprentissages ?',
    ],
  },
  offers: [
    {
      title: 'Accompagnement individuel du sportif',
      intro:
        'Que vous soyez débutant, amateur ou sportif de haut niveau, chaque accompagnement est conçu sur mesure. Une écoute personnalisée et une vision globale qui relie le corps, les émotions et le mental, pour mieux vous connaître, renforcer votre confiance et performer avec plaisir et sérénité.',
      items: [
        'Canaliser vos émotions avant, pendant et après la compétition',
        'Maintenir votre concentration et votre calme dans les moments clés',
        'Développer votre combativité et votre motivation durable',
        'Construire une routine de performance adaptée à votre profil et à vos objectifs',
        'Retrouver un équilibre entre sport, études ou vie professionnelle',
      ],
    },
    {
      title: 'Accompagnement collectif des équipes',
      intro:
        "Que vous soyez une équipe en construction ou un collectif de haut niveau, chaque accompagnement est conçu sur mesure. La performance collective repose sur la cohésion, la communication et la confiance mutuelle — en tenant compte de la dynamique du groupe et de l'équilibre entre l'individu et le collectif.",
      items: [
        'Renforcer la cohésion et la motivation collective',
        'Communiquer de manière claire, respectueuse et efficace',
        'Gérer le stress et la pression dans les moments clés',
        "Développer un sentiment d'appartenance autour de valeurs communes",
        'Permettre à chacun de trouver sa place et de contribuer à la réussite collective',
      ],
    },
    {
      title: 'Accompagnement entraîneur',
      intro:
        "Être entraîneur, c'est bien plus que transmettre une technique ou un système de jeu : c'est incarner une posture, donner un cadre et influencer l'état d'esprit de ses joueurs et joueuses au quotidien. Une approche pragmatique, humaine et ancrée dans la réalité du terrain.",
      items: [
        'Affirmer une posture de leader claire et cohérente',
        'Gérer la pression et rester stable dans les moments clés',
        'Communiquer avec impact, justesse et bienveillance',
        'Prendre des décisions alignées avec vos valeurs et vos objectifs',
        'Devenir un repère fiable et inspirant pour votre équipe',
      ],
    },
  ] satisfies Offer[],
  cta: {
    title: 'Prêt(e) à faire de votre mental un atout ?',
    lead: 'Un premier échange de 30 minutes offert pour faire connaissance et définir vos besoins.',
    ctas: [{ label: 'Prendre RDV', href: '/fr/prise-de-rendez-vous/' }] satisfies Cta[],
  },
};

/* ------------------------------------------------------------------ */
/* Entreprises                                                        */
/* ------------------------------------------------------------------ */

export const entreprises = {
  hero: {
    eyebrow: 'Entreprises',
    title: 'Accompagnement en entreprise',
    lead: 'Libérer la performance durable et la clarté stratégique.',
    intro:
      "La performance n'a de sens que si elle s'accompagne de clarté, de plaisir et de sens. Mon rôle est de créer l'espace où les dirigeants et leurs équipes peuvent retrouver leur plein potentiel, libérer leur énergie et avancer avec confiance vers leurs objectifs.",
  },
  benefices: {
    title: 'Une approche intégrée où le mindset devient un levier de performance',
    subtitle: 'Ce que mon accompagnement permet de développer :',
    items: [
      'Des stratégies claires et alignées, qui donnent du sens, une direction et un cadre rassurant pour agir.',
      'Une performance structurée et cohérente, grâce à des repères, des priorités claires et des routines adaptées.',
      "Une capacité à traverser le changement, en renforçant l'adhésion, la communication et la résilience individuelle et collective.",
      'Un leadership et une posture mentale solides, au service de la confiance, de l’engagement et de la performance du groupe.',
      'Un mindset de performance durable, basé sur des habitudes, des réflexes et des attitudes qui soutiennent la réussite sans épuisement.',
      "Des habitudes mentales efficaces, favorisant la clarté, l'autonomie, la régularité… et le plaisir dans l'action.",
    ],
  },
  mission: {
    eyebrow: 'Ma mission',
    title: 'De la clarté aux résultats concrets',
    paragraphs: [
      "J'aide les leaders et les équipes à retrouver clarté, énergie et alignement pour transformer leurs objectifs en résultats concrets, sans compromettre le bien-être ni la qualité des relations.",
      "Chaque accompagnement repose sur une analyse précise de l'existant, l'identification des leviers de performance et la co-construction de solutions durables, adaptées à votre réalité. Mon parcours dans le monde de l'entreprise m'a conduite à occuper des fonctions stratégiques, à piloter des transformations majeures et à structurer des systèmes de performance.",
    ],
  },
  publicCible: {
    title: 'Pour qui ?',
    items: [
      'Dirigeants souhaitant renforcer la vision et l’impact de leur leadership.',
      'Managers en quête d’efficacité, de clarté et d’équilibre.',
      'Équipes confrontées à des enjeux de changement, de cohésion ou de performance.',
      'Organisations désireuses d’instaurer une culture de la performance durable et du bien-être au travail.',
    ],
  },
  thematiques: {
    title: 'Thématiques abordées',
    subtitle: 'Lors des ateliers, des formations ou des suivis individuels :',
    items: [
      'Clarifier la vision et les priorités stratégiques pour donner du sens et de la direction.',
      "Mobiliser les équipes autour d'objectifs communs et créer l'engagement collectif.",
      'Gérer la pression et les résistances au changement pour avancer sereinement.',
      'Renforcer la confiance et la communication au sein des équipes pour une dynamique positive et efficace.',
      'Développer un mindset de croissance et d’autonomie pour soutenir la performance durable.',
      'Installer des rituels et habitudes de performance efficaces pour concrétiser les résultats.',
    ],
  },
  cta: {
    title: 'Et si nous construisions votre prochaine étape ?',
    lead: 'Un premier échange pour comprendre vos enjeux et vous proposer une démarche adaptée.',
    ctas: [
      { label: 'Contactez-nous', href: '/fr/contact/' },
      { label: 'Prendre RDV', href: '/fr/prise-de-rendez-vous/' },
    ] satisfies Cta[],
  },
};

/* ------------------------------------------------------------------ */
/* À propos                                                           */
/* ------------------------------------------------------------------ */

export const apropos = {
  hero: {
    eyebrow: 'À propos',
    title: 'Mon parcours — entre terrain, humain et performance',
  },
  sections: [
    {
      title: 'Une expérience vécue du sport, de l’intérieur',
      paragraphs: [
        "Mon parcours dans le sport est né sur le terrain, d'abord à travers mes enfants, puis très vite comme formatrice et accompagnante auprès des sportifs et des entraîneurs. Depuis 2015, j'accompagne des entraîneurs dans le développement de leurs pratiques afin de favoriser la progression et la performance de leurs sportifs.",
        "D'abord menée en parallèle de mon activité professionnelle en entreprise, cette mission est devenue, depuis 2024, le cœur de mon activité. Depuis 4 ans, je suis également membre de la FFA, où je contribue activement à la formation des entraîneurs de football.",
        "À 40 ans, j'ai choisi de pratiquer le football moi-même, après avoir joué au basketball et au volleyball. Être aujourd'hui joueuse me permet de vivre de l'intérieur les exigences du sport collectif : la pression, les attentes, le stress des moments décisifs, mais aussi la dynamique d'équipe, l'engagement et le plaisir de jouer.",
        "Cette double posture — formatrice et sportive — me permet de transmettre des outils concrets, applicables et crédibles, issus à la fois de l'expérience vécue et de la compréhension fine du terrain. Mon objectif : former et accompagner des entraîneurs, des sportifs et des équipes capables de rester lucides, solides et engagés lorsque la performance compte vraiment.",
      ],
    },
    {
      title: 'Une expertise en entreprise orientée efficacité et performance',
      paragraphs: [
        'Je suis ingénieure de formation et experte en amélioration continue (Green Belt), avec plus de vingt ans d’expérience dans le monde de l’entreprise. J’ai évolué dans des environnements exigeants, à des postes stratégiques, où la performance, les délais et l’engagement des équipes étaient des enjeux clés.',
        "J'ai exercé le rôle de Job + Coach, en accompagnant les managers directement dans leur fonction pour augmenter leur efficacité, leur posture de leader et leur capacité à délivrer des résultats. J'ai facilité le changement en soutenant les équipes et les leaders dans l'atteinte d'objectifs ambitieux, sous pression et dans des contextes de transformation.",
        "Au cœur de mon approche : le facteur humain. Comprendre ce qui freine, activer ce qui engage, et aligner les comportements, les pratiques et l'état d'esprit avec les objectifs à atteindre.",
      ],
    },
    {
      title: 'Une approche qui relie les deux mondes',
      paragraphs: [
        "Aujourd'hui, je fais le lien entre ces deux univers — le sport et l'entreprise — avec une approche à la fois structurée, humaine et pragmatique. J'aide les sportifs, les entraîneurs, les managers et les équipes à faire évoluer leur mindset, leurs comportements et leurs méthodes pour atteindre une performance plus élevée, durable et alignée avec leurs valeurs.",
        'Mon objectif est clair : vous aider à performer au meilleur de vos capacités, avec sens, équilibre et maîtrise — sur le terrain comme dans votre environnement professionnel.',
      ],
    },
  ],
  formations: {
    title: 'Mes formations',
    groups: [
      {
        name: 'Fondations académiques et ingénierie de la performance',
        items: [
          'Master en Science (MSc Eng) — Organisation des systèmes de production, Université de Technologie de Gdańsk, Pologne',
          'Lean Six Sigma — Green Belt certifiée',
          'Enhancing Sports Performance Through Neurobiology — LABA International Business School',
        ],
      },
      {
        name: 'Transformation, leadership & performance en entreprise',
        items: [
          'Leading Edge Program (Senn Delaney) — Facilitatrice du changement culturel',
          'Programme de mini-transformation — Navigateur du changement autonome et efficace',
          'Coaching en entreprise — accompagnement des collaborateurs du niveau opérateur au niveau direction',
          'Accelerating Delivery & Performance (ADP) — Consultante certifiée Job + Coach',
        ],
      },
      {
        name: 'Préparation mentale et approches psychologiques du sport',
        items: [
          'Formation postuniversitaire en psychologie du sport — National Louis University, Pologne',
          'Diplôme universitaire de Lille (UFR3S — ILIS) en préparation mentale du sportif',
        ],
      },
    ],
  },
  cta: {
    title: 'Et si nous faisions connaissance ?',
    lead: 'Un premier échange de 30 minutes offert pour parler de vos objectifs.',
    ctas: [
      { label: 'Prendre RDV', href: '/fr/prise-de-rendez-vous/' },
      { label: 'Contactez-nous', href: '/fr/contact/' },
    ] satisfies Cta[],
  },
};

/* ------------------------------------------------------------------ */
/* Réservation                                                        */
/* ------------------------------------------------------------------ */

export const rendezVous = {
  hero: {
    eyebrow: 'Rendez-vous',
    title: 'Réservez votre séance individuelle',
    lead: "Profitez d'un premier échange de 30 minutes offert pour faire connaissance et définir vos besoins. La séance peut avoir lieu en visioconférence ou en présentiel.",
  },
  lieux: {
    title: 'Où nous rencontrer ?',
    items: [
      { name: 'À domicile', address: 'Clos du Relais 61, 1300 Wavre' },
      {
        name: 'À Kampus — Centre de kinésithérapie',
        address: 'Rue de Bruxelles 48/50, 1300 Wavre',
      },
    ],
  },
  types: {
    title: 'Quel accompagnement ?',
    subtitle: '⟨À FOURNIR : confirmation des durées et tarifs éventuels⟩',
    items: [
      { name: 'Sportif individuel', duration: '60 min', href: '/fr/sportifs/' },
      { name: 'Équipe sportive', duration: '90 min', href: '/fr/sportifs/' },
      { name: 'Entraîneur', duration: '60 min', href: '/fr/sportifs/' },
      { name: 'Entreprise', duration: '90 min', href: '/fr/entreprises/' },
    ],
  },
};
