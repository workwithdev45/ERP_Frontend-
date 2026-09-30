import styled from 'styled-components';
import { BadgeText } from '@/components/common/Badge/Badge';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { InventoryItem } from '../types/inventory.types';

const NameCell = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const Sku = styled.span`
  margin-left: 6px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.font.mono};
`;

function formatCost(value: number | null) {
  return value == null ? '—' : `₹${value.toFixed(2)}`;
}

interface StockSummaryTableProps {
  items: InventoryItem[];
}

export function StockSummaryTable({ items }: StockSummaryTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Item</Th>
            <Th>Warehouse</Th>
            <Th $align="right">On hand</Th>
            <Th $align="right">Reserved</Th>
            <Th $align="right">Available</Th>
            <Th $align="right">Avg. cost</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <Td>
                <NameCell>
                  {item.productName}
                  <Sku>{item.sku}</Sku>
                </NameCell>
              </Td>
              <Td $muted>{item.warehouseName}</Td>
              <Td $numeric>{item.availableQuantity}</Td>
              <Td $numeric>{item.reservedQuantity}</Td>
              <Td $numeric>{item.availableToPromise}</Td>
              <Td $numeric>{formatCost(item.averageCost)}</Td>
              <Td>{item.lowStock && <BadgeText tone="danger">Low stock</BadgeText>}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}
