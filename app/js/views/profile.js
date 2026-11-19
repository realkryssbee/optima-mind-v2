import { STATUS } from '../data.js';
import { escapeHTML, formatDate, relativeTime, todayISO } from '../utils.js';
import { icon } from '../ui/icons.js';
import { avatar, scoreRows, statusChip, tabbar } from '../ui/components.js';

function checkinRow(checkin) {
  const isToday = checkin.date === todayISO();
  return `<li class="bilan-row">
    <div class="bilan-row__date">
      <strong>${isToday ? 'Aujourd’hui' : relativeTime(`${checkin.date}T12:00:00`)}</strong>
      <small>${formatDate(checkin.date, { day: 'numeric', month: 'short' })}</small>
    </div>
    <div class="bilan-row__values" aria-label="Humeur ${checkin.mood} sur 10, énergie ${checkin.energy} sur 10, sommeil ${checkin.sleep} sur 10">
      <span><em>H</em>${checkin.mood}</span>
      <span><em>É</em>${checkin.energy}</span>
      <span><em>S</em>${checkin.sleep}</span>
    </div>
    ${checkin.word ? `<span class="bilan-row__word">${escapeHTML(checkin.word)}</span>` : '<span class="bilan-row__word bilan-row__word--empty">—</span>'}
  </li>`;
}

export function profileView({ athlete, state }) {
  const profile = athlete.profile;
  const assignment = athlete.assignment;
  const assignmentStatus = assignment?.status ?? null;
  const checkins = [...athlete.checkins].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const config = window.OMIND_CONFIG ?? {};
  const siteUrl = config.siteUrl ?? 'https://www.optima-mind.com';

  return `<div class="profile">
    <header class="simple-header">
      <div>
        <p class="eyebrow">Mon espace</p>
        <h1 class="display display--page" id="view-title">Profil</h1>
      </div>
      <a class="simple-header__avatar" href="#/espace/profil" aria-label="Profil de ${athlete.firstName}">${athlete.initials}</a>
    </header>

    <div class="profile__body">
      <section class="identity-card" aria-label="Identité">
        ${avatar(athlete, { size: 'lg' })}
        <div class="identity-card__copy">
          <h2>${athlete.name}</h2>
          <p>${athlete.sport} · ${athlete.club}</p>
          <div class="identity-card__chips">
            <span class="chip">${athlete.age} ans</span>
            <span class="chip">Suivie depuis ${athlete.since}</span>
            ${athlete.demoAccount ? '<span class="chip chip--demo">Compte démo</span>' : ''}
          </div>
        </div>
      </section>

      <section class="profile-block" aria-labelledby="profile-4c-title">
        <div class="navy-card">
          <div class="navy-card__head">
            <div>
              <p class="eyebrow eyebrow--ice">Autoévaluation</p>
              <h2 class="display display--card" id="profile-4c-title">Mon profil 4C</h2>
            </div>
            ${profile ? `<span class="pill pill--glass">${profile.sample ? 'Exemple' : 'À jour'}</span>` : ''}
          </div>
          ${scoreRows(profile)}
          ${profile
            ? `<div class="navy-card__foot">
                <span>${profile.completedAt ? `Passé le ${formatDate(profile.completedAt, { year: 'numeric' })}` : ''}</span>
                <a class="navy-card__link" href="#/resultat">Comprendre mon profil ${icon('arrowRight', { size: 14 })}</a>
              </div>`
            : `<div class="navy-card__foot">
                <span>Questionnaire non complété</span>
                <button class="navy-card__link" data-action="start-test" type="button">Commencer ${icon('arrowRight', { size: 14 })}</button>
              </div>`}
        </div>
      </section>

      <section class="profile-block" aria-labelledby="bilans-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Suivi quotidien</p>
            <h2 class="display display--sm" id="bilans-title">Mes derniers bilans</h2>
          </div>
          <a class="text-link text-link--small" href="#/aujourdhui">Ajouter ${icon('plus', { size: 13 })}</a>
        </div>
        ${checkins.length
          ? `<ul class="bilan-list">
              ${checkins.map(checkinRow).join('')}
            </ul>`
          : `<div class="empty empty--light">
              <span class="empty__icon">${icon('calendar', { size: 22 })}</span>
              <p class="empty__title">Aucun bilan pour l’instant</p>
              <p class="empty__text">Ton premier check-in prendra moins d’une minute.</p>
              <a class="btn btn--outline" href="#/aujourdhui">Faire mon bilan</a>
            </div>`}
      </section>

      <section class="profile-block" aria-labelledby="questionnaire-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Questionnaire</p>
            <h2 class="display display--sm" id="questionnaire-title">Mon 4C</h2>
          </div>
          ${assignment ? statusChip(assignmentStatus) : ''}
        </div>
        <div class="program-card">
          <span class="program-card__icon">${icon('clipboard', { size: 20 })}</span>
          <div class="program-card__copy">
            <span class="program-card__eyebrow">Profil 4C</span>
            <strong>${assignment ? (assignmentStatus === 'completed' ? 'Questionnaire complété' : 'Questionnaire attribué par Aga') : 'Questionnaire à découvrir'}</strong>
            <small>${assignment?.completedAt ? `Reçu le ${formatDate(assignment.completedAt, { year: 'numeric' })}` : '20 affirmations · 2 minutes · sans email'}</small>
          </div>
          ${assignmentStatus === 'completed' && profile
            ? `<a class="program-card__action" href="#/resultat">Voir</a>`
            : `<button class="program-card__action" data-action="start-test" type="button">${assignmentStatus === 'in_progress' ? 'Reprendre' : 'Commencer'}</button>`}
        </div>
      </section>

      <section class="demo-zone" aria-labelledby="demo-title">
        <div class="demo-zone__head">
          <span class="pill pill--demo">Démo</span>
          <h2 id="demo-title">Comptes et données simulés</h2>
        </div>
        <p>Cette démonstration contient deux comptes sportifs (Léa et Malik) et un espace coach (Aga). Chaque compte a son profil 4C, ses bilans et ses ressources. Les actions sont enregistrées localement sur cet appareil.</p>
        <div class="demo-zone__actions">
          <a class="btn btn--outline" href="#/coach">Ouvrir l’espace Aga ${icon('arrowRight', { size: 16 })}</a>
          <button class="btn btn--ghost" data-action="reset-demo" type="button">${icon('reset', { size: 16 })} Réinitialiser</button>
        </div>
        <div class="account-switch" role="group" aria-label="Changer de compte sportif">
          <span>Changer de compte</span>
          <div>
            <a href="#/aujourdhui" data-role-link="lea" class="${athlete.id === 'lea' ? 'is-active' : ''}">Léa</a>
            <a href="#/aujourdhui" data-role-link="malik" class="${athlete.id === 'malik' ? 'is-active' : ''}">Malik</a>
          </div>
        </div>
        <a class="site-link site-link--footer" href="${siteUrl}" target="_blank" rel="noopener noreferrer">Retour à optima-mind.com ${icon('external', { size: 13 })}</a>
      </section>
    </div>

    ${tabbar('profile')}
  </div>`;
}

