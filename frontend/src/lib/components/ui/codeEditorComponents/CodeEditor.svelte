<script lang="ts">
	/**
	 * CodeEditor Component
	 * 
	 * A reusable, accessible code editor built with CodeMirror 6.
	 * Features:
	 * - JSON syntax highlighting
	 * - Per-instance zoom controls (Ctrl+/-, Ctrl+0)
	 * - Theme switching (dark/light/auto)
	 * - Read-only mode
	 * - Code folding and autocomplete
	 * - Line numbers
	 * - Full keyboard accessibility
	 * - Temporary zoom indicator
	 */
	
	import { onMount, onDestroy } from 'svelte';
	import { EditorView } from '@codemirror/view';
	import { createCodeMirrorEditor, updateValue } from './useCodeMirror';
	import type { Snippet } from 'svelte';

	interface Props {
		value?: string;
		language?: 'json';
		readOnly?: boolean;
		placeholder?: string;
		tabSize?: number;
		lineWrapping?: boolean;
		showLineNumbers?: boolean;
		minHeight?: string;
		maxHeight?: string;
		theme?: 'auto' | 'light' | 'dark';
		onchange?: (value: string) => void;
		onfocus?: () => void;
		onblur?: () => void;
	}

	let {
		value = $bindable(''),
		language = 'json',
		readOnly = false,
		placeholder = '',
		tabSize = 2,
		lineWrapping = true,
		showLineNumbers = true,
		minHeight = '200px',
		maxHeight = undefined,
		theme = 'auto',
		onchange,
		onfocus,
		onblur,
	}: Props = $props();

	let editorContainer: HTMLDivElement;
	let editorView: EditorView | null = null;
	let zoomLevel = $state(100);
	let showZoomIndicator = $state(false);
	let zoomTimeout: ReturnType<typeof setTimeout> | null = null;
	let currentTheme = $state<'dark' | 'light'>('dark');
	let previousReadOnly = $state(readOnly);
	let previousTheme = $state(theme);
	let isInitialized = $state(false);

	/**
	 * Detect current app theme
	 */
	function detectTheme(): 'dark' | 'light' {
		if (theme !== 'auto') {
			return theme;
		}
		const html = document.documentElement;
		return html.classList.contains('light-theme') ? 'light' : 'dark';
	}

	/**
	 * Handle zoom level changes
	 */
	function handleZoomChange(newZoom: number) {
		zoomLevel = newZoom;
		showZoomIndicator = true;

		// Clear existing timeout
		if (zoomTimeout) {
			clearTimeout(zoomTimeout);
		}

		// Hide indicator after 1.5 seconds
		zoomTimeout = setTimeout(() => {
			showZoomIndicator = false;
		}, 1500);

		// Recreate editor with new zoom level
		if (editorView && editorContainer) {
			const currentValue = editorView.state.doc.toString();
			// Store cursor position
			const cursorPos = editorView.state.selection.main.head;
			
			editorView.destroy();
			initializeEditor(currentValue);
			
			// Restore focus and cursor position after a brief delay
			setTimeout(() => {
				if (editorView) {
					editorView.focus();
					// Restore cursor position
					editorView.dispatch({
						selection: { anchor: cursorPos, head: cursorPos }
					});
				}
			}, 10);
		}
	}

	/**
	 * Initialize CodeMirror editor
	 */
	function initializeEditor(initialValue: string = value) {
		if (!editorContainer) return;

		currentTheme = detectTheme();

		editorView = createCodeMirrorEditor({
			parent: editorContainer,
			value: initialValue,
			onChange: (newValue) => {
				value = newValue;
				if (onchange) {
					onchange(newValue);
				}
			},
			onFocus: () => {
				if (onfocus) onfocus();
			},
			onBlur: () => {
				if (onblur) onblur();
			},
			readOnly,
			tabSize,
			lineWrapping,
			showLineNumbers,
			placeholder,
			theme: currentTheme,
			zoomLevel,
			onZoomChange: handleZoomChange,
		});
	}

	/**
	 * Watch for theme changes in the DOM
	 */
	function setupThemeObserver() {
		if (theme === 'auto') {
			const observer = new MutationObserver(() => {
				const newTheme = detectTheme();
				if (newTheme !== currentTheme && editorView && editorContainer) {
					currentTheme = newTheme;
					const currentValue = editorView.state.doc.toString();
					editorView.destroy();
					initializeEditor(currentValue);
				}
			});

			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ['class'],
			});

			return () => observer.disconnect();
		}
		return () => {};
	}

	/**
	 * Update editor when value changes externally
	 */
	$effect(() => {
		// Track value changes
		const newValue = value;
		if (editorView && isInitialized && newValue !== editorView.state.doc.toString()) {
			updateValue(editorView, newValue);
		}
	});

	/**
	 * Update editor when readOnly changes
	 */
	$effect(() => {
		// Track readOnly changes
		const isReadOnly = readOnly;
		if (isInitialized && isReadOnly !== previousReadOnly && editorView && editorContainer) {
			previousReadOnly = isReadOnly;
			const currentValue = editorView.state.doc.toString();
			editorView.destroy();
			initializeEditor(currentValue);
		}
	});

	/**
	 * Update editor when theme prop changes
	 */
	$effect(() => {
		// Track theme changes
		const currentThemeProp = theme;
		if (isInitialized && currentThemeProp !== previousTheme && currentThemeProp !== 'auto' && editorView && editorContainer) {
			previousTheme = currentThemeProp;
			const newTheme = currentThemeProp;
			if (newTheme !== currentTheme) {
				currentTheme = newTheme;
				const currentValue = editorView.state.doc.toString();
				editorView.destroy();
				initializeEditor(currentValue);
			}
		}
	});

	/**
	 * Handle keyboard events on the wrapper for zoom
	 */
	function handleWrapperKeyDown(event: KeyboardEvent) {
		// Check if Ctrl is pressed (or Cmd on Mac)
		const isModifier = event.ctrlKey || event.metaKey;
		
		if (isModifier) {
			// Handle zoom controls
			if (event.key === '+' || event.key === '=') {
				event.preventDefault();
				handleZoomChange(Math.min(zoomLevel + 10, 200));
			} else if (event.key === '-') {
				event.preventDefault();
				handleZoomChange(Math.max(zoomLevel - 10, 50));
			} else if (event.key === '0') {
				event.preventDefault();
				handleZoomChange(100);
			}
		}
	}

	/**
	 * Prevent browser zoom when editor is focused
	 */
	function handleKeyDown(event: KeyboardEvent) {
		// Check if Ctrl is pressed (or Cmd on Mac)
		const isModifier = event.ctrlKey || event.metaKey;
		
		// Check if the event target is within the editor
		const targetElement = event.target as HTMLElement;
		const isInEditor = editorContainer?.contains(targetElement);
		
		if (isModifier && isInEditor) {
			// Prevent browser zoom for +, -, =, 0
			if (event.key === '+' || event.key === '=' || event.key === '-' || event.key === '0') {
				event.preventDefault();
			}
		}
	}

	onMount(() => {
		initializeEditor();
		isInitialized = true;
		const cleanupObserver = setupThemeObserver();
		
		// Add global keydown listener to prevent browser zoom
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			cleanupObserver();
			window.removeEventListener('keydown', handleKeyDown);
			if (zoomTimeout) {
				clearTimeout(zoomTimeout);
			}
		};
	});

	onDestroy(() => {
		if (editorView) {
			editorView.destroy();
		}
		if (zoomTimeout) {
			clearTimeout(zoomTimeout);
		}
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div 
	class="code-editor-wrapper relative"
	style="
		min-height: {minHeight};
		{maxHeight ? `max-height: ${maxHeight};` : ''}
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
		background-color: var(--color-base-100);
		overflow: hidden;
	"
	role="application"
	aria-label="Code editor with zoom controls"
	tabindex="0"
	onkeydown={handleWrapperKeyDown}
>
	<!-- Read-only indicator -->
	{#if readOnly}
		<div 
			class="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded z-10"
			style="
				background-color: var(--color-warning);
				color: var(--color-warning-content);
			"
			aria-live="polite"
		>
			Read-only
		</div>
	{/if}

	<!-- Zoom indicator -->
	{#if showZoomIndicator}
		<div 
			class="absolute top-2 right-2 px-3 py-1 text-sm font-medium rounded shadow-lg z-20 transition-opacity"
			style="
				background-color: var(--color-accent);
				color: var(--color-accent-content);
				opacity: {showZoomIndicator ? '1' : '0'};
			"
			aria-live="polite"
			aria-atomic="true"
		>
			Zoom: {zoomLevel}%
		</div>
	{/if}

	<!-- Editor container -->
	<div 
		bind:this={editorContainer}
		class="code-editor-container"
		style="
			height: 100%;
			overflow: auto;
		"
	></div>
</div>

<style>
	.code-editor-wrapper {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.code-editor-container {
		flex: 1;
		overflow: auto;
	}

	/* Ensure proper scrolling */
	.code-editor-container :global(.cm-editor) {
		height: 100%;
	}

	.code-editor-container :global(.cm-scroller) {
		overflow: auto;
	}

	/* Focus ring */
	.code-editor-wrapper:focus-within {
		outline: 1px solid var(--color-neutral-content);
		outline-offset: 2px;
	}

	/* Zoom indicator animation */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.code-editor-wrapper > div[aria-live] {
		animation: fadeIn 0.2s ease-out;
	}
</style>
