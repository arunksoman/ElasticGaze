# Tree Component System

A comprehensive, themeable, and fully accessible tree component system for Svelte 5 applications. Built with TypeScript, supporting keyboard navigation, drag-and-drop, CRUD operations, and following WAI-ARIA Tree View patterns.

## Features

- ✅ **Svelte 5 Runes**: Modern reactive syntax with `$props`, `$state`, and `$derived`
- ✅ **Full Keyboard Navigation**: Complete WAI-ARIA Tree View keyboard support
- ✅ **Drag & Drop**: Reorder nodes by dragging between branches
- ✅ **Inline Editing**: Double-click or F2 to rename nodes
- ✅ **Multi-Selection**: Support for selecting multiple nodes
- ✅ **CRUD Operations**: Create, read, update, and delete nodes
- ✅ **Theme Integration**: Uses ElasticGaze theme variables from `app.css`
- ✅ **Accessible**: Full ARIA attributes and keyboard support
- ✅ **TypeScript**: Fully typed for better DX
- ✅ **Customizable Icons**: IconPark integration with custom icon support

---

## Components

### 1. `Tree.svelte`
The main container component that manages keyboard navigation, selection, expansion state, and events.

### 2. `TreeNode.svelte`
Recursive node renderer that handles rendering, drag-drop, inline editing, and icons.

### 3. `treeStore.ts`
Svelte store managing tree state (expansion, selection, CRUD, drag-drop).

### 4. `types.ts`
TypeScript interfaces and type definitions.

---

## Data Model

```typescript
export interface TreeNodeItem {
  id: string;                 // Unique identifier
  name: string;               // Display name
  children?: TreeNodeItem[];  // Child nodes (optional)
  expanded?: boolean;         // Expansion state (optional)
  selected?: boolean;         // Selection state (optional)
  iconCollapsed?: string;     // Custom collapsed icon (optional)
  iconExpanded?: string;      // Custom expanded icon (optional)
  editable?: boolean;         // Allow inline editing (default: true)
}
```

---

## Installation & Usage

### Basic Example

```svelte
<script lang="ts">
  import Tree from '$lib/components/ui/treeComponents/Tree.svelte';
  import type { TreeNodeItem } from '$lib/components/ui/treeComponents/types';

  let treeData: TreeNodeItem[] = [
    {
      id: '1',
      name: 'src',
      expanded: true,
      children: [
        {
          id: '2',
          name: 'components',
          children: [
            { id: '3', name: 'Button.svelte' },
            { id: '4', name: 'Input.svelte' }
          ]
        },
        {
          id: '5',
          name: 'routes',
          children: [
            { id: '6', name: 'index.svelte' },
            { id: '7', name: 'about.svelte' }
          ]
        }
      ]
    },
    { id: '8', name: 'package.json' }
  ];

  function handleSelect(event) {
    console.log('Selected:', event.detail.node);
  }
</script>

<Tree 
  nodes={treeData} 
  onselect={handleSelect}
/>
```

---

## Tree Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNodeItem[]` | `[]` | Root-level tree data |
| `multiSelect` | `boolean` | `false` | Enable multiple node selection |
| `draggable` | `boolean` | `true` | Enable drag-and-drop |
| `collapsible` | `boolean` | `true` | Allow expanding/collapsing nodes |
| `customNodeClass` | `string` | `''` | Custom CSS class for all nodes |
| `customItemClass` | `string` | `''` | Custom CSS class for leaf nodes |
| `keyboardNavigation` | `boolean` | `true` | Enable keyboard navigation |
| `icons` | `TreeIcons` | `{ collapsed: 'FolderClose', expanded: 'FolderOpen' }` | Default icon set |

---

## Tree Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onselect` | `{ node: TreeNodeItem }` | Fired when a node is selected |
| `onexpand` | `{ node: TreeNodeItem }` | Fired when a node is expanded |
| `oncollapse` | `{ node: TreeNodeItem }` | Fired when a node is collapsed |
| `onrename` | `{ id: string, name: string, oldName: string }` | Fired when a node is renamed (includes old name for error recovery) |
| `oncreate` | `{ parentId: string \| null, node: TreeNodeItem }` | Fired when a node is created |
| `ondelete` | `{ node: TreeNodeItem }` | Fired when a node is deleted |
| `ondrop` | `{ sourceId: string, targetId: string }` | Fired when drag-drop completes |
| `onkeydown` | `KeyboardEvent` | Raw keyboard event (if custom handling needed) |
| `onnodeschange` | `TreeNodeItem[]` | Fired when tree data changes internally (for syncing with parent state) |

---

## Tree Methods (Programmatic API)

Access these methods by binding the component:

```svelte
<script>
  let treeComponent;
</script>

<Tree bind:this={treeComponent} {nodes} />

<button onclick={() => treeComponent.expandAll()}>
  Expand All
</button>
```

| Method | Parameters | Description |
|--------|------------|-------------|
| `expandAll(depth?)` | `depth?: number` | Expand all nodes (optionally to a max depth) |
| `collapseAll()` | - | Collapse all nodes |
| `selectNode(id, multi?)` | `id: string, multi?: boolean` | Select a node by ID |
| `clearSelection()` | - | Clear all selections |
| `renameNode(id, name)` | `id: string, name: string` | Rename a node |
| `createNode(parentId, node)` | `parentId: string \| null, node: TreeNodeItem` | Create a new node |
| `deleteNode(id)` | `id: string` | Delete a node and its descendants |
| `getSelectedNodes()` | - | Returns `TreeNodeItem[]` of selected nodes |
| `getExpandedNodes()` | - | Returns `TreeNodeItem[]` of expanded nodes |

---

## Keyboard Navigation

Following the [WAI-ARIA Tree View pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/):

| Key | Action |
|-----|--------|
| **Tab** | Move focus into/out of tree |
| **Enter** | Toggle expand/collapse or select focused node |
| **Space** | Select focused node |
| **ArrowDown** | Move focus to next visible node |
| **ArrowUp** | Move focus to previous visible node |
| **ArrowRight** | On closed branch → expand; on open branch → move to first child |
| **ArrowLeft** | On open branch → collapse; otherwise → move to parent |
| **Home** | Focus first visible node |
| **End** | Focus last visible node |
| **A–Z** | Type-ahead: jump to next node starting with typed letter |
| **\*** | Expand all siblings at the same depth |
| **Shift+ArrowDown** | Extend selection to next node (multi-select mode) |
| **Shift+ArrowUp** | Extend selection to previous node (multi-select mode) |
| **Ctrl+A** | Toggle select all / unselect all |
| **F2** | Start inline editing of focused node |

---

## CRUD Operations

### Create a Node

```typescript
treeComponent.createNode(parentId, {
  id: 'new-1',
  name: 'New File.txt',
  editable: true
});
```

If `parentId` is `null`, the node is added to the root level.

### Rename a Node

```typescript
treeComponent.renameNode('node-id', 'New Name');
```

Or double-click / press F2 to edit inline.

### Delete a Node

```typescript
treeComponent.deleteNode('node-id');
```

This removes the node and all its descendants, clearing them from selection and expansion states.

### Move a Node (Drag & Drop)

Drag a node and drop it onto another node to move it into that node's children.

The `on:drop` event provides `sourceId` and `targetId`:

```svelte
<Tree 
  ondrop={(e) => {
    console.log(`Moved ${e.detail.sourceId} to ${e.detail.targetId}`);
  }}
/>
```

---

## Custom Icons

### Using IconPark Icons

By default, the tree uses `FolderClose` and `FolderOpen` from IconPark.

You can override globally:

```svelte
<Tree 
  icons={{ 
    collapsed: 'FolderClose', 
    expanded: 'FolderOpen' 
  }} 
/>
```

### Per-Node Custom Icons

```typescript
{
  id: '1',
  name: 'Special Folder',
  iconCollapsed: '<svg>...</svg>',  // Custom SVG
  iconExpanded: '<svg>...</svg>'
}
```

If the icon string starts with `<svg`, it's treated as raw SVG; otherwise it's treated as an IconPark icon name.

---

## Theming

The tree component uses CSS variables from `app.css`:

```css
/* Colors */
--color-base-100        /* Background */
--color-base-200        /* Hover background */
--color-base-300        /* Border color */
--color-base-content    /* Text color */
--color-primary         /* Selected background */
--color-primary-content /* Selected text */
--color-accent          /* Focused outline, icons */
--color-accent-content  /* Drag target text */

/* Borders and Radii */
--radius-box            /* Container border radius */
--radius-field          /* Input/button border radius */
--border                /* Border width */
```

### Flat Design

The tree follows ElasticGaze's flat design philosophy:
- No shadows
- Minimal border radius (`--radius-box` / `--radius-field` are set to `0`)
- Clean, functional aesthetic

---

## Accessibility

- **Container**: `role="tree"`, `tabindex="0"`, focusable
- **Nodes**: `role="treeitem"`, `aria-expanded`, `aria-selected`, `aria-level`
- **Groups**: `role="group"` for children containers
- **Focus management**: Uses `aria-activedescendant` pattern
- **Keyboard support**: Full WAI-ARIA compliance
- **Screen reader friendly**: Proper labeling and state announcements

---

## Slots

### Empty State Slot

Customize the empty state when no nodes exist:

```svelte
<Tree nodes={[]}>
  <div slot="empty">
    <p>No files found.</p>
    <button>Create First File</button>
  </div>
</Tree>
```

---

## Example: File Explorer

```svelte
<script lang="ts">
  import Tree from '$lib/components/ui/treeComponents/Tree.svelte';
  import type { TreeNodeItem } from '$lib/components/ui/treeComponents/types';

  let files: TreeNodeItem[] = [
    {
      id: 'src',
      name: 'src',
      expanded: true,
      children: [
        { id: 'app.ts', name: 'app.ts' },
        { id: 'main.ts', name: 'main.ts' }
      ]
    }
  ];

  let treeComponent;

  function addFile() {
    const selected = treeComponent.getSelectedNodes();
    const parentId = selected[0]?.id || null;
    
    treeComponent.createNode(parentId, {
      id: `file-${Date.now()}`,
      name: 'newFile.ts',
      editable: true
    });
  }
</script>

<button onclick={addFile}>Add File</button>
<Tree bind:this={treeComponent} nodes={files} multiSelect />
```

---

## Store API (Advanced)

For advanced use cases, you can import and use the store directly:

```typescript
import { createTreeStore } from '$lib/components/ui/treeComponents/treeStore';

const store = createTreeStore(initialNodes);

// Manually control state
store.expand('node-id');
store.selectNode('node-id');
store.deleteNode('node-id');

// Subscribe to changes
store.subscribe(state => {
  console.log('Expanded IDs:', state.expandedIds);
  console.log('Selected IDs:', state.selectedIds);
});

// Derived visible nodes for custom rendering
const visibleNodes = store.visibleNodes;
```

---

## Database Integration & Error Handling

The tree component is designed to work seamlessly with backend persistence. All CRUD and drag-drop operations emit events that you can use to sync with a database.

### Pattern: Optimistic UI with Error Recovery

```svelte
<script lang="ts">
  import Tree from '$lib/components/ui/treeComponents/Tree.svelte';
  import type { TreeNodeItem, TreeRenameEvent, TreeDropEvent, TreeCreateEvent, TreeNodeEvent } from '$lib/components/ui/treeComponents/types';
  
  let treeData: TreeNodeItem[] = $state([]);
  let treeComponent: any;
  
  // Load initial data from database
  onMount(async () => {
    const response = await fetch('/api/tree-nodes');
    treeData = await response.json();
  });
  
  // Handle rename with database sync
  async function handleRename(event: TreeRenameEvent) {
    const { id, name, oldName } = event;
    
    try {
      // Call your API to persist the rename
      const response = await fetch(`/api/tree-nodes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      if (!response.ok) {
        throw new Error('Failed to rename node');
      }
      
      // Success - UI already updated optimistically via onnodeschange
      console.log('Node renamed successfully');
      
    } catch (error) {
      console.error('Rename failed:', error);
      
      // Revert the change in the UI
      treeComponent.renameNode(id, oldName);
      
      // Show error to user
      alert('Failed to rename node. Please try again.');
    }
  }
  
  // Handle drag-drop with database sync
  async function handleDrop(event: TreeDropEvent) {
    const { sourceId, targetId } = event;
    
    try {
      const response = await fetch('/api/tree-nodes/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, targetId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to move node');
      }
      
      console.log('Node moved successfully');
      
    } catch (error) {
      console.error('Move failed:', error);
      
      // Reload tree from server to revert
      const response = await fetch('/api/tree-nodes');
      treeData = await response.json();
      
      alert('Failed to move node. Tree has been refreshed.');
    }
  }
  
  // Handle create with database sync
  async function handleCreate(event: TreeCreateEvent) {
    const { parentId, node } = event;
    
    try {
      const response = await fetch('/api/tree-nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, node })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create node');
      }
      
      const serverNode = await response.json();
      
      // Update with server-generated ID if different
      if (serverNode.id !== node.id) {
        treeComponent.renameNode(node.id, serverNode.name);
      }
      
    } catch (error) {
      console.error('Create failed:', error);
      
      // Remove the optimistically created node
      treeComponent.deleteNode(node.id);
      
      alert('Failed to create node. Please try again.');
    }
  }
  
  // Handle delete with database sync
  async function handleDelete(event: TreeNodeEvent) {
    const { node } = event;
    
    // Confirm before delete
    if (!confirm(`Delete "${node.name}" and all its children?`)) {
      // Re-add the node by reloading data
      const response = await fetch('/api/tree-nodes');
      treeData = await response.json();
      return;
    }
    
    try {
      const response = await fetch(`/api/tree-nodes/${node.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete node');
      }
      
      console.log('Node deleted successfully');
      
    } catch (error) {
      console.error('Delete failed:', error);
      
      // Reload to restore the deleted node
      const response = await fetch('/api/tree-nodes');
      treeData = await response.json();
      
      alert('Failed to delete node. Tree has been refreshed.');
    }
  }
  
  // Sync changes back to treeData for persistence
  function handleNodesChange(newNodes: TreeNodeItem[]) {
    treeData = newNodes;
  }
</script>

<Tree 
  bind:this={treeComponent}
  nodes={treeData}
  onrename={handleRename}
  ondrop={handleDrop}
  oncreate={handleCreate}
  ondelete={handleDelete}
  onnodeschange={handleNodesChange}
/>
```

### Key Points for Database Integration

1. **`onnodeschange` callback**: This fires whenever the internal tree state changes. Use it to keep your `treeData` variable in sync with the tree's internal state.

2. **Optimistic UI**: The tree updates immediately in the UI. Your event handlers can then persist to the database asynchronously.

3. **Error Recovery**: If the database operation fails, you can:
   - Revert specific changes using the component methods (`renameNode`, `deleteNode`, etc.)
   - Reload the entire tree from the server to ensure consistency

4. **Event Data**: All events provide the necessary data for database operations:
   - `onrename`: Provides `id`, `name`, and `oldName`
   - `ondrop`: Provides `sourceId` and `targetId`
   - `oncreate`: Provides `parentId` and complete `node` object
   - `ondelete`: Provides the complete `node` object (including all descendants)

5. **Transaction Safety**: For critical operations, consider:
   - Showing loading states during database operations
   - Preventing further edits until confirmation
   - Implementing undo/redo functionality

### Example Backend Endpoints (Go/Wails)

```go
type TreeNodeDTO struct {
    ID       string         `json:"id"`
    Name     string         `json:"name"`
    ParentID *string        `json:"parentId"`
    Children []TreeNodeDTO  `json:"children,omitempty"`
}

// Move node
func (a *App) MoveTreeNode(sourceId, targetId string) error {
    // Update parent_id in database
    err := a.db.Exec(
        "UPDATE tree_nodes SET parent_id = ? WHERE id = ?",
        targetId, sourceId,
    ).Error
    
    return err
}

// Rename node
func (a *App) RenameTreeNode(id, name string) error {
    err := a.db.Model(&TreeNode{}).
        Where("id = ?", id).
        Update("name", name).Error
    
    return err
}

// Create node
func (a *App) CreateTreeNode(parentId *string, node TreeNodeDTO) (TreeNodeDTO, error) {
    dbNode := TreeNode{
        ID:       uuid.New().String(), // Generate server-side ID
        Name:     node.Name,
        ParentID: parentId,
    }
    
    err := a.db.Create(&dbNode).Error
    return TreeNodeDTO{
        ID:       dbNode.ID,
        Name:     dbNode.Name,
        ParentID: dbNode.ParentID,
    }, err
}

// Delete node (cascade delete children)
func (a *App) DeleteTreeNode(id string) error {
    // Recursive delete or use database CASCADE
    return a.db.Where("id = ? OR parent_id = ?", id, id).
        Delete(&TreeNode{}).Error
}
```

---

## TypeScript Types

All types are exported from `types.ts`:

```typescript
import type { 
  TreeNodeItem, 
  TreeIcons,
  TreeNodeEvent,
  TreeRenameEvent,
  TreeCreateEvent,
  TreeDropEvent,
  FlatTreeNode,
  DragState,
  TreeState 
} from '$lib/components/ui/treeComponents/types';
```

---

## Browser Support

- Modern browsers with ES6+ support
- Tested on Chrome, Firefox, Safari, Edge
- Full keyboard accessibility on all platforms

---

## Performance Notes

- Uses recursive rendering (suitable for moderate tree sizes)
- For very large trees (10k+ nodes), consider virtualization
- Drag-drop state is optimized to prevent unnecessary re-renders
- Keyboard navigation uses flattened visible nodes for O(1) lookups

---

## Demo

See the full demo at `/demo-tree` which showcases:
- Expanding/collapsing nodes
- Single and multi-select
- Inline rename (F2 / double-click)
- Adding and deleting nodes
- Drag and drop
- Full keyboard navigation
- Event logging

---

## License

Part of the ElasticGaze project.

---

## Credits

- Built with **Svelte 5** and **TypeScript**
- Icons from **IconPark**
- Follows **WAI-ARIA** accessibility guidelines
- Themed with **ElasticGaze** design system
