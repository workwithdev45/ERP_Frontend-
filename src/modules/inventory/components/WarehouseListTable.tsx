import styled from 'styled-components';
import { MoreOutlined } from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import type { WarehouseDto } from '../types/inventory.types';

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

const WarehouseName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

const WarehouseLocation = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
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

interface WarehouseListTableProps {
  warehouses: WarehouseDto[];
  onViewWarehouse: (warehouse: WarehouseDto) => void;
}

export function WarehouseListTable({ warehouses, onViewWarehouse }: WarehouseListTableProps) {
  if (warehouses.length === 0) {
    return <EmptyState>No warehouses yet. Add one to get started.</EmptyState>;
  }

  return (
    <TableWrap>
      <StyledTable>
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>Warehouse</Th>
            <Th>Status</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <Td>{warehouse.code}</Td>
              <Td>
                <WarehouseName>{warehouse.name}</WarehouseName>
                {warehouse.location && <WarehouseLocation>{warehouse.location}</WarehouseLocation>}
              </Td>
              <Td>
                <BadgeText tone={warehouse.active ? 'success' : 'neutral'}>
                  {warehouse.active ? 'Active' : 'Inactive'}
                </BadgeText>
              </Td>
              <MenuCell>
                <MenuButton
                  type="button"
                  onClick={() => onViewWarehouse(warehouse)}
                  aria-label={`Actions for ${warehouse.name}`}
                >
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
