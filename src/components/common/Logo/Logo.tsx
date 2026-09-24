import styled from 'styled-components';
import { BrandMark } from './BrandMark';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const Mark = styled.span`
  display: flex;
  flex-shrink: 0;
  border-radius: 9px;
  box-shadow: 0 4px 12px -2px rgba(31, 90, 214, 0.35);
`;

const Name = styled.span`
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.navy};
`;

const NameAccent = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export function Logo() {
  return (
    <Wrap>
      <Mark>
        <BrandMark />
      </Mark>
      <Name>
        MSME <NameAccent>ERP</NameAccent>
      </Name>
    </Wrap>
  );
}
