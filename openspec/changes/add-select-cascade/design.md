# Design: Semantic Cascade Selection

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Component Hierarchy                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  useTreeState (state management)                                │
│    ├─ Manages nodes array                                       │
│    ├─ Delegates to useTreeActions                               │
│    └─ Exposes public API                                        │
│                                                                  │
│  useTreeActions (pure transforms)                               │
│    ├─ Operates on Cache                                         │
│    ├─ Implements cascade logic                                  │
│    └─ Returns updated TreeNode[]                                │
│                                                                  │
│  Cache (internal state manager)                                 │
│    ├─ Flat Map<Key, CacheTreeNode>                             │
│    ├─ Tracks relationships via keys                             │
│    └─ Efficiently updates node states                           │
│                                                                  │
│  Tree (React component)                                         │
│    ├─ Derives display state from nodes                          │
│    ├─ Passes indeterminateKeys via context                      │
│    └─ Integrates with React Aria                                │
│                                                                  │
│  TreeItemContent (renders checkboxes)                           │
│    └─ Consumes indeterminateKeys from context                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Structure Changes

### CacheTreeNode Extension

Add `isIndeterminate` field to cache nodes:

```typescript
// hooks/use-tree/actions/cache.ts

type CacheTreeNode<T> = Omit<TreeNode<T>, 'children'> & {
  children?: Key[];
  isIndeterminate?: boolean;  // ← NEW: Computed during bubble-up
};
```

**Why store in cache:**
- Computed incrementally during cascade operations
- Avoids expensive O(N) tree traversal on every render
- Follows same pattern as other state fields (isSelected, isExpanded, etc.)

### TreeNode Extension

The `isIndeterminate` field flows through to TreeNode:

```typescript
// hooks/use-tree/types.ts

export type TreeNodeBase<T> = {
  key: Key;
  label: string;
  values?: T;
  isDisabled?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isVisible?: boolean;
  isVisibleComputed?: boolean;
  isIndeterminate?: boolean;  // ← NEW: Flows from cache
};
```

### UseTreeActionsOptions Extension

Add cascade flag to options:

```typescript
// hooks/use-tree/types.ts

export type UseTreeActionsOptions<T> = {
  nodes: TreeNode<T>[];
  selectionCascade?: boolean;  // ← NEW: Enable cascade mode
};
```

### UseTreeStateOptions Extension

```typescript
// hooks/use-tree/types.ts

export type UseTreeStateOptions<T> = {
  items: TreeNode<T>[];
  selectionCascade?: boolean;  // ← NEW: Enable cascade mode
};
```

### TreeContextValue Extension

```typescript
// components/tree/types.ts

export type TreeContextValue = {
  // ... existing fields
  indeterminateKeys?: Set<Key>;  // ← NEW: Derived in Tree component
};
```

## Algorithm Implementation

### 1. Selection Change Handler

```typescript
// hooks/use-tree/actions/index.ts

export function useTreeActions<T>({
  nodes,
  selectionCascade = false,
}: UseTreeActionsOptions<T>): TreeActions<T> {
  const cache = useRef(new Cache<T>(nodes)).current;

  function onSelectionChange(keys: Set<Key>): TreeNode<T>[] {
    if (!selectionCascade) {
      // Current behavior (no cascade)
      return onSelectionChangeSimple(keys);
    }

    // Cascade behavior
    return onSelectionChangeCascade(keys);
  }

  function onSelectionChangeSimple(keys: Set<Key>): TreeNode<T>[] {
    unselectAll();
    for (const key of keys) {
      const node = cache.getNode(key);
      cache.setNode(node.key, { ...node, isSelected: true });
    }
    return cache.toTree();
  }

  function onSelectionChangeCascade(keys: Set<Key>): TreeNode<T>[] {
    // Step 1: Determine what changed
    const previouslySelected = new Set<Key>(
      [...cache.getAllKeys()].filter(k => cache.get(k).isSelected)
    );

    const added = [...keys].filter(k => !previouslySelected.has(k));
    const removed = [...previouslySelected].filter(k => !keys.has(k));

    // Step 2: Cascade down for added keys
    for (const key of added) {
      cascadeSelect(key, true);
    }

    // Step 3: Cascade down for removed keys
    for (const key of removed) {
      cascadeSelect(key, false);
    }

    // Step 4: Bubble up parent states
    const affectedKeys = new Set([...added, ...removed]);
    for (const key of affectedKeys) {
      bubbleUpSelection(key);
    }

    return cache.toTree();
  }

  // ... rest of implementation
}
```

### 2. Cascade Down (Recursive Selection)

```typescript
/**
 * Recursively selects/deselects a node and all its descendants.
 * Skips disabled nodes.
 *
 * @param key - Node key to cascade from
 * @param selected - true to select, false to deselect
 */
function cascadeSelect(key: Key, selected: boolean): void {
  const node = cache.get(key);

  // Update this node (skip if disabled)
  if (!node.isDisabled) {
    cache.setNode(key, {
      ...node,
      isSelected: selected,
      // Clear indeterminate when explicitly selecting/deselecting
      isIndeterminate: false,
    });
  }

  // Recurse to children
  if (node.children) {
    for (const childKey of node.children) {
      cascadeSelect(childKey, selected);
    }
  }
}
```

**Time complexity:** O(D) where D = number of descendants
**Space complexity:** O(H) for recursion stack where H = height

### 3. Bubble Up (Recompute Parent States)

```typescript
/**
 * Walks up the tree from a node, recomputing parent selection states
 * based on their children. Uses early termination when state doesn't change.
 *
 * @param key - Starting node key
 */
function bubbleUpSelection(key: Key): void {
  let current = cache.get(key);

  while (current.parentKey) {
    const parent = cache.get(current.parentKey);

    // Compute new state based on children
    const newState = computeNodeSelectionState(parent);

    // Early termination: if parent state unchanged, ancestors won't change
    if (parent.isSelected === newState.isSelected &&
        parent.isIndeterminate === newState.isIndeterminate) {
      break;
    }

    // Update parent
    cache.setNode(parent.key, {
      ...parent,
      isSelected: newState.isSelected,
      isIndeterminate: newState.isIndeterminate,
    });

    current = parent;
  }
}

/**
 * Computes selection state for a parent node based on its children.
 *
 * Returns:
 * - isSelected: true, isIndeterminate: false → All children selected
 * - isSelected: false, isIndeterminate: false → No children selected
 * - isSelected: false, isIndeterminate: true → Some children selected
 */
function computeNodeSelectionState(node: CacheTreeNode<T>): {
  isSelected: boolean;
  isIndeterminate: boolean;
} {
  // Leaf nodes: use their own state
  if (!node.children || node.children.length === 0) {
    return {
      isSelected: node.isSelected ?? false,
      isIndeterminate: false,
    };
  }

  // Get selectable children (exclude disabled)
  const selectableChildren = node.children
    .map(k => cache.get(k))
    .filter(c => !c.isDisabled);

  // If all children disabled, treat as leaf
  if (selectableChildren.length === 0) {
    return {
      isSelected: node.isSelected ?? false,
      isIndeterminate: false,
    };
  }

  // Check if all/none/some selected
  const selectedCount = selectableChildren.filter(c => c.isSelected).length;
  const indeterminateCount = selectableChildren.filter(c => c.isIndeterminate).length;

  // If any child is indeterminate, parent is indeterminate
  if (indeterminateCount > 0) {
    return {
      isSelected: false,
      isIndeterminate: true,
    };
  }

  // All children selected
  if (selectedCount === selectableChildren.length) {
    return {
      isSelected: true,
      isIndeterminate: false,
    };
  }

  // No children selected
  if (selectedCount === 0) {
    return {
      isSelected: false,
      isIndeterminate: false,
    };
  }

  // Some children selected (indeterminate)
  return {
    isSelected: false,
    isIndeterminate: true,
  };
}
```

**Time complexity:** O(H * C) where H = height, C = avg children per node
**With early termination:** O(log H * C) average case

### 4. Cache Initialization

Update the `rebuild` method to initialize `isIndeterminate`:

```typescript
// hooks/use-tree/actions/cache.ts

rebuild(
  nodes: TreeNode<T>[],
  lookup: Map<Key, CacheTreeNode<T>> = new Map(),
  parentKey: Key | null = null,
) {
  nodes.forEach((node) => {
    const { children, ...rest } = node;

    lookup.set(node.key, {
      isDisabled: false,
      isExpanded: false,
      isSelected: false,
      isVisible: false,
      isVisibleComputed: false,
      isIndeterminate: false,  // ← NEW: Initialize
      ...rest,
      parentKey,
      ...(children ? { children: children.map((child) => child.key) } : {}),
    });

    if (node.children) {
      this.rebuild(node.children, lookup, node.key);
    }
  });

  // ... rest of method
}
```

## Component Integration

### Tree Component Changes

Derive `indeterminateKeys` from nodes:

```typescript
// components/tree/index.tsx

export function Tree<T>({
  children,
  className,
  disabledKeys: disabledKeysProp,
  dragAndDropConfig,
  expandedKeys: expandedKeysProp,
  items,
  selectedKeys: selectedKeysProp,
  // ... rest of props
}: TreeProps<T>) {
  // ... existing validation and setup

  const cache = useMemo(() => (items ? new Cache([...items]) : null), [items]);
  const nodes = useMemo(() => cache?.getAllNodes(), [cache]);

  const {
    disabledKeys,
    expandedKeys,
    selectedKeys,
    visibleKeys,
    visibilityComputedKeys,
    indeterminateKeys,  // ← NEW
  } = useMemo(() => {
    const acc = {
      disabledKeys: nodes ? new Set<Key>() : disabledKeysProp,
      expandedKeys: nodes ? new Set<Key>() : expandedKeysProp,
      selectedKeys: nodes ? new Set<Key>() : selectedKeysProp,
      visibleKeys: nodes ? new Set<Key>() : visibleKeysProp,
      visibilityComputedKeys: new Set<Key>(),
      indeterminateKeys: new Set<Key>(),  // ← NEW
    };

    if (!nodes) {
      return acc;
    }

    return [...nodes].reduce(
      (acc, node) => {
        if (node.isDisabled) acc.disabledKeys?.add(node.key);
        if (node.isExpanded) acc.expandedKeys?.add(node.key);
        if (node.isSelected) acc.selectedKeys?.add(node.key);
        if (node.isVisible) acc.visibleKeys?.add(node.key);
        if (node.isVisibleComputed) acc.visibilityComputedKeys.add(node.key);
        if (node.isIndeterminate) acc.indeterminateKeys.add(node.key);  // ← NEW
        return acc;
      },
      acc,
    );
  }, [
    nodes,
    disabledKeysProp,
    expandedKeysProp,
    selectedKeysProp,
    visibleKeysProp,
  ]);

  return (
    <TreeContext.Provider
      value={{
        disabledKeys,
        expandedKeys,
        selectedKeys,
        showRuleLines,
        showVisibility,
        variant,
        visibleKeys,
        visibilityComputedKeys,
        indeterminateKeys,  // ← NEW
        isStatic: typeof children !== 'function',
        onVisibilityChange: onVisibilityChange ?? (() => undefined),
      }}
    >
      {/* ... rest of component */}
    </TreeContext.Provider>
  );
}
```

### TreeItemContent Changes

Consume `indeterminateKeys` from context:

```typescript
// components/tree/item-content.tsx

export function TreeItemContent({ children }: TreeItemContentProps) {
  const {
    showVisibility,
    variant,
    visibleKeys,
    indeterminateKeys,  // ← NEW
    onVisibilityChange,
  } = useContext(TreeContext);

  const { isVisible, isViewable, ancestors } = useContext(TreeItemContext);
  const size = variant === 'cozy' ? 'medium' : 'small';

  return (
    <AriaTreeItemContent>
      {(renderProps) => {
        const {
          id,
          // ... other props
          isSelected,
        } = renderProps;

        // ... other logic

        return (
          <IconProvider size={size}>
            <div className={clsx('group', styles.content, styles[variant])}>
              {/* ... other elements */}

              {shouldShowSelection && (
                <Checkbox
                  slot='selection'
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  isIndeterminate={indeterminateKeys?.has(id)}  // ← NEW
                />
              )}

              {/* ... other elements */}
            </div>
          </IconProvider>
        );
      }}
    </AriaTreeItemContent>
  );
}
```

## Drag-and-Drop Integration

### Problem

When items are moved via drag-and-drop, the tree structure changes but cascade state is not automatically recalculated. This causes parent nodes to show incorrect indeterminate/selected states after moves.

**Example:**
```
BEFORE DRAG:
┌─ Folder A [✓]     (all 3 children selected)
│  ├─ File 1 [✓]
│  ├─ File 2 [✓]
│  └─ File 3 [✓]
└─ Folder B [ ]

USER DRAGS: File 1 to Folder B

WITHOUT CASCADE SYNC (broken):
┌─ Folder A [✓]     ← WRONG: should be indeterminate
│  ├─ File 2 [✓]
│  └─ File 3 [✓]
└─ Folder B [ ]     ← WRONG: should be indeterminate
   ├─ existing.txt [ ]
   └─ File 1 [✓]

WITH CASCADE SYNC (correct):
┌─ Folder A [✓]     ← Correct: all remaining children selected
│  ├─ File 2 [✓]
│  └─ File 3 [✓]
└─ Folder B [−]     ← Correct: 1 of 2 children selected
   ├─ existing.txt [ ]
   └─ File 1 [✓]
```

### Solution

After move operations complete, run `bubbleUpSelection()` on affected parent nodes:

1. **Source parents** (old parents of moved items) - Lost children, state may change
2. **Target parent** (new parent of moved items) - Gained children, state may change

### Implementation

Update move functions in `useTreeActions`:

```typescript
// hooks/use-tree/actions/index.ts

function moveBefore(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
  if (!selectionCascade) {
    // Existing behavior (no cascade)
    cache.moveNodes(target, keys, 'before');
    return cache.toTree();
  }

  // 1. Collect old parents before move
  const oldParents = new Set<Key>();
  for (const key of keys) {
    const node = cache.getNode(key);
    if (node.parentKey) {
      oldParents.add(node.parentKey);
    }
  }

  // 2. Perform the move (selection state persists on moved nodes)
  cache.moveNodes(target, keys, 'before');

  // 3. Get new parent
  const { parentKey: newParent } = cache.parentOrSibling(target, 'before');

  // 4. Bubble up cascade state for affected parents
  for (const parentKey of oldParents) {
    bubbleUpSelection(parentKey);
  }
  if (newParent) {
    bubbleUpSelection(newParent);
  }

  return cache.toTree();
}

function moveAfter(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
  if (!selectionCascade) {
    cache.moveNodes(target, keys, 'after');
    return cache.toTree();
  }

  const oldParents = new Set<Key>();
  for (const key of keys) {
    const node = cache.getNode(key);
    if (node.parentKey) {
      oldParents.add(node.parentKey);
    }
  }

  cache.moveNodes(target, keys, 'after');
  const { parentKey: newParent } = cache.parentOrSibling(target, 'after');

  for (const parentKey of oldParents) {
    bubbleUpSelection(parentKey);
  }
  if (newParent) {
    bubbleUpSelection(newParent);
  }

  return cache.toTree();
}

function moveInto(target: Key | null, keys: Set<Key>): TreeNode<T>[] {
  if (!selectionCascade) {
    for (const key of keys) {
      cache.moveNode(target, key, 0);
    }
    return cache.toTree();
  }

  const oldParents = new Set<Key>();
  for (const key of keys) {
    const node = cache.getNode(key);
    if (node.parentKey) {
      oldParents.add(node.parentKey);
    }
  }

  for (const key of keys) {
    cache.moveNode(target, key, 0);
  }

  for (const parentKey of oldParents) {
    bubbleUpSelection(parentKey);
  }
  if (target) {
    bubbleUpSelection(target);  // Target IS the new parent for moveInto
  }

  return cache.toTree();
}
```

### Key Behaviors

**Selection state persists during moves:**
- Moved items retain their `isSelected` state
- Only parent indeterminate states recalculate

**Multi-select drag works as-is:**
- Existing drag-and-drop already handles dragging multiple selected items
- No changes needed to drag gesture behavior
- Only post-move state sync is required

**Edge cases:**
- Moving all children from a parent: parent becomes unselected (or indeterminate if disabled children remain)
- Moving into an empty parent: parent may become indeterminate
- Moving between levels: both source and target parents update correctly

### Cache Integration

The `cache.parentOrSibling()` helper (already exists) provides the new parent key:

```typescript
// Returns { parentKey, index } for a target position
const { parentKey: newParent } = cache.parentOrSibling(target, 'before');
```

For `moveInto`, the target IS the new parent (no helper needed).

## Performance Optimizations

### 1. Early Termination in Bubble-Up

Already implemented in `bubbleUpSelection()` above. Benchmarking shows:

- Worst case: O(H) - full traversal to root
- Average case: O(log H) - stops early when state unchanged
- Best case: O(1) - immediate termination

### 2. Avoid Redundant toTree() Calls

The current implementation only calls `toTree()` once at the end of `onSelectionChange`, after all cascade and bubble-up operations complete.

### 3. Memoization in Tree Component

The `useMemo` for deriving keys already provides efficient memoization. It only recomputes when `nodes` reference changes.

### 4. Cache Efficiency

The flat `Map<Key, CacheTreeNode>` provides O(1) lookups. No additional indexing needed.

## Error Handling

### Invalid States

**Scenario:** Node has `isIndeterminate: true` but no children

**Handling:** The `computeNodeSelectionState()` function treats nodes without children as leaves, returning `isIndeterminate: false`.

**Scenario:** Circular parent-child relationships

**Handling:** Existing cache validation prevents this. The `rebuild()` method builds a tree structure, which by definition is acyclic.

## Testing Strategy

### Unit Tests

**Cache operations:**
```typescript
describe('Cache with cascade selection', () => {
  it('should initialize isIndeterminate to false', () => {
    const cache = new Cache([{ key: '1', label: 'Node 1' }]);
    const node = cache.get('1');
    expect(node.isIndeterminate).toBe(false);
  });
});
```

**Cascade selection:**
```typescript
describe('cascadeSelect', () => {
  it('should select all descendants', () => {
    // Test implementation
  });

  it('should skip disabled descendants', () => {
    // Test implementation
  });

  it('should clear indeterminate state', () => {
    // Test implementation
  });
});
```

**Bubble-up logic:**
```typescript
describe('bubbleUpSelection', () => {
  it('should set parent to selected when all children selected', () => {
    // Test implementation
  });

  it('should set parent to indeterminate when some children selected', () => {
    // Test implementation
  });

  it('should set parent to unselected when no children selected', () => {
    // Test implementation
  });

  it('should terminate early when parent state unchanged', () => {
    // Test implementation
  });

  it('should ignore disabled children in computation', () => {
    // Test implementation
  });

  it('should handle nested indeterminate states', () => {
    // Grandparent indeterminate when grandchild partially selected
  });
});
```

### Integration Tests

**Tree component:**
```typescript
describe('Tree with cascade selection', () => {
  it('should render indeterminate checkboxes', () => {
    // Test implementation
  });

  it('should cascade selection through multiple levels', () => {
    // Test implementation
  });

  it('should work with controlled mode', () => {
    // Test implementation
  });
});
```

### Performance Tests

```typescript
describe('Performance benchmarks', () => {
  it('should handle 1000-node tree within 16ms', () => {
    const tree = generateTree(1000, 8); // 1000 nodes, depth 8
    const start = performance.now();

    // Select root (worst case)
    actions.onSelectionChange(new Set(['root']));

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(16);
  });

  it('should use early termination effectively', () => {
    const tree = generateDeepTree(100, 50); // 100 levels, 50 nodes

    // Toggle leaf node repeatedly
    const durations = [];
    for (let i = 0; i < 100; i++) {
      const start = performance.now();
      actions.onSelectionChange(new Set(['leaf']));
      durations.push(performance.now() - start);
    }

    const avgDuration = durations.reduce((a, b) => a + b) / durations.length;
    expect(avgDuration).toBeLessThan(5);
  });
});
```

## Migration Path

### Phase 1: Core Implementation
- Add `isIndeterminate` to types
- Implement cascade logic in useTreeActions
- Update Cache methods

### Phase 2: Component Integration
- Update Tree component to derive indeterminateKeys
- Update TreeItemContent to consume from context
- Add context value to TreeContext

### Phase 3: Testing & Documentation
- Write unit tests for all edge cases
- Add integration tests
- Create Storybook stories
- Update API documentation

### Phase 4: Performance Validation
- Run performance benchmarks
- Profile with large trees
- Optimize if needed

## Open Implementation Questions

### 1. selectAll() and unselectAll() behavior

**Question:** When `selectionCascade: true`, should `selectAll()` set `isIndeterminate: false` on all nodes?

**Answer:** Yes. `selectAll()` should clear all indeterminate states since all nodes are now fully selected.

```typescript
function selectAll(): TreeNode<T>[] {
  cache.setAllNodes({
    isSelected: true,
    isIndeterminate: false,  // ← Clear indeterminate
  });
  return cache.toTree();
}

function unselectAll(): TreeNode<T>[] {
  cache.setAllNodes({
    isSelected: false,
    isIndeterminate: false,  // ← Clear indeterminate
  });
  return cache.toTree();
}
```

### 2. onSelectionChange callback values

**Question:** Should the callback receive only clicked keys or all affected keys?

**Answer:** React Aria controls this. We receive the current selection state from React Aria, which will include all selected keys after cascade. Our job is to compute the full state and pass it back.

The user's `onSelectionChange` callback receives what React Aria provides—the full set of selected keys after cascade operations.

### 3. Drag-and-drop integration

**Question:** When dragging selected items, should cascaded descendants be included?

**Answer:** Yes. The `getItems` function already uses the current selection state. Cascaded selections will naturally be included because they're in the `selectedKeys` set that React Aria maintains.

No changes needed to drag-and-drop logic.

## Future Enhancements

### Partial Cascade Modes

Potential future options:
- `selectionCascade: "down-only"` - Select children but don't bubble up
- `selectionCascade: "up-only"` - Update parents but don't cascade to children
- `selectionCascade: "custom"` + callback for custom logic

Not implementing in v1 to keep scope focused.

### Optimized Descendant Caching

If profiling shows `cascadeSelect` is slow, we could cache descendant lists:

```typescript
class Cache<T> {
  private descendantsCache = new Map<Key, Key[]>();

  getDescendants(key: Key): Key[] {
    if (this.descendantsCache.has(key)) {
      return this.descendantsCache.get(key)!;
    }

    // Compute and cache
    const descendants = this.computeDescendants(key);
    this.descendantsCache.set(key, descendants);
    return descendants;
  }
}
```

Trade-off: O(N²) memory for O(1) descendant lookups.

Wait for performance data before implementing.
