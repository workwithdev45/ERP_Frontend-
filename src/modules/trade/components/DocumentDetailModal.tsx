import type { ReactNode } from 'react';
import styled from 'styled-components';
import { FormError } from '@/components/common/FormError/FormError';
import { Modal } from '@/components/common/Modal/Modal';
import type { DocType, TradeDocument } from '../types/trade.types';
import { DOC_LABEL, formatDate, formatMoney, paymentModeLabel } from '../utils/format';
import { StatusBadge } from './StatusBadge';
import { TotalsPanel } from './TotalsPanel';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
  margin-left: auto;
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  margin: 0;

  dt {
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    margin: 2px 0 0;
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.textBody};
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};

  h3 {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textStrong};
  }
`;

const Scroll = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Grid = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSize.sm};

  th {
    text-align: left;
    padding: ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.bgSubtle};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }

  td {
    padding: ${({ theme }) => theme.space[2]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textBody};
  }

  tr:last-child td {
    border-bottom: none;
  }

  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .muted {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSize.xs};
  }
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: inherit;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
  align-items: flex-start;
`;

const Notes = styled.p`
  flex: 1 1 260px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textBody};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: pre-wrap;
`;

/** What the fulfilled column means on each document type. */
const DONE_LABEL: Partial<Record<DocType, string>> = {
  PURCHASE_ORDER: 'Received',
  GOODS_RECEIPT: 'Billed',
  PURCHASE_BILL: 'Returned',
  SALES_ORDER: 'Delivered',
  DELIVERY_CHALLAN: 'Invoiced',
  SALES_INVOICE: 'Returned',
};

const DUE_LABEL: Partial<Record<DocType, string>> = {
  PURCHASE_ORDER: 'Expected',
  QUOTATION: 'Valid until',
  SALES_ORDER: 'Expected',
  PURCHASE_BILL: 'Due',
  SALES_INVOICE: 'Due',
};

interface DocumentDetailModalProps {
  document: TradeDocument | null;
  loading?: boolean;
  error?: string;
  /** Workflow buttons for the document's current status (approve, receive, bill, deliver, ...). */
  actions?: ReactNode;
  onOpenLinked: (id: number) => void;
  onClose: () => void;
}

export function DocumentDetailModal({ document: doc, loading, error, actions, onOpenLinked, onClose }: DocumentDetailModalProps) {
  if (!doc) {
    return loading ? (
      <Modal open title="Loading…" onClose={onClose}>
        <p>Loading…</p>
      </Modal>
    ) : null;
  }

  const doneLabel = DONE_LABEL[doc.docType];
  const isBilling = doc.docType === 'PURCHASE_BILL' || doc.docType === 'SALES_INVOICE';
  const isNote = doc.docType === 'DEBIT_NOTE' || doc.docType === 'CREDIT_NOTE';
  const showReserved = doc.docType === 'SALES_ORDER';

  return (
    <Modal open size="xl" title={`${DOC_LABEL[doc.docType]} ${doc.docNumber}`} onClose={onClose}>
      <Body>
        <TitleRow>
          <StatusBadge status={doc.status} />
          {doc.reverseCharge && <span>Reverse charge</span>}
          <Actions>{actions}</Actions>
        </TitleRow>
        {error && <FormError>{error}</FormError>}

        <Facts>
          <div>
            <dt>Party</dt>
            <dd>{doc.partyName}</dd>
          </div>
          {doc.partyGstin && (
            <div>
              <dt>GSTIN</dt>
              <dd>{doc.partyGstin}</dd>
            </div>
          )}
          <div>
            <dt>Date</dt>
            <dd>{formatDate(doc.docDate)}</dd>
          </div>
          {DUE_LABEL[doc.docType] && (
            <div>
              <dt>{DUE_LABEL[doc.docType]}</dt>
              <dd>{formatDate(doc.dueDate)}</dd>
            </div>
          )}
          {doc.warehouseName && (
            <div>
              <dt>Warehouse</dt>
              <dd>{doc.warehouseName}</dd>
            </div>
          )}
          <div>
            <dt>Place of supply</dt>
            <dd>
              {doc.placeOfSupply ?? '—'} ({doc.interState ? 'IGST' : 'CGST + SGST'})
            </dd>
          </div>
          {doc.partyReference && (
            <div>
              <dt>Party reference</dt>
              <dd>{doc.partyReference}</dd>
            </div>
          )}
          {doc.sourceDocumentId && (
            <div>
              <dt>Created from</dt>
              <dd>
                <LinkButton type="button" onClick={() => onOpenLinked(doc.sourceDocumentId!)}>
                  {doc.sourceDocumentNumber}
                </LinkButton>
              </dd>
            </div>
          )}
          <div>
            <dt>Created by</dt>
            <dd>{doc.createdBy ?? '—'}</dd>
          </div>
          {doc.approvedBy && (
            <div>
              <dt>Approved by</dt>
              <dd>{doc.approvedBy}</dd>
            </div>
          )}
          {isBilling && (
            <div>
              <dt>Balance</dt>
              <dd>{formatMoney(doc.balance)}</dd>
            </div>
          )}
          {isNote && (
            <>
              <div>
                <dt>Applied to {doc.sourceDocumentNumber}</dt>
                <dd>{formatMoney(doc.settledAmount)}</dd>
              </div>
              {doc.balance > 0 && (
                <div>
                  <dt>{doc.docType === 'CREDIT_NOTE' ? 'Credit owed to customer' : 'Credit due from vendor'}</dt>
                  <dd>{formatMoney(doc.balance)}</dd>
                </div>
              )}
            </>
          )}
        </Facts>

        <Section>
          <h3>Lines</h3>
          <Scroll>
            <Grid>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>HSN</th>
                  <th className="num">Qty</th>
                  {doneLabel && <th className="num">{doneLabel}</th>}
                  {showReserved && <th className="num">Reserved</th>}
                  <th className="num">Rate</th>
                  <th className="num">Disc</th>
                  <th className="num">Taxable</th>
                  <th className="num">GST</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {doc.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="muted">{line.lineNo}</td>
                    <td>
                      {line.productName}
                      <div className="muted">{line.sku}</div>
                    </td>
                    <td className="muted">{line.hsnCode ?? '—'}</td>
                    <td className="num">
                      {line.quantity} {line.uom ?? ''}
                    </td>
                    {doneLabel && <td className="num">{line.fulfilledQuantity}</td>}
                    {showReserved && <td className="num">{line.itemType === 'STOCK' ? line.reservedQuantity : '—'}</td>}
                    <td className="num">{formatMoney(line.rate)}</td>
                    <td className="num">{line.discountPercent ? `${line.discountPercent}%` : '—'}</td>
                    <td className="num">{formatMoney(line.taxableAmount)}</td>
                    <td className="num">
                      {formatMoney(line.cgstAmount + line.sgstAmount + line.igstAmount)}
                      <div className="muted">{line.gstRate}%</div>
                    </td>
                    <td className="num">{formatMoney(line.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </Grid>
          </Scroll>
        </Section>

        <Bottom>
          <Notes>{doc.notes}</Notes>
          <TotalsPanel
            totals={{
              taxable: doc.taxableAmount,
              cgst: doc.cgstAmount,
              sgst: doc.sgstAmount,
              igst: doc.igstAmount,
              roundOff: doc.roundOff,
              total: doc.totalAmount,
            }}
            interState={doc.interState}
            reverseCharge={doc.reverseCharge}
          />
        </Bottom>

        {doc.linkedDocuments.length > 0 && (
          <Section>
            <h3>Follow-on documents</h3>
            <Scroll>
              <Grid style={{ minWidth: 480 }}>
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.linkedDocuments.map((linked) => (
                    <tr key={linked.id}>
                      <td>
                        <LinkButton type="button" onClick={() => onOpenLinked(linked.id)}>
                          {linked.docNumber}
                        </LinkButton>
                      </td>
                      <td>{DOC_LABEL[linked.docType]}</td>
                      <td>{formatDate(linked.docDate)}</td>
                      <td>
                        <StatusBadge status={linked.status} />
                      </td>
                      <td className="num">{formatMoney(linked.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </Grid>
            </Scroll>
          </Section>
        )}

        {doc.payments.length > 0 && (
          <Section>
            <h3>{doc.docType === 'SALES_INVOICE' ? 'Receipts' : 'Payments'}</h3>
            <Scroll>
              <Grid style={{ minWidth: 420 }}>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Date</th>
                    <th>Mode</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.payments.map((p) => (
                    <tr key={p.paymentId}>
                      <td>{p.paymentNumber}</td>
                      <td>{formatDate(p.paymentDate)}</td>
                      <td>{paymentModeLabel(p.mode)}</td>
                      <td className="num">{formatMoney(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </Grid>
            </Scroll>
          </Section>
        )}
      </Body>
    </Modal>
  );
}
