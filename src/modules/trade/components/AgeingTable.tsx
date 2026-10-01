import { Fragment } from 'react';
import styled from 'styled-components';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { AgeingParty } from '../types/trade.types';
import { formatDate, formatMoney } from '../utils/format';

const PartyRow = styled.tr`
  td {
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }
`;

const DocRow = styled.tr<{ $clickable: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const DocButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Overdue = styled.span<{ $late: boolean }>`
  color: ${({ theme, $late }) => ($late ? theme.colors.danger : theme.colors.textMuted)};
`;

const TotalRow = styled.tr`
  td {
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

const amountOrDash = (value: number) => (value ? formatMoney(value) : '—');

interface AgeingTableProps {
  rows: AgeingParty[];
  /** Omit where documents can't be opened (e.g. the Reports page); rows then aren't interactive. */
  onOpenDocument?: (id: number) => void;
}

/** Receivables/payables by party, bucketed by days past due, with each open document beneath. */
export function AgeingTable({ rows, onOpenDocument }: AgeingTableProps) {
  const sum = (pick: (row: AgeingParty) => number) => rows.reduce((total, row) => total + pick(row), 0);
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Party / document</Th>
            <Th $align="right">Not due</Th>
            <Th $align="right">1–30 days</Th>
            <Th $align="right">31–60 days</Th>
            <Th $align="right">61–90 days</Th>
            <Th $align="right">90+ days</Th>
            <Th $align="right">Total</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Fragment key={row.partyId}>
              <PartyRow>
                <Td>{row.partyName}</Td>
                <Td $numeric>{amountOrDash(row.notDue)}</Td>
                <Td $numeric>{amountOrDash(row.days1To30)}</Td>
                <Td $numeric>{amountOrDash(row.days31To60)}</Td>
                <Td $numeric>{amountOrDash(row.days61To90)}</Td>
                <Td $numeric>{amountOrDash(row.over90)}</Td>
                <Td $numeric>{formatMoney(row.total)}</Td>
              </PartyRow>
              {row.documents.map((doc) => (
                <DocRow key={doc.documentId} $clickable={!!onOpenDocument} onClick={() => onOpenDocument?.(doc.documentId)}>
                  <Td $muted style={{ paddingLeft: 32 }}>
                    {onOpenDocument ? (
                      <DocButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDocument(doc.documentId);
                        }}
                      >
                        {doc.docNumber}
                      </DocButton>
                    ) : (
                      doc.docNumber
                    )}{' '}
                    · due {formatDate(doc.dueDate)} ·{' '}
                    <Overdue $late={doc.daysOverdue > 0}>
                      {doc.daysOverdue > 0 ? `${doc.daysOverdue} days overdue` : doc.daysOverdue === 0 ? 'due today' : `due in ${-doc.daysOverdue} days`}
                    </Overdue>
                  </Td>
                  <Td $numeric $muted colSpan={5} style={{ textAlign: 'right' }}>
                    {doc.bucket}
                  </Td>
                  <Td $numeric $muted>
                    {formatMoney(doc.balance)}
                  </Td>
                </DocRow>
              ))}
            </Fragment>
          ))}
          <TotalRow>
            <Td>Total</Td>
            <Td $numeric>{formatMoney(sum((r) => r.notDue))}</Td>
            <Td $numeric>{formatMoney(sum((r) => r.days1To30))}</Td>
            <Td $numeric>{formatMoney(sum((r) => r.days31To60))}</Td>
            <Td $numeric>{formatMoney(sum((r) => r.days61To90))}</Td>
            <Td $numeric>{formatMoney(sum((r) => r.over90))}</Td>
            <Td $numeric>{formatMoney(sum((r) => r.total))}</Td>
          </TotalRow>
        </tbody>
      </Table>
    </TableScroll>
  );
}
