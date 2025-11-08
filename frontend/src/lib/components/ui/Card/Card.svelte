<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'default' | 'outlined' | 'ghost';
	type Padding = 'none' | 'sm' | 'md' | 'lg';
	type Accent = 'none' | 'left' | 'top';

	interface Props {
		variant?: Variant;
		elevation?: number;
		clickable?: boolean;
		rounded?: boolean;
		padding?: Padding;
		border?: boolean;
		accent?: Accent;
		href?: string | null;
		onclick?: (event: MouseEvent | KeyboardEvent) => void;
		class?: string;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
		media?: Snippet;
		actions?: Snippet;
		[key: string]: any; // Allow slot props
	}

	let {
		variant = 'default',
		elevation = 0,
		clickable = false,
		rounded = false,
		padding = 'md',
		border = false,
		accent = 'none',
		href = null,
		onclick,
		class: className = '',
		children,
		header,
		footer,
		media,
		actions,
		...restProps
	}: Props = $props();

	let isInteractive = $derived(clickable || href !== null);
	let component = $derived(href ? 'a' : 'div');

	let paddingClasses = $derived.by(() => {
		const paddingMap: Record<Padding, string> = {
			none: '',
			sm: 'p-3',
			md: 'p-4',
			lg: 'p-6'
		};
		return paddingMap[padding];
	});

	let elevationShadow = $derived.by(() => {
		const shadows = [
			'none',
			'0 1px 2px rgba(0, 0, 0, 0.05)',
			'0 2px 4px rgba(0, 0, 0, 0.08)',
			'0 4px 8px rgba(0, 0, 0, 0.12)',
			'0 8px 16px rgba(0, 0, 0, 0.15)',
			'0 12px 24px rgba(0, 0, 0, 0.18)'
		];
		const level = Math.min(Math.max(elevation, 0), 5);
		return shadows[level];
	});

	let variantStyles = $derived.by(() => {
		const styles: Record<Variant, string> = {
			default: `
				background-color: var(--color-base-100);
				color: var(--color-base-content);
			`,
			outlined: `
				background-color: transparent;
				color: var(--color-base-content);
				border: var(--border) solid var(--color-base-300);
			`,
			ghost: `
				background-color: transparent;
				color: var(--color-base-content);
			`
		};
		return styles[variant];
	});

	let borderStyle = $derived(
		border && variant !== 'outlined'
			? `border: var(--border) solid var(--color-base-300);`
			: ''
	);

	let borderRadius = $derived(
		rounded ? 'var(--radius-selector)' : 'var(--radius-box)'
	);

	function handleClick(event: MouseEvent | KeyboardEvent) {
		if (onclick) {
			onclick(event);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (isInteractive && !href && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			handleClick(event);
		}
	}
</script>

<svelte:element
	this={component}
	class="card relative overflow-hidden transition-all duration-200 {paddingClasses} {className}"
	class:card-clickable={isInteractive}
	style="
		{variantStyles}
		{borderStyle}
		border-radius: {borderRadius};
		box-shadow: {elevationShadow};
	"
	role={isInteractive && !href ? 'button' : undefined}
	tabindex={isInteractive && !href ? 0 : undefined}
	{...(href ? { href } : {})}
	onclick={isInteractive ? handleClick : undefined}
	onkeydown={isInteractive ? handleKeydown : undefined}
>
	<!-- Accent Strip -->
	{#if accent === 'left'}
		<div
			class="card-accent-left absolute left-0 top-0 bottom-0"
			style="
				width: 3px;
				background-color: var(--color-accent);
			"
		></div>
	{/if}
	
	{#if accent === 'top'}
		<div
			class="card-accent-top absolute top-0 left-0 right-0"
			style="
				height: 4px;
				background-color: var(--color-accent);
			"
		></div>
	{/if}

	<div class="card-content flex flex-col h-full" class:pt-1={accent === 'top'} class:pl-2={accent === 'left'}>
		<!-- Media Slot -->
		{#if media}
			<div class="card-media mb-4">
				{@render media()}
			</div>
		{/if}

		<!-- Header Slot -->
		{#if header}
			<header class="card-header mb-3">
				{@render header()}
			</header>
		{/if}

		<!-- Default Content Slot -->
		{#if children}
			<div class="card-body flex-1">
				{@render children()}
			</div>
		{/if}

		<!-- Actions Slot -->
		{#if actions}
			<div class="card-actions mt-4 flex items-center justify-end gap-2">
				{@render actions()}
			</div>
		{/if}

		<!-- Footer Slot -->
		{#if footer}
			<footer class="card-footer mt-4 pt-3" style="border-top: var(--border) solid var(--color-base-300);">
				{@render footer()}
			</footer>
		{/if}
	</div>
</svelte:element>

<style>
	.card {
		display: block;
		text-decoration: none;
	}

	.card-clickable {
		cursor: pointer;
	}

	.card-clickable:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
	}

	.card-clickable:active {
		transform: translateY(0);
	}

	.card-clickable:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	/* Ensure header uses semantic styling */
	.card-header :global(h1),
	.card-header :global(h2),
	.card-header :global(h3),
	.card-header :global(h4),
	.card-header :global(h5),
	.card-header :global(h6) {
		margin: 0;
		color: var(--color-base-content);
	}

	.card-footer {
		font-size: 0.875rem;
		color: var(--color-base-content);
		opacity: 0.8;
	}
</style>
