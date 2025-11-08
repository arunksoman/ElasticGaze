# Tab Components

A themeable, reusable tab system for ElasticGaze built with **Svelte 5** (runes syntax). This component provides a flexible tab interface with keyboard navigation, closable tabs, and edited state indicators—all styled using theme variables from `app.css`.

## Features

- ✅ **Flat Design** — Uses `--radius-field` and `--radius-box` for non-curvy edges
- ✅ **Themeable** — Uses only theme variables from `app.css` (no custom colors)
- ✅ **Keyboard Navigation** — Arrow keys, Home, End, Delete, Ctrl+W support
- ✅ **Closable Tabs** — Optional close button on each tab
- ✅ **Add Tabs** — Plus button to add new tabs (with optional max limit)
- ✅ **Edited State** — Visual indicator (dot) for modified tabs
- ✅ **Accessible** — ARIA attributes and semantic HTML
- ✅ **Svelte 5 Runes** — Modern reactive syntax with `$props`, `$state`, `$derived`, `$effect`

## File Structure

```
$lib/components/ui/TabComponents/
├── tabsStore.ts       # Svelte store for managing tab state
├── Tabs.svelte        # Tab container with tab bar and add button
├── Tab.svelte         # Individual tab component
└── README.md          # This file
```

## Quick Start

### 1. Basic Usage

```svelte
<script lang="ts">
	import Tabs from '$lib/components/ui/TabComponents/Tabs.svelte';
	import { tabsStore } from '$lib/components/ui/TabComponents/tabsStore';

	// Initialize with a default tab
	$effect(() => {
		if ($tabsStore.tabs.length === 0) {
			tabsStore.addTab({ title: 'Request 1' });
		}
	});

	const state = $derived($tabsStore);
</script>

<Tabs
	bind:tabs={state.tabs}
	bind:activeTabId={state.activeTabId}
	on:add={() => tabsStore.addTab()}
	on:close={(e) => tabsStore.closeTab(e.detail)}
	on:activate={(e) => tabsStore.activateTab(e.detail)}
/>
```

### 2. Without Store (Manual Control)

```svelte
<script lang="ts">
	import Tabs from '$lib/components/ui/TabComponents/Tabs.svelte';
	import type { TabItem } from '$lib/components/ui/TabComponents/tabsStore';

	let tabs = $state<TabItem[]>([
		{ id: '1', title: 'Request 1', edited: false, createdAt: Date.now() }
	]);
	let activeTabId = $state<string | null>('1');

	function addTab() {
		const newTab: TabItem = {
			id: `tab-${Date.now()}`,
			title: `Request ${tabs.length + 1}`,
			edited: false,
			createdAt: Date.now()
		};
		tabs = [...tabs, newTab];
		activeTabId = newTab.id;
	}

	function closeTab(id: string) {
		const index = tabs.findIndex((t) => t.id === id);
		tabs = tabs.filter((t) => t.id !== id);
		
		if (activeTabId === id && tabs.length > 0) {
			const nextIndex = Math.min(index, tabs.length - 1);
			activeTabId = tabs[nextIndex]?.id || null;
		}
	}
</script>

<Tabs
	bind:tabs
	bind:activeTabId
	on:add={addTab}
	on:close={(e) => closeTab(e.detail)}
	on:activate={(e) => (activeTabId = e.detail)}
/>
```

## API Reference

### `Tabs.svelte` (Container)

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | `[]` | Array of tab items (bindable) |
| `activeTabId` | `string \| null` | `null` | Currently active tab ID (bindable) |
| `maxTabs` | `number \| null` | `null` | Maximum number of tabs (null = unlimited) |
| `closable` | `boolean` | `true` | Whether tabs can be closed |
| `showAddButton` | `boolean` | `true` | Show the + button to add tabs |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `on:add` | `TabItem` | Fired when a new tab is added |
| `on:close` | `string` (tab ID) | Fired when a tab is closed |
| `on:activate` | `string` (tab ID) | Fired when a tab is activated |

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Navigate between tabs |
| `Home` | Focus first tab |
| `End` | Focus last tab |
| `Delete` | Close focused tab (if closable) |
| `Ctrl+W` / `Cmd+W` | Close focused tab (if closable) |
| `Enter` / `Space` | Activate focused tab |

---

### `Tab.svelte` (Individual Tab)

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | *required* | Unique tab identifier |
| `title` | `string` | *required* | Tab title text |
| `active` | `boolean` | `false` | Whether this tab is active |
| `edited` | `boolean` | `false` | Show edited indicator (dot) |
| `closable` | `boolean` | `true` | Show close button |
| `icon` | `string \| null` | `null` | Optional icon (IconPark name or SVG) |
| `ariaLabel` | `string` | `title` | Accessibility label |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `on:click` | `{ id: string }` | Fired when tab is clicked |
| `on:close` | `{ id: string }` | Fired when close button is clicked |

---

### `tabsStore.ts` (Store)

#### Types

```typescript
interface TabItem {
	id: string;
	title: string;
	edited?: boolean;
	createdAt: number;
	// Reserved for future:
	// method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// params?: Record<string, unknown>;
	// body?: string;
}

interface TabsState {
	tabs: TabItem[];
	activeTabId: string | null;
}
```

#### Store Methods

```typescript
// Add a new tab
tabsStore.addTab(opts?: Partial<TabItem>): TabItem

// Close a tab by ID
tabsStore.closeTab(id: string): void

// Activate a tab by ID
tabsStore.activateTab(id: string): void

// Set edited flag for a tab
tabsStore.setEdited(id: string, edited: boolean): void

// Get all tabs
tabsStore.getTabs(): TabItem[]

// Get active tab ID
tabsStore.getActiveTabId(): string | null

// Reset store to initial state
tabsStore.reset(): void
```

#### Example Store Usage

```typescript
import { tabsStore } from '$lib/components/ui/TabComponents/tabsStore';

// Add a new tab
const newTab = tabsStore.addTab({ title: 'My Request' });

// Mark tab as edited
tabsStore.setEdited(newTab.id, true);

// Close a tab
tabsStore.closeTab(newTab.id);

// Activate a tab
tabsStore.activateTab('some-tab-id');

// Access current state
const state = $tabsStore; // { tabs: TabItem[], activeTabId: string | null }
```

## Styling

All styling uses theme variables from `app.css`:

### Colors
- `--color-base-100`, `--color-base-200`, `--color-base-300` — backgrounds
- `--color-base-content` — text color
- `--color-primary`, `--color-primary-content` — active tab accent
- `--color-warning` — edited indicator
- `--color-error`, `--color-error-content` — close button hover

### Borders & Radius
- `--radius-field` — tab border radius (flat by default: `0rem`)
- `--radius-box` — container border radius
- `--border` — border width

### Customization

Override CSS custom properties on the container for custom themes:

```svelte
<div style="--radius-field: 0.25rem;">
	<Tabs ... />
</div>
```

## Advanced Examples

### With Custom Icons

```svelte
<script lang="ts">
	import { Send } from '@icon-park/svg';
	
	const customIcon = Send({ theme: 'outline', size: '16' });
	
	const tabs = $state([
		{ 
			id: '1', 
			title: 'POST Request',
			edited: false,
			createdAt: Date.now()
		}
	]);
</script>

<Tab
	id={tabs[0].id}
	title={tabs[0].title}
	icon={customIcon}
	active={true}
/>
```

### Limit Maximum Tabs

```svelte
<Tabs
	bind:tabs
	bind:activeTabId
	maxTabs={10}
	on:add={handleAdd}
	on:close={handleClose}
	on:activate={handleActivate}
/>
```

### Toggle Edited State

```typescript
function toggleEdited(tabId: string) {
	const tab = $tabsStore.tabs.find((t) => t.id === tabId);
	if (tab) {
		tabsStore.setEdited(tabId, !tab.edited);
	}
}
```

## Demo

See a full working example at:

```
frontend/src/routes/tab-demo/+page.svelte
```

Run the app and navigate to `/tab-demo` to see the tab component in action.

## Future Extensions

The `TabItem` interface includes reserved fields for future features:

```typescript
interface TabItem {
	// ... current fields
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	params?: Record<string, unknown>;
	body?: string;
}
```

These can be used to build a full HTTP request editor interface.

## Accessibility

- Semantic HTML with proper ARIA roles (`role="tablist"`, `role="tab"`)
- `aria-selected` indicates active tab
- `aria-label` for screen readers
- Keyboard navigation support
- Focus indicators using `outline` and theme colors

## License

Part of the ElasticGaze project.
