import { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { formatMoney } from '@/modules/trade/utils/format';
import type { MonthlyPoint } from '../types/report.types';

const Wrap = styled.div`
  position: relative;
`;

const Legend = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  margin: 0 0 ${({ theme }) => theme.space[3]};
  padding: 0;
  list-style: none;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textBody};

  li {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const Swatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

const Tooltip = styled.div`
  position: absolute;
  pointer-events: none;
  min-width: 170px;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textBody};
  transform: translateX(-50%);

  strong {
    display: block;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.textStrong};
  }

  div {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: space-between;
  }

  span.value {
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.textStrong};
  }
`;

const HEIGHT = 220;
const PAD = { top: 8, right: 8, bottom: 26, left: 56 };
const BAR_GAP = 2;

function monthLabel(month: string, withYear = false) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', withYear ? { month: 'long', year: 'numeric' } : { month: 'short' });
}

/** Compact Indian-style axis labels: ₹0, ₹5k, ₹1.2L, ₹3Cr. */
function compactInr(value: number) {
  if (value >= 1e7) return `₹${+(value / 1e7).toFixed(1)}Cr`;
  if (value >= 1e5) return `₹${+(value / 1e5).toFixed(1)}L`;
  if (value >= 1e3) return `₹${+(value / 1e3).toFixed(1)}k`;
  return `₹${value}`;
}

function niceMax(value: number) {
  if (value <= 0) return 1000;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  // Four gridline intervals: these maxima keep every tick a round number (e.g. 40k → 10k, 20k, 30k).
  const step = [1, 2, 4, 8, 10].find((s) => s * magnitude >= value) ?? 10;
  return step * magnitude;
}

/** Bar with a 4px rounded top, square at the baseline. */
function barPath(x: number, y: number, w: number, h: number) {
  if (h <= 0) return '';
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

/** Monthly sales vs purchases (excl. GST) as grouped bars on a single axis. */
export function TrendChart({ points }: { points: MonthlyPoint[] }) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const series = [
    { key: 'sales' as const, label: 'Sales', color: theme.colors.chartSeries1 },
    { key: 'purchases' as const, label: 'Purchases', color: theme.colors.chartSeries2 },
  ];
  const max = niceMax(Math.max(...points.flatMap((p) => [p.sales, p.purchases]), 0));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const plotW = width - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = plotW / points.length;
  const barW = Math.min(28, (band * 0.6 - BAR_GAP) / 2);
  const y = (v: number) => PAD.top + plotH - (Math.max(v, 0) / max) * plotH;

  return (
    <Wrap ref={ref}>
      <Legend aria-hidden="true">
        {series.map((s) => (
          <li key={s.key}>
            <Swatch $color={s.color} />
            {s.label}
          </li>
        ))}
      </Legend>
      <svg width={width} height={HEIGHT} role="img" aria-label="Sales and purchases by month, excluding GST" onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={theme.colors.border} strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={theme.colors.textMuted}>
              {compactInr(t)}
            </text>
          </g>
        ))}
        {points.map((p, i) => {
          const groupX = PAD.left + band * i + (band - (barW * 2 + BAR_GAP)) / 2;
          return (
            <g key={p.month}>
              {hover === i && <rect x={PAD.left + band * i} y={PAD.top} width={band} height={plotH} fill={theme.colors.bgHover} />}
              {series.map((s, si) => {
                const value = p[s.key];
                return <path key={s.key} d={barPath(groupX + si * (barW + BAR_GAP), y(value), barW, y(0) - y(value))} fill={s.color} />;
              })}
              <text x={PAD.left + band * i + band / 2} y={HEIGHT - 8} textAnchor="middle" fontSize={11} fill={theme.colors.textMuted}>
                {monthLabel(p.month)}
              </text>
              {/* Hit target: the whole month band, not just the bars. */}
              <rect
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={plotH + PAD.bottom}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <Tooltip style={{ left: Math.min(Math.max(PAD.left + band * hover + band / 2, 90), width - 90), top: 28 }}>
          <strong>{monthLabel(points[hover].month, true)}</strong>
          {series.map((s) => (
            <div key={s.key}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Swatch $color={s.color} />
                {s.label}
              </span>
              <span className="value">{formatMoney(points[hover][s.key])}</span>
            </div>
          ))}
        </Tooltip>
      )}
      <table className="sr-only">
        <caption>Sales and purchases by month, excluding GST</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Sales</th>
            <th>Purchases</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.month}>
              <td>{monthLabel(p.month, true)}</td>
              <td>{formatMoney(p.sales)}</td>
              <td>{formatMoney(p.purchases)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Wrap>
  );
}
