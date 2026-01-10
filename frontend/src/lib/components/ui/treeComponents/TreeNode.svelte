<script lang="ts">
	import { FolderClose, FolderOpen, More } from '@icon-park/svg';
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
		onselect?: (event: { node: TreeNodeItem }) => void;
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
		oncontextmenu,
		onselect
	}: TreeNodeProps = $props();

	let editValue = $state(node.name);
	let inputElement = $state<HTMLInputElement>();
	let extractedMethod = $state<{ method: string; color: string } | null>(null);

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
			// Strip HTML to get plain text (removes method tags from requests)
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = node.name;
			let plainText = tempDiv.textContent?.trim() || node.name;
			
			// Extract HTTP method and color if present
			const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
			const methodColors: Record<string, string> = {
				GET: '#22c55e',
				POST: '#eab308',
				PUT: '#3b82f6',
				DELETE: '#ef4444',
				PATCH: '#a855f7',
				HEAD: '#64748b',
				OPTIONS: '#64748b'
			};
			
			extractedMethod = null;
			for (const method of httpMethods) {
				if (plainText.startsWith(method + ' ')) {
					extractedMethod = { method, color: methodColors[method] || '#64748b' };
					plainText = plainText.substring(method.length + 1).trim();
					break;
				}
			}
			
			editValue = plainText;
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
			// For non-containers (requests), select them and trigger callback
			const multiSelect = e.ctrlKey || e.metaKey;
			store.selectNode(node.id, multiSelect);
			// Trigger onselect callback to open the request
			onselect?.({ node });
		}
		store.setFocus(node.id);
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

	function handleMoreClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		// Calculate position for the context menu based on the button
		const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		// Create a new MouseEvent with proper positioning
		const contextMenuEvent = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			clientX: buttonRect.left,
			clientY: buttonRect.bottom
		});
		oncontextmenu?.(contextMenuEvent, node.id);
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
	class:is-leaf={!isContainer}
	data-depth={depth}
	style="--depth: {depth}; padding-left: calc({depth} * 3rem);"
	draggable={draggable ? 'true' : 'false'}
	ondragstart={handleDragStart}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	ondragend={handleDragEnd}
	onclick={handleNodeClick}
	oncontextmenu={handleContextMenu}
	onkeydown={(e) => {
		// Don't handle keyboard shortcuts when editing
		if (isEditing) return;
		
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
		{/if}

		{#if isEditing}
			{#if extractedMethod}
				<span class="method-label" style="color: {extractedMethod.color}; font-weight: 600; font-size: 0.75rem; margin-right: 0.5rem;">
					{extractedMethod.method}
				</span>
			{/if}
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
			
			<!-- More button for context menu -->
			<button
				class="more-button"
				onclick={handleMoreClick}
				aria-label="More options"
				tabindex="-1"
				title="More options"
			>
				{@html More({ theme: 'outline', size: '14' })}
			</button>
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
				{onselect}
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
		position: relative;
		max-width: 100%;
		box-sizing: border-box;
	}

	/* Tree connector lines for hierarchy visualization */
	.tree-node::before {
		content: '';
		position: absolute;
		left: calc(var(--depth) * 3rem - 0.75rem);
		top: 0;
		width: 1.5rem;
		height: 50%;
		border-left: 1px solid rgba(255, 255, 255, 0.15);
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
		display: none;
		pointer-events: none;
	}

	.tree-node[data-depth]:not([data-depth="0"])::before {
		display: block;
	}

	/* Vertical line for parent nodes with children */
	.tree-node::after {
		content: '';
		position: absolute;
		left: calc(var(--depth) * 3rem - 0.75rem);
		top: 50%;
		bottom: 0;
		width: 1px;
		background: rgba(255, 255, 255, 0.15);
		display: none;
		pointer-events: none;
	}

	/* Only show vertical line if there are more siblings below */
	.tree-node:not(:last-child)::after {
		display: block;
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
		gap: 0.25rem;
		flex: 1;
		padding: 0.25rem 0.5rem 0.25rem 0;
		min-width: 0;
		overflow: hidden;
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

	.more-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-base-content);
		border-radius: var(--radius-field);
		transition: background-color 0.15s ease, opacity 0.15s ease;
		opacity: 0;
		margin-left: auto;
	}

	.tree-node:hover .more-button {
		opacity: 0.7;
	}

	.more-button:hover {
		background-color: var(--color-base-300);
		opacity: 1 !important;
	}

	.more-button :global(svg) {
		width: 14px;
		height: 14px;
		display: block;
	}

	.node-input {
		flex: 1;
		min-width: 0;
		max-width: 180px;
		padding: 0.25rem 0.5rem;
		background-color: var(--color-base-200);
		color: var(--color-base-content);
		border: 1px solid var(--color-base-content);
		border-radius: var(--radius-field);
		outline: none;
		font-size: inherit;
		font-family: inherit;
		opacity: 0.8;
		box-sizing: border-box;
	}

	.node-input:focus {
		opacity: 1;
	}

	[role='group'] {
		display: contents;
	}
</style>
