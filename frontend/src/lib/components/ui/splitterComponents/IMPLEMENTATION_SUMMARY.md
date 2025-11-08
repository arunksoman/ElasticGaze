# Splitter Component - Implementation Summary

## Overview

A simplified, lightweight splitter component system for Svelte 5 that provides intuitive pane resizing through draggable handles.

## Architecture

### Component Structure

```
splitterComponents/
├── Splitter.svelte         # Main container component (~280 lines)
├── SplitterPane.svelte     # Individual pane wrapper (~30 lines)
├── SplitterHandle.svelte   # Draggable handle (~70 lines)
├── types.ts                # TypeScript definitions
├── splitterStore.ts        # Global state store (legacy, not used)
└── index.ts                # Barrel exports
```

### Core Components

#### 1. Splitter.svelte
**Purpose**: Orchestrates the layout, handles drag logic, and manages pane sizes.

**Key Responsibilities**:
- Initialize panes from DOM children
- Handle pointer events for drag operations
- Apply size constraints (min/max)
- Persist layouts to localStorage
- Respond to window resize events
- Reorder DOM to interleave panes and handles

**State Management**:
```typescript
let paneElements: HTMLElement[] = $state([]);      // DOM references
let paneSizes: number[] = $state([]);              // Current sizes in pixels
let paneMinSizes: number[] = $state([]);           // Minimum sizes
let paneMaxSizes: (number | undefined)[] = $state([]); // Maximum sizes
let isDragging = $state(false);                    // Drag state
let dragHandleIndex = $state(-1);                  // Which handle is being dragged
```

#### 2. SplitterPane.svelte
**Purpose**: Wrapper for individual pane content.

**Features**:
- Accepts `id`, `minSize`, `maxSize` props
- Renders children content
- Provides `.splitter-pane` class for DOM querying
- Simple overflow handling

#### 3. SplitterHandle.svelte
**Purpose**: Visual and interactive handle between panes.

**Features**:
- Displays drag icon from `@icon-park/svg`
- Changes cursor based on direction (col-resize / row-resize)
- Hover effects using theme colors
- Pointer event handling

## Key Algorithms

### 1. Initialization

```typescript
async function initializePanes() {
  // 1. Query DOM for pane elements (filter out handles)
  const paneNodes = allChildren.filter(el => !el.classList.contains('splitter-handle'));
  
  // 2. Extract constraints from props
  paneMinSizes = paneNodes.map((_, index) => 
    Array.isArray(minSize) ? (minSize[index] ?? 100) : minSize
  );
  
  // 3. Load from storage or calculate initial sizes
  if (savedSizes) {
    paneSizes = savedSizes;
  } else {
    // Use initialSizes weights or equal distribution
    const total = initialSizes.reduce((sum, size) => sum + size, 0);
    paneSizes = initialSizes.map(size => (size / total) * availableSize);
  }
  
  // 4. Apply sizes to DOM
  applyPaneSizes();
  
  // 5. Reorder DOM: [Pane A][Handle 1][Pane B][Handle 2][Pane C]
  await reorderElements();
}
```

### 2. Drag Resize Logic

```typescript
function handleDragMove(e: PointerEvent) {
  const delta = currentPosition - dragStartPosition;
  const leftIndex = dragHandleIndex;
  const rightIndex = dragHandleIndex + 1;
  
  // Calculate new sizes
  let newLeftSize = dragStartSizes[leftIndex] + delta;
  let newRightSize = dragStartSizes[rightIndex] - delta;
  
  // Apply min/max constraints
  newLeftSize = Math.max(newLeftSize, paneMinSizes[leftIndex]);
  newRightSize = Math.max(newRightSize, paneMinSizes[rightIndex]);
  
  // Maintain total size between the two panes
  const totalSize = dragStartSizes[leftIndex] + dragStartSizes[rightIndex];
  newRightSize = totalSize - newLeftSize;
  
  // Re-check constraints (ensure we don't violate min sizes)
  if (newRightSize < paneMinSizes[rightIndex]) {
    newRightSize = paneMinSizes[rightIndex];
    newLeftSize = totalSize - newRightSize;
  }
  
  // Update only these two panes
  paneSizes[leftIndex] = newLeftSize;
  paneSizes[rightIndex] = newRightSize;
  
  applyPaneSizes();
}
```

**Key Principle**: Only the two panes adjacent to the dragged handle are affected. Other panes remain unchanged.

### 3. DOM Reordering

```typescript
async function reorderElements() {
  const panes = Array.from(wrapper.querySelectorAll('.splitter-pane'));
  const handles = Array.from(wrapper.querySelectorAll('.splitter-handle'));
  
  const fragment = document.createDocumentFragment();
  
  // Interleave: [Pane][Handle][Pane][Handle][Pane]
  for (let i = 0; i < panes.length; i++) {
    fragment.appendChild(panes[i]);
    if (i < handles.length && handles[i]) {
      fragment.appendChild(handles[i]);
    }
  }
  
  wrapper.innerHTML = '';
  wrapper.appendChild(fragment);
}
```

**Why**: Svelte renders all panes first, then all handles. We need them interleaved for proper flexbox layout.

### 4. Window Resize Handling

```typescript
function handleWindowResize() {
  const newContainerSize = getContainerSize();
  const currentTotalSize = paneSizes.reduce((sum, size) => sum + size, 0);
  const availableSize = newContainerSize - totalGutterSize;
  
  // Proportionally scale all panes
  const ratio = availableSize / currentTotalSize;
  paneSizes = paneSizes.map(size => size * ratio);
  
  applyPaneSizes();
}
```

## Data Flow

```
User Interaction (Drag Handle)
  ↓
handleDragMove()
  ↓
Calculate new sizes with constraints
  ↓
Update paneSizes[] state
  ↓
applyPaneSizes() → Update DOM styles
  ↓
onresize callback (optional)
  ↓
saveToStorage() (if storageKey provided)
```

## Styling Strategy

### Flexbox Layout
```css
.splitter-wrapper {
  display: flex;
  flex-direction: row; /* or column for vertical */
}

.splitter-pane {
  flex-shrink: 0;
  flex-basis: {size}px; /* Set dynamically */
}
```

### Theme Integration
Uses CSS variables from `app.css`:
- `--color-base-*` for backgrounds
- `--color-primary*` for hover states
- No hardcoded colors

## Removed Features (from previous version)

- ❌ Collapse/expand functionality
- ❌ Snap-to-collapse threshold
- ❌ Keyboard navigation
- ❌ ARIA attributes
- ❌ Complex event system
- ❌ Previous sizes tracking for expand

## Public API

```typescript
// Component reference methods
splitterRef.setSizes([300, 400, 300]);  // Set specific sizes
const sizes = splitterRef.getSizes();   // Get current sizes
```

## Performance Considerations

1. **Throttled Resize Events**: `onresize` callback is throttled to ~60fps
2. **DocumentFragment**: DOM reordering uses fragments for efficiency
3. **Direct Style Updates**: Sizes applied directly to DOM (no reactive overhead)
4. **Passive Event Listeners**: Prevents scroll blocking (except pointermove)

## Browser Compatibility

- Modern browsers with Pointer Events API
- CSS Flexbox support
- localStorage (optional, for persistence)

## File Sizes

- Splitter.svelte: ~280 lines (simplified from 670 lines)
- SplitterPane.svelte: ~30 lines (simplified from 80 lines)
- SplitterHandle.svelte: ~70 lines (simplified from 135 lines)

**Total**: ~380 lines vs ~885 lines previously (57% reduction)

## Future Enhancements (Optional)

- Touch event optimization for mobile
- Animation/transition options
- Nested splitters support
- Programmatic resize with animation

## Dependencies

- `svelte` - Framework
- `@icon-park/svg` - Drag icon
- No other external dependencies

## Testing Recommendations

1. Test min/max constraints at boundaries
2. Verify localStorage persistence across sessions
3. Test window resize behavior
4. Check performance with many panes (5+)
5. Test touch events on mobile devices

---

**Last Updated**: November 9, 2025
**Version**: 2.0 (Simplified)
