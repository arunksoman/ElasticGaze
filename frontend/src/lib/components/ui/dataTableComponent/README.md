# DataTableComponent

A high-performance, flexible data table component for SvelteKit built with TanStack Table Core v8 and Svelte 5 runes.

## Features

- ✅ **Column Sorting** - Click headers to sort (none → asc → desc)
- ✅ **Column Filtering** - Per-column text filtering
- ⏸️ **Column Resizing** - Temporarily disabled (will be re-implemented)
- ✅ **Client-side Pagination** - Configurable page sizes with controls
- ✅ **Custom Cell Rendering** - Render any Svelte component or HTML
- ✅ **Fully Accessible** - Semantic HTML with ARIA attributes
- ✅ **Tailwind CSS Only** - No additional CSS files needed
- ✅ **Type-safe** - Full TypeScript support with generics

## Installation

The component uses `@tanstack/table-core` which should already be installed:

```bash
pnpm add @tanstack/table-core
```

## Basic Usage

```svelte
<script lang="ts">
	import { DataTableComponent } from '$lib/components/ui/dataTableComponent';
	import type { DataTableColumn } from '$lib/components/ui/dataTableComponent';

	interface User {
		id: number;
		name: string;
		email: string;
		status: string;
	}

	const users: User[] = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
	];

	const columns: DataTableColumn<User>[] = [
		{ id: 'id', header: 'ID', accessorKey: 'id', width: 80 },
		{ id: 'name', header: 'Name', accessorKey: 'name' },
		{ id: 'email', header: 'Email', accessorKey: 'email' },
		{ id: 'status', header: 'Status', accessorKey: 'status' }
	];
</script>

<DataTableComponent data={users} columns={columns} />
```

## Column Configuration

### DataTableColumn Interface

```typescript
interface DataTableColumn<T> {
	id: string; // Unique column identifier
	header: string; // Column header text
	accessorKey?: keyof T; // Key to access data in row object

	// Feature flags (all optional)
	is_resizable?: boolean; // Enable resizing (default: true)
	enable_sort?: boolean; // Enable sorting (default: true)
	enable_filter?: boolean; // Enable filtering (default: false)

	// Sizing
	width?: number; // Initial width in pixels (default: 150)
	minWidth?: number; // Minimum width (default: 50)
	maxWidth?: number; // Maximum width (default: 500)

	// Custom rendering
	cell?: (row: T) => any; // Custom cell renderer
}
```

## Pagination

### Basic Pagination

```svelte
<DataTableComponent
	data={users}
	columns={columns}
	pagination={{ pageSize: 25 }}
/>
```

### Pagination Options

```typescript
interface PaginationOptions {
	pageSize?: number; // Rows per page (default: 10)
	pageSizeOptions?: number[]; // Available sizes (default: [10, 25, 50, 100])
	showPageSizeSelector?: boolean; // Show size dropdown (default: true)
	showPaginationInfo?: boolean; // Show "Showing X to Y of Z" (default: true)
}
```

### Advanced Pagination Example

```svelte
<DataTableComponent
	data={users}
	columns={columns}
	pagination={{
		pageSize: 20,
		pageSizeOptions: [10, 20, 50, 100],
		showPageSizeSelector: true,
		showPaginationInfo: true
	}}
/>
```

## Custom Cell Rendering

### Rendering HTML and Components

The `cell` function should return an HTML string that will be rendered using `{@html}`. You can create any custom UI this way:

```svelte
<script lang="ts">
	const columns: DataTableColumn<User>[] = [
		{
			id: 'name',
			header: 'Name',
			accessorKey: 'name'
		},
		{
			id: 'progress',
			header: 'Progress',
			cell: (row) => {
				// Render a progress bar as HTML
				const percentage = row.progress;
				const color = percentage < 50 ? '#ef4444' : '#22c55e';
				return `
					<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">
						<div style="width: ${percentage}%; height: 100%; background: ${color};"></div>
					</div>
				`;
			}
		},
		{
			id: 'actions',
			header: 'Actions',
			enable_sort: false,
			cell: (row) => {
				// Render buttons with inline event handlers
				return `
					<button 
						onclick="alert('Edit user ${row.id}')"
						style="padding: 0.25rem 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
					>
						Edit
					</button>
				`;
			}
		}
	];
</script>
```

### Interactive Elements with Event Handlers

For interactive elements like buttons, use inline onclick handlers or global functions:

```typescript
// Define handler outside component
function handleEdit(id: number) {
	alert(`Editing user ${id}`);
}

// In column definition
{
	id: 'actions',
	header: 'Actions',
	cell: (row) => {
		return `
			<button onclick="(${handleEdit})(${row.id})">Edit</button>
		`;
	}
}
```

### Rendering HTML

```typescript
{
	id: 'status',
	header: 'Status',
	cell: (row) => {
		const color = row.status === 'active' ? 'var(--color-success)' : 'var(--color-error)';
		return `<span style="color: ${color}; font-weight: 600;">${row.status}</span>`;
	}
}
```

## Column Features

### Sorting

Enabled by default. Click column headers to cycle through: none → ascending → descending.

```typescript
// Disable sorting for a column
{ id: 'actions', header: 'Actions', enable_sort: false }
```

### Filtering

Disabled by default. Shows a filter icon that reveals a search input.

```typescript
// Enable filtering for a column
{ id: 'name', header: 'Name', enable_filter: true }
```

### Resizing

**Note:** Column resizing is temporarily disabled due to compatibility issues with TanStack Table Core's resize handler in Svelte 5. This feature will be re-implemented in a future update.

```typescript
// Width configuration still works for initial sizing
{
	id: 'name',
	header: 'Name',
	width: 200,
	minWidth: 100,
	maxWidth: 400
}
```

## Performance Considerations

### Large Datasets

For datasets with hundreds of rows:

1. **Pagination** - Reduce page size (e.g., 25 or 50 rows)
2. **Row Key** - Provide a unique `rowKey` prop for better DOM reconciliation
3. **Disable Features** - Turn off unused features per column

```svelte
<DataTableComponent
	data={largeDataset}
	columns={columns}
	rowKey="id"
	pagination={{ pageSize: 25 }}
/>
```

### Virtualization Note

The `virtualized` prop is defined but not yet implemented. For datasets exceeding 1,000 rows, consider:
- Implementing server-side pagination
- Using a library like `svelte-virtual` for row virtualization
- Filtering data before passing to the component

## Accessibility

The component follows accessibility best practices:

- Semantic `<table>` markup
- `role` attributes for table structure
- `aria-sort` for sortable columns
- `aria-label` for interactive elements
- Keyboard navigation support
- Focus management

## Styling

The component uses Tailwind CSS and CSS custom properties from your theme:

- `--color-base-100` - Main background
- `--color-base-200` - Secondary background (headers)
- `--color-base-300` - Borders
- `--color-base-content` - Text color
- `--color-primary` - Interactive elements
- `--radius-field` - Border radius

### Custom Styling

```svelte
<DataTableComponent
	data={users}
	columns={columns}
	class="shadow-lg rounded-lg"
/>
```

## TypeScript Support

The component is fully typed with generics:

```typescript
interface Product {
	id: string;
	name: string;
	price: number;
}

const columns: DataTableColumn<Product>[] = [
	/* ... */
];

// Type-safe!
<DataTableComponent<Product> data={products} columns={columns} />
```

## Examples

See the demo page at `src/routes/demo/data-table/+page.svelte` for comprehensive examples including:

- Basic table with sorting and filtering
- Custom cell rendering with components
- Progress bars and buttons
- Large datasets with pagination
- Mixed column configurations

## Limitations

- Client-side only (no server-side pagination/sorting)
- No row virtualization (yet)
- No column pinning
- No infinite scrolling
- No row selection (can be added via custom cell rendering)

## Future Enhancements

- Row virtualization with `svelte-virtual`
- Row selection with checkboxes
- Column visibility toggle
- Export to CSV/Excel
- Column reordering (drag & drop)
- Global search across all columns
