import { toastStore as toast } from './toastStore';
import type { ToastType } from './toastStore';

export { default as Toast } from './toast.svelte';
export { default as ToastProvider } from './ToastProvider.svelte';
export { toastStore } from './toastStore';
export type { ToastType, Toast as ToastItem, ToastOptions } from './toastStore';

// Helper function for easier usage
export const showToast = (options: { type: ToastType; message: string; description?: string }) => {
	const fullMessage = options.description 
		? `${options.message}: ${options.description}`
		: options.message;
	toast.show(fullMessage, { type: options.type });
};
