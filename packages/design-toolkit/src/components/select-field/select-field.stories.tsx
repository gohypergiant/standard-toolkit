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
import { OptionsItem } from '../options/item';
import { OptionsItemLabel } from '../options/item-label';
import { OptionsSection } from '../options/section';
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
        <OptionsSection header='North American Birds'>
          <OptionsItem textValue='Blue Jay'>
            <Icon>
              <Placeholder />
            </Icon>
            <OptionsItemLabel>Blue Jay</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem textValue='Gray catbird' color='serious'>
            <Icon>
              <Placeholder />
            </Icon>
            <OptionsItemLabel>Gray catbird</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem textValue='Black-capped chickadee' color='critical'>
            <Icon>
              <Placeholder />
            </Icon>
            <OptionsItemLabel>Black-capped chickadee</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem textValue='Song Sparrow'>
            <Icon>
              <Placeholder />
            </Icon>
            <OptionsItemLabel>Song Sparrow</OptionsItemLabel>
          </OptionsItem>
        </OptionsSection>
        <OptionsSection header='African Birds'>
          <OptionsItem textValue='Lilac-breasted roller'>
            <Icon>
              <Placeholder />
            </Icon>
            <OptionsItemLabel>Lilac-breasted roller</OptionsItemLabel>
          </OptionsItem>
          <OptionsItem textValue='Hornbill'>
            <Icon>
              <Placeholder />
            </Icon>
            <OptionsItemLabel>Hornbill</OptionsItemLabel>
          </OptionsItem>
        </OptionsSection>
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
      <SelectField {...args} value={value} onChange={handleSelection}>
        <OptionsItem id={koalaId} textValue='Koala'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Koala</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id={kangarooId} textValue='Kangaroo'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Kangaroo</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id={platypusId} textValue='Platypus'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Platypus</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id={bisonId} textValue='Bison'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Bison</OptionsItemLabel>
        </OptionsItem>
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
        <OptionsItem key={item.id} textValue={item.name}>
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <OptionsItemLabel>{item.name}</OptionsItemLabel>
        </OptionsItem>
      ))}
    </SelectField>
  ),
};
