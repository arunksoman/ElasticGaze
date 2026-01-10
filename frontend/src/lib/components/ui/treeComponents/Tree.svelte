<script lang="ts">
	import TreeNode from './TreeNode.svelte';
	import { createTreeStore } from './treeStore';
	import type { TreeNodeItem, TreeIcons, TreeNodeEvent, TreeRenameEvent, TreeCreateEvent, TreeDropEvent } from './types';
	import { untrack } from 'svelte';

	interface TreeProps {
		nodes: TreeNodeItem[];
		multiSelect?: boolean;
		draggable?: boolean;
		collapsible?: boolean;
		customNodeClass?: string;
		customItemClass?: string;
		keyboardNavigation?: boolean;
		icons?: TreeIcons;
		onselect?: (event: TreeNodeEvent) => void;
		onexpand?: (event: TreeNodeEvent) => void;
		oncollapse?: (event: TreeNodeEvent) => void;
		onrename?: (event: TreeRenameEvent) => void;
		oncreate?: (event: TreeCreateEvent) => void;
		ondelete?: (event: TreeNodeEvent) => void;
		ondrop?: (event: TreeDropEvent) => void;
		onkeydown?: (event: KeyboardEvent) => void;
		onnodeschange?: (nodes: TreeNodeItem[]) => void;
		oncontextmenu?: (event: MouseEvent, nodeId: string) => void;
		empty?: import('svelte').Snippet;
	}

	let {
		nodes = [],
		multiSelect = false,
		draggable = true,
		collapsible = true,
		customNodeClass = '',
		customItemClass = '',
		keyboardNavigation = true,
		icons = {
			collapsed: 'FolderClose',
			expanded: 'FolderOpen'
		},
		onselect,
		onexpand,
		oncollapse,
		onrename,
		oncreate,
		ondelete,
		ondrop,
		onkeydown,
		onnodeschange,
		oncontextmenu,
		empty
	}: TreeProps = $props();

	const store = createTreeStore([]);
	let containerElement: HTMLDivElement;
	let lastEmittedNodes: TreeNodeItem[] | null = null;

	// Wrap store to intercept rename calls
	const wrappedStore = {
		...store,
		renameNode: (id: string, newName: string, callback?: (id: string, newName: string, oldName: string) => void) => {
			const node = store.findNode(id);
			const oldName = node?.name || '';
			store.renameNode(id, newName, (nodeId, name, old) => {
				onrename?.({ id: nodeId, name, oldName: old });
				callback?.(nodeId, name, old);
			});
		}
	};

	const storeState = $derived($store);
	const displayNodes = $derived(storeState.nodes);

	// Update store when nodes prop changes
	$effect(() => {
		if (JSON.stringify(nodes) !== JSON.stringify(storeState.nodes)) {
			store.setNodes(nodes);
		}
	});

	// Notify parent when nodes change internally (from store operations)
	$effect(() => {
		// Use untrack to avoid reading the nodes prop reactively
		untrack(() => {
			if (storeState.nodes !== nodes && storeState.nodes !== lastEmittedNodes) {
				lastEmittedNodes = storeState.nodes;
				onnodeschange?.(storeState.nodes);
			}
		});
	});

	// Watch for store changes and dispatch events
	$effect(() => {
		const state = $store;

		// Dispatch expand/collapse events
		state.expandedIds.forEach((id) => {
			const node = store.findNode(id);
			if (node) {
				// Only dispatch if this is a new expansion
				// (simple heuristic - in production you'd track previous state)
			}
		});
	});

	// Keyboard event handler
	function handleKeyDown(e: KeyboardEvent) {
		if (!keyboardNavigation) {
			onkeydown?.(e);
			return;
		}

		const state = $store;
		
		// Don't handle keyboard shortcuts when editing
		if (state.editingId) {
			return;
		}
		
		let handled = true;
		let newFocusId: string | null = null;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				if (e.shiftKey && multiSelect) {
					// Extend selection
					newFocusId = store.navigateNext();
					if (newFocusId && state.focusedId) {
						store.selectRange(state.focusedId, newFocusId);
					}
				} else {
					newFocusId = store.navigateNext();
					if (newFocusId) {
						if (!multiSelect) {
							store.clearSelection();
						}
						store.selectNode(newFocusId, false);
					}
				}
				break;

			case 'ArrowUp':
				e.preventDefault();
				if (e.shiftKey && multiSelect) {
					// Extend selection
					newFocusId = store.navigatePrevious();
					if (newFocusId && state.focusedId) {
						store.selectRange(state.focusedId, newFocusId);
					}
				} else {
					newFocusId = store.navigatePrevious();
					if (newFocusId) {
						if (!multiSelect) {
							store.clearSelection();
						}
						store.selectNode(newFocusId, false);
					}
				}
				break;

			case 'ArrowRight':
				e.preventDefault();
				if (state.focusedId) {
					const node = store.findNode(state.focusedId);
					if (node?.children && node.children.length > 0) {
						if (state.expandedIds.has(state.focusedId)) {
							// Already expanded, move to first child
							newFocusId = store.navigateToFirstChild();
							if (newFocusId) {
								if (!multiSelect) {
									store.clearSelection();
								}
								store.selectNode(newFocusId, false);
							}
						} else {
							// Expand the node
							store.expand(state.focusedId);
							onexpand?.({ node });
						}
					}
				}
				break;

			case 'ArrowLeft':
				e.preventDefault();
				if (state.focusedId) {
					const node = store.findNode(state.focusedId);
					if (node?.children && node.children.length > 0 && state.expandedIds.has(state.focusedId)) {
						// Collapse the node
						store.collapse(state.focusedId);
						oncollapse?.({ node });
					} else {
						// Move to parent
						newFocusId = store.navigateToParent();
						if (newFocusId) {
							if (!multiSelect) {
								store.clearSelection();
							}
							store.selectNode(newFocusId, false);
						}
					}
				}
				break;

			case 'Home':
				e.preventDefault();
				newFocusId = store.navigateFirst();
				if (newFocusId) {
					if (!multiSelect) {
						store.clearSelection();
					}
					store.selectNode(newFocusId, false);
				}
				break;

			case 'End':
				e.preventDefault();
				newFocusId = store.navigateLast();
				if (newFocusId) {
					if (!multiSelect) {
						store.clearSelection();
					}
					store.selectNode(newFocusId, false);
				}
				break;

			case 'Enter':
			case ' ':
				e.preventDefault();
				if (state.focusedId) {
					const node = store.findNode(state.focusedId);
					if (node) {
						if (e.key === 'Enter' && node.children && node.children.length > 0) {
							store.toggleExpand(state.focusedId);
							if (state.expandedIds.has(state.focusedId)) {
								onexpand?.({ node });
							} else {
								oncollapse?.({ node });
							}
						} else {
							store.selectNode(state.focusedId, e.ctrlKey || e.metaKey);
							onselect?.({ node });
						}
					}
				}
				break;

			case '*':
				e.preventDefault();
				// Expand all siblings at same depth
				store.expandAll();
				break;

			case 'F2':
				e.preventDefault();
				if (state.focusedId) {
					const node = store.findNode(state.focusedId);
					if (node?.editable !== false) {
						store.startEditing(state.focusedId);
					}
				}
				break;

			case 'a':
			case 'A':
				if (e.ctrlKey || e.metaKey) {
					e.preventDefault();
					if (state.selectedIds.size > 0) {
						store.clearSelection();
					} else {
						store.selectAll();
					}
				} else {
					// Type-ahead search
					handled = false;
					newFocusId = store.findByLetter(e.key);
					if (newFocusId) {
						if (!multiSelect) {
							store.clearSelection();
						}
						store.selectNode(newFocusId, false);
						handled = true;
					}
				}
				break;

			default:
				// Type-ahead for other letters
				if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
					newFocusId = store.findByLetter(e.key);
					if (newFocusId) {
						if (!multiSelect) {
							store.clearSelection();
						}
						store.selectNode(newFocusId, false);
					}
				} else {
					handled = false;
				}
		}

		if (handled) {
			onkeydown?.(e);
		}

		// Scroll focused element into view
		if (newFocusId) {
			setTimeout(() => {
				const focusedElement = containerElement?.querySelector(`[role="treeitem"][aria-level]`);
				if (focusedElement) {
					focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				}
			}, 0);
		}
	}

	// Focus container when mounted
	$effect(() => {
		if (containerElement && keyboardNavigation) {
			containerElement.focus();
		}
	});

	// Public API - expose store methods
	export function expandAll(depth?: number) {
		store.expandAll(depth);
	}

	export function collapseAll() {
		store.collapseAll();
	}

	export function collapseNode(id: string) {
		store.collapse(id);
	}

	export function selectNode(id: string, multi: boolean = false) {
		store.selectNode(id, multi);
	}

	export function clearSelection() {
		store.clearSelection();
	}

	export function renameNode(id: string, name: string) {
		store.renameNode(id, name, (nodeId, newName, oldName) => {
			onrename?.({ id: nodeId, name: newName, oldName });
		});
	}

	export function startEditing(id: string) {
		store.startEditing(id);
	}

	export function createNode(parentId: string | null, node: TreeNodeItem) {
		store.createNode(parentId, node);
		oncreate?.({ parentId, node });
	}

	export function deleteNode(id: string) {
		const node = store.findNode(id);
		if (node) {
			store.deleteNode(id);
			ondelete?.({ node });
		}
	}

	export function getSelectedNodes(): TreeNodeItem[] {
		const state = $store;
		const selected: TreeNodeItem[] = [];
		state.selectedIds.forEach((id) => {
			const node = store.findNode(id);
			if (node) selected.push(node);
		});
		return selected;
	}

	export function getExpandedNodes(): TreeNodeItem[] {
		const state = $store;
		const expanded: TreeNodeItem[] = [];
		state.expandedIds.forEach((id) => {
			const node = store.findNode(id);
			if (node) expanded.push(node);
		});
		return expanded;
	}
</script>

<div
	bind:this={containerElement}
	role="tree"
	aria-multiselectable={multiSelect}
	class="tree-container"
	tabindex="0"
	onkeydown={handleKeyDown}
>
	{#if displayNodes.length === 0}
		<div class="tree-empty">
			{#if empty}
				{@render empty()}
			{:else}
				<p>No items to display</p>
			{/if}
		</div>
	{:else}
		{#each displayNodes as node (node.id)}
			<TreeNode
				{node}
				depth={0}
				parentId={null}
				{customNodeClass}
				{customItemClass}
				{icons}
				{draggable}
				store={wrappedStore}
				{oncontextmenu}
				onselect={(event) => onselect?.(event)}
			/>
		{/each}
	{/if}
</div>

<style>
	.tree-container {
		outline: none;
		overflow: hidden;
		position: relative;
	}

	.tree-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		color: var(--color-base-content);
		opacity: 0.6;
	}

	.tree-empty p {
		margin: 0;
		font-style: italic;
	}
</style>
