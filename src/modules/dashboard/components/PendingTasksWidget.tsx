import styled from 'styled-components';
import { Card } from '@/components/common/Card/Card';
import { PENDING_TASKS } from '../services/dashboardService';

const Panel = styled(Card)`
  padding: ${({ theme }) => theme.space[5]};
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const TaskRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const Checkbox = styled.input`
  margin-top: 3px;
`;

const TaskLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.navy};
`;

const TaskNote = styled.div<{ $overdue?: boolean }>`
  font-size: 12px;
  color: ${({ theme, $overdue }) => ($overdue ? theme.colors.danger : theme.colors.textMuted)};
  font-weight: ${({ $overdue }) => ($overdue ? 600 : 400)};
`;

export function PendingTasksWidget() {
  return (
    <Panel>
      <Title>Pending Administrative Tasks</Title>
      {PENDING_TASKS.map((task) => (
        <TaskRow key={task.id}>
          <Checkbox type="checkbox" />
          <div>
            <TaskLabel>{task.label}</TaskLabel>
            <TaskNote $overdue={task.overdue}>{task.note}</TaskNote>
          </div>
        </TaskRow>
      ))}
    </Panel>
  );
}
