# Alert Component

A flexible and reusable alert component for displaying messages, notifications, and warnings.

## Features

- **Multiple types**: info, success, warning, error
- **Customizable icons**: Use any icon from @icon-park/svg
- **Flexible content**: Support for title, message, or custom content via snippets
- **Action slots**: Add buttons or custom actions
- **Dismissible**: Optional close button
- **Accessible**: Proper ARIA roles and labels

## Usage

### Basic Alert

```svelte
<script>
  import { Alert } from '$lib/components/ui/alertComponent';
</script>

<Alert
  type="warning"
  title="Warning"
  message="This is a warning message."
/>
```

### Alert with Actions

```svelte
<Alert
  type="warning"
  title="Action Required"
  message="Please review and confirm."
>
  {#snippet actions()}
    <Button onclick={handleConfirm}>Confirm</Button>
  {/snippet}
</Alert>
```

### Dismissible Alert

```svelte
<Alert
  type="info"
  title="Information"
  message="This alert can be dismissed."
  dismissible={true}
  onDismiss={() => console.log('Alert dismissed')}
/>
```

### Custom Content

```svelte
<Alert type="error" title="Error">
  {#snippet children()}
    <p>Something went wrong:</p>
    <ul>
      <li>Error 1</li>
      <li>Error 2</li>
    </ul>
  {/snippet}
</Alert>
```

### Custom Icon

```svelte
<Alert
  type="info"
  title="Custom Icon"
  message="Using a custom icon"
  icon="Connection"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | The alert type (affects styling) |
| `title` | `string` | `undefined` | Alert title |
| `message` | `string` | `undefined` | Alert message |
| `icon` | `string` | Auto | Icon name from @icon-park/svg (defaults based on type) |
| `dismissible` | `boolean` | `false` | Show close button |
| `onDismiss` | `() => void` | `undefined` | Callback when dismissed |
| `class` | `string` | `''` | Additional CSS classes |

## Snippets

- `children` - Custom content area (replaces message)
- `actions` - Action buttons or controls

## Examples

### Info Alert
```svelte
<Alert
  type="info"
  title="Information"
  message="This is an informational message."
/>
```

### Success Alert
```svelte
<Alert
  type="success"
  title="Success!"
  message="Operation completed successfully."
/>
```

### Warning Alert
```svelte
<Alert
  type="warning"
  title="Warning"
  message="Please proceed with caution."
/>
```

### Error Alert
```svelte
<Alert
  type="error"
  title="Error"
  message="An error occurred."
/>
```
