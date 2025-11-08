# Card Component

A versatile, themeable Card component for ElasticGaze built with **Svelte 5** (runes syntax). Fully accessible, keyboard-navigable, and styled using existing `app.css` CSS variables.

## Features

✅ **Three variants** - default (filled), outlined, ghost  
✅ **Elevation system** - 6 levels of shadow depth (0-5)  
✅ **Clickable & navigable** - Button-like behavior or anchor links  
✅ **Flexible slots** - header, footer, media, actions, default content  
✅ **Accent strips** - Left (3px) or top (4px) accent bars  
✅ **Rounded or flat** - Configurable border radius  
✅ **Padding control** - none, sm, md, lg  
✅ **Theme integration** - Uses app.css variables only  
✅ **Fully accessible** - ARIA roles, keyboard support, focus states  
✅ **TypeScript** - Complete type definitions

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outlined' \| 'ghost'` | `'default'` | Visual style of the card |
| `elevation` | `number` (0-5) | `0` | Shadow depth level |
| `clickable` | `boolean` | `false` | Makes card interactive with hover/focus states |
| `rounded` | `boolean` | `false` | Use `--radius-selector` (1rem) if true, `--radius-box` (0rem) if false |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding size |
| `border` | `boolean` | `false` | Show 1px border (not needed for `outlined` variant) |
| `accent` | `'none' \| 'left' \| 'top'` | `'none'` | Show accent strip on left (3px) or top (4px) |
| `href` | `string \| null` | `null` | If provided, card becomes an `<a>` anchor element |
| `onclick` | `(event) => void` | `undefined` | Click handler (works with clickable or href) |

---

## Slots

| Slot | Description |
|------|-------------|
| `children` (default) | Main card body content |
| `header` | Header area (typically title/subtitle) |
| `footer` | Footer area with top border separator |
| `media` | Media content (images, icons) - renders at top |
| `actions` | Action buttons area - right-aligned at bottom |

---

## Variants

### 1. Default
Filled card with `--color-base-100` background.

```svelte
<Card>
  <div slot="header"><h3>Default Card</h3></div>
  <p>This is a filled card with base-100 background.</p>
</Card>
```

**Styling:**
- Background: `var(--color-base-100)`
- Text: `var(--color-base-content)`
- No border by default

---

### 2. Outlined
Transparent background with border.

```svelte
<Card variant="outlined">
  <div slot="header"><h3>Outlined Card</h3></div>
  <p>Transparent background with base-300 border.</p>
</Card>
```

**Styling:**
- Background: `transparent`
- Text: `var(--color-base-content)`
- Border: `var(--border) solid var(--color-base-300)`

---

### 3. Ghost
Transparent background, no border.

```svelte
<Card variant="ghost">
  <div slot="header"><h3>Ghost Card</h3></div>
  <p>Minimal styling, blends with background.</p>
</Card>
```

**Styling:**
- Background: `transparent`
- Text: `var(--color-base-content)`
- No border

---

## Elevation System

Control shadow depth with the `elevation` prop (0-5):

```svelte
<!-- No shadow -->
<Card elevation={0}>Flat card</Card>

<!-- Subtle shadow -->
<Card elevation={1}>Slightly raised</Card>

<!-- Medium shadow -->
<Card elevation={3}>Medium elevation</Card>

<!-- Maximum shadow -->
<Card elevation={5}>Highly elevated</Card>
```

**Shadow Mapping:**
- `0` - No shadow
- `1` - `0 1px 2px rgba(0, 0, 0, 0.05)`
- `2` - `0 2px 4px rgba(0, 0, 0, 0.08)`
- `3` - `0 4px 8px rgba(0, 0, 0, 0.12)`
- `4` - `0 8px 16px rgba(0, 0, 0, 0.15)`
- `5` - `0 12px 24px rgba(0, 0, 0, 0.18)`

---

## Clickable Cards

Make cards interactive with `clickable` prop:

```svelte
<Card clickable elevation={1} onclick={() => console.log('Card clicked!')}>
  <div slot="header"><h3>Click Me</h3></div>
  <p>This card is interactive and keyboard accessible.</p>
</Card>
```

**Features:**
- Cursor changes to pointer
- Hover: Lifts up (`translateY(-1px)`) with increased shadow
- Focus: Accent color outline
- Keyboard: Activate with Enter or Space
- ARIA: `role="button"` and `tabindex="0"`

---

## Card as Link

Use `href` to make card an anchor element:

```svelte
<Card href="/documentation" elevation={2} padding="md">
  <div slot="header"><h3>Documentation</h3></div>
  <p>Click to navigate to docs.</p>
</Card>
```

**Features:**
- Renders as `<a>` element
- Preserves all accessibility
- Supports all card styling options
- Hover and focus states

---

## Accent Strips

Add visual accent bars:

### Left Accent (3px)
```svelte
<Card accent="left" padding="lg" border>
  <div slot="header"><h3>Important</h3></div>
  <p>Card with left accent strip.</p>
</Card>
```

### Top Accent (4px)
```svelte
<Card accent="top" padding="lg" border rounded>
  <div slot="header"><h3>Featured</h3></div>
  <p>Card with top accent strip.</p>
</Card>
```

**Styling:**
- Color: `var(--color-accent)`
- Left: 3px width, full height
- Top: 4px height, full width

---

## Padding Options

Control internal spacing:

```svelte
<!-- No padding -->
<Card padding="none">
  <img src="/image.jpg" alt="Full bleed" />
</Card>

<!-- Small padding -->
<Card padding="sm">Compact card</Card>

<!-- Medium padding (default) -->
<Card padding="md">Standard spacing</Card>

<!-- Large padding -->
<Card padding="lg">Spacious card</Card>
```

**Padding Values:**
- `none` - No padding (useful for full-bleed images)
- `sm` - `0.75rem` (12px)
- `md` - `1rem` (16px)
- `lg` - `1.5rem` (24px)

---

## Rounded vs Flat

Control border radius:

```svelte
<!-- Flat edges (default) -->
<Card rounded={false}>
  <p>Uses --radius-box (0rem)</p>
</Card>

<!-- Rounded edges -->
<Card rounded={true}>
  <p>Uses --radius-selector (1rem)</p>
</Card>
```

---

## Complete Examples

### Simple Default Card
```svelte
<Card>
  <div slot="header"><h3>Card Title</h3></div>
  <p>This is a simple card body content.</p>
  <div slot="footer">Footer text</div>
</Card>
```

---

### Clickable Card with Actions
```svelte
<script>
  import Card from '$lib/components/ui/Card/Card.svelte';
  import Button from '$lib/components/ui/formComponents/Button.svelte';
</script>

<Card 
  clickable 
  elevation={2}
  padding="md" 
  rounded
  onclick={() => console.log('Card clicked')}
>
  <div slot="header">
    <h3>Clickable Card</h3>
    <p class="text-sm opacity-70">Click anywhere on this card</p>
  </div>
  
  <p>This card is fully interactive and accessible with keyboard (Enter/Space).</p>
  
  <div slot="actions">
    <Button variant="primary" size="sm">Action</Button>
    <Button variant="outline" size="sm">Cancel</Button>
  </div>
</Card>
```

---

### Card with Media and Accent Strip
```svelte
<Card accent="left" padding="lg" border rounded elevation={1}>
  <div slot="media">
    <img 
      src="/photo.jpg" 
      alt="Card media" 
      class="w-full h-48 object-cover rounded"
    />
  </div>
  
  <div slot="header">
    <h3>Media Card</h3>
    <p class="text-sm opacity-70">With left accent strip</p>
  </div>
  
  <p>This card includes an image, accent strip, and rounded corners.</p>
  
  <div slot="footer">
    <span>Last updated: Nov 8, 2025</span>
  </div>
</Card>
```

---

### Card as Anchor Link
```svelte
<Card 
  href="/documentation" 
  elevation={2}
  padding="md" 
  rounded
>
  <div slot="header">
    <h3>Documentation</h3>
    <p class="text-sm opacity-70">Learn more about our features</p>
  </div>
  
  <p>Click this card to navigate to the documentation page.</p>
  
  <div slot="actions">
    <span class="text-sm" style="color: var(--color-primary);">
      Learn more →
    </span>
  </div>
</Card>
```

---

### Dashboard Stats Card
```svelte
<Card variant="outlined" padding="md" rounded>
  <div slot="header">
    <div class="flex items-center justify-between">
      <h4>Total Users</h4>
      <span style="color: var(--color-success);">+12%</span>
    </div>
  </div>
  
  <div class="text-3xl font-bold" style="color: var(--color-base-content);">
    24,583
  </div>
  
  <div slot="footer">
    <span class="text-xs">Updated 5 minutes ago</span>
  </div>
</Card>
```

---

### Feature Card with Top Accent
```svelte
<Card 
  accent="top" 
  padding="lg" 
  border 
  rounded 
  elevation={1}
>
  <div slot="header">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-full flex items-center justify-center" 
           style="background-color: var(--color-accent); color: var(--color-accent-content);">
        <span class="text-2xl">🚀</span>
      </div>
      <div>
        <h3>Fast Performance</h3>
        <p class="text-sm opacity-70">Lightning-fast loading times</p>
      </div>
    </div>
  </div>
  
  <p>Our optimized infrastructure ensures your application runs at peak performance.</p>
</Card>
```

---

### Product Card
```svelte
<Card padding="none" rounded elevation={2}>
  <div slot="media">
    <img 
      src="/product.jpg" 
      alt="Product" 
      class="w-full h-64 object-cover"
    />
  </div>
  
  <div class="p-4">
    <div slot="header">
      <h3>Premium Headphones</h3>
      <p class="text-xl font-bold" style="color: var(--color-primary);">
        $299.99
      </p>
    </div>
    
    <p class="mt-2">High-quality wireless headphones with active noise cancellation.</p>
    
    <div slot="actions" class="mt-4">
      <Button variant="primary" class="w-full">Add to Cart</Button>
    </div>
  </div>
</Card>
```

---

### Article Preview Card
```svelte
<Card 
  href="/blog/article-slug"
  variant="outlined" 
  padding="md" 
  rounded
>
  <div slot="header">
    <span class="text-xs" style="color: var(--color-accent);">TUTORIAL</span>
    <h3 class="mt-1">Getting Started with Svelte 5</h3>
    <p class="text-sm opacity-70 mt-1">Learn the new runes syntax</p>
  </div>
  
  <p>Discover how to build modern web applications using Svelte 5's revolutionary runes system...</p>
  
  <div slot="footer" class="flex items-center justify-between">
    <span>5 min read</span>
    <span>Nov 8, 2025</span>
  </div>
</Card>
```

---

## Theming

The Card component uses **only** CSS variables from `app.css`. No additional theme files are required.

### Variables Used

**Colors:**
```css
--color-base-100        /* Default card background */
--color-base-content    /* Text color */
--color-base-300        /* Border color */
--color-accent          /* Accent strip color */
--color-primary         /* Link color */
```

**Sizing & Spacing:**
```css
--radius-selector       /* 1rem - Rounded corners (rounded=true) */
--radius-box            /* 0rem - Flat corners (rounded=false) */
--border                /* 1px - Border width */
```

**Theme Compatibility:**
- ✅ Dark theme (default)
- ✅ Light theme (via `.light-theme` class)
- ✅ Automatically adapts to theme changes
- ✅ No hardcoded colors

---

## Accessibility

The Card component is fully accessible:

✅ **Semantic HTML** - Uses proper elements (`<a>`, `<header>`, `<footer>`)  
✅ **ARIA roles** - `role="button"` for clickable cards without href  
✅ **Keyboard navigation** - Tab to focus, Enter/Space to activate  
✅ **Focus indicators** - Clear outline using `--color-accent`  
✅ **Screen reader friendly** - Proper heading hierarchy  
✅ **Link behavior** - Native `<a>` element when href provided

### Keyboard Shortcuts
- **Tab** - Focus the card
- **Enter** or **Space** - Activate clickable card
- **Shift+Tab** - Move to previous focusable element

---

## Import

```typescript
import Card from '$lib/components/ui/Card/Card.svelte';
```

---

## TypeScript Support

Full type definitions included:

```typescript
type Variant = 'default' | 'outlined' | 'ghost';
type Padding = 'none' | 'sm' | 'md' | 'lg';
type Accent = 'none' | 'left' | 'top';

interface Props {
  variant?: Variant;
  elevation?: number;
  clickable?: boolean;
  rounded?: boolean;
  padding?: Padding;
  border?: boolean;
  accent?: Accent;
  href?: string | null;
  onclick?: (event: MouseEvent | KeyboardEvent) => void;
}
```

---

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

---

## Best Practices

1. **Use elevation sparingly** - Reserve higher levels (4-5) for modals/dialogs
2. **Combine with border** - `border` + `elevation` creates depth
3. **Clickable feedback** - Always use `clickable` or `href` for interactive cards
4. **Semantic headings** - Use `<h3>` or `<h4>` in header slot
5. **Padding for media** - Use `padding="none"` for full-bleed images
6. **Accent for emphasis** - Use accent strips to highlight important cards
7. **Rounded for friendliness** - Rounded corners for marketing/landing pages
8. **Flat for data** - Flat edges for dashboards/admin interfaces

---

## License

Part of the ElasticGaze project.
