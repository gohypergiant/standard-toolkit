/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Tree } from '@accelint/design-toolkit/components/tree';
import { TreeItem } from '@accelint/design-toolkit/components/tree/item';
import { TreeItemContent } from '@accelint/design-toolkit/components/tree/item-content';
import { TreeItemDescription } from '@accelint/design-toolkit/components/tree/item-description';
import { TreeItemLabel } from '@accelint/design-toolkit/components/tree/item-label';
import { TreeItemPrefixIcon } from '@accelint/design-toolkit/components/tree/item-prefix-icon';
import Placeholder from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { TreeNode } from '@accelint/design-toolkit';
import type {
  TreeProps,
  TreeStyleVariant,
} from '@accelint/design-toolkit/components/tree/types';
import type { ComponentVariantConfig } from '~/visual-regression/vitest';

type TreeScenarioProps = Pick<
  TreeProps<object>,
  'variant' | 'expandedKeys' | 'showRuleLines' | 'showVisibility'
>;

const DENSITIES: TreeStyleVariant[] = ['cozy', 'compact', 'crammed'];
const WRAPPER_CLASS = 'p-s w-[400px]';

// ---------------------------------------------------------------------------
// Tree — collapsed (density variants)
// ---------------------------------------------------------------------------

const collapsedVariants = generateVariantMatrix<TreeScenarioProps>({
  dimensions: { variant: DENSITIES },
});

const renderTreeScenario = (props: TreeScenarioProps) => (
  <Tree {...props} aria-label='Test tree'>
    <TreeItem id='parent-1' textValue='Parent 1'>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Parent 1</TreeItemLabel>
      </TreeItemContent>
      <TreeItem id='child-1' textValue='Child 1'>
        <TreeItemContent>
          <TreeItemLabel>Child 1</TreeItemLabel>
          <TreeItemDescription>Description</TreeItemDescription>
        </TreeItemContent>
      </TreeItem>
      <TreeItem id='child-2' textValue='Child 2'>
        <TreeItemContent>
          <TreeItemLabel>Child 2</TreeItemLabel>
        </TreeItemContent>
      </TreeItem>
    </TreeItem>
    <TreeItem id='parent-2' textValue='Parent 2'>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Parent 2</TreeItemLabel>
      </TreeItemContent>
    </TreeItem>
    <TreeItem id='leaf' textValue='Leaf'>
      <TreeItemContent>
        <TreeItemLabel>Leaf Item</TreeItemLabel>
      </TreeItemContent>
    </TreeItem>
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'Tree',
  renderComponent: renderTreeScenario,
  testId: 'test-tree',
  variants: collapsedVariants,
  states: ['default'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// Tree — expanded (density variants + feature toggles)
// ---------------------------------------------------------------------------

const expandedKeys = new Set(['parent-1']);

const expandedVariants: ComponentVariantConfig<TreeScenarioProps>[] = [
  ...generateVariantMatrix<TreeScenarioProps>({
    dimensions: { variant: DENSITIES },
    baseProps: { expandedKeys },
  }),
  {
    id: 'cozy-no-rule-lines',
    name: 'cozy / no rule lines',
    props: { variant: 'cozy', expandedKeys, showRuleLines: false },
  },
  {
    id: 'cozy-no-visibility',
    name: 'cozy / no visibility',
    props: { variant: 'cozy', expandedKeys, showVisibility: false },
  },
];

createInteractiveVisualTests({
  componentName: 'TreeExpanded',
  renderComponent: renderTreeScenario,
  testId: 'test-tree',
  variants: expandedVariants,
  states: ['default'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// TreeItem — interactive states (unselected)
// ---------------------------------------------------------------------------

interface TreeItemVisualProps {
  variant: TreeStyleVariant;
  isDisabled?: boolean;
}

const treeItemVariants = generateVariantMatrix<TreeItemVisualProps>({
  dimensions: { variant: DENSITIES },
});

const renderTreeItem = (props: TreeItemVisualProps) => (
  <Tree
    variant={props.variant}
    selectionMode='single'
    expandedKeys={new Set(['parent'])}
    aria-label='Test tree'
  >
    <TreeItem id='parent' textValue='Parent' isDisabled={props.isDisabled}>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Parent Item</TreeItemLabel>
        <TreeItemDescription>Description text</TreeItemDescription>
      </TreeItemContent>
      <TreeItem id='child' textValue='Child'>
        <TreeItemContent>
          <TreeItemLabel>Child Item</TreeItemLabel>
        </TreeItemContent>
      </TreeItem>
    </TreeItem>
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'TreeItem',
  renderComponent: renderTreeItem,
  testId: 'test-tree-item',
  interactionTarget: '[role="row"]',
  variants: treeItemVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// TreeItem — interactive states (selected)
// ---------------------------------------------------------------------------

const renderSelectedTreeItem = (props: TreeItemVisualProps) => (
  <Tree
    variant={props.variant}
    selectionMode='single'
    expandedKeys={new Set(['parent'])}
    selectedKeys={new Set(['parent'])}
    aria-label='Test tree'
  >
    <TreeItem id='parent' textValue='Parent' isDisabled={props.isDisabled}>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Parent Item</TreeItemLabel>
        <TreeItemDescription>Description text</TreeItemDescription>
      </TreeItemContent>
      <TreeItem id='child' textValue='Child'>
        <TreeItemContent>
          <TreeItemLabel>Child Item</TreeItemLabel>
        </TreeItemContent>
      </TreeItem>
    </TreeItem>
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'TreeItemSelected',
  renderComponent: renderSelectedTreeItem,
  testId: 'test-tree-item-selected',
  interactionTarget: '[role="row"]',
  variants: treeItemVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// Tree — deep nesting (3 levels, exercises hidden rule line)
// ---------------------------------------------------------------------------

const deepNestingVariants = generateVariantMatrix<{
  variant: TreeStyleVariant;
}>({
  dimensions: { variant: DENSITIES },
});

const deepExpandedKeys = new Set(['root', 'branch-a', 'branch-b']);

const renderDeepTreeScenario = (props: { variant: TreeStyleVariant }) => (
  <Tree
    variant={props.variant}
    expandedKeys={deepExpandedKeys}
    aria-label='Test tree'
  >
    <TreeItem id='root' textValue='Root'>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Root</TreeItemLabel>
      </TreeItemContent>
      <TreeItem id='branch-a' textValue='Branch A'>
        <TreeItemContent>
          <TreeItemLabel>Branch A</TreeItemLabel>
        </TreeItemContent>
        <TreeItem id='leaf-a1' textValue='Leaf A1'>
          <TreeItemContent>
            <TreeItemLabel>Leaf A1</TreeItemLabel>
            <TreeItemDescription>Deep leaf</TreeItemDescription>
          </TreeItemContent>
        </TreeItem>
        <TreeItem id='leaf-a2' textValue='Leaf A2'>
          <TreeItemContent>
            <TreeItemLabel>Leaf A2</TreeItemLabel>
          </TreeItemContent>
        </TreeItem>
      </TreeItem>
      <TreeItem id='branch-b' textValue='Branch B'>
        <TreeItemContent>
          <TreeItemLabel>Branch B</TreeItemLabel>
        </TreeItemContent>
        <TreeItem id='leaf-b1' textValue='Leaf B1'>
          <TreeItemContent>
            <TreeItemLabel>Leaf B1</TreeItemLabel>
          </TreeItemContent>
        </TreeItem>
      </TreeItem>
    </TreeItem>
    <TreeItem id='sibling' textValue='Sibling'>
      <TreeItemContent>
        <TreeItemLabel>Sibling</TreeItemLabel>
      </TreeItemContent>
    </TreeItem>
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'TreeDeepNesting',
  renderComponent: renderDeepTreeScenario,
  testId: 'test-tree-deep',
  variants: deepNestingVariants,
  states: ['default'],
  className: 'p-s w-[500px]',
});

// ---------------------------------------------------------------------------
// Tree — empty branch (expanded parent with no children)
// ---------------------------------------------------------------------------

const emptyBranchVariants = generateVariantMatrix<{
  variant: TreeStyleVariant;
}>({
  dimensions: { variant: DENSITIES },
});

const renderEmptyBranchScenario = (props: { variant: TreeStyleVariant }) => (
  <Tree
    variant={props.variant}
    expandedKeys={new Set(['empty-parent'])}
    aria-label='Test tree'
  >
    <TreeItem id='empty-parent' textValue='Empty Parent'>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Empty Parent</TreeItemLabel>
      </TreeItemContent>
    </TreeItem>
    <TreeItem id='normal-parent' textValue='Normal Parent'>
      <TreeItemContent>
        <TreeItemLabel>Normal Parent</TreeItemLabel>
      </TreeItemContent>
    </TreeItem>
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'TreeEmptyBranch',
  renderComponent: renderEmptyBranchScenario,
  testId: 'test-tree-empty',
  variants: emptyBranchVariants,
  states: ['default'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// TreeItem — leaf item interactions (no chevron, has rule lines)
// ---------------------------------------------------------------------------

const renderTreeLeafItem = (props: TreeItemVisualProps) => (
  <Tree
    variant={props.variant}
    selectionMode='single'
    expandedKeys={new Set(['parent'])}
    aria-label='Test tree'
  >
    <TreeItem id='parent' textValue='Parent'>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Parent Item</TreeItemLabel>
      </TreeItemContent>
      <TreeItem id='leaf-target' textValue='Leaf' isDisabled={props.isDisabled}>
        <TreeItemContent>
          <TreeItemLabel>Leaf Item</TreeItemLabel>
          <TreeItemDescription>Description text</TreeItemDescription>
        </TreeItemContent>
      </TreeItem>
    </TreeItem>
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'TreeLeafItem',
  renderComponent: renderTreeLeafItem,
  testId: 'test-tree-leaf-item',
  interactionTarget: '#leaf-target [role="row"]',
  variants: treeItemVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// Tree — dynamic `items` rendering (exercises the render function code path)
// ---------------------------------------------------------------------------

type DynamicItemValues = {
  description?: string;
};

const dynamicItems: TreeNode<DynamicItemValues>[] = [
  {
    key: 'parent-1',
    label: 'Parent 1',
    isExpanded: true,
    isVisible: true,
    children: [
      {
        key: 'child-1',
        parentKey: 'parent-1',
        label: 'Child 1',
        isVisible: true,
        values: { description: 'Description' },
      },
      {
        key: 'child-2',
        parentKey: 'parent-1',
        label: 'Child 2',
        isVisible: true,
      },
    ],
  },
  {
    key: 'parent-2',
    label: 'Parent 2',
    isVisible: true,
  },
];

function DynamicNode({ node }: { node: TreeNode<DynamicItemValues> }) {
  return (
    <TreeItem id={node.key} textValue={node.label}>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>{node.label}</TreeItemLabel>
        {node.values?.description && (
          <TreeItemDescription>{node.values.description}</TreeItemDescription>
        )}
      </TreeItemContent>
      {node.children?.map((child) => (
        <DynamicNode key={child.key} node={child} />
      ))}
    </TreeItem>
  );
}

const dynamicVariants = generateVariantMatrix<{ variant: TreeStyleVariant }>({
  dimensions: { variant: DENSITIES },
});

const renderDynamicTree = (props: { variant: TreeStyleVariant }) => (
  <Tree variant={props.variant} items={dynamicItems} aria-label='Test tree'>
    {(node) => <DynamicNode key={node.key} node={node} />}
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'TreeDynamic',
  renderComponent: renderDynamicTree,
  testId: 'test-tree-dynamic',
  variants: dynamicVariants,
  states: ['default'],
  className: WRAPPER_CLASS,
});

// ---------------------------------------------------------------------------
// Tree — visibility muted states (parent hidden, children visible but muted)
// ---------------------------------------------------------------------------

const visibilityVariants = generateVariantMatrix<{
  variant: TreeStyleVariant;
}>({
  dimensions: { variant: DENSITIES },
});

const renderVisibilityScenario = (props: { variant: TreeStyleVariant }) => (
  <Tree
    variant={props.variant}
    expandedKeys={new Set(['parent-1'])}
    visibleKeys={new Set(['child-1', 'child-2', 'parent-2'])}
    aria-label='Test tree'
  >
    <TreeItem id='parent-1' textValue='Parent 1'>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Parent 1 (hidden)</TreeItemLabel>
      </TreeItemContent>
      <TreeItem id='child-1' textValue='Child 1'>
        <TreeItemContent>
          <TreeItemLabel>Child 1 (visible but muted)</TreeItemLabel>
        </TreeItemContent>
      </TreeItem>
      <TreeItem id='child-2' textValue='Child 2'>
        <TreeItemContent>
          <TreeItemLabel>Child 2 (visible but muted)</TreeItemLabel>
        </TreeItemContent>
      </TreeItem>
    </TreeItem>
    <TreeItem id='parent-2' textValue='Parent 2'>
      <TreeItemContent>
        <TreeItemPrefixIcon>
          <Placeholder />
        </TreeItemPrefixIcon>
        <TreeItemLabel>Parent 2 (visible)</TreeItemLabel>
      </TreeItemContent>
    </TreeItem>
  </Tree>
);

createInteractiveVisualTests({
  componentName: 'TreeVisibility',
  renderComponent: renderVisibilityScenario,
  testId: 'test-tree-visibility',
  variants: visibilityVariants,
  states: ['default'],
  className: WRAPPER_CLASS,
});
