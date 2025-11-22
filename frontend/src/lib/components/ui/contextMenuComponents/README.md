# Context Menu Component System

A fully accessible, themeable context menu component system for Svelte 5 that provides keyboard navigation, typeahead search, and comprehensive ARIA support.

## Overview

This context menu system follows WAI-ARIA Menu design patterns and provides:

- **Full Accessibility**: ARIA menu pattern with `aria-activedescendant` focus management
- **Keyboard Navigation**: Complete keyboard support including typeahead search
- **Theming**: Uses app.css CSS variables for consistent styling
- **Flexible Structure**: Supports individual items, groups, dividers, and custom layouts
- **TypeScript**: Full type safety with comprehensive interfaces
- **Svelte 5**: Built with the latest Svelte runes syntax and callback props

## Components

### `ContextMenu.svelte`

The root menu container that manages positioning, keyboard navigation, and overall menu behavior.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ContextMenuItemData[]` | `[]` | Array of menu items to render |
| `open` | `boolean` | `false` | Controls menu visibility (bindable) |
| `position` | `{x: number, y: number}` | `{x: 0, y: 0}` | Menu screen coordinates |
| `grouped` | `boolean` | `false` | Whether to render items in groups |
| `typeahead` | `boolean` | `true` | Enable type-to-focus functionality |
| `maxHeight` | `string` | `'300px'` | Maximum menu height (scrollable) |
| `autoClose` | `boolean` | `true` | Auto-close when item is selected |

#### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onselect` | `(item: ContextMenuItemData) => void` | Called when a menu item is selected |
| `onclose` | `() => void` | Called when menu is closed |
| `onopen` | `() => void` | Called when menu is opened |
| `onkeydown` | `(event: KeyboardEvent) => void` | Called for custom keyboard event handling |

#### Usage

```svelte
<script>
  import ContextMenu from '$lib/components/ui/contextMenuComponents/ContextMenu.svelte';
  
  let open = false;
  let position = { x: 0, y: 0 };
  
  const items = [
    { id: '1', label: 'New File', icon: '📄', shortcut: 'Ctrl+N' },
    { id: '2', label: 'Open...', icon: '📁', shortcut: 'Ctrl+O' },
    { id: '3', divider: true },
    { id: '4', label: 'Delete', icon: '🗑️', disabled: true }
  ];
  
  function handleContextMenu(event) {
    event.preventDefault();
    position = { x: event.clientX, y: event.clientY };
    open = true;
  }
  
  function handleSelect(item) {
    console.log('Selected:', item);
  }
</script>

<div on:contextmenu={handleContextMenu}>
  Right-click here
</div>

<ContextMenu
  bind:open
  {position}
  {items}
  onselect={handleSelect}
/>
```

### `ContextMenuItem.svelte`

Individual menu items with support for icons, shortcuts, and disabled states.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique item identifier (required) |
| `label` | `string` | - | Item display text (required) |
| `icon` | `string` | - | IconPark SVG or HTML string |
| `shortcut` | `string` | - | Keyboard shortcut hint |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `divider` | `boolean` | `false` | Render as horizontal divider |
| `customClass` | `string` | `''` | Additional CSS classes |

#### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onselect` | `(item: ContextMenuItemData) => void` | Called when item is clicked/activated |

### `ContextMenuGroup.svelte`

Grouping wrapper for organizing related menu items with optional labels.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Optional group label |
| `items` | `ContextMenuItemData[]` | - | Items in this group (required) |
| `id` | `string` | - | Unique group identifier |
| `onselect` | `(item: ContextMenuItemData) => void` | - | Callback for item selection |

## TypeScript Interfaces

```typescript
export interface ContextMenuItemData {
  id: string;                    // Unique identifier
  label: string;                 // Display text
  icon?: string;                 // IconPark SVG or HTML
  shortcut?: string;             // Keyboard shortcut hint
  disabled?: boolean;            // Disabled state
  divider?: boolean;             // Render as divider
  group?: string;                // Group name (for grouped menus)
  action?: () => void;           // Optional click handler
}
```

## Keyboard Navigation

The context menu supports full keyboard navigation following WAI-ARIA guidelines:

| Key(s) | Action |
|--------|--------|
| `↑` / `↓` | Navigate between menu items |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| `PageUp` | Jump up by visible set (5 items) |
| `PageDown` | Jump down by visible set (5 items) |
| `Enter` / `Space` | Activate focused item |
| `Escape` | Close menu |
| `Tab` | Close menu (focus moves out) |
| `A-Z` | Typeahead search to matching items |

## Svelte 5 Features

### Callback Props Pattern

This component system uses Svelte 5's callback props pattern instead of the deprecated `createEventDispatcher`:

```svelte
<!-- Old Svelte 4 pattern -->
<ContextMenu on:select={handleSelect} />

<!-- New Svelte 5 pattern -->
<ContextMenu onselect={handleSelect} />
```

### Runes Reactivity

All reactive state uses Svelte 5 runes:

```javascript
let open = $state(false);
let items = $state([]);
let isActive = $derived(activeId === id);
```

## Advanced Usage

### Grouped Menus

```svelte
<script>
  const groupedItems = [
    { id: 'cut', label: 'Cut', group: 'Edit', shortcut: 'Ctrl+X' },
    { id: 'copy', label: 'Copy', group: 'Edit', shortcut: 'Ctrl+C' },
    { id: 'paste', label: 'Paste', group: 'Edit', shortcut: 'Ctrl+V' },
    { id: 'new', label: 'New File', group: 'File' },
    { id: 'open', label: 'Open File', group: 'File' },
    { id: 'props', label: 'Properties' } // Ungrouped
  ];
</script>

<ContextMenu
  items={groupedItems}
  grouped={true}
  bind:open
  {position}
  onselect={(item) => console.log('Selected:', item)}
/>
```

### Custom Actions

```svelte
<script>
  const items = [
    {
      id: 'save',
      label: 'Save File',
      shortcut: 'Ctrl+S',
      action: () => {
        // Custom save logic
        saveCurrentFile();
      }
    }
  ];
</script>
```

## Demo

See the full demo at `/demo-context-menu` which includes:

- Basic and grouped menu examples
- Keyboard navigation demonstration
- Typeahead search examples
- Accessibility testing
- Event logging with Svelte 5 callback props
- Responsive design

## Migration from Svelte 4

If upgrading from Svelte 4, update your event listeners:

```diff
<ContextMenu
  bind:open
  {position}
  {items}
- on:select={handleSelect}
- on:close={handleClose}
+ onselect={handleSelect}
+ onclose={handleClose}
/>
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- All modern browsers with ES2020 support

---

**Note**: This component follows the ElasticGaze design system and integrates seamlessly with the existing theming infrastructure. Built for Svelte 5 with modern reactivity patterns.