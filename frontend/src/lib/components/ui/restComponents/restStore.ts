import { writable, derived } from 'svelte/store';
import type { models } from '$lib/wailsjs/go/models';

// Type definitions for REST page
export interface RestTab {
	id: string;
	requestId?: number; // ID from database if saved
	collectionId: number;
	folderId?: number;
	name: string;
	method: string;
	url: string;
	body?: string;
	description?: string;
	queryParams: QueryParam[];
	isDirty: boolean; // Has unsaved changes
}

export interface QueryParam {
	key: string;
	value: string;
	enabled: boolean;
}

export interface RestResponse {
	statusCode: number;
	duration: string;
	body: string;
	error?: string;
}

export interface RestState {
	secondarySidebarOpen: boolean;
	activeTabs: RestTab[];
	activeTabId: string | null;
	responses: Map<string, RestResponse>;
	collections: models.CollectionTreeNode[];
	defaultConfigId: number | null;
}

// Initial state
const initialState: RestState = {
	secondarySidebarOpen: true,
	activeTabs: [],
	activeTabId: null,
	responses: new Map(),
	collections: [],
	defaultConfigId: null
};

// Create store
function createRestStore() {
	const { subscribe, set, update } = writable<RestState>(initialState);

	return {
		subscribe,
		
		// Secondary sidebar actions
		toggleSecondarySidebar: () => {
			update(state => ({
				...state,
				secondarySidebarOpen: !state.secondarySidebarOpen
			}));
		},
		
		setSecondarySidebarOpen: (open: boolean) => {
			update(state => ({
				...state,
				secondarySidebarOpen: open
			}));
		},
		
		// Collections actions
		setCollections: (collections: models.CollectionTreeNode[]) => {
			update(state => ({
				...state,
				collections
			}));
		},
		
		setDefaultConfigId: (configId: number | null) => {
			update(state => ({
				...state,
				defaultConfigId: configId
			}));
		},
		
		// Tab actions
		createTab: (request?: Partial<RestTab>): string => {
			const tabId = `tab-${Date.now()}-${Math.random()}`;
			const newTab: RestTab = {
				id: tabId,
				requestId: request?.requestId,
				collectionId: request?.collectionId || 0,
				folderId: request?.folderId,
				name: request?.name || 'New Request',
				method: request?.method || 'GET',
				url: request?.url || '',
				body: request?.body,
				description: request?.description,
				queryParams: request?.queryParams || [],
				isDirty: false
			};
			
			update(state => ({
				...state,
				activeTabs: [...state.activeTabs, newTab],
				activeTabId: tabId
			}));
			
			return tabId;
		},
		
		openRequestTab: (request: models.Request): string => {
			// Check if tab already exists for this request
			let existingTabId: string | null = null;
			update(state => {
				const existingTab = state.activeTabs.find(tab => tab.requestId === request.id);
				if (existingTab) {
					existingTabId = existingTab.id;
					return {
						...state,
						activeTabId: existingTab.id
					};
				}
				return state;
			});
			
			if (existingTabId) {
				return existingTabId;
			}
			
			// Parse query params from URL
			const queryParams = parseQueryParams(request.url);
			
			// Create new tab
			const tabId = `tab-${Date.now()}-${Math.random()}`;
			const newTab: RestTab = {
				id: tabId,
				requestId: request.id,
				collectionId: request.collection_id,
				folderId: request.folder_id,
				name: request.name,
				method: request.method,
				url: request.url,
				body: request.body || undefined,
				description: request.description || undefined,
				queryParams,
				isDirty: false
			};
			
			update(state => ({
				...state,
				activeTabs: [...state.activeTabs, newTab],
				activeTabId: tabId
			}));
			
			return tabId;
		},
		
		closeTab: (tabId: string) => {
			update(state => {
				const tabs = state.activeTabs.filter(tab => tab.id !== tabId);
				let newActiveTabId = state.activeTabId;
				
				// If closing active tab, switch to another
				if (state.activeTabId === tabId) {
					const closingIndex = state.activeTabs.findIndex(tab => tab.id === tabId);
					if (tabs.length > 0) {
						// Try to select next tab, or previous if last
						const newIndex = closingIndex >= tabs.length ? tabs.length - 1 : closingIndex;
						newActiveTabId = tabs[newIndex]?.id || null;
					} else {
						newActiveTabId = null;
					}
				}
				
				// Remove response for this tab
				const newResponses = new Map(state.responses);
				newResponses.delete(tabId);
				
				return {
					...state,
					activeTabs: tabs,
					activeTabId: newActiveTabId,
					responses: newResponses
				};
			});
		},
		
		setActiveTab: (tabId: string) => {
			update(state => ({
				...state,
				activeTabId: tabId
			}));
		},
		
		updateTab: (tabId: string, updates: Partial<RestTab>) => {
			update(state => ({
				...state,
				activeTabs: state.activeTabs.map(tab =>
					tab.id === tabId
						? { ...tab, ...updates, isDirty: true }
						: tab
				)
			}));
		},
		
		markTabClean: (tabId: string) => {
			update(state => ({
				...state,
				activeTabs: state.activeTabs.map(tab =>
					tab.id === tabId
						? { ...tab, isDirty: false }
						: tab
				)
			}));
		},
		
		updateTabQueryParams: (tabId: string, queryParams: QueryParam[]) => {
			update(state => ({
				...state,
				activeTabs: state.activeTabs.map(tab =>
					tab.id === tabId
						? { ...tab, queryParams, isDirty: true }
						: tab
				)
			}));
		},
		
		// Response actions
		setResponse: (tabId: string, response: RestResponse) => {
			update(state => {
				const newResponses = new Map(state.responses);
				newResponses.set(tabId, response);
				return {
					...state,
					responses: newResponses
				};
			});
		},
		
		clearResponse: (tabId: string) => {
			update(state => {
				const newResponses = new Map(state.responses);
				newResponses.delete(tabId);
				return {
					...state,
					responses: newResponses
				};
			});
		},
		
		reset: () => set(initialState)
	};
}

// Helper functions
function parseQueryParams(url: string): QueryParam[] {
	try {
		const urlObj = new URL(url.startsWith('http') ? url : `http://dummy${url}`);
		const params: QueryParam[] = [];
		urlObj.searchParams.forEach((value, key) => {
			params.push({ key, value, enabled: true });
		});
		return params;
	} catch {
		return [];
	}
}

// HTTP method colors
export const methodColors: Record<string, string> = {
	GET: 'text-green-500',
	POST: 'text-yellow-500',
	PUT: 'text-blue-500',
	DELETE: 'text-red-500',
	PATCH: 'text-purple-500',
	HEAD: 'text-gray-500',
	OPTIONS: 'text-gray-500'
};

export const methodBgColors: Record<string, string> = {
	GET: 'bg-green-500',
	POST: 'bg-yellow-500',
	PUT: 'bg-blue-500',
	DELETE: 'bg-red-500',
	PATCH: 'bg-purple-500',
	HEAD: 'bg-gray-500',
	OPTIONS: 'bg-gray-500'
};

// Export singleton instance
export const restStore = createRestStore();

// Derived stores
export const activeTab = derived(restStore, $store => 
	$store.activeTabs.find(tab => tab.id === $store.activeTabId)
);

export const activeResponse = derived(restStore, $store =>
	$store.activeTabId ? $store.responses.get($store.activeTabId) : undefined
);
