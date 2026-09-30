import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** md (default) for simple forms; lg/xl for documents with line grids. */
  size?: 'md' | 'lg' | 'xl';
}
