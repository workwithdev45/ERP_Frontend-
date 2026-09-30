export type CsvCell = string | number | null | undefined;

function escape(cell: CsvCell): string {
  if (cell == null) return '';
  const text = String(cell);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(header: string[], rows: CsvCell[][]): string {
  return [header, ...rows].map((row) => row.map(escape).join(',')).join('\r\n');
}

/** Downloads rows as a CSV that Excel opens directly (UTF-8 BOM keeps ₹ and Indian names intact). */
export function downloadCsv(filename: string, header: string[], rows: CsvCell[][]) {
  const blob = new Blob(['﻿', toCsv(header, rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
