import sharp from 'sharp';
import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '../../lib/site';

/**
 * Images OG générées au build : template SVG (palette de la marque) +
 * rasterisation sharp. Robuste partout (aucune dépendance runtime),
 * polices système avec couverture latin-ext pour le polonais.
 */

const PAGES = {
  accueil: 'Coach mental pour sportif et entreprises Wavre',
  sportifs: 'Préparation mentale du sportif',
  entreprises: 'Coaching performance en entreprise',
  apropos: 'Agnieszka Orchowska — coach en préparation mentale',
  contact: 'Contact — Optima Mind',
  'mentions-legales': 'Mentions légales',
  'politique-de-confidentialite': 'Politique de confidentialité',
  'prise-de-rendez-vous': 'Prendre rendez-vous',
} as const;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(PAGES).map((slug) => ({ params: { slug } }));

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** Découpe le titre en lignes d'au plus ~28 caractères (mots conservés). */
function wrapTitle(title: string, maxChars = 28): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 3);
}

function buildSvg(title: string): string {
  const lines = wrapTitle(title);
  const fontSize = lines.length > 1 ? 54 : 64;
  const lineHeight = Math.round(fontSize * 1.25);
  const startY = 350 - ((lines.length - 1) * lineHeight) / 2;
  const textLines = lines
    .map(
      (line, i) =>
        `<text x="90" y="${startY + i * lineHeight}" font-size="${fontSize}" font-weight="700" fill="#FFFFFF" font-family="Montserrat, 'Segoe UI', Arial, sans-serif">${escapeXml(line)}</text>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00B2E7"/>
      <stop offset="1" stop-color="#0A5C73"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1040" cy="90" r="180" fill="#FFFFFF" opacity="0.10"/>
  <circle cx="150" cy="600" r="120" fill="#FFFFFF" opacity="0.08"/>
  <path d="M90 60 L210 60 L210 80 L90 80 Z" fill="#FFFFFF" opacity="0.9"/>
  <text x="90" y="140" font-size="26" letter-spacing="6" font-weight="600" fill="#FFFFFF" opacity="0.92" font-family="Montserrat, 'Segoe UI', Arial, sans-serif">OPTIMA MIND — WAVRE, BELGIQUE</text>
  ${textLines}
</svg>`;
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug ?? 'accueil';
  const title = PAGES[slug as keyof typeof PAGES] ?? SITE.name;
  const png = await sharp(Buffer.from(buildSvg(title)))
    .png()
    .toBuffer();

  return new Response(png, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
