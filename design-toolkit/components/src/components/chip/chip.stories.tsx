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
import type { Meta, StoryObj } from '@storybook/react';
import { type FC, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Chip } from './index';
import type {
  ChipListProps,
  DeletableChipProps,
  SelectableChipProps,
} from './types';

const meta: Meta<typeof Chip> = {
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
};

export default meta;

export const Default: StoryObj<typeof Chip> = {
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

export const List: StoryObj<typeof Chip> = {
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
    <Chip.List size={size}>
      {List.argTypes?.variant?.options?.map((label) => (
        <Chip key={label} className='capitalize' variant={label}>
          {label}
        </Chip>
      ))}
    </Chip.List>
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

export const SelectableChipList: StoryObj<
  FC<ChipListProps<unknown> & SelectableChipProps & { isDisabled: boolean }>
> = {
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
    <Chip.List
      {...rest}
      disabledKeys={isDisabled ? selectableData.map(({ id }) => id) : undefined}
      items={selectableData}
      size={size}
    >
      {({ id, label }) => <Chip.Selectable id={id}>{label}</Chip.Selectable>}
    </Chip.List>
  ),
};

const deletableChips = new Set([
  'Deletable chip 1',
  'Deletable chip 2',
  'Deletable chip 3',
]);

export const DeletableChipList: StoryObj<
  FC<ChipListProps<unknown> & DeletableChipProps & { isDisabled: boolean }>
> = {
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
        <Chip.List
          {...rest}
          disabledKeys={isDisabled ? chips : undefined}
          items={Array.from(chips).map((label) => ({ id: label, label }))}
          size={size}
          onRemove={(keys) => setChips((prev) => prev.difference(keys))}
        >
          {({ id, label }) => <Chip.Deletable id={id}>{label}</Chip.Deletable>}
        </Chip.List>
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
