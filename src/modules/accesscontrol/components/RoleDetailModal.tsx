import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { BadgeText } from '@/components/common/Badge/Badge';
import { rbacService } from '../services/rbacService';
import type { RoleDto } from '../types/rbac.types';

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
  max-width: 560px;
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

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 64px;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

interface RoleDetailModalProps {
  role: RoleDto;
  onClose: () => void;
  onUpdated: (role: RoleDto) => void;
  onDeleted: (role: RoleDto) => void;
}

export function RoleDetailModal({ role, onClose, onUpdated, onDeleted }: RoleDetailModalProps) {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isValid = !!name.trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      const { data } = await rbacService.updateRole(role.id, {
        name: name.trim(),
        description: description.trim() || undefined,
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
      await rbacService.deleteRole(role.id);
      onDeleted(role);
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
        <Title>About {role.name}</Title>
        <BadgeText tone={role.systemRole ? 'neutral' : 'success'}>{role.systemRole ? 'System role' : 'Custom role'}</BadgeText>

        <Form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <Input
            id="roleName"
            label="Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={role.systemRole}
            required
          />

          <Field>
            <Label htmlFor="roleDescription">Description</Label>
            <TextArea id="roleDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>

          {error && <ErrorText>{error}</ErrorText>}

          <Actions>
            {!role.systemRole && (
              <Button type="button" variant="ghost" onClick={handleDelete} loading={deleting}>
                Delete
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
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
