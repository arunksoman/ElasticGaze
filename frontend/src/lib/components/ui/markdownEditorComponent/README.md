# Markdown Editor Component

A textarea-based Markdown editor with preview functionality for ElasticGaze.

## Overview

The Markdown Editor component provides a simple, accessible way for users to write Markdown content and preview the rendered output. It follows ElasticGaze's design system and theming conventions.

## Features

- ✍️ **Plain textarea editing** - No WYSIWYG complexity
- 👁️ **Live preview** - Render Markdown safely with sanitization
- ⌨️ **Keyboard-driven** - Press Shift+Enter to switch to preview mode
- ♿ **Accessible** - ARIA labels, live regions, and keyboard navigation
- 🎨 **Themeable** - Supports light and dark themes
- 🔒 **Secure** - HTML sanitization to prevent XSS attacks
- 📦 **Reusable** - Works with multiple instances on the same page

## Installation

The component is part of ElasticGaze's UI component library. Import it from:

```typescript
import { MarkdownForm } from '$lib/components/ui/markdownEditorComponent';
```

## Basic Usage

```svelte
<script>
	import { MarkdownForm } from '$lib/components/ui/markdownEditorComponent';
	
	let content = $state('# Hello World\n\nThis is **markdown**!');
</script>

<MarkdownForm
	bind:value={content}
	theme="dark"
	placeholder="Write your markdown here..."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | The Markdown content (bindable) |
| `onChange` | `(value: string) => void` | `undefined` | Callback when content changes |
| `theme` | `'light' \| 'dark'` | `'dark'` | Application theme |
| `ariaLabel` | `string` | `'Markdown editor'` | Accessible label for the textarea |
| `placeholder` | `string` | `'Write your markdown here...'` | Placeholder text |
| `defaultPreview` | `boolean` | `false` | Start in preview mode |
| `onPreviewOpen` | `() => void` | `undefined` | Callback when preview mode is entered |
| `onEditOpen` | `() => void` | `undefined` | Callback when edit mode is entered |
| `class` | `string` | `''` | Additional CSS classes |
| `minHeight` | `string` | `'200px'` | Minimum height for the textarea/preview |

## Keyboard Behavior

### Edit Mode
- **Shift+Enter**: Switch to preview mode (if content is not empty)
- **Enter**: Add a new line (standard behavior)
- **Tab**: Standard tab behavior

### Preview Mode
- **Tab**: Focus on "Edit" button
- **Enter/Space** (on Edit button): Return to edit mode

## Supported Markdown

The component supports standard Markdown features:

- **Headings**: `# H1` through `###### H6`
- **Bold**: `**bold**` or `__bold__`
- **Italic**: `*italic*` or `_italic_`
- **Links**: `[text](url)`
- **Lists**: Ordered (`1.`) and unordered (`-`, `*`)
- **Code**: Inline `` `code` `` and code blocks (` ``` `)
- **Blockquotes**: `> quote`
- **Images**: `![alt](url)`
- **Tables**: GitHub Flavored Markdown tables
- **Horizontal Rules**: `---` or `***`

## Accessibility

The component follows WCAG 2.1 Level AA guidelines:

- **Keyboard Navigation**: All functionality accessible via keyboard
- **ARIA Labels**: Proper labeling for screen readers
- **Live Regions**: Mode changes announced via `aria-live="polite"`
- **Focus Management**: Focus moved appropriately when switching modes
- **Semantic HTML**: Preview uses proper heading and list elements

## Theming

The component uses CSS custom properties that map to ElasticGaze's theme system:

```css
--mf-background
--mf-textarea-bg
--mf-border
--mf-text
--mf-placeholder
--mf-preview-bg
--mf-code-bg
--mf-code-text
--mf-button-bg
--mf-button-text
--mf-button-hover-bg
--mf-focus-ring
```

These are automatically configured based on the `theme` prop.

## Advanced Usage

### With Custom Styling

```svelte
<MarkdownForm
	bind:value={content}
	theme="dark"
	class="shadow-lg"
	minHeight="400px"
/>
```

### With Event Handlers

```svelte
<script>
	import { MarkdownForm } from '$lib/components/ui/markdownEditorComponent';
	
	let content = $state('');
	
	function handleChange(newValue: string) {
		console.log('Content changed:', newValue);
	}
	
	function handlePreview() {
		console.log('Entered preview mode');
	}
	
	function handleEdit() {
		console.log('Entered edit mode');
	}
</script>

<MarkdownForm
	bind:value={content}
	onChange={handleChange}
	onPreviewOpen={handlePreview}
	onEditOpen={handleEdit}
	theme="dark"
/>
```

### Starting in Preview Mode

```svelte
<MarkdownForm
	value={existingContent}
	defaultPreview={true}
	theme="dark"
/>
```

## Multiple Instances

The component is designed to work correctly with multiple instances on the same page. Each instance maintains its own independent state:

```svelte
<MarkdownForm bind:value={content1} theme="dark" ariaLabel="First editor" />
<MarkdownForm bind:value={content2} theme="dark" ariaLabel="Second editor" />
```

## Security

The component uses:
- **marked** for Markdown parsing
- **DOMPurify** for HTML sanitization

This prevents XSS attacks from malicious Markdown input. Only safe HTML tags and attributes are allowed in the preview.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Troubleshooting

### Preview not showing
- Ensure content is not empty
- Check that you've pressed Enter or clicked the Preview button

### Styling issues
- Verify the theme prop matches your application's current theme
- Check that ElasticGaze's CSS variables are properly defined

### Content not updating
- Make sure you're using `bind:value` if you need two-way binding
- Verify the `onChange` callback is being called

## File Structure

```
markdownEditorComponent/
├── index.ts                                # Public exports
├── markdownEditorComponent.svelte          # Main component
├── markdownEditorComponent.types.ts        # TypeScript types
├── markdownEditorComponent.theme.ts        # Theme configuration
├── markdownEditorComponent.styles.ts       # Style utilities
└── README.md                               # This file
```

## Contributing

When modifying this component:
1. Maintain backward compatibility with existing props
2. Follow ElasticGaze's coding standards
3. Update TypeScript types accordingly
4. Test with both light and dark themes
5. Verify accessibility with screen readers
6. Update this README with any changes

## License

Part of ElasticGaze - All rights reserved.
