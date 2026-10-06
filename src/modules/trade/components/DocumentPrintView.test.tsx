import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import type { TradeDocument } from '../types/trade.types';
import { DocumentPrintView } from './DocumentPrintView';

const ok = <T,>(data: T) => Promise.resolve({ data: { data } });

vi.mock('@/modules/company/services/companyService', () => ({
  companyService: {
    get: () =>
      ok({
        portalId: 'acme',
        name: 'Acme',
        legalName: 'Acme Traders Pvt Ltd',
        gstin: '27AAAAA0000A1Z5',
        addressLine1: '1 Market Road',
        addressLine2: null,
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        financialYearStartMonth: 4,
        businessType: null,
      }),
  },
}));

vi.mock('../services/partyService', () => ({
  partyService: {
    get: () => ok({ id: 7, name: 'Globex', addressLine1: '9 Hill St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: null }),
  },
}));

const complianceStatus = vi.fn();
vi.mock('@/modules/sales/services/complianceService', () => ({
  complianceService: { status: (id: number) => complianceStatus(id) },
}));

function invoice(overrides: Partial<TradeDocument> = {}): TradeDocument {
  return {
    id: 1,
    docType: 'SALES_INVOICE',
    docNumber: 'INV-0001',
    status: 'UNPAID',
    partyId: 7,
    partyName: 'Globex',
    docDate: '2026-10-01',
    dueDate: '2026-10-31',
    warehouseId: null,
    warehouseName: null,
    sourceDocumentId: null,
    sourceDocumentNumber: null,
    partyReference: null,
    interState: false,
    reverseCharge: false,
    taxableAmount: 1000,
    cgstAmount: 90,
    sgstAmount: 90,
    igstAmount: 0,
    roundOff: 0,
    totalAmount: 1180,
    settledAmount: 0,
    balance: 1180,
    partyGstin: '27BBBBB1111B1Z5',
    placeOfSupply: 'Maharashtra',
    notes: null,
    createdBy: 'admin',
    approvedBy: null,
    approvedAt: null,
    lines: [
      {
        id: 11,
        lineNo: 1,
        productId: 3,
        productName: 'Steel bolt',
        sku: 'SB-1',
        hsnCode: '7318',
        uom: 'NOS',
        itemType: 'STOCK',
        quantity: 10,
        fulfilledQuantity: 0,
        pendingQuantity: 10,
        reservedQuantity: 0,
        rate: 100,
        discountPercent: 0,
        gstRate: 18,
        taxableAmount: 1000,
        cgstAmount: 90,
        sgstAmount: 90,
        igstAmount: 0,
        lineTotal: 1180,
        sourceLineId: null,
      },
    ],
    linkedDocuments: [],
    payments: [],
    ...overrides,
  };
}

function renderView(doc: TradeDocument, onDone = vi.fn()) {
  return render(
    <ThemeProvider theme={theme}>
      <DocumentPrintView doc={doc} onDone={onDone} />
    </ThemeProvider>,
  );
}

describe('DocumentPrintView', () => {
  beforeEach(() => {
    vi.spyOn(window, 'print').mockImplementation(() => undefined);
    complianceStatus.mockReturnValue(ok({ einvoice: null }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.title = '';
  });

  it('prints the company, party, lines, totals and amount in words', async () => {
    renderView(invoice());

    expect(await screen.findByText('Tax Invoice')).toBeInTheDocument();
    expect(screen.getAllByText('Acme Traders Pvt Ltd').length).toBeGreaterThan(0);
    expect(screen.getByText('27AAAAA0000A1Z5')).toBeInTheDocument();
    expect(screen.getByText('Globex')).toBeInTheDocument();
    expect(screen.getByText(/9 Hill St, Mumbai/)).toBeInTheDocument();
    expect(screen.getByText('Steel bolt')).toBeInTheDocument();
    expect(screen.getByText('Indian Rupees One Thousand One Hundred Eighty Only')).toBeInTheDocument();
    expect(screen.getByText('Tax summary (HSN/SAC)')).toBeInTheDocument();
  });

  it('opens the print dialog with the document number as the file name, then reports done', async () => {
    const onDone = vi.fn();
    renderView(invoice(), onDone);

    await waitFor(() => expect(window.print).toHaveBeenCalledTimes(1));
    expect(document.title).toBe('Tax invoice INV-0001');

    window.dispatchEvent(new Event('afterprint'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('marks cancelled documents and only checks e-invoice status for tax invoices', async () => {
    renderView(invoice({ docType: 'QUOTATION', status: 'CANCELLED' }));

    expect(await screen.findByText('CANCELLED')).toBeInTheDocument();
    expect(screen.getByText('Bill to')).toBeInTheDocument();
    expect(complianceStatus).not.toHaveBeenCalled();
  });
});
