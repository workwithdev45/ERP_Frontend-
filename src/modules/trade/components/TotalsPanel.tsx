import styled from 'styled-components';
import type { GstTotals } from '../utils/gst';
import { formatMoney } from '../utils/format';

const Panel = styled.dl`
  flex: 0 1 300px;
  min-width: 240px;
  margin: 0;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.bgSubtle};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap: ${({ theme }) => theme.space[1]};
  column-gap: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSize.sm};

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    margin: 0;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.textBody};
  }
`;

const Total = styled.div`
  display: contents;

  dt,
  dd {
    padding-top: ${({ theme }) => theme.space[2]};
    margin-top: ${({ theme }) => theme.space[1]};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-size: ${({ theme }) => theme.fontSize.md};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textStrong};
  }
`;

interface TotalsPanelProps {
  totals: GstTotals;
  interState: boolean;
  reverseCharge?: boolean;
}

/** Taxable value, the CGST/SGST or IGST split, round-off and total. */
export function TotalsPanel({ totals, interState, reverseCharge }: TotalsPanelProps) {
  return (
    <Panel aria-label="Totals">
      <dt>Taxable value</dt>
      <dd>{formatMoney(totals.taxable)}</dd>
      {interState ? (
        <>
          <dt>IGST</dt>
          <dd>{formatMoney(totals.igst)}</dd>
        </>
      ) : (
        <>
          <dt>CGST</dt>
          <dd>{formatMoney(totals.cgst)}</dd>
          <dt>SGST</dt>
          <dd>{formatMoney(totals.sgst)}</dd>
        </>
      )}
      {reverseCharge && (
        <>
          <dt>GST under reverse charge</dt>
          <dd>−{formatMoney(totals.cgst + totals.sgst + totals.igst)}</dd>
        </>
      )}
      {totals.roundOff !== 0 && (
        <>
          <dt>Round off</dt>
          <dd>{totals.roundOff > 0 ? '+' : ''}{totals.roundOff.toFixed(2)}</dd>
        </>
      )}
      <Total>
        <dt>Total</dt>
        <dd>{formatMoney(totals.total)}</dd>
      </Total>
    </Panel>
  );
}
