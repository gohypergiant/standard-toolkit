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

import { Placeholder } from '@accelint/icons';
import { useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Chip } from './';
import { DeletableChip } from './deletable';
import { ChipList } from './list';
import { SelectableChip } from './selectable';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  ChipListProps,
  DeletableChipProps,
  SelectableChipProps,
} from './types';

type AliasBase = ChipListProps<unknown> & { isDisabled: boolean };
type AliasSelectable = React.FC<AliasBase & SelectableChipProps>;
type AliasDeletable = React.FC<AliasBase & DeletableChipProps>;

const meta = {
  title: 'Components/Chip',
  component: Chip,
  args: {
    size: 'medium',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
} satisfies Meta<typeof Chip>;

const metaFromSelectable = {
  ...meta,
  component: ChipList as AliasSelectable,
} satisfies Meta<AliasSelectable>;

const metaFromDeletable = {
  ...meta,
  component: ChipList as AliasDeletable,
} satisfies Meta<AliasDeletable>;

export default meta;
type Story = StoryObj<typeof meta>;
type StoryForSelectable = StoryObj<typeof metaFromSelectable>;
type StoryForDeletable = StoryObj<typeof metaFromDeletable>;

export const Default: Story = {
  args: {
    children: 'Chip',
    variant: 'info',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'advisory', 'normal', 'serious', 'critical'],
    },
  },
  render: ({ children, ...args }) => (
    <Chip {...args}>
      <Icon>
        <Placeholder />
      </Icon>
      {children}
    </Chip>
  ),
};

export const List: Story = {
  args: {
    variant: 'info',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'advisory', 'normal', 'serious', 'critical'],
    },
  },
  parameters: {
    controls: {
      exclude: ['children', 'className', 'variant'],
    },
  },
  render: ({ size }) => (
    <ChipList size={size}>
      {List.argTypes?.variant?.options?.map((label) => (
        <Chip key={label} className='capitalize' variant={label}>
          {label}
        </Chip>
      ))}
    </ChipList>
  ),
};

const selectableData = [
  {
    id: 'chip-1',
    label: 'Selectable chip',
  },
  {
    id: 'chip-2',
    label: 'Selectable chip',
  },
  {
    id: 'chip-3',
    label: 'Selectable chip',
  },
];

export const SelectableChipList: StoryForSelectable = {
  args: {
    disallowEmptySelection: false,
    selectionMode: 'multiple',
    isDisabled: false,
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
  },
  parameters: {
    controls: {
      exclude: ['children'],
    },
  },
  render: ({ children, id, className, style, size, isDisabled, ...rest }) => (
    <ChipList
      {...rest}
      disabledKeys={isDisabled ? selectableData.map(({ id }) => id) : undefined}
      items={selectableData}
      size={size}
    >
      {({ id, label }) => <SelectableChip id={id}>{label}</SelectableChip>}
    </ChipList>
  ),
};

const deletableChips = new Set([
  'Deletable chip 1',
  'Deletable chip 2',
  'Deletable chip 3',
]);

export const DeletableChipList: StoryForDeletable = {
  args: {
    isDisabled: false,
  },
  parameters: {
    controls: {
      exclude: ['children'],
    },
  },
  render: ({ children, id, className, style, size, isDisabled, ...rest }) => {
    const [chips, setChips] = useState(deletableChips);

    return (
      <>
        <ChipList
          {...rest}
          disabledKeys={isDisabled ? chips : undefined}
          items={Array.from(chips).map((label) => ({ id: label, label }))}
          size={size}
          onRemove={(keys) => setChips((prev) => prev.difference(keys))}
        >
          {({ id, label }) => <DeletableChip id={id}>{label}</DeletableChip>}
        </ChipList>
        <Button
          size='xsmall'
          variant='flat'
          onPress={() => setChips(deletableChips)}
        >
          Reset
        </Button>
      </>
    );
  },
};
