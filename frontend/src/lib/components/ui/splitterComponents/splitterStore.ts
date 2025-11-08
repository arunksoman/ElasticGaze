import { writable, get } from 'svelte/store';
import type { PaneSize, SplitterState } from './types';

/**
 * Splitter Store for programmatic control
 * Provides methods to manipulate splitter state externally
 */

interface SplitterStoreData {
	[key: string]: SplitterState;
}

function createSplitterStore() {
	const { subscribe, update } = writable<SplitterStoreData>({});

	return {
		subscribe,

		/**
		 * Register a splitter instance
		 */
		register(id: string, state: SplitterState) {
			update((stores) => ({
				...stores,
				[id]: state
			}));
		},

		/**
		 * Unregister a splitter instance
		 */
		unregister(id: string) {
			update((stores) => {
				const { [id]: _, ...rest } = stores;
				return rest;
			});
		},

		/**
		 * Update pane sizes for a specific splitter
		 */
		updateSizes(id: string, paneSizes: PaneSize[]) {
			update((stores) => {
				if (!stores[id]) return stores;
				return {
					...stores,
					[id]: {
						...stores[id],
						paneSizes
					}
				};
			});
		},

		/**
		 * Get current sizes for a splitter
		 */
		getSizes(id: string): number[] {
			const stores = get({ subscribe });
			if (!stores[id]) return [];
			return stores[id].paneSizes.map((p) => p.size);
		},

		/**
		 * Set sizes programmatically
		 */
		setSizes(id: string, sizes: number[]) {
			update((stores) => {
				if (!stores[id]) return stores;
				const paneSizes = stores[id].paneSizes.map((pane, i) => ({
					...pane,
					size: sizes[i] ?? pane.size
				}));
				return {
					...stores,
					[id]: {
						...stores[id],
						paneSizes
					}
				};
			});
		},

		/**
		 * Collapse a specific pane
		 */
		collapsePane(id: string, paneId: string) {
			update((stores) => {
				if (!stores[id]) return stores;
				const paneSizes = stores[id].paneSizes.map((pane) =>
					pane.id === paneId ? { ...pane, collapsed: true } : pane
				);
				return {
					...stores,
					[id]: {
						...stores[id],
						paneSizes
					}
				};
			});
		},

		/**
		 * Expand a specific pane
		 */
		expandPane(id: string, paneId: string) {
			update((stores) => {
				if (!stores[id]) return stores;
				const paneSizes = stores[id].paneSizes.map((pane) =>
					pane.id === paneId ? { ...pane, collapsed: false } : pane
				);
				return {
					...stores,
					[id]: {
						...stores[id],
						paneSizes
					}
				};
			});
		},

		/**
		 * Toggle collapse state of a pane
		 */
		toggleCollapse(id: string, paneId: string) {
			update((stores) => {
				if (!stores[id]) return stores;
				const paneSizes = stores[id].paneSizes.map((pane) =>
					pane.id === paneId ? { ...pane, collapsed: !pane.collapsed } : pane
				);
				return {
					...stores,
					[id]: {
						...stores[id],
						paneSizes
					}
				};
			});
		}
	};
}

export const splitterStore = createSplitterStore();
