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

import { COMMON_CONTROL, createControl, EXCLUSIONS } from '^storybook/utils';
import { useState } from 'react';
import { CRITICALITY } from '@/constants/criticality';
import { SELECTION } from '@/constants/selection';
import { SIZE } from '@/constants/size';
import { Button } from '../button';
import { Chip } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { SelectableChipProps } from './types';

type Alias = React.FC<
  SelectableChipProps & {
    disallowEmptySelection: boolean;
    selectionMode: (typeof SELECTION)[keyof typeof SELECTION];
  }
>;

const meta = {
  title: 'Components/ChipList',
  component: Chip.List as Alias,
  args: {
    children: 'Chip.List',
    disallowEmptySelection: false,
    isDisabled: false,
    selectionMode: SELECTION.NONE,
    size: SIZE.MEDIUM,
  },
  argTypes: {
    children: COMMON_CONTROL.children,
    disallowEmptySelection: createControl.boolean(
      'Disallow empty selection as valid',
    ),
    isDisabled: COMMON_CONTROL.isDisabled,
    selectionMode: COMMON_CONTROL.selectionMode,
    size: COMMON_CONTROL.size.compact,
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, 'dependencies', 'renderEmptyState'],
    },
    docs: {
      subtitle: 'Interactive chip components for selections and actions.',
    },
  },
} satisfies Meta<Alias>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    controls: {
      exclude: [
        ...meta.parameters.controls.exclude,
        'disallowEmptySelection',
        'isDisabled',
        'selectionMode',
      ],
    },
  },
  render: ({ size }) => (
    <Chip.List size={size}>
      {Object.values(CRITICALITY).map((label) => (
        <Chip id={label} key={label} className='capitalize' variant={label}>
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

export const SelectableChipList: Story = {
  args: {
    selectionMode: SELECTION.MULTIPLE,
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

export const DeletableChipList: Story = {
  parameters: {
    controls: {
      exclude: [
        ...meta.parameters.controls.exclude,
        'disallowEmptySelection',
        'selectionMode',
      ],
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
          size={SIZE.XSMALL}
          variant='flat'
          onPress={() => setChips(deletableChips)}
        >
          Reset
        </Button>
      </>
    );
  },
};
