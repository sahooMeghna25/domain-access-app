import { ALLOWED_DOMAIN } from '../config';

// Exact domain match: user@hbplus.fit is accepted,
// user@not-hbplus.fit and user@gmail.com are rejected.
export function isAllowedEmail(email = '') {
  const normalizedEmail = email.trim().toLowerCase();
  const parts = normalizedEmail.split('@');

  return (
    parts.length === 2 &&
    parts[0].length > 0 &&
    parts[1] === ALLOWED_DOMAIN
  );
}
