<script lang="ts">
	import { contextMenuStore } from './contextMenuStore';
	import type { ContextMenuItemData } from './contextMenuStore';
	
	interface Props {
		id: string;
		label: string;
		shortcut?: string;
		icon?: string;
		disabled?: boolean;
		divider?: boolean;
		customClass?: string;
		onselect?: (item: ContextMenuItemData) => void;
	}
	
	let {
		id,
		label,
		shortcut,
		icon,
		disabled = false,
		divider = false,
		customClass = '',
		onselect
	}: Props = $props();
	
	let isActive = $derived($contextMenuStore.activeId === id);
	
	function handleClick() {
		if (disabled) return;
		onselect?.({ id, label, shortcut, icon, disabled, divider });
	}
	
	function handleMouseEnter() {
		if (!disabled) {
			contextMenuStore.setActiveId(id);
		}
	}
	
	function handleKeyDown(event: KeyboardEvent) {
		// Handle keyboard events if needed
		if (event.key === 'Enter' || event.key === ' ') {
			handleClick();
		}
	}
</script>

{#if divider}
	<div 
		class="menu-divider"
		role="separator"
		aria-orientation="horizontal"
	></div>
{:else}
	<div
		role="menuitem"
		tabindex="-1"
		class="menu-item {customClass}"
		class:active={isActive}
		class:disabled
		aria-disabled={disabled}
		onclick={handleClick}
		onkeydown={handleKeyDown}
		onmouseenter={handleMouseEnter}
		data-id={id}
	>
		{#if icon}
			<span class="menu-item-icon" aria-hidden="true">
				{@html icon}
			</span>
		{/if}
		
		<span class="menu-item-label">{label}</span>
		
		{#if shortcut}
			<span class="menu-item-shortcut" aria-hidden="true">{shortcut}</span>
		{/if}
	</div>
{/if}

<style>
	.menu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.75rem;
		cursor: pointer;
		color: var(--color-base-content);
		border-radius: var(--radius-field);
		transition: background-color 0.15s ease;
		user-select: none;
		outline: none;
	}
	
	.menu-item:hover,
	.menu-item.active {
		background-color: var(--color-base-200);
		color: var(--color-base-content);
	}
	
	.menu-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.menu-item.disabled:hover {
		background-color: transparent;
	}
	
	.menu-item-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}
	
	.menu-item-icon :global(svg) {
		width: 100%;
		height: 100%;
		fill: currentColor;
	}
	
	.menu-item-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.menu-item-shortcut {
		font-size: 0.75rem;
		opacity: 0.7;
		margin-left: auto;
		flex-shrink: 0;
	}
	
	.menu-divider {
		height: var(--border);
		background-color: var(--color-base-300);
		margin: 0.25rem 0;
	}
</style>