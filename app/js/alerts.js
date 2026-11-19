/** Seuil d'alerte : écart minimal, en points, entre les 5 derniers jours et les 4 semaines précédentes. */
export const ALERT_DROP_THRESHOLD = 2;

export const ALERT_WINDOW_DAYS = 5;
export const ALERT_BASELINE_DAYS = 28;

const MEASURES = [
  { key: 'energy', label: 'énergie' },
  { key: 'sleep', label: 'sommeil' },
  { key: 'mood', label: 'humeur' },
];

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function listLabels(labels) {
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} et ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')} et ${labels[labels.length - 1]}`;
}

/**
 * Compare le sportif à ses propres habitudes : moyenne des 5 derniers check-ins
 * contre la moyenne des 4 semaines qui les précèdent. Aucun seuil externe.
 */
export function buildAlert(athlete) {
  const checkins = [...(athlete?.checkins ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  if (checkins.length < ALERT_WINDOW_DAYS + 7) return null;

  const recent = checkins.slice(-ALERT_WINDOW_DAYS);
  const baseline = checkins.slice(
    Math.max(0, checkins.length - ALERT_WINDOW_DAYS - ALERT_BASELINE_DAYS),
    -ALERT_WINDOW_DAYS,
  );
  if (baseline.length < 7) return null;

  const measures = MEASURES.map((measure) => {
    const recentAverage = average(recent.map((entry) => entry[measure.key]));
    const baselineAverage = average(baseline.map((entry) => entry[measure.key]));
    return {
      ...measure,
      recentAverage,
      baselineAverage,
      drop: baselineAverage - recentAverage,
    };
  }).filter((measure) => measure.drop >= ALERT_DROP_THRESHOLD);

  if (!measures.length) return null;
  const labels = measures.map((measure) => measure.label);
  return {
    athleteId: athlete.id,
    firstName: athlete.firstName,
    measures,
    labels,
    text: `${athlete.firstName} — ${listLabels(labels)} en baisse depuis ${ALERT_WINDOW_DAYS} jours par rapport à ses habitudes`,
    recent,
    baselineCount: baseline.length,
    windowDays: ALERT_WINDOW_DAYS,
  };
}

export function buildAlerts(athletes) {
  return athletes.map(buildAlert).filter(Boolean);
}

export function alertMeasureLabel(alert) {
  return listLabels(alert.labels);
}
