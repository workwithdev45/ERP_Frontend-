import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const Mark = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.palette.cobalt500} 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
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
      <Mark>+</Mark>
      <Name>
        MSME <NameAccent>ERP</NameAccent>
      </Name>
    </Wrap>
  );
}
