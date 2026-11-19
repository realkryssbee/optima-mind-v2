const META_KEY = 'omind-docs-v1';
const DB_NAME = 'omind-documents';
const STORE = 'files';
const MAX_BYTES = 10 * 1024 * 1024;

function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMeta(docs) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(docs));
  } catch {
    /* ignore */
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putBlob(key, blob) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getBlob(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(key);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

function validateFile(file) {
  if (!file) throw new Error('Aucun fichier sélectionné');
  const isPdf =
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) throw new Error('Le document doit être un PDF');
  if (file.size > MAX_BYTES) throw new Error('Le PDF dépasse 10 Mo');
}

function docFor(docId) {
  return documents.find((doc) => doc.id === docId) ?? null;
}

let documents = loadMeta();

export function listAll() {
  return [...documents].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listForAthlete(athleteId, { as = 'coach' } = {}) {
  return listAll().filter((doc) => {
    if (doc.athleteId !== athleteId) return false;
    if (as === 'coach') return true;
    return doc.sharedVersion != null;
  });
}

export function get(docId) {
  return docFor(docId);
}

export async function create(athleteId, file, { name, date } = {}) {
  validateFile(file);
  const doc = {
    id: uid('doc'),
    athleteId,
    name: (name || file.name.replace(/\.pdf$/i, '')).trim().slice(0, 90),
    date: date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    versions: [],
    sharedVersion: null,
    sharedAt: null,
  };
  doc.versions.push({
    version: 1,
    fileName: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  });
  await putBlob(`${doc.id}:1`, file);
  documents.unshift(doc);
  saveMeta(documents);
  return doc;
}

export async function addVersion(docId, file) {
  validateFile(file);
  const doc = docFor(docId);
  if (!doc) throw new Error('Document introuvable');
  const version = doc.versions.length + 1;
  await putBlob(`${doc.id}:${version}`, file);
  doc.versions.push({
    version,
    fileName: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  });
  saveMeta(documents);
  return doc;
}

export function update(docId, patch) {
  const doc = docFor(docId);
  if (!doc) return null;
  if (patch.name != null) doc.name = String(patch.name).trim().slice(0, 90);
  if (patch.date != null) doc.date = patch.date;
  saveMeta(documents);
  return doc;
}

export function setShared(docId, shared, version = null) {
  const doc = docFor(docId);
  if (!doc) return null;
  doc.sharedVersion = shared
    ? version ?? doc.versions[doc.versions.length - 1].version
    : null;
  doc.sharedAt = shared ? new Date().toISOString() : null;
  saveMeta(documents);
  return doc;
}

export function remove(docId) {
  documents = documents.filter((doc) => doc.id !== docId);
  saveMeta(documents);
}

export function canOpen(doc, version, actor) {
  if (!doc) return false;
  if (actor === 'coach') return true;
  return doc.athleteId === actor && doc.sharedVersion != null && doc.sharedVersion === version;
}

export async function blobFor(docId, version, actor) {
  const doc = docFor(docId);
  if (!doc || !canOpen(doc, version, actor)) throw new Error('Accès au document refusé');
  const blob = await getBlob(`${docId}:${version}`);
  if (!blob) throw new Error('Fichier introuvable');
  return blob;
}

export async function openInTab(docId, version, actor) {
  const blob = await blobFor(docId, version, actor);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export async function download(docId, version, actor) {
  const doc = docFor(docId);
  const blob = await blobFor(docId, version, actor);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${doc.name.replace(/[^\w\s-]/g, '').trim() || 'profil'}-v${version}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function createSamplePdf(athleteName, sport) {
  const lines = [
    `Profil mental - ${athleteName}`,
    `${sport}`,
    '',
    'Document de demonstration redige par Aga.',
    'Ce PDF fictif sert a tester le depot, le partage',
    'et l historique des versions dans O MIND.',
    '',
    'Points de travail :',
    '- revenir dans l action apres une erreur',
    '- respiration et routine de recentrage',
    '- confiance dans les moments cles',
    '',
    'Optima Mind - Wroclaw / Wavre',
  ].map((line) => line.replace(/[^\x20-\x7E]/g, '-'));
  const escape = (text) => text.replace(/([()\\])/g, '\\$1');
  const content = [
    'BT',
    '/F1 22 Tf',
    '60 780 Td',
    `(${escape(lines[0])}) Tj`,
    '/F1 12 Tf',
    '0 -28 Td',
    ...lines.slice(1).map((line) => (line ? `(${escape(line)}) Tj 0 -18 Td` : '0 -10 Td')),
    'ET',
  ].join('\n');

  const objects = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  objects.push(
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  );
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}
