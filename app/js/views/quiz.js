import { SCALE, getQuestion } from '../data.js?v=7';
import { icon } from '../ui/icons.js?v=7';
import { trackCurves } from '../ui/components.js?v=7';

function scaleLine() {
  return `<div class="scale-line" aria-hidden="true">
    ${SCALE.map(
      (step) => `<span class="scale-line__item">
        <b>${step.value}</b>
        <i>${step.label}</i>
      </span>`,
    ).join('')}
  </div>`;
}

export function quizIntroView({ state }) {
  const active = state.athletes[state.activeAthlete] ?? state.athletes.lea;
  const test = active.test;
  const inProgress = test?.status === 'in_progress';
  const answered = inProgress ? Object.keys(test.answers).length : 0;
  const profile = active.profile;
  const hasOwnResult = Boolean(profile && !profile.sample);

  return `<div class="intro-page">
    <header class="flowbar">
      <a class="flowbar__back" href="#/accueil" aria-label="Revenir à l’accueil">${icon('back', { size: 22 })}</a>
      <span class="flowbar__title">Profil 4C</span>
      <span class="flowbar__right">2 min</span>
    </header>

    <div class="intro">
      ${trackCurves('intro__curves')}
      <p class="eyebrow">Questionnaire 4C</p>
      <h1 class="display display--xl" id="view-title">Comment tu fonctionnes en compétition&nbsp;?</h1>
      <p class="intro__lede">Pense à ta manière habituelle de fonctionner dans ton sport, particulièrement en compétition. Pour chaque affirmation, indique dans quelle mesure elle te correspond.</p>

      <div class="intro__scale">
        <p class="eyebrow">L’échelle</p>
        ${scaleLine()}
      </div>

      <ul class="checklist">
        <li>${icon('check', { size: 15 })}<span><strong>20 affirmations</strong> issues du référentiel O’MIND</span></li>
        <li>${icon('layers', { size: 15 })}<span><strong>4 dimensions</strong> révélées à la fin seulement</span></li>
        <li>${icon('lock', { size: 15 })}<span>Tes réponses restent <strong>sur cet appareil</strong></span></li>
      </ul>

      ${inProgress ? `<div class="resume-banner">
        <p>Tu as déjà commencé : <strong>${answered} réponse${answered > 1 ? 's' : ''} enregistrée${answered > 1 ? 's' : ''}</strong>.</p>
      </div>` : ''}

      <button class="btn btn--primary btn--block btn--lg" data-action="quiz-start" type="button">
        ${inProgress ? 'Reprendre le test' : 'Commencer'}
        ${icon('arrowRight', { size: 19 })}
      </button>

      ${hasOwnResult ? `<a class="text-link text-link--center" href="#/resultat">Voir mon profil actuel</a>` : ''}

      <p class="fineprint">Version de travail du référentiel O’MIND, à valider avec Aga avant publication. Aucune donnée personnelle n’est transmise dans cette démo.</p>
    </div>
  </div>`;
}

export function quizQuestionView({ test, index }) {
  const questionId = test.order[index];
  const total = test.order.length;
  const question = getQuestion(questionId);
  const selected = test.answers[questionId];
  const hasAnswer = selected != null;
  const isLast = index === total - 1;

  return `<div class="quiz" data-question="${questionId}">
    <header class="flowbar flowbar--quiz">
      <button class="flowbar__back" data-action="quiz-prev" type="button" aria-label="Question précédente">${icon('back', { size: 22 })}</button>
      <span class="flowbar__title">Profil 4C</span>
      <span class="flowbar__right">${index + 1} sur ${total}</span>
    </header>

    <div class="quiz__progress">
      <div class="progressline" role="progressbar" aria-label="Progression du questionnaire" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${index + 1}">
        <span style="width:${((index + 1) / total) * 100}%"></span>
      </div>
    </div>

    <div class="quiz__body">
      <p class="quiz__count">Affirmation ${String(index + 1).padStart(2, '0')}</p>
      <h1 class="quiz__question" id="question-title" tabindex="-1">${question.text}</h1>

      <div class="answers" role="radiogroup" aria-labelledby="question-title" data-answers>
        ${SCALE.map((step, stepIndex) => {
          const isSelected = selected === step.value;
          const tabIndex = isSelected || (selected == null && stepIndex === 0) ? 0 : -1;
          return `<button class="answer ${isSelected ? 'is-selected' : ''}" type="button" role="radio" aria-checked="${isSelected}" tabindex="${tabIndex}" data-action="quiz-answer" data-value="${step.value}">
            <span class="answer__label">${step.label}</span>
            <span class="answer__radio" aria-hidden="true"></span>
          </button>`;
        }).join('')}
      </div>
    </div>

    <div class="quiz__footer">
      <p class="quiz__hint">${hasAnswer ? 'Réponse enregistrée. Tu peux la modifier.' : 'Choisis une réponse pour continuer.'}</p>
      <button class="btn btn--primary btn--block btn--lg" data-action="quiz-next" type="button" ${hasAnswer ? '' : 'disabled'}>
        ${isLast ? 'Voir mon profil 4C' : 'Continuer'}
        ${icon(isLast ? 'sparkle' : 'arrowRight', { size: 19 })}
      </button>
    </div>
  </div>`;
}
