import type { ImageMetadata } from 'astro';
import ffaLogo from '../assets/references/FFA_logo_baseline-1-300x127.png';
import kampusLogo from '../assets/references/Kampus-Wavre-Centre-de-kinesitherapie.jpg';
import rosLogo from '../assets/references/ROS-300x300.jpeg';

export interface Reference {
  name: string;
  alt: string;
  src: ImageMetadata;
}

/** Références et collaborations (logos gérés dans le code — actifs de marque). */
export const references: Reference[] = [
  { name: 'ROS', alt: 'Logo ROS', src: rosLogo },
  {
    name: 'Kampus Wavre',
    alt: 'Logo Kampus Wavre — Centre de kinésithérapie',
    src: kampusLogo,
  },
  { name: 'FFA', alt: 'Logo FFA — formation des entraîneurs de football', src: ffaLogo },
];
