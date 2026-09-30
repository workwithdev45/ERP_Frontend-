/**
 * Client-side mirror of the backend's DocumentEngine.recalculate, so forms can show live totals.
 * The server recomputes everything on save; these figures are only a preview.
 */
export interface GstLineInput {
  quantity: number;
  rate: number;
  discountPercent: number;
  gstRate: number;
}

export interface GstTotals {
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  total: number;
}

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function lineTaxable(line: GstLineInput): number {
  const gross = line.rate * line.quantity;
  return round2(gross - round2((gross * line.discountPercent) / 100));
}

export function computeTotals(
  lines: GstLineInput[],
  options: { interState: boolean; reverseCharge?: boolean; roundToRupee: boolean },
): GstTotals {
  let taxable = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  for (const line of lines) {
    const lineValue = lineTaxable(line);
    const tax = round2((lineValue * line.gstRate) / 100);
    taxable += lineValue;
    if (options.interState) {
      igst += tax;
    } else {
      const half = round2(tax / 2);
      cgst += half;
      sgst += round2(tax - half);
    }
  }
  taxable = round2(taxable);
  cgst = round2(cgst);
  sgst = round2(sgst);
  igst = round2(igst);
  const payable = options.reverseCharge ? taxable : round2(taxable + cgst + sgst + igst);
  const total = options.roundToRupee ? Math.round(payable) : payable;
  return { taxable, cgst, sgst, igst, roundOff: round2(total - payable), total };
}

/** Same rule as the backend: place of supply is the party's state, or ours when the party has none. */
export function isInterState(companyState: string | null | undefined, partyState: string | null | undefined): boolean {
  if (!companyState || !partyState) return false;
  return companyState.trim().toLowerCase() !== partyState.trim().toLowerCase();
}
