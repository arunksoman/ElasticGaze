<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		minSize?: number;
		maxSize?: number;
		children?: Snippet;
	}

	let {
		id,
		minSize,
		maxSize,
		children
	}: Props = $props();
</script>

<div {id} class="splitter-pane">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.splitter-pane {
		position: relative;
		overflow: auto;
		flex-shrink: 0;
	}
</style>
