<script lang="ts">
	import { SunOne, Moon } from '@icon-park/svg';
	import { onMount } from 'svelte';

	interface Props {
		label?: string;
		id?: string;
		onchange?: (isDark: boolean) => void;
	}

	let {
		label = undefined,
		id = `theme-switcher-${Math.random().toString(36).substring(2, 9)}`,
		onchange
	}: Props = $props();

	let isDarkTheme = $state(true); // Default to dark theme

	// Check initial theme on mount
	onMount(() => {
		const html = document.documentElement;
		isDarkTheme = !html.classList.contains('light-theme');
	});

	function toggleTheme() {
		isDarkTheme = !isDarkTheme;
		const html = document.documentElement;
		
		if (isDarkTheme) {
			html.classList.remove('light-theme');
		} else {
			html.classList.add('light-theme');
		}

		if (onchange) {
			onchange(isDarkTheme);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			toggleTheme();
		}
	}

	let sunIconHtml = $derived(SunOne({ theme: 'filled', size: '16', strokeWidth: 3 }));
	let moonIconHtml = $derived(Moon({ theme: 'filled', size: '16', strokeWidth: 3 }));
</script>

<div class="theme-switcher-wrapper inline-flex items-center gap-3">
	<div
		class="theme-switcher-container relative inline-flex items-center cursor-pointer transition-all"
		style="
			width: 3.5rem;
			height: 1.75rem;
			background-color: {isDarkTheme ? 'var(--color-secondary)' : 'var(--color-secondary)'};
			border-radius: var(--radius-selector);
		"
		role="switch"
		aria-checked={isDarkTheme}
		aria-label={label || 'Toggle theme'}
		aria-labelledby={label ? `${id}-label` : undefined}
		tabindex={0}
		onclick={toggleTheme}
		onkeydown={handleKeydown}
	>
		<input
			type="checkbox"
			{id}
			bind:checked={isDarkTheme}
			class="theme-switcher-input sr-only"
		/>
		
		<span
			class="theme-switcher-thumb absolute transition-all duration-300 ease-in-out flex items-center justify-center"
			style="
				width: 1.375rem;
				height: 1.375rem;
				background-color: var(--color-base-100);
				border-radius: 50%;
				left: {isDarkTheme ? 'calc(100% - 1.375rem - 0.1875rem)' : '0.1875rem'};
				top: 50%;
				transform: translateY(-50%);
			"
		>
			{#if isDarkTheme}
				<span class="icon-wrapper" style="color: var(--color-base-content); line-height: 0;">
					{@html moonIconHtml}
				</span>
			{:else}
				<span class="icon-wrapper" style="color: var(--color-base-content); line-height: 0;">
					{@html sunIconHtml}
				</span>
			{/if}
		</span>
	</div>
	
	{#if label}
		<label
			for={id}
			id="{id}-label"
			class="theme-switcher-label text-sm select-none cursor-pointer"
			style="color: var(--color-base-content);"
		>
			{label}
		</label>
	{/if}
</div>

<style>
	.theme-switcher-container:hover {
		filter: brightness(1.1);
	}

	.theme-switcher-container:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.theme-switcher-input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.theme-switcher-label {
		user-select: none;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease-in-out;
	}

	.theme-switcher-thumb {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
