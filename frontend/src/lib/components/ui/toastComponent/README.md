# Toast Notification System

A production-ready, reusable toast notification system for ElasticGaze built with Svelte 5.

## Features

- ✅ **Multiple concurrent toasts** with independent management
- ✅ **Stacking support** for simultaneous notifications
- ✅ **Theme-aware** using app.css OKLCH variables
- ✅ **Configurable accent colors** (success, error, warning, info, primary, secondary, accent)
- ✅ **Copy to clipboard** functionality with IconPark SVG icons
- ✅ **Auto-dismiss** with configurable duration
- ✅ **Smooth animations** using Svelte transitions
- ✅ **Accessible** with ARIA roles and labels
- ✅ **Flexible positioning** (6 position options)
- ✅ **Individual dismissal** for each toast
- ✅ **TypeScript support** with full type definitions

## Architecture

### Files

1. **`toastStore.ts`** - Svelte writable store managing toast state
2. **`Toast.svelte`** - Individual toast component
3. **`ToastProvider.svelte`** - Container for rendering all toasts
4. **`index.ts`** - Barrel export for clean imports

## Installation

The toast system is already integrated into your app. The `ToastProvider` is included in `+layout.svelte`, making toasts available globally.

## Usage

### Basic Usage

```svelte
<script>
  import { toast } from '$lib/components/ui/toastComponent';

  function handleSuccess() {
    toast.show('Operation completed successfully!', {
      accent: 'success',
      duration: 5000
    });
  }

  function handleError() {
    toast.show('An error occurred. Please try again.', {
      accent: 'error'
    });
  }
</script>

<button onclick={handleSuccess}>Success</button>
<button onclick={handleError}>Error</button>
```

### All Toast Types

```typescript
// Success
toast.show('File uploaded!', { accent: 'success' });

// Error
toast.show('Upload failed!', { accent: 'error' });

// Warning
toast.show('Storage running low', { accent: 'warning' });

// Info
toast.show('New update available', { accent: 'info' });

// Primary
toast.show('Primary message', { accent: 'primary' });

// Secondary
toast.show('Secondary message', { accent: 'secondary' });

// Accent
toast.show('Accent message', { accent: 'accent' });
```

### Advanced Features

#### Multiple Toasts

```typescript
// Show multiple toasts - they stack automatically
toast.show('First notification', { accent: 'success' });
toast.show('Second notification', { accent: 'info' });
toast.show('Third notification', { accent: 'warning' });
```

#### Persistent Toast (No Auto-Dismiss)

```typescript
toast.show('This requires manual dismissal', {
  accent: 'warning',
  duration: 0  // Will not auto-dismiss
});
```

#### Custom Duration

```typescript
toast.show('Quick message', {
  accent: 'info',
  duration: 2000  // 2 seconds
});
```

#### Clear All Toasts

```typescript
toast.clear();
```

#### Remove Specific Toast

```typescript
const toastId = toast.show('Loading...', {
  accent: 'info',
  duration: 0
});

// Later...
toast.remove(toastId);
```

## API Reference

### `toast.show(message, options?)`

Creates and displays a new toast.

**Parameters:**
- `message` (string) - The text to display
- `options` (object, optional)
  - `accent` (ToastAccent) - Color theme: `'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'accent'` (default: `'info'`)
  - `duration` (number) - Time in milliseconds before auto-dismiss (default: `5000`, set to `0` to disable)

**Returns:** `string` - Unique toast ID

### `toast.remove(id)`

Removes a specific toast by ID.

**Parameters:**
- `id` (string) - The toast ID returned from `show()`

### `toast.clear()`

Removes all active toasts.

### `ToastProvider` Component

**Props:**
- `position` (optional) - Where toasts appear
  - Options: `'top-right'`, `'top-left'`, `'top-center'`, `'bottom-right'`, `'bottom-left'`, `'bottom-center'`
  - Default: `'top-right'`

**Example:**
```svelte
<ToastProvider position="bottom-right" />
```

## Styling

The toast system uses CSS variables from `app.css`:

- **Background:** `var(--color-base-100)`
- **Text:** `var(--color-base-content)`
- **Button Background:** `var(--color-base-200)`
- **Accent Strip:** Dynamic based on `accent` prop
  - Success: `var(--color-success)`
  - Error: `var(--color-error)`
  - Warning: `var(--color-warning)`
  - Info: `var(--color-info)`
  - Primary: `var(--color-primary)`
  - Secondary: `var(--color-secondary)`
  - Accent: `var(--color-accent)`

Works seamlessly with both dark and light themes.

## Icons

Uses IconPark SVG icons:
- **Copy** - Copies toast message to clipboard
- **Close** - Dismisses the toast

## Accessibility

- Each toast has `role="alert"` for screen readers
- Icon buttons include `aria-label` attributes
- Keyboard accessible (all buttons are focusable)

## Demo

Visit `/toast-demo` to see all features in action.

## Animation

- **Enter:** Fly-in from right (300ms)
- **Exit:** Fade out (200ms)
- Smooth and non-jarring

## Best Practices

1. **Use appropriate accent colors** for different message types
2. **Keep messages concise** - toasts are meant for brief notifications
3. **Set duration: 0** only when user action is required
4. **Use toast.clear()** when navigating or resetting state
5. **Stack limit** - While unlimited, avoid showing too many toasts simultaneously

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type { ToastAccent, ToastType, ToastOptions } from '$lib/components/ui/toastComponent';
```

## Examples

### Form Validation

```typescript
function handleSubmit() {
  if (!isValid) {
    toast.show('Please fill all required fields', {
      accent: 'error',
      duration: 4000
    });
    return;
  }
  
  // Submit form...
  toast.show('Form submitted successfully!', {
    accent: 'success'
  });
}
```

### File Upload

```typescript
async function uploadFile(file: File) {
  const loadingId = toast.show('Uploading file...', {
    accent: 'info',
    duration: 0
  });
  
  try {
    await api.upload(file);
    toast.remove(loadingId);
    toast.show('File uploaded successfully!', {
      accent: 'success'
    });
  } catch (error) {
    toast.remove(loadingId);
    toast.show('Upload failed. Please try again.', {
      accent: 'error'
    });
  }
}
```

### Clipboard Operations

```typescript
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.show('Copied to clipboard!', {
      accent: 'success',
      duration: 2000
    });
  } catch {
    toast.show('Failed to copy', {
      accent: 'error'
    });
  }
}
```

## Troubleshooting

**Toasts not appearing:**
- Ensure `ToastProvider` is in your layout file
- Check that you're importing from the correct path

**Styling issues:**
- Verify theme variables are defined in `app.css`
- Check z-index conflicts (toasts use `z-50`)

**TypeScript errors:**
- Ensure all files are using `.ts` or `.svelte` extensions
- Import types from the index file
