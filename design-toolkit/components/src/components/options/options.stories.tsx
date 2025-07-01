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
import {
  ListLayout as AriaListLayout,
  Virtualizer as AriaVirtualizer,
} from 'react-aria-components';
import type { IOptionsItem } from '../options-item';
import { Options } from './index';

const meta: Meta<typeof Options> = {
  title: 'Components/Options',
  component: Options,
  args: {
    size: 'large',
    type: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Options>;

interface CustomOptionsItem extends IOptionsItem {
  isDisabled?: boolean;
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
    suffixIcon: <Placeholder />,
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
  args: {
    size: 'large',
    selectionBehavior: 'toggle',
    type: 'default',
  },

  render: ({ children, ...args }) => (
    <Options<CustomOptionsItem> {...args} items={items}>
      {(item) => (
        <Options.Item
          key={item.id}
          prefixIcon={item.prefixIcon}
          name={item.name}
          description={item.description}
          isDisabled={item.isDisabled}
          suffixIcon={item.suffixIcon}
        />
      )}
    </Options>
  ),
};

export const WithDynamicSections: Story = {
  args: {
    ...Default.args,
  },
  render: ({ children, ...args }) => (
    <Options<CustomOptionsItem> {...args} items={itemsWithSections}>
      {(section) => (
        <Options.Section header={section.name} items={section.children}>
          {({ children, ...item }) => <Options.Item key={item.id} {...item} />}
        </Options.Section>
      )}
    </Options>
  ),
};

export const WithStaticSections: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
  render: ({ children, ...args }) => (
    <Options {...args}>
      <Options.Section header='North American Birds' className='w-[200px]'>
        <Options.Item prefixIcon={<Placeholder />} name='Blue Jay'>
          Blue Jay
        </Options.Item>
        <Options.Item prefixIcon={<Placeholder />} name='Gray catbird'>
          Gray catbird
        </Options.Item>
        <Options.Item
          prefixIcon={<Placeholder />}
          name='Black-capped chickadee'
        >
          Black-capped chickadee
        </Options.Item>
        <Options.Item prefixIcon={<Placeholder />} name='Song Sparrow'>
          Song Sparrow
        </Options.Item>
      </Options.Section>
      <Options.Section header='African Birds'>
        <Options.Item prefixIcon={<Placeholder />} name='Lilac-breasted roller'>
          Lilac-breasted roller
        </Options.Item>
        <Options.Item prefixIcon={<Placeholder />} name='Hornbill'>
          Hornbill
        </Options.Item>
      </Options.Section>
    </Options>
  ),
};

const manyItems: { id: number; name: string; icon: ReactNode }[] = [];
for (let i = 0; i < 5000; i++) {
  manyItems.push({ id: i, name: `Item ${i}`, icon: <Placeholder /> });
}

export const Virtualized: Story = {
  args: {
    ...Default.args,
  },
  render: ({ children, ...args }) => (
    <div className='w-[200px]'>
      <AriaVirtualizer
        layout={AriaListLayout}
        layoutOptions={{ rowHeight: 32 }}
      >
        <Options {...args}>
          {manyItems.map((item) => (
            <Options.Item key={item.id} prefixIcon={item.icon} name={item.name}>
              {item.name}
            </Options.Item>
          ))}
        </Options>
      </AriaVirtualizer>
    </div>
  ),
};
