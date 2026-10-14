// Email sign-up. The form posts straight to the provider's hosted endpoint (the site is static).
// Brevo: Contacts → Forms → create a double opt-in form on the "gil-neto.com — new posts" list,
// then paste the form's action URL (https://<id>.sibforms.com/serve/<token>) below.
// While this is empty, <Subscribe /> renders nothing, so the site can deploy before the account exists.
export const SUBSCRIBE_ACTION = "";
