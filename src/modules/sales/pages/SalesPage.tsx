import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Tabs } from '@/components/common/Tabs/Tabs';
import { usePermission } from '@/hooks/usePermission';
import { AgeingTable } from '@/modules/trade/components/AgeingTable';
import { DocumentDetailModal } from '@/modules/trade/components/DocumentDetailModal';
import { DocumentFormModal } from '@/modules/trade/components/DocumentFormModal';
import { DocumentListTable } from '@/modules/trade/components/DocumentListTable';
import { FulfilDocumentModal } from '@/modules/trade/components/FulfilDocumentModal';
import { PartyFormModal } from '@/modules/trade/components/PartyFormModal';
import { PartyListTable } from '@/modules/trade/components/PartyListTable';
import { PaymentFormModal } from '@/modules/trade/components/PaymentFormModal';
import { PagedView } from '@/modules/trade/components/PagedView';
import { PaymentListTable } from '@/modules/trade/components/PaymentListTable';
import { useDocumentDetail } from '@/modules/trade/hooks/useDocumentDetail';
import { usePagedList } from '@/modules/trade/hooks/usePagedList';
import { useTradeMasters } from '@/modules/trade/hooks/useTradeMasters';
import { partyService } from '@/modules/trade/services/partyService';
import type {
  AgeingParty,
  DocumentRequest,
  Party,
  PartyRequest,
  PaymentRequest,
  TradeDocument,
} from '@/modules/trade/types/trade.types';
import { ConvertQuotationModal } from '../components/ConvertQuotationModal';
import { InvoiceCompliancePanel } from '../components/InvoiceCompliancePanel';
import { RemindersTab } from '../components/RemindersTab';
import { salesService, type ConvertQuotationRequest } from '../services/salesService';

const Empty = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TabPanel = styled.div`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]} 0;
`;

type TabKey = 'customers' | 'quotations' | 'orders' | 'deliveries' | 'invoices' | 'returns' | 'receipts' | 'receivables' | 'reminders';
type FormKind = 'quotation' | 'order' | 'invoice';
type FulfilKind = 'delivery' | 'invoice' | 'return';

const FORM_CONFIG: Record<FormKind, { title: string; submit: string; due: string; warehouse: 'required' | 'optional' | 'hidden'; ref?: string }> = {
  quotation: { title: 'New quotation', submit: 'Create quotation', due: 'Valid until', warehouse: 'hidden' },
  order: { title: 'New sales order', submit: 'Confirm order', due: 'Expected delivery', warehouse: 'required', ref: 'Customer PO no.' },
  invoice: { title: 'Direct invoice', submit: 'Create invoice', due: 'Due date', warehouse: 'optional', ref: 'Customer PO no.' },
};

const FULFIL_CONFIG: Record<FulfilKind, { title: string; intro: string; submit: string; done: string; qty: string }> = {
  delivery: {
    title: 'Deliver goods',
    intro: 'Stock leaves the order’s warehouse — from this order’s reservation first. Deliver part now and the rest later if needed.',
    submit: 'Create delivery challan',
    done: 'Delivered',
    qty: 'Deliver now',
  },
  invoice: {
    title: 'Create tax invoice',
    intro: 'Invoice what was delivered on this challan. GST is split by place of supply and the total rounded to the rupee.',
    submit: 'Create invoice',
    done: 'Invoiced',
    qty: 'Invoice now',
  },
  return: {
    title: 'Sales return (credit note)',
    intro: 'Returned goods come back into stock, and the credit note reduces what the customer owes on this invoice.',
    submit: 'Create credit note',
    done: 'Returned',
    qty: 'Return now',
  },
};

export function SalesPage() {
  const { canAccess, hasRole } = usePermission();
  const canCreate = canAccess('SALES_CREATE');
  const canEdit = canAccess('SALES_EDIT');

  const [tab, setTab] = useState<TabKey>('orders');
  const masters = useTradeMasters('CUSTOMER');

  // W15: each list is paged on the server and loads when its tab is opened.
  const quotations = usePagedList(salesService.listQuotations, tab === 'quotations');
  const orders = usePagedList(salesService.listOrders, tab === 'orders');
  const deliveries = usePagedList(salesService.listDeliveries, tab === 'deliveries');
  const invoices = usePagedList(salesService.listInvoices, tab === 'invoices');
  const creditNotes = usePagedList(salesService.listCreditNotes, tab === 'returns');
  const receipts = usePagedList(salesService.listReceipts, tab === 'receipts');
  const [ageing, setAgeing] = useState<AgeingParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const detail = useDocumentDetail(salesService.getDocument);

  const [partyModal, setPartyModal] = useState<{ party: Party | null } | null>(null);
  const [docForm, setDocForm] = useState<FormKind | null>(null);
  const [fulfil, setFulfil] = useState<{ kind: FulfilKind; source: TradeDocument } | null>(null);
  const [converting, setConverting] = useState<TradeDocument | null>(null);
  const [receiptForm, setReceiptForm] = useState<{ partyId?: number; documentId?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadLists = useCallback(async () => {
    setLoadError('');
    try {
      const a = await salesService.receivablesAgeing();
      setAgeing(a.data.data);
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not load sales. Please refresh the page.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const pagedLists = [quotations, orders, deliveries, invoices, creditNotes, receipts];
  const refreshAll = async () => {
    // Reload whatever has been opened so far; unopened tabs load fresh when shown.
    await Promise.all([loadLists(), masters.reloadParties(), ...pagedLists.filter((l) => l.loaded).map((l) => l.reload())]);
  };

  async function submitDocument(create: () => Promise<{ data: { data: TradeDocument } }>, close: () => void) {
    setSubmitting(true);
    setFormError('');
    try {
      const res = await create();
      close();
      detail.setDocument(res.data.data);
      await refreshAll();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveParty(payload: PartyRequest) {
    setSubmitting(true);
    setFormError('');
    try {
      if (partyModal?.party) await partyService.update(partyModal.party.id, payload);
      else await partyService.create(payload);
      setPartyModal(null);
      await masters.reloadParties();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDocForm(payload: DocumentRequest) {
    const create =
      docForm === 'quotation' ? salesService.createQuotation : docForm === 'order' ? salesService.createOrder : salesService.createInvoice;
    submitDocument(() => create(payload), () => setDocForm(null));
  }

  function handleFulfil(payload: DocumentRequest) {
    const create =
      fulfil?.kind === 'delivery' ? salesService.createDelivery : fulfil?.kind === 'invoice' ? salesService.createInvoice : salesService.createCreditNote;
    submitDocument(() => create(payload), () => setFulfil(null));
  }

  function handleConvert(payload: ConvertQuotationRequest) {
    if (!converting) return;
    const id = converting.id;
    submitDocument(() => salesService.convertQuotation(id, payload), () => setConverting(null));
  }

  async function handleReceipt(payload: PaymentRequest) {
    setSubmitting(true);
    setFormError('');
    try {
      await salesService.recordReceipt(payload);
      setReceiptForm(null);
      await refreshAll();
      if (detail.document) await detail.open(detail.document.id);
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function openFulfil(kind: FulfilKind, source: TradeDocument) {
    setFormError('');
    detail.close();
    setFulfil({ kind, source });
  }

  function openForm(kind: FormKind) {
    setFormError('');
    setDocForm(kind);
  }

  function renderDetailActions(doc: TradeDocument) {
    const busy = detail.busy;
    const refresh = () => refreshAll();
    switch (doc.docType) {
      case 'QUOTATION':
        return doc.status === 'OPEN' ? (
          <>
            {canCreate && (
              <Button
                onClick={() => {
                  setFormError('');
                  detail.close();
                  setConverting(doc);
                }}
              >
                Convert to order
              </Button>
            )}
            {canEdit && (
              <Button variant="secondary" loading={busy} onClick={() => detail.run(() => salesService.cancelQuotation(doc.id), refresh)}>
                Cancel quotation
              </Button>
            )}
          </>
        ) : null;
      case 'SALES_ORDER':
        return (
          <>
            {(doc.status === 'CONFIRMED' || doc.status === 'PARTIALLY_DELIVERED') && canCreate && (
              <Button onClick={() => openFulfil('delivery', doc)}>Deliver</Button>
            )}
            {doc.status === 'CONFIRMED' && canEdit && (
              <Button variant="secondary" loading={busy} onClick={() => detail.run(() => salesService.cancelOrder(doc.id), refresh)}>
                Cancel order
              </Button>
            )}
          </>
        );
      case 'DELIVERY_CHALLAN':
        return doc.status === 'POSTED' && canCreate ? <Button onClick={() => openFulfil('invoice', doc)}>Create invoice</Button> : null;
      case 'SALES_INVOICE':
        return (
          <>
            {(doc.status === 'UNPAID' || doc.status === 'PARTIALLY_PAID') && canCreate && (
              <Button
                onClick={() => {
                  setFormError('');
                  setReceiptForm({ partyId: doc.partyId, documentId: doc.id });
                }}
              >
                Record receipt
              </Button>
            )}
            {canCreate && doc.lines.some((l) => l.pendingQuantity > 0) && (
              <Button variant="secondary" onClick={() => openFulfil('return', doc)}>
                Sales return
              </Button>
            )}
          </>
        );
      default:
        return null;
    }
  }

  function renderTabActions() {
    if (!canCreate) return null;
    switch (tab) {
      case 'customers':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => { setFormError(''); setPartyModal({ party: null }); }}>
            New customer
          </Button>
        );
      case 'quotations':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => openForm('quotation')}>
            New quotation
          </Button>
        );
      case 'orders':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => openForm('order')}>
            New sales order
          </Button>
        );
      case 'invoices':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => openForm('invoice')}>
            Direct invoice
          </Button>
        );
      case 'receipts':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => { setFormError(''); setReceiptForm({}); }}>
            Record receipt
          </Button>
        );
      default:
        return null;
    }
  }

  function renderTab() {
    if (loading) return <Empty>Loading…</Empty>;
    if (loadError) return <FormError>{loadError}</FormError>;
    const open = (d: { id: number }) => detail.open(d.id);
    switch (tab) {
      case 'customers':
        return masters.parties.length === 0 ? (
          <Empty>No customers yet. Add the businesses you sell to.</Empty>
        ) : (
          <PartyListTable parties={masters.parties} outstandingLabel="Receivable" onEdit={(party) => { setFormError(''); setPartyModal({ party }); }} />
        );
      case 'quotations':
        return (
          <PagedView list={quotations} searchPlaceholder="Search quotations by number or customer" empty="No quotations yet.">
            {(items) => <DocumentListTable documents={items} dueLabel="Valid until" onOpen={open} />}
          </PagedView>
        );
      case 'orders':
        return (
          <PagedView list={orders} searchPlaceholder="Search orders by number, customer or customer PO" empty="No sales orders yet.">
            {(items) => <DocumentListTable documents={items} dueLabel="Expected" onOpen={open} />}
          </PagedView>
        );
      case 'deliveries':
        return (
          <PagedView list={deliveries} searchPlaceholder="Search deliveries" empty="No deliveries yet. Open a sales order and choose “Deliver”.">
            {(items) => <DocumentListTable documents={items} onOpen={open} />}
          </PagedView>
        );
      case 'invoices':
        return (
          <PagedView
            list={invoices}
            searchPlaceholder="Search invoices by number or customer"
            empty="No invoices yet. Invoice a delivery challan, or create a direct invoice."
          >
            {(items) => <DocumentListTable documents={items} dueLabel="Due" showBalance onOpen={open} />}
          </PagedView>
        );
      case 'returns':
        return (
          <PagedView list={creditNotes} searchPlaceholder="Search sales returns" empty="No sales returns.">
            {(items) => <DocumentListTable documents={items} onOpen={open} />}
          </PagedView>
        );
      case 'receipts':
        return (
          <PagedView list={receipts} searchPlaceholder="Search receipts by number, customer or UTR" empty="No customer receipts yet.">
            {(items) => <PaymentListTable payments={items} />}
          </PagedView>
        );
      case 'receivables':
        return ageing.length === 0 ? <Empty>Nothing due from customers.</Empty> : <AgeingTable rows={ageing} onOpenDocument={(id) => detail.open(id)} />;
      case 'reminders':
        return <RemindersTab canEdit={canEdit} isAdmin={hasRole('ADMIN')} />;
    }
  }

  const formConfig = docForm ? FORM_CONFIG[docForm] : null;
  const fulfilConfig = fulfil ? FULFIL_CONFIG[fulfil.kind] : null;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Sales"
        subtitle="Customers, quotations, orders, deliveries and GST invoices — from quote to cash."
        actions={renderTabActions()}
      />

      {masters.error && <FormError>{masters.error}</FormError>}

      <Card>
        <TabPanel>
          <Tabs
            activeKey={tab}
            onChange={(key) => setTab(key as TabKey)}
            items={[
              { key: 'customers', label: 'Customers' },
              { key: 'quotations', label: 'Quotations' },
              { key: 'orders', label: 'Orders' },
              { key: 'deliveries', label: 'Deliveries' },
              { key: 'invoices', label: 'Invoices' },
              { key: 'returns', label: 'Returns' },
              { key: 'receipts', label: 'Receipts' },
              { key: 'receivables', label: 'Receivables' },
              { key: 'reminders', label: 'Reminders' },
            ]}
          />
        </TabPanel>
        {renderTab()}
      </Card>

      <PartyFormModal
        open={!!partyModal}
        party={partyModal?.party}
        defaultType="CUSTOMER"
        submitting={submitting}
        error={formError}
        onClose={() => setPartyModal(null)}
        onSubmit={handleSaveParty}
      />

      <DocumentFormModal
        open={!!docForm}
        title={formConfig?.title ?? ''}
        submitLabel={formConfig?.submit ?? ''}
        partyLabel="Customer"
        parties={masters.parties}
        products={masters.products}
        warehouses={masters.warehouses}
        companyState={masters.companyState}
        dueLabel={formConfig?.due}
        warehouseMode={formConfig?.warehouse ?? 'hidden'}
        warehouseLabel="Ship from"
        warehouseHint={docForm === 'order' ? 'Available stock here is reserved for the order' : undefined}
        partyReferenceLabel={formConfig?.ref}
        roundToRupee={docForm === 'invoice'}
        submitting={submitting}
        error={formError}
        onClose={() => setDocForm(null)}
        onSubmit={handleDocForm}
      />

      <FulfilDocumentModal
        open={!!fulfil}
        title={fulfilConfig ? `${fulfilConfig.title} — ${fulfil?.source.docNumber}` : ''}
        intro={fulfilConfig?.intro ?? ''}
        submitLabel={fulfilConfig?.submit ?? ''}
        source={fulfil?.source ?? null}
        doneLabel={fulfilConfig?.done ?? ''}
        quantityLabel={fulfilConfig?.qty ?? ''}
        warehouseMode={fulfil?.kind === 'return' ? 'required' : 'hidden'}
        warehouseLabel="Return into"
        warehouses={masters.warehouses}
        partyReferenceLabel={fulfil?.kind === 'delivery' ? 'Transport / LR no.' : undefined}
        dueLabel={fulfil?.kind === 'invoice' ? 'Due date' : undefined}
        prefillPending={fulfil?.kind !== 'return'}
        roundToRupee={fulfil?.kind !== 'delivery'}
        submitting={submitting}
        error={formError}
        onClose={() => setFulfil(null)}
        onSubmit={handleFulfil}
      />

      <ConvertQuotationModal
        quotation={converting}
        warehouses={masters.warehouses}
        submitting={submitting}
        error={formError}
        onClose={() => setConverting(null)}
        onSubmit={handleConvert}
      />

      <PaymentFormModal
        open={!!receiptForm}
        title="Record customer receipt"
        partyLabel="Customer"
        parties={masters.parties}
        loadOpenDocuments={(partyId) =>
          salesService
            .listInvoices({ partyId, status: ['UNPAID', 'PARTIALLY_PAID'], size: 200 })
            .then((res) => res.data.data.content)
        }
        initialPartyId={receiptForm?.partyId}
        initialDocumentId={receiptForm?.documentId}
        submitting={submitting}
        error={formError}
        onClose={() => setReceiptForm(null)}
        onSubmit={handleReceipt}
      />

      {!fulfil && !receiptForm && !converting && (
        <DocumentDetailModal
          document={detail.document}
          loading={detail.loading}
          error={detail.error}
          actions={detail.document ? renderDetailActions(detail.document) : null}
          extra={
            detail.document?.docType === 'SALES_INVOICE' ? (
              <InvoiceCompliancePanel key={detail.document.id} invoice={detail.document} canCreate={canCreate} canEdit={canEdit} />
            ) : null
          }
          onOpenLinked={(id) => detail.open(id)}
          onClose={detail.close}
        />
      )}
    </div>
  );
}
