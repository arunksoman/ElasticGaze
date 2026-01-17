/**
 * Animation duration presets
 */
export type AnimationDuration = 'fast' | 'normal' | 'slow';

/**
 * Props for the Collapsible component
 */
export interface CollapsibleProps {
	/**
	 * Controlled open state
	 * When provided, the component operates in controlled mode
	 */
	open?: boolean;

	/**
	 * Default open state (uncontrolled mode)
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * Callback when open state changes
	 */
	onOpenChange?: (open: boolean) => void;

	/**
	 * Animation duration
	 * @default "normal"
	 */
	animationDuration?: AnimationDuration;

	/**
	 * Disable animations
	 * @default false
	 */
	noAnimation?: boolean;

	/**
	 * Whether this item participates in an accordion
	 * Used for coordination with parent accordion state
	 * @default false
	 */
	accordion?: boolean;

	/**
	 * Unique key used by accordion parent
	 * Required when accordion is true
	 */
	accordionKey?: string;

	/**
	 * Additional CSS classes for the trigger element
	 */
	triggerClass?: string;

	/**
	 * Additional CSS classes for the content wrapper
	 */
	contentClass?: string;

	/**
	 * Disable the collapsible trigger
	 * @default false
	 */
	disabled?: boolean;
}

/**
 * Context for accordion coordination
 */
export interface AccordionContext {
	/**
	 * Currently active accordion item key
	 */
	activeKey: string | null;

	/**
	 * Function to set the active accordion item
	 */
	setActiveKey: (key: string | null) => void;
}
