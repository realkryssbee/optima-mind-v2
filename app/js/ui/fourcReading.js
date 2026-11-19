import { DIMENSIONS, SCALE } from '../data.js';
import {
  buildDetailedReading,
  detailedAnswers,
  formatScore,
} from '../scoring.js';
import { escapeHTML } from '../utils.js';
import { icon } from './icons.js';

const RADAR_ANGLES = [-90, 0, 90, 180];

function radarPoint(value, index, center, radius) {
  const angle = (RADAR_ANGLES[index] * Math.PI) / 180;
  const distance = (value / 5) * radius;
  return {
    x: center.x + Math.cos(angle) * distance,
    y: center.y + Math.sin(angle) * distance,
  };
}

export function fourCRadar(profile) {
  const width = 360;
  const height = 300;
  const center = { x: 180, y: 150 };
  const radius = 88;
  const values = DIMENSIONS.map((dimension) => profile.scores[dimension.key]);
  const points = values
    .map((value, index) => {
      const point = radarPoint(value, index, center, radius);
      return `${point.x},${point.y}`;
    })
    .join(' ');
  const rings = [1, 2, 3, 4, 5]
    .map((ring) => {
      const ringPoints = DIMENSIONS.map((_, index) => {
        const point = radarPoint(ring, index, center, radius);
        return `${point.x},${point.y}`;
      }).join(' ');
      return `<polygon points="${ringPoints}" class="radar-ring" />`;
    })
    .join('');
  const axes = DIMENSIONS.map((_, index) => {
    const point = radarPoint(5, index, center, radius);
    return `<line x1="${center.x}" y1="${center.y}" x2="${point.x}" y2="${point.y}" class="radar-axis" />`;
  }).join('');
  const labels = DIMENSIONS.map((dimension, index) => {
    const point = radarPoint(5, index, center, radius);
    const value = formatScore(profile.scores[dimension.key]);
    const positions = [
      { x: point.x, y: point.y - 15, anchor: 'middle', valueY: point.y + 1 },
      { x: point.x + 9, y: point.y + 4, anchor: 'start', valueY: point.y + 19 },
      { x: point.x, y: point.y + 18, anchor: 'middle', valueY: point.y + 34 },
      { x: point.x - 9, y: point.y + 4, anchor: 'end', valueY: point.y + 19 },
    ];
    const position = positions[index];
    return `<text x="${position.x}" y="${position.y}" text-anchor="${position.anchor}" class="radar-label">${dimension.name}</text>
      <text x="${position.x}" y="${position.valueY}" text-anchor="${position.anchor}" class="radar-value">${value}/5</text>`;
  }).join('');
  const summary = DIMENSIONS.map(
    (dimension) => `${dimension.name} ${formatScore(profile.scores[dimension.key])}/5`,
  ).join(', ');

  return `<div class="radar">
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Radar du profil 4C : ${summary}">
      <title>Radar du profil 4C</title>
      ${rings}
      ${axes}
      <polygon points="${points}" class="radar-shape" />
      ${points
        .split(' ')
        .map((point) => {
          const [x, y] = point.split(',');
          return `<circle cx="${x}" cy="${y}" r="3" class="radar-dot" />`;
        })
        .join('')}
      ${labels}
    </svg>
  </div>`;
}

function supportList(items) {
  if (!items.length) {
    return `<p class="reading-empty">Aucun point d’appui identifié dans ces réponses pour l’instant.</p>`;
  }
  return `<ul class="reading-list">${items
    .map((item) => `<li>${escapeHTML(item.reading?.support ?? '')}</li>`)
    .join('')}</ul>`;
}

function exploreList(items) {
  if (!items.length) {
    return `<p class="reading-empty">Aucune situation à explorer avec ces réponses.</p>`;
  }
  return `<ul class="reading-list reading-list--explore">${items
    .map((item) => `<li>${escapeHTML(item.reading?.explore ?? '')}</li>`)
    .join('')}</ul>`;
}

function pistesList(pistes) {
  if (!pistes.length) return '';
  return `<div class="reading-pistes">${pistes
    .map(
      (piste) => `<details class="piste">
        <summary><span>${escapeHTML(piste.label)}</span><span class="piste__plus" aria-hidden="true">+</span></summary>
        <p>${escapeHTML(piste.description)}</p>
      </details>`,
    )
    .join('')}</div>`;
}

function answersList(profile) {
  const answers = detailedAnswers(profile);
  return `<details class="reading-answers">
    <summary><span>Voir le détail des 20 réponses</span><span aria-hidden="true">+</span></summary>
    <ul class="answers-list">
      ${answers
        .map((answer) => {
          const scale = SCALE.find((item) => item.value === answer.raw)?.label ?? '';
          return `<li>
            <div class="answers-list__top">
              <span class="answers-list__dim">${answer.dimensionName}</span>
              <span class="answers-list__id">${answer.id}</span>
            </div>
            <p>${escapeHTML(answer.text)}</p>
            <div class="answers-list__values">
              <span>Réponse : ${answer.raw} · ${escapeHTML(scale)}</span>
              ${answer.reversed ? `<span>Valeur recodée : ${answer.recoded}</span>` : ''}
            </div>
          </li>`;
        })
        .join('')}
    </ul>
  </details>`;
}

export function fourCReading({ profile, mode = 'sportif' }) {
  const reading = buildDetailedReading(profile);
  const limits = [
    {
      title: 'C’est de l’auto-évaluation.',
      text: 'Tu as répondu sur toi-même, à un moment donné. Le profil décrit ta perception, pas une mesure objective de tes capacités.',
    },
    {
      title: 'Un premier aperçu, pas un portrait complet.',
      text: 'Le profil ne représente pas l’ensemble de tes capacités et ne définit pas qui tu es comme sportif. D’autres ressources comptent aussi : motivation, objectifs, communication, cohésion.',
    },
    {
      title: 'Un outil en construction.',
      text: 'Ce questionnaire est une première version, qui sera testée et affinée. Il n’a pas encore de valeur scientifique validée, et ce n’est pas un avis de santé.',
    },
    {
      title: 'Ça se travaille.',
      text: 'Comme tes capacités physiques et techniques, tes ressources mentales évoluent avec l’entraînement.',
    },
  ];

  return `<div class="reading">
    <p class="reading-reminder">${icon('info', { size: 17 })}<span>Un score plus bas n’indique pas un problème, mais une ressource que tu peux explorer et développer.</span></p>
    ${fourCRadar(profile)}

    <div class="reading-cards">
      ${reading.dimensions
        .map(
          (item) => `<section class="reading-card" aria-labelledby="reading-${item.dimension.key}">
            <header class="reading-card__head">
              <div>
                <h3 id="reading-${item.dimension.key}">${item.dimension.name}</h3>
                <p>${item.dimension.subtitle}</p>
              </div>
              <span class="reading-card__score">${formatScore(item.score)}<small>/5</small></span>
            </header>
            <div class="reading-block">
              <h4>Tes points d’appui</h4>
              ${supportList(item.support)}
            </div>
            <div class="reading-block">
              <h4>Des situations à explorer</h4>
              ${exploreList(item.explore)}
            </div>
            <p class="reading-central">${item.central}</p>
            ${
              item.pistes.length
                ? `<div class="reading-block">
                    <h4>Pistes à explorer</h4>
                    ${pistesList(item.pistes)}
                  </div>`
                : ''
            }
            <div class="reading-question">
              <p class="eyebrow">Une question pour aller plus loin</p>
              <p>${escapeHTML(item.question)}</p>
            </div>
          </section>`,
        )
        .join('')}
    </div>

    <section class="reading-next" aria-labelledby="reading-next-title">
      <p class="eyebrow">La suite</p>
      <h2 id="reading-next-title">Envie d’aller plus loin ?</h2>
      <p>La préparation mentale t’aide à mieux comprendre tes réactions et à entraîner des stratégies adaptées à ton fonctionnement et à ton sport.</p>
      <button class="btn btn--primary btn--block btn--lg" data-action="open-exchange" type="button">
        Échanger sur mon profil ${icon('arrowRight', { size: 18 })}
      </button>
    </section>

    ${mode === 'coach' ? answersList(profile) : ''}

    <section class="reading-limits" aria-labelledby="reading-limits-title">
      <p class="eyebrow">À garder en tête</p>
      <h2 id="reading-limits-title">Ce que ce profil est, et ce qu’il n’est pas</h2>
      <ul>
        ${limits
          .map(
            (limit) => `<li><strong>${limit.title}</strong><span>${limit.text}</span></li>`,
          )
          .join('')}
      </ul>
    </section>
  </div>`;
}
