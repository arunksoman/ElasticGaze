export { default as DataTableComponent } from './dataTableComponent.svelte';
export type {
	DataTableColumn,
	DataTableProps,
	PaginationOptions,
	ColumnFilterState,
	CellContext
} from './dataTableComponent.types';
export {
	convertToTableColumn,
	getDefaultPageSizes,
	formatPaginationInfo,
	debounce,
	shouldVirtualize,
	getSortIcon
} from './dataTableComponent.utils';
