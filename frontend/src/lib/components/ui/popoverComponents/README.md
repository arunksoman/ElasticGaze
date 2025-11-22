# Popover Component System

A comprehensive, accessible popover component system built for Svelte 5 with full keyboard navigation and WAI-ARIA compliance.

## Features

- 🎨 **Fully Themeable**: Uses CSS variables from `app.css` for consistent theming
- ♿ **Accessible**: Follows WAI-ARIA popover/dialog pattern with full keyboard support
- 🎯 **Smart Positioning**: Automatically adjusts placement to stay within viewport
- 🔧 **Flexible**: Multiple placement options with optional arrow
- ⌨️ **Keyboard Navigation**: Complete keyboard interaction support
- 🎭 **Focus Management**: Automatic focus trapping and restoration

## Components

### Popover.svelte
The main interactive popover component that combines trigger and content.

### PopoverContent.svelte
The floating content container with intelligent positioning.

### PopoverArrow.svelte
Optional flat triangle arrow that aligns automatically.

## Usage

### Basic Example

```svelte
<script>
  import { Popover } from '$lib/components/ui/popoverComponents';
  let open = false;
</script>

<Popover bind:open>
  {#snippet trigger()}
    <button>Open Popover</button>
  {/snippet}
  
  <div class="p-4">
    <h3>Popover Content</h3>
    <p>This is the popover content!</p>
  </div>
</Popover>
```

### Advanced Example

```svelte
<script>
  import { Popover } from '$lib/components/ui/popoverComponents';
  
  let open = false;
  
  function handleOpen() {
    console.log('Popover opened');
  }
  
  function handleClose() {
    console.log('Popover closed');
  }
</script>

<Popover
  bind:open
  placement="top-start"
  arrow={true}
  offset={12}
  trapFocus={true}
  closeOnOutsideClick={true}
  onopen={handleOpen}
  onclose={handleClose}
>
  {#snippet trigger()}
    <button class="btn btn-primary">
      Settings
    </button>
  {/snippet}
  
  <div class="min-w-48">
    <h3 class="font-semibold mb-2">Quick Settings</h3>
    <button class="block w-full text-left p-2 hover:bg-base-200">Profile</button>
    <button class="block w-full text-left p-2 hover:bg-base-200">Account</button>
    <button class="block w-full text-left p-2 hover:bg-base-200">Logout</button>
  </div>
</Popover>
```

## Props

### Popover.svelte Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls popover open state (bindable) |
| `placement` | `PopoverPlacement` | `'bottom'` | Where to position the popover |
| `offset` | `number` | `6` | Distance between trigger and popover |
| `arrow` | `boolean` | `false` | Show/hide arrow pointer |
| `closeOnOutsideClick` | `boolean` | `true` | Close when clicking outside |
| `closeOnEsc` | `boolean` | `true` | Close when pressing Escape |
| `trapFocus` | `boolean` | `true` | Trap focus inside popover |
| `returnFocus` | `boolean` | `true` | Return focus to trigger when closed |
| `zIndex` | `number` | `50` | CSS z-index for positioning |
| `onopen` | `function` | `undefined` | Called when popover opens |
| `onclose` | `function` | `undefined` | Called when popover closes |
| `ontoggle` | `function` | `undefined` | Called when popover state changes |
| `onkeydown` | `function` | `undefined` | Called on keydown events |
| `onclickoutside` | `function` | `undefined` | Called when clicking outside |

### Placement Options

- `'top'` | `'bottom'` | `'left'` | `'right'`
- `'top-start'` | `'top-end'`
- `'bottom-start'` | `'bottom-end'`
- `'left-start'` | `'left-end'`
- `'right-start'` | `'right-end'`

## Event Handlers

Event handlers in Svelte 5 use the new function prop syntax:

| Event Handler | Type | Description |
|---------------|------|-------------|
| `onopen` | `() => void` | Called when popover opens |
| `onclose` | `() => void` | Called when popover closes |
| `ontoggle` | `() => void` | Called when popover state changes |
| `onkeydown` | `(event: KeyboardEvent) => void` | Called on keydown events |
| `onclickoutside` | `(event: MouseEvent) => void` | Called when clicking outside |

## Keyboard Interactions

| Key | Behavior |
|-----|----------|
| **Space** / **Enter** | Open/close popover when trigger is focused |
| **Escape** | Close popover and return focus to trigger |
| **Tab** | Navigate between focusable elements inside popover |
| **Shift + Tab** | Navigate backward through focusable elements |

## Accessibility Features

- **WAI-ARIA Compliant**: Uses proper `role="dialog"`, `aria-haspopup`, `aria-expanded`
- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper labeling and state announcements

## Styling

The popover system uses CSS variables from your `app.css` theme:

```css
/* Background and content colors */
--color-base-100: /* Popover background */
--color-base-content: /* Text color */
--color-base-300: /* Border color */

/* Layout properties */
--radius-box: /* Border radius */
--border: /* Border width */
```

Only layout classes from Tailwind are used (no color classes), ensuring full theme compatibility.

## Store Usage (Optional)

```svelte
<script>
  import { createPopoverStore } from '$lib/components/ui/popoverComponents';
  
  const popoverStore = createPopoverStore();
  const { open, position, toggle, openPopover, closePopover } = popoverStore;
</script>

<button onclick={toggle}>Toggle Popover</button>

{#if $open}
  <div>Popover is open!</div>
{/if}
```

## Best Practices

1. **Use Semantic Triggers**: Use buttons or interactive elements as triggers
2. **Provide Clear Labels**: Ensure trigger elements have descriptive text
3. **Mind the Viewport**: Test positioning on different screen sizes
4. **Focus Management**: Let the component handle focus, don't override unless needed
5. **Content Structure**: Use proper heading hierarchy inside popover content

## Examples

See the demo page at `/demo-popover` for comprehensive examples and interactive testing.