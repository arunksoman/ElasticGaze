# Modal Component

A fully accessible, themeable modal/dialog component for Svelte 5 applications.

## Overview

The Modal component follows the WAI-ARIA dialog pattern and provides a complete solution for displaying modal dialogs with support for:
- Focus trapping
- Keyboard navigation (ESC to close, Tab/Shift+Tab cycling)
- Body scroll locking
- Multiple sizes and animations
- Backdrop click to close
- Persistent mode (prevent closing)
- Full theme integration with CSS variables

## Design Philosophy

- **Flat Design**: Uses `--radius-box` (0rem by default) for a modern, non-curvy look
- **Themeable**: All colors derived from CSS variables in `app.css` - works seamlessly with light/dark themes
- **Accessible**: Full keyboard support, ARIA attributes, focus management
- **Flexible**: Composable with slots or use the all-in-one component

## Components

### Modal.svelte
Main modal wrapper with all functionality built-in.

### ModalHeader.svelte
Optional standalone header component with close button.

### ModalBody.svelte
Optional standalone body wrapper with custom scrollbar styling.

### ModalFooter.svelte
Optional standalone footer component for action buttons.

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls modal visibility (supports `bind:`) |
| `title` | `string` | `undefined` | Modal title (used for `aria-labelledby`) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'` | `'md'` | Modal width/height |
| `closable` | `boolean` | `true` | Whether modal can be closed |
| `backdrop` | `boolean` | `true` | Show translucent backdrop |
| `centered` | `boolean` | `true` | Vertically center modal |
| `persistent` | `boolean` | `false` | Prevent closing via ESC/backdrop click |
| `zIndex` | `number` | `50` | Stacking order for nested modals |
| `animation` | `'fade' \| 'scale' \| 'slide' \| 'none'` | `'scale'` | Opening/closing animation |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | ARIA role |

---

## Slots

| Slot | Description |
|------|-------------|
| `header` | Custom header content (includes close button if `closable=true`) |
| `default` | Main body content |
| `footer` | Footer content (typically action buttons) |

---

## Events

| Event | Description |
|-------|-------------|
| `onclose` | Fired when modal closes |
| `onopen` | Fired when modal opens |

---

## Size Reference

| Size | Max Width | Use Case |
|------|-----------|----------|
| `sm` | 384px | Small dialogs, confirmations |
| `md` | 448px | Standard modals |
| `lg` | 512px | Forms, content-heavy dialogs |
| `xl` | 576px | Large forms, multi-step wizards |
| `fullscreen` | 100% | Immersive experiences |

---

## Usage Examples

### Basic Modal

```svelte
<script>
  import Modal from '$lib/components/ui/modalComponents/Modal.svelte';
  let open = $state(false);
</script>

<button onclick={() => open = true}>Open Modal</button>

<Modal bind:open title="Simple Modal">
  <p>This is a basic modal with a title.</p>
</Modal>
```

### With Custom Header and Footer

```svelte
<script>
  import Modal from '$lib/components/ui/modalComponents/Modal.svelte';
  let open = $state(false);
  
  function handleDelete() {
    console.log('Deleting...');
    open = false;
  }
</script>

<Modal bind:open title="Confirm Delete">
  {#snippet header()}
    <h2 class="text-lg font-bold text-(--color-error)">⚠️ Confirm Delete</h2>
  {/snippet}

  <p>Are you sure you want to delete this item? This action cannot be undone.</p>

  {#snippet footer()}
    <button
      class="px-4 py-2 bg-(--color-base-200) text-(--color-base-content) rounded hover:bg-(--color-base-300)"
      onclick={() => open = false}
    >
      Cancel
    </button>
    <button
      class="px-4 py-2 bg-(--color-error) text-(--color-error-content) rounded hover:opacity-90"
      onclick={handleDelete}
    >
      Delete
    </button>
  {/snippet}
</Modal>
```

### Different Sizes

```svelte
<Modal bind:open size="sm" title="Small Modal">
  <p>This is a small modal.</p>
</Modal>

<Modal bind:open size="lg" title="Large Modal">
  <p>This is a large modal with more content space.</p>
</Modal>

<Modal bind:open size="fullscreen" title="Fullscreen Modal">
  <p>This modal takes up the entire viewport.</p>
</Modal>
```

### Persistent Modal (Cannot Close)

```svelte
<Modal bind:open persistent title="Important Notice">
  <p>You must take action before continuing.</p>
  
  {#snippet footer()}
    <button onclick={() => open = false}>I Understand</button>
  {/snippet}
</Modal>
```

### With Animations

```svelte
<Modal bind:open animation="fade" title="Fade In">
  <p>Smooth fade animation.</p>
</Modal>

<Modal bind:open animation="slide" title="Slide In">
  <p>Slides in from top.</p>
</Modal>

<Modal bind:open animation="scale" title="Scale In">
  <p>Scales from 95% to 100%.</p>
</Modal>
```

### Using Subcomponents

```svelte
<script>
  import Modal from '$lib/components/ui/modalComponents/Modal.svelte';
  import ModalHeader from '$lib/components/ui/modalComponents/ModalHeader.svelte';
  import ModalBody from '$lib/components/ui/modalComponents/ModalBody.svelte';
  import ModalFooter from '$lib/components/ui/modalComponents/ModalFooter.svelte';
  
  let open = $state(false);
</script>

<Modal bind:open>
  {#snippet header()}
    <ModalHeader title="Custom Modal" closable onclose={() => open = false} />
  {/snippet}

  <ModalBody>
    <p>Content goes here</p>
  </ModalBody>

  {#snippet footer()}
    <ModalFooter>
      <button onclick={() => open = false}>Close</button>
    </ModalFooter>
  {/snippet}
</Modal>
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `ESC` | Close modal (unless `persistent=true`) |
| `Tab` | Move focus to next focusable element |
| `Shift+Tab` | Move focus to previous focusable element |

### ARIA Attributes

- `role="dialog"` or `"alertdialog"` - Identifies the modal
- `aria-modal="true"` - Indicates modal behavior
- `aria-labelledby` - References the title element
- `aria-label` on close button - "Close modal"

### Focus Management

1. When modal opens:
   - Previous focus is stored
   - Body scroll is locked
   - Focus moves to first focusable element

2. While open:
   - Focus is trapped within modal
   - Tab cycles through focusable elements
   - Shift+Tab cycles backwards

3. When modal closes:
   - Focus returns to previously focused element
   - Body scroll is restored

---

## Theming

The Modal uses CSS variables from `app.css` exclusively:

### Colors
- Background: `--color-base-100`
- Text: `--color-base-content`
- Border: `--color-base-300`
- Backdrop: `--color-base-300` at 60% opacity
- Hover states: `--color-base-200`
- Primary accent: `--color-primary`
- Error states: `--color-error` / `--color-error-content`

### Border Radius
- Container: `--radius-box` (0rem for flat design)
- Buttons: Can use `--radius-field` or custom

### Scrollbar
- Track: Transparent
- Thumb: `--color-base-300`
- Thumb hover: `--color-primary`

### Example: Custom Themed Modal

```svelte
<Modal 
  bind:open 
  title="Themed Modal"
  size="lg"
  animation="scale"
>
  <div class="space-y-4">
    <p class="text-(--color-base-content)">
      This modal automatically adapts to your theme.
    </p>
    
    <div class="p-4 bg-(--color-primary) text-(--color-primary-content) rounded">
      Primary colored section
    </div>
    
    <div class="p-4 bg-(--color-secondary) text-(--color-secondary-content) rounded">
      Secondary colored section
    </div>
  </div>
  
  {#snippet footer()}
    <button class="px-4 py-2 bg-(--color-success) text-(--color-success-content) rounded">
      Confirm
    </button>
  {/snippet}
</Modal>
```

---

## Advanced Features

### Nested Modals

```svelte
<script>
  let modal1Open = $state(false);
  let modal2Open = $state(false);
</script>

<Modal bind:open={modal1Open} title="First Modal" zIndex={50}>
  <p>This is the first modal.</p>
  <button onclick={() => modal2Open = true}>Open Second Modal</button>
</Modal>

<Modal bind:open={modal2Open} title="Second Modal" zIndex={60}>
  <p>This modal appears on top.</p>
</Modal>
```

### Programmatic Control

```svelte
<script>
  let open = $state(false);
  
  function openModal() {
    open = true;
  }
  
  function closeModal() {
    open = false;
  }
  
  // Open after 2 seconds
  setTimeout(openModal, 2000);
</script>

<Modal 
  bind:open 
  title="Auto-opened Modal"
  onclose={() => console.log('Modal closed')}
  onopen={() => console.log('Modal opened')}
>
  <p>This modal was opened programmatically.</p>
</Modal>
```

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch-friendly interactions

---

## Performance Notes

- Body scroll lock includes scrollbar width compensation
- Focus trap uses efficient querySelectorAll with caching
- Animations use CSS transforms for GPU acceleration
- Backdrop uses `backdrop-filter: blur(2px)` for modern browsers

---

## Common Patterns

### Form Modal

```svelte
<Modal bind:open title="Create Account" size="lg">
  <form class="space-y-4">
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" class="w-full p-2 border rounded" />
    </div>
    <div>
      <label for="email">Email</label>
      <input id="email" type="email" class="w-full p-2 border rounded" />
    </div>
  </form>
  
  {#snippet footer()}
    <button onclick={() => open = false}>Cancel</button>
    <button class="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded">
      Submit
    </button>
  {/snippet}
</Modal>
```

### Alert Dialog

```svelte
<Modal 
  bind:open 
  role="alertdialog" 
  persistent 
  size="sm"
  title="Error"
>
  <p class="text-(--color-error)">An error occurred. Please try again.</p>
  
  {#snippet footer()}
    <button onclick={() => open = false}>OK</button>
  {/snippet}
</Modal>
```

---

## Tips

1. **Use `bind:open`** for two-way binding to control modal state
2. **Use `persistent` mode** for critical actions that require user response
3. **Nest modals carefully** - use different `zIndex` values
4. **Keep content accessible** - ensure sufficient color contrast
5. **Test keyboard navigation** - all interactive elements should be focusable
6. **Use appropriate `role`** - `alertdialog` for critical alerts, `dialog` for general use

---

## License

Part of the ElasticGaze component library.
