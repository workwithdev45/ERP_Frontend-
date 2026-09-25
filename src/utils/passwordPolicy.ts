export const MIN_PASSWORD_LENGTH = 10;

const HAS_LOWER = /[a-z]/;
const HAS_UPPER = /[A-Z]/;
const HAS_NUMBER = /\d/;
const HAS_SYMBOL = /[^A-Za-z0-9]/;

export const PASSWORD_POLICY_HINT =
  'At least 10 characters, with an uppercase letter, a lowercase letter, a number, and a symbol.';

/** Mirrors the backend's @StrongPassword rule (G9) so the form never accepts something the API will reject. */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    HAS_LOWER.test(password) &&
    HAS_UPPER.test(password) &&
    HAS_NUMBER.test(password) &&
    HAS_SYMBOL.test(password)
  );
}

export function passwordStrengthScore(password: string): number {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (HAS_LOWER.test(password) && HAS_UPPER.test(password)) score += 1;
  if (HAS_NUMBER.test(password)) score += 1;
  if (HAS_SYMBOL.test(password)) score += 1;
  return score;
}
