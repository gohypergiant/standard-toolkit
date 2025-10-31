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

import { uuid } from '@accelint/core';
import { ExpandLeftPanel, Placeholder } from '@accelint/icons';
import React, { type ComponentProps, useState } from 'react';
import { Heading, Text } from 'react-aria-components';
import { Avatar } from '../avatar';
import { Button } from '../button';
import { Divider } from '../divider';
import { DrawerLayout } from '../drawer/layout';
import { DrawerLayoutMain } from '../drawer/layout-main';
import { Icon } from '../icon';
import { SidenavAvatar } from './avatar';
import { SidenavContent } from './content';
import { SidenavFooter } from './footer';
import { SidenavHeader } from './header';
import { Sidenav } from './index';
import { SidenavItem } from './item';
import { SidenavLink } from './link';
import { SidenavMenu } from './menu';
import { SidenavMenuItem } from './menu-item';
import { SidenavTrigger } from './trigger';
import type { Meta, StoryObj } from '@storybook/react';

// TODO: more work is needed to clean up the types for easier adoption of Storybook patterns
// this story has a mix of controls from different components
type SidenavWithLayoutArgs = ComponentProps<typeof Sidenav> & {
  pushLayout?: boolean;
};

const meta: Meta<SidenavWithLayoutArgs> = {
  title: 'Components/Sidenav',
  component: Sidenav,
  args: {
    pushLayout: true,
    isHiddenWhenClosed: false,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<SidenavWithLayoutArgs>;

const sections = {
  'Title A': [
    {
      id: uuid(),
      text: 'Nav item',
      disabled: true,
    },
    {
      id: uuid(),
      text: 'Nav item',
      disabled: false,
    },
    {
      id: uuid(),
      text: 'Nav item',
      disabled: false,
    },
  ],
};

const id = uuid();

export const Default: Story = {
  render: ({ isHiddenWhenClosed, pushLayout }) => {
    const [activeItem, setActiveItem] = useState(
      sections['Title A'][2]?.id ?? null,
    );
    return (
      <div className='h-screen bg-surface-raised text-default-light'>
        <DrawerLayout push={pushLayout ? 'left' : undefined}>
          <DrawerLayoutMain>
            <nav className='flex items-center bg-surface-default p-m'>
              <SidenavTrigger for={id}>
                <Button variant='icon' size='large'>
                  <Icon>
                    <ExpandLeftPanel className='' />
                  </Icon>
                </Button>
              </SidenavTrigger>
            </nav>
          </DrawerLayoutMain>
          <Sidenav id={id} isHiddenWhenClosed={isHiddenWhenClosed}>
            <SidenavHeader>
              <SidenavAvatar>
                <Icon>
                  <Placeholder />
                </Icon>
                <Heading>Application Header</Heading>
                <Text>Secondary Text</Text>
              </SidenavAvatar>
            </SidenavHeader>
            <SidenavContent>
              {Object.entries(sections).map(([section, items], i) => (
                <React.Fragment key={section}>
                  <Heading>{section}</Heading>
                  {items.map((item) => (
                    <SidenavItem
                      key={item.id}
                      textValue={item.text}
                      isDisabled={item.disabled}
                      isSelected={activeItem === item.id}
                      onPress={() =>
                        setActiveItem(activeItem === item.id ? null : item.id)
                      }
                    >
                      <Icon>
                        <Placeholder />
                      </Icon>
                      <Text>{item.text}</Text>
                    </SidenavItem>
                  ))}
                  {i !== Object.entries(sections).length - 1 && <Divider />}
                </React.Fragment>
              ))}
              <Divider />
              <Heading>External</Heading>
              <SidenavLink href='#' textValue='Nav Link'>
                <Icon>
                  <Placeholder />
                </Icon>
                <Text>Nav Link</Text>
              </SidenavLink>
              <SidenavLink isDisabled href='#' textValue='Nav Link'>
                <Icon>
                  <Placeholder />
                </Icon>
                <Text>Nav Link</Text>
              </SidenavLink>

              <Divider />
              <Heading>Menu</Heading>
              <SidenavMenu
                icon={
                  <Icon>
                    <Placeholder />
                  </Icon>
                }
                title='Nav Item'
              >
                <SidenavMenuItem>
                  <Text>Sub item</Text>
                </SidenavMenuItem>
                <SidenavMenuItem>
                  <Text>Sub item</Text>
                </SidenavMenuItem>
                <SidenavMenuItem isDisabled>
                  <Text>Sub item</Text>
                </SidenavMenuItem>
              </SidenavMenu>
            </SidenavContent>
            <SidenavFooter>
              <SidenavItem textValue='Application Footer'>
                <SidenavAvatar>
                  <Avatar
                    imageProps={{
                      alt: 'Dog',
                      src: 'https://placedog.net/100x100?id=144',
                    }}
                  />
                  <Heading>Application Footer</Heading>
                  <Text>Secondary Text</Text>
                </SidenavAvatar>
              </SidenavItem>
            </SidenavFooter>
          </Sidenav>
        </DrawerLayout>
      </div>
    );
  },
};
