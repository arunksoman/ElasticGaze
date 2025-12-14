/**
 * CodeMirror Theme Definitions for ElasticGaze
 * 
 * Maps app theme variables to CodeMirror theme extensions.
 * Supports dark and light themes that automatically sync with the app theme.
 */

import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/**
 * Get computed CSS variable value from root
 */
function getCSSVar(name: string): string {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Dark theme for CodeMirror
 * Uses CSS variables from app.css dark theme (:root)
 */
export const darkTheme = EditorView.theme(
	{
		'&': {
			backgroundColor: 'var(--color-base-100)',
			color: 'var(--color-base-content)',
			height: '100%',
		},
		'.cm-content': {
			caretColor: 'var(--color-accent)',
			fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			fontSize: '13px',
			lineHeight: '1.6',
		},
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: 'var(--color-accent)',
			borderLeftWidth: '2px',
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: 'var(--color-accent)',
		},
		'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
			backgroundColor: 'var(--color-primary)',
			opacity: '0.3',
		},
		'.cm-activeLine': {
			backgroundColor: 'var(--color-base-200)',
		},
		'.cm-selectionMatch': {
			backgroundColor: 'var(--color-secondary)',
			opacity: '0.2',
		},
		'&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
			backgroundColor: 'var(--color-accent)',
			opacity: '0.15',
		},
		'.cm-gutters': {
			backgroundColor: 'var(--color-base-200)',
			color: 'var(--color-base-content)',
			border: 'none',
			opacity: '0.6',
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'var(--color-base-300)',
			opacity: '1',
		},
		'.cm-foldPlaceholder': {
			backgroundColor: 'var(--color-base-300)',
			border: '1px solid var(--color-base-content)',
			color: 'var(--color-base-content)',
			opacity: '0.5',
		},
		'.cm-tooltip': {
			border: '1px solid var(--color-base-300)',
			backgroundColor: 'var(--color-base-100)',
			color: 'var(--color-base-content)',
		},
		'.cm-tooltip-autocomplete': {
			'& > ul': {
				fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			},
			'& > ul > li[aria-selected]': {
				backgroundColor: 'var(--color-primary)',
				color: 'var(--color-primary-content)',
			},
		},
		'.cm-line': {
			padding: '0 4px',
		},
		'&.cm-focused': {
			outline: 'none',
		},
		// Readonly styles
		'&.cm-readonly': {
			backgroundColor: 'var(--color-base-200)',
			opacity: '0.9',
		},
		'.cm-readonly .cm-cursor': {
			display: 'none',
		},
	},
	{ dark: true }
);

/**
 * Light theme for CodeMirror
 * Uses CSS variables from app.css light theme (.light-theme)
 */
export const lightTheme = EditorView.theme(
	{
		'&': {
			backgroundColor: 'var(--color-base-100)',
			color: 'var(--color-base-content)',
			height: '100%',
		},
		'.cm-content': {
			caretColor: 'var(--color-accent)',
			fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			fontSize: '13px',
			lineHeight: '1.6',
		},
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: 'var(--color-accent)',
			borderLeftWidth: '2px',
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: 'var(--color-accent)',
		},
		'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
			backgroundColor: 'var(--color-primary)',
			opacity: '0.2',
		},
		'.cm-activeLine': {
			backgroundColor: 'var(--color-base-200)',
		},
		'.cm-selectionMatch': {
			backgroundColor: 'var(--color-secondary)',
			opacity: '0.15',
		},
		'&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
			backgroundColor: 'var(--color-accent)',
			opacity: '0.15',
		},
		'.cm-gutters': {
			backgroundColor: 'var(--color-base-200)',
			color: 'var(--color-base-content)',
			border: 'none',
			opacity: '0.6',
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'var(--color-base-300)',
			opacity: '1',
		},
		'.cm-foldPlaceholder': {
			backgroundColor: 'var(--color-base-300)',
			border: '1px solid var(--color-base-content)',
			color: 'var(--color-base-content)',
			opacity: '0.5',
		},
		'.cm-tooltip': {
			border: '1px solid var(--color-base-300)',
			backgroundColor: 'var(--color-base-100)',
			color: 'var(--color-base-content)',
		},
		'.cm-tooltip-autocomplete': {
			'& > ul': {
				fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			},
			'& > ul > li[aria-selected]': {
				backgroundColor: 'var(--color-primary)',
				color: 'var(--color-primary-content)',
			},
		},
		'.cm-line': {
			padding: '0 4px',
		},
		'&.cm-focused': {
			outline: 'none',
		},
		// Readonly styles
		'&.cm-readonly': {
			backgroundColor: 'var(--color-base-200)',
			opacity: '0.9',
		},
		'.cm-readonly .cm-cursor': {
			display: 'none',
		},
	},
	{ dark: false }
);

/**
 * JSON syntax highlighting colors
 * Uses theme-aware CSS variables and Lezer tags
 */
export const jsonSyntaxHighlighting = syntaxHighlighting(
	HighlightStyle.define([
		{ tag: t.propertyName, color: 'var(--color-info)' },
		{ tag: t.string, color: 'var(--color-success)' },
		{ tag: t.number, color: 'var(--color-warning)' },
		{ tag: t.bool, color: 'var(--color-secondary)', fontWeight: 'bold' },
		{ tag: t.null, color: 'var(--color-error)', fontStyle: 'italic' },
		{ tag: t.keyword, color: 'var(--color-secondary)', fontWeight: 'bold' },
		{ tag: t.operator, color: 'var(--color-base-content)' },
		{ tag: t.punctuation, color: 'var(--color-base-content)', opacity: '0.7' },
		{ tag: t.bracket, color: 'var(--color-base-content)', fontWeight: 'bold' },
		{ tag: t.brace, color: 'var(--color-base-content)', fontWeight: 'bold' },
		{ tag: t.comment, color: 'var(--color-base-content)', opacity: '0.5', fontStyle: 'italic' },
		{ tag: t.invalid, color: 'var(--color-error)', textDecoration: 'underline' },
	])
);
