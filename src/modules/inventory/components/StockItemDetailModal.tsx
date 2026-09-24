import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { BadgeText } from '@/components/common/Badge/Badge';
import { inventoryService } from '../services/inventoryService';
import type { StockItemDto } from '../types/inventory.types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.space[4]};
`;

const Panel = styled.div`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[6]};
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[5]};
  right: ${({ theme }) => theme.space[5]};
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

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[2]};
  padding-right: ${({ theme }) => theme.space[8]};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
`;

const StockSummary = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.space[3]} 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

interface StockItemDetailModalProps {
  item: StockItemDto;
  onClose: () => void;
  onUpdated: (item: StockItemDto) => void;
  onDeleted: (item: StockItemDto) => void;
}

export function StockItemDetailModal({ item, onClose, onUpdated, onDeleted }: StockItemDetailModalProps) {
  const [sku, setSku] = useState(item.sku);
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category ?? '');
  const [uom, setUom] = useState(item.uom);
  const [reorderThreshold, setReorderThreshold] = useState(String(item.reorderThreshold));
  const [active, setActive] = useState(item.active);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isValid = !!sku.trim() && !!name.trim() && !!uom.trim() && reorderThreshold.trim() !== '';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      const { data } = await inventoryService.updateStockItem(item.id, {
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        category: category.trim() || undefined,
        uom: uom.trim().toUpperCase(),
        reorderThreshold: Number(reorderThreshold),
        active,
      });
      onUpdated(data.data);
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setError('');
    setDeleting(true);
    try {
      await inventoryService.deleteStockItem(item.id);
      onDeleted(item);
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setDeleting(false);
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <CloseOutlined />
        </CloseButton>
        <Title>About {item.name}</Title>
        <BadgeRow>
          <BadgeText tone={item.active ? 'success' : 'neutral'}>{item.active ? 'Active' : 'Inactive'}</BadgeText>
          {item.lowStock && <BadgeText tone="danger">Low stock</BadgeText>}
        </BadgeRow>
        <StockSummary>
          Current stock: {item.currentStock} {item.uom}
        </StockSummary>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Input id="itemSku" label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
            <Input id="itemName" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </Row>
          <Row>
            <Input id="itemCategory" label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input id="itemUom" label="Unit of Measure" value={uom} onChange={(e) => setUom(e.target.value)} required />
          </Row>
          <Input
            id="itemReorderThreshold"
            label="Reorder Threshold"
            type="number"
            value={reorderThreshold}
            onChange={(e) => setReorderThreshold(e.target.value)}
            required
          />

          {error && <ErrorText>{error}</ErrorText>}

          <Actions>
            <Button type="button" variant="ghost" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
            <Button type="button" variant="secondary" onClick={() => setActive((prev) => !prev)}>
              {active ? 'Mark inactive' : 'Mark active'}
            </Button>
            <Button type="submit" disabled={!isValid} loading={submitting}>
              Update
            </Button>
          </Actions>
        </Form>
      </Panel>
    </Overlay>
  );
}
