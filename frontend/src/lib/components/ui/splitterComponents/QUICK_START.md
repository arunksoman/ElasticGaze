# Quick Start Guide - Splitter Component

## Installation
Components are located at: `$lib/components/ui/splitterComponents/`

## Import
```typescript
import { Splitter, SplitterPane } from '$lib/components/ui/splitterComponents';
```

## Basic Example
```svelte
<script>
  import { Splitter, SplitterPane } from '$lib/components/ui/splitterComponents';
</script>

<Splitter direction="horizontal">
  <SplitterPane id="pane-left">Left Content</SplitterPane>
  <SplitterPane id="pane-right">Right Content</SplitterPane>
</Splitter>
```

## Common Patterns

### 3-Column Layout
```svelte
<Splitter 
  direction="horizontal"
  minSize={[200, 300, 200]}
  initialSizes={[1, 2, 1]}
>
  <SplitterPane id="sidebar">Sidebar</SplitterPane>
  <SplitterPane id="main">Main Content</SplitterPane>
  <SplitterPane id="inspector">Inspector</SplitterPane>
</Splitter>
```

### With Persistence
```svelte
<Splitter 
  direction="horizontal"
  storageKey="my-app-layout"
>
  <SplitterPane id="pane-1">...</SplitterPane>
  <SplitterPane id="pane-2">...</SplitterPane>
</Splitter>
```

### Programmatic Control
```svelte
<script>
  let splitter;
  
  function collapse() {
    splitter.collapsePane('sidebar');
  }
</script>

<button onclick={collapse}>Collapse Sidebar</button>

<Splitter bind:this={splitter}>
  <SplitterPane id="sidebar">Sidebar</SplitterPane>
  <SplitterPane id="main">Main</SplitterPane>
</Splitter>
```

## Props Quick Reference

### Splitter
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `gutterSize` | `number` | `8` | Handle size in px |
| `collapsible` | `boolean` | `true` | Enable collapse |
| `minSize` | `number \| number[]` | `100` | Min pane sizes |
| `initialSizes` | `number[]` | `[]` | Initial size weights |
| `storageKey` | `string \| null` | `null` | localStorage key |

### SplitterPane
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique pane ID |
| `minSize` | `number` | `100` | Min size (px) |
| `collapsed` | `boolean` | `false` | Collapsed state |

## Methods (via bind:this)
```typescript
splitterRef.setSizes([300, 500, 200])
splitterRef.collapsePane('pane-id')
splitterRef.expandPane('pane-id')
splitterRef.toggleCollapse('pane-id')
const sizes = splitterRef.getSizes()
```

## Keyboard Shortcuts
- **Arrow Keys** - Resize (10px steps)
- **Home/End** - Min/Max position
- **Enter/Space** - Toggle collapse
- **Tab** - Focus next handle

## Demo
Run the app and navigate to: `/demo-splitter`

## Documentation
See `README.md` in the component folder for full API reference.
