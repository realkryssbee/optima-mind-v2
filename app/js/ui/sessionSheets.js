import { RESOURCES } from '../data.js';
import { TEST_CATALOG } from '../fourc-content.js';
import { escapeHTML, todayISO } from '../utils.js';
import { icon } from './icons.js';

export function sessionSheet(athlete) {
  return {
    variant: 'panel',
    eyebrow: athlete.name,
    title: 'Clôturer la séance',
    body: `<form class="session-form" data-session-form data-athlete="${athlete.id}">
      <label class="field" for="session-date">
        <span class="field__label">Date de la séance</span>
        <input class="field__input" type="date" id="session-date" name="date" value="${todayISO()}" required>
      </label>

      <label class="field" for="session-private">
        <span class="field__label">Note de séance <em>visible uniquement par toi</em></span>
        <textarea class="field__input field__input--area" id="session-private" name="privateNote" rows="4" maxlength="1200" placeholder="Ce que tu observes, ce qui a été travaillé…"></textarea>
      </label>

      <label class="field" for="session-next">
        <span class="field__label">Prochaines étapes <em>visibles par ${escapeHTML(athlete.firstName)}</em></span>
        <textarea class="field__input field__input--area" id="session-next" name="nextSteps" rows="3" maxlength="600" required placeholder="Ex. Tester la routine de recentrage à l’entraînement de jeudi"></textarea>
      </label>

      <fieldset class="session-resources">
        <legend>Ressources à joindre <em>facultatif</em></legend>
        <div class="session-choice-list">
          ${RESOURCES.map(
            (resource) => `<label class="session-choice">
              <input type="checkbox" name="resources" value="${resource.id}">
              <span class="session-choice__icon">${icon(resource.category === 'Vidéo' ? 'video' : resource.category === 'Respiration' ? 'wind' : 'target', { size: 17 })}</span>
              <span><strong>${escapeHTML(resource.title)}</strong><small>${escapeHTML(resource.kind)} · ${escapeHTML(resource.duration)}</small></span>
            </label>`,
          ).join('')}
        </div>
      </fieldset>

      <div class="session-file">
        <button class="btn btn--outline btn--block" type="button" disabled>${icon('plus', { size: 16 })} Ajouter un fichier <span class="pill pill--soon">Bientôt</span></button>
        <p class="fineprint">L’ajout de fichiers à une séance arrive bientôt.</p>
      </div>

      <button class="btn btn--primary btn--block btn--lg" type="submit">Enregistrer la séance ${icon('check', { size: 18 })}</button>
      <p class="fineprint">La séance est enregistrée localement. La note privée ne sera jamais affichée côté sportif.</p>
    </form>`,
  };
}

export function testCatalogSheet({ state, athleteId }) {
  const athletes = Object.values(state.athletes);
  const selected = state.athletes[athleteId] ?? athletes[0];
  return {
    variant: 'panel',
    eyebrow: 'Catalogue de tests',
    title: 'Attribuer un test',
    body: `<form class="test-form" data-test-form>
      <label class="field" for="test-athlete">
        <span class="field__label">Pour quel sportif ?</span>
        <select class="field__input" id="test-athlete" name="athlete" required>
          ${athletes
            .map(
              (athlete) => `<option value="${athlete.id}" ${athlete.id === selected.id ? 'selected' : ''}>${escapeHTML(athlete.name)}</option>`,
            )
            .join('')}
        </select>
      </label>

      <fieldset class="test-catalog">
        <legend>Choisir un test</legend>
        ${TEST_CATALOG.map(
          (test) => `<label class="test-option ${test.available ? '' : 'is-disabled'}">
            <input type="radio" name="test" value="${test.id}" ${test.available ? '' : 'disabled'} ${test.id === '4c' ? 'checked' : ''}>
            <span class="test-option__copy">
              <span class="test-option__top"><strong>${escapeHTML(test.name)}</strong>${test.available ? '<span class="status status--success">Disponible</span>' : '<span class="pill pill--soon">Bientôt</span>'}</span>
              <small>${escapeHTML(test.description)}</small>
              ${test.available ? '' : '<em>Ce test n’est pas encore disponible. Son contenu est en préparation avec Aga.</em>'}
            </span>
          </label>`,
        ).join('')}
      </fieldset>

      <label class="field" for="test-message">
        <span class="field__label">Un mot pour le sportif <em>facultatif</em></span>
        <textarea class="field__input field__input--area" id="test-message" name="message" rows="3" maxlength="220" placeholder="Ex. À faire avant notre séance de mardi"></textarea>
      </label>

      <button class="btn btn--primary btn--block btn--lg" type="submit">Attribuer le test ${icon('send', { size: 17 })}</button>
      <p class="fineprint">Le statut évolue ensuite : à faire → envoyé → complété. La réponse du sportif est simulée dans cette démo.</p>
    </form>`,
  };
}
