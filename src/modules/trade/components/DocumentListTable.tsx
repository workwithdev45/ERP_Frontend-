import styled from 'styled-components';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { DocumentSummary } from '../types/trade.types';
import { formatDate, formatMoney } from '../utils/format';
import { StatusBadge } from './StatusBadge';

const Row = styled.tr`
  cursor: pointer;
`;

/** The document number is the row's keyboard-reachable control; the row itself is a mouse shortcut. */
const Number = styled.button`
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: inherit;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  white-space: nowrap;
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const Sub = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface DocumentListTableProps {
  documents: DocumentSummary[];
  /** Label for the due-date column, e.g. "Expected", "Valid until", "Due"; omit to hide it. */
  dueLabel?: string;
  /** Show the outstanding balance column (bills and invoices). */
  showBalance?: boolean;
  onOpen: (document: DocumentSummary) => void;
}

export function DocumentListTable({ documents, dueLabel, showBalance, onOpen }: DocumentListTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Number</Th>
            <Th>Party</Th>
            <Th>Date</Th>
            {dueLabel && <Th>{dueLabel}</Th>}
            <Th>Status</Th>
            <Th $align="right">Total</Th>
            {showBalance && <Th $align="right">Balance</Th>}
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <Row key={doc.id} onClick={() => onOpen(doc)}>
              <Td>
                <Number
                  type="button"
                  aria-label={`Open ${doc.docNumber}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(doc);
                  }}
                >
                  {doc.docNumber}
                </Number>
                {doc.sourceDocumentNumber && <Sub>from {doc.sourceDocumentNumber}</Sub>}
              </Td>
              <Td>
                {doc.partyName}
                {doc.partyReference && <Sub>Ref: {doc.partyReference}</Sub>}
              </Td>
              <Td $muted>{formatDate(doc.docDate)}</Td>
              {dueLabel && <Td $muted>{formatDate(doc.dueDate)}</Td>}
              <Td>
                <StatusBadge status={doc.status} />
              </Td>
              <Td $numeric>{formatMoney(doc.totalAmount)}</Td>
              {showBalance && <Td $numeric>{doc.status === 'CANCELLED' ? '—' : formatMoney(doc.balance)}</Td>}
            </Row>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}
