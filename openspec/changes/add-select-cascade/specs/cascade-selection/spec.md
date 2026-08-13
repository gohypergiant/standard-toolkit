# Specification: Cascade Selection Behavior

## Scope

This specification defines the exact behavior of cascade selection mode in the Tree component. It serves as the contract for implementation and the basis for test cases.

## Terminology

- **Node**: A single item in the tree with a unique key
- **Parent**: A node with children
- **Child**: A node with a parent
- **Descendant**: All nodes reachable by traversing children recursively
- **Ancestor**: All nodes reachable by traversing parents recursively
- **Selectable**: Not disabled (`isDisabled !== true`)
- **Leaf**: A node with no children (or all children are disabled)

## Selection States

A node can be in one of three selection states:

| State | isSelected | isIndeterminate | Visual | Meaning |
|-------|-----------|----------------|--------|---------|
| Unselected | false | false | `[ ]` | Node and all descendants unselected |
| Indeterminate | false | true | `[−]` | Some (but not all) selectable descendants selected |
| Selected | true | false | `[✓]` | Node and all selectable descendants selected |

**Invariants:**
- `isSelected` and `isIndeterminate` cannot both be `true`
- Disabled nodes never change state (always `isSelected: false, isIndeterminate: false`)
- Leaf nodes never have `isIndeterminate: true`

## Behavior Specifications

### SPEC-1: Selecting a Parent Node

**Given:** User clicks to select a parent node P

**When:** Cascade mode enabled

**Then:**
1. P becomes selected (`isSelected: true, isIndeterminate: false`)
2. All selectable descendants of P become selected
3. All disabled descendants of P remain unchanged
4. All ancestors of P are recomputed (see SPEC-4)

**Example:**
```
Before:                         After:
┌─ P [ ]                        ┌─ P [✓]
│  ├─ A [ ]                     │  ├─ A [✓]
│  ├─ B [ ]                     │  ├─ B [✓]
│  └─ C [disabled]              │  └─ C [disabled]

User selects P → P, A, B become selected; C unchanged
```

### SPEC-2: Deselecting a Parent Node

**Given:** User clicks to deselect a parent node P

**When:** Cascade mode enabled

**Then:**
1. P becomes unselected (`isSelected: false, isIndeterminate: false`)
2. All selectable descendants of P become unselected
3. All disabled descendants of P remain unchanged
4. All ancestors of P are recomputed (see SPEC-4)

**Example:**
```
Before:                         After:
┌─ P [✓]                        ┌─ P [ ]
│  ├─ A [✓]                     │  ├─ A [ ]
│  ├─ B [✓]                     │  ├─ B [ ]
│  └─ C [disabled]              │  └─ C [disabled]

User deselects P → P, A, B become unselected; C unchanged
```

### SPEC-3: Selecting/Deselecting a Child Node

**Given:** User clicks to toggle a child node C

**When:** Cascade mode enabled

**Then:**
1. C's state toggles (selected ↔ unselected)
2. All selectable descendants of C cascade (per SPEC-1 or SPEC-2)
3. All ancestors of C are recomputed (see SPEC-4)
4. Siblings of C are unaffected

**Example:**
```
Before:                         After:
┌─ P [−]                        ┌─ P [✓]
│  ├─ A [✓]                     │  ├─ A [✓]
│  └─ B [ ]                     │  └─ B [✓]

User selects B → P becomes fully selected (all children now selected)
```

### SPEC-4: Parent State Computation

**Given:** A parent node P with children C₁, C₂, ..., Cₙ

**When:** Any descendant selection changes

**Then:** P's state is computed as:

```
Let S = set of selectable children (where isDisabled !== true)

If |S| = 0:
  // All children disabled → treat as leaf
  P.state = P's own state (unchanged)

Else:
  Let selected = count of children where isSelected = true
  Let indeterminate = count of children where isIndeterminate = true

  If indeterminate > 0:
    P.isSelected = false
    P.isIndeterminate = true

  Else if selected = |S|:
    P.isSelected = true
    P.isIndeterminate = false

  Else if selected = 0:
    P.isSelected = false
    P.isIndeterminate = false

  Else:
    P.isSelected = false
    P.isIndeterminate = true
```

**Truth Table:**

| Selectable Children | Selected Count | Indeterminate Count | Parent isSelected | Parent isIndeterminate |
|---------------------|----------------|---------------------|-------------------|------------------------|
| 0 | 0 | 0 | (unchanged) | false |
| 1 | 0 | 0 | false | false |
| 1 | 1 | 0 | true | false |
| 1 | 0 | 1 | false | true |
| 2 | 0 | 0 | false | false |
| 2 | 1 | 0 | false | true |
| 2 | 2 | 0 | true | false |
| 2 | 0 | 1 | false | true |
| 2 | 1 | 1 | false | true |
| 3 | 0 | 0 | false | false |
| 3 | 1 | 0 | false | true |
| 3 | 2 | 0 | false | true |
| 3 | 3 | 0 | true | false |
| 3 | any | >0 | false | true |

**Key insights:**
- If ANY child is indeterminate, parent is indeterminate
- Parent is selected ONLY when ALL selectable children are selected AND none are indeterminate
- Parent is unselected when NO children are selected AND none are indeterminate
- All other cases: parent is indeterminate

### SPEC-5: Disabled Node Handling

**Given:** A tree with disabled nodes

**When:** Cascade selection occurs

**Then:**
1. Disabled nodes never change state during cascade
2. Disabled nodes are excluded from parent state computation
3. A parent with ALL disabled children behaves as a leaf node

**Example 1: Disabled child ignored in cascade**
```
Before:                         After:
┌─ P [ ]                        ┌─ P [✓]
│  ├─ A [ ]                     │  ├─ A [✓]
│  └─ B [disabled]              │  └─ B [disabled]

User selects P → A selected, B unchanged
P shows as fully selected (all selectable children selected)
```

**Example 2: Parent with only disabled children**
```
┌─ P [ ]
│  ├─ A [disabled]
│  └─ B [disabled]

User selects P → P becomes selected
P acts as a leaf node (no selectable children to cascade to)
```

**Example 3: Mixed disabled and selected**
```
┌─ P [−]
│  ├─ A [✓]
│  ├─ B [ ]
│  └─ C [disabled]

P is indeterminate because:
- Selectable children: A, B
- Selected: A (1 of 2 selectable)
- C is disabled, so ignored in computation
```

### SPEC-6: Deep Hierarchy Cascade

**Given:** A deep tree with multiple levels

**When:** User selects/deselects a node at any level

**Then:**
1. Cascade propagates down through ALL levels to leaves
2. Bubble-up recomputes through ALL levels to root
3. Indeterminate state propagates upward correctly

**Example:**
```
Before:
┌─ Root [ ]
│  └─ Level1 [ ]
│     └─ Level2 [ ]
│        ├─ LeafA [ ]
│        └─ LeafB [ ]

User selects Level1:

After:
┌─ Root [✓]
│  └─ Level1 [✓]
│     └─ Level2 [✓]
│        ├─ LeafA [✓]
│        └─ LeafB [✓]

All descendants cascade down.
Root becomes fully selected (all descendants selected).
```

**Example: Partial selection bubbles up**
```
User deselects LeafB:

┌─ Root [−]
│  └─ Level1 [−]
│     └─ Level2 [−]
│        ├─ LeafA [✓]
│        └─ LeafB [ ]

Level2 becomes indeterminate (1 of 2 children selected)
Level1 becomes indeterminate (child is indeterminate)
Root becomes indeterminate (child is indeterminate)
```

### SPEC-7: Bubble-Up Early Termination

**Given:** A state change at a node C

**When:** Bubble-up reaches an ancestor A

**Then:**
- If A's computed state matches its current state, STOP
- Do not continue to A's ancestors

**Example:**
```
┌─ Root [−]
│  ├─ BranchA [✓]
│  │  ├─ Leaf1 [✓]
│  │  └─ Leaf2 [✓]
│  └─ BranchB [−]
│     ├─ Leaf3 [✓]
│     └─ Leaf4 [ ]

User selects Leaf4:
- Leaf4 becomes selected
- BranchB recomputed: was indeterminate, now fully selected (state changed)
- Root recomputed: was indeterminate, still indeterminate (state unchanged)
- STOP (no need to check Root's ancestors)
```

### SPEC-8: selectAll() / unselectAll() Behavior

**Given:** User calls `selectAll()` or `unselectAll()`

**When:** Cascade mode enabled

**Then:**
1. All selectable nodes become selected/unselected
2. All `isIndeterminate` flags set to `false`
3. Disabled nodes remain unchanged

**selectAll() Example:**
```
Before:                         After:
┌─ P [−]                        ┌─ P [✓]
│  ├─ A [✓]                     │  ├─ A [✓]
│  ├─ B [ ]                     │  ├─ B [✓]
│  └─ C [disabled]              │  └─ C [disabled]

selectAll() → All selectable nodes selected, no indeterminate states
```

## State Transition Diagram

```
┌─────────────┐
│ Unselected  │
│  [ ]        │
└──────┬──────┘
       │
       │ User clicks / Parent cascades down
       │ (node becomes selected)
       ↓
┌─────────────┐
│  Selected   │
│  [✓]        │
└──────┬──────┘
       │
       │ Child changes / Bubble-up computes
       │ (some but not all children selected)
       ↓
┌─────────────┐
│Indeterminate│
│  [−]        │
└──────┬──────┘
       │
       │ All children selected / User clicks
       │ (back to selected or unselected)
       │
       └──────────────────────────────────────┐
                                              ↓
                               ┌─────────────────────┐
                               │  Selected/Unselected│
                               └─────────────────────┘
```

## Edge Cases

### EDGE-1: Empty Tree

**Given:** Tree with zero nodes

**Then:** No selection operations possible

### EDGE-2: Single Node Tree

**Given:** Tree with one node (no children)

**Then:**
- Node acts as leaf
- Never shows indeterminate
- Toggle between selected/unselected

### EDGE-3: All Children Disabled

**Given:** Parent where ALL children are disabled

**Then:**
- Parent acts as leaf node
- Clicking parent only affects parent
- Parent never shows indeterminate

### EDGE-4: Circular References (Invalid)

**Given:** Attempt to create circular parent-child relationships

**Then:** Prevented by Cache implementation (tree structure enforced)

### EDGE-5: Rapid Click Spam

**Given:** User rapidly clicks multiple nodes

**Then:**
- Each click triggers full cascade + bubble-up
- State remains consistent after all operations complete
- No race conditions (synchronous operations)

## Non-Functional Requirements

### Performance

**Requirement:** Cascade operations complete within 16ms for trees with <1000 nodes

**Measurement:**
```typescript
const start = performance.now();
actions.onSelectionChange(newKeys);
const duration = performance.now() - start;
expect(duration).toBeLessThan(16);
```

### Consistency

**Requirement:** Tree state is always consistent with specifications after any operation

**Invariants to verify:**
1. No node has both `isSelected: true` and `isIndeterminate: true`
2. Leaf nodes never have `isIndeterminate: true`
3. Parent state always matches computed state from children
4. Disabled nodes never change state

## Test Cases

Each specification above maps to test cases:

- **SPEC-1**: `tree.test.ts:selectParentCascadesToChildren`
- **SPEC-2**: `tree.test.ts:deselectParentCascadesToChildren`
- **SPEC-3**: `tree.test.ts:childSelectionUpdatesParent`
- **SPEC-4**: `tree.test.ts:parentStateComputation`
- **SPEC-5**: `tree.test.ts:disabledNodesIgnored`
- **SPEC-6**: `tree.test.ts:deepHierarchyCascade`
- **SPEC-7**: `tree.test.ts:bubbleUpEarlyTermination`
- **SPEC-8**: `tree.test.ts:selectAllClearIndeterminate`

Each edge case maps to test cases:

- **EDGE-1**: `tree.test.ts:emptyTree`
- **EDGE-2**: `tree.test.ts:singleNodeTree`
- **EDGE-3**: `tree.test.ts:allChildrenDisabled`
- **EDGE-5**: `tree.test.ts:rapidClickSpam`

## Acceptance Criteria

Implementation is complete when:

✅ All specifications pass corresponding test cases
✅ All edge cases handled correctly
✅ Performance requirements met
✅ Invariants hold after any operation
✅ Integration tests pass with React Aria
✅ Visual regression tests pass in Storybook
✅ Accessibility tests pass (screen reader announces indeterminate)

## References

- [Proposal Document](../proposal.md)
- [Design Document](../design.md)
- [React Aria Tree Documentation](https://react-spectrum.adobe.com/react-aria/Tree.html)
- [WCAG 2.1: Mixed State Checkboxes](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
