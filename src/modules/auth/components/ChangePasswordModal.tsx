import { useState } from 'react';
import styled from 'styled-components';
import { isAxiosError } from 'axios';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { isStrongPassword, PASSWORD_POLICY_HINT } from '@/utils/passwordPolicy';
import { authService } from '../services/authService';
import type { ApiErrorResponse } from '../types/auth.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.successDark};
  font-size: 14px;
`;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

/** G13: change-password for a signed-in user — reachable from the account menu (G12). */
export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = currentPassword.length > 0 && isStrongPassword(newPassword);

  function handleClose() {
    setCurrentPassword('');
    setNewPassword('');
    setError('');
    setDone(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setDone(true);
    } catch (err) {
      if (isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} title="Change password" onClose={handleClose}>
      {done ? (
        <>
          <SuccessText>Your password has been changed.</SuccessText>
          <Button fullWidth onClick={handleClose} style={{ marginTop: 16 }}>
            Done
          </Button>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Input
            id="currentPassword"
            type={showPasswords ? 'text' : 'password'}
            label="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            suffixIcon={showPasswords ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onSuffixIconClick={() => setShowPasswords((prev) => !prev)}
            autoFocus
            required
          />
          <Input
            id="newPassword"
            type={showPasswords ? 'text' : 'password'}
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            hint={PASSWORD_POLICY_HINT}
            required
          />
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Button type="submit" fullWidth disabled={!isValid} loading={submitting}>
            Change password
          </Button>
        </Form>
      )}
    </Modal>
  );
}
