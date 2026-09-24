import styled from 'styled-components';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import type { BadgeTone } from '@/components/common/Badge/Badge.types';
import type { StockTransferDto, TransferStatus } from '../types/inventory.types';

const TableWrap = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.space[4]};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: top;
`;

const RouteCell = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

const ActionsCell = styled.td`
  padding: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: right;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const statusTone: Record<TransferStatus, BadgeTone> = {
  PENDING: 'neutral',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

interface StockTransferListTableProps {
  transfers: StockTransferDto[];
  onComplete: (transfer: StockTransferDto) => void;
  onCancel: (transfer: StockTransferDto) => void;
}

export function StockTransferListTable({ transfers, onComplete, onCancel }: StockTransferListTableProps) {
  if (transfers.length === 0) {
    return <EmptyState>No stock transfers yet.</EmptyState>;
  }

  return (
    <TableWrap>
      <StyledTable>
        <thead>
          <tr>
            <Th>Item</Th>
            <Th>Route</Th>
            <Th>Quantity</Th>
            <Th>Status</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.id}>
              <Td>{transfer.stockItemName}</Td>
              <Td>
                <RouteCell>
                  {transfer.sourceWarehouseName} → {transfer.destinationWarehouseName}
                </RouteCell>
              </Td>
              <Td>{transfer.quantity}</Td>
              <Td>
                <BadgeText tone={statusTone[transfer.status]}>{transfer.status}</BadgeText>
              </Td>
              <ActionsCell>
                {transfer.status === 'PENDING' && (
                  <>
                    <Button variant="ghost" onClick={() => onCancel(transfer)}>
                      Cancel
                    </Button>
                    <Button variant="secondary" onClick={() => onComplete(transfer)}>
                      Complete
                    </Button>
                  </>
                )}
              </ActionsCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  );
}
