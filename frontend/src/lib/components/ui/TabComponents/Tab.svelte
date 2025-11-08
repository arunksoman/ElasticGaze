<script lang="ts">
	import { Close, Dot } from '@icon-park/svg';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		id: string;
		title: string;
		active?: boolean;
		edited?: boolean;
		closable?: boolean;
		icon?: string | null;
		ariaLabel?: string;
	}

	let {
		id,
		title,
		active = false,
		edited = false,
		closable = true,
		icon = null,
		ariaLabel = title
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		click: { id: string };
		close: { id: string };
		toggleEdited: { id: string };
	}>();

	function handleClick() {
		dispatch('click', { id });
	}

	function handleClose(e: MouseEvent) {
		e.stopPropagation();
		dispatch('close', { id });
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}
</script>

<div
	role="tab"
	tabindex={active ? 0 : -1}
	aria-selected={active}
	aria-label={ariaLabel}
	class="tab-item"
	class:active
	onclick={handleClick}
	onkeydown={handleKeyDown}
>
	<!-- Optional icon slot -->
	{#if icon}
		<span class="tab-icon" aria-hidden="true">
			{@html icon}
		</span>
	{/if}

	<!-- Tab title -->
	<span class="tab-title" title={title}>{title}</span>

	<!-- Edited indicator (dot) -->
	{#if edited}
		<span class="tab-edited-indicator" aria-label="Modified" title="Modified">
			{@html Dot({ theme: 'filled', size: '12', fill: 'var(--color-warning)' })}
		</span>
	{/if}

	<!-- Close button -->
	{#if closable}
		<button
			type="button"
			class="tab-close-btn"
			aria-label="Close {title}"
			title="Close"
			onclick={handleClose}
		>
			{@html Close({ theme: 'outline', size: '14', strokeWidth: 3 })}
		</button>
	{/if}
</div>

<style>
	.tab-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--color-base-200);
		color: var(--color-base-content);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
		cursor: pointer;
		user-select: none;
		white-space: nowrap;
		transition: all 0.15s ease;
		position: relative;
		min-width: 120px;
		max-width: 200px;
	}

	.tab-item:hover {
		background: var(--color-base-300);
		border-color: var(--color-primary);
	}

	.tab-item:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.tab-item.active {
		background: var(--color-base-100);
		color: var(--color-primary);
		border-bottom: 2px solid var(--color-primary);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.tab-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.tab-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.tab-title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.tab-edited-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 12px;
		height: 12px;
		flex-shrink: 0;
	}

	.tab-edited-indicator :global(svg) {
		width: 100%;
		height: 100%;
	}

	.tab-close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--radius-field);
		color: var(--color-base-content);
		cursor: pointer;
		opacity: 0.6;
		transition: all 0.15s ease;
		flex-shrink: 0;
	}

	.tab-close-btn:hover {
		opacity: 1;
		background: var(--color-error);
		color: var(--color-error-content);
	}

	.tab-close-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 1px;
	}

	.tab-close-btn :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
