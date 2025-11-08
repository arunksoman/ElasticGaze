import { writable, get } from 'svelte/store';

export interface TabItem {
	id: string;
	title: string;
	edited?: boolean;
	createdAt: number;
	// Reserved for future extensions:
	// method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// params?: Record<string, unknown>;
	// body?: string;
}

interface TabsState {
	tabs: TabItem[];
	activeTabId: string | null;
}

function createTabsStore() {
	const { subscribe, set, update } = writable<TabsState>({
		tabs: [],
		activeTabId: null
	});

	let tabCounter = 0;

	return {
		subscribe,
		set,
		update,

		/**
		 * Add a new tab with optional custom properties
		 */
		addTab: (opts?: Partial<TabItem>): TabItem => {
			const newTab: TabItem = {
				id: opts?.id || `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				title: opts?.title || `Request ${++tabCounter}`,
				edited: opts?.edited ?? false,
				createdAt: opts?.createdAt || Date.now(),
				...opts
			};

			update((state) => {
				const tabs = [...state.tabs, newTab];
				return {
					tabs,
					activeTabId: newTab.id // Activate newly added tab
				};
			});

			return newTab;
		},

		/**
		 * Close/remove a tab by ID
		 */
		closeTab: (id: string): void => {
			update((state) => {
				const tabIndex = state.tabs.findIndex((t) => t.id === id);
				if (tabIndex === -1) return state;

				const newTabs = state.tabs.filter((t) => t.id !== id);
				let newActiveTabId = state.activeTabId;

				// If closing the active tab, activate adjacent tab
				if (state.activeTabId === id) {
					if (newTabs.length > 0) {
						// Activate the tab at the same index, or the previous one if at the end
						const nextIndex = Math.min(tabIndex, newTabs.length - 1);
						newActiveTabId = newTabs[nextIndex]?.id || null;
					} else {
						newActiveTabId = null;
					}
				}

				return {
					tabs: newTabs,
					activeTabId: newActiveTabId
				};
			});
		},

		/**
		 * Activate a tab by ID
		 */
		activateTab: (id: string): void => {
			update((state) => {
				const tab = state.tabs.find((t) => t.id === id);
				if (!tab) return state;

				return {
					...state,
					activeTabId: id
				};
			});
		},

		/**
		 * Set the edited flag for a tab
		 */
		setEdited: (id: string, edited: boolean): void => {
			update((state) => ({
				...state,
				tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, edited } : tab))
			}));
		},

		/**
		 * Get all tabs
		 */
		getTabs: (): TabItem[] => {
			return get({ subscribe }).tabs;
		},

		/**
		 * Get active tab ID
		 */
		getActiveTabId: (): string | null => {
			return get({ subscribe }).activeTabId;
		},

		/**
		 * Reset the store
		 */
		reset: (): void => {
			tabCounter = 0;
			set({
				tabs: [],
				activeTabId: null
			});
		}
	};
}

export const tabsStore = createTabsStore();
