// Génère public/og-default.png (1200×630) depuis public/og-default.svg.
// Les images OG dynamiques par page arrivent à l'incrément 6 (@vercel/og).
import sharp from 'sharp';

await sharp('public/og-default.svg').png().toFile('public/og-default.png');
console.log('public/og-default.png generated');
