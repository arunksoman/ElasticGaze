<script lang="ts">
	import { onMount } from 'svelte';
	import { models } from '$lib/wailsjs/go/models';
	import { FolderOpen, FolderClose, More } from '@icon-park/svg';
	import { methodColors } from './restStore';
	import TreeNodeRenderer from './TreeNodeRenderer.svelte';
	
	interface Props {
		node: models.CollectionTreeNode;
		level: number;
		expandedIds: Set<string>;
		editingNode: { id: string; name: string; type: string } | null;
		draggedNode?: models.CollectionTreeNode | null;
		dragOverNode?: models.CollectionTreeNode | null;
		onNodeClick: (node: models.CollectionTreeNode) => void;
		onContextMenu: (event: MouseEvent, node: models.CollectionTreeNode) => void;
		onToggleExpand: (id: string) => void;
		onStartEdit: (node: models.CollectionTreeNode) => void;
		onCreateFolder: (parentId: number, isFolder: boolean, collectionId: number) => void;
		onCreateRequest: (collectionId: number, folderId?: number) => void;
		onEditChange: (name: string) => void;
		onDragStart?: (node: models.CollectionTreeNode) => void;
		onDragOver?: (node: models.CollectionTreeNode) => void;
		onDragEnd?: () => void;
		onDrop?: (node: models.CollectionTreeNode) => void;
		saveEdit: () => void;
		cancelEdit: () => void;
	}
	
	let {
		node,
		level,
		expandedIds,
		editingNode,
		draggedNode,
		dragOverNode,
		onNodeClick,
		onContextMenu,
		onToggleExpand,
		onStartEdit,
		onCreateFolder,
		onCreateRequest,
		onEditChange,
		onDragStart,
		onDragOver,
		onDragEnd,
		onDrop,
		saveEdit,
		cancelEdit
	}: Props = $props();
	
	const isExpanded = $derived(expandedIds.has(node.id.toString()));
	const hasChildren = $derived(node.children && node.children.length > 0);
	const isEditing = $derived(editingNode?.id === node.id.toString() && editingNode?.type === node.type);
	const isDragging = $derived(draggedNode?.id === node.id && draggedNode?.type === node.type);
	const isDragOver = $derived(dragOverNode?.id === node.id && dragOverNode?.type === node.type);
	
	let inputElement = $state<HTMLInputElement | null>(null);
	
	$effect(() => {
		if (isEditing && inputElement) {
			inputElement.focus();
			inputElement.select();
		}
	});
</script>

<div class="tree-node">
	<div
		class="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-(--color-base-300) cursor-pointer group"
		class:opacity-50={isDragging}
		class:bg-[var(--color-primary)]={isDragOver}
		class:bg-opacity-20={isDragOver}
		style="padding-left: {level * 16 + 8}px;"
		role="button"
		tabindex="0"
		draggable={node.type !== 'collection'}
		ondragstart={(e) => {
			if (node.type === 'collection') {
				e.preventDefault();
				return;
			}
			e.dataTransfer!.effectAllowed = 'move';
			onDragStart?.(node);
		}}
		ondragover={(e) => {
			if (node.type === 'request') return;
			e.preventDefault();
			e.dataTransfer!.dropEffect = 'move';
			onDragOver?.(node);
		}}
		ondragleave={() => {
			onDragOver?.(null as any);
		}}
		ondrop={(e) => {
			if (node.type === 'request') return;
			e.preventDefault();
			onDrop?.(node);
		}}
		ondragend={() => {
			onDragEnd?.();
		}}
		onclick={() => onNodeClick(node)}
		onkeydown={(e) => e.key === 'Enter' && onNodeClick(node)}
		oncontextmenu={(e) => onContextMenu(e, node)}
	>
		<!-- Expand/Collapse Icon -->
		{#if node.type === 'folder' || node.type === 'collection'}
			{#if hasChildren}
				<button
					class="shrink-0 p-0.5 hover:bg-(--color-base-100) rounded"
					onclick={(e) => {
						e.stopPropagation();
						onToggleExpand(node.id.toString());
					}}
				>
					{@html isExpanded 
						? FolderOpen({ theme: 'outline', size: '14' })
						: FolderClose({ theme: 'outline', size: '14' })
					}
				</button>
			{:else}
				<!-- Empty folder - show folder icon without expand button -->
				<div class="shrink-0 p-0.5">
					{@html FolderClose({ theme: 'outline', size: '14' })}
				</div>
			{/if}
		{:else if hasChildren}
			<button
				class="shrink-0 p-0.5 hover:bg-(--color-base-100) rounded"
				onclick={(e) => {
					e.stopPropagation();
					onToggleExpand(node.id.toString());
				}}
			>
				{@html isExpanded 
					? FolderOpen({ theme: 'outline', size: '14' })
					: FolderClose({ theme: 'outline', size: '14' })
				}
			</button>
		{:else}
			<div class="w-3.5"></div>
		{/if}

		<!-- Node Icon and Name -->
		<div class="flex items-center gap-2 flex-1 min-w-0">
			{#if node.type === 'request'}
				<span class="text-xs font-semibold {methodColors[node.method || 'GET']} shrink-0">
					{node.method || 'GET'}
				</span>
			{/if}
			
			{#if isEditing && editingNode}
				<input
					bind:this={inputElement}
					type="text"
					value={editingNode.name}
					oninput={(e) => onEditChange(e.currentTarget.value)}
					class="flex-1 px-2 py-0.5 text-sm bg-(--color-base-100) border border-(--color-primary) rounded"
					onclick={(e) => e.stopPropagation()}
					onkeydown={(e) => {
						if (e.key === 'Enter') saveEdit();
						if (e.key === 'Escape') cancelEdit();
					}}
				/>
			{:else}
				<span class="text-sm truncate text-(--color-base-content)">
					{node.name}
				</span>
			{/if}
		</div>

		<!-- Actions -->
		<div class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
			<button
				class="p-1 hover:bg-(--color-base-100) rounded"
				onclick={(e) => {
					e.stopPropagation();
					onContextMenu(e, node);
				}}
			>
				{@html More({ theme: 'outline', size: '14' })}
			</button>
		</div>
	</div>

	<!-- Children -->
	{#if hasChildren && isExpanded && node.children}
		{#each node.children as child (child.id)}
			<TreeNodeRenderer
				node={child}
				level={level + 1}
				{expandedIds}
				{editingNode}
				{draggedNode}
				{dragOverNode}
				{onNodeClick}
				{onContextMenu}
				{onToggleExpand}
				{onStartEdit}
				{onCreateFolder}
				{onCreateRequest}
				{onEditChange}
				{onDragStart}
				{onDragOver}
				{onDragEnd}
				{onDrop}
				{saveEdit}
				{cancelEdit}
			/>
		{/each}
	{/if}
</div>

<style>
	.tree-node {
		user-select: none;
	}
</style>
