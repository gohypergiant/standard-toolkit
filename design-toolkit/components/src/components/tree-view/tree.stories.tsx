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

import { Placeholder, Warning } from '@accelint/icons';
import type { DragTarget, ItemInstance } from '@headless-tree/core';
import type { Meta, StoryObj } from '@storybook/react';
import { type ReactNode, useCallback, useState } from 'react';
import { Icon } from '../icon';
import { TreeView } from './index';
import type { TreeItemRenderProps, TreeNode } from './types';

const meta = {
  title: 'Components/TreeView',
  component: TreeView,
  args: {
    variant: 'cozy',
    selectionMode: 'visibility',
    allowsDragging: true,
    showRuleLines: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact', 'tight'],
    },
    selectionMode: {
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
type Story = StoryObj;

interface StoryNode extends TreeNode {
  indicator?: ReactNode;
}

// TODO: might be better to build this data structure than pass it in?
const treeNodes = {
  root: { key: 'root', label: 'Root', childNodes: ['fruits', 'vegetables'] },
  fruits: {
    key: 'fruits',
    label: 'Fruits',
    childNodes: ['apples', 'pear', 'banana', 'kiwi', 'mango'],
    iconPrefix: <Placeholder />,
    indicator: <Warning />,
  },
  apples: {
    key: 'apples',
    label: 'Apples',
    description: 'Malus domestica',
    childNodes: ['green', 'red'],
  },
  green: { key: 'green', label: 'Green Apples' },
  red: { key: 'red', label: 'Red Apples' },
  pear: { key: 'pear', label: 'Pear', isReadOnly: true },
  banana: { key: 'banana', label: 'Banana' },
  kiwi: { key: 'kiwi', label: 'Kiwi', isDisabled: true },
  mango: { key: 'mango', label: 'Mango', isDisabled: true },
  vegetables: {
    key: 'vegetables',
    label: 'Vegetables',
    childNodes: ['tomato', 'carrot'],
    iconPrefix: <Placeholder />,
    indicator: <Warning />,
  },
  tomato: { key: 'tomato', label: 'Tomato' },
  carrot: { key: 'carrot', label: 'Carrot' },
};

/**
 * example for handling drag/drop state
 * @param items
 * @param target
 */
const handleDrop = (
  items: ItemInstance<StoryNode>[],
  target: DragTarget<StoryNode>,
) => {
  alert(
    `Dropped ${items.map((item) =>
      item.getId(),
    )} on ${target.item.getId()}, ${JSON.stringify(target)}`,
  );
};

export const Controlled: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(['fruits', 'green']);
    const [expanded, setExpanded] = useState<string[]>(['fruits', 'apples']);

    const rightSlot = useCallback(
      ({ indicator }: TreeItemRenderProps<StoryNode>) => {
        return (
          <>
            <Icon className='fg-serious'>{indicator}</Icon>
            <Icon>
              <Placeholder />
            </Icon>
          </>
        );
      },
      [],
    );

    return (
      <div className='w-[550px]'>
        <TreeView<StoryNode>
          {...args}
          items={treeNodes}
          selected={selected}
          setSelected={setSelected}
          expanded={expanded}
          setExpanded={setExpanded}
          onDrop={handleDrop}
          customChild={child}
        />
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: (args) => {
    return (
      <div className='w-[550px]'>
        <TreeView<StoryNode> {...args} items={treeNodes} onDrop={handleDrop}>
          {({ item }) => {
            return (
              <TreeView.Node item={item}>
                <Icon className='fg-serious'>
                  {item.getItemData().indicator}
                </Icon>
                <Icon>
                  <Placeholder />
                </Icon>
              </TreeView.Node>
            );
          }}
        </TreeView>
      </div>
    );
  },
};
