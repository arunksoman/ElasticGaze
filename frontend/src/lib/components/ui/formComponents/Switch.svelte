<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		label?: string;
		id?: string;
		name?: string;
		onchange?: (event: Event) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		label = undefined,
		id = `switch-${Math.random().toString(36).substring(2, 9)}`,
		name = undefined,
		onchange
	}: Props = $props();

	function handleToggle() {
		if (!disabled) {
			checked = !checked;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			handleToggle();
			if (onchange) {
				onchange(new Event('change'));
			}
		}
	}
</script>

<div class="switch-wrapper inline-flex items-center gap-3">
	<div
		class="switch-container relative inline-flex items-center cursor-pointer transition-all"
		class:switch-disabled={disabled}
		style="
			width: 2.75rem;
			height: 1.5rem;
			background-color: {checked ? 'var(--color-accent)' : 'var(--color-base-300)'};
			border-radius: var(--radius-selector);
		"
		role="switch"
		aria-checked={checked}
		aria-disabled={disabled}
		aria-labelledby={label ? `${id}-label` : undefined}
		tabindex={disabled ? -1 : 0}
		onclick={handleToggle}
		onkeydown={handleKeydown}
	>
		<input
			type="checkbox"
			{id}
			{name}
			{disabled}
			bind:checked
			onchange={onchange}
			class="switch-input sr-only"
		/>
		
		<span
			class="switch-thumb absolute transition-all duration-200 ease-in-out"
			style="
				width: 1.125rem;
				height: 1.125rem;
				background-color: var(--color-base-content);
				border-radius: 50%;
				left: {checked ? 'calc(100% - 1.125rem - 0.1875rem)' : '0.1875rem'};
				top: 50%;
				transform: translateY(-50%);
			"
		></span>
	</div>
	
	{#if label}
		<label
			for={id}
			id="{id}-label"
			class="switch-label text-sm select-none cursor-pointer"
			class:switch-label-disabled={disabled}
			style="color: var(--color-base-content);"
		>
			{label}
		</label>
	{/if}
</div>

<style>
	.switch-container:not(.switch-disabled):hover {
		filter: brightness(1.1);
	}

	.switch-container:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.switch-container.switch-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.switch-input {
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

	.switch-label {
		user-select: none;
	}

	.switch-label-disabled {
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
