import type { DataTableColumn } from './dataTableComponent.types';
import type { ColumnDef, AccessorFn } from '@tanstack/table-core';

/**
 * Convert custom column definition to TanStack Table column definition
 */
export function convertToTableColumn<T>(column: DataTableColumn<T>): ColumnDef<T, any> {
	const colDef: ColumnDef<T, any> = {
		id: column.id,
		header: column.header,
		enableSorting: column.enable_sort !== false,
		minSize: column.minWidth || 50,
		maxSize: column.maxWidth || 500,
		size: column.width || 150
	};

	// Set accessor - if no accessorKey, provide a dummy accessor function
	if (column.accessorKey) {
		(colDef as any).accessorKey = column.accessorKey as string;
	} else {
		// Provide a dummy accessor for columns without accessorKey (e.g., action columns)
		(colDef as any).accessorFn = () => null;
	}

	// Set cell renderer
	if (column.cell) {
		(colDef as any).cell = (context: any) => {
			return column.cell!(context.row.original);
		};
	}

	return colDef;
}

/**
 * Calculate optimal page sizes based on dataset size
 */
export function getDefaultPageSizes(dataLength: number): number[] {
	const sizes = [10, 25, 50, 100];

	// Only show sizes that make sense for the dataset
	return sizes.filter((size) => size <= dataLength || size === sizes[0]);
}

/**
 * Format pagination info text
 */
export function formatPaginationInfo(
	pageIndex: number,
	pageSize: number,
	totalRows: number
): string {
	const start = pageIndex * pageSize + 1;
	const end = Math.min((pageIndex + 1) * pageSize, totalRows);

	if (totalRows === 0) {
		return 'No rows';
	}

	return `Showing ${start} to ${end} of ${totalRows} rows`;
}

/**
 * Debounce function for filter input
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait);
	};
}

/**
 * Check if virtualization should be enabled based on data size
 */
export function shouldVirtualize(dataLength: number, explicitSetting?: boolean): boolean {
	// If explicitly set, use that value
	if (explicitSetting !== undefined) {
		return explicitSetting;
	}

	// Auto-enable virtualization for large datasets
	return dataLength > 100;
}

/**
 * Get sort direction icon name
 */
export function getSortIcon(isSorted: false | 'asc' | 'desc'): string | null {
	if (isSorted === 'asc') return 'Up';
	if (isSorted === 'desc') return 'Down';
	return null;
}

export function createDefaultColumn<T>(): Partial<ColumnDef<T, any>> {
    return {
        minSize: 50,
        maxSize: 500,
        size: 150,
        enableResizing: false
    };
}
