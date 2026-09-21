import styled from 'styled-components';
import { BED_OCCUPANCY } from '../services/dashboardService';

const RADIUS = 70;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

const RingWrap = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
`;

const Center = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Percent = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const CenterLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Legend = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[5]};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Swatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

export function BedOccupancyWidget() {
  const total = BED_OCCUPANCY.occupied + BED_OCCUPANCY.available;
  const occupiedPct = Math.round((BED_OCCUPANCY.occupied / total) * 100);
  const occupiedLength = (occupiedPct / 100) * CIRCUMFERENCE;

  return (
    <Wrap>
      <RingWrap>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth={STROKE}
            strokeDasharray={`${occupiedLength} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
        </svg>
        <Center>
          <Percent>{occupiedPct}%</Percent>
          <CenterLabel>Occupied</CenterLabel>
        </Center>
      </RingWrap>
      <Legend>
        <LegendItem>
          <Swatch $color="#1d4ed8" />
          Occupied ({BED_OCCUPANCY.occupied})
        </LegendItem>
        <LegendItem>
          <Swatch $color="#e2e8f0" />
          Available ({BED_OCCUPANCY.available})
        </LegendItem>
      </Legend>
    </Wrap>
  );
}
