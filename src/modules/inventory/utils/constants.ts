export const GST_RATE_OPTIONS = [
  { value: '0', label: '0% (Nil-rated)' },
  { value: '5', label: '5%' },
  { value: '12', label: '12%' },
  { value: '18', label: '18%' },
  { value: '28', label: '28%' },
];

export const ITEM_TYPE_OPTIONS = [
  { value: 'STOCK', label: 'Stock item' },
  { value: 'NON_STOCK', label: 'Non-stock item' },
  { value: 'SERVICE', label: 'Service' },
];

export const UOM_OPTIONS = [
  'Pcs', 'Kg', 'g', 'L', 'mL', 'Box', 'Dozen', 'Meter', 'Set', 'Unit',
];

export const ADJUSTMENT_REASON_OPTIONS = [
  { value: 'DAMAGE', label: 'Damaged' },
  { value: 'LOST', label: 'Lost' },
  { value: 'FOUND', label: 'Found' },
  { value: 'RECOUNT', label: 'Physical recount' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'OTHER', label: 'Other' },
];
