# Implementation Tasks: Cascade Selection

## Task Overview

```
Phase 1: Type Definitions (Foundation)
  └─→ Phase 2: Cache & Core Logic (Business Logic)
       └─→ Phase 3: Hook Integration (API Layer)
            └─→ Phase 4: Component Integration (UI Layer)
                 └─→ Phase 5: Testing & Documentation (Quality)
```

---

## Phase 1: Type Definitions

### Task 1.1: Extend CacheTreeNode Type
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/cache.ts`

**Changes:**
```typescript
type CacheTreeNode<T> = Omit<TreeNode<T>, 'children'> & {
  children?: Key[];
  isIndeterminate?: boolean;  // ← ADD
};
```

**Acceptance:**
- TypeScript compiles without errors
- No breaking changes to existing Cache methods

**Dependencies:** None

---

### Task 1.2: Extend TreeNodeBase Type
**File:** `packages/design-toolkit/src/hooks/use-tree/types.ts`

**Changes:**
```typescript
export type TreeNodeBase<T> = {
  key: Key;
  label: string;
  values?: T;
  isDisabled?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isVisible?: boolean;
  isVisibleComputed?: boolean;
  isIndeterminate?: boolean;  // ← ADD
};
```

**Acceptance:**
- TypeScript compiles
- No breaking changes to existing code using TreeNode

**Dependencies:** None

---

### Task 1.3: Extend UseTreeActionsOptions Type
**File:** `packages/design-toolkit/src/hooks/use-tree/types.ts`

**Changes:**
```typescript
export type UseTreeActionsOptions<T> = {
  nodes: TreeNode<T>[];
  selectionCascade?: boolean;  // ← ADD
};
```

**Acceptance:**
- Type compiles
- Optional parameter (default: false implied)

**Dependencies:** None

---

### Task 1.4: Extend UseTreeStateOptions Type
**File:** `packages/design-toolkit/src/hooks/use-tree/types.ts`

**Changes:**
```typescript
export type UseTreeStateOptions<T> = {
  items: TreeNode<T>[];
  selectionCascade?: boolean;  // ← ADD
};
```

**Acceptance:**
- Type compiles
- Optional parameter

**Dependencies:** None

---

### Task 1.5: Extend TreeContextValue Type
**File:** `packages/design-toolkit/src/components/tree/types.ts`

**Changes:**
```typescript
export type TreeContextValue = {
  // ... existing fields
  indeterminateKeys?: Set<Key>;  // ← ADD
};
```

**Acceptance:**
- Type compiles
- Context can be created with new field

**Dependencies:** None

---

## Phase 2: Cache & Core Logic

### Task 2.1: Initialize isIndeterminate in Cache.rebuild()
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/cache.ts`

**Changes:**
Update `rebuild()` method to initialize `isIndeterminate: false`:

```typescript
lookup.set(node.key, {
  isDisabled: false,
  isExpanded: false,
  isSelected: false,
  isVisible: false,
  isVisibleComputed: false,
  isIndeterminate: false,  // ← ADD
  ...rest,
  parentKey,
  ...(children ? { children: children.map((child) => child.key) } : {}),
});
```

**Acceptance:**
- All nodes have `isIndeterminate: false` after rebuild
- Existing tests pass

**Dependencies:** Task 1.1

---

### Task 2.2: Implement cascadeSelect() Function
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/index.ts`

**Implementation:**
```typescript
function cascadeSelect(key: Key, selected: boolean): void {
  const node = cache.get(key);

  if (!node.isDisabled) {
    cache.setNode(key, {
      ...node,
      isSelected: selected,
      isIndeterminate: false,
    });
  }

  if (node.children) {
    for (const childKey of node.children) {
      cascadeSelect(childKey, selected);
    }
  }
}
```

**Acceptance:**
- Recursively updates descendants
- Skips disabled nodes
- Clears indeterminate flag
- Unit tests pass (see test cases below)

**Test Cases:**
```typescript
describe('cascadeSelect', () => {
  it('should select node and all descendants');
  it('should deselect node and all descendants');
  it('should skip disabled descendants');
  it('should clear indeterminate flag');
  it('should handle deep hierarchies');
});
```

**Dependencies:** Task 2.1

---

### Task 2.3: Implement computeNodeSelectionState() Function
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/index.ts`

**Implementation:**
```typescript
function computeNodeSelectionState(node: CacheTreeNode<T>): {
  isSelected: boolean;
  isIndeterminate: boolean;
} {
  // Implementation per design.md
  // See SPEC-4 in specification
}
```

**Acceptance:**
- Follows truth table from specification (SPEC-4)
- Handles disabled children correctly
- Handles leaf nodes
- Unit tests pass

**Test Cases:**
```typescript
describe('computeNodeSelectionState', () => {
  it('should return selected when all children selected');
  it('should return unselected when no children selected');
  it('should return indeterminate when some children selected');
  it('should return indeterminate when any child is indeterminate');
  it('should ignore disabled children');
  it('should treat parent with only disabled children as leaf');
  it('should handle leaf nodes correctly');
});
```

**Dependencies:** Task 2.1

---

### Task 2.4: Implement bubbleUpSelection() Function
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/index.ts`

**Implementation:**
```typescript
function bubbleUpSelection(key: Key): void {
  let current = cache.get(key);

  while (current.parentKey) {
    const parent = cache.get(current.parentKey);
    const newState = computeNodeSelectionState(parent);

    // Early termination
    if (parent.isSelected === newState.isSelected &&
        parent.isIndeterminate === newState.isIndeterminate) {
      break;
    }

    cache.setNode(parent.key, {
      ...parent,
      isSelected: newState.isSelected,
      isIndeterminate: newState.isIndeterminate,
    });

    current = parent;
  }
}
```

**Acceptance:**
- Walks up tree updating parent states
- Uses early termination optimization
- Unit tests pass

**Test Cases:**
```typescript
describe('bubbleUpSelection', () => {
  it('should update parent state based on children');
  it('should propagate through multiple levels');
  it('should terminate early when parent state unchanged');
  it('should handle deep hierarchies');
});
```

**Dependencies:** Task 2.3

---

### Task 2.5: Implement onSelectionChangeCascade() Function
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/index.ts`

**Implementation:**
```typescript
function onSelectionChangeCascade(keys: Set<Key>): TreeNode<T>[] {
  // Detect changes
  const previouslySelected = new Set<Key>(
    [...cache.getAllKeys()].filter(k => cache.get(k).isSelected)
  );

  const added = [...keys].filter(k => !previouslySelected.has(k));
  const removed = [...previouslySelected].filter(k => !keys.has(k));

  // Cascade down
  for (const key of added) {
    cascadeSelect(key, true);
  }

  for (const key of removed) {
    cascadeSelect(key, false);
  }

  // Bubble up
  const affectedKeys = new Set([...added, ...removed]);
  for (const key of affectedKeys) {
    bubbleUpSelection(key);
  }

  return cache.toTree();
}
```

**Acceptance:**
- Correctly detects added/removed keys
- Cascades down for all changes
- Bubbles up for all affected nodes
- Integration tests pass

**Test Cases:**
```typescript
describe('onSelectionChangeCascade', () => {
  it('should handle selecting single node');
  it('should handle deselecting single node');
  it('should handle multiple simultaneous changes');
  it('should maintain tree consistency');
});
```

**Dependencies:** Tasks 2.2, 2.4

---

### Task 2.6: Update onSelectionChange() with Cascade Logic
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/index.ts`

**Changes:**
Modify `onSelectionChange` to check `selectionCascade` flag:

```typescript
function onSelectionChange(keys: Set<Key>): TreeNode<T>[] {
  if (!selectionCascade) {
    // Current behavior
    unselectAll();
    for (const key of keys) {
      const node = cache.getNode(key);
      cache.setNode(node.key, { ...node, isSelected: true });
    }
    return cache.toTree();
  }

  // Cascade behavior
  return onSelectionChangeCascade(keys);
}
```

**Acceptance:**
- Default behavior unchanged (selectionCascade: false)
- Cascade mode works when enabled
- All existing tests pass
- New cascade tests pass

**Dependencies:** Task 2.5

---

### Task 2.7: Update selectAll() and unselectAll()
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/index.ts`

**Changes:**
Clear `isIndeterminate` flag:

```typescript
function selectAll(): TreeNode<T>[] {
  cache.setAllNodes({
    isSelected: true,
    isIndeterminate: false,  // ← ADD
  });
  return cache.toTree();
}

function unselectAll(): TreeNode<T>[] {
  cache.setAllNodes({
    isSelected: false,
    isIndeterminate: false,  // ← ADD
  });
  return cache.toTree();
}
```

**Acceptance:**
- All indeterminate states cleared
- Tests pass

**Dependencies:** Task 2.1

---

## Phase 3: Hook Integration

### Task 3.1: Update useTreeActions to Accept Cascade Flag
**File:** `packages/design-toolkit/src/hooks/use-tree/actions/index.ts`

**Changes:**
```typescript
export function useTreeActions<T>({
  nodes,
  selectionCascade = false,  // ← ADD parameter
}: UseTreeActionsOptions<T>): TreeActions<T> {
  // Store in closure for use in onSelectionChange
  // ... rest of implementation
}
```

**Acceptance:**
- Parameter accepted and used
- Default value is false
- No breaking changes

**Dependencies:** Task 1.3, Task 2.6

---

### Task 3.2: Update useTreeState to Accept and Pass Cascade Flag
**File:** `packages/design-toolkit/src/hooks/use-tree/state/index.ts`

**Changes:**
```typescript
export function useTreeState<T>({
  items,
  selectionCascade = false,  // ← ADD parameter
}: UseTreeStateOptions<T>): UseTreeState<T> {
  const [nodes, setNodes] = useState(items);
  const actions = useTreeActions<T>({ nodes, selectionCascade });  // ← PASS

  // ... rest of implementation
}
```

**Acceptance:**
- Parameter passed to useTreeActions
- Default value is false
- Hook tests pass

**Dependencies:** Task 1.4, Task 3.1

---

## Phase 4: Component Integration

### Task 4.1: Derive indeterminateKeys in Tree Component
**File:** `packages/design-toolkit/src/components/tree/index.tsx`

**Changes:**
Add `indeterminateKeys` to the derived state useMemo (around line 139-195):

```typescript
const {
  disabledKeys,
  expandedKeys,
  selectedKeys,
  visibleKeys,
  visibilityComputedKeys,
  indeterminateKeys,  // ← ADD
} = useMemo(() => {
  const acc = {
    disabledKeys: nodes ? new Set<Key>() : disabledKeysProp,
    expandedKeys: nodes ? new Set<Key>() : expandedKeysProp,
    selectedKeys: nodes ? new Set<Key>() : selectedKeysProp,
    visibleKeys: nodes ? new Set<Key>() : visibleKeysProp,
    visibilityComputedKeys: new Set<Key>(),
    indeterminateKeys: new Set<Key>(),  // ← ADD
  };

  if (!nodes) {
    return acc;
  }

  return [...nodes].reduce((acc, node) => {
    // ... existing field checks
    if (node.isIndeterminate) acc.indeterminateKeys.add(node.key);  // ← ADD
    return acc;
  }, acc);
}, [nodes, disabledKeysProp, expandedKeysProp, selectedKeysProp, visibleKeysProp]);
```

**Acceptance:**
- indeterminateKeys derived correctly
- Only recomputes when nodes change
- Component tests pass

**Dependencies:** Task 1.2, Task 1.5

---

### Task 4.2: Pass indeterminateKeys Through TreeContext
**File:** `packages/design-toolkit/src/components/tree/index.tsx`

**Changes:**
Add to context provider (around line 206-218):

```typescript
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
    indeterminateKeys,  // ← ADD
    isStatic: typeof children !== 'function',
    onVisibilityChange: onVisibilityChange ?? (() => undefined),
  }}
>
```

**Acceptance:**
- Context value includes indeterminateKeys
- No TypeScript errors

**Dependencies:** Task 4.1

---

### Task 4.3: Consume indeterminateKeys in TreeItemContent
**File:** `packages/design-toolkit/src/components/tree/item-content.tsx`

**Changes:**
```typescript
export function TreeItemContent({ children }: TreeItemContentProps) {
  const {
    showVisibility,
    variant,
    visibleKeys,
    indeterminateKeys,  // ← ADD
    onVisibilityChange,
  } = useContext(TreeContext);

  // ... later in render (around line 135-141)

  {shouldShowSelection && (
    <Checkbox
      slot='selection'
      isSelected={isSelected}
      isDisabled={isDisabled}
      isIndeterminate={indeterminateKeys?.has(id)}  // ← ADD
    />
  )}
```

**Acceptance:**
- Checkbox receives isIndeterminate prop
- Visual state renders correctly
- Component tests pass

**Dependencies:** Task 4.2

---

## Phase 5: Testing & Documentation

### Task 5.1: Write Unit Tests for Core Functions
**Files:**
- `packages/design-toolkit/src/hooks/use-tree/actions/index.test.ts` (new)
- `packages/design-toolkit/src/hooks/use-tree/actions/cache.test.ts`

**Test Coverage:**
- cascadeSelect() - 5 test cases
- computeNodeSelectionState() - 7 test cases
- bubbleUpSelection() - 4 test cases
- onSelectionChangeCascade() - 4 test cases

**Acceptance:**
- All test cases from spec.md implemented
- 100% code coverage for new functions
- All tests pass

**Dependencies:** Phase 2 complete

---

### Task 5.2: Write Integration Tests for useTreeState
**File:** `packages/design-toolkit/src/hooks/use-tree/state/index.test.ts`

**Test Cases:**
```typescript
describe('useTreeState with cascade', () => {
  it('should cascade selection through tree');
  it('should show indeterminate for partial selections');
  it('should respect disabled nodes');
  it('should work with controlled mode');
  it('should work with uncontrolled mode');
});
```

**Acceptance:**
- Tests cover all user-facing API scenarios
- Tests use realistic tree structures
- All tests pass

**Dependencies:** Phase 3 complete

---

### Task 5.3: Write Component Tests for Tree
**File:** `packages/design-toolkit/src/components/tree/tree.test.tsx`

**Test Cases:**
```typescript
describe('Tree component with cascade', () => {
  it('should render indeterminate checkboxes');
  it('should handle user interactions correctly');
  it('should integrate with React Aria selection');
  it('should work with keyboard navigation');
});
```

**Acceptance:**
- Tests use Testing Library best practices
- Visual states verified
- User interactions tested
- All tests pass

**Dependencies:** Phase 4 complete

---

### Task 5.4: Write Performance Benchmarks
**File:** `packages/design-toolkit/src/hooks/use-tree/performance.bench.ts` (new)

**Benchmarks:**
```typescript
describe('Performance benchmarks', () => {
  it('100 nodes: < 5ms');
  it('1000 nodes: < 16ms');
  it('10000 nodes: < 100ms');
  it('early termination effectiveness');
});
```

**Acceptance:**
- All benchmarks meet performance targets
- Results documented in PR

**Dependencies:** Phase 2 complete

---

### Task 5.5: Create Storybook Stories
**File:** `packages/design-toolkit/src/components/tree/tree.stories.tsx`

**Stories:**
- "Cascade Selection - Basic"
- "Cascade Selection - With Disabled Nodes"
- "Cascade Selection - Deep Hierarchy"
- "Cascade Selection - File System Example"
- "Comparison - With and Without Cascade"

**Acceptance:**
- Stories demonstrate all key behaviors
- Visual regression tests pass
- Examples are clear and realistic

**Dependencies:** Phase 4 complete

---

### Task 5.6: Update API Documentation
**Files:**
- `packages/design-toolkit/src/hooks/use-tree/state/index.ts` (JSDoc)
- `packages/design-toolkit/src/hooks/use-tree/types.ts` (JSDoc)

**Changes:**
Add JSDoc for new `selectionCascade` parameter:

```typescript
/**
 * @param options.selectionCascade - Enable semantic cascade selection mode.
 *   When true, selecting a parent automatically selects all descendants,
 *   and parent state reflects children (selected/indeterminate/unselected).
 *   Default: false. Only works with dynamic collections (items prop).
 *
 * @example
 * ```tsx
 * const { nodes, actions } = useTreeState({
 *   items: myTree,
 *   selectionCascade: true,
 * });
 * ```
 */
```

**Acceptance:**
- JSDoc complete and accurate
- Examples included
- TypeDoc generates correctly

**Dependencies:** Phase 3 complete

---

### Task 5.7: Update User-Facing Documentation
**File:** `packages/design-toolkit/src/components/tree/tree.docs.mdx`

**Changes:**
- Add section on cascade selection
- Include visual examples
- Explain indeterminate state
- Show code examples
- Document disabled node behavior

**Acceptance:**
- Documentation clear and complete
- Examples working and accurate
- Storybook docs render correctly

**Dependencies:** Task 5.5, Task 5.6

---

### Task 5.8: Create Changeset
**File:** `.changeset/[random]-cascade-selection.md` (new)

**Content:**
```markdown
---
'@accelint/design-toolkit': minor
---

Add semantic cascade selection mode to Tree component. When enabled via
`selectionCascade` prop, selecting a parent node automatically selects all
descendants, and parent checkboxes show indeterminate state when partially
selected. Includes performance optimizations for large trees.
```

**Acceptance:**
- Changeset created
- Appropriate semver level (minor)
- Clear description

**Dependencies:** All tasks complete

---

## Task Summary

| Phase | Tasks | Dependencies |
|-------|-------|--------------|
| Phase 1: Types | 5 | None |
| Phase 2: Core Logic | 7 | Phase 1 |
| Phase 3: Hook Integration | 2 | Phase 2 |
| Phase 4: Component Integration | 3 | Phase 3 |
| Phase 5: Testing & Docs | 8 | Phases 2-4 |
| **Total** | **25 tasks** | Sequential phases |

## Estimated Timeline

- **Phase 1**: 2 hours (straightforward type changes)
- **Phase 2**: 1-2 days (core algorithm implementation)
- **Phase 3**: 2 hours (hook wiring)
- **Phase 4**: 4 hours (component integration)
- **Phase 5**: 1-2 days (comprehensive testing and docs)

**Total: 3-5 days** (matches proposal estimate)

## Risk Mitigation

**Risk:** Performance issues on large trees

**Mitigation:** Task 5.4 benchmarks early in Phase 5. If targets not met, add Task 2.8 (descendant caching).

**Risk:** React Aria integration issues

**Mitigation:** Task 5.3 tests early. If issues found, may need to adjust onSelectionChange implementation.

**Risk:** Edge cases discovered during testing

**Mitigation:** Spec document defines all known edge cases. Task 5.1-5.3 will surface unknowns early.

## Definition of Done

✅ All 25 tasks completed
✅ All tests passing (unit + integration + component)
✅ Performance benchmarks meet targets
✅ Storybook stories created
✅ Documentation complete
✅ Changeset created
✅ Code review approved
✅ Verification gate passes (build, test, lint, format)
