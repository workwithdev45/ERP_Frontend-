import type { ReactNode } from 'react';

export interface TabItem {
  key: string;
  label: ReactNode;
  badge?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}
