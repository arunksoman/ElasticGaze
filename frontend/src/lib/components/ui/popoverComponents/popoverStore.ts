import { writable } from 'svelte/store';
import type { PopoverPosition, PopoverPlacement } from './types.js';

export function createPopoverStore() {
	const open = writable(false);
	const position = writable<PopoverPosition>({ x: 0, y: 0, placement: 'bottom' });

	function toggle() {
		open.update((state) => !state);
	}

	function openPopover() {
		open.set(true);
	}

	function closePopover() {
		open.set(false);
	}

	function setPosition(newPosition: { x: number; y: number; placement?: PopoverPlacement }) {
		position.update((current) => ({
			...current,
			...newPosition,
			placement: newPosition.placement || current.placement
		}));
	}

	return {
		open,
		position,
		toggle,
		openPopover,
		closePopover,
		setPosition
	};
}

export type PopoverStore = ReturnType<typeof createPopoverStore>;