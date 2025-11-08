import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration: number;
}

export interface ToastOptions {
	type?: ToastType;
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function show(message: string, options?: ToastOptions) {
		const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
		const toast: Toast = {
			id,
			message,
			type: options?.type || 'info',
			duration: options?.duration ?? 5000
		};

		update((toasts) => [...toasts, toast]);

		return id;
	}

	function remove(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	function clear() {
		update(() => []);
	}

	return {
		subscribe,
		show,
		remove,
		clear
	};
}

export const toastStore = createToastStore();
