const LOWERCASE = "abcdefghijkmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%^&*-_=+";
const ALL_CHARS = LOWERCASE + UPPERCASE + DIGITS + SYMBOLS;

/** Cryptographically-secure random index in `[0, max)`, avoiding `Math.random()`. */
function randomIndex(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function randomChar(charset: string): string {
  return charset[randomIndex(charset.length)];
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a random password that satisfies the app's password policy
 * (minimum 8 characters -- see `TeamMember.schema.ts` / `UserForm.schema.ts`)
 * with margin to spare, guaranteeing at least one lowercase, uppercase,
 * digit, and symbol character for a stronger default than the minimum
 * requires.
 */
export function generatePassword(length = 12): string {
  const required = [
    randomChar(LOWERCASE),
    randomChar(UPPERCASE),
    randomChar(DIGITS),
    randomChar(SYMBOLS),
  ];
  const remaining = Array.from({ length: Math.max(length - required.length, 0) }, () =>
    randomChar(ALL_CHARS),
  );

  return shuffle([...required, ...remaining]).join("");
}
