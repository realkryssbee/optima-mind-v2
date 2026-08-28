/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_ANALYTICS_DOMAIN?: string;
  readonly OAUTH_GITHUB_CLIENT_ID?: string;
  readonly OAUTH_GITHUB_CLIENT_SECRET?: string;
  readonly PUBLIC_DECAP_CMS_VERSION?: string;
  readonly BREVO_API_KEY?: string;
  readonly BREVO_SENDER_EMAIL?: string;
  readonly BREVO_SENDER_NAME?: string;
  readonly BREVO_LIST_ID?: string;
  readonly CONTACT_RECIPIENT_EMAIL?: string;
  readonly UPSTASH_REDIS_REST_URL?: string;
  readonly UPSTASH_REDIS_REST_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
