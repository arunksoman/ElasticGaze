<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="modal-footer flex justify-end gap-2 p-4 border-t border-(--color-base-300)">
	{#if children}
		{@render children()}
	{/if}
</div>
