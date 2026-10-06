import { describe, expect, it } from 'vitest';
import { amountInWords } from './amountInWords';

describe('amountInWords', () => {
  it('handles zero and small amounts', () => {
    expect(amountInWords(0)).toBe('Indian Rupees Zero Only');
    expect(amountInWords(15)).toBe('Indian Rupees Fifteen Only');
    expect(amountInWords(90)).toBe('Indian Rupees Ninety Only');
  });

  it('uses the Indian lakh and crore grouping', () => {
    expect(amountInWords(1_250)).toBe('Indian Rupees One Thousand Two Hundred Fifty Only');
    expect(amountInWords(1_00_000)).toBe('Indian Rupees One Lakh Only');
    expect(amountInWords(12_34_567)).toBe('Indian Rupees Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Only');
    expect(amountInWords(5_00_00_001)).toBe('Indian Rupees Five Crore One Only');
  });

  it('adds paise and rounds to the nearest paisa', () => {
    expect(amountInWords(1250.5)).toBe('Indian Rupees One Thousand Two Hundred Fifty and Fifty Paise Only');
    expect(amountInWords(99.999)).toBe('Indian Rupees One Hundred Only');
  });
});
