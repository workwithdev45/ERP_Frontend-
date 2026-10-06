import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import styled, { createGlobalStyle } from 'styled-components';
import { companyService } from '@/modules/company/services/companyService';
import type { CompanyDetails } from '@/modules/company/types/company.types';
import { complianceService } from '@/modules/sales/services/complianceService';
import type { EInvoice } from '@/modules/sales/types/compliance.types';
import { partyService } from '../services/partyService';
import type { DocType, Party, TradeDocument } from '../types/trade.types';
import { amountInWords } from '../utils/amountInWords';
import { DOC_LABEL, formatDate, formatMoney } from '../utils/format';

/**
 * While mounted, printing shows only this view (on A4) instead of the app behind it. Mounted only
 * for the duration of one print, so other pages' print styles (e.g. Reports) are unaffected.
 */
const PrintOnly = createGlobalStyle`
  @media screen {
    .doc-print-root {
      display: none;
    }
  }

  @media print {
    @page {
      size: A4;
      margin: 12mm;
    }

    body > *:not(.doc-print-root) {
      display: none !important;
    }

    .doc-print-root.print-area {
      position: static;
    }
  }
`;

const Sheet = styled.div`
  position: relative;
  color: #000;
  background: #fff;
  font-family: ${({ theme }) => theme.font.family};
  font-size: 9pt;
  line-height: 1.4;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #555;
    padding: 4px 6px;
    vertical-align: top;
  }

  th {
    background: #eee;
    font-weight: 600;
    text-align: left;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .num {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .muted {
    color: #444;
    font-size: 8pt;
  }
`;

const Watermark = styled.div`
  position: absolute;
  top: 35%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 64pt;
  font-weight: 700;
  color: rgba(200, 0, 0, 0.15);
  transform: rotate(-20deg);
  pointer-events: none;
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 14pt;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 8px;
  border: 1px solid #555;
  border-bottom: none;

  h2 {
    margin: 0 0 2px;
    font-size: 13pt;
  }
`;

const Meta = styled.dl`
  display: grid;
  grid-template-columns: auto auto;
  gap: 1px 10px;
  margin: 0;
  align-content: start;

  dt {
    color: #444;
  }

  dd {
    margin: 0;
    font-weight: 600;
  }
`;

const Qr = styled.img`
  width: 110px;
  height: 110px;
`;

const Parties = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #555;
  border-bottom: none;

  > div {
    padding: 8px;
  }

  > div + div {
    border-left: 1px solid #555;
  }

  h3 {
    margin: 0 0 2px;
    font-size: 8pt;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  strong {
    font-size: 10pt;
  }
`;

const Irn = styled.div`
  padding: 6px 8px;
  border: 1px solid #555;
  border-bottom: none;
  word-break: break-all;
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  border: 1px solid #555;
  border-top: none;

  > div:first-child {
    padding: 8px;
    border-right: 1px solid #555;
  }

  table td {
    border: none;
    border-bottom: 1px solid #ccc;
  }

  tr.total td {
    font-weight: 700;
    font-size: 10pt;
    border-bottom: none;
  }
`;

const Section = styled.div`
  margin-top: 10px;
  break-inside: avoid;

  h3 {
    margin: 0 0 4px;
    font-size: 9pt;
  }
`;

const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 12px;
  margin-top: 10px;
  break-inside: avoid;

  .sign {
    text-align: right;
  }

  .sign-space {
    height: 48px;
  }
`;

const SALES_TYPES: DocType[] = ['QUOTATION', 'SALES_ORDER', 'DELIVERY_CHALLAN', 'SALES_INVOICE', 'CREDIT_NOTE'];

const DUE_LABEL: Partial<Record<DocType, string>> = {
  PURCHASE_ORDER: 'Expected by',
  QUOTATION: 'Valid until',
  SALES_ORDER: 'Expected by',
  PURCHASE_BILL: 'Due date',
  SALES_INVOICE: 'Due date',
};

function addressLines(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(', ');
}

interface HsnRow {
  hsn: string;
  rate: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
}

/** GST invoices summarise tax by HSN code and rate. */
function hsnSummary(doc: TradeDocument): HsnRow[] {
  const rows = new Map<string, HsnRow>();
  for (const line of doc.lines) {
    const hsn = line.hsnCode ?? '—';
    const key = `${hsn}|${line.gstRate}`;
    const row = rows.get(key) ?? { hsn, rate: line.gstRate, taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    row.taxable += line.taxableAmount;
    row.cgst += line.cgstAmount;
    row.sgst += line.sgstAmount;
    row.igst += line.igstAmount;
    rows.set(key, row);
  }
  return [...rows.values()];
}

interface DocumentPrintViewProps {
  doc: TradeDocument;
  /** Called once the print dialog closes (printed, saved as PDF or cancelled). */
  onDone: () => void;
}

/** Printable A4 layout of a sales or purchase document; opens the browser's print dialog ("Save as PDF"). */
export function DocumentPrintView({ doc, onDone }: DocumentPrintViewProps) {
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [einvoice, setEinvoice] = useState<EInvoice | null>(null);
  const [qr, setQr] = useState('');
  const [ready, setReady] = useState(false);

  // Everything beyond the document itself is optional: a failed lookup just leaves that block out.
  useEffect(() => {
    let cancelled = false;
    const isInvoice = doc.docType === 'SALES_INVOICE';
    Promise.allSettled([
      companyService.get(),
      partyService.get(doc.partyId),
      isInvoice ? complianceService.status(doc.id) : Promise.resolve(null),
    ]).then(async ([companyRes, partyRes, complianceRes]) => {
      if (cancelled) return;
      if (companyRes.status === 'fulfilled') setCompany(companyRes.value.data.data);
      if (partyRes.status === 'fulfilled') setParty(partyRes.value.data.data);
      const irn = complianceRes.status === 'fulfilled' ? complianceRes.value?.data.data.einvoice : null;
      if (irn && irn.status === 'GENERATED') {
        setEinvoice(irn);
        const dataUrl = await QRCode.toDataURL(irn.signedQr, { errorCorrectionLevel: 'M', margin: 0, width: 220 }).catch(() => '');
        if (!cancelled) setQr(dataUrl);
      }
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [doc.docType, doc.id, doc.partyId]);

  // Kept in a ref so a new onDone each parent render doesn't re-run the print effect below.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!ready) return;
    // The browser suggests the page title as the PDF file name.
    const previousTitle = window.document.title;
    window.document.title = `${DOC_LABEL[doc.docType]} ${doc.docNumber}`;
    const finish = () => onDoneRef.current();
    window.addEventListener('afterprint', finish, { once: true });
    const timer = window.setTimeout(() => window.print(), 50);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('afterprint', finish);
      window.document.title = previousTitle;
    };
  }, [ready, doc.docType, doc.docNumber]);

  const hsnRows = useMemo(() => hsnSummary(doc), [doc]);

  if (!ready) return null;

  const isSales = SALES_TYPES.includes(doc.docType);
  const title = doc.docType === 'SALES_INVOICE' ? 'Tax Invoice' : DOC_LABEL[doc.docType];
  const companyName = company?.legalName || company?.name || '';
  const dueLabel = DUE_LABEL[doc.docType];
  const showTax = doc.cgstAmount + doc.sgstAmount + doc.igstAmount > 0;

  return createPortal(
    <div className="doc-print-root print-area">
      <PrintOnly />
      <Sheet>
        {doc.status === 'CANCELLED' && <Watermark>CANCELLED</Watermark>}
        <Title>{title}</Title>

        <Header>
          <div>
            <h2>{companyName}</h2>
            {company && (
              <>
                <div>{addressLines([company.addressLine1, company.addressLine2])}</div>
                <div>{addressLines([company.city, company.state, company.pincode])}</div>
                {company.gstin && (
                  <div>
                    GSTIN: <strong>{company.gstin}</strong>
                  </div>
                )}
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Meta>
              <dt>{DOC_LABEL[doc.docType]} no.</dt>
              <dd>{doc.docNumber}</dd>
              <dt>Date</dt>
              <dd>{formatDate(doc.docDate)}</dd>
              {dueLabel && doc.dueDate && (
                <>
                  <dt>{dueLabel}</dt>
                  <dd>{formatDate(doc.dueDate)}</dd>
                </>
              )}
              {doc.sourceDocumentNumber && (
                <>
                  <dt>Against</dt>
                  <dd>{doc.sourceDocumentNumber}</dd>
                </>
              )}
              {doc.partyReference && (
                <>
                  <dt>{isSales ? 'Buyer ref.' : 'Vendor ref.'}</dt>
                  <dd>{doc.partyReference}</dd>
                </>
              )}
            </Meta>
            {qr && <Qr src={qr} alt="E-invoice QR code" />}
          </div>
        </Header>

        {einvoice && (
          <Irn>
            <strong>IRN:</strong> {einvoice.irn} &nbsp;·&nbsp; <strong>Ack no.:</strong> {einvoice.ackNo} &nbsp;·&nbsp;{' '}
            <strong>Ack date:</strong> {einvoice.ackDate}
          </Irn>
        )}

        <Parties>
          <div>
            <h3>{isSales ? 'Bill to' : 'Vendor'}</h3>
            <strong>{doc.partyName}</strong>
            {party && <div>{addressLines([party.addressLine1, party.city, party.state, party.pincode])}</div>}
            {doc.partyGstin && <div>GSTIN: {doc.partyGstin}</div>}
            {party?.phone && <div>Phone: {party.phone}</div>}
          </div>
          <div>
            <h3>Supply details</h3>
            <div>Place of supply: {doc.placeOfSupply ?? '—'}</div>
            <div>Tax type: {doc.interState ? 'Inter-state (IGST)' : 'Intra-state (CGST + SGST)'}</div>
            <div>Reverse charge: {doc.reverseCharge ? 'Yes' : 'No'}</div>
            {doc.warehouseName && <div>Warehouse: {doc.warehouseName}</div>}
          </div>
        </Parties>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>HSN/SAC</th>
              <th className="num">Qty</th>
              <th className="num">Rate</th>
              <th className="num">Disc.</th>
              <th className="num">Taxable value</th>
              <th className="num">GST</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.lines.map((line) => (
              <tr key={line.id}>
                <td>{line.lineNo}</td>
                <td>
                  {line.productName}
                  {line.sku && <div className="muted">{line.sku}</div>}
                </td>
                <td>{line.hsnCode ?? '—'}</td>
                <td className="num">
                  {line.quantity} {line.uom ?? ''}
                </td>
                <td className="num">{formatMoney(line.rate)}</td>
                <td className="num">{line.discountPercent ? `${line.discountPercent}%` : '—'}</td>
                <td className="num">{formatMoney(line.taxableAmount)}</td>
                <td className="num">
                  {formatMoney(line.cgstAmount + line.sgstAmount + line.igstAmount)}
                  <div className="muted">@{line.gstRate}%</div>
                </td>
                <td className="num">{formatMoney(line.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Summary>
          <div>
            <div className="muted">Amount in words</div>
            <strong>{amountInWords(doc.totalAmount)}</strong>
            {doc.notes && (
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
                <div className="muted">Notes</div>
                {doc.notes}
              </div>
            )}
          </div>
          <table>
            <tbody>
              <tr>
                <td>Taxable value</td>
                <td className="num">{formatMoney(doc.taxableAmount)}</td>
              </tr>
              {doc.interState ? (
                <tr>
                  <td>IGST</td>
                  <td className="num">{formatMoney(doc.igstAmount)}</td>
                </tr>
              ) : (
                <>
                  <tr>
                    <td>CGST</td>
                    <td className="num">{formatMoney(doc.cgstAmount)}</td>
                  </tr>
                  <tr>
                    <td>SGST</td>
                    <td className="num">{formatMoney(doc.sgstAmount)}</td>
                  </tr>
                </>
              )}
              {doc.roundOff !== 0 && (
                <tr>
                  <td>Round off</td>
                  <td className="num">{formatMoney(doc.roundOff)}</td>
                </tr>
              )}
              <tr className="total">
                <td>Total</td>
                <td className="num">{formatMoney(doc.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </Summary>

        {showTax && (
          <Section>
            <h3>Tax summary (HSN/SAC)</h3>
            <table>
              <thead>
                <tr>
                  <th>HSN/SAC</th>
                  <th className="num">Taxable value</th>
                  <th className="num">Rate</th>
                  {doc.interState ? (
                    <th className="num">IGST</th>
                  ) : (
                    <>
                      <th className="num">CGST</th>
                      <th className="num">SGST</th>
                    </>
                  )}
                  <th className="num">Total tax</th>
                </tr>
              </thead>
              <tbody>
                {hsnRows.map((row) => (
                  <tr key={`${row.hsn}|${row.rate}`}>
                    <td>{row.hsn}</td>
                    <td className="num">{formatMoney(row.taxable)}</td>
                    <td className="num">{row.rate}%</td>
                    {doc.interState ? (
                      <td className="num">{formatMoney(row.igst)}</td>
                    ) : (
                      <>
                        <td className="num">{formatMoney(row.cgst)}</td>
                        <td className="num">{formatMoney(row.sgst)}</td>
                      </>
                    )}
                    <td className="num">{formatMoney(row.cgst + row.sgst + row.igst)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        <Footer>
          <div className="muted">This is a computer-generated document.</div>
          <div className="sign">
            For <strong>{companyName}</strong>
            <div className="sign-space" />
            Authorised signatory
          </div>
        </Footer>
      </Sheet>
    </div>,
    window.document.body,
  );
}
