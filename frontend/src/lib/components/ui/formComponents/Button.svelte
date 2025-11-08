<script lang="ts">
	import { Loading } from '@icon-park/svg';
	import * as IconPark from '@icon-park/svg';

	type Variant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		loading?: boolean;
		icon?: string | null;
		iconPosition?: 'left' | 'right';
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children?: import('svelte').Snippet;
		'icon-left'?: import('svelte').Snippet;
		'icon-right'?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		icon = null,
		iconPosition = 'left',
		type = 'button',
		class: className = '',
		onclick,
		children,
		'icon-left': iconLeft,
		'icon-right': iconRight,
		...restProps
	}: Props = $props();

	let buttonClass = $derived.by(() => {
		const baseClass = 'btn inline-flex items-center justify-center gap-2 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-1';
		
		const sizeClasses = {
			sm: 'px-3 py-1.5 text-sm',
			md: 'px-4 py-2 text-base',
			lg: 'px-6 py-3 text-lg'
		};

		return `${baseClass} ${sizeClasses[size]} ${className}`;
	});

	let variantStyles = $derived.by(() => {
		const styles: Record<Variant, string> = {
			primary: `
				background-color: var(--color-primary);
				color: var(--color-primary-content);
				border: var(--border) solid var(--color-primary);
			`,
			secondary: `
				background-color: var(--color-secondary);
				color: var(--color-secondary-content);
				border: var(--border) solid var(--color-secondary);
			`,
			accent: `
				background-color: var(--color-accent);
				color: var(--color-accent-content);
				border: var(--border) solid var(--color-accent);
			`,
			outline: `
				background-color: transparent;
				color: var(--color-base-content);
				border: var(--border) solid var(--color-base-300);
			`,
			ghost: `
				background-color: transparent;
				color: var(--color-base-content);
				border: var(--border) solid transparent;
			`
		};
		return styles[variant];
	});

	let iconSize = $derived.by(() => {
		const sizes = { sm: '14', md: '16', lg: '18' };
		return sizes[size];
	});

	function getIconHtml(iconName: string | null): string {
		if (!iconName) return '';
		
		// Check if it's an inline SVG string
		if (iconName.trim().startsWith('<svg')) {
			return iconName;
		}
		
		// Try to get icon from IconPark
		try {
			const IconComponent = (IconPark as any)[iconName];
			if (typeof IconComponent === 'function') {
				return IconComponent({ theme: 'outline', size: iconSize, strokeWidth: 3 });
			}
		} catch (e) {
			console.warn(`Icon "${iconName}" not found in icon-park`);
		}
		
		return '';
	}

	let iconHtml = $derived(loading ? Loading({ theme: 'outline', size: iconSize, strokeWidth: 3 }) : getIconHtml(icon));
	let isDisabled = $derived(disabled || loading);
</script>

<button
	{type}
	class="{buttonClass} {loading ? 'btn-loading' : ''}"
	style="{variantStyles} border-radius: var(--radius-field); {isDisabled ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;'}"
	disabled={isDisabled}
	onclick={onclick}
>
	{#if iconLeft}
		<span class="btn-icon">
			{@render iconLeft()}
		</span>
	{:else if iconHtml && iconPosition === 'left'}
		<span class="btn-icon {loading ? 'animate-spin' : ''}">
			{@html iconHtml}
		</span>
	{/if}
	
	{#if children}
		{@render children()}
	{/if}
	
	{#if iconRight}
		<span class="btn-icon">
			{@render iconRight()}
		</span>
	{:else if iconHtml && iconPosition === 'right'}
		<span class="btn-icon {loading ? 'animate-spin' : ''}">
			{@html iconHtml}
		</span>
	{/if}
</button>

<style>
	.btn {
		white-space: nowrap;
	}

	.btn:not(:disabled):hover {
		filter: brightness(0.9);
	}

	.btn:not(:disabled):active {
		filter: brightness(0.85);
	}

	.btn:focus-visible {
		--tw-ring-color: var(--color-accent);
	}

	.btn-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
