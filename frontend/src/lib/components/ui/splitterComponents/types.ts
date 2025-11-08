/**
 * Shared TypeScript types for the Splitter component system
 */

export type SplitterDirection = 'horizontal' | 'vertical';

export interface PaneSize {
	id: string;
	size: number; // in pixels
	collapsed: boolean;
}

export interface PaneConstraints {
	id: string;
	minSize?: number;
	maxSize?: number;
	collapsible?: boolean;
	collapsed?: boolean;
}

export interface SplitterState {
	direction: SplitterDirection;
	paneSizes: PaneSize[];
	totalSize: number;
}

export interface ResizeEvent {
	sizes: number[];
	paneSizes: PaneSize[];
}

export interface CollapseChangeEvent {
	id: string;
	collapsed: boolean;
}

export interface DragState {
	isDragging: boolean;
	handleIndex: number;
	startPosition: number;
	startSizes: number[];
}

export interface SplitterProps {
	direction?: SplitterDirection;
	gutterSize?: number | string;
	collapsible?: boolean;
	snapThreshold?: number;
	keyboardStep?: number;
	minSize?: number | number[];
	maxSize?: number | number[];
	initialSizes?: number[];
	storageKey?: string | null;
}

export interface SplitterPaneProps {
	id: string;
	minSize?: number;
	maxSize?: number;
	initialSize?: number | string;
	collapsible?: boolean;
	collapsed?: boolean;
	resizable?: boolean;
	order?: number;
}

export interface SplitterHandleProps {
	index: number;
	direction: SplitterDirection;
	size?: number;
	collapsible?: boolean;
	ariaLabel?: string;
}
