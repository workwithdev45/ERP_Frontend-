import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { ReorderSuggestion } from '@/modules/trade/types/trade.types';
import { formatMoney } from '@/modules/trade/utils/format';

interface ReorderTableProps {
  suggestions: ReorderSuggestion[];
  selected: Set<number>;
  onToggle: (productId: number) => void;
}

/** W10: items at or below reorder level after counting open POs, with a suggested top-up. */
export function ReorderTable({ suggestions, selected, onToggle }: ReorderTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>
              <span className="sr-only">Select</span>
            </Th>
            <Th>Item</Th>
            <Th $align="right">Reorder level</Th>
            <Th $align="right">Available</Th>
            <Th $align="right">On order</Th>
            <Th $align="right">Suggested</Th>
            <Th>Last vendor</Th>
            <Th $align="right">Last rate</Th>
          </tr>
        </thead>
        <tbody>
          {suggestions.map((s) => (
            <tr key={s.productId}>
              <Td>
                <input
                  type="checkbox"
                  aria-label={`Select ${s.productName}`}
                  checked={selected.has(s.productId)}
                  onChange={() => onToggle(s.productId)}
                />
              </Td>
              <Td>
                {s.productName}
                <div style={{ fontSize: 12, opacity: 0.7 }}>{s.sku}</div>
              </Td>
              <Td $numeric>{s.reorderLevel}</Td>
              <Td $numeric>{s.available}</Td>
              <Td $numeric>{s.onOrder}</Td>
              <Td $numeric>
                <strong>{s.suggestedQuantity}</strong> {s.uom ?? ''}
              </Td>
              <Td $muted>{s.lastVendorName ?? '—'}</Td>
              <Td $numeric>{s.lastRate != null ? formatMoney(s.lastRate) : '—'}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}
