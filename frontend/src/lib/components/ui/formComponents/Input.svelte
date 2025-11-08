<script lang="ts">
	interface Props {
		label?: string;
		placeholder?: string;
		value?: string;
		type?: string;
		disabled?: boolean;
		error?: string;
		leftIcon?: string | null;
		rightIcon?: string | null;
		id?: string;
		name?: string;
		oninput?: (event: Event) => void;
		onchange?: (event: Event) => void;
		onfocus?: (event: FocusEvent) => void;
		onblur?: (event: FocusEvent) => void;
	}

	let {
		label = undefined,
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		disabled = false,
		error = undefined,
		leftIcon = null,
		rightIcon = null,
		id = `input-${Math.random().toString(36).substring(2, 9)}`,
		name = undefined,
		oninput,
		onchange,
		onfocus,
		onblur
	}: Props = $props();

	function getIconHtml(iconName: string | null, size: string = '16'): string {
		if (!iconName) return '';
		
		// Check if it's an inline SVG string
		if (iconName.trim().startsWith('<svg')) {
			return iconName;
		}
		
		// Try to get icon from icon-park
		try {
			const iconPark = require('@icon-park/svg');
			const IconComponent = iconPark[iconName];
			if (IconComponent) {
				return IconComponent({ theme: 'outline', size, strokeWidth: 3 });
			}
		} catch (e) {
			console.warn(`Icon "${iconName}" not found in icon-park`);
		}
		
		return '';
	}

	let leftIconHtml = $derived(getIconHtml(leftIcon));
	let rightIconHtml = $derived(getIconHtml(rightIcon));
</script>

<div class="input-wrapper">
	{#if label}
		<label for={id} class="input-label block mb-2 text-sm font-medium" style="color: var(--color-base-content);">
			{label}
		</label>
	{/if}
	
	<div class="input-container relative">
		{#if leftIconHtml}
			<div class="input-icon input-icon-left absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
				{@html leftIconHtml}
			</div>
		{/if}
		
		<input
			{id}
			{type}
			{name}
			{placeholder}
			{disabled}
			class="input-field w-full px-3 py-2 transition-colors focus:outline-none focus:ring-2"
			class:has-left-icon={leftIconHtml}
			class:has-right-icon={rightIconHtml}
			class:input-error={error}
			style="
				background-color: var(--color-base-200);
				color: var(--color-base-content);
				border: var(--border) solid {error ? 'var(--color-error)' : 'var(--color-base-300)'};
				border-radius: var(--radius-field);
			"
			bind:value
			oninput={oninput}
			onchange={onchange}
			onfocus={onfocus}
			onblur={onblur}
		/>
		
		{#if rightIconHtml}
			<div class="input-icon input-icon-right absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
				{@html rightIconHtml}
			</div>
		{/if}
	</div>
	
	{#if error}
		<p class="input-error-text mt-1 text-sm" style="color: var(--color-error);">
			{error}
		</p>
	{/if}
</div>

<style>
	.input-field {
		font-size: 0.875rem;
	}

	.input-field:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-field:not(:disabled):hover {
		border-color: var(--color-base-content);
	}

	.input-field:focus {
		--tw-ring-color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.input-field.has-left-icon {
		padding-left: 2.5rem;
	}

	.input-field.has-right-icon {
		padding-right: 2.5rem;
	}

	.input-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-base-content);
		opacity: 0.6;
	}
</style>
