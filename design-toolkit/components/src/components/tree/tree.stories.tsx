/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { TreeNode } from '@/hooks/types';
import { useTreeActions } from '@/hooks/use-tree-actions';
import { useTreeState } from '@/hooks/use-tree-state';
import {
  CenterOn,
  CollapseAll,
  ExpandAll,
  LockFill,
  Placeholder,
} from '@accelint/icons';
import Warning from '@accelint/icons/warning';
import type { Key, Selection } from '@react-types/shared';
import type { Meta, StoryObj } from '@storybook/react';
import { type ReactNode, useEffect, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Tree } from './index';

const meta: Meta<typeof Tree> = {
  title: 'Components/TreeView',
  component: Tree,
  args: {
    variant: 'cozy',
    showRuleLines: true,
    selectionMode: 'multiple',
    showVisibility: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact', 'crammed'],
    },
    selectionMode: {
      control: 'select',
      options: ['none', 'multiple', 'single'],
    },
  },
  parameters: {
    controls: {
      include: ['showRuleLines', 'showVisibility', 'variant', 'selectionMode'],
    },
    docs: {
      subtitle:
        'Tree component that provides users with a way to navigate nested hierarchical information, with support for keyboard navigation and selection.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

type ItemValues = {
  iconPrefix?: ReactNode;
  description?: string;
  hasWarning?: boolean;
};

/**
 * TreeNode are all the properties that are intrinsic to the tree itself
 * Values are the things that we are using in tree items.
 */
const items: TreeNode<ItemValues>[] = [
  {
    key: 'european-birds',
    label: 'European Birds',
    isReadOnly: false,
    values: {
      iconPrefix: <Placeholder />,
    },
  },
  {
    key: 'north-american-birds',
    label: 'North American Birds',
    isVisible: true,
    isReadOnly: false,
    isExpanded: true,
    values: {
      iconPrefix: <Placeholder />,
    },
    children: [
      {
        key: 'blue-jay',
        parentKey: 'north-american-birds',
        label: 'Blue jay',
        isReadOnly: false,
        isVisible: true,
        values: {
          description: 'cyanocitta cristata',
          iconPrefix: <Placeholder />,
          hasWarning: true,
        },
      },
      {
        key: 'gray-catbird',
        parentKey: 'north-american-birds',
        label: 'Gray catbird',
        isReadOnly: false,
        isVisible: true,
        values: {
          description: 'dumetella carolinensis',
          iconPrefix: <Placeholder />,
        },
      },
      {
        key: 'black-capped-chickadee',
        parentKey: 'north-american-birds',
        label: 'Black-capped chickadee',
        isReadOnly: true,
        isVisible: false,
        values: {
          description: 'Poecile atricapillus',
          iconPrefix: <Placeholder />,
        },
        children: [
          {
            key: 'northern-cardinal',
            parentKey: 'black-capped-chickadee',
            label: 'Northern Cardinal',
            isReadOnly: false,
            values: {
              description: 'Cardinalis cardinalis',
              iconPrefix: <Placeholder />,
              hasWarning: true,
            },
          },
        ],
      },
    ],
  },
  {
    key: 'african-birds',
    label: 'African Birds',
    isReadOnly: false,
    values: {
      iconPrefix: <Placeholder />,
    },
    children: [
      {
        key: 'lilac-breasted-roller',
        parentKey: 'african-birds',
        label: 'Lilac-breasted roller',
        isReadOnly: false,
        values: {
          iconPrefix: <Placeholder />,
        },
      },
    ],
  },
];

function Node({ node }: { node: TreeNode<ItemValues> }) {
  const { isReadOnly, values } = node;

  return (
    <Tree.Item
      id={node.key}
      key={node.key}
      label={node.label}
      isDisabled={isReadOnly}
    >
      <Tree.Item.Content>
        {({ variant, isViewable, isVisible }) => {
          const size = variant === 'cozy' ? 'medium' : 'small';
          return (
            <>
              {values?.iconPrefix && (
                <Tree.Item.PrefixIcon>
                  {values?.iconPrefix}
                </Tree.Item.PrefixIcon>
              )}
              <Tree.Item.Label>{node.label}</Tree.Item.Label>
              {values?.description && (
                <Tree.Item.Description>
                  {values?.description}
                </Tree.Item.Description>
              )}
              <Tree.Item.Actions>
                {isReadOnly && (
                  <Icon
                    className='fg-default-dark aspect-square rounded-full bg-interactive-hover-dark p-xs'
                    size={size}
                  >
                    <LockFill />
                  </Icon>
                )}
                {values?.hasWarning && (
                  <Icon className='fg-serious' size={size}>
                    <Warning />
                  </Icon>
                )}
                <Button
                  variant='icon'
                  size={size}
                  isDisabled={!(isViewable && isVisible)}
                >
                  <Icon>
                    <CenterOn />
                  </Icon>
                </Button>
              </Tree.Item.Actions>
            </>
          );
        }}
      </Tree.Item.Content>
      {node.children?.map((child) => (
        <Node key={child.key} node={child} />
      ))}
    </Tree.Item>
  );
}

/**
 * This story is using the optional useTreeState hook, which returns
 * which is a convenience helper that will control state for the tree.
 * The useTreeState hook also provides drag and drop hooks.
 */
export const DragAndDrop: Story = {
  render: (args) => {
    const {
      nodes,
      selectedKeys,
      expandedKeys,
      visibleKeys,
      dragAndDropConfig,
      actions,
    } = useTreeState({
      items,
      initialSelectedKeys: ['european-birds'],
      initialExpandedKeys: ['north-american-birds'],
    });

    return (
      <>
        <div className='flex items-center gap-m'>
          <Button size='small' variant='flat' onPress={actions.selectAll}>
            Select All
          </Button>
          <Button size='small' variant='flat' onPress={actions.unselectAll}>
            Unselect All
          </Button>
          <Button size='small' variant='icon' onPress={actions.expandAll}>
            <Icon>
              <ExpandAll />
            </Icon>
          </Button>
          <Button size='small' variant='icon' onPress={actions.collapseAll}>
            <Icon>
              <CollapseAll />
            </Icon>
          </Button>
        </div>

        <Tree
          {...args}
          style={{ width: '500px' }}
          aria-label='Drag and Drop example'
          expandedKeys={expandedKeys}
          onExpandedChange={actions.onExpandedChange}
          selectedKeys={selectedKeys}
          onSelectionChange={actions.onSelectionChange}
          dragAndDropConfig={dragAndDropConfig}
          visibleKeys={visibleKeys}
          onVisibilityChange={actions.onVisibilityChange}
          items={nodes}
        >
          {(node) => <Node key={node.key} node={node} />}
        </Tree>
      </>
    );
  },
};

/**
 * A Stateless tree uses data from a remote source to drive tree display
 * and operations. An optional useTreeActions hook will provide basic tree
 * data operations.
 */
export const Stateless: Story = {
  render: (args) => {
    /**
     *  IMPORTANT: This useState is just a cheap way to represent
     *  a database in Storybook, NOT component state. In your application,
     *  this would be your remote persistence database or localStorage,
     *  i.e. using fetch or mutate(updateTree).
     *
     *  Critically, It is the fetched data from the server that is driving the
     *  Tree, not component state.
     *
     */
    const [db, setDB] = useState(items);
    const actions = useTreeActions({ nodes: db });

    // biome-ignore lint/correctness/useExhaustiveDependencies: only run once to normalize data
    useEffect(() => {
      setDB(actions.initialize());
    }, []);

    const handleSelection = (keys: Selection) => {
      const updated = actions.onSelectionChange(new Set(keys));
      setDB(updated);
    };

    const handleExpansion = (keys: Set<Key>) => {
      const newTree = actions.onExpandedChange(keys);
      setDB(newTree);
    };

    const handleExpandAll = () => {
      const newTree = actions.expandAll();
      setDB(newTree);
    };

    const handleCollapseAll = () => {
      const newTree = actions.collapseAll();
      setDB(newTree);
    };

    const handleSelectAll = () => {
      const newTree = actions.selectAll();
      setDB(newTree);
    };

    const handleUnselectAll = () => {
      const newTree = actions.unselectAll();
      setDB(newTree);
    };

    const handleVisibility = (keys: Set<Key>) => {
      const newTree = actions.onVisibilityChange(keys);
      setDB(newTree);
    };

    return (
      <>
        <div className='flex items-center gap-m'>
          <Button size='small' variant='icon' onPress={handleSelectAll}>
            Select All
          </Button>
          <Button size='small' variant='icon' onPress={handleUnselectAll}>
            Unselect All
          </Button>
          <Button size='small' onPress={handleExpandAll}>
            <Icon>
              <ExpandAll />
            </Icon>
          </Button>
          <Button size='small' onPress={handleCollapseAll}>
            <Icon>
              <CollapseAll />
            </Icon>
          </Button>
        </div>
        <Tree
          {...args}
          style={{ width: '500px' }}
          aria-label='Stateless Example'
          expandedKeys={actions.getExpandedKeys()}
          onExpandedChange={handleExpansion}
          selectedKeys={actions.getSelectedKeys()}
          onSelectionChange={handleSelection}
          visibleKeys={actions.getVisibleKeys()}
          onVisibilityChange={handleVisibility}
          items={db}
        >
          {(node) => <Node key={node.key} node={node} />}
        </Tree>
      </>
    );
  },
};

/**
 * Static collections can use the Tree components directly, for simple use cases.
 */
export const StaticCollection: Story = {
  render: (args) => {
    const [visibility, setVisibility] = useState<Set<Key>>(new Set(['fruit']));

    return (
      <Tree
        style={{ width: '500px' }}
        aria-label='Basic Static Example'
        visibleKeys={visibility}
        onVisibilityChange={setVisibility}
        {...args}
      >
        <Tree.Item id='fruit' label='fruit'>
          <Tree.Item.Content>Fruit</Tree.Item.Content>
          <Tree.Item id='apples' label='apples'>
            <Tree.Item.Content>Apples</Tree.Item.Content>
            <Tree.Item id='green' label='green-apple'>
              <Tree.Item.Content>Green Apple</Tree.Item.Content>
            </Tree.Item>
            <Tree.Item id='red' label='red-apple' isLastOfSet>
              <Tree.Item.Content>Red Apple</Tree.Item.Content>
            </Tree.Item>
            <Tree.Item id='yellow' label='yellow-apple' isLastOfSet>
              <Tree.Item.Content>Yellow Apple</Tree.Item.Content>
            </Tree.Item>
          </Tree.Item>
        </Tree.Item>

        <Tree.Item id='vegetables' label='vegetables'>
          <Tree.Item.Content>Vegetables</Tree.Item.Content>
          <Tree.Item id='carrot' label='carrot'>
            <Tree.Item.Content>Carrot</Tree.Item.Content>
          </Tree.Item>
          <Tree.Item id='kale' label='kale'>
            <Tree.Item.Content>Kale</Tree.Item.Content>
          </Tree.Item>
        </Tree.Item>
      </Tree>
    );
  },
};
