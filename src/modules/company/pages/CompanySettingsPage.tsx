import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SaveOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Select } from '@/components/common/Select/Select';
import { companyService } from '../services/companyService';
import { INDIAN_STATES } from '../utils/indianStates';
import type { CompanyDetailsUpdateRequest } from '../types/company.types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.successDark};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const STATE_OPTIONS = INDIAN_STATES.map((state) => ({ value: state, label: state }));

const MONTH_OPTIONS = [
  { value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' },
  { value: '4', label: 'April' }, { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' }, { value: '9', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: 'TRADER', label: 'Trader' },
  { value: 'MANUFACTURER', label: 'Manufacturer' },
  { value: 'SERVICES', label: 'Services' },
];

const emptyForm: CompanyDetailsUpdateRequest = {
  legalName: '',
  gstin: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  financialYearStartMonth: 4,
  businessType: '',
};

/** G3: the company/GST details onboarding never captured, editable here per the plan's fix. */
export function CompanySettingsPage() {
  const [form, setForm] = useState<CompanyDetailsUpdateRequest>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    companyService
      .get()
      .then(({ data }) => {
        const company = data.data;
        setForm({
          legalName: company.legalName ?? '',
          gstin: company.gstin ?? '',
          addressLine1: company.addressLine1 ?? '',
          addressLine2: company.addressLine2 ?? '',
          city: company.city ?? '',
          state: company.state ?? '',
          pincode: company.pincode ?? '',
          financialYearStartMonth: company.financialYearStartMonth || 4,
          businessType: company.businessType ?? '',
        });
      })
      .catch((err) => setLoadError(apiErrorMessage(err, 'Could not load company details.')))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof CompanyDetailsUpdateRequest>(key: K, value: CompanyDetailsUpdateRequest[K]) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      await companyService.update(form);
      setSaved(true);
    } catch (err) {
      setSaveError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Company"
        subtitle="Legal and GST details used on invoices and official documents."
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Company details</CardTitle>
            <CardSubtitle>Editable any time — changes apply to new invoices going forward.</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <p>Loading…</p>
          ) : loadError ? (
            <FormError>{loadError}</FormError>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Input
                  id="legalName"
                  label="Legal name"
                  value={form.legalName}
                  onChange={(e) => update('legalName', e.target.value)}
                  required
                />
                <Input
                  id="gstin"
                  label="GSTIN (optional)"
                  placeholder="22AAAAA0000A1Z5"
                  value={form.gstin}
                  onChange={(e) => update('gstin', e.target.value.toUpperCase())}
                  maxLength={15}
                />
              </Row>
              <Input
                id="addressLine1"
                label="Address line 1"
                value={form.addressLine1}
                onChange={(e) => update('addressLine1', e.target.value)}
                required
              />
              <Input
                id="addressLine2"
                label="Address line 2 (optional)"
                value={form.addressLine2}
                onChange={(e) => update('addressLine2', e.target.value)}
              />
              <Row>
                <Input
                  id="city"
                  label="City"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  required
                />
                <Select
                  id="state"
                  label="State"
                  placeholder="Select state"
                  value={form.state}
                  options={STATE_OPTIONS}
                  onChange={(e) => update('state', e.target.value)}
                  required
                />
              </Row>
              <Row>
                <Input
                  id="pincode"
                  label="Pincode"
                  value={form.pincode}
                  onChange={(e) => update('pincode', e.target.value)}
                  maxLength={6}
                  required
                />
                <Select
                  id="financialYearStartMonth"
                  label="Financial year starts"
                  options={MONTH_OPTIONS}
                  value={String(form.financialYearStartMonth)}
                  onChange={(e) => update('financialYearStartMonth', Number(e.target.value))}
                />
              </Row>
              <Select
                id="businessType"
                label="What does your business do?"
                placeholder="Select business type"
                options={BUSINESS_TYPE_OPTIONS}
                value={form.businessType}
                onChange={(e) => update('businessType', e.target.value)}
              />
              {saveError && <FormError>{saveError}</FormError>}
              {saved && <SuccessText>Company details saved.</SuccessText>}
              <div>
                <Button type="submit" leadingIcon={<SaveOutlined />} loading={saving}>
                  Save changes
                </Button>
              </div>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
