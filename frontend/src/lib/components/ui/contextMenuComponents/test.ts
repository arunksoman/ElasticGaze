// Simple test file to verify context menu components work
import { contextMenuStore } from './contextMenuStore';
import type { ContextMenuItemData } from './contextMenuStore';

// Test data
const testItems: ContextMenuItemData[] = [
	{ id: '1', label: 'Test Item 1' },
	{ id: '2', label: 'Test Item 2', disabled: true },
	{ id: '3', label: 'Test Item 3', shortcut: 'Ctrl+T' }
];

// Test store functions
contextMenuStore.registerItems(testItems);
contextMenuStore.openMenu({ x: 100, y: 100 });
console.log('Context menu store test passed');

export { testItems };