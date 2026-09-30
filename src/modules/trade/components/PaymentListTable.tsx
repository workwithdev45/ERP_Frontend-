import { Table, TableScroll, Td, Th } from '@/components/common/Table/Table';
import type { Payment } from '../types/trade.types';
import { formatDate, formatMoney, paymentModeLabel } from '../utils/format';

export function PaymentListTable({ payments }: { payments: Payment[] }) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <Th>Number</Th>
            <Th>Party</Th>
            <Th>Date</Th>
            <Th>Mode</Th>
            <Th>Applied to</Th>
            <Th $align="right">Amount</Th>
            <Th $align="right">Advance</Th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <Td>{payment.paymentNumber}</Td>
              <Td>{payment.partyName}</Td>
              <Td $muted>{formatDate(payment.paymentDate)}</Td>
              <Td $muted>
                {paymentModeLabel(payment.mode)}
                {payment.reference && ` · ${payment.reference}`}
              </Td>
              <Td $muted>{payment.allocations.map((a) => `${a.documentNumber} (${formatMoney(a.amount)})`).join(', ') || '—'}</Td>
              <Td $numeric>{formatMoney(payment.amount)}</Td>
              <Td $numeric>{payment.unallocatedAmount > 0 ? formatMoney(payment.unallocatedAmount) : '—'}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}
