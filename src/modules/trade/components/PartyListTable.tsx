import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import { IconButton } from '@/components/common/IconButton/IconButton';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { Party } from '../types/trade.types';
import { formatMoney } from '../utils/format';

const Row = styled.tr`
  cursor: pointer;
`;

const Sub = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.font.mono};
`;

interface PartyListTableProps {
  parties: Party[];
  /** Header for the outstanding column: "Receivable" for customers, "Payable" for vendors. */
  outstandingLabel: string;
  onEdit: (party: Party) => void;
}

export function PartyListTable({ parties, outstandingLabel, onEdit }: PartyListTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>State</Th>
            <Th>Terms</Th>
            <Th $align="right">Credit limit</Th>
            <Th $align="right">{outstandingLabel}</Th>
            <Th>Status</Th>
            <Th $align="right">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party) => (
            <Row key={party.id} onClick={() => onEdit(party)}>
              <Td>
                {party.name}
                {party.gstin && <Sub>{party.gstin}</Sub>}
              </Td>
              <Td $muted>{[party.city, party.state].filter(Boolean).join(', ') || '—'}</Td>
              <Td $muted>{party.paymentTermsDays} days</Td>
              <Td $numeric>{party.creditLimit != null ? formatMoney(party.creditLimit) : '—'}</Td>
              <Td $numeric>{formatMoney(party.outstanding)}</Td>
              <Td>
                {party.partyType === 'BOTH' && <BadgeText tone="info">Customer & vendor</BadgeText>}{' '}
                {!party.active && <BadgeText tone="neutral">Inactive</BadgeText>}
              </Td>
              <Td $align="right" onClick={(e) => e.stopPropagation()}>
                <IconButton aria-label={`Edit ${party.name}`} title="Edit" onClick={() => onEdit(party)}>
                  <EditOutlined />
                </IconButton>
              </Td>
            </Row>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}
