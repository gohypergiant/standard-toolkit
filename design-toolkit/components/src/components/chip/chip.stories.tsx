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

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Chip } from './index';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  args: {
    className: undefined,
    children: 'Badge text',
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
  render: ({ children, ...args }) => <Chip {...args}>{children}</Chip>,
};

export const List: Story = {
  render: () => (
    <Chip.List>
      <Chip variant='critical'>Out of gas</Chip>
      <Chip variant='advisory'>Convoy</Chip>
      <Chip variant='advisory'>Priority</Chip>
    </Chip.List>
  ),
};

const selectableData = [
  {
    id: 'chip-1',
    isDisabled: false,
    name: 'Selectable chip',
  },
  {
    id: 'chip-2',
    isDisabled: true,
    name: 'Selectable chip',
  },
  {
    id: 'chip-3',
    isDisabled: false,
    name: 'Selectable chip',
  },
];

export const SelectableChipList: Story = {
  render: () => (
    <Chip.List items={selectableData} selectionMode='multiple'>
      {(item) => (
        <Chip.Selectable id={item.id} isDisabled={item.isDisabled}>
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
  render: () => {
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
            <Chip.Deletable id={item.id} size='small'>
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
