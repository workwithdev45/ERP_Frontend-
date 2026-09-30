import styled from 'styled-components';
import { BadgeText } from '@/components/common/Badge/Badge';
import type { BadgeTone } from '@/components/common/Badge/Badge.types';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { StockMovement } from '../types/inventory.types';

const Sku = styled.span`
  margin-left: 6px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.font.mono};
`;

const TONE_BY_TYPE: Record<string, BadgeTone> = {
  IN: 'success',
  OPENING: 'success',
  OUT: 'danger',
  ADJUSTMENT: 'warning',
  TRANSFER: 'info',
  RETURN: 'info',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

interface MovementLedgerTableProps {
  movements: StockMovement[];
}

/** W8: the append-only stock ledger — every quantity change, never edited or deleted. */
export function MovementLedgerTable({ movements }: MovementLedgerTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>When</Th>
            <Th>Item</Th>
            <Th>Warehouse</Th>
            <Th>Type</Th>
            <Th $align="right">Qty</Th>
            <Th $align="right">Value</Th>
            <Th>Reason</Th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id}>
              <Td $muted>{formatDate(movement.performedAt)}</Td>
              <Td>
                {movement.productName}
                <Sku>{movement.sku}</Sku>
              </Td>
              <Td $muted>{movement.warehouseName}</Td>
              <Td>
                <BadgeText tone={TONE_BY_TYPE[movement.movementType] ?? 'neutral'}>{movement.movementType}</BadgeText>
              </Td>
              <Td $numeric>{movement.quantity}</Td>
              <Td $numeric>{movement.totalValue == null ? '—' : `₹${movement.totalValue.toFixed(2)}`}</Td>
              <Td $muted>{movement.reasonCode ? movement.reasonCode : movement.reason || '—'}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}
