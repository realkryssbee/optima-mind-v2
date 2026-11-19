export function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isoDaysAgo(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function toDate(iso) {
  if (!iso) return null;
  if (iso.length === 10) return new Date(`${iso}T12:00:00`);
  return new Date(iso);
}

export function formatDate(iso, options = {}) {
  const date = toDate(iso);
  if (!date || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-BE', {
    day: 'numeric',
    month: 'long',
    ...options,
  }).format(date);
}

export function formatMonth(iso) {
  return formatDate(iso, { month: 'long' });
}

export function weekdayShort(iso) {
  const date = toDate(iso);
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-BE', { weekday: 'short' }).format(date).replace('.', '');
}

export function dayNumber(iso) {
  const date = toDate(iso);
  if (!date) return '';
  return String(date.getDate());
}

export function relativeTime(iso) {
  const date = toDate(iso);
  if (!date) return '';
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'à l’instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days} j`;
  return formatDate(iso);
}

export function dateTimeNowLabel() {
  return new Intl.DateTimeFormat('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

export function capitalize(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Ordre des 7 derniers jours, du plus ancien à aujourd’hui. */
export function lastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => isoDaysAgo(6 - index));
}
