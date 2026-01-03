/**
 * Markdown Form Theme Configuration
 * 
 * Contains theme-specific tokens for light and dark modes.
 */

import type { MarkdownFormTheme } from './markdown-form.types';

export interface MarkdownFormThemeTokens {
	/** Background color for the form container */
	background: string;

	/** Background color for the textarea */
	textareaBackground: string;

	/** Border color */
	border: string;

	/** Text color */
	text: string;

	/** Placeholder text color */
	placeholder: string;

	/** Preview background */
	previewBackground: string;

	/** Code block background */
	codeBackground: string;

	/** Code block text color */
	codeText: string;

	/** Button background */
	buttonBackground: string;

	/** Button text color */
	buttonText: string;

	/** Button hover background */
	buttonHoverBackground: string;

	/** Focus ring color */
	focusRing: string;
}

/**
 * Light theme tokens
 */
const lightTheme: MarkdownFormThemeTokens = {
	background: 'var(--color-base-100)',
	textareaBackground: 'var(--color-base-100)',
	border: 'var(--color-base-300)',
	text: 'var(--color-base-content)',
	placeholder: 'oklch(60% 0.02 265.755)',
	previewBackground: 'var(--color-base-100)',
	codeBackground: 'var(--color-base-200)',
	codeText: 'var(--color-accent-content)',
	buttonBackground: 'var(--color-primary)',
	buttonText: 'var(--color-primary-content)',
	buttonHoverBackground: 'oklch(from var(--color-primary) calc(l * 0.9) c h)',
	focusRing: 'var(--color-primary)'
};

/**
 * Dark theme tokens
 */
const darkTheme: MarkdownFormThemeTokens = {
	background: 'var(--color-base-100)',
	textareaBackground: 'var(--color-base-200)',
	border: 'var(--color-base-300)',
	text: 'var(--color-base-content)',
	placeholder: 'oklch(50% 0.05 274.713)',
	previewBackground: 'var(--color-base-100)',
	codeBackground: 'var(--color-base-300)',
	codeText: 'var(--color-secondary)',
	buttonBackground: 'var(--color-primary)',
	buttonText: 'var(--color-primary-content)',
	buttonHoverBackground: 'oklch(from var(--color-primary) calc(l * 1.1) c h)',
	focusRing: 'var(--color-primary)'
};

/**
 * Get theme tokens based on the current theme
 */
export function getThemeTokens(theme: MarkdownFormTheme): MarkdownFormThemeTokens {
	return theme === 'light' ? lightTheme : darkTheme;
}
