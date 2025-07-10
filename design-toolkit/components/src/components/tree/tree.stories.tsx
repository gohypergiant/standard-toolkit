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

import {
  CenterOn,
  CollapseAll,
  ExpandAll,
  LockFill,
  Placeholder,
} from '@accelint/icons';
import Warning from '@accelint/icons/warning';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Tree } from './index';
import './tree.css';
import type { TreeNode, UseTreeState } from '@/hooks/types';
import { useTreeState } from '@/hooks/useTreeState';
import type { ReactNode } from 'react';
import { Button } from '../button';

const meta: Meta<typeof Tree> = {
  title: 'Components/TreeView',
  component: Tree,
  args: {
    variant: 'cozy',
    selectionType: 'visibility',
    showRuleLines: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact', 'tight'],
    },
    selectionType: {
      control: 'select',
      options: ['visibility', 'checkbox', 'none'],
    },
  },
  parameters: {
    docs: {
      subtitle:
        'Tree component that provides users with a way to navigate nested hierarchical information, with support for keyboard navigation and selection.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

type Item = {
  id: string;
  label: string;
  iconPrefix?: ReactNode;
  description?: string;
  isReadOnly?: boolean;
  items?: Item[];
  hasWarning?: boolean;
};

const items: Item[] = [
  {
    id: 'north-american-birds',
    label: 'North American Birds',
    iconPrefix: <Placeholder />,
    isReadOnly: false,
    items: [
      {
        id: 'blue-jay',
        label: 'Blue jay',
        description: 'cyanocitta cristata',
        iconPrefix: <Placeholder />,
        isReadOnly: false,
        hasWarning: true,
      },
      {
        id: 'gray-catbird',
        label: 'Gray catbird',
        description: 'dumetella carolinensis',
        isReadOnly: false,
        iconPrefix: <Placeholder />,
      },
      {
        id: 'black-capped-chickadee',
        label: 'Black-capped chickadee',
        description: 'Poecile atricapillus',
        isReadOnly: true,
        iconPrefix: <Placeholder />,
        items: [
          {
            id: 'northern-cardinal',
            label: 'Northern Cardinal',
            description: 'Cardinalis cardinalis',
            isReadOnly: false,
            iconPrefix: <Placeholder />,
            hasWarning: true,
          },
        ],
      },
    ],
  },
  {
    id: 'african-birds',
    label: 'African Birds',
    iconPrefix: <Placeholder />,
    isReadOnly: false,
    items: [
      {
        id: 'lilac-breasted-roller',
        label: 'Lilac-breasted roller',
        isReadOnly: false,
        iconPrefix: <Placeholder />,
      },
    ],
  },
  {
    id: 'european-birds',
    label: 'European Birds',
    iconPrefix: <Placeholder />,
    isReadOnly: false,
  },
];

/**
 * Static collections can use the Tree components directly.
 */
export const StaticCollection: Story = {
  render: (args) => (
    <Tree
      style={{ width: '500px' }}
      aria-label='Basic Static Example'
      {...args}
    >
      <Tree.Item id='fruit' label='fruit'>
        <Tree.Content>Fruit</Tree.Content>
        <Tree.Item id='apples' label='apples'>
          <Tree.Content>Apples</Tree.Content>
          <Tree.Item id='green' label='green-apple'>
            <Tree.Content>Green Apple</Tree.Content>
          </Tree.Item>
          <Tree.Item id='red' label='red-apple' isLastOfSet>
            <Tree.Content>Red Apple</Tree.Content>
          </Tree.Item>
        </Tree.Item>
      </Tree.Item>

      <Tree.Item id='vegetables' label='vegetables'>
        <Tree.Content>Vegetables</Tree.Content>
        <Tree.Item id='carrot' label='carrot'>
          <Tree.Content>Carrot</Tree.Content>
        </Tree.Item>
        <Tree.Item id='kale' label='kale'>
          <Tree.Content>Kale</Tree.Content>
        </Tree.Item>
      </Tree.Item>
    </Tree>
  ),
};

function Node<T extends object>({
  node,
}: { node: TreeNode<Item>; state?: UseTreeState<T> }) {
  const { description, iconPrefix, isReadOnly, hasWarning } = node.value;

  return (
    <Tree.Item id={node.key} key={node.key} label={node.value.label}>
      <Tree.Content>
        {({ variant }) => {
          return (
            <>
              {Boolean(iconPrefix) && <Tree.Icon>{iconPrefix}</Tree.Icon>}
              {node.value.label}
              {description && (
                <Tree.Description>{description}</Tree.Description>
              )}
              {isReadOnly && (
                <Icon
                  className='fg-default-dark aspect-square rounded-full bg-interactive-hover-dark p-xs'
                  size={variant === 'cozy' ? 'medium' : 'small'}
                >
                  <LockFill />
                </Icon>
              )}
              {hasWarning && (
                <Icon
                  className='fg-serious'
                  size={variant === 'cozy' ? 'medium' : 'small'}
                >
                  <Warning />
                </Icon>
              )}
              <IconButton
                size={variant === 'cozy' ? 'medium' : 'small'}
                onPress={console.log}
              >
                <Icon>
                  <CenterOn />
                </Icon>
              </IconButton>
            </>
          );
        }}
      </Tree.Content>
      {node.children?.map((child: TreeNode<Item>) => (
        <Node key={child.key} node={child} />
      ))}
    </Tree.Item>
  );
}

export const DataCollection: Story = {
  render: (args) => {
    const state = useTreeState<Item>({
      initialItems: items ?? [],
      initialSelectedKeys: ['black-capped-chickadee'],
      initialExpandedKeys: ['north-american-birds'],
      getKey: (item) => item.id,
      getChildren: (item) => item.items ?? [],
    });

    const { nodes, selectedKeys, expandedKeys, actions } = state;

    return (
      <>
        <div className='flex items-center gap-m'>
          <Button size='small' variant='flat' onPress={actions.selectAll}>
            Select All
          </Button>
          <Button size='small' variant='flat' onPress={actions.unselectAll}>
            Unselect All
          </Button>
          <IconButton size='small' onPress={actions.expandAll}>
            <Icon>
              <ExpandAll />
            </Icon>
          </IconButton>
          <IconButton size='small' onPress={actions.collapseAll}>
            <Icon>
              <CollapseAll />
            </Icon>
          </IconButton>
        </div>
        <Tree
          {...args}
          style={{ width: '500px' }}
          aria-label='Dynamic example'
          expandedKeys={expandedKeys}
          onExpandedChange={actions.setExpandedKeys}
          selectedKeys={selectedKeys}
          onSelectionChange={actions.setSelectedKeys}
          items={nodes}
        >
          {(node) => <Node key={node.key} node={node} state={state} />}
        </Tree>
      </>
    );
  },
};

export const DragAndDrop: Story = {
  render: (args) => {
    const { nodes, selectedKeys, expandedKeys, dragAndDropConfig, actions } =
      useTreeState<Item>({
        initialItems: items,
        initialSelectedKeys: ['european-birds'],
        initialExpandedKeys: ['north-american-birds'],
        getKey: (item) => item.id,
        getChildren: (item) => item.items ?? [],
      });

    return (
      <Tree
        {...args}
        style={{ width: '500px' }}
        aria-label='Drag and Drop example'
        expandedKeys={expandedKeys}
        onExpandedChange={actions.setExpandedKeys}
        selectedKeys={selectedKeys}
        onSelectionChange={actions.setSelectedKeys}
        dragAndDropConfig={dragAndDropConfig}
        items={nodes}
      >
        {(node) => <Node key={node.key} node={node} />}
      </Tree>
    );
  },
};

/**
 * If you want to perform a different action for a tree item and leave
 * the expand/collapse behavior to be managed internally to the tree,
 * you can use the onAction event tree listener.
 */
export const TreeState: Story = {
  render: (args) => (
    <Tree
      {...args}
      style={{ width: '500px' }}
      aria-label='State Example'
      onAction={(e) => console.log(e)}
    >
      <Tree.Item id='fruit' label='fruit'>
        <Tree.Content>Fruit</Tree.Content>
        <Tree.Item id='apples' label='apples'>
          <Tree.Content>Apples</Tree.Content>
          <Tree.Item id='green' label='green-apple'>
            <Tree.Content>Green Apple</Tree.Content>
          </Tree.Item>
          <Tree.Item id='red' label='red-apple' isLastOfSet>
            <Tree.Content>Red Apple</Tree.Content>
          </Tree.Item>
        </Tree.Item>
      </Tree.Item>

      <Tree.Item id='vegetables' label='vegetables'>
        <Tree.Content>Vegetables</Tree.Content>
        <Tree.Item id='carrot' label='carrot'>
          <Tree.Content>Carrot</Tree.Content>
        </Tree.Item>
        <Tree.Item id='kale' label='kale'>
          <Tree.Content>Kale</Tree.Content>
        </Tree.Item>
      </Tree.Item>
    </Tree>
  ),
};
