<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Copy, Close } from '@icon-park/svg';
	import { toastStore } from '$lib/components/ui/toastComponent/toastStore';
	import type { ToastType } from '$lib/components/ui/toastComponent/toastStore';

	interface Props {
		id: string;
		message: string;
		type: ToastType;
		duration: number;
	}

	let { id, message, type, duration }: Props = $props();

	let accentColor = $derived.by(() => {
		const colorMap: Record<ToastType, string> = {
			success: 'var(--color-success)',
			error: 'var(--color-error)',
			warning: 'var(--color-warning)',
			info: 'var(--color-info)'
		};
		return colorMap[type] || 'var(--color-info)';
	});

	function handleClose() {
		toastStore.remove(id);
	}

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(message);
			// Don't create a new toast when copying - just close the current one after a delay
			setTimeout(() => {
				toastStore.remove(id);
			}, 1000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	onMount(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				toastStore.remove(id);
			}, duration);

			return () => clearTimeout(timer);
		}
	});
</script>

<div
	role="alert"
	class="toast-item flex items-center gap-3 p-3 rounded-lg shadow-lg overflow-hidden relative"
	style="
		background-color: var(--color-base-100);
		color: var(--color-base-content);
		border-radius: var(--radius-box);
		min-width: 320px;
		max-width: 480px;
	"
	in:fly={{ x: 300, duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<!-- Accent Strip -->
	<div
		class="absolute left-0 top-0 bottom-0 w-[3px]"
		style="background-color: {accentColor};"
	></div>

	<!-- Message -->
	<div class="flex-1 ml-2 text-sm wrap-break-word">
		{message}
	</div>

	<!-- Action Icons -->
	<div class="flex items-center gap-2">
		<button
			type="button"
			onclick={handleCopy}
			class="toast-icon-btn p-1.5 rounded transition-opacity hover:opacity-70"
			aria-label="Copy to clipboard"
			style="background-color: var(--color-base-200);"
		>
			{@html Copy({ theme: 'outline', size: '16', strokeWidth: 3 })}
		</button>
		<button
			type="button"
			onclick={handleClose}
			class="toast-icon-btn p-1.5 rounded transition-opacity hover:opacity-70"
			aria-label="Close toast"
			style="background-color: var(--color-base-200);"
		>
			{@html Close({ theme: 'outline', size: '16', strokeWidth: 3 })}
		</button>
	</div>
</div>

<style>
	.toast-item {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.toast-icon-btn {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toast-icon-btn:hover {
		opacity: 0.7;
	}
</style>
