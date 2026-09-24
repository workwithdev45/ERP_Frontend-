import { useTheme } from 'styled-components';
import type { SalesTrendPoint } from '../types/dashboard.types';

const WIDTH = 640;
const HEIGHT = 240;
const PAD = { top: 20, right: 8, bottom: 28, left: 36 };

function niceMax(value: number) {
  const step = 10 ** Math.floor(Math.log10(Math.max(value, 1)));
  return Math.ceil(value / step) * step;
}

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const theme = useTheme();
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const slot = plotW / data.length;
  const barW = Math.min(36, slot * 0.56);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
  const summary = data.map((d) => `${d.day} ${d.value}`).join(', ');

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" role="img" aria-label={`Sales for the last ${data.length} days: ${summary}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(t)} y2={y(t)} stroke={theme.colors.border} strokeDasharray={t === 0 ? undefined : '3 4'} />
          <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={theme.colors.textMuted} fontFamily={theme.font.mono}>
            {t}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = PAD.left + i * slot + (slot - barW) / 2;
        const top = y(d.value);
        const isLatest = i === data.length - 1;
        return (
          <g key={d.day}>
            <title>{`${d.day}: ${d.value}`}</title>
            <rect
              x={x}
              y={top}
              width={barW}
              height={PAD.top + plotH - top}
              rx={4}
              fill={isLatest ? theme.colors.primary : theme.palette.cobalt200}
            />
            <text x={x + barW / 2} y={top - 6} textAnchor="middle" fontSize="11" fontWeight={600} fill={isLatest ? theme.colors.primaryDark : theme.colors.textSecondary}>
              {d.value}
            </text>
            <text x={x + barW / 2} y={HEIGHT - 8} textAnchor="middle" fontSize="12" fill={theme.colors.textSecondary}>
              {d.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
