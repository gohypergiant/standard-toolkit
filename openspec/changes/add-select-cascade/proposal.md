# Proposal: Add Cascade Selection to Tree Component

## Overview

Add an optional cascade selection mode to the useTreeState hook used by the Tree component in order to propagate selection state through parent-child relationships. When enabled, selecting a parent node automatically selects all its descendants, and the parent's selection state reflects its children's state (selected, unselected, or indeterminate).

## Motivation

Currently, Tree selection operates independently per node. Selecting a parent folder doesn't affect its children. This works for simple use cases but doesn't match user expectations in scenarios like:

- **File systems**: Select a folder to include all its files
- **Permission trees**: Grant permissions to a department and all sub-departments
- **Bulk operations**: Select category to operate on all items within it

Users expect tree selections to "cascade" like they do in native file managers (Finder, Windows Explorer) with indeterminate checkboxes showing partial selections.

## Requirements

### Core Behavior

**Selecting a parent:**
- All selectable descendants become selected
- Disabled descendants are skipped (remain unaffected)
- Parent shows as fully selected

**Deselecting a parent:**
- All selectable descendants become deselected
- Disabled descendants are skipped
- Parent shows as unselected

**Selecting/deselecting a child:**
- Only that child's state changes
- Parent state updates to reflect children:
  - **Selected**: All selectable children are selected
  - **Indeterminate**: Some (but not all) selectable children are selected
  - **Unselected**: No selectable children are selected

**Manual child selection:**
- User can individually select all children of a parent
- When last child is selected, parent automatically becomes fully selected
- When first child is deselected, parent becomes indeterminate

### Edge Cases

**Disabled nodes:**
- Never participate in cascade selection
- Ignored when computing parent state
- If all children are disabled, parent behaves as a leaf node

**Mixed selection:**
```
┌─ Folder A [−]  (indeterminate)
│  ├─ File 1 [✓]  (selected)
│  ├─ File 2 [ ]  (unselected)
│  ├─ File 3 [✓]  (selected)
│  └─ File 4 [disabled]  (ignored in computation)
```

**Deep hierarchies:**
- Selection cascades through all levels
- Indeterminate state bubbles up to all ancestors
- Deselecting a mid-level node cascades to all its descendants

## User-Facing API

### New Props

**`useTreeState` hook:**
```typescript
const { nodes, actions, dragAndDropConfig } = useTreeState({
  items,
  selectionCascade: true,  // Enable cascade mode (default: false)
});
```

**`Tree` component:**
```typescript
<Tree
  items={nodes}
  selectedKeys={selectedKeys}
  onSelectionChange={actions.onSelectionChange}
  // ... rest (no new props)
/>
```

**No new props or return values needed.** The Tree component derives `indeterminateKeys` internally from `node.isIndeterminate`, just like it derives `selectedKeys` from `node.isSelected`.

### Backward Compatibility

**Default behavior unchanged:**
- `selectionCascade: false` (or omitted) maintains current behavior
- No breaking changes to existing usage
- Opt-in feature via explicit prop

**Controlled vs Uncontrolled:**
- Works with both controlled (`selectedKeys` prop) and uncontrolled (internal state) modes
- `indeterminateKeys` is always derived internally by Tree component, never exposed as API

**Dynamic collections only:**
- Cascade selection only works with dynamic collections (when `items` prop is provided)
- Static collections (raw JSX children) don't have tree structure available for cascade logic
- Existing validation (lines 110-120 in Tree component) prevents mixing modes

## Architecture

### Key Design Decisions

**1. Store indeterminate state in Cache**

Rather than computing indeterminate on every render, compute it during the cascade operation itself and store it in `CacheTreeNode`:

```typescript
type CacheTreeNode<T> = {
  // ... existing fields
  isIndeterminate?: boolean;  // Computed during bubble-up
};
```

**Why:** Moves expensive computation (`O(N)` tree traversal) to incremental updates (`O(M * H)` where M = changed nodes, H = height).

**2. Early termination in bubble-up**

Stop propagating state changes up the tree when a parent's state doesn't change:

```typescript
// If parent was indeterminate and still is, ancestors won't change
if (parent.isIndeterminate === newIndeterminate &&
    parent.isSelected === newSelected) {
  break;  // Stop here
}
```

**Why:** Reduces worst-case `O(H)` to average-case `O(log H)` for typical interactions.

**3. Cascade down, bubble up**

- **Cascade down**: When node selected/deselected, recursively apply to all descendants
- **Bubble up**: Walk ancestors and recompute their state based on children
- **Single tree rebuild**: Only call `toTree()` once at the end

**4. Indeterminate state is internal**

The Tree component derives `indeterminateKeys` internally from the nodes, similar to how it derives `selectedKeys`, `expandedKeys`, and `visibleKeys`. No need to expose it as API since:
- It's always computed from `node.isIndeterminate` (never controlled by user)
- Only applies to dynamic collections where Tree has access to node structure
- Keeps the API simple and consistent with existing patterns

### Data Flow

```
User clicks checkbox
  ↓
React Aria: onSelectionChange(newKeys)
  ↓
useTreeState: actions.onSelectionChange
  ↓
useTreeActions: onSelectionChange (with cascade flag)
  ├─→ Detect added/removed keys (diff previous state)
  ├─→ CASCADE DOWN: Select/deselect all descendants
  ├─→ BUBBLE UP: Recompute parent states (set node.isIndeterminate)
  └─→ Return updated TreeNode[] (with isSelected + isIndeterminate on each node)
  ↓
Tree component derives indeterminateKeys internally
  ├─→ Iterate nodes: if (node.isIndeterminate) keys.add(node.key)
  └─→ Pass to TreeContext alongside selectedKeys
  ↓
TreeItemContent renders Checkbox with isIndeterminate
```

### Performance Characteristics

**Without cascade (current):**
- Time: `O(N)` per selection (rebuild tree)
- Space: `O(N)` (tree data)

**With cascade (optimized):**
- Time: `O(M * D + M * H)` where M = changed keys, D = avg descendants, H = height
- Space: `O(N)` (one extra boolean per node)
- Best case: `O(M)` (leaf selection with early termination)
- Worst case: `O(N)` (select root of flat tree)

**Real-world performance:**
- Small trees (100 nodes): < 1ms
- Medium trees (1,000 nodes): < 10ms
- Large trees (10,000 nodes): < 100ms (worst case)
- Target: Stay under 16ms (one frame) for typical operations

## Success Criteria

### Functional Requirements

- ✅ Selecting parent selects all descendants (skip disabled)
- ✅ Deselecting parent deselects all descendants (skip disabled)
- ✅ Parent shows indeterminate when some children selected
- ✅ Parent auto-selects when all children manually selected
- ✅ Parent auto-deselects when all children manually deselected
- ✅ Disabled nodes never participate in cascade
- ✅ Works with dynamic collections (items prop)
- ✅ Works with controlled and uncontrolled mode

### Non-Functional Requirements

- ✅ No performance regression for non-cascade mode
- ✅ Cascade operations complete within 16ms for trees < 1,000 nodes
- ✅ No breaking changes to existing API
- ✅ Full test coverage for edge cases
- ✅ Storybook examples for cascade selection

### User Experience

- ✅ Checkbox visual state matches native file managers
- ✅ Indeterminate checkboxes clearly distinguishable
- ✅ Keyboard navigation works with cascade selection
- ✅ Screen reader announces indeterminate state

## Risks & Mitigations

### Risk: Performance degradation on large trees

**Mitigation:**
- Implement early termination in bubble-up
- Store indeterminate state in cache
- Benchmark with 10k+ node trees
- Add performance tests to CI

### Risk: React Aria compatibility issues

**Mitigation:**
- Controlled mode: we manage `selectedKeys`, React Aria just renders
- Test with React Aria's test suite patterns
- Verify keyboard navigation still works

### Risk: State synchronization bugs

**Mitigation:**
- Comprehensive test suite for all state transitions
- Property-based tests for cascade invariants
- Manual testing with complex trees

### Risk: Confusion with existing selection behavior

**Mitigation:**
- Opt-in via explicit prop (default: false)
- Clear documentation with visual examples
- Storybook stories showing both modes

## Open Questions

1. **Should `selectAll()` / `unselectAll()` respect cascade mode?**
   - Probably yes—they should be consistent with normal selection
   - Worth documenting explicitly

2. **What happens with `onSelectionChange` callback?**
   - Should it receive only clicked keys or all affected keys?
   - Leaning toward: all affected keys (what user "selected")

3. **Interaction with drag-and-drop?**
   - When dragging selected items, do we include cascaded selections?
   - Probably yes—selection defines "what's included"

## Next Steps

1. Create detailed design document
2. Write specification for cascade behavior
3. Break down implementation into tasks
4. Create test plan covering all edge cases
5. Implement with performance optimizations
6. Benchmark and validate performance targets
7. Document and create Storybook examples

---

**Estimated complexity:** Medium
**Estimated effort:** 3-5 days
**Priority:** Medium (nice-to-have, not blocking)
