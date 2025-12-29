<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import { Close } from '@icon-park/svg';

	interface Props {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
		closable?: boolean;
		backdrop?: boolean;
		centered?: boolean;
		persistent?: boolean;
		zIndex?: number;
		animation?: 'fade' | 'scale' | 'slide' | 'none';
		role?: 'dialog' | 'alertdialog';
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
		onopen?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		size = 'md',
		closable = true,
		backdrop = true,
		centered = true,
		persistent = false,
		zIndex = 50,
		animation = 'scale',
		role = 'dialog',
		header,
		children,
		footer,
		onclose,
		onopen
	}: Props = $props();

	let modalRef: HTMLDivElement | null = $state(null);
	let previouslyFocusedElement: HTMLElement | null = null;
	let focusableElements: HTMLElement[] = $state([]);

	const sizeClasses = $derived({
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-3xl w-full',
		fullscreen: 'w-full h-full max-w-full max-h-full'
	}[size]);

	// Transition parameters based on animation type - more prominent animations
	const transitionParams = $derived({
		fade: { duration: 400, easing: (t: number) => t * t }, // Quadratic ease-in
		scale: { duration: 500, start: 0.7, opacity: 0 }, // Start much smaller
		slide: { duration: 500, y: -100, opacity: 0 }, // Slide from further up
		none: { duration: 0 }
	}[animation]);

	// Close modal
	function closeModal() {
		if (!closable || persistent) return;
		open = false;
		onclose?.();
	}

	// Handle backdrop click
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget && !persistent) {
			closeModal();
		}
	}

	// Handle ESC key globally
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && !persistent) {
			closeModal();
		}

		// Focus trap
		if (e.key === 'Tab' && modalRef) {
			trapFocus(e);
		}
	}

	// Trap focus within modal
	function trapFocus(e: KeyboardEvent) {
		if (!focusableElements.length) return;

		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];
		const activeElement = document.activeElement as HTMLElement;

		if (e.shiftKey) {
			// Shift + Tab
			if (activeElement === firstFocusable) {
				e.preventDefault();
				lastFocusable?.focus();
			}
		} else {
			// Tab
			if (activeElement === lastFocusable) {
				e.preventDefault();
				firstFocusable?.focus();
			}
		}
	}

	// Get all focusable elements
	function updateFocusableElements() {
		if (!modalRef) return;

		const selector = [
			'a[href]',
			'button:not([disabled])',
			'textarea:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'[tabindex]:not([tabindex="-1"])'
		].join(', ');

		focusableElements = Array.from(modalRef.querySelectorAll(selector));
	}

	// Lock body scroll
	function lockBodyScroll() {
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}
	}

	// Unlock body scroll
	function unlockBodyScroll() {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	}

	// Watch open state
	$effect(() => {
		if (open) {
			// Store previously focused element
			previouslyFocusedElement = document.activeElement as HTMLElement;

			// Lock scroll
			lockBodyScroll();

			// Add keyboard listener
			document.addEventListener('keydown', handleKeydown);

			// Update focusable elements and focus first one
			tick().then(() => {
				updateFocusableElements();
				// Focus first focusable element
				if (focusableElements.length > 0) {
					focusableElements[0]?.focus();
				}
			});

			// Trigger onopen callback
			onopen?.();
		} else {
			// Unlock scroll
			unlockBodyScroll();

			// Remove keyboard listener
			document.removeEventListener('keydown', handleKeydown);

			// Restore focus
			if (previouslyFocusedElement) {
				previouslyFocusedElement.focus();
				previouslyFocusedElement = null;
			}
		}
	});

	onDestroy(() => {
		unlockBodyScroll();
		document.removeEventListener('keydown', handleKeydown);
	});

	const closeIcon = Close({
		theme: 'outline',
		size: '20',
		fill: 'currentColor',
		strokeWidth: 3
	});

	// Get transition function based on animation type
	function getTransition(node: HTMLElement) {
		switch (animation) {
			case 'fade':
				return fade(node, transitionParams);
			case 'scale':
				return scale(node, transitionParams);
			case 'slide':
				return fly(node, transitionParams);
			case 'none':
				return { duration: 0, css: () => '' };
			default:
				return scale(node, transitionParams);
		}
	}
</script>

{#if open}
	<div
		class="modal-overlay fixed inset-0 flex"
		class:items-center={centered}
		class:items-start={!centered}
		class:justify-center={true}
		style:z-index={zIndex}
		role="presentation"
		tabindex="-1"
		onclick={handleBackdropClick}
		transition:fade={{ duration: 300 }}
	>
		<!-- Backdrop -->
		{#if backdrop}
			<div class="absolute inset-0 bg-(--color-base-300) opacity-60"></div>
		{/if}

		<!-- Modal container -->
		<div
			bind:this={modalRef}
			class="modal-container relative flex flex-col bg-(--color-base-100) text-(--color-base-content) border border-(--color-base-300) shadow-lg m-4 {sizeClasses}"
			style:border-radius="var(--radius-box)"
			{role}
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			transition:getTransition
		>
			<!-- Header slot or default header -->
			{#if header}
				<div class="modal-header flex items-center justify-between p-4 border-b border-(--color-base-300)">
					{@render header()}
					{#if closable}
						<button
							type="button"
							class="ml-auto p-1 hover:bg-(--color-base-200) transition-colors duration-150 rounded"
							onclick={closeModal}
							aria-label="Close modal"
						>
							{@html closeIcon}
						</button>
					{/if}
				</div>
			{:else if title}
				<div class="modal-header flex items-center justify-between p-4 border-b border-(--color-base-300)">
					<h2 id="modal-title" class="text-lg font-semibold text-(--color-base-content)">
						{title}
					</h2>
					{#if closable}
						<button
							type="button"
							class="ml-auto p-1 hover:bg-(--color-base-200) transition-colors duration-150 rounded"
							onclick={closeModal}
							aria-label="Close modal"
						>
							{@html closeIcon}
						</button>
					{/if}
				</div>
			{/if}

			<!-- Body -->
			<div class="modal-body flex-1 p-4 overflow-y-auto">
				{#if children}
					{@render children()}
				{/if}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="modal-footer p-4 border-t border-(--color-base-300)">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		backdrop-filter: blur(2px);
	}

	.modal-container {
		max-height: calc(100vh - 2rem);
	}

	.modal-body {
		scrollbar-width: thin;
		scrollbar-color: var(--color-base-300) transparent;
	}

	.modal-body::-webkit-scrollbar {
		width: 8px;
	}

	.modal-body::-webkit-scrollbar-track {
		background: transparent;
	}

	.modal-body::-webkit-scrollbar-thumb {
		background-color: var(--color-base-300);
		border-radius: 4px;
	}

	.modal-body::-webkit-scrollbar-thumb:hover {
		background-color: var(--color-primary);
	}
</style>
