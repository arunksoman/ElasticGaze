/**
 * Markdown Form Component Types
 * 
 * Type definitions for the Markdown Form component.
 */

export type MarkdownFormTheme = "light" | "dark";

export type MarkdownFormMode = "edit" | "preview";

/**
 * Props for the MarkdownForm component
 */
export interface MarkdownFormProps {
	/** Markdown content */
	value: string;

	/** Change handler */
	onChange?: (value: string) => void;

	/** Application theme */
	theme: MarkdownFormTheme;

	/** Accessible label for textarea */
	ariaLabel?: string;

	/** Placeholder text */
	placeholder?: string;

	/** Start in preview mode */
	defaultPreview?: boolean;

	/** Callback when preview mode is entered */
	onPreviewOpen?: () => void;

	/** Callback when edit mode is entered */
	onEditOpen?: () => void;

	/** Custom class name */
	class?: string;

	/** Minimum height for textarea */
	minHeight?: string;
}

/**
 * Internal state for the component
 */
export interface MarkdownFormState {
	mode: MarkdownFormMode;
	isFocused: boolean;
}
