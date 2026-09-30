import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import { IconButton } from '@/components/common/IconButton/IconButton';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { Warehouse } from '../types/inventory.types';

const Row = styled.tr`
  cursor: pointer;
`;

interface WarehouseListTableProps {
  warehouses: Warehouse[];
  onEdit: (warehouse: Warehouse) => void;
}

export function WarehouseListTable({ warehouses, onEdit }: WarehouseListTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Code</Th>
            <Th>Location</Th>
            <Th>Default</Th>
            <Th $align="right">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <Row key={warehouse.id} onClick={() => onEdit(warehouse)}>
              <Td>{warehouse.name}</Td>
              <Td $muted>{warehouse.code}</Td>
              <Td $muted>{warehouse.location || '—'}</Td>
              <Td>{warehouse.defaultWarehouse && <BadgeText tone="primary">Default</BadgeText>}</Td>
              <Td $align="right" onClick={(e) => e.stopPropagation()}>
                <IconButton aria-label={`Edit ${warehouse.name}`} title="Edit" onClick={() => onEdit(warehouse)}>
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
