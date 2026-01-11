/**
 * Progress Bar Component Types
 * Defines all public props and internal types for the Progress Bar component
 */

/**
 * Theme variants supported by the progress bar
 */
export type ProgressBarTheme = 'light' | 'dark';

/**
 * Color rule for dynamic progress bar coloring
 * Each rule defines a range (min-max) and the color to apply when progress falls within that range
 */
export type ProgressColorRule = {
	/** Minimum percentage (inclusive) */
	min: number;

	/** Maximum percentage (inclusive) */
	max: number;

	/** CSS color value or theme token */
	color: string;
};

/**
 * Main props interface for the Progress Bar component
 */
export interface ProgressBarProps {
	/**
	 * Progress value (0–100)
	 * Values outside this range will be clamped
	 */
	value: number;

	/**
	 * Application theme
	 * @default 'dark'
	 */
	theme?: ProgressBarTheme;

	/**
	 * Height of the progress bar
	 * Can be a number (pixels) or a CSS string value
	 * @default '8px'
	 */
	height?: number | string;

	/**
	 * Optional color rules based on progress percentage
	 * If not provided, default rules will be used
	 */
	colorRules?: ProgressColorRule[];

	/**
	 * Accessible label for screen readers
	 * @default 'Progress'
	 */
	ariaLabel?: string;

	/**
	 * Whether to animate value changes
	 * @default true
	 */
	animated?: boolean;

	/**
	 * Custom CSS class for the container
	 */
	class?: string;
}

/**
 * Internal state type for the component
 */
export interface ProgressBarState {
	/** Clamped progress value (0-100) */
	clampedValue: number;

	/** Currently active color based on rules */
	currentColor: string;

	/** Formatted width percentage */
	fillWidth: string;
}
