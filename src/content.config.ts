import { defineCollection, z } from 'astro:content';

/**
 * Modèle de contenu (étape 0 validée).
 * Ces schémas sont le contrat entre Decap CMS (admin/config.yml) et les
 * pages : Decap ne peut pas publier d'entrée invalide (validation au build).
 * Multilingue : une entrée par langue (fichiers `*.fr.md` / `*.pl.md`).
 */

const heroSchema = z.object({
  eyebrow: z.string().optional().default(''),
  title: z.string().optional(),
  lead: z.string().optional(),
  intro: z.string().optional(),
});

const seoSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
});

const ctaSchema = z.object({
  title: z.string().optional(),
  lead: z.string().optional(),
});

const listItemSchema = z.object({
  title: z.string().optional(),
  eyebrow: z.string().optional(),
  text: z.string().optional(),
  link: z
    .object({
      label: z.string().optional(),
      href: z.string().optional(),
    })
    .optional(),
});

const offerSchema = z.object({
  title: z.string(),
  intro: z.string(),
  items: z.array(z.string()),
});

const paragraphsSchema = z.object({
  title: z.string(),
  paragraphs: z.array(z.string()),
});

const settingsSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  legalStatus: z.string(),
  bce: z.string(),
  address: z.object({
    street: z.string(),
    zip: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  geo: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  phone: z.string(),
  email: z.string().email(),
  rgpdEmail: z.string().email(),
  openingHours: z.string(),
  social: z
    .object({
      facebook: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      instagram: z.string().url().optional(),
    })
    .optional(),
  seoDefaults: z.object({
    title: z.string().max(60),
    description: z.string().max(160),
  }),
  booking: z.object({
    calUrl: z.union([z.string().url(), z.literal('')]).optional(),
    note: z.string().optional(),
  }),
  lieux: z
    .array(
      z.object({
        name: z.string(),
        address: z.string(),
      }),
    )
    .optional(),
});

const pageSchema = z.object({
  /** Type de page — détermine quels champs afficher dans l'éditeur Decap. */
  pageType: z.enum([
    'home',
    'sportifs',
    'entreprises',
    'apropos',
    'contact',
    'mentions',
    'privacy',
    'rdv',
  ]),
  title: z.string(),
  hero: heroSchema.optional(),
  valueProp: z.string().optional(),
  univers: z.array(listItemSchema).optional(),
  aboutTeaser: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  featuredTestimonials: z.array(z.string()).optional(),
  showReferences: z.boolean().optional(),
  quote: z
    .object({
      text: z.string(),
      source: z.string(),
    })
    .optional(),
  enjeux: z
    .object({
      title: z.string(),
      items: z.array(z.string()),
    })
    .optional(),
  offers: z.array(offerSchema).optional(),
  testimonials: z.array(z.string()).optional(),
  benefices: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      items: z.array(z.string()),
    })
    .optional(),
  mission: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  publicCible: z
    .object({
      title: z.string(),
      items: z.array(z.string()),
    })
    .optional(),
  thematiques: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      items: z.array(z.string()),
    })
    .optional(),
  sections: z.array(paragraphsSchema).optional(),
  formations: z
    .object({
      title: z.string(),
      groups: z.array(
        z.object({
          name: z.string(),
          items: z.array(z.string()),
        }),
      ),
    })
    .optional(),
  cta: ctaSchema.optional(),
  seo: seoSchema.optional(),
  updatedAt: z.string().optional(),
});

const testimonialSchema = z.object({
  author: z.string(),
  role: z.string().optional(),
  photo: z.string().optional(),
  quote: z.string(),
  category: z.enum(['sport', 'entreprise']),
  featured: z.boolean().optional(),
  consent: z.boolean(),
  publishedAt: z.string().optional(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.enum(['sportifs', 'entreprises', 'general']).optional(),
});

const blogPostSchema = z.object({
  title: z.string(),
  /** Identifiant d'URL (non traduit) — ex. « routine-de-performance ». */
  slug: z.string(),
  excerpt: z.string().optional(),
  cover: z.string().optional(),
  publishedAt: z.string(),
  draft: z.boolean().optional(),
  seo: seoSchema.optional(),
});

export const collections = {
  settings: defineCollection({ type: 'content', schema: settingsSchema }),
  pages: defineCollection({ type: 'content', schema: pageSchema }),
  testimonials: defineCollection({ type: 'content', schema: testimonialSchema }),
  faq: defineCollection({ type: 'content', schema: faqSchema }),
  blog: defineCollection({ type: 'content', schema: blogPostSchema }),
};

export type Settings = z.infer<typeof settingsSchema>;
export type Page = z.infer<typeof pageSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
