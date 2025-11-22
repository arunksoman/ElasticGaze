<script lang="ts">
	import { onMount, tick } from 'svelte';
	import PopoverArrow from './PopoverArrow.svelte';
	import type { PopoverPlacement } from './types.js';

	interface Props {
		triggerElement: HTMLElement | null;
		placement?: PopoverPlacement;
		offset?: number;
		arrow?: boolean;
		zIndex?: number;
		isOpen?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		triggerElement,
		placement = 'bottom',
		offset = 6,
		arrow = false,
		zIndex = 50,
		isOpen = true,
		children
	}: Props = $props();

	let contentElement = $state<HTMLElement>();
	let position = $state({ x: -9999, y: -9999 }); // Start off-screen
	let initialized = $state(false);
	let visible = $state(false);

	// Calculate position based on trigger element and placement
	function calculatePosition() {
		if (!triggerElement || !contentElement) return;

		const triggerRect = triggerElement.getBoundingClientRect();
		
		// On first calculation, initialize position without animation
		if (!initialized) {
			initialized = true;
		}
		const contentRect = contentElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let x = 0;
		let y = 0;

		// Calculate base position
		switch (placement) {
			case 'top':
				x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
				y = triggerRect.top - contentRect.height - offset;
				break;
			case 'top-start':
				x = triggerRect.left;
				y = triggerRect.top - contentRect.height - offset;
				break;
			case 'top-end':
				x = triggerRect.right - contentRect.width;
				y = triggerRect.top - contentRect.height - offset;
				break;
			case 'bottom':
				x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
				y = triggerRect.bottom + offset;
				break;
			case 'bottom-start':
				x = triggerRect.left;
				y = triggerRect.bottom + offset;
				break;
			case 'bottom-end':
				x = triggerRect.right - contentRect.width;
				y = triggerRect.bottom + offset;
				break;
			case 'left':
				x = triggerRect.left - contentRect.width - offset;
				y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
				break;
			case 'left-start':
				x = triggerRect.left - contentRect.width - offset;
				y = triggerRect.top;
				break;
			case 'left-end':
				x = triggerRect.left - contentRect.width - offset;
				y = triggerRect.bottom - contentRect.height;
				break;
			case 'right':
				x = triggerRect.right + offset;
				y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
				break;
			case 'right-start':
				x = triggerRect.right + offset;
				y = triggerRect.top;
				break;
			case 'right-end':
				x = triggerRect.right + offset;
				y = triggerRect.bottom - contentRect.height;
				break;
		}

		// Adjust for viewport boundaries
		if (x < 0) {
			x = 8;
		} else if (x + contentRect.width > viewportWidth) {
			x = viewportWidth - contentRect.width - 8;
		}

		if (y < 0) {
			y = 8;
		} else if (y + contentRect.height > viewportHeight) {
			y = viewportHeight - contentRect.height - 8;
		}

		position = { x, y };
	}

	// Reset when popover closes
	$effect(() => {
		if (!isOpen) {
			initialized = false;
			visible = false;
			position = { x: -9999, y: -9999 };
		}
	});

	// Initialize position immediately when trigger is available
	$effect(() => {
		if (triggerElement && !initialized && isOpen) {
			// Set initial position at trigger location
			const triggerRect = triggerElement.getBoundingClientRect();
			position = { x: triggerRect.right + 8, y: triggerRect.bottom - 40 };
			initialized = true;
			// Make visible after a small delay to ensure position is set
			setTimeout(() => {
				visible = true;
				// Now calculate the proper position
				calculatePosition();
			}, 10);
		}
	});

	// Update position when placement or trigger changes
	$effect(() => {
		if (triggerElement) {
			calculatePosition();
		}
	});

	onMount(() => {
		// Recalculate position after mount
		tick().then(calculatePosition);

		// Recalculate on scroll and resize
		const handleReposition = () => calculatePosition();
		window.addEventListener('scroll', handleReposition, true);
		window.addEventListener('resize', handleReposition);

		return () => {
			window.removeEventListener('scroll', handleReposition, true);
			window.removeEventListener('resize', handleReposition);
		};
	});
</script>

<div
	bind:this={contentElement}
	class="absolute min-w-0 max-w-sm"
	style:left="{position.x}px"
	style:top="{position.y}px"
	style:z-index={zIndex}
	style:transition="{visible ? 'left 300ms ease-out, top 300ms ease-out, opacity 200ms ease-out' : 'none'}"
	style:opacity="{visible ? 1 : 0}"
	role="dialog"
	aria-modal="false"
	tabindex="-1"
>
	<div
		class="relative border border-solid p-4"
		style:background-color="var(--color-base-100)"
		style:color="var(--color-base-content)"
		style:border-color="var(--color-base-300)"
		style:border-width="var(--border)"
		style:border-radius="var(--radius-box)"
	>
		{#if arrow}
			<PopoverArrow {placement} />
		{/if}
		{@render children?.()}
	</div>
</div>