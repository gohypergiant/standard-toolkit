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
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { Icon } from '../icon';
import { Options } from '../options';
import { ComboBox } from './';

const meta: Meta<typeof ComboBox> = {
  title: 'Components/ComboBox',
  component: ComboBox,
  args: {
    className: '',
    description: 'Helper text',
    errorMessage: 'Error description',
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: true,
    label: 'Label',
    placeholder: 'Placeholder',
    size: 'medium',
    menuTrigger: 'focus',
    autoFocus: true,
    layoutOptions: {
      estimatedRowHeight: 46,
    },
  },
  argTypes: {
    className: { type: 'string' },
    size: { options: ['small', 'medium'], control: 'select' },
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

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
    <ComboBox<CustomOptionsItem> {...args} defaultItems={items}>
      {(item) => (
        <Options.Item
          key={item.id}
          textValue={item.name}
          isDisabled={item.isDisabled}
        >
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <Options.Item.Content>
            <Options.Item.Label>{item.name}</Options.Item.Label>
            {item.description && (
              <Options.Item.Description>
                {item.description}
              </Options.Item.Description>
            )}
          </Options.Item.Content>
        </Options.Item>
      )}
    </ComboBox>
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
    <ComboBox<CustomOptionsItem> {...args} defaultItems={itemsWithSections}>
      {(section) => (
        <Options.Section header={section.name} items={section.children}>
          {(item) => (
            <Options.Item key={item.id} textValue={item.name}>
              {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
              <Options.Item.Content>
                <Options.Item.Label>{item.name}</Options.Item.Label>
                {item.description && (
                  <Options.Item.Description>
                    {item.description}
                  </Options.Item.Description>
                )}
              </Options.Item.Content>
            </Options.Item>
          )}
        </Options.Section>
      )}
    </ComboBox>
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
    <ComboBox {...args}>
      <Options.Section header='North American Birds'>
        <Options.Item textValue='Blue Jay'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Blue Jay</Options.Item.Label>
        </Options.Item>
        <Options.Item textValue='Gray catbird'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Gray catbird</Options.Item.Label>
        </Options.Item>
        <Options.Item textValue='Black-capped chickadee'>
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
    </ComboBox>
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
    <ComboBox {...args}>
      {manyItems.map((item) => (
        <Options.Item key={item.id} textValue={item.name}>
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <Options.Item.Label>{item.name}</Options.Item.Label>
        </Options.Item>
      ))}
    </ComboBox>
  ),
};
