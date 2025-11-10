<script lang="ts">
	import Tree from '$lib/components/ui/treeComponents/Tree.svelte';
	import type { TreeNodeItem, TreeNodeEvent, TreeRenameEvent, TreeCreateEvent, TreeDropEvent } from '$lib/components/ui/treeComponents/types';

	let treeComponent: Tree;

	let treeData: TreeNodeItem[] = $state([
		{
			id: '1',
			name: 'src',
			expanded: true,
			editable: true,
			children: [
				{
					id: '2',
					name: 'components',
					editable: true,
					children: [
						{ id: '3', name: 'Button.svelte', editable: true },
						{ id: '4', name: 'Input.svelte', editable: true },
						{ id: '5', name: 'Modal.svelte', editable: true }
					]
				},
				{
					id: '6',
					name: 'routes',
					editable: true,
					children: [
						{ id: '7', name: 'index.svelte', editable: true },
						{ id: '8', name: 'about.svelte', editable: true },
						{
							id: '9',
							name: 'blog',
							editable: true,
							children: [
								{ id: '10', name: '[slug].svelte', editable: true },
								{ id: '11', name: 'index.svelte', editable: true }
							]
						}
					]
				},
				{
					id: '12',
					name: 'lib',
					editable: true,
					children: [
						{ id: '13', name: 'utils.ts', editable: true },
						{ id: '14', name: 'api.ts', editable: true }
					]
				}
			]
		},
		{
			id: '15',
			name: 'public',
			editable: true,
			children: [
				{ id: '16', name: 'favicon.ico', editable: true },
				{ id: '17', name: 'robots.txt', editable: true }
			]
		},
		{
			id: '18',
			name: 'package.json',
			editable: true
		},
		{
			id: '19',
			name: 'README.md',
			editable: true
		}
	]);

	let selectedInfo = $state('');
	let eventLog: string[] = $state([]);
	let multiSelect = $state(false);
	let draggable = $state(true);
	let keyboardNav = $state(true);

	function logEvent(message: string) {
		eventLog = [message, ...eventLog.slice(0, 9)];
	}

	function handleSelect(event: TreeNodeEvent) {
		const node = event.node;
		selectedInfo = `Selected: ${node.name} (ID: ${node.id})`;
		logEvent(`Selected: ${node.name}`);
	}

	function handleExpand(event: TreeNodeEvent) {
		const node = event.node;
		logEvent(`Expanded: ${node.name}`);
	}

	function handleCollapse(event: TreeNodeEvent) {
		const node = event.node;
		logEvent(`Collapsed: ${node.name}`);
	}

	function handleRename(event: TreeRenameEvent) {
		logEvent(`Renamed node ${event.id} to: ${event.name}`);
	}

	function handleCreate(event: TreeCreateEvent) {
		logEvent(`Created node: ${event.node.name}`);
	}

	function handleDelete(event: TreeNodeEvent) {
		const node = event.node;
		logEvent(`Deleted: ${node.name}`);
	}

	function handleDrop(event: TreeDropEvent) {
		logEvent(`Dropped ${event.sourceId} onto ${event.targetId}`);
	}

	function handleNodesChange(newNodes: TreeNodeItem[]) {
		treeData = newNodes;
	}

	function addNewNode() {
		const selected = treeComponent?.getSelectedNodes();
		if (selected && selected.length > 0) {
			const parent = selected[0];
			const newNode: TreeNodeItem = {
				id: `new-${Date.now()}`,
				name: 'New Item',
				editable: true
			};
			treeComponent.createNode(parent.id, newNode);
			logEvent(`Added new node to ${parent.name}`);
		} else {
			const newNode: TreeNodeItem = {
				id: `new-${Date.now()}`,
				name: 'New Root Item',
				editable: true
			};
			treeComponent.createNode(null, newNode);
			logEvent('Added new root node');
		}
	}

	function deleteSelected() {
		const selected = treeComponent?.getSelectedNodes();
		if (selected && selected.length > 0) {
			selected.forEach((node) => {
				treeComponent.deleteNode(node.id);
			});
			logEvent(`Deleted ${selected.length} node(s)`);
		}
	}

	function expandAllNodes() {
		treeComponent?.expandAll();
		logEvent('Expanded all nodes');
	}

	function collapseAllNodes() {
		treeComponent?.collapseAll();
		logEvent('Collapsed all nodes');
	}

	function clearSelections() {
		treeComponent?.clearSelection();
		selectedInfo = '';
		logEvent('Cleared all selections');
	}
</script>

<div class="demo-container">
	<h1>Tree Component Demo</h1>

	<div class="controls-section">
		<h2>Controls</h2>

		<div class="control-group">
			<label>
				<input type="checkbox" bind:checked={multiSelect} />
				Multi-Select Mode
			</label>

			<label>
				<input type="checkbox" bind:checked={draggable} />
				Enable Drag & Drop
			</label>

			<label>
				<input type="checkbox" bind:checked={keyboardNav} />
				Keyboard Navigation
			</label>
		</div>

		<div class="button-group">
			<button onclick={addNewNode} class="btn btn-primary">Add Node</button>
			<button onclick={deleteSelected} class="btn btn-error">Delete Selected</button>
			<button onclick={expandAllNodes} class="btn btn-secondary">Expand All</button>
			<button onclick={collapseAllNodes} class="btn btn-secondary">Collapse All</button>
			<button onclick={clearSelections} class="btn btn-neutral">Clear Selection</button>
		</div>
	</div>

	<div class="tree-section">
		<h2>Tree View</h2>
		<Tree
			bind:this={treeComponent}
			nodes={treeData}
			{multiSelect}
			{draggable}
			keyboardNavigation={keyboardNav}
			onselect={handleSelect}
			onexpand={handleExpand}
			oncollapse={handleCollapse}
			onrename={handleRename}
			oncreate={handleCreate}
			ondelete={handleDelete}
			ondrop={handleDrop}
			onnodeschange={handleNodesChange}
		>
			{#snippet empty()}
				<div class="empty-state">
					<p>No files or folders to display</p>
					<button onclick={addNewNode} class="btn btn-primary">Add First Item</button>
				</div>
			{/snippet}
		</Tree>
	</div>

	<div class="info-section">
		<div class="info-panel">
			<h2>Selection Info</h2>
			<p>{selectedInfo || 'No node selected'}</p>
		</div>

		<div class="info-panel">
			<h2>Event Log</h2>
			<div class="event-log">
				{#each eventLog as event}
					<div class="event-item">{event}</div>
				{/each}
				{#if eventLog.length === 0}
					<p class="empty-message">No events yet. Interact with the tree!</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="instructions-section">
		<h2>Keyboard Shortcuts</h2>
		<div class="shortcuts-grid">
			<div class="shortcut">
				<kbd>↓</kbd>
				<span>Next node</span>
			</div>
			<div class="shortcut">
				<kbd>↑</kbd>
				<span>Previous node</span>
			</div>
			<div class="shortcut">
				<kbd>→</kbd>
				<span>Expand / First child</span>
			</div>
			<div class="shortcut">
				<kbd>←</kbd>
				<span>Collapse / Parent</span>
			</div>
			<div class="shortcut">
				<kbd>Home</kbd>
				<span>First node</span>
			</div>
			<div class="shortcut">
				<kbd>End</kbd>
				<span>Last node</span>
			</div>
			<div class="shortcut">
				<kbd>Enter</kbd>
				<span>Toggle expand/select</span>
			</div>
			<div class="shortcut">
				<kbd>Space</kbd>
				<span>Select node</span>
			</div>
			<div class="shortcut">
				<kbd>F2</kbd>
				<span>Rename node</span>
			</div>
			<div class="shortcut">
				<kbd>*</kbd>
				<span>Expand all</span>
			</div>
			<div class="shortcut">
				<kbd>Ctrl+A</kbd>
				<span>Select/unselect all</span>
			</div>
			<div class="shortcut">
				<kbd>A-Z</kbd>
				<span>Jump to node</span>
			</div>
		</div>

		<h3>Features Demonstrated</h3>
		<ul>
			<li>✓ Expand/collapse nodes (click folder icon or use arrow keys)</li>
			<li>✓ Select nodes (single or multi-select mode)</li>
			<li>✓ Inline rename (double-click or press F2)</li>
			<li>✓ Drag and drop to move nodes</li>
			<li>✓ Add/delete nodes with buttons</li>
			<li>✓ Full keyboard navigation (WAI-ARIA compliant)</li>
			<li>✓ Type-ahead search (press any letter)</li>
			<li>✓ Themed with app.css variables</li>
		</ul>
	</div>
</div>

<style>
	.demo-container {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		background-color: var(--color-base-100);
		color: var(--color-base-content);
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
		color: var(--color-primary);
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-base-content);
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		color: var(--color-base-content);
	}

	.controls-section {
		background-color: var(--color-base-200);
		padding: 1.5rem;
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
		margin-bottom: 1.5rem;
	}

	.control-group {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.control-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
	}

	.control-group input[type='checkbox'] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: var(--radius-field);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-primary {
		background-color: var(--color-primary);
		color: var(--color-primary-content);
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	.btn-secondary {
		background-color: var(--color-secondary);
		color: var(--color-secondary-content);
	}

	.btn-secondary:hover {
		opacity: 0.9;
	}

	.btn-error {
		background-color: var(--color-error);
		color: var(--color-error-content);
	}

	.btn-error:hover {
		opacity: 0.9;
	}

	.btn-neutral {
		background-color: var(--color-neutral);
		color: var(--color-neutral-content);
	}

	.btn-neutral:hover {
		opacity: 0.9;
	}

	.tree-section {
		margin-bottom: 1.5rem;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
	}

	.empty-state p {
		margin-bottom: 1rem;
		opacity: 0.7;
	}

	.info-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.info-panel {
		background-color: var(--color-base-200);
		padding: 1.5rem;
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
	}

	.info-panel p {
		color: var(--color-base-content);
		margin: 0;
	}

	.event-log {
		max-height: 200px;
		overflow-y: auto;
	}

	.event-item {
		padding: 0.5rem;
		margin-bottom: 0.25rem;
		background-color: var(--color-base-300);
		border-radius: var(--radius-field);
		font-size: 0.875rem;
	}

	.empty-message {
		opacity: 0.6;
		font-style: italic;
	}

	.instructions-section {
		background-color: var(--color-base-200);
		padding: 1.5rem;
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
	}

	.shortcuts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.shortcut {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	kbd {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background-color: var(--color-base-300);
		border: var(--border) solid var(--color-base-content);
		border-radius: var(--radius-field);
		font-family: monospace;
		font-size: 0.875rem;
		font-weight: 600;
		min-width: 2.5rem;
		text-align: center;
	}

	.shortcut span {
		font-size: 0.875rem;
		color: var(--color-base-content);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	ul li {
		padding: 0.5rem 0;
		font-size: 0.938rem;
	}

	@media (max-width: 768px) {
		.info-section {
			grid-template-columns: 1fr;
		}

		.shortcuts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
