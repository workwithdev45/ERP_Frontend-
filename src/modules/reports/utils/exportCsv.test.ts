import { describe, expect, it } from 'vitest';
import { toCsv } from './exportCsv';

describe('toCsv', () => {
  it('quotes cells containing commas, quotes or newlines and leaves blanks for nulls', () => {
    expect(toCsv(['Party', 'Total'], [['Shree Agro, Nashik', 1027], ['Say "hi"', null]])).toBe(
      'Party,Total\r\n"Shree Agro, Nashik",1027\r\n"Say ""hi""",',
    );
  });
});
