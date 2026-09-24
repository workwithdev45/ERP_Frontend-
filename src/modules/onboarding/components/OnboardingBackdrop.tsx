import styled, { useTheme } from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background-image: radial-gradient(${({ theme }) => theme.colors.decorDot} 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%);
`;

const Glow = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ theme }) => theme.colors.decorGlow} 0%, transparent 62%);
`;

const Dot = styled.div<{ $top?: string; $left?: string; $right?: string; $bottom?: string; $size: string; $color: string }>`
  position: absolute;
  top: ${({ $top }) => $top ?? 'auto'};
  left: ${({ $left }) => $left ?? 'auto'};
  right: ${({ $right }) => $right ?? 'auto'};
  bottom: ${({ $bottom }) => $bottom ?? 'auto'};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  background: ${({ $color }) => $color};
  opacity: 0.85;
  box-shadow: 0 0 0 8px ${({ theme }) => theme.colors.bgPage}, ${({ theme }) => theme.shadow.md};
`;

const DashedRing = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.28;
`;

interface OnboardingBackdropProps {
  showGlow?: boolean;
}

export function OnboardingBackdrop({ showGlow }: OnboardingBackdropProps) {
  const theme = useTheme();
  return (
    <Backdrop aria-hidden="true">
      {showGlow && <Glow />}
      <Dot $top="9%" $left="8%" $size="16px" $color={theme.palette.cobalt500} />
      <Dot $bottom="10%" $right="10%" $size="14px" $color={theme.colors.accentFill} />
      <DashedRing width="820" height="820" viewBox="0 0 820 820" fill="none">
        <circle cx="410" cy="410" r="408" stroke={theme.colors.decorRing} strokeWidth="1.5" strokeDasharray="4 7" />
        <circle cx="410" cy="410" r="330" stroke={theme.colors.decorRing} strokeWidth="1.5" strokeDasharray="4 7" />
      </DashedRing>
    </Backdrop>
  );
}
