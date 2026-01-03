/**
 * Markdown Editor Styles
 * 
 * Provides style utilities and constants for the Markdown Editor component.
 */

import type { MarkdownFormThemeTokens } from './markdownEditorComponent.theme';

/**
 * Generate inline styles for the component
 */
export function getComponentStyles(tokens: MarkdownFormThemeTokens, minHeight?: string) {
	return {
		'--mf-background': tokens.background,
		'--mf-textarea-bg': tokens.textareaBackground,
		'--mf-border': tokens.border,
		'--mf-text': tokens.text,
		'--mf-placeholder': tokens.placeholder,
		'--mf-preview-bg': tokens.previewBackground,
		'--mf-code-bg': tokens.codeBackground,
		'--mf-code-text': tokens.codeText,
		'--mf-button-bg': tokens.buttonBackground,
		'--mf-button-text': tokens.buttonText,
		'--mf-button-hover-bg': tokens.buttonHoverBackground,
		'--mf-focus-ring': tokens.focusRing,
		'--mf-min-height': minHeight || '200px'
	};
}

/**
 * Base container styles
 */
export const containerClass = `
	markdown-form-container
	rounded-md
	border
	overflow-hidden
	transition-colors
	duration-200
`.trim().replace(/\s+/g, ' ');

/**
 * Textarea styles
 */
export const textareaClass = `
	w-full
	px-4
	py-3
	font-mono
	text-sm
	resize-vertical
	focus:outline-none
	focus:ring-2
	focus:ring-inset
	transition-all
	duration-200
`.trim().replace(/\s+/g, ' ');

/**
 * Preview container styles
 */
export const previewContainerClass = `
	markdown-preview
	px-4
	py-3
	prose
	prose-sm
	max-w-none
	overflow-y-auto
`.trim().replace(/\s+/g, ' ');

/**
 * Button group styles
 */
export const buttonGroupClass = `
	flex
	gap-2
	p-2
	border-t
`.trim().replace(/\s+/g, ' ');

/**
 * Button styles
 */
export const buttonClass = `
	px-3
	py-1.5
	text-xs
	font-medium
	rounded
	transition-colors
	duration-200
	focus:outline-none
	focus:ring-2
	focus:ring-offset-1
`.trim().replace(/\s+/g, ' ');

/**
 * Status text styles
 */
export const statusTextClass = `
	text-xs
	ml-auto
	self-center
	opacity-70
`.trim().replace(/\s+/g, ' ');
