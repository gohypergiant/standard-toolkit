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

import { useTree } from '@/hooks/useTree';
import { Placeholder } from '@accelint/icons';
import CircleTool from '@accelint/icons/circle-tool';
import Warning from '@accelint/icons/warning';
import type { Meta, StoryObj } from '@storybook/react';
import { type ReactNode, useState } from 'react';
import type { Selection } from 'react-aria-components';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Tree, type TreeItem } from './index';

const meta: Meta<typeof Tree> = {
  title: 'Components/TreeView',
  component: Tree,
  args: {
    variant: 'cozy',
    selectionType: 'visibility',
    allowsDragging: true,
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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof Tree>;

const TreeActions = () => (
  <>
    <Icon className='fg-serious'>
      <Warning />
    </Icon>
    <IconButton>
      <Icon>
        <CircleTool />
      </Icon>
    </IconButton>
  </>
);

// no drag and drop with static collection
export const Basic: Story = {
  render: (args) => (
    <Tree aria-label='Basic Static Example' {...args}>
      <Tree.Item id='fruit' label='Fruit' actions={<TreeActions />}>
        <Tree.Item id='apples' label='Apples'>
          <Tree.Item id='green' label='Green Apple' />
          <Tree.Item id='red' label='Red Apple' />
        </Tree.Item>
      </Tree.Item>

      <Tree.Item id='vegetables' label='Vegetables'>
        <Tree.Item id='carrot' label='Carrot' />
        <Tree.Item id='kale' label='Kale' />
      </Tree.Item>
    </Tree>
  ),
};

type ExampleNode = {
  description?: string;
  iconPrefix?: ReactNode;
  actions?: ReactNode;
};

const items: TreeItem<ExampleNode>[] = [
  {
    id: 'north-american-birds',
    parentId: null,
    label: 'North American Birds',
    isExpanded: true,
    isSelected: true,
    value: {
      actions: <TreeActions />,
      iconPrefix: <Placeholder />,
    },
    children: [
      {
        id: 'blue-jay',
        parentId: 'north-american-birds',
        label: 'Blue jay',
        isSelected: true,
        value: {
          description: 'cyanocitta cristata',
          iconPrefix: <Placeholder />,
          actions: <TreeActions />,
        },
      },
      {
        id: 'gray-catbird',
        parentId: 'north-american-birds',
        label: 'Gray catbird',
        isSelected: true,
        value: {
          description: 'dumetella carolinensis',
          iconPrefix: <Placeholder />,
        },
      },
      {
        id: 'black-capped-chickadee',
        parentId: 'north-american-birds',
        label: 'Black-capped chickadee',
        isSelected: true,
        value: {
          description: 'Poecile atricapillus',
          iconPrefix: <Placeholder />,
        },
      },
    ],
  },
  {
    id: 'african-birds',
    parentId: null,
    label: 'African Birds',
    isExpanded: true,
    value: {
      iconPrefix: <Placeholder />,
    },
    children: [
      {
        id: 'lilac-breasted-roller',
        parentId: 'african-birds',
        label: 'Lilac-breasted roller',
        value: {
          iconPrefix: <Placeholder />,
        },
      },
    ],
  },
];

export const ControlledTree: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [expandedKeys, setExpandedKeys] = useState<Selection>(
      new Set(['north-american-birds']),
    );

    return (
      <Tree<TreeItem<ExampleNode>>
        {...args}
        aria-label='controlled tree'
        style={{ height: '300px' }}
        items={items}
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {function renderItem(item) {
          return (
            <Tree.Item
              id={item.id}
              label={item.label}
              iconPrefix={item.value.iconPrefix}
              actions={item.value.actions}
              description={item.value.description}
            >
              <Tree.Collection items={item.children}>
                {renderItem}
              </Tree.Collection>
            </Tree.Item>
          );
        }}
      </Tree>
    );
  },
};

/**
 * Example with tree state data
 * Drag and Drop hooks does not need to use treeData state
 * it can be anything
 */
export const DragAndDrop: Story = {
  render: (args) => {
    // this should be in the format we actually want it to be
    const { tree, dragAndDropHooks } = useTree<TreeItem<ExampleNode>>({
      initialItems: items,
      getKey: (item) => item.id,
      getChildren: (item) => item.children ?? [],
    });

    return (
      <Tree items={tree.items} {...args} dragAndDropHooks={dragAndDropHooks}>
        {function renderItem(item) {
          console.log(item);
          return (
            <Tree.Item
              id={item.value.id}
              label={item.value.label}
              iconPrefix={item.value.value.iconPrefix}
              actions={item.value.value.actions}
            >
              <Tree.Collection items={item.children}>
                {renderItem}
              </Tree.Collection>
            </Tree.Item>
          );
        }}
      </Tree>
    );
  },
};
