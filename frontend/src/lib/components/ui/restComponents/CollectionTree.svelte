<script lang="ts">
	import { onMount } from 'svelte';
	import { restStore, methodColors } from './restStore';
	import { GetAllCollectionTrees, CreateCollection, CreateFolder, CreateRequest, UpdateCollection, UpdateFolder, UpdateRequest, DeleteCollection, DeleteFolder, DeleteRequest } from '$lib/wailsjs/go/main/App';
	import { models } from '$lib/wailsjs/go/models';
	import { Plus, FolderPlus, FileAddition, Edit, Delete } from '@icon-park/svg';
	import { showToast } from '$lib/components/ui/toastComponent';
	import Tree from '$lib/components/ui/treeComponents/Tree.svelte';
	import type { TreeNodeItem, TreeNodeEvent, TreeRenameEvent, TreeDropEvent } from '$lib/components/ui/treeComponents/types';

	const storeState = $derived($restStore);
	let treeNodes = $state<TreeNodeItem[]>([]);
	let treeComponent: Tree;
	let contextMenuNode: { id: string; type: string; originalId: number } | null = $state(null);
	let contextMenuPosition = $state({ x: 0, y: 0 });
	// Store mapping of tree node IDs to original node data
	let nodeDataMap = $state<Map<string, models.CollectionTreeNode>>(new Map());

	onMount(async () => {
		await loadCollections();
	});

	// Convert CollectionTreeNode to TreeNodeItem
	function convertToTreeNodes(nodes: models.CollectionTreeNode[]): TreeNodeItem[] {
		return nodes.map(node => {
			const treeNodeId = `${node.type}-${node.id}`;
			// Store the original node data for later reference
			nodeDataMap.set(treeNodeId, node);
			
			// Build name with method color for requests
			let displayName = node.name;
			if (node.type === 'request') {
				const method = node.method || 'GET';
				const color = methodColors[method] || '#64748b';
				displayName = `<span style="color: ${color}; font-weight: 600;">${method}</span> ${node.name}`;
			}
			
			return {
				id: treeNodeId,
				name: displayName,
				// Always provide children array for collections and folders (even if empty)
				children: node.type === 'request' ? undefined : (node.children ? convertToTreeNodes(node.children) : []),
				expanded: false,
				editable: true
			};
		});
	}

	async function loadCollections() {
		try {
			const collections = await GetAllCollectionTrees();
			restStore.setCollections(collections);
			treeNodes = convertToTreeNodes(collections);
		} catch (error: any) {
			showToast({
				type: 'error',
				message: 'Failed to load collections',
				description: error.message
			});
		}
	}

	async function handleCreateCollection() {
		try {
			const req = new models.CreateCollectionRequest();
			req.name = 'New Collection';
			await CreateCollection(req);
			await loadCollections();
			showToast({
				type: 'success',
				message: 'Collection created successfully'
			});
		} catch (error: any) {
			showToast({
				type: 'error',
				message: 'Failed to create collection',
				description: error.message
			});
		}
	}

	// Handle tree node selection
	function handleSelect(event: TreeNodeEvent) {
		const nodeId = event.node.id;
		const [type, id] = nodeId.split('-');
		const numericId = parseInt(id);

		// Find the original node in collections
		const node = findNodeById(storeState.collections, numericId, type);
		if (!node) return;

		if (node.type === 'request') {
			// Open request in tab
			const request = new models.Request();
			request.id = node.id;
			request.name = node.name;
			request.method = node.method || 'GET';
			request.url = node.url || '/';
			request.body = node.body;
			request.description = node.description;
			request.collection_id = getCollectionIdFromNode(storeState.collections, numericId);
			request.folder_id = type === 'folder' ? numericId : undefined;
			
			restStore.openRequestTab(request);
		}
	}

	function handleContextMenu(event: MouseEvent, nodeId: string) {
		event.preventDefault();
		const [type, id] = nodeId.split('-');
		contextMenuNode = { id: nodeId, type, originalId: parseInt(id) };
		contextMenuPosition = { x: event.clientX, y: event.clientY };
	}

	function closeContextMenu() {
		contextMenuNode = null;
	}

	async function handleCreateFolder() {
		if (!contextMenuNode) return;
		const node = nodeDataMap.get(contextMenuNode.id);
		if (!node) return;

		try {
			const collectionId = node.type === 'collection' ? node.id : getCollectionIdFromNode(storeState.collections, node.id);
			const req = new models.CreateFolderRequest();
			req.name = 'New Folder';
			req.collection_id = collectionId;
			if (node.type === 'folder') {
				req.parent_folder_id = node.id;
			}
			await CreateFolder(req);
			await loadCollections();
			showToast({ type: 'success', message: 'Folder created successfully' });
		} catch (error: any) {
			showToast({ type: 'error', message: 'Failed to create folder', description: error.message });
		}
		closeContextMenu();
	}

	async function handleCreateRequest() {
		if (!contextMenuNode) return;
		const node = nodeDataMap.get(contextMenuNode.id);
		if (!node) return;

		try {
			const collectionId = node.type === 'collection' ? node.id : getCollectionIdFromNode(storeState.collections, node.id);
			const req = new models.CreateRequestRequest();
			req.name = 'New Request';
			req.method = 'GET';
			req.url = '/';
			req.collection_id = collectionId;
			if (node.type === 'folder') {
				req.folder_id = node.id;
			}
			const newRequest = await CreateRequest(req);
			await loadCollections();
			restStore.openRequestTab(newRequest);
			showToast({ type: 'success', message: 'Request created successfully' });
		} catch (error: any) {
			showToast({ type: 'error', message: 'Failed to create request', description: error.message });
		}
		closeContextMenu();
	}

	async function handleDeleteNode() {
		if (!contextMenuNode) return;
		const { type, originalId } = contextMenuNode;

		try {
			if (type === 'collection') {
				await DeleteCollection(originalId);
			} else if (type === 'folder') {
				await DeleteFolder(originalId);
			} else if (type === 'request') {
				await DeleteRequest(originalId);
			}
			await loadCollections();
			showToast({ type: 'success', message: `${type} deleted successfully` });
		} catch (error: any) {
			showToast({ type: 'error', message: `Failed to delete ${type}`, description: error.message });
		}
		closeContextMenu();
	}

	// Handle rename
	async function handleRename(event: TreeRenameEvent) {
		const [type, id] = event.id.split('-');
		const numericId = parseInt(id);
		
		// Extract plain text from HTML (for requests with method colors)
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = event.name;
		const newName = tempDiv.textContent?.trim() || '';

		if (!newName) {
			showToast({ type: 'warning', message: 'Name cannot be empty' });
			await loadCollections();
			return;
		}

		try {
			const node = nodeDataMap.get(event.id);
			if (!node) return;

			if (type === 'collection') {
				const req = new models.UpdateCollectionRequest();
				req.name = newName;
				await UpdateCollection(numericId, req);
			} else if (type === 'folder') {
				const req = new models.UpdateFolderRequest();
				req.name = newName;
				await UpdateFolder(numericId, req);
			} else if (type === 'request') {
				const req = new models.UpdateRequestRequest();
				req.name = newName;
				req.method = node.method;
				req.url = node.url;
				await UpdateRequest(numericId, req);
			}

			await loadCollections();
			showToast({ type: 'success', message: 'Renamed successfully' });
		} catch (error: any) {
			showToast({
				type: 'error',
				message: 'Failed to rename',
				description: error.message
			});
			await loadCollections();
		}
	}

	// Handle drag and drop
	async function handleDrop(event: TreeDropEvent) {
		const [sourceType, sourceId] = event.sourceId.split('-');
		const [targetType, targetId] = event.targetId.split('-');
		const sourceNumericId = parseInt(sourceId);
		const targetNumericId = parseInt(targetId);

		// Cannot drop collection
		if (sourceType === 'collection') {
			showToast({ type: 'warning', message: 'Cannot move collections' });
			return;
		}

		// Cannot drop into request
		if (targetType === 'request') {
			showToast({ type: 'warning', message: 'Cannot drop into requests' });
			return;
		}

		try {
			const targetCollectionId = targetType === 'collection' 
				? targetNumericId 
				: getCollectionIdFromNode(storeState.collections, targetNumericId);
			
			const targetFolderId = targetType === 'folder' ? targetNumericId : undefined;

			if (sourceType === 'folder') {
				const req = new models.UpdateFolderRequest();
				req.parent_folder_id = targetFolderId;
				await UpdateFolder(sourceNumericId, req);
			} else if (sourceType === 'request') {
				const req = new models.UpdateRequestRequest();
				req.collection_id = targetCollectionId;
				req.folder_id = targetFolderId;
				await UpdateRequest(sourceNumericId, req);
			}

			await loadCollections();
			showToast({ type: 'success', message: 'Item moved successfully' });
		} catch (error: any) {
			showToast({
				type: 'error',
				message: 'Failed to move item',
				description: error.message
			});
		}
	}

	// Helper: Find node in tree
	function findNodeById(nodes: models.CollectionTreeNode[], id: number, type: string): models.CollectionTreeNode | null {
		for (const node of nodes) {
			if (node.id === id && node.type === type) return node;
			if (node.children) {
				const found = findNodeById(node.children, id, type);
				if (found) return found;
			}
		}
		return null;
	}

	// Helper: Get collection ID for any node
	function getCollectionIdFromNode(collections: models.CollectionTreeNode[], nodeId: number): number {
		for (const collection of collections) {
			if (findInSubtree(collection, nodeId)) {
				return collection.id;
			}
		}
		return nodeId;
	}

	function findInSubtree(root: models.CollectionTreeNode, targetId: number): boolean {
		if (root.id === targetId) return true;
		if (!root.children) return false;
		return root.children.some(child => findInSubtree(child, targetId));
	}

	// Handle nodes change from tree
	function handleNodesChange(newNodes: TreeNodeItem[]) {
		treeNodes = newNodes;
	}
</script>

<div class="collection-tree p-2">
	<!-- Create Collection Button -->
	<div class="mb-2">
		<button
			class="w-full flex items-center gap-2 px-3 py-2 text-sm bg-(--color-primary) text-(--color-primary-content) rounded hover:opacity-90 transition-opacity"
			onclick={handleCreateCollection}
		>
			{@html Plus({ theme: 'outline', size: '16' })}
			<span>New Collection</span>
		</button>
	</div>

	<!-- Collections Tree -->
	<Tree
		bind:this={treeComponent}
		nodes={treeNodes}
		draggable={true}
		multiSelect={false}
		keyboardNavigation={true}
		onselect={handleSelect}
		onrename={handleRename}
		ondrop={handleDrop}
		onnodeschange={handleNodesChange}
		oncontextmenu={handleContextMenu}
		customItemClass="tree-node-item"
	>
		{#snippet empty()}
			<div class="text-center py-8 text-(--color-base-content) opacity-60 text-sm">
				No collections yet
			</div>
		{/snippet}
	</Tree>
</div>

<!-- Context Menu -->
{#if contextMenuNode}
	<div
		role="menu"
		tabindex="-1"
		class="context-menu"
		style="left: {contextMenuPosition.x}px; top: {contextMenuPosition.y}px;"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				closeContextMenu();
			}
		}}
	>
		{#if contextMenuNode.type !== 'request'}
			<button class="context-menu-item" role="menuitem" onclick={handleCreateFolder}>
				{@html FolderPlus({ theme: 'outline', size: '14' })}
				<span>New Folder</span>
			</button>
			<button class="context-menu-item" role="menuitem" onclick={handleCreateRequest}>
				{@html FileAddition({ theme: 'outline', size: '14' })}
				<span>New Request</span>
			</button>
			<div class="context-menu-divider" role="separator"></div>
		{/if}
		<button class="context-menu-item danger" role="menuitem" onclick={handleDeleteNode}>
			{@html Delete({ theme: 'outline', size: '14' })}
			<span>Delete</span>
		</button>
	</div>
{/if}

<svelte:document onclick={closeContextMenu} onkeydown={(e) => { if (e.key === 'Escape') closeContextMenu(); }} />
<style>
	.collection-tree {
		height: 100%;
		overflow-y: auto;
	}

	.context-menu {
		position: fixed;
		background-color: var(--color-base-200);
		border: 1px solid var(--color-base-300);
		border-radius: 0.375rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
		padding: 0.25rem;
		z-index: 1000;
		min-width: 160px;
	}

	.context-menu-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: transparent;
		border: none;
		color: var(--color-base-content);
		font-size: 0.875rem;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: background-color 0.15s;
		text-align: left;
	}

	.context-menu-item:hover {
		background-color: var(--color-base-300);
	}

	.context-menu-item.danger {
		color: #ef4444;
	}

	.context-menu-divider {
		height: 1px;
		background-color: var(--color-base-300);
		margin: 0.25rem 0;
	}
</style>