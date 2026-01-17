# Collapsible Component

A flexible, accessible collapsible/accordion component for SvelteKit with smooth animations using Tailwind CSS.

## Features

- ✅ **Controlled & Uncontrolled modes**
- ✅ **Vertical & Horizontal collapse directions**
- ✅ **Smooth slide animations** (height/width based)
- ✅ **Fully keyboard accessible** (Enter/Space support)
- ✅ **Accordion composition** via parent state coordination
- ✅ **Integrates with Card component**
- ✅ **Tailwind CSS styling only**
- ✅ **TypeScript support**

## Installation

The component is located at:
```
$lib/components/ui/collapsibleComponent/
```

Import it:
```ts
import { CollapsibleComponent } from '$lib/components/ui/collapsibleComponent';
```

## Basic Usage

### Uncontrolled Mode (Default)

The component manages its own state:

```svelte
<script>
	import { CollapsibleComponent } from '$lib/components/ui/collapsibleComponent';
	import { Card } from '$lib/components/ui/Card';
</script>

<CollapsibleComponent>
	{#snippet trigger()}
		<div class="p-4 bg-base-200 rounded-lg">
			<h3>Click to expand</h3>
		</div>
	{/snippet}
	
	{#snippet children()}
		<Card padding="md">
			<p>This is the collapsible content!</p>
		</Card>
	{/snippet}
</CollapsibleComponent>
```

### Controlled Mode

You control the open state externally:

```svelte
<script>
	import { CollapsibleComponent } from '$lib/components/ui/collapsibleComponent';
	let isOpen = $state(false);
</script>

<CollapsibleComponent
	bind:open={isOpen}
	onOpenChange={(state) => console.log('Open:', state)}
>
	{#snippet trigger()}
		<button>Toggle ({isOpen ? 'Open' : 'Closed'})</button>
	{/snippet}
	
	{#snippet children()}
		<div class="p-4">Content here</div>
	{/snippet}
</CollapsibleComponent>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controlled open state (bindable) |
| `defaultOpen` | `boolean` | `false` | Initial state in uncontrolled mode |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when state changes |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Collapse direction |
| `animationDuration` | `'fast' \| 'normal' \| 'slow'` | `'normal'` | Animation speed (150ms/300ms/500ms) |
| `noAnimation` | `boolean` | `false` | Disable animations |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `triggerClass` | `string` | `''` | Additional classes for trigger |
| `contentClass` | `string` | `''` | Additional classes for content wrapper |
| `accordion` | `boolean` | `false` | Enable accordion behavior |
| `accordionKey` | `string` | `undefined` | Unique key for accordion items |

## Advanced Usage

### Horizontal Collapse

```svelte
<CollapsibleComponent direction="horizontal">
	{#snippet trigger()}
		<button>Toggle Sidebar</button>
	{/snippet}
	
	{#snippet children()}
		<div class="w-64 p-4">Sidebar content</div>
	{/snippet}
</CollapsibleComponent>
```

### Default Open State

```svelte
<CollapsibleComponent defaultOpen={true}>
	<!-- Starts expanded -->
</CollapsibleComponent>
```

### Custom Animation Speed

```svelte
<CollapsibleComponent animationDuration="slow">
	<!-- Slower 500ms animation -->
</CollapsibleComponent>

<CollapsibleComponent animationDuration="fast">
	<!-- Faster 150ms animation -->
</CollapsibleComponent>
```

### Disable Animations

```svelte
<CollapsibleComponent noAnimation={true}>
	<!-- Instant toggle, no animation -->
</CollapsibleComponent>
```

## Accordion Composition

To create an accordion (only one item open at a time), coordinate state in a parent component:

```svelte
<script>
	import { CollapsibleComponent } from '$lib/components/ui/collapsibleComponent';
	
	let activeKey = $state<string | null>(null);
	
	const items = [
		{ key: 'item-1', title: 'Section 1', content: 'Content 1' },
		{ key: 'item-2', title: 'Section 2', content: 'Content 2' },
		{ key: 'item-3', title: 'Section 3', content: 'Content 3' }
	];
</script>

<div class="space-y-2">
	{#each items as item}
		<CollapsibleComponent
			open={activeKey === item.key}
			onOpenChange={(isOpen) => {
				activeKey = isOpen ? item.key : null;
			}}
		>
			{#snippet trigger()}
				<div class="p-4 bg-base-200 rounded-lg cursor-pointer">
					<h3>{item.title}</h3>
				</div>
			{/snippet}
			
			{#snippet children()}
				<Card padding="md">
					<p>{item.content}</p>
				</Card>
			{/snippet}
		</CollapsibleComponent>
	{/each}
</div>
```

## Integration with Card Component

The collapsible content area works seamlessly with the Card component:

```svelte
<CollapsibleComponent>
	{#snippet trigger()}
		<Card clickable={true} padding="md">
			<h3>Expandable Card</h3>
		</Card>
	{/snippet}
	
	{#snippet children()}
		<Card variant="outlined" padding="lg">
			<p>Additional details that expand below the card</p>
		</Card>
	{/snippet}
</CollapsibleComponent>
```

## Keyboard Accessibility

The component is fully keyboard accessible:

- **Focus**: Tab to the trigger element
- **Activate**: Press `Enter` or `Space` to toggle
- **Disabled state**: Cannot be focused or activated when disabled

### ARIA Attributes

The component uses proper ARIA attributes for screen reader support:

- `role="button"` on trigger
- `aria-expanded` reflects open/closed state
- `aria-controls` links trigger to content
- `aria-labelledby` links content to trigger
- `aria-hidden` on content when collapsed
- `aria-disabled` when disabled

## Styling

The component uses only Tailwind CSS classes. You can customize via:

1. **Props**:
   - `triggerClass` - Add classes to the trigger wrapper
   - `contentClass` - Add classes to the content wrapper
   - `class` - Add classes to the root container

2. **CSS Variables** (from theme):
   - `--color-base-*` - Background colors
   - `--color-accent` - Focus outline color
   - `--radius-selector` - Border radius

### Example Custom Styling

```svelte
<CollapsibleComponent
	triggerClass="hover:bg-base-300 rounded-lg"
	contentClass="mt-2"
>
	<!-- Your content -->
</CollapsibleComponent>
```

## TypeScript Support

Full TypeScript definitions are available:

```ts
import type {
	CollapsibleProps,
	CollapseDirection,
	AnimationDuration
} from '$lib/components/ui/collapsibleComponent';
```

## Examples

See the demo page for interactive examples:
```
/demo/collapsible
```

The demo showcases:
- Basic uncontrolled usage
- Controlled mode with external state
- Horizontal collapse
- Accordion behavior
- Card integration
- Keyboard navigation

## Browser Support

Works in all modern browsers that support:
- CSS transitions
- CSS `max-height` and `width` properties
- Svelte 5 runes

## Performance Notes

- Animations use `max-height`/`width` transitions (GPU-accelerated)
- Content size is measured on mount and when content changes
- `will-change` CSS property optimizes animation performance
- No layout thrashing or forced reflows during animation

## Accessibility Notes

- Always provide meaningful trigger content
- Ensure sufficient color contrast
- Test with keyboard navigation
- Test with screen readers
- Consider `prefers-reduced-motion` for users who prefer no animations

## Common Patterns

### FAQ Section

```svelte
{#each faqs as faq}
	<CollapsibleComponent>
		{#snippet trigger()}
			<button class="w-full text-left p-4 bg-base-200 rounded">
				{faq.question}
			</button>
		{/snippet}
		{#snippet children()}
			<div class="p-4">{faq.answer}</div>
		{/snippet}
	</CollapsibleComponent>
{/each}
```

### Expandable Table Rows

```svelte
<table>
	{#each rows as row}
		<tr>
			<td colspan="100%">
				<CollapsibleComponent>
					{#snippet trigger()}
						<div class="flex items-center gap-2">
							<span>{row.name}</span>
						</div>
					{/snippet}
					{#snippet children()}
						<Card>
							<p>{row.details}</p>
						</Card>
					{/snippet}
				</CollapsibleComponent>
			</td>
		</tr>
	{/each}
</table>
```

## Troubleshooting

### Content not animating smoothly

- Ensure content has a defined height/width
- Check that `noAnimation` is not set to `true`
- Verify Tailwind transition classes are properly configured

### Keyboard events not working

- Ensure trigger is focusable (not disabled)
- Check that `tabindex` is not set to `-1`
- Verify no other keyboard event listeners are preventing default

### Accordion items not closing

- Verify you're using controlled mode with `open` prop
- Check that parent state updates correctly
- Ensure each item has a unique `accordionKey`

## License

Part of the Elasticgaze UI component library.
