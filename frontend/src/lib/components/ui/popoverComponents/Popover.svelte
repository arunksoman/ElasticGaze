<script lang="ts">
	import { onMount } from 'svelte';
	import { clickOutside } from './clickOutside.js';
	import PopoverContent from './PopoverContent.svelte';
	import type { PopoverPlacement } from './types.js';

	interface Props {
		open?: boolean;
		placement?: PopoverPlacement;
		offset?: number;
		arrow?: boolean;
		closeOnOutsideClick?: boolean;
		closeOnEsc?: boolean;
		trapFocus?: boolean;
		returnFocus?: boolean;
		zIndex?: number;
		trigger?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		onopen?: () => void;
		onclose?: () => void;
		ontoggle?: () => void;
		onkeydown?: (event: KeyboardEvent) => void;
		onclickoutside?: (event: MouseEvent) => void;
	}

	let {
		open = $bindable(false),
		placement = 'bottom',
		offset = 6,
		arrow = false,
		closeOnOutsideClick = true,
		closeOnEsc = true,
		trapFocus = true,
		returnFocus = true,
		zIndex = 50,
		trigger,
		children,
		onopen,
		onclose,
		ontoggle,
		onkeydown,
		onclickoutside
	}: Props = $props();

	let triggerElement = $state<HTMLElement>();
	let contentElement = $state<HTMLElement>();
	let lastFocusedElement = $state<HTMLElement | null>(null);

	// Generate unique IDs for accessibility
	const triggerId = `popover-trigger-${Math.random().toString(36).substr(2, 9)}`;
	const contentId = `popover-content-${Math.random().toString(36).substr(2, 9)}`;

	function handleTriggerClick() {
		toggle();
	}

	function handleTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		}
		onkeydown?.(event);
	}

	function toggle() {
		open = !open;
		ontoggle?.();
		if (open) {
			onopen?.();
		} else {
			onclose?.();
		}
	}

	function openPopover() {
		if (!open) {
			open = true;
			onopen?.();
		}
	}

	function closePopover() {
		if (open) {
			open = false;
			onclose?.();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (closeOnOutsideClick && open) {
			closePopover();
			onclickoutside?.(event);
		}
	}

	function handleEscapeKey(event: KeyboardEvent) {
		if (event.key === 'Escape' && open && closeOnEsc) {
			event.preventDefault();
			closePopover();
			
			if (returnFocus && triggerElement) {
				triggerElement.focus();
			}
		}
	}

	function handleContentKeydown(event: KeyboardEvent) {
		if (event.key === 'Tab' && trapFocus) {
			const focusableElements = contentElement?.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			if (focusableElements && focusableElements.length > 0) {
				const firstElement = focusableElements[0] as HTMLElement;
				const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

				if (event.shiftKey) {
					if (document.activeElement === firstElement) {
						event.preventDefault();
						lastElement.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						event.preventDefault();
						firstElement.focus();
					}
				}
			} else {
				// No focusable elements inside, let tab move focus outside
				event.preventDefault();
				closePopover();
				if (returnFocus && triggerElement) {
					triggerElement.focus();
				}
			}
		}

		onkeydown?.(event);
	}

	// Focus management
	function manageFocus() {
		if (open && trapFocus && contentElement) {
			// Store currently focused element
			lastFocusedElement = document.activeElement as HTMLElement;

			// Focus first focusable element inside content
			const focusableElements = contentElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			if (focusableElements.length > 0) {
				(focusableElements[0] as HTMLElement).focus();
			} else {
				// Focus the content element itself
				contentElement.focus();
			}
		} else if (!open && returnFocus && lastFocusedElement) {
			// Return focus to trigger when closed
			if (triggerElement && document.contains(triggerElement)) {
				triggerElement.focus();
			}
			lastFocusedElement = null;
		}
	}

	$effect(() => {
		manageFocus();
	});

	// Add global event listeners
	onMount(() => {
		document.addEventListener('keydown', handleEscapeKey);
		
		return () => {
			document.removeEventListener('keydown', handleEscapeKey);
		};
	});
</script>


<div class="inline-block">
	<!-- Trigger -->
	<div
		bind:this={triggerElement}
		id={triggerId}
		role="button"
		tabindex="0"
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-controls={open ? contentId : undefined}
		onclick={handleTriggerClick}
		onkeydown={handleTriggerKeydown}
		use:clickOutside={{
			callback: handleClickOutside
		}}
	>
		{@render trigger?.()}
	</div>

	<!-- Content Portal -->
	{#if open}
		<div
			bind:this={contentElement}
			id={contentId}
			role="dialog"
			tabindex="-1"
			onkeydown={handleContentKeydown}
		>
			<PopoverContent
				triggerElement={triggerElement}
				{placement}
				{offset}
				{arrow}
				{zIndex}
				isOpen={open}
			>
				{@render children?.()}
			</PopoverContent>
		</div>
	{/if}
</div>