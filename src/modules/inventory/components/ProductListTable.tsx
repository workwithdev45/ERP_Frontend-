import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';
import { BadgeText } from '@/components/common/Badge/Badge';
import { IconButton } from '@/components/common/IconButton/IconButton';
import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { Product } from '../types/inventory.types';

const NameCell = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const Sku = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.font.mono};
`;

const Row = styled.tr`
  cursor: pointer;
`;

const ITEM_TYPE_LABEL: Record<Product['itemType'], string> = {
  STOCK: 'Stock',
  NON_STOCK: 'Non-stock',
  SERVICE: 'Service',
};

interface ProductListTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

export function ProductListTable({ products, onEdit, onOpenDetail }: ProductListTableProps) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Item</Th>
            <Th>Category</Th>
            <Th>Type</Th>
            <Th>HSN</Th>
            <Th $align="right">Reorder level</Th>
            <Th>Status</Th>
            <Th $align="right">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Row key={product.id} onClick={() => onOpenDetail(product)}>
              <Td>
                <NameCell>{product.name}</NameCell>
                <Sku>{product.sku}</Sku>
              </Td>
              <Td $muted>{product.category || '—'}</Td>
              <Td $muted>{ITEM_TYPE_LABEL[product.itemType]}</Td>
              <Td $muted>{product.hsnCode || '—'}</Td>
              <Td $numeric>{product.reorderLevel}</Td>
              <Td>
                <BadgeText tone={product.active ? 'success' : 'neutral'}>{product.active ? 'Active' : 'Inactive'}</BadgeText>
              </Td>
              <Td $align="right" onClick={(e) => e.stopPropagation()}>
                <IconButton aria-label={`Edit ${product.name}`} title="Edit" onClick={() => onEdit(product)}>
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
