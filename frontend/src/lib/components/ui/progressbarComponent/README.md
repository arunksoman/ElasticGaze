# Progress Bar Component

A lightweight, accessible progress bar component that visually represents progress and can change its color dynamically based on the progress percentage.

## Features

- ✅ **Accessible**: Full ARIA support with `role="progressbar"` and appropriate attributes
- 🎨 **Dynamic Colors**: Automatic color changes based on progress thresholds
- 🌓 **Theme-Aware**: Supports light and dark themes
- 📊 **Flexible**: Customizable height, colors, and animation
- 🎯 **Type-Safe**: Full TypeScript support
- 🚀 **Performant**: Smooth animations with minimal re-renders

## Installation

The component is located at `$lib/components/ui/progressbarComponent` and can be imported directly:

```svelte
<script>
  import { ProgressBar } from '$lib/components/ui/progressbarComponent';
</script>
```

## Basic Usage

### Simple Progress Bar

```svelte
<script>
  import { ProgressBar } from '$lib/components/ui/progressbarComponent';
  
  let progress = 45;
</script>

<ProgressBar value={progress} />
```

### With Theme

```svelte
<ProgressBar value={75} theme="light" />
```

### Custom Height

```svelte
<ProgressBar value={60} height={12} />
<!-- or -->
<ProgressBar value={60} height="1rem" />
```

### Custom Accessibility Label

```svelte
<ProgressBar 
  value={85} 
  ariaLabel="File upload progress"
/>
```

### Without Animation

```svelte
<ProgressBar value={50} animated={false} />
```

## Advanced Usage

### Custom Color Rules

You can define your own color rules based on progress ranges:

```svelte
<script>
  import { ProgressBar } from '$lib/components/ui/progressbarComponent';
  import type { ProgressColorRule } from '$lib/components/ui/progressbarComponent';
  
  const customColorRules: ProgressColorRule[] = [
    { min: 0, max: 25, color: 'var(--color-error)' },
    { min: 26, max: 50, color: 'var(--color-warning)' },
    { min: 51, max: 75, color: 'var(--color-info)' },
    { min: 76, max: 100, color: 'var(--color-success)' }
  ];
</script>

<ProgressBar value={60} colorRules={customColorRules} />
```

### Multiple Progress Bars

The component is designed to work correctly when multiple instances exist on the same page:

```svelte
<script>
  import { ProgressBar } from '$lib/components/ui/progressbarComponent';
  
  let cpu = 45;
  let memory = 78;
  let disk = 92;
</script>

<div class="system-stats">
  <div>
    <label>CPU Usage</label>
    <ProgressBar value={cpu} ariaLabel="CPU usage" />
  </div>
  
  <div>
    <label>Memory Usage</label>
    <ProgressBar value={memory} ariaLabel="Memory usage" />
  </div>
  
  <div>
    <label>Disk Usage</label>
    <ProgressBar value={disk} ariaLabel="Disk usage" />
  </div>
</div>
```

### With Custom Styling

```svelte
<ProgressBar 
  value={65} 
  class="my-custom-class"
/>

<style>
  :global(.my-custom-class) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | **required** | Progress value (0–100). Values outside this range will be clamped. |
| `theme` | `'light' \| 'dark'` | `'dark'` | Application theme for color adaptation. |
| `height` | `number \| string` | `'8px'` | Height of the progress bar. Numbers are treated as pixels. |
| `colorRules` | `ProgressColorRule[]` | default rules | Custom color rules based on progress percentage. |
| `ariaLabel` | `string` | `'Progress'` | Accessible label for screen readers. |
| `animated` | `boolean` | `true` | Whether to animate value changes. |
| `class` | `string` | `''` | Custom CSS class for the container. |

## Default Color Rules

By default, the progress bar uses these color rules:

- **0–39%**: Error color (red/danger)
- **40–69%**: Warning color (yellow/amber)
- **70–100%**: Success color (green)

These thresholds can be completely customized using the `colorRules` prop.

## Color Rule Type

```typescript
type ProgressColorRule = {
  min: number;        // Minimum percentage (inclusive)
  max: number;        // Maximum percentage (inclusive)
  color: string;      // CSS color or theme token
};
```

## Accessibility

The component follows WAI-ARIA best practices:

- Uses `role="progressbar"` for semantic meaning
- Includes `aria-valuenow` with the current clamped value
- Includes `aria-valuemin="0"` and `aria-valuemax="100"`
- Supports custom `aria-label` for context-specific descriptions
- Screen readers will announce progress updates automatically

## Behavior

### Value Clamping

Progress values are automatically clamped to the 0–100 range:

```svelte
<ProgressBar value={-10} />  <!-- Displays as 0% -->
<ProgressBar value={150} />  <!-- Displays as 100% -->
```

### Color Resolution

The component selects the first matching color rule where the progress value falls within the `min` and `max` range. If no rule matches, it falls back to the primary theme color.

### Animation

When `animated={true}` (default), the progress bar smoothly transitions:
- Width changes over 0.3s with ease-in-out timing
- Color changes over 0.3s with ease-in-out timing

## Theme Integration

The component uses ElasticGaze theme tokens:

```typescript
// Available theme colors
--color-error
--color-warning
--color-success
--color-info
--color-primary
--color-base-200  // track background
```

These colors automatically adapt to the current theme (light/dark).

## Examples

### File Upload Progress

```svelte
<script>
  import { ProgressBar } from '$lib/components/ui/progressbarComponent';
  
  let uploadProgress = 0;
  
  async function uploadFile(file) {
    // Simulated upload with progress
    const interval = setInterval(() => {
      uploadProgress += 10;
      if (uploadProgress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  }
</script>

<ProgressBar 
  value={uploadProgress} 
  height={16}
  ariaLabel="File upload progress"
/>
```

### Dashboard Health Indicator

```svelte
<script>
  import { ProgressBar } from '$lib/components/ui/progressbarComponent';
  import type { ProgressColorRule } from '$lib/components/ui/progressbarComponent';
  
  let clusterHealth = 85;
  
  const healthColorRules: ProgressColorRule[] = [
    { min: 0, max: 50, color: 'var(--color-error)' },
    { min: 51, max: 80, color: 'var(--color-warning)' },
    { min: 81, max: 100, color: 'var(--color-success)' }
  ];
</script>

<div class="health-indicator">
  <h3>Cluster Health</h3>
  <ProgressBar 
    value={clusterHealth}
    colorRules={healthColorRules}
    height={20}
    ariaLabel="Cluster health percentage"
  />
  <span>{clusterHealth}%</span>
</div>
```

### Storage Quota

```svelte
<script>
  import { ProgressBar } from '$lib/components/ui/progressbarComponent';
  
  let used = 450; // GB
  let total = 500; // GB
  let percentage = (used / total) * 100;
</script>

<div>
  <p>Storage: {used}GB / {total}GB</p>
  <ProgressBar 
    value={percentage}
    height={10}
    ariaLabel="Storage quota usage"
  />
</div>
```

## Technical Details

### Component Structure

```
progressbarComponent/
├── index.ts                          # Public exports
├── progressbarComponent.svelte      # Main component (uses Tailwind CSS)
├── progressbarComponent.types.ts    # TypeScript definitions
├── progressbarComponent.theme.ts    # Theme configuration
└── README.md                         # This file
```

### No Global State

The component is completely self-contained and uses no global state. Multiple instances can coexist without interference.

### Performance

The component uses Svelte 5's runes (`$derived`) for reactive computations, ensuring minimal re-renders and optimal performance.

## Browser Support

Works in all modern browsers that support:
- CSS custom properties
- CSS transitions
- ARIA attributes

## License

Part of the ElasticGaze project.
