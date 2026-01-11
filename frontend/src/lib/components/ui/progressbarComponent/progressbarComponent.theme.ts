/**
 * Progress Bar Theme Configuration
 * Defines theme tokens and default color mappings
 */

import type { ProgressColorRule, ProgressBarTheme } from './progressbarComponent.types';

/**
 * Theme-specific color tokens for progress bar
 */
export const progressBarThemeColors = {
	light: {
		track: 'var(--color-base-200)',
		error: 'var(--color-error)',
		warning: 'var(--color-warning)',
		success: 'var(--color-success)',
		info: 'var(--color-info)',
		primary: 'var(--color-primary)'
	},
	dark: {
		track: 'var(--color-base-200)',
		error: 'var(--color-error)',
		warning: 'var(--color-warning)',
		success: 'var(--color-success)',
		info: 'var(--color-info)',
		primary: 'var(--color-primary)'
	}
} as const;

/**
 * Get track background color based on theme
 */
export function getTrackColor(theme: ProgressBarTheme): string {
	return progressBarThemeColors[theme].track;
}

/**
 * Default color rules for progress bar
 * These rules define color transitions based on progress percentage
 */
export function getDefaultColorRules(theme: ProgressBarTheme): ProgressColorRule[] {
	const colors = progressBarThemeColors[theme];

	return [
		{
			min: 0,
			max: 39,
			color: colors.error
		},
		{
			min: 40,
			max: 69,
			color: colors.warning
		},
		{
			min: 70,
			max: 100,
			color: colors.success
		}
	];
}

/**
 * Resolve the appropriate color based on progress value and color rules
 */
export function resolveProgressColor(
	value: number,
	rules: ProgressColorRule[],
	theme: ProgressBarTheme
): string {
	// Find the first matching rule
	const matchingRule = rules.find((rule) => value >= rule.min && value <= rule.max);

	// Return matching rule color or fallback to primary
	return matchingRule?.color || progressBarThemeColors[theme].primary;
}
