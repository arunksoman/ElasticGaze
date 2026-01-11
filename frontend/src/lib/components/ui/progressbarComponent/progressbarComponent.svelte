<script lang="ts">
	/**
	 * Progress Bar Component
	 * A lightweight, accessible progress bar that represents progress as a percentage
	 * and can change color dynamically based on progress thresholds
	 */

	import type { ProgressBarProps } from './progressbarComponent.types';
	import {
		getDefaultColorRules,
		getTrackColor,
		resolveProgressColor
	} from './progressbarComponent.theme';

	// Props with defaults
	let {
		value,
		theme = 'dark',
		height = '8px',
		colorRules,
		ariaLabel = 'Progress',
		animated = true,
		class: className = ''
	}: ProgressBarProps = $props();

	/**
	 * Clamp value between 0 and 100
	 */
	const clampedValue = $derived.by(() => {
		return Math.max(0, Math.min(100, value));
	});

	/**
	 * Get active color rules (use provided or default)
	 */
	const activeColorRules = $derived.by(() => {
		return colorRules || getDefaultColorRules(theme);
	});

	/**
	 * Resolve current color based on progress value
	 */
	const currentColor = $derived.by(() => {
		return resolveProgressColor(clampedValue, activeColorRules, theme);
	});

	/**
	 * Calculate fill width as percentage string
	 */
	const fillWidth = $derived.by(() => {
		return `${clampedValue}%`;
	});

	/**
	 * Get track background color
	 */
	const trackColor = $derived.by(() => {
		return getTrackColor(theme);
	});

	/**
	 * Format height value
	 */
	const heightValue = $derived.by(() => {
		return typeof height === 'number' ? `${height}px` : height;
	});
</script>

<div
	class="relative w-full overflow-hidden {className}"
	style="height: {heightValue}; border-radius: var(--radius-field);"
	role="progressbar"
	aria-valuenow={clampedValue}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-label={ariaLabel}
>
	<div
		class="absolute inset-0 w-full h-full"
		style="background-color: {trackColor};"
	>
		<div
			class="h-full {animated ? 'transition-all duration-300 ease-in-out' : ''}"
			style="width: {fillWidth}; background-color: {currentColor}; border-radius: var(--radius-field);"
		></div>
	</div>
</div>
