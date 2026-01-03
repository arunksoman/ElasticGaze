<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import type { MarkdownFormProps } from './markdownEditorComponent.types';
	import { getThemeTokens } from './markdownEditorComponent.theme';
	import {
		getComponentStyles,
		containerClass,
		textareaClass,
		previewContainerClass,
		buttonGroupClass,
		buttonClass,
		statusTextClass
	} from './markdownEditorComponent.styles';

	/**
	 * Markdown Form Component
	 * 
	 * A textarea-based Markdown editor with preview functionality.
	 * 
	 * Key behaviors:
	 * - Press Enter to switch to preview mode
	 * - Click "Edit" button to return to edit mode
	 * - Focus is managed appropriately for accessibility
	 * - Mode changes are announced via aria-live
	 */

	// Props
	let {
		value = $bindable(''),
		onChange,
		theme = 'dark',
		ariaLabel = 'Markdown editor',
		placeholder = 'Write your markdown here...',
		defaultPreview = false,
		onPreviewOpen,
		onEditOpen,
		class: className = '',
		minHeight = '200px'
	}: MarkdownFormProps = $props();

	// State
	let mode = $state<'edit' | 'preview'>(defaultPreview ? 'preview' : 'edit');
	let textareaElement: HTMLTextAreaElement | null = $state(null);
	let announcementText = $state('');

	// Computed values
	const themeTokens = $derived(getThemeTokens(theme));
	const componentStyles = $derived(getComponentStyles(themeTokens, minHeight));
	const renderedHtml = $derived.by(() => {
		if (mode === 'preview' && value) {
			try {
				const rawHtml = marked.parse(value, { 
					async: false,
					breaks: true,
					gfm: true
				}) as string;
				return DOMPurify.sanitize(rawHtml, {
					ALLOWED_TAGS: [
						'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
						'p', 'br', 'hr',
						'ul', 'ol', 'li',
						'a', 'strong', 'em', 'code', 'pre',
						'blockquote', 'img', 'table', 'thead',
						'tbody', 'tr', 'th', 'td'
					],
					ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
				});
			} catch (error) {
				console.error('Markdown parsing error:', error);
				return '<p>Error rendering markdown</p>';
			}
		}
		return '';
	});

	/**
	 * Handle textarea input
	 */
	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		onChange?.(value);
	}

	/**
	 * Handle Shift+Enter key press in textarea
	 * Switches to preview mode when Shift+Enter is pressed
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.shiftKey && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			if (value.trim()) {
				switchToPreview();
			}
		}
	}

	/**
	 * Switch to preview mode
	 */
	function switchToPreview() {
		mode = 'preview';
		announcementText = 'Switched to preview mode';
		onPreviewOpen?.();
		
		// Clear announcement after it's been read
		setTimeout(() => {
			announcementText = '';
		}, 1000);
	}

	/**
	 * Switch to edit mode
	 */
	function switchToEdit() {
		mode = 'edit';
		announcementText = 'Switched to edit mode';
		onEditOpen?.();
		
		// Focus textarea after switching
		setTimeout(() => {
			textareaElement?.focus();
		}, 0);
		
		// Clear announcement after it's been read
		setTimeout(() => {
			announcementText = '';
		}, 1000);
	}
</script>

<!-- Accessibility: Announce mode changes -->
<div
	class="sr-only"
	role="status"
	aria-live="polite"
	aria-atomic="true"
>
	{announcementText}
</div>

<!-- Main component -->
<div
	class="{containerClass} {className}"
	style={Object.entries(componentStyles)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ')}
>
	{#if mode === 'edit'}
		<!-- Edit Mode: Textarea -->
		<textarea
			bind:this={textareaElement}
			{value}
			oninput={handleInput}
			onkeydown={handleKeydown}
			class="{textareaClass} markdown-textarea"
			aria-label={ariaLabel}
			{placeholder}
			style="
				background-color: var(--mf-textarea-bg);
				color: var(--mf-text);
				border: none;
				min-height: var(--mf-min-height);
			"
		></textarea>

		<!-- Action buttons -->
		<div
			class={buttonGroupClass}
			style="
				background-color: var(--mf-background);
				border-color: var(--mf-border);
			"
		>
			<button
				type="button"
				onclick={switchToPreview}
				class="{buttonClass} markdown-button"
				disabled={!value.trim()}
				style="
					background-color: var(--mf-button-bg);
					color: var(--mf-button-text);
				"
				aria-label="Switch to preview mode"
			>
				Preview
			</button>
			<span class={statusTextClass} style="color: var(--mf-text);">
				Press Shift+Enter to preview
			</span>
		</div>
	{:else}
		<!-- Preview Mode: Rendered Markdown -->
		<div
			class={previewContainerClass}
			style="
				background-color: var(--mf-preview-bg);
				color: var(--mf-text);
				min-height: var(--mf-min-height);
			"
			role="article"
			aria-label="Markdown preview"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html renderedHtml}
		</div>

		<!-- Action buttons -->
		<div
			class={buttonGroupClass}
			style="
				background-color: var(--mf-background);
				border-color: var(--mf-border);
			"
		>
			<button
				type="button"
				onclick={switchToEdit}
				class="{buttonClass} markdown-button"
				style="
					background-color: var(--mf-button-bg);
					color: var(--mf-button-text);
				"
				aria-label="Switch to edit mode"
			>
				Edit
			</button>
			<span class={statusTextClass} style="color: var(--mf-text);">
				Preview mode
			</span>
		</div>
	{/if}
</div>

<style>
	/* Screen reader only class */
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

	/* Textarea focus styles */
	.markdown-textarea:focus {
		outline: 2px solid var(--mf-focus-ring);
		outline-offset: -2px;
	}

	/* Button styles */
	.markdown-button:hover:not(:disabled) {
		background-color: var(--mf-button-hover-bg) !important;
	}

	/* Custom styles for markdown preview */
	:global(.markdown-preview) {
		line-height: 1.6;
	}

	:global(.markdown-preview h1),
	:global(.markdown-preview h2),
	:global(.markdown-preview h3),
	:global(.markdown-preview h4),
	:global(.markdown-preview h5),
	:global(.markdown-preview h6) {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--color-base-content);
	}

	:global(.markdown-preview h1) {
		font-size: 1.5rem;
	}

	:global(.markdown-preview h2) {
		font-size: 1.25rem;
	}

	:global(.markdown-preview h3) {
		font-size: 1.125rem;
	}

	:global(.markdown-preview p) {
		margin-bottom: 1rem;
	}

	:global(.markdown-preview strong) {
		color: var(--color-base-content);
		font-weight: 700;
	}

	:global(.markdown-preview em) {
		color: var(--color-base-content);
		font-style: italic;
	}

	:global(.markdown-preview ul),
	:global(.markdown-preview ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	:global(.markdown-preview li) {
		margin-bottom: 0.25rem;
	}

	:global(.markdown-preview a) {
		color: var(--color-primary);
		text-decoration: underline;
	}

	:global(.markdown-preview a:hover) {
		opacity: 0.8;
	}

	:global(.markdown-preview code) {
		background-color: var(--mf-code-bg);
		color: var(--mf-code-text);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
		font-family: ui-monospace, monospace;
	}

	:global(.markdown-preview pre) {
		background-color: var(--mf-code-bg);
		color: var(--mf-code-text);
		padding: 1rem;
		border-radius: 0.375rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	:global(.markdown-preview pre code) {
		background-color: transparent;
		padding: 0;
	}

	:global(.markdown-preview blockquote) {
		border-left: 4px solid var(--color-primary);
		padding-left: 1rem;
		margin-left: 0;
		margin-bottom: 1rem;
		color: var(--color-base-content);
		opacity: 0.9;
		background-color: var(--color-base-200);
		padding: 0.75rem 1rem;
		border-radius: 0.25rem;
	}

	:global(.markdown-preview hr) {
		border: none;
		border-top: 1px solid var(--mf-border);
		margin: 1.5rem 0;
	}

	:global(.markdown-preview table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
	}

	:global(.markdown-preview th),
	:global(.markdown-preview td) {
		border: 1px solid var(--mf-border);
		padding: 0.5rem;
		text-align: left;
	}

	:global(.markdown-preview th) {
		background-color: var(--mf-code-bg);
		font-weight: 600;
	}

	/* Button hover effects need to be in component style */
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button:not(:disabled):hover {
		filter: brightness(1.1);
	}

	button:focus-visible {
		outline: 2px solid var(--mf-focus-ring);
		outline-offset: 2px;
	}
</style>
