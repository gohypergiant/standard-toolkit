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

import { Icon } from '@/components/icon';
import { Placeholder } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { type ReactNode, useState } from 'react';
import type { Selection } from 'react-aria-components';
import { IconButton } from '../icon-button';
import { Tooltip } from '../tooltip';
import { Tree } from './index';
const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  args: {
    // className: undefined,
    size: 'cozy',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

const ExampleAction = () => {
  return (
    <Tooltip delay={500}>
      <Tooltip.Trigger>
        <IconButton size='small'>
          <Icon>
            <Placeholder />
          </Icon>
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Body>Action Label</Tooltip.Body>
    </Tooltip>
  );
};

type NodeItem = {
  id: string;
  label: string;
  action?: ReactNode;
  children?: NodeItem[];
};

const items: NodeItem[] = [
  {
    id: '1',
    label: 'Apple',
    action: (
      <Icon>
        <Placeholder />
      </Icon>
    ),
    children: [
      {
        id: '2',
        label: 'Pear',
        action: (
          <Icon>
            <Placeholder />
          </Icon>
        ),
      },
    ],
  },
  {
    id: '3',
    label: 'Banana',
    action: (
      <Icon>
        <Placeholder />
      </Icon>
    ),
  },
];

/**
 * visibility, since it's controlled, will have to
 * manage outside the tree context -- I think? we
 * might be able to handle that since we know the children?
 */
export const Working: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['1', '3']),
    );

    return (
      <Tree<NodeItem>
        aria-label='Fruit Tree'
        style={{ height: '300px' }}
        items={items}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        {...args}
      >
        {(node: NodeItem) => {
          return (
            <Tree.Node
              id={node.id}
              key={node.id}
              label={node.label}
              textValue={node.label}
              actionComponent={node.action}
            />
          );
        }}
      </Tree>
    );
  },
};

export const Default: Story = {
  render: (args) => (
    <Tree className='w-[450px]' {...args}>
      <Tree.Item label='Testing' textValue='Testing'>
        <Tree.Item label='Testing'>
          <Tree.Item
            label='Testing'
            actionComponent={<ExampleAction />}
            iconComponent={<Placeholder />}
          />
          <Tree.Item label='Testing' />
          <Tree.Item label='Testing' />
        </Tree.Item>
        <Tree.Item label='Testing' isDisabled={true}>
          <Tree.Item label='Testing' />
          <Tree.Item label='Testing' />
        </Tree.Item>
      </Tree.Item>
      <Tree.Item label='Testing'>
        <Tree.Item label='Testing' />
        <Tree.Item label='Testing' />
      </Tree.Item>
      <Tree.Item label='Testing' />
      <Tree.Item isDisabled={true} label='Testing' />
      <Tree.Item isDisabled={true} label='Testing' />
      <Tree.Item label='Testing' />
    </Tree>
  ),
};
