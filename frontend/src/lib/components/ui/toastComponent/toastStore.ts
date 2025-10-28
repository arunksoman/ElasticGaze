import type { ToastProps } from './types';
import { getContext, setContext } from 'svelte';

const TOAST_CONTEXT_KEY = 'toast-context';

export function createToast() {
  const toasts: ToastProps[] = [];

  function showToast(props: ToastProps) {
    const toast: ToastProps = {
      type: 'info',
      duration: 5000,
      hasClose: true,
      ...props
    };
    toasts.push(toast);
    setTimeout(() => {
      const index = toasts.indexOf(toast);
      if (index !== -1) {
        toasts.splice(index, 1);
      }
    }, toast.duration);
  }

  setContext(TOAST_CONTEXT_KEY, {
    showToast,
    toasts
  });

  return { showToast, toasts };
}

export function useToast() {
  return getContext<{
    showToast: (props: ToastProps) => void;
    toasts: ToastProps[];
  }>(TOAST_CONTEXT_KEY);
}

