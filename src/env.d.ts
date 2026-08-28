/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly BOOKING_CAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
