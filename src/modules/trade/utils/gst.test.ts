import { describe, expect, it } from 'vitest';
import { computeTotals, isInterState } from './gst';

describe('computeTotals', () => {
  it('splits intra-state GST into CGST + SGST and rounds a bill to the rupee', () => {
    const totals = computeTotals(
      [
        { quantity: 100, rate: 5.2, discountPercent: 0, gstRate: 18 },
        { quantity: 1, rate: 1500, discountPercent: 0, gstRate: 18 },
      ],
      { interState: false, roundToRupee: true },
    );
    expect(totals).toEqual({ taxable: 2020, cgst: 181.8, sgst: 181.8, igst: 0, roundOff: 0.4, total: 2384 });
  });

  it('charges IGST inter-state and applies line discounts', () => {
    const totals = computeTotals(
      [
        { quantity: 5, rate: 4500, discountPercent: 2, gstRate: 18 },
        { quantity: 5, rate: 800, discountPercent: 0, gstRate: 18 },
      ],
      { interState: true, roundToRupee: false },
    );
    expect(totals.taxable).toBe(26050);
    expect(totals.igst).toBe(4689);
    expect(totals.cgst + totals.sgst).toBe(0);
    expect(totals.total).toBe(30739);
  });

  it('leaves GST out of what the vendor is owed under reverse charge', () => {
    const totals = computeTotals([{ quantity: 1, rate: 2000, discountPercent: 0, gstRate: 18 }], {
      interState: false,
      reverseCharge: true,
      roundToRupee: true,
    });
    expect(totals.cgst + totals.sgst).toBe(360);
    expect(totals.total).toBe(2000);
  });
});

describe('isInterState', () => {
  it('compares states case-insensitively and treats a missing party state as in-state', () => {
    expect(isInterState('Maharashtra', 'maharashtra ')).toBe(false);
    expect(isInterState('Maharashtra', 'Gujarat')).toBe(true);
    expect(isInterState('Maharashtra', null)).toBe(false);
  });
});
