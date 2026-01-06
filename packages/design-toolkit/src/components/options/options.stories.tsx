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
import { useState } from 'react';
import {
  ListLayout as AriaListLayout,
  Virtualizer as AriaVirtualizer,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Options } from './';
import { OptionsItem } from './item';
import { OptionsItemContent } from './item-content';
import { OptionsItemDescription } from './item-description';
import { OptionsItemLabel } from './item-label';
import { OptionsSection } from './section';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import type { Selection } from 'react-aria-components';
import type { OptionsItemProps } from './types';

const meta = {
  title: 'Components/Options',
  component: Options,
  args: {
    size: 'large',
    selectionMode: 'none',
  },
  argTypes: {
    size: {
      control: 'select',
    },
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
  },
} satisfies Meta<typeof Options>;

export default meta;
type Story = StoryObj<typeof meta>;

interface CustomOptionsItem {
  id: number;
  name: string;
  description?: string;
  isDisabled?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  children?: CustomOptionsItem[];
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  color?: OptionsItemProps<any>['color'];
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
    color: 'serious',
  },
  {
    id: 4,
    prefixIcon: <Placeholder />,
    name: 'Aardvark',
    description: 'Ant-eating nocturnal',
    color: 'critical',
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
    <Options {...args} items={items}>
      {(item) => (
        <OptionsItem
          key={item.id}
          id={item.id}
          textValue={item.name}
          isDisabled={item.isDisabled}
          color={item.color}
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
          {item.suffixIcon && <Icon>{item.suffixIcon}</Icon>}
        </OptionsItem>
      )}
    </Options>
  ),
};

export const WithDynamicSections: Story = {
  render: ({ children, ...args }) => (
    <Options {...args} items={itemsWithSections}>
      {(section) => (
        <OptionsSection header={section.name} items={section.children}>
          {({ children, ...item }) => (
            <OptionsItem key={item.id} id={item.id} textValue={item.name}>
              {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
              <OptionsItemContent>
                <OptionsItemLabel>{item.name}</OptionsItemLabel>
                {item.description && (
                  <OptionsItemDescription>
                    {item.description}
                  </OptionsItemDescription>
                )}
              </OptionsItemContent>
              {item.suffixIcon && <Icon>{item.suffixIcon}</Icon>}
            </OptionsItem>
          )}
        </OptionsSection>
      )}
    </Options>
  ),
};

export const WithStaticSections: Story = {
  render: ({ children, ...args }) => (
    <Options
      {...args}
      selectedKeys={new Set(['selected-1', 'selected-2', 'selected-3'])}
      selectionMode='multiple'
    >
      <OptionsSection
        header='North American Birds'
        classNames={{ section: 'w-[200px]' }}
      >
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
          <OptionsItemDescription>A cool bird</OptionsItemDescription>
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
        <OptionsItem id='selected-1' textValue='Gray catbird' color='serious'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Gray catbird</OptionsItemLabel>
          <OptionsItemDescription>A cool bird</OptionsItemDescription>
        </OptionsItem>
        <OptionsItem
          id='selected-2'
          textValue='Black-capped chickadee'
          color='critical'
        >
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemLabel>Black-capped chickadee</OptionsItemLabel>
        </OptionsItem>
        <OptionsItem id='selected-3' textValue='Song Sparrow'>
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
    </Options>
  ),
};

const manyItems = Array.from({ length: 5000 }, (_, index) => ({
  id: index,
  name: `Item ${index}`,
  icon: <Placeholder />,
}));

export const Virtualized: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[200px]'>
      <AriaVirtualizer
        layout={AriaListLayout}
        layoutOptions={{ rowHeight: 32 }}
      >
        <Options {...args}>
          {manyItems.map((item) => (
            <OptionsItem key={item.id} id={item.id} textValue={item.name}>
              {item.icon && <Icon>{item.icon}</Icon>}
              <OptionsItemLabel>{item.name}</OptionsItemLabel>
            </OptionsItem>
          ))}
        </Options>
      </AriaVirtualizer>
    </div>
  ),
};

export const WithSelectionState: Story = {
  args: {
    selectionMode: 'multiple',
  },
  render: ({ children, ...args }) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set([
        'selected-info',
        'selected-serious',
        'selected-critical',
        'disabled-selected',
      ]),
    );
    return (
      <Options
        {...args}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {/* Unselected - default state */}
        <OptionsItem id='unselected' textValue='Unselected Item'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Unselected Item</OptionsItemLabel>
            <OptionsItemDescription>
              Default unselected state
            </OptionsItemDescription>
          </OptionsItemContent>
        </OptionsItem>

        {/* Selected - info color (default) */}
        <OptionsItem id='selected-info' textValue='Selected Info'>
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Selected Info</OptionsItemLabel>
            <OptionsItemDescription>
              Selected with info color (default)
            </OptionsItemDescription>
          </OptionsItemContent>
        </OptionsItem>

        {/* Selected - serious color */}
        <OptionsItem
          id='selected-serious'
          textValue='Selected Serious'
          color='serious'
        >
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Selected Serious</OptionsItemLabel>
            <OptionsItemDescription>
              Selected with serious color
            </OptionsItemDescription>
          </OptionsItemContent>
        </OptionsItem>

        {/* Selected - critical color */}
        <OptionsItem
          id='selected-critical'
          textValue='Selected Critical'
          color='critical'
        >
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Selected Critical</OptionsItemLabel>
            <OptionsItemDescription>
              Selected with critical color
            </OptionsItemDescription>
          </OptionsItemContent>
        </OptionsItem>

        {/* Disabled - unselected */}
        <OptionsItem
          id='disabled-unselected'
          textValue='Disabled Unselected'
          isDisabled
        >
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Disabled Unselected</OptionsItemLabel>
            <OptionsItemDescription>
              Disabled and unselected
            </OptionsItemDescription>
          </OptionsItemContent>
        </OptionsItem>

        {/* Disabled - selected */}
        <OptionsItem
          id='disabled-selected'
          textValue='Disabled Selected'
          isDisabled
        >
          <Icon>
            <Placeholder />
          </Icon>
          <OptionsItemContent>
            <OptionsItemLabel>Disabled Selected</OptionsItemLabel>
            <OptionsItemDescription>
              Disabled but selected
            </OptionsItemDescription>
          </OptionsItemContent>
        </OptionsItem>
      </Options>
    );
  },
};
