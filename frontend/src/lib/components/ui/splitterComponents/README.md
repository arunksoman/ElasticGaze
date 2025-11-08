# Splitter Component

A simple, lightweight splitter component for Svelte 5 that allows users to resize panes by dragging handles.

## Features

- 🎯 **Simple & Lightweight** - No complex collapse logic, just pure resize functionality
- 🔄 **Horizontal & Vertical** - Support for both layout directions
- 📏 **Min/Max Constraints** - Set minimum and maximum sizes for panes
- 💾 **Persistent Layouts** - Save and restore layouts using localStorage
- 📱 **Responsive** - Automatically adjusts on window resize
- 🎨 **Themeable** - Uses CSS variables from your app theme

## Installation

The component is already installed in this project. Import it from:

```typescript
import Splitter from '$lib/components/ui/splitterComponents/Splitter.svelte';
import SplitterPane from '$lib/components/ui/splitterComponents/SplitterPane.svelte';
```

## Basic Usage

### Horizontal Layout

```svelte
<script lang="ts">
  import Splitter from '$lib/components/ui/splitterComponents/Splitter.svelte';
  import SplitterPane from '$lib/components/ui/splitterComponents/SplitterPane.svelte';

  let splitterRef: any = $state(null);

  function handleResize(sizes: number[]) {
    console.log('New sizes:', sizes);
  }
</script>

<Splitter
  bind:this={splitterRef}
  direction="horizontal"
  gutterSize={8}
  minSize={[150, 200, 150]}
  initialSizes={[1, 2, 1]}
  storageKey="my-splitter"
  onresize={handleResize}
>
  <SplitterPane id="pane-1" minSize={150}>
    <div>Pane 1 Content</div>
  </SplitterPane>

  <SplitterPane id="pane-2" minSize={200}>
    <div>Pane 2 Content</div>
  </SplitterPane>

  <SplitterPane id="pane-3" minSize={150}>
    <div>Pane 3 Content</div>
  </SplitterPane>
</Splitter>
```

### Vertical Layout

```svelte
<Splitter
  direction="vertical"
  gutterSize={8}
  minSize={100}
  initialSizes={[1, 1, 1]}
>
  <SplitterPane id="top">Top Content</SplitterPane>
  <SplitterPane id="middle">Middle Content</SplitterPane>
  <SplitterPane id="bottom">Bottom Content</SplitterPane>
</Splitter>
```

## Props

### Splitter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | auto-generated | Unique identifier for the splitter |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `gutterSize` | `number` | `8` | Size of the handle in pixels |
| `minSize` | `number \| number[]` | `100` | Minimum size(s) for pane(s) in pixels |
| `maxSize` | `number \| number[]` | `undefined` | Maximum size(s) for pane(s) in pixels |
| `initialSizes` | `number[]` | `[]` | Initial size weights (e.g., [1, 2, 1]) |
| `storageKey` | `string \| null` | `null` | localStorage key for persisting layout |
| `onresize` | `(sizes: number[]) => void` | `undefined` | Callback fired during resize |

### SplitterPane Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique identifier for the pane |
| `minSize` | `number` | `undefined` | Minimum size in pixels (overrides Splitter's minSize) |
| `maxSize` | `number` | `undefined` | Maximum size in pixels (overrides Splitter's maxSize) |

## Methods

Access these methods using a component reference:

```typescript
// Set specific sizes
splitterRef.setSizes([300, 400, 300]);

// Get current sizes
const sizes = splitterRef.getSizes();
console.log(sizes); // [300, 400, 300]
```

### `setSizes(sizes: number[])`

Set the sizes of all panes in pixels.

### `getSizes(): number[]`

Get the current sizes of all panes in pixels.

## How It Works

### Simple Resize Logic

When you drag a handle:
1. Only the two adjacent panes are affected
2. What you add to one pane is subtracted from the other
3. Other panes remain unchanged
4. Min/max constraints are respected

**Example:**
- Panes: A (300px) | B (400px) | C (300px)
- Drag handle between A and B to the right by 50px
- Result: A (350px) | B (350px) | C (300px) ← C stays the same!

### Constraints

- **Min Size**: Panes can't be resized smaller than their minimum
- **Max Size**: Panes can't be resized larger than their maximum
- **Total Size**: The sum of adjacent pane sizes is always preserved

### Persistence

If you provide a `storageKey`, the layout is automatically saved to localStorage and restored when the component mounts.

## Examples

See the demo page at `/demo-splitter` for interactive examples.

## Theme Integration

The component uses these CSS variables from your app theme:

- `--color-base-100` - Pane background
- `--color-base-200` - Container background
- `--color-base-300` - Handle background
- `--color-base-content` - Handle icon color
- `--color-primary` - Handle hover background
- `--color-primary-content` - Handle hover icon color

## Browser Support

Works in all modern browsers that support:
- CSS Flexbox
- Pointer Events
- localStorage (for persistence)

## License

Part of the ElasticGaze project.
