/**
 * CodeMirror Initialization Helper
 * 
 * Creates and configures CodeMirror 6 editor instances with:
 * - JSON language support
 * - Line numbers
 * - Code folding
 * - Autocomplete
 * - Bracket matching
 * - Custom keybindings (zoom controls)
 * - Theme support
 * - Read-only mode
 * - Accessibility features
 */

import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, placeholder as placeholderExtension } from '@codemirror/view';
import { EditorState, Compartment, type Extension } from '@codemirror/state';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { 
	autocompletion, 
	completionKeymap, 
	closeBrackets, 
	closeBracketsKeymap 
} from '@codemirror/autocomplete';
import { linter, lintKeymap } from '@codemirror/lint';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { darkTheme, lightTheme, cobaltSyntaxHighlighting, duotoneLightSyntaxHighlighting } from './themes';

export interface UseCodeMirrorOptions {
	parent: HTMLElement;
	value: string;
	onChange?: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	readOnly?: boolean;
	tabSize?: number;
	lineWrapping?: boolean;
	showLineNumbers?: boolean;
	placeholder?: string;
	theme?: 'dark' | 'light';
	zoomLevel?: number;
	onZoomChange?: (zoom: number) => void;
}

/**
 * Initialize CodeMirror editor
 */
export function createCodeMirrorEditor(options: UseCodeMirrorOptions): EditorView {
	const {
		parent,
		value,
		onChange,
		onFocus,
		onBlur,
		readOnly = false,
		tabSize = 2,
		lineWrapping = true,
		showLineNumbers = true,
		placeholder = '',
		theme = 'dark',
		zoomLevel = 100,
		onZoomChange,
	} = options;

	// Compartments for dynamic configuration
	const readOnlyCompartment = new Compartment();
	const themeCompartment = new Compartment();
	const editableCompartment = new Compartment();

	// Base extensions
	const extensions: Extension[] = [
		// Language support
		json(),
		linter(jsonParseLinter()),
		
		// Syntax highlighting - use theme-specific highlighting
		theme === 'dark' ? cobaltSyntaxHighlighting : duotoneLightSyntaxHighlighting,
		
		// Basic editing
		history(),
		indentOnInput(),
		bracketMatching(),
		closeBrackets(),
		autocompletion({
			activateOnTyping: true,
			closeOnBlur: true,
		}),
		
		// Visual features
		highlightActiveLine(),
		highlightActiveLineGutter(),
		
		// Line wrapping
		...(lineWrapping ? [EditorView.lineWrapping] : []),
		
		// Line numbers and folding
		...(showLineNumbers ? [lineNumbers(), foldGutter()] : []),
		
		// Theme
		themeCompartment.of(theme === 'dark' ? darkTheme : lightTheme),
		
		// Read-only mode
		readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
		editableCompartment.of(EditorView.editable.of(!readOnly)),
		
		// Tab size
		EditorState.tabSize.of(tabSize),
		
		// Placeholder
		...(options.placeholder ? [placeholderExtension(options.placeholder)] : []),
		
		// Update listener
		EditorView.updateListener.of((update) => {
			if (update.docChanged && onChange) {
				onChange(update.state.doc.toString());
			}
			
			// Focus/blur events
			if (update.focusChanged) {
				if (update.view.hasFocus && onFocus) {
					onFocus();
				} else if (!update.view.hasFocus && onBlur) {
					onBlur();
				}
			}
		}),
		
		// Zoom scaling - target all text elements
		EditorView.theme({
			'&': {
				fontSize: `${14 * (zoomLevel / 100)}px !important`,
			},
			'.cm-content': {
				fontSize: `${14 * (zoomLevel / 100)}px !important`,
			},
			'.cm-line': {
				fontSize: `${14 * (zoomLevel / 100)}px !important`,
			},
			'.cm-gutters': {
				fontSize: `${14 * (zoomLevel / 100)}px !important`,
			},
			'.cm-lineNumbers': {
				fontSize: `${14 * (zoomLevel / 100)}px !important`,
			},
		}),
		
		// Custom keymaps
		keymap.of([
			...closeBracketsKeymap,
			...defaultKeymap,
			...searchKeymap,
			...historyKeymap,
			...foldKeymap,
			...completionKeymap,
			...lintKeymap,
			indentWithTab,
		]),
		
		// Separate keymap for zoom controls (highest priority)
		keymap.of([
			{
				key: 'Ctrl-=',
				run: (view) => {
					if (onZoomChange) {
						onZoomChange(Math.min(zoomLevel + 10, 200));
						return true;
					}
					return false;
				},
			},
			{
				key: 'Ctrl-+',
				run: (view) => {
					if (onZoomChange) {
						onZoomChange(Math.min(zoomLevel + 10, 200));
						return true;
					}
					return false;
				},
			},
			{
				key: 'Ctrl--',
				run: (view) => {
					if (onZoomChange) {
						onZoomChange(Math.max(zoomLevel - 10, 50));
						return true;
					}
					return false;
				},
			},
			{
				key: 'Ctrl-0',
				run: (view) => {
					if (onZoomChange) {
						onZoomChange(100);
						return true;
					}
					return false;
				},
			},
		]),
		
		// Accessibility attributes
		EditorView.contentAttributes.of({
			'aria-label': 'Code editor',
			'role': 'textbox',
			'aria-multiline': 'true',
			...(readOnly ? { 'aria-readonly': 'true' } : {}),
		}),
	];

	// Create editor state
	const state = EditorState.create({
		doc: value,
		extensions,
	});

	// Create editor view
	const view = new EditorView({
		state,
		parent,
	});

	return view;
}

/**
 * Update editor theme
 * Note: Theme updates are handled by recreating the editor in the component
 */
export function updateTheme(view: EditorView, theme: 'dark' | 'light'): void {
	// Theme updates are handled by recreating the editor
}

/**
 * Update editor read-only state
 * Note: Read-only updates are handled by recreating the editor in the component
 */
export function updateReadOnly(view: EditorView, readOnly: boolean): void {
	// Read-only updates are handled by recreating the editor
}

/**
 * Update editor value programmatically
 */
export function updateValue(view: EditorView, value: string): void {
	const currentValue = view.state.doc.toString();
	if (currentValue !== value) {
		view.dispatch({
			changes: {
				from: 0,
				to: currentValue.length,
				insert: value,
			},
		});
	}
}

/**
 * Update editor zoom level
 */
export function updateZoom(view: EditorView, zoomLevel: number): void {
	// Zoom is applied via CSS transform on the parent element
	// This is handled in the component itself
}
