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

import { Placeholder } from '@/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Chip } from './index';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  args: {
    className: undefined,
    children: 'Chip text',
    size: 'medium',
    variant: 'info',
  },
  argTypes: {
    className: { type: 'string' },
    children: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
    variant: {
      control: 'select',
      options: ['info', 'normal', 'serious', 'critical', 'advisory'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <Chip {...args}>
      <Placeholder />
      {children}
    </Chip>
  ),
};

export const List: Story = {
  parameters: {
    controls: {
      exclude: ['children', 'className', 'variant'],
    },
  },
  render: (args) => (
    <Chip.List>
      {meta.argTypes?.variant?.options?.map((option) => (
        <Chip
          key={option}
          variant={option}
          className='capitalize'
          size={args.size}
        >
          {option}
        </Chip>
      ))}
    </Chip.List>
  ),
};

const selectableData = [
  {
    id: 'chip-1',
    name: 'Selectable chip',
  },
  {
    id: 'chip-2',
    name: 'Selectable chip',
  },
  {
    id: 'chip-3',
    name: 'Selectable chip',
  },
];

export const SelectableChipList: Story = {
  parameters: {
    controls: {
      exclude: ['children', 'className', 'variant'],
    },
  },
  render: (args) => (
    <Chip.List items={selectableData} selectionMode='multiple'>
      {(item) => (
        <Chip.Selectable id={item.id} size={args.size}>
          {item.name}
        </Chip.Selectable>
      )}
    </Chip.List>
  ),
};

const deletableData = [
  {
    id: 'chip-1',
    name: 'Deletable chip 1',
  },
  {
    id: 'chip-2',
    name: 'Deletable chip 2',
  },
  {
    id: 'chip-3',
    name: 'Deletable chip 3',
  },
];

export const DeletableChipList: Story = {
  parameters: {
    controls: {
      exclude: ['children', 'className', 'variant'],
    },
  },
  render: (args) => {
    const [items, setItems] = useState(deletableData);

    return (
      <div className='flex flex-col items-center gap-m'>
        <Chip.List
          items={items}
          selectionMode='multiple'
          onRemove={(ids) =>
            setItems((items) => items.filter((i) => !ids.has(i.id)))
          }
        >
          {(item) => (
            <Chip.Deletable id={item.id} size={args.size}>
              {item.name}
            </Chip.Deletable>
          )}
        </Chip.List>
        <Button
          variant='flat'
          size='xsmall'
          onPress={() => setItems(deletableData)}
        >
          Reset
        </Button>
      </div>
    );
  },
};
