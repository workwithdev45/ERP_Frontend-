import styled from 'styled-components';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import { formatMoney } from '@/modules/trade/utils/format';
import type { StockValuation } from '../types/report.types';

const TotalRow = styled.tr`
  td {
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

/** Weighted-average valuation per item and warehouse. */
export function StockValuationTable({ valuation }: { valuation: StockValuation }) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Item</Th>
            <Th>Category</Th>
            <Th>Warehouse</Th>
            <Th $align="right">On hand</Th>
            <Th $align="right">Reserved</Th>
            <Th $align="right">Avg. cost</Th>
            <Th $align="right">Value</Th>
          </tr>
        </thead>
        <tbody>
          {valuation.rows.map((row) => (
            <tr key={`${row.productId}-${row.warehouseName}`}>
              <Td>
                {row.productName}
                <div style={{ fontSize: 12, opacity: 0.7 }}>{row.sku}</div>
              </Td>
              <Td $muted>{row.category ?? '—'}</Td>
              <Td $muted>{row.warehouseName}</Td>
              <Td $numeric>
                {row.quantity} {row.uom ?? ''}
              </Td>
              <Td $numeric>{row.reserved || '—'}</Td>
              <Td $numeric>{row.averageCost != null ? formatMoney(row.averageCost) : 'No cost'}</Td>
              <Td $numeric>{formatMoney(row.value)}</Td>
            </tr>
          ))}
          <TotalRow>
            <Td colSpan={6}>Total stock value</Td>
            <Td $numeric>{formatMoney(valuation.totalValue)}</Td>
          </TotalRow>
        </tbody>
      </Table>
    </TableScroll>
  );
}
