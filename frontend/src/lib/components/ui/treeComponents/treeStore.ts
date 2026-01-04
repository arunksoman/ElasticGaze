/**
 * Tree Store - State Management for Tree Component
 * ElasticGaze - Themeable Tree Component System
 */

import { writable, derived, get } from 'svelte/store';
import type { TreeNodeItem, TreeState, FlatTreeNode, DragState } from './types';

/**
 * Create a tree store for managing tree state
 */
export function createTreeStore(initialNodes: TreeNodeItem[] = []) {
	const initialState: TreeState = {
		nodes: initialNodes,
		expandedIds: new Set<string>(),
		selectedIds: new Set<string>(),
		focusedId: null,
		dragState: {
			isDragging: false,
			sourceId: null,
			targetId: null
		},
		editingId: null
	};

	const { subscribe, set, update } = writable<TreeState>(initialState);

	/**
	 * Find a node by ID recursively
	 */
	function findNode(nodes: TreeNodeItem[], id: string): TreeNodeItem | null {
		for (const node of nodes) {
			if (node.id === id) return node;
			if (node.children) {
				const found = findNode(node.children, id);
				if (found) return found;
			}
		}
		return null;
	}

	/**
	 * Find parent node of a given node ID
	 */
	function findParentNode(
		nodes: TreeNodeItem[],
		targetId: string,
		parent: TreeNodeItem | null = null
	): TreeNodeItem | null {
		for (const node of nodes) {
			if (node.id === targetId) return parent;
			if (node.children) {
				const found = findParentNode(node.children, targetId, node);
				if (found !== null) return found;
			}
		}
		return null;
	}

	/**
	 * Remove a node from the tree
	 */
	function removeNode(nodes: TreeNodeItem[], id: string): TreeNodeItem[] {
		return nodes.filter((node) => {
			if (node.id === id) return false;
			if (node.children) {
				node.children = removeNode(node.children, id);
			}
			return true;
		});
	}

	/**
	 * Get all descendant IDs of a node
	 */
	function getDescendantIds(node: TreeNodeItem): string[] {
		const ids: string[] = [node.id];
		if (node.children) {
			node.children.forEach((child) => {
				ids.push(...getDescendantIds(child));
			});
		}
		return ids;
	}

	/**
	 * Flatten the tree structure for keyboard navigation
	 */
	function flattenTree(
		nodes: TreeNodeItem[],
		expandedIds: Set<string>,
		depth: number = 0,
		parentId: string | null = null
	): FlatTreeNode[] {
		const result: FlatTreeNode[] = [];
		nodes.forEach((node, index) => {
			const isExpanded = expandedIds.has(node.id);
			result.push({
				node,
				depth,
				parentId,
				index,
				visible: true
			});

			if (isExpanded && node.children && node.children.length > 0) {
				result.push(...flattenTree(node.children, expandedIds, depth + 1, node.id));
			}
		});
		return result;
	}

	/**
	 * Toggle node expansion
	 */
	function toggleExpand(id: string) {
		update((state) => {
			const node = findNode(state.nodes, id);
			if (!node || !node.children || node.children.length === 0) return state;

			const expandedIds = new Set(state.expandedIds);
			if (expandedIds.has(id)) {
				expandedIds.delete(id);
			} else {
				expandedIds.add(id);
			}
			return { ...state, expandedIds };
		});
	}

	/**
	 * Set nodes (for external updates)
	 */
	function setNodes(newNodes: TreeNodeItem[]) {
		update((state) => ({
			...state,
			nodes: newNodes
		}));
	}

	/**
	 * Expand a node
	 */
	function expand(id: string) {
		update((state) => {
			const node = findNode(state.nodes, id);
			if (!node || !node.children || node.children.length === 0) return state;

			const expandedIds = new Set(state.expandedIds);
			expandedIds.add(id);
			return { ...state, expandedIds };
		});
	}

	/**
	 * Collapse a node
	 */
	function collapse(id: string) {
		update((state) => {
			const expandedIds = new Set(state.expandedIds);
			expandedIds.delete(id);
			return { ...state, expandedIds };
		});
	}

	/**
	 * Expand all nodes
	 */
	function expandAll(maxDepth?: number) {
		update((state) => {
			const expandedIds = new Set<string>();
			function traverse(nodes: TreeNodeItem[], depth: number = 0) {
				nodes.forEach((node) => {
					if (node.children && node.children.length > 0) {
						if (maxDepth === undefined || depth < maxDepth) {
							expandedIds.add(node.id);
							traverse(node.children, depth + 1);
						}
					}
				});
			}
			traverse(state.nodes);
			return { ...state, expandedIds };
		});
	}

	/**
	 * Collapse all nodes
	 */
	function collapseAll() {
		update((state) => ({
			...state,
			expandedIds: new Set<string>()
		}));
	}

	/**
	 * Select a node
	 */
	function selectNode(id: string, multi: boolean = false) {
		update((state) => {
			const selectedIds = multi ? new Set(state.selectedIds) : new Set<string>();
			if (selectedIds.has(id)) {
				selectedIds.delete(id);
			} else {
				selectedIds.add(id);
			}
			return { ...state, selectedIds, focusedId: id };
		});
	}

	/**
	 * Select multiple nodes
	 */
	function selectRange(startId: string, endId: string) {
		update((state) => {
			const flatNodes = flattenTree(state.nodes, state.expandedIds);
			const startIndex = flatNodes.findIndex((n) => n.node.id === startId);
			const endIndex = flatNodes.findIndex((n) => n.node.id === endId);

			if (startIndex === -1 || endIndex === -1) return state;

			const [start, end] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
			const selectedIds = new Set(state.selectedIds);

			for (let i = start; i <= end; i++) {
				selectedIds.add(flatNodes[i].node.id);
			}

			return { ...state, selectedIds };
		});
	}

	/**
	 * Select all nodes
	 */
	function selectAll() {
		update((state) => {
			const selectedIds = new Set<string>();
			function traverse(nodes: TreeNodeItem[]) {
				nodes.forEach((node) => {
					selectedIds.add(node.id);
					if (node.children) traverse(node.children);
				});
			}
			traverse(state.nodes);
			return { ...state, selectedIds };
		});
	}

	/**
	 * Clear all selections
	 */
	function clearSelection() {
		update((state) => ({
			...state,
			selectedIds: new Set<string>()
		}));
	}

	/**
	 * Set focused node
	 */
	function setFocus(id: string | null) {
		update((state) => ({
			...state,
			focusedId: id
		}));
	}

	/**
	 * Start editing a node
	 */
	function startEditing(id: string) {
		update((state) => ({
			...state,
			editingId: id
		}));
	}

	/**
	 * Stop editing
	 */
	function stopEditing() {
		update((state) => ({
			...state,
			editingId: null
		}));
	}

	/**
	 * Rename a node
	 */
	function renameNode(id: string, newName: string, onrename?: (id: string, newName: string, oldName: string) => void) {
		update((state) => {
			const nodes = JSON.parse(JSON.stringify(state.nodes));
			const node = findNode(nodes, id);
			if (node) {
				const oldName = node.name;
				node.name = newName;
				onrename?.(id, newName, oldName);
			}
			return { ...state, nodes, editingId: null };
		});
	}

	/**
	 * Create a new node
	 */
	function createNode(parentId: string | null, newNode: TreeNodeItem) {
		update((state) => {
			const nodes = JSON.parse(JSON.stringify(state.nodes));

			if (parentId === null) {
				nodes.push(newNode);
			} else {
				const parent = findNode(nodes, parentId);
				if (parent) {
					if (!parent.children) {
						parent.children = [];
					}
					parent.children.push(newNode);

					// Auto-expand parent
					const expandedIds = new Set(state.expandedIds);
					expandedIds.add(parentId);
					return { ...state, nodes, expandedIds };
				}
			}

			return { ...state, nodes };
		});
	}

	/**
	 * Delete a node
	 */
	function deleteNode(id: string) {
		update((state) => {
			const node = findNode(state.nodes, id);
			if (!node) return state;

			// Get all descendant IDs to remove from selected and expanded sets
			const descendantIds = getDescendantIds(node);
			const expandedIds = new Set(state.expandedIds);
			const selectedIds = new Set(state.selectedIds);

			descendantIds.forEach((descId) => {
				expandedIds.delete(descId);
				selectedIds.delete(descId);
			});

			// Clone nodes before removing to avoid mutation
			const nodesCopy = JSON.parse(JSON.stringify(state.nodes));
			const nodes = removeNode(nodesCopy, id);

			return {
				...state,
				nodes,
				expandedIds,
				selectedIds,
				focusedId: state.focusedId === id ? null : state.focusedId
			};
		});
	}

	/**
	 * Move a node (for drag and drop)
	 */
	function moveNode(sourceId: string, targetId: string) {
		update((state) => {
			if (sourceId === targetId) return state;

			// First, get a copy of the source node before removing it
			const sourceNode = findNode(state.nodes, sourceId);
			let targetNode = findNode(state.nodes, targetId);

			if (!sourceNode || !targetNode) return state;

			// Prevent moving a parent into its own descendant
			const descendantIds = getDescendantIds(sourceNode);
			if (descendantIds.includes(targetId)) return state;

			// If target is a leaf node (no children property), use its parent instead
			let actualTargetId: string | null = targetId;
			if (targetNode.children === undefined) {
				const parentNode = findParentNode(state.nodes, targetId);
				if (parentNode) {
					actualTargetId = parentNode.id;
					targetNode = parentNode;
				} else {
					// Target is a root-level leaf, add as sibling at root level
					actualTargetId = null;
				}
			}

			// Create a deep copy of the source node
			const sourceNodeCopy = JSON.parse(JSON.stringify(sourceNode));

			// Remove source from its current location
			const nodes = JSON.parse(JSON.stringify(state.nodes));
			const cleanedNodes = removeNode(nodes, sourceId);

			// Add to target location
			if (actualTargetId === null) {
				// Add as root-level node
				cleanedNodes.push(sourceNodeCopy);
				return { ...state, nodes: cleanedNodes };
			} else {
				// Add to target's children
				const target = findNode(cleanedNodes, actualTargetId);
				if (target) {
					if (!target.children) {
						target.children = [];
					}
					target.children.push(sourceNodeCopy);

					// Auto-expand target
					const expandedIds = new Set(state.expandedIds);
					expandedIds.add(actualTargetId);

					return { ...state, nodes: cleanedNodes, expandedIds };
				}
			}

			return state;
		});
	}

	/**
	 * Start dragging
	 */
	function startDrag(sourceId: string) {
		update((state) => ({
			...state,
			dragState: {
				isDragging: true,
				sourceId,
				targetId: null
			}
		}));
	}

	/**
	 * Set drag target
	 */
	function setDragTarget(targetId: string | null) {
		update((state) => ({
			...state,
			dragState: {
				...state.dragState,
				targetId
			}
		}));
	}

	/**
	 * End dragging
	 */
	function endDrag() {
		update((state) => ({
			...state,
			dragState: {
				isDragging: false,
				sourceId: null,
				targetId: null
			}
		}));
	}

	/**
	 * Get visible nodes (flattened for keyboard navigation)
	 */
	const visibleNodes = derived({ subscribe }, ($state) => {
		return flattenTree($state.nodes, $state.expandedIds);
	});

	/**
	 * Navigate to next visible node
	 */
	function navigateNext(): string | null {
		const state = get({ subscribe });
		const flatNodes = flattenTree(state.nodes, state.expandedIds);

		if (flatNodes.length === 0) return null;

		if (!state.focusedId) {
			return flatNodes[0].node.id;
		}

		const currentIndex = flatNodes.findIndex((n) => n.node.id === state.focusedId);
		if (currentIndex === -1 || currentIndex >= flatNodes.length - 1) {
			return state.focusedId;
		}

		return flatNodes[currentIndex + 1].node.id;
	}

	/**
	 * Navigate to previous visible node
	 */
	function navigatePrevious(): string | null {
		const state = get({ subscribe });
		const flatNodes = flattenTree(state.nodes, state.expandedIds);

		if (flatNodes.length === 0) return null;

		if (!state.focusedId) {
			return flatNodes[0].node.id;
		}

		const currentIndex = flatNodes.findIndex((n) => n.node.id === state.focusedId);
		if (currentIndex <= 0) {
			return state.focusedId;
		}

		return flatNodes[currentIndex - 1].node.id;
	}

	/**
	 * Navigate to first visible node
	 */
	function navigateFirst(): string | null {
		const state = get({ subscribe });
		const flatNodes = flattenTree(state.nodes, state.expandedIds);
		return flatNodes.length > 0 ? flatNodes[0].node.id : null;
	}

	/**
	 * Navigate to last visible node
	 */
	function navigateLast(): string | null {
		const state = get({ subscribe });
		const flatNodes = flattenTree(state.nodes, state.expandedIds);
		return flatNodes.length > 0 ? flatNodes[flatNodes.length - 1].node.id : null;
	}

	/**
	 * Navigate to parent node
	 */
	function navigateToParent(): string | null {
		const state = get({ subscribe });
		if (!state.focusedId) return null;

		const parent = findParentNode(state.nodes, state.focusedId);
		return parent ? parent.id : null;
	}

	/**
	 * Navigate to first child
	 */
	function navigateToFirstChild(): string | null {
		const state = get({ subscribe });
		if (!state.focusedId) return null;

		const node = findNode(state.nodes, state.focusedId);
		if (!node || !node.children || node.children.length === 0) return null;

		if (!state.expandedIds.has(state.focusedId)) {
			return null;
		}

		return node.children[0].id;
	}

	/**
	 * Find node by starting letter
	 */
	function findByLetter(letter: string): string | null {
		const state = get({ subscribe });
		const flatNodes = flattenTree(state.nodes, state.expandedIds);

		if (flatNodes.length === 0) return null;

		const currentIndex = state.focusedId
			? flatNodes.findIndex((n) => n.node.id === state.focusedId)
			: -1;

		// Search from current position to end
		for (let i = currentIndex + 1; i < flatNodes.length; i++) {
			if (flatNodes[i].node.name.toLowerCase().startsWith(letter.toLowerCase())) {
				return flatNodes[i].node.id;
			}
		}

		// Wrap around: search from beginning to current position
		for (let i = 0; i <= currentIndex; i++) {
			if (flatNodes[i].node.name.toLowerCase().startsWith(letter.toLowerCase())) {
				return flatNodes[i].node.id;
			}
		}

		return null;
	}

	return {
		subscribe,
		set,
		update,
		visibleNodes,

		// Expansion
		toggleExpand,
		expand,
		collapse,
		expandAll,
		collapseAll,

		// Selection
		selectNode,
		selectRange,
		selectAll,
		clearSelection,
		setFocus,

		// Editing
		startEditing,
		stopEditing,

		// CRUD
		renameNode,
		createNode,
		deleteNode,
		moveNode,

		// Drag & Drop
		startDrag,
		setDragTarget,
		endDrag,

		// Navigation
		navigateNext,
		navigatePrevious,
		navigateFirst,
		navigateLast,
		navigateToParent,
		navigateToFirstChild,
		findByLetter,

		// Utilities
		findNode: (id: string) => findNode(get({ subscribe }).nodes, id),
		getVisibleNodes: () => flattenTree(get({ subscribe }).nodes, get({ subscribe }).expandedIds),
		setNodes
	};
}

export type TreeStore = ReturnType<typeof createTreeStore>;
