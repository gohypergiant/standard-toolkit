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

import type { MenuItem } from '@/types/types';
import Placeholder from '@accelint/icons/placeholder';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { ComboBox } from './index';

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

interface CustomMenuItem extends MenuItem {
  isDisabled?: boolean;
}

const items: CustomMenuItem[] = [
  {
    id: 1,
    icon: <Placeholder />,
    name: 'Red Panda',
    description: 'Tree-dwelling mammal',
  },
  {
    id: 2,
    icon: <Placeholder />,
    name: 'Cat',
    description: 'Furry house pet',
    isDisabled: true,
  },
  {
    id: 3,
    icon: <Placeholder />,
    name: 'Dog',
    description: 'Loyal companion',
  },
  {
    id: 4,
    icon: <Placeholder />,
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
    icon: <Placeholder />,
    name: 'Snake',
    description: 'Slithering reptile',
  },
];

const itemsWithSections: CustomMenuItem[] = [
  {
    id: 1,
    icon: <Placeholder />,
    name: 'North American Birds',
    children: [
      {
        id: 2,
        icon: <Placeholder />,
        name: 'Blue jay',
      },
      {
        id: 3,
        icon: <Placeholder />,
        name: 'Gray catbird',
      },
      {
        id: 4,
        icon: <Placeholder />,
        name: 'Black-capped chickadee',
      },
      {
        id: 5,
        icon: <Placeholder />,
        name: 'Song sparrow',
      },
    ],
  },
  {
    id: 6,
    icon: <Placeholder />,
    name: 'African Birds',
    children: [
      {
        id: 6,
        icon: <Placeholder />,
        name: 'Lilac-breasted roller',
      },
      {
        id: 7,
        icon: <Placeholder />,
        name: 'Hornbill',
      },
    ],
  },
];

export const Default: Story = {
  render: ({ children, ...args }) => (
    <ComboBox<CustomMenuItem> {...args} defaultItems={items}>
      {(item) => (
        <ComboBox.Item
          key={item.id}
          icon={item.icon}
          name={item.name}
          description={item.description}
          isDisabled={item.isDisabled}
        />
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
    <ComboBox<CustomMenuItem> {...args} defaultItems={itemsWithSections}>
      {(section) => (
        <ComboBox.Section header={section.name} items={section.children}>
          {(item) => (
            <ComboBox.Item
              key={item.id}
              icon={item.icon}
              name={item.name}
              description={item.description}
            />
          )}
        </ComboBox.Section>
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
      <ComboBox.Section header='North American Birds'>
        <ComboBox.Item icon={<Placeholder />} name='Blue Jay'>
          Blue Jay
        </ComboBox.Item>
        <ComboBox.Item icon={<Placeholder />} name='Gray catbird'>
          Gray catbird
        </ComboBox.Item>
        <ComboBox.Item icon={<Placeholder />} name='Black-capped chickadee'>
          Black-capped chickadee
        </ComboBox.Item>
        <ComboBox.Item icon={<Placeholder />} name='Song Sparrow'>
          Song Sparrow
        </ComboBox.Item>
      </ComboBox.Section>
      <ComboBox.Section header='African Birds'>
        <ComboBox.Item icon={<Placeholder />} name='Lilac-breasted roller'>
          Lilac-breasted roller
        </ComboBox.Item>
        <ComboBox.Item icon={<Placeholder />} name='Hornbill'>
          Hornbill
        </ComboBox.Item>
      </ComboBox.Section>
    </ComboBox>
  ),
};

const manyItems: { id: number; name: string; icon: ReactNode }[] = [];
for (let i = 0; i < 5000; i++) {
  manyItems.push({ id: i, name: `Item ${i}`, icon: <Placeholder /> });
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
        <ComboBox.Item key={item.id} icon={item.icon} name={item.name}>
          {item.name}
        </ComboBox.Item>
      ))}
    </ComboBox>
  ),
};
