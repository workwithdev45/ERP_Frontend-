import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { BadgeText } from '@/components/common/Badge/Badge';
import { inventoryService } from '../services/inventoryService';
import type { WarehouseDto } from '../types/inventory.types';

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
  max-width: 460px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
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

interface WarehouseDetailModalProps {
  warehouse: WarehouseDto;
  onClose: () => void;
  onUpdated: (warehouse: WarehouseDto) => void;
  onDeleted: (warehouse: WarehouseDto) => void;
}

export function WarehouseDetailModal({ warehouse, onClose, onUpdated, onDeleted }: WarehouseDetailModalProps) {
  const [name, setName] = useState(warehouse.name);
  const [code, setCode] = useState(warehouse.code);
  const [location, setLocation] = useState(warehouse.location ?? '');
  const [active, setActive] = useState(warehouse.active);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isValid = !!name.trim() && !!code.trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      const { data } = await inventoryService.updateWarehouse(warehouse.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        location: location.trim() || undefined,
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
      await inventoryService.deleteWarehouse(warehouse.id);
      onDeleted(warehouse);
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
        <Title>About {warehouse.name}</Title>
        <BadgeText tone={warehouse.active ? 'success' : 'neutral'}>
          {warehouse.active ? 'Active' : 'Inactive'}
        </BadgeText>

        <Form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <Input id="warehouseName" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input id="warehouseCode" label="Code" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input
            id="warehouseLocation"
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
