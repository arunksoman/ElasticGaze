<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import DefaultConnectionMessage from '$lib/components/app/DefaultConnectionMessage.svelte';
	import Button from '$lib/components/ui/formComponents/Button.svelte';
	import Modal from '$lib/components/ui/modalComponents/Modal.svelte';
	import ModalHeader from '$lib/components/ui/modalComponents/ModalHeader.svelte';
	import ModalBody from '$lib/components/ui/modalComponents/ModalBody.svelte';
	import ModalFooter from '$lib/components/ui/modalComponents/ModalFooter.svelte';
	import Input from '$lib/components/ui/formComponents/Input.svelte';
	import Checkbox from '$lib/components/ui/formComponents/Checkbox.svelte';
	import DataTableComponent from '$lib/components/ui/dataTableComponent/dataTableComponent.svelte';
	import ContextMenu from '$lib/components/ui/contextMenuComponents/ContextMenu.svelte';
	import type { DataTableColumn } from '$lib/components/ui/dataTableComponent/dataTableComponent.types';
	import type { ContextMenuItemData } from '$lib/components/ui/contextMenuComponents/contextMenuStore';
	import { GetDefaultConfig, GetIndices, CreateIndex, DeleteIndex } from '$lib/wailsjs/go/main/App';
	import { Search, MoreOne, Plus } from '@icon-park/svg';

	// Types
	interface IndexData {
		name: string;
		health: string;
		status: string;
		uuid: string;
		aliases: string;
		pri: string;
		rep: string;
		segments: string;
		docs_count: string;
		store_size: string;
		creation_time: string;
	}

	// State
	let activeTab: 'indices' | 'templates' = $state('indices');
	let loading: boolean = $state(false);
	let indices: IndexData[] = $state([]);
	let selectedIndices: Set<string> = $state(new Set());
	let defaultConfig: any = $state(null);
	let showCreateModal: boolean = $state(false);
	let showContextMenu: boolean = $state(false);
	let contextMenuPosition: { x: number; y: number } = $state({ x: 0, y: 0 });
	let contextMenuIndex: IndexData | null = $state(null);

	// Create index form
	let indexName: string = $state('');
	let numShards: number = $state(1);
	let numReplicas: number = $state(1);
	let formError: string = $state('');
	let creatingIndex: boolean = $state(false);

	// Select all state
	let selectAll: boolean = $state(false);
	
	// Key to force table re-render when selection changes
	let tableKey: number = $state(0);

	// Function to toggle select all
	function toggleSelectAll() {
		if (selectAll) {
			// Select all indices
			indices.forEach(index => selectedIndices.add(index.name));
			selectedIndices = selectedIndices;
		} else {
			// Deselect all
			selectedIndices.clear();
			selectedIndices = selectedIndices;
		}
		tableKey++; // Force table re-render
	}

	// DataTable columns - reactive to selectAll and selectedIndices changes
	let columns: DataTableColumn<IndexData>[] = $derived([
		{
			id: 'select',
			header: () => {
				return `
					<input 
						type="checkbox" 
						class="index-select-all-checkbox" 
						${selectAll ? 'checked' : ''}
						style="width: 1.25rem; height: 1.25rem; cursor: pointer; 
							background-color: ${selectAll ? 'var(--color-accent)' : 'var(--color-base-200)'};
							border: var(--border) solid ${selectAll ? 'var(--color-accent)' : 'var(--color-base-300)'};
							border-radius: var(--radius-box);"
					/>
				`;
			},
			width: 40,
			enable_sort: false,
			cell: (row: IndexData) => {
				const isSelected = selectedIndices.has(row.name);
				return `
					<input 
						type="checkbox" 
						class="index-select-checkbox" 
						data-index="${row.name}"
						${isSelected ? 'checked' : ''}
						style="width: 1.25rem; height: 1.25rem; cursor: pointer; 
							background-color: ${isSelected ? 'var(--color-accent)' : 'var(--color-base-200)'};
							border: var(--border) solid ${isSelected ? 'var(--color-accent)' : 'var(--color-base-300)'};
							border-radius: var(--radius-box);"
					/>
				`;
			}
		},
		{
			id: 'name',
			header: 'Name',
			accessorKey: 'name',
			width: 200,
			enable_sort: true,
			enable_filter: true
		},
		{
			id: 'health',
			header: 'Health',
			width: 100,
			enable_sort: true,
			enable_filter: true,
			cell: (row: IndexData) => {
				const colors: Record<string, string> = {
					green: 'var(--color-success)',
					yellow: 'var(--color-warning)',
					red: 'var(--color-error)'
				};
				const color = colors[row.health] || 'var(--color-base-content)';
				return `
					<div style="display: flex; align-items: center; gap: 0.5rem;">
						<span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background-color: ${color};"></span>
						<span>${row.health}</span>
					</div>
				`;
			}
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			width: 120,
			enable_sort: true
		},
		{
			id: 'uuid',
			header: 'UUID',
			accessorKey: 'uuid',
			width: 250,
			enable_filter: true
		},
		{
			id: 'aliases',
			header: 'Aliases',
			accessorKey: 'aliases',
			width: 150
		},
		{
			id: 'shards',
			header: 'Shards',
			width: 100,
			cell: (row: IndexData) => `${row.pri}p ${row.rep}r`
		},
		{
			id: 'segments',
			header: 'Segments',
			accessorKey: 'segments',
			width: 100,
			enable_sort: true
		},
		{
			id: 'docs',
			header: 'Docs',
			accessorKey: 'docs_count',
			width: 100,
			enable_sort: true
		},
		{
			id: 'storage',
			header: 'Storage',
			accessorKey: 'store_size',
			width: 120,
			enable_sort: true
		},
		{
			id: 'created',
			header: 'Created',
			accessorKey: 'creation_time',
			width: 180,
			enable_sort: true
		},
		{
			id: 'actions',
			header: 'Actions',
			width: 100,
			enable_sort: false,
			cell: (row: IndexData) => {
				return `
					<div style="display: flex; gap: 0.5rem; align-items: center;">
						<button 
							class="action-btn search-btn" 
							data-index="${row.name}"
							disabled
							style="padding: 0.25rem 0.5rem; border-radius: var(--radius-field); 
								background-color: var(--color-base-200); border: var(--border) solid var(--color-base-300);
								cursor: not-allowed; opacity: 0.5;"
						>
							${Search({ theme: 'outline', size: '16', strokeWidth: 3 })}
						</button>
						<button 
							class="action-btn more-btn" 
							data-index="${row.name}"
							style="padding: 0.25rem 0.5rem; border-radius: var(--radius-field); 
								background-color: var(--color-base-200); border: var(--border) solid var(--color-base-300);
								cursor: pointer;"
						>
							${MoreOne({ theme: 'outline', size: '16', strokeWidth: 3 })}
						</button>
					</div>
				`;
			}
		}
	]);

	// Context menu items
	const contextMenuItems: ContextMenuItemData[] = [
		{
			id: 'delete',
			label: 'Delete Index',
			icon: 'Delete',
			action: () => handleDeleteIndex(contextMenuIndex?.name || '')
		}
	];

	// Load default config and indices
	onMount(async () => {
		try {
			console.log('Fetching default config...');
			const config = await GetDefaultConfig();
			console.log('Default config received:', config);
			defaultConfig = config;
			if (config) {
				await loadIndices();
			} else {
				console.log('No default config available');
			}
		} catch (error) {
			console.error('Failed to load default config:', error);
		}
	});

	async function loadIndices() {
		if (!defaultConfig) {
			console.log('No default config found');
			return;
		}
		
		loading = true;
		try {
			console.log('Loading indices for config:', defaultConfig.id);
			const response = await GetIndices(defaultConfig.id);
			console.log('GetIndices response:', response);
			
			if (response && response.success && response.indices) {
				console.log('Mapping indices data, count:', response.indices.length);
				indices = response.indices.map((idx: any) => ({
					name: idx.name || '',
					health: idx.health || 'unknown',
					status: idx.status || '',
					uuid: idx.uuid || '',
					aliases: idx.aliases || '-',
					pri: idx.pri || '0',
					rep: idx.rep || '0',
					segments: idx.segments || '0',
					docs_count: idx.docs_count || '0',
					store_size: idx.store_size || '0',
					creation_time: idx.creation_date || ''
				}));
				console.log('Indices loaded successfully:', indices.length);
			} else {
				console.error('Failed to load indices:', response?.error || 'Unknown error');
				indices = [];
			}
		} catch (error) {
			console.error('Error loading indices:', error);
			indices = [];
		} finally {
			loading = false;
		}
	}

	function handleCreateClick() {
		showCreateModal = true;
		indexName = '';
		numShards = 1;
		numReplicas = 1;
		formError = '';
	}

	async function handleCreateIndex() {
		if (!defaultConfig) return;
		
		formError = '';
		
		if (!indexName.trim()) {
			formError = 'Index name is required';
			return;
		}
		
		if (numShards < 1) {
			formError = 'Number of shards must be at least 1';
			return;
		}
		
		if (numReplicas < 0) {
			formError = 'Number of replicas cannot be negative';
			return;
		}
		
		creatingIndex = true;
		try {
			const response = await CreateIndex({
				config_id: defaultConfig.id,
				index_name: indexName.trim(),
				num_shards: numShards,
				num_replicas: numReplicas
			});
			
			if (response.success) {
				showCreateModal = false;
				await loadIndices();
			} else {
				formError = response.error || 'Failed to create index';
			}
		} catch (error) {
			formError = `Error: ${error}`;
		} finally {
			creatingIndex = false;
		}
	}

	async function handleDeleteIndex(indexName: string) {
		if (!defaultConfig || !indexName) return;
		
		if (!confirm(`Are you sure you want to delete index "${indexName}"?`)) {
			return;
		}
		
		try {
			const response = await DeleteIndex({
				config_id: defaultConfig.id,
				index_name: indexName
			});
			
			if (response.success) {
				await loadIndices();
				selectedIndices.delete(indexName);
				selectedIndices = selectedIndices;
			} else {
				alert(`Failed to delete index: ${response.error}`);
			}
		} catch (error) {
			alert(`Error deleting index: ${error}`);
		}
	}

	// Handle checkbox clicks
	function handleCheckboxClick(event: Event) {
		const target = event.target as HTMLInputElement;
		
		// Handle select all checkbox
		if (target.classList.contains('index-select-all-checkbox')) {
			selectAll = target.checked;
			toggleSelectAll();
			return;
		}
		
		// Handle individual row checkbox
		if (target.classList.contains('index-select-checkbox')) {
			const indexName = target.dataset.index;
			if (indexName) {
				if (target.checked) {
					selectedIndices.add(indexName);
				} else {
					selectedIndices.delete(indexName);
				}
				selectedIndices = selectedIndices;
				
				// Update select all checkbox state
				tableKey++; // Force table re-render
				selectAll = selectedIndices.size === indices.length && indices.length > 0;
			}
		}
	}

	// Handle more button clicks
	function handleMoreClick(event: Event) {
		const target = event.target as HTMLElement;
		const button = target.closest('.more-btn') as HTMLButtonElement;
		if (button) {
			const indexName = button.dataset.index;
			const index = indices.find(idx => idx.name === indexName);
			if (index) {
				contextMenuIndex = index;
				const rect = button.getBoundingClientRect();
				contextMenuPosition = { x: rect.right, y: rect.bottom };
				showContextMenu = true;
			}
		}
	}

	// Add event delegation for clicks
	onMount(() => {
		const handleClick = (event: MouseEvent) => {
			handleCheckboxClick(event);
			handleMoreClick(event);
		};
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	});
</script>

<div class="max-w-full ml-4 mt-4 mr-4">
	{#if !defaultConfig}
		<h1 class="text-2xl font-bold mb-4">Indices</h1>
		<DefaultConnectionMessage currentPath={$page.url.pathname} />
	{:else}
		<div class="flex items-center justify-between mb-4">
			<h1 class="text-2xl font-bold">Indices</h1>
		</div>

		<!-- Tabs -->
		<div class="tabs-container mb-4" style="border-bottom: var(--border) solid var(--color-base-300);">
			<div class="flex gap-2">
				<button
					class="tab-button"
					class:active={activeTab === 'indices'}
					onclick={() => activeTab = 'indices'}
					style="padding: 0.75rem 1.5rem; background: {activeTab === 'indices' ? 'var(--color-base-100)' : 'transparent'};
						color: {activeTab === 'indices' ? 'var(--color-primary)' : 'var(--color-base-content)'};
						border: none; border-bottom: 2px solid {activeTab === 'indices' ? 'var(--color-primary)' : 'transparent'};
						cursor: pointer; font-weight: 500; transition: all 0.2s;"
				>
					Indices
				</button>
				<button
					class="tab-button"
					class:active={activeTab === 'templates'}
					onclick={() => activeTab = 'templates'}
					style="padding: 0.75rem 1.5rem; background: {activeTab === 'templates' ? 'var(--color-base-100)' : 'transparent'};
						color: {activeTab === 'templates' ? 'var(--color-primary)' : 'var(--color-base-content)'};
						border: none; border-bottom: 2px solid {activeTab === 'templates' ? 'var(--color-primary)' : 'transparent'};
						cursor: pointer; font-weight: 500; transition: all 0.2s;"
				>
					Index Templates
				</button>
			</div>
		</div>

		<!-- Indices Tab Content -->
		{#if activeTab === 'indices'}
			<div class="mb-4">
				<Button icon="Plus" onclick={handleCreateClick}>
					Create Index
				</Button>
			</div>

			{#if loading}
				<div class="text-center py-8" style="color: var(--color-base-content);">
					Loading indices...
				</div>
			{:else if indices.length === 0}
				<div class="text-center py-8" style="color: var(--color-base-content);">
					No indices found
				</div>
			{:else}
				{#key tableKey}
					<DataTableComponent 
						data={indices} 
						{columns}
						pagination={{ pageSize: 25, showPageSizeSelector: true, showPaginationInfo: true }}
					/>
				{/key}
			{/if}
		{/if}

		<!-- Templates Tab Content -->
		{#if activeTab === 'templates'}
			<div class="text-center py-8" style="color: var(--color-base-content);">
				Index Templates - Coming Soon
			</div>
		{/if}
	{/if}
</div>

<!-- Create Index Modal -->
<Modal bind:open={showCreateModal} size="md" centered>
	{#snippet header()}
		<ModalHeader>
			<h2 class="text-xl font-semibold">Create New Index</h2>
		</ModalHeader>
	{/snippet}

	{#snippet children()}
		<ModalBody>
			<div class="space-y-4">
				<Input
					bind:value={indexName}
					label="Index Name"
					placeholder="my-new-index"
					disabled={creatingIndex}
				/>
				
				<div>
					<label for="numShards" class="block text-sm font-medium mb-1" style="color: var(--color-base-content);">Number of Shards</label>
					<input
						id="numShards"
						type="number"
						bind:value={numShards}
						min="1"
						placeholder="1"
						disabled={creatingIndex}
						class="w-full px-3 py-2"
						style="background-color: var(--color-base-200); color: var(--color-base-content); border: var(--border) solid var(--color-base-300); border-radius: var(--radius-field);"
					/>
				</div>
				
				<div>
					<label for="numReplicas" class="block text-sm font-medium mb-1" style="color: var(--color-base-content);">Number of Replicas</label>
					<input
						id="numReplicas"
						type="number"
						bind:value={numReplicas}
						min="0"
						placeholder="1"
						disabled={creatingIndex}
						class="w-full px-3 py-2"
						style="background-color: var(--color-base-200); color: var(--color-base-content); border: var(--border) solid var(--color-base-300); border-radius: var(--radius-field);"
					/>
				</div>
				
				{#if formError}
					<div class="text-sm" style="color: var(--color-error); padding: 0.5rem; background: var(--color-error); opacity: 0.2; border-radius: var(--radius-field);">
						{formError}
					</div>
				{/if}
			</div>
		</ModalBody>
	{/snippet}

	{#snippet footer()}
		<ModalFooter>
			<div class="flex gap-2 justify-end">
				<Button variant="primary" onclick={handleCreateIndex} loading={creatingIndex}>
					Create
				</Button>
			</div>
		</ModalFooter>
	{/snippet}
</Modal>

<!-- Context Menu -->
<ContextMenu
	bind:open={showContextMenu}
	items={contextMenuItems}
	position={contextMenuPosition}
/>