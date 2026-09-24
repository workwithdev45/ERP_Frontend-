import styled from 'styled-components';
import { MoreOutlined } from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import type { StockItemDto } from '../types/inventory.types';

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

const ItemName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

const ItemMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const StockCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const MenuCell = styled.td`
  padding: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: right;
  position: relative;
`;

const MenuButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

interface StockItemListTableProps {
  items: StockItemDto[];
  onViewItem: (item: StockItemDto) => void;
}

export function StockItemListTable({ items, onViewItem }: StockItemListTableProps) {
  if (items.length === 0) {
    return <EmptyState>No stock items yet. Add one to get started.</EmptyState>;
  }

  return (
    <TableWrap>
      <StyledTable>
        <thead>
          <tr>
            <Th>SKU</Th>
            <Th>Item</Th>
            <Th>Current Stock</Th>
            <Th>Reorder At</Th>
            <Th>Status</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <Td>{item.sku}</Td>
              <Td>
                <ItemName>{item.name}</ItemName>
                {item.category && <ItemMeta>{item.category}</ItemMeta>}
              </Td>
              <Td>
                <StockCell>
                  {item.currentStock} {item.uom}
                  {item.lowStock && <BadgeText tone="danger">Low stock</BadgeText>}
                </StockCell>
              </Td>
              <Td>
                {item.reorderThreshold} {item.uom}
              </Td>
              <Td>
                <BadgeText tone={item.active ? 'success' : 'neutral'}>
                  {item.active ? 'Active' : 'Inactive'}
                </BadgeText>
              </Td>
              <MenuCell>
                <MenuButton type="button" onClick={() => onViewItem(item)} aria-label={`Actions for ${item.name}`}>
                  <MoreOutlined />
                </MenuButton>
              </MenuCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  );
}
