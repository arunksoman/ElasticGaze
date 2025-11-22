<script lang="ts">
	import type { PopoverPlacement } from './types.js';

	interface Props {
		placement: PopoverPlacement;
		size?: number;
		color?: string;
	}

	let { placement, size = 8, color = 'var(--color-base-100)' }: Props = $props();

	// Calculate arrow styles based on placement
	const arrowStyles = $derived(() => {
		const halfSize = size / 2;
		const borderWidth = `${size}px`;

		switch (placement) {
			case 'top':
			case 'top-start':
			case 'top-end':
				return {
					top: '100%',
					borderLeft: `${borderWidth} solid transparent`,
					borderRight: `${borderWidth} solid transparent`,
					borderTop: `${borderWidth} solid ${color}`,
					borderBottom: 'none'
				};
			case 'bottom':
			case 'bottom-start':
			case 'bottom-end':
				return {
					bottom: '100%',
					borderLeft: `${borderWidth} solid transparent`,
					borderRight: `${borderWidth} solid transparent`,
					borderBottom: `${borderWidth} solid ${color}`,
					borderTop: 'none'
				};
			case 'left':
			case 'left-start':
			case 'left-end':
				return {
					left: '100%',
					borderTop: `${borderWidth} solid transparent`,
					borderBottom: `${borderWidth} solid transparent`,
					borderLeft: `${borderWidth} solid ${color}`,
					borderRight: 'none'
				};
			case 'right':
			case 'right-start':
			case 'right-end':
				return {
					right: '100%',
					borderTop: `${borderWidth} solid transparent`,
					borderBottom: `${borderWidth} solid transparent`,
					borderRight: `${borderWidth} solid ${color}`,
					borderLeft: 'none'
				};
			default:
				return {};
		}
	});

	// Calculate arrow position based on placement
	const arrowPosition = $derived(() => {
		const halfSize = size / 2;

		if (placement.includes('start')) {
			if (placement.startsWith('top') || placement.startsWith('bottom')) {
				return { left: `${size * 2}px` };
			} else {
				return { top: `${size * 2}px` };
			}
		} else if (placement.includes('end')) {
			if (placement.startsWith('top') || placement.startsWith('bottom')) {
				return { right: `${size * 2}px` };
			} else {
				return { bottom: `${size * 2}px` };
			}
		} else {
			// Center alignment
			if (placement.startsWith('top') || placement.startsWith('bottom')) {
				return { left: '50%', transform: 'translateX(-50%)' };
			} else {
				return { top: '50%', transform: 'translateY(-50%)' };
			}
		}
	});
</script>

<div
	class="absolute"
	style:width="0"
	style:height="0"
	style={Object.entries({ ...arrowStyles, ...arrowPosition })
		.map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
		.join('; ')}
></div>