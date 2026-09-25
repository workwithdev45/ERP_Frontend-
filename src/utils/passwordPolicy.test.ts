import { describe, expect, it } from 'vitest';
import { isStrongPassword } from './passwordPolicy';

describe('isStrongPassword', () => {
  it('accepts a password with lowercase, uppercase, digit, symbol and 10+ chars', () => {
    expect(isStrongPassword('Sup3r$ecure')).toBe(true);
  });

  it('rejects a password shorter than 10 characters', () => {
    expect(isStrongPassword('Sh0rt!')).toBe(false);
  });

  it('rejects a password missing an uppercase letter', () => {
    expect(isStrongPassword('nouppercase1!')).toBe(false);
  });

  it('rejects a password missing a symbol', () => {
    expect(isStrongPassword('NoSymbolsHere123')).toBe(false);
  });

  it('rejects an empty password', () => {
    expect(isStrongPassword('')).toBe(false);
  });
});
