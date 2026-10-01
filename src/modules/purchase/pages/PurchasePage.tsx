import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { apiErrorMessage } from '@/api/apiError';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { FormError } from '@/components/common/FormError/FormError';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Tabs } from '@/components/common/Tabs/Tabs';
import { usePermission } from '@/hooks/usePermission';
import { AgeingTable } from '@/modules/trade/components/AgeingTable';
import { DocumentDetailModal } from '@/modules/trade/components/DocumentDetailModal';
import { DocumentFormModal, type DocumentFormInitial } from '@/modules/trade/components/DocumentFormModal';
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
  ReorderSuggestion,
  TradeDocument,
} from '@/modules/trade/types/trade.types';
import { ReorderTable } from '../components/ReorderTable';
import { purchaseService } from '../services/purchaseService';

const Empty = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TabPanel = styled.div`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]} 0;
`;

type TabKey = 'vendors' | 'orders' | 'receipts' | 'bills' | 'returns' | 'payments' | 'payables' | 'reorder';
type FulfilKind = 'receipt' | 'bill' | 'return';

const FULFIL_CONFIG: Record<FulfilKind, { title: string; intro: string; submit: string; done: string; qty: string }> = {
  receipt: {
    title: 'Receive goods',
    intro: 'Record what arrived against this purchase order. Stock items are added to the warehouse at the order rate.',
    submit: 'Post goods receipt',
    done: 'Received',
    qty: 'Receive now',
  },
  bill: {
    title: 'Record vendor bill',
    intro: "Bill the received quantity. Enter the vendor's invoice number so you can match it later.",
    submit: 'Record bill',
    done: 'Billed',
    qty: 'Bill now',
  },
  return: {
    title: 'Return to vendor (debit note)',
    intro: 'Goods going back to the vendor leave stock, and the debit note reduces what you owe on this bill.',
    submit: 'Create debit note',
    done: 'Returned',
    qty: 'Return now',
  },
};

export function PurchasePage() {
  const { canAccess } = usePermission();
  const canCreate = canAccess('PURCHASE_CREATE');
  const canApprove = canAccess('PURCHASE_APPROVE');
  const canEdit = canAccess('PURCHASE_EDIT');

  const [tab, setTab] = useState<TabKey>('orders');
  const masters = useTradeMasters('VENDOR');

  // W15: each list is paged on the server and loads when its tab is opened.
  const orders = usePagedList(purchaseService.listOrders, tab === 'orders');
  const receipts = usePagedList(purchaseService.listReceipts, tab === 'receipts');
  const bills = usePagedList(purchaseService.listBills, tab === 'bills');
  const debitNotes = usePagedList(purchaseService.listDebitNotes, tab === 'returns');
  const payments = usePagedList(purchaseService.listPayments, tab === 'payments');
  const [ageing, setAgeing] = useState<AgeingParty[]>([]);
  const [reorder, setReorder] = useState<ReorderSuggestion[]>([]);
  const [selectedReorder, setSelectedReorder] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const detail = useDocumentDetail(purchaseService.getDocument);

  const [partyModal, setPartyModal] = useState<{ party: Party | null } | null>(null);
  const [docForm, setDocForm] = useState<{ kind: 'order' | 'bill'; initial?: DocumentFormInitial } | null>(null);
  const [fulfil, setFulfil] = useState<{ kind: FulfilKind; source: TradeDocument } | null>(null);
  const [paymentForm, setPaymentForm] = useState<{ partyId?: number; documentId?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadLists = useCallback(async () => {
    setLoadError('');
    try {
      const [a, s] = await Promise.all([purchaseService.payablesAgeing(), purchaseService.reorderSuggestions()]);
      setAgeing(a.data.data);
      setReorder(s.data.data);
      // Drop selections whose suggestion went away (e.g. now covered by the PO just created).
      setSelectedReorder((prev) => new Set(s.data.data.map((x) => x.productId).filter((id) => prev.has(id))));
    } catch (err) {
      setLoadError(apiErrorMessage(err, 'Could not load purchases. Please refresh the page.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const pagedLists = [orders, receipts, bills, debitNotes, payments];
  const refreshAll = async () => {
    // Reload whatever has been opened so far; unopened tabs load fresh when shown.
    await Promise.all([loadLists(), masters.reloadParties(), ...pagedLists.filter((l) => l.loaded).map((l) => l.reload())]);
  };

  /** Saves a document from a form, then shows it — the next workflow step is usually right there. */
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
    const create = docForm?.kind === 'bill' ? purchaseService.createBill : purchaseService.createOrder;
    submitDocument(() => create(payload), () => setDocForm(null));
  }

  function handleFulfil(payload: DocumentRequest) {
    const create =
      fulfil?.kind === 'receipt' ? purchaseService.createReceipt : fulfil?.kind === 'bill' ? purchaseService.createBill : purchaseService.createDebitNote;
    submitDocument(() => create(payload), () => setFulfil(null));
  }

  async function handlePayment(payload: PaymentRequest) {
    setSubmitting(true);
    setFormError('');
    try {
      await purchaseService.recordPayment(payload);
      setPaymentForm(null);
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

  function createPoFromReorder() {
    const picked = reorder.filter((s) => selectedReorder.has(s.productId));
    const vendors = new Set(picked.map((s) => s.lastVendorId).filter(Boolean));
    setFormError('');
    setDocForm({
      kind: 'order',
      initial: {
        partyId: vendors.size === 1 ? (picked[0].lastVendorId ?? undefined) : undefined,
        lines: picked.map((s) => ({ productId: s.productId, quantity: s.suggestedQuantity, rate: s.lastRate, gstRate: s.gstRate })),
      },
    });
  }

  function renderDetailActions(doc: TradeDocument) {
    const busy = detail.busy;
    const refresh = () => refreshAll();
    switch (doc.docType) {
      case 'PURCHASE_ORDER':
        return (
          <>
            {doc.status === 'DRAFT' && canApprove && (
              <Button loading={busy} onClick={() => detail.run(() => purchaseService.approveOrder(doc.id), refresh)}>
                Approve
              </Button>
            )}
            {(doc.status === 'APPROVED' || doc.status === 'PARTIALLY_RECEIVED') && canCreate && (
              <Button onClick={() => openFulfil('receipt', doc)}>Receive goods</Button>
            )}
            {(doc.status === 'DRAFT' || doc.status === 'APPROVED') && canEdit && (
              <Button variant="secondary" loading={busy} onClick={() => detail.run(() => purchaseService.cancelOrder(doc.id), refresh)}>
                Cancel order
              </Button>
            )}
          </>
        );
      case 'GOODS_RECEIPT':
        return doc.status === 'POSTED' && canCreate ? <Button onClick={() => openFulfil('bill', doc)}>Record bill</Button> : null;
      case 'PURCHASE_BILL':
        return (
          <>
            {(doc.status === 'UNPAID' || doc.status === 'PARTIALLY_PAID') && canCreate && (
              <Button
                onClick={() => {
                  setFormError('');
                  setPaymentForm({ partyId: doc.partyId, documentId: doc.id });
                }}
              >
                Record payment
              </Button>
            )}
            {doc.status !== 'CANCELLED' && canCreate && doc.lines.some((l) => l.pendingQuantity > 0) && (
              <Button variant="secondary" onClick={() => openFulfil('return', doc)}>
                Return goods
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
      case 'vendors':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => { setFormError(''); setPartyModal({ party: null }); }}>
            New vendor
          </Button>
        );
      case 'orders':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => { setFormError(''); setDocForm({ kind: 'order' }); }}>
            New purchase order
          </Button>
        );
      case 'bills':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => { setFormError(''); setDocForm({ kind: 'bill' }); }}>
            Direct bill
          </Button>
        );
      case 'payments':
        return (
          <Button leadingIcon={<PlusOutlined />} onClick={() => { setFormError(''); setPaymentForm({}); }}>
            Record payment
          </Button>
        );
      case 'reorder':
        return (
          <Button leadingIcon={<ShoppingCartOutlined />} disabled={selectedReorder.size === 0} onClick={createPoFromReorder}>
            Create PO from selected
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
      case 'vendors':
        return masters.parties.length === 0 ? (
          <Empty>No vendors yet. Add the suppliers you buy from.</Empty>
        ) : (
          <PartyListTable parties={masters.parties} outstandingLabel="Payable" onEdit={(party) => { setFormError(''); setPartyModal({ party }); }} />
        );
      case 'orders':
        return (
          <PagedView list={orders} searchPlaceholder="Search orders by number, vendor or reference" empty="No purchase orders yet.">
            {(items) => <DocumentListTable documents={items} dueLabel="Expected" onOpen={open} />}
          </PagedView>
        );
      case 'receipts':
        return (
          <PagedView
            list={receipts}
            searchPlaceholder="Search goods receipts"
            empty="No goods received yet. Open an approved purchase order and choose “Receive goods”."
          >
            {(items) => <DocumentListTable documents={items} onOpen={open} />}
          </PagedView>
        );
      case 'bills':
        return (
          <PagedView
            list={bills}
            searchPlaceholder="Search bills by number, vendor or vendor invoice no."
            empty="No bills yet. Bill a goods receipt, or record a direct bill for services and expenses."
          >
            {(items) => <DocumentListTable documents={items} dueLabel="Due" showBalance onOpen={open} />}
          </PagedView>
        );
      case 'returns':
        return (
          <PagedView list={debitNotes} searchPlaceholder="Search purchase returns" empty="No purchase returns.">
            {(items) => <DocumentListTable documents={items} onOpen={open} />}
          </PagedView>
        );
      case 'payments':
        return (
          <PagedView list={payments} searchPlaceholder="Search payments by number, vendor or UTR" empty="No vendor payments yet.">
            {(items) => <PaymentListTable payments={items} />}
          </PagedView>
        );
      case 'payables':
        return ageing.length === 0 ? <Empty>Nothing owed to vendors.</Empty> : <AgeingTable rows={ageing} onOpenDocument={(id) => detail.open(id)} />;
      case 'reorder':
        return reorder.length === 0 ? (
          <Empty>Every item is above its reorder level, counting what's already on order.</Empty>
        ) : (
          <ReorderTable
            suggestions={reorder}
            selected={selectedReorder}
            onToggle={(id) =>
              setSelectedReorder((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
          />
        );
    }
  }

  const fulfilConfig = fulfil ? FULFIL_CONFIG[fulfil.kind] : null;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Purchase"
        subtitle="Vendors, purchase orders, goods receipts and bills — from order to payment."
        actions={renderTabActions()}
      />

      {masters.error && <FormError>{masters.error}</FormError>}

      <Card>
        <TabPanel>
          <Tabs
            activeKey={tab}
            onChange={(key) => setTab(key as TabKey)}
            items={[
              { key: 'vendors', label: 'Vendors' },
              { key: 'orders', label: 'Orders' },
              { key: 'receipts', label: 'Goods receipts' },
              { key: 'bills', label: 'Bills' },
              { key: 'returns', label: 'Returns' },
              { key: 'payments', label: 'Payments' },
              { key: 'payables', label: 'Payables' },
              { key: 'reorder', label: `Reorder${reorder.length ? ` (${reorder.length})` : ''}` },
            ]}
          />
        </TabPanel>
        {renderTab()}
      </Card>

      <PartyFormModal
        open={!!partyModal}
        party={partyModal?.party}
        defaultType="VENDOR"
        submitting={submitting}
        error={formError}
        onClose={() => setPartyModal(null)}
        onSubmit={handleSaveParty}
      />

      <DocumentFormModal
        open={!!docForm}
        title={docForm?.kind === 'bill' ? 'Direct bill' : 'New purchase order'}
        submitLabel={docForm?.kind === 'bill' ? 'Record bill' : 'Save as draft'}
        partyLabel="Vendor"
        parties={masters.parties}
        products={masters.products}
        warehouses={masters.warehouses}
        companyState={masters.companyState}
        dueLabel={docForm?.kind === 'bill' ? 'Due date' : 'Expected delivery'}
        warehouseMode={docForm?.kind === 'bill' ? 'optional' : 'required'}
        warehouseLabel={docForm?.kind === 'bill' ? 'Receive into' : 'Deliver to'}
        partyReferenceLabel={docForm?.kind === 'bill' ? 'Vendor invoice no.' : undefined}
        showReverseCharge={docForm?.kind === 'bill'}
        roundToRupee={docForm?.kind === 'bill'}
        initial={docForm?.initial}
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
        warehouseMode={fulfil?.kind === 'bill' ? 'hidden' : 'required'}
        warehouseLabel={fulfil?.kind === 'return' ? 'Return from' : 'Receive into'}
        warehouses={masters.warehouses}
        partyReferenceLabel={fulfil?.kind === 'receipt' ? 'Vendor challan no.' : fulfil?.kind === 'bill' ? 'Vendor invoice no.' : undefined}
        dueLabel={fulfil?.kind === 'bill' ? 'Due date' : undefined}
        prefillPending={fulfil?.kind !== 'return'}
        roundToRupee={fulfil?.kind !== 'receipt'}
        submitting={submitting}
        error={formError}
        onClose={() => setFulfil(null)}
        onSubmit={handleFulfil}
      />

      <PaymentFormModal
        open={!!paymentForm}
        title="Record vendor payment"
        partyLabel="Vendor"
        parties={masters.parties}
        loadOpenDocuments={(partyId) =>
          purchaseService
            .listBills({ partyId, status: ['UNPAID', 'PARTIALLY_PAID'], size: 200 })
            .then((res) => res.data.data.content)
        }
        initialPartyId={paymentForm?.partyId}
        initialDocumentId={paymentForm?.documentId}
        submitting={submitting}
        error={formError}
        onClose={() => setPaymentForm(null)}
        onSubmit={handlePayment}
      />

      {!fulfil && !paymentForm && (
        <DocumentDetailModal
          document={detail.document}
          loading={detail.loading}
          error={detail.error}
          actions={detail.document ? renderDetailActions(detail.document) : null}
          onOpenLinked={(id) => detail.open(id)}
          onClose={detail.close}
        />
      )}
    </div>
  );
}
