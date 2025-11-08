<script lang="ts">
	import { Check } from '@icon-park/svg';

	interface Props {
		checked?: boolean;
		label?: string;
		disabled?: boolean;
		id?: string;
		name?: string;
		onchange?: (event: Event) => void;
	}

	let {
		checked = $bindable(false),
		label = undefined,
		disabled = false,
		id = `checkbox-${Math.random().toString(36).substring(2, 9)}`,
		name = undefined,
		onchange
	}: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			if (!disabled) {
				checked = !checked;
				if (onchange) {
					onchange(new Event('change'));
				}
			}
		}
	}

	function handleClick() {
		if (!disabled) {
			checked = !checked;
		}
	}

	let checkIconHtml = $derived(Check({ theme: 'outline', size: '14', strokeWidth: 4 }));
</script>

<div class="checkbox-wrapper inline-flex items-center gap-2">
	<div
		class="checkbox-container relative inline-flex items-center justify-center cursor-pointer transition-all"
		class:checkbox-disabled={disabled}
		style="
			width: 1.25rem;
			height: 1.25rem;
			background-color: {checked ? 'var(--color-accent)' : 'var(--color-base-200)'};
			border: var(--border) solid {checked ? 'var(--color-accent)' : 'var(--color-base-300)'};
			border-radius: var(--radius-box);
		"
		role="checkbox"
		aria-checked={checked}
		aria-disabled={disabled}
		aria-labelledby={label ? `${id}-label` : undefined}
		tabindex={disabled ? -1 : 0}
		onclick={handleClick}
		onkeydown={handleKeydown}
	>
		<input
			type="checkbox"
			{id}
			{name}
			{disabled}
			bind:checked
			onchange={onchange}
			class="checkbox-input sr-only"
		/>
		
		{#if checked}
			<span class="checkbox-check" style="color: var(--color-accent-content);">
				{@html checkIconHtml}
			</span>
		{/if}
	</div>
	
	{#if label}
		<label
			for={id}
			id="{id}-label"
			class="checkbox-label text-sm select-none cursor-pointer"
			class:checkbox-label-disabled={disabled}
			style="color: var(--color-base-content);"
		>
			{label}
		</label>
	{/if}
</div>

<style>
	.checkbox-container:not(.checkbox-disabled):hover {
		filter: brightness(1.1);
	}

	.checkbox-container:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.checkbox-container.checkbox-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.checkbox-input {
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

	.checkbox-check {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}

	.checkbox-label {
		user-select: none;
	}

	.checkbox-label-disabled {
		opacity: 0.5;
		cursor: not-allowed;
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
</style>
