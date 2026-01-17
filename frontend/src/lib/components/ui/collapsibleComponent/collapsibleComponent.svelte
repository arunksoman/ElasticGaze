<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { CollapsibleProps } from './collapsibleComponent.types';
	import { getTransitionClasses, generateId, isControlled } from './collapsibleComponent.utils';

	interface Props extends CollapsibleProps {
		trigger?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		open = $bindable(),
		defaultOpen = false,
		onOpenChange,
		animationDuration = 'normal',
		noAnimation = false,
		accordion = false,
		accordionKey,
		triggerClass = '',
		contentClass = '',
		disabled = false,
		trigger,
		children,
		class: className = ''
	}: Props = $props();

	// Internal state for uncontrolled mode
	let internalOpen = $state(defaultOpen);
	
	// Computed open state - controlled or uncontrolled
	let isOpen = $derived(isControlled(open) ? (open ?? false) : internalOpen);

	// Generate unique IDs for accessibility
	const triggerId = generateId('collapsible-trigger');
	const contentId = generateId('collapsible-content');

	// References
	let contentRef: HTMLDivElement | null = $state(null);
	let contentInnerRef: HTMLDivElement | null = $state(null);

	// Animation state
	let isAnimating = $state(false);
	let maxSize = $state<number | null>(null);

	// Transition classes
	const transitionClasses = $derived(
		noAnimation ? '' : getTransitionClasses(animationDuration)
	);

	/**
	 * Toggle the collapsible state
	 */
	function toggle() {
		if (disabled) return;

		const newState = !isOpen;

		if (isControlled(open)) {
			// In controlled mode, just call the callback
			onOpenChange?.(newState);
		} else {
			// In uncontrolled mode, update internal state
			internalOpen = newState;
			onOpenChange?.(newState);
		}
	}

	/**
	 * Handle trigger click
	 */
	function handleTriggerClick(event: MouseEvent) {
		event.preventDefault();
		toggle();
	}

	/**
	 * Handle keyboard interaction
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		}
	}

	/**
	 * Measure the content size for smooth animations
	 */
	async function measureContent() {
		if (!contentInnerRef || noAnimation) return;

		await tick();
		maxSize = contentInnerRef.scrollHeight;
	}

	/**
	 * Handle animation state
	 */
	async function handleAnimation() {
		if (noAnimation) return;

		isAnimating = true;

		// Measure before animating
		await measureContent();

		// Wait for animation to complete
		const duration = animationDuration === 'fast' ? 150 : animationDuration === 'slow' ? 500 : 300;
		setTimeout(() => {
			isAnimating = false;
		}, duration);
	}

	// Watch for open state changes to trigger animations
	$effect(() => {
		if (isOpen) {
			handleAnimation();
		}
	});

	// Measure content on mount and when it changes
	onMount(() => {
		measureContent();
	});

	// Re-measure when content changes
	$effect(() => {
		if (contentInnerRef) {
			measureContent();
		}
	});

	// Computed styles for the content wrapper
	let contentStyles = $derived.by(() => {
		const styles: string[] = [];

		if (isOpen) {
			styles.push(`max-height: ${maxSize || 9999}px`);
			styles.push('opacity: 1');
		} else {
			styles.push('max-height: 0');
			styles.push('opacity: 0');
		}

		return styles.join('; ');
	});
</script>

<!-- Trigger -->
<div
	class="collapsible-trigger {triggerClass}"
	role="button"
	aria-expanded={isOpen}
	aria-controls={contentId}
	aria-disabled={disabled}
	id={triggerId}
	tabindex={disabled ? -1 : 0}
	onclick={handleTriggerClick}
	onkeydown={handleKeydown}
	style="
		cursor: {disabled ? 'not-allowed' : 'pointer'};
		opacity: {disabled ? '0.5' : '1'};
	"
>
	{#if trigger}
		{@render trigger()}
	{/if}
</div>

<!-- Content -->
<div
	bind:this={contentRef}
	class="collapsible-content overflow-hidden {transitionClasses} {contentClass}"
	id={contentId}
	aria-labelledby={triggerId}
	aria-hidden={!isOpen}
	role="region"
	style="{contentStyles}"
>
	<div bind:this={contentInnerRef} class="collapsible-content-inner">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.collapsible-trigger:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-radius: var(--radius-selector);
	}

	.collapsible-content {
		will-change: max-height, opacity;
	}
</style>
