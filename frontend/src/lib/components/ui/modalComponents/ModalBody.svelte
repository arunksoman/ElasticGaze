<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="modal-body flex-1 p-4 overflow-y-auto">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.modal-body {
		scrollbar-width: thin;
		scrollbar-color: var(--color-base-300) transparent;
	}

	.modal-body::-webkit-scrollbar {
		width: 8px;
	}

	.modal-body::-webkit-scrollbar-track {
		background: transparent;
	}

	.modal-body::-webkit-scrollbar-thumb {
		background-color: var(--color-base-300);
		border-radius: 4px;
	}

	.modal-body::-webkit-scrollbar-thumb:hover {
		background-color: var(--color-primary);
	}
</style>
