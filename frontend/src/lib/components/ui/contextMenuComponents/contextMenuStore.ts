import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface ContextMenuItemData {
	id: string;
	label: string;
	icon?: string;
	shortcut?: string;
	disabled?: boolean;
	divider?: boolean;
	group?: string;
	action?: () => void;
}

interface ContextMenuState {
	open: boolean;
	activeId: string | null;
	items: ContextMenuItemData[];
	searchBuffer: string;
	position: { x: number; y: number };
}

const initialState: ContextMenuState = {
	open: false,
	activeId: null,
	items: [],
	searchBuffer: '',
	position: { x: 0, y: 0 }
};

function createContextMenuStore() {
	const { subscribe, set, update }: Writable<ContextMenuState> = writable(initialState);
	let searchTimeout: NodeJS.Timeout;

	return {
		subscribe,

		registerItems: (items: ContextMenuItemData[]) => {
			const filteredItems = items.filter(item => !item.divider);
			update(state => {
				// Only update if items actually changed
				if (JSON.stringify(state.items) !== JSON.stringify(filteredItems)) {
					return { ...state, items: filteredItems };
				}
				return state;
			});
		},

		openMenu: (position: { x: number; y: number }) => {
			update(state => ({ 
				...state, 
				open: true, 
				position,
				activeId: state.items.find(item => !item.disabled)?.id || null
			}));
		},

		closeMenu: () => {
			update(state => ({
				...initialState,
				items: state.items // Keep items to avoid re-registration
			}));
		},

		focusNext: () => {
			update(state => {
				const enabledItems = state.items.filter(item => !item.disabled);
				if (enabledItems.length === 0) return state;

				const currentIndex = enabledItems.findIndex(item => item.id === state.activeId);
				const nextIndex = (currentIndex + 1) % enabledItems.length;
				return { ...state, activeId: enabledItems[nextIndex].id };
			});
		},

		focusPrev: () => {
			update(state => {
				const enabledItems = state.items.filter(item => !item.disabled);
				if (enabledItems.length === 0) return state;

				const currentIndex = enabledItems.findIndex(item => item.id === state.activeId);
				const prevIndex = currentIndex <= 0 ? enabledItems.length - 1 : currentIndex - 1;
				return { ...state, activeId: enabledItems[prevIndex].id };
			});
		},

		focusFirst: () => {
			update(state => {
				const firstEnabled = state.items.find(item => !item.disabled);
				return { ...state, activeId: firstEnabled?.id || null };
			});
		},

		focusLast: () => {
			update(state => {
				const enabledItems = state.items.filter(item => !item.disabled);
				const lastEnabled = enabledItems[enabledItems.length - 1];
				return { ...state, activeId: lastEnabled?.id || null };
			});
		},

		focusByTypeahead: (key: string) => {
			clearTimeout(searchTimeout);
			
			update(state => {
				const newBuffer = state.searchBuffer + key.toLowerCase();
				const enabledItems = state.items.filter(item => !item.disabled);
				
				// Find next matching item starting from current position
				const currentIndex = enabledItems.findIndex(item => item.id === state.activeId);
				const searchFrom = currentIndex + 1;
				
				let matchingItem = enabledItems.slice(searchFrom).find(item => 
					item.label.toLowerCase().startsWith(newBuffer)
				);
				
				// If no match found after current, search from beginning
				if (!matchingItem) {
					matchingItem = enabledItems.find(item => 
						item.label.toLowerCase().startsWith(newBuffer)
					);
				}
				
				return {
					...state,
					searchBuffer: newBuffer,
					activeId: matchingItem ? matchingItem.id : state.activeId
				};
			});

			// Reset buffer after delay
			searchTimeout = setTimeout(() => {
				update(state => ({ ...state, searchBuffer: '' }));
			}, 700);
		},

		resetSearchBuffer: () => {
			clearTimeout(searchTimeout);
			update(state => ({ ...state, searchBuffer: '' }));
		},

		selectActive: () => {
			const state = get({ subscribe });
			const activeItem = state.items.find(item => item.id === state.activeId);
			return activeItem;
		},

		setActiveId: (id: string | null) => {
			update(state => ({ ...state, activeId: id }));
		}
	};
}

export const contextMenuStore = createContextMenuStore();
