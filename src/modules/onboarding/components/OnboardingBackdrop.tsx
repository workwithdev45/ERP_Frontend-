import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Glow = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0) 65%);
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
`;

const DashedRing = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.4;
`;

interface OnboardingBackdropProps {
  showGlow?: boolean;
}

export function OnboardingBackdrop({ showGlow }: OnboardingBackdropProps) {
  return (
    <Backdrop aria-hidden="true">
      {showGlow && <Glow />}
      <Dot $top="9%" $left="8%" $size="16px" $color="#facc15" />
      <Dot $bottom="10%" $right="10%" $size="14px" $color="#14b8a6" />
      <DashedRing width="820" height="820" viewBox="0 0 820 820" fill="none">
        <circle cx="410" cy="410" r="408" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 7" />
        <circle cx="410" cy="410" r="330" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 7" />
      </DashedRing>
    </Backdrop>
  );
}
