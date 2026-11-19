/**
 * Configuration de la démo O’MIND.
 *
 * Pour brancher le futur bouton « Découvrir mon profil 4C » du site
 * optima-mind.com, il suffit de modifier `appBaseUrl` ici (ou de déployer
 * le dossier `prototype/` sur le domaine choisi) puis de pointer le bouton
 * vers : `${appBaseUrl}/?start=quiz`
 *
 * `bookingUrl` : renseigner le lien Cal.com officiel quand il sera fourni.
 * Tant qu’il est vide, le bouton « Réserver un créneau » s’affiche comme
 * un état de démo clairement identifié.
 */
window.OMIND_CONFIG = {
  appBaseUrl: 'https://dev.kryssbee.com/omind',
  siteUrl: 'https://www.optima-mind.com',
  contactEmail: 'aga@optima-mind.com',
  bookingUrl: '',
  quizEntry: '#/test',
  paletteNote:
    'Palette de travail (bleu nuit, cobalt, glacier) à valider avec Aga ; le site actuel utilise un accent cyan.',
};
