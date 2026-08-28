module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist/client',
      // /pl/ est servi par fallback runtime (rewrite) : non testable en mode
      // statique — /fr/ représente les deux langues (mêmes gabarits).
      url: ['http://localhost:4173/fr/'],
      numberOfRuns: 1,
      // LHCI audite en mobile par défaut (cible de la mission).
    },
    assert: {
      // Cibles de la mission (brief §2) : >= 95 sur les quatre catégories.
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lhci',
    },
  },
};
