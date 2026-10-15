// Email sign-up. The form posts straight to the provider's hosted endpoint (the site is static).
// Brevo: Contacts → Forms → create a double opt-in form on the "gil-neto.com — new posts" list,
// then paste the form's action URL (https://<id>.sibforms.com/serve/<token>) below.
// Set 2026-10-15 from Gil's Brevo form (double opt-in, list "gil-neto.com - new posts"). Fields match its embed: EMAIL, email_address_check (honeypot), locale.
// While this is empty, <Subscribe /> renders nothing, so the site can deploy before the account exists.
export const SUBSCRIBE_ACTION = "https://ef370a33.sibforms.com/serve/MUIFAIjYwYNML--etg_HdKsTIXyk2i-GqiALvCatp3tzbHC3mrd5MPOjhOnfkmeP3Oj2w8Tku4gc6fTz8xSu8jcIznRmae6KJhRIT8wrZRMnK04Jw8sPRW5fZr70jDfd4GMRfNyO2dYhAvcJ9lUfbQSD0n4ThDxWh4RIpukUOC4MMQiHchYTZRVjcsPpPQAd9A_sIBDRJAkTRHDQ_g==";
