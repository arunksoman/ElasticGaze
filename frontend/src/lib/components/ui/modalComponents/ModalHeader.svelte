<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Close } from '@icon-park/svg';

	interface Props {
		title?: string;
		closable?: boolean;
		onclose?: () => void;
		children?: Snippet;
	}

	let { title, closable = true, onclose, children }: Props = $props();

	const closeIcon = Close({
		theme: 'outline',
		size: '20',
		fill: 'currentColor',
		strokeWidth: 3
	});
</script>

<div class="modal-header flex items-center justify-between p-4 border-b border-(--color-base-300)">
	{#if children}
		{@render children()}
	{:else if title}
		<h2 id="modal-title" class="text-lg font-semibold text-(--color-base-content)">
			{title}
		</h2>
	{/if}

	{#if closable}
		<button
			type="button"
			class="ml-auto p-1 hover:bg-(--color-base-200) transition-colors duration-150 rounded"
			onclick={onclose}
			aria-label="Close modal"
		>
			{@html closeIcon}
		</button>
	{/if}
</div>
