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
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are unique for these stories */

import {
  CenterOn,
  CollapseAll,
  ExpandAll,
  LockFill,
  Placeholder,
} from '@accelint/icons';
import Warning from '@accelint/icons/warning';
import { type ReactNode, useState } from 'react';
import { useTreeActions } from '@/hooks/use-tree/actions';
import { useTreeState } from '@/hooks/use-tree/state';
import { Button } from '../button';
import { Icon } from '../icon';
import { Tree } from './index';
import type { Key, Selection } from '@react-types/shared';
import type { Meta, StoryObj } from '@storybook/react';
import type { TreeNode } from '@/hooks/use-tree/types';

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
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

/**
 * This type is for customizing and using application-specific values.
 * These values will be available in component `Node` that you build.
 */
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
    values: {
      iconPrefix: <Placeholder />,
    },
  },
  {
    key: 'north-american-birds',
    label: 'North American Birds',
    isExpanded: true,
    isVisible: true,
    values: {
      iconPrefix: <Placeholder />,
    },
    children: [
      {
        key: 'blue-jay',
        parentKey: 'north-american-birds',
        label: 'Blue jay',
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
        isDisabled: true,
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
    values: {
      iconPrefix: <Placeholder />,
    },
    children: [
      {
        key: 'lilac-breasted-roller',
        parentKey: 'african-birds',
        label: 'Lilac-breasted roller',
        values: {
          iconPrefix: <Placeholder />,
        },
      },
    ],
  },
];

function Node({ node }: { node: TreeNode<ItemValues> }) {
  const { values, isDisabled } = node;

  return (
    <Tree.Item
      id={node.key}
      key={node.key}
      textValue={node.label}
      isDisabled={isDisabled}
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
                {isDisabled && (
                  <Icon
                    className='fg-default-dark aspect-square rounded-full bg-interactive-hover-dark p-xs'
                    size={size}
                  >
                    <LockFill />
                  </Icon>
                )}
                {values?.hasWarning && (
                  <Icon className='fg-serious-bold'>
                    <Warning />
                  </Icon>
                )}
                <Button
                  size={size}
                  variant='icon'
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
    const { nodes, dragAndDropConfig, actions } = useTreeState({ items });

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
          dragAndDropConfig={dragAndDropConfig}
          items={nodes}
          style={{ width: '500px' }}
          onExpandedChange={actions.onExpandedChange}
          onSelectionChange={actions.onSelectionChange}
          onVisibilityChange={actions.onVisibilityChange}
          aria-label='Drag and Drop example'
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

    const handleSelection = (keys: Selection) => {
      if (keys === 'all') {
        return handleSelectAll();
      }

      setDB(actions.onSelectionChange(keys));
    };

    const handleExpansion = (keys: Set<Key>) => {
      setDB(actions.onExpandedChange(keys));
    };

    const handleExpandAll = () => {
      setDB(actions.expandAll());
    };

    const handleCollapseAll = () => {
      setDB(actions.collapseAll());
    };

    const handleSelectAll = () => {
      setDB(actions.selectAll());
    };

    const handleUnselectAll = () => {
      setDB(actions.unselectAll());
    };

    const handleVisibility = (keys: Set<Key>) => {
      setDB(actions.onVisibilityChange(keys));
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
          <Button size='small' variant='icon' onPress={handleExpandAll}>
            <Icon>
              <ExpandAll />
            </Icon>
          </Button>
          <Button size='small' variant='icon' onPress={handleCollapseAll}>
            <Icon>
              <CollapseAll />
            </Icon>
          </Button>
        </div>
        <Tree
          {...args}
          items={db}
          style={{ width: '500px' }}
          onExpandedChange={handleExpansion}
          onSelectionChange={handleSelection}
          onVisibilityChange={handleVisibility}
          aria-label='Stateless Example'
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
    const [expanded, setExpanded] = useState<Set<Key>>(new Set(['fruit']));
    const [selected, setSelected] = useState<Set<Key>>(new Set());
    const [visibility, setVisibility] = useState<Set<Key>>(
      new Set(['fruit', 'apples', 'red']),
    );

    return (
      <Tree
        {...args}
        style={{ width: '500px' }}
        aria-label='Basic Static Example'
        expandedKeys={expanded}
        onExpandedChange={setExpanded}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        visibleKeys={visibility}
        onVisibilityChange={setVisibility}
      >
        <Tree.Item id='fruit' textValue='fruit'>
          <Tree.Item.Content>Fruit</Tree.Item.Content>
          <Tree.Item id='apples' textValue='apples'>
            <Tree.Item.Content>Apples</Tree.Item.Content>
            <Tree.Item id='green' textValue='green-apple'>
              <Tree.Item.Content>Green Apple</Tree.Item.Content>
            </Tree.Item>
            <Tree.Item id='red' textValue='red-apple'>
              <Tree.Item.Content>Red Apple</Tree.Item.Content>
            </Tree.Item>
            <Tree.Item id='yellow' textValue='yellow-apple'>
              <Tree.Item.Content>Yellow Apple</Tree.Item.Content>
            </Tree.Item>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id='vegetables' textValue='vegetables'>
          <Tree.Item.Content>Vegetables</Tree.Item.Content>
          <Tree.Item id='carrot' textValue='carrot'>
            <Tree.Item.Content>Carrot</Tree.Item.Content>
          </Tree.Item>
          <Tree.Item id='kale' textValue='kale'>
            <Tree.Item.Content>Kale</Tree.Item.Content>
          </Tree.Item>
        </Tree.Item>
      </Tree>
    );
  },
};
