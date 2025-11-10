/**
 * Tree Component Type Definitions
 * ElasticGaze - Themeable Tree Component System
 */

export interface TreeNodeItem {
	id: string;
	name: string;
	children?: TreeNodeItem[];
	expanded?: boolean;
	selected?: boolean;
	iconCollapsed?: string; // IconPark name or SVG string
	iconExpanded?: string;
	editable?: boolean;
}

export interface TreeIcons {
	collapsed: string;
	expanded: string;
}

export interface TreeNodeEvent {
	node: TreeNodeItem;
	event?: Event;
}

export interface TreeRenameEvent {
	id: string;
	name: string;
	oldName?: string;
}

export interface TreeCreateEvent {
	parentId: string | null;
	node: TreeNodeItem;
}

export interface TreeDropEvent {
	sourceId: string;
	targetId: string;
}

export interface FlatTreeNode {
	node: TreeNodeItem;
	depth: number;
	parentId: string | null;
	index: number;
	visible: boolean;
}

export interface DragState {
	isDragging: boolean;
	sourceId: string | null;
	targetId: string | null;
}

export interface TreeState {
	nodes: TreeNodeItem[];
	expandedIds: Set<string>;
	selectedIds: Set<string>;
	focusedId: string | null;
	dragState: DragState;
	editingId: string | null;
}
