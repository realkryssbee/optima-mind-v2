import type { ImageMetadata } from 'astro';

/**
 * Résolution des images uploadées via Decap CMS (media_folder :
 * `src/assets/uploads`). Le contenu stocke le chemin publié
 * (`/src/assets/uploads/…`) ; on retrouve le module image correspondant
 * pour bénéficier de l'optimisation Astro (AVIF/WebP, srcset, lazy).
 */
const uploads = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  { eager: true },
);

export function resolveUpload(path: string | null | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const normalized = path.replace(/^\//, '');
  const key = Object.keys(uploads).find((k) => k.replace(/^\//, '') === normalized);
  return key ? uploads[key]?.default : undefined;
}
