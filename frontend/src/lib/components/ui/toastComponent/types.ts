export interface ToastProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  duration?: number;
  hasClose?: boolean;
  onClose?: () => void;
}