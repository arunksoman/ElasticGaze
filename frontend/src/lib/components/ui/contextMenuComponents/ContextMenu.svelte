<script lang="ts">
	import { onMount } from 'svelte';
	import { contextMenuStore, type ContextMenuItemData } from './contextMenuStore';
	import ContextMenuItem from './ContextMenuItem.svelte';
	import ContextMenuGroup from './ContextMenuGroup.svelte';
	
	interface Props {
		items?: ContextMenuItemData[];
		open?: boolean;
		position?: { x: number; y: number };
		grouped?: boolean;
		typeahead?: boolean;
		maxHeight?: string;
		autoClose?: boolean;
		onselect?: (item: ContextMenuItemData) => void;
		onclose?: () => void;
		onopen?: () => void;
		onkeydown?: (event: KeyboardEvent) => void;
	}
	
	let {
		items = [],
		open = $bindable(false),
		position = { x: 0, y: 0 },
		grouped = false,
		typeahead = true,
		maxHeight = '300px',
		autoClose = true,
		onselect,
		onclose,
		onopen,
		onkeydown
	}: Props = $props();
	
	let menuElement = $state<HTMLDivElement>();
	let hasRegistered = $state(false);
	
	// Process items for grouping
	let groupedData = $derived(() => {
		const groups: Record<string, ContextMenuItemData[]> = {};
		const ungrouped: ContextMenuItemData[] = [];
		
		items.forEach(item => {
			if (item.group) {
				if (!groups[item.group]) groups[item.group] = [];
				groups[item.group].push(item);
			} else {
				ungrouped.push(item);
			}
		});
		
		return { groups, ungrouped };
	});
	
	// Handle open state changes without circular effects
	$effect(() => {
		if (open && !hasRegistered) {
			contextMenuStore.registerItems(items);
			contextMenuStore.openMenu(position);
			hasRegistered = true;
			onopen?.();
		} else if (!open && hasRegistered) {
			hasRegistered = false;
		}
	});
	
	// Handle close separately
	function handleClose() {
		if (open) {
			open = false;
			hasRegistered = false;
			contextMenuStore.closeMenu();
			onclose?.();
		}
	}
	
	function handleKeyDown(event: KeyboardEvent) {
		if (!open) return;
		
		const { key } = event;
		
		// Allow custom keydown handling
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		
		switch (key) {
			case 'ArrowDown':
				event.preventDefault();
				contextMenuStore.focusNext();
				break;
				
			case 'ArrowUp':
				event.preventDefault();
				contextMenuStore.focusPrev();
				break;
				
			case 'Home':
				event.preventDefault();
				contextMenuStore.focusFirst();
				break;
				
			case 'End':
				event.preventDefault();
				contextMenuStore.focusLast();
				break;
				
			case 'PageUp':
				event.preventDefault();
				// Jump up by visible set (simplified to 5 items)
				for (let i = 0; i < 5; i++) {
					contextMenuStore.focusPrev();
				}
				break;
				
			case 'PageDown':
				event.preventDefault();
				// Jump down by visible set (simplified to 5 items)
				for (let i = 0; i < 5; i++) {
					contextMenuStore.focusNext();
				}
				break;
				
			case 'Enter':
			case ' ':
				event.preventDefault();
				handleSelect();
				break;
				
			case 'Escape':
			case 'Tab':
				event.preventDefault();
				closeMenu();
				break;
				
			default:
				// Typeahead functionality
				if (typeahead && key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
					event.preventDefault();
					contextMenuStore.focusByTypeahead(key);
				}
				break;
		}
	}
	
	function handleSelect() {
		const activeItem = contextMenuStore.selectActive();
		if (activeItem && !activeItem.disabled) {
			onselect?.(activeItem);
			if (activeItem.action) {
				activeItem.action();
			}
			if (autoClose) {
				closeMenu();
			}
		}
	}
	
	function closeMenu() {
		handleClose();
	}
	
	function handleItemSelect(item: ContextMenuItemData) {
		if (item) {
			onselect?.(item);
			if (item.action) {
				item.action();
			}
			if (autoClose) {
				closeMenu();
			}
		}
	}
	
	function handleClickOutside(event: MouseEvent) {
		if (menuElement && event.target && !menuElement.contains(event.target as Node)) {
			handleClose();
		}
	}
	
	// Position menu within viewport bounds
	function getMenuStyle(pos: { x: number; y: number }) {
		if (!menuElement) return `left: ${pos.x}px; top: ${pos.y}px;`;
		
		const rect = menuElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		
		let { x, y } = pos;
		
		// Adjust horizontal position if menu would overflow
		if (x + rect.width > viewportWidth) {
			x = Math.max(0, viewportWidth - rect.width);
		}
		
		// Adjust vertical position if menu would overflow
		if (y + rect.height > viewportHeight) {
			y = Math.max(0, viewportHeight - rect.height);
		}
		
		return `left: ${x}px; top: ${y}px;`;
	}
	
	onMount(() => {
		// Handle global keydown for menu navigation
		document.addEventListener('keydown', handleKeyDown);
		
		// Handle clicks outside menu
		document.addEventListener('mousedown', handleClickOutside);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});
</script>

{#if open}
	<div
		bind:this={menuElement}
		class="context-menu"
		role="menu"
		aria-orientation="vertical"
		aria-activedescendant={$contextMenuStore.activeId}
		style="{getMenuStyle(position)} max-height: {maxHeight};"
		tabindex="-1"
	>
		{#if grouped}
			<!-- Render ungrouped items first -->
			{#each groupedData().ungrouped as item (item.id)}
				<ContextMenuItem
					id={item.id}
					label={item.label}
					icon={item.icon}
					shortcut={item.shortcut}
					disabled={item.disabled}
					divider={item.divider}
					onselect={handleItemSelect}
				/>
			{/each}
			
			<!-- Render grouped items -->
			{#each Object.entries(groupedData().groups) as [groupName, groupItems] (groupName)}
				<ContextMenuGroup
					label={groupName}
					items={groupItems}
					onselect={handleItemSelect}
				/>
			{/each}
		{:else}
			<!-- Render items normally -->
			{#each items as item (item.id)}
				<ContextMenuItem
					id={item.id}
					label={item.label}
					icon={item.icon}
					shortcut={item.shortcut}
					disabled={item.disabled}
					divider={item.divider}
					onselect={handleItemSelect}
				/>
			{/each}
		{/if}
	</div>
{/if}

<style>
	.context-menu {
		position: fixed;
		z-index: 9999;
		min-width: 180px;
		background: var(--color-base-100);
		color: var(--color-base-content);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
		padding: 0.25rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		overflow-y: auto;
		outline: none;
	}
	
	.context-menu:focus {
		outline: none;
	}
</style>