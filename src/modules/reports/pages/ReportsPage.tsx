import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { Input } from '@/components/common/Input/Input';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Select } from '@/components/common/Select/Select';
import { Tabs } from '@/components/common/Tabs/Tabs';
import { companyService } from '@/modules/company/services/companyService';
import { purchaseService } from '@/modules/purchase/services/purchaseService';
import { salesService } from '@/modules/sales/services/salesService';
import { AgeingTable } from '@/modules/trade/components/AgeingTable';
import type { AgeingParty } from '@/modules/trade/types/trade.types';
import { formatDate, todayIso } from '@/modules/trade/utils/format';
import { RegisterTable } from '../components/RegisterTable';
import { StockValuationTable } from '../components/StockValuationTable';
import { reportService } from '../services/reportService';
import type { Register, StockValuation } from '../types/report.types';
import { downloadCsv, type CsvCell } from '../utils/exportCsv';

const Filters = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};

  > div {
    width: 170px;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TabPanel = styled.div`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]} 0;
`;

const PrintTitle = styled.h2`
  display: none;

  @media print {
    display: block;
    margin: 0 0 12px;
    font-size: 16px;
  }
`;

type TabKey = 'sales' | 'purchases' | 'stock' | 'receivables' | 'payables';
type Preset = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisFy' | 'custom';

const TAB_TITLE: Record<TabKey, string> = {
  sales: 'Sales register',
  purchases: 'Purchase register',
  stock: 'Stock valuation',
  receivables: 'Receivables ageing',
  payables: 'Payables ageing',
};

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function presetRange(preset: Preset, fyStartMonth: number): [string, string] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (preset) {
    case 'lastMonth':
      return [iso(new Date(y, m - 1, 1)), iso(new Date(y, m, 0))];
    case 'thisQuarter': {
      const q = Math.floor(m / 3) * 3;
      return [iso(new Date(y, q, 1)), todayIso()];
    }
    case 'thisFy': {
      const start = fyStartMonth - 1;
      return [iso(new Date(m >= start ? y : y - 1, start, 1)), todayIso()];
    }
    default:
      return [iso(new Date(y, m, 1)), todayIso()];
  }
}

const PRESET_OPTIONS = [
  { value: 'thisMonth', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
  { value: 'thisQuarter', label: 'This quarter' },
  { value: 'thisFy', label: 'This financial year' },
  { value: 'custom', label: 'Custom range' },
];

/** W14 standard reports with Excel (CSV) export and print / save as PDF. */
export function ReportsPage() {
  const [tab, setTab] = useState<TabKey>('sales');
  const [fyStartMonth, setFyStartMonth] = useState(4);
  const [preset, setPreset] = useState<Preset>('thisMonth');
  const [[from, to], setRange] = useState<[string, string]>(() => presetRange('thisMonth', 4));

  const [salesRegister, setSalesRegister] = useState<Register | null>(null);
  const [purchaseRegister, setPurchaseRegister] = useState<Register | null>(null);
  const [stock, setStock] = useState<StockValuation | null>(null);
  const [receivables, setReceivables] = useState<AgeingParty[] | null>(null);
  const [payables, setPayables] = useState<AgeingParty[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    companyService
      .get()
      .then((res) => setFyStartMonth(res.data.data.financialYearStartMonth || 4))
      .catch(() => undefined);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'sales') setSalesRegister((await reportService.salesRegister(from, to)).data.data);
      if (tab === 'purchases') setPurchaseRegister((await reportService.purchaseRegister(from, to)).data.data);
      if (tab === 'stock') setStock((await reportService.stockValuation()).data.data);
      if (tab === 'receivables') setReceivables((await salesService.receivablesAgeing()).data.data);
      if (tab === 'payables') setPayables((await purchaseService.payablesAgeing()).data.data);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load the report.'));
    } finally {
      setLoading(false);
    }
  }, [tab, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  function choosePreset(value: Preset) {
    setPreset(value);
    if (value !== 'custom') setRange(presetRange(value, fyStartMonth));
  }

  const usesRange = tab === 'sales' || tab === 'purchases';

  function exportCsv() {
    const stamp = usesRange ? `${from}_to_${to}` : todayIso();
    const register = tab === 'sales' ? salesRegister : tab === 'purchases' ? purchaseRegister : null;
    if (register) {
      const rows: CsvCell[][] = register.rows.map((r) => [
        r.docDate, r.docNumber, r.partyName, r.partyGstin ?? '', r.placeOfSupply ?? '', r.partyReference ?? '',
        r.taxableAmount, r.cgstAmount, r.sgstAmount, r.igstAmount, r.roundOff, r.totalAmount,
      ]);
      const t = register.totals;
      rows.push(['Total', '', '', '', '', '', t.taxableAmount, t.cgstAmount, t.sgstAmount, t.igstAmount, t.roundOff, t.totalAmount]);
      downloadCsv(
        `${tab === 'sales' ? 'sales' : 'purchase'}-register_${stamp}.csv`,
        ['Date', 'Number', tab === 'sales' ? 'Customer' : 'Vendor', 'GSTIN', 'Place of supply', 'Party reference',
          'Taxable', 'CGST', 'SGST', 'IGST', 'Round off', 'Total'],
        rows,
      );
    } else if (tab === 'stock' && stock) {
      downloadCsv(
        `stock-valuation_${stamp}.csv`,
        ['SKU', 'Item', 'Category', 'Warehouse', 'Unit', 'On hand', 'Reserved', 'Average cost', 'Value'],
        [
          ...stock.rows.map((r) => [r.sku, r.productName, r.category ?? '', r.warehouseName, r.uom ?? '', r.quantity, r.reserved, r.averageCost, r.value]),
          ['', 'Total', '', '', '', '', '', '', stock.totalValue],
        ],
      );
    } else {
      const ageing = tab === 'receivables' ? receivables : payables;
      if (!ageing) return;
      downloadCsv(
        `${tab}-ageing_${stamp}.csv`,
        ['Party', 'Document', 'Date', 'Due', 'Days overdue', 'Bucket', 'Balance'],
        ageing.flatMap((p) => p.documents.map((d) => [p.partyName, d.docNumber, d.docDate, d.dueDate, d.daysOverdue, d.bucket, d.balance])),
      );
    }
  }

  function renderContent() {
    if (loading) return <Empty>Loading…</Empty>;
    if (error) return <FormError>{error}</FormError>;
    switch (tab) {
      case 'sales':
        return !salesRegister || salesRegister.rows.length === 0 ? (
          <Empty>No invoices or credit notes in this period.</Empty>
        ) : (
          <RegisterTable register={salesRegister} partyLabel="Customer" />
        );
      case 'purchases':
        return !purchaseRegister || purchaseRegister.rows.length === 0 ? (
          <Empty>No bills or debit notes in this period.</Empty>
        ) : (
          <RegisterTable register={purchaseRegister} partyLabel="Vendor" />
        );
      case 'stock':
        return !stock || stock.rows.length === 0 ? <Empty>No stock on hand.</Empty> : <StockValuationTable valuation={stock} />;
      case 'receivables':
        return !receivables || receivables.length === 0 ? (
          <Empty>Nothing due from customers.</Empty>
        ) : (
          <AgeingTable rows={receivables} />
        );
      case 'payables':
        return !payables || payables.length === 0 ? (
          <Empty>Nothing owed to vendors.</Empty>
        ) : (
          <AgeingTable rows={payables} />
        );
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Insights" title="Reports" subtitle="Registers, GST by rate, stock valuation and ageing — export to Excel or print as PDF." />

      <Card>
        <TabPanel className="no-print">
          <Tabs
            activeKey={tab}
            onChange={(key) => setTab(key as TabKey)}
            items={(Object.keys(TAB_TITLE) as TabKey[]).map((key) => ({ key, label: TAB_TITLE[key] }))}
          />
        </TabPanel>

        <Filters className="no-print">
          {usesRange && (
            <>
              <Select
                id="reportPreset"
                label="Period"
                value={preset}
                options={PRESET_OPTIONS}
                onChange={(e) => choosePreset(e.target.value as Preset)}
              />
              <Input
                id="reportFrom"
                label="From"
                type="date"
                value={from}
                max={to}
                onChange={(e) => {
                  setPreset('custom');
                  setRange([e.target.value, to]);
                }}
              />
              <Input
                id="reportTo"
                label="To"
                type="date"
                value={to}
                min={from}
                onChange={(e) => {
                  setPreset('custom');
                  setRange([from, e.target.value]);
                }}
              />
            </>
          )}
          <Spacer />
          <Button variant="secondary" leadingIcon={<DownloadOutlined />} onClick={exportCsv} disabled={loading || !!error}>
            Export to Excel
          </Button>
          <Button variant="secondary" leadingIcon={<PrinterOutlined />} onClick={() => window.print()} disabled={loading || !!error}>
            Print / PDF
          </Button>
        </Filters>

        <div className="print-area">
          <PrintTitle>
            {TAB_TITLE[tab]}
            {usesRange ? ` · ${formatDate(from)} – ${formatDate(to)}` : ` · as on ${formatDate(todayIso())}`}
          </PrintTitle>
          {renderContent()}
        </div>
      </Card>
    </div>
  );
}
