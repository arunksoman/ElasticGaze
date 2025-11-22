export type PopoverPlacement =
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end';

export interface PopoverPosition {
	x: number;
	y: number;
	placement: PopoverPlacement;
}

export interface PopoverEvents {
	open: void;
	close: void;
	toggle: void;
	keydown: KeyboardEvent;
	clickoutside: MouseEvent;
}