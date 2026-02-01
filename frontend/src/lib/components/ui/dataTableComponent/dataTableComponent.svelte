<script lang="ts" generics="T extends Record<string, any>">
	/**
	 * DataTableComponent - High-performance data table with TanStack Table Core
	 * Rewritten based on appgoblin reference implementation
	 */

	import {
		getCoreRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		type SortingState,
		type ColumnFiltersState,
		type PaginationState,
		type ColumnSizingState
	} from '@tanstack/table-core';
	import { Filter } from '@icon-park/svg';
	import type { DataTableProps } from './dataTableComponent.types';
	import { convertToTableColumn } from './dataTableComponent.utils';
	import { createSvelteTable } from './dataTableComponent.adapter.svelte';

	// Props
	let {
		data = [],
		columns = [],
		pagination: paginationConfig,
		class: className = ''
	}: DataTableProps<T> = $props();

	// State
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnSizing = $state<ColumnSizingState>({});
	let pagination = $state<PaginationState>({
		pageIndex: 0,
		pageSize: paginationConfig?.pageSize || 10
	});

	// Filter state
	let activeFilterColumn = $state<string | null>(null);
	let filterInputs = $state<Record<string, string>>({});

	// Convert columns
	const tableColumns = columns.map(convertToTableColumn);

	// Create table instance
	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns: tableColumns,
		state: {
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnSizing() {
				return columnSizing;
			},
			get pagination() {
				return pagination;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnSizingChange: (updater) => {
			if (typeof updater === 'function') {
				columnSizing = updater(columnSizing);
			} else {
				columnSizing = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		columnResizeMode: 'onChange',
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	});

	// Helper functions
	function handleSort(columnId: string) {
		const column = table.getColumn(columnId);
		if (column && column.getCanSort()) {
			column.toggleSorting();
		}
	}

	function toggleFilter(columnId: string) {
		activeFilterColumn = activeFilterColumn === columnId ? null : columnId;
	}

	function handleFilterInput(columnId: string, value: string) {
		filterInputs[columnId] = value;
		const column = table.getColumn(columnId);
		if (column) {
			column.setFilterValue(value);
		}
	}

	// Pagination config
	const showPageSizeSelector = paginationConfig?.showPageSizeSelector !== false;
	const showPaginationInfo = paginationConfig?.showPaginationInfo !== false;
	const pageSizeOptions = paginationConfig?.pageSizeOptions || [10, 25, 50, 100];
</script>

<div class="w-full {className}">
	<!-- Table -->
	<div class="overflow-x-auto relative">
		<table
			class="w-full border-collapse"
			style="background-color: var(--color-base-100); min-width: max-content;"
		>
			<!-- Header -->
			<thead style="background-color: var(--color-base-200);">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							{@const column = header.column}
							{@const columnDef = columns.find((c) => c.id === header.id)}
							{@const canSort = columnDef?.enable_sort !== false}
							{@const canFilter = columnDef?.enable_filter === true}
							{@const canResize = columnDef?.is_resizable === true}
							{@const isSorted = column.getIsSorted()}
							
							<th
								class="px-4 py-3 text-left font-semibold border-b border-r relative"
								style="color: var(--color-base-content); border-color: var(--color-base-300); width: {header.getSize()}px;"
							>
								<div class="flex items-center gap-2">
									<!-- Header content -->
									{#if canSort}
										{@const headerContent = typeof column.columnDef.header === 'function' 
											? column.columnDef.header(header.getContext())
											: column.columnDef.header}
										<button
											type="button"
											onclick={() => handleSort(header.id)}
											class="flex-1 text-left hover:opacity-70"
											style="background: none; border: none; color: inherit; font: inherit; cursor: pointer; padding: 0;"
										>
											{@html headerContent}
										</button>
									{:else}
										{@const headerContent = typeof column.columnDef.header === 'function' 
											? column.columnDef.header(header.getContext())
											: column.columnDef.header}
										<span class="flex-1">
											{@html headerContent}
										</span>
									{/if}

									<!-- Sort indicator -->
									{#if canSort && isSorted}
										<span class="text-xs">
											{isSorted === 'asc' ? '↑' : '↓'}
										</span>
									{/if}

									<!-- Filter button -->
									{#if canFilter}
										<button
											type="button"
											onclick={() => toggleFilter(header.id)}
											class="p-1 hover:opacity-70"
											style="color: var(--color-primary);"
											aria-label="Toggle filter"
										>
											{@html Filter({ theme: 'outline', size: '16', strokeWidth: 3 })}
										</button>
									{/if}
								</div>

								<!-- Filter input -->
								{#if canFilter && activeFilterColumn === header.id}
									<div class="absolute top-full left-0 right-0 z-10 mt-1 p-2" style="background-color: var(--color-base-100); border: 1px solid var(--color-base-300); border-radius: var(--radius-field);">
										<input
											type="text"
											placeholder="Filter..."
											value={filterInputs[header.id] || ''}
											oninput={(e) => handleFilterInput(header.id, e.currentTarget.value)}
											class="w-full px-2 py-1"
											style="background-color: var(--color-base-100); color: var(--color-base-content); border: 1px solid var(--color-base-300); border-radius: var(--radius-field);"
										/>
									</div>
								{/if}

								<!-- Resize handle -->
								{#if canResize}
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-opacity-100"
										style="background-color: var(--color-primary); opacity: 0; transition: opacity 0.2s;"
										onmousedown={(e) => {
											e.preventDefault();
											header.getResizeHandler()(e);
										}}
										ontouchstart={(e) => {
											header.getResizeHandler()(e);
										}}
										onmouseenter={(e) => {
											e.currentTarget.style.opacity = '0.5';
										}}
										onmouseleave={(e) => {
											e.currentTarget.style.opacity = '0';
										}}
									></div>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>

			<!-- Body -->
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr class="border-b hover:bg-opacity-50" style="border-color: var(--color-base-300);">
						{#each row.getVisibleCells() as cell (cell.id)}
							{@const cellValue = cell.column.columnDef.cell 
								? typeof cell.column.columnDef.cell === 'function'
									? cell.column.columnDef.cell(cell.getContext())
									: cell.column.columnDef.cell
								: cell.getValue()}
							
							<td class="px-4 py-3 border-r" style="color: var(--color-base-content); border-color: var(--color-base-300); width: {cell.column.getSize()}px;">
								{#if typeof cellValue === 'string' && cellValue.includes('<')}
									{@html cellValue}
								{:else}
									{cellValue}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if paginationConfig}
		<div class="flex items-center justify-between px-4 py-3 border-t" style="border-color: var(--color-base-300);">
			<!-- Pagination info -->
			{#if showPaginationInfo}
				<div class="text-sm" style="color: var(--color-base-content);">
					Showing {pagination.pageIndex * pagination.pageSize + 1} to {Math.min(
						(pagination.pageIndex + 1) * pagination.pageSize,
						data.length
					)} of {data.length} rows
				</div>
			{/if}

			<div class="flex items-center gap-2">
				<!-- Page size selector -->
				{#if showPageSizeSelector}
					<select
						value={pagination.pageSize}
						onchange={(e) => {
							pagination = {
								pageIndex: 0,
								pageSize: Number(e.currentTarget.value)
							};
						}}
						class="px-2 py-1"
						style="background-color: var(--color-base-100); color: var(--color-base-content); border: 1px solid var(--color-base-300); border-radius: var(--radius-field);"
					>
						{#each pageSizeOptions as size}
							<option value={size}>{size} rows</option>
						{/each}
					</select>
				{/if}

				<!-- Navigation buttons -->
				<div class="flex gap-1">
					<button
						type="button"
						onclick={() => (pagination = { ...pagination, pageIndex: 0 })}
						disabled={!table.getCanPreviousPage()}
						class="px-3 py-1 disabled:opacity-50"
						style="background-color: var(--color-base-200); color: var(--color-base-content); border: 1px solid var(--color-base-300); border-radius: var(--radius-field); cursor: pointer;"
					>
						First
					</button>
					<button
						type="button"
						onclick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						class="px-3 py-1 disabled:opacity-50"
						style="background-color: var(--color-base-200); color: var(--color-base-content); border: 1px solid var(--color-base-300); border-radius: var(--radius-field); cursor: pointer;"
					>
						Prev
					</button>
					<span class="px-3 py-1" style="color: var(--color-base-content);">
						{pagination.pageIndex + 1} of {table.getPageCount()}
					</span>
					<button
						type="button"
						onclick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						class="px-3 py-1 disabled:opacity-50"
						style="background-color: var(--color-base-200); color: var(--color-base-content); border: 1px solid var(--color-base-300); border-radius: var(--radius-field); cursor: pointer;"
					>
						Next
					</button>
					<button
						type="button"
						onclick={() => (pagination = { ...pagination, pageIndex: table.getPageCount() - 1 })}
						disabled={!table.getCanNextPage()}
						class="px-3 py-1 disabled:opacity-50"
						style="background-color: var(--color-base-200); color: var(--color-base-content); border: 1px solid var(--color-base-300); border-radius: var(--radius-field); cursor: pointer;"
					>
						Last
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
