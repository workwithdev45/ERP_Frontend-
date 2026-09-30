import styled from 'styled-components';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import { formatDate, formatMoney } from '@/modules/trade/utils/format';
import type { Register } from '../types/report.types';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};

  h3 {
    margin: 0;
    padding: 0 ${({ theme }) => theme.space[5]};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textStrong};
  }
`;

const TotalRow = styled.tr`
  td {
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

const Mono = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  white-space: nowrap;
`;

const NOTE_TYPES = new Set(['CREDIT_NOTE', 'DEBIT_NOTE']);

/** Sales/purchase register: one row per invoice/bill (notes negative), totals, then GST by rate. */
export function RegisterTable({ register, partyLabel }: { register: Register; partyLabel: string }) {
  const t = register.totals;
  return (
    <>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Number</Th>
              <Th>{partyLabel}</Th>
              <Th>GSTIN</Th>
              <Th>Place of supply</Th>
              <Th $align="right">Taxable</Th>
              <Th $align="right">CGST</Th>
              <Th $align="right">SGST</Th>
              <Th $align="right">IGST</Th>
              <Th $align="right">Total</Th>
            </tr>
          </thead>
          <tbody>
            {register.rows.map((row) => (
              <tr key={row.documentId ?? row.docNumber}>
                <Td $muted style={{ whiteSpace: 'nowrap' }}>{formatDate(row.docDate)}</Td>
                <Td>
                  <Mono>{row.docNumber}</Mono>
                  {row.docType && NOTE_TYPES.has(row.docType) && <div style={{ fontSize: 12, opacity: 0.7 }}>Return</div>}
                  {row.reverseCharge && <div style={{ fontSize: 12, opacity: 0.7 }}>Reverse charge</div>}
                </Td>
                <Td>{row.partyName}</Td>
                <Td $muted>{row.partyGstin ?? 'Unregistered'}</Td>
                <Td $muted>{row.placeOfSupply ?? '—'}</Td>
                <Td $numeric>{formatMoney(row.taxableAmount)}</Td>
                <Td $numeric>{formatMoney(row.cgstAmount)}</Td>
                <Td $numeric>{formatMoney(row.sgstAmount)}</Td>
                <Td $numeric>{formatMoney(row.igstAmount)}</Td>
                <Td $numeric>{formatMoney(row.totalAmount)}</Td>
              </tr>
            ))}
            <TotalRow>
              <Td colSpan={5}>Total ({register.rows.length} documents, net of returns)</Td>
              <Td $numeric>{formatMoney(t.taxableAmount)}</Td>
              <Td $numeric>{formatMoney(t.cgstAmount)}</Td>
              <Td $numeric>{formatMoney(t.sgstAmount)}</Td>
              <Td $numeric>{formatMoney(t.igstAmount)}</Td>
              <Td $numeric>{formatMoney(t.totalAmount)}</Td>
            </TotalRow>
          </tbody>
        </Table>
      </TableScroll>

      {register.byGstRate.length > 0 && (
        <Section style={{ marginTop: 24 }}>
          <h3>GST by rate</h3>
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <Th>Rate</Th>
                  <Th $align="right">Taxable</Th>
                  <Th $align="right">CGST</Th>
                  <Th $align="right">SGST</Th>
                  <Th $align="right">IGST</Th>
                  <Th $align="right">Total GST</Th>
                </tr>
              </thead>
              <tbody>
                {register.byGstRate.map((r) => (
                  <tr key={r.gstRate}>
                    <Td>{r.gstRate}%</Td>
                    <Td $numeric>{formatMoney(r.taxableAmount)}</Td>
                    <Td $numeric>{formatMoney(r.cgstAmount)}</Td>
                    <Td $numeric>{formatMoney(r.sgstAmount)}</Td>
                    <Td $numeric>{formatMoney(r.igstAmount)}</Td>
                    <Td $numeric>{formatMoney(r.cgstAmount + r.sgstAmount + r.igstAmount)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        </Section>
      )}
    </>
  );
}
