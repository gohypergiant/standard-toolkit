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
import type { MenuItem } from '@/types/types';
import type { Meta, StoryObj } from '@storybook/react';
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

export const Test: Story = {
  render: ({ children, ...args }) => (
    <ComboBox {...args} defaultItems={items}>
      <ComboBox.Item
        icon={<Placeholder />}
        name='Red Panda'
        isDisabled
        description='Some ice cream'
      >
        Red Panda
      </ComboBox.Item>
      <ComboBox.Item
        icon={<Placeholder />}
        name='Cat'
        description='Some ice cream'
      >
        Cat
      </ComboBox.Item>
      <ComboBox.Item
        icon={<Placeholder />}
        name='Dog'
        description='Some ice cream'
      >
        Dog
      </ComboBox.Item>
      <ComboBox.Item
        icon={<Placeholder />}
        name='Aardvark'
        description='Some ice cream'
      >
        Aardvark
      </ComboBox.Item>
      <ComboBox.Item
        icon={<Placeholder />}
        name='Kangaroo'
        description='Some ice cream'
      >
        Kangaroo
      </ComboBox.Item>
      <ComboBox.Item
        icon={<Placeholder />}
        name='Snake'
        description='Some ice cream'
      >
        Snake
      </ComboBox.Item>
    </ComboBox>
  ),
};
