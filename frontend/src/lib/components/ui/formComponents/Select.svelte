<script lang="ts">
	import { Down, Close } from '@icon-park/svg';
	import { slide } from 'svelte/transition';

	interface Option {
		label: string;
		value: string;
	}

	interface Props {
		label?: string;
		options?: Option[];
		value?: string;
		disabled?: boolean;
		placeholder?: string;
		id?: string;
		name?: string;
		onchange?: (event: Event) => void;
	}

	let {
		label = undefined,
		options = [],
		value = $bindable(''),
		disabled = false,
		placeholder = 'Select an option',
		id = `select-${Math.random().toString(36).substring(2, 9)}`,
		name = undefined,
		onchange
	}: Props = $props();

	let isOpen = $state(false);
	let selectRef: HTMLDivElement;

	let selectedOption = $derived(options.find((opt) => opt.value === value));
	let displayText = $derived(selectedOption?.label || placeholder);

	function toggleDropdown() {
		if (!disabled) {
			isOpen = !isOpen;
		}
	}

	function selectOption(option: Option) {
		if (!disabled) {
			value = option.value;
			isOpen = false;
			if (onchange) {
				onchange(new Event('change'));
			}
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				toggleDropdown();
				break;
			case 'Escape':
				isOpen = false;
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) {
					isOpen = true;
				} else {
					const currentIndex = options.findIndex((opt) => opt.value === value);
					if (currentIndex < options.length - 1) {
						selectOption(options[currentIndex + 1]);
					}
				}
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (isOpen) {
					const currentIndex = options.findIndex((opt) => opt.value === value);
					if (currentIndex > 0) {
						selectOption(options[currentIndex - 1]);
					}
				}
				break;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (selectRef && !selectRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	let downIconHtml = $derived(Down({ theme: 'outline', size: '16', strokeWidth: 3 }));
	let closeIconHtml = $derived(Close({ theme: 'outline', size: '14', strokeWidth: 3 }));

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="select-wrapper" bind:this={selectRef}>
	{#if label}
		<label for={id} class="select-label block mb-2 text-sm font-medium" style="color: var(--color-base-content);">
			{label}
		</label>
	{/if}
	
	<div class="select-container relative">
		<input type="hidden" {id} {name} {value} />
		
		<button
			type="button"
			class="select-trigger w-full flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2"
			class:select-disabled={disabled}
			class:select-open={isOpen}
			style="
				background-color: var(--color-base-200);
				color: {selectedOption ? 'var(--color-base-content)' : 'var(--color-base-content)'};
				border: var(--border) solid var(--color-base-300);
				border-radius: var(--radius-field);
				padding: var(--size-selector);
				padding-left: 0.75rem;
				padding-right: 0.75rem;
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
				opacity: {selectedOption ? '1' : '0.6'};
			"
			onclick={toggleDropdown}
			onkeydown={handleKeydown}
			disabled={disabled}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-labelledby={label ? `${id}-label` : undefined}
		>
			<span class="select-text text-sm">
				{displayText}
			</span>
			
			<div class="select-icons flex items-center gap-1">
				{#if value && !disabled}
					<span
						class="select-clear p-0.5 rounded transition-opacity hover:opacity-70 cursor-pointer"
						onclick={(e) => {
							e.stopPropagation();
							value = '';
							if (onchange) onchange(new Event('change'));
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								e.stopPropagation();
								value = '';
								if (onchange) onchange(new Event('change'));
							}
						}}
						role="button"
						tabindex="0"
						aria-label="Clear selection"
					>
						{@html closeIconHtml}
					</span>
				{/if}
				
				<span class="select-arrow transition-transform {isOpen ? 'rotate-180' : ''}">
					{@html downIconHtml}
				</span>
			</div>
		</button>
		
		{#if isOpen && !disabled}
			<div
				class="select-dropdown absolute w-full mt-1 overflow-hidden shadow-lg z-50"
				style="
					background-color: var(--color-base-100);
					border: var(--border) solid var(--color-base-300);
					border-radius: var(--radius-field);
				"
				role="listbox"
				transition:slide={{ duration: 200 }}
			>
				<div class="select-options max-h-60 overflow-y-auto">
					{#each options as option (option.value)}
						<button
							type="button"
							class="select-option w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer"
							class:select-option-selected={option.value === value}
							style="
								color: var(--color-base-content);
								background-color: {option.value === value ? 'var(--color-base-200)' : 'transparent'};
							"
							onclick={() => selectOption(option)}
							role="option"
							aria-selected={option.value === value}
						>
							{option.label}
						</button>
					{/each}
					
					{#if options.length === 0}
						<div class="select-empty px-3 py-2 text-sm text-center" style="color: var(--color-base-content); opacity: 0.5;">
							No options available
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.select-trigger:not(.select-disabled):hover {
		border-color: var(--color-base-content);
	}

	.select-trigger:focus {
		--tw-ring-color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.select-trigger.select-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.select-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.select-option:hover {
		background-color: var(--color-base-200) !important;
	}

	.select-option:focus {
		outline: none;
		background-color: var(--color-base-200) !important;
	}

	.select-dropdown {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.select-options::-webkit-scrollbar {
		width: 8px;
	}

	.select-options::-webkit-scrollbar-track {
		background: var(--color-base-200);
	}

	.select-options::-webkit-scrollbar-thumb {
		background: var(--color-base-300);
		border-radius: 4px;
	}

	.select-options::-webkit-scrollbar-thumb:hover {
		background: var(--color-base-content);
	}
</style>
