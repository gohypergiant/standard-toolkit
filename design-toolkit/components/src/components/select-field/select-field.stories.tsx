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

import Placeholder from '@accelint/icons/placeholder';
import { type ReactNode, useId, useState } from 'react';
import { Icon } from '../icon';
import { Options } from '../options';
import { SelectField } from './index';
import type { Key } from '@react-types/shared';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/SelectField',
  component: SelectField,
  args: {
    label: 'Label',
    description: 'Helper text',
    errorMessage: '',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    autoFocus: true,
    placeholder: 'Select...',
    layoutOptions: {
      estimatedRowHeight: 46,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <SelectField {...args}>
        <Options.Section header='North American Birds'>
          <Options.Item textValue='Blue Jay'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Blue Jay</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Gray catbird' color='serious'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Gray catbird</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Black-capped chickadee' color='critical'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Black-capped chickadee</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Song Sparrow'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Song Sparrow</Options.Item.Label>
          </Options.Item>
        </Options.Section>
        <Options.Section header='African Birds'>
          <Options.Item textValue='Lilac-breasted roller'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Lilac-breasted roller</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Hornbill'>
            <Icon>
              <Placeholder />
            </Icon>
            <Options.Item.Label>Hornbill</Options.Item.Label>
          </Options.Item>
        </Options.Section>
      </SelectField>
    );
  },
};

export const ControlledSelection: Story = {
  render: (args) => {
    const koalaId = useId();
    const kangarooId = useId();
    const platypusId = useId();
    const bisonId = useId();
    const [value, setValue] = useState<Key>(bisonId);

    const handleSelection = (key: Key | null) => {
      if (key) {
        setValue(key);
      }
    };

    return (
      <SelectField
        {...args}
        selectedKey={value}
        onSelectionChange={handleSelection}
      >
        <Options.Item id={koalaId} textValue='Koala'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Koala</Options.Item.Label>
        </Options.Item>
        <Options.Item id={kangarooId} textValue='Kangaroo'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Kangaroo</Options.Item.Label>
        </Options.Item>
        <Options.Item id={platypusId} textValue='Platypus'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Platypus</Options.Item.Label>
        </Options.Item>
        <Options.Item id={bisonId} textValue='Bison'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Bison</Options.Item.Label>
        </Options.Item>
      </SelectField>
    );
  },
};

const manyItems: { id: number; name: string; prefixIcon: ReactNode }[] = [];
for (let i = 0; i < 5000; i++) {
  manyItems.push({ id: i, name: `Item ${i}`, prefixIcon: <Placeholder /> });
}

export const WithManyItems: Story = {
  render: (args) => (
    <SelectField {...args}>
      {manyItems.map((item) => (
        <Options.Item key={item.id} textValue={item.name}>
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <Options.Item.Label>{item.name}</Options.Item.Label>
        </Options.Item>
      ))}
    </SelectField>
  ),
};
