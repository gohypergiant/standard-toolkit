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

import { CenterOn, Placeholder } from '@accelint/icons';
import Warning from '@accelint/icons/warning';
import type { DroppableCollectionReorderEvent, Key } from '@react-types/shared';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Tree } from './index';
import type {
  DragAndDropConfig,
  TreeActionRenderProps,
  TreeItem as TreeItemType,
} from './types';
import './tree.css';

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

const treeActions = ({ variant }: TreeActionRenderProps) => {
  const size = variant === 'cozy' ? 'medium' : 'small';

  return (
    <>
      <Icon className='fg-serious' size={size}>
        <Warning />
      </Icon>
      <IconButton size={size}>
        <Icon>
          <CenterOn />
        </Icon>
      </IconButton>
    </>
  );
};

const nodes: TreeItemType[] = [
  {
    id: 'north-american-birds',
    label: 'North American Birds',
    treeActions,
    iconPrefix: <Placeholder />,
    isReadOnly: false,
    nodes: [
      {
        id: 'blue-jay',
        label: 'Blue jay',
        description: 'cyanocitta cristata',
        iconPrefix: <Placeholder />,
        isReadOnly: false,
        isParentVisible: true,
        treeActions,
      },
      {
        id: 'gray-catbird',
        label: 'Gray catbird',
        description: 'dumetella carolinensis',
        isReadOnly: false,
        isParentVisible: true,
        iconPrefix: <Placeholder />,
      },
      {
        id: 'black-capped-chickadee',
        label: 'Black-capped chickadee',
        description: 'Poecile atricapillus',
        isReadOnly: true,
        isParentVisible: true,
        iconPrefix: <Placeholder />,
        nodes: [
          {
            id: 'northern-cardinal',
            label: 'Northern Cardinal',
            description: 'Cardinalis cardinalis',
            isReadOnly: false,
            isParentVisible: false,
            iconPrefix: <Placeholder />,
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
    nodes: [
      {
        id: 'lilac-breasted-roller',
        label: 'Lilac-breasted roller',
        isReadOnly: false,
        isParentVisible: false,
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
 * If you want to have a static collection, use Tree.Item
 * If you want to recursively map over a data structure, use Tree.Node
 */
export const StaticCollection: Story = {
  render: (args) => (
    <Tree
      style={{ width: '500px' }}
      aria-label='Basic Static Example'
      selectedKeys={['fruit']}
      {...args}
    >
      <Tree.Item id='fruit' label='Fruit' treeActions={treeActions}>
        <Tree.Item id='apples' label='Apples'>
          <Tree.Item id='green' label='Green Apple' />
          <Tree.Item id='red' label='Red Apple' isLastOfSet />
        </Tree.Item>
      </Tree.Item>

      <Tree.Item id='vegetables' label='Vegetables'>
        <Tree.Item id='carrot' label='Carrot' />
        <Tree.Item id='kale' label='Kale' />
      </Tree.Item>
    </Tree>
  ),
};

export const DataCollection: Story = {
  render: (args) => {
    /**
     * These two sets of managed state, expanded and selected, are used for convenience only,
     * as an example where all tree state is managed externally. Actual implementation can be
     * managed by any external state system -- local storage, database, in-memory, etc.
     */
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['north-american-birds']),
    );
    const [expandedKeys, setExpandedKeys] = useState<Selection>(
      new Set(['north-american-birds']),
    );

    return (
      <Tree
        style={{ width: '500px' }}
        aria-label='Data Example'
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        {...args}
      >
        {nodes.map((node) => {
          return (
            <Tree.Node
              key={node.id}
              id={node.id}
              label={node.label}
              nodes={node.nodes}
              description={node.description}
              iconPrefix={node.iconPrefix}
              treeActions={node.treeActions}
              isReadOnly={node.isReadOnly}
              isParentVisible={node.isParentVisible}
            />
          );
        })}
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
      <Tree.Item
        data-key='fruit'
        id='fruit'
        label='Fruit'
        treeActions={treeActions}
      >
        <Tree.Item data-key='apples' id='apples' label='Apples'>
          <Tree.Item key='green' id='green' label='Green Apple' />
          <Tree.Item id='red' label='Red Apple' isLastOfSet />
        </Tree.Item>
      </Tree.Item>

      <Tree.Item id='vegetables' label='Vegetables'>
        <Tree.Item id='carrot' label='Carrot' />
        <Tree.Item id='kale' label='Kale' />
      </Tree.Item>
    </Tree>
  ),
};

export const DragAndDrop: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['north-american-birds']),
    );
    const [expandedKeys, setExpandedKeys] = useState<Selection>(
      new Set(['north-american-birds']),
    );

    const dragAndDropConfig: DragAndDropConfig = {
      getItems: (keys: Set<Key>) =>
        [...keys].map((key) => ({
          'text/plain': `${key}`,
        })),
      onReorder: (e: DroppableCollectionReorderEvent) => {
        console.log(e);
        // write example here for setTreeState or is console log enough?
      },
      onDrop: (e) => {
        console.log(e);
      },
    };

    return (
      <Tree
        {...args}
        style={{ width: '500px' }}
        aria-label='Drag and Drop example'
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        dragAndDropConfig={dragAndDropConfig}
      >
        {nodes.map((node) => {
          return (
            <Tree.Node
              key={node.id}
              id={node.id}
              label={node.label}
              nodes={node.nodes}
              description={node.description}
              iconPrefix={node.iconPrefix}
              treeActions={node.treeActions}
              isReadOnly={node.isReadOnly}
              isParentVisible={node.isParentVisible}
            />
          );
        })}
      </Tree>
    );
  },
};
