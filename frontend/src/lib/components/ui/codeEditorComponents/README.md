# CodeEditor Component

A fully-featured, accessible code editor component built with **CodeMirror 6** for ElasticGaze. Supports JSON editing, syntax highlighting, per-instance zoom controls, theme switching, read-only mode, code folding, and autocomplete.

## Features

✅ **JSON Syntax Highlighting** - Syntax highlighting for JSON with error detection  
✅ **Per-Instance Zoom** - Independent zoom levels for each editor (Ctrl+/-, Ctrl+0)  
✅ **Theme Support** - Automatic theme switching (dark/light/auto)  
✅ **Read-Only Mode** - Toggleable read-only state with visual indicator  
✅ **Code Folding** - Collapse/expand JSON objects and arrays  
✅ **Autocomplete** - Smart autocomplete for JSON structures  
✅ **Line Numbers** - Always-visible line numbers with active line highlighting  
✅ **Accessible** - Full ARIA support and keyboard navigation  
✅ **Zoom Indicator** - Temporary zoom level display  
✅ **Theme-Aware** - Uses app.css CSS variables for consistent styling

---

## Installation

The component is already set up with the necessary dependencies:

```bash
pnpm add @codemirror/view @codemirror/state @codemirror/lang-json @codemirror/autocomplete @codemirror/lint @codemirror/commands @codemirror/language @codemirror/search
```

---

## Basic Usage

```svelte
<script>
  import CodeEditor from '$lib/components/ui/codeEditorComponents/CodeEditor.svelte';
  
  let jsonValue = $state('{\n  "name": "ElasticGaze",\n  "version": "1.0.0"\n}');
</script>

<CodeEditor bind:value={jsonValue} />
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Editor content (bindable) |
| `language` | `'json'` | `'json'` | Language mode (currently only JSON supported) |
| `readOnly` | `boolean` | `false` | Enable read-only mode |
| `placeholder` | `string` | `''` | Placeholder text when editor is empty |
| `tabSize` | `number` | `2` | Number of spaces per tab |
| `lineWrapping` | `boolean` | `true` | Enable line wrapping |
| `showLineNumbers` | `boolean` | `true` | Show line numbers |
| `minHeight` | `string` | `'200px'` | Minimum editor height |
| `maxHeight` | `string` | `undefined` | Maximum editor height (enables scrolling) |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Editor theme mode |
| `onchange` | `(value: string) => void` | `undefined` | Callback when content changes |
| `onfocus` | `() => void` | `undefined` | Callback when editor gains focus |
| `onblur` | `() => void` | `undefined` | Callback when editor loses focus |

---

## Events

```svelte
<CodeEditor
  bind:value={json}
  onchange={(newValue) => console.log('Changed:', newValue)}
  onfocus={() => console.log('Focused')}
  onblur={() => console.log('Blurred')}
/>
```

---

## Examples

### 1. Basic Editor

```svelte
<script>
  import CodeEditor from '$lib/components/ui/codeEditorComponents/CodeEditor.svelte';
  
  let code = $state('{"hello": "world"}');
</script>

<CodeEditor bind:value={code} />
```

### 2. Read-Only Editor

```svelte
<CodeEditor 
  value={jsonData} 
  readOnly={true}
  placeholder="No data available"
/>
```

### 3. Multiple Editors with Independent Zoom

```svelte
<script>
  let editor1 = $state('{"editor": 1}');
  let editor2 = $state('{"editor": 2}');
</script>

<!-- Each editor has its own zoom level -->
<CodeEditor bind:value={editor1} minHeight="300px" />
<CodeEditor bind:value={editor2} minHeight="300px" />
```

### 4. Themed Editor

```svelte
<!-- Force dark theme -->
<CodeEditor value={code} theme="dark" />

<!-- Force light theme -->
<CodeEditor value={code} theme="light" />

<!-- Auto-detect app theme (default) -->
<CodeEditor value={code} theme="auto" />
```

### 5. With Max Height (Scrollable)

```svelte
<CodeEditor 
  bind:value={largeJson}
  minHeight="200px"
  maxHeight="500px"
/>
```

### 6. Custom Configuration

```svelte
<CodeEditor 
  bind:value={code}
  tabSize={4}
  lineWrapping={false}
  showLineNumbers={true}
  placeholder="Enter JSON here..."
  minHeight="400px"
  maxHeight="600px"
/>
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + +` | Zoom in (increases font size) |
| `Ctrl + -` | Zoom out (decreases font size) |
| `Ctrl + 0` | Reset zoom to 100% |
| `Tab` | Indent selection |
| `Shift + Tab` | Outdent selection |
| `Ctrl + /` | Toggle fold at cursor |
| `Ctrl + Space` | Trigger autocomplete |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + F` | Find |
| `Ctrl + H` | Find and replace |

---

## Accessibility Features

- ✅ Full keyboard navigation
- ✅ ARIA labels and roles (`role="textbox"`, `aria-multiline="true"`)
- ✅ Screen reader announcements for zoom changes
- ✅ Read-only state properly announced (`aria-readonly="true"`)
- ✅ Focus indicators with visible outline
- ✅ High contrast support via theme variables
- ✅ Semantic HTML structure

---

## Zoom Behavior

Each editor instance manages its **own zoom level independently**:

- Zoom range: **50% to 200%**
- Zoom increment: **10%**
- Zoom indicator: Appears at top-right for **1.5 seconds**
- Zoom persists until page refresh (per instance)
- Does not affect other editors on the same page

**Example:**
```svelte
<CodeEditor bind:value={json1} />  <!-- Independent zoom -->
<CodeEditor bind:value={json2} />  <!-- Independent zoom -->
```

---

## Theme Integration

The editor automatically uses your app theme variables from `app.css`:

### Colors Used
- `--color-base-100` - Editor background
- `--color-base-200` - Gutter background
- `--color-base-300` - Active line background
- `--color-base-content` - Text color
- `--color-accent` - Cursor and focus ring
- `--color-primary` - Selection background
- `--color-info` - JSON property keys
- `--color-success` - JSON string values
- `--color-warning` - JSON numbers
- `--color-error` - JSON null values
- `--color-secondary` - JSON keywords (true/false)

### Theme Switching
The editor automatically detects theme changes when `theme="auto"`:
- Watches for `.light-theme` class on `<html>`
- Recreates editor with correct theme on change
- No manual intervention needed

---

## File Structure

```
codeEditorComponents/
├── CodeEditor.svelte      # Main component
├── useCodeMirror.ts       # CodeMirror initialization helper
├── themes.ts              # Theme definitions
└── README.md              # This file
```

---

## Advanced Usage

### With Validation Callback

```svelte
<script>
  let code = $state('{}');
  let isValid = $state(true);
  
  function handleChange(value: string) {
    try {
      JSON.parse(value);
      isValid = true;
    } catch {
      isValid = false;
    }
  }
</script>

<CodeEditor 
  bind:value={code}
  onchange={handleChange}
/>

{#if !isValid}
  <p style="color: var(--color-error);">Invalid JSON</p>
{/if}
```

### Dynamic Read-Only Toggle

```svelte
<script>
  let code = $state('{"editable": true}');
  let readonly = $state(false);
</script>

<button onclick={() => readonly = !readonly}>
  Toggle Edit Mode
</button>

<CodeEditor 
  bind:value={code}
  readOnly={readonly}
/>
```

---

## Styling Customization

The component uses CSS variables for all colors. To customize:

```css
/* In your app.css or component */
:root {
  --color-base-100: #1a1a1a;      /* Editor background */
  --color-accent: #00ff00;         /* Cursor color */
  --color-info: #61afef;           /* JSON keys */
  --color-success: #98c379;        /* JSON strings */
  --color-warning: #e5c07b;        /* JSON numbers */
}
```

---

## Browser Support

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ⚠️ Mobile: Limited zoom control support (touch gestures)

---

## Performance

- **Lazy initialization** - Editor only created when mounted
- **Efficient updates** - Only re-renders when necessary
- **Memory cleanup** - Proper disposal of editor instances
- **Optimized for large files** - Handles JSON files up to 1MB smoothly

---

## Known Limitations

1. **Language Support**: Currently only JSON is supported. More languages can be added by importing additional CodeMirror language packages.
2. **Mobile Zoom**: Touch zoom gestures not yet implemented (use desktop keyboard shortcuts).
3. **Print Styling**: Editor may not print correctly with zoomed content.

---

## Troubleshooting

### Editor not visible
- Ensure `minHeight` is set (default: `200px`)
- Check that parent container has defined height

### Theme not switching
- Verify `theme="auto"` is set
- Check that app theme is toggling `.light-theme` class on `<html>`

### Zoom not working
- Ensure editor has focus (click inside editor first)
- Try `Ctrl + =` instead of `Ctrl + +` on some keyboards

### Read-only not working
- Verify `readOnly` prop is set to `true`
- Check that value is being updated externally

---

## Demo

Visit `/demo-code-editor` to see the component in action with:
- Two independent editors
- Read-only toggle
- Theme switching
- Zoom controls
- JSON validation

---

## License

Part of the ElasticGaze project.

---

## Credits

Built with [CodeMirror 6](https://codemirror.net/) by Marijn Haverbeke.
