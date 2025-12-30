<script lang="ts">
	import { ENV_COLOR_OPTIONS, DEFAULT_ENV_COLOR } from '$lib/core/constants';

	interface ColorOption {
		value: string;
		color: string;
	}

	interface Props {
		label?: string;
		options?: ColorOption[];
		value?: string;
		disabled?: boolean;
		id?: string;
		name?: string;
		onchange?: (value: string) => void;
	}

	let {
		label = undefined,
		options = [...ENV_COLOR_OPTIONS],
		value = $bindable(DEFAULT_ENV_COLOR),
		disabled = false,
		id = `color-radio-${Math.random().toString(36).substring(2, 9)}`,
		name = undefined,
		onchange
	}: Props = $props();

	function handleSelect(optionValue: string) {
		if (!disabled) {
			value = optionValue;
			if (onchange) {
				onchange(optionValue);
			}
		}
	}

	function handleKeydown(event: KeyboardEvent, optionValue: string) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			handleSelect(optionValue);
		}
	}
</script>

{#if label}
	<label
		for={id}
		class="block text-sm font-medium mb-2"
		style="color: var(--color-base-content);"
	>
		{label}
	</label>
{/if}

<div class="color-radio-group flex gap-2" role="radiogroup" aria-labelledby={label ? `${id}-label` : undefined}>
	{#each options as option}
		<button
			type="button"
			class="color-radio-button rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
			class:selected={value === option.value}
			class:disabled={disabled}
			style="
				background-color: {option.color};
				width: 1rem;
				height: 1rem;
				border: 2px solid {value === option.value ? 'white' : 'transparent'};
				box-shadow: {value === option.value ? '0 0 0 2px ' + option.color : 'none'};
				cursor: {disabled ? 'not-allowed' : 'pointer'};
				opacity: {disabled ? '0.5' : '1'};
			"
			role="radio"
			aria-label="{option.value} color"
			aria-checked={value === option.value}
			aria-disabled={disabled}
			tabindex={disabled ? -1 : 0}
			onclick={() => handleSelect(option.value)}
			onkeydown={(e) => handleKeydown(e, option.value)}
		>
			<input
				type="radio"
				{name}
				value={option.value}
				checked={value === option.value}
				{disabled}
				class="sr-only"
			/>
		</button>
	{/each}
</div>

<style>
	.color-radio-button:not(.disabled):hover {
		transform: scale(1.1);
	}

	.color-radio-button.selected {
		transform: scale(1.15);
	}

	.color-radio-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
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
