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
import { type ReactNode, useState } from 'react';
import { Icon } from '../icon';
import { OptionsItem } from '../options/item';
import { OptionsItemContent } from '../options/item-content';
import { OptionsItemDescription } from '../options/item-description';
import { OptionsItemLabel } from '../options/item-label';
import { OptionsSection } from '../options/section';
import { ComboBoxField } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/ComboBoxField',
  component: ComboBoxField,
  args: {
    description: 'Helper text',
    errorMessage: '',
    label: 'Label',
    inputProps: {
      placeholder: 'Placeholder',
    },
    size: 'medium',
    layoutOptions: {
      estimatedRowHeight: 46,
    },
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    allowsCustomValue: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
} satisfies Meta<typeof ComboBoxField>;

export default meta;
type Story = StoryObj<typeof meta>;

interface CustomOptionsItem {
  id: number | string;
  name: string;
  description?: string;
  isDisabled?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  children?: CustomOptionsItem[];
}

const items: CustomOptionsItem[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'Red Panda',
    description: 'Tree-dwelling mammal',
  },
  {
    id: 2,
    prefixIcon: <Placeholder />,
    name: 'Cat',
    description: 'Furry house pet',
    isDisabled: true,
  },
  {
    id: 3,
    prefixIcon: <Placeholder />,
    name: 'Dog',
    description: 'Loyal companion',
  },
  {
    id: 4,
    prefixIcon: <Placeholder />,
    name: 'Aardvark',
    description: 'Ant-eating nocturnal',
  },
  {
    id: 5,
    name: 'Kangaroo',
    description: 'Pouch-bearing jumper',
  },
  {
    id: 6,
    prefixIcon: <Placeholder />,
    name: 'Snake',
    description: 'Slithering reptile',
  },
];

const itemsWithSections: CustomOptionsItem[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'North American Birds',
    children: [
      {
        id: 2,
        prefixIcon: <Placeholder />,
        name: 'Blue jay',
      },
      {
        id: 3,
        prefixIcon: <Placeholder />,
        name: 'Gray catbird',
      },
      {
        id: 4,
        prefixIcon: <Placeholder />,
        name: 'Black-capped chickadee',
      },
      {
        id: 5,
        prefixIcon: <Placeholder />,
        name: 'Song sparrow',
      },
    ],
  },
  {
    id: 6,
    prefixIcon: <Placeholder />,
    name: 'African Birds',
    children: [
      {
        id: 6,
        prefixIcon: <Placeholder />,
        name: 'Lilac-breasted roller',
      },
      {
        id: 7,
        prefixIcon: <Placeholder />,
        name: 'Hornbill',
      },
    ],
  },
];

export const Default: Story = {
  render: ({ children, ...args }) => (
    <ComboBoxField<CustomOptionsItem> {...args} defaultItems={items}>
      {(item) => (
        <OptionsItem
          key={item.id}
          textValue={item.name}
          isDisabled={item.isDisabled}
        >
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <OptionsItemContent>
            <OptionsItemLabel>{item.name}</OptionsItemLabel>
            {item.description && (
              <OptionsItemDescription>
                {item.description}
              </OptionsItemDescription>
            )}
          </OptionsItemContent>
        </OptionsItem>
      )}
    </ComboBoxField>
  ),
};

export const WithDynamicSections: Story = {
  args: {
    ...Default.args,
    layoutOptions: {
      rowHeight: 32,
    },
  },
  render: ({ children, ...args }) => (
    <ComboBoxField<CustomOptionsItem>
      {...args}
      defaultItems={itemsWithSections}
    >
      {(section) => (
        <OptionsSection header={section.name} items={section.children}>
          {(item) => (
            <OptionsItem key={item.id} textValue={item.name}>
              {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
              <OptionsItemContent>
                <OptionsItemLabel>{item.name}</OptionsItemLabel>
                {item.description && (
                  <OptionsItemDescription>
                    {item.description}
                  </OptionsItemDescription>
                )}
              </OptionsItemContent>
            </OptionsItem>
          )}
        </OptionsSection>
      )}
    </ComboBoxField>
  ),
};

export const WithStaticSections: Story = {
  args: {
    ...Default.args,
    layoutOptions: {
      rowHeight: 32,
    },
  },
  render: ({ children, ...args }) => (
    <ComboBoxField {...args}>
      <OptionsSection header='North American Birds'>
        <OptionsItem textValue='Blue Jay'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Blue Jay</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem textValue='Gray catbird'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Gray catbird</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem textValue='Black-capped chickadee'>
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
    </ComboBoxField>
  ),
};

const manyItems: { id: number; name: string; prefixIcon: ReactNode }[] = [];
for (let i = 0; i < 5000; i++) {
  manyItems.push({ id: i, name: `Item ${i}`, prefixIcon: <Placeholder /> });
}

export const WithManyItems: Story = {
  args: {
    ...Default.args,
    layoutOptions: {
      rowHeight: 32,
    },
  },
  render: ({ children, ...args }) => (
    <ComboBoxField {...args}>
      {manyItems.map((item) => (
        <OptionsItem key={item.id} textValue={item.name}>
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <OptionsItemLabel>{item.name}</OptionsItemLabel>
        </OptionsItem>
      ))}
    </ComboBoxField>
  ),
};

export const WithCustomValue: Story = {
  args: {
    allowsCustomValue: true,
  },
  render: ({ children, ...args }) => {
    const [customValue, setCustomValue] = useState('');
    return (
      <div className='space-y-l'>
        <ComboBoxField<CustomOptionsItem>
          {...args}
          defaultItems={items}
          onInputChange={(value) => setCustomValue(value)}
        >
          {(item) => (
            <OptionsItem
              key={item.id}
              textValue={item.name}
              isDisabled={item.isDisabled}
            >
              {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
              <OptionsItemContent>
                <OptionsItemLabel>{item.name}</OptionsItemLabel>
                {item.description && (
                  <OptionsItemDescription>
                    {item.description}
                  </OptionsItemDescription>
                )}
              </OptionsItemContent>
            </OptionsItem>
          )}
        </ComboBoxField>
        <div className='space-y-s text-body-s'>
          <div className='fg-primary-muted'>
            Setting 'allowsCustomValue' to true enables you to capture a custom
            value that will persist on blur
          </div>
          <div>customValue: {customValue}</div>
        </div>
      </div>
    );
  },
};
