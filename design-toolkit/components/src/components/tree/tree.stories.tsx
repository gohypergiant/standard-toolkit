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
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Icon } from '../icon';
import { Tree } from './index';
import type { TreeNode } from './types';

const meta = {
  title: 'Components/Tree',
  component: Tree,
  args: {
    variant: 'cozy',
    allowsDragging: true,
    showRuleLines: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact', 'tight'],
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

// TODO: might be better to build this data structure than pass it in?
const treeNodes = {
  root: { key: 'root', label: 'Root', childNodes: ['fruits', 'vegetables'] },
  fruits: {
    key: 'fruits',
    label: 'Fruits',
    childNodes: ['apples', 'pear', 'banana'],
  },
  apples: {
    key: 'apples',
    label: 'Apples',
    description: 'Malus domestica',
    childNodes: ['green', 'red'],
  },
  green: { key: 'green', label: 'Green Apples' },
  red: { key: 'red', label: 'Red Apples' },
  pear: { key: 'pear', label: 'Pear' },
  banana: { key: 'banana', label: 'Banana' },
  vegetables: {
    key: 'vegetables',
    label: 'Vegetables',
    childNodes: ['tomato', 'carrot'],
  },
  tomato: { key: 'tomato', label: 'Tomato' },
  carrot: { key: 'carrot', label: 'Carrot' },
};

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(['fruits', 'green']);
    const [expanded, setExpanded] = useState<string[]>(['fruits', 'apples']);

    /**
     * Example of state management for selected items. Could be done in the tree nodes instead.
     * @param item
     */
    const handleSelect = (item: string[]) => {
      const key = item[0];
      if (key) {
        selected.includes(key)
          ? setSelected((prev) => prev.filter((item) => item !== key))
          : setSelected((prev) => prev.concat(key));
      }
    };

    const handleDrop = (items, target) => {
      alert(
        `Dropped ${items.map((item) =>
          item.getId(),
        )} on ${target.item.getId()}, ${JSON.stringify(target)}`,
      );
    };

    return (
      <div className='w-[500px]'>
        <Tree<TreeNode>
          {...args}
          items={treeNodes}
          selected={selected}
          setSelected={handleSelect}
          expanded={expanded}
          setExpanded={setExpanded}
          onDrop={handleDrop}
        >
          {({ item }) => {
            return (
              <Tree.Node item={item}>
                <Icon className='fg-serious'>
                  <Warning />
                </Icon>
                <Icon>
                  <Placeholder />
                </Icon>
              </Tree.Node>
            );
          }}
        </Tree>
      </div>
    );
  },
};
