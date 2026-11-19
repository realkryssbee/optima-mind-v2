import { formatScore } from '../scoring.js?v=7';
import { formatDate } from '../utils.js?v=7';

const PERIODS = [7, 14, 30];
let currentPeriod = 14;

export function getChartPeriod() {
  return currentPeriod;
}

export function setChartPeriod(value) {
  const period = Number(value);
  if (PERIODS.includes(period)) currentPeriod = period;
  return currentPeriod;
}

const SERIES = [
  { key: 'sleep', label: 'Sommeil', color: '#174CE0', dash: '', marker: 'circle' },
  { key: 'energy', label: 'Énergie', color: '#0E7490', dash: '7 4', marker: 'square' },
  { key: 'mood', label: 'Humeur', color: '#9A5B00', dash: '2 4', marker: 'triangle' },
];

function average(rows, key) {
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0) / rows.length;
}

function xFor(index, count, left, width) {
  return count <= 1 ? left + width / 2 : left + (index / (count - 1)) * width;
}

function yFor(value, top, height) {
  return top + (1 - (value - 1) / 9) * height;
}

function markerShape(marker, x, y, color) {
  if (marker === 'square') {
    return `<rect x="${x - 2.8}" y="${y - 2.8}" width="5.6" height="5.6" rx="1" fill="${color}" />`;
  }
  if (marker === 'triangle') {
    return `<path d="M${x} ${y - 3.4}L${x + 3.2} ${y + 2.6}L${x - 3.2} ${y + 2.6}Z" fill="${color}" />`;
  }
  return `<circle cx="${x}" cy="${y}" r="2.6" fill="${color}" />`;
}

function legendMark(dash, color) {
  return `<svg class="chart-legend__mark" viewBox="0 0 24 8" aria-hidden="true" focusable="false">
    <line x1="1" y1="4" x2="23" y2="4" stroke="${color}" stroke-width="2" ${dash ? `stroke-dasharray="${dash}"` : ''} />
  </svg>`;
}

function seriesAverages(rows) {
  return SERIES.map((series) => {
    const value = average(rows, series.key);
    return {
      ...series,
      average: value,
      text: `${series.label} ${formatScore(value)}/10`,
    };
  });
}

function accessibleTable(rows) {
  return `<table class="sr-only">
    <caption>Valeurs du suivi sur la période affichée</caption>
    <thead><tr><th>Date</th><th>Sommeil</th><th>Énergie</th><th>Humeur</th></tr></thead>
    <tbody>${rows
      .map(
        (row) =>
          `<tr><td>${formatDate(row.date)}</td><td>${row.sleep}</td><td>${row.energy}</td><td>${row.mood}</td></tr>`,
      )
      .join('')}</tbody>
  </table>`;
}

/**
 * Graphique SVG des trois mesures, une ligne par mesure, avec période 7/14/30.
 * Aucune bibliothèque : tout est dessiné en SVG.
 */
export function checkinChart(checkins, { focus = null } = {}) {
  const rows = [...checkins]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-currentPeriod);
  const count = rows.length;
  const width = 340;
  const height = 214;
  const left = 28;
  const right = 12;
  const top = 20;
  const bottom = 30;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const averages = seriesAverages(rows);
  const summary = averages.map((item) => `${item.text.replace('/10', ' sur 10')}`).join(', ');
  const focusStart = focus === 'alert' && count ? Math.max(0, count - 5) : null;

  const grids = [1, 5, 10]
    .map((value) => {
      const y = yFor(value, top, plotHeight);
      return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="chart-grid" />
        <text x="${left - 7}" y="${y + 4}" class="chart-axis" text-anchor="end">${value}</text>`;
    })
    .join('');

  const ticks = [...new Set([0, Math.floor((count - 1) / 2), count - 1].filter((index) => index >= 0))];
  const xLabels = ticks
    .map((index) => {
      const x = xFor(index, count, left, plotWidth);
      return `<text x="${x}" y="${height - 8}" class="chart-axis" text-anchor="${index === 0 ? 'start' : index === count - 1 ? 'end' : 'middle'}">J${index + 1}</text>`;
    })
    .join('');

  const focusBand = focusStart != null
    ? `<rect x="${xFor(focusStart, count, left, plotWidth) - 6}" y="${top - 2}" width="${width - right - xFor(focusStart, count, left, plotWidth) + 6}" height="${plotHeight + 4}" class="chart-focus" />
      <text x="${xFor(focusStart, count, left, plotWidth) + 4}" y="${top + 12}" class="chart-focus-label">5 derniers jours</text>`
    : '';

  const lines = SERIES.map((series) => {
    const points = rows
      .map((row, index) => {
        const x = xFor(index, count, left, plotWidth);
        const y = yFor(Number(row[series.key] ?? 1), top, plotHeight);
        return `${x},${y}`;
      })
      .join(' ');
    return `<polyline points="${points}" fill="none" stroke="${series.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" ${series.dash ? `stroke-dasharray="${series.dash}"` : ''} />`;
  }).join('');

  const markers = SERIES.map((series) =>
    rows
      .map((row, index) => {
        const x = xFor(index, count, left, plotWidth);
        const y = yFor(Number(row[series.key] ?? 1), top, plotHeight);
        return markerShape(series.marker, x, y, series.color);
      })
      .join(''),
  ).join('');

  return `<div class="chart-panel" data-chart="checkins">
    <div class="chart-periods" role="group" aria-label="Période du suivi">
      ${PERIODS.map(
        (period) =>
          `<button class="chart-period ${currentPeriod === period ? 'is-active' : ''}" type="button" data-action="chart-period" data-period="${period}" aria-pressed="${currentPeriod === period}">${period} j</button>`,
      ).join('')}
    </div>
    ${
      count
        ? `<div class="chart-graphic">
            <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Suivi sur ${count} jours : ${summary}. ${focus === 'alert' ? 'Les cinq derniers jours sont mis en évidence.' : ''}">
              <title>Suivi du sommeil, de l’énergie et de l’humeur sur ${count} jours</title>
              ${grids}
              ${focusBand}
              ${lines}
              ${markers}
              ${xLabels}
            </svg>
          </div>`
        : `<div class="chart-empty">Pas encore assez de bilans pour afficher la courbe.</div>`
    }
    <div class="chart-legend" aria-label="Légende du graphique">
      ${SERIES.map(
        (series) => `<span class="chart-legend__item">${legendMark(series.dash, series.color)}${series.label}</span>`,
      ).join('')}
    </div>
    <p class="chart-averages">${averages.map((item) => `<span>${item.label} <strong>${formatScore(item.average)}/10</strong></span>`).join('<span class="chart-averages__sep" aria-hidden="true">·</span>')}</p>
    ${focus === 'alert' ? `<p class="chart-focus-note">La période mise en évidence correspond aux 5 derniers jours comparés aux habitudes du sportif.</p>` : ''}
    ${accessibleTable(rows)}
    <p class="chart-note">Données fictives, utilisées pour illustrer le suivi.</p>
  </div>`;
}

export function alertSparkline(checkins, measure = 'energy', days = 14) {
  const rows = [...checkins].sort((a, b) => a.date.localeCompare(b.date)).slice(-days);
  if (rows.length < 2) return '';
  const width = 120;
  const height = 38;
  const pad = 4;
  const points = rows
    .map((row, index) => {
      const x = pad + (index / (rows.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (Number(row[measure] ?? 1) - 1) / 9) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');
  return `<svg class="alert-spark" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">
    <polyline points="${points}" fill="none" stroke="#B42318" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
}
