<script lang="ts">
	import ContextMenuItem from './ContextMenuItem.svelte';
	import type { ContextMenuItemData } from './contextMenuStore';
	
	interface Props {
		label?: string;
		items: ContextMenuItemData[];
		id?: string;
		onselect?: (item: ContextMenuItemData) => void;
	}
	
	let { label, items, id, onselect }: Props = $props();
	
	// Generate unique ID if not provided
	const groupId = id || `context-group-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div role="group" aria-labelledby={label ? `${groupId}-label` : undefined} class="menu-group">
	{#if label}
		<div id="{groupId}-label" class="menu-group-label">
			{label}
		</div>
	{/if}
	
	{#each items as item (item.id)}
		<ContextMenuItem
			id={item.id}
			label={item.label}
			icon={item.icon}
			shortcut={item.shortcut}
			disabled={item.disabled}
			divider={item.divider}
			{onselect}
		/>
	{/each}
</div>

<style>
	.menu-group {
		display: flex;
		flex-direction: column;
	}
	
	.menu-group:not(:first-child) {
		margin-top: 0.25rem;
		padding-top: 0.25rem;
		border-top: var(--border) solid var(--color-base-300);
	}
	
	.menu-group-label {
		padding: 0.25rem 0.75rem 0.125rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-base-content);
		opacity: 0.7;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}
</style>