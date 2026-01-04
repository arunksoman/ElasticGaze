<script lang="ts">
	import { FolderClose, FolderOpen } from '@icon-park/svg';
	import type { TreeNodeItem, TreeIcons } from './types';
	import type { TreeStore } from './treeStore';
	import TreeNode from './TreeNode.svelte';

	interface TreeNodeProps {
		node: TreeNodeItem;
		depth: number;
		parentId?: string | null;
		customNodeClass?: string;
		customItemClass?: string;
		icons: TreeIcons;
		draggable?: boolean;
		store: TreeStore;
		oncontextmenu?: (event: MouseEvent, nodeId: string) => void;
	}

	let {
		node,
		depth,
		parentId = null,
		customNodeClass = '',
		customItemClass = '',
		icons,
		draggable = true,
		store,
		oncontextmenu
	}: TreeNodeProps = $props();

	let editValue = $state(node.name);
	let inputElement = $state<HTMLInputElement>();

	const storeState = $derived($store);
	const isExpanded = $derived(storeState.expandedIds.has(node.id));
	const isSelected = $derived(storeState.selectedIds.has(node.id));
	const isFocused = $derived(storeState.focusedId === node.id);
	const isEditing = $derived(storeState.editingId === node.id);
	// A node is considered a container if it has the children property (even if empty)
	const isContainer = $derived(node.children !== undefined);
	const hasChildren = $derived(node.children && node.children.length > 0);
	
	// Show drag target only for container nodes or if this is the actual target
	const isDragTarget = $derived.by(() => {
		const targetId = storeState.dragState.targetId;
		if (!targetId) return false;
		// Only show drag target highlight on container nodes
		return targetId === node.id && isContainer;
	});

	// Update editValue when editing starts
	$effect(() => {
		if (isEditing) {
			editValue = node.name;
			setTimeout(() => {
				inputElement?.focus();
				inputElement?.select();
			}, 0);
		}
	});

	// Determine which icon to show
	const currentIcon = $derived.by(() => {
		if (!isContainer) return null;
		if (isExpanded) {
			return node.iconExpanded || icons.expanded;
		}
		return node.iconCollapsed || icons.collapsed;
	});

	// Render icon (IconPark or custom SVG)
	function renderIcon(iconName: string | null): string {
		if (!iconName) return '';

		// If it looks like SVG markup, return as-is
		if (iconName.trim().startsWith('<svg')) {
			return iconName;
		}

		// Otherwise, use IconPark
		if (iconName === 'FolderOpen') {
			return FolderOpen({ theme: 'outline', size: '1rem' });
		}
		if (iconName === 'FolderClose') {
			return FolderClose({ theme: 'outline', size: '1rem' });
		}

		// Fallback
		return '';
	}

	function handleIconClick(e: MouseEvent) {
		e.stopPropagation();
		if (isContainer) {
			store.toggleExpand(node.id);
		}
	}

	function handleNodeClick(e: MouseEvent) {
		e.stopPropagation();
		if (isContainer) {
			// For containers (collections/folders), toggle expand/collapse
			store.toggleExpand(node.id);
		} else {
			// For non-containers (requests), select them
			const multiSelect = e.ctrlKey || e.metaKey;
			store.selectNode(node.id, multiSelect);
		}
		store.setFocus(node.id);
	}

	function handleDoubleClick(e: MouseEvent) {
		e.stopPropagation();
		if (node.editable !== false) {
			store.startEditing(node.id);
		}
	}

	function finishEditing() {
		if (isEditing && editValue.trim() !== '' && editValue !== node.name) {
			store.renameNode(node.id, editValue.trim(), (id, newName, oldName) => {
				// Callback is handled by Tree component
			});
		} else {
			store.stopEditing();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			finishEditing();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			editValue = node.name;
			store.stopEditing();
		}
	}

	// Drag and drop handlers
	function handleDragStart(e: DragEvent) {
		if (!draggable) return;
		e.stopPropagation();
		store.startDrag(node.id);
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', node.id);
		}
	}

	function handleDragOver(e: DragEvent) {
		if (!draggable) return;
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		store.setDragTarget(node.id);
	}

	function handleDragLeave(e: DragEvent) {
		if (!draggable) return;
		e.stopPropagation();
		store.setDragTarget(null);
	}

	function handleDrop(e: DragEvent) {
		if (!draggable) return;
		e.preventDefault();
		e.stopPropagation();

		const sourceId = storeState.dragState.sourceId;
		if (sourceId && sourceId !== node.id) {
			store.moveNode(sourceId, node.id);
		}

		store.endDrag();
	}

	function handleDragEnd() {
		if (!draggable) return;
		store.endDrag();
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		oncontextmenu?.(e, node.id);
	}
</script>

<div
	role="treeitem"
	aria-expanded={isContainer ? isExpanded : undefined}
	aria-selected={isSelected}
	aria-level={depth + 1}
	tabindex="-1"
	class="tree-node {customNodeClass}"
	class:selected={isSelected}
	class:focused={isFocused}
	class:drag-target={isDragTarget}
	style="padding-left: {depth * 1.5}rem;"
	draggable={draggable ? 'true' : 'false'}
	ondragstart={handleDragStart}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	ondragend={handleDragEnd}
	onclick={handleNodeClick}
	ondblclick={handleDoubleClick}
	oncontextmenu={handleContextMenu}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleNodeClick(e as any);
		}
	}}
>
	<div class="node-content {isContainer ? '' : customItemClass}">
		{#if isContainer}
			<button
				class="icon-button"
				onclick={handleIconClick}
				aria-label={isExpanded ? 'Collapse' : 'Expand'}
				tabindex="-1"
			>
				{@html renderIcon(currentIcon)}
			</button>
		{:else}
			<span class="icon-spacer"></span>
		{/if}

		{#if isEditing}
			<input
				type="text"
				bind:value={editValue}
				bind:this={inputElement}
				class="node-input"
				onblur={finishEditing}
				onkeydown={handleKeyDown}
			/>
		{:else}
			<span class="node-label">{@html node.name}</span>
		{/if}
	</div>
</div>

{#if isExpanded && hasChildren}
	<div role="group">
		{#each node.children as childNode (childNode.id)}
			<TreeNode
				node={childNode}
				depth={depth + 1}
				parentId={node.id}
				{customNodeClass}
				{customItemClass}
				{icons}
				{draggable}
				{store}
				{oncontextmenu}
			/>
		{/each}
	</div>
{/if}

<style>
	.tree-node {
		display: flex;
		align-items: center;
		min-height: 2rem;
		cursor: pointer;
		user-select: none;
		background-color: var(--color-base-100);
		color: var(--color-base-content);
		transition: background-color 0.15s ease;
	}

	.tree-node:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.tree-node.selected {
		background-color: rgba(255, 255, 255, 0.08);
	}

	.tree-node.focused {
		outline: 1px solid var(--color-base-content);
		outline-offset: -1px;
		opacity: 0.8;
	}

	.tree-node.drag-target {
		background-color: rgba(255, 255, 255, 0.1);
		border-left: 2px solid var(--color-base-content);
	}

	.node-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		padding: 0.25rem 0.5rem;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-base-content);
		border-radius: var(--radius-field);
		transition: background-color 0.15s ease;
		opacity: 0.7;
	}

	.icon-button:hover {
		background-color: var(--color-base-300);
	}

	.icon-button :global(svg) {
		width: 1rem;
		height: 1rem;
		display: block;
	}

	.icon-spacer {
		width: 1.5rem;
		height: 1rem;
		display: inline-block;
	}

	.node-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.node-input {
		flex: 1;
		padding: 0.25rem 0.5rem;
		background-color: var(--color-base-200);
		color: var(--color-base-content);
		border: 1px solid var(--color-base-content);
		border-radius: var(--radius-field);
		outline: none;
		font-size: inherit;
		font-family: inherit;
		opacity: 0.8;
	}

	.node-input:focus {
		opacity: 1;
	}

	[role='group'] {
		display: contents;
	}
</style>
