import { useState } from 'react';
import styled from 'styled-components';
import { PATIENT_REGISTRATION_TREND } from '../services/dashboardService';

const CHART_HEIGHT = 160;
const BAR_GAP = 14;
const BAR_WIDTH = 34;

const Wrap = styled.div`
  position: relative;
`;

const AxisLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.space[2]};
  padding: 0 4px;
`;

const AxisLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  width: ${BAR_WIDTH}px;
  text-align: center;
`;

const Tooltip = styled.div<{ $x: number }>`
  position: absolute;
  top: -8px;
  left: ${({ $x }) => $x}px;
  transform: translate(-50%, -100%);
  background: ${({ theme }) => theme.colors.navy};
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  white-space: nowrap;
  pointer-events: none;
`;

export function PatientTrendChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...PATIENT_REGISTRATION_TREND.map((d) => d.value));
  const width = PATIENT_REGISTRATION_TREND.length * (BAR_WIDTH + BAR_GAP);

  const points = PATIENT_REGISTRATION_TREND.map((d, i) => {
    const x = i * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
    const y = CHART_HEIGHT - (d.value / max) * CHART_HEIGHT;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Wrap>
      <svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${width} ${CHART_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
        {points.map((p, i) => (
          <rect
            key={p.day}
            x={i * (BAR_WIDTH + BAR_GAP)}
            y={CHART_HEIGHT - (p.value / max) * CHART_HEIGHT}
            width={BAR_WIDTH}
            height={(p.value / max) * CHART_HEIGHT}
            rx={4}
            fill={i === points.length - 1 ? '#1d4ed8' : '#bfdbfe'}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <path d={linePath} fill="none" stroke="#1d4ed8" strokeWidth={2} />
        {points.map((p) => (
          <circle key={`dot-${p.day}`} cx={p.x} cy={p.y} r={4} fill="#1d4ed8" />
        ))}
      </svg>
      {hovered !== null && (
        <Tooltip $x={points[hovered].x}>
          {points[hovered].day}: {points[hovered].value} patients
        </Tooltip>
      )}
      <AxisLabels>
        {PATIENT_REGISTRATION_TREND.map((d) => (
          <AxisLabel key={d.day}>{d.day}</AxisLabel>
        ))}
      </AxisLabels>
    </Wrap>
  );
}
