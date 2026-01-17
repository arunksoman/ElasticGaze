import type { AnimationDuration } from './collapsibleComponent.types';

/**
 * Get animation duration in milliseconds based on preset
 */
export function getAnimationDuration(duration: AnimationDuration = 'normal'): number {
	const durations: Record<AnimationDuration, number> = {
		fast: 150,
		normal: 300,
		slow: 500
	};
	return durations[duration];
}

/**
 * Get Tailwind transition classes based on duration
 */
export function getTransitionClasses(duration: AnimationDuration = 'normal'): string {
	const durationClass =
		duration === 'fast'
			? 'duration-150'
			: duration === 'slow'
				? 'duration-500'
				: 'duration-300';

	const easing = 'ease-in-out';

	return `transition-[max-height,opacity] ${durationClass} ${easing}`;
}

/**
 * Generate a unique ID for accessibility
 */
export function generateId(prefix: string = 'collapsible'): string {
	return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if the component is in controlled mode
 */
export function isControlled(open: boolean | undefined): boolean {
	return open !== undefined;
}

/**
 * Get the appropriate open state based on controlled/uncontrolled mode
 */
export function getOpenState(
	open: boolean | undefined,
	defaultOpen: boolean = false,
	internalOpen: boolean = false
): boolean {
	return isControlled(open) ? (open ?? false) : internalOpen ?? defaultOpen;
}
