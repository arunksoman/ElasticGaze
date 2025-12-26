<script lang="ts">
	import { Eyes, PreviewClose } from '@icon-park/svg';
	import { fade } from 'svelte/transition';

	interface Props {
		label?: string;
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		error?: string;
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
		disabled = false,
		error = undefined,
		id = `password-${Math.random().toString(36).substring(2, 9)}`,
		name = undefined,
		oninput,
		onchange,
		onfocus,
		onblur
	}: Props = $props();

	let showPassword = $state(false);
	let inputType = $derived(showPassword ? 'text' : 'password');

	function toggleVisibility() {
		showPassword = !showPassword;
	}

	let eyeIconHtml = $derived(
		showPassword
			? Eyes({ theme: 'outline', size: '16', strokeWidth: 3 })
			: PreviewClose({ theme: 'outline', size: '16', strokeWidth: 3 })
	);
</script>

<div class="password-wrapper">
	{#if label}
		<label for={id} class="password-label block mb-2 text-sm font-medium" style="color: var(--color-base-content);">
			{label}
		</label>
	{/if}
	
	<div class="password-container relative">
		<input
			{id}
			type={inputType}
			{name}
			{placeholder}
			{disabled}
			class="password-field w-full px-3 py-2 pr-12 transition-colors focus:outline-none focus:ring-2"
			class:password-error={error}
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
		
		<button
			type="button"
			class="password-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity hover:opacity-70"
			onclick={toggleVisibility}
			disabled={disabled}
			aria-label={showPassword ? 'Hide password' : 'Show password'}
			style="background-color: transparent; cursor: pointer;"
		>
			{#key showPassword}
				<span transition:fade={{ duration: 150 }}>
					{@html eyeIconHtml}
				</span>
			{/key}
		</button>
	</div>
	
	{#if error}
		<p class="password-error-text mt-1 text-sm" style="color: var(--color-error);">
			{error}
		</p>
	{/if}
</div>

<style>
	.password-field {
		font-size: 0.875rem;
	}

	.password-field:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.password-field:not(:disabled):hover {
		border-color: var(--color-base-content);
	}

	.password-field:focus {
		--tw-ring-color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.password-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-base-content);
	}

	.password-toggle:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
