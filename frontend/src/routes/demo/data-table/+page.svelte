<script lang="ts">
	/**
	 * DataTableComponent Demo
	 * Showcases all features of the data table component
	 */

	import DataTableComponent from '$lib/components/ui/dataTableComponent/dataTableComponent.svelte';
	import type { DataTableColumn } from '$lib/components/ui/dataTableComponent';
	import Button from '$lib/components/ui/formComponents/Button.svelte';
	import ProgressbarComponent from '$lib/components/ui/progressbarComponent/progressbarComponent.svelte';
	import Modal from '$lib/components/ui/modalComponents/Modal.svelte';

	// Sample data types
	interface User {
		id: number;
		name: string;
		email: string;
		status: 'active' | 'inactive' | 'pending';
		progress: number;
		department: string;
		joinDate: string;
	}

	interface Product {
		id: string;
		name: string;
		category: string;
		price: number;
		stock: number;
		rating: number;
	}

	// Generate sample users
	function generateUsers(count: number): User[] {
		const statuses: User['status'][] = ['active', 'inactive', 'pending'];
		const departments = ['Engineering', 'Sales', 'Marketing', 'Support', 'HR'];
		const names = [
			'John Doe',
			'Jane Smith',
			'Bob Johnson',
			'Alice Williams',
			'Charlie Brown',
			'Diana Prince',
			'Eve Anderson',
			'Frank Miller',
			'Grace Lee',
			'Henry Davis'
		];

		return Array.from({ length: count }, (_, i) => ({
			id: i + 1,
			name: names[i % names.length] + ` ${Math.floor(i / names.length) + 1}`,
			email: `user${i + 1}@example.com`,
			status: statuses[i % statuses.length],
			progress: Math.floor(Math.random() * 100),
			department: departments[i % departments.length],
			joinDate: new Date(2020 + Math.floor(i / 100), (i % 12), (i % 28) + 1).toLocaleDateString()
		}));
	}

	// Generate sample products
	function generateProducts(count: number): Product[] {
		const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
		const productNames = [
			'Laptop',
			'Smartphone',
			'Headphones',
			'T-Shirt',
			'Jeans',
			'Sofa',
			'Plant',
			'Basketball',
			'Novel',
			'Backpack'
		];

		return Array.from({ length: count }, (_, i) => ({
			id: `PROD-${1000 + i}`,
			name: productNames[i % productNames.length] + ` Model ${Math.floor(i / productNames.length) + 1}`,
			category: categories[i % categories.length],
			price: Math.floor(Math.random() * 1000) + 10,
			stock: Math.floor(Math.random() * 200),
			rating: Math.floor(Math.random() * 5) + 1
		}));
	}

	// Sample data
	const smallDataset = generateUsers(25);
	const largeDataset = generateUsers(1000);
	const products = generateProducts(50);

	// Modal state
	let isModalOpen = $state(false);
	let selectedUser = $state<User | null>(null);

	// Action handlers
	function handleView(id: number) {
		alert(`Viewing user ${id}`);
	}

	function openUserModal(id: number) {
		const user = smallDataset.find(u => u.id === id);
		if (user) {
			selectedUser = user;
			isModalOpen = true;
		}
	}

	function handleEdit(id: number) {
		alert(`Editing user ${id}`);
	}

	function handleDelete(id: number) {
		if (confirm(`Delete user ${id}?`)) {
			alert(`User ${id} deleted`);
		}
	}

	function handleBuyProduct(id: string) {
		alert(`Buying product ${id}`);
	}

	// Make functions globally accessible for HTML onclick handlers
	if (typeof window !== 'undefined') {
		(window as any).openUserModal = openUserModal;
		(window as any).handleView = handleView;
		(window as any).handleEdit = handleEdit;
		(window as any).handleDelete = handleDelete;
		(window as any).handleBuyProduct = handleBuyProduct;
	}

	// Column definitions for different tables

	// Basic table with sorting and filtering
	const basicColumns: DataTableColumn<User>[] = [
		{
			id: 'id',
			header: 'ID',
			accessorKey: 'id',
			width: 80,
			enable_filter: false,
		},
		{
			id: 'name',
			header: 'Naame',
			accessorKey: 'name',
			width: 200,
			enable_filter: true,
			is_resizable: true
		},
		{
			id: 'email',
			header: 'Email',
			accessorKey: 'email',
			width: 250,
			enable_filter: true
		},
		{
			id: 'department',
			header: 'Department',
			accessorKey: 'department',
			width: 150,
			enable_filter: true
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			width: 120,
			enable_filter: true,
			cell: (row) => {
				const colors = {
					active: 'var(--color-success)',
					inactive: 'var(--color-error)',
					pending: 'var(--color-warning)'
				};
				return `<span style="color: ${colors[row.status]}; font-weight: 600;">${row.status.toUpperCase()}</span>`;
			}
		}
	];

	// Advanced table with custom components
	const advancedColumns: DataTableColumn<User>[] = [
		{
			id: 'id',
			header: 'ID',
			accessorKey: 'id',
			width: 80,
			is_resizable: true
		},
		{
			id: 'name',
			header: 'Name',
			accessorKey: 'name',
			width: 180,
			enable_filter: true
		},
		{
			id: 'email',
			header: 'Email',
			accessorKey: 'email',
			width: 220,
			enable_filter: true
		},
		{
			id: 'progress',
			header: 'Progress',
			width: 200,
			enable_sort: false,
			cell: (row) => {
				// Render progress bar as HTML with inline styles
				const percentage = row.progress;
				const color = percentage < 30 ? 'var(--color-error)' : percentage < 70 ? 'var(--color-warning)' : 'var(--color-success)';
				return `
					<div style="width: 100%; height: 8px; background-color: var(--color-base-300); border-radius: var(--radius-field); overflow: hidden;">
						<div style="width: ${percentage}%; height: 100%; background-color: ${color}; transition: width 0.3s ease;"></div>
					</div>
				`;
			}
		},
		{
			id: 'actions',
			header: 'Actions',
			width: 300,
			enable_sort: false,
			is_resizable: false,
			cell: (row) => {
				// Return multiple buttons - using window functions for onclick
				return `
					<div style="display: flex; gap: 0.5rem;">
						<button 
							onclick="window.openUserModal(${row.id})"
							style="
								padding: 0.25rem 0.75rem;
								font-size: 0.875rem;
								border-radius: var(--radius-field);
								background-color: var(--color-info);
								color: var(--color-info-content);
								border: none;
								cursor: pointer;
							"
						>View Details</button>
						<button 
							onclick="window.handleEdit(${row.id})"
							style="
								padding: 0.25rem 0.75rem;
								font-size: 0.875rem;
								border-radius: var(--radius-field);
								background-color: var(--color-primary);
								color: var(--color-primary-content);
								border: none;
								cursor: pointer;
							"
						>Edit</button>
						<button 
							onclick="window.handleDelete(${row.id})"
							style="
								padding: 0.25rem 0.75rem;
								font-size: 0.875rem;
								border-radius: var(--radius-field);
								background-color: var(--color-error);
								color: var(--color-error-content);
								border: none;
								cursor: pointer;
							"
						>Delete</button>
					</div>
				`;
			}
		}
	];

	// Product table columns
	const productColumns: DataTableColumn<Product>[] = [
		{
			id: 'id',
			header: 'Product ID',
			accessorKey: 'id',
			width: 120
		},
		{
			id: 'name',
			header: 'Product Name',
			accessorKey: 'name',
			width: 250,
			enable_filter: true
		},
		{
			id: 'category',
			header: 'Category',
			accessorKey: 'category',
			width: 150,
			enable_filter: true
		},
		{
			id: 'price',
			header: 'Price',
			width: 120,
			cell: (row) => {
				return `<span style="font-weight: 600; color: var(--color-success);">$${row.price.toFixed(2)}</span>`;
			}
		},
		{
			id: 'stock',
			header: 'Stock',
			accessorKey: 'stock',
			width: 100,
			cell: (row) => {
				const color = row.stock < 50 ? 'var(--color-error)' : 'var(--color-base-content)';
				return `<span style="color: ${color};">${row.stock}</span>`;
			}
		},
		{
			id: 'rating',
			header: 'Rating',
			width: 150,
			enable_sort: false,
			cell: (row) => {
				const stars = '★'.repeat(row.rating) + '☆'.repeat(5 - row.rating);
				return `<span style="color: var(--color-warning); font-size: 1.2em;">${stars}</span>`;
			}
		},
		{
			id: 'actions',
			header: 'Actions',
			width: 120,
			enable_sort: false,
			is_resizable: false,
			cell: (row) => {
				return `
					<button 
						onclick="(${handleBuyProduct})('${row.id}')"
						style="
							padding: 0.25rem 1rem;
							font-size: 0.875rem;
							border-radius: var(--radius-field);
							background-color: var(--color-accent);
							color: var(--color-accent-content);
							border: none;
							cursor: pointer;
							font-weight: 600;
						"
					>Buy Now</button>
				`;
			}
		}
	];

	// Large dataset columns (simplified for performance)
	const largeDatasetColumns: DataTableColumn<User>[] = [
		{
			id: 'id',
			header: 'ID',
			accessorKey: 'id',
			width: 80
		},
		{
			id: 'name',
			header: 'Name',
			accessorKey: 'name',
			width: 200,
			enable_filter: true
		},
		{
			id: 'email',
			header: 'Email',
			accessorKey: 'email',
			width: 250
		},
		{
			id: 'department',
			header: 'Department',
			accessorKey: 'department',
			width: 150,
			enable_filter: true
		},
		{
			id: 'joinDate',
			header: 'Join Date',
			accessorKey: 'joinDate',
			width: 120
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			width: 120
		}
	];
</script>

<div class="min-h-screen p-8" style="background-color: var(--color-base-100); color: var(--color-base-content);">
	<div class="max-w-7xl mx-auto space-y-12">
		<!-- Header -->
		<div class="space-y-2">
			<h1 class="text-4xl font-bold" style="color: var(--color-primary);">DataTableComponent Demo</h1>
			<p class="text-lg opacity-80">
				Showcasing TanStack Table Core v8 with Svelte 5 - Sorting, Filtering, Resizing, Pagination
				& Custom Rendering
			</p>
		</div>

		<!-- Demo 1: Basic Table -->
		<section class="space-y-4">
			<div class="space-y-1">
				<h2 class="text-2xl font-semibold" style="color: var(--color-secondary);">
					1. Basic Table with Sorting & Filtering
				</h2>
				<p class="opacity-70">
					25 rows with column sorting (click headers), filtering (click filter icon), and custom
					status rendering
				</p>
			</div>
			<div class="rounded-lg overflow-hidden border" style="border-color: var(--color-base-300);">
				<DataTableComponent
					data={smallDataset}
					columns={basicColumns}
					pagination={{ pageSize: 10, showPageSizeSelector: true }}
					rowKey="id"
				/>
			</div>
		</section>

		<!-- Demo 2: Advanced Table with Components -->
		<section class="space-y-4">
			<div class="space-y-1">
				<h2 class="text-2xl font-semibold" style="color: var(--color-secondary);">
					2. Advanced Table with Custom Components
				</h2>
				<p class="opacity-70">
					Progress bars and action buttons rendered inside table cells
				</p>
			</div>
			<div class="rounded-lg overflow-hidden border" style="border-color: var(--color-base-300);">
				<DataTableComponent
					data={smallDataset}
					columns={advancedColumns}
					pagination={{ pageSize: 8 }}
					rowKey="id"
				/>
			</div>
		</section>

		<!-- Demo 3: Product Table -->
		<section class="space-y-4">
			<div class="space-y-1">
				<h2 class="text-2xl font-semibold" style="color: var(--color-secondary);">
					3. Product Catalog Table
				</h2>
				<p class="opacity-70">
					50 products with formatted prices, stock indicators, star ratings, and buy buttons
				</p>
			</div>
			<div class="rounded-lg overflow-hidden border" style="border-color: var(--color-base-300);">
				<DataTableComponent
					data={products}
					columns={productColumns}
					pagination={{
						pageSize: 10,
						pageSizeOptions: [10, 25, 50],
						showPageSizeSelector: true
					}}
					rowKey="id"
				/>
			</div>
		</section>

		<!-- Demo 4: Large Dataset -->
		<section class="space-y-4">
			<div class="space-y-1">
				<h2 class="text-2xl font-semibold" style="color: var(--color-secondary);">
					4. Large Dataset (1,000 Rows)
				</h2>
				<p class="opacity-70">
					Pagination handles large datasets efficiently. Try different page sizes.
				</p>
			</div>
			<div class="rounded-lg overflow-hidden border" style="border-color: var(--color-base-300);">
				<DataTableComponent
					data={largeDataset}
					columns={largeDatasetColumns}
					pagination={{
						pageSize: 50,
						pageSizeOptions: [25, 50, 100],
						showPageSizeSelector: true,
						showPaginationInfo: true
					}}
					rowKey="id"
				/>
			</div>
		</section>

		<!-- Feature Summary -->
		<section
			class="p-6 rounded-lg space-y-4"
			style="background-color: var(--color-base-200); border: 1px solid var(--color-base-300);"
		>
			<h2 class="text-2xl font-semibold" style="color: var(--color-accent);">Features Demonstrated</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-2">
					<h3 class="font-semibold" style="color: var(--color-primary);">Column Features</h3>
					<ul class="space-y-1 opacity-80 list-disc list-inside">
						<li>Sorting (click headers to cycle: none → asc → desc)</li>
						<li>Filtering (click filter icon for column search)</li>
						<li>Resizing (drag column edges)</li>
						<li>Custom widths and constraints</li>
					</ul>
				</div>
				<div class="space-y-2">
					<h3 class="font-semibold" style="color: var(--color-primary);">Table Features</h3>
					<ul class="space-y-1 opacity-80 list-disc list-inside">
						<li>Client-side pagination with configurable page sizes</li>
						<li>Custom cell rendering (HTML, components, buttons)</li>
						<li>Progress bars and interactive elements</li>
						<li>Handles datasets from 10 to 1,000+ rows</li>
					</ul>
				</div>
				<div class="space-y-2">
					<h3 class="font-semibold" style="color: var(--color-primary);">Accessibility</h3>
					<ul class="space-y-1 opacity-80 list-disc list-inside">
						<li>Semantic HTML table markup</li>
						<li>ARIA attributes for screen readers</li>
						<li>Keyboard navigation support</li>
						<li>Focus management</li>
					</ul>
				</div>
				<div class="space-y-2">
					<h3 class="font-semibold" style="color: var(--color-primary);">Technical</h3>
					<ul class="space-y-1 opacity-80 list-disc list-inside">
						<li>TanStack Table Core v8</li>
						<li>Svelte 5 with runes ($state, $derived)</li>
						<li>Tailwind CSS styling only</li>
						<li>Full TypeScript support</li>
					</ul>
				</div>
			</div>
		</section>
	</div>
</div>

<!-- User Details Modal -->
<Modal bind:open={isModalOpen} title="User Details" size="md">
	{#snippet children()}
		{#if selectedUser}
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="text-sm font-semibold opacity-70">ID</label>
						<p class="text-base">{selectedUser.id}</p>
					</div>
					<div>
						<label class="text-sm font-semibold opacity-70">Status</label>
						<p class="text-base">
							<span
								style="color: {selectedUser.status === 'active'
									? 'var(--color-success)'
									: selectedUser.status === 'inactive'
										? 'var(--color-error)'
										: 'var(--color-warning)'}; font-weight: 600;"
							>
								{selectedUser.status.toUpperCase()}
							</span>
						</p>
					</div>
				</div>
				<div>
					<label class="text-sm font-semibold opacity-70">Name</label>
					<p class="text-base">{selectedUser.name}</p>
				</div>
				<div>
					<label class="text-sm font-semibold opacity-70">Email</label>
					<p class="text-base">{selectedUser.email}</p>
				</div>
				<div>
					<label class="text-sm font-semibold opacity-70">Department</label>
					<p class="text-base">{selectedUser.department}</p>
				</div>
				<div>
					<label class="text-sm font-semibold opacity-70">Join Date</label>
					<p class="text-base">{selectedUser.joinDate}</p>
				</div>
				<div>
					<label class="text-sm font-semibold opacity-70">Progress</label>
					<div class="flex items-center gap-3">
						<div
							style="flex: 1; height: 12px; background-color: var(--color-base-300); border-radius: var(--radius-field); overflow: hidden;"
						>
							<div
								style="width: {selectedUser.progress}%; height: 100%; background-color: {selectedUser.progress < 30
									? 'var(--color-error)'
									: selectedUser.progress < 70
										? 'var(--color-warning)'
										: 'var(--color-success)'}; transition: width 0.3s ease;"
							></div>
						</div>
						<span class="text-sm font-semibold">{selectedUser.progress}%</span>
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={() => (isModalOpen = false)}>Close</Button>
			<Button
				variant="primary"
				onclick={() => {
					if (selectedUser) {
						alert(`Editing user ${selectedUser.id}`);
					}
				}}
			>
				Edit User
			</Button>
		</div>
	{/snippet}
</Modal>
