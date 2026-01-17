import type { ColumnDef, SortDirection } from '@tanstack/table-core';

/**
 * Column definition for the data table
 * Extends TanStack Table's ColumnDef with custom properties
 */
export interface DataTableColumn<T> {
	/** Unique identifier for the column */
	id: string;

	/** Header text displayed in the column header */
	header: string;

	/** Key to access the data in the row object */
	accessorKey?: keyof T;

	/** Enable column resizing (default: true) */
	is_resizable?: boolean;

	/** Enable column sorting (default: true) */
	enable_sort?: boolean;

	/** Enable column filtering (default: false) */
	enable_filter?: boolean;

	/** Custom cell renderer function - can return any value including Svelte components */
	cell?: (row: T) => any;

	/** Minimum width for the column in pixels */
	minWidth?: number;

	/** Maximum width for the column in pixels */
	maxWidth?: number;

	/** Initial width for the column in pixels */
	width?: number;
}

/**
 * Pagination configuration options
 */
export interface PaginationOptions {
	/** Number of rows per page (default: 10) */
	pageSize?: number;

	/** Available page size options for the user to select */
	pageSizeOptions?: number[];

	/** Show page size selector (default: true) */
	showPageSizeSelector?: boolean;

	/** Show pagination info text (default: true) */
	showPaginationInfo?: boolean;
}

/**
 * Props for the DataTable component
 */
export interface DataTableProps<T> {
	/** Array of data to display in the table */
	data: T[];

	/** Array of column definitions */
	columns: DataTableColumn<T>[];

	/** Pagination configuration */
	pagination?: PaginationOptions;

	/** Enable row virtualization for large datasets (default: false) */
	virtualized?: boolean;

	/** Custom CSS class for the table container */
	class?: string;

	/** Unique key for each row (for optimization) */
	rowKey?: keyof T;
}

/**
 * Internal column filter state
 */
export interface ColumnFilterState {
	columnId: string;
	value: string;
}

/**
 * Cell rendering context
 */
export interface CellContext<T> {
	row: T;
	value: any;
	columnId: string;
}
