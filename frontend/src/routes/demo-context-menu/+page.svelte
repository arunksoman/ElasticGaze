<script lang="ts">
	import ContextMenu from '$lib/components/ui/contextMenuComponents/ContextMenu.svelte';
	import type { ContextMenuItemData } from '$lib/components/ui/contextMenuComponents/contextMenuStore';
	import { AddOne as FileAdd, FolderOpen, Edit, DeleteOne as Delete, Setting, Copy, Scissors as Cut, Clipboard as Paste } from '@icon-park/svg';
	
	let open = $state(false);
	let position = $state({ x: 0, y: 0 });
	
	// Basic context menu items
	const basicMenuItems: ContextMenuItemData[] = [
		{ 
			id: '1', 
			label: 'New File', 
			icon: FileAdd({ theme: 'outline', size: '16' }), 
			shortcut: 'Ctrl+N' 
		},
		{ 
			id: '2', 
			label: 'Open...', 
			icon: FolderOpen({ theme: 'outline', size: '16' }), 
			shortcut: 'Ctrl+O' 
		},
		{ id: '3', label: '', divider: true },
		{ 
			id: '4', 
			label: 'Rename', 
			icon: Edit({ theme: 'outline', size: '16' }), 
			shortcut: 'F2' 
		},
		{ 
			id: '5', 
			label: 'Delete', 
			icon: Delete({ theme: 'outline', size: '16' }), 
			disabled: true, 
			shortcut: 'Del' 
		},
		{ id: '6', label: '', divider: true },
		{ 
			id: '7', 
			label: 'Properties', 
			icon: Setting({ theme: 'outline', size: '16' }), 
			shortcut: 'Alt+Enter' 
		}
	];
	
	// Grouped context menu items
	const groupedMenuItems: ContextMenuItemData[] = [
		{ 
			id: 'cut', 
			label: 'Cut', 
			icon: Cut({ theme: 'outline', size: '16' }), 
			shortcut: 'Ctrl+X',
			group: 'Edit'
		},
		{ 
			id: 'copy', 
			label: 'Copy', 
			icon: Copy({ theme: 'outline', size: '16' }), 
			shortcut: 'Ctrl+C',
			group: 'Edit'
		},
		{ 
			id: 'paste', 
			label: 'Paste', 
			icon: Paste({ theme: 'outline', size: '16' }), 
			shortcut: 'Ctrl+V',
			group: 'Edit',
			disabled: true
		},
		{ 
			id: 'new-file', 
			label: 'New File', 
			icon: FileAdd({ theme: 'outline', size: '16' }),
			group: 'File'
		},
		{ 
			id: 'open-file', 
			label: 'Open File', 
			icon: FolderOpen({ theme: 'outline', size: '16' }),
			group: 'File'
		},
		{ 
			id: 'properties', 
			label: 'Properties', 
			icon: Setting({ theme: 'outline', size: '16' }) 
		}
	];
	
	let currentItems = $state(basicMenuItems);
	let isGrouped = $state(false);
	let selectedItem = $state<string | null>(null);
	let logMessages = $state<string[]>([]);
	
	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		position = { x: event.clientX, y: event.clientY };
		open = true;
		addLog(`Context menu opened at (${event.clientX}, ${event.clientY})`);
	}
	
	function handleSelect(item: ContextMenuItemData) {
		selectedItem = item.label;
		addLog(`Selected: ${item.label} (ID: ${item.id})`);
		
		// Simulate some actions
		if (item.id === '1' || item.id === 'new-file') {
			addLog('Action: Creating new file...');
		} else if (item.id === '2' || item.id === 'open-file') {
			addLog('Action: Opening file dialog...');
		} else if (item.id === '4') {
			addLog('Action: Starting rename operation...');
		} else if (item.id === '7' || item.id === 'properties') {
			addLog('Action: Opening properties dialog...');
		}
	}
	
	function handleClose() {
		addLog('Context menu closed');
	}
	
	function handleOpen() {
		addLog('Context menu opened');
	}
	
	function addLog(message: string) {
		const timestamp = new Date().toLocaleTimeString();
		logMessages = [`[${timestamp}] ${message}`, ...logMessages.slice(0, 19)];
	}
	
	function toggleGrouped() {
		isGrouped = !isGrouped;
		currentItems = isGrouped ? groupedMenuItems : basicMenuItems;
		addLog(`Switched to ${isGrouped ? 'grouped' : 'basic'} menu items`);
	}
	
	function clearLogs() {
		logMessages = [];
	}
</script>

<svelte:head>
	<title>Context Menu Demo - ElasticGaze</title>
</svelte:head>

<div class="demo-container">
	<header class="demo-header">
		<h1>Context Menu Component Demo</h1>
		<p>Right-click anywhere in the demo areas below to open context menus.</p>
	</header>
	
	<div class="demo-controls">
		<button onclick={toggleGrouped} class="btn">
			{isGrouped ? 'Switch to Basic Menu' : 'Switch to Grouped Menu'}
		</button>
		<button onclick={clearLogs} class="btn btn-secondary">
			Clear Logs
		</button>
	</div>
	
	<div class="demo-grid">
		<!-- Primary Demo Area -->
		<section class="demo-section">
			<h2>Primary Demo Area</h2>
			<div 
				class="context-area primary"
				role="button"
				tabindex="0"
				oncontextmenu={handleContextMenu}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleContextMenu(e as any); }}
			>
				<div class="context-content">
					<div class="demo-icon">🖱️</div>
					<p><strong>Right-click here</strong></p>
					<p>Current mode: <em>{isGrouped ? 'Grouped Items' : 'Basic Items'}</em></p>
					{#if selectedItem}
						<p class="last-selected">Last selected: <span>{selectedItem}</span></p>
					{/if}
				</div>
			</div>
		</section>
		
		<!-- Keyboard Navigation Guide -->
		<section class="demo-section">
			<h2>Keyboard Navigation</h2>
			<div class="keyboard-guide">
				<div class="key-combo">
					<kbd>↑</kbd><kbd>↓</kbd> Navigate items
				</div>
				<div class="key-combo">
					<kbd>Home</kbd><kbd>End</kbd> First/Last item
				</div>
				<div class="key-combo">
					<kbd>PageUp</kbd><kbd>PageDown</kbd> Jump by 5 items
				</div>
				<div class="key-combo">
					<kbd>Enter</kbd><kbd>Space</kbd> Select item
				</div>
				<div class="key-combo">
					<kbd>Esc</kbd><kbd>Tab</kbd> Close menu
				</div>
				<div class="key-combo">
					<kbd>A-Z</kbd> Typeahead search
				</div>
			</div>
		</section>
	</div>
	
	<!-- Event Log -->
	<section class="demo-section">
		<h2>Event Log</h2>
		<div class="event-log">
			{#if logMessages.length === 0}
				<p class="no-events">No events yet. Right-click to start testing!</p>
			{:else}
				{#each logMessages as message, i (i)}
					<div class="log-entry" class:recent={i < 3}>
						{message}
					</div>
				{/each}
			{/if}
		</div>
	</section>
	
	<!-- Features Overview -->
	<section class="demo-section">
		<h2>Features Demonstrated</h2>
		<ul class="feature-list">
			<li>✅ <strong>Accessibility:</strong> Full ARIA support with <code>aria-activedescendant</code></li>
			<li>✅ <strong>Keyboard Navigation:</strong> Arrow keys, Home/End, PageUp/PageDown</li>
			<li>✅ <strong>Typeahead:</strong> Type letters to jump to matching items</li>
			<li>✅ <strong>Icons & Shortcuts:</strong> IconPark SVG icons and keyboard shortcuts</li>
			<li>✅ <strong>Grouping:</strong> Logical sections with group labels</li>
			<li>✅ <strong>Disabled States:</strong> Visual and functional disabled items</li>
			<li>✅ <strong>Dividers:</strong> Visual separation between item sections</li>
			<li>✅ <strong>Theming:</strong> Uses app.css variables for consistent styling</li>
			<li>✅ <strong>Auto-positioning:</strong> Smart viewport boundary detection</li>
			<li>✅ <strong>Click Outside:</strong> Automatic menu closing</li>
		</ul>
	</section>
</div>

<!-- Context Menu Component -->
<ContextMenu
	bind:open
	position={position}
	items={currentItems}
	grouped={isGrouped}
	typeahead={true}
	maxHeight="400px"
	autoClose={true}
	onselect={handleSelect}
	onclose={handleClose}
	onopen={handleOpen}
/>

<style>
	.demo-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		color: var(--color-base-content);
	}
	
	.demo-header {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.demo-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-primary);
	}
	
	.demo-header p {
		font-size: 1.125rem;
		opacity: 0.8;
	}
	
	.demo-controls {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	
	.btn {
		padding: 0.5rem 1rem;
		background: var(--color-primary);
		color: var(--color-primary-content);
		border: none;
		border-radius: var(--radius-field);
		cursor: pointer;
		font-weight: 500;
		transition: opacity 0.2s ease;
	}
	
	.btn:hover {
		opacity: 0.8;
	}
	
	.btn-secondary {
		background: var(--color-base-300);
		color: var(--color-base-content);
	}
	
	.demo-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}
	
	.demo-section {
		background: var(--color-base-100);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
		padding: 1.5rem;
	}
	
	.demo-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-accent);
	}
	
	.context-area {
		min-height: 200px;
		background: var(--color-base-200);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: context-menu;
		transition: background-color 0.2s ease;
	}
	
	.context-area:hover {
		background: var(--color-base-300);
	}
	
	.context-content {
		text-align: center;
		user-select: none;
	}
	
	.demo-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	
	.last-selected {
		margin-top: 1rem;
		padding: 0.5rem;
		background: var(--color-accent);
		color: var(--color-accent-content);
		border-radius: var(--radius-field);
		font-size: 0.875rem;
	}
	
	.last-selected span {
		font-weight: 600;
	}
	
	.keyboard-guide {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.key-combo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	
	kbd {
		padding: 0.125rem 0.375rem;
		background: var(--color-base-300);
		border: var(--border) solid var(--color-base-content);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 1.5rem;
		text-align: center;
	}
	
	.event-log {
		max-height: 300px;
		overflow-y: auto;
		background: var(--color-base-200);
		border-radius: var(--radius-field);
		padding: 1rem;
	}
	
	.no-events {
		text-align: center;
		opacity: 0.6;
		font-style: italic;
	}
	
	.log-entry {
		padding: 0.25rem 0;
		border-bottom: 1px solid var(--color-base-300);
		font-family: monospace;
		font-size: 0.875rem;
		transition: opacity 0.5s ease;
	}
	
	.log-entry:last-child {
		border-bottom: none;
	}
	
	.log-entry.recent {
		color: var(--color-accent);
		font-weight: 500;
	}
	
	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.feature-list li {
		padding: 0.5rem;
		background: var(--color-base-200);
		border-radius: var(--radius-field);
		font-size: 0.875rem;
	}
	
	.feature-list code {
		background: var(--color-base-300);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
	}
	
	@media (max-width: 768px) {
		.demo-grid {
			grid-template-columns: 1fr;
		}
		
		.demo-controls {
			flex-direction: column;
			align-items: center;
		}
	}
</style>