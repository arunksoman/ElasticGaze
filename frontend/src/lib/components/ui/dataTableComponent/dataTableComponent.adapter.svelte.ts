import type { TableOptions, TableOptionsResolved, TableState, RowData } from '@tanstack/table-core';
import { createTable } from '@tanstack/table-core';

/**
 * Creates a reactive TanStack table for Svelte 5
 * Based on appgoblin implementation
 */
export function createSvelteTable<TData extends RowData>(options: TableOptions<TData>) {
	const resolvedOptions: TableOptionsResolved<TData> = {
		state: {},
		onStateChange: () => {},
		renderFallbackValue: null,
		mergeOptions: (
			defaultOptions: TableOptions<TData>,
			options: Partial<TableOptions<TData>>
		) => {
			return mergeObjects(defaultOptions, options);
		},
		...options
	} as TableOptionsResolved<TData>;

	const table = createTable(resolvedOptions);
	let state = $state<Partial<TableState>>(table.initialState);

	function updateOptions() {
		table.setOptions((prev) => {
			return mergeObjects(prev, options, {
				state: mergeObjects(state, options.state || {}),
				onStateChange: (updater: any) => {
					if (updater instanceof Function) {
						state = updater(state);
					} else {
						state = mergeObjects(state, updater);
					}
					options.onStateChange?.(updater);
				}
			});
		});
	}

	updateOptions();

	$effect.pre(() => {
		updateOptions();
	});

	return table;
}

// Helper function to merge objects
function mergeObjects(...sources: any): any {
	const target = {};
	for (let i = 0; i < sources.length; i++) {
		let source = sources[i];
		if (typeof source === 'function') source = source();
		if (source) {
			const descriptors = Object.getOwnPropertyDescriptors(source);
			for (const key in descriptors) {
				if (key in target) continue;
				Object.defineProperty(target, key, {
					enumerable: true,
					get() {
						for (let i = sources.length - 1; i >= 0; i--) {
							let s = sources[i];
							if (typeof s === 'function') s = s();
							const v = (s || {})[key];
							if (v !== undefined) return v;
						}
					}
				});
			}
		}
	}
	return target;
}
