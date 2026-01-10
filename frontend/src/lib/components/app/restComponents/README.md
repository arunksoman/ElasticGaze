# REST Components

A comprehensive Postman-like REST API interface for ElasticGaze, built with Svelte 5.

## Overview

The REST components provide a complete interface for creating, organizing, and executing Elasticsearch REST requests. The implementation follows a modular architecture with clean separation of concerns.

## Components

### SecondarySidebar
- Displays the collections tree sidebar
- Toggleable visibility
- Syncs position with main application sidebar
- Contains collection management header

### SecondarySidebarToggle
- Floating button to open the secondary sidebar when closed
- Automatically positioned based on main sidebar state
- Only visible on the REST page

### CollectionTree
- Hierarchical tree view of collections, folders, and requests
- Context menu for CRUD operations
- Color-coded HTTP methods
- Inline editing of names
- Drag-and-drop support (future enhancement)

### RequestTab
- Tab-based interface for multiple open requests
- Each tab contains:
  - Editable request name
  - Send and Save buttons
  - Request configuration area
  - Response viewer
- Split pane layout (resizable)

### UrlConstructor
- HTTP method selector
- URL input field
- Automatic URL construction using default connection
- Full URL display
- Query parameter synchronization

### RequestConfigTabs
- Three tabs for request configuration:
  1. **Body**: JSON code editor
  2. **Query Parameters**: Key-value table with enable/disable toggles
  3. **Description**: Markdown editor with preview

### ResponseViewer
- Displays HTTP response status and duration
- Read-only JSON code editor for response body
- Auto-formatted JSON display
- Error handling and display

## Store (restStore.ts)

Central state management for the REST interface:

### State
- `secondarySidebarOpen`: Boolean for sidebar visibility
- `activeTabs`: Array of open request tabs
- `activeTabId`: Currently active tab ID
- `responses`: Map of tab IDs to responses
- `collections`: Array of collection trees
- `defaultConfigId`: Default Elasticsearch connection ID

### Actions
- **Sidebar**: `toggleSecondarySidebar()`, `setSecondarySidebarOpen()`
- **Collections**: `setCollections()`, `setDefaultConfigId()`
- **Tabs**: `createTab()`, `openRequestTab()`, `closeTab()`, `setActiveTab()`, `updateTab()`, `markTabClean()`
- **Responses**: `setResponse()`, `clearResponse()`

### Derived Stores
- `activeTab`: Currently active tab data
- `activeResponse`: Response for currently active tab

## Types

### RestTab
```typescript
{
  id: string;
  requestId?: number;
  collectionId: number;
  folderId?: number;
  name: string;
  method: string;
  url: string;
  body?: string;
  description?: string;
  queryParams: QueryParam[];
  isDirty: boolean;
}
```

### QueryParam
```typescript
{
  key: string;
  value: string;
  enabled: boolean;
}
```

### RestResponse
```typescript
{
  statusCode: number;
  duration: string;
  body: string;
  error?: string;
}
```

## HTTP Method Colors

Consistent color coding across all components:

- **GET**: Green (`text-green-500`)
- **POST**: Yellow (`text-yellow-500`)
- **PUT**: Blue (`text-blue-500`)
- **DELETE**: Red (`text-red-500`)
- **PATCH**: Purple (`text-purple-500`)
- **HEAD**: Gray (`text-gray-500`)
- **OPTIONS**: Gray (`text-gray-500`)

## Backend Integration

Uses Wails Go bindings:
- `GetAllCollectionTrees()`: Load collection hierarchy
- `CreateCollection()`, `CreateFolder()`, `CreateRequest()`: CRUD operations
- `UpdateRequest()`, `DeleteRequest()`: Manage requests
- `ExecuteRestRequest()`: Execute HTTP requests
- `GetDefaultConfig()`: Get default Elasticsearch connection
- `EnsureDefaultCollection()`: Ensure at least one collection exists

## Features

### Collection Management
- Create, rename, and delete collections
- Nested folder structure (unlimited depth)
- Context menu operations
- Visual tree hierarchy

### Request Management
- Create requests in collections or folders
- Edit request details inline
- Save changes to database
- Track unsaved changes (dirty flag)
- Multiple tabs support

### Request Execution
- Construct full URLs from partial paths
- Add query parameters visually
- Edit JSON request bodies
- Execute requests with proper authentication
- View formatted responses
- Display request duration

### UX Features
- Smooth animations
- Keyboard shortcuts support (planned)
- Resizable split panes
- Auto-save indicators
- Toast notifications for feedback
- Theme-aware styling

## Usage

```svelte
<script>
  import { 
    SecondarySidebar, 
    SecondarySidebarToggle, 
    RequestTab 
  } from '$lib/components/ui/restComponents';
</script>

<SecondarySidebarToggle />
<SecondarySidebar />
<RequestTab />
```

## Styling

All components use CSS custom properties for theming:
- `--color-base-100/200/300`: Background colors
- `--color-base-content`: Text color
- `--color-primary`: Primary action color
- `--color-primary-content`: Primary text color
- `--color-accent`: Accent color
- Method-specific colors for visual coding

## Future Enhancements

- [ ] Drag-and-drop reordering
- [ ] Request history
- [ ] Environment variables
- [ ] Pre-request scripts
- [ ] Test scripts
- [ ] Import/Export collections (Postman format)
- [ ] Keyboard shortcuts
- [ ] Request duplication
- [ ] Bulk operations
- [ ] Search/filter in collections
