const paths = {
  back: '<path d="M15 18l-6-6 6-6"/>',
  next: '<path d="M9 18l6-6-6-6"/>',
  arrowRight: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17L17 7M8 7h9v9"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="M8 14h2M14 14h2M8 17.5h2"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.7-3.5 3.6-5.6 7.2-5.6s6.5 2.1 7.2 5.6"/>',
  users:
    '<circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><path d="M16 5.4a3.2 3.2 0 010 5.5M17.5 14.8c2 .6 3.2 2.2 3.5 4.7"/>',
  layers:
    '<path d="M12 3.8l8.2 4.4L12 12.6 3.8 8.2 12 3.8z"/><path d="M3.8 12.4L12 16.8l8.2-4.4M3.8 16.4L12 20.8l8.2-4.4"/>',
  home: '<path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"/>',
  clipboard:
    '<rect x="5" y="4.5" width="14" height="16" rx="2.5"/><path d="M9 4.5V3.8A1.3 1.3 0 0110.3 2.5h3.4A1.3 1.3 0 0115 3.8v.7"/><path d="M9 11h6M9 15h4"/>',
  library:
    '<path d="M4 5.5A1.5 1.5 0 015.5 4H9v16H5.5A1.5 1.5 0 014 18.5v-13z"/><path d="M9 4h5v16H9M17.5 4H19a1 1 0 011 1v14a1 1 0 01-1 1h-1.5V4z"/>',
  play: '<path d="M8 5.5l10 6.5-10 6.5v-13z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" stroke="none"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  share:
    '<circle cx="6" cy="12" r="2.6"/><circle cx="17.5" cy="6" r="2.6"/><circle cx="17.5" cy="18" r="2.6"/><path d="M8.4 10.8l6.8-3.6M8.4 13.2l6.8 3.6"/>',
  reset:
    '<path d="M4.5 10.5A8 8 0 1112 20a8 8 0 01-6.6-3.5"/><path d="M4 4.5v6h6"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  chevronRight: '<path d="M9 6l6 6-6 6"/>',
  wind: '<path d="M3 8h10a3 3 0 10-3-3M3 12h14a3 3 0 11-3 3M3 16h7a2.5 2.5 0 11-2.5 2.5"/>',
  headphones:
    '<path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/>',
  video:
    '<rect x="3" y="5.5" width="12.5" height="13" rx="2.5"/><path d="M15.5 10l5-3v10l-5-3"/>',
  audio: '<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>',
  sound: '<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16.2 16.2L21 21"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  bolt: '<path d="M13.5 3L5 13.5h6L10.5 21 19 10.5h-6L13.5 3z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>',
  trend: '<path d="M4 17l5-5 3.5 3.5L20 7"/><path d="M15 7h5v5"/>',
  message: '<path d="M4 5.5h16v11H9l-5 4v-15z"/><path d="M8 9.5h8M8 12.5h5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  send: '<path d="M21 3L10.5 13.5M21 3l-7 18-3.5-7.5L3 10l18-7z"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6M20 16V6"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 018 0v3"/>',
  external: '<path d="M14 4h6v6M20 4l-8 8"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  quote: '<path d="M9 7H5v5h4c0 2.5-1.2 4-4 4.5M19 7h-4v5h4c0 2.5-1.2 4-4 4.5"/>',
  mood: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5s1.3 2 3.5 2 3.5-2 3.5-2"/><path d="M9 9.5h.01M15 9.5h.01"/>',
};

export function icon(name, { size = 20, stroke = 1.8, className = '' } = {}) {
  const body = paths[name] ?? paths.info;
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

export function wordmark(classNames = '') {
  return `<span class="wordmark ${classNames}" aria-label="O’MIND">O’MIND</span>`;
}
