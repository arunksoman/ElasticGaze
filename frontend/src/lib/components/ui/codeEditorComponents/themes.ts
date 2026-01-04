/**
 * CodeMirror Theme Definitions for ElasticGaze
 * 
 * Uses cobalt theme for dark mode and duotone-light for light mode.
 */

import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/**
 * Dark theme - Cobalt
 * A classic blue/dark theme with excellent contrast
 */
export const darkTheme = EditorView.theme(
	{
		'&': {
			backgroundColor: 'var(--color-base-100)',
			color: '#FFFFFF',
			height: '100%',
		},
		'.cm-content': {
			caretColor: '#FFCC00',
			fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			fontSize: '13px',
			lineHeight: '1.6',
		},
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: '#FFCC00',
			borderLeftWidth: '2px',
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: '#FFCC00',
		},
		'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
			backgroundColor: '#0050A4',
		},
		'.cm-activeLine': {
			backgroundColor: 'var(--color-base-200)',
		},
		'.cm-selectionMatch': {
			backgroundColor: '#0066BB',
		},
		'&.cm-focused .cm-matchingBracket': {
			backgroundColor: '#0050A4',
			outline: '1px solid #0088FF',
		},
		'&.cm-focused .cm-nonmatchingBracket': {
			backgroundColor: '#800F00',
		},
		'.cm-gutters': {
			backgroundColor: 'var(--color-base-200)',
			color: '#0088FF',
			border: 'none',
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'var(--color-base-300)',
		},
		'.cm-foldPlaceholder': {
			backgroundColor: '#0050A4',
			border: '1px solid #0088FF',
			color: '#FFFFFF',
		},
		'.cm-tooltip': {
			border: '1px solid #0088FF',
			backgroundColor: 'var(--color-base-100)',
			color: '#FFFFFF',
		},
		'.cm-tooltip-autocomplete': {
			'& > ul': {
				fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			},
			'& > ul > li[aria-selected]': {
				backgroundColor: '#0050A4',
				color: '#FFFFFF',
			},
		},
		'.cm-line': {
			padding: '0 4px',
		},
		'&.cm-focused': {
			outline: 'none',
		},
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
 * Light theme - Duotone Light
 * A clean, minimalist light theme with purple accents
 */
export const lightTheme = EditorView.theme(
	{
		'&': {
			backgroundColor: 'var(--color-base-100)',
			color: '#728FCE',
			height: '100%',
		},
		'.cm-content': {
			caretColor: '#93ABDC',
			fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			fontSize: '13px',
			lineHeight: '1.6',
		},
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: '#93ABDC',
			borderLeftWidth: '2px',
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: '#93ABDC',
		},
		'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
			backgroundColor: '#E3DEDD',
		},
		'.cm-activeLine': {
			backgroundColor: 'var(--color-base-200)',
		},
		'.cm-selectionMatch': {
			backgroundColor: '#E3DEDD',
		},
		'&.cm-focused .cm-matchingBracket': {
			backgroundColor: '#E3DEDD',
			outline: '1px solid #B8AFE6',
		},
		'&.cm-focused .cm-nonmatchingBracket': {
			backgroundColor: '#FFDDDD',
		},
		'.cm-gutters': {
			backgroundColor: 'var(--color-base-200)',
			color: '#B8AFE6',
			border: 'none',
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'var(--color-base-300)',
		},
		'.cm-foldPlaceholder': {
			backgroundColor: '#E3DEDD',
			border: '1px solid #B8AFE6',
			color: '#728FCE',
		},
		'.cm-tooltip': {
			border: '1px solid #E3DEDD',
			backgroundColor: 'var(--color-base-100)',
			color: '#728FCE',
		},
		'.cm-tooltip-autocomplete': {
			'& > ul': {
				fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
			},
			'& > ul > li[aria-selected]': {
				backgroundColor: '#E3DEDD',
				color: '#728FCE',
			},
		},
		'.cm-line': {
			padding: '0 4px',
		},
		'&.cm-focused': {
			outline: 'none',
		},
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
 * Cobalt syntax highlighting (dark theme)
 */
const cobaltSyntaxHighlighting = syntaxHighlighting(
	HighlightStyle.define([
		{ tag: t.propertyName, color: '#9EFFFF' },
		{ tag: t.string, color: '#3AD900' },
		{ tag: t.number, color: '#FF628C' },
		{ tag: t.bool, color: '#FF9D00', fontWeight: 'bold' },
		{ tag: t.null, color: '#FF628C', fontStyle: 'italic' },
		{ tag: t.keyword, color: '#FF9D00', fontWeight: 'bold' },
		{ tag: t.operator, color: '#FFFFFF' },
		{ tag: t.punctuation, color: '#FFFFFF' },
		{ tag: t.bracket, color: '#FFFFFF', fontWeight: 'bold' },
		{ tag: t.brace, color: '#FFFFFF', fontWeight: 'bold' },
		{ tag: t.comment, color: '#0088FF', fontStyle: 'italic' },
		{ tag: t.invalid, color: '#FF0000', textDecoration: 'underline' },
	])
);

/**
 * Duotone Light syntax highlighting (light theme)
 */
const duotoneLightSyntaxHighlighting = syntaxHighlighting(
	HighlightStyle.define([
		{ tag: t.propertyName, color: '#063289' },
		{ tag: t.string, color: '#896724' },
		{ tag: t.number, color: '#b29762' },
		{ tag: t.bool, color: '#728FCE', fontWeight: 'bold' },
		{ tag: t.null, color: '#b29762', fontStyle: 'italic' },
		{ tag: t.keyword, color: '#728FCE', fontWeight: 'bold' },
		{ tag: t.operator, color: '#728FCE' },
		{ tag: t.punctuation, color: '#728FCE' },
		{ tag: t.bracket, color: '#063289', fontWeight: 'bold' },
		{ tag: t.brace, color: '#063289', fontWeight: 'bold' },
		{ tag: t.comment, color: '#B8AFE6', fontStyle: 'italic' },
		{ tag: t.invalid, color: '#D5393E', textDecoration: 'underline' },
	])
);

/**
 * JSON syntax highlighting that switches based on theme
 * For backward compatibility - use theme-specific highlighting in new code
 */
export const jsonSyntaxHighlighting = cobaltSyntaxHighlighting;

// Export both for explicit use
export { cobaltSyntaxHighlighting, duotoneLightSyntaxHighlighting };
