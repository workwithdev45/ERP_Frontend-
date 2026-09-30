import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/common/Button/Button';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { Modal } from '@/components/common/Modal/Modal';
import { Select } from '@/components/common/Select/Select';
import { INDIAN_STATES } from '@/modules/company/utils/indianStates';
import type { Party, PartyRequest, PartyType } from '../types/trade.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SectionLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const FORM_ID = 'party-form';
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const STATE_OPTIONS = INDIAN_STATES.map((state) => ({ value: state, label: state }));

const TYPE_OPTIONS: { value: PartyType; label: string }[] = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'VENDOR', label: 'Vendor' },
  { value: 'BOTH', label: 'Customer & vendor' },
];

interface FormState {
  partyType: PartyType;
  name: string;
  gstin: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  paymentTermsDays: string;
  creditLimit: string;
}

function toForm(party: Party | null | undefined, defaultType: PartyType): FormState {
  return {
    partyType: party?.partyType ?? defaultType,
    name: party?.name ?? '',
    gstin: party?.gstin ?? '',
    phone: party?.phone ?? '',
    email: party?.email ?? '',
    addressLine1: party?.addressLine1 ?? '',
    city: party?.city ?? '',
    state: party?.state ?? '',
    pincode: party?.pincode ?? '',
    paymentTermsDays: String(party?.paymentTermsDays ?? 30),
    creditLimit: party?.creditLimit != null ? String(party.creditLimit) : '',
  };
}

interface PartyFormModalProps {
  open: boolean;
  party?: Party | null;
  /** Pre-selected type for a new party: CUSTOMER from Sales, VENDOR from Purchase. */
  defaultType: PartyType;
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: PartyRequest) => void;
}

/** W5 master: a customer and/or vendor. Its state decides CGST + SGST vs IGST on documents. */
export function PartyFormModal({ open, party, defaultType, submitting, error, onClose, onSubmit }: PartyFormModalProps) {
  const [form, setForm] = useState<FormState>(() => toForm(party, defaultType));
  const isEdit = !!party;

  useEffect(() => {
    if (open) setForm(toForm(party, defaultType));
  }, [open, party, defaultType]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const gstin = form.gstin.trim().toUpperCase();
  const gstinError = gstin && !GSTIN_PATTERN.test(gstin) ? 'Enter a valid 15-character GSTIN' : undefined;
  const isCustomer = form.partyType !== 'VENDOR';
  const isValid = !!form.name.trim() && !gstinError;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      partyType: form.partyType,
      name: form.name.trim(),
      gstin: gstin || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      addressLine1: form.addressLine1.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state || undefined,
      pincode: form.pincode.trim() || undefined,
      paymentTermsDays: form.paymentTermsDays === '' ? 30 : Number(form.paymentTermsDays),
      creditLimit: isCustomer && form.creditLimit !== '' ? Number(form.creditLimit) : null,
    });
  }

  return (
    <Modal
      open={open}
      title={isEdit ? `Edit ${party?.name}` : defaultType === 'VENDOR' ? 'New vendor' : 'New customer'}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!isValid} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <Row>
          <Input id="partyName" label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required autoFocus />
          <Select
            id="partyType"
            label="Type"
            value={form.partyType}
            options={TYPE_OPTIONS}
            onChange={(e) => update('partyType', e.target.value as PartyType)}
          />
        </Row>
        <Row>
          <Input
            id="partyGstin"
            label="GSTIN (optional)"
            placeholder="27AAPFU0939F1ZV"
            value={form.gstin}
            error={gstinError}
            hint="Leave blank for unregistered parties"
            onChange={(e) => update('gstin', e.target.value.toUpperCase())}
          />
          <Input id="partyPhone" label="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </Row>
        <Input id="partyEmail" label="Email (optional)" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />

        <SectionLabel>Address</SectionLabel>
        <Input id="partyAddress" label="Address (optional)" value={form.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} />
        <Row>
          <Input id="partyCity" label="City (optional)" value={form.city} onChange={(e) => update('city', e.target.value)} />
          <Input id="partyPincode" label="PIN code (optional)" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
        </Row>
        <Select
          id="partyState"
          label="State"
          placeholder="Select state"
          value={form.state}
          options={STATE_OPTIONS}
          hint="Decides CGST + SGST (same state as you) or IGST (other state)"
          onChange={(e) => update('state', e.target.value)}
        />

        <SectionLabel>Terms</SectionLabel>
        <Row>
          <Input
            id="partyTerms"
            label="Payment terms (days)"
            type="number"
            min={0}
            value={form.paymentTermsDays}
            onChange={(e) => update('paymentTermsDays', e.target.value)}
          />
          {isCustomer && (
            <Input
              id="partyCreditLimit"
              label="Credit limit ₹ (optional)"
              type="number"
              min={0}
              value={form.creditLimit}
              hint="Orders beyond this are refused"
              onChange={(e) => update('creditLimit', e.target.value)}
            />
          )}
        </Row>
        {error && <FormError>{error}</FormError>}
      </Form>
    </Modal>
  );
}
